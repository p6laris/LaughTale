/**
 * SoftMax.LaughTale Core Client Runtime API
 * Ultra-lightweight Islands Architecture hydration & lifecycle engine.
 */

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
export { createPreactIsland, type PreactAdapterOptions } from './adapters/preact';
export { initDirectives } from './directives/index';
export { LucideIcons, getLucideIcon } from './icons/lucide';
export { registerCommand, unregisterCommand, getCommand, executeCommand, clearCommands, listCommands, type CommandHandler } from './runtime/commands';
export { getCspNonce, setCspNonce, applyNonceToStyle, applyNonceToScript } from './directives/csp';
export { createScope, type IslandScope } from './runtime/scope';
