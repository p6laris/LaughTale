using Markdig;
using Markdig.Extensions.Yaml;
using Markdig.Renderers.Html;
using Markdig.Syntax;
using Markdig.Syntax.Inlines;
using SoftMax.LaughTale.Markdown.Models;
using System.Text.RegularExpressions;
using YamlDotNet.Serialization;
using YamlDotNet.Serialization.NamingConventions;

namespace SoftMax.LaughTale.Markdown.Pipeline;

/// <summary>
/// High-performance Markdig pipeline for SoftMax.LaughTale with AST frontmatter extraction,
/// auto-heading slugification, and embedded island preservation.
/// </summary>
public static class IslandMarkdownPipeline
{
    private static readonly IDeserializer YamlDeserializer = new DeserializerBuilder()
        .WithNamingConvention(CamelCaseNamingConvention.Instance)
        .IgnoreUnmatchedProperties()
        .Build();

    public static readonly MarkdownPipeline Pipeline = new MarkdownPipelineBuilder()
        .UseYamlFrontMatter()
        .UseAutoIdentifiers()
        .UseAdvancedExtensions()
        .UseEmojiAndSmiley()
        .Build();

    /// <summary>
    /// Parses a raw Markdown string into a strongly-typed MarkdownDocument with TOC.
    /// </summary>
    public static MarkdownDocument<TMetadata> Parse<TMetadata>(string markdownText, string slug) where TMetadata : class, new()
    {
        if (string.IsNullOrWhiteSpace(markdownText))
        {
            return new MarkdownDocument<TMetadata>(
                Slug: slug,
                Metadata: new TMetadata(),
                HtmlContent: string.Empty,
                RawBody: string.Empty,
                TableOfContents: new List<MarkdownHeading>(),
                ReadingTimeMinutes: 1
            );
        }

        var document = Markdig.Markdown.Parse(markdownText, Pipeline);

        // 1. Extract and deserialize YAML Frontmatter
        TMetadata metadata = new();
        var yamlBlock = document.Descendants<YamlFrontMatterBlock>().FirstOrDefault();
        if (yamlBlock != null)
        {
            var yamlContent = yamlBlock.Lines.ToString();
            if (!string.IsNullOrWhiteSpace(yamlContent))
            {
                try
                {
                    metadata = YamlDeserializer.Deserialize<TMetadata>(yamlContent) ?? new TMetadata();
                }
                catch
                {
                    metadata = new TMetadata();
                }
            }
        }

        // 2. Extract Headings and generate Table of Contents (TOC)
        var headings = new List<MarkdownHeading>();
        foreach (var headingBlock in document.Descendants<HeadingBlock>())
        {
            var text = ExtractInlineText(headingBlock.Inline);
            if (!string.IsNullOrWhiteSpace(text))
            {
                var headingSlug = headingBlock.GetAttributes().Id ?? GenerateSlug(text);
                headings.Add(new MarkdownHeading(headingBlock.Level, headingSlug, text));
            }
        }

        // 3. Render HTML content (preserves <island> tags for client hydration)
        var htmlContent = Markdig.Markdown.ToHtml(markdownText, Pipeline);

        // 4. Calculate reading time (avg 200 words/min)
        var wordCount = Regex.Matches(markdownText, @"\b\w+\b").Count;
        var readingTime = Math.Max(1, (int)Math.Ceiling(wordCount / 200.0));

        return new MarkdownDocument<TMetadata>(
            Slug: slug,
            Metadata: metadata,
            HtmlContent: htmlContent,
            RawBody: markdownText,
            TableOfContents: headings,
            ReadingTimeMinutes: readingTime
        );
    }

    private static string ExtractInlineText(ContainerInline? inline)
    {
        if (inline == null) return string.Empty;
        var writer = new StringWriter();
        foreach (var item in inline)
        {
            if (item is LiteralInline literal)
            {
                writer.Write(literal.Content);
            }
            else if (item is CodeInline code)
            {
                writer.Write(code.Content);
            }
            else if (item is ContainerInline container)
            {
                writer.Write(ExtractInlineText(container));
            }
        }
        return writer.ToString().Trim();
    }

    private static string GenerateSlug(string text)
    {
        var slug = text.ToLowerInvariant();
        slug = Regex.Replace(slug, @"[^a-z0-9\s-]", "");
        slug = Regex.Replace(slug, @"\s+", "-").Trim('-');
        return slug;
    }
}
