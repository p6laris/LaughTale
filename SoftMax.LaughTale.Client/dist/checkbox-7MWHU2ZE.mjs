import{b as i}from"./chunk-P6B5FGGY.mjs";import{e as b}from"./chunk-3YU53HBK.mjs";var g=`
.laughtale-checkbox-wrap {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    user-select: none;
    font-family: var(--p-font-family, inherit);
    vertical-align: middle;
}
.laughtale-checkbox-wrap.disabled {
    opacity: 0.6;
    cursor: not-allowed;
    pointer-events: none;
}

.laughtale-checkbox-box {
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--p-surface-0);
    border: 1px solid var(--p-border-color);
    border-radius: calc(var(--p-border-radius) - 2px);
    transition: background 150ms cubic-bezier(0.4, 0, 0.2, 1), 
                border-color 150ms ease, 
                box-shadow 150ms ease;
    box-sizing: border-box;
    flex-shrink: 0;
    color: #ffffff;
}

/* Variants */
.laughtale-checkbox-wrap.variant-filled .laughtale-checkbox-box {
    background: var(--p-surface-50);
}

/* Sizes */
.laughtale-checkbox-wrap.size-small .laughtale-checkbox-box {
    width: 1rem;
    height: 1rem;
    border-radius: calc(var(--p-border-radius) - 3px);
}
.laughtale-checkbox-wrap.size-small .laughtale-checkbox-icon {
    width: 10px;
    height: 10px;
}
.laughtale-checkbox-wrap.size-small .laughtale-checkbox-label {
    font-size: 0.8125rem;
}

.laughtale-checkbox-wrap.size-normal .laughtale-checkbox-box {
    width: 1.25rem;
    height: 1.25rem;
    border-radius: calc(var(--p-border-radius) - 2px);
}
.laughtale-checkbox-wrap.size-normal .laughtale-checkbox-icon {
    width: 12px;
    height: 12px;
}
.laughtale-checkbox-wrap.size-normal .laughtale-checkbox-label {
    font-size: 0.875rem;
}

.laughtale-checkbox-wrap.size-large .laughtale-checkbox-box {
    width: 1.5rem;
    height: 1.5rem;
    border-radius: calc(var(--p-border-radius) - 1px);
}
.laughtale-checkbox-wrap.size-large .laughtale-checkbox-icon {
    width: 15px;
    height: 15px;
}
.laughtale-checkbox-wrap.size-large .laughtale-checkbox-label {
    font-size: 1rem;
}

/* Hover States */
.laughtale-checkbox-wrap:hover:not(.disabled) .laughtale-checkbox-box {
    border-color: var(--p-primary-500);
}
.laughtale-checkbox-wrap:hover:not(.disabled).checked .laughtale-checkbox-box,
.laughtale-checkbox-wrap:hover:not(.disabled).indeterminate .laughtale-checkbox-box {
    background: var(--p-primary-600);
    border-color: var(--p-primary-600);
}

/* Focus States (Radix Focus Ring) */
.laughtale-checkbox-wrap:focus-within:not(.disabled) .laughtale-checkbox-box {
    box-shadow: 0 0 0 1px var(--p-surface-0), 0 0 0 3px var(--p-primary-500);
    border-color: var(--p-primary-500);
}

/* Checked & Indeterminate States */
.laughtale-checkbox-wrap.checked .laughtale-checkbox-box,
.laughtale-checkbox-wrap.indeterminate .laughtale-checkbox-box {
    background: var(--p-primary-500);
    border-color: var(--p-primary-500);
    color: #ffffff;
}

/* Invalid State */
.laughtale-checkbox-wrap.invalid .laughtale-checkbox-box {
    border-color: #ef4444 !important;
}
.laughtale-checkbox-wrap.invalid:focus-within:not(.disabled) .laughtale-checkbox-box {
    box-shadow: 0 0 0 1px var(--p-surface-0), 0 0 0 3px #ef4444;
}

/* Icon Micro-Interaction */
.laughtale-checkbox-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    transform: scale(0);
    opacity: 0;
    transition: transform 150ms cubic-bezier(0.16, 1, 0.3, 1), opacity 150ms ease;
}
.laughtale-checkbox-wrap.checked .laughtale-checkbox-icon,
.laughtale-checkbox-wrap.indeterminate .laughtale-checkbox-icon {
    transform: scale(1);
    opacity: 1;
}

.laughtale-checkbox-label {
    color: var(--p-text-color);
    font-weight: 500;
    transition: color 150ms ease;
}

.laughtale-checkbox-hidden {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
    margin: 0;
    pointer-events: none;
}

/* Dark Mode Tokens */
.dark .laughtale-checkbox-box {
    background: var(--p-surface-900);
    border-color: var(--p-surface-700);
}
.dark .laughtale-checkbox-wrap.variant-filled .laughtale-checkbox-box {
    background: var(--p-surface-800);
}
.dark .laughtale-checkbox-wrap:hover:not(.disabled) .laughtale-checkbox-box {
    border-color: var(--p-primary-400);
    background: var(--p-surface-800);
}
.dark .laughtale-checkbox-wrap.checked .laughtale-checkbox-box,
.dark .laughtale-checkbox-wrap.indeterminate .laughtale-checkbox-box {
    background: var(--p-primary-500);
    border-color: var(--p-primary-500);
    color: var(--p-surface-950);
}
.dark .laughtale-checkbox-wrap:hover:not(.disabled).checked .laughtale-checkbox-box,
.dark .laughtale-checkbox-wrap:hover:not(.disabled).indeterminate .laughtale-checkbox-box {
    background: var(--p-primary-400);
    border-color: var(--p-primary-400);
}
.dark .laughtale-checkbox-wrap:focus-within:not(.disabled) .laughtale-checkbox-box {
    box-shadow: 0 0 0 1px var(--p-surface-900), 0 0 0 3px var(--p-primary-500);
}
.dark .laughtale-checkbox-label {
    color: var(--p-surface-100);
}
`;function p(r,e){b("laughtale-checkbox",g);let c=!!e.checked,o=!!e.indeterminate,d=e.size||"normal",u=e.variant||"outlined",t=e.inputId||`chk_${Math.random().toString(36).substring(2,9)}`;function h(){let a=o?"indeterminate":c?"checked":"",l=o?i.minus:i.check;r.innerHTML=`
            <label class="laughtale-checkbox-wrap size-${d} variant-${u} ${a} ${e.disabled?"disabled":""} ${e.invalid?"invalid":""}" 
                   for="${t}">
                <input type="checkbox" 
                       id="${t}" 
                       class="laughtale-checkbox-hidden" 
                       ${c?"checked":""} 
                       ${e.disabled?"disabled":""} 
                       aria-checked="${o?"mixed":c?"true":"false"}" 
                       role="checkbox" />
                <div class="laughtale-checkbox-box" tabindex="${e.disabled?-1:0}">
                    <span class="laughtale-checkbox-icon">
                        ${l}
                    </span>
                </div>
                ${e.label?`<span class="laughtale-checkbox-label">${e.label}</span>`:""}
            </label>
        `,s(),k()}function s(){let a=r.querySelector(`#${t}`),l=r.querySelector(".laughtale-checkbox-box");!a||e.disabled||(a.addEventListener("change",()=>{c=a.checked,o=!1,h(),x()}),l?.addEventListener("keydown",n=>{n.key===" "&&(n.preventDefault(),a.click())}))}function x(){r.dispatchEvent(new CustomEvent("checkbox:change",{bubbles:!0,detail:{checked:c,indeterminate:o,value:e.value||c}}))}function k(){let a=e.targetInputName||e.name;if(a){let l=r.querySelector(`input[type="hidden"][name="${a}"]`);l||(l=document.createElement("input"),l.type="hidden",l.name=a,r.appendChild(l)),l.value=c?e.value||"true":"false"}}h()}export{p as default};
