import{e as f}from"./chunk-3YU53HBK.mjs";var c={chevronDown:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>',plus:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg>',minus:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/></svg>'},b=`
.p-fieldset {
    border: 1px solid var(--p-border-color, #e2e8f0);
    background: var(--p-surface-0, #ffffff);
    color: var(--p-text-color, #0f172a);
    border-radius: var(--p-border-radius-md, 6px);
    padding: 0 1.125rem 1.125rem 1.125rem;
    margin: 0;
    box-sizing: border-box;
    transition: border-color 0.2s ease;
    width: 100%;
}

.p-fieldset-legend {
    padding: 0 0.5rem;
    border: none;
    color: var(--p-text-color, #0f172a);
    background: transparent;
    border-radius: 6px;
    font-weight: 600;
    font-size: 0.875rem;
    margin: 0;
    width: auto;
}

.p-fieldset-toggle-button {
    cursor: pointer;
    user-select: none;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    position: relative;
    padding: 0.35rem 0.6rem;
    border: none;
    background: var(--p-surface-0, #ffffff);
    color: var(--p-text-color, #0f172a);
    border-radius: 6px;
    transition: background-color 0.15s ease, color 0.15s ease;
    text-decoration: none;
    outline: none;
    font-family: inherit;
}
.p-fieldset-toggle-button:hover {
    background: var(--p-surface-100, #f1f5f9);
    color: var(--p-surface-900, #0f172a);
}
.p-fieldset-toggle-button:focus-visible {
    outline: 2px solid var(--p-primary-500, #10b981);
    outline-offset: 1px;
}

.p-fieldset-toggle-icon {
    color: var(--p-surface-500, #64748b);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.25s cubic-bezier(0.2, 0, 0, 1), color 0.15s ease;
}

.p-fieldset-chevron-indicator .p-fieldset-toggle-button[aria-expanded="true"] .p-fieldset-toggle-icon {
    transform: rotate(180deg);
}

.p-fieldset-legend-label {
    font-weight: 600;
    font-size: 0.875rem;
}

/* 60fps CSS Grid Smooth Collapse/Expand Transition */
.p-fieldset-content-container {
    display: grid;
    grid-template-rows: 1fr;
    transition: grid-template-rows 250ms cubic-bezier(0.2, 0, 0, 1);
}
.p-fieldset.p-fieldset-collapsed .p-fieldset-content-container {
    grid-template-rows: 0fr;
}

.p-fieldset-content-wrapper {
    min-height: 0;
    overflow: hidden;
}

.p-fieldset-content {
    padding-top: 0.5rem;
    font-size: 0.875rem;
    line-height: 1.5;
    color: var(--p-surface-700, #334155);
    transition: opacity 200ms ease, transform 200ms ease;
    opacity: 1;
    transform: translateY(0);
}
.p-fieldset.p-fieldset-collapsed .p-fieldset-content {
    opacity: 0;
    transform: translateY(-4px);
}

/* Top control buttons for controlled mode */
.p-fieldset-top-controls {
    display: flex;
    justify-content: center;
    gap: 0.5rem;
    margin-bottom: 1rem;
}
.p-fieldset-ctrl-btn {
    padding: 0.45rem 1.1rem;
    font-size: 0.875rem;
    font-weight: 600;
    border-radius: 6px;
    border: 1px solid var(--p-surface-300, #cbd5e1);
    background: var(--p-surface-0, #ffffff);
    color: var(--p-surface-700, #334155);
    cursor: pointer;
    transition: all 0.2s cubic-bezier(0.2, 0, 0, 1);
}
.p-fieldset-ctrl-btn:hover {
    background: var(--p-surface-100, #f1f5f9);
}
.p-fieldset-ctrl-btn.p-highlight {
    background: var(--p-surface-900, #0f172a);
    border-color: var(--p-surface-900, #0f172a);
    color: #ffffff;
}

/* Dark Mode Tokens */
.dark .p-fieldset,
[data-theme="dark"] .p-fieldset {
    background: var(--p-surface-900, #0f172a) !important;
    border-color: var(--p-surface-700, #334155) !important;
    color: var(--p-surface-100, #f8fafc) !important;
}
.dark .p-fieldset-toggle-button,
[data-theme="dark"] .p-fieldset-toggle-button {
    background: var(--p-surface-900, #0f172a) !important;
    color: var(--p-surface-100, #f8fafc) !important;
}
.dark .p-fieldset-toggle-button:hover,
[data-theme="dark"] .p-fieldset-toggle-button:hover {
    background: var(--p-surface-800, #1e293b) !important;
}
.dark .p-fieldset-content,
[data-theme="dark"] .p-fieldset-content {
    color: var(--p-surface-300, #cbd5e1) !important;
}
.dark .p-fieldset-ctrl-btn,
[data-theme="dark"] .p-fieldset-ctrl-btn {
    background: var(--p-surface-900, #0f172a) !important;
    border-color: var(--p-surface-700, #334155) !important;
    color: var(--p-surface-200, #e2e8f0) !important;
}
.dark .p-fieldset-ctrl-btn.p-highlight,
[data-theme="dark"] .p-fieldset-ctrl-btn.p-highlight {
    background: var(--p-surface-0, #ffffff) !important;
    border-color: var(--p-surface-0, #ffffff) !important;
    color: var(--p-surface-900, #0f172a) !important;
}
`;function m(r,l){f("fieldset",b);let p=!!l.toggleable,i=!!l.controlled,g=l.toggleIcon||"plusMinus",e=!!l.collapsed,u=r.querySelector(".p-fieldset")||r,a=r.querySelector(".p-fieldset-toggle-button"),s=r.querySelector(".p-fieldset-toggle-icon");function n(t){e=t,u.classList.toggle("p-fieldset-collapsed",e),a&&a.setAttribute("aria-expanded",e?"false":"true"),s&&g==="plusMinus"&&(s.innerHTML=e?c.plus:c.minus),i&&r.querySelectorAll(".p-fieldset-ctrl-btn").forEach(o=>{let d=o.getAttribute("data-action");d==="open"?o.classList.toggle("p-highlight",!e):d==="close"&&o.classList.toggle("p-highlight",e)}),r.dispatchEvent(new CustomEvent("fieldset:toggle",{bubbles:!0,detail:{collapsed:e}}))}p&&a&&(a.addEventListener("click",()=>{n(!e)}),a.addEventListener("keydown",t=>{(t.key==="Enter"||t.key===" ")&&(t.preventDefault(),n(!e))})),i&&r.querySelectorAll(".p-fieldset-ctrl-btn").forEach(t=>{t.addEventListener("click",()=>{let o=t.getAttribute("data-action");o==="open"?n(!1):o==="close"&&n(!0)})})}export{m as default};
