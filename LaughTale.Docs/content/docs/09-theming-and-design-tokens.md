---
title: "Theming, Tokens & Theme Studio"
description: "Aura enterprise design tokens, OKLCH 11-shade perceptual palette generation, WCAG contrast validation, and runtime Theme Studio customizer."
order: 9
section: "Core Concepts"
---

# Theming, Tokens & Theme Studio

LaughTale implements the **Enterprise Aura Design System**, built on **100% token purity** (zero hardcoded hex colors) and modern **OKLCH perceptual color science**.

---

## 🎨 Token Architecture

All 76 components in LaughTale consume semantic CSS custom properties defined on the document root:

- **Primary Colors**: `--p-primary-50` through `--p-primary-950`
- **Surface Neutrals**: `--p-surface-0` (pure white/dark background) through `--p-surface-950`
- **Semantic Feedback**: `--p-emerald-500` (Success), `--p-red-500` (Error), `--p-amber-500` (Warning), `--p-sky-500` (Info)
- **Geometry & Elevation**: `--p-border-radius-sm` through `--p-border-radius-xl`, `--p-shadow-sm` through `--p-shadow-lg`

---

## 🌈 OKLCH Perceptual Palette Generator

LaughTale uses the **OKLCH color space** (Oklab Lightness Chroma Hue) to generate complete 11-shade color ramps from a single brand hex color.

Unlike traditional HSL or RGB color spaces (which produce muddy, uneven shades), OKLCH guarantees **monotonic lightness decay**:

```typescript
import { generatePaletteRamp } from 'laughtale';

// Generates 11 shades (50, 100, 200 ... 900, 950) with uniform perceptual contrast
const emeraldRamp = generatePaletteRamp('#10b981');
```

---

## 👁️ WCAG 2.1 Contrast Engine

LaughTale includes a built-in WCAG 2.1 relative luminance and contrast engine:

```typescript
import { checkWcagCompliance } from 'laughtale';

const result = checkWcagCompliance('#ffffff', '#10b981');
console.log(result.contrastRatio); // e.g. 4.62
console.log(result.isAaCompliant); // true (>= 4.5:1)
console.log(result.isAaaCompliant); // false (requires >= 7.0:1)
```

---

## 🎨 Interactive Theme Studio

LaughTale includes a built-in, developer-friendly **Theme Studio** drawer.

### Enabling in Razor Pages
In your `_Layout.cshtml`:

```razor
<!-- Add Theme Studio Drawer TagHelper -->
<island-theme-studio />

<!-- Launch button -->
<button type="button" 
        class="p-button p-button-primary" 
        onclick="document.dispatchEvent(new CustomEvent('studio:open'))">
    🎨 Customize Theme
</button>
```

### Studio Capabilities
1. **Live Primary & Surface Palette Switcher**: Switch between Emerald, Indigo, Violet, Amber, Slate, Zinc, and Noir.
2. **Custom OKLCH Color Picker**: Type any hex code to generate a live palette in real time.
3. **Border Radius & Density Controls**: Toggle compact, comfortable, or spacious component scaling.
4. **Theme Export**: Export current customizations as CSS variables, C# options, or JSON configs with one click.
5. **Persistence**: Saves theme preferences across browser sessions via `localStorage` and `Cookie`.

---

## 🌪️ Tailwind CSS v4 Preset Integration

LaughTale provides a first-class Tailwind CSS v4 `@theme` preset:

```css
/* In your styles.css */
@import "tailwindcss";
@import "laughtale/styles/aura.css";

@theme {
  --color-primary-500: var(--p-primary-500);
  --color-surface-50: var(--p-surface-50);
  --color-surface-900: var(--p-surface-900);
}
```
