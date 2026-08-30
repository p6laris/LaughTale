using System;

namespace LaughTale.Core.Attributes;

/// <summary>
/// Excludes a property or field from island props JSON serialization and client-side HTML output.
/// Prevents sensitive server-side state, credentials, and internal identifiers from leaking to the browser.
/// </summary>
[AttributeUsage(AttributeTargets.Property | AttributeTargets.Field, AllowMultiple = false, Inherited = true)]
public sealed class IslandIgnoreAttribute : Attribute
{
}
