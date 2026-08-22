---
title: "Multi-Strategy Client Hydration"
description: "Master the 6 client hydration strategies in SoftMax.LaughTale"
order: 2
section: "Core Concepts"
---

# Multi-Strategy Client Hydration

SoftMax.LaughTale gives you granular control over exactly **when and how** each component's JavaScript is loaded and executed in the browser.

By deferring non-critical scripts, your pages achieve near-instant First Contentful Paint (FCP) and optimal Core Web Vitals.

---

## 🧭 The 6 Hydration Strategies

| Strategy | When it Hydrates | Ideal Use Case |
|---|---|---|
| `Load` | Immediately when page loads | Critical above-the-fold UI (hero widgets, auth status) |
| `Idle` | As soon as main thread is idle (`requestIdleCallback`) | Secondary interactive widgets, analytics loggers |
| `Visible` | When entering viewport (`IntersectionObserver`) | Below-the-fold comments, charts, data grids |
| `Media` | When a CSS media query matches (`window.matchMedia`) | Mobile-only navigation menus, desktop sidebars |
| `Interaction` | On first `click`, `hover`, or `focus` | Modals, flyout tooltips, heavy configuration panels |
| `Never` | Never (0 bytes of JS executed) | Static server-rendered widgets |

---

## 📡 Live Inter-Island Event Bus Demo

Below is a live interactive demonstration using **Interaction** and **Idle** hydration communicating over the LaughTale Event Bus:

<island name="event-broadcaster" props='{"channelName": "docs-channel", "buttonLabel": "Dispatch Event"}' hydrate="Interaction" />

<island name="event-receiver" props='{"channelName": "docs-channel", "initialMessage": "Awaiting events..."}' hydrate="Idle" />

---

## 💻 Code Example

```razor
<!-- Hydrates only on mobile devices -->
<island name="mobile-drawer" hydrate="Media" media="(max-width: 768px)" />

<!-- Hydrates only when user scrolls down to it -->
<island name="sales-chart" hydrate="Visible" />

<!-- Hydrates only when user hovers or clicks the trigger button -->
<island name="settings-modal" hydrate="Interaction" />
```
