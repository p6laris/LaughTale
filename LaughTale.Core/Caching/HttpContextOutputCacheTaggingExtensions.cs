using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.OutputCaching;

namespace LaughTale.Core.Caching;

public static class HttpContextOutputCacheTaggingExtensions
{
    /// <summary>
    /// Adds one or more runtime-computed cache tags to the current response (e.g.
    /// <c>context.Tag($"post:{id}")</c> from a PageModel's <c>OnGet</c>), so a later mutation can evict
    /// exactly that entry via <c>IOutputCacheStore.EvictByTagAsync</c> - the value the built-in
    /// <c>[OutputCache(Tags = [...])]</c> attribute can't provide, since it only accepts compile-time
    /// literal strings. No-ops (does not throw) when the <c>OutputCache</c> middleware isn't in the
    /// pipeline for this request, e.g. a route excluded from caching - tagging a response nobody is
    /// going to cache is meaningless, not an error.
    /// </summary>
    public static void Tag(this HttpContext context, params string[] tags)
    {
        var feature = context.Features.Get<IOutputCacheFeature>();
        if (feature is null)
        {
            return;
        }

        foreach (var tag in tags)
        {
            feature.Context.Tags.Add(tag);
        }
    }
}
