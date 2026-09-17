import '../setup.ts';
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { useTransition } from '../../src/composables/animation/useTransition.ts';

// `useTransition` had only incidental coverage before this pass (via
// tests/accessibility/reduced-motion.test.ts, which only exercises its reduced-motion collapse).
// `l-if`'s l-transition support (directives/conditional.ts) now depends on its exact contract -
// in particular that `enter()` is safe to call again mid-exit, and that `exit()`'s callback fires
// exactly once - so that contract gets its own direct suite here.

function wait(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

describe('useTransition Composable Suite (ROADMAP.v5.md Part I, l-if/l-for transitions)', () => {
    it('enter() is safely callable again before a prior exit()\'s callback has fired, and ends up visible', async () => {
        const el = document.createElement('div');
        document.body.appendChild(el);
        const { enter, exit } = useTransition(el, { duration: 30 });

        enter();
        await wait(80);
        assert.equal(el.style.opacity, '1', 'must be visible after the initial enter settles');

        let exitCbCalls = 0;
        exit(() => { exitCbCalls++; });

        // Re-enter immediately, well before exit's setTimeout(duration) would fire.
        assert.doesNotThrow(() => enter());

        await wait(80);
        assert.equal(el.style.opacity, '1', 'must end up visible after re-entering mid-exit');
        assert.equal(el.style.display, 'block', 'must not be left at exit\'s display:none');
    });

    it('exit(cb) invokes its callback exactly once, duration ms after being called', async () => {
        const el = document.createElement('div');
        document.body.appendChild(el);
        const { exit } = useTransition(el, { duration: 40 });

        let calls = 0;
        exit(() => { calls++; });

        await wait(10);
        assert.equal(calls, 0, 'must not fire before duration has elapsed');

        await wait(70);
        assert.equal(calls, 1, 'must fire exactly once once duration has elapsed');

        await wait(50);
        assert.equal(calls, 1, 'must not fire again afterward');
    });

    it('exit() with 0ms (reduced-motion-safe) duration applies hidden styles and fires its callback synchronously', () => {
        const originalMatchMedia = window.matchMedia;
        try {
            window.matchMedia = ((query: string) => ({
                matches: true,
                media: query
            })) as any;

            const el = document.createElement('div');
            document.body.appendChild(el);
            const { exit } = useTransition(el, { duration: 500 });

            let called = false;
            exit(() => { called = true; });

            assert.equal(called, true, 'reduced motion must collapse exit to a synchronous completion');
            assert.equal(el.style.display, 'none');
        } finally {
            window.matchMedia = originalMatchMedia;
        }
    });
});
