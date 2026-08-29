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
defineIsland('tree', () => import('./components/tree'));
defineIsland('treetable', () => import('./components/treetable'));
defineIsland('tree-table', () => import('./components/treetable'));
defineIsland('tree-select', () => import('./components/tree-select'));
defineIsland('datatable', () => import('./components/datatable'));
defineIsland('datagrid', () => import('./components/datatable'));
defineIsland('modal', () => import('./components/modal'));
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
defineIsland('card', () => import('./components/card'));
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
defineIsland('navigation-menu', () => import('./components/menu'));
defineIsland('context-menu', () => import('./components/context-menu'));
defineIsland('popover', () => import('./components/popover'));
defineIsland('tooltip', () => import('./components/tooltip-component'));
defineIsland('tooltip-component', () => import('./components/tooltip-component'));
defineIsland('sidebar', () => import('./components/sidebar'));

// Export Headless Composables, Animations & Strongly-Typed Models
export * from './composables/index';
export * from './types/models';
export * from './styles/animations';
export * from './styles/design-tokens';
