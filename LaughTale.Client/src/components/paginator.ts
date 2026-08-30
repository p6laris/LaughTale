import { resolvePart, applyPart, type PassthroughRecord } from '../runtime/parts';
import type { IslandContext } from '../runtime/registry';
﻿/**
 * LaughTale: Enterprise Paginator Component (Aura Design System compliant)
 * Rich pagination bar with customizable templates, rows per page dropdown,
 * current page reports, jump-to-page controls, slider scrubbers, and image gallery paging.
 */

import { injectIslandStyle } from '../runtime/styles';

export interface PaginatorProps {
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
    background: var(--p-surface-0, #ffffff);
    border-radius: var(--p-border-radius-lg, 8px);
    border: 1px solid var(--p-surface-200, #e2e8f0);
    color: var(--p-surface-700, #334155);
    font-family: var(--p-font-family, inherit);
    user-select: none;
    transition: all 0.15s ease;
}

.p-paginator-start,
.p-paginator-end {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
}

.p-paginator-first,
.p-paginator-prev,
.p-paginator-next,
.p-paginator-last,
.p-paginator-page,
.p-paginator-action-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2.25rem;
    height: 2.25rem;
    min-width: 2.25rem;
    border-radius: 9999px;
    border: 1px solid transparent;
    background: transparent;
    color: var(--p-surface-600, #475569);
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.12s ease, color 0.12s ease, border-color 0.12s ease;
    outline: none;
    box-sizing: border-box;
    padding: 0;
}

.p-paginator-page:hover:not(:disabled):not(.p-highlight),
.p-paginator-first:hover:not(:disabled),
.p-paginator-prev:hover:not(:disabled),
.p-paginator-next:hover:not(:disabled),
.p-paginator-last:hover:not(:disabled),
.p-paginator-action-btn:hover:not(:disabled) {
    background: var(--p-surface-100, #f1f5f9);
    color: var(--p-surface-900, #0f172a);
}

.p-paginator-page.p-highlight,
.p-paginator-page.p-paginator-page-selected {
    background: var(--p-surface-900, #0f172a) !important;
    color: var(--lt-surface-0, #ffffff) !important;
    font-weight: 600;
}

.p-paginator-first:disabled,
.p-paginator-prev:disabled,
.p-paginator-next:disabled,
.p-paginator-last:disabled,
.p-paginator-page:disabled,
.p-paginator-action-btn:disabled {
    opacity: 0.3;
    cursor: default;
}

.p-paginator-pages {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
}

.p-paginator-current {
    font-size: 0.875rem;
    color: var(--p-surface-500, #64748b);
    padding: 0 0.75rem;
    white-space: nowrap;
}

.p-paginator-rpp-select,
.p-paginator-jtp-select {
    appearance: none;
    padding: 0.35rem 2rem 0.35rem 0.75rem;
    border-radius: var(--p-border-radius, 6px);
    border: 1px solid var(--p-surface-300, #cbd5e1);
    background: var(--p-surface-0, #ffffff) url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E") no-repeat right 0.6rem center;
    color: var(--p-surface-800, #1e293b);
    font-size: 0.875rem;
    font-weight: 500;
    outline: none;
    cursor: pointer;
    transition: border-color 0.15s ease;
}
.p-paginator-rpp-select:focus,
.p-paginator-jtp-select:focus,
.p-paginator-jtp-input:focus {
    border-color: var(--p-primary-500, #10b981);
}

.p-paginator-jtp-container {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.875rem;
    color: var(--p-surface-600, #475569);
    padding: 0 0.5rem;
}

.p-paginator-jtp-input {
    width: 3.5rem;
    padding: 0.35rem 0.5rem;
    text-align: center;
    border-radius: var(--p-border-radius, 6px);
    border: 1px solid var(--p-surface-300, #cbd5e1);
    background: var(--p-surface-0, #ffffff);
    color: inherit;
    font-size: 0.875rem;
    outline: none;
}

.p-paginator-slider {
    width: 8rem;
    accent-color: var(--p-primary-500, #10b981);
    cursor: pointer;
}

/* Image gallery container */
.p-paginator-image-display {
    width: 100%;
    margin-top: 1.25rem;
    display: flex;
    justify-content: center;
}
.p-paginator-image-card {
    width: 100%;
    max-width: 36rem;
    height: 20rem;
    border-radius: var(--p-border-radius-lg, 8px);
    overflow: hidden;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -2px rgba(0, 0, 0, 0.05);
    background: var(--p-surface-100, #f1f5f9);
    border: 1px solid var(--p-surface-200, #e2e8f0);
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
}
.p-paginator-image-card img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: opacity 0.2s ease;
}

/* Dark Mode Tokens */
.dark .p-paginator,
[data-theme="dark"] .p-paginator {
    background: var(--p-surface-900, #0f172a) !important;
    border-color: var(--p-surface-700, #334155) !important;
    color: var(--p-surface-200, #e2e8f0) !important;
}
.dark .p-paginator-page,
.dark .p-paginator-first,
.dark .p-paginator-prev,
.dark .p-paginator-next,
.dark .p-paginator-last,
.dark .p-paginator-action-btn,
[data-theme="dark"] .p-paginator-page,
[data-theme="dark"] .p-paginator-first,
[data-theme="dark"] .p-paginator-prev,
[data-theme="dark"] .p-paginator-next,
[data-theme="dark"] .p-paginator-last,
[data-theme="dark"] .p-paginator-action-btn {
    color: var(--p-surface-300, #cbd5e1) !important;
}
.dark .p-paginator-page:hover:not(:disabled):not(.p-highlight),
.dark .p-paginator-first:hover:not(:disabled),
.dark .p-paginator-prev:hover:not(:disabled),
.dark .p-paginator-next:hover:not(:disabled),
.dark .p-paginator-last:hover:not(:disabled),
.dark .p-paginator-action-btn:hover:not(:disabled),
[data-theme="dark"] .p-paginator-page:hover:not(:disabled):not(.p-highlight),
[data-theme="dark"] .p-paginator-first:hover:not(:disabled),
[data-theme="dark"] .p-paginator-prev:hover:not(:disabled),
[data-theme="dark"] .p-paginator-next:hover:not(:disabled),
[data-theme="dark"] .p-paginator-last:hover:not(:disabled),
[data-theme="dark"] .p-paginator-action-btn:hover:not(:disabled) {
    background: var(--p-surface-800, #1e293b) !important;
    color: var(--lt-surface-0, #ffffff) !important;
}
.dark .p-paginator-page.p-highlight,
[data-theme="dark"] .p-paginator-page.p-highlight {
    background: var(--p-surface-0, #ffffff) !important;
    color: var(--p-surface-900, #0f172a) !important;
}
.dark .p-paginator-rpp-select,
.dark .p-paginator-jtp-select,
.dark .p-paginator-jtp-input,
[data-theme="dark"] .p-paginator-rpp-select,
[data-theme="dark"] .p-paginator-jtp-select,
[data-theme="dark"] .p-paginator-jtp-input {
    background-color: var(--p-surface-800, #1e293b) !important;
    border-color: var(--p-surface-600, #475569) !important;
    color: var(--lt-surface-0, #ffffff) !important;
}
.dark .p-paginator-current,
.dark .p-paginator-jtp-container,
[data-theme="dark"] .p-paginator-current,
[data-theme="dark"] .p-paginator-jtp-container {
    color: var(--p-surface-400, #94a3b8) !important;
}
.dark .p-paginator-image-card,
[data-theme="dark"] .p-paginator-image-card {
    background: var(--p-surface-800, #1e293b) !important;
    border-color: var(--p-surface-700, #334155) !important;
}
`;

const ICONS = {
    first: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m11 17-5-5 5-5"/><path d="m18 17-5-5 5-5"/></svg>',
    prev: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>',
    next: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>',
    last: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m6 17 5-5-5-5"/><path d="m13 17 5-5-5-5"/></svg>',
    refresh: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 16h5v5"/></svg>',
    settings: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>'
};

// Scenic nature images with reliable fallback
const DEFAULT_IMAGES = [
    'https://primefaces.org/cdn/primevue/images/nature/nature1.jpg',
    'https://primefaces.org/cdn/primevue/images/nature/nature2.jpg',
    'https://primefaces.org/cdn/primevue/images/nature/nature3.jpg',
    'https://primefaces.org/cdn/primevue/images/nature/nature4.jpg',
    'https://primefaces.org/cdn/primevue/images/nature/nature5.jpg',
    'https://primefaces.org/cdn/primevue/images/nature/nature6.jpg'
];

export default function PaginatorIsland(container: HTMLElement, props: PaginatorProps, ctx?: IslandContext) {
    injectIslandStyle('paginator', PAGINATOR_CSS);

    let first = props.first || 0;
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

        const pageButtons: string[] = [];
        for (let p = startPage; p <= endPage; p++) {
            const isSelected = p === currentPage;
            pageButtons.push(`
                <button type="button" 
                        class="p-paginator-page ${isSelected ? 'p-highlight' : ''}" 
                        data-page="${p}" 
                        aria-label="Page ${p + 1}" 
                        aria-current="${isSelected ? 'page' : undefined}">
                    ${p + 1}
                </button>
            `);
        }

        // Nav Links
        const firstBtnHtml = showFirstLast ? `
            <button type="button" class="p-paginator-first" data-action="first" title="First Page" aria-label="First Page" ${isFirstPage ? 'disabled' : ''}>
                ${ICONS.first}
            </button>
        ` : '';

        const prevBtnHtml = `
            <button type="button" class="p-paginator-prev" data-action="prev" title="Previous Page" aria-label="Previous Page" ${isFirstPage ? 'disabled' : ''}>
                ${ICONS.prev}
            </button>
        `;

        const nextBtnHtml = `
            <button type="button" class="p-paginator-next" data-action="next" title="Next Page" aria-label="Next Page" ${isLastPage ? 'disabled' : ''}>
                ${ICONS.next}
            </button>
        `;

        const lastBtnHtml = showFirstLast ? `
            <button type="button" class="p-paginator-last" data-action="last" title="Last Page" aria-label="Last Page" ${isLastPage ? 'disabled' : ''}>
                ${ICONS.last}
            </button>
        ` : '';

        // Rows Per Page Dropdown
        let rppHtml = '';
        if (rowsPerPageOptions && rowsPerPageOptions.length > 0) {
            const optionsHtml = rowsPerPageOptions.map(opt => `
                <option value="${opt}" ${opt === rows ? 'selected' : ''}>${opt}</option>
            `).join('');
            rppHtml = `<select class="p-paginator-rpp-select" aria-label="Rows per page">${optionsHtml}</select>`;
        }

        // Jump to Page Dropdown
        let jtpDropdownHtml = '';
        if (showJumpToPageDropdown) {
            const jtpOptions = Array.from({ length: totalPages }, (_, i) => `
                <option value="${i}" ${i === currentPage ? 'selected' : ''}>${i + 1}</option>
            `).join('');
            jtpDropdownHtml = `
                <div class="p-paginator-jtp-container">
                    <span>Jump to page:</span>
                    <select class="p-paginator-jtp-select">${jtpOptions}</select>
                    <span>of ${totalPages}</span>
                </div>
            `;
        }

        // Jump to Page Input
        let jtpInputHtml = '';
        if (showJumpToPageInput) {
            jtpInputHtml = `
                <div class="p-paginator-jtp-container">
                    <span>Go to:</span>
                    <input type="number" class="p-paginator-jtp-input" min="1" max="${totalPages}" value="${currentPage + 1}" />
                    <span>/ ${totalPages}</span>
                </div>
            `;
        }

        // Slider
        let sliderHtml = '';
        if (showSlider) {
            sliderHtml = `
                <div class="p-paginator-jtp-container">
                    <input type="range" class="p-paginator-slider" min="0" max="${totalPages - 1}" value="${currentPage}" />
                </div>
            `;
        }

        // Current Page Report
        const reportHtml = props.currentPageReportTemplate ? `
            <span class="p-paginator-current">${formatReportText()}</span>
        ` : '';

        // Custom template parsing or standard layout
        let elementsHtml = '';

        if (template) {
            const tokens = template.split(/\s+/);
            const renderedTokens = tokens.map(token => {
                switch (token) {
                    case 'FirstPageLink': return firstBtnHtml;
                    case 'PrevPageLink': return prevBtnHtml;
                    case 'PageLinks': return `<div class="p-paginator-pages">${pageButtons.join('')}</div>`;
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
            elementsHtml = renderedTokens.join('');
        } else {
            elementsHtml = `
                ${firstBtnHtml}
                ${prevBtnHtml}
                <div class="p-paginator-pages">${pageButtons.join('')}</div>
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
        let imageDisplayHtml = '';
        if (images.length > 0) {
            const currentImg = images[currentPage % images.length];
            imageDisplayHtml = `
                <div class="p-paginator-image-display">
                    <div class="p-paginator-image-card">
                        <img src="${currentImg}" alt="Nature ${currentPage + 1}" loading="eager" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80';" />
                    </div>
                </div>
            `;
        }

        container.innerHTML = `
            <div class="p-paginator-wrapper" style="width: 100%;">
                <div class="p-paginator p-component" role="navigation" aria-label="Pagination Navigation">
                    ${elementsHtml}
                </div>
                ${imageDisplayHtml}
            </div>
        `;

        bindEvents();
    }

    function bindEvents() {
        const rootEl = container.firstElementChild as HTMLElement;
        if (!rootEl) return;

        // 1. First / Prev / Next / Last Nav
        rootEl.querySelector('[data-action="first"]')?.addEventListener('click', () => setPage(0));
        rootEl.querySelector('[data-action="prev"]')?.addEventListener('click', () => setPage(getCurrentPage() - 1));
        rootEl.querySelector('[data-action="next"]')?.addEventListener('click', () => setPage(getCurrentPage() + 1));
        rootEl.querySelector('[data-action="last"]')?.addEventListener('click', () => setPage(getTotalPages() - 1));

        // 2. Page Link Buttons
        rootEl.querySelectorAll<HTMLButtonElement>('.p-paginator-page').forEach(btn => {
            btn.addEventListener('click', () => {
                const p = parseInt(btn.getAttribute('data-page') || '0', 10);
                setPage(p);
            });
        });

        // 3. Rows Per Page Select
        const rppSelect = rootEl.querySelector<HTMLSelectElement>('.p-paginator-rpp-select');
        if (rppSelect) {
            rppSelect.addEventListener('change', (e) => {
                const val = parseInt((e.target as HTMLSelectElement).value, 10);
                if (!isNaN(val)) setRows(val);
            });
        }

        // 4. Jump To Page Select
        const jtpSelect = rootEl.querySelector<HTMLSelectElement>('.p-paginator-jtp-select');
        if (jtpSelect) {
            jtpSelect.addEventListener('change', (e) => {
                const val = parseInt((e.target as HTMLSelectElement).value, 10);
                if (!isNaN(val)) setPage(val);
            });
        }

        // 5. Jump To Page Input
        const jtpInput = rootEl.querySelector<HTMLInputElement>('.p-paginator-jtp-input');
        if (jtpInput) {
            jtpInput.addEventListener('change', (e) => {
                const val = parseInt((e.target as HTMLInputElement).value, 10);
                if (!isNaN(val)) setPage(val - 1);
            });
        }

        // 6. Slider
        const slider = rootEl.querySelector<HTMLInputElement>('.p-paginator-slider');
        if (slider) {
            slider.addEventListener('input', (e) => {
                const val = parseInt((e.target as HTMLInputElement).value, 10);
                if (!isNaN(val)) setPage(val);
            });
        }
    }

    function dispatchEvents() {
        const page = getCurrentPage();
        container.dispatchEvent(new CustomEvent('page', {
            bubbles: true,
            detail: {
                first,
                rows,
                page,
                pageCount: getTotalPages()
            }
        }));

        container.dispatchEvent(new CustomEvent('page-change', {
            bubbles: true,
            detail: { first, rows, page }
        }));

        if (props.targetInputName) {
            let hidden = container.querySelector<HTMLInputElement>(`input[name="${props.targetInputName}"]`);
            if (!hidden) {
                hidden = document.createElement('input');
                hidden.type = 'hidden';
                hidden.name = props.targetInputName;
                container.appendChild(hidden);
            }
            hidden.value = JSON.stringify({ first, rows, page });
        }
    }

    render();
    dispatchEvents();
}
