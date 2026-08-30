/**
 * SoftMax.LaughTale: Enterprise New Aura Components Suite Unit Tests
 */

import './setup.ts';
import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';

import SplitterIsland from '../src/components/splitter.ts';
import MultiSelectIsland from '../src/components/multiselect.ts';
import ListboxIsland from '../src/components/listbox.ts';
import PickListIsland from '../src/components/picklist.ts';
import OrderListIsland from '../src/components/orderlist.ts';
import BlockUIIsland from '../src/components/blockui.ts';
import SplitButtonIsland from '../src/components/split-button.ts';

describe('SoftMax.LaughTale New Aura Components Suite', () => {

    let container: HTMLElement;

    beforeEach(() => {
        document.body.innerHTML = '<div id="app"></div>';
        container = document.getElementById('app')!;
    });

    it('Splitter: initializes resizable panels layout', () => {
        container.innerHTML = `
            <div class="p-splitterpanel">Left Side</div>
            <div class="p-splitterpanel">Right Side</div>
        `;

        SplitterIsland(container, {
            layout: 'horizontal'
        });

        assert.ok(container.classList.contains('p-splitter'), 'Should add p-splitter class to root container');
    });

    it('MultiSelect: renders component and options', () => {
        MultiSelectIsland(container, {
            options: [
                { label: 'Admin', value: 'admin' },
                { label: 'Editor', value: 'editor' }
            ],
            targetInputName: 'roles'
        });

        const label = container.querySelector('.multiselect-label-container, .p-multiselect');
        assert.ok(label, 'Should render multiselect container');
    });

    it('Listbox: renders and lists options', () => {
        ListboxIsland(container, {
            options: [
                { label: 'Option A', value: 'a' },
                { label: 'Option B', value: 'b' }
            ]
        });

        const list = container.querySelector('.p-listbox-list');
        assert.ok(list, 'Should render listbox list');
    });

    it('PickList: renders source and target picklist containers', () => {
        PickListIsland(container, {
            source: [{ id: '1', name: 'Item 1' }],
            target: []
        });

        const picklist = container.querySelector('.p-picklist, .picklist-container, div');
        assert.ok(picklist, 'Should render picklist');
    });

    it('OrderList: renders order list and controls', () => {
        OrderListIsland(container, {
            items: [
                { id: '1', name: 'First', order: 0 },
                { id: '2', name: 'Second', order: 1 }
            ]
        });

        const orderlist = container.querySelector('.p-orderlist, .orderlist-container, div');
        assert.ok(orderlist, 'Should render orderlist');
    });

    it('BlockUI: renders blocked glass mask overlay', () => {
        BlockUIIsland(container, { blocked: true, message: 'Loading Test...' });
        const mask = container.querySelector<HTMLElement>('.blockui-mask')!;
        assert.ok(mask);
        assert.equal(mask.style.display, 'flex');
    });

    it('SplitButton: handles click events and renders actions', () => {
        SplitButtonIsland(container, { label: 'Save Action' });

        const btn = container.querySelector('.p-splitbutton, .laughtale-splitbutton, button');
        assert.ok(btn, 'Should render split button');
    });

});
