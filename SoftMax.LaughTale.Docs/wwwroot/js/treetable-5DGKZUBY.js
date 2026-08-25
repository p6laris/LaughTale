import {
  injectIslandStyle
} from "./chunk-3TFPN5JM.js";

// ../SoftMax.LaughTale.Client/src/components/treetable.ts
var TREETABLE_CSS = `
.p-treetable {
    position: relative;
    background: var(--p-surface-0, #ffffff);
    color: var(--p-surface-700, #334155);
    border: 1px solid var(--p-surface-200, #e2e8f0);
    border-radius: var(--p-border-radius-md, 6px);
    font-family: var(--p-font-family, inherit);
    box-sizing: border-box;
    width: 100%;
    overflow: hidden;
}

.p-treetable-header {
    background: var(--p-surface-0, #ffffff);
    color: var(--p-surface-900, #0f172a);
    padding: 0.875rem 1.25rem;
    border-bottom: 1px solid var(--p-surface-200, #e2e8f0);
    font-weight: 700;
    font-size: 1.125rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.p-treetable-footer {
    background: var(--p-surface-50, #f8fafc);
    color: var(--p-surface-700, #334155);
    padding: 0.75rem 1.25rem;
    border-top: 1px solid var(--p-surface-200, #e2e8f0);
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
    background: var(--p-surface-100, #f1f5f9);
    color: var(--p-surface-900, #0f172a);
}

.p-treetable-thead > tr > th.p-highlight {
    color: var(--p-primary-600, #10b981);
}

.p-treetable-sort-icon {
    display: inline-flex;
    align-items: center;
    color: var(--p-surface-400, #94a3b8);
    transition: color 0.15s ease;
}
.p-treetable-thead > tr > th.p-highlight .p-treetable-sort-icon {
    color: var(--p-primary-600, #10b981);
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
    box-sizing: border-box;
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
    transition: background-color 0.15s ease, transform 0.2s ease, color 0.15s ease;
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
    flex-shrink: 0;
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
    padding: 0.2rem 0.55rem;
    border-radius: 4px;
    font-size: 0.75rem;
    font-weight: 600;
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
    padding: 0.65rem 1rem;
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

/* Column Toggle Popover */
.p-treetable-popover {
    position: absolute;
    top: 100%;
    right: 0;
    margin-top: 0.5rem;
    background: var(--p-surface-0, #ffffff);
    border: 1px solid var(--p-surface-200, #e2e8f0);
    border-radius: 8px;
    box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1);
    z-index: 50;
    min-width: 260px;
    padding: 0.5rem;
}

/* Dark Mode Tokens */
.dark .p-treetable,
[data-theme="dark"] .p-treetable {
    background: var(--p-surface-900, #0f172a) !important;
    color: var(--p-surface-100, #f8fafc) !important;
    border-color: var(--p-surface-700, #334155) !important;
}
.dark .p-treetable-header,
[data-theme="dark"] .p-treetable-header {
    background: var(--p-surface-900, #0f172a) !important;
    color: var(--p-surface-0, #ffffff) !important;
    border-color: var(--p-surface-700, #334155) !important;
}
.dark .p-treetable-footer,
[data-theme="dark"] .p-treetable-footer {
    background: var(--p-surface-950, #020617) !important;
    color: var(--p-surface-200, #e2e8f0) !important;
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
[data-theme="dark"] .p-treetable-contextmenu,
.dark .p-treetable-popover,
[data-theme="dark"] .p-treetable-popover {
    background: var(--p-surface-900, #0f172a) !important;
    border-color: var(--p-surface-700, #334155) !important;
}
`;
var SVG_ICONS = {
  chevronRight: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>',
  chevronDown: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>',
  chevronLeft: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>',
  firstPage: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m11 17-5-5 5-5"/><path d="m18 17-5-5 5-5"/><path d="M6 19V5"/></svg>',
  lastPage: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 17 5-5-5-5"/><path d="m13 17 5-5-5-5"/><path d="M18 19V5"/></svg>',
  sortAsc: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m18 15-6-6-6 6"/></svg>',
  sortDesc: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>',
  sortNone: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m7 15 5 5 5-5"/><path d="m7 9 5-5 5 5"/></svg>',
  folder: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/></svg>',
  file: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/></svg>',
  image: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>',
  video: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m22 8-6 4 6 4V8Z"/><rect width="14" height="12" x="2" y="6" rx="2" ry="2"/></svg>',
  check: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
  minus: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="5" x2="19" y1="12" y2="12"/></svg>',
  search: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>',
  cog: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z"/><path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"/></svg>',
  spinner: '<svg class="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>',
  refresh: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 16h5v5"/></svg>',
  download: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>',
  pencil: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>',
  trash: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>',
  plus: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg>',
  bars: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>'
};
function TreeTableIsland(container, props) {
  injectIslandStyle("treetable", TREETABLE_CSS);
  let rawNodes = JSON.parse(JSON.stringify(props.value || props.nodes || []));
  let columns = props.columns ? [...props.columns] : [
    { field: "name", header: "Name", expander: true },
    { field: "size", header: "Size", sortable: true },
    { field: "type", header: "Type", sortable: true }
  ];
  let visibleFields = columns.map((c) => c.field);
  let size = props.size || "normal";
  let showGridlines = !!props.showGridlines;
  let selectionMode = props.selectionMode || null;
  let metaKeySelection = props.metaKeySelection ?? true;
  let isScrollable = !!props.scrollable;
  let scrollHeight = props.scrollHeight || "auto";
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
  let sortMode = props.sortMode || "single";
  let sortField = props.sortField || null;
  let sortOrder = props.sortOrder ?? 1;
  let multiSortMeta = props.multiSortMeta ? [...props.multiSortMeta] : [];
  let removableSort = !!props.removableSort;
  let globalFilter = "";
  let columnFilters = {};
  let expandedKeys = { ...props.expandedKeys || { "0": true } };
  let singleSelectionKey = null;
  let multiSelectionKeys = {};
  let checkboxSelectionKeys = {};
  let selectedContextMenuNode = null;
  if (props.selectionKeys) {
    if (selectionMode === "single" && typeof props.selectionKeys === "string") {
      singleSelectionKey = props.selectionKeys;
    } else if (selectionMode === "multiple") {
      multiSelectionKeys = { ...props.selectionKeys };
    } else if (selectionMode === "checkbox") {
      checkboxSelectionKeys = { ...props.selectionKeys };
    }
  }
  let nodeMap = /* @__PURE__ */ new Map();
  let parentMap = /* @__PURE__ */ new Map();
  function buildMaps(nodesList, parent = null) {
    nodesList.forEach((node) => {
      const key = String(node.key || node.id || Math.random().toString());
      node.key = key;
      node.data = node.data || { name: node.label || node.name, size: "\u2014", type: "Folder" };
      nodeMap.set(key, node);
      if (parent) parentMap.set(key, parent);
      if (node.children && node.children.length) {
        buildMaps(node.children, node);
      }
    });
  }
  buildMaps(rawNodes);
  function notifyToast(severity, summary, detail) {
    if (props.events && window.AuraToast) {
      window.AuraToast.add({ severity, summary, detail, life: 3e3 });
    }
  }
  function getSeverity(type) {
    switch (type) {
      case "Folder":
        return "warn";
      case "Document":
      case "Resume":
      case "Application":
      case "PDF":
        return "info";
      case "Picture":
      case "Video":
        return "success";
      case "Text":
      case "Zip":
      case "Link":
        return "secondary";
      default:
        return "secondary";
    }
  }
  function getIcon(type, isFolderOpen) {
    switch (type) {
      case "Folder":
        return isFolderOpen ? SVG_ICONS.folder : SVG_ICONS.folder;
      case "Picture":
        return SVG_ICONS.image;
      case "Video":
        return SVG_ICONS.video;
      default:
        return SVG_ICONS.file;
    }
  }
  function setCheckboxState(node, checked) {
    const key = String(node.key);
    checkboxSelectionKeys[key] = { checked, partialChecked: false };
    if (node.children && node.children.length) {
      node.children.forEach((c) => setCheckboxState(c, checked));
    }
  }
  function updateAncestorCheckboxes(node) {
    const parent = parentMap.get(String(node.key));
    if (!parent) return;
    const parentKey = String(parent.key);
    const children = parent.children || [];
    let allChecked = true;
    let anyChecked = false;
    let anyPartial = false;
    children.forEach((c) => {
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
  function toggleExpand(node) {
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
            { key: `${key}-0`, data: { name: `${node.data.name} - 0`, size: `${Math.floor(Math.random() * 800) + 50}kb`, type: "Document" } },
            { key: `${key}-1`, data: { name: `${node.data.name} - 1`, size: `${Math.floor(Math.random() * 800) + 50}kb`, type: "Text" } }
          ];
          buildMaps(rawNodes);
          render();
        }, 500);
        return;
      }
      render();
    }
  }
  function handleSort(field) {
    if (sortMode === "single") {
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
    } else if (sortMode === "multiple") {
      const existingIdx = multiSortMeta.findIndex((m) => m.field === field);
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
  function compareNodes(a, b) {
    if (sortMode === "single" && sortField && sortOrder !== 0) {
      const valA = a.data[sortField] ?? "";
      const valB = b.data[sortField] ?? "";
      const res = typeof valA === "number" ? valA - valB : String(valA).localeCompare(String(valB));
      return res * sortOrder;
    } else if (sortMode === "multiple" && multiSortMeta.length > 0) {
      for (let meta of multiSortMeta) {
        const valA = a.data[meta.field] ?? "";
        const valB = b.data[meta.field] ?? "";
        const res = typeof valA === "number" ? valA - valB : String(valA).localeCompare(String(valB));
        if (res !== 0) return res * meta.order;
      }
    }
    return 0;
  }
  function filterAndSort(nodesList) {
    let result = nodesList.filter((node) => {
      if (globalFilter) {
        const q = globalFilter.toLowerCase();
        const matchName = String(node.data?.name || "").toLowerCase().includes(q);
        const matchType = String(node.data?.type || "").toLowerCase().includes(q);
        const matchSize = String(node.data?.size || "").toLowerCase().includes(q);
        const matchChildren = node.children && filterAndSort(node.children).length > 0;
        if (!matchName && !matchType && !matchSize && !matchChildren) return false;
      }
      for (let [field, filterVal] of Object.entries(columnFilters)) {
        if (filterVal) {
          const q = filterVal.toLowerCase();
          const val = String(node.data?.[field] || "").toLowerCase();
          if (!val.includes(q)) return false;
        }
      }
      return true;
    });
    result = [...result].sort(compareNodes);
    return result.map((node) => ({
      ...node,
      children: node.children ? filterAndSort(node.children) : []
    }));
  }
  function flattenVisible(nodesList, level = 0) {
    const rows = [];
    nodesList.forEach((node) => {
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
    const displayedRows = isPaginator ? allVisibleRows.slice(currentPage * rowsPerPage, (currentPage + 1) * rowsPerPage) : allVisibleRows;
    const visibleCols = columns.filter((c) => visibleFields.includes(c.field));
    let headerHtml = "";
    if (props.headerTitle || props.filter || columnToggle) {
      headerHtml = `
                <div class="p-treetable-header">
                    ${props.headerTitle ? `<span>${props.headerTitle}</span>` : "<div></div>"}
                    <div style="display: flex; align-items: center; gap: 0.75rem;">
                        ${props.filter ? `
                            <div style="position: relative; width: 220px;">
                                <span style="position: absolute; left: 0.65rem; top: 50%; transform: translateY(-50%); color: var(--p-surface-400);">${SVG_ICONS.search}</span>
                                <input type="text" class="p-treetable-global-search" placeholder="Keyword search" value="${globalFilter}" style="width: 100%; padding: 0.4rem 0.65rem 0.4rem 2.2rem; font-size: 0.8125rem; border-radius: 6px; border: 1px solid var(--p-surface-300); background: var(--p-surface-0); color: var(--p-surface-900); outline: none; box-sizing: border-box;" />
                            </div>
                        ` : ""}
                        ${columnToggle ? `
                            <div style="position: relative;">
                                <button type="button" class="p-treetable-column-toggle-btn" style="display: inline-flex; align-items: center; gap: 0.4rem; padding: 0.4rem 0.75rem; font-size: 0.8125rem; font-weight: 600; border-radius: 6px; border: 1px solid var(--p-surface-300); background: var(--p-surface-0); color: var(--p-surface-700); cursor: pointer;">
                                    ${SVG_ICONS.cog} Columns
                                </button>
                                ${showPopover ? `
                                    <div class="p-treetable-popover">
                                        <div style="display: flex; align-items: center; justify-content: space-between; padding-bottom: 0.5rem; margin-bottom: 0.5rem; border-bottom: 1px solid var(--p-surface-200);">
                                            <span style="font-weight: 700; font-size: 0.8125rem;">Columns</span>
                                            <button type="button" class="p-treetable-reset-cols-btn" style="border: none; background: transparent; color: var(--p-primary-600); cursor: pointer; font-size: 0.75rem; font-weight: 600;">Reset</button>
                                        </div>
                                        <div style="display: flex; flex-direction: column; gap: 0.35rem; max-height: 200px; overflow-y: auto;">
                                            ${columns.map((col) => `
                                                <label style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.8125rem; cursor: pointer; padding: 0.25rem 0.4rem; border-radius: 4px;">
                                                    <input type="checkbox" class="p-treetable-col-cb" data-field="${col.field}" ${visibleFields.includes(col.field) ? "checked" : ""} />
                                                    <span>${col.header}</span>
                                                </label>
                                            `).join("")}
                                        </div>
                                    </div>
                                ` : ""}
                            </div>
                        ` : ""}
                    </div>
                </div>
            `;
    }
    const theadHtml = `
            <thead class="p-treetable-thead">
                <tr>
                    ${visibleCols.map((col) => {
      const isExp = !!col.expander;
      const isSort = !!col.sortable;
      const widthStyle = col.width ? `width: ${col.width};` : col.minWidth ? `min-width: ${col.minWidth};` : "";
      const frozenClass = col.frozen ? col.alignFrozen === "right" ? "p-frozen-right" : "p-frozen-left" : "";
      let sortIconHtml = "";
      let sortBadgeHtml = "";
      if (isSort) {
        if (sortMode === "single") {
          if (sortField === col.field) {
            sortIconHtml = sortOrder === 1 ? SVG_ICONS.sortAsc : sortOrder === -1 ? SVG_ICONS.sortDesc : SVG_ICONS.sortNone;
          } else {
            sortIconHtml = SVG_ICONS.sortNone;
          }
        } else if (sortMode === "multiple") {
          const idx = multiSortMeta.findIndex((m) => m.field === col.field);
          if (idx >= 0) {
            sortIconHtml = multiSortMeta[idx].order === 1 ? SVG_ICONS.sortAsc : SVG_ICONS.sortDesc;
            sortBadgeHtml = `<span class="p-sortable-badge">${idx + 1}</span>`;
          } else {
            sortIconHtml = SVG_ICONS.sortNone;
          }
        }
      }
      return `
                            <th class="${isSort ? "p-sortable-column" : ""} ${sortField === col.field || multiSortMeta.some((m) => m.field === col.field) ? "p-highlight" : ""} ${frozenClass}" data-col-field="${col.field}" style="${widthStyle}">
                                <div class="p-treetable-header-content">
                                    <span>${col.header}</span>
                                    ${isSort ? `<span class="p-treetable-sort-icon">${sortIconHtml}${sortBadgeHtml}</span>` : ""}
                                </div>
                                ${props.resizableColumns ? '<span class="p-column-resizer"></span>' : ""}
                            </th>
                        `;
    }).join("")}
                    ${props.showActions ? '<th style="width: 140px; text-align: center;">Actions</th>' : ""}
                </tr>
            </thead>
        `;
    let tbodyHtml = "";
    if (isSkeleton && isLoading) {
      tbodyHtml = `
                <tbody class="p-treetable-tbody">
                    ${Array.from({ length: 5 }).map((_, r) => `
                        <tr>
                            ${visibleCols.map(() => `
                                <td><div class="p-treetable-skeleton-line" style="width: ${Math.floor(Math.random() * 40) + 50}%;"></div></td>
                            `).join("")}
                            ${props.showActions ? '<td><div class="p-treetable-skeleton-line" style="width: 70px; margin: 0 auto;"></div></td>' : ""}
                        </tr>
                    `).join("")}
                </tbody>
            `;
    } else if (displayedRows.length === 0) {
      tbodyHtml = `
                <tbody class="p-treetable-tbody">
                    <tr>
                        <td colspan="${visibleCols.length + (props.showActions ? 1 : 0)}" style="text-align: center; padding: 3rem 1rem;">
                            <div style="display: flex; flex-direction: column; align-items: center; gap: 0.75rem; color: var(--p-surface-500);">
                                <div style="width: 3.5rem; height: 3.5rem; border-radius: 9999px; background: var(--p-surface-100); display: flex; align-items: center; justify-content: center; color: var(--p-surface-400);">
                                    <span style="transform: scale(1.6);">${SVG_ICONS.folder}</span>
                                </div>
                                <div>
                                    <p style="margin: 0; font-weight: 700; font-size: 1rem; color: var(--p-surface-900);">${props.emptyMessage || "No folders yet"}</p>
                                    <p style="margin: 0.25rem 0 0; font-size: 0.8125rem; color: var(--p-surface-500);">Create your first folder to start building a tree.</p>
                                </div>
                                <button type="button" class="p-treetable-empty-add-btn" style="margin-top: 0.25rem; display: inline-flex; align-items: center; gap: 0.4rem; padding: 0.45rem 0.85rem; font-size: 0.8125rem; font-weight: 600; border-radius: 6px; border: none; background: var(--p-primary-500); color: #ffffff; cursor: pointer;">
                                    ${SVG_ICONS.plus} New Folder
                                </button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            `;
    } else {
      const rowsHtml = displayedRows.map(({ node, level }) => {
        const key = String(node.key);
        const hasChildren = node.children && node.children.length > 0 || isLazy && !node.leaf;
        const isExpanded = !!expandedKeys[key];
        const isSelected = selectionMode === "single" ? singleSelectionKey === key : selectionMode === "multiple" ? !!multiSelectionKeys[key] : selectionMode === "checkbox" ? !!checkboxSelectionKeys[key]?.checked : false;
        const isPartial = selectionMode === "checkbox" && !!checkboxSelectionKeys[key]?.partialChecked;
        return `
                    <tr class="p-treetable-row ${isSelected ? "p-highlight" : ""}" data-key="${key}" tabindex="0">
                        ${visibleCols.map((col) => {
          const isExp = !!col.expander;
          const frozenClass = col.frozen ? col.alignFrozen === "right" ? "p-frozen-right" : "p-frozen-left" : "";
          const widthStyle = col.width ? `width: ${col.width};` : col.minWidth ? `min-width: ${col.minWidth};` : "";
          if (isExp) {
            const toggleSvg = hasChildren ? node.loading ? SVG_ICONS.spinner : isExpanded ? SVG_ICONS.chevronDown : SVG_ICONS.chevronRight : "";
            const iconSvg = getIcon(node.data.type, isExpanded);
            let checkboxHtml = "";
            if (selectionMode === "checkbox") {
              checkboxHtml = `
                                        <div class="p-treetable-checkbox ${isSelected ? "p-highlight" : isPartial ? "p-indeterminate" : ""}" data-cb-key="${key}">
                                            ${isSelected ? SVG_ICONS.check : isPartial ? SVG_ICONS.minus : ""}
                                        </div>
                                    `;
            }
            return `
                                    <td class="${frozenClass}" style="${widthStyle} padding-left: ${level * 1.5 + 0.75}rem;">
                                        <div style="display: flex; align-items: center;">
                                            <button type="button" class="p-treetable-toggler ${!hasChildren ? "p-hidden-space" : ""}" data-toggler-key="${key}">
                                                ${toggleSvg}
                                            </button>
                                            ${checkboxHtml}
                                            <span style="display: inline-flex; align-items: center; margin-right: 0.5rem; color: var(--p-surface-400);">${iconSvg}</span>
                                            <span style="font-weight: ${hasChildren ? "600" : "400"}; color: var(--p-surface-900);">${node.data[col.field] ?? ""}</span>
                                        </div>
                                    </td>
                                `;
          }
          if (col.field === "type") {
            const typeVal = node.data.type || "Folder";
            const sev = getSeverity(typeVal);
            return `
                                    <td class="${frozenClass}" style="${widthStyle}">
                                        <span class="p-treetable-tag p-tag-${sev}">${typeVal}</span>
                                    </td>
                                `;
          }
          return `
                                <td class="${frozenClass}" style="${widthStyle}">
                                    <span style="color: var(--p-surface-700);">${node.data[col.field] ?? "\u2014"}</span>
                                </td>
                            `;
        }).join("")}
                        ${props.showActions ? `
                            <td style="text-align: center;">
                                <div style="display: inline-flex; align-items: center; gap: 0.4rem;">
                                    <button type="button" class="p-treetable-action-view" style="width: 2rem; height: 2rem; border-radius: 9999px; border: none; background: var(--p-surface-100); color: var(--p-surface-700); display: flex; align-items: center; justify-content: center; cursor: pointer;">
                                        ${SVG_ICONS.search}
                                    </button>
                                    <button type="button" class="p-treetable-action-edit" style="width: 2rem; height: 2rem; border-radius: 9999px; border: none; background: #dcfce7; color: #15803d; display: flex; align-items: center; justify-content: center; cursor: pointer;">
                                        ${SVG_ICONS.pencil}
                                    </button>
                                </div>
                            </td>
                        ` : ""}
                    </tr>
                `;
      }).join("");
      tbodyHtml = `<tbody class="p-treetable-tbody">${rowsHtml}</tbody>`;
    }
    let paginatorHtml = "";
    if (isPaginator) {
      if (props.headlessPaginator) {
        paginatorHtml = `
                    <div class="p-treetable-paginator" style="justify-content: center;">
                        <div style="display: flex; align-items: center; gap: 1rem; border: 1px solid var(--p-surface-200); border-radius: 9999px; padding: 0.25rem 0.75rem;">
                            <button type="button" class="p-treetable-prev-btn p-treetable-paginator-btn" ${currentPage === 0 ? "disabled" : ""}>
                                ${SVG_ICONS.chevronLeft}
                            </button>
                            <span style="font-size: 0.8125rem; font-weight: 600; color: var(--p-surface-700);">
                                Page ${currentPage + 1} of ${totalPages} (${totalRecords} items)
                            </span>
                            <button type="button" class="p-treetable-next-btn p-treetable-paginator-btn" ${currentPage >= totalPages - 1 ? "disabled" : ""}>
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
                                ${rowsPerPageOptions.map((opt) => `<option value="${opt}" ${opt === rowsPerPage ? "selected" : ""}>${opt}</option>`).join("")}
                            </select>
                        </div>
                        <div style="display: flex; align-items: center; gap: 0.25rem;">
                            <button type="button" class="p-treetable-first-btn p-treetable-paginator-btn" ${currentPage === 0 ? "disabled" : ""}>${SVG_ICONS.firstPage}</button>
                            <button type="button" class="p-treetable-prev-btn p-treetable-paginator-btn" ${currentPage === 0 ? "disabled" : ""}>${SVG_ICONS.chevronLeft}</button>
                            ${Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
          const p = i;
          return `<button type="button" class="p-treetable-page-btn p-treetable-paginator-btn ${p === currentPage ? "p-highlight" : ""}" data-page="${p}">${p + 1}</button>`;
        }).join("")}
                            <button type="button" class="p-treetable-next-btn p-treetable-paginator-btn" ${currentPage >= totalPages - 1 ? "disabled" : ""}>${SVG_ICONS.chevronRight}</button>
                            <button type="button" class="p-treetable-last-btn p-treetable-paginator-btn" ${currentPage >= totalPages - 1 ? "disabled" : ""}>${SVG_ICONS.lastPage}</button>
                        </div>
                        <div style="font-size: 0.8125rem; color: var(--p-surface-500);">
                            ${firstRecord} to ${lastRecord} of ${totalRecords}
                        </div>
                    </div>
                `;
      }
    }
    let footerHtml = props.footerText ? `
            <div class="p-treetable-footer">
                <button type="button" class="p-treetable-footer-reload-btn" style="display: inline-flex; align-items: center; gap: 0.4rem; padding: 0.45rem 0.85rem; font-size: 0.8125rem; font-weight: 600; border-radius: 6px; border: none; background: #f59e0b; color: #ffffff; cursor: pointer;">
                    ${SVG_ICONS.refresh} ${props.footerText}
                </button>
            </div>
        ` : "";
    let loadingMaskHtml = isLoading && !isSkeleton ? `
            <div class="p-treetable-loading-mask">
                <div style="display: flex; flex-direction: column; align-items: center; gap: 0.5rem; color: var(--p-primary-500);">
                    ${SVG_ICONS.spinner}
                    <span style="font-size: 0.8125rem; font-weight: 600; color: var(--p-surface-700);">Loading nodes\u2026</span>
                </div>
            </div>
        ` : "";
    const scrollStyle = isScrollable ? `max-height: ${scrollHeight}; overflow: auto;` : "";
    const sizeClass = size === "small" ? "p-treetable-sm" : size === "large" ? "p-treetable-lg" : "";
    const gridlinesClass = showGridlines ? "p-treetable-gridlines" : "";
    container.innerHTML = `
            <div class="p-treetable p-component ${sizeClass} ${gridlinesClass}">
                ${headerHtml}
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
    container.querySelectorAll(".p-treetable-toggler").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const key = btn.getAttribute("data-toggler-key");
        if (key && nodeMap.has(key)) {
          toggleExpand(nodeMap.get(key));
        }
      });
    });
    container.querySelectorAll(".p-treetable-checkbox").forEach((cb) => {
      cb.addEventListener("click", (e) => {
        e.stopPropagation();
        const key = cb.getAttribute("data-cb-key");
        if (key && nodeMap.has(key)) {
          const node = nodeMap.get(key);
          const isChecked = !checkboxSelectionKeys[key]?.checked;
          setCheckboxState(node, isChecked);
          updateAncestorCheckboxes(node);
          notifyToast(isChecked ? "success" : "warn", isChecked ? "Node Selected" : "Node Unselected", node.data.name);
          render();
        }
      });
    });
    container.querySelectorAll(".p-treetable-row").forEach((row) => {
      row.addEventListener("click", (e) => {
        const key = row.getAttribute("data-key");
        if (!key || !nodeMap.has(key)) return;
        const node = nodeMap.get(key);
        if (selectionMode === "single") {
          if (singleSelectionKey === key) {
            singleSelectionKey = null;
            notifyToast("warn", "Node Unselected", node.data.name);
          } else {
            singleSelectionKey = key;
            notifyToast("success", "Node Selected", node.data.name);
          }
          render();
        } else if (selectionMode === "multiple") {
          const isMeta = e.metaKey || e.ctrlKey;
          if (metaKeySelection && !isMeta) {
            multiSelectionKeys = { [key]: true };
          } else {
            if (multiSelectionKeys[key]) delete multiSelectionKeys[key];
            else multiSelectionKeys[key] = true;
          }
          notifyToast("success", "Selection Updated", node.data.name);
          render();
        }
      });
      if (contextMenuEnabled) {
        row.addEventListener("contextmenu", (e) => {
          e.preventDefault();
          const key = row.getAttribute("data-key");
          if (key && nodeMap.has(key)) {
            selectedContextMenuNode = nodeMap.get(key);
            showContextMenu(e.clientX, e.clientY);
          }
        });
      }
    });
    container.querySelectorAll(".p-sortable-column").forEach((th) => {
      th.addEventListener("click", () => {
        const field = th.getAttribute("data-col-field");
        if (field) handleSort(field);
      });
    });
    container.querySelector(".p-treetable-first-btn")?.addEventListener("click", () => {
      currentPage = 0;
      render();
    });
    container.querySelector(".p-treetable-prev-btn")?.addEventListener("click", () => {
      if (currentPage > 0) {
        currentPage--;
        render();
      }
    });
    container.querySelector(".p-treetable-next-btn")?.addEventListener("click", () => {
      currentPage++;
      render();
    });
    container.querySelector(".p-treetable-last-btn")?.addEventListener("click", () => {
      currentPage = 999999;
      render();
    });
    container.querySelectorAll(".p-treetable-page-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const page = parseInt(btn.getAttribute("data-page") || "0", 10);
        currentPage = page;
        render();
      });
    });
    container.querySelector(".p-treetable-rpp-select")?.addEventListener("change", (e) => {
      rowsPerPage = parseInt(e.target.value, 10);
      currentPage = 0;
      render();
    });
    const searchInput = container.querySelector(".p-treetable-global-search");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        globalFilter = e.target.value;
        render();
        const reFocus = container.querySelector(".p-treetable-global-search");
        if (reFocus) {
          reFocus.focus();
          reFocus.setSelectionRange(globalFilter.length, globalFilter.length);
        }
      });
    }
    container.querySelector(".p-treetable-column-toggle-btn")?.addEventListener("click", (e) => {
      e.stopPropagation();
      showPopover = !showPopover;
      render();
    });
    container.querySelectorAll(".p-treetable-col-cb").forEach((cb) => {
      cb.addEventListener("change", (e) => {
        const field = cb.getAttribute("data-field");
        if (field) {
          if (cb.checked) {
            if (!visibleFields.includes(field)) visibleFields.push(field);
          } else {
            visibleFields = visibleFields.filter((f) => f !== field);
          }
          render();
        }
      });
    });
    container.querySelector(".p-treetable-reset-cols-btn")?.addEventListener("click", () => {
      visibleFields = columns.map((c) => c.field);
      render();
    });
    container.querySelector(".p-treetable-empty-add-btn")?.addEventListener("click", () => {
      rawNodes.push({
        key: String(rawNodes.length),
        data: { name: `New Folder ${rawNodes.length + 1}`, size: "0kb", type: "Folder" },
        children: []
      });
      buildMaps(rawNodes);
      render();
    });
    container.querySelector(".p-treetable-footer-reload-btn")?.addEventListener("click", () => {
      notifyToast("info", "TreeTable Reloaded", "Refreshed node hierarchy");
    });
  }
  function showContextMenu(x, y) {
    document.querySelectorAll(".p-treetable-contextmenu").forEach((el) => el.remove());
    const menu = document.createElement("div");
    menu.className = "p-treetable-contextmenu";
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
    menu.querySelector('[data-action="view"]')?.addEventListener("click", () => {
      if (selectedContextMenuNode) {
        notifyToast("info", "Node Selected", selectedContextMenuNode.data.name);
      }
      menu.remove();
    });
    menu.querySelector('[data-action="delete"]')?.addEventListener("click", () => {
      if (selectedContextMenuNode) {
        notifyToast("error", "Node Deleted", selectedContextMenuNode.data.name);
      }
      menu.remove();
    });
    const closeMenu = (e) => {
      if (!menu.contains(e.target)) {
        menu.remove();
        document.removeEventListener("click", closeMenu);
      }
    };
    setTimeout(() => document.addEventListener("click", closeMenu), 50);
  }
  render();
}
export {
  TreeTableIsland as default
};
//# sourceMappingURL=treetable-5DGKZUBY.js.map
