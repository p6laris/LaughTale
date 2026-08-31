---
title: ContextMenu Component
description: Right-click popup context menu attached to target elements or global document.
order: 40
icon: mouse-pointer
category: Navigation
---

# ContextMenu Component

`<island-context-menu />` is an accessible, high-performance Aura component built for ASP.NET Core with server-side rendering (SSR), progressive hydration, and Dark Mode awareness.

---

## ⚡ 1. Basic Usage

```razor
<island-context-menu target="#my-table" model="@Model.MenuItems" />
```

---

## 📋 2. TagHelper Attributes Reference

| Attribute | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `target` | `string` | `null` | CSS selector of target element |
| `model` | `List<MenuItem>` | `null` | Menu items tree |

---

## 🎨 3. Client & Event Interactivity

You can attach LaughTale declarative directives or client event handlers to `<island-context-menu />`:

```razor
<island-context-menu hydrate="Visible" />
```
