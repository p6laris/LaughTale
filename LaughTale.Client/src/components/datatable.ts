/**
 * LaughTale: Enterprise DataTable Component (Aura Design System compliant)
 * High-performance tabular data grid supporting sorting, filtering, pagination, selection,
 * frozen columns, row expansion, in-place cell editing, loading states, and CSV export.
 */

import { injectIslandStyle } from '../runtime/styles';
import { LucideIcons } from '../icons/lucide';
import { resolvePart, applyPart, type PassthroughRecord } from '../runtime/parts';
import type { IslandContext } from '../runtime/registry';

export interface DataTableColumn {
    field: string;
    header: string;
    sortable?: boolean;
    filterable?: boolean;
    filterPlaceholder?: string;
    width?: string;
    minWidth?: string;
    align?: 'left' | 'center' | 'right';
    frozen?: boolean;
    alignFrozen?: 'left' | 'right';
    selectionMode?: 'single' | 'multiple';
    expander?: boolean;
    editorType?: 'text' | 'number' | 'select';
    editorOptions?: Array<{ label: string; value: any }>;
    bodyTemplate?: string;
    headerClass?: string;
    bodyClass?: string;
}

export interface DataTableProps {
    value?: Record<string, any>[];
    data?: Record<string, any>[];
    columns?: DataTableColumn[];
    size?: 'small' | 'normal' | 'large';
    showGridlines?: boolean;
    stripedRows?: boolean;
    selectionMode?: 'single' | 'multiple';
    metaKeySelection?: boolean;
    dataKey?: string;
    paginator?: boolean;
    pt?: PassthroughRecord;
    studioOverrides?: Record<string, any>;
    rows?: number;
    first?: number;
    rowsPerPageOptions?: number[];
    currentPageReportTemplate?: string;
    sortMode?: 'single' | 'multiple';
    removableSort?: boolean;
    sortField?: string;
    sortOrder?: number; // 1 = asc, -1 = desc, 0 = unsorted
    filterDisplay?: 'none' | 'row';
    globalFilterFields?: string[];
    scrollable?: boolean;
    scrollHeight?: string;
    editMode?: 'cell';
    loading?: boolean;
    loadingMode?: 'overlay' | 'skeleton';
    exportFilename?: string;
    emptyMessage?: string;
    tableStyle?: string;
    title?: string;
    interactiveSize?: boolean;
    showRefresh?: boolean;
    showExport?: boolean;
}

