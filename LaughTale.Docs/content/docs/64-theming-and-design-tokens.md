---
title: Theming & Design Tokens
description: Perceptually uniform OKLCH palette ramps, zero-FOUC theme persistence, and live WCAG contrast checking.
category: Theming & Design System
order: 64
---

# Theming & Design Tokens

LaughTale provides a unified design token system supporting dynamic runtime theming, custom color ramps, and automated WCAG accessibility auditing.

---

## 1. OKLCH Color Palette Generator

Generate complete 11-shade color ramps (50 to 950) from any single brand hex code using the perceptually uniform OKLCH color space:

```typescript
import { generatePaletteRamp } from 'laughtale/runtime';

const emeraldRamp = generatePaletteRamp('#10b981');
// Returns: { 50: '#...', 100: '#...', ..., 900: '#...', 950: '#...' }
```

---

## 2. Zero-FOUC Theme Persistence

Themes are saved to cookies and `localStorage` and restored immediately in the document head before the first paint:

```csharp
// In _Layout.cshtml <head>:
<laughtale-theme default-theme="Emerald" default-dark-mode="System" />
```

Client API:
```typescript
import { saveTheme, applySavedTheme } from 'laughtale/runtime';

saveTheme({
    palette: 'Emerald',
    darkMode: 'dark',
    surface: 'Zinc',
    radius: 'md'
});
```

---

## 3. Live WCAG 2.1 Contrast Checking

Ensure text meets WCAG AA (4.5:1 for normal text, 3:1 for large text) and AAA (7:1) compliance:

```typescript
import { calculateContrastRatio, checkWcagCompliance } from 'laughtale/runtime';

const ratio = calculateContrastRatio('#ffffff', '#10b981');
const result = checkWcagCompliance('#ffffff', '#10b981', 'normal');
// result: { ratio: 4.54, passesAa: true, passesAaa: false }
```
