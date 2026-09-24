/**
 * Svelte 4/5 Adapter for LaughTale Islands
 * Mounts Svelte components inside islands with slot projection,
 * props passing, and automated component destruction on IslandContext abort signal.
 */

import type { IslandContext } from '../runtime/registry';

export interface SvelteAdapterOptions {
    hydrate?: boolean;
}

/**
 * Slot/children forwarding (ROADMAP.v5.md Part D, close adapter gaps) is deliberately NOT
 * implemented here, unlike react.ts/vue.ts/preact.ts. Svelte 5's children are snippets (a function
 * prop rendered via `{@render children()}`, not a raw-DOM-node consumption model like React/Preact
 * children or Vue's slot-functions-returning-vnodes), so forwarding server-rendered slot DOM into
 * one needs its own design. `update()` is likewise still not implemented. Mount, hydrate and
 * unmount are tested against real compiled Svelte 5 components (tests/helpers/svelte.ts).
 */

/**
 * Creates an island mount function wrapping a Svelte component.
 * Supports both Svelte 5 (`mount` / `hydrate`) and Svelte 4 (`new Component({ target })`).
 * @param Component The Svelte component class or function.
 * @param options Adapter configuration options.
 */
export function createSvelteIsland<TProps = any>(
    Component: any,
    options: SvelteAdapterOptions = {}
) {
    return async (container: HTMLElement, props: TProps, ctx?: IslandContext) => {
        try {
            // Check for Svelte 5 runtime first. Literal specifier, not a variable - see the
            // identical note in adapters/react.ts for why the variable form is unresolvable by any
            // bundler and breaks in a real browser.
            const svelte: any = await import('svelte').catch(() => null);

            let unmountFn: (() => void) | null = null;

            if (svelte && typeof svelte.mount === 'function') {
                // Svelte 5 API. Same rule as the React adapter: hydrate markup the server stamped
                // (ctx.hydrate, set from data-lt-ssr by the hydrator) with no opt-in needed; an
                // explicit {hydrate:true} keeps its old meaning; {hydrate:false} always opts out.
                const hydrateMode = typeof svelte.hydrate === 'function' && options.hydrate !== false
                    && (ctx?.hydrate === true || (options.hydrate === true && container.hasChildNodes()));
                const mount = hydrateMode ? svelte.hydrate : svelte.mount;

                // Unlike React/Vue/Preact, Svelte's mount() appends to the target instead of
                // replacing its content, so any server fallback markup would stay next to the live
                // component. Clear it first so a plain mount behaves like the other adapters.
                if (!hydrateMode) {
                    container.replaceChildren();
                }

                const instance = mount(Component, {
                    target: container,
                    props: props as any
                });

                unmountFn = () => {
                    try {
                        if (typeof svelte.unmount === 'function') {
                            svelte.unmount(instance);
                        }
                    } catch {
                        // ignore errors on unmount
                    }
                };
            } else if (typeof Component === 'function') {
                // Svelte 4 / constructor API or function
                try {
                    const instance = new Component({
                        target: container,
                        props: props as any,
                        hydrate: options.hydrate
                    });

                    unmountFn = () => {
                        try {
                            instance.$destroy?.();
                        } catch {
                            // ignore errors on destroy
                        }
                    };
                } catch {
                    // Fallback if Component is a plain mount function
                    const result = Component(container, props, ctx);
                    if (typeof result === 'function') {
                        unmountFn = result;
                    }
                }
            }

            if (unmountFn) {
                if (ctx?.signal) {
                    ctx.signal.addEventListener('abort', unmountFn, { once: true });
                }
                if (ctx?.onCleanup) {
                    ctx.onCleanup(unmountFn);
                }
                return unmountFn;
            }
        } catch {
            console.warn('[LaughTale] Svelte package not found in client environment. Falling back to direct execution.');
            if (typeof Component === 'function') {
                return Component(container, props, ctx);
            }
        }
    };
}

export const createSvelteAdapter = createSvelteIsland;
