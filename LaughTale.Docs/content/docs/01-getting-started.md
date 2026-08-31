---
title: Quickstart & Setup
description: Get up and running with LaughTale Islands Architecture in ASP.NET Core in under 5 minutes with a zero-configuration setup.
order: 1
icon: zap
category: Framework Architecture
---

# 🚀 Getting Started with LaughTale

Welcome to **LaughTale**, the next-generation **Modern Islands Architecture** framework for ASP.NET Core (Razor Pages, MVC, and Minimal APIs).

LaughTale combines the raw performance and SEO of **Server-Side Rendering (SSR)** with the rich interactivity of **client-side UI components**, eliminating 90%+ of unnecessary JavaScript payloads by hydrating only the interactive islands you define.

---

## ⚡ 5-Minute Quickstart

Follow these 4 simple steps to add LaughTale to any ASP.NET Core application.

### Step 1: Install NuGet Packages

Choose your installation flavor:

#### Option A: Full Suite (Recommended - Includes 76+ Aura UI Components)
```bash
dotnet add package LaughTale.Core
dotnet add package LaughTale.Components
```

#### Option B: Headless Core Only (For Custom Design Systems, Tailwind CSS, or React/Vue)
```bash
dotnet add package LaughTale.Core
```

*(See the dedicated [Headless & Standalone Core](/doc/01b-headless-and-custom-islands) guide for building custom UI islands).*

---

### Step 2: Register Services in `Program.cs`

Enable LaughTale services, TagHelpers, and endpoint routing:

```csharp
// Program.cs
using LaughTale.Core.Extensions;
using LaughTale.Core.Endpoints;

var builder = WebApplication.CreateBuilder(args);

// 1. Add Razor Pages and LaughTale
builder.Services.AddRazorPages();
builder.Services.AddLaughTale(options =>
{
    options.EnableViewTransitions = true;
    options.Localization.DefaultCulture = "en-US";
});

var app = builder.Build();

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();

// 2. Map LaughTale Server-Driven Endpoints
app.MapLaughTaleIslandRefresh();
app.MapRazorPages();

app.Run();
```

---

### Step 3: Register TagHelpers in `_ViewImports.cshtml`

Add LaughTale TagHelpers globally to your Razor Views / Pages:

```razor
@* Pages/_ViewImports.cshtml *@
@using LaughTale.Core
@using LaughTale.Components
@using LaughTale.Components.Models
@using LaughTale.Components.Enums

@addTagHelper *, Microsoft.AspNetCore.Mvc.TagHelpers
@addTagHelper *, LaughTale.Core
@addTagHelper *, LaughTale.Components
```

---

### Step 4: Include Styles & Scripts in `_Layout.cshtml`

Add the LaughTale design system stylesheets and the lightweight client runtime loader:

```html
<!-- Pages/Shared/_Layout.cshtml -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>@ViewData["Title"] - My App</title>
    
    <!-- LaughTale Aura Design Tokens & Theme -->
    <link rel="stylesheet" href="/css/site.css" />
    
    <!-- Script to prevent Dark Mode flash of unstyled content -->
    <script>
        if (localStorage.getItem('theme') === 'dark' || (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            document.documentElement.classList.add('dark');
        }
    </script>
</head>
<body class="bg-surface-0 text-surface-900">

    <main class="container mx-auto p-6">
        @RenderBody()
    </main>

    <!-- LaughTale Client Runtime & Islands Bundle -->
    <script type="module" src="/js/islands.js"></script>
</body>
</html>
```

---

## 🎯 Creating Your First Island

LaughTale comes with **76+ high-performance Aura UI components** ready to use as declarative Razor TagHelpers.

Open `Pages/Index.cshtml` and add interactive components:

```razor
@page
@model IndexModel
@{
    ViewData["Title"] = "Home Page";
}

<div class="space-y-6">
    <h1 class="text-3xl font-bold">Welcome to LaughTale!</h1>
    
    <!-- 1. Interactive Button with Lucide Icon -->
    <island-button label="Get Started" icon="zap" severity="primary" size="large" />

    <!-- 2. Interactive DatePicker Calendar with Sunday/Saturday First Day of Week -->
    <div class="max-w-xs">
        <label class="block text-sm font-medium mb-1">Select Delivery Date:</label>
        <island-datepicker placeholder="Choose a date..." show-icon="true" />
    </div>

    <!-- 3. High-Performance Interactive DataTable with Sorting & Pagination -->
    <island-datatable value="@Model.RecentOrders" 
                      paginator="true" 
                      rows="5" 
                      striped-rows="true" 
                      show-gridlines="true" 
                      filter-display="row">
    </island-datatable>
</div>
```

---

## 📦 Complete Self-Contained Starter Template

Here is a full `IndexModel.cs` code-behind to populate the table:

```csharp
using Microsoft.AspNetCore.Mvc.RazorPages;

public class IndexModel : PageModel
{
    public record OrderItem(int Id, string Customer, string Product, decimal Amount, string Status);

    public List<OrderItem> RecentOrders { get; set; } = new();

    public void OnGet()
    {
        RecentOrders = new List<OrderItem>
        {
            new(101, "Alice Morgan", "MacBook Pro M3", 2499.00m, "Completed"),
            new(102, "Braden Vance", "UltraWide 49\" Monitor", 1199.50m, "Processing"),
            new(103, "Darya Karimi", "Ergonomic Mechanical Keyboard", 189.00m, "Shipped"),
            new(104, "Chen Wei", "Wireless Noise-Canceling Headphones", 349.99m, "Completed"),
            new(105, "Elena Rostova", "Standing Desk Dual Motor", 680.00m, "Delivered")
        };
    }
}
```

---

## 🔍 How LaughTale Works Under the Hood

1. **Zero-JavaScript SSR Baseline**: Razor renders clean, semantic HTML on the server. Search engine crawlers and users with slow connections see full content immediately with **0ms layout shift**.
2. **Selective Island Hydration**: Only components explicitly tagged as islands are hydrated on the browser, reducing JavaScript bundle sizes by **up to 95%**.
3. **Instant View Transitions**: Navigating between Razor pages feels as smooth as a Single Page Application (SPA) using native browser View Transitions.
