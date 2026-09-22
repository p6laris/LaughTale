import '../setup.ts';
import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import DialogIsland from '../../src/components/dialog.ts';

// ROADMAP.v5.md Part M "Adopt - State machine": dialog.ts's global delegation
// (data-dialog-target/data-dialog-open/data-dialog-close/backdrop-click) used to duplicate the
// entire open/close DOM sequence by hand, in three separate places, NONE of which called
// trap.activate()/trap.deactivate() - a real accessibility bug, not a style issue: a dialog opened
// via a data-attribute trigger never had focus trapped inside it, unlike one opened through the
// imperative .open()/.close()/.toggle() handle API. These tests prove that gap is closed - every
// path now routes through the same per-instance doOpen/doClose (backed by useDisclosure).

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
        name: 'dialog',
        locale: 'en',
        dir: 'ltr' as const
    };
}

describe('Dialog Disclosure + Focus Trap Suite (ROADMAP.v5.md Part M)', () => {
    beforeEach(() => {
        document.body.innerHTML = '';
    });

    function mountDialog(id: string) {
        const container = document.createElement('div');
        container.id = id;
        container.setAttribute('data-island', 'dialog');
        document.body.appendChild(container);

        const innerButton = document.createElement('button');
        innerButton.textContent = 'Inside Dialog';
        container.appendChild(innerButton);

        DialogIsland(container, { header: 'Test Dialog', modal: true }, makeCtx(container));
        const maskEl = container.querySelector<HTMLElement>('.p-dialog-mask')!;
        return { container, maskEl, innerButton };
    }

    it('the imperative instance API opens and closes the dialog', () => {
        const { container, maskEl } = mountDialog('d1');
        const instance = (container as any).__ltDialogInstance;

        instance.open();
        assert.equal(maskEl.classList.contains('p-dialog-mask-active'), true);

        instance.close();
        assert.equal(maskEl.classList.contains('p-dialog-mask-active'), false);
    });

    it('a data-dialog-open trigger opens the referenced dialog AND activates the focus trap (the real bug this retrofit fixes)', async () => {
        const outsideButton = document.createElement('button');
        outsideButton.textContent = 'Open Dialog';
        document.body.appendChild(outsideButton);

        const { container, maskEl } = mountDialog('d2');
        outsideButton.setAttribute('data-dialog-open', 'd2');
        outsideButton.focus();

        outsideButton.click();

        assert.equal(maskEl.classList.contains('p-dialog-mask-active'), true, 'the mask must open via the delegated attribute trigger');

        await wait(20); // useFocusTrap's autoFocus moves focus inside via a 10ms setTimeout
        // getFocusableElements() picks the FIRST focusable descendant in DOM order, which is the
        // dialog's own header close button (rendered before the caller's content) - not the caller's
        // innerButton. What this test is actually proving is that focus left the outside trigger and
        // landed somewhere INSIDE the dialog at all, which the old delegation path never did.
        //
        // assert.ok (not assert.equal/strictEqual) - on failure, node:test's assertion formatting runs
        // util.inspect over both operands, and happy-dom elements carry deep circular references
        // (parentNode/ownerDocument/defaultView/...) that make that inspection hang and exhaust memory
        // instead of failing cleanly. A plain boolean check has no such diff to format.
        assert.ok(container.contains(document.activeElement) && document.activeElement !== outsideButton, 'focus must move INSIDE the dialog - this is the exact behavior the old duplicated delegation handler never triggered');
    });

    it('the [data-dialog-close] button closes the dialog via the delegated path and restores focus to the trigger', async () => {
        const outsideButton = document.createElement('button');
        outsideButton.textContent = 'Open Dialog';
        document.body.appendChild(outsideButton);
        outsideButton.setAttribute('data-dialog-open', 'd3');

        const { container, maskEl } = mountDialog('d3');
        const closeBtn = container.querySelector<HTMLElement>('[data-dialog-close]');

        outsideButton.focus();
        outsideButton.click();
        assert.equal(maskEl.classList.contains('p-dialog-mask-active'), true);
        await wait(20);

        closeBtn?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));

        assert.equal(maskEl.classList.contains('p-dialog-mask-active'), false, 'the delegated close-button path must close the dialog');
        assert.ok(document.activeElement === outsideButton, 'restoreFocus must return focus to the original trigger once the trap deactivates');
    });

    it('clicking the dismissable backdrop closes the dialog', () => {
        const { container, maskEl } = mountDialog('d4');
        const instance = (container as any).__ltDialogInstance;
        instance.open();
        assert.equal(maskEl.classList.contains('p-dialog-mask-active'), true);

        maskEl.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
        // The backdrop click handler checks `e.target === maskEl` via classList - dispatch directly
        // on maskEl itself (not a descendant) to simulate a genuine backdrop click.

        assert.equal(maskEl.classList.contains('p-dialog-mask-active'), false);
    });

    it('a non-dismissable modal backdrop click does NOT close the dialog', () => {
        const container = document.createElement('div');
        container.id = 'd5';
        container.setAttribute('data-island', 'dialog');
        container.setAttribute('data-props', JSON.stringify({ modal: true, dismissableMask: false }));
        document.body.appendChild(container);

        DialogIsland(container, { modal: true, dismissableMask: false }, makeCtx(container));
        const maskEl = container.querySelector<HTMLElement>('.p-dialog-mask')!;
        const instance = (container as any).__ltDialogInstance;
        instance.open();
        assert.equal(maskEl.classList.contains('p-dialog-mask-active'), true);

        maskEl.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));

        assert.equal(maskEl.classList.contains('p-dialog-mask-active'), true, 'a non-dismissable modal must stay open on backdrop click');
    });

    it('Escape closes an open dialog', () => {
        const { container, maskEl } = mountDialog('d6');
        const instance = (container as any).__ltDialogInstance;
        instance.open();
        assert.equal(maskEl.classList.contains('p-dialog-mask-active'), true);

        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));

        assert.equal(maskEl.classList.contains('p-dialog-mask-active'), false);
    });

    it('repeated close() calls on an already-closed dialog are a safe no-op (the disclosure guard)', () => {
        const { container } = mountDialog('d7');
        const instance = (container as any).__ltDialogInstance;

        assert.doesNotThrow(() => instance.close());
        assert.doesNotThrow(() => instance.close());
    });

    it('the visible prop opens the dialog on mount', () => {
        const container = document.createElement('div');
        container.id = 'd8';
        container.setAttribute('data-island', 'dialog');
        document.body.appendChild(container);

        DialogIsland(container, { visible: true }, makeCtx(container));
        const maskEl = container.querySelector<HTMLElement>('.p-dialog-mask')!;

        assert.equal(maskEl.classList.contains('p-dialog-mask-active'), true);
    });
});
