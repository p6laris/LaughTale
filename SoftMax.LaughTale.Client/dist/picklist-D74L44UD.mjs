import{b as m}from"./chunk-P6B5FGGY.mjs";import{e as z}from"./chunk-3YU53HBK.mjs";var _=`
.p-picklist {
    display: flex;
    align-items: center;
    gap: 1.25rem;
    width: 100%;
    font-family: var(--p-font-family, inherit);
    color: var(--p-surface-800, #1e293b);
}

.p-picklist-controls {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 0.5rem;
    flex-shrink: 0;
}

.p-picklist-control-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2.25rem;
    height: 2.25rem;
    padding: 0;
    border-radius: var(--p-border-radius, 6px);
    border: 1px solid var(--p-surface-300, #cbd5e1);
    background: var(--p-surface-0, #ffffff);
    color: var(--p-surface-700, #334155);
    cursor: pointer;
    transition: background-color 0.12s ease, border-color 0.12s ease, color 0.12s ease;
    outline: none;
}
.p-picklist-control-btn:hover:not(:disabled) {
    background: var(--p-surface-100, #f1f5f9);
    color: var(--p-surface-900, #0f172a);
    border-color: var(--p-surface-400, #94a3b8);
}
.p-picklist-control-btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
}

.p-picklist-list-container {
    flex: 1 1 0;
    display: flex;
    flex-direction: column;
    border: 1px solid var(--p-surface-200, #e2e8f0);
    border-radius: var(--p-border-radius-lg, 8px);
    background: var(--p-surface-0, #ffffff);
    overflow: hidden;
    min-width: 0;
    box-shadow: var(--p-shadow-xs, 0 1px 2px 0 rgba(0, 0, 0, 0.05));
}

.p-picklist-header {
    padding: 0.75rem 1rem;
    background: var(--p-surface-50, #f8fafc);
    border-bottom: 1px solid var(--p-surface-200, #e2e8f0);
    font-size: 0.875rem;
    font-weight: 700;
    color: var(--p-surface-800, #1e293b);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
}

.p-picklist-filter-container {
    padding: 0.5rem 0.75rem;
    background: var(--p-surface-50, #f8fafc);
    border-bottom: 1px solid var(--p-surface-200, #e2e8f0);
    position: relative;
    display: flex;
    align-items: center;
}
.p-picklist-filter-input {
    width: 100%;
    padding: 0.4rem 2rem 0.4rem 0.65rem;
    font-size: 0.8125rem;
    border: 1px solid var(--p-surface-300, #cbd5e1);
    border-radius: var(--p-border-radius, 6px);
    background: var(--p-surface-0, #ffffff);
    color: inherit;
    outline: none;
    transition: border-color 0.15s ease, box-shadow 0.15s ease;
}
.p-picklist-filter-input:focus {
    border-color: var(--p-primary-500, #10b981);
    box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.2);
}
.p-picklist-filter-icon {
    position: absolute;
    right: 1.25rem;
    color: var(--p-surface-400, #94a3b8);
    pointer-events: none;
    display: flex;
    align-items: center;
}

.p-picklist-list {
    list-style: none;
    margin: 0;
    padding: 0.25rem 0;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    scroll-behavior: smooth;
}

.p-picklist-item {
    padding: 0.625rem 1rem;
    margin: 0.125rem 0.25rem;
    border-radius: var(--p-border-radius-xs, 5px);
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-size: 0.875rem;
    color: var(--p-surface-700, #334155);
    user-select: none;
    transition: background-color 0.12s ease, color 0.12s ease;
}
.p-picklist-item:hover:not(.p-highlight) {
    background: var(--p-surface-100, #f1f5f9);
    color: var(--p-surface-900, #0f172a);
}
.p-picklist-item.p-highlight {
    background: rgba(16, 185, 129, 0.1) !important;
    color: var(--p-primary-700, #047857) !important;
    font-weight: 600;
}

/* Custom Checkbox */
.p-checkbox-box {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 1.125rem;
    height: 1.125rem;
    border-radius: var(--p-border-radius-xs, 4px);
    border: 2px solid var(--p-surface-300, #cbd5e1);
    background: var(--p-surface-0, #ffffff);
    cursor: pointer;
    transition: background-color 0.12s ease, border-color 0.12s ease;
    flex-shrink: 0;
}
.p-checkbox-box.p-checked {
    background: var(--p-primary-500, #10b981);
    border-color: var(--p-primary-500, #10b981);
    color: #ffffff;
}
.p-checkbox-box.p-indeterminate {
    background: var(--p-primary-500, #10b981);
    border-color: var(--p-primary-500, #10b981);
    color: #ffffff;
}

/* Custom Item Content */
.p-picklist-product-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    width: 100%;
}
.p-picklist-product-img {
    width: 2.75rem;
    height: 2.75rem;
    border-radius: 6px;
    background: var(--p-surface-100, #f1f5f9);
    border: 1px solid var(--p-surface-200, #e2e8f0);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--p-primary-600, #059669);
    flex-shrink: 0;
}
.p-picklist-product-details {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
    min-width: 0;
}
.p-picklist-product-name {
    font-weight: 600;
    font-size: 0.875rem;
    color: var(--p-surface-900, #0f172a);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
.p-picklist-product-category {
    font-size: 0.75rem;
    color: var(--p-surface-500, #64748b);
}
.p-picklist-product-price {
    font-weight: 700;
    font-size: 0.875rem;
    color: var(--p-surface-900, #0f172a);
}

.p-picklist-member-item {
    display: flex;
    align-items: center;
    gap: 0.65rem;
    width: 100%;
}
.p-picklist-member-avatar {
    width: 2rem;
    height: 2rem;
    border-radius: 9999px;
    background: var(--p-primary-100, #d1fae5);
    color: var(--p-primary-700, #047857);
    font-weight: 700;
    font-size: 0.75rem;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

/* Empty State */
.p-picklist-empty {
    padding: 2.5rem 1rem;
    text-align: center;
    color: var(--p-surface-400, #94a3b8);
    font-size: 0.8125rem;
    font-style: italic;
}

/* Striped Rows */
.p-picklist-striped .p-picklist-item:nth-child(even):not(.p-highlight) {
    background: var(--p-surface-50, #f8fafc);
}

/* Dark Mode Tokens */
.dark .p-picklist,
[data-theme="dark"] .p-picklist {
    color: var(--p-surface-100, #f1f5f9) !important;
}
.dark .p-picklist-list-container,
[data-theme="dark"] .p-picklist-list-container {
    background: var(--p-surface-900, #0f172a) !important;
    border-color: var(--p-surface-700, #334155) !important;
}
.dark .p-picklist-header,
.dark .p-picklist-filter-container,
[data-theme="dark"] .p-picklist-header,
[data-theme="dark"] .p-picklist-filter-container {
    background: var(--p-surface-800, #1e293b) !important;
    border-color: var(--p-surface-700, #334155) !important;
    color: var(--p-surface-100, #f1f5f9) !important;
}
.dark .p-picklist-filter-input,
[data-theme="dark"] .p-picklist-filter-input {
    background: var(--p-surface-900, #0f172a) !important;
    border-color: var(--p-surface-600, #475569) !important;
    color: #ffffff !important;
}
.dark .p-picklist-control-btn,
[data-theme="dark"] .p-picklist-control-btn {
    background: var(--p-surface-800, #1e293b) !important;
    border-color: var(--p-surface-600, #475569) !important;
    color: var(--p-surface-200, #e2e8f0) !important;
}
.dark .p-picklist-control-btn:hover:not(:disabled),
[data-theme="dark"] .p-picklist-control-btn:hover:not(:disabled) {
    background: var(--p-surface-700, #334155) !important;
    color: #ffffff !important;
}
.dark .p-picklist-item:hover:not(.p-highlight),
[data-theme="dark"] .p-picklist-item:hover:not(.p-highlight) {
    background: var(--p-surface-800, #1e293b) !important;
    color: #ffffff !important;
}
.dark .p-picklist-product-name,
[data-theme="dark"] .p-picklist-product-name,
.dark .p-picklist-product-price,
[data-theme="dark"] .p-picklist-product-price {
    color: var(--p-surface-100, #f1f5f9) !important;
}
.dark .p-picklist-product-img,
[data-theme="dark"] .p-picklist-product-img {
    background: var(--p-surface-800, #1e293b) !important;
    border-color: var(--p-surface-700, #334155) !important;
}
`;function G(g,u){z("picklist",_);let B=u.value?u.value[0]:u.source||[],N=u.value?u.value[1]:u.target||[],b=[...B],f=[...N],F=u.dataKey||"id",E=!!u.checkbox,x=!!u.filter,H=u.filterBy||"name",j=u.sourceHeader||"Available",D=u.targetHeader||"Selected",K=!!u.showSourceControls,V=!!u.showTargetControls,A=u.scrollHeight||"18rem",R=u.emptyMessageSource||"No available options",Q=u.emptyMessageTarget||"No available options",c=new Set,n=new Set,L="",S="";function p(e){return String(e[F]||e.id||e.name)}function P(e,l){let a=E?`
            <div class="p-checkbox-box ${l?"p-checked":""}" role="checkbox" aria-checked="${l}">
                ${l?m.check:""}
            </div>
        `:"";if(e.price!=null||e.category!=null||e.image!=null)return`
                ${a}
                <div class="p-picklist-product-item">
                    <div class="p-picklist-product-img">
                        ${m.package}
                    </div>
                    <div class="p-picklist-product-details">
                        <span class="p-picklist-product-name">${e.name}</span>
                        <span class="p-picklist-product-category">${e.category||""}</span>
                    </div>
                    ${e.price!=null?`<span class="p-picklist-product-price">$${e.price}</span>`:""}
                </div>
            `;if(e.avatar!=null||e.role!=null){let s=e.name.split(" ").map(o=>o[0]).join("").substring(0,2);return`
                ${a}
                <div class="p-picklist-member-item">
                    <div class="p-picklist-member-avatar">${s}</div>
                    <div style="display: flex; flex-direction: column;">
                        <span style="font-weight: 600; color: var(--p-surface-900);">${e.name}</span>
                        ${e.role?`<span style="font-size: 0.75rem; color: var(--p-surface-500);">${e.role}</span>`:""}
                    </div>
                </div>
            `}return`
            ${a}
            <span style="flex: 1; font-weight: ${l?"600":"normal"};">${e.name}</span>
        `}function J(){let e=K?`
            <div class="p-picklist-controls p-picklist-source-controls">
                <button type="button" class="p-picklist-control-btn btn-source-top" title="Move Top" aria-label="Move Top">${m.chevronsUp}</button>
                <button type="button" class="p-picklist-control-btn btn-source-up" title="Move Up" aria-label="Move Up">${m.chevronUp}</button>
                <button type="button" class="p-picklist-control-btn btn-source-down" title="Move Down" aria-label="Move Down">${m.chevronDown}</button>
                <button type="button" class="p-picklist-control-btn btn-source-bottom" title="Move Bottom" aria-label="Move Bottom">${m.chevronsDown}</button>
            </div>
        `:"",l=V?`
            <div class="p-picklist-controls p-picklist-target-controls">
                <button type="button" class="p-picklist-control-btn btn-target-top" title="Move Top" aria-label="Move Top">${m.chevronsUp}</button>
                <button type="button" class="p-picklist-control-btn btn-target-up" title="Move Up" aria-label="Move Up">${m.chevronUp}</button>
                <button type="button" class="p-picklist-control-btn btn-target-down" title="Move Down" aria-label="Move Down">${m.chevronDown}</button>
                <button type="button" class="p-picklist-control-btn btn-target-bottom" title="Move Bottom" aria-label="Move Bottom">${m.chevronsDown}</button>
            </div>
        `:"",a=E?`
            <div class="p-checkbox-box p-source-select-all" role="checkbox" aria-checked="false"></div>
        `:"",s=E?`
            <div class="p-checkbox-box p-target-select-all" role="checkbox" aria-checked="false"></div>
        `:"",o=x?`
            <div class="p-picklist-filter-container">
                <input type="text" class="p-picklist-filter-input p-source-filter" placeholder="${u.sourceFilterPlaceholder||"Search by name"}" />
                <span class="p-picklist-filter-icon">${m.search}</span>
            </div>
        `:"",t=x?`
            <div class="p-picklist-filter-container">
                <input type="text" class="p-picklist-filter-input p-target-filter" placeholder="${u.targetFilterPlaceholder||"Search by name"}" />
                <span class="p-picklist-filter-icon">${m.search}</span>
            </div>
        `:"";g.innerHTML=`
            <div class="p-picklist p-component">
                ${e}

                <!-- Source List Box -->
                <div class="p-picklist-list-container">
                    <div class="p-picklist-header">
                        <div style="display: flex; align-items: center; gap: 0.5rem;">
                            ${a}
                            <span>${j}</span>
                        </div>
                        <span class="p-source-count" style="font-size: 0.75rem; font-weight: 600; color: var(--p-surface-500);">0 items</span>
                    </div>
                    ${o}
                    <ul class="p-picklist-list picklist-source-list" style="height: ${A};" role="listbox" aria-multiselectable="true" tabindex="0">
                    </ul>
                </div>

                <!-- Transfer Buttons (Center) -->
                <div class="p-picklist-controls p-picklist-transfer-controls">
                    <button type="button" class="p-picklist-control-btn btn-move-to-target" title="Move to Target" aria-label="Move to Target" disabled>
                        ${m.chevronRight}
                    </button>
                    <button type="button" class="p-picklist-control-btn btn-move-all-to-target" title="Move All to Target" aria-label="Move All to Target">
                        ${m.chevronsRight}
                    </button>
                    <button type="button" class="p-picklist-control-btn btn-move-to-source" title="Move to Source" aria-label="Move to Source" disabled>
                        ${m.chevronLeft}
                    </button>
                    <button type="button" class="p-picklist-control-btn btn-move-all-to-source" title="Move All to Source" aria-label="Move All to Source">
                        ${m.chevronsLeft}
                    </button>
                </div>

                <!-- Target List Box -->
                <div class="p-picklist-list-container">
                    <div class="p-picklist-header">
                        <div style="display: flex; align-items: center; gap: 0.5rem;">
                            ${s}
                            <span>${D}</span>
                        </div>
                        <span class="p-target-count" style="font-size: 0.75rem; font-weight: 600; color: var(--p-surface-500);">0 items</span>
                    </div>
                    ${t}
                    <ul class="p-picklist-list picklist-target-list" style="height: ${A};" role="listbox" aria-multiselectable="true" tabindex="0">
                    </ul>
                </div>

                ${l}
            </div>
        `,O(),T(),M(),q()}function I(){let e=g.firstElementChild;if(!e)return;let l=b.filter(o=>!x||!L.trim()?!0:String(o[H]||o.name||"").toLowerCase().includes(L.toLowerCase())),a=e.querySelector(".p-source-select-all");if(a){let o=l.length>0&&l.every(r=>c.has(p(r))),t=l.some(r=>c.has(p(r)))&&!o;a.className=`p-checkbox-box p-source-select-all ${o?"p-checked":t?"p-indeterminate":""}`,a.setAttribute("aria-checked",String(o)),a.innerHTML=o?m.check:t?'<span style="width: 8px; height: 2px; background: white;"></span>':""}let s=e.querySelector(".picklist-source-list");s&&s.querySelectorAll(".source-item").forEach(o=>{let t=o.getAttribute("data-id");if(!t)return;let r=c.has(t);if(o.classList.toggle("p-highlight",r),o.setAttribute("aria-selected",String(r)),E){let i=o.querySelector(".p-checkbox-box");i&&(i.className=`p-checkbox-box ${r?"p-checked":""}`,i.setAttribute("aria-checked",String(r)),i.innerHTML=r?m.check:"")}}),q(),U()}function C(){let e=g.firstElementChild;if(!e)return;let l=f.filter(o=>!x||!S.trim()?!0:String(o[H]||o.name||"").toLowerCase().includes(S.toLowerCase())),a=e.querySelector(".p-target-select-all");if(a){let o=l.length>0&&l.every(r=>n.has(p(r))),t=l.some(r=>n.has(p(r)))&&!o;a.className=`p-checkbox-box p-target-select-all ${o?"p-checked":t?"p-indeterminate":""}`,a.setAttribute("aria-checked",String(o)),a.innerHTML=o?m.check:t?'<span style="width: 8px; height: 2px; background: white;"></span>':""}let s=e.querySelector(".picklist-target-list");s&&s.querySelectorAll(".target-item").forEach(o=>{let t=o.getAttribute("data-id");if(!t)return;let r=n.has(t);if(o.classList.toggle("p-highlight",r),o.setAttribute("aria-selected",String(r)),E){let i=o.querySelector(".p-checkbox-box");i&&(i.className=`p-checkbox-box ${r?"p-checked":""}`,i.setAttribute("aria-checked",String(r)),i.innerHTML=r?m.check:"")}}),q(),U()}function T(){let e=g.firstElementChild;if(!e)return;let l=b.filter(o=>!x||!L.trim()?!0:String(o[H]||o.name||"").toLowerCase().includes(L.toLowerCase())),a=e.querySelector(".p-source-count");a&&(a.textContent=`${l.length} items`);let s=e.querySelector(".picklist-source-list");s&&(l.length===0?s.innerHTML=`<li class="p-picklist-empty">${L?"No results found":R}</li>`:(s.innerHTML=l.map(o=>{let t=p(o),r=c.has(t);return`
                        <li class="p-picklist-item source-item ${r?"p-highlight":""}" 
                            data-id="${t}" 
                            role="option" 
                            aria-selected="${r}">
                            ${P(o,r)}
                        </li>
                    `}).join(""),s.querySelectorAll(".source-item").forEach(o=>{o.addEventListener("click",t=>{let r=o.getAttribute("data-id");if(!r)return;let i=t;E||i.ctrlKey||i.metaKey?c.has(r)?c.delete(r):c.add(r):c.has(r)&&c.size===1?c.clear():(c.clear(),c.add(r)),I()})}))),I()}function M(){let e=g.firstElementChild;if(!e)return;let l=f.filter(o=>!x||!S.trim()?!0:String(o[H]||o.name||"").toLowerCase().includes(S.toLowerCase())),a=e.querySelector(".p-target-count");a&&(a.textContent=`${l.length} items`);let s=e.querySelector(".picklist-target-list");s&&(l.length===0?s.innerHTML=`<li class="p-picklist-empty">${S?"No results found":Q}</li>`:(s.innerHTML=l.map(o=>{let t=p(o),r=n.has(t);return`
                        <li class="p-picklist-item target-item ${r?"p-highlight":""}" 
                            data-id="${t}" 
                            role="option" 
                            aria-selected="${r}">
                            ${P(o,r)}
                        </li>
                    `}).join(""),s.querySelectorAll(".target-item").forEach(o=>{o.addEventListener("click",t=>{let r=o.getAttribute("data-id");if(!r)return;let i=t;E||i.ctrlKey||i.metaKey?n.has(r)?n.delete(r):n.add(r):n.has(r)&&n.size===1?n.clear():(n.clear(),n.add(r)),C()})}))),C()}function q(){let e=g.firstElementChild;if(!e)return;let l=e.querySelector(".btn-move-to-target");l&&(l.disabled=c.size===0);let a=e.querySelector(".btn-move-all-to-target");a&&(a.disabled=b.length===0);let s=e.querySelector(".btn-move-to-source");s&&(s.disabled=n.size===0);let o=e.querySelector(".btn-move-all-to-source");o&&(o.disabled=f.length===0)}function O(){let e=g.firstElementChild;if(!e)return;let l=e.querySelector(".p-source-filter");l&&l.addEventListener("input",t=>{L=t.target.value,T()});let a=e.querySelector(".p-target-filter");a&&a.addEventListener("input",t=>{S=t.target.value,M()});let s=e.querySelector(".p-source-select-all");s&&s.addEventListener("click",()=>{s.classList.contains("p-checked")?c.clear():b.forEach(r=>c.add(p(r))),I()});let o=e.querySelector(".p-target-select-all");o&&o.addEventListener("click",()=>{o.classList.contains("p-checked")?n.clear():f.forEach(r=>n.add(p(r))),C()}),e.querySelector(".btn-move-to-target")?.addEventListener("click",()=>{if(c.size===0)return;let t=b.filter(r=>c.has(p(r)));if(f=[...f,...t],b=b.filter(r=>!c.has(p(r))),c.clear(),T(),M(),t.length>0){let r=p(t[0]),i=e.querySelector(`.picklist-target-list .target-item[data-id="${r}"]`);i&&i.scrollIntoView({block:"nearest",behavior:"smooth"})}$("move-to-target",t)}),e.querySelector(".btn-move-all-to-target")?.addEventListener("click",()=>{if(b.length===0)return;let t=[...b];if(f=[...f,...b],b=[],c.clear(),T(),M(),t.length>0){let r=p(t[0]),i=e.querySelector(`.picklist-target-list .target-item[data-id="${r}"]`);i&&i.scrollIntoView({block:"nearest",behavior:"smooth"})}$("move-all-to-target",t)}),e.querySelector(".btn-move-to-source")?.addEventListener("click",()=>{if(n.size===0)return;let t=f.filter(r=>n.has(p(r)));if(b=[...b,...t],f=f.filter(r=>!n.has(p(r))),n.clear(),T(),M(),t.length>0){let r=p(t[0]),i=e.querySelector(`.picklist-source-list .source-item[data-id="${r}"]`);i&&i.scrollIntoView({block:"nearest",behavior:"smooth"})}$("move-to-source",t)}),e.querySelector(".btn-move-all-to-source")?.addEventListener("click",()=>{if(f.length===0)return;let t=[...f];if(b=[...b,...f],f=[],n.clear(),T(),M(),t.length>0){let r=p(t[0]),i=e.querySelector(`.picklist-source-list .source-item[data-id="${r}"]`);i&&i.scrollIntoView({block:"nearest",behavior:"smooth"})}$("move-all-to-source",t)}),e.querySelector(".btn-source-top")?.addEventListener("click",()=>{y(b,c,"top","source")}),e.querySelector(".btn-source-up")?.addEventListener("click",()=>{y(b,c,"up","source")}),e.querySelector(".btn-source-down")?.addEventListener("click",()=>{y(b,c,"down","source")}),e.querySelector(".btn-source-bottom")?.addEventListener("click",()=>{y(b,c,"bottom","source")}),e.querySelector(".btn-target-top")?.addEventListener("click",()=>{y(f,n,"top","target")}),e.querySelector(".btn-target-up")?.addEventListener("click",()=>{y(f,n,"up","target")}),e.querySelector(".btn-target-down")?.addEventListener("click",()=>{y(f,n,"down","target")}),e.querySelector(".btn-target-bottom")?.addEventListener("click",()=>{y(f,n,"bottom","target")})}function y(e,l,a,s){let t=g.firstElementChild?.querySelector(s==="source"?".picklist-source-list":".picklist-target-list");if(!t||l.size===0||e.length<2)return;if(a==="top"){let i=e.filter(d=>l.has(p(d))),k=e.filter(d=>!l.has(p(d)));e.length=0,e.push(...i,...k);let h=[];t.querySelectorAll(`.${s}-item`).forEach(d=>{let v=d.getAttribute("data-id");v&&l.has(v)&&h.push(d)});for(let d=h.length-1;d>=0;d--)t.insertBefore(h[d],t.firstElementChild)}else if(a==="bottom"){let i=e.filter(d=>l.has(p(d))),k=e.filter(d=>!l.has(p(d)));e.length=0,e.push(...k,...i);let h=[];t.querySelectorAll(`.${s}-item`).forEach(d=>{let v=d.getAttribute("data-id");v&&l.has(v)&&h.push(d)}),h.forEach(d=>t.appendChild(d))}else if(a==="up")for(let i=1;i<e.length;i++){let k=p(e[i]),h=p(e[i-1]);if(l.has(k)&&!l.has(h)){let d=e[i];e[i]=e[i-1],e[i-1]=d;let v=t.querySelector(`.${s}-item[data-id="${k}"]`),w=t.querySelector(`.${s}-item[data-id="${h}"]`);v&&w&&t.insertBefore(v,w)}}else if(a==="down")for(let i=e.length-2;i>=0;i--){let k=p(e[i]),h=p(e[i+1]);if(l.has(k)&&!l.has(h)){let d=e[i];e[i]=e[i+1],e[i+1]=d;let v=t.querySelector(`.${s}-item[data-id="${k}"]`),w=t.querySelector(`.${s}-item[data-id="${h}"]`);v&&w&&t.insertBefore(w,v)}}let r=t.querySelector(`.${s}-item.p-highlight`);r&&r.scrollIntoView({block:"nearest",behavior:"smooth"}),q(),$("reorder")}function U(){g.dispatchEvent(new CustomEvent("picklist:selection-change",{bubbles:!0,detail:{sourceSelection:Array.from(c),targetSelection:Array.from(n)}}))}function $(e="change",l=[]){if(u.targetInputName){let a=g.querySelector(`input[name="${u.targetInputName}"]`);a||(a=document.createElement("input"),a.type="hidden",a.name=u.targetInputName,g.appendChild(a)),a.value=JSON.stringify(f.map(s=>p(s)))}g.dispatchEvent(new CustomEvent("picklist:change",{bubbles:!0,detail:{source:b,target:f,action:e,affectedItems:l}}))}J(),$()}export{G as default};
