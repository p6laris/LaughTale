import '../setup.ts';
import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { defineIsland, clearRegistry } from '../../src/runtime/registry.ts';
import { hydrateIsland, teardownIsland } from '../../src/runtime/hydrator.ts';
import { refreshIsland } from '../../src/runtime/refresh.ts';

describe('Island Teardown on In-Place Replacement Suite (LT-902)', () => {
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

    it('teardown requested twice runs cleanup once (idempotence)', async () => {
        let cleanupCount = 0;
        let abortCount = 0;

        defineIsland('idempotent-probe', async () => ({
            default: (el: HTMLElement, props: any, ctx: any) => {
                ctx.signal.addEventListener('abort', () => {
                    abortCount++;
                });
                ctx.onCleanup(() => {
                    cleanupCount++;
                });
            }
        }));

        const container = document.createElement('div');
        container.setAttribute('data-island', 'idempotent-probe');
        container.setAttribute('data-hydrate', 'load');
        document.body.appendChild(container);

        hydrateIsland(container);
        await new Promise(r => setTimeout(r, 30));

        teardownIsland(container);
        teardownIsland(container);

        assert.equal(abortCount, 1, 'Abort should only fire once');
        assert.equal(cleanupCount, 1, 'Cleanup callback should only run once');
    });

    it('teardown of a never-mounted container is silent', () => {
        const container = document.createElement('div');
        container.setAttribute('data-island', 'non-mounted');
        document.body.appendChild(container);

        assert.doesNotThrow(() => {
            teardownIsland(container);
        });
    });

    it('teardown of a failed mount is silent', async () => {
        defineIsland('failing-mount', async () => ({
            default: () => {
                throw new Error('Mount blew up deliberately');
            }
        }));

        const container = document.createElement('div');
        container.setAttribute('data-island', 'failing-mount');
        container.setAttribute('data-hydrate', 'load');
        document.body.appendChild(container);

        hydrateIsland(container);
        await new Promise(r => setTimeout(r, 30));

        assert.doesNotThrow(() => {
            teardownIsland(container);
        });
    });

    it('a throwing cleanup does not prevent the remaining cleanups', async () => {
        const executedCleanups: number[] = [];

        defineIsland('throwing-cleanup', async () => ({
            default: (el: HTMLElement, props: any, ctx: any) => {
                ctx.onCleanup(() => {
                    executedCleanups.push(1);
                });
                ctx.onCleanup(() => {
                    throw new Error('Explosive cleanup failure!');
                });
                ctx.onCleanup(() => {
                    executedCleanups.push(3);
                });
            }
        }));

        const container = document.createElement('div');
        container.setAttribute('data-island', 'throwing-cleanup');
        container.setAttribute('data-hydrate', 'load');
        document.body.appendChild(container);

        hydrateIsland(container);
        await new Promise(r => setTimeout(r, 30));

        teardownIsland(container);

        // Cleanups drain in LIFO order (3, then 2 throws, then 1)
        assert.deepEqual(executedCleanups, [3, 1], 'Both non-throwing cleanups should run despite middle failure');
    });

    it('tearing down an outer island does not tear down an unrelated sibling', async () => {
        let abortA = 0;
        let abortB = 0;

        defineIsland('sibling-a', async () => ({
            default: (el: HTMLElement, props: any, ctx: any) => {
                ctx.signal.addEventListener('abort', () => { abortA++; });
            }
        }));

        defineIsland('sibling-b', async () => ({
            default: (el: HTMLElement, props: any, ctx: any) => {
                ctx.signal.addEventListener('abort', () => { abortB++; });
            }
        }));

        const containerA = document.createElement('div');
        containerA.setAttribute('data-island', 'sibling-a');
        containerA.setAttribute('data-hydrate', 'load');

        const containerB = document.createElement('div');
        containerB.setAttribute('data-island', 'sibling-b');
        containerB.setAttribute('data-hydrate', 'load');

        document.body.appendChild(containerA);
        document.body.appendChild(containerB);

        hydrateIsland(containerA);
        hydrateIsland(containerB);
        await new Promise(r => setTimeout(r, 30));

        teardownIsland(containerA);

        assert.equal(abortA, 1, 'Sibling A should be torn down');
        assert.equal(abortB, 0, 'Sibling B must not be torn down');
    });

    it('scale assertion: 50 in-place replacements leave exactly 1 live handler and 50 aborts', async () => {
        let mounts = 0;
        let aborts = 0;
        let handlerInvocations = 0;

        defineIsland('scale-island', async () => ({
            default: (el: HTMLElement, props: any, ctx: any) => {
                mounts++;

                ctx.signal.addEventListener('abort', () => {
                    aborts++;
                });

                window.addEventListener('laughtale:scale-ping', () => {
                    handlerInvocations++;
                }, { signal: ctx.signal });
            }
        }));

        const container = document.createElement('div');
        container.setAttribute('data-island', 'scale-island');
        container.setAttribute('data-hydrate', 'load');
        document.body.appendChild(container);

        hydrateIsland(container);
        await new Promise(r => setTimeout(r, 20));

        const originalFetch = global.fetch;
        global.fetch = async () => ({
            ok: true,
            status: 200,
            text: async () => `<div data-island="scale-island"></div>`
        } as any);

        try {
            // 50 in-place replacements
            for (let i = 0; i < 50; i++) {
                await refreshIsland(container);
            }

            // Probe live window listeners
            handlerInvocations = 0;
            window.dispatchEvent(new Event('laughtale:scale-ping'));
            const liveHandlers = handlerInvocations;

            assert.equal(mounts, 51, 'Total mounts: 1 initial + 50 refreshes');
            assert.equal(aborts, 50, 'Total aborts must equal 50');
            assert.equal(liveHandlers, 1, 'Exactly 1 live handler should remain after 50 refreshes');
        } finally {
            global.fetch = originalFetch;
        }
    });
});
