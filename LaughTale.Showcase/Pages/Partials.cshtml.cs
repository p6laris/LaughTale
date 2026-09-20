using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace LaughTale.Showcase.Pages;

/// <summary>
/// ROADMAP.v5.md Part E "Partials" end-to-end validation example: a plain &lt;a region="preview"&gt;
/// link updating an &lt;island-region name="preview"&gt; elsewhere on the page via a named GET handler
/// - the rest of the page never re-renders. Deliberately the simplest possible demo (a static in-memory
/// item list, no per-user state), not a pattern to copy for anything real.
/// </summary>
public class PartialsModel : PageModel
{
    private static readonly string[] ItemNames = { "Aurora", "Borealis", "Comet" };

    public int SelectedId { get; set; }

    public string SelectedItemName => ItemNames[SelectedId % ItemNames.Length];

    public void OnGet()
    {
        SelectedId = 0;
    }

    public IActionResult OnGetShow(int id)
    {
        SelectedId = id;
        return Partial("_PartialPreview", this);
    }
}
