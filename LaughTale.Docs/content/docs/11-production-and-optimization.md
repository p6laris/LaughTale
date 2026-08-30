---
title: "Production & Optimization"
description: "Performance budgets, streaming SSR, Real User Monitoring (RUM) benchmarks, trimming, and Native AOT readiness in .NET 10."
order: 11
section: "Core Concepts"
---

# Production & Optimization

LaughTale is engineered from the ground up for high-throughput enterprise workloads and strict performance budgets.

---

## ⚡ Performance Budgets & Bundle Metrics

LaughTale enforces a strict performance budget on its client runtime:
* **Standalone Core Runtime**: ~1.4 KB gzipped (Hydrator, Registry, Lifecycle, Scope).
* **Full Multi-Framework Runtime**: ~17.6 KB gzipped (All adapters, directives engine, and token ramp generators).
* **Tree-Shaking**: Only the components and adapters you import into your client bundle are shipped to end users.

---

## 🌊 HTML Streaming SSR

LaughTale seamlessly integrates with ASP.NET Core and Blazor HTML Streaming SSR (`<Suspense>`-like behavior).

When a server view streams chunks progressively over an HTTP/2 connection:
1. The server renders the initial shell and fallback placeholders immediately.
2. The browser receives island markup with `data-streaming="pending"`.
3. LaughTale's hydrator waits for the child content to finish streaming via `awaitStreamingReady(container)` before mounting the client module, preventing hydration mismatches.

---

## 📊 Real User Monitoring (RUM) Benchmarks

LaughTale emits high-resolution browser performance marks using the native `performance.mark` and `performance.measure` APIs:

- `laughtale:hydrate:start:{name}`
- `laughtale:hydrate:end:{name}`
- `laughtale:hydrate:{name}` (Duration measurement)

### Capturing Metrics in JavaScript
```typescript
import { getHydrationMetrics, calculatePercentiles } from 'laughtale';

// Retrieve all recorded hydration metrics
const metrics = getHydrationMetrics();
const stats = calculatePercentiles(metrics);

console.log(`P50 Hydration Time: ${stats.p50}ms`);
console.log(`P95 Hydration Time: ${stats.p95}ms`);
console.log(`P99 Hydration Time: ${stats.p99}ms`);
```

---

## 🔒 Native AOT & Trimming in .NET 10

When deploying containerized ASP.NET Core applications compiled with **Native AOT (`PublishAot=true`)**:
* `LaughTale.Core` avoids unconstrained reflection in critical paths.
* All `[Island]` props models generate static C# TagHelpers and TypeScript interfaces via the Roslyn source generator, ensuring complete trim safety and rapid startup times (< 15ms cold start).
