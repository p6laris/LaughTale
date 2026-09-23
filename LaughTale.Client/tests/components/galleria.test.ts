import '../setup.ts';
import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import GalleriaIsland from '../../src/components/galleria.ts';

// ROADMAP.v5.md Part M "Adopt - State machine": the rendered markup used to hardcode
// `role="dialog" aria-modal="true"` unconditionally, regardless of `fullScreen`/`visible` - a real
// inconsistency with the focus trap right below it, which DID correctly gate `trap.activate()` on
// that same condition. A plain inline galleria (the common case) claimed modal dialog semantics to
// assistive tech while never actually trapping focus, and the Escape handler released the trap
// without ever updating role/aria-modal, so a genuine fullscreen galleria kept announcing itself as
// an active modal dialog after Escape had already released focus. These tests prove both are fixed.

const images = [
    { itemImageSrc: 'a.jpg', thumbnailImageSrc: 'a-thumb.jpg', alt: 'A', title: 'Alpha' },
    { itemImageSrc: 'b.jpg', thumbnailImageSrc: 'b-thumb.jpg', alt: 'B', title: 'Beta' }
];

function getRoot(container: HTMLElement): HTMLElement {
    return container.querySelector('.p-galleria') as HTMLElement;
}

describe('Galleria Modal-Semantics Disclosure Suite (ROADMAP.v5.md Part M)', () => {
    let container: HTMLElement;

    beforeEach(() => {
        document.body.innerHTML = '';
        container = document.createElement('div');
        document.body.appendChild(container);
    });

    it('a plain inline galleria (no fullScreen/visible) never claims dialog role or aria-modal', () => {
        GalleriaIsland(container, { value: images }, { signal: new AbortController().signal } as any);

        const root = getRoot(container);
        assert.notEqual(root.getAttribute('role'), 'dialog');
        assert.equal(root.hasAttribute('aria-modal'), false);
    });

    it('a fullScreen galleria claims dialog role and aria-modal', () => {
        GalleriaIsland(container, { value: images, fullScreen: true }, { signal: new AbortController().signal } as any);

        const root = getRoot(container);
        assert.equal(root.getAttribute('role'), 'dialog');
        assert.equal(root.getAttribute('aria-modal'), 'true');
    });

    it('a visible galleria (the lightbox-opened flag) also claims dialog role and aria-modal', () => {
        GalleriaIsland(container, { value: images, visible: true }, { signal: new AbortController().signal } as any);

        const root = getRoot(container);
        assert.equal(root.getAttribute('role'), 'dialog');
        assert.equal(root.getAttribute('aria-modal'), 'true');
    });

    it('Escape on a fullScreen galleria removes dialog role and aria-modal too (the real bug this retrofit fixes - previously only the trap released, the ARIA state stayed stale)', () => {
        GalleriaIsland(container, { value: images, fullScreen: true }, { signal: new AbortController().signal } as any);
        assert.equal(getRoot(container).getAttribute('role'), 'dialog', 'precondition: starts modal');

        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));

        const root = getRoot(container);
        assert.notEqual(root.getAttribute('role'), 'dialog');
        assert.equal(root.hasAttribute('aria-modal'), false);
    });

    it('Escape on a plain inline galleria is a safe no-op (the disclosure guard)', () => {
        GalleriaIsland(container, { value: images }, { signal: new AbortController().signal } as any);

        assert.doesNotThrow(() => {
            window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
        });
        assert.notEqual(getRoot(container).getAttribute('role'), 'dialog');
    });

    it('navigating between images preserves the current modal state across re-renders', () => {
        GalleriaIsland(container, { value: images, fullScreen: true }, { signal: new AbortController().signal } as any);

        container.querySelector<HTMLElement>('.p-galleria-item-next')?.click();

        const root = getRoot(container);
        assert.equal(root.getAttribute('role'), 'dialog', 'a full re-render (navigation) must not silently drop the modal state');
        assert.equal(root.querySelector('.p-galleria-caption-title')?.textContent, 'Beta');
    });
});
