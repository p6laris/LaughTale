import '../setup.ts';
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import KnobIsland from '../../src/components/knob.ts';
import MultiSelectIsland from '../../src/components/multiselect.ts';
import RadioButtonIsland from '../../src/components/radio-button.ts';
import FileUploadIsland from '../../src/components/fileupload.ts';

describe('Keyboard Operability Suite (SC-001 / US1)', () => {
    it('knob responds to Arrow, Home, End keyboard controls', () => {
        const container = document.createElement('div');
        document.body.appendChild(container);

        KnobIsland(container, { value: 50, min: 0, max: 100, step: 5, valueTemplate: '{value}' });

        const knobEl = container.querySelector<HTMLElement>('.laughtale-knob');
        assert.ok(knobEl, 'knob root exists');
        assert.equal(knobEl.getAttribute('tabindex'), '0', 'knob must be keyboard focusable');

        const valueDisplay = container.querySelector<HTMLElement>('.knob-value-display')!;
        assert.equal(valueDisplay.textContent?.trim(), '50');

        // ArrowUp should increment by step (5)
        knobEl.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true, cancelable: true }));
        assert.equal(valueDisplay.textContent?.trim(), '55');

        // ArrowDown should decrement by step (5)
        knobEl.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, cancelable: true }));
        assert.equal(valueDisplay.textContent?.trim(), '50');

        // Home should set to min (0)
        knobEl.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true, cancelable: true }));
        assert.equal(valueDisplay.textContent?.trim(), '0');

        // End should set to max (100)
        knobEl.dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true, cancelable: true }));
        assert.equal(valueDisplay.textContent?.trim(), '100');

        container.remove();
    });

    it('multiselect opens, navigates, and selects via keyboard alone', () => {
        const container = document.createElement('div');
        document.body.appendChild(container);

        MultiSelectIsland(container, {
            options: [
                { label: 'Option 1', value: 'opt1' },
                { label: 'Option 2', value: 'opt2' }
            ]
        });

        const trigger = container.querySelector<HTMLElement>('.multiselect-trigger')!;
        assert.ok(trigger, 'trigger exists');
        assert.equal(trigger.getAttribute('tabindex'), '0', 'trigger must be keyboard focusable');

        const overlay = container.querySelector<HTMLElement>('.multiselect-overlay')!;
        assert.equal(overlay.style.display, 'none', 'overlay closed initially');

        // Press Enter or ArrowDown to open
        trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, cancelable: true }));
        assert.notEqual(overlay.style.display, 'none', 'overlay must open on ArrowDown');

        // Press Enter on filterInput to select active item
        const filterInput = container.querySelector<HTMLInputElement>('.multiselect-filter-input')!;
        filterInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true }));
        
        const labels = container.querySelector<HTMLElement>('.multiselect-label-container')!;
        assert.ok(labels.textContent?.includes('Option 1'), 'Option 1 should be selected');

        container.remove();
    });

    it('radio-button navigates options via arrow keys with roving tabindex', () => {
        const container = document.createElement('div');
        document.body.appendChild(container);

        RadioButtonIsland(container, {
            name: 'city',
            options: [
                { label: 'Rome', value: 'RM' },
                { label: 'Paris', value: 'PRS' }
            ]
        });

        const radios = Array.from(container.querySelectorAll<HTMLElement>('.p-radiobutton-root, .p-radiobutton'));
        assert.ok(radios.length >= 2, 'at least 2 radio options rendered');

        // Roving tabindex: exactly one active tab stop (tabindex 0), other is -1
        const focusable = radios.filter(r => r.getAttribute('tabindex') === '0');
        assert.equal(focusable.length, 1, 'exactly one radio has tabindex="0"');

        // Press ArrowDown or ArrowRight to move to next radio
        const firstRadio = focusable[0];
        firstRadio.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, cancelable: true }));

        // Now the second radio should have tabindex="0"
        const nextFocusable = radios.filter(r => r.getAttribute('tabindex') === '0');
        assert.equal(nextFocusable.length, 1);
        assert.notEqual(nextFocusable[0], firstRadio, 'active radio moved to second option');

        container.remove();
    });

    it('fileupload opens file picker on Enter or Space', () => {
        const container = document.createElement('div');
        document.body.appendChild(container);

        FileUploadIsland(container, { mode: 'basic' });

        const chooseBtn = container.querySelector<HTMLElement>('.p-fileupload-choose')!;
        assert.ok(chooseBtn, 'choose button exists');
        assert.equal(chooseBtn.getAttribute('tabindex'), '0', 'choose button must have tabindex="0"');

        let clickTriggered = false;
        const input = container.querySelector<HTMLInputElement>('input[type="file"]')!;
        assert.ok(input, 'file input exists');
        input.addEventListener('click', (e) => {
            clickTriggered = true;
            e.preventDefault(); // prevent real browser dialog in test
        });

        // Press Enter on choose button
        chooseBtn.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true }));
        assert.equal(clickTriggered, true, 'Enter key must trigger file input click');

        container.remove();
    });
});
