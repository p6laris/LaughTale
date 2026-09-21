using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.OutputCaching;
using Microsoft.AspNetCore.TestHost;
using Microsoft.Extensions.DependencyInjection;
using LaughTale.Core.Caching;
using Xunit;

namespace LaughTale.Tests.Caching;

/// <summary>
/// ROADMAP.v5.md Part F "Cache tags & live invalidation" + "Incremental regeneration": a real
/// TestServer pipeline (not a hand-rolled fake) proving LaughTale's thin wrapper over ASP.NET Core's
/// own OutputCache middleware actually caches, actually tags, and actually evicts - plus a real,
/// live-discovered gap: OutputCache's own built-in eligibility rules do NOT look at a response's
/// Cache-Control at all, so RespectNoStorePolicy exists to close it, and both the gap (unpatched) and
/// the fix (patched) are proven here, not just the fix in isolation.
/// </summary>
public class LaughTaleOutputCacheTests
{
    private static (TestServer Server, HttpClient Client) BuildServer(bool respectNoStore, int hitCount = 0)
    {
        var builder = new WebHostBuilder()
            .ConfigureServices(services =>
            {
                // OutputCache is opt-in per ASP.NET Core's own safe default (nothing is cached until a
                // policy says so - matching the [OutputCache] attribute/.CacheOutput() an app would
                // normally use on a real endpoint). This raw app.Run() pipeline has no endpoint to
                // attach an attribute to, so the test opts every request into a base policy here
                // instead - exactly what an app choosing to cache globally would do.
                services.AddLaughTaleOutputCache(options => options.AddBasePolicy(b =>
                {
                    b.Cache();
                    if (respectNoStore)
                    {
                        b.AddPolicy(typeof(RespectNoStorePolicy));
                    }
                }));
            })
            .Configure(app =>
            {
                app.UseLaughTaleOutputCache();

                var counter = hitCount;
                app.Run(async context =>
                {
                    if (context.Request.Path == "/cached")
                    {
                        counter++;
                        context.Tag("post:1");
                        await context.Response.WriteAsync($"hit {counter}");
                        return;
                    }

                    if (context.Request.Path == "/private")
                    {
                        counter++;
                        context.Response.Headers.CacheControl = "no-store, no-cache, private";
                        await context.Response.WriteAsync($"hit {counter}");
                        return;
                    }

                    await context.Response.WriteAsync("not found");
                });
            });

        var server = new TestServer(builder);
        return (server, server.CreateClient());
    }

    [Fact]
    public async Task RepeatedRequest_ToCachedPath_ServesFromCache()
    {
        var (_, client) = BuildServer(respectNoStore: true);

        var first = await client.GetStringAsync("/cached");
        var second = await client.GetStringAsync("/cached");

        Assert.Equal(first, second);
    }

    [Fact]
    public async Task EvictByTag_ForcesNextRequestToRegenerate()
    {
        var (server, client) = BuildServer(respectNoStore: true);

        var first = await client.GetStringAsync("/cached");
        var second = await client.GetStringAsync("/cached");
        Assert.Equal(first, second); // still cached

        var store = server.Services.GetRequiredService<IOutputCacheStore>();
        await store.EvictByTagAsync("post:1", default);

        var third = await client.GetStringAsync("/cached");
        Assert.NotEqual(first, third); // regenerated after eviction - the ISR-equivalent behavior
    }

    [Fact]
    public async Task WithoutRespectNoStorePolicy_OutputCacheIgnoresResponseCacheControl_AndCachesAnyway()
    {
        // Proves the real gap this pass found: ASP.NET Core's OutputCache, unpatched, does NOT look
        // at the response's own Cache-Control header for eligibility - a broad base policy would
        // cache and later serve a page carrying IslandCachePrivacy.EnforceNoStore's exact header to a
        // different user.
        var (_, client) = BuildServer(respectNoStore: false);

        var first = await client.GetStringAsync("/private");
        var second = await client.GetStringAsync("/private");

        Assert.Equal(first, second);
    }

    [Fact]
    public async Task WithRespectNoStorePolicy_NoStoreResponse_IsNeverCached()
    {
        var (_, client) = BuildServer(respectNoStore: true);

        var first = await client.GetStringAsync("/private");
        var second = await client.GetStringAsync("/private");

        Assert.NotEqual(first, second);
    }
}
