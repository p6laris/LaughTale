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
}
