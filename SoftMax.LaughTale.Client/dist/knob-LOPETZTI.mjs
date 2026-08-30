import{e as $}from"./chunk-3YU53HBK.mjs";var V=`
[data-theme="dark"] .laughtale-knob {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
[data-theme="dark"] .knob-progress-circle {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
[data-theme="dark"] .knob-value-display {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
`;function q(i,e){$("knob",V);let s=e.min!==void 0?e.min:0,u=e.max!==void 0?e.max:100,h=e.step||1,r=e.size||96,d=8,m=(r-d)/2,g=2*Math.PI*m,b=e.valueTemplate||"{value}%",o=e.value!==void 0?e.value:s;function E(t){let c=Math.max(0,Math.min(1,(t-s)/(u-s)));return g*(1-c)}let L=E(o),M=b.replace("{value}",o.toString());i.innerHTML=`
        <div class="laughtale-knob" style="position: relative; display: inline-flex; align-items: center; justify-content: center; width: ${r}px; height: ${r}px; user-select: none; cursor: ${e.disabled?"not-allowed":"pointer"}; touch-action: none;">
            <svg width="${r}" height="${r}" style="transform: rotate(-90deg); pointer-events: none;">
                <!-- Background Circle -->
                <circle cx="${r/2}" cy="${r/2}" r="${m}" fill="transparent" stroke="var(--p-surface-200)" stroke-width="${d}" />
                <!-- Progress Arc -->
                <circle class="knob-progress-circle" cx="${r/2}" cy="${r/2}" r="${m}" fill="transparent" stroke="${e.color||"var(--p-primary-600)"}" stroke-width="${d}" stroke-linecap="round" stroke-dasharray="${g}" stroke-dashoffset="${L}" style="transition: stroke-dashoffset 0.05s ease;" />
            </svg>
            <span class="knob-value-display" style="position: absolute; font-size: ${r*.2}px; font-weight: 700; color: var(--p-surface-900); pointer-events: none;">
                ${M}
            </span>
        </div>
    `;let a=i.querySelector(".laughtale-knob"),w=i.querySelector(".knob-progress-circle"),x=i.querySelector(".knob-value-display");function I(){w.style.strokeDashoffset=`${E(o)}`,x.textContent=b.replace("{value}",o.toString())}function k(){if(e.targetInputName){let t=i.querySelector(`input[name="${e.targetInputName}"]`);t||(t=document.createElement("input"),t.type="hidden",t.name=e.targetInputName,i.appendChild(t)),t.value=o.toString()}i.dispatchEvent(new CustomEvent("knob:change",{bubbles:!0,detail:{value:o}}))}if(!e.disabled){let t=!1,c=(n,p)=>{let l=a.getBoundingClientRect();if(l.width<=0)return;let C=l.left+l.width/2,S=l.top+l.height/2,f=Math.atan2(p-S,n-C)*(180/Math.PI)+90,T=f<0?f+360:f,z=Math.min(1,Math.max(0,T/360)),H=s+z*(u-s);o=Math.round(H/h)*h,o=Math.max(s,Math.min(u,o)),I(),k()},y=n=>{if(t=!0,"setPointerCapture"in a&&n.pointerId!==void 0)try{a.setPointerCapture(n.pointerId)}catch{}c(n.clientX,n.clientY)},P=n=>{t&&c(n.clientX,n.clientY)},v=n=>{if(t&&(t=!1,"releasePointerCapture"in a&&n.pointerId!==void 0))try{a.releasePointerCapture(n.pointerId)}catch{}};a.addEventListener("pointerdown",y),a.addEventListener("pointermove",P),a.addEventListener("pointerup",v),a.addEventListener("pointercancel",v),a.addEventListener("mousedown",y),window.addEventListener("mousemove",P),window.addEventListener("mouseup",v)}k()}export{q as default};
