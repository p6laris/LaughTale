---
title: Inplace Component
description: Inline editable text container swapping between static display and active editor.
order: 40
icon: edit
category: Form Controls
---

# Inplace Component

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
