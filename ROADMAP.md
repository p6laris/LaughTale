# 🏴‍☠️ SoftMax.LaughTale: Spec-Driven Development Roadmap (Branch: `comp`)

This document serves as the master tracking board for the step-driven evolution of **SoftMax.LaughTale** into a production-grade Islands Architecture framework for .NET 10 & TypeScript.

---

## 📊 Milestone Tracker (Branch: `comp`)

| Phase | Feature / Component | Status | Spec Reference |
|---|---|---|---|
| **Phase 1** | **Multi-Type Prop Revival Engine** | 🟢 Completed | [Spec 1](#spec-1-multi-type-prop-revival-engine) |
| **Phase 2** | **Network Resilience with Query Retry** | 🟢 Completed | [Spec 2](#spec-2-network-resilience-with-query-retry) |
| **Phase 3** | **Child-Targeted Viewport Observer** | 🟢 Completed | [Spec 3](#spec-3-child-targeted-viewport-observer) |
| **Phase 4** | **HTML Streaming SSR Support** | 🟢 Completed | [Spec 4](#spec-4-html-streaming-ssr-support) |
| **Phase 5** | **Preact / React Multi-Framework Adapter** | 🟢 Completed | [Spec 5](#spec-5-multi-framework-adapters) |
| **Phase 6** | **Markdig Markdown & Content Collections** | 🟢 Completed | [Spec 6](#spec-6-markdig-markdown--content-collections) |
| **Phase 7** | **Dedicated Documentation Portal (`SoftMax.LaughTale.Docs`)** | 🟢 Completed | [Spec 7](#spec-7-dedicated-docs-portal) |
| **Phase 8** | **Rich Declarative Directives Engine (`l-*`)** | 🟡 In Progress | [Spec 8](#spec-8-rich-declarative-directives-engine) |
| **Phase 9** | **Real Enterprise Components Library (`SoftMax.LaughTale.Components`)** | ⚪ Pending | [Spec 9](#spec-9-real-enterprise-components-library) |
| **Phase 10**| **Interactive Docs & Showcase for Enterprise Components** | ⚪ Pending | [Spec 10](#spec-10-docs--showcase-integration) |

---

## 📝 Detailed Specifications

### Spec 8: Rich Declarative Directives Engine (`l-*`)
* **Goal**: Enable full client-side reactivity and server fragment swapping directly inside C# Razor HTML without creating separate `.ts` or `.js` files.
* **Directives to Implement**:
  - `l-state`: Initializes local reactive state scope using JavaScript `Proxy`.
  - `l-bind`: Binds inner text or attributes to dynamic expressions.
  - `l-model`: Two-way data binding for `<input>`, `<select>`, `<textarea>`.
  - `l-on:event`: Event listeners (`click`, `input`, `change`, `keydown`, `submit`).
  - `l-show` / `l-hide`: Toggles display visibility based on boolean expressions.
  - `l-class`: Dynamic class toggling based on object conditions `l-class='{"active": isActive}'`.
  - `l-style`: Dynamic inline style bindings.
  - `l-get` / `l-post` / `l-put` / `l-delete`: HTMX-style server fragment fetcher.
  - `l-target` / `l-swap`: Targets DOM element and specifies swap mode (`innerHTML`, `outerHTML`, `beforeend`, etc.).
  - `l-trigger`: Custom event triggers with modifiers (`delay:300ms`, `throttle:500ms`, `changed`).
  - `l-indicator`: Shows/hides loading spinner elements during background HTTP fetches.
  - `l-mask`: Pattern-based input masking (`(999) 999-9999`, `9999-99-99`).
  - `l-copy` / `l-feedback`: Clipboard copy utility with temporary feedback text.
  - `l-emit` / `l-listen`: Inter-directive event bus.
  - `LaughTaleDirectiveTagHelper.cs`: C# Razor TagHelper providing IDE Intellisense and validation in Visual Studio / Rider.

---

### Spec 9: Real Enterprise Components Library (`SoftMax.LaughTale.Components`)
* **Goal**: A dedicated library `SoftMax.LaughTale.Components` providing pre-built, production-ready enterprise UI TagHelpers for C# Razor:
  - `<island-stepper ... />`: Multi-step form wizard with validation, linear/non-linear mode, and C# step slots.
  - `<island-timeline ... />`: Interactive event and audit log timeline with expandable detail cards.
  - `<island-camera ... />`: Live WebRTC webcam/mobile camera stream with face framing and snapshot capture.
  - `<island-dropzone ... />`: Enterprise file vault with drag & drop, MIME/extension verification, and image preview.
  - `<island-tree-select ... />`: Searchable hierarchical department and location tree.
  - `<island-datagrid ... />`: Filterable data table with multi-column sorting and pagination.
  - `<island-modal ... />`: Animated server-slot dialog with backdrop blur and ESC dismiss.
  - `<island-toast ... />`: Toast notifications container and dispatcher.
  - `<island-tabs />` & `<island-accordion />`: Accessible tab and accordion components.

---

### Spec 10: Docs & Showcase Integration
* **Goal**: Update `SoftMax.LaughTale.Docs` (`http://localhost:5001`) and `SoftMax.LaughTale.Showcase` (`http://localhost:5000`) with live demos of all enterprise components (Camera, Stepper, Timeline, Dropzone, TreeSelect, DataGrid).
