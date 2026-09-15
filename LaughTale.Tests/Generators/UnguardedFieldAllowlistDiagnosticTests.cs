using System;
using System.Collections.Immutable;
using System.Linq;
using Microsoft.CodeAnalysis;
using Microsoft.CodeAnalysis.CSharp;
using LaughTale.Generators;
using Xunit;

namespace LaughTale.Tests.Generators;

/// <summary>
/// ROADMAP.v5.md Part H: LTI006 flags any use of IslandFieldPolicy.AllMappedProperties - the escape
/// hatch that re-opens every public property on the queried type to client-driven filtering, sorting,
/// and search, undoing the mandatory-allowlist contract (LT-2204 / Spec 041). Mirrors
/// FormControlEmissionTests's CSharpGeneratorDriver harness for driving IslandGenerator directly.
/// </summary>
public class UnguardedFieldAllowlistDiagnosticTests
{
    private static ImmutableArray<Diagnostic> RunGenerator(string source)
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
        return diagnostics;
    }

    [Fact]
    public void AllMappedProperties_PassedToToIslandDataResult_ReportsLTI006()
    {
        const string source = @"
using System.Linq;
using LaughTale.Core.Data;

public record TestDto(int Id, string Name);

public class TestUsage
{
    public IslandDataResult<TestDto> Run(IQueryable<TestDto> query, IslandDataRequest request)
    {
        return query.ToIslandDataResult(request, IslandFieldPolicy.AllMappedProperties);
    }
}
";
        var diagnostics = RunGenerator(source);

        Assert.Contains(diagnostics, d => d.Id == "LTI006");
    }

    [Fact]
    public void AllMappedProperties_AssignedToVariable_StillReportsLTI006()
    {
        const string source = @"
using LaughTale.Core.Data;

public class TestUsage
{
    public IslandFieldPolicy Get()
    {
        var policy = IslandFieldPolicy.AllMappedProperties;
        return policy;
    }
}
";
        var diagnostics = RunGenerator(source);

        Assert.Contains(diagnostics, d => d.Id == "LTI006");
    }

    [Fact]
    public void ExplicitFieldAllowlist_DoesNotReportLTI006()
    {
        const string source = @"
using System.Linq;
using LaughTale.Core.Data;

public record TestDto(int Id, string Name);

public class TestUsage
{
    public IslandDataResult<TestDto> Run(IQueryable<TestDto> query, IslandDataRequest request)
    {
        return query.ToIslandDataResult(request, IslandFieldPolicy.For(""Id"", ""Name""));
    }
}
";
        var diagnostics = RunGenerator(source);

        Assert.DoesNotContain(diagnostics, d => d.Id == "LTI006");
    }

    [Fact]
    public void UnrelatedTypeWithSameMemberName_DoesNotReportLTI006()
    {
        // Same member name ("AllMappedProperties") on an unrelated type must not false-positive -
        // LTI006 resolves the symbol's containing type, not just the identifier text.
        const string source = @"
public class NotIslandFieldPolicy
{
    public static NotIslandFieldPolicy AllMappedProperties { get; } = new NotIslandFieldPolicy();
}

public class TestUsage
{
    public NotIslandFieldPolicy Get() => NotIslandFieldPolicy.AllMappedProperties;
}
";
        var diagnostics = RunGenerator(source);

        Assert.DoesNotContain(diagnostics, d => d.Id == "LTI006");
    }
}
