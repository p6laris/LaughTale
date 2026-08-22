/**
 * SoftMax.LaughTale Client Runtime API
 * High-performance Islands Architecture hydration & multi-framework engine.
 */

import { defineIsland } from './runtime/registry';

export { defineIsland, getIslandDefinition, hasIsland } from './runtime/registry';
export { hydrateIsland, initIslands, type HydrateStrategy } from './runtime/hydrator';
export { enableViewTransitions, navigateTo } from './runtime/router';
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
export { SolarIcons, getSolarIcon } from './icons/solar';

// Auto-register built-in enterprise components
defineIsland('stepper', () => import('./components/stepper'));
defineIsland('timeline', () => import('./components/timeline'));
defineIsland('camera', () => import('./components/camera'));
defineIsland('dropzone', () => import('./components/dropzone'));
defineIsland('tree-select', () => import('./components/tree-select'));
defineIsland('datagrid', () => import('./components/datagrid'));
defineIsland('modal', () => import('./components/modal'));
defineIsland('toast', () => import('./components/toast'));

// Aura Expanded Components
defineIsland('input-number', () => import('./components/input-number'));
defineIsland('input-otp', () => import('./components/input-otp'));
defineIsland('input-password', () => import('./components/input-password'));
defineIsland('toggle-switch', () => import('./components/toggle-switch'));
defineIsland('slider', () => import('./components/slider'));
defineIsland('rating', () => import('./components/rating'));
defineIsland('select-button', () => import('./components/select-button'));
defineIsland('chips', () => import('./components/chips'));
defineIsland('datepicker', () => import('./components/datepicker'));
defineIsland('meter-group', () => import('./components/meter-group'));
defineIsland('avatar-group', () => import('./components/avatar-group'));
defineIsland('progress-bar', () => import('./components/progress-bar'));
defineIsland('skeleton', () => import('./components/skeleton'));
defineIsland('drawer', () => import('./components/drawer'));
defineIsland('speed-dial', () => import('./components/speed-dial'));
defineIsland('image-compare', () => import('./components/image-compare'));
defineIsland('confirm-popup', () => import('./components/confirm-popup'));
