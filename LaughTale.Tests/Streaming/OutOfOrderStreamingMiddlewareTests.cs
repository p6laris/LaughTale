using System;
using System.IO;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using Microsoft.AspNetCore.Razor.TagHelpers;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging.Abstractions;
using LaughTale.Core.Extensions;
using LaughTale.Core.Streaming;
using LaughTale.Core.TagHelpers;
using Xunit;

namespace LaughTale.Tests.Streaming;

/// <summary>
/// ROADMAP.v5.md Part E "Out-of-order streaming": integration-style tests that run the real
/// IslandDeferredTagHelper first (to populate DeferredIslandRegistry via HttpContext.Items exactly as
/// a real shell render would) and then the real OutOfOrderStreamingMiddleware, asserting on the
/// actual bytes written to the response body - proving the two pieces work together, not just that
/// each compiles in isolation.
/// </summary>
public class OutOfOrderStreamingMiddlewareTests
{
    private class FakePageModel
    {
        public Task<object?> Fast { get; set; } = default!;
        public Task<object?> Slow { get; set; } = default!;
    }

    private static (IServiceProvider Services, HttpContext HttpContext) CreateContext()
    {
        var services = new ServiceCollection();
        services.AddLogging();
        services.AddOptions();
        services.AddAuthorization();
        services.AddLaughTale(options => options.Refresh.AllowUndeclaredIslands = true);
        var provider = services.BuildServiceProvider();

        var httpContext = new DefaultHttpContext
        {
            RequestServices = provider,
            User = new ClaimsPrincipal(new ClaimsIdentity()),
            Response = { Body = new MemoryStream() }
        };

        return (provider, httpContext);
    }

    private static async Task RegisterDeferredIsland(HttpContext httpContext, string name, string propertyName, FakePageModel model)
    {
        var viewData = new ViewDataDictionary(new EmptyModelMetadataProvider(), new ModelStateDictionary()) { Model = model };
        var viewContext = new ViewContext { HttpContext = httpContext, ViewData = viewData };
        var helper = new IslandDeferredTagHelper { ViewContext = viewContext, Name = name, For = propertyName };

        var context = new TagHelperContext(new TagHelperAttributeList(), new System.Collections.Generic.Dictionary<object, object>(), Guid.NewGuid().ToString("N"));
        var output = new TagHelperOutput("island-deferred", new TagHelperAttributeList(), (useCachedResult, encoder) => Task.FromResult<TagHelperContent>(new DefaultTagHelperContent()));

        await helper.ProcessAsync(context, output);
    }

    [Fact]
    public async Task InvokeAsync_NoDeferredIslands_IsANoOp()
    {
        var (_, httpContext) = CreateContext();
        var middleware = new OutOfOrderStreamingMiddleware(_ => Task.CompletedTask, NullLogger<OutOfOrderStreamingMiddleware>.Instance);

        await middleware.InvokeAsync(httpContext);

        httpContext.Response.Body.Seek(0, SeekOrigin.Begin);
        Assert.Equal(0, httpContext.Response.Body.Length);
    }

