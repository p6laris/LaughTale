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

## ⚠️ What Actually Renders Server-Side (Read Before Using `Load`)

`hydrate` controls **when client JS takes over** - it says nothing about what's visible *before* that
happens. Be honest with yourself about the difference:

- **Razor markup, `Vanilla`, Web Components, and Alpine islands** can have real server-rendered
  content: override `BuildSsrHtml()` (or nest markup inside `<island>...</island>`) with genuine HTML,
  and that's what a visitor sees immediately, JS or not.
- **React and Preact islands can be truly server-rendered with the opt-in SSR sidecar** (see below).
  Without it - and for **Vue, Svelte, and Solid**, which the sidecar doesn't support yet - a
  framework-mounted island with no `BuildSsrHtml()` override and no child content renders a genuinely
  **empty wrapper `<div>`** until its client JS chunk loads and mounts.

For `Idle`/`Visible`/`Media`/`Interaction`, an empty island until then is often exactly what you want -
`Visible`'s whole pitch is "0 KB until scrolled into view." **`hydrate="Load"` is different**: it
promises critical, above-the-fold content, so a blank gap there is a real bug, not a trade-off. In
Development, LaughTale detects this for you - an island using `hydrate="Load"` that rendered no
server-side content at all gets a `data-laughtale-warning-no-fallback` attribute you can spot in the
DOM inspector. Fix it by giving it real `BuildSsrHtml()` markup, nesting fallback content inside the
`<island>` tag, or switching to a deferred strategy if a brief blank gap is genuinely fine.

### The SSR sidecar (React, Preact)

The sidecar closes this gap for React and Preact islands. At startup your app runs a Node child process - your
own **server bundle** - and while rendering a page, asks it over stdin/stdout to render each React
island with its props. The HTML goes straight into the page with a `data-lt-ssr="true"` stamp, and in
the browser the framework **hydrates** that markup (attaching to the existing DOM) instead of mounting from
scratch. No network port is opened.

1. **Write a server entry** that registers the islands to server-render, keyed by the same names you
   use in Razor:

   ```ts
   // Scripts/ssr-entry.ts
   import { startSsrHost } from 'laughtale/ssr';
   import { reactSsrComponent } from 'laughtale/ssr/react';
   import { preactSsrComponent } from 'laughtale/ssr/preact';
   import RevenueCard from './islands/RevenueCard';
   import Throughput from './islands/Throughput';

   startSsrHost({
       'revenue-card': reactSsrComponent(RevenueCard),
       'throughput': preactSsrComponent(Throughput)
   });
   ```

   Import the raw component, not the `createReactIsland(...)` / `createPreactIsland(...)` wrapper -
   keep each component in its own file so both the browser island and the server entry can import it.
   The server needs `preact-render-to-string` installed next to `preact`. If your project's JSX
   defaults to React, start Preact `.tsx` files with `/** @jsxImportSource preact */`.

2. **Bundle it for Node** into one self-contained file, *outside* `wwwroot` (it's server code), with
   `NODE_ENV` pinned to `production` so the server runs the same framework build as the browser. React's
   server build is CommonJS, so an ESM bundle needs a `require` shim:

   ```js
   await esbuild.build({
       entryPoints: ['Scripts/ssr-entry.ts'], bundle: true, platform: 'node', format: 'esm',
       outfile: 'ssr/server-bundle.mjs', jsx: 'automatic',
       define: { 'process.env.NODE_ENV': '"production"' },
       banner: { js: "import { createRequire } from 'module'; const require = createRequire(import.meta.url);" }
   });
   ```

3. **Enable it** in the .NET app:

   ```csharp
   builder.Services.AddLaughTaleSsrSidecar(builder.Configuration, ssr =>
   {
       ssr.WorkingDirectory ??= builder.Environment.ContentRootPath;
       ssr.ServerBundlePath ??= "ssr/server-bundle.mjs";
   });
   ```

   ```json
   { "LaughTale": { "Ssr": { "Enabled": true } } }
   ```

**It fails open.** If Node isn't installed, is still starting, crashes, or a render errors or exceeds
`RenderTimeout` (500 ms by default), the island renders exactly as it would without the sidecar and
mounts client-side; a crashed Node process is restarted automatically with backoff. Node is only
needed where you enable it - a production image can stay .NET-only.

**Your component's first render must be deterministic.** The browser re-runs it during hydration and
compares: `Math.random()`, `Date.now()`, or locale-dependent formatting such as `toLocaleString()`
with no locale argument (a server and a browser in different locales print `84,500` vs `84.500`)
produce a mismatch - React discards the server HTML, and Preact silently patches it to match. Pass an explicit locale, and keep randomness
in effects and event handlers.

**Not server-rendered yet:** islands with slotted child content, `<island-deferred>` islands, and
components in Vue, Svelte, or Solid.

**Bundle each framework once.** If a framework can be resolved from two `node_modules` trees (for
example your app's and a linked library's), the bundler may include two copies, and hooks break.
Resolve framework packages from one root (Vite's `resolve.dedupe`, or an esbuild `onResolve` plugin
as in the Showcase's `esbuild.config.mjs`).

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
