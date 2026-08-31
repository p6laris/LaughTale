---
title: OrgChart Component
description: Interactive hierarchical organizational tree diagram with collapsible nodes.
order: 40
icon: git-pull-request
category: Data & Visualization
---

# OrgChart Component
<div class="docs-live-sample" style="background: var(--p-surface-50); border: 1px solid var(--p-border-color); border-radius: 12px; padding: 1.5rem; margin-bottom: 2rem;">
    <div style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--p-primary-600); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.4rem;">
        <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: var(--p-primary-500); box-shadow: 0 0 8px var(--p-primary-500);"></span>
        Live Interactive Preview
    </div>
    <div data-island="orgchart" data-props='{"value": {"label": "Executive Committee", "children": [{"label": "Engineering"}, {"label": "Operations"}]}}' data-hydrate="load"></div>
</div>


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
