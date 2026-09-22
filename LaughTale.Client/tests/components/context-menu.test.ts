import '../setup.ts';
import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import ContextMenuIsland from '../../src/components/context-menu.ts';

// ROADMAP.v5.md Part M "Adopt - State machine": context-menu.ts's showMenu()/hideMenu() already
// centralized their own DOM work before this retrofit (unlike tieredmenu.ts's three inconsistent
// close sites) - this migration is a smaller, lower-risk swap of the raw `isMenuOpen` boolean for
// `useDisclosure`'s guarded tracking, verified here to make sure the swap itself didn't change any
// observable behavior.

function wait(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const items = [{ label: 'Copy' }, { label: 'Paste' }, { label: 'Delete' }];

describe('ContextMenu Disclosure Suite (ROADMAP.v5.md Part M)', () => {
    let container: HTMLElement;

    beforeEach(() => {
        document.body.innerHTML = '';
        container = document.createElement('div');
        document.body.appendChild(container);
    });

    function mount() {
        ContextMenuIsland(container, { items, global: true, demoType: 'global' });
        const menu = container.querySelector<HTMLElement>('[data-contextmenu-root]')!;
        return menu;
    }

    it('starts closed', () => {
        const menu = mount();
        assert.equal(menu.classList.contains('p-contextmenu-active'), false);
    });

    it('right-clicking the container opens the menu', async () => {
        const menu = mount();

        container.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, clientX: 50, clientY: 50 }));
        await wait(20); // the open flag flips inside a requestAnimationFrame (mocked as setTimeout in tests/setup.ts)

        assert.equal(menu.classList.contains('p-contextmenu-active'), true);
    });

    it('clicking outside closes an open menu', async () => {
        const menu = mount();
        container.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, clientX: 50, clientY: 50 }));
        await wait(20);
        assert.equal(menu.classList.contains('p-contextmenu-active'), true);

        const outside = document.createElement('div');
        document.body.appendChild(outside);
        outside.dispatchEvent(new MouseEvent('click', { bubbles: true }));

        assert.equal(menu.classList.contains('p-contextmenu-active'), false);
    });

    it('Escape closes an open menu', async () => {
        const menu = mount();
        container.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, clientX: 50, clientY: 50 }));
        await wait(20);
        assert.equal(menu.classList.contains('p-contextmenu-active'), true);

        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));

        assert.equal(menu.classList.contains('p-contextmenu-active'), false);
    });

    it('clicking an item closes the menu and emits a select event', async () => {
        const menu = mount();
        container.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, clientX: 50, clientY: 50 }));
        await wait(20);

        let selectedLabel: string | undefined;
        container.addEventListener('laughtale:context-menu:select', ((e: CustomEvent) => {
            selectedLabel = e.detail?.label;
        }) as EventListener);

        const copyItem = [...menu.querySelectorAll<HTMLElement>('[data-item-label]')]
            .find(el => el.getAttribute('data-item-label') === 'Copy')!;
        copyItem.click();

        assert.equal(menu.classList.contains('p-contextmenu-active'), false);
        assert.equal(selectedLabel, 'Copy');
    });

    it('hideMenu on an already-closed menu is a safe no-op (the disclosure guard)', () => {
        const menu = mount();

        // Escape (or any close trigger) fired while already closed must not throw or misbehave.
        const ex = () => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
        assert.doesNotThrow(ex);
        assert.equal(menu.classList.contains('p-contextmenu-active'), false);
    });
});
