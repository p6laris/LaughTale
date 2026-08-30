import{e as b}from"./chunk-3YU53HBK.mjs";var x=`
.p-tooltip {
    position: fixed;
    z-index: 100000;
    pointer-events: none;
    visibility: hidden;
    opacity: 0;
    transform: scale(0.92);
    transform-origin: center center;
    will-change: transform, opacity;
    transition: transform 0.15s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.15s ease, visibility 0.15s;
}

.p-tooltip.p-tooltip-active {
    visibility: visible !important;
    opacity: 1 !important;
    transform: scale(1) !important;
}

.p-tooltip.p-tooltip-interactive {
    pointer-events: auto;
}

.p-tooltip-text {
    background: var(--p-surface-800, #1e293b);
    color: var(--p-surface-0, #ffffff);
    font-size: 0.75rem;
    font-weight: 500;
    line-height: 1.4;
    padding: 0.4rem 0.8rem;
    border-radius: var(--p-border-radius, 6px);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.25), 0 4px 6px -4px rgba(0, 0, 0, 0.1);
    max-width: 18rem;
    word-break: break-word;
    display: inline-flex;
    align-items: center;
}

/* Arrow Notch */
.p-tooltip-arrow {
    position: absolute;
    width: 8px;
    height: 8px;
    background: var(--p-surface-800, #1e293b);
    transform: rotate(45deg);
    z-index: 1;
}

.p-tooltip-top .p-tooltip-arrow {
    bottom: -4px;
    left: calc(50% - 4px);
}
.p-tooltip-bottom .p-tooltip-arrow {
    top: -4px;
    left: calc(50% - 4px);
}
.p-tooltip-left .p-tooltip-arrow {
    right: -4px;
    top: calc(50% - 4px);
}
.p-tooltip-right .p-tooltip-arrow {
    left: -4px;
    top: calc(50% - 4px);
}

/* Dark Mode Tokens */
.dark .p-tooltip-text,
[data-theme="dark"] .p-tooltip-text {
    background: var(--p-surface-900, #0f172a);
    color: var(--p-surface-0, #f8fafc);
    border: 1px solid var(--p-surface-700, #334155);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.5);
}

.dark .p-tooltip-arrow,
[data-theme="dark"] .p-tooltip-arrow {
    background: var(--p-surface-900, #0f172a);
    border-color: var(--p-surface-700, #334155);
}
`,l=null,g=null,c=null,u=null,v=!1;function f(e){let t=e;for(;t&&t!==document.body&&t!==document.documentElement;){for(let o of Array.from(t.attributes)){let i=o.name.toLowerCase();if(i==="p-tooltip"||i.startsWith("p-tooltip.")||i==="v-tooltip"||i.startsWith("v-tooltip.")||i==="data-tooltip"||i.startsWith("data-tooltip.")||i==="l-tooltip"||i.startsWith("l-tooltip.")||i==="data-tooltip-target")return t}t=t.parentElement}return null}function h(e){let t="",o="right";for(let a of Array.from(e.attributes)){let r=a.name.toLowerCase();if(r==="p-tooltip"||r==="v-tooltip"||r==="data-tooltip"||r==="l-tooltip"||r.startsWith("p-tooltip.")||r.startsWith("v-tooltip.")||r.startsWith("l-tooltip.")||r.startsWith("data-tooltip.")){t=a.value,r.includes(".top")?o="top":r.includes(".bottom")?o="bottom":r.includes(".left")?o="left":r.includes(".right")&&(o="right");break}}if(!t){let a=e.getAttribute("data-tooltip-target");if(a){let r=document.getElementById(a);r&&(t=r.innerHTML)}}if(!t)return null;if(t.trim().startsWith("{")&&t.trim().endsWith("}"))try{let a=JSON.parse(t);return{value:a.value||"",position:a.position||o,showDelay:a.showDelay!==void 0?Number(a.showDelay):0,hideDelay:a.hideDelay!==void 0?Number(a.hideDelay):0,event:a.event||"hover",autoHide:a.autoHide!==!1,escape:a.escape!==!1,class:a.class||""}}catch{}let i=e.getAttribute("p-tooltip-position")||e.getAttribute("data-tooltip-position");i&&(o=i);let n=e.getAttribute("p-tooltip-show-delay")||e.getAttribute("data-tooltip-show-delay"),d=e.getAttribute("p-tooltip-hide-delay")||e.getAttribute("data-tooltip-hide-delay"),p=e.getAttribute("p-tooltip-event")||e.getAttribute("data-tooltip-event"),s=e.getAttribute("p-tooltip-auto-hide")||e.getAttribute("data-tooltip-auto-hide"),T=e.getAttribute("p-tooltip-escape")||e.getAttribute("data-tooltip-escape");return{value:t,position:o,showDelay:n?parseInt(n,10):0,hideDelay:d?parseInt(d,10):0,event:p||"hover",autoHide:s!=="false",escape:T!=="false"}}function L(e,t,o){let i=t.getBoundingClientRect(),n=e.getBoundingClientRect(),d=8,p=0,s=0;switch(o){case"top":p=i.top-n.height-d,s=i.left+i.width/2-n.width/2;break;case"bottom":p=i.bottom+d,s=i.left+i.width/2-n.width/2;break;case"left":p=i.top+i.height/2-n.height/2,s=i.left-n.width-d;break;case"right":default:p=i.top+i.height/2-n.height/2,s=i.right+d;break}s<8&&(s=8),s+n.width>window.innerWidth-8&&(s=window.innerWidth-n.width-8),p<8&&(p=8),p+n.height>window.innerHeight-8&&(p=window.innerHeight-n.height-8),e.style.top=`${Math.round(p)}px`,e.style.left=`${Math.round(s)}px`}function w(e,t){u&&(clearTimeout(u),u=null),c&&(clearTimeout(c),c=null);let o=()=>{l||(l=document.createElement("div"),l.className="p-tooltip p-component",l.setAttribute("role","tooltip"),document.body.appendChild(l)),g=e;let i=t.position||"right";l.className=`p-tooltip p-component p-tooltip-${i} ${t.class||""}`,t.autoHide||l.classList.add("p-tooltip-interactive"),t.escape?l.innerHTML=`
                <div class="p-tooltip-arrow"></div>
                <div class="p-tooltip-text">${H(t.value)}</div>
            `:l.innerHTML=`
                <div class="p-tooltip-arrow"></div>
                <div class="p-tooltip-text">${t.value}</div>
            `,L(l,e,i),l.classList.add("p-tooltip-active")};t.showDelay&&t.showDelay>0?c=setTimeout(o,t.showDelay):o()}function m(e=0){c&&(clearTimeout(c),c=null),u&&(clearTimeout(u),u=null);let t=()=>{l&&(l.classList.remove("p-tooltip-active"),g=null)};e>0?u=setTimeout(t,e):t()}function H(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}function y(){v||typeof document>"u"||(v=!0,b("tooltip",x),document.addEventListener("mouseover",e=>{let t=f(e.target);if(t){let o=h(t);o&&(o.event==="hover"||o.event==="both"||!o.event)&&w(t,o)}}),document.addEventListener("mouseout",e=>{let t=f(e.target);if(t&&t===g){let o=h(t);m(o?.hideDelay||0)}}),document.addEventListener("focusin",e=>{let t=f(e.target);if(t){let o=h(t);o&&(o.event==="focus"||o.event==="both")&&w(t,o)}}),document.addEventListener("focusout",e=>{let t=f(e.target);if(t&&t===g){let o=h(t);m(o?.hideDelay||0)}}),window.addEventListener("keydown",e=>{e.key==="Escape"&&l&&m(0)}))}typeof document<"u"&&y();function E(e){y()}export{y as a,E as b};
