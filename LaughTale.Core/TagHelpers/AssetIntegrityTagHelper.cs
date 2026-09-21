using Microsoft.AspNetCore.Razor.TagHelpers;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Logging.Abstractions;
using LaughTale.Core.Assets;

namespace LaughTale.Core.TagHelpers;

/// <summary>
/// LaughTale: Asset Pipeline (ROADMAP.v5.md Part B "Asset pipeline" - integrity manifest). Add
/// <c>lt-integrity</c> to a <c>&lt;script src="..."&gt;</c> or <c>&lt;link rel="stylesheet"
/// href="..."&gt;</c> tag to stamp it with a real Subresource Integrity hash
/// (<c>integrity="sha384-..." crossorigin="anonymous"</c>), computed from the actual file already
/// sitting under wwwroot - not a separate build-time manifest that can drift from what's really
/// deployed.
///
/// Runs AFTER ASP.NET Core's own built-in <c>asp-append-version</c> TagHelper (via <see cref="Order"/>)
/// so it reads the FINAL <c>src</c>/<c>href</c>, including that TagHelper's own <c>?v=...</c> query
/// string - which is then stripped before resolving the file, since the query string isn't part of
/// the actual file path.
/// </summary>
[HtmlTargetElement("script", Attributes = "lt-integrity")]
[HtmlTargetElement("link", Attributes = "lt-integrity")]
public class AssetIntegrityTagHelper : TagHelper
{
    private readonly IAssetIntegrityService _integrity;
    private readonly ILogger<AssetIntegrityTagHelper> _logger;

    public AssetIntegrityTagHelper(IAssetIntegrityService integrity, ILogger<AssetIntegrityTagHelper>? logger = null)
    {
        _integrity = integrity;
        _logger = logger ?? NullLogger<AssetIntegrityTagHelper>.Instance;
    }

    [HtmlAttributeName("lt-integrity")]
    public bool Enabled { get; set; } = true;

    public override int Order => 1000;

    public override void Process(TagHelperContext context, TagHelperOutput output)
    {
        output.Attributes.RemoveAll("lt-integrity");

        if (!Enabled)
        {
            return;
        }

        var urlAttrName = output.TagName == "script" ? "src" : "href";
        var url = output.Attributes[urlAttrName]?.Value?.ToString();
        if (string.IsNullOrEmpty(url) || url.StartsWith("http://", System.StringComparison.OrdinalIgnoreCase)
            || url.StartsWith("https://", System.StringComparison.OrdinalIgnoreCase)
            || url.StartsWith("//", System.StringComparison.Ordinal))
        {
            // Cross-origin URLs (CDN scripts, etc.) aren't this framework's file to hash - an author
            // wanting SRI on those should set integrity="..." themselves with the CDN's own hash.
            return;
        }

        var queryIndex = url.IndexOf('?');
        var relativePath = queryIndex >= 0 ? url[..queryIndex] : url;

        var hash = _integrity.GetIntegrityHash(relativePath);
        if (hash is null)
        {
            _logger.LogWarning("lt-integrity: asset '{Path}' was not found under wwwroot; no integrity attribute was added.", relativePath);
            return;
        }

        output.Attributes.SetAttribute("integrity", hash);
        output.Attributes.SetAttribute("crossorigin", "anonymous");
    }
}
