# 🏴‍☠️ SoftMax.LaughTale: Spec-Driven Development Roadmap

This document serves as the master tracking board for the step-driven evolution of **SoftMax.LaughTale** into a production-grade Islands Architecture framework for .NET 10 & TypeScript.

---

## 📊 Milestone Tracker

| Phase | Feature / Component | Status | Spec Reference |
|---|---|---|---|
| **Phase 1** | **Multi-Type Prop Revival Engine** | 🟢 Completed | [Spec 1](#spec-1-multi-type-prop-revival-engine) |
| **Phase 2** | **Network Resilience with Query Retry** | 🟢 Completed | [Spec 2](#spec-2-network-resilience-with-query-retry) |
| **Phase 3** | **Child-Targeted Viewport Observer** | 🟢 Completed | [Spec 3](#spec-3-child-targeted-viewport-observer) |
| **Phase 4** | **HTML Streaming SSR Support** | 🟢 Completed | [Spec 4](#spec-4-html-streaming-ssr-support) |
| **Phase 5** | **Preact / React Multi-Framework Adapter** | 🟢 Completed | [Spec 5](#spec-5-multi-framework-adapters) |
| **Phase 6** | **Markdig Markdown & Content Collections** | 🟢 Completed | [Spec 6](#spec-6-markdig-markdown--content-collections) |
| **Phase 7** | **Dedicated Documentation Portal (`SoftMax.LaughTale.Docs`)** | 🟢 Completed | [Spec 7](#spec-7-dedicated-docs-portal) |

---

## 📝 Detailed Specifications

### Spec 1: Multi-Type Prop Revival Engine
* **Goal**: Seamlessly pass rich C# types (`DateTime`, `DateOnly`, `Guid`, `byte[]`, `Dictionary`, `HashSet`, `BigInteger`) to TypeScript islands without type loss or manual JSON serialization hacks.
* **Server**: `IslandJson.cs` encodes properties with numeric discriminators (`0: Object, 1: Array, 2: RegExp, 3: Date, 4: Map, 5: Set, 6: BigInt, 7: URL, 8: Uint8Array`).
* **Client**: `reviver.ts` parses and reconstructs native JavaScript objects (`Date`, `Uint8Array`, `Map`, `Set`).
* **Status**: ✅ Verified (`reviver.ts`, `IslandJson.cs`)

---

### Spec 2: Network Resilience with Query Retry
* **Goal**: Prevent permanent island mount failures on mobile devices caused by transient network drops during dynamic script imports.
* **Client**: `retry.ts` exports `importWithRetry(url, maxRetries = 3)` with exponential backoff and query timestamp cache-busters (`?island-retry=${timestamp}`).
* **Status**: ✅ Verified (`retry.ts`, `hydrator.ts`)

---

### Spec 3: Child-Targeted Viewport Observer
* **Goal**: Support `display: contents` on island root elements without breaking `IntersectionObserver` viewport detection.
* **Client**: `visible.ts` attaches observer to all `container.children` rather than only the container wrapper.
* **Status**: ✅ Verified (`hydrator.ts:hydrateVisible`)

---

### Spec 4: HTML Streaming SSR Support
* **Goal**: Ensure islands with projected server slots never attempt client hydration while ASP.NET Core is still streaming HTML chunks over HTTP.
* **Server**: Emits trailing comment marker `<!--island:end:id-->`.
* **Client**: Uses `MutationObserver` to delay hydration until the end marker is encountered in the DOM.
* **Status**: ✅ Verified (`streaming.ts`, `Island.razor`, `IslandTagHelper.cs`)

---

### Spec 5: Multi-Framework Adapters (Preact / React & Vue)
* **Goal**: Enable developers to write islands in Preact/React JSX or Vue alongside Vanilla TypeScript.
* **Client**: `src/adapters/preact.ts` (3 KB Preact adapter supporting JSX and hooks) and `src/adapters/vanilla.ts`.
* **Roslyn Generator & Tags**: Supported `Framework="Preact"` in TagHelpers and Razor components.
* **Status**: ✅ Verified (`preact.ts`, `vanilla.ts`, `IslandFramework.cs`)

---

### Spec 6: Markdig Markdown & Content Collections (`SoftMax.LaughTale.Markdown`)
* **Goal**: Astro-style content collections and Markdown processing with embedded live islands in .NET.
* **Architecture**:
  - `IslandMarkdownPipeline`: Markdig pipeline with YAML frontmatter, auto-heading slugs, code highlighting, and island tag preservation.
  - `ContentCollection<TMetadata>`: Type-safe repository reading `.md` files into strongly-typed C# records.
  - `TableOfContents`: Extracted heading tree `{ Level, Slug, Text }`.
* **Status**: ✅ Verified (`SoftMax.LaughTale.Markdown`)

---

### Spec 7: Dedicated Docs Portal (`SoftMax.LaughTale.Docs`)
* **Goal**: An official enterprise documentation portal web app for SoftMax.LaughTale built entirely on `SoftMax.LaughTale.Markdown`.
* **Architecture**:
  - New ASP.NET Core project in solution: `SoftMax.LaughTale.Docs/`.
  - Documentation pages (`content/docs/*.md`): Getting Started, Hydration Strategies, View Transitions, Server Slots, Content Collections.
  - PrimeVue Aura theme with sticky TOC sidebar, dark mode support, and live embedded islands in the docs.
* **Status**: ✅ Verified & Running live on `http://localhost:5001`
