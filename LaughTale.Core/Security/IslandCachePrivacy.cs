using System;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;

namespace LaughTale.Core.Security;

/// <summary>
/// Shared "don't let a shared/proxy cache store this" header guard (ROADMAP.v5.md Part K item 4).
/// Originally lived only inside <c>IslandTagHelper.EnforceCachePrivacy</c> for SSR-rendered
/// <c>[IslandPrivate]</c> islands; extracted so <c>MapIslandData</c> can apply the identical guard to a
/// tenant-scoped data endpoint response, which previously carried no Cache-Control header at all.
/// </summary>
internal static class IslandCachePrivacy
{
    /// <summary>
    /// Sets <c>Cache-Control: no-store, no-cache, private</c>, <c>Pragma: no-cache</c>, and
    /// <c>Vary: Cookie</c> on the response, warning if an existing Cache-Control already advertised
    /// "public" (which this call is about to override).
    /// </summary>
    public static void EnforceNoStore(HttpContext context, string islandName, ILogger? logger)
    {
        var response = context.Response;
        var currentCacheControl = response.Headers.CacheControl.ToString();
        if (currentCacheControl.Contains("public", StringComparison.OrdinalIgnoreCase))
        {
            logger?.LogWarning(
                "[LaughTale Security] Island '{Name}' carries private/tenant-scoped data on a publicly cached response. Overriding Cache-Control to no-store.",
                islandName);
        }

        response.Headers.CacheControl = "no-store, no-cache, private";
        response.Headers.Pragma = "no-cache";
        response.Headers.Vary = "Cookie";
    }
}
