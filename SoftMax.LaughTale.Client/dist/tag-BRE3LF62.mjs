import{e as s}from"./chunk-3YU53HBK.mjs";var d=`
[data-theme="dark"] .laughtale-tag {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
`;function c(t,n){s("tag",d);let e=n.severity||"info",o=n.rounded||!1,a="var(--p-blue-50, #eff6ff)",r="var(--p-blue-700, #1d4ed8)",f="var(--p-blue-200, #bfdbfe)";e==="success"?(a="var(--p-emerald-50, #ecfdf5)",r="var(--p-emerald-700, #047857)",f="var(--p-emerald-200, #a7f3d0)"):e==="warning"?(a="var(--p-amber-50, #fffbeb)",r="var(--p-amber-700, #b45309)",f="var(--p-amber-200, #fde68a)"):e==="danger"?(a="var(--p-red-50, #fef2f2)",r="var(--p-red-700, #b91c1c)",f="var(--p-red-200, #fecaca)"):e==="secondary"?(a="var(--p-surface-100, #f1f5f9)",r="var(--p-surface-700, #334155)",f="var(--p-surface-200, #e2e8f0)"):e==="contrast"&&(a="var(--p-surface-900, #0f172a)",r="var(--p-surface-0, #ffffff)",f="var(--p-surface-950, #020617)"),t.innerHTML=`
        <span class="laughtale-tag tag-${e}" style="display: inline-flex; align-items: center; gap: 0.35rem; padding: 0.25rem 0.6rem; font-size: 0.75rem; font-weight: 700; background: ${a}; color: ${r}; border: 1px solid ${f}; border-radius: ${o?"9999px":"var(--p-border-radius)"};">
            ${n.icon?`<span>${n.icon}</span>`:""}
            <span>${n.value}</span>
        </span>
    `}export{c as default};
