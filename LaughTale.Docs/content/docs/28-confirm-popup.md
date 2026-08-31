---
title: ConfirmPopup Component
description: Contextual confirmation overlay anchored to target button for quick confirmation.
order: 40
icon: alert-triangle
category: Overlays & Dialogs
---

# ConfirmPopup Component

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
