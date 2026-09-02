import '../setup.ts';
import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { defineIsland, clearRegistry } from '../../src/runtime/registry.ts';
import { hydrateIsland } from '../../src/runtime/hydrator.ts';
import { refreshIsland } from '../../src/runtime/refresh.ts';

describe('Observers Teardown Lifecycle Suite (LT-902 / Phase 4)', () => {
    beforeEach(() => {
        clearRegistry();
        document.body.innerHTML = '';
    });

    it('disconnects MutationObserver in float-label on laughtale:unmount', async () => {
        defineIsland('float-label', () => import('../../src/components/float-label.ts'));

        let disconnected = false;
        const origDisconnect = MutationObserver.prototype.disconnect;
        MutationObserver.prototype.disconnect = function (this: any) {
            disconnected = true;
            return origDisconnect.apply(this);
        };

        try {
            const container = document.createElement('div');
            container.setAttribute('data-island', 'float-label');
            container.setAttribute('data-hydrate', 'load');
            container.innerHTML = `
                <input id="test-input" />
                <label for="test-input">Username</label>
            `;
            document.body.appendChild(container);

            hydrateIsland(container);
            await new Promise(r => setTimeout(r, 40));

            assert.equal(disconnected, false, 'Observer should not be disconnected while mounted');

            // Unmount island
            container.dispatchEvent(new CustomEvent('laughtale:unmount'));

            assert.equal(disconnected, true, 'MutationObserver must be disconnected on laughtale:unmount');
        } finally {
            MutationObserver.prototype.disconnect = origDisconnect;
        }
    });

    it('disconnects ResizeObserver in scrollarea on laughtale:unmount', async () => {
        let disconnected = false;
        class MockResizeObserver {
            observe(_el: Element) {}
            unobserve(_el: Element) {}
            disconnect() {
                disconnected = true;
            }
        }

        const win = window as any;
        const origWinResize = win.ResizeObserver;
        const origGlobalResize = (globalThis as any).ResizeObserver;
        win.ResizeObserver = MockResizeObserver;
        (globalThis as any).ResizeObserver = MockResizeObserver;

        try {
            defineIsland('scrollarea', () => import('../../src/components/scrollarea.ts'));

            const container = document.createElement('div');
            container.setAttribute('data-island', 'scrollarea');
            container.setAttribute('data-hydrate', 'load');
            container.innerHTML = `
                <div class="p-scrollarea-viewport">
                    <div class="p-scrollarea-content">Long content</div>
                </div>
            `;
            document.body.appendChild(container);

            hydrateIsland(container);
            await new Promise(r => setTimeout(r, 40));

            assert.equal(disconnected, false, 'ResizeObserver should not be disconnected while mounted');

            // Unmount island
            container.dispatchEvent(new CustomEvent('laughtale:unmount'));

            assert.equal(disconnected, true, 'ResizeObserver must be disconnected on laughtale:unmount');
        } finally {
            win.ResizeObserver = origWinResize;
            (globalThis as any).ResizeObserver = origGlobalResize;
        }
    });

    it('confirms float-label behaviour is preserved and survives in-place refresh (T016)', async () => {
        defineIsland('float-label', () => import('../../src/components/float-label.ts'));

        const container = document.createElement('div');
        container.setAttribute('data-island', 'float-label');
        container.setAttribute('data-hydrate', 'load');
        container.innerHTML = `
            <input id="user-input" />
            <label for="user-input">Username</label>
        `;
        document.body.appendChild(container);

        hydrateIsland(container);
        await new Promise(r => setTimeout(r, 40));

        const input = container.querySelector('input') as HTMLInputElement;

        // Float on input event
        input.value = 'Monkey D. Luffy';
        container.dispatchEvent(new Event('input'));
        assert.ok(container.classList.contains('has-value'), 'Container must have "has-value" when input has content');

        // Un-float when cleared
        input.value = '';
        container.dispatchEvent(new Event('input'));
        assert.ok(!container.classList.contains('has-value'), 'Container must not have "has-value" when input is empty');

        // Refresh island
        const originalFetch = global.fetch;
        global.fetch = async () => ({
            ok: true,
            status: 200,
            text: async () => `
                <div data-island="float-label">
                    <input id="user-input" />
                    <label for="user-input">Username</label>
                </div>
            `
        } as any);

        try {
            await refreshIsland(container);
            await new Promise(r => setTimeout(r, 40));

            // Functionality survives refresh
            const refreshedInput = container.querySelector('input') as HTMLInputElement;
            refreshedInput.value = 'Roronoa Zoro';
            container.dispatchEvent(new Event('input'));
            assert.ok(container.classList.contains('has-value'), 'Float-label must continue functioning after in-place refresh');
        } finally {
            global.fetch = originalFetch;
        }
    });

    it('confirms scrollarea behaviour is preserved and survives in-place refresh (T016)', async () => {
        class MockResizeObserver {
            observe(_el: Element) {}
            unobserve(_el: Element) {}
            disconnect() {}
        }
        const win = window as any;
        const origWinResize = win.ResizeObserver;
        const origGlobalResize = (globalThis as any).ResizeObserver;
        win.ResizeObserver = MockResizeObserver;
        (globalThis as any).ResizeObserver = MockResizeObserver;

        try {
            defineIsland('scrollarea', () => import('../../src/components/scrollarea.ts'));

            const container = document.createElement('div');
            container.setAttribute('data-island', 'scrollarea');
            container.setAttribute('data-hydrate', 'load');
            container.innerHTML = `
                <div class="p-scrollarea-viewport">
                    <div class="p-scrollarea-content">Scrollable content</div>
                </div>
            `;
            document.body.appendChild(container);

            hydrateIsland(container);
            await new Promise(r => setTimeout(r, 40));

            // Verify rendered scrollbar structure
            assert.ok(container.querySelector('.p-scrollarea-viewport'), 'Scrollarea viewport must exist');

            // Refresh island
            const originalFetch = global.fetch;
            global.fetch = async () => ({
                ok: true,
                status: 200,
                text: async () => `
                    <div data-island="scrollarea">
                        <div class="p-scrollarea-viewport">
                            <div class="p-scrollarea-content">Refreshed content</div>
                        </div>
                    </div>
                `
            } as any);

            try {
                await refreshIsland(container);
                await new Promise(r => setTimeout(r, 40));

                assert.ok(container.querySelector('.p-scrollarea-viewport'), 'Scrollarea must remain functional after in-place refresh');
            } finally {
                global.fetch = originalFetch;
            }
        } finally {
            win.ResizeObserver = origWinResize;
            (globalThis as any).ResizeObserver = origGlobalResize;
        }
    });
});
