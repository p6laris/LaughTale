using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Linq.Expressions;
using System.Reflection;
using System.Threading;
using System.Threading.Tasks;

namespace LaughTale.Core.Data;

/// <summary>
/// LINQ and EF Core translatable query extensions for LaughTale server-side data components.
/// Applies safe expression-tree filtering, global multi-column search, multi-sort, and pagination.
/// </summary>
public static class QueryableExtensions
{
    /// <summary>
    /// Applies server-side sorting, filtering, and paging to an IQueryable source using safe Expression Trees.
    /// </summary>
    public static IslandDataResult<T> ToIslandDataResult<T>(
        this IQueryable<T> query,
        IslandDataRequest request,
        IslandFieldPolicy fieldPolicy)
    {
        ArgumentNullException.ThrowIfNull(query);
        ArgumentNullException.ThrowIfNull(request);
        ArgumentNullException.ThrowIfNull(fieldPolicy);

        var (filteredQuery, totalCount, refusedFields) = PrepareQuery(query, request, fieldPolicy);

        // Apply Paging (Skip / Take). Ceiling comes from the policy (ROADMAP.v5.md Part H) rather than
        // a fixed constant, so a given island's own policy - not a one-size-fits-all number - decides
        // how expensive a single page request is allowed to be.
        int page = Math.Max(1, request.Page);
        int pageSize = Math.Clamp(request.PageSize, 1, fieldPolicy.MaxPageSize);
        int skip = (page - 1) * pageSize;

        var items = filteredQuery.Skip(skip).Take(pageSize).ToList();

        return new IslandDataResult<T>(items, totalCount, page, pageSize)
        {
            RefusedFields = refusedFields
        };
    }

    /// <summary>
    /// Asynchronously applies server-side sorting, filtering, and paging.
    /// </summary>
    public static Task<IslandDataResult<T>> ToIslandDataResultAsync<T>(
        this IQueryable<T> query,
        IslandDataRequest request,
        IslandFieldPolicy fieldPolicy,
        CancellationToken cancellationToken = default)
    {
        // Executes query synchronously or via Task wrapper for standard IQueryable sources
        return Task.Run(() => query.ToIslandDataResult(request, fieldPolicy), cancellationToken);
    }

    /// <summary>
    /// Applies filtering and sorting without executing pagination or materialization.
    /// </summary>
    public static IQueryable<T> ApplyIslandCriteria<T>(
        this IQueryable<T> query,
        IslandDataRequest request,
        IslandFieldPolicy fieldPolicy)
    {
        ArgumentNullException.ThrowIfNull(query);
        ArgumentNullException.ThrowIfNull(request);
        ArgumentNullException.ThrowIfNull(fieldPolicy);

        var (preparedQuery, _, _) = PrepareQuery(query, request, fieldPolicy);
        return preparedQuery;
    }

    private static (IQueryable<T> Query, int TotalCount, IReadOnlyList<string> RefusedFields) PrepareQuery<T>(
        IQueryable<T> query,
        IslandDataRequest request,
        IslandFieldPolicy fieldPolicy)
    {
        var entityType = typeof(T);
        var properties = entityType.GetProperties(BindingFlags.Public | BindingFlags.Instance)
                                   .Where(p => p.CanRead)
                                   .ToDictionary(p => p.Name, p => p, StringComparer.OrdinalIgnoreCase);

        var refused = new List<string>();

        // 1. Apply Column Filters
        var effectiveFilters = request.GetEffectiveFilters();
        if (effectiveFilters.Count > 0)
        {
            foreach (var filter in effectiveFilters)
            {
                if (string.IsNullOrWhiteSpace(filter.Field) || string.IsNullOrWhiteSpace(filter.Value))
                    continue;

                // Security: Enforce explicit allowlist
                if (!fieldPolicy.Allows(filter.Field))
                {
                    refused.Add(filter.Field);
                    continue;
                }

                // Security: Only allow existing model properties (prevents arbitrary injection)
                if (!properties.TryGetValue(filter.Field, out var prop))
                {
                    refused.Add(filter.Field);
                    continue;
                }

                query = ApplyFilter(query, prop, filter.Operator, filter.Value);
            }
        }

        // 2. Apply Global Search
        if (!string.IsNullOrWhiteSpace(request.GlobalSearch))
        {
            query = ApplyGlobalSearch(query, properties, request.GlobalSearch, request.GlobalFilterFields, fieldPolicy);
        }

        // 3. Compute Total Count after all filters
        int totalCount = query.Count();

        // 4. Apply Sorting
        var effectiveSorts = request.GetEffectiveSorts();
        if (effectiveSorts.Count > 0)
        {
            bool isFirstSort = true;
            foreach (var sort in effectiveSorts)
            {
                if (string.IsNullOrWhiteSpace(sort.Field))
                    continue;

                if (!fieldPolicy.Allows(sort.Field))
                {
                    refused.Add(sort.Field);
                    continue;
                }

                if (!properties.TryGetValue(sort.Field, out var prop))
                {
                    refused.Add(sort.Field);
                    continue;
                }

                query = ApplySort(query, prop, sort.Descending, isFirstSort);
                isFirstSort = false;
            }
        }

        return (query, totalCount, refused);
    }

