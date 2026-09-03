import { describe, it } from 'node:test';
import assert from 'node:assert';
import '../setup';
import InputMaskIsland from '../../src/components/input-mask';
import ListboxIsland from '../../src/components/listbox';
import PaginatorIsland from '../../src/components/paginator';
import RatingIsland from '../../src/components/rating';
import SelectButtonIsland from '../../src/components/select-button';

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
});
