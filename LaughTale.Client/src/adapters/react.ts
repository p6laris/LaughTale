/**
 * React 18/19 Adapter for LaughTale Islands
 * Mounts React components inside islands with slot projection, props revival,
 * and automated root unmount on IslandContext abort signal.
 */

import type { IslandContext } from '../runtime/registry';
import { extractIslandSlot, warnIfSlotUnused } from './slot';

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
            // Dynamic import of React & ReactDOM to maintain zero-dependency core. The specifier
            // MUST be a literal string directly in the import() call, not a variable holding one -
            // every bundler (esbuild, Vite, Rollup, webpack) can only statically analyze/resolve a
            // literal-specifier dynamic import. A variable-indirected one is invisible to static
            // analysis in all of them and becomes an unresolvable bare specifier at runtime in a
            // browser with no import map - confirmed the hard way: this was silently broken for
            // every real consumer of this adapter until ROADMAP.v5.md Part B's end-to-end example
            // was the first thing in this repo's history to actually load it in a live browser.
            const React: any = await import('react');
            const ReactDOMClient: any = await import('react-dom/client');
            // flushSync is exported from 'react-dom' proper, not 'react-dom/client' (confirmed
            // directly against the installed package - react-dom-client.development.js does not
            // export it, react-dom.development.js does).
            const ReactDOM: any = await import('react-dom');

            const createElement = React.createElement || React.default?.createElement;
            const createRoot = ReactDOMClient.createRoot || ReactDOMClient.default?.createRoot;
            const hydrateRoot = ReactDOMClient.hydrateRoot || ReactDOMClient.default?.hydrateRoot;
            const flushSync = ReactDOM.flushSync || ReactDOM.default?.flushSync;

            if (createRoot && createElement) {
                let root: any;
                // ctx.hydrate is true only for a `data-lt-ssr`-stamped container (see hydrator.ts), so
                // server-rendered markup hydrates by default; `{ hydrate: false }` opts out, and an
                // explicit `{ hydrate: true }` keeps its pre-SSR meaning of "adopt any existing DOM".
                const hydrateMode = !!hydrateRoot && options.hydrate !== false
                    && (ctx?.hydrate === true || (options.hydrate === true && container.hasChildNodes()));

                // Extract `.island-slot` (ROADMAP.v5.md Part D, close adapter gaps) BEFORE the
                // destructive render below wipes it out - forwarded to the component as
                // `props.children` via a plain host element whose ref callback re-inserts the
                // real, already-live nodes (not a re-serialized copy, so a nested island inside
                // survives intact) once React commits it. Skipped entirely in true hydration mode:
                // the container's existing DOM must exactly match what React renders there, so
                // there's no destructive mount for slot content to need rescuing from.
                const extractedSlot = hydrateMode ? null : extractIslandSlot(container);
                // Rebuilt on every render (initial AND update, see `update` below) rather than
                // created once - React keeps the underlying DOM node stable across re-renders for a
                // same-type element at the same position regardless of the ref callback's own
                // identity changing, so the already-appended live content (which React's own vdom
                // has no knowledge of - it was inserted imperatively by `attach`) survives. Omitting
                // this on `update()` would make Component's next render produce no vnode at all in
                // this position, and React would unmount - and destroy - the slotted content on the
                // very first server-driven refresh.
                const makeSlotHost = () => extractedSlot
                    ? createElement('div', { 'data-lt-slot-host': true, ref: (el: HTMLElement | null) => extractedSlot.attach(el) })
                    : undefined;

                if (hydrateMode) {
                    root = hydrateRoot(container, createElement(Component, props as any));
                } else {
                    root = createRoot(container);
                    // Wrapped in flushSync (ROADMAP.v5.md Part D, nested islands): outside a native
                    // browser event, an initial createRoot().render() schedules its commit at
                    // DefaultLane priority via a MessageChannel macrotask rather than committing
                    // inline - hydrator.ts's executeHydration relies on this container's DOM mutation
                    // being observably complete once mount() resolves (so it can tell whether any
                    // nested island survived), which a deferred commit would silently defeat. Only the
                    // initial render needs this - the update() re-render below is used by refresh.ts,
                    // which has no such synchronous-commit requirement. The same synchronous commit
                    // also guarantees the slot host's ref callback (which fires during commit) has
                    // already run by the time warnIfSlotUnused checks it below.
                    const doRender = () => root.render(createElement(Component, props as any, makeSlotHost()));
                    if (typeof flushSync === 'function') {
                        flushSync(doRender);
                    } else {
                        doRender();
                    }

                    warnIfSlotUnused(extractedSlot, container);
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
                    root.render(createElement(Component, newProps, makeSlotHost()));
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
