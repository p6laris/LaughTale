using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using Microsoft.AspNetCore.Razor.TagHelpers;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Logging.Abstractions;
using LaughTale.Core.Security;
using LaughTale.Core.Serialization;
using LaughTale.Core.State;

namespace LaughTale.Core.TagHelpers;

/// <summary>
/// LaughTale: Ambient State Pool (ROADMAP.v5.md Part F). Placed once per page (typically near the end
/// of the layout's &lt;body&gt;), this dehydrates every entry registered via
/// <see cref="HttpContextAmbientStateExtensions.SetAmbientState"/> during this request into a single
/// <c>&lt;script id="__LAUGHTALE_STATE__" type="application/json"&gt;</c> blob, which client islands
/// read back through <c>ctx.state(key)</c> (<c>runtime/ambient-state.ts</c>).
///
/// Renders nothing when no state was registered this request - not even an empty script tag - so an
/// app that never calls <c>SetAmbientState</c> pays zero bytes for this.
/// </summary>
[HtmlTargetElement("island-state-script", TagStructure = TagStructure.WithoutEndTag)]
public class IslandStateScriptTagHelper : TagHelper
{
    private readonly ILogger<IslandStateScriptTagHelper> _logger;

    public IslandStateScriptTagHelper(ILogger<IslandStateScriptTagHelper>? logger = null)
    {
        _logger = logger ?? NullLogger<IslandStateScriptTagHelper>.Instance;
    }

    [ViewContext]
    [HtmlAttributeNotBound]
    public ViewContext? ViewContext { get; set; }

    public override void Process(TagHelperContext context, TagHelperOutput output)
    {
        var httpContext = ViewContext?.HttpContext;
        if (httpContext is null
            || httpContext.Items[typeof(AmbientStatePool)] is not AmbientStatePool pool
            || pool.Entries.Count == 0)
        {
            output.SuppressOutput();
            return;
        }

        // Cache-privacy must be decided now, at render time - Response.HasStarted may already be
        // true by the time a later part of the page tries to set headers, matching the same
        // shell-render-time constraint IslandDeferredTagHelper documents.
        if (pool.Entries.Any(e => e.IsPrivate))
        {
            IslandCachePrivacy.EnforceNoStore(httpContext, "__LAUGHTALE_STATE__", _logger);
        }

        // Last-registration-wins for a duplicate key, folded manually since Dictionary construction
        // from a sequence throws on duplicate keys.
        var dict = new Dictionary<string, object?>(System.StringComparer.Ordinal);
        foreach (var entry in pool.Entries)
        {
            dict[entry.Key] = entry.Value;
        }

        output.TagName = "script";
        output.TagMode = TagMode.StartTagAndEndTag;
        output.Attributes.SetAttribute("id", "__LAUGHTALE_STATE__");
        output.Attributes.SetAttribute("type", "application/json");

        // IslandJson's JavaScriptEncoder already escapes HTML-sensitive characters (<, >, &, etc.),
        // which is what makes embedding this directly as a <script> body - rather than an
        // HTML-attribute value - safe against a "</script>" or similar breakout in the payload.
        output.Content.SetHtmlContent(IslandJson.SerializeProps(dict));
    }
}
