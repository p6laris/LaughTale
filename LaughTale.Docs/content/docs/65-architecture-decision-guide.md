---
title: Architecture Decision Guide
description: In-depth architectural comparison between LaughTale Islands, Blazor Server, and Blazor WebAssembly.
category: Architecture & Core
order: 65
---

# Architecture Decision Guide: Islands vs Blazor Server vs WASM

Choosing the right frontend architecture for your ASP.NET Core application depends on requirements for initial load latency, memory consumption, real-time interactivity, and offline support.

---

## 1. Architectural Comparison Matrix

| Feature | LaughTale Islands | Blazor Server | Blazor WebAssembly |
| :--- | :--- | :--- | :--- |
| **Initial Bundle Size** | `< 8 KB` (gzipped core) | `~150 KB` (SignalR client) | `~5 MB - 15 MB` (Mono/Dotnet runtime) |
| **First Contentful Paint (FCP)** | **Sub-50ms** (Pure SSR HTML) | **Fast** (SSR pre-render) | **Slow** (Runtime download required) |
| **Server Memory per User** | **0 MB** (Stateless HTTP) | **100 KB - 500 KB** (Active Circuit) | **0 MB** (Runs on client) |
| **Connection Resilience** | **100% Resilient** (Standard HTTP) | **Fragile** (Disconnect drops UI state) | **100% Resilient** (Offline capable) |
| **Interactive Hydration** | **Selective / Lazy** (`visible`, `idle`, `load`) | **All-or-Nothing** (Entire DOM tree) | **All-or-Nothing** (Entire app runs in WASM) |
| **Multi-Framework Interop** | **Native** (Vanilla, React, Vue, Svelte) | **C# Only** (JS Interop overhead) | **C# Only** (JS Interop overhead) |
| **SEO & Social Crawlers** | **100% Native SSR HTML** | **Pre-rendered SSR** | **Requires Prerendering Server** |

---

## 2. When to Choose LaughTale Islands

1. **High-Throughput Public Web Applications:** E-commerce, content portals, SaaS dashboards, and marketing sites where FCP, Core Web Vitals, and SEO are critical.
2. **Resource-Constrained Server Deployments:** Running thousands of concurrent users on minimal container resources without SignalR circuit state overhead.
3. **Multi-Team & Multi-Ecosystem Development:** Seamlessly integrating rich existing UI libraries (React, Vue, Lit, Vanilla) alongside Razor TagHelpers.

---

## 3. When to Choose Blazor

- **Blazor Server:** Highly internal enterprise intranets with persistent low-latency LAN connections and small user bases where C#-only full-stack code is prioritized over server scalability.
- **Blazor WebAssembly:** Heavy client-side computation, games, or offline-first PWA applications where initial 10MB runtime downloads are acceptable.
