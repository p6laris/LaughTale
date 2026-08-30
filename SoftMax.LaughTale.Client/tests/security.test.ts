/**
 * SoftMax.LaughTale: Directive Security & Sandboxing Unit Tests (LT-103)
 */

import './setup.ts';
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import {
    sanitizeUrl,
    isSafeAttribute,
    isSafeProperty,
    sanitizeHtml
} from '../src/directives/security.ts';
import { evaluateExpression, createReactiveScope } from '../src/directives/reactivity.ts';

describe('SoftMax.LaughTale Directive Security & Sandboxing Suite', () => {

    it('sanitizeUrl: neutralizes javascript: and data:text/html protocol attacks', () => {
        assert.equal(sanitizeUrl('javascript:alert(1)'), 'about:blank');
        assert.equal(sanitizeUrl('  JAVASCRIPT:alert(document.cookie)  '), 'about:blank');
        assert.equal(sanitizeUrl('data:text/html,<script>alert(1)</script>'), 'about:blank');
        assert.equal(sanitizeUrl('https://softmax.dev/dashboard'), 'https://softmax.dev/dashboard');
        assert.equal(sanitizeUrl('/doc/01-getting-started'), '/doc/01-getting-started');
    });

    it('isSafeAttribute: blocks dangerous inline event attributes', () => {
        assert.equal(isSafeAttribute('onerror'), false);
        assert.equal(isSafeAttribute('onload'), false);
        assert.equal(isSafeAttribute('onclick'), false);
        assert.equal(isSafeAttribute('formaction'), false);
        assert.equal(isSafeAttribute('href'), true);
        assert.equal(isSafeAttribute('class'), true);
        assert.equal(isSafeAttribute('style'), true);
    });

    it('isSafeProperty: prevents prototype pollution and global access', () => {
        assert.equal(isSafeProperty('__proto__'), false);
        assert.equal(isSafeProperty('prototype'), false);
        assert.equal(isSafeProperty('constructor'), false);
        assert.equal(isSafeProperty('cookie'), false);
        assert.equal(isSafeProperty('window'), false);
        assert.equal(isSafeProperty('userCount'), true);
    });

    it('createSandboxState: blocks prototype pollution mutations on reactive state', () => {
        const container = document.createElement('div');
        const scope = createReactiveScope(container, { count: 1 });

        // Try prototype pollution
        (scope.state as any)['__proto__'] = { hacked: true };
        assert.equal((Object.prototype as any).hacked, undefined);

        // Evaluate expression sandboxing
        const res = evaluateExpression('count * 10', scope.state);
        assert.equal(res, 10);
    });

    it('sanitizeHtml: preserves legitimate rich-text formatting and safe media', () => {
        const safeInput = '<p>Hello <strong>World</strong>, visit <a href="https://softmax.dev" target="_blank">Docs</a> <img src="/img/icon.png" alt="Logo" width="24" height="24"></p>';
        const result = sanitizeHtml(safeInput);

        assert.ok(result.includes('<strong>World</strong>'));
        assert.ok(result.includes('href="https://softmax.dev"'));
        assert.ok(result.includes('rel="noopener noreferrer"'));
        assert.ok(result.includes('src="/img/icon.png"'));
        assert.ok(result.includes('alt="Logo"'));
    });

    it('sanitizeHtml: OWASP XSS Filter Evasion Suite (25+ vectors)', () => {
        let executionCount = 0;
        (globalThis as any).recordExploit = () => { executionCount++; };

        const owaspVectors: { name: string; payload: string }[] = [
            { name: 'Standard onerror', payload: '<img src="x" onerror="recordExploit()">' },
            { name: 'Unquoted slash onerror', payload: '<img/src=x/onerror=recordExploit()>' },
            { name: 'SVG onload', payload: '<svg onload="recordExploit()">' },
            { name: 'SVG nested script', payload: '<svg><script>recordExploit()</script></svg>' },
            { name: 'SVG animate onbegin', payload: '<svg><animate onbegin="recordExploit()">' },
            { name: 'Iframe javascript URI', payload: '<iframe src="javascript:recordExploit()"></iframe>' },
            { name: 'Object data javascript URI', payload: '<object data="javascript:recordExploit()"></object>' },
            { name: 'Embed src javascript URI', payload: '<embed src="javascript:recordExploit()">' },
            { name: 'Link javascript URI', payload: '<link rel="stylesheet" href="javascript:recordExploit()">' },
            { name: 'Meta refresh javascript URI', payload: '<meta http-equiv="refresh" content="0;url=javascript:recordExploit()">' },
            { name: 'Form action javascript URI', payload: '<form action="javascript:recordExploit()"><input type="submit"></form>' },
            { name: 'Anchor javascript URI', payload: '<a href="javascript:recordExploit()">Click</a>' },
            { name: 'Anchor mixed-case javascript URI', payload: '<a href="  JaVaScRiPt:recordExploit()">Click</a>' },
            { name: 'Anchor data text/html base64', payload: '<a href="data:text/html;base64,PHNjcmlwdD5yZWNvcmRFeHBsb2l0KCk8L3NjcmlwdD4=">Click</a>' },
            { name: 'Body onload', payload: '<body onload="recordExploit()">' },
            { name: 'Inline onmouseover', payload: '<b onmouseover="recordExploit()">Hover me</b>' },
            { name: 'Autofocus onfocus', payload: '<input autofocus onfocus="recordExploit()">' },
            { name: 'Details ontoggle', payload: '<details open ontoggle="recordExploit()">' },
            { name: 'Video error', payload: '<video><source onerror="recordExploit()"></video>' },
            { name: 'Audio onerror', payload: '<audio src="x" onerror="recordExploit()">' },
            { name: 'Script tag with external src', payload: '<script src="//evil.com/xss.js"></script>' },
            { name: 'Nested recursive script tag', payload: '<scr<script>ipt>recordExploit()</script>' },
            { name: 'Malformed broken tag', payload: '<<SCRIPT>recordExploit();//<</SCRIPT>' },
            { name: 'Script with CDATA', payload: '<script>/*<![CDATA[*/recordExploit()/*]]>*/</script>' },
            { name: 'Applet tag', payload: '<applet code="Exploit.class"></applet>' }
        ];

        for (const vec of owaspVectors) {
            const clean = sanitizeHtml(vec.payload);

            // Assert no script tags survive
            assert.equal(/<script\b/i.test(clean), false, `Script tag survived in ${vec.name}: ${clean}`);
            // Assert no inline event handlers survive
            assert.equal(/\bon\w+\s*=/i.test(clean), false, `Inline event handler survived in ${vec.name}: ${clean}`);
            // Assert no dangerous element types survive
            assert.equal(/<(iframe|object|embed|applet|meta|link|base|form)\b/i.test(clean), false, `Dangerous tag survived in ${vec.name}: ${clean}`);
            // Assert no javascript: URIs survive
            assert.equal(/javascript:/i.test(clean), false, `javascript: URI survived in ${vec.name}: ${clean}`);
        }

        // Assert zero exploits fired during parsing/sanitizing
        assert.equal(executionCount, 0, 'Exploit handler was executed during sanitization!');
    });

});
