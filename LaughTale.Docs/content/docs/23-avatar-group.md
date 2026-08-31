---
title: AvatarGroup Component
description: Stacked user avatar collection with overflow counter and customizable sizing.
order: 40
icon: users
category: Media & Misc
---

# AvatarGroup Component

`<island-avatar-group />` is an accessible, high-performance Aura component built for ASP.NET Core with server-side rendering (SSR), progressive hydration, and Dark Mode awareness.

---

## ⚡ 1. Basic Usage

```razor
<island-avatar-group size="large">
    <island-avatar image="/images/u1.jpg" />
    <island-avatar image="/images/u2.jpg" />
</island-avatar-group>
```

---

## 📋 2. TagHelper Attributes Reference

| Attribute | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `size` | `normal | large | xlarge` | `normal` | Size of grouped avatars |
| `shape` | `circle | square` | `circle` | Avatar boundary shape |

---

## 🎨 3. Client & Event Interactivity

You can attach LaughTale declarative directives or client event handlers to `<island-avatar-group />`:

```razor
<island-avatar-group hydrate="Visible" />
```
