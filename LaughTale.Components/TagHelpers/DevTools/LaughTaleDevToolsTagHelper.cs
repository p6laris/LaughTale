using Microsoft.AspNetCore.Razor.TagHelpers;
using LaughTale.Core.Diagnostics;
using LaughTale.Core.Security;

namespace LaughTale.Components.TagHelpers.DevTools;

/// <summary>
/// Threads the server's real Development/Production distinction to the client (ROADMAP.v5.md DX —
/// DevTools overlay). Place once in a layout, e.g. near <c>&lt;island-theme-studio /&gt;</c>. Mirrors
/// <see cref="IslandDiagnostics.ValidateIsland"/>'s exact gating idiom (a bare
/// <see cref="LaughTaleEnvironment.IsDevelopment"/> check, no DI, no options class) rather than
/// inventing new plumbing: in Development it emits <c>window.__LAUGHTALE_DEV__ = true;</c>, which
/// LaughTale.Client's existing <c>isDevMode()</c> already checks; in Production it renders nothing.
/// </summary>
[HtmlTargetElement("laughtale-devtools")]
public class LaughTaleDevToolsTagHelper : TagHelper
{
    private readonly ICspNonceProvider? _cspNonceProvider;

    public LaughTaleDevToolsTagHelper(ICspNonceProvider? cspNonceProvider = null)
    {
        _cspNonceProvider = cspNonceProvider;
    }

    public override void Process(TagHelperContext context, TagHelperOutput output)
    {
        if (!LaughTaleEnvironment.IsDevelopment)
        {
            output.SuppressOutput();
            return;
        }

        output.TagName = "script";
        // Required: this element is authored as a self-closing <laughtale-devtools /> tag, so
        // TagHelperOutput inherits TagMode.SelfClosing from the source syntax. Left unchanged, the
        // rendered output would be a self-closing <script /> with the Content below silently dropped
        // (browsers do not treat <script /> as short for <script></script>) - confirmed live, not
        // theoretical, via the Showcase app rendering literally that.
        output.TagMode = TagMode.StartTagAndEndTag;

        var nonce = _cspNonceProvider?.GetNonce();
        if (!string.IsNullOrEmpty(nonce))
        {
            output.Attributes.SetAttribute("nonce", nonce);
        }

        output.Content.SetHtmlContent("window.__LAUGHTALE_DEV__ = true;");
    }
}
