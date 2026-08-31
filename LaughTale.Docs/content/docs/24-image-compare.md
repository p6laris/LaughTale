---
title: ImageCompare Component
description: Interactive before/after dual-image comparison slider with touch and drag support.
order: 40
icon: image
category: Media & Misc
---

# ImageCompare Component

`<island-image-compare />` is an accessible, high-performance Aura component built for ASP.NET Core with server-side rendering (SSR), progressive hydration, and Dark Mode awareness.

---

## ⚡ 1. Basic Usage

```razor
<island-image-compare left-image="/images/before.jpg" right-image="/images/after.jpg" />
```

---

## 📋 2. TagHelper Attributes Reference

| Attribute | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `left-image` | `string` | `required` | Left/Before image URL |
| `right-image` | `string` | `required` | Right/After image URL |
| `position` | `double` | `50` | Initial split percentage |

---

## 🎨 3. Client & Event Interactivity

You can attach LaughTale declarative directives or client event handlers to `<island-image-compare />`:

```razor
<island-image-compare hydrate="Visible" />
```
