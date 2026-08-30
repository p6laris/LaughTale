---
title: "DataView Layout"
description: "Flexible data presentation component supporting both Grid (cards) and List views with built-in sorting and layout switcher"
order: 48
section: "Data & Tables"
---

# DataView

DataView displays data in either a multi-column card grid or a compact list layout, complete with header toolbars, sort dropdowns, and layout switchers.

---

## 🎮 Interactive Live Demos

### 1. Grid & List Layout Switcher

Switch dynamically between responsive product grid cards and detailed list rows.

```razor
<island-dataview value="@Model.Products" layout="grid" paginator="true" rows="6" />
```

---

## ⚙️ Properties & API

| Attribute | Type | Default | Description |
|---|---|---|---|
| `value` | `IEnumerable<T>` | `null` | Collection of data items. |
| `layout` | `string` | `"grid"` | Initial presentation layout (`"grid"` or `"list"`). |
| `paginator` | `bool` | `false` | Enables pagination controls. |
| `rows` | `int` | `6` | Number of items shown per page. |
