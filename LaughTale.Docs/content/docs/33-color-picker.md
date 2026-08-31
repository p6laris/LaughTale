---
title: ColorPicker Component
description: Color selection input supporting Hex, RGB, HSL with inline and overlay modes.
order: 40
icon: droplet
category: Form Controls
---

# ColorPicker Component
<div class="docs-live-sample" style="background: var(--p-surface-50); border: 1px solid var(--p-border-color); border-radius: 12px; padding: 1.5rem; margin-bottom: 2rem;">
    <div style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--p-primary-600); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.4rem;">
        <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: var(--p-primary-500); box-shadow: 0 0 8px var(--p-primary-500);"></span>
        Live Interactive Preview
    </div>
    <div data-island="color-picker" data-props='{"value": "#10b981", "format": "hex"}' data-hydrate="load"></div>
</div>


`<island-color-picker />` is an accessible, high-performance Aura component built for ASP.NET Core with server-side rendering (SSR), progressive hydration, and Dark Mode awareness.

---

## ⚡ 1. Basic Usage

```razor
<island-color-picker name="BrandColor" value="#10b981" format="hex" />
```

---

## 📋 2. TagHelper Attributes Reference

| Attribute | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `name` | `string` | `null` | Form field name |
| `value` | `string` | `#000000` | Color value |
| `format` | `hex | rgb | hsb` | `hex` | Color output format |
| `inline` | `bool` | `false` | Render inline without popup |

---

## 🎨 3. Client & Event Interactivity

You can attach LaughTale declarative directives or client event handlers to `<island-color-picker />`:

```razor
<island-color-picker hydrate="Visible" />
```
