---
title: SpeedDial Component
description: Floating Action Button (FAB) expanding into radial, linear, or semi-circle action buttons.
order: 40
icon: plus-circle
category: Navigation
---

# SpeedDial Component
<div class="docs-live-sample" style="background: var(--p-surface-50); border: 1px solid var(--p-border-color); border-radius: 12px; padding: 1.5rem; margin-bottom: 2rem; min-height: 120px; position: relative;">
    <div style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--p-primary-600); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.4rem;">
        <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: var(--p-primary-500); box-shadow: 0 0 8px var(--p-primary-500);"></span>
        Live Interactive Preview
    </div>
    <div data-island="speed-dial" data-props='{"direction": "right", "model": [{"icon": "pencil", "tooltip": "Edit"}, {"icon": "copy", "tooltip": "Duplicate"}, {"icon": "trash", "tooltip": "Delete"}]}' data-hydrate="load"></div>
</div>


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
