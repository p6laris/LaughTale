using System;
using System.Collections.Generic;
using System.Collections.Immutable;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.Mvc.ViewEngines;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using Microsoft.AspNetCore.Razor.TagHelpers;
using Microsoft.CodeAnalysis;
using Microsoft.CodeAnalysis.CSharp;
using Microsoft.CodeAnalysis.Diagnostics;
using Microsoft.Extensions.DependencyInjection;
using LaughTale.Core.Extensions;
using LaughTale.Generators;
using Xunit;

namespace LaughTale.Tests.Generators;

/// <summary>
/// ROADMAP.v5.md Part B — covers IslandGenerator.Manifest.cs, the manifest-consumption half of the
/// island-discovery pipeline: an external islands.manifest.g.json (produced by a Node build step
/// scanning a user's own Islands/**/*.tsx files) is merged into the SAME generator pipeline as
/// [Island]-attributed C# props records and reuses GenerateTagHelper unchanged. Follows the same
/// conventions as FormControlEmissionTests.cs / GeneratedIslandAuthorizationTests.cs: drive
/// IslandGenerator via CSharpGeneratorDriver, then emit+load the resulting assembly to instantiate and
/// behaviorally test the real generated TagHelper rather than pattern-matching generated source text.
/// </summary>
public class IslandManifestGeneratorTests
{
    /// <summary>
    /// Minimal AdditionalText implementation for feeding an in-memory manifest string into
    /// CSharpGeneratorDriver, matching how a real MSBuild &lt;AdditionalFiles&gt; item would be seen by
    /// the generator without needing any real file on disk or MSBuild wiring to exist.
    /// </summary>
    private sealed class InMemoryAdditionalText : AdditionalText
    {
        private readonly string _text;
        public InMemoryAdditionalText(string path, string text) { Path = path; _text = text; }
        public override string Path { get; }
        public override Microsoft.CodeAnalysis.Text.SourceText GetText(CancellationToken ct = default) =>
            Microsoft.CodeAnalysis.Text.SourceText.From(_text, System.Text.Encoding.UTF8);
    }

    /// <summary>Test double for AnalyzerConfigOptionsProvider, used to verify the RootNamespace read.</summary>
    private sealed class TestAnalyzerConfigOptions : AnalyzerConfigOptions
    {
        private readonly IReadOnlyDictionary<string, string> _values;
        public TestAnalyzerConfigOptions(IReadOnlyDictionary<string, string> values) => _values = values;
        public override bool TryGetValue(string key, out string value) => _values.TryGetValue(key, out value!);
    }

    private sealed class TestAnalyzerConfigOptionsProvider : AnalyzerConfigOptionsProvider
    {
        public TestAnalyzerConfigOptionsProvider(IReadOnlyDictionary<string, string> globalOptions) =>
            GlobalOptions = new TestAnalyzerConfigOptions(globalOptions);
        public override AnalyzerConfigOptions GlobalOptions { get; }
        public override AnalyzerConfigOptions GetOptions(SyntaxTree tree) => GlobalOptions;
        public override AnalyzerConfigOptions GetOptions(AdditionalText textFile) => GlobalOptions;
    }

    private const string ValidManifestJson = @"
{
  ""$schema"": ""https://laughtale.dev/schemas/islands-manifest-v1.json"",
  ""schemaVersion"": 1,
  ""generatedAtUtc"": ""2026-09-14T18:30:00Z"",
  ""islandsRoot"": ""Islands"",
  ""islands"": [
    {
      ""name"": ""user-card"",
      ""typeName"": ""UserCardProps"",
      ""sourcePath"": ""Islands/UserCard.tsx"",
      ""scriptKind"": ""tsx"",
      ""contentHash"": ""sha256:9f2c1a4b3e7d"",
      ""outputChunk"": ""js/islands/UserCard-4KTX2QGB.js"",
      ""props"": [
        { ""tsName"": ""userName"",  ""csharpName"": ""UserName"",  ""tsType"": ""string"", ""csharpType"": ""string"",  ""optional"": false },
        { ""tsName"": ""avatarUrl"", ""csharpName"": ""AvatarUrl"", ""tsType"": ""string"", ""csharpType"": ""string?"", ""optional"": true  }
      ],
      ""diagnostics"": []
    }
  ]
}";

