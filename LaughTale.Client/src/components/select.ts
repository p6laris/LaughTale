import { useLocale } from '../composables/useLocale';
/**
 * LaughTale: Enterprise Select Component (Aura Select / Dropdown)
 * Feature-complete select component supporting single, multiple, checkmark, checkbox modes,
 * chips display, debounced filter with search icon, grouping, custom avatar/flag templates,
 * editable mode, clear button, loading state, and full ARIA keyboard navigation.
 */

import { injectIslandStyle } from '../runtime/styles';
import { emitComponentEvent } from '../runtime/events';
import { getLucideIcon } from '../icons/lucide';
import { resolvePart, applyPart, type PassthroughRecord } from '../runtime/parts';
import type { IslandContext } from '../runtime/registry';
import { html, setHtml, url as safeUrl, unsafe, attr, type Raw } from '../runtime/html';
import { signal, effect } from '../runtime/signals';
import { patchList } from '../runtime/list-patch';
import { useDebounce } from '../composables/useDebounce';
import { useVirtualizer, type Virtualizer } from '../composables/useVirtualizer';
import { useFloatingPosition } from '../composables/useFloatingPosition';
import { useFormField } from '../composables/useFormField';
import type { PatternDeclaration } from '../accessibility/patterns';

export const a11y: PatternDeclaration = {
    kind: 'pattern',
    pattern: 'combobox'
};

export interface SelectOption {
    label: string;
    value: any;
    code?: string;
    description?: string;
    badge?: string | number;
    flag?: string;
    icon?: string;
    avatar?: string;
    statusClass?: string;
    disabled?: boolean;
    items?: SelectOption[];
}

export interface SelectProps {
    options: (SelectOption | string)[];
    value?: any;
    selectedValue?: any;
    placeholder?: string;
    multiple?: boolean;
    checkmark?: boolean;
    checkbox?: boolean;
    display?: 'comma' | 'chip';
    filter?: boolean;
    filterPlaceholder?: string;
    filterBy?: string;
    showClear?: boolean;
    editable?: boolean;
    loading?: boolean;
    scrollHeight?: string;
    variant?: 'outlined' | 'filled';
    size?: 'small' | 'normal' | 'large';
    fluid?: boolean;
    invalid?: boolean;
    disabled?: boolean;
    readonly?: boolean;
    inputId?: string;
    name?: string;
    targetInputName?: string;
    header?: string;
    footer?: string;
    pt?: PassthroughRecord;
    studioOverrides?: Record<string, any>;
}

