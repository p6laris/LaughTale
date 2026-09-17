import '../setup.ts';
import { describe, it, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { createReactiveScope } from '../../src/directives/reactivity.ts';
import { bindListDirectives } from '../../src/directives/list.ts';
import { teardownDirectives } from '../../src/directives/lifecycle.ts';

/** A controllable stand-in for a real WAAPI `Animation`, driven manually by tests. */
class FakeAnimation {
    onfinish: (() => void) | null = null;
    oncancel: (() => void) | null = null;
    private _settled = false;
    get settled(): boolean { return this._settled; }
    finish(): void {
        if (this._settled) return;
        this._settled = true;
        this.onfinish?.();
    }
    cancel(): void {
        if (this._settled) return;
        this._settled = true;
        this.oncancel?.();
    }
}

interface AnimateCall {
    el: Element;
    frames: Keyframe[];
    options: KeyframeAnimationOptions;
    anim: FakeAnimation;
}

/** Installs a WAAPI stub on `Element.prototype` for the duration of a test, recording every call. */
function stubAnimate(): { calls: AnimateCall[]; restore: () => void } {
    const proto = Element.prototype as unknown as {
        animate?: (frames: Keyframe[], options: KeyframeAnimationOptions) => FakeAnimation;
        getAnimations?: () => FakeAnimation[];
    };
    const originalAnimate = proto.animate;
    const originalGetAnimations = proto.getAnimations;
    const calls: AnimateCall[] = [];
    const animationsByEl = new WeakMap<Element, FakeAnimation[]>();

    proto.animate = function (this: Element, frames: Keyframe[], options: KeyframeAnimationOptions) {
        const anim = new FakeAnimation();
        const list = animationsByEl.get(this) ?? [];
        list.push(anim);
        animationsByEl.set(this, list);
        calls.push({ el: this, frames, options, anim });
        return anim;
    };
    proto.getAnimations = function (this: Element) {
        return animationsByEl.get(this) ?? [];
    };

    return {
        calls,
        restore: () => {
            proto.animate = originalAnimate;
            proto.getAnimations = originalGetAnimations;
        }
    };
}

/** Stubs `getBoundingClientRect` to reflect actual DOM order (each child's top = its index * 40px),
 *  since happy-dom never computes real layout (it always reports a zeroed rect). Reading it live from
 *  DOM position means a node's "before" and "after" rects (recorded by patchList's FLIP step,
 *  before and after this call's reordering respectively) naturally differ exactly when the node's
 *  DOM position actually changed - a lightweight stand-in for a real layout engine. */
function stubIndexBasedRects(): () => void {
    const original = Element.prototype.getBoundingClientRect;
    Element.prototype.getBoundingClientRect = function (this: Element) {
        const parent = this.parentElement;
        const idx = parent ? Array.from(parent.children).indexOf(this) : -1;
        if (idx < 0) return original.call(this);
        const top = idx * 40;
        return {
            left: 0, top, right: 0, bottom: top,
            width: 0, height: 0, x: 0, y: top,
            toJSON() { return this; }
        } as DOMRect;
    };
    return () => { Element.prototype.getBoundingClientRect = original; };
}

let stub: { calls: AnimateCall[]; restore: () => void } | null = null;
let restoreRects: (() => void) | null = null;

afterEach(() => {
    stub?.restore();
    stub = null;
    restoreRects?.();
    restoreRects = null;
});

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

    describe('l-transition (ROADMAP.v5.md Part I, deferred transitions)', () => {
        function makeTemplate(preset = 'fade'): { root: HTMLElement; template: HTMLDivElement } {
            const root = document.createElement('div');
            document.body.appendChild(root);
            const template = document.createElement('div');
            template.setAttribute('l-for', 'item in items');
            template.setAttribute('l-key', 'item.id');
            template.setAttribute('l-transition', preset);
            root.appendChild(template);
            return { root, template };
        }

        it('a newly-added item plays an enter animation with the fade preset\'s starting keyframe', () => {
            stub = stubAnimate();
            const { root, template } = makeTemplate('fade');
            const scope = createReactiveScope(root, { items: [{ id: 'a', label: 'Alpha' }] });

            bindListDirectives(template);
            assert.equal(stub.calls.length, 1, 'the initial render\'s item must play an enter animation');

            scope.state.items = [{ id: 'a', label: 'Alpha' }, { id: 'b', label: 'Beta' }];

            assert.equal(stub.calls.length, 2, 'the newly-added item must play its own enter animation');
            const enterCall = stub.calls[1];
            assert.equal(enterCall.el.getAttribute('data-key'), 'b');
            assert.deepEqual(enterCall.frames, [{ opacity: 0 }, { opacity: 1 }]);
        });

        it('reordering invokes a move animation only for nodes whose position actually changed', () => {
            stub = stubAnimate();
            restoreRects = stubIndexBasedRects();
            const { root, template } = makeTemplate('fade');
            const scope = createReactiveScope(root, {
                items: [{ id: 'a', label: 'Alpha' }, { id: 'b', label: 'Beta' }, { id: 'c', label: 'Gamma' }]
            });
            bindListDirectives(template);
            stub.calls.length = 0;

            // 'a' stays first (index 0 -> 0, no move); 'b' and 'c' swap places (both move).
            scope.state.items = [
                { id: 'a', label: 'Alpha' },
                { id: 'c', label: 'Gamma' },
                { id: 'b', label: 'Beta' }
            ];

            const movedKeys = new Set(
                stub.calls.map(c => c.el.getAttribute('data-key')).filter((k): k is string => k !== null)
            );
            assert.deepEqual(movedKeys, new Set(['b', 'c']), 'only the two reordered nodes should get a move animation');
        });

        it('a removed item\'s wrapper stays in the DOM until the stubbed animation\'s onfinish fires', async () => {
            stub = stubAnimate();
            const { root, template } = makeTemplate('fade');
            const scope = createReactiveScope(root, {
                items: [{ id: 'a', label: 'Alpha' }, { id: 'b', label: 'Beta' }]
            });
            bindListDirectives(template);
            stub.calls.length = 0;

            scope.state.items = [{ id: 'b', label: 'Beta' }];

            const wrapperA = root.querySelector('[data-key="a"]');
            assert.ok(wrapperA, 'the departed key\'s wrapper must still be in the DOM synchronously');
            assert.equal(stub.calls.length, 1, 'exit must call animate() exactly once');

            stub.calls[0].anim.finish();
            await Promise.resolve();
            await Promise.resolve();

            assert.equal(root.querySelector('[data-key="a"]'), null, 'must be removed once the exit animation finishes');
        });

        it('exit-then-immediate-re-add of the same key produces exactly one node, reusing the original element', () => {
            stub = stubAnimate();
            const { root, template } = makeTemplate('fade');
            const scope = createReactiveScope(root, { items: [{ id: 'a', label: 'Alpha' }] });
            bindListDirectives(template);

            const originalNode = root.querySelector('[data-key="a"]');
            assert.ok(originalNode);

            scope.state.items = []; // starts exit
            scope.state.items = [{ id: 'a', label: 'Alpha' }]; // re-added before exit settles

            const nodesForA = Array.from(root.querySelectorAll('[data-key="a"]'));
            assert.equal(nodesForA.length, 1, 'exactly one node for the reclaimed key');
            assert.equal(nodesForA[0], originalNode, 'must reuse the original element by reference identity');
        });

        it('reduced motion completes enter/exit with zero animate() calls', async () => {
            const originalMatchMedia = window.matchMedia;
            try {
                window.matchMedia = ((query: string) => ({
                    matches: true,
                    media: query
                })) as any;
                stub = stubAnimate();

                const { root, template } = makeTemplate('fade');
                const scope = createReactiveScope(root, { items: [{ id: 'a', label: 'Alpha' }] });
                bindListDirectives(template);

                scope.state.items = [{ id: 'a', label: 'Alpha' }, { id: 'b', label: 'Beta' }];
                scope.state.items = [{ id: 'b', label: 'Beta' }];

                // A 0ms (reduced-motion-clamped) duration still resolves the exit's promise
                // asynchronously (a microtask), not synchronously - give it a turn to settle.
                await Promise.resolve();
                await Promise.resolve();

                assert.equal(stub.calls.length, 0, 'reduced motion must short-circuit before any animate() call');
                assert.equal(root.querySelector('[data-key="a"]'), null, 'removal must complete once the microtask settles');
                assert.ok(root.querySelector('[data-key="b"]'));
            } finally {
                window.matchMedia = originalMatchMedia;
            }
        });
    });
});
