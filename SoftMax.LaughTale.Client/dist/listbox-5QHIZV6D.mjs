import{a as C}from"./chunk-WCJSCUNY.mjs";import{a as w}from"./chunk-P6B5FGGY.mjs";import{e as $}from"./chunk-3YU53HBK.mjs";var B=`
/* ==================== AURA LISTBOX ==================== */
.laughtale-listbox,
.p-listbox {
    display: inline-flex;
    flex-direction: column;
    background: var(--p-surface-0);
    color: var(--p-text-color);
    border: 1px solid var(--p-border-color);
    border-radius: var(--p-border-radius);
    font-family: var(--p-font-family, inherit);
    box-sizing: border-box;
    overflow: hidden;
    outline: none;
    transition: background 150ms ease, border-color 150ms ease, box-shadow 150ms ease;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.02);
    width: 100%;
    max-width: 280px;
}

.p-listbox.p-listbox-fluid {
    width: 100%;
    max-width: 100%;
}

.p-listbox.is-focused,
.p-listbox:focus-within {
    border-color: var(--p-primary-500) !important;
}

/* Filled Variant */
.p-listbox.variant-filled {
    background-color: var(--p-surface-100);
    border-color: transparent;
}
.p-listbox.variant-filled.is-focused {
    background-color: var(--p-surface-0);
    border-color: var(--p-primary-500) !important;
}

/* Sizes */
.p-listbox.size-small,
.p-listbox.p-listbox-sm {
    font-size: 0.75rem;
}
.p-listbox.size-small .p-listbox-option {
    padding: 0.3125rem 0.5rem;
}
.p-listbox.size-large,
.p-listbox.p-listbox-lg {
    font-size: 1rem;
}
.p-listbox.size-large .p-listbox-option {
    padding: 0.625rem 1rem;
}

/* Invalid State */
.p-listbox.is-invalid {
    border-color: var(--p-red-500, #ef4444) !important;
}

/* Disabled State */
.p-listbox.is-disabled {
    opacity: 0.65;
    cursor: not-allowed;
    background-color: var(--p-surface-100);
}
.p-listbox.is-disabled .p-listbox-option {
    cursor: not-allowed;
    pointer-events: none;
}

/* Header & Footer */
.p-listbox-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.625rem 0.875rem;
    background: var(--p-surface-50);
    border-bottom: 1px solid var(--p-border-color);
    font-size: 0.8125rem;
    font-weight: 700;
    color: var(--p-text-color);
}
.p-listbox-header-count {
    font-size: 0.75rem;
    font-weight: 500;
    color: var(--p-text-muted);
}
.p-listbox-footer {
    padding: 0.5rem 0.875rem;
    background: var(--p-surface-50);
    border-top: 1px solid var(--p-border-color);
    font-size: 0.75rem;
    color: var(--p-text-muted);
}

/* Filter */
.p-listbox-filter-container {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 0.75rem;
    background: var(--p-surface-50);
    border-bottom: 1px solid var(--p-border-color);
}
.p-listbox-filter-input {
    flex: 1;
    width: 100%;
    font-family: inherit;
    font-size: 0.8125rem;
    padding: 0.3125rem 0.5rem;
    background: var(--p-surface-0);
    border: 1px solid var(--p-border-color);
    border-radius: calc(var(--p-border-radius) - 2px);
    color: var(--p-text-color);
    outline: none;
    box-sizing: border-box;
}
.p-listbox-filter-input:focus {
    border-color: var(--p-primary-500);
}

/* Options List Container */
.p-listbox-list-wrapper {
    overflow-y: auto;
    outline: none;
}
.p-listbox-list {
    margin: 0;
    padding: 0.25rem 0;
    list-style: none;
}

/* Option Groups */
.p-listbox-option-group {
    list-style: none;
    margin: 0;
    padding: 0;
}
.p-listbox-option-group-label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 0.875rem;
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--p-text-muted);
    background: var(--p-surface-50);
}

/* Option Items */
.p-listbox-option {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.5rem 0.875rem;
    cursor: pointer;
    font-size: 0.8125rem;
    color: var(--p-text-color);
    background: transparent;
    transition: background 150ms ease, color 150ms ease;
    user-select: none;
    outline: none;
}

.p-listbox-option:hover:not(.p-disabled) {
    background: var(--p-surface-100);
    color: var(--p-text-color);
}

.p-listbox-option.p-highlight {
    background: var(--p-primary-50, #ecfdf5);
    color: var(--p-primary-700, #047857);
    font-weight: 600;
}
.p-listbox-option.p-highlight:hover:not(.p-disabled) {
    background: var(--p-primary-100, #d1fae5);
    color: var(--p-primary-800, #065f46);
}

.p-listbox-option.p-highlight-none {
    background: transparent !important;
    color: var(--p-text-color) !important;
    font-weight: normal !important;
}
.p-listbox-option.p-highlight-none:hover:not(.p-disabled) {
    background: var(--p-surface-100) !important;
}

.p-listbox-option.p-focus {
    box-shadow: inset 0 0 0 1px var(--p-primary-500);
}

.p-listbox-option.p-disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

/* Striped Listbox */
.p-listbox-striped .p-listbox-option:nth-child(even):not(.p-highlight) {
    background: var(--p-surface-50);
}

/* Option Content */
.p-listbox-option-content {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.p-listbox-option-badge {
    font-size: 0.6875rem;
    font-weight: 700;
    padding: 0.125rem 0.375rem;
    border-radius: calc(var(--p-border-radius) - 2px);
    background: var(--p-surface-100);
    color: var(--p-surface-700);
}
.p-listbox-option.p-highlight .p-listbox-option-badge {
    background: var(--p-primary-100);
    color: var(--p-primary-800);
}

/* Option Checkbox */
.p-listbox-option-checkbox {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 1.125rem;
    height: 1.125rem;
    border: 1px solid var(--p-border-color);
    border-radius: 4px;
    background: var(--p-surface-0);
    margin-right: 0.5rem;
    transition: all 150ms ease;
    flex-shrink: 0;
}
.p-listbox-option.p-highlight .p-listbox-option-checkbox {
    background: var(--p-primary-500);
    border-color: var(--p-primary-500);
    color: #ffffff;
}

/* Option Checkmark Icon */
.p-listbox-option-checkmark {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: var(--p-primary-600);
    margin-left: 0.5rem;
    flex-shrink: 0;
}

/* ==================== DARK MODE ==================== */
.dark .p-listbox {
    background: var(--p-surface-900);
    color: var(--p-surface-0);
    border-color: var(--p-surface-700);
}
.dark .p-listbox.variant-filled {
    background-color: var(--p-surface-800);
}
.dark .p-listbox.variant-filled.is-focused {
    background-color: var(--p-surface-900);
}
.dark .p-listbox-header,
.dark .p-listbox-footer,
.dark .p-listbox-filter-container,
.dark .p-listbox-option-group-label {
    background: var(--p-surface-850, #141b26);
    border-color: var(--p-surface-700);
}
.dark .p-listbox-filter-input {
    background: var(--p-surface-900);
    border-color: var(--p-surface-700);
    color: var(--p-surface-0);
}
.dark .p-listbox-option {
    color: var(--p-surface-100);
}
.dark .p-listbox-option:hover:not(.p-disabled) {
    background: var(--p-surface-800);
    color: var(--p-surface-0);
}
.dark .p-listbox-option.p-highlight {
    background: rgba(16, 185, 129, 0.16);
    color: var(--p-primary-300, #6ee7b7);
}
.dark .p-listbox-option.p-highlight:hover:not(.p-disabled) {
    background: rgba(16, 185, 129, 0.24);
    color: var(--p-primary-200, #a7f3d0);
}
.dark .p-listbox-option-badge {
    background: var(--p-surface-800);
    color: var(--p-surface-200);
}
.dark .p-listbox-option.p-highlight .p-listbox-option-badge {
    background: rgba(16, 185, 129, 0.25);
    color: var(--p-primary-200);
}
.dark .p-listbox-option-checkbox {
    background: var(--p-surface-900);
    border-color: var(--p-surface-600);
}
.dark .p-listbox-option-checkmark {
    color: var(--p-primary-400);
}
.dark .p-listbox-striped .p-listbox-option:nth-child(even):not(.p-highlight) {
    background: var(--p-surface-850, #141b26);
}
`,E='<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',W='<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>';function G(a,o){$("laughtale-listbox",B);let c=o.multiple===!0||String(o.multiple)==="true",H=o.metaKeySelection!==!1&&String(o.metaKeySelection)!=="false",L=o.checkbox===!0||String(o.checkbox)==="true",z=o.checkmark===!0||String(o.checkmark)==="true",M=o.highlightOnSelect!==!1&&String(o.highlightOnSelect)!=="false",A=o.filter===!0||String(o.filter)==="true",T=o.fluid===!0||String(o.fluid)==="true",F=o.invalid===!0||String(o.invalid)==="true",f=o.disabled===!0||String(o.disabled)==="true",D=o.striped===!0||String(o.striped)==="true",V=o.variant==="filled",S=o.size||"normal",j=o.scrollHeight||"220px";function O(t){return(t||[]).map(e=>typeof e=="string"?{label:e,value:e}:{label:e.label||e.name||String(e.value||""),value:e.value!==void 0?e.value:e.code||e.name||e.label,code:e.code,name:e.name,icon:e.icon,flag:e.flag,badge:e.badge,description:e.description,disabled:e.disabled,items:e.items?O(e.items):void 0})}let x=O(o.options||[]),n=new Set,d=o.value??o.selectedValue;if(d!=null)if(Array.isArray(d))d.forEach(t=>n.add(String(typeof t=="object"&&t!==null?t.value||t.code||t.name:t)));else if(typeof d=="string")try{let t=JSON.parse(d);Array.isArray(t)?t.forEach(e=>n.add(String(e))):n.add(d)}catch{n.add(d)}else n.add(String(d));let k="",p=-1;function P(){let t=[],e=k.toLowerCase().trim();function i(r){return e?o.filterMatchMode==="startsWith"?!!(r.label.toLowerCase().startsWith(e)||r.code&&r.code.toLowerCase().startsWith(e)):!!(r.label.toLowerCase().includes(e)||r.code&&r.code.toLowerCase().includes(e)):!0}for(let r of x)if(r.items&&r.items.length>0){let l=r.items.filter(i);l.length>0&&t.push(...l)}else i(r)&&t.push(r);return t}function K(){let t=["laughtale-listbox","p-listbox",T?"p-listbox-fluid":"",V?"variant-filled":"",D?"p-listbox-striped":"",S!=="normal"?`size-${S}`:"",F?"is-invalid":"",f?"is-disabled":""].filter(Boolean).join(" ");a.className=t,a.setAttribute("tabindex",f?"-1":"0"),a.setAttribute("role","listbox"),a.setAttribute("aria-multiselectable",c?"true":"false"),o.inputId&&(a.id=o.inputId),a.innerHTML=`
            ${o.header?`
                <div class="p-listbox-header">
                    <span>${o.header}</span>
                    ${o.headerCount?`<span class="p-listbox-header-count">${o.headerCount}</span>`:""}
                </div>
            `:""}
            ${A?`
                <div class="p-listbox-filter-container">
                    <span style="color: var(--p-surface-400); display: flex;">${W}</span>
                    <input type="text" class="p-listbox-filter-input" placeholder="${o.filterPlaceholder||"Filter..."}" ${f?"disabled":""} />
                </div>
            `:""}
            <div class="p-listbox-list-wrapper" style="max-height: ${j};">
                <ul class="p-listbox-list" role="presentation"></ul>
            </div>
            ${o.footer?`
                <div class="p-listbox-footer">${o.footer}</div>
            `:""}
            <input type="hidden" name="${o.name||o.targetInputName||"listbox_value"}" value="" />
        `,m(),N(),y()}function m(){let t=a.querySelector(".p-listbox-list"),e=k.toLowerCase().trim();function i(l){return e?o.filterMatchMode==="startsWith"?!!(l.label.toLowerCase().startsWith(e)||l.code&&l.code.toLowerCase().startsWith(e)):!!(l.label.toLowerCase().includes(e)||l.code&&l.code.toLowerCase().includes(e)):!0}if(x.some(l=>l.items&&l.items.length>0)){let l="",b=0;for(let s of x){let u=s.items?s.items.filter(i):[];u.length===0&&!i(s)||(l+=`
                    <li class="p-listbox-option-group" role="group">
                        <div class="p-listbox-option-group-label">
                            ${s.flag?`<span style="font-size: 1.1rem; line-height: 1;">${s.flag}</span>`:""}
                            ${s.icon?`<span style="display: flex;">${w(s.icon,14)}</span>`:""}
                            <span>${s.label}</span>
                        </div>
                        <ul style="margin: 0; padding: 0; list-style: none;">
                            ${u.map(h=>I(h)).join("")}
                        </ul>
                    </li>
                `,b+=u.length)}b===0?t.innerHTML='<li style="padding: 1rem; text-align: center; color: var(--p-text-muted); font-size: 0.8125rem;">No results found</li>':t.innerHTML=l}else{let l=x.filter(i);l.length===0?t.innerHTML='<li style="padding: 1rem; text-align: center; color: var(--p-text-muted); font-size: 0.8125rem;">No results found</li>':t.innerHTML=l.map(b=>I(b)).join("")}q()}function I(t){let e=String(t.value),i=n.has(e),r=i?M?"p-highlight":"p-highlight-none":"",l=t.disabled?"p-disabled":"",b="";L&&c&&(b=`
                <span class="p-listbox-option-checkbox" aria-hidden="true">
                    ${i?E:""}
                </span>
            `);let s="";z&&i&&(s=`
                <span class="p-listbox-option-checkmark" aria-hidden="true">
                    ${E}
                </span>
            `);let u="";t.flag?u=`<span style="font-size: 1.1rem; line-height: 1; flex-shrink: 0;">${t.flag}</span>`:t.icon&&(u=`<span style="display: flex; flex-shrink: 0; color: var(--p-primary-600);">${w(t.icon,16)}</span>`);let h="";return t.code?h=`<span class="p-listbox-option-badge">${t.code}</span>`:t.badge&&(h=`<span class="p-listbox-option-badge">${t.badge}</span>`),`
            <li class="p-listbox-option ${r} ${l}" role="option" aria-selected="${i}" aria-disabled="${t.disabled?"true":"false"}" data-val="${e}" tabindex="-1">
                <div class="p-listbox-option-content">
                    ${b}
                    ${u}
                    <span>${t.label}</span>
                </div>
                ${h}
                ${s}
            </li>
        `}function q(){a.querySelectorAll(".p-listbox-option").forEach((e,i)=>{e.addEventListener("click",r=>{if(f||e.classList.contains("p-disabled"))return;let l=e.getAttribute("data-val");v(l,r)}),o.focusOnHover&&e.addEventListener("mouseenter",()=>{!f&&!e.classList.contains("p-disabled")&&g(i)})})}function v(t,e){let i=e&&(e.ctrlKey||e.metaKey);c?H&&!i&&!L?(n.clear(),n.add(t)):n.has(t)?n.delete(t):n.add(t):(n.clear(),n.add(t)),m(),y()}function g(t){a.querySelectorAll(".p-listbox-option").forEach((i,r)=>{r===t?i.classList.add("p-focus"):i.classList.remove("p-focus")}),p=t}function N(){let t=a.querySelector(".p-listbox-filter-input");if(t){let e=C(()=>{k=t.value,m()},150);t.addEventListener("input",()=>e())}a.addEventListener("focus",()=>{a.classList.add("is-focused"),o.autoOptionFocus!==!1&&p===-1&&g(0)}),a.addEventListener("blur",e=>{a.contains(e.relatedTarget)||(a.classList.remove("is-focused"),a.querySelectorAll(".p-listbox-option").forEach(r=>r.classList.remove("p-focus")))}),a.addEventListener("keydown",e=>{if(f)return;let i=a.querySelectorAll(".p-listbox-option");if(i.length!==0)if(e.key==="ArrowDown"){e.preventDefault();let r=Math.min(p+1,i.length-1);if(g(r),i[r]?.scrollIntoView({block:"nearest"}),o.selectOnFocus&&!c){let l=i[r]?.getAttribute("data-val");v(l,e)}}else if(e.key==="ArrowUp"){e.preventDefault();let r=Math.max(p-1,0);if(g(r),i[r]?.scrollIntoView({block:"nearest"}),o.selectOnFocus&&!c){let l=i[r]?.getAttribute("data-val");v(l,e)}}else if(e.key==="Home")e.preventDefault(),g(0),i[0]?.scrollIntoView({block:"nearest"});else if(e.key==="End")e.preventDefault(),g(i.length-1),i[i.length-1]?.scrollIntoView({block:"nearest"});else if(e.key===" "||e.key==="Enter"){if(p>=0&&p<i.length){e.preventDefault();let r=i[p]?.getAttribute("data-val");v(r,e)}}else e.key==="a"&&(e.ctrlKey||e.metaKey)&&c&&(e.preventDefault(),i.forEach(r=>{let l=r.getAttribute("data-val");n.add(l)}),m(),y())})}function y(){let t=a.querySelector(`input[name="${o.name||o.targetInputName||"listbox_value"}"]`),e=Array.from(n),i=c?e:e[0]||null;t&&(t.value=c?JSON.stringify(e):e[0]||""),a.dispatchEvent(new CustomEvent("listbox:change",{bubbles:!0,detail:{value:i,selectedValues:e}})),a.dispatchEvent(new CustomEvent("change",{bubbles:!0,detail:{value:i}}))}K()}export{G as default};
