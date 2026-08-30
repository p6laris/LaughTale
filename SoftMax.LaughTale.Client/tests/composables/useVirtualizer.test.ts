import '../setup.ts';
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { useVirtualizer, shouldVirtualize } from '../../src/composables/useVirtualizer.ts';

describe('useVirtualizer High-Performance Virtual Scrolling Suite (LT-502)', () => {
    it('evaluates shouldVirtualize threshold correctly', () => {
        assert.equal(shouldVirtualize(50, 100), false);
        assert.equal(shouldVirtualize(100, 100), true);
        assert.equal(shouldVirtualize(10000), true);
    });

    it('calculates virtual items and dimensions with 10,000 fixed-height items', () => {
        const mockScrollEl = {
            clientHeight: 400,
            scrollTop: 0
        } as any;

        const virtualizer = useVirtualizer({
            count: 10000,
            estimateSize: 40, // Fixed 40px height
            overscan: 2,
            getScrollElement: () => mockScrollEl
        });

        assert.equal(virtualizer.getTotalSize(), 400000); // 10k * 40px
        assert.equal(virtualizer.isVirtual(), true);

        // At scrollTop = 0:
        // Visible items: 400 / 40 = 10 items (indices 0 to 9)
        // With overscan 2: indices 0 to 11 (12 items)
        const items = virtualizer.getVirtualItems();
        assert.ok(items.length >= 10 && items.length <= 15);
        assert.equal(items[0].index, 0);
        assert.equal(items[0].start, 0);
        assert.equal(items[0].size, 40);
    });

    it('updates virtual window when scrolling deep into 10,000 items', () => {
        const mockScrollEl = {
            clientHeight: 400,
            scrollTop: 20000 // Scrolled to 20,000px (item index 500)
        } as any;

        const virtualizer = useVirtualizer({
            count: 10000,
            estimateSize: 40,
            overscan: 2,
            getScrollElement: () => mockScrollEl
        });

        const items = virtualizer.getVirtualItems();
        // Start index around 500 - 2 = 498
        assert.equal(items[0].index, 498);
        assert.equal(items[0].start, 498 * 40);
        assert.ok(items.length >= 10 && items.length <= 15);
    });

    it('calculates total size with variable item heights', () => {
        const mockScrollEl = {
            clientHeight: 300,
            scrollTop: 0
        } as any;

        const virtualizer = useVirtualizer({
            count: 5,
            estimateSize: (index) => (index % 2 === 0 ? 50 : 30), // 50, 30, 50, 30, 50 = 210
            getScrollElement: () => mockScrollEl
        });

        assert.equal(virtualizer.getTotalSize(), 210);
        const items = virtualizer.getVirtualItems();
        assert.equal(items.length, 5);
    });

    it('programmatically scrolls to index with scrollToIndex', () => {
        const mockScrollEl = {
            clientHeight: 400,
            scrollTop: 0
        } as any;

        const virtualizer = useVirtualizer({
            count: 10000,
            estimateSize: 40,
            getScrollElement: () => mockScrollEl
        });

        virtualizer.scrollToIndex(250, 'start');
        assert.equal(mockScrollEl.scrollTop, 250 * 40); // 10,000px
    });
});
