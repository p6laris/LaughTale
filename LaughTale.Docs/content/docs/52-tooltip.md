---
title: Tooltip Directive & Component
description: Contextual hover hint tooltips supporting 4 directional positions and custom HTML.
order: 40
icon: help-circle
category: Overlays & Dialogs
---

# Tooltip Directive & Component

`<island-tooltip />` is an accessible, high-performance Aura component built for ASP.NET Core with server-side rendering (SSR), progressive hydration, and Dark Mode awareness.

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

You can attach LaughTale declarative directives or client event handlers to `<island-tooltip />`:

```razor
<island-tooltip hydrate="Visible" />
```
