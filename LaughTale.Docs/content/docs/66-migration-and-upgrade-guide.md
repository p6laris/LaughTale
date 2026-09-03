---
title: Migration & Upgrade Guide
description: Step-by-step guide for migrating existing ASP.NET Core Razor Pages, MVC views, or legacy jQuery/Knockout apps to LaughTale.
order: 55
icon: git-commit
category: Framework Architecture
---

# 🔄 Migration & Upgrade Guide

Migrating an existing ASP.NET Core MVC or Razor Pages application to LaughTale is **incremental and non-breaking**. You can upgrade one page or one component at a time.

---

## 🪜 Step-by-Step Migration

1. **Step 1: Install NuGet Packages**: Add `LaughTale.Core` and `LaughTale.Components`.
2. **Step 2: Add `AddLaughTale()` to `Program.cs`**: Your existing Razor routes continue working with zero disruption.
3. **Step 3: Replace Heavy jQuery / Vanilla Plugins with Islands**:
   - Replace complex legacy datepickers with `<island-datepicker />`.
   - Replace jQuery DataTables with `<island-datatable lazy="true" />`.
4. **Step 4: Enable View Transitions**: Experience instant SPA-like smoothness across your entire legacy application!

---

## 🔒 Upgrading to LaughTale v4 (Spec 041 / LT-2204)

LaughTale v4 introduces **deny-by-default island authorization** and **mandatory field allowlists**.

### What Changed:
- **Undeclared Islands Denied**: Any island without an explicit policy or anonymous declaration is suppressed on SSR and returns 403 on refresh.
- **Mandatory `IslandFieldPolicy`**: Calls to `ToIslandDataResult(...)` and `MapIslandData(...)` now require an explicit `IslandFieldPolicy`.
- **Anti-Oracle Security**: Non-allowlisted and non-existent properties are combined into `result.RefusedFields` to eliminate schema discovery.

### Migration Checklist:
1. Declare public islands using `[IslandAllowAnonymous]` or `options.Refresh.AllowAnonymous("name")`.
2. Protect sensitive islands with `[IslandAuthorize("PolicyName")]` or `options.Refresh.RequirePolicy(...)`.
3. Provide `IslandFieldPolicy.For(...)` on all LINQ queries and data endpoints.
4. If migrating a large legacy deployment, temporarily enable `options.Refresh.AllowUndeclaredIslands = true` as an emergency bridge while completing declarations.

For complete details and code examples, consult the dedicated [v4 Migration Guide](file:///docs/migration/041-deny-by-default.md).
