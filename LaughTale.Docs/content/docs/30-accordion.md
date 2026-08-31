---
title: Accordion Component
description: Expandable accordion panel groups with single/multiple expansion and lazy rendering.
order: 40
icon: layers
category: Navigation
---

# Accordion Component
<div class="docs-live-sample" style="background: var(--p-surface-50); border: 1px solid var(--p-border-color); border-radius: 12px; padding: 1.5rem; margin-bottom: 2rem;">
    <div style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--p-primary-600); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.4rem;">
        <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: var(--p-primary-500); box-shadow: 0 0 8px var(--p-primary-500);"></span>
        Live Interactive Preview
    </div>
    <div data-island="accordion" data-props='{"activeIndex": 0, "tabs": [{"header": "Aura Design System", "content": "Modern design tokens, high-contrast dark mode ramps, and WCAG AA/AAA compliance."}, {"header": "Idiomorph DOM Morphing", "content": "Server-driven refresh without losing input focus, scroll position, or CSS animations."}]}' data-hydrate="load"></div>
</div>


`<island-accordion />` is an accessible, high-performance Aura component built for ASP.NET Core with server-side rendering (SSR), progressive hydration, and Dark Mode awareness.

---

## ⚡ 1. Basic Usage

```razor
<island-accordion value="0" multiple="false">
    <div slot="tab-0" header="General Settings">Panel content...</div>
</island-accordion>
```

---

## 📋 2. TagHelper Attributes Reference

| Attribute | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `value` | `int | int[]` | `0` | Active tab index or array |
| `multiple` | `bool` | `false` | Allow multiple panels expanded |

---

## 🎨 3. Client & Event Interactivity

You can attach LaughTale declarative directives or client event handlers to `<island-accordion />`:

```razor
<island-accordion hydrate="Visible" />
```
