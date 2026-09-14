import '../setup.ts';
import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { defineIsland, clearRegistry } from '../../src/runtime/registry.ts';
import { hydrateIsland } from '../../src/runtime/hydrator.ts';
import { refreshIsland } from '../../src/runtime/refresh.ts';
import { createReactIsland } from '../../src/adapters/react.ts';

// Dynamic import, not a static `import ... from 'react'` declaration: esbuild inlines
// setup.ts's happy-dom globalThis assignments into this same bundled module, and a static
// import of an external package would be evaluated before this module's own top-level
// statements run (see the identical note in tests/adapters.test.ts, where this actually broke
// Vue's real mount). React tolerates it either way, but staying consistent avoids relearning
// this the hard way for a framework that doesn't.
const React = await import('react');

// Fixed short delay for the plain-vanilla-mount test below, where hydrateIsland()'s own
// fire-and-forget async chain (awaitStreamingReady, importWithRetry) just needs a couple of
// event-loop turns - no framework scheduler involved.
const settle = (ms = 20): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));

// React's concurrent root schedules its commit on a macrotask whose exact delay is not
// contractual, and this file additionally goes through hydrateIsland()'s own async chain
// (awaitStreamingReady, importWithRetry, this test's own async mount wrapper) before React's
// dynamic imports and scheduler even start. A fixed delay guess was observed to flake under
// parallel test-file load. Poll for the real condition instead, up to a generous ceiling.
async function waitFor(check: () => boolean, timeoutMs = 2000, intervalMs = 10): Promise<void> {
    const start = Date.now();
    while (!check()) {
        if (Date.now() - start > timeoutMs) {
            throw new Error(`waitFor: condition not met within ${timeoutMs}ms`);
        }
        await new Promise(resolve => setTimeout(resolve, intervalMs));
    }
}

