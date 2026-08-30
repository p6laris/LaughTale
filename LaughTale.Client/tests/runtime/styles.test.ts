import '../setup.ts';
import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import {
    injectIslandStyle,
    flushPendingStyles,
    removeIslandStyle,
    clearAllIslandStyles
} from '../../src/runtime/styles.ts';
import { setCspNonce } from '../../src/directives/csp.ts';

describe('Batched Island Styles & Adopted StyleSheets Suite (LT-703)', () => {
    beforeEach(() => {
        clearAllIslandStyles();
        document.head.innerHTML = '';
        setCspNonce('test-style-nonce-777');
    });

    it('injectIslandStyle queues and flushes styles into document head with CSP nonce', () => {
        injectIslandStyle('stepper', '.stepper { display: flex; }');
        flushPendingStyles();

        const styleEl = document.head.querySelector<HTMLStyleElement>('style[data-island-style="stepper"]');
        assert.ok(styleEl !== null);
        assert.equal(styleEl?.textContent, '.stepper { display: flex; }');
        assert.equal(styleEl?.getAttribute('nonce'), 'test-style-nonce-777');
    });

    it('deduplicates multiple injections for the same island', () => {
        injectIslandStyle('timeline', '.timeline { position: relative; }');
        injectIslandStyle('timeline', '.timeline { position: relative; }');
        flushPendingStyles();

        const styles = document.head.querySelectorAll('style[data-island-style="timeline"]');
        assert.equal(styles.length, 1);
    });

    it('removeIslandStyle cleanly purges island styles', () => {
        injectIslandStyle('drawer', '.drawer { position: fixed; }');
        flushPendingStyles();

        assert.ok(document.head.querySelector('style[data-island-style="drawer"]') !== null);

        removeIslandStyle('drawer');
        assert.equal(document.head.querySelector('style[data-island-style="drawer"]'), null);
    });

    it('flushes pending batch automatically via microtask', async () => {
        injectIslandStyle('badge', '.badge { padding: 2px 6px; }');

        // Let microtask run
        await Promise.resolve();

        const styleEl = document.head.querySelector<HTMLStyleElement>('style[data-island-style="badge"]');
        assert.ok(styleEl !== null);
        assert.equal(styleEl?.textContent, '.badge { padding: 2px 6px; }');
    });
    it('clearAllIslandStyles preserves foreign adopted stylesheets and only removes island sheets', () => {
        class MockCSSStyleSheet {
            cssText: string = '';
            replaceSync(css: string) { this.cssText = css; }
        }
        (globalThis as any).CSSStyleSheet = MockCSSStyleSheet;
        (document as any).adoptedStyleSheets = [];

        const foreignSheet = new MockCSSStyleSheet();
        foreignSheet.replaceSync('body { background: #000; }');
        document.adoptedStyleSheets = [foreignSheet as any];

        injectIslandStyle('mock-component', '.mock-component { color: blue; }');
        flushPendingStyles();

        assert.ok(document.adoptedStyleSheets.length >= 1);

        clearAllIslandStyles();

        // Foreign sheet MUST still be present in adoptedStyleSheets
        assert.ok(document.adoptedStyleSheets.includes(foreignSheet as any), 'Foreign stylesheet must survive clearAllIslandStyles');

        // Cleanup
        delete (globalThis as any).CSSStyleSheet;
        delete (document as any).adoptedStyleSheets;
    });
});

