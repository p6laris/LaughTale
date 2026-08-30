import{e as c}from"./chunk-3YU53HBK.mjs";var f=`
.p-confirmpopup {
    position: absolute;
    z-index: 1100;
    background: var(--p-surface-0, #ffffff);
    border: 1px solid var(--p-border-color, #e2e8f0);
    border-radius: var(--p-border-radius-lg, 10px);
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05);
    padding: 0.875rem 1rem;
    min-width: 17rem;
    max-width: 24rem;
    box-sizing: border-box;
    display: none;
    opacity: 0;
    transform: scale(0.95) translateY(4px);
    transition: transform 0.16s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.16s ease;
}

.p-confirmpopup.p-confirmpopup-active {
    display: block;
    opacity: 1;
    transform: scale(1) translateY(0);
}

/* Arrow pointer notch */
.p-confirmpopup::before,
.p-confirmpopup::after {
    content: '';
    position: absolute;
    width: 0;
    height: 0;
    border: solid transparent;
    pointer-events: none;
}

/* Flipped top - popup is below target, arrow points UP */
.p-confirmpopup-flipped-top::before {
    bottom: 100%;
    left: var(--p-popup-arrow-left, 24px);
    border-width: 8px;
    border-bottom-color: var(--p-border-color, #e2e8f0);
}
.p-confirmpopup-flipped-top::after {
    bottom: 100%;
    left: calc(var(--p-popup-arrow-left, 24px) + 1px);
    border-width: 7px;
    border-bottom-color: var(--p-surface-0, #ffffff);
}

/* Flipped bottom - popup is above target, arrow points DOWN */
.p-confirmpopup-flipped-bottom::before {
    top: 100%;
    left: var(--p-popup-arrow-left, 24px);
    border-width: 8px;
    border-top-color: var(--p-border-color, #e2e8f0);
}
.p-confirmpopup-flipped-bottom::after {
    top: 100%;
    left: calc(var(--p-popup-arrow-left, 24px) + 1px);
    border-width: 7px;
    border-top-color: var(--p-surface-0, #ffffff);
}

/* Body Content */
.p-confirmpopup-content {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding-bottom: 0.75rem;
}

.p-confirmpopup-icon {
    font-size: 1.35rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    color: var(--p-surface-700, #334155);
}

.p-confirmpopup-icon-danger {
    color: #ef4444 !important;
}

.p-confirmpopup-message {
    font-size: 0.875rem;
    color: var(--p-text-color, #0f172a);
    line-height: 1.45;
    margin: 0;
    font-weight: 500;
}

/* Footer Actions */
.p-confirmpopup-footer {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 0.5rem;
    padding-top: 0.25rem;
}

/* Template Variant */
.p-confirmpopup-template-body {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 0.875rem;
    padding: 0.5rem 0.5rem 0.875rem 0.5rem;
    border-bottom: 1px solid var(--p-border-color, #e2e8f0);
    margin-bottom: 0.75rem;
}

.p-confirmpopup-template-icon {
    width: 3.5rem;
    height: 3.5rem;
    border-radius: 9999px;
    border: 3px solid var(--p-surface-400, #94a3b8);
    color: var(--p-surface-600, #475569);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.75rem;
}

/* Headless Variant */
.p-confirmpopup-headless {
    padding: 0.25rem 0.25rem 0.5rem 0.25rem;
}

/* Dark Mode Tokens */
.dark .p-confirmpopup,
[data-theme="dark"] .p-confirmpopup {
    background: var(--p-surface-900, #0f172a);
    border-color: var(--p-surface-700, #334155);
}
.dark .p-confirmpopup-flipped-top::before,
[data-theme="dark"] .p-confirmpopup-flipped-top::before {
    border-bottom-color: var(--p-surface-700, #334155);
}
.dark .p-confirmpopup-flipped-top::after,
[data-theme="dark"] .p-confirmpopup-flipped-top::after {
    border-bottom-color: var(--p-surface-900, #0f172a);
}
.dark .p-confirmpopup-flipped-bottom::before,
[data-theme="dark"] .p-confirmpopup-flipped-bottom::before {
    border-top-color: var(--p-surface-700, #334155);
}
.dark .p-confirmpopup-flipped-bottom::after,
[data-theme="dark"] .p-confirmpopup-flipped-bottom::after {
    border-top-color: var(--p-surface-900, #0f172a);
}
.dark .p-confirmpopup-message,
[data-theme="dark"] .p-confirmpopup-message {
    color: var(--p-surface-100, #f8fafc);
}
.dark .p-confirmpopup-template-body,
[data-theme="dark"] .p-confirmpopup-template-body {
    border-color: var(--p-surface-700, #334155);
}
.dark .p-confirmpopup-template-icon,
[data-theme="dark"] .p-confirmpopup-template-icon {
    border-color: var(--p-surface-600, #475569);
    color: var(--p-surface-300, #cbd5e1);
}
`,v='<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9"\u30C4\u30FC\u30EB height="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>',y='<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="16" y2="12"/><line x1="12" x2="12.01" y1="8" y2="8"/></svg>',w='<svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>',x='<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',k='<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" x2="6" y1="6" y2="18"/><line x1="6" x2="18" y1="6" y2="18"/></svg>',l=class{popupEl=null;currentOptions=null;outsideClickListener=null;constructor(){typeof document<"u"&&this.initDOM()}initDOM(){this.popupEl||(c("confirm-popup",f),this.popupEl=document.createElement("div"),this.popupEl.className="p-confirmpopup p-component",this.popupEl.setAttribute("role","alertdialog"),this.popupEl.setAttribute("aria-modal","true"),window.addEventListener("keydown",e=>{e.key==="Escape"&&this.popupEl?.classList.contains("p-confirmpopup-active")&&this.close(!1)}),document.body.appendChild(this.popupEl))}require(e){if(this.initDOM(),!(!this.popupEl||!e.target)){if(this.currentOptions&&this.currentOptions.target===e.target&&this.popupEl.classList.contains("p-confirmpopup-active")){this.close(!1);return}this.currentOptions=e,this.renderContent(e),this.alignToTarget(e.target),this.popupEl.classList.add("p-confirmpopup-active"),setTimeout(()=>{this.outsideClickListener&&document.removeEventListener("click",this.outsideClickListener),this.outsideClickListener=t=>{this.popupEl&&!this.popupEl.contains(t.target)&&!e.target.contains(t.target)&&this.close(!1)},document.addEventListener("click",this.outsideClickListener)},10)}}close(e=!1){this.popupEl&&(this.popupEl.classList.remove("p-confirmpopup-active"),this.outsideClickListener&&(document.removeEventListener("click",this.outsideClickListener),this.outsideClickListener=null),this.currentOptions&&(e&&this.currentOptions.accept?this.currentOptions.accept():!e&&this.currentOptions.reject&&this.currentOptions.reject()),this.currentOptions=null)}alignToTarget(e){if(!this.popupEl)return;let t=e.getBoundingClientRect(),r=this.popupEl.offsetWidth||280,o=this.popupEl.offsetHeight||140,p=window.innerHeight-t.bottom,m=t.top,b=p<o+16&&m>o+16,s=0;b?(s=t.top+window.scrollY-o-10,this.popupEl.classList.remove("p-confirmpopup-flipped-top"),this.popupEl.classList.add("p-confirmpopup-flipped-bottom")):(s=t.bottom+window.scrollY+10,this.popupEl.classList.remove("p-confirmpopup-flipped-bottom"),this.popupEl.classList.add("p-confirmpopup-flipped-top"));let n=t.left+window.scrollX,u=window.innerWidth-r-16;n>u&&(n=u),n<16&&(n=16);let g=t.left+window.scrollX+t.width/2,h=Math.max(16,Math.min(r-24,g-n-8));this.popupEl.style.top=`${s}px`,this.popupEl.style.left=`${n}px`,this.popupEl.style.setProperty("--p-popup-arrow-left",`${h}px`)}renderContent(e){if(this.popupEl){if(e.headless)this.popupEl.innerHTML=`
                <div class="p-confirmpopup-headless">
                    <span class="p-confirmpopup-message" style="display: block; font-size: 0.875rem;">${e.message||"Save your current process?"}</span>
                    <div style="display: flex; align-items: center; gap: 0.5rem; margin-top: 0.875rem;">
                        <button type="button" class="btn-accept p-button p-button-primary p-button-sm" style="padding: 0.35rem 0.85rem; font-size: 0.8125rem; font-weight: 600; border-radius: var(--p-border-radius); background: var(--p-surface-900); border: 1px solid var(--p-surface-900); color: #ffffff; cursor: pointer;">
                            ${e.acceptLabel||"Save"}
                        </button>
                        <button type="button" class="btn-reject p-button p-button-text p-button-secondary p-button-sm" style="padding: 0.35rem 0.75rem; font-size: 0.8125rem; font-weight: 500; border: none; background: transparent; color: var(--p-surface-700); cursor: pointer;">
                            ${e.rejectLabel||"Cancel"}
                        </button>
                    </div>
                </div>
            `;else if(e.template)this.popupEl.innerHTML=`
                <div class="p-confirmpopup-template-body">
                    <div class="p-confirmpopup-template-icon">
                        ${w}
                    </div>
                    <p class="p-confirmpopup-message" style="font-size: 0.875rem; color: var(--p-text-color);">${e.message||"Please confirm to proceed moving forward."}</p>
                </div>
                <div class="p-confirmpopup-footer">
                    <button type="button" class="btn-reject p-button p-button-outlined p-button-secondary p-button-sm" style="display: inline-flex; align-items: center; gap: 0.3rem; padding: 0.4rem 0.75rem; font-size: 0.8125rem; font-weight: 600; border-radius: var(--p-border-radius); border: 1px solid var(--p-border-color); background: transparent; color: var(--p-text-color); cursor: pointer;">
                        ${k}
                        <span>${e.rejectLabel||"Cancel"}</span>
                    </button>
                    <button type="button" class="btn-accept p-button p-button-primary p-button-sm" style="display: inline-flex; align-items: center; gap: 0.3rem; padding: 0.4rem 0.85rem; font-size: 0.8125rem; font-weight: 600; border-radius: var(--p-border-radius); background: var(--p-surface-900); border: 1px solid var(--p-surface-900); color: #ffffff; cursor: pointer;">
                        ${x}
                        <span>${e.acceptLabel||"Confirm"}</span>
                    </button>
                </div>
            `;else{let t=e.acceptSeverity==="danger"||e.acceptProps&&e.acceptProps.severity==="danger",r=t?y:v,o=e.acceptLabel||e.acceptProps?.label||(t?"Delete":"Save"),i=e.rejectLabel||e.rejectProps?.label||"Cancel",p=t?"background: #ef4444; border: 1px solid #ef4444; color: #ffffff;":"background: var(--p-surface-900); border: 1px solid var(--p-surface-900); color: #ffffff;";this.popupEl.innerHTML=`
                <div class="p-confirmpopup-content">
                    <span class="p-confirmpopup-icon ${t?"p-confirmpopup-icon-danger":""}">
                        ${r}
                    </span>
                    <span class="p-confirmpopup-message">${e.message||"Are you sure you want to proceed?"}</span>
                </div>
                <div class="p-confirmpopup-footer">
                    <button type="button" class="btn-reject p-button p-button-outlined p-button-secondary p-button-sm" style="padding: 0.35rem 0.75rem; font-size: 0.8125rem; font-weight: 600; border-radius: var(--p-border-radius); border: 1px solid var(--p-border-color); background: transparent; color: var(--p-text-color); cursor: pointer;">
                        ${i}
                    </button>
                    <button type="button" class="btn-accept p-button p-button-primary p-button-sm" style="padding: 0.35rem 0.85rem; font-size: 0.8125rem; font-weight: 600; border-radius: var(--p-border-radius); ${p} cursor: pointer;">
                        ${o}
                    </button>
                </div>
            `}this.popupEl.querySelector(".btn-reject")?.addEventListener("click",()=>this.close(!1)),this.popupEl.querySelector(".btn-accept")?.addEventListener("click",()=>this.close(!0))}}},a=new l;window.$confirmPopup=a;function L(d,e){c("confirm-popup",f),d.querySelectorAll("[data-confirmpopup-trigger]").forEach(r=>{r.addEventListener("click",o=>{o.preventDefault(),o.stopPropagation();let i=r.getAttribute("data-confirmpopup-trigger")||"basic",p=r.getAttribute("data-confirmpopup-message");i==="delete"?a.require({target:r,message:p||"Do you want to delete this record?",acceptSeverity:"danger",acceptLabel:"Delete",rejectLabel:"Cancel",accept:()=>window.$toast?.add({severity:"info",summary:"Confirmed",detail:"Record deleted",life:3e3}),reject:()=>window.$toast?.add({severity:"error",summary:"Rejected",detail:"You have rejected",life:3e3})}):i==="template"?a.require({target:r,message:p||"Please confirm to proceed moving forward.",template:!0,acceptLabel:"Confirm",rejectLabel:"Cancel",accept:()=>window.$toast?.add({severity:"info",summary:"Confirmed",detail:"You have accepted",life:3e3}),reject:()=>window.$toast?.add({severity:"error",summary:"Rejected",detail:"You have rejected",life:3e3})}):i==="headless"?a.require({target:r,message:p||"Save your current process?",headless:!0,acceptLabel:"Save",rejectLabel:"Cancel",accept:()=>window.$toast?.add({severity:"info",summary:"Confirmed",detail:"You have accepted",life:3e3}),reject:()=>window.$toast?.add({severity:"error",summary:"Rejected",detail:"You have rejected",life:3e3})}):a.require({target:r,message:p||"Are you sure you want to proceed?",acceptLabel:"Save",rejectLabel:"Cancel",accept:()=>window.$toast?.add({severity:"info",summary:"Confirmed",detail:"You have accepted",life:3e3}),reject:()=>window.$toast?.add({severity:"error",summary:"Rejected",detail:"You have rejected",life:3e3})})})})}export{L as default};
