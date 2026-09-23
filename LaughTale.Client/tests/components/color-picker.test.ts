import '../setup.ts';
import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import ColorPickerIsland from '../../src/components/color-picker.ts';

// ROADMAP.v5.md Part M "Adopt - State machine": closing the palette used to just null the
// floating-position reference without calling destroy(). With `reposition: 'follow'`, each controller
// binds window scroll/resize listeners scoped to the island's own signal, so every open added another
// set that kept repositioning the hidden overlay on every scroll for the island's whole lifetime.
// The palette also had no Escape handling at all.

function makeCtx(controller: AbortController) {
    return {
        signal: controller.signal,
        onCleanup: (fn: () => void) => controller.signal.addEventListener('abort', fn)
    };
}

describe('ColorPicker Palette Disclosure Suite (ROADMAP.v5.md Part M)', () => {
    let container: HTMLElement;
    let controller: AbortController;

    beforeEach(() => {
        document.body.innerHTML = '';
        container = document.createElement('div');
        document.body.appendChild(container);
        controller = new AbortController();
    });

    afterEach(() => controller.abort());

    function mount(props: Record<string, any> = {}) {
        ColorPickerIsland(container, { value: '#10b981', ...props }, makeCtx(controller) as any);
        return {
            trigger: container.querySelector<HTMLButtonElement>('.colorpicker-trigger-btn')!,
            overlay: container.querySelector<HTMLElement>('.colorpicker-palette-overlay')!
        };
    }

    it('clicking the trigger opens the palette', () => {
        const { trigger, overlay } = mount();
        trigger.click();
        assert.equal(overlay.style.display, 'block');
    });

    it('clicking the trigger again closes it (toggle)', () => {
        const { trigger, overlay } = mount();
        trigger.click();
        trigger.click();
        assert.equal(overlay.style.display, 'none');
    });

    // Only asserts the close. The applied VALUE is currently broken by a separate, pre-existing bug:
    // DEFAULT_PRESETS were mechanically converted to CSS-variable strings by the hex-to-token
    // migration (8333e82), so applyColor produces e.g. "#var(--lt-primary-500, ...)". Tracked
    // separately - not part of this state-machine retrofit.
    it('picking a swatch closes the palette', () => {
        const { trigger, overlay } = mount();
        trigger.click();

        container.querySelector<HTMLButtonElement>('.color-swatch-btn')!.click();

        assert.equal(overlay.style.display, 'none');
    });

    it('clicking outside closes the palette', () => {
        const { trigger, overlay } = mount();
        trigger.click();

        document.body.dispatchEvent(new MouseEvent('click', { bubbles: true }));

        assert.equal(overlay.style.display, 'none');
    });

    it('Escape closes the palette and returns focus to the trigger (previously no keyboard dismissal existed)', () => {
        const { trigger, overlay } = mount();
        trigger.click();
        const hexInput = container.querySelector<HTMLInputElement>('.color-hex-input')!;
        hexInput.focus();

        hexInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }));

        assert.equal(overlay.style.display, 'none');
        assert.ok(document.activeElement === trigger, 'focus must return to the trigger');
    });

    it('a disabled color picker never opens', () => {
        const { trigger, overlay } = mount({ disabled: true });
        trigger.click();
        assert.equal(overlay.style.display, 'none');
    });

    it('open/close cycles leave no window scroll listeners behind (the real bug this retrofit fixes)', () => {
        const live = new Set<unknown>();
        const origAdd = window.addEventListener;
        const origRemove = window.removeEventListener;
        (window as any).addEventListener = function (type: string, fn: unknown, opts?: unknown) {
            if (type === 'scroll') live.add(fn);
            return origAdd.call(this, type, fn as any, opts as any);
        };
        (window as any).removeEventListener = function (type: string, fn: unknown, opts?: unknown) {
            if (type === 'scroll') live.delete(fn);
            return origRemove.call(this, type, fn as any, opts as any);
        };

        try {
            const { trigger } = mount();
            for (let i = 0; i < 3; i++) {
                trigger.click();
                trigger.click();
            }
            assert.equal(live.size, 0, 'each close must destroy its floating-position controller and its scroll listener');
        } finally {
            (window as any).addEventListener = origAdd;
            (window as any).removeEventListener = origRemove;
        }
    });
});
