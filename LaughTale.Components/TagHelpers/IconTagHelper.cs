using System;
using Microsoft.AspNetCore.Razor.TagHelpers;
using LaughTale.Components.Icons;

namespace LaughTale.Components.TagHelpers;

/// <summary>
/// High-performance self-hosted SVG icon TagHelper (&lt;lt-icon&gt;, &lt;aura-icon&gt;, &lt;island-icon&gt;).
/// Emits clean, accessible SVG markup referencing the immutable Lucide SVG sprite symbol cache with zero runtime JS.
/// </summary>
[HtmlTargetElement("lt-icon", TagStructure = TagStructure.NormalOrSelfClosing)]
[HtmlTargetElement("aura-icon", TagStructure = TagStructure.NormalOrSelfClosing)]
[HtmlTargetElement("island-icon", TagStructure = TagStructure.NormalOrSelfClosing)]
public class IconTagHelper : TagHelper
{
    /// <summary>
    /// Name or alias of the Lucide icon (e.g., "check", "chevron-down", "settings", "zap").
    /// </summary>
    [HtmlAttributeName("name")]
    public string Name { get; set; } = "zap";

    /// <summary>
    /// Pixel dimension (width and height) of the SVG icon. Defaults to 16.
    /// </summary>
    [HtmlAttributeName("size")]
    public int Size { get; set; } = 16;

    /// <summary>
    /// Stroke width for SVG lines. Defaults to 2.
    /// </summary>
    [HtmlAttributeName("stroke-width")]
    public double StrokeWidth { get; set; } = 2.0;

    /// <summary>
    /// Custom stroke color override. Defaults to currentColor.
    /// </summary>
    [HtmlAttributeName("color")]
    public string? Color { get; set; }

    /// <summary>
    /// Optional custom path to SVG sprite. Defaults to "/_lt/icons.svg".
    /// </summary>
    [HtmlAttributeName("sprite-path")]
    public string SpritePath { get; set; } = "/_lt/icons.svg";

    /// <summary>
    /// Accessible label. When set, the icon is exposed to assistive tech as
    /// <c>role="img"</c> with this text as its <c>aria-label</c>, instead of the default
    /// <c>aria-hidden="true"</c> (decorative). Set this whenever the icon conveys meaning
    /// on its own — e.g. an icon-only button — not when it's alongside visible text.
    /// </summary>
    [HtmlAttributeName("title")]
    public string? Title { get; set; }

    /// <summary>
    /// Additional CSS classes to attach to the SVG element.
    /// </summary>
    [HtmlAttributeName("class")]
    public string? Class { get; set; }

    /// <summary>
    /// Inline CSS styles for the SVG element.
    /// </summary>
    [HtmlAttributeName("style")]
    public string? Style { get; set; }

    public override void Process(TagHelperContext context, TagHelperOutput output)
    {
        var iconId = LucideIcons.NormalizeId(Name);
        var baseClass = $"lt-icon lt-icon-{iconId}";
        var finalClass = string.IsNullOrWhiteSpace(Class) ? baseClass : $"{baseClass} {Class}";
        var stroke = string.IsNullOrWhiteSpace(Color) ? "currentColor" : Color;

        output.TagName = "svg";
        output.TagMode = TagMode.StartTagAndEndTag;
        output.Attributes.SetAttribute("class", finalClass);
        output.Attributes.SetAttribute("width", Size.ToString());
        output.Attributes.SetAttribute("height", Size.ToString());
        output.Attributes.SetAttribute("viewBox", "0 0 24 24");
        output.Attributes.SetAttribute("fill", "none");
        output.Attributes.SetAttribute("stroke", stroke);
        output.Attributes.SetAttribute("stroke-width", StrokeWidth.ToString(System.Globalization.CultureInfo.InvariantCulture));
        output.Attributes.SetAttribute("stroke-linecap", "round");
        output.Attributes.SetAttribute("stroke-linejoin", "round");
        output.Attributes.SetAttribute("data-part", "icon");

        if (string.IsNullOrWhiteSpace(Title))
        {
            output.Attributes.SetAttribute("aria-hidden", "true");
        }
        else
        {
            output.Attributes.SetAttribute("role", "img");
            output.Attributes.SetAttribute("aria-label", Title);
        }

        if (!string.IsNullOrWhiteSpace(Style))
        {
            output.Attributes.SetAttribute("style", Style);
        }

        output.Content.SetHtmlContent($"<use href=\"{SpritePath}#{iconId}\"></use>");
    }
}
