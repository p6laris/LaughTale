using LaughTale.Markdown.Pipeline;
using Xunit;

namespace LaughTale.Tests.Markdown;

// ROADMAP.v5.md Part F: IslandMarkdownPipeline.Parse<TMetadata> previously swallowed any YAML
// frontmatter deserialization failure silently, falling back to a blank TMetadata() - a typo'd key
// or a value that doesn't match the schema never failed anything, it just shipped half-empty
// metadata nobody noticed until a page rendered with a missing title. These tests cover both the
// still-working happy path and the now-loud failure path.
public class IslandMarkdownPipelineTests
{
    private sealed class TestFrontmatter
    {
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public int Order { get; set; }
    }

    [Fact]
    public void Parse_with_well_formed_frontmatter_populates_typed_metadata()
    {
        var markdown = """
            ---
            title: Getting Started
            description: How to install LaughTale
            order: 1
            ---
            # Hello
            Some **body** content.
            """;

        var doc = IslandMarkdownPipeline.Parse<TestFrontmatter>(markdown, "getting-started");

        Assert.Equal("Getting Started", doc.Metadata.Title);
        Assert.Equal("How to install LaughTale", doc.Metadata.Description);
        Assert.Equal(1, doc.Metadata.Order);
        Assert.Contains("Hello", doc.HtmlContent);
    }

    [Fact]
    public void Parse_with_no_frontmatter_returns_default_metadata_without_throwing()
    {
        var doc = IslandMarkdownPipeline.Parse<TestFrontmatter>("# No frontmatter here", "no-frontmatter");

        Assert.Equal(string.Empty, doc.Metadata.Title);
    }

    [Fact]
    public void Parse_with_a_type_mismatched_frontmatter_field_throws_instead_of_silently_defaulting()
    {
        // `order` is declared as `int` on TestFrontmatter; a non-numeric value is a genuine schema
        // violation YamlDotNet cannot coerce, which is exactly the case the old silent catch masked.
        var markdown = """
            ---
            title: Broken
            order: not-a-number
            ---
            Body.
            """;

        var ex = Assert.Throws<InvalidOperationException>(
            () => IslandMarkdownPipeline.Parse<TestFrontmatter>(markdown, "broken-entry"));

        Assert.Contains("broken-entry", ex.Message);
        Assert.Contains(nameof(TestFrontmatter), ex.Message);
    }

    [Fact]
    public void Parse_with_malformed_yaml_syntax_throws_instead_of_silently_defaulting()
    {
        var markdown = """
            ---
            title: [unterminated
            ---
            Body.
            """;

        Assert.Throws<InvalidOperationException>(
            () => IslandMarkdownPipeline.Parse<TestFrontmatter>(markdown, "malformed-yaml"));
    }
}
