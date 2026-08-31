---
title: OrgChart Component
description: Interactive hierarchical organizational tree diagram with collapsible nodes.
order: 40
icon: git-pull-request
category: Data & Visualization
---

# OrgChart Component

`<island-orgchart />` is an accessible, high-performance Aura component built for ASP.NET Core with server-side rendering (SSR), progressive hydration, and Dark Mode awareness.

---

## ⚡ 1. Basic Usage

```razor
<island-orgchart value="@Model.OrganizationRoot" selection-mode="single" />
```

---

## 📋 2. TagHelper Attributes Reference

| Attribute | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `value` | `TreeNode<T>` | `null` | Root organization node |
| `collapsible` | `bool` | `true` | Allow collapsing children |

---

## 🎨 3. Client & Event Interactivity

You can attach LaughTale declarative directives or client event handlers to `<island-orgchart />`:

```razor
<island-orgchart hydrate="Visible" />
```
