---
title: CLI & Component Ejection
description: Scaffold projects, eject component source code directly into your repository with zero lock-in, and manage island bundles with the LaughTale CLI.
order: 11
icon: terminal
category: Framework Architecture
---

# 🛠️ LaughTale CLI & Component Ejection

LaughTale embraces the modern **"Copy-Paste / Ejection"** philosophy: you should never be held hostage by closed-source, pre-compiled UI widgets. 

With the **LaughTale CLI**, you have complete ownership over your codebase. You can use pre-built components out-of-the-box, or **eject** any component's full C# TagHelper and TypeScript source code directly into your project for 100% custom modification.

---

## ⚡ 1. Installing the CLI

You can install the LaughTale CLI globally via .NET tools or use it via `npx`:

```bash
# Install as a .NET Global Tool
dotnet tool install --global SoftMax.LaughTale.Cli

# Or run instantly via npx
npx @softmax/laughtale --help
```

---

## 🚀 2. Core CLI Commands

### `init` — Scaffold a New or Existing Project
Scaffolds the LaughTale runtime, `islands.ts` bundler, Aura design tokens, and `_ViewImports.cshtml` configuration:

```bash
dotnet laughtale init
```

What it sets up:
- Creates `src/islands/` and `src/components/` directory structure.
- Adds `esbuild.config.mjs` with automated code-splitting.
- Configures `Program.cs` and `_ViewImports.cshtml`.
- Installs `@softmax/laughtale-client` npm dependency.

---

### `eject` (or `add`) — Eject Component Source Code
Eject any of LaughTale's 76+ components directly into your local project:

```bash
# Eject the DataTable component
dotnet laughtale eject datatable

# Eject multiple components at once
dotnet laughtale eject datepicker dialog fileupload stepper
```

#### What happens during ejection:
1. **TypeScript Island**: The component's unminified TypeScript code is copied to `src/components/datatable.ts`.
2. **C# TagHelper (Optional)**: The C# TagHelper class is copied to `Components/TagHelpers/DataTableTagHelper.cs`.
3. **Full Customization**: You can now freely edit the DOM structure, CSS tokens, event listeners, or algorithms with **zero external dependencies**.

---

### `bundle` — Build Production Islands
Compiles, tree-shakes, splits, and minifies your island bundles into `wwwroot/js/`:

```bash
dotnet laughtale bundle --minify
```

---

### `doctor` / `check` — Health & Security Audit
Audits your ASP.NET Core project for best practices:

```bash
dotnet laughtale check
```

Checks:
- [x] TagHelpers registered correctly in `_ViewImports.cshtml`.
- [x] Anti-CSRF token verification enabled.
- [x] Content Security Policy (CSP) headers without `unsafe-eval`.
- [x] Unreferenced or orphaned island scripts.
- [x] Missing client bundles in `wwwroot/js/`.

---

## 🎯 3. Why Component Ejection Wins

| Traditional UI Libraries (Locked) | LaughTale Ejection Architecture |
| :--- | :--- |
| Closed npm packages / compiled DLLs | **100% source code in your Git repo** |
| Forced to wait for upstream bug fixes | **Fix bugs or customize logic instantly** |
| Bloated bundles with unused features | **Keep only the code you actually need** |
| Complex CSS override specificity wars | **Edit the source classes directly** |

---

## 📋 Example: Ejecting and Customizing the `DatePicker`

1. Run:
```bash
dotnet laughtale eject datepicker
```
2. Open `src/components/datepicker.ts` and modify the header or add custom holiday markers:
```typescript
// Custom Kurdish Holiday Marker
if (currentMonth === 2 && day === 21) {
    dayEl.classList.add('bg-amber-100', 'font-bold');
    dayEl.title = 'Newroz Holiday!';
}
```
3. Run `dotnet laughtale bundle` — your customized DatePicker is now live!
