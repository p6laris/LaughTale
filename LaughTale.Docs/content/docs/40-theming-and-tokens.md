---
title: "Theming, Design Tokens & Customization"
description: "shadcn-style CSS custom properties, radii scales, elevation tokens, and semantic variants"
order: 40
section: "Composables & Architecture"
---

# Theming, Design Tokens & Customization

LaughTale and Aura components use standard **CSS Custom Properties (Design Tokens)** for theme configuration.

---

## 🎨 1. Core Token Scales

```css
:root {
    /* Primary Brand Palette */
    --p-primary-50: #ecfdf5;
    --p-primary-100: #d1fae5;
    --p-primary-200: #a7f3d0;
    --p-primary-500: #10b981;
    --p-primary-600: #059669;
    --p-primary-700: #047857;

    /* Surface Neutrals */
    --p-surface-0: #ffffff;
    --p-surface-50: #f8fafc;
    --p-surface-100: #f1f5f9;
    --p-surface-200: #e2e8f0;
    --p-surface-900: #0f172a;

    /* Corner Radii */
    --p-border-radius: 0.5rem;
    --p-border-radius-lg: 0.75rem;
    --p-border-radius-xl: 1rem;
}
```

---

## 🌓 2. Dark Mode Switching

All Aura components automatically listen to the `.dark` class on `<html>`:

```csharp
<!-- Zero flash theme synchronization in _Layout.cshtml -->
<script>
    if (localStorage.getItem('theme') === 'dark' || (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
    }
</script>
```
