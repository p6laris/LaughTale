using System;
using System.IO;
using System.Text.Encodings.Web;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using Microsoft.AspNetCore.Razor.TagHelpers;
using Microsoft.AspNetCore.Routing;
using Microsoft.Extensions.DependencyInjection;
using LaughTale.Core.Attributes;
using LaughTale.Core.Configuration;
using LaughTale.Core.Enums;
using LaughTale.Core.Extensions;
using LaughTale.Core.TagHelpers;
using Xunit;

namespace LaughTale.Tests;

[Island("custom-counter", DefaultStrategy = HydrateStrategy.Visible)]
public record CustomCounterProps(int StartCount, string Label);

/// <summary>
/// Verifies the Core-Only isolation boundary (LT-1606 / §2.5).
/// Guarantees that an application using only LaughTale.Core can configure, render, and execute islands.
/// </summary>
public class CoreOnlyBoundaryTests
{
    [Fact]
    public void CoreAssembly_HasNoDependencyOnComponentsAssembly()
    {
        var coreAssembly = typeof(IslandTagHelper).Assembly;
        var referencedAssemblies = coreAssembly.GetReferencedAssemblies();

        Assert.DoesNotContain(referencedAssemblies, a => a.Name?.StartsWith("LaughTale.Components", StringComparison.OrdinalIgnoreCase) == true);
    }

    [Fact]
    public async Task CoreOnly_ServicesAndTagHelper_RenderValidIslandMarkup()
    {
        var services = new ServiceCollection();
        services.AddLaughTale(o =>
        {
            o.ViewTransitions.Enabled = false;
            o.Csp.Enabled = true;
        });

        var provider = services.BuildServiceProvider();
        Assert.NotNull(provider.GetService<LaughTaleOptions>());

        var httpContext = new DefaultHttpContext();
        var actionContext = new Microsoft.AspNetCore.Mvc.ActionContext(httpContext, new RouteData(), new Microsoft.AspNetCore.Mvc.Abstractions.ActionDescriptor());
        var viewData = new ViewDataDictionary(new EmptyModelMetadataProvider(), new ModelStateDictionary());
        var viewContext = new ViewContext(actionContext, new MockView(), viewData, new TempDataDictionary(httpContext, new MockTempDataProvider()), TextWriter.Null, new HtmlHelperOptions());

        var tagHelper = new IslandTagHelper
        {
            ViewContext = viewContext,
            Name = "custom-counter",
            Props = new CustomCounterProps(10, "Clicks"),
            Hydrate = HydrateStrategy.Visible
        };

        var context = new TagHelperContext(
            new TagHelperAttributeList(),
            new System.Collections.Generic.Dictionary<object, object>(),
            Guid.NewGuid().ToString("N"));

        var output = new TagHelperOutput(
            "island",
            new TagHelperAttributeList(),
            (useCachedResult, encoder) => Task.FromResult<TagHelperContent>(new DefaultTagHelperContent()));

        await tagHelper.ProcessAsync(context, output);

        Assert.Equal("div", output.TagName);
        Assert.Equal("custom-counter", output.Attributes["data-island"].Value);
        Assert.Equal("visible", output.Attributes["data-hydrate"].Value);
        Assert.Contains("Clicks", output.Attributes["data-props"].Value.ToString());
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
