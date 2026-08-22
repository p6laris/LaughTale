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
export { LucideIcons, getLucideIcon } from './icons/lucide';

// Auto-register built-in enterprise components
defineIsland('stepper', () => import('./components/stepper'));
defineIsland('timeline', () => import('./components/timeline'));
defineIsland('camera', () => import('./components/camera'));
defineIsland('dropzone', () => import('./components/dropzone'));
defineIsland('tree-select', () => import('./components/tree-select'));
defineIsland('datagrid', () => import('./components/datagrid'));
defineIsland('modal', () => import('./components/modal'));
defineIsland('toast', () => import('./components/toast'));

// Aura Expanded Suite
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

// Aura Additional Enterprise Components
defineIsland('accordion', () => import('./components/accordion'));
defineIsland('tabs', () => import('./components/tabs'));
defineIsland('autocomplete', () => import('./components/autocomplete'));
defineIsland('color-picker', () => import('./components/color-picker'));
defineIsland('knob', () => import('./components/knob'));
defineIsland('tag', () => import('./components/tag'));
defineIsland('breadcrumb', () => import('./components/breadcrumb'));
defineIsland('scroll-top', () => import('./components/scroll-top'));
defineIsland('inplace', () => import('./components/inplace'));
defineIsland('command', () => import('./components/command'));
defineIsland('theme-studio', () => import('./components/theme-studio'));
defineIsland('dynamic-form', () => import('./components/dynamic-form'));
defineIsland('splitter', () => import('./components/splitter'));
defineIsland('multiselect', () => import('./components/multiselect'));
defineIsland('cascadeselect', () => import('./components/cascadeselect'));
defineIsland('listbox', () => import('./components/listbox'));
defineIsland('picklist', () => import('./components/picklist'));
defineIsland('orderlist', () => import('./components/orderlist'));
defineIsland('orgchart', () => import('./components/orgchart'));
defineIsland('terminal', () => import('./components/terminal'));
defineIsland('dock', () => import('./components/dock'));
defineIsland('galleria', () => import('./components/galleria'));
defineIsland('blockui', () => import('./components/blockui'));
defineIsland('split-button', () => import('./components/split-button'));

// Export Headless Composables, Animations & Strongly-Typed Models
export * from './composables/index';
export * from './types/models';
