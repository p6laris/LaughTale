---
title: Carousel Component
description: Touch-friendly responsive content and image slider with autoplay, pagination dots, and circular looping.
order: 40
icon: film
category: Media & Misc
---

# Carousel Component

`<island-carousel />` is an accessible, high-performance Aura component built for ASP.NET Core with server-side rendering (SSR), progressive hydration, and Dark Mode awareness.

---

## ⚡ 1. Basic Usage

```razor
<island-carousel value="@Model.Products" num-visible="3" num-scroll="1" circular="true" autoplay-interval="3000" />
```

---

## 📋 2. TagHelper Attributes Reference

| Attribute | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `value` | `IEnumerable<T>` | `null` | Slide items dataset |
| `num-visible` | `int` | `1` | Number of visible items per page |
| `circular` | `bool` | `false` | Infinite circular looping |
| `autoplay-interval` | `int` | `0` | Autoplay duration in ms (0=off) |

---

## 🎨 3. Client & Event Interactivity

You can attach LaughTale declarative directives or client event handlers to `<island-carousel />`:

```razor
<island-carousel hydrate="Visible" />
```
