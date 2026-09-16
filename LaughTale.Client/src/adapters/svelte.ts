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
 * children or Vue's slot-functions-returning-vnodes), and this repo has no Svelte compiler
 * toolchain to verify a real fix against - the same reason this adapter's test coverage already
 * only exercises the fallback path (no `svelte` devDependency), and the same reason `update()` was
 * deliberately excluded here in the prior pass.
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
                // Svelte 5 API
                const mount = (options.hydrate && typeof svelte.hydrate === 'function' && (ctx?.hydrate ?? container.hasChildNodes()))
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
