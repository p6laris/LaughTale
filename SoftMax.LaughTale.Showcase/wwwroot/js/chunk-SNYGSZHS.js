import {
  injectIslandStyle
} from "./chunk-3TFPN5JM.js";

// ../SoftMax.LaughTale.Client/src/directives/tooltip.ts
var TOOLTIP_CSS = `
.p-tooltip {
    position: fixed;
    z-index: 100000;
    pointer-events: none;
    visibility: hidden;
    opacity: 0;
    transform: scale(0.92);
    transform-origin: center center;
    will-change: transform, opacity;
    transition: transform 0.15s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.15s ease, visibility 0.15s;
}

.p-tooltip.p-tooltip-active {
    visibility: visible !important;
    opacity: 1 !important;
    transform: scale(1) !important;
}

.p-tooltip.p-tooltip-interactive {
    pointer-events: auto;
}

.p-tooltip-text {
    background: var(--p-surface-800, #1e293b);
    color: var(--p-surface-0, #ffffff);
    font-size: 0.75rem;
    font-weight: 500;
    line-height: 1.4;
    padding: 0.4rem 0.8rem;
    border-radius: var(--p-border-radius, 6px);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.25), 0 4px 6px -4px rgba(0, 0, 0, 0.1);
    max-width: 18rem;
    word-break: break-word;
    display: inline-flex;
    align-items: center;
}

/* Arrow Notch */
.p-tooltip-arrow {
    position: absolute;
    width: 8px;
    height: 8px;
    background: var(--p-surface-800, #1e293b);
    transform: rotate(45deg);
    z-index: 1;
}

.p-tooltip-top .p-tooltip-arrow {
    bottom: -4px;
    left: calc(50% - 4px);
}
.p-tooltip-bottom .p-tooltip-arrow {
    top: -4px;
    left: calc(50% - 4px);
}
.p-tooltip-left .p-tooltip-arrow {
    right: -4px;
    top: calc(50% - 4px);
}
.p-tooltip-right .p-tooltip-arrow {
    left: -4px;
    top: calc(50% - 4px);
}

/* Dark Mode Tokens */
.dark .p-tooltip-text,
[data-theme="dark"] .p-tooltip-text {
    background: var(--p-surface-900, #0f172a);
    color: var(--p-surface-0, #f8fafc);
    border: 1px solid var(--p-surface-700, #334155);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.5);
}

.dark .p-tooltip-arrow,
[data-theme="dark"] .p-tooltip-arrow {
    background: var(--p-surface-900, #0f172a);
    border-color: var(--p-surface-700, #334155);
}
`;
var activeTooltipEl = null;
var currentTargetEl = null;
var showTimeoutId = null;
var hideTimeoutId = null;
var globalTooltipDelegationBound = false;
function findTooltipTarget(startEl) {
  let curr = startEl;
  while (curr && curr !== document.body && curr !== document.documentElement) {
    for (const attr of Array.from(curr.attributes)) {
      const name = attr.name.toLowerCase();
      if (name === "p-tooltip" || name.startsWith("p-tooltip.") || name === "v-tooltip" || name.startsWith("v-tooltip.") || name === "data-tooltip" || name.startsWith("data-tooltip.") || name === "l-tooltip" || name.startsWith("l-tooltip.") || name === "data-tooltip-target") {
        return curr;
      }
    }
    curr = curr.parentElement;
  }
  return null;
}
function parseTooltipConfig(element) {
  let rawValue = "";
  let position = "right";
  for (const attr of Array.from(element.attributes)) {
    const name = attr.name.toLowerCase();
    if (name === "p-tooltip" || name === "v-tooltip" || name === "data-tooltip" || name === "l-tooltip" || name.startsWith("p-tooltip.") || name.startsWith("v-tooltip.") || name.startsWith("l-tooltip.") || name.startsWith("data-tooltip.")) {
      rawValue = attr.value;
      if (name.includes(".top")) position = "top";
      else if (name.includes(".bottom")) position = "bottom";
      else if (name.includes(".left")) position = "left";
      else if (name.includes(".right")) position = "right";
      break;
    }
  }
  if (!rawValue) {
    const targetId = element.getAttribute("data-tooltip-target");
    if (targetId) {
      const template = document.getElementById(targetId);
      if (template) rawValue = template.innerHTML;
    }
  }
  if (!rawValue) return null;
  if (rawValue.trim().startsWith("{") && rawValue.trim().endsWith("}")) {
    try {
      const parsed = JSON.parse(rawValue);
      return {
        value: parsed.value || "",
        position: parsed.position || position,
        showDelay: parsed.showDelay !== void 0 ? Number(parsed.showDelay) : 0,
        hideDelay: parsed.hideDelay !== void 0 ? Number(parsed.hideDelay) : 0,
        event: parsed.event || "hover",
        autoHide: parsed.autoHide !== false,
        escape: parsed.escape !== false,
        class: parsed.class || ""
      };
    } catch {
    }
  }
  const posAttr = element.getAttribute("p-tooltip-position") || element.getAttribute("data-tooltip-position");
  if (posAttr) position = posAttr;
  const showDelayAttr = element.getAttribute("p-tooltip-show-delay") || element.getAttribute("data-tooltip-show-delay");
  const hideDelayAttr = element.getAttribute("p-tooltip-hide-delay") || element.getAttribute("data-tooltip-hide-delay");
  const eventAttr = element.getAttribute("p-tooltip-event") || element.getAttribute("data-tooltip-event");
  const autoHideAttr = element.getAttribute("p-tooltip-auto-hide") || element.getAttribute("data-tooltip-auto-hide");
  const escapeAttr = element.getAttribute("p-tooltip-escape") || element.getAttribute("data-tooltip-escape");
  return {
    value: rawValue,
    position,
    showDelay: showDelayAttr ? parseInt(showDelayAttr, 10) : 0,
    hideDelay: hideDelayAttr ? parseInt(hideDelayAttr, 10) : 0,
    event: eventAttr || "hover",
    autoHide: autoHideAttr !== "false",
    escape: escapeAttr !== "false"
  };
}
function positionTooltip(tooltipEl, targetEl, position) {
  const targetRect = targetEl.getBoundingClientRect();
  const tooltipRect = tooltipEl.getBoundingClientRect();
  const margin = 8;
  let top = 0;
  let left = 0;
  switch (position) {
    case "top":
      top = targetRect.top - tooltipRect.height - margin;
      left = targetRect.left + targetRect.width / 2 - tooltipRect.width / 2;
      break;
    case "bottom":
      top = targetRect.bottom + margin;
      left = targetRect.left + targetRect.width / 2 - tooltipRect.width / 2;
      break;
    case "left":
      top = targetRect.top + targetRect.height / 2 - tooltipRect.height / 2;
      left = targetRect.left - tooltipRect.width - margin;
      break;
    case "right":
    default:
      top = targetRect.top + targetRect.height / 2 - tooltipRect.height / 2;
      left = targetRect.right + margin;
      break;
  }
  if (left < 8) left = 8;
  if (left + tooltipRect.width > window.innerWidth - 8) {
    left = window.innerWidth - tooltipRect.width - 8;
  }
  if (top < 8) top = 8;
  if (top + tooltipRect.height > window.innerHeight - 8) {
    top = window.innerHeight - tooltipRect.height - 8;
  }
  tooltipEl.style.top = `${Math.round(top)}px`;
  tooltipEl.style.left = `${Math.round(left)}px`;
}
function showTooltipForElement(targetEl, config) {
  if (hideTimeoutId) {
    clearTimeout(hideTimeoutId);
    hideTimeoutId = null;
  }
  if (showTimeoutId) {
    clearTimeout(showTimeoutId);
    showTimeoutId = null;
  }
  const triggerShow = () => {
    if (!activeTooltipEl) {
      activeTooltipEl = document.createElement("div");
      activeTooltipEl.className = "p-tooltip p-component";
      activeTooltipEl.setAttribute("role", "tooltip");
      document.body.appendChild(activeTooltipEl);
    }
    currentTargetEl = targetEl;
    const pos = config.position || "right";
    activeTooltipEl.className = `p-tooltip p-component p-tooltip-${pos} ${config.class || ""}`;
    if (!config.autoHide) {
      activeTooltipEl.classList.add("p-tooltip-interactive");
    }
    if (config.escape) {
      activeTooltipEl.innerHTML = `
                <div class="p-tooltip-arrow"></div>
                <div class="p-tooltip-text">${escapeHtml(config.value)}</div>
            `;
    } else {
      activeTooltipEl.innerHTML = `
                <div class="p-tooltip-arrow"></div>
                <div class="p-tooltip-text">${config.value}</div>
            `;
    }
    positionTooltip(activeTooltipEl, targetEl, pos);
    activeTooltipEl.classList.add("p-tooltip-active");
  };
  if (config.showDelay && config.showDelay > 0) {
    showTimeoutId = setTimeout(triggerShow, config.showDelay);
  } else {
    triggerShow();
  }
}
function hideActiveTooltip(delay = 0) {
  if (showTimeoutId) {
    clearTimeout(showTimeoutId);
    showTimeoutId = null;
  }
  if (hideTimeoutId) {
    clearTimeout(hideTimeoutId);
    hideTimeoutId = null;
  }
  const triggerHide = () => {
    if (activeTooltipEl) {
      activeTooltipEl.classList.remove("p-tooltip-active");
      currentTargetEl = null;
    }
  };
  if (delay > 0) {
    hideTimeoutId = setTimeout(triggerHide, delay);
  } else {
    triggerHide();
  }
}
function escapeHtml(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
function initGlobalTooltipDelegation() {
  if (globalTooltipDelegationBound || typeof document === "undefined") return;
  globalTooltipDelegationBound = true;
  injectIslandStyle("tooltip", TOOLTIP_CSS);
  document.addEventListener("mouseover", (e) => {
    const target = findTooltipTarget(e.target);
    if (target) {
      const config = parseTooltipConfig(target);
      if (config && (config.event === "hover" || config.event === "both" || !config.event)) {
        showTooltipForElement(target, config);
      }
    }
  });
  document.addEventListener("mouseout", (e) => {
    const target = findTooltipTarget(e.target);
    if (target && target === currentTargetEl) {
      const config = parseTooltipConfig(target);
      hideActiveTooltip(config?.hideDelay || 0);
    }
  });
  document.addEventListener("focusin", (e) => {
    const target = findTooltipTarget(e.target);
    if (target) {
      const config = parseTooltipConfig(target);
      if (config && (config.event === "focus" || config.event === "both")) {
        showTooltipForElement(target, config);
      }
    }
  });
  document.addEventListener("focusout", (e) => {
    const target = findTooltipTarget(e.target);
    if (target && target === currentTargetEl) {
      const config = parseTooltipConfig(target);
      hideActiveTooltip(config?.hideDelay || 0);
    }
  });
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && activeTooltipEl) {
      hideActiveTooltip(0);
    }
  });
}
if (typeof document !== "undefined") {
  initGlobalTooltipDelegation();
}
function bindTooltipDirectives(element) {
  initGlobalTooltipDelegation();
}

export {
  initGlobalTooltipDelegation,
  bindTooltipDirectives
};
//# sourceMappingURL=chunk-SNYGSZHS.js.map
