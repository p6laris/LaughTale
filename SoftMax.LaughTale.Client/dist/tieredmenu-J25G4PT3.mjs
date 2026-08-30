import{b as v}from"./chunk-P6B5FGGY.mjs";import{e as k}from"./chunk-3YU53HBK.mjs";var q=`
/* ==========================================================================
   PrimeVue 4 Aura TieredMenu Component Tokens & Layout
   ========================================================================== */
.p-tieredmenu {
    display: inline-block;
    min-width: 14rem;
    background: var(--p-tieredmenu-background, var(--p-surface-0, #ffffff));
    border: 1px solid var(--p-tieredmenu-border-color, var(--p-border-color, #e2e8f0));
    border-radius: var(--p-tieredmenu-border-radius, var(--p-border-radius, 8px));
    color: var(--p-tieredmenu-color, var(--p-text-color, #0f172a));
    padding: var(--p-tieredmenu-list-padding, 0.25rem);
    box-shadow: var(--p-tieredmenu-shadow, 0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -2px rgba(0, 0, 0, 0.05));
    box-sizing: border-box;
    position: relative;
    font-family: var(--p-font-family, inherit);
    user-select: none;
}

.p-tieredmenu-overlay {
    position: absolute;
    z-index: 1050;
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.15), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
    animation: p-tieredmenu-pop-in 160ms cubic-bezier(0.16, 1, 0.3, 1);
    transform-origin: top left;
}

@keyframes p-tieredmenu-pop-in {
    from {
        opacity: 0;
        transform: scale(0.96) translateY(-4px);
    }
    to {
        opacity: 1;
        transform: scale(1) translateY(0);
    }
}

.p-tieredmenu-root-list,
.p-tieredmenu-submenu {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: var(--p-tieredmenu-list-gap, 2px);
    box-sizing: border-box;
}

.p-tieredmenu-item {
    position: relative;
    list-style: none;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

.p-tieredmenu-item-content {
    display: block;
    box-sizing: border-box;
}

.p-tieredmenu-item-link {
    display: flex;
    align-items: center;
    gap: var(--p-tieredmenu-item-gap, 0.5rem);
    padding: var(--p-tieredmenu-item-padding, 0.45rem 0.75rem);
    border-radius: var(--p-tieredmenu-item-border-radius, var(--p-border-radius, 6px));
    color: var(--p-tieredmenu-item-color, var(--p-text-color, #0f172a));
    text-decoration: none;
    cursor: pointer;
    font-size: var(--p-tieredmenu-item-label-font-size, 0.875rem);
    font-weight: var(--p-tieredmenu-item-label-font-weight, 500);
    transition: background-color 120ms ease, color 120ms ease;
    box-sizing: border-box;
    white-space: nowrap;
    outline: none;
    user-select: none;
}

.p-tieredmenu-item-link:hover,
.p-tieredmenu-item-link:focus-visible,
.p-tieredmenu-item.p-active > .p-tieredmenu-item-content > .p-tieredmenu-item-link {
    background: var(--p-tieredmenu-item-focus-background, var(--p-surface-100, #f1f5f9));
    color: var(--p-tieredmenu-item-focus-color, var(--p-text-color, #0f172a));
}

.p-tieredmenu-item.p-disabled > .p-tieredmenu-item-content > .p-tieredmenu-item-link {
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
}

.p-tieredmenu-item-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: var(--p-tieredmenu-item-icon-size, 1rem);
    height: var(--p-tieredmenu-item-icon-size, 1rem);
    flex-shrink: 0;
    color: var(--p-tieredmenu-item-icon-color, var(--p-surface-500, #64748b));
    transition: color 120ms ease;
}

.p-tieredmenu-item-link:hover .p-tieredmenu-item-icon,
.p-tieredmenu-item.p-active > .p-tieredmenu-item-content > .p-tieredmenu-item-link .p-tieredmenu-item-icon {
    color: var(--p-tieredmenu-item-icon-focus-color, var(--p-surface-700, #334155));
}

.p-tieredmenu-item-label {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.p-tieredmenu-badge {
    margin-left: auto;
    font-size: 0.6875rem;
    font-weight: 700;
    padding: 0.1rem 0.4rem;
    border-radius: 9999px;
    background: var(--p-surface-200, #e2e8f0);
    color: var(--p-surface-700, #334155);
    flex-shrink: 0;
}

.p-tieredmenu-shortcut {
    margin-left: auto;
    font-size: 0.75rem;
    font-weight: 500;
    padding: 0.1rem 0.35rem;
    border-radius: var(--p-border-radius, 4px);
    background: var(--p-surface-100, #f1f5f9);
    border: 1px solid var(--p-border-color, #e2e8f0);
    color: var(--p-text-muted, #64748b);
    font-family: inherit;
    flex-shrink: 0;
}

.p-tieredmenu-submenu-icon {
    margin-left: auto;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: var(--p-tieredmenu-submenu-icon-size, 0.875rem);
    height: var(--p-tieredmenu-submenu-icon-size, 0.875rem);
    color: var(--p-tieredmenu-submenu-icon-color, var(--p-surface-400, #94a3b8));
    flex-shrink: 0;
    transition: transform 120ms ease;
}

.p-tieredmenu-separator {
    height: 1px;
    background: var(--p-tieredmenu-separator-border-color, var(--p-border-color, #e2e8f0));
    margin: 0.25rem 0;
    list-style: none;
    box-sizing: border-box;
}

/* Submenu Overlay Positioning & Animation */
.p-tieredmenu-submenu {
    position: absolute;
    top: 0;
    left: 100%;
    margin-left: 0.25rem;
    min-width: 14rem;
    background: var(--p-tieredmenu-background, var(--p-surface-0, #ffffff));
    border: 1px solid var(--p-tieredmenu-border-color, var(--p-border-color, #e2e8f0));
    border-radius: var(--p-tieredmenu-border-radius, var(--p-border-radius, 8px));
    padding: var(--p-tieredmenu-list-padding, 0.25rem);
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.12), 0 8px 10px -6px rgba(0, 0, 0, 0.08);
    z-index: 1051;
    animation: p-tieredmenu-flyout-enter 160ms cubic-bezier(0.16, 1, 0.3, 1);
    transform-origin: top left;
}

.p-tieredmenu-submenu.p-flipped-left {
    left: auto;
    right: 100%;
    margin-left: 0;
    margin-right: 0.25rem;
    transform-origin: top right;
}

@keyframes p-tieredmenu-flyout-enter {
    from {
        opacity: 0;
        transform: scale(0.96) translateX(-4px);
    }
    to {
        opacity: 1;
        transform: scale(1) translateX(0);
    }
}

/* Dark Mode Theme Tokens */
.dark .p-tieredmenu,
[data-theme="dark"] .p-tieredmenu {
    background: var(--p-surface-900, #0f172a);
    border-color: var(--p-surface-700, #334155);
    color: var(--p-surface-100, #f8fafc);
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5);
}

.dark .p-tieredmenu-submenu,
[data-theme="dark"] .p-tieredmenu-submenu {
    background: var(--p-surface-900, #0f172a);
    border-color: var(--p-surface-700, #334155);
    color: var(--p-surface-100, #f8fafc);
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5);
}

.dark .p-tieredmenu-item-link:hover,
.dark .p-tieredmenu-item-link:focus-visible,
.dark .p-tieredmenu-item.p-active > .p-tieredmenu-item-content > .p-tieredmenu-item-link,
[data-theme="dark"] .p-tieredmenu-item-link:hover,
[data-theme="dark"] .p-tieredmenu-item-link:focus-visible,
[data-theme="dark"] .p-tieredmenu-item.p-active > .p-tieredmenu-item-content > .p-tieredmenu-item-link {
    background: var(--p-surface-800, #1e293b);
    color: var(--p-surface-0, #ffffff);
}

.dark .p-tieredmenu-separator,
[data-theme="dark"] .p-tieredmenu-separator {
    background: var(--p-surface-800, #1e293b);
}

.dark .p-tieredmenu-shortcut,
[data-theme="dark"] .p-tieredmenu-shortcut {
    background: var(--p-surface-800, #1e293b);
    border-color: var(--p-surface-700, #334155);
    color: var(--p-surface-300, #cbd5e1);
}

.dark .p-tieredmenu-badge,
[data-theme="dark"] .p-tieredmenu-badge {
    background: var(--p-surface-800, #1e293b);
    color: var(--p-surface-300, #cbd5e1);
}
`;function z(m,p){k("tieredmenu",q);let E=p.model||p.items||[],f=p.popup===!0,b=!f;function h(r){if(!r)return"";if(r.startsWith("<svg"))return r;let t={"pi-file":"file","pi-file-edit":"fileEdit","pi-folder-open":"folderOpen","pi-image":"image","pi-plus":"plus","pi-print":"print","pi-search":"search","pi-share-alt":"share2","pi-slack":"slack","pi-times":"trash2","pi-video":"video","pi-whatsapp":"phone","pi-copy":"copy","pi-cloud":"cloud","pi-cloud-download":"cloudDownload","pi-cloud-upload":"cloudUpload","pi-palette":"palette","pi-link":"link","pi-home":"home"}[r]||r;return v[t]?v[t]:""}let w='<svg class="p-tieredmenu-submenu-icon" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>';function y(r,a=0){return r.map((t,d)=>{if(t.Separator||t.separator)return'<li class="p-tieredmenu-separator" role="separator"></li>';let u=t.Label||t.label||"",e=t.Icon||t.icon||"",i=h(e),n=t.Disabled||t.disabled||!1,s=t.Items||t.items||[],o=Array.isArray(s)&&s.length>0,c=t.Shortcut||t.shortcut||"",l=t.Badge||t.badge||"",g=t.Url||t.url||t.Route||t.route||"",x=t.Command||t.command||"",S=o?`<ul class="p-tieredmenu-submenu" role="menu" style="display: none;">${y(s,a+1)}</ul>`:"",H=l?`<span class="p-tieredmenu-badge aura-tag tag-emerald">${l}</span>`:"",A=c?`<span class="p-tieredmenu-shortcut">${c}</span>`:"",$=o?w:"",I=['class="p-tieredmenu-item-link"','role="menuitem"',`tabindex="${n?-1:0}"`,o?'aria-haspopup="true" aria-expanded="false"':"",g?`href="${g}"`:'href="javascript:void(0)"',x?`data-command="${x}"`:"",`data-item-label="${u}"`,t.Target||t.target?`target="${t.Target||t.target}"`:""].filter(Boolean).join(" ");return`
                <li class="p-tieredmenu-item ${n?"p-disabled":""}" role="none" data-level="${a}">
                    <div class="p-tieredmenu-item-content">
                        <a ${I}>
                            ${i?`<span class="p-tieredmenu-item-icon">${i}</span>`:""}
                            <span class="p-tieredmenu-item-label">${u}</span>
                            ${H}
                            ${A}
                            ${$}
                        </a>
                    </div>
                    ${S}
                </li>
            `}).join("")}function L(){let a=`
            <div class="${["p-tieredmenu",f?"p-tieredmenu-overlay":"",p.class||""].filter(Boolean).join(" ")}" ${f?'style="display: none;"':""} data-tieredmenu-root role="menubar" aria-orientation="vertical">
                <ul class="p-tieredmenu-root-list" role="menubar">
                    ${y(E)}
                </ul>
            </div>
        `;if(f&&p.triggerText){let t=p.triggerVariant||"outlined",d=p.triggerSeverity||"primary",u=p.triggerIcon?h(p.triggerIcon):"";return`
                <div class="p-tieredmenu-wrapper" style="position: relative; display: inline-block;">
                    <button type="button" class="p-button p-button-${d} ${t==="outlined"?"p-button-outlined":""}" data-tieredmenu-trigger aria-haspopup="true" aria-expanded="false">
                        ${u?`<span class="p-button-icon">${u}</span>`:""}
                        <span class="p-button-label">${p.triggerText}</span>
                    </button>
                    ${a}
                </div>
            `}return a}function T(){let r=m.querySelector("[data-tieredmenu-root]");if(!r)return;if(f){let e=m.querySelector("[data-tieredmenu-trigger]")||(p.triggerId?document.getElementById(p.triggerId):null),i=n=>{if(b=!b,b){r.style.display="block",e?.setAttribute("aria-expanded","true");let s=n.getBoundingClientRect(),o=r.offsetParent?r.offsetParent.getBoundingClientRect():{left:0,top:0};r.style.top=`${s.bottom-o.top+4}px`,r.style.left=`${s.left-o.left}px`}else r.style.display="none",e?.setAttribute("aria-expanded","false"),t(r)};e&&e.addEventListener("click",n=>{n.stopPropagation(),i(e)}),m.toggle=n=>{let s=n?.currentTarget||e||m;i(s)},document.addEventListener("click",n=>{b&&!r.contains(n.target)&&(!e||!e.contains(n.target))&&(b=!1,r.style.display="none",e?.setAttribute("aria-expanded","false"),t(r))})}let a=new Map;function t(e){e.querySelectorAll(".p-tieredmenu-submenu").forEach(i=>{i.style.display="none",i.classList.remove("p-flipped-left"),i.parentElement?.querySelector(".p-tieredmenu-item-link")?.setAttribute("aria-expanded","false")}),e.querySelectorAll(".p-tieredmenu-item.p-active").forEach(i=>{i.classList.remove("p-active")})}function d(e){let i=e.querySelector(":scope > .p-tieredmenu-submenu");if(!i)return;let n=e.parentElement;n&&n.querySelectorAll(":scope > .p-tieredmenu-item").forEach(o=>{if(o!==e){o.classList.remove("p-active");let c=o.querySelector(":scope > .p-tieredmenu-submenu");c&&(c.style.display="none",c.classList.remove("p-flipped-left"),o.querySelector(".p-tieredmenu-item-link")?.setAttribute("aria-expanded","false"))}}),e.classList.add("p-active"),i.style.display="block",e.querySelector(".p-tieredmenu-item-link")?.setAttribute("aria-expanded","true"),i.getBoundingClientRect().right>window.innerWidth-8?i.classList.add("p-flipped-left"):i.classList.remove("p-flipped-left")}function u(e){let i=window.setTimeout(()=>{e.classList.remove("p-active");let n=e.querySelector(":scope > .p-tieredmenu-submenu");n&&(n.style.display="none",n.classList.remove("p-flipped-left"),e.querySelector(".p-tieredmenu-item-link")?.setAttribute("aria-expanded","false"))},120);a.set(e,i)}m.querySelectorAll(".p-tieredmenu-item").forEach(e=>{let i=e.querySelector(":scope > .p-tieredmenu-submenu")!==null;e.addEventListener("mouseenter",()=>{if(a.has(e)&&(clearTimeout(a.get(e)),a.delete(e)),i)d(e);else{let n=e.parentElement;n&&n.querySelectorAll(":scope > .p-tieredmenu-item").forEach(s=>{if(s!==e){s.classList.remove("p-active");let o=s.querySelector(":scope > .p-tieredmenu-submenu");o&&(o.style.display="none",o.classList.remove("p-flipped-left"))}})}}),e.addEventListener("mouseleave",()=>{i&&u(e)})}),m.querySelectorAll(".p-tieredmenu-item-link").forEach(e=>{e.addEventListener("click",i=>{let n=e.closest(".p-tieredmenu-item");if(n?.querySelector(":scope > .p-tieredmenu-submenu")!==null){i.preventDefault(),d(n);return}let o=e.getAttribute("data-command"),c=e.getAttribute("data-item-label"),l=e.getAttribute("href");o&&M(o,c||""),m.dispatchEvent(new CustomEvent("tieredmenu:select",{bubbles:!0,detail:{label:c,command:o,href:l}})),f&&(b=!1,r.style.display="none"),t(r)})}),r.addEventListener("keydown",e=>{let i=document.activeElement;if(!i||!r.contains(i))return;let n=i.closest(".p-tieredmenu-item");if(!n)return;let s=n.parentElement,o=Array.from(s.querySelectorAll(":scope > .p-tieredmenu-item:not(.p-disabled)")),c=o.indexOf(n);switch(e.key){case"ArrowDown":{e.preventDefault();let l=(c+1)%o.length;o[l]?.querySelector(".p-tieredmenu-item-link")?.focus();break}case"ArrowUp":{e.preventDefault();let l=(c-1+o.length)%o.length;o[l]?.querySelector(".p-tieredmenu-item-link")?.focus();break}case"ArrowRight":{let l=n.querySelector(":scope > .p-tieredmenu-submenu");l&&(e.preventDefault(),d(n),l.querySelector(".p-tieredmenu-item:not(.p-disabled) .p-tieredmenu-item-link")?.focus());break}case"ArrowLeft":{let l=n.closest(".p-tieredmenu-submenu");if(l){e.preventDefault();let g=l.closest(".p-tieredmenu-item");l.style.display="none",g?.querySelector(".p-tieredmenu-item-link")?.focus()}break}case"Enter":case" ":{e.preventDefault(),i.click();break}case"Escape":{e.preventDefault(),f&&(b=!1,r.style.display="none"),t(r);break}case"Home":{e.preventDefault(),o[0]?.querySelector(".p-tieredmenu-item-link")?.focus();break}case"End":{e.preventDefault(),o[o.length-1]?.querySelector(".p-tieredmenu-item-link")?.focus();break}}})}function M(r,a){let t="info",d=a,u=`Action triggered for ${a}`;r.includes("file_created")||r.includes("success")||a==="New"?(t="success",d="Success",u="File created"):r.includes("printer")||r.includes("error")||a==="Print"?(t="error",d="Error",u="No printer connected"):r.includes("search")||r.includes("warn")||a==="Search"?(t="warn",d="Search Results",u="No results found"):r.includes("download")||a==="Import"?(t="info",d="Downloads",u="Downloaded from cloud"):(r.includes("upload")||a==="Export")&&(t="info",d="Shared",u="Exported to cloud"),window.dispatchEvent(new CustomEvent("toast:show",{detail:{severity:t,summary:d,detail:u,life:3e3}}))}m.innerHTML=L(),T()}export{z as default};
