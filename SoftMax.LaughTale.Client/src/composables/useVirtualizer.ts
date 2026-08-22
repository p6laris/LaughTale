/**
 * SoftMax.LaughTale: Headless useVirtualizer Composable
 * High-performance virtual scrolling engine for rendering large lists and data grids (10,000+ rows) at 60 FPS.
 */

export interface UseVirtualizerOptions {
    count: number;
    estimateSize: (index: number) => number;
    overscan?: number;
    getScrollElement: () => HTMLElement | null;
}

export interface VirtualItem {
    index: number;
    start: number;
    size: number;
    end: number;
}

export function useVirtualizer(options: UseVirtualizerOptions) {
    const overscan = options.overscan ?? 3;
    let scrollTop = 0;

    function getItemOffset(index: number): number {
        let offset = 0;
        for (let i = 0; i < index; i++) {
            offset += options.estimateSize(i);
        }
        return offset;
    }

    function getTotalSize(): number {
        let total = 0;
        for (let i = 0; i < options.count; i++) {
            total += options.estimateSize(i);
        }
        return total;
    }

    function getVirtualItems(): VirtualItem[] {
        const scrollEl = options.getScrollElement();
        const viewportHeight = scrollEl ? scrollEl.clientHeight : 400;
        scrollTop = scrollEl ? scrollEl.scrollTop : 0;

        const total = options.count;
        if (total === 0) return [];

        let startIndex = 0;
        let runningOffset = 0;

        while (startIndex < total && runningOffset + options.estimateSize(startIndex) < scrollTop) {
            runningOffset += options.estimateSize(startIndex);
            startIndex++;
        }

        let endIndex = startIndex;
        let currentBottom = runningOffset;

        while (endIndex < total && currentBottom < scrollTop + viewportHeight) {
            currentBottom += options.estimateSize(endIndex);
            endIndex++;
        }

        startIndex = Math.max(0, startIndex - overscan);
        endIndex = Math.min(total - 1, endIndex + overscan);

        const items: VirtualItem[] = [];
        let itemStart = getItemOffset(startIndex);

        for (let i = startIndex; i <= endIndex; i++) {
            const size = options.estimateSize(i);
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

    return {
        getTotalSize,
        getVirtualItems
    };
}
