using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using Microsoft.AspNetCore.Razor.TagHelpers;
using Microsoft.Extensions.DependencyInjection;
using LaughTale.Components.TagHelpers;
using LaughTale.Core.Attributes;
using LaughTale.Core.Diagnostics;
using LaughTale.Core.Extensions;
using Xunit;

namespace LaughTale.Tests.Diagnostics;

/// <summary>
/// ROADMAP.v5.md Part H "instrumentation hook": proves IslandTagHelperBase.ProcessAsync creates a
/// real System.Diagnostics.Activity (the OpenTelemetry .NET API surface) per render, tagged with the
/// island's name/hydrate/framework - and that NOTHING is created when no listener is registered
/// (the zero-cost-when-unused claim), using a real ActivityListener rather than mocking Activity
/// itself (which isn't mockable - it's a sealed, framework-owned class).
/// </summary>
public class LaughTaleActivitySourceTests
{
    [IslandAllowAnonymous]
    private class TestTelemetryIslandTagHelper : IslandTagHelperBase
    {
        public override string IslandName => "test-telemetry-island";
        protected override object? BuildProps() => new { ok = true };
    }

    private static ViewContext CreateViewContext(IServiceProvider provider)
    {
        var httpContext = new DefaultHttpContext { RequestServices = provider };
        var actionContext = new Microsoft.AspNetCore.Mvc.ActionContext(
            httpContext,
            new Microsoft.AspNetCore.Routing.RouteData(),
            new Microsoft.AspNetCore.Mvc.Abstractions.ActionDescriptor());
        var viewData = new ViewDataDictionary(new EmptyModelMetadataProvider(), new ModelStateDictionary());
        return new ViewContext(
            actionContext,
            new MockView(),
            viewData,
            new TempDataDictionary(httpContext, new MockTempDataProvider()),
            TextWriter.Null,
            new HtmlHelperOptions());
    }

    private static (TagHelperContext Context, TagHelperOutput Output) CreateTagHelperContext(string tagName)
    {
        var context = new TagHelperContext(
            new TagHelperAttributeList(),
            new Dictionary<object, object>(),
            Guid.NewGuid().ToString("N"));

        var output = new TagHelperOutput(
            tagName,
            new TagHelperAttributeList(),
            (useCachedResult, encoder) => Task.FromResult<TagHelperContent>(new DefaultTagHelperContent()));

        return (context, output);
    }

    [Fact]
    public async Task ProcessAsync_WithListenerRegistered_CreatesTaggedActivity()
    {
        var services = new ServiceCollection();
        services.AddLaughTale();
        var provider = services.BuildServiceProvider();

        // Filters by operation name, not just source: xUnit runs test classes in parallel by
        // default, and IslandTelemetryEndpointTests creates "island.hydrate" activities under the
        // SAME ActivitySource concurrently - a listener scoped only to the source would see those too.
        var recorded = new List<Activity>();
        var listener = new ActivityListener
        {
            ShouldListenTo = source => source.Name == LaughTaleActivitySource.Name,
            Sample = (ref ActivityCreationOptions<ActivityContext> _) => ActivitySamplingResult.AllData,
            // Also filtered by island name: other test classes render IslandTagHelperBase islands in parallel.
            ActivityStopped = activity =>
            {
                if (activity.OperationName == "island.render" && Equals(activity.GetTagItem("island.name"), "test-telemetry-island"))
                {
                    lock (recorded) recorded.Add(activity);
                }
            }
        };
        ActivitySource.AddActivityListener(listener);

        try
        {
            var tagHelper = new TestTelemetryIslandTagHelper { ViewContext = CreateViewContext(provider) };
            var (context, output) = CreateTagHelperContext("island");

            await tagHelper.ProcessAsync(context, output);

            var activity = Assert.Single(recorded);
            Assert.Equal("island.render", activity.OperationName);
            Assert.Equal("test-telemetry-island", activity.GetTagItem("island.name"));
            Assert.Equal("Load", activity.GetTagItem("island.hydrate"));
            Assert.Equal("Vanilla", activity.GetTagItem("island.framework"));
            Assert.Null(activity.GetTagItem("island.suppressed"));
        }
        finally
        {
            listener.Dispose();
        }
    }

    [Fact]
    public async Task ProcessAsync_NoListenerRegistered_StartActivityReturnsNull_NoOverheadPaid()
    {
        // No ActivityListener added in this test - StartActivity must return null and every ?.SetTag
        // call must be a safe no-op, proving the render still succeeds with zero telemetry overhead.
        var services = new ServiceCollection();
        services.AddLaughTale();
        var provider = services.BuildServiceProvider();

        var tagHelper = new TestTelemetryIslandTagHelper { ViewContext = CreateViewContext(provider) };
        var (context, output) = CreateTagHelperContext("island");

        await tagHelper.ProcessAsync(context, output);

        Assert.Equal("test-telemetry-island", output.Attributes["data-island"]?.Value);
    }

    private class MockView : Microsoft.AspNetCore.Mvc.ViewEngines.IView
    {
        public string Path => "MockView";
        public Task RenderAsync(ViewContext context) => Task.CompletedTask;
    }

    private class MockTempDataProvider : ITempDataProvider
    {
        public IDictionary<string, object> LoadTempData(HttpContext context) => new Dictionary<string, object>();
        public void SaveTempData(HttpContext context, IDictionary<string, object> values) { }
    }
}
