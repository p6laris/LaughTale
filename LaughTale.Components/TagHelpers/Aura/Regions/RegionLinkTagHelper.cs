using Microsoft.AspNetCore.Razor.TagHelpers;

namespace LaughTale.Components.TagHelpers.Aura.Regions;

/// <summary>
/// LaughTale: Named Page Regions (ROADMAP.v5.md Part E "Partials"). Lets a plain <c>&lt;a&gt;</c> drive
/// a fragment swap into an <see cref="IslandRegionTagHelper"/>-declared region elsewhere on the page,
/// via the already-shipped <c>bindServerAction()</c> engine (<c>LaughTale.Client/src/directives/htmx.ts</c>)
/// - the same <c>l-get</c>/<c>l-target</c>/<c>l-swap</c> attributes <c>&lt;island-form&gt;</c> already
/// emits, just authored on a link instead of a form.
///
/// Deliberately GET-only (no POST variant on <c>&lt;a&gt;</c>): a real anchor can only ever navigate via
/// GET without JavaScript, so keeping this GET-only preserves the no-JS fallback path (a plain top-level
/// navigation to <c>href</c>) fully intact.
///
/// <c>Order</c> is set high so this runs AFTER ASP.NET Core's own <c>AnchorTagHelper</c> (which computes
/// <c>href</c> from <c>asp-page</c>/<c>asp-controller</c>/etc. when present) - reading the final resolved
/// <c>href</c>, not the raw source attribute, so this composes correctly with <c>asp-page</c> authoring.
/// </summary>
[HtmlTargetElement("a", Attributes = RegionAttributeName)]
public class RegionLinkTagHelper : TagHelper
{
    private const string RegionAttributeName = "region";

    public override int Order => 1000;

    [HtmlAttributeName(RegionAttributeName)]
    public string Region { get; set; } = "";

    /// <summary>
    /// The <c>l-swap</c> mode applied to the response fragment. Defaults to <c>innerHTML</c>: the
    /// region's own wrapping element (with its id) is the stable target, and a server partial need only
    /// render the inner content - an <c>outerHTML</c> swap would destroy the addressable container
    /// itself unless the partial redeclared the exact same id, which there's no reason for it to do.
    /// </summary>
    [HtmlAttributeName("swap")]
    public string Swap { get; set; } = "innerHTML";

    public override void Process(TagHelperContext context, TagHelperOutput output)
    {
        var href = output.Attributes["href"]?.Value?.ToString();
        if (string.IsNullOrEmpty(href))
        {
            // Nothing to enhance - leave the link alone rather than emit a broken l-get="".
            return;
        }

        output.Attributes.SetAttribute("l-get", href);
        output.Attributes.SetAttribute("l-target", $"#lt-region-{Region}");
        output.Attributes.SetAttribute("l-swap", Swap);
        output.Attributes.RemoveAll(RegionAttributeName);
        output.Attributes.SetAttribute("data-region", Region);
    }
}
