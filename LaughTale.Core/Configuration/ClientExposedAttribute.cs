using System;

namespace LaughTale.Core.Configuration;

/// <summary>
/// LaughTale: Typed Config (ROADMAP.v5.md Part F). Marks a property on a typed config class as safe
/// to expose to the browser via the Ambient State Pool (<c>LaughTale.Core.State</c>). Every property
/// WITHOUT this attribute stays server-only - the safe default, matching Astro env's <c>PUBLIC_</c>
/// prefix and Nuxt <c>runtimeConfig</c>'s public/private split, just spelled as an attribute instead
/// of a naming convention.
/// </summary>
[AttributeUsage(AttributeTargets.Property)]
public sealed class ClientExposedAttribute : Attribute
{
}