const DATATABLE_CSS = `
.p-datatable {
    position: relative;
    border-radius: var(--lt-radius-lg);
    background: var(--lt-surface-0);
    color: var(--lt-surface-800);
    font-family: var(--p-font-family, inherit);
    border: 1px solid var(--lt-surface-200);
    box-shadow: var(--p-shadow-xs, 0 1px 2px 0 rgba(0, 0, 0, 0.05));
    overflow: hidden;
}

.p-datatable-table {
    width: 100%;
    border-collapse: collapse;
    border-spacing: 0;
    font-size: 0.875rem;
}

/* Header Cells */
.p-datatable-thead > tr > th {
    padding: 0.875rem 1rem;
    background: var(--lt-surface-50);
    color: var(--lt-surface-700);
    font-weight: 700;
    font-size: 0.8125rem;
    letter-spacing: 0.01em;
    border-bottom: 1px solid var(--lt-surface-200);
    text-align: left;
    user-select: none;
    transition: background-color 0.15s ease, color 0.15s ease;
}

.p-datatable-thead > tr > th.p-sortable-column {
    cursor: pointer;
}

.p-datatable-thead > tr > th.p-sortable-column:hover {
    background: var(--lt-surface-100);
    color: var(--lt-surface-900);
}

.p-datatable-header-content {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.p-datatable-sort-icon {
    display: inline-flex;
    align-items: center;
    color: var(--lt-surface-400);
    transition: color 0.15s ease, transform 0.15s ease;
}
.p-sortable-column.p-sorted .p-datatable-sort-icon {
    color: var(--lt-primary-500);
}

.p-datatable-sort-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 1.125rem;
    height: 1.125rem;
    border-radius: 9999px;
    background: var(--lt-primary-500);
    color: var(--lt-surface-0, var(--lt-surface-0));
    font-size: 0.6875rem;
    font-weight: 700;
}

/* Filter Row */
.p-datatable-filter-row > th {
    padding: 0.4rem 0.75rem;
    background: var(--lt-surface-50);
    border-bottom: 1px solid var(--lt-surface-200);
}
.p-datatable-filter-input {
    width: 100%;
    padding: 0.4rem 0.65rem;
    font-size: 0.8125rem;
    border: 1px solid var(--lt-surface-300);
    border-radius: var(--lt-radius);
    background: var(--lt-surface-0);
    color: inherit;
    outline: none;
    transition: border-color 0.15s ease, box-shadow 0.15s ease;
}
.p-datatable-filter-input:focus {
    border-color: var(--lt-primary-500);
    box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.2);
}

/* Body Cells */
.p-datatable-tbody > tr {
    transition: background-color 0.15s ease, color 0.15s ease;
}

.p-datatable-tbody > tr > td {
    padding: 0.875rem 1rem;
    border-bottom: 1px solid var(--lt-surface-200);
    color: var(--lt-surface-700);
    vertical-align: middle;
}

.p-datatable-tbody > tr:hover {
    background: var(--lt-surface-50);
}

.p-datatable-tbody > tr.p-highlight {
    background: rgba(16, 185, 129, 0.08) !important;
    color: var(--lt-primary-700) !important;
}

.p-datatable-tbody > tr.p-highlight > td {
    color: inherit;
}

/* Size Variants */
.p-datatable-sm .p-datatable-thead > tr > th,
.p-datatable-sm .p-datatable-tbody > tr > td {
    padding: 0.4rem 0.75rem;
    font-size: 0.8125rem;
}

.p-datatable-lg .p-datatable-thead > tr > th,
.p-datatable-lg .p-datatable-tbody > tr > td {
    padding: 1.15rem 1.35rem;
    font-size: 1rem;
}

/* Striped Rows */
.p-datatable-striped .p-datatable-tbody > tr:nth-child(even):not(.p-highlight) {
    background: var(--lt-surface-50);
}

/* Grid Lines */
.p-datatable-gridlines .p-datatable-thead > tr > th,
.p-datatable-gridlines .p-datatable-tbody > tr > td {
    border: 1px solid var(--lt-surface-200);
}

/* Scrollable & Sticky Header */
.p-datatable-scrollable-wrapper {
    overflow: auto;
    position: relative;
}

.p-datatable-scrollable .p-datatable-thead {
    position: sticky;
    top: 0;
    z-index: 10;
}

/* Frozen Columns */
.p-frozen-column-left {
    position: sticky !important;
    left: 0;
    z-index: 5;
    background: inherit;
    box-shadow: 2px 0 4px -2px rgba(0, 0, 0, 0.1);
}
.p-frozen-column-right {
    position: sticky !important;
    right: 0;
    z-index: 5;
    background: inherit;
    box-shadow: -2px 0 4px -2px rgba(0, 0, 0, 0.1);
}

/* Row Expansion */
.p-row-expansion {
    background: var(--lt-surface-50);
    border-bottom: 1px solid var(--lt-surface-200);
}
.p-row-toggler {
    background: transparent;
    border: none;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 1.75rem;
    height: 1.75rem;
    border-radius: 9999px;
    color: var(--lt-surface-500);
    transition: background-color 0.15s ease, color 0.15s ease, transform 0.15s ease;
}
.p-row-toggler:hover {
    background: var(--lt-surface-200);
    color: var(--lt-surface-900);
}

/* Custom Checkbox & Radio */
.p-checkbox-box, .p-radio-box {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 1.25rem;
    height: 1.25rem;
    border-radius: var(--p-border-radius-xs, 5px);
    border: 2px solid var(--lt-surface-300);
    background: var(--lt-surface-0);
    cursor: pointer;
    transition: all 0.15s ease;
    user-select: none;
}
.p-radio-box {
    border-radius: 9999px;
}
.p-checkbox-box.p-checked, .p-radio-box.p-checked {
    background: var(--lt-primary-500);
    border-color: var(--lt-primary-500);
    color: var(--lt-surface-0, var(--lt-surface-0));
}

/* Aura Tags & Badges */
.p-tag {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.25rem 0.55rem;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 700;
    line-height: 1;
    letter-spacing: 0.02em;
    text-transform: capitalize;
    white-space: nowrap;
}
.p-tag-success { background: var(--lt-success-100, var(--lt-success-100)); color: var(--lt-success-700, var(--lt-success-700)); }
.p-tag-warn { background: var(--lt-warn-100, var(--lt-warn-100)); color: var(--lt-warn-700, var(--lt-warn-700)); }
.p-tag-danger { background: var(--lt-danger-100, var(--lt-danger-100)); color: var(--lt-danger-700, var(--lt-danger-700)); }
.p-tag-info { background: var(--lt-info-100); color: var(--lt-info-700); }
.p-tag-secondary { background: var(--lt-surface-100); color: var(--lt-surface-700); }

/* Product, Rep & Country Flex Formats */
.p-product-cell {
    display: flex;
    align-items: center;
    gap: 0.75rem;
}
.p-product-avatar {
    width: 2.25rem;
    height: 2.25rem;
    border-radius: 6px;
    background: var(--lt-surface-100);
    border: 1px solid var(--lt-surface-200);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--lt-primary-600);
    flex-shrink: 0;
}
.p-product-info {
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
}
.p-product-name {
    font-weight: 600;
    color: var(--lt-surface-900);
}
.p-product-code {
    font-size: 0.75rem;
    color: var(--lt-surface-400);
    font-family: monospace;
}

.p-country-cell, .p-rep-cell {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}
.p-rep-avatar {
    width: 1.75rem;
    height: 1.75rem;
    border-radius: 9999px;
    background: var(--lt-primary-100);
    color: var(--lt-primary-700);
    font-weight: 700;
    font-size: 0.6875rem;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

/* In-place Editable Cell */
.p-editable-cell {
    cursor: pointer;
    position: relative;
    border-radius: var(--p-border-radius-xs, 4px);
    transition: background-color 0.15s ease;
}
.p-editable-cell:hover {
    outline: 1px dashed var(--lt-primary-400);
    background: rgba(16, 185, 129, 0.04);
}
.p-cell-editor-input {
    width: 100%;
    padding: 0.35rem 0.5rem;
    font-size: inherit;
    border: 1px solid var(--lt-primary-500);
    border-radius: var(--p-border-radius-xs, 4px);
    background: var(--lt-surface-0);
    color: inherit;
    outline: none;
    box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.2);
}

/* Toolbar, Selection Bar & Controls */
.p-datatable-header-toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.875rem 1.25rem;
    border-bottom: 1px solid var(--lt-surface-200);
    background: var(--lt-surface-0);
    flex-wrap: wrap;
    gap: 0.75rem;
}
.p-datatable-title {
    font-weight: 700;
    font-size: 1rem;
    color: var(--lt-surface-900);
}

.p-datatable-selection-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.625rem 1.25rem;
    background: var(--lt-surface-50);
    border-bottom: 1px solid var(--lt-surface-200);
    font-size: 0.8125rem;
    font-weight: 500;
}

.p-size-switcher {
    display: inline-flex;
    border-radius: 6px;
    border: 1px solid var(--lt-surface-300);
    overflow: hidden;
    background: var(--lt-surface-0);
}
.p-size-btn {
    padding: 0.35rem 0.75rem;
    font-size: 0.75rem;
    font-weight: 600;
    border: none;
    background: transparent;
    cursor: pointer;
    color: var(--lt-surface-600);
    transition: all 0.15s ease;
}
.p-size-btn:hover {
    background: var(--lt-surface-100);
    color: var(--lt-surface-900);
}
.p-size-btn.p-active {
    background: var(--lt-primary-500);
    color: var(--lt-surface-0, var(--lt-surface-0));
}

/* Paginator Integration */
.p-datatable-paginator {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.75rem 1.25rem;
    background: var(--lt-surface-0);
    border-top: 1px solid var(--lt-surface-200);
    font-size: 0.8125rem;
    color: var(--lt-surface-600);
    flex-wrap: wrap;
    gap: 0.75rem;
}
.p-paginator-pages {
    display: flex;
    align-items: center;
    gap: 0.25rem;
}
.p-paginator-page, .p-paginator-nav {
    min-width: 2rem;
    height: 2rem;
    padding: 0 0.5rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--lt-radius);
    border: 1px solid transparent;
    background: transparent;
    cursor: pointer;
    font-weight: 600;
    font-size: 0.8125rem;
    color: var(--lt-surface-700);
    transition: all 0.15s ease;
}
.p-paginator-page:hover:not(:disabled), .p-paginator-nav:hover:not(:disabled) {
    background: var(--lt-surface-100);
    color: var(--lt-surface-900);
}
.p-paginator-page.p-paginator-page-active {
    background: var(--lt-primary-500);
    color: var(--lt-surface-0, var(--lt-surface-0));
}
.p-paginator-page:disabled, .p-paginator-nav:disabled {
    opacity: 0.4;
    cursor: not-allowed;
}

/* Loading Mask */
.p-datatable-loading-overlay {
    position: absolute;
    inset: 0;
    z-index: 50;
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(1px);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
}

/* Skeleton Placeholders */
.p-datatable-skeleton-cell {
    height: 1.25rem;
    border-radius: 4px;
    background: linear-gradient(90deg, var(--lt-surface-200) 25%, var(--lt-surface-100) 50%, var(--lt-surface-200) 75%);
    background-size: 200% 100%;
    animation: p-skeleton-shimmer 1.5s infinite;
}

@keyframes p-skeleton-shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
}

@keyframes p-spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}

/* Dark Mode Tokens */
html.dark .p-datatable,
[data-theme="dark"] .p-datatable,
.dark .p-datatable {
    background: var(--p-surface-0, #090d16) !important;
    color: var(--p-text-color, #f8fafc) !important;
    border-color: var(--p-border-color, #334155) !important;
}
html.dark .p-datatable-thead > tr > th,
[data-theme="dark"] .p-datatable-thead > tr > th,
.dark .p-datatable-thead > tr > th {
    background: var(--p-surface-50, #0f172a) !important;
    color: var(--p-text-color, #f8fafc) !important;
    border-color: var(--p-border-color, #334155) !important;
}
html.dark .p-datatable-tbody > tr > td,
[data-theme="dark"] .p-datatable-tbody > tr > td,
.dark .p-datatable-tbody > tr > td {
    border-color: var(--p-border-color, #334155) !important;
    color: var(--p-text-color, #f8fafc) !important;
}
html.dark .p-datatable-tbody > tr:hover,
[data-theme="dark"] .p-datatable-tbody > tr:hover,
.dark .p-datatable-tbody > tr:hover {
    background: var(--p-surface-100, #1e293b) !important;
}
html.dark .p-datatable-striped .p-datatable-tbody > tr:nth-child(even):not(.p-highlight),
[data-theme="dark"] .p-datatable-striped .p-datatable-tbody > tr:nth-child(even):not(.p-highlight),
.dark .p-datatable-striped .p-datatable-tbody > tr:nth-child(even):not(.p-highlight) {
    background: rgba(30, 41, 59, 0.5) !important;
}
html.dark .p-datatable-header-toolbar,
html.dark .p-datatable-paginator,
html.dark .p-datatable-selection-bar,
[data-theme="dark"] .p-datatable-header-toolbar,
[data-theme="dark"] .p-datatable-paginator,
[data-theme="dark"] .p-datatable-selection-bar,
.dark .p-datatable-header-toolbar,
.dark .p-datatable-paginator,
.dark .p-datatable-selection-bar {
    background: var(--p-surface-0, #090d16) !important;
    border-color: var(--p-border-color, #334155) !important;
    color: var(--p-text-muted, #94a3b8) !important;
}
html.dark .p-datatable-filter-row > th,
html.dark .p-row-expansion,
[data-theme="dark"] .p-datatable-filter-row > th,
[data-theme="dark"] .p-row-expansion,
.dark .p-datatable-filter-row > th,
.dark .p-row-expansion {
    background: var(--p-surface-50, #0f172a) !important;
    border-color: var(--p-border-color, #334155) !important;
}
html.dark .p-datatable-filter-input,
[data-theme="dark"] .p-datatable-filter-input,
.dark .p-datatable-filter-input {
    background: var(--p-surface-0, #090d16) !important;
    border-color: var(--p-border-color, #334155) !important;
    color: var(--p-text-color, #f8fafc) !important;
}
html.dark .p-datatable-loading-overlay,
[data-theme="dark"] .p-datatable-loading-overlay,
.dark .p-datatable-loading-overlay {
    background: rgba(9, 13, 22, 0.8) !important;
}
html.dark .p-tag-secondary,
[data-theme="dark"] .p-tag-secondary,
.dark .p-tag-secondary {
    background: var(--p-surface-100, #1e293b);
    color: var(--p-text-color, #f8fafc);
}
html.dark .p-product-avatar,
[data-theme="dark"] .p-product-avatar,
.dark .p-product-avatar {
    background: var(--p-surface-100, #1e293b);
    border-color: var(--p-border-color, #334155);
}
`;

