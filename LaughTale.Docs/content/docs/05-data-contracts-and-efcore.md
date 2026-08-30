---
title: "Data Contracts & EF Core Translation"
description: "Enterprise server-side data contracts (IslandDataRequest -> IslandDataResult<T>) with safe LINQ and Entity Framework Core translation."
order: 5
section: "Core Concepts"
---

# Data Contracts & EF Core Translation

Enterprise data grids and tables frequently deal with tens or hundreds of thousands of records. Shipping entire datasets to the client browser is inefficient and degrades performance.

LaughTale provides a strongly-typed data contract (`IslandDataRequest` → `IslandDataResult<T>`) with built-in **Entity Framework Core and LINQ extensions** to perform sorting, multi-field filtering, search, and pagination directly at the database layer.

---

## 📋 The Data Models

### 1. `IslandDataRequest`
Received from the client data grid during paging, sorting, or filtering:

```csharp
public class IslandDataRequest
{
    public int First { get; set; } = 0;
    public int Rows { get; set; } = 10;
    public string? SortField { get; set; }
    public int SortOrder { get; set; } = 1; // 1 = Ascending, -1 = Descending
    public string? GlobalFilter { get; set; }
    public Dictionary<string, FilterMetadata>? Filters { get; set; }
}
```

### 2. `IslandDataResult<T>`
Returned by your server endpoint to the grid:

```csharp
public class IslandDataResult<T>
{
    public List<T> Data { get; set; } = new();
    public int TotalRecords { get; set; }
}
```

---

## ⚡ Safe LINQ & EF Core Query Translation

LaughTale provides the `.ToIslandDataResultAsync()` extension method that applies database-level translation safely:

```csharp
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using LaughTale.Core.Data;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly AppDbContext _db;

    public UsersController(AppDbContext db) => _db = db;

    [HttpPost("query")]
    public async Task<ActionResult<IslandDataResult<UserDto>>> QueryUsers([FromBody] IslandDataRequest request)
    {
        // Whitelist allowed sort fields to prevent SQL injection or property reflection leaks
        var allowedFields = new[] { "Id", "FullName", "Email", "Department", "CreatedAt" };

        var result = await _db.Users
            .AsNoTracking()
            .Select(u => new UserDto(u.Id, u.FullName, u.Email, u.Department, u.CreatedAt))
            .ToIslandDataResultAsync(request, allowedFields);

        return Ok(result);
    }
}
```

---

## 🎮 Connecting to `<island-datatable>`

Wire your C# Razor view to use server-side lazy loading:

```razor
<island-datatable lazy="true" 
                  data-url="/api/users/query" 
                  paginator="true" 
                  rows="15" 
                  rows-per-page-options="new[] { 15, 30, 50, 100 }"
                  sortable="true">
</island-datatable>
```