    private const string DialogManifestJson = @"
{
  ""schemaVersion"": 1,
  ""islandsRoot"": ""Islands"",
  ""islands"": [
    {
      ""name"": ""dialog"",
      ""typeName"": ""CustomDialogProps"",
      ""sourcePath"": ""Islands/CustomDialog.tsx"",
      ""props"": [],
      ""diagnostics"": []
    }
  ]
}";

    private const string AttributeIslandOnlySource = @"
using LaughTale.Core.Attributes;

namespace TestNamespace;

[Island(""solo-island"")]
public record SoloIslandProps(string Title);
";

    private static (GeneratorDriverRunResult RunResult, ImmutableArray<Diagnostic> Diagnostics) RunGenerator(
        string source, AdditionalText? manifestText = null, AnalyzerConfigOptionsProvider? optionsProvider = null)
    {
        var syntaxTree = CSharpSyntaxTree.ParseText(source);
        var references = AppDomain.CurrentDomain.GetAssemblies()
            .Where(a => !a.IsDynamic && !string.IsNullOrWhiteSpace(a.Location))
            .Select(a => MetadataReference.CreateFromFile(a.Location))
            .Cast<MetadataReference>();

        var compilation = CSharpCompilation.Create(
            "ManifestTestCompilation_" + Guid.NewGuid().ToString("N"),
            new[] { syntaxTree },
            references,
            new CSharpCompilationOptions(OutputKind.DynamicallyLinkedLibrary));

        var generator = new IslandGenerator();
        var additionalTexts = manifestText is null ? ImmutableArray<AdditionalText>.Empty : ImmutableArray.Create(manifestText);

        GeneratorDriver driver = CSharpGeneratorDriver.Create(
            generators: ImmutableArray.Create(generator.AsSourceGenerator()),
            additionalTexts: additionalTexts,
            parseOptions: (CSharpParseOptions)syntaxTree.Options,
            optionsProvider: optionsProvider);

        driver = driver.RunGeneratorsAndUpdateCompilation(compilation, out _, out var diagnostics);
        return (driver.GetRunResult(), diagnostics);
    }

    /// <summary>
    /// Compiles and emits the generated source to an in-memory assembly so the generated TagHelper type
    /// can be instantiated and its actual rendered TagHelperOutput inspected, instead of pattern-matching
    /// the generator's raw output text.
    /// </summary>
    private static (Assembly Assembly, ImmutableArray<Diagnostic> Diagnostics) CompileAndLoad(
        string source, AdditionalText? manifestText, string assemblyName)
    {
        var syntaxTree = CSharpSyntaxTree.ParseText(source);
        var references = AppDomain.CurrentDomain.GetAssemblies()
            .Where(a => !a.IsDynamic && !string.IsNullOrWhiteSpace(a.Location))
            .Select(a => MetadataReference.CreateFromFile(a.Location))
            .Cast<MetadataReference>();

        var compilation = CSharpCompilation.Create(
            assemblyName,
            new[] { syntaxTree },
            references,
            new CSharpCompilationOptions(OutputKind.DynamicallyLinkedLibrary));

        var generator = new IslandGenerator();
        var additionalTexts = manifestText is null ? ImmutableArray<AdditionalText>.Empty : ImmutableArray.Create(manifestText);

        GeneratorDriver driver = CSharpGeneratorDriver.Create(
            generators: ImmutableArray.Create(generator.AsSourceGenerator()),
            additionalTexts: additionalTexts,
            parseOptions: (CSharpParseOptions)syntaxTree.Options);

        driver = driver.RunGeneratorsAndUpdateCompilation(compilation, out var outputCompilation, out var diagnostics);

        using var ms = new MemoryStream();
        var emitResult = outputCompilation.Emit(ms);
        Assert.True(emitResult.Success, string.Join("\n", emitResult.Diagnostics.Select(d => d.ToString())));
        ms.Seek(0, SeekOrigin.Begin);
        return (Assembly.Load(ms.ToArray()), diagnostics);
    }

