import{e as D}from"./chunk-3YU53HBK.mjs";var _=`
.p-splitter {
    display: flex;
    flex-wrap: nowrap;
    border: 1px solid var(--p-border-color, #e2e8f0);
    background: var(--p-surface-0, #ffffff);
    border-radius: var(--p-border-radius-md, 6px);
    color: var(--p-text-color, #0f172a);
    overflow: hidden;
    box-sizing: border-box;
    position: relative;
}

.p-splitter-horizontal {
    flex-direction: row;
}

.p-splitter-vertical {
    flex-direction: column;
}

.p-splitterpanel {
    flex-grow: 1;
    overflow: auto;
    box-sizing: border-box;
    transition: flex-basis 0.15s cubic-bezier(0.2, 0, 0, 1);
}
.p-splitterpanel.p-splitterpanel-resizing {
    transition: none !important;
}

.p-splitter-gutter {
    flex-grow: 0;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 5;
    background: var(--p-surface-100, #f1f5f9);
    user-select: none;
    touch-action: none;
    transition: background-color 0.15s ease, opacity 0.15s ease;
    box-sizing: border-box;
    outline: none;
}

.p-splitter-horizontal > .p-splitter-gutter {
    width: 6px;
    cursor: col-resize;
}

.p-splitter-vertical > .p-splitter-gutter {
    height: 6px;
    cursor: row-resize;
}

.p-splitter-gutter:hover,
.p-splitter-gutter:focus-visible,
.p-splitter-gutter[data-resizing="true"] {
    background: var(--p-surface-200, #e2e8f0);
}
.p-splitter-gutter:focus-visible {
    outline: 2px solid var(--p-primary-500, #10b981);
    outline-offset: -1px;
}

.p-splitter-gutter-handle {
    background: var(--p-surface-400, #94a3b8);
    border-radius: 9999px;
    transition: background-color 0.15s ease;
}

.p-splitter-horizontal > .p-splitter-gutter > .p-splitter-gutter-handle {
    width: 2px;
    height: 1.5rem;
}

.p-splitter-vertical > .p-splitter-gutter > .p-splitter-gutter-handle {
    height: 2px;
    width: 1.5rem;
}

.p-splitter-gutter:hover > .p-splitter-gutter-handle,
.p-splitter-gutter[data-resizing="true"] > .p-splitter-gutter-handle {
    background: var(--p-surface-600, #475569);
}

.p-splitter[data-disabled="true"] > .p-splitter-gutter {
    cursor: default !important;
    pointer-events: none !important;
    opacity: 0.6;
}

/* Dark Mode Tokens */
.dark .p-splitter,
[data-theme="dark"] .p-splitter {
    background: var(--p-surface-900, #0f172a) !important;
    border-color: var(--p-surface-700, #334155) !important;
    color: var(--p-surface-100, #f8fafc) !important;
}

.dark .p-splitter-gutter,
[data-theme="dark"] .p-splitter-gutter {
    background: var(--p-surface-800, #1e293b) !important;
}

.dark .p-splitter-gutter:hover,
.dark .p-splitter-gutter:focus-visible,
.dark .p-splitter-gutter[data-resizing="true"],
[data-theme="dark"] .p-splitter-gutter:hover,
[data-theme="dark"] .p-splitter-gutter:focus-visible,
[data-theme="dark"] .p-splitter-gutter[data-resizing="true"] {
    background: var(--p-surface-700, #334155) !important;
}

.dark .p-splitter-gutter-handle,
[data-theme="dark"] .p-splitter-gutter-handle {
    background: var(--p-surface-500, #64748b) !important;
}

.dark .p-splitter-gutter:hover > .p-splitter-gutter-handle,
.dark .p-splitter-gutter[data-resizing="true"] > .p-splitter-gutter-handle,
[data-theme="dark"] .p-splitter-gutter:hover > .p-splitter-gutter-handle,
[data-theme="dark"] .p-splitter-gutter[data-resizing="true"] > .p-splitter-gutter-handle {
    background: var(--p-surface-300, #cbd5e1) !important;
}
`;function j(x,m){D("splitter",_);let d=x.querySelector(".p-splitter")||x,f=(m.layout||(d.classList.contains("p-splitter-vertical")?"vertical":"horizontal"))==="horizontal",A=!!m.disabled||d.getAttribute("data-disabled")==="true",S=m.stateKey||d.getAttribute("data-state-key"),l=Array.from(d.children).filter(t=>t.classList.contains("p-splitterpanel")||t.hasAttribute("data-splitterpanel"));if(l.length===0&&(l=Array.from(d.children).filter(t=>!t.classList.contains("p-splitter-gutter"))),l.length===0)return;d.classList.add("p-splitter","p-component",f?"p-splitter-horizontal":"p-splitter-vertical"),A&&d.setAttribute("data-disabled","true"),l.forEach(t=>t.classList.add("p-splitterpanel"));let a=[];if(S)try{let t=localStorage.getItem(S);t&&(a=JSON.parse(t))}catch{}if(!a||a.length!==l.length)if(m.sizes&&m.sizes.length===l.length)a=[...m.sizes];else{let t=l.map(s=>{let h=s.getAttribute("data-size");return h?parseFloat(h):null});if(t.some(s=>s!==null)){let s=t.map(e=>e??100/l.length),h=s.reduce((e,o)=>e+o,0);a=s.map(e=>e/h*100)}else a=l.map(()=>100/l.length)}Array.from(d.querySelectorAll(":scope > .p-splitter-gutter")).forEach(t=>t.remove());let w=[];for(let t=0;t<l.length-1;t++){let r=document.createElement("div");r.className="p-splitter-gutter",r.setAttribute("role","separator"),r.setAttribute("tabindex",A?"-1":"0"),r.setAttribute("aria-orientation",f?"vertical":"horizontal"),r.setAttribute("aria-valuenow",a[t].toFixed(1));let s=document.createElement("div");s.className="p-splitter-gutter-handle",r.appendChild(s),l[t].after(r),w.push(r)}function z(t,r=!1,s="resize"){let h=(l.length-1)*6;if(l.forEach((e,o)=>{let i=t[o];if(e.style.flexBasis=`calc(${i}% - ${h*i/100}px)`,e.style.flexGrow="0",e.style.flexShrink="0",e.hasAttribute("data-compact-below")){let u=parseFloat(e.getAttribute("data-compact-below")||"28");e.classList.toggle("p-compact",i<u)}}),w.forEach((e,o)=>{e.setAttribute("aria-valuenow",t[o].toFixed(1))}),S&&s==="resizeend")try{localStorage.setItem(S,JSON.stringify(t))}catch{}if(r){x.dispatchEvent(new CustomEvent(`splitter:${s}`,{bubbles:!0,detail:{sizes:[...t]}}));let e=x.closest(".component-card")?.querySelector(".p-splitter-metrics");if(e){let o=i=>i.map(u=>u.toFixed(1)+"%").join(", ");if(s==="resizestart"){let i=e.querySelector('[data-metric="resizestart"]');i&&(i.textContent=`[${o(t)}]`)}else if(s==="resize"){let i=e.querySelector('[data-metric="resize"]');i&&(i.textContent=`[${o(t)}]`)}else if(s==="resizeend"){let i=e.querySelector('[data-metric="resizeend"]');i&&(i.textContent=`[${o(t)}]`)}}x.closest(".component-card")?.querySelectorAll("[data-splitter-size-label]").forEach(o=>{let i=parseInt(o.getAttribute("data-splitter-size-label")||"0",10);t[i]!==void 0&&(o.textContent=`(${t[i].toFixed(1)}%)`)})}}z(a),!A&&w.forEach((t,r)=>{let s=!1,h=0,e=[],o=l[r],i=l[r+1],u=parseFloat(o.getAttribute("data-min-size")||"0"),M=parseFloat(o.getAttribute("data-max-size")||"100"),H=o.hasAttribute("data-collapsible"),E=parseFloat(o.getAttribute("data-collapsed-size")||"0"),k=parseFloat(i.getAttribute("data-min-size")||"0"),q=parseFloat(i.getAttribute("data-max-size")||"100"),$=i.hasAttribute("data-collapsible"),P=parseFloat(i.getAttribute("data-collapsed-size")||"0");function N(n){s=!0,h=f?n.clientX:n.clientY,e=[...a],t.setAttribute("data-resizing","true"),t.setPointerCapture(n.pointerId),document.body.style.userSelect="none",l.forEach(b=>b.classList.add("p-splitterpanel-resizing")),z(a,!0,"resizestart")}function T(n){if(!s)return;let b=f?d.offsetWidth:d.offsetHeight;if(b<=0)return;let y=((f?n.clientX:n.clientY)-h)/b*100,p=e[r]+y,c=e[r+1]-y,v=e[r]+e[r+1];if(H&&p<u){let L=(u+E)/2;p<L?(p=E,c=v-E):(p=u,c=v-u)}else p=Math.max(u,Math.min(M,p)),c=v-p;if($&&c<k){let L=(k+P)/2;c<L?(c=P,p=v-P):(c=k,p=v-k)}else c=Math.max(k,Math.min(q,c)),p=v-c;a[r]=p,a[r+1]=c,z(a,!0,"resize")}function C(n){if(s){s=!1,t.removeAttribute("data-resizing");try{t.releasePointerCapture(n.pointerId)}catch{}document.body.style.userSelect="",l.forEach(b=>b.classList.remove("p-splitterpanel-resizing")),z(a,!0,"resizeend")}}t.addEventListener("pointerdown",N),t.addEventListener("pointermove",T),t.addEventListener("pointerup",C),t.addEventListener("pointercancel",C),t.addEventListener("keydown",n=>{let g=0;if(f&&n.key==="ArrowLeft"||!f&&n.key==="ArrowUp"?g=-2:f&&n.key==="ArrowRight"||!f&&n.key==="ArrowDown"?g=2:n.key==="Home"?g=-100:n.key==="End"&&(g=100),g!==0){n.preventDefault();let F=a[r]+a[r+1],y=Math.max(u,Math.min(M,a[r]+g)),p=F-y;a[r]=y,a[r+1]=p,z(a,!0,"resize"),z(a,!0,"resizeend")}})})}export{j as default};