const CSS = `
/* ==================== AURA SELECT ==================== */
.laughtale-select,
.p-select {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: space-between;
    min-height: 2.5rem;
    padding: 0.375rem 0.75rem;
    background: var(--lt-surface-0);
    border: 1px solid var(--lt-surface-200);
    border-radius: var(--lt-radius);
    color: var(--lt-text-primary);
    font-family: var(--p-font-family, inherit);
    font-size: 0.875rem;
    line-height: 1.25;
    cursor: pointer;
    user-select: none;
    outline: none;
    box-sizing: border-box;
    transition: background 150ms ease, border-color 150ms ease, box-shadow 150ms ease, color 150ms ease;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.02);
    gap: 0.5rem;
}

.p-select.p-select-fluid {
    width: 100%;
}

.p-select:hover:not(.is-disabled):not([readonly]) {
    border-color: var(--lt-surface-400);
}

.p-select.is-open,
.p-select:focus-visible {
    border-color: var(--lt-primary-500) !important;
    box-shadow: 0 0 0 1px var(--lt-primary-500) !important;
}

/* Filled Variant */
.p-select.variant-filled {
    background-color: var(--lt-surface-100);
    border-color: transparent;
}
.p-select.variant-filled:hover:not(.is-disabled):not([readonly]) {
    background-color: var(--lt-surface-200);
}
.p-select.variant-filled.is-open,
.p-select.variant-filled:focus-visible {
    background-color: var(--lt-surface-0);
    border-color: var(--lt-primary-500) !important;
}

/* Sizes */
.p-select.size-small,
.p-select.p-select-sm {
    min-height: 2rem;
    padding: 0.25rem 0.5rem;
    font-size: 0.75rem;
}
.p-select.size-large,
.p-select.p-select-lg {
    min-height: 3rem;
    padding: 0.5rem 1rem;
    font-size: 1.0625rem;
}

/* Invalid State */
.p-select.is-invalid {
    border-color: var(--p-red-500, var(--lt-danger-500)) !important;
}
.p-select.is-invalid:focus-visible,
.p-select.is-invalid.is-open {
    box-shadow: 0 0 0 1px var(--p-red-500, var(--lt-danger-500)) !important;
}

/* Disabled State */
.p-select.is-disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background-color: var(--lt-surface-100);
}

/* Select Trigger Content */
.p-select-label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: var(--lt-text-primary);
}
.p-select-label.p-placeholder {
    color: var(--p-text-muted);
}

.p-select-editable-input {
    flex: 1;
    border: none;
    background: transparent;
    outline: none;
    font-family: inherit;
    font-size: inherit;
    color: inherit;
    padding: 0;
    margin: 0;
}

/* Trigger Actions */
.p-select-actions {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    flex-shrink: 0;
}

.p-select-clear-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: var(--p-text-muted);
    cursor: pointer;
    padding: 2px;
    border-radius: 50%;
    transition: color 150ms ease, background 150ms ease;
}
.p-select-clear-icon:hover {
    color: var(--lt-text-primary);
    background: var(--lt-surface-200);
}

.p-select-dropdown {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: var(--p-text-muted);
    transition: transform 200ms cubic-bezier(0.16, 1, 0.3, 1), color 150ms ease;
}
.p-select.is-open .p-select-dropdown {
    transform: rotate(180deg);
    color: var(--lt-primary-500);
}

/* Chips in Trigger */
.p-select-chips-wrap {
    display: flex;
    flex-wrap: wrap;
    gap: 0.25rem;
    align-items: center;
}
.p-select-chip {
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
    padding: 0.125rem 0.5rem;
    background: var(--lt-surface-100);
    border-radius: calc(var(--lt-radius) - 2px);
    font-size: 0.75rem;
    color: var(--lt-surface-700);
}
.p-select-chip-remove {
    cursor: pointer;
    color: var(--p-text-muted);
    display: flex;
}
.p-select-chip-remove:hover {
    color: var(--lt-text-primary);
}

/* ==================== SELECT OVERLAY ==================== */
.p-select-overlay {
    min-width: 100%;
    width: max-content;
    max-width: 24rem;
    background: var(--lt-surface-0);
    border: 1px solid var(--lt-surface-200);
    border-radius: var(--lt-radius);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1);
    z-index: 1100;
    overflow: hidden;
    opacity: 0;
    transform: scale(0.95) translateY(-4px);
    pointer-events: none;
    transition: opacity 150ms cubic-bezier(0.16, 1, 0.3, 1), transform 150ms cubic-bezier(0.16, 1, 0.3, 1);
    box-sizing: border-box;
}

.p-select-overlay.is-visible {
    opacity: 1;
    transform: scale(1) translateY(0);
    pointer-events: auto;
}

/* Filter Bar */
.p-select-filter-container {
    position: relative;
    padding: 0.5rem;
    border-bottom: 1px solid var(--lt-surface-200);
    background: var(--lt-surface-0);
}
.p-select-filter-input {
    width: 100%;
    padding: 0.375rem 0.625rem 0.375rem 2rem;
    background: var(--lt-surface-0);
    border: 1px solid var(--lt-surface-200);
    border-radius: calc(var(--lt-radius) - 2px);
    color: var(--lt-text-primary);
    font-size: 0.8125rem;
    outline: none;
    box-sizing: border-box;
    transition: border-color 150ms ease, box-shadow 150ms ease;
}
.p-select-filter-input:focus {
    border-color: var(--lt-primary-500);
    box-shadow: 0 0 0 1px var(--lt-primary-500);
}
.p-select-filter-icon {
    position: absolute;
    left: 1.125rem;
    top: 50%;
    transform: translateY(-50%);
    color: var(--p-text-muted);
    pointer-events: none;
    display: flex;
}

/* Select All Header */
.p-select-header-all {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 0.75rem;
    border-bottom: 1px solid var(--lt-surface-200);
    font-size: 0.8125rem;
    font-weight: 600;
    color: var(--lt-text-primary);
    cursor: pointer;
    background: var(--lt-surface-50);
}
.p-select-header-all:hover {
    background: var(--lt-surface-100);
}

/* List Options */
.p-select-list {
    list-style: none;
    margin: 0;
    padding: 0.25rem;
    overflow-y: auto;
    max-height: 220px;
    box-sizing: border-box;
}
.p-virtual-spacer {
    position: relative;
    width: 100%;
}
.p-virtual-list {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    margin: 0;
    padding: 0;
    list-style: none;
}

.p-select-option-group {
    padding: 0.5rem 0.75rem 0.25rem;
    font-size: 0.6875rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--p-text-muted);
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.p-select-option {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.5rem 0.75rem;
    border-radius: calc(var(--lt-radius) - 2px);
    font-size: 0.875rem;
    color: var(--lt-text-primary);
    cursor: pointer;
    transition: background 120ms ease, color 120ms ease;
    gap: 0.75rem;
}

.p-select-option:hover:not(.p-disabled) {
    background: var(--lt-surface-100);
}

.p-select-option.p-highlight {
    background: var(--lt-primary-50);
    color: var(--lt-primary-700);
    font-weight: 600;
}
.p-select-option.p-highlight:hover:not(.p-disabled) {
    background: var(--lt-primary-100);
}

.p-select-option.p-disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.p-select-option-content {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex: 1;
}

.p-select-option-checkbox {
    width: 1.125rem;
    height: 1.125rem;
    border: 1px solid var(--lt-surface-200);
    border-radius: calc(var(--lt-radius) - 4px);
    background: var(--lt-surface-0);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: background 150ms ease, border-color 150ms ease;
}
.p-select-option.p-highlight .p-select-option-checkbox,
.p-select-option-checkbox.is-checked {
    background: var(--lt-primary-500);
    border-color: var(--lt-primary-500);
    color: var(--lt-surface-0, var(--lt-surface-0));
}

.p-select-option-checkmark {
    color: var(--lt-primary-600);
    display: flex;
}

.p-select-option-badge {
    font-size: 0.6875rem;
    font-weight: 700;
    padding: 0.125rem 0.375rem;
    border-radius: 9999px;
    background: var(--lt-surface-200);
    color: var(--lt-surface-700);
}

.p-select-empty-message {
    padding: 1rem;
    text-align: center;
    font-size: 0.8125rem;
    color: var(--p-text-muted);
}

/* ==================== DARK MODE ==================== */
html.dark .p-select,
[data-theme="dark"] .p-select,
.dark .p-select {
    background: var(--p-surface-0);
    border-color: var(--p-border-color);
    color: var(--p-text-color);
}
html.dark .p-select:hover:not(.is-disabled):not([readonly]),
[data-theme="dark"] .p-select:hover:not(.is-disabled):not([readonly]),
.dark .p-select:hover:not(.is-disabled):not([readonly]) {
    border-color: var(--p-surface-400);
}
html.dark .p-select.variant-filled,
[data-theme="dark"] .p-select.variant-filled,
.dark .p-select.variant-filled {
    background-color: var(--p-surface-100);
}
html.dark .p-select.variant-filled:hover:not(.is-disabled):not([readonly]),
[data-theme="dark"] .p-select.variant-filled:hover:not(.is-disabled):not([readonly]),
.dark .p-select.variant-filled:hover:not(.is-disabled):not([readonly]) {
    background-color: var(--p-surface-200);
}
html.dark .p-select.variant-filled.is-open,
[data-theme="dark"] .p-select.variant-filled.is-open,
.dark .p-select.variant-filled.is-open {
    background-color: var(--p-surface-0);
}
html.dark .p-select.is-disabled,
[data-theme="dark"] .p-select.is-disabled,
.dark .p-select.is-disabled {
    background-color: var(--p-surface-100);
}
html.dark .p-select-chip,
[data-theme="dark"] .p-select-chip,
.dark .p-select-chip {
    background: var(--p-surface-100);
    color: var(--p-text-color);
}
html.dark .p-select-overlay,
[data-theme="dark"] .p-select-overlay,
.dark .p-select-overlay {
    background: var(--p-surface-0);
    border-color: var(--p-border-color);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -4px rgba(0, 0, 0, 0.5);
}
html.dark .p-select-filter-container,
[data-theme="dark"] .p-select-filter-container,
.dark .p-select-filter-container {
    background: var(--p-surface-0);
    border-color: var(--p-border-color);
}
html.dark .p-select-filter-input,
[data-theme="dark"] .p-select-filter-input,
.dark .p-select-filter-input {
    background: var(--p-surface-50);
    border-color: var(--p-border-color);
    color: var(--p-text-color);
}
html.dark .p-select-header-all,
[data-theme="dark"] .p-select-header-all,
.dark .p-select-header-all {
    background: var(--p-surface-50);
    border-color: var(--p-border-color);
}
html.dark .p-select-header-all:hover,
[data-theme="dark"] .p-select-header-all:hover,
.dark .p-select-header-all:hover {
    background: var(--p-surface-100);
}
html.dark .p-select-option:hover:not(.p-disabled),
[data-theme="dark"] .p-select-option:hover:not(.p-disabled),
.dark .p-select-option:hover:not(.p-disabled) {
    background: var(--p-surface-100);
    color: var(--p-text-color);
}
html.dark .p-select-option.p-highlight,
[data-theme="dark"] .p-select-option.p-highlight,
.dark .p-select-option.p-highlight {
    background: rgba(16, 185, 129, 0.16);
    color: var(--p-primary-300);
}
html.dark .p-select-option.p-highlight:hover:not(.p-disabled),
[data-theme="dark"] .p-select-option.p-highlight:hover:not(.p-disabled),
.dark .p-select-option.p-highlight:hover:not(.p-disabled) {
    background: rgba(16, 185, 129, 0.24);
    color: var(--p-primary-200);
}
html.dark .p-select-option-checkbox,
[data-theme="dark"] .p-select-option-checkbox,
.dark .p-select-option-checkbox {
    background: var(--p-surface-50);
    border-color: var(--p-border-color);
}
html.dark .p-select-option-checkmark,
[data-theme="dark"] .p-select-option-checkmark,
.dark .p-select-option-checkmark {
    color: var(--p-primary-400);
}
html.dark .p-select-option-badge,
[data-theme="dark"] .p-select-option-badge,
.dark .p-select-option-badge {
    background: var(--p-surface-100);
    color: var(--p-text-muted);
}
`;

