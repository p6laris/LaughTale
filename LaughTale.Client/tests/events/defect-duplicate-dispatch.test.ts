import { describe, it } from 'node:test';
import assert from 'node:assert';
import '../setup';
import SliderIsland from '../../src/components/slider';
import ToggleSwitchIsland from '../../src/components/toggle-switch';

describe('Defect 1 Reproduction: Duplicate Dispatches (T006)', () => {
    it('slider dispatches 2 events for one value change', () => {
        const container = document.createElement('div');
        document.body.appendChild(container);

        SliderIsland(container, { modelValue: 20 });

        let eventCount = 0;
        const handler = () => { eventCount++; };

        container.addEventListener('laughtale:slider:change', handler);

        // Trigger keyboard arrow up to change value
        const handle = container.querySelector<HTMLElement>('.p-slider-handle')!;
        handle.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));

        console.log(`[Defect 1 Fixed] slider canonical eventCount: ${eventCount} (expected 1 after fix)`);
        assert.strictEqual(eventCount, 1, 'slider canonical event fires exactly 1 time for one change');

        document.body.removeChild(container);
    });

    it('toggle-switch dispatches canonical event once for one toggle (fixed in T028)', () => {
        const container = document.createElement('div');
        document.body.appendChild(container);

        ToggleSwitchIsland(container, { checked: false });

        let eventCount = 0;
        const handler = () => { eventCount++; };

        container.addEventListener('laughtale:toggle-switch:change', handler);

        // Click the switch
        const sliderEl = container.querySelector<HTMLElement>('.p-toggleswitch-slider')!;
        sliderEl.click();

        console.log(`[Defect 1 Fixed] toggle-switch canonical eventCount: ${eventCount} (expected 1 after fix)`);
        assert.strictEqual(eventCount, 1, 'toggle-switch canonical event fires exactly 1 time for one toggle');

        document.body.removeChild(container);
    });
});
