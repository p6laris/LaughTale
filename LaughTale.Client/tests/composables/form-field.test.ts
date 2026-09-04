import '../setup.ts';
import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { useFormField } from '../../src/composables/useFormField.ts';
import type { IslandContext } from '../../src/runtime/registry.ts';

describe('useFormField Headless Composable Suite (Contract C5)', () => {
    let container: HTMLElement;

    beforeEach(() => {
        container = document.createElement('div');
        document.body.appendChild(container);
    });

    it('adopts server-rendered field and companion within container', () => {
        container.innerHTML = `
            <input type="hidden" name="User.Role" value="Admin" data-lt-field>
        `;
        const initialInput = container.querySelector<HTMLInputElement>('input')!;

        const formField = useFormField(container, undefined, { cardinality: 'Single' });

        assert.equal(formField.field, initialInput);
        assert.equal(formField.getValue(), 'Admin');
        assert.equal(formField.companion, null);
    });

    it('preserves node identity across detach and reattach', () => {
        container.innerHTML = `
            <input type="hidden" name="User.Name" value="Alice" data-lt-field>
        `;
        const originalNode = container.querySelector<HTMLInputElement>('[data-lt-field]')!;

        const formField = useFormField(container, undefined, { cardinality: 'Single' });

        formField.detach();
        assert.equal(container.querySelector('[data-lt-field]'), null);

        // Simulate innerHTML replace (e.g. setHtml)
        container.innerHTML = '<span class="widget-ui">Rendered</span>';

        formField.reattach();
        const reattachedNode = container.querySelector<HTMLInputElement>('[data-lt-field]');
        assert.equal(reattachedNode, originalNode);
        assert.equal(reattachedNode?.value, 'Alice');
    });

    it('serializes Single cardinality: empty value is submitted as value=""', () => {
        container.innerHTML = `
            <input type="hidden" name="Description" value="Initial" data-lt-field>
        `;
        const formField = useFormField(container, undefined, { cardinality: 'Single' });

        formField.setValue('Updated text');
        assert.equal(formField.field?.value, 'Updated text');
        assert.equal(formField.getValue(), 'Updated text');

        formField.setValue(null);
        assert.equal(formField.field?.value, '');
        assert.equal(formField.field?.disabled, false);
    });

    it('serializes Multiple cardinality: repeated fields, empty selection disabled', () => {
        container.innerHTML = `
            <input type="hidden" name="Tags" value="tag1" data-lt-field>
            <input type="hidden" name="Tags" value="tag2" data-lt-field>
        `;
        const formField = useFormField(container, undefined, { cardinality: 'Multiple' });

        assert.deepEqual(formField.getValue(), ['tag1', 'tag2']);

        // Update to 3 values
        formField.setValue(['alpha', 'beta', 'gamma']);
        const activeFields = Array.from(container.querySelectorAll<HTMLInputElement>('input[data-lt-field]'))
            .filter(f => !f.disabled);
        assert.equal(activeFields.length, 3);
        assert.deepEqual(activeFields.map(f => f.value), ['alpha', 'beta', 'gamma']);

        // Empty selection disables fields so nothing posts per C2
        formField.setValue([]);
        const nonDisabled = Array.from(container.querySelectorAll<HTMLInputElement>('input[data-lt-field]'))
            .filter(f => !f.disabled);
        assert.equal(nonDisabled.length, 0);
    });

    it('serializes Boolean cardinality: companion value="false" + field value="true"', () => {
        container.innerHTML = `
            <input type="hidden" name="Agreed" value="false" data-lt-field-companion>
            <input type="hidden" name="Agreed" value="true" data-lt-field disabled>
        `;
        const formField = useFormField(container, undefined, { cardinality: 'Boolean' });

        assert.equal(formField.getValue(), false);
        assert.equal(formField.companion?.value, 'false');
        assert.equal(formField.field?.disabled, true);

        // Checked state
        formField.setValue(true);
        assert.equal(formField.getValue(), true);
        assert.equal(formField.field?.disabled, false);
        assert.equal(formField.field?.value, 'true');

        // Unchecked state disables primary field so only companion posts
        formField.setValue(false);
        assert.equal(formField.getValue(), false);
        assert.equal(formField.field?.disabled, true);
    });

    it('handles no-field diagnostic path without throwing or creating elements', () => {
        container.innerHTML = '<div>No fields here</div>';

        let warned = false;
        const originalWarn = console.warn;
        console.warn = (...args: any[]) => {
            if (args[0]?.includes('[LaughTale] useFormField')) {
                warned = true;
            }
        };

        try {
            const formField = useFormField(container);
            assert.equal(formField.field, null);
            assert.equal(warned, true);

            // Setting value on no-field return is a safe no-op
            formField.setValue('test');
            assert.equal(container.querySelectorAll('input').length, 0);
        } finally {
            console.warn = originalWarn;
        }
    });

    it('cleans up on context abort signal', () => {
        container.innerHTML = `
            <input type="hidden" name="Test" value="val" data-lt-field>
        `;
        const controller = new AbortController();
        const ctx: IslandContext = {
            signal: controller.signal,
            onCleanup: () => {}
        };

        const formField = useFormField(container, ctx);
        assert.ok(formField.field);

        // Abort should trigger destroy cleanly without error
        controller.abort();
    });
});
