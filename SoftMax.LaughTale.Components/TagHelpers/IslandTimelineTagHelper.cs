using Microsoft.AspNetCore.Razor.TagHelpers;
using SoftMax.LaughTale.Components.Models;
using SoftMax.LaughTale.Core.Enums;
using SoftMax.LaughTale.Core.Serialization;

namespace SoftMax.LaughTale.Components.TagHelpers;

/// <summary>
/// Enterprise Event &amp; Audit Log Timeline TagHelper.
/// </summary>
[HtmlTargetElement("island-timeline", TagStructure = TagStructure.NormalOrSelfClosing)]
public class IslandTimelineTagHelper : TagHelper
{
    [HtmlAttributeName("events")]
    public List<TimelineItem> Events { get; set; } = new();

    [HtmlAttributeName("title")]
    public string? Title { get; set; }

    [HtmlAttributeName("hydrate")]
    public HydrateStrategy Hydrate { get; set; } = HydrateStrategy.Visible;

    [HtmlAttributeName("class")]
    public string? Class { get; set; }

    public override void Process(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "div";
        output.TagMode = TagMode.StartTagAndEndTag;

        var props = new
        {
            events = Events,
            title = Title
        };

        output.Attributes.SetAttribute("data-island", "timeline");
        output.Attributes.SetAttribute("data-props", IslandJson.SerializeProps(props));
        output.Attributes.SetAttribute("data-hydrate", Hydrate.ToString().ToLowerInvariant());

        if (!string.IsNullOrWhiteSpace(Class))
        {
            output.Attributes.SetAttribute("class", Class);
        }
    }
}
