using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.TestHost;
using Microsoft.Extensions.DependencyInjection;
using LaughTale.Core.Diagnostics;
using LaughTale.Core.Endpoints;
using Xunit;

namespace LaughTale.Tests.Diagnostics;

/// <summary>
/// ROADMAP.v5.md Part H "instrumentation hook": a real TestServer request proving
/// MapLaughTaleIslandTelemetry turns a client-reported hydration duration into a real
/// System.Diagnostics.Activity under LaughTaleActivitySource - closing the loop between server
/// render spans and client hydration timing under one exportable ActivitySource.
/// </summary>
public class IslandTelemetryEndpointTests
{
    private static (TestServer Server, HttpClient Client) BuildServer()
    {
        var builder = new WebHostBuilder()
            .ConfigureServices(services => services.AddRouting())
            .Configure(app =>
            {
                app.UseRouting();
                app.UseEndpoints(endpoints => endpoints.MapLaughTaleIslandTelemetry());
            });

        var server = new TestServer(builder);
        return (server, server.CreateClient());
    }

    [Fact]
    public async Task PostHydrationTelemetry_ValidPayload_CreatesTaggedActivity()
    {
        var (_, client) = BuildServer();

        // Filters by operation name, not just source: xUnit runs test classes in parallel by
        // default, and LaughTaleActivitySourceTests creates "island.render" activities under the
        // SAME ActivitySource concurrently - a listener scoped only to the source would see those too.
        var recorded = new List<Activity>();
        var listener = new ActivityListener
        {
            ShouldListenTo = source => source.Name == LaughTaleActivitySource.Name,
            Sample = (ref ActivityCreationOptions<ActivityContext> _) => ActivitySamplingResult.AllData,
            ActivityStopped = activity => { if (activity.OperationName == "island.hydrate") recorded.Add(activity); }
        };
        ActivitySource.AddActivityListener(listener);

        try
        {
            var body = new StringContent(
                "{\"name\":\"datatable\",\"durationMs\":42.5,\"strategy\":\"load\"}",
                Encoding.UTF8, "application/json");

            var response = await client.PostAsync("/_laughtale/telemetry/hydration", body);

            response.EnsureSuccessStatusCode();
            var activity = Assert.Single(recorded);
            Assert.Equal("island.hydrate", activity.OperationName);
            Assert.Equal("datatable", activity.GetTagItem("island.name"));
            Assert.Equal(42.5, activity.GetTagItem("island.hydrate.duration_ms"));
            Assert.Equal("load", activity.GetTagItem("island.hydrate.strategy"));
        }
        finally
        {
            listener.Dispose();
        }
    }

    [Fact]
    public async Task PostHydrationTelemetry_MalformedJson_ReturnsNoContent_DoesNotThrow()
    {
        var (_, client) = BuildServer();

        var body = new StringContent("not json at all", Encoding.UTF8, "application/json");
        var response = await client.PostAsync("/_laughtale/telemetry/hydration", body);

        Assert.Equal(System.Net.HttpStatusCode.NoContent, response.StatusCode);
    }

    [Fact]
    public async Task PostHydrationTelemetry_MissingName_ReturnsNoContent_CreatesNoActivity()
    {
        var (_, client) = BuildServer();

        var recorded = new List<Activity>();
        var listener = new ActivityListener
        {
            ShouldListenTo = source => source.Name == LaughTaleActivitySource.Name,
            Sample = (ref ActivityCreationOptions<ActivityContext> _) => ActivitySamplingResult.AllData,
            ActivityStopped = activity => { if (activity.OperationName == "island.hydrate") recorded.Add(activity); }
        };
        ActivitySource.AddActivityListener(listener);

        try
        {
            var body = new StringContent("{\"durationMs\":10}", Encoding.UTF8, "application/json");
            var response = await client.PostAsync("/_laughtale/telemetry/hydration", body);

            Assert.Equal(System.Net.HttpStatusCode.NoContent, response.StatusCode);
            Assert.Empty(recorded);
        }
        finally
        {
            listener.Dispose();
        }
    }

    [Fact]
    public async Task PostHydrationTelemetry_NegativeDuration_ReturnsNoContent_CreatesNoActivity()
    {
        var (_, client) = BuildServer();

        var recorded = new List<Activity>();
        var listener = new ActivityListener
        {
            ShouldListenTo = source => source.Name == LaughTaleActivitySource.Name,
            Sample = (ref ActivityCreationOptions<ActivityContext> _) => ActivitySamplingResult.AllData,
            ActivityStopped = activity => { if (activity.OperationName == "island.hydrate") recorded.Add(activity); }
        };
        ActivitySource.AddActivityListener(listener);

        try
        {
            var body = new StringContent("{\"name\":\"x\",\"durationMs\":-5}", Encoding.UTF8, "application/json");
            var response = await client.PostAsync("/_laughtale/telemetry/hydration", body);

            Assert.Equal(System.Net.HttpStatusCode.NoContent, response.StatusCode);
            Assert.Empty(recorded);
        }
        finally
        {
            listener.Dispose();
        }
    }
}
