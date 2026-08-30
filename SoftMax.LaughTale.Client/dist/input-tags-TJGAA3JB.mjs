import{a as A}from"./chunk-36AEYHZF.mjs";import{e as M}from"./chunk-3YU53HBK.mjs";var V=`
.laughtale-inputtags,
.p-inputtags {
    display: inline-flex;
    flex-wrap: wrap;
    align-items: center;
    position: relative;
    font-family: var(--p-font-family, inherit);
    box-sizing: border-box;
    width: auto;
    min-height: 2.5rem;
    padding: 0.25rem 0.5rem;
    gap: 0.375rem;
    background: var(--p-surface-0);
    border: 1px solid var(--p-border-color);
    border-radius: var(--p-border-radius);
    transition: border-color 150ms ease, box-shadow 150ms ease, background 150ms ease;
    cursor: text;
}

.p-inputtags.p-inputtags-fluid {
    display: flex;
    width: 100%;
}

.p-inputtags:hover:not(.is-disabled) {
    border-color: var(--p-surface-400);
}

.p-inputtags:focus-within:not(.is-disabled) {
    border-color: var(--p-primary-500) !important;
    box-shadow: 0 0 0 1px var(--p-primary-500) !important;
}

/* Variant: Filled */
.p-inputtags.variant-filled {
    background: var(--p-surface-100);
    border-color: transparent;
}
.p-inputtags.variant-filled:focus-within {
    background: var(--p-surface-0);
    border-color: var(--p-primary-500) !important;
}

/* Invalid State */
.p-inputtags.is-invalid {
    border-color: var(--p-red-500, #ef4444) !important;
}
.p-inputtags.is-invalid:focus-within {
    box-shadow: 0 0 0 1px var(--p-red-500, #ef4444) !important;
}

/* Disabled State */
.p-inputtags.is-disabled {
    background: var(--p-surface-100);
    opacity: 0.75;
    cursor: not-allowed;
}

/* Sizes */
.p-inputtags.size-small {
    min-height: 2rem;
    padding: 0.125rem 0.375rem;
    gap: 0.25rem;
}
.p-inputtags.size-small .p-inputtags-tag {
    font-size: 0.75rem;
    padding: 0.125rem 0.375rem;
}
.p-inputtags.size-small .p-inputtags-input {
    font-size: 0.75rem;
}

.p-inputtags.size-large {
    min-height: 3rem;
    padding: 0.375rem 0.75rem;
    gap: 0.5rem;
}
.p-inputtags.size-large .p-inputtags-tag {
    font-size: 0.9375rem;
    padding: 0.25rem 0.625rem;
}
.p-inputtags.size-large .p-inputtags-input {
    font-size: 1rem;
}

/* Tags / Chips */
.p-inputtags-tag {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    background: var(--p-surface-100);
    color: var(--p-surface-800);
    border: 1px solid var(--p-surface-200);
    border-radius: var(--p-border-radius);
    padding: 0.1875rem 0.5rem;
    font-size: 0.8125rem;
    font-weight: 500;
    line-height: 1.2;
    transition: background 150ms ease, border-color 150ms ease, color 150ms ease;
    user-select: none;
}

.p-inputtags-tag:focus,
.p-inputtags-tag.is-focused {
    outline: none;
    border-color: var(--p-primary-500);
    background: var(--p-primary-50);
    color: var(--p-primary-700);
}

.p-inputtags-tag-remove {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: none;
    background: transparent;
    color: var(--p-surface-400);
    cursor: pointer;
    padding: 0;
    margin: 0;
    border-radius: 9999px;
    transition: color 150ms ease, background 150ms ease;
}
.p-inputtags-tag-remove:hover {
    color: var(--p-surface-700);
}
.p-inputtags-tag-remove svg {
    width: 14px;
    height: 14px;
}

/* Native Input Field */
.p-inputtags-input {
    flex: 1 1 60px;
    min-width: 60px;
    border: none !important;
    outline: none !important;
    background: transparent !important;
    font-family: inherit;
    font-size: 0.875rem;
    color: var(--p-text-color);
    padding: 0.1875rem 0.25rem !important;
    margin: 0 !important;
    box-sizing: border-box;
    line-height: 1.2;
    box-shadow: none !important;
}
.p-inputtags-input:disabled {
    cursor: not-allowed;
    color: var(--p-text-muted);
}

/* ==================== TYPEAHEAD SUGGESTIONS DROPDOWN ==================== */
.p-inputtags-panel {
    position: absolute;
    top: calc(100% + 4px);
    left: 0;
    width: 100%;
    min-width: 180px;
    background: var(--p-surface-0);
    border: 1px solid var(--p-border-color);
    border-radius: var(--p-border-radius);
    box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1);
    z-index: 1000;
    max-height: 220px;
    overflow-y: auto;
    padding: 0.25rem;
    display: flex;
    flex-direction: column;
    gap: 0.125rem;
    animation: pInputTagsFadeIn 150ms ease;
}
@keyframes pInputTagsFadeIn {
    from { opacity: 0; transform: translateY(-4px); }
    to { opacity: 1; transform: translateY(0); }
}

.p-inputtags-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 0.75rem;
    border-radius: calc(var(--p-border-radius) - 2px);
    font-size: 0.875rem;
    color: var(--p-text-color);
    cursor: pointer;
    transition: background 120ms ease;
    user-select: none;
}
.p-inputtags-item:hover,
.p-inputtags-item.is-highlighted {
    background: var(--p-surface-100);
    color: var(--p-surface-900);
}

/* ==================== DARK MODE ==================== */
.dark .p-inputtags {
    background: var(--p-surface-900);
    border-color: var(--p-surface-700);
}
.dark .p-inputtags:hover:not(.is-disabled) {
    border-color: var(--p-surface-600);
}
.dark .p-inputtags.variant-filled {
    background: var(--p-surface-800);
}
.dark .p-inputtags.variant-filled:focus-within {
    background: var(--p-surface-900);
}
.dark .p-inputtags-tag {
    background: var(--p-surface-800);
    color: var(--p-surface-100);
    border-color: var(--p-surface-700);
}
.dark .p-inputtags-tag:focus,
.dark .p-inputtags-tag.is-focused {
    background: var(--p-surface-700);
    border-color: var(--p-primary-500);
    color: var(--p-primary-300);
}
.dark .p-inputtags-tag-remove {
    color: var(--p-surface-400);
}
.dark .p-inputtags-tag-remove:hover {
    color: var(--p-surface-100);
}
.dark .p-inputtags-input {
    color: var(--p-surface-0);
}
.dark .p-inputtags-panel {
    background: var(--p-surface-900);
    border-color: var(--p-surface-700);
    box-shadow: 0 10px 25px -5px rgba(0,0,0,0.5);
}
.dark .p-inputtags-item:hover,
.dark .p-inputtags-item.is-highlighted {
    background: var(--p-surface-800);
    color: var(--p-surface-0);
}
`,$='<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>';function j(n,i){M("laughtale-inputtags",V);let b=[],g=i.values??i.value;if(Array.isArray(g))b=g.map(String);else if(typeof g=="string"&&g.trim().length>0)try{let t=JSON.parse(g);Array.isArray(t)?b=t.map(String):b=g.split(",").map(a=>a.trim()).filter(Boolean)}catch{b=g.split(",").map(t=>t.trim()).filter(Boolean)}let[c,L]=A({defaultValue:b,onChange:t=>{R(t)}}),D=i.fluid===!0||String(i.fluid)==="true",q=i.variant==="filled",v=i.disabled===!0||String(i.disabled)==="true",k=i.readonlyMode===!0||String(i.readonlyMode)==="true",z=i.invalid===!0||String(i.invalid)==="true",w=i.allowDuplicate===!0||String(i.allowDuplicate)==="true",N=i.addOnPaste!==!1&&String(i.addOnPaste)!=="false",m=i.max?Number(i.max):null,h=i.delimiter||i.separator||",",y=i.typeahead===!0||String(i.typeahead)==="true",E=[];if(i.suggestions){if(Array.isArray(i.suggestions))E=i.suggestions;else if(typeof i.suggestions=="string")try{let t=JSON.parse(i.suggestions);Array.isArray(t)&&(E=t)}catch{E=i.suggestions.split(",").map(t=>t.trim()).filter(Boolean)}}let o=-1,u=[];function x(t){return t.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function C(t,a){let e=document.createElement("span");return e.className="p-inputtags-tag",e.setAttribute("data-index",String(a)),e.setAttribute("tabindex","0"),e.setAttribute("role","option"),e.setAttribute("aria-selected","true"),e.innerHTML=`
            <span class="p-inputtags-tag-label">${x(t)}</span>
            ${!v&&!k?`
                <button type="button" class="p-inputtags-tag-remove" data-index="${a}" aria-label="Remove ${x(t)}" tabindex="-1">
                    ${$}
                </button>
            `:""}
        `,S(e),e}function S(t){let a=t.querySelector(".p-inputtags-tag-remove");a&&(a.addEventListener("mousedown",e=>e.preventDefault()),a.addEventListener("click",e=>{e.stopPropagation();let r=Number(t.getAttribute("data-index"));T(r)})),t.addEventListener("keydown",e=>{let r=Number(t.getAttribute("data-index"));if(e.key==="Backspace"||e.key==="Delete")e.preventDefault(),T(r);else if(e.key==="ArrowLeft"){e.preventDefault();let s=t.previousElementSibling;s&&s.classList.contains("p-inputtags-tag")&&s.focus()}else if(e.key==="ArrowRight"){e.preventDefault();let s=t.nextElementSibling;s&&s.classList.contains("p-inputtags-tag")?s.focus():n.querySelector(".p-inputtags-input")?.focus()}})}function I(){n.querySelectorAll(".p-inputtags-tag").forEach((e,r)=>{e.setAttribute("data-index",String(r));let s=e.querySelector(".p-inputtags-tag-remove");s&&s.setAttribute("data-index",String(r))});let a=n.querySelector(".p-inputtags-input");if(a){let e=c();e.length===0?a.placeholder=i.placeholder||"":a.placeholder="",m!==null&&e.length>=m?a.style.display="none":a.style.display=""}}function f(t){if(t=t.trim(),!t)return;let a=c();if(m!==null&&a.length>=m)return;if(!w&&a.includes(t)){let l=n.querySelector(`.p-inputtags-tag[data-index="${a.indexOf(t)}"]`);l&&(l.classList.add("is-focused"),setTimeout(()=>l.classList.remove("is-focused"),300));return}let e=[...a,t];L(e);let r=n.querySelector(".p-inputtags-input"),s=C(t,a.length);r?(n.insertBefore(s,r),r.value=""):n.appendChild(s),I(),n.dispatchEvent(new CustomEvent("tags:add",{bubbles:!0,detail:{value:t,values:e}}))}function T(t){let a=c();if(t<0||t>=a.length)return;let e=a[t],r=a.filter((d,F)=>F!==t);L(r);let s=n.querySelector(`.p-inputtags-tag[data-index="${t}"]`);s&&s.remove(),I(),n.querySelector(".p-inputtags-input")?.focus(),n.dispatchEvent(new CustomEvent("tags:remove",{bubbles:!0,detail:{value:e,index:t,values:r}}))}function O(){let t=c(),a=i.inputId?`id="${i.inputId}"`:"",e=m!==null&&t.length>=m;n.className="laughtale-inputtags p-inputtags",n.setAttribute("role","listbox"),n.setAttribute("aria-orientation","horizontal"),D&&n.classList.add("p-inputtags-fluid"),q&&n.classList.add("variant-filled"),i.size&&n.classList.add(`size-${i.size}`),z&&n.classList.add("is-invalid"),v&&n.classList.add("is-disabled");let r=t.map((l,d)=>`
            <span class="p-inputtags-tag" data-index="${d}" tabindex="0" role="option" aria-selected="true">
                <span class="p-inputtags-tag-label">${x(l)}</span>
                ${!v&&!k?`
                    <button type="button" class="p-inputtags-tag-remove" data-index="${d}" aria-label="Remove ${x(l)}" tabindex="-1">
                        ${$}
                    </button>
                `:""}
            </span>
        `).join(""),s=`
            <input type="text"
                   class="p-inputtags-input"
                   ${a}
                   placeholder="${t.length===0&&i.placeholder||""}"
                   ${v?"disabled":""}
                   ${k?"readonly":""}
                   autocomplete="off"
                   spellcheck="false"
                   ${e?'style="display: none;"':""}
                   ${y?'role="combobox" aria-autocomplete="list" aria-expanded="false"':""} />
        `;n.innerHTML=`
            ${r}
            ${s}
            ${y?'<div class="p-inputtags-panel" style="display: none;"></div>':""}
        `,n.querySelectorAll(".p-inputtags-tag").forEach(S),n.addEventListener("click",l=>{(l.target===n||l.target.classList.contains("p-inputtags"))&&n.querySelector(".p-inputtags-input")?.focus()}),B()}function B(){if(v||k)return;let t=n.querySelector(".p-inputtags-input"),a=n.querySelector(".p-inputtags-panel");t&&(t.addEventListener("keydown",e=>{let r=t.value,s=c();if(h&&e.key===h){e.preventDefault(),r.trim()&&f(r),p();return}if(e.key==="Enter")e.preventDefault(),y&&o>=0&&u[o]?(f(u[o]),p()):r.trim()&&(f(r),p());else if(e.key==="Backspace"&&!r&&s.length>0)T(s.length-1);else if(e.key==="ArrowLeft"&&!r&&s.length>0){let l=n.querySelectorAll(".p-inputtags-tag");l.length>0&&l[l.length-1].focus()}else y&&a&&(e.key==="ArrowDown"?(e.preventDefault(),u.length>0&&(o=(o+1)%u.length,H())):e.key==="ArrowUp"?(e.preventDefault(),u.length>0&&(o=(o-1+u.length)%u.length,H())):e.key==="Escape"?p():e.key==="Tab"&&o>=0&&u[o]&&(f(u[o]),p()))}),t.addEventListener("paste",e=>{if(!N)return;let r=e.clipboardData?.getData("text");if(r&&(r.includes(",")||h&&r.includes(h))){e.preventDefault();let s=new RegExp(`[\\s,${h}]+`);r.split(s).map(d=>d.trim()).filter(Boolean).forEach(d=>f(d))}}),y&&a&&(t.addEventListener("input",()=>{let e=t.value.trim().toLowerCase();if(!e){p();return}let r=c();u=E.filter(s=>{let l=s.toLowerCase().includes(e);return w?l:l&&!r.includes(s)}),u.length>0?(o=0,P()):p()}),document.addEventListener("click",e=>{n.contains(e.target)||p()})))}function P(){let t=n.querySelector(".p-inputtags-panel"),a=n.querySelector(".p-inputtags-input");t&&(t.style.display="flex",a?.setAttribute("aria-expanded","true"),t.innerHTML=u.map((e,r)=>`
            <div class="p-inputtags-item ${r===o?"is-highlighted":""}" data-index="${r}">
                <span>${x(e)}</span>
            </div>
        `).join(""),t.querySelectorAll(".p-inputtags-item").forEach(e=>{e.addEventListener("click",r=>{r.stopPropagation();let s=Number(e.getAttribute("data-index"));u[s]&&(f(u[s]),p())})}))}function H(){let t=n.querySelector(".p-inputtags-panel");t&&t.querySelectorAll(".p-inputtags-item").forEach((a,e)=>{a.classList.toggle("is-highlighted",e===o),e===o&&a.scrollIntoView({block:"nearest"})})}function p(){let t=n.querySelector(".p-inputtags-panel"),a=n.querySelector(".p-inputtags-input");t&&(t.style.display="none"),a?.setAttribute("aria-expanded","false"),o=-1,u=[]}function R(t){if(i.targetInputName){let a=n.querySelector(`input[name="${i.targetInputName}"]`);a||(a=document.createElement("input"),a.type="hidden",a.name=i.targetInputName,n.appendChild(a)),a.value=JSON.stringify(t)}n.dispatchEvent(new CustomEvent("inputtags:change",{bubbles:!0,detail:{values:t}})),n.dispatchEvent(new CustomEvent("chips:change",{bubbles:!0,detail:{values:t}}))}O()}export{j as default};
