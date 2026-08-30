/**
 * Preact Adapter for LaughTale Islands
 * Enables lightweight JSX components with hooks inside a ~3 KB footprint,
 * wiring automatic render teardown to IslandContext abort signal.
 */

import type { IslandContext } from '../runtime/registry';

export interface PreactAdapterOptions {
    hydrate?: boolean;
}

/**
 * Creates an island mount function wrapping a Preact component.
 * @param Component The Preact functional component.
 * @param options Adapter configuration options.
 */
export function createPreactIsland<TProps = any>(
    Component: any,
    options: PreactAdapterOptions = {}
) {
    return async (container: HTMLElement, props: TProps, ctx?: IslandContext) => {
        try {
            // Dynamic import of preact if available
            const preactPkg = 'preact';
            const preact: any = await import(/* @vite-ignore */ preactPkg);
            const h = preact.h || preact.default?.h;
            const render = preact.render || preact.default?.render;
            const hydrate = preact.hydrate || preact.default?.hydrate;

            if (render && h) {
                if (options.hydrate && hydrate && container.hasChildNodes()) {
                    hydrate(h(Component, props as any), container);
                } else {
                    render(h(Component, props as any), container);
                }

                const unmount = () => {
                    try {
                        render(null, container);
                    } catch {
                        // ignore unmount errors on disposed DOM
                    }
                };

                if (ctx?.signal) {
                    ctx.signal.addEventListener('abort', unmount, { once: true });
                }
                if (ctx?.onCleanup) {
                    ctx.onCleanup(unmount);
                }

                return unmount;
            }
        } catch {
            console.warn('[LaughTale] Preact package not found in client environment. Falling back to direct execution.');
            if (typeof Component === 'function') {
                return Component(container, props, ctx);
            }
        }
    };
}
