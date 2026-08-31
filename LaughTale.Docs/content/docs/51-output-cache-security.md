---
title: Output Cache & Privacy Enforcement
description: How LaughTale prevents personal data leaks across ASP.NET Core OutputCache and ResponseCache middleware.
order: 51
icon: shield
category: Framework Architecture
---

# 🛡️ Output Cache & Privacy Enforcement

ASP.NET Core's `OutputCache` middleware can aggressively cache server-rendered HTML. If a page contains sensitive user data (e.g. account numbers, private balances), caching that HTML globally could leak private data to other users.

LaughTale includes an automated **Cache Leak Guard**:

---

## 🔒 1. Automatic Privacy Detection

When you declare an island with private data, mark it with `private="true"` or decorate the model with `[IslandPrivate]`:

```razor
<island name="user-profile" 
        props="@Model.SensitiveUserData" 
        private="true" />
```

---

## 🛑 2. How the Guard Works

During the Razor rendering pipeline, `IslandTagHelper` intercepts the ASP.NET Core `IOutputCacheFeature` or `IResponseCachingFeature` and automatically:
1. Calls `context.HttpContext.Response.Headers.CacheControl = "no-store, private"`.
2. Marks the output cache entry as **uncacheable** to prevent accidental proxy or CDN leaks.
