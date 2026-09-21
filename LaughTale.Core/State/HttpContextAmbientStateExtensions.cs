using System.Reflection;
using Microsoft.AspNetCore.Http;
using LaughTale.Core.Attributes;

namespace LaughTale.Core.State;

/// <summary>
/// LaughTale: Ambient State Pool (ROADMAP.v5.md Part F). Lets a PageModel (or any server-side code
/// with access to <see cref="HttpContext"/>) register a value to be dehydrated into the page's shared
/// <c>__LAUGHTALE_STATE__</c> blob for client islands to read via <c>ctx.state(key)</c> — Nuxt
/// <c>useState</c>'s equivalent, without a stateful server circuit.
/// </summary>
public static class HttpContextAmbientStateExtensions
{
    /// <summary>
    /// Registers <paramref name="value"/> under <paramref name="key"/> in the ambient state pool.
    /// Pass <paramref name="isPrivate"/> true (or apply <c>[IslandPrivate]</c> to <paramref
    /// name="value"/>'s type) for user-scoped data: the moment ANY entry in the pool is private,
    /// <c>IslandStateScriptTagHelper</c> forces the whole response to <c>Cache-Control: no-store</c>
    /// the same way a private island already does — the entire pool dehydrates into one shared script
    /// tag, so privacy can't be scoped any finer than that.
    /// </summary>
    public static void SetAmbientState(this HttpContext context, string key, object? value, bool isPrivate = false)
    {
        var hasPrivateAttr = isPrivate || value?.GetType().GetCustomAttribute<IslandPrivateAttribute>(true) != null;
        AmbientStatePool.GetOrCreate(context).Entries.Add(new AmbientStateEntry(key, value, hasPrivateAttr));
    }
}
