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

    it('picking a swatch closes the palette', () => {
        const { trigger, overlay } = mount();
        trigger.click();

        container.querySelector<HTMLButtonElement>('.color-swatch-btn')!.click();

        assert.equal(overlay.style.display, 'none');
    });

    // The palette bug: the hex-to-token migration (8333e82) turned every preset into a bare var()
    // string, so picking a swatch produced "#var(--lt-primary-500, ...)" and the native input fell
    // back to #000000.
    it('each of the 15 swatches applies a distinct, real #rrggbb color to the label, the native input and the form value (the migration had collapsed them to 11 invalid ones)', () => {
        const { trigger } = mount({ name: 'brand' });
        const swatches = Array.from(container.querySelectorAll<HTMLButtonElement>('.color-swatch-btn'));
        let lastEmitted = '';
        container.addEventListener('laughtale:color-picker:change', (e: any) => { lastEmitted = e.detail?.value; });
        const picked = new Set<string>();

        // One open resolves every swatch; a pick closes the palette but the resolved values stay
        // cached on the buttons, so re-opening per swatch would only repeat 15 style recalcs.
        trigger.click();
        for (const swatch of swatches) {
            swatch.click();
            const label = container.querySelector('.colorpicker-hex-label')!.textContent!;
            const native = container.querySelector<HTMLInputElement>('.color-native-input')!.value;
            assert.match(label, /^#[0-9A-F]{6}$/, `label must be a real hex color, got "${label}"`);
            assert.equal(native.toLowerCase(), label.toLowerCase(), 'the native <input type="color"> must hold the same color');
            assert.equal(lastEmitted.toLowerCase(), label.toLowerCase(), 'the emitted change value must be the same real color');
            picked.add(label);
        }

        assert.equal(swatches.length, 15);
        assert.equal(picked.size, 15, 'all 15 swatches must be distinct');
    });

    it('with no value prop, the default color is a real hex color, not a var() string', () => {
        mount({ value: undefined });
        const label = container.querySelector('.colorpicker-hex-label')!.textContent!;
        assert.match(label, /^#[0-9A-F]{6}$/, `default label must be a real hex color, got "${label}"`);
    });

    it('swatches are labeled with their readable hex color, not the raw var() string', () => {
        const { trigger } = mount();
        trigger.click();
        for (const swatch of Array.from(container.querySelectorAll<HTMLButtonElement>('.color-swatch-btn'))) {
            assert.match(swatch.getAttribute('aria-label')!, /^Select color #[0-9A-F]{6}$/);
            assert.match(swatch.getAttribute('title')!, /^#[0-9A-F]{6}$/);
        }
    });

    it('dragging the native spectrum or typing hex never forces a style recalc (swatch colors are resolved on open, not per change)', () => {
        const { trigger } = mount();
        trigger.click();
        const native = container.querySelector<HTMLInputElement>('.color-native-input')!;
        const hexInput = container.querySelector<HTMLInputElement>('.color-hex-input')!;

        const original = window.getComputedStyle;
        let calls = 0;
        (window as any).getComputedStyle = (...args: any[]) => { calls++; return (original as any).apply(window, args); };
        try {
            for (let i = 0; i < 20; i++) {
                native.value = `#10b9${(10 + i).toString(16).padStart(2, '0')}`;
                native.dispatchEvent(new Event('input', { bubbles: true }));
            }
            hexInput.value = 'ef4444';
            hexInput.dispatchEvent(new Event('input', { bubbles: true }));
        } finally {
            (window as any).getComputedStyle = original;
        }

        assert.equal(calls, 0, 'per-change updates must compare cached swatch colors, not re-resolve them');
        assert.equal(container.querySelector('.colorpicker-hex-label')!.textContent, '#EF4444');
    });

    it('the swatch matching the current color is outlined as selected', () => {
        const { trigger } = mount({ value: '#ef4444' });
        trigger.click();
        const selected = Array.from(container.querySelectorAll<HTMLButtonElement>('.color-swatch-btn'))
            .filter(b => b.style.boxShadow.includes('0 0 0 2px'));
        assert.equal(selected.length, 1, 'exactly one swatch must be outlined');
        assert.match(selected[0].getAttribute('data-color')!, /#ef4444/);
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
