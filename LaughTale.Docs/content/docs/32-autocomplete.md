---
title: AutoComplete Component
description: Async search input with live suggestion dropdown, keyboard navigation, and chips mode.
order: 40
icon: search
category: Form Controls
---

# AutoComplete Component

`<island-autocomplete />` is an accessible, high-performance Aura component built for ASP.NET Core with server-side rendering (SSR), progressive hydration, and Dark Mode awareness.

---

## ⚡ 1. Basic Usage

```razor
<island-autocomplete name="City" suggestions="@Model.Results" min-length="2" />
```

---

## 📋 2. TagHelper Attributes Reference

| Attribute | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `name` | `string` | `null` | Form field name |
| `suggestions` | `IEnumerable<T>` | `null` | Current suggestion matches |
| `min-length` | `int` | `1` | Minimum characters to trigger search |
| `multiple` | `bool` | `false` | Multiple selection chips mode |

---

## 🎨 3. Client & Event Interactivity

You can attach LaughTale declarative directives or client event handlers to `<island-autocomplete />`:

```razor
<island-autocomplete hydrate="Visible" />
```
