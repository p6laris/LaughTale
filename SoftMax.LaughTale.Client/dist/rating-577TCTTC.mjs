import{a as j}from"./chunk-36AEYHZF.mjs";import{e as $}from"./chunk-3YU53HBK.mjs";var C=`
.laughtale-rating,
.p-rating {
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
    font-family: var(--p-font-family, inherit);
    user-select: none;
    box-sizing: border-box;
}

.p-rating.p-rating-vertical {
    flex-direction: column;
}

/* Rating Items (Stars / Icons) */
.p-rating-item {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border-radius: 9999px;
    padding: 0.125rem;
    transition: transform 150ms cubic-bezier(0.4, 0, 0.2, 1), color 150ms ease, opacity 150ms ease;
    color: var(--p-surface-300);
    outline: none;
}

.p-rating:not(.p-readonly):not(.p-disabled) .p-rating-item:hover {
    transform: scale(1.15);
}

.p-rating:not(.p-readonly):not(.p-disabled) .p-rating-item:focus-visible {
    box-shadow: 0 0 0 2px var(--p-primary-500);
}

.p-rating-item.p-rating-item-active {
    color: var(--p-primary-500, #f59e0b);
}

.p-rating-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    transition: color 150ms ease, fill 150ms ease;
}

.p-rating-icon svg {
    width: 100%;
    height: 100%;
}

/* Sizes */
.p-rating.size-small .p-rating-icon {
    width: 16px;
    height: 16px;
}
.p-rating.size-large .p-rating-icon {
    width: 26px;
    height: 26px;
}

/* Half Stars Overlay */
.p-rating-half-wrapper {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
}
.p-rating-half-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 50%;
    height: 100%;
    overflow: hidden;
    color: var(--p-primary-500, #f59e0b);
    pointer-events: none;
}
.p-rating-half-overlay .p-rating-icon {
    width: 20px;
    height: 20px;
}
.p-rating.size-small .p-rating-half-overlay .p-rating-icon {
    width: 16px;
    height: 16px;
}
.p-rating.size-large .p-rating-half-overlay .p-rating-icon {
    width: 26px;
    height: 26px;
}

/* Cancel Button */
.p-rating-cancel-item {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 0.125rem;
    margin-right: 0.25rem;
    color: var(--p-surface-400);
    border-radius: 9999px;
    transition: color 150ms ease, background 150ms ease, transform 150ms ease;
    outline: none;
}
.p-rating-vertical .p-rating-cancel-item {
    margin-right: 0;
    margin-bottom: 0.25rem;
}
.p-rating-cancel-item:hover {
    color: var(--p-red-500, #ef4444);
    transform: scale(1.1);
}
.p-rating-cancel-item:focus-visible {
    box-shadow: 0 0 0 2px var(--p-red-500);
}
.p-rating-cancel-item svg {
    width: 16px;
    height: 16px;
}

/* Emoji / Template Mode */
.p-rating-emoji-item {
    font-size: 1.5rem;
    line-height: 1;
    filter: grayscale(100%);
    opacity: 0.5;
    transition: transform 150ms ease, filter 150ms ease, opacity 150ms ease;
}
.p-rating-emoji-item.p-rating-item-active,
.p-rating:not(.p-readonly):not(.p-disabled) .p-rating-emoji-item:hover {
    filter: grayscale(0%);
    opacity: 1;
    transform: scale(1.25);
}

/* Text Template Mode (e.g. A A A A A) */
.p-rating-text-item {
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--p-surface-300);
    transition: color 150ms ease, transform 150ms ease;
}
.p-rating-text-item.p-rating-item-active {
    color: var(--p-primary-500);
}

/* States */
.p-rating.p-readonly .p-rating-item,
.p-rating.p-readonly .p-rating-cancel-item {
    cursor: default;
}
.p-rating.p-disabled {
    opacity: 0.6;
    cursor: not-allowed;
}
.p-rating.p-disabled .p-rating-item,
.p-rating.p-disabled .p-rating-cancel-item {
    cursor: not-allowed;
    pointer-events: none;
}

/* ==================== DARK MODE ==================== */
.dark .p-rating-item {
    color: var(--p-surface-600);
}
.dark .p-rating-item.p-rating-item-active,
.dark .p-rating-half-overlay {
    color: var(--p-primary-400, #fbbf24);
}
.dark .p-rating-cancel-item {
    color: var(--p-surface-500);
}
.dark .p-rating-cancel-item:hover {
    color: var(--p-red-400);
}
.dark .p-rating-text-item {
    color: var(--p-surface-700);
}
.dark .p-rating-text-item.p-rating-item-active {
    color: var(--p-primary-400);
}
`,A='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',w='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',T='<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>';function z(l,t){$("laughtale-rating",C);let y=t.stars?Number(t.stars):5,h=t.allowHalf===!0||String(t.allowHalf)==="true",x=t.cancel!==!1&&t.allowCancel!==!1&&String(t.cancel)!=="false"&&String(t.allowCancel)!=="false",k=t.orientation==="vertical",m=t.readonlyMode===!0||t.readonly===!0||String(t.readonlyMode)==="true"||String(t.readonly)==="true",d=t.disabled===!0||String(t.disabled)==="true",u=t.mode||"stars",f=["\u{1F621}","\u{1F641}","\u{1F610}","\u{1F60A}","\u{1F929}"];if(t.emojis){if(Array.isArray(t.emojis))f=t.emojis;else if(typeof t.emojis=="string")try{let a=JSON.parse(t.emojis);Array.isArray(a)?f=a:f=t.emojis.split(",").map(o=>o.trim()).filter(Boolean)}catch{f=t.emojis.split(",").map(a=>a.trim()).filter(Boolean)}}let[v,p]=j({defaultValue:t.value?Number(t.value):0,onChange:a=>{L(a)}}),b=null;function H(){let a=v(),o=["laughtale-rating","p-rating",k?"p-rating-vertical":"",t.size?`size-${t.size}`:"",m?"p-readonly":"",d?"p-disabled":""].filter(Boolean).join(" ");l.className=o,l.setAttribute("role","radiogroup"),l.setAttribute("aria-label",`${a} of ${y} stars`);let i="";x&&!m&&!d&&(i=`
                <button type="button" class="p-rating-cancel-item" aria-label="Clear rating" tabindex="0">
                    ${T}
                </button>
            `);let n="";for(let e=1;e<=y;e++)if(u==="emoji"){let s=f[(e-1)%f.length]||"\u2B50";n+=`
                    <span class="p-rating-item p-rating-emoji-item" data-value="${e}" role="radio" aria-checked="${a>=e?"true":"false"}" aria-label="${e} Star" tabindex="${m||d?"-1":"0"}">
                        ${s}
                    </span>
                `}else u==="template"?n+=`
                    <span class="p-rating-item p-rating-text-item" data-value="${e}" role="radio" aria-checked="${a>=e?"true":"false"}" aria-label="${e} Star" tabindex="${m||d?"-1":"0"}">
                        A
                    </span>
                `:n+=`
                    <span class="p-rating-item p-rating-star-item" data-value="${e}" role="radio" aria-checked="${a>=e?"true":"false"}" aria-label="${e} Stars" tabindex="${m||d?"-1":"0"}">
                        <div class="p-rating-half-wrapper">
                            <span class="p-rating-icon p-rating-icon-off">${w}</span>
                            <span class="p-rating-half-overlay" style="display: none;">
                                <span class="p-rating-icon p-rating-icon-half">${A}</span>
                            </span>
                        </div>
                    </span>
                `;l.innerHTML=`
            ${i}
            <div class="p-rating-items" style="display: flex; ${k?"flex-direction: column;":"align-items: center;"} gap: 0.375rem;">
                ${n}
            </div>
        `,g(a),M()}function g(a){l.querySelectorAll(".p-rating-item").forEach(i=>{let n=Number(i.getAttribute("data-value")),e=a>=n,s=h&&a>=n-.5&&a<n;if(u==="stars"){let c=i.querySelector(".p-rating-icon-off"),r=i.querySelector(".p-rating-half-overlay");e?(i.classList.add("p-rating-item-active"),c&&(c.innerHTML=A),r&&(r.style.display="none")):s?(i.classList.remove("p-rating-item-active"),c&&(c.innerHTML=w),r&&(r.style.display="block")):(i.classList.remove("p-rating-item-active"),c&&(c.innerHTML=w),r&&(r.style.display="none"))}else i.classList.toggle("p-rating-item-active",e);i.setAttribute("aria-checked",e||s?"true":"false")}),l.setAttribute("aria-label",`${a} of ${y} stars`)}function M(){if(m||d)return;let a=l.querySelector(".p-rating-cancel-item");a&&(a.addEventListener("click",i=>{i.stopPropagation(),p(0),g(0)}),a.addEventListener("keydown",i=>{(i.key==="Enter"||i.key===" ")&&(i.preventDefault(),p(0),g(0))})),l.querySelectorAll(".p-rating-item").forEach(i=>{let n=Number(i.getAttribute("data-value"));i.addEventListener("mousemove",e=>{if(h&&u==="stars"){let s=i.getBoundingClientRect();b=e.clientX-s.left<s.width/2?n-.5:n}else b=n;g(b)}),i.addEventListener("click",e=>{let s=n;if(h&&u==="stars"){let E=i.getBoundingClientRect();s=e.clientX-E.left<E.width/2?n-.5:n}let r=v()===s&&x?0:s;p(r),g(r)}),i.addEventListener("keydown",e=>{let s=v(),c=h?.5:1;if(e.key==="ArrowRight"||e.key==="ArrowUp"){e.preventDefault();let r=Math.min(y,s+c);p(r),g(r),S(Math.ceil(r))}else if(e.key==="ArrowLeft"||e.key==="ArrowDown"){e.preventDefault();let r=Math.max(0,s-c);p(r),g(r),S(Math.ceil(r))}else e.key===" "||e.key==="Enter"?(e.preventDefault(),p(n),g(n)):(e.key==="Backspace"||e.key==="Delete")&&(e.preventDefault(),p(0),g(0))})}),l.addEventListener("mouseleave",()=>{b=null,g(v())})}function S(a){l.querySelector(`.p-rating-item[data-value="${Math.max(1,a)}"]`)?.focus()}function L(a){if(t.targetInputName){let o=l.querySelector(`input[name="${t.targetInputName}"]`);o||(o=document.createElement("input"),o.type="hidden",o.name=t.targetInputName,l.appendChild(o)),o.value=String(a)}l.dispatchEvent(new CustomEvent("rating:change",{bubbles:!0,detail:{value:a}})),l.dispatchEvent(new CustomEvent("change",{bubbles:!0,detail:{value:a}}))}H(),L(v())}export{z as default};
