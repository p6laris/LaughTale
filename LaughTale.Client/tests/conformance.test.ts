import './setup.ts';
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

// Import index to register all canonical islands
import '../src/index.ts';
import { listIslands, getIslandDefinition } from '../src/runtime/registry.ts';
import { hydrateIsland } from '../src/runtime/hydrator.ts';

describe('Island Conformance & Contract Verification Suite', () => {
    const islands = listIslands();

    it('registers a comprehensive suite of canonical island components', () => {
        assert.ok(islands.length >= 60, `Expected at least 60 canonical islands, found ${islands.length}`);
    });

    it('conforms to IslandModule interface for all registered components', async () => {
        for (const name of islands) {
            const def = getIslandDefinition(name);
            assert.ok(def, `Missing island definition for "${name}"`);
            assert.equal(typeof def.loader, 'function', `Island loader for "${name}" must be a function`);

            // Dynamically load the module
            const module: any = await def.loader();
            const mount = module?.default || module;

            assert.equal(
                typeof mount,
                'function',
                `Island "${name}" must export a default mount factory function`
            );
        }
    });

    it('mounts and unmounts canonical islands cleanly in DOM container', async () => {
        for (const name of islands) {
            const container = document.createElement('div');
            container.setAttribute('data-island', name);
            container.setAttribute('data-hydrate', 'load');
            container.setAttribute('data-props', JSON.stringify({}));
            document.body.appendChild(container);

            try {
                hydrateIsland(container);
                // Allow async module loading and mount cycle
                await new Promise(r => setTimeout(r, 10));

                // Dispatch unmount to test teardown lifecycle
                container.dispatchEvent(new CustomEvent('laughtale:unmount'));
            } catch (err) {
                assert.fail(`Island "${name}" failed during mount/unmount cycle: ${(err as Error).message}`);
            } finally {
                container.remove();
            }
        }
    });
});
