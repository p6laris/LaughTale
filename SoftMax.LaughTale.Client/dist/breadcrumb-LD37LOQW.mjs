import{b as s}from"./chunk-P6B5FGGY.mjs";import{e as m}from"./chunk-3YU53HBK.mjs";var B=`
.p-breadcrumb-transparent {
    background: transparent !important;
    border: none !important;
    padding: 0 !important;
}
.p-breadcrumb {
    background: var(--p-surface-0, #ffffff);
    border: 1px solid var(--p-border-color, #e2e8f0);
    border-radius: var(--p-border-radius, 8px);
    padding: 0.75rem 1.25rem;
    display: inline-flex;
    align-items: center;
    box-sizing: border-box;
    width: 100%;
}

.p-breadcrumb-list {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 0.35rem;
    margin: 0;
    padding: 0;
    list-style: none;
}

.p-breadcrumb-item {
    display: inline-flex;
    align-items: center;
}

.p-breadcrumb-item-link {
    color: var(--p-text-muted, #64748b);
    text-decoration: none;
    font-size: 0.875rem;
    font-weight: 500;
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.25rem 0.4rem;
    border-radius: 4px;
    transition: color 0.15s ease, background-color 0.15s ease;
    cursor: pointer;
}

.p-breadcrumb-item-link:hover {
    color: var(--p-text-color, #0f172a);
    background: var(--p-surface-100, #f1f5f9);
}

.p-breadcrumb-item-current {
    color: var(--p-text-color, #0f172a);
    font-weight: 600;
    cursor: default;
}

.p-breadcrumb-item-current:hover {
    background: transparent;
}

.p-breadcrumb-separator {
    color: var(--p-surface-400, #94a3b8);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 0.8125rem;
    user-select: none;
    padding: 0 0.15rem;
}

.p-breadcrumb-ellipsis {
    color: var(--p-text-muted, #64748b);
    font-weight: 700;
    letter-spacing: 1px;
    padding: 0.15rem 0.35rem;
    border-radius: 4px;
    cursor: pointer;
}

.p-breadcrumb-ellipsis:hover {
    background: var(--p-surface-100, #f1f5f9);
    color: var(--p-text-color, #0f172a);
}

.p-breadcrumb-badge {
    font-size: 0.7rem;
    font-weight: 700;
    padding: 0.15rem 0.45rem;
    border-radius: 9999px;
    line-height: 1;
    display: inline-flex;
    align-items: center;
}

.p-breadcrumb-badge-primary {
    background: rgba(59, 130, 246, 0.12);
    color: var(--p-primary-600, #2563eb);
}

.p-breadcrumb-badge-info {
    background: rgba(14, 165, 233, 0.12);
    color: #0284c7;
}

.p-breadcrumb-badge-success {
    background: rgba(16, 185, 129, 0.12);
    color: #10b981;
}

/* Dark Mode Tokens */
.dark .p-breadcrumb,
[data-theme="dark"] .p-breadcrumb-transparent {
    background: transparent !important;
    border: none !important;
    padding: 0 !important;
}
.p-breadcrumb {
    background: var(--p-surface-900, #0f172a);
    border-color: var(--p-surface-700, #334155);
}

.dark .p-breadcrumb-item-link,
[data-theme="dark"] .p-breadcrumb-item-link {
    color: var(--p-surface-400, #94a3b8);
}

.dark .p-breadcrumb-item-link:hover,
[data-theme="dark"] .p-breadcrumb-item-link:hover {
    color: var(--p-surface-0, #f8fafc);
    background: var(--p-surface-800, #1e293b);
}

.dark .p-breadcrumb-item-current,
[data-theme="dark"] .p-breadcrumb-item-current {
    color: var(--p-surface-0, #f8fafc);
}

.dark .p-breadcrumb-separator,
[data-theme="dark"] .p-breadcrumb-separator {
    color: var(--p-surface-600, #475569);
}
`;function S(u,e){m("breadcrumb",B);let l=e.items||[],g=e.home?.url||e.homeUrl||"/",H=e.home?.icon||e.homeIcon||"home",d=e.home?.label||"",b=e.separator||"chevron";function f(){return b==="slash"?'<span class="p-breadcrumb-separator" aria-hidden="true">/</span>':b==="arrow"?'<span class="p-breadcrumb-separator" aria-hidden="true">&gt;</span>':`
            <span class="p-breadcrumb-separator" aria-hidden="true">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
            </span>
        `}function h(r){let a="";r.icon&&(r.icon.startsWith("<svg")?a=r.icon:s[r.icon]?a=s[r.icon]:a=`<span class="${r.icon}"></span>`);let t=r.badge?`<span class="p-breadcrumb-badge p-breadcrumb-badge-${r.badgeSeverity||"primary"}">${r.badge}</span>`:"";return r.isEllipsis?'<span class="p-breadcrumb-ellipsis" title="Show hidden path">...</span>':`
            ${a?`<span style="display:inline-flex; align-items:center;">${a}</span>`:""}
            ${r.label?`<span>${r.label}</span>`:""}
            ${t}
        `}let v=f(),k=l.map((r,a)=>{let t=a===l.length-1,p=r.isCurrent||t,x=r.label||r.Label||"",o=r.url||r.Url,w=r.icon||r.Icon,i=r.isEllipsis||r.IsEllipsis,$=r.badge||r.Badge,I=r.badgeSeverity||r.BadgeSeverity,c=h({label:x,url:o,icon:w,isCurrent:p,isEllipsis:i,badge:$,badgeSeverity:I}),n="";return p&&!i?n=`<span class="p-breadcrumb-item-link p-breadcrumb-item-current" aria-current="page">${c}</span>`:o&&!i?n=`<a href="${o}" class="p-breadcrumb-item-link">${c}</a>`:n=`<span class="p-breadcrumb-item-link">${c}</span>`,`
            <li class="p-breadcrumb-separator-wrapper" style="display: inline-flex; align-items: center;">
                ${v}
            </li>
            <li class="p-breadcrumb-item">
                ${n}
            </li>
        `}).join(""),y=s.home||'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>';u.innerHTML=`
        <nav class="p-breadcrumb p-component" aria-label="Breadcrumb">
            <ol class="p-breadcrumb-list">
                <li class="p-breadcrumb-item">
                    <a href="${g}" class="p-breadcrumb-item-link" title="Home" aria-label="Home">
                        ${y}
                        ${d?`<span>${d}</span>`:""}
                    </a>
                </li>
                ${k}
            </ol>
        </nav>
    `}export{S as default};
