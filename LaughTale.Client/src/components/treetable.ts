import { resolvePart, applyPart, type PassthroughRecord } from '../runtime/parts';
import type { IslandContext } from '../runtime/registry';
﻿/**
 * LaughTale: Enterprise TreeTable Component (Aura Design System compliant)
 * Hierarchical data grid visualizer in tabular format with expand/collapse rows,
 * single/multiple/checkbox row selections, single & multi-column sorting,
 * full pagination, vertical/horizontal/frozen scrolling, column resizing,
 * column toggling, multi-column filtering, lazy loading, skeleton loading,
 * template header/footer, and context menus.
 */

import { TreeTableNode, TreeTableColumn } from '../types/models';
import { injectIslandStyle } from '../runtime/styles';
import { html, setHtml, url as safeUrl, unsafe, attr, type Raw } from '../runtime/html';
import { getLucideIcon } from '../icons/lucide';
import { useVirtualizer, type Virtualizer } from '../composables/useVirtualizer';
import type { PatternDeclaration } from '../accessibility/patterns';

export const a11y: PatternDeclaration = {
    kind: 'native',
    element: 'button'
};

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
    multiSortMeta?: { field: string; order: number
    pt?: PassthroughRecord;
    studioOverrides?: Record<string, any>;
}[];
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
    useTags?: boolean;
    useNodeIcons?: boolean;
    showActions?: boolean;
    controlledToggle?: boolean;
    topControls?: string; // 'size' | 'metaKey' | 'controlled' | 'refresh' | 'columns'
}