    private static IQueryable<T> ApplySort<T>(IQueryable<T> source, PropertyInfo prop, bool descending, bool isFirst)
    {
        var parameter = Expression.Parameter(typeof(T), "x");
        var propertyAccess = Expression.Property(parameter, prop);
        var lambda = Expression.Lambda(propertyAccess, parameter);

        string methodName = isFirst
            ? (descending ? nameof(Queryable.OrderByDescending) : nameof(Queryable.OrderBy))
            : (descending ? nameof(Queryable.ThenByDescending) : nameof(Queryable.ThenBy));

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
        var comparison = BuildComparison(propertyAccess, prop.PropertyType, op, rawValue);

        if (comparison == null)
            return source;

        var lambda = Expression.Lambda<Func<T, bool>>(comparison, parameter);
        return source.Where(lambda);
    }

    private static IQueryable<T> ApplyGlobalSearch<T>(
        IQueryable<T> source,
        Dictionary<string, PropertyInfo> properties,
        string searchTerm,
        List<string>? filterFields,
        IslandFieldPolicy fieldPolicy)
    {
        var stringProps = properties.Values
            .Where(p => p.PropertyType == typeof(string))
            .ToList();

        if (filterFields is { Count: > 0 })
        {
            stringProps = stringProps
                .Where(p => filterFields.Contains(p.Name, StringComparer.OrdinalIgnoreCase))
                .ToList();
        }

        stringProps = stringProps
            .Where(p => fieldPolicy.Allows(p.Name))
            .ToList();

        if (stringProps.Count == 0)
            return source;

        var parameter = Expression.Parameter(typeof(T), "x");
        var containsMethod = typeof(string).GetMethod(nameof(string.Contains), new[] { typeof(string) })!;
        var constant = Expression.Constant(searchTerm, typeof(string));

        Expression? combined = null;
        foreach (var prop in stringProps)
        {
            var propertyAccess = Expression.Property(parameter, prop);
            var notNullCheck = Expression.NotEqual(propertyAccess, Expression.Constant(null, typeof(string)));
            var containsCall = Expression.Call(propertyAccess, containsMethod, constant);
            var matchExpr = Expression.AndAlso(notNullCheck, containsCall);

            combined = combined == null ? matchExpr : Expression.OrElse(combined, matchExpr);
        }

        if (combined == null)
            return source;

        var lambda = Expression.Lambda<Func<T, bool>>(combined, parameter);
        return source.Where(lambda);
    }

    private static Expression? BuildComparison(MemberExpression propertyAccess, Type propertyType, string op, string rawValue)
    {
        var targetType = Nullable.GetUnderlyingType(propertyType) ?? propertyType;
        object? convertedValue;

        try
        {
            if (targetType == typeof(Guid))
            {
                convertedValue = Guid.Parse(rawValue);
            }
            else if (targetType.IsEnum)
            {
                convertedValue = Enum.Parse(targetType, rawValue, ignoreCase: true);
            }
            else if (targetType == typeof(DateTime))
            {
                convertedValue = DateTime.Parse(rawValue, CultureInfo.InvariantCulture);
            }
            else if (targetType == typeof(DateTimeOffset))
            {
                convertedValue = DateTimeOffset.Parse(rawValue, CultureInfo.InvariantCulture);
            }
            else
            {
                convertedValue = Convert.ChangeType(rawValue, targetType, CultureInfo.InvariantCulture);
            }
        }
        catch
        {
            return null; // Skip unparseable filter values safely
        }

        Expression constant = Expression.Constant(convertedValue, propertyType);

        switch (op.ToLowerInvariant())
        {
            case "contains" when targetType == typeof(string):
                var containsMethod = typeof(string).GetMethod(nameof(string.Contains), new[] { typeof(string) })!;
                var notNullContains = Expression.NotEqual(propertyAccess, Expression.Constant(null, typeof(string)));
                return Expression.AndAlso(notNullContains, Expression.Call(propertyAccess, containsMethod, constant));

            case "notcontains" when targetType == typeof(string):
                var notContainsMethod = typeof(string).GetMethod(nameof(string.Contains), new[] { typeof(string) })!;
                var notNullNotContains = Expression.NotEqual(propertyAccess, Expression.Constant(null, typeof(string)));
                return Expression.OrElse(
                    Expression.Equal(propertyAccess, Expression.Constant(null, typeof(string))),
                    Expression.Not(Expression.Call(propertyAccess, notContainsMethod, constant))
                );

            case "startswith" when targetType == typeof(string):
                var startsMethod = typeof(string).GetMethod(nameof(string.StartsWith), new[] { typeof(string) })!;
                var notNullStarts = Expression.NotEqual(propertyAccess, Expression.Constant(null, typeof(string)));
                return Expression.AndAlso(notNullStarts, Expression.Call(propertyAccess, startsMethod, constant));

            case "endswith" when targetType == typeof(string):
                var endsMethod = typeof(string).GetMethod(nameof(string.EndsWith), new[] { typeof(string) })!;
                var notNullEnds = Expression.NotEqual(propertyAccess, Expression.Constant(null, typeof(string)));
                return Expression.AndAlso(notNullEnds, Expression.Call(propertyAccess, endsMethod, constant));

            case "notequals":
                return Expression.NotEqual(propertyAccess, constant);

            case "gt":
            case "dateafter":
                return Expression.GreaterThan(propertyAccess, constant);

            case "gte":
                return Expression.GreaterThanOrEqual(propertyAccess, constant);

            case "lt":
            case "datebefore":
                return Expression.LessThan(propertyAccess, constant);

            case "lte":
                return Expression.LessThanOrEqual(propertyAccess, constant);

            case "equals":
            case "dateis":
            default:
                return Expression.Equal(propertyAccess, constant);
        }
    }
}
