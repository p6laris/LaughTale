---
title: BlockUI Component
description: Content blocker masking target elements or full page during background operations.
order: 40
icon: shield-off
category: Overlays & Dialogs
---

# BlockUI Component

`<island-blockui />` is an accessible, high-performance Aura component built for ASP.NET Core with server-side rendering (SSR), progressive hydration, and Dark Mode awareness.

---

## ⚡ 1. Basic Usage

```razor
<island-blockui blocked="@Model.IsBusy">
    <div class="p-6">Protected Content</div>
</island-blockui>
```

---

## 📋 2. TagHelper Attributes Reference

| Attribute | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `blocked` | `bool` | `false` | Active blocking mask state |
| `full-screen` | `bool` | `false` | Block entire browser viewport |

---

## 🎨 3. Client & Event Interactivity

You can attach LaughTale declarative directives or client event handlers to `<island-blockui />`:

```razor
<island-blockui hydrate="Visible" />
```
