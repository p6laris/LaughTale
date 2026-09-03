# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### BREAKING
- **Deny-by-Default Island Authorization (LT-2204 / Spec 041):**
  - Undeclared islands are now refused by default across all five execution paths (TagHelpers, TagHelperBase, Generated TagHelpers, Island Refresh Endpoint, and `IIslandAuthorizationRegistry`).
  - Refresh endpoints return `HTTP 403 Forbidden` with an empty response body on any unauthorized request (`Denied`, `Undeclared`, or `Undeterminable`), identical byte-for-byte to prevent authorization oracle leaks.
  - TagHelpers suppress markup rendering entirely (`output.SuppressOutput()`) when unauthorized or when running outside an authorized request container.
  - Antiforgery validation fails closed: returns `HTTP 400 Bad Request` if `RequireAntiforgery = true` and `IAntiforgery` service is missing from the container.
- **Mandatory Field Allowlist Policies (LT-2204 / Spec 041):**
  - Removed `= null` default from `allowedFields` on `ToIslandDataResult`, `ToIslandDataResultAsync`, and `ApplyIslandCriteria`; parameter is now a required `IslandFieldPolicy` (omission produces a compile-time error).
  - Added `RefusedFields` init-only property to `IslandDataResult<T>`. All un-allowlisted or non-existent properties requested by clients are recorded into `RefusedFields` as a flat string list with no distinguishing reason codes (anti-oracle guarantee).
  - `MapIslandData` overloads now require `IslandFieldPolicy` and `islandName`, evaluating authorization and antiforgery strictly before invoking application `queryProvider` delegates.
- **Emergency Compatibility Switch:**
  - Added `options.Refresh.AllowUndeclaredIslands` (default `false`) and `options.Refresh.AllowAnonymous(string)` to restore v3 permissive behavior during migration. Emits a deduplicated warning once per island name.
- **Island Lifecycle Teardown on In-Place Refresh (LT-902):**
  - `laughtale:unmount` event now dispatches on an island container when it is refreshed in-place or retried, in addition to client router navigation.
  - Active mounts are now torn down prior to remounting: their `ctx.signal` is aborted, `ctx.onCleanup` callbacks are executed, and returned unmount functions run, preventing unbounded accumulation of event handlers, observers, and timers across refreshes.

### Fixed
- **Island Teardown & Lifecycle Leak Prevention (Feature 040 / LT-902):**
  - **Defect Class:** Resolved unbounded resource accumulation where in-place island replacement (`refreshIsland()`) re-ran mounts without tearing down previous mount scopes, causing handlers to fire once per accumulated refresh and leaking memory on long-lived pages.
  - **User-Visible Effect:** Prevented duplicate execution of click, keyboard, and global window/document event listeners upon component refreshes; eliminated memory growth caused by orphaned `ResizeObserver`, `MutationObserver`, and background timers.
  - **Library-Wide Resource Cleanup:**
    - Brought all element and observer disconnects to 100% (`observersDisconnected: 2 / 2`).
    - Captured and bound 100% of timers library-wide under `ctx.onCleanup` or signal abort (`timersUncleared: 0`).
    - Maintained 100% signal binding across all event handlers (`listenersUnmanaged: 0`).
  - **Repaired Verification Mechanisms:**
    - Corrected `audit-metrics.mjs` unmanaged-listener scanner using balanced-parenthesis AST argument parsing, eliminating false-positive lint artifacts (corrected baseline from 374 artificial to 3 truthful, then down to 0).
    - Patched `leak-harness.test.ts` prototype interception and island registry lifecycle, restoring actual leak detection across window, document, and element targets.
    - Updated `verify-contracts.mjs` (`npm run lint:contracts`) to strictly enforce signal-bound listeners, observer disconnection, and interval clearing at commit and CI gate boundaries.

### Security
- **Safe Component Rendering Engine:**
  - Eliminated raw HTML injection defect across client component templates by migrating all 76 components to the safe tagged template primitive (`html`, `setHtml`, `safeUrl`, `attr`).
  - Automatic HTML entity escaping for dynamic expressions in component rendering templates.
  - Enforced zero-sink architecture contract (`npm run lint:contracts`) rejecting `.innerHTML`, `.outerHTML`, `insertAdjacentHTML`, and `document.write` across all components.
  - Integrated contract linting into CI pipeline (`.github/workflows/ci.yml`) and pre-commit adoption ratchet to prevent defect reintroduction.

## [3.0.0] - 2026-08-30

### Added
- **Security & Sandboxing:**
  - Automated CSP nonce generation, injection, and middleware.
  - Client command registry with action sandboxing.
  - Safe expression evaluator protecting against prototype pollution and code injection.
  - 25-vector OWASP URL sanitization filter matrix.
- **Lifecycle & Memory Management:**
  - `IslandScope` teardown management with LIFO disposal.
  - Shared `IntersectionObserver` across all lazy islands.
  - Exponential backoff retry engine for failed island chunk imports.
  - View Transitions router with same-origin validation, scroll restoration, and abortion handling.
- **Architecture & DX:**
  - Source generator for compile-time island registration and tag helper snapshot generation.
  - Universal JSON serialization engine (`IslandJson`) with custom converters.
  - Type-safe component contracts and states.
- **Design System & Aura Components:**
  - Headless `useVirtualizer`, `useScrollLock`, and `useResizeObserver` composables.
  - Progressive enhancement SSR markup for 70+ components.
  - OKLCH 11-shade palette ramp generator and theme persistence engine.
  - Live WCAG contrast ratio compliance calculator.
- **Performance:**
  - Benchmark harness measuring microtask hydration and rendering throughput.
  - Predictive link prefetching engine with in-memory caching.
  - Batched style injection using `document.adoptedStyleSheets`.
  - Icon subset SVG sprite generator with FNV-1a content hashing.
  - Brotli/Gzip response compression, immutable cache headers, and `<laughtale-preload />` tag helper.
- **Accessibility:**
  - Persistent polite and assertive live region screen reader announcer.
  - WAI-ARIA 1.2 roving tabindex navigation across composite widgets.
  - Reduced motion detection and automatic View Transition animation gating.
  - Accessible focus management and route change announcements on navigation.

### Changed
- Refactored library branding to LaughTale.
- Upgraded .NET target to .NET 10.0 and TypeScript target to ES2022.
