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

    protected override object? BuildProps()
    {
        return new
        {
            model = Model ?? Items,
            home = Home,
            @class = Class,
            style = Style
        };
    }
}
