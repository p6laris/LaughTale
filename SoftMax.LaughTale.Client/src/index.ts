/**
 * SoftMax.LaughTale Client Runtime API
 * High-performance Islands Architecture hydration & multi-framework engine.
 */

import { defineIsland } from './runtime/registry';

export {
    defineIsland,
    getIslandDefinition,
    hasIsland,
    getIslandLoader,
    resolveIslandName,
    listIslands,
    LEGACY_ALIASES,
    type IslandModule,
    type IslandFactory,
    type IslandTeardown,
    type IslandLoader,
    type IslandDefinition
} from './runtime/registry';
export { hydrateIsland, initIslands, retryIsland, getIslandState, type HydrateStrategy, type HydrationState } from './runtime/hydrator';
export { enableViewTransitions, navigateTo } from './runtime/router';
export { getSlot, extractSlotContent, hasSlot } from './runtime/slots';
export { injectIslandStyle, removeIslandStyle } from './runtime/styles';
export { emitIslandEvent, onIslandEvent } from './runtime/events';
export { IslandStore, useSharedState } from './runtime/state';
export { parseAndReviveProps, reviveTuple } from './runtime/reviver';
export { importWithRetry, type RetryOptions } from './runtime/retry';
export { awaitStreamingReady } from './runtime/streaming';
export { hasSsrContent, getSsrRoot, markSsrHydrated, SSR_ATTR, SSR_HYDRATED_ATTR } from './runtime/ssr';
export { renderSkeleton, renderEmptyState, renderErrorState } from './runtime/states';
export type { ComponentStateProps, SkeletonOptions, StateMessageOptions } from './types/states';
export { createVanillaIsland } from './adapters/vanilla';
export { createPreactIsland } from './adapters/preact';
export { initDirectives } from './directives/index';
export { LucideIcons, getLucideIcon } from './icons/lucide';
export { registerCommand, unregisterCommand, getCommand, executeCommand, clearCommands, listCommands, type CommandHandler } from './runtime/commands';
export { getCspNonce, setCspNonce, applyNonceToStyle, applyNonceToScript } from './directives/csp';
export { createScope, type IslandScope } from './runtime/scope';
export { initDesignTokens, updateToken, getToken, AURA_PALETTES, generatePaletteRamp } from './styles/design-tokens';

// Canonical Island Registrations (1:1 with component files)
defineIsland('stepper', () => import('./components/stepper'));
defineIsland('timeline', () => import('./components/timeline'));
defineIsland('dropzone', () => import('./components/dropzone'));
defineIsland('tree', () => import('./components/tree'));
defineIsland('treetable', () => import('./components/treetable'));
defineIsland('tree-select', () => import('./components/tree-select'));
defineIsland('datatable', () => import('./components/datatable'));
defineIsland('toast', () => import('./components/toast'));

// Aura Expanded Suite
defineIsland('input-number', () => import('./components/input-number'));
defineIsland('input-otp', () => import('./components/input-otp'));
defineIsland('input-password', () => import('./components/input-password'));
defineIsland('toggle-switch', () => import('./components/toggle-switch'));
defineIsland('toggle-button', () => import('./components/toggle-button'));
defineIsland('button', () => import('./components/button'));
defineIsland('slider', () => import('./components/slider'));
defineIsland('rating', () => import('./components/rating'));
defineIsland('select-button', () => import('./components/select-button'));
defineIsland('input-tags', () => import('./components/input-tags'));
defineIsland('datepicker', () => import('./components/datepicker'));
defineIsland('meter-group', () => import('./components/meter-group'));
defineIsland('avatar-group', () => import('./components/avatar-group'));
defineIsland('progress-bar', () => import('./components/progress-bar'));
defineIsland('skeleton', () => import('./components/skeleton'));
defineIsland('drawer', () => import('./components/drawer'));
defineIsland('speed-dial', () => import('./components/speed-dial'));
defineIsland('image-compare', () => import('./components/image-compare'));
defineIsland('confirm-popup', () => import('./components/confirm-popup'));
defineIsland('confirm-dialog', () => import('./components/confirm-dialog'));
defineIsland('dialog', () => import('./components/dialog'));
defineIsland('fileupload', () => import('./components/fileupload'));

// Aura Additional Enterprise Components
defineIsland('scrollarea', () => import('./components/scrollarea'));
defineIsland('panel', () => import('./components/panel'));
defineIsland('fieldset', () => import('./components/fieldset'));
defineIsland('divider', () => import('./components/divider'));
defineIsland('accordion', () => import('./components/accordion'));
defineIsland('tabs', () => import('./components/tabs'));
defineIsland('toolbar', () => import('./components/toolbar'));
defineIsland('autocomplete', () => import('./components/autocomplete'));
defineIsland('color-picker', () => import('./components/color-picker'));
defineIsland('knob', () => import('./components/knob'));
defineIsland('tag', () => import('./components/tag'));
defineIsland('breadcrumb', () => import('./components/breadcrumb'));
defineIsland('scroll-top', () => import('./components/scroll-top'));
defineIsland('inplace', () => import('./components/inplace'));
defineIsland('command', () => import('./components/command'));
defineIsland('theme-studio', () => import('./components/theme-studio'));
defineIsland('splitter', () => import('./components/splitter'));
defineIsland('multiselect', () => import('./components/multiselect'));
defineIsland('cascadeselect', () => import('./components/cascadeselect'));
defineIsland('listbox', () => import('./components/listbox'));
defineIsland('picklist', () => import('./components/picklist'));
defineIsland('orderlist', () => import('./components/orderlist'));
defineIsland('orgchart', () => import('./components/orgchart'));
defineIsland('galleria', () => import('./components/galleria'));
defineIsland('blockui', () => import('./components/blockui'));
defineIsland('split-button', () => import('./components/split-button'));

// Form & Navigation Phase 2 Components
defineIsland('select', () => import('./components/select'));
defineIsland('checkbox', () => import('./components/checkbox'));
defineIsland('radio-button', () => import('./components/radio-button'));
defineIsland('textarea', () => import('./components/textarea'));
defineIsland('input-mask', () => import('./components/input-mask'));
defineIsland('float-label', () => import('./components/float-label'));
defineIsland('ifta-label', () => import('./components/ifta-label'));
defineIsland('input-group', () => import('./components/input-group'));
defineIsland('input-group-addon', () => import('./components/input-group').then(m => ({ default: m.InputGroupAddonIsland })));
defineIsland('input-text', () => import('./components/input-text'));
defineIsland('carousel', () => import('./components/carousel'));
defineIsland('paginator', () => import('./components/paginator'));
defineIsland('dataview', () => import('./components/dataview'));
defineIsland('menubar', () => import('./components/menubar'));
defineIsland('menu', () => import('./components/menu'));
defineIsland('context-menu', () => import('./components/context-menu'));
defineIsland('popover', () => import('./components/popover'));
defineIsland('tooltip-component', () => import('./components/tooltip-component'));
defineIsland('sidebar', () => import('./components/sidebar'));
defineIsland('tieredmenu', () => import('./components/tieredmenu'));
defineIsland('message', () => import('./components/message'));

// Export Headless Composables, Animations & Strongly-Typed Models
export * from './composables/index';
export * from './types/models';
export * from './styles/animations';
export * from './styles/design-tokens';
