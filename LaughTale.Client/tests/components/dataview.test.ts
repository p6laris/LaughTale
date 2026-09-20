import '../setup.ts';
import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import DataViewIsland, { type DataViewItem } from '../../src/components/dataview.ts';

// Characterization + regression suite for the shell-mount/patchList retrofit of dataview.ts
// (ROADMAP.v5.md animation-mechanism consolidation). This component had ZERO prior test coverage
// before this pass. It previously drove its item-reorder animation through useAutoAnimate, a
// MutationObserver-based mechanism that could never actually observe a mutation: every render
// rebuilt the entire container via a single top-level setHtml() call, so the "animated" container
// element itself never survived from one render to the next. The retrofit splits render() into a
// one-time shell mount (header/content/paginator slots) plus a persistent list/grid container that
// patchList reconciles by key across renders - the regression test at the bottom of this file
// (`the same item keeps its own DOM node across a re-render`) is the direct proof that fix works:
// without a persistent container and keyed reconciliation, no test can observe node-identity
// survival, because there would be nothing to survive.

const products: DataViewItem[] = [
    { id: 1, name: 'Alpha Widget', category: 'Widgets', price: 10, inventoryStatus: 'INSTOCK' },
    { id: 2, name: 'Beta Widget', category: 'Widgets', price: 30, inventoryStatus: 'LOWSTOCK' },
    { id: 3, name: 'Gamma Widget', category: 'Widgets', price: 20, inventoryStatus: 'OUTOFSTOCK' }
];

