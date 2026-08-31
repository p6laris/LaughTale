using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace LaughTale.Core.Data;

/// <summary>
/// Server-side data request model for DataTable, DataView, and TreeTable components (LT-1508).
/// Fully compatible with standard PrimeVue / LaughTale client island payload formats.
/// </summary>
public sealed class IslandDataRequest
{
    /// <summary>
    /// Current 1-based page number. Defaults to 1.
    /// </summary>
    [JsonPropertyName("page")]
    public int Page { get; set; } = 1;

    /// <summary>
    /// Number of records per page. Defaults to 10.
    /// </summary>
    [JsonPropertyName("pageSize")]
    public int PageSize { get; set; } = 10;

    /// <summary>
    /// 0-based offset index (PrimeVue standard: first = (page - 1) * pageSize).
    /// </summary>
    [JsonPropertyName("first")]
    public int? First
    {
        get => (Page - 1) * PageSize;
        set
        {
            if (value.HasValue && PageSize > 0)
            {
                Page = (value.Value / PageSize) + 1;
            }
        }
    }

    /// <summary>
    /// Number of rows per page (PrimeVue alias for PageSize).
    /// </summary>
    [JsonPropertyName("rows")]
    public int? Rows
    {
        get => PageSize;
        set
        {
            if (value.HasValue && value.Value > 0)
            {
                PageSize = value.Value;
            }
        }
    }

    /// <summary>
    /// Single-column sort field.
    /// </summary>
    [JsonPropertyName("sortField")]
    public string? SortField { get; set; }

    /// <summary>
    /// Single-column sort order: 1 = Ascending, -1 = Descending.
    /// </summary>
    [JsonPropertyName("sortOrder")]
    public int? SortOrder { get; set; }

    /// <summary>
    /// Multi-column sorting specifications.
    /// </summary>
    [JsonPropertyName("sort")]
    public List<IslandSortDescriptor> Sort { get; set; } = new();

    /// <summary>
    /// Multi-column sorting specifications (PrimeVue alias: multiSortMeta).
    /// </summary>
    [JsonPropertyName("multiSortMeta")]
    public List<IslandSortDescriptor>? MultiSortMeta
    {
        get => Sort;
        set
        {
            if (value != null)
            {
                Sort = value;
            }
        }
    }

    /// <summary>
    /// Column filter list.
    /// </summary>
    [JsonPropertyName("filter")]
    public List<IslandFilterDescriptor> Filter { get; set; } = new();

    /// <summary>
    /// Column filter dictionary (PrimeVue format: { "name": { "value": "foo", "matchMode": "contains" } }).
    /// </summary>
    [JsonPropertyName("filters")]
    public Dictionary<string, IslandFilterValue>? Filters { get; set; }

    /// <summary>
    /// Global search term applied across all searchable columns.
    /// </summary>
    [JsonPropertyName("globalSearch")]
    public string? GlobalSearch { get; set; }

    /// <summary>
    /// Specific property names to include in global search. If null, applies to all string properties.
    /// </summary>
    [JsonPropertyName("globalFilterFields")]
    public List<string>? GlobalFilterFields { get; set; }

    /// <summary>
    /// Normalizes and returns effective sort descriptors consolidating single and multi-sort parameters.
    /// </summary>
    public List<IslandSortDescriptor> GetEffectiveSorts()
    {
        if (Sort is { Count: > 0 })
            return Sort;

        if (!string.IsNullOrWhiteSpace(SortField))
        {
            return new List<IslandSortDescriptor>
            {
                new()
                {
                    Field = SortField,
                    Descending = SortOrder.HasValue && SortOrder.Value < 0
                }
            };
        }

        return new List<IslandSortDescriptor>();
    }

    /// <summary>
    /// Normalizes and returns effective filter descriptors consolidating list and dictionary formats.
    /// </summary>
    public List<IslandFilterDescriptor> GetEffectiveFilters()
    {
        var result = new List<IslandFilterDescriptor>(Filter);

        if (Filters != null)
        {
            foreach (var (key, filterVal) in Filters)
            {
                if (string.Equals(key, "global", StringComparison.OrdinalIgnoreCase))
                {
                    if (!string.IsNullOrWhiteSpace(filterVal?.Value?.ToString()) && string.IsNullOrWhiteSpace(GlobalSearch))
                    {
                        GlobalSearch = filterVal.Value.ToString();
                    }
                    continue;
                }

                if (filterVal != null && filterVal.Value != null && !string.IsNullOrWhiteSpace(filterVal.Value.ToString()))
                {
                    result.Add(new IslandFilterDescriptor
                    {
                        Field = key,
                        Operator = filterVal.MatchMode ?? "contains",
                        Value = filterVal.Value.ToString()
                    });
                }
            }
        }

        return result;
    }
}

/// <summary>
/// Sort field and direction descriptor.
/// </summary>
public sealed class IslandSortDescriptor
{
    [JsonPropertyName("field")]
    public string Field { get; set; } = string.Empty;

    [JsonPropertyName("descending")]
    public bool Descending { get; set; } = false;

    /// <summary>
    /// Integer sort order (1 = Ascending, -1 = Descending).
    /// </summary>
    [JsonPropertyName("order")]
    public int Order
    {
        get => Descending ? -1 : 1;
        set => Descending = value < 0;
    }
}

/// <summary>
/// Column filtering criteria.
/// </summary>
public sealed class IslandFilterDescriptor
{
    [JsonPropertyName("field")]
    public string Field { get; set; } = string.Empty;

    [JsonPropertyName("operator")]
    public string Operator { get; set; } = "contains"; // "equals", "notEquals", "contains", "notContains", "startsWith", "endsWith", "gt", "gte", "lt", "lte", "dateIs", "dateIsNot", "dateBefore", "dateAfter"

    [JsonPropertyName("value")]
    public string? Value { get; set; }
}

/// <summary>
/// PrimeVue filter dictionary value structure.
/// </summary>
public sealed class IslandFilterValue
{
    [JsonPropertyName("value")]
    public object? Value { get; set; }

    [JsonPropertyName("matchMode")]
    public string? MatchMode { get; set; } = "contains";

    [JsonPropertyName("operator")]
    public string? Operator { get; set; } = "and";
}

/// <summary>
/// Paginated data result returned to client data components.
/// </summary>
/// <typeparam name="T">The row data type.</typeparam>
public sealed record IslandDataResult<T>(
    [property: JsonPropertyName("items")] IReadOnlyList<T> Items,
    [property: JsonPropertyName("totalCount")] int TotalCount,
    [property: JsonPropertyName("page")] int Page,
    [property: JsonPropertyName("pageSize")] int PageSize
)
{
    /// <summary>
    /// Total number of pages calculated from TotalCount and PageSize.
    /// </summary>
    [JsonPropertyName("totalPages")]
    public int TotalPages => (int)Math.Ceiling((double)TotalCount / Math.Max(1, PageSize));

    /// <summary>
    /// PrimeVue data alias for Items.
    /// </summary>
    [JsonPropertyName("data")]
    public IReadOnlyList<T> Data => Items;

    /// <summary>
    /// PrimeVue totalRecords alias for TotalCount.
    /// </summary>
    [JsonPropertyName("totalRecords")]
    public int TotalRecords => TotalCount;
}
