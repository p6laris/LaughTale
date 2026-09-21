using Microsoft.AspNetCore.Mvc.RazorPages;
using LaughTale.Components.Rendering;
using LaughTale.Core.State;

namespace LaughTale.Showcase.Pages;

/// <summary>
/// ROADMAP.v5.md Part F "Ambient state pool" live demo: the server seeds a starting value into the
/// page's ambient state pool; two independent island instances on the page both read AND write the
/// same `ctx.state('visitCount')` store, proving the server seed lands client-side and both instances
/// share one reactive store.
/// </summary>
public class AmbientStateDemoModel : PageModel
{
    public void OnGet()
    {
        ViewData.SetHead(new PageHead(Title: "Ambient State Pool"));
        HttpContext.SetAmbientState("visitCount", 7);
    }
}
