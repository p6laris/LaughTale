---
title: ConfirmPopup Component
description: Contextual confirmation overlay anchored to target button for quick confirmation.
order: 40
icon: alert-triangle
category: Overlays & Dialogs
---

# ConfirmPopup Component
<div class="docs-live-sample" style="background: var(--p-surface-50); border: 1px solid var(--p-border-color); border-radius: 12px; padding: 1.5rem; margin-bottom: 2rem;">
    <div style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--p-primary-600); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.4rem;">
        <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: var(--p-primary-500); box-shadow: 0 0 8px var(--p-primary-500);"></span>
        Live Interactive Preview
    </div>
    <div style="display: flex; gap: 0.75rem;">
        <button type="button" class="p-button p-button-danger" onclick="alert('Confirm Action Dialog')">Delete Item</button>
        <button type="button" class="p-button p-button-outlined" onclick="alert('Operation Cancelled')">Cancel</button>
    </div>
</div>


`<island-confirm-popup />` is an accessible, high-performance Aura component built for ASP.NET Core with server-side rendering (SSR), progressive hydration, and Dark Mode awareness.

---

## ⚡ 1. Basic Usage

```razor
<island-confirm-popup message="Are you sure you want to proceed?" />
```

---

## 📋 2. TagHelper Attributes Reference

| Attribute | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `message` | `string` | `null` | Confirmation prompt text |
| `icon` | `string` | `help-circle` | Header icon |

---

## 🎨 3. Client & Event Interactivity

You can attach LaughTale declarative directives or client event handlers to `<island-confirm-popup />`:

```razor
<island-confirm-popup hydrate="Visible" />
```
