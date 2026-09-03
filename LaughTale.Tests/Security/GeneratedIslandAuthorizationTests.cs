using System;
using System.Linq;
using Microsoft.CodeAnalysis;
using Microsoft.CodeAnalysis.CSharp;
using LaughTale.Generators;
using Xunit;

namespace LaughTale.Tests.Security;

public class GeneratedIslandAuthorizationTests
{
    [Fact]
    public void EmittedTagHelper_UsesIIslandAccessEvaluator_AndContainsNoFailOpenGuard()
    {
        var source = @"
using LaughTale.Core.Attributes;

namespace MyTestApp;

[Island(""test-widget"")]
public class TestWidgetProps
{
    public string Title { get; set; } = string.Empty;
}
";

        var syntaxTree = CSharpSyntaxTree.ParseText(source);
        var references = AppDomain.CurrentDomain.GetAssemblies()
            .Where(a => !a.IsDynamic && !string.IsNullOrWhiteSpace(a.Location))
            .Select(a => MetadataReference.CreateFromFile(a.Location))
            .Cast<MetadataReference>()
            .ToList();

        var compilation = CSharpCompilation.Create(
            "TestAssembly",
            new[] { syntaxTree },
            references,
            new CSharpCompilationOptions(OutputKind.DynamicallyLinkedLibrary));

        var generator = new IslandGenerator();
        GeneratorDriver driver = CSharpGeneratorDriver.Create(generator);
        driver = driver.RunGenerators(compilation);

        var runResult = driver.GetRunResult();
        var generatedSources = runResult.GeneratedTrees.Select(t => t.ToString()).ToList();

        Assert.NotEmpty(generatedSources);
        var combinedSource = string.Join("\n", generatedSources);

        // Assert that IIslandAccessEvaluator is resolved and called
        Assert.Contains("LaughTale.Core.Security.IIslandAccessEvaluator", combinedSource);
        Assert.Contains("evaluator.EvaluateAsync", combinedSource);
        Assert.Contains("!decision.IsAllowed", combinedSource);

        // Assert zero occurrences of the fail-open pattern
        // (constructed via concatenation to avoid matching literal grep guards in the test file itself)
        var forbiddenSnippet = "&& " + "authService != null";
        Assert.DoesNotContain(forbiddenSnippet, combinedSource);
        Assert.DoesNotContain("authService != null", combinedSource);
    }
}
