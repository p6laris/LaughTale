/**
 * SoftMax.LaughTale Client Runtime API
 * High-performance Islands Architecture hydration & multi-framework engine.
 */

import { defineIsland } from './runtime/registry';

export { defineIsland, getIslandDefinition, hasIsland } from './runtime/registry';
export { hydrateIsland, initIslands, retryIsland, getIslandState, type HydrateStrategy, type HydrationState } from './runtime/hydrator';
export { enableViewTransitions, navigateTo } from './runtime/router';
export { getSlot, extractSlotContent, hasSlot } from './runtime/slots';
export { injectIslandStyle, removeIslandStyle } from './runtime/styles';
export { emitIslandEvent, onIslandEvent } from './runtime/events';
export { IslandStore, useSharedState } from './runtime/state';
export { parseAndReviveProps, reviveTuple } from './runtime/reviver';
export { importWithRetry, type RetryOptions } from './runtime/retry';
export { awaitStreamingReady } from './runtime/streaming';
export { createVanillaIsland } from './adapters/vanilla';
export { createPreactIsland } from './adapters/preact';
export { initDirectives } from './directives/index';
export { LucideIcons, getLucideIcon } from './icons/lucide';
export { registerCommand, unregisterCommand, getCommand, executeCommand, clearCommands, listCommands, type CommandHandler } from './runtime/commands';
export { getCspNonce, setCspNonce, applyNonceToStyle, applyNonceToScript } from './directives/csp';
export { createScope, type IslandScope } from './runtime/scope';

// Auto-register built-in enterprise components
defineIsland('stepper', () => import('./components/stepper'));
defineIsland('timeline', () => import('./components/timeline'));
defineIsland('dropzone', () => import('./components/dropzone'));
defineIsland('tree', () => import('./components/tree'));
defineIsland('treetable', () => import('./components/treetable'));
defineIsland('tree-table', () => import('./components/treetable'));
defineIsland('p-treetable', () => import('./components/treetable'));
defineIsland('island-treetable', () => import('./components/treetable'));
defineIsland('tree-select', () => import('./components/tree-select'));
defineIsland('datatable', () => import('./components/datatable'));
defineIsland('datagrid', () => import('./components/datatable'));
defineIsland('toast', () => import('./components/toast'));

// Aura Expanded Suite
defineIsland('input-number', () => import('./components/input-number'));
defineIsland('input-otp', () => import('./components/input-otp'));
defineIsland('input-password', () => import('./components/input-password'));
defineIsland('toggle-switch', () => import('./components/toggle-switch'));
defineIsland('toggle-button', () => import('./components/toggle-button'));
defineIsland('togglebutton', () => import('./components/toggle-button'));
defineIsland('button', () => import('./components/button'));
defineIsland('slider', () => import('./components/slider'));
defineIsland('rating', () => import('./components/rating'));
defineIsland('select-button', () => import('./components/select-button'));
defineIsland('chips', () => import('./components/input-tags'));
defineIsland('input-tags', () => import('./components/input-tags'));
defineIsland('inputtags', () => import('./components/input-tags'));
defineIsland('tags', () => import('./components/input-tags'));
defineIsland('datepicker', () => import('./components/datepicker'));
defineIsland('meter-group', () => import('./components/meter-group'));
defineIsland('avatar-group', () => import('./components/avatar-group'));
defineIsland('progress-bar', () => import('./components/progress-bar'));
defineIsland('skeleton', () => import('./components/skeleton'));
defineIsland('drawer', () => import('./components/drawer'));
defineIsland('speed-dial', () => import('./components/speed-dial'));
defineIsland('image-compare', () => import('./components/image-compare'));
defineIsland('imagecompare', () => import('./components/image-compare'));
defineIsland('compare', () => import('./components/image-compare'));
defineIsland('p-compare', () => import('./components/image-compare'));
defineIsland('island-compare', () => import('./components/image-compare'));
defineIsland('confirm-popup', () => import('./components/confirm-popup'));
defineIsland('confirm-dialog', () => import('./components/confirm-dialog'));
defineIsland('dialog', () => import('./components/dialog'));
defineIsland('confirmdialog', () => import('./components/confirm-dialog'));
defineIsland('fileupload', () => import('./components/fileupload'));
defineIsland('file-upload', () => import('./components/fileupload'));

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
defineIsland('commandmenu', () => import('./components/command'));
defineIsland('command-menu', () => import('./components/command'));
defineIsland('command-palette', () => import('./components/command'));
defineIsland('commandpalette', () => import('./components/command'));
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
defineIsland('radio', () => import('./components/radio-button'));
defineIsland('textarea', () => import('./components/textarea'));
defineIsland('input-mask', () => import('./components/input-mask'));
defineIsland('float-label', () => import('./components/float-label'));
defineIsland('ifta-label', () => import('./components/ifta-label'));
defineIsland('input-group', () => import('./components/input-group'));
defineIsland('input-group-addon', () => import('./components/input-group').then(m => ({ default: m.InputGroupAddonIsland })));
defineIsland('inputgroup', () => import('./components/input-group'));
defineIsland('inputgroup-addon', () => import('./components/input-group').then(m => ({ default: m.InputGroupAddonIsland })));
defineIsland('input-text', () => import('./components/input-text'));
defineIsland('enhanced-input', () => import('./components/input-text'));
defineIsland('carousel', () => import('./components/carousel'));
defineIsland('paginator', () => import('./components/paginator'));
defineIsland('dataview', () => import('./components/dataview'));
defineIsland('menubar', () => import('./components/menubar'));
defineIsland('p-menubar', () => import('./components/menubar'));
defineIsland('island-menubar', () => import('./components/menubar'));
defineIsland('menu', () => import('./components/menu'));
defineIsland('p-menu', () => import('./components/menu'));
defineIsland('context-menu', () => import('./components/context-menu'));
defineIsland('contextmenu', () => import('./components/context-menu'));
defineIsland('p-contextmenu', () => import('./components/context-menu'));
defineIsland('island-contextmenu', () => import('./components/context-menu'));
defineIsland('popover', () => import('./components/popover'));
defineIsland('tooltip', () => import('./components/tooltip-component'));
defineIsland('tooltip-component', () => import('./components/tooltip-component'));
defineIsland('sidebar', () => import('./components/sidebar'));
defineIsland('p-sidebar', () => import('./components/sidebar'));
defineIsland('sidebar-layout', () => import('./components/sidebar'));
defineIsland('tieredmenu', () => import('./components/tieredmenu'));
defineIsland('tiered-menu', () => import('./components/tieredmenu'));
defineIsland('p-tieredmenu', () => import('./components/tieredmenu'));
defineIsland('island-tieredmenu', () => import('./components/tieredmenu'));
defineIsland('message', () => import('./components/message'));
defineIsland('p-message', () => import('./components/message'));
defineIsland('inline-message', () => import('./components/message'));
defineIsland('inlinemessage', () => import('./components/message'));
defineIsland('toast', () => import('./components/toast'));
defineIsland('p-toast', () => import('./components/toast'));
defineIsland('island-toast', () => import('./components/toast'));

// Export Headless Composables, Animations & Strongly-Typed Models
export * from './composables/index';
export * from './types/models';
export * from './styles/animations';
export * from './styles/design-tokens';
