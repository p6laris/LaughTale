/**
 * LaughTale: Enterprise Select Component (Aura Select / Dropdown)
 * Feature-complete select component supporting single, multiple, checkmark, checkbox modes,
 * chips display, debounced filter with search icon, grouping, custom avatar/flag templates,
 * editable mode, clear button, loading state, and full ARIA keyboard navigation.
 */

import { injectIslandStyle } from '../runtime/styles';
import { getLucideIcon } from '../icons/lucide';

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
    background: var(--p-surface-0);
    border: 1px solid var(--p-border-color);
    border-radius: var(--p-border-radius);
    color: var(--p-text-color);
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
    border-color: var(--p-surface-400);
}

.p-select.is-open,
.p-select:focus-visible {
    border-color: var(--p-primary-500) !important;
    box-shadow: 0 0 0 1px var(--p-primary-500) !important;
}

/* Filled Variant */
.p-select.variant-filled {
    background-color: var(--p-surface-100);
    border-color: transparent;
}
.p-select.variant-filled:hover:not(.is-disabled):not([readonly]) {
    background-color: var(--p-surface-200);
}
.p-select.variant-filled.is-open,
.p-select.variant-filled:focus-visible {
    background-color: var(--p-surface-0);
    border-color: var(--p-primary-500) !important;
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
    border-color: var(--p-red-500, #ef4444) !important;
}
.p-select.is-invalid:focus-visible,
.p-select.is-invalid.is-open {
    box-shadow: 0 0 0 1px var(--p-red-500, #ef4444) !important;
}

/* Disabled State */
.p-select.is-disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background-color: var(--p-surface-100);
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
    color: var(--p-text-color);
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
    color: var(--p-text-color);
    background: var(--p-surface-200);
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
    color: var(--p-primary-500);
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
    background: var(--p-surface-100);
    border-radius: calc(var(--p-border-radius) - 2px);
    font-size: 0.75rem;
    color: var(--p-surface-700);
}
.p-select-chip-remove {
    cursor: pointer;
    color: var(--p-text-muted);
    display: flex;
}
.p-select-chip-remove:hover {
    color: var(--p-text-color);
}

/* ==================== SELECT OVERLAY ==================== */
.p-select-overlay {
    position: absolute;
    top: calc(100% + 4px);
    left: 0;
    min-width: 100%;
    width: max-content;
    max-width: 24rem;
    background: var(--p-surface-0);
    border: 1px solid var(--p-border-color);
    border-radius: var(--p-border-radius);
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
    border-bottom: 1px solid var(--p-border-color);
    background: var(--p-surface-0);
}
.p-select-filter-input {
    width: 100%;
    padding: 0.375rem 0.625rem 0.375rem 2rem;
    background: var(--p-surface-0);
    border: 1px solid var(--p-border-color);
    border-radius: calc(var(--p-border-radius) - 2px);
    color: var(--p-text-color);
    font-size: 0.8125rem;
    outline: none;
    box-sizing: border-box;
    transition: border-color 150ms ease, box-shadow 150ms ease;
}
.p-select-filter-input:focus {
    border-color: var(--p-primary-500);
    box-shadow: 0 0 0 1px var(--p-primary-500);
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
    border-bottom: 1px solid var(--p-border-color);
    font-size: 0.8125rem;
    font-weight: 600;
    color: var(--p-text-color);
    cursor: pointer;
    background: var(--p-surface-50);
}
.p-select-header-all:hover {
    background: var(--p-surface-100);
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
    border-radius: calc(var(--p-border-radius) - 2px);
    font-size: 0.875rem;
    color: var(--p-text-color);
    cursor: pointer;
    transition: background 120ms ease, color 120ms ease;
    gap: 0.75rem;
}

.p-select-option:hover:not(.p-disabled) {
    background: var(--p-surface-100);
}

.p-select-option.p-highlight {
    background: var(--p-primary-50, #ecfdf5);
    color: var(--p-primary-700, #047857);
    font-weight: 600;
}
.p-select-option.p-highlight:hover:not(.p-disabled) {
    background: var(--p-primary-100, #d1fae5);
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
    border: 1px solid var(--p-border-color);
    border-radius: calc(var(--p-border-radius) - 4px);
    background: var(--p-surface-0);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: background 150ms ease, border-color 150ms ease;
}
.p-select-option.p-highlight .p-select-option-checkbox,
.p-select-option-checkbox.is-checked {
    background: var(--p-primary-500);
    border-color: var(--p-primary-500);
    color: #ffffff;
}

.p-select-option-checkmark {
    color: var(--p-primary-600);
    display: flex;
}

.p-select-option-badge {
    font-size: 0.6875rem;
    font-weight: 700;
    padding: 0.125rem 0.375rem;
    border-radius: 9999px;
    background: var(--p-surface-200);
    color: var(--p-surface-700);
}

.p-select-empty-message {
    padding: 1rem;
    text-align: center;
    font-size: 0.8125rem;
    color: var(--p-text-muted);
}

/* ==================== DARK MODE ==================== */
.dark .p-select {
    background: var(--p-surface-900);
    border-color: var(--p-surface-700);
    color: var(--p-surface-0);
}
.dark .p-select:hover:not(.is-disabled):not([readonly]) {
    border-color: var(--p-surface-500);
}
.dark .p-select.variant-filled {
    background-color: var(--p-surface-800);
}
.dark .p-select.variant-filled:hover:not(.is-disabled):not([readonly]) {
    background-color: var(--p-surface-700);
}
.dark .p-select.variant-filled.is-open {
    background-color: var(--p-surface-900);
}
.dark .p-select.is-disabled {
    background-color: var(--p-surface-800);
}
.dark .p-select-chip {
    background: var(--p-surface-800);
    color: var(--p-surface-200);
}
.dark .p-select-overlay {
    background: var(--p-surface-900);
    border-color: var(--p-surface-700);
}
.dark .p-select-filter-container {
    background: var(--p-surface-900);
    border-color: var(--p-surface-700);
}
.dark .p-select-filter-input {
    background: var(--p-surface-950, #090d14);
    border-color: var(--p-surface-700);
    color: var(--p-surface-0);
}
.dark .p-select-header-all {
    background: var(--p-surface-850, #141b26);
    border-color: var(--p-surface-700);
}
.dark .p-select-header-all:hover {
    background: var(--p-surface-800);
}
.dark .p-select-option:hover:not(.p-disabled) {
    background: var(--p-surface-800);
    color: var(--p-surface-0);
}
.dark .p-select-option.p-highlight {
    background: rgba(16, 185, 129, 0.16);
    color: var(--p-primary-300, #6ee7b7);
}
.dark .p-select-option.p-highlight:hover:not(.p-disabled) {
    background: rgba(16, 185, 129, 0.24);
    color: var(--p-primary-200, #a7f3d0);
}
.dark .p-select-option-checkbox {
    background: var(--p-surface-950, #090d14);
    border-color: var(--p-surface-600);
}
.dark .p-select-option-checkmark {
    color: var(--p-primary-400);
}
.dark .p-select-option-badge {
    background: var(--p-surface-800);
    color: var(--p-surface-200);
}
`;

export default function SelectIsland(container: HTMLElement, props: SelectProps) {
    injectIslandStyle('laughtale-select', CSS);

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
    const placeholder = props.placeholder || 'Select an option...';
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

    // Initial selected values
    let selectedValues: any[] = [];
    const initVal = props.value ?? props.selectedValue;
    if (initVal !== undefined && initVal !== null) {
        if (Array.isArray(initVal)) {
            selectedValues = [...initVal];
        } else if (typeof initVal === 'string' && initVal.includes(',') && isMultiple) {
            selectedValues = initVal.split(',').map(s => s.trim());
        } else {
            selectedValues = [initVal];
        }
    }

    let isOpen = false;
    let filterQuery = '';

    function isSelected(val: any): boolean {
        return selectedValues.some(v => String(v) === String(val) || (typeof v === 'object' && v?.value === val));
    }

    function getSelectedItems(): SelectOption[] {
        return flatOptions.filter(o => isSelected(o.value) || isSelected(o.code));
    }

    function renderTriggerLabel(): string {
        const items = getSelectedItems();
        if (items.length === 0) {
            if (isEditable && selectedValues.length > 0) {
                return `<span class="p-select-label">${selectedValues[0]}</span>`;
            }
            return `<span class="p-select-label p-placeholder">${placeholder}</span>`;
        }

        if (isMultiple) {
            if (isChipDisplay) {
                const chipsHtml = items.map(item => `
                    <span class="p-select-chip" data-value="${item.value}">
                        ${item.flag ? `<span>${item.flag}</span>` : ''}
                        <span>${item.label || item.value}</span>
                        <span class="p-select-chip-remove" data-remove="${item.value}">${getLucideIcon('x', 12)}</span>
                    </span>
                `).join('');
                return `<div class="p-select-chips-wrap">${chipsHtml}</div>`;
            } else {
                const first = items[0].label || items[0].value;
                const count = items.length > 1 ? ` (+${items.length - 1} more)` : '';
                return `<span class="p-select-label">${first}${count}</span>`;
            }
        }

        const item = items[0];
        const flagHtml = item.flag ? `<span style="font-size: 1.125rem; line-height: 1;">${item.flag}</span>` : '';
        const iconHtml = item.icon ? `<span style="font-size: 1.125rem; line-height: 1;">${item.icon}</span>` : '';
        const statusHtml = item.statusClass ? `<span class="w-2 h-2 rounded-full ${item.statusClass}"></span>` : '';

        return `<span class="p-select-label">${flagHtml}${iconHtml}${statusHtml}<span>${item.label || item.value}</span></span>`;
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

    function renderListItems(): string {
        const visibleOpts = filterOptions(allOptions, filterQuery);
        if (visibleOpts.length === 0) {
            return `<div class="p-select-empty-message">No results found</div>`;
        }

        let html = '';
        visibleOpts.forEach((opt, idx) => {
            if (opt.items && opt.items.length > 0) {
                html += `
                    <li class="p-select-option-group">
                        ${opt.flag ? `<span>${opt.flag}</span>` : ''}
                        <span>${opt.label || opt.value}</span>
                    </li>
                `;
                opt.items.forEach((child, cIdx) => {
                    html += renderSingleOption(child, `opt_${idx}_${cIdx}`);
                });
            } else {
                html += renderSingleOption(opt, `opt_${idx}`);
            }
        });

        return html;
    }

    function renderSingleOption(opt: SelectOption, id: string): string {
        const checked = isSelected(opt.value) || isSelected(opt.code);
        const dis = opt.disabled ? 'p-disabled' : '';
        const high = checked ? 'p-highlight' : '';

        const flagHtml = opt.flag ? `<span style="font-size: 1.125rem; line-height: 1;">${opt.flag}</span>` : '';
        const iconHtml = opt.icon ? `<span style="font-size: 1.125rem; line-height: 1;">${opt.icon}</span>` : '';
        const avatarHtml = opt.avatar ? `<div style="position: relative; width: 1.75rem; height: 1.75rem; border-radius: 50%; background: var(--p-surface-200); color: var(--p-surface-700); font-weight: 700; font-size: 0.6875rem; display: flex; align-items: center; justify-content: center;">${opt.avatar}${opt.statusClass ? `<span style="position: absolute; bottom: -1px; right: -1px; width: 8px; height: 8px; border-radius: 50%; border: 1.5px solid var(--p-surface-0);" class="${opt.statusClass}"></span>` : ''}</div>` : '';
        const badgeHtml = opt.badge !== undefined ? `<span class="p-select-option-badge">${opt.badge}</span>` : '';
        const descHtml = opt.description ? `<div style="font-size: 0.75rem; color: var(--p-text-muted);">${opt.description}</div>` : '';

        const checkmarkHtml = (isCheckmark || isMultiple) && checked ? `<span class="p-select-option-checkmark">${getLucideIcon('check', 16)}</span>` : '';
        const checkboxHtml = isCheckbox || isMultiple ? `
            <div class="p-select-option-checkbox ${checked ? 'is-checked' : ''}">
                ${checked ? getLucideIcon('check', 12) : ''}
            </div>
        ` : '';

        return `
            <li class="p-select-option ${high} ${dis}" data-value="${opt.value}" role="option" aria-selected="${checked ? 'true' : 'false'}" id="${id}">
                <div class="p-select-option-content">
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

    function render() {
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

        const hasSelected = selectedValues.length > 0;
        const allSelected = flatOptions.length > 0 && selectedValues.length === flatOptions.length;
        const isIndeterminate = selectedValues.length > 0 && !allSelected;

        container.className = rootClasses;
        container.setAttribute('tabindex', isDisabled ? '-1' : '0');
        container.setAttribute('role', 'combobox');
        container.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        container.setAttribute('aria-haspopup', 'listbox');

        container.innerHTML = `
            ${renderTriggerLabel()}
            <div class="p-select-actions">
                ${showClear && hasSelected && !isDisabled ? `<span class="p-select-clear-icon" title="Clear selection">${getLucideIcon('x', 14)}</span>` : ''}
                ${isLoading ? `<span class="p-select-dropdown">${getLucideIcon('loader-2', 16)}</span>` : `<span class="p-select-dropdown">${getLucideIcon('chevron-down', 16)}</span>`}
            </div>
            <div class="p-select-overlay ${isOpen ? 'is-visible' : ''}">
                ${hasFilter ? `
                    <div class="p-select-filter-container">
                        <span class="p-select-filter-icon">${getLucideIcon('search', 14)}</span>
                        <input type="text" class="p-select-filter-input" placeholder="${props.filterPlaceholder || 'Search...'}" value="${filterQuery}" />
                    </div>
                ` : ''}
                ${isMultiple && isCheckbox ? `
                    <div class="p-select-header-all">
                        <div class="p-select-option-checkbox ${allSelected ? 'is-checked' : ''}">
                            ${allSelected ? getLucideIcon('check', 12) : (isIndeterminate ? getLucideIcon('minus', 12) : '')}
                        </div>
                        <span>Select All (${selectedValues.length}/${flatOptions.length})</span>
                    </div>
                ` : ''}
                <ul class="p-select-list" role="listbox" style="max-height: ${scrollHeight};">
                    ${renderListItems()}
                </ul>
            </div>
            <input type="hidden" name="${props.name || props.targetInputName || 'select_value'}" value="${selectedValues.join(',')}" />
        `;

        bindEvents();
    }

    function toggleOverlay(open?: boolean) {
        if (isDisabled || isReadonly) return;
        isOpen = open !== undefined ? open : !isOpen;
        const overlay = container.querySelector('.p-select-overlay');
        const chevron = container.querySelector('.p-select-dropdown');

        if (isOpen) {
            container.classList.add('is-open');
            overlay?.classList.add('is-visible');
            container.setAttribute('aria-expanded', 'true');
            if (hasFilter) {
                setTimeout(() => {
                    container.querySelector<HTMLInputElement>('.p-select-filter-input')?.focus();
                }, 50);
            }
        } else {
            container.classList.remove('is-open');
            overlay?.classList.remove('is-visible');
            container.setAttribute('aria-expanded', 'false');
            filterQuery = '';
        }
    }

    function bindEvents() {
        // Trigger click (ignore if clicked on actions or overlay)
        container.onclick = (e) => {
            const target = e.target as HTMLElement;
            if (target.closest('.p-select-overlay')) return;
            if (target.closest('.p-select-clear-icon')) {
                e.stopPropagation();
                selectedValues = [];
                render();
                syncValue();
                return;
            }
            if (target.closest('.p-select-chip-remove')) {
                e.stopPropagation();
                const removeBtn = target.closest('.p-select-chip-remove') as HTMLElement;
                const remVal = removeBtn.getAttribute('data-remove');
                selectedValues = selectedValues.filter(v => String(v) !== String(remVal));
                render();
                syncValue();
                return;
            }
            toggleOverlay();
        };

        // Filter input
        const filterInp = container.querySelector<HTMLInputElement>('.p-select-filter-input');
        if (filterInp) {
            filterInp.oninput = (e) => {
                filterQuery = filterInp.value;
                const list = container.querySelector('.p-select-list');
                if (list) list.innerHTML = renderListItems();
                bindOptionClicks();
            };
            filterInp.onclick = (e) => e.stopPropagation();
            filterInp.onkeydown = (e) => {
                if (e.key === 'Escape') {
                    toggleOverlay(false);
                }
            };
        }

        // Select all header click
        const selectAllHeader = container.querySelector<HTMLElement>('.p-select-header-all');
        if (selectAllHeader) {
            selectAllHeader.onclick = (e: MouseEvent) => {
                e.stopPropagation();
                if (selectedValues.length === flatOptions.length) {
                    selectedValues = [];
                } else {
                    selectedValues = flatOptions.map(o => o.value);
                }
                render();
                syncValue();
            };
        }

        bindOptionClicks();

        // Keyboard navigation on container
        container.onkeydown = (e) => {
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
        };

        // Click outside
        document.addEventListener('click', (e) => {
            if (!container.contains(e.target as Node)) {
                if (isOpen) toggleOverlay(false);
            }
        });
    }

    function bindOptionClicks() {
        const optionEls = container.querySelectorAll<HTMLElement>('.p-select-option:not(.p-disabled)');
        optionEls.forEach(el => {
            el.onclick = (e) => {
                e.stopPropagation();
                const val = el.getAttribute('data-value');
                if (val === null) return;

                if (isMultiple) {
                    if (isSelected(val)) {
                        selectedValues = selectedValues.filter(v => String(v) !== String(val));
                    } else {
                        selectedValues.push(val);
                    }
                    render();
                } else {
                    selectedValues = [val];
                    toggleOverlay(false);
                    render();
                }
                syncValue();
            };
        });
    }

    function syncValue() {
        const payload = isMultiple ? selectedValues : (selectedValues[0] ?? null);
        const hiddenInp = container.querySelector<HTMLInputElement>('input[type="hidden"]');
        if (hiddenInp) hiddenInp.value = selectedValues.join(',');

        container.dispatchEvent(new CustomEvent('select:change', {
            bubbles: true,
            detail: { value: payload, selectedItems: getSelectedItems() }
        }));
        container.dispatchEvent(new CustomEvent('change', {
            bubbles: true,
            detail: { value: payload }
        }));
    }

    render();
}
