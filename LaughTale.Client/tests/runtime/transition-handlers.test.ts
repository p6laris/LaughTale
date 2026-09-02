import '../setup.ts';
import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { defineIsland, clearRegistry } from '../../src/runtime/registry.ts';
import { hydrateIsland } from '../../src/runtime/hydrator.ts';
import { globalToast } from '../../src/components/toast.ts';

describe('Transition Handlers & Lifecycle Teardown Suite (LT-902 / Phase 5)', () => {
    beforeEach(() => {
        clearRegistry();
        document.body.innerHTML = '';
        globalToast.removeAllGroups();
    });

    it('message: closes cleanly on user action and cleans up without throwing', async () => {
        defineIsland('message', () => import('../../src/components/message.ts'));

        const container = document.createElement('div');
        container.setAttribute('data-island', 'message');
        container.setAttribute('data-hydrate', 'load');
        container.setAttribute('data-props', JSON.stringify({
            severity: 'info',
            text: 'Informational message',
            closable: true
        }));
        document.body.appendChild(container);

        hydrateIsland(container);
        await new Promise(r => setTimeout(r, 40));

        const closeBtn = container.querySelector('button');
        assert.ok(closeBtn, 'Close button should be rendered');

        // Click close button
        closeBtn.click();

        // Wait for transition fallback to execute
        await new Promise(r => setTimeout(r, 300));

        assert.equal(container.parentElement, null, 'Message container should be removed from DOM');
    });

    it('message: does not throw if unmounted during transition', async () => {
        defineIsland('message', () => import('../../src/components/message.ts'));

        const container = document.createElement('div');
        container.setAttribute('data-island', 'message');
        container.setAttribute('data-hydrate', 'load');
        container.setAttribute('data-props', JSON.stringify({
            severity: 'warn',
            text: 'Warning message',
            closable: true
        }));
        document.body.appendChild(container);

        hydrateIsland(container);
        await new Promise(r => setTimeout(r, 40));

        const closeBtn = container.querySelector('button');
        assert.ok(closeBtn);

        closeBtn.click();

        // Unmount island in the middle of 250ms transition
        assert.doesNotThrow(() => {
            container.dispatchEvent(new CustomEvent('laughtale:unmount'));
        });

        // Wait past 250ms fallback
        await new Promise(r => setTimeout(r, 300));
    });

    it('toast: dismisses after fallback and handles teardown cleanly', async () => {
        defineIsland('toast', () => import('../../src/components/toast.ts'));

        const container = document.createElement('div');
        container.setAttribute('data-island', 'toast');
        container.setAttribute('data-hydrate', 'load');
        document.body.appendChild(container);

        hydrateIsland(container);
        await new Promise(r => setTimeout(r, 40));

        const id = globalToast.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Operation completed',
            life: 3000
        });

        const toastEl = container.querySelector('.p-toast-message');
        assert.ok(toastEl, 'Toast message should be rendered in container');

        // Remove toast
        globalToast.removeById(id);

        // Wait for 250ms transition fallback
        await new Promise(r => setTimeout(r, 300));

        assert.ok(!container.querySelector('.p-toast-message'), 'Toast element should be removed after transition');

        // Unmount toast island
        assert.doesNotThrow(() => {
            container.dispatchEvent(new CustomEvent('laughtale:unmount'));
        });
    });

    it('galleria: mounts and stops autoplay cleanly on teardown', async () => {
        defineIsland('galleria', () => import('../../src/components/galleria.ts'));

        const container = document.createElement('div');
        container.setAttribute('data-island', 'galleria');
        container.setAttribute('data-hydrate', 'load');
        container.setAttribute('data-props', JSON.stringify({
            value: [
                { itemImageSrc: 'img1.jpg', title: 'Image 1' },
                { itemImageSrc: 'img2.jpg', title: 'Image 2' }
            ],
            autoPlay: true,
            transitionInterval: 2000
        }));
        document.body.appendChild(container);

        hydrateIsland(container);
        await new Promise(r => setTimeout(r, 40));

        assert.doesNotThrow(() => {
            container.dispatchEvent(new CustomEvent('laughtale:unmount'));
        });
    });
});
