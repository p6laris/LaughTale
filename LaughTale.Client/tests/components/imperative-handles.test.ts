import '../setup.ts';
import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import DialogIsland, { createHandle as createDialogHandle } from '../../src/components/dialog.ts';
import ToastIsland, { createHandle as createToastHandle } from '../../src/components/toast.ts';
import DataTableIsland, { createHandle as createDataTableHandle } from '../../src/components/datatable.ts';

// ROADMAP.v5.md Part C, "imperative handles": `createHandle` has existed on the registry/hydrator
// contract since day one (hydrator.ts calls `module.createHandle(container, props)` and merges the
// result onto `container.island` alongside `refresh`), but until this pass zero components
// implemented it. These tests call `createHandle` directly (as hydrator.ts does) rather than going
// through full island hydration, since the point under test is the handle contract itself.

describe('Imperative Handles Suite (ROADMAP.v5.md Part C)', () => {
    beforeEach(() => {
        document.body.innerHTML = '';
    });

    describe('dialog', () => {
        it('open()/close()/toggle() drive the same mask a click or Escape would', () => {
            const container = document.createElement('div');
            document.body.appendChild(container);
            DialogIsland(container, { header: 'Test Dialog', modal: true });

            const handle = createDialogHandle(container);
            const mask = container.querySelector('.p-dialog-mask')!;
            assert.equal(mask.classList.contains('p-dialog-mask-active'), false, 'starts closed');

            handle.open();
            assert.equal(mask.classList.contains('p-dialog-mask-active'), true, 'open() must show the dialog');

            handle.close();
            assert.equal(mask.classList.contains('p-dialog-mask-active'), false, 'close() must hide the dialog');

            handle.toggle();
            assert.equal(mask.classList.contains('p-dialog-mask-active'), true, 'toggle() from closed must open');
            handle.toggle();
            assert.equal(mask.classList.contains('p-dialog-mask-active'), false, 'toggle() from open must close');
        });

        it('createHandle works even though it is called before mount (as hydrator.ts actually calls it)', () => {
            const container = document.createElement('div');
            document.body.appendChild(container);

            // Mirrors executeHydration's real order: createHandle() runs first, mount() second.
            const handle = createDialogHandle(container);
            handle.open(); // must not throw - no instance is wired up yet, so this is a no-op

            DialogIsland(container, { header: 'Test Dialog' });
            handle.open();

            const mask = container.querySelector('.p-dialog-mask')!;
            assert.equal(mask.classList.contains('p-dialog-mask-active'), true, 'open() after mount must work through the same handle object');
        });
    });

    describe('toast', () => {
        it('show() adds a message to this container\'s group; clear() removes them', async () => {
            const container = document.createElement('div');
            document.body.appendChild(container);
            const props = { group: 'imperative-handle-test' };
            ToastIsland(container, props);

            const handle = createToastHandle(container, props);
            handle.show({ summary: 'Saved', severity: 'success', life: 0 });

            const message = container.querySelector('.p-toast-message');
            assert.ok(message, 'show() must render a toast message into this container');
            assert.ok(message!.textContent?.includes('Saved'));

            handle.clear();
            // Removal is animated (transitionend or a 250ms fallback in happy-dom, which never fires
            // real transitions) - wait past the fallback rather than asserting synchronously.
            await new Promise(r => setTimeout(r, 300));
            assert.equal(container.querySelector('.p-toast-message'), null, 'clear() must remove this group\'s messages');
        });
    });

    describe('datatable', () => {
        const originalFetch = globalThis.fetch;

        afterEach(() => {
            globalThis.fetch = originalFetch;
        });

        it('reload() re-fetches from lazyUrl, not just re-renders existing data', async () => {
            let callCount = 0;
            (globalThis as any).fetch = async () => {
                callCount++;
                return {
                    ok: true,
                    json: async () => ({
                        items: [{ id: callCount, name: `Row ${callCount}` }],
                        totalCount: 1
                    })
                };
            };

            const container = document.createElement('div');
            document.body.appendChild(container);
            const props = { lazy: true, lazyUrl: '/fake-datatable-endpoint', columns: [{ field: 'name', header: 'Name' }] };
            DataTableIsland(container, props);

            await new Promise(r => setTimeout(r, 20));
            assert.equal(callCount, 1, 'initial mount with no data and a lazyUrl must fetch once');
            assert.ok(container.textContent?.includes('Row 1'));

            const handle = createDataTableHandle(container);
            handle.reload();

            await new Promise(r => setTimeout(r, 20));
            assert.equal(callCount, 2, 'reload() must trigger a second real fetch, not just a client-side re-render');
            assert.ok(container.textContent?.includes('Row 2'), 'the re-rendered table must reflect the second fetch\'s data');
        });

        it('reload() without a lazyUrl re-renders from existing data instead of throwing', () => {
            const container = document.createElement('div');
            document.body.appendChild(container);
            DataTableIsland(container, { value: [{ id: 1, name: 'Static' }], columns: [{ field: 'name', header: 'Name' }] });

            const handle = createDataTableHandle(container);
            assert.doesNotThrow(() => handle.reload());
            assert.ok(container.textContent?.includes('Static'));
        });
    });
});
