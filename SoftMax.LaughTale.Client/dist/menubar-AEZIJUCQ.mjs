import{b as f}from"./chunk-P6B5FGGY.mjs";import{e as k}from"./chunk-3YU53HBK.mjs";var z=`
.p-menubar {
    display: flex;
    align-items: center;
    background: var(--p-menubar-background, var(--p-surface-0, #ffffff));
    border: 1px solid var(--p-menubar-border-color, var(--p-border-color, #e2e8f0));
    border-radius: var(--p-menubar-border-radius, var(--p-border-radius, 8px));
    padding: var(--p-menubar-padding, 0.5rem 0.75rem);
    gap: var(--p-menubar-gap, 0.5rem);
    color: var(--p-menubar-color, var(--p-text-color, #0f172a));
    box-sizing: border-box;
    font-family: inherit;
    position: relative;
    user-select: none;
}

.p-menubar-start {
    display: flex;
    align-items: center;
    margin-right: 0.5rem;
    flex-shrink: 0;
}

.p-menubar-end {
    display: flex;
    align-items: center;
    margin-left: auto;
    gap: 0.5rem;
    flex-shrink: 0;
}

.p-menubar-button {
    display: none;
    align-items: center;
    justify-content: center;
    width: 2.25rem;
    height: 2.25rem;
    border: none;
    background: transparent;
    border-radius: var(--p-border-radius, 6px);
    color: var(--p-surface-600, #475569);
    cursor: pointer;
    transition: background-color 0.15s ease, color 0.15s ease;
    margin-left: auto;
}

.p-menubar-button:hover {
    background: var(--p-surface-100, #f1f5f9);
    color: var(--p-text-color, #0f172a);
}

.p-menubar-root-list {
    display: flex;
    align-items: center;
    list-style: none;
    margin: 0;
    padding: 0;
    gap: 0.25rem;
    box-sizing: border-box;
}

.p-menubar-item {
    position: relative;
    list-style: none;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

.p-menubar-item-content {
    display: block;
    box-sizing: border-box;
}

.p-menubar-item-link {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.45rem 0.75rem;
    color: var(--p-menubar-item-color, var(--p-text-color, #0f172a));
    border-radius: var(--p-menubar-item-border-radius, var(--p-border-radius, 6px));
    text-decoration: none;
    cursor: pointer;
    font-size: 0.875rem;
    font-weight: 500;
    transition: background-color 0.12s ease, color 0.12s ease;
    outline: none;
    box-sizing: border-box;
    white-space: nowrap;
}

.p-menubar-item-link:hover,
.p-menubar-item.p-focus > .p-menubar-item-content > .p-menubar-item-link,
.p-menubar-item-link.p-focus,
.p-menubar-item.p-active > .p-menubar-item-content > .p-menubar-item-link {
    background: var(--p-menubar-item-focus-background, var(--p-surface-100, #f1f5f9));
    color: var(--p-menubar-item-focus-color, var(--p-text-color, #0f172a));
}

.p-menubar-item.p-disabled > .p-menubar-item-content > .p-menubar-item-link {
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
}

.p-menubar-item-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: var(--p-surface-500, #64748b);
    width: 1.125rem;
    height: 1.125rem;
    flex-shrink: 0;
}

.p-menubar-item-label {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.p-menubar-submenu-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: var(--p-surface-400, #94a3b8);
    transition: transform 0.15s ease;
    flex-shrink: 0;
}

.p-menubar-item-shortcut {
    margin-left: 1.5rem;
    font-size: 0.75rem;
    color: var(--p-surface-500, #64748b);
    background: var(--p-surface-100, #f1f5f9);
    border: 1px solid var(--p-border-color, #cbd5e1);
    border-radius: 4px;
    padding: 0.1rem 0.35rem;
    font-weight: 500;
}

.p-menubar-item-badge {
    background: #000000;
    color: #ffffff;
    font-size: 0.75rem;
    font-weight: 700;
    min-width: 1.25rem;
    height: 1.25rem;
    border-radius: 9999px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0 0.35rem;
    margin-left: 0.5rem;
}

/* Cascading Dropdown Submenu */
.p-menubar-submenu {
    display: none;
    position: absolute;
    top: 100%;
    left: 0;
    min-width: 12.5rem;
    background: var(--p-menubar-submenu-background, var(--p-surface-0, #ffffff));
    border: 1px solid var(--p-menubar-submenu-border-color, var(--p-border-color, #e2e8f0));
    border-radius: var(--p-menubar-submenu-border-radius, var(--p-border-radius, 8px));
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.05);
    padding: 0.375rem;
    list-style: none;
    margin: 0.25rem 0 0 0;
    z-index: 1000;
    box-sizing: border-box;
    flex-direction: column;
    gap: 0.125rem;
    animation: p-menubar-submenu-fade 0.15s cubic-bezier(0, 0, 0.2, 1);
}

@keyframes p-menubar-submenu-fade {
    from {
        opacity: 0;
        transform: scale(0.95);
    }
    to {
        opacity: 1;
        transform: scale(1);
    }
}

/* Nested level flyouts */
.p-menubar-submenu .p-menubar-item > .p-menubar-submenu {
    top: 0;
    left: 100%;
    margin: 0 0 0 0.25rem;
}

.p-menubar-submenu .p-menubar-item > .p-menubar-submenu.p-submenu-flip {
    left: auto;
    right: 100%;
    margin: 0 0.25rem 0 0;
}

.p-menubar-item.p-active > .p-menubar-submenu {
    display: flex;
}

.p-menubar-separator {
    height: 1px;
    background: var(--p-border-color, #e2e8f0);
    margin: 0.25rem 0;
    list-style: none;
    padding: 0;
}

/* Mobile responsive styles */
@media (max-width: 960px) {
    .p-menubar-button {
        display: inline-flex;
    }
    .p-menubar-root-list {
        display: none;
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        flex-direction: column;
        background: var(--p-surface-0, #ffffff);
        border: 1px solid var(--p-border-color, #e2e8f0);
        border-radius: var(--p-border-radius, 8px);
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        padding: 0.5rem;
        margin-top: 0.25rem;
        z-index: 1000;
    }
    .p-menubar-root-list.p-mobile-open {
        display: flex;
    }
    .p-menubar-submenu {
        position: static;
        box-shadow: none;
        border: none;
        padding-left: 1rem;
        margin: 0;
    }
    .p-menubar-submenu .p-menubar-item > .p-menubar-submenu {
        position: static;
        box-shadow: none;
        border: none;
        padding-left: 1rem;
        margin: 0;
    }
}

/* Dark Mode */
.dark .p-menubar,
[data-theme="dark"] .p-menubar {
    background: var(--p-surface-900, #0f172a);
    color: var(--p-surface-0, #f8fafc);
    border-color: var(--p-surface-700, #334155);
}

.dark .p-menubar-button {
    color: var(--p-surface-400, #94a3b8);
}

.dark .p-menubar-button:hover {
    background: var(--p-surface-800, #1e293b);
    color: var(--p-surface-0, #f8fafc);
}

.dark .p-menubar-item-link,
[data-theme="dark"] .p-menubar-item-link {
    color: var(--p-surface-100, #f1f5f9);
}

.dark .p-menubar-item-link:hover,
.dark .p-menubar-item.p-active > .p-menubar-item-content > .p-menubar-item-link,
[data-theme="dark"] .p-menubar-item-link:hover,
[data-theme="dark"] .p-menubar-item.p-active > .p-menubar-item-content > .p-menubar-item-link {
    background: var(--p-surface-800, #1e293b);
    color: var(--p-surface-0, #f8fafc);
}

.dark .p-menubar-submenu,
[data-theme="dark"] .p-menubar-submenu {
    background: var(--p-surface-900, #0f172a);
    border-color: var(--p-surface-700, #334155);
}

.dark .p-menubar-separator,
[data-theme="dark"] .p-menubar-separator {
    background: var(--p-surface-700, #334155);
}

.dark .p-menubar-item-shortcut,
[data-theme="dark"] .p-menubar-item-shortcut {
    background: var(--p-surface-800, #1e293b);
    border-color: var(--p-surface-700, #334155);
    color: var(--p-surface-300, #cbd5e1);
}

.dark .p-menubar-item-badge,
[data-theme="dark"] .p-menubar-item-badge {
    background: #ffffff;
    color: #000000;
}
`;function H(p,i){k("menubar",z);let g=i.customTemplate||i.CustomTemplate||!1;function v(e){return Array.isArray(e)?e.map(r=>({label:r.label||r.Label||"",icon:r.icon||r.Icon,separator:r.separator||r.Separator||!1,disabled:r.disabled||r.Disabled||!1,url:r.url||r.Url,route:r.route||r.Route,target:r.target||r.Target,command:r.command||r.Command,action:r.action||r.Action,badge:r.badge||r.Badge,shortcut:r.shortcut||r.Shortcut,items:Array.isArray(r.items||r.Items)?v(r.items||r.Items):void 0})):[]}let y=i.model||i.items||i.Model||i.Items||[],h=v(y),l=!1;function w(e){return e?e.startsWith("<svg")?e:f[e]?f[e]:"":""}function x(e,r,a){if(e.separator)return'<li class="p-menubar-separator" role="separator"></li>';let t=Array.isArray(e.items)&&e.items.length>0,n=e.icon?w(e.icon):"",d=n?`<span class="p-menubar-item-icon">${n}</span>`:"",u=t?a?'<svg class="p-menubar-submenu-icon" xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>':'<svg class="p-menubar-submenu-icon" style="margin-left: auto;" xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>':"",o="";return t&&(o=`<ul class="p-menubar-submenu" role="menu">${e.items.map((I,E)=>x(I,`${r}.${E}`,!1)).join("")}</ul>`),`
            <li class="p-menubar-item ${e.disabled?"p-disabled":""}" role="none" data-path="${r}">
                <div class="p-menubar-item-content">
                    <a class="p-menubar-item-link" role="menuitem" tabindex="-1" href="${e.url||e.route||"#"}" ${e.target?`target="${e.target}"`:""}>
                        ${d}
                        <span class="p-menubar-item-label">${e.label}</span>
                        ${e.badge!==void 0?`<span class="p-menubar-item-badge">${e.badge}</span>`:""}
                        ${e.shortcut?`<span class="p-menubar-item-shortcut">${e.shortcut}</span>`:""}
                        ${u}
                    </a>
                </div>
                ${o}
            </li>
        `}function M(){let e=h.map((s,m)=>x(s,`${m}`,!0)).join(""),r="";g&&(r=`
                <div class="p-menubar-start">
                    <span style="display: inline-flex; align-items: center; justify-content: center; width: 2rem; height: 2rem; background: var(--p-primary-500, #3b82f6); border-radius: 6px; color: #fff; margin-right: 0.5rem;">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2 2 7l10 5 10-5-10-5Z"/><path d="m2 17 10 5 10-5"/><path d="m2 12 10 5 10-5"/></svg>
                    </span>
                    <span style="font-weight: 700; font-size: 0.9375rem;">PRIME<span style="color: var(--p-primary-500, #3b82f6);">APP</span></span>
                </div>
            `);let a="";g&&(a=`
                <div class="p-menubar-end">
                    <div style="position: relative; display: flex; align-items: center;">
                        <input type="text" placeholder="Search" style="padding: 0.4rem 0.75rem; border-radius: 6px; border: 1px solid var(--p-border-color, #cbd5e1); font-size: 0.8125rem; width: 9rem; outline: none; background: transparent; color: inherit;" />
                    </div>
                    <span style="width: 2rem; height: 2rem; border-radius: 9999px; background: linear-gradient(135deg, #f59e0b, #ef4444); color: #fff; display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 700;">AE</span>
                </div>
            `);let t='<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>',n=i.class||i.Class||"",d=i.style||i.Style||"";return`
            <div class="p-menubar p-component ${n}" style="${d}" role="menubar" tabindex="0">
                ${r}
                <button type="button" class="p-menubar-button" aria-label="Toggle navigation">
                    ${t}
                </button>
                <ul class="p-menubar-root-list ${l?"p-mobile-open":""}" role="menubar">
                    ${e}
                </ul>
                ${a}
            </div>
        `}function S(e){let r=e.querySelector(".p-menubar-button"),a=e.querySelector(".p-menubar-root-list");r&&a&&r.addEventListener("click",n=>{n.stopPropagation(),l=!l,a.classList.toggle("p-mobile-open",l)}),e.querySelectorAll(".p-menubar-item").forEach(n=>{let d=n.querySelector(":scope > .p-menubar-item-content > .p-menubar-item-link"),s=n.querySelector(":scope > .p-menubar-submenu");d&&(n.addEventListener("mouseenter",()=>{if(window.innerWidth>960){let m=n.parentElement;m&&m.querySelectorAll(":scope > .p-menubar-item.p-active").forEach(u=>{u!==n&&u.classList.remove("p-active")}),s&&(n.classList.add("p-active"),s.getBoundingClientRect().right>window.innerWidth&&s.classList.add("p-submenu-flip"))}}),n.addEventListener("mouseleave",()=>{window.innerWidth>960&&s&&n.classList.remove("p-active")}),d.addEventListener("click",m=>{let u=n.getAttribute("data-path")||"",o=$(h,u);if(!(!o||o.disabled)){if(s){m.preventDefault(),n.classList.toggle("p-active");return}o.command&&(m.preventDefault(),o.command==="new-doc"?c("File created","success"):o.command==="print"?c("No printer connected","error"):o.command==="search"?c("No results found","warn"):o.command==="download-cloud"?c("Downloaded from cloud","info"):o.command==="share-cloud"&&c("Exported to cloud","info")),b()}}))}),document.addEventListener("click",n=>{e.contains(n.target)||(b(),l&&a&&(l=!1,a.classList.remove("p-mobile-open")))}),e.addEventListener("keydown",n=>{n.key==="Escape"&&b()})}function b(){p.querySelectorAll(".p-menubar-item.p-active").forEach(e=>e.classList.remove("p-active"))}function $(e,r){let a=r.split(".").map(Number),t={items:e};for(let n of a){if(!t.items||!t.items[n])return null;t=t.items[n]}return t}function c(e,r){let a=document.createElement("div"),t={success:"#10b981",error:"#ef4444",warn:"#f59e0b",info:"#3b82f6"};a.style.cssText=`
            position: fixed;
            bottom: 2rem;
            right: 2rem;
            background: ${t[r]||"#3b82f6"};
            color: #ffffff;
            padding: 0.75rem 1.25rem;
            border-radius: 8px;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.2);
            font-size: 0.875rem;
            font-weight: 600;
            z-index: 9999;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            animation: slideIn 0.2s ease;
        `,a.textContent=`\u2713 ${e}`,document.body.appendChild(a),setTimeout(()=>a.remove(),2500)}p.innerHTML=M();let L=p.querySelector(".p-menubar");S(L)}export{H as default};
