import '../setup.ts';
import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import MenuIsland from '../../src/components/menu.ts';
import PopoverIsland from '../../src/components/popover.ts';
import ContextMenuIsland from '../../src/components/context-menu.ts';
import ConfirmPopupIsland from '../../src/components/confirm-popup.ts';
import SplitButtonIsland from '../../src/components/split-button.ts';

describe('Batch A Overlays Placement Suite (US1 / T019)', () => {
    beforeEach(() => {
        (window as any).innerWidth = 1000;
        (window as any).innerHeight = 800;
        Object.defineProperty(window, 'scrollX', { value: 0, writable: true, configurable: true });
        Object.defineProperty(window, 'scrollY', { value: 0, writable: true, configurable: true });
        document.body.innerHTML = '';
    });

    it('menu flips to top near the bottom viewport edge', () => {
        const trigger = document.createElement('button');
        trigger.id = 'menu-btn';
        trigger.getBoundingClientRect = () => ({
            top: 750, bottom: 780, left: 100, right: 220, width: 120, height: 30, x: 100, y: 750, toJSON: () => {}
        });
        document.body.appendChild(trigger);

        const container = document.createElement('div');
        document.body.appendChild(container);

        MenuIsland(container, {
            triggerId: 'menu-btn',
            popup: true,
            model: [{ label: 'Item 1' }, { label: 'Item 2' }, { label: 'Item 3' }]
        });

        trigger.click();

        const menuEl = document.querySelector<HTMLElement>('.p-menu');
        assert.ok(menuEl, 'Menu popup should be mounted');
        
        // Mock menuEl size
        menuEl.getBoundingClientRect = () => ({
            top: 0, bottom: 150, left: 0, right: 150, width: 150, height: 150, x: 0, y: 0, toJSON: () => {}
        });

        // Current unclamped behavior leaves it at rect.bottom + 4 = 784px (overflowing 800px viewport)
        // With useFloatingPosition, top must flip above trigger (top < 750)
        const topPx = parseInt(menuEl.style.top || '0', 10);
        assert.ok(topPx < 750, `Menu top (${topPx}px) should flip above trigger (< 750px)`);
    });

    it('popover follows its anchor on scroll', () => {
        let anchorY = 200;
        const target = document.createElement('button');
        target.id = 'pop-btn';
        target.getBoundingClientRect = () => ({
            top: anchorY, bottom: anchorY + 40, left: 200, right: 300, width: 100, height: 40, x: 200, y: anchorY, toJSON: () => {}
        });
        document.body.appendChild(target);

        const popoverEl = document.createElement('div');
        document.body.appendChild(popoverEl);

        PopoverIsland(popoverEl, {
            target: target,
            placement: 'bottom',
            showArrow: true
        });

        target.click(); // opens popover
        const initialTop = parseInt(popoverEl.style.top || '0', 10);

        // Anchor moves on scroll
        anchorY = 300;
        window.dispatchEvent(new Event('scroll'));

        const updatedTop = parseInt(popoverEl.style.top || '0', 10);
        assert.ok(updatedTop > initialTop, `Popover top (${updatedTop}px) should follow anchor on scroll (> ${initialTop}px)`);
    });

    it('context-menu opens up-and-left at the bottom-right corner', () => {
        const container = document.createElement('div');
        document.body.appendChild(container);

        ContextMenuIsland(container, {
            model: [{ label: 'Cut' }, { label: 'Copy' }, { label: 'Paste' }]
        });

        const menuEl = container.querySelector<HTMLElement>('.p-contextmenu')!;
        menuEl.getBoundingClientRect = () => ({
            top: 0, bottom: 180, left: 0, right: 200, width: 200, height: 180, x: 0, y: 0, toJSON: () => {}
        });

        // Right-click at (990, 790) near bottom-right edge of 1000x800 viewport
        const event = new MouseEvent('contextmenu', {
            clientX: 990,
            clientY: 790,
            bubbles: true
        });
        document.dispatchEvent(event);

        const leftPx = parseInt(menuEl.style.left || '0', 10);
        const topPx = parseInt(menuEl.style.top || '0', 10);

        // Must open within viewport bounds and flip left & up
        assert.ok(leftPx <= 1000 - 200 - 8, `Context menu left (${leftPx}) must stay within viewport`);
        assert.ok(topPx <= 800 - 180 - 8, `Context menu top (${topPx}) must stay within viewport`);
    });

    it('confirm-popup keeps document coordinates with strategy: absolute', () => {
        Object.defineProperty(window, 'scrollX', { value: 150, writable: true, configurable: true });
        Object.defineProperty(window, 'scrollY', { value: 300, writable: true, configurable: true });

        const container = document.createElement('div');
        document.body.appendChild(container);
        if ((window as any).$confirmPopup) {
            (window as any).$confirmPopup.popupEl = null;
        }
        ConfirmPopupIsland(container, {});

        const target = document.createElement('button');
        target.getBoundingClientRect = () => ({
            top: 100, bottom: 140, left: 200, right: 300, width: 100, height: 40, x: 200, y: 100, toJSON: () => {}
        });
        document.body.appendChild(target);

        (window as any).$confirmPopup.require({
            target,
            message: 'Are you sure?'
        });

        const popupEl = document.querySelector<HTMLElement>('.p-confirmpopup')!;
        assert.ok(popupEl, 'Confirm popup should be rendered');
        assert.equal(popupEl.style.position, 'absolute');

        const topPx = parseInt(popupEl.style.top || '0', 10);
        // With scrollY = 300, top = 140 + 300 + 10 = 450
        assert.ok(topPx >= 440 && topPx <= 460, `Confirm popup top (${topPx}px) must include scrollY (around 450px)`);
    });

    it('split-button flips above when it does not fit below', () => {
        const container = document.createElement('div');
        container.getBoundingClientRect = () => ({
            top: 720, bottom: 760, left: 100, right: 250, width: 150, height: 40, x: 100, y: 720, toJSON: () => {}
        });
        document.body.appendChild(container);

        SplitButtonIsland(container, {
            label: 'Save',
            model: [{ label: 'Save & Close' }, { label: 'Save & New' }]
        });

        const menuEl = container.querySelector<HTMLElement>('.p-splitbutton-menu')!;
        menuEl.getBoundingClientRect = () => ({
            top: 0, bottom: 150, left: 0, right: 150, width: 150, height: 150, x: 0, y: 0, toJSON: () => {}
        });

        const dropdownBtn = container.querySelector<HTMLButtonElement>('.p-splitbutton-dropdown')!;
        dropdownBtn.click();

        // Must flip when not fitting below
        assert.ok(
            menuEl.classList.contains('p-menu-flipped') || parseInt(menuEl.style.top || '999', 10) < 720,
            'Split button menu must flip above when space below is insufficient'
        );
    });
});
