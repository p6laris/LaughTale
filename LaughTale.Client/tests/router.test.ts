/**
 * LaughTale: Router Cross-Origin Security, Head Reconciliation, Concurrency, Scroll & Lifecycle Tests (LT-107, LT-202, LT-203, LT-204)
 */

import './setup.ts';
import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';

import { navigateTo, enableViewTransitions } from '../src/runtime/router.ts';
import { setCspNonce } from '../src/directives/csp.ts';

describe('Router Comprehensive Suite (LT-107, LT-202, LT-203, LT-204)', () => {

    beforeEach(() => {
        document.body.innerHTML = '';
        document.head.innerHTML = `
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta name="csp-nonce" content="test-router-nonce-888">
            <meta name="description" content="Initial Home Description">
            <meta property="og:title" content="Initial Home OG">
            <link rel="canonical" href="https://mysite.com/home">
            <link rel="stylesheet" href="/css/home.css">
        `;
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

        const currentOrigin = window.location.origin;
        assert.notEqual(currentOrigin, 'https://evil-attacker.com');

        try {
            await navigateTo('/redirect-test', false);
            assert.equal(document.body.innerHTML.includes('Injected'), false, 'Injected HTML was unexpectedly found in body');
        } finally {
            globalThis.fetch = originalFetch;
        }
    });

    it('navigateTo: reconciles <head> metadata, OpenGraph, canonical links, and route stylesheets (LT-202)', async () => {
        const originalFetch = globalThis.fetch;
        globalThis.fetch = (async () => {
            return {
                ok: true,
                url: window.location.href,
                text: async () => `
                    <html>
                    <head>
                        <title>About Us - SoftMax</title>
                        <meta name="description" content="Updated About Us Description">
                        <meta property="og:title" content="About Us OG Title">
                        <link rel="canonical" href="https://mysite.com/about">
                        <link rel="stylesheet" href="/css/about.css">
                    </head>
                    <body>
                        <h1>About Page</h1>
                    </body>
                    </html>
                `
            } as any;
        }) as any;

        try {
            await navigateTo('/about', false);

            assert.equal(document.title, 'About Us - SoftMax');

            const descMeta = document.querySelector('meta[name="description"]');
            assert.equal(descMeta?.getAttribute('content'), 'Updated About Us Description');

            const ogMeta = document.querySelector('meta[property="og:title"]');
            assert.equal(ogMeta?.getAttribute('content'), 'About Us OG Title');

            const canonicalLink = document.querySelector('link[rel="canonical"]');
            assert.equal(canonicalLink?.getAttribute('href'), 'https://mysite.com/about');

            const aboutCss = document.querySelector('link[href="/css/about.css"]');
            const homeCss = document.querySelector('link[href="/css/home.css"]');
            assert.ok(aboutCss, 'New stylesheet /css/about.css was not added to head');
            assert.equal(homeCss, null, 'Old stylesheet /css/home.css was not removed from head');

            const cspNonceMeta = document.querySelector('meta[name="csp-nonce"]');
            const viewportMeta = document.querySelector('meta[name="viewport"]');
            assert.ok(cspNonceMeta, 'CSP nonce meta was unexpectedly removed');
            assert.ok(viewportMeta, 'Viewport meta was unexpectedly removed');
        } finally {
            globalThis.fetch = originalFetch;
        }
    });

    it('navigateTo: cancels in-flight navigation when a newer navigation is triggered (LT-203)', async () => {
        let routeASignalAborted = false;

        const originalFetch = globalThis.fetch;
        globalThis.fetch = ((url: string, opts?: any) => {
            if (url.includes('/slow-route-a')) {
                const signal = opts?.signal;
                return new Promise((resolve, reject) => {
                    if (signal) {
                        signal.addEventListener('abort', () => {
                            routeASignalAborted = true;
                            const err = new Error('Aborted');
                            err.name = 'AbortError';
                            reject(err);
                        });
                    }
                    setTimeout(() => {
                        resolve({
                            ok: true,
                            url: window.location.href,
                            text: async () => '<html><head><title>Route A</title></head><body><h1>Route A Body</h1></body></html>'
                        } as any);
                    }, 80);
                });
            }

            return Promise.resolve({
                ok: true,
                url: window.location.href,
                text: async () => '<html><head><title>Route B</title></head><body><h1>Route B Body</h1></body></html>'
            } as any);
        }) as any;

        try {
            const navA = navigateTo('/slow-route-a', false);
            const navB = navigateTo('/fast-route-b', false);

            await Promise.all([navA, navB]);

            assert.equal(routeASignalAborted, true, 'Prior in-flight request was not aborted');
            assert.equal(document.title, 'Route B', 'DOM was overwritten by aborted Route A instead of Route B');
            assert.ok(document.body.innerHTML.includes('Route B Body'), 'Body does not contain Route B content');
        } finally {
            globalThis.fetch = originalFetch;
        }
    });

    it('navigateTo: preserves departure scroll in history and restores scroll position (LT-204)', async () => {
        let scrollToOptions: any = null;
        const originalScrollTo = window.scrollTo;
        window.scrollTo = ((opts: any) => {
            scrollToOptions = opts;
        }) as any;

        const originalFetch = globalThis.fetch;
        globalThis.fetch = (async () => {
            return {
                ok: true,
                url: window.location.href,
                text: async () => '<html><head><title>Restored Page</title></head><body><h1>Content</h1></body></html>'
            } as any;
        }) as any;

        try {
            Object.defineProperty(window, 'scrollX', { value: 0, configurable: true, writable: true });
            Object.defineProperty(window, 'scrollY', { value: 1250, configurable: true, writable: true });

            await navigateTo('/blog/post-1', true);
            assert.equal(window.history.state?.scrollY, 0);

            await navigateTo('/blog', false, { scrollX: 0, scrollY: 1250 });
            assert.deepEqual(scrollToOptions, { left: 0, top: 1250, behavior: 'instant' });
        } finally {
            globalThis.fetch = originalFetch;
            window.scrollTo = originalScrollTo;
        }
    });

    it('enableViewTransitions: sets history.scrollRestoration to manual (LT-204)', () => {
        enableViewTransitions();
        assert.equal(window.history.scrollRestoration, 'manual');
    });

});
