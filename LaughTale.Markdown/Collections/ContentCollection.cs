using LaughTale.Markdown.Models;
using LaughTale.Markdown.Pipeline;
using System.Collections.Concurrent;

namespace LaughTale.Markdown.Collections;

/// <summary>
/// Astro-style Content Collection loader for strongly-typed Markdown documents in .NET.
/// </summary>
public static class ContentCollection
{
    private static readonly ConcurrentDictionary<string, object> MemoryCache = new();

    /// <summary>
    /// Loads and parses all Markdown entries in a named content collection directory.
    /// Example: await ContentCollection.GetCollectionAsync&lt;DocMetadata&gt;("docs");
    /// </summary>
    public static async Task<List<MarkdownDocument<TMetadata>>> GetCollectionAsync<TMetadata>(
        string collectionName,
        string? contentRoot = null) where TMetadata : class, new()
    {
        var rootDir = contentRoot ?? Path.Combine(Directory.GetCurrentDirectory(), "content");
        var collectionDir = Path.Combine(rootDir, collectionName);

        if (!Directory.Exists(collectionDir))
        {
            return new List<MarkdownDocument<TMetadata>>();
        }

        var files = Directory.GetFiles(collectionDir, "*.md", SearchOption.AllDirectories);
        var documents = new List<MarkdownDocument<TMetadata>>();

        foreach (var file in files.OrderBy(f => f))
        {
            var relativePath = Path.GetRelativePath(collectionDir, file);
            var slug = Path.ChangeExtension(relativePath, null).Replace('\\', '/');
            var rawText = await File.ReadAllTextAsync(file);

            var doc = IslandMarkdownPipeline.Parse<TMetadata>(rawText, slug);
            documents.Add(doc);
        }

        return documents;
    }

    /// <summary>
    /// Loads and parses a single Markdown document by collection name and slug.
    /// </summary>
    public static async Task<MarkdownDocument<TMetadata>?> GetEntryAsync<TMetadata>(
        string collectionName,
        string slug,
        string? contentRoot = null) where TMetadata : class, new()
    {
        var rootDir = contentRoot ?? Path.Combine(Directory.GetCurrentDirectory(), "content");
        var filePath = Path.Combine(rootDir, collectionName, $"{slug.Replace('/', Path.DirectorySeparatorChar)}.md");

        if (!File.Exists(filePath))
        {
            return null;
        }

        var rawText = await File.ReadAllTextAsync(filePath);
        return IslandMarkdownPipeline.Parse<TMetadata>(rawText, slug);
    }
}
