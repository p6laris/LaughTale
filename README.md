# 🏝️ LaughTale

An enterprise-grade, high-performance **Islands Architecture framework for ASP.NET Core & Blazor SSR (.NET 10 + TypeScript)**.

---

## ⚡ Key Features

- 🚀 **Ultra-Fast First Paint**: 95% of the page is static SSR HTML; interactive islands hydrate on demand.
- 💤 **6 Hydration Strategies**: `Load`, `Idle`, `Visible` (IntersectionObserver), `Media`, `Interaction`, `Never`.
- 🔌 **Multi-Framework Adapters**: Zero-friction mount adapters for **React 18/19**, **Vue 3**, **Svelte 4/5**, **Preact**, and **Vanilla TS**.
- 🛡️ **Defense-in-Depth Security**: Output cache privacy guards (`[IslandPrivate]`), automated CSP nonces, AST expression sandboxing, and OWASP URL sanitization.
- 🎨 **Enterprise Aura Design System**: 76 components with dark mode, OKLCH palette generation, 100% token purity (0 hardcoded hex), and WCAG AA/AAA compliance.
- 🔄 **Server-Driven Island Refresh**: `island.refresh()` re-renders a single island on the server and morphs the DOM in-place, preserving scroll and focus.
- 📊 **Server-Side Data Contract**: `IslandDataRequest` → `IslandDataResult<T>` with safe LINQ/EF Core translation for 100,000+ row grids.
- ✂️ **Component Eject Tooling**: `npx laughtale eject <component>` to own and customize any component's source code outright.
- 📦 **100% Opt-In Modularity**: `LaughTale.Core` has zero dependency on `LaughTale.Components`; pay only for what you install.
- ⚡ **Zero SignalR Overhead**: 100% stateless HTTP architecture with optional `l-poll` or Server-Sent Events (SSE) for live push.

---

## 🏛️ Projects in this Solution

| Project | Purpose | Target |
|---|---|---|
| **`LaughTale.Core`** | Standalone Islands runtime: TagHelpers, `AddLaughTale()`, CSP, `[IslandPrivate]`, `IslandDataResult`, and server refresh endpoints. | `net10.0` |
| **`LaughTale.Components`** | 76 Enterprise UI TagHelpers (Forms, Overlays, DataGrids, Trees, Charts, Menus, Theming). | `net10.0` |
| **`LaughTale.Markdown`** | Markdig content collection pipeline with embedded Island support. | `net10.0` |
| **`LaughTale.Generators`** | Roslyn Source Generator & Diagnostic Analyzers (`SMI001`–`SMI008`). | `netstandard2.0` |
| **`LaughTale.Templates`** | `dotnet new` project templates (`laughtale-web`, `laughtale-island`). | `net10.0` |
| **`LaughTale.Cli`** | Global .NET CLI and NPM binary (`npx laughtale`) for listing and ejecting components. | `net10.0` / Node.js |
| **`LaughTale.Client`** | Recommended path: the split ESM build (`dist/index.mjs`, ~8 KB gz entry - each of the 76 components is its own lazily-loaded chunk, downloaded only when actually used), router, adapters, and Tailwind preset. A monolithic IIFE bundle with everything inlined (`dist/index.js`, ~373 KB gz, published at the `laughtale/iife` subpath) is also available as a script-tag-droppable escape hatch for pages with no bundler - not the default. | `laughtale` (NPM) |
| **`LaughTale.Showcase`** | Enterprise showcase demonstrating all components, theming, and hydration modes. | `net10.0` Web App |
| **`LaughTale.Docs`** | Interactive documentation portal with runnable live examples. | `net10.0` Web App |
| **`LaughTale.Tests`** | Comprehensive automated test suite (**200 .NET tests, 268 JS tests, 0 failures**). | `net10.0` |

---

## 🚀 Quickstart

### 1. Scaffold a New App
```bash
# Install the templates
dotnet new install LaughTale.Templates

# Create a new LaughTale project
dotnet new laughtale-web -n MyAwesomeApp
cd MyAwesomeApp

# Run the app
dotnet run
```

### 2. Configure in `Program.cs`
```csharp
using LaughTale.Core.Extensions;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddRazorPages();

// Register LaughTale with optional sub-options
builder.Services.AddLaughTale(options =>
{
    options.ViewTransitions.Enabled = true;
    options.Prefetch.Enabled = true;
    options.Csp.Enabled = true;
    options.ThemeStudio.Enabled = builder.Environment.IsDevelopment();
});

var app = builder.Build();
app.UseStaticFiles();
app.MapRazorPages();
app.MapLaughTaleIslandRefresh();

app.Run();
```

---

## 🔒 Security & Authorization (v4+)

LaughTale enforces **deny-by-default authorization** (LT-2204). Islands must be explicitly declared public or protected with an ASP.NET Core authorization policy:

```csharp
// Option A: Attribute on props
[Island("user-profile")]
[IslandAuthorize("UserPolicy")]
public record UserProfileProps(string Username);

// Option B: Public island declaration
[Island("public-counter")]
[IslandAllowAnonymous]
public record PublicCounterProps(int Count);

// Option C: Global configuration
builder.Services.AddLaughTale(options =>
{
    options.Refresh.RequirePolicy("admin-panel", "AdminOnly");
    options.Refresh.AllowAnonymous("public-counter");
});
```

See [docs/migration/041-deny-by-default.md](docs/migration/041-deny-by-default.md) for full migration details, field allowlist policies, and emergency compatibility options.

---

## 📄 License & Attribution

Distributed under the [MIT License](LICENSE). See [NOTICE](NOTICE) for third-party open-source notices.
