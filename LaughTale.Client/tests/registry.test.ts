import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import {
    defineIsland,
    hasIsland,
    getIslandLoader,
    getIslandDefinition,
    resolveIslandName,
    LEGACY_ALIASES,
    clearRegistry
} from '../src/runtime/registry';

describe('Island Registry & Canonical Alias Resolution Suite', () => {
    beforeEach(() => {
        clearRegistry();
    });

    it('registers and retrieves an island by canonical name', () => {
        const dummyLoader = async () => ({ default: () => {} });
        defineIsland('image-compare', dummyLoader);

        assert.equal(hasIsland('image-compare'), true);
        assert.equal(getIslandLoader('image-compare'), dummyLoader);
        assert.deepEqual(getIslandDefinition('image-compare'), {
            name: 'image-compare',
            loader: dummyLoader
        });
    });

    it('resolves legacy aliases to canonical name and logs deprecation warning', () => {
        const dummyLoader = async () => ({ default: () => {} });
        defineIsland('image-compare', dummyLoader);

        const warnings: string[] = [];
        const originalWarn = console.warn;
        console.warn = (msg: string) => warnings.push(msg);

        try {
            // Test lookup by alias
            assert.equal(hasIsland('imagecompare'), true);
            assert.equal(hasIsland('p-compare'), true);
            assert.equal(getIslandLoader('compare'), dummyLoader);

            const def = getIslandDefinition('island-compare');
            assert.ok(def);
            assert.equal(def.name, 'image-compare');
            assert.equal(def.loader, dummyLoader);

            assert.ok(warnings.length > 0);
            assert.ok(warnings.some(w => w.includes('deprecated and will be removed in v4')));
        } finally {
            console.warn = originalWarn;
        }
    });

    it('returns undefined for non-existent islands', () => {
        assert.equal(hasIsland('unknown-island'), false);
        assert.equal(getIslandLoader('unknown-island'), undefined);
        assert.equal(getIslandDefinition('unknown-island'), undefined);
    });

    it('maps all expected legacy aliases', () => {
        assert.equal(LEGACY_ALIASES['tree-table'], 'treetable');
        assert.equal(LEGACY_ALIASES['p-treetable'], 'treetable');
        assert.equal(LEGACY_ALIASES['chips'], 'input-tags');
        assert.equal(LEGACY_ALIASES['p-toast'], 'toast');
        assert.equal(LEGACY_ALIASES['commandmenu'], 'command');
    });

    it('anchors its backing Map on globalThis, not module scope (ROADMAP.v5.md Part B)', () => {
        // A page can load more than one independently-built bundle that each carry their own
        // copy of this module's code (the framework runtime, plus a separately-built bundle for
        // user-authored islands) — ESM gives each bundle its own module instance, so a plain
        // module-scope Map would silently split into two disconnected registries. Anchoring on
        // globalThis is what makes independently-bundled copies share one registry. This test
        // can't spin up a second real module instance (that's only provable in a real
        // multi-bundle browser page — see the Showcase end-to-end validation), but it does prove
        // the actual, observable mechanism: the Map this module mutates really does live at the
        // well-known globalThis key, not in a closure no other module instance could reach.
        const dummyLoader = async () => ({ default: () => {} });
        defineIsland('image-compare', dummyLoader);

        const sharedMap = (globalThis as any).__laughtaleIslandRegistry__;
        assert.ok(sharedMap instanceof Map, 'registry must be reachable via the well-known globalThis key');
        assert.equal(sharedMap.get('image-compare'), dummyLoader, 'the globalThis-anchored Map must be the exact same object defineIsland writes to');
    });
});
