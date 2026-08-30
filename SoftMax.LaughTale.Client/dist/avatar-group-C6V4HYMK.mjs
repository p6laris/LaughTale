import{e as s}from"./chunk-3YU53HBK.mjs";var m=`
[data-theme="dark"] .laughtale-avatar-group {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
`;function d(o,e){s("avatar-group",m);let t=e.max||4,l=e.avatars.slice(0,t),i=e.avatars.length-t,r=e.size==="sm"?"1.75rem":e.size==="lg"?"2.75rem":"2.25rem",n=e.size==="sm"?"0.6875rem":e.size==="lg"?"0.9375rem":"0.75rem",f=l.map(a=>{let c=a.bg||"var(--p-surface-800)";return`
            <div class="avatar-circle" title="${a.name||a.label||""}" style="width: ${r}; height: ${r}; border-radius: 50%; border: 2px solid #ffffff; background: ${c}; color: #ffffff; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: ${n}; margin-left: -0.5rem; overflow: hidden; box-shadow: 0 1px 2px rgba(0,0,0,0.1); flex-shrink: 0;">
                ${a.image?`<img src="${a.image}" alt="${a.name||""}" style="width: 100%; height: 100%; object-fit: cover;" />`:a.label||"U"}
            </div>
        `}).join("");o.innerHTML=`
        <div class="laughtale-avatar-group" style="display: inline-flex; align-items: center; padding-left: 0.5rem;">
            ${f}
            ${i>0?`
                <div class="avatar-overflow" style="width: ${r}; height: ${r}; border-radius: 50%; border: 2px solid #ffffff; background: var(--p-surface-200); color: var(--p-surface-700); display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: ${n}; margin-left: -0.5rem; box-shadow: 0 1px 2px rgba(0,0,0,0.1); flex-shrink: 0;">
                    +${i}
                </div>
            `:""}
        </div>
    `}export{d as default};
