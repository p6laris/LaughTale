import{b as M}from"./chunk-P6B5FGGY.mjs";import{e as A}from"./chunk-3YU53HBK.mjs";var P=`
.p-menu {
    display: inline-flex;
    flex-direction: column;
    background: var(--p-menu-background, var(--p-surface-0, #ffffff));
    color: var(--p-menu-color, var(--p-text-color, #0f172a));
    border: 1px solid var(--p-menu-border-color, var(--p-border-color, #e2e8f0));
    border-radius: var(--p-menu-border-radius, var(--p-border-radius, 8px));
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05);
    min-width: 12.5rem;
    box-sizing: border-box;
    font-family: inherit;
    user-select: none;
    overflow: hidden;
}

.p-menu-popup-overlay {
    position: fixed;
    z-index: 1050;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.12), 0 4px 6px -4px rgba(0, 0, 0, 0.08);
    animation: p-menu-fade-in 0.15s cubic-bezier(0, 0, 0.2, 1);
}

@keyframes p-menu-fade-in {
    from {
        opacity: 0;
        transform: scale(0.95);
    }
    to {
        opacity: 1;
        transform: scale(1);
    }
}

.p-menu-start {
    border-bottom: 1px solid var(--p-menu-border-color, var(--p-border-color, #e2e8f0));
    box-sizing: border-box;
}

.p-menu-end {
    border-top: 1px solid var(--p-menu-border-color, var(--p-border-color, #e2e8f0));
    box-sizing: border-box;
}

.p-menu-list {
    list-style: none;
    margin: 0;
    padding: 0.375rem;
    display: flex;
    flex-direction: column;
    gap: 0.125rem;
    box-sizing: border-box;
}

.p-menu-submenu-wrapper {
    display: grid;
    grid-template-rows: 0fr;
    transition: grid-template-rows 220ms cubic-bezier(0.4, 0, 0.2, 1), opacity 180ms ease, visibility 220ms ease;
    opacity: 0;
    visibility: hidden;
}

.p-menu-submenu-wrapper.p-expanded {
    grid-template-rows: 1fr;
    opacity: 1;
    visibility: visible;
}

.p-menu-submenu-inner {
    overflow: hidden;
    min-height: 0;
}

.p-menu-submenu-list {
    list-style: none;
    margin: 0;
    padding: 0.125rem 0 0.125rem 1.25rem;
    display: flex;
    flex-direction: column;
    gap: 0.125rem;
    box-sizing: border-box;
}

.p-menu-submenu-label {
    font-size: 0.75rem;
    font-weight: 700;
    color: var(--p-surface-400, #94a3b8);
    padding: 0.5rem 0.75rem 0.25rem;
    text-transform: none;
    letter-spacing: normal;
    user-select: none;
}

.p-menu-separator {
    height: 1px;
    background: var(--p-menu-separator-border-color, var(--p-border-color, #e2e8f0));
    margin: 0.25rem 0;
    list-style: none;
    padding: 0;
}

.p-menu-item {
    list-style: none;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

.p-menu-item-content {
    display: block;
    box-sizing: border-box;
}

.p-menu-item-link {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.45rem 0.65rem;
    color: var(--p-menu-item-color, var(--p-text-color, #0f172a));
    border-radius: var(--p-border-radius, 6px);
    text-decoration: none;
    cursor: pointer;
    font-size: 0.875rem;
    font-weight: 500;
    transition: background-color 0.12s ease, color 0.12s ease;
    outline: none;
    box-sizing: border-box;
}

.p-menu-item-link:hover,
.p-menu-item-link.p-focus {
    background: var(--p-surface-100, #f1f5f9);
    color: var(--p-text-color, #0f172a);
}

.p-menu-item.p-disabled > .p-menu-item-content > .p-menu-item-link {
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
}

.p-menu-item-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: var(--p-surface-500, #64748b);
    width: 1.125rem;
    height: 1.125rem;
    flex-shrink: 0;
}

.p-menu-item-label {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.p-menu-item-shortcut {
    margin-left: auto;
    font-size: 0.75rem;
    color: var(--p-surface-500, #64748b);
    background: var(--p-surface-100, #f1f5f9);
    border: 1px solid var(--p-border-color, #cbd5e1);
    border-radius: 4px;
    padding: 0.1rem 0.35rem;
    font-weight: 500;
}

.p-menu-item-badge {
    margin-left: auto;
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
}

.p-menu-item-submenu-icon {
    margin-left: auto;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: var(--p-surface-400, #94a3b8);
    transition: transform 220ms cubic-bezier(0.4, 0, 0.2, 1);
}

.p-menu-item-submenu-icon.p-expanded {
    transform: rotate(180deg);
}

/* Indicators */
.p-menu-check-icon {
    width: 1rem;
    height: 1rem;
    color: var(--p-primary-500, #10b981);
    display: inline-flex;
    align-items: center;
    justify-content: center;
}

.p-menu-dot-icon {
    width: 0.375rem;
    height: 0.375rem;
    border-radius: 9999px;
    background: var(--p-surface-900, #0f172a);
    display: inline-block;
    margin: 0.3125rem;
}

.p-menu-blank-icon {
    width: 1rem;
    height: 1rem;
    display: inline-block;
}

/* Dark Mode */
.dark .p-menu,
[data-theme="dark"] .p-menu {
    background: var(--p-surface-900, #0f172a);
    color: var(--p-surface-0, #f8fafc);
    border-color: var(--p-surface-700, #334155);
}

.dark .p-menu-start,
[data-theme="dark"] .p-menu-start,
.dark .p-menu-end,
[data-theme="dark"] .p-menu-end,
.dark .p-menu-separator,
[data-theme="dark"] .p-menu-separator {
    border-color: var(--p-surface-700, #334155);
}

.dark .p-menu-item-link,
[data-theme="dark"] .p-menu-item-link {
    color: var(--p-surface-100, #f1f5f9);
}

.dark .p-menu-item-link:hover,
[data-theme="dark"] .p-menu-item-link:hover {
    background: var(--p-surface-800, #1e293b);
    color: var(--p-surface-0, #f8fafc);
}

.dark .p-menu-item-shortcut,
[data-theme="dark"] .p-menu-item-shortcut {
    background: var(--p-surface-800, #1e293b);
    border-color: var(--p-surface-700, #334155);
    color: var(--p-surface-300, #cbd5e1);
}

.dark .p-menu-item-badge,
[data-theme="dark"] .p-menu-item-badge {
    background: #ffffff;
    color: #000000;
}

.dark .p-menu-submenu-label,
[data-theme="dark"] .p-menu-submenu-label {
    color: var(--p-surface-400, #94a3b8);
}

.dark .p-menu-dot-icon,
[data-theme="dark"] .p-menu-dot-icon {
    background: var(--p-surface-0, #f8fafc);
}
`;function R(d,s){A("menu",P);let u=s.popup||s.Popup||!1,p={...s.expandedKeys||s.ExpandedKeys||{}},b=s.customTemplate||s.CustomTemplate||!1;function S(n){return Array.isArray(n)?n.map(e=>{let r=e.items||e.Items;return{label:e.label||e.Label||"",icon:e.icon||e.Icon,separator:e.separator||e.Separator||!1,disabled:e.disabled||e.Disabled||!1,url:e.url||e.Url,action:e.action||e.Action,items:Array.isArray(r)?S(r):void 0,key:e.key||e.Key,shortcut:e.shortcut||e.Shortcut,badge:e.badge||e.Badge,route:e.route||e.Route,target:e.target||e.Target,toggleable:e.toggleable!==void 0?e.toggleable:e.Toggleable!==void 0?e.Toggleable:void 0,linkClass:e.linkClass||e.LinkClass,command:e.command||e.Command,checked:e.checked!==void 0?e.checked:e.Checked,radioGroup:e.radioGroup||e.RadioGroup,radioSelected:e.radioSelected!==void 0?e.radioSelected:e.RadioSelected}}):[]}let z=s.model||s.items||s.Model||s.Items||[],h=S(z),i=null,x=!1;function D(n){return n?n.startsWith("<svg")?n:M[n]?M[n]:"":""}function v(n,e,r=0){if(n.separator)return'<li class="p-menu-separator" role="separator"></li>';let t=Array.isArray(n.items)&&n.items.length>0,a=t&&(n.toggleable===!0||r>0&&n.toggleable!==!1);if(t&&!a){let l=n.items.map((q,G)=>v(q,`${e}.${G}`,r+1)).join("");return`
                <li class="p-menu-item" role="none">
                    <div class="${b?"text-primary font-bold text-sm":"p-menu-submenu-label"}" style="${b?"color: var(--p-primary-500, #3b82f6); font-weight: 700; font-size: 0.8125rem; padding: 0.5rem 0.75rem 0.25rem;":""}">${n.label}</div>
                    <ul class="p-menu-list" role="group">
                        ${l}
                    </ul>
                </li>
            `}let o=a?n.key?!!p[n.key]:!!p[e]:!1,f="";if(n.checked!==void 0)f=n.checked?'<span class="p-menu-item-icon p-menu-check-icon"><svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg></span>':'<span class="p-menu-item-icon p-menu-blank-icon"></span>';else if(n.radioSelected!==void 0)f=n.radioSelected?'<span class="p-menu-item-icon"><span class="p-menu-dot-icon"></span></span>':'<span class="p-menu-item-icon p-menu-blank-icon"></span>';else if(n.icon){let l=D(n.icon);l&&(f=`<span class="p-menu-item-icon">${l}</span>`)}let T='<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>',m="";if(t){let l=n.items.map((H,I)=>v(H,`${e}.${I}`,r+1)).join("");m=`
                <div class="p-menu-submenu-wrapper ${o?"p-expanded":""}" role="region">
                    <div class="p-menu-submenu-inner">
                        <ul class="p-menu-submenu-list" role="group">${l}</ul>
                    </div>
                </div>
            `}let g="";return n.linkClass&&n.linkClass.includes("text-red")&&(g="color: #ef4444 !important;"),`
            <li class="p-menu-item ${n.disabled?"p-disabled":""}" role="none" data-path="${e}" data-key="${n.key||""}">
                <div class="p-menu-item-content">
                    <a class="p-menu-item-link" style="${g}" role="menuitem" tabindex="-1" href="${n.url||n.route||"#"}" ${n.target?`target="${n.target}"`:""}>
                        ${f}
                        <span class="p-menu-item-label">${n.label}</span>
                        ${n.badge!==void 0?`<span class="p-menu-item-badge">${n.badge}</span>`:""}
                        ${n.shortcut?`<span class="p-menu-item-shortcut">${n.shortcut}</span>`:""}
                        ${a?`<span class="p-menu-item-submenu-icon ${o?"p-expanded":""}">${T}</span>`:""}
                    </a>
                </div>
                ${m}
            </li>
        `}function k(){let n=h.map((c,o)=>v(c,`${o}`,0)).join(""),e="";b&&(e=`
                <div class="p-menu-start" style="padding: 0.65rem 0.85rem; display: flex; align-items: center; gap: 0.65rem;">
                    <span style="display: inline-flex; align-items: center; justify-content: center; width: 1.75rem; height: 1.75rem; background: var(--p-primary-500, #3b82f6); border-radius: 6px; color: #fff;">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2 2 7l10 5 10-5-10-5Z"/><path d="m2 17 10 5 10-5"/><path d="m2 12 10 5 10-5"/></svg>
                    </span>
                    <span style="font-weight: 700; font-size: 0.9375rem; letter-spacing: -0.01em;">PRIME<span style="color: var(--p-primary-500, #3b82f6);">APP</span></span>
                </div>
            `);let r="";b&&(r=`
                <div class="p-menu-end" style="padding: 0.5rem 0.75rem;">
                    <button type="button" class="p-menu-item-link" style="width: 100%; border: none; background: transparent; padding: 0.4rem 0.5rem; display: flex; align-items: center; gap: 0.65rem; border-radius: 6px; cursor: pointer;">
                        <span style="width: 2rem; height: 2rem; border-radius: 9999px; background: linear-gradient(135deg, #f59e0b, #ef4444); color: #fff; display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 700;">AE</span>
                        <span style="display: flex; flex-direction: column; align-items: flex-start; line-height: 1.2;">
                            <span style="font-size: 0.8125rem; font-weight: 700; color: var(--p-text-color);">Amy Elsner</span>
                            <span style="font-size: 0.7rem; color: var(--p-surface-500);">Admin</span>
                        </span>
                    </button>
                </div>
            `);let t=s.class||s.Class||"",a=s.style||s.Style||"";return`
            <div class="p-menu p-component ${u?"p-menu-popup-overlay":""} ${t}" style="${a}" role="menu" tabindex="0">
                ${e}
                <ul class="p-menu-list" role="menubar">
                    ${n}
                </ul>
                ${r}
            </div>
        `}function w(n){n.querySelectorAll(".p-menu-item").forEach(e=>{let r=e.querySelector(":scope > .p-menu-item-content > .p-menu-item-link");r&&r.addEventListener("click",t=>{let a=e.getAttribute("data-path")||"",c=e.getAttribute("data-key"),o=C(h,a);if(!o||o.disabled)return;if(Array.isArray(o.items)&&o.items.length>0&&(o.toggleable===!0||a.includes(".")&&o.toggleable!==!1)){t.preventDefault();let m=c?!p[c]:!p[a];c?p[c]=m:p[a]=m;let g=e.querySelector(":scope > .p-menu-submenu-wrapper"),l=e.querySelector(":scope > .p-menu-item-content .p-menu-item-submenu-icon");g&&g.classList.toggle("p-expanded",m),l&&l.classList.toggle("p-expanded",m);return}if(o.checked!==void 0){t.preventDefault(),o.checked=!o.checked,E();return}if(o.radioGroup&&o.radioSelected!==void 0){t.preventDefault(),$(h,o.radioGroup,o),E();return}(o.command||o.action)&&(t.preventDefault(),o.command==="new-file"?L("File created","success"):o.command==="search"&&L("No results found","warn")),u&&y()})}),n.addEventListener("keydown",e=>{let r=n.querySelectorAll(".p-menu-item-link");if(r.length===0)return;let t=document.activeElement,a=Array.from(r).indexOf(t);e.key==="ArrowDown"?(e.preventDefault(),a=(a+1)%r.length,r[a]?.focus()):e.key==="ArrowUp"?(e.preventDefault(),a=(a-1+r.length)%r.length,r[a]?.focus()):e.key==="Home"?(e.preventDefault(),r[0]?.focus()):e.key==="End"?(e.preventDefault(),r[r.length-1]?.focus()):e.key==="Escape"&&u&&(e.preventDefault(),y())})}function $(n,e,r){n.forEach(t=>{t.radioGroup===e&&t.radioSelected!==void 0&&(t.radioSelected=t===r),t.items&&$(t.items,e,r)})}function C(n,e){let r=e.split(".").map(Number),t={items:n};for(let a of r){if(!t.items||!t.items[a])return null;t=t.items[a]}return t}function L(n,e){let r=document.createElement("div");r.style.cssText=`
            position: fixed;
            bottom: 2rem;
            right: 2rem;
            background: ${e==="success"?"#10b981":"#f59e0b"};
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
        `,r.textContent=`\u2713 ${n}`,document.body.appendChild(r),setTimeout(()=>r.remove(),2500)}function E(){if(u){if(i){i.innerHTML=k();let n=i.querySelector(".p-menu");w(n)}}else{d.innerHTML=k();let n=d.querySelector(".p-menu");w(n)}}function j(n){if(x){y();return}x=!0,i=document.createElement("div"),i.className="p-menu-popup-wrapper",i.innerHTML=k(),document.body.appendChild(i);let e=i.querySelector(".p-menu");w(e);let r=n.getBoundingClientRect();e.style.position="fixed",e.style.top=`${r.bottom+4}px`,e.style.left=`${r.left}px`,e.style.zIndex="9999";let t=a=>{i&&!i.contains(a.target)&&!n.contains(a.target)&&(y(),document.removeEventListener("click",t))};setTimeout(()=>document.addEventListener("click",t),0)}function y(){x=!1,i&&(i.remove(),i=null)}if(u){d.innerHTML="";let n=s.triggerId||s.TriggerId;if(n){let e=document.getElementById(n);e&&e.addEventListener("click",r=>{r.preventDefault(),r.stopPropagation(),j(e)})}}else E();d.__expandAll=()=>{let n=u?i:d;n&&(n.querySelectorAll(".p-menu-submenu-wrapper").forEach(e=>e.classList.add("p-expanded")),n.querySelectorAll(".p-menu-item-submenu-icon").forEach(e=>e.classList.add("p-expanded")))},d.__collapseAll=()=>{let n=u?i:d;n&&(n.querySelectorAll(".p-menu-submenu-wrapper").forEach(e=>e.classList.remove("p-expanded")),n.querySelectorAll(".p-menu-item-submenu-icon").forEach(e=>e.classList.remove("p-expanded")))}}export{R as default};
