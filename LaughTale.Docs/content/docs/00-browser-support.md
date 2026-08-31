---
title: Browser Support & Compatibility
description: Baseline browser support matrix, polyfills, progressive enhancement, and fallback strategies across desktop and mobile browsers.
order: 0
icon: globe
category: Framework Architecture
---

# 🌐 Browser Support & Compatibility

LaughTale is built to modern Web standards (ES2022+), ensuring broad compatibility across modern evergreen desktop and mobile browsers while offering graceful progressive enhancement for older clients.

---

## 📱 Supported Browsers

| Browser | Minimum Version | Tested & Certified |
| :--- | :--- | :--- |
| **Google Chrome / Chromium** | 90+ | Version 120+ |
| **Microsoft Edge (Chromium)** | 90+ | Version 120+ |
| **Mozilla Firefox** | 88+ | Version 122+ |
| **Apple Safari (macOS & iOS)** | 14.1+ | Version 17+ |
| **Opera** | 76+ | Version 105+ |

---

## ⚡ Progressive Enhancement & Fallback Handling

### 1. View Transitions API
On browsers supporting the native View Transitions API (Chrome 111+, Safari 18+), page transitions are animated smoothly with zero layout jump. On older browsers (Firefox), LaughTale automatically falls back to an instantaneous DOM swap without breaking page functionality.

### 2. Viewport Hydration (`IntersectionObserver`)
Supported natively across 99.2% of global browsers. On older embedded webviews without `IntersectionObserver`, LaughTale falls back to immediate `Load` hydration.

### 3. Server-First SSR Baseline (Zero JS Fallback)
Because every LaughTale TagHelper generates semantic, pre-styled HTML on the ASP.NET Core server, users with JavaScript disabled or slow 3G connections still see fully-styled content immediately.
