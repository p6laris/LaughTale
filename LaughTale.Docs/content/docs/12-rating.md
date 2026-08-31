---
title: Rating Component
description: Star rating feedback control with custom icons, half-stars, and read-only mode.
order: 40
icon: star
category: Form Controls
---

# Rating Component



<div class="docs-live-sample" style="background: var(--p-surface-50); border: 1px solid var(--p-border-color); border-radius: 12px; padding: 1.5rem; margin-bottom: 2rem;">
    <div style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--p-primary-600); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.4rem;">
        <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: var(--p-primary-500); box-shadow: 0 0 8px var(--p-primary-500);"></span>
        Live Interactive Preview
    </div>
    <div data-island="rating" data-props='{"value": 4, "stars": 5}' data-hydrate="load"></div>
</div>

`<island-rating />` is an accessible, high-performance Aura component built for ASP.NET Core with server-side rendering (SSR), progressive hydration, and Dark Mode awareness.

---

## ⚡ 1. Basic Usage

```razor
<island-rating name="Score" value="4" stars="5" cancel="true" />
```

---

## 📋 2. TagHelper Attributes Reference

| Attribute | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `name` | `string` | `null` | Form input field name |
| `value` | `int?` | `null` | Selected star rating value |
| `stars` | `int` | `5` | Total number of stars |
| `read-only` | `bool` | `false` | Prevent user interaction |

---

## 🎨 3. Client & Event Interactivity

You can attach LaughTale declarative directives or client event handlers to `<island-rating />`:

```razor
<island-rating hydrate="Visible" />
```
