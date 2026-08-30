---
title: "Getting Started with LaughTale"
description: "Architecture philosophy, quickstart scaffolding, manual installation, and end-to-end island development for ASP.NET Core & TypeScript."
order: 1
section: "Core Concepts"
---

# Getting Started with LaughTale

Welcome to **LaughTale**, an enterprise-grade, high-performance **Islands Architecture framework for ASP.NET Core & Blazor SSR (.NET 10 + TypeScript)**.

LaughTale bridges the gap between ultra-fast, SEO-optimized **Server-Side Rendering (SSR)** and modern, component-driven client-side interactivity. By adopting an Islands Architecture, 95% of your page renders as static, zero-JavaScript HTML, while isolated interactive widgets ("islands") hydrate independently on demand.

---

## ⚡ Architecture Philosophy

Traditional .NET frontend approaches force engineering teams into difficult trade-offs:
- **Full Client-Side SPAs (React / Angular / Vue)**: Heavy initial JavaScript payloads, slower First Contentful Paint (FCP), complex API client generation, and SEO challenges.
- **Blazor WebAssembly**: Requires downloading the entire .NET runtime (megabytes of WebAssembly binaries) to the browser before the app becomes interactive.
- **Blazor Server**: Requires a persistent, stateful WebSocket / SignalR connection for every active user tab, incurring significant server memory overhead and latency on unstable network connections.

**LaughTale delivers the optimal balance:**
1. **100% Stateless HTTP Architecture**: Zero SignalR server memory overhead; scales effortlessly across load-balanced serverless or containerized environments.
2. **Selective Client Hydration**: JavaScript is executed **only** for the exact interactive components that require it, using 6 distinct scheduling strategies (`Load`, `Idle`, `Visible`, `Media`, `Interaction`, `Never`).
3. **Multi-Framework Agnostic**: Mount your choice of **React 18/19**, **Vue 3**, **Svelte 4/5**, **Preact**, or **Vanilla TypeScript** inside the same Razor page.
4. **Defense-in-Depth Security**: Compile-time Roslyn diagnostics (`LTI001`–`LTI004`), automated CSP nonces, AST expression sandboxing, and output cache privacy protection (`[IslandPrivate]`).

---

## 🚀 Quickstart: Scaffolding a New Project

The quickest way to start is using the official `LaughTale.Templates` package:

```bash
# 1. Install the LaughTale project templates
dotnet new install LaughTale.Templates

# 2. Scaffold a new Razor Pages web application with LaughTale preconfigured
dotnet new laughtale-web -n MyAwesomeApp
cd MyAwesomeApp

# 3. Restore and run the application
dotnet run
```

Navigate to `http://localhost:5000` to explore the live interactive application.

---

## 📦 Manual Installation in an Existing Project

To add LaughTale to an existing ASP.NET Core (.NET 10) application:

### Step 1: Install NuGet Packages
```bash
dotnet add package LaughTale.Core
dotnet add package LaughTale.Components
```

### Step 2: Install the Client Runtime
```bash
npm install laughtale
```

### Step 3: Configure Services in `Program.cs`
Register LaughTale services with full configuration options:

```csharp
using LaughTale.Core.Extensions;

var builder = WebApplication.CreateBuilder(args);

// Register Razor Pages or MVC
builder.Services.AddRazorPages();

// Register LaughTale Core & Optional Subsystems
builder.Services.AddLaughTale(options =>
{
    // Enable SPA-like View Transitions across MPA navigations
    options.ViewTransitions.Enabled = true;
    
    // Enable intelligent hover-based viewport prefetching
    options.Prefetch.Enabled = true;
    options.Prefetch.HoverDelayMs = 65;
    
    // Enable automated Content Security Policy (CSP) nonces
    options.Csp.Enabled = true;
    options.Csp.EnforceHeader = true;
    
    // Enable runtime Theme Studio in Development environment
    options.ThemeStudio.Enabled = builder.Environment.IsDevelopment();
});

var app = builder.Build();

app.UseHttpsRedirection();
app.UseStaticFiles();

// Register LaughTale CSP middleware (if enabled)
app.UseLaughTaleCsp();

app.UseRouting();
app.UseAuthorization();

app.MapRazorPages();

// Map server-driven island re-rendering endpoint (/_laughtale/island/{name})
app.MapLaughTaleIslandRefresh();

app.Run();
```

