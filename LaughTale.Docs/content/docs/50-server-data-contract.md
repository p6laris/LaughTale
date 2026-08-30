---
title: "Server-Side Data Contract"
description: "High-performance paging, sorting, and filtering for 100,000+ row datasets"
order: 50
section: "Advanced Architecture"
---

# Server-Side Data Contract

When dealing with large datasets (10,000 to 1,000,000+ rows), sending all records to the browser is impractical. LaughTale provides a unified server-side data contract with safe, SQL-injection-proof LINQ expression tree extensions for EF Core.

---

## The Contract Models

### `IslandDataRequest`
Sent by the client grid to request a specific slice of data:

```csharp
public sealed class IslandDataRequest
{
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 10;
    public List<IslandSortDescriptor> Sort { get; set; } = new();
    public List<IslandFilterDescriptor> Filter { get; set; } = new();
    public string? GlobalSearch { get; set; }
}
```

### `IslandDataResult<T>`
Returned to the client grid:

```csharp
public sealed record IslandDataResult<T>(
    IReadOnlyList<T> Items,
    int TotalCount,
    int Page,
    int PageSize
);
```

---

## ⚡ Using in ASP.NET Core with EF Core

```csharp
app.MapPost("/api/customers/query", async (
    [FromBody] IslandDataRequest request, 
    AppDbContext db) =>
{
    // Define an allowlist of valid sort/filter column names to prevent injection
    var allowedFields = new HashSet<string> { "Name", "Email", "Balance", "CreatedAt" };

    // Translates directly into EF Core SQL queries (Skip, Take, OrderBy, Where):
    var result = db.Customers.ToIslandDataResult(request, allowedFields);

    return Results.Ok(result);
});
```

The `ToIslandDataResult()` extension ensures that query execution is 100% server-side with zero in-memory client evaluation.
