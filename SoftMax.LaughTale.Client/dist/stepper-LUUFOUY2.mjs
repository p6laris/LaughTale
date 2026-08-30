import{e as E}from"./chunk-3YU53HBK.mjs";var w=`
.p-stepper {
    display: flex;
    flex-direction: column;
    width: 100%;
    box-sizing: border-box;
}

.p-stepper-horizontal {
    flex-direction: column;
}

.p-steplist {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 0;
    padding: 0;
    list-style-type: none;
    position: relative;
    width: 100%;
}

.p-step {
    display: inline-flex;
    align-items: center;
    flex-shrink: 0;
    position: relative;
    z-index: 2;
}

.p-step-header {
    display: inline-flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.5rem 0.75rem;
    background: transparent;
    border: none;
    cursor: pointer;
    text-decoration: none;
    border-radius: var(--p-border-radius-md, 6px);
    transition: background-color 0.15s ease, color 0.15s ease;
    outline: none;
    user-select: none;
}
.p-step-header:hover:not(:disabled) {
    background: var(--p-surface-100, #f1f5f9);
}
.p-step-header:focus-visible {
    outline: 2px solid var(--p-primary-500, #10b981);
    outline-offset: 2px;
}
.p-step-header:disabled {
    cursor: not-allowed;
    opacity: 0.6;
}

.p-step-number {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2.25rem;
    height: 2.25rem;
    border-radius: 9999px;
    border: 2px solid var(--p-surface-300, #cbd5e1);
    background: var(--p-surface-0, #ffffff);
    color: var(--p-surface-700, #334155);
    font-weight: 700;
    font-size: 0.875rem;
    transition: all 0.25s cubic-bezier(0.2, 0, 0, 1);
}

.p-step-active .p-step-number {
    border-color: var(--p-primary-500, #10b981);
    color: var(--p-primary-500, #10b981);
    background: var(--p-surface-0, #ffffff);
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.15);
}

.p-step-completed .p-step-number {
    background: var(--p-primary-500, #10b981);
    border-color: var(--p-primary-500, #10b981);
    color: #ffffff;
}

.p-step-title {
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--p-surface-500, #64748b);
    transition: color 0.2s ease;
    white-space: nowrap;
}
.p-step-active .p-step-title {
    color: var(--p-text-color, #0f172a);
    font-weight: 700;
}
.p-step-completed .p-step-title {
    color: var(--p-text-color, #0f172a);
}

.p-stepper-separator {
    flex: 1 1 0;
    height: 2px;
    background: var(--p-surface-200, #e2e8f0);
    margin: 0 0.75rem;
    transition: background-color 0.25s ease;
    z-index: 1;
}
.p-stepper-separator.p-stepper-separator-active {
    background: var(--p-primary-500, #10b981);
}

/* Step Panels (Horizontal) */
.p-steppanels {
    margin-top: 1.5rem;
    width: 100%;
}

.p-steppanel {
    display: none;
    width: 100%;
}
.p-steppanel.p-steppanel-active {
    display: block;
    animation: p-steppanel-fadein 0.25s cubic-bezier(0.2, 0, 0, 1);
}

@keyframes p-steppanel-fadein {
    from { opacity: 0; transform: translateY(4px); }
    to { opacity: 1; transform: translateY(0); }
}

/* Vertical Layout & Smooth Slide Animation */
.p-stepper-vertical {
    display: flex;
    flex-direction: column;
    gap: 0;
}

.p-stepitem {
    display: flex;
    flex-direction: column;
    position: relative;
}

.p-stepitem:not(:last-child)::before {
    content: "";
    position: absolute;
    left: calc(1.625rem - 1px);
    top: 2.75rem;
    bottom: 0;
    width: 2px;
    background: var(--p-surface-200, #e2e8f0);
    transition: background-color 0.25s ease;
    z-index: 1;
}

.p-stepitem-completed:not(:last-child)::before {
    background: var(--p-primary-500, #10b981);
}

.p-stepitem > .p-step {
    z-index: 2;
}

.p-stepitem-content-wrapper {
    display: grid;
    grid-template-rows: 0fr;
    transition: grid-template-rows 0.35s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.25s ease;
    opacity: 0;
    margin-left: 3.25rem;
    position: relative;
    z-index: 2;
}

.p-stepitem-active > .p-stepitem-content-wrapper {
    grid-template-rows: 1fr;
    opacity: 1;
}

.p-stepitem-content-inner {
    overflow: hidden;
    min-height: 0;
}

.p-stepitem .p-steppanel {
    display: block;
    padding: 0.5rem 0 1.5rem 0;
}

/* Dark Mode Tokens */
.dark .p-step-header:hover:not(:disabled),
[data-theme="dark"] .p-step-header:hover:not(:disabled) {
    background: var(--p-surface-800, #1e293b) !important;
}

.dark .p-step-number,
[data-theme="dark"] .p-step-number {
    background: var(--p-surface-900, #0f172a) !important;
    border-color: var(--p-surface-700, #334155) !important;
    color: var(--p-surface-400, #94a3b8) !important;
}

.dark .p-step-active .p-step-number,
[data-theme="dark"] .p-step-active .p-step-number {
    border-color: var(--p-primary-400, #34d399) !important;
    color: var(--p-primary-400, #34d399) !important;
    background: var(--p-surface-900, #0f172a) !important;
    box-shadow: 0 0 0 3px rgba(52, 211, 153, 0.15);
}

.dark .p-step-completed .p-step-number,
[data-theme="dark"] .p-step-completed .p-step-number {
    background: var(--p-primary-500, #10b981) !important;
    border-color: var(--p-primary-500, #10b981) !important;
    color: #ffffff !important;
}

.dark .p-step-active .p-step-title,
[data-theme="dark"] .p-step-active .p-step-title {
    color: var(--p-surface-0, #f8fafc) !important;
}

.dark .p-stepper-separator,
.dark .p-stepitem:not(:last-child)::before,
[data-theme="dark"] .p-stepper-separator,
[data-theme="dark"] .p-stepitem:not(:last-child)::before {
    background: var(--p-surface-700, #334155);
}
.dark .p-stepper-separator.p-stepper-separator-active,
.dark .p-stepitem-completed:not(:last-child)::before,
[data-theme="dark"] .p-stepper-separator.p-stepper-separator-active,
[data-theme="dark"] .p-stepitem-completed:not(:last-child)::before {
    background: var(--p-primary-500, #10b981) !important;
}
`;function T(g,h){E("stepper",w);let o=g.querySelector(".p-stepper")||g,u=h.layout==="vertical"||o.classList.contains("p-stepper-vertical")||o.querySelector(".p-stepitem")!==null,x=!!h.linear||o.hasAttribute("data-linear");o.classList.add("p-stepper","p-component",u?"p-stepper-vertical":"p-stepper-horizontal");let d=String(h.value||o.getAttribute("data-value")||"1"),f=o.querySelector(".p-steplist"),k=o.querySelector(".p-steppanels"),b=Array.from(o.querySelectorAll(":scope > .p-stepitem, .p-stepitem"));function v(){return u?b.map(e=>e.querySelector(".p-step")).filter(Boolean):Array.from(f?f.querySelectorAll(":scope > .p-step, .p-step"):[])}function L(){return u?b.map(e=>e.querySelector(".p-steppanel")).filter(Boolean):Array.from(k?k.querySelectorAll(":scope > .p-steppanel, .p-steppanel"):[])}if(!u&&f){let e=Array.from(f.children).filter(a=>a.classList.contains("p-step"));for(let a=0;a<e.length-1;a++)if(!e[a].nextElementSibling?.classList.contains("p-stepper-separator")){let t=document.createElement("li");t.className="p-stepper-separator",t.setAttribute("aria-hidden","true"),e[a].after(t)}}u&&b.forEach(e=>{let a=e.querySelector(".p-steppanel"),t=e.querySelector(".p-stepitem-content-wrapper");if(a&&!t){t=document.createElement("div"),t.className="p-stepitem-content-wrapper";let l=document.createElement("div");l.className="p-stepitem-content-inner",a.parentNode?.insertBefore(t,a),l.appendChild(a),t.appendChild(l)}});function S(){let e=v(),a=L(),t=e.findIndex(r=>(r.getAttribute("data-value")||r.getAttribute("value"))===d),l=t>=0?t:0;e.forEach((r,s)=>{let c=s<l,p=s===l,i=s>l;r.classList.toggle("p-step-active",p),r.classList.toggle("p-step-completed",c);let n=r.querySelector(".p-step-header");n&&(n.setAttribute("aria-selected",p?"true":"false"),x&&(n.disabled=i));let y=r.nextElementSibling;y&&y.classList.contains("p-stepper-separator")&&y.classList.toggle("p-stepper-separator-active",c)}),u?b.forEach((r,s)=>{let c=s<l,p=s===l;r.classList.toggle("p-stepitem-active",p),r.classList.toggle("p-stepitem-completed",c)}):a.forEach((r,s)=>{let p=(r.getAttribute("data-value")||r.getAttribute("value")||String(s+1))===d;r.classList.toggle("p-steppanel-active",p)}),o.setAttribute("data-value",d)}function m(e){d=e,S(),g.dispatchEvent(new CustomEvent("stepper:change",{bubbles:!0,detail:{value:d}}))}let A=v();A.forEach((e,a)=>{let t=e.getAttribute("data-value")||e.getAttribute("value")||String(a+1);(e.querySelector(".p-step-header")||e).addEventListener("click",r=>{r.preventDefault();let s=A.findIndex(c=>(c.getAttribute("data-value")||c.getAttribute("value"))===d);x&&a>s||m(t)})}),o.addEventListener("click",e=>{let t=e.target.closest("[data-stepper-next], [data-stepper-prev], [data-stepper-action]");if(!t||!o.contains(t)||t.closest(".p-stepper")!==o)return;e.preventDefault();let r=t.getAttribute("data-stepper-next"),s=t.getAttribute("data-stepper-prev"),c=t.getAttribute("data-stepper-action");if(r)m(r);else if(s)m(s);else if(c==="next"){let p=v(),i=p.findIndex(n=>(n.getAttribute("data-value")||n.getAttribute("value"))===d);if(i>=0&&i<p.length-1){let n=p[i+1].getAttribute("data-value")||p[i+1].getAttribute("value")||String(i+2);m(n)}}else if(c==="prev"){let p=v(),i=p.findIndex(n=>(n.getAttribute("data-value")||n.getAttribute("value"))===d);if(i>0){let n=p[i-1].getAttribute("data-value")||p[i-1].getAttribute("value")||String(i);m(n)}}}),S()}export{T as default};
