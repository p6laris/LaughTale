---
title: "DataTable Suite"
description: "Enterprise Aura data table with server-side LINQ pagination, multi-column sorting, row filtering, frozen columns, selection, and CSV export."
order: 19
section: "Data & Tables"
---

# DataTable Suite

DataTable is an enterprise-grade tabular data presentation component built to handle massive datasets with client-side or server-side sorting, filtering, selection modes, frozen columns, row expansion, and export tools.

---

## 🎮 Interactive Live Demos

### 1. Basic Table with Sorting & Paginator

```razor
@page
@model ProductsPageModel

<island-datatable value="@Model.Products" 
                  columns="@Model.Columns" 
                  sortable="true" 
                  paginator="true" 
                  rows="5" 
                  rows-per-page-options="new[] { 5, 10, 20, 50 }" 
                  striped-rows="true"
                  show-gridlines="true" />
```

---

### 2. Server-Side Lazy Loading with Entity Framework Core (100k+ Rows)

When `lazy="true"` is set, sorting, filtering, and paging requests are automatically delegated to your backend API using `IslandDataRequest` → `IslandDataResult<T>`:

```razor
<island-datatable lazy="true" 
                  data-url="/api/products/query" 
                  columns="@Model.Columns" 
                  sortable="true" 
                  paginator="true" 
                  rows="15" 
                  rows-per-page-options="new[] { 15, 30, 50, 100 }" />
```

#### Backend C# Controller:
```csharp
[HttpPost("/api/products/query")]
public async Task<ActionResult<IslandDataResult<ProductDto>>> QueryProducts([FromBody] IslandDataRequest request)
{
    var allowedFields = new[] { "Id", "Name", "Category", "Price", "Stock", "CreatedAt" };

    var result = await _dbContext.Products
        .AsNoTracking()
        .Select(p => new ProductDto(p.Id, p.Name, p.Category, p.Price, p.Stock, p.CreatedAt))
        .ToIslandDataResultAsync(request, allowedFields);

    return Ok(result);
}
```

---

### 3. Selection Modes (Single, Multiple & Checkbox)

```razor
<!-- Checkbox Multi-Row Selection -->
<island-datatable value="@Model.Products" 
                  columns="@Model.Columns" 
                  selection-mode="checkbox" 
                  selection="@Model.SelectedProducts" />
```

---

## ⚙️ C# TagHelper Attributes & API

| Attribute | Type | Default | Description |
|---|---|---|---|
| `value` | `IEnumerable<T>` | `null` | In-memory collection of data records to display. |
| `columns` | `List<DataTableColumn>` | `null` | Column definitions including header, field, sortable, and width. |
| `lazy` | `bool` | `false` | Enables server-side on-demand query fetching. |
| `data-url` | `string` | `null` | Endpoint URL for server-side `IslandDataRequest` queries. |
| `paginator` | `bool` | `false` | Enables paginator bar at bottom of table. |
| `rows` | `int` | `10` | Default number of records per page. |
| `rows-per-page-options` | `int[]` | `[10, 20, 50]` | Dropdown options for user page sizing. |
| `selection-mode` | `string` | `null` | `"single"`, `"multiple"`, or `"checkbox"`. |
| `sortable` | `bool` | `false` | Enables header clicking for multi-state column sorting. |
| `striped-rows` | `bool` | `false` | Alternates background row coloring for improved legibility. |
| `show-gridlines` | `bool` | `false` | Displays vertical column gridlines. |
| `scrollable` | `bool` | `false` | Enables vertical scrolling within container. |
| `scroll-height` | `string` | `null` | Maximum viewport height for scrollable table (e.g. `"400px"`). |
| `export-filename` | `string` | `null` | Enables CSV export button with given filename. |

---

## 🧩 Addressable Parts (`data-part` & `pt`)

Customize individual sub-elements using CSS or the Theme Studio:

| Part Name | Target Element | Description |
|---|---|---|
| `root` | `.p-datatable` | Outermost container wrapper. |
| `table` | `.p-datatable-table` | The HTML `<table>` element. |
| `thead` | `.p-datatable-thead` | Table header row group. |
| `header-cell` | `.p-datatable-header-cell` | Individual `<th>` column cell. |
| `tbody` | `.p-datatable-tbody` | Table body row group. |
| `row` | `.p-datatable-row` | Individual `<tr>` data row. |
| `cell` | `.p-datatable-cell` | Individual `<td>` data cell. |
| `paginator` | `.p-paginator` | Built-in pagination controls bar. |

---

## ♿ Accessibility & Keyboard Support

| Key | Function |
|---|---|
| <kbd>Tab</kbd> | Navigates between focusable headers, sorting buttons, and page links. |
| <kbd>Enter</kbd> / <kbd>Space</kbd> | Toggles column sorting or toggles checkbox selection on the active row. |
| <kbd>Arrow Up</kbd> / <kbd>Arrow Down</kbd> | Moves active row focus up and down. |
| <kbd>Home</kbd> / <kbd>End</kbd> | Jumps to the first or last row in the current page. |
