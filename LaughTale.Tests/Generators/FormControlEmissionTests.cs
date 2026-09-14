using System;
using System.Collections.Generic;
using System.Collections.Immutable;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.Mvc.ViewEngines;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using Microsoft.AspNetCore.Razor.TagHelpers;
using Microsoft.CodeAnalysis;
using Microsoft.CodeAnalysis.CSharp;
using Microsoft.Extensions.DependencyInjection;
using LaughTale.Core.Extensions;
using LaughTale.Generators;
using Xunit;

namespace LaughTale.Tests.Generators;

public class FormControlEmissionTests
{
    private static (GeneratorDriverRunResult RunResult, ImmutableArray<Diagnostic> Diagnostics) RunGenerator(string source)
    {
        var syntaxTree = CSharpSyntaxTree.ParseText(source);
        var references = AppDomain.CurrentDomain.GetAssemblies()
            .Where(a => !a.IsDynamic && !string.IsNullOrWhiteSpace(a.Location))
            .Select(a => MetadataReference.CreateFromFile(a.Location))
            .Cast<MetadataReference>();

        var compilation = CSharpCompilation.Create(
            "TestCompilation",
            new[] { syntaxTree },
            references,
            new CSharpCompilationOptions(OutputKind.DynamicallyLinkedLibrary));

        var generator = new IslandGenerator();
        GeneratorDriver driver = CSharpGeneratorDriver.Create(generator);
        driver = driver.RunGeneratorsAndUpdateCompilation(compilation, out _, out var diagnostics);
        return (driver.GetRunResult(), diagnostics);
    }

    /// <summary>
    /// Compiles and emits the generated source to an in-memory assembly so the generated
    /// TagHelper type can be instantiated and its actual rendered TagHelperOutput inspected,
    /// instead of pattern-matching the generator's raw output text.
    /// </summary>
    private static (Assembly Assembly, ImmutableArray<Diagnostic> Diagnostics) CompileAndLoad(string source, string assemblyName)
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
        GeneratorDriver driver = CSharpGeneratorDriver.Create(generator);
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

