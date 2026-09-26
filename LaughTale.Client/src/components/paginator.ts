import { resolvePart, applyPart, type PassthroughRecord } from '../runtime/parts';
import type { IslandContext } from '../runtime/registry';
﻿/**
 * LaughTale: Enterprise Paginator Component (Aura Design System compliant)
 * Rich pagination bar with customizable templates, rows per page dropdown,
 * current page reports, jump-to-page controls, slider scrubbers, and image gallery paging.
 */

import { injectIslandStyle } from '../runtime/styles';
import { emitComponentEvent } from '../runtime/events';
import { html, setHtml, url as safeUrl, unsafe, attr, type Raw } from '../runtime/html';
import type { PatternDeclaration } from '../accessibility/patterns';
import { useFormField } from '../composables/useFormField';
import { getLucideIcon } from '../icons/lucide';

export const a11y: PatternDeclaration = {
    kind: 'native',
    element: 'button'
};

export interface PaginatorProps {
    name?: string;
    totalRecords: number;
    rows?: number;
    first?: number;
    pageLinkSize?: number;
    rowsPerPageOptions?: number[];
    template?: string;
    currentPageReportTemplate?: string;
    showFirstLast?: boolean;
    showJumpToPageDropdown?: boolean;
    showJumpToPageInput?: boolean;
    showSlider?: boolean;
    compact?: boolean;
    targetInputName?: string;
    targetSelector?: string;
    images?: string[];
    pt?: PassthroughRecord;
    studioOverrides?: Record<string, any>;
}

