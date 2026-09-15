import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import {
    registerAdapter,
    getAdapter,
    clearAdapterRegistry
} from '../src/adapters/registry';

describe('Framework Adapter Registry Suite', () => {
    beforeEach(() => {
        clearAdapterRegistry();
    });

    it('registers and retrieves an adapter factory by name', () => {
        const dummyFactory = (Component: any) => () => {};
        registerAdapter('react', dummyFactory);

        assert.equal(getAdapter('react'), dummyFactory);
    });

    it('returns undefined for a name with no registered adapter', () => {
        assert.equal(getAdapter('unknown-framework'), undefined);
    });

    it('overwrites a previously registered adapter under the same name', () => {
        const first = (Component: any) => () => {};
        const second = (Component: any) => () => {};

        registerAdapter('vue', first);
        registerAdapter('vue', second);

        assert.equal(getAdapter('vue'), second);
    });

    it('clearAdapterRegistry empties the registry for test isolation', () => {
        registerAdapter('preact', (Component: any) => () => {});
        clearAdapterRegistry();

        assert.equal(getAdapter('preact'), undefined);
    });

    it('anchors its backing Map on globalThis, not module scope (ROADMAP.v5.md Part G/L)', () => {
        // A page can load more than one independently-built bundle that each carry their own
        // copy of this module's code — e.g. the framework's own runtime bundle alongside a
        // separately-built bundle for user-authored islands. ESM gives each bundle its own
        // module instance, so a plain module-scope Map would silently split into two
        // disconnected registries. This test proves the actual, observable mechanism: the Map
        // this module mutates really does live at the well-known globalThis key, not in a
        // closure no other module instance could reach — the exact same pattern proven for
        // runtime/registry.ts's own island registry in tests/registry.test.ts.
        const dummyFactory = (Component: any) => () => {};
        registerAdapter('svelte', dummyFactory);

        const sharedMap = (globalThis as any).__laughtaleAdapterRegistry__;
        assert.ok(sharedMap instanceof Map, 'registry must be reachable via the well-known globalThis key');
        assert.equal(sharedMap.get('svelte'), dummyFactory, 'the globalThis-anchored Map must be the exact same object registerAdapter writes to');
    });
});
