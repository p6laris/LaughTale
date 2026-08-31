---
title: Forms & Server-Side Validation
description: Seamlessly integrate LaughTale rich input controls with ASP.NET Core Model Binding, DataAnnotations, and localized server-side validation.
order: 9
icon: check-square
category: Framework Architecture
---

# 📝 Forms & Server-Side Validation

Building rock-solid enterprise forms in ASP.NET Core with LaughTale requires **zero complex state boilerplate**. You use standard C# Model Binding and DataAnnotations, while LaughTale provides rich, accessible UI controls.

---

## 🎯 1. How It Works

LaughTale form components automatically emit standard HTML form inputs (`name="..."`, `value="..."`) that bind directly to your C# PageModel or Controller action during HTTP POST submissions:

- **Browser Form**: Renders `<island-input-number name="Amount" />` and `<island-datepicker name="DeliveryDate" />`.
- **Form Submission**: Submits standard `application/x-www-form-urlencoded` or `multipart/form-data` payload.
- **Server Binding**: ASP.NET Core binds properties to `[BindProperty] public OrderForm Form { get; set; }`.
- **Validation**: If `!ModelState.IsValid`, the server re-renders the page with validation error tags (`<span asp-validation-for="..." />`) and preserved user values.

---

## 💻 2. Complete End-to-End Example

### Step A: Define the C# Model with DataAnnotations

```csharp
// Pages/Register.cshtml.cs
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

public class RegisterModel : PageModel
{
    [BindProperty]
    public RegistrationForm Input { get; set; } = new();

    public class RegistrationForm
    {
        [Required(ErrorMessage = "Full Name is required.")]
        [StringLength(50, MinimumLength = 3, ErrorMessage = "Name must be between 3 and 50 characters.")]
        public string FullName { get; set; } = string.Empty;

        [Required(ErrorMessage = "Valid email address is required.")]
        [EmailAddress(ErrorMessage = "Invalid email format.")]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "Starting Balance is required.")]
        [Range(100, 1000000, ErrorMessage = "Balance must be between $100 and $1,000,000.")]
        public decimal? Balance { get; set; }

        [Required(ErrorMessage = "Please select a target city.")]
        public string? City { get; set; }

        [Required(ErrorMessage = "Please choose a preferred start date.")]
        public DateTime? StartDate { get; set; }

        public bool AcceptsTerms { get; set; }
    }

    public IActionResult OnPost()
    {
        if (!Input.AcceptsTerms)
        {
            ModelState.AddModelError("Input.AcceptsTerms", "You must accept terms of service.");
        }

        if (!ModelState.IsValid)
        {
            return Page(); // Re-renders form with validation messages and preserved values
        }

        // Save to Database via EF Core...
        return RedirectToPage("/Success");
    }
}
```

---

### Step B: Build the Razor Form with LaughTale Controls

```razor
@page "/register"
@model RegisterModel
@{
    ViewData["Title"] = "Customer Registration";
}

<div class="max-w-xl mx-auto p-6 bg-surface-0 rounded-xl shadow-sm border border-surface-200">
    <h2 class="text-2xl font-bold mb-6">Create New Account</h2>

    <form method="post" class="space-y-5">
        @Html.AntiForgeryToken()

        <!-- 1. Text Input with Validation -->
        <div>
            <label class="block text-sm font-semibold mb-1">Full Name *</label>
            <input type="text" 
                   name="Input.FullName" 
                   value="@Model.Input.FullName" 
                   class="p-inputtext w-full @(ViewData.ModelState["Input.FullName"]?.Errors.Any() == true ? "p-invalid" : "")" 
                   placeholder="e.g. Darya Karimi" />
            <span asp-validation-for="Input.FullName" class="text-sm text-red-500 mt-1 block"></span>
        </div>

        <!-- 2. Email Address -->
        <div>
            <label class="block text-sm font-semibold mb-1">Email Address *</label>
            <input type="email" 
                   name="Input.Email" 
                   value="@Model.Input.Email" 
                   class="p-inputtext w-full @(ViewData.ModelState["Input.Email"]?.Errors.Any() == true ? "p-invalid" : "")" 
                   placeholder="darya@example.com" />
            <span asp-validation-for="Input.Email" class="text-sm text-red-500 mt-1 block"></span>
        </div>

        <!-- 3. Currency InputNumber Control -->
        <div>
            <label class="block text-sm font-semibold mb-1">Starting Balance ($) *</label>
            <island-input-number name="Input.Balance" 
                                 value="@Model.Input.Balance" 
                                 mode="currency" 
                                 currency="USD" 
                                 min="0" 
                                 show-buttons="true" />
            <span asp-validation-for="Input.Balance" class="text-sm text-red-500 mt-1 block"></span>
        </div>

        <!-- 4. DatePicker Calendar Control -->
        <div>
            <label class="block text-sm font-semibold mb-1">Preferred Start Date *</label>
            <island-datepicker name="Input.StartDate" 
                               value="@(Model.Input.StartDate?.ToString("yyyy-MM-dd"))" 
                               show-icon="true" 
                               placeholder="Select start date..." />
            <span asp-validation-for="Input.StartDate" class="text-sm text-red-500 mt-1 block"></span>
        </div>

        <!-- 5. Terms Toggle Switch -->
        <div class="flex items-center gap-3 pt-2">
            <island-toggle-switch name="Input.AcceptsTerms" 
                                  checked="@Model.Input.AcceptsTerms" />
            <label class="text-sm">I agree to the terms and privacy policy *</label>
        </div>
        <span asp-validation-for="Input.AcceptsTerms" class="text-sm text-red-500 block"></span>

        <!-- Submit Button -->
        <div class="pt-4">
            <island-button type="submit" 
                           label="Register Account" 
                           icon="check" 
                           severity="primary" 
                           size="large" />
        </div>
    </form>
</div>
```

---

## 🌍 3. Localized Validation Messages (Kurdish / English)

To display localized validation errors automatically, inject `IStringLocalizer`:

```csharp
[Required(ErrorMessageResourceType = typeof(ValidationMessages), ErrorMessageResourceName = "FullNameRequired")]
public string FullName { get; set; } = string.Empty;
```

When the user is viewing in Kurdish (`ku`), messages automatically render in Sorani script (*ناوی تەواو پێویستە*).