    private static ViewContext CreateViewContext()
    {
        var services = new ServiceCollection();
        services.AddLogging();
        services.AddLaughTale(o => o.Refresh.AllowUndeclaredIslands = true);
        var provider = services.BuildServiceProvider();
        var httpContext = new DefaultHttpContext { RequestServices = provider };
        var actionContext = new Microsoft.AspNetCore.Mvc.ActionContext(
            httpContext,
            new Microsoft.AspNetCore.Routing.RouteData(),
            new Microsoft.AspNetCore.Mvc.Abstractions.ActionDescriptor());
        var viewData = new ViewDataDictionary(new EmptyModelMetadataProvider(), new ModelStateDictionary());
        return new ViewContext(
            actionContext,
            new MockView(),
            viewData,
            new TempDataDictionary(httpContext, new MockTempDataProvider()),
            TextWriter.Null,
            new HtmlHelperOptions());
    }

    private class MockView : IView
    {
        public string Path => "test.cshtml";
        public Task RenderAsync(ViewContext context) => Task.CompletedTask;
    }

    private class MockTempDataProvider : ITempDataProvider
    {
        public IDictionary<string, object> LoadTempData(HttpContext context) => new Dictionary<string, object>();
        public void SaveTempData(HttpContext context, IDictionary<string, object> values) { }
    }

    // ── 1. Valid single-island manifest: behavioral, not string-matching ───────────────────────────

    [Fact]
    public void ValidManifest_NoDiagnosticErrors()
    {
        var manifestText = new InMemoryAdditionalText("islands.manifest.g.json", ValidManifestJson);
        var (_, diagnostics) = RunGenerator("namespace TestNamespace;\n", manifestText);
        Assert.Empty(diagnostics.Where(d => d.Severity == DiagnosticSeverity.Error));
    }

    [Fact]
    public async Task ValidManifest_EmittedTagHelper_ProducesCorrectDataIslandAndDataProps()
    {
        var manifestText = new InMemoryAdditionalText("islands.manifest.g.json", ValidManifestJson);
        var (assembly, diagnostics) = CompileAndLoad(
            "namespace TestNamespace;\n", manifestText, "ValidManifestAssembly_" + Guid.NewGuid().ToString("N"));
        Assert.Empty(diagnostics.Where(d => d.Severity == DiagnosticSeverity.Error));

        // GetGeneratedNames: TypeName "UserCardProps" -> baseName "UserCard" -> "IslandUserCardTagHelper".
        var tagHelperType = assembly.GetTypes().Single(t => t.Name == "IslandUserCardTagHelper");
        Assert.True(typeof(LaughTale.Components.TagHelpers.IslandTagHelperBase).IsAssignableFrom(tagHelperType));

        var helper = Activator.CreateInstance(tagHelperType)!;
        tagHelperType.GetProperty("ViewContext")!.SetValue(helper, CreateViewContext());
        tagHelperType.GetProperty("UserName")!.SetValue(helper, "Ada Lovelace");
        tagHelperType.GetProperty("AvatarUrl")!.SetValue(helper, "https://example.com/ada.png");

        var context = new TagHelperContext(new TagHelperAttributeList(), new Dictionary<object, object>(), Guid.NewGuid().ToString("N"));
        var output = new TagHelperOutput(
            "user-card-island",
            new TagHelperAttributeList(),
            (useCachedResult, encoder) => Task.FromResult<TagHelperContent>(new DefaultTagHelperContent()));

        var processAsync = tagHelperType.GetMethod("ProcessAsync", new[] { typeof(TagHelperContext), typeof(TagHelperOutput) })!;
        await (Task)processAsync.Invoke(helper, new object[] { context, output })!;

        Assert.Equal("user-card", output.Attributes["data-island"].Value);
        var propsJson = output.Attributes["data-props"].Value!.ToString();
        Assert.Contains("\"userName\":\"Ada Lovelace\"", propsJson);
        Assert.Contains("\"avatarUrl\":\"https://example.com/ada.png\"", propsJson);
    }

