---
title: "Type-Safe Content Collections"
description: "Astro-style Markdown & Content Collections powered by Markdig & YamlDotNet"
order: 5
section: "Content & Markdown"
---

# Type-Safe Content Collections

LaughTale includes a built-in **Content Collections** engine inspired by Astro and powered by **Markdig** and **YamlDotNet**.

Define strongly-typed C# frontmatter models, author content in standard Markdown, and query collections with complete compile-time type safety.

---

## 📋 Defining a Frontmatter Schema

Create a standard C# record matching your YAML frontmatter:

```csharp
public record DocFrontmatter
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public int Order { get; set; } = 0;
    public string Section { get; set; } = "General";
}
```

---

## 🔍 Querying Content Collections

In your Razor Pages or controllers, query your content collection asynchronously:

```csharp
using LaughTale.Markdown.Collections;

// Load all documentation entries sorted automatically
var docs = await ContentCollection.GetCollectionAsync<DocFrontmatter>("docs");

// Load a specific document by slug
var doc = await ContentCollection.GetEntryAsync<DocFrontmatter>("docs", "01-getting-started");

Console.WriteLine($"Title: {doc.Metadata.Title}");
Console.WriteLine($"Read Time: {doc.ReadingTimeMinutes} min");
Console.WriteLine($"Headings: {doc.TableOfContents.Count}");
```

---

## 📑 Automatic Table of Contents (TOC)

Every document processed by `IslandMarkdownPipeline` automatically extracts all headings (`#`, `##`, `###`) into a structured list of `MarkdownHeading` objects:

```csharp
public record MarkdownHeading(
    int Level,      // 1, 2, 3
    string Slug,    // "defining-a-frontmatter-schema"
    string Text     // "Defining a Frontmatter Schema"
);
```
