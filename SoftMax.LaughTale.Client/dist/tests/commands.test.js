// tests/setup.ts
import { Window } from "happy-dom";
var win = new Window({
  url: "http://localhost:5000"
});
globalThis.window = win;
globalThis.document = win.document;
globalThis.HTMLElement = win.HTMLElement;
globalThis.HTMLInputElement = win.HTMLInputElement;
globalThis.HTMLSelectElement = win.HTMLSelectElement;
globalThis.HTMLTextAreaElement = win.HTMLTextAreaElement;
globalThis.HTMLButtonElement = win.HTMLButtonElement;
globalThis.CustomEvent = win.CustomEvent;
globalThis.Event = win.Event;
globalThis.MouseEvent = win.MouseEvent;
globalThis.KeyboardEvent = win.KeyboardEvent;
globalThis.Node = win.Node;
globalThis.localStorage = win.localStorage;
globalThis.sessionStorage = win.sessionStorage;
globalThis.requestAnimationFrame = (cb) => setTimeout(cb, 16);
try {
  Object.defineProperty(globalThis.navigator, "clipboard", {
    value: {
      writeText: async (_text) => Promise.resolve()
    },
    configurable: true
  });
} catch {
}
globalThis.MutationObserver = win.MutationObserver || class {
  observe() {
  }
  disconnect() {
  }
};
globalThis.IntersectionObserver = class {
  callback;
  constructor(cb) {
    this.callback = cb;
  }
  observe(el) {
    this.callback([{ isIntersecting: true, target: el }]);
  }
  disconnect() {
  }
};

// tests/commands.test.ts
import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";

// src/runtime/commands.ts
var commandRegistry = /* @__PURE__ */ new Map();
function registerCommand(name, handler) {
  if (typeof name !== "string" || !name.trim()) {
    console.warn("[SoftMax.LaughTale Commands] Invalid command name provided to registerCommand");
    return;
  }
  if (typeof handler !== "function") {
    console.warn(`[SoftMax.LaughTale Commands] Invalid handler provided for command "${name}"`);
    return;
  }
  commandRegistry.set(name.trim(), handler);
}
function unregisterCommand(name) {
  return commandRegistry.delete(name.trim());
}
function getCommand(name) {
  return commandRegistry.get(name.trim());
}
function executeCommand(name, item) {
  if (!name || typeof name !== "string") {
    return false;
  }
  const handler = commandRegistry.get(name.trim());
  if (!handler) {
    console.warn(`[SoftMax.LaughTale Commands] Command "${name}" is not registered in the client registry.`);
    return false;
  }
  try {
    handler(item);
    return true;
  } catch (err) {
    console.error(`[SoftMax.LaughTale Commands] Error executing command "${name}":`, err);
    return false;
  }
}
function clearCommands() {
  commandRegistry.clear();
}
function listCommands() {
  return Array.from(commandRegistry.keys());
}

// src/icons/lucide.ts
var ALIASES = {
  "refresh": "refresh-cw",
  "refreshcw": "refresh-cw",
  "refreshccw": "refresh-ccw",
  "times": "x",
  "close": "x",
  "sharealt": "share-2",
  "share2": "share-2",
  "externallink": "external-link",
  "spinner": "loader-circle",
  "loader2": "loader-circle",
  "loader": "loader-circle",
  "pencil": "pencil",
  "edit": "pencil",
  "edit3": "pencil",
  "trash": "trash-2",
  "trash2": "trash-2",
  "arrowup": "arrow-up",
  "arrowdown": "arrow-down",
  "arrowleft": "arrow-left",
  "arrowright": "arrow-right",
  "chevrondown": "chevron-down",
  "chevronup": "chevron-up",
  "chevronleft": "chevron-left",
  "chevronright": "chevron-right",
  "chevronsleft": "chevrons-left",
  "chevronsright": "chevrons-right",
  "chevronsup": "chevrons-up",
  "chevronsdown": "chevrons-down",
  "plus": "plus",
  "minus": "minus",
  "layers": "layers",
  "check": "check",
  "search": "search",
  "settings": "settings",
  "cog": "settings",
  "eye": "eye",
  "eyeoff": "eye-off",
  "alertcircle": "circle-alert",
  "alerttriangle": "triangle-alert",
  "terminal": "terminal",
  "palette": "palette",
  "sliders": "sliders-horizontal",
  "sun": "sun",
  "moon": "moon",
  "code": "code",
  "heart": "heart",
  "save": "save",
  "print": "print",
  "copy": "copy",
  "upload": "upload",
  "download": "download",
  "user": "user",
  "users": "users",
  "bell": "bell",
  "home": "home",
  "lock": "lock",
  "unlock": "unlock",
  "calendar": "calendar",
  "clock": "clock",
  "star": "star",
  "zap": "zap"
};
function normalizeLucideId(name) {
  if (!name) return "zap";
  const kebab = name.trim().replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase().replace(/_/g, "-");
  const cleanKey = kebab.replace(/-/g, "");
  if (ALIASES[cleanKey]) {
    return ALIASES[cleanKey];
  }
  if (ALIASES[kebab]) {
    return ALIASES[kebab];
  }
  return kebab;
}
function getLucideIcon(name, size = 16, strokeWidth = 2) {
  if (!name) return "";
  const iconId = normalizeLucideId(name);
  return `<svg class="p-icon p-icon-${iconId}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round"><use href="/icons/lucide-sprites.svg#${iconId}"></use></svg>`;
}
var LucideIcons = new Proxy({}, {
  get: (_, prop) => {
    if (typeof prop === "string") {
      return getLucideIcon(prop);
    }
    return "";
  }
});

