---
title: Splitter Component
description: Resizable split pane layout container with draggable gutter handles.
order: 40
icon: columns
category: Layout
---

# Splitter Component
<div class="docs-live-sample" style="background: var(--p-surface-50); border: 1px solid var(--p-border-color); border-radius: 12px; padding: 1.5rem; margin-bottom: 2rem;">
    <div style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--p-primary-600); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.4rem;">
        <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: var(--p-primary-500); box-shadow: 0 0 8px var(--p-primary-500);"></span>
        Live Interactive Preview
    </div>
    <div data-island="splitter" data-props='{"layout": "horizontal", "panels": [{"content": "Left Panel Content", "size": 50}, {"content": "Right Panel Content", "size": 50}]}' data-hydrate="load"></div>
</div>


`<island-splitter />` is an accessible, high-performance Aura component built for ASP.NET Core with server-side rendering (SSR), progressive hydration, and Dark Mode awareness.

---

## ⚡ 1. Basic Usage

```razor
<island-splitter layout="horizontal">
    <div class="p-4">Pane 1</div>
    <div class="p-4">Pane 2</div>
</island-splitter>
```

---

## 📋 2. TagHelper Attributes Reference

| Attribute | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `layout` | `horizontal | vertical` | `horizontal` | Splitting orientation |

---

## 🎨 3. Client & Event Interactivity

You can attach LaughTale declarative directives or client event handlers to `<island-splitter />`:

```razor
<island-splitter hydrate="Visible" />
```
