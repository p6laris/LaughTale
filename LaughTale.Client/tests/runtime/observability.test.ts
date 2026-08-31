import '../setup.ts';
import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import {
    defineIsland,
    clearRegistry
} from '../../src/runtime/registry.ts';
import {
    hydrateIsland,
    setHydrationErrorHandler,
    getHydrationErrorHandler
} from '../../src/runtime/hydrator.ts';

describe('Client Hydration Observability & RUM Suite', () => {
    beforeEach(() => {
        clearRegistry();
        setHydrationErrorHandler(null);
        document.body.innerHTML = '';
    });

    it('setHydrationErrorHandler registers and returns custom telemetry error handler', () => {
        const handler = () => {};
        setHydrationErrorHandler(handler);
        assert.equal(getHydrationErrorHandler(), handler);
    });

    it('intercepts hydration failures and forwards error context to telemetry handler', async () => {
        defineIsland('failing-island', async () => {
            return {
                default: () => {
                    throw new Error('Component failed to mount!');
                }
            };
        });

        let capturedError: Error | null = null;
        let capturedContext: any = null;

        setHydrationErrorHandler((err, ctx) => {
            capturedError = err;
            capturedContext = ctx;
        });

        const container = document.createElement('div');
        container.setAttribute('data-island', 'failing-island');
        container.setAttribute('data-hydrate', 'load');
        document.body.appendChild(container);

        hydrateIsland(container);

        // Wait for async execution
        await new Promise(r => setTimeout(r, 50));

        assert.ok(capturedError !== null);
        assert.equal((capturedError as any)?.message, 'Component failed to mount!');
        assert.equal(capturedContext?.islandName, 'failing-island');
        assert.equal(capturedContext?.element, container);
    });

    it('emits performance mark during successful island hydration', async () => {
        defineIsland('perf-island', async () => {
            return {
                default: (el: HTMLElement) => {
                    el.textContent = 'Rendered';
                }
            };
        });

        const container = document.createElement('div');
        container.setAttribute('data-island', 'perf-island');
        container.setAttribute('data-hydrate', 'load');
        document.body.appendChild(container);

        hydrateIsland(container);

        await new Promise(r => setTimeout(r, 50));

        assert.equal(container.textContent, 'Rendered');
    });
});
