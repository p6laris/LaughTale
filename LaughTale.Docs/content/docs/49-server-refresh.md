---
title: "Server-Driven Island Refresh"
description: "Re-render individual islands on the server with client DOM morphing"
order: 49
section: "Advanced Architecture"
---

# Server-Driven Island Refresh

LaughTale provides **Server-Driven Island Refresh** (`island.refresh()`), allowing individual components to re-render on the server on demand without a full page reload or heavy WebSocket connection.

---

## Why Server Refresh?

Unlike Blazor Server (which holds a persistent stateful WebSocket connection for the whole page) or Astro Server Islands (which are one-time deferred renders), LaughTale's refresh is:
- **Repeatable & Interaction-Driven**: Triggered anytime by user action or client events.
- **Full ASP.NET Core Backing**: Runs through standard Razor SSR, dependency injection, and authorization.
- **State-Preserving Morphing**: Preserves focus, scroll position, and text selections during DOM morphing.

---

## 🚀 Setup & Usage

### 1. Map Endpoint in `Program.cs`
```csharp
using LaughTale.Core.Endpoints;

var app = builder.Build();
app.UseRouting();

// Registers /_laughtale/island/refresh endpoint
app.MapLaughTaleIslandRefresh();

app.Run();
```

### 2. Trigger Refresh from Client
```typescript
const islandContainer = document.querySelector('[data-island="shopping-cart"]');

if (islandContainer && (islandContainer as any).island) {
    // Re-renders shopping cart from the server with updated props:
    await (islandContainer as any).island.refresh({
        couponCode: "DISCOUNT20"
    });
}
```

During the refresh, the client runtime morphs attributes, text nodes, and child elements smoothly while keeping all event listeners attached via `AbortSignal`.
