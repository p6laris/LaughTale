import '../setup.ts';
import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import CommandMenuIsland from '../../src/components/command.ts';

// ROADMAP.v5.md Part M "Adopt - State machine": `useFocusTrap(card, {...})`'s return value used to
// be discarded entirely - `.activate()` was never called. This meant the Ctrl/Cmd+L command palette
// dialog rendered `role="dialog" aria-modal="true"` while providing NO actual focus trap: Tab could
// escape into the rest of the page while it was "open", and focus was never restored on close. These
// tests prove the trap is now genuinely active.
//
// Every mount registers a page-global Ctrl/Cmd+L listener on `window`, so each test aborts its own
// controller in afterEach (a real unmount) - otherwise earlier tests' instances would still answer
// later tests' shortcut presses. DOM-identity checks use assert.ok(x === null), not assert.equal: on
// failure, node:test's diff formatting runs util.inspect over happy-dom elements, whose circular
// references make it hang instead of failing (see dialog.test.ts).

const model = [
    { label: 'Group', items: [{ label: 'New File', action: 'new-file' }, { label: 'Open' }] }
];

function getBackdrop(): HTMLElement | null {
    return document.querySelector('.p-commandmenu-dialog-backdrop');
}

function pressCtrlL() {
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'l', ctrlKey: true, bubbles: true }));
}

describe('CommandMenu Dialog Focus-Trap Suite (ROADMAP.v5.md Part M)', () => {
    let container: HTMLElement;
    let controller: AbortController;

    beforeEach(() => {
        document.body.innerHTML = '';
        container = document.createElement('div');
        document.body.appendChild(container);
        controller = new AbortController();
    });

    afterEach(() => {
        controller.abort();
    });

    // Mirrors the real hydrator: onCleanup callbacks run when the island is torn down (its signal aborts).
    function mount() {
        const ctx = {
            signal: controller.signal,
            onCleanup: (fn: () => void) => controller.signal.addEventListener('abort', fn)
        };
        CommandMenuIsland(container, { model, withDialog: true }, ctx as any);
    }

    it('Ctrl+L opens the dialog with dialog role and focuses the input', () => {
        mount();
        pressCtrlL();

        const backdrop = getBackdrop();
        assert.ok(backdrop !== null, 'the dialog backdrop must be appended');
        const card = backdrop!.querySelector('.p-commandmenu-dialog-card');
        assert.equal(card?.getAttribute('role'), 'dialog');
        assert.equal(document.activeElement?.className.includes('p-commandmenu-input'), true);
    });

    it('the focus trap is genuinely active - Tab on the input is intercepted (the real bug this retrofit fixes, previously activate() was never called)', () => {
        mount();
        pressCtrlL();

        const input = document.activeElement as HTMLElement;
        const tabEvent = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true });
        input.dispatchEvent(tabEvent);

        assert.equal(tabEvent.defaultPrevented, true, 'Tab must be trapped within the command dialog');
    });

    it('Ctrl+L again toggles the dialog closed', () => {
        mount();
        pressCtrlL();
        assert.ok(getBackdrop() !== null);

        pressCtrlL();
        assert.ok(getBackdrop() === null, 'a second Ctrl+L must close the dialog');
    });

    it('clicking the backdrop closes the dialog', () => {
        mount();
        pressCtrlL();
        const backdrop = getBackdrop()!;

        backdrop.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));

        assert.ok(getBackdrop() === null, 'a backdrop click must close the dialog');
    });

    it('Escape closes the dialog', () => {
        mount();
        pressCtrlL();
        assert.ok(getBackdrop() !== null);

        // Dispatch on the focused input, where a real keypress originates - the handler is bound on
        // the inner .p-commandmenu root, so the event must bubble up through it.
        const input = getBackdrop()!.querySelector<HTMLElement>('.p-commandmenu-input')!;
        input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }));

        assert.ok(getBackdrop() === null, 'Escape must close the dialog');
    });

    it('the trigger click opens the dialog too', () => {
        mount();
        const trigger = container.querySelector<HTMLElement>('.p-commandmenu-dialog-trigger')!;

        trigger.click();

        assert.ok(getBackdrop() !== null);
    });

    it('unmounting the island while its dialog is open removes the body-level backdrop instead of orphaning it', () => {
        mount();
        pressCtrlL();
        assert.ok(getBackdrop() !== null, 'precondition: dialog open');

        controller.abort();

        assert.ok(getBackdrop() === null, 'the backdrop lives on document.body, outside the container, so unmount must remove it explicitly');
    });
});
