---
title: Breadcrumb Component
description: Hierarchical navigation trail with home icon and route anchors.
order: 40
icon: navigation
category: Navigation
---

# Breadcrumb Component

`<island-breadcrumb />` is an accessible, high-performance Aura component built for ASP.NET Core with server-side rendering (SSR), progressive hydration, and Dark Mode awareness.

---

## ⚡ 1. Basic Usage

```razor
<island-breadcrumb model="@Model.Trail" home="@Model.HomeItem" />
```

---

## 📋 2. TagHelper Attributes Reference

| Attribute | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `model` | `List<MenuItem>` | `null` | Breadcrumb trail items |
| `home` | `MenuItem` | `null` | Root home route item |

---

## 🎨 3. Client & Event Interactivity

You can attach LaughTale declarative directives or client event handlers to `<island-breadcrumb />`:

```razor
<island-breadcrumb hydrate="Visible" />
```
