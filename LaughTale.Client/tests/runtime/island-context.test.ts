import '../setup.ts';
import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { defineIsland, clearRegistry, type IslandContext } from '../../src/runtime/registry.ts';
import { hydrateIsland } from '../../src/runtime/hydrator.ts';

describe('IslandContext & Lifecycle AbortSignal Suite', () => {
    beforeEach(() => {
        clearRegistry();
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
});
