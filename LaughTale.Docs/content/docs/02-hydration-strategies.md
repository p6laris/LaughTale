---
title: Hydration Strategies
description: Master LaughTale's 5 progressive hydration triggers — Load, Idle, Visible, Media, and Interaction — to optimize Web Vitals and maximize performance.
order: 3
icon: layers
category: Framework Architecture
---

# 💧 Progressive Hydration Strategies

One of LaughTale's greatest superpowers is its **fine-grained control over when JavaScript executes**. Rather than hydrating every component simultaneously at page load, you declare *when* an island should come alive.

---

## ⚡ The 5 Hydration Triggers

You can set the hydration strategy on any `<island>` or component TagHelper using the `hydrate` attribute:

```razor
<!-- TagHelper Syntax -->
<island-datatable value="@Model.Data" hydrate="Visible" />
<island name="shopping-cart" hydrate="Interaction" />

<!-- Direct HTML Syntax -->
<div data-island="counter" data-hydrate="idle"></div>
```

---

### 1. `Load` (Immediate)
* **When it executes**: Instantly when the page document finishes parsing.
* **Best used for**: Critical above-the-fold interactive components that the user interacts with immediately.
* **Examples**: Primary navigation bar, search combobox, authentication headers.

```razor
<island-menubar items="@Model.NavMenu" hydrate="Load" />
```

---

### 2. `Idle` (Low Priority Background)
* **When it executes**: When the main browser thread is idle, using `requestIdleCallback` (with a 2000ms safety timeout fallback).
* **Best used for**: Non-critical components that don't block the user's initial interaction.
* **Examples**: Toast notifications, analytics widgets, background data prefetchers, live chat bubbles.

```razor
<island-toast hydrate="Idle" />
<island name="activity-feed" hydrate="Idle" />
```

---

### 3. `Visible` (Viewport Intersection)
* **When it executes**: As soon as the island enters the browser's viewport (or gets within 200px of the viewport), using `IntersectionObserver`.
* **Best used for**: Components located below the fold, long landing pages, infinite feeds, and complex data grids.
* **Benefits**: If the user never scrolls down to the component, **0 KB of JavaScript is executed**.

```razor
<island-datatable value="@Model.CustomerReviews" 
                  hydrate="Visible" 
                  paginator="true" />
```

---

### 4. `Media` (Responsive Breakpoint Match)
* **When it executes**: Only when a specific CSS media query condition is satisfied (e.g., `(min-width: 1024px)`).
* **Best used for**: Desktop-only or mobile-only interactive widgets.
* **Benefits**: Mobile devices never waste battery or CPU hydrating desktop-specific controls.

```razor
<!-- Only hydrates on screens wider than 1024px -->
<island name="complex-desktop-chart" hydrate="Media" media="(min-width: 1024px)" />

<!-- Only hydrates on mobile screens -->
<island-drawer hydrate="Media" media="(max-width: 768px)" />
```

---

### 5. `Interaction` (On User Intent)
* **When it executes**: The very moment the user interacts with the island container (on `pointerenter`, `focusin`, `touchstart`, or `click`).
* **Best used for**: Heavy modal dialogs, complex calculators, file uploaders, dropdowns, and settings panels.
* **Benefits**: Zero CPU cost until the user actively decides to engage with the component.

```razor
<island-fileupload url="/api/upload" hydrate="Interaction" />
<island-dialog title="Account Settings" hydrate="Interaction" />
```

---

## 🛑 Pure Server Mode (`Never` / Static SSR)

If a component is purely presentational and requires no client-side DOM event listeners, set `hydrate="Never"`:

```razor
<island-tag severity="success" value="Verified" hydrate="Never" />
<island-avatar image="/images/user.png" size="large" hydrate="Never" />
```

This generates 100% semantic HTML and CSS with **zero JavaScript attachment**.

---

## 📈 Real-World Strategy Matrix

| Component Type | Recommended Strategy | Reason |
| :--- | :--- | :--- |
| **Top Navbar / Command Menu** | `Load` | Immediate keyboard navigation (`Ctrl+K`) |
| **Hero Image Comparison** | `Load` | Key visual experience above the fold |
| **Toast Alerts / Announcer** | `Idle` | Ready when background finishes |
| **Data Tables / Reviews Grid** | `Visible` | Save CPU until user scrolls to data |
| **Heavy File Uploader** | `Interaction` | Don't load drag-and-drop until hovered |
| **Desktop Compound Sidebar** | `Media: (min-width: 1024px)`| Don't run on mobile screens |
| **Static Badge / Card / Divider** | `Never` | Pure server-rendered markup |
