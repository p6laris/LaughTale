using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
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
using LaughTale.Core.Localization;
using LaughTale.Core.TagHelpers;
using Xunit;

namespace LaughTale.Tests;

[Island("custom-counter", DefaultStrategy = HydrateStrategy.Visible)]
[IslandAllowAnonymous]
public record CustomCounterProps(int StartCount, string Label);

/// <summary>
/// Verifies the Core-Only isolation boundary ( / §2.5).
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

    /// <summary>
    /// Guards against the concrete, typed locale-pack vocabulary (LaughTaleLocaleDictionary /
    /// LaughTaleBuiltInLocales) quietly re-appearing in LaughTale.Core.Localization. Those types
    /// belong to LaughTale.Components now; Core's localization surface must stay expressed purely
    /// in BCL collection types so Core never needs to know about any concrete locale-pack shape.
    /// This test would have failed against the pre-refactor code (where both types lived in
    /// LaughTale.Core.Localization and GetDictionary()/AddLocale() referenced them directly).
    /// </summary>
    [Fact]
    public void CoreAssembly_DoesNotContainConcreteLocalePackTypes()
    {
        var coreAssembly = typeof(ILaughTaleLocalizer).Assembly;
        var typeNames = coreAssembly.GetTypes().Select(t => t.Name).ToArray();

        Assert.DoesNotContain("LaughTaleLocaleDictionary", typeNames);
        Assert.DoesNotContain("LaughTaleBuiltInLocales", typeNames);
    }

    /// <summary>
    /// Guards ILaughTaleLocalizer.GetDictionary() specifically: it must return a generic BCL
    /// dictionary shape (IReadOnlyDictionary&lt;string, string&gt;), never a named/concrete type.
    /// </summary>
    [Fact]
    public void ILaughTaleLocalizer_GetDictionary_ReturnsGenericReadOnlyDictionaryOfStrings()
    {
        var method = typeof(ILaughTaleLocalizer).GetMethod(nameof(ILaughTaleLocalizer.GetDictionary));
        Assert.NotNull(method);
        Assert.Equal(typeof(IReadOnlyDictionary<string, string>), method!.ReturnType);
    }

    /// <summary>
    /// Guards LaughTaleLocalizationOptions' public surface against quietly growing a
    /// concrete/typed locale-pack member again: its public instance properties must be exactly
    /// this fixed, named set, all expressed in BCL types.
    /// </summary>
    [Fact]
    public void LaughTaleLocalizationOptions_PublicSurfaceIsExactlyTheExpectedGenericSet()
    {
        var expectedProperties = new HashSet<string>(StringComparer.Ordinal)
        {
            nameof(LaughTaleLocalizationOptions.Enabled),
            nameof(LaughTaleLocalizationOptions.DefaultCulture),
            nameof(LaughTaleLocalizationOptions.SupportedCultures),
            nameof(LaughTaleLocalizationOptions.StringLocalizerResourceSource),
            nameof(LaughTaleLocalizationOptions.CustomDictionaries),
            nameof(LaughTaleLocalizationOptions.BuiltInDictionaries),
        };

        var actualProperties = typeof(LaughTaleLocalizationOptions)
            .GetProperties(System.Reflection.BindingFlags.Public | System.Reflection.BindingFlags.Instance)
            .Select(p => p.Name)
            .ToHashSet(StringComparer.Ordinal);

        Assert.Equal(expectedProperties, actualProperties);

        // Both dictionary-shaped members must be plain culture -> (key -> value) BCL maps.
        var expectedDictionaryType = typeof(IDictionary<string, IDictionary<string, string>>);
        Assert.Equal(expectedDictionaryType, typeof(LaughTaleLocalizationOptions).GetProperty(nameof(LaughTaleLocalizationOptions.CustomDictionaries))!.PropertyType);
        Assert.Equal(expectedDictionaryType, typeof(LaughTaleLocalizationOptions).GetProperty(nameof(LaughTaleLocalizationOptions.BuiltInDictionaries))!.PropertyType);
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

        var httpContext = new DefaultHttpContext { RequestServices = provider };
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
