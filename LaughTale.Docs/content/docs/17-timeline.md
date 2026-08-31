---
title: Timeline Component
description: Chronological event stream with vertical/horizontal layout, opposite labels, and custom icons.
order: 40
icon: clock
category: Data & Visualization
---

# Timeline Component

`<island-timeline />` is an accessible, high-performance Aura component built for ASP.NET Core with server-side rendering (SSR), progressive hydration, and Dark Mode awareness.

---

## ⚡ 1. Basic Usage

```razor
<island-timeline value="@Model.Events" align="alternate" />
```

---

## 📋 2. TagHelper Attributes Reference

| Attribute | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `value` | `List<TimelineItem>` | `null` | Timeline items data source |
| `align` | `left | right | alternate` | `left` | Content alignment relative to axis |
| `layout` | `vertical | horizontal` | `vertical` | Orientation axis |

---

## 🎨 3. Client & Event Interactivity

You can attach LaughTale declarative directives or client event handlers to `<island-timeline />`:

```razor
<island-timeline hydrate="Visible" />
```