// src/directives/csp.ts
function getCspNonce() {
  if (typeof document === "undefined") return null;
  const meta = document.querySelector('meta[name="csp-nonce"]');
  return meta ? meta.content : null;
}
function applyNonceToStyle(style) {
  const nonce = getCspNonce();
  if (nonce) {
    style.setAttribute("nonce", nonce);
  }
}

// src/runtime/styles.ts
var injectedStyles = /* @__PURE__ */ new Set();
function injectIslandStyle(islandName, css) {
  if (injectedStyles.has(islandName) || typeof document === "undefined") {
    return;
  }
  injectedStyles.add(islandName);
  const styleEl = document.createElement("style");
  styleEl.setAttribute("data-island-style", islandName);
  styleEl.textContent = css;
  applyNonceToStyle(styleEl);
  document.head.appendChild(styleEl);
}

// src/directives/security.ts
var DANGEROUS_PROTOCOLS = /^\s*(javascript|data|vbscript):/i;
function sanitizeUrl(url) {
  if (typeof url !== "string") return "";
  const trimmed = url.trim();
  if (DANGEROUS_PROTOCOLS.test(trimmed)) {
    console.warn(`[SoftMax.LaughTale Security] Blocked dangerous URL protocol: "${trimmed}"`);
    return "about:blank";
  }
  return trimmed;
}

