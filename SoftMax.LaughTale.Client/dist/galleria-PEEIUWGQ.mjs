import{b as n}from"./chunk-P6B5FGGY.mjs";import{e as c}from"./chunk-3YU53HBK.mjs";var d=`
[data-theme="dark"] .laughtale-galleria {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
[data-theme="dark"] .galleria-prev-btn {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
[data-theme="dark"] .galleria-next-btn {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
[data-theme="dark"] .galleria-thumb {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
`;function m(a,l){c("galleria",d);let r=l.value&&l.value.length>0?l.value:[{itemImageSrc:"https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&auto=format&fit=crop&q=80",thumbnailImageSrc:"https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=120&auto=format&fit=crop&q=80",alt:"Aurora Spectrum Wave",title:"Telemetry Cluster Spectrum"},{itemImageSrc:"https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=80",thumbnailImageSrc:"https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=120&auto=format&fit=crop&q=80",alt:"Zero-Trust Shield Gateway",title:"HSM Cryptographic Core"},{itemImageSrc:"https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80",thumbnailImageSrc:"https://images.unsplash.com/photo-1518770660439-4636190af475?w=120&auto=format&fit=crop&q=80",alt:"Kernel Micro-Architecture",title:"High-Performance Engine"}],t=0;function o(){let e=r[t];a.innerHTML=`
            <div class="laughtale-galleria" style="width: 100%; max-width: 640px; border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius-lg); overflow: hidden; background: var(--p-surface-0); font-family: var(--p-font-family, inherit);">
                <!-- Main Image Stage -->
                <div style="position: relative; width: 100%; height: 320px; background: #020617; overflow: hidden; display: flex; align-items: center; justify-content: center;">
                    <img src="${e.itemImageSrc}" alt="${e.alt}" style="width: 100%; height: 100%; object-fit: cover; transition: opacity 0.25s ease;" />
                    
                    <!-- Prev / Next Nav Buttons -->
                    <button type="button" class="galleria-prev-btn" style="position: absolute; left: 0.75rem; top: 50%; transform: translateY(-50%); width: 2.25rem; height: 2.25rem; border-radius: 9999px; background: rgba(0,0,0,0.5); color: #ffffff; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center;">
                        <span style="transform: rotate(90deg); display: flex;">${n.chevronDown}</span>
                    </button>
                    <button type="button" class="galleria-next-btn" style="position: absolute; right: 0.75rem; top: 50%; transform: translateY(-50%); width: 2.25rem; height: 2.25rem; border-radius: 9999px; background: rgba(0,0,0,0.5); color: #ffffff; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center;">
                        <span style="transform: rotate(-90deg); display: flex;">${n.chevronDown}</span>
                    </button>

                    <!-- Caption Bar -->
                    <div style="position: absolute; bottom: 0; left: 0; right: 0; background: linear-gradient(transparent, rgba(0,0,0,0.8)); padding: 1rem; color: #ffffff;">
                        <div style="font-size: 0.875rem; font-weight: 700;">${e.title||e.alt}</div>
                    </div>
                </div>

                <!-- Thumbnail Strip -->
                <div style="display: flex; gap: 0.5rem; padding: 0.75rem; background: var(--p-surface-50); overflow-x: auto;">
                    ${r.map((s,i)=>`
                        <div class="galleria-thumb ${i===t?"active":""}" data-index="${i}" style="flex: 0 0 72px; height: 48px; border-radius: 4px; overflow: hidden; border: ${i===t?"2px solid var(--p-primary-600)":"2px solid transparent"}; cursor: pointer; opacity: ${i===t?"1":"0.6"}; transition: all 0.15s ease;">
                            <img src="${s.thumbnailImageSrc}" alt="${s.alt}" style="width: 100%; height: 100%; object-fit: cover;" />
                        </div>
                    `).join("")}
                </div>
            </div>
        `,p()}function p(){a.querySelector(".galleria-prev-btn")?.addEventListener("click",()=>{t=(t-1+r.length)%r.length,o()}),a.querySelector(".galleria-next-btn")?.addEventListener("click",()=>{t=(t+1)%r.length,o()}),a.querySelectorAll(".galleria-thumb").forEach(e=>{e.addEventListener("click",()=>{t=Number(e.getAttribute("data-index")),o()})})}o()}export{m as default};
