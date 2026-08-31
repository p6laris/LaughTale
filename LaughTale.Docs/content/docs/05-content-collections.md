---
title: Content Collections & Markdown
description: Type-safe Markdown and YAML frontmatter content collections engine with automatic Table of Contents extraction and syntax highlighting.
order: 7
icon: file-text
category: Framework Architecture
---

# 📚 Content Collections & Markdown Engine

LaughTale includes a high-performance **Markdown Content Collections** engine (`LaughTale.Markdown`) built on top of **Markdig** and **YamlDotNet**.

It lets you manage documentation, blog posts, changelogs, and knowledge base articles as structured Markdown files with strongly-typed C# frontmatter models.

---

## ⚡ 1. Defining a Frontmatter Schema

Create a strongly-typed C# class or record representing your Markdown metadata:

```csharp
public class DocFrontmatter
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public int Order { get; set; }
    public string? Icon { get; set; }
    public string Category { get; set; } = "General";
}
```

---

## 📝 2. Writing a Markdown Document (`content/docs/my-post.md`)

```markdown
---
title: Getting Started with Content Collections
description: Learn how to manage Markdown files in ASP.NET Core.
order: 1
icon: zap
category: Tutorials
---

# My First Article

Welcome to content collections!
```

---

## 🔍 3. Querying Collections in Razor Pages

In your C# PageModel (`Doc.cshtml.cs`):

```csharp
using LaughTale.Markdown.Collections;
using LaughTale.Markdown.Models;

public class DocModel : PageModel
{
    public MarkdownDocument<DocFrontmatter>? Doc { get; set; }

    public async Task<IActionResult> OnGetAsync(string slug)
    {
        // Fetch a single document by collection name and slug
        Doc = await ContentCollection.GetEntryAsync<DocFrontmatter>("docs", slug);
        
        if (Doc == null) return NotFound();

        return Page();
    }
}
```

---

## 📑 4. Automatic Table of Contents (TOC)

Every parsed `MarkdownDocument<T>` automatically generates a structured Table of Contents:

```razor
<!-- Render Document Body -->
<article class="prose">
    @Html.Raw(Model.Doc.HtmlContent)
</article>

<!-- Render Table of Contents Navigation -->
<aside class="toc">
    <h4>On This Page</h4>
    <ul>
        @foreach (var item in Model.Doc.TableOfContents.Where(h => h.Level is 2 or 3))
        {
            <li>
                <a href="#@item.Slug" class="toc-link depth-@item.Level">
                    @item.Text
                </a>
            </li>
        }
    </ul>
</aside>
```
