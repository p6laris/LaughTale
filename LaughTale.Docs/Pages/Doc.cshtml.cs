using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using LaughTale.Docs.Models;
using LaughTale.Docs.Services;
using LaughTale.Markdown.Collections;
using LaughTale.Markdown.Models;
using System.Linq;

namespace LaughTale.Docs.Pages;

public class DocModel : PageModel
{
    public MarkdownDocument<DocFrontmatter>? Doc { get; set; }
    public (string Title, string Url)? PreviousDoc { get; set; }
    public (string Title, string Url)? NextDoc { get; set; }

    public async Task<IActionResult> OnGetAsync(string slug)
    {
        if (string.IsNullOrWhiteSpace(slug))
        {
            return RedirectToPage("/Doc", new { slug = "01-getting-started" });
        }

        Doc = await ContentCollection.GetEntryAsync<DocFrontmatter>("docs", slug);
        if (Doc == null)
        {
            return NotFound();
        }

        ViewData["Title"] = Doc.Metadata.Title;

        // Flatten all sidebar navigation leaf items
        var navGroups = DocsNavigationData.GetDocsSidebarItems(slug);
        var allLinks = navGroups
            .SelectMany(g => g.Items is { Count: > 0 } ? g.Items : new List<LaughTale.Components.Models.SidebarItem> { g })
            .Where(item => !string.IsNullOrEmpty(item.Url))
            .ToList();

        int currentIndex = allLinks.FindIndex(item => item.Url != null && item.Url.EndsWith("/" + slug, StringComparison.OrdinalIgnoreCase));
        if (currentIndex > 0)
        {
            var prev = allLinks[currentIndex - 1];
            if (!string.IsNullOrEmpty(prev.Url))
            {
                PreviousDoc = (prev.Label, prev.Url);
            }
        }

        if (currentIndex >= 0 && currentIndex < allLinks.Count - 1)
        {
            var next = allLinks[currentIndex + 1];
            if (!string.IsNullOrEmpty(next.Url))
            {
                NextDoc = (next.Label, next.Url);
            }
        }

        return Page();
    }
}
