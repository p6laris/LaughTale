/**
 * Vue 3 Adapter for LaughTale Islands
 * Mounts Vue 3 single file components or render functions inside islands
 * with slot projection, reactive props, and automated app.unmount() on IslandContext abort signal.
 */

import type { IslandContext } from '../runtime/registry';
import { extractIslandSlot, warnIfSlotUnused } from './slot';

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
            // Dynamic import of Vue to maintain zero-dependency core. Literal specifier, not a
            // variable - see the identical note in adapters/react.ts for why the variable form is
            // unresolvable by any bundler and breaks in a real browser.
            const Vue: any = await import('vue');
            
            const createApp = Vue.createApp || Vue.default?.createApp;
            const createSSRApp = Vue.createSSRApp || Vue.default?.createSSRApp;
            const h = Vue.h || Vue.default?.h;
            const shallowRef = Vue.shallowRef || Vue.default?.shallowRef;

            if ((createApp || createSSRApp) && h && shallowRef) {
                // Props live in a shallowRef read inside render() so a later full reassignment
                // (see `update` below) re-triggers this same app instance's render - no new
                // app/root is created, and Vue's own patch algorithm updates the mounted
                // component in place.
                const propsRef = shallowRef(props);
                const hydrateMode = options.hydrate && createSSRApp && (ctx?.hydrate || container.hasChildNodes());
                const appFactory = hydrateMode ? createSSRApp : createApp;

                // Extract `.island-slot` (ROADMAP.v5.md Part D, close adapter gaps) BEFORE the
                // destructive app.mount() below wipes it out - true hydration mode leaves it
                // untouched, same rationale as react.ts's identical branch. Forwarded via Vue's
                // render-function slots object (a function returning vnodes, not a raw children
                // array, since Component is mounted as a plain function/render-function component
                // here) - a fresh vnode each render() call is fine, since Vue diffs by type/key, not
                // object identity, and `attach()` is idempotent once the fragment is consumed.
                const extractedSlot = hydrateMode ? null : extractIslandSlot(container);

                const app = appFactory({
                    render() {
                        if (extractedSlot) {
                            const slotHost = h('div', {
                                'data-lt-slot-host': true,
                                ref: (el: HTMLElement | null) => extractedSlot.attach(el)
                            });
                            return h(Component, propsRef.value as any, { default: () => [slotHost] });
                        }
                        return h(Component, propsRef.value as any);
                    }
                });

                app.mount(container);

                if (extractedSlot) {
                    warnIfSlotUnused(extractedSlot, container);
                }

                const unmount = () => {
                    try {
                        app.unmount();
                    } catch {
                        // ignore unmount errors on disposed DOM
                    }
                };

                // In-place update: reassign the whole props object (not a per-field mutation)
                // so removed/added keys are handled correctly, not just changed ones.
                const update = (newProps: any) => {
                    propsRef.value = newProps;
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
            console.warn('[LaughTale] Vue package not found in client environment. Falling back to direct execution.');
            if (typeof Component === 'function') {
                return Component(container, props, ctx);
            }
        }
    };
}

export const createVueAdapter = createVueIsland;
