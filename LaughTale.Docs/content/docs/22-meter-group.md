---
title: MeterGroup Component
description: Segmented multi-value progress meter bar with proportional distribution and legend labels.
order: 40
icon: bar-chart
category: Data & Visualization
---

# MeterGroup Component



<div class="docs-live-sample" style="background: var(--p-surface-50); border: 1px solid var(--p-border-color); border-radius: 12px; padding: 1.5rem; margin-bottom: 2rem;">
    <div style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--p-primary-600); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.4rem;">
        <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: var(--p-primary-500); box-shadow: 0 0 8px var(--p-primary-500);"></span>
        Live Interactive Preview
    </div>
    <div data-island="meter-group" data-props='{"value": [{"label": "System Apps", "value": 35, "color": "#10b981"}, {"label": "User Data", "value": 28, "color": "#3b82f6"}, {"label": "Free Storage", "value": 37, "color": "#cbd5e1"}], "max": 100}' data-hydrate="load"></div>
</div>

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
