import{b as s}from"./chunk-P6B5FGGY.mjs";import{e as u}from"./chunk-3YU53HBK.mjs";var w=`
/* ==========================================================================
   PrimeVue 4 Aura Toast Component Tokens & Positioning
   ========================================================================== */
.p-toast {
    position: fixed;
    z-index: var(--p-toast-z-index, 1100);
    display: flex;
    flex-direction: column;
    gap: var(--p-toast-gap, 0.75rem);
    pointer-events: none;
    width: var(--p-toast-width, 25rem);
    max-width: calc(100vw - 2.5rem);
    box-sizing: border-box;
    font-family: var(--p-font-family, inherit);
}

/* 7 Viewport Positions */
.p-toast-top-right {
    top: 1.25rem;
    right: 1.25rem;
}
.p-toast-top-left {
    top: 1.25rem;
    left: 1.25rem;
}
.p-toast-top-center {
    top: 1.25rem;
    left: 50%;
    transform: translateX(-50%);
}
.p-toast-bottom-right {
    bottom: 1.25rem;
    right: 1.25rem;
    flex-direction: column-reverse;
}
.p-toast-bottom-left {
    bottom: 1.25rem;
    left: 1.25rem;
    flex-direction: column-reverse;
}
.p-toast-bottom-center {
    bottom: 1.25rem;
    left: 50%;
    transform: translateX(-50%);
    flex-direction: column-reverse;
}
.p-toast-center {
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

/* Toast Message Card */
.p-toast-message {
    pointer-events: auto;
    display: flex;
    flex-direction: column;
    border-radius: var(--p-toast-border-radius, var(--p-border-radius, 8px));
    border-width: var(--p-toast-border-width, 1px);
    border-style: solid;
    padding: var(--p-toast-content-padding, 0.875rem 1.125rem);
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05);
    backdrop-filter: blur(var(--p-toast-blur, 10px));
    -webkit-backdrop-filter: blur(var(--p-toast-blur, 10px));
    box-sizing: border-box;
    will-change: transform, opacity, max-height, padding, margin;
    overflow: hidden;
    animation: p-toast-enter 240ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
    transition: opacity 220ms cubic-bezier(0.16, 1, 0.3, 1),
                transform 220ms cubic-bezier(0.16, 1, 0.3, 1),
                max-height 260ms cubic-bezier(0.16, 1, 0.3, 1),
                padding 260ms cubic-bezier(0.16, 1, 0.3, 1),
                margin 260ms cubic-bezier(0.16, 1, 0.3, 1),
                border-width 260ms ease;
}

.p-toast-message.p-toast-message-leave {
    pointer-events: none;
    opacity: 0 !important;
    max-height: 0 !important;
    padding-top: 0 !important;
    padding-bottom: 0 !important;
    margin-top: 0 !important;
    margin-bottom: 0 !important;
    border-width: 0 !important;
    transform: translateY(-8px) scale(0.96) !important;
}

@keyframes p-toast-enter {
    from {
        opacity: 0;
        transform: translateY(-12px) scale(0.97);
        max-height: 0;
    }
    to {
        opacity: 1;
        transform: translateY(0) scale(1);
        max-height: 300px;
    }
}

.p-toast-message-content {
    display: flex;
    align-items: flex-start;
    gap: var(--p-toast-content-gap, 0.75rem);
    width: 100%;
}

.p-toast-message-icon {
    width: var(--p-toast-icon-size, 1.25rem);
    height: var(--p-toast-icon-size, 1.25rem);
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 0.125rem;
}

.p-toast-message-text {
    display: flex;
    flex-direction: column;
    gap: var(--p-toast-text-gap, 0.25rem);
    flex: 1 1 auto;
}

.p-toast-summary {
    font-weight: var(--p-toast-summary-font-weight, 600);
    font-size: var(--p-toast-summary-font-size, 0.875rem);
    line-height: 1.35;
}

.p-toast-detail {
    font-weight: var(--p-toast-detail-font-weight, 400);
    font-size: var(--p-toast-detail-font-size, 0.8125rem);
    line-height: 1.45;
    opacity: 0.92;
}

.p-toast-detail a,
.p-toast-summary a {
    color: inherit;
    font-weight: 600;
    text-decoration: underline;
    text-underline-offset: 2px;
}

.p-toast-close-button {
    background: transparent;
    border: none;
    cursor: pointer;
    width: var(--p-toast-close-button-width, 1.75rem);
    height: var(--p-toast-close-button-height, 1.75rem);
    border-radius: var(--p-toast-close-button-border-radius, var(--p-border-radius, 6px));
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin-left: auto;
    flex-shrink: 0;
    padding: 0;
    opacity: 0.7;
    transition: background-color 150ms ease, opacity 150ms ease, transform 120ms ease;
    color: inherit;
    outline: none;
}
.p-toast-close-button:hover {
    opacity: 1;
    background: rgba(0, 0, 0, 0.08);
}
.p-toast-close-button:focus-visible {
    opacity: 1;
    box-shadow: 0 0 0 2px currentColor;
}
.p-toast-close-button:active {
    transform: scale(0.92);
}

.p-toast-close-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: var(--p-toast-close-icon-size, 0.875rem);
    height: var(--p-toast-close-icon-size, 0.875rem);
}

.p-toast-spin {
    animation: p-toast-spinner-rot 1s linear infinite;
}

@keyframes p-toast-spinner-rot {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}

/* ==========================================================================
   Severity Color Schemes
   ========================================================================== */
/* Info */
.p-toast-message-info {
    background: var(--p-toast-info-background, rgba(239, 246, 255, 0.96));
    border-color: var(--p-toast-info-border-color, #bfdbfe);
    color: var(--p-toast-info-color, #1e40af);
}
.p-toast-message-info .p-toast-message-icon,
.p-toast-message-info .p-toast-close-button {
    color: var(--p-toast-info-color, #1e40af);
}

/* Success */
.p-toast-message-success {
    background: var(--p-toast-success-background, rgba(236, 253, 245, 0.96));
    border-color: var(--p-toast-success-border-color, #a7f3d0);
    color: var(--p-toast-success-color, #065f46);
}
.p-toast-message-success .p-toast-message-icon,
.p-toast-message-success .p-toast-close-button {
    color: var(--p-toast-success-color, #065f46);
}

/* Warn */
.p-toast-message-warn {
    background: var(--p-toast-warn-background, rgba(255, 251, 235, 0.96));
    border-color: var(--p-toast-warn-border-color, #fde68a);
    color: var(--p-toast-warn-color, #92400e);
}
.p-toast-message-warn .p-toast-message-icon,
.p-toast-message-warn .p-toast-close-button {
    color: var(--p-toast-warn-color, #92400e);
}

/* Error */
.p-toast-message-error {
    background: var(--p-toast-error-background, rgba(254, 242, 242, 0.96));
    border-color: var(--p-toast-error-border-color, #fecaca);
    color: var(--p-toast-error-color, #991b1b);
}
.p-toast-message-error .p-toast-message-icon,
.p-toast-message-error .p-toast-close-button {
    color: var(--p-toast-error-color, #991b1b);
}

/* Secondary */
.p-toast-message-secondary {
    background: var(--p-toast-secondary-background, rgba(248, 250, 252, 0.96));
    border-color: var(--p-toast-secondary-border-color, #e2e8f0);
    color: var(--p-toast-secondary-color, #475569);
}
.p-toast-message-secondary .p-toast-message-icon,
.p-toast-message-secondary .p-toast-close-button {
    color: var(--p-toast-secondary-color, #475569);
}

/* Contrast */
.p-toast-message-contrast {
    background: var(--p-toast-contrast-background, #0f172a);
    border-color: var(--p-toast-contrast-border-color, #1e293b);
    color: var(--p-toast-contrast-color, #ffffff);
}
.p-toast-message-contrast .p-toast-message-icon,
.p-toast-message-contrast .p-toast-close-button {
    color: var(--p-toast-contrast-color, #ffffff);
}
.p-toast-message-contrast .p-toast-close-button:hover {
    background: rgba(255, 255, 255, 0.15);
}

/* Dark Mode Tokens */
.dark .p-toast-message-info,
[data-theme="dark"] .p-toast-message-info {
    background: rgba(23, 37, 84, 0.92);
    border-color: #1e40af;
    color: #93c5fd;
}
.dark .p-toast-message-info .p-toast-message-icon,
.dark .p-toast-message-info .p-toast-close-button {
    color: #93c5fd;
}

.dark .p-toast-message-success,
[data-theme="dark"] .p-toast-message-success {
    background: rgba(6, 78, 59, 0.92);
    border-color: #065f46;
    color: #6ee7b7;
}
.dark .p-toast-message-success .p-toast-message-icon,
.dark .p-toast-message-success .p-toast-close-button {
    color: #6ee7b7;
}

.dark .p-toast-message-warn,
[data-theme="dark"] .p-toast-message-warn {
    background: rgba(69, 26, 3, 0.92);
    border-color: #78350f;
    color: #fde047;
}
.dark .p-toast-message-warn .p-toast-message-icon,
.dark .p-toast-message-warn .p-toast-close-button {
    color: #fde047;
}

.dark .p-toast-message-error,
[data-theme="dark"] .p-toast-message-error {
    background: rgba(69, 10, 10, 0.92);
    border-color: #7f1d1d;
    color: #fca5a5;
}
.dark .p-toast-message-error .p-toast-message-icon,
.dark .p-toast-message-error .p-toast-close-button {
    color: #fca5a5;
}

.dark .p-toast-message-secondary,
[data-theme="dark"] .p-toast-message-secondary {
    background: rgba(30, 41, 59, 0.92);
    border-color: #334155;
    color: #cbd5e1;
}
.dark .p-toast-message-secondary .p-toast-message-icon,
.dark .p-toast-message-secondary .p-toast-close-button {
    color: #cbd5e1;
}

.dark .p-toast-message-contrast,
[data-theme="dark"] .p-toast-message-contrast {
    background: #ffffff;
    border-color: #e2e8f0;
    color: #0f172a;
}
.dark .p-toast-message-contrast .p-toast-message-icon,
.dark .p-toast-message-contrast .p-toast-close-button {
    color: #0f172a;
}

.dark .p-toast-close-button:hover,
[data-theme="dark"] .p-toast-close-button:hover {
    background: rgba(255, 255, 255, 0.12);
}
`,v='<svg class="p-toast-close-icon" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>',d=class{registeredContainers=new Map;activeMessages=new Map;constructor(){typeof window<"u"&&this.initGlobalListeners()}initGlobalListeners(){document.addEventListener("toast:show",t=>{let e=t.detail;e&&this.add(e)}),document.addEventListener("toast:clear",t=>{let e=t.detail;e?.group?this.removeGroup(e.group):this.removeAllGroups()})}registerContainer(t,e){this.registeredContainers.set(t||"default",e)}unregisterContainer(t){this.registeredContainers.delete(t||"default")}getContainerForGroup(t,e){let o=t||"default",i=this.registeredContainers.get(o);if(!i||!document.body.contains(i)){u("toast",w);let p=e||(o.startsWith("top-")||o.startsWith("bottom-")||o==="center"?o:"top-right");i=document.createElement("div"),i.id=`aura-toast-container-${o}`,i.className=`p-toast p-toast-${p}`,document.body.appendChild(i),this.registeredContainers.set(o,i)}return i}add(t){let e=t.id||`toast_${Date.now()}_${Math.random().toString(36).substr(2,9)}`,o=t.group||"default",i=this.getContainerForGroup(o),p=t.severity||"info",m=t.sticky===!0?0:t.life!==void 0?t.life:3e3,c="";if(t.spin)c=`<span class="p-toast-spin">${s.loader2||'<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>'}</span>`;else if(t.icon&&s[t.icon])c=s[t.icon];else switch(p){case"success":c=s.check||'<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6 9 17l-5-5"/></svg>';break;case"warn":c=s.receipt||s.alertTriangle||'<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/></svg>';break;case"error":c=s.alertTriangle||s.xCircle||'<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>';break;case"secondary":c=`<span class="p-toast-spin">${s.loader2||'<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>'}</span>`;break;case"contrast":c=s.wifi||s.sparkles||'<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h.01"/><path d="M2 8.82a15 15 0 0 1 20 0"/></svg>';break;case"info":default:c=s.sparkles||s.info||'<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>';break}let a=document.createElement("div");a.className=`p-toast-message p-toast-message-${p} ${t.styleClass||""}`,a.setAttribute("role","alert"),a.setAttribute("aria-live","assertive"),a.setAttribute("aria-atomic","true"),a.setAttribute("data-toast-id",e),a.setAttribute("data-toast-group",o),t.contentHtml?a.innerHTML=`
                <div class="p-toast-message-content">
                    <div style="width: 100%;">${t.contentHtml}</div>
                    ${t.closable!==!1?`
                        <button type="button" class="p-toast-close-button" aria-label="Close" title="Close" data-toast-close>
                            ${v}
                        </button>
                    `:""}
                </div>
            `:a.innerHTML=`
                <div class="p-toast-message-content">
                    <div class="p-toast-message-icon">${c}</div>
                    <div class="p-toast-message-text">
                        ${t.summary?`<div class="p-toast-summary">${t.summary}</div>`:""}
                        ${t.detail?`<div class="p-toast-detail">${t.detail}</div>`:""}
                        ${t.actionLabel?`
                            <button type="button" class="p-button p-button-sm p-button-primary" style="margin-top: 0.5rem; align-self: flex-start; padding: 0.25rem 0.65rem; font-size: 0.775rem;" data-toast-action-btn>
                                ${t.actionLabel}
                            </button>
                        `:""}
                    </div>
                    ${t.closable!==!1?`
                        <button type="button" class="p-toast-close-button" aria-label="Close" title="Close" data-toast-close>
                            ${v}
                        </button>
                    `:""}
                </div>
            `;let g=a.querySelector("[data-toast-close]");g&&(g.addEventListener("click",n=>{n.stopPropagation(),this.removeById(e)}),g.addEventListener("keydown",n=>{(n.key==="Enter"||n.key===" ")&&(n.preventDefault(),this.removeById(e))}));let f=a.querySelector("[data-toast-action-btn]");f&&t.onAction&&f.addEventListener("click",n=>{n.stopPropagation(),t.onAction()});let r={el:a,timeoutId:void 0,remainingLife:m,startTime:Date.now()},h=n=>{n<=0||(r.startTime=Date.now(),r.remainingLife=n,r.timeoutId=setTimeout(()=>{this.removeById(e)},n))},y=()=>{if(r.timeoutId){clearTimeout(r.timeoutId),r.timeoutId=void 0;let n=Date.now()-r.startTime;r.remainingLife=Math.max(0,r.remainingLife-n)}},k=()=>{r.remainingLife>0&&!r.timeoutId&&h(r.remainingLife)};return a.addEventListener("mouseenter",y),a.addEventListener("mouseleave",k),m>0&&h(m),this.activeMessages.set(e,r),i.appendChild(a),e}removeById(t){let e=this.activeMessages.get(t);if(!e)return;e.timeoutId&&clearTimeout(e.timeoutId);let o=e.el,i=o.getBoundingClientRect().height;o.style.maxHeight=`${i}px`,o.offsetHeight,o.classList.add("p-toast-message-leave"),this.activeMessages.delete(t),setTimeout(()=>{o.remove()},260)}remove(t){typeof t=="string"?this.removeById(t):t.id?this.removeById(t.id):t.group&&this.removeGroup(t.group)}removeGroup(t){this.activeMessages.forEach((e,o)=>{e.el.getAttribute("data-toast-group")===t&&this.removeById(o)})}removeAllGroups(){this.activeMessages.forEach((t,e)=>{this.removeById(e)})}},b=new d;typeof window<"u"&&(window.$toast=b,window.useToast=()=>b,window.ToastService=d);function x(l,t){u("toast",w);let e=t.group||"default",o=t.position||"top-right";l.className=`p-toast p-toast-${o} ${t.class||""}`,t.gap&&l.style.setProperty("--p-toast-gap",`${t.gap}px`),b.registerContainer(e,l)}export{d as ToastService,x as default,b as globalToast};
