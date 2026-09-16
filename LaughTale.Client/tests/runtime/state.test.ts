import '../setup.ts';
import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { useSharedState, clearSharedState, IslandStore } from '../../src/runtime/state.ts';

describe('Reactive Shared State Store Suite (ROADMAP.v5.md Part D)', () => {
    beforeEach(() => {
        clearSharedState();
    });

    it('useSharedState returns the identical store instance for repeat calls with the same key', () => {
        const first = useSharedState('counter', 0);
        const second = useSharedState('counter');

        assert.equal(first, second, 'the same key must resolve to the same IslandStore instance');
        assert.ok(first instanceof IslandStore);
    });

    it('a later call with the same key ignores its own initialValue argument (the store already exists)', () => {
        const first = useSharedState('seeded', 'first');
        const second = useSharedState('seeded', 'second-should-be-ignored');

        assert.equal(second.get(), 'first', 'the store\'s value must come from whichever call created it first');
        assert.equal(first, second);
    });

    it('different keys get independent stores', () => {
        const a = useSharedState('key-a', 1);
        const b = useSharedState('key-b', 2);

        assert.notEqual(a, b);
        a.set(100);
        assert.equal(b.get(), 2, 'setting one key must not affect an unrelated key');
    });

    it('IslandStore.set supports both a direct value and an updater function, and notifies subscribers only on change', () => {
        const store = new IslandStore(1);
        const seen: number[] = [];
        store.subscribe((value) => seen.push(value));

        store.set(2);
        store.set((prev) => prev + 1);
        store.set(3); // same as current value - must NOT notify again

        assert.deepEqual(seen, [2, 3]);
        assert.equal(store.get(), 3);
    });

    it('subscribe() returns an unsubscribe function that stops further notifications', () => {
        const store = new IslandStore('a');
        const seen: string[] = [];
        const unsubscribe = store.subscribe((value) => seen.push(value));

        store.set('b');
        unsubscribe();
        store.set('c');

        assert.deepEqual(seen, ['b']);
    });

    it('clearSharedState() resets the registry so a previously-used key starts fresh', () => {
        useSharedState('reset-me', 'before').set('mutated');
        clearSharedState();

        const afterClear = useSharedState('reset-me', 'after');
        assert.equal(afterClear.get(), 'after', 'clearSharedState must drop the previous store entirely');
    });
});
