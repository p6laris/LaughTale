---
title: ProgressBar & Skeleton Components
description: Animated indeterminate/determinate progress loaders and content placeholder skeletons.
order: 40
icon: loader
category: Media & Misc
---

# ProgressBar & Skeleton Components

`<island-progress-bar />` is an accessible, high-performance Aura component built for ASP.NET Core with server-side rendering (SSR), progressive hydration, and Dark Mode awareness.

---

## ⚡ 1. Basic Usage

```razor
<island-progress-bar value="65" show-value="true" />
<island-skeleton width="100%" height="2rem" />
```

---

## 📋 2. TagHelper Attributes Reference

| Attribute | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `value` | `int?` | `null` | Progress value 0-100 (null for indeterminate) |
| `mode` | `determinate | indeterminate` | `determinate` | Animation mode |
| `show-value` | `bool` | `true` | Display percentage text |

---

## 🎨 3. Client & Event Interactivity

You can attach LaughTale declarative directives or client event handlers to `<island-progress-bar />`:

```razor
<island-progress-bar hydrate="Visible" />
```
