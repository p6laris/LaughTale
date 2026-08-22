using Microsoft.AspNetCore.Razor.TagHelpers;
using SoftMax.LaughTale.Components.Models;
using SoftMax.LaughTale.Core.Enums;
using SoftMax.LaughTale.Core.Serialization;
using System.Threading.Tasks;

namespace SoftMax.LaughTale.Components.TagHelpers;

/// <summary>
/// Enterprise Multi-Step Stepper Wizard TagHelper.
/// </summary>
[HtmlTargetElement("island-stepper", TagStructure = TagStructure.NormalOrSelfClosing)]
public class IslandStepperTagHelper : TagHelper
{
    [HtmlAttributeName("steps")]
    public List<StepperStep> Steps { get; set; } = new();

    [HtmlAttributeName("initial-step")]
    public int InitialStep { get; set; } = 0;

    [HtmlAttributeName("linear")]
    public bool Linear { get; set; } = true;

    [HtmlAttributeName("hydrate")]
    public HydrateStrategy Hydrate { get; set; } = HydrateStrategy.Load;

    [HtmlAttributeName("class")]
    public string? Class { get; set; }

    public override async Task ProcessAsync(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "div";
        output.TagMode = TagMode.StartTagAndEndTag;

        var props = new
        {
            steps = Steps,
            initialStep = InitialStep,
            linear = Linear
        };

        output.Attributes.SetAttribute("data-island", "stepper");
        output.Attributes.SetAttribute("data-props", IslandJson.SerializeProps(props));
        output.Attributes.SetAttribute("data-hydrate", Hydrate.ToString().ToLowerInvariant());

        if (!string.IsNullOrWhiteSpace(Class))
        {
            output.Attributes.SetAttribute("class", Class);
        }

        var childContent = await output.GetChildContentAsync();
        if (!childContent.IsEmptyOrWhiteSpace)
        {
            output.Content.SetHtmlContent($"<div data-slot=\"default\" class=\"island-slot\">{childContent.GetContent()}</div>");
        }
    }
}
