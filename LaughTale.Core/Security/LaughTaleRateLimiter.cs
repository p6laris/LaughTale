using System;
using System.Threading.RateLimiting;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using LaughTale.Core.Configuration;

namespace LaughTale.Core.Security;

/// <summary>
/// Per-client request-rate limiting for LaughTale's island POST endpoints (ROADMAP.v5.md Part H).
/// Applied manually inside each endpoint handler - the same way the antiforgery and authorization
/// checks already are in <c>IslandEndpointExtensions</c>/<c>IslandActionExtensions</c> - rather than
/// via ASP.NET Core's <c>UseRateLimiter()</c> pipeline middleware. Neither of this repo's two real
/// Program.cs examples (LaughTale.Showcase, the laughtale-web template) calls <c>UseRateLimiter()</c>
/// today, and this endpoint code has no way to add pipeline middleware retroactively - metadata-based
/// enforcement would ship silently inert for any consumer who just calls Map...() and nothing else,
/// the same "built but never wired up" trap already found and fixed twice elsewhere this pass
/// (the directives double-init bug, the antiforgery TagHelper-matching assumption).
/// </summary>
public sealed class LaughTaleRateLimiter : IDisposable
{
    private readonly IOptions<LaughTaleOptions> _options;
    private readonly PartitionedRateLimiter<HttpContext> _limiter;

    public LaughTaleRateLimiter(IOptions<LaughTaleOptions> options)
    {
        _options = options;
        _limiter = PartitionedRateLimiter.Create<HttpContext, string>(ResolvePartition);
    }

    /// <summary>
    /// Attempts to acquire one permit for <paramref name="context"/>'s client. Returns false when the
    /// caller should be rejected with 429 Too Many Requests.
    /// </summary>
    public async Task<bool> TryAcquireAsync(HttpContext context)
    {
        using var lease = await _limiter.AcquireAsync(context, permitCount: 1);
        return lease.IsAcquired;
    }

    private RateLimitPartition<string> ResolvePartition(HttpContext context)
    {
        var rateLimit = _options.Value.RateLimit;
        var key = ResolvePartitionKey(context, rateLimit.PartitionByUser);

        if (!rateLimit.Enabled)
        {
            return RateLimitPartition.GetNoLimiter(key);
        }

        return RateLimitPartition.GetSlidingWindowLimiter(key, _ => new SlidingWindowRateLimiterOptions
        {
            PermitLimit = Math.Max(1, rateLimit.PermitLimit),
            Window = TimeSpan.FromSeconds(Math.Max(1, rateLimit.WindowSeconds)),
            SegmentsPerWindow = 4,
            QueueLimit = 0,
            AutoReplenishment = true,
        });
    }

    private static string ResolvePartitionKey(HttpContext context, bool partitionByUser)
    {
        if (partitionByUser && context.User?.Identity?.IsAuthenticated == true && !string.IsNullOrEmpty(context.User.Identity.Name))
        {
            return $"user:{context.User.Identity.Name}";
        }

        return $"ip:{context.Connection.RemoteIpAddress?.ToString() ?? "unknown"}";
    }

    public void Dispose() => _limiter.Dispose();
}
