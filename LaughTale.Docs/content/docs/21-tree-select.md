---
title: TreeSelect Component
description: Dropdown selector with nested tree hierarchy, search filtering, and checkbox selection.
order: 40
icon: folder
category: Form Controls
---

# TreeSelect Component
<div class="docs-live-sample" style="background: var(--p-surface-50); border: 1px solid var(--p-border-color); border-radius: 12px; padding: 1.5rem; margin-bottom: 2rem;">
    <div style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--p-primary-600); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.4rem;">
        <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: var(--p-primary-500); box-shadow: 0 0 8px var(--p-primary-500);"></span>
        Live Interactive Preview
    </div>
    <div style="max-width: 320px;">
        <div data-island="tree-select" data-props='{"placeholder": "Select a node...", "options": [{"key": "0", "label": "Workspace", "data": "ws", "icon": "folder", "children": [{"key": "0-0", "label": "Source Code", "data": "src", "icon": "folder"}, {"key": "0-1", "label": "Documentation", "data": "docs", "icon": "file"}]}]}' data-hydrate="load"></div>
    </div>
</div>


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
