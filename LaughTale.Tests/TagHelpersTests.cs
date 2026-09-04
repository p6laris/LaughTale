using Microsoft.AspNetCore.Razor.TagHelpers;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using LaughTale.Components.Enums;
using LaughTale.Components.Models;
using LaughTale.Components.TagHelpers;
using LaughTale.Core.Extensions;
using System.Text.Json;
using Xunit;

namespace LaughTale.Tests;

public class TagHelpersTests
{
    private static (TagHelperContext Context, TagHelperOutput Output) CreateTagHelperContext(string tagName)
    {
        var context = new TagHelperContext(
            new TagHelperAttributeList(),
            new Dictionary<object, object>(),
            Guid.NewGuid().ToString()
        );

        var output = new TagHelperOutput(
            tagName,
            new TagHelperAttributeList(),
            (useCachedResult, encoder) => Task.FromResult<TagHelperContent>(new DefaultTagHelperContent())
        );

        return (context, output);
    }

    [Fact]
    public void IslandTagHelper_InstantiatesViaActivatorUtilitiesWithoutAmbiguity()
    {
        var services = new Microsoft.Extensions.DependencyInjection.ServiceCollection();
        services.AddLogging();
        var provider = services.BuildServiceProvider();

        var tagHelper = Microsoft.Extensions.DependencyInjection.ActivatorUtilities.CreateInstance<LaughTale.Core.TagHelpers.IslandTagHelper>(provider);
        Assert.NotNull(tagHelper);
    }

    [Fact]
    public void IslandAccordionTagHelper_RendersIslandTagWithProps()
    {
        var helper = new IslandAccordionTagHelper
        {
            Multiple = true,
            ActiveIndex = 1,
            Tabs = new List<AccordionTab>
            {
                new("t1", "Tab 1", "Content 1"),
                new("t2", "Tab 2", "Content 2")
            }
        };

        var (context, output) = CreateTagHelperContext("island-accordion");
        helper.Process(context, output);

        Assert.Equal("div", output.TagName);
        Assert.Equal("accordion", output.Attributes["data-island"].Value);
        Assert.Equal("load", output.Attributes["data-hydrate"].Value);

        var propsJson = output.Attributes["data-props"].Value.ToString();
        using var doc = JsonDocument.Parse(propsJson!);
        var root = doc.RootElement;

        Assert.True(root.GetProperty("multiple").GetBoolean());
        Assert.Equal(1, root.GetProperty("activeIndex").GetInt32());
        Assert.Equal(2, root.GetProperty("tabs").GetArrayLength());
    }

    [Fact]
    public void IslandNumberTagHelper_SerializesModeAndCurrency()
    {
        var helper = new IslandNumberTagHelper
        {
            Value = 1250.50,
            Mode = InputNumberMode.Currency,
            Currency = "EUR",
            TargetInput = "total_price"
        };

        var (context, output) = CreateTagHelperContext("island-number");
        helper.Process(context, output);

        Assert.Equal("div", output.TagName);
        Assert.Equal("input-number", output.Attributes["data-island"].Value);

        var propsJson = output.Attributes["data-props"].Value.ToString();
        using var doc = JsonDocument.Parse(propsJson!);
        var root = doc.RootElement;

        Assert.Equal(1250.50, root.GetProperty("value").GetDouble());
        Assert.Equal("currency", root.GetProperty("mode").GetString());
        Assert.Equal("EUR", root.GetProperty("currency").GetString());
        Assert.Equal("total_price", root.GetProperty("targetInputName").GetString());
    }

    [Fact]
    public void IslandKnobTagHelper_SerializesValueAndSize()
    {
        var helper = new IslandKnobTagHelper
        {
            Value = 75,
            Min = 0,
            Max = 100,
            Size = 120,
            Color = "#3b82f6"
        };

        var (context, output) = CreateTagHelperContext("island-knob");
        helper.Process(context, output);

        Assert.Equal("div", output.TagName);
        Assert.Equal("knob", output.Attributes["data-island"].Value);

        var propsJson = output.Attributes["data-props"].Value.ToString();
        using var doc = JsonDocument.Parse(propsJson!);
        var root = doc.RootElement;

        Assert.Equal(75, root.GetProperty("value").GetDouble());
        Assert.Equal(120, root.GetProperty("size").GetInt32());
        Assert.Equal("#3b82f6", root.GetProperty("color").GetString());
    }

