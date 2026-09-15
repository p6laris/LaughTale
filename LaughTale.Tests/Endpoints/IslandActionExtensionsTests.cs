using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Antiforgery;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Microsoft.Extensions.DependencyInjection;
using LaughTale.Core.Configuration;
using LaughTale.Core.Endpoints;
using LaughTale.Core.Extensions;
using Xunit;

namespace LaughTale.Tests.Endpoints;

/// <summary>
/// Server Actions Layer 2: mirrors IslandRefreshAuthorizationTests's table-style coverage
/// (missing antiforgery -&gt; 400, denied -&gt; 403, success -&gt; 200 + server-computed props).
/// </summary>
public class IslandActionExtensionsTests
{
    private class SimpleEndpointRouteBuilder : IEndpointRouteBuilder
    {
        public IServiceProvider ServiceProvider { get; }
        public ICollection<EndpointDataSource> DataSources { get; } = new List<EndpointDataSource>();

        public SimpleEndpointRouteBuilder(IServiceProvider sp) => ServiceProvider = sp;

        public IApplicationBuilder CreateApplicationBuilder() => new ApplicationBuilder(ServiceProvider);
    }

    private record ActionProps(string Message);

    private async Task<(int StatusCode, string Body)> ExecuteActionAsync(
        string islandName,
        ClaimsPrincipal user,
        Func<HttpContext, Task<ActionProps>> action,
        Action<LaughTaleOptions>? configureOptions = null,
        Action<IslandRefreshOptions>? configureEndpoint = null,
        Action<IServiceCollection>? configureServices = null)
    {
        var services = new ServiceCollection();
        services.AddLogging();
        services.AddOptions();
        services.AddRouting();

        if (configureServices != null)
        {
            configureServices(services);
        }
        else
        {
            services.AddAntiforgery();
            services.AddAuthorization(options =>
            {
                options.AddPolicy("AdminOnly", policy => policy.RequireRole("Admin"));
            });
        }

        services.AddLaughTale(options =>
        {
            options.Refresh.RequireAntiforgery = false;
            options.Refresh.RequirePolicy("admin-action", "AdminOnly");
            configureOptions?.Invoke(options);
        });

        var provider = services.BuildServiceProvider();

        var routeBuilder = new SimpleEndpointRouteBuilder(provider);
        routeBuilder.MapLaughTaleIslandAction("/_laughtale/action/" + islandName, islandName, action, configureEndpoint);

        var matchingEndpoint = routeBuilder.DataSources
            .SelectMany(ds => ds.Endpoints)
            .OfType<RouteEndpoint>()
            .FirstOrDefault();

        if (matchingEndpoint?.RequestDelegate == null)
        {
            throw new InvalidOperationException("Island action endpoint was not registered in EndpointDataSource.");
        }

        var context = new DefaultHttpContext();
        context.RequestServices = provider;
        context.Request.Path = $"/_laughtale/action/{islandName}";
        context.Request.Body = new MemoryStream();
        context.Response.Body = new MemoryStream();
        context.User = user;

        await matchingEndpoint.RequestDelegate(context);

        context.Response.Body.Seek(0, SeekOrigin.Begin);
        var body = await new StreamReader(context.Response.Body).ReadToEndAsync();
        return (context.Response.StatusCode, body);
    }

    [Fact]
    public async Task Action_AuthorizedUser_RunsServerActionAndRendersProps()
    {
        var user = new ClaimsPrincipal(new ClaimsIdentity(new[]
        {
            new Claim(ClaimTypes.Role, "Admin")
        }, "TestAuth"));

        var actionRan = false;
        var (status, body) = await ExecuteActionAsync("admin-action", user, ctx =>
        {
            actionRan = true;
            return Task.FromResult(new ActionProps("computed-server-side"));
        });

        Assert.True(actionRan);
        Assert.Equal(200, status);
        Assert.Contains("data-island=\"admin-action\"", body);
        Assert.Contains("computed-server-side", body);
    }

    [Fact]
    public async Task Action_DeniedUser_Returns403WithZeroPropsLeaked_AndActionNeverRuns()
    {
        var user = new ClaimsPrincipal(new ClaimsIdentity(new[]
        {
            new Claim(ClaimTypes.Role, "StandardUser")
        }, "TestAuth"));

        var actionRan = false;
        var (status, body) = await ExecuteActionAsync("admin-action", user, ctx =>
        {
            actionRan = true;
            return Task.FromResult(new ActionProps("should-never-appear"));
        });

        Assert.False(actionRan);
        Assert.Equal(StatusCodes.Status403Forbidden, status);
        Assert.Empty(body);
        Assert.DoesNotContain("should-never-appear", body);
    }

    [Fact]
    public async Task Action_AnonymousUser_OnUndeclaredIsland_Returns403()
    {
        var anonymousUser = new ClaimsPrincipal(new ClaimsIdentity());

        var (status, body) = await ExecuteActionAsync("undeclared-action", anonymousUser, ctx =>
            Task.FromResult(new ActionProps("secret")));

        Assert.Equal(StatusCodes.Status403Forbidden, status);
        Assert.Empty(body);
    }

    [Fact]
    public async Task Action_MissingAntiforgeryToken_WhenRequired_Returns400()
    {
        var user = new ClaimsPrincipal(new ClaimsIdentity(new[]
        {
            new Claim(ClaimTypes.Role, "Admin")
        }, "TestAuth"));

        var (status, body) = await ExecuteActionAsync(
            "admin-action",
            user,
            ctx => Task.FromResult(new ActionProps("x")),
            configureOptions: opt => opt.Refresh.RequireAntiforgery = true);

        Assert.Equal(StatusCodes.Status400BadRequest, status);
        Assert.Empty(body);
    }

    [Fact]
    public async Task Action_ExplicitlyPublicIsland_RunsForAnonymousUser()
    {
        var anonymousUser = new ClaimsPrincipal(new ClaimsIdentity());

        var (status, body) = await ExecuteActionAsync(
            "public-action",
            anonymousUser,
            ctx => Task.FromResult(new ActionProps("public-data")),
            configureOptions: opt => opt.Refresh.AllowAnonymous("public-action"));

        Assert.Equal(200, status);
        Assert.Contains("public-data", body);
    }

    [Fact]
    public async Task Action_RequireAntiforgery_MissingAntiforgeryService_Rejects()
    {
        var user = new ClaimsPrincipal(new ClaimsIdentity(new[] { new Claim(ClaimTypes.Role, "Admin") }, "TestAuth"));

        var (status, _) = await ExecuteActionAsync(
            "admin-action",
            user,
            ctx => Task.FromResult(new ActionProps("x")),
            configureOptions: opt => opt.Refresh.RequireAntiforgery = true,
            configureServices: s => s.AddAuthorization(o => o.AddPolicy("AdminOnly", p => p.RequireRole("Admin"))));

        Assert.Equal(StatusCodes.Status400BadRequest, status);
    }
}
