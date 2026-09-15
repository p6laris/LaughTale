---
title: Security & Production Hardening
description: Enterprise security architecture — Strict Content Security Policy (CSP), anti-CSRF auto-propagation, AST sandboxing with zero eval, and reflection allowlisting.
order: 8
icon: shield
category: Framework Architecture
---

# 🛡️ Security & Hardening

Security is a foundational pillar of LaughTale. The framework is architected from the ground up for strict enterprise compliance, government standards, and zero-trust web environments.

---

## 🔒 1. Strict Content Security Policy (Zero `unsafe-eval`)

Many JavaScript frameworks and templating engines rely on `new Function(...)` or `eval(...)` to execute client expressions, forcing developers to weaken their Content Security Policy with `unsafe-eval`.

**LaughTale requires ZERO `unsafe-eval`:**
- All declarative directives (`l-*`) are parsed through a deterministic, sandboxed **Abstract Syntax Tree (AST) evaluator**.
- No code is dynamically compiled at runtime on the browser.
- Works out-of-the-box with high-security CSP headers:

```http
Content-Security-Policy: default-src 'self'; script-src 'self' 'nonce-rAnd0m'; style-src 'self'; object-src 'none'; base-uri 'self';
```

---

## 🛡️ 2. Automatic Anti-CSRF Token Propagation

Cross-Site Request Forgery (CSRF) is a critical vulnerability in web applications. LaughTale automatically detects ASP.NET Core anti-forgery tokens on the page (`__RequestVerificationToken`) and attaches them to all island network operations:

- **Server-Driven Island Refreshes** (`POST /_laughtale/island/{name}`)
- **Server Data Contract Queries** (`POST /api/.../data`)
- **File Uploads** (`<island-fileupload />`)

```typescript
// Automatically attached on all POST / PUT / DELETE requests
headers['RequestVerificationToken'] = token;
headers['X-CSRF-TOKEN'] = token;
```

---

## 🛑 3. Mandatory Field Allowlist Policies & Anti-Oracle Defense

When client grids request sorting or filtering by column name (e.g. `sortField: "balance"`), malicious actors might attempt dynamic SQL injection, prototype pollution, or private property exfiltration.

In LaughTale v4+ (Spec 041), **field allowlists are mandatory** via `IslandFieldPolicy`:

```csharp
// 1. Mandatory Security Allowlist (Required in v4+):
var policy = IslandFieldPolicy.For("Id", "Name", "City", "Balance", "CreatedAt");

var result = query.ToIslandDataResult(request, policy);
```

### Protection Summary:
- **Zero Raw SQL String Concatenation**: Queries are built exclusively via type-safe LINQ Expression Trees.
- **Mandatory Policy**: Omission of `IslandFieldPolicy` produces a compile-time error. For explicit full opt-in on vetted DTOs, `IslandFieldPolicy.AllMappedProperties` can be specified — doing so raises **`LTI006`**, a build-time warning flagging that every public property on the queried type is now client-filterable, sortable, and searchable. Not an error: the compiler can't know whether your DTO actually has a field that shouldn't be queryable, only that you chose the option that doesn't check. Confirm that's intended, or switch to `IslandFieldPolicy.For(...)`.
- **Anti-Oracle Refusal List**: Any requested field that is not allowlisted OR does not exist on the model is silently skipped and collected into `result.RefusedFields` as flat strings without differentiator codes, preventing schema enumeration attacks.
- **Private Fields Guard**: Fields decorated with `[IslandPrivate]` or non-public properties can never be read or filtered.
- **Malformed Input Resilience**: Unparseable integers, dates, or Guids are rejected cleanly without throwing unhandled server exceptions.
- **Page-Size Ceiling (ROADMAP.v5.md Part H)**: A requested `PageSize` is clamped, never rejected, to `IslandFieldPolicy.MaxPageSize` (default 200) — a single request can't force an unbounded scan even against a slow filter/sort, independent of rate limiting. Override per island for data that's cheaper or more expensive to page through than the default assumes:
  ```csharp
  var policy = IslandFieldPolicy.For("Id", "Name", "City", "Balance").WithMaxPageSize(500);
  ```

---

## 🧹 4. HTML Sanitization & XSS Defense

LaughTale encodes all user-provided strings and JSON properties before rendering them to the DOM.

- Text bindings (`l-text`, table cells, labels) are escaped with `textContent` / `HtmlEncode`.
- HTML bindings (`l-html`, custom templates) pass through a DOMPurify sanitizer preventing `<script>`, `onload=`, and `javascript:` URI attacks.

---

## 🔐 5. Deny-by-Default Island Authorization (LT-2204)

