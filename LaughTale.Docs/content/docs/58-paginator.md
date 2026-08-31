---
title: Paginator Component
description: Standalone pagination control with page jump, page size dropdown, and total count text.
order: 40
icon: skip-forward
category: Data & Trees
---

# Paginator Component
<div class="docs-live-sample" style="background: var(--p-surface-50); border: 1px solid var(--p-border-color); border-radius: 12px; padding: 1.5rem; margin-bottom: 2rem;">
    <div style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--p-primary-600); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.4rem;">
        <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: var(--p-primary-500); box-shadow: 0 0 8px var(--p-primary-500);"></span>
        Live Interactive Preview
    </div>
    <div data-island="paginator" data-props='{"rows": 10, "totalRecords": 120, "first": 0}' data-hydrate="load"></div>
</div>


`<island-paginator />` is an accessible, high-performance Aura component built for ASP.NET Core with server-side rendering (SSR), progressive hydration, and Dark Mode awareness.

---

## ⚡ 1. Basic Usage

```razor
<island-paginator rows="10" total-records="120" rows-per-page-options="[10,20,50]" />
```

---

## 📋 2. TagHelper Attributes Reference

| Attribute | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `total-records` | `int` | `0` | Total number of items in dataset |
| `rows` | `int` | `10` | Items per page |
| `first` | `int` | `0` | Zero-based index of first item |

---

## 🎨 3. Client & Event Interactivity

You can attach LaughTale declarative directives or client event handlers to `<island-paginator />`:

```razor
<island-paginator hydrate="Visible" />
```