    [Fact]
    public void ManifestIsland_FallsBackToDefaultNamespace_WhenRootNamespaceUnavailable()
    {
        var manifestText = new InMemoryAdditionalText("islands.manifest.g.json", ValidManifestJson);
        var (runResult, diagnostics) = RunGenerator("namespace TestNamespace;\n", manifestText);
        Assert.Empty(diagnostics.Where(d => d.Severity == DiagnosticSeverity.Error));

        var generated = runResult.GeneratedTrees.FirstOrDefault(t => t.FilePath.Contains("FromIslandsManifest"));
        Assert.NotNull(generated);
        Assert.Contains("namespace LaughTale.Generated.Islands.TagHelpers;", generated.ToString());
    }

    [Fact]
    public void ManifestIsland_UsesRootNamespaceForGeneratedNamespace_WhenAvailable()
    {
        var manifestText = new InMemoryAdditionalText("islands.manifest.g.json", ValidManifestJson);
        var optionsProvider = new TestAnalyzerConfigOptionsProvider(new Dictionary<string, string>
        {
            ["build_property.rootnamespace"] = "Acme.Widgets"
        });

        var (runResult, diagnostics) = RunGenerator("namespace TestNamespace;\n", manifestText, optionsProvider);
        Assert.Empty(diagnostics.Where(d => d.Severity == DiagnosticSeverity.Error));

        var generated = runResult.GeneratedTrees.FirstOrDefault(t => t.FilePath.Contains("FromIslandsManifest"));
        Assert.NotNull(generated);
        Assert.Contains("namespace Acme.Widgets.Islands.TagHelpers;", generated.ToString());
    }

    // ── 2. Manifest island name collides with an existing [Island(...)]-attributed C# type ────────

    [Fact]
    public void ManifestIslandCollidingWithAttributeIsland_ReportsDuplicateAndSkipsGeneration()
    {
        var source = @"
using LaughTale.Core.Attributes;

namespace TestNamespace;

[Island(""user-card"")]
public record ExistingUserCardProps(string Title);
";
        var manifestText = new InMemoryAdditionalText("islands.manifest.g.json", ValidManifestJson); // name: "user-card"

        var (runResult, diagnostics) = RunGenerator(source, manifestText);

        var duplicate = diagnostics.SingleOrDefault(d => d.Id == "LTI020");
        Assert.NotNull(duplicate);
        Assert.Equal(DiagnosticSeverity.Error, duplicate.Severity);
        Assert.Contains("ExistingUserCardProps", duplicate.GetMessage());
        Assert.Contains("user-card", duplicate.GetMessage());

        // No manifest-sourced TagHelper emitted for the colliding island name...
        Assert.DoesNotContain(runResult.GeneratedTrees, t => t.FilePath.Contains("FromIslandsManifest"));
        // ...but the attribute-driven island's own TagHelper is untouched and still generated.
        Assert.Contains(runResult.GeneratedTrees, t => t.FilePath.Contains("ExistingUserCardProps"));

        // Compilation still succeeds for everything else (CompileAndLoad asserts emitResult.Success).
        var (assembly, _) = CompileAndLoad(source, manifestText, "CollisionAssembly_" + Guid.NewGuid().ToString("N"));
        Assert.Contains(assembly.GetTypes(), t => t.Name == "IslandExistingUserCardTagHelper");
        Assert.DoesNotContain(assembly.GetTypes(), t => t.Name == "IslandUserCardTagHelper");
    }

    // ── 3. Manifest island name collides with a HandWrittenIslandNames entry ───────────────────────

    [Fact]
    public void ManifestIslandCollidingWithHandWrittenName_ReportsDuplicateAndSkipsGeneration()
    {
        var manifestText = new InMemoryAdditionalText("islands.manifest.g.json", DialogManifestJson); // name: "dialog"

        var (runResult, diagnostics) = RunGenerator("namespace TestNamespace;\n", manifestText);

        var duplicate = diagnostics.SingleOrDefault(d => d.Id == "LTI020");
        Assert.NotNull(duplicate);
        Assert.Equal(DiagnosticSeverity.Error, duplicate.Severity);
        Assert.Contains("hand-written", duplicate.GetMessage());

        Assert.DoesNotContain(runResult.GeneratedTrees, t => t.FilePath.Contains("FromIslandsManifest"));

        // Compilation still succeeds overall.
        var (_, emitDiagnostics) = CompileAndLoad("namespace TestNamespace;\n", manifestText, "HandWrittenCollisionAssembly_" + Guid.NewGuid().ToString("N"));
    }

