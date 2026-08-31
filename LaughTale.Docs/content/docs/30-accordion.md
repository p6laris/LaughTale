---
title: Accordion Component
description: Expandable accordion panel groups with single/multiple expansion and lazy rendering.
order: 40
icon: layers
category: Navigation
---

# Accordion Component

`<island-accordion />` is an accessible, high-performance Aura component built for ASP.NET Core with server-side rendering (SSR), progressive hydration, and Dark Mode awareness.

---

## ⚡ 1. Basic Usage

```razor
<island-accordion value="0" multiple="false">
    <div slot="tab-0" header="General Settings">Panel content...</div>
</island-accordion>
```

---

## 📋 2. TagHelper Attributes Reference

| Attribute | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `value` | `int | int[]` | `0` | Active tab index or array |
| `multiple` | `bool` | `false` | Allow multiple panels expanded |

---

## 🎨 3. Client & Event Interactivity

You can attach LaughTale declarative directives or client event handlers to `<island-accordion />`:

```razor
<island-accordion hydrate="Visible" />
```
