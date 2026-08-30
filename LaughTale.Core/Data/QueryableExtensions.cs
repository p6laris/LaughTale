using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Reflection;

namespace LaughTale.Core.Data;

/// <summary>
/// LINQ and EF Core translatable query extensions for LaughTale server-side data components (LT-1508).
/// </summary>
public static class QueryableExtensions
{
    /// <summary>
    /// Applies server-side sorting, filtering, and paging to an IQueryable source using safe Expression Trees.
    /// </summary>
    public static IslandDataResult<T> ToIslandDataResult<T>(
        this IQueryable<T> query,
        IslandDataRequest request,
        IReadOnlySet<string>? allowedFields = null)
    {
        ArgumentNullException.ThrowIfNull(query);
        ArgumentNullException.ThrowIfNull(request);

        var entityType = typeof(T);
        var properties = entityType.GetProperties(BindingFlags.Public | BindingFlags.Instance)
                                   .ToDictionary(p => p.Name, p => p, StringComparer.OrdinalIgnoreCase);

        // 1. Apply Filters
        if (request.Filter is { Count: > 0 })
        {
            foreach (var filter in request.Filter)
            {
                if (string.IsNullOrWhiteSpace(filter.Field) || string.IsNullOrWhiteSpace(filter.Value))
                    continue;

                if (allowedFields != null && !allowedFields.Contains(filter.Field, StringComparer.OrdinalIgnoreCase))
                    continue;

                if (!properties.TryGetValue(filter.Field, out var prop))
                    continue;

                query = ApplyFilter(query, prop, filter.Operator, filter.Value);
            }
        }

        // 2. Compute Total Count after filtering
        int totalCount = query.Count();

        // 3. Apply Sorting
        if (request.Sort is { Count: > 0 })
        {
            bool isFirstSort = true;
            foreach (var sort in request.Sort)
            {
                if (string.IsNullOrWhiteSpace(sort.Field))
                    continue;

                if (allowedFields != null && !allowedFields.Contains(sort.Field, StringComparer.OrdinalIgnoreCase))
                    continue;

                if (!properties.TryGetValue(sort.Field, out var prop))
                    continue;

                query = ApplySort(query, prop, sort.Descending, isFirstSort);
                isFirstSort = false;
            }
        }

        // 4. Apply Paging (Skip / Take)
        int page = Math.Max(1, request.Page);
        int pageSize = Math.Clamp(request.PageSize, 1, 1000);
        int skip = (page - 1) * pageSize;

        var items = query.Skip(skip).Take(pageSize).ToList();

        return new IslandDataResult<T>(items, totalCount, page, pageSize);
    }

    private static IQueryable<T> ApplySort<T>(IQueryable<T> source, PropertyInfo prop, bool descending, bool isFirst)
    {
        var parameter = Expression.Parameter(typeof(T), "x");
        var propertyAccess = Expression.Property(parameter, prop);
        var lambda = Expression.Lambda(propertyAccess, parameter);

        string methodName;
        if (isFirst)
        {
            methodName = descending ? "OrderByDescending" : "OrderBy";
        }
        else
        {
            methodName = descending ? "ThenByDescending" : "ThenBy";
        }

        var resultExpression = Expression.Call(
            typeof(Queryable),
            methodName,
            new[] { typeof(T), prop.PropertyType },
            source.Expression,
            Expression.Quote(lambda));

        return source.Provider.CreateQuery<T>(resultExpression);
    }

    private static IQueryable<T> ApplyFilter<T>(IQueryable<T> source, PropertyInfo prop, string op, string rawValue)
    {
        var parameter = Expression.Parameter(typeof(T), "x");
        var propertyAccess = Expression.Property(parameter, prop);

        object? convertedValue;
        try
        {
            var targetType = Nullable.GetUnderlyingType(prop.PropertyType) ?? prop.PropertyType;
            convertedValue = Convert.ChangeType(rawValue, targetType);
        }
        catch
        {
            return source; // Skip unparseable filter values safely
        }

        Expression constant = Expression.Constant(convertedValue, prop.PropertyType);
        Expression comparison;

        switch (op.ToLowerInvariant())
        {
            case "contains" when prop.PropertyType == typeof(string):
                var containsMethod = typeof(string).GetMethod("Contains", new[] { typeof(string) })!;
                comparison = Expression.Call(propertyAccess, containsMethod, constant);
                break;
            case "startswith" when prop.PropertyType == typeof(string):
                var startsMethod = typeof(string).GetMethod("StartsWith", new[] { typeof(string) })!;
                comparison = Expression.Call(propertyAccess, startsMethod, constant);
                break;
            case "gt":
                comparison = Expression.GreaterThan(propertyAccess, constant);
                break;
            case "gte":
                comparison = Expression.GreaterThanOrEqual(propertyAccess, constant);
                break;
            case "lt":
                comparison = Expression.LessThan(propertyAccess, constant);
                break;
            case "lte":
                comparison = Expression.LessThanOrEqual(propertyAccess, constant);
                break;
            case "equals":
            default:
                comparison = Expression.Equal(propertyAccess, constant);
                break;
        }

        var lambda = Expression.Lambda<Func<T, bool>>(comparison, parameter);
        return source.Where(lambda);
    }
}