    [Fact]
    public void IslandColorPickerTagHelper_SerializesHexColor()
    {
        var helper = new IslandColorPickerTagHelper
        {
            Value = "#8b5cf6",
            TargetInput = "brand_color"
        };

        var (context, output) = CreateTagHelperContext("island-color-picker");
        helper.Process(context, output);

        Assert.Equal("div", output.TagName);
        Assert.Equal("color-picker", output.Attributes["data-island"].Value);

        var propsJson = output.Attributes["data-props"].Value.ToString();
        using var doc = JsonDocument.Parse(propsJson!);
        var root = doc.RootElement;

        Assert.Equal("#8b5cf6", root.GetProperty("value").GetString());
        Assert.Equal("brand_color", root.GetProperty("targetInputName").GetString());
    }

    [Fact]
    public void IslandBreadcrumbTagHelper_SerializesItems()
    {
        var helper = new IslandBreadcrumbTagHelper
        {
            HomeUrl = "/dashboard",
            Items = new List<BreadcrumbItem>
            {
                new("Settings", "/dashboard/settings"),
                new("Security", "/dashboard/settings/security")
            }
        };

        var (context, output) = CreateTagHelperContext("island-breadcrumb");
        helper.Process(context, output);

        Assert.Equal("div", output.TagName);
        Assert.Equal("breadcrumb", output.Attributes["data-island"].Value);

        var propsJson = output.Attributes["data-props"].Value.ToString();
        using var doc = JsonDocument.Parse(propsJson!);
        var root = doc.RootElement;

        Assert.Equal("/dashboard", root.GetProperty("homeUrl").GetString());
        Assert.Equal(2, root.GetProperty("items").GetArrayLength());
    }

    [Fact]
    public async Task IslandTagHelper_EmitsLangAndDirAttributes()
    {
        var prevCulture = System.Globalization.CultureInfo.CurrentUICulture;
        try
        {
            System.Globalization.CultureInfo.CurrentUICulture = System.Globalization.CultureInfo.GetCultureInfo("en-US");

            var helper = new LaughTale.Core.TagHelpers.IslandTagHelper
            {
                ViewContext = CreateViewContext(),
                Name = "test-island"
            };

            var (context, output) = CreateTagHelperContext("island");
            await helper.ProcessAsync(context, output);

            Assert.Equal("en-US", output.Attributes["lang"].Value);
            Assert.Equal("ltr", output.Attributes["dir"].Value);
        }
        finally
        {
            System.Globalization.CultureInfo.CurrentUICulture = prevCulture;
        }
    }

    [LaughTale.Core.Attributes.IslandAllowAnonymous]
    private class TestIslandBaseTagHelper : IslandTagHelperBase
    {
        public override string IslandName => "test-base-island";
    }

    [Fact]
    public async Task IslandTagHelperBase_EmitsArabicRtlWhenCultureIsArabic()
    {
        var prevCulture = System.Globalization.CultureInfo.CurrentUICulture;
        try
        {
            System.Globalization.CultureInfo.CurrentUICulture = System.Globalization.CultureInfo.GetCultureInfo("ar-SA");

            var helper = new TestIslandBaseTagHelper { ViewContext = CreateViewContext() };
            var (context, output) = CreateTagHelperContext("island-test-base");
            await helper.ProcessAsync(context, output);

            Assert.Equal("ar-SA", output.Attributes["lang"].Value);
            Assert.Equal("rtl", output.Attributes["dir"].Value);
        }
        finally
        {
            System.Globalization.CultureInfo.CurrentUICulture = prevCulture;
        }
    }

    private static Microsoft.AspNetCore.Mvc.Rendering.ViewContext CreateViewContext()
    {
        var services = new Microsoft.Extensions.DependencyInjection.ServiceCollection();
        services.AddLogging();
        services.AddLaughTale(options => options.Refresh.AllowUndeclaredIslands = true);
        var provider = services.BuildServiceProvider();
        var httpContext = new Microsoft.AspNetCore.Http.DefaultHttpContext { RequestServices = provider };
        return new Microsoft.AspNetCore.Mvc.Rendering.ViewContext
        {
            HttpContext = httpContext,
            ViewData = new Microsoft.AspNetCore.Mvc.ViewFeatures.ViewDataDictionary(new Microsoft.AspNetCore.Mvc.ModelBinding.EmptyModelMetadataProvider(), new Microsoft.AspNetCore.Mvc.ModelBinding.ModelStateDictionary())
        };
    }

    [Fact]
    public void IconTagHelper_RendersCleanSvgWithUseElement()
    {
        var helper = new IconTagHelper
        {
            Name = "check",
            Size = 24,
            Color = "#10b981",
            Class = "custom-icon-class"
        };

        var (context, output) = CreateTagHelperContext("lt-icon");
        helper.Process(context, output);

        Assert.Equal("svg", output.TagName);
        Assert.Equal("lt-icon lt-icon-check custom-icon-class", output.Attributes["class"].Value);
        Assert.Equal("24", output.Attributes["width"].Value);
        Assert.Equal("24", output.Attributes["height"].Value);
        Assert.Equal("#10b981", output.Attributes["stroke"].Value);
        Assert.Equal("icon", output.Attributes["data-part"].Value);

        var content = output.Content.GetContent();
        Assert.Contains("<use href=\"/_lt/icons.svg#check\"></use>", content);
        Assert.Equal("true", output.Attributes["aria-hidden"].Value);
    }

