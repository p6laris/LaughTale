---
title: TreeTable Component
description: Hierarchical tree grid with recursive node expansion, sorting, and multi-selection.
order: 40
icon: git-merge
category: Data & Trees
---

# TreeTable Component
<div class="docs-live-sample" style="background: var(--p-surface-50); border: 1px solid var(--p-border-color); border-radius: 12px; padding: 1.5rem; margin-bottom: 2rem;">
    <div style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--p-primary-600); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.4rem;">
        <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: var(--p-primary-500); box-shadow: 0 0 8px var(--p-primary-500);"></span>
        Live Interactive Preview
    </div>
    <div data-island="treetable" data-props='{"value": [{"key": "0", "data": {"name": "Core Engine", "size": "1.2 MB", "type": "Folder"}, "children": [{"key": "0-0", "data": {"name": "LaughTale.Core.dll", "size": "340 KB", "type": "Assembly"}}, {"key": "0-1", "data": {"name": "Idiomorph.js", "size": "12 KB", "type": "Module"}}]}, {"key": "1", "data": {"name": "Components", "size": "2.8 MB", "type": "Folder"}, "children": [{"key": "1-0", "data": {"name": "LaughTale.Components.dll", "size": "890 KB", "type": "Assembly"}}]}]}' data-hydrate="load"></div>
</div>


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
