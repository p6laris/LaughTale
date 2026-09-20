using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using LaughTale.Core.Configuration;
using LaughTale.Core.Performance;
using Xunit;

namespace LaughTale.Tests.Performance;

public class RouteRulesMiddlewareTests
{
    [Fact]
    public async Task InvokeAsync_MatchingPath_SetsCacheControlHeader()
    {
        var laughTaleOptions = new LaughTaleOptions();
        laughTaleOptions.RouteRules.AddRule("/pricing", "public, max-age=300");
        var options = Options.Create(laughTaleOptions);

        var nextCalled = false;
        var middleware = new RouteRulesMiddleware(next: ctx => { nextCalled = true; return Task.CompletedTask; }, options);

        var context = new DefaultHttpContext();
        context.Request.Path = "/pricing";

        await middleware.InvokeAsync(context);

        Assert.Equal("public, max-age=300", context.Response.Headers.CacheControl.ToString());
        Assert.True(nextCalled);
    }

    [Fact]
    public async Task InvokeAsync_NonMatchingPath_DoesNotSetHeader_ButStillCallsNext()
    {
        var laughTaleOptions = new LaughTaleOptions();
        laughTaleOptions.RouteRules.AddRule("/pricing", "public, max-age=300");
        var options = Options.Create(laughTaleOptions);

        var nextCalled = false;
        var middleware = new RouteRulesMiddleware(next: ctx => { nextCalled = true; return Task.CompletedTask; }, options);

        var context = new DefaultHttpContext();
        context.Request.Path = "/about";

        await middleware.InvokeAsync(context);

        Assert.Empty(context.Response.Headers.CacheControl.ToString());
        Assert.True(nextCalled);
    }

    [Fact]
    public async Task InvokeAsync_NoRulesConfigured_IsANoOp()
    {
        var options = Options.Create(new LaughTaleOptions());
        var middleware = new RouteRulesMiddleware(next: _ => Task.CompletedTask, options);

        var context = new DefaultHttpContext();
        context.Request.Path = "/anything";

        await middleware.InvokeAsync(context);

        Assert.Empty(context.Response.Headers.CacheControl.ToString());
    }
}