    // ── 4. Malformed / missing-required-field manifest: never crashes the generator ────────────────

    [Fact]
    public void MalformedManifestJson_DoesNotCrashGenerator_AndAttributeIslandsStillGenerate()
    {
        var manifestText = new InMemoryAdditionalText("islands.manifest.g.json", "{ this is not valid json !!! ");

        var (runResult, diagnostics) = RunGenerator(AttributeIslandOnlySource, manifestText);

        // No unhandled-exception fallback diagnostic from Roslyn's own generator-driver safety net -
        // this generator's own try/catch is what handled it, not that outer net.
        Assert.DoesNotContain(diagnostics, d => d.Id == "CS8785");

        var malformed = diagnostics.SingleOrDefault(d => d.Id == "LTI021");
        Assert.NotNull(malformed);
        Assert.Equal(DiagnosticSeverity.Error, malformed.Severity);

        // Zero manifest-sourced islands...
        Assert.DoesNotContain(runResult.GeneratedTrees, t => t.FilePath.Contains("FromIslandsManifest"));
        // ...while the attribute-driven island in the same compilation still generates normally.
        Assert.Contains(runResult.GeneratedTrees, t => t.FilePath.Contains("SoloIslandProps"));
        Assert.Empty(diagnostics.Where(d => d.Severity == DiagnosticSeverity.Error && d.Id != "LTI021"));

        // And the whole thing still compiles and loads.
        var (assembly, _) = CompileAndLoad(AttributeIslandOnlySource, manifestText, "MalformedManifestAssembly_" + Guid.NewGuid().ToString("N"));
        Assert.Contains(assembly.GetTypes(), t => t.Name == "IslandSoloIslandTagHelper");
    }

    [Fact]
    public void EmptyManifestJson_ProducesZeroManifestIslands_NoDiagnosticErrors()
    {
        var manifestText = new InMemoryAdditionalText("islands.manifest.g.json", "{}");
        var (runResult, diagnostics) = RunGenerator(AttributeIslandOnlySource, manifestText);

        Assert.Empty(diagnostics.Where(d => d.Severity == DiagnosticSeverity.Error));
        Assert.DoesNotContain(runResult.GeneratedTrees, t => t.FilePath.Contains("FromIslandsManifest"));
        Assert.Contains(runResult.GeneratedTrees, t => t.FilePath.Contains("SoloIslandProps"));
    }

    [Fact]
    public void ManifestEntryMissingName_ReportsInvalidNameDiagnostic_SkipsOnlyThatEntry()
    {
        const string manifestJsonMissingName = @"
{
  ""schemaVersion"": 1,
  ""islandsRoot"": ""Islands"",
  ""islands"": [
    { ""typeName"": ""NoNameProps"", ""sourcePath"": ""Islands/NoName.tsx"", ""props"": [] }
  ]
}";
        var manifestText = new InMemoryAdditionalText("islands.manifest.g.json", manifestJsonMissingName);

        var (runResult, diagnostics) = RunGenerator(AttributeIslandOnlySource, manifestText);

        var invalidName = diagnostics.SingleOrDefault(d => d.Id == "LTI001");
        Assert.NotNull(invalidName);
        Assert.Equal(DiagnosticSeverity.Error, invalidName.Severity);

        Assert.DoesNotContain(runResult.GeneratedTrees, t => t.FilePath.Contains("FromIslandsManifest"));
        Assert.Contains(runResult.GeneratedTrees, t => t.FilePath.Contains("SoloIslandProps"));
    }

