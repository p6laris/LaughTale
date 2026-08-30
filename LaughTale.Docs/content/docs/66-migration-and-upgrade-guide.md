---
title: Migration & Upgrade Guide (v3.0.0)
description: Step-by-step guidance for upgrading existing applications to LaughTale v3.0.0.
category: Releases & Migration
order: 66
---

# Migration & Upgrade Guide (v3.0.0)

LaughTale v3.0.0 introduces hardened security controls, unified design tokens, WAI-ARIA 1.2 compliance, and performance optimizations.

---

## 1. Package Name & Namespace Updates

Replace all legacy references with modern `LaughTale.*`:

### NuGet Packages (.csproj)
```xml
<ItemGroup>
  <PackageReference Include="LaughTale.Core" Version="3.0.0" />
  <PackageReference Include="LaughTale.Components" Version="3.0.0" />
  <PackageReference Include="LaughTale.Markdown" Version="3.0.0" />
</ItemGroup>
```

### Razor View Imports (`_ViewImports.cshtml`)
```razor
@using LaughTale.Core.Enums
@using LaughTale.Core.TagHelpers
@using LaughTale.Components.TagHelpers
@addTagHelper *, LaughTale.Core
@addTagHelper *, LaughTale.Components
```

### Client NPM Package (`package.json`)
```json
{
  "dependencies": {
    "laughtale": "^3.0.0"
  }
}
```

---

## 2. Strong-Typed Theming Enums

Update string-based theme props to strong-typed enums:

```html
<!-- Before (v2 string attributes) -->
<island-theme default-theme="emerald" default-dark-mode="system" />

<!-- After (v3 enum properties) -->
<laughtale-theme default-theme="Emerald" default-dark-mode="System" default-surface="Zinc" default-radius="Md" />
```

---

## 3. CSP Nonce Middleware Configuration

Register the hardened CSP middleware in `Program.cs`:

```csharp
builder.Services.AddLaughTaleCsp();
// ...
app.UseLaughTaleCsp();
```
