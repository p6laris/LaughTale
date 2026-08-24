/**
 * SoftMax.LaughTale: Enterprise DataTable Component (Aura Design System compliant)
 * High-performance tabular data grid supporting sorting, filtering, pagination, selection,
 * frozen columns, row expansion, in-place cell editing, loading states, and CSV export.
 */

import { injectIslandStyle } from '../runtime/styles';
import { LucideIcons } from '../icons/lucide';

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
}

const DATATABLE_CSS = `
.p-datatable {
    position: relative;
    border-radius: var(--p-border-radius-lg, 8px);
    background: var(--p-surface-0, #ffffff);
    color: var(--p-surface-800, #1e293b);
    font-family: var(--p-font-family, inherit);
    border: 1px solid var(--p-surface-200, #e2e8f0);
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
    padding: 0.75rem 1rem;
    background: var(--p-surface-50, #f8fafc);
    color: var(--p-surface-700, #334155);
    font-weight: 600;
    font-size: 0.8125rem;
    border-bottom: 1px solid var(--p-surface-200, #e2e8f0);
    text-align: left;
    user-select: none;
    transition: background-color 0.15s ease, color 0.15s ease;
}

.p-datatable-thead > tr > th.p-sortable-column {
    cursor: pointer;
}

.p-datatable-thead > tr > th.p-sortable-column:hover {
    background: var(--p-surface-100, #f1f5f9);
    color: var(--p-surface-900, #0f172a);
}

.p-datatable-header-content {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.p-datatable-sort-icon {
    display: inline-flex;
    align-items: center;
    color: var(--p-surface-400, #94a3b8);
    transition: color 0.15s ease;
}
.p-sortable-column.p-sorted .p-datatable-sort-icon {
    color: var(--p-primary-500, #10b981);
}

.p-datatable-sort-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 1.125rem;
    height: 1.125rem;
    border-radius: 9999px;
    background: var(--p-primary-500, #10b981);
    color: #ffffff;
    font-size: 0.6875rem;
    font-weight: 700;
}

/* Filter Row */
.p-datatable-filter-row > th {
    padding: 0.35rem 0.75rem;
    background: var(--p-surface-50, #f8fafc);
    border-bottom: 1px solid var(--p-surface-200, #e2e8f0);
}
.p-datatable-filter-input {
    width: 100%;
    padding: 0.35rem 0.6rem;
    font-size: 0.8125rem;
    border: 1px solid var(--p-surface-300, #cbd5e1);
    border-radius: var(--p-border-radius, 6px);
    background: var(--p-surface-0, #ffffff);
    color: inherit;
    outline: none;
    transition: border-color 0.15s ease, box-shadow 0.15s ease;
}
.p-datatable-filter-input:focus {
    border-color: var(--p-primary-500, #10b981);
    box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.2);
}

/* Body Cells */
.p-datatable-tbody > tr {
    transition: background-color 0.15s ease, color 0.15s ease;
}

.p-datatable-tbody > tr > td {
    padding: 0.75rem 1rem;
    border-bottom: 1px solid var(--p-surface-200, #e2e8f0);
    color: var(--p-surface-700, #334155);
}

.p-datatable-tbody > tr:hover {
    background: var(--p-surface-50, #f8fafc);
}

.p-datatable-tbody > tr.p-highlight {
    background: rgba(16, 185, 129, 0.08) !important;
    color: var(--p-primary-700, #047857) !important;
}

.p-datatable-tbody > tr.p-highlight > td {
    color: inherit;
}

/* Size Variants */
.p-datatable-sm .p-datatable-thead > tr > th,
.p-datatable-sm .p-datatable-tbody > tr > td {
    padding: 0.375rem 0.625rem;
    font-size: 0.75rem;
}

.p-datatable-lg .p-datatable-thead > tr > th,
.p-datatable-lg .p-datatable-tbody > tr > td {
    padding: 1rem 1.25rem;
    font-size: 0.9375rem;
}

/* Striped Rows */
.p-datatable-striped .p-datatable-tbody > tr:nth-child(even):not(.p-highlight) {
    background: var(--p-surface-50, #f8fafc);
}

/* Grid Lines */
.p-datatable-gridlines .p-datatable-thead > tr > th,
.p-datatable-gridlines .p-datatable-tbody > tr > td {
    border: 1px solid var(--p-surface-200, #e2e8f0);
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
    background: var(--p-surface-50, #f8fafc);
    border-bottom: 1px solid var(--p-surface-200, #e2e8f0);
}
.p-row-toggler {
    background: transparent;
    border: none;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.25rem;
    border-radius: 9999px;
    color: var(--p-surface-500, #64748b);
    transition: background-color 0.15s ease, color 0.15s ease;
}
.p-row-toggler:hover {
    background: var(--p-surface-200, #e2e8f0);
    color: var(--p-surface-800, #1e293b);
}

/* Custom Checkbox & Radio */
.p-checkbox-box, .p-radio-box {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 1.125rem;
    height: 1.125rem;
    border-radius: var(--p-border-radius-xs, 4px);
    border: 2px solid var(--p-surface-300, #cbd5e1);
    background: var(--p-surface-0, #ffffff);
    cursor: pointer;
    transition: all 0.15s ease;
}
.p-radio-box {
    border-radius: 9999px;
}
.p-checkbox-box.p-checked, .p-radio-box.p-checked {
    background: var(--p-primary-500, #10b981);
    border-color: var(--p-primary-500, #10b981);
    color: #ffffff;
}

/* In-place Editable Cell */
.p-editable-cell {
    cursor: pointer;
    position: relative;
    border-radius: var(--p-border-radius-xs, 4px);
}
.p-editable-cell:hover {
    outline: 1px dashed var(--p-primary-400, #34d399);
}
.p-cell-editor-input {
    width: 100%;
    padding: 0.25rem 0.5rem;
    font-size: inherit;
    border: 1px solid var(--p-primary-500, #10b981);
    border-radius: var(--p-border-radius-xs, 4px);
    background: var(--p-surface-0, #ffffff);
    color: inherit;
    outline: none;
    box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.2);
}

/* Toolbar & Global Filter */
.p-datatable-header-toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.875rem 1.25rem;
    border-bottom: 1px solid var(--p-surface-200, #e2e8f0);
    background: var(--p-surface-0, #ffffff);
    flex-wrap: wrap;
    gap: 0.75rem;
}
.p-datatable-title {
    font-weight: 700;
    font-size: 1rem;
    color: var(--p-surface-900, #0f172a);
}

/* Paginator Integration */
.p-datatable-paginator {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.75rem 1.25rem;
    background: var(--p-surface-0, #ffffff);
    border-top: 1px solid var(--p-surface-200, #e2e8f0);
    font-size: 0.8125rem;
    color: var(--p-surface-600, #475569);
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
    border-radius: var(--p-border-radius, 6px);
    border: 1px solid transparent;
    background: transparent;
    cursor: pointer;
    font-weight: 600;
    font-size: 0.8125rem;
    color: var(--p-surface-700, #334155);
    transition: all 0.15s ease;
}
.p-paginator-page:hover:not(:disabled), .p-paginator-nav:hover:not(:disabled) {
    background: var(--p-surface-100, #f1f5f9);
    color: var(--p-surface-900, #0f172a);
}
.p-paginator-page.p-paginator-page-active {
    background: var(--p-primary-500, #10b981);
    color: #ffffff;
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
    background: rgba(255, 255, 255, 0.75);
    backdrop-filter: blur(1px);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
}

/* Skeleton Placeholders */
.p-datatable-skeleton-cell {
    height: 1rem;
    border-radius: 4px;
    background: linear-gradient(90deg, var(--p-surface-200, #e2e8f0) 25%, var(--p-surface-100, #f1f5f9) 50%, var(--p-surface-200, #e2e8f0) 75%);
    background-size: 200% 100%;
    animation: p-skeleton-shimmer 1.5s infinite;
}

@keyframes p-skeleton-shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
}

/* Dark Mode Tokens */
.dark .p-datatable,
[data-theme="dark"] .p-datatable {
    background: var(--p-surface-900, #0f172a) !important;
    color: var(--p-surface-100, #f1f5f9) !important;
    border-color: var(--p-surface-700, #334155) !important;
}
.dark .p-datatable-thead > tr > th,
[data-theme="dark"] .p-datatable-thead > tr > th {
    background: var(--p-surface-800, #1e293b) !important;
    color: var(--p-surface-200, #e2e8f0) !important;
    border-color: var(--p-surface-700, #334155) !important;
}
.dark .p-datatable-tbody > tr > td,
[data-theme="dark"] .p-datatable-tbody > tr > td {
    border-color: var(--p-surface-800, #1e293b) !important;
    color: var(--p-surface-200, #e2e8f0) !important;
}
.dark .p-datatable-tbody > tr:hover,
[data-theme="dark"] .p-datatable-tbody > tr:hover {
    background: var(--p-surface-800, #1e293b) !important;
}
.dark .p-datatable-striped .p-datatable-tbody > tr:nth-child(even):not(.p-highlight),
[data-theme="dark"] .p-datatable-striped .p-datatable-tbody > tr:nth-child(even):not(.p-highlight) {
    background: rgba(30, 41, 59, 0.5) !important;
}
.dark .p-datatable-header-toolbar,
.dark .p-datatable-paginator,
[data-theme="dark"] .p-datatable-header-toolbar,
[data-theme="dark"] .p-datatable-paginator {
    background: var(--p-surface-900, #0f172a) !important;
    border-color: var(--p-surface-700, #334155) !important;
    color: var(--p-surface-300, #cbd5e1) !important;
}
.dark .p-datatable-filter-row > th,
.dark .p-row-expansion,
[data-theme="dark"] .p-datatable-filter-row > th,
[data-theme="dark"] .p-row-expansion {
    background: var(--p-surface-800, #1e293b) !important;
    border-color: var(--p-surface-700, #334155) !important;
}
.dark .p-datatable-filter-input,
[data-theme="dark"] .p-datatable-filter-input {
    background: var(--p-surface-900, #0f172a) !important;
    border-color: var(--p-surface-600, #475569) !important;
    color: #ffffff !important;
}
.dark .p-datatable-loading-overlay,
[data-theme="dark"] .p-datatable-loading-overlay {
    background: rgba(15, 23, 42, 0.75) !important;
}
`;

