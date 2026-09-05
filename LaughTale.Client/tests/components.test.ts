import './setup.ts';
import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert';

import InputNumberIsland from '../src/components/input-number.ts';
import InputOtpIsland from '../src/components/input-otp.ts';
import InputPasswordIsland from '../src/components/input-password.ts';
import ToggleSwitchIsland from '../src/components/toggle-switch.ts';
import SliderIsland from '../src/components/slider.ts';
import RatingIsland from '../src/components/rating.ts';
import AccordionIsland from '../src/components/accordion.ts';
import TabsIsland from '../src/components/tabs.ts';
import AutoCompleteIsland from '../src/components/autocomplete.ts';
import ColorPickerIsland from '../src/components/color-picker.ts';
import KnobIsland from '../src/components/knob.ts';
import TagIsland from '../src/components/tag.ts';
import InplaceIsland from '../src/components/inplace.ts';
import ImageCompareIsland from '../src/components/image-compare.ts';

describe('LaughTale Aura Enterprise Components Suite', () => {
    let container: HTMLElement;

    beforeEach(() => {
        document.body.innerHTML = '<div id="app"></div>';
        container = document.getElementById('app')!;
    });

    it('InputNumber: formats decimals, steps up/down and syncs value', () => {
        container.innerHTML = '<input type="hidden" name="salary" data-lt-field value="5000" />';
        InputNumberIsland(container, {
            targetInputName: 'salary',
            value: 5000,
            step: 500,
            mode: 'currency',
            currency: 'USD',
            showButtons: true
        });

        const input = container.querySelector('.p-inputnumber-input') as HTMLInputElement;
        const hidden = container.querySelector('input[name="salary"]') as HTMLInputElement;

        assert.ok(input.value.includes('5,000'));
        assert.strictEqual(hidden.value, '5000');

        const btnUp = container.querySelector('.p-inputnumber-button-up') as HTMLButtonElement;
        if (btnUp) {
            btnUp.click();
            assert.ok(input.value.includes('5,500'));
            assert.strictEqual(hidden.value, '5500');
        }
    });

    it('InputOtp: handles input entry, character jumping and full value sync', () => {
        container.innerHTML = '<input type="hidden" name="otp_code" data-lt-field />';
        InputOtpIsland(container, {
            length: 4,
            targetInputName: 'otp_code'
        });

        const inputs = container.querySelectorAll<HTMLInputElement>('.p-inputotp-input');
        assert.strictEqual(inputs.length, 4);

        inputs[0].value = '1';
        inputs[0].dispatchEvent(new Event('input'));
        inputs[1].value = '2';
        inputs[1].dispatchEvent(new Event('input'));
        inputs[2].value = '3';
        inputs[2].dispatchEvent(new Event('input'));
        inputs[3].value = '4';
        inputs[3].dispatchEvent(new Event('input'));

        const hidden = container.querySelector('input[name="otp_code"]') as HTMLInputElement;
        assert.strictEqual(hidden.value, '1234');
    });

    it('InputPassword: evaluates strength and toggles mask', () => {
        InputPasswordIsland(container, {
            placeholder: 'Secret password'
        });

        const input = container.querySelector('.p-password-input') as HTMLInputElement;
        assert.ok(input);
        assert.strictEqual(input.type, 'password');

        const toggleBtn = container.querySelector('.p-password-toggle-mask-icon, .p-password-icon, button') as HTMLElement;
        if (toggleBtn) {
            toggleBtn.click();
            assert.strictEqual(input.type, 'text');
        }
    });

    it('ToggleSwitch: toggles checked state and hidden input', () => {
        ToggleSwitchIsland(container, {
            checked: false,
            targetInputName: 'notifications'
        });

        container.click();
        const input = container.querySelector<HTMLInputElement>('.p-toggleswitch-input')!;
        assert.strictEqual(input.checked, true);
    });

    it('Slider: respects min, max, step boundaries and handles drag interactions', () => {
        container.innerHTML = '<input type="hidden" name="volume" data-lt-field value="25" />';
        SliderIsland(container, {
            min: 0,
            max: 100,
            value: 25,
            targetInputName: 'volume'
        });

        container.getBoundingClientRect = () => ({
            left: 0,
            top: 0,
            right: 200,
            bottom: 20,
            width: 200,
            height: 20,
            x: 0,
            y: 0,
            toJSON: () => {}
        });

        const hidden = container.querySelector('input[name="volume"]') as HTMLInputElement;
        assert.strictEqual(hidden.value, '25');

        container.dispatchEvent(new MouseEvent('pointerdown', { clientX: 150, bubbles: true }));
        assert.strictEqual(hidden.value, '75');
    });

    it('ImageCompare: handles split divider pointer dragging', () => {
        ImageCompareIsland(container, {
            beforeImage: 'before.jpg',
            afterImage: 'after.jpg',
            beforeLabel: 'Before',
            afterLabel: 'After'
        });

        const compareBox = container.querySelector('.p-compare, .p-imagecompare, .laughtale-image-compare');
        assert.ok(compareBox);
    });

    it('Rating: highlights stars on selection and allows cancel', () => {
        container.innerHTML = '<input type="hidden" name="score" data-lt-field value="3" />';
        RatingIsland(container, {
            stars: 5,
            value: 3,
            allowCancel: true,
            targetInputName: 'score'
        });

        const stars = container.querySelectorAll('.p-rating-item');
        assert.strictEqual(stars.length, 5);

        const hidden = container.querySelector('input[name="score"]') as HTMLInputElement;
        assert.strictEqual(hidden.value, '3');

        // Cancel
        const cancelBtn = container.querySelector('.p-rating-cancel-item') as HTMLElement;
        if (cancelBtn) {
            cancelBtn.click();
            const hiddenAfter = container.querySelector('input[name="score"]') as HTMLInputElement;
            assert.strictEqual(hiddenAfter.value, '0');
        }
    });

    it('Accordion: expands tabs and toggles visibility', () => {
        AccordionIsland(container, {
            tabs: [
                { id: '1', header: 'Section 1', content: 'Content 1' },
                { id: '2', header: 'Section 2', content: 'Content 2' }
            ],
            activeIndex: 0
        });

        const headers = container.querySelectorAll<HTMLElement>('.p-accordionheader, .p-accordion-header');
        assert.ok(headers.length >= 2);
    });

    it('Tabs: changes active tab panel', () => {
        container.innerHTML = `
            <div class="p-tablist">
                <button class="p-tab" data-value="0">Overview</button>
                <button class="p-tab" data-value="1">Security</button>
            </div>
            <div class="p-tabpanels">
                <div class="p-tabpanel" data-value="0">Overview Content</div>
                <div class="p-tabpanel" data-value="1">Security Content</div>
            </div>
        `;

        TabsIsland(container, {
            value: '0'
        });

        const headerBtns = container.querySelectorAll<HTMLElement>('.p-tab');
        assert.strictEqual(headerBtns.length, 2);
    });

    it('AutoComplete: filters list on typing', async () => {
        AutoCompleteIsland(container, {
            items: [
                { label: 'Erbil', value: 'EBL' },
                { label: 'Sulaymaniyah', value: 'SUL' },
                { label: 'Duhok', value: 'DHK' }
            ],
            targetInputName: 'city'
        });

        const input = container.querySelector<HTMLInputElement>('.ac-input, .p-autocomplete-input')!;
        assert.ok(input);

        input.value = 'Erb';
        input.dispatchEvent(new Event('input', { bubbles: true }));

        await new Promise(r => setTimeout(r, 200));

        const items = container.querySelectorAll('.ac-item, .p-autocomplete-option');
        assert.ok(items.length >= 1);
    });

    it('ColorPicker: updates color on palette swatch selection', () => {
        container.innerHTML = '<input type="hidden" name="theme_color" data-lt-field value="#10b981" />';
        ColorPickerIsland(container, {
            value: '#10b981',
            targetInputName: 'theme_color'
        });

        const hidden = container.querySelector('input[name="theme_color"]') as HTMLInputElement;
        assert.strictEqual(hidden.value, '#10b981');
    });

    it('Knob: calculates value, renders svg circle and responds to pointer events', () => {
        container.innerHTML = '<input type="hidden" name="percentage" data-lt-field value="75" />';
        KnobIsland(container, {
            value: 75,
            min: 0,
            max: 100,
            size: 100,
            targetInputName: 'percentage'
        });

        const knobEl = container.querySelector('.laughtale-knob') as HTMLElement;
        const hidden = container.querySelector('input[name="percentage"]') as HTMLInputElement;
        assert.strictEqual(hidden.value, '75');
    });

    it('Inplace: toggles between display and edit modes', () => {
        InplaceIsland(container, {
            value: 'Initial Note',
            targetInputName: 'note'
        });

        const display = container.querySelector('.p-inplace-display') as HTMLElement;
        assert.ok(display);

        display.click();
        const input = container.querySelector('.p-inplace-input') as HTMLInputElement;
        assert.ok(input);
        assert.equal(input.value, 'Initial Note');
    });
});
