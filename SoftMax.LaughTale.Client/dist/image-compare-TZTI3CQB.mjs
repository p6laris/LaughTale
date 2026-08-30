import{e as C}from"./chunk-3YU53HBK.mjs";var D=`
/* ==========================================================================
   PrimeVue 4 Aura Compare Component Tokens & Styles
   ========================================================================== */
.p-compare {
    position: relative;
    overflow: hidden;
    user-select: none;
    -webkit-user-select: none;
    touch-action: none;
    border-radius: var(--p-compare-border-radius, var(--p-border-radius, 12px));
    border: 1px solid var(--p-border-color, #e2e8f0);
    box-sizing: border-box;
    font-family: var(--p-font-family, inherit);
    cursor: ew-resize;
    display: block;
    width: 100%;
}

.p-compare-vertical {
    cursor: ns-resize;
}

.p-compare-disabled {
    opacity: 0.6;
    cursor: not-allowed !important;
    pointer-events: none;
}

/* Hidden Accessible Range Input */
.p-compare-input {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
}

/* Compare Layers */
.p-compare-item {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    box-sizing: border-box;
}

.p-compare-item-after {
    z-index: 1;
}

.p-compare-item-before {
    z-index: 2;
    will-change: clip-path, width, height;
}

.p-compare-item img,
.p-compare-item svg {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    pointer-events: none;
}

/* Compare Handle & Indicator */
.p-compare-handle {
    position: absolute;
    z-index: 3;
    pointer-events: none;
    box-sizing: border-box;
    background: var(--p-compare-handle-background, #ffffff);
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.45);
    will-change: left, top;
}

/* Horizontal Handle */
.p-compare:not(.p-compare-vertical) .p-compare-handle {
    top: 0;
    bottom: 0;
    width: var(--p-compare-handle-size, 2px);
    transform: translateX(-50%);
}

/* Vertical Handle */
.p-compare-vertical .p-compare-handle {
    left: 0;
    right: 0;
    height: var(--p-compare-handle-size, 2px);
    transform: translateY(-50%);
}

.p-compare-indicator {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: var(--p-compare-indicator-size, 2.25rem);
    height: var(--p-compare-indicator-size, 2.25rem);
    border-radius: var(--p-compare-indicator-border-radius, 9999px);
    background: var(--p-compare-indicator-background, #ffffff);
    color: var(--p-text-color, #0f172a);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: auto;
    cursor: ew-resize;
    transition: transform 150ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 150ms ease;
}

.p-compare-vertical .p-compare-indicator {
    cursor: ns-resize;
}

.p-compare-indicator:hover {
    transform: translate(-50%, -50%) scale(1.1);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.35);
}

.p-compare:focus-within .p-compare-indicator {
    outline: none;
    box-shadow: 0 0 0 var(--p-compare-indicator-focus-ring-width, 3px) var(--p-compare-indicator-focus-ring-color, rgba(16, 185, 129, 0.4)), 0 4px 12px rgba(0, 0, 0, 0.25);
}

/* Custom Translucent Bubble Handle */
.p-compare-custom-handle .p-compare-handle {
    background: transparent !important;
    box-shadow: none !important;
}
.p-compare-custom-handle .p-compare-indicator {
    width: 1.25rem !important;
    height: 1.25rem !important;
    background: rgba(255, 255, 255, 0.6) !important;
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3) !important;
}
.p-compare-custom-handle .p-compare-indicator:hover {
    transform: translate(-50%, -50%) scale(1.5) !important;
}

/* Dark Mode Tokens */
.dark .p-compare,
[data-theme="dark"] .p-compare {
    border-color: var(--p-surface-800, #1e293b);
}

.dark .p-compare-indicator,
[data-theme="dark"] .p-compare-indicator {
    background: var(--p-surface-900, #0f172a);
    color: var(--p-surface-0, #ffffff);
    border: 1px solid var(--p-surface-700, #334155);
}
`,_='<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m18 8 4 4-4 4"/><path d="M2 12h20"/><path d="m6 8-4 4 4 4"/></svg>',B='<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>',V="https://primefaces.org/cdn/primevue/images/compare/island2.jpg",G="https://primefaces.org/cdn/primevue/images/compare/island1.jpg";function R(n,t){C("compare",D);let i=t.demoType||"basic",m=(t.orientation||(i==="vertical"?"vertical":"horizontal"))==="vertical",E=t.slideOnHover===!0||i==="hover"||i==="with-chart",v=t.customHandle===!0||i==="custom-handle",H=i==="controlled",y=i==="with-chart",b=i==="template",g=t.disabled===!0,$=t.readonly===!0,r=t.modelValue!==void 0?t.modelValue:t.value!==void 0?t.value:50;r=Math.max(0,Math.min(100,r));let L=t.beforeImage||V,M=t.afterImage||G;function P(){let e=v?"p-compare-custom-handle":"",a=m?"p-compare-vertical":"",d=g?"p-compare-disabled":"",s="",f="";y?(s=`
                <svg class="absolute h-full w-full" viewBox="0 0 644 189" fill="none" xmlns="http://www.w3.org/2000/svg" style="width: 100%; height: 100%;">
                    <g clip-path="url(#compare_chart_clip)">
                        <path d="M0.5 118.499C0.5 118.499 82 102.999 113.5 89.4989C145 75.9989 188.444 87.7869 235 77.4989C272.684 69.1719 293.654 62.4939 329 46.9989C409.332 11.7849 479.5 86.5 510.5 78C541.5 69.5 635.951 0.848863 644 1.49886" stroke="#10b981" stroke-width="2.5" />
                        <path d="M113.5 89.5006C82 103.001 0.5 118.501 0.5 118.501V188.501H644V1.50065C635.951 0.850647 541.5 69.5 510.5 78C479.5 86.5 409.332 11.7866 329 47.0006C293.654 62.4956 272.684 69.1736 235 77.5006C188.444 87.7886 145 76.0006 113.5 89.5006Z" fill="url(#compare_chart_gradient)" />
                    </g>
                    <defs>
                        <clipPath id="compare_chart_clip">
                            <rect width="644" height="189" fill="white" />
                        </clipPath>
                        <linearGradient id="compare_chart_gradient" x1="322.25" x2="322.25" y1="1.477" y2="188.5" gradientUnits="userSpaceOnUse">
                            <stop stop-color="#10b981" stop-opacity="0.4" />
                            <stop offset="1" stop-color="#10b981" stop-opacity="0" />
                        </linearGradient>
                    </defs>
                </svg>
            `,f=`
                <div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background: var(--p-surface-50); color: var(--p-text-muted); font-size: 0.875rem;">
                    <span>Hover to reveal chart trajectory</span>
                </div>
            `):b?(s=`
                <div style="width: 100%; height: 100%; background: #f3e8ff; padding: 1.5rem; display: flex; align-items: center; justify-content: center; box-sizing: border-box;">
                    <div style="width: 100%; max-width: 18rem; border-radius: 12px; border: 1px solid #e9d5ff; background: #ffffff; padding: 1.25rem; display: flex; flex-direction: column; gap: 1rem; box-shadow: 0 4px 12px rgba(147, 51, 234, 0.1);">
                        <div style="display: flex; align-items: flex-start; justify-content: space-between;">
                            <div style="display: flex; align-items: center; gap: 0.75rem;">
                                <div style="width: 2.5rem; height: 2.5rem; border-radius: 9999px; overflow: hidden; background: #c084fc;">
                                    <img src="https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png" style="width: 100%; height: 100%; object-fit: cover; filter: hue-rotate(260deg) saturate(150%);" />
                                </div>
                                <div>
                                    <div style="font-weight: 600; color: #581c87; font-size: 0.9rem;">Amy Elsner</div>
                                    <div style="font-size: 0.75rem; color: #9333ea;">Developer</div>
                                </div>
                            </div>
                            <span style="background: #f3e8ff; color: #7e22ce; padding: 0.2rem 0.5rem; border-radius: 6px; font-size: 0.75rem; font-weight: 700;">Pro</span>
                        </div>
                        <div style="display: flex; flex-direction: column; gap: 0.35rem;">
                            <div style="display: flex; justify-content: space-between; font-size: 0.75rem;">
                                <span style="color: #9333ea;">Storage</span>
                                <span style="color: #581c87; font-weight: 600;">7.2 GB / 10 GB</span>
                            </div>
                            <div style="height: 0.5rem; width: 100%; background: #f3e8ff; border-radius: 9999px; overflow: hidden;">
                                <div style="height: 100%; width: 72%; background: #a855f7; border-radius: 9999px;"></div>
                            </div>
                        </div>
                        <div style="display: flex; gap: 0.5rem; padding-top: 0.25rem;">
                            <button type="button" class="p-button p-button-sm" style="flex: 1; padding: 0.35rem; font-size: 0.75rem; border-radius: 6px; background: #9333ea; border: 1px solid #9333ea; color: #ffffff; cursor: pointer;">Upgrade</button>
                            <button type="button" class="p-button p-button-sm p-button-outlined" style="padding: 0.35rem 0.6rem; font-size: 0.75rem; border-radius: 6px; border: 1px solid #e9d5ff; background: transparent; color: #7e22ce; cursor: pointer;">Settings</button>
                        </div>
                    </div>
                </div>
            `,f=`
                <div style="width: 100%; height: 100%; background: #ecfdf5; padding: 1.5rem; display: flex; align-items: center; justify-content: center; box-sizing: border-box;">
                    <div style="width: 100%; max-width: 18rem; border-radius: 12px; border: 1px solid #a7f3d0; background: #ffffff; padding: 1.25rem; display: flex; flex-direction: column; gap: 1rem; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.1);">
                        <div style="display: flex; align-items: flex-start; justify-content: space-between;">
                            <div style="display: flex; align-items: center; gap: 0.75rem;">
                                <div style="width: 2.5rem; height: 2.5rem; border-radius: 9999px; overflow: hidden; background: #34d399;">
                                    <img src="https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png" style="width: 100%; height: 100%; object-fit: cover;" />
                                </div>
                                <div>
                                    <div style="font-weight: 600; color: #064e3b; font-size: 0.9rem;">Amy Elsner</div>
                                    <div style="font-size: 0.75rem; color: #059669;">Developer</div>
                                </div>
                            </div>
                            <span style="background: #ecfdf5; color: #047857; padding: 0.2rem 0.5rem; border-radius: 6px; font-size: 0.75rem; font-weight: 700;">Pro</span>
                        </div>
                        <div style="display: flex; flex-direction: column; gap: 0.35rem;">
                            <div style="display: flex; justify-content: space-between; font-size: 0.75rem;">
                                <span style="color: #059669;">Storage</span>
                                <span style="color: #064e3b; font-weight: 600;">7.2 GB / 10 GB</span>
                            </div>
                            <div style="height: 0.5rem; width: 100%; background: #ecfdf5; border-radius: 9999px; overflow: hidden;">
                                <div style="height: 100%; width: 72%; background: #10b981; border-radius: 9999px;"></div>
                            </div>
                        </div>
                        <div style="display: flex; gap: 0.5rem; padding-top: 0.25rem;">
                            <button type="button" class="p-button p-button-sm" style="flex: 1; padding: 0.35rem; font-size: 0.75rem; border-radius: 6px; background: #10b981; border: 1px solid #10b981; color: #ffffff; cursor: pointer;">Upgrade</button>
                            <button type="button" class="p-button p-button-sm p-button-outlined" style="padding: 0.35rem 0.6rem; font-size: 0.75rem; border-radius: 6px; border: 1px solid #a7f3d0; background: transparent; color: #047857; cursor: pointer;">Settings</button>
                        </div>
                    </div>
                </div>
            `):(s=`<img src="${L}" alt="Before" draggable="false" />`,f=`<img src="${M}" alt="After" draggable="false" />`);let A=i==="hover"||i==="vertical"||b?B:_,I=m?"transform: rotate(90deg);":"",T=y?"height: 189px;":b?"height: 320px;":"aspect-ratio: 16/9;",z=`
            <div class="p-compare ${a} ${e} ${d} ${t.class||""}" style="max-width: 32rem; margin: 0 auto; ${T} ${t.style||""}" data-compare-root>
                <!-- Hidden Accessible Range Input -->
                <input type="range" class="p-compare-input" min="${t.min||0}" max="${t.max||100}" step="${t.step||1}" value="${r}" aria-label="${t.ariaLabel||"Compare images"}" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${r}" tabindex="0" ${g?"disabled":""} data-compare-input />

                <!-- Layer After (Base Bottom) -->
                <div class="p-compare-item p-compare-item-after" data-compare-after>
                    ${f}
                </div>

                <!-- Layer Before (Clipped Top) -->
                <div class="p-compare-item p-compare-item-before" data-compare-before>
                    ${s}
                </div>

                <!-- Divider Handle -->
                <div class="p-compare-handle" data-compare-handle>
                    <div class="p-compare-indicator" data-compare-indicator>
                        ${v?"":`<span style="${I} display: flex; align-items: center; justify-content: center;">${A}</span>`}
                    </div>
                </div>
            </div>
        `;H&&(z+=`
                <div class="p-compare-controls" style="max-width: 32rem; margin: 1rem auto 0 auto; display: flex; align-items: center; justify-content: space-between; gap: 1rem; width: 100%;">
                    <button type="button" class="p-button p-button-outlined p-button-secondary" data-compare-set="25" style="padding: 0.45rem 1rem; font-size: 0.875rem; font-weight: 600; border-radius: var(--p-border-radius); border: 1px solid var(--p-border-color); background: var(--p-surface-0); color: var(--p-text-color); cursor: pointer;">
                        25%
                    </button>
                    <div style="display: flex; align-items: center; gap: 0.25rem;">
                        <input type="number" min="0" max="100" value="${r}" class="p-inputtext p-component" data-compare-num style="width: 5rem; text-align: center; padding: 0.45rem 0.5rem; border-radius: var(--p-border-radius); border: 1px solid var(--p-border-color); background: var(--p-surface-0); color: var(--p-text-color); font-weight: 600; font-size: 0.875rem;" />
                        <span style="font-weight: 600; font-size: 0.875rem; color: var(--p-text-muted);">%</span>
                    </div>
                    <button type="button" class="p-button p-button-outlined p-button-secondary" data-compare-set="75" style="padding: 0.45rem 1rem; font-size: 0.875rem; font-weight: 600; border-radius: var(--p-border-radius); border: 1px solid var(--p-border-color); background: var(--p-surface-0); color: var(--p-text-color); cursor: pointer;">
                        75%
                    </button>
                </div>
            `),n.innerHTML=z}P();let l=n.querySelector("[data-compare-root]"),p=n.querySelector("[data-compare-input]"),x=n.querySelector("[data-compare-before]"),w=n.querySelector("[data-compare-handle]"),c=n.querySelector("[data-compare-num]");function o(e){r=Math.max(0,Math.min(100,e)),m?(x.style.clipPath=`inset(0 0 ${100-r}% 0)`,w.style.top=`${r}%`):(x.style.clipPath=`inset(0 ${100-r}% 0 0)`,w.style.left=`${r}%`),p&&(p.value=`${r}`,p.setAttribute("aria-valuenow",`${r}`)),c&&(c.value=`${Math.round(r)}`),n.dispatchEvent(new CustomEvent("compare:change",{bubbles:!0,detail:{value:r}}))}if(o(r),g||$)return;let u=!1;function h(e,a){let d=l.getBoundingClientRect();if(m){if(d.height<=0)return;let s=(a-d.top)/d.height*100;o(s)}else{if(d.width<=0)return;let s=(e-d.left)/d.width*100;o(s)}}let S=e=>{u=!0;try{l.setPointerCapture(e.pointerId)}catch{}h(e.clientX,e.clientY)},j=e=>{(E||u)&&h(e.clientX,e.clientY)},k=e=>{if(u){u=!1;try{l.releasePointerCapture(e.pointerId)}catch{}}};l.addEventListener("pointerdown",S),l.addEventListener("pointermove",j),l.addEventListener("pointerup",k),l.addEventListener("pointercancel",k),p.addEventListener("input",()=>{o(parseFloat(p.value))}),p.addEventListener("keydown",e=>{let a=t.step||1;e.key==="ArrowRight"||e.key==="ArrowDown"?(e.preventDefault(),o(r+a)):e.key==="ArrowLeft"||e.key==="ArrowUp"?(e.preventDefault(),o(r-a)):e.key==="PageUp"?(e.preventDefault(),o(r+10)):e.key==="PageDown"?(e.preventDefault(),o(r-10)):e.key==="Home"?(e.preventDefault(),o(0)):e.key==="End"&&(e.preventDefault(),o(100))}),n.querySelectorAll("[data-compare-set]").forEach(e=>{e.addEventListener("click",()=>{let a=parseFloat(e.getAttribute("data-compare-set")||"50");o(a)})}),c&&c.addEventListener("change",()=>{let e=parseFloat(c.value||"50");o(e)})}export{R as default};
