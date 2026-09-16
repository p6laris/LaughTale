/**
 * LaughTale: Multi-Strategy Client Hydration Engine (Hardened Edition)
 * Supercharged with Astro-grade prop revival, query retry, singleton child viewport observation,
 * streaming SSR, tri-state lifecycle tracking ('idle' | 'pending' | 'mounted' | 'failed'), and explicit retry recovery.
 */

import { getIslandDefinition, normalizeMountResult, onIslandRegistered, type IslandContext } from './registry';
import { setIslandUpdateFn, clearIslandUpdateFn } from './island-instances';
import { parseAndReviveProps } from './reviver';
import { importWithRetry } from './retry';
import { awaitStreamingReady } from './streaming';
import { renderErrorBoundary } from './error-boundary';
import { refreshIsland } from './refresh';
import { initDesignTokens } from '../styles/design-tokens';
import { useLocale } from '../composables/useLocale';
import { useSharedState } from './state';

export type HydrateStrategy = 'load' | 'idle' | 'visible' | 'media' | 'interaction' | 'never';
export type HydrationState = 'idle' | 'pending' | 'mounted' | 'failed';

/**
 * Matches every way an island's root container can be marked. Exported so other modules that need to
 * find island elements (e.g. devtools/state.ts) use the exact same selector rather than an
 * independently-maintained copy that can drift.
 */
export const ISLAND_SELECTOR = '[data-island], island, [hydrate], [data-hydrate]';

/**
 * True when `el` has an island ancestor strictly between it and `root` (exclusive of both). Bounded at
 * `root` rather than walking to document.documentElement, since callers pass a specific container they
 * want the answer scoped to (e.g. "is this a NESTED island relative to the one I'm hydrating", not
 * "is there an island ancestor anywhere in the whole document").
 */
function hasIslandAncestorWithin(el: HTMLElement, root: ParentNode): boolean {
    let curr: HTMLElement | null = el.parentElement;
    while (curr && curr !== root) {
        if (curr.matches(ISLAND_SELECTOR)) return true;
        curr = curr.parentElement;
    }
    return false;
}

/**
 * Hydrates every island directly under `root` that does NOT have another island between it and `root`
 * (ROADMAP.v5.md Part D, nested islands) - used by executeHydration's post-mount step below to pick up
 * any nested island markup a parent's own render just introduced. Deliberately NOT called from
 * initIslands() itself: nested islands still hydrate concurrently with their parent there, exactly as
 * before this pass (see the comment on initIslands for why gating that turned out to be a real
 * regression, not an improvement).
 */
function hydrateTopLevelIslandsWithin(root: ParentNode): void {
    root.querySelectorAll<HTMLElement>(ISLAND_SELECTOR).forEach((el) => {
        if (hasIslandAncestorWithin(el, root)) return;
        hydrateIsland(el);
    });
}

export type HydrationErrorHandler = (error: Error, context: { islandName: string; element: HTMLElement }) => void;

let globalErrorHandler: HydrationErrorHandler | null = null;

/**
 * Registers a global error handler callback for hydration failures (e.g. Sentry, Application Insights).
 */
export function setHydrationErrorHandler(handler: HydrationErrorHandler | null): void {
    globalErrorHandler = handler;
}

/**
 * Returns the currently active hydration error handler.
 */
export function getHydrationErrorHandler(): HydrationErrorHandler | null {
    return globalErrorHandler;
}

const HYDRATION_STATE_KEY = '__laughtale_state__';

interface VisibleIslandMeta {
    container: HTMLElement;
    name: string;
}

const visibleElementsMap = new WeakMap<Element, VisibleIslandMeta>();
let sharedVisibleObserver: IntersectionObserver | null = null;

function getSharedVisibleObserver(): IntersectionObserver | null {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
        return null;
    }

    if (!sharedVisibleObserver) {
        sharedVisibleObserver = new IntersectionObserver((entries) => {
            for (const entry of entries) {
                if (entry.isIntersecting) {
                    const meta = visibleElementsMap.get(entry.target);
                    if (meta) {
                        unobserveVisibleIsland(meta.container);
                        executeHydration(meta.container, meta.name);
                    }
                }
            }
        }, { rootMargin: '120px' });
    }

    return sharedVisibleObserver;
}

