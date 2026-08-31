---
title: Menu Component
description: Vertical list navigation menu with grouped subheaders and keyboard navigation.
order: 40
icon: list
category: Navigation
---

# Menu Component
<div class="docs-live-sample" style="background: var(--p-surface-50); border: 1px solid var(--p-border-color); border-radius: 12px; padding: 1.5rem; margin-bottom: 2rem;">
    <div style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--p-primary-600); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.4rem;">
        <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: var(--p-primary-500); box-shadow: 0 0 8px var(--p-primary-500);"></span>
        Live Interactive Preview
    </div>
    <div style="max-width: 240px;">
        <div data-island="menu" data-props='{"model": [{"label": "Dashboard", "icon": "home"}, {"label": "Analytics", "icon": "activity"}, {"label": "Settings", "icon": "settings"}]}' data-hydrate="load"></div>
    </div>
</div>


`<island-menu />` is an accessible, high-performance Aura component built for ASP.NET Core with server-side rendering (SSR), progressive hydration, and Dark Mode awareness.

---

## ⚡ 1. Basic Usage

```razor
<island-menu model="@Model.SideMenu" />
```

---

## 📋 2. TagHelper Attributes Reference

| Attribute | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `model` | `List<MenuItem>` | `null` | Navigation menu items collection |

---

## 🎨 3. Client & Event Interactivity

You can attach LaughTale declarative directives or client event handlers to `<island-menu />`:

```razor
<island-menu hydrate="Visible" />
```
