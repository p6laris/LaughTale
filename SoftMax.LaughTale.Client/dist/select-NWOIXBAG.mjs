import{a as p}from"./chunk-P6B5FGGY.mjs";import{e as H}from"./chunk-3YU53HBK.mjs";var W=`
/* ==================== AURA SELECT ==================== */
.laughtale-select,
.p-select {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: space-between;
    min-height: 2.5rem;
    padding: 0.375rem 0.75rem;
    background: var(--p-surface-0);
    border: 1px solid var(--p-border-color);
    border-radius: var(--p-border-radius);
    color: var(--p-text-color);
    font-family: var(--p-font-family, inherit);
    font-size: 0.875rem;
    line-height: 1.25;
    cursor: pointer;
    user-select: none;
    outline: none;
    box-sizing: border-box;
    transition: background 150ms ease, border-color 150ms ease, box-shadow 150ms ease, color 150ms ease;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.02);
    gap: 0.5rem;
}

.p-select.p-select-fluid {
    width: 100%;
}

.p-select:hover:not(.is-disabled):not([readonly]) {
    border-color: var(--p-surface-400);
}

.p-select.is-open,
.p-select:focus-visible {
    border-color: var(--p-primary-500) !important;
    box-shadow: 0 0 0 1px var(--p-primary-500) !important;
}

/* Filled Variant */
.p-select.variant-filled {
    background-color: var(--p-surface-100);
    border-color: transparent;
}
.p-select.variant-filled:hover:not(.is-disabled):not([readonly]) {
    background-color: var(--p-surface-200);
}
.p-select.variant-filled.is-open,
.p-select.variant-filled:focus-visible {
    background-color: var(--p-surface-0);
    border-color: var(--p-primary-500) !important;
}

/* Sizes */
.p-select.size-small,
.p-select.p-select-sm {
    min-height: 2rem;
    padding: 0.25rem 0.5rem;
    font-size: 0.75rem;
}
.p-select.size-large,
.p-select.p-select-lg {
    min-height: 3rem;
    padding: 0.5rem 1rem;
    font-size: 1.0625rem;
}

/* Invalid State */
.p-select.is-invalid {
    border-color: var(--p-red-500, #ef4444) !important;
}
.p-select.is-invalid:focus-visible,
.p-select.is-invalid.is-open {
    box-shadow: 0 0 0 1px var(--p-red-500, #ef4444) !important;
}

/* Disabled State */
.p-select.is-disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background-color: var(--p-surface-100);
}

/* Select Trigger Content */
.p-select-label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: var(--p-text-color);
}
.p-select-label.p-placeholder {
    color: var(--p-text-muted);
}

.p-select-editable-input {
    flex: 1;
    border: none;
    background: transparent;
    outline: none;
    font-family: inherit;
    font-size: inherit;
    color: inherit;
    padding: 0;
    margin: 0;
}

/* Trigger Actions */
.p-select-actions {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    flex-shrink: 0;
}

.p-select-clear-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: var(--p-text-muted);
    cursor: pointer;
    padding: 2px;
    border-radius: 50%;
    transition: color 150ms ease, background 150ms ease;
}
.p-select-clear-icon:hover {
    color: var(--p-text-color);
    background: var(--p-surface-200);
}

.p-select-dropdown {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: var(--p-text-muted);
    transition: transform 200ms cubic-bezier(0.16, 1, 0.3, 1), color 150ms ease;
}
.p-select.is-open .p-select-dropdown {
    transform: rotate(180deg);
    color: var(--p-primary-500);
}

/* Chips in Trigger */
.p-select-chips-wrap {
    display: flex;
    flex-wrap: wrap;
    gap: 0.25rem;
    align-items: center;
}
.p-select-chip {
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
    padding: 0.125rem 0.5rem;
    background: var(--p-surface-100);
    border-radius: calc(var(--p-border-radius) - 2px);
    font-size: 0.75rem;
    color: var(--p-surface-700);
}
.p-select-chip-remove {
    cursor: pointer;
    color: var(--p-text-muted);
    display: flex;
}
.p-select-chip-remove:hover {
    color: var(--p-text-color);
}

/* ==================== SELECT OVERLAY ==================== */
.p-select-overlay {
    position: absolute;
    top: calc(100% + 4px);
    left: 0;
    min-width: 100%;
    width: max-content;
    max-width: 24rem;
    background: var(--p-surface-0);
    border: 1px solid var(--p-border-color);
    border-radius: var(--p-border-radius);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1);
    z-index: 1100;
    overflow: hidden;
    opacity: 0;
    transform: scale(0.95) translateY(-4px);
    pointer-events: none;
    transition: opacity 150ms cubic-bezier(0.16, 1, 0.3, 1), transform 150ms cubic-bezier(0.16, 1, 0.3, 1);
    box-sizing: border-box;
}

.p-select-overlay.is-visible {
    opacity: 1;
    transform: scale(1) translateY(0);
    pointer-events: auto;
}

/* Filter Bar */
.p-select-filter-container {
    position: relative;
    padding: 0.5rem;
    border-bottom: 1px solid var(--p-border-color);
    background: var(--p-surface-0);
}
.p-select-filter-input {
    width: 100%;
    padding: 0.375rem 0.625rem 0.375rem 2rem;
    background: var(--p-surface-0);
    border: 1px solid var(--p-border-color);
    border-radius: calc(var(--p-border-radius) - 2px);
    color: var(--p-text-color);
    font-size: 0.8125rem;
    outline: none;
    box-sizing: border-box;
    transition: border-color 150ms ease, box-shadow 150ms ease;
}
.p-select-filter-input:focus {
    border-color: var(--p-primary-500);
    box-shadow: 0 0 0 1px var(--p-primary-500);
}
.p-select-filter-icon {
    position: absolute;
    left: 1.125rem;
    top: 50%;
    transform: translateY(-50%);
    color: var(--p-text-muted);
    pointer-events: none;
    display: flex;
}

/* Select All Header */
.p-select-header-all {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 0.75rem;
    border-bottom: 1px solid var(--p-border-color);
    font-size: 0.8125rem;
    font-weight: 600;
    color: var(--p-text-color);
    cursor: pointer;
    background: var(--p-surface-50);
}
.p-select-header-all:hover {
    background: var(--p-surface-100);
}

/* List Options */
.p-select-list {
    list-style: none;
    margin: 0;
    padding: 0.25rem;
    overflow-y: auto;
    max-height: 220px;
    box-sizing: border-box;
}

.p-select-option-group {
    padding: 0.5rem 0.75rem 0.25rem;
    font-size: 0.6875rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--p-text-muted);
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.p-select-option {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.5rem 0.75rem;
    border-radius: calc(var(--p-border-radius) - 2px);
    font-size: 0.875rem;
    color: var(--p-text-color);
    cursor: pointer;
    transition: background 120ms ease, color 120ms ease;
    gap: 0.75rem;
}

.p-select-option:hover:not(.p-disabled) {
    background: var(--p-surface-100);
}

.p-select-option.p-highlight {
    background: var(--p-primary-50, #ecfdf5);
    color: var(--p-primary-700, #047857);
    font-weight: 600;
}
.p-select-option.p-highlight:hover:not(.p-disabled) {
    background: var(--p-primary-100, #d1fae5);
}

.p-select-option.p-disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.p-select-option-content {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex: 1;
}

.p-select-option-checkbox {
    width: 1.125rem;
    height: 1.125rem;
    border: 1px solid var(--p-border-color);
    border-radius: calc(var(--p-border-radius) - 4px);
    background: var(--p-surface-0);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: background 150ms ease, border-color 150ms ease;
}
.p-select-option.p-highlight .p-select-option-checkbox,
.p-select-option-checkbox.is-checked {
    background: var(--p-primary-500);
    border-color: var(--p-primary-500);
    color: #ffffff;
}

.p-select-option-checkmark {
    color: var(--p-primary-600);
    display: flex;
}

.p-select-option-badge {
    font-size: 0.6875rem;
    font-weight: 700;
    padding: 0.125rem 0.375rem;
    border-radius: 9999px;
    background: var(--p-surface-200);
    color: var(--p-surface-700);
}

.p-select-empty-message {
    padding: 1rem;
    text-align: center;
    font-size: 0.8125rem;
    color: var(--p-text-muted);
}

/* ==================== DARK MODE ==================== */
.dark .p-select {
    background: var(--p-surface-900);
    border-color: var(--p-surface-700);
    color: var(--p-surface-0);
}
.dark .p-select:hover:not(.is-disabled):not([readonly]) {
    border-color: var(--p-surface-500);
}
.dark .p-select.variant-filled {
    background-color: var(--p-surface-800);
}
.dark .p-select.variant-filled:hover:not(.is-disabled):not([readonly]) {
    background-color: var(--p-surface-700);
}
.dark .p-select.variant-filled.is-open {
    background-color: var(--p-surface-900);
}
.dark .p-select.is-disabled {
    background-color: var(--p-surface-800);
}
.dark .p-select-chip {
    background: var(--p-surface-800);
    color: var(--p-surface-200);
}
.dark .p-select-overlay {
    background: var(--p-surface-900);
    border-color: var(--p-surface-700);
}
.dark .p-select-filter-container {
    background: var(--p-surface-900);
    border-color: var(--p-surface-700);
}
.dark .p-select-filter-input {
    background: var(--p-surface-950, #090d14);
    border-color: var(--p-surface-700);
    color: var(--p-surface-0);
}
.dark .p-select-header-all {
    background: var(--p-surface-850, #141b26);
    border-color: var(--p-surface-700);
}
.dark .p-select-header-all:hover {
    background: var(--p-surface-800);
}
.dark .p-select-option:hover:not(.p-disabled) {
    background: var(--p-surface-800);
    color: var(--p-surface-0);
}
.dark .p-select-option.p-highlight {
    background: rgba(16, 185, 129, 0.16);
    color: var(--p-primary-300, #6ee7b7);
}
.dark .p-select-option.p-highlight:hover:not(.p-disabled) {
    background: rgba(16, 185, 129, 0.24);
    color: var(--p-primary-200, #a7f3d0);
}
.dark .p-select-option-checkbox {
    background: var(--p-surface-950, #090d14);
    border-color: var(--p-surface-600);
}
.dark .p-select-option-checkmark {
    color: var(--p-primary-400);
}
.dark .p-select-option-badge {
    background: var(--p-surface-800);
    color: var(--p-surface-200);
}
`;function X(i,a){H("laughtale-select",W);let f=a.multiple===!0||String(a.multiple)==="true",O=a.checkmark===!0||String(a.checkmark)==="true",k=a.checkbox===!0||String(a.checkbox)==="true",A=a.display==="chip",$=a.filter===!0||String(a.filter)==="true",I=a.showClear===!0||String(a.showClear)==="true",T=a.editable===!0||String(a.editable)==="true",M=a.loading===!0||String(a.loading)==="true",j=a.fluid===!0||String(a.fluid)==="true",P=a.invalid===!0||String(a.invalid)==="true",h=a.disabled===!0||String(a.disabled)==="true",q=a.readonly===!0||String(a.readonly)==="true",D=a.variant==="filled",w=a.size||"normal",V=a.placeholder||"Select an option...",F=a.scrollHeight||"220px";function B(){return(a.options||[]).map(r=>typeof r=="string"?{label:r,value:r}:r)}let S=B();function N(e){let r=[];return e.forEach(t=>{t.items&&t.items.length>0?t.items.forEach(l=>r.push(l)):r.push(t)}),r}let g=N(S),s=[],u=a.value??a.selectedValue;u!=null&&(Array.isArray(u)?s=[...u]:typeof u=="string"&&u.includes(",")&&f?s=u.split(",").map(e=>e.trim()):s=[u]);let d=!1,x="";function v(e){return s.some(r=>String(r)===String(e)||typeof r=="object"&&r?.value===e)}function z(){return g.filter(e=>v(e.value)||v(e.code))}function R(){let e=z();if(e.length===0)return T&&s.length>0?`<span class="p-select-label">${s[0]}</span>`:`<span class="p-select-label p-placeholder">${V}</span>`;if(f){if(A)return`<div class="p-select-chips-wrap">${e.map(n=>`
                    <span class="p-select-chip" data-value="${n.value}">
                        ${n.flag?`<span>${n.flag}</span>`:""}
                        <span>${n.label||n.value}</span>
                        <span class="p-select-chip-remove" data-remove="${n.value}">${p("x",12)}</span>
                    </span>
                `).join("")}</div>`;{let c=e[0].label||e[0].value,n=e.length>1?` (+${e.length-1} more)`:"";return`<span class="p-select-label">${c}${n}</span>`}}let r=e[0],t=r.flag?`<span style="font-size: 1.125rem; line-height: 1;">${r.flag}</span>`:"",l=r.icon?`<span style="font-size: 1.125rem; line-height: 1;">${r.icon}</span>`:"",o=r.statusClass?`<span class="w-2 h-2 rounded-full ${r.statusClass}"></span>`:"";return`<span class="p-select-label">${t}${l}${o}<span>${r.label||r.value}</span></span>`}function Y(e,r){if(!r)return e;let t=r.toLowerCase(),l=[];return e.forEach(o=>{if(o.items&&o.items.length>0){let c=o.items.filter(n=>n.label&&n.label.toLowerCase().includes(t)||n.value&&String(n.value).toLowerCase().includes(t)||n.description&&n.description.toLowerCase().includes(t));c.length>0&&l.push({...o,items:c})}else(o.label&&o.label.toLowerCase().includes(t)||o.value&&String(o.value).toLowerCase().includes(t)||o.description&&o.description.toLowerCase().includes(t))&&l.push(o)}),l}function E(){let e=Y(S,x);if(e.length===0)return'<div class="p-select-empty-message">No results found</div>';let r="";return e.forEach((t,l)=>{t.items&&t.items.length>0?(r+=`
                    <li class="p-select-option-group">
                        ${t.flag?`<span>${t.flag}</span>`:""}
                        <span>${t.label||t.value}</span>
                    </li>
                `,t.items.forEach((o,c)=>{r+=C(o,`opt_${l}_${c}`)})):r+=C(t,`opt_${l}`)}),r}function C(e,r){let t=v(e.value)||v(e.code),l=e.disabled?"p-disabled":"",o=t?"p-highlight":"",c=e.flag?`<span style="font-size: 1.125rem; line-height: 1;">${e.flag}</span>`:"",n=e.icon?`<span style="font-size: 1.125rem; line-height: 1;">${e.icon}</span>`:"",K=e.avatar?`<div style="position: relative; width: 1.75rem; height: 1.75rem; border-radius: 50%; background: var(--p-surface-200); color: var(--p-surface-700); font-weight: 700; font-size: 0.6875rem; display: flex; align-items: center; justify-content: center;">${e.avatar}${e.statusClass?`<span style="position: absolute; bottom: -1px; right: -1px; width: 8px; height: 8px; border-radius: 50%; border: 1.5px solid var(--p-surface-0);" class="${e.statusClass}"></span>`:""}</div>`:"",Q=e.badge!==void 0?`<span class="p-select-option-badge">${e.badge}</span>`:"",U=e.description?`<div style="font-size: 0.75rem; color: var(--p-text-muted);">${e.description}</div>`:"",G=(O||f)&&t?`<span class="p-select-option-checkmark">${p("check",16)}</span>`:"",J=k||f?`
            <div class="p-select-option-checkbox ${t?"is-checked":""}">
                ${t?p("check",12):""}
            </div>
        `:"";return`
            <li class="p-select-option ${o} ${l}" data-value="${e.value}" role="option" aria-selected="${t?"true":"false"}" id="${r}">
                <div class="p-select-option-content">
                    ${J}
                    ${c}
                    ${n}
                    ${K}
                    <div>
                        <span class="font-medium">${e.label||e.value}</span>
                        ${U}
                    </div>
                </div>
                ${Q}
                ${G}
            </li>
        `}function m(){let e=["laughtale-select","p-select",j?"p-select-fluid":"",D?"variant-filled":"",w!=="normal"?`size-${w}`:"",P?"is-invalid":"",h?"is-disabled":"",d?"is-open":""].filter(Boolean).join(" "),r=s.length>0,t=g.length>0&&s.length===g.length,l=s.length>0&&!t;i.className=e,i.setAttribute("tabindex",h?"-1":"0"),i.setAttribute("role","combobox"),i.setAttribute("aria-expanded",d?"true":"false"),i.setAttribute("aria-haspopup","listbox"),i.innerHTML=`
            ${R()}
            <div class="p-select-actions">
                ${I&&r&&!h?`<span class="p-select-clear-icon" title="Clear selection">${p("x",14)}</span>`:""}
                ${M?`<span class="p-select-dropdown">${p("loader-2",16)}</span>`:`<span class="p-select-dropdown">${p("chevron-down",16)}</span>`}
            </div>
            <div class="p-select-overlay ${d?"is-visible":""}">
                ${$?`
                    <div class="p-select-filter-container">
                        <span class="p-select-filter-icon">${p("search",14)}</span>
                        <input type="text" class="p-select-filter-input" placeholder="${a.filterPlaceholder||"Search..."}" value="${x}" />
                    </div>
                `:""}
                ${f&&k?`
                    <div class="p-select-header-all">
                        <div class="p-select-option-checkbox ${t?"is-checked":""}">
                            ${t?p("check",12):l?p("minus",12):""}
                        </div>
                        <span>Select All (${s.length}/${g.length})</span>
                    </div>
                `:""}
                <ul class="p-select-list" role="listbox" style="max-height: ${F};">
                    ${E()}
                </ul>
            </div>
            <input type="hidden" name="${a.name||a.targetInputName||"select_value"}" value="${s.join(",")}" />
        `,_()}function b(e){if(h||q)return;d=e!==void 0?e:!d;let r=i.querySelector(".p-select-overlay"),t=i.querySelector(".p-select-dropdown");d?(i.classList.add("is-open"),r?.classList.add("is-visible"),i.setAttribute("aria-expanded","true"),$&&setTimeout(()=>{i.querySelector(".p-select-filter-input")?.focus()},50)):(i.classList.remove("is-open"),r?.classList.remove("is-visible"),i.setAttribute("aria-expanded","false"),x="")}function _(){i.onclick=t=>{let l=t.target;if(!l.closest(".p-select-overlay")){if(l.closest(".p-select-clear-icon")){t.stopPropagation(),s=[],m(),y();return}if(l.closest(".p-select-chip-remove")){t.stopPropagation();let c=l.closest(".p-select-chip-remove").getAttribute("data-remove");s=s.filter(n=>String(n)!==String(c)),m(),y();return}b()}};let e=i.querySelector(".p-select-filter-input");e&&(e.oninput=t=>{x=e.value;let l=i.querySelector(".p-select-list");l&&(l.innerHTML=E()),L()},e.onclick=t=>t.stopPropagation(),e.onkeydown=t=>{t.key==="Escape"&&b(!1)});let r=i.querySelector(".p-select-header-all");r&&(r.onclick=t=>{t.stopPropagation(),s.length===g.length?s=[]:s=g.map(l=>l.value),m(),y()}),L(),i.onkeydown=t=>{t.key==="Enter"||t.key===" "||t.key==="ArrowDown"?d||(t.preventDefault(),b(!0)):t.key==="Escape"&&d&&(t.preventDefault(),b(!1))},document.addEventListener("click",t=>{i.contains(t.target)||d&&b(!1)})}function L(){i.querySelectorAll(".p-select-option:not(.p-disabled)").forEach(r=>{r.onclick=t=>{t.stopPropagation();let l=r.getAttribute("data-value");l!==null&&(f?(v(l)?s=s.filter(o=>String(o)!==String(l)):s.push(l),m()):(s=[l],b(!1),m()),y())}})}function y(){let e=f?s:s[0]??null,r=i.querySelector('input[type="hidden"]');r&&(r.value=s.join(",")),i.dispatchEvent(new CustomEvent("select:change",{bubbles:!0,detail:{value:e,selectedItems:z()}})),i.dispatchEvent(new CustomEvent("change",{bubbles:!0,detail:{value:e}}))}m()}export{X as default};
