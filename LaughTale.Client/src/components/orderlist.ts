/**
 * LaughTale: Enterprise OrderList Component (Aura Design System compliant)
 * Clean, instant, and accessible list reordering with selection modes, checkboxes,
 * live filtering, and rich item templates.
 */

import { OrderListItem } from '../types/models';
import { injectIslandStyle } from '../runtime/styles';
import { emitComponentEvent } from '../runtime/events';
import { LucideIcons } from '../icons/lucide';
import { resolvePart, applyPart, type PassthroughRecord } from '../runtime/parts';
import type { IslandContext } from '../runtime/registry';
import { html, setHtml, url as safeUrl, unsafe, attr, type Raw } from '../runtime/html';
import { useFormField } from '../composables/useFormField';
import { useLocale } from '../composables/useLocale';
import { useVirtualizer, type Virtualizer } from '../composables/useVirtualizer';
import type { PatternDeclaration } from '../accessibility/patterns';

export const a11y: PatternDeclaration = {
    kind: 'native',
    element: 'button'
};

export interface OrderListProps<T = any> {
    name?: string;
    value?: OrderListItem<T>[];
    items?: OrderListItem<T>[];
    header?: string;
    dataKey?: string;
    checkbox?: boolean;
    filter?: boolean;
    filterBy?: string;
    filterPlaceholder?: string;
    filterFields?: string[];
    scrollHeight?: string;
    responsive?: boolean;
    breakpoint?: string;
    stripedRows?: boolean;
    disabled?: boolean;
    targetInputName?: string;
    emptyMessage?: string;
    pt?: PassthroughRecord;
    studioOverrides?: Record<string, any>;
}

