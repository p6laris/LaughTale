using System;

namespace LaughTale.Core.Attributes;

/// <summary>
/// Marks an Island model, props record, or individual property as containing user-specific or sensitive data.
/// When rendered, LaughTale enforces private, non-cacheable HTTP response headers to prevent output caching / CDN data leaks.
/// </summary>
[AttributeUsage(AttributeTargets.Class | AttributeTargets.Struct | AttributeTargets.Property | AttributeTargets.Field, Inherited = true, AllowMultiple = false)]
public sealed class IslandPrivateAttribute : Attribute
{
    /// <summary>
    /// Reason or description for privacy classification.
    /// </summary>
    public string? Reason { get; }

    public IslandPrivateAttribute(string? reason = null)
    {
        Reason = reason;
    }
}
