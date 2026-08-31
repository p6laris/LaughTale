---
title: ImageCompare Component
description: Interactive before/after dual-image comparison slider with touch and drag support.
order: 40
icon: image
category: Media & Misc
---

# ImageCompare Component
<div class="docs-live-sample" style="background: var(--p-surface-50); border: 1px solid var(--p-border-color); border-radius: 12px; padding: 1.5rem; margin-bottom: 2rem;">
    <div style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--p-primary-600); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.4rem;">
        <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: var(--p-primary-500); box-shadow: 0 0 8px var(--p-primary-500);"></span>
        Live Interactive Preview
    </div>
    <div style="max-width: 480px;">
        <div data-island="image-compare" data-props='{"leftImage": "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=480&q=80", "rightImage": "https://images.unsplash.com/photo-1579546929662-711aa81148cf?w=480&q=80"}' data-hydrate="load"></div>
    </div>
</div>


`<island-image-compare />` is an accessible, high-performance Aura component built for ASP.NET Core with server-side rendering (SSR), progressive hydration, and Dark Mode awareness.

---

## ⚡ 1. Basic Usage

```razor
<island-image-compare left-image="/images/before.jpg" right-image="/images/after.jpg" />
```

---

## 📋 2. TagHelper Attributes Reference

| Attribute | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `left-image` | `string` | `required` | Left/Before image URL |
| `right-image` | `string` | `required` | Right/After image URL |
| `position` | `double` | `50` | Initial split percentage |

---

## 🎨 3. Client & Event Interactivity

You can attach LaughTale declarative directives or client event handlers to `<island-image-compare />`:

```razor
<island-image-compare hydrate="Visible" />
```
