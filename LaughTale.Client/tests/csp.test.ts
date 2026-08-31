/**
 * LaughTale: CSP Nonce Discovery & Style Stamping Unit Tests
 */

import './setup.ts';
import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';

import {
    getCspNonce,
    setCspNonce,
    applyNonceToStyle,
    applyNonceToScript
} from '../src/directives/csp.ts';
import { injectIslandStyle, removeIslandStyle } from '../src/runtime/styles.ts';

describe('Content Security Policy (CSP) Nonce Discovery & Style Stamping Suite', () => {

    beforeEach(() => {
        setCspNonce(null);
        document.head.innerHTML = '';
        document.body.innerHTML = '';
        delete (window as any).__LAUGHTALE_NONCE__;
    });

    it('getCspNonce: discovers nonce from <meta name="csp-nonce">', () => {
        const meta = document.createElement('meta');
        meta.setAttribute('name', 'csp-nonce');
        meta.setAttribute('content', 'meta-test-nonce-12345');
        document.head.appendChild(meta);

        assert.equal(getCspNonce(), 'meta-test-nonce-12345');
    });

    it('getCspNonce: discovers nonce from window.__LAUGHTALE_NONCE__', () => {
        (window as any).__LAUGHTALE_NONCE__ = 'global-test-nonce-67890';
        assert.equal(getCspNonce(), 'global-test-nonce-67890');
    });

    it('getCspNonce: discovers nonce from <script nonce="..."> element', () => {
        const script = document.createElement('script');
        script.setAttribute('nonce', 'script-tag-nonce-abcde');
        document.head.appendChild(script);

        assert.equal(getCspNonce(), 'script-tag-nonce-abcde');
    });

    it('applyNonceToStyle: stamps active nonce attribute onto <style> tag', () => {
        setCspNonce('active-style-nonce-xyz');
        const style = document.createElement('style');
        applyNonceToStyle(style);

        assert.equal(style.getAttribute('nonce'), 'active-style-nonce-xyz');
    });

    it('applyNonceToScript: stamps active nonce attribute onto <script> tag', () => {
        setCspNonce('active-script-nonce-111');
        const script = document.createElement('script');
        applyNonceToScript(script);

        assert.equal(script.getAttribute('nonce'), 'active-script-nonce-111');
    });

    it('injectIslandStyle: automatically attaches CSP nonce to dynamically injected stylesheets', () => {
        const islandName = 'test-csp-button';
        removeIslandStyle(islandName);

        setCspNonce('injected-sheet-nonce-999');
        injectIslandStyle(islandName, '.p-button { background: purple; }');

        const injected = document.querySelector(`style[data-island-style="${islandName}"]`);
        assert.ok(injected, 'Stylesheet was not injected into DOM');
        assert.equal(injected.getAttribute('nonce'), 'injected-sheet-nonce-999');
    });

});
