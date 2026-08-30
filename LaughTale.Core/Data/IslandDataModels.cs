using System;
using System.Collections.Generic;

namespace LaughTale.Core.Data;

/// <summary>
/// Server-side data request model for DataTable, DataView, and TreeTable components (LT-1508).
/// </summary>
public sealed class IslandDataRequest
{
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 10;
    public List<IslandSortDescriptor> Sort { get; set; } = new();
    public List<IslandFilterDescriptor> Filter { get; set; } = new();
    public string? GlobalSearch { get; set; }
}

/// <summary>
/// Sort field and direction descriptor.
/// </summary>
public sealed class IslandSortDescriptor
{
    public string Field { get; set; } = string.Empty;
    public bool Descending { get; set; } = false;
}

/// <summary>
/// Column filtering criteria.
/// </summary>
public sealed class IslandFilterDescriptor
{
    public string Field { get; set; } = string.Empty;
    public string Operator { get; set; } = "equals"; // "equals", "contains", "startsWith", "endsWith", "gt", "lt", "gte", "lte"
    public string? Value { get; set; }
}

/// <summary>
/// Paginated data result returned to client data components.
/// </summary>
/// <typeparam name="T">The row data type.</typeparam>
public sealed record IslandDataResult<T>(
    IReadOnlyList<T> Items,
    int TotalCount,
    int Page,
    int PageSize
)
{
    public int TotalPages => (int)Math.Ceiling((double)TotalCount / Math.Max(1, PageSize));
}
