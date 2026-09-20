/**
 * LaughTale Runtime Core API
 * High-performance Islands Architecture hydration, directives & multi-framework engine.
 * Exported separately from component registries for tree-shaking & minimal bundles.
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
    type IslandDefinition,
    type IslandContext
} from './runtime/registry';
export { hydrateIsland, initIslands, retryIsland, teardownIsland, rehydrateIsland, getIslandState, setHydrationErrorHandler, getHydrationErrorHandler, type HydrateStrategy, type HydrationState, type HydrationErrorHandler } from './runtime/hydrator';
export { refreshIsland, type RefreshOptions } from './runtime/refresh';
export { enableViewTransitions, navigateTo } from './runtime/router';
export { resolvePart, applyPart, type PassthroughRecord, type PartOptions, type ResolvedPart } from './runtime/parts';
export { getSlot, extractSlotContent, hasSlot } from './runtime/slots';
export { injectIslandStyle, flushPendingStyles, removeIslandStyle, clearAllIslandStyles, isAdoptedStyleSheetsSupported } from './runtime/styles';
export { emitIslandEvent, onIslandEvent, emitComponentEvent, EVENT_PREFIX, EVENT_ALIASES, type EventAlias } from './runtime/events';
export { IslandStore, useSharedState } from './runtime/state';
export { parseAndReviveProps, reviveTuple } from './runtime/reviver';
export { importWithRetry, type RetryOptions } from './runtime/retry';
export { hasSsrContent, getSsrRoot, markSsrHydrated, SSR_ATTR, SSR_HYDRATED_ATTR } from './runtime/ssr';
export { renderSkeleton, renderEmptyState, renderErrorState } from './runtime/states';
export type { ComponentStateProps, SkeletonOptions, StateMessageOptions } from './types/states';
export { createVanillaIsland } from './adapters/vanilla';
export { createReactIsland } from './adapters/react';
export { createVueIsland } from './adapters/vue';
export { createSvelteIsland } from './adapters/svelte';
export { createPreactIsland } from './adapters/preact';
export { initDirectives } from './directives/index';
export { LucideIcons, getLucideIcon } from './icons/lucide';
export { registerCommand, unregisterCommand, getCommand, executeCommand, clearCommands, listCommands, type CommandHandler } from './runtime/commands';
export { getCspNonce, setCspNonce, applyNonceToStyle, applyNonceToScript } from './directives/csp';
export { createScope, type IslandScope } from './runtime/scope';
export { renderErrorBoundary, isDevMode } from './runtime/error-boundary';
export { initDesignTokens, updateToken, getToken, AURA_PALETTES, generatePaletteRamp, saveTheme, loadSavedTheme, applySavedTheme, generateThemeExports, type SavedThemeConfig, THEME_STORAGE_KEY, calculateRelativeLuminance, calculateContrastRatio, checkWcagCompliance, type WcagComplianceResult } from './styles/design-tokens';
export { laughtaleTailwindPreset } from './styles/tailwind.preset';
export { renderThemeMatrix, captureStyleSignature, type MatrixPermutation, type ComponentMatrixSnapshot } from './testing/visual-harness';
export { measureHydration, measureThroughput, recordHydrationMetric, getHydrationMetrics, clearHydrationMetrics, calculatePercentiles, type BenchmarkMetric, type HydrationMetric } from './runtime/benchmark';
export { PrefetchManager, prefetchManager, type CachedResponse, type PrefetchOptions } from './router/prefetch';
export { extractIconSymbols, generateSubsetSprite, computeSpriteHash } from './icons/subset-generator';
export { announce, clearAnnouncements, getAnnouncerElement, type AnnouncePriority } from './accessibility/announcer';
export { applyAriaAttributes, setRovingTabindex, handleRovingKeydown } from './accessibility/aria';
export { isReducedMotionPreferred, getReducedMotionSafeDuration } from './styles/animations';
export { MemoryLeakHarness, leakHarness, type LeakReport } from './testing/leak-harness';
