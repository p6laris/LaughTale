import{e as p}from"./chunk-3YU53HBK.mjs";var u=`
.p-confirmdialog-mask {
    position: fixed;
    inset: 0;
    background: rgba(15, 23, 42, 0.5);
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
    z-index: 1200;
    display: flex;
    box-sizing: border-box;
    padding: 1.5rem;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.p-confirmdialog-mask.p-confirmdialog-mask-active {
    opacity: 1;
    pointer-events: auto;
}

/* Positioning rules */
.p-confirmdialog-mask.p-confirmdialog-pos-center {
    align-items: center;
    justify-content: center;
}
.p-confirmdialog-mask.p-confirmdialog-pos-top {
    align-items: flex-start;
    justify-content: center;
    padding-top: 3rem;
}
.p-confirmdialog-mask.p-confirmdialog-pos-bottom {
    align-items: flex-end;
    justify-content: center;
    padding-bottom: 3rem;
}
.p-confirmdialog-mask.p-confirmdialog-pos-left {
    align-items: center;
    justify-content: flex-start;
    padding-left: 3rem;
}
.p-confirmdialog-mask.p-confirmdialog-pos-right {
    align-items: center;
    justify-content: flex-end;
    padding-right: 3rem;
}
.p-confirmdialog-mask.p-confirmdialog-pos-topleft {
    align-items: flex-start;
    justify-content: flex-start;
    padding-top: 3rem;
    padding-left: 3rem;
}
.p-confirmdialog-mask.p-confirmdialog-pos-topright {
    align-items: flex-start;
    justify-content: flex-end;
    padding-top: 3rem;
    padding-right: 3rem;
}
.p-confirmdialog-mask.p-confirmdialog-pos-bottomleft {
    align-items: flex-end;
    justify-content: flex-start;
    padding-bottom: 3rem;
    padding-left: 3rem;
}
.p-confirmdialog-mask.p-confirmdialog-pos-bottomright {
    align-items: flex-end;
    justify-content: flex-end;
    padding-bottom: 3rem;
    padding-right: 3rem;
}

/* Dialog Container */
.p-confirmdialog.p-dialog {
    background: var(--p-surface-0, #ffffff);
    border: 1px solid var(--p-border-color, #e2e8f0);
    border-radius: var(--p-border-radius-xl, 12px);
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.15), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
    min-width: 24rem;
    max-width: 32rem;
    width: 100%;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    transform: scale(0.94) translateY(6px);
    transition: transform 0.22s cubic-bezier(0.16, 1, 0.3, 1);
}

.p-confirmdialog-mask.p-confirmdialog-mask-active .p-confirmdialog.p-dialog {
    transform: scale(1) translateY(0);
}

/* Header */
.p-confirmdialog .p-dialog-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.25rem 1.5rem 0.75rem 1.5rem;
    border-bottom: none;
}

.p-confirmdialog .p-dialog-title {
    font-weight: 700;
    font-size: 1.125rem;
    color: var(--p-text-color, #0f172a);
    margin: 0;
}

.p-confirmdialog .p-dialog-header-close {
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
.p-confirmdialog .p-dialog-header-close:hover {
    background: var(--p-surface-100, #f1f5f9);
    color: var(--p-text-color, #0f172a);
}

/* Content */
.p-confirmdialog .p-dialog-content {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    padding: 0.5rem 1.5rem 1.5rem 1.5rem;
    flex: 1 1 auto;
}

.p-confirmdialog .p-confirmdialog-icon {
    font-size: 1.75rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    margin-top: 0.125rem;
    color: var(--p-primary-500, #10b981);
}

.p-confirmdialog-icon-danger {
    color: #ef4444 !important;
}
.p-confirmdialog-icon-warning {
    color: #f59e0b !important;
}
.p-confirmdialog-icon-info {
    color: #3b82f6 !important;
}

.p-confirmdialog .p-confirmdialog-message {
    font-size: 0.9375rem;
    color: var(--p-surface-700, #334155);
    line-height: 1.5;
    margin: 0;
}

/* Footer */
.p-confirmdialog .p-dialog-footer {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 0.5rem;
    padding: 0 1.5rem 1.25rem 1.5rem;
    border-top: none;
}

/* Headless Variant */
.p-confirmdialog-headless {
    padding: 2rem 1.5rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 1.25rem;
}

.p-confirmdialog-headless-icon {
    width: 4rem;
    height: 4rem;
    border-radius: 9999px;
    background: var(--p-primary-50, #ecfdf5);
    color: var(--p-primary-600, #059669);
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px solid var(--p-primary-200, #a7f3d0);
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.15);
}

/* Dark Mode Tokens */
.dark .p-confirmdialog.p-dialog,
[data-theme="dark"] .p-confirmdialog.p-dialog {
    background: var(--p-surface-900, #0f172a);
    border-color: var(--p-surface-700, #334155);
}
.dark .p-confirmdialog .p-dialog-title,
[data-theme="dark"] .p-confirmdialog .p-dialog-title {
    color: var(--p-surface-0, #f8fafc);
}
.dark .p-confirmdialog .p-dialog-header-close,
[data-theme="dark"] .p-confirmdialog .p-dialog-header-close {
    color: var(--p-surface-400, #94a3b8);
}
.dark .p-confirmdialog .p-dialog-header-close:hover,
[data-theme="dark"] .p-confirmdialog .p-dialog-header-close:hover {
    background: var(--p-surface-800, #1e293b);
    color: #ffffff;
}
.dark .p-confirmdialog .p-confirmdialog-message,
[data-theme="dark"] .p-confirmdialog .p-confirmdialog-message {
    color: var(--p-surface-300, #cbd5e1);
}
.dark .p-confirmdialog-headless-icon,
[data-theme="dark"] .p-confirmdialog-headless-icon {
    background: rgba(16, 185, 129, 0.15);
    border-color: rgba(16, 185, 129, 0.35);
    color: #6ee7b7;
}
`,v='<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" x2="6" y1="6" y2="18"/><line x1="6" x2="18" y1="6" y2="18"/></svg>',f='<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="16" y2="12"/><line x1="12" x2="12.01" y1="8" y2="8"/></svg>',g='<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>',x='<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>',y='<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',k='<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',w='<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>',m=class{maskEl=null;dialogEl=null;currentOptions=null;constructor(){typeof document<"u"&&this.initDOM()}initDOM(){this.maskEl||(p("confirm-dialog",u),this.maskEl=document.createElement("div"),this.maskEl.className="p-confirmdialog-mask p-confirmdialog-pos-center",this.maskEl.setAttribute("role","dialog"),this.maskEl.setAttribute("aria-modal","true"),this.maskEl.addEventListener("click",e=>{e.target===this.maskEl&&this.close(!1)}),window.addEventListener("keydown",e=>{e.key==="Escape"&&this.maskEl?.classList.contains("p-confirmdialog-mask-active")&&this.close(!1)}),document.body.appendChild(this.maskEl))}require(e){this.initDOM(),this.currentOptions=e;let r=(e.position||"center").toLowerCase().replace(/[^a-z]/g,"");this.maskEl&&(this.maskEl.className=`p-confirmdialog-mask p-confirmdialog-pos-${r}`,this.renderDialog(e),setTimeout(()=>{this.maskEl?.classList.add("p-confirmdialog-mask-active")},10))}close(e=!1){this.maskEl&&(this.maskEl.classList.remove("p-confirmdialog-mask-active"),this.currentOptions&&(e&&this.currentOptions.accept?this.currentOptions.accept():!e&&this.currentOptions.reject&&this.currentOptions.reject()),this.currentOptions=null)}getIconSVG(e){if(!e)return f;let r=e.toLowerCase();return r.includes("danger")||r.includes("trash")||r.includes("alert")||r.includes("triangle")?`<span class="p-confirmdialog-icon p-confirmdialog-icon-danger">${g}</span>`:r.includes("warning")||r.includes("exclamation")?`<span class="p-confirmdialog-icon p-confirmdialog-icon-warning">${g}</span>`:r.includes("question")||r.includes("help")?`<span class="p-confirmdialog-icon p-confirmdialog-icon-info">${x}</span>`:r.includes("check")?`<span class="p-confirmdialog-icon">${k}</span>`:`<span class="p-confirmdialog-icon">${f}</span>`}renderDialog(e){if(this.maskEl){if(e.headless)this.maskEl.innerHTML=`
                <div class="p-confirmdialog p-dialog p-component" role="alertdialog">
                    <div class="p-confirmdialog-headless">
                        <div class="p-confirmdialog-headless-icon">
                            ${w}
                        </div>
                        <div>
                            <h3 style="font-size: 1.25rem; font-weight: 700; color: var(--p-text-color); margin: 0 0 0.5rem 0;">${e.header||"Save Changes?"}</h3>
                            <p style="font-size: 0.875rem; color: var(--p-text-muted); margin: 0; line-height: 1.5;">${e.message||"Are you sure you want to proceed with saving your profile changes?"}</p>
                        </div>
                        <div style="display: flex; gap: 0.75rem; width: 100%; margin-top: 0.5rem;">
                            <button type="button" class="btn-reject p-button p-button-outlined p-button-secondary" style="flex: 1; padding: 0.5rem 1rem; border-radius: var(--p-border-radius); font-weight: 600; font-size: 0.875rem;">
                                ${e.rejectLabel||"Cancel"}
                            </button>
                            <button type="button" class="btn-accept p-button p-button-primary" style="flex: 1; padding: 0.5rem 1rem; border-radius: var(--p-border-radius); font-weight: 600; font-size: 0.875rem;">
                                ${e.acceptLabel||"Save"}
                            </button>
                        </div>
                    </div>
                </div>
            `;else if(e.template)this.maskEl.innerHTML=e.template;else{let r=e.acceptSeverity==="danger"||e.icon&&(e.icon.includes("trash")||e.icon.includes("danger")),o=r?"p-button p-button-danger p-button-sm":"p-button p-button-primary p-button-sm",i=r?"background: #ef4444; border: 1px solid #ef4444; color: #ffffff;":"background: var(--p-primary-500); border: 1px solid var(--p-primary-500); color: #ffffff;";this.maskEl.innerHTML=`
                <div class="p-confirmdialog p-dialog p-component" role="alertdialog">
                    <div class="p-dialog-header">
                        <h3 class="p-dialog-title">${e.header||"Confirmation"}</h3>
                        <button type="button" class="p-dialog-header-close" aria-label="Close dialog">
                            ${v}
                        </button>
                    </div>
                    <div class="p-dialog-content">
                        ${this.getIconSVG(e.icon)}
                        <p class="p-confirmdialog-message">${e.message||"Are you sure you want to proceed?"}</p>
                    </div>
                    <div class="p-dialog-footer">
                        <button type="button" class="btn-reject p-button p-button-outlined p-button-secondary p-button-sm" style="padding: 0.45rem 1rem; font-size: 0.875rem; font-weight: 600; border-radius: var(--p-border-radius); border: 1px solid var(--p-border-color); background: transparent; color: var(--p-text-color);">
                            ${e.rejectLabel||"Cancel"}
                        </button>
                        <button type="button" class="btn-accept ${o}" style="padding: 0.45rem 1rem; font-size: 0.875rem; font-weight: 600; border-radius: var(--p-border-radius); ${i}">
                            ${e.acceptLabel||(r?"Delete":"Save")}
                        </button>
                    </div>
                </div>
            `}this.maskEl.querySelector(".p-dialog-header-close")?.addEventListener("click",()=>this.close(!1)),this.maskEl.querySelector(".btn-reject")?.addEventListener("click",()=>this.close(!1)),this.maskEl.querySelector(".btn-accept")?.addEventListener("click",()=>this.close(!0))}}},d=new m;window.$confirm=d;function n(l,e,r="info"){if(window.$toast?.add){window.$toast.add({severity:r,summary:l,detail:e,life:3e3});return}let o=document.getElementById("aura-toast-container");o||(o=document.createElement("div"),o.id="aura-toast-container",o.style.cssText="position: fixed; top: 1.5rem; right: 1.5rem; z-index: 2000; display: flex; flex-direction: column; gap: 0.5rem; pointer-events: none;",document.body.appendChild(o));let i=document.createElement("div"),t=r==="error"||r==="warn",a=t?"#ef4444":"var(--p-primary-500, #10b981)",c=t?"rgba(239, 68, 68, 0.1)":"rgba(16, 185, 129, 0.1)",s=t?"#ef4444":"var(--p-primary-600, #059669)";i.style.cssText=`background: var(--p-surface-0, #ffffff); border-left: 4px solid ${a}; border-radius: var(--p-border-radius, 6px); box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); padding: 0.75rem 1rem; width: 18rem; pointer-events: auto; display: flex; align-items: flex-start; gap: 0.5rem; animation: slideInRight 0.2s ease;`,i.innerHTML=`
        <span style="color: ${s}; display: flex; align-items: center; margin-top: 2px;">${t?g:y}</span>
        <div>
            <div style="font-weight: 700; font-size: 0.875rem; color: var(--p-text-color, #0f172a);">${l}</div>
            <div style="font-size: 0.8125rem; color: var(--p-text-muted, #64748b);">${e}</div>
        </div>
    `,o.appendChild(i),setTimeout(()=>{i.style.opacity="0",i.style.transition="opacity 0.3s ease",setTimeout(()=>i.remove(),300)},3e3)}function C(l,e){p("confirm-dialog",u),l.querySelectorAll("[data-confirm-trigger]").forEach(o=>{o.addEventListener("click",i=>{i.preventDefault();let t=o.getAttribute("data-confirm-trigger")||"basic",a=o.getAttribute("data-confirm-position")||e.position||"center",c=o.getAttribute("data-confirm-header"),s=o.getAttribute("data-confirm-message"),h=o.getAttribute("data-confirm-icon"),b=o.getAttribute("data-confirm-severity")||"primary";t==="delete"?d.require({header:c||"Delete Confirmation",message:s||"Do you want to delete this record?",icon:"danger",acceptSeverity:"danger",acceptLabel:"Delete",rejectLabel:"Cancel",position:a,accept:()=>n("Confirmed","Record deleted","info"),reject:()=>n("Rejected","You have rejected","error")}):t==="headless"?d.require({header:c||"Save Changes?",message:s||"Are you sure you want to proceed with saving your profile changes?",headless:!0,position:a,accept:()=>n("Confirmed","Changes saved successfully.","success"),reject:()=>n("Rejected","You have cancelled the action.","info")}):t==="template"?d.require({header:c||"Confirmation",message:s||"Please confirm to continue with processing your order.",icon:"question",position:a,acceptLabel:"Yes",rejectLabel:"No",accept:()=>n("Confirmed","Order processed successfully.","success"),reject:()=>n("Rejected","Order process cancelled.","warn")}):d.require({header:c||"Confirmation",message:s||"Are you sure you want to proceed?",icon:h||"info",acceptSeverity:b,position:a,accept:()=>n("Confirmed","You have accepted","info"),reject:()=>n("Rejected","You have rejected","error")})})})}export{C as default,n as showToastFeedback};
