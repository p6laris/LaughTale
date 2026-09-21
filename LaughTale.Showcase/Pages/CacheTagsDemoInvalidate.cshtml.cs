using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.OutputCaching;

namespace LaughTale.Showcase.Pages;

/// <summary>
/// ROADMAP.v5.md Part F live demo, deliberately its own uncached page - see /CacheTagsDemo's own
/// callout for why the antiforgery-protected mutation trigger can't live on the cached page itself.
/// </summary>
public class CacheTagsDemoInvalidateModel : PageModel
{
    public async Task<IActionResult> OnPostAsync([FromServices] IOutputCacheStore store)
    {
        await store.EvictByTagAsync(CacheTagsDemoModel.Tag, HttpContext.RequestAborted);
        return RedirectToPage("/CacheTagsDemo");
    }
}