const TREETABLE_CSS = `
.p-treetable {
    position: relative;
    background: var(--lt-surface-0);
    color: var(--lt-surface-700);
    border: 1px solid var(--lt-surface-200);
    border-radius: var(--p-border-radius-md, 6px);
    font-family: var(--p-font-family, inherit);
    box-sizing: border-box;
    width: 100%;
}

.p-treetable-header {
    background: var(--lt-surface-0);
    color: var(--lt-surface-900);
    padding: 0.875rem 1.25rem;
    border-bottom: 1px solid var(--lt-surface-200);
    font-weight: 700;
    font-size: 1.125rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.p-treetable-footer {
    background: var(--lt-surface-50);
    color: var(--lt-surface-700);
    padding: 0.75rem 1.25rem;
    border-top: 1px solid var(--lt-surface-200);
    font-size: 0.875rem;
    font-weight: 500;
    display: flex;
    align-items: center;
    justify-content: flex-start;
}

.p-treetable-table {
    border-spacing: 0;
    width: 100%;
    border-collapse: collapse;
    table-layout: auto;
}

.p-treetable-thead > tr > th {
    background: var(--lt-surface-0);
    color: var(--lt-surface-700);
    padding: 0.75rem 1rem;
    border-bottom: 1px solid var(--lt-surface-200);
    border-top: none;
    border-left: none;
    border-right: none;
    font-weight: 600;
    text-align: start;
    transition: background-color 0.15s ease, color 0.15s ease;
    user-select: none;
    position: relative;
    font-size: 0.875rem;
    box-sizing: border-box;
}

.p-treetable-header-content {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
}

.p-treetable-thead > tr > th.p-sortable-column {
    cursor: pointer;
}
.p-treetable-thead > tr > th.p-sortable-column:hover {
    background: var(--lt-surface-100);
    color: var(--lt-surface-900);
}

.p-treetable-spacer-cell {
    padding: 0 !important;
    border: none !important;
    height: 0;
}

.p-treetable-thead > tr > th.p-highlight {
    color: var(--lt-primary-600);
}

.p-treetable-sort-icon {
    display: inline-flex;
    align-items: center;
    color: var(--lt-surface-400);
    transition: color 0.15s ease;
}
.p-treetable-thead > tr > th.p-highlight .p-treetable-sort-icon {
    color: var(--lt-primary-600);
}

.p-treetable-tbody > tr {
    background: var(--lt-surface-0);
    color: var(--lt-surface-700);
    transition: background-color 0.15s ease;
}

.p-treetable-tbody > tr:not(.p-highlight):hover {
    background: var(--lt-surface-50);
    color: var(--lt-surface-900);
}

.p-treetable-tbody > tr.p-highlight {
    background: var(--lt-primary-50);
    color: var(--lt-primary-700);
}

.p-treetable-tbody > tr > td {
    padding: 0.75rem 1rem;
    border-bottom: 1px solid var(--lt-surface-200);
    border-top: none;
    border-left: none;
    border-right: none;
    font-size: 0.875rem;
    vertical-align: middle;
    box-sizing: border-box;
}

/* Gridlines mode */
.p-treetable.p-treetable-gridlines .p-treetable-thead > tr > th,
.p-treetable.p-treetable-gridlines .p-treetable-tbody > tr > td {
    border: 1px solid var(--lt-surface-200);
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
    color: var(--lt-surface-500);
    transition: background-color 0.15s ease, transform 0.2s ease, color 0.15s ease;
    margin-inline-end: 0.35rem;
    padding: 0;
}
.p-treetable-toggler:hover {
    background-color: var(--lt-surface-200);
    color: var(--lt-surface-900);
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
    border: 1px solid var(--lt-surface-300);
    background: var(--lt-surface-0);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin-inline-end: 0.5rem;
    cursor: pointer;
    transition: background-color 0.15s, border-color 0.15s;
    flex-shrink: 0;
}
.p-treetable-checkbox.p-highlight {
    background: var(--lt-primary-500);
    border-color: var(--lt-primary-500);
    color: var(--lt-surface-0, var(--lt-surface-0));
}
.p-treetable-checkbox.p-indeterminate {
    background: var(--lt-primary-500);
    border-color: var(--lt-primary-500);
    color: var(--lt-surface-0, var(--lt-surface-0));
}

/* Sort badge for multi-sort */
.p-sortable-badge {
    background: var(--lt-primary-500);
    color: var(--lt-surface-0, var(--lt-surface-0));
    font-size: 0.6875rem;
    font-weight: 700;
    width: 1.125rem;
    height: 1.125rem;
    border-radius: 9999px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin-inline-start: 0.25rem;
}

/* Column Resizer */
.p-column-resizer {
    position: absolute;
    top: 0;
    inset-inline-end: 0;
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
    background: var(--lt-surface-0);
}
.p-frozen-right {
    position: sticky;
    right: 0;
    z-index: 2;
    background: var(--lt-surface-0);
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
    padding: 0.2rem 0.55rem;
    border-radius: 4px;
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.02em;
}
.p-treetable .p-tag-warn { background: var(--lt-warn-100, var(--lt-warn-100)); color: var(--lt-warn-700, var(--lt-warn-700)); }
.p-treetable .p-tag-info { background: var(--lt-info-100); color: var(--lt-info-700); }
.p-treetable .p-tag-success { background: var(--lt-success-100, var(--lt-success-100)); color: var(--lt-success-700, var(--lt-success-700)); }
.p-treetable .p-tag-secondary { background: var(--lt-surface-100, var(--lt-surface-100)); color: var(--lt-surface-600, var(--lt-surface-600)); }

/* Paginator Integration */
.p-treetable-paginator {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.65rem 1rem;
    border-top: 1px solid var(--lt-surface-200);
    background: var(--lt-surface-0);
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
    color: var(--lt-surface-700);
    font-weight: 600;
    font-size: 0.8125rem;
    transition: background-color 0.15s ease;
}
.p-treetable-paginator-btn:hover:not(:disabled) {
    background: var(--lt-surface-100);
}
.p-treetable-paginator-btn.p-highlight {
    background: var(--p-primary-color, var(--lt-primary-500, #10b981)) !important;
    color: var(--p-primary-contrast-color, #ffffff) !important;
    font-weight: 700;
}
.p-treetable-paginator-btn.p-highlight:hover {
    background: var(--p-primary-hover-color, var(--lt-primary-600, #059669)) !important;
}
.p-treetable-paginator-btn:disabled {
    opacity: 0.35;
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
}

/* Skeleton Rows */
.p-treetable-skeleton-line {
    height: 1.125rem;
    background: var(--lt-surface-200);
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
    background: var(--lt-surface-0);
    border: 1px solid var(--lt-surface-200);
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
    color: var(--lt-surface-700);
    border-radius: 4px;
    cursor: pointer;
    transition: background 0.15s ease;
}
.p-treetable-contextmenu-item:hover {
    background: var(--lt-surface-100);
    color: var(--lt-surface-900);
}

/* Column Toggle Popover */
.p-treetable-popover {
    position: absolute;
    top: 100%;
    inset-inline-end: 0;
    margin-top: 0.5rem;
    background: var(--lt-surface-0);
    border: 1px solid var(--lt-surface-200);
    border-radius: 8px;
    box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1);
    z-index: 50;
    min-width: 260px;
    padding: 0.5rem;
}

/* Top Controls Area (SelectButton, MetaKey toggle, Refresh button, Filter search) */
.p-treetable-top-controls {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    margin-bottom: 1rem;
    gap: 0.75rem;
}
.p-treetable-top-controls.justify-end {
    justify-content: flex-end;
}
.p-treetable-top-controls.justify-center {
    justify-content: center;
}
/* Dark Mode Tokens */
html.dark .p-treetable,
[data-theme="dark"] .p-treetable,
.dark .p-treetable {
    background: var(--p-surface-0) !important;
    color: var(--p-text-color) !important;
    border-color: var(--p-border-color) !important;
}

/* Bi-Directional RTL Support */
[dir="rtl"] .p-treetable {
    text-align: right;
}
[dir="rtl"] .p-treetable th {
    text-align: right;
}
[dir="rtl"] .p-treetable-toggler svg {
    transform: scaleX(-1);
}
html.dark .p-treetable-header,
[data-theme="dark"] .p-treetable-header,
.dark .p-treetable-header {
    background: var(--p-surface-50) !important;
    color: var(--p-text-color) !important;
    border-color: var(--p-border-color) !important;
}
html.dark .p-treetable-footer,
[data-theme="dark"] .p-treetable-footer,
.dark .p-treetable-footer {
    background: var(--p-surface-50) !important;
    color: var(--p-text-color) !important;
    border-color: var(--p-border-color) !important;
}
html.dark .p-treetable-thead > tr > th,
[data-theme="dark"] .p-treetable-thead > tr > th,
.dark .p-treetable-thead > tr > th {
    background: var(--p-surface-50) !important;
    color: var(--p-text-color) !important;
    border-color: var(--p-border-color) !important;
}
html.dark .p-treetable-tbody > tr,
[data-theme="dark"] .p-treetable-tbody > tr,
.dark .p-treetable-tbody > tr {
    background: var(--p-surface-0) !important;
    color: var(--p-text-color) !important;
}
html.dark .p-treetable-tbody > tr:not(.p-highlight):hover,
[data-theme="dark"] .p-treetable-tbody > tr:not(.p-highlight):hover,
.dark .p-treetable-tbody > tr:not(.p-highlight):hover {
    background: var(--p-surface-100) !important;
    color: var(--p-text-color) !important;
}
html.dark .p-treetable-tbody > tr.p-highlight,
[data-theme="dark"] .p-treetable-tbody > tr.p-highlight,
.dark .p-treetable-tbody > tr.p-highlight {
    background: rgba(16, 185, 129, 0.16) !important;
    color: var(--p-primary-300) !important;
}
html.dark .p-treetable-tbody > tr > td,
[data-theme="dark"] .p-treetable-tbody > tr > td,
.dark .p-treetable-tbody > tr > td {
    border-color: var(--p-border-color) !important;
}
html.dark .p-frozen-left,
html.dark .p-frozen-right,
[data-theme="dark"] .p-frozen-left,
[data-theme="dark"] .p-frozen-right,
.dark .p-frozen-left,
.dark .p-frozen-right {
    background: var(--p-surface-0) !important;
}
html.dark .p-treetable-paginator,
[data-theme="dark"] .p-treetable-paginator,
.dark .p-treetable-paginator {
    background: var(--p-surface-0) !important;
    border-color: var(--p-border-color) !important;
}
html.dark .p-treetable-paginator-btn.p-highlight,
[data-theme="dark"] .p-treetable-paginator-btn.p-highlight,
.dark .p-treetable-paginator-btn.p-highlight {
    background: rgba(16, 185, 129, 0.16) !important;
    color: var(--p-primary-300) !important;
}
html.dark .p-treetable-checkbox,
[data-theme="dark"] .p-treetable-checkbox,
.dark .p-treetable-checkbox {
    background: var(--p-surface-50) !important;
    border-color: var(--p-border-color) !important;
}
html.dark .p-treetable-loading-mask,
[data-theme="dark"] .p-treetable-loading-mask,
.dark .p-treetable-loading-mask {
    background: rgba(9, 13, 22, 0.8) !important;
}
html.dark .p-treetable-contextmenu,
html.dark .p-treetable-popover,
[data-theme="dark"] .p-treetable-contextmenu,
[data-theme="dark"] .p-treetable-popover,
.dark .p-treetable-contextmenu,
.dark .p-treetable-popover {
    background: var(--p-surface-0) !important;
    border-color: var(--p-border-color) !important;
}
`;

