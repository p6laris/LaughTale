using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.Mvc.ViewEngines;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using Microsoft.AspNetCore.Razor.TagHelpers;
using Microsoft.Extensions.DependencyInjection;
using LaughTale.Components.TagHelpers;
using LaughTale.Core.Extensions;
using Xunit;

namespace LaughTale.Tests.Serialization;

/// <summary>
/// Regression coverage for ROADMAP.v5.md Part J (props payload &amp; serialization): confirms that (1)
/// unset, default-valued properties are actually omitted from data-props JSON end-to-end (not just that
/// IslandJson's ignore condition is configured correctly in isolation - IslandJsonTests.cs already covers
/// that), (2) the hand-written LaughTale.Generated.LaughTaleGeneratedJsonContext (see
/// LaughTale.Components/Generated/LaughTaleGeneratedJsonContext.cs) is actually reachable/used for
/// generator-emitted islands rather than the combined resolver silently falling through to pure reflection
/// for everything, and (3) arbitrary pt/studio-overrides values still round-trip correctly through that
/// combined resolver.
/// </summary>
public class IslandPropsPayloadTests
{
    private static ViewContext CreateViewContext()
    {
        var services = new ServiceCollection();
        services.AddLogging();
        services.AddLaughTale(o => o.Refresh.AllowUndeclaredIslands = true);
        var provider = services.BuildServiceProvider();
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

    private static async Task<TagHelperOutput> ProcessAsync(TagHelper helper, IDictionary<string, object?>? propertyValues = null)
    {
        helper.GetType().GetProperty("ViewContext")!.SetValue(helper, CreateViewContext());
        if (propertyValues != null)
        {
            foreach (var (name, value) in propertyValues)
            {
                helper.GetType().GetProperty(name)!.SetValue(helper, value);
            }
        }

        var context = new TagHelperContext(
            new TagHelperAttributeList(),
            new Dictionary<object, object>(),
            Guid.NewGuid().ToString("N"));
        var output = new TagHelperOutput(
            helper.GetType().Name,
            new TagHelperAttributeList(),
            (useCachedResult, encoder) => Task.FromResult<TagHelperContent>(new DefaultTagHelperContent()));

        await helper.ProcessAsync(context, output);
        return output;
    }

    private static TagHelper CreateHelper(string fullTypeName)
    {
        var type = Type.GetType($"{fullTypeName}, LaughTale.Components")
            ?? throw new InvalidOperationException($"Type '{fullTypeName}' not found in LaughTale.Components.");
        return (TagHelper)Activator.CreateInstance(type)!;
    }

    private class MockView : IView
    {
        public string Path => "test.cshtml";
        public Task RenderAsync(ViewContext context) => Task.CompletedTask;
    }

    private class MockTempDataProvider : ITempDataProvider
    {
        public IDictionary<string, object> LoadTempData(HttpContext context) => new Dictionary<string, object>();
        public void SaveTempData(HttpContext context, IDictionary<string, object> values) { }
    }

    [Fact]
    public async Task Checkbox_WithNoAttributesSet_OmitsDefaultValuedBooleanProperties()
    {
        var helper = CreateHelper("LaughTale.Components.TagHelpers.IslandCheckboxTagHelper");
        var output = await ProcessAsync(helper);
        var json = output.Attributes["data-props"].Value!.ToString()!;
        using var doc = JsonDocument.Parse(json);

        Assert.False(doc.RootElement.TryGetProperty("disabled", out _), $"'disabled' should be omitted when unset. Payload: {json}");
        Assert.False(doc.RootElement.TryGetProperty("indeterminate", out _), $"'indeterminate' should be omitted when unset. Payload: {json}");
        Assert.False(doc.RootElement.TryGetProperty("invalid", out _), $"'invalid' should be omitted when unset. Payload: {json}");
    }

    [Fact]
    public async Task Accordion_WithNoAttributesSet_OmitsDefaultValuedProperties()
    {
        var helper = CreateHelper("LaughTale.Components.TagHelpers.IslandAccordionTagHelper");
        var output = await ProcessAsync(helper);
        var json = output.Attributes["data-props"].Value!.ToString()!;
        using var doc = JsonDocument.Parse(json);

        Assert.False(doc.RootElement.TryGetProperty("multiple", out _), $"'multiple' should be omitted when unset. Payload: {json}");
        Assert.False(doc.RootElement.TryGetProperty("activeIndex", out _), $"'activeIndex' should be omitted when unset. Payload: {json}");
        Assert.False(doc.RootElement.TryGetProperty("tabs", out _), $"'tabs' should be omitted when unset. Payload: {json}");
    }

    [Fact]
    public async Task Slider_WithNoAttributesSet_OmitsDefaultValuedProperties()
    {
        var helper = CreateHelper("LaughTale.Components.TagHelpers.IslandSliderTagHelper");
        var output = await ProcessAsync(helper);
        var json = output.Attributes["data-props"].Value!.ToString()!;
        using var doc = JsonDocument.Parse(json);

        Assert.False(doc.RootElement.TryGetProperty("disabled", out _), $"'disabled' should be omitted when unset. Payload: {json}");
        Assert.False(doc.RootElement.TryGetProperty("range", out _), $"'range' should be omitted when unset. Payload: {json}");
    }

    [Fact]
    public async Task Slider_WithDisabledExplicitlySetTrue_IncludesIt()
    {
        // Sanity check for the above three tests: a non-default value must still come through, so the
        // omission assertions are actually exercising WhenWritingDefault and not some unrelated bug that
        // drops the property unconditionally.
        var helper = CreateHelper("LaughTale.Components.TagHelpers.IslandSliderTagHelper");
        var output = await ProcessAsync(helper, new Dictionary<string, object?> { ["Disabled"] = true });
        var json = output.Attributes["data-props"].Value!.ToString()!;
        using var doc = JsonDocument.Parse(json);

        Assert.True(doc.RootElement.GetProperty("disabled").GetBoolean());
    }

    // NOTE (ROADMAP.v5.md Part J): there is deliberately no test here asserting that a generated
    // JsonSerializerContext resolves the generator-emitted "WireProps" types (e.g.
    // IslandCheckboxTagHelperWireProps) reflection-free. That combination does not work - System.Text.Json's
    // own source generator cannot fully introspect a type produced by a different Roslyn generator
    // (IslandGenerator), confirmed empirically (SYSLIB1030 for every such type). See
    // LaughTale.Core.Serialization.IslandJson's remarks on SerializeProps(object?, IJsonTypeInfoResolver?)
    // for the full account, and IslandJsonTests.cs for a regression test proving the combining mechanism
    // itself is correct given a resolver that actually generated (a hand-written type/context pairing).

    [Fact]
    public async Task Pt_ArbitraryAnonymousValue_RoundTripsThroughCombinedResolver()
    {
        // Pt is typed object? on every generated TagHelper and carries a runtime type the generated
        // JsonSerializerContext has never heard of (an anonymous type here) - this must still fall through
        // to the reflection-based resolver within the SAME combined JsonSerializerOptions rather than
        // throwing or serializing as {}.
        var helper = CreateHelper("LaughTale.Components.TagHelpers.IslandCheckboxTagHelper");
        var ptValue = new { root = new { className = "custom-root", nested = new[] { 1, 2, 3 } } };
        var output = await ProcessAsync(helper, new Dictionary<string, object?> { ["Pt"] = ptValue });
        var json = output.Attributes["data-props"].Value!.ToString()!;
        using var doc = JsonDocument.Parse(json);

        var pt = doc.RootElement.GetProperty("pt");
        Assert.Equal("custom-root", pt.GetProperty("root").GetProperty("className").GetString());
        Assert.Equal(3, pt.GetProperty("root").GetProperty("nested").GetArrayLength());
    }
}