// src/components/speed-dial.ts
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
        executeCommand(item.command, item);
      }
      if (item?.url) {
        const safeUrl = sanitizeUrl(item.url);
        if (safeUrl && safeUrl !== "about:blank") {
          if (item.target === "_blank") {
            window.open(safeUrl, "_blank", "noopener,noreferrer");
          } else {
            window.location.href = safeUrl;
          }
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

// src/components/split-button.ts
var activeSplitButtonClose = null;
var SPLITBUTTON_CSS = `
.p-splitbutton {
    display: inline-flex;
    position: relative;
    vertical-align: middle;
    border-radius: var(--p-border-radius, 6px);
    font-family: var(--p-font-family, inherit);
}

.p-splitbutton-fluid {
    width: 100%;
    display: flex;
}

.p-splitbutton .p-splitbutton-button {
    flex: 1 1 auto;
    border-top-right-radius: 0 !important;
    border-bottom-right-radius: 0 !important;
}

.p-splitbutton .p-splitbutton-dropdown {
    flex: 0 0 auto;
    border-top-left-radius: 0 !important;
    border-bottom-left-radius: 0 !important;
    padding-left: 0.5rem !important;
    padding-right: 0.5rem !important;
}

/* Button Base & Severities */
.p-splitbutton .p-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    font-family: inherit;
    font-size: 0.875rem;
    font-weight: 600;
    line-height: 1;
    padding: 0.5rem 1rem;
    border: 1px solid transparent;
    cursor: pointer;
    user-select: none;
    transition: background-color 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease, color 0.15s ease;
    outline: none;
    text-decoration: none;
}

.p-splitbutton-sm .p-button {
    padding: 0.375rem 0.75rem;
    font-size: 0.75rem;
}

.p-splitbutton-lg .p-button {
    padding: 0.75rem 1.25rem;
    font-size: 1rem;
}

.p-splitbutton-rounded {
    border-radius: 9999px !important;
}
.p-splitbutton-rounded .p-splitbutton-button {
    border-top-left-radius: 9999px !important;
    border-bottom-left-radius: 9999px !important;
}
.p-splitbutton-rounded .p-splitbutton-dropdown {
    border-top-right-radius: 9999px !important;
    border-bottom-right-radius: 9999px !important;
}

.p-splitbutton-raised {
    box-shadow: 0 3px 4px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1);
}

/* Solid Severities */
.p-splitbutton .p-button-primary {
    background: var(--p-primary-500, #10b981);
    color: #ffffff;
    border-color: var(--p-primary-500, #10b981);
}
.p-splitbutton .p-button-primary:hover:not(:disabled) {
    background: var(--p-primary-600, #059669);
    border-color: var(--p-primary-600, #059669);
}

.p-splitbutton .p-button-secondary {
    background: var(--p-surface-100, #f1f5f9);
    color: var(--p-surface-700, #334155);
    border-color: var(--p-surface-200, #e2e8f0);
}
.p-splitbutton .p-button-secondary:hover:not(:disabled) {
    background: var(--p-surface-200, #e2e8f0);
    color: var(--p-surface-800, #1e293b);
}

.p-splitbutton .p-button-success {
    background: #22c55e;
    color: #ffffff;
    border-color: #22c55e;
}
.p-splitbutton .p-button-success:hover:not(:disabled) {
    background: #16a34a;
    border-color: #16a34a;
}

.p-splitbutton .p-button-info {
    background: #0ea5e9;
    color: #ffffff;
    border-color: #0ea5e9;
}
.p-splitbutton .p-button-info:hover:not(:disabled) {
    background: #0284c7;
    border-color: #0284c7;
}

.p-splitbutton .p-button-warn {
    background: #f59e0b;
    color: #ffffff;
    border-color: #f59e0b;
}
.p-splitbutton .p-button-warn:hover:not(:disabled) {
    background: #d97706;
    border-color: #d97706;
}

.p-splitbutton .p-button-help {
    background: #a855f7;
    color: #ffffff;
    border-color: #a855f7;
}
.p-splitbutton .p-button-help:hover:not(:disabled) {
    background: #9333ea;
    border-color: #9333ea;
}

.p-splitbutton .p-button-danger {
    background: #ef4444;
    color: #ffffff;
    border-color: #ef4444;
}
.p-splitbutton .p-button-danger:hover:not(:disabled) {
    background: #dc2626;
    border-color: #dc2626;
}

.p-splitbutton .p-button-contrast {
    background: #0f172a;
    color: #ffffff;
    border-color: #0f172a;
}
.p-splitbutton .p-button-contrast:hover:not(:disabled) {
    background: #1e293b;
    border-color: #1e293b;
}

/* Outlined Variant */
.p-splitbutton-outlined .p-button-primary { background: transparent; color: var(--p-primary-500, #10b981); border-color: var(--p-primary-500, #10b981); }
.p-splitbutton-outlined .p-button-primary:hover:not(:disabled) { background: rgba(16, 185, 129, 0.08); }
.p-splitbutton-outlined .p-button-secondary { background: transparent; color: var(--p-surface-700, #334155); border-color: var(--p-surface-300, #cbd5e1); }
.p-splitbutton-outlined .p-button-secondary:hover:not(:disabled) { background: var(--p-surface-100, #f1f5f9); }
.p-splitbutton-outlined .p-button-success { background: transparent; color: #22c55e; border-color: #22c55e; }
.p-splitbutton-outlined .p-button-success:hover:not(:disabled) { background: rgba(34, 197, 94, 0.08); }
.p-splitbutton-outlined .p-button-info { background: transparent; color: #0ea5e9; border-color: #0ea5e9; }
.p-splitbutton-outlined .p-button-info:hover:not(:disabled) { background: rgba(14, 165, 233, 0.08); }
.p-splitbutton-outlined .p-button-warn { background: transparent; color: #f59e0b; border-color: #f59e0b; }
.p-splitbutton-outlined .p-button-warn:hover:not(:disabled) { background: rgba(245, 158, 11, 0.08); }
.p-splitbutton-outlined .p-button-help { background: transparent; color: #a855f7; border-color: #a855f7; }
.p-splitbutton-outlined .p-button-help:hover:not(:disabled) { background: rgba(168, 85, 247, 0.08); }
.p-splitbutton-outlined .p-button-danger { background: transparent; color: #ef4444; border-color: #ef4444; }
.p-splitbutton-outlined .p-button-danger:hover:not(:disabled) { background: rgba(239, 68, 68, 0.08); }
.p-splitbutton-outlined .p-button-contrast { background: transparent; color: #0f172a; border-color: #0f172a; }
.p-splitbutton-outlined .p-button-contrast:hover:not(:disabled) { background: rgba(15, 23, 42, 0.08); }

.p-splitbutton-outlined .p-splitbutton-button {
    border-right: none !important;
}

/* Text Variant */
.p-splitbutton-text .p-button { 
    background: transparent !important; 
    border-color: transparent !important; 
    box-shadow: none !important;
}
.p-splitbutton-text .p-button-primary { color: var(--p-primary-500, #10b981) !important; }
.p-splitbutton-text .p-button-primary:hover:not(:disabled),
.p-splitbutton-text .p-button-primary[aria-expanded="true"] { background: rgba(16, 185, 129, 0.1) !important; }

.p-splitbutton-text .p-button-secondary { color: var(--p-surface-700, #334155) !important; }
.p-splitbutton-text .p-button-secondary:hover:not(:disabled),
.p-splitbutton-text .p-button-secondary[aria-expanded="true"] { background: var(--p-surface-200, #e2e8f0) !important; }

.p-splitbutton-text .p-button-success { color: #22c55e !important; }
.p-splitbutton-text .p-button-success:hover:not(:disabled),
.p-splitbutton-text .p-button-success[aria-expanded="true"] { background: rgba(34, 197, 94, 0.1) !important; }

.p-splitbutton-text .p-button-info { color: #0ea5e9 !important; }
.p-splitbutton-text .p-button-info:hover:not(:disabled),
.p-splitbutton-text .p-button-info[aria-expanded="true"] { background: rgba(14, 165, 233, 0.1) !important; }

.p-splitbutton-text .p-button-warn { color: #f59e0b !important; }
.p-splitbutton-text .p-button-warn:hover:not(:disabled),
.p-splitbutton-text .p-button-warn[aria-expanded="true"] { background: rgba(245, 158, 11, 0.1) !important; }

.p-splitbutton-text .p-button-help { color: #a855f7 !important; }
.p-splitbutton-text .p-button-help:hover:not(:disabled),
.p-splitbutton-text .p-button-help[aria-expanded="true"] { background: rgba(168, 85, 247, 0.1) !important; }

.p-splitbutton-text .p-button-danger { color: #ef4444 !important; }
.p-splitbutton-text .p-button-danger:hover:not(:disabled),
.p-splitbutton-text .p-button-danger[aria-expanded="true"] { background: rgba(239, 68, 68, 0.1) !important; }

.p-splitbutton-text .p-button-contrast { color: #0f172a !important; }
.p-splitbutton-text .p-button-contrast:hover:not(:disabled),
.p-splitbutton-text .p-button-contrast[aria-expanded="true"] { background: rgba(15, 23, 42, 0.1) !important; }

/* Divider separator in solid buttons */
.p-splitbutton:not(.p-splitbutton-outlined):not(.p-splitbutton-text) .p-splitbutton-dropdown {
    border-left: 1px solid rgba(255, 255, 255, 0.25) !important;
}
.p-splitbutton:not(.p-splitbutton-outlined):not(.p-splitbutton-text) .p-button-secondary.p-splitbutton-dropdown {
    border-left: 1px solid var(--p-surface-300, #cbd5e1) !important;
}

/* Disabled */
.p-splitbutton-disabled,
.p-splitbutton .p-button:disabled {
    opacity: 0.6 !important;
    cursor: not-allowed !important;
    pointer-events: none !important;
}

/* Menu Overlay */
.p-splitbutton-menu {
    position: absolute;
    right: 0 !important;
    left: auto !important;
    z-index: 1050;
    min-width: 100%;
    width: max-content;
    background: var(--p-surface-0, #ffffff);
    border: 1px solid var(--p-surface-200, #e2e8f0);
    border-radius: var(--p-border-radius, 8px);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    padding: 0.35rem;
    outline: none;
    transform-origin: top right;
    transition: opacity 0.15s cubic-bezier(0.16, 1, 0.3, 1), transform 0.15s cubic-bezier(0.16, 1, 0.3, 1);
}

.p-splitbutton-menu.p-menu-flipped {
    transform-origin: bottom right;
}

.p-splitbutton-menu .p-menu-list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
}

.p-splitbutton-menu .p-menu-item {
    position: relative;
    border-radius: calc(var(--p-border-radius, 6px) - 2px);
}

.p-splitbutton-menu .p-menu-item-link {
    display: flex;
    align-items: center;
    gap: 0.625rem;
    padding: 0.5rem 0.75rem;
    color: var(--p-surface-700, #334155);
    border-radius: inherit;
    text-decoration: none;
    cursor: pointer;
    font-size: 0.875rem;
    font-weight: 500;
    user-select: none;
    transition: background-color 0.15s ease, color 0.15s ease;
    outline: none;
}

.p-splitbutton-menu .p-menu-item-link:hover,
.p-splitbutton-menu .p-menu-item.p-menu-active > .p-menu-item-link,
.p-splitbutton-menu .p-menu-item.p-focus > .p-menu-item-link {
    background: var(--p-surface-100, #f1f5f9);
    color: var(--p-surface-900, #0f172a);
}

.p-splitbutton-menu .p-menu-item-link[aria-disabled="true"] {
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
}

.p-splitbutton-menu .p-menu-item-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: var(--p-surface-500, #64748b);
}

.p-splitbutton-menu .p-menu-item-link:hover .p-menu-item-icon,
.p-splitbutton-menu .p-menu-item.p-menu-active > .p-menu-item-link .p-menu-item-icon {
    color: var(--p-surface-700, #334155);
}

.p-splitbutton-menu .p-submenu-icon {
    margin-left: auto;
    display: inline-flex;
    color: var(--p-surface-400, #94a3b8);
}

.p-splitbutton-menu .p-menu-separator {
    height: 1px;
    background: var(--p-surface-200, #e2e8f0);
    margin: 0.25rem 0;
}

/* Submenu Flyout Overlay */
.p-splitbutton-submenu-overlay {
    position: absolute;
    top: 0;
    left: calc(100% + 2px);
    z-index: 1060;
    min-width: 11.5rem;
    background: var(--p-surface-0, #ffffff);
    border: 1px solid var(--p-surface-200, #e2e8f0);
    border-radius: var(--p-border-radius, 8px);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    padding: 0.35rem;
    list-style: none;
    margin: 0;
    display: none;
    flex-direction: column;
    gap: 0.15rem;
}

.p-splitbutton-submenu-overlay.p-submenu-flipped {
    left: auto;
    right: calc(100% + 2px);
}

.p-menu-item.p-submenu-open > .p-splitbutton-submenu-overlay {
    display: flex !important;
}

/* Dark Mode Overrides */
.dark .p-splitbutton-menu,
.dark .p-splitbutton-submenu-overlay,
[data-theme="dark"] .p-splitbutton-menu,
[data-theme="dark"] .p-splitbutton-submenu-overlay {
    background: var(--p-surface-900, #0f172a) !important;
    border-color: var(--p-surface-700, #334155) !important;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.4) !important;
}

.dark .p-splitbutton-menu .p-menu-item-link,
[data-theme="dark"] .p-splitbutton-menu .p-menu-item-link {
    color: var(--p-surface-200, #e2e8f0) !important;
}

.dark .p-splitbutton-menu .p-menu-item-link:hover,
.dark .p-splitbutton-menu .p-menu-item.p-menu-active > .p-menu-item-link,
.dark .p-splitbutton-menu .p-menu-item.p-focus > .p-menu-item-link,
[data-theme="dark"] .p-splitbutton-menu .p-menu-item-link:hover,
[data-theme="dark"] .p-splitbutton-menu .p-menu-item.p-menu-active > .p-menu-item-link,
[data-theme="dark"] .p-splitbutton-menu .p-menu-item.p-focus > .p-menu-item-link {
    background: var(--p-surface-800, #1e293b) !important;
    color: #ffffff !important;
}

.dark .p-splitbutton-menu .p-menu-separator,
[data-theme="dark"] .p-splitbutton-menu .p-menu-separator {
    background: var(--p-surface-700, #334155) !important;
}

.dark .p-splitbutton-text .p-button-contrast,
[data-theme="dark"] .p-splitbutton-text .p-button-contrast {
    color: var(--p-surface-0, #ffffff) !important;
}
.dark .p-splitbutton-text .p-button-contrast:hover:not(:disabled),
.dark .p-splitbutton-text .p-button-contrast[aria-expanded="true"],
[data-theme="dark"] .p-splitbutton-text .p-button-contrast:hover:not(:disabled),
[data-theme="dark"] .p-splitbutton-text .p-button-contrast[aria-expanded="true"] {
    background: rgba(255, 255, 255, 0.1) !important;
}
`;
function SplitButtonIsland(container, props) {
  injectIslandStyle("split-button", SPLITBUTTON_CSS);
  const label = props.label || "";
  const icon = props.icon || "";
  const dropdownIcon = props.dropdownIcon || "chevronDown";
  const items = props.model || [];
  const severity = (props.severity || "primary").toLowerCase();
  const raised = !!props.raised;
  const rounded = !!props.rounded;
  const text = !!props.text;
  const outlined = !!props.outlined;
  const size = props.size || "normal";
  const disabled = !!props.disabled;
  const fluid = !!props.fluid;
  let isOpen = false;
  const menuId = `sb_menu_${Math.random().toString(36).substring(2, 9)}`;
  const rootClasses = ["p-splitbutton", "p-component"];
  if (rounded) rootClasses.push("p-splitbutton-rounded");
  if (raised) rootClasses.push("p-splitbutton-raised");
  if (text) rootClasses.push("p-splitbutton-text");
  if (outlined) rootClasses.push("p-splitbutton-outlined");
  if (size === "small") rootClasses.push("p-splitbutton-sm");
  if (size === "large") rootClasses.push("p-splitbutton-lg");
  if (fluid) rootClasses.push("p-splitbutton-fluid");
  if (disabled) rootClasses.push("p-splitbutton-disabled");
  const btnSevClass = `p-button-${severity}`;
  const initialSlotContent = container.innerHTML.trim();
  const hasCustomSlot = initialSlotContent && !initialSlotContent.startsWith('<div class="p-splitbutton');
  function renderSubmenuTree(subItems) {
    return `
            <ul class="p-splitbutton-submenu-overlay p-menu-list" role="menu">
                ${subItems.map((item, idx) => renderMenuItem(item, idx, true)).join("")}
            </ul>
        `;
  }
  function renderMenuItem(item, index, isSub = false) {
    if (item.separator) {
      return `<li class="p-menu-separator" role="separator"></li>`;
    }
    const hasSub = Array.isArray(item.items) && item.items.length > 0;
    const iconSvg = item.icon ? `<span class="p-menu-item-icon">${LucideIcons[item.icon]}</span>` : "";
    const subChevron = hasSub ? `<span class="p-submenu-icon">${LucideIcons.chevronRight}</span>` : "";
    const itemLabel = item.label || "";
    const itemDisabled = item.disabled ? 'aria-disabled="true"' : "";
    const itemUrl = item.url || (item.route ? item.route : "");
    return `
            <li class="p-menu-item ${hasSub ? "p-menu-item-has-submenu" : ""}" role="none" data-index="${index}">
                <a class="p-menu-item-link" 
                   role="menuitem" 
                   tabindex="${item.disabled ? "-1" : "0"}" 
                   ${itemDisabled}
                   ${itemUrl ? `href="${itemUrl}"` : ""}
                   ${item.target ? `target="${item.target}"` : ""}>
                    ${iconSvg}
                    <span class="p-menu-item-label">${itemLabel}</span>
                    ${subChevron}
                </a>
                ${hasSub ? renderSubmenuTree(item.items) : ""}
            </li>
        `;
  }
  const mainButtonContent = hasCustomSlot ? initialSlotContent : `${icon ? `<span class="p-button-icon">${LucideIcons[icon]}</span>` : ""}${label ? `<span class="p-button-label">${label}</span>` : ""}`;
  container.innerHTML = `
        <div class="${rootClasses.join(" ")}">
            <!-- Main Default Action Button -->
            <button type="button" 
                    class="p-splitbutton-button p-button ${btnSevClass}" 
                    ${disabled ? "disabled" : ""} 
                    aria-label="${label || "SplitButton Action"}">
                ${mainButtonContent}
            </button>

            <!-- Dropdown Menu Trigger Button -->
            <button type="button" 
                    class="p-splitbutton-dropdown p-button p-button-icon-only ${btnSevClass}" 
                    ${disabled ? "disabled" : ""} 
                    aria-haspopup="menu" 
                    aria-expanded="false" 
                    aria-controls="${menuId}" 
                    aria-label="More Options">
                <span class="p-button-icon">${LucideIcons[dropdownIcon]}</span>
            </button>

            <!-- Dropdown Menu Overlay -->
            <div id="${menuId}" class="p-splitbutton-menu p-menu p-component" role="menu" style="display: none; opacity: 0; transform: scaleY(0.8);">
                <ul class="p-menu-list" role="menu">
                    ${items.map((it2, idx) => renderMenuItem(it2, idx)).join("")}
                </ul>
            </div>
        </div>
    `;
  const rootEl = container.firstElementChild;
  const mainBtn = rootEl.querySelector(".p-splitbutton-button");
  const dropdownBtn = rootEl.querySelector(".p-splitbutton-dropdown");
  const menuEl = rootEl.querySelector(".p-splitbutton-menu");
  function closeAllSubmenus(scopeList) {
    const target = scopeList || menuEl;
    target.querySelectorAll(".p-menu-item.p-submenu-open").forEach((openLi) => {
      openLi.classList.remove("p-submenu-open", "p-menu-active");
    });
  }
  function closeMenu() {
    if (!isOpen) return;
    isOpen = false;
    if (activeSplitButtonClose === closeMenu) {
      activeSplitButtonClose = null;
    }
    dropdownBtn.setAttribute("aria-expanded", "false");
    menuEl.style.opacity = "0";
    menuEl.style.transform = "scaleY(0.8)";
    closeAllSubmenus();
    setTimeout(() => {
      if (!isOpen) {
        menuEl.style.display = "none";
      }
    }, 150);
  }
  function openMenu() {
    if (disabled || items.length === 0 || isOpen) return;
    if (activeSplitButtonClose && activeSplitButtonClose !== closeMenu) {
      activeSplitButtonClose();
    }
    activeSplitButtonClose = closeMenu;
    isOpen = true;
    dropdownBtn.setAttribute("aria-expanded", "true");
    menuEl.style.display = "block";
    const rect = rootEl.getBoundingClientRect();
    const menuHeight = menuEl.offsetHeight || 200;
    const fitsBelow = rect.bottom + menuHeight + 10 <= window.innerHeight;
    if (fitsBelow) {
      menuEl.classList.remove("p-menu-flipped");
      menuEl.style.top = "calc(100% + 4px)";
      menuEl.style.bottom = "auto";
      menuEl.style.right = "0";
    } else {
      menuEl.classList.add("p-menu-flipped");
      menuEl.style.top = "auto";
      menuEl.style.bottom = "calc(100% + 4px)";
      menuEl.style.right = "0";
    }
    requestAnimationFrame(() => {
      menuEl.style.opacity = "1";
      menuEl.style.transform = "scaleY(1)";
    });
    const firstLink = menuEl.querySelector('.p-menu-item-link:not([aria-disabled="true"])');
    firstLink?.focus();
  }
  function toggleMenu() {
    if (isOpen) closeMenu();
    else openMenu();
  }
  mainBtn.addEventListener("click", () => {
    if (disabled) return;
    container.dispatchEvent(new CustomEvent("splitbutton:click", {
      bubbles: true,
      detail: { action: props.action || "main", label }
    }));
  });
  dropdownBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleMenu();
  });
  document.addEventListener("click", (e) => {
    if (isOpen && !rootEl.contains(e.target)) {
      closeMenu();
    }
  });
  function handleItemClick(itemData, e) {
    if (itemData.disabled) return;
    if (itemData.command) {
      executeCommand(itemData.command, itemData);
    }
    if (itemData.url) {
      const safeUrl = sanitizeUrl(itemData.url);
      if (safeUrl && safeUrl !== "about:blank") {
        if (itemData.target === "_blank") {
          window.open(safeUrl, "_blank", "noopener,noreferrer");
        } else {
          window.location.href = safeUrl;
        }
      }
    }
    container.dispatchEvent(new CustomEvent("splitbutton:action", {
      bubbles: true,
      detail: { item: itemData, action: itemData.action || itemData.label }
    }));
    closeMenu();
    dropdownBtn.focus();
  }
  function setupSubmenuHover(parentUl, itemsList) {
    const directLis = Array.from(parentUl.children).filter((el) => el.classList.contains("p-menu-item"));
    directLis.forEach((li, idx) => {
      const itemData = itemsList[idx];
      if (!itemData || itemData.separator) return;
      const hasSub = Array.isArray(itemData.items) && itemData.items.length > 0;
      const link = li.querySelector(":scope > .p-menu-item-link");
      const subOverlay = li.querySelector(":scope > .p-splitbutton-submenu-overlay");
      li.addEventListener("mouseenter", () => {
        directLis.forEach((sibling) => {
          if (sibling !== li) {
            sibling.classList.remove("p-submenu-open", "p-menu-active");
          }
        });
        if (hasSub && subOverlay) {
          li.classList.add("p-submenu-open", "p-menu-active");
          const liRect = li.getBoundingClientRect();
          const subWidth = subOverlay.offsetWidth || 180;
          if (liRect.right + subWidth > window.innerWidth) {
            subOverlay.classList.add("p-submenu-flipped");
          } else {
            subOverlay.classList.remove("p-submenu-flipped");
          }
        } else {
          li.classList.add("p-menu-active");
        }
      });
      link?.addEventListener("click", (e) => {
        if (hasSub) {
          e.preventDefault();
          e.stopPropagation();
          return;
        }
        handleItemClick(itemData, e);
      });
      if (hasSub && subOverlay) {
        setupSubmenuHover(subOverlay, itemData.items);
      }
    });
  }
  const rootList = menuEl.querySelector(":scope > .p-menu-list");
  if (rootList) {
    setupSubmenuHover(rootList, items);
  }
  dropdownBtn.addEventListener("keydown", (e) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === " " || e.key === "Enter") {
      e.preventDefault();
      openMenu();
    }
  });
  menuEl.addEventListener("keydown", (e) => {
    const activeEl = document.activeElement;
    const currentLink = activeEl?.closest(".p-menu-item-link");
    const currentLi = currentLink?.closest(".p-menu-item");
    const activeList = currentLi?.closest("ul");
    if (e.key === "Escape") {
      e.preventDefault();
      const parentSubmenu = currentLi?.closest(".p-splitbutton-submenu-overlay");
      if (parentSubmenu) {
        const parentLi = parentSubmenu.closest(".p-menu-item");
        parentLi?.classList.remove("p-submenu-open");
        parentLi?.querySelector(":scope > .p-menu-item-link")?.focus();
      } else {
        closeMenu();
        dropdownBtn.focus();
      }
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      const links = Array.from(activeList?.querySelectorAll(':scope > .p-menu-item > .p-menu-item-link:not([aria-disabled="true"])') || []);
      const currentIndex = links.indexOf(currentLink);
      const nextIndex = (currentIndex + 1) % links.length;
      links[nextIndex]?.focus();
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      const links = Array.from(activeList?.querySelectorAll(':scope > .p-menu-item > .p-menu-item-link:not([aria-disabled="true"])') || []);
      const currentIndex = links.indexOf(currentLink);
      const prevIndex = (currentIndex - 1 + links.length) % links.length;
      links[prevIndex]?.focus();
      return;
    }
    if (e.key === "ArrowRight") {
      if (currentLi?.classList.contains("p-menu-item-has-submenu")) {
        e.preventDefault();
        currentLi.classList.add("p-submenu-open");
        const firstSubLink = currentLi.querySelector('.p-splitbutton-submenu-overlay .p-menu-item-link:not([aria-disabled="true"])');
        firstSubLink?.focus();
      }
      return;
    }
    if (e.key === "ArrowLeft") {
      const parentSubmenu = currentLi?.closest(".p-splitbutton-submenu-overlay");
      if (parentSubmenu) {
        e.preventDefault();
        const parentLi = parentSubmenu.closest(".p-menu-item");
        parentLi?.classList.remove("p-submenu-open");
        parentLi?.querySelector(":scope > .p-menu-item-link")?.focus();
      }
      return;
    }
    if (e.key === "Home") {
      e.preventDefault();
      const links = Array.from(activeList?.querySelectorAll(':scope > .p-menu-item > .p-menu-item-link:not([aria-disabled="true"])') || []);
      links[0]?.focus();
      return;
    }
    if (e.key === "End") {
      e.preventDefault();
      const links = Array.from(activeList?.querySelectorAll(':scope > .p-menu-item > .p-menu-item-link:not([aria-disabled="true"])') || []);
      links[links.length - 1]?.focus();
      return;
    }
  });
}

