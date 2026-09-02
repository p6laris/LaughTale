import '../setup.ts';
import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { defineIsland, clearRegistry } from '../../src/runtime/registry.ts';
import { hydrateIsland } from '../../src/runtime/hydrator.ts';
import { refreshIsland } from '../../src/runtime/refresh.ts';

describe('Island Teardown on In-Place Replacement Suite (LT-902 / Phase 0)', () => {
    beforeEach(() => {
        clearRegistry();
        document.body.innerHTML = '';
    });

    it('tears down previous mount on refreshIsland() in-place replacement', async () => {
        let mounts = 0;
        let aborts = 0;
        let cleanupsRun = 0;
        let handlerInvocations = 0;

        defineIsland('refresh-leak-probe', async () => ({
            default: (el: HTMLElement, props: any, ctx: any) => {
                mounts++;

                ctx.signal.addEventListener('abort', () => {
                    aborts++;
                });

                ctx.onCleanup(() => {
                    cleanupsRun++;
                });

                window.addEventListener('laughtale:probe-ping', () => {
                    handlerInvocations++;
                }, { signal: ctx.signal });
            }
        }));

        const container = document.createElement('div');
        container.setAttribute('data-island', 'refresh-leak-probe');
        container.setAttribute('data-hydrate', 'load');
        document.body.appendChild(container);

        hydrateIsland(container);
        await new Promise(r => setTimeout(r, 30));

        // Stub fetch to return the island's own markup
        const originalFetch = global.fetch;
        global.fetch = async () => {
            return {
                ok: true,
                status: 200,
                text: async () => `<div data-island="refresh-leak-probe"></div>`
            } as any;
        };

        try {
            // Refresh 3 times
            await refreshIsland(container);
            await new Promise(r => setTimeout(r, 30));

            await refreshIsland(container);
            await new Promise(r => setTimeout(r, 30));

            await refreshIsland(container);
            await new Promise(r => setTimeout(r, 30));

            // Probe live window listeners
            handlerInvocations = 0;
            window.dispatchEvent(new Event('laughtale:probe-ping'));
            const liveHandlers = handlerInvocations;

            const stats = { mounts, aborts, cleanupsRun, liveHandlers };
            assert.deepEqual(stats, { mounts: 4, aborts: 3, cleanupsRun: 3, liveHandlers: 1 });
        } finally {
            global.fetch = originalFetch;
        }
    });
});
