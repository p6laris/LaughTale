using System;
using System.Collections.Immutable;
using System.Linq;
using Microsoft.CodeAnalysis;
using Microsoft.CodeAnalysis.CSharp;
using LaughTale.Generators;
using Xunit;

namespace LaughTale.Tests.Generators;

/// <summary>
/// ROADMAP.v5.md Part K item 1: LTI007 flags an [Island]-attributed props record that declares
/// neither [IslandAllowAnonymous] nor [IslandAuthorize] - the runtime (IslandAccessEvaluator) already
/// denies refresh/data requests for such an island by default (Spec 041), this surfaces that same
/// fact at compile time. Mirrors UnguardedFieldAllowlistDiagnosticTests's CSharpGeneratorDriver harness.
/// </summary>
public class MissingAuthorizationDeclarationDiagnosticTests
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
    public void IslandWithNeitherAttribute_ReportsLTI007()
    {
        const string source = @"
using LaughTale.Core.Attributes;

[Island(""undeclared-widget"")]
public record UndeclaredWidgetProps(string? Name = null);
";
        var diagnostics = RunGenerator(source);

        Assert.Contains(diagnostics, d => d.Id == "LTI007");
    }

    [Fact]
    public void IslandWithAllowAnonymous_DoesNotReportLTI007()
    {
        const string source = @"
using LaughTale.Core.Attributes;

[IslandAllowAnonymous]
[Island(""public-widget"")]
public record PublicWidgetProps(string? Name = null);
";
        var diagnostics = RunGenerator(source);

        Assert.DoesNotContain(diagnostics, d => d.Id == "LTI007");
    }

    [Fact]
    public void IslandWithAuthorize_DoesNotReportLTI007()
    {
        const string source = @"
using LaughTale.Core.Attributes;

[IslandAuthorize(Policy = ""AdminOnly"")]
[Island(""admin-widget"")]
public record AdminWidgetProps(string? Name = null);
";
        var diagnostics = RunGenerator(source);

        Assert.DoesNotContain(diagnostics, d => d.Id == "LTI007");
    }

    [Fact]
    public void IslandWithFullyQualifiedAttributeName_ReportsLTI007()
    {
        const string source = @"
[LaughTale.Core.Attributes.Island(""undeclared-fq-widget"")]
public record UndeclaredFqWidgetProps(string? Name = null);
";
        var diagnostics = RunGenerator(source);

        Assert.Contains(diagnostics, d => d.Id == "LTI007");
    }
}
