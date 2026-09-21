import '../setup.ts';
import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import {
    PrefetchManager,
    prefetchManager
} from '../../src/router/prefetch.ts';
import { defineIsland, clearRegistry } from '../../src/runtime/registry.ts';
import { clearChunkPrefetchState } from '../../src/router/chunk-prefetch.ts';

describe('Router Predictive Prefetching Suite', () => {
    beforeEach(() => {
        prefetchManager.invalidate();
    });

    it('normalizes URL paths correctly', () => {
        const mgr = new PrefetchManager();
        assert.equal(mgr.normalizeUrl('/docs/getting-started?tab=1'), '/docs/getting-started?tab=1');
    });

    it('stores and retrieves cached HTML payloads within TTL', () => {
        const mgr = new PrefetchManager({ ttlMs: 5000 });
        mgr.setCachedResponse('/page-a', '<html><body>Page A</body></html>');

        assert.equal(mgr.has('/page-a'), true);
        assert.equal(mgr.getCachedResponse('/page-a'), '<html><body>Page A</body></html>');
    });

    it('purges expired cache entries', async () => {
        const mgr = new PrefetchManager({ ttlMs: 10 }); // 10ms TTL
        mgr.setCachedResponse('/page-b', '<html><body>Page B</body></html>');

        assert.equal(mgr.has('/page-b'), true);
        await new Promise(r => setTimeout(r, 25));

        assert.equal(mgr.has('/page-b'), false);
        assert.equal(mgr.getCachedResponse('/page-b'), null);
    });

    it('invalidates specific or all cached routes on demand', () => {
        const mgr = new PrefetchManager();
        mgr.setCachedResponse('/item-1', 'HTML 1');
        mgr.setCachedResponse('/item-2', 'HTML 2');

        mgr.invalidate('/item-1');
        assert.equal(mgr.has('/item-1'), false);
        assert.equal(mgr.has('/item-2'), true);

        mgr.invalidate();
        assert.equal(mgr.has('/item-2'), false);
    });

    it('attaches hover listener with intent debounce delay', async () => {
        const mgr = new PrefetchManager({ intentDelayMs: 20 });
        const anchor = document.createElement('a');
        anchor.setAttribute('href', '/target-route');
        document.body.appendChild(anchor);

        let prefetched = false;
        mgr.prefetch = async (url: string) => {
            if (url === '/target-route') prefetched = true;
            return 'Prefetched HTML';
        };

        const cleanup = mgr.attachHoverListener(anchor);

        // Dispatch mouseenter
        anchor.dispatchEvent(new Event('mouseenter'));

        // Before intent delay
        assert.equal(prefetched, false);

        // After intent delay
        await new Promise(r => setTimeout(r, 35));
        assert.equal(prefetched, true);

        cleanup();
        anchor.remove();
    });

    it('warms an island chunk discovered in a speculatively-fetched page\'s HTML (ROADMAP.v5.md Part B)', async () => {
        clearRegistry();
        clearChunkPrefetchState();

        let loaderCalls = 0;
        defineIsland('destination-widget', () => {
            loaderCalls++;
            return Promise.resolve({ default: () => {} });
        });

        const originalFetch = globalThis.fetch;
        (globalThis as any).fetch = async () => ({
            ok: true,
            text: async () => '<div data-island="destination-widget" data-props="{}"></div>'
        });

        try {
            const mgr = new PrefetchManager();
            await mgr.prefetch('/destination-page');

            assert.equal(loaderCalls, 1, 'The destination page\'s island loader must be called once to warm its chunk');
        } finally {
            globalThis.fetch = originalFetch;
            clearRegistry();
            clearChunkPrefetchState();
        }
    });
});