    [Fact]
    public void ManifestPropMissingRequiredField_SkipsOnlyThatProp_IslandStillGenerated()
    {
        const string manifestJsonBadProp = @"
{
  ""schemaVersion"": 1,
  ""islandsRoot"": ""Islands"",
  ""islands"": [
    {
      ""name"": ""partial-props-island"",
      ""typeName"": ""PartialPropsIslandProps"",
      ""sourcePath"": ""Islands/PartialPropsIsland.tsx"",
      ""props"": [
        { ""tsName"": ""title"", ""csharpName"": ""Title"", ""tsType"": ""string"", ""csharpType"": ""string"", ""optional"": false },
        { ""tsName"": ""badProp"", ""tsType"": ""string"", ""optional"": false }
      ],
      ""diagnostics"": []
    }
  ]
}";
        var manifestText = new InMemoryAdditionalText("islands.manifest.g.json", manifestJsonBadProp);
        var (runResult, diagnostics) = RunGenerator("namespace TestNamespace;\n", manifestText);

        var malformedProp = diagnostics.SingleOrDefault(d => d.Id == "LTI022");
        Assert.NotNull(malformedProp);
        Assert.Equal(DiagnosticSeverity.Warning, malformedProp.Severity);
        Assert.Contains("partial-props-island", malformedProp.GetMessage());

        // The island itself is still generated, just without the malformed prop.
        var generated = runResult.GeneratedTrees.FirstOrDefault(t => t.FilePath.Contains("FromIslandsManifest"));
        Assert.NotNull(generated);
        var text = generated.ToString();
        Assert.Contains("public string Title { get; set; }", text);
        Assert.DoesNotContain("BadProp", text);
    }

    [Fact]
    public void ManifestEntryWithErrorSeverityDiagnostic_IsDiagnosedButNotGenerated()
    {
        const string manifestJsonWithErrorDiagnostic = @"
{
  ""schemaVersion"": 1,
  ""islandsRoot"": ""Islands"",
  ""islands"": [
    {
      ""name"": ""broken-island"",
      ""typeName"": ""BrokenIslandProps"",
      ""sourcePath"": ""Islands/Broken.tsx"",
      ""props"": [
        { ""tsName"": ""userName"", ""csharpName"": ""UserName"", ""tsType"": ""string"", ""csharpType"": ""string"", ""optional"": false }
      ],
      ""diagnostics"": [
        { ""code"": ""LTI011"", ""severity"": ""error"", ""message"": ""Found 2 exported *Props types in one file."" }
      ]
    }
  ]
}";
        var manifestText = new InMemoryAdditionalText("islands.manifest.g.json", manifestJsonWithErrorDiagnostic);
        var (runResult, diagnostics) = RunGenerator("namespace TestNamespace;\n", manifestText);

        // The manifest's own diagnostic is surfaced as a real Roslyn diagnostic, using its own code.
        var passthrough = diagnostics.SingleOrDefault(d => d.Id == "LTI011");
        Assert.NotNull(passthrough);
        Assert.Equal(DiagnosticSeverity.Error, passthrough.Severity);

        // But since it already carries an error-severity diagnostic, the island itself is diagnosed,
        // not generated - even though `props` alone would otherwise look perfectly usable.
        Assert.DoesNotContain(runResult.GeneratedTrees, t => t.FilePath.Contains("FromIslandsManifest"));
    }

    // ── 5. Zero regressions: includeAuraAlias defaulting to true leaves the attribute path untouched ─

    [Fact]
    public void AttributeDrivenIsland_StillEmitsAuraAlias_WhenNoManifestPresent()
    {
        var (runResult, diagnostics) = RunGenerator(AttributeIslandOnlySource);
        Assert.Empty(diagnostics.Where(d => d.Severity == DiagnosticSeverity.Error));

        var generated = runResult.GeneratedTrees.FirstOrDefault(t => t.FilePath.Contains("SoloIslandProps"));
        Assert.NotNull(generated);
        Assert.Contains("[HtmlTargetElement(\"aura-solo-island\", TagStructure = TagStructure.NormalOrSelfClosing)]", generated.ToString());
    }

    [Fact]
    public void ManifestDrivenIsland_NeverEmitsAuraAlias()
    {
        var manifestText = new InMemoryAdditionalText("islands.manifest.g.json", ValidManifestJson);
        var (runResult, diagnostics) = RunGenerator("namespace TestNamespace;\n", manifestText);
        Assert.Empty(diagnostics.Where(d => d.Severity == DiagnosticSeverity.Error));

        var generated = runResult.GeneratedTrees.FirstOrDefault(t => t.FilePath.Contains("FromIslandsManifest"));
        Assert.NotNull(generated);
        Assert.DoesNotContain("aura-user-card", generated.ToString());
    }
}
