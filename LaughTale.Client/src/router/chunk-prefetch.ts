/**
 * LaughTale: Speculative Chunk Prefetch (ROADMAP.v5.md Part B "Speculative prefetch worker").
 *
 * Warms the browser's own ES module cache for an island's dynamically-imported chunk, triggered by
 * the same hover/viewport-intent signal `PrefetchManager` already uses for page-HTML prefetching
 * (see `prefetch.ts`).
 *
 * Deliberately NOT a real ServiceWorker, and that's an honest, deliberate technique swap, not a
 * shortcut: a ServiceWorker brings its own install/activate/update lifecycle, versioning, and
 * same-origin-HTTPS requirements to manage - real complexity a literal reading of "service worker"
 * would add for no extra benefit here, because this framework's static asset pipeline (see Part B's
 * own asset-pipeline closure - `UseLaughTaleStaticAssetsCaching`) already serves every JS chunk with
 * `Cache-Control: public, max-age=365d, immutable`. Calling an island's own `defineIsland` loader -
 * the exact same `import()` a real hydration already uses - IS the browser's own standard
 * chunk-warming primitive: the browser fetches, parses, and caches the module (nothing is
 * executed/mounted, since the loader's resolved value is never used), so a REAL subsequent
 * hydration's `import()` of the identical specifier resolves from the module cache instantly instead
 * of a second network round trip. No custom cache, no custom URL resolution, no service worker
 * registration step for a consuming app to remember.
 */
import { getIslandDefinition } from '../runtime/registry';

/**
 * Island names already warmed (or currently warming) this page load - never re-triggered, since a
 * chunk only needs fetching once per navigation.
 */
const warmed = new Set<string>();

/**
 * Warms one island's chunk. Safe to call for an island name that isn't registered (e.g. discovered
 * via a manifest bundle that hasn't loaded yet) - silently no-ops rather than throwing, since a
 * missed prefetch just means the real hydration-time import pays the normal network cost instead.
 */
export function prefetchIslandChunk(name: string): void {
    if (warmed.has(name)) {
        return;
    }
    warmed.add(name);

    const definition = getIslandDefinition(name);
    if (!definition) {
        warmed.delete(name);
        return;
    }

    definition.loader().catch(() => {
        // A failed prefetch (offline, blocked, etc.) shouldn't be treated as permanently "tried" -
        // the real hydration-time import (via importWithRetry) gets its own normal retry chance.
        warmed.delete(name);
    });
}

/**
 * Scans an HTML string - typically a page `PrefetchManager` already fetched speculatively - for every
 * distinct `data-island="name"` occurrence and warms each one's chunk. Deliberately a plain regex
 * scan, not a DOM parse: the HTML is untrusted-for-execution prefetch content that is never inserted
 * into the live document here, so parsing it into a real DOM (which could trigger side effects from
 * embedded <img>/<script> tags) would be strictly worse than string scanning for this narrow purpose.
 */
export function prefetchIslandChunksInHtml(html: string): void {
    const names = new Set<string>();
    const pattern = /data-island="([^"]+)"/g;
    let match: RegExpExecArray | null;
    while ((match = pattern.exec(html)) !== null) {
        names.add(match[1]);
    }
    names.forEach(prefetchIslandChunk);
}

/**
 * Test isolation only, mirrors `clearRegistry()`/`clearSharedState()`.
 */
export function clearChunkPrefetchState(): void {
    warmed.clear();
}