Starting in v4 (Spec 041), LaughTale enforces **deny-by-default authorization** across all island execution paths (TagHelpers, TagHelperBase, Generated TagHelpers, Island Refresh Endpoint, and `IIslandAuthorizationRegistry`).

### A. Deny-by-Default Contract
- **Undeclared Islands**: Any island that has no policy registered and is not explicitly declared public is refused.
- **Refresh Endpoint**: Returns `403 Forbidden` with an empty response body on any unauthorized request (`Denied`, `Undeclared`, or `Undeterminable`), identical byte-for-byte to prevent oracle side-channel leakage.
- **TagHelpers**: Suppresses output entirely (`output.SuppressOutput()`), ensuring zero markup and zero props are transmitted to the client.

### B. Declaring Access: The 4 Patterns
1. **Explicit Policy via `[IslandAuthorize]`**:
   ```csharp
   [Island("sales-dashboard")]
   [IslandAuthorize("RequireSalesManager")]
   public record SalesDashboardProps(string Region, decimal Target);
   ```
2. **Explicit Public Access via `[IslandAllowAnonymous]`**:
   ```csharp
   [Island("public-counter")]
   [IslandAllowAnonymous]
   public record PublicCounterProps(int InitialCount);
   ```
3. **Global or Local Options Configuration**:
   ```csharp
   builder.Services.AddLaughTale(options =>
   {
       options.Refresh.RequirePolicy("admin-panel", "AdminOnly");
       options.Refresh.AllowAnonymous("public-counter");
   });
   ```
4. **Declarative TagHelper Attribute**:
   ```html
   <island name="sales-dashboard" policy="RequireSalesManager" />
   ```

### C. Emergency Migration Compatibility Switch
To facilitate phased migrations in legacy applications, the compatibility switch `AllowUndeclaredIslands` can be temporarily enabled:
```csharp
builder.Services.AddLaughTale(options =>
{
    options.Refresh.AllowUndeclaredIslands = true; // Temporary migration switch
});
```
This logs a deduplicated warning once per undeclared island name and will be removed in a future release. See [Migration Guide](file:///docs/migration/041-deny-by-default.md) for details.

---

## 🚦 6. Per-Client Rate Limiting (ROADMAP.v5.md Part H)

The three island POST endpoints (`MapLaughTaleIslandRefresh`, `MapIslandData`, `MapLaughTaleIslandAction`)
each accept a request body from the client, run authorization, and then do real work — including, for
`MapIslandData`, executing an EF Core query built from client-supplied filter/sort fields. A crafted
filter against an unindexed column, or simply a rapid burst of requests, is a cheap denial-of-service
surface without a limit in place.

```csharp
builder.Services.AddLaughTale(options =>
{
    options.RateLimit.Enabled = true;      // opt-in — see below
    options.RateLimit.PermitLimit = 30;    // requests...
    options.RateLimit.WindowSeconds = 10;  // ...per sliding window
    options.RateLimit.PartitionByUser = true; // authenticated clients partition by user name, not IP
});
```

**Off by default, unlike antiforgery.** `RequireAntiforgery` defaults to `true` because ASP.NET Core's
own global antiforgery validation is already active for every `AddRazorPages()` app — requiring it in
LaughTale changes nothing observable. A request limit has no such platform precedent: turning it on by
default would silently start rejecting real traffic the moment an existing app upgraded, at a threshold
this library can't know is right for that app's actual usage. Enable it and tune the numbers for your
own traffic shape.

Enforcement happens inside each endpoint's own handler — the same manual antiforgery → authorization →
work sequence these endpoints already use — rather than via ASP.NET Core's `UseRateLimiter()` pipeline
middleware, so protection applies the moment you call `Map...()`, with no separate middleware
registration to remember. Rejected requests receive `429 Too Many Requests`.

---

## 📋 Security Checklist for Production

- [x] Enable HTTPS redirection (`app.UseHttpsRedirection()`).
- [x] Configure strict CSP headers without `unsafe-eval`.
- [x] Declare mandatory `IslandFieldPolicy` on all `ToIslandDataResult` calls and `MapIslandData` endpoints.
- [x] Ensure anti-forgery token middleware is enabled in ASP.NET Core (`options.Refresh.RequireAntiforgery = true`).
- [x] Explicitly declare all islands as protected (`[IslandAuthorize]` / `RequirePolicy`) or public (`[IslandAllowAnonymous]` / `AllowAnonymous`).
- [x] Use `[IslandPrivate]` on sensitive model properties (e.g. PasswordHash, InternalNotes).
- [ ] Enable and tune `options.RateLimit` on the island endpoints for your own traffic shape (off by default).
