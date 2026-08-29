import {
  injectIslandStyle
} from "./chunk-3TFPN5JM.js";

// ../SoftMax.LaughTale.Client/src/components/dialog.ts
var DIALOG_CSS = `
.p-dialog-mask {
    position: fixed;
    inset: 0;
    z-index: 1100;
    display: none;
    box-sizing: border-box;
    padding: 1.5rem;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.p-dialog-mask.p-dialog-mask-modal {
    background: rgba(15, 23, 42, 0.45);
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
}

.p-dialog-mask.p-dialog-mask-active {
    display: flex !important;
    opacity: 1;
    pointer-events: auto;
}

/* 9-Direction Positioning */
.p-dialog-mask.p-dialog-pos-center {
    align-items: center;
    justify-content: center;
}
.p-dialog-mask.p-dialog-pos-top {
    align-items: flex-start;
    justify-content: center;
    padding-top: 3rem;
}
.p-dialog-mask.p-dialog-pos-bottom {
    align-items: flex-end;
    justify-content: center;
    padding-bottom: 3rem;
}
.p-dialog-mask.p-dialog-pos-left {
    align-items: center;
    justify-content: flex-start;
    padding-left: 3rem;
}
.p-dialog-mask.p-dialog-pos-right {
    align-items: center;
    justify-content: flex-end;
    padding-right: 3rem;
}
.p-dialog-mask.p-dialog-pos-topleft {
    align-items: flex-start;
    justify-content: flex-start;
    padding-top: 3rem;
    padding-left: 3rem;
}
.p-dialog-mask.p-dialog-pos-topright {
    align-items: flex-start;
    justify-content: flex-end;
    padding-top: 3rem;
    padding-right: 3rem;
}
.p-dialog-mask.p-dialog-pos-bottomleft {
    align-items: flex-end;
    justify-content: flex-start;
    padding-bottom: 3rem;
    padding-left: 3rem;
}
.p-dialog-mask.p-dialog-pos-bottomright {
    align-items: flex-end;
    justify-content: flex-end;
    padding-bottom: 3rem;
    padding-right: 3rem;
}

/* Dialog Container */
.p-dialog {
    background: var(--p-surface-0, #ffffff);
    border: 1px solid var(--p-border-color, #e2e8f0);
    border-radius: var(--p-border-radius-xl, 12px);
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.04);
    min-width: 20rem;
    max-width: 90vw;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    pointer-events: auto;
    will-change: transform, opacity;
    transform: scale(0.95) translateY(6px);
    transition: transform 0.22s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.2s ease, width 0.2s ease, height 0.2s ease;
}

.p-dialog-mask.p-dialog-mask-active .p-dialog {
    transform: scale(1) translateY(0);
}

/* Maximized Mode */
.p-dialog.p-dialog-maximized {
    width: 100vw !important;
    height: 100vh !important;
    max-width: 100vw !important;
    max-height: 100vh !important;
    border-radius: 0 !important;
    border: none !important;
    top: 0 !important;
    left: 0 !important;
    margin: 0 !important;
}

/* Header */
.p-dialog-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.25rem 1.5rem 1rem 1.5rem;
    border-bottom: none;
    user-select: none;
}

.p-dialog.p-dialog-draggable .p-dialog-header {
    cursor: move;
}

.p-dialog-title {
    font-weight: 700;
    font-size: 1.125rem;
    color: var(--p-text-color, #0f172a);
    margin: 0;
}

.p-dialog-header-actions {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    margin-left: auto;
}

.p-dialog-header-action {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    border-radius: 9999px;
    border: none;
    background: transparent;
    color: var(--p-surface-500, #64748b);
    cursor: pointer;
    transition: background-color 0.15s ease, color 0.15s ease;
    padding: 0;
}
.p-dialog-header-action:hover {
    background: var(--p-surface-100, #f1f5f9);
    color: var(--p-text-color, #0f172a);
}

/* Content */
.p-dialog-content {
    padding: 0 1.5rem 1.5rem 1.5rem;
    flex: 1 1 auto;
    overflow-y: auto;
    box-sizing: border-box;
}

/* Footer */
.p-dialog-footer {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 0.5rem;
    padding: 0 1.5rem 1.25rem 1.5rem;
    border-top: none;
}

/* Dark Mode Tokens */
.dark .p-dialog,
[data-theme="dark"] .p-dialog {
    background: var(--p-surface-900, #0f172a);
    border-color: var(--p-surface-700, #334155);
}
.dark .p-dialog-title,
[data-theme="dark"] .p-dialog-title {
    color: var(--p-surface-0, #f8fafc);
}
.dark .p-dialog-header-action,
[data-theme="dark"] .p-dialog-header-action {
    color: var(--p-surface-400, #94a3b8);
}
.dark .p-dialog-header-action:hover,
[data-theme="dark"] .p-dialog-header-action:hover {
    background: var(--p-surface-800, #1e293b);
    color: #ffffff;
}
`;
var MAXIMIZE_ICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" x2="14" y1="3" y2="10"/><line x1="3" x2="10" y1="21" y2="14"/></svg>`;
var RESTORE_ICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 14 10 14 10 20"/><polyline points="20 10 14 10 14 4"/><line x1="14" x2="21" y1="10" y2="3"/><line x1="10" x2="3" y1="14" y2="21"/></svg>`;
var globalDelegationBound = false;
function initGlobalDialogDelegation() {
  if (globalDelegationBound || typeof document === "undefined") return;
  globalDelegationBound = true;
  document.addEventListener("click", (e) => {
    const target = e.target;
    const trigger = target.closest("[data-dialog-target], [data-dialog-open]");
    if (trigger) {
      e.preventDefault();
      const dialogId = trigger.getAttribute("data-dialog-target") || trigger.getAttribute("data-dialog-open");
      const pos = trigger.getAttribute("data-dialog-position");
      if (dialogId) {
        const dialogContainer = document.getElementById(dialogId);
        const maskEl = dialogContainer?.querySelector(".p-dialog-mask");
        if (maskEl) {
          if (pos) {
            const cleanPos = pos.toLowerCase().replace(/[^a-z]/g, "");
            maskEl.className = maskEl.className.replace(/p-dialog-pos-[a-z]+/g, "");
            maskEl.classList.add(`p-dialog-pos-${cleanPos}`);
          }
          maskEl.style.display = "flex";
          void maskEl.offsetWidth;
          maskEl.classList.add("p-dialog-mask-active");
          if (maskEl.classList.contains("p-dialog-mask-modal")) {
            document.body.style.overflow = "hidden";
          }
        }
      }
      return;
    }
    const closeBtn = target.closest(".p-dialog-close-button, [data-dialog-close]");
    if (closeBtn) {
      e.preventDefault();
      const maskEl = closeBtn.closest(".p-dialog-mask");
      if (maskEl) {
        maskEl.classList.remove("p-dialog-mask-active");
        setTimeout(() => {
          if (!maskEl.classList.contains("p-dialog-mask-active")) {
            maskEl.style.display = "none";
          }
        }, 200);
        document.body.style.overflow = "";
      }
      return;
    }
    if (target.classList.contains("p-dialog-mask")) {
      const container = target.closest('[data-island="dialog"]');
      let dismissable = true;
      if (container) {
        try {
          const props = JSON.parse(container.getAttribute("data-props") || "{}");
          if (props.dismissableMask === false && props.modal === true) {
            dismissable = false;
          }
        } catch {
        }
      }
      if (dismissable) {
        target.classList.remove("p-dialog-mask-active");
        setTimeout(() => {
          if (!target.classList.contains("p-dialog-mask-active")) {
            target.style.display = "none";
          }
        }, 200);
        document.body.style.overflow = "";
      }
    }
  });
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      const activeMask = document.querySelector(".p-dialog-mask.p-dialog-mask-active");
      if (activeMask) {
        activeMask.classList.remove("p-dialog-mask-active");
        setTimeout(() => {
          if (!activeMask.classList.contains("p-dialog-mask-active")) {
            activeMask.style.display = "none";
          }
        }, 200);
        document.body.style.overflow = "";
      }
    }
  });
}
function DialogIsland(container, props) {
  injectIslandStyle("dialog", DIALOG_CSS);
  initGlobalDialogDelegation();
  const maskEl = container.querySelector(".p-dialog-mask");
  const dialogEl = container.querySelector(".p-dialog");
  if (!maskEl || !dialogEl) return;
  let isMaximized = false;
  let isDragging = false;
  let startX = 0;
  let startY = 0;
  let initialLeft = 0;
  let initialTop = 0;
  const maxBtn = dialogEl.querySelector(".p-dialog-maximize-button");
  if (maxBtn) {
    maxBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      isMaximized = !isMaximized;
      dialogEl.classList.toggle("p-dialog-maximized", isMaximized);
      maxBtn.innerHTML = isMaximized ? RESTORE_ICON_SVG : MAXIMIZE_ICON_SVG;
      maxBtn.setAttribute("aria-label", isMaximized ? "Minimize" : "Maximize");
    });
  }
  if (props.draggable) {
    dialogEl.classList.add("p-dialog-draggable");
    const header = dialogEl.querySelector(".p-dialog-header");
    if (header) {
      header.addEventListener("mousedown", (e) => {
        if (e.target.closest(".p-dialog-header-action")) return;
        if (isMaximized) return;
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        const rect = dialogEl.getBoundingClientRect();
        initialLeft = rect.left;
        initialTop = rect.top;
        dialogEl.style.position = "fixed";
        dialogEl.style.margin = "0";
        dialogEl.style.left = `${initialLeft}px`;
        dialogEl.style.top = `${initialTop}px`;
        const onMouseMove = (moveEvent) => {
          if (!isDragging) return;
          const dx = moveEvent.clientX - startX;
          const dy = moveEvent.clientY - startY;
          dialogEl.style.left = `${initialLeft + dx}px`;
          dialogEl.style.top = `${initialTop + dy}px`;
        };
        const onMouseUp = () => {
          isDragging = false;
          document.removeEventListener("mousemove", onMouseMove);
          document.removeEventListener("mouseup", onMouseUp);
        };
        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
      });
    }
  }
}
export {
  DialogIsland as default
};
//# sourceMappingURL=dialog-JPULUL5A.js.map
