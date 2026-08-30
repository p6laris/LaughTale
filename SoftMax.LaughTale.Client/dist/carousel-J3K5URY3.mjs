import{e as z}from"./chunk-3YU53HBK.mjs";var B=`
/* ==========================================================================
   PrimeVue 4 Aura Carousel Component Tokens & Styles
   ========================================================================== */
.p-carousel {
    display: flex;
    flex-direction: column;
    position: relative;
    box-sizing: border-box;
    width: 100%;
    font-family: var(--p-font-family, inherit);
}

.p-carousel-vertical {
    flex-direction: column;
    align-items: center;
}

.p-carousel-content {
    display: flex;
    flex-direction: row;
    width: 100%;
    position: relative;
    overflow-x: auto;
    overflow-y: hidden;
    scroll-behavior: smooth;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
    box-sizing: border-box;
    user-select: none;
    -webkit-user-select: none;
    scroll-snap-type: x mandatory;
}

.p-carousel-content::-webkit-scrollbar {
    display: none;
    width: 0;
    height: 0;
}

/* Vertical Carousel Content Flow */
.p-carousel-vertical .p-carousel-content {
    flex-direction: column !important;
    overflow-x: hidden !important;
    overflow-y: auto !important;
    scroll-snap-type: y mandatory !important;
}

/* Alignments */
.p-carousel-align-start .p-carousel-item {
    scroll-snap-align: start;
}
.p-carousel-align-center .p-carousel-item {
    scroll-snap-align: center;
}
.p-carousel-align-end .p-carousel-item {
    scroll-snap-align: end;
}

/* Items & Cards */
.p-carousel-item {
    flex: 0 0 auto;
    box-sizing: border-box;
    display: flex;
    align-items: stretch;
    transition: opacity 280ms cubic-bezier(0.16, 1, 0.3, 1),
                transform 280ms cubic-bezier(0.16, 1, 0.3, 1);
}

/* Number Card Box */
.p-carousel-card-num {
    height: 100%;
    width: 100%;
    font-size: 3rem;
    font-weight: 700;
    background: var(--p-surface-50, #f8fafc);
    color: var(--p-surface-950, #0f172a);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border-radius: var(--p-border-radius, 12px);
    border: 1px solid var(--p-border-color, #e2e8f0);
    box-sizing: border-box;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
    transition: background-color 200ms ease, border-color 200ms ease, transform 200ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 200ms ease;
}

.p-carousel-card-num:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.dark .p-carousel-card-num,
[data-theme="dark"] .p-carousel-card-num {
    background: var(--p-surface-950, #020617);
    color: var(--p-surface-0, #ffffff);
    border-color: var(--p-surface-800, #1e293b);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

/* Bottom Bar (Indicators + Prev/Next Controls) */
.p-carousel-footer-bar {
    display: flex;
    align-items: center;
    margin-top: 1rem;
    gap: 1rem;
    width: 100%;
}

.p-carousel-indicator-list {
    display: flex;
    align-items: center;
    gap: var(--p-carousel-indicator-list-gap, 0.5rem);
    padding: var(--p-carousel-indicator-list-padding, 0.25rem 0);
    margin: 0;
    list-style: none;
}

.p-carousel-indicator {
    display: inline-flex;
}

.p-carousel-indicator-button {
    width: var(--p-carousel-indicator-width, 1.75rem);
    height: var(--p-carousel-indicator-height, 0.375rem);
    border-radius: var(--p-carousel-indicator-border-radius, 9999px);
    background: var(--p-carousel-indicator-background, var(--p-surface-200, #e2e8f0));
    border: none;
    cursor: pointer;
    padding: 0;
    transition: background-color 280ms cubic-bezier(0.16, 1, 0.3, 1),
                transform 280ms cubic-bezier(0.16, 1, 0.3, 1),
                width 280ms cubic-bezier(0.16, 1, 0.3, 1);
    outline: none;
}

.dark .p-carousel-indicator-button,
[data-theme="dark"] .p-carousel-indicator-button {
    background: var(--p-surface-700, #334155);
}

.p-carousel-indicator-button:hover {
    background: var(--p-carousel-indicator-hover-background, var(--p-surface-400, #94a3b8));
}

.p-carousel-indicator-button.p-carousel-indicator-active {
    background: var(--p-carousel-indicator-active-background, var(--p-primary-color, #10b981));
    width: 2.5rem;
}

/* Navigation Buttons */
.p-carousel-nav-group {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 0.5rem;
    flex: 1;
}

.p-carousel-prev,
.p-carousel-next {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2.25rem;
    height: 2.25rem;
    border-radius: 9999px;
    border: 1px solid var(--p-border-color, #e2e8f0);
    background: var(--p-surface-0, #ffffff);
    color: var(--p-text-muted, #64748b);
    cursor: pointer;
    transition: background-color 180ms ease, color 180ms ease, opacity 180ms ease, transform 140ms cubic-bezier(0.16, 1, 0.3, 1);
    outline: none;
    padding: 0;
    box-sizing: border-box;
    flex-shrink: 0;
}

.dark .p-carousel-prev,
.dark .p-carousel-next,
[data-theme="dark"] .p-carousel-prev,
[data-theme="dark"] .p-carousel-next {
    background: var(--p-surface-800, #1e293b);
    border-color: var(--p-surface-700, #334155);
    color: var(--p-surface-400, #94a3b8);
}

.p-carousel-prev:hover:not(:disabled),
.p-carousel-next:hover:not(:disabled) {
    background: var(--p-surface-100, #f1f5f9);
    color: var(--p-text-color, #0f172a);
}

.dark .p-carousel-prev:hover:not(:disabled),
.dark .p-carousel-next:hover:not(:disabled),
[data-theme="dark"] .p-carousel-prev:hover:not(:disabled),
[data-theme="dark"] .p-carousel-next:hover:not(:disabled) {
    background: var(--p-surface-700, #334155);
    color: var(--p-surface-0, #ffffff);
}

.p-carousel-prev:active:not(:disabled),
.p-carousel-next:active:not(:disabled) {
    transform: scale(0.9);
}

.p-carousel-prev:disabled,
.p-carousel-next:disabled {
    opacity: 0.35;
    cursor: not-allowed;
}

/* Gallery Thumbnails */
.p-carousel-gallery-thumb {
    cursor: pointer;
    border-radius: var(--p-border-radius, 8px);
    overflow: hidden;
    transition: opacity 220ms ease, transform 220ms cubic-bezier(0.16, 1, 0.3, 1), border-color 220ms ease;
    border: 2px solid transparent;
}
.p-carousel-gallery-thumb.p-carousel-thumb-active {
    border-color: var(--p-primary-color, #10b981);
    opacity: 1 !important;
}
.p-carousel-gallery-thumb:not(.p-carousel-thumb-active) {
    opacity: 0.55;
}
.p-carousel-gallery-thumb:not(.p-carousel-thumb-active):hover {
    opacity: 0.85;
}
`,j='<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>',W='<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>',N='<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m18 15-6-6-6 6"/></svg>',R='<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>',_=["https://images.unsplash.com/photo-1589656966895-2f33e7653819?q=80&w=1470&auto=format&fit=crop","https://images.unsplash.com/photo-1518717758536-85ae29035b6d?q=80&w=1470&auto=format&fit=crop","https://images.unsplash.com/photo-1704905832963-37d6f12654b7?q=80&w=1470&auto=format&fit=crop","https://images.unsplash.com/photo-1470130623320-9583a8d06241?q=80&w=2070&auto=format&fit=crop","https://images.unsplash.com/photo-1678841446310-d045487ef299?q=80&w=1470&auto=format&fit=crop","https://images.unsplash.com/photo-1497752531616-c3afd9760a11?q=80&w=1470&auto=format&fit=crop","https://images.unsplash.com/photo-1511885663737-eea53f6d6187?q=80&w=1374&auto=format&fit=crop","https://images.unsplash.com/photo-1598439210625-5067c578f3f6?q=80&w=1472&auto=format&fit=crop","https://images.unsplash.com/photo-1638255402906-e838358069ab?q=80&w=1631&auto=format&fit=crop"];function V(c,s){z("carousel",B);let d=s.demoType||"basic",h=s.align||(d==="alignment"?"start":"center"),v=(s.orientation||(d==="orientation"?"vertical":"horizontal"))==="vertical",y=s.slidesPerPage!==void 0?s.slidesPerPage:d==="alignment"?1.5:d==="orientation"?1.3:d==="loop"?1.75:1,L=s.loop===!0||d==="loop",$=s.autoSize===!0||d==="variable",w=s.spacing!==void 0?s.spacing:16,l=s.slide||0,u=5,E=[];if(d==="variable")E=["120px","80px","200px","160px","220px","180px","280px","100px"],u=E.length;else if(d==="gallery"){let i=s.galleryImages||_;A(i);return}function P(){let i=v?`height: calc((240px - ${w*(Math.ceil(y)-1)}px) / ${y}); width: 100%; flex: 0 0 auto;`:$?"height: 100%; flex: 0 0 auto;":`width: calc((100% - ${w*(Math.ceil(y)-1)}px) / ${y}); height: 100%; flex: 0 0 auto;`,e=Array.from({length:u},(n,t)=>{let a=$?`width: ${E[t]};`:"";return`
                <div class="p-carousel-item" style="${i} ${a}" role="group" aria-roledescription="slide" aria-label="Slide ${t+1} of ${u}" data-slide-index="${t}">
                    <div class="p-carousel-card-num">
                        <span>${t+1}</span>
                    </div>
                </div>
            `}).join(""),r=Array.from({length:u},(n,t)=>`
            <li class="p-carousel-indicator">
                <button type="button" class="p-carousel-indicator-button ${t===l?"p-carousel-indicator-active":""}" aria-label="Slide ${t+1}" data-indicator-index="${t}" ${t===l?'aria-current="true"':""}></button>
            </li>
        `).join("");return v?`
                <div class="p-carousel p-carousel-vertical p-carousel-align-${h} ${s.class||""}" role="region" aria-roledescription="carousel" aria-label="Vertical Content Slider" style="max-width: 24rem; margin: 0 auto; display: flex; flex-direction: column; align-items: center; gap: 1.5rem; ${s.style||""}">
                    <button type="button" class="p-carousel-prev" aria-label="Previous slide" data-carousel-prev>
                        ${N}
                    </button>
                    <div class="p-carousel-content" style="height: 240px; width: 100%; flex-direction: column; overflow-y: auto; overflow-x: hidden; gap: ${w}px;" data-carousel-content>
                        ${e}
                    </div>
                    <button type="button" class="p-carousel-next" aria-label="Next slide" data-carousel-next>
                        ${R}
                    </button>
                </div>
            `:`
            <div class="p-carousel p-carousel-align-${h} ${s.class||""}" role="region" aria-roledescription="carousel" aria-label="Content Slider" style="max-width: 36rem; margin: 0 auto; ${s.style||""}">
                <div class="p-carousel-content" style="height: ${$?"140px":"240px"}; width: 100%; gap: ${w}px;" data-carousel-content>
                    ${e}
                </div>
                <div class="p-carousel-footer-bar">
                    <ul class="p-carousel-indicator-list">
                        ${r}
                    </ul>
                    <div class="p-carousel-nav-group">
                        <button type="button" class="p-carousel-prev" aria-label="Previous slide" data-carousel-prev>
                            ${j}
                        </button>
                        <button type="button" class="p-carousel-next" aria-label="Next slide" data-carousel-next>
                            ${W}
                        </button>
                    </div>
                </div>
            </div>
        `}function A(i){c.innerHTML=`
            <div class="p-carousel-gallery-container" style="max-width: 42rem; margin: 0 auto; width: 100%;">
                <!-- Main Stage Photo Carousel -->
                <div class="p-carousel p-carousel-align-center" data-main-carousel style="width: 100%; border-radius: var(--p-border-radius, 12px); overflow: hidden; border: 1px solid var(--p-border-color);">
                    <div class="p-carousel-content" style="height: 396px; width: 100%;" data-main-content>
                        ${i.map((t,a)=>`
                            <div class="p-carousel-item" style="width: 100%; height: 100%; flex-shrink: 0;" data-slide-index="${a}">
                                <img src="${t}" alt="Polar Bear in Nature ${a+1}" draggable="false" style="width: 100%; height: 100%; object-fit: cover; select-none;" />
                            </div>
                        `).join("")}
                    </div>
                </div>

                <!-- Synchronized Thumbnail Strip -->
                <div class="p-carousel p-carousel-align-center" data-thumb-carousel style="margin-top: 0.75rem; width: 100%;">
                    <div class="p-carousel-content" style="height: 90px; width: 100%; gap: 8px;" data-thumb-content>
                        ${i.map((t,a)=>`
                            <div class="p-carousel-item p-carousel-gallery-thumb ${a===l?"p-carousel-thumb-active":""}" style="width: calc((100% - 24px) / 4); height: 100%; flex-shrink: 0;" data-thumb-index="${a}">
                                <img src="${t}" alt="Thumbnail ${a+1}" draggable="false" style="width: 100%; height: 100%; object-fit: cover; border-radius: 6px;" />
                            </div>
                        `).join("")}
                    </div>
                </div>
            </div>
        `;let e=c.querySelector("[data-main-content]"),r=c.querySelector("[data-thumb-content]");function n(t){if(l=t,e){let a=e.querySelector(`[data-slide-index="${t}"]`);a&&e.scrollTo({left:a.offsetLeft,behavior:"smooth"})}if(r){r.querySelectorAll(".p-carousel-gallery-thumb").forEach((f,p)=>{p===t?f.classList.add("p-carousel-thumb-active"):f.classList.remove("p-carousel-thumb-active")});let a=r.querySelector(`[data-thumb-index="${t}"]`);a&&r.scrollTo({left:a.offsetLeft-r.clientWidth/2+a.clientWidth/2,behavior:"smooth"})}}if(c.querySelectorAll("[data-thumb-index]").forEach(t=>{t.addEventListener("click",()=>{let a=parseInt(t.getAttribute("data-thumb-index")||"0",10);n(a)})}),e){let t=null;e.addEventListener("scroll",()=>{clearTimeout(t),t=setTimeout(()=>{let a=e.scrollLeft,f=e.querySelectorAll("[data-slide-index]"),p=0,m=1/0;f.forEach((T,H)=>{let I=Math.abs(T.offsetLeft-a);I<m&&(m=I,p=H)}),p!==l&&(l=p,r&&r.querySelectorAll(".p-carousel-gallery-thumb").forEach((T,H)=>{H===l?T.classList.add("p-carousel-thumb-active"):T.classList.remove("p-carousel-thumb-active")}))},80)})}}c.innerHTML=P();let o=c.querySelector("[data-carousel-content]"),b=c.querySelector("[data-carousel-prev]"),g=c.querySelector("[data-carousel-next]"),C=c.querySelectorAll("[data-indicator-index]");function M(){if(!o||h!=="center")return;let i=o.querySelector('[data-slide-index="0"]'),e=o.querySelector(`[data-slide-index="${u-1}"]`);if(!(!i||!e))if(v){let r=Math.max(0,o.clientHeight/2-i.offsetHeight/2),n=Math.max(0,o.clientHeight/2-e.offsetHeight/2);o.style.paddingTop=`${r}px`,o.style.paddingBottom=`${n}px`}else{let r=Math.max(0,o.clientWidth/2-i.offsetWidth/2),n=Math.max(0,o.clientWidth/2-e.offsetWidth/2);o.style.paddingLeft=`${r}px`,o.style.paddingRight=`${n}px`}}setTimeout(M,20),window.addEventListener("resize",M);let k=!1,q=null;function x(i){if(!o)return;let e=o.querySelector(`[data-slide-index="${i}"]`);if(e){if(l=Math.max(0,Math.min(u-1,i)),k=!0,clearTimeout(q),v){let r=e.offsetTop;h==="center"?r=e.offsetTop-o.clientHeight/2+e.offsetHeight/2:h==="end"&&(r=e.offsetTop-o.clientHeight+e.offsetHeight),o.scrollTo({top:Math.max(0,r),behavior:"smooth"})}else{let r=e.offsetLeft;h==="center"?r=e.offsetLeft-o.clientWidth/2+e.offsetWidth/2:h==="end"&&(r=e.offsetLeft-o.clientWidth+e.offsetWidth),o.scrollTo({left:Math.max(0,r),behavior:"smooth"})}S(),q=setTimeout(()=>{k=!1},400)}}function S(){C.forEach((i,e)=>{e===l?(i.classList.add("p-carousel-indicator-active"),i.setAttribute("aria-current","true")):(i.classList.remove("p-carousel-indicator-active"),i.removeAttribute("aria-current"))}),L?(b&&(b.disabled=!1),g&&(g.disabled=!1)):(b&&(b.disabled=l<=0),g&&(g.disabled=l>=u-1))}if(b&&b.addEventListener("click",()=>{l>0?x(l-1):L&&x(u-1)}),g&&g.addEventListener("click",()=>{l<u-1?x(l+1):L&&x(0)}),C.forEach(i=>{i.addEventListener("click",()=>{let e=parseInt(i.getAttribute("data-indicator-index")||"0",10);x(e)})}),o){let i=null;o.addEventListener("scroll",()=>{k||(clearTimeout(i),i=setTimeout(()=>{if(k)return;let e=o.querySelectorAll("[data-slide-index]"),r=0,n=1/0;if(v){let t=o.scrollTop+o.clientHeight/2;e.forEach((a,f)=>{let p=a.offsetTop+a.offsetHeight/2,m=Math.abs(p-t);m<n&&(n=m,r=f)})}else{let t=o.scrollLeft+o.clientWidth/2;e.forEach((a,f)=>{let p=a.offsetLeft+a.offsetWidth/2,m=Math.abs(p-t);m<n&&(n=m,r=f)})}r!==l&&(l=r,S())},80))})}S()}export{V as default};
