---
title: ContextMenu Component
description: Right-click popup context menu attached to target elements or global document.
order: 40
icon: mouse-pointer
category: Navigation
---

# ContextMenu Component
<div class="docs-live-sample" style="background: var(--p-surface-50); border: 1px solid var(--p-border-color); border-radius: 12px; padding: 1.5rem; margin-bottom: 2rem;">
    <div style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--p-primary-600); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.4rem;">
        <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: var(--p-primary-500); box-shadow: 0 0 8px var(--p-primary-500);"></span>
        Live Interactive Preview
    </div>
    <div style="padding: 2.5rem; border: 2px dashed var(--p-border-color); border-radius: 8px; text-align: center; color: var(--p-text-muted);">
        Right-click anywhere inside this box to open ContextMenu
    </div>
</div>


`<island-context-menu />` is an accessible, high-performance Aura component built for ASP.NET Core with server-side rendering (SSR), progressive hydration, and Dark Mode awareness.

---

## ⚡ 1. Basic Usage

```razor
<island-context-menu target="#my-table" model="@Model.MenuItems" />
```

---

## 📋 2. TagHelper Attributes Reference

| Attribute | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `target` | `string` | `null` | CSS selector of target element |
| `model` | `List<MenuItem>` | `null` | Menu items tree |

---

## 🎨 3. Client & Event Interactivity

You can attach LaughTale declarative directives or client event handlers to `<island-context-menu />`:

```razor
<island-context-menu hydrate="Visible" />
```
