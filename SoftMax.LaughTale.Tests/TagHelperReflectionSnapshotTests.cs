using System.Reflection;
using System.Text.Json;
using Microsoft.AspNetCore.Razor.TagHelpers;
using SoftMax.LaughTale.Components.TagHelpers;
using Xunit;

namespace SoftMax.LaughTale.Tests;

public class TagHelperReflectionSnapshotTests
{
    public static IEnumerable<object[]> GetAllComponentTagHelperTypes()
    {
        var assembly = typeof(IslandNumberTagHelper).Assembly;
        var tagHelperTypes = assembly.GetTypes()
            .Where(t => typeof(ITagHelper).IsAssignableFrom(t) && !t.IsAbstract && t.GetConstructor(Type.EmptyTypes) != null)
            .OrderBy(t => t.Name);

        foreach (var type in tagHelperTypes)
        {
            yield return new object[] { type };
        }
    }

    private static (TagHelperContext Context, TagHelperOutput Output) CreateContext(Type tagHelperType)
    {
        var targetAttrs = tagHelperType.GetCustomAttributes<HtmlTargetElementAttribute>();
        var tagName = targetAttrs.FirstOrDefault()?.Tag ?? "div";

        var items = new Dictionary<object, object>
        {
            ["CurrentDialogId"] = "test-dialog-1",
            ["CurrentAccordionItemId"] = "test-accordion-item-1"
        };

        var context = new TagHelperContext(
            new TagHelperAttributeList(),
            items,
            Guid.NewGuid().ToString()
        );

        var output = new TagHelperOutput(
            tagName,
            new TagHelperAttributeList(),
            (useCachedResult, encoder) => Task.FromResult<TagHelperContent>(new DefaultTagHelperContent())
        );

        return (context, output);
    }

    [Theory]
    [MemberData(nameof(GetAllComponentTagHelperTypes))]
    public async Task TagHelper_RendersValidHtmlAndJsonProps(Type tagHelperType)
    {
        var instance = (ITagHelper)Activator.CreateInstance(tagHelperType)!;
        var (context, output) = CreateContext(tagHelperType);

        await instance.ProcessAsync(context, output);

        // 1. If data-props attribute is emitted, it MUST be valid JSON
        if (output.Attributes.TryGetAttribute("data-props", out var propsAttr) && propsAttr.Value != null)
        {
            var propsStr = propsAttr.Value.ToString();
            Assert.False(string.IsNullOrWhiteSpace(propsStr), $"{tagHelperType.Name} data-props must not be whitespace");

            var parseException = Record.Exception(() =>
            {
                using var doc = JsonDocument.Parse(propsStr!);
                Assert.True(doc.RootElement.ValueKind != JsonValueKind.Undefined);
            });

            Assert.Null(parseException);
        }

        // 2. If data-island is emitted, it must not be empty
        if (output.Attributes.TryGetAttribute("data-island", out var islandAttr) && islandAttr.Value != null)
        {
            Assert.False(string.IsNullOrWhiteSpace(islandAttr.Value.ToString()), $"{tagHelperType.Name} data-island must not be empty");
        }
    }

    [Fact]
    public void Discovers_Over_100_TagHelpers()
    {
        var count = GetAllComponentTagHelperTypes().Count();
        Assert.True(count >= 100, $"Expected at least 100 TagHelpers in SoftMax.LaughTale.Components, found {count}");
    }
}
