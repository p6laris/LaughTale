---
title: Command Palette Component
description: Global Ctrl+K spotlight modal for instant fuzzy search, route jumping, and shortcuts.
order: 40
icon: command
category: Overlays & Dialogs
---

# Command Palette Component

`<island-command-palette />` is an accessible, high-performance Aura component built for ASP.NET Core with server-side rendering (SSR), progressive hydration, and Dark Mode awareness.

---

## ⚡ 1. Basic Usage

```razor
<island-command-palette placeholder="Type a command or search..." />
```

---

## 📋 2. TagHelper Attributes Reference

| Attribute | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `placeholder` | `string` | `Search...` | Input placeholder text |
| `hotkey` | `string` | `ctrl+k` | Keyboard shortcut trigger |

---

## 🎨 3. Client & Event Interactivity

You can attach LaughTale declarative directives or client event handlers to `<island-command-palette />`:

```razor
<island-command-palette hydrate="Visible" />
```
