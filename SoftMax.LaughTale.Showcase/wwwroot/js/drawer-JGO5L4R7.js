import {
  injectIslandStyle
} from "./chunk-3TFPN5JM.js";

// ../SoftMax.LaughTale.Client/src/components/drawer.ts
var DRAWER_CSS = `
.p-drawer-mask {
    position: fixed;
    inset: 0;
    z-index: 1100;
    display: none;
    box-sizing: border-box;
    pointer-events: none;
    background: rgba(15, 23, 42, 0);
    backdrop-filter: blur(0px);
    -webkit-backdrop-filter: blur(0px);
    transition: background 0.3s cubic-bezier(0.16, 1, 0.3, 1), backdrop-filter 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.p-drawer-mask.p-drawer-mask-modal {
    background: rgba(15, 23, 42, 0);
}

.p-drawer-mask.p-drawer-mask-active {
    pointer-events: auto;
    background: rgba(15, 23, 42, 0.45);
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
}

/* Positioning & Layout */
.p-drawer-mask.p-drawer-left {
    justify-content: flex-start;
    align-items: stretch;
}
.p-drawer-mask.p-drawer-right {
    justify-content: flex-end;
    align-items: stretch;
}
.p-drawer-mask.p-drawer-top {
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
}
.p-drawer-mask.p-drawer-bottom {
    flex-direction: column;
    justify-content: flex-end;
    align-items: stretch;
}
.p-drawer-mask.p-drawer-full {
    align-items: stretch;
    justify-content: stretch;
}

/* Drawer Container */
.p-drawer {
    background: var(--p-surface-0, #ffffff);
    border: none;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    pointer-events: auto;
    will-change: transform, opacity;
    transform: translateZ(0);
    transition: transform 0.32s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease;
}

/* Position Transforms */
.p-drawer-left .p-drawer {
    width: 20rem;
    max-width: 100vw;
    height: 100%;
    border-right: 1px solid var(--p-border-color, #e2e8f0);
    transform: translate3d(-100%, 0, 0);
}
.p-drawer-mask-active.p-drawer-left .p-drawer {
    transform: translate3d(0, 0, 0);
}

.p-drawer-right .p-drawer {
    width: 20rem;
    max-width: 100vw;
    height: 100%;
    border-left: 1px solid var(--p-border-color, #e2e8f0);
    transform: translate3d(100%, 0, 0);
}
.p-drawer-mask-active.p-drawer-right .p-drawer {
    transform: translate3d(0, 0, 0);
}

.p-drawer-top .p-drawer {
    width: 100%;
    height: auto;
    max-height: 80vh;
    border-bottom: 1px solid var(--p-border-color, #e2e8f0);
    transform: translate3d(0, -100%, 0);
}
.p-drawer-mask-active.p-drawer-top .p-drawer {
    transform: translate3d(0, 0, 0);
}

.p-drawer-bottom .p-drawer {
    width: 100%;
    height: auto;
    max-height: 80vh;
    border-top: 1px solid var(--p-border-color, #e2e8f0);
    transform: translate3d(0, 100%, 0);
}
.p-drawer-mask-active.p-drawer-bottom .p-drawer {
    transform: translate3d(0, 0, 0);
}

.p-drawer-full .p-drawer {
    width: 100vw;
    height: 100vh;
    transform: scale(0.96);
    opacity: 0;
}
.p-drawer-mask-active.p-drawer-full .p-drawer {
    transform: scale(1);
    opacity: 1;
}

/* Header */
.p-drawer-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.25rem 1.5rem 1rem 1.5rem;
    border-bottom: none;
    user-select: none;
    flex-shrink: 0;
}

.p-drawer-title {
    font-weight: 700;
    font-size: 1.125rem;
    color: var(--p-text-color, #0f172a);
    margin: 0;
}

.p-drawer-header-actions {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    margin-left: auto;
}

.p-drawer-close-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2.25rem;
    height: 2.25rem;
    border-radius: 9999px;
    border: none;
    background: transparent;
    color: var(--p-surface-500, #64748b);
    cursor: pointer;
    transition: background-color 0.15s ease, color 0.15s ease;
    padding: 0;
}
.p-drawer-close-button:hover {
    background: var(--p-surface-100, #f1f5f9);
    color: var(--p-text-color, #0f172a);
}

/* Content */
.p-drawer-content {
    padding: 0 1.5rem 1.5rem 1.5rem;
    flex: 1 1 auto;
    overflow-y: auto;
    box-sizing: border-box;
}

/* Footer */
.p-drawer-footer {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 1rem 1.5rem;
    border-top: 1px solid var(--p-border-color, #e2e8f0);
    flex-shrink: 0;
}

/* Headless Navigation Elements */
.p-drawer-nav-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.65rem 0.85rem;
    border-radius: var(--p-border-radius, 8px);
    color: var(--p-surface-700, #334155);
    text-decoration: none;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.15s ease, color 0.15s ease;
}
.p-drawer-nav-item:hover {
    background: var(--p-surface-100, #f1f5f9);
    color: var(--p-text-color, #0f172a);
}

.p-drawer-nav-section-title {
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.05em;
    color: var(--p-surface-500, #64748b);
    padding: 0.75rem 0.85rem 0.35rem 0.85rem;
    text-transform: uppercase;
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
}

/* Dark Mode Tokens */
.dark .p-drawer,
[data-theme="dark"] .p-drawer {
    background: var(--p-surface-900, #0f172a);
    border-color: var(--p-surface-700, #334155);
}
.dark .p-drawer-title,
[data-theme="dark"] .p-drawer-title {
    color: var(--p-surface-0, #f8fafc);
}
.dark .p-drawer-close-button,
[data-theme="dark"] .p-drawer-close-button {
    color: var(--p-surface-400, #94a3b8);
}
.dark .p-drawer-close-button:hover,
[data-theme="dark"] .p-drawer-close-button:hover {
    background: var(--p-surface-800, #1e293b);
    color: #ffffff;
}
.dark .p-drawer-footer,
[data-theme="dark"] .p-drawer-footer {
    border-color: var(--p-surface-700, #334155);
}
.dark .p-drawer-nav-item,
[data-theme="dark"] .p-drawer-nav-item {
    color: var(--p-surface-200, #e2e8f0);
}
.dark .p-drawer-nav-item:hover,
[data-theme="dark"] .p-drawer-nav-item:hover {
    background: var(--p-surface-800, #1e293b);
    color: #ffffff;
}
.dark .p-drawer-nav-section-title,
[data-theme="dark"] .p-drawer-nav-section-title {
    color: var(--p-surface-400, #94a3b8);
}
`;
var globalDrawerDelegationBound = false;
function initGlobalDrawerDelegation() {
  if (globalDrawerDelegationBound || typeof document === "undefined") return;
  globalDrawerDelegationBound = true;
  document.addEventListener("click", (e) => {
    const target = e.target;
    const trigger = target.closest("[data-drawer-target], [data-drawer-open]");
    if (trigger) {
      e.preventDefault();
      const drawerId = trigger.getAttribute("data-drawer-target") || trigger.getAttribute("data-drawer-open");
      const pos = trigger.getAttribute("data-drawer-position");
      if (drawerId) {
        const drawerContainer = document.getElementById(drawerId);
        const maskEl = drawerContainer?.querySelector(".p-drawer-mask");
        if (maskEl) {
          if (pos) {
            const cleanPos = pos.toLowerCase().replace(/[^a-z]/g, "");
            maskEl.className = maskEl.className.replace(/p-drawer-(left|right|top|bottom|full)/g, "");
            maskEl.classList.add(`p-drawer-${cleanPos}`);
          }
          maskEl.style.display = "flex";
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              maskEl.classList.add("p-drawer-mask-active");
              if (maskEl.classList.contains("p-drawer-mask-modal")) {
                document.body.style.overflow = "hidden";
              }
            });
          });
        }
      }
      return;
    }
    const closeBtn = target.closest(".p-drawer-close-button, [data-drawer-close]");
    if (closeBtn) {
      e.preventDefault();
      const maskEl = closeBtn.closest(".p-drawer-mask");
      if (maskEl) {
        maskEl.classList.remove("p-drawer-mask-active");
        setTimeout(() => {
          if (!maskEl.classList.contains("p-drawer-mask-active")) {
            maskEl.style.display = "none";
          }
        }, 320);
        document.body.style.overflow = "";
      }
      return;
    }
    if (target.classList.contains("p-drawer-mask")) {
      const container = target.closest('[data-island="drawer"]');
      let dismissable = true;
      if (container) {
        try {
          const props = JSON.parse(container.getAttribute("data-props") || "{}");
          if (props.dismissableMask === false) {
            dismissable = false;
          }
        } catch {
        }
      }
      if (dismissable) {
        target.classList.remove("p-drawer-mask-active");
        setTimeout(() => {
          if (!target.classList.contains("p-drawer-mask-active")) {
            target.style.display = "none";
          }
        }, 320);
        document.body.style.overflow = "";
      }
    }
    const accordionTrigger = target.closest("[data-drawer-toggle]");
    if (accordionTrigger) {
      e.preventDefault();
      const targetSubmenu = accordionTrigger.nextElementSibling;
      if (targetSubmenu) {
        const isHidden = targetSubmenu.style.display === "none" || targetSubmenu.classList.contains("hidden");
        targetSubmenu.style.display = isHidden ? "block" : "none";
        targetSubmenu.classList.toggle("hidden", !isHidden);
        const chevron = accordionTrigger.querySelector(".p-drawer-chevron");
        if (chevron) {
          chevron.style.transform = isHidden ? "rotate(180deg)" : "rotate(0deg)";
        }
      }
    }
  });
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      const activeMask = document.querySelector(".p-drawer-mask.p-drawer-mask-active");
      if (activeMask) {
        activeMask.classList.remove("p-drawer-mask-active");
        setTimeout(() => {
          if (!activeMask.classList.contains("p-drawer-mask-active")) {
            activeMask.style.display = "none";
          }
        }, 320);
        document.body.style.overflow = "";
      }
    }
  });
}
function DrawerIsland(container, props) {
  injectIslandStyle("drawer", DRAWER_CSS);
  initGlobalDrawerDelegation();
}
export {
  DrawerIsland as default
};
//# sourceMappingURL=drawer-JGO5L4R7.js.map
