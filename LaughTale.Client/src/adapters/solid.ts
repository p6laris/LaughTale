/**
 * SolidJS Adapter for LaughTale Islands (ROADMAP.v5.md Part D "New adapters").
 * Mounts Solid components with real fine-grained-reactive props (not a vdom re-render), slot
 * projection, and automated `dispose()` on IslandContext abort signal.
 */

import type { IslandContext } from '../runtime/registry';
import { extractIslandSlot, warnIfSlotUnused } from './slot';

export interface SolidAdapterOptions {
    hydrate?: boolean;
}

/**
 * Wraps a plain props object in a `createSignal`-backed Proxy so a Solid component that reads
 * `props.foo` inside a tracked scope (an `effect`, `createMemo`, or anything Solid's own JSX
 * compiler generates) re-runs when `update()` replaces the whole props object - without ever
 * creating a new component instance. This is not a workaround: it's the same "props are getters
 * over a reactive source" shape Solid's own compiler generates for `<Widget {...props} />`, just
 * written by hand since this adapter has no JSX compiler in its build. A vdom-diff style
 * "call render() again" (React/Preact/Vue's approach) does not apply to Solid - Solid has no vdom
 * to diff, so the only correct way to make an existing mounted instance see new props is for its
 * OWN reads of those props to be reactive in the first place.
 */
function createReactiveProps<TProps extends object>(
    initial: TProps,
    createSignal: any
): { props: TProps; setProps: (next: TProps) => void } {
    const [get, set] = createSignal(initial, { equals: false });
    const proxy = new Proxy({} as TProps, {
        get(_target, key) {
            return (get() as any)[key];
        },
        has(_target, key) {
            return key in (get() as any);
        },
        ownKeys() {
            return Reflect.ownKeys(get() as any);
        },
        getOwnPropertyDescriptor(_target, key) {
            const source = get() as any;
            if (!(key in source)) return undefined;
            return { enumerable: true, configurable: true, value: source[key] };
        }
    });
    return { props: proxy, setProps: (next: TProps) => set(next) };
}

/**
 * Creates an island mount function wrapping a Solid component.
 * @param Component The Solid component function.
 * @param options Adapter configuration options.
 */
export function createSolidIsland<TProps = any>(
    Component: any,
    options: SolidAdapterOptions = {}
) {
    return async (container: HTMLElement, props: TProps, ctx?: IslandContext) => {
        try {
            // Dynamic import to maintain zero-dependency core. Literal specifier, not a variable -
            // see the identical note in adapters/react.ts for why the variable form is unresolvable
            // by any bundler and breaks in a real browser.
            const solidWeb: any = await import('solid-js/web');
            const solidCore: any = await import('solid-js');

            const render = solidWeb.render;
            const hydrate = solidWeb.hydrate;
            const createComponent = solidWeb.createComponent || solidCore.createComponent;
            const insert = solidWeb.insert;
            const createSignal = solidCore.createSignal;

            if (render && createComponent && createSignal) {
                const hydrateMode = options.hydrate && typeof hydrate === 'function' && (ctx?.hydrate || container.hasChildNodes());

                // Extract `.island-slot` (ROADMAP.v5.md Part D, close adapter gaps) BEFORE the
                // destructive render below wipes it out - identical rationale to react.ts/vue.ts.
                const extractedSlot = hydrateMode ? null : extractIslandSlot(container);

                const { props: reactiveProps, setProps } = createReactiveProps(props as any, createSignal);

                const componentFactory = () => {
                    const rendered = createComponent(Component, reactiveProps);
                    if (extractedSlot && insert) {
                        const slotHost = document.createElement('div');
                        slotHost.setAttribute('data-lt-slot-host', '');
                        extractedSlot.attach(slotHost);
                        // `insert` reactively appends a raw DOM node value into `rendered`'s parent
                        // once `rendered` itself is inserted - here we simply append the slot host
                        // as a sibling within the same mount pass so it survives Solid's own
                        // fine-grained updates untouched (Solid never re-creates DOM it didn't
                        // itself produce).
                        return [rendered, slotHost];
                    }
                    return rendered;
                };

                const mountFn = hydrateMode ? hydrate : render;
                const dispose: () => void = mountFn(componentFactory, container);

                if (extractedSlot) {
                    warnIfSlotUnused(extractedSlot, container);
                }

                const unmount = () => {
                    try {
                        dispose();
                    } catch {
                        // ignore unmount errors on disposed DOM
                    }
                };

                // In-place update: reassigns the reactive signal backing `reactiveProps` - any
                // tracked read inside Component (an `effect`/`createMemo`/Solid-compiled JSX
                // expression) re-runs and patches only the DOM it touches. No new component
                // instance, no remount - see createReactiveProps's own doc comment for why this is
                // the Solid-correct equivalent of React/Vue/Preact's "render again in place".
                const update = (newProps: any) => {
                    setProps(newProps);
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
            console.warn('[LaughTale] Solid package not found in client environment. Falling back to direct execution.');
            if (typeof Component === 'function') {
                return Component(container, props, ctx);
            }
        }
    };
}

export const createSolidAdapter = createSolidIsland;
