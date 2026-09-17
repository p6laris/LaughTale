import '../setup.ts';
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { createReactiveScope } from '../../src/directives/reactivity.ts';
import { bindConditionalDirectives } from '../../src/directives/conditional.ts';
import { teardownDirectives } from '../../src/directives/lifecycle.ts';

function wait(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

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

    describe('l-transition (ROADMAP.v5.md Part I, deferred transitions)', () => {
        it('an animated toggle only actually removes the element once its exit duration elapses', async () => {
            const root = document.createElement('div');
            document.body.appendChild(root);
            const scope = createReactiveScope(root, { show: true });

            const el = document.createElement('div');
            el.setAttribute('l-if', 'show');
            el.setAttribute('l-transition', 'fade:30');
            root.appendChild(el);

            bindConditionalDirectives(el);
            assert.equal(root.contains(el), true);

            scope.state.show = false;
            assert.equal(root.contains(el), true, 'must not remove synchronously once a transition is active');

            await wait(10);
            assert.equal(root.contains(el), true, 'must still be present before the exit duration elapses');

            await wait(50);
            assert.equal(root.contains(el), false, 'must be removed once the exit duration elapses');
        });

        it('rapid true -> false -> true toggling during a pending exit leaves the element visible and never calls remove()', async () => {
            const root = document.createElement('div');
            document.body.appendChild(root);
            const scope = createReactiveScope(root, { show: true });

            const el = document.createElement('div');
            el.setAttribute('l-if', 'show');
            el.setAttribute('l-transition', 'fade:30');
            root.appendChild(el);

            bindConditionalDirectives(el);

            let removeCalled = false;
            const originalRemove = el.remove.bind(el);
            el.remove = () => {
                removeCalled = true;
                originalRemove();
            };

            scope.state.show = false; // starts an exit animation
            scope.state.show = true; // flips back before that exit's callback fires

            await wait(80); // well past the original exit's duration

            assert.equal(removeCalled, false, 'a stale exit callback must never remove a since-re-shown element');
            assert.equal(root.contains(el), true, 'element must remain in the DOM');
            assert.equal(el.style.opacity, '1', 'must be visually restored to visible, not stuck at the exit-hidden style');
        });

        it('reduced motion collapses an animated toggle to synchronous, instant insert/remove', () => {
            const originalMatchMedia = window.matchMedia;
            try {
                window.matchMedia = ((query: string) => ({
                    matches: true,
                    media: query
                })) as any;

                const root = document.createElement('div');
                document.body.appendChild(root);
                const scope = createReactiveScope(root, { show: true });

                const el = document.createElement('div');
                el.setAttribute('l-if', 'show');
                el.setAttribute('l-transition', 'fade:500');
                root.appendChild(el);

                bindConditionalDirectives(el);
                assert.equal(root.contains(el), true);

                scope.state.show = false;
                assert.equal(root.contains(el), false, 'reduced motion must remove synchronously, with no animation delay');

                scope.state.show = true;
                assert.equal(root.contains(el), true, 'reduced motion must re-insert synchronously too');
            } finally {
                window.matchMedia = originalMatchMedia;
            }
        });
    });
});
