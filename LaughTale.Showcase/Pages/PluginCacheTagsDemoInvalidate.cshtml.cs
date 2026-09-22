using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.OutputCaching;
using LaughTale.Core.Plugins;

namespace LaughTale.Showcase.Pages;

/// <summary>
/// ROADMAP.v5.md Part G/L live demo, its own uncached page for the same antiforgery-token reason
/// /CacheTagsDemoInvalidate (Part F) documents on itself. Evicts the SAME tag string
/// IslandCacheTagsPlugin applied automatically - <see cref="IslandCacheTagsPlugin.TagFor"/> is public
/// exactly so an app's own eviction code can reference it without guessing the format.
/// </summary>
public class PluginCacheTagsDemoInvalidateModel : PageModel
{
    public async Task<IActionResult> OnPostAsync([FromServices] IOutputCacheStore store)
    {
        await store.EvictByTagAsync(IslandCacheTagsPlugin.TagFor("interactive-counter"), HttpContext.RequestAborted);
        return RedirectToPage("/PluginCacheTagsDemo");
    }
}
