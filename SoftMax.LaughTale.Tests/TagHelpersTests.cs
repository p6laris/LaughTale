using Microsoft.AspNetCore.Razor.TagHelpers;
using SoftMax.LaughTale.Components.Models;
using SoftMax.LaughTale.Components.TagHelpers;
using System.Text.Json;
using Xunit;

namespace SoftMax.LaughTale.Tests;

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
            Mode = "currency",
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
}
