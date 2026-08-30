import{e as u}from"./chunk-3YU53HBK.mjs";var d=`
.p-toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    padding: 0.75rem 1rem;
    background: var(--p-surface-0, #ffffff);
    border: 1px solid var(--p-border-color, #e2e8f0);
    border-radius: var(--p-border-radius, 6px);
    gap: 0.75rem;
    box-sizing: border-box;
    width: 100%;
    transition: background-color 0.15s ease, border-color 0.15s ease;
}

.p-toolbar-start,
.p-toolbar-center,
.p-toolbar-end,
.p-toolbar-group-start,
.p-toolbar-group-center,
.p-toolbar-group-end {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-wrap: wrap;
}

.p-toolbar-center,
.p-toolbar-group-center {
    justify-content: center;
    flex: 1 1 auto;
}

.p-toolbar-end,
.p-toolbar-group-end {
    margin-left: auto;
}

/* Toggle item active styling */
.p-toolbar [data-toggle-active="true"],
.p-toolbar .p-button-active-toggle {
    background: var(--p-surface-0, #ffffff) !important;
    color: var(--p-primary-600, #059669) !important;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1) !important;
    font-weight: 700 !important;
}

.dark .p-toolbar [data-toggle-active="true"],
[data-theme="dark"] .p-toolbar .p-button-active-toggle {
    background: var(--p-surface-700, #334155) !important;
    color: var(--p-primary-400, #34d399) !important;
}

/* Dark Mode Tokens */
.dark .p-toolbar,
[data-theme="dark"] .p-toolbar {
    background: var(--p-surface-900, #0f172a);
    border-color: var(--p-surface-700, #334155);
}
`,g='<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" style="margin-left: 2px;"><polygon points="6 3 20 12 6 21 6 3"/></svg>',b='<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>';function f(n,i){u("toolbar",d);let r=n.querySelector(".p-toolbar")||n;r.classList.add("p-toolbar","p-component"),r.setAttribute("role","toolbar"),r.setAttribute("aria-orientation","horizontal"),i.ariaLabel&&r.setAttribute("aria-label",i.ariaLabel),r.querySelectorAll('[aria-label="Bold"], [aria-label="Italic"], [aria-label="Underline"]').forEach(e=>{e.addEventListener("click",a=>{a.preventDefault();let t=e.classList.toggle("p-button-active-toggle");e.setAttribute("aria-pressed",t?"true":"false"),t?(e.style.background="var(--p-surface-0)",e.style.color="var(--p-primary-600)",e.style.boxShadow="0 1px 3px rgba(0,0,0,0.1)"):(e.style.background="transparent",e.style.color="var(--p-surface-700)",e.style.boxShadow="none")})});let c=r.querySelectorAll('[aria-label="Align Left"], [aria-label="Align Center"], [aria-label="Align Right"]');c.forEach(e=>{e.addEventListener("click",a=>{a.preventDefault(),c.forEach(t=>{t.classList.remove("p-button-active-toggle"),t.setAttribute("aria-pressed","false"),t.style.background="transparent",t.style.color="var(--p-surface-700)",t.style.boxShadow="none"}),e.classList.add("p-button-active-toggle"),e.setAttribute("aria-pressed","true"),e.style.background="var(--p-surface-0)",e.style.color="var(--p-primary-600)",e.style.boxShadow="0 1px 2px rgba(0,0,0,0.06)"})});let p=r.querySelectorAll('[aria-label="Grid View"], [aria-label="List View"]');p.forEach(e=>{e.addEventListener("click",a=>{a.preventDefault(),p.forEach(t=>{t.style.background="transparent",t.style.color="var(--p-surface-600)",t.style.boxShadow="none"}),e.style.background="var(--p-surface-0)",e.style.color="var(--p-primary-600)",e.style.boxShadow="0 1px 2px rgba(0,0,0,0.06)"})});let l=r.querySelector('[aria-label="Play"], [aria-label="Pause"]'),s=!1;l&&l.addEventListener("click",e=>{e.preventDefault(),s=!s,l.setAttribute("aria-label",s?"Pause":"Play"),l.innerHTML=s?b:g});let o=r.querySelector("button:has(svg polygon)");if(o&&o.textContent?.includes("Star")){let e=!1;o.addEventListener("click",a=>{a.preventDefault(),e=!e;let t=o.querySelector("span:last-child");t&&(t.textContent=e?"1.4k + 1":"1.4k"),o.style.color=e?"#eab308":"var(--p-text-color)"})}}export{f as default};
