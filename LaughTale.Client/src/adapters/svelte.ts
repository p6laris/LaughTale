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
                // Svelte 5 API
                const mount = (options.hydrate && typeof svelte.hydrate === 'function' && container.hasChildNodes())
                    ? svelte.hydrate
                    : svelte.mount;

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
