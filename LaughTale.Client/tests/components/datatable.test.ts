import '../setup.ts';
import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import DataTableIsland from '../../src/components/datatable.ts';

// Characterization + regression suite for the signals/list-patch retrofit of datatable.ts
// (ROADMAP.v5.md Part I/J). This component had ZERO prior test coverage before this pass, so these
// tests cover both the pre-existing behavior being restructured (sort, filter, paginate, select,
// expand, edit, virtualize, lazy-fetch) AND the specific regressions the restructuring is meant to
// fix (node identity across re-renders, delegated event listeners still firing after a re-render,
// debounced filters).

function wait(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function rowKeys(container: HTMLElement): string[] {
    return Array.from(container.querySelectorAll<HTMLTableRowElement>('.p-datatable-tbody > tr[data-row-key]'))
        .map(tr => tr.getAttribute('data-row-key')!);
}

describe('DataTable Signals + patchTbodyRows Retrofit Suite (ROADMAP.v5.md Part I/J)', () => {
    let container: HTMLElement;

    beforeEach(() => {
        document.body.innerHTML = '';
        container = document.createElement('div');
        document.body.appendChild(container);
    });

    describe('Sorting', () => {
        it('cycles asc -> desc -> unsorted (removableSort) on repeated header clicks, reordering rows', () => {
            const value = [
                { id: 1, name: 'Charlie' },
                { id: 2, name: 'Alice' },
                { id: 3, name: 'Bob' }
            ];
            const columns = [{ field: 'name', header: 'Name', sortable: true }];
            DataTableIsland(container, { value, columns, removableSort: true });

            assert.deepEqual(rowKeys(container), ['1', '2', '3'], 'unsorted: original insertion order');

            // The header (thead) is intentionally rebuilt via a full setHtml on every state change
            // (see updateView's doc comment) - this row is re-queried after every click rather than
            // reusing one captured reference, since the previous <th> node is detached each time.
            const th = () => container.querySelector<HTMLElement>('.p-sortable-column[data-field="name"]')!;
            assert.ok(th(), 'sortable header must render');

            th().click();
            assert.deepEqual(rowKeys(container), ['2', '3', '1'], 'ascending by name: Alice, Bob, Charlie');
            assert.ok(th().classList.contains('p-sorted'));

            th().click();
            assert.deepEqual(rowKeys(container), ['1', '3', '2'], 'descending by name: Charlie, Bob, Alice');

            th().click();
            assert.deepEqual(rowKeys(container), ['1', '2', '3'], 'removableSort: third click clears the sort');
        });
    });

    describe('Global filter', () => {
        it('filters rows to matching records after the debounce interval, without destroying the input node', async () => {
            const value = [
                { id: 1, name: 'Charlie' },
                { id: 2, name: 'Alice' },
                { id: 3, name: 'Bob' }
            ];
            const columns = [{ field: 'name', header: 'Name' }];
            DataTableIsland(container, { value, columns, globalFilterFields: ['name'] });

            const input = container.querySelector<HTMLInputElement>('.p-datatable-global-filter');
            assert.ok(input, 'global filter input must render when globalFilterFields is set');

            input!.value = 'ali';
            input!.dispatchEvent(new Event('input', { bubbles: true }));

            // Debounced at 150ms (see bindStaticEvents) - nothing should happen before it elapses.
            assert.deepEqual(rowKeys(container), ['1', '2', '3'], 'filter has not applied yet (debounced)');

            await wait(250);

            assert.deepEqual(rowKeys(container), ['2'], 'only Alice matches "ali"');
            assert.equal(
                container.querySelector('.p-datatable-global-filter'),
                input,
                'the toolbar (and its filter input) is built once and never rebuilt, so this must be the exact same DOM node'
            );
        });
    });

    describe('Column filter', () => {
        it('filters rows scoped to one column after the debounce interval', async () => {
            const value = [
                { id: 1, name: 'Charlie', dept: 'Eng' },
                { id: 2, name: 'Alice', dept: 'Sales' },
                { id: 3, name: 'Bob', dept: 'Eng' }
            ];
            const columns = [
                { field: 'name', header: 'Name' },
                { field: 'dept', header: 'Dept' }
            ];
            DataTableIsland(container, { value, columns, filterDisplay: 'row' });

            const input = container.querySelector<HTMLInputElement>('.p-datatable-filter-input[data-filter-field="dept"]');
            assert.ok(input, 'column filter input must render for filterDisplay: row');

            input!.value = 'sales';
            input!.dispatchEvent(new Event('input', { bubbles: true }));
            assert.deepEqual(rowKeys(container), ['1', '2', '3'], 'filter has not applied yet (debounced)');

            await wait(250);

            assert.deepEqual(rowKeys(container), ['2'], 'only the Sales row matches');
        });
    });

    describe('Pagination', () => {
        it('page-button clicks change the displayed rows and the active page indicator', () => {
            const value = Array.from({ length: 5 }, (_, i) => ({ id: i + 1, name: `Row ${i + 1}` }));
            const columns = [{ field: 'name', header: 'Name' }];
            DataTableIsland(container, { value, columns, paginator: true, rows: 2 });

            assert.deepEqual(rowKeys(container), ['1', '2'], 'page 1 shows the first 2 rows');
            assert.ok(container.querySelector('.p-paginator-page[data-page="1"]')!.classList.contains('p-paginator-page-active'));

            const page2Btn = container.querySelector<HTMLButtonElement>('.p-paginator-page[data-page="2"]')!;
            assert.ok(page2Btn, 'page 2 button must exist for 5 rows / 2 per page');
            page2Btn.click();

            assert.deepEqual(rowKeys(container), ['3', '4'], 'page 2 shows rows 3-4');
            assert.ok(container.querySelector('.p-paginator-page[data-page="2"]')!.classList.contains('p-paginator-page-active'));
        });
    });

    describe('Selection', () => {
        it('single mode (radio-style): only one row is selected at a time', () => {
            const value = [{ id: 1, name: 'A' }, { id: 2, name: 'B' }];
            const columns = [{ selectionMode: 'single' as const }, { field: 'name', header: 'Name' }];
            DataTableIsland(container, { value, columns, selectionMode: 'single' });

            let lastDetail: any = null;
            container.addEventListener('laughtale:datatable:selection-change', (e: any) => { lastDetail = e.detail; });

            container.querySelector<HTMLElement>('.p-row-radio[data-row-key="1"]')!.click();
            assert.deepEqual(lastDetail.selectedKeys, [1]);
            assert.ok(container.querySelector('.p-row-radio[data-row-key="1"]')!.classList.contains('p-checked'));

            container.querySelector<HTMLElement>('.p-row-radio[data-row-key="2"]')!.click();
            assert.deepEqual(lastDetail.selectedKeys, [2], 'selecting row 2 must deselect row 1');
            assert.equal(container.querySelector('.p-row-radio[data-row-key="1"]')!.classList.contains('p-checked'), false);
        });

        it('multiple mode (checkbox): select-all and clear-all work over the whole dataset', () => {
            const value = [{ id: 1, name: 'A' }, { id: 2, name: 'B' }, { id: 3, name: 'C' }];
            const columns = [{ selectionMode: 'multiple' as const }, { field: 'name', header: 'Name' }];
            DataTableIsland(container, { value, columns, selectionMode: 'multiple' });

            let lastDetail: any = null;
            container.addEventListener('laughtale:datatable:selection-change', (e: any) => { lastDetail = e.detail; });

            container.querySelector<HTMLElement>('.p-row-checkbox[data-row-key="1"]')!.click();
            container.querySelector<HTMLElement>('.p-row-checkbox[data-row-key="2"]')!.click();
            assert.deepEqual(new Set(lastDetail.selectedKeys), new Set([1, 2]));

            const selectAll = container.querySelector<HTMLElement>('.p-select-all')!;
            assert.ok(selectAll, 'select-all header checkbox must render');
            selectAll.click();
            assert.deepEqual(new Set(lastDetail.selectedKeys), new Set([1, 2, 3]), 'select-all selects every row in the dataset');

            const clearBtn = container.querySelector<HTMLElement>('.p-datatable-clear-selection');
            assert.ok(clearBtn, 'clear-selection button must render once something is selected');
            clearBtn!.click();
            assert.deepEqual(lastDetail.selectedKeys, []);
        });

        it('row-click selection (no dedicated selection column) fires the same selection-change contract', () => {
            const value = [{ id: 1, name: 'A' }, { id: 2, name: 'B' }];
            const columns = [{ field: 'name', header: 'Name' }];
            DataTableIsland(container, { value, columns, selectionMode: 'multiple' });

            let lastDetail: any = null;
            container.addEventListener('laughtale:datatable:selection-change', (e: any) => { lastDetail = e.detail; });

            // Selecting a row changes its own rendered markup (p-highlight, aria-*), so
            // patchTbodyRows legitimately replaces THIS row's node - re-query after each click
            // rather than reusing a captured reference (row identity is only guaranteed for rows
            // whose own content did NOT change; see the "Node identity" suite below for that case).
            container.querySelector<HTMLTableRowElement>('tr[data-row-key="1"]')!.click();
            assert.deepEqual(lastDetail.selectedKeys, [1]);
            assert.ok(container.querySelector<HTMLTableRowElement>('tr[data-row-key="1"]')!.classList.contains('p-highlight'));

            container.querySelector<HTMLTableRowElement>('tr[data-row-key="2"]')!
                .dispatchEvent(new MouseEvent('click', { bubbles: true, ctrlKey: true }));
            assert.deepEqual(new Set(lastDetail.selectedKeys), new Set([1, 2]), 'ctrl+click adds to the selection instead of replacing it');
        });
    });

    describe('Node identity (patchTbodyRows regression proof)', () => {
        it('selecting one row leaves an unrelated row\'s <tr> node instance untouched, and its own listener still fires', () => {
            const value = [{ id: 1, name: 'A' }, { id: 2, name: 'B' }, { id: 3, name: 'C' }];
            const columns = [{ selectionMode: 'multiple' as const }, { field: 'name', header: 'Name' }];
            DataTableIsland(container, { value, columns, selectionMode: 'multiple' });

            const rowB = container.querySelector<HTMLTableRowElement>('tr[data-row-key="2"]')!;
            const rowBCheckbox = rowB.querySelector<HTMLElement>('.p-row-checkbox')!;

            let lastDetail: any = null;
            container.addEventListener('laughtale:datatable:selection-change', (e: any) => { lastDetail = e.detail; });

            container.querySelector<HTMLElement>('.p-row-checkbox[data-row-key="1"]')!.click();

            assert.equal(
                container.querySelector('tr[data-row-key="2"]'),
                rowB,
                'row B was not touched by selecting row A - patchTbodyRows must reuse its DOM node, not recreate it'
            );

            // Prove the captured (reused) node's own listener still works - this is the delegated
            // tbodyEl click listener, not a per-row listener, so this also proves delegation survived.
            rowBCheckbox.click();
            assert.deepEqual(new Set(lastDetail.selectedKeys), new Set([1, 2]), 'clicking the reused row B node must still register its own selection');
        });
    });

    describe('Row expansion', () => {
        it('expands to show detail content and collapses to hide it, without disturbing other rows', () => {
            const value = [
                { id: 1, name: 'Widget', code: 'W-1', category: 'Tools', quantity: 5, price: 10 },
                { id: 2, name: 'Gadget', code: 'G-1', category: 'Tools', quantity: 2, price: 20 }
            ];
            const columns = [{ expander: true }, { field: 'name', header: 'Name' }];
            DataTableIsland(container, { value, columns });

            const otherRow = container.querySelector<HTMLTableRowElement>('tr[data-row-key="2"]')!;

            // Row 1's own markup (and thus its toggler button) is replaced by patchTbodyRows when it
            // expands/collapses, since its rendered content legitimately changes - re-query it after
            // each click rather than reusing one captured reference.
            const toggler = () => container.querySelector<HTMLElement>('.p-row-toggler[data-row-key="1"]')!;
            toggler().click();

            assert.ok(container.querySelector('.p-row-expansion'), 'expansion row must appear');
            assert.ok(container.textContent?.includes('W-1'), 'expansion content must include the expanded row\'s own data');
            assert.equal(container.querySelector('tr[data-row-key="2"]'), otherRow, 'expanding row 1 must not touch row 2\'s node');

            toggler().click();
            assert.equal(container.querySelector('.p-row-expansion'), null, 'collapsing must remove the expansion row');
        });
    });

    describe('Cell editing', () => {
        it('entering edit mode on one cell does not touch other rows\' DOM, and Enter saves the new value', () => {
            const value = [{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }];
            const columns = [{ field: 'name', header: 'Name' }];
            DataTableIsland(container, { value, columns, editMode: 'cell' });

            const otherRow = container.querySelector<HTMLTableRowElement>('tr[data-row-key="2"]')!;

            const cell = container.querySelector<HTMLElement>('.p-editable-cell[data-row-key="1"][data-field="name"]')!;
            assert.ok(cell, 'editable cell must render when editMode is "cell"');
            cell.click();

            const input = container.querySelector<HTMLInputElement>('.p-cell-editor-input');
            assert.ok(input, 'clicking an editable cell must show its editor input');
            assert.equal(container.querySelector('tr[data-row-key="2"]'), otherRow, 'entering edit mode on row 1 must not touch row 2\'s node');

            let completeDetail: any = null;
            container.addEventListener('laughtale:datatable:cell-edit-complete', (e: any) => { completeDetail = e.detail; });

            input!.value = 'Alicia';
            input!.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));

            assert.equal(completeDetail.newValue, 'Alicia');
            assert.equal(container.querySelector('.p-cell-editor-input'), null, 'saving must exit edit mode');
            assert.ok(container.textContent?.includes('Alicia'));
        });
    });

    describe('Virtualized path', () => {
        it('still renders a bounded window of rows for a 500-row dataset with no paginator', () => {
            const value = Array.from({ length: 500 }, (_, i) => ({ id: i + 1, name: `Row ${i + 1}` }));
            const columns = [{ field: 'name', header: 'Name' }];
            DataTableIsland(container, { value, columns });

            const rendered = container.querySelectorAll('.p-datatable-tbody > tr[data-row-key]');
            assert.ok(rendered.length > 0, 'some rows must render');
            assert.ok(rendered.length < 100, `expected a virtualized window under 100 rows, got ${rendered.length}`);
            assert.ok(container.querySelector('.p-datatable-spacer-top'), 'virtualized body must keep its top spacer row');
            assert.ok(container.querySelector('.p-datatable-spacer-bottom'), 'virtualized body must keep its bottom spacer row');
        });
    });

    describe('Lazy mode', () => {
        const originalFetch = globalThis.fetch;

        afterEach(() => {
            globalThis.fetch = originalFetch;
        });

        it('triggers fetchLazyData on sort, global filter, column filter and page changes', async () => {
            let callCount = 0;
            let lastBody: any = null;
            (globalThis as any).fetch = async (_url: string, init: any) => {
                callCount++;
                lastBody = JSON.parse(init.body);
                return {
                    ok: true,
                    json: async () => ({ items: lastBody.page === 2 ? [{ id: 2, name: 'Row 2' }] : [{ id: 1, name: 'Row 1' }], totalCount: 2 })
                };
            };

            const value = [{ id: 1, name: 'Row 1' }, { id: 2, name: 'Row 2' }];
            const columns = [{ field: 'name', header: 'Name', sortable: true, filterable: true }];
            DataTableIsland(container, {
                lazy: true,
                lazyUrl: '/fake-datatable-endpoint',
                value,
                columns,
                filterDisplay: 'row',
                globalFilterFields: ['name'],
                paginator: true,
                rows: 1
            });

            assert.equal(callCount, 0, 'a non-empty initial value must not auto-fetch on mount');

            container.querySelector<HTMLElement>('.p-sortable-column[data-field="name"]')!.click();
            assert.equal(callCount, 1, 'sorting must trigger a lazy fetch');

            const globalInput = container.querySelector<HTMLInputElement>('.p-datatable-global-filter')!;
            globalInput.value = 'row';
            globalInput.dispatchEvent(new Event('input', { bubbles: true }));
            await wait(250);
            assert.equal(callCount, 2, 'the global filter must trigger a lazy fetch once its debounce elapses');

            const colInput = container.querySelector<HTMLInputElement>('.p-datatable-filter-input[data-filter-field="name"]')!;
            colInput.value = 'row';
            colInput.dispatchEvent(new Event('input', { bubbles: true }));
            await wait(250);
            assert.equal(callCount, 3, 'the column filter must trigger a lazy fetch once its debounce elapses');

            const page2Btn = container.querySelector<HTMLButtonElement>('.p-paginator-page[data-page="2"]')!;
            assert.ok(page2Btn, 'page 2 button must render (2 total records / 1 per page)');
            page2Btn.click();
            assert.equal(callCount, 4, 'pagination must trigger a lazy fetch');
            assert.equal(lastBody.page, 2);
        });
    });
});