// tests/commands.test.ts
describe("Client Command Registry & Component Action Suite (LT-102)", () => {
  beforeEach(() => {
    clearCommands();
    document.body.innerHTML = "";
  });
  it("registerCommand and executeCommand: executes named handler with payload", () => {
    let executedPayload = null;
    registerCommand("exportPdf", (item) => {
      executedPayload = item;
    });
    assert.equal(getCommand("exportPdf") !== void 0, true);
    assert.deepEqual(listCommands(), ["exportPdf"]);
    const success = executeCommand("exportPdf", { id: 123, label: "Download" });
    assert.equal(success, true);
    assert.deepEqual(executedPayload, { id: 123, label: "Download" });
  });
  it("unregisterCommand: removes command from registry", () => {
    registerCommand("deleteRecord", () => {
    });
    assert.equal(unregisterCommand("deleteRecord"), true);
    assert.equal(getCommand("deleteRecord"), void 0);
    assert.equal(executeCommand("deleteRecord"), false);
  });
  it("executeCommand fallback: unknown command safely no-ops", () => {
    const success = executeCommand("nonExistentCommand", { data: "test" });
    assert.equal(success, false);
  });
  it("executeCommand: handles runtime errors in handler gracefully", () => {
    registerCommand("brokenHandler", () => {
      throw new Error("Explosion inside handler");
    });
    const success = executeCommand("brokenHandler");
    assert.equal(success, false);
  });
  it("Security: malicious JS string in command key is treated purely as lookup key and never evaluated", () => {
    const attackVectors = [
      "alert(document.cookie)",
      'window.location = "http://evil.com"',
      "() => { return globalThis; }",
      '[].constructor.constructor("return process")()'
    ];
    for (const attack of attackVectors) {
      const success = executeCommand(attack, { label: "Injected" });
      assert.equal(success, false);
    }
  });
  it("SpeedDial: executes registered command on action click", () => {
    let actionTriggered = null;
    registerCommand("speedDialAction", (item) => {
      actionTriggered = item;
    });
    const container = document.createElement("div");
    document.body.appendChild(container);
    SpeedDialIsland(container, {
      model: [
        { id: "1", label: "Save", command: "speedDialAction" }
      ]
    });
    const actionBtn = container.querySelector(".p-speeddial-action");
    assert.ok(actionBtn);
    actionBtn.click();
    assert.ok(actionTriggered);
    assert.equal(actionTriggered.label, "Save");
  });
  it("SplitButton: executes registered command on menu item click", () => {
    let splitActionTriggered = null;
    registerCommand("splitAction", (item) => {
      splitActionTriggered = item;
    });
    const container = document.createElement("div");
    document.body.appendChild(container);
    SplitButtonIsland(container, {
      label: "Save",
      model: [
        { label: "Export", command: "splitAction" }
      ]
    });
    const dropdownBtn = container.querySelector(".p-splitbutton-dropdown");
    assert.ok(dropdownBtn);
    dropdownBtn.click();
    const menuItems = container.querySelectorAll(".p-menu-item-link");
    assert.ok(menuItems.length > 0);
    menuItems[0].click();
    assert.ok(splitActionTriggered);
    assert.equal(splitActionTriggered.label, "Export");
  });
});
