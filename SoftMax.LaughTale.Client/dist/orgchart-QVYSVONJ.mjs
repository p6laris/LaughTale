import{e as O}from"./chunk-3YU53HBK.mjs";var J=`
.p-organizationchart {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    overflow-x: auto;
    font-family: var(--p-font-family, inherit);
    padding: 1.5rem 0.5rem;
    color: var(--p-surface-800, #1e293b);
}

.p-organizationchart-table {
    border-collapse: separate;
    border-spacing: 0;
    margin: 0 auto;
    table-layout: fixed;
    width: 100%;
}

.p-organizationchart-node-cell {
    text-align: center;
    vertical-align: top;
    padding: 0 0.5rem;
}

.p-organizationchart-node {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    position: relative;
    background: var(--p-surface-0, #ffffff);
    border: 1px solid var(--p-surface-200, #e2e8f0);
    border-radius: var(--p-border-radius-lg, 8px);
    padding: 0.75rem 1.25rem;
    min-width: 9.5rem;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    transition: background-color 0.12s ease, border-color 0.12s ease, color 0.12s ease, box-shadow 0.12s ease;
    user-select: none;
    overflow: visible !important;
}

.p-organizationchart-node.p-organizationchart-selectable {
    cursor: pointer;
}
.p-organizationchart-node.p-organizationchart-selectable:hover:not(.p-highlight) {
    background: var(--p-surface-50, #f8fafc);
    border-color: var(--p-surface-300, #cbd5e1);
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
}

.p-organizationchart-node.p-highlight {
    background: rgba(16, 185, 129, 0.08) !important;
    border-color: var(--p-primary-500, #10b981) !important;
    color: var(--p-primary-700, #047857) !important;
    font-weight: 600;
}

/* Connector Lines */
.p-organizationchart-lines {
    height: 20px;
}
.p-organizationchart-lines td {
    height: 20px;
    padding: 0 !important;
    margin: 0 !important;
    font-size: 0 !important;
    line-height: 0 !important;
    box-sizing: border-box;
}

.p-organizationchart-line-down {
    width: 1px;
    height: 20px;
    background-color: var(--p-surface-300, #cbd5e1);
    margin: 0 auto;
}

.p-organizationchart-line-left {
    border-right: 1px solid var(--p-surface-300, #cbd5e1);
}

.p-organizationchart-line-right {
    /* Transparent vertical seam */
}

.p-organizationchart-line-top {
    border-top: 1px solid var(--p-surface-300, #cbd5e1);
}

/* Toggle / Collapse Button */
.p-organizationchart-node-toggle-button {
    position: absolute;
    bottom: -0.6875rem;
    left: 50%;
    transform: translateX(-50%);
    width: 1.375rem;
    height: 1.375rem;
    border-radius: 9999px;
    background: var(--p-surface-0, #ffffff);
    border: 1px solid var(--p-surface-300, #cbd5e1);
    color: var(--p-surface-600, #475569);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 10;
    padding: 0;
    outline: none;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.08);
    transition: background-color 0.12s ease, border-color 0.12s ease, color 0.12s ease;
}
.p-organizationchart-node-toggle-button:hover {
    background: var(--p-surface-100, #f1f5f9);
    border-color: var(--p-primary-500, #10b981);
    color: var(--p-primary-600, #059669);
}

/* Checkbox */
.p-checkbox-box {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 1.125rem;
    height: 1.125rem;
    border-radius: var(--p-border-radius-xs, 4px);
    border: 2px solid var(--p-surface-300, #cbd5e1);
    background: var(--p-surface-0, #ffffff);
    cursor: pointer;
    transition: background-color 0.12s ease, border-color 0.12s ease;
    flex-shrink: 0;
    margin-right: 0.625rem;
}
.p-checkbox-box.p-checked {
    background: var(--p-primary-500, #10b981);
    border-color: var(--p-primary-500, #10b981);
    color: #ffffff;
}
.p-checkbox-box.p-indeterminate {
    background: var(--p-primary-500, #10b981);
    border-color: var(--p-primary-500, #10b981);
    color: #ffffff;
}

/* Custom Card Content */
.p-orgchart-card-content {
    display: flex;
    align-items: center;
    gap: 0.625rem;
    text-align: left;
}
.p-orgchart-avatar {
    width: 2.25rem;
    height: 2.25rem;
    border-radius: 9999px;
    background: var(--p-primary-100, #d1fae5);
    color: var(--p-primary-700, #047857);
    font-weight: 700;
    font-size: 0.8125rem;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}
.p-orgchart-icon-box {
    width: 2.25rem;
    height: 2.25rem;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}
.p-orgchart-details {
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
}
.p-orgchart-label {
    font-weight: 600;
    font-size: 0.875rem;
    color: var(--p-surface-900, #0f172a);
    line-height: 1.25;
}
.p-orgchart-desc {
    font-size: 0.75rem;
    color: var(--p-surface-500, #64748b);
    line-height: 1.2;
}

/* Dark Mode Tokens */
.dark .p-organizationchart,
[data-theme="dark"] .p-organizationchart {
    color: var(--p-surface-100, #f1f5f9) !important;
}
.dark .p-organizationchart-node,
[data-theme="dark"] .p-organizationchart-node {
    background: var(--p-surface-900, #0f172a) !important;
    border-color: var(--p-surface-700, #334155) !important;
    color: var(--p-surface-100, #f1f5f9) !important;
}
.dark .p-organizationchart-node.p-organizationchart-selectable:hover:not(.p-highlight),
[data-theme="dark"] .p-organizationchart-node.p-organizationchart-selectable:hover:not(.p-highlight) {
    background: var(--p-surface-800, #1e293b) !important;
    border-color: var(--p-surface-600, #475569) !important;
}
.dark .p-organizationchart-node.p-highlight,
[data-theme="dark"] .p-organizationchart-node.p-highlight {
    background: rgba(16, 185, 129, 0.15) !important;
    border-color: var(--p-primary-500, #10b981) !important;
    color: var(--p-primary-400, #34d399) !important;
}
.dark .p-organizationchart-line-down,
.dark .p-organizationchart-line-left,
.dark .p-organizationchart-line-top,
[data-theme="dark"] .p-organizationchart-line-down,
[data-theme="dark"] .p-organizationchart-line-left,
[data-theme="dark"] .p-organizationchart-line-top {
    background-color: var(--p-surface-700, #334155) !important;
    border-color: var(--p-surface-700, #334155) !important;
}
.dark .p-organizationchart-node-toggle-button,
[data-theme="dark"] .p-organizationchart-node-toggle-button {
    background: var(--p-surface-800, #1e293b) !important;
    border-color: var(--p-surface-600, #475569) !important;
    color: var(--p-surface-300, #cbd5e1) !important;
}
.dark .p-orgchart-label,
[data-theme="dark"] .p-orgchart-label {
    color: var(--p-surface-100, #f1f5f9) !important;
}
.dark .p-orgchart-desc,
[data-theme="dark"] .p-orgchart-desc {
    color: var(--p-surface-400, #94a3b8) !important;
}
`,g={chevronDown:'<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>',chevronUp:'<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m18 15-6-6-6 6"/></svg>',plus:'<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>',minus:'<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/></svg>',check:'<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',cloud:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/></svg>',server:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="8" x="2" y="2" rx="2" ry="2"/><rect width="20" height="8" x="2" y="14" rx="2" ry="2"/><line x1="6" x2="6.01" y1="6" y2="6"/><line x1="6" x2="6.01" y1="18" y2="18"/></svg>',database:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5V19A9 3 0 0 0 21 19V5"/><path d="M3 12A9 3 0 0 0 21 12"/></svg>',globe:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>',shield:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/></svg>',box:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>',bolt:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/></svg>'};function _(i,n){O("orgchart",J);let f=n.value||n.root||{key:"0",label:"Founder",children:[{key:"0-0",label:"Product Lead",children:[{key:"0-0-0",label:"UX/UI Designer"},{key:"0-0-1",label:"Product Manager"}]},{key:"0-1",label:"Engineering Lead",children:[{key:"0-1-0",label:"Frontend Developer"},{key:"0-1-1",label:"Backend Developer"}]}]},w=!!n.collapsible,p=n.selectionMode||"none",b=p!=="none",B=n.toggleIcon||"chevron",d=new Set;n.collapsedKeys&&(Array.isArray(n.collapsedKeys)?n.collapsedKeys.forEach(e=>d.add(String(e))):typeof n.collapsedKeys=="object"&&Object.entries(n.collapsedKeys).forEach(([e,t])=>{t&&d.add(e)}));let o=new Set,h=new Set;n.selectionKeys&&(Array.isArray(n.selectionKeys)?n.selectionKeys.forEach(e=>o.add(String(e))):typeof n.selectionKeys=="object"&&Object.entries(n.selectionKeys).forEach(([e,t])=>{t&&o.add(e)}));let z=new Map;function C(e,t=null){z.set(String(e.key),{node:e,parentKey:t}),e.children&&e.children.forEach(r=>C(r,String(e.key)))}C(f);function H(e){if(!e)return"";let t=e.toLowerCase();return g[t]||g.bolt}function I(e,t,r){let a=p==="checkbox"?`
            <div class="p-checkbox-box ${t?"p-checked":r?"p-indeterminate":""}" role="checkbox" aria-checked="${t}">
                ${t?g.check:r?'<span style="width: 8px; height: 2px; background: white; border-radius: 1px;"></span>':""}
            </div>
        `:"";if(e.icon||e.accent||e.description){let l=H(e.icon),c=e.accent||"bg-emerald-500/10 text-emerald-500";return`
                ${a}
                <div class="p-orgchart-card-content">
                    ${l?`<div class="p-orgchart-icon-box ${c}">${l}</div>`:""}
                    <div class="p-orgchart-details">
                        <span class="p-orgchart-label">${e.label}</span>
                        ${e.description?`<span class="p-orgchart-desc">${e.description}</span>`:""}
                    </div>
                </div>
            `}if(e.avatar||e.title){let l=e.label.split(" ").map(c=>c[0]).join("").substring(0,2).toUpperCase();return`
                ${a}
                <div class="p-orgchart-card-content">
                    <div class="p-orgchart-avatar">${l}</div>
                    <div class="p-orgchart-details">
                        <span class="p-orgchart-label">${e.label}</span>
                        ${e.title?`<span class="p-orgchart-desc" style="color: var(--p-primary-600); font-weight: 600;">${e.title}</span>`:""}
                    </div>
                </div>
            `}return`
            ${a}
            <span class="p-orgchart-label">${e.label}</span>
        `}function D(e){return B==="plusMinus"?e?g.plus:g.minus:e?g.chevronDown:g.chevronUp}function k(e){let t=String(e.key),r=e.children&&e.children.length>0,a=w&&d.has(t),l=o.has(t),c=h.has(t),s=r?e.children.length:0,v=s*2,j="";w&&r&&(j=`
                <button type="button" class="p-organizationchart-node-toggle-button" data-toggle-key="${t}" title="${a?"Expand":"Collapse"}" aria-label="${a?"Expand":"Collapse"}">
                    ${D(a)}
                </button>
            `);let F=r&&!a?`
            <tr class="p-organizationchart-lines">
                <td colspan="${v}">
                    <div class="p-organizationchart-line-down"></div>
                </td>
            </tr>
        `:"",y="",x="";if(r&&!a)if(s===1)y=`
                    <tr class="p-organizationchart-lines">
                        <td colspan="2">
                            <div class="p-organizationchart-line-down"></div>
                        </td>
                    </tr>
                `,x=`
                    <tr class="p-organizationchart-nodes">
                        <td colspan="2" class="p-organizationchart-node-cell" style="width: 100%;">
                            ${k(e.children[0])}
                        </td>
                    </tr>
                `;else{let A=(100/v).toFixed(4),P=(100/s).toFixed(4),N=[],L=[];e.children.forEach((V,K)=>{let W=K===0,X=K===s-1,Z=W?"":"p-organizationchart-line-top",G=X?"":"p-organizationchart-line-top";N.push(`
                        <td class="p-organizationchart-line-left ${Z}" style="width: ${A}%;">&nbsp;</td>
                        <td class="p-organizationchart-line-right ${G}" style="width: ${A}%;">&nbsp;</td>
                    `),L.push(`
                        <td colspan="2" class="p-organizationchart-node-cell" style="width: ${P}%;">
                            ${k(V)}
                        </td>
                    `)}),y=`
                    <tr class="p-organizationchart-lines">
                        ${N.join("")}
                    </tr>
                `,x=`
                    <tr class="p-organizationchart-nodes">
                        ${L.join("")}
                    </tr>
                `}return`
            <table class="p-organizationchart-table" role="presentation">
                <tbody>
                    <tr>
                        <td colspan="${r?v:2}" class="p-organizationchart-node-cell">
                            <div class="p-organizationchart-node ${b?"p-organizationchart-selectable":""} ${l?"p-highlight":""}" 
                                 data-node-key="${t}" 
                                 role="treeitem" 
                                 aria-selected="${l}" 
                                 aria-expanded="${r?!a:void 0}"
                                 tabindex="0">
                                ${I(e,l,c)}
                                ${j}
                            </div>
                        </td>
                    </tr>
                    ${F}
                    ${y}
                    ${x}
                </tbody>
            </table>
        `}function u(){p==="checkbox"&&$(),i.innerHTML=`
            <div class="p-organizationchart p-component" role="tree">
                ${k(f)}
            </div>
        `,R()}function $(){h.clear();function e(t){let r=String(t.key);if(!t.children||t.children.length===0)return o.has(r);let a=t.children.map(s=>e(s)),l=a.every(s=>s===!0),c=a.some(s=>s===!0)||t.children.some(s=>h.has(String(s.key)));return l?(o.add(r),h.delete(r),!0):c?(o.delete(r),h.add(r),!1):(o.delete(r),h.delete(r),!1)}e(f)}function E(e,t){let r=String(e.key);t?o.add(r):o.delete(r),h.delete(r),e.children&&e.children.forEach(a=>E(a,t))}function m(){p==="checkbox"&&$(),i.querySelectorAll(".p-organizationchart-node").forEach(t=>{let r=t.getAttribute("data-node-key");if(!r)return;let a=o.has(r),l=h.has(r);if(t.classList.toggle("p-highlight",a),t.setAttribute("aria-selected",String(a)),p==="checkbox"){let c=t.querySelector(".p-checkbox-box");c&&(c.className=`p-checkbox-box ${a?"p-checked":l?"p-indeterminate":""}`,c.setAttribute("aria-checked",String(a)),c.innerHTML=a?g.check:l?'<span style="width: 8px; height: 2px; background: white; border-radius: 1px;"></span>':"")}});let e=i.closest(".demo-subcard")||i.parentElement;if(e){let t=e.querySelector(".p-orgchart-selected-text");if(t){let r=Array.from(o);t.textContent=r.length>0?r.join(", "):"-"}}U(),T()}function q(e){d.has(e)?d.delete(e):d.add(e),u(),i.dispatchEvent(new CustomEvent("orgchart:toggle",{bubbles:!0,detail:{key:e,collapsed:d.has(e),collapsedKeys:Array.from(d)}}))}function S(e){if(b){if(p==="single")o.has(e)?o.clear():(o.clear(),o.add(e)),m();else if(p==="multiple")o.has(e)?o.delete(e):o.add(e),m();else if(p==="checkbox"){let t=z.get(e);if(!t)return;let r=!o.has(e);E(t.node,r),m()}}}function R(){i.querySelectorAll(".p-organizationchart-node-toggle-button").forEach(e=>{e.addEventListener("click",t=>{t.stopPropagation();let r=e.getAttribute("data-toggle-key");r&&q(r)})}),b&&i.querySelectorAll(".p-organizationchart-node").forEach(e=>{e.addEventListener("click",()=>{let t=e.getAttribute("data-node-key");t&&S(t)})}),i.querySelectorAll(".p-organizationchart-node").forEach(e=>{e.addEventListener("keydown",t=>{let r=e.getAttribute("data-node-key");r&&(t.key===" "||t.key==="Enter")&&(t.preventDefault(),S(r))})})}let M=i.closest(".demo-subcard")||i.closest("section")||i.parentElement;M&&M.querySelectorAll("[data-orgchart-action]").forEach(e=>{e.addEventListener("click",()=>{let t=e.getAttribute("data-orgchart-action");t==="expand-all"?(d.clear(),u()):t==="collapse-all"&&(d.add(String(f.key)),u())})});function U(){i.dispatchEvent(new CustomEvent("orgchart:selection-change",{bubbles:!0,detail:{selectionKeys:Array.from(o),indeterminateKeys:Array.from(h)}}))}function T(){if(n.targetInputName){let e=i.querySelector(`input[name="${n.targetInputName}"]`);e||(e=document.createElement("input"),e.type="hidden",e.name=n.targetInputName,i.appendChild(e)),e.value=JSON.stringify(Array.from(o))}}u(),T()}export{_ as default};
