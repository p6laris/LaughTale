/**
 * SoftMax.LaughTale: Router Cross-Origin Security & Lifecycle Teardown Unit Tests (LT-107)
 */

import './setup.ts';
import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';

import { navigateTo } from '../src/runtime/router.ts';
import { setCspNonce } from '../src/directives/csp.ts';

describe('Router Cross-Origin Security & Lifecycle Teardown Suite (LT-107)', () => {

    beforeEach(() => {
        document.body.innerHTML = '';
        setCspNonce('test-router-nonce-888');
    });

    it('navigateTo: dispatches laughtale:unmount to unpersisted islands before updating DOM', async () => {
        let unmounted = false;

        const island = document.createElement('div');
        island.setAttribute('data-island', 'demo-widget');
        island.addEventListener('laughtale:unmount', () => {
            unmounted = true;
        });
        document.body.appendChild(island);

        // Mock global fetch to return a new page
        const originalFetch = globalThis.fetch;
        globalThis.fetch = (async () => {
            return {
                ok: true,
                url: window.location.href,
                text: async () => '<html><head><title>New Page</title></head><body><h1>Welcome</h1></body></html>'
            } as any;
        }) as any;

        try {
            await navigateTo('/next-page', false);
            assert.equal(unmounted, true, 'laughtale:unmount was not dispatched to unpersisted island');
            assert.equal(document.title, 'New Page');
        } finally {
            globalThis.fetch = originalFetch;
        }
    });

    it('navigateTo: preserves persistent island ([data-persist]) without dispatching unmount', async () => {
        let unmounted = false;

        const persistContainer = document.createElement('div');
        persistContainer.setAttribute('data-persist', 'global-audio');

        const island = document.createElement('div');
        island.setAttribute('data-island', 'audio-player');
        island.addEventListener('laughtale:unmount', () => {
            unmounted = true;
        });
        persistContainer.appendChild(island);
        document.body.appendChild(persistContainer);

        const originalFetch = globalThis.fetch;
        globalThis.fetch = (async () => {
            return {
                ok: true,
                url: window.location.href,
                text: async () => '<html><head><title>Next</title></head><body><div data-persist="global-audio"></div></body></html>'
            } as any;
        }) as any;

        try {
            await navigateTo('/player-next', false);
            assert.equal(unmounted, false, 'laughtale:unmount should NOT be dispatched for persistent elements');
            const restored = document.querySelector('[data-persist="global-audio"]');
            assert.ok(restored, 'Persistent container was not restored');
        } finally {
            globalThis.fetch = originalFetch;
        }
    });

    it('navigateTo: falls back to window.location.href when response redirects cross-origin', async () => {
        const originalFetch = globalThis.fetch;
        globalThis.fetch = (async () => {
            return {
                ok: true,
                url: 'https://evil-attacker.com/login',
                text: async () => '<html><body><h1>Injected</h1></body></html>'
            } as any;
        }) as any;

        let redirectedHref = '';
        const originalLocation = window.location;
        delete (window as any).location;
        (window as any).location = {
            href: 'https://mysite.com/dashboard',
            origin: 'https://mysite.com',
            pathname: '/dashboard',
            set: (val: string) => { redirectedHref = val; }
        };
        Object.defineProperty(window.location, 'href', {
            get: () => 'https://mysite.com/dashboard',
            set: (val: string) => { redirectedHref = val; }
        });

        try {
            await navigateTo('/redirect-test', false);
            assert.equal(redirectedHref, 'https://evil-attacker.com/login', 'Router did not redirect to external origin');
            assert.equal(document.body.innerHTML.includes('Injected'), false, 'Injected HTML was unexpectedly found in body');
        } finally {
            globalThis.fetch = originalFetch;
            (window as any).location = originalLocation;
        }
    });

});
