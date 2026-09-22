import { defineIsland, initIslands, enableViewTransitions } from '../../../LaughTale.Client/src/runtime-core';

defineIsland('counter', () => import('./islands/counter'));

function initialize() {
    initIslands();
    // ROADMAP.v5.md Part J benchmark: client-side routing enabled so "memory after 50 navigations"
    // measures the same thing for all three apps - Blazor's own router (Server and WASM alike)
    // navigates client-side by default, so leaving this off would make LaughTale's memory graph
    // trivially flat from full page reloads instead of a real comparison.
    enableViewTransitions();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
} else {
    initialize();
}
