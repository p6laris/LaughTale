using System.Threading.Tasks;
using Microsoft.AspNetCore.Razor.TagHelpers;

namespace LaughTale.Components.TagHelpers.Aura.Misc;

/// <summary>
/// LaughTale: Aura Stepper Root TagHelper (<p-stepper> and <island-stepper>).
/// </summary>
[HtmlTargetElement("p-stepper")]
[HtmlTargetElement("island-stepper")]
public class StepperTagHelper : IslandTagHelperBase
{
    public override string IslandName => "stepper";

    [HtmlAttributeName("value")]
    public object? Value { get; set; } = "1";

    [HtmlAttributeName("linear")]
    public bool Linear { get; set; }

    [HtmlAttributeName("layout")]
    public string? Layout { get; set; }

    protected override object? BuildProps()
    {
        return new
        {
            value = Value?.ToString() ?? "1",
            linear = Linear,
            layout = Layout,
            @class = Class,
            style = Style
        };
    }

    public override async Task ProcessAsync(TagHelperContext context, TagHelperOutput output)
    {
        await base.ProcessAsync(context, output);
        
        var isVertical = string.Equals(Layout, "vertical", System.StringComparison.OrdinalIgnoreCase);
        var layoutClass = isVertical ? "p-stepper-vertical" : "p-stepper-horizontal";
        var existingClass = output.Attributes["class"]?.Value?.ToString() ?? "";
        output.Attributes.SetAttribute("class", $"p-stepper p-component {layoutClass} {existingClass}".Trim());
        output.Attributes.SetAttribute("data-value", Value?.ToString() ?? "1");
        if (Linear) output.Attributes.SetAttribute("data-linear", "true");
    }
}

/// <summary>
/// LaughTale: Stepper StepList Compound TagHelper (<p-steplist> and <island-steplist>).
/// </summary>
[HtmlTargetElement("p-steplist")]
[HtmlTargetElement("island-steplist")]
public class StepListTagHelper : AuraTagHelperBase
{
    public override async Task ProcessAsync(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "ul";
        var existingClass = Class ?? "";
        output.Attributes.SetAttribute("class", $"p-steplist {existingClass}".Trim());
        output.Attributes.SetAttribute("role", "tablist");
        var childContent = await output.GetChildContentAsync();
        output.Content.SetHtmlContent(childContent);
    }
}

/// <summary>
/// LaughTale: Stepper Step Compound TagHelper (<p-step> and <island-step>).
/// </summary>
[HtmlTargetElement("p-step")]
[HtmlTargetElement("island-step")]
public class StepTagHelper : AuraTagHelperBase
{
    [HtmlAttributeName("value")]
    public string? Value { get; set; }

    [HtmlAttributeName("as-child")]
    public bool AsChild { get; set; }

    [HtmlAttributeName("disabled")]
    public bool Disabled { get; set; }

    public override async Task ProcessAsync(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "li";
        output.Attributes.SetAttribute("role", "presentation");
        output.Attributes.SetAttribute("data-value", Value ?? "1");
        output.Attributes.SetAttribute("value", Value ?? "1");

        var baseClass = "p-step";
        output.Attributes.SetAttribute("class", MergeClass(baseClass));

        var childContent = await output.GetChildContentAsync();
        var rawInner = childContent.GetContent();

        if (AsChild || rawInner.Contains("p-step-header"))
        {
            output.Content.SetHtmlContent(rawInner);
        }
        else
        {
            output.Content.SetHtmlContent($@"
                <button type=""button"" class=""p-step-header"" role=""tab"" {(Disabled ? "disabled" : "")}>
                    <span class=""p-step-number"">{Value ?? "1"}</span>
                    <span class=""p-step-title"">{rawInner}</span>
                </button>
            ");
        }
    }
}

/// <summary>
/// LaughTale: Stepper StepPanels Compound TagHelper (<p-steppanels> and <island-steppanels>).
/// </summary>
[HtmlTargetElement("p-steppanels")]
[HtmlTargetElement("island-steppanels")]
public class StepPanelsTagHelper : AuraTagHelperBase
{
    public override async Task ProcessAsync(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "div";
        var existingClass = Class ?? "";
        output.Attributes.SetAttribute("class", $"p-steppanels {existingClass}".Trim());
        var childContent = await output.GetChildContentAsync();
        output.Content.SetHtmlContent(childContent);
    }
}

/// <summary>
/// LaughTale: Stepper StepPanel Compound TagHelper (<p-steppanel> and <island-steppanel>).
/// </summary>
[HtmlTargetElement("p-steppanel")]
[HtmlTargetElement("island-steppanel")]
public class StepPanelTagHelper : AuraTagHelperBase
{
    [HtmlAttributeName("value")]
    public string? Value { get; set; }

    public override async Task ProcessAsync(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "div";
        output.Attributes.SetAttribute("role", "tabpanel");
        output.Attributes.SetAttribute("data-value", Value ?? "1");
        output.Attributes.SetAttribute("value", Value ?? "1");

        var baseClass = "p-steppanel";
        output.Attributes.SetAttribute("class", MergeClass(baseClass));

        var childContent = await output.GetChildContentAsync();
        output.Content.SetHtmlContent(childContent);
    }
}

/// <summary>
/// LaughTale: Stepper StepItem Compound TagHelper (<p-stepitem> and <island-stepitem>).
/// </summary>
[HtmlTargetElement("p-stepitem")]
[HtmlTargetElement("island-stepitem")]
public class StepItemTagHelper : AuraTagHelperBase
{
    [HtmlAttributeName("value")]
    public string? Value { get; set; }

    public override async Task ProcessAsync(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "div";
        output.Attributes.SetAttribute("data-value", Value ?? "1");
        output.Attributes.SetAttribute("value", Value ?? "1");

        var baseClass = "p-stepitem";
        output.Attributes.SetAttribute("class", MergeClass(baseClass));

        var childContent = await output.GetChildContentAsync();
        output.Content.SetHtmlContent(childContent);
    }
}
