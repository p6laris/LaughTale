---
title: ProgressBar & Skeleton Components
description: Animated indeterminate/determinate progress loaders and content placeholder skeletons.
order: 40
icon: loader
category: Media & Misc
---

# ProgressBar & Skeleton Components
<div class="docs-live-sample" style="background: var(--p-surface-50); border: 1px solid var(--p-border-color); border-radius: 12px; padding: 1.5rem; margin-bottom: 2rem;">
    <div style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--p-primary-600); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.4rem;">
        <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: var(--p-primary-500); box-shadow: 0 0 8px var(--p-primary-500);"></span>
        Live Interactive Preview
    </div>
    <div style="display: flex; flex-direction: column; gap: 1.25rem; max-width: 360px;">
        <div data-island="progressbar" data-props='{"value": 72, "showValue": true}' data-hydrate="load"></div>
        <div data-island="skeleton" data-props='{"width": "100%", "height": "2.25rem", "borderRadius": "8px"}' data-hydrate="load"></div>
    </div>
</div>


`<island-progress-bar />` is an accessible, high-performance Aura component built for ASP.NET Core with server-side rendering (SSR), progressive hydration, and Dark Mode awareness.

---

## ⚡ 1. Basic Usage

```razor
<island-progress-bar value="65" show-value="true" />
<island-skeleton width="100%" height="2rem" />
```

---

## 📋 2. TagHelper Attributes Reference

| Attribute | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `value` | `int?` | `null` | Progress value 0-100 (null for indeterminate) |
| `mode` | `determinate | indeterminate` | `determinate` | Animation mode |
| `show-value` | `bool` | `true` | Display percentage text |

---

## 🎨 3. Client & Event Interactivity

You can attach LaughTale declarative directives or client event handlers to `<island-progress-bar />`:

```razor
<island-progress-bar hydrate="Visible" />
```
