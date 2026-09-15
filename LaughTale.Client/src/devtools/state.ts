/**
 * LaughTale DevTools: island tracking state (ROADMAP.v5.md DX — DevTools overlay).
 * Pure data/event logic, no DOM rendering - kept separate from overlay.ts so this half is fully
 * node:test-testable (happy-dom doesn't implement real layout, so anything layout-dependent lives in
 * overlay.ts instead and is verified live in a real browser).
 */

import type { HydrationState } from '../runtime/hydrator';
import { getIslandState } from '../runtime/hydrator';

const ISLAND_SELECTOR = '[data-island], island, [hydrate], [data-hydrate]';

export interface TrackedIslandWarnings {
    name?: string;
    media?: string;
    persist?: string;
}

export interface TrackedIsland {
    container: HTMLElement;
    name: string;
    strategy: string | null;
    framework?: string;
    state: HydrationState;
    durationMs?: number;
    propsSize?: number;
    error?: Error;
    warnings: TrackedIslandWarnings;
}

export interface DevToolsState {
    islands: Map<HTMLElement, TrackedIsland>;
    subscribe(listener: () => void): () => void;
    start(): () => void;
}

function islandNameOf(container: HTMLElement): string {
    return container.getAttribute('data-island') || container.getAttribute('name') || '(unnamed)';
}

function warningsOf(container: HTMLElement): TrackedIslandWarnings {
    const warnings: TrackedIslandWarnings = {};
    const name = container.getAttribute('data-laughtale-warning-name');
    const media = container.getAttribute('data-laughtale-warning-media');
    const persist = container.getAttribute('data-laughtale-warning-persist');
    if (name) warnings.name = name;
    if (media) warnings.media = media;
    if (persist) warnings.persist = persist;
    return warnings;
}

function toTrackedIsland(container: HTMLElement): TrackedIsland {
    return {
        container,
        name: islandNameOf(container),
        strategy: container.getAttribute('data-hydrate') || container.getAttribute('hydrate'),
        framework: container.getAttribute('data-framework') ?? undefined,
        state: getIslandState(container),
        warnings: warningsOf(container)
    };
}

/**
 * Creates a fresh, independent devtools state tracker. Not globalThis-anchored, unlike
 * registry.ts's shared maps - this is the devtools overlay's own private state, created once by
 * initDevTools() in whichever bundle chunk it ends up in, not something other bundle copies need to
 * see.
 */
export function createDevToolsState(): DevToolsState {
    const islands = new Map<HTMLElement, TrackedIsland>();
    const listeners = new Set<() => void>();

    function notify(): void {
        listeners.forEach((fn) => fn());
    }

    function ensureTracked(container: HTMLElement): TrackedIsland {
        let tracked = islands.get(container);
        if (!tracked) {
            tracked = toTrackedIsland(container);
            islands.set(container, tracked);
        }
        return tracked;
    }

    function seed(root: ParentNode): void {
        root.querySelectorAll<HTMLElement>(ISLAND_SELECTOR).forEach((container) => {
            ensureTracked(container);
        });
    }

    function onDiagnostic(event: Event): void {
        const container = event.target as HTMLElement | null;
        if (!container) return;
        const detail = (event as CustomEvent).detail || {};
        const tracked = ensureTracked(container);
        tracked.name = detail.name ?? tracked.name;
        tracked.strategy = detail.strategy ?? tracked.strategy;
        tracked.framework = detail.framework;
        tracked.propsSize = detail.propsSize;
        tracked.durationMs = detail.durationMs;
        tracked.state = getIslandState(container);
        tracked.error = undefined;
        notify();
    }

    function onHydrationError(event: Event): void {
        // laughtale:hydration-error's detail is { name, error } - it carries no container reference,
        // so the container must be resolved from the event's dispatch target instead (safe here since
        // the event bubbles with composed:true and is always dispatched ON the container itself).
        const container = event.target as HTMLElement | null;
        if (!container) return;
        const detail = (event as CustomEvent).detail || {};
        const tracked = ensureTracked(container);
        tracked.name = detail.name ?? tracked.name;
        tracked.state = getIslandState(container);
        tracked.error = detail.error;
        notify();
    }

    function onMutations(mutations: MutationRecord[]): void {
        let sawNewIsland = false;
        for (const mutation of mutations) {
            mutation.addedNodes.forEach((node) => {
                if (!(node instanceof HTMLElement)) return;
                if (node.matches(ISLAND_SELECTOR)) {
                    ensureTracked(node);
                    sawNewIsland = true;
                }
                node.querySelectorAll?.<HTMLElement>(ISLAND_SELECTOR).forEach((el) => {
                    ensureTracked(el);
                    sawNewIsland = true;
                });
            });
        }
        if (sawNewIsland) notify();
    }

    function start(): () => void {
        seed(document);

        document.addEventListener('laughtale:diagnostic', onDiagnostic);
        document.addEventListener('laughtale:hydration-error', onHydrationError);

        let observer: MutationObserver | null = null;
        if (typeof MutationObserver !== 'undefined') {
            observer = new MutationObserver(onMutations);
            observer.observe(document.body, { childList: true, subtree: true });
        }

        notify();

        return () => {
            document.removeEventListener('laughtale:diagnostic', onDiagnostic);
            document.removeEventListener('laughtale:hydration-error', onHydrationError);
            observer?.disconnect();
        };
    }

    function subscribe(listener: () => void): () => void {
        listeners.add(listener);
        return () => listeners.delete(listener);
    }

    return { islands, subscribe, start };
}
