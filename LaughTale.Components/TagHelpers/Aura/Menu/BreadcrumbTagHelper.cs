using Microsoft.AspNetCore.Razor.TagHelpers;

namespace LaughTale.Components.TagHelpers.Aura.Menu;

/// <summary>
/// LaughTale: Aura Breadcrumb TagHelper (<p-breadcrumb> and <island-breadcrumb>).
/// </summary>
[HtmlTargetElement("p-breadcrumb")]
[HtmlTargetElement("island-breadcrumb")]
public class BreadcrumbTagHelper : IslandTagHelperBase
{
    public override string IslandName => "breadcrumb";

    [HtmlAttributeName("model")]
    public object? Model { get; set; }

    [HtmlAttributeName("items")]
    public object? Items { get; set; }

    [HtmlAttributeName("home")]
    public object? Home { get; set; }

    [HtmlAttributeName("home-url")]
    public string? HomeUrl { get; set; }

    [HtmlAttributeName("home-icon")]
    public string? HomeIcon { get; set; }

    [HtmlAttributeName("home-label")]
    public string? HomeLabel { get; set; }

    [HtmlAttributeName("separator")]
    public string? Separator { get; set; }

    protected override object? BuildProps()
    {
        return new
        {
            items = Items ?? Model,
            model = Model ?? Items,
            home = Home,
            homeUrl = HomeUrl,
            homeIcon = HomeIcon,
            homeLabel = HomeLabel,
            separator = Separator,
            @class = Class,
            style = Style
        };
    }
}
