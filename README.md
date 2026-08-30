# 🏝️ LaughTale 3.0

An enterprise-grade, high-performance **Islands Architecture framework for ASP.NET Core & Blazor SSR (.NET 10 + TypeScript)**.

---

## ⚡ Key Features

- 🚀 **Ultra-Fast First Paint**: 95% of the page is static SSR HTML; interactive islands hydrate on demand.
- 💤 **6 Hydration Strategies**: `Load`, `Idle`, `Visible` (IntersectionObserver), `Media`, `Interaction`, `Never`.
- 🛡️ **Defense-in-Depth Security**: Automated CSP nonces, AST expression sandboxing, and OWASP URL sanitization.
- 🎨 **Enterprise Aura Design System**: 70+ components with dark mode, OKLCH palette generation, and WCAG AA/AAA compliance.
- 📥 **Server Slot Projection**: Pass arbitrary server-rendered HTML into client TypeScript islands seamlessly.
- 🚀 **View Transitions Router**: Smooth page morphing with accessible focus management, prefetching, and reduced-motion support.
- 🔄 **Persistent Islands (`persist="id"`)**: Preserve component DOM subtree and state across client navigations.
- 📊 **Real User Monitoring (RUM)**: Built-in W3C User Timing marks & measures and custom telemetry error handlers.
- ⚡ **Zero SignalR Overhead**: 100% stateless HTTP architecture.

---

## 🏛️ Projects in this Solution

| Project | Purpose | Target |
|---|---|---|
| **`LaughTale.Core`** | Core runtime: `HydrateStrategy`, `<island />` TagHelper, Slots, CSP middleware, and `IslandJson` serializer. | `net10.0` |
| **`LaughTale.Components`** | 70+ Enterprise UI TagHelpers (Forms, Overlays, DataGrids, Trees, Charts, Menus, Theming). | `net10.0` |
| **`LaughTale.Markdown`** | Markdig content collection pipeline with embedded Island support. | `net10.0` |
| **`LaughTale.Generators`** | Roslyn Source Generator & Diagnostic Analyzer (`SMI001`, `SMI002`). | `netstandard2.0` |
| **`LaughTale.Client`** | Client runtime (< 8 KB gzipped), View Transitions router, directives, and composables. | `laughtale` (NPM) |
| **`LaughTale.Showcase`** | Enterprise showcase demonstrating all components, theming, and hydration modes. | `net10.0` Web App |
| **`LaughTale.Docs`** | Interactive documentation portal with runnable live examples. | `net10.0` Web App |
| **`LaughTale.Tests`** | Comprehensive test suite (185 .NET tests, 237 JS tests). | `net10.0` |

---

## 🚀 Quickstart

```bash
# Clone the repository
git clone https://github.com/laughtale/LaughTale.git
cd LaughTale

# Run the Showcase & Docs
./run.ps1
```

---

## 📄 License

Distributed under the [MIT License](LICENSE). Copyright (c) 2026 LaughTale.