describe('DataView Shell/patchList Retrofit Suite', () => {
    let container: HTMLElement;

    beforeEach(() => {
        document.body.innerHTML = '';
        container = document.createElement('div');
        document.body.appendChild(container);
    });

    describe('Initial render', () => {
        it('renders one .p-dataview-list-item per item in list layout by default', () => {
            DataViewIsland(container, { value: products });

            const items = container.querySelectorAll('.p-dataview-list-item');
            assert.equal(items.length, 3);
            assert.equal(container.querySelector('.p-dataview-list-item .p-dataview-item-name')?.textContent, 'Alpha Widget');
        });

        it('renders .p-dataview-grid-card per item when layout is grid', () => {
            DataViewIsland(container, { value: products, layout: 'grid' });

            const cards = container.querySelectorAll('.p-dataview-grid-card');
            assert.equal(cards.length, 3);
            assert.equal(container.querySelectorAll('.p-dataview-list-item').length, 0);
        });

        it('omits the header entirely when no title/sort/switcher props are set', () => {
            DataViewIsland(container, { value: products });
            assert.equal(container.querySelector('.p-dataview-header'), null);
        });

        it('renders a skeleton placeholder, not real items, while loading', () => {
            DataViewIsland(container, { value: products, loading: true, rows: 3 });

            // The skeleton reuses the same `.p-dataview-list-item` wrapper class as a real row (so
            // it matches the real layout's spacing/sizing) - the absence check has to target
            // content that's exclusive to a real, hydrated row instead.
            assert.equal(container.querySelectorAll('.p-skeleton').length > 0, true);
            assert.equal(container.querySelectorAll('.p-dataview-item-name').length, 0);
            assert.equal(container.querySelectorAll('.p-dataview-btn-buy').length, 0);
        });
    });

    describe('Layout switcher', () => {
        it('switches from list to grid and back via the header buttons', () => {
            DataViewIsland(container, { value: products, showLayoutSwitcher: true });

            assert.equal(container.querySelectorAll('.p-dataview-list-item').length, 3);

            container.querySelector<HTMLButtonElement>('.btn-layout-grid')!.click();
            assert.equal(container.querySelectorAll('.p-dataview-grid-card').length, 3);
            assert.equal(container.querySelectorAll('.p-dataview-list-item').length, 0);

            container.querySelector<HTMLButtonElement>('.btn-layout-list')!.click();
            assert.equal(container.querySelectorAll('.p-dataview-list-item').length, 3);
        });
    });

    describe('Sorting', () => {
        it('sorts by price ascending/descending via the sort select', () => {
            DataViewIsland(container, { value: products, showSort: true });

            // The header (including the sort <select> itself) is fully replaced on every render
            // (see render()'s setHtml(headerSlot, ...) - it doesn't need to survive across renders
            // the way the item list does), so the select has to be re-queried after each dispatch
            // rather than reused - the original reference is a detached node once render() runs.
            let select = container.querySelector<HTMLSelectElement>('.p-dataview-sort-select')!;
            select.value = 'lowtohigh';
            select.dispatchEvent(new Event('change', { bubbles: true }));
            let names = Array.from(container.querySelectorAll('.p-dataview-item-name')).map(el => el.textContent);
            assert.deepEqual(names, ['Alpha Widget', 'Gamma Widget', 'Beta Widget']);

            select = container.querySelector<HTMLSelectElement>('.p-dataview-sort-select')!;
            select.value = 'hightolow';
            select.dispatchEvent(new Event('change', { bubbles: true }));
            names = Array.from(container.querySelectorAll('.p-dataview-item-name')).map(el => el.textContent);
            assert.deepEqual(names, ['Beta Widget', 'Gamma Widget', 'Alpha Widget']);
        });
    });

    describe('Pagination', () => {
        // patchList's animated exit path removes a departed key's node only after its exit
        // "animation" settles - a real WAAPI animation in a browser, but even in this
        // WAAPI-less test environment (happy-dom has no Element.prototype.animate) that still
        // resolves via a .then() microtask, not synchronously within the render() call. A test
        // that triggers a removal has to let one microtask tick pass before asserting the old
        // items are actually gone - this is what makes the exit animation possible at all in a
        // real browser (see list-patch.ts's patchListAnimated), so it's expected, not a bug.
        it('shows only the current page worth of items and advances on next-page click', async () => {
            DataViewIsland(container, { value: products, paginator: true, rows: 2 });

            assert.equal(container.querySelectorAll('.p-dataview-list-item').length, 2);

            container.querySelector<HTMLButtonElement>('.p-paginator-nav.p-next')!.click();
            await Promise.resolve();
            const names = Array.from(container.querySelectorAll('.p-dataview-item-name')).map(el => el.textContent);
            assert.deepEqual(names, ['Gamma Widget']);
        });

        it('changing rows-per-page resets to page 1', async () => {
            DataViewIsland(container, { value: products, paginator: true, rows: 1, rowsPerPageOptions: [1, 2, 3] });

            container.querySelector<HTMLButtonElement>('.p-paginator-nav.p-next')!.click();
            await Promise.resolve();
            assert.deepEqual(
                Array.from(container.querySelectorAll('.p-dataview-item-name')).map(el => el.textContent),
                ['Beta Widget']
            );

            const rowsSelect = container.querySelector<HTMLSelectElement>('.p-dataview-rows-select')!;
            rowsSelect.value = '3';
            rowsSelect.dispatchEvent(new Event('change', { bubbles: true }));
            await Promise.resolve();
            assert.deepEqual(
                Array.from(container.querySelectorAll('.p-dataview-item-name')).map(el => el.textContent),
                ['Alpha Widget', 'Beta Widget', 'Gamma Widget']
            );
        });
    });

    describe('Wishlist toggle', () => {
        it('toggles the wishlisted class and emits an event without a full re-render', () => {
            DataViewIsland(container, { value: products });

            const item = container.querySelector<HTMLElement>('.p-dataview-list-item[data-id="1"]')!;
            const btn = item.querySelector<HTMLButtonElement>('.p-dataview-btn-wishlist')!;

            let eventDetail: any = null;
            container.addEventListener('laughtale:dataview:wishlist-toggle', (e: any) => {
                eventDetail = e.detail;
            });

            btn.click();
            assert.equal(btn.classList.contains('p-wishlisted'), true);
            assert.equal(eventDetail?.isWishlisted, true);
            // The click handler mutates the button directly and deliberately does not call
            // render(), so the exact same button node must still be in the document afterward.
            assert.equal(container.contains(btn), true);

            btn.click();
            assert.equal(btn.classList.contains('p-wishlisted'), false);
            assert.equal(eventDetail?.isWishlisted, false);
        });
    });

    describe('Buy now', () => {
        it('emits a buy-now event with the matched item and disables the button when out of stock', () => {
            DataViewIsland(container, { value: products });

            const outOfStockItem = container.querySelector<HTMLElement>('.p-dataview-list-item[data-id="3"]')!;
            const buyBtn = outOfStockItem.querySelector<HTMLButtonElement>('.p-dataview-btn-buy')!;
            assert.equal(buyBtn.disabled, true);

            const inStockItem = container.querySelector<HTMLElement>('.p-dataview-list-item[data-id="1"]')!;
            const inStockBuyBtn = inStockItem.querySelector<HTMLButtonElement>('.p-dataview-btn-buy')!;

            let eventDetail: any = null;
            container.addEventListener('laughtale:dataview:buy-now', (e: any) => {
                eventDetail = e.detail;
            });
            inStockBuyBtn.click();
            assert.equal(eventDetail?.item?.name, 'Alpha Widget');
        });
    });

    describe('patchList wiring (the actual animation-bug regression test)', () => {
        it('the same item keeps its own wrapper node across a re-render triggered by sorting', () => {
            DataViewIsland(container, { value: products, showSort: true });

            // patchList wraps each rendered item in its own synthetic `<div data-key="...">`
            // (see runtime/list-patch.ts) - THAT wrapper's identity, not the inner
            // `.p-dataview-list-item` element patchList overwrites via `.innerHTML =` on every
            // content change, is what patchList actually guarantees and what the move animation
            // targets (`playListMove` animates the wrapper's transform). This is the same
            // "thin double-nesting" every other patchList consumer in this codebase already
            // accepts (see autocomplete.ts's own renderOptionHtml commentary).
            const wrapperBefore = container.querySelector<HTMLElement>('[data-key="1"]');
            assert.ok(wrapperBefore, 'item 1 renders on first paint');

            // Trigger a re-render that keeps item 1 in the result set (sort by price, still present).
            const select = container.querySelector<HTMLSelectElement>('.p-dataview-sort-select')!;
            select.value = 'lowtohigh';
            select.dispatchEvent(new Event('change', { bubbles: true }));

            const wrapperAfter = container.querySelector<HTMLElement>('[data-key="1"]');
            assert.ok(wrapperAfter, 'item 1 still renders after sorting');
            // Compare identity via a boolean, not assert.equal(wrapperAfter, wrapperBefore, ...)
            // directly - a DOM node failure message goes through util.inspect(), which can
            // hang/OOM on a node's circular document/parent structure (a known gotcha from this
            // codebase's datatable retrofit, see ROADMAP.v5.md).
            assert.equal(wrapperAfter === wrapperBefore, true, 'patchList must reuse the same wrapper node for an unchanged key, not recreate it - this is what makes a real move/enter/exit animation possible, unlike the old useAutoAnimate wiring which never saw a surviving container to observe');
        });

        // See the Pagination describe block above for why a removal needs a microtask tick before
        // the departed node is actually gone (patchListAnimated's exit path resolves via .then()).
        it('a removed item is not reused for a different key', async () => {
            DataViewIsland(container, { value: products, paginator: true, rows: 2 });

            const firstPageIds = Array.from(container.querySelectorAll('.p-dataview-list-item')).map(el => el.getAttribute('data-id'));
            assert.deepEqual(firstPageIds, ['1', '2']);

            container.querySelector<HTMLButtonElement>('.p-paginator-nav.p-next')!.click();
            await Promise.resolve();

            const secondPageIds = Array.from(container.querySelectorAll('.p-dataview-list-item')).map(el => el.getAttribute('data-id'));
            assert.deepEqual(secondPageIds, ['3']);
        });
    });
});
