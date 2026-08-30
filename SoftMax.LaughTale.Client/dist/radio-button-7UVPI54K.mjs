import{a as g}from"./chunk-P6B5FGGY.mjs";import{e as k}from"./chunk-3YU53HBK.mjs";var E=`
/* ==================== AURA RADIOBUTTON ==================== */
.laughtale-radio-root,
.p-radiobutton-root {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    user-select: none;
    font-family: var(--p-font-family, inherit);
    box-sizing: border-box;
}

.p-radiobutton {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 1.25rem;
    height: 1.25rem;
    flex-shrink: 0;
}

.p-radiobutton-input {
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
}

.p-radiobutton-box {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1.25rem;
    height: 1.25rem;
    border: 1px solid var(--p-border-color);
    border-radius: 50%;
    background: var(--p-surface-0);
    transition: background 150ms ease, border-color 150ms ease, box-shadow 150ms ease;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.02);
}

.p-radiobutton-root:hover:not(.is-disabled) .p-radiobutton-box {
    border-color: var(--p-surface-400);
}

.p-radiobutton-root.is-focused .p-radiobutton-box,
.p-radiobutton-input:focus-visible + .p-radiobutton-box {
    border-color: var(--p-primary-500) !important;
    box-shadow: 0 0 0 1px var(--p-primary-500) !important;
}

/* Checked State */
.p-radiobutton-root.is-checked .p-radiobutton-box,
.p-radiobutton.p-radiobutton-checked .p-radiobutton-box {
    border-color: var(--p-primary-500);
    background: var(--p-surface-0);
}

.p-radiobutton-icon {
    width: 0.625rem;
    height: 0.625rem;
    border-radius: 50%;
    background: var(--p-primary-500);
    transform: scale(0);
    transition: transform 150ms cubic-bezier(0.16, 1, 0.3, 1);
}

.p-radiobutton-root.is-checked .p-radiobutton-icon,
.p-radiobutton.p-radiobutton-checked .p-radiobutton-icon {
    transform: scale(1);
}

/* Filled Variant */
.p-radiobutton-root.variant-filled .p-radiobutton-box {
    background-color: var(--p-surface-100);
    border-color: transparent;
}
.p-radiobutton-root.variant-filled:hover:not(.is-disabled) .p-radiobutton-box {
    background-color: var(--p-surface-200);
}
.p-radiobutton-root.variant-filled.is-checked .p-radiobutton-box {
    background-color: var(--p-surface-0);
    border-color: var(--p-primary-500);
}

/* Sizes */
.p-radiobutton-root.size-small .p-radiobutton,
.p-radiobutton-root.size-small .p-radiobutton-box,
.p-radiobutton-sm .p-radiobutton-box {
    width: 1rem;
    height: 1rem;
}
.p-radiobutton-root.size-small .p-radiobutton-icon,
.p-radiobutton-sm .p-radiobutton-icon {
    width: 0.5rem;
    height: 0.5rem;
}
.p-radiobutton-root.size-small .p-radiobutton-label {
    font-size: 0.75rem;
}

.p-radiobutton-root.size-large .p-radiobutton,
.p-radiobutton-root.size-large .p-radiobutton-box,
.p-radiobutton-lg .p-radiobutton-box {
    width: 1.5rem;
    height: 1.5rem;
}
.p-radiobutton-root.size-large .p-radiobutton-icon,
.p-radiobutton-lg .p-radiobutton-icon {
    width: 0.75rem;
    height: 0.75rem;
}
.p-radiobutton-root.size-large .p-radiobutton-label {
    font-size: 1rem;
}

/* Invalid State */
.p-radiobutton-root.is-invalid .p-radiobutton-box {
    border-color: var(--p-red-500, #ef4444) !important;
}
.p-radiobutton-root.is-invalid.is-focused .p-radiobutton-box {
    box-shadow: 0 0 0 1px var(--p-red-500, #ef4444) !important;
}

/* Disabled State */
.p-radiobutton-root.is-disabled {
    opacity: 0.6;
    cursor: not-allowed;
}
.p-radiobutton-root.is-disabled .p-radiobutton-input,
.p-radiobutton-root.is-disabled .p-radiobutton-box {
    cursor: not-allowed;
    background-color: var(--p-surface-100);
}

/* Label */
.p-radiobutton-label {
    font-size: 0.875rem;
    color: var(--p-text-color);
    line-height: 1.25;
}

/* Card Mode */
.p-radiobutton-card {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.875rem 1.125rem;
    border: 1px solid var(--p-border-color);
    border-radius: var(--p-border-radius);
    background: var(--p-surface-0);
    cursor: pointer;
    transition: background 150ms ease, border-color 150ms ease, box-shadow 150ms ease;
    box-sizing: border-box;
    width: 100%;
}
.p-radiobutton-card:hover:not(.is-disabled) {
    background: var(--p-surface-50);
    border-color: var(--p-surface-400);
}
.p-radiobutton-card.is-checked {
    border-color: var(--p-surface-900);
    background: var(--p-surface-0);
    box-shadow: 0 0 0 1px var(--p-surface-900);
}
.p-radiobutton-card.is-disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background: var(--p-surface-100);
}

.p-radiobutton-card-content {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex: 1;
}

.p-radiobutton-card-title {
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--p-text-color);
    display: flex;
    align-items: center;
    gap: 0.5rem;
}
.p-radiobutton-card-desc {
    font-size: 0.75rem;
    color: var(--p-text-muted);
    margin-top: 0.125rem;
}
.p-radiobutton-card-badge {
    font-size: 0.6875rem;
    font-weight: 700;
    padding: 0.125rem 0.375rem;
    border-radius: calc(var(--p-border-radius) - 2px);
    background: var(--p-surface-100);
    color: var(--p-surface-700);
}
.p-radiobutton-card-price {
    font-size: 0.8125rem;
    font-weight: 600;
    color: var(--p-text-color);
    margin-right: 0.75rem;
}

/* Radio Group */
.p-radiogroup {
    display: flex;
    gap: 1rem;
}
.p-radiogroup.p-radiogroup-vertical {
    flex-direction: column;
}
.p-radiogroup.p-radiogroup-horizontal {
    flex-direction: row;
    flex-wrap: wrap;
}

/* ==================== DARK MODE ==================== */
.dark .p-radiobutton-box {
    background-color: var(--p-surface-900);
    border-color: var(--p-surface-700);
}
.dark .p-radiobutton-root:hover:not(.is-disabled) .p-radiobutton-box {
    border-color: var(--p-surface-500);
}
.dark .p-radiobutton-root.is-checked .p-radiobutton-box {
    border-color: var(--p-primary-400);
}
.dark .p-radiobutton-icon {
    background: var(--p-primary-400);
}
.dark .p-radiobutton-root.variant-filled .p-radiobutton-box {
    background-color: var(--p-surface-800);
}
.dark .p-radiobutton-root.variant-filled:hover:not(.is-disabled) .p-radiobutton-box {
    background-color: var(--p-surface-700);
}
.dark .p-radiobutton-root.variant-filled.is-checked .p-radiobutton-box {
    background-color: var(--p-surface-900);
    border-color: var(--p-primary-400);
}
.dark .p-radiobutton-label {
    color: var(--p-surface-100);
}
.dark .p-radiobutton-card {
    background: var(--p-surface-900);
    border-color: var(--p-surface-700);
}
.dark .p-radiobutton-card:hover:not(.is-disabled) {
    background: var(--p-surface-850, #141b26);
    border-color: var(--p-surface-600);
}
.dark .p-radiobutton-card.is-checked {
    border-color: var(--p-surface-0);
    box-shadow: 0 0 0 1px var(--p-surface-0);
}
.dark .p-radiobutton-card-badge {
    background: var(--p-surface-800);
    color: var(--p-surface-200);
}
.dark .p-radiobutton-card-price {
    color: var(--p-surface-0);
}
`;function H(e,o){k("laughtale-radio",E);let p=o.card===!0||String(o.card)==="true",x=o.variant==="filled",f=o.size||"normal",$=o.invalid===!0||String(o.invalid)==="true",l=o.disabled===!0||String(o.disabled)==="true",v=o.readonly===!0||String(o.readonly)==="true";if(o.options&&o.options.length>0){I();return}let r=!!o.checked||o.selectedValue!==void 0&&String(o.selectedValue)===String(o.value);function y(){let t=["laughtale-radio-root","p-radiobutton-root",p?"p-radiobutton-card":"",r?"is-checked":"",x?"variant-filled":"",f!=="normal"?`size-${f}`:"",$?"is-invalid":"",l?"is-disabled":""].filter(Boolean).join(" ");p?e.innerHTML=`
                <label class="${t}">
                    <div class="p-radiobutton-card-content">
                        ${o.flag?`<span style="font-size: 1.25rem; line-height: 1;">${o.flag}</span>`:""}
                        ${o.icon?`<span style="color: var(--p-primary-600); display: flex;">${g(o.icon,18)}</span>`:""}
                        <div>
                            <div class="p-radiobutton-card-title">
                                <span>${o.label||o.value}</span>
                                ${o.badge?`<span class="p-radiobutton-card-badge">${o.badge}</span>`:""}
                            </div>
                            ${o.description?`<div class="p-radiobutton-card-desc">${o.description}</div>`:""}
                        </div>
                    </div>
                    <div style="display: flex; align-items: center;">
                        ${o.price?`<span class="p-radiobutton-card-price">${o.price}</span>`:""}
                        <div class="p-radiobutton ${r?"p-radiobutton-checked":""}">
                            <input 
                                type="radio" 
                                class="p-radiobutton-input"
                                name="${o.name}"
                                value="${o.value}"
                                ${r?"checked":""}
                                ${l?"disabled":""}
                                ${v?"readonly":""}
                                ${o.inputId?`id="${o.inputId}"`:""}
                            />
                            <div class="p-radiobutton-box">
                                <div class="p-radiobutton-icon"></div>
                            </div>
                        </div>
                    </div>
                </label>
                <input type="hidden" name="${o.targetInputName||""}" value="${r?o.value:""}" />
            `:e.innerHTML=`
                <label class="${t}">
                    <div class="p-radiobutton ${r?"p-radiobutton-checked":""}">
                        <input 
                            type="radio" 
                            class="p-radiobutton-input"
                            name="${o.name}"
                            value="${o.value}"
                            ${r?"checked":""}
                            ${l?"disabled":""}
                            ${v?"readonly":""}
                            ${o.inputId?`id="${o.inputId}"`:""}
                        />
                        <div class="p-radiobutton-box">
                            <div class="p-radiobutton-icon"></div>
                        </div>
                    </div>
                    ${o.label?`<span class="p-radiobutton-label">${o.label}</span>`:""}
                </label>
                <input type="hidden" name="${o.targetInputName||""}" value="${r?o.value:""}" />
            `,L()}function z(t){r=t;let d=e.querySelector(".p-radiobutton-root"),i=e.querySelector(".p-radiobutton"),u=e.querySelector('input[type="hidden"]');d&&(r?d.classList.add("is-checked"):d.classList.remove("is-checked")),i&&(r?i.classList.add("p-radiobutton-checked"):i.classList.remove("p-radiobutton-checked")),u&&o.targetInputName&&(u.value=r?o.value:"")}function L(){let t=e.querySelector(".p-radiobutton-input");t&&(t.addEventListener("change",()=>{l||v||(z(t.checked),w(),S())}),t.addEventListener("focus",()=>{e.querySelector(".p-radiobutton-root")?.classList.add("is-focused")}),t.addEventListener("blur",()=>{e.querySelector(".p-radiobutton-root")?.classList.remove("is-focused")}))}function w(){document.querySelectorAll(`input[type="radio"][name="${o.name}"]`).forEach(t=>{if(t!==e.querySelector(".p-radiobutton-input")){let d=t.closest(".p-radiobutton-root"),i=t.closest(".p-radiobutton");d&&(t.checked?d.classList.add("is-checked"):d.classList.remove("is-checked")),i&&(t.checked?i.classList.add("p-radiobutton-checked"):i.classList.remove("p-radiobutton-checked"))}})}function S(){r&&e.dispatchEvent(new CustomEvent("radio:change",{bubbles:!0,detail:{value:o.value,checked:r}}))}function I(){let d=["p-radiogroup",o.layout==="horizontal"?"p-radiogroup-horizontal":"p-radiogroup-vertical"].join(" "),i=o.selectedValue??o.value??"",u=(o.options||[]).map(a=>typeof a=="string"?{label:a,value:a}:a);e.className=d,e.innerHTML=u.map((a,s)=>{let n=String(a.value)===String(i),c=`${o.name}_${s}`,b=l||a.disabled;return p?`
                    <label class="p-radiobutton-root p-radiobutton-card ${n?"is-checked":""} ${b?"is-disabled":""}">
                        <div class="p-radiobutton-card-content">
                            ${a.flag?`<span style="font-size: 1.25rem; line-height: 1;">${a.flag}</span>`:""}
                            ${a.icon?`<span style="color: var(--p-primary-600); display: flex;">${g(a.icon,18)}</span>`:""}
                            <div>
                                <div class="p-radiobutton-card-title">
                                    <span>${a.label||a.value}</span>
                                    ${a.badge?`<span class="p-radiobutton-card-badge">${a.badge}</span>`:""}
                                </div>
                                ${a.description?`<div class="p-radiobutton-card-desc">${a.description}</div>`:""}
                            </div>
                        </div>
                        <div style="display: flex; align-items: center;">
                            ${a.price?`<span class="p-radiobutton-card-price">${a.price}</span>`:""}
                            <div class="p-radiobutton ${n?"p-radiobutton-checked":""}">
                                <input 
                                    type="radio" 
                                    class="p-radiobutton-input"
                                    name="${o.name}"
                                    value="${a.value}"
                                    id="${c}"
                                    ${n?"checked":""}
                                    ${b?"disabled":""}
                                />
                                <div class="p-radiobutton-box">
                                    <div class="p-radiobutton-icon"></div>
                                </div>
                            </div>
                        </div>
                    </label>
                `:`
                    <label class="p-radiobutton-root ${n?"is-checked":""} ${b?"is-disabled":""}">
                        <div class="p-radiobutton ${n?"p-radiobutton-checked":""}">
                            <input 
                                type="radio" 
                                class="p-radiobutton-input"
                                name="${o.name}"
                                value="${a.value}"
                                id="${c}"
                                ${n?"checked":""}
                                ${b?"disabled":""}
                            />
                            <div class="p-radiobutton-box">
                                <div class="p-radiobutton-icon"></div>
                            </div>
                        </div>
                        <span class="p-radiobutton-label">${a.label}</span>
                    </label>
                `}).join("")+`<input type="hidden" name="${o.targetInputName||o.name}" value="${i}" />`;let m=e.querySelectorAll(".p-radiobutton-input"),h=e.querySelector('input[type="hidden"]');m.forEach(a=>{a.addEventListener("change",()=>{m.forEach(s=>{let n=s.closest(".p-radiobutton-root"),c=s.closest(".p-radiobutton");s.checked?(n?.classList.add("is-checked"),c?.classList.add("p-radiobutton-checked")):(n?.classList.remove("is-checked"),c?.classList.remove("p-radiobutton-checked"))}),h&&(h.value=a.value),e.dispatchEvent(new CustomEvent("radiogroup:change",{bubbles:!0,detail:{value:a.value}}))})})}y()}export{H as default};