export default function DataTableIsland(container: HTMLElement, props: DataTableProps) {
    injectIslandStyle('datatable', DATATABLE_CSS);

    const rawData: Record<string, any>[] = [...(props.value || props.data || [])];
    const columns: DataTableColumn[] = props.columns || [];
    const size = props.size || 'normal';
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

    // Helper: resolve deep nested property path (e.g. 'country.name')
    function resolveField(obj: any, field: string): any {
        if (!obj || !field) return '';
        if (field.includes('.')) {
            return field.split('.').reduce((acc, part) => acc?.[part], obj);
        }
        return obj[field];
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

    // Expose export method on container
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
        if (size === 'small') rootClasses.push('p-datatable-sm');
        if (size === 'large') rootClasses.push('p-datatable-lg');
        if (showGridlines) rootClasses.push('p-datatable-gridlines');
        if (stripedRows) rootClasses.push('p-datatable-striped');
        if (scrollable) rootClasses.push('p-datatable-scrollable');

        // Check if all current page rows are selected
        const allPageSelected = displayRows.length > 0 && displayRows.every(r => selectedKeys.has(r[dataKey]));

        // Generate Header Cells
        const headerCells = columns.map((col, cIdx) => {
            const isSortable = !!col.sortable;
            const sortItem = sortMeta.find(m => m.field === col.field);
            const isSorted = !!sortItem;
            const sortOrder = sortItem?.order || 0;
            const sortBadge = sortMode === 'multiple' && sortMeta.length > 1 && isSorted
                ? `<span class="p-datatable-sort-badge">${sortMeta.indexOf(sortItem!) + 1}</span>`
                : '';

            let sortIconSvg = '';
            if (isSortable) {
                if (sortOrder === 1) sortIconSvg = LucideIcons.arrowUp || '▲';
                else if (sortOrder === -1) sortIconSvg = LucideIcons.arrowDown || '▼';
                else sortIconSvg = LucideIcons.arrowUpDown || '↕';
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
                            ${allPageSelected ? LucideIcons.check || '✓' : ''}
                        </div>
                    </th>
                `;
            }

            // Radio Header (no select all for radio)
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
            // Skeleton Placeholder Rows
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
            // Empty State
            bodyRowsHtml = `
                <tr>
                    <td colspan="${columns.length}" style="text-align: center; padding: 3rem 1rem; color: var(--p-surface-400);">
                        <div style="display: flex; flex-direction: column; align-items: center; gap: 0.75rem;">
                            <span style="font-size: 1.75rem; color: var(--p-surface-400);">${LucideIcons.inbox || '📭'}</span>
                            <span style="font-weight: 600; font-size: 0.9375rem; color: var(--p-surface-700);">${emptyMessage}</span>
                        </div>
                    </td>
                </tr>
            `;
        } else {
            // Data Rows
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
                                    ${isSelected ? LucideIcons.check || '✓' : ''}
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
                                    ${isExpanded ? LucideIcons.chevronDown || '▼' : LucideIcons.chevronRight || '▶'}
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

                    let cellDisplay = rawVal ?? '';
                    if (typeof rawVal === 'number' && col.field.toLowerCase().includes('price')) {
                        cellDisplay = `$${rawVal.toLocaleString()}`;
                    }

                    const editableClass = editMode === 'cell' && col.field ? 'p-editable-cell' : '';

                    return `
                        <td class="${frozenClass} ${editableClass} ${col.bodyClass || ''}" 
                            data-row-key="${rowKey}" 
                            data-field="${col.field || ''}" 
                            style="${styleAttr}">
                            ${cellDisplay}
                        </td>
                    `;
                }).join('');

                const rowHtml = `
                    <tr class="${isSelected ? 'p-highlight' : ''}" data-row-key="${rowKey}">
                        ${cellTds}
                    </tr>
                `;

                // Row Expansion Detail
                let expansionHtml = '';
                if (isExpanded) {
                    expansionHtml = `
                        <tr class="p-row-expansion">
                            <td colspan="${columns.length}" style="padding: 1.25rem;">
                                <div style="display: flex; gap: 1.25rem; align-items: center;">
                                    <div style="width: 50px; height: 50px; border-radius: 8px; background: var(--p-surface-200); display: flex; align-items: center; justify-content: center; font-size: 1.25rem;">
                                        ${LucideIcons.package || '📦'}
                                    </div>
                                    <div style="display: flex; flex-direction: column; gap: 0.25rem;">
                                        <div style="font-weight: 700; color: var(--p-surface-900); font-size: 0.9375rem;">
                                            ${row.name || row.title || `Record #${rowKey}`}
                                        </div>
                                        <div style="font-size: 0.8125rem; color: var(--p-surface-500);">
                                            ${row.category ? `Category: ${row.category} • ` : ''}
                                            ${row.code ? `SKU: ${row.code} • ` : ''}
                                            ${row.quantity != null ? `In Stock: ${row.quantity} units` : ''}
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

        // Paginator HTML
        let paginatorHtml = '';
        if (paginator) {
            const startRecord = totalRecords > 0 ? firstIdx + 1 : 0;
            const endRecord = Math.min(firstIdx + rowsPerPage, totalRecords);
            const reportStr = (props.currentPageReportTemplate || 'Showing {first} to {last} of {totalRecords} entries')
                .replace('{first}', String(startRecord))
                .replace('{last}', String(endRecord))
                .replace('{totalRecords}', String(totalRecords));

            // Generate page numbers
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
                        <select class="p-datatable-rows-select" style="padding: 0.25rem 0.5rem; border-radius: 4px; border: 1px solid var(--p-surface-300); background: var(--p-surface-0); color: inherit; font-size: 0.8125rem;">
                            ${rowsPerPageOptions.map(opt => `<option value="${opt}" ${opt === rowsPerPage ? 'selected' : ''}>${opt}</option>`).join('')}
                        </select>
                    </div>
                </div>
            `;
        }

        // Global Toolbar
        let toolbarHtml = '';
        if (props.title || props.globalFilterFields || props.exportFilename) {
            toolbarHtml = `
                <div class="p-datatable-header-toolbar">
                    <div class="p-datatable-title">${props.title || ''}</div>
                    <div style="display: flex; align-items: center; gap: 0.75rem;">
                        ${props.globalFilterFields ? `
                            <div style="position: relative; display: flex; align-items: center;">
                                <input type="text" class="p-datatable-global-filter p-datatable-filter-input" placeholder="Search keywords..." value="${globalFilter}" style="width: 200px;" />
                            </div>
                        ` : ''}
                        <button type="button" class="p-datatable-export-btn" style="display: inline-flex; align-items: center; gap: 0.35rem; padding: 0.4rem 0.75rem; border-radius: 6px; border: 1px solid var(--p-surface-300); background: var(--p-surface-0); color: inherit; font-size: 0.8125rem; font-weight: 600; cursor: pointer;">
                            <span>${LucideIcons.fileSpreadsheet || '📊'}</span>
                            <span>Export CSV</span>
                        </button>
                    </div>
                </div>
            `;
        }

        // Loading Overlay
        let loadingOverlayHtml = '';
        if (loading && loadingMode === 'overlay') {
            loadingOverlayHtml = `
                <div class="p-datatable-loading-overlay">
                    <div style="width: 2.25rem; height: 2.25rem; border: 3px solid var(--p-primary-500); border-top-color: transparent; border-radius: 9999px; animation: p-spin 0.8s linear infinite;"></div>
                    <span style="font-size: 0.875rem; font-weight: 600; color: var(--p-surface-700);">Loading records...</span>
                </div>
            `;
        }

        const scrollWrapperStyle = scrollHeight ? `max-height: ${scrollHeight}; overflow-y: auto;` : '';

        container.innerHTML = `
            <div class="${rootClasses.join(' ')}">
                ${loadingOverlayHtml}
                ${toolbarHtml}
                <div class="p-datatable-scrollable-wrapper" style="${scrollWrapperStyle}">
                    <table class="p-datatable-table" style="${props.tableStyle || ''}">
                        <thead class="p-datatable-thead">
                            <tr>${headerCells}</tr>
                            ${filterRowHtml}
                        </thead>
                        <tbody class="p-datatable-tbody">
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
                globalFilter = (e.target as HTMLInputElement).value;
                currentPage = 1;
                render();
            });
        }

        // 3. Column Row Filters
        rootEl.querySelectorAll<HTMLInputElement>('.p-datatable-filter-input[data-filter-field]').forEach(input => {
            input.addEventListener('input', (e) => {
                const field = input.getAttribute('data-filter-field')!;
                columnFilters[field] = (e.target as HTMLInputElement).value;
                currentPage = 1;
                render();
            });
        });

        // 4. Export CSV Button
        const exportBtn = rootEl.querySelector('.p-datatable-export-btn');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => exportCSV());
        }

        // 5. Select All Checkbox
        const selectAllBox = rootEl.querySelector('.p-select-all');
        if (selectAllBox) {
            selectAllBox.addEventListener('click', () => {
                const allSelected = selectAllBox.classList.contains('p-checked');
                const displayRows = getFilteredRows();
                if (allSelected) {
                    displayRows.forEach(r => selectedKeys.delete(r[dataKey]));
                } else {
                    displayRows.forEach(r => selectedKeys.add(r[dataKey]));
                }
                dispatchSelectionEvent();
                render();
            });
        }

        // 6. Row Checkbox Selection
        rootEl.querySelectorAll<HTMLElement>('.p-row-checkbox').forEach(box => {
            box.addEventListener('click', (e) => {
                e.stopPropagation();
                const key = box.getAttribute('data-row-key');
                if (!key) return;
                if (selectedKeys.has(key)) selectedKeys.delete(key);
                else selectedKeys.add(key);
                dispatchSelectionEvent();
                render();
            });
        });

        // 7. Row Radio Selection
        rootEl.querySelectorAll<HTMLElement>('.p-row-radio').forEach(radio => {
            radio.addEventListener('click', (e) => {
                e.stopPropagation();
                const key = radio.getAttribute('data-row-key');
                if (!key) return;
                selectedKeys.clear();
                selectedKeys.add(key);
                dispatchSelectionEvent();
                render();
            });
        });

        // 8. Row Click Selection
        if (selectionMode === 'single' || selectionMode === 'multiple') {
            rootEl.querySelectorAll<HTMLTableRowElement>('.p-datatable-tbody > tr[data-row-key]').forEach(tr => {
                tr.addEventListener('click', (e) => {
                    const key = tr.getAttribute('data-row-key');
                    if (!key) return;

                    if (selectionMode === 'single') {
                        if (selectedKeys.has(key)) selectedKeys.delete(key);
                        else {
                            selectedKeys.clear();
                            selectedKeys.add(key);
                        }
                    } else if (selectionMode === 'multiple') {
                        const mouseEvent = e as MouseEvent;
                        if (metaKeySelection && (mouseEvent.ctrlKey || mouseEvent.metaKey)) {
                            if (selectedKeys.has(key)) selectedKeys.delete(key);
                            else selectedKeys.add(key);
                        } else {
                            selectedKeys.clear();
                            selectedKeys.add(key);
                        }
                    }
                    dispatchSelectionEvent();
                    render();
                });
            });
        }

        // 9. Row Toggler (Expansion)
        rootEl.querySelectorAll<HTMLElement>('.p-row-toggler').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const key = btn.getAttribute('data-row-key');
                if (!key) return;
                if (expandedKeys.has(key)) expandedKeys.delete(key);
                else expandedKeys.add(key);
                render();
            });
        });

        // 10. In-Place Cell Editing
        if (editMode === 'cell') {
            rootEl.querySelectorAll<HTMLElement>('.p-editable-cell').forEach(td => {
                td.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const rowKey = td.getAttribute('data-row-key');
                    const field = td.getAttribute('data-field');
                    if (!rowKey || !field) return;
                    editingCell = { rowKey, field };
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

        // 11. Pagination Controls
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

    function getFilteredRows(): Record<string, any>[] {
        return rawData;
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