export default function DataTableIsland(container: HTMLElement, props: DataTableProps, ctx?: IslandContext) {
    injectIslandStyle('datatable', DATATABLE_CSS);

    const rawData: Record<string, any>[] = [...(props.value || props.data || [])];
    const columns: DataTableColumn[] = props.columns || [];
    let currentSize = props.size || 'normal';
    const showGridlines = !!props.showGridlines;
    const stripedRows = !!props.stripedRows;
    const selectionMode = props.selectionMode; // 'single' | 'multiple'
    const metaKeySelection = props.metaKeySelection !== false;
    const dataKey = props.dataKey || 'id';
    const paginator = !!props.paginator;
    let rowsPerPage = props.rows || 10;
    let currentPage = Math.floor((props.first || 0) / rowsPerPage) + 1;
    const rowsPerPageOptions = props.rowsPerPageOptions || [5, 10, 20, 50];
    const sortMode = props.sortMode || 'single';
    const removableSort = !!props.removableSort;
    const filterDisplay = props.filterDisplay || 'none';
    const scrollable = !!props.scrollable;
    const scrollHeight = props.scrollHeight;
    const editMode = props.editMode;
    let loading = !!props.loading;
    const loadingMode = props.loadingMode || 'overlay';
    const exportFilename = props.exportFilename || 'datatable_export';
    const emptyMessage = props.emptyMessage || 'No records found.';
    const showInteractiveSize = !!props.interactiveSize;

    // State Variables
    let globalFilter = '';
    const columnFilters: Record<string, string> = {};
    let sortMeta: Array<{ field: string; order: number }> = [];
    if (props.sortField) {
        sortMeta.push({ field: props.sortField, order: props.sortOrder ?? 1 });
    }

    const selectedKeys = new Set<any>();
    const expandedKeys = new Set<any>();
    let editingCell: { rowKey: any; field: string } | null = null;

    // Helper: resolve deep nested property path (e.g. 'country.name') with case-insensitive fallback
    function resolveField(obj: any, field: string): any {
        if (!obj || !field) return '';
        if (field.includes('.')) {
            return field.split('.').reduce((acc, part) => {
                if (acc == null) return undefined;
                if (acc[part] !== undefined) return acc[part];
                const camel = part.charAt(0).toLowerCase() + part.slice(1);
                if (acc[camel] !== undefined) return acc[camel];
                const lower = part.toLowerCase();
                for (const k of Object.keys(acc)) {
                    if (k.toLowerCase() === lower) return acc[k];
                }
                return undefined;
            }, obj);
        }
        if (obj[field] !== undefined) return obj[field];
        const camel = field.charAt(0).toLowerCase() + field.slice(1);
        if (obj[camel] !== undefined) return obj[camel];
        const lower = field.toLowerCase();
        for (const k of Object.keys(obj)) {
            if (k.toLowerCase() === lower) return obj[k];
        }
        return undefined;
    }

    // Helper: Rich Cell Renderer
    function renderCellContent(row: any, col: DataTableColumn, rawVal: any): string {
        const fieldName = (col.field || '').toLowerCase();
        const headerName = (col.header || '').toLowerCase();

        // 1. Status Tag
        if (fieldName.includes('status') || headerName.includes('status')) {
            const strVal = String(rawVal || '').toUpperCase();
            if (strVal === 'INSTOCK' || strVal === 'QUALIFIED') {
                return `<span class="p-tag p-tag-success">${strVal === 'INSTOCK' ? 'In Stock' : 'Qualified'}</span>`;
            }
            if (strVal === 'LOWSTOCK' || strVal === 'NEGOTIATION') {
                return `<span class="p-tag p-tag-warn">${strVal === 'LOWSTOCK' ? 'Low Stock' : 'Negotiation'}</span>`;
            }
            if (strVal === 'OUTOFSTOCK' || strVal === 'UNQUALIFIED') {
                return `<span class="p-tag p-tag-danger">${strVal === 'OUTOFSTOCK' ? 'Out of Stock' : 'Unqualified'}</span>`;
            }
            if (strVal === 'NEW' || strVal === 'PROPOSAL') {
                return `<span class="p-tag p-tag-info">${strVal}</span>`;
            }
            return `<span class="p-tag p-tag-secondary">${rawVal ?? ''}</span>`;
        }

        // 2. Category Tag
        if (fieldName === 'category') {
            return `<span class="p-tag p-tag-secondary">${rawVal ?? ''}</span>`;
        }

        // 3. Product with SKU subtitle
        if ((fieldName === 'name' || headerName === 'product') && row.code) {
            return `
                <div class="p-product-cell">
                    <div class="p-product-avatar">${LucideIcons.package}</div>
                    <div class="p-product-info">
                        <span class="p-product-name">${row.name ?? ''}</span>
                        <span class="p-product-code">${row.code ?? ''}</span>
                    </div>
                </div>
            `;
        }

        // 4. Country with Flag Icon
        if (fieldName === 'country') {
            return `
                <div class="p-country-cell">
                    <span style="font-size: 1rem; line-height: 1;">🌐</span>
                    <span>${rawVal ?? ''}</span>
                </div>
            `;
        }

        // 5. Representative with Avatar
        if (fieldName.includes('rep') || headerName.includes('representative')) {
            const initials = String(rawVal || 'U').split(' ').map(n => n[0]).join('').substring(0, 2);
            return `
                <div class="p-rep-cell">
                    <div class="p-rep-avatar">${initials}</div>
                    <span>${rawVal ?? ''}</span>
                </div>
            `;
        }

        // 6. Currency Formatted (Price / Balance)
        if (typeof rawVal === 'number' && (fieldName.includes('price') || fieldName.includes('balance'))) {
            return `<span style="font-weight: 700; color: var(--lt-surface-900);">$${rawVal.toLocaleString()}</span>`;
        }

        // 7. Verified Boolean Tag
        if (fieldName === 'verified') {
            return rawVal ? `<span class="p-tag p-tag-success">Verified</span>` : `<span class="p-tag p-tag-secondary">—</span>`;
        }

        return rawVal != null ? String(rawVal) : '';
    }

    // Export CSV Helper
    function exportCSV() {
        if (rawData.length === 0) return;
        const exportCols = columns.filter(c => c.field && !c.selectionMode && !c.expander);
        const headers = exportCols.map(c => `"${(c.header || c.field).replace(/"/g, '""')}"`).join(',');
        const rows = rawData.map(row => {
            return exportCols.map(c => {
                const val = resolveField(row, c.field);
                const str = val == null ? '' : String(val);
                return `"${str.replace(/"/g, '""')}"`;
            }).join(',');
        });

        const csvContent = [headers, ...rows].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `${exportFilename}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    (container as any).exportCSV = exportCSV;

    function render() {
        // 1. Filter Data
        let filtered = rawData.filter(row => {
            // Global search
            if (globalFilter.trim()) {
                const query = globalFilter.toLowerCase();
                const fieldsToCheck = props.globalFilterFields && props.globalFilterFields.length > 0
                    ? props.globalFilterFields
                    : columns.map(c => c.field).filter(Boolean);

                const matchesGlobal = fieldsToCheck.some(f => {
                    const val = resolveField(row, f);
                    return val != null && String(val).toLowerCase().includes(query);
                });
                if (!matchesGlobal) return false;
            }

            // Column filters
            for (const [f, query] of Object.entries(columnFilters)) {
                if (query.trim()) {
                    const val = resolveField(row, f);
                    if (val == null || !String(val).toLowerCase().includes(query.toLowerCase())) {
                        return false;
                    }
                }
            }

            return true;
        });

        // 2. Sort Data
        if (sortMeta.length > 0) {
            filtered.sort((a, b) => {
                for (const meta of sortMeta) {
                    const valA = resolveField(a, meta.field);
                    const valB = resolveField(b, meta.field);
                    if (valA === valB) continue;
                    if (valA == null) return 1;
                    if (valB == null) return -1;
                    const res = typeof valA === 'number' && typeof valB === 'number'
                        ? valA - valB
                        : String(valA).localeCompare(String(valB), undefined, { numeric: true });
                    if (res !== 0) return res * meta.order;
                }
                return 0;
            });
        }

        // 3. Paginate Data
        const totalRecords = filtered.length;
        const totalPages = Math.ceil(totalRecords / rowsPerPage) || 1;
        if (currentPage > totalPages) currentPage = totalPages;
        if (currentPage < 1) currentPage = 1;
        const firstIdx = (currentPage - 1) * rowsPerPage;
        const displayRows = paginator ? filtered.slice(firstIdx, firstIdx + rowsPerPage) : filtered;

        // Modifier Classes
        const rootClasses = ['p-datatable', 'p-component'];
        if (currentSize === 'small') rootClasses.push('p-datatable-sm');
        if (currentSize === 'large') rootClasses.push('p-datatable-lg');
        if (showGridlines) rootClasses.push('p-datatable-gridlines');
        if (stripedRows) rootClasses.push('p-datatable-striped');
        if (scrollable) rootClasses.push('p-datatable-scrollable');

        // Check if all current page rows are selected
        const allPageSelected = displayRows.length > 0 && displayRows.every(r => selectedKeys.has(r[dataKey]));

        // Generate Header Cells
        const headerCells = columns.map((col) => {
            const isSortable = !!col.sortable;
            const sortItem = sortMeta.find(m => m.field === col.field);
            const isSorted = !!sortItem;
            const sortOrder = sortItem?.order || 0;
            const sortBadge = sortMode === 'multiple' && sortMeta.length > 1 && isSorted
                ? `<span class="p-datatable-sort-badge">${sortMeta.indexOf(sortItem!) + 1}</span>`
                : '';

            let sortIconSvg = '';
            if (isSortable) {
                if (sortOrder === 1) sortIconSvg = LucideIcons.arrowUp;
                else if (sortOrder === -1) sortIconSvg = LucideIcons.arrowDown;
                else sortIconSvg = LucideIcons.arrowUpDown;
            }

            let frozenClass = '';
            if (col.frozen) {
                frozenClass = col.alignFrozen === 'right' ? 'p-frozen-column-right' : 'p-frozen-column-left';
            }

            const styleAttr = [
                col.width ? `width: ${col.width};` : '',
                col.minWidth ? `min-width: ${col.minWidth};` : '',
                col.align ? `text-align: ${col.align};` : ''
            ].filter(Boolean).join(' ');

            // Checkbox Header
            if (col.selectionMode === 'multiple') {
                return `
                    <th class="${frozenClass}" style="width: 3.5rem; text-align: center;">
                        <div class="p-checkbox-box p-select-all ${allPageSelected ? 'p-checked' : ''}" role="checkbox" aria-checked="${allPageSelected}">
                            ${allPageSelected ? LucideIcons.check : ''}
                        </div>
                    </th>
                `;
            }

            // Radio Header
            if (col.selectionMode === 'single') {
                return `<th class="${frozenClass}" style="width: 3.5rem; text-align: center;"></th>`;
            }

            // Row Expander Header
            if (col.expander) {
                return `<th class="${frozenClass}" style="width: 3.5rem; text-align: center;"></th>`;
            }

            return `
                <th class="${isSortable ? 'p-sortable-column' : ''} ${isSorted ? 'p-sorted' : ''} ${frozenClass} ${col.headerClass || ''}" 
                    data-field="${col.field || ''}" 
                    style="${styleAttr}">
                    <div class="p-datatable-header-content" style="justify-content: ${col.align === 'right' ? 'flex-end' : col.align === 'center' ? 'center' : 'flex-start'};">
                        <span>${col.header || ''}</span>
                        ${isSortable ? `<span class="p-datatable-sort-icon">${sortIconSvg}</span>${sortBadge}` : ''}
                    </div>
                </th>
            `;
        }).join('');

        // Generate Filter Row (if enabled)
        let filterRowHtml = '';
        if (filterDisplay === 'row') {
            const filterCells = columns.map(col => {
                let frozenClass = col.frozen ? (col.alignFrozen === 'right' ? 'p-frozen-column-right' : 'p-frozen-column-left') : '';
                if (!col.field || col.selectionMode || col.expander || col.filterable === false) {
                    return `<th class="${frozenClass}"></th>`;
                }
                const curVal = columnFilters[col.field] || '';
                return `
                    <th class="${frozenClass}">
                        <input type="text" 
                               class="p-datatable-filter-input" 
                               data-filter-field="${col.field}" 
                               placeholder="${col.filterPlaceholder || 'Filter...'}" 
                               value="${curVal}" />
                    </th>
                `;
            }).join('');
            filterRowHtml = `<tr class="p-datatable-filter-row">${filterCells}</tr>`;
        }

        // Generate Body Rows
        let bodyRowsHtml = '';
        if (loading && loadingMode === 'skeleton') {
            bodyRowsHtml = Array.from({ length: rowsPerPage }).map(() => `
                <tr>
                    ${columns.map(col => `
                        <td style="${col.width ? `width: ${col.width};` : ''}">
                            <div class="p-datatable-skeleton-cell"></div>
                        </td>
                    `).join('')}
                </tr>
            `).join('');
        } else if (displayRows.length === 0) {
            bodyRowsHtml = `
                <tr>
                    <td colspan="${columns.length}" style="text-align: center; padding: 3rem 1rem; color: var(--lt-surface-400);">
                        <div style="display: flex; flex-direction: column; align-items: center; gap: 0.75rem;">
                            <span style="font-size: 1.75rem; color: var(--lt-surface-400);">${LucideIcons.inbox}</span>
                            <span style="font-weight: 600; font-size: 0.9375rem; color: var(--lt-surface-700);">${emptyMessage}</span>
                        </div>
                    </td>
                </tr>
            `;
        } else {
            bodyRowsHtml = displayRows.map(row => {
                const rowKey = row[dataKey];
                const isSelected = selectedKeys.has(rowKey);
                const isExpanded = expandedKeys.has(rowKey);

                const cellTds = columns.map(col => {
                    let frozenClass = col.frozen ? (col.alignFrozen === 'right' ? 'p-frozen-column-right' : 'p-frozen-column-left') : '';
                    const styleAttr = [
                        col.width ? `width: ${col.width};` : '',
                        col.minWidth ? `min-width: ${col.minWidth};` : '',
                        col.align ? `text-align: ${col.align};` : ''
                    ].filter(Boolean).join(' ');

                    // Checkbox Column
                    if (col.selectionMode === 'multiple') {
                        return `
                            <td class="${frozenClass}" style="width: 3.5rem; text-align: center;">
                                <div class="p-checkbox-box p-row-checkbox ${isSelected ? 'p-checked' : ''}" data-row-key="${rowKey}">
                                    ${isSelected ? LucideIcons.check : ''}
                                </div>
                            </td>
                        `;
                    }

                    // Radio Column
                    if (col.selectionMode === 'single') {
                        return `
                            <td class="${frozenClass}" style="width: 3.5rem; text-align: center;">
                                <div class="p-radio-box p-row-radio ${isSelected ? 'p-checked' : ''}" data-row-key="${rowKey}">
                                    ${isSelected ? '<span style="width: 6px; height: 6px; border-radius: 9999px; background: white;"></span>' : ''}
                                </div>
                            </td>
                        `;
                    }

                    // Expander Column
                    if (col.expander) {
                        return `
                            <td class="${frozenClass}" style="width: 3.5rem; text-align: center;">
                                <button type="button" class="p-row-toggler" data-row-key="${rowKey}" aria-label="Toggle Row">
                                    ${isExpanded ? LucideIcons.chevronDown : LucideIcons.chevronRight}
                                </button>
                            </td>
                        `;
                    }

                    const rawVal = resolveField(row, col.field);

                    // In-Place Cell Editing
                    const isEditing = editMode === 'cell' && editingCell?.rowKey === rowKey && editingCell?.field === col.field;
                    if (isEditing) {
                        return `
                            <td class="${frozenClass} ${col.bodyClass || ''}" style="${styleAttr}">
                                <input type="text" 
                                       class="p-cell-editor-input" 
                                       data-row-key="${rowKey}" 
                                       data-field="${col.field}" 
                                       value="${rawVal ?? ''}" 
                                       autofocus />
                            </td>
                        `;
                    }

                    const formattedContent = renderCellContent(row, col, rawVal);
                    const editableClass = editMode === 'cell' && col.field ? 'p-editable-cell' : '';

                    return `
                        <td class="${frozenClass} ${editableClass} ${col.bodyClass || ''}" 
                            data-row-key="${rowKey}" 
                            data-field="${col.field || ''}" 
                            style="${styleAttr}">
                            ${formattedContent}
                        </td>
                    `;
                }).join('');

                const rowHtml = `
                    <tr class="${isSelected ? 'p-highlight' : ''}" data-row-key="${rowKey}">
                        ${cellTds}
                    </tr>
                `;

                // Row Expansion Detail Card
                let expansionHtml = '';
                if (isExpanded) {
                    expansionHtml = `
                        <tr class="p-row-expansion">
                            <td colspan="${columns.length}" style="padding: 1.25rem;">
                                <div style="display: flex; gap: 1.25rem; align-items: center; background: var(--lt-surface-0); padding: 1rem; border-radius: 8px; border: 1px solid var(--lt-surface-200);">
                                    <div style="width: 56px; height: 56px; border-radius: 8px; background: var(--lt-primary-50); border: 1px solid var(--lt-primary-200); display: flex; align-items: center; justify-content: center; color: var(--lt-primary-600); font-size: 1.5rem; flex-shrink: 0;">
                                        ${LucideIcons.package}
                                    </div>
                                    <div style="display: flex; flex-direction: column; gap: 0.35rem; flex: 1;">
                                        <div style="display: flex; align-items: center; justify-content: space-between;">
                                            <span style="font-weight: 700; color: var(--lt-surface-900); font-size: 1rem;">
                                                ${row.name || row.title || `Record #${rowKey}`}
                                            </span>
                                            <span class="p-tag p-tag-success">${row.inventoryStatus || 'Active'}</span>
                                        </div>
                                        <div style="font-size: 0.8125rem; color: var(--lt-surface-500); display: flex; gap: 1.5rem;">
                                            <span>SKU: <strong>${row.code || 'N/A'}</strong></span>
                                            <span>Category: <strong>${row.category || 'General'}</strong></span>
                                            <span>Stock: <strong>${row.quantity ?? 0} units</strong></span>
                                            <span>Price: <strong>$${row.price ?? 0}</strong></span>
                                        </div>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    `;
                }

                return rowHtml + expansionHtml;
            }).join('');
        }

        // Selection Summary Bar
        let selectionBarHtml = '';
        if (selectedKeys.size > 0) {
            const selectedRows = rawData.filter(r => selectedKeys.has(r[dataKey]));
            const totalVal = selectedRows.reduce((sum, r) => sum + (Number(r.price) || Number(r.balance) || 0), 0);

            selectionBarHtml = `
                <div class="p-datatable-selection-bar">
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <span class="p-tag p-tag-info" style="font-weight: 700;">Selected: ${selectedKeys.size}</span>
                        ${totalVal > 0 ? `<span>Total: <strong>$${totalVal.toLocaleString()}</strong></span>` : ''}
                    </div>
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <button type="button" class="p-datatable-clear-selection" style="padding: 0.3rem 0.6rem; font-size: 0.75rem; border-radius: 4px; border: 1px solid var(--lt-surface-300); background: transparent; cursor: pointer; color: var(--lt-surface-600);">
                            Clear Selection
                        </button>
                    </div>
                </div>
            `;
        }

        // Paginator HTML
        let paginatorHtml = '';
        if (paginator) {
            const startRecord = totalRecords > 0 ? firstIdx + 1 : 0;
            const endRecord = Math.min(firstIdx + rowsPerPage, totalRecords);
            const reportStr = (props.currentPageReportTemplate || 'Showing {first} to {last} of {totalRecords} entries')
                .replace('{first}', String(startRecord))
                .replace('{last}', String(endRecord))
                .replace('{totalRecords}', String(totalRecords));

            const pageButtons = [];
            let startPage = Math.max(1, currentPage - 2);
            let endPage = Math.min(totalPages, startPage + 4);
            if (endPage - startPage < 4) startPage = Math.max(1, endPage - 4);

            for (let p = startPage; p <= endPage; p++) {
                pageButtons.push(`
                    <button type="button" class="p-paginator-page ${p === currentPage ? 'p-paginator-page-active' : ''}" data-page="${p}">
                        ${p}
                    </button>
                `);
            }

            paginatorHtml = `
                <div class="p-datatable-paginator">
                    <span>${reportStr}</span>
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <button type="button" class="p-paginator-nav p-first" data-page="1" ${currentPage === 1 ? 'disabled' : ''} aria-label="First Page">«</button>
                        <button type="button" class="p-paginator-nav p-prev" data-page="${currentPage - 1}" ${currentPage === 1 ? 'disabled' : ''} aria-label="Previous Page">‹</button>
                        <div class="p-paginator-pages">${pageButtons.join('')}</div>
                        <button type="button" class="p-paginator-nav p-next" data-page="${currentPage + 1}" ${currentPage === totalPages ? 'disabled' : ''} aria-label="Next Page">›</button>
                        <button type="button" class="p-paginator-nav p-last" data-page="${totalPages}" ${currentPage === totalPages ? 'disabled' : ''} aria-label="Last Page">»</button>
                    </div>
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <span>Rows per page:</span>
                        <select class="p-datatable-rows-select" style="padding: 0.25rem 0.5rem; border-radius: 4px; border: 1px solid var(--lt-surface-300); background: var(--lt-surface-0); color: inherit; font-size: 0.8125rem;">
                            ${rowsPerPageOptions.map(opt => `<option value="${opt}" ${opt === rowsPerPage ? 'selected' : ''}>${opt}</option>`).join('')}
                        </select>
                    </div>
                </div>
            `;
        }

        // Global Toolbar
        let toolbarHtml = '';
        const showSearch = Array.isArray(props.globalFilterFields) && props.globalFilterFields.length > 0;
        const showExport = (!!props.exportFilename && props.exportFilename.trim() !== '') || !!props.showExport;
        const showRefresh = !!props.showRefresh;
        const hasToolbar = !!props.title || showSearch || showExport || showInteractiveSize || showRefresh;

        if (hasToolbar) {
            toolbarHtml = `
                <div class="p-datatable-header-toolbar">
                    <div class="p-datatable-title">${props.title || ''}</div>
                    <div style="display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap;">
                        ${showInteractiveSize ? `
                            <div class="p-size-switcher">
                                <button type="button" class="p-size-btn ${currentSize === 'small' ? 'p-active' : ''}" data-size="small">Small</button>
                                <button type="button" class="p-size-btn ${currentSize === 'normal' ? 'p-active' : ''}" data-size="normal">Normal</button>
                                <button type="button" class="p-size-btn ${currentSize === 'large' ? 'p-active' : ''}" data-size="large">Large</button>
                            </div>
                        ` : ''}

                        ${showSearch ? `
                            <div style="position: relative; display: flex; align-items: center;">
                                <input type="text" class="p-datatable-global-filter p-datatable-filter-input" placeholder="Search keyword..." value="${globalFilter}" style="width: 180px;" />
                            </div>
                        ` : ''}

                        ${showRefresh ? `
                            <button type="button" class="p-datatable-refresh-btn" style="display: inline-flex; align-items: center; gap: 0.35rem; padding: 0.4rem 0.75rem; border-radius: 6px; border: 1px solid var(--lt-surface-300); background: var(--lt-surface-0); color: inherit; font-size: 0.8125rem; font-weight: 600; cursor: pointer;">
                                <span>${LucideIcons.refreshCw}</span>
                                <span>Refresh</span>
                            </button>
                        ` : ''}

                        ${showExport ? `
                            <button type="button" class="p-datatable-export-btn" style="display: inline-flex; align-items: center; gap: 0.35rem; padding: 0.4rem 0.75rem; border-radius: 6px; border: 1px solid var(--lt-surface-300); background: var(--lt-surface-0); color: inherit; font-size: 0.8125rem; font-weight: 600; cursor: pointer;">
                                <span>${LucideIcons.fileSpreadsheet}</span>
                                <span>Export CSV</span>
                            </button>
                        ` : ''}
                    </div>
                </div>
            `;
        }

        // Loading Overlay
        let loadingOverlayHtml = '';
        if (loading && loadingMode === 'overlay') {
            loadingOverlayHtml = `
                <div class="p-datatable-loading-overlay">
                    <div style="width: 2.25rem; height: 2.25rem; border: 3px solid var(--lt-primary-500); border-top-color: transparent; border-radius: 9999px; animation: p-spin 0.8s linear infinite;"></div>
                    <span style="font-size: 0.875rem; font-weight: 600; color: var(--lt-surface-700);">Loading records...</span>
                </div>
            `;
        }

        const scrollWrapperStyle = props.scrollHeight ? `max-height: ${props.scrollHeight}; overflow-y: auto;` : 'overflow-x: auto;';

        applyPart(container, 'root', rootClasses.join(' '), props.pt, props.studioOverrides);

        container.innerHTML = `
            <div class="${rootClasses.join(' ')}">
                ${loadingOverlayHtml}
                ${toolbarHtml}
                ${selectionBarHtml}
                <div class="p-datatable-scrollable-wrapper" style="${scrollWrapperStyle}">
                    <table class="p-datatable-table" data-part="table" style="${props.tableStyle || ''}">
                        <thead class="p-datatable-thead" data-part="thead">
                            <tr>${headerCells}</tr>
                            ${filterRowHtml}
                        </thead>
                        <tbody class="p-datatable-tbody" data-part="tbody">
                            ${bodyRowsHtml}
                        </tbody>
                    </table>
                </div>
                ${paginatorHtml}
            </div>
        `;

        bindEvents();
    }

    function bindEvents() {
        const rootEl = container.firstElementChild as HTMLElement;
        if (!rootEl) return;

        // 1. Sortable Column Headers
        rootEl.querySelectorAll<HTMLElement>('.p-sortable-column').forEach(th => {
            th.addEventListener('click', () => {
                const field = th.getAttribute('data-field');
                if (!field) return;

                const existing = sortMeta.find(m => m.field === field);
                let nextOrder = 1;
                if (existing) {
                    if (existing.order === 1) nextOrder = -1;
                    else if (existing.order === -1) nextOrder = removableSort ? 0 : 1;
                }

                if (sortMode === 'multiple') {
                    if (nextOrder === 0) {
                        sortMeta = sortMeta.filter(m => m.field !== field);
                    } else if (existing) {
                        existing.order = nextOrder;
                    } else {
                        sortMeta.push({ field, order: nextOrder });
                    }
                } else {
                    if (nextOrder === 0) {
                        sortMeta = [];
                    } else {
                        sortMeta = [{ field, order: nextOrder }];
                    }
                }

                container.dispatchEvent(new CustomEvent('datatable:sort', {
                    bubbles: true,
                    detail: { sortMeta }
                }));

                render();
            });
        });

        // 2. Global Filter Input
        const globalInput = rootEl.querySelector<HTMLInputElement>('.p-datatable-global-filter');
        if (globalInput) {
            globalInput.addEventListener('input', (e) => {
                const target = e.target as HTMLInputElement;
                globalFilter = target.value;
                const pos = target.selectionStart;
                currentPage = 1;
                render();
                const reacquired = container.querySelector<HTMLInputElement>('.p-datatable-global-filter');
                if (reacquired) {
                    reacquired.focus();
                    if (pos != null) reacquired.setSelectionRange(pos, pos);
                }
            });
        }

        // 3. Column Row Filters
        rootEl.querySelectorAll<HTMLInputElement>('.p-datatable-filter-input[data-filter-field]').forEach(input => {
            input.addEventListener('input', (e) => {
                const target = e.target as HTMLInputElement;
                const field = input.getAttribute('data-filter-field')!;
                columnFilters[field] = target.value;
                const pos = target.selectionStart;
                currentPage = 1;
                render();
                const reacquired = container.querySelector<HTMLInputElement>(`.p-datatable-filter-input[data-filter-field="${field}"]`);
                if (reacquired) {
                    reacquired.focus();
                    if (pos != null) reacquired.setSelectionRange(pos, pos);
                }
            });
        });

        // 4. Export CSV Button
        const exportBtn = rootEl.querySelector('.p-datatable-export-btn');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => exportCSV());
        }

        // 5. Refresh Simulation Button
        const refreshBtn = rootEl.querySelector('.p-datatable-refresh-btn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                loading = true;
                render();
                setTimeout(() => {
                    loading = false;
                    render();
                }, 1000);
            });
        }

        // 6. Interactive Size Switcher
        rootEl.querySelectorAll<HTMLButtonElement>('.p-size-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const s = btn.getAttribute('data-size') as 'small' | 'normal' | 'large';
                if (s) {
                    currentSize = s;
                    render();
                }
            });
        });

        // 7. Select All Checkbox
        const selectAllBox = rootEl.querySelector('.p-select-all');
        if (selectAllBox) {
            selectAllBox.addEventListener('click', () => {
                const allSelected = selectAllBox.classList.contains('p-checked');
                const displayRows = rawData;
                if (allSelected) {
                    displayRows.forEach(r => selectedKeys.delete(r[dataKey]));
                } else {
                    displayRows.forEach(r => selectedKeys.add(r[dataKey]));
                }
                dispatchSelectionEvent();
                render();
            });
        }

        // 8. Clear Selection Button
        const clearSelBtn = rootEl.querySelector('.p-datatable-clear-selection');
        if (clearSelBtn) {
            clearSelBtn.addEventListener('click', () => {
                selectedKeys.clear();
                dispatchSelectionEvent();
                render();
            });
        }

        // 9. Row Checkbox Selection
        rootEl.querySelectorAll<HTMLElement>('.p-row-checkbox').forEach(box => {
            box.addEventListener('click', (e) => {
                e.stopPropagation();
                const key = box.getAttribute('data-row-key');
                if (!key) return;
                const matchedRow = rawData.find(r => String(r[dataKey]) === String(key));
                const realKey = matchedRow ? matchedRow[dataKey] : key;

                if (selectedKeys.has(realKey)) selectedKeys.delete(realKey);
                else selectedKeys.add(realKey);

                dispatchSelectionEvent();
                render();
            });
        });

        // 10. Row Radio Selection
        rootEl.querySelectorAll<HTMLElement>('.p-row-radio').forEach(radio => {
            radio.addEventListener('click', (e) => {
                e.stopPropagation();
                const key = radio.getAttribute('data-row-key');
                if (!key) return;
                const matchedRow = rawData.find(r => String(r[dataKey]) === String(key));
                const realKey = matchedRow ? matchedRow[dataKey] : key;

                selectedKeys.clear();
                selectedKeys.add(realKey);
                dispatchSelectionEvent();
                render();
            });
        });

        // 11. Row Click Selection
        if (selectionMode === 'single' || selectionMode === 'multiple') {
            rootEl.querySelectorAll<HTMLTableRowElement>('.p-datatable-tbody > tr[data-row-key]').forEach(tr => {
                tr.addEventListener('click', (e) => {
                    const key = tr.getAttribute('data-row-key');
                    if (!key) return;
                    const matchedRow = rawData.find(r => String(r[dataKey]) === String(key));
                    const realKey = matchedRow ? matchedRow[dataKey] : key;

                    if (selectionMode === 'single') {
                        if (selectedKeys.has(realKey)) selectedKeys.delete(realKey);
                        else {
                            selectedKeys.clear();
                            selectedKeys.add(realKey);
                        }
                    } else if (selectionMode === 'multiple') {
                        const mouseEvent = e as MouseEvent;
                        if (metaKeySelection && (mouseEvent.ctrlKey || mouseEvent.metaKey)) {
                            if (selectedKeys.has(realKey)) selectedKeys.delete(realKey);
                            else selectedKeys.add(realKey);
                        } else {
                            selectedKeys.clear();
                            selectedKeys.add(realKey);
                        }
                    }
                    dispatchSelectionEvent();
                    render();
                });
            });
        }

        // 12. Row Toggler (Expansion)
        rootEl.querySelectorAll<HTMLElement>('.p-row-toggler').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const key = btn.getAttribute('data-row-key');
                if (!key) return;
                const matchedRow = rawData.find(r => String(r[dataKey]) === String(key));
                const realKey = matchedRow ? matchedRow[dataKey] : key;

                if (expandedKeys.has(realKey)) expandedKeys.delete(realKey);
                else expandedKeys.add(realKey);
                render();
            });
        });

        // 13. In-Place Cell Editing
        if (editMode === 'cell') {
            rootEl.querySelectorAll<HTMLElement>('.p-editable-cell').forEach(td => {
                td.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const rowKey = td.getAttribute('data-row-key');
                    const field = td.getAttribute('data-field');
                    if (!rowKey || !field) return;
                    const matchedRow = rawData.find(r => String(r[dataKey]) === String(rowKey));
                    const realKey = matchedRow ? matchedRow[dataKey] : rowKey;
                    editingCell = { rowKey: realKey, field };
                    render();
                });
            });

            const cellInput = rootEl.querySelector<HTMLInputElement>('.p-cell-editor-input');
            if (cellInput) {
                cellInput.focus();
                const saveCell = () => {
                    if (!editingCell) return;
                    const rowKey = editingCell.rowKey;
                    const field = editingCell.field;
                    const newVal = cellInput.value;
                    const matchedRow = rawData.find(r => String(r[dataKey]) === String(rowKey));
                    if (matchedRow) {
                        matchedRow[field] = newVal;
                        container.dispatchEvent(new CustomEvent('datatable:cell-edit-complete', {
                            bubbles: true,
                            detail: { row: matchedRow, field, newValue: newVal }
                        }));
                    }
                    editingCell = null;
                    render();
                };

                cellInput.addEventListener('blur', saveCell);
                cellInput.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') {
                        saveCell();
                    } else if (e.key === 'Escape') {
                        editingCell = null;
                        render();
                    }
                });
            }
        }

        // 14. Pagination Controls
        rootEl.querySelectorAll<HTMLButtonElement>('.p-paginator-page, .p-paginator-nav').forEach(btn => {
            btn.addEventListener('click', () => {
                const targetPage = Number(btn.getAttribute('data-page'));
                if (!isNaN(targetPage) && targetPage > 0) {
                    currentPage = targetPage;
                    render();
                }
            });
        });

        const rowsSelect = rootEl.querySelector<HTMLSelectElement>('.p-datatable-rows-select');
        if (rowsSelect) {
            rowsSelect.addEventListener('change', () => {
                rowsPerPage = Number(rowsSelect.value);
                currentPage = 1;
                render();
            });
        }
    }

    function dispatchSelectionEvent() {
        const selectedRows = rawData.filter(r => selectedKeys.has(r[dataKey]));
        container.dispatchEvent(new CustomEvent('datatable:selection-change', {
            bubbles: true,
            detail: { selectedKeys: Array.from(selectedKeys), selectedRows }
        }));
    }

    // Initial render
    render();
}
