---
title: "OrderList Reordering"
description: "Interactive single-list reordering component with drag and button controls"
order: 56
section: "Data & Tables"
---

# OrderList

OrderList manages item ordering within a single list via action buttons (Move Top, Move Up, Move Down, Move Bottom) or drag-and-drop.

---

## 🎮 Interactive Live Demos

### 1. Priority Queue

```razor
<island-orderlist value="@Model.Tasks" header="Task Execution Queue" />
```

---

## ⚙️ Properties & API

| Attribute | Type | Default | Description |
|---|---|---|---|
| `value` | `IEnumerable<T>` | `null` | Collection of reorderable items. |
| `header` | `string` | `null` | List header title. |
