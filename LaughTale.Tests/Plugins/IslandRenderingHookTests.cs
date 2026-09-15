using System;
using System.IO;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using Microsoft.AspNetCore.Razor.TagHelpers;
using Microsoft.Extensions.DependencyInjection;
using LaughTale.Components.TagHelpers;
using LaughTale.Core.Attributes;
using LaughTale.Core.Extensions;
using LaughTale.Core.Plugins;
using Xunit;

namespace LaughTale.Tests.Plugins;

/// <summary>
/// Proves the OnIslandRendering composition claim end-to-end: a registered plugin mutates
/// IslandRenderingContext.Props, and the REAL IslandTagHelperBase.ProcessAsync (not a mock)
/// serializes the mutated value into data-props.
/// </summary>
public class IslandRenderingHookTests
{
    [IslandAllowAnonymous]
    private class TestPluginHookTagHelper : IslandTagHelperBase
    {
        public override string IslandName => "test-plugin-hook-island";

        protected override object? BuildProps() => new { original = true };
    }

    private class PropsMutatingPlugin : LaughTalePlugin
    {
        public override string Name => "props-mutating-plugin";

        public override ValueTask OnIslandRenderingAsync(IslandRenderingContext context)
        {
            context.Props = new { mutated = true, islandName = context.IslandName };
            return ValueTask.CompletedTask;
        }
    }

    private class NoOpPlugin : LaughTalePlugin
    {
        public override string Name => "noop-plugin";
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
            new System.Collections.Generic.Dictionary<object, object>(),
            Guid.NewGuid().ToString("N"));

        var output = new TagHelperOutput(
            tagName,
            new TagHelperAttributeList(),
            (useCachedResult, encoder) => Task.FromResult<TagHelperContent>(new DefaultTagHelperContent()));

        return (context, output);
    }

    [Fact]
    public async Task ProcessAsync_WithRegisteredPlugin_SerializesMutatedProps()
    {
        var services = new ServiceCollection();
        services.AddLaughTale();
        services.AddLaughTalePlugin(new PropsMutatingPlugin());
        var provider = services.BuildServiceProvider();

        var tagHelper = new TestPluginHookTagHelper { ViewContext = CreateViewContext(provider) };
        var (context, output) = CreateTagHelperContext("test-plugin-hook-island");

        await tagHelper.ProcessAsync(context, output);

        var propsJson = output.Attributes["data-props"].Value!.ToString();
        using var doc = JsonDocument.Parse(propsJson!);
        var root = doc.RootElement;

        Assert.True(root.GetProperty("mutated").GetBoolean());
        Assert.Equal("test-plugin-hook-island", root.GetProperty("islandName").GetString());
        Assert.False(root.TryGetProperty("original", out _));
    }

    [Fact]
    public async Task ProcessAsync_WithNoPluginsRegistered_SerializesOriginalProps()
    {
        var services = new ServiceCollection();
        services.AddLaughTale();
        var provider = services.BuildServiceProvider();

        var tagHelper = new TestPluginHookTagHelper { ViewContext = CreateViewContext(provider) };
        var (context, output) = CreateTagHelperContext("test-plugin-hook-island");

        await tagHelper.ProcessAsync(context, output);

        var propsJson = output.Attributes["data-props"].Value!.ToString();
        using var doc = JsonDocument.Parse(propsJson!);
        var root = doc.RootElement;

        Assert.True(root.GetProperty("original").GetBoolean());
    }

    [Fact]
    public async Task ProcessAsync_WithNoOpPluginRegistered_LeavesPropsUnchanged()
    {
        var services = new ServiceCollection();
        services.AddLaughTale();
        services.AddLaughTalePlugin(new NoOpPlugin());
        var provider = services.BuildServiceProvider();

        var tagHelper = new TestPluginHookTagHelper { ViewContext = CreateViewContext(provider) };
        var (context, output) = CreateTagHelperContext("test-plugin-hook-island");

        await tagHelper.ProcessAsync(context, output);

        var propsJson = output.Attributes["data-props"].Value!.ToString();
        using var doc = JsonDocument.Parse(propsJson!);
        var root = doc.RootElement;

        Assert.True(root.GetProperty("original").GetBoolean());
    }

    [Fact]
    public async Task ProcessAsync_WithMultiplePlugins_RunsInRegistrationOrder()
    {
        var order = new System.Collections.Generic.List<string>();

        var services = new ServiceCollection();
        services.AddLaughTale();
        services.AddLaughTalePlugin(new OrderTrackingPlugin("first", order));
        services.AddLaughTalePlugin(new OrderTrackingPlugin("second", order));
        var provider = services.BuildServiceProvider();

        var tagHelper = new TestPluginHookTagHelper { ViewContext = CreateViewContext(provider) };
        var (context, output) = CreateTagHelperContext("test-plugin-hook-island");

        await tagHelper.ProcessAsync(context, output);

        Assert.Equal(new[] { "first", "second" }, order);
    }

    private class OrderTrackingPlugin : LaughTalePlugin
    {
        private readonly string _tag;
        private readonly System.Collections.Generic.List<string> _order;

        public OrderTrackingPlugin(string tag, System.Collections.Generic.List<string> order)
        {
            _tag = tag;
            _order = order;
        }

        public override string Name => $"order-tracking-{_tag}";

        public override ValueTask OnIslandRenderingAsync(IslandRenderingContext context)
        {
            _order.Add(_tag);
            return ValueTask.CompletedTask;
        }
    }

    private class MockView : Microsoft.AspNetCore.Mvc.ViewEngines.IView
    {
        public string Path => "MockView";
        public Task RenderAsync(ViewContext context) => Task.CompletedTask;
    }

    private class MockTempDataProvider : ITempDataProvider
    {
        public System.Collections.Generic.IDictionary<string, object> LoadTempData(HttpContext context) => new System.Collections.Generic.Dictionary<string, object>();
        public void SaveTempData(HttpContext context, System.Collections.Generic.IDictionary<string, object> values) { }
    }
}
