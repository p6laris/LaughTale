/**
 * SoftMax.Islands: Reactive Shared State Store
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

const stores = new Map<string, IslandStore<any>>();

/**
 * Creates or gets a shared island state store.
 */
export function useSharedState<T>(key: string, initialValue?: T): IslandStore<T> {
    if (!stores.has(key)) {
        stores.set(key, new IslandStore(initialValue as T));
    }
    return stores.get(key)!;
}
