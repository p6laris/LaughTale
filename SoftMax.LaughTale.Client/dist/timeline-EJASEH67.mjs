import{e as k}from"./chunk-3YU53HBK.mjs";var A=`
.p-timeline {
    display: flex;
    flex-grow: 1;
    font-family: var(--p-font-family, inherit);
    color: var(--p-surface-700, #334155);
}

.p-timeline-vertical {
    flex-direction: column;
}

.p-timeline-horizontal {
    flex-direction: row;
    width: 100%;
    overflow-x: auto;
    padding: 1.5rem 0.5rem;
}

.p-timeline-event {
    display: flex;
    position: relative;
    min-height: 4.5rem;
}

.p-timeline-vertical.p-timeline-left .p-timeline-event {
    flex-direction: row;
}

.p-timeline-vertical.p-timeline-right .p-timeline-event {
    flex-direction: row-reverse;
}

.p-timeline-vertical.p-timeline-alternate .p-timeline-event:nth-child(even) {
    flex-direction: row-reverse;
}

.p-timeline-event-opposite {
    flex: 1;
    padding: 0.125rem 1rem 1rem 1rem;
    font-size: 0.8125rem;
    color: var(--p-surface-500, #64748b);
}

.p-timeline-vertical.p-timeline-left .p-timeline-event-opposite {
    text-align: right;
}

.p-timeline-vertical.p-timeline-right .p-timeline-event-opposite {
    text-align: left;
}

.p-timeline-vertical.p-timeline-alternate .p-timeline-event:nth-child(odd) .p-timeline-event-opposite {
    text-align: right;
}
.p-timeline-vertical.p-timeline-alternate .p-timeline-event:nth-child(even) .p-timeline-event-opposite {
    text-align: left;
}

.p-timeline-event-content {
    flex: 1;
    padding: 0.125rem 1rem 1.5rem 1rem;
    text-align: left;
}

.p-timeline-vertical.p-timeline-right .p-timeline-event-content {
    text-align: right;
}

.p-timeline-vertical.p-timeline-alternate .p-timeline-event:nth-child(even) .p-timeline-event-content {
    text-align: right;
}

.p-timeline-event-separator {
    flex: 0 0 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
}

.p-timeline-event-marker {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    position: relative;
    border-radius: 9999px;
    z-index: 2;
}

/* Default marker dot */
.p-timeline-event-marker.p-marker-default {
    width: 0.875rem;
    height: 0.875rem;
    border: 2px solid var(--p-primary-500, #10b981);
    background: var(--p-surface-0, #ffffff);
    margin-top: 0.25rem;
}

.p-timeline-vertical .p-timeline-event-connector {
    flex-grow: 1;
    width: 2px;
    background-color: var(--p-surface-200, #e2e8f0);
    margin: 0.25rem 0;
}

/* Horizontal layout styling with continuous locked axis */
.p-timeline-horizontal .p-timeline-event {
    flex-direction: column;
    flex: 1;
    min-height: auto;
    min-width: 8rem;
    align-items: stretch;
}

.p-timeline-horizontal .p-timeline-event-separator {
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 100%;
    order: 2;
    position: relative;
    min-height: 1.5rem;
}

.p-timeline-horizontal .p-timeline-event-marker {
    margin: 0 auto;
}

.p-timeline-horizontal .p-timeline-event-connector {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 100%;
    height: 2px;
    background-color: var(--p-surface-300, #cbd5e1);
    transform: translateY(-50%);
    z-index: 1;
}

.p-timeline-horizontal .p-timeline-event-opposite,
.p-timeline-horizontal .p-timeline-event-content {
    padding: 0.5rem 0.25rem;
    text-align: center !important;
    min-height: 2rem;
}

.p-timeline-horizontal.p-timeline-top .p-timeline-event-opposite {
    order: 1;
}
.p-timeline-horizontal.p-timeline-top .p-timeline-event-content {
    order: 3;
}

.p-timeline-horizontal.p-timeline-bottom .p-timeline-event-content {
    order: 1;
}
.p-timeline-horizontal.p-timeline-bottom .p-timeline-event-opposite {
    order: 3;
}

.p-timeline-horizontal.p-timeline-alternate .p-timeline-event:nth-child(even) .p-timeline-event-content {
    order: 1;
}
.p-timeline-horizontal.p-timeline-alternate .p-timeline-event:nth-child(even) .p-timeline-event-opposite {
    order: 3;
}
.p-timeline-horizontal.p-timeline-alternate .p-timeline-event:nth-child(odd) .p-timeline-event-opposite {
    order: 1;
}
.p-timeline-horizontal.p-timeline-alternate .p-timeline-event:nth-child(odd) .p-timeline-event-content {
    order: 3;
}

/* Rich custom event card */
.p-timeline-card {
    padding: 1.25rem;
    border-radius: var(--p-border-radius-xl, 12px);
    background: var(--p-surface-0, #ffffff);
    border: 1px solid var(--p-surface-200, #e2e8f0);
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.05);
    margin-bottom: 1rem;
    text-align: left;
}

.p-timeline-avatar {
    width: 2.25rem;
    height: 2.25rem;
    border-radius: 9999px;
    font-weight: 700;
    font-size: 0.8125rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    color: #ffffff;
}

.p-timeline-pulse {
    animation: timelinePulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes timelinePulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: .85; transform: scale(1.08); }
}

/* Dark Mode Tokens */
.dark .p-timeline,
[data-theme="dark"] .p-timeline {
    color: var(--p-surface-200, #e2e8f0) !important;
}
.dark .p-timeline-event-marker.p-marker-default,
[data-theme="dark"] .p-timeline-event-marker.p-marker-default {
    background: var(--p-surface-900, #0f172a) !important;
    border-color: var(--p-primary-500, #10b981) !important;
}
.dark .p-timeline-event-connector,
[data-theme="dark"] .p-timeline-event-connector {
    background-color: var(--p-surface-700, #334155) !important;
}
.dark .p-timeline-card,
[data-theme="dark"] .p-timeline-card {
    background: var(--p-surface-900, #0f172a) !important;
    border-color: var(--p-surface-700, #334155) !important;
}
.dark .p-timeline-event-opposite,
[data-theme="dark"] .p-timeline-event-opposite {
    color: var(--p-surface-400, #94a3b8) !important;
}
`,r={shoppingCart:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>',creditCard:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>',truck:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14v10Z"/><circle cx="17" cy="18.5" r="2.5"/><circle cx="7" cy="18.5" r="2.5"/></svg>',checkCircle:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>',check:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',userPlus:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" x2="19" y1="8" y2="14"/><line x1="22" x2="16" y1="11" y2="11"/></svg>',envelope:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>',idCard:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><circle cx="8" cy="12" r="2"/><path d="M14 10h4"/><path d="M14 14h4"/></svg>',shoppingBag:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>',star:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',box:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>',mapPin:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/></svg>',history:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/></svg>',refresh:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 16h5v5"/></svg>',minus:'<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" x2="19" y1="12" y2="12"/></svg>'},x={"bg-blue-500":"#3b82f6","bg-green-500":"#10b981","bg-orange-500":"#f97316","bg-lime-500":"#84cc16","bg-violet-500":"#8b5cf6","bg-amber-500":"#f59e0b","bg-rose-500":"#f43f5e"};function E(u,l){k("timeline",A);let f=l.value||l.events||[],w=l.align||"left",$=l.layout||"vertical",p=!!l.interactive,v=!!l.activityFeed,c=[1],d=2;function y(e){return c.includes(e)?"completed":e===d?"current":"pending"}function z(e){e===d&&(c.push(e),d++,h())}function C(){c=[1],d=2,h()}function g(e){if(!e)return"";let t=e.toLowerCase().replace(/[-_]/g,"");return t==="shoppingcart"?r.shoppingCart:t==="creditcard"?r.creditCard:t==="truck"?r.truck:t==="checkcircle"?r.checkCircle:t==="userplus"?r.userPlus:t==="envelope"?r.envelope:t==="idcard"?r.idCard:t==="shoppingbag"?r.shoppingBag:t==="star"?r.star:t==="box"?r.box:t==="check"?r.check:r.checkCircle}function M(e){if(!e)return"#10b981";let t=e.replace("!","").trim();return x[t]?x[t]:t.startsWith("#")||t.startsWith("rgb")?t:"#10b981"}function j(e,t){if(p){let i=y(e.id),n="width: 2.5rem; height: 2.5rem; border-radius: 9999px; display: inline-flex; align-items: center; justify-content: center; border: none; transition: all 0.2s ease;",o="";return i==="completed"?(n+=" background: #22c55e; color: #ffffff; cursor: default;",o=r.check):i==="current"?(n+=" background: var(--p-primary-500, #10b981); color: #ffffff; cursor: pointer; transform: scale(1.05);",o=g(e.icon)||r.userPlus):(n+=" background: var(--p-surface-200, #e2e8f0); color: var(--p-surface-400, #94a3b8); cursor: not-allowed;",o=g(e.icon)||r.userPlus),`
                <div class="p-timeline-event-marker ${i==="current"?"p-timeline-pulse":""}">
                    <button type="button" class="p-interactive-step-btn" data-step-id="${e.id}" style="${n}" ${i!=="current"?"disabled":""}>
                        ${o}
                    </button>
                </div>
            `}if(v&&e.user){let i=typeof e.user=="object"?e.user.avatar:e.id==="1"?"SC":e.id==="2"?"AK":e.id==="3"?"MJ":e.id==="4"?"DP":"EW";return`
                <div class="p-timeline-event-marker">
                    <span class="p-timeline-avatar" style="background: ${e.id==="1"?"#8b5cf6":e.id==="2"?"#3b82f6":e.id==="3"?"#10b981":e.id==="4"?"#f59e0b":"#f43f5e"};">
                        ${i}
                    </span>
                </div>
            `}if(e.color||e.icon){let i=g(e.icon);return`
                <div class="p-timeline-event-marker">
                    <span style="display: inline-flex; align-items: center; justify-content: center; width: 2.75rem; height: 2.75rem; border-radius: 9999px; color: #ffffff; background: ${M(e.color)}; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);">
                        ${i}
                    </span>
                </div>
            `}return`
            <div class="p-timeline-event-marker p-marker-default"></div>
        `}function H(e){return e.opposite?`<span>${e.opposite}</span>`:e.date&&e.time?`
                <div style="font-weight: 600; color: var(--p-surface-800, #1e293b);">${e.date}</div>
                <div style="font-size: 0.75rem; color: var(--p-surface-500, #64748b);">${e.time}</div>
            `:e.date?`<span style="font-size: 0.8125rem; color: var(--p-surface-500);">${e.date}</span>`:e.time?`<span style="white-space: nowrap; font-size: 0.8125rem; color: var(--p-surface-500);">${e.time}</span>`:"&nbsp;"}function B(e){if(typeof e=="string")return`<span style="font-size: 0.875rem; font-weight: 600; color: var(--p-surface-800);">${e}</span>`;if(p){let t=y(e.id),i=t==="completed",n=t==="current";return`
                <div style="padding: 0.75rem 1rem; border-radius: 8px; transition: all 0.2s ease; ${i?"background: rgba(34, 197, 94, 0.08);":n?"background: rgba(16, 185, 129, 0.08);":"opacity: 0.6;"}">
                    <p style="margin: 0; font-weight: 600; font-size: 0.875rem; ${i?"color: #15803d; text-decoration: line-through;":n?"color: var(--p-primary-600, #059669);":"color: var(--p-surface-600);"}">
                        ${e.label||e.status||e.title}
                    </p>
                    ${n?'<p style="font-size: 0.75rem; color: var(--p-surface-500); margin: 0.25rem 0 0 0;">Click the marker to complete</p>':""}
                </div>
            `}if(v){let t=typeof e.user=="object"?e.user.name:e.user,i=e.details&&e.details.length>0?`
                <div style="margin-top: 0.75rem; padding: 0.75rem; border-radius: 8px; background: var(--p-surface-50); border: 1px solid var(--p-surface-200);">
                    <ul style="margin: 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: 0.35rem;">
                        ${e.details.map(n=>`
                            <li style="font-size: 0.8125rem; font-family: var(--p-font-mono, monospace); color: var(--p-surface-700); display: flex; align-items: center; gap: 0.5rem;">
                                <span style="color: var(--p-surface-400);">${r.minus}</span> ${n}
                            </li>
                        `).join("")}
                    </ul>
                </div>
            `:"";return`
                <div style="padding-bottom: 1.5rem;">
                    <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
                        <span style="font-weight: 600; color: var(--p-surface-900);">${t}</span>
                        <span style="color: var(--p-surface-500);">${e.action||""}</span>
                        <span style="font-weight: 600; color: var(--p-primary-600);">${e.target||""}</span>
                        ${e.repo?`<span style="color: var(--p-surface-500);">to</span> <code style="padding: 0.15rem 0.45rem; border-radius: 4px; background: var(--p-surface-100); font-size: 0.8125rem; font-family: monospace; color: var(--p-surface-700);">${e.repo}</code>`:""}
                    </div>
                    ${e.description?`<p style="margin: 0.35rem 0 0 0; font-size: 0.875rem; color: var(--p-surface-600);">${e.description}</p>`:""}
                    ${i}
                </div>
            `}if(e.details||e.tracking||e.user){let t=e.details&&e.details.length>0?`
                <ul style="margin: 0.75rem 0 0 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: 0.35rem;">
                    ${e.details.map(n=>`
                        <li style="font-size: 0.8125rem; color: var(--p-surface-500); display: flex; align-items: center; gap: 0.5rem;">
                            <span style="color: var(--p-primary-500);">${r.box}</span> ${n}
                        </li>
                    `).join("")}
                </ul>
            `:"",i=e.tracking?`
                <div style="margin-top: 1rem; padding: 0.65rem 0.85rem; border-radius: 8px; background: var(--p-surface-100); display: flex; align-items: center; justify-content: space-between;">
                    <span style="font-size: 0.8125rem; color: var(--p-surface-700); display: flex; align-items: center; gap: 0.5rem;">
                        ${r.mapPin} Tracking: <strong>${e.tracking}</strong>
                    </span>
                    <button type="button" class="p-button p-component p-button-text" style="font-size: 0.75rem; font-weight: 600; color: var(--p-primary-600); background: transparent; border: none; cursor: pointer; padding: 0.25rem 0.5rem;">Track</button>
                </div>
            `:"";return`
                <div class="p-timeline-card">
                    <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.5rem;">
                        ${e.user?`<span class="p-timeline-avatar" style="background: rgba(16, 185, 129, 0.12); color: var(--p-primary-600);">${e.user}</span>`:""}
                        <span style="font-weight: 700; font-size: 0.9375rem; color: var(--p-surface-900);">${e.status||e.title}</span>
                    </div>
                    ${e.description?`<p style="margin: 0; font-size: 0.875rem; color: var(--p-surface-600); line-height: 1.5;">${e.description}</p>`:""}
                    ${t}
                    ${i}
                </div>
            `}return`
            <div style="font-size: 0.875rem; font-weight: 500; color: var(--p-surface-800, #1e293b);">${e.status||e.title||e.label||JSON.stringify(e)}</div>
        `}function h(){let e=$==="horizontal",t=`p-timeline-${w}`,i=e?"p-timeline-horizontal":"p-timeline-vertical",n="",o="";if(p){let a=f.length,s=c.length,m=Math.round(s/a*100),P=s===a;n=`
                <div style="display: flex; flex-direction: column; gap: 1rem; margin-bottom: 1.5rem;">
                    <div style="display: flex; align-items: center; justify-content: space-between;">
                        <div>
                            <h3 style="margin: 0; font-size: 1.125rem; font-weight: 700; color: var(--p-surface-900);">Onboarding Progress</h3>
                            <p style="margin: 0.25rem 0 0 0; font-size: 0.8125rem; color: var(--p-surface-500);">${s} of ${a} steps completed</p>
                        </div>
                        <button type="button" class="p-interactive-reset-btn p-button p-component p-button-outlined" style="display: inline-flex; align-items: center; gap: 0.4rem; padding: 0.4rem 0.85rem; font-size: 0.8125rem; font-weight: 600; border-radius: 6px; border: 1px solid var(--p-surface-300); background: var(--p-surface-0); cursor: pointer; color: var(--p-surface-700);">
                            ${r.refresh} Reset
                        </button>
                    </div>
                    <div style="width: 100%; height: 0.5rem; border-radius: 9999px; background: var(--p-surface-200); overflow: hidden;">
                        <div style="width: ${m}%; height: 100%; border-radius: 9999px; background: var(--p-primary-500, #10b981); transition: width 0.4s ease;"></div>
                    </div>
                </div>
            `,P&&(o=`
                    <div style="margin-top: 1.5rem; padding: 1rem; border-radius: 8px; background: rgba(34, 197, 94, 0.08); border: 1px solid rgba(34, 197, 94, 0.3); display: flex; flex-direction: column; align-items: center; gap: 0.25rem; text-align: center;">
                        <span style="color: #22c55e;">${r.checkCircle}</span>
                        <div style="font-weight: 700; color: #15803d; font-size: 0.9375rem;">Onboarding Complete!</div>
                        <span style="font-size: 0.8125rem; color: #16a34a;">You've completed all the steps.</span>
                    </div>
                `)}let b="";v&&(b=`
                <div style="display: flex; align-items: center; gap: 0.625rem; margin-bottom: 1.25rem;">
                    <span style="color: var(--p-surface-500);">${r.history}</span>
                    <span style="font-size: 1.125rem; font-weight: 700; color: var(--p-surface-900);">Recent Activity</span>
                </div>
            `);let L=f.map((a,s)=>{let m=s===f.length-1;return`
                <div class="p-timeline-event" role="listitem">
                    <div class="p-timeline-event-opposite">
                        ${H(a)}
                    </div>
                    <div class="p-timeline-event-separator">
                        ${j(a,m)}
                        ${m?"":'<div class="p-timeline-event-connector"></div>'}
                    </div>
                    <div class="p-timeline-event-content">
                        ${B(a)}
                    </div>
                </div>
            `}).join("");u.innerHTML=`
            <div class="p-timeline-wrapper" style="width: 100%;">
                ${n}
                ${b}
                <div class="p-timeline p-component ${i} ${t}" role="list">
                    ${L}
                </div>
                ${o}
            </div>
        `,S()}function S(){p&&(u.querySelectorAll(".p-interactive-step-btn").forEach(e=>{e.addEventListener("click",()=>{let t=parseInt(e.getAttribute("data-step-id")||"0",10);t&&z(t)})}),u.querySelector(".p-interactive-reset-btn")?.addEventListener("click",()=>{C()}))}h()}export{E as default};
