using Microsoft.AspNetCore.Razor.TagHelpers;
using SoftMax.LaughTale.Core.Enums;

namespace SoftMax.LaughTale.Components.TagHelpers;

/// <summary>
/// Toast Notifications Floating Container TagHelper.
/// </summary>
[HtmlTargetElement("island-toast", TagStructure = TagStructure.NormalOrSelfClosing)]
public class IslandToastTagHelper : TagHelper
{
    [HtmlAttributeName("hydrate")]
    public HydrateStrategy Hydrate { get; set; } = HydrateStrategy.Load;

    public override void Process(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "div";
        output.TagMode = TagMode.StartTagAndEndTag;

        output.Attributes.SetAttribute("data-island", "toast");
        output.Attributes.SetAttribute("data-props", "{}");
        output.Attributes.SetAttribute("data-hydrate", Hydrate.ToString().ToLowerInvariant());
    }
}
