using System.Text;
using System.Text.Json;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using Microsoft.AspNetCore.Razor.TagHelpers;
using LaughTale.Core.Theming;

namespace LaughTale.Components.TagHelpers;

/// <summary>
/// Renders server-side critical CSS theme variables directly into &lt;head&gt; for zero-FOUC first paint.
/// </summary>
[HtmlTargetElement("laughtale-theme", TagStructure = TagStructure.WithoutEndTag)]
[HtmlTargetElement("lt-theme", TagStructure = TagStructure.WithoutEndTag)]
public sealed class ThemeTagHelper : TagHelper
{
    private readonly LaughTaleThemeOptions? _options;

    [ViewContext]
    [HtmlAttributeNotBound]
    public ViewContext? ViewContext { get; set; }

    /// <summary>
    /// Overrides the primary theme palette preset for this render.
    /// </summary>
    [HtmlAttributeName("primary")]
    public LaughTalePalette? Primary { get; set; }

    /// <summary>
    /// Custom primary hex color if Primary is set to Custom.
    /// </summary>
    [HtmlAttributeName("custom-primary-hex")]
    public string? CustomPrimaryHex { get; set; }

    /// <summary>
    /// Overrides the surface neutral palette for this render.
    /// </summary>
    [HtmlAttributeName("surface")]
    public LaughTaleSurface? Surface { get; set; }

    /// <summary>
    /// Overrides the border radius preset for this render.
    /// </summary>
    [HtmlAttributeName("radius")]
    public LaughTaleRadius? Radius { get; set; }

    /// <summary>
    /// Overrides dark mode SSR rendering mode.
    /// </summary>
    [HtmlAttributeName("dark-mode")]
    public LaughTaleDarkMode? DarkMode { get; set; }

    public ThemeTagHelper(LaughTaleThemeOptions? options = null)
    {
        _options = options;
    }

    public override void Process(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "style";
        output.Attributes.SetAttribute("id", "laughtale-ssr-theme");

        var effectivePrimary = Primary.HasValue
            ? (Primary.Value == LaughTalePalette.Custom && !string.IsNullOrWhiteSpace(CustomPrimaryHex) ? CustomPrimaryHex : Primary.Value.ToString().ToLowerInvariant())
            : (_options?.GetPrimaryValue() ?? "emerald");

        var effectiveSurface = Surface.HasValue
            ? Surface.Value.ToString().ToLowerInvariant()
            : (_options?.GetSurfaceValue() ?? "slate");

        var effectiveRadius = Radius.HasValue
            ? LaughTaleThemeOptions.GetRadiusCss(Radius.Value)
            : (_options != null ? LaughTaleThemeOptions.GetRadiusCss(_options.Radius) : "0.5rem");

        var effectiveDarkMode = DarkMode ?? _options?.DarkMode ?? LaughTaleDarkMode.Auto;

        // Check for client cookie override if enabled
        if (_options?.EnableCookieThemeSync != false && ViewContext?.HttpContext?.Request?.Cookies != null)
        {
            if (ViewContext.HttpContext.Request.Cookies.TryGetValue("lt-theme", out var cookieVal) && !string.IsNullOrWhiteSpace(cookieVal))
            {
                try
                {
                    using var doc = JsonDocument.Parse(Uri.UnescapeDataString(cookieVal));
                    var root = doc.RootElement;
                    if (root.TryGetProperty("primary", out var p) && p.GetString() is { } cp)
                        effectivePrimary = cp;
                    if (root.TryGetProperty("neutral", out var n) && n.GetString() is { } cn)
                        effectiveSurface = cn;
                    if (root.TryGetProperty("radius", out var r) && r.GetString() is { } cr)
                        effectiveRadius = cr;
                    if (root.TryGetProperty("darkMode", out var d) && d.ValueKind == JsonValueKind.True)
                        effectiveDarkMode = LaughTaleDarkMode.Dark;
                }
                catch
                {
                    // Ignore malformed cookies
                }
            }
        }

        // Apply CSP nonce if configured
        if (ViewContext?.HttpContext?.Items.TryGetValue("LaughTale_CspNonce", out var nonce) == true && nonce is string nonceStr)
        {
            output.Attributes.SetAttribute("nonce", nonceStr);
        }

        var sb = new StringBuilder();
        sb.AppendLine(":root {");
        sb.AppendLine($"  --lt-border-radius: {effectiveRadius};");
        sb.AppendLine($"  --p-border-radius: {effectiveRadius};");
        sb.AppendLine("}");

        if (effectiveDarkMode == LaughTaleDarkMode.Dark)
        {
            sb.AppendLine("[data-theme=\"dark\"], .dark {");
            sb.AppendLine("  color-scheme: dark;");
            sb.AppendLine("}");
        }

        output.Content.SetHtmlContent(sb.ToString());
    }
}
