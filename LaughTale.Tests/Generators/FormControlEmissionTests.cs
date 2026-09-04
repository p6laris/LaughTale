using System;
using System.Collections.Immutable;
using System.Linq;
using Microsoft.CodeAnalysis;
using Microsoft.CodeAnalysis.CSharp;
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
        Assert.DoesNotContain("IslandSsrHelper.StampSsrContent", text);
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
    public void SingleCardinality_HiddenKind_EmitsAspForAndHiddenField()
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
        Assert.Contains("<input type=\\\"hidden\\\" name=\\\"{encodedName}\\\" value=\\\"{encodedVal}\\\" data-lt-field{disabledAttr} />", text);
        Assert.Contains("IslandSsrHelper.StampSsrContent", text);
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
    public void NativeKind_Textarea_EmitsTextareaElement()
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
        Assert.Contains("IslandSsrHelper.StampSsrContent", text);
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
