import{b as L}from"./chunk-P6B5FGGY.mjs";import{e as te}from"./chunk-3YU53HBK.mjs";var me=`
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
`;function he(T,n){te("datatable",me);let C=[...n.value||n.data||[]],M=n.columns||[],P=n.size||"normal",ae=!!n.showGridlines,re=!!n.stripedRows,j=n.selectionMode,ne=n.metaKeySelection!==!1,k=n.dataKey||"id",G=!!n.paginator,R=n.rows||10,$=Math.floor((n.first||0)/R)+1,oe=n.rowsPerPageOptions||[5,10,20,50],Q=n.sortMode||"single",ie=!!n.removableSort,le=n.filterDisplay||"none",se=!!n.scrollable,_=n.scrollHeight,U=n.editMode,I=!!n.loading,V=n.loadingMode||"overlay",de=n.exportFilename||"datatable_export",ce=n.emptyMessage||"No records found.",J=!!n.interactiveSize,q="",W={},E=[];n.sortField&&E.push({field:n.sortField,order:n.sortOrder??1});let b=new Set,N=new Set,A=null;function H(o,m){if(!o||!m)return"";if(m.includes("."))return m.split(".").reduce((f,d)=>{if(f==null)return;if(f[d]!==void 0)return f[d];let w=d.charAt(0).toLowerCase()+d.slice(1);if(f[w]!==void 0)return f[w];let t=d.toLowerCase();for(let a of Object.keys(f))if(a.toLowerCase()===t)return f[a]},o);if(o[m]!==void 0)return o[m];let c=m.charAt(0).toLowerCase()+m.slice(1);if(o[c]!==void 0)return o[c];let v=m.toLowerCase();for(let f of Object.keys(o))if(f.toLowerCase()===v)return o[f]}function pe(o,m,c){let v=(m.field||"").toLowerCase(),f=(m.header||"").toLowerCase();if(v.includes("status")||f.includes("status")){let d=String(c||"").toUpperCase();return d==="INSTOCK"||d==="QUALIFIED"?`<span class="p-tag p-tag-success">${d==="INSTOCK"?"In Stock":"Qualified"}</span>`:d==="LOWSTOCK"||d==="NEGOTIATION"?`<span class="p-tag p-tag-warn">${d==="LOWSTOCK"?"Low Stock":"Negotiation"}</span>`:d==="OUTOFSTOCK"||d==="UNQUALIFIED"?`<span class="p-tag p-tag-danger">${d==="OUTOFSTOCK"?"Out of Stock":"Unqualified"}</span>`:d==="NEW"||d==="PROPOSAL"?`<span class="p-tag p-tag-info">${d}</span>`:`<span class="p-tag p-tag-secondary">${c??""}</span>`}return v==="category"?`<span class="p-tag p-tag-secondary">${c??""}</span>`:(v==="name"||f==="product")&&o.code?`
                <div class="p-product-cell">
                    <div class="p-product-avatar">${L.package}</div>
                    <div class="p-product-info">
                        <span class="p-product-name">${o.name??""}</span>
                        <span class="p-product-code">${o.code??""}</span>
                    </div>
                </div>
            `:v==="country"?`
                <div class="p-country-cell">
                    <span style="font-size: 1rem; line-height: 1;">\u{1F310}</span>
                    <span>${c??""}</span>
                </div>
            `:v.includes("rep")||f.includes("representative")?`
                <div class="p-rep-cell">
                    <div class="p-rep-avatar">${String(c||"U").split(" ").map(w=>w[0]).join("").substring(0,2)}</div>
                    <span>${c??""}</span>
                </div>
            `:typeof c=="number"&&(v.includes("price")||v.includes("balance"))?`<span style="font-weight: 700; color: var(--p-surface-900);">$${c.toLocaleString()}</span>`:v==="verified"?c?'<span class="p-tag p-tag-success">Verified</span>':'<span class="p-tag p-tag-secondary">\u2014</span>':c!=null?String(c):""}function X(){if(C.length===0)return;let o=M.filter(t=>t.field&&!t.selectionMode&&!t.expander),m=o.map(t=>`"${(t.header||t.field).replace(/"/g,'""')}"`).join(","),c=C.map(t=>o.map(a=>{let e=H(t,a.field);return`"${(e==null?"":String(e)).replace(/"/g,'""')}"`}).join(",")),v=[m,...c].join(`
`),f=new Blob([v],{type:"text/csv;charset=utf-8;"}),d=URL.createObjectURL(f),w=document.createElement("a");w.setAttribute("href",d),w.setAttribute("download",`${de}.csv`),document.body.appendChild(w),w.click(),document.body.removeChild(w),URL.revokeObjectURL(d)}T.exportCSV=X;function x(){let o=C.filter(r=>{if(q.trim()){let l=q.toLowerCase();if(!(n.globalFilterFields&&n.globalFilterFields.length>0?n.globalFilterFields:M.map(y=>y.field).filter(Boolean)).some(y=>{let z=H(r,y);return z!=null&&String(z).toLowerCase().includes(l)}))return!1}for(let[l,p]of Object.entries(W))if(p.trim()){let h=H(r,l);if(h==null||!String(h).toLowerCase().includes(p.toLowerCase()))return!1}return!0});E.length>0&&o.sort((r,l)=>{for(let p of E){let h=H(r,p.field),y=H(l,p.field);if(h===y)continue;if(h==null)return 1;if(y==null)return-1;let z=typeof h=="number"&&typeof y=="number"?h-y:String(h).localeCompare(String(y),void 0,{numeric:!0});if(z!==0)return z*p.order}return 0});let m=o.length,c=Math.ceil(m/R)||1;$>c&&($=c),$<1&&($=1);let v=($-1)*R,f=G?o.slice(v,v+R):o,d=["p-datatable","p-component"];P==="small"&&d.push("p-datatable-sm"),P==="large"&&d.push("p-datatable-lg"),ae&&d.push("p-datatable-gridlines"),re&&d.push("p-datatable-striped"),se&&d.push("p-datatable-scrollable");let w=f.length>0&&f.every(r=>b.has(r[k])),t=M.map(r=>{let l=!!r.sortable,p=E.find(D=>D.field===r.field),h=!!p,y=p?.order||0,z=Q==="multiple"&&E.length>1&&h?`<span class="p-datatable-sort-badge">${E.indexOf(p)+1}</span>`:"",S="";l&&(y===1?S=L.arrowUp:y===-1?S=L.arrowDown:S=L.arrowUpDown);let u="";r.frozen&&(u=r.alignFrozen==="right"?"p-frozen-column-right":"p-frozen-column-left");let F=[r.width?`width: ${r.width};`:"",r.minWidth?`min-width: ${r.minWidth};`:"",r.align?`text-align: ${r.align};`:""].filter(Boolean).join(" ");return r.selectionMode==="multiple"?`
                    <th class="${u}" style="width: 3.5rem; text-align: center;">
                        <div class="p-checkbox-box p-select-all ${w?"p-checked":""}" role="checkbox" aria-checked="${w}">
                            ${w?L.check:""}
                        </div>
                    </th>
                `:r.selectionMode==="single"?`<th class="${u}" style="width: 3.5rem; text-align: center;"></th>`:r.expander?`<th class="${u}" style="width: 3.5rem; text-align: center;"></th>`:`
                <th class="${l?"p-sortable-column":""} ${h?"p-sorted":""} ${u} ${r.headerClass||""}" 
                    data-field="${r.field||""}" 
                    style="${F}">
                    <div class="p-datatable-header-content" style="justify-content: ${r.align==="right"?"flex-end":r.align==="center"?"center":"flex-start"};">
                        <span>${r.header||""}</span>
                        ${l?`<span class="p-datatable-sort-icon">${S}</span>${z}`:""}
                    </div>
                </th>
            `}).join(""),a="";le==="row"&&(a=`<tr class="p-datatable-filter-row">${M.map(l=>{let p=l.frozen?l.alignFrozen==="right"?"p-frozen-column-right":"p-frozen-column-left":"";if(!l.field||l.selectionMode||l.expander||l.filterable===!1)return`<th class="${p}"></th>`;let h=W[l.field]||"";return`
                    <th class="${p}">
                        <input type="text" 
                               class="p-datatable-filter-input" 
                               data-filter-field="${l.field}" 
                               placeholder="${l.filterPlaceholder||"Filter..."}" 
                               value="${h}" />
                    </th>
                `}).join("")}</tr>`);let e="";I&&V==="skeleton"?e=Array.from({length:R}).map(()=>`
                <tr>
                    ${M.map(r=>`
                        <td style="${r.width?`width: ${r.width};`:""}">
                            <div class="p-datatable-skeleton-cell"></div>
                        </td>
                    `).join("")}
                </tr>
            `).join(""):f.length===0?e=`
                <tr>
                    <td colspan="${M.length}" style="text-align: center; padding: 3rem 1rem; color: var(--p-surface-400);">
                        <div style="display: flex; flex-direction: column; align-items: center; gap: 0.75rem;">
                            <span style="font-size: 1.75rem; color: var(--p-surface-400);">${L.inbox}</span>
                            <span style="font-weight: 600; font-size: 0.9375rem; color: var(--p-surface-700);">${ce}</span>
                        </div>
                    </td>
                </tr>
            `:e=f.map(r=>{let l=r[k],p=b.has(l),h=N.has(l),y=M.map(u=>{let F=u.frozen?u.alignFrozen==="right"?"p-frozen-column-right":"p-frozen-column-left":"",D=[u.width?`width: ${u.width};`:"",u.minWidth?`min-width: ${u.minWidth};`:"",u.align?`text-align: ${u.align};`:""].filter(Boolean).join(" ");if(u.selectionMode==="multiple")return`
                            <td class="${F}" style="width: 3.5rem; text-align: center;">
                                <div class="p-checkbox-box p-row-checkbox ${p?"p-checked":""}" data-row-key="${l}">
                                    ${p?L.check:""}
                                </div>
                            </td>
                        `;if(u.selectionMode==="single")return`
                            <td class="${F}" style="width: 3.5rem; text-align: center;">
                                <div class="p-radio-box p-row-radio ${p?"p-checked":""}" data-row-key="${l}">
                                    ${p?'<span style="width: 6px; height: 6px; border-radius: 9999px; background: white;"></span>':""}
                                </div>
                            </td>
                        `;if(u.expander)return`
                            <td class="${F}" style="width: 3.5rem; text-align: center;">
                                <button type="button" class="p-row-toggler" data-row-key="${l}" aria-label="Toggle Row">
                                    ${h?L.chevronDown:L.chevronRight}
                                </button>
                            </td>
                        `;let ee=H(r,u.field);if(U==="cell"&&A?.rowKey===l&&A?.field===u.field)return`
                            <td class="${F} ${u.bodyClass||""}" style="${D}">
                                <input type="text" 
                                       class="p-cell-editor-input" 
                                       data-row-key="${l}" 
                                       data-field="${u.field}" 
                                       value="${ee??""}" 
                                       autofocus />
                            </td>
                        `;let be=pe(r,u,ee),ge=U==="cell"&&u.field?"p-editable-cell":"";return`
                        <td class="${F} ${ge} ${u.bodyClass||""}" 
                            data-row-key="${l}" 
                            data-field="${u.field||""}" 
                            style="${D}">
                            ${be}
                        </td>
                    `}).join(""),z=`
                    <tr class="${p?"p-highlight":""}" data-row-key="${l}">
                        ${y}
                    </tr>
                `,S="";return h&&(S=`
                        <tr class="p-row-expansion">
                            <td colspan="${M.length}" style="padding: 1.25rem;">
                                <div style="display: flex; gap: 1.25rem; align-items: center; background: var(--p-surface-0); padding: 1rem; border-radius: 8px; border: 1px solid var(--p-surface-200);">
                                    <div style="width: 56px; height: 56px; border-radius: 8px; background: var(--p-primary-50, #ecfdf5); border: 1px solid var(--p-primary-200, #a7f3d0); display: flex; align-items: center; justify-content: center; color: var(--p-primary-600); font-size: 1.5rem; flex-shrink: 0;">
                                        ${L.package}
                                    </div>
                                    <div style="display: flex; flex-direction: column; gap: 0.35rem; flex: 1;">
                                        <div style="display: flex; align-items: center; justify-content: space-between;">
                                            <span style="font-weight: 700; color: var(--p-surface-900); font-size: 1rem;">
                                                ${r.name||r.title||`Record #${l}`}
                                            </span>
                                            <span class="p-tag p-tag-success">${r.inventoryStatus||"Active"}</span>
                                        </div>
                                        <div style="font-size: 0.8125rem; color: var(--p-surface-500); display: flex; gap: 1.5rem;">
                                            <span>SKU: <strong>${r.code||"N/A"}</strong></span>
                                            <span>Category: <strong>${r.category||"General"}</strong></span>
                                            <span>Stock: <strong>${r.quantity??0} units</strong></span>
                                            <span>Price: <strong>$${r.price??0}</strong></span>
                                        </div>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    `),z+S}).join("");let i="";if(b.size>0){let l=C.filter(p=>b.has(p[k])).reduce((p,h)=>p+(Number(h.price)||Number(h.balance)||0),0);i=`
                <div class="p-datatable-selection-bar">
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <span class="p-tag p-tag-info" style="font-weight: 700;">Selected: ${b.size}</span>
                        ${l>0?`<span>Total: <strong>$${l.toLocaleString()}</strong></span>`:""}
                    </div>
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <button type="button" class="p-datatable-clear-selection" style="padding: 0.3rem 0.6rem; font-size: 0.75rem; border-radius: 4px; border: 1px solid var(--p-surface-300); background: transparent; cursor: pointer; color: var(--p-surface-600);">
                            Clear Selection
                        </button>
                    </div>
                </div>
            `}let s="";if(G){let r=m>0?v+1:0,l=Math.min(v+R,m),p=(n.currentPageReportTemplate||"Showing {first} to {last} of {totalRecords} entries").replace("{first}",String(r)).replace("{last}",String(l)).replace("{totalRecords}",String(m)),h=[],y=Math.max(1,$-2),z=Math.min(c,y+4);z-y<4&&(y=Math.max(1,z-4));for(let S=y;S<=z;S++)h.push(`
                    <button type="button" class="p-paginator-page ${S===$?"p-paginator-page-active":""}" data-page="${S}">
                        ${S}
                    </button>
                `);s=`
                <div class="p-datatable-paginator">
                    <span>${p}</span>
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <button type="button" class="p-paginator-nav p-first" data-page="1" ${$===1?"disabled":""} aria-label="First Page">\xAB</button>
                        <button type="button" class="p-paginator-nav p-prev" data-page="${$-1}" ${$===1?"disabled":""} aria-label="Previous Page">\u2039</button>
                        <div class="p-paginator-pages">${h.join("")}</div>
                        <button type="button" class="p-paginator-nav p-next" data-page="${$+1}" ${$===c?"disabled":""} aria-label="Next Page">\u203A</button>
                        <button type="button" class="p-paginator-nav p-last" data-page="${c}" ${$===c?"disabled":""} aria-label="Last Page">\xBB</button>
                    </div>
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <span>Rows per page:</span>
                        <select class="p-datatable-rows-select" style="padding: 0.25rem 0.5rem; border-radius: 4px; border: 1px solid var(--p-surface-300); background: var(--p-surface-0); color: inherit; font-size: 0.8125rem;">
                            ${oe.map(S=>`<option value="${S}" ${S===R?"selected":""}>${S}</option>`).join("")}
                        </select>
                    </div>
                </div>
            `}let g="",K=Array.isArray(n.globalFilterFields)&&n.globalFilterFields.length>0,B=!!n.exportFilename&&n.exportFilename.trim()!==""||!!n.showExport,Y=!!n.showRefresh;(!!n.title||K||B||J||Y)&&(g=`
                <div class="p-datatable-header-toolbar">
                    <div class="p-datatable-title">${n.title||""}</div>
                    <div style="display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap;">
                        ${J?`
                            <div class="p-size-switcher">
                                <button type="button" class="p-size-btn ${P==="small"?"p-active":""}" data-size="small">Small</button>
                                <button type="button" class="p-size-btn ${P==="normal"?"p-active":""}" data-size="normal">Normal</button>
                                <button type="button" class="p-size-btn ${P==="large"?"p-active":""}" data-size="large">Large</button>
                            </div>
                        `:""}

                        ${K?`
                            <div style="position: relative; display: flex; align-items: center;">
                                <input type="text" class="p-datatable-global-filter p-datatable-filter-input" placeholder="Search keyword..." value="${q}" style="width: 180px;" />
                            </div>
                        `:""}

                        ${Y?`
                            <button type="button" class="p-datatable-refresh-btn" style="display: inline-flex; align-items: center; gap: 0.35rem; padding: 0.4rem 0.75rem; border-radius: 6px; border: 1px solid var(--p-surface-300); background: var(--p-surface-0); color: inherit; font-size: 0.8125rem; font-weight: 600; cursor: pointer;">
                                <span>${L.refreshCw}</span>
                                <span>Refresh</span>
                            </button>
                        `:""}

                        ${B?`
                            <button type="button" class="p-datatable-export-btn" style="display: inline-flex; align-items: center; gap: 0.35rem; padding: 0.4rem 0.75rem; border-radius: 6px; border: 1px solid var(--p-surface-300); background: var(--p-surface-0); color: inherit; font-size: 0.8125rem; font-weight: 600; cursor: pointer;">
                                <span>${L.fileSpreadsheet}</span>
                                <span>Export CSV</span>
                            </button>
                        `:""}
                    </div>
                </div>
            `);let Z="";I&&V==="overlay"&&(Z=`
                <div class="p-datatable-loading-overlay">
                    <div style="width: 2.25rem; height: 2.25rem; border: 3px solid var(--p-primary-500); border-top-color: transparent; border-radius: 9999px; animation: p-spin 0.8s linear infinite;"></div>
                    <span style="font-size: 0.875rem; font-weight: 600; color: var(--p-surface-700);">Loading records...</span>
                </div>
            `);let ue=_?`max-height: ${_}; overflow-y: auto;`:"";T.innerHTML=`
            <div class="${d.join(" ")}">
                ${Z}
                ${g}
                ${i}
                <div class="p-datatable-scrollable-wrapper" style="${ue}">
                    <table class="p-datatable-table" style="${n.tableStyle||""}">
                        <thead class="p-datatable-thead">
                            <tr>${t}</tr>
                            ${a}
                        </thead>
                        <tbody class="p-datatable-tbody">
                            ${e}
                        </tbody>
                    </table>
                </div>
                ${s}
            </div>
        `,fe()}function fe(){let o=T.firstElementChild;if(!o)return;o.querySelectorAll(".p-sortable-column").forEach(t=>{t.addEventListener("click",()=>{let a=t.getAttribute("data-field");if(!a)return;let e=E.find(s=>s.field===a),i=1;e&&(e.order===1?i=-1:e.order===-1&&(i=ie?0:1)),Q==="multiple"?i===0?E=E.filter(s=>s.field!==a):e?e.order=i:E.push({field:a,order:i}):i===0?E=[]:E=[{field:a,order:i}],T.dispatchEvent(new CustomEvent("datatable:sort",{bubbles:!0,detail:{sortMeta:E}})),x()})});let m=o.querySelector(".p-datatable-global-filter");m&&m.addEventListener("input",t=>{let a=t.target;q=a.value;let e=a.selectionStart;$=1,x();let i=T.querySelector(".p-datatable-global-filter");i&&(i.focus(),e!=null&&i.setSelectionRange(e,e))}),o.querySelectorAll(".p-datatable-filter-input[data-filter-field]").forEach(t=>{t.addEventListener("input",a=>{let e=a.target,i=t.getAttribute("data-filter-field");W[i]=e.value;let s=e.selectionStart;$=1,x();let g=T.querySelector(`.p-datatable-filter-input[data-filter-field="${i}"]`);g&&(g.focus(),s!=null&&g.setSelectionRange(s,s))})});let c=o.querySelector(".p-datatable-export-btn");c&&c.addEventListener("click",()=>X());let v=o.querySelector(".p-datatable-refresh-btn");v&&v.addEventListener("click",()=>{I=!0,x(),setTimeout(()=>{I=!1,x()},1e3)}),o.querySelectorAll(".p-size-btn").forEach(t=>{t.addEventListener("click",()=>{let a=t.getAttribute("data-size");a&&(P=a,x())})});let f=o.querySelector(".p-select-all");f&&f.addEventListener("click",()=>{let t=f.classList.contains("p-checked"),a=C;t?a.forEach(e=>b.delete(e[k])):a.forEach(e=>b.add(e[k])),O(),x()});let d=o.querySelector(".p-datatable-clear-selection");if(d&&d.addEventListener("click",()=>{b.clear(),O(),x()}),o.querySelectorAll(".p-row-checkbox").forEach(t=>{t.addEventListener("click",a=>{a.stopPropagation();let e=t.getAttribute("data-row-key");if(!e)return;let i=C.find(g=>String(g[k])===String(e)),s=i?i[k]:e;b.has(s)?b.delete(s):b.add(s),O(),x()})}),o.querySelectorAll(".p-row-radio").forEach(t=>{t.addEventListener("click",a=>{a.stopPropagation();let e=t.getAttribute("data-row-key");if(!e)return;let i=C.find(g=>String(g[k])===String(e)),s=i?i[k]:e;b.clear(),b.add(s),O(),x()})}),(j==="single"||j==="multiple")&&o.querySelectorAll(".p-datatable-tbody > tr[data-row-key]").forEach(t=>{t.addEventListener("click",a=>{let e=t.getAttribute("data-row-key");if(!e)return;let i=C.find(g=>String(g[k])===String(e)),s=i?i[k]:e;if(j==="single")b.has(s)?b.delete(s):(b.clear(),b.add(s));else if(j==="multiple"){let g=a;ne&&(g.ctrlKey||g.metaKey)?b.has(s)?b.delete(s):b.add(s):(b.clear(),b.add(s))}O(),x()})}),o.querySelectorAll(".p-row-toggler").forEach(t=>{t.addEventListener("click",a=>{a.stopPropagation();let e=t.getAttribute("data-row-key");if(!e)return;let i=C.find(g=>String(g[k])===String(e)),s=i?i[k]:e;N.has(s)?N.delete(s):N.add(s),x()})}),U==="cell"){o.querySelectorAll(".p-editable-cell").forEach(a=>{a.addEventListener("click",e=>{e.stopPropagation();let i=a.getAttribute("data-row-key"),s=a.getAttribute("data-field");if(!i||!s)return;let g=C.find(B=>String(B[k])===String(i));A={rowKey:g?g[k]:i,field:s},x()})});let t=o.querySelector(".p-cell-editor-input");if(t){t.focus();let a=()=>{if(!A)return;let e=A.rowKey,i=A.field,s=t.value,g=C.find(K=>String(K[k])===String(e));g&&(g[i]=s,T.dispatchEvent(new CustomEvent("datatable:cell-edit-complete",{bubbles:!0,detail:{row:g,field:i,newValue:s}}))),A=null,x()};t.addEventListener("blur",a),t.addEventListener("keydown",e=>{e.key==="Enter"?a():e.key==="Escape"&&(A=null,x())})}}o.querySelectorAll(".p-paginator-page, .p-paginator-nav").forEach(t=>{t.addEventListener("click",()=>{let a=Number(t.getAttribute("data-page"));!isNaN(a)&&a>0&&($=a,x())})});let w=o.querySelector(".p-datatable-rows-select");w&&w.addEventListener("change",()=>{R=Number(w.value),$=1,x()})}function O(){let o=C.filter(m=>b.has(m[k]));T.dispatchEvent(new CustomEvent("datatable:selection-change",{bubbles:!0,detail:{selectedKeys:Array.from(b),selectedRows:o}}))}x()}export{he as default};
