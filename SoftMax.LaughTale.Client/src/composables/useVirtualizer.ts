/**
 * SoftMax.LaughTale: Headless useVirtualizer Composable (LT-502)
 * High-performance virtual scrolling engine for rendering large lists and data grids (10,000+ rows) at 60 FPS.
 */

export interface UseVirtualizerOptions {
    count: number;
    estimateSize: number | ((index: number) => number);
    overscan?: number;
    getScrollElement: () => HTMLElement | null;
    virtualThreshold?: number;
}

export interface VirtualItem {
    index: number;
    start: number;
    size: number;
    end: number;
}

export interface Virtualizer {
    getTotalSize(): number;
    getVirtualItems(): VirtualItem[];
    scrollToIndex(index: number, align?: 'start' | 'center' | 'end' | 'auto'): void;
    isVirtual(): boolean;
}

/**
 * Determines whether a collection should be virtualized based on item count and threshold.
 * @param count Total number of items
 * @param threshold Minimum count to engage virtualization (default: 100)
 */
export function shouldVirtualize(count: number, threshold: number = 100): boolean {
    return count >= threshold;
}

export function useVirtualizer(options: UseVirtualizerOptions): Virtualizer {
    const count = Math.max(0, options.count);
    const overscan = options.overscan ?? 3;
    const threshold = options.virtualThreshold ?? 100;
    const isFixedSize = typeof options.estimateSize === 'number';
    const fixedSize = isFixedSize ? (options.estimateSize as number) : 0;
    const getSize = isFixedSize ? () => fixedSize : (options.estimateSize as (index: number) => number);

    function getTotalSize(): number {
        if (count === 0) return 0;
        if (isFixedSize) {
            return count * fixedSize;
        }
        let total = 0;
        for (let i = 0; i < count; i++) {
            total += getSize(i);
        }
        return total;
    }

    function getItemOffset(index: number): number {
        if (isFixedSize) {
            return index * fixedSize;
        }
        let offset = 0;
        for (let i = 0; i < index; i++) {
            offset += getSize(i);
        }
        return offset;
    }

    function getVirtualItems(): VirtualItem[] {
        if (count === 0) return [];

        const scrollEl = options.getScrollElement();
        const viewportHeight = scrollEl ? scrollEl.clientHeight : 400;
        const scrollTop = scrollEl ? scrollEl.scrollTop : 0;

        let startIndex = 0;
        let endIndex = 0;

        if (isFixedSize && fixedSize > 0) {
            startIndex = Math.floor(scrollTop / fixedSize);
            const visibleCount = Math.ceil(viewportHeight / fixedSize);
            endIndex = startIndex + visibleCount;
        } else {
            let runningOffset = 0;
            while (startIndex < count && runningOffset + getSize(startIndex) < scrollTop) {
                runningOffset += getSize(startIndex);
                startIndex++;
            }

            endIndex = startIndex;
            let currentBottom = runningOffset;
            while (endIndex < count && currentBottom < scrollTop + viewportHeight) {
                currentBottom += getSize(endIndex);
                endIndex++;
            }
        }

        startIndex = Math.max(0, startIndex - overscan);
        endIndex = Math.min(count - 1, endIndex + overscan);

        const items: VirtualItem[] = [];
        let itemStart = getItemOffset(startIndex);

        for (let i = startIndex; i <= endIndex; i++) {
            const size = getSize(i);
            items.push({
                index: i,
                start: itemStart,
                size,
                end: itemStart + size
            });
            itemStart += size;
        }

        return items;
    }

    function scrollToIndex(index: number, align: 'start' | 'center' | 'end' | 'auto' = 'auto'): void {
        const scrollEl = options.getScrollElement();
        if (!scrollEl || index < 0 || index >= count) return;

        const targetOffset = getItemOffset(index);
        const itemSize = getSize(index);
        const viewportHeight = scrollEl.clientHeight;
        const currentScroll = scrollEl.scrollTop;

        let newScroll = targetOffset;
        if (align === 'center') {
            newScroll = targetOffset - (viewportHeight - itemSize) / 2;
        } else if (align === 'end') {
            newScroll = targetOffset - viewportHeight + itemSize;
        } else if (align === 'auto') {
            if (targetOffset < currentScroll) {
                newScroll = targetOffset;
            } else if (targetOffset + itemSize > currentScroll + viewportHeight) {
                newScroll = targetOffset - viewportHeight + itemSize;
            } else {
                return; // Already fully visible
            }
        }

        scrollEl.scrollTop = Math.max(0, newScroll);
    }

    function isVirtual(): boolean {
        return shouldVirtualize(count, threshold);
    }

    return {
        getTotalSize,
        getVirtualItems,
        scrollToIndex,
        isVirtual
    };
}
