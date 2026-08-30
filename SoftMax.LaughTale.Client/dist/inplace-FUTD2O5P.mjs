import{b as i}from"./chunk-P6B5FGGY.mjs";import{e as o}from"./chunk-3YU53HBK.mjs";var p=`
[data-theme="dark"] .laughtale-inplace-display {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
[data-theme="dark"] .laughtale-inplace-editor {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
[data-theme="dark"] .inplace-input {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
[data-theme="dark"] .btn-inplace-save {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
[data-theme="dark"] .btn-inplace-cancel {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
`;function s(r,a){o("inplace",p);let n=!1,t=a.value||"";function l(){if(!n)r.innerHTML=`
                <div class="laughtale-inplace-display" style="display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.35rem 0.6rem; border-radius: var(--p-border-radius); border: 1px dashed var(--p-border-color); background: var(--p-surface-50); cursor: ${a.disabled?"default":"pointer"}; transition: background 0.15s ease;">
                    <span style="font-size: 0.875rem; color: ${t?"var(--p-surface-900)":"var(--p-surface-400)"}; font-weight: 500;">
                        ${t||a.placeholder||"Click to edit..."}
                    </span>
                    ${a.disabled?"":`<span style="color: var(--p-surface-400); display: flex; align-items: center;">${i.edit}</span>`}
                </div>
            `,a.disabled||r.querySelector(".laughtale-inplace-display")?.addEventListener("click",()=>{n=!0,l()});else{r.innerHTML=`
                <div class="laughtale-inplace-editor" style="display: inline-flex; align-items: center; gap: 0.35rem;">
                    <input type="text" 
                           class="inplace-input" 
                           value="${t}" 
                           placeholder="${a.placeholder||""}" 
                           style="padding: 0.35rem 0.6rem; border: 1px solid var(--p-primary-600); border-radius: var(--p-border-radius); font-size: 0.875rem; outline: none;" />
                    <button type="button" class="btn-inplace-save p-button p-button-primary" style="padding: 0.35rem 0.5rem; display: flex; align-items: center;">
                        ${i.check}
                    </button>
                    <button type="button" class="btn-inplace-cancel p-button p-button-secondary" style="padding: 0.35rem 0.5rem; display: flex; align-items: center;">
                        ${i.x}
                    </button>
                </div>
            `;let e=r.querySelector(".inplace-input");e.focus(),e.setSelectionRange(t.length,t.length),r.querySelector(".btn-inplace-save")?.addEventListener("click",()=>{t=e.value.trim(),n=!1,l(),c()}),r.querySelector(".btn-inplace-cancel")?.addEventListener("click",()=>{n=!1,l()}),e.addEventListener("keydown",d=>{d.key==="Enter"?(t=e.value.trim(),n=!1,l(),c()):d.key==="Escape"&&(n=!1,l())})}}function c(){if(a.targetInputName){let e=document.querySelector(`input[name="${a.targetInputName}"]`);e||(e=document.createElement("input"),e.type="hidden",e.name=a.targetInputName,r.appendChild(e)),e.value=t}r.dispatchEvent(new CustomEvent("inplace:change",{bubbles:!0,detail:{value:t}}))}l(),c()}export{s as default};
