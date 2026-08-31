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
