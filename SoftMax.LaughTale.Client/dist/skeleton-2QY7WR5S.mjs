import{e as r}from"./chunk-3YU53HBK.mjs";var s=`
[data-theme="dark"] .laughtale-skeleton {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
`;function c(t,e){r("skeleton",s);let a=e.shape||"rectangle",n=e.width||"100%",i=e.height||"1.25rem",o=e.borderRadius||(a==="circle"?"50%":"var(--p-border-radius)");t.innerHTML=`
        <div class="laughtale-skeleton" style="width: ${n}; height: ${i}; border-radius: ${o}; background: linear-gradient(90deg, var(--p-surface-100) 25%, var(--p-surface-200) 50%, var(--p-surface-100) 75%); background-size: 200% 100%; animation: skeletonShimmer 1.5s infinite ease-in-out;"></div>
        <style>
            @@keyframes skeletonShimmer {
                0% { background-position: 200% 0; }
                100% { background-position: -200% 0; }
            }
        </style>
    `}export{c as default};