### Step 4: Import TagHelpers in `_ViewImports.cshtml`
Add the LaughTale TagHelper directives to your `Pages/_ViewImports.cshtml` or `Views/_ViewImports.cshtml`:

```razor
@addTagHelper *, Microsoft.AspNetCore.Mvc.TagHelpers
@addTagHelper *, LaughTale.Core
@addTagHelper *, LaughTale.Components
```

---

## 🏗️ Anatomy of an Island: End-to-End Example

Building an island involves three simple steps:

### 1. C# ViewModel / Props Contract
Define your component's data model as a C# record or class decorated with the `[Island]` attribute:

```csharp
using LaughTale.Core.Attributes;
using LaughTale.Core.Enums;

namespace MyApp.Models;

[Island("analytics-chart", DefaultStrategy = HydrateStrategy.Visible)]
public record AnalyticsChartProps(
    string MetricName,
    double CurrentValue,
    List<double> HistoricalData,
    string Unit = "ms"
);
```

### 2. Razor View Markup (`.cshtml`)
Render the island using either the universal `<island>` TagHelper or the strongly-typed generated TagHelper:

```razor
@page
@model MyApp.Pages.IndexModel

<div class="dashboard-grid">
    <!-- Hydrates only when scrolled into the viewport -->
    <island name="analytics-chart" 
            props="@(new AnalyticsChartProps("API Gateway Latency", 4.2, new() { 3.8, 4.1, 4.2, 5.0, 4.2 }))" 
            hydrate="Visible"
            class="chart-card">
        
        <!-- SSR Fallback Skeleton (Rendered on Server, displayed until client JS hydrates) -->
        <div class="chart-skeleton">
            <div class="skeleton-bar animate-pulse">Loading Live Telemetry Chart...</div>
        </div>
    </island>
</div>
```

### 3. Client-Side TypeScript Component
In your client entry (`src/components/analytics-chart.ts`):

```typescript
import { IslandContext } from 'laughtale';

interface ChartProps {
    metricName: string;
    currentValue: number;
    historicalData: number[];
    unit: string;
}

export default function AnalyticsChart(
    container: HTMLElement, 
    props: ChartProps, 
    ctx?: IslandContext
) {
    // Render client interactive canvas / SVG
    container.innerHTML = `
        <div class="p-card">
            <h3>${props.metricName}</h3>
            <div class="metric-value">${props.currentValue} ${props.unit}</div>
            <button type="button" class="p-button p-button-sm">Inspect Data</button>
        </div>
    `;

    const btn = container.querySelector('button')!;
    
    // Automatically cleaned up when island unmounts via AbortSignal
    btn.addEventListener('click', () => {
        alert(`Historical Data Points: ${props.historicalData.join(', ')}`);
    }, { signal: ctx?.signal });

    // Optional unmount cleanup hook
    return () => {
        console.log(`[AnalyticsChart] Island '${ctx?.name}' cleanly torn down.`);
    };
}
```

---

## 🎯 Next Guides

* [Hydration Strategies & Lifecycle](/doc/02-hydration-strategies) — Deep dive on all 6 hydration modes.
* [View Transitions & MPA Router](/doc/03-view-transitions) — Seamless SPA fluidity for Multi-Page apps.
* [Server-Driven Refresh & DOM Morphing](/doc/04-server-refresh-and-morphing) — Re-render server islands on demand without full page reloads.
* [Entity Framework Core Data Contracts](/doc/05-data-contracts-and-efcore) — Handle 100,000+ row datasets with server-side sorting and filtering.
* [Multi-Framework Adapters](/doc/06-multi-framework-adapters) — Mount React, Vue, Svelte, and Preact components.
* [Declarative Directives (`l-*`)](/doc/07-declarative-directives) — Build client reactivity directly in Razor HTML without writing separate TypeScript files.
