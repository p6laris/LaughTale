---
title: ListBox Component
description: Scrollable single and multi-selection list options with search filtering and custom templates.
order: 40
icon: list
category: Form Controls
---

# ListBox Component

`<island-listbox />` is an accessible, high-performance Aura component built for ASP.NET Core with server-side rendering (SSR), progressive hydration, and Dark Mode awareness.

---

## ⚡ 1. Basic Usage

```razor
<island-listbox name="SelectedUser" options="@Model.Users" option-label="Name" option-value="Id" filter="true" />
```

---

## 📋 2. TagHelper Attributes Reference

| Attribute | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `name` | `string` | `null` | Form field name |
| `options` | `IEnumerable<T>` | `null` | Options list |
| `multiple` | `bool` | `false` | Enable multi-selection |
| `filter` | `bool` | `false` | Enable search filter input |

---

## 🎨 3. Client & Event Interactivity

You can attach LaughTale declarative directives or client event handlers to `<island-listbox />`:

```razor
<island-listbox hydrate="Visible" />
```
