import '../setup.ts';
import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { defineIsland, clearRegistry } from '../../src/runtime/registry.ts';
import { hydrateIsland } from '../../src/runtime/hydrator.ts';
import { refreshIsland } from '../../src/runtime/refresh.ts';

describe('Server-Driven Island Refresh Suite (LT-22xx / P12)', () => {
    beforeEach(() => {
        clearRegistry();
        document.body.innerHTML = '';
    });

    it('refreshes island with updated props and morphs DOM', async () => {
        let mountedProps: any = null;

        defineIsland('counter-test', async () => ({
            default: (el: HTMLElement, props: any) => {
                mountedProps = props;
                el.innerHTML = `<button type="button" class="btn">Count: ${props.count}</button>`;
            }
        }));

        const container = document.createElement('div');
        container.setAttribute('data-island', 'counter-test');
        container.setAttribute('data-props', JSON.stringify({ count: 1 }));
        container.setAttribute('data-hydrate', 'load');
        document.body.appendChild(container);

        hydrateIsland(container);
        await new Promise(r => setTimeout(r, 20));

        assert.equal(mountedProps.count, 1);
        assert.ok(container.innerHTML.includes('Count: 1'));

        // Mock global fetch for refresh endpoint
        const originalFetch = global.fetch;
        global.fetch = async (url: any, opts: any) => {
            const body = JSON.parse(opts.body);
            return {
                ok: true,
                status: 200,
                text: async () => `<div data-island="counter-test" data-props='${JSON.stringify({ count: body.count || 5 })}'><button type="button" class="btn">Count: ${body.count || 5}</button></div>`
            } as any;
        };

        try {
            await (container as any).island.refresh({ count: 10 });
            await new Promise(r => setTimeout(r, 20));

            assert.equal(mountedProps.count, 10);
            assert.ok(container.innerHTML.includes('Count: 10'));
        } finally {
            global.fetch = originalFetch;
        }
    });

    it('attaches refresh method to container.island automatically', async () => {
        defineIsland('simple-card', async () => ({
            default: (el: HTMLElement) => {
                el.textContent = 'Card Content';
            }
        }));

        const container = document.createElement('div');
        container.setAttribute('data-island', 'simple-card');
        container.setAttribute('data-hydrate', 'load');
        document.body.appendChild(container);

        hydrateIsland(container);
        await new Promise(r => setTimeout(r, 40));

        assert.ok((container as any).island);
        assert.equal(typeof (container as any).island.refresh, 'function');
    });
});
