using Microsoft.AspNetCore.Razor.TagHelpers;

namespace LaughTale.Components.TagHelpers.Aura.Menu;

/// <summary>
/// LaughTale: Aura Menubar TagHelper (<p-menubar> and <island-menubar>).
/// </summary>
[HtmlTargetElement("p-menubar")]
[HtmlTargetElement("island-menubar")]
public class MenubarTagHelper : IslandTagHelperBase
{
    public override string IslandName => "menubar";

    [HtmlAttributeName("model")]
    public object? Model { get; set; }

    [HtmlAttributeName("items")]
    public object? Items { get; set; }

    [HtmlAttributeName("custom-template")]
    public bool CustomTemplate { get; set; }

    protected override object? BuildProps()
    {
        return new
        {
            model = Model ?? Items,
            customTemplate = CustomTemplate,
            @class = Class,
            style = Style
        };
    }
}
