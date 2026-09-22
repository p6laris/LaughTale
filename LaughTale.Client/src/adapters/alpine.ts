/**
 * Alpine.js Adapter for LaughTale Islands (ROADMAP.v5.md Part D "New adapters").
 *
 * Alpine is architecturally different from React/Vue/Svelte/Preact/Solid: it never owns a vdom or
 * re-renders markup - it walks EXISTING DOM looking for `x-*` directives and binds a reactive data
 * object to them in place, closer to LaughTale's own `l-*` directive engine than to a
 * mount-a-component model. There is no "Component" class/function to instantiate the way there is
 * for the other adapters - the closest equivalent is an Alpine "data factory", the same shape you'd
 * pass to `Alpine.data(name, factory)` by hand, given this island's props once at mount time.
 *
 * This is also why slot/children forwarding (ROADMAP.v5.md Part D, "close adapter gaps" - needed by
 * every JS-rendering adapter above) does not apply here at all: Alpine never wipes the container's
 * existing markup in the first place, so whatever the server rendered inside `.island-slot` (or
 * anywhere else in the container) is simply still there, untouched, the moment `initTree` runs.
 */

import type { IslandContext } from '../runtime/registry';

export interface AlpineAdapterOptions {}

export type AlpineDataFactory<TProps = any> = (props: TProps) => Record<string, any>;

let mountCounter = 0;

/**
 * `Alpine.start()` scans the whole document and begins its global MutationObserver - calling it
 * more than once logs Alpine's own "can cause problems" warning (verified directly against the real
 * package). Guarded on `globalThis`, not a module-scope boolean, for the same reason every other
 * shared singleton in this codebase is (`runtime/registry.ts`'s island registry,
 * `adapters/registry.ts`'s adapter registry): a page can load more than one independently-built
 * bundle that each carry their own copy of this module, and only one of them should ever actually
 * call `start()`.
 */
const STARTED_KEY = '__laughtaleAlpineStarted__';

function ensureAlpineStarted(Alpine: any): void {
    const g = globalThis as typeof globalThis & { [STARTED_KEY]?: boolean };
    if (!g[STARTED_KEY]) {
        Alpine.start();
        g[STARTED_KEY] = true;
    }
}

/**
 * Creates an island mount function wrapping an Alpine data factory.
 * @param dataFactory Receives this island's props once at mount time, returns the plain object
 * Alpine will make reactive (state plus any methods `x-on:click="method()"` markup references).
 * @param options Adapter configuration options (currently none - kept for shape parity with every
 * other adapter's `(Component, options?)` signature, per `AdapterFactory` in adapters/registry.ts).
 */
export function createAlpineIsland<TProps = any>(
    dataFactory: AlpineDataFactory<TProps>,
    _options: AlpineAdapterOptions = {}
) {
    return async (container: HTMLElement, props: TProps, ctx?: IslandContext) => {
        try {
            // Dynamic import to maintain zero-dependency core. Literal specifier, not a variable -
            // see the identical note in adapters/react.ts for why the variable form is unresolvable
            // by any bundler and breaks in a real browser.
            const alpineMod: any = await import('alpinejs');
            const Alpine = alpineMod.Alpine || alpineMod.default;

            if (Alpine && typeof Alpine.data === 'function' && typeof Alpine.initTree === 'function') {
                const instanceName = `__lt_alpine_${++mountCounter}`;
                Alpine.data(instanceName, () => dataFactory(props));

                // Hydration: if the server already rendered `x-data` directly into this island's
                // markup (a Razor partial authoring real Alpine syntax by hand), don't stomp on it -
                // just bind the tree as-is. Otherwise (the common case: a fresh container whose only
                // job is to host this component), drive `x-data` from the factory ourselves.
                //
                // MUST happen before `ensureAlpineStarted` below, not after - `Alpine.start()` itself
                // performs a synchronous initial walk of the whole document the FIRST time it's
                // called, and this container is already live in the DOM with its `x-text`/`x-on`
                // markup by this point (the caller wrote it in before invoking this adapter). Setting
                // `x-data` after `start()` left a real window where that very first walk found
                // unscoped directives and threw "label is not defined" - confirmed against a live
                // Showcase page, not just reasoned about; verify any future reordering here the same
                // way, not by inspection alone.
                const hadXData = container.hasAttribute('x-data');
                if (!hadXData) {
                    container.setAttribute('x-data', `${instanceName}()`);
                }

                ensureAlpineStarted(Alpine);
                Alpine.initTree(container);

                const unmount = () => {
                    try {
                        Alpine.destroyTree(container);
                    } catch {
                        // ignore unmount errors on disposed DOM
                    }
                };

                // In-place update: Alpine.$data(container) is the SAME reactive object initTree
                // bound the directives to - Object.assign mutates it directly, so every x-text/
                // x-show/x-bind reading a changed key re-evaluates through Alpine's own reactivity
                // (backed by @vue/reactivity), no re-init or remount involved. Known, documented
                // trade-off: a key present in the OLD data but absent from `newProps` is not
                // removed (Object.assign only overwrites/adds keys it's given) - acceptable for the
                // same reason React/Vue/Preact's own "reassign the whole props object" update
                // functions don't attempt structural key removal either.
                const update = (newProps: any) => {
                    if (!hadXData) {
                        const data = Alpine.$data(container);
                        if (data) Object.assign(data, dataFactory(newProps));
                    }
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
            // No `Component(container, props, ctx)` fallback here unlike every other adapter's
            // catch branch: an Alpine data factory's real contract is `(props) => object` - calling
            // it with `(container, props, ctx)` the way react.ts/vue.ts/svelte.ts/preact.ts fall
            // back would silently misinterpret `container` as `props`, producing confusing broken
            // state rather than a reasonable degradation. Warn and mount nothing instead.
            console.warn('[LaughTale] Alpine package not found in client environment. This island will not hydrate.');
        }
    };
}

export const createAlpineAdapter = createAlpineIsland;
