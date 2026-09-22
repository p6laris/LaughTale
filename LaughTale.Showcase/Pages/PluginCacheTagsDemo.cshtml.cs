using System;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.OutputCaching;
using LaughTale.Components.Rendering;

namespace LaughTale.Showcase.Pages;

/// <summary>
/// ROADMAP.v5.md Part G/L "Validation: Cache tags" live demo. Same cache + tag + evict story as
/// /CacheTagsDemo (Part F), but with NO <c>HttpContext.Tag(...)</c> call anywhere on this page - the
/// tag is applied automatically by <see cref="LaughTale.Core.Plugins.IslandCacheTagsPlugin"/>,
/// driven entirely by the real <c>&lt;island&gt;</c> rendered below, proving the plugin API alone is
/// enough to build this.
/// </summary>
[OutputCache(PolicyName = "laughtale-demo")]
public class PluginCacheTagsDemoModel : PageModel
{
    public DateTime RenderedAtUtc { get; private set; }
    public Guid RenderNonce { get; private set; }

    public void OnGet()
    {
        ViewData.SetHead(new PageHead(Title: "Cache Tags via Plugin API"));

        RenderedAtUtc = DateTime.UtcNow;
        RenderNonce = Guid.NewGuid();
    }
}
