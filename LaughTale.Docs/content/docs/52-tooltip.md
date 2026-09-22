---
title: Tooltip Directive & Component
description: Contextual hover hint tooltips supporting 4 directional positions and custom HTML.
order: 40
icon: help-circle
category: Overlays & Dialogs
---

# Tooltip Directive & Component
<div class="docs-live-sample" style="background: var(--p-surface-50); border: 1px solid var(--p-border-color); border-radius: 12px; padding: 1.5rem; margin-bottom: 2rem;">
    <div style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--p-primary-600); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.4rem;">
        <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: var(--p-primary-500); box-shadow: 0 0 8px var(--p-primary-500);"></span>
        Live Interactive Preview
    </div>
    <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
        <button type="button" class="p-button p-button-secondary" title="Default Top Tooltip">Hover Me (Top)</button>
        <button type="button" class="p-button p-button-secondary" title="Right positioned description">Hover Me (Right)</button>
    </div>
</div>


`<island-tooltip-component />` is an accessible, high-performance Aura component built for ASP.NET Core with server-side rendering (SSR), progressive hydration, and Dark Mode awareness.

---

## ⚡ 1. Basic Usage

```razor
<button type="button" class="p-button" l-tooltip="Save all pending changes">Save</button>
```

---

## 📋 2. TagHelper Attributes Reference

| Attribute | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `position` | `top | bottom | left | right` | `top` | Anchor placement edge |
| `show-delay` | `int` | `150` | Hover delay before appearance in ms |

---

## 🎨 3. Client & Event Interactivity

You can attach LaughTale declarative directives or client event handlers to `<island-tooltip-component />`:

```razor
<island-tooltip-component hydrate="Visible" />
```
