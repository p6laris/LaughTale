using Microsoft.AspNetCore.Razor.TagHelpers;

namespace LaughTale.Components.TagHelpers.Aura.Menu;

/// <summary>
/// LaughTale: Aura ContextMenu TagHelper (<p-contextmenu> and <island-contextmenu>).
/// </summary>
[HtmlTargetElement("p-contextmenu")]
[HtmlTargetElement("island-contextmenu")]
public class ContextMenuTagHelper : IslandTagHelperBase
{
    public override string IslandName => "context-menu";

    [HtmlAttributeName("model")]
    public object? Model { get; set; }

    [HtmlAttributeName("items")]
    public object? Items { get; set; }

    [HtmlAttributeName("target-id")]
    public string? TargetId { get; set; }

    protected override object? BuildProps()
    {
        return new
        {
            model = Model ?? Items,
            targetId = TargetId,
            @class = Class,
            style = Style
        };
    }
}
