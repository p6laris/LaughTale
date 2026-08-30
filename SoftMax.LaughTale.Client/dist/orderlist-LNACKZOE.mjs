import{b as m}from"./chunk-P6B5FGGY.mjs";import{e as S}from"./chunk-3YU53HBK.mjs";var U=`
.p-orderlist {
    display: flex;
    align-items: flex-start;
    gap: 1.25rem;
    width: 100%;
    font-family: var(--p-font-family, inherit);
    color: var(--p-surface-800, #1e293b);
}

.p-orderlist-controls {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    gap: 0.5rem;
    flex-shrink: 0;
    padding-top: 0.5rem;
}

.p-orderlist-control-btn {
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
.p-orderlist-control-btn:hover:not(:disabled) {
    background: var(--p-surface-100, #f1f5f9);
    color: var(--p-surface-900, #0f172a);
    border-color: var(--p-surface-400, #94a3b8);
}
.p-orderlist-control-btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
}

.p-orderlist-list-container {
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

.p-orderlist-header {
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

.p-orderlist-filter-container {
    padding: 0.5rem 0.75rem;
    background: var(--p-surface-50, #f8fafc);
    border-bottom: 1px solid var(--p-surface-200, #e2e8f0);
    position: relative;
    display: flex;
    align-items: center;
}
.p-orderlist-filter-input {
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
.p-orderlist-filter-input:focus {
    border-color: var(--p-primary-500, #10b981);
    box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.2);
}
.p-orderlist-filter-icon {
    position: absolute;
    right: 1.25rem;
    color: var(--p-surface-400, #94a3b8);
    pointer-events: none;
    display: flex;
    align-items: center;
}

.p-orderlist-list {
    list-style: none;
    margin: 0;
    padding: 0.25rem 0;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
}

.p-orderlist-item {
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
.p-orderlist-item:hover:not(.p-highlight) {
    background: var(--p-surface-100, #f1f5f9);
    color: var(--p-surface-900, #0f172a);
}
.p-orderlist-item.p-highlight {
    background: rgba(16, 185, 129, 0.1) !important;
    color: var(--p-primary-700, #047857) !important;
    font-weight: 600;
}

/* Checkbox */
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

/* Product Item Content */
.p-orderlist-product-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    width: 100%;
}
.p-orderlist-product-img {
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 6px;
    background: var(--p-surface-100, #f1f5f9);
    border: 1px solid var(--p-surface-200, #e2e8f0);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--p-primary-600, #059669);
    flex-shrink: 0;
}
.p-orderlist-product-details {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
    min-width: 0;
}
.p-orderlist-product-name {
    font-weight: 600;
    font-size: 0.875rem;
    color: var(--p-surface-900, #0f172a);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
.p-orderlist-product-category {
    font-size: 0.75rem;
    color: var(--p-surface-500, #64748b);
}
.p-orderlist-product-price {
    font-weight: 700;
    font-size: 0.875rem;
    color: var(--p-surface-900, #0f172a);
}

/* Numbered Digits */
.p-orderlist-index {
    font-variant-numeric: tabular-nums;
    font-size: 0.8125rem;
    font-weight: 600;
    color: var(--p-surface-400, #94a3b8);
    width: 1.5rem;
    text-align: right;
    flex-shrink: 0;
}

/* Footer / Status Bar */
.p-orderlist-footer {
    padding: 0.5rem 1rem;
    background: var(--p-surface-50, #f8fafc);
    border-top: 1px solid var(--p-surface-200, #e2e8f0);
    font-size: 0.75rem;
    color: var(--p-surface-500, #64748b);
    display: flex;
    align-items: center;
    justify-content: space-between;
}

/* Empty State */
.p-orderlist-empty {
    padding: 2.5rem 1rem;
    text-align: center;
    color: var(--p-surface-400, #94a3b8);
    font-size: 0.8125rem;
    font-style: italic;
}

/* Dark Mode Tokens */
.dark .p-orderlist,
[data-theme="dark"] .p-orderlist {
    color: var(--p-surface-100, #f1f5f9) !important;
}
.dark .p-orderlist-list-container,
[data-theme="dark"] .p-orderlist-list-container {
    background: var(--p-surface-900, #0f172a) !important;
    border-color: var(--p-surface-700, #334155) !important;
}
.dark .p-orderlist-header,
.dark .p-orderlist-filter-container,
.dark .p-orderlist-footer,
[data-theme="dark"] .p-orderlist-header,
[data-theme="dark"] .p-orderlist-filter-container,
[data-theme="dark"] .p-orderlist-footer {
    background: var(--p-surface-800, #1e293b) !important;
    border-color: var(--p-surface-700, #334155) !important;
    color: var(--p-surface-100, #f1f5f9) !important;
}
.dark .p-orderlist-filter-input,
[data-theme="dark"] .p-orderlist-filter-input {
    background: var(--p-surface-900, #0f172a) !important;
    border-color: var(--p-surface-600, #475569) !important;
    color: #ffffff !important;
}
.dark .p-orderlist-control-btn,
[data-theme="dark"] .p-orderlist-control-btn {
    background: var(--p-surface-800, #1e293b) !important;
    border-color: var(--p-surface-600, #475569) !important;
    color: var(--p-surface-200, #e2e8f0) !important;
}
.dark .p-orderlist-control-btn:hover:not(:disabled),
[data-theme="dark"] .p-orderlist-control-btn:hover:not(:disabled) {
    background: var(--p-surface-700, #334155) !important;
    color: #ffffff !important;
}
.dark .p-orderlist-item:hover:not(.p-highlight),
[data-theme="dark"] .p-orderlist-item:hover:not(.p-highlight) {
    background: var(--p-surface-800, #1e293b) !important;
    color: #ffffff !important;
}
.dark .p-orderlist-product-name,
.dark .p-orderlist-product-price,
[data-theme="dark"] .p-orderlist-product-name,
[data-theme="dark"] .p-orderlist-product-price {
    color: var(--p-surface-100, #f1f5f9) !important;
}
.dark .p-orderlist-product-img,
[data-theme="dark"] .p-orderlist-product-img {
    background: var(--p-surface-800, #1e293b) !important;
    border-color: var(--p-surface-700, #334155) !important;
}
`;function D(u,p){S("orderlist",U);let l=[...p.value?[...p.value]:p.items?[...p.items]:[]],T=p.dataKey||"id",y=!!p.checkbox,x=!!p.filter,M=p.filterBy||p.filterFields&&p.filterFields[0]||"name",H=p.filterPlaceholder||"Filter by name",I=p.scrollHeight||"20rem",$=p.emptyMessage||"No available options",n=new Set,h="";function f(e,d){let r=e[T]||e.id||e.title||e.name;return r!=null?String(r):String(d)}function k(e){return e.title||e.name||""}function q(e,d,r){let o=y?`
            <div class="p-checkbox-box ${r?"p-checked":""}" role="checkbox" aria-checked="${r}">
                ${r?m.check:""}
            </div>
        `:"";return e.price!=null||e.category!=null||e.image!=null?`
                ${o}
                <div class="p-orderlist-product-item">
                    <div class="p-orderlist-product-img">
                        ${m.package}
                    </div>
                    <div class="p-orderlist-product-details">
                        <span class="p-orderlist-product-name">${k(e)}</span>
                        <span class="p-orderlist-product-category">${e.category||""}</span>
                    </div>
                    ${e.price!=null?`<span class="p-orderlist-product-price">$${e.price}</span>`:""}
                </div>
            `:`
            ${o}
            <span class="p-orderlist-index">${d+1}</span>
            <span style="flex: 1; font-weight: ${r?"600":"normal"}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                ${k(e)}
            </span>
        `}function C(){let e=p.header?`
            <div class="p-orderlist-header">
                <span>${p.header}</span>
            </div>
        `:"",d=x?`
            <div class="p-orderlist-filter-container">
                <input type="text" class="p-orderlist-filter-input" placeholder="${H}" />
                <span class="p-orderlist-filter-icon">${m.search}</span>
            </div>
        `:"";u.innerHTML=`
            <div class="p-orderlist p-component">
                <!-- Reorder Action Buttons (Left) -->
                <div class="p-orderlist-controls">
                    <button type="button" class="p-orderlist-control-btn btn-order-top" title="Move to Top" aria-label="Move to Top" disabled>
                        ${m.chevronsUp}
                    </button>
                    <button type="button" class="p-orderlist-control-btn btn-order-up" title="Move Up" aria-label="Move Up" disabled>
                        ${m.chevronUp}
                    </button>
                    <button type="button" class="p-orderlist-control-btn btn-order-down" title="Move Down" aria-label="Move Down" disabled>
                        ${m.chevronDown}
                    </button>
                    <button type="button" class="p-orderlist-control-btn btn-order-bottom" title="Move to Bottom" aria-label="Move to Bottom" disabled>
                        ${m.chevronsDown}
                    </button>
                </div>

                <!-- List Box (Right) -->
                <div class="p-orderlist-list-container">
                    ${e}
                    ${d}
                    <ul class="p-orderlist-list" style="height: ${I};" role="listbox" aria-multiselectable="true" tabindex="0">
                    </ul>
                    <div class="p-orderlist-footer">
                        <span class="p-orderlist-selection-status">No selected item</span>
                        ${x?'<span class="p-orderlist-results-status" style="font-size: 0.6875rem; color: var(--p-surface-400);">0 results available</span>':""}
                    </div>
                </div>
            </div>
        `,B(),E()}function g(){let e=u.firstElementChild;if(!e)return;let d=e.querySelector(".p-orderlist-selection-status");d&&(d.textContent=n.size>0?`${n.size} items selected`:"No selected item");let r=e.querySelector(".p-orderlist-list");r&&r.querySelectorAll(".p-orderlist-item").forEach(o=>{let t=o.getAttribute("data-id");if(!t)return;let s=n.has(t);if(o.classList.toggle("p-highlight",s),o.setAttribute("aria-selected",String(s)),y){let i=o.querySelector(".p-checkbox-box");i&&(i.className=`p-checkbox-box ${s?"p-checked":""}`,i.setAttribute("aria-checked",String(s)),i.innerHTML=s?m.check:"")}}),L(),z()}function E(){let e=u.firstElementChild;if(!e)return;let d=l.filter((t,s)=>!x||!h.trim()?!0:String(t[M]||t.title||t.name||"").toLowerCase().includes(h.toLowerCase())),r=e.querySelector(".p-orderlist-results-status");r&&(r.textContent=`${d.length} results are available`);let o=e.querySelector(".p-orderlist-list");o&&(d.length===0?o.innerHTML=`<li class="p-orderlist-empty">${h?"No results found":$}</li>`:(o.innerHTML=d.map((t,s)=>{let i=f(t,s),a=n.has(i);return`
                        <li class="p-orderlist-item ${a?"p-highlight":""}" 
                            data-id="${i}" 
                            data-index="${s}"
                            role="option" 
                            aria-selected="${a}">
                            ${q(t,s,a)}
                        </li>
                    `}).join(""),o.querySelectorAll(".p-orderlist-item").forEach(t=>{t.addEventListener("click",s=>{let i=t.getAttribute("data-id");if(!i)return;let a=s;y||a.ctrlKey||a.metaKey?n.has(i)?n.delete(i):n.add(i):n.has(i)&&n.size===1?n.clear():(n.clear(),n.add(i)),g()})}))),g()}function L(){let e=u.firstElementChild;if(!e)return;let d=e.querySelector(".btn-order-top"),r=e.querySelector(".btn-order-up"),o=e.querySelector(".btn-order-down"),t=e.querySelector(".btn-order-bottom"),s=n.size>0&&l.length>1;d&&(d.disabled=!s),r&&(r.disabled=!s),o&&(o.disabled=!s),t&&(t.disabled=!s)}function B(){let e=u.firstElementChild;if(!e)return;let d=e.querySelector(".p-orderlist-filter-input");d&&d.addEventListener("input",o=>{h=o.target.value,E()}),e.querySelector(".btn-order-top")?.addEventListener("click",()=>{v("top")}),e.querySelector(".btn-order-up")?.addEventListener("click",()=>{v("up")}),e.querySelector(".btn-order-down")?.addEventListener("click",()=>{v("down")}),e.querySelector(".btn-order-bottom")?.addEventListener("click",()=>{v("bottom")});let r=e.querySelector(".p-orderlist-list");r&&r.addEventListener("keydown",o=>{o.key==="ArrowDown"||o.key==="ArrowUp"?(o.preventDefault(),A(o.key==="ArrowDown"?1:-1,o.shiftKey)):o.key===" "||o.key==="Enter"?o.preventDefault():o.key==="a"&&(o.ctrlKey||o.metaKey)&&(o.preventDefault(),l.forEach((t,s)=>n.add(f(t,s))),g())})}function A(e,d){if(l.length===0)return;let r=l.findIndex((a,c)=>n.has(f(a,c)));r===-1&&(r=e>0?-1:l.length);let o=Math.max(0,Math.min(l.length-1,r+e)),t=f(l[o],o);d||n.clear(),n.add(t),g();let i=u.firstElementChild?.querySelector(`.p-orderlist-item[data-id="${t}"]`);i&&i.scrollIntoView({block:"nearest",behavior:"smooth"})}function v(e){let r=u.firstElementChild?.querySelector(".p-orderlist-list");if(!r||n.size===0||l.length<2)return;if(e==="top"){let t=l.filter((a,c)=>n.has(f(a,c))),s=l.filter((a,c)=>!n.has(f(a,c)));l.length=0,l.push(...t,...s);let i=[];r.querySelectorAll(".p-orderlist-item").forEach(a=>{let c=a.getAttribute("data-id");c&&n.has(c)&&i.push(a)});for(let a=i.length-1;a>=0;a--)r.insertBefore(i[a],r.firstElementChild)}else if(e==="bottom"){let t=l.filter((a,c)=>n.has(f(a,c))),s=l.filter((a,c)=>!n.has(f(a,c)));l.length=0,l.push(...s,...t);let i=[];r.querySelectorAll(".p-orderlist-item").forEach(a=>{let c=a.getAttribute("data-id");c&&n.has(c)&&i.push(a)}),i.forEach(a=>r.appendChild(a))}else if(e==="up")for(let t=1;t<l.length;t++){let s=f(l[t],t),i=f(l[t-1],t-1);if(n.has(s)&&!n.has(i)){let a=l[t];l[t]=l[t-1],l[t-1]=a;let c=r.querySelector(`.p-orderlist-item[data-id="${s}"]`),b=r.querySelector(`.p-orderlist-item[data-id="${i}"]`);c&&b&&r.insertBefore(c,b)}}else if(e==="down")for(let t=l.length-2;t>=0;t--){let s=f(l[t],t),i=f(l[t+1],t+1);if(n.has(s)&&!n.has(i)){let a=l[t];l[t]=l[t+1],l[t+1]=a;let c=r.querySelector(`.p-orderlist-item[data-id="${s}"]`),b=r.querySelector(`.p-orderlist-item[data-id="${i}"]`);c&&b&&r.insertBefore(b,c)}}r.querySelectorAll(".p-orderlist-item").forEach((t,s)=>{let i=t.querySelector(".p-orderlist-index");i&&(i.textContent=String(s+1))});let o=r.querySelector(".p-orderlist-item.p-highlight");o&&o.scrollIntoView({block:"nearest",behavior:"smooth"}),L(),w("reorder")}function z(){u.dispatchEvent(new CustomEvent("orderlist:selection-change",{bubbles:!0,detail:{selection:Array.from(n)}}))}function w(e="change"){if(p.targetInputName){let d=u.querySelector(`input[name="${p.targetInputName}"]`);d||(d=document.createElement("input"),d.type="hidden",d.name=p.targetInputName,u.appendChild(d)),d.value=JSON.stringify(l.map((r,o)=>f(r,o)))}u.dispatchEvent(new CustomEvent("orderlist:change",{bubbles:!0,detail:{value:l,action:e}}))}C(),w()}export{D as default};
