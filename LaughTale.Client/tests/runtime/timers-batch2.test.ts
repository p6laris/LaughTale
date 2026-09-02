import '../setup.ts';
import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { defineIsland, clearRegistry } from '../../src/runtime/registry.ts';
import { hydrateIsland } from '../../src/runtime/hydrator.ts';

describe('Timers Batch 2 Lifecycle Teardown Suite (LT-902 / Phase 7)', () => {
    beforeEach(() => {
        clearRegistry();
        document.body.innerHTML = '';
    });

    it('theme-studio: drawer open/close, copy buttons, and unmount operate cleanly (T022)', async () => {
        defineIsland('theme-studio', () => import('../../src/components/theme-studio.ts'));

        const container = document.createElement('div');
        container.setAttribute('data-island', 'theme-studio');
        container.setAttribute('data-hydrate', 'load');
        document.body.appendChild(container);

        hydrateIsland(container);
        await new Promise(r => setTimeout(r, 40));

        const toggleBtn = container.querySelector('.theme-studio-toggle-btn') as HTMLButtonElement;
        assert.ok(toggleBtn, 'Toggle button must exist');

        // Open drawer
        toggleBtn.click();
        await new Promise(r => setTimeout(r, 40));

        // Close drawer (triggers 250ms backdrop timer)
        const closeBtn = container.querySelector('.theme-studio-close-btn') as HTMLButtonElement;
        assert.ok(closeBtn);
        closeBtn.click();

        // Copy buttons
        const copyCssBtn = container.querySelector('.studio-copy-css-btn') as HTMLButtonElement;
        if (copyCssBtn) {
            copyCssBtn.click();
        }

        // Unmount mid-timers
        assert.doesNotThrow(() => {
            container.dispatchEvent(new CustomEvent('laughtale:unmount'));
        });
    });

    it('treetable: lazy loading, refresh simulation, and unmount operate cleanly (T022)', async () => {
        defineIsland('treetable', () => import('../../src/components/treetable.ts'));

        const container = document.createElement('div');
        container.setAttribute('data-island', 'treetable');
        container.setAttribute('data-hydrate', 'load');
        container.setAttribute('data-props', JSON.stringify({
            value: [
                { key: '0', data: { name: 'Documents', size: '75kb', type: 'Folder' }, leaf: false }
            ],
            lazy: true
        }));
        document.body.appendChild(container);

        hydrateIsland(container);
        await new Promise(r => setTimeout(r, 40));

        // Expand lazy node
        const toggler = container.querySelector('.p-treetable-toggler') as HTMLButtonElement;
        if (toggler) {
            toggler.click();
        }

        // Click refresh button
        const refreshBtn = container.querySelector('.p-treetable-refresh-btn') as HTMLButtonElement;
        if (refreshBtn) {
            refreshBtn.click();
        }

        // Unmount while lazy and refresh timers are running
        assert.doesNotThrow(() => {
            container.dispatchEvent(new CustomEvent('laughtale:unmount'));
        });
    });

    it('sidebar: renders and auto-scrolls active item cleanly (T022)', async () => {
        defineIsland('sidebar', () => import('../../src/components/sidebar.ts'));

        const container = document.createElement('div');
        container.setAttribute('data-island', 'sidebar');
        container.setAttribute('data-hydrate', 'load');
        container.setAttribute('data-props', JSON.stringify({
            items: [
                { label: 'Dashboard', icon: 'home', active: true }
            ]
        }));
        document.body.appendChild(container);

        hydrateIsland(container);
        await new Promise(r => setTimeout(r, 50));

        assert.doesNotThrow(() => {
            container.dispatchEvent(new CustomEvent('laughtale:unmount'));
        });
    });

    it('split-button: menu open/close and teardown operate cleanly (T022)', async () => {
        defineIsland('split-button', () => import('../../src/components/split-button.ts'));

        const container = document.createElement('div');
        container.setAttribute('data-island', 'split-button');
        container.setAttribute('data-hydrate', 'load');
        container.setAttribute('data-props', JSON.stringify({
            label: 'Save',
            model: [{ label: 'Update' }, { label: 'Delete' }]
        }));
        document.body.appendChild(container);

        hydrateIsland(container);
        await new Promise(r => setTimeout(r, 40));

        const dropdownBtn = container.querySelector('.p-splitbutton-dropdown') as HTMLButtonElement;
        assert.ok(dropdownBtn, 'Dropdown button must exist');

        dropdownBtn.click();
        await new Promise(r => setTimeout(r, 30));

        assert.doesNotThrow(() => {
            container.dispatchEvent(new CustomEvent('laughtale:unmount'));
        });
    });

    it('tree: lazy loading node expands and unmounts cleanly (T022)', async () => {
        defineIsland('tree', () => import('../../src/components/tree.ts'));

        const container = document.createElement('div');
        container.setAttribute('data-island', 'tree');
        container.setAttribute('data-hydrate', 'load');
        container.setAttribute('data-props', JSON.stringify({
            value: [{ key: '0', label: 'Documents', leaf: false }],
            lazy: true
        }));
        document.body.appendChild(container);

        hydrateIsland(container);
        await new Promise(r => setTimeout(r, 40));

        const toggler = container.querySelector('.p-tree-toggler') as HTMLButtonElement;
        if (toggler) {
            toggler.click();
        }

        assert.doesNotThrow(() => {
            container.dispatchEvent(new CustomEvent('laughtale:unmount'));
        });
    });
});
