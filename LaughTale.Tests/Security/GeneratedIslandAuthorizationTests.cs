using System;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.Mvc.ViewEngines;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using Microsoft.AspNetCore.Razor.TagHelpers;
using Microsoft.CodeAnalysis;
using Microsoft.CodeAnalysis.CSharp;
using Microsoft.Extensions.DependencyInjection;
using LaughTale.Components.TagHelpers;
using LaughTale.Core.Extensions;
using LaughTale.Generators;
using Xunit;

namespace LaughTale.Tests.Security;

/// <summary>
/// Verifies the TagHelper split fix (ROADMAP.v5.md §0/§9/§15): a generated island TagHelper now
/// extends IslandTagHelperBase and inherits its authorization enforcement, rather than
/// re-implementing (and potentially drifting from) the auth check in generated source text.
/// </summary>
public class GeneratedIslandAuthorizationTests
{
    private const string TestWidgetSource = @"
using LaughTale.Core.Attributes;

namespace MyTestApp;

[Island(""test-widget"")]
public class TestWidgetProps
{
    public string Title { get; set; } = string.Empty;
}
";

    private static (Compilation Compilation, System.Collections.Immutable.ImmutableArray<Diagnostic> Diagnostics, string CombinedSource) RunGenerator(string source)
    {
        var syntaxTree = CSharpSyntaxTree.ParseText(source);
        var references = AppDomain.CurrentDomain.GetAssemblies()
            .Where(a => !a.IsDynamic && !string.IsNullOrWhiteSpace(a.Location))
            .Select(a => MetadataReference.CreateFromFile(a.Location))
            .Cast<MetadataReference>()
            .ToList();

        var compilation = CSharpCompilation.Create(
            "GeneratedIslandAuthorizationTestAssembly_" + Guid.NewGuid().ToString("N"),
            new[] { syntaxTree },
            references,
            new CSharpCompilationOptions(OutputKind.DynamicallyLinkedLibrary));

        var generator = new IslandGenerator();
        GeneratorDriver driver = CSharpGeneratorDriver.Create(generator);
        driver = driver.RunGeneratorsAndUpdateCompilation(compilation, out var outputCompilation, out var diagnostics);

        var runResult = driver.GetRunResult();
        var combinedSource = string.Join("\n", runResult.GeneratedTrees.Select(t => t.ToString()));

        return (outputCompilation, diagnostics, combinedSource);
    }

    private static Assembly EmitAndLoad(Compilation compilation)
    {
        using var ms = new MemoryStream();
        var emitResult = compilation.Emit(ms);
        Assert.True(emitResult.Success, string.Join("\n", emitResult.Diagnostics.Select(d => d.ToString())));
        ms.Seek(0, SeekOrigin.Begin);
        return Assembly.Load(ms.ToArray());
    }

    private static (TagHelperContext Context, TagHelperOutput Output) CreateTagHelperContext(string tagName)
    {
        var context = new TagHelperContext(
            new TagHelperAttributeList(),
            new System.Collections.Generic.Dictionary<object, object>(),
            Guid.NewGuid().ToString("N"));

        var output = new TagHelperOutput(
            tagName,
            new TagHelperAttributeList(),
            (useCachedResult, encoder) => Task.FromResult<TagHelperContent>(new DefaultTagHelperContent()));

        return (context, output);
    }

