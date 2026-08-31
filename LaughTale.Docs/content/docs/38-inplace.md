---
title: Inplace Component
description: Inline editable text container swapping between static display and active editor.
order: 40
icon: edit
category: Form Controls
---

# Inplace Component
<div class="docs-live-sample" style="background: var(--p-surface-50); border: 1px solid var(--p-border-color); border-radius: 12px; padding: 1.5rem; margin-bottom: 2rem;">
    <div style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--p-primary-600); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.4rem;">
        <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: var(--p-primary-500); box-shadow: 0 0 8px var(--p-primary-500);"></span>
        Live Interactive Preview
    </div>
    <div data-island="inplace" data-props='{"closable": true}' data-hydrate="load">
        <span slot="display" style="cursor: pointer; text-decoration: underline dotted; color: var(--p-primary-600);">Click to Edit Title</span>
    </div>
</div>


`<island-inplace />` is an accessible, high-performance Aura component built for ASP.NET Core with server-side rendering (SSR), progressive hydration, and Dark Mode awareness.

---

## ⚡ 1. Basic Usage

```razor
<island-inplace closable="true">
    <span slot="display">Click to Edit</span>
    <input slot="content" class="p-inputtext" />
</island-inplace>
```

---

## 📋 2. TagHelper Attributes Reference

| Attribute | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `closable` | `bool` | `false` | Display close button on edit |
| `active` | `bool` | `false` | Initial editor state |

---

## 🎨 3. Client & Event Interactivity

You can attach LaughTale declarative directives or client event handlers to `<island-inplace />`:

```razor
<island-inplace hydrate="Visible" />
```
