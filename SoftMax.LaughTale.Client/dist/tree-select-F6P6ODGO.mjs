import{a as A}from"./chunk-ZALOY5NO.mjs";import{a as z}from"./chunk-6OO3425Y.mjs";import{a as v}from"./chunk-P6B5FGGY.mjs";import{e as j}from"./chunk-3YU53HBK.mjs";var X=`
/* ==================== AURA TREESELECT ==================== */
.laughtale-treeselect,
.p-treeselect {
    display: inline-flex;
    position: relative;
    user-select: none;
    font-family: var(--p-font-family, inherit);
    box-sizing: border-box;
    width: auto;
}

.p-treeselect.p-treeselect-fluid {
    display: flex;
    width: 100%;
}

/* Trigger Box */
.p-treeselect-label-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    min-height: 2.5rem;
    padding: 0.375rem 0.75rem;
    background: var(--p-surface-0);
    border: 1px solid var(--p-border-color);
    border-radius: var(--p-border-radius);
    color: var(--p-text-color);
    cursor: pointer;
    font-size: 0.875rem;
    line-height: 1.25;
    outline: none;
    transition: background 150ms ease, border-color 150ms ease, box-shadow 150ms ease, color 150ms ease;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.02);
    box-sizing: border-box;
}

.p-treeselect-label-container:hover:not(.is-disabled) {
    border-color: var(--p-surface-400);
}

.p-treeselect.is-focused .p-treeselect-label-container,
.p-treeselect-label-container:focus-visible {
    border-color: var(--p-primary-500) !important;
    box-shadow: 0 0 0 1px var(--p-primary-500) !important;
}

/* Filled Variant */
.p-treeselect.variant-filled .p-treeselect-label-container {
    background-color: var(--p-surface-100);
    border-color: transparent;
}
.p-treeselect.variant-filled .p-treeselect-label-container:hover:not(.is-disabled) {
    background-color: var(--p-surface-200);
}
.p-treeselect.variant-filled.is-focused .p-treeselect-label-container {
    background-color: var(--p-surface-0);
    border-color: var(--p-primary-500) !important;
}

/* Sizes */
.p-treeselect.size-small .p-treeselect-label-container,
.p-treeselect.p-treeselect-sm .p-treeselect-label-container {
    min-height: 2rem;
    padding: 0.25rem 0.5rem;
    font-size: 0.75rem;
}
.p-treeselect.size-large .p-treeselect-label-container,
.p-treeselect.p-treeselect-lg .p-treeselect-label-container {
    min-height: 3rem;
    padding: 0.5rem 1rem;
    font-size: 1.0625rem;
}

/* Invalid State */
.p-treeselect.is-invalid .p-treeselect-label-container {
    border-color: var(--p-red-500, #ef4444) !important;
}
.p-treeselect.is-invalid.is-focused .p-treeselect-label-container {
    box-shadow: 0 0 0 1px var(--p-red-500, #ef4444) !important;
}

/* Disabled State */
.p-treeselect.is-disabled {
    opacity: 0.65;
    cursor: not-allowed;
}
.p-treeselect.is-disabled .p-treeselect-label-container {
    background-color: var(--p-surface-100);
    cursor: not-allowed;
    pointer-events: none;
}

/* Label & Chips */
.p-treeselect-label {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.25rem;
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: var(--p-text-color);
}
.p-treeselect-label.p-placeholder {
    color: var(--p-text-muted);
}

.p-treeselect-token {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.125rem 0.5rem;
    background: var(--p-surface-100);
    color: var(--p-surface-800);
    border: 1px solid var(--p-border-color);
    border-radius: calc(var(--p-border-radius) - 2px);
    font-size: 0.75rem;
    font-weight: 500;
}
.p-treeselect-token-remove {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: var(--p-surface-500);
    border: none;
    background: transparent;
    padding: 0;
    margin-left: 0.125rem;
    border-radius: 9999px;
}
.p-treeselect-token-remove:hover {
    color: var(--p-surface-900);
}

/* Actions (Clear & Chevron) */
.p-treeselect-actions {
    display: flex;
    align-items: center;
    gap: 0.35rem;
    margin-left: 0.5rem;
}
.p-treeselect-clear-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    border: none;
    color: var(--p-surface-400);
    cursor: pointer;
    padding: 0.125rem;
    border-radius: 9999px;
    transition: color 150ms ease;
}
.p-treeselect-clear-icon:hover {
    color: var(--p-surface-700);
}
.p-treeselect-dropdown-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: var(--p-surface-500);
    transition: transform 200ms ease;
}
.p-treeselect.is-open .p-treeselect-dropdown-icon {
    transform: rotate(180deg);
}

/* Dropdown Overlay */
.p-treeselect-overlay {
    position: absolute;
    top: calc(100% + 4px);
    left: 0;
    right: 0;
    min-width: 100%;
    z-index: 1000;
    background: var(--p-surface-0);
    border: 1px solid var(--p-border-color);
    border-radius: var(--p-border-radius);
    box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1);
    overflow: hidden;
    display: none;
}
.p-treeselect-overlay.is-open {
    display: block;
}

/* Filter / Search */
.p-treeselect-filter-container {
    padding: 0.5rem;
    background: var(--p-surface-50);
    border-bottom: 1px solid var(--p-border-color);
    display: flex;
    align-items: center;
    gap: 0.5rem;
}
.p-treeselect-filter-input {
    width: 100%;
    font-family: inherit;
    font-size: 0.8125rem;
    padding: 0.375rem 0.625rem;
    background: var(--p-surface-0);
    border: 1px solid var(--p-border-color);
    border-radius: calc(var(--p-border-radius) - 2px);
    color: var(--p-text-color);
    outline: none;
    box-sizing: border-box;
}
.p-treeselect-filter-input:focus {
    border-color: var(--p-primary-500);
}

/* Header & Footer Templates */
.p-treeselect-header {
    padding: 0.5rem 0.75rem;
    background: var(--p-surface-50);
    border-bottom: 1px solid var(--p-border-color);
    font-size: 0.8125rem;
    font-weight: 600;
    color: var(--p-text-color);
}
.p-treeselect-footer {
    padding: 0.5rem 0.75rem;
    background: var(--p-surface-50);
    border-top: 1px solid var(--p-border-color);
    font-size: 0.75rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

/* Tree Nodes List */
.p-treeselect-tree {
    max-height: 280px;
    overflow-y: auto;
    padding: 0.375rem;
    margin: 0;
    list-style: none;
}

.p-treenode {
    list-style: none;
    margin: 0;
    padding: 0;
}

.p-treenode-children {
    padding-left: 1.25rem;
    margin: 0;
    list-style: none;
}

.p-treenode-content {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    padding: 0.375rem 0.5rem;
    border-radius: calc(var(--p-border-radius) - 2px);
    cursor: pointer;
    color: var(--p-text-color);
    font-size: 0.8125rem;
    transition: background 150ms ease, color 150ms ease;
    outline: none;
}
.p-treenode-content:hover:not(.p-disabled) {
    background: var(--p-surface-100);
    color: var(--p-text-color);
}
.p-treenode-content.p-highlight {
    background: var(--p-primary-50, #ecfdf5);
    color: var(--p-primary-700, #047857);
    font-weight: 600;
}
.p-treenode-content.p-highlight:hover:not(.p-disabled) {
    background: var(--p-primary-100, #d1fae5);
    color: var(--p-primary-800, #065f46);
}
.p-treenode-content.p-highlight .p-tree-toggler {
    color: var(--p-primary-700, #047857);
}
.p-treenode-content.p-highlight .p-treenode-icon {
    color: var(--p-primary-600, #059669);
}

.p-tree-toggler {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 1.25rem;
    height: 1.25rem;
    cursor: pointer;
    color: var(--p-surface-500);
    border-radius: 9999px;
    transition: transform 150ms ease, color 150ms ease;
    border: none;
    background: transparent;
    padding: 0;
}
.p-tree-toggler:hover {
    color: var(--p-surface-900);
}
.p-tree-toggler.p-expanded {
    transform: rotate(90deg);
}
.p-tree-toggler-empty {
    width: 1.25rem;
    height: 1.25rem;
    display: inline-block;
}

.p-treenode-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: var(--p-primary-600);
    width: 16px;
    height: 16px;
}

.p-treenode-label {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

/* Checkbox inside tree node */
.p-tree-checkbox {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 1.125rem;
    height: 1.125rem;
    border: 1px solid var(--p-border-color);
    border-radius: 4px;
    background: var(--p-surface-0);
    cursor: pointer;
    transition: all 150ms ease;
}
.p-tree-checkbox:hover {
    border-color: var(--p-primary-500);
}
.p-tree-checkbox.p-checked {
    background: var(--p-primary-500);
    border-color: var(--p-primary-500);
    color: #ffffff;
}
.p-tree-checkbox.p-indeterminate {
    background: var(--p-primary-500);
    border-color: var(--p-primary-500);
    color: #ffffff;
}
.p-tree-checkbox svg {
    width: 12px;
    height: 12px;
}

/* ==================== DARK MODE ==================== */
.dark .p-treeselect-label-container {
    background-color: var(--p-surface-900);
    border-color: var(--p-surface-700);
    color: var(--p-surface-0);
}
.dark .p-treeselect-label-container:hover:not(.is-disabled) {
    border-color: var(--p-surface-500);
}
.dark .p-treeselect.variant-filled .p-treeselect-label-container {
    background-color: var(--p-surface-800);
}
.dark .p-treeselect.variant-filled .p-treeselect-label-container:hover:not(.is-disabled) {
    background-color: var(--p-surface-700);
}
.dark .p-treeselect.variant-filled.is-focused .p-treeselect-label-container {
    background-color: var(--p-surface-900);
}
.dark .p-treeselect-token {
    background: var(--p-surface-800);
    color: var(--p-surface-100);
    border-color: var(--p-surface-700);
}
.dark .p-treeselect-overlay {
    background: var(--p-surface-900);
    border-color: var(--p-surface-700);
    box-shadow: 0 10px 15px -3px rgba(0,0,0,0.5);
}
.dark .p-treeselect-filter-container,
.dark .p-treeselect-header,
.dark .p-treeselect-footer {
    background: var(--p-surface-850, #141b26);
    border-color: var(--p-surface-700);
}
.dark .p-treeselect-filter-input {
    background: var(--p-surface-900);
    border-color: var(--p-surface-700);
    color: var(--p-surface-0);
}
.dark .p-treenode-content:hover:not(.p-disabled) {
    background: var(--p-surface-800);
    color: var(--p-surface-0);
}
.dark .p-treenode-content.p-highlight {
    background: rgba(16, 185, 129, 0.16);
    color: var(--p-primary-300, #6ee7b7);
    font-weight: 600;
}
.dark .p-treenode-content.p-highlight:hover:not(.p-disabled) {
    background: rgba(16, 185, 129, 0.24);
    color: var(--p-primary-200, #a7f3d0);
}
.dark .p-treenode-content.p-highlight .p-tree-toggler {
    color: var(--p-primary-300);
}
.dark .p-treenode-content.p-highlight .p-treenode-icon {
    color: var(--p-primary-400);
}
.dark .p-tree-toggler {
    color: var(--p-surface-400);
}
.dark .p-tree-toggler:hover {
    color: var(--p-surface-100);
}
.dark .p-tree-checkbox {
    background: var(--p-surface-900);
    border-color: var(--p-surface-600);
}
`,Y='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',Z='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>',ee='<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>',re='<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>',te='<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',B='<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';function oe(s,n){j("laughtale-treeselect",X);let D=n.nodes||n.options||n.departments||[],p=n.selectionMode||"single",q=n.display||"comma",S=n.filter===!0||String(n.filter)==="true",O=n.showClear===!0||n.clearable===!0||String(n.showClear)==="true",F=n.fluid===!0||String(n.fluid)==="true",P=n.invalid===!0||String(n.invalid)==="true",f=n.disabled===!0||String(n.disabled)==="true",R=n.variant==="filled",T=n.size||"normal",V=n.placeholder||"Select Item";function E(e){return e.map(r=>({...r,key:r.key||r.id||String(r.label||r.name),label:r.label||r.name||r.key||r.id||"",children:r.children?E(r.children):void 0}))}let w=E(D),y=new Map,K=new Map;function L(e,r=null){for(let t of e)y.set(t.key,t),K.set(t.key,r),t.children&&t.children.length>0&&L(t.children,t.key)}L(w);let a=new Set,c=n.value??n.selectedValue;if(c)if(typeof c=="string")try{let e=JSON.parse(c);Array.isArray(e)?e.forEach(r=>a.add(String(r))):typeof e=="object"&&e!==null?Object.entries(e).forEach(([r,t])=>{t&&a.add(r)}):a.add(c)}catch{a.add(c)}else Array.isArray(c)?c.forEach(e=>a.add(String(e))):typeof c=="object"&&Object.entries(c).forEach(([e,r])=>{r&&a.add(e)});let h=new Set;w.forEach(e=>{e.children&&e.children.length>0&&h.add(e.key)});let I="",g=z({defaultIsOpen:!1,onOpen:()=>{s.classList.add("is-open","is-focused");let e=s.querySelector(".p-treeselect-overlay");if(e&&e.classList.add("is-open"),S){let r=s.querySelector(".p-treeselect-filter-input");setTimeout(()=>r?.focus(),50)}},onClose:()=>{s.classList.remove("is-open","is-focused");let e=s.querySelector(".p-treeselect-overlay");e&&e.classList.remove("is-open")}});A(s,()=>g.close());function _(){let e=["laughtale-treeselect","p-treeselect",F?"p-treeselect-fluid":"",R?"variant-filled":"",T!=="normal"?`size-${T}`:"",P?"is-invalid":"",f?"is-disabled":""].filter(Boolean).join(" ");s.className=e,s.innerHTML=`
            <div class="p-treeselect-label-container" tabindex="${f?"-1":"0"}" role="combobox" aria-haspopup="tree" aria-expanded="false" aria-controls="${n.inputId||"treeselect"}_overlay">
                <div class="p-treeselect-label"></div>
                <div class="p-treeselect-actions">
                    <button type="button" class="p-treeselect-clear-icon" aria-label="Clear selection" tabindex="-1" style="display: none;">
                        ${B}
                    </button>
                    <span class="p-treeselect-dropdown-icon">
                        ${re}
                    </span>
                </div>
            </div>

            <div class="p-treeselect-overlay" id="${n.inputId||"treeselect"}_overlay" role="dialog">
                ${n.header?`<div class="p-treeselect-header">${n.header}</div>`:""}
                ${S?`
                    <div class="p-treeselect-filter-container">
                        <span style="color: var(--p-surface-400); display: flex;">${te}</span>
                        <input type="text" class="p-treeselect-filter-input" placeholder="${n.filterPlaceholder||"Search tree..."}" />
                    </div>
                `:""}
                <ul class="p-treeselect-tree" role="tree"></ul>
                ${n.footer?`<div class="p-treeselect-footer">${n.footer}</div>`:""}
            </div>

            <input type="hidden" name="${n.name||n.targetInputName||"tree_value"}" value="" />
        `,m(),u(),Q()}function $(){let e=[];return a.forEach(r=>{let t=y.get(r);t&&e.push({key:t.key,label:t.label})}),e}function m(){let e=s.querySelector(".p-treeselect-label"),r=s.querySelector(".p-treeselect-clear-icon"),t=s.querySelector(`input[name="${n.name||n.targetInputName||"tree_value"}"]`),l=$();l.length===0?(e.className="p-treeselect-label p-placeholder",e.textContent=V,r.style.display="none",t.value=""):(e.className="p-treeselect-label",O&&!f?r.style.display="inline-flex":r.style.display="none",q==="chip"?(e.innerHTML=l.map(o=>`
                    <span class="p-treeselect-token">
                        <span>${o.label}</span>
                        ${f?"":`<button type="button" class="p-treeselect-token-remove" data-key="${o.key}" aria-label="Remove ${o.label}">${B}</button>`}
                    </span>
                `).join(""),e.querySelectorAll(".p-treeselect-token-remove").forEach(o=>{o.addEventListener("click",i=>{i.stopPropagation();let d=o.getAttribute("data-key");M(d,!1)})})):e.textContent=l.map(o=>o.label).join(", "),p==="single"?t.value=l[0]?.key||"":t.value=JSON.stringify(Array.from(a)))}function C(e,r){return r?e.reduce((t,l)=>{let o=l.label.toLowerCase().includes(r)||l.key.toLowerCase().includes(r),i=l.children?C(l.children,r):[];return(o||i.length>0)&&t.push({...l,children:i.length>0?i:l.children}),t},[]):e}function N(e){if(!e.children||e.children.length===0)return a.has(e.key)?"checked":"unchecked";let r=!0,t=!0;function l(o){for(let i of o)a.has(i.key)?t=!1:r=!1,i.children&&l(i.children)}return l(e.children),r?"checked":t&&!a.has(e.key)?"unchecked":"indeterminate"}function u(){let e=s.querySelector(".p-treeselect-tree"),r=C(w,I.toLowerCase().trim());if(r.length===0){e.innerHTML='<li class="p-treenode" style="padding: 1rem; text-align: center; color: var(--p-text-muted); font-size: 0.8125rem;">No results found</li>';return}function t(l){return l.map(o=>{let i=o.children&&o.children.length>0,d=h.has(o.key),x=a.has(o.key),U=o.icon?v(o.icon,16):i?d?v("folderOpen",16):v("folder",16):v("fileText",16),H="";if(p==="checkbox"){let b=N(o),G=b==="checked"?"p-checked":b==="indeterminate"?"p-indeterminate":"",W=b==="checked"?Y:b==="indeterminate"?Z:"";H=`
                        <span class="p-tree-checkbox ${G}" data-key="${o.key}" role="checkbox" aria-checked="${b==="checked"?"true":b==="indeterminate"?"mixed":"false"}">
                            ${W}
                        </span>
                    `}return`
                    <li class="p-treenode" role="treeitem" aria-expanded="${i?d:"false"}" aria-selected="${x}" data-key="${o.key}">
                        <div class="p-treenode-content ${x&&p!=="checkbox"?"p-highlight":""}" data-key="${o.key}" tabindex="0">
                            ${i?`
                                <button type="button" class="p-tree-toggler ${d?"p-expanded":""}" data-toggle="${o.key}" aria-label="Toggle node" tabindex="-1">
                                    ${ee}
                                </button>
                            `:'<span class="p-tree-toggler-empty"></span>'}
                            ${H}
                            <span class="p-treenode-icon">${U}</span>
                            <span class="p-treenode-label">${o.label}</span>
                        </div>
                        ${i&&d?`
                            <ul class="p-treenode-children" role="group">
                                ${t(o.children)}
                            </ul>
                        `:""}
                    </li>
                `}).join("")}e.innerHTML=t(r),J()}function J(){let e=s.querySelector(".p-treeselect-tree");e.querySelectorAll(".p-tree-toggler").forEach(r=>{r.addEventListener("click",t=>{t.stopPropagation();let l=r.getAttribute("data-toggle");h.has(l)?h.delete(l):h.add(l),u()})}),e.querySelectorAll(".p-treenode-content").forEach(r=>{r.addEventListener("click",t=>{if(t.target.closest(".p-tree-toggler"))return;let o=r.getAttribute("data-key"),i=y.get(o);if(!(!i||i.disabled)){if(p==="single")a.clear(),a.add(o),m(),u(),g.close(),k();else if(p==="multiple")a.has(o)?a.delete(o):a.add(o),m(),u(),k();else if(p==="checkbox"){let x=N(i)!=="checked";M(o,x)}}})})}function M(e,r){let t=y.get(e);if(!t)return;function l(o,i){i?a.add(o.key):a.delete(o.key),o.children&&o.children.forEach(d=>l(d,i))}l(t,r),m(),u(),k()}function Q(){let e=s.querySelector(".p-treeselect-label-container"),r=s.querySelector(".p-treeselect-clear-icon"),t=s.querySelector(".p-treeselect-filter-input");e.addEventListener("click",l=>{l.target.closest(".p-treeselect-clear-icon")||l.target.closest(".p-treeselect-token-remove")||f||g.toggle()}),e.addEventListener("keydown",l=>{f||(l.key===" "||l.key==="Enter"||l.key==="ArrowDown"?(l.preventDefault(),g.open()):l.key==="Escape"&&g.close())}),r.addEventListener("click",l=>{l.stopPropagation(),a.clear(),m(),u(),k()}),t&&(t.addEventListener("input",()=>{I=t.value,u()}),t.addEventListener("keydown",l=>{l.key==="Escape"&&g.close()}))}function k(){let e=$(),r=p==="single"?e[0]?.key||null:Array.from(a);s.dispatchEvent(new CustomEvent("treeselect:change",{bubbles:!0,detail:{value:r,selectedNodes:e}})),s.dispatchEvent(new CustomEvent("change",{bubbles:!0,detail:{value:r}}))}_()}export{oe as default};
