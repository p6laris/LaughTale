using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using Microsoft.AspNetCore.Razor.TagHelpers;
using Microsoft.Extensions.DependencyInjection;
using LaughTale.Components.TagHelpers;
using LaughTale.Core.Attributes;
using LaughTale.Core.Extensions;
using Xunit;

namespace LaughTale.Tests.TagHelpers;

[IslandAllowAnonymous]
public class TestSsrIslandTagHelper : IslandTagHelperBase
{
    public override string IslandName => "test-ssr-card";

    protected override string? BuildSsrHtml()
    {
        return "<div class=\"ssr-skeleton\">Loading card...</div>";
    }
}

public class IslandSsrRenderingTests
{
    private static ViewContext CreateViewContext()
    {
        var services = new ServiceCollection();
        services.AddLogging();
        services.AddLaughTale();
        var provider = services.BuildServiceProvider();

        var httpContext = new DefaultHttpContext { RequestServices = provider };
        return new ViewContext
        {
            HttpContext = httpContext,
            ViewData = new ViewDataDictionary(new EmptyModelMetadataProvider(), new ModelStateDictionary())
        };
    }

    [Fact]
    public async Task ProcessAsync_BuildsSsrHtmlAndSetsSsrAttribute_WhenNoChildContent()
    {
        var tagHelper = new TestSsrIslandTagHelper { ViewContext = CreateViewContext() };
        var (context, output) = CreateTagHelperContext("test-ssr-card");

        await tagHelper.ProcessAsync(context, output);

        Assert.True(output.Attributes.ContainsName("data-lt-ssr"));
        Assert.Equal("true", output.Attributes["data-lt-ssr"].Value.ToString());
        Assert.Contains("ssr-skeleton", output.Content.GetContent());
    }

    [Fact]
    public async Task ProcessAsync_PreservesChildContent_WhenSlotProvided()
    {
        var tagHelper = new TestSsrIslandTagHelper { ViewContext = CreateViewContext() };
        var (context, output) = CreateTagHelperContextWithContent("test-ssr-card", "<span>Custom Slot Content</span>");

        await tagHelper.ProcessAsync(context, output);

        Assert.False(output.Attributes.ContainsName("data-lt-ssr"));
        Assert.Contains("Custom Slot Content", output.Content.GetContent());
    }

    private static (TagHelperContext Context, TagHelperOutput Output) CreateTagHelperContext(string tagName)
    {
        var context = new TagHelperContext(
            new TagHelperAttributeList(),
            new Dictionary<object, object>(),
            Guid.NewGuid().ToString("N"));

        var output = new TagHelperOutput(
            tagName,
            new TagHelperAttributeList(),
            (useCachedResult, encoder) => Task.FromResult<TagHelperContent>(new DefaultTagHelperContent()));

        return (context, output);
    }

    private static (TagHelperContext Context, TagHelperOutput Output) CreateTagHelperContextWithContent(string tagName, string htmlContent)
    {
        var context = new TagHelperContext(
            new TagHelperAttributeList(),
            new Dictionary<object, object>(),
            Guid.NewGuid().ToString("N"));

        var output = new TagHelperOutput(
            tagName,
            new TagHelperAttributeList(),
            (useCachedResult, encoder) =>
            {
                var content = new DefaultTagHelperContent();
                content.SetHtmlContent(htmlContent);
                return Task.FromResult<TagHelperContent>(content);
            });

        return (context, output);
    }
}