    [Fact]
    public void IconTagHelper_AccessibleTitle_EmitsRoleImgAndAriaLabel()
    {
        var helper = new IconTagHelper
        {
            Name = "trash",
            Size = 18,
            Title = "Delete Record"
        };

        var (context, output) = CreateTagHelperContext("lt-icon");
        helper.Process(context, output);

        Assert.Equal("img", output.Attributes["role"].Value);
        Assert.Equal("Delete Record", output.Attributes["aria-label"].Value);
        Assert.False(output.Attributes.ContainsName("aria-hidden"));
    }

    [Fact]
    public void TagHelperEnums_SerializeToCamelCaseJson()
    {
        var helper = new IslandInputTextTagHelper
        {
            Variant = InputVariant.Filled,
            Size = ComponentSize.Large,
            Value = "Hello Enum"
        };

        var (context, output) = CreateTagHelperContext("island-input-text");
        helper.Process(context, output);

        var propsJson = output.Attributes["data-props"].Value.ToString()!;
        Assert.Contains("\"variant\":\"filled\"", propsJson);
        Assert.Contains("\"size\":\"large\"", propsJson);
    }

    [Fact]
    public void TagHelperEnums_TypoFailsParsing()
    {
        var validParsed = Enum.TryParse<InputVariant>("Outlined", ignoreCase: true, out var validResult);
        Assert.True(validParsed);
        Assert.Equal(InputVariant.Outlined, validResult);

        var typoParsed = Enum.TryParse<InputVariant>("outlnied", ignoreCase: true, out _);
        Assert.False(typoParsed, "A typo'd variant must fail enum parsing.");

        var sizeTypoParsed = Enum.TryParse<ComponentSize>("normalll", ignoreCase: true, out _);
        Assert.False(sizeTypoParsed, "A typo'd size must fail enum parsing.");
    }

    [Fact]
    public async Task IslandInputTextTagHelper_EmitsNativeInput_WithFormControl()
    {
        var helper = new IslandInputTextTagHelper
        {
            Name = "CustomerName",
            Value = "Alice"
        };

        var services = new ServiceCollection();
        services.AddLogging();
        services.AddAuthorization();
        services.AddLaughTale(opt => opt.Refresh.AllowUndeclaredIslands = true);
        var sp = services.BuildServiceProvider();

        var httpContext = new Microsoft.AspNetCore.Http.DefaultHttpContext { RequestServices = sp };
        var actionContext = new Microsoft.AspNetCore.Mvc.ActionContext(httpContext, new Microsoft.AspNetCore.Routing.RouteData(), new Microsoft.AspNetCore.Mvc.Abstractions.ActionDescriptor());
        var viewData = new Microsoft.AspNetCore.Mvc.ViewFeatures.ViewDataDictionary(new Microsoft.AspNetCore.Mvc.ModelBinding.EmptyModelMetadataProvider(), new Microsoft.AspNetCore.Mvc.ModelBinding.ModelStateDictionary());
        helper.ViewContext = new Microsoft.AspNetCore.Mvc.Rendering.ViewContext(actionContext, new MockTestView(), viewData, new Microsoft.AspNetCore.Mvc.ViewFeatures.TempDataDictionary(httpContext, new MockTestTempDataProvider()), System.IO.TextWriter.Null, new Microsoft.AspNetCore.Mvc.ViewFeatures.HtmlHelperOptions());

        var (context, output) = CreateTagHelperContext("island-input-text");
        await helper.ProcessAsync(context, output);

        Assert.Equal("true", output.Attributes["data-lt-ssr"]?.Value?.ToString());
        var content = output.Content.GetContent();
        Assert.Contains("name=\"CustomerName\"", content);
        Assert.Contains("value=\"Alice\"", content);
        Assert.Contains("data-lt-field", content);
    }

    private class MockTestView : Microsoft.AspNetCore.Mvc.ViewEngines.IView
    {
        public string Path => "/test";
        public Task RenderAsync(Microsoft.AspNetCore.Mvc.Rendering.ViewContext context) => Task.CompletedTask;
    }

    private class MockTestTempDataProvider : Microsoft.AspNetCore.Mvc.ViewFeatures.ITempDataProvider
    {
        public IDictionary<string, object> LoadTempData(Microsoft.AspNetCore.Http.HttpContext context) => new Dictionary<string, object>();
        public void SaveTempData(Microsoft.AspNetCore.Http.HttpContext context, IDictionary<string, object> values) { }
    }
}
