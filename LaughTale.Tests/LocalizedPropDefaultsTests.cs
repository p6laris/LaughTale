using System;
using System.Collections.Generic;
using System.IO;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.Mvc.ViewEngines;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using Microsoft.AspNetCore.Razor.TagHelpers;
using Microsoft.Extensions.DependencyInjection;
using LaughTale.Core.Extensions;
using LaughTale.Components.Extensions;
using LaughTale.Components.Forms;
using LaughTale.Components.TagHelpers.Aura.Menu;
using LaughTale.Components.TagHelpers.Aura.Overlay;
using Xunit;

namespace LaughTale.Tests;

/// <summary>
/// End-to-end coverage for the 31 previously-hardcoded English UI-copy defaults now routed
/// through ILaughTaleLocalizer (ROADMAP.v5.md §15): when a caller leaves the prop unset, the
/// generator-emitted BuildProps() (or, for the 3 hand-written TagHelpers, their own BuildProps())
/// must still resolve to sensible English text via LaughTale.Components' built-in locale seeding -
/// not null/empty - so existing English-speaking apps see no behavior change.
/// </summary>
public class LocalizedPropDefaultsTests
{
    private static ViewContext CreateViewContext(bool withComponents)
    {
        var services = new ServiceCollection();
        services.AddLogging();
        services.AddLaughTale(o => o.Refresh.AllowUndeclaredIslands = true);
        if (withComponents)
        {
            services.AddLaughTaleComponents();
        }
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

    private static async Task<TagHelperOutput> ProcessAsync(TagHelper helper, ViewContext viewContext)
    {
        helper.GetType().GetProperty("ViewContext")!.SetValue(helper, viewContext);

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
    public async Task GeneratedFileUploadTagHelper_UnsetLabels_ResolveToEnglishBuiltIns()
    {
        var helperType = Type.GetType("LaughTale.Components.TagHelpers.IslandFileUploadTagHelper, LaughTale.Components")!;
        Assert.NotNull(helperType);
        var helper = (TagHelper)Activator.CreateInstance(helperType)!;

        var output = await ProcessAsync(helper, CreateViewContext(withComponents: true));
        var propsJson = output.Attributes["data-props"].Value!.ToString()!;
        using var doc = JsonDocument.Parse(propsJson);

        Assert.Equal("Choose", doc.RootElement.GetProperty("chooseLabel").GetString());
        Assert.Equal("Upload", doc.RootElement.GetProperty("uploadLabel").GetString());
        Assert.Equal("Cancel", doc.RootElement.GetProperty("cancelLabel").GetString());
    }

    [Fact]
    public async Task GeneratedFileUploadTagHelper_ExplicitLabels_TakePriorityOverLocalizer()
    {
        var helperType = Type.GetType("LaughTale.Components.TagHelpers.IslandFileUploadTagHelper, LaughTale.Components")!;
        var helper = (TagHelper)Activator.CreateInstance(helperType)!;
        helperType.GetProperty("ChooseLabel")!.SetValue(helper, "Pick a file");

        var output = await ProcessAsync(helper, CreateViewContext(withComponents: true));
        var propsJson = output.Attributes["data-props"].Value!.ToString()!;
        using var doc = JsonDocument.Parse(propsJson);

        Assert.Equal("Pick a file", doc.RootElement.GetProperty("chooseLabel").GetString());
    }

    [Fact]
    public async Task GeneratedSelectTagHelper_UnsetPlaceholders_ResolveToEnglishBuiltIns()
    {
        var helperType = Type.GetType("LaughTale.Components.TagHelpers.IslandSelectTagHelper, LaughTale.Components")!;
        Assert.NotNull(helperType);
        var helper = (TagHelper)Activator.CreateInstance(helperType)!;

        var output = await ProcessAsync(helper, CreateViewContext(withComponents: true));
        var propsJson = output.Attributes["data-props"].Value!.ToString()!;
        using var doc = JsonDocument.Parse(propsJson);

        Assert.Equal("Select an option", doc.RootElement.GetProperty("placeholder").GetString());
        Assert.Equal("Search...", doc.RootElement.GetProperty("filterPlaceholder").GetString());
    }

    [Fact]
    public async Task HandWrittenConfirmPopupTagHelper_UnsetAcceptRejectText_ResolveToEnglishBuiltIns()
    {
        var helper = new ConfirmPopupTagHelper();
        var output = await ProcessAsync(helper, CreateViewContext(withComponents: true));
        var propsJson = output.Attributes["data-props"].Value!.ToString()!;
        using var doc = JsonDocument.Parse(propsJson);

        Assert.Equal("Yes", doc.RootElement.GetProperty("acceptText").GetString());
        Assert.Equal("No", doc.RootElement.GetProperty("rejectText").GetString());
    }

    [Fact]
    public async Task HandWrittenCommandMenuTagHelper_UnsetPlaceholder_ResolvesToEnglishBuiltIn()
    {
        var helper = new CommandMenuTagHelper();
        var output = await ProcessAsync(helper, CreateViewContext(withComponents: true));
        var propsJson = output.Attributes["data-props"].Value!.ToString()!;
        using var doc = JsonDocument.Parse(propsJson);

        Assert.Equal("Type a command or search...", doc.RootElement.GetProperty("placeholder").GetString());
    }

    /// <summary>
    /// Without LaughTale.Components registered, Core alone has no vocabulary to resolve keys
    /// against (by design - Core stays generic). The prop simply falls through to null rather than
    /// throwing, matching plain-Core apps' existing (pre-refactor-equivalent) behavior.
    /// </summary>
    [Fact]
    public async Task GeneratedFileUploadTagHelper_WithoutComponentsRegistered_DoesNotThrow()
    {
        var helperType = Type.GetType("LaughTale.Components.TagHelpers.IslandFileUploadTagHelper, LaughTale.Components")!;
        var helper = (TagHelper)Activator.CreateInstance(helperType)!;

        var output = await ProcessAsync(helper, CreateViewContext(withComponents: false));
        var propsJson = output.Attributes["data-props"].Value!.ToString()!;
        using var doc = JsonDocument.Parse(propsJson);

        // No built-in vocabulary registered, so the raw locale key is the sensible fallback.
        Assert.Equal("choose", doc.RootElement.GetProperty("chooseLabel").GetString());
    }

    [Fact]
    public void DynamicFormSchemaGenerator_UnsetSubmitLabel_DefaultsToEnglishSubmit()
    {
        var schema = DynamicFormSchemaGenerator.FromType(typeof(SimpleFormModel));
        Assert.Equal("Submit", schema.SubmitLabel);
    }

    [Fact]
    public void DynamicFormSchemaGenerator_ExplicitSubmitLabel_TakesPriority()
    {
        var schema = DynamicFormSchemaGenerator.FromType(typeof(SimpleFormModel), submitLabel: "Register");
        Assert.Equal("Register", schema.SubmitLabel);
    }

    private class SimpleFormModel
    {
        public string? Name { get; set; }
    }
}
