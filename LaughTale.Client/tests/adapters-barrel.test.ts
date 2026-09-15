/**
 * Proves adapters/index.ts's barrel actually populates the named adapter registry as a
 * module-load-time side effect (ROADMAP.v5.md Part G/L) — not just that registerAdapter/getAdapter
 * work in isolation (see tests/adapters-registry.test.ts for that).
 *
 * Deliberately its OWN file, with no clearAdapterRegistry call anywhere: the barrel's
 * registerAdapter(...) calls run exactly ONCE, at this file's top-level import below. Sharing a
 * file with tests that clear the (globalThis-anchored, process-wide-per-file) registry would let
 * an earlier test's cleanup silently wipe out the one-time registration this file exists to
 * observe.
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { getAdapter } from '../src/adapters/registry';
import { createReactIsland, createVueIsland, createPreactIsland, createSvelteIsland, createVanillaIsland } from '../src/adapters/index';

describe('adapters/index.ts barrel — registers all five built-in adapters at import time', () => {
    it('makes every built-in adapter resolvable by name via getAdapter, purely as a side effect of importing the barrel', () => {
        assert.equal(getAdapter('react'), createReactIsland);
        assert.equal(getAdapter('vue'), createVueIsland);
        assert.equal(getAdapter('preact'), createPreactIsland);
        assert.equal(getAdapter('svelte'), createSvelteIsland);
        assert.equal(getAdapter('vanilla'), createVanillaIsland);
    });
});
