using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using LaughTale.Core.Security;
using LaughTale.Core.Serialization;

namespace LaughTale.Core.Streaming;

/// <summary>
/// LaughTale: Out-Of-Order Streaming (ROADMAP.v5.md Part E). Wraps the entire downstream request
/// pipeline (Razor Pages rendering included): <c>next()</c> returning does not close the HTTP response
/// - Razor Pages never sets <c>Content-Length</c>, so ASP.NET Core already defaults these responses to
/// chunked transfer encoding - so this middleware can keep writing and flushing more bytes to the same
/// response afterward. Once the shell has rendered (any `&lt;island-deferred&gt;` on the page has
/// registered its still-pending task in <see cref="DeferredIslandRegistry"/>), this drains that
/// registry with <see cref="Task.WhenAny(Task[])"/>, writing each island's real markup as a late
/// fragment the moment its own task resolves - in COMPLETION order, not declaration order, which is
/// what makes this genuinely out-of-order rather than simple top-to-bottom progressive flushing.
/// </summary>
public class OutOfOrderStreamingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<OutOfOrderStreamingMiddleware> _logger;

    public OutOfOrderStreamingMiddleware(RequestDelegate next, ILogger<OutOfOrderStreamingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        await _next(context);

        if (context.Items[typeof(DeferredIslandRegistry)] is not DeferredIslandRegistry registry || registry.Entries.Count == 0)
        {
            return;
        }

        // Push the shell (and any headers <island-deferred> set, e.g. Cache-Control: no-store) now,
        // before waiting on anything.
        await context.Response.Body.FlushAsync(context.RequestAborted);

        var pending = registry.Entries
            .Select(entry => AwaitWithTimeout(entry, context.RequestAborted))
            .ToList();

        while (pending.Count > 0)
        {
            var completed = await Task.WhenAny(pending); // completion order - the actual "out-of-order" part
            pending.Remove(completed);
            var (entry, result, error) = await completed;

            if (error != null)
            {
                _logger.LogError(error, "LaughTale deferred island '{Name}' failed to resolve.", entry.Name);
            }

            var fragment = error is null
                ? BuildResolvedFragment(context, entry, result)
                : BuildErrorFragment(context, entry);

            await context.Response.WriteAsync(fragment, context.RequestAborted);
            await context.Response.Body.FlushAsync(context.RequestAborted);
        }
    }

    private static async Task<(DeferredIslandEntry Entry, object? Result, Exception? Error)> AwaitWithTimeout(
        DeferredIslandEntry entry, System.Threading.CancellationToken requestAborted)
    {
        using var timeoutCts = System.Threading.CancellationTokenSource.CreateLinkedTokenSource(requestAborted);
        timeoutCts.CancelAfter(entry.Timeout);

        try
        {
            var timeoutTask = Task.Delay(System.Threading.Timeout.Infinite, timeoutCts.Token);
            var winner = await Task.WhenAny(entry.PropsTask, timeoutTask);
            if (winner != entry.PropsTask)
            {
                throw new TimeoutException($"Deferred island '{entry.Name}' exceeded its {entry.Timeout.TotalSeconds}s timeout.");
            }

            return (entry, await entry.PropsTask, null);
        }
        catch (Exception ex)
        {
            return (entry, null, ex);
        }
    }

    private static string BuildResolvedFragment(HttpContext context, DeferredIslandEntry entry, object? props)
    {
        var serializedProps = IslandJson.SerializeProps(props);
        var nonceAttr = GetNonceAttribute(context);
        var id = entry.PlaceholderId;
        var tplId = id + "-tpl";

        var template = "<template id=\"" + tplId + "\"><div data-island=\"" + WebUtility.HtmlEncode(entry.Name)
            + "\" data-props=\"" + WebUtility.HtmlEncode(serializedProps) + "\" data-hydrate=\""
            + WebUtility.HtmlEncode(entry.HydrateStrategy) + "\"></div></template>";

        var script = "<script" + nonceAttr + ">(function(){"
            + "var p=document.getElementById(\"" + id + "\");"
            + "var t=document.getElementById(\"" + tplId + "\");"
            + "if(p&&t){p.replaceWith(t.content.cloneNode(true));t.remove();}"
            + "if(window.LaughTale&&window.LaughTale.initIslands){window.LaughTale.initIslands();}"
            + "})();</script>\n";

        return template + "\n" + script;
    }

    private static string BuildErrorFragment(HttpContext context, DeferredIslandEntry entry)
    {
        var nonceAttr = GetNonceAttribute(context);
        var id = entry.PlaceholderId;

        // Deliberately generic - never leak the real exception message/stack to the client, matching
        // the "zero props leaked" invariant IslandEndpointExtensions' 403 path already enforces. The
        // real error was already logged server-side above.
        return "<script" + nonceAttr + ">(function(){"
            + "var p=document.getElementById(\"" + id + "\");"
            + "if(p){p.textContent=\"Failed to load.\";p.setAttribute(\"data-island-error\",\"true\");}"
            + "})();</script>\n";
    }

    private static string GetNonceAttribute(HttpContext context)
    {
        if (context.Items.TryGetValue(HttpContextCspNonceProvider.HttpContextItemKey, out var nonce) && nonce is string nonceStr && !string.IsNullOrWhiteSpace(nonceStr))
        {
            return $" nonce=\"{WebUtility.HtmlEncode(nonceStr)}\"";
        }

        return string.Empty;
    }
}
