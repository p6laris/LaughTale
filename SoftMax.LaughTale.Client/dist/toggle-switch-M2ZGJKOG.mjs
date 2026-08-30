import{a as g}from"./chunk-P6B5FGGY.mjs";import{e as r}from"./chunk-3YU53HBK.mjs";var v=`
/* ==================== AURA TOGGLESWITCH ==================== */
.laughtale-toggleswitch,
.p-toggleswitch {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    position: relative;
    user-select: none;
    vertical-align: middle;
    cursor: pointer;
}

.p-toggleswitch.p-disabled {
    opacity: 0.6;
    cursor: not-allowed;
    pointer-events: none;
}

.p-toggleswitch-input {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    padding: 0;
    margin: 0;
    opacity: 0;
    z-index: 1;
    cursor: pointer;
    border: 0;
    appearance: none;
}

.p-toggleswitch.p-disabled .p-toggleswitch-input {
    cursor: not-allowed;
}

/* Slider Track */
.p-toggleswitch-slider {
    position: relative;
    display: block;
    width: 2.5rem; /* 40px */
    height: 1.5rem; /* 24px */
    background: var(--p-surface-300, #cbd5e1);
    border-radius: 9999px;
    transition: background 150ms ease, border-color 150ms ease, box-shadow 150ms ease;
    box-sizing: border-box;
}

.p-toggleswitch:hover:not(.p-disabled):not(.p-toggleswitch-checked) .p-toggleswitch-slider {
    background: var(--p-surface-400, #94a3b8);
}

.p-toggleswitch:focus-within:not(.p-disabled) .p-toggleswitch-slider,
.p-toggleswitch-input:focus-visible ~ .p-toggleswitch-slider {
    box-shadow: 0 0 0 1px var(--p-primary-500, #10b981) !important;
}

/* Checked State */
.p-toggleswitch.p-toggleswitch-checked .p-toggleswitch-slider {
    background: var(--p-primary-500, #10b981);
}

.p-toggleswitch.p-toggleswitch-checked:hover:not(.p-disabled) .p-toggleswitch-slider {
    background: var(--p-primary-600, #059669);
}

/* Handle Thumb */
.p-toggleswitch-handle {
    position: absolute;
    top: 3px;
    left: 3px;
    width: 1.125rem; /* 18px */
    height: 1.125rem; /* 18px */
    background: var(--p-surface-0, #ffffff);
    border-radius: 50%;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15), 0 1px 2px rgba(0, 0, 0, 0.06);
    transition: transform 150ms cubic-bezier(0.4, 0, 0.2, 1), background 150ms ease, color 150ms ease;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    color: var(--p-surface-600, #475569);
}

.p-toggleswitch.p-toggleswitch-checked .p-toggleswitch-handle {
    transform: translateX(16px);
    color: var(--p-primary-600, #059669);
}

/* Handle Icon */
.p-toggleswitch-handle-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    line-height: 1;
}

.p-toggleswitch-handle-icon svg {
    width: 10px;
    height: 10px;
}

/* Invalid State */
.p-toggleswitch.p-invalid .p-toggleswitch-slider,
.p-toggleswitch.is-invalid .p-toggleswitch-slider {
    border: 1px solid var(--p-red-500, #ef4444) !important;
}
.p-toggleswitch.p-invalid:focus-within .p-toggleswitch-slider,
.p-toggleswitch.is-invalid:focus-within .p-toggleswitch-slider {
    box-shadow: 0 0 0 1px var(--p-red-500, #ef4444) !important;
}

/* Label */
.p-toggleswitch-label {
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--p-text-color, #0f172a);
    cursor: pointer;
}

/* ==================== DARK MODE ==================== */
.dark .p-toggleswitch-slider {
    background: var(--p-surface-700, #334155);
}
.dark .p-toggleswitch:hover:not(.p-disabled):not(.p-toggleswitch-checked) .p-toggleswitch-slider {
    background: var(--p-surface-600, #475569);
}
.dark .p-toggleswitch.p-toggleswitch-checked .p-toggleswitch-slider {
    background: var(--p-primary-500, #10b981);
}
.dark .p-toggleswitch.p-toggleswitch-checked:hover:not(.p-disabled) .p-toggleswitch-slider {
    background: var(--p-primary-400, #34d399);
}
.dark .p-toggleswitch-handle {
    background: var(--p-surface-0, #ffffff);
    color: var(--p-surface-600, #475569);
}
.dark .p-toggleswitch.p-toggleswitch-checked .p-toggleswitch-handle {
    background: var(--p-surface-0, #ffffff);
    color: var(--p-primary-600, #059669);
}
.dark .p-toggleswitch.p-disabled .p-toggleswitch-slider {
    background: var(--p-surface-800, #1e293b);
}
.dark .p-toggleswitch.p-disabled .p-toggleswitch-handle {
    background: var(--p-surface-500, #64748b);
}
`;function k(l,e){r("laughtale-toggleswitch",v);let t=e.checked===!0||String(e.checked)==="true"||e.value===!0||String(e.value)==="true",d=e.invalid===!0||String(e.invalid)==="true",a=e.disabled===!0||String(e.disabled)==="true",h=e.checkedIcon||e.icon,p=e.uncheckedIcon,o=e.inputId||"",u=e.name||e.targetInputName||"switch_value";function n(){let c=["laughtale-toggleswitch","p-toggleswitch","p-component",t?"p-toggleswitch-checked":"",d?"p-invalid is-invalid":"",a?"p-disabled":""].filter(Boolean).join(" ");l.className=c;let i=t?h:p,f=i?`<span class="p-toggleswitch-handle-icon">${g(i,10)}</span>`:"";l.innerHTML=`
            <input 
                type="checkbox" 
                role="switch"
                class="p-toggleswitch-input"
                ${o?`id="${o}"`:""}
                name="${u}"
                ${t?"checked":""}
                ${a?"disabled":""}
                aria-checked="${t?"true":"false"}"
                ${e.ariaLabel?`aria-label="${e.ariaLabel}"`:""}
                ${e.ariaLabelledBy?`aria-labelledby="${e.ariaLabelledBy}"`:""}
                tabindex="${a?"-1":"0"}"
            />
            <div class="p-toggleswitch-slider ${e.sliderClass||""}">
                <div class="p-toggleswitch-handle ${e.handleClass||""}">
                    ${f}
                </div>
            </div>
            ${e.label?`<span class="p-toggleswitch-label">${e.label}</span>`:""}
        `,w()}function s(){a||(t=!t,n(),b())}function b(){l.dispatchEvent(new CustomEvent("switch:change",{bubbles:!0,detail:{checked:t,value:t}})),l.dispatchEvent(new CustomEvent("toggleswitch:change",{bubbles:!0,detail:{checked:t,value:t}})),l.dispatchEvent(new CustomEvent("change",{bubbles:!0,detail:{checked:t,value:t}}))}function w(){let c=l.querySelector(".p-toggleswitch-input");c&&(c.onchange=i=>{i.stopPropagation(),s()}),l.onclick=i=>{i.target.closest(".p-toggleswitch-input")||(i.preventDefault(),s())},l.onkeydown=i=>{(i.key===" "||i.key==="Enter")&&(i.preventDefault(),s())}}n()}export{k as default};