function unobserveVisibleIsland(container: HTMLElement): void {
    const observer = getSharedVisibleObserver();
    if (!observer) return;

    observer.unobserve(container);
    visibleElementsMap.delete(container);

    for (let i = 0; i < container.children.length; i++) {
        observer.unobserve(container.children[i]);
        visibleElementsMap.delete(container.children[i]);
    }
}

/**
 * Returns the current hydration lifecycle state of an island container.
 */
export function getIslandState(container: HTMLElement): HydrationState {
    return (container as any)[HYDRATION_STATE_KEY] || 'idle';
}

/**
 * Initiates hydration for an island container based on its strategy.
 */
export function hydrateIsland(container: HTMLElement): void {
    if (getIslandState(container) !== 'idle') return;

    const name = container.getAttribute('data-island') || container.getAttribute('name');
    if (!name) return;

    const strategy = (container.getAttribute('data-hydrate') || container.getAttribute('hydrate') || 'load').toLowerCase() as HydrateStrategy;
    const mediaQuery = container.getAttribute('data-media') || container.getAttribute('media');

    switch (strategy) {
        case 'load':
            executeHydration(container, name);
            break;
        case 'idle':
            hydrateIdle(container, name);
            break;
        case 'visible':
            hydrateVisible(container, name);
            break;
        case 'interaction':
            hydrateInteraction(container, name);
            break;
        case 'media':
            hydrateMedia(container, name, mediaQuery);
            break;
        case 'never':
            // Server-only island (zero JS execution)
            break;
        default:
            executeHydration(container, name);
    }
}

/**
 * Explicitly retries hydration on an island in the 'failed' state.
 */
export async function retryIsland(container: HTMLElement): Promise<void> {
    const name = container.getAttribute('data-island') || container.getAttribute('name');
    if (!name) return;

    teardownIsland(container);
    // Reset state to allow clean re-execution
    (container as any)[HYDRATION_STATE_KEY] = 'idle';
    await executeHydration(container, name);
}

/**
 * Picks up islands that failed to hydrate only because their name wasn't registered YET at scan
 * time - e.g. a separately-built, separately-loaded islands bundle for user-authored islands
 * (ROADMAP.v5.md Part B) whose <script> tag loads after the app's own main bundle already called
 * initIslands() and scanned the DOM. Without this, such an island is permanently stuck in the
 * 'failed' state: hydrateIsland()'s own idle-only guard means a later, unconditional initIslands()
 * re-scan would skip it too. Scoped to exactly the elements waiting on the name that was just
 * registered, so this stays cheap on the common path (every one of the ~80 defineIsland() calls
 * for the built-in components happens before any hydration has even started, so this query
 * matches nothing for almost all of them).
 */
onIslandRegistered((name) => {
    if (typeof document === 'undefined') return;
    const escaped = typeof CSS !== 'undefined' && CSS.escape ? CSS.escape(name) : name;
    const candidates = document.querySelectorAll<HTMLElement>(`[data-island="${escaped}"], [name="${escaped}"]`);
    candidates.forEach(container => {
        if (getIslandState(container) === 'failed') {
            void retryIsland(container);
        }
    });
});

