import{e as H}from"./chunk-3YU53HBK.mjs";var T=`
/* ==================== AURA SLIDER ==================== */
.laughtale-slider,
.p-slider {
    position: relative;
    user-select: none;
    touch-action: none;
    box-sizing: border-box;
    font-family: var(--p-font-family, inherit);
}

.p-slider-horizontal {
    height: 0.375rem;
    width: 100%;
    background: var(--p-surface-200, #e2e8f0);
    border-radius: 9999px;
    cursor: pointer;
    display: block;
}

.p-slider-vertical {
    width: 0.375rem;
    height: 12rem;
    background: var(--p-surface-200, #e2e8f0);
    border-radius: 9999px;
    cursor: pointer;
    display: inline-block;
}

.p-slider.is-disabled {
    opacity: 0.6;
    cursor: not-allowed !important;
    pointer-events: none;
}

/* Range Fill Bar */
.p-slider-range {
    position: absolute;
    background: var(--p-primary-500, #10b981);
    border-radius: 9999px;
    pointer-events: none;
    transition: background 150ms ease;
    display: block;
}

.p-slider-horizontal .p-slider-range {
    top: 0;
    height: 100%;
}

.p-slider-vertical .p-slider-range {
    left: 0;
    width: 100%;
    bottom: 0;
}

/* Handle */
.p-slider-handle {
    position: absolute;
    width: 1.25rem;
    height: 1.25rem;
    border-radius: 50%;
    background: var(--p-surface-0, #ffffff);
    border: 2px solid var(--p-primary-500, #10b981);
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.15), 0 1px 2px -1px rgba(0, 0, 0, 0.1);
    cursor: grab;
    outline: none;
    box-sizing: border-box;
    transition: border-color 150ms ease, box-shadow 150ms ease, transform 120ms ease;
    z-index: 10;
    display: block;
}

.p-slider-horizontal .p-slider-handle {
    top: 50%;
    transform: translate(-50%, -50%);
}

.p-slider-vertical .p-slider-handle {
    left: 50%;
    transform: translate(-50%, 50%);
}

.p-slider-handle:hover:not(.is-disabled) {
    border-color: var(--p-primary-600, #059669);
    transform: translate(-50%, -50%) scale(1.1);
}

.p-slider-vertical .p-slider-handle:hover:not(.is-disabled) {
    transform: translate(-50%, 50%) scale(1.1);
}

.p-slider-handle:focus-visible:not(.is-disabled) {
    border-color: var(--p-primary-600, #059669);
    box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.2);
}

.p-slider-handle.is-dragging {
    cursor: grabbing !important;
    transform: translate(-50%, -50%) scale(1.18) !important;
    box-shadow: 0 0 0 5px rgba(16, 185, 129, 0.25) !important;
}

.p-slider-vertical .p-slider-handle.is-dragging {
    transform: translate(-50%, 50%) scale(1.18) !important;
}

.p-slider-handle.is-disabled {
    cursor: not-allowed;
    background: var(--p-surface-200, #e2e8f0);
    border-color: var(--p-surface-400, #94a3b8);
    box-shadow: none;
}

/* ==================== DARK MODE ==================== */
.dark .p-slider-horizontal,
.dark .p-slider-vertical {
    background: var(--p-surface-700, #334155);
}
.dark .p-slider-range {
    background: var(--p-primary-400, #34d399);
}
.dark .p-slider-handle {
    background: var(--p-surface-900, #0f172a);
    border-color: var(--p-primary-400, #34d399);
}
.dark .p-slider-handle:hover:not(.is-disabled) {
    border-color: var(--p-primary-300, #6ee7b7);
}
.dark .p-slider-handle:focus-visible:not(.is-disabled) {
    border-color: var(--p-primary-300, #6ee7b7);
    box-shadow: 0 0 0 4px rgba(52, 211, 153, 0.2);
}
.dark .p-slider-handle.is-dragging {
    box-shadow: 0 0 0 5px rgba(52, 211, 153, 0.25) !important;
}
.dark .p-slider-handle.is-disabled {
    background: var(--p-surface-800, #1e293b);
    border-color: var(--p-surface-600, #475569);
}
`;function D(s,a){H("laughtale-slider",T);let d=a.min!==void 0?Number(a.min):0,m=a.max!==void 0?Number(a.max):100,g=a.step!==void 0?Number(a.step):1,v=a.range===!0||String(a.range)==="true",c=a.orientation==="vertical",p=a.disabled===!0||String(a.disabled)==="true",y=a.disabledMinHandle===!0||String(a.disabledMinHandle)==="true",x=a.disabledMaxHandle===!0||String(a.disabledMaxHandle)==="true",k=a.minStepsBetweenHandles!==void 0?Number(a.minStepsBetweenHandles):0,t=[];if(v)if(Array.isArray(a.values)&&a.values.length>=2)t=[Number(a.values[0]),Number(a.values[1])];else if(Array.isArray(a.value)&&a.value.length>=2)t=[Number(a.value[0]),Number(a.value[1])];else if(typeof a.value=="string"&&a.value.includes(",")){let e=a.value.split(",").map(r=>Number(r.trim()));t=[e[0]??d,e[1]??m]}else t=[d+(m-d)*.2,d+(m-d)*.8];else t=[a.value!==void 0?Number(a.value):d];function L(e){return Math.max(d,Math.min(m,e))}function $(e){if(g<=0)return e;let r=Math.round((e-d)/g),u=d+r*g;return Number(L(u).toFixed(4))}t=t.map(e=>$(e));function w(e){return m===d?0:Math.max(0,Math.min(100,(e-d)/(m-d)*100))}function P(){let e=["laughtale-slider","p-slider",c?"p-slider-vertical":"p-slider-horizontal",p?"is-disabled":""].filter(Boolean).join(" ");if(s.className=e,a.inputId&&s.setAttribute("id",a.inputId),v){let r=w(t[0]),u=w(t[1]),b=Math.min(r,u),h=Math.abs(u-r),E=c?`bottom: ${b}%; height: ${h}%;`:`left: ${b}%; width: ${h}%;`,i=c?`bottom: ${r}%;`:`left: ${r}%;`,l=c?`bottom: ${u}%;`:`left: ${u}%;`;s.innerHTML=`
                <span class="p-slider-range" style="${E}"></span>
                <span 
                    class="p-slider-handle ${y||p?"is-disabled":""}" 
                    data-handle="0" 
                    tabindex="${p||y?"-1":"0"}" 
                    role="slider" 
                    aria-orientation="${c?"vertical":"horizontal"}" 
                    aria-valuemin="${d}" 
                    aria-valuemax="${m}" 
                    aria-valuenow="${t[0]}"
                    style="${i}"
                ></span>
                <span 
                    class="p-slider-handle ${x||p?"is-disabled":""}" 
                    data-handle="1" 
                    tabindex="${p||x?"-1":"0"}" 
                    role="slider" 
                    aria-orientation="${c?"vertical":"horizontal"}" 
                    aria-valuemin="${d}" 
                    aria-valuemax="${m}" 
                    aria-valuenow="${t[1]}"
                    style="${l}"
                ></span>
                <input type="hidden" name="${a.name||a.targetInputName||"slider_value"}" value="${t.join(",")}" />
            `}else{let r=w(t[0]),u=c?`bottom: 0; height: ${r}%;`:`left: 0; width: ${r}%;`,b=c?`bottom: ${r}%;`:`left: ${r}%;`;s.innerHTML=`
                <span class="p-slider-range" style="${u}"></span>
                <span 
                    class="p-slider-handle ${p?"is-disabled":""}" 
                    data-handle="0" 
                    tabindex="${p?"-1":"0"}" 
                    role="slider" 
                    aria-orientation="${c?"vertical":"horizontal"}" 
                    aria-valuemin="${d}" 
                    aria-valuemax="${m}" 
                    aria-valuenow="${t[0]}"
                    style="${b}"
                ></span>
                <input type="hidden" name="${a.name||a.targetInputName||"slider_value"}" value="${t[0]}" />
            `}N()}function A(){let e=s.querySelector(".p-slider-range"),r=s.querySelectorAll(".p-slider-handle"),u=s.querySelector('input[type="hidden"]');if(v){let b=w(t[0]),h=w(t[1]),E=Math.min(b,h),i=Math.abs(h-b);e&&(c?(e.style.bottom=`${E}%`,e.style.height=`${i}%`):(e.style.left=`${E}%`,e.style.width=`${i}%`)),r[0]&&(c?r[0].style.bottom=`${b}%`:r[0].style.left=`${b}%`,r[0].setAttribute("aria-valuenow",t[0].toString())),r[1]&&(c?r[1].style.bottom=`${h}%`:r[1].style.left=`${h}%`,r[1].setAttribute("aria-valuenow",t[1].toString())),u&&(u.value=t.join(","))}else{let b=w(t[0]);e&&(c?e.style.height=`${b}%`:e.style.width=`${b}%`),r[0]&&(c?r[0].style.bottom=`${b}%`:r[0].style.left=`${b}%`,r[0].setAttribute("aria-valuenow",t[0].toString())),u&&(u.value=t[0].toString())}}function S(e=!1){let r=v?[...t]:t[0];s.dispatchEvent(new CustomEvent("slider:change",{bubbles:!0,detail:{value:r}})),s.dispatchEvent(new CustomEvent("change",{bubbles:!0,detail:{value:r}})),e&&(s.dispatchEvent(new CustomEvent("slider:slideend",{bubbles:!0,detail:{value:r}})),s.dispatchEvent(new CustomEvent("slideend",{bubbles:!0,detail:{value:r}})))}function N(){if(p)return;let e=null,r=!1,u=i=>{let l=s.getBoundingClientRect();if(c){if(l.height<=0)return 0;let f=(l.bottom-i.clientY)/l.height;return Math.max(0,Math.min(1,f))}else{if(l.width<=0)return 0;let f=(i.clientX-l.left)/l.width;return Math.max(0,Math.min(1,f))}},b=(i,l)=>{let f=d+i*(m-d),n=$(f);if(v)if(l===0){if(y)return;let o=t[1]-k;n=Math.min(n,o),n=Math.max(d,n),t[0]=n}else{if(x)return;let o=t[0]+k;n=Math.max(n,o),n=Math.min(m,n),t[1]=n}else t[0]=n;A(),S(!1)};s.onpointerdown=i=>{if(p)return;let f=i.target.closest(".p-slider-handle");if(f){let o=Number(f.getAttribute("data-handle")||0);if(o===0&&y||o===1&&x)return;e=o}else{let o=u(i),M=d+o*(m-d);if(v){let z=Math.abs(t[0]-M),I=Math.abs(t[1]-M);z<=I&&!y||x?e=0:e=1}else e=0}if(e===null)return;r=!0;let n=s.querySelector(`.p-slider-handle[data-handle="${e}"]`);n?.classList.add("is-dragging"),n?.focus();try{s.setPointerCapture(i.pointerId)}catch{}b(u(i),e)},s.onpointermove=i=>{!r||e===null||b(u(i),e)};let h=i=>{if(r){r=!1,e!==null&&s.querySelector(`.p-slider-handle[data-handle="${e}"]`)?.classList.remove("is-dragging");try{s.releasePointerCapture(i.pointerId)}catch{}S(!0),e=null}};s.onpointerup=h,s.onpointercancel=h,s.querySelectorAll(".p-slider-handle").forEach(i=>{i.onkeydown=l=>{let f=Number(i.getAttribute("data-handle")||0);if(f===0&&y||f===1&&x)return;let n=t[f],o=!1;if(l.key==="ArrowRight"||l.key==="ArrowUp"?(n=$(n+g),o=!0):l.key==="ArrowLeft"||l.key==="ArrowDown"?(n=$(n-g),o=!0):l.key==="PageUp"?(n=$(n+g*10),o=!0):l.key==="PageDown"?(n=$(n-g*10),o=!0):l.key==="Home"?(n=d,o=!0):l.key==="End"&&(n=m,o=!0),o){if(l.preventDefault(),v)if(f===0){let M=t[1]-k;t[0]=Math.min(n,M)}else{let M=t[0]+k;t[1]=Math.max(n,M)}else t[0]=n;A(),S(!1)}},i.onkeyup=l=>{["ArrowRight","ArrowUp","ArrowLeft","ArrowDown","PageUp","PageDown","Home","End"].includes(l.key)&&S(!0)}})}P()}export{D as default};
