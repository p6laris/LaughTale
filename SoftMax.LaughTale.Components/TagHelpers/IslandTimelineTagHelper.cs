using Microsoft.AspNetCore.Razor.TagHelpers;
using SoftMax.LaughTale.Components.Models;
using SoftMax.LaughTale.Core.Enums;
using SoftMax.LaughTale.Core.Serialization;

namespace SoftMax.LaughTale.Components.TagHelpers;

/// <summary>
/// Enterprise Event &amp; Audit Log Timeline TagHelper (Aura Design System compliant).
/// </summary>
[HtmlTargetElement("island-timeline", TagStructure = TagStructure.NormalOrSelfClosing)]
public class IslandTimelineTagHelper : TagHelper
{
    [HtmlAttributeName("value")]
    public object? Value { get; set; }

    [HtmlAttributeName("events")]
    public object? Events { get; set; }

    [HtmlAttributeName("align")]
    public string? Align { get; set; } = "left";

    [HtmlAttributeName("layout")]
    public string? Layout { get; set; } = "vertical";

    [HtmlAttributeName("title")]
    public string? Title { get; set; }

    [HtmlAttributeName("interactive")]
    public bool Interactive { get; set; } = false;

    [HtmlAttributeName("activity-feed")]
    public bool ActivityFeed { get; set; } = false;

    [HtmlAttributeName("hydrate")]
    public HydrateStrategy Hydrate { get; set; } = HydrateStrategy.Visible;

    [HtmlAttributeName("class")]
    public string? Class { get; set; }

    public override void Process(TagHelperContext context, TagHelperOutput output)
    {
        // Attribute fallbacks
        if (context.AllAttributes.TryGetAttribute("align", out var alignAttr))
        {
            Align = alignAttr.Value?.ToString();
        }
        if (context.AllAttributes.TryGetAttribute("layout", out var layoutAttr))
        {
            Layout = layoutAttr.Value?.ToString();
        }
        if (context.AllAttributes.TryGetAttribute("interactive", out var intAttr))
        {
            if (bool.TryParse(intAttr.Value?.ToString(), out var b)) Interactive = b;
            else if (intAttr.Value != null) Interactive = true;
        }
        if (context.AllAttributes.TryGetAttribute("activityFeed", out var afAttr) || context.AllAttributes.TryGetAttribute("activity-feed", out afAttr))
        {
            if (bool.TryParse(afAttr.Value?.ToString(), out var b)) ActivityFeed = b;
            else if (afAttr.Value != null) ActivityFeed = true;
        }

        output.TagName = "div";
        output.TagMode = TagMode.StartTagAndEndTag;

        var data = Value ?? Events ?? new object[0];

        var props = new
        {
            value = data,
            events = data,
            align = Align ?? "left",
            layout = Layout ?? "vertical",
            title = Title,
            interactive = Interactive,
            activityFeed = ActivityFeed
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
