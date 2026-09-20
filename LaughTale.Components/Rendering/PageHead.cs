using System.Collections.Generic;

namespace LaughTale.Components.Rendering;

/// <summary>
/// LaughTale: Typed Page Metadata (ROADMAP.v5.md Part E "Middleware &amp; typed head"). Replaces the
/// previous untyped-only <c>ViewData["Title"]</c> string convention with a typed model a page can set
/// once (via <see cref="PageHeadViewDataExtensions.SetHead"/>) and <c>&lt;page-head /&gt;</c>
/// (<c>PageHeadTagHelper</c>) renders into the layout's <c>&lt;head&gt;</c>.
///
/// The client's SPA router (<c>LaughTale.Client/src/runtime/router.ts</c>'s <c>reconcileHead()</c>)
/// already keys and reconciles <c>&lt;title&gt;</c>, <c>meta[name]</c>, <c>meta[property]</c>
/// (OpenGraph-ready), and <c>link[rel=canonical]</c> individually during navigation - this model needs
/// no client-side changes to interoperate with it.
/// </summary>
public sealed record PageHead(
    string? Title = null,
    string? Description = null,
    string? CanonicalUrl = null,
    string? OgTitle = null,
    string? OgDescription = null,
    string? OgImage = null,
    string OgType = "website",
    IReadOnlyList<(string Name, string Content)>? CustomMeta = null);