    private static ViewContext CreateViewContext(IServiceProvider provider, ClaimsPrincipal user)
    {
        var httpContext = new DefaultHttpContext { RequestServices = provider, User = user };
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

    [Fact]
    public void EmittedTagHelper_ExtendsIslandTagHelperBase()
    {
        var (_, diagnostics, combinedSource) = RunGenerator(TestWidgetSource);
        Assert.Empty(diagnostics.Where(d => d.Severity == DiagnosticSeverity.Error));

        // The generated class must derive from IslandTagHelperBase (ROADMAP.v5.md §0 "TagHelper
        // split" fix) so it inherits authorization, localization, RTL and SSR handling instead of
        // re-declaring them. This is now a meaningful source-shape invariant to assert directly.
        Assert.Contains("IslandTestWidgetTagHelper : LaughTale.Components.TagHelpers.IslandTagHelperBase", combinedSource);

        // The generator must not re-implement the auth check in generated text anymore: that logic
        // now lives exactly once, in IslandTagHelperBase.ProcessAsync.
        Assert.DoesNotContain("IIslandAccessEvaluator", combinedSource);
        Assert.DoesNotContain("evaluator.EvaluateAsync", combinedSource);
    }

    [Fact]
    public async Task EmittedTagHelper_UnauthorizedUser_SuppressesOutput()
    {
        var (compilation, diagnostics, _) = RunGenerator(TestWidgetSource);
        Assert.Empty(diagnostics.Where(d => d.Severity == DiagnosticSeverity.Error));

        var assembly = EmitAndLoad(compilation);
        var tagHelperType = assembly.GetTypes().Single(t => t.Name == "IslandTestWidgetTagHelper");

        // Real inheritance check on the actual runtime type (not a string match).
        Assert.True(typeof(IslandTagHelperBase).IsAssignableFrom(tagHelperType));

        var services = new ServiceCollection();
        services.AddLogging();
        services.AddAuthorization(options =>
        {
            options.AddPolicy("WidgetAdmin", policy => policy.RequireRole("WidgetAdmin"));
        });
        services.AddLaughTale();
        var provider = services.BuildServiceProvider();

        var guest = new ClaimsPrincipal(new ClaimsIdentity(new[]
        {
            new Claim(ClaimTypes.Name, "Guest"),
            new Claim(ClaimTypes.Role, "Guest")
        }, "TestAuth"));

        var helper = Activator.CreateInstance(tagHelperType)!;
        tagHelperType.GetProperty("ViewContext")!.SetValue(helper, CreateViewContext(provider, guest));
        tagHelperType.GetProperty("Policy")!.SetValue(helper, "WidgetAdmin");
        tagHelperType.GetProperty("Title")!.SetValue(helper, "Secret Widget Title");

        var (context, output) = CreateTagHelperContext("island-test-widget");
        var processAsync = tagHelperType.GetMethod("ProcessAsync", new[] { typeof(TagHelperContext), typeof(TagHelperOutput) })!;
        await (Task)processAsync.Invoke(helper, new object[] { context, output })!;

        // Zero trace of the island: no fail-open, nothing leaked.
        Assert.Null(output.TagName);
        Assert.True(output.Content.IsEmptyOrWhiteSpace);
        Assert.False(output.Attributes.ContainsName("data-props"));
    }

    [Fact]
    public async Task EmittedTagHelper_AuthorizedUser_RendersIslandWithProps()
    {
        var (compilation, diagnostics, _) = RunGenerator(TestWidgetSource);
        Assert.Empty(diagnostics.Where(d => d.Severity == DiagnosticSeverity.Error));

        var assembly = EmitAndLoad(compilation);
        var tagHelperType = assembly.GetTypes().Single(t => t.Name == "IslandTestWidgetTagHelper");

        var services = new ServiceCollection();
        services.AddLogging();
        services.AddAuthorization(options =>
        {
            options.AddPolicy("WidgetAdmin", policy => policy.RequireRole("WidgetAdmin"));
        });
        services.AddLaughTale();
        var provider = services.BuildServiceProvider();

        var admin = new ClaimsPrincipal(new ClaimsIdentity(new[]
        {
            new Claim(ClaimTypes.Name, "Alice"),
            new Claim(ClaimTypes.Role, "WidgetAdmin")
        }, "TestAuth"));

        var helper = Activator.CreateInstance(tagHelperType)!;
        tagHelperType.GetProperty("ViewContext")!.SetValue(helper, CreateViewContext(provider, admin));
        tagHelperType.GetProperty("Policy")!.SetValue(helper, "WidgetAdmin");
        tagHelperType.GetProperty("Title")!.SetValue(helper, "Visible Widget Title");

        var (context, output) = CreateTagHelperContext("island-test-widget");
        var processAsync = tagHelperType.GetMethod("ProcessAsync", new[] { typeof(TagHelperContext), typeof(TagHelperOutput) })!;
        await (Task)processAsync.Invoke(helper, new object[] { context, output })!;

        Assert.Equal("div", output.TagName);
        Assert.Equal("test-widget", output.Attributes["data-island"].Value);
        Assert.Contains("Visible Widget Title", output.Attributes["data-props"].Value.ToString());
    }

    private class MockView : IView
    {
        public string Path => "test.cshtml";
        public Task RenderAsync(ViewContext context) => Task.CompletedTask;
    }

    private class MockTempDataProvider : ITempDataProvider
    {
        public System.Collections.Generic.IDictionary<string, object> LoadTempData(HttpContext context) => new System.Collections.Generic.Dictionary<string, object>();
        public void SaveTempData(HttpContext context, System.Collections.Generic.IDictionary<string, object> values) { }
    }
}
