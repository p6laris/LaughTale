import '../setup.ts';
import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import SidebarIsland from '../../src/components/sidebar.ts';

// ROADMAP.v5.md Part M "Adopt - State machine": SidebarIsland's focus trap used to activate
// unconditionally at mount, regardless of `overlay`/`isOpen` - a real, site-wide bug, not a style
// issue. This same component renders the app's own persistent left-navigation sidebar (`isAppMode`),
// a permanently-docked landmark (`overlay: false` by default), yet it was unconditionally given
// `role="dialog"`/`aria-modal="true"` and a focus trap, so Tab could never leave the nav sidebar to
// reach the rest of the page on ANY page of the site. Only a genuinely modal OVERLAY sidebar (a
// mobile offcanvas drawer with a backdrop, while open) should trap focus or claim dialog semantics -
// these tests prove that gap is closed.

function getAside(container: HTMLElement): HTMLElement {
    return container.querySelector('[data-sidebar-root]') as HTMLElement;
}

describe('Sidebar Modal-Semantics Disclosure Suite (ROADMAP.v5.md Part M)', () => {
    let container: HTMLElement;

    beforeEach(() => {
        document.body.innerHTML = '';
        container = document.createElement('div');
        document.body.appendChild(container);
    });

    it('a permanently-docked sidebar (overlay: false, the app-nav default) never gets dialog role or aria-modal - the real bug this retrofit fixes', () => {
        SidebarIsland(container, { demoType: 'responsive', overlay: false, open: true }, { signal: new AbortController().signal } as any);

        const aside = getAside(container);
        assert.notEqual(aside.getAttribute('role'), 'dialog', 'a docked sidebar must not claim dialog semantics');
        assert.equal(aside.hasAttribute('aria-modal'), false);
        assert.notEqual(container.getAttribute('role'), 'dialog');
    });

    it('an overlay sidebar (mobile drawer mode) gets dialog role and aria-modal while open', () => {
        SidebarIsland(container, { demoType: 'responsive', overlay: true, open: true }, { signal: new AbortController().signal } as any);

        const aside = getAside(container);
        assert.equal(aside.getAttribute('role'), 'dialog');
        assert.equal(aside.getAttribute('aria-modal'), 'true');
    });

    it('closing an overlay sidebar via the toggle button removes the dialog role', () => {
        SidebarIsland(container, { demoType: 'responsive', overlay: true, open: true }, { signal: new AbortController().signal } as any);
        const toggleBtn = container.querySelector<HTMLElement>('[data-sidebar-toggle]')!;

        toggleBtn.click();

        const aside = getAside(container);
        assert.notEqual(aside.getAttribute('role'), 'dialog');
        assert.equal(aside.hasAttribute('aria-modal'), false);
        assert.equal(aside.classList.contains('p-sidebar-collapsed'), true);
    });

    it('reopening via the toggle button restores dialog semantics (toggle regression coverage for the useDisclosure conversion)', () => {
        SidebarIsland(container, { demoType: 'responsive', overlay: true, open: true }, { signal: new AbortController().signal } as any);
        const toggleBtn = container.querySelector<HTMLElement>('[data-sidebar-toggle]')!;

        toggleBtn.click();
        toggleBtn.click();

        const aside = getAside(container);
        assert.equal(aside.getAttribute('role'), 'dialog');
        assert.equal(aside.classList.contains('p-sidebar-collapsed'), false);
    });

    it('Escape closes an open overlay sidebar (a new fix - previously Escape only released the trap and left the sidebar visually open)', () => {
        SidebarIsland(container, { demoType: 'responsive', overlay: true, open: true }, { signal: new AbortController().signal } as any);

        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));

        const aside = getAside(container);
        assert.equal(aside.classList.contains('p-sidebar-collapsed'), true);
        assert.notEqual(aside.getAttribute('role'), 'dialog');
    });

    it('Escape does nothing to a permanently-docked (non-overlay) sidebar', () => {
        SidebarIsland(container, { demoType: 'responsive', overlay: false, open: true }, { signal: new AbortController().signal } as any);

        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));

        const aside = getAside(container);
        assert.equal(aside.classList.contains('p-sidebar-collapsed'), false, 'a docked sidebar must not be closed by Escape');
    });

    it('clicking the backdrop closes an open overlay sidebar', () => {
        SidebarIsland(container, { demoType: 'responsive', overlay: true, open: true, backdrop: true }, { signal: new AbortController().signal } as any);
        const backdrop = container.querySelector<HTMLElement>('[data-sidebar-backdrop]')!;

        backdrop.click();

        const aside = getAside(container);
        assert.equal(aside.classList.contains('p-sidebar-collapsed'), true);
    });
});
