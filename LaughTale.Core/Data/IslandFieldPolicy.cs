using System;
using System.Collections.Generic;

namespace LaughTale.Core.Data;

/// <summary>
/// Defines the field access policy for server-side data operations (filtering, sorting, search).
/// Replaces optional field allowlists with an explicit, non-null specification.
/// </summary>
public sealed class IslandFieldPolicy
{
    private enum PolicyKind { None, AllMappedProperties, Explicit }

    /// <summary>
    /// Default ceiling for <see cref="MaxPageSize"/> (ROADMAP.v5.md Part H). A client requesting an
    /// unbounded page size against a slow filter/sort is a cheap denial-of-service surface even with
    /// request-rate limiting in place, since a single request can still force an expensive full scan.
    /// </summary>
    public const int DefaultMaxPageSize = 200;

    private readonly PolicyKind _kind;
    private readonly IReadOnlySet<string>? _fields;
    private readonly int _maxPageSize;

    /// <summary>
    /// No fields are queryable.
    /// </summary>
    public static IslandFieldPolicy None { get; } = new(PolicyKind.None, null);

    /// <summary>
    /// Every public mapped property is queryable. Pre-041 behaviour, now explicit and greppable.
    /// </summary>
    public static IslandFieldPolicy AllMappedProperties { get; } = new(PolicyKind.AllMappedProperties, null);

    private IslandFieldPolicy(PolicyKind kind, IReadOnlySet<string>? fields, int maxPageSize = DefaultMaxPageSize)
    {
        _kind = kind;
        _fields = fields;
        _maxPageSize = maxPageSize;
    }

    /// <summary>
    /// Gets the maximum number of rows a single request may page through under this policy. A
    /// requested <c>PageSize</c> above this is clamped, never rejected. Default: <see cref="DefaultMaxPageSize"/>.
    /// </summary>
    public int MaxPageSize => _maxPageSize;

    /// <summary>
    /// Returns a copy of this policy with a different <see cref="MaxPageSize"/> ceiling - for islands
    /// whose data is cheap enough to page through in larger chunks, or expensive enough to need a
    /// tighter one than the default.
    /// </summary>
    public IslandFieldPolicy WithMaxPageSize(int maxPageSize)
    {
        if (maxPageSize < 1)
        {
            throw new ArgumentOutOfRangeException(nameof(maxPageSize), maxPageSize, "MaxPageSize must be at least 1.");
        }

        return new IslandFieldPolicy(_kind, _fields, maxPageSize);
    }

    /// <summary>
    /// Only the named fields are queryable. Field comparison is case-insensitive.
    /// </summary>
    public static IslandFieldPolicy For(params string[] fields)
    {
        if (fields == null || fields.Length == 0)
        {
            return new IslandFieldPolicy(PolicyKind.Explicit, new HashSet<string>(StringComparer.OrdinalIgnoreCase));
        }

        return new IslandFieldPolicy(PolicyKind.Explicit, new HashSet<string>(fields, StringComparer.OrdinalIgnoreCase));
    }

    /// <summary>
    /// Only the named fields in the provided set are queryable. Field comparison is case-insensitive.
    /// </summary>
    public static IslandFieldPolicy For(IReadOnlySet<string> fields)
    {
        if (fields == null || fields.Count == 0)
        {
            return new IslandFieldPolicy(PolicyKind.Explicit, new HashSet<string>(StringComparer.OrdinalIgnoreCase));
        }

        return new IslandFieldPolicy(PolicyKind.Explicit, new HashSet<string>(fields, StringComparer.OrdinalIgnoreCase));
    }

    /// <summary>
    /// Determines whether the specified field name is allowed under this policy.
    /// </summary>
    public bool Allows(string fieldName)
    {
        if (string.IsNullOrWhiteSpace(fieldName)) return false;

        return _kind switch
        {
            PolicyKind.AllMappedProperties => true,
            PolicyKind.None => false,
            PolicyKind.Explicit => _fields != null && _fields.Contains(fieldName),
            _ => false
        };
    }
}
