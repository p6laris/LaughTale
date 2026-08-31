---
title: Knob Component
description: Radial dial rotary control with step precision, min/max limits, and custom stroke colors.
order: 40
icon: circle
category: Form Controls
---

# Knob Component



<div class="docs-live-sample" style="background: var(--p-surface-50); border: 1px solid var(--p-border-color); border-radius: 12px; padding: 1.5rem; margin-bottom: 2rem;">
    <div style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--p-primary-600); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.4rem;">
        <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: var(--p-primary-500); box-shadow: 0 0 8px var(--p-primary-500);"></span>
        Live Interactive Preview
    </div>
    <div data-island="knob" data-props='{"value": 72, "min": 0, "max": 100, "valueTemplate": "{value}%"}' data-hydrate="load"></div>
</div>

`<island-knob />` is an accessible, high-performance Aura component built for ASP.NET Core with server-side rendering (SSR), progressive hydration, and Dark Mode awareness.

---

## ⚡ 1. Basic Usage

```razor
<island-knob name="Volume" value="60" min="0" max="100" value-template="{value}%" />
```

---

## 📋 2. TagHelper Attributes Reference

| Attribute | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `name` | `string` | `null` | Form field name |
| `value` | `int` | `0` | Current numeric value |
| `min` | `int` | `0` | Minimum range value |
| `max` | `int` | `100` | Maximum range value |
| `size` | `int` | `100` | Diameter in pixels |

---

## 🎨 3. Client & Event Interactivity

You can attach LaughTale declarative directives or client event handlers to `<island-knob />`:

```razor
<island-knob hydrate="Visible" />
```
