---
title: PickList Component
description: Dual-list transfer control with directional transfer arrows, sorting, and RTL support.
order: 40
icon: arrow-right-left
category: Form Controls
---

# PickList Component
<div class="docs-live-sample" style="background: var(--p-surface-50); border: 1px solid var(--p-border-color); border-radius: 12px; padding: 1.5rem; margin-bottom: 2rem;">
    <div style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--p-primary-600); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.4rem;">
        <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: var(--p-primary-500); box-shadow: 0 0 8px var(--p-primary-500);"></span>
        Live Interactive Preview
    </div>
    <div data-island="picklist" data-props='{"source": [{"label": "React 19"}, {"label": "Vue 3"}, {"label": "Svelte 5"}], "target": [{"label": "ASP.NET Core 10"}]}' data-hydrate="load"></div>
</div>


`<island-picklist />` is an accessible, high-performance Aura component built for ASP.NET Core with server-side rendering (SSR), progressive hydration, and Dark Mode awareness.

---

## ⚡ 1. Basic Usage

```razor
<island-picklist source="@Model.Available" target="@Model.Selected" source-header="Available" target-header="Selected" />
```

---

## 📋 2. TagHelper Attributes Reference

| Attribute | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `source` | `List<T>` | `null` | Available items list |
| `target` | `List<T>` | `null` | Selected items list |
| `show-source-controls` | `bool` | `true` | Display reorder buttons |

---

## 🎨 3. Client & Event Interactivity

You can attach LaughTale declarative directives or client event handlers to `<island-picklist />`:

```razor
<island-picklist hydrate="Visible" />
```
