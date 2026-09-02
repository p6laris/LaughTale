using System.Threading.Tasks;
using Microsoft.AspNetCore.Razor.TagHelpers;

namespace LaughTale.Components.TagHelpers.Aura.Messages;

/// <summary>
/// LaughTale: Aura Toast TagHelper (<island-toast> and <p-toast>).
/// </summary>
[HtmlTargetElement("island-toast")]
[HtmlTargetElement("p-toast")]
public class ToastTagHelper : IslandTagHelperBase
{
    public override string IslandName => "toast";

    [HtmlAttributeName("group")]
    public string? Group { get; set; }

    [HtmlAttributeName("position")]
    public string Position { get; set; } = "top-right";

    [HtmlAttributeName("mode")]
    public string Mode { get; set; } = "stacked";

    [HtmlAttributeName("limit")]
    public int? Limit { get; set; }

    [HtmlAttributeName("base-z-index")]
    public int BaseZIndex { get; set; } = 1200;

    [HtmlAttributeName("auto-z-index")]
    public bool AutoZIndex { get; set; } = true;

    protected override object? BuildProps()
    {
        return new
        {
            group = Group,
            position = Position,
            mode = Mode,
            limit = Limit,
            baseZIndex = BaseZIndex,
            autoZIndex = AutoZIndex,
            @class = Class,
            style = Style,
            id = Id
        };
    }

    public override async Task ProcessAsync(TagHelperContext context, TagHelperOutput output)
    {
        await base.ProcessAsync(context, output);
        output.Attributes.RemoveAll("style");
        output.Attributes.SetAttribute("style", "display: contents;");
    }
}
