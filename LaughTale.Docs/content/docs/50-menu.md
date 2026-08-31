---
title: Menu Component
description: Vertical list navigation menu with grouped subheaders and keyboard navigation.
order: 40
icon: list
category: Navigation
---

# Menu Component

`<island-menu />` is an accessible, high-performance Aura component built for ASP.NET Core with server-side rendering (SSR), progressive hydration, and Dark Mode awareness.

---

## ⚡ 1. Basic Usage

```razor
<island-menu model="@Model.SideMenu" />
```

---

## 📋 2. TagHelper Attributes Reference

| Attribute | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `model` | `List<MenuItem>` | `null` | Navigation menu items collection |

---

## 🎨 3. Client & Event Interactivity

You can attach LaughTale declarative directives or client event handlers to `<island-menu />`:

```razor
<island-menu hydrate="Visible" />
```
