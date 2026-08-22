/**
 * SoftMax.LaughTale: New Components & Dynamic Form Suite Unit Tests
 */

import './setup.ts';
import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';

import DynamicFormIsland from '../src/components/dynamic-form.ts';
import SplitterIsland from '../src/components/splitter.ts';
import MultiSelectIsland from '../src/components/multiselect.ts';
import ListboxIsland from '../src/components/listbox.ts';
import PickListIsland from '../src/components/picklist.ts';
import OrderListIsland from '../src/components/orderlist.ts';
import TerminalIsland from '../src/components/terminal.ts';
import DockIsland from '../src/components/dock.ts';
import BlockUIIsland from '../src/components/blockui.ts';
import SplitButtonIsland from '../src/components/split-button.ts';

describe('SoftMax.LaughTale Dynamic Form & New Aura Components Suite', () => {

    let container: HTMLElement;

    beforeEach(() => {
        container = document.createElement('div');
        document.body.appendChild(container);
    });

    it('DynamicForm: renders form fields from schema and validates requirements', () => {
        DynamicFormIsland(container, {
            schema: {
                title: 'User Profile',
                fields: [
                    { name: 'username', label: 'Username', fieldType: 'Text', isRequired: true },
                    { name: 'email', label: 'Email', fieldType: 'Email', isRequired: true }
                ]
            }
        });

        const inputs = container.querySelectorAll('input');
        assert.equal(inputs.length, 2);

        const form = container.querySelector('form')!;
        form.dispatchEvent(new Event('submit'));

        const errorMsgs = container.querySelectorAll('.form-group span');
        assert.ok(errorMsgs.length > 0, 'Should display validation error messages when required fields are empty');
    });

    it('Splitter: initializes two resizable panels with divider gutter', () => {
        SplitterIsland(container, {
            layout: 'horizontal',
            panels: [
                { id: '1', size: 40, content: 'Left Side' },
                { id: '2', size: 60, content: 'Right Side' }
            ]
        });

        const panel1 = container.querySelector('.splitter-panel-1')!;
        const gutter = container.querySelector('.splitter-gutter')!;
        assert.ok(panel1);
        assert.ok(gutter);
    });

    it('MultiSelect: selects items and syncs value array', () => {
        MultiSelectIsland(container, {
            options: [
                { label: 'Admin', value: 'admin' },
                { label: 'Editor', value: 'editor' }
            ],
            targetInputName: 'roles'
        });

        const trigger = container.querySelector<HTMLElement>('.multiselect-trigger')!;
        trigger.click();

        const item = container.querySelector<HTMLElement>('.multiselect-item')!;
        item.click();

        const hidden = container.querySelector<HTMLInputElement>('input[name="roles"]')!;
        assert.ok(hidden.value.includes('admin'));
    });

    it('Listbox: selects and highlights list option', () => {
        ListboxIsland(container, {
            options: [
                { label: 'Option A', value: 'a' },
                { label: 'Option B', value: 'b' }
            ]
        });

        let items = container.querySelectorAll<HTMLElement>('.listbox-item');
        assert.equal(items.length, 2);

        items[0].click();
        const updatedItems = container.querySelectorAll<HTMLElement>('.listbox-item');
        assert.ok(updatedItems[0].style.color.includes('var(--p-primary-700)'));
    });

    it('PickList: transfers item between source and target lists', () => {
        PickListIsland(container, {
            source: [{ id: '1', name: 'Item 1' }],
            target: []
        });

        const sourceItem = container.querySelector<HTMLElement>('.source-item')!;
        sourceItem.click();

        const moveBtn = container.querySelector<HTMLButtonElement>('.btn-move-to-target')!;
        moveBtn.click();

        assert.equal(container.querySelectorAll('.target-item').length, 1);
    });

    it('OrderList: reorders list items with controls', () => {
        OrderListIsland(container, {
            items: [
                { id: '1', name: 'First', order: 0 },
                { id: '2', name: 'Second', order: 1 }
            ]
        });

        const downBtn = container.querySelector<HTMLButtonElement>('.btn-order-down')!;
        downBtn.click();

        const firstItemText = container.querySelector('.orderlist-item')!.textContent;
        assert.ok(firstItemText!.includes('Second'));
    });

    it('Terminal: executes command and outputs response', () => {
        TerminalIsland(container, {
            welcomeMessage: 'CLI Test',
            commands: { 'ping': 'pong' }
        });

        const input = container.querySelector<HTMLInputElement>('.terminal-input')!;
        input.value = 'ping';
        input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

        const log = container.querySelector('.terminal-log')!;
        assert.ok(log.textContent!.includes('pong'));
    });

    it('BlockUI: renders blocked glass mask overlay', () => {
        BlockUIIsland(container, { blocked: true, message: 'Loading Test...' });
        const mask = container.querySelector<HTMLElement>('.blockui-mask')!;
        assert.equal(mask.style.display, 'flex');
    });

    it('SplitButton: handles main click and dropdown menu trigger', () => {
        let clicked = false;
        container.addEventListener('splitbutton:click', () => { clicked = true; });

        SplitButtonIsland(container, { label: 'Save Action' });

        const mainBtn = container.querySelector<HTMLButtonElement>('.splitbutton-main-btn')!;
        mainBtn.click();
        assert.equal(clicked, true);
    });

});
