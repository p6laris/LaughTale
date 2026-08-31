---
title: Menubar Component
description: Horizontal top application navigation bar with responsive mobile hamburger drawer.
order: 40
icon: menu
category: Navigation
---

# Menubar Component

`<island-menubar />` is an accessible, high-performance Aura component built for ASP.NET Core with server-side rendering (SSR), progressive hydration, and Dark Mode awareness.

---

## ⚡ 1. Basic Usage

```razor
<island-menubar model="@Model.NavLinks" />
```

---

## 📋 2. TagHelper Attributes Reference

| Attribute | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `model` | `List<MenuItem>` | `null` | Hierarchical navigation items |

---

## 🎨 3. Client & Event Interactivity

You can attach LaughTale declarative directives or client event handlers to `<island-menubar />`:

```razor
<island-menubar hydrate="Visible" />
```
