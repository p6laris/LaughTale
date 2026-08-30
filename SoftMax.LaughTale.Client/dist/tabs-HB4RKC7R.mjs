import{e as A}from"./chunk-3YU53HBK.mjs";var z=`
.p-tabs {
    display: flex;
    flex-direction: column;
    width: 100%;
    box-sizing: border-box;
}

.p-tablist {
    display: flex;
    position: relative;
    background: transparent;
    border-bottom: 1px solid var(--p-surface-200, #e2e8f0);
    box-sizing: border-box;
    align-items: center;
    width: 100%;
    overflow: hidden;
}

.p-tablist-content {
    display: flex;
    overflow-x: auto;
    scrollbar-width: none;
    -ms-overflow-style: none;
    position: relative;
    flex: 1 1 auto;
    scroll-behavior: smooth;
}
.p-tablist-content::-webkit-scrollbar {
    display: none;
}

.p-tablist-tab-list {
    display: flex;
    position: relative;
    margin: 0;
    padding: 0;
    list-style-type: none;
    gap: 0;
    width: auto;
}

.p-tab {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.125rem;
    border: none;
    background: transparent;
    color: var(--p-surface-500, #64748b);
    font-weight: 600;
    font-size: 0.875rem;
    cursor: pointer;
    text-decoration: none;
    border-bottom: 2px solid transparent;
    margin-bottom: -1px;
    transition: color 0.15s ease, border-color 0.15s ease;
    outline: none;
    user-select: none;
    position: relative;
    z-index: 2;
    white-space: nowrap;
}

.p-tab:hover:not(.p-tab-active):not(:disabled):not([aria-disabled="true"]) {
    color: var(--p-surface-800, #1e293b);
}

.p-tab-active {
    color: var(--p-primary-600, #059669);
    border-bottom-color: var(--p-primary-500, #10b981);
    font-weight: 700;
}

.p-tab:disabled,
.p-tab[aria-disabled="true"] {
    opacity: 0.35;
    cursor: not-allowed;
}

.p-tab:focus-visible {
    outline: 2px solid var(--p-primary-500, #10b981);
    outline-offset: -2px;
}

/* Active indicator bar */
.p-tablist-active-bar {
    position: absolute;
    bottom: -1px;
    height: 2px;
    background: var(--p-primary-500, #10b981);
    transition: left 0.2s cubic-bezier(0.2, 0, 0, 1), width 0.2s cubic-bezier(0.2, 0, 0, 1);
    z-index: 3;
    pointer-events: none;
}

/* Smooth Gradient Fade Mask Navigation Buttons */
.p-tablist-prev-button,
.p-tablist-next-button {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 3.5rem;
    display: flex;
    align-items: center;
    border: none;
    cursor: pointer;
    z-index: 10;
    transition: opacity 0.25s ease, color 0.15s ease;
    outline: none;
    color: var(--p-surface-600, #475569);
    padding: 0;
    box-shadow: none;
}

.p-tablist-prev-button {
    left: 0;
    justify-content: flex-start;
    padding-left: 0.5rem;
    background: linear-gradient(to right, var(--p-surface-50, #f8fafc) 35%, rgba(248, 250, 252, 0.7) 65%, transparent 100%);
}

.p-tablist-next-button {
    right: 0;
    justify-content: flex-end;
    padding-right: 0.5rem;
    background: linear-gradient(to left, var(--p-surface-50, #f8fafc) 35%, rgba(248, 250, 252, 0.7) 65%, transparent 100%);
}

.p-tablist-prev-button:hover:not(:disabled),
.p-tablist-next-button:hover:not(:disabled) {
    color: var(--p-text-color, #0f172a);
}

.p-tablist-prev-button:disabled,
.p-tablist-next-button:disabled {
    opacity: 0;
    pointer-events: none;
}

/* Tab Panels */
.p-tabpanels {
    padding: 1.25rem 0;
    width: 100%;
    box-sizing: border-box;
}

.p-tabpanel {
    display: none;
    width: 100%;
}
.p-tabpanel.p-tabpanel-active {
    display: block;
    animation: p-tabpanel-fadein 0.2s cubic-bezier(0.2, 0, 0, 1);
}

@keyframes p-tabpanel-fadein {
    from { opacity: 0; transform: translateY(2px); }
    to { opacity: 1; transform: translateY(0); }
}

/* Custom Capsule Indicator */
.p-tablist-capsule {
    border-bottom: none;
    background: var(--p-surface-100, #f1f5f9);
    padding: 0.25rem;
    border-radius: var(--p-border-radius-md, 6px);
    width: fit-content;
}
.p-tablist-capsule .p-tablist-active-bar {
    display: none;
}
.p-tablist-capsule .p-tab {
    border-bottom: none;
    margin-bottom: 0;
    border-radius: var(--p-border-radius-sm, 4px);
    padding: 0.5rem 1rem;
    color: var(--p-surface-600, #475569);
}
.p-tablist-capsule .p-tab-active {
    background: var(--p-surface-0, #ffffff);
    color: var(--p-text-color, #0f172a);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

/* Dark Mode Tokens */
.dark .p-tablist,
[data-theme="dark"] .p-tablist {
    border-bottom-color: var(--p-surface-700, #334155);
}
.dark .p-tab,
[data-theme="dark"] .p-tab {
    color: var(--p-surface-400, #94a3b8);
}
.dark .p-tab:hover:not(.p-tab-active):not(:disabled):not([aria-disabled="true"]),
[data-theme="dark"] .p-tab:hover:not(.p-tab-active):not(:disabled):not([aria-disabled="true"]) {
    color: var(--p-surface-100, #f8fafc);
}
.dark .p-tab-active,
[data-theme="dark"] .p-tab-active {
    color: var(--p-primary-400, #34d399);
    border-bottom-color: var(--p-primary-400, #34d399);
}
.dark .p-tablist-active-bar,
[data-theme="dark"] .p-tablist-active-bar {
    background: var(--p-primary-400, #34d399);
}
.dark .p-tablist-prev-button,
[data-theme="dark"] .p-tablist-prev-button {
    background: linear-gradient(to right, var(--p-surface-900, #0f172a) 35%, rgba(15, 23, 42, 0.7) 65%, transparent 100%);
    color: var(--p-surface-400, #94a3b8);
}
.dark .p-tablist-next-button,
[data-theme="dark"] .p-tablist-next-button {
    background: linear-gradient(to left, var(--p-surface-900, #0f172a) 35%, rgba(15, 23, 42, 0.7) 65%, transparent 100%);
    color: var(--p-surface-400, #94a3b8);
}
.dark .p-tablist-prev-button:hover:not(:disabled),
.dark .p-tablist-next-button:hover:not(:disabled),
[data-theme="dark"] .p-tablist-prev-button:hover:not(:disabled),
[data-theme="dark"] .p-tablist-next-button:hover:not(:disabled) {
    color: #ffffff;
}
.dark .p-tablist-capsule,
[data-theme="dark"] .p-tablist-capsule {
    background: var(--p-surface-800, #1e293b);
}
.dark .p-tablist-capsule .p-tab-active,
[data-theme="dark"] .p-tablist-capsule .p-tab-active {
    background: var(--p-surface-900, #0f172a);
    color: var(--p-surface-0, #f8fafc);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
}
`,C='<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>',B='<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>';function q(f,m){A("tabs",z);let s=f.querySelector(".p-tabs")||f;s.classList.add("p-tabs","p-component");let x=!!m.scrollable||s.hasAttribute("data-scrollable"),T=!!m.selectOnFocus||s.hasAttribute("data-select-on-focus"),N=!!m.lazy||s.hasAttribute("data-lazy"),b=String(m.value||s.getAttribute("data-value")||""),l=s.querySelector(".p-tablist"),y=s.querySelector(".p-tabpanels");if(!l)return;let r=l.querySelector(".p-tablist-content");if(!r){r=document.createElement("div"),r.className="p-tablist-content";let t=l.querySelector(".p-tablist-tab-list, ul");t?t.classList.add("p-tablist-tab-list"):(t=document.createElement("ul"),t.className="p-tablist-tab-list",Array.from(l.querySelectorAll(":scope > .p-tab, :scope > [data-tab-value]")).forEach(e=>t.appendChild(e))),r.appendChild(t),l.appendChild(r)}let H=r.querySelector(".p-tablist-tab-list, ul")||r,d=r.querySelector(".p-tablist-active-bar"),k=l.classList.contains("p-tablist-capsule");!d&&!k&&(d=document.createElement("div"),d.className="p-tablist-active-bar",r.appendChild(d));function v(){return Array.from(H.querySelectorAll(".p-tab, [data-tab-value]"))}function S(){return Array.from(y?y.querySelectorAll(":scope > .p-tabpanel, .p-tabpanel"):[])}let g=v();!b&&g.length>0&&(b=g[0].getAttribute("data-value")||g[0].getAttribute("value")||"0");function E(t){if(!d||k)return;if(!t){d.style.width="0px";return}let a=t.offsetLeft,e=t.offsetWidth;d.style.left=`${a}px`,d.style.width=`${e}px`}function w(){let t=v(),a=S(),e=null;if(t.forEach(o=>{let i=(o.getAttribute("data-value")||o.getAttribute("value"))===b;o.classList.toggle("p-tab-active",i),o.setAttribute("aria-selected",i?"true":"false"),o.setAttribute("tabindex",i?"0":"-1"),i&&(e=o)}),a.forEach(o=>{let i=(o.getAttribute("data-value")||o.getAttribute("value"))===b;o.classList.toggle("p-tabpanel-active",i)}),s.setAttribute("data-value",b),E(e),x&&e&&r){let o=r.scrollLeft,n=o+r.clientWidth,i=e.offsetLeft,p=i+e.offsetWidth;i<o?r.scrollTo({left:i-40,behavior:"smooth"}):p>n&&r.scrollTo({left:p-r.clientWidth+40,behavior:"smooth"})}}function h(t){let a=v().find(e=>(e.getAttribute("data-value")||e.getAttribute("value"))===t);a&&(a.hasAttribute("disabled")||a.getAttribute("aria-disabled")==="true")||(b=t,w(),f.dispatchEvent(new CustomEvent("tabs:change",{bubbles:!0,detail:{value:b}})))}if(g.forEach((t,a)=>{let e=t.getAttribute("data-value")||t.getAttribute("value")||String(a),o=t.hasAttribute("disabled")||t.getAttribute("aria-disabled")==="true";t.addEventListener("click",n=>{n.preventDefault(),!o&&h(e)}),T&&t.addEventListener("focus",()=>{o||h(e)}),t.addEventListener("keydown",n=>{let i=v().filter(u=>!u.hasAttribute("disabled")&&u.getAttribute("aria-disabled")!=="true"),p=i.indexOf(t);if(p===-1)return;let c=-1;if(n.key==="ArrowRight"?c=(p+1)%i.length:n.key==="ArrowLeft"?c=(p-1+i.length)%i.length:n.key==="Home"?c=0:n.key==="End"&&(c=i.length-1),c!==-1){n.preventDefault();let u=i[c];u.focus();let M=u.getAttribute("data-value")||u.getAttribute("value")||String(c);h(M)}})}),x&&r){let e=function(){if(!r||!t||!a)return;let{scrollLeft:o,scrollWidth:n,clientWidth:i}=r;t.disabled=o<=4,a.disabled=o+i>=n-4};var W=e;let t=l.querySelector(".p-tablist-prev-button"),a=l.querySelector(".p-tablist-next-button");t||(t=document.createElement("button"),t.type="button",t.className="p-tablist-prev-button",t.setAttribute("aria-label","Previous Tab"),t.innerHTML=C,l.insertBefore(t,r)),a||(a=document.createElement("button"),a.type="button",a.className="p-tablist-next-button",a.setAttribute("aria-label","Next Tab"),a.innerHTML=B,l.appendChild(a)),t.addEventListener("click",()=>{r?.scrollBy({left:-220,behavior:"smooth"})}),a.addEventListener("click",()=>{r?.scrollBy({left:220,behavior:"smooth"})}),r.addEventListener("scroll",e),setTimeout(e,50),window.addEventListener("resize",e)}let L=f.closest("[data-tabs-demo]")||f.parentElement;L&&L.querySelectorAll(":scope > * [data-tabs-target], :scope > [data-tabs-target]").forEach(t=>{t.addEventListener("click",a=>{a.preventDefault();let e=t.getAttribute("data-tabs-target");e&&h(e)})}),setTimeout(w,50),window.addEventListener("resize",()=>{let a=v().find(e=>(e.getAttribute("data-value")||e.getAttribute("value"))===b);E(a||null)})}export{q as default};
