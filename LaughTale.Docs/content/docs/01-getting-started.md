---
title: "Getting Started with LaughTale"
description: "High-performance Islands Architecture framework for .NET 10 & TypeScript"
order: 1
section: "Core Concepts"
---

# Getting Started with LaughTale

Welcome to **LaughTale**, the premier Islands Architecture framework designed from the ground up for **.NET 10** and **TypeScript**.

LaughTale enables you to combine the speed and SEO of pure **Server-Side Rendering (SSR)** with Astro-grade client-side interactivity, multi-framework adapters, and 100% opt-in modularity.

---

## ⚡ Scaffolding a New Project

The easiest way to start is using the official `dotnet new` template:

```bash
# Install the project templates
dotnet new install LaughTale.Templates

# Generate a new Razor Pages web application with LaughTale preconfigured
dotnet new laughtale-web -n MyWebApp
cd MyWebApp

# Run the app
dotnet run
```

---

## 📦 Manual Installation

Add the core LaughTale packages to your ASP.NET Core web application:

```bash
dotnet add package LaughTale.Core
dotnet add package LaughTale.Components
```

In your `Program.cs`, register LaughTale services with optional feature flags:

```csharp
using LaughTale.Core.Extensions;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddRazorPages();

// Configure LaughTale: everything non-essential defaults to off
builder.Services.AddLaughTale(options =>
{
    options.ViewTransitions.Enabled = true;
    options.Prefetch.Enabled = false;
    options.Csp.Enabled = true;
    options.ThemeStudio.Enabled = builder.Environment.IsDevelopment();
});

var app = builder.Build();
app.UseStaticFiles();
app.MapRazorPages();

// Optional: Enable server-driven island re-rendering
app.MapLaughTaleIslandRefresh();

app.Run();
```

---

## 🏗️ Declaring Your First Island

### 1. In C# (Props Contract)
Define your component props model and decorate it with `[Island]`:

```csharp
using LaughTale.Core.Attributes;
using LaughTale.Core.Enums;

[Island("interactive-counter", DefaultStrategy = HydrateStrategy.Visible)]
public record CounterProps(int InitialCount, int Step, string Label);
```

### 2. In Razor (TagHelper Markup)
In your `.cshtml` view, render the island:

```razor
<island name="interactive-counter" 
        props="@(new CounterProps(10, 2, "Workers"))" 
        hydrate="Visible">
    <!-- Server-rendered fallback skeleton rendered before JS loads -->
    <div class="skeleton">Loading Counter...</div>
</island>
```

### 3. In TypeScript (Client Island)
In your frontend module (`src/components/counter.ts`):

```typescript
import { IslandContext } from 'laughtale';

export default function CounterIsland(
    container: HTMLElement, 
    props: { initialCount: number; step: number; label: string },
    ctx?: IslandContext
) {
    let count = props.initialCount;
    container.innerHTML = `<button type="button" class="btn">${props.label}: ${count}</button>`;
    
    const btn = container.querySelector('button')!;
    btn.addEventListener('click', () => {
        count += props.step;
        btn.textContent = `${props.label}: ${count}`;
    }, { signal: ctx?.signal });
}
```

---

## 🔄 Hydration Strategies

LaughTale provides 6 declarative hydration modes:

1. `Load`: Hydrates immediately when the window loads.
2. `Idle`: Hydrates during browser idle time via `requestIdleCallback`.
3. `Visible`: Hydrates when scrolled into the viewport using `IntersectionObserver`.
4. `Media`: Hydrates only when a CSS media query matches (e.g. `media="(max-width: 768px)"`).
5. `Interaction`: Hydrates on first user pointerenter or focus.
6. `Never`: Server-only render; no client JS executed.
