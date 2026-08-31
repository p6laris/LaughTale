---
title: Theme Studio Component
description: Interactive visual design token customizer with live color palettes, contrast checking, and CSS export.
order: 40
icon: palette
category: Theming & Design
---

# Theme Studio Component

`<island-theme-studio />` is an accessible, high-performance Aura component built for ASP.NET Core with server-side rendering (SSR), progressive hydration, and Dark Mode awareness.

---

## ⚡ 1. Basic Usage

```razor
<island-theme-studio />
```

---

## 📋 2. TagHelper Attributes Reference

| Attribute | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `show-export` | `bool` | `true` | Display CSS token export button |

---

## 🎨 3. Client & Event Interactivity

You can attach LaughTale declarative directives or client event handlers to `<island-theme-studio />`:

```razor
<island-theme-studio hydrate="Visible" />
```
