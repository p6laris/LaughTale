import{e as r}from"./chunk-3YU53HBK.mjs";var u=`
.laughtale-ifta-label {
    position: relative;
    display: inline-flex;
    flex-direction: column;
    width: 100%;
    font-family: var(--p-font-family, inherit);
    box-sizing: border-box;
}

.laughtale-ifta-label > label {
    position: absolute;
    top: 0.4rem;
    left: 0.75rem;
    color: var(--p-text-muted);
    font-size: 0.6875rem;
    font-weight: 600;
    pointer-events: none;
    transition: color 150ms cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 10;
    line-height: 1;
    user-select: none;
}

.laughtale-ifta-label input,
.laughtale-ifta-label textarea,
.laughtale-ifta-label select,
.laughtale-ifta-label .p-input,
.laughtale-ifta-label .p-password-container,
.laughtale-ifta-label .p-inputtags,
.laughtale-ifta-label .cs-trigger,
.laughtale-ifta-label .dp-trigger,
.laughtale-ifta-label .ac-input-container,
.laughtale-ifta-label .p-select,
.laughtale-ifta-label .p-treeselect,
.laughtale-ifta-label .p-multiselect {
    padding-top: 1.35rem !important;
    padding-bottom: 0.35rem !important;
    min-height: 3rem !important;
    font-size: 0.875rem !important;
    box-sizing: border-box;
}

.laughtale-ifta-label .p-inputtags input,
.laughtale-ifta-label .p-password-container input,
.laughtale-ifta-label .p-inputgroup input {
    padding-top: 0.1875rem !important;
    padding-bottom: 0.1875rem !important;
    min-height: auto !important;
}

/* Focus State */
.laughtale-ifta-label:focus-within > label {
    color: var(--p-primary-500);
}

/* Invalid State */
.laughtale-ifta-label.invalid > label,
.laughtale-ifta-label:has(.invalid) > label,
.laughtale-ifta-label:has(.is-invalid) > label,
.laughtale-ifta-label:has(:invalid) > label {
    color: var(--p-red-500, #ef4444) !important;
}

/* Dark Mode Tokens */
.dark .laughtale-ifta-label > label {
    color: var(--p-surface-400);
}
.dark .laughtale-ifta-label:focus-within > label {
    color: var(--p-primary-400);
}
.dark .laughtale-ifta-label.invalid > label,
.dark .laughtale-ifta-label:has(.invalid) > label,
.dark .laughtale-ifta-label:has(.is-invalid) > label,
.dark .laughtale-ifta-label:has(:invalid) > label {
    color: #f87171 !important;
}
`;function f(l,t){r("laughtale-ifta-label",u);let o=l.innerHTML,b=t.for?`for="${t.for}"`:"",e=l.querySelector("label"),i=t.label||(e?e.textContent:"Label");l.innerHTML=`
        <div class="laughtale-ifta-label ${t.invalid?"invalid":""}">
            ${o}
            ${!e&&i?`<label ${b}>${i}</label>`:""}
        </div>
    `;let n=l.querySelector(".laughtale-ifta-label");n.querySelector("label")?.addEventListener("click",()=>{let a=n.querySelector("input, textarea, select, .cs-trigger, .dp-trigger, .ac-input, .p-inputtags-input, .p-password-input");a&&(a.focus(),typeof a.click=="function"&&!a.matches("input, textarea")&&a.click())})}export{f as default};
