---
title: Toast Component
description: Non-blocking notification overlay supporting auto-dismiss, severities, and position anchors.
order: 40
icon: bell
category: Overlays & Dialogs
---

# Toast Component
<div class="docs-live-sample" style="background: var(--p-surface-50); border: 1px solid var(--p-border-color); border-radius: 12px; padding: 1.5rem; margin-bottom: 2rem;">
    <div style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--p-primary-600); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.4rem;">
        <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: var(--p-primary-500); box-shadow: 0 0 8px var(--p-primary-500);"></span>
        Live Interactive Preview
    </div>
    <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
        <button type="button" class="p-button p-button-success" onclick="document.dispatchEvent(new CustomEvent('toast:show', { detail: { severity: 'success', summary: 'Success', detail: 'Changes saved cleanly.' } }))">Show Success Toast</button>
        <button type="button" class="p-button p-button-danger" onclick="document.dispatchEvent(new CustomEvent('toast:show', { detail: { severity: 'error', summary: 'Error', detail: 'An unexpected exception occurred.' } }))">Show Error Toast</button>
    </div>
</div>


`<island-toast />` is an accessible, high-performance Aura component built for ASP.NET Core with server-side rendering (SSR), progressive hydration, and Dark Mode awareness.

---

## ⚡ 1. Basic Usage

```razor
<island-toast position="top-right" />
```

---

## 📋 2. TagHelper Attributes Reference

| Attribute | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `position` | `top-right | top-left | bottom-right | bottom-left | top-center` | `top-right` | Viewport anchor |
| `auto-z-index` | `bool` | `true` | Manage z-index stacking automatically |

---

## 🎨 3. Client & Event Interactivity

You can attach LaughTale declarative directives or client event handlers to `<island-toast />`:

```razor
<island-toast hydrate="Visible" />
```
