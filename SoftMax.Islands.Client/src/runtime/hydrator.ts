/**
 * SoftMax.Islands: Core Multi-Strategy Hydration Engine
 * 
 * Supports 6 hydration modes:
 * - load: Hydrates immediately on page load
 * - idle: Hydrates when browser is idle (requestIdleCallback)
 * - visible: Hydrates when scrolled into viewport (IntersectionObserver)
 * - media: Hydrates when media query matches (e.g. mobile)
 * - interaction: Hydrates on first hover/focus/click
 * - never: Pure SSR, no client JS executed
 */

import { getIslandLoader, IslandFactory } from './registry';

const activeCleanups = new WeakMap<HTMLElement, () => void>();

/**
 * Hydrates a single island DOM element.
 */
export async function hydrateIsland(container: HTMLElement): Promise<void> {
    if (container.dataset.hydrated === 'true') {
        return;
    }

    const islandName = container.dataset.island;
    if (!islandName) {
        return;
    }

    const loader = getIslandLoader(islandName);
    if (!loader) {
        console.warn(`[SoftMax.Islands] No factory registered for island: "${islandName}"`);
        return;
    }

    container.dataset.hydrated = 'true';
    container.classList.add('island-hydrating');

    try {
        const rawProps = container.dataset.props;
        const props = rawProps ? JSON.parse(rawProps) : {};

        const moduleResult = await loader();
        const factory: IslandFactory = typeof moduleResult === 'function'
            ? moduleResult
            : moduleResult.default;

        if (typeof factory === 'function') {
            const cleanup = await factory(container, props);
            if (typeof cleanup === 'function') {
                activeCleanups.set(container, cleanup);
            }
        }

        container.classList.remove('island-hydrating');
        container.classList.add('island-hydrated');
        container.dispatchEvent(new CustomEvent('island:hydrated', { detail: { name: islandName, props }, bubbles: true }));
    } catch (error) {
        container.classList.remove('island-hydrating');
        container.classList.add('island-error');
        console.error(`[SoftMax.Islands] Failed to hydrate island "${islandName}":`, error);
    }
}

/**
 * Destroys and cleans up an active island element.
 */
export function destroyIsland(container: HTMLElement): void {
    const cleanup = activeCleanups.get(container);
    if (cleanup) {
        try {
            cleanup();
        } catch (e) {
            console.error('[SoftMax.Islands] Error during island cleanup:', e);
        }
        activeCleanups.delete(container);
    }
    container.dataset.hydrated = 'false';
    container.classList.remove('island-hydrated');
}

/**
 * Scans the DOM and attaches the appropriate hydration strategy to each island.
 */
export function initIslands(root: ParentNode = document): void {
    const containers = root.querySelectorAll<HTMLElement>('[data-island]');

    containers.forEach(container => {
        if (container.dataset.hydrated === 'true') return;

        const strategy = container.dataset.hydrate?.toLowerCase() || 'load';

        switch (strategy) {
            case 'load':
                hydrateIsland(container);
                break;

            case 'idle':
                if ('requestIdleCallback' in window) {
                    (window as any).requestIdleCallback(() => hydrateIsland(container), { timeout: 2000 });
                } else {
                    setTimeout(() => hydrateIsland(container), 150);
                }
                break;

            case 'visible': {
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            observer.disconnect();
                            hydrateIsland(container);
                        }
                    });
                }, { rootMargin: '120px 0px' });

                observer.observe(container);
                break;
            }

            case 'media': {
                const mediaQuery = container.dataset.media;
                if (mediaQuery) {
                    const mql = window.matchMedia(mediaQuery);
                    if (mql.matches) {
                        hydrateIsland(container);
                    } else {
                        const handler = (e: MediaQueryListEvent) => {
                            if (e.matches) {
                                mql.removeEventListener('change', handler);
                                hydrateIsland(container);
                            }
                        };
                        mql.addEventListener('change', handler);
                    }
                }
                break;
            }

            case 'interaction': {
                const triggerEvents = ['mouseenter', 'focusin', 'touchstart', 'click'];
                const onInteract = () => {
                    triggerEvents.forEach(evt => container.removeEventListener(evt, onInteract));
                    hydrateIsland(container);
                };
                triggerEvents.forEach(evt => container.addEventListener(evt, onInteract, { once: true, passive: true }));
                break;
            }

            case 'never':
                // Pure SSR - do nothing
                break;

            default:
                hydrateIsland(container);
                break;
        }
    });
}
