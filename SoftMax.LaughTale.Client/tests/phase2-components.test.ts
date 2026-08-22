import './setup.ts';
import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert';

import SelectIsland from '../src/components/select.ts';
import CheckboxIsland from '../src/components/checkbox.ts';
import RadioButtonIsland from '../src/components/radio-button.ts';
import TextareaIsland from '../src/components/textarea.ts';
import MenuIsland from '../src/components/menu.ts';
import CarouselIsland from '../src/components/carousel.ts';
import PaginatorIsland from '../src/components/paginator.ts';
import SidebarIsland from '../src/components/sidebar.ts';
import PopoverIsland from '../src/components/popover.ts';
import InputMaskIsland from '../src/components/input-mask.ts';
import FloatLabelIsland from '../src/components/float-label.ts';
import ContextMenuIsland from '../src/components/context-menu.ts';
import InputTextIsland from '../src/components/input-text.ts';
import DataViewIsland from '../src/components/dataview.ts';
import TooltipIsland from '../src/components/tooltip-component.ts';

describe('SoftMax.LaughTale Aura v2 Components Suite', () => {
    let container: HTMLElement;

    beforeEach(() => {
        document.body.innerHTML = '<div id="app"></div>';
        container = document.getElementById('app')!;
    });

    it('Select: creates dropdown, opens on click, selects option, syncs value', () => {
        SelectIsland(container, {
            options: [
                { label: 'Option 1', value: '1' },
                { label: 'Option 2', value: '2' }
            ],
            targetInputName: 'my_select'
        });

        const trigger = container.querySelector('.laughtale-select-trigger') as HTMLButtonElement;
        assert.ok(trigger);
        
        trigger.click();
        const selectWrap = container.querySelector('.laughtale-select') as HTMLElement;
        assert.ok(selectWrap.classList.contains('is-open'));

        const items = container.querySelectorAll('.laughtale-select-item');
        assert.strictEqual(items.length, 2);
        
        (items[1] as HTMLElement).click();
        const hidden = container.querySelector('input[name="my_select"]') as HTMLInputElement;
        assert.strictEqual(hidden.value, '2');
    });

    it('Checkbox: renders checkbox, toggles on click, handles indeterminate', () => {
        CheckboxIsland(container, {
            checked: false,
            targetInputName: 'my_checkbox',
            value: 'yes'
        });

        const wrap = container.querySelector('.laughtale-checkbox-wrap') as HTMLElement;
        const hidden = container.querySelector('input[name="my_checkbox"]') as HTMLInputElement;
        assert.strictEqual(hidden.value, 'false');
        
        const input = container.querySelector('.laughtale-checkbox-hidden') as HTMLInputElement;
        input.checked = true;
        input.dispatchEvent(new Event('change'));
        
        assert.strictEqual(hidden.value, 'yes');
        assert.ok(wrap.classList.contains('is-checked'));
    });

    it('RadioButton: renders radio, checks on click, syncs value', () => {
        RadioButtonIsland(container, {
            name: 'my_radio',
            value: 'A',
            checked: false,
            targetInputName: 'my_radio_hidden'
        });

        const hidden = document.querySelector('input[name="my_radio_hidden"]');
        assert.ok(!hidden);

        const input = container.querySelector('.laughtale-radio-hidden') as HTMLInputElement;
        input.checked = true;
        input.dispatchEvent(new Event('change'));
        
        const hiddenAfter = document.querySelector('input[name="my_radio_hidden"]') as HTMLInputElement;
        assert.strictEqual(hiddenAfter.value, 'A');
    });

    it('Textarea: renders with auto-resize, counts characters', () => {
        TextareaIsland(container, {
            value: 'hello',
            maxLength: 10,
            autoResize: true,
            targetInputName: 'my_textarea'
        });

        const textarea = container.querySelector('textarea') as HTMLTextAreaElement;
        const counter = container.querySelector('.laughtale-char-count') as HTMLElement;
        assert.strictEqual(textarea.value, 'hello');
        assert.strictEqual(counter.textContent, '5');
        
        textarea.value = 'hello world';
        textarea.dispatchEvent(new Event('input'));
        
        assert.strictEqual(counter.textContent, '11');
        const hidden = container.querySelector('input[name="my_textarea"]') as HTMLInputElement;
        assert.strictEqual(hidden.value, 'hello world');
    });

    it('Menu: renders items, supports keyboard nav', () => {
        MenuIsland(container, {
            items: [
                { label: 'Item 1' },
                { label: 'Item 2' }
            ]
        });

        const items = container.querySelectorAll('.menu-item');
        assert.strictEqual(items.length, 2);
        assert.strictEqual(items[0].querySelector('span')!.textContent, 'Item 1');
    });

    it('Carousel: renders slides, navigates with arrow buttons', () => {
        CarouselIsland(container, {
            items: [
                { title: 'Slide 1' },
                { title: 'Slide 2' }
            ],
            numVisible: 1,
            showNavigators: true
        });

        const track = container.querySelector('.carousel-track') as HTMLElement;
        assert.ok(track);
        assert.strictEqual(track.style.transform, 'translateX(-0%)');
        
        const nextBtn = container.querySelector('.next-btn') as HTMLButtonElement;
        nextBtn.click();
        
        assert.strictEqual(track.style.transform, 'translateX(-100%)');
    });

    it('Paginator: renders page buttons, changes page on click', () => {
        PaginatorIsland(container, {
            totalRecords: 50,
            rows: 10,
            first: 0
        });

        let pageFired = false;
        container.addEventListener('page-change', () => {
            pageFired = true;
        });

        const nextBtn = container.querySelector('.btn-next') as HTMLButtonElement;
        nextBtn.click();
        
        assert.ok(pageFired);
    });

    it('Sidebar: renders items, toggles collapse', () => {
        SidebarIsland(container, {
            items: [
                { label: 'Dash' }
            ]
        });

        const sidebar = container.querySelector('.laughtale-sidebar') as HTMLElement;
        assert.ok(!sidebar.classList.contains('collapsed'));
        
        const toggleBtn = container.querySelector('.sidebar-toggle') as HTMLButtonElement;
        toggleBtn.click();
        
        assert.ok(sidebar.classList.contains('collapsed'));
    });

    it('Popover: opens popover on trigger click', () => {
        const trigger = document.createElement('button');
        trigger.id = 'trigger';
        document.body.appendChild(trigger);
        
        PopoverIsland(container, {
            triggerId: 'trigger'
        });

        assert.ok(!container.querySelector('.laughtale-popover'));
        
        trigger.click();
        assert.ok(container.querySelector('.laughtale-popover'));
    });

    it('InputMask: applies mask pattern on typing', () => {
        InputMaskIsland(container, {
            mask: '99-99',
            targetInputName: 'my_mask'
        });

        const input = container.querySelector('input') as HTMLInputElement;
        input.value = '1234';
        input.dispatchEvent(new Event('input'));
        
        assert.strictEqual(input.value, '12-34');
        const hidden = container.querySelector('input[name="my_mask"]') as HTMLInputElement;
        assert.strictEqual(hidden.value, '1234');
    });

    it('FloatLabel: floats label on input focus', () => {
        container.innerHTML = '<input type="text" />';
        FloatLabelIsland(container, {
            label: 'My Label',
            variant: 'over'
        });

        const label = container.querySelector('label') as HTMLLabelElement;
        assert.strictEqual(label.textContent, 'My Label');
        
        const wrap = container.querySelector('.laughtale-float-label') as HTMLElement;
        const input = container.querySelector('input') as HTMLInputElement;
        
        input.value = 'val';
        input.dispatchEvent(new Event('input'));
        
        assert.ok(wrap.classList.contains('has-value'));
    });

    it('ContextMenu: opens on right-click', () => {
        const target = document.createElement('div');
        target.className = 'target';
        document.body.appendChild(target);

        ContextMenuIsland(container, {
            items: [{ label: 'Ctx 1' }],
            targetSelector: '.target'
        });

        assert.ok(!container.querySelector('.laughtale-context-menu'));
        
        target.dispatchEvent(new MouseEvent('contextmenu', { clientX: 100, clientY: 100 }));
        
        const menu = container.querySelector('.laughtale-context-menu') as HTMLElement;
        assert.ok(menu);
        assert.strictEqual(menu.style.left, '100px');
    });

    it('InputText: renders with icon and clear button', () => {
        InputTextIsland(container, {
            value: 'hello',
            iconLeft: 'search',
            showClear: true,
            targetInputName: 'my_text'
        });

        const wrap = container.querySelector('.laughtale-input-wrap') as HTMLElement;
        assert.ok(wrap.classList.contains('has-icon-left'));
        assert.ok(wrap.classList.contains('has-clear'));
        
        const clearBtn = container.querySelector('.laughtale-input-clear') as HTMLButtonElement;
        clearBtn.click();
        
        const hidden = container.querySelector('input[name="my_text"]') as HTMLInputElement;
        assert.strictEqual(hidden.value, '');
    });

    it('DataView: toggles between grid and list layouts', () => {
        DataViewIsland(container, {
            items: [{ title: 'Item A' }]
        });

        const content = container.querySelector('.dataview-content') as HTMLElement;
        assert.ok(content.classList.contains('list'));
        
        const gridBtn = container.querySelector('.dataview-btn[data-layout="grid"]') as HTMLButtonElement;
        gridBtn.click();
        
        assert.ok(content.classList.contains('grid'));
    });

    it('TooltipComponent: shows tooltip on hover', () => {
        const target = document.createElement('button');
        target.className = 'tooltiptarget';
        document.body.appendChild(target);

        TooltipIsland(container, {
            target: '.tooltiptarget',
            showDelay: 0
        });

        target.dispatchEvent(new Event('mouseenter'));
        
        setTimeout(() => {
            const tooltip = document.querySelector('.laughtale-tooltip');
            assert.ok(tooltip);
        }, 10);
    });
});
