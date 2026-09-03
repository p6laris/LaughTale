using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using LaughTale.Core.Attributes;
using LaughTale.Core.Configuration;
using LaughTale.Core.Data;
using LaughTale.Core.Endpoints;
using LaughTale.Core.Extensions;
using LaughTale.Core.Security;
using Xunit;

namespace LaughTale.Tests.Security;

public class IslandAccessEvaluatorTests
{
    private readonly IIslandAccessEvaluator _evaluator = new IslandAccessEvaluator();

    [Fact]
    public async Task Row1_NullServices_ReturnsUndeterminable()
    {
        var decision = await _evaluator.EvaluateAsync("test-island", null, null);
        Assert.Equal(IslandAccessOutcome.Undeterminable, decision.Outcome);
        Assert.False(decision.IsAllowed);
    }

    [Fact]
    public async Task Row2_UndeclaredIsland_CompatSwitchOff_ReturnsUndeclared()
    {
        var services = new ServiceCollection();
        services.AddLogging();
        services.AddOptions();
        services.AddLaughTale(); // AllowUndeclaredIslands = false by default
        var sp = services.BuildServiceProvider();

        var decision = await _evaluator.EvaluateAsync("undeclared-island", null, sp);
        Assert.Equal(IslandAccessOutcome.Undeclared, decision.Outcome);
        Assert.False(decision.IsAllowed);
    }

    [Fact]
    public async Task Row3_UndeclaredIsland_CompatSwitchOn_ReturnsAllowed()
    {
        var services = new ServiceCollection();
        services.AddLogging();
        services.AddOptions();
        services.AddLaughTale(o => o.Refresh.AllowUndeclaredIslands = true);
        var sp = services.BuildServiceProvider();

        var decision = await _evaluator.EvaluateAsync("compat-island", null, sp);
        Assert.Equal(IslandAccessOutcome.Allowed, decision.Outcome);
        Assert.True(decision.IsAllowed);
    }

    [Fact]
    public async Task Row4_PublicIsland_ReturnsAllowed()
    {
        var services = new ServiceCollection();
        services.AddLogging();
        services.AddOptions();
        services.AddLaughTale(o => o.Refresh.AllowAnonymous("public-island"));
        var sp = services.BuildServiceProvider();

        var decision = await _evaluator.EvaluateAsync("public-island", null, sp);
        Assert.Equal(IslandAccessOutcome.Allowed, decision.Outcome);
        Assert.True(decision.IsAllowed);
    }

    [Fact]
    public async Task Row5_PolicyResolved_NoAuthorizationService_ReturnsUndeterminable()
    {
        var services = new ServiceCollection();
        services.AddLogging();
        services.AddOptions();
        // Deliberately NOT adding AddAuthorization()
        services.AddLaughTale(o => o.Refresh.RequirePolicy("admin-panel", "AdminOnly"));
        var sp = services.BuildServiceProvider();

        var decision = await _evaluator.EvaluateAsync("admin-panel", null, sp);
        Assert.Equal(IslandAccessOutcome.Undeterminable, decision.Outcome);
        Assert.False(decision.IsAllowed);
    }

    [Fact]
    public async Task Row6_PolicyResolved_UnknownPolicyName_ReturnsUndeterminable()
    {
        var services = new ServiceCollection();
        services.AddLogging();
        services.AddOptions();
        services.AddAuthorization(); // Registered, but no "NonExistentPolicy"
        services.AddLaughTale(o => o.Refresh.RequirePolicy("some-island", "NonExistentPolicy"));
        var sp = services.BuildServiceProvider();

        var user = new ClaimsPrincipal(new ClaimsIdentity());
        var decision = await _evaluator.EvaluateAsync("some-island", user, sp);
        Assert.Equal(IslandAccessOutcome.Undeterminable, decision.Outcome);
        Assert.False(decision.IsAllowed);
    }

    private class ThrowingAuthService : IAuthorizationService
    {
        public Task<AuthorizationResult> AuthorizeAsync(ClaimsPrincipal user, object? resource, IEnumerable<IAuthorizationRequirement> requirements)
            => throw new InvalidOperationException("Simulated authorization crash.");

        public Task<AuthorizationResult> AuthorizeAsync(ClaimsPrincipal user, object? resource, string policyName)
            => throw new InvalidOperationException("Simulated authorization crash.");
    }

    [Fact]
    public async Task Row7_PolicyResolved_AuthorizeThrows_ReturnsUndeterminable()
    {
        var services = new ServiceCollection();
        services.AddLogging();
        services.AddOptions();
        services.AddSingleton<IAuthorizationService, ThrowingAuthService>();
        services.AddLaughTale(o => o.Refresh.RequirePolicy("crash-island", "CrashPolicy"));
        var sp = services.BuildServiceProvider();

        var decision = await _evaluator.EvaluateAsync("crash-island", null, sp);
        Assert.Equal(IslandAccessOutcome.Undeterminable, decision.Outcome);
        Assert.False(decision.IsAllowed);
    }

