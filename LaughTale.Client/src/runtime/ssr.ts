/**
 * LaughTale: Server-Rendered (SSR) Progressive Enhancement Engine
 * Detects server-rendered markup stamped with data-lt-ssr and enables non-destructive client adoption.
 */

export const SSR_ATTR = 'data-lt-ssr';
export const SSR_HYDRATED_ATTR = 'data-lt-ssr-hydrated';

/**
 * Checks if the island container holds pre-rendered server HTML or skeleton placeholders.
 */
export function hasSsrContent(container: HTMLElement): boolean {
    if (!container) return false;
    if (container.hasAttribute(SSR_ATTR)) return true;
    return container.querySelector(`[${SSR_ATTR}]`) !== null;
}

/**
 * Retrieves the root element containing the SSR markup.
 */
export function getSsrRoot(container: HTMLElement): HTMLElement | null {
    if (!container) return null;
    if (container.hasAttribute(SSR_ATTR)) return container;
    return container.querySelector(`[${SSR_ATTR}]`);
}

/**
 * Marks an SSR-rendered island container as progressively hydrated.
 */
export function markSsrHydrated(container: HTMLElement): void {
    if (!container) return;
    container.setAttribute(SSR_HYDRATED_ATTR, 'true');
    const root = getSsrRoot(container);
    if (root && root !== container) {
        root.setAttribute(SSR_HYDRATED_ATTR, 'true');
    }
}
