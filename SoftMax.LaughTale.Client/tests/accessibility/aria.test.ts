import '../setup.ts';
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
    applyAriaAttributes,
    setRovingTabindex,
    handleRovingKeydown
} from '../../src/accessibility/aria.ts';

describe('WAI-ARIA 1.2 & Roving Tabindex Suite (LT-801)', () => {
    it('applyAriaAttributes sets and removes ARIA attributes accurately', () => {
        const btn = document.createElement('button');

        applyAriaAttributes(btn, {
            expanded: true,
            haspopup: 'menu',
            controls: 'my-drawer-1'
        });

        assert.equal(btn.getAttribute('aria-expanded'), 'true');
        assert.equal(btn.getAttribute('aria-haspopup'), 'menu');
        assert.equal(btn.getAttribute('aria-controls'), 'my-drawer-1');

        // Remove attribute with null
        applyAriaAttributes(btn, {
            expanded: null
        });
        assert.equal(btn.hasAttribute('aria-expanded'), false);
    });

    it('setRovingTabindex updates active index to 0 and other elements to -1', () => {
        const item0 = document.createElement('div');
        const item1 = document.createElement('div');
        const item2 = document.createElement('div');
        const items = [item0, item1, item2];

        setRovingTabindex(items, 1);

        assert.equal(item0.getAttribute('tabindex'), '-1');
        assert.equal(item1.getAttribute('tabindex'), '0');
        assert.equal(item2.getAttribute('tabindex'), '-1');
    });

    it('handleRovingKeydown navigates with Arrow keys and wraps around boundaries', () => {
        const item0 = document.createElement('button');
        const item1 = document.createElement('button');
        const item2 = document.createElement('button');
        const items = [item0, item1, item2];

        // ArrowDown from 0 -> 1
        const eventDown = new KeyboardEvent('keydown', { key: 'ArrowDown', cancelable: true });
        const next1 = handleRovingKeydown(eventDown, items, 0, 'vertical');
        assert.equal(next1, 1);
        assert.equal(item1.getAttribute('tabindex'), '0');

        // ArrowDown from 2 -> wraps to 0
        const next0 = handleRovingKeydown(eventDown, items, 2, 'vertical');
        assert.equal(next0, 0);
        assert.equal(item0.getAttribute('tabindex'), '0');

        // End key jumps to last element
        const eventEnd = new KeyboardEvent('keydown', { key: 'End', cancelable: true });
        const nextEnd = handleRovingKeydown(eventEnd, items, 0);
        assert.equal(nextEnd, 2);
        assert.equal(item2.getAttribute('tabindex'), '0');
    });
});
