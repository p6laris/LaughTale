using Microsoft.AspNetCore.Razor.TagHelpers;

namespace LaughTale.Components.TagHelpers.Aura.Misc;

/// <summary>
/// LaughTale: Aura Timeline TagHelper (<p-timeline> and <island-timeline>).
/// </summary>
[HtmlTargetElement("p-timeline")]
[HtmlTargetElement("island-timeline")]
public class TimelineTagHelper : IslandTagHelperBase
{
    public override string IslandName => "timeline";

    [HtmlAttributeName("value")]
    public object? Value { get; set; }

    [HtmlAttributeName("events")]
    public object? Events { get; set; }

    [HtmlAttributeName("align")]
    public string? Align { get; set; }

    [HtmlAttributeName("layout")]
    public string? Layout { get; set; }

    [HtmlAttributeName("interactive")]
    public bool Interactive { get; set; }

    [HtmlAttributeName("activity-feed")]
    public bool ActivityFeed { get; set; }

    protected override object? BuildProps()
    {
        return new
        {
            value = Value ?? Events,
            align = Align,
            layout = Layout,
            interactive = Interactive,
            activityFeed = ActivityFeed,
            @class = Class,
            style = Style
        };
    }
}
