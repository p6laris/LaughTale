import{e as b}from"./chunk-3YU53HBK.mjs";var h=`
.p-dialog-mask {
    position: fixed;
    inset: 0;
    z-index: 1100;
    display: none;
    box-sizing: border-box;
    padding: 1.5rem;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.p-dialog-mask.p-dialog-mask-modal {
    background: rgba(15, 23, 42, 0.45);
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
}

.p-dialog-mask.p-dialog-mask-active {
    display: flex !important;
    opacity: 1;
    pointer-events: auto;
}

/* 9-Direction Positioning */
.p-dialog-mask.p-dialog-pos-center {
    align-items: center;
    justify-content: center;
}
.p-dialog-mask.p-dialog-pos-top {
    align-items: flex-start;
    justify-content: center;
    padding-top: 3rem;
}
.p-dialog-mask.p-dialog-pos-bottom {
    align-items: flex-end;
    justify-content: center;
    padding-bottom: 3rem;
}
.p-dialog-mask.p-dialog-pos-left {
    align-items: center;
    justify-content: flex-start;
    padding-left: 3rem;
}
.p-dialog-mask.p-dialog-pos-right {
    align-items: center;
    justify-content: flex-end;
    padding-right: 3rem;
}
.p-dialog-mask.p-dialog-pos-topleft {
    align-items: flex-start;
    justify-content: flex-start;
    padding-top: 3rem;
    padding-left: 3rem;
}
.p-dialog-mask.p-dialog-pos-topright {
    align-items: flex-start;
    justify-content: flex-end;
    padding-top: 3rem;
    padding-right: 3rem;
}
.p-dialog-mask.p-dialog-pos-bottomleft {
    align-items: flex-end;
    justify-content: flex-start;
    padding-bottom: 3rem;
    padding-left: 3rem;
}
.p-dialog-mask.p-dialog-pos-bottomright {
    align-items: flex-end;
    justify-content: flex-end;
    padding-bottom: 3rem;
    padding-right: 3rem;
}

/* Dialog Container */
.p-dialog {
    background: var(--p-surface-0, #ffffff);
    border: 1px solid var(--p-border-color, #e2e8f0);
    border-radius: var(--p-border-radius-xl, 12px);
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.04);
    min-width: 20rem;
    max-width: 90vw;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    pointer-events: auto;
    will-change: transform, opacity;
    transform: scale(0.95) translateY(6px);
    transition: transform 0.22s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.2s ease, width 0.2s ease, height 0.2s ease;
}

.p-dialog-mask.p-dialog-mask-active .p-dialog {
    transform: scale(1) translateY(0);
}

/* Maximized Mode */
.p-dialog.p-dialog-maximized {
    width: 100vw !important;
    height: 100vh !important;
    max-width: 100vw !important;
    max-height: 100vh !important;
    border-radius: 0 !important;
    border: none !important;
    top: 0 !important;
    left: 0 !important;
    margin: 0 !important;
}

/* Header */
.p-dialog-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.25rem 1.5rem 1rem 1.5rem;
    border-bottom: none;
    user-select: none;
}

.p-dialog.p-dialog-draggable .p-dialog-header {
    cursor: move;
}

.p-dialog-title {
    font-weight: 700;
    font-size: 1.125rem;
    color: var(--p-text-color, #0f172a);
    margin: 0;
}

.p-dialog-header-actions {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    margin-left: auto;
}

.p-dialog-header-action {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    border-radius: 9999px;
    border: none;
    background: transparent;
    color: var(--p-surface-500, #64748b);
    cursor: pointer;
    transition: background-color 0.15s ease, color 0.15s ease;
    padding: 0;
}
.p-dialog-header-action:hover {
    background: var(--p-surface-100, #f1f5f9);
    color: var(--p-text-color, #0f172a);
}

/* Content */
.p-dialog-content {
    padding: 0 1.5rem 1.5rem 1.5rem;
    flex: 1 1 auto;
    overflow-y: auto;
    box-sizing: border-box;
}

/* Footer */
.p-dialog-footer {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 0.5rem;
    padding: 0 1.5rem 1.25rem 1.5rem;
    border-top: none;
}

/* Dark Mode Tokens */
.dark .p-dialog,
[data-theme="dark"] .p-dialog {
    background: var(--p-surface-900, #0f172a);
    border-color: var(--p-surface-700, #334155);
}
.dark .p-dialog-title,
[data-theme="dark"] .p-dialog-title {
    color: var(--p-surface-0, #f8fafc);
}
.dark .p-dialog-header-action,
[data-theme="dark"] .p-dialog-header-action {
    color: var(--p-surface-400, #94a3b8);
}
.dark .p-dialog-header-action:hover,
[data-theme="dark"] .p-dialog-header-action:hover {
    background: var(--p-surface-800, #1e293b);
    color: #ffffff;
}
`;var w='<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" x2="14" y1="3" y2="10"/><line x1="3" x2="10" y1="21" y2="14"/></svg>',L='<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 14 10 14 10 20"/><polyline points="20 10 14 10 14 4"/><line x1="14" x2="21" y1="10" y2="3"/><line x1="10" x2="3" y1="14" y2="21"/></svg>',y=!1;function E(){y||typeof document>"u"||(y=!0,document.addEventListener("click",n=>{let o=n.target,s=o.closest("[data-dialog-target], [data-dialog-open]");if(s){n.preventDefault();let e=s.getAttribute("data-dialog-target")||s.getAttribute("data-dialog-open"),i=s.getAttribute("data-dialog-position");if(e){let a=document.getElementById(e)?.querySelector(".p-dialog-mask");if(a){if(i){let r=i.toLowerCase().replace(/[^a-z]/g,"");a.className=a.className.replace(/p-dialog-pos-[a-z]+/g,""),a.classList.add(`p-dialog-pos-${r}`)}a.style.display="flex",a.offsetWidth,a.classList.add("p-dialog-mask-active"),a.classList.contains("p-dialog-mask-modal")&&(document.body.style.overflow="hidden")}}return}let t=o.closest(".p-dialog-close-button, [data-dialog-close]");if(t){n.preventDefault();let e=t.closest(".p-dialog-mask");e&&(e.classList.remove("p-dialog-mask-active"),setTimeout(()=>{e.classList.contains("p-dialog-mask-active")||(e.style.display="none")},200),document.body.style.overflow="");return}if(o.classList.contains("p-dialog-mask")){let e=o.closest('[data-island="dialog"]'),i=!0;if(e)try{let l=JSON.parse(e.getAttribute("data-props")||"{}");l.dismissableMask===!1&&l.modal===!0&&(i=!1)}catch{}i&&(o.classList.remove("p-dialog-mask-active"),setTimeout(()=>{o.classList.contains("p-dialog-mask-active")||(o.style.display="none")},200),document.body.style.overflow="")}}),window.addEventListener("keydown",n=>{if(n.key==="Escape"){let o=document.querySelector(".p-dialog-mask.p-dialog-mask-active");o&&(o.classList.remove("p-dialog-mask-active"),setTimeout(()=>{o.classList.contains("p-dialog-mask-active")||(o.style.display="none")},200),document.body.style.overflow="")}}))}function M(n,o){b("dialog",h),E();let s=n.querySelector(".p-dialog-mask"),t=n.querySelector(".p-dialog");if(!s||!t)return;let e=!1,i=!1,l=0,a=0,r=0,g=0,p=t.querySelector(".p-dialog-maximize-button");if(p&&p.addEventListener("click",d=>{d.preventDefault(),d.stopPropagation(),e=!e,t.classList.toggle("p-dialog-maximized",e),p.innerHTML=e?L:w,p.setAttribute("aria-label",e?"Minimize":"Maximize")}),o.draggable){t.classList.add("p-dialog-draggable");let d=t.querySelector(".p-dialog-header");d&&d.addEventListener("mousedown",c=>{if(c.target.closest(".p-dialog-header-action")||e)return;i=!0,l=c.clientX,a=c.clientY;let m=t.getBoundingClientRect();r=m.left,g=m.top,t.style.position="fixed",t.style.margin="0",t.style.left=`${r}px`,t.style.top=`${g}px`;let f=x=>{if(!i)return;let v=x.clientX-l,k=x.clientY-a;t.style.left=`${r+v}px`,t.style.top=`${g+k}px`},u=()=>{i=!1,document.removeEventListener("mousemove",f),document.removeEventListener("mouseup",u)};document.addEventListener("mousemove",f),document.addEventListener("mouseup",u)})}}export{M as default};
