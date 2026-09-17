import '../setup.ts';
import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { patchList } from '../../src/runtime/list-patch.ts';

// Exercises `patchListAnimated` - patchList's 5-argument form - directly, bypassing directives/list.ts
// entirely. tests/runtime/list-patch.test.ts (the 4-argument, no-transition path) is left completely
// untouched by this pass; its 6 tests passing unmodified is itself the proof that omitting the 5th
// argument has zero behavioral difference from before.

interface Item {
    id: string;
    label: string;
}

function getKey(item: Item): string {
    return item.id;
}

function renderItem(item: Item): string {
    return `<span>${item.label}</span>`;
}

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

let stub: { calls: AnimateCall[]; restore: () => void } | null = null;

afterEach(() => {
    stub?.restore();
    stub = null;
});

describe('patchList Animated Path Suite (ROADMAP.v5.md Part I, l-transition)', () => {
    it('create: a newly-created key plays an enter animation', () => {
        stub = stubAnimate();
        const container = document.createElement('div');

        patchList(container, [{ id: 'a', label: 'Alpha' }], getKey, renderItem, { preset: 'fade' });

        assert.equal(container.children.length, 1);
        assert.equal(stub.calls.length, 1, 'enter must call animate() exactly once for the new node');
        assert.equal(stub.calls[0].el, container.children[0]);
        assert.deepEqual(stub.calls[0].frames, [{ opacity: 0 }, { opacity: 1 }]);
    });

    it('update: reused keys do not replay an enter animation', () => {
        stub = stubAnimate();
        const container = document.createElement('div');
        patchList(container, [{ id: 'a', label: 'Alpha' }], getKey, renderItem, { preset: 'fade' });
        stub.calls.length = 0;

        patchList(container, [{ id: 'a', label: 'Alpha Updated' }], getKey, renderItem, { preset: 'fade' });

        assert.equal(stub.calls.length, 0, 'an unchanged/updated key must not trigger animate()');
        assert.equal(container.querySelector('[data-key="a"]')!.innerHTML, '<span>Alpha Updated</span>');
    });

    it('remove: a departed key stays in the DOM until its stubbed exit animation finishes', async () => {
        stub = stubAnimate();
        const container = document.createElement('div');
        patchList(container, [{ id: 'a', label: 'Alpha' }, { id: 'b', label: 'Beta' }], getKey, renderItem, { preset: 'fade' });
        stub.calls.length = 0;

        patchList(container, [{ id: 'b', label: 'Beta' }], getKey, renderItem, { preset: 'fade' });

        assert.equal(container.children.length, 2, 'the exiting node must still be present synchronously');
        assert.equal(stub.calls.length, 1, 'exit must call animate() exactly once');
        const exitCall = stub.calls[0];
        assert.equal(exitCall.el.getAttribute('data-key'), 'a');

        exitCall.anim.finish();
        // Removal happens in the exit promise's `.then()` - a microtask away.
        await Promise.resolve();
        await Promise.resolve();

        assert.equal(container.children.length, 1, 'must be removed once the exit animation finishes');
        assert.equal(container.querySelector('[data-key="a"]'), null);
    });

    it('exit/re-add race: reappearing before the exit settles reuses the same node and leaves exactly one', async () => {
        stub = stubAnimate();
        const container = document.createElement('div');
        patchList(container, [{ id: 'a', label: 'Alpha' }], getKey, renderItem, { preset: 'fade' });

        const originalNodeA = container.querySelector('[data-key="a"]')!;
        stub.calls.length = 0;

        // Remove it...
        patchList(container, [], getKey, renderItem, { preset: 'fade' });
        assert.equal(container.children.length, 1, 'still mid-exit, synchronously present');
        const exitAnim = stub.calls[0].anim;

        // ...then immediately bring it back, before the exit animation has settled.
        patchList(container, [{ id: 'a', label: 'Alpha' }], getKey, renderItem, { preset: 'fade' });

        assert.equal(
            Array.from(container.children).filter(el => el.getAttribute('data-key') === 'a').length,
            1,
            'exactly one node for the reclaimed key, not a duplicate'
        );
        assert.equal(
            container.querySelector('[data-key="a"]'),
            originalNodeA,
            'the reclaimed node must be the exact same element by reference identity'
        );
        assert.equal(exitAnim.settled, true, 'the reclaim must actively cancel the in-flight exit animation, not just ignore it');

        // Give any pending microtasks a chance to run: the (now-cancelled) exit's .then() must not
        // remove the reused node.
        await Promise.resolve();
        await Promise.resolve();
        assert.equal(container.contains(originalNodeA), true, 'must not have been removed by the stale exit');
    });

    it('a departing key that shifts position during reconciliation gets only its exit animation, not a superfluous move animation too', () => {
        // Regression test: FLIP step 2 originally iterated over every previously-existing key,
        // including ones about to depart (usedKeys wasn't checked) - a departing node whose DOM
        // position happened to shift (e.g. because a survivor got insertBefore'd ahead of it, as
        // happens here) would get a spurious move `animate()` call on top of its own exit animation.
        // happy-dom's default `getBoundingClientRect` always returns a zeroed rect (no real layout),
        // which masked this in every other test in this suite - stub it here to reflect actual DOM
        // order, the same technique `tests/directives/list.test.ts` uses for its own move-animation test.
        const original = Element.prototype.getBoundingClientRect;
        Element.prototype.getBoundingClientRect = function (this: Element) {
            const parent = this.parentElement;
            const idx = parent ? Array.from(parent.children).indexOf(this) : -1;
            const top = idx < 0 ? 0 : idx * 40;
            return { left: 0, top, right: 0, bottom: top, width: 0, height: 0, x: 0, y: top, toJSON() { return this; } } as DOMRect;
        };
        try {
            stub = stubAnimate();
            const container = document.createElement('div');
            // 'a' first, 'b' second - removing 'a' while keeping 'b' forces the reconciliation loop
            // to insertBefore 'b' ahead of 'a', shifting 'a' from index 0 to index 1 before it's
            // registered as exiting.
            patchList(container, [{ id: 'a', label: 'Alpha' }, { id: 'b', label: 'Beta' }], getKey, renderItem, { preset: 'fade' });
            stub.calls.length = 0;

            patchList(container, [{ id: 'b', label: 'Beta' }], getKey, renderItem, { preset: 'fade' });

            // 'b' legitimately shifts from index 1 to index 0 once 'a' leaves, so it correctly earns
            // its own FLIP move animation - that call is expected, not the bug under test here.
            const callsForA = stub.calls.filter(c => c.el.getAttribute('data-key') === 'a');
            const callsForB = stub.calls.filter(c => c.el.getAttribute('data-key') === 'b');
            assert.equal(callsForA.length, 1, 'the departing node must get exactly one animate() call (its exit), not also a move animation');
            assert.deepEqual(callsForA[0].frames, [{ opacity: 1 }, { opacity: 0 }], 'must be the exit animation (reversed fade), not a move (translate) animation');
            assert.equal(callsForB.length, 1, 'the surviving node that actually changed position still gets its move animation');
            assert.ok('transform' in callsForB[0].frames[0], 'the survivor\'s call must be the move animation (translate), not an enter/exit');
        } finally {
            Element.prototype.getBoundingClientRect = original;
        }
    });

    it('no-stub smoke test: the animated path fully completes with zero thrown errors when WAAPI is genuinely absent', async () => {
        // Deliberately no stubAnimate() here - happy-dom (tests/setup.ts) does not implement
        // Element.prototype.animate at all, proving the real feature-detection fallback works end to end.
        const container = document.createElement('div');

        assert.doesNotThrow(() => {
            patchList(container, [{ id: 'a', label: 'Alpha' }, { id: 'b', label: 'Beta' }], getKey, renderItem, { preset: 'fade' });
        });
        assert.equal(container.children.length, 2);

        assert.doesNotThrow(() => {
            patchList(container, [{ id: 'b', label: 'Beta' }, { id: 'c', label: 'Gamma' }], getKey, renderItem, { preset: 'fade' });
        });

        // No animate() available -> playListTransition resolves immediately, so the removal's `.then()`
        // needs only a microtask to run, not a real timer.
        await Promise.resolve();
        await Promise.resolve();

        const keys = Array.from(container.children).map(el => el.getAttribute('data-key'));
        assert.deepEqual(keys, ['b', 'c'], 'reconciliation must still fully complete without WAAPI');
    });
});
