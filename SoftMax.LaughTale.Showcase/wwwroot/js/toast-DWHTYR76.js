import {
  injectIslandStyle
} from "./chunk-3TFPN5JM.js";

// ../SoftMax.LaughTale.Client/src/components/toast.ts
var TOAST_CSS = `
.p-toast {
    position: fixed;
    top: 1.25rem;
    right: 1.25rem;
    z-index: 9999;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    pointer-events: none;
    width: 25rem;
    max-width: calc(100vw - 2.5rem);
    box-sizing: border-box;
}

@keyframes p-toast-enter {
    0% {
        opacity: 0;
        transform: translateY(-16px) scale(0.96);
    }
    100% {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}

@keyframes p-toast-leave {
    0% {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
    100% {
        opacity: 0;
        transform: translateY(-14px) scale(0.95);
    }
}

.p-toast-message {
    pointer-events: auto;
    display: flex;
    flex-direction: column;
    border-radius: var(--p-border-radius-lg, 10px);
    padding: 1rem 1.25rem;
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    box-sizing: border-box;
    will-change: transform, opacity;
    transform: translateZ(0);
    backface-visibility: hidden;
    animation: p-toast-enter 0.22s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.p-toast-message.p-toast-message-leave {
    pointer-events: none;
    animation: p-toast-leave 0.18s cubic-bezier(0.4, 0, 1, 1) forwards !important;
}

.p-toast-message-content {
    display: flex;
    align-items: flex-start;
    gap: 0.875rem;
    width: 100%;
}

.p-toast-message-icon {
    width: 1.5rem;
    height: 1.5rem;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 0.125rem;
}

.p-toast-message-text {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    flex: 1 1 auto;
}

.p-toast-summary {
    font-weight: 600;
    font-size: 0.9375rem;
    line-height: 1.25;
}

.p-toast-detail {
    font-size: 0.875rem;
    line-height: 1.4;
    opacity: 0.95;
}

.p-toast-close-button {
    background: transparent;
    border: none;
    cursor: pointer;
    width: 1.5rem;
    height: 1.5rem;
    border-radius: 9999px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin-left: auto;
    flex-shrink: 0;
    padding: 0;
    transition: background-color 0.15s ease;
}
.p-toast-close-button:hover {
    background: rgba(0, 0, 0, 0.06);
}

/* Severity Color Schemes - Info */
.p-toast-message-info {
    background: rgba(239, 246, 255, 0.96);
    border: 1px solid #bfdbfe;
    color: #1d4ed8;
}
.p-toast-message-info .p-toast-message-icon,
.p-toast-message-info .p-toast-close-button {
    color: #2563eb;
}
.p-toast-message-info .p-toast-summary {
    color: #1d4ed8;
}
.p-toast-message-info .p-toast-detail {
    color: #1e3a8a;
}

/* Severity Color Schemes - Success */
.p-toast-message-success {
    background: rgba(236, 253, 245, 0.96);
    border: 1px solid #a7f3d0;
    color: #047857;
}
.p-toast-message-success .p-toast-message-icon,
.p-toast-message-success .p-toast-close-button {
    color: #059669;
}
.p-toast-message-success .p-toast-summary {
    color: #047857;
}
.p-toast-message-success .p-toast-detail {
    color: #064e3b;
}

/* Severity Color Schemes - Warn */
.p-toast-message-warn {
    background: rgba(254, 252, 232, 0.96);
    border: 1px solid #fef08a;
    color: #a16207;
}
.p-toast-message-warn .p-toast-message-icon,
.p-toast-message-warn .p-toast-close-button {
    color: #d97706;
}
.p-toast-message-warn .p-toast-summary {
    color: #a16207;
}
.p-toast-message-warn .p-toast-detail {
    color: #713f12;
}

/* Severity Color Schemes - Error */
.p-toast-message-error {
    background: rgba(254, 242, 242, 0.96);
    border: 1px solid #fecaca;
    color: #b91c1c;
}
.p-toast-message-error .p-toast-message-icon,
.p-toast-message-error .p-toast-close-button {
    color: #dc2626;
}
.p-toast-message-error .p-toast-summary {
    color: #b91c1c;
}
.p-toast-message-error .p-toast-detail {
    color: #7f1d1d;
}

/* Dark Mode Tokens */
.dark .p-toast-message-info,
[data-theme="dark"] .p-toast-message-info {
    background: rgba(23, 37, 84, 0.95);
    border-color: #1e40af;
    color: #93c5fd;
}
.dark .p-toast-message-info .p-toast-message-icon,
.dark .p-toast-message-info .p-toast-close-button,
[data-theme="dark"] .p-toast-message-info .p-toast-message-icon,
[data-theme="dark"] .p-toast-message-info .p-toast-close-button {
    color: #60a5fa;
}
.dark .p-toast-message-info .p-toast-summary,
[data-theme="dark"] .p-toast-message-info .p-toast-summary {
    color: #93c5fd;
}
.dark .p-toast-message-info .p-toast-detail,
[data-theme="dark"] .p-toast-message-info .p-toast-detail {
    color: #bfdbfe;
}
.dark .p-toast-close-button:hover,
[data-theme="dark"] .p-toast-close-button:hover {
    background: rgba(255, 255, 255, 0.1);
}

.dark .p-toast-message-success,
[data-theme="dark"] .p-toast-message-success {
    background: rgba(6, 78, 59, 0.95);
    border-color: #065f46;
    color: #6ee7b7;
}
.dark .p-toast-message-success .p-toast-message-icon,
.dark .p-toast-message-success .p-toast-close-button,
[data-theme="dark"] .p-toast-message-success .p-toast-message-icon,
[data-theme="dark"] .p-toast-message-success .p-toast-close-button {
    color: #34d399;
}
.dark .p-toast-message-success .p-toast-summary,
[data-theme="dark"] .p-toast-message-success .p-toast-summary {
    color: #6ee7b7;
}
.dark .p-toast-message-success .p-toast-detail,
[data-theme="dark"] .p-toast-message-success .p-toast-detail {
    color: #a7f3d0;
}

.dark .p-toast-message-warn,
[data-theme="dark"] .p-toast-message-warn {
    background: rgba(69, 26, 3, 0.95);
    border-color: #78350f;
    color: #fde047;
}
.dark .p-toast-message-warn .p-toast-message-icon,
.dark .p-toast-message-warn .p-toast-close-button,
[data-theme="dark"] .p-toast-message-warn .p-toast-message-icon,
[data-theme="dark"] .p-toast-message-warn .p-toast-close-button {
    color: #facc15;
}
.dark .p-toast-message-warn .p-toast-summary,
[data-theme="dark"] .p-toast-message-warn .p-toast-summary {
    color: #fde047;
}
.dark .p-toast-message-warn .p-toast-detail,
[data-theme="dark"] .p-toast-message-warn .p-toast-detail {
    color: #fef08a;
}

.dark .p-toast-message-error,
[data-theme="dark"] .p-toast-message-error {
    background: rgba(69, 10, 10, 0.95);
    border-color: #7f1d1d;
    color: #fca5a5;
}
.dark .p-toast-message-error .p-toast-message-icon,
.dark .p-toast-message-error .p-toast-close-button,
[data-theme="dark"] .p-toast-message-error .p-toast-message-icon,
[data-theme="dark"] .p-toast-message-error .p-toast-close-button {
    color: #f87171;
}
.dark .p-toast-message-error .p-toast-summary,
[data-theme="dark"] .p-toast-message-error .p-toast-summary {
    color: #fca5a5;
}
.dark .p-toast-message-error .p-toast-detail,
[data-theme="dark"] .p-toast-message-error .p-toast-detail {
    color: #fecaca;
}
`;
var INFO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="16" y2="12"/><line x1="12" x2="12.01" y1="8" y2="8"/></svg>`;
var SUCCESS_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`;
var WARN_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>`;
var ERROR_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" x2="9" y1="9" y2="15"/><line x1="9" x2="15" y1="9" y2="15"/></svg>`;
var CLOSE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" x2="6" y1="6" y2="18"/><line x1="6" x2="18" y1="6" y2="18"/></svg>`;
var ToastService = class {
  containerEl = null;
  constructor() {
    if (typeof document !== "undefined") {
      this.ensureContainer();
    }
  }
  ensureContainer() {
    if (this.containerEl) return;
    injectIslandStyle("toast", TOAST_CSS);
    this.containerEl = document.getElementById("aura-toast-container");
    if (!this.containerEl) {
      this.containerEl = document.createElement("div");
      this.containerEl.id = "aura-toast-container";
      this.containerEl.className = "p-toast p-component";
      document.body.appendChild(this.containerEl);
    }
  }
  add(msg) {
    this.ensureContainer();
    if (!this.containerEl) return;
    const severity = msg.severity || "info";
    const life = msg.life || 3500;
    let iconSvg = INFO_SVG;
    if (severity === "success") iconSvg = SUCCESS_SVG;
    else if (severity === "warn") iconSvg = WARN_SVG;
    else if (severity === "error") iconSvg = ERROR_SVG;
    const toastEl = document.createElement("div");
    toastEl.className = `p-toast-message p-toast-message-${severity}`;
    toastEl.setAttribute("role", "alert");
    toastEl.setAttribute("aria-live", "assertive");
    toastEl.setAttribute("aria-atomic", "true");
    toastEl.innerHTML = `
            <div class="p-toast-message-content">
                <div class="p-toast-message-icon">
                    ${iconSvg}
                </div>
                <div class="p-toast-message-text">
                    <div class="p-toast-summary">${msg.summary}</div>
                    ${msg.detail ? `<div class="p-toast-detail">${msg.detail}</div>` : ""}
                </div>
                <button type="button" class="p-toast-close-button" aria-label="Close notification">
                    ${CLOSE_SVG}
                </button>
            </div>
        `;
    const closeBtn = toastEl.querySelector(".p-toast-close-button");
    let isLeaving = false;
    const removeToast = () => {
      if (isLeaving) return;
      isLeaving = true;
      toastEl.classList.add("p-toast-message-leave");
      setTimeout(() => {
        toastEl.remove();
      }, 180);
    };
    closeBtn?.addEventListener("click", (e) => {
      e.stopPropagation();
      removeToast();
    });
    this.containerEl.appendChild(toastEl);
    if (life > 0) {
      setTimeout(removeToast, life);
    }
  }
};
var globalToastService = new ToastService();
window.$toast = globalToastService;
function ToastIsland(container) {
  injectIslandStyle("toast", TOAST_CSS);
}
export {
  ToastIsland as default
};
//# sourceMappingURL=toast-DWHTYR76.js.map
