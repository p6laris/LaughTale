/**
 * React 18/19 Adapter for LaughTale Islands
 * Mounts React components inside islands with slot projection, props revival,
 * and automated root unmount on IslandContext abort signal.
 */

import type { IslandContext } from '../runtime/registry';

export interface ReactAdapterOptions {
    hydrate?: boolean;
}

/**
 * Creates an island mount function wrapping a React component.
 * @param Component The React functional or class component.
 * @param options Adapter configuration options.
 */
export function createReactIsland<TProps = any>(
    Component: any,
    options: ReactAdapterOptions = {}
) {
    return async (container: HTMLElement, props: TProps, ctx?: IslandContext) => {
        try {
            // Dynamic import of React & ReactDOM to maintain zero-dependency core
            const reactPkg = 'react';
            const reactDomClientPkg = 'react-dom/client';
            
            const React: any = await import(/* @vite-ignore */ reactPkg);
            const ReactDOMClient: any = await import(/* @vite-ignore */ reactDomClientPkg);
            
            const createElement = React.createElement || React.default?.createElement;
            const createRoot = ReactDOMClient.createRoot || ReactDOMClient.default?.createRoot;
            const hydrateRoot = ReactDOMClient.hydrateRoot || ReactDOMClient.default?.hydrateRoot;

            if (createRoot && createElement) {
                let root: any;
                
                if (options.hydrate && hydrateRoot && container.hasChildNodes()) {
                    root = hydrateRoot(container, createElement(Component, props as any));
                } else {
                    root = createRoot(container);
                    root.render(createElement(Component, props as any));
                }

                const unmount = () => {
                    try {
                        root?.unmount();
                    } catch {
                        // ignore unmount errors on disposed DOM
                    }
                };

                // In-place update: re-render the same root instead of unmount+remount on
                // server-driven refresh. This is React's own designed re-render path, so its
                // reconciler diffs against the DOM it actually owns (see refresh.ts).
                const update = (newProps: any) => {
                    root.render(createElement(Component, newProps));
                };

                if (ctx?.signal) {
                    ctx.signal.addEventListener('abort', unmount, { once: true });
                }
                if (ctx?.onCleanup) {
                    ctx.onCleanup(unmount);
                }

                return { unmount, update };
            }
        } catch {
            console.warn('[LaughTale] React / ReactDOM package not found in client environment. Falling back to direct execution.');
            if (typeof Component === 'function') {
                return Component(container, props, ctx);
            }
        }
    };
}

export const createReactAdapter = createReactIsland;
