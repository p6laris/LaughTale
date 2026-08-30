import{e as o}from"./chunk-3YU53HBK.mjs";var p=`
/* ==================== AURA TEXTAREA ==================== */
.p-textarea {
    font-family: var(--p-font-family, inherit);
    font-size: 0.875rem;
    color: var(--p-text-color, #0f172a);
    background: var(--p-surface-0, #ffffff);
    padding: 0.5rem 0.75rem;
    border: 1px solid var(--p-border-color, #cbd5e1);
    border-radius: var(--p-border-radius, 6px);
    outline: none;
    line-height: 1.5;
    box-sizing: border-box;
    transition: background 150ms ease, border-color 150ms ease, box-shadow 150ms ease, color 150ms ease;
    resize: vertical;
    vertical-align: middle;
}

.p-textarea:hover:not(:disabled):not(.p-disabled):not(.p-invalid) {
    border-color: var(--p-surface-400, #94a3b8);
}

.p-textarea:focus:not(:disabled):not(.p-disabled):not(.p-invalid),
.p-textarea:focus-visible:not(:disabled):not(.p-disabled):not(.p-invalid) {
    border-color: var(--p-primary-500, #10b981) !important;
    box-shadow: 0 0 0 1px var(--p-primary-500, #10b981) !important;
}

/* Fluid */
.p-textarea.p-textarea-fluid,
.p-textarea-fluid {
    width: 100%;
    display: block;
}

/* Sizes */
.p-textarea.size-small,
.p-textarea.p-textarea-sm {
    font-size: 0.75rem;
    padding: 0.25rem 0.5rem;
}

.p-textarea.size-large,
.p-textarea.p-textarea-lg {
    font-size: 1.0625rem;
    padding: 0.75rem 1rem;
}

/* Variant: Filled */
.p-textarea.p-textarea-filled,
.p-textarea.variant-filled {
    background: var(--p-surface-100, #f1f5f9);
}
.p-textarea.p-textarea-filled:focus,
.p-textarea.variant-filled:focus {
    background: var(--p-surface-0, #ffffff);
}

/* Disabled */
.p-textarea:disabled,
.p-textarea.p-disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background: var(--p-surface-200, #e2e8f0);
    color: var(--p-text-muted, #64748b);
    pointer-events: none;
}

/* Invalid */
.p-textarea.p-invalid,
.p-textarea.is-invalid {
    border-color: var(--p-red-500, #ef4444) !important;
}
.p-textarea.p-invalid:focus,
.p-textarea.is-invalid:focus {
    box-shadow: 0 0 0 1px var(--p-red-500, #ef4444) !important;
}

/* Counter */
.p-textarea-counter {
    font-size: 0.75rem;
    color: var(--p-text-muted, #64748b);
    text-align: right;
    margin-top: 0.25rem;
    font-family: var(--p-font-mono, monospace);
}

/* ==================== DARK MODE ==================== */
.dark .p-textarea {
    background: var(--p-surface-950, #090d14);
    border-color: var(--p-surface-700, #334155);
    color: var(--p-surface-0, #f8fafc);
}
.dark .p-textarea:hover:not(:disabled):not(.p-disabled):not(.p-invalid) {
    border-color: var(--p-surface-500, #64748b);
}
.dark .p-textarea:focus:not(:disabled):not(.p-disabled):not(.p-invalid),
.dark .p-textarea:focus-visible:not(:disabled):not(.p-disabled):not(.p-invalid) {
    border-color: var(--p-primary-400, #34d399) !important;
    box-shadow: 0 0 0 1px var(--p-primary-400, #34d399) !important;
}
.dark .p-textarea.p-textarea-filled,
.dark .p-textarea.variant-filled {
    background: var(--p-surface-850, #141b26);
}
.dark .p-textarea.p-textarea-filled:focus,
.dark .p-textarea.variant-filled:focus {
    background: var(--p-surface-950, #090d14);
}
.dark .p-textarea:disabled,
.dark .p-textarea.p-disabled {
    background: var(--p-surface-800, #1e293b);
    border-color: var(--p-surface-700, #334155);
    color: var(--p-surface-500, #64748b);
}
`;function b(t,e){o("laughtale-textarea",p);let l=e.autoResize===!0||String(e.autoResize)==="true",s=e.fluid===!0||String(e.fluid)==="true",u=e.invalid===!0||String(e.invalid)==="true",n=e.disabled===!0||String(e.disabled)==="true",d=e.size||"normal",c=e.variant||"outlined",a;if(t.tagName.toLowerCase()==="textarea")a=t;else{let r=t.querySelector("textarea");if(r)a=r;else{let x=["p-textarea",s?"p-textarea-fluid":"",d!=="normal"?`p-textarea-${d==="small"?"sm":"lg"}`:"",c==="filled"?"p-textarea-filled":"",u?"p-invalid":"",n?"p-disabled":""].filter(Boolean).join(" ");t.innerHTML=`
                <textarea 
                    class="${x}"
                    rows="${e.rows||5}"
                    cols="${e.cols||30}"
                    placeholder="${e.placeholder||""}"
                    ${e.maxLength?`maxlength="${e.maxLength}"`:""}
                    ${n?"disabled":""}
                    ${e.name||e.targetInputName?`name="${e.name||e.targetInputName}"`:""}
                    ${e.inputId?`id="${e.inputId}"`:""}
                >${e.value||""}</textarea>
                ${e.maxLength?`
                    <div class="p-textarea-counter">
                        <span class="p-textarea-count">${(e.value||"").length}</span> / ${e.maxLength}
                    </div>
                `:""}
            `,a=t.querySelector("textarea")}}function i(){!l||!a||(a.style.height="auto",a.style.overflow="hidden",a.style.resize="none",a.style.height=`${a.scrollHeight}px`)}function f(){if(!e.maxLength)return;let r=t.querySelector(".p-textarea-count");r&&a&&(r.textContent=a.value.length.toString())}a.addEventListener("input",()=>{i(),f(),t.dispatchEvent(new CustomEvent("textarea:input",{bubbles:!0,detail:{value:a.value}}))}),a.addEventListener("change",()=>{t.dispatchEvent(new CustomEvent("textarea:change",{bubbles:!0,detail:{value:a.value}}))}),l&&(window.addEventListener("resize",i),setTimeout(i,0))}export{b as default};
