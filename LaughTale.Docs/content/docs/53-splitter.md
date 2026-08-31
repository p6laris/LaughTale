---
title: Splitter Component
description: Resizable split pane layout container with draggable gutter handles.
order: 40
icon: columns
category: Layout
---

# Splitter Component

`<island-splitter />` is an accessible, high-performance Aura component built for ASP.NET Core with server-side rendering (SSR), progressive hydration, and Dark Mode awareness.

---

## ⚡ 1. Basic Usage

```razor
<island-splitter layout="horizontal">
    <div class="p-4">Pane 1</div>
    <div class="p-4">Pane 2</div>
</island-splitter>
```

---

## 📋 2. TagHelper Attributes Reference

| Attribute | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `layout` | `horizontal | vertical` | `horizontal` | Splitting orientation |

---

## 🎨 3. Client & Event Interactivity

You can attach LaughTale declarative directives or client event handlers to `<island-splitter />`:

```razor
<island-splitter hydrate="Visible" />
```
