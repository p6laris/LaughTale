/**
 * SoftMax.LaughTale Showcase: Island Registration Entrypoint
 */

import { defineIsland, initIslands, enableViewTransitions } from '../../SoftMax.LaughTale.Client/src/index';

// 1. Register available islands with lazy dynamic import
defineIsland('interactive-counter', () => import('./islands/counter'));
defineIsland('file-dropzone', () => import('./islands/dropzone'));
defineIsland('cascade-tree', () => import('./islands/cascade-tree'));
defineIsland('event-broadcaster', () => import('./islands/broadcaster'));
defineIsland('event-receiver', () => import('./islands/receiver'));
defineIsland('modal-dialog', () => import('./islands/modal-dialog'));
defineIsland('persistent-telemetry', () => import('./islands/persistent-player'));

// 2. Initialize hydration engine and View Transitions
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        initIslands();
        enableViewTransitions();
    });
} else {
    initIslands();
    enableViewTransitions();
}

console.log('[SoftMax.LaughTale] Showcase initialized.');
