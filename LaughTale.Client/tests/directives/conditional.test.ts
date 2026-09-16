import '../setup.ts';
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { createReactiveScope } from '../../src/directives/reactivity.ts';
import { bindConditionalDirectives } from '../../src/directives/conditional.ts';
import { teardownDirectives } from '../../src/directives/lifecycle.ts';

describe('Conditional Rendering Directive Suite (l-if, ROADMAP.v5.md Part I)', () => {
    it('toggles the same DOM node identity in and out of the document, rather than recreating it', () => {
        const root = document.createElement('div');
        document.body.appendChild(root);
        const scope = createReactiveScope(root, { show: true });

        const el = document.createElement('div');
        el.setAttribute('l-if', 'show');
        el.setAttribute('data-marker', 'original');
        root.appendChild(el);

        bindConditionalDirectives(el);

        assert.equal(root.contains(el), true, 'truthy l-if must be in the DOM initially');

        scope.state.show = false;
        assert.equal(root.contains(el), false, 'falsy l-if must remove the element');
        assert.equal(root.querySelectorAll('[data-marker="original"]').length, 0);

        scope.state.show = true;
        assert.equal(root.contains(el), true, 'truthy again must reinsert');
        assert.equal(el.getAttribute('data-marker'), 'original', 'must be the exact same node, not a rebuilt clone');
        assert.equal(root.querySelectorAll('[data-marker="original"]').length, 1, 'exactly one instance must exist, not a duplicate');
    });

    it('re-inserts at the original position relative to sibling content', () => {
        const root = document.createElement('div');
        document.body.appendChild(root);
        const scope = createReactiveScope(root, { show: false });

        const before = document.createElement('span');
        before.textContent = 'before';
        const el = document.createElement('div');
        el.setAttribute('l-if', 'show');
        const after = document.createElement('span');
        after.textContent = 'after';

        root.appendChild(before);
        root.appendChild(el);
        root.appendChild(after);

        bindConditionalDirectives(el);
        assert.equal(root.contains(el), false, 'starts hidden');
        assert.deepEqual(Array.from(root.children).map(c => c.textContent), ['before', 'after']);

        scope.state.show = true;
        const order = Array.from(root.children);
        assert.equal(order.length, 3);
        assert.equal(order[0], before);
        assert.equal(order[1], el, 'must reappear between "before" and "after", its original position');
        assert.equal(order[2], after);
    });

    it('cleans up via teardownDirectives on the stable parent even while the element is currently hidden/detached', () => {
        const root = document.createElement('div');
        document.body.appendChild(root);
        const scope = createReactiveScope(root, { show: false });

        const el = document.createElement('div');
        el.setAttribute('l-if', 'show');
        root.appendChild(el);

        bindConditionalDirectives(el);
        assert.equal(root.contains(el), false, 'starts hidden - not discoverable via root.querySelectorAll');

        // teardownDirectives scans root.querySelectorAll('*'), which will NOT find
        // `el` while detached - this proves the effect still gets disposed via the
        // stable-parent registration.
        assert.doesNotThrow(() => teardownDirectives(root));

        scope.state.show = true;
        assert.equal(root.contains(el), false, 'a torn-down l-if effect must no longer react to state changes');
    });
});
