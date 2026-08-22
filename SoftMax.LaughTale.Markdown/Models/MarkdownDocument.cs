namespace SoftMax.LaughTale.Markdown.Models;

/// <summary>
/// Represents a structured heading extracted from Markdown AST for Table of Contents (TOC).
/// </summary>
public record MarkdownHeading(
    int Level,
    string Slug,
    string Text
);

/// <summary>
/// Represents a parsed Markdown document with type-safe frontmatter, Table of Contents, and SSR HTML.
/// </summary>
public record MarkdownDocument<TMetadata>(
    string Slug,
    TMetadata Metadata,
    string HtmlContent,
    string RawBody,
    List<MarkdownHeading> TableOfContents,
    int ReadingTimeMinutes
) where TMetadata : class;