async function executeHydration(container: HTMLElement, name: string): Promise<void> {
    const currentState = getIslandState(container);
    if (currentState === 'pending' || currentState === 'mounted' || currentState === 'failed') {
        return;
    }

    // Synchronously mark as pending to prevent concurrent execution
    (container as any)[HYDRATION_STATE_KEY] = 'pending';

    const definition = getIslandDefinition(name);
    if (!definition) {
        (container as any)[HYDRATION_STATE_KEY] = 'failed';
        console.warn(`[LaughTale] Island '${name}' is not registered in the client registry.`);
        return;
    }

    const startMark = `laughtale:hydrate:start:${name}`;
    const endMark = `laughtale:hydrate:end:${name}`;
    const measureName = `laughtale:hydrate:${name}`;

    if (typeof performance !== 'undefined' && typeof performance.mark === 'function') {
        try { performance.mark(startMark); } catch {}
    }

    try {
        // 1. Await streaming SSR completion if applicable
        await awaitStreamingReady(container);

        // 2. Parse & revive props (Date, Uint8Array, Map, Set, BigInt, URL)
        const rawProps = container.getAttribute('data-props') || container.getAttribute('props-json') || container.getAttribute('props');
        const props = parseAndReviveProps(rawProps);

        // 3. Load component module with retry resilience
        const module: any = await importWithRetry(definition.loader);
        const mount = module?.default || module;

        if (typeof mount !== 'function') {
            throw new Error(`Island '${name}' module does not export a mount function.`);
        }

        // 4. Attach imperative handle if defined, otherwise attach standard island handle
        const customHandle = typeof module?.createHandle === 'function' ? module.createHandle(container, props) : {};
        (container as any).island = {
            ...customHandle,
            refresh: (newProps?: Record<string, any>) => refreshIsland(container, newProps)
        };

        // 5. Construct structural IslandContext (, )
        const abortController = new AbortController();
        const cleanups: (() => void)[] = [];

        const localeVal = container.getAttribute('lang') || (typeof document !== 'undefined' ? document.documentElement.lang : 'en') || 'en';
        const dirVal = ((container.getAttribute('dir') || (typeof document !== 'undefined' ? document.documentElement.dir : 'ltr') || 'ltr').toLowerCase()) as 'ltr' | 'rtl';

        const ctx: IslandContext = {
            signal: abortController.signal,
            onCleanup: (fn: () => void) => cleanups.push(fn),
            container,
            name,
            locale: localeVal,
            dir: dirVal,
            // Computed once, here, so every mount function (vanilla included) shares one normalized
            // answer to "was there pre-existing DOM here" instead of re-deriving it ad hoc (ROADMAP.v5.md
            // Part D) - the same check react.ts/vue.ts/preact.ts/svelte.ts already performed independently.
            hydrate: container.hasChildNodes(),
            // Reaches the existing (previously unwired) useSharedState composable - see IslandContext's
            // own doc comment for why this is `sharedState`, not `state` (ROADMAP.v5.md Part D vs Part F).
            sharedState: useSharedState
        };

        const localeHelpers = useLocale(ctx);
        ctx.t = localeHelpers.t;
        ctx.dictionary = localeHelpers.dictionary;

        // Snapshot direct nested islands (ROADMAP.v5.md Part D) BEFORE mount runs, so their survival
        // can be checked afterward - mount() may destructively replace this container's subtree (a
        // vanilla innerHTML rewrite, or a framework adapter's replace-mode render/mount) before a
        // nested island ever gets a chance to hydrate against its original DOM node.
        const nestedBeforeMount = Array.from(container.querySelectorAll<HTMLElement>(ISLAND_SELECTOR))
            .filter((el) => !hasIslandAncestorWithin(el, container));

        // 6. Mount island with context and register unmount hook
        const mountResult = await mount(container, props, ctx);
        const { unmount, update } = normalizeMountResult(mountResult);

        // Track the adapter's in-place update fn (if any) so refresh.ts can push new props
        // into this instance without a full unmount/remount. Internal plumbing only — not
        // part of the public container.island handle below.
        setIslandUpdateFn(container, update);

        const cleanup = () => {
            try {
                abortController.abort();
            } catch {}

            if (typeof unmount === 'function') {
                try {
                    unmount();
                } catch (e) {
                    console.error(`[LaughTale] Error unmounting island '${name}':`, e);
                }
            }

            while (cleanups.length > 0) {
                try {
                    cleanups.pop()!();
                } catch (e) {
                    console.error(`[LaughTale] Error in cleanup callback for island '${name}':`, e);
                }
            }

            clearIslandUpdateFn(container);
            delete (container as any).island;
        };

        container.addEventListener('laughtale:unmount', cleanup, { once: true });

        (container as any)[HYDRATION_STATE_KEY] = 'mounted';

        // 6. RUM Performance Mark & Measure
        if (typeof performance !== 'undefined' && typeof performance.mark === 'function') {
            try {
                performance.mark(endMark);
                if (typeof performance.measure === 'function') {
                    performance.measure(measureName, startMark, endMark);
                }
            } catch {}
        }

        // 7. Dispatch success lifecycle event
        container.dispatchEvent(new CustomEvent('laughtale:hydrated', {
            bubbles: true,
            composed: true,
            detail: { name, strategy: container.getAttribute('data-hydrate') }
        }));

        // 8. Dispatch structured diagnostics event (ROADMAP.v5.md Part G/L) — the "smallest real
        // v1" of a diagnostics extension point: no panel registry, just one event a future
        // DevTools overlay (or any other listener) can consume with zero new API surface. Reuses
        // the perf mark/measure this function already computes above rather than taking a second
        // timing measurement.
        let durationMs: number | undefined;
        if (typeof performance !== 'undefined' && typeof performance.getEntriesByName === 'function') {
            try {
                const entries = performance.getEntriesByName(measureName);
                durationMs = entries.length > 0 ? entries[entries.length - 1].duration : undefined;
            } catch {}
        }
        container.dispatchEvent(new CustomEvent('laughtale:diagnostic', {
            bubbles: true,
            composed: true,
            detail: {
                name,
                strategy: container.getAttribute('data-hydrate'),
                framework: container.getAttribute('data-framework') ?? undefined,
                propsSize: rawProps?.length ?? 0,
                durationMs
            }
        }));

        // 9. Nested islands (ROADMAP.v5.md Part D): a nested island still hydrates concurrently with
        // its parent, exactly as it always has (an earlier version of this fix deferred nested
        // hydration until the parent settled, but that broke real, currently-working components like
        // FloatLabelIsland, which synchronously reads a nested island's already-rendered DOM - e.g. the
        // <input> a nested input-text island produces - during its OWN mount to wire ARIA attributes;
        // deferring starved that read of anything to find). What this adds instead is detection: wait
        // one paint cycle for any adapter whose mount doesn't commit DOM synchronously (React's
        // createRoot().render(), called here outside a native browser event, schedules its commit at
        // DefaultLane priority via a MessageChannel macrotask - a bare microtask would not wait long
        // enough, but requestAnimationFrame reliably runs after at least one full macrotask turn;
        // react.ts also wraps its own initial render in flushSync so this isn't the only thing this
        // relies on, but it's cheap, harmless for every already-synchronous adapter, and correct
        // defense-in-depth for any future adapter with similar scheduling), then check whether each
        // nested island that existed before mount is still connected to the document. A silently
        // destroyed nested island (a parent's own innerHTML rewrite, or a framework's replace-mode
        // mount, wiping it out) now gets a loud, actionable warning instead of just vanishing.
        await new Promise<void>((resolve) => {
            if (typeof requestAnimationFrame === 'function') {
                requestAnimationFrame(() => resolve());
            } else {
                resolve();
            }
        });

        for (const nestedEl of nestedBeforeMount) {
            if (!nestedEl.isConnected) {
                const lostName = nestedEl.getAttribute('data-island') || nestedEl.getAttribute('name') || '(unnamed)';
                console.warn(`[LaughTale] Nested island '${lostName}' inside '${name}' was destroyed when '${name}' mounted. '${name}' must explicitly preserve or re-render nested island content (e.g. via a content slot) for it to work.`);
            }
        }
        // Also hydrate any nested island NOT present before mount - e.g. markup the parent's own
        // render just introduced - which the page's original top-level scan could never have reached.
        // Idempotent (hydrateIsland no-ops on anything not still idle), so this is purely additive.
        hydrateTopLevelIslandsWithin(container);
    } catch (error: any) {
        (container as any)[HYDRATION_STATE_KEY] = 'failed';

        // Notify custom telemetry error handler if registered
        if (globalErrorHandler) {
            try {
                globalErrorHandler(error, { islandName: name, element: container });
            } catch (handlerErr) {
                console.error(`[LaughTale] Error in custom hydration error handler:`, handlerErr);
            }
        }

        console.error(`[LaughTale] Error hydrating island '${name}':`, error);
        container.dispatchEvent(new CustomEvent('laughtale:hydration-error', {
            bubbles: true,
            composed: true,
            detail: { name, error }
        }));

        // Render fallback content & dev-mode diagnostic overlay
        try {
            renderErrorBoundary(container, name, error);
        } catch (boundaryErr) {
            console.error(`[LaughTale] Error rendering error boundary for island '${name}':`, boundaryErr);
        }
    }
}

