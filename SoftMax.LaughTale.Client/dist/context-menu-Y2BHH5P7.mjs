import{a as p}from"./chunk-P6B5FGGY.mjs";import{e as h}from"./chunk-3YU53HBK.mjs";var M=`
/* ==========================================================================
   PrimeVue 4 Aura ContextMenu Component Tokens & Styles
   ========================================================================== */
.p-contextmenu {
    position: fixed;
    z-index: var(--p-contextmenu-z-index, 1200);
    min-width: 14rem;
    background: var(--p-contextmenu-background, var(--p-surface-0, #ffffff));
    color: var(--p-contextmenu-color, var(--p-surface-700, #334155));
    border: 1px solid var(--p-contextmenu-border-color, var(--p-surface-200, #e2e8f0));
    border-radius: var(--p-contextmenu-border-radius, var(--p-border-radius, 8px));
    box-shadow: var(--p-contextmenu-shadow, 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1));
    padding: var(--p-contextmenu-list-padding, 0.25rem);
    font-family: var(--p-font-family, inherit);
    box-sizing: border-box;
    display: none;
    opacity: 0;
    transform: scale(0.96);
    transform-origin: top left;
    transition: opacity 120ms cubic-bezier(0, 0, 0.2, 1), transform 120ms cubic-bezier(0, 0, 0.2, 1);
}

.p-contextmenu.p-contextmenu-active {
    display: block;
    opacity: 1;
    transform: scale(1);
}

.p-contextmenu-root-list,
.p-contextmenu-submenu {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: var(--p-contextmenu-list-gap, 2px);
}

.p-contextmenu-item {
    position: relative;
    box-sizing: border-box;
}

.p-contextmenu-item-content {
    display: flex;
    align-items: center;
    gap: var(--p-contextmenu-item-gap, 0.5rem);
    padding: var(--p-contextmenu-item-padding, 0.5rem 0.75rem);
    color: var(--p-contextmenu-item-color, var(--p-surface-700, #334155));
    border-radius: var(--p-contextmenu-item-border-radius, 6px);
    text-decoration: none;
    cursor: pointer;
    user-select: none;
    font-size: var(--p-contextmenu-item-label-font-size, 0.875rem);
    font-weight: var(--p-contextmenu-item-label-font-weight, 500);
    transition: background-color 140ms ease, color 140ms ease;
    outline: none;
}

.p-contextmenu-item-content:hover,
.p-contextmenu-item-content:focus-visible,
.p-contextmenu-item.p-contextmenu-item-active > .p-contextmenu-item-content {
    background: var(--p-contextmenu-item-focus-background, var(--p-surface-100, #f1f5f9));
    color: var(--p-contextmenu-item-focus-color, var(--p-surface-900, #0f172a));
}

.p-contextmenu-item.p-disabled > .p-contextmenu-item-content {
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
}

.p-contextmenu-item-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: var(--p-contextmenu-item-icon-color, var(--p-surface-500, #64748b));
    flex-shrink: 0;
}

.p-contextmenu-item-content:hover .p-contextmenu-item-icon,
.p-contextmenu-item.p-contextmenu-item-active > .p-contextmenu-item-content .p-contextmenu-item-icon {
    color: var(--p-contextmenu-item-icon-focus-color, var(--p-surface-900, #0f172a));
}

.p-contextmenu-item-label {
    flex: 1;
    white-space: nowrap;
}

.p-contextmenu-shortcut {
    margin-left: auto;
    font-size: 0.75rem;
    color: var(--p-text-muted, #94a3b8);
    background: var(--p-surface-100, #f1f5f9);
    border: 1px solid var(--p-surface-200, #e2e8f0);
    border-radius: 4px;
    padding: 0.1rem 0.35rem;
}

.p-contextmenu-badge {
    margin-left: auto;
    font-size: 0.75rem;
    font-weight: 700;
    border-radius: 9999px;
    padding: 0.1rem 0.45rem;
    background: var(--p-primary-color, #10b981);
    color: #ffffff;
}

.p-contextmenu-submenu-icon {
    margin-left: auto;
    color: var(--p-contextmenu-submenu-icon-color, var(--p-surface-400, #94a3b8));
    display: inline-flex;
    align-items: center;
}

.p-contextmenu-separator {
    height: 1px;
    background: var(--p-contextmenu-separator-border-color, var(--p-surface-200, #e2e8f0));
    margin: 0.25rem 0;
}

/* Submenu Flyout Overlay */
.p-contextmenu-sublist-wrapper {
    position: absolute;
    top: 0;
    left: 100%;
    min-width: 13rem;
    background: var(--p-contextmenu-background, var(--p-surface-0, #ffffff));
    border: 1px solid var(--p-contextmenu-border-color, var(--p-surface-200, #e2e8f0));
    border-radius: var(--p-contextmenu-border-radius, var(--p-border-radius, 8px));
    box-shadow: var(--p-contextmenu-shadow, 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1));
    padding: var(--p-contextmenu-list-padding, 0.25rem);
    display: none;
    z-index: 1201;
    margin-left: 2px;
}

.p-contextmenu-item:hover > .p-contextmenu-sublist-wrapper,
.p-contextmenu-item.p-contextmenu-item-active > .p-contextmenu-sublist-wrapper {
    display: block;
}

.p-contextmenu-sublist-wrapper.p-sublist-left {
    left: auto;
    right: 100%;
    margin-left: 0;
    margin-right: 2px;
}

/* Target Area Cards */
.p-contextmenu-target-box {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    max-width: 28rem;
    margin: 0 auto;
    height: 10rem;
    border-radius: var(--p-border-radius, 8px);
    border: 2px dashed var(--p-border-color, #cbd5e1);
    color: var(--p-text-muted, #64748b);
    font-size: 0.875rem;
    font-weight: 500;
    user-select: none;
    transition: border-color 200ms ease, background-color 200ms ease;
    cursor: context-menu;
}

.p-contextmenu-target-box:hover {
    border-color: var(--p-primary-color, #10b981);
    background: var(--p-surface-50, #f8fafc);
}

/* Dark Mode Tokens */
.dark .p-contextmenu,
.dark .p-contextmenu-sublist-wrapper,
[data-theme="dark"] .p-contextmenu,
[data-theme="dark"] .p-contextmenu-sublist-wrapper {
    background: var(--p-surface-900, #0f172a);
    border-color: var(--p-surface-800, #1e293b);
    color: var(--p-surface-200, #e2e8f0);
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5);
}

.dark .p-contextmenu-item-content:hover,
.dark .p-contextmenu-item.p-contextmenu-item-active > .p-contextmenu-item-content,
[data-theme="dark"] .p-contextmenu-item-content:hover,
[data-theme="dark"] .p-contextmenu-item.p-contextmenu-item-active > .p-contextmenu-item-content {
    background: var(--p-surface-800, #1e293b);
    color: var(--p-surface-0, #ffffff);
}

.dark .p-contextmenu-separator,
[data-theme="dark"] .p-contextmenu-separator {
    background: var(--p-surface-800, #1e293b);
}

.dark .p-contextmenu-shortcut,
[data-theme="dark"] .p-contextmenu-shortcut {
    background: var(--p-surface-800, #1e293b);
    border-color: var(--p-surface-700, #334155);
    color: var(--p-surface-400, #94a3b8);
}

.dark .p-contextmenu-target-box,
[data-theme="dark"] .p-contextmenu-target-box {
    border-color: var(--p-surface-700, #334155);
    color: var(--p-surface-400, #94a3b8);
}
.dark .p-contextmenu-target-box:hover,
[data-theme="dark"] .p-contextmenu-target-box:hover {
    border-color: var(--p-primary-color, #10b981);
    background: var(--p-surface-900, #0f172a);
}
`,y='<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>';function E(s,u){h("contextmenu",M);let a=u.demoType||"basic",w=u.global===!0||a==="global",l=u.model||u.items||[];l.length===0&&(a==="basic"?l=[{label:"Cut",icon:"scissors"},{label:"Copy",icon:"copy"},{label:"Paste",icon:"clipboard"},{label:"Rename",icon:"pencil"},{separator:!0},{label:"Delete",icon:"trash-2",class:"text-red-500 font-semibold"}]:a==="submenus"?l=[{label:"Copy",icon:"copy"},{label:"Share",icon:"share-2",items:[{label:"Send via email",icon:"mail"},{label:"Copy link",icon:"link"},{label:"Open in new tab",icon:"external-link"}]},{label:"Save as",icon:"download",items:[{label:"PDF",icon:"file"},{label:"Image",icon:"file-image",items:[{label:"PNG"},{label:"JPG"},{label:"WebP"},{label:"SVG"}]},{label:"ZIP archive",icon:"folder"}]},{separator:!0},{label:"Delete",icon:"trash-2",class:"text-red-500 font-semibold"}]:a==="global"?l=[{label:"Back",icon:"home"},{label:"Reload",icon:"refresh-cw"},{separator:!0},{label:"Copy",icon:"copy"},{label:"Paste",icon:"clipboard"},{separator:!0},{label:"View",icon:"folder",items:[{label:"Zoom In",icon:"zoom-in"},{label:"Zoom Out",icon:"zoom-out"},{label:"Page Source",icon:"code"}]},{separator:!0},{label:"Open Link",icon:"external-link"},{label:"Print",icon:"printer"},{label:"Inspect",icon:"help-circle"}]:a==="template"?l=[{label:"Favorite",icon:"star",shortcut:"\u2318+D"},{label:"Add",icon:"shopping-cart",shortcut:"\u2318+A"},{separator:!0},{label:"Share",icon:"share-2",items:[{label:"Whatsapp",icon:"message-circle",badge:"2"},{label:"Instagram",icon:"instagram",badge:"3"}]}]:a==="command"?l=[{label:"Roles",icon:"users",items:[{label:"Admin",roleValue:"Admin"},{label:"Member",roleValue:"Member"},{label:"Guest",roleValue:"Guest"}]},{label:"Invite",icon:"user-plus"}]:a==="router"&&(l=[{label:"Router Link",icon:"palette",route:"/enterprise#sec-contextmenu"},{label:"Programmatic",icon:"link"},{label:"External",icon:"home",url:"https://github.com/SoftMax-Official/SoftMax.LaughTale"}]));function k(){return a==="template"?`
                <div class="flex justify-center" style="width: 100%;">
                    <ul class="p-contextmenu-product-list" style="margin: 0 auto; list-style: none; border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius); padding: 0.75rem; display: flex; flex-direction: column; gap: 0.5rem; width: 100%; max-width: 32rem; background: var(--p-surface-0);">
                        ${[{id:"1000",name:"Bamboo Watch",category:"Accessories",price:65,image:"bamboo-watch.jpg"},{id:"1001",name:"Black Watch",category:"Accessories",price:72,image:"black-watch.jpg"},{id:"1002",name:"Blue Band",category:"Fitness",price:79,image:"blue-band.jpg"},{id:"1003",name:"Blue T-Shirt",category:"Clothing",price:29,image:"blue-t-shirt.jpg"},{id:"1004",name:"Bracelet",category:"Accessories",price:15,image:"bracelet.jpg"}].map(e=>`
                            <li class="p-contextmenu-product-item" data-product-id="${e.id}" style="padding: 0.5rem; border-radius: var(--p-border-radius); border: 2px solid transparent; transition: all 180ms ease; cursor: context-menu;">
                                <div style="display: flex; align-items: center; gap: 1rem;">
                                    <div style="width: 4rem; height: 3rem; border-radius: 6px; background: var(--p-surface-100); display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 1.25rem;">
                                        ${p("package",24)}
                                    </div>
                                    <div style="flex: 1; display: flex; flex-direction: column; gap: 0.25rem;">
                                        <span style="font-weight: 700; font-size: 0.875rem; color: var(--p-text-color);">${e.name}</span>
                                        <div style="display: flex; align-items: center; gap: 0.35rem; color: var(--p-text-muted); font-size: 0.75rem;">
                                            <span>${p("tag",12)}</span>
                                            <span>${e.category}</span>
                                        </div>
                                    </div>
                                    <span style="font-weight: 700; font-size: 0.875rem; color: var(--p-text-color); margin-left: 1rem;">$${e.price}</span>
                                </div>
                            </li>
                        `).join("")}
                    </ul>
                </div>
            `:a==="command"?`
                <div class="flex justify-center" style="width: 100%;">
                    <ul class="p-contextmenu-user-list" style="margin: 0 auto; list-style: none; border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius); padding: 0.75rem; display: flex; flex-direction: column; gap: 0.5rem; width: 100%; max-width: 26rem; background: var(--p-surface-0);">
                        ${[{id:0,name:"Amy Elsner",role:"Admin",badge:"emerald"},{id:1,name:"Anna Fali",role:"Member",badge:"info"},{id:2,name:"Asiya Javayant",role:"Member",badge:"info"},{id:3,name:"Bernardo Dominic",role:"Guest",badge:"warn"},{id:4,name:"Elwin Sharvill",role:"Member",badge:"info"}].map(e=>`
                            <li class="p-contextmenu-user-item" data-user-id="${e.id}" style="padding: 0.6rem 0.75rem; border-radius: var(--p-border-radius); border: 2px solid transparent; transition: all 180ms ease; display: flex; align-items: center; justify-content: space-between; cursor: context-menu;">
                                <div style="display: flex; align-items: center; gap: 0.75rem;">
                                    <div style="width: 2rem; height: 2rem; border-radius: 9999px; background: var(--p-primary-100); color: var(--p-primary-700); font-weight: 700; font-size: 0.75rem; display: flex; align-items: center; justify-content: center;">
                                        ${e.name.split(" ").map(n=>n[0]).join("")}
                                    </div>
                                    <span style="font-weight: 600; font-size: 0.875rem; color: var(--p-text-color);">${e.name}</span>
                                </div>
                                <span class="aura-tag p-user-role-badge tag-${e.badge}">${e.role}</span>
                            </li>
                        `).join("")}
                    </ul>
                </div>
            `:a==="router"?`
                <div style="display: flex; justify-content: center; width: 100%;">
                    <div class="p-contextmenu-target-box p-contextmenu-router-target" style="width: 5rem; height: 5rem; border-radius: var(--p-border-radius); border: 2px solid var(--p-primary-color); display: flex; align-items: center; justify-content: center; cursor: context-menu;">
                        <span style="color: var(--p-primary-color);">${p("shield",36)}</span>
                    </div>
                </div>
            `:a==="global"?`
                <div style="text-align: center; padding: 2rem 1rem; width: 100%;">
                    <p style="font-size: 0.875rem; color: var(--p-text-muted); margin: 0;">Right-click anywhere on this card to view the global ContextMenu.</p>
                </div>
            `:`
            <div class="p-contextmenu-target-box" data-context-target>
                Right-click here
            </div>
        `}function $(t){return`
            <ul class="p-contextmenu-root-list" role="menubar" aria-orientation="vertical">
                ${t.map((e,n)=>{if(e.separator)return'<li class="p-contextmenu-separator" role="separator"></li>';let i=e.items&&e.items.length>0,r=e.icon?p(e.icon,16):"",d=e.class||"";return`
                        <li class="p-contextmenu-item ${e.disabled?"p-disabled":""} ${d}" role="none" data-menu-index="${n}">
                            <a class="p-contextmenu-item-content" role="menuitem" tabindex="0" ${i?'aria-haspopup="true" aria-expanded="false"':""} ${e.url?`href="${e.url}"`:""} ${e.target?`target="${e.target}"`:""} data-item-label="${e.label||""}">
                                ${r?`<span class="p-contextmenu-item-icon">${r}</span>`:""}
                                <span class="p-contextmenu-item-label">${e.label||""}</span>
                                ${e.shortcut?`<span class="p-contextmenu-shortcut">${e.shortcut}</span>`:""}
                                ${e.badge?`<span class="p-contextmenu-badge">${e.badge}</span>`:""}
                                ${i?`<span class="p-contextmenu-submenu-icon">${y}</span>`:""}
                            </a>
                            ${i?`
                                <div class="p-contextmenu-sublist-wrapper" role="menu">
                                    <ul class="p-contextmenu-submenu">
                                        ${v(e.items)}
                                    </ul>
                                </div>
                            `:""}
                        </li>
                    `}).join("")}
            </ul>
        `}function v(t){return t.map((e,n)=>{if(e.separator)return'<li class="p-contextmenu-separator" role="separator"></li>';let i=e.items&&e.items.length>0,r=e.icon?p(e.icon,16):"";return`
                <li class="p-contextmenu-item ${e.disabled?"p-disabled":""} ${e.class||""}" role="none" data-submenu-index="${n}">
                    <a class="p-contextmenu-item-content" role="menuitem" tabindex="0" ${i?'aria-haspopup="true" aria-expanded="false"':""} data-item-label="${e.label||""}">
                        ${r?`<span class="p-contextmenu-item-icon">${r}</span>`:""}
                        <span class="p-contextmenu-item-label">${e.label||""}</span>
                        ${e.shortcut?`<span class="p-contextmenu-shortcut">${e.shortcut}</span>`:""}
                        ${e.badge?`<span class="p-contextmenu-badge">${e.badge}</span>`:""}
                        ${i?`<span class="p-contextmenu-submenu-icon">${y}</span>`:""}
                    </a>
                    ${i?`
                        <div class="p-contextmenu-sublist-wrapper" role="menu">
                            <ul class="p-contextmenu-submenu">
                                ${v(e.items)}
                            </ul>
                        </div>
                    `:""}
                </li>
            `}).join("")}s.innerHTML=`
        <div class="p-contextmenu-container" style="position: relative; width: 100%;">
            ${k()}
            <div class="p-contextmenu ${u.class||""}" role="region" aria-label="${u.ariaLabel||"Context Menu"}" data-contextmenu-root>
                ${$(l)}
            </div>
        </div>
    `;let o=s.querySelector("[data-contextmenu-root]"),x=!1,c=null;function b(t,e){o.style.display="block",o.style.visibility="hidden";let n=o.getBoundingClientRect(),i=n.width||220,r=n.height||200,d=t,f=e;d+i>window.innerWidth-10&&(d=Math.max(10,window.innerWidth-i-10)),f+r>window.innerHeight-10&&(f=Math.max(10,window.innerHeight-r-10)),o.style.left=`${d}px`,o.style.top=`${f}px`,o.style.visibility="visible",requestAnimationFrame(()=>{o.classList.add("p-contextmenu-active"),x=!0}),o.querySelectorAll(".p-contextmenu-sublist-wrapper").forEach(g=>{g.getBoundingClientRect().right>window.innerWidth-10?g.classList.add("p-sublist-left"):g.classList.remove("p-sublist-left")})}function m(){x&&(o.classList.remove("p-contextmenu-active"),setTimeout(()=>{o.classList.contains("p-contextmenu-active")||(o.style.display="none")},120),x=!1,c&&(c.style.borderColor="transparent",c=null))}if(w)s.addEventListener("contextmenu",t=>{t.preventDefault(),t.stopPropagation(),b(t.clientX,t.clientY)});else if(a==="template")s.querySelectorAll(".p-contextmenu-product-item").forEach(t=>{t.addEventListener("contextmenu",e=>{e.preventDefault(),e.stopPropagation(),s.querySelectorAll(".p-contextmenu-product-item").forEach(n=>n.style.borderColor="transparent"),t.style.borderColor="var(--p-primary-color, #10b981)",c=t,b(e.clientX,e.clientY)})});else if(a==="command")s.querySelectorAll(".p-contextmenu-user-item").forEach(t=>{t.addEventListener("contextmenu",e=>{e.preventDefault(),e.stopPropagation(),s.querySelectorAll(".p-contextmenu-user-item").forEach(n=>n.style.borderColor="transparent"),t.style.borderColor="var(--p-primary-color, #10b981)",c=t,b(e.clientX,e.clientY)})});else{let t=s.querySelector("[data-context-target]")||s.querySelector(".p-contextmenu-router-target");t&&t.addEventListener("contextmenu",e=>{e.preventDefault(),e.stopPropagation(),b(e.clientX,e.clientY)})}o.querySelectorAll("[data-item-label]").forEach(t=>{t.addEventListener("click",e=>{let n=t.getAttribute("data-item-label");if(!t.closest(".p-contextmenu-item")?.querySelector(".p-contextmenu-sublist-wrapper")){if(a==="command"&&c){if(n==="Admin"||n==="Member"||n==="Guest"){let r=c.querySelector(".p-user-role-badge");r&&(r.textContent=n,r.className=`aura-tag p-user-role-badge tag-${n==="Admin"?"emerald":n==="Member"?"info":"warn"}`)}else if(n==="Invite"){let r=window.$toast||window.LaughTaleToast;r&&r.add({severity:"success",summary:"Success",detail:"Invitation sent!",life:3e3})}}s.dispatchEvent(new CustomEvent("contextmenu:select",{bubbles:!0,detail:{label:n}})),m()}})}),document.addEventListener("click",t=>{o.contains(t.target)||m()}),document.addEventListener("keydown",t=>{(t.key==="Escape"||t.key==="Tab")&&m()}),window.addEventListener("scroll",m,!0),window.addEventListener("resize",m)}export{E as default};
