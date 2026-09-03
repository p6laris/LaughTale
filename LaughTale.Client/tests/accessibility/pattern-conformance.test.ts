import '../setup.ts';
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import KnobIsland, { a11y as knobA11y } from '../../src/components/knob.ts';
import MultiSelectIsland, { a11y as multiSelectA11y } from '../../src/components/multiselect.ts';
import TagIsland, { a11y as tagA11y } from '../../src/components/tag.ts';
import DialogIsland, { a11y as dialogA11y } from '../../src/components/dialog.ts';
import TextareaIsland, { a11y as textareaA11y } from '../../src/components/textarea.ts';
import BlockUIIsland, { a11y as blockuiA11y } from '../../src/components/blockui.ts';

describe('Per-Pattern Conformance Suite (T029 / US2)', () => {
    it('slider pattern conformance (knob)', () => {
        assert.equal(knobA11y.kind, 'pattern');
        if (knobA11y.kind === 'pattern') {
            assert.equal(knobA11y.pattern, 'slider');
        }

        const container = document.createElement('div');
        document.body.appendChild(container);
        KnobIsland(container, { value: 42, min: 0, max: 100, ariaLabel: 'Volume' } as any);

        const sliderEl = container.querySelector('[role="slider"]');
        assert.ok(sliderEl, 'slider element exists with role="slider"');
        assert.equal(sliderEl.getAttribute('aria-valuenow'), '42');
        assert.equal(sliderEl.getAttribute('aria-valuemin'), '0');
        assert.equal(sliderEl.getAttribute('aria-valuemax'), '100');
        assert.equal(sliderEl.getAttribute('aria-label'), 'Volume');

        container.remove();
    });

    it('listbox pattern conformance (multiselect)', () => {
        assert.equal(multiSelectA11y.kind, 'pattern');
        if (multiSelectA11y.kind === 'pattern') {
            assert.equal(multiSelectA11y.pattern, 'listbox');
        }

        const container = document.createElement('div');
        document.body.appendChild(container);
        MultiSelectIsland(container, {
            options: [
                { label: 'Option 1', value: 'opt1' },
                { label: 'Option 2', value: 'opt2' }
            ],
            selectedValues: ['opt1']
        });

        const listboxEl = container.querySelector('[role="listbox"]');
        assert.ok(listboxEl, 'listbox element exists with role="listbox"');
        assert.equal(listboxEl.getAttribute('aria-multiselectable'), 'true');

        // Open listbox
        const trigger = container.querySelector<HTMLElement>('.multiselect-trigger')!;
        trigger.dispatchEvent(new MouseEvent('click', { bubbles: true }));

        const options = container.querySelectorAll('[role="option"]');
        assert.equal(options.length, 2, 'two options rendered');
        assert.equal(options[0].getAttribute('aria-selected'), 'true');
        assert.equal(options[1].getAttribute('aria-selected'), 'false');

        container.remove();
    });

    it('status pattern conformance (tag)', () => {
        assert.equal(tagA11y.kind, 'pattern');
        if (tagA11y.kind === 'pattern') {
            assert.equal(tagA11y.pattern, 'status');
        }

        const container = document.createElement('div');
        document.body.appendChild(container);
        TagIsland(container, { value: 'Active Status' });

        const statusEl = container.querySelector('[role="status"]');
        assert.ok(statusEl, 'status element exists with role="status"');
        assert.equal(statusEl.getAttribute('aria-live'), 'polite');

        container.remove();
    });

    it('dialog pattern conformance (dialog)', () => {
        assert.equal(dialogA11y.kind, 'pattern');
        if (dialogA11y.kind === 'pattern') {
            assert.equal(dialogA11y.pattern, 'dialog');
        }

        const container = document.createElement('div');
        document.body.appendChild(container);
        DialogIsland(container, { header: 'User Profile', visible: true });

        const dialogEl = container.querySelector('[role="dialog"]');
        assert.ok(dialogEl, 'dialog element exists with role="dialog"');
        assert.equal(dialogEl.getAttribute('aria-modal'), 'true');

        container.remove();
    });

    it('native pattern conformance (textarea)', () => {
        assert.equal(textareaA11y.kind, 'native');
        if (textareaA11y.kind === 'native') {
            assert.equal(textareaA11y.element, 'textarea');
        }

        const container = document.createElement('div');
        document.body.appendChild(container);
        TextareaIsland(container, { value: 'test', invalid: true });

        const textareaEl = container.querySelector('textarea');
        assert.ok(textareaEl, 'native textarea rendered');
        assert.equal(textareaEl.getAttribute('role'), null, 'native textarea does not have redundant role');
        assert.equal(textareaEl.getAttribute('aria-invalid'), 'true');

        container.remove();
    });

    it('presentational pattern conformance (blockui)', () => {
        assert.equal(blockuiA11y.kind, 'presentational');

        const container = document.createElement('div');
        document.body.appendChild(container);
        BlockUIIsland(container, { blocked: true });

        const interactive = container.querySelector('button, input, select, textarea');
        assert.equal(interactive, null, 'presentational component renders no interactive elements');

        container.remove();
    });
});
