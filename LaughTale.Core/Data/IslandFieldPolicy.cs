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

    private readonly PolicyKind _kind;
    private readonly IReadOnlySet<string>? _fields;

    /// <summary>
    /// No fields are queryable.
    /// </summary>
    public static IslandFieldPolicy None { get; } = new(PolicyKind.None, null);

    /// <summary>
    /// Every public mapped property is queryable. Pre-041 behaviour, now explicit and greppable.
    /// </summary>
    public static IslandFieldPolicy AllMappedProperties { get; } = new(PolicyKind.AllMappedProperties, null);

    private IslandFieldPolicy(PolicyKind kind, IReadOnlySet<string>? fields)
    {
        _kind = kind;
        _fields = fields;
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
