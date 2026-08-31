import '../setup.ts';
import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import {
    PrefetchManager,
    prefetchManager
} from '../../src/router/prefetch.ts';

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
});
