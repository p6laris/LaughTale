---
title: InputNumber Component
description: Numeric input control with currency formatting, decimal precision, prefix/suffix, min/max limits, and increment/decrement buttons.
order: 40
icon: hash
category: Form Controls
---

# InputNumber Component

`<island-input-number />` is an accessible, high-performance Aura component built for ASP.NET Core with server-side rendering (SSR), progressive hydration, and Dark Mode awareness.

---

## ⚡ 1. Basic Usage

```razor
<island-input-number name="Price" value="@Model.Price" mode="currency" currency="USD" locale="en-US" min="0" show-buttons="true" />
```

---

## 📋 2. TagHelper Attributes Reference

| Attribute | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `name` | `string` | `null` | Form input field name for model binding |
| `value` | `decimal? | double? | int?` | `null` | Current numeric value |
| `mode` | `decimal | currency` | `decimal` | Numeric display format mode |
| `currency` | `string` | `USD` | ISO 4217 Currency code |
| `min` | `decimal?` | `null` | Minimum allowed value |
| `max` | `decimal?` | `null` | Maximum allowed value |
| `step` | `decimal` | `1` | Increment/decrement step delta |
| `show-buttons` | `bool` | `false` | Display stepper up/down buttons |

---

## 🎨 3. Client & Event Interactivity

You can attach LaughTale declarative directives or client event handlers to `<island-input-number />`:

```razor
<island-input-number hydrate="Visible" />
```
