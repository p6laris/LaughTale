using Microsoft.AspNetCore.Razor.TagHelpers;

namespace LaughTale.Components.TagHelpers.Aura.Regions;

/// <summary>
/// LaughTale: Named Navigation Outlet (ROADMAP.v5.md Part E "Nested layouts &amp; outlets"). Wraps
/// <c>@RenderBody()</c> in a nested section layout with a stable, addressable id -
/// <c>lt-outlet-{name}</c> - the SPA router (<c>LaughTale.Client/src/runtime/router.ts</c>) uses to
/// detect that two consecutive pages share the same section layout, and morphs ONLY the outlet's
/// contents on navigation between them instead of the whole document body. Everything outside the
/// outlet - a section nav, a sidebar's own scroll position - is never touched at all.
///
/// Nested layout authoring itself needs no new mechanism: Razor Pages already supports a layout whose
/// own <c>Layout</c> property points at another layout. This TagHelper is only the marker the router
/// needs to find the boundary; deliberately a distinct primitive from <see cref="IslandRegionTagHelper"/>
/// (a link/form-driven partial-swap target, not a navigation boundary) even though both generate a
/// similarly-shaped id/data-attribute wrapper - conflating the two would let one feature's swap
/// silently interfere with the other's.
/// </summary>
[HtmlTargetElement("island-outlet")]
public class IslandOutletTagHelper : TagHelper
{
    /// <summary>
    /// The outlet's name. Combined into the generated <c>id="lt-outlet-{Name}"</c>. Defaults to
    /// <c>"default"</c> - most sites need only one outlet per section layout.
    /// </summary>
    [HtmlAttributeName("name")]
    public string Name { get; set; } = "default";

    public override void Process(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "div";
        output.Attributes.SetAttribute("id", $"lt-outlet-{Name}");
        output.Attributes.SetAttribute("data-outlet", Name);

        // Child content is left untouched - the same behavior IslandRegionTagHelper already relies on.
    }
}
