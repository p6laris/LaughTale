---
title: Sidebar Component
description: Compound vertical navigation sidebar with collapsible sub-sections and active indicators.
order: 40
icon: layout
category: Navigation
---

# Sidebar Component

`<island-sidebar />` is an accessible, high-performance Aura component built for ASP.NET Core with server-side rendering (SSR), progressive hydration, and Dark Mode awareness.

---

## ⚡ 1. Basic Usage

```razor
<island-sidebar items="@Model.NavLinks" collapsed="false" />
```

---

## 📋 2. TagHelper Attributes Reference

| Attribute | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `items` | `List<SidebarItem>` | `null` | Sidebar items with icons and badges |
| `collapsed` | `bool` | `false` | Compact icon-only collapsed state |

---

## 🎨 3. Client & Event Interactivity

You can attach LaughTale declarative directives or client event handlers to `<island-sidebar />`:

```razor
<island-sidebar hydrate="Visible" />
```
