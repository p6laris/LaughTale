---
title: DataView Component
description: Versatile layout switcher displaying datasets in grid cards or detailed list rows with built-in paginator.
order: 40
icon: grid
category: Data & Trees
---

# DataView Component

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
