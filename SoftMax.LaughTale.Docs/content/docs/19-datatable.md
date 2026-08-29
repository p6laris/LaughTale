---
title: "DataTable Suite"
description: "Enterprise PrimeVue 4 Aura data table with sorting, multi-field filtering, pagination, frozen columns, row expansion, selection, and CSV export"
order: 19
section: "Data & Tables"
---

# DataTable

DataTable is a high-performance tabular data presentation component built to handle massive datasets with sorting, filtering, selection modes, frozen columns, expandable sub-rows, and export tools.

---

## 🎮 Interactive Live Demos

### 1. Basic Table

Standard grid rendering with custom column formatting and responsive layout.

```razor
<island-datatable value="@Model.Products" columns="@Model.Columns" />
```

---

### 2. Sorting & Multi-Column Sorting

Click column headers to toggle ascending, descending, or neutral sort states.

```razor
<island-datatable value="@Model.Products" columns="@Model.Columns" sortable="true" />
```

---

### 3. Paginator & Page Sizing

Built-in paginator with dynamic page sizing and item range indicators.

```razor
<island-datatable value="@Model.Products" columns="@Model.Columns" paginator="true" rows="5" rows-per-page-options="new[] { 5, 10, 20, 50 }" />
```

---

### 4. Selection Modes (Single, Multiple & Checkbox)

Row selection with single-click highlight or dedicated multi-row checkbox columns.

```razor
<island-datatable value="@Model.Products" columns="@Model.Columns" selection-mode="checkbox" />
```

---

## ⚙️ Properties & API

| Attribute | Type | Default | Description |
|---|---|---|---|
| `value` | `IEnumerable<T>` | `null` | Collection of data records to display. |
| `columns` | `List<DataTableColumn>` | `null` | Column definitions including header, field, and formatting. |
| `paginator` | `bool` | `false` | Enables built-in pagination controls. |
| `rows` | `int` | `10` | Default number of records per page. |
| `selection-mode` | `string` | `null` | `"single"`, `"multiple"`, or `"checkbox"`. |
| `striped-rows` | `bool` | `false` | Alternates background row coloring. |
| `show-gridlines` | `bool` | `false` | Displays vertical column gridlines. |
| `export-filename` | `string` | `null` | Enables CSV export button with given filename. |
