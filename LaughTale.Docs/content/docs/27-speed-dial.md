---
title: SpeedDial Component
description: Floating Action Button (FAB) expanding into radial, linear, or semi-circle action buttons.
order: 40
icon: plus-circle
category: Navigation
---

# SpeedDial Component

`<island-speed-dial />` is an accessible, high-performance Aura component built for ASP.NET Core with server-side rendering (SSR), progressive hydration, and Dark Mode awareness.

---

## ⚡ 1. Basic Usage

```razor
<island-speed-dial items="@Model.Actions" direction="up" type="linear" />
```

---

## 📋 2. TagHelper Attributes Reference

| Attribute | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `items` | `List<MenuItem>` | `null` | Child action buttons |
| `direction` | `up | down | left | right` | `up` | Expansion direction |
| `type` | `linear | circle | semi-circle` | `linear` | Expansion geometry |

---

## 🎨 3. Client & Event Interactivity

You can attach LaughTale declarative directives or client event handlers to `<island-speed-dial />`:

```razor
<island-speed-dial hydrate="Visible" />
```
