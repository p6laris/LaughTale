---
title: DataTable Component
description: High-performance data table supporting server-side lazy loading, multi-column sorting, row filtering, pagination, selection, and export.
order: 20
icon: table
category: Data & Trees
---

# 📊 DataTable Component



<div class="docs-live-sample" style="background: var(--p-surface-50); border: 1px solid var(--p-border-color); border-radius: 12px; padding: 1.5rem; margin-bottom: 2rem;">
    <div style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--p-primary-600); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.4rem;">
        <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: var(--p-primary-500); box-shadow: 0 0 8px var(--p-primary-500);"></span>
        Live Interactive Preview
    </div>
    <div data-island="datatable" data-props='{"value": [{"id": 101, "customer": "Alice Morgan", "product": "MacBook Pro M3", "amount": 2499.00, "status": "Completed"}, {"id": 102, "customer": "Braden Vance", "product": "UltraWide Monitor", "amount": 1199.50, "status": "Processing"}, {"id": 103, "customer": "Darya Karimi", "product": "Mechanical Keyboard", "amount": 189.00, "status": "Shipped"}], "paginator": true, "rows": 5, "stripedRows": true, "showGridlines": true}' data-hydrate="load"></div>
</div>

`<island-datatable />` is LaughTale's flagship data grid component. It is built to effortlessly handle everything from small 5-row tables up to **100,000+ row datasets** with sub-15ms client hydration and EF Core server-side pagination.

---

## ⚡ 1. Basic In-Memory Grid

Pass any C# collection or list to the `value` attribute:

```razor
<island-datatable value="@Model.Orders" 
                  paginator="true" 
                  rows="10" 
                  striped-rows="true" 
                  show-gridlines="true">
</island-datatable>
```

In your PageModel:
```csharp
public record Order(int Id, string Customer, string Product, decimal Amount, string Status);

public List<Order> Orders { get; set; } = new();

public void OnGet()
{
    Orders = new()
    {
        new(101, "Alice Morgan", "MacBook Pro M3", 2499.00m, "Completed"),
        new(102, "Braden Vance", "UltraWide 49\" Monitor", 1199.50m, "Processing"),
        new(103, "Darya Karimi", "Mechanical Keyboard", 189.00m, "Shipped")
    };
}
```

---

## 🚀 2. Server-Side Lazy Loading (100,000+ Rows)

For large databases, enable `lazy="true"` and provide the `lazy-url`:

```razor
<island-datatable lazy="true" 
                  lazy-url="/api/orders/data" 
                  paginator="true" 
                  rows="25" 
                  rows-per-page-options="[10, 25, 50, 100]" 
                  sort-mode="multiple" 
                  filter-display="row" 
                  hydrate="Visible">
</island-datatable>
```

In your `Program.cs`:
```csharp
app.MapIslandData<Order>("/api/orders/data", db => db.Orders);
```

The grid will automatically query the server with `IslandDataRequest` and render paginated slices without loading all records into browser memory.

---

## 📋 3. TagHelper Attributes Reference

| Attribute | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `value` | `IEnumerable<T>` | `null` | In-memory dataset to display |
| `lazy` | `bool` | `false` | Enable server-side data contract mode |
| `lazy-url` | `string` | `null` | API endpoint URL for server queries |
| `paginator` | `bool` | `false` | Enable pagination controls |
| `rows` | `int` | `10` | Default rows per page |
| `rows-per-page-options` | `int[]` | `[5, 10, 20, 50]` | Dropdown options for page size |
| `sort-mode` | `single \| multiple` | `single` | Single or multi-column sort |
| `filter-display` | `row \| menu` | `row` | Display filter inputs in headers |
| `striped-rows` | `bool` | `false` | Alternating row background stripes |
| `show-gridlines` | `bool` | `false` | Visible cell border gridlines |
| `selection-mode` | `single \| multiple` | `null` | Row selection behavior |
| `export-filename` | `string` | `export` | Filename when exporting to CSV |
