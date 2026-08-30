using Microsoft.AspNetCore.Razor.TagHelpers;
using LaughTale.Core.Enums;
using LaughTale.Core.TagHelpers;
using Xunit;

namespace LaughTale.Tests.TagHelpers;

public class IslandErrorBoundaryTests
{
    [Fact]
    public async Task IslandTagHelper_RendersFallbackAttributeAndTemplate()
    {
        var tagHelper = new IslandTagHelper
        {
            Name = "dynamic-chart",
            Hydrate = HydrateStrategy.Visible,
            Fallback = "<p>Static Server Chart Fallback</p>"
        };

        var context = new TagHelperContext(
            new TagHelperAttributeList(),
            new Dictionary<object, object>(),
            Guid.NewGuid().ToString("N"));

        var output = new TagHelperOutput(
            "island",
            new TagHelperAttributeList(),
            (useCachedResult, encoder) => Task.FromResult<TagHelperContent>(new DefaultTagHelperContent()));

        await tagHelper.ProcessAsync(context, output);

        Assert.Equal("div", output.TagName);
        Assert.True(output.Attributes.ContainsName("data-fallback"));
        Assert.Equal("<p>Static Server Chart Fallback</p>", output.Attributes["data-fallback"].Value);

        var content = output.Content.GetContent();
        Assert.Contains("<template data-slot=\"fallback\" class=\"island-fallback-template\">", content);
        Assert.Contains("&lt;p&gt;Static Server Chart Fallback&lt;/p&gt;", content);
    }
}
