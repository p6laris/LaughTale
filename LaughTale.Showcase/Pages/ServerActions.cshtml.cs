using System.Threading;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace LaughTale.Showcase.Pages;

/// <summary>
/// ROADMAP.v5.md Part G/L end-to-end validation example: a real Server Action (Layer 1,
/// &lt;island-form&gt;) posting to this page's own OnPostIncrement handler. The counter is a plain
/// static int guarded by Interlocked - deliberately the simplest possible demo-only state, not a
/// pattern to copy for anything real (no per-user/per-session isolation).
/// </summary>
public class ServerActionsModel : PageModel
{
    private static int _count;

    public static int Count => _count;

    public void OnGet()
    {
    }

    public IActionResult OnPostIncrement()
    {
        Interlocked.Increment(ref _count);
        return Partial("_CounterPartial", this);
    }
}
