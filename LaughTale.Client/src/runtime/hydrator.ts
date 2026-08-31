/**
 * LaughTale: Multi-Strategy Client Hydration Engine (Hardened Edition)
 * Supercharged with Astro-grade prop revival, query retry, singleton child viewport observation,
 * streaming SSR, tri-state lifecycle tracking ('idle' | 'pending' | 'mounted' | 'failed'), and explicit retry recovery.
 */

import { getIslandDefinition, type IslandContext } from './registry';
import { parseAndReviveProps } from './reviver';
import { importWithRetry } from './retry';
import { awaitStreamingReady } from './streaming';
import { renderErrorBoundary } from './error-boundary';
import { refreshIsland } from './refresh';
import { initDesignTokens } from '../styles/design-tokens';
import { useLocale } from '../composables/useLocale';

export type HydrateStrategy = 'load' | 'idle' | 'visible' | 'media' | 'interaction' | 'never';
export type HydrationState = 'idle' | 'pending' | 'mounted' | 'failed';

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

    // Reset state to allow clean re-execution
    (container as any)[HYDRATION_STATE_KEY] = 'idle';
    await executeHydration(container, name);
}

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

        // 5. Construct structural IslandContext (LT-1102, LT-1504)
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
            dir: dirVal
        };

        const localeHelpers = useLocale(ctx);
        ctx.t = localeHelpers.t;
        ctx.dictionary = localeHelpers.dictionary;

        // 6. Mount island with context and register unmount hook
        const unmount = await mount(container, props, ctx);
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
 * Forces re-hydration of an island with updated props (used by server-driven refresh).
 */
export async function rehydrateIsland(container: HTMLElement): Promise<void> {
    const name = container.getAttribute('data-island');
    if (!name) return;
    delete (container as any)[HYDRATION_STATE_KEY];
    await executeHydration(container, name);
}

export function initIslands(root: ParentNode = document): void {
    initDesignTokens();
    const islands = root.querySelectorAll<HTMLElement>('[data-island], island, [hydrate], [data-hydrate]');
    islands.forEach(hydrateIsland);
}
