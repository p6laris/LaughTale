---
title: Slider Component
description: Range selection slider with single and range handles, custom steps, and orientations.
order: 40
icon: sliders
category: Form Controls
---

# Slider Component



<div class="docs-live-sample" style="background: var(--p-surface-50); border: 1px solid var(--p-border-color); border-radius: 12px; padding: 1.5rem; margin-bottom: 2rem;">
    <div style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--p-primary-600); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.4rem;">
        <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: var(--p-primary-500); box-shadow: 0 0 8px var(--p-primary-500);"></span>
        Live Interactive Preview
    </div>
    <div style="max-width: 320px;">
        <div data-island="slider" data-props='{"value": 60, "min": 0, "max": 100, "step": 5}' data-hydrate="load"></div>
    </div>
</div>

`<island-slider />` is an accessible, high-performance Aura component built for ASP.NET Core with server-side rendering (SSR), progressive hydration, and Dark Mode awareness.

---

## ⚡ 1. Basic Usage

```razor
<island-slider name="Volume" value="50" min="0" max="100" step="5" />
```

---

## 📋 2. TagHelper Attributes Reference

| Attribute | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `name` | `string` | `null` | Form input field name |
| `value` | `int | double | int[]` | `0` | Current value or range tuple |
| `range` | `bool` | `false` | Enable dual-handle range selection |
| `min` | `int` | `0` | Minimum allowed value |
| `max` | `int` | `100` | Maximum allowed value |
| `step` | `int` | `1` | Step increment delta |

---

## 🎨 3. Client & Event Interactivity

You can attach LaughTale declarative directives or client event handlers to `<island-slider />`:

```razor
<island-slider hydrate="Visible" />
```
