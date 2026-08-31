---
title: Knob Component
description: Radial dial rotary control with step precision, min/max limits, and custom stroke colors.
order: 40
icon: circle
category: Form Controls
---

# Knob Component

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
