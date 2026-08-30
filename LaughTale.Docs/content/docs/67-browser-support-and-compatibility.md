---
title: Browser Support & Compatibility Policy
description: Modern Evergreen target baseline, progressive enhancement rules, and automated fallback behaviors for Safari and Firefox.
category: Architecture & Core
order: 67
---

# Browser Support & Compatibility Policy

LaughTale is built for the Modern Evergreen Web targeting **ECMAScript 2022 (ES2022)** and native HTML5/CSS standards. All core features feature zero-config progressive degradation on older or non-standard environments.

---

## 1. Supported Browsers & Baselines

| Browser | Supported Version | Native View Transitions | OKLCH Colors | Adopted StyleSheets |
| :--- | :--- | :--- | :--- | :--- |
| **Google Chrome / Chromium** | 111+ | ✅ Native | ✅ Native | ✅ Native |
| **Microsoft Edge** | 111+ | ✅ Native | ✅ Native | ✅ Native |
| **Mozilla Firefox** | 120+ | ✅ (125+) / Graceful Fallback | ✅ Native | ✅ Native |
| **Apple Safari / iOS Safari** | 17+ | ✅ (18+) / Graceful Fallback | ✅ Native | ✅ Native |

---

## 2. Progressive Degradation & Automated Fallbacks

LaughTale does not throw runtime exceptions when advanced browser features are missing. The runtime automatically switches to proven fallback strategies:

### 1. View Transitions (`document.startViewTransition`)
- **Supported:** Performs butter-smooth GPU-accelerated cross-fade and shared-element transitions.
- **Fallback (Safari <18, older Firefox):** Seamlessly executes DOM replacement, accessible focus shifts, and polite live region announcements without animation stutter.

### 2. Adopted StyleSheets (`document.adoptedStyleSheets`)
- **Supported:** Injects and caches singleton `CSSStyleSheet` instances across all matching component islands.
- **Fallback:** Injects deduplicated `<style id="laughtale-style-{name}">` elements into `<head>` dynamically.

### 3. Idle Scheduling (`requestIdleCallback`)
- **Supported:** Schedules non-critical `hydrate="Idle"` components during browser idle intervals.
- **Fallback:** Degrades gracefully to `setTimeout(..., 200)` macro-task execution.

### 4. Viewport Intersection (`IntersectionObserver`)
- **Supported:** Delays `hydrate="Visible"` components until they scroll within 200px of the viewport.
- **Fallback:** Hydrates the component immediately on page load if `IntersectionObserver` is not supported.
