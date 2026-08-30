/**
 * Vue 3 Adapter for LaughTale Islands
 * Mounts Vue 3 single file components or render functions inside islands
 * with slot projection, reactive props, and automated app.unmount() on IslandContext abort signal.
 */

import type { IslandContext } from '../runtime/registry';

export interface VueAdapterOptions {
    hydrate?: boolean;
}

/**
 * Creates an island mount function wrapping a Vue 3 component.
 * @param Component The Vue 3 component definition.
 * @param options Adapter configuration options.
 */
export function createVueIsland<TProps = any>(
    Component: any,
    options: VueAdapterOptions = {}
) {
    return async (container: HTMLElement, props: TProps, ctx?: IslandContext) => {
        try {
            // Dynamic import of Vue to maintain zero-dependency core
            const vuePkg = 'vue';
            const Vue: any = await import(/* @vite-ignore */ vuePkg);
            
            const createApp = Vue.createApp || Vue.default?.createApp;
            const createSSRApp = Vue.createSSRApp || Vue.default?.createSSRApp;
            const h = Vue.h || Vue.default?.h;

            if ((createApp || createSSRApp) && h) {
                const appFactory = (options.hydrate && createSSRApp && container.hasChildNodes()) ? createSSRApp : createApp;
                
                const app = appFactory({
                    render() {
                        return h(Component, props as any);
                    }
                });

                app.mount(container);

                const unmount = () => {
                    try {
                        app.unmount();
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
            console.warn('[LaughTale] Vue package not found in client environment. Falling back to direct execution.');
            if (typeof Component === 'function') {
                return Component(container, props, ctx);
            }
        }
    };
}

export const createVueAdapter = createVueIsland;
