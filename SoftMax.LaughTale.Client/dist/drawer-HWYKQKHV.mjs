import{e as l}from"./chunk-3YU53HBK.mjs";var f=`
.p-drawer-mask {
    position: fixed;
    inset: 0;
    z-index: 1100;
    display: flex;
    box-sizing: border-box;
    pointer-events: none;
    visibility: hidden;
    opacity: 0;
    background: rgba(15, 23, 42, 0.45);
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
    transition: opacity 0.32s cubic-bezier(0.16, 1, 0.3, 1), visibility 0.32s cubic-bezier(0.16, 1, 0.3, 1);
}

.p-drawer-mask.p-drawer-mask-active {
    visibility: visible;
    opacity: 1;
    pointer-events: auto;
}

/* Positioning & Layout */
.p-drawer-mask.p-drawer-left {
    justify-content: flex-start;
    align-items: stretch;
}
.p-drawer-mask.p-drawer-right {
    justify-content: flex-end;
    align-items: stretch;
}
.p-drawer-mask.p-drawer-top {
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
}
.p-drawer-mask.p-drawer-bottom {
    flex-direction: column;
    justify-content: flex-end;
    align-items: stretch;
}
.p-drawer-mask.p-drawer-full {
    align-items: stretch;
    justify-content: stretch;
}

/* Drawer Container */
.p-drawer {
    background: var(--p-surface-0, #ffffff);
    border: none;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.35);
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    pointer-events: auto;
    will-change: transform, opacity;
    transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.35s ease;
}

/* Position Transforms */
.p-drawer-left .p-drawer {
    width: 22rem;
    max-width: 100vw;
    height: 100%;
    border-right: 1px solid var(--p-border-color, #e2e8f0);
    transform: translate3d(-100%, 0, 0);
}
.p-drawer-mask-active.p-drawer-left .p-drawer {
    transform: translate3d(0, 0, 0);
}

.p-drawer-right .p-drawer {
    width: 22rem;
    max-width: 100vw;
    height: 100%;
    border-left: 1px solid var(--p-border-color, #e2e8f0);
    transform: translate3d(100%, 0, 0);
}
.p-drawer-mask-active.p-drawer-right .p-drawer {
    transform: translate3d(0, 0, 0);
}

.p-drawer-top .p-drawer {
    width: 100%;
    height: auto;
    max-height: 80vh;
    border-bottom: 1px solid var(--p-border-color, #e2e8f0);
    transform: translate3d(0, -100%, 0);
}
.p-drawer-mask-active.p-drawer-top .p-drawer {
    transform: translate3d(0, 0, 0);
}

.p-drawer-bottom .p-drawer {
    width: 100%;
    height: auto;
    max-height: 80vh;
    border-top: 1px solid var(--p-border-color, #e2e8f0);
    transform: translate3d(0, 100%, 0);
}
.p-drawer-mask-active.p-drawer-bottom .p-drawer {
    transform: translate3d(0, 0, 0);
}

.p-drawer-full .p-drawer {
    width: 100vw;
    height: 100vh;
    transform: scale(0.95);
    opacity: 0;
}
.p-drawer-mask-active.p-drawer-full .p-drawer {
    transform: scale(1);
    opacity: 1;
}

/* Header */
.p-drawer-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.25rem 1.5rem 1rem 1.5rem;
    border-bottom: none;
    user-select: none;
    flex-shrink: 0;
}

.p-drawer-title {
    font-weight: 700;
    font-size: 1.125rem;
    color: var(--p-text-color, #0f172a);
    margin: 0;
}

.p-drawer-header-actions {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    margin-left: auto;
}

.p-drawer-close-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2.25rem;
    height: 2.25rem;
    border-radius: 9999px;
    border: none;
    background: transparent;
    color: var(--p-surface-500, #64748b);
    cursor: pointer;
    transition: background-color 0.15s ease, color 0.15s ease;
    padding: 0;
}
.p-drawer-close-button:hover {
    background: var(--p-surface-100, #f1f5f9);
    color: var(--p-text-color, #0f172a);
}

/* Content */
.p-drawer-content {
    padding: 0 1.5rem 1.5rem 1.5rem;
    flex: 1 1 auto;
    overflow-y: auto;
    box-sizing: border-box;
}

/* Footer */
.p-drawer-footer {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 1rem 1.5rem;
    border-top: 1px solid var(--p-border-color, #e2e8f0);
    flex-shrink: 0;
}

/* Headless Navigation Elements */
.p-drawer-nav-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.65rem 0.85rem;
    border-radius: var(--p-border-radius, 8px);
    color: var(--p-surface-700, #334155);
    text-decoration: none;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.15s ease, color 0.15s ease;
}
.p-drawer-nav-item:hover {
    background: var(--p-surface-100, #f1f5f9);
    color: var(--p-text-color, #0f172a);
}

.p-drawer-nav-section-title {
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.05em;
    color: var(--p-surface-500, #64748b);
    padding: 0.75rem 0.85rem 0.35rem 0.85rem;
    text-transform: uppercase;
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
}

/* Dark Mode Tokens */
.dark .p-drawer,
[data-theme="dark"] .p-drawer {
    background: var(--p-surface-900, #0f172a);
    border-color: var(--p-surface-700, #334155);
}
.dark .p-drawer-title,
[data-theme="dark"] .p-drawer-title {
    color: var(--p-surface-0, #f8fafc);
}
.dark .p-drawer-close-button,
[data-theme="dark"] .p-drawer-close-button {
    color: var(--p-surface-400, #94a3b8);
}
.dark .p-drawer-close-button:hover,
[data-theme="dark"] .p-drawer-close-button:hover {
    background: var(--p-surface-800, #1e293b);
    color: #ffffff;
}
.dark .p-drawer-footer,
[data-theme="dark"] .p-drawer-footer {
    border-color: var(--p-surface-700, #334155);
}
.dark .p-drawer-nav-item,
[data-theme="dark"] .p-drawer-nav-item {
    color: var(--p-surface-200, #e2e8f0);
}
.dark .p-drawer-nav-item:hover,
[data-theme="dark"] .p-drawer-nav-item:hover {
    background: var(--p-surface-800, #1e293b);
    color: #ffffff;
}
.dark .p-drawer-nav-section-title,
[data-theme="dark"] .p-drawer-nav-section-title {
    color: var(--p-surface-400, #94a3b8);
}
`,c=!1;function m(){c||typeof document>"u"||(c=!0,document.addEventListener("click",a=>{let r=a.target,s=r.closest("[data-drawer-target], [data-drawer-open]");if(s){a.preventDefault();let e=s.getAttribute("data-drawer-target")||s.getAttribute("data-drawer-open"),t=s.getAttribute("data-drawer-position");if(e){let o=document.getElementById(e)?.querySelector(".p-drawer-mask");if(o){if(t){let p=t.toLowerCase().replace(/[^a-z]/g,"");o.className=o.className.replace(/p-drawer-(left|right|top|bottom|full)/g,""),o.classList.add(`p-drawer-${p}`)}o.classList.add("p-drawer-mask-active"),o.classList.contains("p-drawer-mask-modal")&&(document.body.style.overflow="hidden")}}return}let d=r.closest(".p-drawer-close-button, [data-drawer-close]");if(d){a.preventDefault();let e=d.closest(".p-drawer-mask");e&&(e.classList.remove("p-drawer-mask-active"),document.body.style.overflow="");return}if(r.classList.contains("p-drawer-mask")){let e=r.closest('[data-island="drawer"]'),t=!0;if(e)try{JSON.parse(e.getAttribute("data-props")||"{}").dismissableMask===!1&&(t=!1)}catch{}t&&(r.classList.remove("p-drawer-mask-active"),document.body.style.overflow="")}let i=r.closest("[data-drawer-toggle]");if(i){a.preventDefault();let e=i.nextElementSibling;if(e){let t=e.style.display==="none"||e.classList.contains("hidden");e.style.display=t?"block":"none",e.classList.toggle("hidden",!t);let n=i.querySelector(".p-drawer-chevron");n&&(n.style.transform=t?"rotate(180deg)":"rotate(0deg)")}}}),window.addEventListener("keydown",a=>{if(a.key==="Escape"){let r=document.querySelector(".p-drawer-mask.p-drawer-mask-active");r&&(r.classList.remove("p-drawer-mask-active"),document.body.style.overflow="")}}))}function w(a,r){l("drawer",f),m()}export{w as default};
