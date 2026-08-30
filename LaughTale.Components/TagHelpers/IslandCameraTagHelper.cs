using Microsoft.AspNetCore.Razor.TagHelpers;
using LaughTale.Core.Enums;
using LaughTale.Core.Serialization;

namespace LaughTale.Components.TagHelpers;

/// <summary>
/// Live WebRTC Hardware Camera &amp; Photo Capture TagHelper.
/// </summary>
[HtmlTargetElement("island-camera", TagStructure = TagStructure.NormalOrSelfClosing)]
public class IslandCameraTagHelper : TagHelper
{
    [HtmlAttributeName("target-input")]
    public string? TargetInput { get; set; }

    [HtmlAttributeName("title")]
    public string? Title { get; set; } = "Identity Verification Camera";

    [HtmlAttributeName("show-face-guide")]
    public bool ShowFaceGuide { get; set; } = true;

    [HtmlAttributeName("hydrate")]
    public HydrateStrategy Hydrate { get; set; } = HydrateStrategy.Interaction;

    [HtmlAttributeName("class")]
    public string? Class { get; set; }

    public override void Process(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "div";
        output.TagMode = TagMode.StartTagAndEndTag;

        var props = new
        {
            targetInputName = TargetInput,
            title = Title,
            showFaceGuide = ShowFaceGuide
        };

        output.Attributes.SetAttribute("data-island", "camera");
        output.Attributes.SetAttribute("data-props", IslandJson.SerializeProps(props));
        output.Attributes.SetAttribute("data-hydrate", Hydrate.ToString().ToLowerInvariant());

        if (!string.IsNullOrWhiteSpace(Class))
        {
            output.Attributes.SetAttribute("class", Class);
        }
    }
}
