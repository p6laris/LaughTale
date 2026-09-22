import '../setup.ts';
import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import SelectIsland, { type SelectOption } from '../../src/components/select.ts';

// Characterization + regression suite for the signals/list-patch retrofit of select.ts
// (ROADMAP.v5.md Part I/J). This component had ZERO real behavioral test coverage before this pass
// (select-parts.test.ts only covers data-part/passthrough/lifecycle) - these tests cover both the
// pre-existing behavior being restructured (single/multiple/checkbox/chip selection, filtering,
// grouping, virtualization) AND the specific regressions the restructuring is meant to fix (node
// identity across re-renders, the delegated option-click listener still firing on a reused node,
// debounced filtering only applying once its interval elapses, and the outside-click listener
// accumulation bug being gone).
//
// There is no server-rendered [data-lt-field] in these plain test containers, so useFormField's
// setValue/getValue are no-ops here (the same convention autocomplete.test.ts/datatable.test.ts
// already rely on) - selection state is asserted instead via the component's own rendered DOM
// (trigger label, chips, option classes) and its emitted `laughtale:select:change` event.

function wait(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const flatOptions: SelectOption[] = [
    { label: 'Alpha', value: 'alpha' },
    { label: 'Bravo', value: 'bravo' },
    { label: 'Charlie', value: 'charlie' }
];

const groupedOptions: SelectOption[] = [
    {
        label: 'Fruits', value: 'fruits', items: [
            { label: 'Apple', value: 'apple' },
            { label: 'Banana', value: 'banana' }
        ]
    },
    {
        label: 'Vegetables', value: 'vegetables', items: [
            { label: 'Carrot', value: 'carrot' }
        ]
    }
];

describe('Select Signals + patchList Retrofit Suite (ROADMAP.v5.md Part I/J)', () => {
    let container: HTMLElement;

    beforeEach(() => {
        document.body.innerHTML = '';
        container = document.createElement('div');
        document.body.appendChild(container);
    });

    describe('Disabled guard (ROADMAP.v5.md Part M "Adopt - State machine")', () => {
        it('a disabled select cannot be opened by clicking the trigger', () => {
            SelectIsland(container, { options: flatOptions, disabled: true });

            container.click();

            const overlay = container.querySelector<HTMLElement>('.p-select-overlay')!;
            assert.equal(overlay.classList.contains('is-visible'), false, 'toggleOverlay must be a no-op while disabled - the guard is now intrinsic to the open transition, not a per-call-site check');
            assert.equal(container.getAttribute('aria-expanded'), 'false');
        });

        it('an enabled select opens normally, proving the guard only blocks the disabled case', () => {
            SelectIsland(container, { options: flatOptions, disabled: false });

            container.click();

            const overlay = container.querySelector<HTMLElement>('.p-select-overlay')!;
            assert.equal(overlay.classList.contains('is-visible'), true);
        });
    });

    describe('Single-select', () => {
        it('picking an option updates the trigger label and closes the overlay', () => {
            SelectIsland(container, { options: flatOptions });

            container.click(); // opens the overlay (delegated container click router)
            const overlay = container.querySelector<HTMLElement>('.p-select-overlay')!;
            assert.ok(overlay.classList.contains('is-visible'), 'overlay opens on trigger click');

            const bravoOption = container.querySelector<HTMLElement>('.p-select-option[data-value="bravo"]')!;
            bravoOption.click();

            const label = container.querySelector('.p-select-label');
            assert.ok(label?.textContent?.includes('Bravo'), 'trigger label reflects the picked option');
            assert.equal(overlay.classList.contains('is-visible'), false, 'picking an option in single-select mode closes the overlay');
        });
    });

    describe('Multiple-select (checkbox mode)', () => {
        it('picking multiple options updates the trigger label/count and the select-all header state; select-all toggles all; clear empties the selection', () => {
            SelectIsland(container, { options: flatOptions, multiple: true, checkbox: true, showClear: true });

            container.click();
            container.querySelector<HTMLElement>('.p-select-option[data-value="alpha"]')!.click();
            container.querySelector<HTMLElement>('.p-select-option[data-value="bravo"]')!.click();

            const label = container.querySelector('.p-select-label');
            assert.ok(label?.textContent?.includes('Alpha'), 'trigger shows the first selected label');
            assert.ok(label?.textContent?.includes('+1 more'), 'trigger shows a count of the remaining selections');

            // Re-queried fresh after every state change below rather than held across it: unlike the
            // patchList-managed option `<li>`s, the select-all header's content is a plain `setHtml`
            // full replace on every `selectedValues` change (see renderHeaderAllHtml's effect in
            // select.ts), so a node reference captured before a re-render goes stale on purpose.
            assert.equal(
                container.querySelector('.p-select-header-all .p-select-option-checkbox')?.classList.contains('is-checked'),
                false,
                'select-all is not fully checked with 2/3 selected (indeterminate)'
            );
            assert.ok(container.querySelector('.p-select-header-all')?.textContent?.includes('(2/3)'), 'select-all header reflects the current count');

            container.querySelector<HTMLElement>('.p-select-header-all')!.click();
            assert.ok(
                container.querySelector('.p-select-header-all .p-select-option-checkbox')?.classList.contains('is-checked'),
                'select-all toggles every option on'
            );
            assert.ok(container.querySelector('.p-select-header-all')?.textContent?.includes('(3/3)'));

            const clearIcon = container.querySelector<HTMLElement>('.p-select-clear-icon')!;
            clearIcon.click();
            assert.equal(container.querySelectorAll('.p-select-option.p-highlight').length, 0, 'clear-icon click empties the selection');
            assert.ok(container.querySelector('.p-select-label')?.classList.contains('p-placeholder'), 'trigger reverts to the placeholder once cleared');
        });
    });

    describe('Chip display mode', () => {
        it('removing a chip via its own remove button updates the selection', () => {
            SelectIsland(container, { options: flatOptions, multiple: true, display: 'chip' });

            container.click();
            container.querySelector<HTMLElement>('.p-select-option[data-value="alpha"]')!.click();
            container.querySelector<HTMLElement>('.p-select-option[data-value="charlie"]')!.click();

            let chips = container.querySelectorAll('.p-select-chip');
            assert.equal(chips.length, 2, 'one chip per selected value');

            const alphaChipRemove = container.querySelector<HTMLElement>('.p-select-chip-remove[data-remove="alpha"]')!;
            alphaChipRemove.click();

            chips = container.querySelectorAll('.p-select-chip');
            assert.equal(chips.length, 1, 'removing a chip via its own button updates the chip list');
            assert.equal(chips[0].getAttribute('data-value'), 'charlie');
        });
    });

    describe('Filtering', () => {
        it('narrows the option list to matches only after the debounce elapses', async () => {
            SelectIsland(container, { options: flatOptions, filter: true });

            const filterInput = container.querySelector<HTMLInputElement>('.p-select-filter-input')!;
            filterInput.value = 'bra';
            filterInput.dispatchEvent(new Event('input', { bubbles: true }));

            // Debounced at 150ms (see the useDebounce call in bindStaticEvents) - nothing should have
            // filtered yet.
            assert.equal(container.querySelectorAll('.p-select-option').length, 3, 'list must not narrow before the debounce elapses');

            await wait(250);

            const options = container.querySelectorAll<HTMLElement>('.p-select-option');
            assert.equal(options.length, 1, 'only "Bravo" contains "bra"');
            assert.equal(options[0].getAttribute('data-value'), 'bravo');
        });
    });

    describe('Grouped options', () => {
        it('renders group headers interspersed with matching items, both unfiltered and filtered', async () => {
            SelectIsland(container, { options: groupedOptions, filter: true });

            let headers = Array.from(container.querySelectorAll('.p-select-option-group')).map(h => h.textContent?.trim());
            assert.deepEqual(headers, ['Fruits', 'Vegetables'], 'both group headers render unfiltered');
            assert.equal(container.querySelectorAll('.p-select-option').length, 3, 'all items render under their groups');

            const filterInput = container.querySelector<HTMLInputElement>('.p-select-filter-input')!;
            filterInput.value = 'car';
            filterInput.dispatchEvent(new Event('input', { bubbles: true }));
            await wait(250);

            headers = Array.from(container.querySelectorAll('.p-select-option-group')).map(h => h.textContent?.trim());
            assert.deepEqual(headers, ['Vegetables'], 'a group with no matching children is dropped entirely once filtered');
            const items = container.querySelectorAll<HTMLElement>('.p-select-option');
            assert.equal(items.length, 1);
            assert.equal(items[0].getAttribute('data-value'), 'carrot');
        });
    });

    describe('Node identity (patchList regression proof)', () => {
        it('selecting one option leaves an unrelated option\'s own <li> node instance untouched, and its delegated click listener still works on the reused node', () => {
            let lastDetail: any = null;
            SelectIsland(container, { options: flatOptions, multiple: true });
            container.addEventListener('laughtale:select:change', (e: any) => { lastDetail = e.detail; });

            container.click();
            const charlieNode = container.querySelector<HTMLElement>('.p-select-option[data-value="charlie"]')!;

            container.querySelector<HTMLElement>('.p-select-option[data-value="alpha"]')!.click();

            assert.equal(
                container.querySelector('.p-select-option[data-value="charlie"]'),
                charlieNode,
                'charlie was not selected, so patchList must reuse its DOM node rather than recreate it'
            );

            // Prove the captured (reused) node's own click still registers - this is the delegated
            // `listEl` click listener (bound once at setup), not a per-option listener, so this also
            // proves delegation survived the re-render, not just that the node persisted.
            charlieNode.click();
            assert.deepEqual(new Set(lastDetail.value), new Set(['alpha', 'charlie']));
        });
    });

    describe('Outside-click listener accumulation fix', () => {
        it('after several selections in sequence, a single outside click closes the overlay exactly once', () => {
            SelectIsland(container, { options: flatOptions, multiple: true, checkbox: true, showClear: true });

            container.click(); // open
            container.querySelector<HTMLElement>('.p-select-option[data-value="alpha"]')!.click();
            container.querySelector<HTMLElement>('.p-select-option[data-value="bravo"]')!.click();
            container.querySelector<HTMLElement>('.p-select-header-all')!.click();
            container.querySelector<HTMLElement>('.p-select-clear-icon')!.click();

            const overlay = container.querySelector<HTMLElement>('.p-select-overlay')!;
            assert.ok(overlay.classList.contains('is-visible'), 'overlay is still open after several in-overlay state changes');

            // Spy on the one DOM effect that only ever happens as part of closing the overlay
            // (`toggleOverlay(false)`'s own `classList.remove('is-open')`). If the old bug - a fresh
            // outside-click listener added on every render, on top of a second, separately-registered,
            // functionally-identical listener - were still present, a single outside click would run
            // the close path more than once.
            let closeSideEffectCalls = 0;
            const originalRemove = container.classList.remove.bind(container.classList);
            container.classList.remove = ((...tokens: string[]) => {
                if (tokens.includes('is-open')) closeSideEffectCalls++;
                return originalRemove(...tokens);
            }) as typeof container.classList.remove;

            document.body.dispatchEvent(new MouseEvent('click', { bubbles: true }));

            assert.equal(overlay.classList.contains('is-visible'), false, 'the outside click closes the overlay');
            assert.equal(closeSideEffectCalls, 1, 'the close path must run exactly once per outside click, not once per accumulated listener');
        });
    });

    describe('Virtualized path', () => {
        it('renders a bounded window for 150 options and scrolling shifts that window', () => {
            const manyOptions: SelectOption[] = Array.from({ length: 150 }, (_, i) => ({
                label: `Option ${i}`,
                value: `opt_${i}`
            }));
            SelectIsland(container, { options: manyOptions });

            const rendered = container.querySelectorAll('.p-select-option');
            assert.ok(rendered.length > 0, 'some options must render');
            assert.ok(rendered.length < 100, `expected a virtualized window under 100 options, got ${rendered.length}`);
            assert.ok(container.querySelector('.p-virtual-spacer'), 'virtualized list keeps its spacer element');
            assert.ok(container.querySelector('.p-virtual-list'), 'virtualized list keeps its inner scroll-window element');

            const listEl = container.querySelector<HTMLElement>('.p-select-list')!;
            const firstIndexBefore = container.querySelector('.p-select-option')?.getAttribute('data-index');

            listEl.scrollTop = 1200;
            listEl.dispatchEvent(new Event('scroll'));

            const firstIndexAfter = container.querySelector('.p-select-option')?.getAttribute('data-index');
            assert.notEqual(firstIndexAfter, firstIndexBefore, 'scrolling the virtualized list shifts the rendered window');
        });
    });
});
