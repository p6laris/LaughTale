import {
  injectIslandStyle
} from "./chunk-3TFPN5JM.js";

// ../SoftMax.LaughTale.Client/src/components/toast.ts
var CSS = `
@keyframes toast-slideIn {
    from { opacity: 0; transform: translateX(100%); }
    to { opacity: 1; transform: translateX(0); }
}
@keyframes toast-slideOut {
    from { opacity: 1; transform: translateX(0); }
    to { opacity: 0; transform: translateX(100%); }
}
.laughtale-toast {
    pointer-events: auto;
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
    padding: 0.875rem 1.125rem;
    border-radius: var(--p-border-radius-lg, 0.75rem);
    background: var(--p-surface-0, #ffffff);
    border: 1px solid var(--p-surface-200);
    box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1);
    width: 340px;
    animation: toast-slideIn 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}
.laughtale-toast.leaving {
    animation: toast-slideOut 0.3s ease forwards;
}
.toast-icon {
    width: 1.5rem;
    height: 1.5rem;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 0.75rem;
    flex-shrink: 0;
}
.toast-title { font-size: 0.875rem; font-weight: 600; color: var(--p-surface-900); }
.toast-desc { font-size: 0.75rem; color: var(--p-surface-500); margin-top: 0.15rem; }
.toast-close {
    background: none;
    border: none;
    font-size: 1rem;
    color: var(--p-surface-400);
    cursor: pointer;
    padding: 0 0.25rem;
}
.toast-close:hover { color: var(--p-surface-600); }
[data-theme="dark"] .laughtale-toast {
    background: var(--p-surface-800);
    border-color: var(--p-surface-700);
}
[data-theme="dark"] .toast-title { color: var(--p-surface-100); }
[data-theme="dark"] .toast-desc { color: var(--p-surface-400); }
[data-theme="dark"] .toast-close { color: var(--p-surface-400); }
`;
function ToastIsland(container) {
  injectIslandStyle("toast", CSS);
  const toastThemes = {
    success: { bg: "#ecfdf5", border: "#a7f3d0", color: "#047857", icon: "\u2713" },
    info: { bg: "#eff6ff", border: "#bfdbfe", color: "#1d4ed8", icon: "\u2139" },
    warn: { bg: "#fffbeb", border: "#fde68a", color: "#b45309", icon: "\u26A0" },
    error: { bg: "#fef2f2", border: "#fecaca", color: "#b91c1c", icon: "\u2715" }
  };
  container.style.position = "fixed";
  container.style.top = "1.5rem";
  container.style.right = "1.5rem";
  container.style.zIndex = "9999";
  container.style.display = "flex";
  container.style.flexDirection = "column";
  container.style.gap = "0.75rem";
  container.style.pointerEvents = "none";
  function addToast(msg) {
    const severity = msg.severity || "success";
    const theme = toastThemes[severity] || toastThemes.success;
    const duration = msg.durationMs || 4e3;
    const toastEl = document.createElement("div");
    toastEl.style.pointerEvents = "auto";
    toastEl.style.display = "flex";
    toastEl.style.alignItems = "flex-start";
    toastEl.style.gap = "0.75rem";
    toastEl.style.padding = "0.875rem 1.125rem";
    toastEl.style.borderRadius = "var(--p-border-radius-lg)";
    toastEl.style.background = "white";
    toastEl.style.border = `1px solid ${theme.border}`;
    toastEl.style.boxShadow = "var(--p-shadow-lg)";
    toastEl.style.width = "340px";
    toastEl.style.animation = "slideIn 0.25s cubic-bezier(0.16, 1, 0.3, 1)";
    toastEl.innerHTML = `
            <div style="width: 1.5rem; height: 1.5rem; border-radius: 50%; background: ${theme.bg}; color: ${theme.color}; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 0.75rem; flex-shrink: 0;">
                ${theme.icon}
            </div>
            <div style="flex: 1;">
                <div style="font-size: 0.875rem; font-weight: 600; color: var(--p-surface-900);">${msg.title}</div>
                ${msg.description ? `<div style="font-size: 0.75rem; color: var(--p-surface-600); margin-top: 0.15rem;">${msg.description}</div>` : ""}
            </div>
            <button type="button" style="background: none; border: none; font-size: 1rem; color: var(--p-surface-400); cursor: pointer; padding: 0 0.25rem;">\u2715</button>
        `;
    toastEl.querySelector("button")?.addEventListener("click", () => toastEl.remove());
    container.appendChild(toastEl);
    setTimeout(() => {
      toastEl.style.opacity = "0";
      toastEl.style.transform = "translateX(100%)";
      toastEl.style.transition = "all 0.3s ease";
      setTimeout(() => toastEl.remove(), 300);
    }, duration);
  }
  window.addEventListener("laughtale:toast", (e) => {
    if (e.detail) addToast(e.detail);
  });
}
export {
  ToastIsland as default
};
//# sourceMappingURL=toast-IKSRRICF.js.map