    [Fact]
    public async Task InvokeAsync_DeliversFragmentsInCompletionOrder_NotDeclarationOrder()
    {
        var (_, httpContext) = CreateContext();

        var slowTcs = new TaskCompletionSource<object?>();
        var fastTcs = new TaskCompletionSource<object?>();
        var model = new FakePageModel { Fast = fastTcs.Task, Slow = slowTcs.Task };

        // Declared in this order: Slow first, Fast second - but Fast will resolve FIRST.
        await RegisterDeferredIsland(httpContext, "slow-widget", nameof(FakePageModel.Slow), model);
        await RegisterDeferredIsland(httpContext, "fast-widget", nameof(FakePageModel.Fast), model);

        var middleware = new OutOfOrderStreamingMiddleware(
            next: async ctx =>
            {
                // Simulates the shell having already been written by the normal Razor Pages pipeline.
                await ctx.Response.WriteAsync("<html><body>shell</body>");
            },
            NullLogger<OutOfOrderStreamingMiddleware>.Instance);

        var invokeTask = middleware.InvokeAsync(httpContext);

        // Resolve Fast well before Slow, despite being declared second.
        fastTcs.SetResult(new { Message = "fast" });
        // Wait for the fast fragment to actually be written (bounded) instead of a fixed 30ms delay,
        // which flaked under a loaded thread pool. A broken implementation still fails the ordering assert.
        var body0 = (MemoryStream)httpContext.Response.Body;
        var waitStarted = System.Diagnostics.Stopwatch.StartNew();
        while (!Encoding.UTF8.GetString(body0.ToArray()).Contains("fast-widget", StringComparison.Ordinal)
               && waitStarted.Elapsed < TimeSpan.FromSeconds(5))
        {
            await Task.Delay(10);
        }
        slowTcs.SetResult(new { Message = "slow" });

        await invokeTask;

        httpContext.Response.Body.Seek(0, SeekOrigin.Begin);
        var body = new StreamReader(httpContext.Response.Body, Encoding.UTF8).ReadToEnd();

        var fastIndex = body.IndexOf("fast-widget", StringComparison.Ordinal);
        var slowIndex = body.IndexOf("slow-widget", StringComparison.Ordinal);

        Assert.True(fastIndex >= 0 && slowIndex >= 0, "Both fragments should be present in the response body");
        Assert.True(fastIndex < slowIndex, "The fragment that resolved first (fast-widget) must be written before the one declared first but resolved later (slow-widget)");
    }

    [Fact]
    public async Task InvokeAsync_DeferredTaskThrows_WritesErrorFragment_WithoutLeakingTheExceptionMessage()
    {
        var (_, httpContext) = CreateContext();
        var model = new FakePageModel { Fast = Task.FromException<object?>(new InvalidOperationException("SECRET_DB_CONNECTION_STRING")) };
        await RegisterDeferredIsland(httpContext, "failing-widget", nameof(FakePageModel.Fast), model);

        var middleware = new OutOfOrderStreamingMiddleware(_ => Task.CompletedTask, NullLogger<OutOfOrderStreamingMiddleware>.Instance);

        await middleware.InvokeAsync(httpContext);

        httpContext.Response.Body.Seek(0, SeekOrigin.Begin);
        var body = new StreamReader(httpContext.Response.Body, Encoding.UTF8).ReadToEnd();

        Assert.Contains("data-island-error", body);
        Assert.DoesNotContain("SECRET_DB_CONNECTION_STRING", body);
    }

    [Fact]
    public async Task InvokeAsync_DeferredTaskExceedsTimeout_WritesErrorFragment()
    {
        var (_, httpContext) = CreateContext();
        var neverResolves = new TaskCompletionSource<object?>();
        var model = new FakePageModel { Fast = neverResolves.Task };

        var viewData = new ViewDataDictionary(new EmptyModelMetadataProvider(), new ModelStateDictionary()) { Model = model };
        var viewContext = new ViewContext { HttpContext = httpContext, ViewData = viewData };
        var helper = new IslandDeferredTagHelper { ViewContext = viewContext, Name = "timeout-widget", For = nameof(FakePageModel.Fast), TimeoutSeconds = 0.05 };
        var context = new TagHelperContext(new TagHelperAttributeList(), new System.Collections.Generic.Dictionary<object, object>(), Guid.NewGuid().ToString("N"));
        var output = new TagHelperOutput("island-deferred", new TagHelperAttributeList(), (useCachedResult, encoder) => Task.FromResult<TagHelperContent>(new DefaultTagHelperContent()));
        await helper.ProcessAsync(context, output);

        var middleware = new OutOfOrderStreamingMiddleware(_ => Task.CompletedTask, NullLogger<OutOfOrderStreamingMiddleware>.Instance);

        await middleware.InvokeAsync(httpContext);

        httpContext.Response.Body.Seek(0, SeekOrigin.Begin);
        var body = new StreamReader(httpContext.Response.Body, Encoding.UTF8).ReadToEnd();
        Assert.Contains("data-island-error", body);
    }
}
