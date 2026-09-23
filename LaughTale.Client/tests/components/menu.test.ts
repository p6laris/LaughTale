import '../setup.ts';
import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import MenuIsland from '../../src/components/menu.ts';

// ROADMAP.v5.md Part M "Adopt - State machine": menu.ts's popup mode had a raw `isOpen` boolean, and
// its teardown (destroy the floating-position controller, remove the popup element, unbind the
// outside-click listener) only ever ran inside the outside-click handler ITSELF - every other close
// path (menu-item click, Escape) called closePopup() but that just flipped the boolean, leaving the
// stale outside-click listener bound to `document` forever. Reopening then bound a SECOND listener on
// top of it. These tests prove that's fixed: however the popup closes, reopening it and clicking
// outside exactly once must close it again - never leaving a duplicated listener behind.

function wait(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const model = [
    { label: 'New File', command: 'new-file' },
    { label: 'Search', command: 'search' }
];

describe('Menu Popup Disclosure Suite (ROADMAP.v5.md Part M)', () => {
    let trigger: HTMLButtonElement;
    let container: HTMLElement;

    beforeEach(() => {
        document.body.innerHTML = '';
        trigger = document.createElement('button');
        trigger.id = 'menu-trigger';
        document.body.appendChild(trigger);

        container = document.createElement('div');
        document.body.appendChild(container);
    });

    function mount() {
        MenuIsland(container, { model, popup: true, triggerId: 'menu-trigger' }, { signal: new AbortController().signal } as any);
    }

    function getPopup(): HTMLElement | null {
        return document.querySelector('.p-menu-popup-wrapper');
    }

    it('clicking the trigger opens the popup', () => {
        mount();
        trigger.click();

        assert.ok(getPopup(), 'the popup wrapper must be appended to the body');
    });

    it('clicking the trigger again closes it (toggle)', () => {
        mount();
        trigger.click();
        assert.ok(getPopup());

        trigger.click();
        assert.equal(getPopup(), null);
    });

    it('clicking outside closes the popup', async () => {
        mount();
        trigger.click();
        await wait(10); // the outside-click listener binds via a 0ms setTimeout

        document.body.dispatchEvent(new MouseEvent('click', { bubbles: true }));

        assert.equal(getPopup(), null);
    });

    it('selecting a menu item command closes the popup', () => {
        mount();
        trigger.click();
        const popup = getPopup()!;
        const link = popup.querySelector<HTMLElement>('.p-menu-item-link');

        link?.click();

        assert.equal(getPopup(), null);
    });

    it('after closing via a menu-item click (not an outside click), reopening and clicking outside ONCE still closes it - no accumulated listener (the real bug this retrofit fixes)', async () => {
        mount();

        // Cycle 1: open, then close via item click - the path that used to leak a listener.
        trigger.click();
        getPopup()!.querySelector<HTMLElement>('.p-menu-item-link')?.click();
        assert.equal(getPopup(), null);

        // Cycle 2: open again, close via outside click.
        trigger.click();
        await wait(10);
        assert.ok(getPopup(), 'must be able to reopen after the item-click close path');

        document.body.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        assert.equal(getPopup(), null, 'a single outside click must close it - proves no duplicated listener from cycle 1 is still armed');
    });

    it('repeated close (double toggle) does not throw', () => {
        mount();
        trigger.click();
        assert.doesNotThrow(() => trigger.click());
        assert.doesNotThrow(() => trigger.click());
    });
});