const ORDERLIST_CSS = `
.p-orderlist {
    display: flex;
    align-items: flex-start;
    gap: 1.25rem;
    width: 100%;
    font-family: var(--p-font-family, inherit);
    color: var(--lt-surface-800);
}

.p-orderlist-controls {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    gap: 0.5rem;
    flex-shrink: 0;
    padding-top: 0.5rem;
}

.p-orderlist-control-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2.25rem;
    height: 2.25rem;
    padding: 0;
    border-radius: var(--lt-radius);
    border: 1px solid var(--lt-surface-300);
    background: var(--lt-surface-0);
    color: var(--lt-surface-700);
    cursor: pointer;
    transition: background-color 0.12s ease, border-color 0.12s ease, color 0.12s ease;
    outline: none;
}
.p-orderlist-control-btn:hover:not(:disabled) {
    background: var(--lt-surface-100);
    color: var(--lt-surface-900);
    border-color: var(--lt-surface-400);
}
.p-orderlist-control-btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
}

.p-orderlist-list-container {
    flex: 1 1 0;
    display: flex;
    flex-direction: column;
    border: 1px solid var(--lt-surface-200);
    border-radius: var(--lt-radius-lg);
    background: var(--lt-surface-0);
    overflow: hidden;
    min-width: 0;
    box-shadow: var(--p-shadow-xs, 0 1px 2px 0 rgba(0, 0, 0, 0.05));
}

.p-orderlist-header {
    padding: 0.75rem 1rem;
    background: var(--lt-surface-50);
    border-bottom: 1px solid var(--lt-surface-200);
    font-size: 0.875rem;
    font-weight: 700;
    color: var(--lt-surface-800);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
}

.p-orderlist-filter-container {
    padding: 0.5rem 0.75rem;
    background: var(--lt-surface-50);
    border-bottom: 1px solid var(--lt-surface-200);
    position: relative;
    display: flex;
    align-items: center;
}
.p-orderlist-filter-input {
    width: 100%;
    padding: 0.4rem 2rem 0.4rem 0.65rem;
    font-size: 0.8125rem;
    border: 1px solid var(--lt-surface-300);
    border-radius: var(--lt-radius);
    background: var(--lt-surface-0);
    color: inherit;
    outline: none;
    transition: border-color 0.15s ease, box-shadow 0.15s ease;
}
.p-orderlist-filter-input:focus {
    border-color: var(--lt-primary-500);
    box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.2);
}
.p-orderlist-filter-icon {
    position: absolute;
    right: 1.25rem;
    color: var(--lt-surface-400);
    pointer-events: none;
    display: flex;
    align-items: center;
}

.p-orderlist-list {
    list-style: none;
    margin: 0;
    padding: 0.25rem 0;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
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

.p-orderlist-item {
    padding: 0.625rem 1rem;
    margin: 0.125rem 0.25rem;
    border-radius: var(--p-border-radius-xs, 5px);
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-size: 0.875rem;
    color: var(--lt-surface-700);
    user-select: none;
    transition: background-color 0.12s ease, color 0.12s ease;
}
.p-orderlist-item:hover:not(.p-highlight) {
    background: var(--lt-surface-100);
    color: var(--lt-surface-900);
}
.p-orderlist-item.p-highlight {
    background: rgba(16, 185, 129, 0.1) !important;
    color: var(--lt-primary-700) !important;
    font-weight: 600;
}

/* Checkbox */
.p-checkbox-box {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 1.125rem;
    height: 1.125rem;
    border-radius: var(--p-border-radius-xs, 4px);
    border: 2px solid var(--lt-surface-300);
    background: var(--lt-surface-0);
    cursor: pointer;
    transition: background-color 0.12s ease, border-color 0.12s ease;
    flex-shrink: 0;
}
.p-checkbox-box.p-checked {
    background: var(--lt-primary-500);
    border-color: var(--lt-primary-500);
    color: var(--lt-surface-0, var(--lt-surface-0));
}

/* Product Item Content */
.p-orderlist-product-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    width: 100%;
}
.p-orderlist-product-img {
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 6px;
    background: var(--lt-surface-100);
    border: 1px solid var(--lt-surface-200);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--lt-primary-600);
    flex-shrink: 0;
}
.p-orderlist-product-details {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
    min-width: 0;
}
.p-orderlist-product-name {
    font-weight: 600;
    font-size: 0.875rem;
    color: var(--lt-surface-900);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
.p-orderlist-product-category {
    font-size: 0.75rem;
    color: var(--lt-surface-500);
}
.p-orderlist-product-price {
    font-weight: 700;
    font-size: 0.875rem;
    color: var(--lt-surface-900);
}

/* Numbered Digits */
.p-orderlist-index {
    font-variant-numeric: tabular-nums;
    font-size: 0.8125rem;
    font-weight: 600;
    color: var(--lt-surface-400);
    width: 1.5rem;
    text-align: right;
    flex-shrink: 0;
}

/* Footer / Status Bar */
.p-orderlist-footer {
    padding: 0.5rem 1rem;
    background: var(--lt-surface-50);
    border-top: 1px solid var(--lt-surface-200);
    font-size: 0.75rem;
    color: var(--lt-surface-500);
    display: flex;
    align-items: center;
    justify-content: space-between;
}

/* Empty State */
.p-orderlist-empty {
    padding: 2.5rem 1rem;
    text-align: center;
    color: var(--lt-surface-400);
    font-size: 0.8125rem;
    font-style: italic;
}

/* Dark Mode Tokens */
html.dark .p-orderlist,
[data-theme="dark"] .p-orderlist,
.dark .p-orderlist {
    color: var(--p-text-color) !important;
}
html.dark .p-orderlist-list-container,
[data-theme="dark"] .p-orderlist-list-container,
.dark .p-orderlist-list-container {
    background: var(--p-surface-0) !important;
    border-color: var(--p-border-color) !important;
}
html.dark .p-orderlist-header,
html.dark .p-orderlist-filter-container,
html.dark .p-orderlist-footer,
[data-theme="dark"] .p-orderlist-header,
[data-theme="dark"] .p-orderlist-filter-container,
[data-theme="dark"] .p-orderlist-footer,
.dark .p-orderlist-header,
.dark .p-orderlist-filter-container,
.dark .p-orderlist-footer {
    background: var(--p-surface-50) !important;
    border-color: var(--p-border-color) !important;
    color: var(--p-text-color) !important;
}
html.dark .p-orderlist-filter-input,
[data-theme="dark"] .p-orderlist-filter-input,
.dark .p-orderlist-filter-input {
    background: var(--p-surface-0) !important;
    border-color: var(--p-border-color) !important;
    color: var(--p-text-color) !important;
}
html.dark .p-orderlist-control-btn,
[data-theme="dark"] .p-orderlist-control-btn,
.dark .p-orderlist-control-btn {
    background: var(--p-surface-0) !important;
    border-color: var(--p-border-color) !important;
    color: var(--p-text-muted) !important;
}
html.dark .p-orderlist-control-btn:hover:not(:disabled),
[data-theme="dark"] .p-orderlist-control-btn:hover:not(:disabled),
.dark .p-orderlist-control-btn:hover:not(:disabled) {
    background: var(--p-surface-100) !important;
    color: var(--p-text-color) !important;
}
html.dark .p-orderlist-item:hover:not(.p-highlight),
[data-theme="dark"] .p-orderlist-item:hover:not(.p-highlight),
.dark .p-orderlist-item:hover:not(.p-highlight) {
    background: var(--p-surface-100) !important;
    color: var(--p-text-color) !important;
}
html.dark .p-orderlist-product-name,
html.dark .p-orderlist-product-price,
[data-theme="dark"] .p-orderlist-product-name,
[data-theme="dark"] .p-orderlist-product-price,
.dark .p-orderlist-product-name,
.dark .p-orderlist-product-price {
    color: var(--p-text-color) !important;
}
html.dark .p-orderlist-product-img,
[data-theme="dark"] .p-orderlist-product-img,
.dark .p-orderlist-product-img {
    background: var(--p-surface-100) !important;
    border-color: var(--p-border-color) !important;
}
`;

