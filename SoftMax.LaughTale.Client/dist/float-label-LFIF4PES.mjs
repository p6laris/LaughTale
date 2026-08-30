import{e as c}from"./chunk-3YU53HBK.mjs";var v=`
.laughtale-float-label {
    position: relative;
    display: inline-flex;
    flex-direction: column;
    width: 100%;
    margin-top: 1rem;
    font-family: var(--p-font-family, inherit);
    box-sizing: border-box;
}

.laughtale-float-label > label {
    position: absolute;
    left: 0.75rem;
    color: var(--p-text-muted);
    font-size: 0.875rem;
    font-weight: 500;
    pointer-events: none;
    transition: all 150ms cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 10;
    line-height: 1;
    user-select: none;
}

/* Variant: over (Floats completely above the input) */
.laughtale-float-label-over > label {
    top: 50%;
    transform: translateY(-50%);
}
.laughtale-float-label-over.has-value > label,
.laughtale-float-label-over:focus-within > label {
    top: -1.25rem;
    left: 0.15rem;
    transform: translateY(0);
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--p-primary-500);
}

/* Variant: on (Floats on the top border line with surface pill masking) */
.laughtale-float-label-on > label {
    top: 50%;
    transform: translateY(-50%);
    background: var(--p-surface-0);
    padding: 0 0.35rem;
    border-radius: 2px;
}
.laughtale-float-label-on.has-value > label,
.laughtale-float-label-on:focus-within > label {
    top: 0;
    transform: translateY(-50%);
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--p-primary-500);
    z-index: 15;
}

/* Variant: in (Infield top-aligned label) */
.laughtale-float-label-in > label {
    top: 50%;
    transform: translateY(-50%);
}
.laughtale-float-label-in.has-value > label,
.laughtale-float-label-in:focus-within > label {
    top: 0.35rem;
    transform: translateY(0);
    font-size: 0.6875rem;
    font-weight: 600;
    color: var(--p-primary-500);
}
.laughtale-float-label-in input,
.laughtale-float-label-in .p-input,
.laughtale-float-label-in .p-password-container,
.laughtale-float-label-in .p-inputtags,
.laughtale-float-label-in .cs-trigger,
.laughtale-float-label-in .dp-trigger,
.laughtale-float-label-in .ac-input-container,
.laughtale-float-label-in .p-select,
.laughtale-float-label-in .p-treeselect,
.laughtale-float-label-in .p-multiselect {
    padding-top: 1.25rem !important;
    padding-bottom: 0.25rem !important;
}

.laughtale-float-label-in .p-inputtags input,
.laughtale-float-label-in .p-password-container input,
.laughtale-float-label-in .p-inputgroup input {
    padding-top: 0.1875rem !important;
    padding-bottom: 0.1875rem !important;
    min-height: auto !important;
}

/* Invalid State */
.laughtale-float-label.invalid > label,
.laughtale-float-label:has(.invalid) > label,
.laughtale-float-label:has(.is-invalid) > label,
.laughtale-float-label:has(:invalid) > label {
    color: var(--p-red-500, #ef4444) !important;
}

/* Dark Mode Tokens */
.dark .laughtale-float-label > label {
    color: var(--p-surface-400);
}
.dark .laughtale-float-label-on > label {
    background: var(--p-surface-900);
}
.dark .laughtale-float-label.has-value > label,
.dark .laughtale-float-label:focus-within > label {
    color: var(--p-primary-400);
}
.dark .laughtale-float-label.invalid > label,
.dark .laughtale-float-label:has(.invalid) > label,
.dark .laughtale-float-label:has(.is-invalid) > label,
.dark .laughtale-float-label:has(:invalid) > label {
    color: #f87171 !important;
}
`;function m(o,i){c("laughtale-float-label",v);let p=i.variant||"over",d=o.innerHTML,b=i.for?`for="${i.for}"`:"",r=o.querySelector("label"),u=i.label||(r?r.textContent:"Label");o.innerHTML=`
        <div class="laughtale-float-label laughtale-float-label-${p} ${i.invalid?"invalid":""}">
            ${d}
            ${!r&&u?`<label ${b}>${u}</label>`:""}
        </div>
    `;let e=o.querySelector(".laughtale-float-label"),f=e.querySelector("label"),h=()=>e.querySelector("input, textarea, select, .cs-trigger, .dp-trigger, .ac-input, .p-inputtags-input, .p-password-input");function l(){let a=e.querySelector('input:not([type="hidden"]), textarea, select'),t=e.querySelector(".cs-label:not(.placeholder), .dp-label:not(.placeholder), .ac-input, .p-select-label:not(.p-placeholder), .p-treeselect-label:not(.p-placeholder), .p-multiselect-label:not(.p-placeholder)"),g=e.querySelectorAll(".p-inputtags-tag, .chip-item, .p-chip, .p-select-chip"),s=e.querySelector('input[type="hidden"]'),n=!1;(a&&a.value&&a.value.trim().length>0||t&&t.textContent&&t.textContent.trim().length>0&&!t.classList.contains("placeholder")&&!t.classList.contains("p-placeholder")&&t.textContent.trim()!=="\xA0"||g.length>0||s&&s.value&&s.value.trim().length>0)&&(n=!0),e.classList.contains("has-value")!==n&&(n?e.classList.add("has-value"):e.classList.remove("has-value"))}f?.addEventListener("click",()=>{let a=h();a&&(a.focus(),typeof a.click=="function"&&!a.matches("input, textarea")&&a.click())}),e.addEventListener("input",l),e.addEventListener("change",l),e.addEventListener("focusin",()=>{e.classList.add("is-focused"),l()}),e.addEventListener("focusout",()=>{e.classList.remove("is-focused"),l()}),e.addEventListener("inputtags:change",l),e.addEventListener("chips:change",l),e.addEventListener("tags:add",l),e.addEventListener("tags:remove",l),e.addEventListener("password:change",l),e.addEventListener("otp:change",l),e.addEventListener("cascadeselect:change",l),e.addEventListener("datepicker:change",l),e.addEventListener("autocomplete:change",l),e.addEventListener("select:change",l),new MutationObserver(()=>{l()}).observe(e,{childList:!0,subtree:!0}),l(),setTimeout(l,50),setTimeout(l,200)}export{m as default};
