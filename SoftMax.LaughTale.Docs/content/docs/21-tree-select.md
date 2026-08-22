---
title: "Hierarchical TreeSelect"
description: "Searchable multi-level organizational and category tree selector"
order: 21
section: "Data & Structure"
---

# Hierarchical TreeSelect

The `<island-tree-select />` TagHelper provides a searchable hierarchical tree dropdown for multi-level departments, categories, and organizational structures.

---

## 🎮 Interactive Live Demo

<div style="background: var(--p-surface-50); border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius-lg); padding: 1.5rem; margin: 1.5rem 0;">
    <div style="font-size: 0.75rem; font-weight: 700; color: var(--p-primary-600); text-transform: uppercase; margin-bottom: 0.75rem;">Live Hierarchical Tree Dropdown (Click to expand &amp; select)</div>
    <island name="tree-select" props-json='{"placeholder": "Search divisions...", "nodes": [{"id": "1", "name": "Executive Command", "code": "HQ", "children": [{"id": "1-1", "name": "Strategic Governance", "code": "HQ-01"}, {"id": "1-2", "name": "Global Compliance", "code": "HQ-02"}]}, {"id": "2", "name": "Engineering Division", "code": "ENG", "children": [{"id": "2-1", "name": "Kernel Infrastructure", "code": "ENG-01"}, {"id": "2-2", "name": "Security & Cryptography", "code": "ENG-02"}]}]}' hydrate="Load"></island>
</div>

---

## 🚀 Basic Usage

```razor
@using SoftMax.LaughTale.Components.Models

@{
    var departments = new List<TreeNode>
    {
        new("1", "Executive Command", "HQ", new()
        {
            new("1-1", "Strategic Governance", "HQ-01"),
            new("1-2", "Global Compliance", "HQ-02")
        }),
        new("2", "Engineering Division", "ENG", new()
        {
            new("2-1", "Kernel Infrastructure", "ENG-01"),
            new("2-2", "Security & Cryptography", "ENG-02")
        })
    };
}

<island-tree-select nodes="@departments" 
                    target-input="DepartmentId" 
                    placeholder="Search division..." 
                    hydrate="Load" />
```

---

## 📋 TagHelper Attributes

| Attribute | Type | Default | Description |
|---|---|---|---|
| `nodes` | `List<TreeNode>` | `new()` | Recursive hierarchy of tree nodes with `Id`, `Name`, and `Children`. |
| `target-input` | `string?` | `null` | Form input name receiving the selected node ID. |
| `placeholder` | `string?` | `"Select..."` | Trigger input placeholder text. |
