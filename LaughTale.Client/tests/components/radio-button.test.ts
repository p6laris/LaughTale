import '../setup.ts';
import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import RadioButtonIsland from '../../src/components/radio-button.ts';

describe('Radio Button Group Suite', () => {
    beforeEach(() => {
        document.body.innerHTML = '';
    });

    it('selecting a different option in a group does not throw and dispatches the change event (regression: an undefined `hiddenInp` reference threw a ReferenceError on every group selection, silently swallowing the event dispatch that follows it)', () => {
        const container = document.createElement('div');
        document.body.appendChild(container);

        let changeDetail: any = null;
        container.addEventListener('laughtale:radio-button:change', (e: any) => {
            changeDetail = e.detail;
        });

        RadioButtonIsland(container, {
            name: 'size',
            value: '',
            options: [
                { value: 'small', label: 'Small' },
                { value: 'medium', label: 'Medium' },
                { value: 'large', label: 'Large' }
            ],
            selectedValue: 'small'
        });

        const inputs = Array.from(container.querySelectorAll<HTMLInputElement>('.p-radiobutton-input'));
        assert.equal(inputs.length, 3);

        assert.doesNotThrow(() => {
            inputs[1].checked = true;
            inputs[1].dispatchEvent(new Event('change', { bubbles: true }));
        });

        assert.ok(changeDetail, 'the change event must actually dispatch - previously never reached because the preceding line threw');
        assert.equal(changeDetail.value, 'medium');
    });
});
