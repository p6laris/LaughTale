---
title: Message Component
description: Inline alert and banner messages with severity icons and closable dismiss actions.
order: 40
icon: info
category: Overlays & Dialogs
---

# Message Component

`<island-message />` is an accessible, high-performance Aura component built for ASP.NET Core with server-side rendering (SSR), progressive hydration, and Dark Mode awareness.

---

## ⚡ 1. Basic Usage

```razor
<island-message severity="warn" icon="alert-triangle" closable="true">
    Please verify your email address to unlock full features.
</island-message>
```

---

## 📋 2. TagHelper Attributes Reference

| Attribute | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `severity` | `success | info | warn | error | secondary` | `info` | Color severity theme |
| `icon` | `string` | `null` | Custom Lucide icon name |
| `closable` | `bool` | `false` | Display dismiss close button |

---

## 🎨 3. Client & Event Interactivity

You can attach LaughTale declarative directives or client event handlers to `<island-message />`:

```razor
<island-message hydrate="Visible" />
```
