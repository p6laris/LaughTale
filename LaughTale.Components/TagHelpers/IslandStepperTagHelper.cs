using Microsoft.AspNetCore.Razor.TagHelpers;
using LaughTale.Components.Models;
using LaughTale.Core.Enums;
using LaughTale.Core.Serialization;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LaughTale.Components.TagHelpers;

/// <summary>
/// Enterprise Multi-Step Stepper Wizard TagHelper (Aura Design System compliant).
/// </summary>
[HtmlTargetElement("island-stepper", TagStructure = TagStructure.NormalOrSelfClosing)]
[HtmlTargetElement("p-stepper", TagStructure = TagStructure.NormalOrSelfClosing)]
public class IslandStepperTagHelper : TagHelper
{
    [HtmlAttributeName("value")]
    public string Value { get; set; } = "1";

    [HtmlAttributeName("linear")]
    public bool Linear { get; set; } = false;

    [HtmlAttributeName("layout")]
    public string Layout { get; set; } = "horizontal"; // "horizontal" | "vertical"

    [HtmlAttributeName("steps")]
    public List<StepperStep>? Steps { get; set; }

    [HtmlAttributeName("initial-step")]
    public int? InitialStep { get; set; }

    [HtmlAttributeName("hydrate")]
    public HydrateStrategy Hydrate { get; set; } = HydrateStrategy.Load;

    [HtmlAttributeName("class")]
    public string? Class { get; set; }

    [HtmlAttributeName("style")]
    public string? Style { get; set; }

    public override async Task ProcessAsync(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "div";
        output.TagMode = TagMode.StartTagAndEndTag;

        var isVertical = string.Equals(Layout, "vertical", StringComparison.OrdinalIgnoreCase);
        var orientClass = isVertical ? "p-stepper-vertical" : "p-stepper-horizontal";

        var classes = new List<string> { "p-stepper", "p-component", orientClass };
        if (!string.IsNullOrWhiteSpace(Class)) classes.Add(Class);
        output.Attributes.SetAttribute("class", string.Join(" ", classes));

        output.Attributes.SetAttribute("data-island", "stepper");
        output.Attributes.SetAttribute("data-hydrate", Hydrate.ToString().ToLowerInvariant());
        output.Attributes.SetAttribute("data-value", Value);
        if (Linear) output.Attributes.SetAttribute("data-linear", "true");
        if (!string.IsNullOrWhiteSpace(Style)) output.Attributes.SetAttribute("style", Style);

        var props = new
        {
            value = Value,
            linear = Linear,
            layout = isVertical ? "vertical" : "horizontal",
            steps = Steps,
            initialStep = InitialStep
        };
        output.Attributes.SetAttribute("data-props", IslandJson.SerializeProps(props));

        var childContent = await output.GetChildContentAsync();
        output.Content.SetHtmlContent(childContent);
    }
}

/// <summary>
/// StepList Primitive for Stepper headers.
/// </summary>
[HtmlTargetElement("island-steplist", TagStructure = TagStructure.NormalOrSelfClosing)]
[HtmlTargetElement("island-step-list", TagStructure = TagStructure.NormalOrSelfClosing)]
[HtmlTargetElement("p-steplist", TagStructure = TagStructure.NormalOrSelfClosing)]
[HtmlTargetElement("p-step-list", TagStructure = TagStructure.NormalOrSelfClosing)]
public class IslandStepListTagHelper : TagHelper
{
    [HtmlAttributeName("class")]
    public string? Class { get; set; }

    [HtmlAttributeName("style")]
    public string? Style { get; set; }

    public override async Task ProcessAsync(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "ul";
        output.TagMode = TagMode.StartTagAndEndTag;
        output.Attributes.SetAttribute("role", "tablist");

        var baseClass = "p-steplist";
        output.Attributes.SetAttribute("class", string.IsNullOrWhiteSpace(Class) ? baseClass : $"{baseClass} {Class}");
        if (!string.IsNullOrWhiteSpace(Style)) output.Attributes.SetAttribute("style", Style);

        var childContent = await output.GetChildContentAsync();
        output.Content.SetHtmlContent(childContent);
    }
}

/// <summary>
/// Step Primitive for individual header tab.
/// </summary>
[HtmlTargetElement("island-step", TagStructure = TagStructure.NormalOrSelfClosing)]
[HtmlTargetElement("p-step", TagStructure = TagStructure.NormalOrSelfClosing)]
public class IslandStepTagHelper : TagHelper
{
    [HtmlAttributeName("value")]
    public string Value { get; set; } = "1";

    [HtmlAttributeName("disabled")]
    public bool Disabled { get; set; } = false;

    [HtmlAttributeName("as-child")]
    public bool AsChild { get; set; } = false;

    [HtmlAttributeName("class")]
    public string? Class { get; set; }

    [HtmlAttributeName("style")]
    public string? Style { get; set; }

