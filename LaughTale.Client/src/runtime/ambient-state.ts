/**
 * LaughTale: Ambient State Pool (client) - ROADMAP.v5.md Part F.
 *
 * Reads the server-dehydrated `<script id="__LAUGHTALE_STATE__" type="application/json">` blob (if
 * `IslandStateScriptTagHelper` rendered one) and seeds `useSharedState` stores from it, so
 * `ctx.state(key)` starts with whatever the server already knew instead of an empty client-only
 * store. Deliberately layered on top of `useSharedState`/`IslandStore` (runtime/state.ts), not a
 * separate store implementation - once seeded, ambient state behaves exactly like any other shared
 * store: reactive, cross-island, subscribable.
 */
import { useSharedState, type IslandStore } from './state';

const AMBIENT_SCRIPT_ID = '__LAUGHTALE_STATE__';

/**
 * Cached parse of the ambient payload. `undefined` = not yet read; `null` = read and found
 * nothing/invalid. Cached at module scope (not `globalThis`, unlike registry.ts/state.ts) because,
 * unlike those, seeding is a one-shot read of DOM content present at initial load - a second
 * independently-bundled copy of this module reading the same script tag a second time is harmless
 * and cheap, not a correctness bug like a split registry would be.
 */
let cache: Record<string, unknown> | null | undefined;

function readAmbientPayload(): Record<string, unknown> {
    if (cache !== undefined) {
        return cache ?? {};
    }

    const el = document.getElementById(AMBIENT_SCRIPT_ID);
    if (!el || !el.textContent) {
        cache = null;
        return {};
    }

    try {
        const parsed = JSON.parse(el.textContent);
        cache = (parsed && typeof parsed === 'object') ? parsed : null;
    } catch (err) {
        console.error('[LaughTale] Failed to parse ambient state payload:', err);
        cache = null;
    }

    return cache ?? {};
}

/**
 * Gets or creates the shared store for `key`, seeded from the server's ambient state blob when
 * present. Once a store for `key` exists (from either this or a previous `useSharedState`/
 * `useAmbientState` call), later calls just return the same store - the ambient payload only ever
 * seeds the INITIAL value, matching `useSharedState`'s existing "create once" semantics.
 */
export function useAmbientState<T = any>(key: string, initialValue?: T): IslandStore<T> {
    const payload = readAmbientPayload();
    const seeded = Object.prototype.hasOwnProperty.call(payload, key) ? (payload[key] as T) : initialValue;
    return useSharedState<T>(key, seeded);
}

/**
 * Clears the cached payload read. Test isolation only, mirrors `clearSharedState()`/`clearRegistry()`.
 */
export function clearAmbientStateCache(): void {
    cache = undefined;
}