const PAGINATOR_CSS = `
.p-paginator {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    gap: 0.35rem;
    padding: 0.5rem 1rem;
    background: var(--p-content-bg, var(--p-surface-0, #ffffff));
    border-radius: var(--p-border-radius-lg, var(--lt-radius-lg, 0.75rem));
    border: 1px solid var(--p-content-border, var(--p-border-color, var(--lt-surface-200)));
    color: var(--p-text-color, var(--lt-surface-700));
    font-family: var(--p-font-family, inherit);
    user-select: none;
    transition: all 0.15s ease;
}

.p-paginator .p-paginator-start,
.p-paginator .p-paginator-end {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
}

.p-paginator .p-paginator-first,
.p-paginator .p-paginator-prev,
.p-paginator .p-paginator-next,
.p-paginator .p-paginator-last,
.p-paginator .p-paginator-page,
.p-paginator .p-paginator-action-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2.25rem;
    height: 2.25rem;
    min-width: 2.25rem;
    border-radius: 9999px;
    border: 1px solid transparent;
    background: transparent;
    color: var(--p-text-muted, var(--lt-surface-600));
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.15s ease, color 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease;
    outline: none;
    box-sizing: border-box;
    padding: 0;
}

.p-paginator .p-paginator-page:hover:not(:disabled):not(.p-highlight):not(.p-paginator-page-selected),
.p-paginator .p-paginator-first:hover:not(:disabled),
.p-paginator .p-paginator-prev:hover:not(:disabled),
.p-paginator .p-paginator-next:hover:not(:disabled),
.p-paginator .p-paginator-last:hover:not(:disabled),
.p-paginator .p-paginator-action-btn:hover:not(:disabled) {
    background: var(--p-content-hover-bg, var(--p-surface-100, #f1f5f9));
    color: var(--p-text-color, var(--lt-surface-900));
}

.p-paginator .p-paginator-page:focus-visible,
.p-paginator .p-paginator-first:focus-visible,
.p-paginator .p-paginator-prev:focus-visible,
.p-paginator .p-paginator-next:focus-visible,
.p-paginator .p-paginator-last:focus-visible,
.p-paginator .p-paginator-action-btn:focus-visible {
    box-shadow: 0 0 0 1px var(--p-surface-0, #ffffff), 0 0 0 3px var(--p-primary-color, var(--lt-primary-500, #10b981)) !important;
}

.p-paginator .p-paginator-page.p-highlight,
.p-paginator .p-paginator-page.p-paginator-page-selected,
.p-paginator .p-paginator-page.p-paginator-page-active {
    background: var(--p-primary-color, var(--lt-primary-500, #10b981)) !important;
    color: var(--p-primary-contrast-color, #ffffff) !important;
    font-weight: 700;
}

.p-paginator .p-paginator-page.p-highlight:hover,
.p-paginator .p-paginator-page.p-paginator-page-selected:hover,
.p-paginator .p-paginator-page.p-paginator-page-active:hover {
    background: var(--p-primary-hover-color, var(--lt-primary-600, #059669)) !important;
    color: var(--p-primary-contrast-color, #ffffff) !important;
}

.p-paginator .p-paginator-first:disabled,
.p-paginator .p-paginator-prev:disabled,
.p-paginator .p-paginator-next:disabled,
.p-paginator .p-paginator-last:disabled,
.p-paginator .p-paginator-page:disabled,
.p-paginator .p-paginator-action-btn:disabled {
    opacity: 0.35;
    cursor: default;
}

.p-paginator .p-paginator-pages {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
}

.p-paginator .p-paginator-current {
    font-size: 0.875rem;
    color: var(--p-text-muted, var(--lt-surface-500));
    padding: 0 0.75rem;
    white-space: nowrap;
}

.p-paginator .p-paginator-rpp-select,
.p-paginator .p-paginator-jtp-select {
    appearance: none;
    padding: 0.35rem 2rem 0.35rem 0.75rem;
    border-radius: var(--p-border-radius, var(--lt-radius, 0.5rem));
    border: 1px solid var(--p-border-color, var(--lt-surface-300));
    background: var(--p-surface-0, #ffffff) url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E") no-repeat right 0.6rem center;
    color: var(--p-text-color, var(--lt-surface-800));
    font-size: 0.875rem;
    font-weight: 500;
    outline: none;
    cursor: pointer;
    transition: border-color 0.15s ease, box-shadow 0.15s ease;
}
.p-paginator .p-paginator-rpp-select:focus,
.p-paginator .p-paginator-jtp-select:focus,
.p-paginator .p-paginator-jtp-input:focus {
    border-color: var(--p-primary-color, var(--lt-primary-500, #10b981)) !important;
    box-shadow: 0 0 0 1px var(--p-primary-color, var(--lt-primary-500, #10b981)) !important;
}

.p-paginator .p-paginator-jtp-container {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.875rem;
    color: var(--p-text-muted, var(--lt-surface-600));
    padding: 0 0.5rem;
}

.p-paginator .p-paginator-jtp-input {
    width: 3.5rem;
    padding: 0.35rem 0.5rem;
    text-align: center;
    border-radius: var(--p-border-radius, var(--lt-radius, 0.5rem));
    border: 1px solid var(--p-border-color, var(--lt-surface-300));
    background: var(--p-surface-0, #ffffff);
    color: var(--p-text-color, inherit);
    font-size: 0.875rem;
    outline: none;
    transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.p-paginator .p-paginator-slider {
    width: 8rem;
    accent-color: var(--p-primary-color, var(--lt-primary-500, #10b981));
    cursor: pointer;
}

/* Image gallery container */
.p-paginator-wrapper .p-paginator-image-display {
    width: 100%;
    margin-top: 1.25rem;
    display: flex;
    justify-content: center;
}
.p-paginator-wrapper .p-paginator-image-card {
    width: 100%;
    max-width: 36rem;
    height: 20rem;
    border-radius: var(--p-border-radius-lg, var(--lt-radius-lg));
    overflow: hidden;
    box-shadow: var(--p-shadow-md, 0 4px 6px -1px rgba(0, 0, 0, 0.08));
    background: var(--p-surface-100, var(--lt-surface-100));
    border: 1px solid var(--p-border-color, var(--lt-surface-200));
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
}
.p-paginator-wrapper .p-paginator-image-card img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: opacity 0.2s ease;
}

/* Dark Mode Overrides */
html.dark .p-paginator,
[data-theme="dark"] .p-paginator,
.dark .p-paginator {
    background: var(--p-surface-0) !important;
    border-color: var(--p-border-color) !important;
    color: var(--p-text-color) !important;
}
html.dark .p-paginator .p-paginator-page,
html.dark .p-paginator .p-paginator-first,
html.dark .p-paginator .p-paginator-prev,
html.dark .p-paginator .p-paginator-next,
html.dark .p-paginator .p-paginator-last,
html.dark .p-paginator .p-paginator-action-btn,
[data-theme="dark"] .p-paginator .p-paginator-page,
[data-theme="dark"] .p-paginator .p-paginator-first,
[data-theme="dark"] .p-paginator .p-paginator-prev,
[data-theme="dark"] .p-paginator .p-paginator-next,
[data-theme="dark"] .p-paginator .p-paginator-last,
[data-theme="dark"] .p-paginator .p-paginator-action-btn,
.dark .p-paginator .p-paginator-page,
.dark .p-paginator .p-paginator-first,
.dark .p-paginator .p-paginator-prev,
.dark .p-paginator .p-paginator-next,
.dark .p-paginator .p-paginator-last,
.dark .p-paginator .p-paginator-action-btn {
    color: var(--p-text-muted) !important;
}
html.dark .p-paginator .p-paginator-page:hover:not(:disabled):not(.p-highlight):not(.p-paginator-page-selected),
html.dark .p-paginator .p-paginator-first:hover:not(:disabled),
html.dark .p-paginator .p-paginator-prev:hover:not(:disabled),
html.dark .p-paginator .p-paginator-next:hover:not(:disabled),
html.dark .p-paginator .p-paginator-last:hover:not(:disabled),
html.dark .p-paginator .p-paginator-action-btn:hover:not(:disabled),
[data-theme="dark"] .p-paginator .p-paginator-page:hover:not(:disabled):not(.p-highlight):not(.p-paginator-page-selected),
[data-theme="dark"] .p-paginator .p-paginator-first:hover:not(:disabled),
[data-theme="dark"] .p-paginator .p-paginator-prev:hover:not(:disabled),
[data-theme="dark"] .p-paginator .p-paginator-next:hover:not(:disabled),
[data-theme="dark"] .p-paginator .p-paginator-last:hover:not(:disabled),
[data-theme="dark"] .p-paginator .p-paginator-action-btn:hover:not(:disabled),
.dark .p-paginator .p-paginator-page:hover:not(:disabled):not(.p-highlight):not(.p-paginator-page-selected),
.dark .p-paginator .p-paginator-first:hover:not(:disabled),
.dark .p-paginator .p-paginator-prev:hover:not(:disabled),
.dark .p-paginator .p-paginator-next:hover:not(:disabled),
.dark .p-paginator .p-paginator-last:hover:not(:disabled),
.dark .p-paginator .p-paginator-action-btn:hover:not(:disabled) {
    background: var(--p-surface-100) !important;
    color: var(--p-text-color) !important;
}
html.dark .p-paginator .p-paginator-page.p-highlight,
html.dark .p-paginator .p-paginator-page.p-paginator-page-selected,
[data-theme="dark"] .p-paginator .p-paginator-page.p-highlight,
[data-theme="dark"] .p-paginator .p-paginator-page.p-paginator-page-selected,
.dark .p-paginator .p-paginator-page.p-highlight,
.dark .p-paginator .p-paginator-page.p-paginator-page-selected {
    background: var(--p-primary-color, var(--lt-primary-500, #10b981)) !important;
    color: var(--p-primary-contrast-color, #ffffff) !important;
}
html.dark .p-paginator .p-paginator-page.p-highlight:hover,
html.dark .p-paginator .p-paginator-page.p-paginator-page-selected:hover,
[data-theme="dark"] .p-paginator .p-paginator-page.p-highlight:hover,
[data-theme="dark"] .p-paginator .p-paginator-page.p-paginator-page-selected:hover,
.dark .p-paginator .p-paginator-page.p-highlight:hover,
.dark .p-paginator .p-paginator-page.p-paginator-page-selected:hover {
    background: var(--p-primary-hover-color, var(--lt-primary-600, #059669)) !important;
    color: var(--p-primary-contrast-color, #ffffff) !important;
}
html.dark .p-paginator .p-paginator-rpp-select,
html.dark .p-paginator .p-paginator-jtp-select,
html.dark .p-paginator .p-paginator-jtp-input,
[data-theme="dark"] .p-paginator .p-paginator-rpp-select,
[data-theme="dark"] .p-paginator .p-paginator-jtp-select,
[data-theme="dark"] .p-paginator .p-paginator-jtp-input,
.dark .p-paginator .p-paginator-rpp-select,
.dark .p-paginator .p-paginator-jtp-select,
.dark .p-paginator .p-paginator-jtp-input {
    background-color: var(--p-surface-100) !important;
    border-color: var(--p-border-color) !important;
    color: var(--p-text-color) !important;
}
html.dark .p-paginator .p-paginator-current,
html.dark .p-paginator .p-paginator-jtp-container,
[data-theme="dark"] .p-paginator .p-paginator-current,
[data-theme="dark"] .p-paginator .p-paginator-jtp-container,
.dark .p-paginator .p-paginator-current,
.dark .p-paginator .p-paginator-jtp-container {
    color: var(--p-text-muted) !important;
}
html.dark .p-paginator-wrapper .p-paginator-image-card,
[data-theme="dark"] .p-paginator-wrapper .p-paginator-image-card,
.dark .p-paginator-wrapper .p-paginator-image-card {
    background: var(--p-surface-100) !important;
    border-color: var(--p-border-color) !important;
}
`;

