import '../setup.ts';
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { createReactiveScope, bindElementReactivity } from '../../src/directives/reactivity.ts';
import { teardownDirectives } from '../../src/directives/lifecycle.ts';
import { effect } from '../../src/runtime/signals.ts';

describe('Reactivity Engine Suite (ROADMAP.v5.md Part I - signal-backed retrofit)', () => {
    it('fine-grained: an effect reading only state.b does not re-run when state.a changes (regression: the old Proxy set trap broadcast to every listener on every key write)', () => {
        const container = document.createElement('div');
        const scope = createReactiveScope(container, { a: 1, b: 'x' });

        let aRuns = 0;
        let bRuns = 0;
        effect(() => { scope.state.a; aRuns++; });
        effect(() => { scope.state.b; bRuns++; });

        assert.equal(aRuns, 1);
        assert.equal(bRuns, 1);

        scope.state.a = 2;
        assert.equal(aRuns, 2, 'effect reading a must re-run when a changes');
        assert.equal(bRuns, 1, 'effect reading only b must NOT re-run when a changes');

        scope.state.b = 'y';
        assert.equal(bRuns, 2, 'effect reading b must re-run when b changes');
        assert.equal(aRuns, 2, 'effect reading only a must NOT re-run when b changes');
    });

    it('l-bind-in-a-shared-scope: writing property "a" does not re-run an l-bind effect bound only to property "b"', () => {
        const container = document.createElement('div');
        const scope = createReactiveScope(container, { a: 1, b: 'initial' });

        const elA = document.createElement('span');
        elA.setAttribute('l-bind', 'a');
        const elB = document.createElement('span');
        elB.setAttribute('l-bind', 'b');

        // Instrument elB's textContent to count how many times l-bind's effect
        // actually writes to it, shadowing the prototype accessor for this
        // instance only.
        let bWrites = 0;
        let bBacking = '';
        Object.defineProperty(elB, 'textContent', {
            configurable: true,
            get() { return bBacking; },
            set(v: string) { bBacking = v; bWrites++; }
        });

        bindElementReactivity(elA, scope);
        bindElementReactivity(elB, scope);

        assert.equal(elA.textContent, '1');
        assert.equal(bBacking, 'initial');
        assert.equal(bWrites, 1, 'initial bind run');

        scope.state.a = 2;
        assert.equal(elA.textContent, '2');
        assert.equal(bWrites, 1, 'l-bind bound only to "b" must not re-run when "a" changes');

        scope.state.b = 'changed';
        assert.equal(bWrites, 2);
        assert.equal(elA.textContent, '2', 'l-bind bound only to "a" must not change when "b" changes');
    });

    it('the coarse scope.listeners broadcast still fires on every key write (kept intentionally for storage.ts l-persist)', () => {
        const container = document.createElement('div');
        const scope = createReactiveScope(container, { a: 1, b: 2 });

        let broadcastRuns = 0;
        scope.listeners.add(() => { broadcastRuns++; });

        scope.state.a = 2;
        scope.state.b = 3;
        assert.equal(broadcastRuns, 2, 'listeners must still fire on every individual key write, unlike the fine-grained signals');
    });

    it('registers the l-bind effect dispose via registerDirectiveCleanup, so teardownDirectives stops future updates', () => {
        const container = document.createElement('div');
        document.body.appendChild(container);
        const scope = createReactiveScope(container, { a: 1 });

        const el = document.createElement('span');
        el.setAttribute('l-bind', 'a');
        container.appendChild(el);

        bindElementReactivity(el, scope);
        assert.equal(el.textContent, '1');

        teardownDirectives(container);

        scope.state.a = 99;
        assert.equal(el.textContent, '1', 'a torn-down l-bind effect must not keep updating the DOM');
    });
});
