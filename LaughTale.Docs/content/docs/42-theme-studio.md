---
title: "Aura Theme Studio"
description: "Live interactive theme editor with primary colors, neutral surfaces, density, shadows, fonts, 10+ curated presets, and 1-click CSS & C# export"
order: 42
section: "Panels & Navigation"
---

# Aura Theme Studio

The `<island-theme-studio />` TagHelper embeds a floating, production-grade **live theme customizer** directly into your application. It provides real-time reactive CSS variable injection, appearance mode toggling, typography switching, spacing density tuning, and 1-click token export.

---

## 🎮 Interactive Live Demo

<div style="background: var(--p-surface-50); border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius-lg); padding: 1.5rem; margin: 1.5rem 0;">
    <div style="font-size: 0.75rem; font-weight: 700; color: var(--p-primary-600); text-transform: uppercase; margin-bottom: 0.75rem;">Interactive Theme Studio Drawer</div>
    <div data-island="theme-studio" data-props='{"defaultOpen": false}' data-hydrate="load"></div>
    <button type="button" onclick="document.dispatchEvent(new CustomEvent('studio:open'))" class="p-button p-button-primary">
        Launch Theme Studio 🎨
    </button>
</div>

---

## 🚀 Basic Usage

```razor
<!-- Embed in your _Layout.cshtml -->
<island-theme-studio />
```

Or trigger programmatically via JavaScript from any button:

```html
<button type="button" onclick="document.dispatchEvent(new CustomEvent('studio:open'))" class="p-button p-button-primary">
    🎨 Studio
</button>
```

---

## 🎨 Features & Customization Capabilities

### 1. Appearance Mode
- **Light**: Crisp daylight tokens (`--p-surface-0: #ffffff`).
- **Dark**: High-contrast dark surfaces with glow accents.
- **System**: Automatic synchronization with OS `prefers-color-scheme`.

### 2. Primary Color Palettes
Includes 13 carefully calibrated color shades plus a **Custom Hex Color Picker**:
- 🟢 **Emerald**: High-trust enterprise green (`#10b981`)
- 🟡 **KRD Golden**: Radiant Kurdish golden yellow (`#eab308`)
- 🟣 **Violet**: Modern Supabase-style purple (`#8b5cf6`)
- 🔵 **Indigo**: Tech-focused blue-violet (`#6366f1`)
- 🔴 **Rose**: Vibrant crimson red (`#f43f5e`)
- 🟠 **Amber**: Warm honey amber (`#f59e0b`)
- 🩵 **Cyan**: Neon cyberpunk cyan (`#06b6d4`)
- 🌊 **Blue**: Clean ocean azure (`#3b82f6`)
- 🍏 **Lime**: Modern high-energy lime (`#84cc16`)
- 🩵 **Teal**: Deep arctic teal (`#14b8a6`)
- 🍊 **Orange**: Dynamic sunset orange (`#f97316`)
- 🌸 **Pink**: Soft sakura pink (`#ec4899`)
- 🌌 **Sky**: Crisp aerospace sky (`#0ea5e9`)

### 3. Neutral Surface Bases
Switch between 5 Tailwind v4 neutral tonal palettes:
- **Slate**: Blue-tinted cool gray
- **Zinc**: Crisp metallic neutral
- **Stone**: Warm organic stone
- **Neutral**: Pure balanced monochrome
- **Gray**: Standard corporate gray

### 4. Corner Radius Scale
- `0rem` (Sharp edges)
- `0.25rem` (Small)
- `0.375rem` (Subtle rounded)
- `0.5rem` (Standard default)
- `0.75rem` (Large)
- `1.0rem` (Extra Large)
- `1.5rem` (Ultra Rounded)
- `9999px` (Pill shape)

### 5. Density & Spacing
- **Compact**: Tight 0.625rem padding for high-density data tables and dashboards.
- **Normal**: Standard 1.0rem balanced spacing.
- **Spacious**: Relaxed 1.5rem padding for landing pages and presentation views.

### 6. Elevation & Shadows
- **Flat**: Zero shadows for minimalist flat interfaces.
- **Subtle**: Low-profile soft ambient occlusion.
- **Layered**: Default multi-tier drop shadows.
- **3D Bold**: Dramatic high-elevation cards and floating modals.

### 7. Typography Fonts
- **Jakarta**: Plus Jakarta Sans (default geometric sans)
- **Inter**: Clean system UI sans-serif
- **Mono**: JetBrains Mono for telemetry and code editors

---

## ⚡ 1-Click Code Export

Theme Studio generates ready-to-use theme configurations in multiple formats:

### Generated CSS Custom Properties
```css
:root {
    --p-primary-color: #eab308;
    --p-primary-50: #fefce8;
    --p-primary-500: #eab308;
    --p-primary-600: #ca8a04;
    --p-primary-700: #a16207;
    --p-surface-0: #ffffff;
    --p-surface-50: #fafafa;
    --p-border-radius: 0.5rem;
    --p-content-padding: 1rem;
}
```

### Generated C# AppTheme Class
```csharp
public static class AppTheme
{
    public const string PrimaryHex = "#eab308";
    public const string PrimaryName = "KRD Golden";
    public const string NeutralBase = "zinc";
    public const string BorderRadius = "0.5rem";
    public const string Density = "normal";
}
```

