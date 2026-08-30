/**
 * LaughTale Showcase: Island Registration Entrypoint
 */

import { defineIsland, initIslands, initDirectives, enableViewTransitions } from '../../LaughTale.Client/src/index';

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

function initialize() {
    initIslands();
    initDirectives();
    enableViewTransitions();
}

// 3. Initialize hydration engine, directives and View Transitions
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
} else {
    initialize();
}

console.log('[LaughTale] Showcase initialized with polyglot islands.');
