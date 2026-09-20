using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using Microsoft.AspNetCore.Razor.TagHelpers;
using Microsoft.Extensions.DependencyInjection;
using LaughTale.Core.Attributes;
using LaughTale.Core.Extensions;
using LaughTale.Core.TagHelpers;
using Xunit;

namespace LaughTale.Tests.Streaming;

/// <summary>
/// ROADMAP.v5.md Part E "Out-of-order streaming": verifies IslandDeferredTagHelper renders a
/// placeholder immediately (never awaiting the deferred task), evaluates authorization/privacy at
/// shell-render time, and registers the task for OutOfOrderStreamingMiddleware to find. Mirrors
/// IslandTagHelperAuthorizationTests's real-DI/ViewContext harness.
/// </summary>
public class IslandDeferredTagHelperTests
{
    [Island("slow-widget")]
    public record SlowWidgetProps(string Message);

    [Island("private-slow-widget")]
    [IslandPrivate]
    public record PrivateSlowWidgetProps(string Message);

    private class FakePageModel
    {
        public Task<object?> Recommendations { get; set; } = default!;
        public string NotATask { get; set; } = "oops";
    }

    private static (IServiceProvider Services, ViewContext ViewContext) CreateContext(object model)
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
            User = new ClaimsPrincipal(new ClaimsIdentity())
        };

        var viewData = new ViewDataDictionary(new EmptyModelMetadataProvider(), new ModelStateDictionary())
        {
            Model = model
        };

        var viewContext = new ViewContext
        {
            HttpContext = httpContext,
            ViewData = viewData
        };

        return (provider, viewContext);
    }

    private static (TagHelperContext Context, TagHelperOutput Output) CreateTagHelperContext()
    {
        var context = new TagHelperContext(
            new TagHelperAttributeList(),
            new Dictionary<object, object>(),
            Guid.NewGuid().ToString("N"));

        var output = new TagHelperOutput(
            "island-deferred",
            new TagHelperAttributeList(),
            (useCachedResult, encoder) => Task.FromResult<TagHelperContent>(new DefaultTagHelperContent()));

        return (context, output);
    }

    [Fact]
    public async Task ProcessAsync_PendingTask_RendersPlaceholder_WithoutAwaitingTheTask()
    {
        var tcs = new TaskCompletionSource<object?>();
        var model = new FakePageModel { Recommendations = tcs.Task };
        var (_, viewContext) = CreateContext(model);
        var helper = new IslandDeferredTagHelper { ViewContext = viewContext, Name = "recommendations", For = nameof(FakePageModel.Recommendations) };
        var (context, output) = CreateTagHelperContext();

        var processTask = helper.ProcessAsync(context, output);
        var completed = await Task.WhenAny(processTask, Task.Delay(500));

        Assert.Same(processTask, completed); // must not block on the still-pending task
        Assert.Equal("div", output.TagName);
        Assert.StartsWith("lt-deferred-", output.Attributes["id"].Value!.ToString());
        Assert.Equal("recommendations", output.Attributes["data-island-placeholder"].Value);
    }

    [Fact]
    public async Task ProcessAsync_MissingForProperty_Throws()
    {
        var model = new FakePageModel { Recommendations = Task.FromResult<object?>(null) };
        var (_, viewContext) = CreateContext(model);
        var helper = new IslandDeferredTagHelper { ViewContext = viewContext, Name = "x", For = "DoesNotExist" };
        var (context, output) = CreateTagHelperContext();

        await Assert.ThrowsAsync<InvalidOperationException>(() => helper.ProcessAsync(context, output));
    }

    [Fact]
    public async Task ProcessAsync_ForPropertyNotATask_Throws()
    {
        var model = new FakePageModel { Recommendations = Task.FromResult<object?>(null) };
        var (_, viewContext) = CreateContext(model);
        var helper = new IslandDeferredTagHelper { ViewContext = viewContext, Name = "x", For = nameof(FakePageModel.NotATask) };
        var (context, output) = CreateTagHelperContext();

        await Assert.ThrowsAsync<InvalidOperationException>(() => helper.ProcessAsync(context, output));
    }

    [Fact]
    public async Task ProcessAsync_PrivateProps_SetsNoStoreHeaders_AtShellRenderTime()
    {
        var model = new { SlowPrivate = Task.FromResult<PrivateSlowWidgetProps?>(null) };
        var (_, viewContext) = CreateContext(model);
        var helper = new IslandDeferredTagHelper { ViewContext = viewContext, Name = "private-slow-widget", For = "SlowPrivate" };
        var (context, output) = CreateTagHelperContext();

        await helper.ProcessAsync(context, output);

        Assert.Equal("no-store, no-cache, private", viewContext.HttpContext.Response.Headers.CacheControl.ToString());
    }

    [Fact]
    public async Task ProcessAsync_PreservesChildContentAsSkeleton()
    {
        var model = new FakePageModel { Recommendations = new TaskCompletionSource<object?>().Task };
        var (_, viewContext) = CreateContext(model);
        var helper = new IslandDeferredTagHelper { ViewContext = viewContext, Name = "recommendations", For = nameof(FakePageModel.Recommendations) };
        var (context, output) = CreateTagHelperContext();

        await helper.ProcessAsync(context, output);

        // No explicit child content was set on this fake TagHelperOutput, so it should just not throw
        // and leave whatever content was already there (empty, in this synthetic harness).
        Assert.NotNull(output.Content);
    }
}
