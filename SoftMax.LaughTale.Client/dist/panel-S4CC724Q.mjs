import{e as s}from"./chunk-3YU53HBK.mjs";var d={chevronDown:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>',plus:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg>',minus:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/></svg>'},b=`
.p-panel {
    border: 1px solid var(--p-border-color, #e2e8f0);
    background: var(--p-surface-0, #ffffff);
    color: var(--p-text-color, #0f172a);
    border-radius: var(--p-border-radius-md, 6px);
    overflow: hidden;
    box-sizing: border-box;
    transition: border-color 0.2s ease;
    width: 100%;
}

.p-panel-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.875rem 1.125rem;
    background: var(--p-surface-0, #ffffff);
    color: var(--p-text-color, #0f172a);
    border-bottom: 1px solid var(--p-border-color, #e2e8f0);
    box-sizing: border-box;
    transition: border-color 0.2s ease;
}
.p-panel.p-panel-collapsed .p-panel-header {
    border-bottom-color: transparent;
}

.p-panel-title {
    font-weight: 700;
    font-size: 1rem;
    line-height: 1.25;
    color: var(--p-text-color, #0f172a);
}

.p-panel-icons {
    display: flex;
    align-items: center;
    gap: 0.35rem;
}

.p-panel-toggle-button {
    width: 2rem;
    height: 2rem;
    border-radius: 9999px;
    border: 1px solid var(--p-border-color, #e2e8f0);
    background: var(--p-surface-0, #ffffff);
    color: var(--p-surface-600, #475569);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background-color 0.15s ease, color 0.15s ease, border-color 0.15s ease;
    outline: none;
    padding: 0;
    box-sizing: border-box;
}
.p-panel-toggle-button:hover {
    background: var(--p-surface-100, #f1f5f9);
    color: var(--p-surface-900, #0f172a);
    border-color: var(--p-surface-300, #cbd5e1);
}
.p-panel-toggle-button:focus-visible {
    outline: 2px solid var(--p-primary-500, #10b981);
    outline-offset: 1px;
}

.p-panel-toggle-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.25s cubic-bezier(0.2, 0, 0, 1), color 0.15s ease;
}

.p-panel-chevron-indicator .p-panel-toggle-button[aria-expanded="true"] .p-panel-toggle-icon {
    transform: rotate(180deg);
}

/* 60fps CSS Grid Smooth Collapse/Expand Transition */
.p-panel-content-container {
    display: grid;
    grid-template-rows: 1fr;
    transition: grid-template-rows 250ms cubic-bezier(0.2, 0, 0, 1);
}
.p-panel.p-panel-collapsed .p-panel-content-container {
    grid-template-rows: 0fr;
}

.p-panel-content-wrapper {
    min-height: 0;
    overflow: hidden;
}

.p-panel-content {
    padding: 1.125rem;
    font-size: 0.875rem;
    line-height: 1.6;
    color: var(--p-surface-700, #334155);
    transition: opacity 200ms ease, transform 200ms ease;
    opacity: 1;
    transform: translateY(0);
}
.p-panel.p-panel-collapsed .p-panel-content {
    opacity: 0;
    transform: translateY(-4px);
}

.p-panel-footer {
    padding: 0.75rem 1.125rem;
    border-top: 1px solid var(--p-border-color, #e2e8f0);
    background: var(--p-surface-0, #ffffff);
    color: var(--p-text-muted, #64748b);
    font-size: 0.8125rem;
}

/* Top control buttons for controlled mode */
.p-panel-top-controls {
    display: flex;
    justify-content: center;
    gap: 0.5rem;
    margin-bottom: 1rem;
}
.p-panel-ctrl-btn {
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
.p-panel-ctrl-btn:hover {
    background: var(--p-surface-100, #f1f5f9);
}
.p-panel-ctrl-btn.p-highlight {
    background: var(--p-surface-900, #0f172a);
    border-color: var(--p-surface-900, #0f172a);
    color: #ffffff;
}

/* Dark Mode Tokens */
.dark .p-panel,
[data-theme="dark"] .p-panel {
    background: var(--p-surface-900, #0f172a) !important;
    border-color: var(--p-surface-700, #334155) !important;
    color: var(--p-surface-100, #f8fafc) !important;
}
.dark .p-panel-header,
[data-theme="dark"] .p-panel-header {
    background: var(--p-surface-900, #0f172a) !important;
    border-color: var(--p-surface-700, #334155) !important;
}
.dark .p-panel-title,
[data-theme="dark"] .p-panel-title {
    color: var(--p-surface-0, #ffffff) !important;
}
.dark .p-panel-toggle-button,
[data-theme="dark"] .p-panel-toggle-button {
    background: var(--p-surface-900, #0f172a) !important;
    border-color: var(--p-surface-700, #334155) !important;
    color: var(--p-surface-300, #cbd5e1) !important;
}
.dark .p-panel-toggle-button:hover,
[data-theme="dark"] .p-panel-toggle-button:hover {
    background: var(--p-surface-800, #1e293b) !important;
}
.dark .p-panel-content,
[data-theme="dark"] .p-panel-content {
    color: var(--p-surface-300, #cbd5e1) !important;
}
.dark .p-panel-footer,
[data-theme="dark"] .p-panel-footer {
    background: var(--p-surface-900, #0f172a) !important;
    border-color: var(--p-surface-700, #334155) !important;
    color: var(--p-surface-400, #94a3b8) !important;
}
.dark .p-panel-ctrl-btn,
[data-theme="dark"] .p-panel-ctrl-btn {
    background: var(--p-surface-900, #0f172a) !important;
    border-color: var(--p-surface-700, #334155) !important;
    color: var(--p-surface-200, #e2e8f0) !important;
}
.dark .p-panel-ctrl-btn.p-highlight,
[data-theme="dark"] .p-panel-ctrl-btn.p-highlight {
    background: var(--p-surface-0, #ffffff) !important;
    border-color: var(--p-surface-0, #ffffff) !important;
    color: var(--p-surface-900, #0f172a) !important;
}
`;function m(o,n){s("panel",b);let f=!!n.toggleable,p=!!n.controlled,u=n.toggleIcon||"chevron",e=!!n.collapsed,g=o.querySelector(".p-panel")||o,a=o.querySelector(".p-panel-toggle-button"),i=o.querySelector(".p-panel-toggle-icon");function l(r){e=r,g.classList.toggle("p-panel-collapsed",e),a&&a.setAttribute("aria-expanded",e?"false":"true"),i&&u==="plusMinus"&&(i.innerHTML=e?d.plus:d.minus),p&&o.querySelectorAll(".p-panel-ctrl-btn").forEach(t=>{let c=t.getAttribute("data-action");c==="open"?t.classList.toggle("p-highlight",!e):c==="close"&&t.classList.toggle("p-highlight",e)}),o.dispatchEvent(new CustomEvent("panel:toggle",{bubbles:!0,detail:{collapsed:e}}))}f&&a&&(a.addEventListener("click",()=>{l(!e)}),a.addEventListener("keydown",r=>{(r.key==="Enter"||r.key===" ")&&(r.preventDefault(),l(!e))})),p&&o.querySelectorAll(".p-panel-ctrl-btn").forEach(r=>{r.addEventListener("click",()=>{let t=r.getAttribute("data-action");t==="open"?l(!1):t==="close"&&l(!0)})})}export{m as default};
