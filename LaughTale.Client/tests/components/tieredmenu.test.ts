import '../setup.ts';
import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import TieredMenuIsland from '../../src/components/tieredmenu.ts';

// ROADMAP.v5.md Part M "Adopt - State machine": tieredmenu.ts's popup mode had its own raw `isOpen`
// variable with three separate, slightly-inconsistent close sites (outside-click destroyed the
// floating-position controller and reset aria-expanded; item-click and Escape did not). Migrated
// onto useDisclosure's onOpen/onClose so every close path now shares identical side effects - these
// tests cover that real behavior, not just that the component still renders.

const model = [
    { label: 'File', items: [{ label: 'New' }, { label: 'Open' }] },
    { label: 'Edit', command: 'edit-cmd' }
];

describe('TieredMenu Popup Disclosure Suite (ROADMAP.v5.md Part M)', () => {
    let container: HTMLElement;

    beforeEach(() => {
        document.body.innerHTML = '';
        container = document.createElement('div');
        document.body.appendChild(container);
    });

    function mountPopup() {
        TieredMenuIsland(container, { model, popup: true, triggerText: 'Menu' });
        const trigger = container.querySelector<HTMLButtonElement>('[data-tieredmenu-trigger]')!;
        const root = container.querySelector<HTMLElement>('[data-tieredmenu-root]')!;
        return { trigger, root };
    }

    it('starts closed (display: none, aria-expanded false) in popup mode', () => {
        const { trigger, root } = mountPopup();

        assert.equal(root.style.display, 'none');
        assert.equal(trigger.getAttribute('aria-expanded'), 'false');
    });

    it('clicking the trigger opens the menu and sets aria-expanded', () => {
        const { trigger, root } = mountPopup();

        trigger.click();

        assert.equal(root.style.display, 'block');
        assert.equal(trigger.getAttribute('aria-expanded'), 'true');
    });

    it('clicking the trigger again closes it (toggle)', () => {
        const { trigger, root } = mountPopup();

        trigger.click();
        assert.equal(root.style.display, 'block');

        trigger.click();
        assert.equal(root.style.display, 'none');
        assert.equal(trigger.getAttribute('aria-expanded'), 'false');
    });

    it('clicking outside closes the menu and resets aria-expanded (the previously-inconsistent path)', () => {
        const { trigger, root } = mountPopup();
        trigger.click();
        assert.equal(root.style.display, 'block');

        const outside = document.createElement('div');
        document.body.appendChild(outside);
        outside.dispatchEvent(new MouseEvent('click', { bubbles: true }));

        assert.equal(root.style.display, 'none');
        assert.equal(trigger.getAttribute('aria-expanded'), 'false', 'outside-click close must reset aria-expanded, same as every other close path');
    });

    it('Escape closes the menu via the same guarded path as outside-click', () => {
        const { trigger, root } = mountPopup();
        trigger.click();
        assert.equal(root.style.display, 'block');

        root.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));

        assert.equal(root.style.display, 'none');
        assert.equal(trigger.getAttribute('aria-expanded'), 'false');
    });

    it('clicking a leaf item command closes the popup and resets aria-expanded (previously did not)', () => {
        const { trigger, root } = mountPopup();
        trigger.click();
        assert.equal(root.style.display, 'block');

        const editLink = [...root.querySelectorAll<HTMLElement>('.p-tieredmenu-item-link')]
            .find(a => a.getAttribute('data-item-label') === 'Edit')!;
        editLink.click();

        assert.equal(root.style.display, 'none', 'selecting a leaf command item must close the popup');
        assert.equal(trigger.getAttribute('aria-expanded'), 'false', 'item-click close must reset aria-expanded too, same as outside-click - this is the exact inconsistency the retrofit fixed');
    });

    it('non-popup mode starts open and stays open regardless of outside clicks', () => {
        TieredMenuIsland(container, { model, popup: false });
        const root = container.querySelector<HTMLElement>('[data-tieredmenu-root]')!;

        // Non-popup mode never sets display:none via JS - it's always visible.
        assert.notEqual(root.style.display, 'none');

        document.body.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        assert.notEqual(root.style.display, 'none', 'non-popup (inline) menus must never be dismissed by an outside click');
    });
});
