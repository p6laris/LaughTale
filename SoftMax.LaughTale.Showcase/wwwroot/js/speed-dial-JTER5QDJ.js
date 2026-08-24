import {
  LucideIcons,
  getLucideIcon
} from "./chunk-G3Y35IKD.js";
import {
  injectIslandStyle
} from "./chunk-3TFPN5JM.js";

// ../SoftMax.LaughTale.Client/src/components/speed-dial.ts
var SPEEDDIAL_CSS = `
.p-speeddial {
    position: relative;
    display: inline-flex;
    z-index: 10;
}

.p-speeddial-button {
    position: relative;
    z-index: 2;
    cursor: pointer;
    user-select: none;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 3rem;
    height: 3rem;
    border-radius: 50%;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.15), 0 2px 4px -1px rgba(0, 0, 0, 0.1);
    transition: background-color 0.2s, border-color 0.2s, box-shadow 0.2s;
    outline: none;
}

.p-speeddial-button:focus-visible {
    outline: 2px solid var(--p-primary-500, #10b981);
    outline-offset: 2px;
}

.p-speeddial-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition: transform 300ms cubic-bezier(0.16, 1, 0.3, 1);
}

.p-speeddial-icon svg {
    width: 20px;
    height: 20px;
    stroke: currentColor;
    stroke-width: 2.2;
}

.p-speeddial.p-speeddial-opened .p-speeddial-icon.p-speeddial-rotate {
    transform: rotate(45deg);
}

.p-speeddial-list {
    margin: 0;
    padding: 0;
    list-style: none;
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: 0;
    left: 0;
    width: 3rem;
    height: 3rem;
    pointer-events: none;
    z-index: 1;
    overflow: visible;
}

.p-speeddial.p-speeddial-opened .p-speeddial-list {
    pointer-events: auto;
}

.p-speeddial-item {
    position: absolute;
    top: 50%;
    left: 50%;
    margin-top: -1.25rem;
    margin-left: -1.25rem;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transform: translate3d(0, 0, 0) scale(0);
    transition-property: transform, opacity;
    transition-duration: 300ms, 200ms;
    transition-timing-function: cubic-bezier(0.16, 1, 0.3, 1), cubic-bezier(0.16, 1, 0.3, 1);
    pointer-events: none;
    will-change: transform, opacity;
    z-index: 1;
}

.p-speeddial.p-speeddial-opened .p-speeddial-item {
    pointer-events: auto;
}

.p-speeddial-item:hover,
.p-speeddial-item:focus-within {
    z-index: 100 !important;
}

/* Action Button: Authentic Aura Slate / Surface Styling */
.p-speeddial-action {
    width: 2.5rem !important;
    height: 2.5rem !important;
    border-radius: 50% !important;
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
    text-decoration: none !important;
    border: 1px solid var(--p-surface-200, #e2e8f0) !important;
    background: var(--p-surface-0, #ffffff) !important;
    color: var(--p-surface-600, #475569) !important;
    box-shadow: 0 3px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06) !important;
    cursor: pointer !important;
    position: relative !important;
    transition: background-color 0.15s ease, color 0.15s ease, border-color 0.15s ease, transform 0.15s ease, box-shadow 0.15s ease !important;
    outline: none !important;
}

.p-speeddial-action svg {
    width: 18px !important;
    height: 18px !important;
    stroke: currentColor !important;
    stroke-width: 2 !important;
}

.p-speeddial-action:hover:not(:disabled) {
    background: var(--p-surface-100, #f1f5f9) !important;
    color: var(--p-surface-900, #0f172a) !important;
    border-color: var(--p-surface-300, #cbd5e1) !important;
    transform: scale(1.1) !important;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05) !important;
}

.p-speeddial-action:focus-visible {
    outline: 2px solid var(--p-primary-500, #10b981) !important;
    outline-offset: 2px !important;
}

.p-speeddial-action:disabled {
    opacity: 0.5 !important;
    cursor: not-allowed !important;
    pointer-events: none !important;
}

/* Custom Template Layout */
.p-speeddial-custom-item {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 0.75rem;
    cursor: pointer;
    text-decoration: none;
    white-space: nowrap;
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
}

.p-speeddial-custom-label {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 5.5rem;
    padding: 0.5rem 1rem;
    border-radius: var(--p-border-radius, 6px);
    background: var(--p-surface-0, #ffffff);
    border: 1px solid var(--p-surface-200, #e2e8f0);
    color: var(--p-surface-700, #334155);
    font-weight: 500;
    font-size: 0.875rem;
    box-shadow: 0 2px 4px rgba(0,0,0,0.06);
    transition: background-color 0.15s, color 0.15s, border-color 0.15s;
    user-select: none;
}

.p-speeddial-custom-icon {
    width: 3rem;
    height: 3rem;
    border-radius: 50%;
    background: var(--p-surface-0, #ffffff);
    border: 1px solid var(--p-surface-200, #e2e8f0);
    color: var(--p-surface-600, #475569);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 4px rgba(0,0,0,0.06);
    transition: background-color 0.15s, color 0.15s, border-color 0.15s, transform 0.15s;
    cursor: pointer;
    outline: none;
}

.p-speeddial-custom-icon svg {
    width: 20px;
    height: 20px;
    stroke: currentColor;
    stroke-width: 2;
}

.p-speeddial-custom-item:hover .p-speeddial-custom-label,
.p-speeddial-custom-item:hover .p-speeddial-custom-icon {
    background: var(--p-surface-100, #f1f5f9);
    color: var(--p-surface-900, #0f172a);
    border-color: var(--p-surface-300, #cbd5e1);
}

.p-speeddial-custom-item:hover .p-speeddial-custom-icon {
    transform: scale(1.05);
}

/* Tooltips */
.p-speeddial-tooltip {
    position: absolute;
    background: var(--p-surface-900, #0f172a);
    color: #ffffff;
    padding: 0.35rem 0.65rem;
    font-size: 0.75rem;
    font-weight: 600;
    line-height: 1;
    border-radius: var(--p-border-radius-sm, 4px);
    white-space: nowrap;
    pointer-events: none;
    z-index: 1000 !important;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3);
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.15s ease, visibility 0.15s ease, transform 0.15s ease;
}

.p-speeddial-tooltip::after {
    content: '';
    position: absolute;
    width: 0;
    height: 0;
    border-style: solid;
}

.p-speeddial-tooltip.tooltip-left {
    right: calc(100% + 8px);
    top: 50%;
    transform: translateY(-50%) scale(0.9);
}
.p-speeddial-tooltip.tooltip-left::after {
    right: -4px;
    top: 50%;
    transform: translateY(-50%);
    border-width: 4px 0 4px 4px;
    border-color: transparent transparent transparent var(--p-surface-900, #0f172a);
}
.p-speeddial-tooltip.tooltip-left.p-tooltip-visible {
    opacity: 1;
    visibility: visible;
    transform: translateY(-50%) scale(1);
}

.p-speeddial-tooltip.tooltip-right {
    left: calc(100% + 8px);
    top: 50%;
    transform: translateY(-50%) scale(0.9);
}
.p-speeddial-tooltip.tooltip-right::after {
    left: -4px;
    top: 50%;
    transform: translateY(-50%);
    border-width: 4px 4px 4px 0;
    border-color: transparent var(--p-surface-900, #0f172a) transparent transparent;
}
.p-speeddial-tooltip.tooltip-right.p-tooltip-visible {
    opacity: 1;
    visibility: visible;
    transform: translateY(-50%) scale(1);
}

.p-speeddial-tooltip.tooltip-top {
    bottom: calc(100% + 8px);
    left: 50%;
    transform: translateX(-50%) scale(0.9);
}
.p-speeddial-tooltip.tooltip-top::after {
    bottom: -4px;
    left: 50%;
    transform: translateX(-50%);
    border-width: 4px 4px 0 4px;
    border-color: var(--p-surface-900, #0f172a) transparent transparent transparent;
}
.p-speeddial-tooltip.tooltip-top.p-tooltip-visible {
    opacity: 1;
    visibility: visible;
    transform: translateX(-50%) scale(1);
}

.p-speeddial-tooltip.tooltip-bottom {
    top: calc(100% + 8px);
    left: 50%;
    transform: translateX(-50%) scale(0.9);
}
.p-speeddial-tooltip.tooltip-bottom::after {
    top: -4px;
    left: 50%;
    transform: translateX(-50%);
    border-width: 0 4px 4px 4px;
    border-color: transparent transparent var(--p-surface-900, #0f172a) transparent;
}
.p-speeddial-tooltip.tooltip-bottom.p-tooltip-visible {
    opacity: 1;
    visibility: visible;
    transform: translateX(-50%) scale(1);
}

/* Mask */
.p-speeddial-mask {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.4);
    border-radius: inherit;
    z-index: 5;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.25s ease;
}

.p-speeddial-mask.p-speeddial-mask-visible {
    opacity: 1;
    pointer-events: auto;
}

/* Dark Mode */
.dark .p-speeddial-action,
[data-theme="dark"] .p-speeddial-action {
    background: var(--p-surface-900, #0f172a) !important;
    border-color: var(--p-surface-700, #334155) !important;
    color: var(--p-surface-300, #cbd5e1) !important;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.4) !important;
}

.dark .p-speeddial-action:hover:not(:disabled),
[data-theme="dark"] .p-speeddial-action:hover:not(:disabled) {
    background: var(--p-surface-800, #1e293b) !important;
    color: #ffffff !important;
    border-color: var(--p-surface-600, #475569) !important;
}

.dark .p-speeddial-custom-label,
.dark .p-speeddial-custom-icon,
[data-theme="dark"] .p-speeddial-custom-label,
[data-theme="dark"] .p-speeddial-custom-icon {
    background: var(--p-surface-900, #0f172a);
    border-color: var(--p-surface-700, #334155);
    color: var(--p-surface-400, #94a3b8);
}

.dark .p-speeddial-custom-item:hover .p-speeddial-custom-label,
.dark .p-speeddial-custom-item:hover .p-speeddial-custom-icon,
[data-theme="dark"] .p-speeddial-custom-item:hover .p-speeddial-custom-label,
[data-theme="dark"] .p-speeddial-custom-item:hover .p-speeddial-custom-icon {
    background: var(--p-surface-800, #1e293b);
    color: #ffffff;
    border-color: var(--p-surface-600, #475569);
}

.dark .p-speeddial-tooltip,
[data-theme="dark"] .p-speeddial-tooltip {
    background: var(--p-surface-800, #1e293b);
    color: #ffffff;
    border: 1px solid var(--p-surface-700, #334155);
}
.dark .p-speeddial-tooltip.tooltip-left::after,
[data-theme="dark"] .p-speeddial-tooltip.tooltip-left::after {
    border-color: transparent transparent transparent var(--p-surface-800, #1e293b);
}
.dark .p-speeddial-tooltip.tooltip-right::after,
[data-theme="dark"] .p-speeddial-tooltip.tooltip-right::after {
    border-color: transparent var(--p-surface-800, #1e293b) transparent transparent;
}
.dark .p-speeddial-tooltip.tooltip-top::after,
[data-theme="dark"] .p-speeddial-tooltip.tooltip-top::after {
    border-color: var(--p-surface-800, #1e293b) transparent transparent transparent;
}
.dark .p-speeddial-tooltip.tooltip-bottom::after,
[data-theme="dark"] .p-speeddial-tooltip.tooltip-bottom::after {
    border-color: transparent transparent var(--p-surface-800, #1e293b) transparent;
}
`;
function SpeedDialIsland(container, props) {
  injectIslandStyle("speed-dial", SPEEDDIAL_CSS);
  const items = props.model || props.actions || [];
  const direction = props.direction || "up";
  const type = props.type || "linear";
  const radius = props.radius || (type === "quarter-circle" ? 120 : 80);
  const transitionDelay = props.transitionDelay !== void 0 ? Number(props.transitionDelay) : 30;
  const rotateAnimation = props.rotateAnimation !== false;
  const mask = !!props.mask;
  const isCustomTemplate = props.template === "custom";
  const hasTooltips = !!props.tooltipOptions;
  const tooltipPosition = props.tooltipOptions?.position || (direction === "left" ? "top" : direction === "right" ? "top" : "left");
  let isOpen = false;
  const btnSev = props.buttonProps?.severity || "contrast";
  let btnSevClass = "p-button-contrast";
  if (btnSev !== "contrast") {
    btnSevClass = `p-button-${btnSev.toLowerCase()}`;
  }
  const btnRounded = props.buttonProps?.rounded !== false ? "p-button-rounded" : "";
  const btnIconOnly = props.buttonProps?.iconOnly !== false ? "p-button-icon-only" : "";
  const customBtnClass = props.buttonProps?.styleClass || "";
  function calculatePosition(index, count) {
    if (type === "linear") {
      const spacing = 52;
      const distance = (index + 1) * spacing;
      switch (direction) {
        case "up":
          return { x: 0, y: -distance };
        case "down":
          return { x: 0, y: distance };
        case "left":
          return { x: -distance, y: 0 };
        case "right":
          return { x: distance, y: 0 };
        default:
          return { x: 0, y: -distance };
      }
    }
    if (type === "circle") {
      const step = 2 * Math.PI / count;
      const angle = index * step - Math.PI / 2;
      return {
        x: Math.round(radius * Math.cos(angle)),
        y: Math.round(radius * Math.sin(angle))
      };
    }
    if (type === "semi-circle") {
      const step = count > 1 ? Math.PI / (count - 1) : 0;
      switch (direction) {
        case "up": {
          const angle = Math.PI - index * step;
          return {
            x: Math.round(radius * Math.cos(angle)),
            y: Math.round(-radius * Math.sin(angle))
          };
        }
        case "down": {
          const angle = Math.PI - index * step;
          return {
            x: Math.round(radius * Math.cos(angle)),
            y: Math.round(radius * Math.sin(angle))
          };
        }
        case "left": {
          const angle = -Math.PI / 2 - index * step;
          return {
            x: Math.round(radius * Math.cos(angle)),
            y: Math.round(radius * Math.sin(angle))
          };
        }
        case "right": {
          const angle = -Math.PI / 2 + index * step;
          return {
            x: Math.round(radius * Math.cos(angle)),
            y: Math.round(radius * Math.sin(angle))
          };
        }
        default: {
          const angle = Math.PI - index * step;
          return {
            x: Math.round(radius * Math.cos(angle)),
            y: Math.round(-radius * Math.sin(angle))
          };
        }
      }
    }
    if (type === "quarter-circle") {
      const step = count > 1 ? Math.PI / 2 / (count - 1) : 0;
      switch (direction) {
        case "up-left": {
          const angle = index * step;
          return {
            x: Math.round(-radius * Math.cos(angle)),
            y: Math.round(-radius * Math.sin(angle))
          };
        }
        case "up-right": {
          const angle = index * step;
          return {
            x: Math.round(radius * Math.cos(angle)),
            y: Math.round(-radius * Math.sin(angle))
          };
        }
        case "down-left": {
          const angle = index * step;
          return {
            x: Math.round(-radius * Math.cos(angle)),
            y: Math.round(radius * Math.sin(angle))
          };
        }
        case "down-right": {
          const angle = index * step;
          return {
            x: Math.round(radius * Math.sin(angle)),
            y: Math.round(radius * Math.cos(angle))
          };
        }
        default: {
          const angle = index * step;
          return {
            x: Math.round(-radius * Math.cos(angle)),
            y: Math.round(-radius * Math.sin(angle))
          };
        }
      }
    }
    return { x: 0, y: 0 };
  }
  const uniqueId = "speeddial_" + Math.random().toString(36).substring(2, 9);
  let maskHtml = "";
  if (mask) {
    maskHtml = `<div class="p-speeddial-mask"></div>`;
  }
  const itemsHtml = items.map((item, index) => {
    const iconHtml = item.icon ? getLucideIcon(item.icon, 18) : LucideIcons.zap;
    const tooltipText = hasTooltips || item.tooltip ? item.tooltip || item.label || "" : "";
    const tooltipHtml = tooltipText ? `
            <span class="p-speeddial-tooltip tooltip-${tooltipPosition}" data-index="${index}">
                ${tooltipText}
            </span>
        ` : "";
    if (isCustomTemplate) {
      return `
                <li class="p-speeddial-item" role="none" data-index="${index}">
                    <div class="p-speeddial-custom-item" data-index="${index}">
                        <span class="p-speeddial-custom-label">${item.label || ""}</span>
                        <button type="button" class="p-speeddial-custom-icon" aria-label="${item.label || ""}" tabindex="-1">
                            ${iconHtml}
                        </button>
                    </div>
                </li>
            `;
    }
    const tag = item.url ? "a" : "button";
    const hrefAttr = item.url ? `href="${item.url}" target="${item.target || "_self"}" rel="noopener"` : `type="button"`;
    return `
            <li class="p-speeddial-item" role="none" data-index="${index}">
                <${tag} ${hrefAttr} 
                   class="p-speeddial-action ${item.styleClass || ""}" 
                   role="menuitem"
                   data-index="${index}"
                   tabindex="-1"
                   aria-label="${item.label || tooltipText || "Action"}"
                   ${item.disabled ? 'disabled aria-disabled="true"' : ""}>
                    ${iconHtml}
                    ${tooltipHtml}
                </${tag}>
            </li>
        `;
  }).join("");
  const rotateClass = rotateAnimation ? "p-speeddial-rotate" : "";
  const ariaLabel = props.ariaLabel || "Speed Dial Options";
  container.innerHTML = `
        ${maskHtml}
        <div class="p-speeddial p-component p-speeddial-direction-${direction} p-speeddial-${type}">
            <button type="button" 
                    class="p-speeddial-button p-button ${btnSevClass} ${btnRounded} ${btnIconOnly} ${customBtnClass}"
                    aria-haspopup="true"
                    aria-expanded="false"
                    aria-controls="${uniqueId}_list"
                    aria-label="${ariaLabel}">
                <span class="p-speeddial-icon ${rotateClass}">
                    ${LucideIcons.plus}
                </span>
            </button>
            <ul id="${uniqueId}_list" class="p-speeddial-list" role="menu" aria-label="${ariaLabel}">
                ${itemsHtml}
            </ul>
        </div>
    `;
  const rootEl = container.querySelector(".p-speeddial");
  const mainBtn = container.querySelector(".p-speeddial-button");
  const maskEl = container.querySelector(".p-speeddial-mask");
  const itemElements = Array.from(container.querySelectorAll(".p-speeddial-item"));
  function applyAnimation(opening) {
    isOpen = opening;
    rootEl.classList.toggle("p-speeddial-opened", opening);
    mainBtn.setAttribute("aria-expanded", String(opening));
    if (maskEl) {
      maskEl.classList.toggle("p-speeddial-mask-visible", opening);
    }
    requestAnimationFrame(() => {
      itemElements.forEach((li, index) => {
        const pos = calculatePosition(index, items.length);
        const delay = opening ? transitionDelay * index : transitionDelay * (items.length - 1 - index);
        li.style.transitionDelay = `${delay}ms`;
        if (isCustomTemplate) {
          if (opening) {
            li.style.transform = `translate3d(0, ${pos.y}px, 0) scale(1)`;
            li.style.opacity = "1";
          } else {
            li.style.transform = `translate3d(0, 0, 0) scale(0)`;
            li.style.opacity = "0";
          }
        } else {
          if (opening) {
            li.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) scale(1)`;
            li.style.opacity = "1";
          } else {
            li.style.transform = `translate3d(0, 0, 0) scale(0)`;
            li.style.opacity = "0";
          }
        }
        const interactive = li.querySelector(".p-speeddial-action, .p-speeddial-custom-icon");
        if (interactive) {
          interactive.setAttribute("tabindex", opening ? "0" : "-1");
        }
      });
    });
  }
  function toggle() {
    applyAnimation(!isOpen);
  }
  function close() {
    if (isOpen) {
      applyAnimation(false);
      mainBtn.focus();
    }
  }
  mainBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    toggle();
  });
  maskEl?.addEventListener("click", (e) => {
    e.stopPropagation();
    close();
  });
  document.addEventListener("click", (e) => {
    if (isOpen && !container.contains(e.target)) {
      close();
    }
  });
  mainBtn.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggle();
    } else if (e.key === "ArrowDown" || e.key === "ArrowRight") {
      if (!isOpen) {
        e.preventDefault();
        applyAnimation(true);
        const first = container.querySelector(".p-speeddial-action, .p-speeddial-custom-icon");
        first?.focus();
      }
    } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
      if (!isOpen) {
        e.preventDefault();
        applyAnimation(true);
        const actions = container.querySelectorAll(".p-speeddial-action, .p-speeddial-custom-icon");
        if (actions.length) actions[actions.length - 1].focus();
      }
    }
  });
  const actionElements = container.querySelectorAll(".p-speeddial-action, .p-speeddial-custom-item");
  actionElements.forEach((el) => {
    const index = parseInt(el.getAttribute("data-index") || "-1", 10);
    const item = items[index];
    el.addEventListener("click", (e) => {
      if (item?.disabled) return;
      container.dispatchEvent(new CustomEvent("speeddial:action", {
        bubbles: true,
        detail: { item, index }
      }));
      if (item?.command) {
        try {
          const fn = new Function("item", item.command);
          fn(item);
        } catch (err) {
          console.error("SpeedDial command error:", err);
        }
      }
      close();
    });
    const tooltip = el.querySelector(".p-speeddial-tooltip");
    if (tooltip) {
      el.addEventListener("mouseenter", () => tooltip.classList.add("p-tooltip-visible"));
      el.addEventListener("mouseleave", () => tooltip.classList.remove("p-tooltip-visible"));
    }
    el.addEventListener("keydown", (e) => {
      const allActions = Array.from(container.querySelectorAll(".p-speeddial-action, .p-speeddial-custom-icon"));
      const currentIndex = allActions.indexOf(el);
      if (e.key === "Escape") {
        e.preventDefault();
        close();
      } else if (e.key === "ArrowDown" || e.key === "ArrowRight") {
        e.preventDefault();
        const next = (currentIndex + 1) % allActions.length;
        allActions[next]?.focus();
      } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        e.preventDefault();
        const prev = (currentIndex - 1 + allActions.length) % allActions.length;
        allActions[prev]?.focus();
      } else if (e.key === "Home") {
        e.preventDefault();
        allActions[0]?.focus();
      } else if (e.key === "End") {
        e.preventDefault();
        allActions[allActions.length - 1]?.focus();
      }
    });
  });
}
export {
  SpeedDialIsland as default
};
//# sourceMappingURL=speed-dial-JTER5QDJ.js.map