function hydrateIdle(container: HTMLElement, name: string): void {
    if ('requestIdleCallback' in window) {
        (window as any).requestIdleCallback(() => executeHydration(container, name), { timeout: 2000 });
    } else {
        setTimeout(() => executeHydration(container, name), 200);
    }
}

/**
 * Singleton Child-Targeted Viewport Observer
 * Observes container and its child nodes using a single shared IntersectionObserver
 * and automatically unobserves when laughtale:unmount is received.
 */
function hydrateVisible(container: HTMLElement, name: string): void {
    const observer = getSharedVisibleObserver();
    if (!observer) {
        executeHydration(container, name);
        return;
    }

    const meta: VisibleIslandMeta = { container, name };
    visibleElementsMap.set(container, meta);
    observer.observe(container);

    // Also observe children to support `display: contents` layouts
    for (let i = 0; i < container.children.length; i++) {
        visibleElementsMap.set(container.children[i], meta);
        observer.observe(container.children[i]);
    }

    // Teardown observer if island is unmounted before scrolling into view
    container.addEventListener('laughtale:unmount', () => {
        unobserveVisibleIsland(container);
    }, { once: true });
}

function hydrateInteraction(container: HTMLElement, name: string): void {
    const events = ['mouseenter', 'focusin', 'touchstart', 'click'];
    const onInteract = () => {
        events.forEach(e => container.removeEventListener(e, onInteract));
        executeHydration(container, name);
    };

    events.forEach(e => container.addEventListener(e, onInteract, { once: true, passive: true }));
}

