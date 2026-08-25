/**
 * SoftMax.LaughTale: Enterprise TreeTable Component (Aura Design System compliant)
 * Hierarchical data grid visualizer in tabular format with expand/collapse rows,
 * single/multiple/checkbox row selections, single & multi-column sorting,
 * full pagination, vertical/horizontal/frozen scrolling, column resizing,
 * column toggling, multi-column filtering, lazy loading, skeleton loading,
 * and context menus.
 */

import { TreeTableNode, TreeTableColumn } from '../types/models';
import { injectIslandStyle } from '../runtime/styles';

export interface TreeTableProps {
    value?: any[];
    nodes?: any[];
    columns?: TreeTableColumn[];
    size?: 'small' | 'normal' | 'large';
    showGridlines?: boolean;
    selectionMode?: 'single' | 'multiple' | 'checkbox' | null;
    selectionKeys?: any;
    expandedKeys?: Record<string, boolean>;
    metaKeySelection?: boolean;
    sortMode?: 'single' | 'multiple';
    sortField?: string;
    sortOrder?: number;
    multiSortMeta?: { field: string; order: number }[];
    removableSort?: boolean;
    paginator?: boolean;
    rows?: number;
    rowsPerPageOptions?: number[];
    paginatorTemplate?: string;
    currentPageReportTemplate?: string;
    headlessPaginator?: boolean;
    scrollable?: boolean;
    scrollHeight?: string;
    resizableColumns?: boolean;
    columnResizeMode?: 'fit' | 'expand';
    columnToggle?: boolean;
    filter?: boolean;
    filterMode?: 'lenient' | 'strict';
    lazy?: boolean;
    loading?: boolean;
    skeleton?: boolean;
    emptyMessage?: string;
    headerTitle?: string;
    footerText?: string;
    contextMenu?: boolean;
    events?: boolean;
}

