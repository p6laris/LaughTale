using Microsoft.AspNetCore.Razor.TagHelpers;
using Microsoft.Extensions.DependencyInjection;
using LaughTale.Core.Localization;

namespace LaughTale.Components.TagHelpers.Aura.Menu;

/// <summary>
/// LaughTale: Aura CommandMenu TagHelper (<p-commandmenu> and <island-commandmenu>).
/// </summary>
[HtmlTargetElement("p-commandmenu")]
[HtmlTargetElement("island-commandmenu")]
[HtmlTargetElement("p-command-menu")]
[HtmlTargetElement("island-command-menu")]
public class CommandMenuTagHelper : IslandTagHelperBase
{
    public override string IslandName => "command";

    [HtmlAttributeName("model")]
    public object? Model { get; set; }

    [HtmlAttributeName("items")]
    public object? Items { get; set; }

    [HtmlAttributeName("placeholder")]
    public string? Placeholder { get; set; }

    [HtmlAttributeName("filter")]
    public string? Filter { get; set; }

    [HtmlAttributeName("with-dialog")]
    public bool WithDialog { get; set; }

    [HtmlAttributeName("hotkey")]
    public string? Hotkey { get; set; }

    [HtmlAttributeName("custom-template")]
    public bool CustomTemplate { get; set; }

    protected override object? BuildProps()
    {
        var localizer = ViewContext?.HttpContext?.RequestServices?.GetService<ILaughTaleLocalizer>();
        return new
        {
            model = Model ?? Items,
            items = Items ?? Model,
            placeholder = Placeholder ?? localizer?["commandPlaceholder"],
            filter = Filter,
            withDialog = WithDialog,
            hotkey = Hotkey,
            customTemplate = CustomTemplate,
            @class = Class,
            style = Style
        };
    }
}
