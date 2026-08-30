using Microsoft.AspNetCore.Mvc.RazorPages;

namespace LaughTale.Showcase.Pages;

public class PolyglotModel : PageModel
{
    public string ServerTime { get; set; } = DateTime.UtcNow.ToString("HH:mm:ss");

    public void OnGet()
    {
        ServerTime = DateTime.UtcNow.ToString("HH:mm:ss");
    }
}
