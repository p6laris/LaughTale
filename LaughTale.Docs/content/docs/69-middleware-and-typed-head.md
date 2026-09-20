---
title: Per-Route Middleware & Typed Head
description: Standard ASP.NET Core patterns for per-route auth/tenant/A-B middleware, plus LaughTale's typed page-metadata model.
order: 69
icon: route
category: Framework Architecture
---

# 🛣️ Per-Route Middleware & Typed Head

ROADMAP.v5.md's "Middleware & typed head" item asks for two things: a per-route middleware chain (auth,
tenant, A/B) and a typed page-metadata API. They turn out to need very different treatment.

---

## 1. Per-route middleware — standard ASP.NET Core, not a LaughTale feature

LaughTale doesn't wrap or block ASP.NET Core's own routing/middleware pipeline. Every capability below
already composes with `MapRazorPages()` today with zero LaughTale-specific code.

**Auth on a specific route:**

```csharp
app.MapRazorPages();
app.MapGroup("/admin").RequireAuthorization("AdminOnly");
```

**A/B routing via an `IEndpointFilter`:**

```csharp
app.MapGet("/pricing", () => Results.Redirect("/pricing/variant-b"))
   .AddEndpointFilter(async (context, next) =>
   {
       var httpContext = context.HttpContext;
       var bucket = httpContext.Request.Cookies["ab-bucket"] ?? "a";
       return bucket == "b" ? Results.Redirect("/pricing/variant-b") : await next(context);
   });
```

**Tenant resolution** — reuse the same `Func<HttpContext, string>` shape `MapIslandData`'s
`tenantResolver` parameter already standardizes on (see `IslandFieldPolicy.WithTenantColumn` and
[Row-Level Tenant Filtering](/docs/05-data-contracts-and-efcore)), so a page/middleware component and an
island's data endpoint resolve "the current tenant" the same way:

```csharp
Func<HttpContext, string> resolveTenant = ctx => ctx.User.FindFirst("tid")?.Value ?? "default";
```

There is no `ITenantContext`/ambient DI service shipped today — this delegate shape is a convention to
reuse, not a service to inject. If your app needs the tenant available to arbitrary page code (not just
`MapIslandData` calls), populate an `AsyncLocal<string>` or a scoped service from real middleware early
in the pipeline and resolve it the same way in both places.

---

## 2. Typed head — a real, small addition

Every page previously set metadata via an untyped `ViewData["Title"] = "..."` string, with no
`<meta>`/OpenGraph emission anywhere. `<page-head />` (`PageHeadTagHelper`) replaces that:

```csharp
public void OnGet()
{
    ViewData.SetHead(new PageHead(
        Title: "Partials",
        Description: "Named page regions updated by a plain link, everything else untouched.",
        OgImage: "https://example.com/preview.png"));
}
```

```html
<!-- _Layout.cshtml -->
<page-head suffix=" - LaughTale" />
```

`OgTitle`/`OgDescription` fall back to `Title`/`Description` when not set explicitly. A page that never
calls `SetHead` keeps working exactly as before — `<page-head />` falls back to the existing
`ViewData["Title"]` string.

The client SPA router's `reconcileHead()` already keys and reconciles `<title>`, `meta[name]`,
`meta[property]` (OpenGraph-ready), and `link[rel=canonical]` individually during navigation — no
client-side changes were needed for this to interoperate.
