using Microsoft.AspNetCore.Razor.TagHelpers;
using LaughTale.Core.Enums;
using LaughTale.Core.Serialization;

namespace LaughTale.Components.TagHelpers;

/// <summary>
/// TagHelper for <island-toast /> and <p-toast />
/// PrimeVue 4 Aura Design System compliant non-blocking toast overlay notification.
/// </summary>
[HtmlTargetElement("island-toast", TagStructure = TagStructure.NormalOrSelfClosing)]
[HtmlTargetElement("p-toast", TagStructure = TagStructure.NormalOrSelfClosing)]
public class IslandToastTagHelper : TagHelper
{
    [HtmlAttributeName("group")]
    public string? Group { get; set; }

    [HtmlAttributeName("position")]
    public string Position { get; set; } = "top-right";

    [HtmlAttributeName("mode")]
    public string Mode { get; set; } = "stacked";

    [HtmlAttributeName("limit")]
    public int Limit { get; set; } = 3;

    [HtmlAttributeName("gap")]
    public int Gap { get; set; } = 12;

    [HtmlAttributeName("auto-z-index")]
    public bool AutoZIndex { get; set; } = true;

    [HtmlAttributeName("base-z-index")]
    public int BaseZIndex { get; set; } = 1100;

    [HtmlAttributeName("class")]
    public string? Class { get; set; }

    [HtmlAttributeName("style")]
    public string? Style { get; set; }

    [HtmlAttributeName("hydrate")]
    public HydrateStrategy Hydrate { get; set; } = HydrateStrategy.Load;

    public override void Process(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "div";
        output.TagMode = TagMode.StartTagAndEndTag;
        output.Attributes.SetAttribute("data-island", "toast");
        output.Attributes.SetAttribute("data-hydrate", Hydrate.ToString().ToLowerInvariant());

        var props = new
        {
            group = Group,
            position = Position,
            mode = Mode,
            limit = Limit,
            gap = Gap,
            autoZIndex = AutoZIndex,
            baseZIndex = BaseZIndex,
            @class = Class,
            style = Style
        };

        output.Attributes.SetAttribute("data-props", IslandJson.SerializeProps(props));

        if (!string.IsNullOrWhiteSpace(Class))
        {
            output.Attributes.SetAttribute("class", Class);
        }

        if (!string.IsNullOrWhiteSpace(Style))
        {
            output.Attributes.SetAttribute("style", Style);
        }
    }
}
