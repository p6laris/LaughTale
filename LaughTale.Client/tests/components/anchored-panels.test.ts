import '../setup.ts';
import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import AutoCompleteIsland from '../../src/components/autocomplete.ts';
import DatePickerIsland from '../../src/components/datepicker.ts';
import TreeSelectIsland from '../../src/components/tree-select.ts';
import MultiSelectIsland from '../../src/components/multiselect.ts';
import ColorPickerIsland from '../../src/components/color-picker.ts';
import SelectIsland from '../../src/components/select.ts';

describe('Batch C Anchored Panels Suite (US1 / T045)', () => {
    beforeEach(() => {
        (window as any).innerWidth = 1000;
        (window as any).innerHeight = 800;
        Object.defineProperty(window, 'scrollX', { value: 0, writable: true, configurable: true });
        Object.defineProperty(window, 'scrollY', { value: 0, writable: true, configurable: true });
        document.body.innerHTML = '';
    });

    it('autocomplete: panel flips above trigger near bottom viewport edge and tracks anchor on scroll', () => {
        let anchorY = 750;
        const container = document.createElement('div');
        document.body.appendChild(container);

        AutoCompleteIsland(container, {
            suggestions: ['Apple', 'Banana', 'Cherry'],
            dropdown: true
        });

        const trigger = container.querySelector<HTMLElement>('.laughtale-autocomplete') || container;
        trigger.getBoundingClientRect = () => ({
            top: anchorY, bottom: anchorY + 38, left: 100, right: 300, width: 200, height: 38, x: 100, y: anchorY, toJSON: () => {}
        });

        const overlay = container.querySelector<HTMLElement>('.ac-overlay')!;
        overlay.getBoundingClientRect = () => ({
            top: 0, bottom: 150, left: 0, right: 200, width: 200, height: 150, x: 0, y: 0, toJSON: () => {}
        });

        const dropdownBtn = container.querySelector<HTMLButtonElement>('.ac-dropdown-btn')!;
        dropdownBtn.click();

        // Overlay should flip above anchor (top < 750)
        const topPx = parseInt(overlay.style.top || '0', 10);
        assert.ok(topPx < 750, `Autocomplete overlay top (${topPx}px) should flip above trigger (< 750px)`);

        // Scroll tracking
        anchorY = 600;
        window.dispatchEvent(new Event('scroll'));
        const updatedTop = parseInt(overlay.style.top || '0', 10);
        assert.ok(updatedTop < topPx, `Autocomplete overlay should follow anchor on scroll (${updatedTop}px < ${topPx}px)`);
    });

    it('datepicker: panel flips above trigger near bottom viewport edge and tracks anchor on scroll', () => {
        let anchorY = 750;
        const container = document.createElement('div');
        document.body.appendChild(container);

        DatePickerIsland(container, {});

        const trigger = container.querySelector<HTMLElement>('.dp-trigger')!;
        trigger.getBoundingClientRect = () => ({
            top: anchorY, bottom: anchorY + 38, left: 100, right: 300, width: 200, height: 38, x: 100, y: anchorY, toJSON: () => {}
        });

        const overlay = container.querySelector<HTMLElement>('.dp-overlay')!;
        overlay.getBoundingClientRect = () => ({
            top: 0, bottom: 250, left: 0, right: 300, width: 300, height: 250, x: 0, y: 0, toJSON: () => {}
        });

        trigger.click();

        const topPx = parseInt(overlay.style.top || '0', 10);
        assert.ok(topPx < 750, `DatePicker overlay top (${topPx}px) should flip above trigger (< 750px)`);

        anchorY = 600;
        window.dispatchEvent(new Event('scroll'));
        const updatedTop = parseInt(overlay.style.top || '0', 10);
        assert.ok(updatedTop < topPx, `DatePicker overlay should follow anchor on scroll (${updatedTop}px < ${topPx}px)`);
    });

    it('tree-select: panel flips above trigger near bottom viewport edge and tracks anchor on scroll', () => {
        let anchorY = 750;
        const container = document.createElement('div');
        document.body.appendChild(container);

        TreeSelectIsland(container, {
            options: [
                { key: '0', label: 'Documents', children: [{ key: '0-0', label: 'Work' }] }
            ]
        });

        const trigger = container.querySelector<HTMLElement>('.p-treeselect-trigger') || container;
        trigger.getBoundingClientRect = () => ({
            top: anchorY, bottom: anchorY + 38, left: 100, right: 300, width: 200, height: 38, x: 100, y: anchorY, toJSON: () => {}
        });

        const overlay = container.querySelector<HTMLElement>('.p-treeselect-overlay')!;
        overlay.getBoundingClientRect = () => ({
            top: 0, bottom: 200, left: 0, right: 200, width: 200, height: 200, x: 0, y: 0, toJSON: () => {}
        });

        trigger.click();

        const topPx = parseInt(overlay.style.top || '0', 10);
        assert.ok(topPx < 750, `TreeSelect overlay top (${topPx}px) should flip above trigger (< 750px)`);

        anchorY = 600;
        window.dispatchEvent(new Event('scroll'));
        const updatedTop = parseInt(overlay.style.top || '0', 10);
        assert.ok(updatedTop < topPx, `TreeSelect overlay should follow anchor on scroll (${updatedTop}px < ${topPx}px)`);
    });

    it('multiselect: panel flips above trigger near bottom viewport edge and tracks anchor on scroll', () => {
        let anchorY = 750;
        const container = document.createElement('div');
        document.body.appendChild(container);

        MultiSelectIsland(container, {
            options: ['Option 1', 'Option 2', 'Option 3']
        });

        const trigger = container.querySelector<HTMLElement>('.multiselect-trigger')!;
        trigger.getBoundingClientRect = () => ({
            top: anchorY, bottom: anchorY + 38, left: 100, right: 300, width: 200, height: 38, x: 100, y: anchorY, toJSON: () => {}
        });

        const overlay = container.querySelector<HTMLElement>('.multiselect-overlay')!;
        overlay.getBoundingClientRect = () => ({
            top: 0, bottom: 200, left: 0, right: 200, width: 200, height: 200, x: 0, y: 0, toJSON: () => {}
        });

        trigger.click();

        const topPx = parseInt(overlay.style.top || '0', 10);
        assert.ok(topPx < 750, `MultiSelect overlay top (${topPx}px) should flip above trigger (< 750px)`);

        anchorY = 600;
        window.dispatchEvent(new Event('scroll'));
        const updatedTop = parseInt(overlay.style.top || '0', 10);
        assert.ok(updatedTop < topPx, `MultiSelect overlay should follow anchor on scroll (${updatedTop}px < ${topPx}px)`);
    });

    it('color-picker: panel flips above trigger near bottom viewport edge and tracks anchor on scroll', () => {
        let anchorY = 750;
        const container = document.createElement('div');
        document.body.appendChild(container);

        ColorPickerIsland(container, {
            modelValue: '#10b981'
        });

        const trigger = container.querySelector<HTMLButtonElement>('.colorpicker-trigger-btn')!;
        trigger.getBoundingClientRect = () => ({
            top: anchorY, bottom: anchorY + 36, left: 100, right: 136, width: 36, height: 36, x: 100, y: anchorY, toJSON: () => {}
        });

        const overlay = container.querySelector<HTMLElement>('.colorpicker-palette-overlay')!;
        overlay.getBoundingClientRect = () => ({
            top: 0, bottom: 220, left: 0, right: 220, width: 220, height: 220, x: 0, y: 0, toJSON: () => {}
        });

        trigger.click();

        const topPx = parseInt(overlay.style.top || '0', 10);
        assert.ok(topPx < 750, `ColorPicker overlay top (${topPx}px) should flip above trigger (< 750px)`);

        anchorY = 600;
        window.dispatchEvent(new Event('scroll'));
        const updatedTop = parseInt(overlay.style.top || '0', 10);
        assert.ok(updatedTop < topPx, `ColorPicker overlay should follow anchor on scroll (${updatedTop}px < ${topPx}px)`);
    });

    it('select: panel flips above trigger near bottom viewport edge and tracks anchor on scroll', () => {
        let anchorY = 750;
        const container = document.createElement('div');
        document.body.appendChild(container);

        SelectIsland(container, {
            options: ['Alpha', 'Beta', 'Gamma']
        });

        const trigger = container.querySelector<HTMLElement>('.p-select-trigger-wrap') || container;
        trigger.getBoundingClientRect = () => ({
            top: anchorY, bottom: anchorY + 38, left: 100, right: 300, width: 200, height: 38, x: 100, y: anchorY, toJSON: () => {}
        });

        const overlay = container.querySelector<HTMLElement>('.p-select-overlay')!;
        overlay.getBoundingClientRect = () => ({
            top: 0, bottom: 180, left: 0, right: 200, width: 200, height: 180, x: 0, y: 0, toJSON: () => {}
        });

        trigger.click();

        const topPx = parseInt(overlay.style.top || '0', 10);
        assert.ok(topPx < 750, `Select overlay top (${topPx}px) should flip above trigger (< 750px)`);

        anchorY = 600;
        window.dispatchEvent(new Event('scroll'));
        const updatedTop = parseInt(overlay.style.top || '0', 10);
        assert.ok(updatedTop < topPx, `Select overlay should follow anchor on scroll (${updatedTop}px < ${topPx}px)`);
    });
});
