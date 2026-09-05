import { resolvePart, applyPart, type PassthroughRecord } from '../runtime/parts';
import type { IslandContext } from '../runtime/registry';
﻿/**
 * LaughTale: Enterprise Listbox Component (Aura Listbox)
 * High-performance list selection component with single, multiple, meta-key,
 * checkbox, checkmark-only, option grouping, custom item templating, instant search,
 * and complete ARIA listbox keyboard accessibility.
 */

import { LucideIcons, getLucideIcon } from '../icons/lucide';
import { injectIslandStyle } from '../runtime/styles';
import { emitComponentEvent } from '../runtime/events';
import { useDebounce } from '../composables/useDebounce';
import { useVirtualizer, type Virtualizer } from '../composables/useVirtualizer';
import { setRovingTabindex } from '../accessibility/aria';
import { html, setHtml, url as safeUrl, unsafe, attr, type Raw } from '../runtime/html';
import { useFormField } from '../composables/useFormField';
import type { PatternDeclaration } from '../accessibility/patterns';

export const a11y: PatternDeclaration = {
    kind: 'pattern',
    pattern: 'listbox'
};

export interface ListboxOptionItem {
    label: string;
    value: any;
    name?: string;
    code?: string;
    icon?: string;
    flag?: string;
    badge?: string;
    description?: string;
    disabled?: boolean;
    items?: ListboxOptionItem[];
}

export interface ListboxProps {
    options?: (ListboxOptionItem | string)[];
    value?: any;
    selectedValue?: any;
    multiple?: boolean;
    metaKeySelection?: boolean;
    checkbox?: boolean;
    checkmark?: boolean;
    highlightOnSelect?: boolean;
    filter?: boolean;
    filterPlaceholder?: string;
    filterMatchMode?: 'contains' | 'startsWith';
    optionLabel?: string;
    optionValue?: string;
    optionDisabled?: string;
    optionGroupLabel?: string;
    optionGroupChildren?: string;
    scrollHeight?: string;
    striped?: boolean;
    variant?: 'outlined' | 'filled';
    size?: 'small' | 'normal' | 'large';
    fluid?: boolean;
    disabled?: boolean;
    invalid?: boolean;
    inputId?: string;
    name?: string;
    targetInputName?: string;
    header?: string;
    headerCount?: string;
    footer?: string;
    autoOptionFocus?: boolean;
    selectOnFocus?: boolean;
    focusOnHover?: boolean;
    pt?: PassthroughRecord;
    studioOverrides?: Record<string, any>;
}