const SVG_ICONS = {
    chevronRight: getLucideIcon('chevron-right', 14, 2.5),
    chevronDown: getLucideIcon('chevron-down', 14, 2.5),
    chevronLeft: getLucideIcon('chevron-left', 14, 2.5),
    firstPage: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m11 17-5-5 5-5"/><path d="m18 17-5-5 5-5"/><path d="M6 19V5"/></svg>',
    lastPage: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 17 5-5-5-5"/><path d="m13 17 5-5-5-5"/><path d="M18 19V5"/></svg>',
    sortAsc: getLucideIcon('chevron-up', 13, 2.5),
    sortDesc: getLucideIcon('chevron-down', 13, 2.5),
    sortNone: getLucideIcon('chevrons-up-down', 13, 2),
    folder: getLucideIcon('folder', 15, 2),
    file: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/></svg>',
    image: getLucideIcon('image', 15, 2),
    video: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m22 8-6 4 6 4V8Z"/><rect width="14" height="12" x="2" y="6" rx="2" ry="2"/></svg>',
    check: getLucideIcon('check', 12, 3),
    minus: getLucideIcon('minus', 12, 3),
    search: getLucideIcon('search', 14, 2),
    cog: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z"/><path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"/></svg>',
    spinner: '<svg class="animate-spin" data-part="root" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>',
    refresh: getLucideIcon('refresh-ccw', 14, 2),
    download: getLucideIcon('download', 14, 2),
    pencil: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>',
    trash: getLucideIcon('trash', 14, 2),
    plus: getLucideIcon('plus', 14, 2)
};

