---
title: OrderList Component
description: Reorderable list control with drag-and-drop and up/down movement controls.
order: 40
icon: list-ordered
category: Form Controls
---

# OrderList Component

`<island-orderlist />` is an accessible, high-performance Aura component built for ASP.NET Core with server-side rendering (SSR), progressive hydration, and Dark Mode awareness.

---

## ⚡ 1. Basic Usage

```razor
<island-orderlist value="@Model.PriorityList" header="Priority Queue" />
```

---

## 📋 2. TagHelper Attributes Reference

| Attribute | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `value` | `List<T>` | `null` | List items to reorder |
| `header` | `string` | `null` | List header title |

---

## 🎨 3. Client & Event Interactivity

You can attach LaughTale declarative directives or client event handlers to `<island-orderlist />`:

```razor
<island-orderlist hydrate="Visible" />
```
