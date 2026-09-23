import '../setup.ts';
import { describe, it, beforeEach, afterEach, mock } from 'node:test';
import assert from 'node:assert/strict';
import { useTransition } from '../../src/composables/animation/useTransition.ts';

// `useTransition` had only incidental coverage before this pass (via
// tests/accessibility/reduced-motion.test.ts, which only exercises its reduced-motion collapse).
// `l-if`'s l-transition support (directives/conditional.ts) now depends on its exact contract -
// in particular that `enter()` is safe to call again mid-exit, and that `exit()`'s callback fires
// exactly once - so that contract gets its own direct suite here.
//
// Time is mocked rather than waited on: enter() reaches its visible styles after two
// requestAnimationFrame hops (mocked as 16ms setTimeouts in tests/setup.ts), and these tests assert
// ordering against that chain and the `duration` timer. Real waits with fixed margins flaked on a
// loaded machine; mocked time makes the ordering exact.

// Advances mocked time 1ms at a time, because each rAF hop schedules the next timer from inside a
// timer callback - a single large tick() would stop short of it.
function advance(ms: number): void {
    for (let i = 0; i < ms; i++) mock.timers.tick(1);
}

describe('useTransition Composable Suite (ROADMAP.v5.md Part I, l-if/l-for transitions)', () => {
    beforeEach(() => mock.timers.enable({ apis: ['setTimeout'] }));
    afterEach(() => mock.timers.reset());

    it('enter() is safely callable again before a prior exit()\'s callback has fired, and ends up visible', () => {
        const el = document.createElement('div');
        document.body.appendChild(el);
        const { enter, exit } = useTransition(el, { duration: 30 });

        enter();
        advance(32); // two 16ms rAF hops
        assert.equal(el.style.opacity, '1', 'must be visible once the enter rAF chain completes');

        let exitCbCalls = 0;
        exit(() => { exitCbCalls++; });

        // Re-enter immediately, well before exit's setTimeout(duration) would fire.
        assert.doesNotThrow(() => enter());

        advance(200); // past exit's 30ms timer, the re-entry's rAF chain, and its duration timer
        assert.equal(el.style.opacity, '1', 'must end up visible after re-entering mid-exit');
        assert.equal(el.style.display, 'block', 'must not be left at exit\'s display:none');
        assert.equal(exitCbCalls, 0, 'the superseded exit\'s callback must never fire');
    });

    it('exit(cb) invokes its callback exactly once, duration ms after being called', () => {
        const el = document.createElement('div');
        document.body.appendChild(el);
        const { exit } = useTransition(el, { duration: 40 });

        let calls = 0;
        exit(() => { calls++; });

        advance(39);
        assert.equal(calls, 0, 'must not fire before duration has elapsed');

        advance(1);
        assert.equal(calls, 1, 'must fire exactly when duration elapses');

        advance(200);
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
