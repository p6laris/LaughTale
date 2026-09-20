using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Razor.TagHelpers;
using LaughTale.Components.TagHelpers.Aura.Regions;
using Xunit;

namespace LaughTale.Tests.TagHelpers;

/// <summary>
/// ROADMAP.v5.md Part E "Nested layouts & outlets": verifies IslandOutletTagHelper generates the
/// correct addressable id/data-outlet and preserves child content, mirroring
/// IslandRegionTagHelperTests's harness.
/// </summary>
public class IslandOutletTagHelperTests
{
    private static (TagHelperContext Context, TagHelperOutput Output) CreateTagHelperContext(string tagName, string childContent = "")
    {
        var context = new TagHelperContext(
            new TagHelperAttributeList(),
            new System.Collections.Generic.Dictionary<object, object>(),
            Guid.NewGuid().ToString("N"));

        var output = new TagHelperOutput(
            tagName,
            new TagHelperAttributeList(),
            (useCachedResult, encoder) => Task.FromResult<TagHelperContent>(new DefaultTagHelperContent()));

        output.Content.SetHtmlContent(childContent);

        return (context, output);
    }

    [Fact]
    public void Process_DefaultsToNameDefault_GeneratingLtOutletDefault()
    {
        var helper = new IslandOutletTagHelper();
        var (context, output) = CreateTagHelperContext("island-outlet");

        helper.Process(context, output);

        Assert.Equal("lt-outlet-default", output.Attributes["id"].Value);
        Assert.Equal("default", output.Attributes["data-outlet"].Value);
    }

    [Fact]
    public void Process_CustomName_UsesGivenName()
    {
        var helper = new IslandOutletTagHelper { Name = "demo-section" };
        var (context, output) = CreateTagHelperContext("island-outlet");

        helper.Process(context, output);

        Assert.Equal("lt-outlet-demo-section", output.Attributes["id"].Value);
        Assert.Equal("demo-section", output.Attributes["data-outlet"].Value);
    }

    [Fact]
    public void Process_RendersAsDiv()
    {
        var helper = new IslandOutletTagHelper();
        var (context, output) = CreateTagHelperContext("island-outlet");

        helper.Process(context, output);

        Assert.Equal("div", output.TagName);
    }

    [Fact]
    public void Process_PreservesChildContent()
    {
        var helper = new IslandOutletTagHelper();
        var (context, output) = CreateTagHelperContext("island-outlet", "<main>Page content</main>");

        helper.Process(context, output);

        Assert.Equal("<main>Page content</main>", output.Content.GetContent());
    }
}
