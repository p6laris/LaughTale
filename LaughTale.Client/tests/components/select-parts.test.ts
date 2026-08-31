import '../setup.ts';
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import SelectIsland from '../../src/components/select.ts';
import { MemoryLeakHarness } from '../../src/testing/leak-harness.ts';

describe('Select Reference Component Parts, Passthrough & Lifecycle Suite (, )', () => {
    it('renders data-part attributes on all sub-elements', () => {
        const container = document.createElement('div');
        SelectIsland(container, {
            options: [
                { label: 'Option A', value: 'a' },
                { label: 'Option B', value: 'b' }
            ],
            value: 'a'
        });

        assert.equal(container.getAttribute('data-part'), 'root');
        assert.ok(container.querySelector('[data-part="trigger"]'));
        assert.ok(container.querySelector('[data-part="indicator"]'));
        assert.ok(container.querySelector('[data-part="panel"]'));
        assert.ok(container.querySelector('[data-part="list"]'));

        const items = container.querySelectorAll('[data-part="item"]');
        assert.equal(items.length, 2);
    });

    it('merges consumer passthrough (pt) styles and attributes onto parts', () => {
        const container = document.createElement('div');
        SelectIsland(container, {
            options: ['Alpha', 'Beta'],
            value: 'Alpha',
            pt: {
                root: {
                    class: 'custom-root-class',
                    'data-custom-root': 'true'
                },
                panel: {
                    class: 'custom-panel-shadow',
                    style: { zIndex: '9999' }
                },
                item: {
                    class: 'custom-item-hover'
                }
            }
        });

        assert.ok(container.className.includes('custom-root-class'));
        assert.equal(container.getAttribute('data-custom-root'), 'true');

        const panel = container.querySelector<HTMLElement>('[data-part="panel"]');
        assert.ok(panel?.className.includes('custom-panel-shadow'));
        assert.ok(panel?.getAttribute('style')?.includes('z-index: 9999'));

        const item = container.querySelector<HTMLElement>('[data-part="item"]');
        assert.ok(item?.className.includes('custom-item-hover'));
    });

    it('binds listeners to IslandContext.signal and cleanly unmounts with zero leaks', () => {
        const harness = new MemoryLeakHarness();
        harness.start();

        const controller = new AbortController();
        const container = document.createElement('div');
        document.body.appendChild(container);

        SelectIsland(container, {
            options: ['One', 'Two', 'Three'],
            value: 'One'
        }, {
            signal: controller.signal,
            onCleanup: () => {},
            container,
            name: 'select',
            locale: 'en',
            dir: 'ltr'
        });

        // Abort lifecycle
        controller.abort();
        container.remove();

        const report = harness.getReport();
        assert.equal(report.totalLeaks, 0, 'Select component leaked listeners after signal abortion');

        harness.stop();
    });
});
