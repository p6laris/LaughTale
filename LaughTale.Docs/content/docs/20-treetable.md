---
title: "TreeTable Suite"
description: "Hierarchical data table component for multi-level nested structures with sorting, filtering, pagination, selection, and frozen columns"
order: 20
section: "Data & Tables"
---

# TreeTable

TreeTable displays hierarchical data in a tabular layout with collapsible branch nodes, multi-column data projection, deep filtering, checkbox selection, and responsive column resizing.

---

## 🎮 Interactive Live Demos

### 1. Basic Hierarchical TreeTable

Expand and collapse nested directory trees with instant child node reveal.

```razor
<island-treetable value="@Model.Files" columns="@Model.Columns" />
```

---

### 2. Checkbox Multi-Selection with Propagation

Selecting a parent directory cascades through all recursive children.

```razor
<island-treetable value="@Model.Files" columns="@Model.Columns" selection-mode="checkbox" />
```

---

### 3. Paginator & Sorting

Page through top-level root nodes while maintaining deep child hierarchy expand states.

```razor
<island-treetable value="@Model.Files" columns="@Model.Columns" paginator="true" rows="3" sortable="true" />
```

---

## ⚙️ Properties & API

| Attribute | Type | Default | Description |
|---|---|---|---|
| `value` | `List<TreeNode>` | `null` | Hierarchical tree node collection. |
| `columns` | `List<TreeTableColumn>` | `null` | Column definitions. |
| `selection-mode` | `string` | `null` | `"single"`, `"multiple"`, or `"checkbox"`. |
| `paginator` | `bool` | `false` | Enables pagination on root nodes. |
| `resizable-columns` | `bool` | `false` | Allows dragging column borders to resize widths. |
