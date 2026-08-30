import{a as g}from"./chunk-P6B5FGGY.mjs";import{e as f}from"./chunk-3YU53HBK.mjs";var I=`
/* ==================== AURA SELECTBUTTON ==================== */
.laughtale-selectbutton,
.p-selectbutton {
    display: inline-flex;
    user-select: none;
    font-family: var(--p-font-family, inherit);
    box-sizing: border-box;
    vertical-align: middle;
}

.p-selectbutton.p-selectbutton-fluid {
    display: flex;
    width: 100%;
}

.p-selectbutton.is-disabled {
    opacity: 0.6;
    cursor: not-allowed;
    pointer-events: none;
}

/* Button Item */
.p-selectbutton-item {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background: var(--p-surface-0);
    border: 1px solid var(--p-border-color);
    color: var(--p-text-color);
    font-family: inherit;
    font-size: 0.875rem;
    font-weight: 500;
    line-height: 1.25;
    cursor: pointer;
    outline: none;
    box-sizing: border-box;
    transition: background 150ms ease, border-color 150ms ease, color 150ms ease, box-shadow 150ms ease, z-index 150ms ease;
    margin-left: -1px;
}

.p-selectbutton-fluid .p-selectbutton-item {
    flex: 1 1 0;
}

.p-selectbutton-item:first-child {
    margin-left: 0;
    border-top-left-radius: var(--p-border-radius);
    border-bottom-left-radius: var(--p-border-radius);
}

.p-selectbutton-item:last-child {
    border-top-right-radius: var(--p-border-radius);
    border-bottom-right-radius: var(--p-border-radius);
}

.p-selectbutton-item:hover:not(.p-disabled):not(.is-selected) {
    background: var(--p-surface-100);
    border-color: var(--p-surface-400);
    z-index: 2;
}

.p-selectbutton-item:focus-visible:not(.p-disabled) {
    border-color: var(--p-primary-500) !important;
    box-shadow: 0 0 0 1px var(--p-primary-500) !important;
    z-index: 3;
}

/* Selected State */
.p-selectbutton-item.is-selected {
    background: var(--p-primary-50, #ecfdf5);
    border-color: var(--p-primary-500);
    color: var(--p-primary-700, #047857);
    font-weight: 600;
    z-index: 2;
}

.p-selectbutton-item.is-selected:hover:not(.p-disabled) {
    background: var(--p-primary-100, #d1fae5);
}

/* Disabled Option */
.p-selectbutton-item.p-disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background: var(--p-surface-100);
}

/* Sizes */
.p-selectbutton.size-small .p-selectbutton-item,
.p-selectbutton.p-selectbutton-sm .p-selectbutton-item {
    padding: 0.25rem 0.625rem;
    font-size: 0.75rem;
}

.p-selectbutton.size-large .p-selectbutton-item,
.p-selectbutton.p-selectbutton-lg .p-selectbutton-item {
    padding: 0.75rem 1.25rem;
    font-size: 1.0625rem;
}

/* Invalid State */
.p-selectbutton.is-invalid .p-selectbutton-item {
    border-color: var(--p-red-500, #ef4444) !important;
}
.p-selectbutton.is-invalid .p-selectbutton-item:focus-visible {
    box-shadow: 0 0 0 1px var(--p-red-500, #ef4444) !important;
}

/* Badges */
.p-selectbutton-badge {
    font-size: 0.6875rem;
    font-weight: 700;
    padding: 0.125rem 0.375rem;
    border-radius: 9999px;
    background: var(--p-surface-200);
    color: var(--p-surface-700);
}
.p-selectbutton-item.is-selected .p-selectbutton-badge {
    background: var(--p-primary-200, #a7f3d0);
    color: var(--p-primary-800, #065f46);
}

/* ==================== DARK MODE ==================== */
.dark .p-selectbutton-item {
    background: var(--p-surface-900);
    border-color: var(--p-surface-700);
    color: var(--p-surface-100);
}
.dark .p-selectbutton-item:hover:not(.p-disabled):not(.is-selected) {
    background: var(--p-surface-800);
    border-color: var(--p-surface-500);
}
.dark .p-selectbutton-item.is-selected {
    background: rgba(16, 185, 129, 0.16);
    border-color: var(--p-primary-500);
    color: var(--p-primary-300, #6ee7b7);
}
.dark .p-selectbutton-item.is-selected:hover:not(.p-disabled) {
    background: rgba(16, 185, 129, 0.24);
    color: var(--p-primary-200, #a7f3d0);
}
.dark .p-selectbutton-item.p-disabled {
    background: var(--p-surface-850, #141b26);
    border-color: var(--p-surface-700);
    color: var(--p-surface-500);
}
.dark .p-selectbutton-badge {
    background: var(--p-surface-800);
    color: var(--p-surface-200);
}
.dark .p-selectbutton-item.is-selected .p-selectbutton-badge {
    background: var(--p-primary-900);
    color: var(--p-primary-200);
}
`;function E(r,e){f("laughtale-selectbutton",I);let s=e.multiple===!0||String(e.multiple)==="true",v=e.unselectable!==!1&&String(e.unselectable)!=="false",y=e.fluid===!0||String(e.fluid)==="true",h=e.invalid===!0||String(e.invalid)==="true",b=e.disabled===!0||String(e.disabled)==="true",p=e.size||"normal",x=(e.options||e.items||[]).map(t=>typeof t=="string"?{label:t,value:t}:{...t,label:t.label||t.name||t.justify||String(t.value),disabled:t.disabled||t.constant}),n=[],i=e.value??e.selectedValue??e.values;i!=null&&(Array.isArray(i)?n=[...i]:typeof i=="string"&&i.includes(",")&&s?n=i.split(",").map(t=>t.trim()):n=[i]);function d(t){return n.some(l=>String(l)===String(t))}function m(){let t=["laughtale-selectbutton","p-selectbutton",y?"p-selectbutton-fluid":"",p!=="normal"?`size-${p}`:"",h?"is-invalid":"",b?"is-disabled":""].filter(Boolean).join(" ");r.className=t,r.setAttribute("role",s?"group":"radiogroup"),e.inputId&&r.setAttribute("id",e.inputId);let l=x.map((a,o)=>{let u=d(a.value),c=b||a.disabled,z=["p-selectbutton-item",u?"is-selected":"",c?"p-disabled":""].filter(Boolean).join(" "),$=a.flag?`<span style="font-size: 1.125rem; line-height: 1;">${a.flag}</span>`:"",w=a.icon?`<span style="display: flex;">${g(a.icon,16)}</span>`:"",B=a.badge!==void 0?`<span class="p-selectbutton-badge">${a.badge}</span>`:"";return`
                <button 
                    type="button" 
                    class="${z}" 
                    data-value="${a.value}"
                    ${c?"disabled":""}
                    role="${s?"checkbox":"radio"}"
                    aria-checked="${u?"true":"false"}"
                    tabindex="${c?"-1":"0"}"
                >
                    ${$}
                    ${w}
                    <span>${a.label}</span>
                    ${B}
                </button>
            `}).join("");r.innerHTML=`
            ${l}
            <input type="hidden" name="${e.name||e.targetInputName||"selectbutton_value"}" value="${n.join(",")}" />
        `,S()}function S(){r.querySelectorAll(".p-selectbutton-item:not(.p-disabled)").forEach(l=>{l.onclick=a=>{a.preventDefault();let o=l.getAttribute("data-value");o!==null&&(s?d(o)?n=n.filter(u=>String(u)!==String(o)):n.push(o):d(o)?v&&(n=[]):n=[o],m(),k())}})}function k(){let t=s?n:n[0]??null,l=r.querySelector('input[type="hidden"]');l&&(l.value=n.join(",")),r.dispatchEvent(new CustomEvent("selectbutton:change",{bubbles:!0,detail:{value:t}})),r.dispatchEvent(new CustomEvent("change",{bubbles:!0,detail:{value:t}}))}m()}export{E as default};
