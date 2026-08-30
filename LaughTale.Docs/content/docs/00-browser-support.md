# Browser Support Floor & Compatibility Matrix (LT-1609)

LaughTale provides modern, zero-dependency client islands with graceful degradation across all major desktop and mobile browser engines.

---

## Minimum Declared Browser Support Floor

| Browser Engine | Minimum Version | Hydration Strategies | View Transitions | Styling Method |
| :--- | :--- | :--- | :--- | :--- |
| **Google Chrome / Chromium** | **90+** | Full (load, idle, visible, media, interaction) | Native `document.startViewTransition` | Constructable `adoptedStyleSheets` |
| **Apple Safari / WebKit** | **15.4+** | Full (with `requestIdleCallback` fallback) | Graceful sync swap fallback (17.4+ native) | Constructable `adoptedStyleSheets` (16.4+) / `<style>` fallback |
| **Mozilla Firefox** | **90+** | Full (load, idle, visible, media, interaction) | Graceful sync swap fallback | Constructable `adoptedStyleSheets` (101+) / `<style>` fallback |
| **Microsoft Edge** | **90+** | Full (load, idle, visible, media, interaction) | Native `document.startViewTransition` | Constructable `adoptedStyleSheets` |
| **Mobile Safari (iOS)** | **iOS 15.4+** | Full | Graceful sync swap | Constructable `adoptedStyleSheets` / `<style>` fallback |
| **Chrome for Android** | **90+** | Full | Native `document.startViewTransition` | Constructable `adoptedStyleSheets` |

---

## Degradation & Fallback Paths

### 1. View Transitions API (`document.startViewTransition`)
- **Modern Chromium / Safari 17.4+**: Smooth hardware-accelerated animated cross-fades.
- **Older Engines & Firefox**: Synchronous DOM morphing and replacement with zero visual glitch or navigation disruption.

### 2. Constructable Stylesheets (`adoptedStyleSheets`)
- **Supported Engines**: Instantly attached via `document.adoptedStyleSheets = [...]` for optimal stylesheet sharing.
- **Legacy Safari (<16.4) & Older Engines**: Managed `<style data-laughtale-sheet="...">` injected into `document.head` with automatic cleanup on island disposal.

### 3. Idle Hydration (`window.requestIdleCallback`)
- **Standard Engines**: Executed during browser idle periods (`requestIdleCallback`).
- **Engines Lacking API**: Automatically falls back to clamped `setTimeout(callback, 50)` scheduling.

### 4. Viewport Intersection (`IntersectionObserver`)
- **Supported Engines**: Hydrated when island reaches the viewport margin (rootMargin: `200px`).
- **No-JS / Headless / Legacy**: Server-rendered HTML is already fully formed; falls back to immediate load.
