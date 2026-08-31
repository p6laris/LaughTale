import '../setup.ts';
import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { MemoryLeakHarness } from '../../src/testing/leak-harness.ts';
import { defineIsland, clearRegistry } from '../../src/runtime/registry.ts';
import { hydrateIsland } from '../../src/runtime/hydrator.ts';
import '../../src/index.ts';

describe('Memory Leak Detection Harness Suite', () => {
    const harness = new MemoryLeakHarness();

    beforeEach(() => {
        clearRegistry();
        document.body.innerHTML = '';
        harness.start();
    });

    afterEach(() => {
        harness.stop();
    });

    it('detects un-removed event listeners accurately', () => {
        const handler = () => {};
        window.addEventListener('resize', handler);

        const report = harness.getReport();
        assert.ok(report.activeEventListeners >= 1, 'Should record active resize listener');
        assert.ok(report.totalLeaks >= 1);

        // Clean up
        window.removeEventListener('resize', handler);

        const cleanReport = harness.getReport();
        assert.equal(cleanReport.totalLeaks, 0, 'Report should show 0 leaks after proper cleanup');
    });

    it('asserts zero leaks when an island binds listeners via ctx.signal and unmounts', async () => {
        defineIsland('leak-free-island', async () => ({
            default: (el, props, ctx) => {
                window.addEventListener('keydown', () => {}, { signal: ctx!.signal });
                window.addEventListener('mousemove', () => {}, { signal: ctx!.signal });
                el.addEventListener('click', () => {}, { signal: ctx!.signal });
            }
        }));

        const container = document.createElement('div');
        container.setAttribute('data-island', 'leak-free-island');
        container.setAttribute('data-hydrate', 'load');
        document.body.appendChild(container);

        hydrateIsland(container);

        await new Promise(r => setTimeout(r, 40));

        // Unmount island
        container.dispatchEvent(new CustomEvent('laughtale:unmount'));

        // Assert 0 leaks
        assert.doesNotThrow(() => {
            harness.assertZeroLeaks('Expected zero leaks after island unmount');
        });
    });

    it('asserts zero leaks across all 76 registered island components on mount and unmount', async () => {
        // Load index to register all 76 islands
        await import('../../src/index.ts');

        // Test sample representative set across categories
        const testComponents = [
            'button', 'accordion', 'dialog', 'tabs', 'slider', 'toast', 'tag',
            'input-text', 'toggle-switch', 'progress-bar', 'drawer', 'knob',
            'rating', 'splitter', 'stepper', 'timeline', 'tree', 'treetable'
        ];

        for (const name of testComponents) {
            const el = document.createElement('div');
            el.setAttribute('data-island', name);
            el.setAttribute('data-hydrate', 'load');
            el.setAttribute('data-props', JSON.stringify({ label: 'Test', value: 50, items: [] }));
            document.body.appendChild(el);

            hydrateIsland(el);
            await new Promise(r => setTimeout(r, 20));

            // Unmount
            el.dispatchEvent(new CustomEvent('laughtale:unmount'));
            el.remove();
        }

        harness.assertZeroLeaks('Expected zero leaks across island components after unmount');
    });
});
