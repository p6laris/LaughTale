/**
 * SoftMax.LaughTale Client Runtime API
 * High-performance Islands Architecture hydration & multi-framework engine.
 */

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
