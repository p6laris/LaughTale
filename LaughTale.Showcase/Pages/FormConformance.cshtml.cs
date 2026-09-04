using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using LaughTale.Components.Models;

namespace LaughTale.Showcase.Pages;

public class FormConformanceModel : PageModel
{
    // Batch 1: Text-like controls
    [BindProperty]
    public string InputText { get; set; } = "LaughTale Conformance Text";

    [BindProperty]
    public string Textarea { get; set; } = "Multiline conformance\ntext content";

    [BindProperty]
    public string InputPassword { get; set; } = "SecretPassword123!";

    [BindProperty]
    public double? InputNumber { get; set; } = 42.5;

    [BindProperty]
    public string InputMask { get; set; } = "12/31/2026";

    [BindProperty]
    public string InputOtp { get; set; } = "1234";

    [BindProperty]
    public List<string> InputTags { get; set; } = new() { "tag-alpha", "tag-beta" };

    [BindProperty]
    public string ColorPicker { get; set; } = "#10b981";

    [BindProperty]
    public double Knob { get; set; } = 75.0;

    [BindProperty]
    public double? Rating { get; set; } = 4.0;

    // Batch 2: Choice controls
    [BindProperty]
    public bool Checkbox { get; set; } = true;

    [BindProperty]
    public string RadioButton { get; set; } = "option-b";

    [BindProperty]
    public bool ToggleSwitch { get; set; } = true;

    [BindProperty]
    public bool ToggleButton { get; set; } = true;

    [BindProperty]
    public List<string> SelectButton { get; set; } = new() { "opt1", "opt2" };

    [BindProperty]
    public List<string> Select { get; set; } = new() { "sel-1" };

    [BindProperty]
    public List<string> MultiSelect { get; set; } = new() { "ms-1", "ms-2" };

    [BindProperty]
    public List<string> Listbox { get; set; } = new() { "lb-1" };

    [BindProperty]
    public string CascadeSelect { get; set; } = "cs-1";

    [BindProperty]
    public List<string> TreeSelect { get; set; } = new() { "ts-1" };

    // Batch 3: Composite & collection controls
    [BindProperty]
    public string AutoComplete { get; set; } = "ac-val";

    [BindProperty]
    public List<string> DatePicker { get; set; } = new() { "2026-09-04" };

    [BindProperty]
    public List<double> Slider { get; set; } = new() { 25.0, 75.0 };

    [BindProperty]
    public List<string> OrderList { get; set; } = new() { "item-1", "item-2", "item-3" };

    [BindProperty]
    public List<string> PickList { get; set; } = new() { "picked-1", "picked-2" };

    [BindProperty]
    public List<string> OrgChart { get; set; } = new() { "ceo" };

    [BindProperty]
    public int Paginator { get; set; } = 2;

    [BindProperty]
    public string Dropzone { get; set; } = "";

    [BindProperty]
    public string Inplace { get; set; } = "Inplace Text Value";

    // Diagnostic tracking for submitted form data
    public bool WasSubmitted { get; set; } = false;
    public int SubmittedFieldCount { get; set; } = 0;
    public Dictionary<string, List<string>> SubmittedFormFields { get; set; } = new();

    public void OnGet()
    {
    }

    public IActionResult OnPost()
    {
        WasSubmitted = true;
        SubmittedFormFields = new Dictionary<string, List<string>>();

        foreach (var key in Request.Form.Keys)
        {
            if (key.StartsWith("__")) continue; // Skip antiforgery token
            var values = Request.Form[key].ToList();
            SubmittedFormFields[key] = values!;
        }

        SubmittedFieldCount = SubmittedFormFields.Count;

        if (Request.Headers["Accept"].ToString().Contains("application/json"))
        {
            return new JsonResult(new
            {
                success = true,
                fieldCount = SubmittedFieldCount,
                fields = SubmittedFormFields
            });
        }

        return Page();
    }
}
