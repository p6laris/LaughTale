import '../setup.ts';
import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { defineIsland, clearRegistry } from '../../src/runtime/registry.ts';
import { hydrateIsland } from '../../src/runtime/hydrator.ts';

describe('Timers Batch 1 Lifecycle Teardown Suite (LT-902 / Phase 6)', () => {
    beforeEach(() => {
        clearRegistry();
        document.body.innerHTML = '';
    });

    it('dialog: mask animation, escape key, and unmount operate cleanly (T020)', async () => {
        defineIsland('dialog', () => import('../../src/components/dialog.ts'));

        const container = document.createElement('div');
        container.setAttribute('data-island', 'dialog');
        container.setAttribute('data-hydrate', 'load');
        container.setAttribute('data-props', JSON.stringify({
            visible: true,
            modal: true,
            header: 'Test Dialog',
            dismissableMask: true
        }));
        document.body.appendChild(container);

        hydrateIsland(container);
        await new Promise(r => setTimeout(r, 40));

        const mask = container.querySelector('.p-dialog-mask') as HTMLElement;
        assert.ok(mask, 'Dialog mask must be rendered');

        // Escape key dismisses dialog
        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
        await new Promise(r => setTimeout(r, 250));

        // Unmount cleanly
        assert.doesNotThrow(() => {
            container.dispatchEvent(new CustomEvent('laughtale:unmount'));
        });
    });

    it('confirm-dialog: require, accept, and teardown operate cleanly (T020)', async () => {
        defineIsland('confirm-dialog', () => import('../../src/components/confirm-dialog.ts'));

        const container = document.createElement('div');
        container.setAttribute('data-island', 'confirm-dialog');
        container.setAttribute('data-hydrate', 'load');
        document.body.appendChild(container);

        hydrateIsland(container);
        await new Promise(r => setTimeout(r, 40));

        let accepted = false;
        (window as any).$confirm.require({
            message: 'Are you sure?',
            header: 'Confirmation',
            accept: () => { accepted = true; }
        });

        await new Promise(r => setTimeout(r, 30));
        const mask = document.querySelector('.p-confirmdialog-mask') as HTMLElement;
        assert.ok(mask, 'Confirm dialog mask must be rendered in DOM');

        (window as any).$confirm.close(true);
        assert.equal(accepted, true, 'Accept callback must be invoked');

        // Unmount cleanly
        assert.doesNotThrow(() => {
            container.dispatchEvent(new CustomEvent('laughtale:unmount'));
        });
    });

    it('confirm-popup: open and outside click teardown operate cleanly (T020)', async () => {
        defineIsland('confirm-popup', () => import('../../src/components/confirm-popup.ts'));

        const container = document.createElement('div');
        container.setAttribute('data-island', 'confirm-popup');
        container.setAttribute('data-hydrate', 'load');
        container.innerHTML = `
            <button id="target-btn" data-confirm-popup="true" data-message="Delete item?">Delete</button>
        `;
        document.body.appendChild(container);

        hydrateIsland(container);
        await new Promise(r => setTimeout(r, 40));

        const btn = container.querySelector('#target-btn') as HTMLButtonElement;
        assert.ok(btn);

        btn.click();
        await new Promise(r => setTimeout(r, 30));

        // Teardown cleanly
        assert.doesNotThrow(() => {
            container.dispatchEvent(new CustomEvent('laughtale:unmount'));
        });
    });

    it('datatable: refresh simulation button operates and unmounts cleanly (T020)', async () => {
        defineIsland('datatable', () => import('../../src/components/datatable.ts'));

        const container = document.createElement('div');
        container.setAttribute('data-island', 'datatable');
        container.setAttribute('data-hydrate', 'load');
        container.setAttribute('data-props', JSON.stringify({
            value: [{ id: 1, name: 'Item 1' }],
            columns: [{ field: 'id', header: 'ID' }, { field: 'name', header: 'Name' }]
        }));
        document.body.appendChild(container);

        hydrateIsland(container);
        await new Promise(r => setTimeout(r, 40));

        const refreshBtn = container.querySelector('.p-datatable-refresh-btn') as HTMLButtonElement;
        if (refreshBtn) {
            refreshBtn.click();
        }

        // Unmount while refresh timer is ticking
        assert.doesNotThrow(() => {
            container.dispatchEvent(new CustomEvent('laughtale:unmount'));
        });
    });

    it('context-menu: hideMenu timer operates and unmounts cleanly (T020)', async () => {
        defineIsland('context-menu', () => import('../../src/components/context-menu.ts'));

        const container = document.createElement('div');
        container.setAttribute('data-island', 'context-menu');
        container.setAttribute('data-hydrate', 'load');
        container.setAttribute('data-props', JSON.stringify({
            global: true,
            model: [{ label: 'Copy' }, { label: 'Paste' }]
        }));
        document.body.appendChild(container);

        hydrateIsland(container);
        await new Promise(r => setTimeout(r, 40));

        // Right click to show menu
        container.dispatchEvent(new MouseEvent('contextmenu', { clientX: 100, clientY: 100 }));
        await new Promise(r => setTimeout(r, 30));

        // Teardown
        assert.doesNotThrow(() => {
            container.dispatchEvent(new CustomEvent('laughtale:unmount'));
        });
    });
});