const ICONS = {
    first: getLucideIcon('chevrons-left', 14, 2.5),
    prev: getLucideIcon('chevron-left', 14, 2.5),
    next: getLucideIcon('chevron-right', 14, 2.5),
    last: getLucideIcon('chevrons-right', 14, 2.5),
    // Matches lucide's "refresh-ccw" (counter-clockwise arrow direction), not "refresh-cw".
    refresh: getLucideIcon('refresh-ccw', 14, 2),
    // Classic pre-redesign 8-tooth gear + circle — same "settings" icon family as lucide's
    // current settings.svg (circle r=3 plus a gear-tooth outline), just with rounded-notch
    // curves instead of straight 1.65-radius notches.
    settings: getLucideIcon('settings', 14, 2)
};

// Scenic nature images with reliable fallback
const DEFAULT_IMAGES = [
    '/images/nature/nature1.jpg',
    '/images/nature/nature2.jpg',
    '/images/nature/nature3.jpg',
    '/images/nature/nature4.jpg',
    '/images/nature/nature5.jpg',
    '/images/nature/nature6.jpg'
];

export default function PaginatorIsland(container: HTMLElement, props: PaginatorProps, ctx?: IslandContext) {
    injectIslandStyle('paginator', PAGINATOR_CSS);

    const formField = useFormField(container, ctx, {
        cardinality: 'Single',
        name: props.name || props.targetInputName
    });

    const initialFieldVal = formField.getValue();
    let first = props.first !== undefined ? props.first : (initialFieldVal !== undefined && initialFieldVal !== '' ? parseInt(initialFieldVal, 10) : 0);
    if (isNaN(first)) first = 0;

    let rows = props.rows || 10;
    let totalRecords = props.totalRecords || 0;
    const pageLinkSize = props.pageLinkSize || 5;
    const rowsPerPageOptions = props.rowsPerPageOptions;
    const template = props.template;
    const currentPageReportTemplate = props.currentPageReportTemplate || 'Showing {first} to {last} of {totalRecords}';
    const showFirstLast = props.showFirstLast !== false;
    const showJumpToPageDropdown = !!props.showJumpToPageDropdown;
    const showJumpToPageInput = !!props.showJumpToPageInput;
    const showSlider = !!props.showSlider;
    const images = (props.images && props.images.length > 0) ? props.images : (props.totalRecords === 6 && rows === 1 ? DEFAULT_IMAGES : []);

    function getTotalPages(): number {
        return Math.ceil(totalRecords / rows) || 1;
    }

    function getCurrentPage(): number {
        return Math.floor(first / rows);
    }

    function setPage(pageIndex: number) {
        const totalPages = getTotalPages();
        const clampedPage = Math.max(0, Math.min(pageIndex, totalPages - 1));
        const newFirst = clampedPage * rows;

        if (newFirst !== first) {
            first = newFirst;
            render();
            dispatchEvents();
        }
    }

    function setRows(newRows: number) {
        rows = newRows;
        first = 0; // Reset to page 0 on rows per page change
        render();
        dispatchEvents();
    }

    function formatReportText(): string {
        const totalPages = getTotalPages();
        const currentPage = getCurrentPage() + 1;
        const firstRecord = totalRecords > 0 ? first + 1 : 0;
        const lastRecord = Math.min(first + rows, totalRecords);

        return currentPageReportTemplate
            .replace(/{currentPage}/g, String(currentPage))
            .replace(/{totalPages}/g, String(totalPages))
            .replace(/{rows}/g, String(rows))
            .replace(/{first}/g, String(firstRecord))
            .replace(/{last}/g, String(lastRecord))
            .replace(/{totalRecords}/g, String(totalRecords));
    }

    function render() {
        const totalPages = getTotalPages();
        const currentPage = getCurrentPage();
        const isFirstPage = currentPage === 0;
        const isLastPage = currentPage >= totalPages - 1;

        // Calculate sliding window of page links
        let startPage = Math.max(0, currentPage - Math.floor(pageLinkSize / 2));
        let endPage = Math.min(totalPages - 1, startPage + pageLinkSize - 1);
        if (endPage - startPage + 1 < pageLinkSize) {
            startPage = Math.max(0, endPage - pageLinkSize + 1);
        }

        const pageButtons: Raw[] = [];
        for (let p = startPage; p <= endPage; p++) {
            const isSelected = p === currentPage;
            pageButtons.push(html`
                <button type="button" 
                        class="p-paginator-page ${isSelected ? 'p-highlight' : ''}" data-part="root" 
                        data-page="${p}" 
                        aria-label="Page ${p + 1}" 
                        aria-current="${isSelected ? 'page' : undefined}">
                    ${p + 1}
                </button>
            `);
        }

        // Nav Links
        const firstBtnHtml = showFirstLast ? html`
            <button type="button" class="p-paginator-first" data-action="first" title="First Page" aria-label="First Page" ${attr('disabled', isFirstPage)}>
                ${unsafe(ICONS.first)}
            </button>
        ` : '';

        const prevBtnHtml = html`
            <button type="button" class="p-paginator-prev" data-action="prev" title="Previous Page" aria-label="Previous Page" ${attr('disabled', isFirstPage)}>
                ${unsafe(ICONS.prev)}
            </button>
        `;

        const nextBtnHtml = html`
            <button type="button" class="p-paginator-next" data-action="next" title="Next Page" aria-label="Next Page" ${attr('disabled', isLastPage)}>
                ${unsafe(ICONS.next)}
            </button>
        `;

        const lastBtnHtml = showFirstLast ? html`
            <button type="button" class="p-paginator-last" data-action="last" title="Last Page" aria-label="Last Page" ${attr('disabled', isLastPage)}>
                ${unsafe(ICONS.last)}
            </button>
        ` : '';

        // Rows Per Page Dropdown
        let rppHtml: Raw | '' = '';
        if (rowsPerPageOptions && rowsPerPageOptions.length > 0) {
            const optionsHtml = rowsPerPageOptions.map(opt => html`
                <option value="${opt}" ${attr('selected', opt === rows)}>${opt}</option>
            `);
            rppHtml = html`<select class="p-paginator-rpp-select" aria-label="Rows per page">${optionsHtml}</select>`;
        }

        // Jump to Page Dropdown
        let jtpDropdownHtml: Raw | '' = '';
        if (showJumpToPageDropdown) {
            const jtpOptions = Array.from({ length: totalPages }, (_, i) => html`
                <option value="${i}" ${attr('selected', i === currentPage)}>${i + 1}</option>
            `);
            jtpDropdownHtml = html`
                <div class="p-paginator-jtp-container">
                    <span>Jump to page:</span>
                    <select class="p-paginator-jtp-select" aria-label="Jump to page">${jtpOptions}</select>
                    <span>of ${totalPages}</span>
                </div>
            `;
        }

        // Jump to Page Input
        let jtpInputHtml: Raw | '' = '';
        if (showJumpToPageInput) {
            jtpInputHtml = html`
                <div class="p-paginator-jtp-container">
                    <span>Go to:</span>
                    <input type="number" class="p-paginator-jtp-input" min="1" max="${totalPages}" value="${currentPage + 1}" />
                    <span>/ ${totalPages}</span>
                </div>
            `;
        }

        // Slider
        let sliderHtml: Raw | '' = '';
        if (showSlider) {
            sliderHtml = html`
                <div class="p-paginator-jtp-container">
                    <input type="range" class="p-paginator-slider" min="0" max="${totalPages - 1}" value="${currentPage}" />
                </div>
            `;
        }

        // Current Page Report
        const reportHtml = props.currentPageReportTemplate ? html`
            <span class="p-paginator-current">${formatReportText()}</span>
        ` : '';

        // Custom template parsing or standard layout
        let elementsHtml: Raw | (Raw | '')[];

        if (template) {
            const tokens = template.split(/\s+/);
            const renderedTokens = tokens.map(token => {
                switch (token) {
                    case 'FirstPageLink': return firstBtnHtml;
                    case 'PrevPageLink': return prevBtnHtml;
                    case 'PageLinks': return html`<div class="p-paginator-pages">${pageButtons}</div>`;
                    case 'NextPageLink': return nextBtnHtml;
                    case 'LastPageLink': return lastBtnHtml;
                    case 'RowsPerPageDropdown': return rppHtml;
                    case 'CurrentPageReport': return reportHtml;
                    case 'JumpToPageDropdown': return jtpDropdownHtml;
                    case 'JumpToPageInput': return jtpInputHtml;
                    case 'Slider': return sliderHtml;
                    default: return '';
                }
            });
            elementsHtml = renderedTokens;
        } else {
            elementsHtml = html`
                ${firstBtnHtml}
                ${prevBtnHtml}
                <div class="p-paginator-pages">${pageButtons}</div>
                ${nextBtnHtml}
                ${lastBtnHtml}
                ${rppHtml}
                ${jtpDropdownHtml}
                ${jtpInputHtml}
                ${sliderHtml}
                ${reportHtml}
            `;
        }

        // Images preview card (if images are provided)
        let imageDisplayHtml: Raw | '' = '';
        if (images.length > 0) {
            const currentImg = images[currentPage % images.length];
            imageDisplayHtml = html`
                <div class="p-paginator-image-display">
                    <div class="p-paginator-image-card">
                        <img src="${safeUrl(currentImg)}" alt="Nature ${currentPage + 1}" loading="eager" />
                    </div>
                </div>
            `;
        }

        formField.detach();
        setHtml(container, html`
            <div class="p-paginator-wrapper" style="width: 100%;">
                <div class="p-paginator p-component" role="navigation" aria-label="Pagination Navigation">
                    ${elementsHtml}
                </div>
                ${imageDisplayHtml}
            </div>
        `);
        formField.reattach();

        bindEvents();
    }

    function bindEvents() {
        const rootEl = container.firstElementChild as HTMLElement;
        if (!rootEl) return;

        // 1. First / Prev / Next / Last Nav
        rootEl.querySelector('[data-action="first"]')?.addEventListener('click', () => setPage(0), { signal: ctx?.signal });
        rootEl.querySelector('[data-action="prev"]')?.addEventListener('click', () => setPage(getCurrentPage() - 1), { signal: ctx?.signal });
        rootEl.querySelector('[data-action="next"]')?.addEventListener('click', () => setPage(getCurrentPage() + 1), { signal: ctx?.signal });
        rootEl.querySelector('[data-action="last"]')?.addEventListener('click', () => setPage(getTotalPages() - 1), { signal: ctx?.signal });

        // 2. Page Link Buttons
        rootEl.querySelectorAll<HTMLButtonElement>('.p-paginator-page').forEach(btn => {
            btn.addEventListener('click', () => {
                const p = parseInt(btn.getAttribute('data-page') || '0', 10);
                setPage(p);
            }, { signal: ctx?.signal });
        });

        // 3. Rows Per Page Select
        const rppSelect = rootEl.querySelector<HTMLSelectElement>('.p-paginator-rpp-select');
        if (rppSelect) {
            rppSelect.addEventListener('change', (e) => {
                const val = parseInt((e.target as HTMLSelectElement).value, 10);
                if (!isNaN(val)) setRows(val);
            }, { signal: ctx?.signal });
        }

        // 4. Jump To Page Select
        const jtpSelect = rootEl.querySelector<HTMLSelectElement>('.p-paginator-jtp-select');
        if (jtpSelect) {
            jtpSelect.addEventListener('change', (e) => {
                const val = parseInt((e.target as HTMLSelectElement).value, 10);
                if (!isNaN(val)) setPage(val);
            }, { signal: ctx?.signal });
        }

        // 5. Jump To Page Input
        const jtpInput = rootEl.querySelector<HTMLInputElement>('.p-paginator-jtp-input');
        if (jtpInput) {
            jtpInput.addEventListener('change', (e) => {
                const val = parseInt((e.target as HTMLInputElement).value, 10);
                if (!isNaN(val)) setPage(val - 1);
            }, { signal: ctx?.signal });
        }

        // 6. Slider
        const slider = rootEl.querySelector<HTMLInputElement>('.p-paginator-slider');
        if (slider) {
            slider.addEventListener('input', (e) => {
                const val = parseInt((e.target as HTMLInputElement).value, 10);
                if (!isNaN(val)) setPage(val);
            }, { signal: ctx?.signal });
        }
    }

    function dispatchEvents() {
        const page = getCurrentPage();
        emitComponentEvent(container, 'paginator', 'page-change', {
            first,
            rows,
            page,
            pageCount: getTotalPages()
        });

        formField.setValue(String(first));
    }

    render();
    dispatchEvents();
}
