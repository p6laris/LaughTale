using Microsoft.AspNetCore.Razor.TagHelpers;

namespace LaughTale.Components.TagHelpers.Aura.Menu;

/// <summary>
/// LaughTale: Aura TieredMenu TagHelper (<p-tieredmenu> and <island-tieredmenu>).
/// </summary>
[HtmlTargetElement("p-tieredmenu")]
[HtmlTargetElement("island-tieredmenu")]
public class TieredMenuTagHelper : IslandTagHelperBase
{
    public override string IslandName => "tieredmenu";

    [HtmlAttributeName("model")]
    public object? Model { get; set; }

    [HtmlAttributeName("items")]
    public object? Items { get; set; }

    [HtmlAttributeName("popup")]
    public bool Popup { get; set; }

    [HtmlAttributeName("trigger-id")]
    public string? TriggerId { get; set; }

    [HtmlAttributeName("custom-template")]
    public bool CustomTemplate { get; set; }

    protected override object? BuildProps()
    {
        return new
        {
            model = Model ?? Items,
            popup = Popup,
            triggerId = TriggerId,
            customTemplate = CustomTemplate,
            @class = Class,
            style = Style
        };
    }
}
