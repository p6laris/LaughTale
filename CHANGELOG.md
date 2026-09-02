# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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
