using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Microsoft.Extensions.DependencyInjection;
using LaughTale.Core.Configuration;
using LaughTale.Core.Endpoints;
using LaughTale.Core.Extensions;
using Xunit;

namespace LaughTale.Tests.Security;

/// <summary>
/// ROADMAP.v5.md Part H: per-client rate limiting on the island POST endpoints. Mirrors
/// IslandRefreshAuthorizationTests's harness (a manually-driven IEndpointRouteBuilder, invoking the
/// registered RequestDelegate directly) rather than exercising Microsoft.AspNetCore.RateLimiting's own
/// pipeline middleware - LaughTaleRateLimiter is applied manually inside the handler, deliberately not
/// dependent on UseRateLimiter() ever being wired into a consuming app's pipeline.
/// </summary>
public class RateLimitingTests
{
    private class SimpleEndpointRouteBuilder : IEndpointRouteBuilder
    {
        public IServiceProvider ServiceProvider { get; }
        public ICollection<EndpointDataSource> DataSources { get; } = new List<EndpointDataSource>();

        public SimpleEndpointRouteBuilder(IServiceProvider sp) => ServiceProvider = sp;

        public IApplicationBuilder CreateApplicationBuilder() => new ApplicationBuilder(ServiceProvider);
    }

    private static (IServiceProvider Provider, RouteEndpoint Endpoint) BuildRefreshEndpoint(Action<LaughTaleOptions>? configureOptions = null)
    {
        var services = new ServiceCollection();
        services.AddLogging();
        services.AddOptions();
        services.AddRouting();
        services.AddAntiforgery();
        services.AddAuthorization();

        services.AddLaughTale(options =>
        {
            options.Refresh.RequireAntiforgery = false;
            options.Refresh.AllowUndeclaredIslands = true;
            configureOptions?.Invoke(options);
        });

        var provider = services.BuildServiceProvider();
        var routeBuilder = new SimpleEndpointRouteBuilder(provider);
        routeBuilder.MapLaughTaleIslandRefresh();

        var endpoint = routeBuilder.DataSources
            .SelectMany(ds => ds.Endpoints)
            .OfType<RouteEndpoint>()
            .First();

        return (provider, endpoint);
    }

    private static async Task<int> ExecuteRefreshAsync(
        IServiceProvider provider,
        RouteEndpoint endpoint,
        ClaimsPrincipal? user = null,
        string? remoteIp = null)
    {
        var context = new DefaultHttpContext();
        context.RequestServices = provider;
        context.Request.Path = "/_laughtale/island/public-counter";
        context.Request.RouteValues["name"] = "public-counter";
        context.Request.Body = new MemoryStream();
        context.Response.Body = new MemoryStream();
        context.User = user ?? new ClaimsPrincipal(new ClaimsIdentity());
        if (remoteIp != null)
        {
            context.Connection.RemoteIpAddress = IPAddress.Parse(remoteIp);
        }

        await endpoint.RequestDelegate!(context);
        return context.Response.StatusCode;
    }

    [Fact]
    public async Task Refresh_ExceedsPermitLimit_Returns429()
    {
        var (provider, endpoint) = BuildRefreshEndpoint(options =>
        {
            options.RateLimit.Enabled = true;
            options.RateLimit.PermitLimit = 2;
            options.RateLimit.WindowSeconds = 60;
        });

        var status1 = await ExecuteRefreshAsync(provider, endpoint, remoteIp: "10.0.0.1");
        var status2 = await ExecuteRefreshAsync(provider, endpoint, remoteIp: "10.0.0.1");
        var status3 = await ExecuteRefreshAsync(provider, endpoint, remoteIp: "10.0.0.1");

        Assert.Equal(200, status1);
        Assert.Equal(200, status2);
        Assert.Equal(StatusCodes.Status429TooManyRequests, status3);
    }

    [Fact]
    public async Task Refresh_Disabled_NeverRejectsEvenBeyondPermitLimit()
    {
        var (provider, endpoint) = BuildRefreshEndpoint(options =>
        {
            options.RateLimit.Enabled = false;
            options.RateLimit.PermitLimit = 1;
            options.RateLimit.WindowSeconds = 60;
        });

        for (var i = 0; i < 5; i++)
        {
            var status = await ExecuteRefreshAsync(provider, endpoint, remoteIp: "10.0.0.2");
            Assert.Equal(200, status);
        }
    }

    [Fact]
    public async Task Refresh_DifferentRemoteIps_HaveIndependentLimits()
    {
        var (provider, endpoint) = BuildRefreshEndpoint(options =>
        {
            options.RateLimit.Enabled = true;
            options.RateLimit.PermitLimit = 1;
            options.RateLimit.WindowSeconds = 60;
        });

        var statusA1 = await ExecuteRefreshAsync(provider, endpoint, remoteIp: "10.0.0.10");
        var statusB1 = await ExecuteRefreshAsync(provider, endpoint, remoteIp: "10.0.0.20");
        var statusA2 = await ExecuteRefreshAsync(provider, endpoint, remoteIp: "10.0.0.10");

        Assert.Equal(200, statusA1);
        Assert.Equal(200, statusB1);
        Assert.Equal(StatusCodes.Status429TooManyRequests, statusA2);
    }

    [Fact]
    public async Task Refresh_AuthenticatedUsers_PartitionByUserNameNotSharedIp()
    {
        var (provider, endpoint) = BuildRefreshEndpoint(options =>
        {
            options.RateLimit.Enabled = true;
            options.RateLimit.PermitLimit = 1;
            options.RateLimit.WindowSeconds = 60;
        });

        var alice = new ClaimsPrincipal(new ClaimsIdentity(new[] { new Claim(ClaimTypes.Name, "alice") }, "TestAuth"));
        var bob = new ClaimsPrincipal(new ClaimsIdentity(new[] { new Claim(ClaimTypes.Name, "bob") }, "TestAuth"));

        // Same remote IP, different authenticated users - must not share a bucket.
        var statusAlice = await ExecuteRefreshAsync(provider, endpoint, user: alice, remoteIp: "10.0.0.99");
        var statusBob = await ExecuteRefreshAsync(provider, endpoint, user: bob, remoteIp: "10.0.0.99");

        Assert.Equal(200, statusAlice);
        Assert.Equal(200, statusBob);
    }

    [Fact]
    public async Task Refresh_DefaultOptions_RateLimitingIsOffAndNeverRejects()
    {
        // Unlike RequireAntiforgery, this must default OFF (see the remarks on
        // LaughTaleOptions.RateLimit) - enabling a request limit by default would silently start
        // rejecting traffic for every existing consumer the moment it upgrades. Regression guard for
        // the real failure this caused during development: AllowUndeclaredIslandsCompatibilityTests'
        // 50-consecutive-request test started failing the moment a default PermitLimit was active.
        var (provider, endpoint) = BuildRefreshEndpoint();

        for (var i = 0; i < 50; i++)
        {
            var status = await ExecuteRefreshAsync(provider, endpoint, remoteIp: "10.0.0.50");
            Assert.Equal(200, status);
        }
    }
}
