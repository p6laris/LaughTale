using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Antiforgery;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using Microsoft.AspNetCore.Razor.TagHelpers;
using Microsoft.Extensions.DependencyInjection;
using LaughTale.Components.TagHelpers.Aura.Forms;
using Xunit;

namespace LaughTale.Tests.TagHelpers;

/// <summary>
/// Server Actions Layer 1: verifies IslandFormTagHelper actually injects a valid antiforgery
/// hidden field into a real TagHelperOutput.PostContent (not assumed), plus the l-post/l-target/
/// l-swap/method attributes the client-side bindServerAction() engine relies on.
/// </summary>
public class IslandFormTagHelperTests
{
    private static (IAntiforgery Antiforgery, ViewContext ViewContext) CreateRealAntiforgeryContext()
    {
        var services = new ServiceCollection();
        services.AddLogging();
        services.AddDataProtection();
        services.AddAntiforgery();
        var provider = services.BuildServiceProvider();

        var antiforgery = provider.GetRequiredService<IAntiforgery>();

        var httpContext = new DefaultHttpContext { RequestServices = provider };
        var viewContext = new ViewContext
        {
            HttpContext = httpContext,
            ViewData = new ViewDataDictionary(new EmptyModelMetadataProvider(), new ModelStateDictionary())
        };

        return (antiforgery, viewContext);
    }

    private static (TagHelperContext Context, TagHelperOutput Output) CreateTagHelperContext(string tagName)
    {
        var context = new TagHelperContext(
            new TagHelperAttributeList(),
            new System.Collections.Generic.Dictionary<object, object>(),
            Guid.NewGuid().ToString("N"));

        var output = new TagHelperOutput(
            tagName,
            new TagHelperAttributeList(),
            (useCachedResult, encoder) => Task.FromResult<TagHelperContent>(new DefaultTagHelperContent()));

        return (context, output);
    }

    [Fact]
    public void Process_InjectsAntiforgeryHiddenField_WithCorrectFieldNameAndToken()
    {
        var (antiforgery, viewContext) = CreateRealAntiforgeryContext();
        var expectedTokens = antiforgery.GetAndStoreTokens(viewContext.HttpContext);

        var helper = new IslandFormTagHelper(antiforgery)
        {
            ViewContext = viewContext,
            Action = "Save"
        };

        var (context, output) = CreateTagHelperContext("island-form");
        helper.Process(context, output);

        var postContentHtml = output.PostContent.GetContent();

        Assert.Contains($"name=\"{expectedTokens.FormFieldName}\"", postContentHtml);
        Assert.Contains("type=\"hidden\"", postContentHtml);
        Assert.Contains($"value=\"{expectedTokens.RequestToken}\"", postContentHtml);
    }

    [Fact]
    public void Process_SetsFormTagAndMethodPost()
    {
        var (antiforgery, viewContext) = CreateRealAntiforgeryContext();
        var helper = new IslandFormTagHelper(antiforgery)
        {
            ViewContext = viewContext,
            Action = "Save"
        };

        var (context, output) = CreateTagHelperContext("island-form");
        helper.Process(context, output);

        Assert.Equal("form", output.TagName);
        Assert.Equal("post", output.Attributes["method"].Value);
    }

    [Fact]
    public void Process_WithExplicitTarget_UsesItForIdAndLTarget()
    {
        var (antiforgery, viewContext) = CreateRealAntiforgeryContext();
        var helper = new IslandFormTagHelper(antiforgery)
        {
            ViewContext = viewContext,
            Action = "Save",
            Target = "#my-panel"
        };

        var (context, output) = CreateTagHelperContext("island-form");
        helper.Process(context, output);

        Assert.Equal("my-panel", output.Attributes["id"].Value);
        Assert.Equal("#my-panel", output.Attributes["l-target"].Value);
        Assert.Equal("?handler=Save", output.Attributes["l-post"].Value);
    }

    [Fact]
    public void Process_WithoutExplicitTarget_DerivesStableIdFromUniqueId()
    {
        var (antiforgery, viewContext) = CreateRealAntiforgeryContext();
        var helper = new IslandFormTagHelper(antiforgery)
        {
            ViewContext = viewContext,
            Action = "Submit"
        };

        var (context, output) = CreateTagHelperContext("island-form");
        helper.Process(context, output);

        var expectedId = $"lt-form-{context.UniqueId}";
        Assert.Equal(expectedId, output.Attributes["id"].Value);
        Assert.Equal($"#{expectedId}", output.Attributes["l-target"].Value);
    }

    [Fact]
    public void Process_DefaultSwap_IsOuterHTML()
    {
        var (antiforgery, viewContext) = CreateRealAntiforgeryContext();
        var helper = new IslandFormTagHelper(antiforgery)
        {
            ViewContext = viewContext,
            Action = "Save"
        };

        var (context, output) = CreateTagHelperContext("island-form");
        helper.Process(context, output);

        Assert.Equal("outerHTML", output.Attributes["l-swap"].Value);
    }

    [Fact]
    public void Process_SetsRealActionAttribute_ForNoJsFallbackSubmit()
    {
        var (antiforgery, viewContext) = CreateRealAntiforgeryContext();
        viewContext.HttpContext.Request.Path = "/orders/42";
        var helper = new IslandFormTagHelper(antiforgery)
        {
            ViewContext = viewContext,
            Action = "Save"
        };

        var (context, output) = CreateTagHelperContext("island-form");
        helper.Process(context, output);

        Assert.Equal("/orders/42?handler=Save", output.Attributes["action"].Value);
    }

    [Fact]
    public void Process_ExplicitSwap_OverridesDefault()
    {
        var (antiforgery, viewContext) = CreateRealAntiforgeryContext();
        var helper = new IslandFormTagHelper(antiforgery)
        {
            ViewContext = viewContext,
            Action = "Save",
            Swap = "innerHTML"
        };

        var (context, output) = CreateTagHelperContext("island-form");
        helper.Process(context, output);

        Assert.Equal("innerHTML", output.Attributes["l-swap"].Value);
    }
}
