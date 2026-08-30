---
title: "Configuration & Options Reference"
description: "Complete reference for LaughTaleOptions, sub-options, and middleware configuration"
order: 55
section: "Core Concepts"
---

# Configuration & Options Reference

LaughTale adheres to a strict **opt-in philosophy**: core island rendering is enabled by default with zero extra overhead, and all optional subsystems (View Transitions, Prefetching, CSP Nonces, Theme Studio) are configured explicitly via `builder.Services.AddLaughTale(options => ...)`.

---

## ⚡ Complete `Program.cs` Configuration

```csharp
using LaughTale.Core.Extensions;
using LaughTale.Core.Endpoints;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddRazorPages();

// Configure LaughTale Options
builder.Services.AddLaughTale(options =>
{
    // View Transitions Single-Page Routing
    options.ViewTransitions.Enabled = true;
    options.ViewTransitions.FallbackMode = "swap"; // "swap" | "none"

    // Smart Hover & Viewport Prefetching
    options.Prefetch.Enabled = true;
    options.Prefetch.HoverDelayMs = 65;
    options.Prefetch.RespectDataSaver = true;

    // Content Security Policy (CSP)
    options.Csp.Enabled = true;
    options.Csp.AutoGenerateNonce = true;

    // Live Theme Studio (recommended in Development only)
    options.ThemeStudio.Enabled = builder.Environment.IsDevelopment();
    options.ThemeStudio.Route = "/_laughtale/studio";

    // Output Caching & Personal Data Protection
    options.Caching.EnforcePrivateOnUserProps = true;
});

var app = builder.Build();

app.UseStaticFiles();
app.UseRouting();

// Map LaughTale Endpoints
app.MapRazorPages();
app.MapLaughTaleIslandRefresh(); // Enables island.refresh()

app.Run();
```

---

## 📋 Detailed Options Reference

### 1. `ViewTransitions` Sub-Options

| Property | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `Enabled` | `bool` | `false` | Enables client-side navigation using the HTML5 View Transitions API. |
| `FallbackMode` | `string` | `"swap"` | Fallback strategy for browsers lacking `document.startViewTransition` support (`"swap"` replaces body gracefully, `"none"` triggers full reload). |

---

### 2. `Prefetch` Sub-Options

| Property | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `Enabled` | `bool` | `false` | Enables intelligent link prefetching when users hover over internal links or when links enter the viewport. |
| `HoverDelayMs` | `int` | `65` | Delay in milliseconds before initiating prefetch request on hover. |
| `RespectDataSaver` | `bool` | `true` | When `true`, automatically disables prefetching if the browser sends the `Save-Data: on` header. |

---

### 3. `Csp` (Content Security Policy) Sub-Options

| Property | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `Enabled` | `bool` | `false` | Enables automated cryptographic nonce generation and attachment to island script and style tags. |
| `AutoGenerateNonce` | `bool` | `true` | Automatically generates a unique cryptographically secure base64 nonce per HTTP request. |

---

### 4. `ThemeStudio` Sub-Options

| Property | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `Enabled` | `bool` | `false` | Enables the interactive in-browser Theme Studio editor. |
| `Route` | `string` | `"/_laughtale/studio"` | URL route prefix where Theme Studio customizer is mounted. |

---

### 5. `Caching` Sub-Options

| Property | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `EnforcePrivateOnUserProps` | `bool` | `true` | Automatically forces `Cache-Control: no-store, private` and `Vary: Cookie` when an island carries `[IslandPrivate]` props, preventing accidental shared cache data leaks. |

---

## 🏷️ Razor View Imports (`_ViewImports.cshtml`)

To make LaughTale TagHelpers available in your Razor Pages and MVC views:

```razor
@using LaughTale.Core
@using LaughTale.Core.Enums
@using LaughTale.Core.Attributes
@using LaughTale.Components

@addTagHelper *, LaughTale.Core
@addTagHelper *, LaughTale.Components
```
