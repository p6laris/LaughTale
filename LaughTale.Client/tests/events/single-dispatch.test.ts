import { describe, it } from 'node:test';
import assert from 'node:assert';
import '../setup';
import InputMaskIsland from '../../src/components/input-mask';
import ListboxIsland from '../../src/components/listbox';
import PaginatorIsland from '../../src/components/paginator';
import RatingIsland from '../../src/components/rating';
import SelectButtonIsland from '../../src/components/select-button';
import SelectIsland from '../../src/components/select';
import SliderIsland from '../../src/components/slider';
import ToggleSwitchIsland from '../../src/components/toggle-switch';
import ToggleButtonIsland from '../../src/components/toggle-button';
import TreeSelectIsland from '../../src/components/tree-select';

describe('Batch A Single Dispatch & Payload Union Suite (T019)', () => {
    it('input-mask: dispatches canonical laughtale:input-mask:change once with unified payload', () => {
        const container = document.createElement('div');
        document.body.appendChild(container);

        InputMaskIsland(container, { mask: '99-99' });

        let canonicalCount = 0;
        let receivedDetail: any = null;

        container.addEventListener('laughtale:input-mask:change', (e: any) => {
            canonicalCount++;
            receivedDetail = e.detail;
        });

        const input = container.querySelector<HTMLInputElement>('input[type="text"]')!;
        input.value = '12-34';
        input.dispatchEvent(new Event('input', { bubbles: true }));

        assert.strictEqual(canonicalCount, 1, 'canonical event should fire exactly 1 time');
        assert.ok(receivedDetail, 'detail payload must exist');
        assert.strictEqual(receivedDetail.maskedValue, '12-34', 'must preserve maskedValue from original namespaced event');
        assert.strictEqual(receivedDetail.rawValue, '1234');

        document.body.removeChild(container);
    });

    it('listbox: dispatches canonical laughtale:listbox:change once with unified payload', () => {
        const container = document.createElement('div');
        document.body.appendChild(container);

        ListboxIsland(container, {
            options: [
                { label: 'Option 1', value: 'opt1' },
                { label: 'Option 2', value: 'opt2' }
            ]
        });

        let canonicalCount = 0;
        let receivedDetail: any = null;

        container.addEventListener('laughtale:listbox:change', (e: any) => {
            canonicalCount++;
            receivedDetail = e.detail;
        });

        const item = container.querySelector<HTMLElement>('.p-listbox-option')!;
        item.click();

        assert.strictEqual(canonicalCount, 1, 'canonical event should fire exactly 1 time');
        assert.ok(receivedDetail, 'detail payload must exist');
        assert.deepStrictEqual(receivedDetail.selectedValues, ['opt1'], 'must preserve selectedValues from original namespaced event');

        document.body.removeChild(container);
    });

    it('paginator: dispatches canonical laughtale:paginator:page-change once with unified payload', () => {
        const container = document.createElement('div');
        document.body.appendChild(container);

        PaginatorIsland(container, { totalRecords: 50, rows: 10 });

        let canonicalCount = 0;
        let receivedDetail: any = null;

        container.addEventListener('laughtale:paginator:page-change', (e: any) => {
            canonicalCount++;
            receivedDetail = e.detail;
        });

        const nextBtn = container.querySelector<HTMLElement>('.p-paginator-next')!;
        nextBtn.click();

        assert.strictEqual(canonicalCount, 1, 'canonical event should fire exactly 1 time');
        assert.ok(receivedDetail, 'detail payload must exist');
        assert.strictEqual(receivedDetail.page, 1, 'must have new page');
        assert.strictEqual(receivedDetail.pageCount, 5, 'must preserve pageCount from page event');

        document.body.removeChild(container);
    });

    it('rating: dispatches canonical laughtale:rating:change once with unified payload', () => {
        const container = document.createElement('div');
        document.body.appendChild(container);

        RatingIsland(container, { stars: 5, modelValue: 1 });

        let canonicalCount = 0;
        let receivedDetail: any = null;

        container.addEventListener('laughtale:rating:change', (e: any) => {
            canonicalCount++;
            receivedDetail = e.detail;
        });

        // Click third star item
        const stars = container.querySelectorAll<HTMLElement>('.p-rating-item');
        stars[2].click();

        assert.strictEqual(canonicalCount, 1, 'canonical event should fire exactly 1 time');
        assert.ok(receivedDetail, 'detail payload must exist');
        assert.strictEqual(receivedDetail.value, 3);

        document.body.removeChild(container);
    });

    it('select-button: dispatches canonical laughtale:select-button:change once with unified payload', () => {
        const container = document.createElement('div');
        document.body.appendChild(container);

        SelectButtonIsland(container, {
            options: [
                { label: 'One', value: '1' },
                { label: 'Two', value: '2' }
            ]
        });

        let canonicalCount = 0;
        let receivedDetail: any = null;

        container.addEventListener('laughtale:select-button:change', (e: any) => {
            canonicalCount++;
            receivedDetail = e.detail;
        });

        const buttons = container.querySelectorAll<HTMLElement>('.p-selectbutton-item');
        buttons[1].click();

        assert.strictEqual(canonicalCount, 1, 'canonical event should fire exactly 1 time');
        assert.ok(receivedDetail, 'detail payload must exist');
        assert.strictEqual(receivedDetail.value, '2');

        document.body.removeChild(container);
    });

    it('select: dispatches canonical laughtale:select:change once with unified payload', () => {
        const container = document.createElement('div');
        document.body.appendChild(container);

        SelectIsland(container, {
            options: [
                { label: 'Option A', value: 'a' },
                { label: 'Option B', value: 'b' }
            ]
        });

        let canonicalCount = 0;
        let receivedDetail: any = null;

        container.addEventListener('laughtale:select:change', (e: any) => {
            canonicalCount++;
            receivedDetail = e.detail;
        });

        const option = container.querySelector<HTMLElement>('.p-select-option')!;
        option.click();

        assert.strictEqual(canonicalCount, 1, 'canonical event should fire exactly 1 time');
        assert.ok(receivedDetail, 'detail payload must exist');
        assert.strictEqual(receivedDetail.value, 'a');

        document.body.removeChild(container);
    });

    it('slider: dispatches canonical laughtale:slider:change and slideend once each', () => {
        const container = document.createElement('div');
        document.body.appendChild(container);

        SliderIsland(container, { modelValue: 20 });

        let changeCount = 0;
        let slideendCount = 0;

        container.addEventListener('laughtale:slider:change', () => {
            changeCount++;
        });
        container.addEventListener('laughtale:slider:slideend', () => {
            slideendCount++;
        });

        const handle = container.querySelector<HTMLElement>('.p-slider-handle')!;
        handle.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));

        assert.strictEqual(changeCount, 1, 'canonical change should fire exactly 1 time');

        document.body.removeChild(container);
    });

    it('toggle-switch: dispatches canonical laughtale:toggle-switch:change once', () => {
        const container = document.createElement('div');
        document.body.appendChild(container);

        ToggleSwitchIsland(container, { checked: false });

        let canonicalCount = 0;

        container.addEventListener('laughtale:toggle-switch:change', () => {
            canonicalCount++;
        });

        const sliderEl = container.querySelector<HTMLElement>('.p-toggleswitch-slider')!;
        sliderEl.click();

        assert.strictEqual(canonicalCount, 1, 'canonical change should fire exactly 1 time');

        document.body.removeChild(container);
    });

    it('toggle-button: dispatches canonical laughtale:toggle-button:change once', () => {
        const container = document.createElement('div');
        document.body.appendChild(container);

        ToggleButtonIsland(container, { checked: false });

        let canonicalCount = 0;

        container.addEventListener('laughtale:toggle-button:change', () => {
            canonicalCount++;
        });

        container.click();

        assert.strictEqual(canonicalCount, 1, 'canonical change should fire exactly 1 time');

        document.body.removeChild(container);
    });

    it('tree-select: dispatches canonical laughtale:tree-select:change once with unified payload', () => {
        const container = document.createElement('div');
        document.body.appendChild(container);

        TreeSelectIsland(container, {
            options: [
                { key: '0-0', label: 'Node 0-0' }
            ]
        });

        let canonicalCount = 0;
        let receivedDetail: any = null;

        container.addEventListener('laughtale:tree-select:change', (e: any) => {
            canonicalCount++;
            receivedDetail = e.detail;
        });

        const node = container.querySelector<HTMLElement>('.p-treenode-content')!;
        node.click();

        assert.strictEqual(canonicalCount, 1, 'canonical event should fire exactly 1 time');
        assert.ok(receivedDetail, 'detail payload must exist');
        assert.strictEqual(receivedDetail.value, '0-0');

        document.body.removeChild(container);
    });
});
