---
title: "Output Caching & Data Privacy"
description: "Preventing cross-user data leaks when caching pages with island props"
order: 51
section: "Security & Hardening"
---

# Output Caching & Data Privacy

Because Islands serialize their initial state into the `data-props` HTML attribute, caching a full HTML page with a reverse proxy, CDN, or ASP.NET Core `OutputCache` can accidentally leak user-specific data (such as account numbers or user balances) to other visitors.

LaughTale includes built-in **Cache Leak Protection** to guarantee private state stays private.

---

## Marking Props as Private

Decorate sensitive C# props records or individual properties with `[IslandPrivate]`:

```csharp
using LaughTale.Core.Attributes;

[IslandPrivate("Contains personal billing data")]
public record UserBillingProps(
    string AccountNumber, 
    decimal CurrentBalance
);
```

Or on specific fields:

```csharp
public record UserProfileProps(
    string DisplayName,
    [property: IslandPrivate] string TaxId
);
```

---

## How It Works

When an island containing `[IslandPrivate]` props renders:
1. `IslandTagHelper` automatically enforces `Cache-Control: no-store, no-cache, private` on the HTTP response.
2. Appends `Vary: Cookie` to ensure downstream intermediate caches isolate sessions.
3. Emits a development-time console warning if an endpoint was previously configured with `Cache-Control: public`.
