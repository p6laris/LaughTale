import{e as P}from"./chunk-3YU53HBK.mjs";var ee=`
.p-tree {
    position: relative;
    background: var(--p-surface-0, #ffffff);
    color: var(--p-surface-700, #334155);
    border: 1px solid var(--p-surface-200, #e2e8f0);
    border-radius: var(--p-border-radius-md, 6px);
    padding: 0.75rem;
    font-family: var(--p-font-family, inherit);
    box-sizing: border-box;
    width: 100%;
}

.p-tree-header {
    margin-bottom: 0.75rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.p-tree-filter-container {
    position: relative;
    width: 100%;
}

.p-tree-filter-input {
    width: 100%;
    padding: 0.5rem 0.75rem 0.5rem 2.25rem;
    font-size: 0.875rem;
    color: var(--p-surface-900, #0f172a);
    background: var(--p-surface-0, #ffffff);
    border: 1px solid var(--p-surface-300, #cbd5e1);
    border-radius: var(--p-border-radius, 6px);
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
    box-sizing: border-box;
}

.p-tree-filter-input:focus {
    border-color: var(--p-primary-500, #10b981);
    box-shadow: 0 0 0 2px var(--p-primary-100, rgba(16, 185, 129, 0.2));
}

.p-tree-filter-icon {
    position: absolute;
    left: 0.75rem;
    top: 50%;
    transform: translateY(-50%);
    color: var(--p-surface-400, #94a3b8);
    pointer-events: none;
    display: flex;
    align-items: center;
}

.p-tree-root-children,
.p-tree-node-children {
    list-style-type: none;
    margin: 0;
    padding: 0;
}

.p-tree-node-children {
    padding-left: 1.5rem;
}

.p-tree-node {
    padding: 0.125rem 0;
    outline: none;
}

.p-tree-node-content {
    display: flex;
    align-items: center;
    padding: 0.375rem 0.5rem;
    border-radius: var(--p-border-radius-sm, 6px);
    cursor: pointer;
    user-select: none;
    transition: background-color 0.15s ease, color 0.15s ease;
    gap: 0.375rem;
    outline: none;
}

.p-tree-node-content:hover {
    background-color: var(--p-surface-100, #f1f5f9);
    color: var(--p-surface-900, #0f172a);
}

.p-tree-node-content.p-tree-node-selected {
    background-color: var(--p-primary-50, #ecfdf5);
    color: var(--p-primary-700, #047857);
    font-weight: 600;
}

.p-tree-node-content:focus-visible {
    box-shadow: inset 0 0 0 2px var(--p-primary-500, #10b981);
}

.p-tree-node-toggle-button {
    width: 1.75rem;
    height: 1.75rem;
    border-radius: 9999px;
    border: none;
    background: transparent;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: var(--p-surface-500, #64748b);
    transition: background-color 0.15s ease, transform 0.2s ease;
    flex-shrink: 0;
    padding: 0;
}

.p-tree-node-toggle-button:hover {
    background-color: var(--p-surface-200, #e2e8f0);
    color: var(--p-surface-900, #0f172a);
}

.p-tree-node-toggle-button.p-tree-node-toggle-placeholder {
    visibility: hidden;
    pointer-events: none;
}

.p-tree-node-checkbox {
    margin-right: 0.25rem;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
}

.p-tree-checkbox-box {
    width: 1.125rem;
    height: 1.125rem;
    border-radius: 4px;
    border: 1px solid var(--p-surface-300, #cbd5e1);
    background: var(--p-surface-0, #ffffff);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.15s, border-color 0.15s;
}

.p-tree-checkbox-box.p-highlight {
    background: var(--p-primary-500, #10b981);
    border-color: var(--p-primary-500, #10b981);
    color: #ffffff;
}

.p-tree-checkbox-box.p-indeterminate {
    background: var(--p-primary-500, #10b981);
    border-color: var(--p-primary-500, #10b981);
    color: #ffffff;
}

.p-tree-node-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: var(--p-surface-500, #64748b);
    flex-shrink: 0;
}

.p-tree-node-content.p-tree-node-selected .p-tree-node-icon {
    color: var(--p-primary-600, #059669);
}

.p-tree-node-label {
    font-size: 0.875rem;
    flex-grow: 1;
    line-height: 1.25;
}

/* Drag & Drop Visuals */
.p-tree-node-dragging {
    opacity: 0.4;
}
.p-tree-node-dragover {
    background-color: var(--p-primary-50, #ecfdf5) !important;
    border: 1px dashed var(--p-primary-500, #10b981) !important;
}

/* Loading Overlay */
.p-tree-loading-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;
    border-radius: var(--p-border-radius-md, 6px);
}

/* Skeleton Placeholder */
.p-tree-skeleton-row {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.5rem;
}
.p-tree-skeleton-icon {
    width: 1rem;
    height: 1rem;
    border-radius: 50%;
    background: var(--p-surface-200, #e2e8f0);
    animation: pSkeletonGlow 1.5s infinite;
}
.p-tree-skeleton-text {
    height: 0.875rem;
    border-radius: 4px;
    background: var(--p-surface-200, #e2e8f0);
    animation: pSkeletonGlow 1.5s infinite;
}
@keyframes pSkeletonGlow {
    0%, 100% { opacity: 0.6; }
    50% { opacity: 1; }
}

/* Dark Mode Tokens */
.dark .p-tree,
[data-theme="dark"] .p-tree {
    background: var(--p-surface-900, #0f172a) !important;
    color: var(--p-surface-100, #f8fafc) !important;
    border-color: var(--p-surface-700, #334155) !important;
}
.dark .p-tree-filter-input,
[data-theme="dark"] .p-tree-filter-input {
    background: var(--p-surface-950, #020617) !important;
    color: var(--p-surface-50, #f8fafc) !important;
    border-color: var(--p-surface-700, #334155) !important;
}
.dark .p-tree-node-content:hover,
[data-theme="dark"] .p-tree-node-content:hover {
    background-color: var(--p-surface-800, #1e293b) !important;
    color: var(--p-surface-0, #ffffff) !important;
}
.dark .p-tree-node-content.p-tree-node-selected,
[data-theme="dark"] .p-tree-node-content.p-tree-node-selected {
    background-color: rgba(16, 185, 129, 0.16) !important;
    color: var(--p-primary-300, #6ee7b7) !important;
}
.dark .p-tree-checkbox-box,
[data-theme="dark"] .p-tree-checkbox-box {
    background: var(--p-surface-950, #020617) !important;
    border-color: var(--p-surface-700, #334155) !important;
}
.dark .p-tree-loading-overlay,
[data-theme="dark"] .p-tree-loading-overlay {
    background: rgba(15, 23, 42, 0.7) !important;
}
`,c={chevronRight:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>',chevronDown:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>',plusCircle:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v8"/><path d="M8 12h8"/></svg>',minusCircle:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 12h8"/></svg>',folder:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/></svg>',folderOpen:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 14 1.5-6h13.5L19 14Z"/><path d="M6 14H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.69.9H19a2 2 0 0 1 2 2v2"/></svg>',file:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/></svg>',check:'<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',minus:'<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="5" x2="19" y1="12" y2="12"/></svg>',search:'<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>',spinner:'<svg class="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>',plus:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg>',refresh:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 16h5v5"/></svg>'},w=null;function re(p,l){P("tree",ee);let h=JSON.parse(JSON.stringify(l.value||l.nodes||[])),g=l.selectionMode||null,R=l.metaKeySelection??!0,K=!!l.lazy,V=!!l.skeleton,G=!!l.showControls,U=!!l.showSelectAll,_=!!l.keyboardInfo,Z=l.toggleIcon||"chevron",L=!!l.draggableNodes,z=!!l.droppableNodes,F=l.draggableScope||"default",E=Array.isArray(l.droppableScope)?l.droppableScope:l.droppableScope?[l.droppableScope]:["default","none"],m={...l.expandedKeys||{}},$=null,x={},f={},S="",H=!!l.loading,J=null;l.selectionKeys&&(g==="single"&&typeof l.selectionKeys=="string"?$=l.selectionKeys:g==="multiple"&&typeof l.selectionKeys=="object"?x={...l.selectionKeys}:g==="checkbox"&&typeof l.selectionKeys=="object"&&(f={...l.selectionKeys}));let k=new Map,T=new Map;function C(r,t=null){r.forEach(e=>{let n=String(e.key||e.id);e.key=n,e.label=e.label||e.name,k.set(n,e),t&&T.set(n,t),e.children&&e.children.length&&C(e.children,e)})}C(h);function v(r,t,e){l.events&&window.AuraToast&&window.AuraToast.add({severity:r,summary:t,detail:e,life:3e3})}function D(r,t){let e=String(r.key||r.id);f[e]={checked:t,partialChecked:!1},r.children&&r.children.length&&r.children.forEach(n=>D(n,t))}function I(r){let t=T.get(String(r.key||r.id));if(!t)return;let e=String(t.key||t.id),n=t.children||[],o=!0,i=!1,a=!1;n.forEach(s=>{let d=String(s.key||s.id),y=f[d];y?.checked?i=!0:o=!1,y?.partialChecked&&(a=!0)}),o?f[e]={checked:!0,partialChecked:!1}:i||a?f[e]={checked:!1,partialChecked:!0}:delete f[e],I(t)}function j(r){let t=String(r.key||r.id);if(m[t])delete m[t],v("info","Node Collapsed",r.label),u();else{if(m[t]=!0,v("info","Node Expanded",r.label),K&&(!r.children||r.children.length===0)){r.loading=!0,u(),setTimeout(()=>{r.loading=!1,r.children=[{key:`${t}-0`,label:`Lazy ${r.label}-0`,leaf:!0},{key:`${t}-1`,label:`Lazy ${r.label}-1`,leaf:!0},{key:`${t}-2`,label:`Lazy ${r.label}-2`,leaf:!0}],C(h),u()},600);return}u()}}function B(r,t){let e=String(r.key||r.id);if(g==="single")$===e?($=null,v("warn","Node Unselected",r.label)):($=e,v("success","Node Selected",r.label)),u();else if(g==="multiple"){let n=t.metaKey||t.ctrlKey;R&&!n?(x={[e]:!0},v("success","Node Selected",r.label)):x[e]?(delete x[e],v("warn","Node Unselected",r.label)):(x[e]=!0,v("success","Node Selected",r.label)),u()}else if(g==="checkbox"){let o=!f[e]?.checked;D(r,o),I(r),v(o?"success":"warn",o?"Node Selected":"Node Unselected",r.label),u()}}function M(r){let t=[];return r.forEach(e=>{t.push(String(e.key||e.id)),e.children&&e.children.length&&t.push(...M(e.children))}),t}function Q(){M(h).forEach(t=>{m[t]=!0}),u()}function W(){m={},u()}function Y(){let r=M(h);Object.values(f).filter(e=>e?.checked).length===r.length?f={}:r.forEach(e=>{f[e]={checked:!0,partialChecked:!1}}),u()}function O(r,t){if(!t.trim())return r;let e=t.toLowerCase();return r.reduce((n,o)=>{let i=(o.label||o.name||"").toLowerCase().includes(e),a=o.children?O(o.children,t):[];if(i||a.length>0){let s=String(o.key||o.id);m[s]=!0,n.push({...o,children:a})}return n},[])}function q(r,t=0){let e=String(r.key||r.id),n=r.children&&r.children.length>0||K&&!r.leaf,o=!!m[e],i=g==="single"?$===e:g==="multiple"?!!x[e]:g==="checkbox"?!!f[e]?.checked:!1,a=g==="checkbox"&&!!f[e]?.partialChecked,s="";n&&(r.loading?s=c.spinner:Z==="plusMinus"?s=o?c.minusCircle:c.plusCircle:s=o?c.chevronDown:c.chevronRight);let d="";r.icon?d=r.icon.startsWith("<svg")?r.icon:c[r.icon]||c.file:n?d=o?c.folderOpen:c.folder:d=c.file;let y="";g==="checkbox"&&(y=`
                <div class="p-tree-node-checkbox" role="checkbox" aria-checked="${i?"true":a?"mixed":"false"}">
                    <div class="p-tree-checkbox-box ${i?"p-highlight":a?"p-indeterminate":""}">
                        ${i?c.check:a?c.minus:""}
                    </div>
                </div>
            `);let b="";return n&&o&&r.children&&(b=`
                <ul class="p-tree-node-children" role="group">
                    ${r.children.map(A=>q(A,t+1)).join("")}
                </ul>
            `),`
            <li class="p-tree-node" role="treeitem" data-key="${e}" aria-expanded="${o}" aria-selected="${i}" ${L?'draggable="true"':""}>
                <div class="p-tree-node-content ${i?"p-tree-node-selected":""}" data-key="${e}" tabindex="0">
                    <button type="button" class="p-tree-node-toggle-button ${n?"":"p-tree-node-toggle-placeholder"}" data-toggle-key="${e}" tabindex="-1" aria-label="Toggle">
                        ${s}
                    </button>
                    ${y}
                    <span class="p-tree-node-icon">${d}</span>
                    <span class="p-tree-node-label">${r.label||r.name}</span>
                </div>
                ${b}
            </li>
        `}function u(){let r=O(h,S),t="";G&&(t=`
                <div style="display: flex; gap: 0.5rem; margin-bottom: 0.75rem;">
                    <button type="button" class="p-tree-expand-all p-button p-component p-button-outlined" style="display: inline-flex; align-items: center; gap: 0.35rem; padding: 0.35rem 0.75rem; font-size: 0.8125rem; font-weight: 600; border-radius: 6px; border: 1px solid var(--p-surface-300); background: var(--p-surface-0); cursor: pointer; color: var(--p-surface-700);">
                        ${c.plus} Expand All
                    </button>
                    <button type="button" class="p-tree-collapse-all p-button p-component p-button-outlined" style="display: inline-flex; align-items: center; gap: 0.35rem; padding: 0.35rem 0.75rem; font-size: 0.8125rem; font-weight: 600; border-radius: 6px; border: 1px solid var(--p-surface-300); background: var(--p-surface-0); cursor: pointer; color: var(--p-surface-700);">
                        ${c.minus} Collapse All
                    </button>
                </div>
            `);let e="";if(U&&g==="checkbox"){let s=M(h),d=Object.values(f).filter(N=>N?.checked).length,y=Object.values(f).filter(N=>N?.partialChecked).length,b=s.length>0&&d===s.length,A=(d>0||y>0)&&!b;e=`
                <div class="p-tree-select-all-header" style="display: flex; align-items: center; gap: 0.5rem; padding: 0.25rem 0.5rem 0.75rem 0.5rem; border-bottom: 1px solid var(--p-surface-200); margin-bottom: 0.5rem; cursor: pointer;">
                    <div class="p-tree-checkbox-box ${b?"p-highlight":A?"p-indeterminate":""}">
                        ${b?c.check:A?c.minus:""}
                    </div>
                    <label style="font-weight: 600; font-size: 0.875rem; color: var(--p-surface-800); cursor: pointer;">Select All</label>
                </div>
            `}let n="";if(_){let s=Object.values(x).filter(Boolean).length;n=`
                <div style="display: flex; align-items: center; justify-content: space-between; gap: 0.75rem; padding: 0.65rem 0.85rem; border-radius: 6px; border: 1px solid var(--p-surface-200); background: var(--p-surface-50); margin-bottom: 0.75rem;">
                    <span style="font-size: 0.8125rem; color: var(--p-surface-600);">
                        <kbd style="padding: 0.15rem 0.4rem; font-size: 0.75rem; border-radius: 4px; background: var(--p-surface-200); font-family: monospace;">\u2191</kbd>
                        <kbd style="padding: 0.15rem 0.4rem; font-size: 0.75rem; border-radius: 4px; background: var(--p-surface-200); font-family: monospace;">\u2193</kbd> navigate,
                        <kbd style="padding: 0.15rem 0.4rem; font-size: 0.75rem; border-radius: 4px; background: var(--p-surface-200); font-family: monospace;">\u2192</kbd> expand,
                        <kbd style="padding: 0.15rem 0.4rem; font-size: 0.75rem; border-radius: 4px; background: var(--p-surface-200); font-family: monospace;">\u2190</kbd> collapse,
                        <kbd style="padding: 0.15rem 0.4rem; font-size: 0.75rem; border-radius: 4px; background: var(--p-surface-200); font-family: monospace;">Space</kbd> select
                    </span>
                    <div style="display: flex; align-items: center; gap: 0.4rem;">
                        <span style="font-size: 0.8125rem; font-weight: 600; color: var(--p-surface-700);">Selected</span>
                        <span style="font-size: 0.75rem; font-weight: 700; padding: 0.15rem 0.5rem; border-radius: 9999px; background: ${s?"var(--p-primary-500)":"var(--p-surface-300)"}; color: #ffffff;">${s}</span>
                    </div>
                </div>
            `}let o="";l.filter&&(o=`
                <div class="p-tree-filter-container">
                    <span class="p-tree-filter-icon">${c.search}</span>
                    <input type="text" class="p-tree-filter-input" placeholder="${l.filterPlaceholder||"Search"}" value="${S}" />
                </div>
            `);let i="";H&&l.loadingMode!=="icon"&&(i=`
                <div class="p-tree-loading-overlay">
                    <span style="color: var(--p-primary-500);">${c.spinner}</span>
                </div>
            `);let a="";V&&H?a=`
                <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                    ${Array.from({length:5}).map((s,d)=>`
                        <div class="p-tree-skeleton-row" style="padding-left: ${d>1?"1.5rem":"0.5rem"};">
                            <div class="p-tree-skeleton-icon"></div>
                            <div class="p-tree-skeleton-text" style="width: ${70-d*10}%;"></div>
                        </div>
                    `).join("")}
                </div>
            `:r.length===0?S?a='<div style="padding: 1rem; text-align: center; color: var(--p-surface-500); font-size: 0.875rem;">No options found.</div>':a=`
                    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0.75rem; padding: 2.5rem 1rem; text-align: center;">
                        <div style="width: 3.5rem; height: 3.5rem; border-radius: 9999px; background: var(--p-surface-100); display: flex; align-items: center; justify-content: center; color: var(--p-surface-400);">
                            <span style="transform: scale(1.4);">${c.folder}</span>
                        </div>
                        <div>
                            <p style="margin: 0; font-weight: 700; color: var(--p-surface-900); font-size: 0.9375rem;">No folders yet</p>
                            <p style="margin: 0.25rem 0 0 0; font-size: 0.8125rem; color: var(--p-surface-500);">Create your first folder to start building a tree.</p>
                        </div>
                        <button type="button" class="p-tree-add-node-btn p-button p-component p-button-sm" style="display: inline-flex; align-items: center; gap: 0.35rem; padding: 0.4rem 0.85rem; font-size: 0.8125rem; font-weight: 600; border-radius: 6px; background: var(--p-primary-500); color: #ffffff; border: none; cursor: pointer;">
                            ${c.plus} New Folder
                        </button>
                    </div>
                `:a=`
                <ul class="p-tree-root-children" role="tree">
                    ${r.map(s=>q(s,0)).join("")}
                </ul>
            `,p.innerHTML=`
            ${t}
            ${n}
            <div class="p-tree p-component" role="tree" tabindex="-1">
                ${o?`<div class="p-tree-header">${o}</div>`:""}
                ${e}
                ${i}
                <div class="p-tree-wrapper">
                    ${a}
                </div>
            </div>
        `,X()}function X(){p.querySelectorAll(".p-tree-node-toggle-button").forEach(t=>{t.addEventListener("click",e=>{e.stopPropagation();let n=t.getAttribute("data-toggle-key");n&&k.has(n)&&j(k.get(n))})}),p.querySelectorAll(".p-tree-node-content").forEach(t=>{t.addEventListener("click",e=>{let n=t.getAttribute("data-key");n&&k.has(n)&&(J=n,B(k.get(n),e))})}),p.querySelectorAll(".p-tree-node-content").forEach(t=>{t.addEventListener("keydown",e=>{let n=t.getAttribute("data-key");if(!n||!k.has(n))return;let o=k.get(n);if(e.key==="ArrowRight"){if(e.preventDefault(),!m[n]&&o.children&&o.children.length)j(o);else if(o.children&&o.children.length){let i=String(o.children[0].key||o.children[0].id);p.querySelector(`.p-tree-node-content[data-key="${i}"]`)?.focus()}}else if(e.key==="ArrowLeft")if(e.preventDefault(),m[n])j(o);else{let i=T.get(n);if(i){let a=String(i.key||i.id);p.querySelector(`.p-tree-node-content[data-key="${a}"]`)?.focus()}}else if(e.key==="ArrowDown"){e.preventDefault();let i=Array.from(p.querySelectorAll(".p-tree-node-content")),a=i.indexOf(t);a>=0&&a<i.length-1&&i[a+1].focus()}else if(e.key==="ArrowUp"){e.preventDefault();let i=Array.from(p.querySelectorAll(".p-tree-node-content")),a=i.indexOf(t);a>0&&i[a-1].focus()}else(e.key===" "||e.key==="Enter")&&(e.preventDefault(),B(o,e))})}),p.querySelector(".p-tree-expand-all")?.addEventListener("click",()=>Q()),p.querySelector(".p-tree-collapse-all")?.addEventListener("click",()=>W()),p.querySelector(".p-tree-select-all-header")?.addEventListener("click",()=>Y());let r=p.querySelector(".p-tree-filter-input");r&&r.addEventListener("input",t=>{S=t.target.value,u();let e=p.querySelector(".p-tree-filter-input");e&&(e.focus(),e.setSelectionRange(S.length,S.length))}),p.querySelector(".p-tree-add-node-btn")?.addEventListener("click",()=>{let t=h.length+1;h.push({key:`root-${Date.now()}`,label:`New Folder ${t}`,icon:"folder"}),C(h),u()}),(L||z)&&p.querySelectorAll(".p-tree-node").forEach(t=>{let e=t.getAttribute("data-key");if(!e||!k.has(e))return;let n=k.get(e);L&&(t.addEventListener("dragstart",o=>{o.stopPropagation(),w={node:n,sourceScope:F},t.classList.add("p-tree-node-dragging"),o.dataTransfer&&(o.dataTransfer.effectAllowed="move",o.dataTransfer.setData("text/plain",e))}),t.addEventListener("dragend",()=>{t.classList.remove("p-tree-node-dragging"),w=null})),z&&(t.addEventListener("dragover",o=>{o.preventDefault(),o.stopPropagation(),w&&(E.includes(w.sourceScope||"")||E.includes("all"))&&(t.classList.add("p-tree-node-dragover"),o.dataTransfer&&(o.dataTransfer.dropEffect="move"))}),t.addEventListener("dragleave",o=>{o.stopPropagation(),t.classList.remove("p-tree-node-dragover")}),t.addEventListener("drop",o=>{if(o.preventDefault(),o.stopPropagation(),t.classList.remove("p-tree-node-dragover"),w&&(E.includes(w.sourceScope||"")||E.includes("all"))){let s=function(d){let y=d.findIndex(b=>b.key===a.key);if(y>=0)return d.splice(y,1),!0;for(let b of d)if(b.children&&s(b.children))return!0;return!1};var i=s;let a=w.node;if(a.key===n.key)return;n.children||(n.children=[]),n.children.push(a),m[n.key]=!0,s(h),C(h),v("info","Node Dropped",`${a.label} moved into ${n.label}`),u()}}))})}u()}export{re as default};
