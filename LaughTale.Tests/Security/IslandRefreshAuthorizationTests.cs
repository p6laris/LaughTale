using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Security.Claims;
using System.Text;
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

namespace LaughTale.Tests.Security;

public class IslandRefreshAuthorizationTests
{
    private class SimpleEndpointRouteBuilder : IEndpointRouteBuilder
    {
        public IServiceProvider ServiceProvider { get; }
        public ICollection<EndpointDataSource> DataSources { get; } = new List<EndpointDataSource>();

        public SimpleEndpointRouteBuilder(IServiceProvider sp) => ServiceProvider = sp;

        public IApplicationBuilder CreateApplicationBuilder() => new ApplicationBuilder(ServiceProvider);
    }

    private async Task<(int StatusCode, string Body)> ExecuteRefreshAsync(
        string islandName,
        string payloadJson,
        ClaimsPrincipal user,
        Action<LaughTaleOptions>? configureOptions = null,
        Action<IslandRefreshOptions>? configureEndpoint = null,
        Action<HttpContext>? configureContext = null,
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
                options.AddPolicy("PremiumOnly", policy => policy.RequireClaim("tier", "premium"));
            });
        }

        services.AddLaughTale(options =>
        {
            options.Refresh.RequireAntiforgery = false; // Default isolated for auth testing unless enabled
            options.Refresh.RequirePolicy("admin-panel", "AdminOnly");
            options.Refresh.RequirePolicy("premium-chart", "PremiumOnly");
            configureOptions?.Invoke(options);
        });

        var provider = services.BuildServiceProvider();

        var routeBuilder = new SimpleEndpointRouteBuilder(provider);
        routeBuilder.MapLaughTaleIslandRefresh("/_laughtale/island/{name}", configureEndpoint);

        var matchingEndpoint = routeBuilder.DataSources
            .SelectMany(ds => ds.Endpoints)
            .OfType<RouteEndpoint>()
            .FirstOrDefault(e => e.RoutePattern.RawText?.Contains("island") == true);

        if (matchingEndpoint?.RequestDelegate == null)
        {
            throw new InvalidOperationException("Island refresh endpoint was not registered in EndpointDataSource.");
        }

        var context = new DefaultHttpContext();
        context.RequestServices = provider;
        context.Request.Path = $"/_laughtale/island/{islandName}";
        context.Request.RouteValues["name"] = islandName;
        context.Request.Body = new MemoryStream(Encoding.UTF8.GetBytes(payloadJson));
        context.Request.ContentLength = Encoding.UTF8.GetByteCount(payloadJson);
        context.Response.Body = new MemoryStream();
        context.User = user;

        configureContext?.Invoke(context);

        await matchingEndpoint.RequestDelegate(context);

        context.Response.Body.Seek(0, SeekOrigin.Begin);
        var body = await new StreamReader(context.Response.Body).ReadToEndAsync();
        return (context.Response.StatusCode, body);
    }

    [Fact]
    public async Task Refresh_AuthorizedUser_RendersIslandHtmlAndProps()
    {
        var user = new ClaimsPrincipal(new ClaimsIdentity(new[]
        {
            new Claim(ClaimTypes.Name, "Alice"),
            new Claim(ClaimTypes.Role, "Admin")
        }, "TestAuth"));

        var (status, body) = await ExecuteRefreshAsync("admin-panel", "{\"reportId\":123}", user);

        Assert.Equal(200, status);
        Assert.Contains("data-island=\"admin-panel\"", body);
        Assert.Contains("data-props=", body);
        Assert.Contains("reportId", body);
    }

    [Fact]
    public async Task Refresh_RevokedPolicy_Returns403WithZeroHtmlOrPropsLeaked()
    {
        // 1. Authorized session calls refresh
        var authorizedUser = new ClaimsPrincipal(new ClaimsIdentity(new[]
        {
            new Claim(ClaimTypes.Name, "Bob"),
            new Claim(ClaimTypes.Role, "Admin")
        }, "TestAuth"));

        var (status1, body1) = await ExecuteRefreshAsync("admin-panel", "{\"secretKey\":\"confidential-data\"}", authorizedUser);
        Assert.Equal(200, status1);
        Assert.Contains("confidential-data", body1);

        // 2. Same session, but Admin policy/role revoked without reloading page
        var revokedUser = new ClaimsPrincipal(new ClaimsIdentity(new[]
        {
            new Claim(ClaimTypes.Name, "Bob"),
            new Claim(ClaimTypes.Role, "StandardUser")
        }, "TestAuth"));

        var (status2, body2) = await ExecuteRefreshAsync("admin-panel", "{\"secretKey\":\"confidential-data\"}", revokedUser);

        // Assert 403 Forbidden with empty body and 0 props leaked
        Assert.Equal(StatusCodes.Status403Forbidden, status2);
        Assert.Empty(body2);
        Assert.DoesNotContain("confidential-data", body2);
        Assert.DoesNotContain("data-island", body2);
        Assert.DoesNotContain("data-props", body2);
    }

    [Fact]
    public async Task Refresh_AnonymousUser_OnProtectedIsland_Returns403()
    {
        var anonymousUser = new ClaimsPrincipal(new ClaimsIdentity());

        var (status, body) = await ExecuteRefreshAsync("premium-chart", "{\"chartData\":\"secret\"}", anonymousUser);

        Assert.Equal(StatusCodes.Status403Forbidden, status);
        Assert.Empty(body);
    }

    [Fact]
    public async Task Refresh_UndeclaredIsland_Returns403()
    {
        var anonymousUser = new ClaimsPrincipal(new ClaimsIdentity());

        var (status, body) = await ExecuteRefreshAsync("public-counter", "{\"count\":5}", anonymousUser);

        Assert.Equal(StatusCodes.Status403Forbidden, status);
        Assert.Empty(body);
    }

    [Fact]
    public async Task Refresh_ExplicitlyPublicIsland_RendersNormally()
    {
        var anonymousUser = new ClaimsPrincipal(new ClaimsIdentity());

        var (status, body) = await ExecuteRefreshAsync(
            "public-counter",
            "{\"count\":5}",
            anonymousUser,
            configureOptions: opt => opt.Refresh.AllowAnonymous("public-counter"));

        Assert.Equal(200, status);
        Assert.Contains("data-island=\"public-counter\"", body);
    }

    [Fact]
    public async Task Refresh_AntiforgeryValidation_BlocksMissingTokenWhenRequired()
    {
        var user = new ClaimsPrincipal(new ClaimsIdentity(new[]
        {
            new Claim(ClaimTypes.Name, "Alice"),
            new Claim(ClaimTypes.Role, "Admin")
        }, "TestAuth"));

        // Enable antiforgery requirement
        var (status, body) = await ExecuteRefreshAsync(
            "admin-panel",
            "{\"reportId\":123}",
            user,
            configureOptions: opt => opt.Refresh.RequireAntiforgery = true);

        // Missing antiforgery token must return 400 Bad Request
        Assert.Equal(StatusCodes.Status400BadRequest, status);
        Assert.Empty(body);
    }

    [Fact]
    public async Task Refresh_RegisteredPolicy_MissingAuthorizationService_Refuses()
    {
        var user = new ClaimsPrincipal(new ClaimsIdentity(new[] { new Claim(ClaimTypes.Role, "Admin") }, "TestAuth"));
        var (status, body) = await ExecuteRefreshAsync(
            "admin-panel",
            "{}",
            user,
            configureServices: s =>
            {
                // Antiforgery registered, but AddAuthorization omitted
                s.AddAntiforgery();
            });

        Assert.Equal(StatusCodes.Status403Forbidden, status);
        Assert.Empty(body);
    }

    [Fact]
    public async Task Refresh_RequireAntiforgery_MissingAntiforgeryService_Rejects()
    {
        var user = new ClaimsPrincipal(new ClaimsIdentity(new[] { new Claim(ClaimTypes.Role, "Admin") }, "TestAuth"));
        var (status, body) = await ExecuteRefreshAsync(
            "admin-panel",
            "{}",
            user,
            configureOptions: opt => opt.Refresh.RequireAntiforgery = true,
            configureServices: s =>
            {
                // AddAuthorization registered, but AddAntiforgery omitted
                s.AddAuthorization(o => o.AddPolicy("AdminOnly", p => p.RequireRole("Admin")));
            });

        Assert.Equal(StatusCodes.Status400BadRequest, status);
    }

    [Fact]
    public async Task Invariant_I1_I6_RefusalsAreByteIdenticalAndDiagnosticReasonNeverLeaks()
    {
        var anonymousUser = new ClaimsPrincipal(new ClaimsIdentity());

        // Denied: policy exists, caller lacks permission
        var (deniedStatus, deniedBody) = await ExecuteRefreshAsync("admin-panel", "{}", anonymousUser);

        // Undeclared: no policy, not public
        var (undeclaredStatus, undeclaredBody) = await ExecuteRefreshAsync("undeclared-island", "{}", anonymousUser);

        // Undeterminable: missing authorization service
        var (undeterminableStatus, undeterminableBody) = await ExecuteRefreshAsync(
            "admin-panel",
            "{}",
            anonymousUser,
            configureServices: s => s.AddAntiforgery());

        // Invariant I1: Denied, Undeclared, and Undeterminable produce identical status (403) and body (empty)
        Assert.Equal(StatusCodes.Status403Forbidden, deniedStatus);
        Assert.Equal(StatusCodes.Status403Forbidden, undeclaredStatus);
        Assert.Equal(StatusCodes.Status403Forbidden, undeterminableStatus);

        Assert.Equal(deniedBody, undeclaredBody);
        Assert.Equal(undeclaredBody, undeterminableBody);

        // Invariant I6: DiagnosticReason appears in no response body
        Assert.Empty(deniedBody);
        Assert.Empty(undeclaredBody);
        Assert.Empty(undeterminableBody);
    }
}
