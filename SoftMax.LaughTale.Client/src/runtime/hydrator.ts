/**
 * SoftMax.LaughTale: Multi-Strategy Client Hydration Engine
 * Supercharged with Astro-grade prop revival, query retry, child viewport observation & streaming SSR.
 */

import { getIslandDefinition } from './registry';
import { parseAndReviveProps } from './reviver';
import { importWithRetry } from './retry';
import { awaitStreamingReady } from './streaming';

export type HydrateStrategy = 'load' | 'idle' | 'visible' | 'media' | 'interaction' | 'never';

const HYDRATED_FLAG = '__laughtale_hydrated';

export function hydrateIsland(container: HTMLElement): void {
    if ((container as any)[HYDRATED_FLAG]) return;

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

async function executeHydration(container: HTMLElement, name: string): Promise<void> {
    if ((container as any)[HYDRATED_FLAG]) return;
    (container as any)[HYDRATED_FLAG] = true;

    const definition = getIslandDefinition(name);
    if (!definition) {
        console.warn(`[SoftMax.LaughTale] Island '${name}' is not registered in the client registry.`);
        return;
    }

    try {
        // 1. Await streaming SSR completion if applicable
        await awaitStreamingReady(container);

        // 2. Parse & revive props (Date, Uint8Array, Map, Set, BigInt, URL)
        const rawProps = container.getAttribute('data-props') || container.getAttribute('props-json') || container.getAttribute('props');
        const props = parseAndReviveProps(rawProps);

        // 3. Load component module with retry resilience
        const module = await importWithRetry(definition.loader);
        const mount = module.default || module;

        if (typeof mount !== 'function') {
            console.error(`[SoftMax.LaughTale] Island '${name}' module does not export a mount function.`);
            return;
        }

        // 4. Mount island and register unmount hook
        const unmount = mount(container, props);
        if (typeof unmount === 'function') {
            container.addEventListener('laughtale:unmount', unmount, { once: true });
        }

        // 5. Dispatch success lifecycle event
        container.dispatchEvent(new CustomEvent('laughtale:hydrated', {
            bubbles: true,
            composed: true,
            detail: { name, strategy: container.getAttribute('data-hydrate') }
        }));
    } catch (error) {
        (container as any)[HYDRATED_FLAG] = false;
        console.error(`[SoftMax.LaughTale] Error hydrating island '${name}':`, error);
        container.dispatchEvent(new CustomEvent('laughtale:hydration-error', {
            bubbles: true,
            composed: true,
            detail: { name, error }
        }));
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
 * Child-Targeted Viewport Observer
 * Observes container and all its child nodes so `display: contents` layouts never miss scroll events.
 */
function hydrateVisible(container: HTMLElement, name: string): void {
    const observer = new IntersectionObserver((entries) => {
        for (const entry of entries) {
            if (entry.isIntersecting) {
                observer.disconnect();
                executeHydration(container, name);
                break;
            }
        }
    }, { rootMargin: '120px' });

    observer.observe(container);

    // Also observe children to support `display: contents` styling
    for (let i = 0; i < container.children.length; i++) {
        observer.observe(container.children[i]);
    }
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

export function initIslands(root: ParentNode = document): void {
    const islands = root.querySelectorAll<HTMLElement>('[data-island], island, [hydrate], [data-hydrate]');
    islands.forEach(hydrateIsland);
}
