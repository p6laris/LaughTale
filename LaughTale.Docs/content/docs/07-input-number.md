---
title: InputNumber Component
description: Numeric input control with currency formatting, decimal precision, prefix/suffix, min/max limits, and increment/decrement buttons.
order: 40
icon: hash
category: Form Controls
---

# InputNumber Component



<div class="docs-live-sample" style="background: var(--p-surface-50); border: 1px solid var(--p-border-color); border-radius: 12px; padding: 1.5rem; margin-bottom: 2rem;">
    <div style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--p-primary-600); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.4rem;">
        <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: var(--p-primary-500); box-shadow: 0 0 8px var(--p-primary-500);"></span>
        Live Interactive Preview
    </div>
    <div style="max-width: 280px;">
        <div data-island="input-number" data-props='{"value": 249.99, "mode": "currency", "currency": "USD", "showButtons": true, "min": 0}' data-hydrate="load"></div>
    </div>
</div>

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
