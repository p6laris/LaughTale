using System;
using Microsoft.AspNetCore.Razor.TagHelpers;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Logging.Abstractions;
using LaughTale.Core.Assets;
using LaughTale.Core.Diagnostics;

namespace LaughTale.Core.TagHelpers;

/// <summary>
/// LaughTale: Image Optimization (ROADMAP.v5.md Part H). Add <c>lt-optimize</c> to a plain
/// <c>&lt;img src="..."&gt;</c> tag to auto-stamp real <c>width</c>/<c>height</c> attributes (read
/// straight from the file's own header, see <see cref="ImageDimensionReader"/>) whenever the author
/// hasn't already set them - the single biggest Cumulative Layout Shift fix an image can get, and
/// the part of "image optimization" that doesn't need a new image-processing dependency to deliver
/// honestly. Also defaults <c>loading="lazy"</c> unless <c>lt-priority</c> is present (matching
/// Next.js's own <c>priority</c> prop convention for above-the-fold images that shouldn't defer).
///
/// Deliberately NOT included here: responsive <c>srcset</c> generation, format conversion (WebP/AVIF),
/// and on-demand resizing - genuine "image optimization" features Next.js/Astro also ship, but each
/// needs a real image-processing library (a new dependency decision this pass doesn't make) and a
/// resize/cache pipeline of its own. Scoped honestly to the CLS-prevention half only, not silently
/// presented as the whole feature.
/// </summary>
[HtmlTargetElement("img", Attributes = "lt-optimize")]
public class ImageOptimizationTagHelper : TagHelper
{
    private readonly IImageDimensionService _dimensions;
    private readonly ILogger<ImageOptimizationTagHelper> _logger;

    public ImageOptimizationTagHelper(IImageDimensionService dimensions, ILogger<ImageOptimizationTagHelper>? logger = null)
    {
        _dimensions = dimensions;
        _logger = logger ?? NullLogger<ImageOptimizationTagHelper>.Instance;
    }

    [HtmlAttributeName("lt-optimize")]
    public bool Enabled { get; set; } = true;

    /// <summary>
    /// Matches Next.js's <c>&lt;Image priority&gt;</c>: skip the default <c>loading="lazy"</c> for an
    /// above-the-fold image that should start downloading immediately.
    /// </summary>
    [HtmlAttributeName("lt-priority")]
    public bool Priority { get; set; }

    public override void Process(TagHelperContext context, TagHelperOutput output)
    {
        output.Attributes.RemoveAll("lt-optimize");
        output.Attributes.RemoveAll("lt-priority");

        if (!Enabled)
        {
            return;
        }

        var src = output.Attributes["src"]?.Value?.ToString();
        var alt = output.Attributes["alt"]?.Value?.ToString();

        if (LaughTaleEnvironment.IsDevelopment && string.IsNullOrWhiteSpace(alt))
        {
            output.Attributes.SetAttribute(
                "data-laughtale-warning-alt",
                $"<img lt-optimize src=\"{src}\"> has no alt text - required for accessibility, and Next.js/Astro's own image components enforce the same thing.");
        }

        if (!string.IsNullOrEmpty(src)
            && !src.StartsWith("http://", StringComparison.OrdinalIgnoreCase)
            && !src.StartsWith("https://", StringComparison.OrdinalIgnoreCase)
            && !src.StartsWith("//", StringComparison.Ordinal)
            && !output.Attributes.ContainsName("width")
            && !output.Attributes.ContainsName("height"))
        {
            var queryIndex = src.IndexOf('?');
            var relativePath = queryIndex >= 0 ? src[..queryIndex] : src;

            var dims = _dimensions.GetDimensions(relativePath);
            if (dims is { } d)
            {
                output.Attributes.SetAttribute("width", d.Width.ToString());
                output.Attributes.SetAttribute("height", d.Height.ToString());
            }
            else if (LaughTaleEnvironment.IsDevelopment)
            {
                _logger.LogWarning(
                    "lt-optimize: could not determine dimensions for '{Path}' (missing, or not a PNG/GIF/JPEG this reader understands) - width/height were not added.",
                    relativePath);
            }
        }

        if (!output.Attributes.ContainsName("loading"))
        {
            output.Attributes.SetAttribute("loading", Priority ? "eager" : "lazy");
        }

        if (Priority && !output.Attributes.ContainsName("fetchpriority"))
        {
            output.Attributes.SetAttribute("fetchpriority", "high");
        }
    }
}
