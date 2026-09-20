using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.RazorPages;
using LaughTale.Components.Rendering;

namespace LaughTale.Showcase.Pages;

/// <summary>
/// ROADMAP.v5.md Part E "Out-of-order streaming" live demo: two deferred islands with REVERSED
/// artificial delays (3s declared first, 1s declared second) to prove genuine completion-order
/// delivery, not just top-to-bottom progressive flushing - if the 1s island's fragment arrives before
/// the 3s island's despite being declared second, the streaming is genuinely out-of-order.
/// </summary>
public class StreamingDemoModel : PageModel
{
    public record SlowFactProps(string Fact, int DelaySeconds);

    public Task<object?> SlowFact { get; private set; } = default!;
    public Task<object?> FastFact { get; private set; } = default!;

    public void OnGet()
    {
        ViewData.SetHead(new PageHead(Title: "Out-of-Order Streaming"));

        // Started, never awaited - <island-deferred> registers these and the response streams on
        // without blocking, delivering each fragment the moment it resolves.
        SlowFact = SimulateSlowLookupAsync("This took 3 seconds to look up.", 3);
        FastFact = SimulateSlowLookupAsync("This took only 1 second to look up.", 1);
    }

    private static async Task<object?> SimulateSlowLookupAsync(string fact, int delaySeconds)
    {
        await Task.Delay(TimeSpan.FromSeconds(delaySeconds));
        return new SlowFactProps(fact, delaySeconds);
    }
}
