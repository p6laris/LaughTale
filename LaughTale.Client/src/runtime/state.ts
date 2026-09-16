/**
 * LaughTale: Reactive Shared State Store
 * 
 * Provides lightweight reactive state sharing across islands.
 */

type Listener<T> = (value: T, prev: T) => void;

export class IslandStore<T> {
    private value: T;
    private listeners = new Set<Listener<T>>();

    constructor(initialValue: T) {
        this.value = initialValue;
    }

    get(): T {
        return this.value;
    }

    set(next: T | ((prev: T) => T)): void {
        const prev = this.value;
        this.value = typeof next === 'function' ? (next as (prev: T) => T)(prev) : next;

        if (this.value !== prev) {
            this.listeners.forEach(fn => fn(this.value, prev));
        }
    }

    subscribe(listener: Listener<T>): () => void {
        this.listeners.add(listener);
        return () => this.listeners.delete(listener);
    }
}

/**
 * The backing store map lives on `globalThis`, not module scope — for the same reason
 * `runtime/registry.ts`'s island registry and `adapters/registry.ts`'s adapter registry do
 * (see either file's long-form comment): a page can load more than one independently-built
 * bundle (e.g. the app's main bundle alongside a separately-built user-authored-islands bundle,
 * ROADMAP.v5.md Part B), and ESM gives each bundle its own module instance. Now that `ctx.sharedState`
 * (hydrator.ts) makes this store part of the real mount-time API surface rather than an unused
 * export, a plain module-scope Map would silently split into disconnected stores across bundles -
 * the same bug already fixed twice elsewhere, applied here before it ever ships as a live one.
 */
const STORES_KEY = '__laughtaleSharedStateStores__';

function getSharedStores(): Map<string, IslandStore<any>> {
    const g = globalThis as typeof globalThis & { [STORES_KEY]?: Map<string, IslandStore<any>> };
    if (!g[STORES_KEY]) {
        g[STORES_KEY] = new Map<string, IslandStore<any>>();
    }
    return g[STORES_KEY];
}

/**
 * Creates or gets a shared island state store.
 */
export function useSharedState<T>(key: string, initialValue?: T): IslandStore<T> {
    const stores = getSharedStores();
    if (!stores.has(key)) {
        stores.set(key, new IslandStore(initialValue as T));
    }
    return stores.get(key)!;
}

/**
 * Clears all shared state stores. Test isolation only, mirrors `clearRegistry()`/
 * `clearAdapterRegistry()`.
 */
export function clearSharedState(): void {
    getSharedStores().clear();
}
