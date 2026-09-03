import '../setup.ts';
import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import ListboxIsland from '../../src/components/listbox.ts';
import OrderListIsland from '../../src/components/orderlist.ts';
import SelectIsland from '../../src/components/select.ts';

describe('Batch D Virtualized Accessibility Suite (US3 / T031)', () => {
    let container: HTMLElement;

    beforeEach(() => {
        document.body.innerHTML = '';
        container = document.createElement('div');
        document.body.appendChild(container);
    });

    describe('Listbox Accessibility in Virtualized Mode', () => {
        it('sets aria-setsize to collection length and aria-posinset to 1-based index', () => {
            const count = 500;
            const items = Array.from({ length: count }, (_, i) => ({
                label: `Item ${i}`,
                value: `val_${i}`
            }));

            ListboxIsland(container, { options: items });

            const renderedOptions = container.querySelectorAll<HTMLElement>('.p-listbox-option');
            assert.ok(renderedOptions.length > 0, 'Should render virtual items');

            const first = renderedOptions[0];
            assert.equal(first.getAttribute('aria-setsize'), String(count), 'aria-setsize must equal collection length');
            assert.equal(first.getAttribute('aria-posinset'), '1', 'aria-posinset of first item must be 1');

            const second = renderedOptions[1];
            assert.equal(second.getAttribute('aria-posinset'), '2', 'aria-posinset of second item must be 2');
        });

        it('ArrowDown from last rendered item advances into unrendered items and updates focus', () => {
            const count = 500;
            const items = Array.from({ length: count }, (_, i) => ({
                label: `Item ${i}`,
                value: `val_${i}`
            }));

            ListboxIsland(container, { options: items });

            const listEl = container.querySelector<HTMLElement>('.p-listbox-list');
            assert.ok(listEl, 'List element should exist');

            // Dispatch arrow down through all rendered items to boundary
            const renderedCount = container.querySelectorAll('.p-listbox-option').length;
            for (let i = 0; i < renderedCount + 2; i++) {
                listEl.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
            }

            // Collection index should have progressed beyond initial window
            const focused = container.querySelector<HTMLElement>('.p-listbox-option:focus, .p-listbox-option[tabindex="0"]');
            assert.ok(focused, 'A focused item should exist after navigating past initial boundary');
            const posInSet = parseInt(focused.getAttribute('aria-posinset') || '0', 10);
            assert.ok(
                posInSet > renderedCount,
                `Expected active position (${posInSet}) to advance past initial rendered count (${renderedCount})`
            );
        });
    });

    describe('OrderList Accessibility in Virtualized Mode', () => {
        it('sets aria-setsize to collection length and aria-posinset to 1-based index', () => {
            const count = 300;
            const items = Array.from({ length: count }, (_, i) => ({
                id: `id_${i}`,
                name: `Item ${i}`
            }));

            OrderListIsland(container, { items });

            const renderedItems = container.querySelectorAll<HTMLElement>('.p-orderlist-item');
            assert.ok(renderedItems.length > 0, 'Rendered items must exist');

            const first = renderedItems[0];
            assert.equal(first.getAttribute('aria-setsize'), String(count), 'aria-setsize must equal full count');
            assert.equal(first.getAttribute('aria-posinset'), '1', 'aria-posinset must be 1 for first item');
        });
    });

    describe('Select Accessibility in Virtualized Mode', () => {
        it('sets aria-setsize and aria-posinset on virtualized options', () => {
            const count = 200;
            const options = Array.from({ length: count }, (_, i) => ({
                label: `Option ${i}`,
                value: `opt_${i}`
            }));

            SelectIsland(container, { options });

            const trigger = container.querySelector<HTMLElement>('.p-select') || container;
            trigger.click();

            const renderedOptions = container.querySelectorAll<HTMLElement>('.p-select-option');
            assert.ok(renderedOptions.length > 0, 'Rendered options should exist');

            const first = renderedOptions[0];
            assert.equal(first.getAttribute('aria-setsize'), String(count), 'aria-setsize must equal collection length');
            assert.equal(first.getAttribute('aria-posinset'), '1', 'aria-posinset must be 1 for first item');
        });
    });
});
