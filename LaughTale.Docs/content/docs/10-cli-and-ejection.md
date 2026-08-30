---
title: "CLI Reference & Component Ejection"
description: "Global .NET CLI and NPM binary (npx laughtale) for scaffolding islands and ejecting components into your source code."
order: 10
section: "Core Concepts"
---

# CLI Reference & Component Ejection

LaughTale provides a unified developer CLI available both as an **NPM binary (`npx laughtale`)** and as a **.NET Global Tool (`dotnet tool install -g LaughTale.Cli`)**.

The CLI enables you to inspect available components, scaffold new islands across different frameworks, and **eject** any component's full source code directly into your repository.

---

## ⚡ Global Installation

```bash
# Option A: Run via NPX without installing
npx laughtale --help

# Option B: Install as a .NET Global Tool
dotnet tool install -g LaughTale.Cli
laughtale --help
```

---

## ✂️ Component Ejection (`npx laughtale eject`)

In enterprise projects, teams often need to customize a component's internal markup, styles, or behaviors beyond standard configuration parameters.

Rather than forking the entire repository or fighting CSS overrides, you can **eject** any individual component into your local project:

```bash
# Eject the DataTable component into your project
npx laughtale eject datatable
```

### What Ejection Does:
1. Copies the component's TypeScript implementation (`datatable.ts`) into `src/components/datatable.ts`.
2. Copies the corresponding C# TagHelper (`IslandDataGridTagHelper.cs`) into your ASP.NET Core project.
3. Automatically rewrites imports to point to your local files.
4. Gives you 100% ownership of the component source code.

---

## 🏗️ Island Scaffolding (`npx laughtale island create`)

Quickly scaffold a new island with boilerplate C# props and client TypeScript entry:

```bash
# Scaffold a new React island
npx laughtale island create user-profile --framework react

# Scaffold a new Vanilla TypeScript island
npx laughtale island create telemetry-widget --framework vanilla --strategy visible
```

### Generated Files:
* `Models/UserProfileProps.cs` (C# props model with `[Island]` attribute)
* `src/components/user-profile.tsx` (React component with `createReactAdapter`)
* `Pages/UserProfileExample.cshtml` (Razor usage snippet)
