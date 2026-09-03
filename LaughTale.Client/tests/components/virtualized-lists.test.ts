import '../setup.ts';
import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import ListboxIsland from '../../src/components/listbox.ts';
import OrderListIsland from '../../src/components/orderlist.ts';
import SelectIsland from '../../src/components/select.ts';

describe('Batch D Virtualized Lists Suite (US2 / T030)', () => {
    let container: HTMLElement;

    beforeEach(() => {
        document.body.innerHTML = '';
        container = document.createElement('div');
        document.body.appendChild(container);
    });

    describe('Listbox Virtualization', () => {
        it('renders < 100 elements when bound to 5,000 items and provides full scroll extent', () => {
            const items = Array.from({ length: 5000 }, (_, i) => ({
                label: `Item ${i}`,
                value: `val_${i}`
            }));

            ListboxIsland(container, { options: items });

            const renderedOptions = container.querySelectorAll('.p-listbox-option');
            assert.ok(
                renderedOptions.length < 100,
                `Expected rendered items < 100, but got ${renderedOptions.length}`
            );

            const scrollEl = container.querySelector<HTMLElement>('.p-listbox-list-wrapper, .p-listbox-list');
            assert.ok(scrollEl, 'Scroll container should exist');
            const spacer = container.querySelector<HTMLElement>('.p-virtual-spacer, [data-virtual-spacer]');
            const scrollHeight = spacer ? parseInt(spacer.style.height, 10) : scrollEl.scrollHeight;
            assert.ok(
                scrollHeight >= 5000 * 30,
                `Expected scroll extent to cover full collection >= 150000px, but got ${scrollHeight}px`
            );
        });

        it('renders all items unchanged when below 100-item threshold', () => {
            const items = Array.from({ length: 50 }, (_, i) => ({
                label: `Item ${i}`,
                value: `val_${i}`
            }));

            ListboxIsland(container, { options: items });

            const renderedOptions = container.querySelectorAll('.p-listbox-option');
            assert.equal(renderedOptions.length, 50, 'All 50 items should render when below threshold');
        });
    });

    describe('OrderList Virtualization', () => {
        it('renders < 100 elements when bound to 5,000 items and provides full scroll extent', () => {
            const items = Array.from({ length: 5000 }, (_, i) => ({
                id: `id_${i}`,
                name: `Item ${i}`
            }));

            OrderListIsland(container, { items });

            const renderedItems = container.querySelectorAll('.p-orderlist-item');
            assert.ok(
                renderedItems.length < 100,
                `Expected rendered items < 100, but got ${renderedItems.length}`
            );

            const spacer = container.querySelector<HTMLElement>('.p-virtual-spacer, [data-virtual-spacer]');
            const scrollEl = container.querySelector<HTMLElement>('.p-orderlist-list-container, .p-orderlist-list');
            assert.ok(scrollEl, 'Scroll container should exist');
            const scrollHeight = spacer ? parseInt(spacer.style.height, 10) : scrollEl.scrollHeight;
            assert.ok(
                scrollHeight >= 5000 * 30,
                `Expected scroll extent to cover full collection, got ${scrollHeight}px`
            );
        });

        it('renders all items unchanged when below 100-item threshold', () => {
            const items = Array.from({ length: 40 }, (_, i) => ({
                id: `id_${i}`,
                name: `Item ${i}`
            }));

            OrderListIsland(container, { items });

            const renderedItems = container.querySelectorAll('.p-orderlist-item');
            assert.equal(renderedItems.length, 40, 'All 40 items should render when below threshold');
        });
    });

    describe('Select Virtualization', () => {
        it('renders < 100 elements when bound to 5,000 items upon opening', () => {
            const options = Array.from({ length: 5000 }, (_, i) => ({
                label: `Option ${i}`,
                value: `opt_${i}`
            }));

            SelectIsland(container, { options });

            const trigger = container.querySelector<HTMLElement>('.p-select') || container;
            trigger.click();

            const renderedOptions = container.querySelectorAll('.p-select-option');
            assert.ok(
                renderedOptions.length < 100,
                `Expected rendered select options < 100, but got ${renderedOptions.length}`
            );
        });

        it('renders all options unchanged when below 100-item threshold', () => {
            const options = Array.from({ length: 30 }, (_, i) => ({
                label: `Option ${i}`,
                value: `opt_${i}`
            }));

            SelectIsland(container, { options });

            const trigger = container.querySelector<HTMLElement>('.p-select') || container;
            trigger.click();

            const renderedOptions = container.querySelectorAll('.p-select-option');
            assert.equal(renderedOptions.length, 30, 'All 30 options should render when below threshold');
        });
    });
});
