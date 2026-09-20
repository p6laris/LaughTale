using System;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using Microsoft.AspNetCore.Razor.TagHelpers;
using LaughTale.Components.Rendering;
using LaughTale.Components.TagHelpers.Aura.Seo;
using Xunit;

namespace LaughTale.Tests.TagHelpers;

/// <summary>
/// ROADMAP.v5.md Part E "Middleware &amp; typed head": verifies PageHeadTagHelper renders the typed
/// PageHead into title/meta/link tags, and falls back correctly for pages that only set the untyped
/// ViewData["Title"]. Mirrors IslandFormTagHelperTests's real-ViewContext harness.
/// </summary>
public class PageHeadTagHelperTests
{
    private static ViewContext CreateViewContext()
    {
        var httpContext = new DefaultHttpContext();
        return new ViewContext
        {
            HttpContext = httpContext,
            ViewData = new ViewDataDictionary(new EmptyModelMetadataProvider(), new ModelStateDictionary())
        };
    }

    private static (TagHelperContext Context, TagHelperOutput Output) CreateTagHelperContext()
    {
        var context = new TagHelperContext(
            new TagHelperAttributeList(),
            new System.Collections.Generic.Dictionary<object, object>(),
            Guid.NewGuid().ToString("N"));

        var output = new TagHelperOutput(
            "page-head",
            new TagHelperAttributeList(),
            (useCachedResult, encoder) => System.Threading.Tasks.Task.FromResult<TagHelperContent>(new DefaultTagHelperContent()));

        return (context, output);
    }

    [Fact]
    public void Process_RendersNoWrappingElement()
    {
        var viewContext = CreateViewContext();
        var helper = new PageHeadTagHelper { ViewContext = viewContext };
        var (context, output) = CreateTagHelperContext();

        helper.Process(context, output);

        Assert.Null(output.TagName);
    }

    [Fact]
    public void Process_RendersTitleWithSuffix()
    {
        var viewContext = CreateViewContext();
        viewContext.ViewData.SetHead(new PageHead(Title: "Partials"));
        var helper = new PageHeadTagHelper { ViewContext = viewContext, Suffix = " - LaughTale" };
        var (context, output) = CreateTagHelperContext();

        helper.Process(context, output);

        Assert.Contains("<title>Partials - LaughTale</title>", output.Content.GetContent());
    }

    [Fact]
    public void Process_FallsBackToUntypedViewDataTitle_WhenSetHeadNeverCalled()
    {
        var viewContext = CreateViewContext();
        viewContext.ViewData["Title"] = "Legacy Page";
        var helper = new PageHeadTagHelper { ViewContext = viewContext };
        var (context, output) = CreateTagHelperContext();

        helper.Process(context, output);

        Assert.Contains("<title>Legacy Page</title>", output.Content.GetContent());
    }

    [Fact]
    public void Process_RendersDescriptionAndOpenGraphTags_WithFallbacks()
    {
        var viewContext = CreateViewContext();
        viewContext.ViewData.SetHead(new PageHead(Title: "Partials", Description: "A named region demo"));
        var helper = new PageHeadTagHelper { ViewContext = viewContext };
        var (context, output) = CreateTagHelperContext();

        helper.Process(context, output);
        var html = output.Content.GetContent();

        Assert.Contains("<meta name=\"description\" content=\"A named region demo\" />", html);
        // OgTitle/OgDescription fall back to Title/Description when not explicitly set.
        Assert.Contains("<meta property=\"og:title\" content=\"Partials\" />", html);
        Assert.Contains("<meta property=\"og:description\" content=\"A named region demo\" />", html);
        Assert.Contains("<meta property=\"og:type\" content=\"website\" />", html);
    }

    [Fact]
    public void Process_RendersExplicitOgImageAndCanonicalUrl()
    {
        var viewContext = CreateViewContext();
        viewContext.ViewData.SetHead(new PageHead(
            Title: "Partials",
            OgImage: "https://example.com/preview.png",
            CanonicalUrl: "https://example.com/partials"));
        var helper = new PageHeadTagHelper { ViewContext = viewContext };
        var (context, output) = CreateTagHelperContext();

        helper.Process(context, output);
        var html = output.Content.GetContent();

        Assert.Contains("<meta property=\"og:image\" content=\"https://example.com/preview.png\" />", html);
        Assert.Contains("<link rel=\"canonical\" href=\"https://example.com/partials\" />", html);
    }

    [Fact]
    public void Process_RendersCustomMetaEntries()
    {
        var viewContext = CreateViewContext();
        viewContext.ViewData.SetHead(new PageHead(
            Title: "Partials",
            CustomMeta: new[] { ("robots", "noindex") }));
        var helper = new PageHeadTagHelper { ViewContext = viewContext };
        var (context, output) = CreateTagHelperContext();

        helper.Process(context, output);

        Assert.Contains("<meta name=\"robots\" content=\"noindex\" />", output.Content.GetContent());
    }

    [Fact]
    public void Process_EncodesHtmlInUntrustedValues()
    {
        var viewContext = CreateViewContext();
        viewContext.ViewData.SetHead(new PageHead(Title: "<script>alert(1)</script>"));
        var helper = new PageHeadTagHelper { ViewContext = viewContext };
        var (context, output) = CreateTagHelperContext();

        helper.Process(context, output);
        var html = output.Content.GetContent();

        Assert.DoesNotContain("<script>alert(1)</script>", html);
        Assert.Contains("&lt;script&gt;", html);
    }
}
