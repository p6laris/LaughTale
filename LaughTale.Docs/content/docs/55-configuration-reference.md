---
title: Configuration & Program.cs Reference
description: Complete reference for builder.Services.AddLaughTale() options, TagHelper configurations, and endpoint mappings.
order: 53
icon: settings
category: Framework Architecture
---

# ⚙️ Configuration & Options Reference

All LaughTale services are configured via `builder.Services.AddLaughTale(options => { ... })` in `Program.cs`.

---

## 📋 Full `LaughTaleOptions` Reference

```csharp
builder.Services.AddLaughTale(options =>
{
    // Enable seamless View Transitions API across Razor page navigation
    options.EnableViewTransitions = true;

    // Default locale and Kurdish/RTL configuration
    options.Localization.DefaultCulture = "en-US";
    options.Localization.SupportedCultures = new[] { "en-US", "ku-Arab-IQ", "ar-IQ", "tr-TR" };

    // Security Options
    options.Security.RequireAntiCsrfTokens = true;
    options.Security.EnforceStrictCsp = true;

    // Client Runtime CDN or local path
    options.ClientRuntimePath = "/js/islands.js";
});
```
