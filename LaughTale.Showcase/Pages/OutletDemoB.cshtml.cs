using Microsoft.AspNetCore.Mvc.RazorPages;
using LaughTale.Components.Rendering;

namespace LaughTale.Showcase.Pages;

/// <summary>
/// ROADMAP.v5.md Part E "Nested layouts & outlets" live demo: shares
/// <c>Pages/Shared/_OutletSectionLayout.cshtml</c> with <see cref="OutletDemoAModel"/>.
/// </summary>
public class OutletDemoBModel : PageModel
{
    public void OnGet()
    {
        ViewData.SetHead(new PageHead(Title: "Outlet Demo B"));
    }
}
