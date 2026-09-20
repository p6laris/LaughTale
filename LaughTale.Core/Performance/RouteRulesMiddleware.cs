using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using LaughTale.Core.Configuration;

namespace LaughTale.Core.Performance;

/// <summary>
/// Applies a declarative per-path Cache-Control override (ROADMAP.v5.md Part E "Route rules",
/// see <see cref="RouteRulesOptions"/>). Mirrors <c>LaughTaleCspMiddleware</c>'s shape: a simple,
/// options-driven middleware that sets a response header before calling <c>_next</c>.
/// </summary>
public class RouteRulesMiddleware
{
    private readonly RequestDelegate _next;
    private readonly LaughTaleOptions _options;

    public RouteRulesMiddleware(RequestDelegate next, IOptions<LaughTaleOptions> options)
    {
        _next = next;
        _options = options.Value;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        var cacheControl = _options.RouteRules.Match(context.Request.Path.Value ?? string.Empty);
        if (cacheControl != null)
        {
            context.Response.Headers.CacheControl = cacheControl;
        }

        await _next(context);
    }
}
