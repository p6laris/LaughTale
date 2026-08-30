import{a as m}from"./chunk-36AEYHZF.mjs";import{b as s}from"./chunk-P6B5FGGY.mjs";import{e as v}from"./chunk-3YU53HBK.mjs";var A=`
.laughtale-inputtext-wrap,
.p-inputtext-wrap {
    position: relative;
    display: inline-flex;
    align-items: center;
    width: auto;
    font-family: var(--p-font-family, inherit);
    box-sizing: border-box;
}

.p-inputtext-wrap.p-inputtext-fluid,
.laughtale-inputtext-wrap.p-inputtext-fluid {
    display: flex;
    width: 100%;
}

/* Native Aura InputText */
.p-inputtext {
    width: 100%;
    font-family: inherit;
    font-size: 0.875rem;
    color: var(--p-text-color);
    background: var(--p-surface-0);
    border: 1px solid var(--p-border-color);
    border-radius: var(--p-border-radius);
    padding: 0.5rem 0.75rem;
    line-height: 1.25;
    transition: background 150ms ease, border-color 150ms ease, box-shadow 150ms ease, color 150ms ease;
    outline: none;
    box-sizing: border-box;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.02);
}

.p-inputtext:hover:not(:disabled):not(.is-invalid):not(.p-invalid) {
    border-color: var(--p-surface-400);
}

.p-inputtext:focus,
.p-inputtext:focus-visible {
    border-color: var(--p-primary-500) !important;
    box-shadow: 0 0 0 1px var(--p-primary-500) !important;
}

/* Variant: Filled */
.p-inputtext.variant-filled,
.p-inputtext.p-variant-filled {
    background: var(--p-surface-100);
    border-color: transparent;
}
.p-inputtext.variant-filled:hover:not(:disabled) {
    background: var(--p-surface-200);
}
.p-inputtext.variant-filled:focus {
    background: var(--p-surface-0);
    border-color: var(--p-primary-500) !important;
}

/* Sizes */
.p-inputtext.size-small,
.p-inputtext.p-inputtext-sm {
    padding: 0.3125rem 0.625rem;
    font-size: 0.75rem;
    border-radius: calc(var(--p-border-radius) - 2px);
}

.p-inputtext.size-large,
.p-inputtext.p-inputtext-lg {
    padding: 0.6875rem 1rem;
    font-size: 1.0625rem;
    border-radius: calc(var(--p-border-radius) + 2px);
}

/* Invalid State */
.p-inputtext.is-invalid,
.p-inputtext.p-invalid {
    border-color: var(--p-red-500, #ef4444) !important;
}
.p-inputtext.is-invalid:focus,
.p-inputtext.p-invalid:focus {
    box-shadow: 0 0 0 1px var(--p-red-500, #ef4444) !important;
}

/* Disabled State */
.p-inputtext:disabled,
.p-inputtext.is-disabled {
    background: var(--p-surface-100);
    color: var(--p-text-muted);
    opacity: 0.75;
    cursor: not-allowed;
}

/* Fluid State */
.p-inputtext.p-inputtext-fluid,
.p-inputtext.p-fluid {
    width: 100%;
}

/* Icons Integration */
.p-inputtext-icon {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    color: var(--p-surface-400);
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: none;
    z-index: 2;
    transition: color 150ms ease;
}
.p-inputtext-icon svg {
    width: 16px;
    height: 16px;
}
.p-inputtext-icon-left {
    left: 0.75rem;
}
.p-inputtext-icon-right {
    right: 0.75rem;
}

.has-icon-left .p-inputtext {
    padding-left: 2.25rem !important;
}
.has-icon-right .p-inputtext {
    padding-right: 2.25rem !important;
}
.has-clear .p-inputtext {
    padding-right: 2.25rem !important;
}
.has-icon-right.has-clear .p-inputtext {
    padding-right: 3.625rem !important;
}

/* Clear Icon Button (Zero-Flicker) */
.p-inputtext-clear {
    position: absolute;
    right: 0.625rem;
    top: 50%;
    transform: translateY(-50%);
    background: transparent;
    border: none;
    color: var(--p-surface-400);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.25rem;
    border-radius: 9999px;
    z-index: 3;
    transition: color 150ms ease, background 150ms ease, opacity 150ms ease;
}
.p-inputtext-clear:hover {
    background: var(--p-surface-200);
    color: var(--p-surface-700);
}
.p-inputtext-clear svg {
    width: 14px;
    height: 14px;
}
.has-icon-right.has-clear .p-inputtext-clear {
    right: 2.25rem;
}

/* Help Text */
.p-inputtext-help {
    font-size: 0.75rem;
    color: var(--p-text-muted);
    margin-top: 0.25rem;
    line-height: 1.25;
}

/* ==================== DARK MODE ==================== */
.dark .p-inputtext {
    background: var(--p-surface-900);
    border-color: var(--p-surface-700);
    color: var(--p-surface-0);
}
.dark .p-inputtext:hover:not(:disabled):not(.is-invalid):not(.p-invalid) {
    border-color: var(--p-surface-500);
}
.dark .p-inputtext.variant-filled,
.dark .p-inputtext.p-variant-filled {
    background: var(--p-surface-800);
}
.dark .p-inputtext.variant-filled:focus {
    background: var(--p-surface-900);
}
.dark .p-inputtext:disabled {
    background: var(--p-surface-800);
    border-color: var(--p-surface-700);
    color: var(--p-surface-500);
}
.dark .p-inputtext-clear:hover {
    background: var(--p-surface-700);
    color: var(--p-surface-200);
}
`,j='<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>';function F(a,t){v("laughtale-inputtext",A);let[h,d]=m({defaultValue:t.value??"",onChange:e=>{L(e)}}),p=t.fluid===!0||String(t.fluid)==="true",y=t.variant==="filled",w=t.disabled===!0||String(t.disabled)==="true",I=t.readonlyMode===!0||String(t.readonlyMode)==="true",c=t.invalid===!0||String(t.invalid)==="true",x=t.showClear===!0||t.clearable===!0||String(t.showClear)==="true"||String(t.clearable)==="true",k=t.iconLeft||(t.iconRight?"":t.icon),$=t.iconRight,g=t.inputId||t.id||"",b=t.name||t.targetInputName||"";function f(e){return e?s[e]?s[e]:e.startsWith("<svg")?e:"":""}let o=f(k),u=f($);function E(){let e=h(),i=["laughtale-inputtext-wrap","p-inputtext-wrap",p?"p-inputtext-fluid":"",o?"has-icon-left":"",u?"has-icon-right":"",x?"has-clear":""].filter(Boolean).join(" "),n=["p-inputtext",y?"variant-filled":"",t.size?`size-${t.size}`:"",c?"is-invalid":"",p?"p-inputtext-fluid":""].filter(Boolean).join(" ");a.className=i;let B=o?`<span class="p-inputtext-icon p-inputtext-icon-left">${o}</span>`:"",C=u?`<span class="p-inputtext-icon p-inputtext-icon-right">${u}</span>`:"",z=x?`
            <button type="button" class="p-inputtext-clear" aria-label="Clear text" tabindex="-1" style="display: ${e?"flex":"none"};">
                ${j}
            </button>
        `:"",T=g?`id="${r(g)}"`:"",D=b?`name="${r(b)}"`:"",N=t.ariaLabel?`aria-label="${r(t.ariaLabel)}"`:"",H=t.ariaLabelledBy?`aria-labelledby="${r(t.ariaLabelledBy)}"`:"",M=t.ariaDescribedBy?`aria-describedby="${r(t.ariaDescribedBy)}"`:"";if(a.innerHTML=`
            ${B}
            <input
                type="${t.type||"text"}"
                class="${n}"
                value="${r(e)}"
                placeholder="${r(t.placeholder||"")}"
                ${T}
                ${D}
                ${N}
                ${H}
                ${M}
                ${w?"disabled":""}
                ${I?"readonly":""}
                ${c?'aria-invalid="true"':""}
                autocomplete="off"
            />
            ${z}
            ${C}
        `,t.helpText){let l=document.createElement("small");l.className="p-inputtext-help",t.ariaDescribedBy&&(l.id=t.ariaDescribedBy),l.textContent=t.helpText,a.parentElement?.insertBefore(l,a.nextSibling)}S()}function r(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function S(){let e=a.querySelector("input.p-inputtext"),i=a.querySelector(".p-inputtext-clear");e&&(e.addEventListener("input",()=>{let n=e.value;d(n),i&&(i.style.display=n?"flex":"none"),a.dispatchEvent(new CustomEvent("inputtext:change",{bubbles:!0,detail:{value:n}}))}),e.addEventListener("change",()=>{a.dispatchEvent(new CustomEvent("inputtext:change",{bubbles:!0,detail:{value:e.value}}))}),i&&(i.addEventListener("mousedown",n=>n.preventDefault()),i.addEventListener("click",n=>{n.stopPropagation(),e.value="",d(""),i.style.display="none",e.focus(),a.dispatchEvent(new CustomEvent("inputtext:change",{bubbles:!0,detail:{value:""}})),a.dispatchEvent(new CustomEvent("inputtext:clear",{bubbles:!0})),e.dispatchEvent(new Event("input",{bubbles:!0}))})))}function L(e){if(t.targetInputName){let i=a.querySelector(`input[name="${t.targetInputName}"]`);i||(i=document.createElement("input"),i.type="hidden",i.name=t.targetInputName,a.appendChild(i)),i.value=e}}E()}export{F as default};
