using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using LaughTale.Core.Configuration;
using LaughTale.Core.Data;
using LaughTale.Core.Endpoints;
using LaughTale.Core.Extensions;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Microsoft.Extensions.DependencyInjection;
using Xunit;

namespace LaughTale.Tests.Security;

public class IslandDataEndpointAuthorizationTests
{
    private class TestDataRow
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
    }

    private class SimpleEndpointRouteBuilder : IEndpointRouteBuilder
    {
        public SimpleEndpointRouteBuilder(IServiceProvider serviceProvider)
        {
            ServiceProvider = serviceProvider;
        }

        public IServiceProvider ServiceProvider { get; }
        public ICollection<EndpointDataSource> DataSources { get; } = new List<EndpointDataSource>();
        public IApplicationBuilder CreateApplicationBuilder() => new ApplicationBuilder(ServiceProvider);
    }

    [Fact]
    public async Task MapIslandData_RefusesUnauthorizedUser_BeforeCallingQueryProvider()
    {
        var services = new ServiceCollection();
        services.AddLogging();
        services.AddOptions();
        services.AddRouting();
        services.AddAntiforgery();
        services.AddAuthorization(options =>
        {
            options.AddPolicy("AdminOnly", p => p.RequireRole("Admin"));
        });
        services.AddLaughTale(options =>
        {
            options.Refresh.RequireAntiforgery = false;
            options.Refresh.RequirePolicy("secret-table", "AdminOnly");
        });

        var provider = services.BuildServiceProvider();
        var routeBuilder = new SimpleEndpointRouteBuilder(provider);

        bool queryProviderCalled = false;
        routeBuilder.MapIslandData(
            "/api/data/secret-table",
            ctx =>
            {
                queryProviderCalled = true;
                return new List<TestDataRow> { new() { Id = 1, Title = "Secret" } }.AsQueryable();
            },
            IslandFieldPolicy.For("Title"),
            "secret-table");

        var endpoint = routeBuilder.DataSources
            .SelectMany(ds => ds.Endpoints)
            .OfType<RouteEndpoint>()
            .First();

        var context = new DefaultHttpContext();
        context.RequestServices = provider;
        context.Request.Path = "/api/data/secret-table";
        context.Request.ContentType = "application/json";
        var payload = "{}";
        context.Request.Body = new MemoryStream(Encoding.UTF8.GetBytes(payload));
        context.Request.ContentLength = Encoding.UTF8.GetByteCount(payload);
        context.Response.Body = new MemoryStream();
        context.User = new ClaimsPrincipal(new ClaimsIdentity()); // anonymous, not admin

        await endpoint.RequestDelegate!(context);

        // Assert 403 Forbidden
        Assert.Equal(StatusCodes.Status403Forbidden, context.Response.StatusCode);
        // Invariant I7: application queryProvider MUST NOT have been called!
        Assert.False(queryProviderCalled, "Invariant I7 violated: queryProvider was called before authorization was decided.");
    }

    [Fact]
    public async Task MapIslandData_AllowsAuthorizedUser_AndExecutesQuery()
    {
        var services = new ServiceCollection();
        services.AddLogging();
        services.AddOptions();
        services.AddRouting();
        services.AddAntiforgery();
        services.AddAuthorization(options =>
        {
            options.AddPolicy("AdminOnly", p => p.RequireRole("Admin"));
        });
        services.AddLaughTale(options =>
        {
            options.Refresh.RequireAntiforgery = false;
            options.Refresh.RequirePolicy("secret-table", "AdminOnly");
        });

        var provider = services.BuildServiceProvider();
        var routeBuilder = new SimpleEndpointRouteBuilder(provider);

        bool queryProviderCalled = false;
        routeBuilder.MapIslandData(
            "/api/data/secret-table",
            ctx =>
            {
                queryProviderCalled = true;
                return new List<TestDataRow> { new() { Id = 1, Title = "Secret" } }.AsQueryable();
            },
            IslandFieldPolicy.For("Title"),
            "secret-table");

        var endpoint = routeBuilder.DataSources
            .SelectMany(ds => ds.Endpoints)
            .OfType<RouteEndpoint>()
            .First();

        var context = new DefaultHttpContext();
        context.RequestServices = provider;
        context.Request.Path = "/api/data/secret-table";
        context.Request.ContentType = "application/json";
        var payload = "{}";
        context.Request.Body = new MemoryStream(Encoding.UTF8.GetBytes(payload));
        context.Request.ContentLength = Encoding.UTF8.GetByteCount(payload);
        context.Response.Body = new MemoryStream();
        context.User = new ClaimsPrincipal(new ClaimsIdentity(new[] { new Claim(ClaimTypes.Role, "Admin") }, "TestAuth"));

        await endpoint.RequestDelegate!(context);

        Assert.Equal(StatusCodes.Status200OK, context.Response.StatusCode);
        Assert.True(queryProviderCalled);
    }

    private class TenantedRow
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string TenantId { get; set; } = string.Empty;
    }

    private static (ServiceProvider Provider, SimpleEndpointRouteBuilder RouteBuilder) BuildAnonymousServices(params string[] anonymousIslands)
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
            foreach (var name in anonymousIslands)
            {
                options.Refresh.AllowAnonymous(name);
            }
        });

        var provider = services.BuildServiceProvider();
        return (provider, new SimpleEndpointRouteBuilder(provider));
    }

    private static DefaultHttpContext BuildAnonymousContext(ServiceProvider provider, string path)
    {
        var context = new DefaultHttpContext();
        context.RequestServices = provider;
        context.Request.Path = path;
        context.Request.ContentType = "application/json";
        const string payload = "{}";
        context.Request.Body = new MemoryStream(Encoding.UTF8.GetBytes(payload));
        context.Request.ContentLength = Encoding.UTF8.GetByteCount(payload);
        context.Response.Body = new MemoryStream();
        context.User = new ClaimsPrincipal(new ClaimsIdentity());
        return context;
    }

    [Fact]
    public void MapIslandData_TenantScopedPolicyWithoutResolver_ThrowsAtMapTime()
    {
        var (_, routeBuilder) = BuildAnonymousServices();
        var policy = IslandFieldPolicy.For("Title").WithTenantColumn("TenantId");

        var ex = Assert.Throws<InvalidOperationException>(() =>
            routeBuilder.MapIslandData(
                "/api/data/tenanted-table",
                ctx => new List<TenantedRow>().AsQueryable(),
                policy,
                "tenanted-table"));

        Assert.Contains("tenanted-table", ex.Message);
    }

    [Fact]
    public async Task MapIslandData_TenantResolver_IsInvokedAndFiltersResults()
    {
        var (provider, routeBuilder) = BuildAnonymousServices("tenanted-table");
        var policy = IslandFieldPolicy.For("Title").WithTenantColumn("TenantId");

        bool resolverCalled = false;
        routeBuilder.MapIslandData(
            "/api/data/tenanted-table",
            ctx => new List<TenantedRow>
            {
                new() { Id = 1, Title = "A", TenantId = "tenant-a" },
                new() { Id = 2, Title = "B", TenantId = "tenant-b" }
            }.AsQueryable(),
            policy,
            "tenanted-table",
            tenantResolver: ctx =>
            {
                resolverCalled = true;
                return "tenant-a";
            });

        var endpoint = routeBuilder.DataSources.SelectMany(ds => ds.Endpoints).OfType<RouteEndpoint>().First();
        var context = BuildAnonymousContext(provider, "/api/data/tenanted-table");

        await endpoint.RequestDelegate!(context);

        Assert.Equal(StatusCodes.Status200OK, context.Response.StatusCode);
        Assert.True(resolverCalled);

        context.Response.Body.Seek(0, SeekOrigin.Begin);
        var body = await new StreamReader(context.Response.Body).ReadToEndAsync();
        Assert.Contains("\"title\":\"A\"", body);
        Assert.DoesNotContain("\"title\":\"B\"", body);
    }

    [Fact]
    public async Task MapIslandData_TenantScopedResponse_CarriesNoStoreHeaders()
    {
        var (provider, routeBuilder) = BuildAnonymousServices("tenanted-table");
        var policy = IslandFieldPolicy.For("Title").WithTenantColumn("TenantId");

        routeBuilder.MapIslandData(
            "/api/data/tenanted-table",
            ctx => new List<TenantedRow> { new() { Id = 1, Title = "A", TenantId = "tenant-a" } }.AsQueryable(),
            policy,
            "tenanted-table",
            tenantResolver: ctx => "tenant-a");

        var endpoint = routeBuilder.DataSources.SelectMany(ds => ds.Endpoints).OfType<RouteEndpoint>().First();
        var context = BuildAnonymousContext(provider, "/api/data/tenanted-table");

        await endpoint.RequestDelegate!(context);

        Assert.Equal("no-store, no-cache, private", context.Response.Headers.CacheControl.ToString());
        Assert.Equal("no-cache", context.Response.Headers.Pragma.ToString());
        Assert.Equal("Cookie", context.Response.Headers.Vary.ToString());
    }

    [Fact]
    public async Task MapIslandData_NonTenantScopedResponse_CarriesNoCacheHeaders()
    {
        var (provider, routeBuilder) = BuildAnonymousServices("plain-table");

        routeBuilder.MapIslandData(
            "/api/data/plain-table",
            ctx => new List<TestDataRow> { new() { Id = 1, Title = "A" } }.AsQueryable(),
            IslandFieldPolicy.For("Title"),
            "plain-table");

        var endpoint = routeBuilder.DataSources.SelectMany(ds => ds.Endpoints).OfType<RouteEndpoint>().First();
        var context = BuildAnonymousContext(provider, "/api/data/plain-table");

        await endpoint.RequestDelegate!(context);

        Assert.Equal(StatusCodes.Status200OK, context.Response.StatusCode);
        Assert.Empty(context.Response.Headers.CacheControl.ToString());
    }
}
