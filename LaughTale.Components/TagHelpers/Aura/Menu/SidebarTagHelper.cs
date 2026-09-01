using Microsoft.AspNetCore.Razor.TagHelpers;

namespace LaughTale.Components.TagHelpers.Aura.Menu;

/// <summary>
/// LaughTale: Aura Sidebar TagHelper (<p-sidebar> and <island-sidebar>).
/// </summary>
[HtmlTargetElement("p-sidebar")]
[HtmlTargetElement("island-sidebar")]
public class SidebarTagHelper : IslandTagHelperBase
{
    public override string IslandName => "sidebar";

    [HtmlAttributeName("groups")]
    public object? Groups { get; set; }

    [HtmlAttributeName("items")]
    public object? Items { get; set; }

    [HtmlAttributeName("demo-type")]
    public string? DemoType { get; set; }

    [HtmlAttributeName("collapsible")]
    public string? Collapsible { get; set; }

    [HtmlAttributeName("variant")]
    public string? Variant { get; set; }

    [HtmlAttributeName("side")]
    public string? Side { get; set; }

    [HtmlAttributeName("overlay")]
    public bool Overlay { get; set; }

    [HtmlAttributeName("open-on-hover")]
    public bool OpenOnHover { get; set; }

    [HtmlAttributeName("backdrop")]
    public bool Backdrop { get; set; }

    [HtmlAttributeName("open")]
    public bool? Open { get; set; }

    [HtmlAttributeName("collapsed")]
    public bool? Collapsed { get; set; }

    [HtmlAttributeName("width")]
    public string? Width { get; set; }

    [HtmlAttributeName("show-controls")]
    public bool? ShowControls { get; set; }

    [HtmlAttributeName("header-title")]
    public string? HeaderTitle { get; set; }

    [HtmlAttributeName("header-logo")]
    public string? HeaderLogo { get; set; }

    [HtmlAttributeName("header-color")]
    public string? HeaderColor { get; set; }

    protected override object? BuildProps()
    {
        return new
        {
            groups = Groups,
            items = Items,
            demoType = DemoType,
            collapsible = Collapsible,
            variant = Variant,
            side = Side,
            overlay = Overlay,
            openOnHover = OpenOnHover,
            backdrop = Backdrop,
            open = Open,
            collapsed = Collapsed,
            width = Width,
            showControls = ShowControls,
            headerTitle = HeaderTitle,
            headerLogo = HeaderLogo,
            headerColor = HeaderColor,
            @class = Class,
            style = Style,
            id = Id
        };
    }
}