function hydrateMedia(container: HTMLElement, name: string, query: string | null): void {
    if (!query) {
        executeHydration(container, name);
        return;
    }

    const mql = window.matchMedia(query);
    if (mql.matches) {
        executeHydration(container, name);
    } else {
        const handler = (e: MediaQueryListEvent) => {
            if (e.matches) {
                mql.removeEventListener('change', handler);
                executeHydration(container, name);
            }
        };
        mql.addEventListener('change', handler);
    }
}

/**
 * Tears down the active mount on an island container, aborting its signal and running cleanups.
 */
export function teardownIsland(container: HTMLElement): void {
    const CustomEventCtor = (container.ownerDocument?.defaultView as any)?.CustomEvent
        || (typeof CustomEvent !== 'undefined' ? CustomEvent : Event);

    // laughtale:unmount is intentionally non-bubbling (see the dispatch below), so a nested island's
    // own cleanup listener - registered on its own container, not this one - never fires when only its
    // ancestor is torn down (retryIsland, or rehydrateIsland during refresh) without this cascade.
    // Mirrors router.ts's full-page-navigation teardown: children before parents, dispatched
    // individually since nothing bubbles. Re-querying at teardown time rather than tracking hydrated
    // descendants separately keeps this self-healing across refreshes with no bookkeeping to maintain;
    // dispatching to an idle/never-hydrated descendant is already a safe no-op since nothing has
    // registered a listener on it yet (ROADMAP.v5.md Part D).
    const getDepth = (el: HTMLElement): number => {
        let depth = 0;
        let curr: HTMLElement | null = el;
        while (curr) {
            depth++;
            curr = curr.parentElement;
        }
        return depth;
    };

    const nested = Array.from(container.querySelectorAll<HTMLElement>(ISLAND_SELECTOR));
    nested.sort((a, b) => getDepth(b) - getDepth(a));
    nested.forEach((el) => el.dispatchEvent(new CustomEventCtor('laughtale:unmount', { bubbles: false })));

    container.dispatchEvent(new CustomEventCtor('laughtale:unmount', { bubbles: false }));
}

/**
 * Forces re-hydration of an island with updated props (used by server-driven refresh).
 */
export async function rehydrateIsland(container: HTMLElement): Promise<void> {
    const name = container.getAttribute('data-island');
    if (!name) return;
    teardownIsland(container);
    delete (container as any)[HYDRATION_STATE_KEY];
    await executeHydration(container, name);
}

export function initIslands(root: ParentNode = document): void {
    initDesignTokens();
    // Deliberately NOT filtered to exclude nested islands (an earlier version of this fix did, and a
    // real regression was found live: components like FloatLabelIsland synchronously read a nested
    // island's rendered DOM (querySelector for the actual <input> it wraps) during their OWN mount, to
    // wire ARIA attributes - deferring nested hydration until the parent settles starves that read of
    // anything to find. Nested islands hydrate concurrently, exactly as before this pass; see
    // executeHydration below for what this pass actually adds instead: detecting and warning about
    // nested islands that get destroyed, not gating when they start.
    root.querySelectorAll<HTMLElement>(ISLAND_SELECTOR).forEach(hydrateIsland);
}
