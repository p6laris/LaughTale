import{a as J}from"./chunk-ZALOY5NO.mjs";import{a as C}from"./chunk-6OO3425Y.mjs";import{b as f}from"./chunk-P6B5FGGY.mjs";import{e as B}from"./chunk-3YU53HBK.mjs";var Q=`
.laughtale-datepicker {
    position: relative;
    display: inline-flex;
    font-family: var(--p-font-family, inherit);
    box-sizing: border-box;
}
.laughtale-datepicker.fluid {
    width: 100%;
}
.laughtale-datepicker:not(.fluid) {
    width: 100%;
    max-width: 280px;
}
.laughtale-datepicker.inline {
    display: inline-block;
    width: auto;
    max-width: none;
}

.dp-trigger {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    background: var(--p-surface-0);
    border: 1px solid var(--p-border-color);
    border-radius: var(--p-border-radius);
    color: var(--p-text-color);
    cursor: pointer;
    user-select: none;
    transition: border-color 0.15s ease, box-shadow 0.15s ease, background 0.15s ease;
    box-sizing: border-box;
    gap: 0.5rem;
}
.dp-trigger.variant-filled {
    background: var(--p-surface-50);
}
.dp-trigger.focused {
    border-color: var(--p-primary-500);
    box-shadow: 0 0 0 1px var(--p-primary-500);
}
.dp-trigger.invalid {
    border-color: #ef4444 !important;
    box-shadow: 0 0 0 1px #ef4444 !important;
}
.dp-trigger.disabled {
    background: var(--p-surface-100);
    opacity: 0.65;
    cursor: not-allowed;
}

/* Sizes */
.dp-trigger.size-small {
    min-height: 2rem;
    padding: 0 0.5rem;
    font-size: 0.75rem;
}
.dp-trigger.size-normal {
    min-height: 2.5rem;
    padding: 0 0.75rem;
    font-size: 0.875rem;
}
.dp-trigger.size-large {
    min-height: 3rem;
    padding: 0 1rem;
    font-size: 1rem;
}

.dp-label {
    flex: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: var(--p-text-color);
}
.dp-label.placeholder {
    color: var(--p-text-muted);
}
.dp-icon {
    display: flex;
    align-items: center;
    color: var(--p-text-muted);
}

/* Overlay & Panel */
.dp-overlay {
    position: absolute;
    top: calc(100% + 4px);
    left: 0;
    z-index: 1000;
    display: none;
}
.dp-panel {
    background: var(--p-surface-0);
    border: 1px solid var(--p-border-color);
    border-radius: var(--p-border-radius);
    box-shadow: var(--p-shadow-lg);
    padding: 0.875rem;
    width: 19rem;
    box-sizing: border-box;
}
.laughtale-datepicker.inline .dp-panel {
    box-shadow: var(--p-shadow-sm);
    display: block !important;
}

/* Header */
.dp-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0.75rem;
}
.dp-nav-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    border: none;
    background: transparent;
    color: var(--p-text-color);
    cursor: pointer;
    transition: background 150ms ease;
}
.dp-nav-btn:hover {
    background: var(--p-surface-100);
}
.dp-title-btn {
    border: none;
    background: transparent;
    font-weight: 600;
    font-size: 0.9375rem;
    color: var(--p-text-color);
    cursor: pointer;
    padding: 0.25rem 0.5rem;
    border-radius: calc(var(--p-border-radius) - 2px);
    transition: background 150ms ease;
}
.dp-title-btn:hover {
    background: var(--p-surface-100);
}

/* Calendar Grid */
.dp-weekdays {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    text-align: center;
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--p-text-muted);
    margin-bottom: 0.5rem;
}
.dp-days-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 2px;
}
.dp-day-cell {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 2.25rem;
    width: 100%;
    border-radius: 50%;
    border: none;
    background: transparent;
    color: var(--p-text-color);
    font-size: 0.8125rem;
    cursor: pointer;
    transition: background 120ms ease, color 120ms ease;
    box-sizing: border-box;
    user-select: none;
}
.dp-day-cell:hover:not(.disabled):not(.selected) {
    background: var(--p-surface-100);
}
.dp-day-cell.other-month {
    color: var(--p-text-muted);
    opacity: 0.4;
}
.dp-day-cell.today:not(.selected) {
    border: 1px solid var(--p-primary-500);
    font-weight: 700;
}
.dp-day-cell.selected {
    background: var(--p-primary-500) !important;
    color: #ffffff !important;
    font-weight: 700;
}
.dp-day-cell.in-range {
    background: var(--p-primary-50);
    color: var(--p-primary-700);
    border-radius: 0;
}
.dp-day-cell.range-start {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
}
.dp-day-cell.range-end {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
}
.dp-day-cell.disabled {
    opacity: 0.3;
    cursor: not-allowed;
    pointer-events: none;
}

/* Month / Year Grid */
.dp-month-grid, .dp-year-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.5rem;
    padding: 0.5rem 0;
}
.dp-view-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.75rem 0.5rem;
    border-radius: calc(var(--p-border-radius) - 2px);
    border: none;
    background: transparent;
    color: var(--p-text-color);
    font-size: 0.875rem;
    cursor: pointer;
    transition: background 150ms ease;
}
.dp-view-btn:hover {
    background: var(--p-surface-100);
}
.dp-view-btn.selected {
    background: var(--p-primary-500);
    color: #ffffff;
    font-weight: 700;
}

/* Time Picker Section */
.dp-timepicker {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    border-top: 1px solid var(--p-border-color);
    padding-top: 0.75rem;
    margin-top: 0.75rem;
}
.dp-time-col {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.25rem;
}
.dp-time-val {
    font-size: 1rem;
    font-weight: 600;
    color: var(--p-text-color);
    min-width: 2rem;
    text-align: center;
}
.dp-time-btn {
    border: none;
    background: transparent;
    color: var(--p-text-muted);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.15rem;
    border-radius: 4px;
}
.dp-time-btn:hover {
    background: var(--p-surface-100);
    color: var(--p-text-color);
}
.dp-ampm-btn {
    border: 1px solid var(--p-border-color);
    background: var(--p-surface-50);
    color: var(--p-text-color);
    border-radius: 4px;
    padding: 0.25rem 0.5rem;
    font-size: 0.75rem;
    font-weight: 700;
    cursor: pointer;
}

/* Button Bar */
.dp-buttonbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-top: 1px solid var(--p-border-color);
    padding-top: 0.65rem;
    margin-top: 0.75rem;
}
.dp-bar-btn {
    border: none;
    background: transparent;
    color: var(--p-primary-600);
    font-weight: 600;
    font-size: 0.8125rem;
    cursor: pointer;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    transition: background 150ms ease;
}
.dp-bar-btn:hover {
    background: var(--p-primary-50);
}

/* Dark Mode Tokens */
.dark .dp-trigger {
    background: var(--p-surface-900);
    border-color: var(--p-surface-700);
    color: var(--p-surface-0);
}
.dark .dp-trigger.variant-filled {
    background: var(--p-surface-800);
}
.dark .dp-panel {
    background: var(--p-surface-900);
    border-color: var(--p-surface-700);
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5);
}
.dark .dp-nav-btn:hover, .dark .dp-title-btn:hover, .dark .dp-day-cell:hover:not(.disabled):not(.selected), .dark .dp-view-btn:hover {
    background: var(--p-surface-800);
    color: var(--p-surface-0);
}
.dark .dp-day-cell.in-range {
    background: rgba(16, 185, 129, 0.15);
    color: #6ee7b7;
}
.dark .dp-day-cell.selected, .dark .dp-view-btn.selected {
    background: var(--p-primary-500) !important;
    color: var(--p-surface-950) !important;
}
.dark .dp-timepicker, .dark .dp-buttonbar {
    border-color: var(--p-surface-700);
}
.dark .dp-ampm-btn {
    background: var(--p-surface-800);
    border-color: var(--p-surface-700);
}
.dark .dp-bar-btn {
    color: #6ee7b7;
}
.dark .dp-bar-btn:hover {
    background: rgba(16, 185, 129, 0.15);
}
`,X=["January","February","March","April","May","June","July","August","September","October","November","December"],Z=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],ee=["Su","Mo","Tu","We","Th","Fr","Sa"];function te(b,o){B("datepicker",Q);let y=o.selectionMode||"single",s=o.view||"date",D=o.inline===!0,F=o.timeOnly===!0,k=o.showTime===!0||F,$=o.hourFormat==="12",r=V(o.value),d=r.length>0?new Date(r[0]):new Date,u=r.length>0?r[0].getHours():new Date().getHours(),v=r.length>0?r[0].getMinutes():new Date().getMinutes(),M=u>=12,S=o.minDate?new Date(o.minDate):null,E=o.maxDate?new Date(o.maxDate):null;function V(e){if(!e)return[];if(Array.isArray(e))return e.map(t=>new Date(t)).filter(t=>!isNaN(t.getTime()));let a=new Date(e);return isNaN(a.getTime())?[]:[a]}function h(e){let a=e.getFullYear(),t=String(e.getMonth()+1).padStart(2,"0"),n=String(e.getDate()).padStart(2,"0"),l=`${a}-${t}-${n}`;if(k){let c=$?e.getHours()%12||12:e.getHours(),p=String(e.getMinutes()).padStart(2,"0"),i=e.getHours()>=12?" PM":" AM";l+=` ${String(c).padStart(2,"0")}:${p}${$?i:""}`}return l}function z(){return r.length===0?"":y==="range"?r.length===1?h(r[0])+" - ...":`${h(r[0])} - ${h(r[1])}`:y==="multiple"?r.map(e=>h(e)).join(", "):h(r[0])}function w(e,a){return e.getFullYear()===a.getFullYear()&&e.getMonth()===a.getMonth()&&e.getDate()===a.getDate()}function R(e){return!!(S&&e<new Date(S.getFullYear(),S.getMonth(),S.getDate())||E&&e>new Date(E.getFullYear(),E.getMonth(),E.getDate(),23,59,59))}function g(){let e=z(),a=o.size||"normal",t=o.variant||"outlined";if(D){b.innerHTML=`
                <div class="laughtale-datepicker inline">
                    <div class="dp-panel">
                        ${I()}
                    </div>
                </div>
            `,q(b.querySelector(".dp-panel"));return}b.innerHTML=`
            <div class="laughtale-datepicker ${o.fluid?"fluid":""}">
                <div class="dp-trigger size-${a} variant-${t} ${o.invalid?"invalid":""} ${o.disabled?"disabled":""}" 
                     tabindex="${o.disabled?-1:0}" 
                     role="combobox" 
                     aria-expanded="false">
                    <span class="dp-label ${e?"":"placeholder"}">
                        ${e||o.placeholder||"Select Date..."}
                    </span>
                    ${o.showIcon!==!1?`
                        <span class="dp-icon">
                            ${f.calendar}
                        </span>
                    `:""}
                </div>

                <div class="dp-overlay">
                    <div class="dp-panel">
                        ${I()}
                    </div>
                </div>
            </div>
        `;let n=b.querySelector(".dp-trigger"),l=b.querySelector(".dp-overlay"),c=b.querySelector(".dp-panel"),p=C({defaultIsOpen:!1,onOpen:()=>{l.style.display="block",n.classList.add("focused"),n.setAttribute("aria-expanded","true")},onClose:()=>{l.style.display="none",n.classList.remove("focused"),n.setAttribute("aria-expanded","false")}});J(b,()=>p.close()),n.addEventListener("click",()=>{o.disabled||p.toggle()}),n.addEventListener("keydown",i=>{o.disabled||(i.key===" "||i.key==="Enter"||i.key==="ArrowDown"?(i.preventDefault(),p.open()):i.key==="Escape"&&p.close())}),q(c,p)}function I(){if(F)return Y();let e=d.getFullYear(),a=d.getMonth(),t="";return s==="date"?t=G(e,a):s==="month"?t=U(e):t=W(e),`
            <div class="dp-header">
                <button type="button" class="dp-nav-btn btn-prev" aria-label="Previous">
                    ${f.chevronLeft}
                </button>
                <button type="button" class="dp-title-btn btn-title">
                    ${s==="date"?`${X[a]} ${e}`:s==="month"?`${e}`:`${Math.floor(e/10)*10} - ${Math.floor(e/10)*10+9}`}
                </button>
                <button type="button" class="dp-nav-btn btn-next" aria-label="Next">
                    ${f.chevronRight}
                </button>
            </div>

            ${t}

            ${k?Y():""}

            ${o.showButtonBar?`
                <div class="dp-buttonbar">
                    <button type="button" class="dp-bar-btn btn-today">Today</button>
                    <button type="button" class="dp-bar-btn btn-clear">Clear</button>
                </div>
            `:""}
        `}function G(e,a){let t=new Date(e,a,1).getDay(),n=new Date(e,a+1,0).getDate(),l=new Date(e,a,0).getDate(),c=new Date,p="";for(let i=t-1;i>=0;i--){let m=l-i,A=new Date(e,a-1,m);p+=`<button type="button" class="dp-day-cell other-month disabled" disabled>${m}</button>`}for(let i=1;i<=n;i++){let m=new Date(e,a,i),A=w(m,c),_=R(m),T=!1,j=!1,N=!1,O=!1;if(y==="range"&&r.length>0){let P=r[0],H=r[1];w(m,P)?(T=!0,N=!0):H&&w(m,H)?(T=!0,O=!0):H&&m>P&&m<H&&(j=!0)}else T=r.some(P=>w(P,m));let K=["dp-day-cell",A?"today":"",T?"selected":"",j?"in-range":"",N?"range-start":"",O?"range-end":"",_?"disabled":""].filter(Boolean).join(" ");p+=`<button type="button" class="${K}" data-day="${i}">${i}</button>`}return`
            <div class="dp-weekdays">
                ${ee.map(i=>`<span>${i}</span>`).join("")}
            </div>
            <div class="dp-days-grid">
                ${p}
            </div>
        `}function U(e){return`
            <div class="dp-month-grid">
                ${Z.map((a,t)=>`<button type="button" class="dp-view-btn ${r.some(l=>l.getFullYear()===e&&l.getMonth()===t)?"selected":""}" data-month="${t}">${a}</button>`).join("")}
            </div>
        `}function W(e){let a=Math.floor(e/10)*10,t=[];for(let n=a-1;n<=a+10;n++)t.push(n);return`
            <div class="dp-year-grid">
                ${t.map(n=>`<button type="button" class="dp-view-btn ${r.some(c=>c.getFullYear()===n)?"selected":""}" data-year="${n}">${n}</button>`).join("")}
            </div>
        `}function Y(){let e=$?u%12||12:u;return`
            <div class="dp-timepicker">
                <div class="dp-time-col">
                    <button type="button" class="dp-time-btn btn-hour-up">${f.chevronUp}</button>
                    <span class="dp-time-val">${String(e).padStart(2,"0")}</span>
                    <button type="button" class="dp-time-btn btn-hour-down">${f.chevronDown}</button>
                </div>
                <span style="font-weight: 700; color: var(--p-text-muted);">:</span>
                <div class="dp-time-col">
                    <button type="button" class="dp-time-btn btn-min-up">${f.chevronUp}</button>
                    <span class="dp-time-val">${String(v).padStart(2,"0")}</span>
                    <button type="button" class="dp-time-btn btn-min-down">${f.chevronDown}</button>
                </div>
                ${$?`
                    <button type="button" class="dp-ampm-btn btn-ampm">${M?"PM":"AM"}</button>
                `:""}
            </div>
        `}function q(e,a){e.querySelector(".btn-prev")?.addEventListener("click",t=>{t.stopPropagation(),s==="date"?d.setMonth(d.getMonth()-1):s==="month"?d.setFullYear(d.getFullYear()-1):d.setFullYear(d.getFullYear()-10),g()}),e.querySelector(".btn-next")?.addEventListener("click",t=>{t.stopPropagation(),s==="date"?d.setMonth(d.getMonth()+1):s==="month"?d.setFullYear(d.getFullYear()+1):d.setFullYear(d.getFullYear()+10),g()}),e.querySelector(".btn-title")?.addEventListener("click",t=>{t.stopPropagation(),s==="date"?s="month":s==="month"?s="year":s="date",g()}),e.querySelectorAll(".dp-day-cell:not(.disabled):not(.other-month)").forEach(t=>{t.addEventListener("click",n=>{n.stopPropagation();let l=parseInt(t.dataset.day||"1",10),c=new Date(d.getFullYear(),d.getMonth(),l,u,v);if(y==="range")r.length===0||r.length===2?r=[c]:(c<r[0]?r=[c,r[0]]:r.push(c),!D&&!k&&a&&a.close());else if(y==="multiple"){let p=r.findIndex(i=>w(i,c));p>=0?r.splice(p,1):r.push(c)}else r=[c],!D&&!k&&a&&a.close();L(),g()})}),e.querySelectorAll(".dp-month-grid .dp-view-btn").forEach(t=>{t.addEventListener("click",n=>{n.stopPropagation();let l=parseInt(t.dataset.month||"0",10);d.setMonth(l),s="date",g()})}),e.querySelectorAll(".dp-year-grid .dp-view-btn").forEach(t=>{t.addEventListener("click",n=>{n.stopPropagation();let l=parseInt(t.dataset.year||"2026",10);d.setFullYear(l),s="month",g()})}),e.querySelector(".btn-hour-up")?.addEventListener("click",t=>{t.stopPropagation(),u=(u+1)%24,x()}),e.querySelector(".btn-hour-down")?.addEventListener("click",t=>{t.stopPropagation(),u=(u-1+24)%24,x()}),e.querySelector(".btn-min-up")?.addEventListener("click",t=>{t.stopPropagation(),v=(v+1)%60,x()}),e.querySelector(".btn-min-down")?.addEventListener("click",t=>{t.stopPropagation(),v=(v-1+60)%60,x()}),e.querySelector(".btn-ampm")?.addEventListener("click",t=>{t.stopPropagation(),M=!M,u=M?u%12+12:u%12,x()}),e.querySelector(".btn-today")?.addEventListener("click",t=>{t.stopPropagation();let n=new Date;r=[n],d=new Date(n),L(),!D&&!k&&a&&a.close(),g()}),e.querySelector(".btn-clear")?.addEventListener("click",t=>{t.stopPropagation(),r=[],L(),g()})}function x(){r.length>0&&r.forEach(e=>{e.setHours(u),e.setMinutes(v)}),L(),g()}function L(){if(o.targetInputName){let e=b.querySelector(`input[name="${o.targetInputName}"]`);e||(e=document.createElement("input"),e.type="hidden",e.name=o.targetInputName,b.appendChild(e)),e.value=r.map(a=>h(a)).join(",")}b.dispatchEvent(new CustomEvent("datepicker:change",{bubbles:!0,detail:{dates:r,value:r.map(e=>h(e)),formatted:z()}}))}g()}export{te as default};
