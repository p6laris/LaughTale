---
title: PickList Component
description: Dual-list transfer control with directional transfer arrows, sorting, and RTL support.
order: 40
icon: arrow-right-left
category: Form Controls
---

# PickList Component

`<island-picklist />` is an accessible, high-performance Aura component built for ASP.NET Core with server-side rendering (SSR), progressive hydration, and Dark Mode awareness.

---

## ⚡ 1. Basic Usage

```razor
<island-picklist source="@Model.Available" target="@Model.Selected" source-header="Available" target-header="Selected" />
```

---

## 📋 2. TagHelper Attributes Reference

| Attribute | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `source` | `List<T>` | `null` | Available items list |
| `target` | `List<T>` | `null` | Selected items list |
| `show-source-controls` | `bool` | `true` | Display reorder buttons |

---

## 🎨 3. Client & Event Interactivity

You can attach LaughTale declarative directives or client event handlers to `<island-picklist />`:

```razor
<island-picklist hydrate="Visible" />
```
