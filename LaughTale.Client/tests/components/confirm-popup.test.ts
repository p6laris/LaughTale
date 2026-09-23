import '../setup.ts';
import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import '../../src/components/confirm-popup.ts';

// ROADMAP.v5.md Part M "Adopt - State machine": ConfirmPopupManager already handled "clicking the
// SAME open target again toggles it closed" but never handled requesting a confirmation for a
// DIFFERENT target while one was already open - currentOptions was silently overwritten, dropping the
// outgoing confirmation's accept/reject callback forever (the same bug found and fixed in
// confirm-dialog.ts). These tests prove that gap is closed.

function getConfirmPopup(): any {
    return (window as any).$confirmPopup;
}

function getPopup(): HTMLElement {
    return document.querySelector('.p-confirmpopup') as HTMLElement;
}

function makeTarget(id: string): HTMLElement {
    const el = document.createElement('button');
    el.id = id;
    el.textContent = 'Delete';
    document.body.appendChild(el);
    return el;
}

describe('ConfirmPopup Disclosure Suite (ROADMAP.v5.md Part M)', () => {
    beforeEach(() => {
        // Not document.body.innerHTML = '': see confirm-dialog.test.ts / tooltip.test.ts for why the
        // module-scoped singleton popup element must not be orphaned by wiping the whole body.
        getConfirmPopup().close(false);
        Array.from(document.body.children).forEach(child => {
            if (!child.classList.contains('p-confirmpopup')) child.remove();
        });
    });

    it('require() opens the popup and renders the message', () => {
        const target = makeTarget('t1');
        getConfirmPopup().require({ target, message: 'Delete this?' });

        const popup = getPopup();
        assert.equal(popup.classList.contains('p-confirmpopup-active'), true);
        assert.equal(popup.querySelector('.p-confirmpopup-message')?.textContent, 'Delete this?');
    });

    it('clicking the accept button calls accept() and closes', () => {
        const target = makeTarget('t2');
        let accepted = false;
        getConfirmPopup().require({ target, message: 'Delete?', accept: () => { accepted = true; } });

        getPopup().querySelector<HTMLElement>('.btn-accept')?.click();

        assert.equal(accepted, true);
        assert.equal(getPopup().classList.contains('p-confirmpopup-active'), false);
    });

    it('clicking the reject button calls reject() and closes', () => {
        const target = makeTarget('t3');
        let rejected = false;
        getConfirmPopup().require({ target, message: 'Delete?', reject: () => { rejected = true; } });

        getPopup().querySelector<HTMLElement>('.btn-reject')?.click();

        assert.equal(rejected, true);
        assert.equal(getPopup().classList.contains('p-confirmpopup-active'), false);
    });

    it('Escape closes the popup and calls reject()', () => {
        const target = makeTarget('t4');
        let rejected = false;
        getConfirmPopup().require({ target, message: 'Delete?', reject: () => { rejected = true; } });

        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));

        assert.equal(rejected, true);
        assert.equal(getPopup().classList.contains('p-confirmpopup-active'), false);
    });

    it('requesting the SAME target again while open toggles it closed (existing singleton behavior, unchanged)', () => {
        const target = makeTarget('t5');
        let rejected = false;
        getConfirmPopup().require({ target, message: 'Delete?', reject: () => { rejected = true; } });
        assert.equal(getPopup().classList.contains('p-confirmpopup-active'), true);

        getConfirmPopup().require({ target, message: 'Delete?', reject: () => { rejected = true; } });

        assert.equal(getPopup().classList.contains('p-confirmpopup-active'), false);
    });

    it('requesting a DIFFERENT target while one is open rejects the first instead of silently dropping its callback (the real bug this retrofit fixes)', () => {
        const targetA = makeTarget('t6a');
        const targetB = makeTarget('t6b');
        let firstRejected = false;
        let secondAccepted = false;

        getConfirmPopup().require({ target: targetA, message: 'First', reject: () => { firstRejected = true; } });
        getConfirmPopup().require({ target: targetB, message: 'Second', accept: () => { secondAccepted = true; } });

        assert.equal(firstRejected, true, 'opening a confirmation for a different target must reject the first, not orphan its callback');
        assert.equal(getPopup().querySelector('.p-confirmpopup-message')?.textContent, 'Second');

        getPopup().querySelector<HTMLElement>('.btn-accept')?.click();
        assert.equal(secondAccepted, true);
    });

    it('repeated close() calls when nothing is open are a safe no-op (the disclosure guard)', () => {
        assert.doesNotThrow(() => getConfirmPopup().close(false));
        assert.doesNotThrow(() => getConfirmPopup().close(false));
    });
});
