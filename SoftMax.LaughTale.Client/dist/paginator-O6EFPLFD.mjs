import{e as q}from"./chunk-3YU53HBK.mjs";var V=`
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
    color: #ffffff !important;
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
    color: #ffffff !important;
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
    color: #ffffff !important;
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
`,k={first:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m11 17-5-5 5-5"/><path d="m18 17-5-5 5-5"/></svg>',prev:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>',next:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>',last:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m6 17 5-5-5-5"/><path d="m13 17 5-5-5-5"/></svg>',refresh:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 16h5v5"/></svg>',settings:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>'},_=["https://primefaces.org/cdn/primevue/images/nature/nature1.jpg","https://primefaces.org/cdn/primevue/images/nature/nature2.jpg","https://primefaces.org/cdn/primevue/images/nature/nature3.jpg","https://primefaces.org/cdn/primevue/images/nature/nature4.jpg","https://primefaces.org/cdn/primevue/images/nature/nature5.jpg","https://primefaces.org/cdn/primevue/images/nature/nature6.jpg"];function U(u,a){q("paginator",V);let s=a.first||0,o=a.rows||10,v=a.totalRecords||0,b=a.pageLinkSize||5,w=a.rowsPerPageOptions,T=a.template,z=a.currentPageReportTemplate||"Showing {first} to {last} of {totalRecords}",H=a.showFirstLast!==!1,J=!!a.showJumpToPageDropdown,A=!!a.showJumpToPageInput,D=!!a.showSlider,x=a.images&&a.images.length>0?a.images:a.totalRecords===6&&o===1?_:[];function m(){return Math.ceil(v/o)||1}function f(){return Math.floor(s/o)}function l(t){let e=m(),i=Math.max(0,Math.min(t,e-1))*o;i!==s&&(s=i,P(),j())}function F(t){o=t,s=0,P(),j()}function O(){let t=m(),e=f()+1,d=v>0?s+1:0,i=Math.min(s+o,v);return z.replace(/{currentPage}/g,String(e)).replace(/{totalPages}/g,String(t)).replace(/{rows}/g,String(o)).replace(/{first}/g,String(d)).replace(/{last}/g,String(i)).replace(/{totalRecords}/g,String(v))}function P(){let t=m(),e=f(),d=e===0,i=e>=t-1,c=Math.max(0,e-Math.floor(b/2)),n=Math.min(t-1,c+b-1);n-c+1<b&&(c=Math.max(0,n-b+1));let r=[];for(let p=c;p<=n;p++){let g=p===e;r.push(`
                <button type="button" 
                        class="p-paginator-page ${g?"p-highlight":""}" 
                        data-page="${p}" 
                        aria-label="Page ${p+1}" 
                        aria-current="${g?"page":void 0}">
                    ${p+1}
                </button>
            `)}let M=H?`
            <button type="button" class="p-paginator-first" data-action="first" title="First Page" aria-label="First Page" ${d?"disabled":""}>
                ${k.first}
            </button>
        `:"",I=`
            <button type="button" class="p-paginator-prev" data-action="prev" title="Previous Page" aria-label="Previous Page" ${d?"disabled":""}>
                ${k.prev}
            </button>
        `,N=`
            <button type="button" class="p-paginator-next" data-action="next" title="Next Page" aria-label="Next Page" ${i?"disabled":""}>
                ${k.next}
            </button>
        `,C=H?`
            <button type="button" class="p-paginator-last" data-action="last" title="Last Page" aria-label="Last Page" ${i?"disabled":""}>
                ${k.last}
            </button>
        `:"",y="";w&&w.length>0&&(y=`<select class="p-paginator-rpp-select" aria-label="Rows per page">${w.map(g=>`
                <option value="${g}" ${g===o?"selected":""}>${g}</option>
            `).join("")}</select>`);let $="";J&&($=`
                <div class="p-paginator-jtp-container">
                    <span>Jump to page:</span>
                    <select class="p-paginator-jtp-select">${Array.from({length:t},(g,h)=>`
                <option value="${h}" ${h===e?"selected":""}>${h+1}</option>
            `).join("")}</select>
                    <span>of ${t}</span>
                </div>
            `);let L="";A&&(L=`
                <div class="p-paginator-jtp-container">
                    <span>Go to:</span>
                    <input type="number" class="p-paginator-jtp-input" min="1" max="${t}" value="${e+1}" />
                    <span>/ ${t}</span>
                </div>
            `);let S="";D&&(S=`
                <div class="p-paginator-jtp-container">
                    <input type="range" class="p-paginator-slider" min="0" max="${t-1}" value="${e}" />
                </div>
            `);let R=a.currentPageReportTemplate?`
            <span class="p-paginator-current">${O()}</span>
        `:"",E="";T?E=T.split(/\s+/).map(h=>{switch(h){case"FirstPageLink":return M;case"PrevPageLink":return I;case"PageLinks":return`<div class="p-paginator-pages">${r.join("")}</div>`;case"NextPageLink":return N;case"LastPageLink":return C;case"RowsPerPageDropdown":return y;case"CurrentPageReport":return R;case"JumpToPageDropdown":return $;case"JumpToPageInput":return L;case"Slider":return S;default:return""}}).join(""):E=`
                ${M}
                ${I}
                <div class="p-paginator-pages">${r.join("")}</div>
                ${N}
                ${C}
                ${y}
                ${$}
                ${L}
                ${S}
                ${R}
            `;let B="";x.length>0&&(B=`
                <div class="p-paginator-image-display">
                    <div class="p-paginator-image-card">
                        <img src="${x[e%x.length]}" alt="Nature ${e+1}" loading="eager" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80';" />
                    </div>
                </div>
            `),u.innerHTML=`
            <div class="p-paginator-wrapper" style="width: 100%;">
                <div class="p-paginator p-component" role="navigation" aria-label="Pagination Navigation">
                    ${E}
                </div>
                ${B}
            </div>
        `,G()}function G(){let t=u.firstElementChild;if(!t)return;t.querySelector('[data-action="first"]')?.addEventListener("click",()=>l(0)),t.querySelector('[data-action="prev"]')?.addEventListener("click",()=>l(f()-1)),t.querySelector('[data-action="next"]')?.addEventListener("click",()=>l(f()+1)),t.querySelector('[data-action="last"]')?.addEventListener("click",()=>l(m()-1)),t.querySelectorAll(".p-paginator-page").forEach(n=>{n.addEventListener("click",()=>{let r=parseInt(n.getAttribute("data-page")||"0",10);l(r)})});let e=t.querySelector(".p-paginator-rpp-select");e&&e.addEventListener("change",n=>{let r=parseInt(n.target.value,10);isNaN(r)||F(r)});let d=t.querySelector(".p-paginator-jtp-select");d&&d.addEventListener("change",n=>{let r=parseInt(n.target.value,10);isNaN(r)||l(r)});let i=t.querySelector(".p-paginator-jtp-input");i&&i.addEventListener("change",n=>{let r=parseInt(n.target.value,10);isNaN(r)||l(r-1)});let c=t.querySelector(".p-paginator-slider");c&&c.addEventListener("input",n=>{let r=parseInt(n.target.value,10);isNaN(r)||l(r)})}function j(){let t=f();if(u.dispatchEvent(new CustomEvent("page",{bubbles:!0,detail:{first:s,rows:o,page:t,pageCount:m()}})),u.dispatchEvent(new CustomEvent("page-change",{bubbles:!0,detail:{first:s,rows:o,page:t}})),a.targetInputName){let e=u.querySelector(`input[name="${a.targetInputName}"]`);e||(e=document.createElement("input"),e.type="hidden",e.name=a.targetInputName,u.appendChild(e)),e.value=JSON.stringify({first:s,rows:o,page:t})}}P(),j()}export{U as default};
