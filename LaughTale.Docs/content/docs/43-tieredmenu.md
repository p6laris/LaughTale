---
title: TieredMenu Component
description: Cascading hierarchical sub-menu navigation with flyout levels.
order: 40
icon: menu
category: Navigation
---

# TieredMenu Component
<div class="docs-live-sample" style="background: var(--p-surface-50); border: 1px solid var(--p-border-color); border-radius: 12px; padding: 1.5rem; margin-bottom: 2rem;">
    <div style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--p-primary-600); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.4rem;">
        <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: var(--p-primary-500); box-shadow: 0 0 8px var(--p-primary-500);"></span>
        Live Interactive Preview
    </div>
    <div style="max-width: 260px;">
        <div data-island="tieredmenu" data-props='{"model": [{"label": "File", "icon": "folder", "items": [{"label": "New File"}, {"label": "Open Project"}]}, {"label": "Edit", "icon": "pencil", "items": [{"label": "Undo"}, {"label": "Redo"}]}, {"label": "Settings", "icon": "settings"}]}' data-hydrate="load"></div>
    </div>
</div>


`<island-tieredmenu />` is an accessible, high-performance Aura component built for ASP.NET Core with server-side rendering (SSR), progressive hydration, and Dark Mode awareness.

---

## ⚡ 1. Basic Usage

```razor
<island-tieredmenu model="@Model.MenuTree" popup="false" />
```

---

## 📋 2. TagHelper Attributes Reference

| Attribute | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `model` | `List<MenuItem>` | `null` | Hierarchical menu items |
| `popup` | `bool` | `false` | Display as popup menu overlay |

---

## 🎨 3. Client & Event Interactivity

You can attach LaughTale declarative directives or client event handlers to `<island-tieredmenu />`:

```razor
<island-tieredmenu hydrate="Visible" />
```
