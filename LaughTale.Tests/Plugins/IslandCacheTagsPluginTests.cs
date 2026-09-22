using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.OutputCaching;
using Microsoft.AspNetCore.TestHost;
using Microsoft.Extensions.DependencyInjection;
using LaughTale.Core.Caching;
using LaughTale.Core.Extensions;
using LaughTale.Core.Plugins;
using Xunit;

namespace LaughTale.Tests.Plugins;

/// <summary>
/// ROADMAP.v5.md Part G/L "Validation: Cache tags" - proves <see cref="IslandCacheTagsPlugin"/>
/// actually tags and evicts through a real TestServer pipeline (not a hand-rolled fake), matching
/// LaughTaleOutputCacheTests's own precedent for Part F's cache-tags work. Islands aren't rendered by
/// real Razor Pages here (that splice point - IslandTagHelperBase.ProcessAsync calling
/// OnIslandRenderingAsync - is exercised elsewhere); this test calls the plugin's own
/// OnIslandRenderingAsync directly to stand in for it, so what's actually under test is the plugin's
/// own accumulate-then-tag logic and its real wiring through LaughTalePluginMiddleware's OnStarting
/// fan-out into OutputCache - not Razor rendering itself.
/// </summary>
public class IslandCacheTagsPluginTests
{
    private static (TestServer Server, HttpClient Client) BuildServer()
    {
        var plugin = new IslandCacheTagsPlugin();

        var builder = new WebHostBuilder()
            .ConfigureServices(services =>
            {
                services.AddLaughTalePlugin(plugin);
                services.AddLaughTaleOutputCache(options => options.AddBasePolicy(b => b.Cache()));
            })
            .Configure(app =>
            {
                // Matches LaughTalePluginMiddleware's own doc comment ("register early, before
                // UseRouting()") and this session's real Program.cs fix registering it the same way.
                app.UseMiddleware<LaughTalePluginMiddleware>();
                app.UseLaughTaleOutputCache();

                var counter = 0;
                app.Run(async context =>
                {
                    if (context.Request.Path == "/page-with-islands")
                    {
                        counter++;
                        // Stands in for two <island> tags rendering on this page - real Razor
                        // rendering calls this same method from IslandTagHelperBase.ProcessAsync.
                        await plugin.OnIslandRenderingAsync(new IslandRenderingContext
                        {
                            IslandName = "datatable",
                            HttpContext = context,
                            Output = null!
                        });
                        await plugin.OnIslandRenderingAsync(new IslandRenderingContext
                        {
                            IslandName = "sidebar",
                            HttpContext = context,
                            Output = null!
                        });
                        await context.Response.WriteAsync($"hit {counter}");
                        return;
                    }

                    if (context.Request.Path == "/page-without-islands")
                    {
                        counter++;
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
    public async Task EvictByIslandTag_ForcesRegeneration_OfEveryPageThatRenderedThatIsland()
    {
        var (server, client) = BuildServer();

        var first = await client.GetStringAsync("/page-with-islands");
        var second = await client.GetStringAsync("/page-with-islands");
        Assert.Equal(first, second); // cached, tagged automatically by the plugin - no manual Tag() call anywhere in this handler

        var store = server.Services.GetRequiredService<IOutputCacheStore>();
        await store.EvictByTagAsync(IslandCacheTagsPlugin.TagFor("datatable"), default);

        var third = await client.GetStringAsync("/page-with-islands");
        Assert.NotEqual(first, third); // evicting the auto-applied island tag forced regeneration
    }

    [Fact]
    public async Task EvictBySidebarTag_AlsoForcesRegeneration_ProvingBothIslandsWereTagged()
    {
        var (server, client) = BuildServer();

        var first = await client.GetStringAsync("/page-with-islands");
        var second = await client.GetStringAsync("/page-with-islands");
        Assert.Equal(first, second);

        var store = server.Services.GetRequiredService<IOutputCacheStore>();
        // Evicting by the SECOND island's tag, not the first - proves both islands rendered on the
        // same response each contributed their own tag, not just the first one seen.
        await store.EvictByTagAsync(IslandCacheTagsPlugin.TagFor("sidebar"), default);

        var third = await client.GetStringAsync("/page-with-islands");
        Assert.NotEqual(first, third);
    }

    [Fact]
    public async Task PageWithNoIslands_IsStillCached_JustNeverAutoTagged()
    {
        var (_, client) = BuildServer();

        var first = await client.GetStringAsync("/page-without-islands");
        var second = await client.GetStringAsync("/page-without-islands");

        // Caching itself is OutputCache's own job, unaffected by whether this plugin found anything
        // to tag - the plugin must be a pure no-op addition, never a caching precondition.
        Assert.Equal(first, second);
    }

    [Fact]
    public async Task UnrelatedIslandTag_DoesNotEvictAPageThatNeverRenderedThatIsland()
    {
        var (server, client) = BuildServer();

        var first = await client.GetStringAsync("/page-with-islands");

        var store = server.Services.GetRequiredService<IOutputCacheStore>();
        await store.EvictByTagAsync(IslandCacheTagsPlugin.TagFor("never-rendered-anywhere"), default);

        var second = await client.GetStringAsync("/page-with-islands");
        Assert.Equal(first, second); // still cached - an unrelated tag must not evict this entry
    }
}
