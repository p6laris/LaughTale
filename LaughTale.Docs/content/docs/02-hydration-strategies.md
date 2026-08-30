---
title: "Hydration Strategies & Lifecycle"
description: "In-depth guide to LaughTale's 6 hydration strategies, IslandContext, lifecycle state machine, and teardown management."
order: 2
section: "Core Concepts"
---

# Hydration Strategies & Lifecycle

LaughTale provides a sophisticated client-side hydration scheduler designed to minimize Main Thread execution, eliminate First Input Delay (FID), and deliver near-zero Interaction to Next Paint (INP).

Rather than hydrating the entire DOM tree in a single monolithic pass (as full SPAs do), LaughTale decomposes the UI into isolated islands that hydrate independently according to user intent and device capabilities.

---

## ⚡ The 6 Hydration Strategies

LaughTale supports 6 distinct hydration strategies configured declaratively via the `hydrate` attribute:

| Strategy | C# Enum | Trigger Condition | Best Used For |
|---|---|---|---|
| **`Load`** | `HydrateStrategy.Load` | Hydrates immediately when the script executes. | Critical above-the-fold controls, global navigations, real-time alerts. |
| **`Idle`** | `HydrateStrategy.Idle` | Hydrates during browser idle periods via `requestIdleCallback`. | Secondary widgets, analytics charts, search auto-completers. |
| **`Visible`** | `HydrateStrategy.Visible` | Hydrates when scrolled within 120px of the viewport. | Long tables, infinite feeds, below-the-fold cards, media galleries. |
| **`Media`** | `HydrateStrategy.Media` | Hydrates when a CSS media query matches (`window.matchMedia`). | Mobile-only bottom drawers, desktop-only split-pane views. |
| **`Interaction`** | `HydrateStrategy.Interaction` | Hydrates on first `mouseenter`, `focusin`, or `touchstart`. | DatePickers, rich text editors, heavy dialog windows. |
| **`Never`** | `HydrateStrategy.Never` | Zero client JavaScript execution (pure static SSR). | Read-only markdown articles, marketing blocks, static tables. |

---

## 🔍 Detailed Strategy Examples

### 1. `hydrate="Visible"` (IntersectionObserver)
The `Visible` strategy uses a high-performance **singleton child-targeted `IntersectionObserver`** configured with a `rootMargin: '120px'`. This pre-hydrates the island just before the user scrolls it into view:

```razor
<island name="interactive-datagrid" 
        props="@Model.GridData" 
        hydrate="Visible">
    <div class="p-skeleton" style="height: 300px;">Loading Table...</div>
</island>
```

### 2. `hydrate="Media"` (Responsive Breakpoints)
Condition hydration on screen dimensions or user preferences:

```razor
<!-- Hydrate only on mobile devices -->
<island name="mobile-navigation-drawer" 
        hydrate="Media" 
        media="(max-width: 768px)">
    <button class="p-button">Open Menu</button>
</island>

<!-- Hydrate only when user prefers high contrast -->
<island name="high-contrast-widget" 
        hydrate="Media" 
        media="(prefers-contrast: more)" />
```

### 3. `hydrate="Interaction"` (Zero Cost until Hover/Focus)
Delays downloading or executing the component script until the user hovers over, focuses, or taps the island container:

```razor
<island name="heavy-date-range-picker" 
        props="@Model.DateSettings" 
        hydrate="Interaction">
    <input type="text" class="p-inputtext" placeholder="Click to pick date..." readonly />
</island>
```

---

## 🔄 Island Lifecycle & Tri-State Machine

Every island container transitions through a strict 4-state lifecycle:

```
[idle] ──(trigger satisfied)──> [pending] ──(mount successful)──> [mounted]
                                    │
                              (mount error)
                                    ▼
                                [failed] ──(retryIsland)──> [idle]
```

You can inspect an island's state programmatically via `getIslandState(container)`:

```typescript
import { getIslandState } from 'laughtale';

const el = document.querySelector('[data-island="analytics-chart"]') as HTMLElement;
console.log(getIslandState(el)); // 'idle' | 'pending' | 'mounted' | 'failed'
```

---

## 🛡️ The `IslandContext` Contract

When mounting an island, LaughTale passes a strongly-typed `IslandContext` object as the 3rd parameter:

```typescript
export interface IslandContext {
    /** AbortSignal triggered when the island unmounts or page navigates */
    signal: AbortSignal;
    
    /** Registers a cleanup function to run when the island is destroyed */
    onCleanup: (fn: () => void) => void;
    
    /** The DOM container element of this island */
    container: HTMLElement;
    
    /** The registered name of this island */
    name: string;
    
    /** Active document locale (e.g. 'en-US', 'de-DE') */
    locale: string;
    
    /** Text direction ('ltr' or 'rtl') */
    dir: 'ltr' | 'rtl';
}
```

### Example: Proper Lifecycle Management
```typescript
import { IslandContext } from 'laughtale';

export default function LiveTicker(container: HTMLElement, props: any, ctx: IslandContext) {
    // 1. Setup recurring timer with automatic cleanup
    const timer = setInterval(() => {
        // Fetch live prices...
    }, 5000);

    ctx.onCleanup(() => clearInterval(timer));

    // 2. Attach DOM event listeners passing ctx.signal
    window.addEventListener('resize', onResize, { signal: ctx.signal });

    // 3. Return optional unmount hook
    return () => {
        console.log('Ticker unmounted');
    };
}
```

---

## 🚨 Error Boundaries & Telemetry

If an island encounters a runtime exception during hydration, LaughTale isolates the error so the rest of the page remains fully functional:

1. The failed island transitions to `'failed'` state.
2. A `laughtale:hydration-error` custom event is dispatched on the element.
3. If configured, your global telemetry handler receives the error.

### Registering a Global Telemetry Handler
In your client entry point:

```typescript
import { setHydrationErrorHandler, retryIsland } from 'laughtale';

setHydrationErrorHandler((error, { islandName, element }) => {
    // Log to Application Insights, Sentry, or Datadog
    console.error(`[Telemetry] Hydration failed for '${islandName}':`, error);
    
    // Optional: Render user-friendly retry button
    element.innerHTML = `
        <div class="p-error-card">
            <p>Failed to load widget.</p>
            <button type="button" class="retry-btn">Retry</button>
        </div>
    `;
    element.querySelector('.retry-btn')?.addEventListener('click', () => {
        retryIsland(element);
    });
});
```