export default function TreeTableIsland(container: HTMLElement, props: TreeTableProps, ctx?: IslandContext) {
    injectIslandStyle('treetable', TREETABLE_CSS);

    let rawNodes: any[] = JSON.parse(JSON.stringify(props.value || props.nodes || []));
    let columns: TreeTableColumn[] = props.columns ? [...props.columns] : [
        { field: 'name', header: 'Name', expander: true },
        { field: 'size', header: 'Size' },
        { field: 'type', header: 'Type' }
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
    let showPopover = false;
    let contextMenuEnabled = !!props.contextMenu;

    // Sorting state
    let sortMode = props.sortMode || 'single';
    let sortField = props.sortField || null;
    let sortOrder = props.sortOrder ?? 1;
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

    function resolveNodeField(node: any, field: string): any {
        if (!node || !field) return '';
        const data = node.data || node;
        if (data[field] !== undefined) return data[field];
        const camel = field.charAt(0).toLowerCase() + field.slice(1);
        if (data[camel] !== undefined) return data[camel];
        const lower = field.toLowerCase();
        for (const k of Object.keys(data)) {
            if (k.toLowerCase() === lower) return data[k];
        }
        return undefined;
    }

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
            case 'Document':
            case 'Resume':
            case 'Application':
            case 'PDF': return 'info';
            case 'Picture':
            case 'Video': return 'success';
            case 'Text':
            case 'Zip':
            case 'Link': return 'secondary';
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
                const tLazy = setTimeout(() => {
                    node.loading = false;
                    node.children = [
                        { key: `${key}-0`, data: { name: `${node.data.name} - 0`, size: `${Math.floor(Math.random() * 800) + 50}kb`, type: 'Document' } },
                        { key: `${key}-1`, data: { name: `${node.data.name} - 1`, size: `${Math.floor(Math.random() * 800) + 50}kb`, type: 'Text' } }
                    ];
                    buildMaps(rawNodes);
                    render();
                }, 500);
                ctx?.onCleanup?.(() => clearTimeout(tLazy));
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
            const valA = resolveNodeField(a, sortField) ?? '';
            const valB = resolveNodeField(b, sortField) ?? '';
            const res = typeof valA === 'number' ? (valA - valB) : String(valA).localeCompare(String(valB));
            return res * sortOrder;
        } else if (sortMode === 'multiple' && multiSortMeta.length > 0) {
            for (let meta of multiSortMeta) {
                const valA = resolveNodeField(a, meta.field) ?? '';
                const valB = resolveNodeField(b, meta.field) ?? '';
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
                    const val = String(resolveNodeField(node, field) || '').toLowerCase();
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

    const ITEM_HEIGHT = 40;
    let virtualizer: Virtualizer | null = null;
    let currentStart = -1;
    let currentEnd = -1;
    let currentFlatRows: { node: any; level: number }[] = [];
    let scrollBound = false;

    function renderSingleRow(rowItem: { node: any; level: number }, index: number, totalCount: number, visibleCols: TreeTableColumn[]): string {
        const { node, level } = rowItem;
        const key = String(node.key);
        const hasChildren = (node.children && node.children.length > 0) || (isLazy && !node.leaf);
        const isExpanded = !!expandedKeys[key];
        const isSelected = selectionMode === 'single' ? singleSelectionKey === key :
                           selectionMode === 'multiple' ? !!multiSelectionKeys[key] :
                           selectionMode === 'checkbox' ? !!checkboxSelectionKeys[key]?.checked : false;
        const isPartial = selectionMode === 'checkbox' && !!checkboxSelectionKeys[key]?.partialChecked;

        return `
            <tr class="p-treetable-row ${isSelected ? 'p-highlight' : ''}" data-key="${key}" data-index="${index}" role="row" aria-setsize="${totalCount}" aria-posinset="${index + 1}" tabindex="${index === 0 ? '0' : '-1'}">
                ${visibleCols.map(col => {
                    const isExp = !!col.expander;
                    const frozenClass = col.frozen ? (col.alignFrozen === 'right' ? 'p-frozen-right' : 'p-frozen-left') : '';
                    const widthStyle = col.width ? `width: ${col.width};` : (col.minWidth ? `min-width: ${col.minWidth};` : '');

                    if (isExp) {
                        const toggleSvg = hasChildren ? (node.loading ? SVG_ICONS.spinner : (isExpanded ? SVG_ICONS.chevronDown : SVG_ICONS.chevronRight)) : '';
                        const iconSvg = props.useNodeIcons ? `<span style="display: inline-flex; align-items: center; margin-inline-end: 0.5rem; color: var(--lt-surface-400);">${getIcon(node.data.type, isExpanded)}</span>` : '';

                        let checkboxHtml = '';
                        if (selectionMode === 'checkbox') {
                            checkboxHtml = `
                                <div class="p-treetable-checkbox ${isSelected ? 'p-highlight' : isPartial ? 'p-indeterminate' : ''}" data-cb-key="${key}">
                                    ${isSelected ? SVG_ICONS.check : isPartial ? SVG_ICONS.minus : ''}
                                </div>
                            `;
                        }

                        return `
                            <td class="${frozenClass}" style="${widthStyle} padding-inline-start: ${level * 1.5 + 0.75}rem;">
                                <div style="display: flex; align-items: center;">
                                    <button type="button" class="p-treetable-toggler ${!hasChildren ? 'p-hidden-space' : ''}" data-toggler-key="${key}">
                                        ${toggleSvg}
                                    </button>
                                    ${checkboxHtml}
                                    ${iconSvg}
                                    <span style="font-weight: ${hasChildren && props.useNodeIcons ? '600' : '400'}; color: var(--lt-surface-900);">${resolveNodeField(node, col.field) ?? ''}</span>
                                </div>
                            </td>
                        `;
                    }

                    if (col.field === 'type' && props.useTags) {
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
                            <span style="color: var(--lt-surface-700);">${resolveNodeField(node, col.field) ?? '—'}</span>
                        </td>
                    `;
                }).join('')}
                ${props.showActions ? `
                    <td style="text-align: center;">
                        <div style="display: inline-flex; align-items: center; gap: 0.4rem;">
                            <button type="button" class="p-treetable-action-view" style="width: 2rem; height: 2rem; border-radius: 9999px; border: none; background: var(--lt-surface-100); color: var(--lt-surface-700); display: flex; align-items: center; justify-content: center; cursor: pointer;">
                                ${SVG_ICONS.search}
                            </button>
                            <button type="button" class="p-treetable-action-edit" style="width: 2rem; height: 2rem; border-radius: 9999px; border: none; background: var(--lt-success-100, var(--lt-success-100)); color: var(--lt-success-700, var(--lt-success-700)); display: flex; align-items: center; justify-content: center; cursor: pointer;">
                                ${SVG_ICONS.pencil}
                            </button>
                        </div>
                    </td>
                ` : ''}
            </tr>
        `;
    }

    function updateVirtualPositions() {
        if (!virtualizer || !virtualizer.isVirtual()) return;
        const topSpacer = container.querySelector<HTMLElement>('.p-treetable-spacer-top td');
        const bottomSpacer = container.querySelector<HTMLElement>('.p-treetable-spacer-bottom td');
        const virtualItems = virtualizer.getVirtualItems();
        const startOffset = virtualItems.length > 0 ? virtualItems[0].start : 0;
        const totalSize = virtualizer.getTotalSize();
        const itemsSize = virtualItems.length * 40;
        const endOffset = Math.max(0, totalSize - startOffset - itemsSize);
        if (topSpacer) topSpacer.style.height = `${startOffset}px`;
        if (bottomSpacer) bottomSpacer.style.height = `${endOffset}px`;
    }

    function reRenderVirtualRows() {
        const tbody = container.querySelector<HTMLElement>('.p-treetable-tbody');
        if (!tbody || !virtualizer || !virtualizer.isVirtual()) return;
        const visibleCols = columns.filter(c => visibleFields.includes(c.field));
        const colSpan = visibleCols.length + (props.showActions ? 1 : 0);
        const virtualItems = virtualizer.getVirtualItems();
        const rowsHtml = virtualItems.map(vi => renderSingleRow(currentFlatRows[vi.index], vi.index, currentFlatRows.length, visibleCols)).join('');
        setHtml(tbody, html`
            <tr class="p-treetable-spacer-top"><td class="p-treetable-spacer-cell" colspan="${colSpan}"></td></tr>
            ${unsafe(rowsHtml)}
            <tr class="p-treetable-spacer-bottom"><td class="p-treetable-spacer-cell" colspan="${colSpan}"></td></tr>
        `);
        updateVirtualPositions();
        bindRowEvents();
    }

    function focusRowByIndex(targetIdx: number) {
        if (virtualizer && virtualizer.isVirtual()) {
            if (targetIdx < currentStart || targetIdx > currentEnd) {
                virtualizer.scrollToIndex(targetIdx, 'auto');
                const newVirtualItems = virtualizer.getVirtualItems();
                if (newVirtualItems.length > 0) {
                    currentStart = newVirtualItems[0].index;
                    currentEnd = newVirtualItems[newVirtualItems.length - 1].index;
                    reRenderVirtualRows();
                }
            }
        }
        const targetRow = container.querySelector<HTMLTableRowElement>(`.p-treetable-row[data-index="${targetIdx}"]`);
        if (targetRow) {
            targetRow.focus();
        }
    }

    function render() {
        const processedNodes = filterAndSort(rawNodes);
        const allFlattenedRows = flattenVisible(processedNodes);
        currentFlatRows = allFlattenedRows;
        const totalRecords = allFlattenedRows.length;
        const totalPages = Math.ceil(totalRecords / rowsPerPage) || 1;

        if (currentPage >= totalPages) currentPage = Math.max(0, totalPages - 1);

        const displayedRows = isPaginator
            ? allFlattenedRows.slice(currentPage * rowsPerPage, (currentPage + 1) * rowsPerPage)
            : allFlattenedRows;

        if (!isPaginator && allFlattenedRows.length >= 100) {
            virtualizer = useVirtualizer({
                count: allFlattenedRows.length,
                estimateSize: 40,
                getScrollElement: () => container.querySelector<HTMLElement>('.p-treetable-scrollable-wrapper'),
                virtualThreshold: 100
            });
            const virtualItems = virtualizer.getVirtualItems();
            currentStart = virtualItems.length > 0 ? virtualItems[0].index : 0;
            currentEnd = virtualItems.length > 0 ? virtualItems[virtualItems.length - 1].index : 0;
        } else {
            virtualizer = null;
        }

        const visibleCols = columns.filter(c => visibleFields.includes(c.field));

        // Top Controls (Outside table, like SelectButton, ToggleSwitch, Filter, Columns button)
        let topControlsHtml = '';
        if (props.topControls === 'size') {
            topControlsHtml = `
                <div class="p-treetable-top-controls">
                    <div class="p-selectbutton p-button-group" style="display: inline-flex; border: 1px solid var(--lt-surface-300); border-radius: 6px; overflow: hidden;">
                        <button type="button" class="p-treetable-size-btn ${size === 'small' ? 'p-highlight' : ''}" data-size="small" style="padding: 0.45rem 1rem; border: none; background: ${size === 'small' ? 'var(--lt-primary-500)' : 'var(--lt-surface-0)'}; color: ${size === 'small' ? 'var(--lt-surface-0, var(--lt-surface-0))' : 'var(--lt-surface-700)'}; cursor: pointer; font-size: 0.8125rem; font-weight: 600;">Small</button>
                        <button type="button" class="p-treetable-size-btn ${size === 'normal' ? 'p-highlight' : ''}" data-size="normal" style="padding: 0.45rem 1rem; border: none; border-inline-start: 1px solid var(--lt-surface-200); border-inline-end: 1px solid var(--lt-surface-200); background: ${size === 'normal' ? 'var(--lt-primary-500)' : 'var(--lt-surface-0)'}; color: ${size === 'normal' ? 'var(--lt-surface-0, var(--lt-surface-0))' : 'var(--lt-surface-700)'}; cursor: pointer; font-size: 0.8125rem; font-weight: 600;">Normal</button>
                        <button type="button" class="p-treetable-size-btn ${size === 'large' ? 'p-highlight' : ''}" data-size="large" style="padding: 0.45rem 1rem; border: none; background: ${size === 'large' ? 'var(--lt-primary-500)' : 'var(--lt-surface-0)'}; color: ${size === 'large' ? 'var(--lt-surface-0, var(--lt-surface-0))' : 'var(--lt-surface-700)'}; cursor: pointer; font-size: 0.8125rem; font-weight: 600;">Large</button>
                    </div>
                </div>
            `;
        } else if (props.topControls === 'metaKey') {
            topControlsHtml = `
                <div class="p-treetable-top-controls justify-center">
                    <label style="display: inline-flex; align-items: center; gap: 0.6rem; cursor: pointer; font-size: 0.875rem; font-weight: 600; color: var(--lt-surface-800);">
                        <input type="checkbox" class="p-treetable-metakey-switch" ${metaKeySelection ? 'checked' : ''} style="width: 1.25rem; height: 1.25rem; accent-color: var(--lt-primary-500);" />
                        <span>MetaKey</span>
                    </label>
                </div>
            `;
        } else if (props.topControls === 'controlled') {
            topControlsHtml = `
                <div class="p-treetable-top-controls">
                    <button type="button" class="p-treetable-toggle-apps-btn" style="display: inline-flex; align-items: center; gap: 0.4rem; padding: 0.5rem 1rem; font-size: 0.8125rem; font-weight: 600; border-radius: 6px; border: none; background: var(--lt-primary-500); color: var(--lt-surface-0, var(--lt-surface-0)); cursor: pointer;">
                        Toggle Applications
                    </button>
                </div>
            `;
        } else if (props.topControls === 'refresh') {
            topControlsHtml = `
                <div class="p-treetable-top-controls" style="justify-content: space-between;">
                    <span style="font-size: 0.875rem; color: var(--lt-surface-500);">Click refresh to simulate a network fetch.</span>
                    <button type="button" class="p-treetable-refresh-btn" style="display: inline-flex; align-items: center; gap: 0.4rem; padding: 0.45rem 0.85rem; font-size: 0.8125rem; font-weight: 600; border-radius: 6px; border: 1px solid var(--lt-surface-300); background: var(--lt-surface-0); color: var(--lt-surface-700); cursor: pointer;">
                        ${SVG_ICONS.refresh} Refresh
                    </button>
                </div>
            `;
        } else if (props.filter) {
            topControlsHtml = `
                <div class="p-treetable-top-controls justify-end">
                    <div style="position: relative; width: 240px;">
                        <span style="position: absolute; left: 0.75rem; top: 50%; transform: translateY(-50%); color: var(--lt-surface-400);">${SVG_ICONS.search}</span>
                        <input type="text" class="p-treetable-global-search" placeholder="Keyword search" value="${globalFilter}" style="width: 100%; padding: 0.45rem 0.75rem 0.45rem 2.25rem; font-size: 0.8125rem; border-radius: 6px; border: 1px solid var(--lt-surface-300); background: var(--lt-surface-0); color: var(--lt-surface-900); outline: none; box-sizing: border-box;" />
                    </div>
                </div>
            `;
        } else if (columnToggle) {
            topControlsHtml = `
                <div class="p-treetable-top-controls justify-end">
                    <div style="position: relative;">
                        <button type="button" class="p-treetable-column-toggle-btn" style="display: inline-flex; align-items: center; gap: 0.4rem; padding: 0.45rem 0.85rem; font-size: 0.8125rem; font-weight: 600; border-radius: 6px; border: 1px solid var(--lt-surface-300); background: var(--lt-surface-0); color: var(--lt-surface-700); cursor: pointer;">
                            ${SVG_ICONS.cog} Columns
                        </button>
                        ${showPopover ? `
                            <div class="p-treetable-popover">
                                <div style="display: flex; align-items: center; justify-content: space-between; padding-bottom: 0.5rem; margin-bottom: 0.5rem; border-bottom: 1px solid var(--lt-surface-200);">
                                    <span style="font-weight: 700; font-size: 0.8125rem;">Columns</span>
                                    <button type="button" class="p-treetable-reset-cols-btn" style="border: none; background: transparent; color: var(--lt-primary-600); cursor: pointer; font-size: 0.75rem; font-weight: 600;">Reset</button>
                                </div>
                                <div style="display: flex; flex-direction: column; gap: 0.35rem; max-height: 200px; overflow-y: auto;">
                                    ${columns.map(col => `
                                        <label style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.8125rem; cursor: pointer; padding: 0.25rem 0.4rem; border-radius: 4px;">
                                            <input type="checkbox" class="p-treetable-col-cb" data-field="${col.field}" ${visibleFields.includes(col.field) ? 'checked' : ''} />
                                            <span>${col.header}</span>
                                        </label>
                                    `).join('')}
                                </div>
                            </div>
                        ` : ''}
                    </div>
                </div>
            `;
        }

        // Table Header Slot (File Viewer caption in template demo)
        let headerHtml = props.headerTitle ? `
            <div class="p-treetable-header">
                <span>${props.headerTitle}</span>
            </div>
        ` : '';

        // Table Headers (Aura specification)
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
                            <th class="${isSort ? 'p-sortable-column' : ''} ${sortField === col.field || multiSortMeta.some(m => m.field === col.field) ? 'p-highlight' : ''} ${frozenClass}" data-col-field="${col.field}" style="${widthStyle}">
                                <div class="p-treetable-header-content">
                                    <span>${col.header}</span>
                                    ${isSort ? `<span class="p-treetable-sort-icon">${sortIconHtml}${sortBadgeHtml}</span>` : ''}
                                </div>
                                ${props.resizableColumns ? '<span class="p-column-resizer"></span>' : ''}
                            </th>
                        `;
                    }).join('')}
                    ${props.showActions ? '<th style="width: 140px; text-align: center;">Actions</th>' : ''}
                </tr>
            </thead>
        `;

        // Table Rows / Skeleton / Empty
        let tbodyHtml = '';
        if (isSkeleton && isLoading) {
            tbodyHtml = `
                <tbody class="p-treetable-tbody">
                    ${Array.from({ length: 10 }).map((_, r) => `
                        <tr>
                            ${visibleCols.map(() => `
                                <td><div class="p-treetable-skeleton-line" style="width: ${Math.floor(Math.random() * 40) + 50}%;"></div></td>
                            `).join('')}
                            ${props.showActions ? '<td><div class="p-treetable-skeleton-line" style="width: 70px; margin: 0 auto;"></div></td>' : ''}
                        </tr>
                    `).join('')}
                </tbody>
            `;
        } else if (displayedRows.length === 0) {
            tbodyHtml = `
                <tbody class="p-treetable-tbody">
                    <tr>
                        <td colspan="${visibleCols.length + (props.showActions ? 1 : 0)}" style="text-align: center; padding: 3rem 1rem;">
                            <div style="display: flex; flex-direction: column; align-items: center; gap: 0.75rem; color: var(--lt-surface-500);">
                                <div style="width: 3.5rem; height: 3.5rem; border-radius: 9999px; background: var(--lt-surface-100); display: flex; align-items: center; justify-content: center; color: var(--lt-surface-400);">
                                    <span style="transform: scale(1.6);">${SVG_ICONS.folder}</span>
                                </div>
                                <div>
                                    <p style="margin: 0; font-weight: 700; font-size: 1rem; color: var(--lt-surface-900);">${props.emptyMessage || 'No folders yet'}</p>
                                    <p style="margin: 0.25rem 0 0; font-size: 0.8125rem; color: var(--lt-surface-500);">Create your first folder to start building a tree.</p>
                                </div>
                                <button type="button" class="p-treetable-empty-add-btn" style="margin-top: 0.25rem; display: inline-flex; align-items: center; gap: 0.4rem; padding: 0.45rem 0.85rem; font-size: 0.8125rem; font-weight: 600; border-radius: 6px; border: none; background: var(--lt-primary-500); color: var(--lt-surface-0, var(--lt-surface-0)); cursor: pointer;">
                                    ${SVG_ICONS.plus} New Folder
                                </button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            `;
        } else {
            const colSpan = visibleCols.length + (props.showActions ? 1 : 0);
            if (virtualizer && virtualizer.isVirtual()) {
                const virtualItems = virtualizer.getVirtualItems();
                const rowsHtml = virtualItems.map(vi => renderSingleRow(allFlattenedRows[vi.index], vi.index, totalRecords, visibleCols)).join('');
                tbodyHtml = `
                    <tbody class="p-treetable-tbody">
                        <tr class="p-treetable-spacer-top"><td class="p-treetable-spacer-cell" colspan="${colSpan}"></td></tr>
                        ${rowsHtml}
                        <tr class="p-treetable-spacer-bottom"><td class="p-treetable-spacer-cell" colspan="${colSpan}"></td></tr>
                    </tbody>
                `;
            } else {
                const startIndex = isPaginator ? currentPage * rowsPerPage : 0;
                const rowsHtml = displayedRows.map((r, idx) => renderSingleRow(r, startIndex + idx, totalRecords, visibleCols)).join('');
                tbodyHtml = `<tbody class="p-treetable-tbody">${rowsHtml}</tbody>`;
            }
        }

        // Paginator UI
        let paginatorHtml = '';
        if (isPaginator) {
            if (props.headlessPaginator) {
                paginatorHtml = `
                    <div class="p-treetable-paginator" style="justify-content: center;">
                        <div style="display: flex; align-items: center; gap: 1rem; border: 1px solid var(--lt-surface-200); border-radius: 9999px; padding: 0.25rem 0.75rem;">
                            <button type="button" class="p-treetable-prev-btn p-treetable-paginator-btn" ${currentPage === 0 ? 'disabled' : ''}>
                                ${SVG_ICONS.chevronLeft}
                            </button>
                            <span style="font-size: 0.8125rem; font-weight: 600; color: var(--lt-surface-700);">
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
                            <span style="font-size: 0.8125rem; color: var(--lt-surface-500);">Rows:</span>
                            <select class="p-treetable-rpp-select" aria-label="Rows per page" style="padding: 0.25rem 0.5rem; font-size: 0.8125rem; border-radius: 6px; border: 1px solid var(--lt-surface-300); background: var(--lt-surface-0); color: var(--lt-surface-700);">
                                ${rowsPerPageOptions.map(opt => `<option value="${opt}" ${opt === rowsPerPage ? 'selected' : ''}>${opt}</option>`).join('')}
                            </select>
                        </div>
                        <div style="display: flex; align-items: center; gap: 0.25rem;">
                            <button type="button" class="p-treetable-first-btn p-treetable-paginator-btn" aria-label="First Page" ${currentPage === 0 ? 'disabled' : ''}>${SVG_ICONS.firstPage}</button>
                            <button type="button" class="p-treetable-prev-btn p-treetable-paginator-btn" aria-label="Previous Page" ${currentPage === 0 ? 'disabled' : ''}>${SVG_ICONS.chevronLeft}</button>
                            ${Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                                const p = i;
                                return `<button type="button" class="p-treetable-page-btn p-treetable-paginator-btn ${p === currentPage ? 'p-highlight' : ''}" data-page="${p}" aria-label="Page ${p + 1}">${p + 1}</button>`;
                            }).join('')}
                            <button type="button" class="p-treetable-next-btn p-treetable-paginator-btn" aria-label="Next Page" ${currentPage >= totalPages - 1 ? 'disabled' : ''}>${SVG_ICONS.chevronRight}</button>
                            <button type="button" class="p-treetable-last-btn p-treetable-paginator-btn" aria-label="Last Page" ${currentPage >= totalPages - 1 ? 'disabled' : ''}>${SVG_ICONS.lastPage}</button>
                        </div>
                        <div style="font-size: 0.8125rem; color: var(--lt-surface-500);">
                            ${firstRecord} to ${lastRecord} of ${totalRecords}
                        </div>
                    </div>
                `;
            }
        }

        // Footer
        let footerHtml = props.footerText ? `
            <div class="p-treetable-footer">
                <button type="button" class="p-treetable-footer-reload-btn" style="display: inline-flex; align-items: center; gap: 0.4rem; padding: 0.45rem 0.85rem; font-size: 0.8125rem; font-weight: 600; border-radius: 6px; border: none; background: var(--lt-warn-500, var(--lt-warn-500)); color: var(--lt-surface-0, var(--lt-surface-0)); cursor: pointer;">
                    ${SVG_ICONS.refresh} ${props.footerText}
                </button>
            </div>
        ` : '';

        // Loading Overlay
        let loadingMaskHtml = isLoading && !isSkeleton ? `
            <div class="p-treetable-loading-mask">
                <div style="display: flex; flex-direction: column; align-items: center; gap: 0.5rem; color: var(--lt-primary-500);">
                    ${SVG_ICONS.spinner}
                    <span style="font-size: 0.8125rem; font-weight: 600; color: var(--lt-surface-700);">Loading nodes…</span>
                </div>
            </div>
        ` : '';

        const scrollStyle = isScrollable ? `max-height: ${scrollHeight}; overflow: auto;` : '';
        const sizeClass = size === 'small' ? 'p-treetable-sm' : (size === 'large' ? 'p-treetable-lg' : '');
        const gridlinesClass = showGridlines ? 'p-treetable-gridlines' : '';

        setHtml(container, html`
            ${unsafe(topControlsHtml)}
            <div class="p-treetable p-component ${sizeClass} ${gridlinesClass}">
                ${unsafe(headerHtml)}
                ${unsafe(loadingMaskHtml)}
                <div class="p-treetable-scrollable-wrapper" style="${scrollStyle}">
                    <table class="p-treetable-table">
                        ${unsafe(theadHtml)}
                        ${unsafe(tbodyHtml)}
                    </table>
                </div>
                ${unsafe(paginatorHtml)}
                ${unsafe(footerHtml)}
            </div>
        `);

        updateVirtualPositions();
        bindEvents();
    }

    function bindRowEvents() {
        // Expand/Collapse Toggler
        container.querySelectorAll<HTMLButtonElement>('.p-treetable-toggler').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const key = btn.getAttribute('data-toggler-key');
                if (key && nodeMap.has(key)) {
                    toggleExpand(nodeMap.get(key));
                }
            }, { signal: ctx?.signal });
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
            }, { signal: ctx?.signal });
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
            }, { signal: ctx?.signal });

            row.addEventListener('keydown', (e) => {
                const key = row.getAttribute('data-key');
                if (!key || !nodeMap.has(key)) return;
                const node = nodeMap.get(key);

                if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    const currIdx = parseInt(row.getAttribute('data-index') || '0', 10);
                    if (currIdx < currentFlatRows.length - 1) {
                        focusRowByIndex(currIdx + 1);
                    }
                } else if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    const currIdx = parseInt(row.getAttribute('data-index') || '0', 10);
                    if (currIdx > 0) {
                        focusRowByIndex(currIdx - 1);
                    }
                } else if (e.key === 'ArrowRight') {
                    e.preventDefault();
                    if (!expandedKeys[key] && node.children && node.children.length) {
                        toggleExpand(node);
                    }
                } else if (e.key === 'ArrowLeft') {
                    e.preventDefault();
                    if (expandedKeys[key]) {
                        toggleExpand(node);
                    }
                }
            }, { signal: ctx?.signal });

            // Context Menu
            if (contextMenuEnabled) {
                row.addEventListener('contextmenu', (e) => {
                    e.preventDefault();
                    const key = row.getAttribute('data-key');
                    if (key && nodeMap.has(key)) {
                        selectedContextMenuNode = nodeMap.get(key);
                        showContextMenu(e.clientX, e.clientY);
                    }
                }, { signal: ctx?.signal });
            }
        });
    }

    function bindEvents() {
        bindRowEvents();

        const wrapper = container.querySelector<HTMLElement>('.p-treetable-scrollable-wrapper');
        if (wrapper && !scrollBound) {
            scrollBound = true;
            wrapper.addEventListener('scroll', () => {
                if (!virtualizer || !virtualizer.isVirtual()) return;
                const newVirtualItems = virtualizer.getVirtualItems();
                if (newVirtualItems.length === 0) return;
                const newStart = newVirtualItems[0].index;
                const newEnd = newVirtualItems[newVirtualItems.length - 1].index;
                if (newStart === currentStart && newEnd === currentEnd) return;
                currentStart = newStart;
                currentEnd = newEnd;
                reRenderVirtualRows();
            }, { signal: ctx?.signal, passive: true });
        }

        // Sorting
        container.querySelectorAll<HTMLTableCellElement>('.p-sortable-column').forEach(th => {
            th.addEventListener('click', () => {
                const field = th.getAttribute('data-col-field');
                if (field) handleSort(field);
            }, { signal: ctx?.signal });
        });

        // Pagination controls
        container.querySelector('.p-treetable-first-btn')?.addEventListener('click', () => { currentPage = 0; render(); }, { signal: ctx?.signal });
        container.querySelector('.p-treetable-prev-btn')?.addEventListener('click', () => { if (currentPage > 0) { currentPage--; render(); } }, { signal: ctx?.signal });
        container.querySelector('.p-treetable-next-btn')?.addEventListener('click', () => { currentPage++; render(); }, { signal: ctx?.signal });
        container.querySelector('.p-treetable-last-btn')?.addEventListener('click', () => { currentPage = 999999; render(); }, { signal: ctx?.signal });

        container.querySelectorAll<HTMLButtonElement>('.p-treetable-page-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const page = parseInt(btn.getAttribute('data-page') || '0', 10);
                currentPage = page;
                render();
            }, { signal: ctx?.signal });
        });

        container.querySelector<HTMLSelectElement>('.p-treetable-rpp-select')?.addEventListener('change', (e) => {
            rowsPerPage = parseInt((e.target as HTMLSelectElement).value, 10);
            currentPage = 0;
            render();
        }, { signal: ctx?.signal });

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
            }, { signal: ctx?.signal });
        }

        // Column toggle button
        container.querySelector('.p-treetable-column-toggle-btn')?.addEventListener('click', (e) => {
            e.stopPropagation();
            showPopover = !showPopover;
            render();
        }, { signal: ctx?.signal });

        container.querySelectorAll<HTMLInputElement>('.p-treetable-col-cb').forEach(cb => {
            cb.addEventListener('change', (e) => {
                const field = cb.getAttribute('data-field');
                if (field) {
                    if (cb.checked) {
                        if (!visibleFields.includes(field)) visibleFields.push(field);
                    } else {
                        visibleFields = visibleFields.filter(f => f !== field);
                    }
                    render();
                }
            }, { signal: ctx?.signal });
        });

        container.querySelector('.p-treetable-reset-cols-btn')?.addEventListener('click', () => {
            visibleFields = columns.map(c => c.field);
            render();
        }, { signal: ctx?.signal });

        container.querySelector('.p-treetable-empty-add-btn')?.addEventListener('click', () => {
            rawNodes.push({
                key: String(rawNodes.length),
                data: { name: `New Folder ${rawNodes.length + 1}`, size: '0kb', type: 'Folder' },
                children: []
            });
            buildMaps(rawNodes);
            render();
        }, { signal: ctx?.signal });

        container.querySelector('.p-treetable-footer-reload-btn')?.addEventListener('click', () => {
            notifyToast('info', 'TreeTable Reloaded', 'Refreshed node hierarchy');
        }, { signal: ctx?.signal });
    }

    function showContextMenu(x: number, y: number) {
        document.querySelectorAll('.p-treetable-contextmenu').forEach(el => el.remove());
        const menu = document.createElement('div');
        menu.className = 'p-treetable-contextmenu'; container.setAttribute('data-part', 'root');
        menu.style.left = `${x}px`;
        menu.style.top = `${y}px`;

        setHtml(menu, unsafe(`
            <div class="p-treetable-contextmenu-item" data-action="view">
                ${SVG_ICONS.search} View
            </div>
            <div class="p-treetable-contextmenu-item" data-action="delete" style="color: var(--lt-danger-500, var(--lt-danger-500));">
                ${SVG_ICONS.trash} Delete
            </div>
        `));

        document.body.appendChild(menu);

        menu.querySelector('[data-action="view"]')?.addEventListener('click', () => {
            if (selectedContextMenuNode) {
                notifyToast('info', 'Node Selected', selectedContextMenuNode.data.name);
            }
            menu.remove();
        }, { signal: ctx?.signal });

        menu.querySelector('[data-action="delete"]')?.addEventListener('click', () => {
            if (selectedContextMenuNode) {
                notifyToast('error', 'Node Deleted', selectedContextMenuNode.data.name);
            }
            menu.remove();
        }, { signal: ctx?.signal });

        const closeMenu = (e: MouseEvent) => {
            if (!menu.contains(e.target as Node)) {
                menu.remove();
                document.removeEventListener('click', closeMenu);
            }
        };
        const tMenu = setTimeout(() => document.addEventListener('click', closeMenu, { signal: ctx?.signal }), 50);
        ctx?.onCleanup?.(() => clearTimeout(tMenu));
    }

    render();
}
