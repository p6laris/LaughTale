---
title: Popover Component
description: Floating content overlay anchored to any trigger element with arrow pointers.
order: 40
icon: message-circle
category: Overlays & Dialogs
---

# Popover Component

`<island-popover />` is an accessible, high-performance Aura component built for ASP.NET Core with server-side rendering (SSR), progressive hydration, and Dark Mode awareness.

---

## ⚡ 1. Basic Usage

```razor
<island-popover id="user-popover">
    <div class="p-4">User details here...</div>
</island-popover>
```

---

## 📋 2. TagHelper Attributes Reference

| Attribute | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `id` | `string` | `required` | Unique DOM ID |
| `dismissable` | `bool` | `true` | Close on outside click |

---

## 🎨 3. Client & Event Interactivity

You can attach LaughTale declarative directives or client event handlers to `<island-popover />`:

```razor
<island-popover hydrate="Visible" />
```
