import '../setup.ts';
import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { navigateTo } from '../../src/runtime/router.ts';
import { getAnnouncerElement, clearAnnouncements } from '../../src/accessibility/announcer.ts';
import { prefetchManager } from '../../src/router/prefetch.ts';

describe('Router Accessible Focus & Announcements Suite', () => {
    beforeEach(() => {
        prefetchManager.invalidate();
        clearAnnouncements();
        document.body.innerHTML = '';
        document.head.innerHTML = '';
    });

    it('navigateTo moves focus to destination h1 and announces page title', async () => {
        const originalFetch = globalThis.fetch;
        globalThis.fetch = (async () => {
            return {
                ok: true,
                url: 'http://localhost:5000/docs/overview',
                text: async () => `
                    <html>
                    <head><title>Overview Documentation</title></head>
                    <body>
                        <nav><a href="/home">Home</a></nav>
                        <main>
                            <h1>Overview Heading</h1>
                            <p>Content goes here.</p>
                        </main>
                    </body>
                    </html>
                `
            } as any;
        }) as any;

        try {
            await navigateTo('/docs/overview', false);

            const h1 = document.querySelector('h1');
            assert.ok(h1 !== null);
            assert.equal(h1?.getAttribute('tabindex'), '-1');

            // Wait for announcement debounce
            await new Promise(r => setTimeout(r, 70));

            const announcer = getAnnouncerElement('polite');
            assert.ok(announcer !== null);
            assert.equal(announcer?.textContent, 'Overview Documentation loaded');
        } finally {
            globalThis.fetch = originalFetch;
        }
    });
});
