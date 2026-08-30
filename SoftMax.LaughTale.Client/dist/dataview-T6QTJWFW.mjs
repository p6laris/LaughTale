import{a as C}from"./chunk-DYNKTKKU.mjs";import{b as v}from"./chunk-P6B5FGGY.mjs";import{e as z}from"./chunk-3YU53HBK.mjs";var V=`
.p-dataview {
    display: flex;
    flex-direction: column;
    width: 100%;
    font-family: var(--p-font-family, inherit);
    color: var(--p-surface-800, #1e293b);
    background: var(--p-surface-0, #ffffff);
    border: 1px solid var(--p-surface-200, #e2e8f0);
    border-radius: var(--p-border-radius-lg, 10px);
    overflow: hidden;
    box-shadow: var(--p-shadow-xs, 0 1px 2px 0 rgba(0, 0, 0, 0.05));
}

/* Header & Controls */
.p-dataview-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 1.25rem;
    background: var(--p-surface-50, #f8fafc);
    border-bottom: 1px solid var(--p-surface-200, #e2e8f0);
    flex-wrap: wrap;
    gap: 0.75rem;
}

.p-dataview-title {
    font-size: 1rem;
    font-weight: 700;
    color: var(--p-surface-900, #0f172a);
}

.p-dataview-controls {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex-wrap: wrap;
}

/* Layout Switcher */
.p-layout-switcher {
    display: inline-flex;
    border-radius: var(--p-border-radius, 6px);
    border: 1px solid var(--p-surface-300, #cbd5e1);
    background: var(--p-surface-0, #ffffff);
    overflow: hidden;
}
.p-layout-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2.25rem;
    height: 2.25rem;
    padding: 0;
    border: none;
    background: transparent;
    cursor: pointer;
    color: var(--p-surface-600, #475569);
    transition: all 0.15s ease;
}
.p-layout-btn:hover {
    background: var(--p-surface-100, #f1f5f9);
    color: var(--p-surface-900, #0f172a);
}
.p-layout-btn.p-active {
    background: var(--p-primary-500, #10b981);
    color: #ffffff;
}

/* Sort Select */
.p-dataview-sort-select {
    padding: 0.4rem 0.75rem;
    font-size: 0.8125rem;
    font-weight: 600;
    border-radius: var(--p-border-radius, 6px);
    border: 1px solid var(--p-surface-300, #cbd5e1);
    background: var(--p-surface-0, #ffffff);
    color: var(--p-surface-700, #334155);
    outline: none;
    cursor: pointer;
    transition: all 0.15s ease;
}
.p-dataview-sort-select:focus {
    border-color: var(--p-primary-500, #10b981);
    box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.2);
}

/* Content Layouts */
.p-dataview-content {
    background: var(--p-surface-0, #ffffff);
}

/* List Layout */
.p-dataview-list {
    display: flex;
    flex-direction: column;
}
.p-dataview-list-item {
    display: flex;
    flex-direction: column;
    padding: 1.5rem;
    gap: 1.25rem;
    border-bottom: 1px solid var(--p-surface-200, #e2e8f0);
    transition: background-color 0.15s ease;
}
.p-dataview-list-item:last-child {
    border-bottom: none;
}
.p-dataview-list-item:hover {
    background: var(--p-surface-50, #f8fafc);
}

@media (min-width: 640px) {
    .p-dataview-list-item {
        flex-direction: row;
        align-items: center;
    }
}

.p-dataview-list-image-box {
    position: relative;
    width: 100%;
    max-width: 10rem;
    aspect-ratio: 4 / 3;
    border-radius: var(--p-border-radius, 6px);
    background: var(--p-surface-100, #f1f5f9);
    border: 1px solid var(--p-surface-200, #e2e8f0);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--p-primary-600, #059669);
    flex-shrink: 0;
    overflow: hidden;
}

.p-dataview-list-body {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    flex: 1;
    gap: 1.25rem;
}
@media (min-width: 768px) {
    .p-dataview-list-body {
        flex-direction: row;
        align-items: center;
    }
}

.p-dataview-item-info {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}
.p-dataview-item-category {
    font-size: 0.8125rem;
    font-weight: 500;
    color: var(--p-surface-500, #64748b);
}
.p-dataview-item-name {
    font-size: 1.125rem;
    font-weight: 700;
    color: var(--p-surface-900, #0f172a);
}

/* Rating Badge */
.p-dataview-rating-pill {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    padding: 0.25rem 0.6rem;
    border-radius: 9999px;
    background: var(--p-surface-0, #ffffff);
    border: 1px solid var(--p-surface-200, #e2e8f0);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
    font-size: 0.8125rem;
    font-weight: 700;
    color: var(--p-surface-900, #0f172a);
    width: fit-content;
}
.p-rating-star {
    color: #eab308;
    display: flex;
    align-items: center;
}

.p-dataview-list-actions {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
}
@media (min-width: 768px) {
    .p-dataview-list-actions {
        align-items: flex-end;
    }
}

.p-dataview-price {
    font-size: 1.35rem;
    font-weight: 700;
    color: var(--p-surface-900, #0f172a);
}

.p-dataview-btn-group {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.p-dataview-btn-buy {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    border-radius: var(--p-border-radius, 6px);
    background: var(--p-primary-500, #10b981);
    color: #ffffff;
    font-weight: 600;
    font-size: 0.8125rem;
    border: none;
    cursor: pointer;
    transition: all 0.15s ease;
    white-space: nowrap;
}
.p-dataview-btn-buy:hover:not(:disabled) {
    background: var(--p-primary-600, #059669);
}
.p-dataview-btn-buy:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background: var(--p-surface-400, #94a3b8);
}

.p-dataview-btn-wishlist {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2.25rem;
    height: 2.25rem;
    border-radius: var(--p-border-radius, 6px);
    border: 1px solid var(--p-surface-300, #cbd5e1);
    background: var(--p-surface-0, #ffffff);
    color: var(--p-surface-700, #334155);
    cursor: pointer;
    transition: all 0.15s ease;
}
.p-dataview-btn-wishlist:hover {
    border-color: #f43f5e;
    color: #f43f5e;
    background: #fff1f2;
}
.p-dataview-btn-wishlist.p-wishlisted {
    background: #f43f5e;
    border-color: #f43f5e;
    color: #ffffff;
}

/* Grid Layout */
.p-dataview-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1.25rem;
    padding: 1.25rem;
}

.p-dataview-grid-card {
    display: flex;
    flex-direction: column;
    border: 1px solid var(--p-surface-200, #e2e8f0);
    border-radius: var(--p-border-radius-lg, 10px);
    background: var(--p-surface-0, #ffffff);
    padding: 1.25rem;
    transition: all 0.2s ease;
}
.p-dataview-grid-card:hover {
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -4px rgba(0, 0, 0, 0.04);
    transform: translateY(-2px);
}

.p-dataview-grid-image-box {
    position: relative;
    width: 100%;
    aspect-ratio: 16 / 10;
    border-radius: var(--p-border-radius, 8px);
    background: var(--p-surface-50, #f8fafc);
    border: 1px solid var(--p-surface-200, #e2e8f0);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--p-primary-600, #059669);
    overflow: hidden;
    margin-bottom: 1.25rem;
}

.p-dataview-grid-body {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    flex: 1;
    justify-content: space-between;
}

/* Status Tags */
.p-tag {
    position: absolute;
    top: 0.5rem;
    left: 0.5rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.25rem 0.55rem;
    border-radius: 9999px;
    font-size: 0.6875rem;
    font-weight: 700;
    line-height: 1;
    letter-spacing: 0.02em;
    text-transform: capitalize;
    z-index: 2;
}
.p-tag-success { background: #dcfce7; color: #15803d; }
.p-tag-warn { background: #fef3c7; color: #b45309; }
.p-tag-danger { background: #fee2e2; color: #b91c1c; }

/* Skeleton Shimmer */
.p-skeleton {
    border-radius: 4px;
    background: linear-gradient(90deg, var(--p-surface-200, #e2e8f0) 25%, var(--p-surface-100, #f1f5f9) 50%, var(--p-surface-200, #e2e8f0) 75%);
    background-size: 200% 100%;
    animation: p-skeleton-shimmer 1.5s infinite;
}
@keyframes p-skeleton-shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
}

/* Paginator Integration */
.p-dataview-paginator {
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

/* Dark Mode Tokens */
.dark .p-dataview,
[data-theme="dark"] .p-dataview {
    background: var(--p-surface-900, #0f172a) !important;
    color: var(--p-surface-100, #f1f5f9) !important;
    border-color: var(--p-surface-700, #334155) !important;
}
.dark .p-dataview-header,
.dark .p-dataview-paginator,
[data-theme="dark"] .p-dataview-header,
[data-theme="dark"] .p-dataview-paginator {
    background: var(--p-surface-800, #1e293b) !important;
    border-color: var(--p-surface-700, #334155) !important;
    color: var(--p-surface-200, #e2e8f0) !important;
}
.dark .p-dataview-content,
[data-theme="dark"] .p-dataview-content {
    background: var(--p-surface-900, #0f172a) !important;
}
.dark .p-dataview-list-item,
[data-theme="dark"] .p-dataview-list-item {
    border-color: var(--p-surface-800, #1e293b) !important;
}
.dark .p-dataview-list-item:hover,
[data-theme="dark"] .p-dataview-list-item:hover {
    background: var(--p-surface-800, #1e293b) !important;
}
.dark .p-dataview-grid-card,
[data-theme="dark"] .p-dataview-grid-card {
    background: var(--p-surface-900, #0f172a) !important;
    border-color: var(--p-surface-700, #334155) !important;
}
.dark .p-dataview-grid-image-box,
.dark .p-dataview-list-image-box,
[data-theme="dark"] .p-dataview-grid-image-box,
[data-theme="dark"] .p-dataview-list-image-box {
    background: var(--p-surface-800, #1e293b) !important;
    border-color: var(--p-surface-700, #334155) !important;
}
.dark .p-layout-switcher,
.dark .p-dataview-sort-select,
.dark .p-dataview-btn-wishlist,
[data-theme="dark"] .p-layout-switcher,
[data-theme="dark"] .p-dataview-sort-select,
[data-theme="dark"] .p-dataview-btn-wishlist {
    background: var(--p-surface-800, #1e293b) !important;
    border-color: var(--p-surface-600, #475569) !important;
    color: var(--p-surface-200, #e2e8f0) !important;
}
.dark .p-dataview-item-name,
.dark .p-dataview-price,
.dark .p-dataview-title,
[data-theme="dark"] .p-dataview-item-name,
[data-theme="dark"] .p-dataview-price,
[data-theme="dark"] .p-dataview-title {
    color: var(--p-surface-100, #f1f5f9) !important;
}
.dark .p-dataview-rating-pill,
[data-theme="dark"] .p-dataview-rating-pill {
    background: var(--p-surface-800, #1e293b) !important;
    border-color: var(--p-surface-700, #334155) !important;
    color: var(--p-surface-100, #f1f5f9) !important;
}
`;function D(y,s){z("dataview",V);let S=[...s.value||s.items||[]],b=s.layout||"list",L=!!s.paginator,f=s.rows||5,i=Math.floor((s.first||0)/f)+1,H=s.rowsPerPageOptions||[5,10,20],p=s.sortField,x=s.sortOrder??1,E=!!s.showLayoutSwitcher,O=!!s.showSort,A=!!s.loading,w=new Set;function P(r){let a=(r||"").toUpperCase();return a==="INSTOCK"||a==="QUALIFIED"?'<span class="p-tag p-tag-success">In Stock</span>':a==="LOWSTOCK"||a==="NEGOTIATION"?'<span class="p-tag p-tag-warn">Low Stock</span>':a==="OUTOFSTOCK"||a==="UNQUALIFIED"?'<span class="p-tag p-tag-danger">Out of Stock</span>':a?`<span class="p-tag p-tag-success">${a}</span>`:""}function h(){let r=[...S];p&&r.sort((e,m)=>{let d=e[p],g=m[p];return d===g?0:d==null?1:g==null?-1:(typeof d=="number"&&typeof g=="number"?d-g:String(d).localeCompare(String(g)))*x});let a=r.length,n=Math.ceil(a/f)||1;i>n&&(i=n),i<1&&(i=1);let t=(i-1)*f,l=L?r.slice(t,t+f):r,o="";(s.title||E||O)&&(o=`
                <div class="p-dataview-header">
                    <div class="p-dataview-title">${s.title||""}</div>
                    <div class="p-dataview-controls">
                        ${O?`
                            <select class="p-dataview-sort-select">
                                <option value="" ${p?"":"selected"}>Sort by Price...</option>
                                <option value="lowtohigh" ${p==="price"&&x===1?"selected":""}>Price Low to High</option>
                                <option value="hightolow" ${p==="price"&&x===-1?"selected":""}>Price High to Low</option>
                            </select>
                        `:""}

                        ${E?`
                            <div class="p-layout-switcher">
                                <button type="button" class="p-layout-btn btn-layout-list ${b==="list"?"p-active":""}" title="List View" aria-label="List View">
                                    ${v.list}
                                </button>
                                <button type="button" class="p-layout-btn btn-layout-grid ${b==="grid"?"p-active":""}" title="Grid View" aria-label="Grid View">
                                    ${v.layoutGrid}
                                </button>
                            </div>
                        `:""}
                    </div>
                </div>
            `);let u="";A?b==="list"?u=`
                    <div class="p-dataview-list">
                        ${Array.from({length:f}).map(()=>`
                            <div class="p-dataview-list-item">
                                <div class="p-skeleton p-dataview-list-image-box" style="height: 6.5rem;"></div>
                                <div class="p-dataview-list-body">
                                    <div class="p-dataview-item-info" style="gap: 0.75rem;">
                                        <div class="p-skeleton" style="width: 6rem; height: 1rem;"></div>
                                        <div class="p-skeleton" style="width: 12rem; height: 1.5rem;"></div>
                                        <div class="p-skeleton" style="width: 4rem; height: 1.5rem; border-radius: 9999px;"></div>
                                    </div>
                                    <div class="p-dataview-list-actions" style="gap: 0.75rem;">
                                        <div class="p-skeleton" style="width: 5rem; height: 1.5rem;"></div>
                                        <div style="display: flex; gap: 0.5rem;">
                                            <div class="p-skeleton" style="width: 2.25rem; height: 2.25rem; border-radius: 6px;"></div>
                                            <div class="p-skeleton" style="width: 6rem; height: 2.25rem; border-radius: 6px;"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        `).join("")}
                    </div>
                `:u=`
                    <div class="p-dataview-grid">
                        ${Array.from({length:6}).map(()=>`
                            <div class="p-dataview-grid-card">
                                <div class="p-skeleton p-dataview-grid-image-box" style="height: 10rem;"></div>
                                <div class="p-dataview-grid-body">
                                    <div style="display: flex; justify-content: space-between;">
                                        <div class="p-skeleton" style="width: 5rem; height: 1rem;"></div>
                                        <div class="p-skeleton" style="width: 3rem; height: 1.25rem; border-radius: 9999px;"></div>
                                    </div>
                                    <div class="p-skeleton" style="width: 9rem; height: 1.5rem;"></div>
                                    <div class="p-skeleton" style="width: 4rem; height: 1.5rem;"></div>
                                    <div style="display: flex; gap: 0.5rem;">
                                        <div class="p-skeleton" style="flex: 1; height: 2.25rem; border-radius: 6px;"></div>
                                        <div class="p-skeleton" style="width: 2.25rem; height: 2.25rem; border-radius: 6px;"></div>
                                    </div>
                                </div>
                            </div>
                        `).join("")}
                    </div>
                `:b==="list"?u=`
                <div class="p-dataview-list dataview-animated-container">
                    ${l.map(e=>{let m=w.has(e.id||e.name),d=(e.inventoryStatus||"").toUpperCase()==="OUTOFSTOCK";return`
                            <div class="p-dataview-list-item" data-id="${e.id||e.name}">
                                <div class="p-dataview-list-image-box">
                                    ${P(e.inventoryStatus)}
                                    <div style="font-size: 2.5rem;">${v.package}</div>
                                </div>
                                <div class="p-dataview-list-body">
                                    <div class="p-dataview-item-info">
                                        <span class="p-dataview-item-category">${e.category||"General"}</span>
                                        <div class="p-dataview-item-name">${e.name}</div>
                                        <div class="p-dataview-rating-pill">
                                            <span>${e.rating??5}</span>
                                            <span class="p-rating-star">\u2605</span>
                                        </div>
                                    </div>
                                    <div class="p-dataview-list-actions">
                                        <span class="p-dataview-price">$${e.price??0}</span>
                                        <div class="p-dataview-btn-group">
                                            <button type="button" class="p-dataview-btn-wishlist ${m?"p-wishlisted":""}" data-id="${e.id||e.name}" title="Wishlist" aria-label="Wishlist">
                                                ${v.heart}
                                            </button>
                                            <button type="button" class="p-dataview-btn-buy" data-id="${e.id||e.name}" ${d?"disabled":""}>
                                                <span>${v.shoppingCart}</span>
                                                <span>${d?"Out of Stock":"Buy Now"}</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        `}).join("")}
                </div>
            `:u=`
                <div class="p-dataview-grid dataview-animated-container">
                    ${l.map(e=>{let m=w.has(e.id||e.name),d=(e.inventoryStatus||"").toUpperCase()==="OUTOFSTOCK";return`
                            <div class="p-dataview-grid-card" data-id="${e.id||e.name}">
                                <div class="p-dataview-grid-image-box">
                                    ${P(e.inventoryStatus)}
                                    <div style="font-size: 3.5rem;">${v.package}</div>
                                </div>
                                <div class="p-dataview-grid-body">
                                    <div style="display: flex; align-items: center; justify-content: space-between;">
                                        <span class="p-dataview-item-category">${e.category||"General"}</span>
                                        <div class="p-dataview-rating-pill">
                                            <span>${e.rating??5}</span>
                                            <span class="p-rating-star">\u2605</span>
                                        </div>
                                    </div>
                                    <div class="p-dataview-item-name" style="font-size: 1rem;">${e.name}</div>
                                    <div class="p-dataview-price" style="font-size: 1.5rem;">$${e.price??0}</div>
                                    <div style="display: flex; gap: 0.5rem; align-items: center;">
                                        <button type="button" class="p-dataview-btn-buy" style="flex: 1; justify-content: center;" data-id="${e.id||e.name}" ${d?"disabled":""}>
                                            <span>${v.shoppingCart}</span>
                                            <span>${d?"Out of Stock":"Buy Now"}</span>
                                        </button>
                                        <button type="button" class="p-dataview-btn-wishlist ${m?"p-wishlisted":""}" data-id="${e.id||e.name}" title="Wishlist" aria-label="Wishlist">
                                            ${v.heart}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        `}).join("")}
                </div>
            `;let I="";if(L){let e=a>0?t+1:0,m=Math.min(t+f,a),d=`Showing ${e} to ${m} of ${a} entries`,g=[],k=Math.max(1,i-2),$=Math.min(n,k+4);$-k<4&&(k=Math.max(1,$-4));for(let c=k;c<=$;c++)g.push(`
                    <button type="button" class="p-paginator-page ${c===i?"p-paginator-page-active":""}" data-page="${c}">
                        ${c}
                    </button>
                `);I=`
                <div class="p-dataview-paginator">
                    <span>${d}</span>
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <button type="button" class="p-paginator-nav p-first" data-page="1" ${i===1?"disabled":""} aria-label="First Page">\xAB</button>
                        <button type="button" class="p-paginator-nav p-prev" data-page="${i-1}" ${i===1?"disabled":""} aria-label="Previous Page">\u2039</button>
                        <div class="p-paginator-pages">${g.join("")}</div>
                        <button type="button" class="p-paginator-nav p-next" data-page="${i+1}" ${i===n?"disabled":""} aria-label="Next Page">\u203A</button>
                        <button type="button" class="p-paginator-nav p-last" data-page="${n}" ${i===n?"disabled":""} aria-label="Last Page">\xBB</button>
                    </div>
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <span>Rows per page:</span>
                        <select class="p-dataview-rows-select" style="padding: 0.25rem 0.5rem; border-radius: 4px; border: 1px solid var(--p-surface-300); background: var(--p-surface-0); color: inherit; font-size: 0.8125rem;">
                            ${H.map(c=>`<option value="${c}" ${c===f?"selected":""}>${c}</option>`).join("")}
                        </select>
                    </div>
                </div>
            `}y.innerHTML=`
            <div class="p-dataview p-component">
                ${o}
                <div class="p-dataview-content">
                    ${u}
                </div>
                ${I}
            </div>
        `;let j=y.querySelector(".dataview-animated-container");j&&C(j,{duration:200}),M()}function M(){let r=y.firstElementChild;if(!r)return;r.querySelector(".btn-layout-list")?.addEventListener("click",()=>{b="list",h()}),r.querySelector(".btn-layout-grid")?.addEventListener("click",()=>{b="grid",h()});let a=r.querySelector(".p-dataview-sort-select");a&&a.addEventListener("change",()=>{let t=a.value;t==="lowtohigh"?(p="price",x=1):t==="hightolow"?(p="price",x=-1):p=void 0,h()}),r.querySelectorAll(".p-dataview-btn-wishlist").forEach(t=>{t.addEventListener("click",l=>{l.stopPropagation();let o=t.getAttribute("data-id");o&&(w.has(o)?w.delete(o):w.add(o),t.classList.toggle("p-wishlisted"),y.dispatchEvent(new CustomEvent("dataview:wishlist-toggle",{bubbles:!0,detail:{id:o,isWishlisted:w.has(o)}})))})}),r.querySelectorAll(".p-dataview-btn-buy").forEach(t=>{t.addEventListener("click",l=>{l.stopPropagation();let o=t.getAttribute("data-id"),T=S.find(u=>String(u.id||u.name)===String(o));y.dispatchEvent(new CustomEvent("dataview:buy-now",{bubbles:!0,detail:{item:T}}))})}),r.querySelectorAll(".p-paginator-page, .p-paginator-nav").forEach(t=>{t.addEventListener("click",()=>{let l=Number(t.getAttribute("data-page"));!isNaN(l)&&l>0&&(i=l,h())})});let n=r.querySelector(".p-dataview-rows-select");n&&n.addEventListener("change",()=>{f=Number(n.value),i=1,h()})}h()}export{D as default};
