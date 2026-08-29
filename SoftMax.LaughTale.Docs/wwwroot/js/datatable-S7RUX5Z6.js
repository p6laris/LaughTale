import {
  LucideIcons
} from "./chunk-XHF3KYSF.js";
import {
  injectIslandStyle
} from "./chunk-3TFPN5JM.js";

// ../SoftMax.LaughTale.Client/src/components/datatable.ts
var DATATABLE_CSS = `
.p-datatable {
    position: relative;
    border-radius: var(--p-border-radius-lg, 10px);
    background: var(--p-surface-0, #ffffff);
    color: var(--p-surface-800, #1e293b);
    font-family: var(--p-font-family, inherit);
    border: 1px solid var(--p-surface-200, #e2e8f0);
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
    background: var(--p-surface-50, #f8fafc);
    color: var(--p-surface-700, #334155);
    font-weight: 700;
    font-size: 0.8125rem;
    letter-spacing: 0.01em;
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
    transition: color 0.15s ease, transform 0.15s ease;
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
    padding: 0.4rem 0.75rem;
    background: var(--p-surface-50, #f8fafc);
    border-bottom: 1px solid var(--p-surface-200, #e2e8f0);
}
.p-datatable-filter-input {
    width: 100%;
    padding: 0.4rem 0.65rem;
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
    padding: 0.875rem 1rem;
    border-bottom: 1px solid var(--p-surface-200, #e2e8f0);
    color: var(--p-surface-700, #334155);
    vertical-align: middle;
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
    width: 1.75rem;
    height: 1.75rem;
    border-radius: 9999px;
    color: var(--p-surface-500, #64748b);
    transition: background-color 0.15s ease, color 0.15s ease, transform 0.15s ease;
}
.p-row-toggler:hover {
    background: var(--p-surface-200, #e2e8f0);
    color: var(--p-surface-900, #0f172a);
}

/* Custom Checkbox & Radio */
.p-checkbox-box, .p-radio-box {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 1.25rem;
    height: 1.25rem;
    border-radius: var(--p-border-radius-xs, 5px);
    border: 2px solid var(--p-surface-300, #cbd5e1);
    background: var(--p-surface-0, #ffffff);
    cursor: pointer;
    transition: all 0.15s ease;
    user-select: none;
}
.p-radio-box {
    border-radius: 9999px;
}
.p-checkbox-box.p-checked, .p-radio-box.p-checked {
    background: var(--p-primary-500, #10b981);
    border-color: var(--p-primary-500, #10b981);
    color: #ffffff;
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
.p-tag-success { background: #dcfce7; color: #15803d; }
.p-tag-warn { background: #fef3c7; color: #b45309; }
.p-tag-danger { background: #fee2e2; color: #b91c1c; }
.p-tag-info { background: #e0f2fe; color: #0369a1; }
.p-tag-secondary { background: var(--p-surface-100, #f1f5f9); color: var(--p-surface-700, #334155); }

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
    background: var(--p-surface-100, #f1f5f9);
    border: 1px solid var(--p-surface-200, #e2e8f0);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--p-primary-600, #059669);
    flex-shrink: 0;
}
.p-product-info {
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
}
.p-product-name {
    font-weight: 600;
    color: var(--p-surface-900, #0f172a);
}
.p-product-code {
    font-size: 0.75rem;
    color: var(--p-surface-400, #94a3b8);
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
    background: var(--p-primary-100, #d1fae5);
    color: var(--p-primary-700, #047857);
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
    outline: 1px dashed var(--p-primary-400, #34d399);
    background: rgba(16, 185, 129, 0.04);
}
.p-cell-editor-input {
    width: 100%;
    padding: 0.35rem 0.5rem;
    font-size: inherit;
    border: 1px solid var(--p-primary-500, #10b981);
    border-radius: var(--p-border-radius-xs, 4px);
    background: var(--p-surface-0, #ffffff);
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

.p-datatable-selection-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.625rem 1.25rem;
    background: var(--p-surface-50, #f8fafc);
    border-bottom: 1px solid var(--p-surface-200, #e2e8f0);
    font-size: 0.8125rem;
    font-weight: 500;
}

.p-size-switcher {
    display: inline-flex;
    border-radius: 6px;
    border: 1px solid var(--p-surface-300, #cbd5e1);
    overflow: hidden;
    background: var(--p-surface-0, #ffffff);
}
.p-size-btn {
    padding: 0.35rem 0.75rem;
    font-size: 0.75rem;
    font-weight: 600;
    border: none;
    background: transparent;
    cursor: pointer;
    color: var(--p-surface-600, #475569);
    transition: all 0.15s ease;
}
.p-size-btn:hover {
    background: var(--p-surface-100, #f1f5f9);
    color: var(--p-surface-900, #0f172a);
}
.p-size-btn.p-active {
    background: var(--p-primary-500, #10b981);
    color: #ffffff;
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
    background: linear-gradient(90deg, var(--p-surface-200, #e2e8f0) 25%, var(--p-surface-100, #f1f5f9) 50%, var(--p-surface-200, #e2e8f0) 75%);
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
.dark .p-datatable-selection-bar,
[data-theme="dark"] .p-datatable-header-toolbar,
[data-theme="dark"] .p-datatable-paginator,
[data-theme="dark"] .p-datatable-selection-bar {
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
    background: rgba(15, 23, 42, 0.8) !important;
}
.dark .p-tag-secondary, [data-theme="dark"] .p-tag-secondary {
    background: var(--p-surface-800, #1e293b);
    color: var(--p-surface-200, #e2e8f0);
}
.dark .p-product-avatar, [data-theme="dark"] .p-product-avatar {
    background: var(--p-surface-800, #1e293b);
    border-color: var(--p-surface-700, #334155);
}
`;
function DataTableIsland(container, props) {
  injectIslandStyle("datatable", DATATABLE_CSS);
  const rawData = [...props.value || props.data || []];
  const columns = props.columns || [];
  let currentSize = props.size || "normal";
  const showGridlines = !!props.showGridlines;
  const stripedRows = !!props.stripedRows;
  const selectionMode = props.selectionMode;
  const metaKeySelection = props.metaKeySelection !== false;
  const dataKey = props.dataKey || "id";
  const paginator = !!props.paginator;
  let rowsPerPage = props.rows || 10;
  let currentPage = Math.floor((props.first || 0) / rowsPerPage) + 1;
  const rowsPerPageOptions = props.rowsPerPageOptions || [5, 10, 20, 50];
  const sortMode = props.sortMode || "single";
  const removableSort = !!props.removableSort;
  const filterDisplay = props.filterDisplay || "none";
  const scrollable = !!props.scrollable;
  const scrollHeight = props.scrollHeight;
  const editMode = props.editMode;
  let loading = !!props.loading;
  const loadingMode = props.loadingMode || "overlay";
  const exportFilename = props.exportFilename || "datatable_export";
  const emptyMessage = props.emptyMessage || "No records found.";
  const showInteractiveSize = !!props.interactiveSize;
  let globalFilter = "";
  const columnFilters = {};
  let sortMeta = [];
  if (props.sortField) {
    sortMeta.push({ field: props.sortField, order: props.sortOrder ?? 1 });
  }
  const selectedKeys = /* @__PURE__ */ new Set();
  const expandedKeys = /* @__PURE__ */ new Set();
  let editingCell = null;
  function resolveField(obj, field) {
    if (!obj || !field) return "";
    if (field.includes(".")) {
      return field.split(".").reduce((acc, part) => acc?.[part], obj);
    }
    return obj[field];
  }
  function renderCellContent(row, col, rawVal) {
    const fieldName = (col.field || "").toLowerCase();
    const headerName = (col.header || "").toLowerCase();
    if (fieldName.includes("status") || headerName.includes("status")) {
      const strVal = String(rawVal || "").toUpperCase();
      if (strVal === "INSTOCK" || strVal === "QUALIFIED") {
        return `<span class="p-tag p-tag-success">${strVal === "INSTOCK" ? "In Stock" : "Qualified"}</span>`;
      }
      if (strVal === "LOWSTOCK" || strVal === "NEGOTIATION") {
        return `<span class="p-tag p-tag-warn">${strVal === "LOWSTOCK" ? "Low Stock" : "Negotiation"}</span>`;
      }
      if (strVal === "OUTOFSTOCK" || strVal === "UNQUALIFIED") {
        return `<span class="p-tag p-tag-danger">${strVal === "OUTOFSTOCK" ? "Out of Stock" : "Unqualified"}</span>`;
      }
      if (strVal === "NEW" || strVal === "PROPOSAL") {
        return `<span class="p-tag p-tag-info">${strVal}</span>`;
      }
      return `<span class="p-tag p-tag-secondary">${rawVal ?? ""}</span>`;
    }
    if (fieldName === "category") {
      return `<span class="p-tag p-tag-secondary">${rawVal ?? ""}</span>`;
    }
    if ((fieldName === "name" || headerName === "product") && row.code) {
      return `
                <div class="p-product-cell">
                    <div class="p-product-avatar">${LucideIcons.package}</div>
                    <div class="p-product-info">
                        <span class="p-product-name">${row.name ?? ""}</span>
                        <span class="p-product-code">${row.code ?? ""}</span>
                    </div>
                </div>
            `;
    }
    if (fieldName === "country") {
      return `
                <div class="p-country-cell">
                    <span style="font-size: 1rem; line-height: 1;">\u{1F310}</span>
                    <span>${rawVal ?? ""}</span>
                </div>
            `;
    }
    if (fieldName.includes("rep") || headerName.includes("representative")) {
      const initials = String(rawVal || "U").split(" ").map((n) => n[0]).join("").substring(0, 2);
      return `
                <div class="p-rep-cell">
                    <div class="p-rep-avatar">${initials}</div>
                    <span>${rawVal ?? ""}</span>
                </div>
            `;
    }
    if (typeof rawVal === "number" && (fieldName.includes("price") || fieldName.includes("balance"))) {
      return `<span style="font-weight: 700; color: var(--p-surface-900);">$${rawVal.toLocaleString()}</span>`;
    }
    if (fieldName === "verified") {
      return rawVal ? `<span class="p-tag p-tag-success">Verified</span>` : `<span class="p-tag p-tag-secondary">\u2014</span>`;
    }
    return rawVal != null ? String(rawVal) : "";
  }
  function exportCSV() {
    if (rawData.length === 0) return;
    const exportCols = columns.filter((c) => c.field && !c.selectionMode && !c.expander);
    const headers = exportCols.map((c) => `"${(c.header || c.field).replace(/"/g, '""')}"`).join(",");
    const rows = rawData.map((row) => {
      return exportCols.map((c) => {
        const val = resolveField(row, c.field);
        const str = val == null ? "" : String(val);
        return `"${str.replace(/"/g, '""')}"`;
      }).join(",");
    });
    const csvContent = [headers, ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${exportFilename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
  container.exportCSV = exportCSV;
  function render() {
    let filtered = rawData.filter((row) => {
      if (globalFilter.trim()) {
        const query = globalFilter.toLowerCase();
        const fieldsToCheck = props.globalFilterFields && props.globalFilterFields.length > 0 ? props.globalFilterFields : columns.map((c) => c.field).filter(Boolean);
        const matchesGlobal = fieldsToCheck.some((f) => {
          const val = resolveField(row, f);
          return val != null && String(val).toLowerCase().includes(query);
        });
        if (!matchesGlobal) return false;
      }
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
    if (sortMeta.length > 0) {
      filtered.sort((a, b) => {
        for (const meta of sortMeta) {
          const valA = resolveField(a, meta.field);
          const valB = resolveField(b, meta.field);
          if (valA === valB) continue;
          if (valA == null) return 1;
          if (valB == null) return -1;
          const res = typeof valA === "number" && typeof valB === "number" ? valA - valB : String(valA).localeCompare(String(valB), void 0, { numeric: true });
          if (res !== 0) return res * meta.order;
        }
        return 0;
      });
    }
    const totalRecords = filtered.length;
    const totalPages = Math.ceil(totalRecords / rowsPerPage) || 1;
    if (currentPage > totalPages) currentPage = totalPages;
    if (currentPage < 1) currentPage = 1;
    const firstIdx = (currentPage - 1) * rowsPerPage;
    const displayRows = paginator ? filtered.slice(firstIdx, firstIdx + rowsPerPage) : filtered;
    const rootClasses = ["p-datatable", "p-component"];
    if (currentSize === "small") rootClasses.push("p-datatable-sm");
    if (currentSize === "large") rootClasses.push("p-datatable-lg");
    if (showGridlines) rootClasses.push("p-datatable-gridlines");
    if (stripedRows) rootClasses.push("p-datatable-striped");
    if (scrollable) rootClasses.push("p-datatable-scrollable");
    const allPageSelected = displayRows.length > 0 && displayRows.every((r) => selectedKeys.has(r[dataKey]));
    const headerCells = columns.map((col) => {
      const isSortable = !!col.sortable;
      const sortItem = sortMeta.find((m) => m.field === col.field);
      const isSorted = !!sortItem;
      const sortOrder = sortItem?.order || 0;
      const sortBadge = sortMode === "multiple" && sortMeta.length > 1 && isSorted ? `<span class="p-datatable-sort-badge">${sortMeta.indexOf(sortItem) + 1}</span>` : "";
      let sortIconSvg = "";
      if (isSortable) {
        if (sortOrder === 1) sortIconSvg = LucideIcons.arrowUp;
        else if (sortOrder === -1) sortIconSvg = LucideIcons.arrowDown;
        else sortIconSvg = LucideIcons.arrowUpDown;
      }
      let frozenClass = "";
      if (col.frozen) {
        frozenClass = col.alignFrozen === "right" ? "p-frozen-column-right" : "p-frozen-column-left";
      }
      const styleAttr = [
        col.width ? `width: ${col.width};` : "",
        col.minWidth ? `min-width: ${col.minWidth};` : "",
        col.align ? `text-align: ${col.align};` : ""
      ].filter(Boolean).join(" ");
      if (col.selectionMode === "multiple") {
        return `
                    <th class="${frozenClass}" style="width: 3.5rem; text-align: center;">
                        <div class="p-checkbox-box p-select-all ${allPageSelected ? "p-checked" : ""}" role="checkbox" aria-checked="${allPageSelected}">
                            ${allPageSelected ? LucideIcons.check : ""}
                        </div>
                    </th>
                `;
      }
      if (col.selectionMode === "single") {
        return `<th class="${frozenClass}" style="width: 3.5rem; text-align: center;"></th>`;
      }
      if (col.expander) {
        return `<th class="${frozenClass}" style="width: 3.5rem; text-align: center;"></th>`;
      }
      return `
                <th class="${isSortable ? "p-sortable-column" : ""} ${isSorted ? "p-sorted" : ""} ${frozenClass} ${col.headerClass || ""}" 
                    data-field="${col.field || ""}" 
                    style="${styleAttr}">
                    <div class="p-datatable-header-content" style="justify-content: ${col.align === "right" ? "flex-end" : col.align === "center" ? "center" : "flex-start"};">
                        <span>${col.header || ""}</span>
                        ${isSortable ? `<span class="p-datatable-sort-icon">${sortIconSvg}</span>${sortBadge}` : ""}
                    </div>
                </th>
            `;
    }).join("");
    let filterRowHtml = "";
    if (filterDisplay === "row") {
      const filterCells = columns.map((col) => {
        let frozenClass = col.frozen ? col.alignFrozen === "right" ? "p-frozen-column-right" : "p-frozen-column-left" : "";
        if (!col.field || col.selectionMode || col.expander || col.filterable === false) {
          return `<th class="${frozenClass}"></th>`;
        }
        const curVal = columnFilters[col.field] || "";
        return `
                    <th class="${frozenClass}">
                        <input type="text" 
                               class="p-datatable-filter-input" 
                               data-filter-field="${col.field}" 
                               placeholder="${col.filterPlaceholder || "Filter..."}" 
                               value="${curVal}" />
                    </th>
                `;
      }).join("");
      filterRowHtml = `<tr class="p-datatable-filter-row">${filterCells}</tr>`;
    }
    let bodyRowsHtml = "";
    if (loading && loadingMode === "skeleton") {
      bodyRowsHtml = Array.from({ length: rowsPerPage }).map(() => `
                <tr>
                    ${columns.map((col) => `
                        <td style="${col.width ? `width: ${col.width};` : ""}">
                            <div class="p-datatable-skeleton-cell"></div>
                        </td>
                    `).join("")}
                </tr>
            `).join("");
    } else if (displayRows.length === 0) {
      bodyRowsHtml = `
                <tr>
                    <td colspan="${columns.length}" style="text-align: center; padding: 3rem 1rem; color: var(--p-surface-400);">
                        <div style="display: flex; flex-direction: column; align-items: center; gap: 0.75rem;">
                            <span style="font-size: 1.75rem; color: var(--p-surface-400);">${LucideIcons.inbox}</span>
                            <span style="font-weight: 600; font-size: 0.9375rem; color: var(--p-surface-700);">${emptyMessage}</span>
                        </div>
                    </td>
                </tr>
            `;
    } else {
      bodyRowsHtml = displayRows.map((row) => {
        const rowKey = row[dataKey];
        const isSelected = selectedKeys.has(rowKey);
        const isExpanded = expandedKeys.has(rowKey);
        const cellTds = columns.map((col) => {
          let frozenClass = col.frozen ? col.alignFrozen === "right" ? "p-frozen-column-right" : "p-frozen-column-left" : "";
          const styleAttr = [
            col.width ? `width: ${col.width};` : "",
            col.minWidth ? `min-width: ${col.minWidth};` : "",
            col.align ? `text-align: ${col.align};` : ""
          ].filter(Boolean).join(" ");
          if (col.selectionMode === "multiple") {
            return `
                            <td class="${frozenClass}" style="width: 3.5rem; text-align: center;">
                                <div class="p-checkbox-box p-row-checkbox ${isSelected ? "p-checked" : ""}" data-row-key="${rowKey}">
                                    ${isSelected ? LucideIcons.check : ""}
                                </div>
                            </td>
                        `;
          }
          if (col.selectionMode === "single") {
            return `
                            <td class="${frozenClass}" style="width: 3.5rem; text-align: center;">
                                <div class="p-radio-box p-row-radio ${isSelected ? "p-checked" : ""}" data-row-key="${rowKey}">
                                    ${isSelected ? '<span style="width: 6px; height: 6px; border-radius: 9999px; background: white;"></span>' : ""}
                                </div>
                            </td>
                        `;
          }
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
          const isEditing = editMode === "cell" && editingCell?.rowKey === rowKey && editingCell?.field === col.field;
          if (isEditing) {
            return `
                            <td class="${frozenClass} ${col.bodyClass || ""}" style="${styleAttr}">
                                <input type="text" 
                                       class="p-cell-editor-input" 
                                       data-row-key="${rowKey}" 
                                       data-field="${col.field}" 
                                       value="${rawVal ?? ""}" 
                                       autofocus />
                            </td>
                        `;
          }
          const formattedContent = renderCellContent(row, col, rawVal);
          const editableClass = editMode === "cell" && col.field ? "p-editable-cell" : "";
          return `
                        <td class="${frozenClass} ${editableClass} ${col.bodyClass || ""}" 
                            data-row-key="${rowKey}" 
                            data-field="${col.field || ""}" 
                            style="${styleAttr}">
                            ${formattedContent}
                        </td>
                    `;
        }).join("");
        const rowHtml = `
                    <tr class="${isSelected ? "p-highlight" : ""}" data-row-key="${rowKey}">
                        ${cellTds}
                    </tr>
                `;
        let expansionHtml = "";
        if (isExpanded) {
          expansionHtml = `
                        <tr class="p-row-expansion">
                            <td colspan="${columns.length}" style="padding: 1.25rem;">
                                <div style="display: flex; gap: 1.25rem; align-items: center; background: var(--p-surface-0); padding: 1rem; border-radius: 8px; border: 1px solid var(--p-surface-200);">
                                    <div style="width: 56px; height: 56px; border-radius: 8px; background: var(--p-primary-50, #ecfdf5); border: 1px solid var(--p-primary-200, #a7f3d0); display: flex; align-items: center; justify-content: center; color: var(--p-primary-600); font-size: 1.5rem; flex-shrink: 0;">
                                        ${LucideIcons.package}
                                    </div>
                                    <div style="display: flex; flex-direction: column; gap: 0.35rem; flex: 1;">
                                        <div style="display: flex; align-items: center; justify-content: space-between;">
                                            <span style="font-weight: 700; color: var(--p-surface-900); font-size: 1rem;">
                                                ${row.name || row.title || `Record #${rowKey}`}
                                            </span>
                                            <span class="p-tag p-tag-success">${row.inventoryStatus || "Active"}</span>
                                        </div>
                                        <div style="font-size: 0.8125rem; color: var(--p-surface-500); display: flex; gap: 1.5rem;">
                                            <span>SKU: <strong>${row.code || "N/A"}</strong></span>
                                            <span>Category: <strong>${row.category || "General"}</strong></span>
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
      }).join("");
    }
    let selectionBarHtml = "";
    if (selectedKeys.size > 0) {
      const selectedRows = rawData.filter((r) => selectedKeys.has(r[dataKey]));
      const totalVal = selectedRows.reduce((sum, r) => sum + (Number(r.price) || Number(r.balance) || 0), 0);
      selectionBarHtml = `
                <div class="p-datatable-selection-bar">
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <span class="p-tag p-tag-info" style="font-weight: 700;">Selected: ${selectedKeys.size}</span>
                        ${totalVal > 0 ? `<span>Total: <strong>$${totalVal.toLocaleString()}</strong></span>` : ""}
                    </div>
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <button type="button" class="p-datatable-clear-selection" style="padding: 0.3rem 0.6rem; font-size: 0.75rem; border-radius: 4px; border: 1px solid var(--p-surface-300); background: transparent; cursor: pointer; color: var(--p-surface-600);">
                            Clear Selection
                        </button>
                    </div>
                </div>
            `;
    }
    let paginatorHtml = "";
    if (paginator) {
      const startRecord = totalRecords > 0 ? firstIdx + 1 : 0;
      const endRecord = Math.min(firstIdx + rowsPerPage, totalRecords);
      const reportStr = (props.currentPageReportTemplate || "Showing {first} to {last} of {totalRecords} entries").replace("{first}", String(startRecord)).replace("{last}", String(endRecord)).replace("{totalRecords}", String(totalRecords));
      const pageButtons = [];
      let startPage = Math.max(1, currentPage - 2);
      let endPage = Math.min(totalPages, startPage + 4);
      if (endPage - startPage < 4) startPage = Math.max(1, endPage - 4);
      for (let p = startPage; p <= endPage; p++) {
        pageButtons.push(`
                    <button type="button" class="p-paginator-page ${p === currentPage ? "p-paginator-page-active" : ""}" data-page="${p}">
                        ${p}
                    </button>
                `);
      }
      paginatorHtml = `
                <div class="p-datatable-paginator">
                    <span>${reportStr}</span>
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <button type="button" class="p-paginator-nav p-first" data-page="1" ${currentPage === 1 ? "disabled" : ""} aria-label="First Page">\xAB</button>
                        <button type="button" class="p-paginator-nav p-prev" data-page="${currentPage - 1}" ${currentPage === 1 ? "disabled" : ""} aria-label="Previous Page">\u2039</button>
                        <div class="p-paginator-pages">${pageButtons.join("")}</div>
                        <button type="button" class="p-paginator-nav p-next" data-page="${currentPage + 1}" ${currentPage === totalPages ? "disabled" : ""} aria-label="Next Page">\u203A</button>
                        <button type="button" class="p-paginator-nav p-last" data-page="${totalPages}" ${currentPage === totalPages ? "disabled" : ""} aria-label="Last Page">\xBB</button>
                    </div>
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <span>Rows per page:</span>
                        <select class="p-datatable-rows-select" style="padding: 0.25rem 0.5rem; border-radius: 4px; border: 1px solid var(--p-surface-300); background: var(--p-surface-0); color: inherit; font-size: 0.8125rem;">
                            ${rowsPerPageOptions.map((opt) => `<option value="${opt}" ${opt === rowsPerPage ? "selected" : ""}>${opt}</option>`).join("")}
                        </select>
                    </div>
                </div>
            `;
    }
    let toolbarHtml = "";
    const showSearch = Array.isArray(props.globalFilterFields) && props.globalFilterFields.length > 0;
    const showExport = !!props.exportFilename && props.exportFilename.trim() !== "" || !!props.showExport;
    const showRefresh = !!props.showRefresh;
    const hasToolbar = !!props.title || showSearch || showExport || showInteractiveSize || showRefresh;
    if (hasToolbar) {
      toolbarHtml = `
                <div class="p-datatable-header-toolbar">
                    <div class="p-datatable-title">${props.title || ""}</div>
                    <div style="display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap;">
                        ${showInteractiveSize ? `
                            <div class="p-size-switcher">
                                <button type="button" class="p-size-btn ${currentSize === "small" ? "p-active" : ""}" data-size="small">Small</button>
                                <button type="button" class="p-size-btn ${currentSize === "normal" ? "p-active" : ""}" data-size="normal">Normal</button>
                                <button type="button" class="p-size-btn ${currentSize === "large" ? "p-active" : ""}" data-size="large">Large</button>
                            </div>
                        ` : ""}

                        ${showSearch ? `
                            <div style="position: relative; display: flex; align-items: center;">
                                <input type="text" class="p-datatable-global-filter p-datatable-filter-input" placeholder="Search keyword..." value="${globalFilter}" style="width: 180px;" />
                            </div>
                        ` : ""}

                        ${showRefresh ? `
                            <button type="button" class="p-datatable-refresh-btn" style="display: inline-flex; align-items: center; gap: 0.35rem; padding: 0.4rem 0.75rem; border-radius: 6px; border: 1px solid var(--p-surface-300); background: var(--p-surface-0); color: inherit; font-size: 0.8125rem; font-weight: 600; cursor: pointer;">
                                <span>${LucideIcons.refreshCw}</span>
                                <span>Refresh</span>
                            </button>
                        ` : ""}

                        ${showExport ? `
                            <button type="button" class="p-datatable-export-btn" style="display: inline-flex; align-items: center; gap: 0.35rem; padding: 0.4rem 0.75rem; border-radius: 6px; border: 1px solid var(--p-surface-300); background: var(--p-surface-0); color: inherit; font-size: 0.8125rem; font-weight: 600; cursor: pointer;">
                                <span>${LucideIcons.fileSpreadsheet}</span>
                                <span>Export CSV</span>
                            </button>
                        ` : ""}
                    </div>
                </div>
            `;
    }
    let loadingOverlayHtml = "";
    if (loading && loadingMode === "overlay") {
      loadingOverlayHtml = `
                <div class="p-datatable-loading-overlay">
                    <div style="width: 2.25rem; height: 2.25rem; border: 3px solid var(--p-primary-500); border-top-color: transparent; border-radius: 9999px; animation: p-spin 0.8s linear infinite;"></div>
                    <span style="font-size: 0.875rem; font-weight: 600; color: var(--p-surface-700);">Loading records...</span>
                </div>
            `;
    }
    const scrollWrapperStyle = scrollHeight ? `max-height: ${scrollHeight}; overflow-y: auto;` : "";
    container.innerHTML = `
            <div class="${rootClasses.join(" ")}">
                ${loadingOverlayHtml}
                ${toolbarHtml}
                ${selectionBarHtml}
                <div class="p-datatable-scrollable-wrapper" style="${scrollWrapperStyle}">
                    <table class="p-datatable-table" style="${props.tableStyle || ""}">
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
    const rootEl = container.firstElementChild;
    if (!rootEl) return;
    rootEl.querySelectorAll(".p-sortable-column").forEach((th) => {
      th.addEventListener("click", () => {
        const field = th.getAttribute("data-field");
        if (!field) return;
        const existing = sortMeta.find((m) => m.field === field);
        let nextOrder = 1;
        if (existing) {
          if (existing.order === 1) nextOrder = -1;
          else if (existing.order === -1) nextOrder = removableSort ? 0 : 1;
        }
        if (sortMode === "multiple") {
          if (nextOrder === 0) {
            sortMeta = sortMeta.filter((m) => m.field !== field);
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
        container.dispatchEvent(new CustomEvent("datatable:sort", {
          bubbles: true,
          detail: { sortMeta }
        }));
        render();
      });
    });
    const globalInput = rootEl.querySelector(".p-datatable-global-filter");
    if (globalInput) {
      globalInput.addEventListener("input", (e) => {
        const target = e.target;
        globalFilter = target.value;
        const pos = target.selectionStart;
        currentPage = 1;
        render();
        const reacquired = container.querySelector(".p-datatable-global-filter");
        if (reacquired) {
          reacquired.focus();
          if (pos != null) reacquired.setSelectionRange(pos, pos);
        }
      });
    }
    rootEl.querySelectorAll(".p-datatable-filter-input[data-filter-field]").forEach((input) => {
      input.addEventListener("input", (e) => {
        const target = e.target;
        const field = input.getAttribute("data-filter-field");
        columnFilters[field] = target.value;
        const pos = target.selectionStart;
        currentPage = 1;
        render();
        const reacquired = container.querySelector(`.p-datatable-filter-input[data-filter-field="${field}"]`);
        if (reacquired) {
          reacquired.focus();
          if (pos != null) reacquired.setSelectionRange(pos, pos);
        }
      });
    });
    const exportBtn = rootEl.querySelector(".p-datatable-export-btn");
    if (exportBtn) {
      exportBtn.addEventListener("click", () => exportCSV());
    }
    const refreshBtn = rootEl.querySelector(".p-datatable-refresh-btn");
    if (refreshBtn) {
      refreshBtn.addEventListener("click", () => {
        loading = true;
        render();
        setTimeout(() => {
          loading = false;
          render();
        }, 1e3);
      });
    }
    rootEl.querySelectorAll(".p-size-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const s = btn.getAttribute("data-size");
        if (s) {
          currentSize = s;
          render();
        }
      });
    });
    const selectAllBox = rootEl.querySelector(".p-select-all");
    if (selectAllBox) {
      selectAllBox.addEventListener("click", () => {
        const allSelected = selectAllBox.classList.contains("p-checked");
        const displayRows = rawData;
        if (allSelected) {
          displayRows.forEach((r) => selectedKeys.delete(r[dataKey]));
        } else {
          displayRows.forEach((r) => selectedKeys.add(r[dataKey]));
        }
        dispatchSelectionEvent();
        render();
      });
    }
    const clearSelBtn = rootEl.querySelector(".p-datatable-clear-selection");
    if (clearSelBtn) {
      clearSelBtn.addEventListener("click", () => {
        selectedKeys.clear();
        dispatchSelectionEvent();
        render();
      });
    }
    rootEl.querySelectorAll(".p-row-checkbox").forEach((box) => {
      box.addEventListener("click", (e) => {
        e.stopPropagation();
        const key = box.getAttribute("data-row-key");
        if (!key) return;
        const matchedRow = rawData.find((r) => String(r[dataKey]) === String(key));
        const realKey = matchedRow ? matchedRow[dataKey] : key;
        if (selectedKeys.has(realKey)) selectedKeys.delete(realKey);
        else selectedKeys.add(realKey);
        dispatchSelectionEvent();
        render();
      });
    });
    rootEl.querySelectorAll(".p-row-radio").forEach((radio) => {
      radio.addEventListener("click", (e) => {
        e.stopPropagation();
        const key = radio.getAttribute("data-row-key");
        if (!key) return;
        const matchedRow = rawData.find((r) => String(r[dataKey]) === String(key));
        const realKey = matchedRow ? matchedRow[dataKey] : key;
        selectedKeys.clear();
        selectedKeys.add(realKey);
        dispatchSelectionEvent();
        render();
      });
    });
    if (selectionMode === "single" || selectionMode === "multiple") {
      rootEl.querySelectorAll(".p-datatable-tbody > tr[data-row-key]").forEach((tr) => {
        tr.addEventListener("click", (e) => {
          const key = tr.getAttribute("data-row-key");
          if (!key) return;
          const matchedRow = rawData.find((r) => String(r[dataKey]) === String(key));
          const realKey = matchedRow ? matchedRow[dataKey] : key;
          if (selectionMode === "single") {
            if (selectedKeys.has(realKey)) selectedKeys.delete(realKey);
            else {
              selectedKeys.clear();
              selectedKeys.add(realKey);
            }
          } else if (selectionMode === "multiple") {
            const mouseEvent = e;
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
    rootEl.querySelectorAll(".p-row-toggler").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const key = btn.getAttribute("data-row-key");
        if (!key) return;
        const matchedRow = rawData.find((r) => String(r[dataKey]) === String(key));
        const realKey = matchedRow ? matchedRow[dataKey] : key;
        if (expandedKeys.has(realKey)) expandedKeys.delete(realKey);
        else expandedKeys.add(realKey);
        render();
      });
    });
    if (editMode === "cell") {
      rootEl.querySelectorAll(".p-editable-cell").forEach((td) => {
        td.addEventListener("click", (e) => {
          e.stopPropagation();
          const rowKey = td.getAttribute("data-row-key");
          const field = td.getAttribute("data-field");
          if (!rowKey || !field) return;
          const matchedRow = rawData.find((r) => String(r[dataKey]) === String(rowKey));
          const realKey = matchedRow ? matchedRow[dataKey] : rowKey;
          editingCell = { rowKey: realKey, field };
          render();
        });
      });
      const cellInput = rootEl.querySelector(".p-cell-editor-input");
      if (cellInput) {
        cellInput.focus();
        const saveCell = () => {
          if (!editingCell) return;
          const rowKey = editingCell.rowKey;
          const field = editingCell.field;
          const newVal = cellInput.value;
          const matchedRow = rawData.find((r) => String(r[dataKey]) === String(rowKey));
          if (matchedRow) {
            matchedRow[field] = newVal;
            container.dispatchEvent(new CustomEvent("datatable:cell-edit-complete", {
              bubbles: true,
              detail: { row: matchedRow, field, newValue: newVal }
            }));
          }
          editingCell = null;
          render();
        };
        cellInput.addEventListener("blur", saveCell);
        cellInput.addEventListener("keydown", (e) => {
          if (e.key === "Enter") {
            saveCell();
          } else if (e.key === "Escape") {
            editingCell = null;
            render();
          }
        });
      }
    }
    rootEl.querySelectorAll(".p-paginator-page, .p-paginator-nav").forEach((btn) => {
      btn.addEventListener("click", () => {
        const targetPage = Number(btn.getAttribute("data-page"));
        if (!isNaN(targetPage) && targetPage > 0) {
          currentPage = targetPage;
          render();
        }
      });
    });
    const rowsSelect = rootEl.querySelector(".p-datatable-rows-select");
    if (rowsSelect) {
      rowsSelect.addEventListener("change", () => {
        rowsPerPage = Number(rowsSelect.value);
        currentPage = 1;
        render();
      });
    }
  }
  function dispatchSelectionEvent() {
    const selectedRows = rawData.filter((r) => selectedKeys.has(r[dataKey]));
    container.dispatchEvent(new CustomEvent("datatable:selection-change", {
      bubbles: true,
      detail: { selectedKeys: Array.from(selectedKeys), selectedRows }
    }));
  }
  render();
}
export {
  DataTableIsland as default
};
//# sourceMappingURL=datatable-S7RUX5Z6.js.map
