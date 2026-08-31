---
title: TreeSelect Component
description: Dropdown selector with nested tree hierarchy, search filtering, and checkbox selection.
order: 40
icon: folder
category: Form Controls
---

# TreeSelect Component

`<island-tree-select />` is an accessible, high-performance Aura component built for ASP.NET Core with server-side rendering (SSR), progressive hydration, and Dark Mode awareness.

---

## ⚡ 1. Basic Usage

```razor
<island-tree-select name="DepartmentId" options="@Model.TreeData" selection-mode="checkbox" />
```

---

## 📋 2. TagHelper Attributes Reference

| Attribute | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `name` | `string` | `null` | Form field name |
| `options` | `List<TreeNode<T>>` | `null` | Hierarchical tree options |
| `filter` | `bool` | `false` | Enable search filter |

---

## 🎨 3. Client & Event Interactivity

You can attach LaughTale declarative directives or client event handlers to `<island-tree-select />`:

```razor
<island-tree-select hydrate="Visible" />
```
