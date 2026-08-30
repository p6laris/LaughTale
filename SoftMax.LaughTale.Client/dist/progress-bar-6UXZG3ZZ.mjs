import{e as o}from"./chunk-3YU53HBK.mjs";var n=`
[data-theme="dark"] .laughtale-progress-bar {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
`;function d(t,e){o("progress-bar",n);let s=e.mode==="indeterminate"||e.value===void 0,i=Math.max(0,Math.min(100,e.value||0)),r=e.height||"0.75rem",a=e.color||"var(--p-primary-600)";s?t.innerHTML=`
            <div class="laughtale-progress-bar" style="position: relative; height: ${r}; width: 100%; border-radius: 9999px; overflow: hidden; background: var(--p-surface-100);">
                <div style="position: absolute; height: 100%; width: 40%; background: ${a}; border-radius: 9999px; animation: indeterminateProgress 1.5s infinite linear;"></div>
            </div>
            <style>
                @@keyframes indeterminateProgress {
                    0% { left: -40%; width: 40%; }
                    50% { left: 40%; width: 60%; }
                    100% { left: 100%; width: 40%; }
                }
            </style>
        `:t.innerHTML=`
            <div class="laughtale-progress-bar" style="position: relative; height: ${r}; width: 100%; border-radius: 9999px; overflow: hidden; background: var(--p-surface-100); display: flex; align-items: center;">
                <div style="height: 100%; width: ${i}%; background: ${a}; border-radius: 9999px; transition: width 0.4s cubic-bezier(0.16, 1, 0.3, 1);"></div>
                ${e.showValue!==!1&&r>="1rem"?`
                    <span style="position: absolute; width: 100%; text-align: center; font-size: 0.6875rem; font-weight: 700; color: #ffffff; text-shadow: 0 1px 2px rgba(0,0,0,0.5); font-family: var(--p-font-mono);">
                        ${i}%
                    </span>
                `:""}
            </div>
        `}export{d as default};
