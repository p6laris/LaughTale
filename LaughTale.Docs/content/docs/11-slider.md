---
title: Slider Component
description: Range selection slider with single and range handles, custom steps, and orientations.
order: 40
icon: sliders
category: Form Controls
---

# Slider Component

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
