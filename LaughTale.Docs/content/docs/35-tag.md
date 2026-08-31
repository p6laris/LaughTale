---
title: Tag & Badge Components
description: Compact labels and numeric status badges with semantic severities.
order: 40
icon: tag
category: Media & Misc
---

# Tag & Badge Components

`<island-tag />` is an accessible, high-performance Aura component built for ASP.NET Core with server-side rendering (SSR), progressive hydration, and Dark Mode awareness.

---

## ⚡ 1. Basic Usage

```razor
<island-tag value="Active" severity="success" icon="check" rounded="true" />
```

---

## 📋 2. TagHelper Attributes Reference

| Attribute | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `value` | `string` | `null` | Tag text caption |
| `severity` | `primary | success | info | warn | danger | secondary` | `primary` | Color severity |
| `rounded` | `bool` | `false` | Pill rounded shape |

---

## 🎨 3. Client & Event Interactivity

You can attach LaughTale declarative directives or client event handlers to `<island-tag />`:

```razor
<island-tag hydrate="Visible" />
```
