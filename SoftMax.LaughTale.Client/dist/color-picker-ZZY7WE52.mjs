import{e as m}from"./chunk-3YU53HBK.mjs";var y=["#10b981","#059669","#3b82f6","#2563eb","#6366f1","#8b5cf6","#ec4899","#f43f5e","#ef4444","#f59e0b","#14b8a6","#06b6d4","#64748b","#1e293b","#000000"],x=`
[data-theme="dark"] .color-swatch-btn {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
[data-theme="dark"] .colorpicker-trigger-btn {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
[data-theme="dark"] .colorpicker-palette-overlay {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
[data-theme="dark"] .color-native-input {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
[data-theme="dark"] .color-hex-input {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
`;function k(t,o){m("color-picker",x);let r=o.value||"#10b981",l=!1,f=y.map(e=>`
        <button type="button" 
                class="color-swatch-btn" 
                data-color="${e}" 
                title="${e}"
                style="width: 1.75rem; height: 1.75rem; border-radius: 4px; border: ${e.toLowerCase()===r.toLowerCase()?"2px solid #ffffff":"1px solid rgba(0,0,0,0.15)"}; background: ${e}; cursor: pointer; box-shadow: ${e.toLowerCase()===r.toLowerCase()?"0 0 0 2px var(--p-primary-600)":"none"}; transition: transform 0.15s ease, box-shadow 0.15s ease;">
        </button>
    `).join("");t.innerHTML=`
        <div class="laughtale-colorpicker" style="position: relative; display: inline-flex; align-items: center; gap: 0.625rem; font-family: var(--p-font-family, inherit);">
            <!-- Color Swatch Trigger Button -->
            <button type="button" 
                    class="colorpicker-trigger-btn" 
                    ${o.disabled?"disabled":""} 
                    style="width: 2.25rem; height: 2.25rem; border-radius: var(--p-border-radius); border: 2px solid var(--p-surface-200); background: ${r}; cursor: ${o.disabled?"not-allowed":"pointer"}; box-shadow: var(--p-shadow-sm); transition: transform 0.15s ease, border-color 0.15s ease; padding: 0; outline: none;">
            </button>
            <span class="colorpicker-hex-label" style="font-family: monospace; font-size: 0.8125rem; font-weight: 600; color: var(--p-surface-800);">${r.toUpperCase()}</span>

            <!-- Palette Popover -->
            <div class="colorpicker-palette-overlay" style="display: none; position: absolute; top: calc(100% + 8px); left: 0; z-index: 600; background: var(--p-surface-0); border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius-lg); box-shadow: var(--p-shadow-lg); padding: 0.875rem; width: 220px; box-sizing: border-box;">
                <div style="font-size: 0.6875rem; font-weight: 700; color: var(--p-surface-500); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.625rem;">Palette Swatches</div>
                
                <!-- 5-Column Swatch Grid -->
                <div class="colorpicker-swatches-grid" style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 6px; margin-bottom: 0.875rem; justify-items: center;">
                    ${f}
                </div>

                <!-- Custom Hex & Native Spectrum Picker -->
                <div style="display: flex; align-items: center; gap: 0.5rem; width: 100%; box-sizing: border-box;">
                    <!-- Stylized Native Color Picker Button -->
                    <div style="position: relative; width: 2rem; height: 2rem; flex-shrink: 0; border-radius: var(--p-border-radius); border: 1px solid var(--p-border-color); overflow: hidden; background: ${r}; cursor: pointer;">
                        <input type="color" class="color-native-input" value="${r}" style="position: absolute; inset: -4px; width: 200%; height: 200%; opacity: 0; cursor: pointer; border: none; padding: 0;" />
                    </div>

                    <!-- Hex Text Input -->
                    <div style="flex: 1; min-width: 0; display: flex; align-items: center; border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius); background: var(--p-surface-50); padding: 0 0.5rem; box-sizing: border-box;">
                        <span style="font-size: 0.75rem; color: var(--p-surface-400); font-family: monospace; user-select: none;">#</span>
                        <input type="text" 
                               class="color-hex-input" 
                               value="${r.replace("#","")}" 
                               maxlength="6" 
                               placeholder="10b981"
                               style="width: 100%; min-width: 0; padding: 0.35rem 0.25rem; font-family: monospace; font-size: 0.8125rem; color: var(--p-text-color); border: none; outline: none; background: transparent; box-sizing: border-box;" />
                    </div>
                </div>
            </div>
        </div>
    `;let p=t.querySelector(".colorpicker-trigger-btn"),v=t.querySelector(".colorpicker-hex-label"),g=t.querySelector(".colorpicker-palette-overlay"),i=t.querySelector(".color-native-input"),n=t.querySelector(".color-hex-input"),h=i.parentElement;function s(e,d=!1){r=e.startsWith("#")?e:`#${e}`,p.style.backgroundColor=r,h.style.backgroundColor=r,v.textContent=r.toUpperCase(),i.value=r,d||(n.value=r.replace("#","")),t.querySelectorAll(".color-swatch-btn").forEach(a=>{let b=(a.getAttribute("data-color")||"").toLowerCase()===r.toLowerCase();a.style.border=b?"2px solid #ffffff":"1px solid rgba(0,0,0,0.15)",a.style.boxShadow=b?"0 0 0 2px var(--p-primary-600)":"none"}),u()}function c(e){l=e!==void 0?e:!l,g.style.display=l?"block":"none"}o.disabled||(p.addEventListener("click",e=>{e.stopPropagation(),c()}),t.querySelectorAll(".color-swatch-btn").forEach(e=>{e.addEventListener("click",d=>{d.stopPropagation();let a=e.getAttribute("data-color");s(a),c(!1)})}),i.addEventListener("input",()=>{s(i.value)}),n.addEventListener("input",()=>{let e=n.value.trim().replace("#","");(/^[0-9A-Fa-f]{6}$/.test(e)||/^[0-9A-Fa-f]{3}$/.test(e))&&s(`#${e}`,!0)}),document.addEventListener("click",e=>{t.contains(e.target)||c(!1)}));function u(){if(o.targetInputName){let e=t.querySelector(`input[name="${o.targetInputName}"]`);e||(e=document.createElement("input"),e.type="hidden",e.name=o.targetInputName,t.appendChild(e)),e.value=r}t.dispatchEvent(new CustomEvent("color:change",{bubbles:!0,detail:{value:r}}))}u()}export{k as default};
