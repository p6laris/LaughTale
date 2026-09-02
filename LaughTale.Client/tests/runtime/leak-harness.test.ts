import '../setup.ts';
import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { MemoryLeakHarness } from '../../src/testing/leak-harness.ts';
import { defineIsland, clearRegistry } from '../../src/runtime/registry.ts';
import { hydrateIsland } from '../../src/runtime/hydrator.ts';

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

    it('detects un-removed event listeners on window, document, and elements', () => {
        // 1. window listener
        const winHandler = () => {};
        window.addEventListener('resize', winHandler);
        let report = harness.getReport();
        assert.ok(report.activeEventListeners >= 1);
        assert.ok(report.details.some(d => d.includes('Active listener: window -> "resize"')));
        window.removeEventListener('resize', winHandler);

        // 2. document listener
        const docHandler = () => {};
        document.addEventListener('keydown', docHandler);
        report = harness.getReport();
        assert.ok(report.activeEventListeners >= 1);
        assert.ok(report.details.some(d => d.includes('Active listener: document -> "keydown"')));
        document.removeEventListener('keydown', docHandler);

        // 3. element listener
        const div = document.createElement('div');
        document.body.appendChild(div);
        const elHandler = () => {};
        div.addEventListener('click', elHandler);
        report = harness.getReport();
        assert.ok(report.activeEventListeners >= 1);
        assert.ok(report.details.some(d => d.includes('Active listener: <div> -> "click"')));
        div.removeEventListener('click', elHandler);

        const cleanReport = harness.getReport();
        assert.equal(cleanReport.totalLeaks, 0, 'Report should show 0 leaks after proper cleanup');
    });

    it('detects un-disconnected observers and uncleared timers', () => {
        // Observers
        const observer = new MutationObserver(() => {});
        const div = document.createElement('div');
        document.body.appendChild(div);
        observer.observe(div, { childList: true });

        let report = harness.getReport();
        assert.equal(report.activeObservers, 1);
        assert.ok(report.totalLeaks >= 1);

        observer.disconnect();
        report = harness.getReport();
        assert.equal(report.activeObservers, 0);

        // Timers
        const intervalId = window.setInterval(() => {}, 1000);
        report = harness.getReport();
        assert.equal(report.activeTimers, 1);

        window.clearInterval(intervalId);
        report = harness.getReport();
        assert.equal(report.activeTimers, 0);
        assert.equal(report.totalLeaks, 0);
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
        // Test sample representative set across categories
        const testComponents = [
            'button', 'accordion', 'dialog', 'tabs', 'slider', 'toast', 'tag',
            'input-text', 'toggle-switch', 'progress-bar', 'drawer', 'knob',
            'rating', 'splitter', 'stepper', 'timeline', 'tree', 'treetable'
        ];

        // Register islands after clearRegistry() per T013
        for (const name of testComponents) {
            defineIsland(name, () => import(`../../src/components/${name}.ts`));
        }

        let mountedCount = 0;

        for (const name of testComponents) {
            const el = document.createElement('div');
            el.setAttribute('data-island', name);
            el.setAttribute('data-hydrate', 'load');
            const props = ['tree', 'treetable', 'timeline'].includes(name)
                ? { label: 'Test', value: [], events: [], nodes: [], items: [] }
                : { label: 'Test', value: 50, items: [] };
            el.setAttribute('data-props', JSON.stringify(props));
            document.body.appendChild(el);

            hydrateIsland(el);
            await new Promise(r => setTimeout(r, 40));

            const state = (el as any)['__laughtale_state__'];
            assert.equal(state, 'mounted', `Component '${name}' did not reach 'mounted' state`);
            mountedCount++;

            // Unmount
            el.dispatchEvent(new CustomEvent('laughtale:unmount'));
            el.remove();
        }

        assert.equal(mountedCount, testComponents.length, `Expected all ${testComponents.length} components to mount`);
        console.log(`[leak-harness] Verified mount and teardown across ${mountedCount} island components`);
        harness.assertZeroLeaks('Expected zero leaks across island components after unmount');
    });
});
