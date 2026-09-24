using System;
using System.Collections.Concurrent;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Reflection;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using LaughTale.Core.Attributes;

namespace LaughTale.Core.Security;

/// <summary>
/// Public entry point for the <see cref="IslandPrivateAttribute"/> cache rule, so island TagHelpers
/// outside LaughTale.Core (e.g. LaughTale.Components' IslandTagHelperBase) apply the exact same
/// no-store guard as the core <c>&lt;island&gt;</c> TagHelper.
/// </summary>
public static class IslandCachePrivacyGuard
{
    private static readonly ConcurrentDictionary<Type, bool> PrivateTypeCache = new();

    /// <summary>
    /// True when <paramref name="type"/> itself, or any of its public instance properties, carries <see cref="IslandPrivateAttribute"/>.
    /// </summary>
    [UnconditionalSuppressMessage("Trimming", "IL2070", Justification = "Props/TagHelper types are instantiated by the app, so their public properties are rooted; a trimmed-away property cannot carry the attribute anyway.")]
    public static bool IsPrivate(Type? type)
    {
        if (type is null)
        {
            return false;
        }

        return PrivateTypeCache.GetOrAdd(type, static t =>
            t.GetCustomAttribute<IslandPrivateAttribute>(true) != null
            || t.GetProperties(BindingFlags.Public | BindingFlags.Instance)
                .Any(p => p.GetCustomAttribute<IslandPrivateAttribute>(true) != null));
    }

    /// <summary>
    /// Applies <c>Cache-Control: no-store, no-cache, private</c> (plus <c>Pragma</c>/<c>Vary</c>) when
    /// <paramref name="isPrivate"/> is true. Returns whether the guard was applied.
    /// </summary>
    public static bool EnforceIfPrivate(HttpContext httpContext, string islandName, bool isPrivate, ILogger? logger = null)
    {
        ArgumentNullException.ThrowIfNull(httpContext);
        if (!isPrivate)
        {
            return false;
        }

        IslandCachePrivacy.EnforceNoStore(httpContext, islandName, logger);
        return true;
    }
}
