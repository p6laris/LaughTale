import '../setup.ts';
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { signal, computed, effect, batch } from '../../src/runtime/signals.ts';

describe('Fine-Grained Reactivity Suite (ROADMAP.v5.md Part I)', () => {
    describe('signal', () => {
        it('get/set/peek/update behave correctly', () => {
            const count = signal(1);

            assert.equal(count(), 1);
            count.set(2);
            assert.equal(count(), 2);
            count.update((prev) => prev + 10);
            assert.equal(count(), 12);
            assert.equal(count.peek(), 12);
        });

        it('setting an Object.is-equal value does not notify subscribers', () => {
            const count = signal(5);
            let runs = 0;
            effect(() => {
                count();
                runs++;
            });

            assert.equal(runs, 1);
            count.set(5);
            assert.equal(runs, 1, 'setting the same value must not trigger a re-run');
            count.set(NaN);
            count.set(NaN);
            assert.equal(runs, 2, 'NaN -> NaN via Object.is must not re-notify a second time');
        });
    });

    describe('computed', () => {
        it('is lazy: the inner fn does not run until first read', () => {
            let calls = 0;
            const double = computed(() => {
                calls++;
                return 2;
            });

            assert.equal(calls, 0);
            double();
            assert.equal(calls, 1);
        });

        it('caches between reads when dependencies have not changed', () => {
            const base = signal(2);
            let calls = 0;
            const double = computed(() => {
                calls++;
                return base() * 2;
            });

            assert.equal(double(), 4);
            assert.equal(double(), 4);
            assert.equal(double(), 4);
            assert.equal(calls, 1, 'repeated reads with no dependency change must not recompute');
        });

        it('recomputes after a dependency changes', () => {
            const base = signal(2);
            const double = computed(() => base() * 2);

            assert.equal(double(), 4);
            base.set(5);
            assert.equal(double(), 10);
        });

        it('is trackable as a dependency itself when read inside an outer effect', () => {
            const base = signal(1);
            const double = computed(() => base() * 2);
            const seen: number[] = [];

            effect(() => {
                seen.push(double());
            });

            assert.deepEqual(seen, [2]);
            base.set(3);
            assert.deepEqual(seen, [2, 6]);
        });
    });

    describe('effect', () => {
        it('runs immediately on creation', () => {
            let runs = 0;
            effect(() => { runs++; });
            assert.equal(runs, 1);
        });

        it('re-runs when a signal it read changes, and ignores unrelated signals', () => {
            const a = signal(1);
            const b = signal('unrelated');
            let runs = 0;

            effect(() => {
                a();
                runs++;
            });

            assert.equal(runs, 1);
            a.set(2);
            assert.equal(runs, 2);
            b.set('still unrelated');
            assert.equal(runs, 2, 'a signal never read by the effect must not trigger it');
        });

        it('drops stale dependencies across conditional branches', () => {
            const condition = signal(true);
            const a = signal('a-value');
            const b = signal('b-value');
            let runs = 0;

            effect(() => {
                condition() ? a() : b();
                runs++;
            });

            assert.equal(runs, 1);

            // Currently on the `a` branch: changing `a` re-runs, `b` does not.
            a.set('a-changed');
            assert.equal(runs, 2);
            b.set('b-changed-while-unread');
            assert.equal(runs, 2, 'b is not read on this branch yet');

            // Switch branches.
            condition.set(false);
            assert.equal(runs, 3);

            // Now on the `b` branch: `a` must no longer trigger a re-run,
            // while `b` must.
            a.set('a-changed-again');
            assert.equal(runs, 3, 'stale dependency on a must have been dropped');
            b.set('b-changed-again');
            assert.equal(runs, 4, 'b is now tracked after the branch switch');
        });
    });

    describe('batch', () => {
        it('coalesces multiple writes into a single re-run per affected effect, after fn() returns', () => {
            const a = signal(1);
            const b = signal(2);
            let runs = 0;
            let lastSeen: [number, number] = [0, 0];

            effect(() => {
                lastSeen = [a(), b()];
                runs++;
            });

            assert.equal(runs, 1);

            let runsDuringBatch = 0;
            batch(() => {
                a.set(10);
                b.set(20);
                runsDuringBatch = runs;
            });

            assert.equal(runsDuringBatch, 1, 'effect must not re-run yet while inside the batch callback');
            assert.equal(runs, 2, 'effect must re-run exactly once after the batch completes');
            assert.deepEqual(lastSeen, [10, 20]);
        });

        it('does not re-run an effect unaffected by any write in the batch', () => {
            const a = signal(1);
            const c = signal('untouched');
            let runs = 0;

            effect(() => {
                c();
                runs++;
            });

            batch(() => {
                a.set(999);
            });

            assert.equal(runs, 1);
        });
    });

    describe('dispose', () => {
        it('stops future re-runs and is idempotent', () => {
            const a = signal(1);
            let runs = 0;

            const dispose = effect(() => {
                a();
                runs++;
            });

            assert.equal(runs, 1);
            a.set(2);
            assert.equal(runs, 2);

            dispose();
            a.set(3);
            assert.equal(runs, 2, 'a disposed effect must not re-run');

            assert.doesNotThrow(() => dispose());
        });
    });
});
