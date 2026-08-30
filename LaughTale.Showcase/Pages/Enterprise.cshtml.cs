using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace LaughTale.Showcase.Pages;

public class EnterpriseRedirectModel : PageModel
{
    public IActionResult OnGet()
    {
        return RedirectToPagePermanent("/Components");
    }
}
