import{a as A}from"./chunk-JS6MQ4UL.mjs";import{b as T}from"./chunk-P6B5FGGY.mjs";import{e as I}from"./chunk-3YU53HBK.mjs";var O=`
.p-commandmenu {
    display: flex;
    flex-direction: column;
    background: var(--p-commandmenu-background, var(--p-surface-0, #ffffff));
    border: 1px solid var(--p-commandmenu-border-color, var(--p-border-color, #e2e8f0));
    border-radius: var(--p-commandmenu-border-radius, var(--p-border-radius, 8px));
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05);
    overflow: hidden;
    width: 32rem;
    max-width: 100%;
    box-sizing: border-box;
    font-family: inherit;
    position: relative;
    outline: none;
}

.p-commandmenu-header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1rem;
    height: 3.25rem;
    background: var(--p-commandmenu-header-background, transparent);
    border-bottom: 1px solid var(--p-commandmenu-header-border-color, var(--p-border-color, #e2e8f0));
    box-sizing: border-box;
    flex-shrink: 0;
}

.p-commandmenu-search-icon {
    color: var(--p-surface-400, #94a3b8);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.p-commandmenu-input {
    flex: 1;
    border: none;
    outline: none;
    background: transparent;
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--p-commandmenu-input-color, var(--p-text-color, #0f172a));
    padding: 0.25rem 0;
    font-family: inherit;
    min-width: 0;
}

.p-commandmenu-input::placeholder {
    color: var(--p-commandmenu-input-placeholder-color, var(--p-surface-400, #94a3b8));
}

.p-commandmenu-list {
    padding: 0.5rem;
    height: 19rem;
    max-height: 19rem;
    min-height: 19rem;
    overflow-y: auto;
    overflow-x: hidden;
    scrollbar-gutter: stable;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    box-sizing: border-box;
    position: relative;
    outline: none;
}

.p-commandmenu-group {
    display: flex;
    flex-direction: column;
    gap: 0.125rem;
    position: static;
}

.p-commandmenu-group-label {
    font-size: 0.75rem;
    font-weight: 700;
    color: var(--p-surface-400, #94a3b8);
    padding: 0.35rem 0.65rem 0.2rem;
    text-transform: none;
    letter-spacing: normal;
    user-select: none;
}

.p-commandmenu-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.5rem 0.65rem;
    border-radius: var(--p-border-radius, 6px);
    cursor: pointer;
    font-size: 0.875rem;
    color: var(--p-text-color, #0f172a);
    transition: background-color 0.1s ease, color 0.1s ease;
    user-select: none;
    outline: none;
    box-sizing: border-box;
    min-height: 2.25rem;
}

.p-commandmenu-item:hover,
.p-commandmenu-item.p-commandmenu-item-focus {
    background: var(--p-surface-100, #f1f5f9) !important;
    color: var(--p-text-color, #0f172a) !important;
}

.p-commandmenu-item.p-commandmenu-item-focus {
    background: var(--p-surface-100, #f1f5f9) !important;
    color: var(--p-primary-600, #2563eb) !important;
}

.p-commandmenu-item.p-commandmenu-item-active {
    background: rgba(59, 130, 246, 0.15) !important;
}

.p-commandmenu-item-left {
    display: flex;
    align-items: center;
    gap: 0.65rem;
    min-width: 0;
    flex: 1;
}

.p-commandmenu-item-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--p-surface-500, #64748b);
    flex-shrink: 0;
}

.p-commandmenu-item-icon-badge {
    width: 1.35rem;
    height: 1.35rem;
    border-radius: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #ffffff;
    flex-shrink: 0;
    font-size: 0.75rem;
}

.p-commandmenu-item-label {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-weight: 500;
}

.p-commandmenu-item-category {
    font-size: 0.75rem;
    color: var(--p-text-muted, #94a3b8);
    margin-left: auto;
    opacity: 0.7;
    flex-shrink: 0;
}

.p-commandmenu-empty-message {
    padding: 2.5rem 1rem;
    text-align: center;
    font-size: 0.875rem;
    color: var(--p-surface-500, #64748b);
}

.p-commandmenu-footer {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: 0.625rem 1rem;
    height: 2.75rem;
    background: var(--p-commandmenu-footer-background, var(--p-surface-50, #f8fafc));
    border-top: 1px solid var(--p-commandmenu-footer-border-color, var(--p-border-color, #e2e8f0));
    flex-shrink: 0;
    box-sizing: border-box;
}

.p-commandmenu-footer-content {
    display: flex;
    align-items: center;
    gap: 0.85rem;
    font-size: 0.75rem;
    color: var(--p-surface-500, #64748b);
}

.p-commandmenu-kbd {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: var(--p-surface-100, #f1f5f9);
    border: 1px solid var(--p-border-color, #cbd5e1);
    border-radius: 4px;
    padding: 0 0.35rem;
    min-width: 1.25rem;
    height: 1.25rem;
    font-family: inherit;
    font-size: 0.7rem;
    font-weight: 600;
    color: var(--p-surface-700, #334155);
}

/* Dialog Overlay */
.p-commandmenu-dialog-backdrop {
    position: fixed;
    inset: 0;
    z-index: 9999;
    background: rgba(0, 0, 0, 0.45);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: flex-start;
    justify-content: center;
    padding-top: 14vh;
}

.p-commandmenu-dialog-card {
    width: 32rem;
    max-width: 100%;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    border-radius: var(--p-border-radius-xl, 10px);
    overflow: hidden;
}

/* Dark Mode Tokens */
.dark .p-commandmenu,
[data-theme="dark"] .p-commandmenu {
    background: var(--p-surface-900, #0f172a);
    border-color: var(--p-surface-700, #334155);
}

.dark .p-commandmenu-header,
[data-theme="dark"] .p-commandmenu-header {
    border-color: var(--p-surface-700, #334155);
}

.dark .p-commandmenu-input,
[data-theme="dark"] .p-commandmenu-input {
    color: var(--p-surface-0, #f8fafc);
}

.dark .p-commandmenu-item,
[data-theme="dark"] .p-commandmenu-item {
    color: var(--p-surface-100, #f1f5f9);
}

.dark .p-commandmenu-item:hover,
.dark .p-commandmenu-item.p-commandmenu-item-focus,
[data-theme="dark"] .p-commandmenu-item:hover,
[data-theme="dark"] .p-commandmenu-item.p-commandmenu-item-focus {
    background: var(--p-surface-800, #1e293b) !important;
    color: var(--p-surface-0, #f8fafc) !important;
}

.dark .p-commandmenu-item.p-commandmenu-item-focus,
[data-theme="dark"] .p-commandmenu-item.p-commandmenu-item-focus {
    color: #60a5fa !important;
}

.dark .p-commandmenu-group-label,
[data-theme="dark"] .p-commandmenu-group-label {
    color: var(--p-surface-400, #94a3b8);
}

.dark .p-commandmenu-footer,
[data-theme="dark"] .p-commandmenu-footer {
    background: var(--p-surface-850, #131d2e);
    border-color: var(--p-surface-700, #334155);
}

.dark .p-commandmenu-kbd,
[data-theme="dark"] .p-commandmenu-kbd {
    background: var(--p-surface-800, #1e293b);
    border-color: var(--p-surface-700, #334155);
    color: var(--p-surface-200, #e2e8f0);
}
`;function U(M,m){I("commandmenu",O);let j=m.placeholder||m.Placeholder||"Search for commands...",q=m.filter||m.Filter||"default",k=m.withDialog||m.WithDialog||!1,G=m.customTemplate||m.CustomTemplate||!1;function P(n){return Array.isArray(n)?n.map(a=>{let d=a.label||a.Label||"",s=a.items||a.Items||[],l=Array.isArray(s)?s.map(e=>({label:e.label||e.Label||"",icon:e.icon||e.Icon,category:e.category||e.Category,color:e.color||e.Color,keywords:e.keywords||e.Keywords||[],shortcut:e.shortcut||e.Shortcut,url:e.url||e.Url,action:e.action||e.Action,disabled:e.disabled||e.Disabled||!1})):[];return{label:d,items:l}}):[]}let B=m.model||m.Model||[],$=P(B),y=m.search||m.Search||"",c=0,x=!1,b=!1;function S(n,a){if(!a)return 1;let d=n.toLowerCase(),s=a.toLowerCase(),l=0,e=0,h=0;for(;l<d.length&&e<s.length;)d[l]===s[e]&&(h+=1,e++),l++;return e===s.length?h/d.length:0}function K(){let n=y.trim().toLowerCase();if(!n)return $;let a=[];return $.forEach(d=>{let s=d.items.filter(l=>{let e=(l.label||"").toLowerCase(),h=(l.keywords||[]).map(f=>f.toLowerCase()).join(" ");return q==="fuzzy"?S(e,n)>0||h&&S(h,n)>0:e.includes(n)||h.includes(n)});s.length>0&&a.push({label:d.label,items:s})}),a}function F(n){return n?n.startsWith("<svg")?n:T[n]?T[n]:"":""}function z(n){let a='<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m18 15-6-6-6 6"/></svg>',d='<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>';n.innerHTML=`
            <div class="p-commandmenu p-component" tabindex="0" ${k?'style="border: none; box-shadow: none; width: 100%;"':""}>
                <div class="p-commandmenu-header">
                    <span class="p-commandmenu-search-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                    </span>
                    <input type="text" class="p-commandmenu-input" placeholder="${j}" value="${y}" />
                </div>
                <div class="p-commandmenu-list" tabindex="-1"></div>
                <div class="p-commandmenu-footer">
                    <div class="p-commandmenu-footer-content">
                        <span style="display:inline-flex; align-items:center; gap: 0.35rem;">
                            <kbd class="p-commandmenu-kbd">${a}</kbd>
                            <kbd class="p-commandmenu-kbd">${d}</kbd>
                            Navigate
                        </span>
                        <span style="display:inline-flex; align-items:center; gap: 0.35rem;">
                            <kbd class="p-commandmenu-kbd">\u21B5</kbd>
                            Select
                        </span>
                    </div>
                </div>
            </div>
        `;let s=n.querySelector(".p-commandmenu"),l=n.querySelector(".p-commandmenu-input"),e=n.querySelector(".p-commandmenu-list");e.addEventListener("mousemove",()=>{b=!1});function h(t){let i=e.getBoundingClientRect(),o=t.getBoundingClientRect();o.top<i.top?e.scrollTop-=i.top-o.top:o.bottom>i.bottom&&(e.scrollTop+=o.bottom-i.bottom)}function f(t,i){let o=e.querySelectorAll(".p-commandmenu-item");o.length!==0&&(c=Math.max(0,Math.min(t,o.length-1)),o.forEach((g,r)=>{let p=r===c;g.classList.toggle("p-commandmenu-item-focus",p),g.setAttribute("aria-selected",p?"true":"false")}),i&&o[c]&&h(o[c]))}function E(){let t=K(),i=0,o=t.reduce((r,p)=>r+p.items.length,0);if(c>=o&&(c=Math.max(0,o-1)),o===0){let r=m.emptyMessage||m.EmptyMessage;e.innerHTML=`
                    <div class="p-commandmenu-empty-message">
                        ${r||(y?`No results found for <strong>"${y}"</strong>`:"No results found")}
                    </div>
                `;return}let g="";t.forEach(r=>{let p="";r.items.forEach(u=>{let W=i===c,L=F(u.icon),C="";if(G){let v=u.color||"background: var(--p-primary-500, #3b82f6);";C=`
                            <div class="p-commandmenu-item-left">
                                <span class="p-commandmenu-item-icon-badge" style="${v.startsWith("bg-[")||v.includes("linear-gradient")?v.startsWith("bg-[")?v.replace("bg-[","background: ").replace("]",";"):`background: ${v};`:v.startsWith("background")?v:`background: ${v};`}">
                                    ${L?`<span style="display:flex; transform:scale(0.8);">${L}</span>`:"\u26A1"}
                                </span>
                                <span class="p-commandmenu-item-label">${u.label}</span>
                                ${u.category?`<span class="p-commandmenu-item-category">${u.category}</span>`:""}
                            </div>
                        `}else C=`
                            <div class="p-commandmenu-item-left">
                                ${L?`<span class="p-commandmenu-item-icon">${L}</span>`:""}
                                <span class="p-commandmenu-item-label">${u.label}</span>
                            </div>
                        `;p+=`
                        <div class="p-commandmenu-item ${W?"p-commandmenu-item-focus":""}" 
                             data-flat-index="${i}" 
                             data-label="${u.label}"
                             data-url="${u.url||""}" 
                             data-action="${u.action||""}">
                            ${C}
                            ${u.shortcut?`<kbd class="p-commandmenu-kbd">${u.shortcut}</kbd>`:""}
                        </div>
                    `,i++}),g+=`
                    <div class="p-commandmenu-group">
                        <div class="p-commandmenu-group-label">${r.label}</div>
                        ${p}
                    </div>
                `}),e.innerHTML=g,e.querySelectorAll(".p-commandmenu-item").forEach(r=>{r.addEventListener("mousemove",()=>{b=!1}),r.addEventListener("mouseenter",()=>{if(b)return;let p=Number(r.getAttribute("data-flat-index"));f(p,!1)}),r.addEventListener("click",p=>{p.preventDefault(),b=!1;let u=Number(r.getAttribute("data-flat-index"));f(u,!1),H(),l.focus({preventScroll:!0})})}),f(c,!1)}function H(){let t=e.querySelector(`.p-commandmenu-item[data-flat-index="${c}"]`);if(!t)return;let i=t.getAttribute("data-url"),o=t.getAttribute("data-action");t.classList.add("p-commandmenu-item-active"),setTimeout(()=>t.classList.remove("p-commandmenu-item-active"),150),k&&setTimeout(()=>w(),150),i?window.location.href=i:o==="toggle-dark"&&(document.documentElement.classList.toggle("dark"),localStorage.setItem("theme",document.documentElement.classList.contains("dark")?"dark":"light"))}l.addEventListener("input",()=>{y=l.value,c=0,E()});function R(t){let o=e.querySelectorAll(".p-commandmenu-item").length;if(t.key==="ArrowDown"){if(t.preventDefault(),t.stopPropagation(),b=!0,o>0){let g=(c+1)%o;f(g,!0)}}else if(t.key==="ArrowUp"){if(t.preventDefault(),t.stopPropagation(),b=!0,o>0){let g=(c-1+o)%o;f(g,!0)}}else t.key==="Enter"?(t.preventDefault(),t.stopPropagation(),H()):t.key==="Home"?(t.preventDefault(),t.stopPropagation(),b=!0,o>0&&f(0,!0)):t.key==="End"?(t.preventDefault(),t.stopPropagation(),b=!0,o>0&&f(o-1,!0)):t.key==="Escape"&&(k?(t.preventDefault(),w()):y&&(t.preventDefault(),l.value="",y="",c=0,E()))}s.addEventListener("keydown",R),E()}function D(){if(x)return;x=!0;let n=document.createElement("div");n.className="p-commandmenu-dialog-backdrop",n.innerHTML=`
            <div class="p-commandmenu-dialog-card"></div>
        `,document.body.appendChild(n);let a=n.querySelector(".p-commandmenu-dialog-card");z(a);let d=a.querySelector(".p-commandmenu-input");d?.focus(),n.addEventListener("click",s=>{s.target===n&&w()}),A(a,{initialFocusElement:d||void 0})}function w(){x=!1;let n=document.querySelector(".p-commandmenu-dialog-backdrop");n&&n.remove()}k?(M.innerHTML=`
            <div class="p-commandmenu-dialog-trigger-wrapper" style="display: flex; align-items: center; justify-content: center; padding: 2rem 0;">
                <span class="p-commandmenu-dialog-trigger" style="cursor: pointer; font-size: 0.9375rem; color: var(--p-text-color); display: inline-flex; align-items: center;">
                    Press <kbd class="p-commandmenu-kbd" style="margin-left: 0.5rem; padding: 0.25rem 0.6rem; height: auto; font-size: 0.8125rem; font-weight: 600; background: var(--p-surface-100); border: 1px solid var(--p-border-color); border-radius: 6px;">CTRL/\u2318 + L</kbd>
                </span>
            </div>
        `,M.querySelector(".p-commandmenu-dialog-trigger")?.addEventListener("click",()=>{D()}),window.addEventListener("keydown",n=>{(n.ctrlKey||n.metaKey)&&n.key.toLowerCase()==="l"&&(n.preventDefault(),x?w():D())})):z(M)}export{U as default};
