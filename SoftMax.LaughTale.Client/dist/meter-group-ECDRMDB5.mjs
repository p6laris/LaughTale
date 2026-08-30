import{e as l}from"./chunk-3YU53HBK.mjs";var n=`
[data-theme="dark"] .laughtale-meter-group {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
`;function d(o,r){l("meter-group",n);let t=r.values.reduce((e,a)=>e+a.value,0),i=r.values.map(e=>`
            <div style="height: 100%; width: ${t>0?e.value/t*100:0}%; background: ${e.color}; transition: width 0.4s ease;" title="${e.label}: ${e.value}%"></div>
        `).join(""),s=r.values.map(e=>`
        <div style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.75rem;">
            <div style="width: 0.625rem; height: 0.625rem; border-radius: 50%; background: ${e.color}; flex-shrink: 0;"></div>
            <span style="color: var(--p-surface-600);">${e.label}</span>
            <span style="font-weight: 700; color: var(--p-surface-900); font-family: var(--p-font-mono);">${e.value}%</span>
        </div>
    `).join("");o.innerHTML=`
        <div class="laughtale-metergroup" style="display: flex; flex-direction: column; gap: 0.75rem; width: 100%;">
            ${r.title?`<div style="font-size: 0.875rem; font-weight: 700; color: var(--p-surface-900);">${r.title}</div>`:""}
            
            <!-- Meter Track -->
            <div style="display: flex; height: 0.75rem; border-radius: 9999px; overflow: hidden; background: var(--p-surface-100); border: 1px solid var(--p-border-color); gap: 2px;">
                ${i}
            </div>

            <!-- Legend List -->
            ${r.showLabels!==!1?`
                <div style="display: flex; flex-wrap: wrap; gap: 1.25rem; margin-top: 0.25rem;">
                    ${s}
                </div>
            `:""}
        </div>
    `}export{d as default};