const CSS = `
/* ==================== AURA LISTBOX ==================== */
.laughtale-listbox,
.p-listbox {
    display: inline-flex;
    flex-direction: column;
    background: var(--lt-surface-0);
    color: var(--lt-text-primary);
    border: 1px solid var(--lt-surface-200);
    border-radius: var(--lt-radius);
    font-family: var(--p-font-family, inherit);
    box-sizing: border-box;
    overflow: hidden;
    outline: none;
    transition: background 150ms ease, border-color 150ms ease, box-shadow 150ms ease;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.02);
    width: 100%;
    max-width: 280px;
}

.p-listbox.p-listbox-fluid {
    width: 100%;
    max-width: 100%;
}

.p-listbox.is-focused,
.p-listbox:focus-within {
    border-color: var(--lt-primary-500) !important;
}

/* Filled Variant */
.p-listbox.variant-filled {
    background-color: var(--lt-surface-100);
    border-color: transparent;
}
.p-listbox.variant-filled.is-focused {
    background-color: var(--lt-surface-0);
    border-color: var(--lt-primary-500) !important;
}

/* Sizes */
.p-listbox.size-small,
.p-listbox.p-listbox-sm {
    font-size: 0.75rem;
}
.p-listbox.size-small .p-listbox-option {
    padding: 0.3125rem 0.5rem;
}
.p-listbox.size-large,
.p-listbox.p-listbox-lg {
    font-size: 1rem;
}
.p-listbox.size-large .p-listbox-option {
    padding: 0.625rem 1rem;
}

/* Invalid State */
.p-listbox.is-invalid {
    border-color: var(--p-red-500, var(--lt-danger-500)) !important;
}

/* Disabled State */
.p-listbox.is-disabled {
    opacity: 0.65;
    cursor: not-allowed;
    background-color: var(--lt-surface-100);
}
.p-listbox.is-disabled .p-listbox-option {
    cursor: not-allowed;
    pointer-events: none;
}

/* Header & Footer */
.p-listbox-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.625rem 0.875rem;
    background: var(--lt-surface-50);
    border-bottom: 1px solid var(--lt-surface-200);
    font-size: 0.8125rem;
    font-weight: 700;
    color: var(--lt-text-primary);
}
.p-listbox-header-count {
    font-size: 0.75rem;
    font-weight: 500;
    color: var(--p-text-muted);
}
.p-listbox-footer {
    padding: 0.5rem 0.875rem;
    background: var(--lt-surface-50);
    border-top: 1px solid var(--lt-surface-200);
    font-size: 0.75rem;
    color: var(--p-text-muted);
}

/* Filter */
.p-listbox-filter-container {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 0.75rem;
    background: var(--lt-surface-50);
    border-bottom: 1px solid var(--lt-surface-200);
}
.p-listbox-filter-input {
    flex: 1;
    width: 100%;
    font-family: inherit;
    font-size: 0.8125rem;
    padding: 0.3125rem 0.5rem;
    background: var(--lt-surface-0);
    border: 1px solid var(--lt-surface-200);
    border-radius: calc(var(--lt-radius) - 2px);
    color: var(--lt-text-primary);
    outline: none;
    box-sizing: border-box;
}
.p-listbox-filter-input:focus {
    border-color: var(--lt-primary-500);
}

/* Options List Container */
.p-listbox-list-wrapper {
    overflow-y: auto;
    outline: none;
}
.p-listbox-list {
    margin: 0;
    padding: 0.25rem 0;
    list-style: none;
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
}

/* Option Groups */
.p-listbox-option-group {
    list-style: none;
    margin: 0;
    padding: 0;
}
.p-listbox-option-group-label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 0.875rem;
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--p-text-muted);
    background: var(--lt-surface-50);
}

/* Option Items */
.p-listbox-option {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.5rem 0.875rem;
    cursor: pointer;
    font-size: 0.8125rem;
    color: var(--lt-text-primary);
    background: transparent;
    transition: background 150ms ease, color 150ms ease;
    user-select: none;
    outline: none;
}

.p-listbox-option:hover:not(.p-disabled) {
    background: var(--lt-surface-100);
    color: var(--lt-text-primary);
}

.p-listbox-option.p-highlight {
    background: var(--lt-primary-50);
    color: var(--lt-primary-700);
    font-weight: 600;
}
.p-listbox-option.p-highlight:hover:not(.p-disabled) {
    background: var(--lt-primary-100);
    color: var(--lt-primary-800);
}

.p-listbox-option.p-highlight-none {
    background: transparent !important;
    color: var(--lt-text-primary) !important;
    font-weight: normal !important;
}
.p-listbox-option.p-highlight-none:hover:not(.p-disabled) {
    background: var(--lt-surface-100) !important;
}

.p-listbox-option.p-focus {
    box-shadow: inset 0 0 0 1px var(--lt-primary-500);
}

.p-listbox-option.p-disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

/* Striped Listbox */
.p-listbox-striped .p-listbox-option:nth-child(even):not(.p-highlight) {
    background: var(--lt-surface-50);
}

/* Option Content */
.p-listbox-option-content {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.p-listbox-option-badge {
    font-size: 0.6875rem;
    font-weight: 700;
    padding: 0.125rem 0.375rem;
    border-radius: calc(var(--lt-radius) - 2px);
    background: var(--lt-surface-100);
    color: var(--lt-surface-700);
}
.p-listbox-option.p-highlight .p-listbox-option-badge {
    background: var(--lt-primary-100);
    color: var(--lt-primary-800);
}

/* Option Checkbox */
.p-listbox-option-checkbox {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 1.125rem;
    height: 1.125rem;
    border: 1px solid var(--lt-surface-200);
    border-radius: 4px;
    background: var(--lt-surface-0);
    margin-right: 0.5rem;
    transition: all 150ms ease;
    flex-shrink: 0;
}
.p-listbox-option.p-highlight .p-listbox-option-checkbox {
    background: var(--lt-primary-500);
    border-color: var(--lt-primary-500);
    color: var(--lt-surface-0, var(--lt-surface-0));
}

/* Option Checkmark Icon */
.p-listbox-option-checkmark {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: var(--lt-primary-600);
    margin-left: 0.5rem;
    flex-shrink: 0;
}
/* ==================== DARK MODE ==================== */
html.dark .p-listbox,
[data-theme="dark"] .p-listbox,
.dark .p-listbox {
    background: var(--p-surface-0);
    color: var(--p-text-color);
    border-color: var(--p-border-color);
}
html.dark .p-listbox.variant-filled,
[data-theme="dark"] .p-listbox.variant-filled,
.dark .p-listbox.variant-filled {
    background-color: var(--p-surface-100);
}
html.dark .p-listbox.variant-filled.is-focused,
[data-theme="dark"] .p-listbox.variant-filled.is-focused,
.dark .p-listbox.variant-filled.is-focused {
    background-color: var(--p-surface-0);
}
html.dark .p-listbox-header,
html.dark .p-listbox-footer,
html.dark .p-listbox-filter-container,
html.dark .p-listbox-option-group-label,
[data-theme="dark"] .p-listbox-header,
[data-theme="dark"] .p-listbox-footer,
[data-theme="dark"] .p-listbox-filter-container,
[data-theme="dark"] .p-listbox-option-group-label,
.dark .p-listbox-header,
.dark .p-listbox-footer,
.dark .p-listbox-filter-container,
.dark .p-listbox-option-group-label {
    background: var(--p-surface-50);
    border-color: var(--p-border-color);
}
html.dark .p-listbox-filter-input,
[data-theme="dark"] .p-listbox-filter-input,
.dark .p-listbox-filter-input {
    background: var(--p-surface-0);
    border-color: var(--p-border-color);
    color: var(--p-text-color);
}
html.dark .p-listbox-option,
[data-theme="dark"] .p-listbox-option,
.dark .p-listbox-option {
    color: var(--p-text-color);
}
html.dark .p-listbox-option:hover:not(.p-disabled),
[data-theme="dark"] .p-listbox-option:hover:not(.p-disabled),
.dark .p-listbox-option:hover:not(.p-disabled) {
    background: var(--p-surface-100);
    color: var(--p-text-color);
}
html.dark .p-listbox-option.p-highlight,
[data-theme="dark"] .p-listbox-option.p-highlight,
.dark .p-listbox-option.p-highlight {
    background: rgba(16, 185, 129, 0.16);
    color: var(--p-primary-300);
}
html.dark .p-listbox-option.p-highlight:hover:not(.p-disabled),
[data-theme="dark"] .p-listbox-option.p-highlight:hover:not(.p-disabled),
.dark .p-listbox-option.p-highlight:hover:not(.p-disabled) {
    background: rgba(16, 185, 129, 0.24);
    color: var(--p-primary-200);
}
html.dark .p-listbox-option-badge,
[data-theme="dark"] .p-listbox-option-badge,
.dark .p-listbox-option-badge {
    background: var(--p-surface-100);
    color: var(--p-text-muted);
}
html.dark .p-listbox-option.p-highlight .p-listbox-option-badge,
[data-theme="dark"] .p-listbox-option.p-highlight .p-listbox-option-badge,
.dark .p-listbox-option.p-highlight .p-listbox-option-badge {
    background: rgba(16, 185, 129, 0.25);
    color: var(--p-primary-200);
}
html.dark .p-listbox-option-checkbox,
[data-theme="dark"] .p-listbox-option-checkbox,
.dark .p-listbox-option-checkbox {
    background: var(--p-surface-50);
    border-color: var(--p-border-color);
}
html.dark .p-listbox-option-checkmark,
[data-theme="dark"] .p-listbox-option-checkmark,
.dark .p-listbox-option-checkmark {
    color: var(--p-primary-400);
}
html.dark .p-listbox-striped .p-listbox-option:nth-child(even):not(.p-highlight),
[data-theme="dark"] .p-listbox-striped .p-listbox-option:nth-child(even):not(.p-highlight),
.dark .p-listbox-striped .p-listbox-option:nth-child(even):not(.p-highlight) {
    background: var(--p-surface-50);
}
`;