export default function OrderListIsland<T = any>(container: HTMLElement, props: OrderListProps<T>, ctx?: IslandContext) {
    injectIslandStyle('orderlist', ORDERLIST_CSS);
    const locale = useLocale(ctx);

    const formField = useFormField(container, ctx, {
        cardinality: 'Multiple',
        name: props.name || props.targetInputName
    });

    const fieldVal = formField.getValue();
    const initialItems: OrderListItem<T>[] = props.value ? [...props.value] : (props.items ? [...props.items] : (Array.isArray(fieldVal) && fieldVal.length > 0 ? [...fieldVal] : []));
    let itemsList: OrderListItem<T>[] = [...initialItems];

    const dataKey = props.dataKey || 'id';
    const isCheckbox = !!props.checkbox;
    const isFilter = !!props.filter;
    const filterBy = props.filterBy || (props.filterFields && props.filterFields[0]) || 'name';
    const filterPlaceholder = props.filterPlaceholder || 'Filter by name';
    const scrollHeight = props.scrollHeight || '20rem';
    const emptyMessage = props.emptyMessage || 'No available options';

    let selectedIds: Set<string> = new Set();
    let filterQuery = '';

    function getItemId(item: OrderListItem<T>, fallbackIndex: number): string {
        if (typeof item === 'string' || typeof item === 'number') {
            return String(item);
        }
        const keyVal = (item as any)[dataKey] || item.id || item.title || item.name;
        return keyVal != null ? String(keyVal) : String(fallbackIndex);
    }

    function getItemTitle(item: OrderListItem<T>): string {
        if (typeof item === 'string' || typeof item === 'number') {
            return String(item);
        }
        return item.title || item.name || '';
    }

    function renderCellContent(item: OrderListItem<T>, index: number, isSelected: boolean): Raw {
        const checkboxHtml = isCheckbox ? html`
            <div class="p-checkbox-box ${isSelected ? 'p-checked' : ''}" data-part="root" role="checkbox" aria-checked="${isSelected}">
                ${isSelected ? unsafe(LucideIcons.check) : ''}
            </div>
        ` : '';

        // Product template
        if (item.price != null || item.category != null || item.image != null) {
            return html`
                ${checkboxHtml}
                <div class="p-orderlist-product-item">
                    <div class="p-orderlist-product-img">
                        ${unsafe(LucideIcons.package)}
                    </div>
                    <div class="p-orderlist-product-details">
                        <span class="p-orderlist-product-name">${getItemTitle(item)}</span>
                        <span class="p-orderlist-product-category">${item.category || ''}</span>
                    </div>
                    ${item.price != null ? html`<span class="p-orderlist-product-price">$${item.price}</span>` : ''}
                </div>
            `;
        }

        // Default numbered item
        return html`
            ${checkboxHtml}
            <span class="p-orderlist-index">${index + 1}</span>
            <span style="flex: 1; font-weight: ${isSelected ? '600' : 'normal'}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                ${getItemTitle(item)}
            </span>
        `;
    }

    function buildShell() {
        const headerHtml = props.header ? html`
            <div class="p-orderlist-header">
                <span>${props.header}</span>
            </div>
        ` : '';

        const filterHtml = isFilter ? html`
            <div class="p-orderlist-filter-container">
                <input type="text" class="p-orderlist-filter-input" placeholder="${filterPlaceholder}" />
                <span class="p-orderlist-filter-icon">${unsafe(LucideIcons.search)}</span>
            </div>
        ` : '';

        formField.detach();
        setHtml(container, html`
            <div class="p-orderlist p-component">
                <!-- Reorder Action Buttons (Left) -->
                <div class="p-orderlist-controls">
                    <button type="button" class="p-orderlist-control-btn btn-order-top" title="Move to Top" aria-label="Move to Top" disabled>
                        ${unsafe(LucideIcons.chevronsUp)}
                    </button>
                    <button type="button" class="p-orderlist-control-btn btn-order-up" title="Move Up" aria-label="Move Up" disabled>
                        ${unsafe(LucideIcons.chevronUp)}
                    </button>
                    <button type="button" class="p-orderlist-control-btn btn-order-down" title="Move Down" aria-label="Move Down" disabled>
                        ${unsafe(LucideIcons.chevronDown)}
                    </button>
                    <button type="button" class="p-orderlist-control-btn btn-order-bottom" title="Move to Bottom" aria-label="Move to Bottom" disabled>
                        ${unsafe(LucideIcons.chevronsDown)}
                    </button>
                </div>

                <!-- List Box (Right) -->
                <div class="p-orderlist-list-container">
                    ${headerHtml}
                    ${filterHtml}
                    <ul class="p-orderlist-list" style="height: ${scrollHeight};" role="listbox" aria-multiselectable="true" tabindex="0">
                    </ul>
                    <div class="p-orderlist-footer">
                        <span class="p-orderlist-selection-status">No selected item</span>
                        ${isFilter ? html`<span class="p-orderlist-results-status" style="font-size: 0.6875rem; color: var(--lt-surface-400);">0 results available</span>` : ''}
                    </div>
                </div>
            </div>
        `);
        formField.reattach();

        bindPermanentEvents();
        updateListStructure();
    }

    function updateSelectionUI() {
        const rootEl = container.firstElementChild as HTMLElement;
        if (!rootEl) return;

        // Update Selection Status
        const statusEl = rootEl.querySelector('.p-orderlist-selection-status');
        if (statusEl) {
            statusEl.textContent = selectedIds.size > 0 ? `${selectedIds.size} items selected` : 'No selected item';
        }

        // Update DOM elements in-place without rebuilding innerHTML
        const listUl = rootEl.querySelector<HTMLUListElement>('.p-orderlist-list');
        if (listUl) {
            listUl.querySelectorAll<HTMLElement>('.p-orderlist-item').forEach(el => {
                const id = el.getAttribute('data-id');
                if (!id) return;
                const isSelected = selectedIds.has(id);
                el.classList.toggle('p-highlight', isSelected);
                el.setAttribute('aria-selected', String(isSelected));

                if (isCheckbox) {
                    const chk = el.querySelector<HTMLElement>('.p-checkbox-box');
                    if (chk) {
                        chk.className = `p-checkbox-box ${isSelected ? 'p-checked' : ''}`;
                        chk.setAttribute('aria-checked', String(isSelected));
                        setHtml(chk, isSelected ? unsafe(LucideIcons.check) : html``);
                    }
                }
            });
        }

        updateButtons();
        dispatchSelectionEvent();
    }

    const ITEM_HEIGHT = 46;
    let virtualizer: Virtualizer | null = null;
    let currentStart = -1;
    let currentEnd = -1;
    let currentFilteredItems: any[] = [];
    let scrollBound = false;
    let lastFocusedId: string | null = null;

    function renderOrderItemHtml(item: any, idx: number, totalCount: number): Raw {
        const id = getItemId(item, idx);
        const isSelected = selectedIds.has(id);
        return html`
            <li class="p-orderlist-item ${isSelected ? 'p-highlight' : ''}" 
                data-id="${id}" 
                data-index="${idx}"
                role="option" 
                aria-selected="${isSelected}"
                aria-setsize="${totalCount}"
                aria-posinset="${idx + 1}"
                tabindex="${idx === 0 ? '0' : '-1'}">
                ${renderCellContent(item, idx, isSelected)}
            </li>
        `;
    }

    function bindItemClicks() {
        const rootEl = container.firstElementChild as HTMLElement;
        if (!rootEl) return;
        const listUl = rootEl.querySelector<HTMLUListElement>('.p-orderlist-list');
        if (!listUl) return;

        listUl.querySelectorAll<HTMLElement>('.p-orderlist-item').forEach(el => {
            el.addEventListener('focus', () => {
                const id = el.getAttribute('data-id');
                if (id) lastFocusedId = id;
            }, { signal: ctx?.signal });

            el.addEventListener('click', (e) => {
                const id = el.getAttribute('data-id');
                if (!id) return;
                lastFocusedId = id;
                const mouseEvent = e as MouseEvent;

                if (isCheckbox || mouseEvent.ctrlKey || mouseEvent.metaKey) {
                    if (selectedIds.has(id)) selectedIds.delete(id);
                    else selectedIds.add(id);
                } else {
                    if (selectedIds.has(id) && selectedIds.size === 1) {
                        selectedIds.clear();
                    } else {
                        selectedIds.clear();
                        selectedIds.add(id);
                    }
                }
                updateSelectionUI();
            }, { signal: ctx?.signal });
        });
    }

    function restoreFocus() {
        if (!lastFocusedId) return;
        const rootEl = container.firstElementChild as HTMLElement;
        if (!rootEl) return;
        const targetEl = rootEl.querySelector<HTMLElement>(`.p-orderlist-item[data-id="${lastFocusedId}"]`);
        if (targetEl) {
            targetEl.setAttribute('tabindex', '0');
            if (rootEl.contains(document.activeElement)) {
                targetEl.focus();
            }
        }
    }

    function updateListStructure() {
        const rootEl = container.firstElementChild as HTMLElement;
        if (!rootEl) return;

        const filteredItems = itemsList.filter((item, idx) => {
            if (!isFilter || !filterQuery.trim()) return true;
            const targetVal = String((item as any)[filterBy] || item.title || item.name || '').toLowerCase();
            return targetVal.includes(filterQuery.toLowerCase());
        });
        currentFilteredItems = filteredItems;

        // Update Results Count
        const resultsEl = rootEl.querySelector('.p-orderlist-results-status');
        if (resultsEl) {
            resultsEl.textContent = `${filteredItems.length} results are available`;
        }

        // Render List Items
        const listUl = rootEl.querySelector<HTMLUListElement>('.p-orderlist-list');
        if (listUl) {
            if (filteredItems.length === 0) {
                virtualizer = null;
                setHtml(listUl, html`<li class="p-orderlist-empty">${filterQuery ? (locale.t('emptyFilterMessage') || 'No results found') : emptyMessage}</li>`);
            } else if (filteredItems.length < 100) {
                virtualizer = null;
                const nodes: Raw[] = [];
                for (let idx = 0; idx < filteredItems.length; idx++) {
                    nodes.push(renderOrderItemHtml(filteredItems[idx], idx, filteredItems.length));
                }
                setHtml(listUl, html`${nodes}`);
                bindItemClicks();
            } else {
                virtualizer = useVirtualizer({
                    count: filteredItems.length,
                    estimateSize: 46,
                    getScrollElement: () => listUl,
                    virtualThreshold: 100
                });
                const virtualItems = virtualizer.getVirtualItems();
                currentStart = virtualItems.length > 0 ? virtualItems[0].index : 0;
                currentEnd = virtualItems.length > 0 ? virtualItems[virtualItems.length - 1].index : 0;
                const startOffset = virtualItems.length > 0 ? virtualItems[0].start : 0;

                setHtml(listUl, html`
                    <div class="p-virtual-spacer" data-virtual-spacer>
                        <ul class="p-virtual-list">
                            ${virtualItems.map(vi => renderOrderItemHtml(filteredItems[vi.index], vi.index, filteredItems.length))}
                        </ul>
                    </div>
                `);
                const spacerEl = listUl.querySelector<HTMLElement>('.p-virtual-spacer');
                const vListEl = listUl.querySelector<HTMLElement>('.p-virtual-list');
                if (spacerEl) spacerEl.style.height = `${virtualizer.getTotalSize()}px`;
                if (vListEl) vListEl.style.transform = `translateY(${startOffset}px)`;
                bindItemClicks();

                if (!scrollBound) {
                    scrollBound = true;
                    listUl.addEventListener('scroll', () => {
                        if (!virtualizer || !virtualizer.isVirtual()) return;
                        const newVirtualItems = virtualizer.getVirtualItems();
                        if (newVirtualItems.length === 0) return;
                        const newStart = newVirtualItems[0].index;
                        const newEnd = newVirtualItems[newVirtualItems.length - 1].index;
                        if (newStart === currentStart && newEnd === currentEnd) return;
                        currentStart = newStart;
                        currentEnd = newEnd;
                        const newStartOffset = newVirtualItems[0].start;
                        const vList = listUl.querySelector<HTMLElement>('.p-virtual-list');
                        if (vList) {
                            vList.style.transform = `translateY(${newStartOffset}px)`;
                            const newNodes = newVirtualItems.map(vi => renderOrderItemHtml(currentFilteredItems[vi.index], vi.index, currentFilteredItems.length));
                            setHtml(vList, html`${newNodes}`);
                            bindItemClicks();
                            restoreFocus();
                        }
                    }, { signal: ctx?.signal, passive: true });
                }
            }
        }

        updateSelectionUI();
        restoreFocus();
    }

    function updateButtons() {
        const rootEl = container.firstElementChild as HTMLElement;
        if (!rootEl) return;

        const btnTop = rootEl.querySelector<HTMLButtonElement>('.btn-order-top');
        const btnUp = rootEl.querySelector<HTMLButtonElement>('.btn-order-up');
        const btnDown = rootEl.querySelector<HTMLButtonElement>('.btn-order-down');
        const btnBottom = rootEl.querySelector<HTMLButtonElement>('.btn-order-bottom');

        const hasSelection = selectedIds.size > 0 && itemsList.length > 1;

        if (btnTop) btnTop.disabled = !hasSelection;
        if (btnUp) btnUp.disabled = !hasSelection;
        if (btnDown) btnDown.disabled = !hasSelection;
        if (btnBottom) btnBottom.disabled = !hasSelection;
    }

    function bindPermanentEvents() {
        const rootEl = container.firstElementChild as HTMLElement;
        if (!rootEl) return;

        // 1. Live Filter Input
        const filterInput = rootEl.querySelector<HTMLInputElement>('.p-orderlist-filter-input');
        if (filterInput) {
            filterInput.addEventListener('input', (e) => {
                filterQuery = (e.target as HTMLInputElement).value;
                updateListStructure();
            }, { signal: ctx?.signal });
        }

        // 2. Action Controls
        rootEl.querySelector('.btn-order-top')?.addEventListener('click', () => {
            reorder('top');
        }, { signal: ctx?.signal });
        rootEl.querySelector('.btn-order-up')?.addEventListener('click', () => {
            reorder('up');
        }, { signal: ctx?.signal });
        rootEl.querySelector('.btn-order-down')?.addEventListener('click', () => {
            reorder('down');
        }, { signal: ctx?.signal });
        rootEl.querySelector('.btn-order-bottom')?.addEventListener('click', () => {
            reorder('bottom');
        }, { signal: ctx?.signal });

        // 3. Keyboard Navigation
        const listUl = rootEl.querySelector<HTMLUListElement>('.p-orderlist-list');
        if (listUl) {
            listUl.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                    e.preventDefault();
                    navigateItems(e.key === 'ArrowDown' ? 1 : -1, e.shiftKey);
                } else if (e.key === ' ' || e.key === 'Enter') {
                    e.preventDefault();
                } else if (e.key === 'a' && (e.ctrlKey || e.metaKey)) {
                    e.preventDefault();
                    itemsList.forEach((it, idx) => selectedIds.add(getItemId(it, idx)));
                    updateSelectionUI();
                }
            }, { signal: ctx?.signal });
        }
    }

    function navigateItems(delta: number, isShift: boolean) {
        if (currentFilteredItems.length === 0) return;
        let lastSelectedIdx = currentFilteredItems.findIndex((it, idx) => selectedIds.has(getItemId(it, idx)));
        if (lastSelectedIdx === -1) lastSelectedIdx = delta > 0 ? -1 : currentFilteredItems.length;
        const targetIdx = Math.max(0, Math.min(currentFilteredItems.length - 1, lastSelectedIdx + delta));
        const targetId = getItemId(currentFilteredItems[targetIdx], targetIdx);
        lastFocusedId = targetId;

        if (!isShift) selectedIds.clear();
        selectedIds.add(targetId);

        const rootEl = container.firstElementChild as HTMLElement;
        const listUl = rootEl?.querySelector<HTMLUListElement>('.p-orderlist-list');

        if (virtualizer && virtualizer.isVirtual() && listUl) {
            if (targetIdx < currentStart || targetIdx > currentEnd) {
                virtualizer.scrollToIndex(targetIdx, 'auto');
                const newVirtualItems = virtualizer.getVirtualItems();
                if (newVirtualItems.length > 0) {
                    currentStart = newVirtualItems[0].index;
                    currentEnd = newVirtualItems[newVirtualItems.length - 1].index;
                    const newStartOffset = newVirtualItems[0].start;
                    const vList = listUl.querySelector<HTMLElement>('.p-virtual-list');
                    if (vList) {
                        vList.style.transform = `translateY(${newStartOffset}px)`;
                        const newNodes = newVirtualItems.map(vi => renderOrderItemHtml(currentFilteredItems[vi.index], vi.index, currentFilteredItems.length));
                        setHtml(vList, html`${newNodes}`);
                        bindItemClicks();
                    }
                }
            }
        }

        updateSelectionUI();

        const allRendered = Array.from(rootEl?.querySelectorAll<HTMLElement>('.p-orderlist-item') || []);
        const targetEl = rootEl?.querySelector<HTMLElement>(`.p-orderlist-item[data-id="${targetId}"]`);
        if (targetEl) {
            allRendered.forEach(el => el.setAttribute('tabindex', el === targetEl ? '0' : '-1'));
            targetEl.focus();
            targetEl.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        }
    }

    function reorder(direction: 'top' | 'up' | 'down' | 'bottom') {
        const rootEl = container.firstElementChild as HTMLElement;
        const listUl = rootEl?.querySelector<HTMLUListElement>('.p-orderlist-list');
        if (!listUl || selectedIds.size === 0 || itemsList.length < 2) return;

        if (direction === 'top') {
            const selected = itemsList.filter((it, idx) => selectedIds.has(getItemId(it, idx)));
            const remaining = itemsList.filter((it, idx) => !selectedIds.has(getItemId(it, idx)));
            itemsList.length = 0;
            itemsList.push(...selected, ...remaining);

            const selectedElements: HTMLElement[] = [];
            listUl.querySelectorAll<HTMLElement>('.p-orderlist-item').forEach(el => {
                const id = el.getAttribute('data-id');
                if (id && selectedIds.has(id)) selectedElements.push(el);
            });
            for (let i = selectedElements.length - 1; i >= 0; i--) {
                listUl.insertBefore(selectedElements[i], listUl.firstElementChild);
            }
        } else if (direction === 'bottom') {
            const selected = itemsList.filter((it, idx) => selectedIds.has(getItemId(it, idx)));
            const remaining = itemsList.filter((it, idx) => !selectedIds.has(getItemId(it, idx)));
            itemsList.length = 0;
            itemsList.push(...remaining, ...selected);

            const selectedElements: HTMLElement[] = [];
            listUl.querySelectorAll<HTMLElement>('.p-orderlist-item').forEach(el => {
                const id = el.getAttribute('data-id');
                if (id && selectedIds.has(id)) selectedElements.push(el);
            });
            selectedElements.forEach(el => listUl.appendChild(el));
        } else if (direction === 'up') {
            for (let i = 1; i < itemsList.length; i++) {
                const curId = getItemId(itemsList[i], i);
                const prevId = getItemId(itemsList[i - 1], i - 1);
                if (selectedIds.has(curId) && !selectedIds.has(prevId)) {
                    const temp = itemsList[i];
                    itemsList[i] = itemsList[i - 1];
                    itemsList[i - 1] = temp;

                    const curEl = listUl.querySelector<HTMLElement>(`.p-orderlist-item[data-id="${curId}"]`);
                    const prevEl = listUl.querySelector<HTMLElement>(`.p-orderlist-item[data-id="${prevId}"]`);
                    if (curEl && prevEl) {
                        listUl.insertBefore(curEl, prevEl);
                    }
                }
            }
        } else if (direction === 'down') {
            for (let i = itemsList.length - 2; i >= 0; i--) {
                const curId = getItemId(itemsList[i], i);
                const nextId = getItemId(itemsList[i + 1], i + 1);
                if (selectedIds.has(curId) && !selectedIds.has(nextId)) {
                    const temp = itemsList[i];
                    itemsList[i] = itemsList[i + 1];
                    itemsList[i + 1] = temp;

                    const curEl = listUl.querySelector<HTMLElement>(`.p-orderlist-item[data-id="${curId}"]`);
                    const nextEl = listUl.querySelector<HTMLElement>(`.p-orderlist-item[data-id="${nextId}"]`);
                    if (curEl && nextEl) {
                        listUl.insertBefore(nextEl, curEl);
                    }
                }
            }
        }

        // Update index numbers in-place
        listUl.querySelectorAll<HTMLElement>('.p-orderlist-item').forEach((el, idx) => {
            const idxSpan = el.querySelector('.p-orderlist-index');
            if (idxSpan) idxSpan.textContent = String(idx + 1);
        });

        // Scroll active item smoothly into view
        const activeSelectedEl = listUl.querySelector<HTMLElement>('.p-orderlist-item.p-highlight');
        if (activeSelectedEl) {
            activeSelectedEl.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        }

        updateButtons();
        syncValues('reorder');
    }

    function dispatchSelectionEvent() {
        emitComponentEvent(container, 'orderlist', 'selection-change', {
            selection: Array.from(selectedIds)
        });
    }

    function syncValues(action = 'change') {
        const values = itemsList.map((it, idx) => String(getItemId(it, idx)));
        formField.setValue(values);

        emitComponentEvent(container, 'orderlist', 'change', {
            value: itemsList,
            action
        });
    }

    buildShell();
    syncValues();
}
