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

    it('ctx.hydrate reflects whether the container already had DOM content when hydration started (ROADMAP.v5.md Part D)', async () => {
        let emptyCtx: IslandContext | null = null;
        let seededCtx: IslandContext | null = null;

        defineIsland('hydrate-signal-empty', async () => ({
            default: (el, props, ctx) => { emptyCtx = ctx!; }
        }));
        defineIsland('hydrate-signal-seeded', async () => ({
            default: (el, props, ctx) => { seededCtx = ctx!; }
        }));

        const emptyContainer = document.createElement('div');
        emptyContainer.setAttribute('data-island', 'hydrate-signal-empty');
        emptyContainer.setAttribute('data-hydrate', 'load');
        document.body.appendChild(emptyContainer);

        const seededContainer = document.createElement('div');
        seededContainer.setAttribute('data-island', 'hydrate-signal-seeded');
        seededContainer.setAttribute('data-hydrate', 'load');
        seededContainer.innerHTML = '<span>server-rendered</span>';
        document.body.appendChild(seededContainer);

        hydrateIsland(emptyContainer);
        hydrateIsland(seededContainer);

        await new Promise(r => setTimeout(r, 40));

        assert.equal(emptyCtx?.hydrate, false, 'an empty container must report ctx.hydrate === false');
        assert.equal(seededCtx?.hydrate, true, 'a container seeded with markup must report ctx.hydrate === true');
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
