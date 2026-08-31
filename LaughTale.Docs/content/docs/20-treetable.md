---
title: TreeTable Component
description: Hierarchical tree grid with recursive node expansion, sorting, and multi-selection.
order: 40
icon: git-merge
category: Data & Trees
---

# TreeTable Component

`<island-treetable />` is an accessible, high-performance Aura component built for ASP.NET Core with server-side rendering (SSR), progressive hydration, and Dark Mode awareness.

---

## ⚡ 1. Basic Usage

```razor
<island-treetable value="@Model.RootNodes" selection-mode="checkbox" />
```

---

## 📋 2. TagHelper Attributes Reference

| Attribute | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `value` | `List<TreeNode<T>>` | `null` | Hierarchical node collection |
| `selection-mode` | `single | multiple | checkbox` | `null` | Node selection mode |
| `paginator` | `bool` | `false` | Enable tree pagination |

---

## 🎨 3. Client & Event Interactivity

You can attach LaughTale declarative directives or client event handlers to `<island-treetable />`:

```razor
<island-treetable hydrate="Visible" />
```
