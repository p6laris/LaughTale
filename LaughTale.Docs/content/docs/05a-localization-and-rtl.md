---
title: Internationalization (i18n) & Kurdish RTL
description: Native ASP.NET Core culture integration, bi-directional RTL layout mirroring, Kurdish Sorani localization, and Speda font support across all 76 components.
order: 6
icon: globe
category: Framework Architecture
---

# Internationalization (i18n) & Kurdish RTL

LaughTale provides a comprehensive, bi-directional internationalization engine built on top of ASP.NET Core's `IStringLocalizer` and modern web standards. It features first-class support for **Kurdish Sorani (`ku` / `ckb`)**, **RTL layout mirroring**, and custom web typography via **Speda Font**.

---

## 1. Quick Setup in ASP.NET Core

Configure supported cultures and LaughTale localization in `Program.cs`:

```csharp
using System.Globalization;
using Microsoft.AspNetCore.Localization;
using LaughTale.Core.Extensions;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddRazorPages();
builder.Services.AddLaughTale(opt =>
{
    opt.Localization.DefaultCulture = "en-US";
    opt.Localization.SupportedCultures = ["en-US", "ku", "ckb", "ar-SA", "es-ES", "fr-FR", "de-DE", "tr-TR"];
});

var supportedCultures = new[]
{
    new CultureInfo("en-US"),
    new CultureInfo("ku"),
    new CultureInfo("ckb"),
    new CultureInfo("ar-SA"),
    new CultureInfo("es-ES"),
    new CultureInfo("fr-FR"),
    new CultureInfo("de-DE"),
    new CultureInfo("tr-TR")
};

var app = builder.Build();

app.UseRequestLocalization(new RequestLocalizationOptions
{
    DefaultRequestCulture = new RequestCulture("en-US"),
    SupportedCultures = supportedCultures,
    SupportedUICultures = supportedCultures
});
```

---

## 2. Zero-FOUC Culture Flow in Razor Pages

LaughTale TagHelpers automatically detect the current culture and emit `lang` and `dir="rtl"` attributes before any JavaScript executes:

```html
@{
    var currentCulture = System.Globalization.CultureInfo.CurrentUICulture;
    var isRtl = currentCulture.TextInfo.IsRightToLeft || currentCulture.Name.StartsWith("ku");
}
<!DOCTYPE html>
<html lang="@currentCulture.Name" dir="@(isRtl ? "rtl" : "ltr")">
```

---

## 3. Kurdish Sorani & Speda Font Integration

When Kurdish (`ku` or `ckb`) is active:
- Calendar weeks begin on **Saturday (شەممە)**.
- Month and day names dynamically format in Sorani script.
- The web font automatically switches to **Speda (`Speda-Bold.ttf`)**.

```css
/* Custom Speda Font Face */
@font-face {
    font-family: 'Speda';
    src: url('/fonts/speda/Speda-Bold.ttf') format('truetype');
    font-weight: 100 900;
    font-display: swap;
}

:root[lang^="ku"], :root[lang^="ckb"], [dir="rtl"] {
    --p-font-family: 'Speda', 'Inter', system-ui, sans-serif;
    --lt-font-family: 'Speda', 'Inter', system-ui, sans-serif;
}
```

---

## 4. Customizing Dictionaries

### Option A: Via ASP.NET Core `.resx`
```csharp
builder.Services.AddLaughTale(opt =>
{
    opt.Localization.UseStringLocalizer<SharedResource>();
});
```

### Option B: Via C# Code Overrides
```csharp
builder.Services.AddLaughTale(opt =>
{
    opt.Localization.AddLocale("ku", dict =>
    {
        dict.Today = "ئەمڕۆکە";
        dict.Clear = "سڕینەوەی هەموو";
    });
});
```

---

## 5. Client-Side `useLocale` Composable

For client island developers, LaughTale provides a lightweight composable for formatting dates, numbers, and currencies according to the active locale:

```typescript
import { useLocale } from 'laughtale';

export default function MyCustomIsland(container: HTMLElement, props: any, ctx: any) {
    const { t, formatDate, formatCurrency, isRtl } = useLocale(ctx);

    const formattedDate = formatDate(new Date(), { dateStyle: 'full' });
    const formattedPrice = formatCurrency(250000, 'IQD');
    const label = t('today'); // Returns 'ئەمڕۆ' when in Kurdish
}
```
