import{e as se}from"./chunk-3YU53HBK.mjs";var Le=`
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
    background: var(--p-surface-0, #ffffff);
    color: var(--p-surface-700, #334155);
    padding: 0.75rem 1rem;
    border-bottom: 1px solid var(--p-surface-200, #e2e8f0);
    border-top: none;
    border-left: none;
    border-right: none;
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
    background: var(--p-surface-0, #ffffff);
}
.p-frozen-right {
    position: sticky;
    right: 0;
    z-index: 2;
    background: var(--p-surface-0, #ffffff);
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
    background: var(--p-surface-900, #0f172a) !important;
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
.dark .p-frozen-left,
.dark .p-frozen-right {
    background: var(--p-surface-900, #0f172a) !important;
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
`,n={chevronRight:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>',chevronDown:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>',chevronLeft:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>',firstPage:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m11 17-5-5 5-5"/><path d="m18 17-5-5 5-5"/><path d="M6 19V5"/></svg>',lastPage:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 17 5-5-5-5"/><path d="m13 17 5-5-5-5"/><path d="M18 19V5"/></svg>',sortAsc:'<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m18 15-6-6-6 6"/></svg>',sortDesc:'<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>',sortNone:'<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m7 15 5 5 5-5"/><path d="m7 9 5-5 5 5"/></svg>',folder:'<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/></svg>',file:'<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/></svg>',image:'<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>',video:'<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m22 8-6 4 6 4V8Z"/><rect width="14" height="12" x="2" y="6" rx="2" ry="2"/></svg>',check:'<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',minus:'<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="5" x2="19" y1="12" y2="12"/></svg>',search:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>',cog:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z"/><path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"/></svg>',spinner:'<svg class="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>',refresh:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 16h5v5"/></svg>',download:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>',pencil:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>',trash:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>',plus:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg>'};function Ee(c,a){se("treetable",Le);let T=JSON.parse(JSON.stringify(a.value||a.nodes||[])),I=a.columns?[...a.columns]:[{field:"name",header:"Name",expander:!0},{field:"size",header:"Size"},{field:"type",header:"Type"}],L=I.map(o=>o.field),b=a.size||"normal",de=!!a.showGridlines,v=a.selectionMode||null,G=a.metaKeySelection??!0,ce=!!a.scrollable,pe=a.scrollHeight||"auto",Q=!!a.paginator,E=a.rows||5,p=0,fe=a.rowsPerPageOptions||[5,10,25],ee=!!a.lazy,F=!!a.loading,te=!!a.skeleton,ue=!!a.columnToggle,W=!1,be=!!a.contextMenu,H=a.sortMode||"single",S=a.sortField||null,y=a.sortOrder??1,m=a.multiSortMeta?[...a.multiSortMeta]:[],re=!!a.removableSort,P="",ge={},z={...a.expandedKeys||{0:!0}},R=null,B={},x={},q=null;a.selectionKeys&&(v==="single"&&typeof a.selectionKeys=="string"?R=a.selectionKeys:v==="multiple"?B={...a.selectionKeys}:v==="checkbox"&&(x={...a.selectionKeys}));let w=new Map,ae=new Map;function j(o,t){if(!o||!t)return"";let e=o.data||o;if(e[t]!==void 0)return e[t];let r=t.charAt(0).toLowerCase()+t.slice(1);if(e[r]!==void 0)return e[r];let l=t.toLowerCase();for(let d of Object.keys(e))if(d.toLowerCase()===l)return e[d]}function V(o,t=null){o.forEach(e=>{let r=String(e.key||e.id||Math.random().toString());e.key=r,e.data=e.data||{name:e.label||e.name,size:"\u2014",type:"Folder"},w.set(r,e),t&&ae.set(r,t),e.children&&e.children.length&&V(e.children,e)})}V(T);function A(o,t,e){a.events&&window.AuraToast&&window.AuraToast.add({severity:o,summary:t,detail:e,life:3e3})}function he(o){switch(o){case"Folder":return"warn";case"Document":case"Resume":case"Application":case"PDF":return"info";case"Picture":case"Video":return"success";case"Text":case"Zip":case"Link":return"secondary";default:return"secondary"}}function me(o,t){switch(o){case"Folder":return n.folder;case"Picture":return n.image;case"Video":return n.video;default:return n.file}}function oe(o,t){let e=String(o.key);x[e]={checked:t,partialChecked:!1},o.children&&o.children.length&&o.children.forEach(r=>oe(r,t))}function ne(o){let t=ae.get(String(o.key));if(!t)return;let e=String(t.key),r=t.children||[],l=!0,d=!1,f=!1;r.forEach(K=>{let D=x[String(K.key)];D?.checked?d=!0:l=!1,D?.partialChecked&&(f=!0)}),l?x[e]={checked:!0,partialChecked:!1}:d||f?x[e]={checked:!1,partialChecked:!0}:delete x[e],ne(t)}function ve(o){let t=String(o.key);if(z[t])delete z[t],i();else{if(z[t]=!0,ee&&(!o.children||o.children.length===0)){o.loading=!0,i(),setTimeout(()=>{o.loading=!1,o.children=[{key:`${t}-0`,data:{name:`${o.data.name} - 0`,size:`${Math.floor(Math.random()*800)+50}kb`,type:"Document"}},{key:`${t}-1`,data:{name:`${o.data.name} - 1`,size:`${Math.floor(Math.random()*800)+50}kb`,type:"Text"}}],V(T),i()},500);return}i()}}function ye(o){if(H==="single")S===o?y===1?y=-1:y===-1&&re?(S=null,y=0):y=1:(S=o,y=1);else if(H==="multiple"){let t=m.findIndex(e=>e.field===o);t>=0?m[t].order===1?m[t].order=-1:re?m.splice(t,1):m[t].order=1:m.push({field:o,order:1})}i()}function ke(o,t){if(H==="single"&&S&&y!==0){let e=j(o,S)??"",r=j(t,S)??"";return(typeof e=="number"?e-r:String(e).localeCompare(String(r)))*y}else if(H==="multiple"&&m.length>0)for(let e of m){let r=j(o,e.field)??"",l=j(t,e.field)??"",d=typeof r=="number"?r-l:String(r).localeCompare(String(l));if(d!==0)return d*e.order}return 0}function _(o){let t=o.filter(e=>{if(P){let r=P.toLowerCase(),l=String(e.data?.name||"").toLowerCase().includes(r),d=String(e.data?.type||"").toLowerCase().includes(r),f=String(e.data?.size||"").toLowerCase().includes(r),K=e.children&&_(e.children).length>0;if(!l&&!d&&!f&&!K)return!1}for(let[r,l]of Object.entries(ge))if(l){let d=l.toLowerCase();if(!String(j(e,r)||"").toLowerCase().includes(d))return!1}return!0});return t=[...t].sort(ke),t.map(e=>({...e,children:e.children?_(e.children):[]}))}function le(o,t=0){let e=[];return o.forEach(r=>{e.push({node:r,level:t});let l=String(r.key);z[l]&&r.children&&r.children.length&&e.push(...le(r.children,t+1))}),e}function i(){let o=_(T),t=le(o),e=t.length,r=Math.ceil(e/E)||1;p>=r&&(p=Math.max(0,r-1));let l=Q?t.slice(p*E,(p+1)*E):t,d=I.filter(s=>L.includes(s.field)),f="";a.topControls==="size"?f=`
                <div class="p-treetable-top-controls">
                    <div class="p-selectbutton p-button-group" style="display: inline-flex; border: 1px solid var(--p-surface-300); border-radius: 6px; overflow: hidden;">
                        <button type="button" class="p-treetable-size-btn ${b==="small"?"p-highlight":""}" data-size="small" style="padding: 0.45rem 1rem; border: none; background: ${b==="small"?"var(--p-primary-500)":"var(--p-surface-0)"}; color: ${b==="small"?"#ffffff":"var(--p-surface-700)"}; cursor: pointer; font-size: 0.8125rem; font-weight: 600;">Small</button>
                        <button type="button" class="p-treetable-size-btn ${b==="normal"?"p-highlight":""}" data-size="normal" style="padding: 0.45rem 1rem; border: none; border-left: 1px solid var(--p-surface-200); border-right: 1px solid var(--p-surface-200); background: ${b==="normal"?"var(--p-primary-500)":"var(--p-surface-0)"}; color: ${b==="normal"?"#ffffff":"var(--p-surface-700)"}; cursor: pointer; font-size: 0.8125rem; font-weight: 600;">Normal</button>
                        <button type="button" class="p-treetable-size-btn ${b==="large"?"p-highlight":""}" data-size="large" style="padding: 0.45rem 1rem; border: none; background: ${b==="large"?"var(--p-primary-500)":"var(--p-surface-0)"}; color: ${b==="large"?"#ffffff":"var(--p-surface-700)"}; cursor: pointer; font-size: 0.8125rem; font-weight: 600;">Large</button>
                    </div>
                </div>
            `:a.topControls==="metaKey"?f=`
                <div class="p-treetable-top-controls justify-center">
                    <label style="display: inline-flex; align-items: center; gap: 0.6rem; cursor: pointer; font-size: 0.875rem; font-weight: 600; color: var(--p-surface-800);">
                        <input type="checkbox" class="p-treetable-metakey-switch" ${G?"checked":""} style="width: 1.25rem; height: 1.25rem; accent-color: var(--p-primary-500);" />
                        <span>MetaKey</span>
                    </label>
                </div>
            `:a.topControls==="controlled"?f=`
                <div class="p-treetable-top-controls">
                    <button type="button" class="p-treetable-toggle-apps-btn" style="display: inline-flex; align-items: center; gap: 0.4rem; padding: 0.5rem 1rem; font-size: 0.8125rem; font-weight: 600; border-radius: 6px; border: none; background: var(--p-primary-500); color: #ffffff; cursor: pointer;">
                        Toggle Applications
                    </button>
                </div>
            `:a.topControls==="refresh"?f=`
                <div class="p-treetable-top-controls" style="justify-content: space-between;">
                    <span style="font-size: 0.875rem; color: var(--p-surface-500);">Click refresh to simulate a network fetch.</span>
                    <button type="button" class="p-treetable-refresh-btn" style="display: inline-flex; align-items: center; gap: 0.4rem; padding: 0.45rem 0.85rem; font-size: 0.8125rem; font-weight: 600; border-radius: 6px; border: 1px solid var(--p-surface-300); background: var(--p-surface-0); color: var(--p-surface-700); cursor: pointer;">
                        ${n.refresh} Refresh
                    </button>
                </div>
            `:a.filter?f=`
                <div class="p-treetable-top-controls justify-end">
                    <div style="position: relative; width: 240px;">
                        <span style="position: absolute; left: 0.75rem; top: 50%; transform: translateY(-50%); color: var(--p-surface-400);">${n.search}</span>
                        <input type="text" class="p-treetable-global-search" placeholder="Keyword search" value="${P}" style="width: 100%; padding: 0.45rem 0.75rem 0.45rem 2.25rem; font-size: 0.8125rem; border-radius: 6px; border: 1px solid var(--p-surface-300); background: var(--p-surface-0); color: var(--p-surface-900); outline: none; box-sizing: border-box;" />
                    </div>
                </div>
            `:ue&&(f=`
                <div class="p-treetable-top-controls justify-end">
                    <div style="position: relative;">
                        <button type="button" class="p-treetable-column-toggle-btn" style="display: inline-flex; align-items: center; gap: 0.4rem; padding: 0.45rem 0.85rem; font-size: 0.8125rem; font-weight: 600; border-radius: 6px; border: 1px solid var(--p-surface-300); background: var(--p-surface-0); color: var(--p-surface-700); cursor: pointer;">
                            ${n.cog} Columns
                        </button>
                        ${W?`
                            <div class="p-treetable-popover">
                                <div style="display: flex; align-items: center; justify-content: space-between; padding-bottom: 0.5rem; margin-bottom: 0.5rem; border-bottom: 1px solid var(--p-surface-200);">
                                    <span style="font-weight: 700; font-size: 0.8125rem;">Columns</span>
                                    <button type="button" class="p-treetable-reset-cols-btn" style="border: none; background: transparent; color: var(--p-primary-600); cursor: pointer; font-size: 0.75rem; font-weight: 600;">Reset</button>
                                </div>
                                <div style="display: flex; flex-direction: column; gap: 0.35rem; max-height: 200px; overflow-y: auto;">
                                    ${I.map(s=>`
                                        <label style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.8125rem; cursor: pointer; padding: 0.25rem 0.4rem; border-radius: 4px;">
                                            <input type="checkbox" class="p-treetable-col-cb" data-field="${s.field}" ${L.includes(s.field)?"checked":""} />
                                            <span>${s.header}</span>
                                        </label>
                                    `).join("")}
                                </div>
                            </div>
                        `:""}
                    </div>
                </div>
            `);let K=a.headerTitle?`
            <div class="p-treetable-header">
                <span>${a.headerTitle}</span>
            </div>
        `:"",D=`
            <thead class="p-treetable-thead">
                <tr>
                    ${d.map(s=>{let u=!!s.expander,k=!!s.sortable,g=s.width?`width: ${s.width};`:s.minWidth?`min-width: ${s.minWidth};`:"",$=s.frozen?s.alignFrozen==="right"?"p-frozen-right":"p-frozen-left":"",M="",N="";if(k){if(H==="single")S===s.field?M=y===1?n.sortAsc:y===-1?n.sortDesc:n.sortNone:M=n.sortNone;else if(H==="multiple"){let C=m.findIndex(h=>h.field===s.field);C>=0?(M=m[C].order===1?n.sortAsc:n.sortDesc,N=`<span class="p-sortable-badge">${C+1}</span>`):M=n.sortNone}}return`
                            <th class="${k?"p-sortable-column":""} ${S===s.field||m.some(C=>C.field===s.field)?"p-highlight":""} ${$}" data-col-field="${s.field}" style="${g}">
                                <div class="p-treetable-header-content">
                                    <span>${s.header}</span>
                                    ${k?`<span class="p-treetable-sort-icon">${M}${N}</span>`:""}
                                </div>
                                ${a.resizableColumns?'<span class="p-column-resizer"></span>':""}
                            </th>
                        `}).join("")}
                    ${a.showActions?'<th style="width: 140px; text-align: center;">Actions</th>':""}
                </tr>
            </thead>
        `,O="";te&&F?O=`
                <tbody class="p-treetable-tbody">
                    ${Array.from({length:10}).map((s,u)=>`
                        <tr>
                            ${d.map(()=>`
                                <td><div class="p-treetable-skeleton-line" style="width: ${Math.floor(Math.random()*40)+50}%;"></div></td>
                            `).join("")}
                            ${a.showActions?'<td><div class="p-treetable-skeleton-line" style="width: 70px; margin: 0 auto;"></div></td>':""}
                        </tr>
                    `).join("")}
                </tbody>
            `:l.length===0?O=`
                <tbody class="p-treetable-tbody">
                    <tr>
                        <td colspan="${d.length+(a.showActions?1:0)}" style="text-align: center; padding: 3rem 1rem;">
                            <div style="display: flex; flex-direction: column; align-items: center; gap: 0.75rem; color: var(--p-surface-500);">
                                <div style="width: 3.5rem; height: 3.5rem; border-radius: 9999px; background: var(--p-surface-100); display: flex; align-items: center; justify-content: center; color: var(--p-surface-400);">
                                    <span style="transform: scale(1.6);">${n.folder}</span>
                                </div>
                                <div>
                                    <p style="margin: 0; font-weight: 700; font-size: 1rem; color: var(--p-surface-900);">${a.emptyMessage||"No folders yet"}</p>
                                    <p style="margin: 0.25rem 0 0; font-size: 0.8125rem; color: var(--p-surface-500);">Create your first folder to start building a tree.</p>
                                </div>
                                <button type="button" class="p-treetable-empty-add-btn" style="margin-top: 0.25rem; display: inline-flex; align-items: center; gap: 0.4rem; padding: 0.45rem 0.85rem; font-size: 0.8125rem; font-weight: 600; border-radius: 6px; border: none; background: var(--p-primary-500); color: #ffffff; cursor: pointer;">
                                    ${n.plus} New Folder
                                </button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            `:O=`<tbody class="p-treetable-tbody">${l.map(({node:u,level:k})=>{let g=String(u.key),$=u.children&&u.children.length>0||ee&&!u.leaf,M=!!z[g],N=v==="single"?R===g:v==="multiple"?!!B[g]:v==="checkbox"?!!x[g]?.checked:!1,C=v==="checkbox"&&!!x[g]?.partialChecked;return`
                    <tr class="p-treetable-row ${N?"p-highlight":""}" data-key="${g}" tabindex="0">
                        ${d.map(h=>{let Te=!!h.expander,J=h.frozen?h.alignFrozen==="right"?"p-frozen-right":"p-frozen-left":"",Y=h.width?`width: ${h.width};`:h.minWidth?`min-width: ${h.minWidth};`:"";if(Te){let Z=$?u.loading?n.spinner:M?n.chevronDown:n.chevronRight:"",X=a.useNodeIcons?`<span style="display: inline-flex; align-items: center; margin-right: 0.5rem; color: var(--p-surface-400);">${me(u.data.type,M)}</span>`:"",ie="";return v==="checkbox"&&(ie=`
                                        <div class="p-treetable-checkbox ${N?"p-highlight":C?"p-indeterminate":""}" data-cb-key="${g}">
                                            ${N?n.check:C?n.minus:""}
                                        </div>
                                    `),`
                                    <td class="${J}" style="${Y} padding-left: ${k*1.5+.75}rem;">
                                        <div style="display: flex; align-items: center;">
                                            <button type="button" class="p-treetable-toggler ${$?"":"p-hidden-space"}" data-toggler-key="${g}">
                                                ${Z}
                                            </button>
                                            ${ie}
                                            ${X}
                                            <span style="font-weight: ${$&&a.useNodeIcons?"600":"400"}; color: var(--p-surface-900);">${j(u,h.field)??""}</span>
                                        </div>
                                    </td>
                                `}if(h.field==="type"&&a.useTags){let Z=u.data.type||"Folder",X=he(Z);return`
                                    <td class="${J}" style="${Y}">
                                        <span class="p-treetable-tag p-tag-${X}">${Z}</span>
                                    </td>
                                `}return`
                                <td class="${J}" style="${Y}">
                                    <span style="color: var(--p-surface-700);">${j(u,h.field)??"\u2014"}</span>
                                </td>
                            `}).join("")}
                        ${a.showActions?`
                            <td style="text-align: center;">
                                <div style="display: inline-flex; align-items: center; gap: 0.4rem;">
                                    <button type="button" class="p-treetable-action-view" style="width: 2rem; height: 2rem; border-radius: 9999px; border: none; background: var(--p-surface-100); color: var(--p-surface-700); display: flex; align-items: center; justify-content: center; cursor: pointer;">
                                        ${n.search}
                                    </button>
                                    <button type="button" class="p-treetable-action-edit" style="width: 2rem; height: 2rem; border-radius: 9999px; border: none; background: #dcfce7; color: #15803d; display: flex; align-items: center; justify-content: center; cursor: pointer;">
                                        ${n.pencil}
                                    </button>
                                </div>
                            </td>
                        `:""}
                    </tr>
                `}).join("")}</tbody>`;let U="";if(Q)if(a.headlessPaginator)U=`
                    <div class="p-treetable-paginator" style="justify-content: center;">
                        <div style="display: flex; align-items: center; gap: 1rem; border: 1px solid var(--p-surface-200); border-radius: 9999px; padding: 0.25rem 0.75rem;">
                            <button type="button" class="p-treetable-prev-btn p-treetable-paginator-btn" ${p===0?"disabled":""}>
                                ${n.chevronLeft}
                            </button>
                            <span style="font-size: 0.8125rem; font-weight: 600; color: var(--p-surface-700);">
                                Page ${p+1} of ${r} (${e} items)
                            </span>
                            <button type="button" class="p-treetable-next-btn p-treetable-paginator-btn" ${p>=r-1?"disabled":""}>
                                ${n.chevronRight}
                            </button>
                        </div>
                    </div>
                `;else{let s=e>0?p*E+1:0,u=Math.min((p+1)*E,e);U=`
                    <div class="p-treetable-paginator">
                        <div style="display: flex; align-items: center; gap: 0.5rem;">
                            <span style="font-size: 0.8125rem; color: var(--p-surface-500);">Rows:</span>
                            <select class="p-treetable-rpp-select" style="padding: 0.25rem 0.5rem; font-size: 0.8125rem; border-radius: 6px; border: 1px solid var(--p-surface-300); background: var(--p-surface-0); color: var(--p-surface-700);">
                                ${fe.map(k=>`<option value="${k}" ${k===E?"selected":""}>${k}</option>`).join("")}
                            </select>
                        </div>
                        <div style="display: flex; align-items: center; gap: 0.25rem;">
                            <button type="button" class="p-treetable-first-btn p-treetable-paginator-btn" ${p===0?"disabled":""}>${n.firstPage}</button>
                            <button type="button" class="p-treetable-prev-btn p-treetable-paginator-btn" ${p===0?"disabled":""}>${n.chevronLeft}</button>
                            ${Array.from({length:Math.min(5,r)}).map((k,g)=>{let $=g;return`<button type="button" class="p-treetable-page-btn p-treetable-paginator-btn ${$===p?"p-highlight":""}" data-page="${$}">${$+1}</button>`}).join("")}
                            <button type="button" class="p-treetable-next-btn p-treetable-paginator-btn" ${p>=r-1?"disabled":""}>${n.chevronRight}</button>
                            <button type="button" class="p-treetable-last-btn p-treetable-paginator-btn" ${p>=r-1?"disabled":""}>${n.lastPage}</button>
                        </div>
                        <div style="font-size: 0.8125rem; color: var(--p-surface-500);">
                            ${s} to ${u} of ${e}
                        </div>
                    </div>
                `}let $e=a.footerText?`
            <div class="p-treetable-footer">
                <button type="button" class="p-treetable-footer-reload-btn" style="display: inline-flex; align-items: center; gap: 0.4rem; padding: 0.45rem 0.85rem; font-size: 0.8125rem; font-weight: 600; border-radius: 6px; border: none; background: #f59e0b; color: #ffffff; cursor: pointer;">
                    ${n.refresh} ${a.footerText}
                </button>
            </div>
        `:"",Se=F&&!te?`
            <div class="p-treetable-loading-mask">
                <div style="display: flex; flex-direction: column; align-items: center; gap: 0.5rem; color: var(--p-primary-500);">
                    ${n.spinner}
                    <span style="font-size: 0.8125rem; font-weight: 600; color: var(--p-surface-700);">Loading nodes\u2026</span>
                </div>
            </div>
        `:"",ze=ce?`max-height: ${pe}; overflow: auto;`:"",Me=b==="small"?"p-treetable-sm":b==="large"?"p-treetable-lg":"",Ce=de?"p-treetable-gridlines":"";c.innerHTML=`
            ${f}
            <div class="p-treetable p-component ${Me} ${Ce}">
                ${K}
                ${Se}
                <div class="p-treetable-scrollable-wrapper" style="${ze}">
                    <table class="p-treetable-table">
                        ${D}
                        ${O}
                    </table>
                </div>
                ${U}
                ${$e}
            </div>
        `,xe()}function xe(){c.querySelectorAll(".p-treetable-size-btn").forEach(t=>{t.addEventListener("click",()=>{let e=t.getAttribute("data-size");e&&(b=e,i())})}),c.querySelector(".p-treetable-metakey-switch")?.addEventListener("change",t=>{G=t.target.checked}),c.querySelector(".p-treetable-toggle-apps-btn")?.addEventListener("click",()=>{z[0]?delete z[0]:z[0]=!0,i()}),c.querySelector(".p-treetable-refresh-btn")?.addEventListener("click",()=>{F=!0,i(),setTimeout(()=>{F=!1,i()},1200)}),c.querySelectorAll(".p-treetable-toggler").forEach(t=>{t.addEventListener("click",e=>{e.stopPropagation();let r=t.getAttribute("data-toggler-key");r&&w.has(r)&&ve(w.get(r))})}),c.querySelectorAll(".p-treetable-checkbox").forEach(t=>{t.addEventListener("click",e=>{e.stopPropagation();let r=t.getAttribute("data-cb-key");if(r&&w.has(r)){let l=w.get(r),d=!x[r]?.checked;oe(l,d),ne(l),A(d?"success":"warn",d?"Node Selected":"Node Unselected",l.data.name),i()}})}),c.querySelectorAll(".p-treetable-row").forEach(t=>{t.addEventListener("click",e=>{let r=t.getAttribute("data-key");if(!r||!w.has(r))return;let l=w.get(r);if(v==="single")R===r?(R=null,A("warn","Node Unselected",l.data.name)):(R=r,A("success","Node Selected",l.data.name)),i();else if(v==="multiple"){let d=e.metaKey||e.ctrlKey;G&&!d?B={[r]:!0}:B[r]?delete B[r]:B[r]=!0,A("success","Selection Updated",l.data.name),i()}}),be&&t.addEventListener("contextmenu",e=>{e.preventDefault();let r=t.getAttribute("data-key");r&&w.has(r)&&(q=w.get(r),we(e.clientX,e.clientY))})}),c.querySelectorAll(".p-sortable-column").forEach(t=>{t.addEventListener("click",()=>{let e=t.getAttribute("data-col-field");e&&ye(e)})}),c.querySelector(".p-treetable-first-btn")?.addEventListener("click",()=>{p=0,i()}),c.querySelector(".p-treetable-prev-btn")?.addEventListener("click",()=>{p>0&&(p--,i())}),c.querySelector(".p-treetable-next-btn")?.addEventListener("click",()=>{p++,i()}),c.querySelector(".p-treetable-last-btn")?.addEventListener("click",()=>{p=999999,i()}),c.querySelectorAll(".p-treetable-page-btn").forEach(t=>{t.addEventListener("click",()=>{p=parseInt(t.getAttribute("data-page")||"0",10),i()})}),c.querySelector(".p-treetable-rpp-select")?.addEventListener("change",t=>{E=parseInt(t.target.value,10),p=0,i()});let o=c.querySelector(".p-treetable-global-search");o&&o.addEventListener("input",t=>{P=t.target.value,i();let e=c.querySelector(".p-treetable-global-search");e&&(e.focus(),e.setSelectionRange(P.length,P.length))}),c.querySelector(".p-treetable-column-toggle-btn")?.addEventListener("click",t=>{t.stopPropagation(),W=!W,i()}),c.querySelectorAll(".p-treetable-col-cb").forEach(t=>{t.addEventListener("change",e=>{let r=t.getAttribute("data-field");r&&(t.checked?L.includes(r)||L.push(r):L=L.filter(l=>l!==r),i())})}),c.querySelector(".p-treetable-reset-cols-btn")?.addEventListener("click",()=>{L=I.map(t=>t.field),i()}),c.querySelector(".p-treetable-empty-add-btn")?.addEventListener("click",()=>{T.push({key:String(T.length),data:{name:`New Folder ${T.length+1}`,size:"0kb",type:"Folder"},children:[]}),V(T),i()}),c.querySelector(".p-treetable-footer-reload-btn")?.addEventListener("click",()=>{A("info","TreeTable Reloaded","Refreshed node hierarchy")})}function we(o,t){document.querySelectorAll(".p-treetable-contextmenu").forEach(l=>l.remove());let e=document.createElement("div");e.className="p-treetable-contextmenu",e.style.left=`${o}px`,e.style.top=`${t}px`,e.innerHTML=`
            <div class="p-treetable-contextmenu-item" data-action="view">
                ${n.search} View
            </div>
            <div class="p-treetable-contextmenu-item" data-action="delete" style="color: #ef4444;">
                ${n.trash} Delete
            </div>
        `,document.body.appendChild(e),e.querySelector('[data-action="view"]')?.addEventListener("click",()=>{q&&A("info","Node Selected",q.data.name),e.remove()}),e.querySelector('[data-action="delete"]')?.addEventListener("click",()=>{q&&A("error","Node Deleted",q.data.name),e.remove()});let r=l=>{e.contains(l.target)||(e.remove(),document.removeEventListener("click",r))};setTimeout(()=>document.addEventListener("click",r),50)}i()}export{Ee as default};
