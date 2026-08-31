---
title: DataView Component
description: Versatile layout switcher displaying datasets in grid cards or detailed list rows with built-in paginator.
order: 40
icon: grid
category: Data & Trees
---

# DataView Component
<div class="docs-live-sample" style="background: var(--p-surface-50); border: 1px solid var(--p-border-color); border-radius: 12px; padding: 1.5rem; margin-bottom: 2rem;">
    <div style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--p-primary-600); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.4rem;">
        <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: var(--p-primary-500); box-shadow: 0 0 8px var(--p-primary-500);"></span>
        Live Interactive Preview
    </div>
    <div data-island="dataview" data-props='{"layout": "grid", "value": [{"title": "LaughTale Core", "badge": "v3.0", "rating": 5}, {"title": "LaughTale Components", "badge": "76 Suite", "rating": 5}]}' data-hydrate="load"></div>
</div>


`<island-dataview />` is an accessible, high-performance Aura component built for ASP.NET Core with server-side rendering (SSR), progressive hydration, and Dark Mode awareness.

---

## ⚡ 1. Basic Usage

```razor
<island-dataview value="@Model.Catalog" layout="grid" paginator="true" rows="6" />
```

---

## 📋 2. TagHelper Attributes Reference

| Attribute | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `value` | `IEnumerable<T>` | `null` | Collection data source |
| `layout` | `grid | list` | `list` | Active presentation layout |
| `paginator` | `bool` | `false` | Enable pagination |

---

## 🎨 3. Client & Event Interactivity

You can attach LaughTale declarative directives or client event handlers to `<island-dataview />`:

```razor
<island-dataview hydrate="Visible" />
```