export default function SelectIsland(container: HTMLElement, props: SelectProps, ctx?: IslandContext) {
    injectIslandStyle('laughtale-select', CSS);
    const locale = useLocale(ctx);

    const isMultiple = props.multiple === true || String(props.multiple) === 'true';
    const isCheckmark = props.checkmark === true || String(props.checkmark) === 'true';
    const isCheckbox = props.checkbox === true || String(props.checkbox) === 'true';
    const isChipDisplay = props.display === 'chip';
    const hasFilter = props.filter === true || String(props.filter) === 'true';
    const showClear = props.showClear === true || String(props.showClear) === 'true';
    const isEditable = props.editable === true || String(props.editable) === 'true';
    const isLoading = props.loading === true || String(props.loading) === 'true';
    const isFluid = props.fluid === true || String(props.fluid) === 'true';
    const isInvalid = props.invalid === true || String(props.invalid) === 'true';
    const isDisabled = props.disabled === true || String(props.disabled) === 'true';
    const isReadonly = props.readonly === true || String(props.readonly) === 'true';
    const isFilled = props.variant === 'filled';
    const size = props.size || 'normal';
    const placeholder = props.placeholder || locale.t('choose') || (locale.isRtl ? 'هەڵبژێرە...' : 'Select an option...');
    const scrollHeight = props.scrollHeight || '220px';

    // Normalize options (support flat and grouped)
    function normalizeOptions(): SelectOption[] {
        const raw = props.options || [];
        return raw.map(opt => {
            if (typeof opt === 'string') {
                return { label: opt, value: opt };
            }
            return opt;
        });
    }

    const allOptions = normalizeOptions();

    // Flatten all items for lookup
    function getFlattenedOptions(opts: SelectOption[]): SelectOption[] {
        const result: SelectOption[] = [];
        opts.forEach(o => {
            if (o.items && o.items.length > 0) {
                o.items.forEach(child => result.push(child));
            } else {
                result.push(o);
            }
        });
        return result;
    }

    const flatOptions = getFlattenedOptions(allOptions);

    const formField = useFormField(container, ctx, {
        cardinality: isMultiple ? 'Multiple' : 'Single',
        name: props.name || props.targetInputName
    });

    // Initial selected values
    let initialSelectedValues: any[] = [];
    const initVal = props.value ?? props.selectedValue ?? formField.getValue();
    if (initVal !== undefined && initVal !== null) {
        if (Array.isArray(initVal)) {
            initialSelectedValues = [...initVal];
        } else if (typeof initVal === 'string' && initVal.includes(',') && isMultiple) {
            initialSelectedValues = initVal.split(',').map(s => s.trim());
        } else if (initVal !== '') {
            initialSelectedValues = [initVal];
        }
    }

    // State (ROADMAP.v5.md Part I/J signals retrofit - see multiselect.ts/datatable.ts/autocomplete.ts
    // for the established pattern this mirrors). `selectedValues` and `filterQuery` are signals, written
    // immutably at every former mutation site; the effects registered at the bottom of this file replace
    // every one of the old manual `render()` calls. `isOpen` stays a plain variable exactly as it was:
    // `toggleOverlay()` already does its own targeted DOM updates (classList/aria-expanded/floating
    // position) and never called `render()`, so it isn't part of the problem this retrofit fixes -
    // matching autocomplete.ts's own decision to leave `highlightedIndex` alone.
    const selectedValues = signal<any[]>(initialSelectedValues);
    const filterQuery = signal('');

    let isOpen = false;

    function isSelected(val: any): boolean {
        return selectedValues().some(v => String(v) === String(val) || (typeof v === 'object' && v?.value === val));
    }

    function getSelectedItems(): SelectOption[] {
        return flatOptions.filter(o => isSelected(o.value) || isSelected(o.code));
    }

    function renderTriggerLabel(): Raw {
        const items = getSelectedItems();
        if (items.length === 0) {
            if (isEditable && selectedValues().length > 0) {
                return html`<span class="p-select-label">${selectedValues()[0]}</span>`;
            }
            return html`<span class="p-select-label p-placeholder">${placeholder}</span>`;
        }

        if (isMultiple) {
            if (isChipDisplay) {
                const chipsHtml = items.map(item => html`
                    <span class="p-select-chip" data-value="${item.value}">
                        ${item.flag ? html`<span>${item.flag}</span>` : ''}
                        <span>${item.label || item.value}</span>
                        <span class="p-select-chip-remove" data-remove="${item.value}">${unsafe(getLucideIcon('x', 12))}</span>
                    </span>
                `);
                return html`<div class="p-select-chips-wrap">${chipsHtml}</div>`;
            } else {
                const first = items[0].label || items[0].value;
                const count = items.length > 1 ? ` (+${items.length - 1} more)` : '';
                return html`<span class="p-select-label">${first}${count}</span>`;
            }
        }

        const item = items[0];
        const flagHtml = item.flag ? html`<span style="font-size: 1.125rem; line-height: 1;">${item.flag}</span>` : '';
        const iconHtml = item.icon ? html`<span style="font-size: 1.125rem; line-height: 1;">${item.icon}</span>` : '';
        const statusHtml = item.statusClass ? html`<span class="w-2 h-2 rounded-full ${item.statusClass}"></span>` : '';

        return html`<span class="p-select-label">${flagHtml}${iconHtml}${statusHtml}<span>${item.label || item.value}</span></span>`;
    }

    function renderActionsHtml(): Raw {
        const hasSelected = selectedValues().length > 0;
        return html`
            ${showClear && hasSelected && !isDisabled ? html`<span class="p-select-clear-icon" data-part="clearButton" title="Clear selection">${unsafe(getLucideIcon('x', 14))}</span>` : ''}
            ${isLoading ? html`<span class="p-select-dropdown" data-part="indicator">${unsafe(getLucideIcon('loader-2', 16))}</span>` : html`<span class="p-select-dropdown" data-part="indicator">${unsafe(getLucideIcon('chevron-down', 16))}</span>`}
        `;
    }

    function renderHeaderAllHtml(): Raw {
        const allSelected = flatOptions.length > 0 && selectedValues().length === flatOptions.length;
        const isIndeterminate = selectedValues().length > 0 && !allSelected;
        return html`
            <div class="p-select-option-checkbox ${allSelected ? 'is-checked' : ''}">
                ${allSelected ? unsafe(getLucideIcon('check', 12)) : (isIndeterminate ? unsafe(getLucideIcon('minus', 12)) : '')}
            </div>
            <span>Select All (${selectedValues().length}/${flatOptions.length})</span>
        `;
    }

    function filterOptions(opts: SelectOption[], q: string): SelectOption[] {
        if (!q) return opts;
        const query = q.toLowerCase();
        const filtered: SelectOption[] = [];

        opts.forEach(opt => {
            if (opt.items && opt.items.length > 0) {
                const matchingChildren = opt.items.filter(c =>
                    (c.label && c.label.toLowerCase().includes(query)) ||
                    (c.value && String(c.value).toLowerCase().includes(query)) ||
                    (c.description && c.description.toLowerCase().includes(query))
                );
                if (matchingChildren.length > 0) {
                    filtered.push({ ...opt, items: matchingChildren });
                }
            } else {
                if (
                    (opt.label && opt.label.toLowerCase().includes(query)) ||
                    (opt.value && String(opt.value).toLowerCase().includes(query)) ||
                    (opt.description && opt.description.toLowerCase().includes(query))
                ) {
                    filtered.push(opt);
                }
            }
        });

        return filtered;
    }

    type FlatSelectItem =
        | { kind: 'group'; opt: SelectOption }
        | { kind: 'item'; opt: SelectOption; id: string; index: number };

    const ITEM_HEIGHT = 38;
    let virtualizer: Virtualizer | null = null;
    let currentStart = -1;
    let currentEnd = -1;
    let currentFlatItems: FlatSelectItem[] = [];
    let currentTotalOptionCount = 0;
    let scrollBound = false;

    function getFlatOptions(): { flatItems: FlatSelectItem[]; totalCount: number } {
        const visibleOpts = filterOptions(allOptions, filterQuery());
        const flat: FlatSelectItem[] = [];
        let totalCount = 0;

        for (let i = 0; i < visibleOpts.length; i++) {
            const opt = visibleOpts[i];
            if (opt.items && opt.items.length > 0) {
                flat.push({ kind: 'group', opt });
                for (let j = 0; j < opt.items.length; j++) {
                    flat.push({ kind: 'item', opt: opt.items[j], id: `opt_${i}_${j}`, index: totalCount++ });
                }
            } else {
                flat.push({ kind: 'item', opt, id: `opt_${i}`, index: totalCount++ });
            }
        }
        return { flatItems: flat, totalCount };
    }

    // Stable, synthetic key for a flattened group-header entry: patchList only requires that a key be
    // stable across renders (see list-patch.ts), not that it identify an "item" specifically - since
    // getFlatOptions() already produces one ordered array by construction (groups and items
    // interspersed), there's no structural reason to exclude group headers from the keyed patch the way
    // autocomplete.ts's grouped case excludes itself entirely (that exclusion was about a *different*,
    // simpler component whose grouping was bolted on after the fact - not a general rule). Keyed by the
    // group's own label/value rather than its position, since filtering can change a group's index
    // within the flattened array without changing the group itself.
    function keyForFlatItem(entry: FlatSelectItem): string {
        return entry.kind === 'group'
            ? `group:${String(entry.opt.label ?? entry.opt.value)}`
            : String(entry.opt.value);
    }

    function renderFlatItem(entry: FlatSelectItem, viIndex: number, totalCount: number): Raw {
        if (entry.kind === 'group') {
            return html`
                <li class="p-select-option-group">
                    ${entry.opt.flag ? html`<span>${entry.opt.flag}</span>` : ''}
                    <span>${entry.opt.label || entry.opt.value}</span>
                </li>
            `;
        }
        return renderSingleOption(entry.opt, entry.id, entry.index, totalCount);
    }

    function renderSingleOption(opt: SelectOption, id: string, index: number, totalCount: number): Raw {
        const checked = isSelected(opt.value) || isSelected(opt.code);
        const dis = opt.disabled ? 'p-disabled' : '';
        const high = checked ? 'p-highlight' : '';

        const flagHtml = opt.flag ? html`<span style="font-size: 1.125rem; line-height: 1;">${opt.flag}</span>` : '';
        const iconHtml = opt.icon ? html`<span style="font-size: 1.125rem; line-height: 1;">${opt.icon}</span>` : '';
        const avatarHtml = opt.avatar ? html`<div style="position: relative; width: 1.75rem; height: 1.75rem; border-radius: 50%; background: var(--lt-surface-200); color: var(--lt-surface-700); font-weight: 700; font-size: 0.6875rem; display: flex; align-items: center; justify-content: center;">${opt.avatar}${opt.statusClass ? html`<span style="position: absolute; bottom: -1px; right: -1px; width: 8px; height: 8px; border-radius: 50%; border: 1.5px solid var(--lt-surface-0);" class="${opt.statusClass}"></span>` : ''}</div>` : '';
        const badgeHtml = opt.badge !== undefined ? html`<span class="p-select-option-badge">${opt.badge}</span>` : '';
        const descHtml = opt.description ? html`<div style="font-size: 0.75rem; color: var(--p-text-muted);">${opt.description}</div>` : '';

        const checkmarkHtml = (isCheckmark || isMultiple) && checked ? html`<span class="p-select-option-checkmark" data-part="checkmark">${unsafe(getLucideIcon('check', 16))}</span>` : '';
        const checkboxHtml = isCheckbox || isMultiple ? html`
            <div class="p-select-option-checkbox ${checked ? 'is-checked' : ''}" data-part="checkbox">
                ${checked ? unsafe(getLucideIcon('check', 12)) : ''}
            </div>
        ` : '';

        const itemPart = resolvePart('item', `p-select-option ${high} ${dis}`, props.pt, props.studioOverrides);

        // NOTE: this outer `<li>`'s attributes are deliberately kept on a single line (unlike the
        // more readable multi-line form this file used before this retrofit, and unlike the multi-line
        // child content below, which is fine). This item's markup lands inside patchList's own wrapper
        // via `innerHTML =`, and patchList later reads that wrapper's `.innerHTML` back out to compare
        // against a freshly-rendered string (list-patch.ts's `existing.innerHTML !== html` check) - a
        // DOM serializer always collapses whitespace BETWEEN ATTRIBUTES of the same tag to a single
        // space (unlike whitespace BETWEEN tags, which round-trips as text nodes), so a multi-line
        // attribute list here would make the "existing" and "fresh" strings differ on every render even
        // when nothing changed, defeating patchList's unchanged-item skip and recreating every option's
        // DOM node on every re-render. This exact class of bug broke both of this repo's prior
        // patchList retrofits (datatable.ts, autocomplete.ts) - see autocomplete.ts's own identical
        // single-line-outer-tag precedent and comment for the full explanation.
        return html`
            <li class="${itemPart.className}" data-part="item" data-value="${opt.value}" data-index="${index}" role="option" aria-selected="${checked ? 'true' : 'false'}" aria-setsize="${totalCount}" aria-posinset="${index + 1}" id="${id}">
                <div class="p-select-option-content" data-part="itemContent">
                    ${checkboxHtml}
                    ${flagHtml}
                    ${iconHtml}
                    ${avatarHtml}
                    <div>
                        <span class="font-medium">${opt.label || opt.value}</span>
                        ${descHtml}
                    </div>
                </div>
                ${badgeHtml}
                ${checkmarkHtml}
            </li>
        `;
    }

    // Stable references into the shell mountShell() builds exactly once - updateOptionList()/the
    // trigger+actions/select-all-header effects only ever read/write through these, never through
    // `container.innerHTML` again after the initial mount. Assigned inside mountShell().
    let triggerLabelEl: HTMLElement;
    let actionsEl: HTMLElement;
    let filterInputEl: HTMLInputElement | null = null;
    let headerAllEl: HTMLElement | null = null;
    let listEl: HTMLElement;

    /**
     * Targeted update for the option list - replaces the old `renderListItems()` call embedded in the
     * monolithic `render()`, plus every scoped `setHtml(list, renderListItems())` follow-up call that
     * used to live in the filter input's `oninput` and the virtualized scroll handler. Registered as
     * `effect(updateOptionList)` below, so it re-runs automatically whenever `filterQuery`/
     * `selectedValues` change.
     *
     * Non-virtual case (< 100 flat items, including groups): keyed `patchList` reconciliation, reusing
     * a still-visible option's own DOM node instead of tearing down and rebuilding every `<li>` on each
     * keystroke/selection.
     *
     * Virtualized case (>= 100 flat items): kept as a full `setHtml` rebuild here AND in the scroll
     * handler's window-shift update (see `bindStaticEvents`) - same exclusion reasoning as
     * datatable.ts's virtualized rows: a sliding scroll-driven window re-render on every scroll tick
     * doesn't benefit from keyed reuse the same way non-virtual list mutations do, and mixing it with
     * patchList's assumptions is a separate, harder problem not worth taking on in this pass.
     */
    function updateOptionList() {
        const { flatItems, totalCount } = getFlatOptions();
        currentFlatItems = flatItems;
        currentTotalOptionCount = totalCount;

        if (flatItems.length === 0) {
            virtualizer = null;
            setHtml(listEl, html`<div class="p-select-empty-message">${locale.t('emptyFilterMessage') || 'No results found'}</div>`);
            return;
        }

        if (flatItems.length < 100) {
            virtualizer = null;
            // patchList only ever recycles or removes children carrying its own `data-key` attribute
            // (see list-patch.ts) - a leftover child from a different render mode (the empty-results
            // message above, or the virtualized spacer/list wrapper below) carries no such attribute,
            // so it would otherwise be silently stranded in the DOM the first time an update switches
            // back into this path. Clear those out before handing off, matching autocomplete.ts's own
            // identical cleanup for its non-grouped patchList path.
            if (Array.from(listEl.children).some(child => !child.hasAttribute('data-key'))) {
                setHtml(listEl, '');
            }
            patchList(
                listEl,
                flatItems,
                keyForFlatItem,
                (entry) => renderFlatItem(entry, 0, totalCount).value
            );
            return;
        }

        virtualizer = useVirtualizer({
            count: flatItems.length,
            estimateSize: ITEM_HEIGHT,
            getScrollElement: () => listEl,
            virtualThreshold: 100
        });
        const virtualItems = virtualizer.getVirtualItems();
        currentStart = virtualItems.length > 0 ? virtualItems[0].index : 0;
        currentEnd = virtualItems.length > 0 ? virtualItems[virtualItems.length - 1].index : 0;

        setHtml(listEl, html`
            <div class="p-virtual-spacer" data-virtual-spacer>
                <ul class="p-virtual-list">
                    ${virtualItems.map(vi => renderFlatItem(flatItems[vi.index], vi.index, totalCount))}
                </ul>
            </div>
        `);
        updateVirtualPositions();
    }

    function updateVirtualPositions() {
        if (!virtualizer || !virtualizer.isVirtual()) return;
        const spacerEl = listEl.querySelector<HTMLElement>('.p-virtual-spacer');
        const vListEl = listEl.querySelector<HTMLElement>('.p-virtual-list');
        const virtualItems = virtualizer.getVirtualItems();
        const startOffset = virtualItems.length > 0 ? virtualItems[0].start : 0;
        if (spacerEl) spacerEl.style.height = `${virtualizer.getTotalSize()}px`;
        if (vListEl) vListEl.style.transform = `translateY(${startOffset}px)`;
    }

    let floatingHandle: { update: () => void } | null = null;

    function toggleOverlay(open?: boolean) {
        if (isDisabled || isReadonly) return;
        isOpen = open !== undefined ? open : !isOpen;
        const overlay = container.querySelector<HTMLElement>('.p-select-overlay');
        const chevron = container.querySelector('.p-select-dropdown');

        if (isOpen) {
            container.classList.add('is-open');
            overlay?.classList.add('is-visible');
            container.setAttribute('aria-expanded', 'true');
            if (overlay) {
                overlay.style.minWidth = `${container.offsetWidth || 200}px`;
                floatingHandle = useFloatingPosition(container, overlay, {
                    placement: 'bottom-start',
                    reposition: 'follow',
                    signal: ctx?.signal,
                    offset: 4,
                    isRtl: locale.isRtl
                });
            }
            updateVirtualPositions();
            if (hasFilter) {
                const t = setTimeout(() => {
                    container.querySelector<HTMLInputElement>('.p-select-filter-input')?.focus();
                }, 50);
                ctx?.onCleanup?.(() => clearTimeout(t));
            }
        } else {
            container.classList.remove('is-open');
            overlay?.classList.remove('is-visible');
            container.setAttribute('aria-expanded', 'false');
            filterQuery.set('');
            floatingHandle = null;
        }
    }

    /**
     * One-time setup (point 2 of the restructuring notes): the full shell - trigger/actions wrappers,
     * filter bar, select-all header wrapper, and the list `<ul>` - is built exactly once via a single
     * `setHtml(container, ...)`, with stable element references captured for every effect/handler below
     * to read and write through from then on. Every "bind everything" listener that used to live in the
     * old `bindEvents()`/`bindOptionClicks()` (re-run on every single `render()` call) is now attached
     * exactly once here too - see `bindStaticEvents()`.
     */
    function mountShell() {
        const rootClasses = [
            'laughtale-select',
            'p-select',
            isFluid ? 'p-select-fluid' : '',
            isFilled ? 'variant-filled' : '',
            size !== 'normal' ? `size-${size}` : '',
            isInvalid ? 'is-invalid' : '',
            isDisabled ? 'is-disabled' : '',
            isOpen ? 'is-open' : ''
        ].filter(Boolean).join(' ');

        applyPart(container, 'root', rootClasses, props.pt, props.studioOverrides);
        container.setAttribute('tabindex', isDisabled ? '-1' : '0');
        container.setAttribute('role', 'combobox');
        container.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        container.setAttribute('aria-haspopup', 'listbox');
        container.setAttribute('aria-controls', 'p-select-overlay');

        const triggerPart = resolvePart('trigger', 'p-select-trigger-wrap', props.pt, props.studioOverrides);
        const panelPart = resolvePart('panel', `p-select-overlay ${isOpen ? 'is-visible' : ''}`, props.pt, props.studioOverrides);
        const listPart = resolvePart('list', 'p-select-list', props.pt, props.studioOverrides);

        formField.detach();
        setHtml(container, html`
            <div class="${triggerPart.className}" style="${triggerPart.style}" data-part="trigger"></div>
            <div class="p-select-actions" data-part="actions"></div>
            <div class="${panelPart.className}" style="${panelPart.style}" data-part="panel">
                ${hasFilter ? html`
                    <div class="p-select-filter-container" data-part="filterContainer">
                        <span class="p-select-filter-icon">${unsafe(getLucideIcon('search', 14))}</span>
                        <input type="text" class="p-select-filter-input" data-part="filterInput" placeholder="${props.filterPlaceholder || 'Search...'}" />
                    </div>
                ` : ''}
                ${isMultiple && isCheckbox ? html`
                    <div class="p-select-header-all" data-part="headerAll"></div>
                ` : ''}
                <ul class="${listPart.className}" style="max-height: ${scrollHeight}; ${listPart.style}" data-part="list" role="listbox"></ul>
            </div>
        `);
        formField.reattach();

        triggerLabelEl = container.querySelector<HTMLElement>('[data-part="trigger"]')!;
        actionsEl = container.querySelector<HTMLElement>('[data-part="actions"]')!;
        filterInputEl = container.querySelector<HTMLInputElement>('.p-select-filter-input');
        headerAllEl = container.querySelector<HTMLElement>('.p-select-header-all');
        listEl = container.querySelector<HTMLElement>('.p-select-list')!;

        bindStaticEvents();
    }

    /**
     * Every listener that used to be rebound on every `render()`/`bindOptionClicks()` call is attached
     * exactly once here instead, since `mountShell()` (unlike the old `render()`) never touches
     * `container.innerHTML` again after this runs. This is also what makes the old outside-click
     * accumulation bug (a fresh outside-click subscription added on every `render()` call, on top of a
     * second, functionally-identical one registered separately at module scope) go away as a
     * natural side effect: there is now exactly one such listener, registered exactly once, for the
     * lifetime of this component instance.
     */
    function bindStaticEvents() {
        // Trigger click / clear-icon click / chip-remove click, delegated on the (stable, never
        // replaced) container element.
        container.addEventListener('click', (e) => {
            const target = e.target as HTMLElement;
            if (target.closest('.p-select-overlay')) return;
            if (target.closest('.p-select-clear-icon')) {
                e.stopPropagation();
                selectedValues.set([]);
                syncValue();
                return;
            }
            if (target.closest('.p-select-chip-remove')) {
                e.stopPropagation();
                const removeBtn = target.closest('.p-select-chip-remove') as HTMLElement;
                const remVal = removeBtn.getAttribute('data-remove');
                selectedValues.set(selectedValues().filter(v => String(v) !== String(remVal)));
                syncValue();
                return;
            }
            toggleOverlay();
        }, { signal: ctx?.signal });

        // Filter input: `oninput` no longer does a scoped re-render itself - it only debounces a write
        // to the `filterQuery` signal (closing a real, independent gap: unlike autocomplete.ts, this
        // component had no debounce at all before this retrofit), and the `updateOptionList` effect
        // below re-runs on its own once that signal changes.
        if (filterInputEl) {
            const debouncedSetFilterQuery = useDebounce((value: string) => {
                filterQuery.set(value);
            }, 150);

            filterInputEl.addEventListener('input', () => {
                debouncedSetFilterQuery(filterInputEl!.value);
            }, { signal: ctx?.signal });
            filterInputEl.addEventListener('click', (e) => e.stopPropagation(), { signal: ctx?.signal });
            filterInputEl.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    toggleOverlay(false);
                }
            }, { signal: ctx?.signal });
        }

        // No bindOptionClicks() call inside the scroll handler below anymore - the delegated `listEl`
        // click listener (registered further down in this function) is bound to a stable ancestor of
        // `.p-virtual-list` and its children, so it keeps receiving bubbled clicks regardless of which
        // code path (patchList or this scroll handler's own setHtml) created a given descendant `<li>`.
        // NOTE: this comment is deliberately placed BEFORE the call rather than inline inside its
        // callback body - scripts/verify-contracts.mjs's signal-listener check does a naive
        // paren-balance scan of the whole call expression without stripping comments first, so a
        // contraction apostrophe (e.g. "handlers" written with one) inside an inline comment there
        // gets misread as an unterminated string and throws off the scan.
        if (listEl && !scrollBound) {
            scrollBound = true;
            listEl.addEventListener('scroll', () => {
                if (!virtualizer || !virtualizer.isVirtual()) return;
                const newVirtualItems = virtualizer.getVirtualItems();
                if (newVirtualItems.length === 0) return;
                const newStart = newVirtualItems[0].index;
                const newEnd = newVirtualItems[newVirtualItems.length - 1].index;
                if (newStart === currentStart && newEnd === currentEnd) return;
                currentStart = newStart;
                currentEnd = newEnd;
                const newStartOffset = newVirtualItems[0].start;
                const vList = listEl.querySelector<HTMLElement>('.p-virtual-list');
                if (vList) {
                    vList.style.transform = `translateY(${newStartOffset}px)`;
                    const newNodes = newVirtualItems.map(vi => renderFlatItem(currentFlatItems[vi.index], vi.index, currentTotalOptionCount));
                    setHtml(vList, html`${newNodes}`);
                }
            }, { signal: ctx?.signal, passive: true });
        }

        if (headerAllEl) {
            headerAllEl.addEventListener('click', (e: MouseEvent) => {
                e.stopPropagation();
                if (selectedValues().length === flatOptions.length) {
                    selectedValues.set([]);
                } else {
                    selectedValues.set(flatOptions.map(o => o.value));
                }
                syncValue();
            }, { signal: ctx?.signal });
        }

        // Delegated option click handling, replacing the old bindOptionClicks()'s per-`<li>` rebind -
        // attached once to `listEl`, a stable ancestor of every option `<li>` regardless of whether it
        // was rendered via patchList (non-virtual) or the virtualized `.p-virtual-list` full rebuild.
        listEl.addEventListener('click', (e) => {
            const target = e.target as HTMLElement;
            const optionEl = target.closest('.p-select-option:not(.p-disabled)') as HTMLElement | null;
            if (!optionEl) return;
            e.stopPropagation();
            const val = optionEl.getAttribute('data-value');
            if (val === null) return;

            if (isMultiple) {
                if (isSelected(val)) {
                    selectedValues.set(selectedValues().filter(v => String(v) !== String(val)));
                } else {
                    selectedValues.set([...selectedValues(), val]);
                }
            } else {
                selectedValues.set([val]);
                toggleOverlay(false);
            }
            syncValue();
        }, { signal: ctx?.signal });

        // Keyboard navigation on container
        container.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
                if (!isOpen) {
                    e.preventDefault();
                    toggleOverlay(true);
                }
            } else if (e.key === 'Escape') {
                if (isOpen) {
                    e.preventDefault();
                    toggleOverlay(false);
                }
            }
        }, { signal: ctx?.signal });

        // Click outside - exactly one listener for the lifetime of this component instance (see this
        // function's own doc comment above for why that matters).
        if (typeof document !== 'undefined') {
            document.addEventListener('click', (e) => {
                if (!container.contains(e.target as Node)) {
                    if (isOpen) toggleOverlay(false);
                }
            }, { signal: ctx?.signal });
        }
    }

    function syncValue() {
        const payload = isMultiple ? selectedValues() : (selectedValues()[0] ?? null);
        formField.setValue(selectedValues());

        emitComponentEvent(container, 'select', 'change', {
            value: payload,
            selectedItems: getSelectedItems()
        });
    }

    mountShell();

    // Reactive rendering: these effects replace every manual render() call that used to follow a
    // selectedValues/filterQuery mutation - each now re-runs automatically whenever the signal(s) it
    // reads change. syncValue() stays an explicit one-shot call at each mutation site (it emits a
    // change event / writes the hidden form field - a side effect, not a render), so it is
    // intentionally NOT wrapped here, matching multiselect.ts's/autocomplete.ts's precedent.
    effect(() => {
        setHtml(triggerLabelEl, renderTriggerLabel());
        setHtml(actionsEl, renderActionsHtml());
    });
    if (headerAllEl) {
        const headerAllElStable = headerAllEl;
        effect(() => {
            setHtml(headerAllElStable, renderHeaderAllHtml());
        });
    }
    effect(updateOptionList);

    formField.setValue(selectedValues());
}