    [Fact]
    public async Task Row8_PolicyResolved_AuthorizeFails_ReturnsDenied()
    {
        var services = new ServiceCollection();
        services.AddLogging();
        services.AddOptions();
        services.AddAuthorization(o => o.AddPolicy("AdminOnly", p => p.RequireRole("Admin")));
        services.AddLaughTale(o => o.Refresh.RequirePolicy("admin-island", "AdminOnly"));
        var sp = services.BuildServiceProvider();

        var normalUser = new ClaimsPrincipal(new ClaimsIdentity(new[] { new Claim(ClaimTypes.Role, "User") }, "TestAuth"));
        var decision = await _evaluator.EvaluateAsync("admin-island", normalUser, sp);
        Assert.Equal(IslandAccessOutcome.Denied, decision.Outcome);
        Assert.False(decision.IsAllowed);
    }

    [Fact]
    public async Task Row9_PolicyResolved_AuthorizeSucceeds_ReturnsAllowed()
    {
        var services = new ServiceCollection();
        services.AddLogging();
        services.AddOptions();
        services.AddAuthorization(o => o.AddPolicy("AdminOnly", p => p.RequireRole("Admin")));
        services.AddLaughTale(o => o.Refresh.RequirePolicy("admin-island", "AdminOnly"));
        var sp = services.BuildServiceProvider();

        var adminUser = new ClaimsPrincipal(new ClaimsIdentity(new[] { new Claim(ClaimTypes.Role, "Admin") }, "TestAuth"));
        var decision = await _evaluator.EvaluateAsync("admin-island", adminUser, sp);
        Assert.Equal(IslandAccessOutcome.Allowed, decision.Outcome);
        Assert.True(decision.IsAllowed);
    }

    [Fact]
    public void RolesWithoutPolicy_ThrowsInvalidOperationException()
    {
        Assert.Throws<InvalidOperationException>(() =>
        {
            var attr = new IslandAuthorizeAttribute { Roles = "Admin" };
        });
    }

    [Fact]
    public void IslandFieldPolicy_None_RefusesAll()
    {
        var policy = IslandFieldPolicy.None;
        Assert.False(policy.Allows("id"));
        Assert.False(policy.Allows("name"));
    }

    [Fact]
    public void IslandFieldPolicy_AllMappedProperties_AllowsAll()
    {
        var policy = IslandFieldPolicy.AllMappedProperties;
        Assert.True(policy.Allows("id"));
        Assert.True(policy.Allows("name"));
        Assert.False(policy.Allows(""));
        Assert.False(policy.Allows(null!));
    }

    [Fact]
    public void IslandFieldPolicy_For_AllowsOnlySpecifiedFieldsCaseInsensitive()
    {
        var policy = IslandFieldPolicy.For("Name", "Email");
        Assert.True(policy.Allows("name"));
        Assert.True(policy.Allows("NAME"));
        Assert.True(policy.Allows("Email"));
        Assert.False(policy.Allows("Password"));
    }

    [Fact]
    public void IslandFieldPolicy_EmptyFor_RefusesAll()
    {
        var policy = IslandFieldPolicy.For();
        Assert.False(policy.Allows("id"));
    }

    // T013: Behavioral test asserting that call sites refuse undeclared islands.
    // This MUST FAIL in Phase 1 because the call sites have not yet inverted their guards.
    [Fact]
    public async Task CallSite_UndeclaredIsland_RefreshEndpointRefuses()
    {
        var services = new ServiceCollection();
        services.AddLogging();
        services.AddOptions();
        services.AddRouting();
        services.AddAntiforgery();
        services.AddAuthorization(o => o.AddPolicy("AdminOnly", p => p.RequireRole("Admin")));
        services.AddLaughTale(options =>
        {
            options.Refresh.RequireAntiforgery = false;
            // No policy declared for "secret-dashboard"
        });

        var provider = services.BuildServiceProvider();
        var routeBuilder = new SimpleEndpointRouteBuilder(provider);
        routeBuilder.MapLaughTaleIslandRefresh("/_laughtale/island/{name}");

        var endpoint = routeBuilder.DataSources
            .SelectMany(ds => ds.Endpoints)
            .OfType<RouteEndpoint>()
            .FirstOrDefault(e => e.RoutePattern.RawText?.Contains("island") == true);

        Assert.NotNull(endpoint?.RequestDelegate);

        var context = new DefaultHttpContext { RequestServices = provider };
        context.Request.Path = "/_laughtale/island/secret-dashboard";
        context.Request.RouteValues["name"] = "secret-dashboard";
        context.Request.Body = new MemoryStream(Encoding.UTF8.GetBytes("{}"));
        context.Request.ContentLength = 2;
        context.Response.Body = new MemoryStream();
        context.User = new ClaimsPrincipal(new ClaimsIdentity());

        await endpoint.RequestDelegate(context);

        // This assertion will fail (expected 403, actual 200) until Phase 2 inverts the endpoint
        Assert.Equal(StatusCodes.Status403Forbidden, context.Response.StatusCode);
    }

    private class SimpleEndpointRouteBuilder : IEndpointRouteBuilder
    {
        public IServiceProvider ServiceProvider { get; }
        public ICollection<EndpointDataSource> DataSources { get; } = new List<EndpointDataSource>();

        public SimpleEndpointRouteBuilder(IServiceProvider sp) => ServiceProvider = sp;

        public IApplicationBuilder CreateApplicationBuilder() => new ApplicationBuilder(ServiceProvider);
    }
}
