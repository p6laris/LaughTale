import '../setup.ts';
import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import SplitButtonIsland from '../../src/components/split-button.ts';

// ROADMAP.v5.md Part M "Adopt - State machine": split-button.ts already centralized open/close in
// two functions (no per-call-site duplication like menu.ts had), so this retrofit is mostly about
// consistency - but it surfaced one real bug: `activeSplitButtonClose`, a page-wide singleton
// reference, was never released if an island unmounted while its own menu happened to be the active
// one. The stale closure then kept its whole DOM subtree alive via closure references, and would
// still be invoked (touching detached elements) the next time some OTHER SplitButton opened. These
// tests prove that's fixed.

const model = [
    { label: 'Save as...', action: 'save-as' },
    { label: 'Delete', action: 'delete' }
];

// Mirrors the real hydrator: onCleanup callbacks run when the island is torn down (its signal aborts).
function makeCtx(controller: AbortController) {
    return {
        signal: controller.signal,
        onCleanup: (fn: () => void) => controller.signal.addEventListener('abort', fn)
    };
}

describe('SplitButton Singleton Disclosure Suite (ROADMAP.v5.md Part M)', () => {
    beforeEach(() => {
        document.body.innerHTML = '';
    });

    function mount(id: string, props: Record<string, any> = {}, controller: AbortController = new AbortController()) {
        const container = document.createElement('div');
        container.id = id;
        document.body.appendChild(container);
        SplitButtonIsland(container, { label: 'Actions', model, ...props }, makeCtx(controller) as any);
        const dropdownBtn = container.querySelector<HTMLButtonElement>('.p-splitbutton-dropdown')!;
        const menuEl = container.querySelector<HTMLElement>('.p-splitbutton-menu')!;
        return { container, dropdownBtn, menuEl };
    }

    it('clicking the dropdown button opens the menu', () => {
        const { dropdownBtn, menuEl } = mount('sb1');

        dropdownBtn.click();

        assert.equal(dropdownBtn.getAttribute('aria-expanded'), 'true');
        assert.equal(menuEl.style.display, 'block');
    });

    it('clicking the dropdown button again closes it (toggle)', () => {
        const { dropdownBtn } = mount('sb2');

        dropdownBtn.click();
        assert.equal(dropdownBtn.getAttribute('aria-expanded'), 'true');

        dropdownBtn.click();
        assert.equal(dropdownBtn.getAttribute('aria-expanded'), 'false');
    });

    it('clicking outside closes the menu', () => {
        const { dropdownBtn } = mount('sb3');
        dropdownBtn.click();
        assert.equal(dropdownBtn.getAttribute('aria-expanded'), 'true');

        document.body.dispatchEvent(new MouseEvent('click', { bubbles: true }));

        assert.equal(dropdownBtn.getAttribute('aria-expanded'), 'false');
    });

    it('a disabled split button never opens its dropdown', () => {
        const { dropdownBtn } = mount('sb4', { disabled: true });

        dropdownBtn.click();

        assert.equal(dropdownBtn.getAttribute('aria-expanded'), 'false');
    });

    it('opening a second split button closes the first - only one menu open at a time', () => {
        const { dropdownBtn: btnA } = mount('sbA');
        const { dropdownBtn: btnB } = mount('sbB');

        btnA.click();
        assert.equal(btnA.getAttribute('aria-expanded'), 'true');

        btnB.click();
        assert.equal(btnB.getAttribute('aria-expanded'), 'true');
        assert.equal(btnA.getAttribute('aria-expanded'), 'false', 'opening B must close A - only one split-button menu exists at a time');
    });

    it('unmounting while the menu is open releases the singleton, so a later split-button does not invoke a stale closure over detached elements (the real bug this retrofit fixes)', () => {
        const controllerA = new AbortController();
        const { container: containerA, dropdownBtn: btnA } = mount('sbUnmountA', {}, controllerA);

        btnA.click();
        assert.equal(btnA.getAttribute('aria-expanded'), 'true', 'precondition: A is open and holds the singleton');

        // Simulate island teardown (e.g. a SPA route change) WITHOUT going through closeMenu().
        controllerA.abort();
        containerA.remove();

        const { dropdownBtn: btnB } = mount('sbUnmountB');
        btnB.click();
        assert.equal(btnB.getAttribute('aria-expanded'), 'true');

        // The discriminating check: invoking A's stale close closure would have flipped A's detached
        // button to "false". It must stay "true" - proof the released singleton was never called.
        // (A plain doesNotThrow would pass either way; touching detached elements doesn't throw.)
        assert.equal(btnA.getAttribute('aria-expanded'), 'true', "B's open() must not invoke A's stale closeMenu after A unmounted");
    });

    it('repeated close (double toggle) does not throw', () => {
        const { dropdownBtn } = mount('sb5');
        dropdownBtn.click();
        assert.doesNotThrow(() => dropdownBtn.click());
        assert.doesNotThrow(() => dropdownBtn.click());
    });
});
