/**
 * SoftMax.LaughTale: Directive Security & Sandboxing Unit Tests
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

    it('sanitizeHtml: strips malicious script tags and event handlers', () => {
        const dirty = '<div onclick="alert(1)">Hello <script>alert("xss")</script></div>';
        const clean = sanitizeHtml(dirty);

        assert.ok(!clean.includes('<script>'));
        assert.ok(!clean.includes('onclick'));
        assert.ok(clean.includes('Hello'));
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

});
