import '../setup.ts';
import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import AutoCompleteIsland, { type AutoCompleteItem } from '../../src/components/autocomplete.ts';

// Characterization + regression suite for the signals/list-patch retrofit of autocomplete.ts
// (ROADMAP.v5.md Part I/J). This component had ZERO prior test coverage before this pass, so these
// tests cover both the pre-existing behavior being restructured (filtering, single/multiple select,
// grouping, keyboard nav, clear) AND the specific regressions the restructuring is meant to fix
// (node identity across re-renders, the delegated click/mouseover listeners still firing on a reused
// node, debounced filtering only applying once its interval elapses).
//
// There is no server-rendered [data-lt-field] in these plain test containers, so useFormField's
// setValue/getValue are no-ops here (the same convention datatable.test.ts and
// multiselect-benchmark.test.ts already rely on) - selection state is asserted instead via the
// component's own rendered DOM (chips, input value) and its emitted `laughtale:autocomplete:change`
// event, which is what real consumers of this component observe too.

function wait(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const fruitItems: AutoCompleteItem[] = [
    { label: 'Apple', value: 'apple' },
    { label: 'Banana', value: 'banana' },
    { label: 'Cherry', value: 'cherry' }
];

describe('AutoComplete Signals + patchList Retrofit Suite (ROADMAP.v5.md Part I/J)', () => {
    let container: HTMLElement;

    beforeEach(() => {
        document.body.innerHTML = '';
        container = document.createElement('div');
        document.body.appendChild(container);
    });

    describe('Filtering', () => {
        it('narrows the dropdown to matching items only after the debounce elapses', async () => {
            AutoCompleteIsland(container, { items: fruitItems });

            const input = container.querySelector<HTMLInputElement>('.ac-input')!;
            const overlay = container.querySelector<HTMLElement>('.ac-overlay')!;

            input.value = 'an';
            input.dispatchEvent(new Event('input', { bubbles: true }));

            // Debounced at 150ms (see the useDebounce call in the component) -
            // nothing should have opened/filtered yet.
            assert.equal(overlay.style.display, '', 'overlay must not open before the debounce elapses');

            await wait(250);

            assert.equal(overlay.style.display, 'block', 'overlay opens once a non-empty query debounces');
            const items = overlay.querySelectorAll<HTMLElement>('.ac-item');
            assert.equal(items.length, 1, 'only "Banana" contains "an"');
            assert.equal(items[0].getAttribute('data-value'), 'banana');
        });
    });

    describe('Single-select', () => {
        it('picking an item sets the input value to its label and closes the dropdown', () => {
            AutoCompleteIsland(container, { items: fruitItems, dropdown: true });

            const dropdownBtn = container.querySelector<HTMLButtonElement>('.ac-dropdown-btn')!;
            const overlay = container.querySelector<HTMLElement>('.ac-overlay')!;
            const input = container.querySelector<HTMLInputElement>('.ac-input')!;

            dropdownBtn.click();
            assert.equal(overlay.style.display, 'block', 'the dropdown button opens the overlay');

            overlay.querySelector<HTMLElement>('.ac-item[data-value="banana"]')!.click();

            assert.equal(input.value, 'Banana', 'input displays the selected item\'s label');
            assert.equal(overlay.style.display, 'none', 'selecting an item closes the dropdown');
        });
    });

    describe('Multiple-select', () => {
        it('renders one chip per selection and supports removing via the chip button and via Backspace', () => {
            let lastDetail: any = null;
            AutoCompleteIsland(container, { items: fruitItems, multiple: true, dropdown: true });
            container.addEventListener('laughtale:autocomplete:change', (e: any) => { lastDetail = e.detail; });

            const dropdownBtn = container.querySelector<HTMLButtonElement>('.ac-dropdown-btn')!;
            const overlay = container.querySelector<HTMLElement>('.ac-overlay')!;
            const chipsWrap = container.querySelector<HTMLElement>('.ac-chips-wrapper')!;
            const input = container.querySelector<HTMLInputElement>('.ac-input')!;

            dropdownBtn.click();
            overlay.querySelector<HTMLElement>('.ac-item[data-value="apple"]')!.click();
            assert.deepEqual(lastDetail.value, ['apple']);

            // Selecting always closes the dropdown today (unchanged existing behavior) - reopen for
            // the second pick.
            dropdownBtn.click();
            overlay.querySelector<HTMLElement>('.ac-item[data-value="banana"]')!.click();
            assert.deepEqual(new Set(lastDetail.value), new Set(['apple', 'banana']));

            let chips = chipsWrap.querySelectorAll('.ac-chip');
            assert.equal(chips.length, 2, 'one chip per selected value');

            // Remove via the chip's own remove button.
            (chips[0].querySelector('.ac-chip-remove') as HTMLElement).click();
            chips = chipsWrap.querySelectorAll('.ac-chip');
            assert.equal(chips.length, 1, 'removing a chip via its own button updates the chip list');
            assert.deepEqual(lastDetail.value, ['banana']);

            // Remove via Backspace when the input is empty.
            input.value = '';
            input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace', bubbles: true }));
            chips = chipsWrap.querySelectorAll('.ac-chip');
            assert.equal(chips.length, 0, 'Backspace-when-empty removes the last chip');
            assert.deepEqual(lastDetail.value, [], 'the underlying form value is empty once every chip is gone');
        });
    });

    describe('Node identity (patchList regression proof)', () => {
        it('selecting one item leaves an unrelated item\'s .ac-item node instance untouched, and its own delegated listener still fires', () => {
            let lastDetail: any = null;
            AutoCompleteIsland(container, { items: fruitItems, multiple: true, dropdown: true });
            container.addEventListener('laughtale:autocomplete:change', (e: any) => { lastDetail = e.detail; });

            const dropdownBtn = container.querySelector<HTMLButtonElement>('.ac-dropdown-btn')!;
            dropdownBtn.click();

            const overlay = container.querySelector<HTMLElement>('.ac-overlay')!;
            const cherryNode = overlay.querySelector<HTMLElement>('.ac-item[data-value="cherry"]')!;

            overlay.querySelector<HTMLElement>('.ac-item[data-value="apple"]')!.click();

            assert.equal(
                overlay.querySelector('.ac-item[data-value="cherry"]'),
                cherryNode,
                'cherry was not selected, so patchList must reuse its DOM node rather than recreate it'
            );

            // Prove the captured (reused) node's own listener still works - this is the delegated
            // `overlay` click listener (attached once at setup), not a per-item listener, so this
            // also proves delegation survived the re-render, not just that the node persisted.
            cherryNode.click();
            assert.deepEqual(
                new Set(lastDetail.value),
                new Set(['apple', 'cherry']),
                'clicking the reused cherry node must still register its own selection'
            );
        });
    });

    describe('Grouped mode', () => {
        it('still renders items under group headers and selection still works (the deliberately-excluded full-rebuild path)', () => {
            const groupedItems: AutoCompleteItem[] = [
                { label: 'Apple', value: 'apple', group: 'Fruit' },
                { label: 'Banana', value: 'banana', group: 'Fruit' },
                { label: 'Carrot', value: 'carrot', group: 'Vegetable' }
            ];
            AutoCompleteIsland(container, { items: groupedItems, dropdown: true });

            const dropdownBtn = container.querySelector<HTMLButtonElement>('.ac-dropdown-btn')!;
            dropdownBtn.click();

            const overlay = container.querySelector<HTMLElement>('.ac-overlay')!;
            const headers = Array.from(overlay.querySelectorAll('.ac-group-header')).map(h => h.textContent);
            assert.deepEqual(headers, ['Fruit', 'Vegetable']);
            assert.equal(overlay.querySelectorAll('.ac-item').length, 3, 'all items still render, grouped under their headers');

            overlay.querySelector<HTMLElement>('.ac-item[data-value="carrot"]')!.click();

            const input = container.querySelector<HTMLInputElement>('.ac-input')!;
            assert.equal(input.value, 'Carrot', 'selection still works in the grouped (full-rebuild) path');
        });
    });

    describe('Keyboard navigation', () => {
        it('ArrowDown/ArrowUp move the highlight, Enter selects the highlighted item, Escape closes the dropdown', () => {
            AutoCompleteIsland(container, { items: fruitItems, dropdown: true });

            const dropdownBtn = container.querySelector<HTMLButtonElement>('.ac-dropdown-btn')!;
            const input = container.querySelector<HTMLInputElement>('.ac-input')!;
            const overlay = container.querySelector<HTMLElement>('.ac-overlay')!;

            dropdownBtn.click();

            input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
            let items = overlay.querySelectorAll<HTMLElement>('.ac-item');
            assert.ok(items[0].classList.contains('highlighted'), 'first item highlighted after ArrowDown');

            input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
            items = overlay.querySelectorAll<HTMLElement>('.ac-item');
            assert.ok(items[1].classList.contains('highlighted'), 'second item highlighted after another ArrowDown');
            assert.equal(items[0].classList.contains('highlighted'), false);

            input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }));
            items = overlay.querySelectorAll<HTMLElement>('.ac-item');
            assert.ok(items[0].classList.contains('highlighted'), 'ArrowUp moves the highlight back to the first item');

            input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
            assert.equal(input.value, 'Apple', 'Enter selects the highlighted item');
            assert.equal(overlay.style.display, 'none', 'selecting via Enter closes the dropdown');

            dropdownBtn.click();
            assert.equal(overlay.style.display, 'block', 'dropdown reopened for the Escape check');
            input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
            assert.equal(overlay.style.display, 'none', 'Escape closes the dropdown');
        });
    });

    describe('Clear button', () => {
        it('clears the selection and the input value', () => {
            AutoCompleteIsland(container, { items: fruitItems, dropdown: true, showClear: true });

            const dropdownBtn = container.querySelector<HTMLButtonElement>('.ac-dropdown-btn')!;
            const input = container.querySelector<HTMLInputElement>('.ac-input')!;
            const clearBtn = container.querySelector<HTMLButtonElement>('.ac-btn-clear')!;

            dropdownBtn.click();
            container.querySelector<HTMLElement>('.ac-item[data-value="apple"]')!.click();

            assert.equal(input.value, 'Apple');
            assert.equal(clearBtn.style.display, 'flex', 'clear button appears once something is selected');

            clearBtn.click();

            assert.equal(input.value, '', 'clear button empties the input');
            assert.equal(clearBtn.style.display, 'none', 'clear button hides again once selection is empty');
        });
    });
});
