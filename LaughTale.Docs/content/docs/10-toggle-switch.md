---
title: ToggleSwitch Component
description: Accessible animated boolean switch control supporting custom sizes, labels, and keyboard toggling.
order: 40
icon: toggle-left
category: Form Controls
---

# ToggleSwitch Component

`<island-toggle-switch />` is an accessible, high-performance Aura component built for ASP.NET Core with server-side rendering (SSR), progressive hydration, and Dark Mode awareness.

---

## ⚡ 1. Basic Usage

```razor
<island-toggle-switch name="EnableNotifications" checked="@Model.NotificationsEnabled" />
```

---

## 📋 2. TagHelper Attributes Reference

| Attribute | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `name` | `string` | `null` | Form input field name |
| `checked` | `bool` | `false` | Checked state of switch |
| `disabled` | `bool` | `false` | Disabled interaction state |

---

## 🎨 3. Client & Event Interactivity

You can attach LaughTale declarative directives or client event handlers to `<island-toggle-switch />`:

```razor
<island-toggle-switch hydrate="Visible" />
```