const TREETABLE_CSS = `
.p-treetable {
    position: relative;
    background: var(--p-surface-0, #ffffff);
    color: var(--p-surface-700, #334155);
    border: 1px solid var(--p-surface-200, #e2e8f0);
    border-radius: var(--p-border-radius-md, 6px);
    font-family: var(--p-font-family, inherit);
    box-sizing: border-box;
    width: 100%;
}

.p-treetable-table {
    border-spacing: 0;
    width: 100%;
    border-collapse: collapse;
    table-layout: auto;
}

.p-treetable-thead > tr > th {
    background: var(--p-surface-50, #f8fafc);
    color: var(--p-surface-700, #334155);
    padding: 0.75rem 1rem;
    border-bottom: 1px solid var(--p-surface-200, #e2e8f0);
    font-weight: 600;
    text-align: left;
    transition: background-color 0.15s ease, color 0.15s ease;
    user-select: none;
    position: relative;
    font-size: 0.875rem;
}

.p-treetable-thead > tr > th.p-sortable-column {
    cursor: pointer;
}
.p-treetable-thead > tr > th.p-sortable-column:hover {
    background: var(--p-surface-100, #f1f5f9);
    color: var(--p-surface-900, #0f172a);
}

.p-treetable-thead > tr > th.p-highlight {
    color: var(--p-primary-600, #059669);
    background: var(--p-surface-100, #f1f5f9);
}

.p-treetable-tbody > tr {
    background: var(--p-surface-0, #ffffff);
    color: var(--p-surface-700, #334155);
    transition: background-color 0.15s ease;
}

.p-treetable-tbody > tr:not(.p-highlight):hover {
    background: var(--p-surface-50, #f8fafc);
    color: var(--p-surface-900, #0f172a);
}

.p-treetable-tbody > tr.p-highlight {
    background: var(--p-primary-50, #ecfdf5);
    color: var(--p-primary-700, #047857);
}

.p-treetable-tbody > tr > td {
    padding: 0.75rem 1rem;
    border-bottom: 1px solid var(--p-surface-200, #e2e8f0);
    font-size: 0.875rem;
    vertical-align: middle;
}

/* Gridlines mode */
.p-treetable.p-treetable-gridlines .p-treetable-thead > tr > th,
.p-treetable.p-treetable-gridlines .p-treetable-tbody > tr > td {
    border: 1px solid var(--p-surface-200, #e2e8f0);
}

/* Size Variants */
.p-treetable.p-treetable-sm .p-treetable-thead > tr > th,
.p-treetable.p-treetable-sm .p-treetable-tbody > tr > td {
    padding: 0.45rem 0.65rem;
    font-size: 0.8125rem;
}
.p-treetable.p-treetable-lg .p-treetable-thead > tr > th,
.p-treetable.p-treetable-lg .p-treetable-tbody > tr > td {
    padding: 1rem 1.25rem;
    font-size: 0.9375rem;
}

/* Toggler Button */
.p-treetable-toggler {
    width: 1.75rem;
    height: 1.75rem;
    border-radius: 9999px;
    border: none;
    background: transparent;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: var(--p-surface-500, #64748b);
    transition: background-color 0.15s ease, transform 0.2s ease;
    margin-right: 0.35rem;
    padding: 0;
}
.p-treetable-toggler:hover {
    background-color: var(--p-surface-200, #e2e8f0);
    color: var(--p-surface-900, #0f172a);
}
.p-treetable-toggler.p-hidden-space {
    visibility: hidden;
    pointer-events: none;
}

/* Checkbox */
.p-treetable-checkbox {
    width: 1.125rem;
    height: 1.125rem;
    border-radius: 4px;
    border: 1px solid var(--p-surface-300, #cbd5e1);
    background: var(--p-surface-0, #ffffff);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin-right: 0.5rem;
    cursor: pointer;
    transition: background-color 0.15s, border-color 0.15s;
}
.p-treetable-checkbox.p-highlight {
    background: var(--p-primary-500, #10b981);
    border-color: var(--p-primary-500, #10b981);
    color: #ffffff;
}
.p-treetable-checkbox.p-indeterminate {
    background: var(--p-primary-500, #10b981);
    border-color: var(--p-primary-500, #10b981);
    color: #ffffff;
}

/* Sort badge for multi-sort */
.p-sortable-badge {
    background: var(--p-primary-500, #10b981);
    color: #ffffff;
    font-size: 0.6875rem;
    font-weight: 700;
    width: 1.125rem;
    height: 1.125rem;
    border-radius: 9999px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin-left: 0.25rem;
}

/* Column Resizer */
.p-column-resizer {
    position: absolute;
    top: 0;
    right: 0;
    width: 0.5rem;
    height: 100%;
    cursor: col-resize;
    user-select: none;
    z-index: 1;
}

/* Frozen Columns */
.p-frozen-left {
    position: sticky;
    left: 0;
    z-index: 2;
    background: inherit;
}
.p-frozen-right {
    position: sticky;
    right: 0;
    z-index: 2;
    background: inherit;
}

/* Scrollable Container */
.p-treetable-scrollable-wrapper {
    overflow: auto;
    position: relative;
}

/* Tag / Badge */
.p-treetable-tag {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.2rem 0.5rem;
    border-radius: 4px;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.02em;
}
.p-tag-warn { background: #fef3c7; color: #b45309; }
.p-tag-info { background: #e0f2fe; color: #0369a1; }
.p-tag-success { background: #dcfce7; color: #15803d; }
.p-tag-secondary { background: #f1f5f9; color: #475569; }

/* Paginator Integration */
.p-treetable-paginator {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.75rem 1rem;
    border-top: 1px solid var(--p-surface-200, #e2e8f0);
    background: var(--p-surface-0, #ffffff);
    flex-wrap: wrap;
    gap: 0.75rem;
}
.p-treetable-paginator-btn {
    width: 2.25rem;
    height: 2.25rem;
    border-radius: 9999px;
    border: none;
    background: transparent;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: var(--p-surface-700, #334155);
    font-weight: 600;
    font-size: 0.8125rem;
    transition: background-color 0.15s ease;
}
.p-treetable-paginator-btn:hover:not(:disabled) {
    background: var(--p-surface-100, #f1f5f9);
}
.p-treetable-paginator-btn.p-highlight {
    background: var(--p-surface-900, #0f172a);
    color: #ffffff;
}
.p-treetable-paginator-btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
}

/* Loading Mask Overlay */
.p-treetable-loading-mask {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.75);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;
    border-radius: var(--p-border-radius-md, 6px);
}

/* Skeleton Rows */
.p-treetable-skeleton-line {
    height: 1rem;
    background: var(--p-surface-200, #e2e8f0);
    border-radius: 4px;
    animation: pTableSkeletonPulse 1.5s infinite;
}
@keyframes pTableSkeletonPulse {
    0%, 100% { opacity: 0.5; }
    50% { opacity: 1; }
}

/* Context Menu */
.p-treetable-contextmenu {
    position: fixed;
    z-index: 9999;
    background: var(--p-surface-0, #ffffff);
    border: 1px solid var(--p-surface-200, #e2e8f0);
    border-radius: 6px;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    padding: 0.35rem;
    min-width: 140px;
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
}
.p-treetable-contextmenu-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.45rem 0.65rem;
    font-size: 0.8125rem;
    color: var(--p-surface-700);
    border-radius: 4px;
    cursor: pointer;
    transition: background 0.15s ease;
}
.p-treetable-contextmenu-item:hover {
    background: var(--p-surface-100);
    color: var(--p-surface-900);
}

/* Dark Mode Tokens */
.dark .p-treetable,
[data-theme="dark"] .p-treetable {
    background: var(--p-surface-900, #0f172a) !important;
    color: var(--p-surface-100, #f8fafc) !important;
    border-color: var(--p-surface-700, #334155) !important;
}
.dark .p-treetable-thead > tr > th,
[data-theme="dark"] .p-treetable-thead > tr > th {
    background: var(--p-surface-950, #020617) !important;
    color: var(--p-surface-200, #e2e8f0) !important;
    border-color: var(--p-surface-700, #334155) !important;
}
.dark .p-treetable-tbody > tr,
[data-theme="dark"] .p-treetable-tbody > tr {
    background: var(--p-surface-900, #0f172a) !important;
    color: var(--p-surface-200, #e2e8f0) !important;
}
.dark .p-treetable-tbody > tr:not(.p-highlight):hover,
[data-theme="dark"] .p-treetable-tbody > tr:not(.p-highlight):hover {
    background: var(--p-surface-800, #1e293b) !important;
    color: var(--p-surface-0, #ffffff) !important;
}
.dark .p-treetable-tbody > tr.p-highlight,
[data-theme="dark"] .p-treetable-tbody > tr.p-highlight {
    background: rgba(16, 185, 129, 0.16) !important;
    color: var(--p-primary-300, #6ee7b7) !important;
}
.dark .p-treetable-tbody > tr > td,
[data-theme="dark"] .p-treetable-tbody > tr > td {
    border-color: var(--p-surface-700, #334155) !important;
}
.dark .p-treetable-paginator,
[data-theme="dark"] .p-treetable-paginator {
    background: var(--p-surface-900, #0f172a) !important;
    border-color: var(--p-surface-700, #334155) !important;
}
.dark .p-treetable-paginator-btn.p-highlight,
[data-theme="dark"] .p-treetable-paginator-btn.p-highlight {
    background: var(--p-surface-0, #ffffff) !important;
    color: var(--p-surface-900, #0f172a) !important;
}
.dark .p-treetable-checkbox,
[data-theme="dark"] .p-treetable-checkbox {
    background: var(--p-surface-950, #020617) !important;
    border-color: var(--p-surface-700, #334155) !important;
}
.dark .p-treetable-loading-mask,
[data-theme="dark"] .p-treetable-loading-mask {
    background: rgba(15, 23, 42, 0.8) !important;
}
.dark .p-treetable-contextmenu,
[data-theme="dark"] .p-treetable-contextmenu {
    background: var(--p-surface-900, #0f172a) !important;
    border-color: var(--p-surface-700, #334155) !important;
}
`;

