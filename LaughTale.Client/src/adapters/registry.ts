/**
 * LaughTale: Framework Adapter Registry
 *
 * Lets a plugin (or app code) register a named framework adapter — e.g.
 * `registerAdapter('react', createReactIsland)` — so later code can resolve
 * "react" -> the actual adapter factory without importing `adapters/react.ts`
 * directly. This is what `defineFrameworkIsland` in `runtime/registry.ts`
 * resolves `framework` strings against (see ROADMAP.v5.md Part G/L).
 */

import type { IslandFactory } from '../runtime/registry';

export type AdapterFactory<TProps = any> = (Component: any, options?: any) => IslandFactory<TProps>;

/**
 * The registry's backing Map lives on `globalThis`, not module scope — for the exact same
 * reason `runtime/registry.ts`'s own island registry does (see that file's long-form comment,
 * confirmed the hard way twice this session): a page can load more than one independently-built
 * bundle that each carry their own copy of this module's code (e.g. the framework's own runtime
 * bundle alongside a separately-built bundle for user-authored islands). ESM gives each bundle
 * its own module instance, so a plain module-scope `const` would silently split into two
 * disconnected registries — an adapter registered by one bundle would never be found by a
 * `getAdapter` call from the other. Anchoring on `globalThis` makes any number of
 * independently-bundled copies of this file share one registry automatically, regardless of
 * load order. This is a no-op for every app that only ever loads a single bundle.
 */
const ADAPTER_REGISTRY_KEY = '__laughtaleAdapterRegistry__';

function getSharedAdapterRegistry(): Map<string, AdapterFactory> {
    const g = globalThis as typeof globalThis & { [ADAPTER_REGISTRY_KEY]?: Map<string, AdapterFactory> };
    if (!g[ADAPTER_REGISTRY_KEY]) {
        g[ADAPTER_REGISTRY_KEY] = new Map<string, AdapterFactory>();
    }
    return g[ADAPTER_REGISTRY_KEY];
}

/**
 * Registers a framework adapter factory under a name (e.g. "react", "vue", "preact", "svelte",
 * "vanilla"). Re-registering the same name overwrites the previous factory.
 */
export function registerAdapter(name: string, factory: AdapterFactory): void {
    getSharedAdapterRegistry().set(name, factory);
}

/**
 * Retrieves a previously registered framework adapter factory, or `undefined` if no adapter is
 * registered under that name.
 */
export function getAdapter(name: string): AdapterFactory | undefined {
    return getSharedAdapterRegistry().get(name);
}

/**
 * Clears the registry for test isolation.
 */
export function clearAdapterRegistry(): void {
    getSharedAdapterRegistry().clear();
}
