using Microsoft.AspNetCore.Razor.TagHelpers;
using SoftMax.LaughTale.Core.Enums;
using SoftMax.LaughTale.Core.Serialization;
using System.Threading.Tasks;

namespace SoftMax.LaughTale.Components.TagHelpers;

/// <summary>
/// Animated Server-Slot Modal Dialog TagHelper.
/// </summary>
[HtmlTargetElement("island-modal", TagStructure = TagStructure.NormalOrSelfClosing)]
public class IslandModalTagHelper : TagHelper
{
    [HtmlAttributeName("title")]
    public string Title { get; set; } = "Dialog";

    [HtmlAttributeName("trigger-text")]
    public string TriggerText { get; set; } = "Open Dialog";

    [HtmlAttributeName("hydrate")]
    public HydrateStrategy Hydrate { get; set; } = HydrateStrategy.Interaction;

    [HtmlAttributeName("class")]
    public string? Class { get; set; }

    public override async Task ProcessAsync(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "div";
        output.TagMode = TagMode.StartTagAndEndTag;

        var props = new
        {
            dialogTitle = Title,
            triggerButtonText = TriggerText
        };

        output.Attributes.SetAttribute("data-island", "modal");
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
