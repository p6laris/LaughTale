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

        container.addEventListener('change', handler);
        container.addEventListener('slider:change', handler);

        // Trigger keyboard arrow up to change value
        const handle = container.querySelector<HTMLElement>('.p-slider-handle')!;
        handle.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));

        console.log(`[Defect 1] slider drag/arrow eventCount: ${eventCount} (expected 2 before fix)`);
        assert.strictEqual(eventCount, 2, 'slider should have fired 2 duplicate events for one change');

        document.body.removeChild(container);
    });

    it('toggle-switch dispatches 3 events for one toggle', () => {
        const container = document.createElement('div');
        document.body.appendChild(container);

        ToggleSwitchIsland(container, { checked: false });

        let eventCount = 0;
        const handler = () => { eventCount++; };

        container.addEventListener('change', handler);
        container.addEventListener('switch:change', handler);
        container.addEventListener('toggleswitch:change', handler);

        // Click the switch
        const sliderEl = container.querySelector<HTMLElement>('.p-toggleswitch-slider')!;
        sliderEl.click();

        console.log(`[Defect 1] toggle-switch click eventCount: ${eventCount} (expected 3 before fix)`);
        assert.strictEqual(eventCount, 3, 'toggle-switch should have fired 3 duplicate events for one toggle');

        document.body.removeChild(container);
    });
});
