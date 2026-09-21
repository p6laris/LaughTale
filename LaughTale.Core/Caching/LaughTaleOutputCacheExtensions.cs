using System;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.OutputCaching;
using Microsoft.Extensions.DependencyInjection;

namespace LaughTale.Core.Caching;

/// <summary>
/// LaughTale: Cache Tags &amp; Incremental Regeneration (ROADMAP.v5.md Part F). A thin, honestly-scoped
/// wrapper over ASP.NET Core's own <c>OutputCache</c> middleware rather than a parallel caching
/// engine — it already gives this framework everything the roadmap actually needs: duration-based
/// expiration (the practical core of "incremental regeneration" — expire, then the next request
/// regenerates; no background stale-while-revalidate thread, unlike Next's ISR, and said so plainly
/// rather than silently under-delivering on the ISR comparison) and tag-based eviction (the server
/// half of "cache tags & live invalidation" — evict a tag from a mutation handler, the next request
/// for any tagged response regenerates). What LaughTale actually adds on top:
/// <see cref="HttpContextOutputCacheTaggingExtensions.Tag"/>, which lets a page tag its OWN response
/// with a RUNTIME-COMPUTED value (e.g. <c>$"post:{id}"</c>) — the built-in
/// <c>[OutputCache(Tags = [...])]</c> attribute only accepts compile-time-known literal strings.
///
/// Deliberately NOT included: the SSE/WebSocket push half ("multi-user live updates with no stateful
/// circuit") that would notify an ALREADY-OPEN browser tab the instant another user's mutation evicts
/// a tag. That is a genuinely separate, much larger feature (a persistent per-tag subscription
/// registry, a push channel, client-side reconnect/re-render handling) - this pass only makes the
/// SERVER regenerate promptly on the next request, which is the foundation any push layer would sit
/// on top of, not the push layer itself.
///
/// IMPORTANT: OutputCache's own built-in eligibility rules do NOT check a response's Cache-Control at
/// all - any base policy broader than a single known-public route MUST chain
/// <see cref="RespectNoStorePolicy"/>, or a page carrying <c>[IslandPrivate]</c>'s no-store header can
/// be cached and served to a different user. See that class's own doc comment.
/// </summary>
public static class LaughTaleOutputCacheExtensions
{
    /// <summary>
    /// Registers ASP.NET Core's <c>OutputCache</c> services. <paramref name="configure"/> passes
    /// through unchanged to <c>AddOutputCache</c> for base policies (default expiration, per-endpoint
    /// policies, etc.) - LaughTale doesn't hide or replace that surface, only adds to it.
    /// </summary>
    public static IServiceCollection AddLaughTaleOutputCache(
        this IServiceCollection services,
        Action<OutputCacheOptions>? configure = null)
    {
        // AddOutputCache's Action<OutputCacheOptions> overload throws on a null delegate rather than
        // treating it as "no extra configuration" - branch here so this method's own optional
        // parameter stays optional.
        if (configure is null)
        {
            services.AddOutputCache();
        }
        else
        {
            services.AddOutputCache(configure);
        }

        return services;
    }

    /// <summary>
    /// Registers the <c>OutputCache</c> middleware. Place before <c>MapRazorPages()</c>/the endpoint
    /// that should be cached, matching ASP.NET Core's own <c>UseOutputCache()</c> placement rules -
    /// this is a direct passthrough, not a reordering.
    /// </summary>
    public static IApplicationBuilder UseLaughTaleOutputCache(this IApplicationBuilder app) =>
        app.UseOutputCache();
}
