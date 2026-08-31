---
title: Polyglot Multi-Framework Architecture
description: Learn how LaughTale allows React, Vue, Svelte, Preact, and Vanilla TypeScript islands to run concurrently on the same ASP.NET Core page with shared real-time state.
order: 13
icon: globe
category: Multi-Framework Adapters
---

# 🌐 Polyglot Multi-Framework Architecture

In large engineering organizations or legacy migration projects, teams often work with different JavaScript frameworks. LaughTale removes framework lock-in by providing a **Polyglot Islands Architecture**.

You can run **React 19**, **Vue 3**, **Svelte 5**, **Preact**, and **Vanilla TypeScript** side-by-side on the same Razor page — each mounted independently with its own hydration trigger, while communicating seamlessly through a unified event bus.

---

## 🚀 Key Architectural Highlights

- **Framework Independence**: Each island loads only its own minimal runtime bundle when needed.
- **Unified Event Bus**: Cross-island messaging via `emitIslandEvent` and `onIslandEvent` allows React components to trigger state changes in Vue or Svelte without shared global state libraries.
- **Consistent Razor TagHelper Syntax**: All frameworks use the same `<island>` TagHelper with the `framework` attribute.
- **Isolated Error Boundaries**: If a React island encounters an unhandled runtime exception, your Vue and Svelte islands continue functioning without disruption.

---

## 📋 The 5 Supported Framework Adapters

| Framework | TagHelper Syntax | Best Used For | Bundle Impact |
| :--- | :--- | :--- | :--- |
| **Vanilla TS** | `<island framework="Vanilla" />` | Critical telemetry, high-FPS canvas, zero overhead | **0 KB** |
| **React 18 & 19** | `<island framework="React" />` | Complex design system libraries, rich React ecosystems | ~42 KB |
| **Vue 3** | `<island framework="Vue" />` | Form wizards, reactive data tables, Pinia stores | ~34 KB |
| **Svelte 4 & 5** | `<island framework="Svelte" />` | Ultra-fast animated charts, compiled Runes UI | ~16 KB |
| **Preact** | `<island framework="Preact" />` | Lightweight VDOM micro-widgets | **~3 KB** |

---

## 💻 Razor Page Example: 3 Frameworks on 1 Page

```razor
@page
@model DashboardModel
@{
    ViewData["Title"] = "Multi-Framework Dashboard";
}

<div class="grid grid-cols-1 md:grid-cols-3 gap-6">

    <!-- 1. React 19 Sales Telemetry Island -->
    <island name="sales-telemetry" 
            framework="React" 
            props="@Model.SalesData" 
            hydrate="Load" />

    <!-- 2. Vue 3 Reactive Inventory Island -->
    <island name="warehouse-inventory" 
            framework="Vue" 
            props="@Model.InventoryData" 
            hydrate="Visible" />

    <!-- 3. Svelte 5 Real-Time Gauge Island -->
    <island name="system-gauge" 
            framework="Svelte" 
            props="@Model.SystemMetrics" 
            hydrate="Visible" />

</div>
```

---

## 📡 Cross-Island Event Bus Communication

All islands communicate over a lightweight pub/sub bus:

```typescript
import { emitIslandEvent, onIslandEvent } from '@softmax/laughtale-client';

// In your React Island:
function handleSale(amount: number) {
    emitIslandEvent('sale:completed', { amount, timestamp: new Date() });
}

// In your Vue or Svelte Island:
onIslandEvent('sale:completed', (payload) => {
    console.log(`Sale received: $${payload.amount}`);
    updateWarehouseStock();
});
```

---

## 🛠️ Next Steps: Deep Dives by Framework

Explore the dedicated guides for each framework:
- [React 18 & 19 Islands Guide](/doc/06a-react-adapter)
- [Vue 3 Islands Guide](/doc/06b-vue-adapter)
- [Svelte 4 & 5 Islands Guide](/doc/06c-svelte-adapter)
- [Preact (3KB) Islands Guide](/doc/06d-preact-adapter)
- [Pure TypeScript & Vanilla Islands Guide](/doc/06e-vanilla-adapter)
