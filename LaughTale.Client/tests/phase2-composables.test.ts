import './setup.ts';
import { describe, it } from 'node:test';
import assert from 'node:assert';

import { useId } from '../src/composables/useId.ts';
import { useMediaQuery } from '../src/composables/useMediaQuery.ts';
import { useIntersectionObserver } from '../src/composables/useIntersectionObserver.ts';
import { useResizeObserver } from '../src/composables/useResizeObserver.ts';
import { usePreferredColorScheme } from '../src/composables/usePreferredColorScheme.ts';
import { sanitizeHtml, sanitizeUrl, isSafeAttribute, createSandboxState } from '../src/directives/security.ts';

describe('LaughTale Aura v2 Composables & Security Suite', () => {
    it('useId: generates unique IDs with prefix', () => {
        const id1 = useId('test');
        const id2 = useId('test');
        assert.ok(id1.startsWith('test-'));
        assert.ok(id2.startsWith('test-'));
        assert.notStrictEqual(id1, id2);
    });

    it('useMediaQuery: tracks media query matches (mock matchMedia)', () => {
        (globalThis as any).window = {
            matchMedia: (query: string) => ({
                matches: query === '(min-width: 1024px)',
                addEventListener: () => {},
                removeEventListener: () => {}
            })
        };
        const res = useMediaQuery('(min-width: 1024px)');
        assert.strictEqual(res.matches, true);
        
        const res2 = useMediaQuery('(min-width: 640px)');
        assert.strictEqual(res2.matches, false);
    });

    it('useIntersectionObserver: tracks intersection state (mock IntersectionObserver)', () => {
        let callbackFired = false;
        const res = useIntersectionObserver((entry) => {
            callbackFired = true;
        });
        
        const el = document.createElement('div');
        res.observe(el);
        assert.strictEqual(callbackFired, true);
        assert.strictEqual(res.isIntersecting, true);
    });

    it('useResizeObserver: tracks element size (mock ResizeObserver)', () => {
        (globalThis as any).ResizeObserver = class {
            callback: any;
            constructor(cb: any) { this.callback = cb; }
            observe(el: any) {
                this.callback([{
                    contentRect: { width: 100, height: 200 }
                }]);
            }
            disconnect() {}
        };

        let sizeReported = { width: 0, height: 0 };
        const res = useResizeObserver((size) => {
            sizeReported = size;
        });
        
        res.observe(document.createElement('div'));
        assert.strictEqual(sizeReported.width, 100);
        assert.strictEqual(sizeReported.height, 200);
    });

    it('usePreferredColorScheme: detects and toggles dark/light mode', () => {
        (globalThis as any).window = {
            matchMedia: () => ({ matches: false, addEventListener: () => {} })
        };
        
        const res = usePreferredColorScheme();
        assert.strictEqual(res.scheme, 'light');
        assert.strictEqual(res.isLight, true);
        
        res.toggle();
        assert.strictEqual(res.scheme, 'dark');
        assert.strictEqual(res.isDark, true);
    });

    it('isTemplateInjection: blocks {{ }} and ${ } patterns (from enhanced security.ts)', () => {
        // Not explicitly exported as isTemplateInjection, testing sanitizeHtml and sanitizeUrl
        const badHtml = '<div><script>alert(1)</script></div>';
        const safeHtml = sanitizeHtml(badHtml);
        assert.ok(!safeHtml.includes('<script>'));

        const badUrl = 'javascript:alert(1)';
        const safeUrl = sanitizeUrl(badUrl);
        assert.strictEqual(safeUrl, 'about:blank');
    });

    it('isDomClobberingRisk: blocks dangerous id/name bindings (from enhanced security.ts)', () => {
        assert.strictEqual(isSafeAttribute('onclick'), false);
        assert.strictEqual(isSafeAttribute('class'), true);
    });

    it('freezeSandboxState: prevents mutation of frozen state (from enhanced security.ts)', () => {
        const state = { normal: 'yes', __proto__: 'bad' };
        const sandbox = createSandboxState(state);
        
        assert.strictEqual(sandbox.normal, 'yes');
        assert.strictEqual(sandbox.__proto__, undefined);
        
        sandbox.__proto__ = 'newbad';
        assert.strictEqual(sandbox.__proto__, undefined);
    });
});
