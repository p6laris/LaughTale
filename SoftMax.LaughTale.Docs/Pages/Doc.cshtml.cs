using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using SoftMax.LaughTale.Docs.Models;
using SoftMax.LaughTale.Markdown.Collections;
using SoftMax.LaughTale.Markdown.Models;

namespace SoftMax.LaughTale.Docs.Pages;

public class DocModel : PageModel
{
    public MarkdownDocument<DocFrontmatter>? Doc { get; set; }

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
        return Page();
    }
}
