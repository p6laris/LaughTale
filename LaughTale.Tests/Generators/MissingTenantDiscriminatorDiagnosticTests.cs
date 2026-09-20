using System;
using System.Collections.Immutable;
using System.Linq;
using Microsoft.CodeAnalysis;
using Microsoft.CodeAnalysis.CSharp;
using LaughTale.Generators;
using Xunit;

namespace LaughTale.Tests.Generators;

/// <summary>
/// ROADMAP.v5.md Part K item 3: LTI008 flags a MapIslandData&lt;T&gt; call whose fieldPolicy has no
/// .WithTenantColumn(...) configured. Deliberately isEnabledByDefault: false (see the descriptor's own
/// doc comment) - Roslyn's own diagnostic pipeline suppresses a disabled-by-default diagnostic before
/// RunGeneratorsAndUpdateCompilation's diagnostics output, the same as it would for a real consumer's
/// build. These tests model a consumer's real opt-in path - `dotnet_diagnostic.LTI008.severity =
/// warning` in .editorconfig - via CompilationOptions.SpecificDiagnosticOptions, the same mechanism
/// .editorconfig severity overrides compile down to. Mirrors UnguardedFieldAllowlistDiagnosticTests's
/// CSharpGeneratorDriver harness otherwise.
/// </summary>
public class MissingTenantDiscriminatorDiagnosticTests
{
    private static ImmutableArray<Diagnostic> RunGenerator(string source, bool enableLti008 = false)
    {
        var syntaxTree = CSharpSyntaxTree.ParseText(source);
        var references = AppDomain.CurrentDomain.GetAssemblies()
            .Where(a => !a.IsDynamic && !string.IsNullOrWhiteSpace(a.Location))
            .Select(a => MetadataReference.CreateFromFile(a.Location))
            .Cast<MetadataReference>();

        var compilationOptions = new CSharpCompilationOptions(OutputKind.DynamicallyLinkedLibrary);
        if (enableLti008)
        {
            // The same effect a consumer's `dotnet_diagnostic.LTI008.severity = warning` .editorconfig
            // entry has on the real compiler - explicitly opting a disabled-by-default diagnostic in.
            compilationOptions = compilationOptions.WithSpecificDiagnosticOptions(
                new System.Collections.Generic.Dictionary<string, ReportDiagnostic>
                {
                    ["LTI008"] = ReportDiagnostic.Warn
                });
        }

        var compilation = CSharpCompilation.Create(
            "TestCompilation",
            new[] { syntaxTree },
            references,
            compilationOptions);

        var generator = new IslandGenerator();
        GeneratorDriver driver = CSharpGeneratorDriver.Create(generator);
        driver = driver.RunGeneratorsAndUpdateCompilation(compilation, out _, out var diagnostics);
        return diagnostics;
    }

    private const string Harness = @"
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using LaughTale.Core.Data;
using LaughTale.Core.Endpoints;

public record TestRow(int Id, string Name, string TenantId);

public class TestUsage
{
    public void Wire(IEndpointRouteBuilder endpoints, IQueryable<TestRow> source)
    {
        __BODY__
    }
}
";

    private static string Wire(string body) => Harness.Replace("__BODY__", body);

    private const string WithoutTenantColumnBody = @"
        endpoints.MapIslandData(
            ""/api/data/rows"",
            (HttpContext ctx) => source,
            IslandFieldPolicy.For(""Name""),
            ""rows"");
";

    [Fact]
    public void MapIslandData_WithoutTenantColumn_ReportsLTI008_WhenExplicitlyEnabled()
    {
        var diagnostics = RunGenerator(Wire(WithoutTenantColumnBody), enableLti008: true);

        Assert.Contains(diagnostics, d => d.Id == "LTI008");
    }

    [Fact]
    public void MapIslandData_WithoutTenantColumn_IsSilentByDefault()
    {
        // The whole point of shipping this disabled by default: a single-tenant consumer (this repo's
        // own Showcase/Docs included) never sees it unless they opt in.
        var diagnostics = RunGenerator(Wire(WithoutTenantColumnBody), enableLti008: false);

        Assert.DoesNotContain(diagnostics, d => d.Id == "LTI008");
    }

    [Fact]
    public void MapIslandData_WithTenantColumn_DoesNotReportLTI008_EvenWhenEnabled()
    {
        var source = Wire(@"
        endpoints.MapIslandData(
            ""/api/data/rows"",
            (HttpContext ctx) => source,
            IslandFieldPolicy.For(""Name"").WithTenantColumn(""TenantId""),
            ""rows"",
            (HttpContext ctx) => ""tenant-a"");
");

        var diagnostics = RunGenerator(source, enableLti008: true);

        Assert.DoesNotContain(diagnostics, d => d.Id == "LTI008");
    }

    [Fact]
    public void MapIslandData_TenantColumnInSeparateVariable_StillReportsLTI008_WhenEnabled()
    {
        // Documented limitation: LTI008 only inspects the fieldPolicy argument's own immediate
        // expression, not a value built up across separate statements before being passed in - the
        // same scope LTI006 already accepts. This is a known false negative, not a bug.
        var source = Wire(@"
        var policy = IslandFieldPolicy.For(""Name"").WithTenantColumn(""TenantId"");
        endpoints.MapIslandData(
            ""/api/data/rows"",
            (HttpContext ctx) => source,
            policy,
            ""rows"",
            (HttpContext ctx) => ""tenant-a"");
");

        var diagnostics = RunGenerator(source, enableLti008: true);

        Assert.Contains(diagnostics, d => d.Id == "LTI008");
    }

    [Fact]
    public void UnrelatedMapIslandDataLikeMethod_DoesNotReportLTI008_EvenWhenEnabled()
    {
        const string source = @"
public static class NotTheRealExtensions
{
    public static void MapIslandData(this object endpoints, string pattern) { }
}

public class TestUsage
{
    public void Wire(object endpoints)
    {
        endpoints.MapIslandData(""/api/data/rows"");
    }
}
";
        var diagnostics = RunGenerator(source, enableLti008: true);

        Assert.DoesNotContain(diagnostics, d => d.Id == "LTI008");
    }
}
