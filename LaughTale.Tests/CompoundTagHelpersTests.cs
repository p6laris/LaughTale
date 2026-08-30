using Microsoft.AspNetCore.Razor.TagHelpers;
using LaughTale.Components.Enums;
using LaughTale.Components.TagHelpers;
using Xunit;

namespace LaughTale.Tests;

public class CompoundTagHelpersTests
{
    [Fact]
    public async Task IslandLabelTagHelper_RendersLabelWithRequiredAsterisk()
    {
        var tagHelper = new IslandLabelTagHelper
        {
            For = "userEmail",
            Required = true
        };

        var context = new TagHelperContext(
            new TagHelperAttributeList(),
            new Dictionary<object, object>(),
            "test-unique-id"
        );

        var output = new TagHelperOutput(
            "island-label",
            new TagHelperAttributeList(),
            (useCachedResult, encoder) => Task.FromResult<TagHelperContent>(new DefaultTagHelperContent().SetContent("Email Address"))
        );

        await tagHelper.ProcessAsync(context, output);

        Assert.Equal("label", output.TagName);
        Assert.Equal("userEmail", output.Attributes["for"].Value);
        Assert.Contains("Email Address", output.Content.GetContent());
        Assert.Contains("*", output.Content.GetContent());
    }

    [Fact]
    public async Task IslandButtonTagHelper_RendersButtonWithVariantAndSize()
    {
        var tagHelper = new IslandButtonTagHelper
        {
            Variant = "outlined",
            Size = "small",
            Icon = "check"
        };

        var context = new TagHelperContext(
            new TagHelperAttributeList(),
            new Dictionary<object, object>(),
            "test-unique-id"
        );

        var output = new TagHelperOutput(
            "island-button",
            new TagHelperAttributeList(),
            (useCachedResult, encoder) => Task.FromResult<TagHelperContent>(new DefaultTagHelperContent().SetContent("Confirm"))
        );

        await tagHelper.ProcessAsync(context, output);

        Assert.Equal("button", output.TagName);
        Assert.Contains("p-button", output.Attributes["class"].Value.ToString());
        Assert.Contains("p-button-outlined", output.Attributes["class"].Value.ToString());
        Assert.Contains("p-button-sm", output.Attributes["class"].Value.ToString());
        Assert.Contains("Confirm", output.Content.GetContent());
    }

    [Fact]
    public async Task IslandCardTagHelper_RendersCardContainer()
    {
        var tagHelper = new IslandCardTagHelper { Class = "custom-card-class" };

        var context = new TagHelperContext(
            new TagHelperAttributeList(),
            new Dictionary<object, object>(),
            "test-unique-id"
        );

        var output = new TagHelperOutput(
            "island-card",
            new TagHelperAttributeList(),
            (useCachedResult, encoder) => Task.FromResult<TagHelperContent>(new DefaultTagHelperContent().SetContent("Card Body Content"))
        );

        await tagHelper.ProcessAsync(context, output);

        Assert.Equal("div", output.TagName);
        Assert.Contains("laughtale-card", output.Attributes["class"].Value.ToString());
        Assert.Contains("custom-card-class", output.Attributes["class"].Value.ToString());
        Assert.Equal("Card Body Content", output.Content.GetContent());
    }
}
