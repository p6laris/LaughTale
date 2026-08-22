/**
 * SoftMax.LaughTale Showcase: Island Registration Entrypoint
 */

import { defineIsland, initIslands, initDirectives, enableViewTransitions } from '../../SoftMax.LaughTale.Client/src/index';

// 1. Register available islands with lazy dynamic import
defineIsland('interactive-counter', () => import('./islands/counter'));
defineIsland('file-dropzone', () => import('./islands/dropzone'));
defineIsland('cascade-tree', () => import('./islands/cascade-tree'));
defineIsland('event-broadcaster', () => import('./islands/broadcaster'));
defineIsland('event-receiver', () => import('./islands/receiver'));
defineIsland('modal-dialog', () => import('./islands/modal-dialog'));
defineIsland('persistent-telemetry', () => import('./islands/persistent-player'));

function initialize() {
    initIslands();
    initDirectives();
    enableViewTransitions();
}

// 2. Initialize hydration engine, directives and View Transitions
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
} else {
    initialize();
}

console.log('[SoftMax.LaughTale] Docs client runtime initialized.');
