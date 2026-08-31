---
title: Server-Side Data Contracts & EF Core
description: Enterprise server-side pagination, multi-column sorting, deep filtering, and global search with EF Core translatable Expression Trees and lazy client hydration.
order: 5
icon: database
category: Framework Architecture
---

# Server-Side Data Contracts & EF Core

When working with large datasets (10,000 to 1,000,000+ rows), client-side in-memory filtering and pagination becomes impractical. LaughTale provides a unified **Server-Side Data Contract** that connects client data grids (`<island-datatable />`, `<island-dataview />`, `<island-treetable />`) directly to **Entity Framework Core** and `IQueryable<T>` data sources.

---

## 1. Architecture Overview

```
Browser Island (Client)                    ASP.NET Core Server (EF Core)
┌─────────────────────────┐               ┌─────────────────────────────────┐
│ <island-datatable       │  HTTP POST    │ app.MapIslandData<Order>(...)   │
│   lazy="true"           │ ────────────> │                                 │
│   lazy-url="/api/data"  │ IslandData    │ query.ToIslandDataResult(req)   │
│ />                      │ Request JSON  │   ↓ Expression Trees (SQL)      │
│                         │ <──────────── │   ↓ Skip / Take / Where / Order │
│ (Renders Page Slice)    │ IslandData    │ Return IslandDataResult<Order>  │
└─────────────────────────┘ Result JSON   └─────────────────────────────────┘
```

---

## 2. The Server-Side Data Contract

### `IslandDataRequest`
Encapsulates pagination, sorting, column filtering, and multi-column global search:

```csharp
public sealed class IslandDataRequest
{
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 10;
    public int? First { get; set; } // 0-based offset
    public int? Rows { get; set; }  // PageSize alias
    public string? SortField { get; set; }
    public int? SortOrder { get; set; } // 1 = Ascending, -1 = Descending
    public List<IslandSortDescriptor> Sort { get; set; } = new();
    public List<IslandFilterDescriptor> Filter { get; set; } = new();
    public Dictionary<string, IslandFilterValue>? Filters { get; set; }
    public string? GlobalSearch { get; set; }
    public List<string>? GlobalFilterFields { get; set; }
}
```

### `IslandDataResult<T>`
Returns only the requested slice along with metadata:

```csharp
public sealed record IslandDataResult<T>(
    IReadOnlyList<T> Items,
    int TotalCount,
    int Page,
    int PageSize
)
{
    public int TotalPages => (int)Math.Ceiling((double)TotalCount / Math.Max(1, PageSize));
    public IReadOnlyList<T> Data => Items;
    public int TotalRecords => TotalCount;
}
```

---

## 3. EF Core Translatable Query Extensions

LaughTale compiles dynamic, SQL-translatable **C# Expression Trees** for your query:

```csharp
using LaughTale.Core.Data;

// In a Minimal API, Controller, or Razor Page:
public async Task<IslandDataResult<Order>> GetOrders(IslandDataRequest request)
{
    return await _dbContext.Orders
        .AsNoTracking()
        .ToIslandDataResultAsync(request);
}
```

### Supported Filter Operators:
- **String**: `contains`, `notContains`, `startsWith`, `endsWith`, `equals`, `notEquals`
- **Numeric**: `gt` (`>`), `gte` (`>=`), `lt` (`<`), `lte` (`<=`), `equals`
- **Date**: `dateIs`, `dateIsNot`, `dateBefore`, `dateAfter`

---

## 4. Minimal API Endpoint Helper

Map a complete server-side data endpoint with a single line of code:

```csharp
// Program.cs
using LaughTale.Core.Endpoints;

app.MapIslandData<Customer>(
    "/api/customers/data", 
    async (HttpContext ctx) =>
    {
        var db = ctx.RequestServices.GetRequiredService<AppDbContext>();
        return db.Customers.Where(c => c.IsActive);
    }
);
```

---

## 5. Security & Injection Protection

Field names sent from browser clients are never concatenated into SQL or dynamic query strings. LaughTale strictly inspects properties via reflection and can enforce an explicit allowlist:

```csharp
var allowedColumns = new HashSet<string>(StringComparer.OrdinalIgnoreCase) 
{ 
    "Name", "Email", "City", "Balance", "CreatedAt" 
};

var result = query.ToIslandDataResult(request, allowedFields: allowedColumns);
```

---

## 6. Client Island Integration in Razor

Enable `lazy="true"` on your data components:

```razor
<island-datatable lazy="true" 
                  lazy-url="/api/customers/data" 
                  paginator="true" 
                  rows="10" 
                  rows-per-page-options="[10, 25, 50, 100]" 
                  filter-display="row"
                  show-gridlines="true">
</island-datatable>
```

When users paginate, sort columns, or type in filters, the grid automatically sends an AJAX request with anti-forgery tokens, displays loading skeletons, and renders the server-filtered slice instantly.
