using System;
using Microsoft.AspNetCore.Razor.TagHelpers;

namespace LaughTale.Components.TagHelpers.Aura.Regions;

/// <summary>
/// LaughTale: Named Page Regions (ROADMAP.v5.md Part E "Partials"). Wraps a fragment of markup with a
/// stable, addressable id - <c>lt-region-{name}</c> - that a link or form elsewhere on the page can
/// target via <c>l-target</c> (see <see cref="RegionLinkTagHelper"/>) or <c>&lt;island-form
/// target="lt-region-{name}"&gt;</c>, without the author hand-picking and manually keeping a raw CSS id
/// in sync between the trigger and the target. Not an island - derives from plain <see cref="TagHelper"/>,
/// the same precedent <c>IslandFormTagHelper</c> already set for a non-island Aura TagHelper.
/// </summary>
[HtmlTargetElement("island-region")]
public class IslandRegionTagHelper : TagHelper
{
    /// <summary>
    /// The region's name. Combined into the generated <c>id="lt-region-{Name}"</c> - must be unique on
    /// the page, the same authoring responsibility as any other HTML id.
    /// </summary>
    [HtmlAttributeName("name")]
    public string Name { get; set; } = "";

    /// <summary>
    /// The concrete element to render as. Defaults to <c>div</c>.
    /// </summary>
    [HtmlAttributeName("tag")]
    public string Tag { get; set; } = "div";

    public override void Process(TagHelperContext context, TagHelperOutput output)
    {
        if (string.IsNullOrWhiteSpace(Name))
        {
            throw new InvalidOperationException("<island-region> requires a non-empty 'name' attribute.");
        }

        output.TagName = string.IsNullOrWhiteSpace(Tag) ? "div" : Tag;
        output.Attributes.SetAttribute("id", $"lt-region-{Name}");
        output.Attributes.SetAttribute("data-region", Name);

        // Child content is left untouched: Process() never reads/writes output.Content, so the
        // already-rendered body Razor captured for this tag passes through as-is - the same behavior
        // IslandFormTagHelper already relies on for its own (empty) body.
    }
}