describe('Server-Driven Refresh: Adapter update() In-Place Path (ROADMAP.v5.md Part D)', () => {
    beforeEach(() => {
        clearRegistry();
        document.body.innerHTML = '';
    });

    it('refreshIsland() takes the real React adapter update() path: unmount is not called, innerHTML is never replaced, and new props take effect', async () => {
        let unmountCalls = 0;

        function Widget(props: any) {
            return React.createElement('span', { id: 'stable' }, `Count: ${props.count}`);
        }

        // The registered mount function wraps the REAL react.ts adapter (not a hand-rolled
        // stand-in) so this test exercises the actual production update() implementation end to
        // end through refreshIsland(). It only adds a call-counter around the adapter's own
        // unmount so the test can assert, directly, that refresh never invokes it.
        defineIsland('react-refresh-probe', async () => ({
            default: async (container: HTMLElement, props: any, ctx: any) => {
                const realMount = createReactIsland(Widget);
                const result: any = await realMount(container, props, ctx);
                assert.ok(result && typeof result.update === 'function', 'real React adapter must return {unmount, update}');
                return {
                    unmount: () => {
                        unmountCalls++;
                        return result.unmount?.();
                    },
                    update: (newProps: any) => result.update(newProps)
                };
            }
        }));

        const container = document.createElement('div');
        container.setAttribute('data-island', 'react-refresh-probe');
        container.setAttribute('data-props', JSON.stringify({ count: 1 }));
        container.setAttribute('data-hydrate', 'load');
        document.body.appendChild(container);

        hydrateIsland(container);
        await waitFor(() => container.textContent === 'Count: 1');

        assert.equal(container.textContent, 'Count: 1');
        const spanBefore = container.querySelector('#stable');
        assert.ok(spanBefore, 'span should exist after initial real React mount');

        // Spy directly on container.innerHTML. morphElement's only DOM-mutating step besides
        // attribute sync is `existing.innerHTML = incoming.innerHTML` - the wholesale
        // replacement this fix exists to avoid. If the update()-path is genuinely taken instead
        // of the legacy morph+remount fallback, refresh.ts must never touch it. Defined on the
        // instance (not the prototype) so no other test or element is affected.
        let innerHTMLSetCount = 0;
        let proto: any = container;
        let nativeDescriptor: PropertyDescriptor | undefined;
        while (proto && !nativeDescriptor) {
            nativeDescriptor = Object.getOwnPropertyDescriptor(proto, 'innerHTML');
            proto = Object.getPrototypeOf(proto);
        }
        assert.ok(nativeDescriptor?.set, 'must find a native innerHTML setter to spy on');
        Object.defineProperty(container, 'innerHTML', {
            configurable: true,
            get() {
                return nativeDescriptor!.get!.call(container);
            },
            set(value: string) {
                innerHTMLSetCount++;
                nativeDescriptor!.set!.call(container, value);
            }
        });

        const originalFetch = global.fetch;
        global.fetch = async () => ({
            ok: true,
            status: 200,
            text: async () => `<div data-island="react-refresh-probe" data-props='${JSON.stringify({ count: 42 })}'></div>`
        } as any);

        try {
            await refreshIsland(container);
            await waitFor(() => container.textContent === 'Count: 42');

            assert.equal(unmountCalls, 0, 'unmount must NOT be called during a successful update()-path refresh');
            assert.equal(innerHTMLSetCount, 0, 'container.innerHTML must never be assigned during the update()-path refresh');
            assert.equal(container.textContent, 'Count: 42', 'new props must take effect');

            const spanAfter = container.querySelector('#stable');
            assert.equal(spanAfter, spanBefore, 'the same React-managed DOM node must survive the refresh - proof no remount happened, not just that the new text appeared');
        } finally {
            global.fetch = originalFetch;
            delete (container as any).innerHTML;
        }
    });

    it('refreshIsland() falls back to morph+remount when the adapter update() throws, instead of leaving the island half-updated', async () => {
        let mounts = 0;
        let updateCalls = 0;

        defineIsland('throwing-update-probe', async () => ({
            default: (el: HTMLElement, props: any) => {
                mounts++;
                el.innerHTML = `<span class="txt">Count: ${props.count}</span>`;
                return {
                    update: (_newProps: any) => {
                        updateCalls++;
                        throw new Error('Simulated broken adapter update()');
                    }
                };
            }
        }));

        const container = document.createElement('div');
        container.setAttribute('data-island', 'throwing-update-probe');
        container.setAttribute('data-props', JSON.stringify({ count: 1 }));
        container.setAttribute('data-hydrate', 'load');
        document.body.appendChild(container);

        hydrateIsland(container);
        await settle(20);

        assert.equal(mounts, 1);
        assert.ok(container.innerHTML.includes('Count: 1'));

        const originalFetch = global.fetch;
        global.fetch = async () => ({
            ok: true,
            status: 200,
            text: async () => `<div data-island="throwing-update-probe" data-props='${JSON.stringify({ count: 99 })}'><span class="txt">Count: 99</span></div>`
        } as any);

        const originalConsoleError = console.error;
        let loggedUpdateError = false;
        console.error = (...args: any[]) => {
            if (String(args[0]).includes('update()')) {
                loggedUpdateError = true;
            }
        };

        try {
            await refreshIsland(container);
            await settle(20);

            assert.equal(updateCalls, 1, 'update() must have been attempted exactly once');
            assert.equal(loggedUpdateError, true, 'the update() failure must be logged, not silently swallowed');
            // rehydrateIsland() tears down and re-executes mount, so a fallback shows up here as
            // a second mount - proving refreshIsland() actually recovered instead of leaving the
            // island stuck in whatever partial state update() left it in.
            assert.equal(mounts, 2, 'must fall back to a full remount when update() throws');
            assert.ok(container.innerHTML.includes('Count: 99'), 'new props must still take effect via the fallback path');
        } finally {
            global.fetch = originalFetch;
            console.error = originalConsoleError;
        }
    });
});
