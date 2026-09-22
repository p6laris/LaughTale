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
    type IslandDefinition,
    type IslandContext
} from './runtime/registry';
export { hydrateIsland, initIslands, retryIsland, getIslandState, setHydrationErrorHandler, getHydrationErrorHandler, type HydrateStrategy, type HydrationState, type HydrationErrorHandler } from './runtime/hydrator';
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
// createReactIsland/createVueIsland/createSvelteIsland/createPreactIsland are deliberately NOT
// re-exported here (they ARE from runtime-core.ts, consumed by the "index" all-in-one bundle) - each
// framework adapter's `await import('react'|'vue'|'svelte'|'preact')` is only truly optional in a
// build that can code-split around it. This "runtime" entry point is also built as a single-file
// IIFE (dist/runtime.js, esbuild.config.mjs) with no splitting support at all, so esbuild has no
// choice but to inline any reachable dynamic import whole - re-exporting `createPreactIsland` here
// silently shipped the entire preact package (~11.6 KB raw) in every consumer of the "lean runtime"
// script tag, whether or not they use Preact, and was the direct cause of this bundle exceeding its
// own gzip budget (confirmed via `esbuild.analyzeMetafile`). Vanilla has no such dynamic import, so
// it stays.
export { initDirectives } from './directives/index';
export { LucideIcons, getLucideIcon } from './icons/lucide';
export { registerCommand, unregisterCommand, getCommand, executeCommand, clearCommands, listCommands, type CommandHandler } from './runtime/commands';
export { getCspNonce, setCspNonce, applyNonceToStyle, applyNonceToScript } from './directives/csp';
export { createScope, type IslandScope } from './runtime/scope';
export { initDesignTokens, updateToken, getToken, AURA_PALETTES, generatePaletteRamp, saveTheme, loadSavedTheme, applySavedTheme, generateThemeExports, type SavedThemeConfig, THEME_STORAGE_KEY, calculateRelativeLuminance, calculateContrastRatio, checkWcagCompliance, type WcagComplianceResult } from './styles/design-tokens';
export { renderThemeMatrix, captureStyleSignature, type MatrixPermutation, type ComponentMatrixSnapshot } from './testing/visual-harness';
export { measureHydration, measureThroughput, recordHydrationMetric, getHydrationMetrics, clearHydrationMetrics, calculatePercentiles, type BenchmarkMetric, type HydrationMetric } from './runtime/benchmark';
export { PrefetchManager, prefetchManager, type CachedResponse, type PrefetchOptions } from './router/prefetch';
export { prefetchIslandChunk, prefetchIslandChunksInHtml } from './router/chunk-prefetch';
export { reportHydrationTelemetry, wireLaughTaleTelemetryReporting, type HydrationDiagnosticDetail } from './runtime/telemetry';
export { extractIconSymbols, generateSubsetSprite, computeSpriteHash } from './icons/subset-generator';
export { announce, clearAnnouncements, getAnnouncerElement, type AnnouncePriority } from './accessibility/announcer';
export { applyAriaAttributes, setRovingTabindex, handleRovingKeydown } from './accessibility/aria';
export { isReducedMotionPreferred, getReducedMotionSafeDuration } from './styles/animations';
export { renderErrorBoundary, isDevMode } from './runtime/error-boundary';
export { MemoryLeakHarness, leakHarness, type LeakReport } from './testing/leak-harness';







