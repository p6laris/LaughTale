using Microsoft.AspNetCore.Mvc.RazorPages;
using LaughTale.Components.Rendering;

namespace LaughTale.Showcase.Pages;

/// <summary>
/// ROADMAP.v5.md Part E "Nested layouts & outlets" live demo: shares
/// <c>Pages/Shared/_OutletSectionLayout.cshtml</c> with <see cref="OutletDemoBModel"/> - the SPA router
/// morphs only the &lt;island-outlet&gt; content between these two pages, leaving the section sidebar
/// untouched.
/// </summary>
public class OutletDemoAModel : PageModel
{
    public void OnGet()
    {
        ViewData.SetHead(new PageHead(Title: "Outlet Demo A"));
    }
}
