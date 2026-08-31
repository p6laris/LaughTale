---
title: MeterGroup Component
description: Segmented multi-value progress meter bar with proportional distribution and legend labels.
order: 40
icon: bar-chart
category: Data & Visualization
---

# MeterGroup Component

`<island-meter-group />` is an accessible, high-performance Aura component built for ASP.NET Core with server-side rendering (SSR), progressive hydration, and Dark Mode awareness.

---

## ⚡ 1. Basic Usage

```razor
<island-meter-group value="@Model.StorageMeters" max="100" />
```

---

## 📋 2. TagHelper Attributes Reference

| Attribute | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `value` | `List<MeterItem>` | `null` | Meter segments with label and color |
| `max` | `double` | `100` | Total scale maximum |
| `orientation` | `horizontal | vertical` | `horizontal` | Bar orientation |

---

## 🎨 3. Client & Event Interactivity

You can attach LaughTale declarative directives or client event handlers to `<island-meter-group />`:

```razor
<island-meter-group hydrate="Visible" />
```
