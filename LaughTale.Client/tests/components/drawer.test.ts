import '../setup.ts';
import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import DrawerIsland from '../../src/components/drawer.ts';

// ROADMAP.v5.md Part M "Adopt - State machine": drawer.ts's global delegation
// (data-drawer-target/data-drawer-open/data-drawer-close/backdrop-click) used to duplicate the
// mask active-class and body-overflow DOM sequence by hand, in three separate places, NONE of which
// called trap.activate()/trap.deactivate() - the same accessibility bug class already found and fixed
// in dialog.ts: a drawer opened via a data-attribute trigger never had focus trapped inside it. These
// tests prove that gap is closed - every path now routes through the same internal open/close handle
// (backed by useDisclosure) stashed on the container.

function wait(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function makeCtx(container: HTMLElement) {
    const controller = new AbortController();
    return {
        signal: controller.signal,
        onCleanup: (fn: () => void) => {
            controller.signal.addEventListener('abort', fn);
        },
        container,
        name: 'drawer',
        locale: 'en',
        dir: 'ltr' as const
    };
}

describe('Drawer Disclosure + Focus Trap Suite (ROADMAP.v5.md Part M)', () => {
    beforeEach(() => {
        document.body.innerHTML = '';
    });

    function mountDrawer(id: string) {
        const container = document.createElement('div');
        container.id = id;
        container.setAttribute('data-island', 'drawer');
        document.body.appendChild(container);

        const innerButton = document.createElement('button');
        innerButton.textContent = 'Inside Drawer';
        container.appendChild(innerButton);

        DrawerIsland(container, { header: 'Test Drawer', modal: true }, makeCtx(container));
        const maskEl = container.querySelector<HTMLElement>('.p-drawer-mask')!;
        return { container, maskEl, innerButton };
    }

    it('the internal instance handle opens and closes the drawer', () => {
        const { container, maskEl } = mountDrawer('dr1');
        const instance = (container as any).__ltDrawerInstance;

        instance.open();
        assert.equal(maskEl.classList.contains('p-drawer-mask-active'), true);

        instance.close();
        assert.equal(maskEl.classList.contains('p-drawer-mask-active'), false);
    });

    it('a data-drawer-open trigger opens the referenced drawer AND activates the focus trap (the real bug this retrofit fixes)', async () => {
        const outsideButton = document.createElement('button');
        outsideButton.textContent = 'Open Drawer';
        document.body.appendChild(outsideButton);

        const { container, maskEl } = mountDrawer('dr2');
        outsideButton.setAttribute('data-drawer-open', 'dr2');
        outsideButton.focus();

        outsideButton.click();

        assert.equal(maskEl.classList.contains('p-drawer-mask-active'), true, 'the mask must open via the delegated attribute trigger');

        await wait(20);
        // See dialog.test.ts for why this is container.contains(...) rather than a specific element,
        // and assert.ok rather than assert.equal/strictEqual (both happy-dom/node:test pitfalls).
        assert.ok(container.contains(document.activeElement) && document.activeElement !== outsideButton, 'focus must move INSIDE the drawer - the old duplicated delegation handler never triggered the focus trap');
    });

    it('the [data-drawer-close] button closes the drawer via the delegated path and restores focus to the trigger', async () => {
        const outsideButton = document.createElement('button');
        outsideButton.textContent = 'Open Drawer';
        document.body.appendChild(outsideButton);
        outsideButton.setAttribute('data-drawer-open', 'dr3');

        const { container, maskEl } = mountDrawer('dr3');
        const closeBtn = container.querySelector<HTMLElement>('[data-drawer-close]');

        outsideButton.focus();
        outsideButton.click();
        assert.equal(maskEl.classList.contains('p-drawer-mask-active'), true);
        await wait(20);

        closeBtn?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));

        assert.equal(maskEl.classList.contains('p-drawer-mask-active'), false, 'the delegated close-button path must close the drawer');
        assert.ok(document.activeElement === outsideButton, 'restoreFocus must return focus to the original trigger once the trap deactivates');
    });

    it('clicking the dismissable backdrop closes the drawer', () => {
        const { container, maskEl } = mountDrawer('dr4');
        const instance = (container as any).__ltDrawerInstance;
        instance.open();
        assert.equal(maskEl.classList.contains('p-drawer-mask-active'), true);

        maskEl.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));

        assert.equal(maskEl.classList.contains('p-drawer-mask-active'), false);
    });

    it('a non-dismissable modal backdrop click does NOT close the drawer', () => {
        const container = document.createElement('div');
        container.id = 'dr5';
        container.setAttribute('data-island', 'drawer');
        container.setAttribute('data-props', JSON.stringify({ modal: true, dismissableMask: false }));
        document.body.appendChild(container);

        DrawerIsland(container, { modal: true, dismissableMask: false }, makeCtx(container));
        const maskEl = container.querySelector<HTMLElement>('.p-drawer-mask')!;
        const instance = (container as any).__ltDrawerInstance;
        instance.open();
        assert.equal(maskEl.classList.contains('p-drawer-mask-active'), true);

        maskEl.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));

        assert.equal(maskEl.classList.contains('p-drawer-mask-active'), true, 'a non-dismissable modal must stay open on backdrop click');
    });

    it('Escape closes an open drawer', () => {
        const { container, maskEl } = mountDrawer('dr6');
        const instance = (container as any).__ltDrawerInstance;
        instance.open();
        assert.equal(maskEl.classList.contains('p-drawer-mask-active'), true);

        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));

        assert.equal(maskEl.classList.contains('p-drawer-mask-active'), false);
    });

    it('repeated close() calls on an already-closed drawer are a safe no-op (the disclosure guard)', () => {
        const { container } = mountDrawer('dr7');
        const instance = (container as any).__ltDrawerInstance;

        assert.doesNotThrow(() => instance.close());
        assert.doesNotThrow(() => instance.close());
    });

    it('the visible prop opens the drawer on mount', () => {
        const container = document.createElement('div');
        container.id = 'dr8';
        container.setAttribute('data-island', 'drawer');
        document.body.appendChild(container);

        DrawerIsland(container, { visible: true }, makeCtx(container));
        const maskEl = container.querySelector<HTMLElement>('.p-drawer-mask')!;

        assert.equal(maskEl.classList.contains('p-drawer-mask-active'), true);
    });

    it('a data-drawer-position override on the trigger repositions the drawer before it opens', () => {
        const outsideButton = document.createElement('button');
        outsideButton.setAttribute('data-drawer-open', 'dr9');
        outsideButton.setAttribute('data-drawer-position', 'right');
        document.body.appendChild(outsideButton);

        const { maskEl } = mountDrawer('dr9');
        assert.equal(maskEl.classList.contains('p-drawer-left'), true, 'defaults to left');

        outsideButton.click();

        assert.equal(maskEl.classList.contains('p-drawer-right'), true, 'delegation must reposition before opening');
        assert.equal(maskEl.classList.contains('p-drawer-left'), false);
        assert.equal(maskEl.classList.contains('p-drawer-mask-active'), true);
    });
});
