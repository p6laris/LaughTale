import{d as P}from"./chunk-7HAKB25H.mjs";import{a as I,b as v}from"./chunk-P6B5FGGY.mjs";import{b as S}from"./chunk-4AWLBVSN.mjs";import{e as D}from"./chunk-3YU53HBK.mjs";var R=`
.p-speeddial {
    position: relative;
    display: inline-flex;
    z-index: 10;
}

.p-speeddial-button {
    position: relative;
    z-index: 2;
    cursor: pointer;
    user-select: none;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 3rem;
    height: 3rem;
    border-radius: 50%;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.15), 0 2px 4px -1px rgba(0, 0, 0, 0.1);
    transition: background-color 0.2s, border-color 0.2s, box-shadow 0.2s;
    outline: none;
}

.p-speeddial-button:focus-visible {
    outline: 2px solid var(--p-primary-500, #10b981);
    outline-offset: 2px;
}

.p-speeddial-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition: transform 300ms cubic-bezier(0.16, 1, 0.3, 1);
}

.p-speeddial-icon svg {
    width: 20px;
    height: 20px;
    stroke: currentColor;
    stroke-width: 2.2;
}

.p-speeddial.p-speeddial-opened .p-speeddial-icon.p-speeddial-rotate {
    transform: rotate(45deg);
}

.p-speeddial-list {
    margin: 0;
    padding: 0;
    list-style: none;
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: 0;
    left: 0;
    width: 3rem;
    height: 3rem;
    pointer-events: none;
    z-index: 1;
    overflow: visible;
}

.p-speeddial.p-speeddial-opened .p-speeddial-list {
    pointer-events: auto;
}

.p-speeddial-item {
    position: absolute;
    top: 50%;
    left: 50%;
    margin-top: -1.25rem;
    margin-left: -1.25rem;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transform: translate3d(0, 0, 0) scale(0);
    transition-property: transform, opacity;
    transition-duration: 300ms, 200ms;
    transition-timing-function: cubic-bezier(0.16, 1, 0.3, 1), cubic-bezier(0.16, 1, 0.3, 1);
    pointer-events: none;
    will-change: transform, opacity;
    z-index: 1;
}

.p-speeddial.p-speeddial-opened .p-speeddial-item {
    pointer-events: auto;
}

.p-speeddial-item:hover,
.p-speeddial-item:focus-within {
    z-index: 100 !important;
}

/* Action Button: Authentic Aura Slate / Surface Styling */
.p-speeddial-action {
    width: 2.5rem !important;
    height: 2.5rem !important;
    border-radius: 50% !important;
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
    text-decoration: none !important;
    border: 1px solid var(--p-surface-200, #e2e8f0) !important;
    background: var(--p-surface-0, #ffffff) !important;
    color: var(--p-surface-600, #475569) !important;
    box-shadow: 0 3px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06) !important;
    cursor: pointer !important;
    position: relative !important;
    transition: background-color 0.15s ease, color 0.15s ease, border-color 0.15s ease, transform 0.15s ease, box-shadow 0.15s ease !important;
    outline: none !important;
}

.p-speeddial-action svg {
    width: 18px !important;
    height: 18px !important;
    stroke: currentColor !important;
    stroke-width: 2 !important;
}

.p-speeddial-action:hover:not(:disabled) {
    background: var(--p-surface-100, #f1f5f9) !important;
    color: var(--p-surface-900, #0f172a) !important;
    border-color: var(--p-surface-300, #cbd5e1) !important;
    transform: scale(1.1) !important;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05) !important;
}

.p-speeddial-action:focus-visible {
    outline: 2px solid var(--p-primary-500, #10b981) !important;
    outline-offset: 2px !important;
}

.p-speeddial-action:disabled {
    opacity: 0.5 !important;
    cursor: not-allowed !important;
    pointer-events: none !important;
}

/* Custom Template Layout */
.p-speeddial-custom-item {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 0.75rem;
    cursor: pointer;
    text-decoration: none;
    white-space: nowrap;
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
}

.p-speeddial-custom-label {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 5.5rem;
    padding: 0.5rem 1rem;
    border-radius: var(--p-border-radius, 6px);
    background: var(--p-surface-0, #ffffff);
    border: 1px solid var(--p-surface-200, #e2e8f0);
    color: var(--p-surface-700, #334155);
    font-weight: 500;
    font-size: 0.875rem;
    box-shadow: 0 2px 4px rgba(0,0,0,0.06);
    transition: background-color 0.15s, color 0.15s, border-color 0.15s;
    user-select: none;
}

.p-speeddial-custom-icon {
    width: 3rem;
    height: 3rem;
    border-radius: 50%;
    background: var(--p-surface-0, #ffffff);
    border: 1px solid var(--p-surface-200, #e2e8f0);
    color: var(--p-surface-600, #475569);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 4px rgba(0,0,0,0.06);
    transition: background-color 0.15s, color 0.15s, border-color 0.15s, transform 0.15s;
    cursor: pointer;
    outline: none;
}

.p-speeddial-custom-icon svg {
    width: 20px;
    height: 20px;
    stroke: currentColor;
    stroke-width: 2;
}

.p-speeddial-custom-item:hover .p-speeddial-custom-label,
.p-speeddial-custom-item:hover .p-speeddial-custom-icon {
    background: var(--p-surface-100, #f1f5f9);
    color: var(--p-surface-900, #0f172a);
    border-color: var(--p-surface-300, #cbd5e1);
}

.p-speeddial-custom-item:hover .p-speeddial-custom-icon {
    transform: scale(1.05);
}

/* Tooltips */
.p-speeddial-tooltip {
    position: absolute;
    background: var(--p-surface-900, #0f172a);
    color: #ffffff;
    padding: 0.35rem 0.65rem;
    font-size: 0.75rem;
    font-weight: 600;
    line-height: 1;
    border-radius: var(--p-border-radius-sm, 4px);
    white-space: nowrap;
    pointer-events: none;
    z-index: 1000 !important;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3);
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.15s ease, visibility 0.15s ease, transform 0.15s ease;
}

.p-speeddial-tooltip::after {
    content: '';
    position: absolute;
    width: 0;
    height: 0;
    border-style: solid;
}

.p-speeddial-tooltip.tooltip-left {
    right: calc(100% + 8px);
    top: 50%;
    transform: translateY(-50%) scale(0.9);
}
.p-speeddial-tooltip.tooltip-left::after {
    right: -4px;
    top: 50%;
    transform: translateY(-50%);
    border-width: 4px 0 4px 4px;
    border-color: transparent transparent transparent var(--p-surface-900, #0f172a);
}
.p-speeddial-tooltip.tooltip-left.p-tooltip-visible {
    opacity: 1;
    visibility: visible;
    transform: translateY(-50%) scale(1);
}

.p-speeddial-tooltip.tooltip-right {
    left: calc(100% + 8px);
    top: 50%;
    transform: translateY(-50%) scale(0.9);
}
.p-speeddial-tooltip.tooltip-right::after {
    left: -4px;
    top: 50%;
    transform: translateY(-50%);
    border-width: 4px 4px 4px 0;
    border-color: transparent var(--p-surface-900, #0f172a) transparent transparent;
}
.p-speeddial-tooltip.tooltip-right.p-tooltip-visible {
    opacity: 1;
    visibility: visible;
    transform: translateY(-50%) scale(1);
}

.p-speeddial-tooltip.tooltip-top {
    bottom: calc(100% + 8px);
    left: 50%;
    transform: translateX(-50%) scale(0.9);
}
.p-speeddial-tooltip.tooltip-top::after {
    bottom: -4px;
    left: 50%;
    transform: translateX(-50%);
    border-width: 4px 4px 0 4px;
    border-color: var(--p-surface-900, #0f172a) transparent transparent transparent;
}
.p-speeddial-tooltip.tooltip-top.p-tooltip-visible {
    opacity: 1;
    visibility: visible;
    transform: translateX(-50%) scale(1);
}

.p-speeddial-tooltip.tooltip-bottom {
    top: calc(100% + 8px);
    left: 50%;
    transform: translateX(-50%) scale(0.9);
}
.p-speeddial-tooltip.tooltip-bottom::after {
    top: -4px;
    left: 50%;
    transform: translateX(-50%);
    border-width: 0 4px 4px 4px;
    border-color: transparent transparent var(--p-surface-900, #0f172a) transparent;
}
.p-speeddial-tooltip.tooltip-bottom.p-tooltip-visible {
    opacity: 1;
    visibility: visible;
    transform: translateX(-50%) scale(1);
}

/* Mask */
.p-speeddial-mask {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.4);
    border-radius: inherit;
    z-index: 5;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.25s ease;
}

.p-speeddial-mask.p-speeddial-mask-visible {
    opacity: 1;
    pointer-events: auto;
}

/* Dark Mode */
.dark .p-speeddial-action,
[data-theme="dark"] .p-speeddial-action {
    background: var(--p-surface-900, #0f172a) !important;
    border-color: var(--p-surface-700, #334155) !important;
    color: var(--p-surface-300, #cbd5e1) !important;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.4) !important;
}

.dark .p-speeddial-action:hover:not(:disabled),
[data-theme="dark"] .p-speeddial-action:hover:not(:disabled) {
    background: var(--p-surface-800, #1e293b) !important;
    color: #ffffff !important;
    border-color: var(--p-surface-600, #475569) !important;
}

.dark .p-speeddial-custom-label,
.dark .p-speeddial-custom-icon,
[data-theme="dark"] .p-speeddial-custom-label,
[data-theme="dark"] .p-speeddial-custom-icon {
    background: var(--p-surface-900, #0f172a);
    border-color: var(--p-surface-700, #334155);
    color: var(--p-surface-400, #94a3b8);
}

.dark .p-speeddial-custom-item:hover .p-speeddial-custom-label,
.dark .p-speeddial-custom-item:hover .p-speeddial-custom-icon,
[data-theme="dark"] .p-speeddial-custom-item:hover .p-speeddial-custom-label,
[data-theme="dark"] .p-speeddial-custom-item:hover .p-speeddial-custom-icon {
    background: var(--p-surface-800, #1e293b);
    color: #ffffff;
    border-color: var(--p-surface-600, #475569);
}

.dark .p-speeddial-tooltip,
[data-theme="dark"] .p-speeddial-tooltip {
    background: var(--p-surface-800, #1e293b);
    color: #ffffff;
    border: 1px solid var(--p-surface-700, #334155);
}
.dark .p-speeddial-tooltip.tooltip-left::after,
[data-theme="dark"] .p-speeddial-tooltip.tooltip-left::after {
    border-color: transparent transparent transparent var(--p-surface-800, #1e293b);
}
.dark .p-speeddial-tooltip.tooltip-right::after,
[data-theme="dark"] .p-speeddial-tooltip.tooltip-right::after {
    border-color: transparent var(--p-surface-800, #1e293b) transparent transparent;
}
.dark .p-speeddial-tooltip.tooltip-top::after,
[data-theme="dark"] .p-speeddial-tooltip.tooltip-top::after {
    border-color: var(--p-surface-800, #1e293b) transparent transparent transparent;
}
.dark .p-speeddial-tooltip.tooltip-bottom::after,
[data-theme="dark"] .p-speeddial-tooltip.tooltip-bottom::after {
    border-color: transparent transparent var(--p-surface-800, #1e293b) transparent;
}
`;function N(l,s){D("speed-dial",R);let u=s.model||s.actions||[],p=s.direction||"up",d=s.type||"linear",r=s.radius||(d==="quarter-circle"?120:80),x=s.transitionDelay!==void 0?Number(s.transitionDelay):30,T=s.rotateAnimation!==!1,H=!!s.mask,k=s.template==="custom",C=!!s.tooltipOptions,q=s.tooltipOptions?.position||(p==="left"||p==="right"?"top":"left"),c=!1,M=s.buttonProps?.severity||"contrast",w="p-button-contrast";M!=="contrast"&&(w=`p-button-${M.toLowerCase()}`);let z=s.buttonProps?.rounded!==!1?"p-button-rounded":"",O=s.buttonProps?.iconOnly!==!1?"p-button-icon-only":"",j=s.buttonProps?.styleClass||"";function Y(t,a){if(d==="linear"){let e=(t+1)*52;switch(p){case"up":return{x:0,y:-e};case"down":return{x:0,y:e};case"left":return{x:-e,y:0};case"right":return{x:e,y:0};default:return{x:0,y:-e}}}if(d==="circle"){let o=2*Math.PI/a,e=t*o-Math.PI/2;return{x:Math.round(r*Math.cos(e)),y:Math.round(r*Math.sin(e))}}if(d==="semi-circle"){let o=a>1?Math.PI/(a-1):0;switch(p){case"up":{let e=Math.PI-t*o;return{x:Math.round(r*Math.cos(e)),y:Math.round(-r*Math.sin(e))}}case"down":{let e=Math.PI-t*o;return{x:Math.round(r*Math.cos(e)),y:Math.round(r*Math.sin(e))}}case"left":{let e=-Math.PI/2-t*o;return{x:Math.round(r*Math.cos(e)),y:Math.round(r*Math.sin(e))}}case"right":{let e=-Math.PI/2+t*o;return{x:Math.round(r*Math.cos(e)),y:Math.round(r*Math.sin(e))}}default:{let e=Math.PI-t*o;return{x:Math.round(r*Math.cos(e)),y:Math.round(-r*Math.sin(e))}}}}if(d==="quarter-circle"){let o=a>1?Math.PI/2/(a-1):0;switch(p){case"up-left":{let e=t*o;return{x:Math.round(-r*Math.cos(e)),y:Math.round(-r*Math.sin(e))}}case"up-right":{let e=t*o;return{x:Math.round(r*Math.cos(e)),y:Math.round(-r*Math.sin(e))}}case"down-left":{let e=t*o;return{x:Math.round(-r*Math.cos(e)),y:Math.round(r*Math.sin(e))}}case"down-right":{let e=t*o;return{x:Math.round(r*Math.sin(e)),y:Math.round(r*Math.cos(e))}}default:{let e=t*o;return{x:Math.round(-r*Math.cos(e)),y:Math.round(-r*Math.sin(e))}}}}return{x:0,y:0}}let $="speeddial_"+Math.random().toString(36).substring(2,9),L="";H&&(L='<div class="p-speeddial-mask"></div>');let _=u.map((t,a)=>{let o=t.icon?I(t.icon,18):v.zap,e=(C||t.tooltip)&&(t.tooltip||t.label)||"",n=e?`
            <span class="p-speeddial-tooltip tooltip-${q}" data-index="${a}">
                ${e}
            </span>
        `:"";if(k)return`
                <li class="p-speeddial-item" role="none" data-index="${a}">
                    <div class="p-speeddial-custom-item" data-index="${a}">
                        <span class="p-speeddial-custom-label">${t.label||""}</span>
                        <button type="button" class="p-speeddial-custom-icon" aria-label="${t.label||""}" tabindex="-1">
                            ${o}
                        </button>
                    </div>
                </li>
            `;let i=t.url?"a":"button",h=t.url?`href="${t.url}" target="${t.target||"_self"}" rel="noopener"`:'type="button"';return`
            <li class="p-speeddial-item" role="none" data-index="${a}">
                <${i} ${h} 
                   class="p-speeddial-action ${t.styleClass||""}" 
                   role="menuitem"
                   data-index="${a}"
                   tabindex="-1"
                   aria-label="${t.label||e||"Action"}"
                   ${t.disabled?'disabled aria-disabled="true"':""}>
                    ${o}
                    ${n}
                </${i}>
            </li>
        `}).join(""),B=T?"p-speeddial-rotate":"",E=s.ariaLabel||"Speed Dial Options";l.innerHTML=`
        ${L}
        <div class="p-speeddial p-component p-speeddial-direction-${p} p-speeddial-${d}">
            <button type="button" 
                    class="p-speeddial-button p-button ${w} ${z} ${O} ${j}"
                    aria-haspopup="true"
                    aria-expanded="false"
                    aria-controls="${$}_list"
                    aria-label="${E}">
                <span class="p-speeddial-icon ${B}">
                    ${v.plus}
                </span>
            </button>
            <ul id="${$}_list" class="p-speeddial-list" role="menu" aria-label="${E}">
                ${_}
            </ul>
        </div>
    `;let X=l.querySelector(".p-speeddial"),f=l.querySelector(".p-speeddial-button"),y=l.querySelector(".p-speeddial-mask"),U=Array.from(l.querySelectorAll(".p-speeddial-item"));function m(t){c=t,X.classList.toggle("p-speeddial-opened",t),f.setAttribute("aria-expanded",String(t)),y&&y.classList.toggle("p-speeddial-mask-visible",t),requestAnimationFrame(()=>{U.forEach((a,o)=>{let e=Y(o,u.length),n=t?x*o:x*(u.length-1-o);a.style.transitionDelay=`${n}ms`,k?t?(a.style.transform=`translate3d(0, ${e.y}px, 0) scale(1)`,a.style.opacity="1"):(a.style.transform="translate3d(0, 0, 0) scale(0)",a.style.opacity="0"):t?(a.style.transform=`translate3d(${e.x}px, ${e.y}px, 0) scale(1)`,a.style.opacity="1"):(a.style.transform="translate3d(0, 0, 0) scale(0)",a.style.opacity="0");let i=a.querySelector(".p-speeddial-action, .p-speeddial-custom-icon");i&&i.setAttribute("tabindex",t?"0":"-1")})})}function A(){m(!c)}function b(){c&&(m(!1),f.focus())}f.addEventListener("click",t=>{t.stopPropagation(),A()}),y?.addEventListener("click",t=>{t.stopPropagation(),b()}),document.addEventListener("click",t=>{c&&!l.contains(t.target)&&b()}),f.addEventListener("keydown",t=>{if(t.key==="Enter"||t.key===" ")t.preventDefault(),A();else if(t.key==="ArrowDown"||t.key==="ArrowRight")c||(t.preventDefault(),m(!0),l.querySelector(".p-speeddial-action, .p-speeddial-custom-icon")?.focus());else if((t.key==="ArrowUp"||t.key==="ArrowLeft")&&!c){t.preventDefault(),m(!0);let a=l.querySelectorAll(".p-speeddial-action, .p-speeddial-custom-icon");a.length&&a[a.length-1].focus()}}),l.querySelectorAll(".p-speeddial-action, .p-speeddial-custom-item").forEach(t=>{let a=parseInt(t.getAttribute("data-index")||"-1",10),o=u[a];t.addEventListener("click",n=>{if(!o?.disabled){if(l.dispatchEvent(new CustomEvent("speeddial:action",{bubbles:!0,detail:{item:o,index:a}})),o?.command&&P(o.command,o),o?.url){let i=S(o.url);i&&i!=="about:blank"&&(o.target==="_blank"?window.open(i,"_blank","noopener,noreferrer"):window.location.href=i)}b()}});let e=t.querySelector(".p-speeddial-tooltip");e&&(t.addEventListener("mouseenter",()=>e.classList.add("p-tooltip-visible")),t.addEventListener("mouseleave",()=>e.classList.remove("p-tooltip-visible"))),t.addEventListener("keydown",n=>{let i=Array.from(l.querySelectorAll(".p-speeddial-action, .p-speeddial-custom-icon")),h=i.indexOf(t);if(n.key==="Escape")n.preventDefault(),b();else if(n.key==="ArrowDown"||n.key==="ArrowRight"){n.preventDefault();let g=(h+1)%i.length;i[g]?.focus()}else if(n.key==="ArrowUp"||n.key==="ArrowLeft"){n.preventDefault();let g=(h-1+i.length)%i.length;i[g]?.focus()}else n.key==="Home"?(n.preventDefault(),i[0]?.focus()):n.key==="End"&&(n.preventDefault(),i[i.length-1]?.focus())})})}export{N as default};
