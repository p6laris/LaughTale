import{e as v}from"./chunk-3YU53HBK.mjs";var b=`
.p-popover {
    position: fixed;
    z-index: 1200;
    box-sizing: border-box;
    background: var(--p-surface-0, #ffffff);
    border: 1px solid var(--p-border-color, #e2e8f0);
    border-radius: var(--p-border-radius, 8px);
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
    padding: 1.25rem;
    color: var(--p-text-color, #0f172a);
    pointer-events: none;
    visibility: hidden;
    opacity: 0;
    transform: scale(0.95) translateY(4px);
    transform-origin: center top;
    will-change: transform, opacity;
    transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.2s cubic-bezier(0.16, 1, 0.3, 1), visibility 0.2s;
}

.p-popover.p-popover-active {
    visibility: visible;
    opacity: 1;
    pointer-events: auto;
    transform: scale(1) translateY(0);
}

/* Arrow Notch */
.p-popover-arrow {
    position: absolute;
    width: 10px;
    height: 10px;
    background: var(--p-surface-0, #ffffff);
    border: 1px solid var(--p-border-color, #e2e8f0);
    transform: rotate(45deg);
    pointer-events: none;
    z-index: 1;
}

.p-popover-arrow-top {
    top: -6px;
    border-bottom: none;
    border-right: none;
}

.p-popover-arrow-bottom {
    bottom: -6px;
    border-top: none;
    border-left: none;
}

/* Dark Mode Tokens */
.dark .p-popover,
[data-theme="dark"] .p-popover {
    background: var(--p-surface-900, #0f172a);
    border-color: var(--p-surface-700, #334155);
    color: var(--p-surface-0, #f8fafc);
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5);
}

.dark .p-popover-arrow,
[data-theme="dark"] .p-popover-arrow {
    background: var(--p-surface-900, #0f172a);
    border-color: var(--p-surface-700, #334155);
}
`,f=!1;function g(t,a,n="bottom"){let r=a.getBoundingClientRect(),o=t.getBoundingClientRect(),p=t.querySelector(".p-popover-arrow"),i=10,c=0,e=0,s=n,l=window.innerHeight-r.bottom,d=r.top;if(s==="bottom"&&l<o.height+i&&d>l?s="top":s==="top"&&d<o.height+i&&l>d&&(s="bottom"),s==="bottom"?(c=r.bottom+i,p&&(p.className="p-popover-arrow p-popover-arrow-top")):(c=r.top-o.height-i,p&&(p.className="p-popover-arrow p-popover-arrow-bottom")),e=r.left+r.width/2-o.width/2,e<12&&(e=12),e+o.width>window.innerWidth-12&&(e=window.innerWidth-o.width-12),t.style.top=`${Math.round(c)}px`,t.style.left=`${Math.round(e)}px`,p){let m=r.left+r.width/2-e-5;p.style.left=`${Math.max(12,Math.min(o.width-22,m))}px`}}function u(){f||typeof document>"u"||(f=!0,document.addEventListener("click",t=>{let a=t.target,n=a.closest("[data-popover-target], [data-popover-open], [data-popover-toggle]");if(n){t.preventDefault(),t.stopPropagation();let o=n.getAttribute("data-popover-target")||n.getAttribute("data-popover-open")||n.getAttribute("data-popover-toggle"),p=n.getAttribute("data-popover-anchor"),i=p?document.getElementById(p):n;if(o&&i){let c=document.getElementById(o),e=c?.querySelector(".p-popover")||c;if(e){let s=e.classList.contains("p-popover-active");document.querySelectorAll(".p-popover.p-popover-active").forEach(l=>{l!==e&&l.classList.remove("p-popover-active")}),s?e.classList.remove("p-popover-active"):(g(e,i),e.classList.add("p-popover-active"))}}return}let r=a.closest("[data-popover-close], [data-popover-hide]");if(r){t.preventDefault();let o=r.closest(".p-popover");o&&o.classList.remove("p-popover-active");return}a.closest(".p-popover")||document.querySelectorAll(".p-popover.p-popover-active").forEach(o=>{o.classList.remove("p-popover-active")})}),window.addEventListener("keydown",t=>{t.key==="Escape"&&document.querySelectorAll(".p-popover.p-popover-active").forEach(a=>{a.classList.remove("p-popover-active")})}),window.addEventListener("scroll",()=>{document.querySelectorAll(".p-popover.p-popover-active").forEach(t=>{})},{passive:!0}))}function h(t,a){v("popover",b),u()}export{h as default};