const SVG_ICONS = {
    chevronRight: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>',
    chevronDown: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>',
    chevronLeft: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>',
    firstPage: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m11 17-5-5 5-5"/><path d="m18 17-5-5 5-5"/><path d="M6 19V5"/></svg>',
    lastPage: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 17 5-5-5-5"/><path d="m13 17 5-5-5-5"/><path d="M18 19V5"/></svg>',
    sortAsc: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m18 15-6-6-6 6"/></svg>',
    sortDesc: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>',
    sortNone: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m7 15 5 5 5-5"/><path d="m7 9 5-5 5 5"/></svg>',
    folder: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/></svg>',
    file: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/></svg>',
    image: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>',
    video: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m22 8-6 4 6 4V8Z"/><rect width="14" height="12" x="2" y="6" rx="2" ry="2"/></svg>',
    check: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
    minus: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="5" x2="19" y1="12" y2="12"/></svg>',
    search: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>',
    cog: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z"/><path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"/></svg>',
    spinner: '<svg class="animate-spin" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>',
    refresh: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 16h5v5"/></svg>',
    download: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>',
    pencil: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>',
    trash: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>',
    plus: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg>'
};

export default function TreeTableIsland(container: HTMLElement, props: TreeTableProps) {
    injectIslandStyle('treetable', TREETABLE_CSS);

    let rawNodes: any[] = JSON.parse(JSON.stringify(props.value || props.nodes || []));
    let columns: TreeTableColumn[] = props.columns ? [...props.columns] : [
        { field: 'name', header: 'Name', expander: true },
        { field: 'size', header: 'Size', sortable: true },
        { field: 'type', header: 'Type', sortable: true }
    ];

    let visibleFields = columns.map(c => c.field);
    let size = props.size || 'normal';
    let showGridlines = !!props.showGridlines;
    let selectionMode = props.selectionMode || null;
    let metaKeySelection = props.metaKeySelection ?? true;
    let isScrollable = !!props.scrollable;
    let scrollHeight = props.scrollHeight || 'auto';
    let isPaginator = !!props.paginator;
    let rowsPerPage = props.rows || 5;
    let currentPage = 0;
    let rowsPerPageOptions = props.rowsPerPageOptions || [5, 10, 25];
    let isLazy = !!props.lazy;
    let isLoading = !!props.loading;
    let isSkeleton = !!props.skeleton;
    let columnToggle = !!props.columnToggle;
    let contextMenuEnabled = !!props.contextMenu;

    // Sorting state
    let sortMode = props.sortMode || 'single';
    let sortField = props.sortField || null;
    let sortOrder = props.sortOrder ?? 1; // 1 = asc, -1 = desc, 0 = none
    let multiSortMeta: { field: string; order: number }[] = props.multiSortMeta ? [...props.multiSortMeta] : [];
    let removableSort = !!props.removableSort;

    // Filter state
    let globalFilter = '';
    let columnFilters: Record<string, string> = {};

    // Expansion & Selection
    let expandedKeys: Record<string, boolean> = { ...(props.expandedKeys || { '0': true }) };
    let singleSelectionKey: string | null = null;
    let multiSelectionKeys: Record<string, boolean> = {};
    let checkboxSelectionKeys: Record<string, { checked?: boolean; partialChecked?: boolean }> = {};
    let selectedContextMenuNode: any = null;

    if (props.selectionKeys) {
        if (selectionMode === 'single' && typeof props.selectionKeys === 'string') {
            singleSelectionKey = props.selectionKeys;
        } else if (selectionMode === 'multiple') {
            multiSelectionKeys = { ...props.selectionKeys };
        } else if (selectionMode === 'checkbox') {
            checkboxSelectionKeys = { ...props.selectionKeys };
        }
    }

    // Maps
    let nodeMap = new Map<string, any>();
    let parentMap = new Map<string, any>();

    function buildMaps(nodesList: any[], parent: any = null) {
        nodesList.forEach(node => {
            const key = String(node.key || node.id || Math.random().toString());
            node.key = key;
            node.data = node.data || { name: node.label || node.name, size: '—', type: 'Folder' };
            nodeMap.set(key, node);
            if (parent) parentMap.set(key, parent);
            if (node.children && node.children.length) {
                buildMaps(node.children, node);
            }
        });
    }

    buildMaps(rawNodes);

    function notifyToast(severity: string, summary: string, detail: string) {
        if (props.events && (window as any).AuraToast) {
            (window as any).AuraToast.add({ severity, summary, detail, life: 3000 });
        }
    }

    function getSeverity(type: string): string {
        switch (type) {
            case 'Folder': return 'warn';
            case 'Document': return 'info';
            case 'Picture': return 'success';
            case 'Video': return 'success';
            case 'Text': return 'secondary';
            default: return 'secondary';
        }
    }

    function getIcon(type: string, isFolderOpen: boolean): string {
        switch (type) {
            case 'Folder': return isFolderOpen ? SVG_ICONS.folder : SVG_ICONS.folder;
            case 'Picture': return SVG_ICONS.image;
            case 'Video': return SVG_ICONS.video;
            default: return SVG_ICONS.file;
        }
    }

    // Checkbox cascading
    function setCheckboxState(node: any, checked: boolean) {
        const key = String(node.key);
        checkboxSelectionKeys[key] = { checked, partialChecked: false };
        if (node.children && node.children.length) {
            node.children.forEach((c: any) => setCheckboxState(c, checked));
        }
    }

    function updateAncestorCheckboxes(node: any) {
        const parent = parentMap.get(String(node.key));
        if (!parent) return;

        const parentKey = String(parent.key);
        const children = parent.children || [];
        let allChecked = true;
        let anyChecked = false;
        let anyPartial = false;

        children.forEach((c: any) => {
            const state = checkboxSelectionKeys[String(c.key)];
            if (state?.checked) anyChecked = true;
            else allChecked = false;
            if (state?.partialChecked) anyPartial = true;
        });

        if (allChecked) {
            checkboxSelectionKeys[parentKey] = { checked: true, partialChecked: false };
        } else if (anyChecked || anyPartial) {
            checkboxSelectionKeys[parentKey] = { checked: false, partialChecked: true };
        } else {
            delete checkboxSelectionKeys[parentKey];
        }

        updateAncestorCheckboxes(parent);
    }

    function toggleExpand(node: any) {
        const key = String(node.key);
        if (expandedKeys[key]) {
            delete expandedKeys[key];
            render();
        } else {
            expandedKeys[key] = true;
            if (isLazy && (!node.children || node.children.length === 0)) {
                node.loading = true;
                render();
                setTimeout(() => {
                    node.loading = false;
                    node.children = [
                        { key: `${key}-0`, data: { name: `${node.data.name} - 0`, size: `${Math.floor(Math.random() * 800) + 50}kb`, type: 'Document' } },
                        { key: `${key}-1`, data: { name: `${node.data.name} - 1`, size: `${Math.floor(Math.random() * 800) + 50}kb`, type: 'Text' } }
                    ];
                    buildMaps(rawNodes);
                    render();
                }, 500);
                return;
            }
            render();
        }
    }

    function handleSort(field: string) {
        if (sortMode === 'single') {
            if (sortField === field) {
                if (sortOrder === 1) sortOrder = -1;
                else if (sortOrder === -1 && removableSort) {
                    sortField = null;
                    sortOrder = 0;
                } else {
                    sortOrder = 1;
                }
            } else {
                sortField = field;
                sortOrder = 1;
            }
        } else if (sortMode === 'multiple') {
            const existingIdx = multiSortMeta.findIndex(m => m.field === field);
            if (existingIdx >= 0) {
                if (multiSortMeta[existingIdx].order === 1) {
                    multiSortMeta[existingIdx].order = -1;
                } else if (removableSort) {
                    multiSortMeta.splice(existingIdx, 1);
                } else {
                    multiSortMeta[existingIdx].order = 1;
                }
            } else {
                multiSortMeta.push({ field, order: 1 });
            }
        }
        render();
    }

    function compareNodes(a: any, b: any): number {
        if (sortMode === 'single' && sortField && sortOrder !== 0) {
            const valA = a.data[sortField] ?? '';
            const valB = b.data[sortField] ?? '';
            const res = typeof valA === 'number' ? (valA - valB) : String(valA).localeCompare(String(valB));
            return res * sortOrder;
        } else if (sortMode === 'multiple' && multiSortMeta.length > 0) {
            for (let meta of multiSortMeta) {
                const valA = a.data[meta.field] ?? '';
                const valB = b.data[meta.field] ?? '';
                const res = typeof valA === 'number' ? (valA - valB) : String(valA).localeCompare(String(valB));
                if (res !== 0) return res * meta.order;
            }
        }
        return 0;
    }

    function filterAndSort(nodesList: any[]): any[] {
        let result = nodesList.filter(node => {
            if (globalFilter) {
                const q = globalFilter.toLowerCase();
                const matchName = String(node.data?.name || '').toLowerCase().includes(q);
                const matchType = String(node.data?.type || '').toLowerCase().includes(q);
                const matchSize = String(node.data?.size || '').toLowerCase().includes(q);
                const matchChildren = node.children && filterAndSort(node.children).length > 0;
                if (!matchName && !matchType && !matchSize && !matchChildren) return false;
            }
            for (let [field, filterVal] of Object.entries(columnFilters)) {
                if (filterVal) {
                    const q = filterVal.toLowerCase();
                    const val = String(node.data?.[field] || '').toLowerCase();
                    if (!val.includes(q)) return false;
                }
            }
            return true;
        });

        result = [...result].sort(compareNodes);
        return result.map(node => ({
            ...node,
            children: node.children ? filterAndSort(node.children) : []
        }));
    }

    function flattenVisible(nodesList: any[], level: number = 0): { node: any; level: number }[] {
        const rows: { node: any; level: number }[] = [];
        nodesList.forEach(node => {
            rows.push({ node, level });
            const key = String(node.key);
            if (expandedKeys[key] && node.children && node.children.length) {
                rows.push(...flattenVisible(node.children, level + 1));
            }
        });
        return rows;
    }

    function render() {
        const processedNodes = filterAndSort(rawNodes);
        const allVisibleRows = flattenVisible(processedNodes);
        const totalRecords = allVisibleRows.length;
        const totalPages = Math.ceil(totalRecords / rowsPerPage) || 1;

        if (currentPage >= totalPages) currentPage = Math.max(0, totalPages - 1);

        const displayedRows = isPaginator
            ? allVisibleRows.slice(currentPage * rowsPerPage, (currentPage + 1) * rowsPerPage)
            : allVisibleRows;

        const visibleCols = columns.filter(c => visibleFields.includes(c.field));

        // 1. Header Toolbar / Filter / Column Toggle
        let toolbarHtml = '';
        if (props.filter || columnToggle || props.headerTitle) {
            toolbarHtml = `
                <div style="display: flex; align-items: center; justify-content: space-between; gap: 1rem; padding: 0.75rem 1rem; border-bottom: 1px solid var(--p-surface-200); background: var(--p-surface-0); flex-wrap: wrap;">
                    <div style="font-weight: 700; font-size: 1rem; color: var(--p-surface-900);">
                        ${props.headerTitle || 'TreeTable'}
                    </div>
                    <div style="display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap;">
                        ${props.filter ? `
                            <div style="position: relative; min-width: 200px;">
                                <span style="position: absolute; left: 0.65rem; top: 50%; transform: translateY(-50%); color: var(--p-surface-400);">${SVG_ICONS.search}</span>
                                <input type="text" class="p-treetable-global-search" placeholder="Search keyword..." value="${globalFilter}" style="width: 100%; padding: 0.35rem 0.65rem 0.35rem 2rem; font-size: 0.8125rem; border-radius: 6px; border: 1px solid var(--p-surface-300); background: var(--p-surface-0); color: var(--p-surface-900); outline: none; box-sizing: border-box;" />
                            </div>
                        ` : ''}
                        ${columnToggle ? `
                            <div style="position: relative;">
                                <button type="button" class="p-treetable-column-toggle-btn p-button p-component p-button-outlined" style="display: inline-flex; align-items: center; gap: 0.35rem; padding: 0.35rem 0.75rem; font-size: 0.8125rem; border-radius: 6px; border: 1px solid var(--p-surface-300); background: var(--p-surface-0); color: var(--p-surface-700); cursor: pointer;">
                                    ${SVG_ICONS.cog} Columns
                                </button>
                            </div>
                        ` : ''}
                    </div>
                </div>
            `;
        }

        // 2. Table Headers
        const theadHtml = `
            <thead class="p-treetable-thead">
                <tr>
                    ${visibleCols.map(col => {
                        const isExp = !!col.expander;
                        const isSort = !!col.sortable;
                        const widthStyle = col.width ? `width: ${col.width};` : (col.minWidth ? `min-width: ${col.minWidth};` : '');
                        const frozenClass = col.frozen ? (col.alignFrozen === 'right' ? 'p-frozen-right' : 'p-frozen-left') : '';
                        
                        let sortIconHtml = '';
                        let sortBadgeHtml = '';

                        if (isSort) {
                            if (sortMode === 'single') {
                                if (sortField === col.field) {
                                    sortIconHtml = sortOrder === 1 ? SVG_ICONS.sortAsc : (sortOrder === -1 ? SVG_ICONS.sortDesc : SVG_ICONS.sortNone);
                                } else {
                                    sortIconHtml = SVG_ICONS.sortNone;
                                }
                            } else if (sortMode === 'multiple') {
                                const idx = multiSortMeta.findIndex(m => m.field === col.field);
                                if (idx >= 0) {
                                    sortIconHtml = multiSortMeta[idx].order === 1 ? SVG_ICONS.sortAsc : SVG_ICONS.sortDesc;
                                    sortBadgeHtml = `<span class="p-sortable-badge">${idx + 1}</span>`;
                                } else {
                                    sortIconHtml = SVG_ICONS.sortNone;
                                }
                            }
                        }

                        return `
                            <th class="${isSort ? 'p-sortable-column' : ''} ${frozenClass}" data-col-field="${col.field}" style="${widthStyle}">
                                <div style="display: flex; align-items: center; justify-content: space-between; gap: 0.5rem;">
                                    <span>${col.header}</span>
                                    ${isSort ? `<span style="display: inline-flex; align-items: center; color: var(--p-surface-400);">${sortIconHtml}${sortBadgeHtml}</span>` : ''}
                                </div>
                                ${props.resizableColumns ? '<span class="p-column-resizer"></span>' : ''}
                            </th>
                        `;
                    }).join('')}
                </tr>
            </thead>
        `;

        // 3. Table Rows / Skeleton / Empty
        let tbodyHtml = '';
        if (isSkeleton && isLoading) {
            tbodyHtml = `
                <tbody class="p-treetable-tbody">
                    ${Array.from({ length: 5 }).map((_, r) => `
                        <tr>
                            ${visibleCols.map(() => `
                                <td><div class="p-treetable-skeleton-line" style="width: ${Math.floor(Math.random() * 40) + 50}%;"></div></td>
                            `).join('')}
                        </tr>
                    `).join('')}
                </tbody>
            `;
        } else if (displayedRows.length === 0) {
            tbodyHtml = `
                <tbody class="p-treetable-tbody">
                    <tr>
                        <td colspan="${visibleCols.length}" style="text-align: center; padding: 2.5rem 1rem;">
                            <div style="display: flex; flex-direction: column; align-items: center; gap: 0.5rem; color: var(--p-surface-500);">
                                <span style="transform: scale(1.4);">${SVG_ICONS.folder}</span>
                                <p style="margin: 0; font-weight: 600; color: var(--p-surface-900);">${props.emptyMessage || 'No records found'}</p>
                            </div>
                        </td>
                    </tr>
                </tbody>
            `;
        } else {
            const rowsHtml = displayedRows.map(({ node, level }) => {
                const key = String(node.key);
                const hasChildren = (node.children && node.children.length > 0) || (isLazy && !node.leaf);
                const isExpanded = !!expandedKeys[key];
                const isSelected = selectionMode === 'single' ? singleSelectionKey === key :
                                   selectionMode === 'multiple' ? !!multiSelectionKeys[key] :
                                   selectionMode === 'checkbox' ? !!checkboxSelectionKeys[key]?.checked : false;
                const isPartial = selectionMode === 'checkbox' && !!checkboxSelectionKeys[key]?.partialChecked;

                return `
                    <tr class="p-treetable-row ${isSelected ? 'p-highlight' : ''}" data-key="${key}" tabindex="0">
                        ${visibleCols.map(col => {
                            const isExp = !!col.expander;
                            const frozenClass = col.frozen ? (col.alignFrozen === 'right' ? 'p-frozen-right' : 'p-frozen-left') : '';
                            const widthStyle = col.width ? `width: ${col.width};` : (col.minWidth ? `min-width: ${col.minWidth};` : '');

                            if (isExp) {
                                const toggleSvg = hasChildren ? (node.loading ? SVG_ICONS.spinner : (isExpanded ? SVG_ICONS.chevronDown : SVG_ICONS.chevronRight)) : '';
                                const iconSvg = getIcon(node.data.type, isExpanded);

                                let checkboxHtml = '';
                                if (selectionMode === 'checkbox') {
                                    checkboxHtml = `
                                        <div class="p-treetable-checkbox ${isSelected ? 'p-highlight' : isPartial ? 'p-indeterminate' : ''}" data-cb-key="${key}">
                                            ${isSelected ? SVG_ICONS.check : isPartial ? SVG_ICONS.minus : ''}
                                        </div>
                                    `;
                                }

                                return `
                                    <td class="${frozenClass}" style="${widthStyle} padding-left: ${level * 1.5 + 0.75}rem;">
                                        <div style="display: flex; align-items: center;">
                                            <button type="button" class="p-treetable-toggler ${!hasChildren ? 'p-hidden-space' : ''}" data-toggler-key="${key}">
                                                ${toggleSvg}
                                            </button>
                                            ${checkboxHtml}
                                            <span style="display: inline-flex; align-items: center; margin-right: 0.5rem; color: var(--p-surface-400);">${iconSvg}</span>
                                            <span style="font-weight: ${hasChildren ? '600' : '400'}; color: var(--p-surface-900);">${node.data[col.field] ?? ''}</span>
                                        </div>
                                    </td>
                                `;
                            }

                            if (col.field === 'type') {
                                const typeVal = node.data.type || 'Folder';
                                const sev = getSeverity(typeVal);
                                return `
                                    <td class="${frozenClass}" style="${widthStyle}">
                                        <span class="p-treetable-tag p-tag-${sev}">${typeVal}</span>
                                    </td>
                                `;
                            }

                            return `
                                <td class="${frozenClass}" style="${widthStyle}">
                                    <span style="color: var(--p-surface-700);">${node.data[col.field] ?? '—'}</span>
                                </td>
                            `;
                        }).join('')}
                    </tr>
                `;
            }).join('');

            tbodyHtml = `<tbody class="p-treetable-tbody">${rowsHtml}</tbody>`;
        }

        // 4. Paginator UI
        let paginatorHtml = '';
        if (isPaginator) {
            if (props.headlessPaginator) {
                paginatorHtml = `
                    <div class="p-treetable-paginator" style="justify-content: center;">
                        <div style="display: flex; align-items: center; gap: 1rem; border: 1px solid var(--p-surface-200); border-radius: 9999px; padding: 0.25rem 0.75rem;">
                            <button type="button" class="p-treetable-prev-btn p-treetable-paginator-btn" ${currentPage === 0 ? 'disabled' : ''}>
                                ${SVG_ICONS.chevronLeft}
                            </button>
                            <span style="font-size: 0.8125rem; font-weight: 600; color: var(--p-surface-700);">
                                Page ${currentPage + 1} of ${totalPages} (${totalRecords} items)
                            </span>
                            <button type="button" class="p-treetable-next-btn p-treetable-paginator-btn" ${currentPage >= totalPages - 1 ? 'disabled' : ''}>
                                ${SVG_ICONS.chevronRight}
                            </button>
                        </div>
                    </div>
                `;
            } else {
                const firstRecord = totalRecords > 0 ? currentPage * rowsPerPage + 1 : 0;
                const lastRecord = Math.min((currentPage + 1) * rowsPerPage, totalRecords);

                paginatorHtml = `
                    <div class="p-treetable-paginator">
                        <div style="display: flex; align-items: center; gap: 0.5rem;">
                            <span style="font-size: 0.8125rem; color: var(--p-surface-500);">Rows:</span>
                            <select class="p-treetable-rpp-select" style="padding: 0.25rem 0.5rem; font-size: 0.8125rem; border-radius: 6px; border: 1px solid var(--p-surface-300); background: var(--p-surface-0); color: var(--p-surface-700);">
                                ${rowsPerPageOptions.map(opt => `<option value="${opt}" ${opt === rowsPerPage ? 'selected' : ''}>${opt}</option>`).join('')}
                            </select>
                        </div>
                        <div style="display: flex; align-items: center; gap: 0.25rem;">
                            <button type="button" class="p-treetable-first-btn p-treetable-paginator-btn" ${currentPage === 0 ? 'disabled' : ''}>${SVG_ICONS.firstPage}</button>
                            <button type="button" class="p-treetable-prev-btn p-treetable-paginator-btn" ${currentPage === 0 ? 'disabled' : ''}>${SVG_ICONS.chevronLeft}</button>
                            ${Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                                const p = i;
                                return `<button type="button" class="p-treetable-page-btn p-treetable-paginator-btn ${p === currentPage ? 'p-highlight' : ''}" data-page="${p}">${p + 1}</button>`;
                            }).join('')}
                            <button type="button" class="p-treetable-next-btn p-treetable-paginator-btn" ${currentPage >= totalPages - 1 ? 'disabled' : ''}>${SVG_ICONS.chevronRight}</button>
                            <button type="button" class="p-treetable-last-btn p-treetable-paginator-btn" ${currentPage >= totalPages - 1 ? 'disabled' : ''}>${SVG_ICONS.lastPage}</button>
                        </div>
                        <div style="font-size: 0.8125rem; color: var(--p-surface-500);">
                            ${firstRecord} to ${lastRecord} of ${totalRecords}
                        </div>
                    </div>
                `;
            }
        }

        // 5. Footer & Loading Overlay
        let footerHtml = props.footerText ? `
            <div style="padding: 0.75rem 1rem; border-top: 1px solid var(--p-surface-200); background: var(--p-surface-50); font-size: 0.8125rem; font-weight: 600; color: var(--p-surface-700);">
                ${props.footerText}
            </div>
        ` : '';

        let loadingMaskHtml = isLoading && !isSkeleton ? `
            <div class="p-treetable-loading-mask">
                <div style="display: flex; flex-direction: column; align-items: center; gap: 0.5rem; color: var(--p-primary-500);">
                    ${SVG_ICONS.spinner}
                    <span style="font-size: 0.8125rem; font-weight: 600; color: var(--p-surface-700);">Loading nodes…</span>
                </div>
            </div>
        ` : '';

        const scrollStyle = isScrollable ? `max-height: ${scrollHeight}; overflow: auto;` : '';
        const sizeClass = size === 'small' ? 'p-treetable-sm' : (size === 'large' ? 'p-treetable-lg' : '');
        const gridlinesClass = showGridlines ? 'p-treetable-gridlines' : '';

        container.innerHTML = `
            <div class="p-treetable p-component ${sizeClass} ${gridlinesClass}">
                ${toolbarHtml}
                ${loadingMaskHtml}
                <div class="p-treetable-scrollable-wrapper" style="${scrollStyle}">
                    <table class="p-treetable-table">
                        ${theadHtml}
                        ${tbodyHtml}
                    </table>
                </div>
                ${paginatorHtml}
                ${footerHtml}
            </div>
        `;

        bindEvents();
    }

    function bindEvents() {
        // Expand/Collapse Toggler
        container.querySelectorAll<HTMLButtonElement>('.p-treetable-toggler').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const key = btn.getAttribute('data-toggler-key');
                if (key && nodeMap.has(key)) {
                    toggleExpand(nodeMap.get(key));
                }
            });
        });

        // Checkbox Click
        container.querySelectorAll<HTMLElement>('.p-treetable-checkbox').forEach(cb => {
            cb.addEventListener('click', (e) => {
                e.stopPropagation();
                const key = cb.getAttribute('data-cb-key');
                if (key && nodeMap.has(key)) {
                    const node = nodeMap.get(key);
                    const isChecked = !checkboxSelectionKeys[key]?.checked;
                    setCheckboxState(node, isChecked);
                    updateAncestorCheckboxes(node);
                    notifyToast(isChecked ? 'success' : 'warn', isChecked ? 'Node Selected' : 'Node Unselected', node.data.name);
                    render();
                }
            });
        });

        // Row Selection
        container.querySelectorAll<HTMLTableRowElement>('.p-treetable-row').forEach(row => {
            row.addEventListener('click', (e) => {
                const key = row.getAttribute('data-key');
                if (!key || !nodeMap.has(key)) return;
                const node = nodeMap.get(key);

                if (selectionMode === 'single') {
                    if (singleSelectionKey === key) {
                        singleSelectionKey = null;
                        notifyToast('warn', 'Node Unselected', node.data.name);
                    } else {
                        singleSelectionKey = key;
                        notifyToast('success', 'Node Selected', node.data.name);
                    }
                    render();
                } else if (selectionMode === 'multiple') {
                    const isMeta = e.metaKey || e.ctrlKey;
                    if (metaKeySelection && !isMeta) {
                        multiSelectionKeys = { [key]: true };
                    } else {
                        if (multiSelectionKeys[key]) delete multiSelectionKeys[key];
                        else multiSelectionKeys[key] = true;
                    }
                    notifyToast('success', 'Selection Updated', node.data.name);
                    render();
                }
            });

            // Context Menu
            if (contextMenuEnabled) {
                row.addEventListener('contextmenu', (e) => {
                    e.preventDefault();
                    const key = row.getAttribute('data-key');
                    if (key && nodeMap.has(key)) {
                        selectedContextMenuNode = nodeMap.get(key);
                        showContextMenu(e.clientX, e.clientY);
                    }
                });
            }
        });

        // Sorting
        container.querySelectorAll<HTMLTableCellElement>('.p-sortable-column').forEach(th => {
            th.addEventListener('click', () => {
                const field = th.getAttribute('data-col-field');
                if (field) handleSort(field);
            });
        });

        // Pagination controls
        container.querySelector('.p-treetable-first-btn')?.addEventListener('click', () => { currentPage = 0; render(); });
        container.querySelector('.p-treetable-prev-btn')?.addEventListener('click', () => { if (currentPage > 0) { currentPage--; render(); } });
        container.querySelector('.p-treetable-next-btn')?.addEventListener('click', () => { currentPage++; render(); });
        container.querySelector('.p-treetable-last-btn')?.addEventListener('click', () => { currentPage = 999999; render(); });

        container.querySelectorAll<HTMLButtonElement>('.p-treetable-page-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const page = parseInt(btn.getAttribute('data-page') || '0', 10);
                currentPage = page;
                render();
            });
        });

        container.querySelector<HTMLSelectElement>('.p-treetable-rpp-select')?.addEventListener('change', (e) => {
            rowsPerPage = parseInt((e.target as HTMLSelectElement).value, 10);
            currentPage = 0;
            render();
        });

        // Global search
        const searchInput = container.querySelector<HTMLInputElement>('.p-treetable-global-search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                globalFilter = (e.target as HTMLInputElement).value;
                render();
                const reFocus = container.querySelector<HTMLInputElement>('.p-treetable-global-search');
                if (reFocus) {
                    reFocus.focus();
                    reFocus.setSelectionRange(globalFilter.length, globalFilter.length);
                }
            });
        }
    }

    function showContextMenu(x: number, y: number) {
        document.querySelectorAll('.p-treetable-contextmenu').forEach(el => el.remove());
        const menu = document.createElement('div');
        menu.className = 'p-treetable-contextmenu';
        menu.style.left = `${x}px`;
        menu.style.top = `${y}px`;

        menu.innerHTML = `
            <div class="p-treetable-contextmenu-item" data-action="view">
                ${SVG_ICONS.search} View
            </div>
            <div class="p-treetable-contextmenu-item" data-action="delete" style="color: #ef4444;">
                ${SVG_ICONS.trash} Delete
            </div>
        `;

        document.body.appendChild(menu);

        menu.querySelector('[data-action="view"]')?.addEventListener('click', () => {
            if (selectedContextMenuNode) {
                notifyToast('info', 'Node Selected', selectedContextMenuNode.data.name);
            }
            menu.remove();
        });

        menu.querySelector('[data-action="delete"]')?.addEventListener('click', () => {
            if (selectedContextMenuNode) {
                notifyToast('error', 'Node Deleted', selectedContextMenuNode.data.name);
            }
            menu.remove();
        });

        const closeMenu = (e: MouseEvent) => {
            if (!menu.contains(e.target as Node)) {
                menu.remove();
                document.removeEventListener('click', closeMenu);
            }
        };
        setTimeout(() => document.addEventListener('click', closeMenu), 50);
    }

    render();
}
