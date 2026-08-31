---
title: SelectButton Component
description: Segmented button group for single and multiple selection options.
order: 40
icon: toggle-right
category: Form Controls
---

# SelectButton Component

`<island-select-button />` is an accessible, high-performance Aura component built for ASP.NET Core with server-side rendering (SSR), progressive hydration, and Dark Mode awareness.

---

## ⚡ 1. Basic Usage

```razor
<island-select-button name="PaymentType" options="@Model.Options" option-label="Name" option-value="Value" />
```

---

## 📋 2. TagHelper Attributes Reference

| Attribute | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `name` | `string` | `null` | Form field name |
| `options` | `IEnumerable<T>` | `null` | Options list |
| `multiple` | `bool` | `false` | Allow multiple option selection |

---

## 🎨 3. Client & Event Interactivity

You can attach LaughTale declarative directives or client event handlers to `<island-select-button />`:

```razor
<island-select-button hydrate="Visible" />
```
