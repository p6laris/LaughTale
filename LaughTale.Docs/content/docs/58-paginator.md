---
title: Paginator Component
description: Standalone pagination control with page jump, page size dropdown, and total count text.
order: 40
icon: skip-forward
category: Data & Trees
---

# Paginator Component

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
