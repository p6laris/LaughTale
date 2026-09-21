using System.Collections.Generic;
using Microsoft.AspNetCore.Http;

namespace LaughTale.Core.State;

/// <summary>
/// LaughTale: Ambient State Pool (ROADMAP.v5.md Part F). An <c>HttpContext.Items</c>-scoped list of
/// key/value entries registered via <see cref="HttpContextAmbientStateExtensions.SetAmbientState"/>
/// during a request, dehydrated into a single <c>&lt;script id="__LAUGHTALE_STATE__"&gt;</c> blob by
/// <c>IslandStateScriptTagHelper</c> at the point that TagHelper is placed on the page. Client islands
/// read it back via <c>ctx.state(key)</c>. Mirrors the <c>DeferredIslandRegistry</c> shape.
/// </summary>
internal sealed record AmbientStateEntry(string Key, object? Value, bool IsPrivate);

internal sealed class AmbientStatePool
{
    public List<AmbientStateEntry> Entries { get; } = new();

    public static AmbientStatePool GetOrCreate(HttpContext context) =>
        (AmbientStatePool)(context.Items[typeof(AmbientStatePool)] ??= new AmbientStatePool());
}
