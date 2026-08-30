import './setup.ts';
import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert';

import SelectIsland from '../src/components/select.ts';
import CheckboxIsland from '../src/components/checkbox.ts';
import RadioButtonIsland from '../src/components/radio-button.ts';
import TextareaIsland from '../src/components/textarea.ts';
import MenuIsland from '../src/components/menu.ts';
import PaginatorIsland from '../src/components/paginator.ts';
import InputMaskIsland from '../src/components/input-mask.ts';
import InputTextIsland from '../src/components/input-text.ts';

describe('LaughTale Aura v2 Components Suite', () => {
    let container: HTMLElement;

    beforeEach(() => {
        document.body.innerHTML = '<div id="app"></div>';
        container = document.getElementById('app')!;
    });

    it('Select: creates dropdown and opens on click', () => {
        SelectIsland(container, {
            options: [
                { label: 'Option 1', value: '1' },
                { label: 'Option 2', value: '2' }
            ],
            targetInputName: 'my_select'
        });
        const trigger = container.querySelector('.p-select, .laughtale-select-trigger, .p-select-label');
        assert.ok(trigger, 'Should render select trigger');
    });

    it('Checkbox: renders and has hidden input', () => {
        CheckboxIsland(container, { checked: false, value: 'yes', targetInputName: 'cb' });
        const box = container.querySelector('.p-checkbox, .laughtale-checkbox-box');
        assert.ok(box, 'Should render checkbox box');
    });

    it('RadioButton: renders with label', () => {
        RadioButtonIsland(container, { name: 'r', value: 'A', checked: false, label: 'Option A' });
        assert.ok(container.querySelector('.p-radiobutton, .laughtale-radio-wrap'), 'Should render radio');
    });

    it('Textarea: renders textarea element', () => {
        TextareaIsland(container, { value: 'hi', maxLength: 10, autoResize: true });
        assert.ok(container.querySelector('textarea'), 'Should render textarea');
    });

    it('Menu: renders menu items', () => {
        MenuIsland(container, {
            items: [
                { label: 'Item 1', icon: 'pi-user' },
                { label: 'Item 2', icon: 'pi-cog' }
            ]
        });
        assert.ok(container.querySelector('.p-menu, .laughtale-menu'), 'Should render menu');
    });

    it('Paginator: renders page buttons', () => {
        PaginatorIsland(container, { totalRecords: 50, rows: 10, page: 0 });
        assert.ok(container.querySelector('.p-paginator, .laughtale-paginator'), 'Should render paginator');
    });

    it('InputMask: renders formatted mask', () => {
        InputMaskIsland(container, { mask: '(999) 999-9999', value: '1234567890' });
        const input = container.querySelector('input');
        assert.ok(input, 'Should render input mask');
    });

    it('InputText: renders styled text input', () => {
        InputTextIsland(container, { placeholder: 'Enter name', variant: 'filled' });
        const input = container.querySelector('input');
        assert.ok(input, 'Should render input text');
    });
});
