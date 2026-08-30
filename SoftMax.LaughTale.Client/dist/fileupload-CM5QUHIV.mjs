import{e as $}from"./chunk-3YU53HBK.mjs";var T=`
.p-fileupload {
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    width: 100%;
}

/* Basic Mode */
.p-fileupload-basic {
    display: inline-flex;
    align-items: center;
    gap: 0.75rem;
    flex-wrap: wrap;
}

.p-fileupload-choose {
    position: relative;
    overflow: hidden;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    padding: 0.5rem 1.15rem;
    font-size: 0.875rem;
    font-weight: 600;
    border-radius: var(--p-border-radius, 6px);
    background: var(--p-surface-900, #0f172a);
    border: 1px solid var(--p-surface-900, #0f172a);
    color: #ffffff;
    transition: background-color 0.15s ease, border-color 0.15s ease;
    gap: 0.45rem;
    user-select: none;
}

.p-fileupload-choose:hover {
    background: var(--p-surface-800, #1e293b);
    border-color: var(--p-surface-800, #1e293b);
}

.p-fileupload-choose.p-button-secondary {
    background: var(--p-surface-100, #f1f5f9);
    border: 1px solid var(--p-border-color, #e2e8f0);
    color: var(--p-surface-800, #1e293b);
}

.p-fileupload-choose.p-button-secondary:hover {
    background: var(--p-surface-200, #e2e8f0);
}

.p-fileupload-choose input[type="file"] {
    position: absolute;
    top: 0;
    right: 0;
    margin: 0;
    opacity: 0;
    min-height: 100%;
    min-width: 100%;
    font-size: 100px;
    text-align: right;
    cursor: pointer;
    z-index: 1;
}

.p-fileupload-filename {
    font-size: 0.875rem;
    color: var(--p-text-muted, #64748b);
    max-width: 16rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

/* Advanced Mode Container */
.p-fileupload-advanced {
    border: 1px solid var(--p-border-color, #e2e8f0);
    border-radius: var(--p-border-radius, 8px);
    background: var(--p-surface-0, #ffffff);
    overflow: hidden;
    width: 100%;
    box-sizing: border-box;
}

.p-fileupload-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
    background: var(--p-surface-50, #f8fafc);
    border-bottom: 1px solid var(--p-border-color, #e2e8f0);
    flex-wrap: wrap;
}

.p-fileupload-content {
    padding: 1.25rem;
    min-height: 9rem;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: center;
    transition: background-color 0.2s ease, border-color 0.2s ease;
}

.p-fileupload-content.p-fileupload-highlight {
    background: rgba(59, 130, 246, 0.04);
    outline: 2px dashed var(--p-primary-500, #3b82f6);
    outline-offset: -4px;
}

/* Empty Dropzone State */
.p-fileupload-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 2.25rem 1.5rem;
    color: var(--p-surface-500, #64748b);
    text-align: center;
    border: 2px dashed var(--p-border-color, #e2e8f0);
    border-radius: var(--p-border-radius, 8px);
    background: var(--p-surface-50, #f8fafc);
    cursor: pointer;
    transition: border-color 0.2s ease, background 0.2s ease;
    width: 100%;
    box-sizing: border-box;
}

.p-fileupload-empty:hover {
    border-color: var(--p-primary-500, #3b82f6);
    background: var(--p-surface-0, #ffffff);
}

.p-fileupload-empty-icon {
    width: 3rem;
    height: 3rem;
    border-radius: 9999px;
    background: var(--p-surface-100, #f1f5f9);
    border: 1px solid var(--p-border-color, #e2e8f0);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--p-surface-600, #475569);
    margin-bottom: 0.25rem;
}

.p-fileupload-empty-title {
    font-weight: 600;
    font-size: 0.95rem;
    color: var(--p-text-color, #0f172a);
}

.p-fileupload-empty-subtitle {
    font-size: 0.75rem;
    color: var(--p-text-muted, #64748b);
    font-weight: 500;
}

/* File Queue List */
.p-fileupload-file-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    width: 100%;
}

.p-fileupload-file-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.75rem 1rem;
    border: 1px solid var(--p-border-color, #e2e8f0);
    border-radius: var(--p-border-radius, 8px);
    background: var(--p-surface-0, #ffffff);
    gap: 1rem;
}

.p-fileupload-file-info {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex: 1;
    min-width: 0;
}

.p-fileupload-thumbnail {
    width: 3rem;
    height: 3rem;
    border-radius: 6px;
    object-fit: cover;
    background: var(--p-surface-100, #f1f5f9);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    border: 1px solid var(--p-border-color, #e2e8f0);
}

.p-fileupload-file-details {
    display: flex;
    flex-direction: column;
    min-width: 0;
}

.p-fileupload-file-name {
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--p-text-color, #0f172a);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.p-fileupload-file-size {
    font-size: 0.75rem;
    color: var(--p-text-muted, #64748b);
}

.p-fileupload-badge {
    font-size: 0.75rem;
    font-weight: 600;
    padding: 0.2rem 0.55rem;
    border-radius: 6px;
    line-height: 1.2;
}

.p-fileupload-badge-pending {
    background: rgba(249, 115, 22, 0.12);
    color: #ea580c;
}

.p-fileupload-badge-completed {
    background: rgba(16, 185, 129, 0.12);
    color: #10b981;
}

.p-fileupload-badge-uploading {
    background: rgba(59, 130, 246, 0.12);
    color: #2563eb;
}

.p-fileupload-progressbar {
    height: 0.35rem;
    background: var(--p-surface-200, #e2e8f0);
    border-radius: 9999px;
    overflow: hidden;
    margin: 0.5rem 1rem;
    position: relative;
}

.p-fileupload-progressbar-value {
    height: 100%;
    background: var(--p-primary-500, #3b82f6);
    border-radius: 9999px;
    transition: width 0.25s ease;
}

/* Image Grid Preview */
.p-fileupload-image-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(7.5rem, 1fr));
    gap: 1rem;
    width: 100%;
    box-sizing: border-box;
}

.p-fileupload-image-card {
    position: relative;
    aspect-ratio: 1;
    border-radius: var(--p-border-radius, 8px);
    overflow: hidden;
    border: 1px solid var(--p-border-color, #e2e8f0);
    background: var(--p-surface-100, #f1f5f9);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.p-fileupload-image-card img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.p-fileupload-image-card .p-fileupload-image-remove {
    position: absolute;
    top: 0.4rem;
    right: 0.4rem;
    width: 1.6rem;
    height: 1.6rem;
    border-radius: 9999px;
    background: rgba(15, 23, 42, 0.8);
    color: #ffffff;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.15s ease;
}

.p-fileupload-image-card:hover .p-fileupload-image-remove {
    opacity: 1;
}

/* Single Big Preview Image for Custom Demo */
.p-fileupload-custom-preview {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 1.25rem;
}

.p-fileupload-custom-preview img {
    max-width: 18rem;
    max-height: 22rem;
    border-radius: 8px;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1);
    border: 1px solid var(--p-border-color, #e2e8f0);
}

/* Dark Mode Tokens */
.dark .p-fileupload-advanced,
[data-theme="dark"] .p-fileupload-advanced {
    background: var(--p-surface-900, #0f172a);
    border-color: var(--p-surface-700, #334155);
}

.dark .p-fileupload-header,
[data-theme="dark"] .p-fileupload-header {
    background: var(--p-surface-800, #1e293b);
    border-color: var(--p-surface-700, #334155);
}

.dark .p-fileupload-empty,
[data-theme="dark"] .p-fileupload-empty {
    background: var(--p-surface-800, #1e293b);
    border-color: var(--p-surface-700, #334155);
    color: var(--p-surface-400, #94a3b8);
}

.dark .p-fileupload-empty-icon,
[data-theme="dark"] .p-fileupload-empty-icon {
    background: var(--p-surface-700, #334155);
    color: var(--p-surface-200, #e2e8f0);
    border-color: var(--p-surface-600, #475569);
}

.dark .p-fileupload-empty-title,
[data-theme="dark"] .p-fileupload-empty-title {
    color: var(--p-surface-0, #f8fafc);
}

.dark .p-fileupload-file-item,
[data-theme="dark"] .p-fileupload-file-item {
    background: var(--p-surface-800, #1e293b);
    border-color: var(--p-surface-700, #334155);
}

.dark .p-fileupload-file-name,
[data-theme="dark"] .p-fileupload-file-name {
    color: var(--p-surface-0, #f8fafc);
}

.dark .p-fileupload-thumbnail,
[data-theme="dark"] .p-fileupload-thumbnail {
    background: var(--p-surface-800, #1e293b);
    border-color: var(--p-surface-700, #334155);
}

.dark .p-fileupload-image-card,
[data-theme="dark"] .p-fileupload-image-card {
    background: var(--p-surface-800, #1e293b);
    border-color: var(--p-surface-700, #334155);
}
`;function H(l,i){$("fileupload",T);let m=i.mode||"basic",c=i.accept||"*/*",v=i.multiple||!1,w=i.auto||!1,f=i.chooseLabel||"Choose",y=i.uploadLabel||"Upload",z=i.cancelLabel||"Cancel",M=i.previewImages||!1,F=i.emptyTitle||"Drag and drop files to here to upload.",E=i.emptySubtitle||"MAX. 1MB",r=[],s=!1;i.initialFile?r.push({id:"init-1",name:i.initialFile.name,size:i.initialFile.size,type:"image/jpeg",previewUrl:i.initialFile.previewUrl,progress:i.initialFile.status==="completed"?100:0,status:i.initialFile.status||"pending"}):i.initialImages&&i.initialImages.length>0&&i.initialImages.forEach(o=>{r.push({id:o.id,name:o.name,size:245e3,type:"image/jpeg",previewUrl:o.previewUrl,progress:0,status:"pending"})});function k(o){if(o===0)return"0 B";let a=1024,n=["B","KB","MB","GB"],h=Math.floor(Math.log(o)/Math.log(a));return parseFloat((o/Math.pow(a,h)).toFixed(1))+" "+n[h]}function g(o){Array.from(o).forEach(a=>{if(i.maxFileSize&&a.size>i.maxFileSize){alert(`File "${a.name}" exceeds maximum allowed size of ${k(i.maxFileSize)}`);return}let n={id:Math.random().toString(36).substring(2,9),name:a.name,size:a.size,type:a.type,progress:0,status:"pending"};a.type.startsWith("image/")&&(n.previewUrl=URL.createObjectURL(a)),r.push(n)}),w?(p(),b()):p()}function b(){if(r.length===0||s)return;s=!0,p();let o=0,a=setInterval(()=>{o+=20,o>=100?(o=100,clearInterval(a),s=!1,r.forEach(n=>{n.progress=100,n.status="completed"}),p()):(r.forEach(n=>{n.progress=o,n.status="uploading"}),p())},100)}function j(){r=[],s=!1,p()}function B(o){r=r.filter(a=>a.id!==o),p()}function p(){if(m==="custom"){let t=r.length>0?r[0]:null;l.innerHTML=`
                <div class="p-fileupload p-fileupload-custom" style="display: flex; flex-direction: column; align-items: center; width: 100%;">
                    <span class="p-fileupload-choose">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
                        <span>${f}</span>
                        <input type="file" accept="${c}" class="p-fileupload-input" />
                    </span>

                    ${t?`
                        <div class="p-fileupload-custom-preview">
                            <img src="${t.previewUrl||"https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=400&auto=format&fit=crop&q=80"}" alt="${t.name}" />
                            <div style="font-size: 0.8125rem; font-weight: 600; color: var(--p-text-muted); margin-top: 0.5rem;">${t.name}</div>
                        </div>
                    `:""}
                </div>
            `,l.querySelector(".p-fileupload-input")?.addEventListener("change",L=>{let u=L.target;u.files&&u.files.length>0&&(r=[],g(u.files))});return}if(m==="basic"){let e=r.length>0,t=e?r.length===1?r[0].name:`${r.length} files selected`:"No file chosen";w?l.innerHTML=`
                    <div class="p-fileupload p-fileupload-basic" style="justify-content: center; width: 100%;">
                        <span class="p-fileupload-choose">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
                            <span>${f}</span>
                            <input type="file" accept="${c}" ${v?"multiple":""} class="p-fileupload-input" />
                        </span>
                        ${e?`<span class="p-fileupload-filename">${t}</span>`:""}
                    </div>
                `:l.innerHTML=`
                    <div class="p-fileupload p-fileupload-basic" style="justify-content: center; width: 100%;">
                        <span class="p-fileupload-choose">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
                            <span>${f}</span>
                            <input type="file" accept="${c}" ${v?"multiple":""} class="p-fileupload-input" />
                        </span>
                        <span class="p-fileupload-filename" style="margin-left: 0.5rem; margin-right: 0.5rem;">${t}</span>
                        <button type="button" class="p-button p-button-outlined p-button-secondary p-fileupload-upload-btn" ${!e||s?'disabled style="opacity:0.5; pointer-events:none; cursor:not-allowed;"':""} style="padding: 0.5rem 1.15rem; font-size: 0.875rem; font-weight: 600; border-radius: var(--p-border-radius); border: 1px solid var(--p-border-color); background: var(--p-surface-0); color: var(--p-text-color); cursor: pointer;">
                            ${y}
                        </button>
                    </div>
                `,l.querySelector(".p-fileupload-input")?.addEventListener("change",u=>{let x=u.target;x.files&&x.files.length>0&&g(x.files)}),l.querySelector(".p-fileupload-upload-btn")?.addEventListener("click",()=>{b()});return}let o=r.length>0,a=o?Math.round(r.reduce((e,t)=>e+t.progress,0)/r.length):0;l.innerHTML=`
            <div class="p-fileupload p-fileupload-advanced">
                <!-- Toolbar Header -->
                <div class="p-fileupload-header">
                    <span class="p-fileupload-choose" style="padding: 0.5rem 1.15rem;">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" x2="12" y1="5" y2="19"/><line x1="5" x2="19" y1="12" y2="12"/></svg>
                        <span>${f}</span>
                        <input type="file" accept="${c}" ${v?"multiple":""} class="p-fileupload-input" />
                    </span>
                    <button type="button" class="p-button p-button-outlined p-button-secondary p-fileupload-upload-btn" ${!o||s?'disabled style="opacity:0.5; pointer-events:none; cursor:not-allowed;"':""} style="padding: 0.5rem 1.15rem; font-size: 0.875rem; font-weight: 600; border-radius: var(--p-border-radius); border: 1px solid var(--p-border-color); background: var(--p-surface-0); color: var(--p-text-color); cursor: pointer; display: inline-flex; align-items: center; gap: 0.45rem;">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
                        <span>${y}</span>
                    </button>
                    <button type="button" class="p-button p-button-outlined p-button-secondary p-fileupload-cancel-btn" ${!o||s?'disabled style="opacity:0.5; pointer-events:none; cursor:not-allowed;"':""} style="padding: 0.5rem 1.15rem; font-size: 0.875rem; font-weight: 600; border-radius: var(--p-border-radius); border: 1px solid var(--p-border-color); background: var(--p-surface-0); color: var(--p-text-color); cursor: pointer; display: inline-flex; align-items: center; gap: 0.45rem;">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                        <span>${z}</span>
                    </button>
                </div>

                ${s?`
                    <div class="p-fileupload-progressbar">
                        <div class="p-fileupload-progressbar-value" style="width: ${a}%;"></div>
                    </div>
                `:""}

                <!-- Content / Drop Area -->
                <div class="p-fileupload-content">
                    ${o?M?`
                        <div class="p-fileupload-image-grid">
                            ${r.map(e=>`
                                <div class="p-fileupload-image-card">
                                    <img src="${e.previewUrl||"https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=200&auto=format&fit=crop&q=80"}" alt="${e.name}" />
                                    <button type="button" class="p-fileupload-image-remove" data-remove-id="${e.id}" title="Remove image">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                                    </button>
                                </div>
                            `).join("")}
                        </div>
                    `:`
                        <div class="p-fileupload-file-list">
                            ${r.map(e=>`
                                <div class="p-fileupload-file-item">
                                    <div class="p-fileupload-file-info">
                                        ${e.previewUrl?`
                                            <img src="${e.previewUrl}" alt="${e.name}" class="p-fileupload-thumbnail" />
                                        `:`
                                            <div class="p-fileupload-thumbnail">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--p-surface-500);"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
                                            </div>
                                        `}
                                        <div class="p-fileupload-file-details">
                                            <span class="p-fileupload-file-name">${e.name}</span>
                                            <span class="p-fileupload-file-size">${k(e.size)}</span>
                                        </div>
                                    </div>
                                    <div style="display: flex; align-items: center; gap: 0.75rem;">
                                        <span class="p-fileupload-badge p-fileupload-badge-${e.status==="completed"?"completed":e.status==="uploading"?"uploading":"pending"}">
                                            ${e.status==="completed"?"Uploaded":e.status==="uploading"?`${e.progress}%`:"Pending"}
                                        </span>
                                        <button type="button" class="p-button p-button-text p-button-danger p-button-sm" data-remove-id="${e.id}" style="border: none; background: transparent; color: #ef4444; cursor: pointer; padding: 0.35rem; display: flex; align-items: center; border-radius: 9999px;">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                                        </button>
                                    </div>
                                </div>
                            `).join("")}
                        </div>
                    `:`
                        <div class="p-fileupload-empty" data-click-trigger>
                            <div class="p-fileupload-empty-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/><polyline points="12 13 12 9 10 11"/><polyline points="12 9 14 11"/></svg>
                            </div>
                            <div class="p-fileupload-empty-title">${F}</div>
                            <div class="p-fileupload-empty-subtitle">${E}</div>
                        </div>
                    `}
                </div>
            </div>
        `;let n=l.querySelector(".p-fileupload-input");n?.addEventListener("change",e=>{let t=e.target;t.files&&t.files.length>0&&g(t.files)}),l.querySelector(".p-fileupload-upload-btn")?.addEventListener("click",()=>{b()}),l.querySelector(".p-fileupload-cancel-btn")?.addEventListener("click",()=>{j()}),l.querySelector("[data-click-trigger]")?.addEventListener("click",()=>{n?.click()});let d=l.querySelector(".p-fileupload-content");d&&(d.addEventListener("dragover",e=>{e.preventDefault(),d.classList.add("p-fileupload-highlight")}),d.addEventListener("dragleave",()=>{d.classList.remove("p-fileupload-highlight")}),d.addEventListener("drop",e=>{e.preventDefault(),d.classList.remove("p-fileupload-highlight"),e.dataTransfer?.files&&e.dataTransfer.files.length>0&&g(e.dataTransfer.files)})),l.querySelectorAll("[data-remove-id]").forEach(e=>{e.addEventListener("click",()=>{let t=e.getAttribute("data-remove-id");t&&B(t)})})}p()}export{H as default};
