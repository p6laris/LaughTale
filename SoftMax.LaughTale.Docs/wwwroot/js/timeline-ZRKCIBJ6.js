import {
  injectIslandStyle
} from "./chunk-3TFPN5JM.js";

// ../SoftMax.LaughTale.Client/src/components/timeline.ts
var TIMELINE_CSS = `
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
    overflow-x: auto;
    padding: 1rem 0;
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

.p-timeline-event-connector {
    flex-grow: 1;
    width: 2px;
    background-color: var(--p-surface-200, #e2e8f0);
    margin: 0.25rem 0;
}

/* Horizontal layout styling */
.p-timeline-horizontal .p-timeline-event {
    flex-direction: column;
    flex: 1;
    min-height: auto;
    min-width: 9rem;
    align-items: center;
}

.p-timeline-horizontal .p-timeline-event-separator {
    flex-direction: row;
    width: 100%;
    align-items: center;
    justify-content: center;
}

.p-timeline-horizontal .p-timeline-event-connector {
    height: 2px;
    width: 100%;
    margin: 0 0.25rem;
}

.p-timeline-horizontal .p-timeline-event-opposite,
.p-timeline-horizontal .p-timeline-event-content {
    padding: 0.5rem 0.25rem;
    text-align: center !important;
}

.p-timeline-horizontal.p-timeline-top .p-timeline-event-opposite {
    order: 1;
}
.p-timeline-horizontal.p-timeline-top .p-timeline-event-separator {
    order: 2;
}
.p-timeline-horizontal.p-timeline-top .p-timeline-event-content {
    order: 3;
}

.p-timeline-horizontal.p-timeline-bottom .p-timeline-event-content {
    order: 1;
}
.p-timeline-horizontal.p-timeline-bottom .p-timeline-event-separator {
    order: 2;
}
.p-timeline-horizontal.p-timeline-bottom .p-timeline-event-opposite {
    order: 3;
}

.p-timeline-horizontal.p-timeline-alternate .p-timeline-event:nth-child(even) .p-timeline-event-content {
    order: 1;
}
.p-timeline-horizontal.p-timeline-alternate .p-timeline-event:nth-child(even) .p-timeline-event-separator {
    order: 2;
}
.p-timeline-horizontal.p-timeline-alternate .p-timeline-event:nth-child(even) .p-timeline-event-opposite {
    order: 3;
}
.p-timeline-horizontal.p-timeline-alternate .p-timeline-event:nth-child(odd) .p-timeline-event-opposite {
    order: 1;
}
.p-timeline-horizontal.p-timeline-alternate .p-timeline-event:nth-child(odd) .p-timeline-event-separator {
    order: 2;
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
    width: 2rem;
    height: 2rem;
    border-radius: 9999px;
    background: rgba(16, 185, 129, 0.12);
    color: var(--p-primary-600, #059669);
    font-weight: 700;
    font-size: 0.8125rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.p-timeline-pulse {
    animation: timelinePulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes timelinePulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: .75; transform: scale(1.08); }
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
`;
var ICONS = {
  shoppingCart: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>',
  creditCard: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>',
  truck: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14v10Z"/><circle cx="17" cy="18.5" r="2.5"/><circle cx="7" cy="18.5" r="2.5"/></svg>',
  checkCircle: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>',
  check: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
  userPlus: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" x2="19" y1="8" y2="14"/><line x1="22" x2="16" y1="11" y2="11"/></svg>',
  envelope: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>',
  idCard: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><circle cx="8" cy="12" r="2"/><path d="M14 10h4"/><path d="M14 14h4"/></svg>',
  shoppingBag: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>',
  star: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
  box: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>',
  mapPin: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/></svg>',
  history: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/></svg>',
  refresh: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 16h5v5"/></svg>',
  minus: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" x2="19" y1="12" y2="12"/></svg>'
};
function TimelineIsland(container, props) {
  injectIslandStyle("timeline", TIMELINE_CSS);
  const rawEvents = props.value || props.events || [];
  const align = props.align || "left";
  const layout = props.layout || "vertical";
  const isInteractive = !!props.interactive;
  const isActivityFeed = !!props.activityFeed;
  let completedSteps = [1];
  let currentStep = 2;
  function getStepStatus(stepId) {
    if (completedSteps.includes(stepId)) return "completed";
    if (stepId === currentStep) return "current";
    return "pending";
  }
  function handleStepComplete(stepId) {
    if (stepId === currentStep) {
      completedSteps.push(stepId);
      currentStep++;
      render();
    }
  }
  function handleReset() {
    completedSteps = [1];
    currentStep = 2;
    render();
  }
  function getIconSvg(iconName) {
    if (!iconName) return "";
    const key = iconName.toLowerCase().replace(/[-_]/g, "");
    if (key === "shoppingcart") return ICONS.shoppingCart;
    if (key === "creditcard") return ICONS.creditCard;
    if (key === "truck") return ICONS.truck;
    if (key === "checkcircle") return ICONS.checkCircle;
    if (key === "userplus") return ICONS.userPlus;
    if (key === "envelope") return ICONS.envelope;
    if (key === "idcard") return ICONS.idCard;
    if (key === "shoppingbag") return ICONS.shoppingBag;
    if (key === "star") return ICONS.star;
    if (key === "box") return ICONS.box;
    if (key === "check") return ICONS.check;
    return ICONS.checkCircle;
  }
  function renderMarker(item, isLast) {
    if (isInteractive) {
      const status = getStepStatus(item.id);
      let btnClass = "width: 2.5rem; height: 2.5rem; border-radius: 9999px; display: inline-flex; align-items: center; justify-content: center; border: none; transition: all 0.2s ease;";
      let iconHtml = "";
      if (status === "completed") {
        btnClass += " background: #22c55e; color: #ffffff; cursor: default;";
        iconHtml = ICONS.check;
      } else if (status === "current") {
        btnClass += " background: var(--p-primary-500, #10b981); color: #ffffff; cursor: pointer; transform: scale(1.05);";
        iconHtml = getIconSvg(item.icon) || ICONS.userPlus;
      } else {
        btnClass += " background: var(--p-surface-200, #e2e8f0); color: var(--p-surface-400, #94a3b8); cursor: not-allowed;";
        iconHtml = getIconSvg(item.icon) || ICONS.userPlus;
      }
      return `
                <div class="p-timeline-event-marker ${status === "current" ? "p-timeline-pulse" : ""}">
                    <button type="button" class="p-interactive-step-btn" data-step-id="${item.id}" style="${btnClass}" ${status !== "current" ? "disabled" : ""}>
                        ${iconHtml}
                    </button>
                </div>
            `;
    }
    if (isActivityFeed && item.user) {
      const avatar = typeof item.user === "object" ? item.user.avatar : item.user;
      const colorClass = typeof item.user === "object" && item.user.color ? item.user.color : "bg-primary/10 text-primary";
      return `
                <div class="p-timeline-event-marker">
                    <span class="p-timeline-avatar ${colorClass}">
                        ${avatar}
                    </span>
                </div>
            `;
    }
    if (item.color || item.icon) {
      const iconSvg = getIconSvg(item.icon);
      const colorClass = item.color || "bg-emerald-500";
      return `
                <div class="p-timeline-event-marker">
                    <span class="inline-flex items-center justify-center w-10 h-10 rounded-full text-white shadow-md ${colorClass}">
                        ${iconSvg}
                    </span>
                </div>
            `;
    }
    return `
            <div class="p-timeline-event-marker p-marker-default"></div>
        `;
  }
  function renderOpposite(item) {
    if (item.opposite) {
      return `<span>${item.opposite}</span>`;
    }
    if (item.date && item.time) {
      return `
                <div style="font-weight: 600; color: var(--p-surface-800, #1e293b);">${item.date}</div>
                <div style="font-size: 0.75rem; color: var(--p-surface-500, #64748b);">${item.time}</div>
            `;
    }
    if (item.date) {
      return `<span>${item.date}</span>`;
    }
    if (item.time) {
      return `<span style="white-space: nowrap;">${item.time}</span>`;
    }
    return `&nbsp;`;
  }
  function renderContent(item) {
    if (typeof item === "string") {
      return `<span style="font-size: 0.875rem; font-weight: 500;">${item}</span>`;
    }
    if (isInteractive) {
      const status = getStepStatus(item.id);
      const isDone = status === "completed";
      const isCurr = status === "current";
      return `
                <div style="padding: 0.75rem 1rem; border-radius: 8px; transition: all 0.2s ease; ${isDone ? "background: rgba(34, 197, 94, 0.08);" : isCurr ? "background: rgba(16, 185, 129, 0.08);" : "opacity: 0.5;"}">
                    <p style="margin: 0; font-weight: 600; font-size: 0.875rem; ${isDone ? "color: #15803d; text-decoration: line-through;" : isCurr ? "color: var(--p-primary-600, #059669);" : "color: var(--p-surface-500);"}">
                        ${item.label || item.status || item.title}
                    </p>
                    ${isCurr ? `<p style="font-size: 0.75rem; color: var(--p-surface-500); margin: 0.25rem 0 0 0;">Click the marker to complete</p>` : ""}
                </div>
            `;
    }
    if (isActivityFeed) {
      const userName = typeof item.user === "object" ? item.user.name : item.user;
      const detailsHtml = item.details && item.details.length > 0 ? `
                <div style="margin-top: 0.75rem; padding: 0.75rem; border-radius: 8px; background: var(--p-surface-50); border: 1px solid var(--p-surface-200);">
                    <ul style="margin: 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: 0.35rem;">
                        ${item.details.map((d) => `
                            <li style="font-size: 0.8125rem; font-family: var(--p-font-mono, monospace); color: var(--p-surface-700); display: flex; align-items: center; gap: 0.5rem;">
                                <span style="color: var(--p-surface-400);">${ICONS.minus}</span> ${d}
                            </li>
                        `).join("")}
                    </ul>
                </div>
            ` : "";
      return `
                <div style="padding-bottom: 1.5rem;">
                    <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
                        <span style="font-weight: 600; color: var(--p-surface-900);">${userName}</span>
                        <span style="color: var(--p-surface-500);">${item.action || ""}</span>
                        <span style="font-weight: 600; color: var(--p-primary-600);">${item.target || ""}</span>
                        ${item.repo ? `<span style="color: var(--p-surface-500);">to</span> <code style="padding: 0.15rem 0.45rem; border-radius: 4px; background: var(--p-surface-100); font-size: 0.8125rem; font-family: monospace; color: var(--p-surface-700);">${item.repo}</code>` : ""}
                    </div>
                    ${item.description ? `<p style="margin: 0.35rem 0 0 0; font-size: 0.875rem; color: var(--p-surface-600);">${item.description}</p>` : ""}
                    ${detailsHtml}
                </div>
            `;
    }
    if (item.details || item.tracking || item.user) {
      const detailsHtml = item.details && item.details.length > 0 ? `
                <ul style="margin: 0.75rem 0 0 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: 0.35rem;">
                    ${item.details.map((d) => `
                        <li style="font-size: 0.8125rem; color: var(--p-surface-500); display: flex; align-items: center; gap: 0.5rem;">
                            <span style="color: var(--p-primary-500);">${ICONS.box}</span> ${d}
                        </li>
                    `).join("")}
                </ul>
            ` : "";
      const trackingHtml = item.tracking ? `
                <div style="margin-top: 1rem; padding: 0.65rem 0.85rem; border-radius: 8px; background: var(--p-surface-100); display: flex; align-items: center; justify-content: space-between;">
                    <span style="font-size: 0.8125rem; color: var(--p-surface-700); display: flex; align-items: center; gap: 0.5rem;">
                        ${ICONS.mapPin} Tracking: <strong>${item.tracking}</strong>
                    </span>
                    <button type="button" class="p-button p-component p-button-text" style="font-size: 0.75rem; font-weight: 600; color: var(--p-primary-600); background: transparent; border: none; cursor: pointer; padding: 0.25rem 0.5rem;">Track</button>
                </div>
            ` : "";
      return `
                <div class="p-timeline-card">
                    <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.5rem;">
                        ${item.user ? `<span class="p-timeline-avatar">${item.user}</span>` : ""}
                        <span style="font-weight: 700; font-size: 0.9375rem; color: var(--p-surface-900);">${item.status || item.title}</span>
                    </div>
                    ${item.description ? `<p style="margin: 0; font-size: 0.875rem; color: var(--p-surface-600); line-height: 1.5;">${item.description}</p>` : ""}
                    ${detailsHtml}
                    ${trackingHtml}
                </div>
            `;
    }
    return `
            <div style="font-size: 0.875rem; font-weight: 500; color: var(--p-surface-800, #1e293b);">${item.status || item.title || item.label || JSON.stringify(item)}</div>
        `;
  }
  function render() {
    const isHorizontal = layout === "horizontal";
    const alignClass = `p-timeline-${align}`;
    const layoutClass = isHorizontal ? "p-timeline-horizontal" : "p-timeline-vertical";
    let interactiveHeaderHtml = "";
    let interactiveCelebrationHtml = "";
    if (isInteractive) {
      const allCount = rawEvents.length;
      const doneCount = completedSteps.length;
      const percent = Math.round(doneCount / allCount * 100);
      const isAllDone = doneCount === allCount;
      interactiveHeaderHtml = `
                <div style="display: flex; flex-direction: column; gap: 1rem; margin-bottom: 1.5rem;">
                    <div style="display: flex; align-items: center; justify-content: space-between;">
                        <div>
                            <h3 style="margin: 0; font-size: 1.125rem; font-weight: 700; color: var(--p-surface-900);">Onboarding Progress</h3>
                            <p style="margin: 0.25rem 0 0 0; font-size: 0.8125rem; color: var(--p-surface-500);">${doneCount} of ${allCount} steps completed</p>
                        </div>
                        <button type="button" class="p-interactive-reset-btn p-button p-component p-button-outlined" style="display: inline-flex; align-items: center; gap: 0.4rem; padding: 0.4rem 0.85rem; font-size: 0.8125rem; font-weight: 600; border-radius: 6px; border: 1px solid var(--p-surface-300); background: var(--p-surface-0); cursor: pointer; color: var(--p-surface-700);">
                            ${ICONS.refresh} Reset
                        </button>
                    </div>
                    <div style="width: 100%; height: 0.5rem; border-radius: 9999px; background: var(--p-surface-200); overflow: hidden;">
                        <div style="width: ${percent}%; height: 100%; border-radius: 9999px; background: var(--p-primary-500, #10b981); transition: width 0.4s ease;"></div>
                    </div>
                </div>
            `;
      if (isAllDone) {
        interactiveCelebrationHtml = `
                    <div style="margin-top: 1.5rem; padding: 1rem; border-radius: 8px; background: rgba(34, 197, 94, 0.08); border: 1px solid rgba(34, 197, 94, 0.3); display: flex; flex-direction: column; align-items: center; gap: 0.25rem; text-align: center;">
                        <span style="color: #22c55e;">${ICONS.checkCircle}</span>
                        <div style="font-weight: 700; color: #15803d; font-size: 0.9375rem;">Onboarding Complete!</div>
                        <span style="font-size: 0.8125rem; color: #16a34a;">You've completed all the steps.</span>
                    </div>
                `;
      }
    }
    let activityHeaderHtml = "";
    if (isActivityFeed) {
      activityHeaderHtml = `
                <div style="display: flex; align-items: center; gap: 0.625rem; margin-bottom: 1.25rem;">
                    <span style="color: var(--p-surface-500);">${ICONS.history}</span>
                    <span style="font-size: 1.125rem; font-weight: 700; color: var(--p-surface-900);">Recent Activity</span>
                </div>
            `;
    }
    const eventsHtml = rawEvents.map((item, idx) => {
      const isLast = idx === rawEvents.length - 1;
      return `
                <div class="p-timeline-event" role="listitem">
                    <div class="p-timeline-event-opposite">
                        ${renderOpposite(item)}
                    </div>
                    <div class="p-timeline-event-separator">
                        ${renderMarker(item, isLast)}
                        ${!isLast ? '<div class="p-timeline-event-connector"></div>' : ""}
                    </div>
                    <div class="p-timeline-event-content">
                        ${renderContent(item)}
                    </div>
                </div>
            `;
    }).join("");
    container.innerHTML = `
            <div class="p-timeline-wrapper" style="width: 100%;">
                ${interactiveHeaderHtml}
                ${activityHeaderHtml}
                <div class="p-timeline p-component ${layoutClass} ${alignClass}" role="list">
                    ${eventsHtml}
                </div>
                ${interactiveCelebrationHtml}
            </div>
        `;
    bindEvents();
  }
  function bindEvents() {
    if (isInteractive) {
      container.querySelectorAll(".p-interactive-step-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
          const stepId = parseInt(btn.getAttribute("data-step-id") || "0", 10);
          if (stepId) handleStepComplete(stepId);
        });
      });
      container.querySelector(".p-interactive-reset-btn")?.addEventListener("click", () => {
        handleReset();
      });
    }
  }
  render();
}
export {
  TimelineIsland as default
};
//# sourceMappingURL=timeline-ZRKCIBJ6.js.map
