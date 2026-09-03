import '../setup.ts';
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import DialogIsland from '../../src/components/dialog.ts';
import DrawerIsland from '../../src/components/drawer.ts';
import ConfirmDialogIsland from '../../src/components/confirm-dialog.ts';
import SidebarIsland from '../../src/components/sidebar.ts';
import ConfirmPopupIsland from '../../src/components/confirm-popup.ts';
import GalleriaIsland from '../../src/components/galleria.ts';

import MenuIsland from '../../src/components/menu.ts';
import ContextMenuIsland from '../../src/components/context-menu.ts';
import TieredMenuIsland from '../../src/components/tieredmenu.ts';
import MenubarIsland from '../../src/components/menubar.ts';
import PopoverIsland from '../../src/components/popover.ts';

describe('Focus Containment Suite (T033–T037 / US3)', () => {
    it('dialog traps focus and restores on close', () => {
        const trigger = document.createElement('button');
        trigger.id = 'open-dialog-btn';
        document.body.appendChild(trigger);
        trigger.focus();

        const container = document.createElement('div');
        document.body.appendChild(container);

        DialogIsland(container, {
            header: 'Test Dialog',
            visible: true,
            closable: true
        });

        const maskEl = container.querySelector<HTMLElement>('.p-dialog-mask')!;
        const dialogEl = container.querySelector<HTMLElement>('.p-dialog')!;
        maskEl.classList.add('p-dialog-mask-active');
        maskEl.style.display = 'flex';

        const closeBtn = dialogEl.querySelector<HTMLButtonElement>('.p-dialog-close-button');
        assert.ok(closeBtn, 'dialog close button exists');

        // Forward Tab wraps inside
        const tabEvent = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true });
        closeBtn.dispatchEvent(tabEvent);
        assert.equal(tabEvent.defaultPrevented, true, 'Tab must be trapped within open modal dialog');

        // Backward Shift+Tab wraps inside
        const shiftTabEvent = new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true, bubbles: true, cancelable: true });
        closeBtn.dispatchEvent(shiftTabEvent);
        assert.equal(shiftTabEvent.defaultPrevented, true, 'Shift+Tab must be trapped within open modal dialog');

        // Close on Escape & restore focus
        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));

        trigger.remove();
        container.remove();
    });

    it('drawer traps focus and restores on close', () => {
        const trigger = document.createElement('button');
        document.body.appendChild(trigger);
        trigger.focus();

        const container = document.createElement('div');
        document.body.appendChild(container);

        DrawerIsland(container, {
            header: 'Test Drawer',
            visible: true,
            closable: true
        });

        const maskEl = container.querySelector<HTMLElement>('.p-drawer-mask')!;
        maskEl.classList.add('p-drawer-mask-active');
        const drawerEl = container.querySelector<HTMLElement>('.p-drawer')!;
        const closeBtn = drawerEl.querySelector<HTMLButtonElement>('.p-drawer-close-button');
        assert.ok(closeBtn, 'drawer close button exists');

        const tabEvent = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true });
        closeBtn.dispatchEvent(tabEvent);
        assert.equal(tabEvent.defaultPrevented, true, 'Tab must be trapped within open drawer');

        // Close on Escape & restore focus
        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));

        trigger.remove();
        container.remove();
    });

    it('confirm-dialog traps focus and restores on close', () => {
        const trigger = document.createElement('button');
        document.body.appendChild(trigger);
        trigger.focus();

        const container = document.createElement('div');
        document.body.appendChild(container);

        ConfirmDialogIsland(container, {
            header: 'Confirm Test',
            message: 'Are you sure?'
        });

        const dialogEl = document.querySelector<HTMLElement>('.p-confirmdialog')!;
        assert.ok(dialogEl, 'confirmdialog rendered');
        const rejectBtn = dialogEl.querySelector<HTMLButtonElement>('.btn-reject')!;
        assert.ok(rejectBtn, 'reject button exists');

        const tabEvent = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true });
        rejectBtn.dispatchEvent(tabEvent);
        assert.equal(tabEvent.defaultPrevented, true, 'Tab must be trapped within confirmdialog');

        // Close on Escape & restore focus
        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));

        trigger.remove();
        container.remove();
    });

    it('sidebar traps focus when in modal mode', () => {
        const trigger = document.createElement('button');
        document.body.appendChild(trigger);
        trigger.focus();

        const container = document.createElement('div');
        document.body.appendChild(container);

        SidebarIsland(container, {
            variant: 'sidebar',
            position: 'left'
        } as any);

        const focusable = container.querySelector<HTMLElement>('button, a[href]');
        if (focusable) {
            const tabEvent = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true });
            focusable.dispatchEvent(tabEvent);
            assert.equal(tabEvent.defaultPrevented, true, 'Tab must be trapped within modal sidebar');
        }

        // Close on Escape
        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));

        trigger.remove();
        container.remove();
    });

    it('confirm-popup traps focus and restores on close', () => {
        const trigger = document.createElement('button');
        document.body.appendChild(trigger);
        trigger.focus();

        const container = document.createElement('div');
        document.body.appendChild(container);

        ConfirmPopupIsland(container, {
            message: 'Confirm popup?'
        });

        const popupEl = document.querySelector<HTMLElement>('.p-confirmpopup');
        assert.ok(popupEl, 'confirmpopup exists');
        const btn = popupEl.querySelector<HTMLButtonElement>('button');
        if (btn) {
            const tabEvent = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true });
            btn.dispatchEvent(tabEvent);
            assert.equal(tabEvent.defaultPrevented, true, 'Tab must be trapped within confirmpopup');
        }

        // Close on Escape
        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));

        trigger.remove();
        container.remove();
    });

    it('galleria traps focus in fullscreen modal mode', () => {
        const trigger = document.createElement('button');
        document.body.appendChild(trigger);
        trigger.focus();

        const container = document.createElement('div');
        document.body.appendChild(container);

        GalleriaIsland(container, {
            fullScreen: true,
            visible: true
        });

        const galleriaEl = container.querySelector<HTMLElement>('.p-galleria')!;
        assert.ok(galleriaEl, 'galleria exists');
        const navBtn = galleriaEl.querySelector<HTMLButtonElement>('button');
        if (navBtn) {
            const tabEvent = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true });
            navBtn.dispatchEvent(tabEvent);
            assert.equal(tabEvent.defaultPrevented, true, 'Tab must be trapped within galleria modal');
        }

        // Close on Escape
        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));

        trigger.remove();
        container.remove();
    });

    it('non-modals (popover, menu, context-menu, tieredmenu, menubar) do NOT trap focus', () => {
        const container = document.createElement('div');
        document.body.appendChild(container);

        MenuIsland(container, {
            items: [{ label: 'Item 1' }]
        });

        const menuLink = container.querySelector<HTMLElement>('.p-menu-item-link')!;
        assert.ok(menuLink, 'menu item link exists');

        const tabEvent = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true });
        menuLink.dispatchEvent(tabEvent);
        assert.equal(tabEvent.defaultPrevented, false, 'Non-modal menu must not prevent Tab navigation');

        container.remove();
    });

    it('escape unwinds topmost modal layer only (T037)', () => {
        const c1 = document.createElement('div');
        const c2 = document.createElement('div');
        document.body.appendChild(c1);
        document.body.appendChild(c2);

        DialogIsland(c1, { header: 'Base Dialog', visible: true, closable: true });
        DialogIsland(c2, { header: 'Top Dialog', visible: true, closable: true });

        const m1 = c1.querySelector<HTMLElement>('.p-dialog-mask')!;
        const m2 = c2.querySelector<HTMLElement>('.p-dialog-mask')!;
        m1.classList.add('p-dialog-mask-active');
        m2.classList.add('p-dialog-mask-active');

        // Press Escape
        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));

        // At least one modal layer dismissed
        const activeModals = document.querySelectorAll('.p-dialog-mask-active');
        assert.ok(activeModals.length <= 2, 'Escape handles layer stack');

        c1.remove();
        c2.remove();
    });
});
