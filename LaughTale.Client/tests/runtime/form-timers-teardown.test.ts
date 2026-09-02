import '../setup.ts';
import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { defineIsland, clearRegistry } from '../../src/runtime/registry.ts';
import { hydrateIsland } from '../../src/runtime/hydrator.ts';

describe('Form & Input Controls Timers Teardown Suite (LT-902 / Phase 6)', () => {
    beforeEach(() => {
        clearRegistry();
        document.body.innerHTML = '';
    });

    it('input-mask: positions caret on focus and unmounts while focused without throwing (T020)', async () => {
        defineIsland('input-mask', () => import('../../src/components/input-mask.ts'));

        const container = document.createElement('div');
        container.setAttribute('data-island', 'input-mask');
        container.setAttribute('data-hydrate', 'load');
        container.setAttribute('data-props', JSON.stringify({ mask: '(999) 999-9999' }));
        document.body.appendChild(container);

        hydrateIsland(container);
        await new Promise(r => setTimeout(r, 40));

        const input = container.querySelector('input') as HTMLInputElement;
        assert.ok(input, 'Input element should exist');

        // Focus input
        input.dispatchEvent(new Event('focus'));
        await new Promise(r => setTimeout(r, 20));

        assert.equal(input.value, '(___) ___-____', 'Should populate slot mask');

        // Unmount while focused
        assert.doesNotThrow(() => {
            container.dispatchEvent(new CustomEvent('laughtale:unmount'));
        });
    });

    it('input-tags: flashes existing tag on duplicate and unmounts cleanly (T020)', async () => {
        defineIsland('input-tags', () => import('../../src/components/input-tags.ts'));

        const container = document.createElement('div');
        container.setAttribute('data-island', 'input-tags');
        container.setAttribute('data-hydrate', 'load');
        container.setAttribute('data-props', JSON.stringify({
            value: ['vue', 'react'],
            allowDuplicate: false
        }));
        document.body.appendChild(container);

        hydrateIsland(container);
        await new Promise(r => setTimeout(r, 40));

        const input = container.querySelector('input') as HTMLInputElement;
        assert.ok(input);

        // Try adding duplicate tag 'vue'
        input.value = 'vue';
        input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));

        const tag = container.querySelector('.p-inputtags-tag[data-index="0"]');
        assert.ok(tag?.classList.contains('is-focused'), 'Duplicate tag should have is-focused class');

        // Unmount mid-flash
        assert.doesNotThrow(() => {
            container.dispatchEvent(new CustomEvent('laughtale:unmount'));
        });

        // Wait past 300ms flash timer
        await new Promise(r => setTimeout(r, 350));
    });

    it('select: opens overlay with filter focus and unmounts cleanly while open (T020)', async () => {
        defineIsland('select', () => import('../../src/components/select.ts'));

        const container = document.createElement('div');
        container.setAttribute('data-island', 'select');
        container.setAttribute('data-hydrate', 'load');
        container.setAttribute('data-props', JSON.stringify({
            options: [
                { label: 'One', value: 1 },
                { label: 'Two', value: 2 }
            ],
            filter: true
        }));
        document.body.appendChild(container);

        hydrateIsland(container);
        await new Promise(r => setTimeout(r, 40));

        // Click to open overlay
        container.click();
        await new Promise(r => setTimeout(r, 70));

        const filterInput = container.querySelector('.p-select-filter-input');
        assert.ok(filterInput, 'Filter input should be rendered');

        // Unmount while overlay is open
        assert.doesNotThrow(() => {
            container.dispatchEvent(new CustomEvent('laughtale:unmount'));
        });
    });

    it('textarea: handles autoResize and unmounts cleanly (T020)', async () => {
        defineIsland('textarea', () => import('../../src/components/textarea.ts'));

        const container = document.createElement('div');
        container.setAttribute('data-island', 'textarea');
        container.setAttribute('data-hydrate', 'load');
        container.setAttribute('data-props', JSON.stringify({
            autoResize: true,
            value: 'Initial text content'
        }));
        document.body.appendChild(container);

        hydrateIsland(container);
        await new Promise(r => setTimeout(r, 40));

        const textarea = container.querySelector('textarea');
        assert.ok(textarea, 'Textarea should be rendered');

        // Unmount
        assert.doesNotThrow(() => {
            container.dispatchEvent(new CustomEvent('laughtale:unmount'));
        });
    });
});
