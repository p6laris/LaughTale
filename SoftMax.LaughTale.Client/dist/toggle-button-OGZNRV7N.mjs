import{a as u}from"./chunk-P6B5FGGY.mjs";import{e as b}from"./chunk-3YU53HBK.mjs";var I=`
/* ==================== AURA TOGGLEBUTTON ==================== */
.laughtale-togglebutton,
.p-togglebutton {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background: var(--p-surface-0, #ffffff);
    border: 1px solid var(--p-border-color, #cbd5e1);
    border-radius: var(--p-border-radius, 6px);
    color: var(--p-text-color, #0f172a);
    font-family: var(--p-font-family, inherit);
    font-size: 0.875rem;
    font-weight: 500;
    line-height: 1.25;
    cursor: pointer;
    user-select: none;
    outline: none;
    box-sizing: border-box;
    vertical-align: middle;
    transition: background 150ms ease, border-color 150ms ease, color 150ms ease, box-shadow 150ms ease, transform 120ms ease;
}

.p-togglebutton.p-togglebutton-fluid {
    display: flex;
    width: 100%;
}

.p-togglebutton:hover:not(.p-disabled):not(.p-togglebutton-checked) {
    background: var(--p-surface-100, #f1f5f9);
    border-color: var(--p-surface-400, #94a3b8);
}

.p-togglebutton:focus-visible:not(.p-disabled) {
    border-color: var(--p-primary-500, #10b981) !important;
    box-shadow: 0 0 0 1px var(--p-primary-500, #10b981) !important;
}

/* Checked (On) State */
.p-togglebutton.p-togglebutton-checked,
.p-togglebutton.is-checked {
    background: var(--p-primary-50, #ecfdf5);
    border-color: var(--p-primary-500, #10b981);
    color: var(--p-primary-700, #047857);
    font-weight: 600;
}

.p-togglebutton.p-togglebutton-checked:hover:not(.p-disabled),
.p-togglebutton.is-checked:hover:not(.p-disabled) {
    background: var(--p-primary-100, #d1fae5);
}

/* Sizes */
.p-togglebutton.size-small,
.p-togglebutton.p-togglebutton-sm {
    padding: 0.25rem 0.625rem;
    font-size: 0.75rem;
    gap: 0.375rem;
}

.p-togglebutton.size-large,
.p-togglebutton.p-togglebutton-lg {
    padding: 0.75rem 1.25rem;
    font-size: 1.0625rem;
    gap: 0.625rem;
}

/* Invalid State */
.p-togglebutton.p-invalid,
.p-togglebutton.is-invalid {
    border-color: var(--p-red-500, #ef4444) !important;
}
.p-togglebutton.p-invalid:focus-visible,
.p-togglebutton.is-invalid:focus-visible {
    box-shadow: 0 0 0 1px var(--p-red-500, #ef4444) !important;
}

/* Disabled State */
.p-togglebutton:disabled,
.p-togglebutton.p-disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background: var(--p-surface-100, #f1f5f9);
    border-color: var(--p-surface-300, #cbd5e1);
    color: var(--p-text-muted, #64748b);
    pointer-events: none;
}

/* Icon & Label */
.p-togglebutton-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    line-height: 1;
}

.p-togglebutton-label {
    display: inline-block;
    line-height: 1;
}

/* ==================== DARK MODE ==================== */
.dark .p-togglebutton {
    background: var(--p-surface-900, #0f172a);
    border-color: var(--p-surface-700, #334155);
    color: var(--p-surface-0, #f8fafc);
}
.dark .p-togglebutton:hover:not(.p-disabled):not(.p-togglebutton-checked) {
    background: var(--p-surface-800, #1e293b);
    border-color: var(--p-surface-500, #64748b);
}
.dark .p-togglebutton.p-togglebutton-checked,
.dark .p-togglebutton.is-checked {
    background: rgba(16, 185, 129, 0.16);
    border-color: var(--p-primary-500, #10b981);
    color: var(--p-primary-300, #6ee7b7);
}
.dark .p-togglebutton.p-togglebutton-checked:hover:not(.p-disabled),
.dark .p-togglebutton.is-checked:hover:not(.p-disabled) {
    background: rgba(16, 185, 129, 0.24);
    color: var(--p-primary-200, #a7f3d0);
}
.dark .p-togglebutton:disabled,
.dark .p-togglebutton.p-disabled {
    background: var(--p-surface-850, #141b26);
    border-color: var(--p-surface-700, #334155);
    color: var(--p-surface-500, #64748b);
}
`;function x(t,e){b("laughtale-togglebutton",I);let o=e.checked===!0||String(e.checked)==="true"||e.value===!0||String(e.value)==="true",c=e.fluid===!0||String(e.fluid)==="true",s=e.invalid===!0||String(e.invalid)==="true",l=e.disabled===!0||String(e.disabled)==="true",a=e.size||"normal",f=e.onLabel!==void 0?e.onLabel:"On",p=e.offLabel!==void 0?e.offLabel:"Off",v=e.onIcon||e.icon,m=e.offIcon||e.icon;function r(){let n=["laughtale-togglebutton","p-togglebutton","p-component",o?"p-togglebutton-checked is-checked":"",c?"p-togglebutton-fluid":"",a!=="normal"?`size-${a} p-togglebutton-${a==="small"?"sm":"lg"}`:"",s?"p-invalid is-invalid":"",l?"p-disabled":""].filter(Boolean).join(" ");t.className=n,t.setAttribute("role","button"),t.setAttribute("aria-pressed",o?"true":"false"),t.setAttribute("tabindex",l?"-1":"0"),e.inputId&&t.setAttribute("id",e.inputId),e.ariaLabel&&t.setAttribute("aria-label",e.ariaLabel),e.ariaLabelledBy&&t.setAttribute("aria-labelledby",e.ariaLabelledBy);let d=o?f:p,g=o?v:m,y=g?`<span class="p-togglebutton-icon">${u(g,a==="small"?14:a==="large"?18:16)}</span>`:"",L=d?`<span class="p-togglebutton-label">${d}</span>`:"";t.innerHTML=`
            ${y}
            ${L}
            <input type="hidden" name="${e.name||e.targetInputName||"togglebutton_value"}" value="${o?"true":"false"}" />
        `,k()}function i(){l||(o=!o,r(),h())}function h(){let n=t.querySelector('input[type="hidden"]');n&&(n.value=o?"true":"false"),t.dispatchEvent(new CustomEvent("togglebutton:change",{bubbles:!0,detail:{checked:o,value:o}})),t.dispatchEvent(new CustomEvent("change",{bubbles:!0,detail:{checked:o,value:o}}))}function k(){t.onclick=n=>{n.preventDefault(),i()},t.onkeydown=n=>{(n.key===" "||n.key==="Enter")&&(n.preventDefault(),i())}}r()}export{x as default};
