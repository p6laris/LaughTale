import{e as L}from"./chunk-3YU53HBK.mjs";var k=`
.p-scrollarea {
    position: relative;
    overflow: hidden;
    box-sizing: border-box;
}

.p-scrollarea-viewport {
    width: 100%;
    height: 100%;
    overflow: scroll;
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* IE/Edge */
    box-sizing: border-box;
    outline: none;
}
.p-scrollarea-viewport::-webkit-scrollbar {
    display: none; /* Chrome/Safari */
    width: 0;
    height: 0;
}

.p-scrollarea-content {
    min-width: 100%;
    box-sizing: border-box;
}

/* Scrollbars */
.p-scrollarea-scrollbar {
    display: flex;
    user-select: none;
    touch-action: none;
    padding: 2px;
    background: transparent;
    transition: opacity 0.2s ease, background-color 0.15s ease;
    position: absolute;
    z-index: 10;
    box-sizing: border-box;
    opacity: 0;
}
.p-scrollarea-scrollbar-vertical {
    top: 0;
    right: 0;
    bottom: 0;
    width: 9px;
}
.p-scrollarea-scrollbar-horizontal {
    left: 0;
    bottom: 0;
    right: 0;
    height: 9px;
    flex-direction: column;
}
.p-scrollarea-corner {
    position: absolute;
    right: 0;
    bottom: 0;
    width: 9px;
    height: 9px;
    background: transparent;
}

.p-scrollarea-handle {
    flex: 1;
    background: var(--p-surface-400, #94a3b8);
    border-radius: 9999px;
    position: relative;
    transition: background-color 0.15s ease, transform 0.15s ease;
    cursor: pointer;
}
.p-scrollarea-handle:hover {
    background: var(--p-surface-500, #64748b);
}
.p-scrollarea-handle:active {
    background: var(--p-surface-600, #475569);
}

/* Mask / Fade */
.p-scrollarea-mask .p-scrollarea-viewport {
    mask-image: linear-gradient(to bottom, transparent 0%, black 8%, black 92%, transparent 100%);
    -webkit-mask-image: linear-gradient(to bottom, transparent 0%, black 8%, black 92%, transparent 100%);
}

/* Variants */
.p-scrollarea[data-p-variant="auto"] .p-scrollarea-scrollbar {
    opacity: 0;
}
.p-scrollarea[data-p-variant="auto"]:hover .p-scrollarea-scrollbar,
.p-scrollarea[data-p-variant="auto"].p-scrollarea-scrolling .p-scrollarea-scrollbar {
    opacity: 1;
}

.p-scrollarea[data-p-variant="hover"] .p-scrollarea-scrollbar {
    opacity: 0;
}
.p-scrollarea[data-p-variant="hover"]:hover .p-scrollarea-scrollbar {
    opacity: 1;
}

.p-scrollarea[data-p-variant="scroll"] .p-scrollarea-scrollbar {
    opacity: 0;
}
.p-scrollarea[data-p-variant="scroll"].p-scrollarea-scrolling .p-scrollarea-scrollbar {
    opacity: 1;
}

.p-scrollarea[data-p-variant="always"] .p-scrollarea-scrollbar {
    opacity: 1 !important;
}

.p-scrollarea[data-p-variant="hidden"] .p-scrollarea-scrollbar {
    display: none !important;
    opacity: 0 !important;
}

/* Dark Mode Tokens */
.dark .p-scrollarea-handle,
[data-theme="dark"] .p-scrollarea-handle {
    background: var(--p-surface-600, #475569) !important;
}
.dark .p-scrollarea-handle:hover,
[data-theme="dark"] .p-scrollarea-handle:hover {
    background: var(--p-surface-500, #64748b) !important;
}
.dark .p-scrollarea-handle:active,
[data-theme="dark"] .p-scrollarea-handle:active {
    background: var(--p-surface-400, #94a3b8) !important;
}
`;function x(h,S){L("scrollarea",k);let p=h.querySelector(".p-scrollarea")||h,a=p.querySelector(".p-scrollarea-viewport");if(!a)return;let u=p.querySelector(".p-scrollarea-scrollbar-vertical"),n=u?.querySelector(".p-scrollarea-handle"),b=p.querySelector(".p-scrollarea-scrollbar-horizontal"),s=b?.querySelector(".p-scrollarea-handle"),g=null;function v(){if(!a)return;let{scrollTop:e,scrollLeft:l,scrollHeight:t,scrollWidth:o,clientHeight:r,clientWidth:c}=a;if(u&&n){let i=t>r;if(u.style.display=i?"flex":"none",i){let d=Math.max(r/t*r,20),f=e/(t-r)*(r-d);n.style.height=`${d}px`,n.style.transform=`translateY(${f}px)`}}if(b&&s){let i=o>c;if(b.style.display=i?"flex":"none",i){let d=Math.max(c/o*c,20),f=l/(o-c)*(c-d);s.style.width=`${d}px`,s.style.transform=`translateX(${f}px)`}}}if(a.addEventListener("scroll",()=>{v(),p.classList.add("p-scrollarea-scrolling"),clearTimeout(g),g=setTimeout(()=>{p.classList.remove("p-scrollarea-scrolling")},1e3)}),u&&n){let e=!1,l=0,t=0;n.addEventListener("pointerdown",r=>{e=!0,l=r.clientY,t=a.scrollTop,n.setPointerCapture(r.pointerId),document.body.style.userSelect="none"}),n.addEventListener("pointermove",r=>{if(!e)return;let c=r.clientY-l,i=(a.scrollHeight-a.clientHeight)/(a.clientHeight-n.offsetHeight);a.scrollTop=t+c*i});let o=r=>{if(e){e=!1;try{n.releasePointerCapture(r.pointerId)}catch{}document.body.style.userSelect=""}};n.addEventListener("pointerup",o),n.addEventListener("pointercancel",o)}if(b&&s){let e=!1,l=0,t=0;s.addEventListener("pointerdown",r=>{e=!0,l=r.clientX,t=a.scrollLeft,s.setPointerCapture(r.pointerId),document.body.style.userSelect="none"}),s.addEventListener("pointermove",r=>{if(!e)return;let c=r.clientX-l,i=(a.scrollWidth-a.clientWidth)/(a.clientWidth-s.offsetWidth);a.scrollLeft=t+c*i});let o=r=>{if(e){e=!1;try{s.releasePointerCapture(r.pointerId)}catch{}document.body.style.userSelect=""}};s.addEventListener("pointerup",o),s.addEventListener("pointercancel",o)}let m=h.closest(".component-card")||h.parentElement?.parentElement?.parentElement||document;function y(e,l){p.setAttribute("data-p-variant",e),m&&m.querySelectorAll("[data-scrollarea-variant]").forEach(t=>{let o=t.getAttribute("data-scrollarea-variant");t.classList.toggle("p-highlight",o===e)}),v()}m&&m.querySelectorAll("[data-scrollarea-variant]").forEach(e=>{e.addEventListener("click",l=>{l.preventDefault();let t=e.getAttribute("data-scrollarea-variant")||"auto";y(t,e)})}),document.addEventListener("click",e=>{let l=e.target?.closest("[data-scrollarea-variant]");if(!l)return;let t=l.closest('div[style*="padding"]')||l.closest(".component-card");if(t&&t.contains(p)){let o=l.getAttribute("data-scrollarea-variant")||"auto";y(o,l)}});let E=new ResizeObserver(()=>{v()});E.observe(a),a.firstElementChild&&E.observe(a.firstElementChild),setTimeout(v,50)}export{x as default};
