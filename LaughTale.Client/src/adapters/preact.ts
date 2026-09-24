/**
 * Preact Adapter for LaughTale Islands
 * Enables lightweight JSX components with hooks inside a ~3 KB footprint,
 * wiring automatic render teardown to IslandContext abort signal.
 */

import type { IslandContext } from '../runtime/registry';
import { extractIslandSlot, warnIfSlotUnused } from './slot';

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
            // Dynamic import of preact if available. Literal specifier, not a variable - see the
            // identical note in adapters/react.ts for why the variable form is unresolvable by any
            // bundler and breaks in a real browser.
            const preact: any = await import('preact');
            const h = preact.h || preact.default?.h;
            const render = preact.render || preact.default?.render;
            const hydrate = preact.hydrate || preact.default?.hydrate;

            if (render && h) {
                const hydrateMode = options.hydrate && hydrate && (ctx?.hydrate || container.hasChildNodes());

                // Extract `.island-slot` (ROADMAP.v5.md Part D, close adapter gaps) BEFORE the
                // destructive render below wipes it out - see the identical rationale in
                // adapters/react.ts. Rebuilt on every render (initial AND `update` below), not
                // created once: Preact keeps the same underlying DOM node across re-renders for a
                // same-type element at the same position, so the already-appended live content
                // (invisible to Preact's own vdom, since `attach` inserted it imperatively) survives
                // - omitting this on `update()` would make Component's next render produce nothing in
                // this position and Preact would remove it on the very first server-driven refresh.
                const extractedSlot = hydrateMode ? null : extractIslandSlot(container);
                const makeSlotHost = () => extractedSlot
                    ? h('div', { 'data-lt-slot-host': true, ref: (el: HTMLElement | null) => extractedSlot.attach(el) })
                    : undefined;

                if (hydrateMode) {
                    hydrate(h(Component, props as any), container);
                } else {
                    render(h(Component, props as any, makeSlotHost()), container);
                    warnIfSlotUnused(extractedSlot, container);
                }

                const unmount = () => {
                    try {
                        render(null, container);
                    } catch {
                        // ignore unmount errors on disposed DOM
                    }
                };

                // In-place update: rendering again into the same container lets Preact diff
                // against the vnode tree it already associates with that DOM node.
                const update = (newProps: any) => {
                    render(h(Component, newProps, makeSlotHost()), container);
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
            console.warn('[LaughTale] Preact package not found in client environment. Falling back to direct execution.');
            if (typeof Component === 'function') {
                return Component(container, props, ctx);
            }
        }
    };
}

export const createPreactAdapter = createPreactIsland;
