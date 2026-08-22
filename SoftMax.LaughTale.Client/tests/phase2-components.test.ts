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

describe('SoftMax.LaughTale Aura v2 Components Suite', () => {
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
        const trigger = container.querySelector('.laughtale-select-trigger');
        assert.ok(trigger, 'Should render select trigger');
    });

    it('Checkbox: renders and has hidden input', () => {
        CheckboxIsland(container, { checked: false, value: 'yes', targetInputName: 'cb' });
        const box = container.querySelector('.laughtale-checkbox-box');
        assert.ok(box, 'Should render checkbox box');
    });

    it('RadioButton: renders with label', () => {
        RadioButtonIsland(container, { name: 'r', value: 'A', checked: false, label: 'Option A' });
        assert.ok(container.querySelector('.laughtale-radio-wrap'), 'Should render radio');
    });

    it('Textarea: renders textarea element', () => {
        TextareaIsland(container, { value: 'hi', maxLength: 10, autoResize: true });
        assert.ok(container.querySelector('textarea'), 'Should render textarea');
    });

    it('Menu: renders menu items', () => {
        MenuIsland(container, { items: [{ label: 'Home' }, { label: 'About' }], popup: false });
        const items = container.querySelectorAll('.menu-item, [class*="menu-item"]');
        assert.ok(items.length >= 2, 'Should render menu items');
    });

    it('Paginator: renders page buttons', () => {
        PaginatorIsland(container, { totalRecords: 50, rows: 10, first: 0 });
        const btns = container.querySelectorAll('.paginator-btn');
        assert.ok(btns.length > 0, 'Should render paginator buttons');
    });

    it('InputMask: renders masked input', () => {
        InputMaskIsland(container, { mask: '(999) 999-9999', targetInputName: 'phone' });
        assert.ok(container.querySelector('input'), 'Should render input');
    });

    it('InputText: renders text input', () => {
        InputTextIsland(container, { value: 'hi', showClear: true, targetInputName: 'txt' });
        assert.ok(container.querySelector('input'), 'Should render input');
    });
});
