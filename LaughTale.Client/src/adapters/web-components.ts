/**
 * Web Components Adapter for LaughTale Islands (ROADMAP.v5.md Part D "New adapters" - listed first:
 * "framework-agnostic, no runtime download"). Mounts a native Custom Element inside an island
 * container - `customElements`/`HTMLElement` are browser platform APIs, so unlike the React/Vue/
 * Preact/Svelte adapters, this one has NOTHING to dynamically `import()`. A component authored with
 * Lit (or any other web-components helper library) is consumed identically to a hand-written custom
 * element once registered - Lit components ARE custom elements, just authored with a base class that
 * happens to also live behind a dynamic `import()` inside the component's OWN module, which this
 * adapter never needs to know about.
 *
 * Slotting reuses the exact same `:scope > .island-slot` extraction convention the React/Vue/Preact
 * adapters use - but unlike those, this adapter doesn't need a synthetic slot-host element: a real
 * custom element's own Shadow DOM `<slot>` projects light-DOM children automatically, so the
 * extracted fragment is appended directly as the element's own light-DOM children.
 */
import type { IslandContext } from '../runtime/registry';
import { extractIslandSlot, warnIfSlotUnused } from './slot';

export interface WebComponentAdapterOptions {
    /** The registered custom element tag name, e.g. "my-widget". */
    tagName: string;
    /**
     * Prop keys to set as string ATTRIBUTES instead of object PROPERTIES. Most modern web components
     * (including Lit's own `@property()` decorator) accept plain property assignment for any prop
     * shape (primitives, objects, arrays) and reflect simple ones to attributes themselves - this is
     * an escape hatch for a component that only reads its config from `attributeChangedCallback`,
     * not the default path.
     */
    attributeProps?: string[];
}

function applyProps(el: HTMLElement, props: Record<string, any> | undefined, options: WebComponentAdapterOptions): void {
    if (!props) return;

    for (const [key, value] of Object.entries(props)) {
        if (options.attributeProps?.includes(key)) {
            if (value === null || value === undefined || value === false) {
                el.removeAttribute(key);
            } else {
                el.setAttribute(key, value === true ? '' : String(value));
            }
        } else {
            // Plain property assignment - works for primitives, objects, and arrays alike, and is
            // what every mainstream web-components library (Lit, FAST, Stencil) expects as its
            // primary configuration surface.
            //
            // Known, unavoidable platform gotcha - not something this adapter can work around: if
            // `tagName` hasn't been `customElements.define()`-d yet when this runs, the element is
            // created as an un-upgraded "undefined element", and a property set on it now can be
            // shadowed by a class field the component declares once it upgrades (the well-documented
            // custom-elements "lazy properties" trap). Register the component's class BEFORE using
            // `createWebComponentIsland` for it, or have the component read its own
            // pre-upgrade-set properties in its constructor (the standard `_upgradeProperty` pattern)
            // if load order can't be guaranteed.
            (el as any)[key] = value;
        }
    }
}

/**
 * Creates an island mount function that instantiates (or, on a real SSR-hydration path, adopts an
 * already-present) custom element inside the island container.
 *
 * `Component` here is the registered tag name (a `string`), not a class/function reference the way
 * it is for React/Vue/Preact/Svelte - matching the `AdapterFactory` registry shape
 * (`(Component, options?) => IslandFactory`) so `getAdapter('web-components')(tagName, options)`
 * resolves the same way any other named adapter does, per ROADMAP.v5.md Part G/L. The single
 * `WebComponentAdapterOptions` overload remains for direct (non-registry) use.
 */
export function createWebComponentIsland<TProps = any>(
    tagNameOrOptions: string | WebComponentAdapterOptions,
    maybeOptions?: Omit<WebComponentAdapterOptions, 'tagName'>
) {
    const options: WebComponentAdapterOptions = typeof tagNameOrOptions === 'string'
        ? { tagName: tagNameOrOptions, ...maybeOptions }
        : tagNameOrOptions;

    return (container: HTMLElement, props: TProps, ctx?: IslandContext) => {
        // Hydration: an SSR'd island may already contain a real, server-rendered instance of the
        // tag (e.g. via a declarative shadow DOM payload) - adopt it rather than creating a second
        // one alongside it.
        let el = container.querySelector<HTMLElement>(options.tagName);
        const hydrating = !!el;

        if (!el) {
            el = document.createElement(options.tagName);
        }

        // Extract `.island-slot` content BEFORE the element is (re-)inserted, same ordering
        // discipline as the React/Preact adapters - see slot.ts's own doc comment for why this
        // matters (a nested island living inside that slot must survive as a live node, not be
        // re-serialized).
        const extractedSlot = hydrating ? null : extractIslandSlot(container);

        applyProps(el, props as Record<string, any>, options);

        if (!hydrating) {
            container.appendChild(el);
        }
        if (extractedSlot) {
            extractedSlot.attach(el);
            warnIfSlotUnused(extractedSlot, container);
        }

        const unmount = () => {
            el?.remove();
        };

        const update = (newProps: any) => {
            if (el) applyProps(el, newProps, options);
        };

        if (ctx?.signal) {
            ctx.signal.addEventListener('abort', unmount, { once: true });
        }
        if (ctx?.onCleanup) {
            ctx.onCleanup(unmount);
        }

        return { unmount, update };
    };
}

export const createWebComponentAdapter = createWebComponentIsland;
