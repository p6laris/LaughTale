import '../setup.ts';
import { describe, it, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { useAmbientState, clearAmbientStateCache } from '../../src/runtime/ambient-state.ts';
import { clearSharedState } from '../../src/runtime/state.ts';

describe('Ambient State Pool Suite (ROADMAP.v5.md Part F)', () => {
    afterEach(() => {
        clearAmbientStateCache();
        clearSharedState();
        document.body.innerHTML = '';
    });

    it('seeds the store from the __LAUGHTALE_STATE__ script tag when present', () => {
        document.body.innerHTML = `<script id="__LAUGHTALE_STATE__" type="application/json">{"visitCount":7}</script>`;

        const store = useAmbientState<number>('visitCount', 0);

        assert.equal(store.get(), 7, 'Store must be seeded from the server payload, not the fallback initial value');
    });

    it('falls back to the given initial value when the key is absent from the payload', () => {
        document.body.innerHTML = `<script id="__LAUGHTALE_STATE__" type="application/json">{"otherKey":1}</script>`;

        const store = useAmbientState<number>('visitCount', 42);

        assert.equal(store.get(), 42);
    });

    it('falls back to the given initial value when no script tag exists at all', () => {
        const store = useAmbientState<number>('visitCount', 5);

        assert.equal(store.get(), 5);
    });

    it('two calls for the same key share one reactive store, seeded only once', () => {
        document.body.innerHTML = `<script id="__LAUGHTALE_STATE__" type="application/json">{"visitCount":7}</script>`;

        const storeA = useAmbientState<number>('visitCount', 0);
        storeA.set(99);
        const storeB = useAmbientState<number>('visitCount', 0);

        assert.equal(storeB.get(), 99, 'A second call must return the SAME store, not re-seed from the server payload');
    });

    it('handles malformed JSON in the script tag without throwing', () => {
        document.body.innerHTML = `<script id="__LAUGHTALE_STATE__" type="application/json">not json</script>`;

        const store = useAmbientState<number>('visitCount', 3);

        assert.equal(store.get(), 3);
    });
});
