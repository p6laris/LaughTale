---
title: AvatarGroup Component
description: Stacked user avatar collection with overflow counter and customizable sizing.
order: 40
icon: users
category: Media & Misc
---

# AvatarGroup Component
<div class="docs-live-sample" style="background: var(--p-surface-50); border: 1px solid var(--p-border-color); border-radius: 12px; padding: 1.5rem; margin-bottom: 2rem;">
    <div style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--p-primary-600); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.4rem;">
        <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: var(--p-primary-500); box-shadow: 0 0 8px var(--p-primary-500);"></span>
        Live Interactive Preview
    </div>
    <div style="display: flex; align-items: center; gap: 1rem; flex-wrap: wrap;">
        <div data-island="avatar-group" data-props='{"avatars": [{"label": "JD", "shape": "circle"}, {"label": "MK", "shape": "circle"}, {"label": "AL", "shape": "circle"}, {"label": "+4", "shape": "circle"}]}' data-hydrate="load"></div>
    </div>
</div>


`<island-avatar-group />` is an accessible, high-performance Aura component built for ASP.NET Core with server-side rendering (SSR), progressive hydration, and Dark Mode awareness.

---

## ⚡ 1. Basic Usage

```razor
<island-avatar-group size="large">
    <island-avatar image="/images/u1.jpg" />
    <island-avatar image="/images/u2.jpg" />
</island-avatar-group>
```

---

## 📋 2. TagHelper Attributes Reference

| Attribute | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `size` | `normal | large | xlarge` | `normal` | Size of grouped avatars |
| `shape` | `circle | square` | `circle` | Avatar boundary shape |

---

## 🎨 3. Client & Event Interactivity

You can attach LaughTale declarative directives or client event handlers to `<island-avatar-group />`:

```razor
<island-avatar-group hydrate="Visible" />
```
