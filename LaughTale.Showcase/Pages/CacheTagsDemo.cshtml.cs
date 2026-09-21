using System;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.OutputCaching;
using LaughTale.Core.Caching;
using LaughTale.Components.Rendering;

namespace LaughTale.Showcase.Pages;

/// <summary>
/// ROADMAP.v5.md Part F "Cache tags & live invalidation" + "Incremental regeneration" live demo. GET
/// is cached (15s duration - the "incremental regeneration" half: it goes stale and regenerates on
/// its own after that) AND tagged "cache-tags-demo" (the "cache tags" half: a mutation can evict it
/// early, on demand, without waiting for the duration to expire).
/// </summary>
[OutputCache(PolicyName = "laughtale-demo")]
public class CacheTagsDemoModel : PageModel
{
    public const string Tag = "cache-tags-demo";

    public DateTime RenderedAtUtc { get; private set; }
    public Guid RenderNonce { get; private set; }

    public void OnGet()
    {
        ViewData.SetHead(new PageHead(Title: "Cache Tags & Incremental Regeneration"));

        // RUNTIME-computed tag - the value LaughTale's Tag() adds over the built-in
        // [OutputCache(Tags = [...])] attribute, which only accepts compile-time literals.
        HttpContext.Tag(Tag);

        RenderedAtUtc = DateTime.UtcNow;
        RenderNonce = Guid.NewGuid();
    }
}
