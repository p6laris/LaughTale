/**
 * LaughTale Showcase: Island Registration Entrypoint
 */

import { defineIsland, initIslands, initDirectives, enableViewTransitions, hydrateIsland, teardownIsland, rehydrateIsland, refreshIsland } from '../../LaughTale.Client/src/index';
import { isDevMode } from '../../LaughTale.Client/src/runtime/error-boundary';

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

// 2. Register Polyglot Multi-Framework Live Islands
defineIsland('polyglot-react', () => import('./islands/polyglot-react'));
defineIsland('polyglot-vue', () => import('./islands/polyglot-vue'));
defineIsland('polyglot-svelte', () => import('./islands/polyglot-svelte'));
defineIsland('polyglot-preact', () => import('./islands/polyglot-preact'));
defineIsland('polyglot-vanilla', () => import('./islands/polyglot-vanilla'));

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
