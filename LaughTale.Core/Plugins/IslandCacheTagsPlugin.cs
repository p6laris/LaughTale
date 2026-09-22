using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using LaughTale.Core.Caching;

namespace LaughTale.Core.Plugins;

/// <summary>
/// ROADMAP.v5.md Part G/L "Validation: Cache tags" - the second of the two deferred validation
/// plugins (Server Actions was the first, closed separately). Proves the <see cref="LaughTalePlugin"/>
/// extension points are expressive enough to build automatic per-island cache tagging using ONLY the
/// public plugin API - no changes to <see cref="LaughTale.Components.TagHelpers.IslandTagHelperBase"/>
/// or <see cref="LaughTaleOutputCacheExtensions"/> were needed to write this class.
///
/// Without this plugin, an app tags its own cached response by hand
/// (<c>HttpContext.Tag($"post:{id}")</c>, ROADMAP.v5.md Part F) - accurate for a page's own
/// domain-specific data, but it never knows which ISLANDS ended up on that page, so it can't
/// automatically tag "this response contains a rendering of island X" the way a CDN's automatic
/// component-level cache tagging would. This plugin closes exactly that gap: every island rendered
/// on a request accumulates an <see cref="TagFor"/> tag, applied to the response right before it's
/// cached. Evicting <c>TagFor("datatable")</c> now invalidates every cached page that happened to
/// render a datatable island, without any per-page code.
/// </summary>
public sealed class IslandCacheTagsPlugin : LaughTalePlugin
{
    private static readonly object ItemsKey = new();

    public override string Name => "IslandCacheTags";

    /// <summary>
    /// The cache tag a rendered island named <paramref name="islandName"/> is tagged with. Public so
    /// an app's own eviction code (e.g. after a mutation that affects every "datatable" island on the
    /// site) can reference the exact same string this plugin applies, without guessing the format.
    /// </summary>
    public static string TagFor(string islandName) => $"island:{islandName}";

    /// <summary>
    /// Spliced into every island render via <see cref="LaughTale.Components.TagHelpers.IslandTagHelperBase.ProcessAsync"/>
    /// (ROADMAP.v5.md Part G/L's server-lifecycle extension point) - accumulates this island's name
    /// into a request-scoped list rather than tagging immediately, since a response isn't ready to be
    /// tagged until it's about to be sent (multiple islands on one page must all contribute to the
    /// SAME response's tag set, not each call `Tag()` independently and race).
    /// </summary>
    public override ValueTask OnIslandRenderingAsync(IslandRenderingContext context)
    {
        var names = (List<string>)(context.HttpContext.Items[ItemsKey] ??= new List<string>());
        names.Add(context.IslandName);
        return ValueTask.CompletedTask;
    }

    /// <summary>
    /// Fanned out by <see cref="LaughTalePluginMiddleware"/> right before the response is sent -
    /// exactly the point <see cref="HttpContextOutputCacheTaggingExtensions.Tag"/> needs to run at
    /// (it must execute before OutputCache captures the response to have any effect, and after every
    /// island on the page has already rendered and contributed its name). No-ops cleanly when no
    /// island rendered this request, or when OutputCache isn't in the pipeline for this route -
    /// <see cref="HttpContextOutputCacheTaggingExtensions.Tag"/> already handles both.
    /// </summary>
    public override Task OnResponseStartingAsync(HttpContext context)
    {
        if (context.Items[ItemsKey] is List<string> names && names.Count > 0)
        {
            context.Tag(names.Distinct().Select(TagFor).ToArray());
        }

        return Task.CompletedTask;
    }
}
