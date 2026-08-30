import{e as F}from"./chunk-3YU53HBK.mjs";var q=`
.laughtale-inputnumber,
.p-inputnumber {
    display: inline-flex;
    align-items: stretch;
    position: relative;
    font-family: var(--p-font-family, inherit);
    background: var(--p-surface-0);
    border: 1px solid var(--p-border-color);
    border-radius: var(--p-border-radius);
    transition: border-color 150ms ease, box-shadow 150ms ease, background 150ms ease;
    box-sizing: border-box;
    min-height: 2.5rem;
    overflow: hidden;
    vertical-align: middle;
}

.p-inputnumber.p-inputnumber-fluid {
    display: flex;
    width: 100%;
}

.p-inputnumber:hover:not(.is-disabled) {
    border-color: var(--p-surface-400);
}

.p-inputnumber:focus-within:not(.is-disabled) {
    border-color: var(--p-primary-500) !important;
    box-shadow: 0 0 0 1px var(--p-primary-500) !important;
}

.p-inputnumber.is-disabled {
    background: var(--p-surface-100);
    opacity: 0.75;
    cursor: not-allowed;
}

/* Variant: Filled */
.p-inputnumber.variant-filled {
    background: var(--p-surface-100);
    border-color: transparent;
}
.p-inputnumber.variant-filled:focus-within {
    background: var(--p-surface-0);
    border-color: var(--p-primary-500) !important;
}

/* Invalid State */
.p-inputnumber.is-invalid {
    border-color: var(--p-red-500, #ef4444) !important;
}
.p-inputnumber.is-invalid:focus-within {
    box-shadow: 0 0 0 1px var(--p-red-500, #ef4444) !important;
}

/* Sizes */
.p-inputnumber.size-small {
    min-height: 2rem;
}
.p-inputnumber.size-small .p-inputnumber-input {
    font-size: 0.75rem;
    padding: 0.25rem 0.5rem;
}
.p-inputnumber.size-large {
    min-height: 3rem;
}
.p-inputnumber.size-large .p-inputnumber-input {
    font-size: 1rem;
    padding: 0.75rem 1rem;
}

/* Inner Input */
.p-inputnumber-input {
    flex: 1 1 auto;
    width: 100%;
    min-width: 0;
    font-family: inherit;
    font-size: 0.875rem;
    color: var(--p-text-color);
    background: transparent;
    border: none;
    outline: none;
    padding: 0.5rem 0.75rem;
    box-sizing: border-box;
    font-variant-numeric: tabular-nums;
    height: 100%;
}
.p-inputnumber-input:disabled {
    color: var(--p-text-muted);
    cursor: not-allowed;
}

/* Clear Icon */
.p-inputnumber-clear-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: var(--p-text-muted);
    cursor: pointer;
    border: none;
    background: transparent;
    padding: 0 0.5rem;
    transition: color 150ms ease;
}
.p-inputnumber-clear-icon:hover {
    color: var(--p-text-color);
}
.p-inputnumber-clear-icon svg {
    width: 14px;
    height: 14px;
}

/* ==================== BUTTONS ==================== */

/* Shared Button Styles */
.p-inputnumber-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: var(--p-surface-100);
    color: var(--p-surface-600);
    border: none;
    cursor: pointer;
    user-select: none;
    -webkit-user-select: none;
    transition: background 150ms ease, color 150ms ease;
    padding: 0;
    box-sizing: border-box;
}
.p-inputnumber-button:hover:not(:disabled) {
    background: var(--p-surface-200);
    color: var(--p-surface-900);
}
.p-inputnumber-button:active:not(:disabled) {
    background: var(--p-surface-300);
}
.p-inputnumber-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}
.p-inputnumber-button svg {
    width: 12px;
    height: 12px;
    display: block;
}

/* Layout 1: Stacked (Default) */
.p-inputnumber-button-group {
    display: flex;
    flex-direction: column;
    width: 2.25rem;
    border-left: 1px solid var(--p-border-color);
    background: var(--p-surface-100);
    flex-shrink: 0;
}
.p-inputnumber:focus-within .p-inputnumber-button-group {
    border-left-color: var(--p-primary-500);
}
.p-inputnumber-stacked .p-inputnumber-button-up {
    flex: 1;
    border-bottom: 1px solid var(--p-border-color);
}
.p-inputnumber-stacked:focus-within .p-inputnumber-button-up {
    border-bottom-color: var(--p-primary-500);
}
.p-inputnumber-stacked .p-inputnumber-button-down {
    flex: 1;
}

/* Layout 2: Horizontal */
.p-inputnumber-horizontal .p-inputnumber-button-down {
    width: 2.5rem;
    border-right: 1px solid var(--p-border-color);
    flex-shrink: 0;
}
.p-inputnumber-horizontal:focus-within .p-inputnumber-button-down {
    border-right-color: var(--p-primary-500);
}
.p-inputnumber-horizontal .p-inputnumber-input {
    text-align: center;
}
.p-inputnumber-horizontal .p-inputnumber-button-up {
    width: 2.5rem;
    border-left: 1px solid var(--p-border-color);
    flex-shrink: 0;
}
.p-inputnumber-horizontal:focus-within .p-inputnumber-button-up {
    border-left-color: var(--p-primary-500);
}

/* Layout 3: Vertical */
.p-inputnumber-vertical {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    width: auto;
    min-height: auto;
}
.p-inputnumber-vertical .p-inputnumber-button-up {
    width: 100%;
    height: 2rem;
    border-bottom: 1px solid var(--p-border-color);
}
.p-inputnumber-vertical:focus-within .p-inputnumber-button-up {
    border-bottom-color: var(--p-primary-500);
}
.p-inputnumber-vertical .p-inputnumber-input {
    text-align: center;
    width: 3.5rem;
    height: 2.5rem;
}
.p-inputnumber-vertical .p-inputnumber-button-down {
    width: 100%;
    height: 2rem;
    border-top: 1px solid var(--p-border-color);
}
.p-inputnumber-vertical:focus-within .p-inputnumber-button-down {
    border-top-color: var(--p-primary-500);
}

/* ==================== DARK MODE ==================== */
.dark .laughtale-inputnumber,
.dark .p-inputnumber {
    background: var(--p-surface-900);
    border-color: var(--p-surface-700);
}
.dark .p-inputnumber:hover:not(.is-disabled) {
    border-color: var(--p-surface-600);
}
.dark .p-inputnumber.variant-filled {
    background: var(--p-surface-800);
}
.dark .p-inputnumber.variant-filled:focus-within {
    background: var(--p-surface-900);
}
.dark .p-inputnumber-input {
    color: var(--p-surface-0);
}
.dark .p-inputnumber-button-group,
.dark .p-inputnumber-button {
    background: var(--p-surface-800);
    color: var(--p-surface-400);
}
.dark .p-inputnumber:focus-within .p-inputnumber-button-group,
.dark .p-inputnumber:focus-within .p-inputnumber-button-up,
.dark .p-inputnumber:focus-within .p-inputnumber-button-down {
    border-color: var(--p-primary-500);
}
.dark .p-inputnumber-button:hover:not(:disabled) {
    background: var(--p-surface-700);
    color: var(--p-surface-100);
}
.dark .p-inputnumber-button:active:not(:disabled) {
    background: var(--p-surface-600);
}
`;function A(u,e){F("laughtale-inputnumber",q);let o=e.value!==void 0&&e.value!==null?Number(e.value):null,k=e.step!==void 0?Number(e.step):1,a=e.min!==void 0?Number(e.min):void 0,l=e.max!==void 0?Number(e.max):void 0,D=e.mode==="currency",h=e.currency||"USD",B=e.currencyDisplay||"symbol",I=e.locale||void 0,$=e.useGrouping!==!1&&String(e.useGrouping)!=="false",b=e.buttonLayout||"stacked",f=e.showButtons===!0||String(e.showButtons)==="true",C=e.fluid===!0||String(e.fluid)==="true",L=e.invalid===!0||String(e.invalid)==="true",M=e.variant==="filled",v=e.disabled===!0||String(e.disabled)==="true",T=e.showClear===!0||String(e.showClear)==="true",c=e.minFractionDigits!==void 0?Number(e.minFractionDigits):void 0,m=e.maxFractionDigits!==void 0?Number(e.maxFractionDigits):void 0;c===void 0&&m===void 0&&(D?(c=h==="JPY"?0:2,m=h==="JPY"?0:2):(c=0,m=20));function p(t){if(t===null||isNaN(t))return"";let n="";try{D?n=new Intl.NumberFormat(I,{style:"currency",currency:h,currencyDisplay:B,useGrouping:$,minimumFractionDigits:c,maximumFractionDigits:m}).format(t):n=new Intl.NumberFormat(I,{style:"decimal",useGrouping:$,minimumFractionDigits:c,maximumFractionDigits:m}).format(t)}catch{n=t.toString()}return e.prefix&&!n.startsWith(e.prefix)&&(n=`${e.prefix}${n}`),e.suffix&&!n.endsWith(e.suffix)&&(n=`${n}${e.suffix}`),n}function x(t){if(!t||!t.trim())return null;let n=t;e.prefix&&(n=n.replace(e.prefix,"")),e.suffix&&(n=n.replace(e.suffix,"")),n=n.replace(/[^\d.,-]/g,"").trim(),n.indexOf(",")>-1&&n.indexOf(".")===-1?n=n.replace(",","."):n.indexOf(",")>-1&&n.indexOf(".")>-1&&(n.lastIndexOf(",")>n.lastIndexOf(".")?n=n.replace(/\./g,"").replace(",","."):n=n.replace(/,/g,""));let i=parseFloat(n);return isNaN(i)?null:i}function H(){u.innerHTML="",u.className="laughtale-inputnumber p-inputnumber",C&&u.classList.add("p-inputnumber-fluid"),M&&u.classList.add("variant-filled"),e.size&&u.classList.add(`size-${e.size}`),L&&u.classList.add("is-invalid"),v&&u.classList.add("is-disabled"),f&&u.classList.add(`p-inputnumber-${b}`);let t=e.inputId?`id="${e.inputId}"`:"",n=e.placeholder?`placeholder="${e.placeholder}"`:"",i=v?"disabled":"",g=p(o),r='<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m18 15-6-6-6 6"/></svg>',y='<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>',z='<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>',N='<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/></svg>',O='<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>',d="";f&&b==="horizontal"?d+=`
                <button type="button" class="p-inputnumber-button p-inputnumber-button-down" tabindex="-1" ${i} aria-label="Decrement">
                    ${N}
                </button>
            `:f&&b==="vertical"&&(d+=`
                <button type="button" class="p-inputnumber-button p-inputnumber-button-up" tabindex="-1" ${i} aria-label="Increment">
                    ${z}
                </button>
            `),d+=`
            <input type="text"
                class="p-inputnumber-input ${e.inputClass||""}"
                ${t}
                ${n}
                ${i}
                value="${g}"
                role="spinbutton"
                aria-valuenow="${o??""}"
                ${a!==void 0?`aria-valuemin="${a}"`:""}
                ${l!==void 0?`aria-valuemax="${l}"`:""}
                ${L?'aria-invalid="true"':""}
                autocomplete="off"
            />
        `,T&&o!==null&&!v&&(d+=`
                <button type="button" class="p-inputnumber-clear-icon" aria-label="Clear value" tabindex="-1">
                    ${O}
                </button>
            `),f&&(b==="stacked"?d+=`
                    <div class="p-inputnumber-button-group">
                        <button type="button" class="p-inputnumber-button p-inputnumber-button-up" tabindex="-1" ${i} aria-label="Increment">
                            ${r}
                        </button>
                        <button type="button" class="p-inputnumber-button p-inputnumber-button-down" tabindex="-1" ${i} aria-label="Decrement">
                            ${y}
                        </button>
                    </div>
                `:b==="horizontal"?d+=`
                    <button type="button" class="p-inputnumber-button p-inputnumber-button-up" tabindex="-1" ${i} aria-label="Increment">
                        ${z}
                    </button>
                `:b==="vertical"&&(d+=`
                    <button type="button" class="p-inputnumber-button p-inputnumber-button-down" tabindex="-1" ${i} aria-label="Decrement">
                        ${N}
                    </button>
                `)),u.innerHTML=d,j()}function j(){let t=u.querySelector(".p-inputnumber-input"),n=u.querySelector(".p-inputnumber-clear-icon"),i=u.querySelector(".p-inputnumber-button-up"),g=u.querySelector(".p-inputnumber-button-down");t.addEventListener("blur",()=>{let r=x(t.value);s(r),t.value=p(o)}),t.addEventListener("input",()=>{o=x(t.value),w()}),t.addEventListener("keydown",r=>{if(!v){if(r.key==="ArrowUp")r.preventDefault(),E();else if(r.key==="ArrowDown")r.preventDefault(),S();else if(r.key==="Home"&&a!==void 0)r.preventDefault(),s(a),t.value=p(o);else if(r.key==="End"&&l!==void 0)r.preventDefault(),s(l),t.value=p(o);else if(r.key==="Enter"){let y=x(t.value);s(y),t.value=p(o)}}}),i?.addEventListener("mousedown",r=>{r.preventDefault()}),i?.addEventListener("click",r=>{r.preventDefault(),E()}),g?.addEventListener("mousedown",r=>{r.preventDefault()}),g?.addEventListener("click",r=>{r.preventDefault(),S()}),n?.addEventListener("mousedown",r=>{r.preventDefault()}),n?.addEventListener("click",r=>{r.preventDefault(),s(null),t.value="",t.focus()})}function E(){let n=(o??0)+k;l!==void 0&&n>l&&(n=l),s(n);let i=u.querySelector(".p-inputnumber-input");i&&(i.value=p(o))}function S(){let n=(o??0)-k;a!==void 0&&n<a&&(n=a),s(n);let i=u.querySelector(".p-inputnumber-input");i&&(i.value=p(o))}function s(t){t!==null&&(a!==void 0&&t<a&&(t=a),l!==void 0&&t>l&&(t=l)),o=t,w(),u.dispatchEvent(new CustomEvent("inputnumber:change",{bubbles:!0,detail:{value:o}}))}function w(){if(e.targetInputName){let t=u.querySelector(`input[name="${e.targetInputName}"]`);t||(t=document.createElement("input"),t.type="hidden",t.name=e.targetInputName,u.appendChild(t)),t.value=o!==null?o.toString():""}}H(),w()}export{A as default};