const checkSvg = html`<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;
const searchSvg = html`<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`;

export default function ListboxIsland(container: HTMLElement, props: ListboxProps, ctx?: IslandContext) {
    injectIslandStyle('laughtale-listbox', CSS);

    const isMultiple = props.multiple === true || String(props.multiple) === 'true';
    const isMetaKey = props.metaKeySelection !== false && String(props.metaKeySelection) !== 'false';
    const isCheckbox = props.checkbox === true || String(props.checkbox) === 'true';
    const isCheckmark = props.checkmark === true || String(props.checkmark) === 'true';
    const isHighlightOnSelect = props.highlightOnSelect !== false && String(props.highlightOnSelect) !== 'false';
    const isFilter = props.filter === true || String(props.filter) === 'true';
    const isFluid = props.fluid === true || String(props.fluid) === 'true';
    const isInvalid = props.invalid === true || String(props.invalid) === 'true';
    const isDisabled = props.disabled === true || String(props.disabled) === 'true';
    const isStriped = props.striped === true || String(props.striped) === 'true';
    const isFilled = props.variant === 'filled';
    const size = props.size || 'normal';
    const scrollHeight = props.scrollHeight || '220px';

    // Normalize options (support strings and complex objects)
    function normalizeOptions(opts: (ListboxOptionItem | string)[]): ListboxOptionItem[] {
        return (opts || []).map(opt => {
            if (typeof opt === 'string') {
                return { label: opt, value: opt };
            }
            return {
                label: opt.label || opt.name || String(opt.value || ''),
                value: opt.value !== undefined ? opt.value : (opt.code || opt.name || opt.label),
                code: opt.code,
                name: opt.name,
                icon: opt.icon,
                flag: opt.flag,
                badge: opt.badge,
                description: opt.description,
                disabled: opt.disabled,
                items: opt.items ? normalizeOptions(opt.items) : undefined
            };
        });
    }

    const rawOptions = normalizeOptions(props.options || []);

    const formField = useFormField(container, ctx, {
        cardinality: isMultiple ? 'Multiple' : 'Single',
        name: props.name || props.targetInputName
    });

    // Selected values set
    const selectedValues = new Set<string>();
    const initialVal = props.value ?? props.selectedValue ?? formField.getValue();

    if (initialVal !== undefined && initialVal !== null) {
        if (Array.isArray(initialVal)) {
            initialVal.forEach(v => selectedValues.add(typeof v === 'object' && v !== null ? String(v.value || v.code || v.name) : String(v)));
        } else if (typeof initialVal === 'string') {
            try {
                const parsed = JSON.parse(initialVal);
                if (Array.isArray(parsed)) parsed.forEach(v => selectedValues.add(String(v)));
                else if (initialVal !== '') selectedValues.add(initialVal);
            } catch {
                if (initialVal !== '') selectedValues.add(initialVal);
            }
        } else {
            selectedValues.add(String(initialVal));
        }
    }

    let searchQuery = '';
    let focusedIndex = -1;

    function getFlatVisibleOptions(): ListboxOptionItem[] {
        const flat: ListboxOptionItem[] = [];
        const q = searchQuery.toLowerCase().trim();

        function matches(item: ListboxOptionItem): boolean {
            if (!q) return true;
            if (props.filterMatchMode === 'startsWith') {
                return Boolean(item.label.toLowerCase().startsWith(q) || (item.code && item.code.toLowerCase().startsWith(q)));
            }
            return Boolean(item.label.toLowerCase().includes(q) || (item.code && item.code.toLowerCase().includes(q)));
        }

        for (const opt of rawOptions) {
            if (opt.items && opt.items.length > 0) {
                const filteredChildren = opt.items.filter(matches);
                if (filteredChildren.length > 0) {
                    flat.push(...filteredChildren);
                }
            } else if (matches(opt)) {
                flat.push(opt);
            }
        }
        return flat;
    }

    function init() {
        const rootClasses = [
            'laughtale-listbox',
            'p-listbox',
            isFluid ? 'p-listbox-fluid' : '',
            isFilled ? 'variant-filled' : '',
            isStriped ? 'p-listbox-striped' : '',
            size !== 'normal' ? `size-${size}` : '',
            isInvalid ? 'is-invalid' : '',
            isDisabled ? 'is-disabled' : ''
        ].filter(Boolean).join(' ');

        container.className = rootClasses;
        container.setAttribute('tabindex', isDisabled ? '-1' : '0');
        container.setAttribute('role', 'listbox');
        container.setAttribute('aria-multiselectable', isMultiple ? 'true' : 'false');
        container.setAttribute('aria-label', (props as any).ariaLabel || props.header || 'Listbox');
        if (props.inputId) container.id = props.inputId;

        formField.detach();
        setHtml(container, html`
            ${props.header ? html`
                <div class="p-listbox-header" data-part="root">
                    <span>${props.header}</span>
                    ${props.headerCount ? html`<span class="p-listbox-header-count">${props.headerCount}</span>` : ''}
                </div>
            ` : ''}
            ${isFilter ? html`
                <div class="p-listbox-filter-container">
                    <span style="color: var(--lt-surface-400); display: flex;">${searchSvg}</span>
                    <input type="text" class="p-listbox-filter-input" placeholder="${props.filterPlaceholder || 'Filter...'}" ${attr('disabled', isDisabled)} />
                </div>
            ` : ''}
            <div class="p-listbox-list-wrapper" style="max-height: ${scrollHeight};">
                <ul class="p-listbox-list" role="presentation"></ul>
            </div>
            ${props.footer ? html`
                <div class="p-listbox-footer">${props.footer}</div>
            ` : ''}
        `);
        formField.reattach();

        renderOptions();
        bindEvents();
        syncValue();
    }

    const ITEM_HEIGHT = 38;
    let virtualizer: Virtualizer | null = null;
    let currentStart = -1;
    let currentEnd = -1;
    let currentVisible: ListboxOptionItem[] = [];
    let scrollBound = false;

    function renderOptions() {
        const listWrapperEl = container.querySelector<HTMLElement>('.p-listbox-list-wrapper')!;
        const q = searchQuery.toLowerCase().trim();

        function matches(item: ListboxOptionItem): boolean {
            if (!q) return true;
            if (props.filterMatchMode === 'startsWith') {
                return Boolean(item.label.toLowerCase().startsWith(q) || (item.code && item.code.toLowerCase().startsWith(q)));
            }
            return Boolean(item.label.toLowerCase().includes(q) || (item.code && item.code.toLowerCase().includes(q)));
        }

        const isGrouped = rawOptions.some(o => o.items && o.items.length > 0);

        if (isGrouped) {
            const groupNodes: Raw[] = [];
            let totalRendered = 0;
            let counter = 0;

            for (const group of rawOptions) {
                const groupItems = group.items ? group.items.filter(matches) : [];
                if (groupItems.length === 0 && !matches(group)) continue;

                groupNodes.push(html`
                    <li class="p-listbox-option-group" role="group">
                        <div class="p-listbox-option-group-label">
                            ${group.flag ? html`<span style="font-size: 1.1rem; line-height: 1;">${group.flag}</span>` : ''}
                            ${group.icon ? html`<span style="display: flex;">${unsafe(getLucideIcon(group.icon, 14))}</span>` : ''}
                            <span>${group.label}</span>
                        </div>
                        <ul style="margin: 0; padding: 0; list-style: none;">
                            ${groupItems.map((item) => renderSingleOptionHtml(item, counter++, groupItems.length))}
                        </ul>
                    </li>
                `);
                totalRendered += groupItems.length;
            }

            if (totalRendered === 0) {
                setHtml(listWrapperEl, html`<ul class="p-listbox-list" role="presentation"><li style="padding: 1rem; text-align: center; color: var(--p-text-muted); font-size: 0.8125rem;">No results found</li></ul>`);
            } else {
                setHtml(listWrapperEl, html`<ul class="p-listbox-list" role="presentation">${groupNodes}</ul>`);
            }
            currentVisible = [];
            virtualizer = null;
        } else {
            const visible = rawOptions.filter(matches);
            currentVisible = visible;
            if (visible.length === 0) {
                virtualizer = null;
                setHtml(listWrapperEl, html`<ul class="p-listbox-list" role="presentation"><li style="padding: 1rem; text-align: center; color: var(--p-text-muted); font-size: 0.8125rem;">No results found</li></ul>`);
            } else if (visible.length < 100) {
                virtualizer = null;
                const nodes: Raw[] = [];
                for (let i = 0; i < visible.length; i++) {
                    nodes.push(renderSingleOptionHtml(visible[i], i, visible.length));
                }
                setHtml(listWrapperEl, html`<ul class="p-listbox-list" role="presentation">${nodes}</ul>`);
            } else {
                virtualizer = useVirtualizer({
                    count: visible.length,
                    estimateSize: 38,
                    getScrollElement: () => listWrapperEl,
                    virtualThreshold: 100
                });
                const virtualItems = virtualizer.getVirtualItems();
                currentStart = virtualItems.length > 0 ? virtualItems[0].index : 0;
                currentEnd = virtualItems.length > 0 ? virtualItems[virtualItems.length - 1].index : 0;
                const startOffset = virtualItems.length > 0 ? virtualItems[0].start : 0;

                setHtml(listWrapperEl, html`
                    <div class="p-virtual-spacer" data-virtual-spacer>
                        <ul class="p-listbox-list p-virtual-list" role="presentation">
                            ${virtualItems.map(vi => renderSingleOptionHtml(visible[vi.index], vi.index, visible.length))}
                        </ul>
                    </div>
                `);
                const spacerEl = listWrapperEl.querySelector<HTMLElement>('.p-virtual-spacer');
                const listEl = listWrapperEl.querySelector<HTMLElement>('.p-listbox-list');
                if (spacerEl) spacerEl.style.height = `${virtualizer.getTotalSize()}px`;
                if (listEl) listEl.style.transform = `translateY(${startOffset}px)`;

                if (!scrollBound) {
                    scrollBound = true;
                    listWrapperEl.addEventListener('scroll', () => {
                        if (!virtualizer || !virtualizer.isVirtual()) return;
                        const newVirtualItems = virtualizer.getVirtualItems();
                        if (newVirtualItems.length === 0) return;
                        const newStart = newVirtualItems[0].index;
                        const newEnd = newVirtualItems[newVirtualItems.length - 1].index;
                        if (newStart === currentStart && newEnd === currentEnd) return;
                        currentStart = newStart;
                        currentEnd = newEnd;
                        const newStartOffset = newVirtualItems[0].start;
                        const listEl = listWrapperEl.querySelector<HTMLElement>('.p-listbox-list');
                        if (listEl) {
                            listEl.style.transform = `translateY(${newStartOffset}px)`;
                            const nodes = newVirtualItems.map(vi => renderSingleOptionHtml(currentVisible[vi.index], vi.index, currentVisible.length));
                            setHtml(listEl, html`${nodes}`);
                            bindItemEvents();
                            restoreFocus();
                        }
                    }, { signal: ctx?.signal, passive: true });
                }
            }
        }

        bindItemEvents();
        restoreFocus();
    }

    function renderSingleOptionHtml(item: ListboxOptionItem, index: number, totalCount: number): Raw {
        const valStr = String(item.value);
        const isSelected = selectedValues.has(valStr);
        const highlightClass = isSelected ? (isHighlightOnSelect ? 'p-highlight' : 'p-highlight-none') : '';
        const disabledClass = item.disabled ? 'p-disabled' : '';

        let checkboxHtml: Raw | '' = '';
        if (isCheckbox && isMultiple) {
            checkboxHtml = html`
                <span class="p-listbox-option-checkbox" aria-hidden="true">
                    ${isSelected ? checkSvg : ''}
                </span>
            `;
        }

        let checkmarkHtml: Raw | '' = '';
        if (isCheckmark && isSelected) {
            checkmarkHtml = html`
                <span class="p-listbox-option-checkmark" aria-hidden="true">
                    ${checkSvg}
                </span>
            `;
        }

        let leadingHtml: Raw | '' = '';
        if (item.flag) {
            leadingHtml = html`<span style="font-size: 1.1rem; line-height: 1; flex-shrink: 0;">${item.flag}</span>`;
        } else if (item.icon) {
            leadingHtml = html`<span style="display: flex; flex-shrink: 0; color: var(--lt-primary-600);">${unsafe(getLucideIcon(item.icon, 16))}</span>`;
        }

        let trailingHtml: Raw | '' = '';
        if (item.code) {
            trailingHtml = html`<span class="p-listbox-option-badge">${item.code}</span>`;
        } else if (item.badge) {
            trailingHtml = html`<span class="p-listbox-option-badge">${item.badge}</span>`;
        }

        return html`
            <li class="p-listbox-option ${highlightClass} ${disabledClass}" 
                role="option" 
                aria-selected="${isSelected}" 
                aria-disabled="${item.disabled ? 'true' : 'false'}" 
                aria-setsize="${totalCount}" 
                aria-posinset="${index + 1}" 
                data-index="${index}" 
                data-val="${valStr}" 
                tabindex="-1">
                <div class="p-listbox-option-content">
                    ${checkboxHtml}
                    ${leadingHtml}
                    <span>${item.label}</span>
                </div>
                ${trailingHtml}
                ${checkmarkHtml}
            </li>
        `;
    }

    function bindItemEvents() {
        const items = container.querySelectorAll<HTMLElement>('.p-listbox-option');
        items.forEach((itemEl) => {
            itemEl.addEventListener('click', (e) => {
                if (isDisabled || itemEl.classList.contains('p-disabled')) return;
                const val = itemEl.getAttribute('data-val')!;
                handleSelect(val, e);
            }, { signal: ctx?.signal });

            if (props.focusOnHover) {
                itemEl.addEventListener('mouseenter', () => {
                    if (!isDisabled && !itemEl.classList.contains('p-disabled')) {
                        const idx = parseInt(itemEl.getAttribute('data-index') || '0', 10);
                        updateFocus(idx);
                    }
                }, { signal: ctx?.signal });
            }
        });
    }

    function handleSelect(valStr: string, e?: MouseEvent | KeyboardEvent) {
        const isCtrlOrCmd = e && (e.ctrlKey || e.metaKey);

        if (isMultiple) {
            if (isMetaKey && !isCtrlOrCmd && !isCheckbox) {
                selectedValues.clear();
                selectedValues.add(valStr);
            } else {
                if (selectedValues.has(valStr)) selectedValues.delete(valStr);
                else selectedValues.add(valStr);
            }
        } else {
            selectedValues.clear();
            selectedValues.add(valStr);
        }

        renderOptions();
        syncValue();
    }

    function updateFocus(idx: number) {
        focusedIndex = idx;
        if (virtualizer && virtualizer.isVirtual()) {
            if (idx < currentStart || idx > currentEnd) {
                virtualizer.scrollToIndex(idx, 'auto');
                const newVirtualItems = virtualizer.getVirtualItems();
                if (newVirtualItems.length > 0) {
                    currentStart = newVirtualItems[0].index;
                    currentEnd = newVirtualItems[newVirtualItems.length - 1].index;
                    const newStartOffset = newVirtualItems[0].start;
                    const listEl = container.querySelector<HTMLElement>('.p-listbox-list');
                    if (listEl) {
                        listEl.style.transform = `translateY(${newStartOffset}px)`;
                        const nodes = newVirtualItems.map(vi => renderSingleOptionHtml(currentVisible[vi.index], vi.index, currentVisible.length));
                        setHtml(listEl, html`${nodes}`);
                        bindItemEvents();
                    }
                }
            }
            restoreFocus();
        } else {
            const visible = Array.from(container.querySelectorAll<HTMLElement>('.p-listbox-option'));
            setRovingTabindex(visible, idx);
            visible.forEach((el, i) => {
                if (i === idx) {
                    el.classList.add('p-focus');
                    if (container.classList.contains('is-focused')) el.focus();
                } else {
                    el.classList.remove('p-focus');
                }
            });
        }
    }

    function restoreFocus() {
        const renderedElements = Array.from(container.querySelectorAll<HTMLElement>('.p-listbox-option'));
        if (renderedElements.length === 0) return;

        if (focusedIndex >= 0) {
            const activeEl = renderedElements.find(el => {
                const idx = parseInt(el.getAttribute('data-index') || '-1', 10);
                return idx === focusedIndex;
            });
            if (activeEl) {
                const winIdx = renderedElements.indexOf(activeEl);
                setRovingTabindex(renderedElements, winIdx);
                renderedElements.forEach(el => el.classList.remove('p-focus'));
                activeEl.classList.add('p-focus');
                if (container.classList.contains('is-focused')) {
                    activeEl.focus();
                }
            } else {
                setRovingTabindex(renderedElements, -1);
            }
        } else {
            setRovingTabindex(renderedElements, 0);
        }
    }

    function bindEvents() {
        const filterInp = container.querySelector<HTMLInputElement>('.p-listbox-filter-input');
        if (filterInp) {
            const debouncedSearch = useDebounce(() => {
                searchQuery = filterInp.value;
                focusedIndex = -1;
                renderOptions();
            }, 150);
            filterInp.addEventListener('input', () => debouncedSearch(), { signal: ctx?.signal });
        }

        container.addEventListener('focus', () => {
            container.classList.add('is-focused');
            if (props.autoOptionFocus !== false && focusedIndex === -1) {
                updateFocus(0);
            }
        }, { signal: ctx?.signal });

        container.addEventListener('blur', (e) => {
            if (!container.contains(e.relatedTarget as Node)) {
                container.classList.remove('is-focused');
                const visible = container.querySelectorAll<HTMLElement>('.p-listbox-option');
                visible.forEach(el => el.classList.remove('p-focus'));
            }
        }, { signal: ctx?.signal });

        container.addEventListener('keydown', (e) => {
            if (isDisabled) return;
            const totalCount = currentVisible.length > 0 ? currentVisible.length : container.querySelectorAll<HTMLElement>('.p-listbox-option').length;
            if (totalCount === 0) return;

            if (e.key === 'ArrowDown') {
                e.preventDefault();
                const next = Math.min(focusedIndex + 1, totalCount - 1);
                updateFocus(next);
                if (props.selectOnFocus && !isMultiple && currentVisible[next]) {
                    handleSelect(String(currentVisible[next].value), e);
                }
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                const prev = Math.max(focusedIndex - 1, 0);
                updateFocus(prev);
                if (props.selectOnFocus && !isMultiple && currentVisible[prev]) {
                    handleSelect(String(currentVisible[prev].value), e);
                }
            } else if (e.key === 'Home') {
                e.preventDefault();
                updateFocus(0);
            } else if (e.key === 'End') {
                e.preventDefault();
                updateFocus(totalCount - 1);
            } else if (e.key === ' ' || e.key === 'Enter') {
                if (focusedIndex >= 0 && focusedIndex < totalCount && currentVisible[focusedIndex]) {
                    e.preventDefault();
                    handleSelect(String(currentVisible[focusedIndex].value), e);
                }
            } else if (e.key === 'a' && (e.ctrlKey || e.metaKey) && isMultiple) {
                e.preventDefault();
                if (currentVisible.length > 0) {
                    currentVisible.forEach(opt => {
                        if (!opt.disabled) selectedValues.add(String(opt.value));
                    });
                    renderOptions();
                    syncValue();
                }
            }
        }, { signal: ctx?.signal });
    }

    function syncValue() {
        const valArray = Array.from(selectedValues);
        const payload = isMultiple ? valArray : (valArray[0] || null);

        formField.setValue(valArray);

        emitComponentEvent(container, 'listbox', 'change', {
            value: payload,
            selectedValues: valArray
        });
    }

    init();
}
