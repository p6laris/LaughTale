using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using Microsoft.AspNetCore.Razor.TagHelpers;
using LaughTale.Components.TagHelpers;
using LaughTale.Core.Theming;
using Xunit;

namespace LaughTale.Tests.Theming;

public class ServerThemeTests
{
    [Fact]
    public void ThemeTagHelper_Renders_Style_Tag_With_Enum_Defaults()
    {
        var options = new LaughTaleThemeOptions
        {
            Primary = LaughTalePalette.Emerald,
            Surface = LaughTaleSurface.Slate,
            Radius = LaughTaleRadius.Md
        };

        var tagHelper = new ThemeTagHelper(options);
        var context = new TagHelperContext(
            new TagHelperAttributeList(),
            new Dictionary<object, object>(),
            "test");

        var output = new TagHelperOutput(
            "laughtale-theme",
            new TagHelperAttributeList(),
            (useCachedResult, encoder) => Task.FromResult<TagHelperContent>(new DefaultTagHelperContent()));

        tagHelper.Process(context, output);

        Assert.Equal("style", output.TagName);
        Assert.Equal("laughtale-ssr-theme", output.Attributes["id"].Value);
        var html = output.Content.GetContent();
        Assert.Contains("--lt-border-radius: 0.5rem", html);
    }

    [Fact]
    public void ThemeTagHelper_Renders_With_Explicit_TagHelper_Enums()
    {
        var tagHelper = new ThemeTagHelper
        {
            Primary = LaughTalePalette.Violet,
            Surface = LaughTaleSurface.Zinc,
            Radius = LaughTaleRadius.Lg,
            DarkMode = LaughTaleDarkMode.Dark
        };

        var context = new TagHelperContext(
            new TagHelperAttributeList(),
            new Dictionary<object, object>(),
            "test");

        var output = new TagHelperOutput(
            "laughtale-theme",
            new TagHelperAttributeList(),
            (useCachedResult, encoder) => Task.FromResult<TagHelperContent>(new DefaultTagHelperContent()));

        tagHelper.Process(context, output);

        var html = output.Content.GetContent();
        Assert.Contains("--lt-border-radius: 0.75rem", html);
        Assert.Contains("color-scheme: dark;", html);
    }

    [Fact]
    public void ThemeTagHelper_Reads_User_Cookie_Override()
    {
        var options = new LaughTaleThemeOptions { Radius = LaughTaleRadius.Md };
        var httpContext = new DefaultHttpContext();
        httpContext.Request.Headers["Cookie"] = "lt-theme=%7B%22primary%22%3A%22violet%22%2C%22radius%22%3A%221rem%22%2C%22darkMode%22%3Atrue%7D";

        var tagHelper = new ThemeTagHelper(options)
        {
            ViewContext = new ViewContext
            {
                HttpContext = httpContext,
                ViewData = new ViewDataDictionary(new EmptyModelMetadataProvider(), new ModelStateDictionary())
            }
        };

        var context = new TagHelperContext(
            new TagHelperAttributeList(),
            new Dictionary<object, object>(),
            "test");

        var output = new TagHelperOutput(
            "laughtale-theme",
            new TagHelperAttributeList(),
            (useCachedResult, encoder) => Task.FromResult<TagHelperContent>(new DefaultTagHelperContent()));

        tagHelper.Process(context, output);

        var html = output.Content.GetContent();
        Assert.Contains("--lt-border-radius: 1rem", html);
        Assert.Contains("color-scheme: dark;", html);
    }
}
