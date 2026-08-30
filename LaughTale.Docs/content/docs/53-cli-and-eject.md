---
title: "CLI & Component Ejection"
description: "List and eject component source code directly into your application"
order: 53
section: "Tooling & DX"
---

# CLI & Component Ejection

LaughTale provides a unified command-line tool (available via `npx laughtale` and `dotnet tool install -g LaughTale.Cli`) for inspecting and ejecting component source code into your own project.

---

## ⚡ Quick Usage

### 1. List Available Components
```bash
npx laughtale list
```

Outputs all available components, their source files, and supported slot names.

### 2. Eject a Component (Direct Code Ownership)
To take complete ownership of a component's markup, TypeScript logic, and styles:

```bash
# Eject the DataTable component into ./src/components/datatable.ts
npx laughtale eject datatable
```

Or specify a custom destination directory:

```bash
npx laughtale eject datatable --out ./src/custom-components
```

Once ejected, the file lives directly in your repository. You can modify its DOM structure, customize its internal event logic, and restyle its CSS classes without maintaining an upstream dependency.
