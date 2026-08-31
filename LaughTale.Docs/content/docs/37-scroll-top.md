---
title: ScrollTop Component
description: Smooth animated back-to-top floating button appearing after scrolling.
order: 40
icon: arrow-up
category: Navigation
---

# ScrollTop Component
<div class="docs-live-sample" style="background: var(--p-surface-50); border: 1px solid var(--p-border-color); border-radius: 12px; padding: 1.5rem; margin-bottom: 2rem;">
    <div style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--p-primary-600); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.4rem;">
        <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: var(--p-primary-500); box-shadow: 0 0 8px var(--p-primary-500);"></span>
        Live Interactive Preview
    </div>
    <div style="display: flex; align-items: center; gap: 1rem;">
        <span style="font-size: 0.875rem; color: var(--p-text-muted);">Scroll down the page or click below:</span>
        <button type="button" class="p-button p-button-primary" onclick="window.scrollTo({ top: 0, behavior: 'smooth' })">Back to Top ↑</button>
    </div>
</div>


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
