---
title: OrderList Component
description: Reorderable list control with drag-and-drop and up/down movement controls.
order: 40
icon: list-ordered
category: Form Controls
---

# OrderList Component
<div class="docs-live-sample" style="background: var(--p-surface-50); border: 1px solid var(--p-border-color); border-radius: 12px; padding: 1.5rem; margin-bottom: 2rem;">
    <div style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--p-primary-600); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.4rem;">
        <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: var(--p-primary-500); box-shadow: 0 0 8px var(--p-primary-500);"></span>
        Live Interactive Preview
    </div>
    <div style="max-width: 320px;">
        <div data-island="orderlist" data-props='{"value": [{"label": "1. Initialize AST Sandbox"}, {"label": "2. Verify Dual-Layer Auth"}, {"label": "3. Morph DOM In-Place"}]}' data-hydrate="load"></div>
    </div>
</div>


`<island-orderlist />` is an accessible, high-performance Aura component built for ASP.NET Core with server-side rendering (SSR), progressive hydration, and Dark Mode awareness.

---

## ⚡ 1. Basic Usage

```razor
<island-orderlist value="@Model.PriorityList" header="Priority Queue" />
```

---

## 📋 2. TagHelper Attributes Reference

| Attribute | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `value` | `List<T>` | `null` | List items to reorder |
| `header` | `string` | `null` | List header title |

---

## 🎨 3. Client & Event Interactivity

You can attach LaughTale declarative directives or client event handlers to `<island-orderlist />`:

```razor
<island-orderlist hydrate="Visible" />
```
