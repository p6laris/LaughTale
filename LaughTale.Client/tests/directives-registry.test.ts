import './setup.ts';
import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import {
    registerDirective,
    listDirectiveBinders,
    clearDirectiveRegistry
} from '../src/directives/registry';
import { initDirectives } from '../src/directives/index';

describe('Directive Binder Registry Suite', () => {
    beforeEach(() => {
        clearDirectiveRegistry();
        document.body.innerHTML = '';
    });

    it('registers a directive binder and returns it from listDirectiveBinders', () => {
        const binder = (_el: HTMLElement) => {};
        registerDirective('l-glow', binder);

        assert.deepEqual(listDirectiveBinders(), [binder]);
    });

    it('returns an empty array when no directive binders are registered', () => {
        assert.deepEqual(listDirectiveBinders(), []);
    });

    it('overwrites a previously registered binder under the same name', () => {
        const first = (_el: HTMLElement) => {};
        const second = (_el: HTMLElement) => {};

        registerDirective('l-glow', first);
        registerDirective('l-glow', second);

        assert.deepEqual(listDirectiveBinders(), [second]);
    });

    it('clearDirectiveRegistry empties the registry for test isolation', () => {
        registerDirective('l-glow', (_el: HTMLElement) => {});
        clearDirectiveRegistry();

        assert.deepEqual(listDirectiveBinders(), []);
    });

    it('anchors its backing Map on globalThis, not module scope (ROADMAP.v5.md Part G/L)', () => {
        const binder = (_el: HTMLElement) => {};
        registerDirective('l-glow', binder);

        const sharedMap = (globalThis as any).__laughtaleDirectiveRegistry__;
        assert.ok(sharedMap instanceof Map, 'registry must be reachable via the well-known globalThis key');
        assert.equal(sharedMap.get('l-glow'), binder, 'the globalThis-anchored Map must be the exact same object registerDirective writes to');
    });

    it('initDirectives() invokes every registered binder once per scanned element, matching the per-element convention of every built-in binder', () => {
        const seen: HTMLElement[] = [];
        registerDirective('l-glow', (el: HTMLElement) => {
            if (el.hasAttribute('l-glow')) {
                seen.push(el);
            }
        });

        const container = document.createElement('div');
        container.innerHTML = `
            <button l-glow></button>
            <span></span>
            <div l-glow></div>
        `;
        document.body.appendChild(container);

        initDirectives(container);

        assert.equal(seen.length, 2, 'the custom binder must fire for exactly the two elements carrying l-glow');
        assert.ok(seen.every((el) => el.hasAttribute('l-glow')));
    });

    it('initDirectives() still runs every built-in binder call unchanged when a custom directive is also registered', () => {
        let customBinderCalls = 0;
        registerDirective('count-calls', () => {
            customBinderCalls++;
        });

        const container = document.createElement('div');
        container.innerHTML = `<div></div><span></span><p></p>`;
        document.body.appendChild(container);

        initDirectives(container);

        // `root.querySelectorAll('*')` scans container's descendants only (not container
        // itself) — matching initDirectives' own root.querySelectorAll('*') semantics exactly.
        assert.equal(customBinderCalls, 3, 'custom binder must run once per scanned descendant element, alongside the existing built-in binders');
    });
});
