---
title: Menubar Component
description: Horizontal top application navigation bar with responsive mobile hamburger drawer.
order: 40
icon: menu
category: Navigation
---

# Menubar Component
<div class="docs-live-sample" style="background: var(--p-surface-50); border: 1px solid var(--p-border-color); border-radius: 12px; padding: 1.5rem; margin-bottom: 2rem;">
    <div style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--p-primary-600); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.4rem;">
        <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: var(--p-primary-500); box-shadow: 0 0 8px var(--p-primary-500);"></span>
        Live Interactive Preview
    </div>
    <div data-island="menubar" data-props='{"model": [{"label": "Home", "icon": "home"}, {"label": "Components", "icon": "box"}, {"label": "Contact", "icon": "mail"}]}' data-hydrate="load"></div>
</div>


`<island-menubar />` is an accessible, high-performance Aura component built for ASP.NET Core with server-side rendering (SSR), progressive hydration, and Dark Mode awareness.

---

## ⚡ 1. Basic Usage

```razor
<island-menubar model="@Model.NavLinks" />
```

---

## 📋 2. TagHelper Attributes Reference

| Attribute | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `model` | `List<MenuItem>` | `null` | Hierarchical navigation items |

---

## 🎨 3. Client & Event Interactivity

You can attach LaughTale declarative directives or client event handlers to `<island-menubar />`:

```razor
<island-menubar hydrate="Visible" />
```
