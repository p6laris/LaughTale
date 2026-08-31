---
title: Carousel Component
description: Touch-friendly responsive content and image slider with autoplay, pagination dots, and circular looping.
order: 40
icon: film
category: Media & Misc
---

# Carousel Component
<div class="docs-live-sample" style="background: var(--p-surface-50); border: 1px solid var(--p-border-color); border-radius: 12px; padding: 1.5rem; margin-bottom: 2rem;">
    <div style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--p-primary-600); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.4rem;">
        <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: var(--p-primary-500); box-shadow: 0 0 8px var(--p-primary-500);"></span>
        Live Interactive Preview
    </div>
    <div data-island="carousel" data-props='{"value": [{"title": "Enterprise Cloud", "icon": "cloud"}, {"title": "Zero-Eval Security", "icon": "shield"}, {"title": "Idiomorph Morphing", "icon": "zap"}], "numVisible": 1, "numScroll": 1}' data-hydrate="load"></div>
</div>


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
