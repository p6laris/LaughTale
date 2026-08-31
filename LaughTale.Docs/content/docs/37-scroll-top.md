---
title: ScrollTop Component
description: Smooth animated back-to-top floating button appearing after scrolling.
order: 40
icon: arrow-up
category: Navigation
---

# ScrollTop Component

`<island-scroll-top />` is an accessible, high-performance Aura component built for ASP.NET Core with server-side rendering (SSR), progressive hydration, and Dark Mode awareness.

---

## ⚡ 1. Basic Usage

```razor
<island-scroll-top threshold="400" behavior="smooth" />
```

---

## 📋 2. TagHelper Attributes Reference

| Attribute | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `threshold` | `int` | `400` | Scroll offset in px before showing |
| `behavior` | `smooth | auto` | `smooth` | Scroll animation behavior |

---

## 🎨 3. Client & Event Interactivity

You can attach LaughTale declarative directives or client event handlers to `<island-scroll-top />`:

```razor
<island-scroll-top hydrate="Visible" />
```
