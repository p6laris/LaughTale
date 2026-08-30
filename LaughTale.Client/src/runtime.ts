/**
 * LaughTale Core Client Runtime API
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
export { hydrateIsland, initIslands, retryIsland, getIslandState, setHydrationErrorHandler, getHydrationErrorHandler, type HydrateStrategy, type HydrationState, type HydrationErrorHandler } from './runtime/hydrator';
export { enableViewTransitions, navigateTo } from './runtime/router';
export { getSlot, extractSlotContent, hasSlot } from './runtime/slots';
export { injectIslandStyle, flushPendingStyles, removeIslandStyle, clearAllIslandStyles, isAdoptedStyleSheetsSupported } from './runtime/styles';
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
export { initDesignTokens, updateToken, getToken, AURA_PALETTES, generatePaletteRamp, saveTheme, loadSavedTheme, applySavedTheme, generateThemeExports, type SavedThemeConfig, THEME_STORAGE_KEY, calculateRelativeLuminance, calculateContrastRatio, checkWcagCompliance, type WcagComplianceResult } from './styles/design-tokens';
export { renderThemeMatrix, captureStyleSignature, type MatrixPermutation, type ComponentMatrixSnapshot } from './testing/visual-harness';
export { measureHydration, measureThroughput, recordHydrationMetric, getHydrationMetrics, clearHydrationMetrics, calculatePercentiles, type BenchmarkMetric, type HydrationMetric } from './runtime/benchmark';
export { PrefetchManager, prefetchManager, type CachedResponse, type PrefetchOptions } from './router/prefetch';
export { extractIconSymbols, generateSubsetSprite, computeSpriteHash } from './icons/subset-generator';
export { announce, clearAnnouncements, getAnnouncerElement, type AnnouncePriority } from './accessibility/announcer';
export { applyAriaAttributes, setRovingTabindex, handleRovingKeydown } from './accessibility/aria';
export { initAnimationStyles, injectRipple, isReducedMotionPreferred, getReducedMotionSafeDuration } from './styles/animations';





