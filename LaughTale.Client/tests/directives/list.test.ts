import '../setup.ts';
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { createReactiveScope } from '../../src/directives/reactivity.ts';
import { bindListDirectives } from '../../src/directives/list.ts';
import { teardownDirectives } from '../../src/directives/lifecycle.ts';

describe('List Rendering Directive Suite (l-for, ROADMAP.v5.md Part I)', () => {
    it('reuses the same DOM node across re-renders for a persisting l-key, even when the array reorders', () => {
        const root = document.createElement('div');
        document.body.appendChild(root);
        const scope = createReactiveScope(root, {
            items: [{ id: 'a', label: 'Alpha' }, { id: 'b', label: 'Beta' }]
        });

        const template = document.createElement('div');
        template.setAttribute('l-for', 'item in items');
        template.setAttribute('l-key', 'item.id');
        const span = document.createElement('span');
        span.setAttribute('l-bind', 'item.label');
        template.appendChild(span);
        root.appendChild(template);

        bindListDirectives(template);

        const wrappersBefore = Array.from(root.querySelectorAll('[data-key]'));
        assert.equal(wrappersBefore.length, 2);
        const nodeForA = wrappersBefore.find(w => w.getAttribute('data-key') === 'a')!;
        assert.ok(nodeForA, 'a wrapper for key "a" must exist');
        assert.equal(nodeForA.querySelector('span')?.textContent, 'Alpha');

        // Reorder, insert a new item in front, and change "a"'s own label.
        scope.state.items = [
            { id: 'c', label: 'Charlie' },
            { id: 'a', label: 'Alpha Updated' },
            { id: 'b', label: 'Beta' }
        ];

        const wrappersAfter = Array.from(root.querySelectorAll('[data-key]'));
        assert.equal(wrappersAfter.length, 3);
        const nodeForAAfter = wrappersAfter.find(w => w.getAttribute('data-key') === 'a')!;
        assert.equal(nodeForAAfter, nodeForA, 'the wrapper for key "a" must be the exact same DOM node across re-renders, not a rebuilt clone');
        assert.equal(nodeForAAfter.querySelector('span')?.textContent, 'Alpha Updated', 'the reused node must still reflect the updated item value');

        const keyOrder = wrappersAfter.map(w => w.getAttribute('data-key'));
        assert.deepEqual(keyOrder, ['c', 'a', 'b'], 'DOM order must follow the new array order');
    });

    it('removes wrappers for keys no longer present', () => {
        const root = document.createElement('div');
        document.body.appendChild(root);
        const scope = createReactiveScope(root, {
            items: [{ id: 'a' }, { id: 'b' }, { id: 'c' }]
        });

        const template = document.createElement('div');
        template.setAttribute('l-for', 'item in items');
        template.setAttribute('l-key', 'item.id');
        root.appendChild(template);

        bindListDirectives(template);
        assert.equal(root.querySelectorAll('[data-key]').length, 3);

        scope.state.items = [{ id: 'a' }];
        const remaining = Array.from(root.querySelectorAll('[data-key]'));
        assert.equal(remaining.length, 1);
        assert.equal(remaining[0].getAttribute('data-key'), 'a');
    });

    it('binds nested l-bind against the current loop item and reacts to array replacement', () => {
        const root = document.createElement('div');
        document.body.appendChild(root);
        const scope = createReactiveScope(root, { items: ['x', 'y', 'z'] });

        const template = document.createElement('div');
        template.setAttribute('l-for', 'item in items');
        const span = document.createElement('span');
        span.setAttribute('l-bind', 'item');
        template.appendChild(span);
        root.appendChild(template);

        bindListDirectives(template);

        assert.deepEqual(Array.from(root.querySelectorAll('span')).map(s => s.textContent), ['x', 'y', 'z']);

        scope.state.items = ['p', 'q'];
        assert.deepEqual(Array.from(root.querySelectorAll('span')).map(s => s.textContent), ['p', 'q']);
    });

    it('index-keys by default when no l-key is present (documented limitation: this does not preserve identity across mid-array insertions)', () => {
        const root = document.createElement('div');
        document.body.appendChild(root);
        const scope = createReactiveScope(root, { items: ['a', 'b'] });

        const template = document.createElement('div');
        template.setAttribute('l-for', 'item in items');
        root.appendChild(template);

        bindListDirectives(template);
        const keysBefore = Array.from(root.querySelectorAll('[data-key]')).map(w => w.getAttribute('data-key'));
        assert.deepEqual(keysBefore, ['0', '1']);
    });

    it('cleans up the effect via teardownDirectives on the container anchor (template itself is permanently detached and undiscoverable by a DOM scan)', () => {
        const root = document.createElement('div');
        document.body.appendChild(root);
        const scope = createReactiveScope(root, { items: [{ id: 'a', label: 'Alpha' }] });

        const template = document.createElement('div');
        template.setAttribute('l-for', 'item in items');
        template.setAttribute('l-key', 'item.id');
        const span = document.createElement('span');
        span.setAttribute('l-bind', 'item.label');
        template.appendChild(span);
        root.appendChild(template);

        bindListDirectives(template);
        assert.equal(root.querySelector('span')?.textContent, 'Alpha');

        assert.doesNotThrow(() => teardownDirectives(root));

        scope.state.items = [{ id: 'a', label: 'Changed' }];
        assert.equal(root.querySelector('span')?.textContent, 'Alpha', 'a torn-down l-for effect must stop reacting to state changes');
    });
});
