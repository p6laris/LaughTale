---
title: Icons & Self-Hosted SVG Sprites
description: Ultra-fast self-hosted Lucide SVG icon pipeline with automatic sprite generation, cache-busting endpoints, and <lt-icon> TagHelper.
order: 6
icon: zap
category: Buttons & Actions
---

# ⚡ Icons & Self-Hosted SVG Sprites

LaughTale provides a first-class, **self-hosted SVG icon pipeline** powered by **Lucide Icons**.

Unlike bulky third-party icon webfonts or heavy inline SVG duplication that bloats initial HTML, LaughTale compiles your application's icon usages into a single, compact **SVG Symbol Sprite** served with aggressive HTTP caching and cache-busting hashes.

---

## 🚀 Quick Usage: `<lt-icon>` TagHelper

Render any Lucide icon anywhere in your Razor pages or layouts:

```html
<!-- Render default 24px icon -->
<lt-icon name="zap" />

<!-- Custom size, color stroke, and CSS classes -->
<lt-icon name="check" size="20" color="#10b981" class="text-emerald-500 mr-2" />

<!-- Aliased tags -->
<aura-icon name="arrow-right" size="16" />
<island-icon name="user" size="18" />
```

The TagHelper renders a clean, optimized SVG using standard SVG `<use>` referencing:

```html
<svg class="lt-icon lt-icon-zap" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" data-part="icon">
    <use href="/_lt/icons.svg#zap"></use>
</svg>
```

---

## ⚙️ 1. Registering the Icon Endpoint

In your `Program.cs`, map the self-hosted icon sprite endpoint:

```csharp
using LaughTale.Core.Endpoints;

var app = builder.Build();

// Serves /_lt/icons.svg and /_lt/icons-{hash}.svg with immutable caching
app.MapLaughTaleIcons();
```

---

## 🛠️ 2. Build-Time Icon Generation (CLI & MSBuild)

LaughTale automatically scans your `.cshtml`, `.html`, and `.ts` files at build time to build a tree-shaken sprite containing only the icons you actually use:

```bash
# Run icon generator manually
node scripts/gen-icons.mjs
```

Or configure custom icon options in `Program.cs`:

```csharp
builder.Services.AddLaughTale(options =>
{
    options.Icons.SpritePath = "/_lt/icons.svg";
    options.Icons.CacheDuration = TimeSpan.FromDays(365);
});
```

---

## 🌟 Benefits of LaughTale SVG Sprites

- **Zero External CDN Dependencies**: 100% self-hosted, air-gapped, and privacy-compliant.
- **Cache Friendly**: Sprites are cached by the browser once and reused across all views and transitions.
- **Dynamic Styling**: Inherits CSS `currentColor` and respects dark/light themes effortlessly.