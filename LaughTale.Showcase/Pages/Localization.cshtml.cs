using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Globalization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using LaughTale.Components.Models;
using LaughTale.Core.Localization;

namespace LaughTale.Showcase.Pages;

public class LocalizationModel : PageModel
{
    private readonly ILaughTaleLocalizer _localizer;

    public LocalizationModel(ILaughTaleLocalizer localizer)
    {
        _localizer = localizer;
    }

    public CultureInfo CurrentCulture => CultureInfo.CurrentUICulture;
    public bool IsRtl => _localizer.IsRightToLeft(CurrentCulture);
    public string CurrentFont => IsRtl ? "Speda" : "Inter";

    [BindProperty]
    [Required(ErrorMessage = "تکایە ناوی تەواو بنووسە / Please enter full name")]
    [MinLength(3, ErrorMessage = "ناو دەبێت لانی کەم ٣ پیت بێت / Name must be at least 3 characters")]
    public string? FullName { get; set; }

    [BindProperty]
    [Required(ErrorMessage = "تکایە ئیمەیڵ بنووسە / Please enter email")]
    [EmailAddress(ErrorMessage = "ئیمەیڵەکە دروست نییە / Invalid email address")]
    public string? Email { get; set; }

    [BindProperty]
    public string? City { get; set; }

    public string? SubmissionMessage { get; set; }

    public List<KurdishCustomer> Customers { get; set; } = new();

    public void OnGet()
    {
        LoadSampleData();
    }

    public IActionResult OnPost()
    {
        LoadSampleData();

        if (!ModelState.IsValid)
        {
            return Page();
        }

        SubmissionMessage = IsRtl 
            ? $"سوپاس {FullName}! فۆرمەکە بە سەرکەوتوویی تۆمارکرا."
            : $"Thank you {FullName}! Your submission was successfully received.";

        return Page();
    }

    private void LoadSampleData()
    {
        if (IsRtl)
        {
            Customers = new List<KurdishCustomer>
            {
                new(1, "ئالان محەممەد", "alan@example.com", "هەولێر", "تەواوبوو", 1250000, "2026-08-15"),
                new(2, "سۆران ئەحمەد", "soran@example.com", "سلێمانی", "چاوەڕوانە", 850000, "2026-08-18"),
                new(3, "ڕێبین کامەران", "rebin@example.com", "دهۆک", "تەواوبوو", 2400000, "2026-08-20"),
                new(4, "شیلان عەلی", "shilan@example.com", "کەرکووک", "تەواوبوو", 1950000, "2026-08-22"),
                new(5, "دیاری نەوزاد", "dyari@example.com", "هەڵەبجە", "چاوەڕوانە", 620000, "2026-08-25"),
                new(6, "هێمن فارووق", "hemn@example.com", "هەولێر", "تەواوبوو", 3100000, "2026-08-28")
            };
        }
        else
        {
            Customers = new List<KurdishCustomer>
            {
                new(1, "Alan Mohammed", "alan@example.com", "Erbil", "Completed", 1250000, "2026-08-15"),
                new(2, "Soran Ahmed", "soran@example.com", "Sulaymaniyah", "Pending", 850000, "2026-08-18"),
                new(3, "Rebin Kamaran", "rebin@example.com", "Duhok", "Completed", 2400000, "2026-08-20"),
                new(4, "Shilan Ali", "shilan@example.com", "Kirkuk", "Completed", 1950000, "2026-08-22"),
                new(5, "Dyari Nawzad", "dyari@example.com", "Halabja", "Pending", 620000, "2026-08-25"),
                new(6, "Hemn Farooq", "hemn@example.com", "Erbil", "Completed", 3100000, "2026-08-28")
            };
        }
    }
}

public record KurdishCustomer(
    int Id, 
    string Name, 
    string Email, 
    string City, 
    string Status, 
    decimal Amount, 
    string Date
);
