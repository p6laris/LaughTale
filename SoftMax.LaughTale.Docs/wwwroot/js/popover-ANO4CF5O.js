import {
  injectIslandStyle
} from "./chunk-3TFPN5JM.js";

// ../SoftMax.LaughTale.Client/src/components/popover.ts
var POPOVER_CSS = `
.p-popover {
    position: fixed;
    z-index: 1200;
    box-sizing: border-box;
    background: var(--p-surface-0, #ffffff);
    border: 1px solid var(--p-border-color, #e2e8f0);
    border-radius: var(--p-border-radius, 8px);
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
    padding: 1.25rem;
    color: var(--p-text-color, #0f172a);
    pointer-events: none;
    visibility: hidden;
    opacity: 0;
    transform: scale(0.95) translateY(4px);
    transform-origin: center top;
    will-change: transform, opacity;
    transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.2s cubic-bezier(0.16, 1, 0.3, 1), visibility 0.2s;
}

.p-popover.p-popover-active {
    visibility: visible;
    opacity: 1;
    pointer-events: auto;
    transform: scale(1) translateY(0);
}

/* Arrow Notch */
.p-popover-arrow {
    position: absolute;
    width: 10px;
    height: 10px;
    background: var(--p-surface-0, #ffffff);
    border: 1px solid var(--p-border-color, #e2e8f0);
    transform: rotate(45deg);
    pointer-events: none;
    z-index: 1;
}

.p-popover-arrow-top {
    top: -6px;
    border-bottom: none;
    border-right: none;
}

.p-popover-arrow-bottom {
    bottom: -6px;
    border-top: none;
    border-left: none;
}

/* Dark Mode Tokens */
.dark .p-popover,
[data-theme="dark"] .p-popover {
    background: var(--p-surface-900, #0f172a);
    border-color: var(--p-surface-700, #334155);
    color: var(--p-surface-0, #f8fafc);
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5);
}

.dark .p-popover-arrow,
[data-theme="dark"] .p-popover-arrow {
    background: var(--p-surface-900, #0f172a);
    border-color: var(--p-surface-700, #334155);
}
`;
var globalPopoverDelegationBound = false;
function positionPopover(popoverEl, targetEl, preferredPlacement = "bottom") {
  const targetRect = targetEl.getBoundingClientRect();
  const popoverRect = popoverEl.getBoundingClientRect();
  const arrowEl = popoverEl.querySelector(".p-popover-arrow");
  const margin = 10;
  let top = 0;
  let left = 0;
  let placement = preferredPlacement;
  const spaceBelow = window.innerHeight - targetRect.bottom;
  const spaceAbove = targetRect.top;
  if (placement === "bottom" && spaceBelow < popoverRect.height + margin && spaceAbove > spaceBelow) {
    placement = "top";
  } else if (placement === "top" && spaceAbove < popoverRect.height + margin && spaceBelow > spaceAbove) {
    placement = "bottom";
  }
  if (placement === "bottom") {
    top = targetRect.bottom + margin;
    if (arrowEl) {
      arrowEl.className = "p-popover-arrow p-popover-arrow-top";
    }
  } else {
    top = targetRect.top - popoverRect.height - margin;
    if (arrowEl) {
      arrowEl.className = "p-popover-arrow p-popover-arrow-bottom";
    }
  }
  left = targetRect.left + targetRect.width / 2 - popoverRect.width / 2;
  if (left < 12) left = 12;
  if (left + popoverRect.width > window.innerWidth - 12) {
    left = window.innerWidth - popoverRect.width - 12;
  }
  popoverEl.style.top = `${Math.round(top)}px`;
  popoverEl.style.left = `${Math.round(left)}px`;
  if (arrowEl) {
    const arrowLeft = targetRect.left + targetRect.width / 2 - left - 5;
    arrowEl.style.left = `${Math.max(12, Math.min(popoverRect.width - 22, arrowLeft))}px`;
  }
}
function initGlobalPopoverDelegation() {
  if (globalPopoverDelegationBound || typeof document === "undefined") return;
  globalPopoverDelegationBound = true;
  document.addEventListener("click", (e) => {
    const target = e.target;
    const trigger = target.closest("[data-popover-target], [data-popover-open], [data-popover-toggle]");
    if (trigger) {
      e.preventDefault();
      e.stopPropagation();
      const popoverId = trigger.getAttribute("data-popover-target") || trigger.getAttribute("data-popover-open") || trigger.getAttribute("data-popover-toggle");
      const anchorId = trigger.getAttribute("data-popover-anchor");
      const targetAnchor = anchorId ? document.getElementById(anchorId) : trigger;
      if (popoverId && targetAnchor) {
        const popoverContainer = document.getElementById(popoverId);
        const popoverEl = popoverContainer?.querySelector(".p-popover") || popoverContainer;
        if (popoverEl) {
          const isActive = popoverEl.classList.contains("p-popover-active");
          document.querySelectorAll(".p-popover.p-popover-active").forEach((p) => {
            if (p !== popoverEl) p.classList.remove("p-popover-active");
          });
          if (!isActive) {
            positionPopover(popoverEl, targetAnchor);
            popoverEl.classList.add("p-popover-active");
          } else {
            popoverEl.classList.remove("p-popover-active");
          }
        }
      }
      return;
    }
    const closeBtn = target.closest("[data-popover-close], [data-popover-hide]");
    if (closeBtn) {
      e.preventDefault();
      const popoverEl = closeBtn.closest(".p-popover");
      if (popoverEl) {
        popoverEl.classList.remove("p-popover-active");
      }
      return;
    }
    if (!target.closest(".p-popover")) {
      document.querySelectorAll(".p-popover.p-popover-active").forEach((p) => {
        p.classList.remove("p-popover-active");
      });
    }
  });
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      document.querySelectorAll(".p-popover.p-popover-active").forEach((p) => {
        p.classList.remove("p-popover-active");
      });
    }
  });
  window.addEventListener("scroll", () => {
    document.querySelectorAll(".p-popover.p-popover-active").forEach((p) => {
    });
  }, { passive: true });
}
function PopoverIsland(container, props) {
  injectIslandStyle("popover", POPOVER_CSS);
  initGlobalPopoverDelegation();
}
export {
  PopoverIsland as default
};
//# sourceMappingURL=popover-ANO4CF5O.js.map
