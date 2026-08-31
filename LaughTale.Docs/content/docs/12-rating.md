---
title: Rating Component
description: Star rating feedback control with custom icons, half-stars, and read-only mode.
order: 40
icon: star
category: Form Controls
---

# Rating Component

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
