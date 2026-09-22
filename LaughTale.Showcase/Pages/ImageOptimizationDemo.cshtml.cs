using Microsoft.AspNetCore.Mvc.RazorPages;
using LaughTale.Components.Rendering;

namespace LaughTale.Showcase.Pages;

/// <summary>
/// ROADMAP.v5.md Part H "image optimization" live demo.
/// </summary>
public class ImageOptimizationDemoModel : PageModel
{
    public void OnGet()
    {
        ViewData.SetHead(new PageHead(Title: "Image Optimization"));
    }
}
