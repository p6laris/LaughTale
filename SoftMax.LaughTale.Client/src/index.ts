/**
 * SoftMax.LaughTale Client Runtime API
 * High-performance Islands Architecture hydration & multi-framework engine.
 */

import { defineIsland } from './runtime/registry';

export { defineIsland, getIslandDefinition, hasIsland } from './runtime/registry';
export { hydrateIsland, initIslands, type HydrateStrategy } from './runtime/hydrator';
export { enableViewTransitions, navigate } from './runtime/router';
export { getSlot, extractSlotContent, hasSlot } from './runtime/slots';
export { injectIslandStyle, removeIslandStyle } from './runtime/styles';
export { islandEvents } from './runtime/events';
export { islandStore } from './runtime/state';
export { parseAndReviveProps, reviveTuple } from './runtime/reviver';
export { importWithRetry } from './runtime/retry';
export { awaitStreamingReady } from './runtime/streaming';
export { createVanillaIsland } from './adapters/vanilla';
export { createPreactIsland } from './adapters/preact';
export { initDirectives } from './directives/index';

// Auto-register built-in enterprise components
defineIsland('stepper', () => import('./components/stepper'));
defineIsland('timeline', () => import('./components/timeline'));
defineIsland('camera', () => import('./components/camera'));
defineIsland('dropzone', () => import('./components/dropzone'));
defineIsland('tree-select', () => import('./components/tree-select'));
defineIsland('datagrid', () => import('./components/datagrid'));
defineIsland('modal', () => import('./components/modal'));
defineIsland('toast', () => import('./components/toast'));
