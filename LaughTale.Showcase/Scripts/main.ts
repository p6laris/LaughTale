/**
 * LaughTale Showcase: Island Registration Entrypoint
 */

import { defineIsland, initIslands, initDirectives, enableViewTransitions, hydrateIsland, teardownIsland, rehydrateIsland, refreshIsland } from '../../LaughTale.Client/src/index';
import { isDevMode } from '../../LaughTale.Client/src/runtime/error-boundary';
import { wireLaughTaleTelemetryReporting } from '../../LaughTale.Client/src/runtime/telemetry';
import { wireLaughTaleWebVitalsReporting } from '../../LaughTale.Client/src/runtime/web-vitals';

// ROADMAP.v5.md Part H "instrumentation hook": beacons every island's real hydration duration to
// MapLaughTaleIslandTelemetry's endpoint, closing the loop with the server's own island.render spans
// under one ActivitySource. Opt-in by design (see telemetry.ts's own doc comment) - the Showcase opts
// in so this is exercised by a real page, not just unit tests.
wireLaughTaleTelemetryReporting();
// ROADMAP.v5.md Part J "Report Core Web Vitals": same opt-in posture, reports LCP/CLS/INP on page hide.
wireLaughTaleWebVitalsReporting();

// Expose runtime API on window for showcase demos, diagnostics, and E2E testing
(window as any).LaughTale = {
    defineIsland,
    initIslands,
    initDirectives,
    enableViewTransitions,
    hydrateIsland,
    teardownIsland,
    rehydrateIsland,
    refreshIsland
};

// 1. Register Core Showcase Islands
defineIsland('interactive-counter', () => import('./islands/counter'));
defineIsland('file-dropzone', () => import('./islands/dropzone'));
defineIsland('cascade-tree', () => import('./islands/cascade-tree'));
defineIsland('event-broadcaster', () => import('./islands/broadcaster'));
defineIsland('event-receiver', () => import('./islands/receiver'));
defineIsland('modal-dialog', () => import('./islands/modal-dialog'));
defineIsland('persistent-telemetry', () => import('./islands/persistent-player'));
defineIsland('slow-fact', () => import('./islands/slow-fact'));
defineIsland('ambient-counter', () => import('./islands/ambient-counter'));

// 2. Register Polyglot Multi-Framework Live Islands
defineIsland('polyglot-react', () => import('./islands/polyglot-react'));
defineIsland('polyglot-vue', () => import('./islands/polyglot-vue'));
defineIsland('polyglot-svelte', () => import('./islands/polyglot-svelte'));
defineIsland('polyglot-preact', () => import('./islands/polyglot-preact'));
defineIsland('polyglot-vanilla', () => import('./islands/polyglot-vanilla'));
defineIsland('polyglot-web-component', () => import('./islands/polyglot-web-component'));

// 3. Register ROADMAP.v5.md Part D examples (shared state + slot forwarding)
defineIsland('slot-forward-demo', () => import('./islands/slot-forward-demo'));
defineIsland('shared-counter-button', () => import('./islands/shared-counter-button'));
defineIsland('shared-counter-display', () => import('./islands/shared-counter-display'));

function initialize() {
    initIslands();
    initDirectives();
    enableViewTransitions();

    // ROADMAP.v5.md DevTools overlay: dynamically imported so production bundles never fetch it.
    if (isDevMode()) {
        import('../../LaughTale.Client/src/devtools/overlay').then((m) => m.initDevTools());
    }
}

// 3. Initialize hydration engine, directives and View Transitions
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
} else {
    initialize();
}

console.log('[LaughTale] Showcase initialized with polyglot islands.');
