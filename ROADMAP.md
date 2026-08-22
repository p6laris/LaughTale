# 🏴‍☠️ SoftMax.LaughTale: Spec-Driven Development Roadmap

This document serves as the master tracking board for the step-driven evolution of **SoftMax.LaughTale** into a production-grade Islands Architecture framework for .NET 10 & TypeScript.

---

## 📊 Milestone Tracker

| Phase | Feature / Component | Status | Spec Reference |
|---|---|---|---|
| **Phase 1** | **Multi-Type Prop Revival Engine** | 🟡 Pending | [Spec 1](#spec-1-multi-type-prop-revival-engine) |
| **Phase 2** | **Network Resilience with Query Retry** | ⚪ Pending | [Spec 2](#spec-2-network-resilience-with-query-retry) |
| **Phase 3** | **Child-Targeted Viewport Observer** | ⚪ Pending | [Spec 3](#spec-3-child-targeted-viewport-observer) |
| **Phase 4** | **HTML Streaming SSR Support** | ⚪ Pending | [Spec 4](#spec-4-html-streaming-ssr-support) |
| **Phase 5** | **Preact / React Multi-Framework Adapter** | ⚪ Pending | [Spec 5](#spec-5-multi-framework-adapters) |
| **Phase 6** | **Markdig Markdown & Content Collections** | ⚪ Pending | [Spec 6](#spec-6-markdig-markdown--content-collections) |
| **Phase 7** | **Dedicated Documentation Portal (`SoftMax.LaughTale.Docs`)** | ⚪ Pending | [Spec 7](#spec-7-dedicated-docs-portal) |

---

## 📝 Detailed Specifications

### Spec 1: Multi-Type Prop Revival Engine
* **Goal**: Seamlessly pass rich C# types (`DateTime`, `DateOnly`, `Guid`, `byte[]`, `Dictionary`, `HashSet`, `BigInteger`) to TypeScript islands without type loss or manual JSON serialization hacks.
* **Server**: `IslandJson.cs` encodes properties with numeric discriminators (`0: Object, 1: Array, 2: RegExp, 3: Date, 4: Map, 5: Set, 6: BigInt, 7: URL, 8: Uint8Array`).
* **Client**: `reviver.ts` parses and reconstructs native JavaScript objects (`Date`, `Uint8Array`, `Map`, `Set`).
* **Acceptance Criteria**:
  - [ ] `IslandJson.SerializeProps()` outputs discriminator-tagged JSON.
  - [ ] Client revives `DateOnly`/`DateTime` into native JS `Date`.
  - [ ] Client revives `byte[]` into `Uint8Array`.
  - [ ] Client revives `Dictionary<K, V>` into native `Map`.
  - [ ] Client revives `HashSet<T>` into native `Set`.

---

### Spec 2: Network Resilience with Query Retry
* **Goal**: Prevent permanent island mount failures on mobile devices caused by transient network drops during dynamic script imports.
* **Client**: `retry.ts` exports `importWithRetry(url, maxRetries = 3)` with exponential backoff and query timestamp cache-busters (`?island-retry=${timestamp}`).
* **Acceptance Criteria**:
  - [ ] Dynamic imports retry up to 3 times before throwing.
  - [ ] Cache-busting query parameter is appended on retry.

---

### Spec 3: Child-Targeted Viewport Observer
* **Goal**: Support `display: contents` on island root elements without breaking `IntersectionObserver` viewport detection.
* **Client**: `visible.ts` attaches observer to all `container.children` rather than only the container wrapper.
* **Acceptance Criteria**:
  - [ ] Grid and flex layouts using `display: contents` hydrate immediately when scrolled into view.

---

### Spec 4: HTML Streaming SSR Support
* **Goal**: Ensure islands with projected server slots never attempt client hydration while ASP.NET Core is still streaming HTML chunks over HTTP.
* **Server**: Emits trailing comment marker `<!--island:end:id-->`.
* **Client**: Uses `MutationObserver` to delay hydration until the end marker is encountered in the DOM.
* **Acceptance Criteria**:
  - [ ] Streamed slot contents are fully rendered before island mount executes.

---

### Spec 5: Multi-Framework Adapters (Preact / React & Vue)
* **Goal**: Enable developers to write islands in Preact/React JSX or Vue alongside Vanilla TypeScript.
* **Client**: Add `src/adapters/preact.ts` (3 KB Preact adapter supporting JSX and hooks) and `src/adapters/vanilla.ts`.
* **Roslyn Generator**: Support `framework="Preact"` in TagHelpers and C# attributes.
* **Acceptance Criteria**:
  - [ ] Preact JSX components render inside `<island name="..." framework="Preact" />`.
  - [ ] Server slots project into Preact `children` / `slots`.

---

### Spec 6: Markdig Markdown & Content Collections (`SoftMax.LaughTale.Markdown`)
* **Goal**: Astro-style content collections and Markdown processing with embedded live islands in .NET.
* **Architecture**:
  - `IslandMarkdownPipeline`: Markdig pipeline with YAML frontmatter, auto-heading slugs, code highlighting, and island tag preservation.
  - `ContentCollection<TMetadata>`: Type-safe repository reading `.md` files into strongly-typed C# records.
  - `TableOfContents`: Extracted heading tree `{ Level, Slug, Text }`.
* **Acceptance Criteria**:
  - [ ] YAML frontmatter is parsed into typed C# models via YamlDotNet.
  - [ ] `<island name="..." />` tags within markdown files hydrate into interactive client components.
  - [ ] Headings automatically receive slugs and produce a Table of Contents model.

---

### Spec 7: Dedicated Docs Portal (`SoftMax.LaughTale.Docs`)
* **Goal**: An official enterprise documentation portal web app for SoftMax.LaughTale built entirely on `SoftMax.LaughTale.Markdown`.
* **Architecture**:
  - New ASP.NET Core project in solution: `SoftMax.LaughTale.Docs/`.
  - Documentation pages (`content/docs/*.md`): Getting Started, Hydration Strategies, Slots & Persistence, Multi-Frameworks, Content Collections.
  - PrimeVue Aura theme with sticky TOC sidebar, dark mode support, and live embedded islands in the docs.
* **Acceptance Criteria**:
  - [ ] `SoftMax.LaughTale.Docs` project is registered in `SoftMax.LaughTale.slnx`.
  - [ ] Docs load dynamically from `.md` files with live interactive demo islands.
