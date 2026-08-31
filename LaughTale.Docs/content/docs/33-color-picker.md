---
title: ColorPicker Component
description: Color selection input supporting Hex, RGB, HSL with inline and overlay modes.
order: 40
icon: droplet
category: Form Controls
---

# ColorPicker Component

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
