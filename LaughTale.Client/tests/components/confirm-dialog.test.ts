import '../setup.ts';
import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import '../../src/components/confirm-dialog.ts';

// ROADMAP.v5.md Part M "Adopt - State machine": ConfirmDialogManager's "is a confirmation open" state
// was only ever `maskEl.classList.contains('p-confirmdialog-mask-active')`, re-derived at each call
// site instead of one guarded place. Centralizing it via useDisclosure surfaced a real bug: require()
// never checked whether a DIFFERENT confirmation was already open before overwriting currentOptions -
// the outgoing confirmation's accept/reject callback was silently dropped forever. These tests prove
// that gap is closed.

function wait(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function getConfirm(): any {
    return (window as any).$confirm;
}

function getMask(): HTMLElement {
    return document.querySelector('.p-confirmdialog-mask') as HTMLElement;
}

describe('ConfirmDialog Disclosure Suite (ROADMAP.v5.md Part M)', () => {
    beforeEach(() => {
        // Not document.body.innerHTML = '': ConfirmDialogManager's mask element is a genuine
        // module-scoped singleton (created once, reused for the page's whole lifetime) - see
        // tooltip.test.ts for why wiping the body would orphan it. Reset via close() instead.
        getConfirm().close(false);
    });

    it('require() opens the mask and renders the message', () => {
        getConfirm().require({ message: 'Are you sure?', header: 'Confirm' });

        const mask = getMask();
        assert.equal(mask.classList.contains('p-confirmdialog-mask-active'), true);
        assert.equal(mask.querySelector('.p-confirmdialog-message')?.textContent, 'Are you sure?');
    });

    it('clicking the accept button calls accept() and closes', () => {
        let accepted = false;
        getConfirm().require({ message: 'Delete?', accept: () => { accepted = true; }, reject: () => {} });

        getMask().querySelector<HTMLElement>('.btn-accept')?.click();

        assert.equal(accepted, true);
        assert.equal(getMask().classList.contains('p-confirmdialog-mask-active'), false);
    });

    it('clicking the reject button calls reject() and closes', () => {
        let rejected = false;
        getConfirm().require({ message: 'Delete?', accept: () => {}, reject: () => { rejected = true; } });

        getMask().querySelector<HTMLElement>('.btn-reject')?.click();

        assert.equal(rejected, true);
        assert.equal(getMask().classList.contains('p-confirmdialog-mask-active'), false);
    });

    it('Escape closes the dialog and calls reject()', () => {
        let rejected = false;
        getConfirm().require({ message: 'Delete?', reject: () => { rejected = true; } });

        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));

        assert.equal(rejected, true);
        assert.equal(getMask().classList.contains('p-confirmdialog-mask-active'), false);
    });

    it('clicking the backdrop closes the dialog and calls reject()', () => {
        let rejected = false;
        getConfirm().require({ message: 'Delete?', reject: () => { rejected = true; } });

        getMask().dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));

        assert.equal(rejected, true);
        assert.equal(getMask().classList.contains('p-confirmdialog-mask-active'), false);
    });

    it('repeated close() calls when nothing is open are a safe no-op (the disclosure guard)', () => {
        assert.doesNotThrow(() => getConfirm().close(false));
        assert.doesNotThrow(() => getConfirm().close(false));
    });

    it('requesting a second, different confirmation rejects the first instead of silently dropping its callback (the real bug this retrofit fixes)', () => {
        let firstRejected = false;
        let secondAccepted = false;

        getConfirm().require({ message: 'First', reject: () => { firstRejected = true; } });
        getConfirm().require({ message: 'Second', accept: () => { secondAccepted = true; } });

        assert.equal(firstRejected, true, 'opening a second confirmation must reject the first, not orphan its callback');
        assert.equal(getMask().querySelector('.p-confirmdialog-message')?.textContent, 'Second');

        getMask().querySelector<HTMLElement>('.btn-accept')?.click();
        assert.equal(secondAccepted, true);
    });

    it('focus is trapped inside the dialog while it is open', async () => {
        getConfirm().require({ message: 'Delete?' });
        await wait(20); // useFocusTrap's autoFocus moves focus via a 10ms setTimeout

        assert.ok(getMask().contains(document.activeElement), 'focus must move inside the confirm dialog');
    });
});
