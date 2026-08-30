import{e as l}from"./chunk-3YU53HBK.mjs";var d=`
[data-theme="dark"] .dropzone-box {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
[data-theme="dark"] .file-input {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
`;function p(o,a){l("dropzone",d),o.innerHTML=`
        <div style="display: flex; flex-direction: column; gap: 0.75rem;">
            <div style="display: flex; align-items: center; justify-content: space-between;">
                <span style="font-size: 0.8125rem; font-weight: 600; color: var(--p-surface-600);">Document Vault</span>
                <span class="aura-tag tag-cyan">Hydrate: Visible</span>
            </div>

            <div class="dropzone-box" style="border: 2px dashed var(--p-border-color); border-radius: var(--p-border-radius-lg); padding: 2rem 1.5rem; text-align: center; cursor: pointer; transition: all 0.2s ease; background-color: var(--p-surface-50);">
                <input type="file" class="file-input" name="${a.targetInputName}" accept="${a.allowedExtensions}" style="display: none;" />
                
                <div style="width: 2.75rem; height: 2.75rem; border-radius: 50%; background: var(--p-surface-100); display: flex; align-items: center; justify-content: center; margin: 0 auto 0.75rem; font-size: 1.25rem;">
                    \u2601\uFE0F
                </div>
                
                <div style="font-size: 0.875rem; font-weight: 600; color: var(--p-surface-800);">${a.dropPrompt}</div>
                <div style="font-size: 0.75rem; color: var(--p-surface-500); margin-top: 0.25rem;">
                    Supported: ${a.allowedExtensions} &bull; Max Size: ${a.maxSizeMb} MB
                </div>

                <div class="preview-area" style="display: none; margin-top: 1rem;"></div>
            </div>
        </div>
    `;let e=o.querySelector(".dropzone-box"),t=o.querySelector(".file-input"),i=o.querySelector(".preview-area");e.addEventListener("click",()=>t.click()),e.addEventListener("dragover",r=>{r.preventDefault(),e.style.borderColor="var(--p-primary-500)",e.style.backgroundColor="var(--p-primary-50)"}),e.addEventListener("dragleave",()=>{e.style.borderColor="var(--p-border-color)",e.style.backgroundColor="var(--p-surface-50)"}),e.addEventListener("drop",r=>{r.preventDefault(),e.style.borderColor="var(--p-border-color)",e.style.backgroundColor="var(--p-surface-50)",r.dataTransfer?.files.length&&(t.files=r.dataTransfer.files,n(t.files[0]))}),t.addEventListener("change",()=>{t.files?.length&&n(t.files[0])});function n(r){let s=r.size/1048576;if(s>a.maxSizeMb){alert(`File exceeds size limit of ${a.maxSizeMb} MB.`),t.value="";return}i.style.display="block",i.innerHTML=`
            <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.5rem 0.75rem; background: var(--p-primary-50); border: 1px solid var(--p-primary-200); border-radius: var(--p-border-radius); font-size: 0.8125rem; color: var(--p-primary-700);">
                <div style="display: flex; align-items: center; gap: 0.5rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                    <span>\u{1F4C4}</span>
                    <strong style="overflow: hidden; text-overflow: ellipsis;">${r.name}</strong>
                    <span style="font-size: 0.75rem; opacity: 0.8;">(${s.toFixed(2)} MB)</span>
                </div>
                <span class="aura-tag tag-emerald" style="font-size: 0.6875rem;">Verified</span>
            </div>
        `}}export{p as default};
