---
title: Timeline Component
description: Chronological event stream with vertical/horizontal layout, opposite labels, and custom icons.
order: 40
icon: clock
category: Data & Visualization
---

# Timeline Component



<div class="docs-live-sample" style="background: var(--p-surface-50); border: 1px solid var(--p-border-color); border-radius: 12px; padding: 1.5rem; margin-bottom: 2rem;">
    <div style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--p-primary-600); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.4rem;">
        <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: var(--p-primary-500); box-shadow: 0 0 8px var(--p-primary-500);"></span>
        Live Interactive Preview
    </div>
    <div data-island="timeline" data-props='{"value": [{"status": "Order Placed", "date": "10:30 AM", "icon": "check"}, {"status": "Processing Payment", "date": "11:15 AM", "icon": "settings"}, {"status": "Dispatched to Courier", "date": "02:00 PM", "icon": "truck"}], "align": "alternate"}' data-hydrate="load"></div>
</div>

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
