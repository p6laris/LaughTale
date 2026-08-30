import{a as D}from"./chunk-WCJSCUNY.mjs";import{a as q}from"./chunk-ZALOY5NO.mjs";import{a as T}from"./chunk-6OO3425Y.mjs";import{b as h}from"./chunk-P6B5FGGY.mjs";import{e as M}from"./chunk-3YU53HBK.mjs";var W=`
.laughtale-autocomplete {
    position: relative;
    display: inline-flex;
    align-items: stretch;
    font-family: var(--p-font-family, inherit);
    box-sizing: border-box;
}
.laughtale-autocomplete.fluid {
    width: 100%;
}
.laughtale-autocomplete:not(.fluid) {
    width: 100%;
    max-width: 320px;
}

.ac-input-container {
    display: flex;
    align-items: center;
    flex: 1;
    min-width: 0;
    background: var(--p-surface-0);
    border: 1px solid var(--p-border-color);
    border-radius: var(--p-border-radius);
    transition: border-color 0.15s ease, box-shadow 0.15s ease, background 0.15s ease;
    box-sizing: border-box;
    cursor: text;
    position: relative;
}
.laughtale-autocomplete.has-dropdown .ac-input-container {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
}
.ac-input-container.variant-filled {
    background: var(--p-surface-50);
}
.ac-input-container.focused {
    border-color: var(--p-primary-500);
    box-shadow: 0 0 0 1px var(--p-primary-500);
    z-index: 2;
}
.ac-input-container.invalid {
    border-color: #ef4444 !important;
    box-shadow: 0 0 0 1px #ef4444 !important;
}
.ac-input-container.disabled {
    background: var(--p-surface-100);
    opacity: 0.65;
    cursor: not-allowed;
}

/* Sizes */
.ac-input-container.size-small {
    min-height: 2rem;
    padding: 0 0.5rem;
    font-size: 0.75rem;
}
.ac-input-container.size-normal {
    min-height: 2.5rem;
    padding: 0 0.75rem;
    font-size: 0.875rem;
}
.ac-input-container.size-large {
    min-height: 3rem;
    padding: 0 1rem;
    font-size: 1rem;
}

.ac-chips-wrapper {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.35rem;
    flex: 1;
    min-width: 0;
    padding: 0.25rem 0;
}
.ac-chip {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    background: var(--p-surface-100);
    color: var(--p-text-color);
    border-radius: calc(var(--p-border-radius) - 2px);
    padding: 0.15rem 0.45rem;
    font-size: 0.75rem;
    font-weight: 500;
}
.ac-chip-remove {
    display: flex;
    align-items: center;
    cursor: pointer;
    color: var(--p-text-muted);
    border: none;
    background: transparent;
    padding: 0;
    font-size: 0.75rem;
}
.ac-chip-remove:hover {
    color: #ef4444;
}

.ac-input {
    flex: 1;
    min-width: 60px;
    border: none;
    outline: none;
    background: transparent;
    color: var(--p-text-color);
    font-family: inherit;
    font-size: inherit;
    padding: 0.35rem 0;
}
.ac-input::placeholder {
    color: var(--p-text-muted);
}
.ac-input:disabled {
    cursor: not-allowed;
}

.ac-btn-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    background: transparent;
    color: var(--p-text-muted);
    cursor: pointer;
    padding: 0.25rem;
    border-radius: 50%;
    transition: color 0.15s ease, background 0.15s ease;
    flex-shrink: 0;
    margin-left: 0.25rem;
}
.ac-btn-icon:hover {
    color: var(--p-text-color);
    background: var(--p-surface-100);
}

.ac-dropdown-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: 1px solid var(--p-border-color);
    border-left: none;
    background: var(--p-surface-100);
    color: var(--p-text-muted);
    border-top-right-radius: var(--p-border-radius);
    border-bottom-right-radius: var(--p-border-radius);
    cursor: pointer;
    padding: 0 0.85rem;
    transition: background 0.15s ease, color 0.15s ease, border-color 0.15s ease;
    flex-shrink: 0;
    box-sizing: border-box;
}
.ac-dropdown-btn:hover {
    background: var(--p-surface-200);
    color: var(--p-text-color);
}
.ac-dropdown-btn:disabled {
    cursor: not-allowed;
    opacity: 0.65;
}

/* Sizes for dropdown button */
.size-small + .ac-dropdown-btn,
.laughtale-autocomplete .ac-dropdown-btn.size-small {
    padding: 0 0.6rem;
}
.size-large + .ac-dropdown-btn,
.laughtale-autocomplete .ac-dropdown-btn.size-large {
    padding: 0 1.1rem;
}

/* Floating Overlay Panel */
.ac-overlay {
    position: absolute;
    top: calc(100% + 4px);
    left: 0;
    right: 0;
    z-index: 1000;
    background: var(--p-surface-0);
    border: 1px solid var(--p-border-color);
    border-radius: var(--p-border-radius);
    box-shadow: var(--p-shadow-lg);
    overflow-y: auto;
    padding: 0.35rem;
    display: none;
    box-sizing: border-box;
}
.ac-group-header {
    font-size: 0.725rem;
    font-weight: 700;
    color: var(--p-text-muted);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    padding: 0.5rem 0.65rem 0.25rem;
    user-select: none;
}
.ac-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.5rem 0.75rem;
    border-radius: calc(var(--p-border-radius) - 2px);
    color: var(--p-text-color);
    cursor: pointer;
    transition: background 0.15s ease, color 0.15s ease;
    font-size: 0.875rem;
    user-select: none;
    gap: 0.5rem;
}
.ac-item:hover, .ac-item.highlighted {
    background: var(--p-surface-100);
}
.ac-item.selected {
    background: var(--p-primary-50);
    color: var(--p-primary-700);
    font-weight: 600;
}
.ac-item.disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

/* Dark Mode Aware Tokens */
.dark .ac-input-container {
    background: var(--p-surface-900);
    border-color: var(--p-surface-700);
    color: var(--p-surface-0);
}
.dark .ac-input-container.variant-filled {
    background: var(--p-surface-800);
}
.dark .ac-chip {
    background: var(--p-surface-800);
    color: var(--p-surface-100);
}
.dark .ac-dropdown-btn {
    background: var(--p-surface-800);
    border-color: var(--p-surface-700);
    color: var(--p-surface-300);
}
.dark .ac-dropdown-btn:hover {
    background: var(--p-surface-700);
    color: var(--p-surface-0);
}
.dark .ac-overlay {
    background: var(--p-surface-900);
    border-color: var(--p-surface-700);
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5);
}
.dark .ac-item:hover, .dark .ac-item.highlighted {
    background: var(--p-surface-800);
    color: var(--p-surface-0);
}
.dark .ac-item.selected {
    background: rgba(16, 185, 129, 0.15);
    color: #6ee7b7;
}
`;function J(d,r){M("autocomplete",W);let g=r.suggestions||r.items||[],f=r.multiple===!0,B=r.showClear!==!1,C=r.dropdown===!0,N=r.forceSelection===!0,z=r.size||"normal",j=r.variant||"outlined",P=r.scrollHeight||"14rem",a=f?Array.isArray(r.value)?r.value:r.value?[r.value]:[]:r.value?[r.value]:[],u="",p=-1;function E(){if(!u)return g;let e=u.toLowerCase();return g.filter(t=>t.label.toLowerCase().includes(e)||t.value.toLowerCase().includes(e)||t.subtitle&&t.subtitle.toLowerCase().includes(e)||t.group&&t.group.toLowerCase().includes(e)||t.category&&t.category.toLowerCase().includes(e))}d.innerHTML=`
        <div class="laughtale-autocomplete ${r.fluid?"fluid":""} ${C?"has-dropdown":""}">
            <div class="ac-input-container size-${z} variant-${j} ${r.invalid?"invalid":""} ${r.disabled?"disabled":""}">
                <div class="ac-chips-wrapper">
                    <input type="text" 
                           class="ac-input" 
                           role="combobox"
                           aria-autocomplete="list"
                           aria-expanded="false"
                           placeholder="${a.length===0?r.placeholder||"Search...":""}" 
                           ${r.disabled?"disabled":""} />
                </div>
                
                ${r.loading?`
                    <span class="ac-btn-icon" style="animation: spin 1s linear infinite;">
                        ${h.loader2||"\u23F3"}
                    </span>
                `:""}

                ${B?`
                    <button type="button" class="ac-btn-icon ac-btn-clear" style="display: none;" title="Clear value">
                        ${h.x}
                    </button>
                `:""}
            </div>

            ${C?`
                <button type="button" class="ac-dropdown-btn size-${z}" ${r.disabled?"disabled":""} title="Show all suggestions">
                    <span style="display: flex; width: 16px; height: 16px;">${h.chevronDown}</span>
                </button>
            `:""}

            <!-- Suggestions Overlay -->
            <div class="ac-overlay" style="max-height: ${P};"></div>
        </div>
    `;let w=d.querySelector(".ac-input-container"),I=d.querySelector(".ac-chips-wrapper"),o=d.querySelector(".ac-input"),L=d.querySelector(".ac-btn-clear"),V=d.querySelector(".ac-dropdown-btn"),b=d.querySelector(".ac-overlay"),i=T({defaultIsOpen:!1,onOpen:()=>{b.style.display="block",o.setAttribute("aria-expanded","true"),S()},onClose:()=>{b.style.display="none",o.setAttribute("aria-expanded","false"),p=-1,N&&!f&&u&&(g.find(t=>t.label.toLowerCase()===u.toLowerCase())||(o.value=a[0]&&g.find(t=>t.value===a[0])?.label||"",u=""))}});q(d,()=>{i.close(),w.classList.remove("focused")});function x(){if(!f){if(a[0]){let e=g.find(t=>t.value===a[0]);o.value=e?e.label:a[0]}else o.value="";$();return}I.querySelectorAll(".ac-chip").forEach(e=>e.remove()),a.forEach(e=>{let t=g.find(c=>c.value===e)||{label:e,value:e},n=document.createElement("span");n.className="ac-chip",n.innerHTML=`
                <span>${t.label}</span>
                <button type="button" class="ac-chip-remove" data-remove="${t.value}">&times;</button>
            `,n.querySelector(".ac-chip-remove")?.addEventListener("click",c=>{c.stopPropagation(),O(t.value)}),I.insertBefore(n,o)}),o.placeholder=a.length===0?r.placeholder||"Search...":"",$()}function $(){if(!L)return;let e=f?a.length>0:a.length>0||o.value.length>0;L.style.display=e&&!r.disabled?"flex":"none"}function S(){let e=E();if(e.length===0){b.innerHTML='<div style="padding: 0.75rem; text-align: center; color: var(--p-text-muted); font-size: 0.8125rem;">No results found</div>';return}let t={},n=!1;e.forEach(l=>{let s=l.group||l.category||"";s&&(n=!0),t[s]||(t[s]=[]),t[s].push(l)});let c="",m=0;n?Object.entries(t).forEach(([l,s])=>{l&&(c+=`<div class="ac-group-header">${l}</div>`),s.forEach(v=>{c+=A(v,m++)})}):e.forEach(l=>{c+=A(l,m++)}),b.innerHTML=c,b.querySelectorAll(".ac-item").forEach(l=>{l.addEventListener("click",()=>{let s=l.getAttribute("data-value"),v=g.find(G=>G.value===s);v&&!v.disabled&&H(v)}),l.addEventListener("mouseenter",()=>{let s=Number(l.getAttribute("data-idx"));y(s)})})}function A(e,t){let n=a.includes(e.value),c=t===p,m="";e.avatar?m=`<span style="width: 26px; height: 26px; border-radius: 50%; background: var(--p-primary-600); color: #fff; display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 700; flex-shrink: 0;">${e.avatar}</span>`:e.icon&&h[e.icon]&&(m=`<span style="display: flex; width: 16px; height: 16px; color: var(--p-primary-600); flex-shrink: 0;">${h[e.icon]}</span>`);let l="";e.status&&(l=`<span style="width: 8px; height: 8px; border-radius: 50%; background: ${e.status==="online"?"#10b981":e.status==="away"?"#f59e0b":"#94a3b8"}; margin-right: 0.35rem; display: inline-block;"></span>`);let s="";return e.shortcut?s=`<span style="font-size: 0.725rem; background: var(--p-surface-200); padding: 0.1rem 0.35rem; border-radius: 4px; color: var(--p-text-muted); font-family: monospace;">${e.shortcut}</span>`:e.count!==void 0&&(s=`<span class="aura-tag tag-slate" style="font-size: 0.6875rem;">${e.count}</span>`),`
            <div class="ac-item ${n?"selected":""} ${c?"highlighted":""} ${e.disabled?"disabled":""}" 
                 data-value="${e.value}" 
                 data-idx="${t}" 
                 role="option" 
                 aria-selected="${n}">
                <div style="display: flex; align-items: center; gap: 0.5rem; overflow: hidden;">
                    ${m}
                    <div style="display: flex; flex-direction: column; overflow: hidden;">
                        <span style="font-weight: ${n?"700":"500"}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                            ${l}${e.label}
                        </span>
                        ${e.subtitle?`<span style="font-size: 0.75rem; color: var(--p-text-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${e.subtitle}</span>`:""}
                    </div>
                </div>
                ${s}
            </div>
        `}function y(e){p=e,b.querySelectorAll(".ac-item").forEach((n,c)=>{c===e?(n.classList.add("highlighted"),n.scrollIntoView({block:"nearest"})):n.classList.remove("highlighted")})}function H(e){f?(a.includes(e.value)||a.push(e.value),u="",o.value="",x(),i.close(),k(),o.focus()):(a=[e.value],u="",o.value=e.label,i.close(),x(),k())}function O(e){a=a.filter(t=>t!==e),x(),k()}let F=D(()=>{u=o.value,u.trim().length>0?i.isOpen?S():i.open():i.isOpen&&i.close(),$()},150);o.addEventListener("input",()=>{F()}),o.addEventListener("focus",()=>{w.classList.add("focused")}),o.addEventListener("blur",()=>{w.classList.remove("focused")}),o.addEventListener("keydown",e=>{let t=E();if(e.key==="ArrowDown")if(e.preventDefault(),!i.isOpen)i.open();else{let n=p<t.length-1?p+1:0;y(n)}else if(e.key==="ArrowUp"){if(e.preventDefault(),i.isOpen){let n=p>0?p-1:t.length-1;y(n)}}else e.key==="Enter"?i.isOpen&&p>=0&&t[p]&&(e.preventDefault(),H(t[p])):e.key==="Escape"?i.close():e.key==="Backspace"&&f&&o.value===""&&a.length>0?O(a[a.length-1]):e.key==="Home"&&i.isOpen?(e.preventDefault(),y(0)):e.key==="End"&&i.isOpen&&(e.preventDefault(),y(t.length-1))}),L?.addEventListener("click",e=>{e.stopPropagation(),a=[],u="",o.value="",x(),k(),i.close(),o.focus()}),V?.addEventListener("click",e=>{e.stopPropagation(),i.isOpen?i.close():(u="",i.open(),o.focus())}),w.addEventListener("click",()=>{o.focus()});function k(){if(r.targetInputName){let e=d.querySelector(`input[name="${r.targetInputName}"]`);e||(e=document.createElement("input"),e.type="hidden",e.name=r.targetInputName,d.appendChild(e)),e.value=f?JSON.stringify(a):a[0]||""}d.dispatchEvent(new CustomEvent("autocomplete:change",{bubbles:!0,detail:{value:f?a:a[0]||""}}))}x()}export{J as default};
