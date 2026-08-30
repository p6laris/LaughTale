import{d as C}from"./chunk-7HAKB25H.mjs";import{b as x}from"./chunk-P6B5FGGY.mjs";import{b as I}from"./chunk-4AWLBVSN.mjs";import{e as q}from"./chunk-3YU53HBK.mjs";var g=null,J=`
.p-splitbutton {
    display: inline-flex;
    position: relative;
    vertical-align: middle;
    border-radius: var(--p-border-radius, 6px);
    font-family: var(--p-font-family, inherit);
}

.p-splitbutton-fluid {
    width: 100%;
    display: flex;
}

.p-splitbutton .p-splitbutton-button {
    flex: 1 1 auto;
    border-top-right-radius: 0 !important;
    border-bottom-right-radius: 0 !important;
}

.p-splitbutton .p-splitbutton-dropdown {
    flex: 0 0 auto;
    border-top-left-radius: 0 !important;
    border-bottom-left-radius: 0 !important;
    padding-left: 0.5rem !important;
    padding-right: 0.5rem !important;
}

/* Button Base & Severities */
.p-splitbutton .p-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    font-family: inherit;
    font-size: 0.875rem;
    font-weight: 600;
    line-height: 1;
    padding: 0.5rem 1rem;
    border: 1px solid transparent;
    cursor: pointer;
    user-select: none;
    transition: background-color 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease, color 0.15s ease;
    outline: none;
    text-decoration: none;
}

.p-splitbutton-sm .p-button {
    padding: 0.375rem 0.75rem;
    font-size: 0.75rem;
}

.p-splitbutton-lg .p-button {
    padding: 0.75rem 1.25rem;
    font-size: 1rem;
}

.p-splitbutton-rounded {
    border-radius: 9999px !important;
}
.p-splitbutton-rounded .p-splitbutton-button {
    border-top-left-radius: 9999px !important;
    border-bottom-left-radius: 9999px !important;
}
.p-splitbutton-rounded .p-splitbutton-dropdown {
    border-top-right-radius: 9999px !important;
    border-bottom-right-radius: 9999px !important;
}

.p-splitbutton-raised {
    box-shadow: 0 3px 4px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1);
}

/* Solid Severities */
.p-splitbutton .p-button-primary {
    background: var(--p-primary-500, #10b981);
    color: #ffffff;
    border-color: var(--p-primary-500, #10b981);
}
.p-splitbutton .p-button-primary:hover:not(:disabled) {
    background: var(--p-primary-600, #059669);
    border-color: var(--p-primary-600, #059669);
}

.p-splitbutton .p-button-secondary {
    background: var(--p-surface-100, #f1f5f9);
    color: var(--p-surface-700, #334155);
    border-color: var(--p-surface-200, #e2e8f0);
}
.p-splitbutton .p-button-secondary:hover:not(:disabled) {
    background: var(--p-surface-200, #e2e8f0);
    color: var(--p-surface-800, #1e293b);
}

.p-splitbutton .p-button-success {
    background: #22c55e;
    color: #ffffff;
    border-color: #22c55e;
}
.p-splitbutton .p-button-success:hover:not(:disabled) {
    background: #16a34a;
    border-color: #16a34a;
}

.p-splitbutton .p-button-info {
    background: #0ea5e9;
    color: #ffffff;
    border-color: #0ea5e9;
}
.p-splitbutton .p-button-info:hover:not(:disabled) {
    background: #0284c7;
    border-color: #0284c7;
}

.p-splitbutton .p-button-warn {
    background: #f59e0b;
    color: #ffffff;
    border-color: #f59e0b;
}
.p-splitbutton .p-button-warn:hover:not(:disabled) {
    background: #d97706;
    border-color: #d97706;
}

.p-splitbutton .p-button-help {
    background: #a855f7;
    color: #ffffff;
    border-color: #a855f7;
}
.p-splitbutton .p-button-help:hover:not(:disabled) {
    background: #9333ea;
    border-color: #9333ea;
}

.p-splitbutton .p-button-danger {
    background: #ef4444;
    color: #ffffff;
    border-color: #ef4444;
}
.p-splitbutton .p-button-danger:hover:not(:disabled) {
    background: #dc2626;
    border-color: #dc2626;
}

.p-splitbutton .p-button-contrast {
    background: #0f172a;
    color: #ffffff;
    border-color: #0f172a;
}
.p-splitbutton .p-button-contrast:hover:not(:disabled) {
    background: #1e293b;
    border-color: #1e293b;
}

/* Outlined Variant */
.p-splitbutton-outlined .p-button-primary { background: transparent; color: var(--p-primary-500, #10b981); border-color: var(--p-primary-500, #10b981); }
.p-splitbutton-outlined .p-button-primary:hover:not(:disabled) { background: rgba(16, 185, 129, 0.08); }
.p-splitbutton-outlined .p-button-secondary { background: transparent; color: var(--p-surface-700, #334155); border-color: var(--p-surface-300, #cbd5e1); }
.p-splitbutton-outlined .p-button-secondary:hover:not(:disabled) { background: var(--p-surface-100, #f1f5f9); }
.p-splitbutton-outlined .p-button-success { background: transparent; color: #22c55e; border-color: #22c55e; }
.p-splitbutton-outlined .p-button-success:hover:not(:disabled) { background: rgba(34, 197, 94, 0.08); }
.p-splitbutton-outlined .p-button-info { background: transparent; color: #0ea5e9; border-color: #0ea5e9; }
.p-splitbutton-outlined .p-button-info:hover:not(:disabled) { background: rgba(14, 165, 233, 0.08); }
.p-splitbutton-outlined .p-button-warn { background: transparent; color: #f59e0b; border-color: #f59e0b; }
.p-splitbutton-outlined .p-button-warn:hover:not(:disabled) { background: rgba(245, 158, 11, 0.08); }
.p-splitbutton-outlined .p-button-help { background: transparent; color: #a855f7; border-color: #a855f7; }
.p-splitbutton-outlined .p-button-help:hover:not(:disabled) { background: rgba(168, 85, 247, 0.08); }
.p-splitbutton-outlined .p-button-danger { background: transparent; color: #ef4444; border-color: #ef4444; }
.p-splitbutton-outlined .p-button-danger:hover:not(:disabled) { background: rgba(239, 68, 68, 0.08); }
.p-splitbutton-outlined .p-button-contrast { background: transparent; color: #0f172a; border-color: #0f172a; }
.p-splitbutton-outlined .p-button-contrast:hover:not(:disabled) { background: rgba(15, 23, 42, 0.08); }

.p-splitbutton-outlined .p-splitbutton-button {
    border-right: none !important;
}

/* Text Variant */
.p-splitbutton-text .p-button { 
    background: transparent !important; 
    border-color: transparent !important; 
    box-shadow: none !important;
}
.p-splitbutton-text .p-button-primary { color: var(--p-primary-500, #10b981) !important; }
.p-splitbutton-text .p-button-primary:hover:not(:disabled),
.p-splitbutton-text .p-button-primary[aria-expanded="true"] { background: rgba(16, 185, 129, 0.1) !important; }

.p-splitbutton-text .p-button-secondary { color: var(--p-surface-700, #334155) !important; }
.p-splitbutton-text .p-button-secondary:hover:not(:disabled),
.p-splitbutton-text .p-button-secondary[aria-expanded="true"] { background: var(--p-surface-200, #e2e8f0) !important; }

.p-splitbutton-text .p-button-success { color: #22c55e !important; }
.p-splitbutton-text .p-button-success:hover:not(:disabled),
.p-splitbutton-text .p-button-success[aria-expanded="true"] { background: rgba(34, 197, 94, 0.1) !important; }

.p-splitbutton-text .p-button-info { color: #0ea5e9 !important; }
.p-splitbutton-text .p-button-info:hover:not(:disabled),
.p-splitbutton-text .p-button-info[aria-expanded="true"] { background: rgba(14, 165, 233, 0.1) !important; }

.p-splitbutton-text .p-button-warn { color: #f59e0b !important; }
.p-splitbutton-text .p-button-warn:hover:not(:disabled),
.p-splitbutton-text .p-button-warn[aria-expanded="true"] { background: rgba(245, 158, 11, 0.1) !important; }

.p-splitbutton-text .p-button-help { color: #a855f7 !important; }
.p-splitbutton-text .p-button-help:hover:not(:disabled),
.p-splitbutton-text .p-button-help[aria-expanded="true"] { background: rgba(168, 85, 247, 0.1) !important; }

.p-splitbutton-text .p-button-danger { color: #ef4444 !important; }
.p-splitbutton-text .p-button-danger:hover:not(:disabled),
.p-splitbutton-text .p-button-danger[aria-expanded="true"] { background: rgba(239, 68, 68, 0.1) !important; }

.p-splitbutton-text .p-button-contrast { color: #0f172a !important; }
.p-splitbutton-text .p-button-contrast:hover:not(:disabled),
.p-splitbutton-text .p-button-contrast[aria-expanded="true"] { background: rgba(15, 23, 42, 0.1) !important; }

/* Divider separator in solid buttons */
.p-splitbutton:not(.p-splitbutton-outlined):not(.p-splitbutton-text) .p-splitbutton-dropdown {
    border-left: 1px solid rgba(255, 255, 255, 0.25) !important;
}
.p-splitbutton:not(.p-splitbutton-outlined):not(.p-splitbutton-text) .p-button-secondary.p-splitbutton-dropdown {
    border-left: 1px solid var(--p-surface-300, #cbd5e1) !important;
}

/* Disabled */
.p-splitbutton-disabled,
.p-splitbutton .p-button:disabled {
    opacity: 0.6 !important;
    cursor: not-allowed !important;
    pointer-events: none !important;
}

/* Menu Overlay */
.p-splitbutton-menu {
    position: absolute;
    right: 0 !important;
    left: auto !important;
    z-index: 1050;
    min-width: 100%;
    width: max-content;
    background: var(--p-surface-0, #ffffff);
    border: 1px solid var(--p-surface-200, #e2e8f0);
    border-radius: var(--p-border-radius, 8px);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    padding: 0.35rem;
    outline: none;
    transform-origin: top right;
    transition: opacity 0.15s cubic-bezier(0.16, 1, 0.3, 1), transform 0.15s cubic-bezier(0.16, 1, 0.3, 1);
}

.p-splitbutton-menu.p-menu-flipped {
    transform-origin: bottom right;
}

.p-splitbutton-menu .p-menu-list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
}

.p-splitbutton-menu .p-menu-item {
    position: relative;
    border-radius: calc(var(--p-border-radius, 6px) - 2px);
}

.p-splitbutton-menu .p-menu-item-link {
    display: flex;
    align-items: center;
    gap: 0.625rem;
    padding: 0.5rem 0.75rem;
    color: var(--p-surface-700, #334155);
    border-radius: inherit;
    text-decoration: none;
    cursor: pointer;
    font-size: 0.875rem;
    font-weight: 500;
    user-select: none;
    transition: background-color 0.15s ease, color 0.15s ease;
    outline: none;
}

.p-splitbutton-menu .p-menu-item-link:hover,
.p-splitbutton-menu .p-menu-item.p-menu-active > .p-menu-item-link,
.p-splitbutton-menu .p-menu-item.p-focus > .p-menu-item-link {
    background: var(--p-surface-100, #f1f5f9);
    color: var(--p-surface-900, #0f172a);
}

.p-splitbutton-menu .p-menu-item-link[aria-disabled="true"] {
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
}

.p-splitbutton-menu .p-menu-item-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: var(--p-surface-500, #64748b);
}

.p-splitbutton-menu .p-menu-item-link:hover .p-menu-item-icon,
.p-splitbutton-menu .p-menu-item.p-menu-active > .p-menu-item-link .p-menu-item-icon {
    color: var(--p-surface-700, #334155);
}

.p-splitbutton-menu .p-submenu-icon {
    margin-left: auto;
    display: inline-flex;
    color: var(--p-surface-400, #94a3b8);
}

.p-splitbutton-menu .p-menu-separator {
    height: 1px;
    background: var(--p-surface-200, #e2e8f0);
    margin: 0.25rem 0;
}

/* Submenu Flyout Overlay */
.p-splitbutton-submenu-overlay {
    position: absolute;
    top: 0;
    left: calc(100% + 2px);
    z-index: 1060;
    min-width: 11.5rem;
    background: var(--p-surface-0, #ffffff);
    border: 1px solid var(--p-surface-200, #e2e8f0);
    border-radius: var(--p-border-radius, 8px);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    padding: 0.35rem;
    list-style: none;
    margin: 0;
    display: none;
    flex-direction: column;
    gap: 0.15rem;
}

.p-splitbutton-submenu-overlay.p-submenu-flipped {
    left: auto;
    right: calc(100% + 2px);
}

.p-menu-item.p-submenu-open > .p-splitbutton-submenu-overlay {
    display: flex !important;
}

/* Dark Mode Overrides */
.dark .p-splitbutton-menu,
.dark .p-splitbutton-submenu-overlay,
[data-theme="dark"] .p-splitbutton-menu,
[data-theme="dark"] .p-splitbutton-submenu-overlay {
    background: var(--p-surface-900, #0f172a) !important;
    border-color: var(--p-surface-700, #334155) !important;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.4) !important;
}

.dark .p-splitbutton-menu .p-menu-item-link,
[data-theme="dark"] .p-splitbutton-menu .p-menu-item-link {
    color: var(--p-surface-200, #e2e8f0) !important;
}

.dark .p-splitbutton-menu .p-menu-item-link:hover,
.dark .p-splitbutton-menu .p-menu-item.p-menu-active > .p-menu-item-link,
.dark .p-splitbutton-menu .p-menu-item.p-focus > .p-menu-item-link,
[data-theme="dark"] .p-splitbutton-menu .p-menu-item-link:hover,
[data-theme="dark"] .p-splitbutton-menu .p-menu-item.p-menu-active > .p-menu-item-link,
[data-theme="dark"] .p-splitbutton-menu .p-menu-item.p-focus > .p-menu-item-link {
    background: var(--p-surface-800, #1e293b) !important;
    color: #ffffff !important;
}

.dark .p-splitbutton-menu .p-menu-separator,
[data-theme="dark"] .p-splitbutton-menu .p-menu-separator {
    background: var(--p-surface-700, #334155) !important;
}

.dark .p-splitbutton-text .p-button-contrast,
[data-theme="dark"] .p-splitbutton-text .p-button-contrast {
    color: var(--p-surface-0, #ffffff) !important;
}
.dark .p-splitbutton-text .p-button-contrast:hover:not(:disabled),
.dark .p-splitbutton-text .p-button-contrast[aria-expanded="true"],
[data-theme="dark"] .p-splitbutton-text .p-button-contrast:hover:not(:disabled),
[data-theme="dark"] .p-splitbutton-text .p-button-contrast[aria-expanded="true"] {
    background: rgba(255, 255, 255, 0.1) !important;
}
`;function Q(v,i){q("split-button",J);let y=i.label||"",S=i.icon||"",z=i.dropdownIcon||"chevronDown",L=i.model||[],O=(i.severity||"primary").toLowerCase(),D=!!i.raised,P=!!i.rounded,R=!!i.text,U=!!i.outlined,E=i.size||"normal",h=!!i.disabled,j=!!i.fluid,d=!1,M=`sb_menu_${Math.random().toString(36).substring(2,9)}`,u=["p-splitbutton","p-component"];P&&u.push("p-splitbutton-rounded"),D&&u.push("p-splitbutton-raised"),R&&u.push("p-splitbutton-text"),U&&u.push("p-splitbutton-outlined"),E==="small"&&u.push("p-splitbutton-sm"),E==="large"&&u.push("p-splitbutton-lg"),j&&u.push("p-splitbutton-fluid"),h&&u.push("p-splitbutton-disabled");let A=`p-button-${O}`,w=v.innerHTML.trim(),_=w&&!w.startsWith('<div class="p-splitbutton');function W(t){return`
            <ul class="p-splitbutton-submenu-overlay p-menu-list" role="menu">
                ${t.map((a,r)=>T(a,r,!0)).join("")}
            </ul>
        `}function T(t,a,r=!1){if(t.separator)return'<li class="p-menu-separator" role="separator"></li>';let n=Array.isArray(t.items)&&t.items.length>0,l=t.icon?`<span class="p-menu-item-icon">${x[t.icon]}</span>`:"",e=n?`<span class="p-submenu-icon">${x.chevronRight}</span>`:"",p=t.label||"",m=t.disabled?'aria-disabled="true"':"",s=t.url||(t.route?t.route:"");return`
            <li class="p-menu-item ${n?"p-menu-item-has-submenu":""}" role="none" data-index="${a}">
                <a class="p-menu-item-link" 
                   role="menuitem" 
                   tabindex="${t.disabled?"-1":"0"}" 
                   ${m}
                   ${s?`href="${s}"`:""}
                   ${t.target?`target="${t.target}"`:""}>
                    ${l}
                    <span class="p-menu-item-label">${p}</span>
                    ${e}
                </a>
                ${n?W(t.items):""}
            </li>
        `}let Y=_?w:`${S?`<span class="p-button-icon">${x[S]}</span>`:""}${y?`<span class="p-button-label">${y}</span>`:""}`;v.innerHTML=`
        <div class="${u.join(" ")}">
            <!-- Main Default Action Button -->
            <button type="button" 
                    class="p-splitbutton-button p-button ${A}" 
                    ${h?"disabled":""} 
                    aria-label="${y||"SplitButton Action"}">
                ${Y}
            </button>

            <!-- Dropdown Menu Trigger Button -->
            <button type="button" 
                    class="p-splitbutton-dropdown p-button p-button-icon-only ${A}" 
                    ${h?"disabled":""} 
                    aria-haspopup="menu" 
                    aria-expanded="false" 
                    aria-controls="${M}" 
                    aria-label="More Options">
                <span class="p-button-icon">${x[z]}</span>
            </button>

            <!-- Dropdown Menu Overlay -->
            <div id="${M}" class="p-splitbutton-menu p-menu p-component" role="menu" style="display: none; opacity: 0; transform: scaleY(0.8);">
                <ul class="p-menu-list" role="menu">
                    ${L.map((t,a)=>T(t,a)).join("")}
                </ul>
            </div>
        </div>
    `;let k=v.firstElementChild,F=k.querySelector(".p-splitbutton-button"),f=k.querySelector(".p-splitbutton-dropdown"),o=k.querySelector(".p-splitbutton-menu");function N(t){(t||o).querySelectorAll(".p-menu-item.p-submenu-open").forEach(r=>{r.classList.remove("p-submenu-open","p-menu-active")})}function c(){d&&(d=!1,g===c&&(g=null),f.setAttribute("aria-expanded","false"),o.style.opacity="0",o.style.transform="scaleY(0.8)",N(),setTimeout(()=>{d||(o.style.display="none")},150))}function H(){if(h||L.length===0||d)return;g&&g!==c&&g(),g=c,d=!0,f.setAttribute("aria-expanded","true"),o.style.display="block";let t=k.getBoundingClientRect(),a=o.offsetHeight||200;t.bottom+a+10<=window.innerHeight?(o.classList.remove("p-menu-flipped"),o.style.top="calc(100% + 4px)",o.style.bottom="auto",o.style.right="0"):(o.classList.add("p-menu-flipped"),o.style.top="auto",o.style.bottom="calc(100% + 4px)",o.style.right="0"),requestAnimationFrame(()=>{o.style.opacity="1",o.style.transform="scaleY(1)"}),o.querySelector('.p-menu-item-link:not([aria-disabled="true"])')?.focus()}function V(){d?c():H()}F.addEventListener("click",()=>{h||v.dispatchEvent(new CustomEvent("splitbutton:click",{bubbles:!0,detail:{action:i.action||"main",label:y}}))}),f.addEventListener("click",t=>{t.stopPropagation(),V()}),document.addEventListener("click",t=>{d&&!k.contains(t.target)&&c()});function K(t,a){if(!t.disabled){if(typeof t.command=="function"?t.command(t):typeof t.command=="string"&&C(t.command,t),t.url){let r=I(t.url);r&&r!=="about:blank"&&(t.target==="_blank"?window.open(r,"_blank","noopener,noreferrer"):window.location.href=r)}v.dispatchEvent(new CustomEvent("splitbutton:action",{bubbles:!0,detail:{item:t,action:t.action||t.label}})),c(),f.focus()}}function $(t,a){let r=Array.from(t.children).filter(n=>n.classList.contains("p-menu-item"));r.forEach((n,l)=>{let e=a[l];if(!e||e.separator)return;let p=Array.isArray(e.items)&&e.items.length>0,m=n.querySelector(":scope > .p-menu-item-link"),s=n.querySelector(":scope > .p-splitbutton-submenu-overlay");n.addEventListener("mouseenter",()=>{if(r.forEach(b=>{b!==n&&b.classList.remove("p-submenu-open","p-menu-active")}),p&&s){n.classList.add("p-submenu-open","p-menu-active");let b=n.getBoundingClientRect(),G=s.offsetWidth||180;b.right+G>window.innerWidth?s.classList.add("p-submenu-flipped"):s.classList.remove("p-submenu-flipped")}else n.classList.add("p-menu-active")}),m?.addEventListener("click",b=>{if(p){b.preventDefault(),b.stopPropagation();return}K(e,b)}),p&&s&&$(s,e.items)})}let B=o.querySelector(":scope > .p-menu-list");B&&$(B,L),f.addEventListener("keydown",t=>{(t.key==="ArrowDown"||t.key==="ArrowUp"||t.key===" "||t.key==="Enter")&&(t.preventDefault(),H())}),o.addEventListener("keydown",t=>{let r=document.activeElement?.closest(".p-menu-item-link"),n=r?.closest(".p-menu-item"),l=n?.closest("ul");if(t.key==="Escape"){t.preventDefault();let e=n?.closest(".p-splitbutton-submenu-overlay");if(e){let p=e.closest(".p-menu-item");p?.classList.remove("p-submenu-open"),p?.querySelector(":scope > .p-menu-item-link")?.focus()}else c(),f.focus();return}if(t.key==="ArrowDown"){t.preventDefault();let e=Array.from(l?.querySelectorAll(':scope > .p-menu-item > .p-menu-item-link:not([aria-disabled="true"])')||[]),m=(e.indexOf(r)+1)%e.length;e[m]?.focus();return}if(t.key==="ArrowUp"){t.preventDefault();let e=Array.from(l?.querySelectorAll(':scope > .p-menu-item > .p-menu-item-link:not([aria-disabled="true"])')||[]),m=(e.indexOf(r)-1+e.length)%e.length;e[m]?.focus();return}if(t.key==="ArrowRight"){n?.classList.contains("p-menu-item-has-submenu")&&(t.preventDefault(),n.classList.add("p-submenu-open"),n.querySelector('.p-splitbutton-submenu-overlay .p-menu-item-link:not([aria-disabled="true"])')?.focus());return}if(t.key==="ArrowLeft"){let e=n?.closest(".p-splitbutton-submenu-overlay");if(e){t.preventDefault();let p=e.closest(".p-menu-item");p?.classList.remove("p-submenu-open"),p?.querySelector(":scope > .p-menu-item-link")?.focus()}return}if(t.key==="Home"){t.preventDefault(),Array.from(l?.querySelectorAll(':scope > .p-menu-item > .p-menu-item-link:not([aria-disabled="true"])')||[])[0]?.focus();return}if(t.key==="End"){t.preventDefault();let e=Array.from(l?.querySelectorAll(':scope > .p-menu-item > .p-menu-item-link:not([aria-disabled="true"])')||[]);e[e.length-1]?.focus();return}})}export{Q as default};
