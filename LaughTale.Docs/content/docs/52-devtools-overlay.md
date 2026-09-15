---
title: DevTools Overlay
description: An in-page floating panel showing every island's hydration strategy, live state, mount timing, and props size during development.
order: 52
icon: bug
category: Framework Architecture
---

# 🛠️ DevTools Overlay

A floating, dev-only panel — injected directly into the page, not a browser extension — showing what
every island on the page is doing in real time. Modeled on Nuxt DevTools and Astro's dev toolbar.

---

## ⚡ 1. Enabling it

Add the tag once to your layout, anywhere `<island-theme-studio />` would go:

```razor
<laughtale-devtools />
```

It renders nothing in Production. In Development, it emits a small inline script that flips on the
overlay's client-side gate — no options class, no DI registration required. If you use CSP
(`AddLaughTaleCsp()`), the emitted script automatically carries the current request's nonce.

---

## 🔍 2. What it shows

Click the floating **LT** button (bottom-left) to open the panel — a live list of every island on the
page:

- **Strategy** — `load`, `idle`, `visible`, `interaction`, `media`.
- **State** — `idle` / `pending` / `mounted` / `failed`, color-coded.
- **Mount duration** — once hydrated.
- **Props size** — the raw serialized props JSON length (not a byte size — labeled as such).
- **Dev-mode warnings** — any `IslandDiagnostics` validation warning (bad kebab-case name, a `media`
  attribute without the `Media` strategy, `persist` without `Load`) already present in the DOM.
- **Retry** — on a failed island, calls the real hydration retry path directly.

The badge on the closed button shows the total island count, turning red if any island failed.

Check **Outline islands** to draw a dashed outline around every real island element on the page, with a
small floating label (name + strategy) that tracks the element through scrolling and resizing.

---

## 🚫 3. What it doesn't do (yet)

- **Chunk/bundle weight per island** is not shown. There's currently no way to map an island back to
  its network payload size at runtime — this needs the island manifest to be wired through to the
  client first, and is tracked separately on the roadmap.
- No network waterfall or HMR integration.

---

## 📦 4. Zero production cost

The overlay's code is dynamically imported and only fetched at all when the dev-mode gate is on — a
Production build never downloads it, regardless of whether `<laughtale-devtools />` is present in the
layout.
