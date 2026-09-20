using Microsoft.AspNetCore.Builder;

namespace LaughTale.Core.Streaming;

public static class LaughTaleStreamingExtensions
{
    /// <summary>
    /// Enables out-of-order streaming (ROADMAP.v5.md Part E): any page using
    /// <c>&lt;island-deferred&gt;</c> will have its late-resolving islands delivered as fragments after
    /// the shell, in completion order, instead of blocking the whole response until every island's data
    /// is ready. Register early in the pipeline, before <c>UseRouting</c>.
    /// </summary>
    public static IApplicationBuilder UseLaughTaleOutOfOrderStreaming(this IApplicationBuilder app)
    {
        return app.UseMiddleware<OutOfOrderStreamingMiddleware>();
    }
}
