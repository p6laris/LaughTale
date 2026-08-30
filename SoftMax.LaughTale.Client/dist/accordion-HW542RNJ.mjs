import{e as w}from"./chunk-3YU53HBK.mjs";var i={chevronDown:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>',chevronRight:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>',folder:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/></svg>',folderOpen:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 14 1.5-6h13l-2.5 6H6Z"/><path d="M4 18h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2Z"/></svg>',plus:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg>',minus:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/></svg>',check:'<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',user:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/></svg>',shield:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/></svg>',zap:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>'},C=`
.p-accordion {
    display: flex;
    flex-direction: column;
    width: 100%;
    border: 1px solid var(--p-surface-200, #e2e8f0);
    border-radius: var(--p-border-radius-md, 6px);
    overflow: hidden;
    background: var(--p-surface-0, #ffffff);
    font-family: var(--p-font-family, inherit);
    box-sizing: border-box;
}

.p-accordionpanel {
    border-bottom: 1px solid var(--p-surface-200, #e2e8f0);
    transition: background-color 0.2s ease;
}
.p-accordionpanel:last-child {
    border-bottom: none;
}

.p-accordionheader {
    margin: 0;
    padding: 0;
}

.p-accordionheader-toggle {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 1rem 1.25rem;
    font-weight: 600;
    font-size: 0.9375rem;
    color: var(--p-surface-700, #334155);
    background: var(--p-surface-0, #ffffff);
    border: none;
    cursor: pointer;
    text-align: left;
    transition: background-color 0.2s cubic-bezier(0.2, 0, 0, 1), color 0.2s cubic-bezier(0.2, 0, 0, 1);
    box-sizing: border-box;
}
.p-accordionheader-toggle:hover:not(:disabled) {
    background: var(--p-surface-50, #f8fafc);
    color: var(--p-surface-900, #0f172a);
}
.p-accordionpanel.p-accordionpanel-active > .p-accordionheader > .p-accordionheader-toggle {
    color: var(--p-primary-600, #10b981);
    font-weight: 700;
}

.p-accordionheader-toggle-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: var(--p-surface-400, #94a3b8);
    transition: transform 0.3s cubic-bezier(0.2, 0, 0, 1), color 0.2s ease;
    flex-shrink: 0;
}
.p-accordionpanel.p-accordionpanel-active > .p-accordionheader > .p-accordionheader-toggle .p-accordionheader-toggle-icon {
    color: var(--p-primary-600, #10b981);
}
.p-accordion-css-indicator .p-accordionpanel.p-accordionpanel-active .p-accordionheader-toggle-icon {
    transform: rotate(180deg);
}

/* 60fps CSS Grid Smooth Collapse/Expand Transition */
.p-accordioncontent {
    display: grid;
    grid-template-rows: 0fr;
    transition: grid-template-rows 280ms cubic-bezier(0.2, 0, 0, 1);
    background: var(--p-surface-0, #ffffff);
    overflow: hidden;
}
.p-accordionpanel.p-accordionpanel-active > .p-accordioncontent {
    grid-template-rows: 1fr;
}

.p-accordioncontent-wrapper {
    min-height: 0;
    overflow: hidden;
}

.p-accordioncontent-content {
    padding: 0.25rem 1.25rem 1.25rem 1.25rem;
    color: var(--p-surface-600, #475569);
    font-size: 0.875rem;
    line-height: 1.65;
    transition: opacity 220ms ease, transform 240ms cubic-bezier(0.2, 0, 0, 1);
    opacity: 0;
    transform: translateY(-6px);
}
.p-accordionpanel.p-accordionpanel-active > .p-accordioncontent .p-accordioncontent-content {
    opacity: 1;
    transform: translateY(0);
}

.p-accordionpanel.p-disabled {
    opacity: 0.5;
}
.p-accordionpanel.p-disabled .p-accordionheader-toggle {
    cursor: not-allowed;
}

/* Radio variant */
.p-accordion-radio-circle {
    width: 1.125rem;
    height: 1.125rem;
    border-radius: 9999px;
    border: 2px solid var(--p-surface-300, #cbd5e1);
    background: var(--p-surface-0, #ffffff);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin-right: 0.75rem;
    flex-shrink: 0;
    transition: border-color 0.2s ease;
}
.p-accordionpanel.p-accordionpanel-active .p-accordion-radio-circle {
    border-color: var(--p-primary-600, #10b981);
}
.p-accordion-radio-inner {
    width: 0.5rem;
    height: 0.5rem;
    border-radius: 9999px;
    background: var(--p-primary-600, #10b981);
    display: none;
    transition: transform 0.2s cubic-bezier(0.2, 0, 0, 1);
}
.p-accordionpanel.p-accordionpanel-active .p-accordion-radio-inner {
    display: block;
    animation: pRadioPop 0.2s cubic-bezier(0.2, 0, 0, 1);
}
@keyframes pRadioPop {
    0% { transform: scale(0); }
    100% { transform: scale(1); }
}

/* Controlled top buttons */
.p-accordion-top-controls {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 1rem;
}
.p-accordion-ctrl-btn {
    padding: 0.45rem 0.9rem;
    font-size: 0.8125rem;
    font-weight: 600;
    border-radius: 6px;
    border: 1px solid var(--p-surface-300, #cbd5e1);
    background: var(--p-surface-0, #ffffff);
    color: var(--p-surface-700, #334155);
    cursor: pointer;
    transition: all 0.2s cubic-bezier(0.2, 0, 0, 1);
}
.p-accordion-ctrl-btn:hover {
    background: var(--p-surface-100, #f1f5f9);
}
.p-accordion-ctrl-btn.p-highlight {
    background: var(--p-primary-500, #10b981);
    border-color: var(--p-primary-500, #10b981);
    color: #ffffff;
}

/* Dark Mode Tokens */
.dark .p-accordion,
[data-theme="dark"] .p-accordion {
    background: var(--p-surface-900, #0f172a) !important;
    border-color: var(--p-surface-700, #334155) !important;
    color: var(--p-surface-100, #f8fafc) !important;
}
.dark .p-accordionpanel,
[data-theme="dark"] .p-accordionpanel {
    border-color: var(--p-surface-700, #334155) !important;
}
.dark .p-accordionheader-toggle,
[data-theme="dark"] .p-accordionheader-toggle {
    background: var(--p-surface-900, #0f172a) !important;
    color: var(--p-surface-200, #e2e8f0) !important;
}
.dark .p-accordionheader-toggle:hover:not(:disabled),
[data-theme="dark"] .p-accordionheader-toggle:hover:not(:disabled) {
    background: var(--p-surface-800, #1e293b) !important;
    color: var(--p-surface-0, #ffffff) !important;
}
.dark .p-accordionpanel.p-accordionpanel-active > .p-accordionheader > .p-accordionheader-toggle,
[data-theme="dark"] .p-accordionpanel.p-accordionpanel-active > .p-accordionheader > .p-accordionheader-toggle {
    color: var(--p-primary-400, #34d399) !important;
}
.dark .p-accordioncontent,
[data-theme="dark"] .p-accordioncontent {
    background: var(--p-surface-900, #0f172a) !important;
}
.dark .p-accordioncontent-content,
[data-theme="dark"] .p-accordioncontent-content {
    color: var(--p-surface-300, #cbd5e1) !important;
}
.dark .p-accordion-ctrl-btn,
[data-theme="dark"] .p-accordion-ctrl-btn {
    background: var(--p-surface-900, #0f172a) !important;
    border-color: var(--p-surface-700, #334155) !important;
    color: var(--p-surface-200, #e2e8f0) !important;
}
.dark .p-accordion-ctrl-btn.p-highlight,
[data-theme="dark"] .p-accordion-ctrl-btn.p-highlight {
    background: var(--p-primary-500, #10b981) !important;
    color: #ffffff !important;
}
.dark .p-accordion-radio-circle,
[data-theme="dark"] .p-accordion-radio-circle {
    background: var(--p-surface-950, #020617) !important;
    border-color: var(--p-surface-700, #334155) !important;
}
`;function L(s,a){w("accordion",C);let p=(a.tabs||[]).map((o,n)=>({id:o.id||String(n),header:o.header||`Header ${n+1}`,content:o.content||"",icon:o.icon,badge:o.badge,subtitle:o.subtitle,price:o.price,disabled:!!o.disabled,toggleIcon:o.toggleIcon})),x=!!a.multiple,v=!!a.controlled,S=!!a.withRadio,g=a.customIndicator||"css",t=new Set;a.value!==void 0&&a.value!==null?Array.isArray(a.value)?a.value.forEach(o=>t.add(String(o))):t.add(String(a.value)):a.activeIndex!==void 0&&a.activeIndex!==null?Array.isArray(a.activeIndex)?a.activeIndex.forEach(o=>t.add(String(o))):t.add(String(a.activeIndex)):p.length>0&&t.add("0");function b(o){let n=Number(o);if(p[n]?.disabled)return;let d=!t.has(o);x||(s.querySelectorAll(".p-accordionpanel").forEach(r=>{let c=r.getAttribute("data-panel-idx");if(c!==o){r.classList.remove("p-accordionpanel-active");let l=r.querySelector(".p-accordionheader-toggle");if(l&&l.setAttribute("aria-expanded","false"),g==="match"){let f=r.querySelector(".p-accordionheader-toggle-icon");f&&(f.innerHTML=i.folder)}else if(p[Number(c)]?.toggleIcon==="plusMinus"){let f=r.querySelector(".p-accordionheader-toggle-icon");f&&(f.innerHTML=i.plus)}}}),t.clear());let e=s.querySelector(`.p-accordionpanel[data-panel-idx="${o}"]`);if(e){if(d){if(t.add(o),e.classList.add("p-accordionpanel-active"),e.querySelector(".p-accordionheader-toggle")?.setAttribute("aria-expanded","true"),g==="match"){let r=e.querySelector(".p-accordionheader-toggle-icon");r&&(r.innerHTML=i.folderOpen)}else if(p[n]?.toggleIcon==="plusMinus"){let r=e.querySelector(".p-accordionheader-toggle-icon");r&&(r.innerHTML=i.minus)}}else if(t.delete(o),e.classList.remove("p-accordionpanel-active"),e.querySelector(".p-accordionheader-toggle")?.setAttribute("aria-expanded","false"),g==="match"){let r=e.querySelector(".p-accordionheader-toggle-icon");r&&(r.innerHTML=i.folder)}else if(p[n]?.toggleIcon==="plusMinus"){let r=e.querySelector(".p-accordionheader-toggle-icon");r&&(r.innerHTML=i.plus)}}v&&s.querySelectorAll(".p-accordion-ctrl-btn").forEach(r=>{let c=r.getAttribute("data-ctrl-idx");r.classList.toggle("p-highlight",c!==null&&t.has(c))}),s.dispatchEvent(new CustomEvent("accordion:change",{bubbles:!0,detail:{value:Array.from(t)}}))}function $(){let o="";v&&(o=`
                <div class="p-accordion-top-controls">
                    ${p.map((e,r)=>{let c=String(r);return`
                            <button type="button" class="p-accordion-ctrl-btn ${t.has(c)?"p-highlight":""}" data-ctrl-idx="${c}">
                                ${r+1}
                            </button>
                        `}).join("")}
                </div>
            `);let n=p.map((e,r)=>{let c=String(r),l=t.has(c),f=e.disabled?"p-disabled":"",A=l?"p-accordionpanel-active":"",k=`acc-header-${r}`,y=`acc-content-${r}`,h=i.chevronDown;g==="match"?h=l?i.folderOpen:i.folder:e.toggleIcon==="plusMinus"&&(h=l?i.minus:i.plus);let H=S?`
                <span class="p-accordion-radio-circle">
                    <span class="p-accordion-radio-inner"></span>
                </span>
            `:"",u="";e.icon&&(e.icon==="user"?u=`<span style="display: inline-flex; align-items: center; margin-right: 0.5rem; color: var(--p-surface-400);">${i.user}</span>`:e.icon==="shield"?u=`<span style="display: inline-flex; align-items: center; margin-right: 0.5rem; color: var(--p-primary-500);">${i.shield}</span>`:e.icon==="zap"&&(u=`<span style="display: inline-flex; align-items: center; margin-right: 0.5rem; color: #f59e0b;">${i.zap}</span>`));let m="";return e.badge&&(m+=`<span style="background: var(--p-primary-100, #dcfce7); color: var(--p-primary-700, #15803d); font-size: 0.75rem; font-weight: 700; padding: 0.15rem 0.5rem; border-radius: 9999px; margin-left: 0.5rem;">${e.badge}</span>`),e.price&&(m+=`<span style="font-weight: 700; font-size: 0.875rem; color: var(--p-surface-900); margin-left: auto; margin-right: 1rem;">${e.price}</span>`),`
                <div class="p-accordionpanel ${A} ${f}" data-panel-idx="${c}">
                    <div class="p-accordionheader" role="heading" aria-level="2">
                        <button type="button" 
                                class="p-accordionheader-toggle" 
                                id="${k}"
                                aria-controls="${y}"
                                aria-expanded="${l?"true":"false"}"
                                aria-disabled="${e.disabled?"true":"false"}"
                                ${e.disabled?"disabled":""}
                                data-toggle-idx="${c}">
                            <div style="display: flex; align-items: center; width: 100%;">
                                ${H}
                                ${u}
                                <span class="p-accordionheader-title">${e.header}</span>
                                ${m}
                            </div>
                            <span class="p-accordionheader-toggle-icon">
                                ${h}
                            </span>
                        </button>
                    </div>
                    <div class="p-accordioncontent" 
                         id="${y}" 
                         role="region" 
                         aria-labelledby="${k}">
                        <div class="p-accordioncontent-wrapper">
                            <div class="p-accordioncontent-content">
                                ${e.content}
                            </div>
                        </div>
                    </div>
                </div>
            `}).join(""),d=g==="css"?"p-accordion-css-indicator":"";s.innerHTML=`
            ${o}
            <div class="p-accordion p-component ${d}" role="tablist">
                ${n}
            </div>
        `,M()}function M(){s.querySelectorAll(".p-accordion-ctrl-btn").forEach(n=>{n.addEventListener("click",()=>{let d=n.getAttribute("data-ctrl-idx");d!==null&&b(d)})});let o=s.querySelectorAll(".p-accordionheader-toggle");o.forEach((n,d)=>{n.addEventListener("click",()=>{let e=n.getAttribute("data-toggle-idx");e!==null&&b(e)}),n.addEventListener("keydown",e=>{if(e.key==="ArrowDown"){e.preventDefault();let r=(d+1)%o.length;o[r]?.focus()}else if(e.key==="ArrowUp"){e.preventDefault();let r=(d-1+o.length)%o.length;o[r]?.focus()}else e.key==="Home"?(e.preventDefault(),o[0]?.focus()):e.key==="End"&&(e.preventDefault(),o[o.length-1]?.focus())})})}$()}export{L as default};
