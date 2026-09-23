import '../setup.ts';
import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import MenubarIsland from '../../src/components/menubar.ts';

// ROADMAP.v5.md Part M "Adopt - State machine": menubar.ts's mobile hamburger drawer used a raw
// `isMobileMenuOpen` boolean written at 2 separate sites (the toggle button, the outside-click
// handler) - and the Escape handler, a THIRD site that closes cascading submenus, never touched it at
// all. A real, findable gap: pressing Escape while the mobile drawer was open closed any open submenu
// inside it but left the drawer itself open. These tests prove that's fixed.

const model = [
    { label: 'File', items: [{ label: 'New' }, { label: 'Open' }] },
    { label: 'Edit', command: 'edit-cmd' }
];

describe('Menubar Mobile Drawer Disclosure Suite (ROADMAP.v5.md Part M)', () => {
    let container: HTMLElement;

    beforeEach(() => {
        document.body.innerHTML = '';
        container = document.createElement('div');
        document.body.appendChild(container);
    });

    function mount() {
        MenubarIsland(container, { model }, { signal: new AbortController().signal } as any);
        const button = container.querySelector<HTMLButtonElement>('.p-menubar-button')!;
        const rootList = container.querySelector<HTMLElement>('.p-menubar-root-list')!;
        const menubarEl = container.querySelector<HTMLElement>('.p-menubar')!;
        return { button, rootList, menubarEl };
    }

    it('starts with the mobile drawer closed', () => {
        const { rootList } = mount();
        assert.equal(rootList.classList.contains('p-mobile-open'), false);
    });

    it('clicking the hamburger button opens the mobile drawer', () => {
        const { button, rootList } = mount();
        button.click();
        assert.equal(rootList.classList.contains('p-mobile-open'), true);
    });

    it('clicking the hamburger button again closes it (toggle)', () => {
        const { button, rootList } = mount();
        button.click();
        assert.equal(rootList.classList.contains('p-mobile-open'), true);

        button.click();
        assert.equal(rootList.classList.contains('p-mobile-open'), false);
    });

    it('clicking outside the menubar closes the mobile drawer', () => {
        const { button, rootList } = mount();
        button.click();
        assert.equal(rootList.classList.contains('p-mobile-open'), true);

        document.body.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        assert.equal(rootList.classList.contains('p-mobile-open'), false);
    });

    it('Escape closes the open mobile drawer (the real gap this retrofit fixes - previously only closed submenus)', () => {
        const { button, rootList, menubarEl } = mount();
        button.click();
        assert.equal(rootList.classList.contains('p-mobile-open'), true, 'precondition: drawer is open');

        menubarEl.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));

        assert.equal(rootList.classList.contains('p-mobile-open'), false, 'Escape must close the mobile drawer, not just any open submenu');
    });

    it('Escape also closes an open cascading submenu (existing behavior, unchanged)', () => {
        const { menubarEl } = mount();
        const fileItem = menubarEl.querySelector<HTMLElement>('.p-menubar-item');
        fileItem?.classList.add('p-active');

        menubarEl.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));

        assert.equal(fileItem?.classList.contains('p-active'), false);
    });

    it('repeated close (double toggle) does not throw', () => {
        const { button } = mount();
        button.click();
        assert.doesNotThrow(() => button.click());
        assert.doesNotThrow(() => button.click());
    });
});
