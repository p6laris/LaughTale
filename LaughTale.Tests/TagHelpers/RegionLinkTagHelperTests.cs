using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Razor.TagHelpers;
using LaughTale.Components.TagHelpers.Aura.Regions;
using Xunit;

namespace LaughTale.Tests.TagHelpers;

/// <summary>
/// ROADMAP.v5.md Part E "Partials": verifies RegionLinkTagHelper wires a plain &lt;a region="..."&gt;
/// into the existing l-get/l-target/l-swap fragment-swap engine, mirroring IslandFormTagHelperTests's
/// harness.
/// </summary>
public class RegionLinkTagHelperTests
{
    private static (TagHelperContext Context, TagHelperOutput Output) CreateTagHelperContext(string? href)
    {
        var context = new TagHelperContext(
            new TagHelperAttributeList(),
            new System.Collections.Generic.Dictionary<object, object>(),
            Guid.NewGuid().ToString("N"));

        var outputAttributes = new TagHelperAttributeList();
        if (href != null)
        {
            outputAttributes.SetAttribute("href", href);
        }

        var output = new TagHelperOutput(
            "a",
            outputAttributes,
            (useCachedResult, encoder) => Task.FromResult<TagHelperContent>(new DefaultTagHelperContent()));

        return (context, output);
    }

    [Fact]
    public void Process_SetsLGetLTargetAndDefaultSwap()
    {
        var helper = new RegionLinkTagHelper { Region = "preview" };
        var (context, output) = CreateTagHelperContext("/Partials?handler=Show&id=2");

        helper.Process(context, output);

        Assert.Equal("/Partials?handler=Show&id=2", output.Attributes["l-get"].Value);
        Assert.Equal("#lt-region-preview", output.Attributes["l-target"].Value);
        Assert.Equal("innerHTML", output.Attributes["l-swap"].Value);
    }

    [Fact]
    public void Process_ExplicitSwap_OverridesDefault()
    {
        var helper = new RegionLinkTagHelper { Region = "preview", Swap = "outerHTML" };
        var (context, output) = CreateTagHelperContext("/Partials?handler=Show");

        helper.Process(context, output);

        Assert.Equal("outerHTML", output.Attributes["l-swap"].Value);
    }

    [Fact]
    public void Process_RemovesRegionAttribute_ReplacesWithDataRegion()
    {
        var helper = new RegionLinkTagHelper { Region = "preview" };
        var (context, output) = CreateTagHelperContext("/Partials?handler=Show");

        helper.Process(context, output);

        Assert.False(output.Attributes.ContainsName("region"));
        Assert.Equal("preview", output.Attributes["data-region"].Value);
    }

    [Fact]
    public void Process_EmptyHref_DoesNotSetSwapAttributes()
    {
        var helper = new RegionLinkTagHelper { Region = "preview" };
        var (context, output) = CreateTagHelperContext(href: null);

        helper.Process(context, output);

        Assert.False(output.Attributes.ContainsName("l-get"));
        Assert.False(output.Attributes.ContainsName("l-target"));
    }

    [Fact]
    public void Order_RunsAfterDefaultTagHelpers()
    {
        var helper = new RegionLinkTagHelper();

        Assert.True(helper.Order > 0);
    }
}
