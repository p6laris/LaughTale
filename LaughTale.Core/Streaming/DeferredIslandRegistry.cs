using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace LaughTale.Core.Streaming;

/// <summary>
/// One deferred island registered by <c>&lt;island-deferred&gt;</c> during shell rendering: a stable
/// placeholder id, the island's name, its still-pending props <see cref="Task"/> (started, never
/// awaited, by the PageModel), and a per-island timeout.
/// </summary>
internal sealed record DeferredIslandEntry(
    string PlaceholderId,
    string Name,
    Task<object?> PropsTask,
    TimeSpan Timeout,
    string HydrateStrategy);

/// <summary>
/// LaughTale: Out-Of-Order Streaming (ROADMAP.v5.md Part E). A request-scoped
/// (<see cref="HttpContext.Items"/>) list of islands whose data hadn't resolved by the time the shell
/// finished rendering. <c>IslandDeferredTagHelper</c> populates this during the normal Razor Pages
/// render pass; <c>OutOfOrderStreamingMiddleware</c> drains it afterward, writing each entry's real
/// markup as a late fragment the moment its task resolves.
/// </summary>
internal sealed class DeferredIslandRegistry
{
    public List<DeferredIslandEntry> Entries { get; } = new();

    public static DeferredIslandRegistry GetOrCreate(HttpContext context)
    {
        if (context.Items[typeof(DeferredIslandRegistry)] is DeferredIslandRegistry existing)
        {
            return existing;
        }

        var registry = new DeferredIslandRegistry();
        context.Items[typeof(DeferredIslandRegistry)] = registry;
        return registry;
    }
}
