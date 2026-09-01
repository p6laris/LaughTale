using Microsoft.AspNetCore.Razor.TagHelpers;

namespace LaughTale.Components.TagHelpers.Aura.Menu;

/// <summary>
/// LaughTale: Aura Menu TagHelper (<p-menu> and <island-menu>).
/// </summary>
[HtmlTargetElement("p-menu")]
[HtmlTargetElement("island-menu")]
public class MenuTagHelper : IslandTagHelperBase
{
    public override string IslandName => "menu";

    [HtmlAttributeName("model")]
    public object? Model { get; set; }

    [HtmlAttributeName("items")]
    public object? Items { get; set; }

    [HtmlAttributeName("popup")]
    public bool Popup { get; set; }

    [HtmlAttributeName("trigger-id")]
    public string? TriggerId { get; set; }

    [HtmlAttributeName("expanded-keys")]
    public object? ExpandedKeys { get; set; }

    [HtmlAttributeName("custom-template")]
    public bool CustomTemplate { get; set; }

    protected override object? BuildProps()
    {
        return new
        {
            model = Model ?? Items,
            popup = Popup,
            triggerId = TriggerId,
            expandedKeys = ExpandedKeys,
            customTemplate = CustomTemplate,
            @class = Class,
            style = Style
        };
    }
}
