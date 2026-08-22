---
title: "ScrollTop"
description: "Floating smooth scroll-to-top button appearing dynamically after scroll depth"
order: 37
section: "Panels & Navigation"
---

# ScrollTop

The `<island-scroll-top />` TagHelper provides a floating, circular back-to-top button that animates into view when the user scrolls down the page.

---

## 🎮 Interactive Live Demo

<div style="background: var(--p-surface-50); border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius-lg); padding: 1.5rem; margin: 1.5rem 0;">
    <p style="font-size: 0.875rem; color: var(--p-surface-600); line-height: 1.6; margin-bottom: 1rem;">
        Scroll down this documentation page to see the floating <strong>ScrollTop</strong> button appear in the bottom-right corner.
    </p>
    <island name="scroll-top" props-json='{"threshold": 100, "behavior": "smooth"}' hydrate="Load"></island>
</div>

---

## 🚀 Basic Usage

```razor
<!-- Add anywhere in your Razor layout -->
<island-scroll-top threshold="200" behavior="smooth" hydrate="Load" />
```

---

## 📋 TagHelper Attributes

| Attribute | Type | Default | Description |
|---|---|---|---|
| `threshold` | `int` | `200` | Minimum scroll distance in pixels before the button appears. |
| `behavior` | `string` | `"smooth"` | Scroll behavior (`smooth` or `auto`). |
