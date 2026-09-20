using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Razor.TagHelpers;
using LaughTale.Components.TagHelpers.Aura.Regions;
using Xunit;

namespace LaughTale.Tests.TagHelpers;

/// <summary>
/// ROADMAP.v5.md Part E "Partials": verifies IslandRegionTagHelper generates the correct addressable
/// id/data-region and preserves child content, mirroring IslandFormTagHelperTests's harness.
/// </summary>
public class IslandRegionTagHelperTests
{
    private static (TagHelperContext Context, TagHelperOutput Output) CreateTagHelperContext(string tagName, string childContent = "")
    {
        var context = new TagHelperContext(
            new TagHelperAttributeList(),
            new System.Collections.Generic.Dictionary<object, object>(),
            Guid.NewGuid().ToString("N"));

        var content = new DefaultTagHelperContent();
        content.SetHtmlContent(childContent);

        var output = new TagHelperOutput(
            tagName,
            new TagHelperAttributeList(),
            (useCachedResult, encoder) => Task.FromResult<TagHelperContent>(content));

        // Force GetChildContentAsync-independent access: assign PreContent's sibling Content directly,
        // matching how Razor populates it before Process() runs for a tag with body markup.
        output.Content.SetHtmlContent(childContent);

        return (context, output);
    }

    [Fact]
    public void Process_SetsIdAndDataRegionFromName()
    {
        var helper = new IslandRegionTagHelper { Name = "preview" };
        var (context, output) = CreateTagHelperContext("island-region");

        helper.Process(context, output);

        Assert.Equal("lt-region-preview", output.Attributes["id"].Value);
        Assert.Equal("preview", output.Attributes["data-region"].Value);
    }

    [Fact]
    public void Process_DefaultsToDivTag()
    {
        var helper = new IslandRegionTagHelper { Name = "preview" };
        var (context, output) = CreateTagHelperContext("island-region");

        helper.Process(context, output);

        Assert.Equal("div", output.TagName);
    }

    [Fact]
    public void Process_CustomTag_UsesGivenTagName()
    {
        var helper = new IslandRegionTagHelper { Name = "preview", Tag = "section" };
        var (context, output) = CreateTagHelperContext("island-region");

        helper.Process(context, output);

        Assert.Equal("section", output.TagName);
    }

    [Fact]
    public void Process_EmptyName_Throws()
    {
        var helper = new IslandRegionTagHelper { Name = "" };
        var (context, output) = CreateTagHelperContext("island-region");

        Assert.Throws<InvalidOperationException>(() => helper.Process(context, output));
    }

    [Fact]
    public void Process_PreservesChildContent()
    {
        var helper = new IslandRegionTagHelper { Name = "preview" };
        var (context, output) = CreateTagHelperContext("island-region", "<p>Item 1</p>");

        helper.Process(context, output);

        Assert.Equal("<p>Item 1</p>", output.Content.GetContent());
    }
}
