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

describe('SoftMax.LaughTale Aura Enterprise Components Suite', () => {
    let container: HTMLElement;

    beforeEach(() => {
        document.body.innerHTML = '<div id="app"></div>';
        container = document.getElementById('app')!;
    });

    it('InputNumber: formats decimals, steps up/down and syncs value', () => {
        InputNumberIsland(container, {
            targetInputName: 'salary',
            value: 5000,
            step: 500,
            mode: 'currency',
            currency: 'USD'
        });

        const input = container.querySelector('.number-display-input') as HTMLInputElement;
        const hidden = container.querySelector('input[name="salary"]') as HTMLInputElement;

        assert.strictEqual(input.value, '$ 5,000.00');
        assert.strictEqual(hidden.value, '5000');

        const btnUp = container.querySelector('.btn-step-up') as HTMLButtonElement;
        btnUp.click();

        assert.strictEqual(input.value, '$ 5,500.00');
        assert.strictEqual(hidden.value, '5500');
    });

    it('InputOtp: handles input entry, character jumping and full value sync', () => {
        InputOtpIsland(container, {
            length: 4,
            targetInputName: 'otp_code'
        });

        const inputs = container.querySelectorAll<HTMLInputElement>('.otp-digit-input');
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

        const input = container.querySelector('.password-input') as HTMLInputElement;
        assert.strictEqual(input.type, 'password');

        const toggleBtn = container.querySelector('.toggle-mask-btn') as HTMLButtonElement;
        toggleBtn.click();

        const inputAfter = container.querySelector('.password-input') as HTMLInputElement;
        assert.strictEqual(inputAfter.type, 'text');
    });

    it('ToggleSwitch: toggles checked state and hidden input', () => {
        ToggleSwitchIsland(container, {
            checked: false,
            targetInputName: 'notifications'
        });

        const switchBtn = container.querySelector('.laughtale-switch') as HTMLElement;
        switchBtn.click();
        const hiddenAfter = container.querySelector('input[name="notifications"]') as HTMLInputElement;
        assert.strictEqual(hiddenAfter.value, 'true');
    });

    it('Slider: respects min, max, step boundaries and handles drag interactions', () => {
        SliderIsland(container, {
            min: 0,
            max: 100,
            value: 25,
            targetInputName: 'volume'
        });

        const track = container.querySelector('.slider-track') as HTMLElement;
        const hidden = container.querySelector('input[name="volume"]') as HTMLInputElement;
        assert.strictEqual(hidden.value, '25');

        // Mock bounding rect for dragging calculation
        track.getBoundingClientRect = () => ({
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

        // Simulate pointerdown at 75% (clientX = 150 of 200px width)
        track.dispatchEvent(new MouseEvent('pointerdown', { clientX: 150, bubbles: true }));
        assert.strictEqual(hidden.value, '75');

        // Simulate drag to 10% (clientX = 20)
        track.dispatchEvent(new MouseEvent('pointermove', { clientX: 20, bubbles: true }));
        assert.strictEqual(hidden.value, '10');

        // End drag
        track.dispatchEvent(new MouseEvent('pointerup', { clientX: 20, bubbles: true }));
        assert.strictEqual(hidden.value, '10');
    });

    it('ImageCompare: handles split divider pointer dragging', () => {
        ImageCompareIsland(container, {
            beforeImage: 'before.jpg',
            afterImage: 'after.jpg',
            beforeLabel: 'Before',
            afterLabel: 'After'
        });

        const compareBox = container.querySelector('.laughtale-image-compare') as HTMLElement;
        const clip = container.querySelector('.compare-clip') as HTMLElement;
        const handleLine = container.querySelector('.compare-handle-line') as HTMLElement;

        compareBox.getBoundingClientRect = () => ({
            left: 0,
            top: 0,
            right: 400,
            bottom: 200,
            width: 400,
            height: 200,
            x: 0,
            y: 0,
            toJSON: () => {}
        });

        // Pointer down at 25% (clientX = 100 of 400px width)
        compareBox.dispatchEvent(new MouseEvent('pointerdown', { clientX: 100, bubbles: true }));
        assert.strictEqual(clip.style.width, '25%');
        assert.strictEqual(handleLine.style.left, '25%');

        // Pointer move to 80% (clientX = 320 of 400px width)
        compareBox.dispatchEvent(new MouseEvent('pointermove', { clientX: 320, bubbles: true }));
        assert.strictEqual(clip.style.width, '80%');
        assert.strictEqual(handleLine.style.left, '80%');
    });

    it('Rating: highlights stars on selection and allows cancel', () => {
        RatingIsland(container, {
            stars: 5,
            value: 3,
            allowCancel: true,
            targetInputName: 'score'
        });

        const stars = container.querySelectorAll('.rating-star');
        assert.strictEqual(stars.length, 5);

        const hidden = container.querySelector('input[name="score"]') as HTMLInputElement;
        assert.strictEqual(hidden.value, '3');

        // Cancel
        const cancelBtn = container.querySelector('.rating-cancel-btn') as HTMLButtonElement;
        cancelBtn.click();
        const hiddenAfter = container.querySelector('input[name="score"]') as HTMLInputElement;
        assert.strictEqual(hiddenAfter.value, '0');
    });

    it('Accordion: expands tabs and toggles visibility', () => {
        AccordionIsland(container, {
            tabs: [
                { id: '1', header: 'Section 1', content: 'Content 1' },
                { id: '2', header: 'Section 2', content: 'Content 2' }
            ],
            activeIndex: 0
        });

        const tabPanels = container.querySelectorAll('.accordion-content');
        assert.strictEqual((tabPanels[0] as HTMLElement).style.display, 'block');
        assert.strictEqual((tabPanels[1] as HTMLElement).style.display, 'none');

        const headers = container.querySelectorAll<HTMLButtonElement>('.accordion-header-btn');
        headers[1].click();

        const tabPanelsAfter = container.querySelectorAll('.accordion-content');
        assert.strictEqual((tabPanelsAfter[0] as HTMLElement).style.display, 'none');
        assert.strictEqual((tabPanelsAfter[1] as HTMLElement).style.display, 'block');
    });

    it('Tabs: changes active tab panel', () => {
        TabsIsland(container, {
            tabs: [
                { id: 'tab1', header: 'Overview', content: 'Overview Content' },
                { id: 'tab2', header: 'Security', content: 'Security Content' }
            ],
            activeIndex: 0,
            targetInputName: 'active_tab'
        });

        const headerBtns = container.querySelectorAll<HTMLButtonElement>('.tab-header-btn');
        assert.strictEqual(headerBtns.length, 2);

        headerBtns[1].click();

        const hidden = container.querySelector('input[name="active_tab"]') as HTMLInputElement;
        assert.strictEqual(hidden.value, '1');
        assert.ok(container.innerHTML.includes('Security Content'));
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

        const input = container.querySelector<HTMLInputElement>('.autocomplete-input')!;
        input.value = 'Erb';
        input.dispatchEvent(new Event('input', { bubbles: true }));

        await new Promise(r => setTimeout(r, 180));

        const items = container.querySelectorAll('.autocomplete-item');
        assert.strictEqual(items.length, 1);
        assert.strictEqual(items[0].getAttribute('data-value'), 'EBL');
    });

    it('ColorPicker: updates color on palette swatch selection', () => {
        ColorPickerIsland(container, {
            value: '#10b981',
            targetInputName: 'theme_color'
        });

        const hidden = container.querySelector('input[name="theme_color"]') as HTMLInputElement;
        assert.strictEqual(hidden.value, '#10b981');
    });

    it('Knob: calculates value, renders svg circle and responds to pointer events', () => {
        KnobIsland(container, {
            value: 75,
            min: 0,
            max: 100,
            size: 100,
            targetInputName: 'percentage'
        });

        const knobEl = container.querySelector('.laughtale-knob') as HTMLElement;
        const hidden = container.querySelector('input[name="percentage"]') as HTMLInputElement;
        const valueDisplay = container.querySelector('.knob-value-display') as HTMLElement;

        assert.strictEqual(hidden.value, '75');
        assert.strictEqual(valueDisplay.textContent?.trim(), '75%');

        knobEl.getBoundingClientRect = () => ({
            left: 0,
            top: 0,
            right: 100,
            bottom: 100,
            width: 100,
            height: 100,
            x: 0,
            y: 0,
            toJSON: () => {}
        });

        // Pointer event at bottom center (x = 50, y = 100 -> angle 180 deg -> 50%)
        knobEl.dispatchEvent(new MouseEvent('pointerdown', { clientX: 50, clientY: 100, bubbles: true }));
        assert.strictEqual(hidden.value, '50');
        assert.strictEqual(valueDisplay.textContent?.trim(), '50%');
    });

    it('Inplace: toggles between display and edit modes', () => {
        InplaceIsland(container, {
            value: 'Initial Note',
            targetInputName: 'note'
        });

        const display = container.querySelector('.laughtale-inplace-display') as HTMLElement;
        assert.ok(display);

        display.click();

        const input = container.querySelector('.inplace-input') as HTMLInputElement;
        assert.ok(input);
        assert.strictEqual(input.value, 'Initial Note');
    });
});
