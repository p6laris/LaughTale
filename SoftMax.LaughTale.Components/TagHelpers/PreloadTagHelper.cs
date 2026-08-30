using Microsoft.AspNetCore.Razor.TagHelpers;

namespace SoftMax.LaughTale.Components.TagHelpers;

/// <summary>
/// Emits resource preloading link tags (e.g. modulepreload, preload) in &lt;head&gt; for critical above-the-fold islands.
/// </summary>
[HtmlTargetElement("laughtale-preload", TagStructure = TagStructure.WithoutEndTag)]
[HtmlTargetElement("lt-preload", TagStructure = TagStructure.WithoutEndTag)]
public sealed class PreloadTagHelper : TagHelper
{
    /// <summary>
    /// The island name to preload (e.g. "counter" -> "/dist/counter.js").
    /// </summary>
    [HtmlAttributeName("island")]
    public string? Island { get; set; }

    /// <summary>
    /// Custom href to preload. If specified, overrides the default island path.
    /// </summary>
    [HtmlAttributeName("href")]
    public string? Href { get; set; }

    /// <summary>
    /// Resource destination type (e.g. "script", "style", "image", "fetch"). Defaults to "script".
    /// </summary>
    [HtmlAttributeName("as")]
    public string? As { get; set; }

    /// <summary>
    /// Link relationship type. Defaults to "modulepreload" for scripts/islands, or "preload".
    /// </summary>
    [HtmlAttributeName("rel")]
    public string? Rel { get; set; }

    /// <summary>
    /// Base path where compiled island JS bundles reside. Defaults to "/dist/".
    /// </summary>
    [HtmlAttributeName("base-path")]
    public string BasePath { get; set; } = "/dist/";

    public override void Process(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "link";
        output.TagMode = TagMode.SelfClosing;

        string targetHref = Href ?? string.Empty;
        if (string.IsNullOrEmpty(targetHref) && !string.IsNullOrEmpty(Island))
        {
            var cleanBase = BasePath.EndsWith('/') ? BasePath : BasePath + "/";
            var cleanIsland = Island.EndsWith(".js", System.StringComparison.OrdinalIgnoreCase) ? Island : Island + ".js";
            targetHref = cleanBase + cleanIsland;
        }

        string relation = Rel ?? "modulepreload";
        output.Attributes.SetAttribute("rel", relation);
        output.Attributes.SetAttribute("href", targetHref);

        if (!string.IsNullOrEmpty(As))
        {
            output.Attributes.SetAttribute("as", As);
        }
        else if (relation == "preload")
        {
            output.Attributes.SetAttribute("as", "script");
        }
    }
}