    /// <summary>
    /// Instantiates the generated TagHelper type, sets properties by name via reflection, and runs
    /// the real ProcessAsync pipeline (auth check, BuildProps, BuildSsrHtml/StampSsrContent) with no
    /// child content supplied — exactly the "no-JS initial render" case Feature 026/Spec 045 cover.
    /// </summary>
    private static async Task<TagHelperOutput> RenderWithNoChildContent(Type tagHelperType, IDictionary<string, object?> propertyValues)
    {
        var helper = Activator.CreateInstance(tagHelperType)!;
        tagHelperType.GetProperty("ViewContext")!.SetValue(helper, CreateViewContext());
        foreach (var (name, value) in propertyValues)
        {
            tagHelperType.GetProperty(name)!.SetValue(helper, value);
        }

        var context = new TagHelperContext(
            new TagHelperAttributeList(),
            new Dictionary<object, object>(),
            Guid.NewGuid().ToString("N"));
        var output = new TagHelperOutput(
            tagHelperType.Name,
            new TagHelperAttributeList(),
            (useCachedResult, encoder) => Task.FromResult<TagHelperContent>(new DefaultTagHelperContent()));

        var processAsync = tagHelperType.GetMethod("ProcessAsync", new[] { typeof(TagHelperContext), typeof(TagHelperOutput) })!;
        await (Task)processAsync.Invoke(helper, new object[] { context, output })!;
        return output;
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

    [Fact]
    public void UnmarkedRecord_EmitsNoFormControlPlumbing()
    {
        var source = @"
using LaughTale.Core.Attributes;

namespace TestNamespace;

[Island(""plain-island"")]
public record PlainIslandProps(string? Title);
";
        var (runResult, diagnostics) = RunGenerator(source);
        Assert.Empty(diagnostics.Where(d => d.Severity == DiagnosticSeverity.Error));

        var generated = runResult.GeneratedTrees.FirstOrDefault(t => t.FilePath.Contains("PlainIsland"));
        Assert.NotNull(generated);
        var text = generated.ToString();

        Assert.DoesNotContain("ModelExpression? AspFor", text);
        // A plain (non-[FormControl]) island must not get SSR field plumbing at all: no BuildSsrHtml
        // override means IslandTagHelperBase's own no-op default (return null) applies.
        Assert.DoesNotContain("BuildSsrHtml", text);
    }

    [Fact]
    public void MissingNameProperty_ReportsLTI005Diagnostic()
    {
        var source = @"
using LaughTale.Core.Attributes;

namespace TestNamespace;

[Island(""nameless-control"")]
[FormControl]
public record NamelessControlProps(string? Value);
";
        var (runResult, diagnostics) = RunGenerator(source);
        var lti005 = diagnostics.FirstOrDefault(d => d.Id == "LTI005");
        Assert.NotNull(lti005);
        Assert.Equal(DiagnosticSeverity.Warning, lti005.Severity);
        Assert.Contains("NamelessControlProps", lti005.GetMessage());
    }

    [Fact]
    public async Task SingleCardinality_HiddenKind_EmitsAspForAndHiddenField()
    {
        var source = @"
using LaughTale.Core.Attributes;

namespace TestNamespace;

[Island(""single-control"")]
[FormControl(ValueProperty = ""Value"", Cardinality = FormCardinality.Single, FieldKind = FormFieldKind.Hidden)]
public record SingleControlProps(string? Value = null, string? Name = null, bool Disabled = false);
";
        var (runResult, diagnostics) = RunGenerator(source);
        Assert.Empty(diagnostics.Where(d => d.Severity == DiagnosticSeverity.Error));

        var generated = runResult.GeneratedTrees.FirstOrDefault(t => t.FilePath.Contains("SingleControl"));
        Assert.NotNull(generated);
        var text = generated.ToString();

        Assert.Contains("[HtmlAttributeName(\"asp-for\")]", text);
        Assert.Contains("public ModelExpression? AspFor { get; set; }", text);
        Assert.Contains("Name = Name ?? AspFor?.Name", text);
        Assert.Contains("TargetInputName = Name ?? AspFor?.Name", text);
        // The SSR field is now built by BuildSsrHtml (inherited stamping via IslandTagHelperBase),
        // not a direct IslandSsrHelper.StampSsrContent call in generated text.
        Assert.Contains("protected override string? BuildSsrHtml(TagHelperContext context, TagHelperOutput output)", text);
        Assert.DoesNotContain("IslandSsrHelper.StampSsrContent", text);

        // Behavioral: with no child content, the base class must stamp data-lt-ssr="true" and render
        // the hidden field carrying the resolved name/value, exactly as Feature 026/Spec 045 require.
        var (assembly, emitDiagnostics) = CompileAndLoad(source, "SingleControlAssembly_" + Guid.NewGuid().ToString("N"));
        Assert.Empty(emitDiagnostics.Where(d => d.Severity == DiagnosticSeverity.Error));
        var tagHelperType = assembly.GetTypes().Single(t => t.Name == "IslandSingleControlTagHelper");
        Assert.True(typeof(LaughTale.Components.TagHelpers.IslandTagHelperBase).IsAssignableFrom(tagHelperType));

        var output = await RenderWithNoChildContent(tagHelperType, new Dictionary<string, object?>
        {
            ["Name"] = "myfield",
            ["Value"] = "hello",
            ["Disabled"] = false
        });

        Assert.Equal("true", output.Attributes["data-lt-ssr"].Value.ToString());
        var content = output.Content.GetContent();
        Assert.Contains("name=\"myfield\"", content);
        Assert.Contains("value=\"hello\"", content);
        Assert.Contains("data-lt-field", content);
    }

    [Fact]
    public void MultipleCardinality_HiddenKind_EmitsRepeatedFields()
    {
        var source = @"
using System.Collections.Generic;
using LaughTale.Core.Attributes;

namespace TestNamespace;

[Island(""multi-control"")]
[FormControl(FormCardinality.Multiple)]
public record MultiControlProps(List<string>? Values = null, string? Name = null, bool Disabled = false);
";
        var (runResult, diagnostics) = RunGenerator(source);
        Assert.Empty(diagnostics.Where(d => d.Severity == DiagnosticSeverity.Error));

        var generated = runResult.GeneratedTrees.FirstOrDefault(t => t.FilePath.Contains("MultiControl"));
        Assert.NotNull(generated);
        var text = generated.ToString();

        Assert.Contains("System.Collections.IEnumerable enumerable", text);
        Assert.Contains("<input type=\\\"hidden\\\" name=\\\"{encodedName}\\\" value=\\\"{encodedVal}\\\" data-lt-field{disabledAttr} />", text);
    }

    [Fact]
    public void BooleanCardinality_HiddenKind_EmitsCompanionAndField()
    {
        var source = @"
using LaughTale.Core.Attributes;

namespace TestNamespace;

[Island(""bool-control"")]
[FormControl(FormCardinality.Boolean)]
public record BoolControlProps(bool Value = false, string? Name = null, bool Disabled = false);
";
        var (runResult, diagnostics) = RunGenerator(source);
        Assert.Empty(diagnostics.Where(d => d.Severity == DiagnosticSeverity.Error));

        var generated = runResult.GeneratedTrees.FirstOrDefault(t => t.FilePath.Contains("BoolControl"));
        Assert.NotNull(generated);
        var text = generated.ToString();

        Assert.Contains("data-lt-field-companion", text);
        Assert.Contains("value=\\\"false\\\"", text);
        Assert.Contains("value=\\\"true\\\"", text);
        Assert.Contains("data-lt-field", text);
    }

    [Fact]
    public async Task NativeKind_Textarea_EmitsTextareaElement()
    {
        var source = @"
using LaughTale.Core.Attributes;

namespace TestNamespace;

[Island(""textarea"")]
[FormControl(Cardinality = FormCardinality.Single, FieldKind = FormFieldKind.Native)]
public record TextareaProps(string? Value = null, string? Name = null, bool Disabled = false);
";
        var (runResult, diagnostics) = RunGenerator(source);
        Assert.Empty(diagnostics.Where(d => d.Severity == DiagnosticSeverity.Error));

        var generated = runResult.GeneratedTrees.FirstOrDefault(t => t.FilePath.Contains("Textarea"));
        Assert.NotNull(generated);
        var text = generated.ToString();

        Assert.Contains("<textarea name=\\\"{encodedName}\\\" data-lt-field{disabledAttr}>{encodedVal}</textarea>", text);
        Assert.DoesNotContain("IslandSsrHelper.StampSsrContent", text);

        // Behavioral: no child content renders the actual <textarea> and stamps data-lt-ssr="true".
        var (assembly, emitDiagnostics) = CompileAndLoad(source, "TextareaAssembly_" + Guid.NewGuid().ToString("N"));
        Assert.Empty(emitDiagnostics.Where(d => d.Severity == DiagnosticSeverity.Error));
        var tagHelperType = assembly.GetTypes().Single(t => t.Name == "IslandTextareaTagHelper");
        Assert.True(typeof(LaughTale.Components.TagHelpers.IslandTagHelperBase).IsAssignableFrom(tagHelperType));

        var output = await RenderWithNoChildContent(tagHelperType, new Dictionary<string, object?>
        {
            ["Name"] = "bio",
            ["Value"] = "Hello world",
            ["Disabled"] = false
        });

        Assert.Equal("true", output.Attributes["data-lt-ssr"].Value.ToString());
        var content = output.Content.GetContent();
        Assert.Contains("<textarea name=\"bio\" data-lt-field>Hello world</textarea>", content);
    }

    [Fact]
    public void NativeKind_ToggleSwitch_EmitsCheckboxAndCompanion()
    {
        var source = @"
using LaughTale.Core.Attributes;

namespace TestNamespace;

[Island(""toggle-switch"")]
[FormControl(Cardinality = FormCardinality.Boolean, FieldKind = FormFieldKind.Native)]
public record ToggleSwitchProps(bool Value = false, string? Name = null, bool Disabled = false);
";
        var (runResult, diagnostics) = RunGenerator(source);
        Assert.Empty(diagnostics.Where(d => d.Severity == DiagnosticSeverity.Error));

        var generated = runResult.GeneratedTrees.FirstOrDefault(t => t.FilePath.Contains("ToggleSwitch"));
        Assert.NotNull(generated);
        var text = generated.ToString();

        Assert.Contains("<input type=\\\"checkbox\\\" name=\\\"{encodedName}\\\" value=\\\"true\\\" data-lt-field{checkedAttr}{disabledAttr} />", text);
        Assert.Contains("data-lt-field-companion", text);
    }

    [Fact]
    public void DisabledState_AppliesDisabledAttribute()
    {
        var source = @"
using LaughTale.Core.Attributes;

namespace TestNamespace;

[Island(""disabled-control"")]
[FormControl]
public record DisabledControlProps(string? Value = null, string? Name = null, bool Disabled = true);
";
        var (runResult, diagnostics) = RunGenerator(source);
        Assert.Empty(diagnostics.Where(d => d.Severity == DiagnosticSeverity.Error));

        var generated = runResult.GeneratedTrees.FirstOrDefault(t => t.FilePath.Contains("DisabledControl"));
        Assert.NotNull(generated);
        var text = generated.ToString();

        Assert.Contains("var isDisabled = Disabled;", text);
        Assert.Contains("var disabledAttr = isDisabled ? \" disabled=\\\"disabled\\\"\" : \"\";", text);
    }

    [Fact]
    public void InputPassword_RendersEmptyValuePerContractC4()
    {
        var source = @"
using LaughTale.Core.Attributes;

namespace TestNamespace;

[Island(""input-password"")]
[FormControl]
public record InputPasswordProps(string? Value = null, string? Name = null);
";
        var (runResult, diagnostics) = RunGenerator(source);
        Assert.Empty(diagnostics.Where(d => d.Severity == DiagnosticSeverity.Error));

        var generated = runResult.GeneratedTrees.FirstOrDefault(t => t.FilePath.Contains("InputPassword"));
        Assert.NotNull(generated);
        var text = generated.ToString();

        Assert.Contains("<input type=\\\"hidden\\\" name=\\\"{encodedName}\\\" value=\\\"\\\" data-lt-field{disabledAttr} />", text);
    }
}
