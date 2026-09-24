import '../setup.ts';
import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { defineIsland, clearRegistry, type IslandContext } from '../../src/runtime/registry.ts';
import { hydrateIsland } from '../../src/runtime/hydrator.ts';
import { clearSharedState } from '../../src/runtime/state.ts';

describe('IslandContext & Lifecycle AbortSignal Suite', () => {
    beforeEach(() => {
        clearRegistry();
        clearSharedState();
        document.body.innerHTML = '';
    });

    it('passes structural IslandContext with signal, onCleanup, locale, and dir to mount function', async () => {
        let receivedCtx: IslandContext | null = null;

        defineIsland('context-test-island', async () => ({
            default: (el, props, ctx) => {
                receivedCtx = ctx!;
            }
        }));

        const container = document.createElement('div');
        container.setAttribute('data-island', 'context-test-island');
        container.setAttribute('data-hydrate', 'load');
        container.setAttribute('lang', 'fr-FR');
        container.setAttribute('dir', 'rtl');
        document.body.appendChild(container);

        hydrateIsland(container);

        await new Promise(r => setTimeout(r, 40));

        assert.ok(receivedCtx !== null, 'IslandContext must be received by mount function');
        assert.ok(receivedCtx?.signal && typeof (receivedCtx.signal as any).addEventListener === 'function', 'ctx.signal must be an AbortSignal');
        assert.equal(receivedCtx?.signal.aborted, false, 'signal must initially be non-aborted');
        assert.equal(receivedCtx?.locale, 'fr-FR', 'ctx.locale must match lang attribute');
        assert.equal(receivedCtx?.dir, 'rtl', 'ctx.dir must match dir attribute');
        assert.equal(receivedCtx?.name, 'context-test-island');
        assert.equal(receivedCtx?.container, container);
    });

    it('automatically aborts ctx.signal and executes ctx.onCleanup callbacks in LIFO order on unmount', async () => {
        const cleanupLog: string[] = [];
        let capturedSignal: AbortSignal | null = null;

        defineIsland('lifecycle-island', async () => ({
            default: (el, props, ctx) => {
                capturedSignal = ctx!.signal;
                ctx!.onCleanup(() => cleanupLog.push('cleanup-1'));
                ctx!.onCleanup(() => cleanupLog.push('cleanup-2'));

                // Also return a traditional unmount function
                return () => {
                    cleanupLog.push('returned-unmount');
                };
            }
        }));

        const container = document.createElement('div');
        container.setAttribute('data-island', 'lifecycle-island');
        container.setAttribute('data-hydrate', 'load');
        document.body.appendChild(container);

        hydrateIsland(container);

        await new Promise(r => setTimeout(r, 40));

        assert.equal(capturedSignal?.aborted, false);
        assert.equal(cleanupLog.length, 0);

        // Dispatch unmount
        container.dispatchEvent(new CustomEvent('laughtale:unmount'));

        assert.equal(capturedSignal?.aborted, true, 'ctx.signal must be aborted after laughtale:unmount');
        assert.deepEqual(cleanupLog, ['returned-unmount', 'cleanup-2', 'cleanup-1'], 'Cleanups must execute in LIFO order');
    });

    it('automatically removes event listeners bound with { signal: ctx.signal } on unmount', async () => {
        let clickCount = 0;

        defineIsland('signal-listener-island', async () => ({
            default: (el, props, ctx) => {
                window.addEventListener('click', () => {
                    clickCount++;
                }, { signal: ctx!.signal });
            }
        }));

        const container = document.createElement('div');
        container.setAttribute('data-island', 'signal-listener-island');
        container.setAttribute('data-hydrate', 'load');
        document.body.appendChild(container);

        hydrateIsland(container);

        await new Promise(r => setTimeout(r, 40));

        // Click before unmount
        window.dispatchEvent(new Event('click'));
        assert.equal(clickCount, 1, 'Listener should have fired');

        // Unmount island
        container.dispatchEvent(new CustomEvent('laughtale:unmount'));

        // Click after unmount
        window.dispatchEvent(new Event('click'));
        assert.equal(clickCount, 1, 'Listener bound to ctx.signal should not fire after unmount');
    });

    it('ctx.hydrate is true only for a data-lt-ssr-stamped container, not for mere child nodes (SSR sidecar)', async () => {
        const seen = new Map<string, IslandContext>();
        for (const name of ['hydrate-empty', 'hydrate-children', 'hydrate-whitespace', 'hydrate-stamped']) {
            defineIsland(name, async () => ({
                default: (el, props, ctx) => { seen.set(name, ctx!); }
            }));
        }

        const make = (name: string, html: string, stamped = false) => {
            const el = document.createElement('div');
            el.setAttribute('data-island', name);
            el.setAttribute('data-hydrate', 'load');
            if (stamped) el.setAttribute('data-lt-ssr', 'true');
            el.innerHTML = html;
            document.body.appendChild(el);
            return el;
        };

        const containers = [
            make('hydrate-empty', ''),
            make('hydrate-children', '<span>skeleton</span>'),
            make('hydrate-whitespace', '\n   \n'),
            make('hydrate-stamped', '<span>server-rendered</span>', true)
        ];
        containers.forEach((el) => hydrateIsland(el));

        await new Promise(r => setTimeout(r, 40));

        assert.equal(seen.get('hydrate-empty')?.hydrate, false, 'an empty container must report ctx.hydrate === false');
        assert.equal(seen.get('hydrate-children')?.hydrate, false, 'child nodes without the stamp must report ctx.hydrate === false');
        assert.equal(seen.get('hydrate-whitespace')?.hydrate, false, 'whitespace without the stamp must report ctx.hydrate === false');
        assert.equal(seen.get('hydrate-stamped')?.hydrate, true, 'a data-lt-ssr container must report ctx.hydrate === true');
        assert.equal(containers[3].getAttribute('data-lt-ssr-hydrated'), 'true', 'a consumed SSR stamp is marked hydrated');
        assert.equal(containers[1].hasAttribute('data-lt-ssr-hydrated'), false);
    });

    it('a failed mount drops the data-lt-ssr stamp so a retry mounts fresh instead of hydrating the error boundary', async () => {
        defineIsland('hydrate-stamped-failing', async () => ({
            default: () => { throw new Error('boom'); }
        }));
        const el = document.createElement('div');
        el.setAttribute('data-island', 'hydrate-stamped-failing');
        el.setAttribute('data-hydrate', 'load');
        el.setAttribute('data-lt-ssr', 'true');
        el.innerHTML = '<span>server-rendered</span>';
        document.body.appendChild(el);

        const originalError = console.error;
        console.error = () => {};
        try {
            hydrateIsland(el);
            await new Promise(r => setTimeout(r, 40));
        } finally {
            console.error = originalError;
        }

        assert.equal(el.hasAttribute('data-lt-ssr'), false);
    });

    it('ctx.sharedState reaches the same store across two islands, and set()/subscribe() sync them (ROADMAP.v5.md Part D)', async () => {
        let ctxA: IslandContext | null = null;
        let ctxB: IslandContext | null = null;

        defineIsland('shared-state-island-a', async () => ({
            default: (el, props, ctx) => { ctxA = ctx!; }
        }));
        defineIsland('shared-state-island-b', async () => ({
            default: (el, props, ctx) => { ctxB = ctx!; }
        }));

        const containerA = document.createElement('div');
        containerA.setAttribute('data-island', 'shared-state-island-a');
        containerA.setAttribute('data-hydrate', 'load');
        document.body.appendChild(containerA);

        const containerB = document.createElement('div');
        containerB.setAttribute('data-island', 'shared-state-island-b');
        containerB.setAttribute('data-hydrate', 'load');
        document.body.appendChild(containerB);

        hydrateIsland(containerA);
        hydrateIsland(containerB);

        await new Promise(r => setTimeout(r, 40));

        assert.equal(typeof ctxA?.sharedState, 'function', 'ctx.sharedState must be exposed');

        const storeA = ctxA!.sharedState!<number>('demo-counter', 0);
        const storeB = ctxB!.sharedState!<number>('demo-counter', 0);

        assert.equal(storeA, storeB, 'two islands requesting the same key must get the identical store instance');
        assert.equal(storeB.get(), 0, 'store B must see the initial value set by store A\'s first call');

        let observedFromB: number | undefined;
        storeB.subscribe((value) => { observedFromB = value; });

        storeA.set(5);

        assert.equal(observedFromB, 5, 'island B must observe island A\'s set() via subscribe()');
        assert.equal(storeB.get(), 5);
    });
});
