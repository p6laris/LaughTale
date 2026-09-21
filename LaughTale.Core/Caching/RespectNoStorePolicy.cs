using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.OutputCaching;

namespace LaughTale.Core.Caching;

/// <summary>
/// LaughTale: Cache Tags &amp; Incremental Regeneration (ROADMAP.v5.md Part F) - the safety piece a
/// real security-relevant gap surfaced during this pass's own live-verification: ASP.NET Core's
/// OutputCache middleware, on its own, does NOT look at a response's <c>Cache-Control</c> header for
/// caching eligibility at all (confirmed by a real TestServer request, not assumed) - its built-in
/// rules only check the HTTP method, status code, and <c>Set-Cookie</c>. That means a broad base
/// policy (e.g. <c>options.AddBasePolicy(b =&gt; b.Cache())</c>) would happily cache and later serve a
/// page carrying <c>Cache-Control: no-store, no-cache, private</c> - the EXACT header
/// <see cref="LaughTale.Core.Security.IslandCachePrivacy.EnforceNoStore"/> already sets for any page
/// containing an <c>[IslandPrivate]</c> island - to a completely different user.
///
/// This policy closes that gap: chained onto a base policy, it inspects the RESPONSE's own
/// Cache-Control after the page has rendered and disables storage when it sees <c>no-store</c> or
/// <c>private</c>, so the pre-existing privacy invariant this framework already enforces for every
/// other caching layer (see the same class's doc comment) also holds for OutputCache. Not automatic -
/// an app must chain it explicitly, since <see cref="LaughTaleOutputCacheExtensions"/> is deliberately
/// a thin, non-opinionated passthrough over ASP.NET Core's own surface (see its own doc comment):
/// <c>options.AddBasePolicy(b =&gt; b.Cache().AddPolicy(typeof(RespectNoStorePolicy)))</c> -
/// <c>AddPolicy</c> only accepts a <see cref="Type"/> (resolved via DI, hence the public parameterless
/// constructor), not an instance.
/// </summary>
public sealed class RespectNoStorePolicy : IOutputCachePolicy
{
    public ValueTask CacheRequestAsync(OutputCacheContext context, CancellationToken cancellationToken) =>
        ValueTask.CompletedTask;

    public ValueTask ServeFromCacheAsync(OutputCacheContext context, CancellationToken cancellationToken) =>
        ValueTask.CompletedTask;

    public ValueTask ServeResponseAsync(OutputCacheContext context, CancellationToken cancellationToken)
    {
        var cacheControl = context.HttpContext.Response.Headers.CacheControl.ToString();
        if (cacheControl.Contains("no-store", StringComparison.OrdinalIgnoreCase)
            || cacheControl.Contains("private", StringComparison.OrdinalIgnoreCase))
        {
            context.AllowCacheStorage = false;
        }

        return ValueTask.CompletedTask;
    }
}
