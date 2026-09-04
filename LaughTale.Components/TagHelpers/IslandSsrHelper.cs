using Microsoft.AspNetCore.Razor.TagHelpers;

namespace LaughTale.Components.TagHelpers;

/// <summary>
/// Shared helper for non-destructive server-rendered HTML markup stamping.
/// Enforces single-point definition for the data-lt-ssr attribute marker (Feature 026/045).
/// </summary>
public static class IslandSsrHelper
{
    /// <summary>
    /// The HTML attribute name identifying server-rendered initial content.
    /// </summary>
    public const string SsrAttributeName = "data-lt-ssr";

    /// <summary>
    /// Stamps the TagHelperOutput with data-lt-ssr="true" and writes the SSR content.
    /// </summary>
    /// <param name="output">The tag helper output container.</param>
    /// <param name="ssrHtml">The server-rendered markup to stamp and set.</param>
    public static void StampSsrContent(TagHelperOutput output, string? ssrHtml)
    {
        if (!string.IsNullOrWhiteSpace(ssrHtml))
        {
            output.Attributes.SetAttribute(SsrAttributeName, "true");
            output.Content.SetHtmlContent(ssrHtml);
        }
    }
}