    public override async Task ProcessAsync(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "li";
        output.TagMode = TagMode.StartTagAndEndTag;
        output.Attributes.SetAttribute("role", "presentation");
        output.Attributes.SetAttribute("data-value", Value);

        var baseClass = "p-step";
        output.Attributes.SetAttribute("class", string.IsNullOrWhiteSpace(Class) ? baseClass : $"{baseClass} {Class}");
        if (!string.IsNullOrWhiteSpace(Style)) output.Attributes.SetAttribute("style", Style);

        var childContent = await output.GetChildContentAsync();
        var innerHtml = childContent.GetContent();

        if (AsChild || innerHtml.Contains("<button") || innerHtml.Contains("p-step-header"))
        {
            output.Content.SetHtmlContent(innerHtml);
        }
        else
        {
            var btnHtml = $@"<button type=""button"" class=""p-step-header"" role=""tab"" {(Disabled ? "disabled" : "")}>
                <span class=""p-step-number"">{Value}</span>
                <span class=""p-step-title"">{innerHtml}</span>
            </button>";
            output.Content.SetHtmlContent(btnHtml);
        }
    }
}

/// <summary>
/// StepPanels Primitive containing all StepPanels.
/// </summary>
[HtmlTargetElement("island-steppanels", TagStructure = TagStructure.NormalOrSelfClosing)]
[HtmlTargetElement("island-step-panels", TagStructure = TagStructure.NormalOrSelfClosing)]
[HtmlTargetElement("p-steppanels", TagStructure = TagStructure.NormalOrSelfClosing)]
[HtmlTargetElement("p-step-panels", TagStructure = TagStructure.NormalOrSelfClosing)]
public class IslandStepPanelsTagHelper : TagHelper
{
    [HtmlAttributeName("class")]
    public string? Class { get; set; }

    [HtmlAttributeName("style")]
    public string? Style { get; set; }

    public override async Task ProcessAsync(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "div";
        output.TagMode = TagMode.StartTagAndEndTag;

        var baseClass = "p-steppanels";
        output.Attributes.SetAttribute("class", string.IsNullOrWhiteSpace(Class) ? baseClass : $"{baseClass} {Class}");
        if (!string.IsNullOrWhiteSpace(Style)) output.Attributes.SetAttribute("style", Style);

        var childContent = await output.GetChildContentAsync();
        output.Content.SetHtmlContent(childContent);
    }
}

/// <summary>
/// StepPanel Primitive for individual step panel body.
/// </summary>
[HtmlTargetElement("island-steppanel", TagStructure = TagStructure.NormalOrSelfClosing)]
[HtmlTargetElement("island-step-panel", TagStructure = TagStructure.NormalOrSelfClosing)]
[HtmlTargetElement("p-steppanel", TagStructure = TagStructure.NormalOrSelfClosing)]
[HtmlTargetElement("p-step-panel", TagStructure = TagStructure.NormalOrSelfClosing)]
public class IslandStepPanelTagHelper : TagHelper
{
    [HtmlAttributeName("value")]
    public string Value { get; set; } = "1";

    [HtmlAttributeName("class")]
    public string? Class { get; set; }

    [HtmlAttributeName("style")]
    public string? Style { get; set; }

    public override async Task ProcessAsync(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "div";
        output.TagMode = TagMode.StartTagAndEndTag;
        output.Attributes.SetAttribute("role", "tabpanel");
        output.Attributes.SetAttribute("data-value", Value);

        var baseClass = "p-steppanel";
        output.Attributes.SetAttribute("class", string.IsNullOrWhiteSpace(Class) ? baseClass : $"{baseClass} {Class}");
        if (!string.IsNullOrWhiteSpace(Style)) output.Attributes.SetAttribute("style", Style);

        var childContent = await output.GetChildContentAsync();
        output.Content.SetHtmlContent(childContent);
    }
}

/// <summary>
/// StepItem Primitive for Vertical Stepper item wrapper.
/// </summary>
[HtmlTargetElement("island-stepitem", TagStructure = TagStructure.NormalOrSelfClosing)]
[HtmlTargetElement("island-step-item", TagStructure = TagStructure.NormalOrSelfClosing)]
[HtmlTargetElement("p-stepitem", TagStructure = TagStructure.NormalOrSelfClosing)]
[HtmlTargetElement("p-step-item", TagStructure = TagStructure.NormalOrSelfClosing)]
public class IslandStepItemTagHelper : TagHelper
{
    [HtmlAttributeName("value")]
    public string Value { get; set; } = "1";

    [HtmlAttributeName("class")]
    public string? Class { get; set; }

    [HtmlAttributeName("style")]
    public string? Style { get; set; }

    public override async Task ProcessAsync(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "div";
        output.TagMode = TagMode.StartTagAndEndTag;
        output.Attributes.SetAttribute("data-value", Value);

        var baseClass = "p-stepitem";
        output.Attributes.SetAttribute("class", string.IsNullOrWhiteSpace(Class) ? baseClass : $"{baseClass} {Class}");
        if (!string.IsNullOrWhiteSpace(Style)) output.Attributes.SetAttribute("style", Style);

        var childContent = await output.GetChildContentAsync();
        output.Content.SetHtmlContent(childContent);
    }
}
