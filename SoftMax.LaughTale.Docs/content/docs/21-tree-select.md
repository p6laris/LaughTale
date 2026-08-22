---
title: "Hierarchical TreeSelect"
description: "Searchable multi-level organizational and category tree selector"
order: 21
section: "Data & Structure"
---

# Hierarchical TreeSelect

The `<island-tree-select />` TagHelper provides a searchable hierarchical tree dropdown for multi-level departments, categories, and organizational structures.

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
