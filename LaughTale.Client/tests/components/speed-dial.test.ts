import '../setup.ts';
import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import SpeedDialIsland from '../../src/components/speed-dial.ts';

// ROADMAP.v5.md Part M "Adopt - State machine": the raw `isOpen` boolean is replaced by one guarded
// disclosure. Found along the way: Escape was only handled on the action items, so opening the dial
// with Enter/Space on the main button - which leaves focus there - gave keyboard users no way to
// dismiss it with Escape without first arrowing into an item.

const model = [
    { label: 'Add', icon: 'plus' },
    { label: 'Edit', icon: 'pencil' }
];

function makeCtx(controller: AbortController) {
    return {
        signal: controller.signal,
        onCleanup: (fn: () => void) => controller.signal.addEventListener('abort', fn)
    };
}

describe('SpeedDial Disclosure Suite (ROADMAP.v5.md Part M)', () => {
    let container: HTMLElement;
    let controller: AbortController;

    beforeEach(() => {
        document.body.innerHTML = '';
        container = document.createElement('div');
        document.body.appendChild(container);
        controller = new AbortController();
    });

    afterEach(() => controller.abort());

    function mount() {
        SpeedDialIsland(container, { model }, makeCtx(controller) as any);
        return {
            root: container.querySelector<HTMLElement>('.p-speeddial')!,
            mainBtn: container.querySelector<HTMLButtonElement>('.p-speeddial-button')!
        };
    }

    function key(el: HTMLElement, k: string) {
        el.dispatchEvent(new KeyboardEvent('keydown', { key: k, bubbles: true, cancelable: true }));
    }

    it('clicking the main button opens the dial', () => {
        const { root, mainBtn } = mount();
        mainBtn.click();
        assert.equal(root.classList.contains('p-speeddial-opened'), true);
        assert.equal(mainBtn.getAttribute('aria-expanded'), 'true');
    });

    it('clicking the main button again closes it (toggle)', () => {
        const { root, mainBtn } = mount();
        mainBtn.click();
        mainBtn.click();
        assert.equal(root.classList.contains('p-speeddial-opened'), false);
        assert.equal(mainBtn.getAttribute('aria-expanded'), 'false');
    });

    it('clicking outside closes the dial', () => {
        const { root, mainBtn } = mount();
        mainBtn.click();

        document.body.dispatchEvent(new MouseEvent('click', { bubbles: true }));

        assert.equal(root.classList.contains('p-speeddial-opened'), false);
    });

    it('Escape on the main button closes a dial opened with Enter (the real gap this retrofit fixes)', () => {
        const { root, mainBtn } = mount();
        mainBtn.focus();
        key(mainBtn, 'Enter');
        assert.equal(root.classList.contains('p-speeddial-opened'), true, 'precondition: Enter opened it, focus stays on the main button');

        key(mainBtn, 'Escape');

        assert.equal(root.classList.contains('p-speeddial-opened'), false, 'Escape on the main button must close the dial');
    });

    it('Escape on an action item closes the dial and returns focus to the main button (existing behavior, unchanged)', () => {
        const { root, mainBtn } = mount();
        key(mainBtn, 'ArrowDown');
        const action = container.querySelector<HTMLElement>('.p-speeddial-action')!;

        key(action, 'Escape');

        assert.equal(root.classList.contains('p-speeddial-opened'), false);
        assert.ok(document.activeElement === mainBtn, 'focus must return to the main button');
    });

    it('ArrowDown on the main button opens the dial and focuses the first action', () => {
        const { root, mainBtn } = mount();

        key(mainBtn, 'ArrowDown');

        assert.equal(root.classList.contains('p-speeddial-opened'), true);
        assert.ok(document.activeElement === container.querySelector('.p-speeddial-action'), 'the first action must receive focus');
    });

    it('clicking an action closes the dial', () => {
        const { root, mainBtn } = mount();
        mainBtn.click();

        container.querySelector<HTMLElement>('.p-speeddial-action')!.click();

        assert.equal(root.classList.contains('p-speeddial-opened'), false);
    });
});
