---
title: "Getting Started with SoftMax.LaughTale"
description: "High-performance Islands Architecture framework for .NET 10 & TypeScript"
order: 1
section: "Core Concepts"
---

# Getting Started with SoftMax.LaughTale

Welcome to **SoftMax.LaughTale**, the premier Islands Architecture framework designed from the ground up for **.NET 10** and **TypeScript**.

LaughTale enables you to combine the blistering speed and SEO of pure **Server-Side Rendering (SSR)** with Astro-grade client-side interactivity, zero-bundle overhead, and type-safe Content Collections.

---

## ⚡ Live Interactive Stepper

<div style="background: var(--p-surface-50); border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius-lg); padding: 1.5rem; margin: 1.5rem 0;">
    <island name="interactive-counter" props-json='{"initialCount": 42, "step": 1, "label": "Batch Concurrency"}' hydrate="Load"></island>
</div>

---

## 📦 Installation

Add the core LaughTale packages to your ASP.NET Core web application:

```bash
dotnet add package SoftMax.LaughTale.Core
dotnet add package SoftMax.LaughTale.Markdown
```

In your `Program.cs`, register LaughTale services:

```csharp
using SoftMax.LaughTale.Core.Extensions;
using SoftMax.LaughTale.Markdown.Extensions;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddRazorPages();
builder.Services.AddIslands();
builder.Services.AddLaughTaleMarkdown();

var app = builder.Build();
app.UseStaticFiles();
app.MapRazorPages();
app.Run();
```

---

## 🏗️ Declaring Your First Island

In C#, define your component props and decorate it with `[Island]`:

```csharp
using SoftMax.LaughTale.Core.Attributes;
using SoftMax.LaughTale.Core.Enums;

[Island("interactive-counter", DefaultStrategy = HydrateStrategy.Load)]
public record CounterProps(int InitialCount, int Step, string Label);
```

In Razor, use the strongly-typed TagHelper:

```razor
<island name="interactive-counter" 
        props="@(new CounterProps(10, 2, "Workers"))" 
        hydrate="Load">
    <!-- SSR Fallback skeleton rendered on server -->
    <div class="skeleton">Loading Counter...</div>
</island>
```

In TypeScript, define your island component:

```typescript
export default function CounterIsland(container: HTMLElement, props: CounterProps) {
    let count = props.initialCount;
    container.innerHTML = `<button class="btn">${count}</button>`;
    container.querySelector('button')?.addEventListener('click', () => {
        count += props.step;
        container.querySelector('button')!.textContent = count.toString();
    });
}
```
