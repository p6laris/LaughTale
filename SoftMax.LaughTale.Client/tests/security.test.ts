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

    describe('URL Sanitization 25-Form Matrix Suite (LT-106)', () => {

        const testMatrix = [
            // Safe Web & Communication Protocols
            { input: 'https://softmax.dev/api/v1', expected: 'https://softmax.dev/api/v1', desc: 'Standard HTTPS URL' },
            { input: 'http://example.com/home', expected: 'http://example.com/home', desc: 'Standard HTTP URL' },
            { input: 'mailto:support@softmax.dev', expected: 'mailto:support@softmax.dev', desc: 'Mailto protocol' },
            { input: 'tel:+1234567890', expected: 'tel:+1234567890', desc: 'Telephone protocol' },
            { input: 'blob:https://softmax.dev/550e8400-e29b-41d4-a716-446655440000', expected: 'blob:https://softmax.dev/550e8400-e29b-41d4-a716-446655440000', desc: 'Blob URL' },

            // Relative URLs & Anchors
            { input: '/dashboard/analytics', expected: '/dashboard/analytics', desc: 'Absolute root path' },
            { input: './components/button', expected: './components/button', desc: 'Current directory relative path' },
            { input: '../images/logo.png', expected: '../images/logo.png', desc: 'Parent directory relative path' },
            { input: '#section-overview', expected: '#section-overview', desc: 'Anchor fragment' },
            { input: '?tab=profile&view=compact', expected: '?tab=profile&view=compact', desc: 'Query string' },

            // Legitimate Raster Image Data URIs
            {
                input: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
                expected: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
                desc: 'Base64 PNG image data URI'
            },
            {
                input: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////wgALCAABAAEBAREA/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPxA=',
                expected: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////wgALCAABAAEBAREA/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPxA=',
                desc: 'Base64 JPEG image data URI'
            },
            {
                input: 'data:image/webp;base64,UklGRkAAAABXRUJQVlA4IDQAAADwAQCdASoBAAEAAQAcJaACdLoB+AA=',
                expected: 'data:image/webp;base64,UklGRkAAAABXRUJQVlA4IDQAAADwAQCdASoBAAEAAQAcJaACdLoB+AA=',
                desc: 'Base64 WebP image data URI'
            },
            {
                input: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
                expected: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
                desc: 'Base64 GIF image data URI'
            },

            // Malicious & Obfuscated Script Protocols (Blocked to about:blank)
            { input: 'javascript:alert(1)', expected: 'about:blank', desc: 'Direct javascript URI' },
            { input: '  JaVaScRiPt:alert(document.cookie)', expected: 'about:blank', desc: 'Mixed-case javascript URI with whitespace' },
            { input: 'jav\x00ascript:alert(1)', expected: 'about:blank', desc: 'Null-byte injected javascript URI' },
            { input: 'jav\x01ascript:alert(1)', expected: 'about:blank', desc: 'Control char 0x01 injected javascript URI' },
            { input: 'jav\x09ascript:alert(1)', expected: 'about:blank', desc: 'Tab injected javascript URI' },
            { input: 'jav\x0Dascript:alert(1)', expected: 'about:blank', desc: 'CR injected javascript URI' },
            { input: 'jav\x0Aascript:alert(1)', expected: 'about:blank', desc: 'LF injected javascript URI' },
            { input: 'vbscript:msgbox(1)', expected: 'about:blank', desc: 'VBScript protocol' },
            { input: 'data:text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg==', expected: 'about:blank', desc: 'HTML data URI base64' },
            { input: 'data:text/html,<script>alert(1)</script>', expected: 'about:blank', desc: 'HTML data URI raw script' },
            { input: 'data:application/javascript;base64,YWxlcnQoMSk=', expected: 'about:blank', desc: 'JavaScript data URI' },
            { input: 'file:///etc/passwd', expected: 'about:blank', desc: 'File scheme' },

            // Null, undefined, empty
            { input: '', expected: '', desc: 'Empty string' },
            { input: null, expected: '', desc: 'Null input' },
            { input: undefined, expected: '', desc: 'Undefined input' }
        ];

        for (const test of testMatrix) {
            it(`sanitizeUrl: correctly handles [${test.desc}]`, () => {
                const actual = sanitizeUrl(test.input);
                assert.equal(actual, test.expected, `Failed for "${test.input}" (${test.desc})`);
            });
        }

    });

});
