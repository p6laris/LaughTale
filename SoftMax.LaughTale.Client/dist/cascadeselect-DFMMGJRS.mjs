import{a as q}from"./chunk-ZALOY5NO.mjs";import{a as M}from"./chunk-6OO3425Y.mjs";import{b as c}from"./chunk-P6B5FGGY.mjs";import{e as H}from"./chunk-3YU53HBK.mjs";var B=`
.laughtale-cascadeselect {
    position: relative;
    display: inline-flex;
    font-family: var(--p-font-family, inherit);
    box-sizing: border-box;
}
.laughtale-cascadeselect.fluid {
    width: 100%;
}
.laughtale-cascadeselect:not(.fluid) {
    width: 100%;
    max-width: 280px;
}

.cs-trigger {
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
.cs-trigger.variant-filled {
    background: var(--p-surface-50);
}
.cs-trigger.focused {
    border-color: var(--p-primary-500);
    box-shadow: 0 0 0 1px var(--p-primary-500);
}
.cs-trigger.invalid {
    border-color: #ef4444 !important;
    box-shadow: 0 0 0 1px #ef4444 !important;
}
.cs-trigger.disabled {
    background: var(--p-surface-100);
    opacity: 0.65;
    cursor: not-allowed;
}

/* Sizes */
.cs-trigger.size-small {
    min-height: 2rem;
    padding: 0 0.5rem;
    font-size: 0.75rem;
}
.cs-trigger.size-normal {
    min-height: 2.5rem;
    padding: 0 0.75rem;
    font-size: 0.875rem;
}
.cs-trigger.size-large {
    min-height: 3rem;
    padding: 0 1rem;
    font-size: 1rem;
}

.cs-label {
    flex: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: var(--p-text-color);
}
.cs-label.placeholder {
    color: var(--p-text-muted);
}

.cs-actions {
    display: flex;
    align-items: center;
    gap: 0.35rem;
    flex-shrink: 0;
}
.cs-btn-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    background: transparent;
    color: var(--p-text-muted);
    cursor: pointer;
    padding: 0.2rem;
    border-radius: 50%;
    transition: color 0.15s ease, background 0.15s ease;
}
.cs-btn-icon:hover {
    color: var(--p-text-color);
    background: var(--p-surface-100);
}
.cs-chevron {
    display: flex;
    align-items: center;
    color: var(--p-text-muted);
    transition: transform 0.2s ease;
}
.cs-trigger.focused .cs-chevron {
    transform: rotate(180deg);
}

/* Cascade Overlay Panels */
.cs-overlay {
    position: absolute;
    top: calc(100% + 4px);
    left: 0;
    width: 100%;
    min-width: 100%;
    z-index: 1000;
    display: none;
    box-sizing: border-box;
}

.cs-panel {
    background: var(--p-surface-0);
    border: 1px solid var(--p-border-color);
    border-radius: var(--p-border-radius);
    box-shadow: var(--p-shadow-lg);
    width: 100%;
    min-width: 100%;
    padding: 0.35rem;
    box-sizing: border-box;
}

.cs-item {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.5rem 0.75rem;
    border-radius: calc(var(--p-border-radius) - 2px);
    color: var(--p-text-color);
    cursor: pointer;
    font-size: 0.875rem;
    user-select: none;
    transition: background 150ms cubic-bezier(0.4, 0, 0.2, 1), color 150ms ease;
    gap: 0.5rem;
}
.cs-item:hover, .cs-item.highlighted {
    background: var(--p-surface-100);
}
.cs-item.selected {
    background: var(--p-primary-50);
    color: var(--p-primary-700);
    font-weight: 600;
}
.cs-item.disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.cs-sub-panel {
    display: none;
    position: absolute;
    top: 0;
    left: calc(100% + 2px);
    z-index: 1001;
    background: var(--p-surface-0);
    border: 1px solid var(--p-border-color);
    border-radius: var(--p-border-radius);
    box-shadow: var(--p-shadow-lg);
    width: 100%;
    min-width: 100%;
    padding: 0.35rem;
    box-sizing: border-box;
}

/* Dark Mode Tokens */
.dark .cs-trigger {
    background: var(--p-surface-900);
    border-color: var(--p-surface-700);
    color: var(--p-surface-0);
}
.dark .cs-trigger.variant-filled {
    background: var(--p-surface-800);
}
.dark .cs-panel, .dark .cs-sub-panel {
    background: var(--p-surface-900);
    border-color: var(--p-surface-700);
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5);
}
.dark .cs-item:hover, .dark .cs-item.highlighted {
    background: var(--p-surface-800);
    color: var(--p-surface-0);
}
.dark .cs-item.selected {
    background: rgba(16, 185, 129, 0.15);
    color: #6ee7b7;
}
`;function D(l,a){H("cascadeselect",B);let S=a.options||[],I=a.size||"normal",j=a.variant||"outlined",O=a.showClear===!0,i=a.value||null,o="";function f(e){return e.cname||e.name||e.label||String(e.code||e.value||"")}function y(e){return String(e.code||e.value||e.cname||e.name||e.label||"")}function w(e){return e.children||e.items||e.states||e.cities||null}function C(e,r){for(let p of e){let m=w(p);if(m&&m.length>0){let t=C(m,r);if(t)return t}else if(y(p)===String(r))return f(p)}return null}i&&(o=C(S,i)||String(i)),l.innerHTML=`
        <div class="laughtale-cascadeselect ${a.fluid?"fluid":""}">
            <!-- Trigger -->
            <div class="cs-trigger size-${I} variant-${j} ${a.invalid?"invalid":""} ${a.disabled?"disabled":""}" 
                 tabindex="${a.disabled?-1:0}" 
                 role="combobox" 
                 aria-expanded="false" 
                 aria-haspopup="tree">
                <span class="cs-label ${o?"":"placeholder"}">
                    ${o||a.placeholder||"Select a City"}
                </span>
                
                <div class="cs-actions">
                    ${a.loading?`
                        <span class="cs-btn-icon" style="animation: spin 1s linear infinite;">
                            ${c.loader2||"\u23F3"}
                        </span>
                    `:""}

                    ${O?`
                        <button type="button" class="cs-btn-icon cs-btn-clear" style="display: ${o?"flex":"none"};" title="Clear value">
                            ${c.x}
                        </button>
                    `:""}

                    <span class="cs-chevron">
                        ${c.chevronDown}
                    </span>
                </div>
            </div>

            <!-- Cascade Overlay Container -->
            <div class="cs-overlay">
                <div class="cs-panel cs-level-0"></div>
            </div>
        </div>
    `;let d=l.querySelector(".cs-trigger"),v=l.querySelector(".cs-label"),T=l.querySelector(".cs-btn-clear"),L=l.querySelector(".cs-overlay"),P=l.querySelector(".cs-level-0"),u=M({defaultIsOpen:!1,onOpen:()=>{L.style.display="block",d.classList.add("focused"),d.setAttribute("aria-expanded","true"),E(S,P,0,[])},onClose:()=>{L.style.display="none",d.classList.remove("focused"),d.setAttribute("aria-expanded","false")}});q(l,()=>u.close());function $(){T&&(T.style.display=o&&!a.disabled?"flex":"none")}function E(e,r,p,m){r.innerHTML=e.map((t,k)=>{let g=f(t),h=y(t),b=w(t),x=b&&b.length>0,s=i!==null&&h===String(i),n="";return t.icon&&c[t.icon]?n=`<span style="display: flex; width: 16px; height: 16px; color: var(--p-primary-600); margin-right: 0.4rem;">${c[t.icon]}</span>`:t.image&&(n=`<img src="${t.image}" alt="" style="width: 18px; height: 18px; border-radius: 2px; margin-right: 0.4rem; object-fit: cover;" />`),`
                <div class="cs-item ${s?"selected":""} ${t.disabled?"disabled":""}" 
                     data-idx="${k}" 
                     data-val="${h}" 
                     role="treeitem" 
                     aria-expanded="false">
                    <div style="display: flex; align-items: center; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                        ${n}
                        <span>${g}</span>
                    </div>
                    ${x?`
                        <span style="color: var(--p-text-muted); display: flex; width: 14px; height: 14px; margin-left: 0.5rem;">
                            ${c.chevronRight}
                        </span>
                        <div class="cs-sub-panel cs-level-${p+1}"></div>
                    `:""}
                </div>
            `}).join(""),r.querySelectorAll(":scope > .cs-item").forEach((t,k)=>{let g=e[k],h=f(g),b=w(g),x=[...m,h];if(b&&b.length>0){let s=t.querySelector(".cs-sub-panel"),n=null;t.addEventListener("mouseenter",()=>{clearTimeout(n),r.querySelectorAll(":scope > .cs-item > .cs-sub-panel").forEach(z=>{z!==s&&(z.style.display="none")}),E(b,s,p+1,x),s.style.display="block",s.getBoundingClientRect().right>window.innerWidth?(s.style.left="auto",s.style.right="calc(100% + 2px)"):(s.style.left="calc(100% + 2px)",s.style.right="auto")}),t.addEventListener("mouseleave",()=>{n=setTimeout(()=>{s.style.display="none"},150)}),s.addEventListener("mouseenter",()=>{clearTimeout(n)})}else t.addEventListener("click",s=>{s.stopPropagation(),!g.disabled&&A(g,x)})})}function A(e,r){i=y(e),o=f(e),v.textContent=o,v.classList.remove("placeholder"),$(),u.close(),N(r)}d.addEventListener("click",()=>{a.disabled||u.toggle()}),d.addEventListener("keydown",e=>{a.disabled||(e.key===" "||e.key==="Enter"||e.key==="ArrowDown"?(e.preventDefault(),u.isOpen||u.open()):e.key==="Escape"&&u.close())}),T?.addEventListener("click",e=>{e.stopPropagation(),i=null,o="",v.textContent=a.placeholder||"Select a City",v.classList.add("placeholder"),$(),N([])});function N(e){if(a.targetInputName){let r=l.querySelector(`input[name="${a.targetInputName}"]`);r||(r=document.createElement("input"),r.type="hidden",r.name=a.targetInputName,l.appendChild(r)),r.value=i!==null?String(i):""}l.dispatchEvent(new CustomEvent("cascadeselect:change",{bubbles:!0,detail:{value:i,label:o,path:e}}))}}export{D as default};
