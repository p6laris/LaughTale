---
title: "Listbox Selector"
description: "Single and multi-select listbox component with filtering, grouping, and custom item templates"
order: 54
section: "Data & Tables"
---

# Listbox

Listbox displays a scrollable list of options allowing single or multiple selections with live search filtering.

---

## 🎮 Interactive Live Demos

### 1. Filterable Multi-Select Listbox

```razor
<island-listbox options="@Model.Cities" multiple="true" filter="true" />
```

---

## ⚙️ Properties & API

| Attribute | Type | Default | Description |
|---|---|---|---|
| `options` | `IEnumerable<T>` | `null` | Collection of options. |
| `multiple` | `bool` | `false` | Enables multiple item selection. |
| `filter` | `bool` | `false` | Enables live search filter input. |
