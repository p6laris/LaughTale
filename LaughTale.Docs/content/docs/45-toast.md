---
title: Toast Component
description: Non-blocking notification overlay supporting auto-dismiss, severities, and position anchors.
order: 40
icon: bell
category: Overlays & Dialogs
---

# Toast Component

`<island-toast />` is an accessible, high-performance Aura component built for ASP.NET Core with server-side rendering (SSR), progressive hydration, and Dark Mode awareness.

---

## ⚡ 1. Basic Usage

```razor
<island-toast position="top-right" />
```

---

## 📋 2. TagHelper Attributes Reference

| Attribute | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `position` | `top-right | top-left | bottom-right | bottom-left | top-center` | `top-right` | Viewport anchor |
| `auto-z-index` | `bool` | `true` | Manage z-index stacking automatically |

---

## 🎨 3. Client & Event Interactivity

You can attach LaughTale declarative directives or client event handlers to `<island-toast />`:

```razor
<island-toast hydrate="Visible" />
```
