import{a as T}from"./chunk-ZNSSSYBC.mjs";import{a as S}from"./chunk-ZALOY5NO.mjs";import{a as L}from"./chunk-6OO3425Y.mjs";import{b as c}from"./chunk-P6B5FGGY.mjs";import{e as x}from"./chunk-3YU53HBK.mjs";var H=`
[data-theme="dark"] .laughtale-multiselect {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
[data-theme="dark"] .multiselect-trigger {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
[data-theme="dark"] .p-input {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
[data-theme="dark"] .multiselect-label-container {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
[data-theme="dark"] .multiselect-clear-btn {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
[data-theme="dark"] .multiselect-chevron {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
[data-theme="dark"] .multiselect-overlay {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
[data-theme="dark"] .multiselect-filter-input {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
[data-theme="dark"] .multiselect-select-all {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
[data-theme="dark"] .multiselect-items-list {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
[data-theme="dark"] .chip-remove-btn {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
[data-theme="dark"] .multiselect-item {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
`;function I(l,o){x("multiselect",H);let p=o.options||[],r=new Set(o.selectedValues||[]),d="";l.innerHTML=`
        <div class="laughtale-multiselect" style="position: relative; width: 100%; max-width: 320px; font-family: var(--p-font-family, inherit);">
            <!-- Trigger Button Container -->
            <div class="multiselect-trigger p-input" style="display: flex; align-items: center; justify-content: space-between; min-height: 2.5rem; padding: 0.35rem 0.75rem; cursor: ${o.disabled?"not-allowed":"pointer"}; background: var(--p-surface-0); border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius); user-select: none;">
                <div class="multiselect-label-container" style="display: flex; align-items: center; gap: 0.35rem; flex-wrap: wrap; flex: 1; min-width: 0;"></div>
                <div style="display: flex; align-items: center; gap: 0.35rem; color: var(--p-surface-400);">
                    <span class="multiselect-clear-btn" style="display: none; cursor: pointer; padding: 2px;">${c.x}</span>
                    <span class="multiselect-chevron" style="display: flex; transition: transform 0.2s ease;">${c.chevronDown}</span>
                </div>
            </div>

            <!-- Popover Overlay -->
            <div class="multiselect-overlay" style="display: none; position: absolute; top: calc(100% + 4px); left: 0; right: 0; z-index: 500; background: var(--p-surface-0); border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius-lg); box-shadow: var(--p-shadow-lg); overflow: hidden;">
                <!-- Filter Search Box -->
                <div style="padding: 0.5rem; border-bottom: 1px solid var(--p-border-color); display: flex; align-items: center; gap: 0.5rem;">
                    <span style="color: var(--p-surface-400); display: flex;">${c.search}</span>
                    <input type="text" class="multiselect-filter-input" placeholder="Search..." style="flex: 1; border: none; outline: none; background: transparent; font-size: 0.8125rem; color: var(--p-text-color);" />
                </div>

                <!-- Select All Bar -->
                <div class="multiselect-select-all" style="display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 0.75rem; border-bottom: 1px solid var(--p-surface-100); background: var(--p-surface-50); cursor: pointer; font-size: 0.75rem; font-weight: 600; color: var(--p-surface-600);">
                    <input type="checkbox" class="select-all-chk" style="accent-color: var(--p-primary-600); cursor: pointer;" />
                    <span>Select All</span>
                </div>

                <!-- Items List -->
                <div class="multiselect-items-list" style="max-height: 200px; overflow-y: auto; padding: 0.25rem 0;"></div>
            </div>
        </div>
    `;let E=l.querySelector(".multiselect-trigger"),u=l.querySelector(".multiselect-label-container"),w=l.querySelector(".multiselect-overlay"),m=l.querySelector(".multiselect-filter-input"),g=l.querySelector(".select-all-chk"),v=l.querySelector(".multiselect-items-list"),f=l.querySelector(".multiselect-clear-btn"),y=l.querySelector(".multiselect-chevron"),b=T(w,{preset:"fade"}),h=L({defaultIsOpen:!1,onOpen:()=>{y.style.transform="rotate(180deg)",m.value="",d="",s(),b.enter(),m.focus()},onClose:()=>{y.style.transform="none",b.exit()}});S(l,()=>h.close());function k(){if(!d.trim())return p;let e=d.toLowerCase();return p.filter(t=>t.label.toLowerCase().includes(e))}function n(){if(r.size===0){u.innerHTML=`<span style="color: var(--p-surface-400); font-size: 0.875rem;">${o.placeholder||"Select items..."}</span>`,f.style.display="none";return}if(f.style.display="flex",o.display==="comma"){let e=p.filter(t=>r.has(t.value)).map(t=>t.label).join(", ");u.innerHTML=`<span style="font-size: 0.875rem; color: var(--p-text-color);">${e}</span>`}else{let e=p.filter(t=>r.has(t.value)).map(t=>`
                <span class="aura-tag tag-emerald" style="padding: 0.15rem 0.45rem; font-size: 0.75rem; display: inline-flex; align-items: center; gap: 0.25rem;">
                    ${t.label}
                    <span class="chip-remove-btn" data-val="${t.value}" style="cursor: pointer; display: flex; opacity: 0.7;">${c.x}</span>
                </span>
            `).join("");u.innerHTML=e,u.querySelectorAll(".chip-remove-btn").forEach(t=>{t.addEventListener("click",a=>{a.stopPropagation();let M=t.getAttribute("data-val");r.delete(M),n(),s(),i()})})}}function s(){let e=k();if(g.checked=e.length>0&&e.every(t=>r.has(t.value)),e.length===0){v.innerHTML='<div style="padding: 1rem; text-align: center; font-size: 0.75rem; color: var(--p-surface-400);">No options found</div>';return}v.innerHTML=e.map(t=>{let a=r.has(t.value);return`
                <div class="multiselect-item" data-val="${t.value}" style="display: flex; align-items: center; gap: 0.625rem; padding: 0.45rem 0.75rem; cursor: pointer; font-size: 0.8125rem; background: ${a?"var(--p-surface-50)":"transparent"}; color: var(--p-text-color);">
                    <input type="checkbox" ${a?"checked":""} style="accent-color: var(--p-primary-600); pointer-events: none;" />
                    <span style="flex: 1;">${t.label}</span>
                </div>
            `}).join(""),v.querySelectorAll(".multiselect-item").forEach(t=>{t.addEventListener("click",()=>{let a=t.getAttribute("data-val");r.has(a)?r.delete(a):r.add(a),n(),s(),i()})})}E.addEventListener("click",()=>{o.disabled||h.toggle()}),f.addEventListener("click",e=>{e.stopPropagation(),r.clear(),n(),s(),i()}),g.parentElement?.addEventListener("click",()=>{let e=k();e.every(a=>r.has(a.value))?e.forEach(a=>r.delete(a.value)):e.forEach(a=>r.add(a.value)),n(),s(),i()}),m.addEventListener("input",()=>{d=m.value,s()});function i(){if(o.targetInputName){let e=l.querySelector(`input[name="${o.targetInputName}"]`);e||(e=document.createElement("input"),e.type="hidden",e.name=o.targetInputName,l.appendChild(e)),e.value=JSON.stringify(Array.from(r))}l.dispatchEvent(new CustomEvent("multiselect:change",{bubbles:!0,detail:{value:Array.from(r)}}))}n(),i()}export{I as default};
