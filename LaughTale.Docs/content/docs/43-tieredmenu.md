---
title: TieredMenu Component
description: Cascading hierarchical sub-menu navigation with flyout levels.
order: 40
icon: menu
category: Navigation
---

# TieredMenu Component

`<island-tieredmenu />` is an accessible, high-performance Aura component built for ASP.NET Core with server-side rendering (SSR), progressive hydration, and Dark Mode awareness.

---

## ⚡ 1. Basic Usage

```razor
<island-tieredmenu model="@Model.MenuTree" popup="false" />
```

---

## 📋 2. TagHelper Attributes Reference

| Attribute | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `model` | `List<MenuItem>` | `null` | Hierarchical menu items |
| `popup` | `bool` | `false` | Display as popup menu overlay |

---

## 🎨 3. Client & Event Interactivity

You can attach LaughTale declarative directives or client event handlers to `<island-tieredmenu />`:

```razor
<island-tieredmenu hydrate="Visible" />
```
