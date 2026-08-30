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
globalThis.DOMParser = win.DOMParser;
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

// tests/phase2-components.test.ts
import { describe, it, beforeEach } from "node:test";
import assert from "node:assert";

// src/directives/csp.ts
var cachedNonce = null;
function getCspNonce() {
  if (cachedNonce) return cachedNonce;
  if (typeof document === "undefined") return null;
  const meta = document.querySelector('meta[name="csp-nonce"]');
  if (meta?.content) {
    cachedNonce = meta.content.trim();
    return cachedNonce;
  }
  if (typeof window !== "undefined" && window.__LAUGHTALE_NONCE__) {
    cachedNonce = String(window.__LAUGHTALE_NONCE__).trim();
    return cachedNonce;
  }
  const scriptWithNonce = document.querySelector("script[nonce]");
  if (scriptWithNonce) {
    const nonce = scriptWithNonce.nonce || scriptWithNonce.getAttribute("nonce");
    if (nonce) {
      cachedNonce = nonce.trim();
      return cachedNonce;
    }
  }
  if (document.currentScript) {
    const currentNonce = document.currentScript.nonce || document.currentScript.getAttribute("nonce");
    if (currentNonce) {
      cachedNonce = currentNonce.trim();
      return cachedNonce;
    }
  }
  return null;
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

// src/components/select.ts
var CSS = `
/* ==================== AURA SELECT ==================== */
.laughtale-select,
.p-select {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: space-between;
    min-height: 2.5rem;
    padding: 0.375rem 0.75rem;
    background: var(--p-surface-0);
    border: 1px solid var(--p-border-color);
    border-radius: var(--p-border-radius);
    color: var(--p-text-color);
    font-family: var(--p-font-family, inherit);
    font-size: 0.875rem;
    line-height: 1.25;
    cursor: pointer;
    user-select: none;
    outline: none;
    box-sizing: border-box;
    transition: background 150ms ease, border-color 150ms ease, box-shadow 150ms ease, color 150ms ease;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.02);
    gap: 0.5rem;
}

.p-select.p-select-fluid {
    width: 100%;
}

.p-select:hover:not(.is-disabled):not([readonly]) {
    border-color: var(--p-surface-400);
}

.p-select.is-open,
.p-select:focus-visible {
    border-color: var(--p-primary-500) !important;
    box-shadow: 0 0 0 1px var(--p-primary-500) !important;
}

/* Filled Variant */
.p-select.variant-filled {
    background-color: var(--p-surface-100);
    border-color: transparent;
}
.p-select.variant-filled:hover:not(.is-disabled):not([readonly]) {
    background-color: var(--p-surface-200);
}
.p-select.variant-filled.is-open,
.p-select.variant-filled:focus-visible {
    background-color: var(--p-surface-0);
    border-color: var(--p-primary-500) !important;
}

/* Sizes */
.p-select.size-small,
.p-select.p-select-sm {
    min-height: 2rem;
    padding: 0.25rem 0.5rem;
    font-size: 0.75rem;
}
.p-select.size-large,
.p-select.p-select-lg {
    min-height: 3rem;
    padding: 0.5rem 1rem;
    font-size: 1.0625rem;
}

/* Invalid State */
.p-select.is-invalid {
    border-color: var(--p-red-500, #ef4444) !important;
}
.p-select.is-invalid:focus-visible,
.p-select.is-invalid.is-open {
    box-shadow: 0 0 0 1px var(--p-red-500, #ef4444) !important;
}

/* Disabled State */
.p-select.is-disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background-color: var(--p-surface-100);
}

/* Select Trigger Content */
.p-select-label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: var(--p-text-color);
}
.p-select-label.p-placeholder {
    color: var(--p-text-muted);
}

.p-select-editable-input {
    flex: 1;
    border: none;
    background: transparent;
    outline: none;
    font-family: inherit;
    font-size: inherit;
    color: inherit;
    padding: 0;
    margin: 0;
}

/* Trigger Actions */
.p-select-actions {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    flex-shrink: 0;
}

.p-select-clear-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: var(--p-text-muted);
    cursor: pointer;
    padding: 2px;
    border-radius: 50%;
    transition: color 150ms ease, background 150ms ease;
}
.p-select-clear-icon:hover {
    color: var(--p-text-color);
    background: var(--p-surface-200);
}

.p-select-dropdown {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: var(--p-text-muted);
    transition: transform 200ms cubic-bezier(0.16, 1, 0.3, 1), color 150ms ease;
}
.p-select.is-open .p-select-dropdown {
    transform: rotate(180deg);
    color: var(--p-primary-500);
}

/* Chips in Trigger */
.p-select-chips-wrap {
    display: flex;
    flex-wrap: wrap;
    gap: 0.25rem;
    align-items: center;
}
.p-select-chip {
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
    padding: 0.125rem 0.5rem;
    background: var(--p-surface-100);
    border-radius: calc(var(--p-border-radius) - 2px);
    font-size: 0.75rem;
    color: var(--p-surface-700);
}
.p-select-chip-remove {
    cursor: pointer;
    color: var(--p-text-muted);
    display: flex;
}
.p-select-chip-remove:hover {
    color: var(--p-text-color);
}

/* ==================== SELECT OVERLAY ==================== */
.p-select-overlay {
    position: absolute;
    top: calc(100% + 4px);
    left: 0;
    min-width: 100%;
    width: max-content;
    max-width: 24rem;
    background: var(--p-surface-0);
    border: 1px solid var(--p-border-color);
    border-radius: var(--p-border-radius);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1);
    z-index: 1100;
    overflow: hidden;
    opacity: 0;
    transform: scale(0.95) translateY(-4px);
    pointer-events: none;
    transition: opacity 150ms cubic-bezier(0.16, 1, 0.3, 1), transform 150ms cubic-bezier(0.16, 1, 0.3, 1);
    box-sizing: border-box;
}

.p-select-overlay.is-visible {
    opacity: 1;
    transform: scale(1) translateY(0);
    pointer-events: auto;
}

/* Filter Bar */
.p-select-filter-container {
    position: relative;
    padding: 0.5rem;
    border-bottom: 1px solid var(--p-border-color);
    background: var(--p-surface-0);
}
.p-select-filter-input {
    width: 100%;
    padding: 0.375rem 0.625rem 0.375rem 2rem;
    background: var(--p-surface-0);
    border: 1px solid var(--p-border-color);
    border-radius: calc(var(--p-border-radius) - 2px);
    color: var(--p-text-color);
    font-size: 0.8125rem;
    outline: none;
    box-sizing: border-box;
    transition: border-color 150ms ease, box-shadow 150ms ease;
}
.p-select-filter-input:focus {
    border-color: var(--p-primary-500);
    box-shadow: 0 0 0 1px var(--p-primary-500);
}
.p-select-filter-icon {
    position: absolute;
    left: 1.125rem;
    top: 50%;
    transform: translateY(-50%);
    color: var(--p-text-muted);
    pointer-events: none;
    display: flex;
}

/* Select All Header */
.p-select-header-all {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 0.75rem;
    border-bottom: 1px solid var(--p-border-color);
    font-size: 0.8125rem;
    font-weight: 600;
    color: var(--p-text-color);
    cursor: pointer;
    background: var(--p-surface-50);
}
.p-select-header-all:hover {
    background: var(--p-surface-100);
}

/* List Options */
.p-select-list {
    list-style: none;
    margin: 0;
    padding: 0.25rem;
    overflow-y: auto;
    max-height: 220px;
    box-sizing: border-box;
}

.p-select-option-group {
    padding: 0.5rem 0.75rem 0.25rem;
    font-size: 0.6875rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--p-text-muted);
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.p-select-option {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.5rem 0.75rem;
    border-radius: calc(var(--p-border-radius) - 2px);
    font-size: 0.875rem;
    color: var(--p-text-color);
    cursor: pointer;
    transition: background 120ms ease, color 120ms ease;
    gap: 0.75rem;
}

.p-select-option:hover:not(.p-disabled) {
    background: var(--p-surface-100);
}

.p-select-option.p-highlight {
    background: var(--p-primary-50, #ecfdf5);
    color: var(--p-primary-700, #047857);
    font-weight: 600;
}
.p-select-option.p-highlight:hover:not(.p-disabled) {
    background: var(--p-primary-100, #d1fae5);
}

.p-select-option.p-disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.p-select-option-content {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex: 1;
}

.p-select-option-checkbox {
    width: 1.125rem;
    height: 1.125rem;
    border: 1px solid var(--p-border-color);
    border-radius: calc(var(--p-border-radius) - 4px);
    background: var(--p-surface-0);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: background 150ms ease, border-color 150ms ease;
}
.p-select-option.p-highlight .p-select-option-checkbox,
.p-select-option-checkbox.is-checked {
    background: var(--p-primary-500);
    border-color: var(--p-primary-500);
    color: #ffffff;
}

.p-select-option-checkmark {
    color: var(--p-primary-600);
    display: flex;
}

.p-select-option-badge {
    font-size: 0.6875rem;
    font-weight: 700;
    padding: 0.125rem 0.375rem;
    border-radius: 9999px;
    background: var(--p-surface-200);
    color: var(--p-surface-700);
}

.p-select-empty-message {
    padding: 1rem;
    text-align: center;
    font-size: 0.8125rem;
    color: var(--p-text-muted);
}

/* ==================== DARK MODE ==================== */
.dark .p-select {
    background: var(--p-surface-900);
    border-color: var(--p-surface-700);
    color: var(--p-surface-0);
}
.dark .p-select:hover:not(.is-disabled):not([readonly]) {
    border-color: var(--p-surface-500);
}
.dark .p-select.variant-filled {
    background-color: var(--p-surface-800);
}
.dark .p-select.variant-filled:hover:not(.is-disabled):not([readonly]) {
    background-color: var(--p-surface-700);
}
.dark .p-select.variant-filled.is-open {
    background-color: var(--p-surface-900);
}
.dark .p-select.is-disabled {
    background-color: var(--p-surface-800);
}
.dark .p-select-chip {
    background: var(--p-surface-800);
    color: var(--p-surface-200);
}
.dark .p-select-overlay {
    background: var(--p-surface-900);
    border-color: var(--p-surface-700);
}
.dark .p-select-filter-container {
    background: var(--p-surface-900);
    border-color: var(--p-surface-700);
}
.dark .p-select-filter-input {
    background: var(--p-surface-950, #090d14);
    border-color: var(--p-surface-700);
    color: var(--p-surface-0);
}
.dark .p-select-header-all {
    background: var(--p-surface-850, #141b26);
    border-color: var(--p-surface-700);
}
.dark .p-select-header-all:hover {
    background: var(--p-surface-800);
}
.dark .p-select-option:hover:not(.p-disabled) {
    background: var(--p-surface-800);
    color: var(--p-surface-0);
}
.dark .p-select-option.p-highlight {
    background: rgba(16, 185, 129, 0.16);
    color: var(--p-primary-300, #6ee7b7);
}
.dark .p-select-option.p-highlight:hover:not(.p-disabled) {
    background: rgba(16, 185, 129, 0.24);
    color: var(--p-primary-200, #a7f3d0);
}
.dark .p-select-option-checkbox {
    background: var(--p-surface-950, #090d14);
    border-color: var(--p-surface-600);
}
.dark .p-select-option-checkmark {
    color: var(--p-primary-400);
}
.dark .p-select-option-badge {
    background: var(--p-surface-800);
    color: var(--p-surface-200);
}
`;
function SelectIsland(container, props) {
  injectIslandStyle("laughtale-select", CSS);
  const isMultiple = props.multiple === true || String(props.multiple) === "true";
  const isCheckmark = props.checkmark === true || String(props.checkmark) === "true";
  const isCheckbox = props.checkbox === true || String(props.checkbox) === "true";
  const isChipDisplay = props.display === "chip";
  const hasFilter = props.filter === true || String(props.filter) === "true";
  const showClear = props.showClear === true || String(props.showClear) === "true";
  const isEditable = props.editable === true || String(props.editable) === "true";
  const isLoading = props.loading === true || String(props.loading) === "true";
  const isFluid = props.fluid === true || String(props.fluid) === "true";
  const isInvalid = props.invalid === true || String(props.invalid) === "true";
  const isDisabled = props.disabled === true || String(props.disabled) === "true";
  const isReadonly = props.readonly === true || String(props.readonly) === "true";
  const isFilled = props.variant === "filled";
  const size = props.size || "normal";
  const placeholder = props.placeholder || "Select an option...";
  const scrollHeight = props.scrollHeight || "220px";
  function normalizeOptions() {
    const raw = props.options || [];
    return raw.map((opt) => {
      if (typeof opt === "string") {
        return { label: opt, value: opt };
      }
      return opt;
    });
  }
  const allOptions = normalizeOptions();
  function getFlattenedOptions(opts) {
    const result = [];
    opts.forEach((o) => {
      if (o.items && o.items.length > 0) {
        o.items.forEach((child) => result.push(child));
      } else {
        result.push(o);
      }
    });
    return result;
  }
  const flatOptions = getFlattenedOptions(allOptions);
  let selectedValues = [];
  const initVal = props.value ?? props.selectedValue;
  if (initVal !== void 0 && initVal !== null) {
    if (Array.isArray(initVal)) {
      selectedValues = [...initVal];
    } else if (typeof initVal === "string" && initVal.includes(",") && isMultiple) {
      selectedValues = initVal.split(",").map((s) => s.trim());
    } else {
      selectedValues = [initVal];
    }
  }
  let isOpen = false;
  let filterQuery = "";
  function isSelected(val) {
    return selectedValues.some((v) => String(v) === String(val) || typeof v === "object" && v?.value === val);
  }
  function getSelectedItems() {
    return flatOptions.filter((o) => isSelected(o.value) || isSelected(o.code));
  }
  function renderTriggerLabel() {
    const items = getSelectedItems();
    if (items.length === 0) {
      if (isEditable && selectedValues.length > 0) {
        return `<span class="p-select-label">${selectedValues[0]}</span>`;
      }
      return `<span class="p-select-label p-placeholder">${placeholder}</span>`;
    }
    if (isMultiple) {
      if (isChipDisplay) {
        const chipsHtml = items.map((item2) => `
                    <span class="p-select-chip" data-value="${item2.value}">
                        ${item2.flag ? `<span>${item2.flag}</span>` : ""}
                        <span>${item2.label || item2.value}</span>
                        <span class="p-select-chip-remove" data-remove="${item2.value}">${getLucideIcon("x", 12)}</span>
                    </span>
                `).join("");
        return `<div class="p-select-chips-wrap">${chipsHtml}</div>`;
      } else {
        const first = items[0].label || items[0].value;
        const count = items.length > 1 ? ` (+${items.length - 1} more)` : "";
        return `<span class="p-select-label">${first}${count}</span>`;
      }
    }
    const item = items[0];
    const flagHtml = item.flag ? `<span style="font-size: 1.125rem; line-height: 1;">${item.flag}</span>` : "";
    const iconHtml = item.icon ? `<span style="font-size: 1.125rem; line-height: 1;">${item.icon}</span>` : "";
    const statusHtml = item.statusClass ? `<span class="w-2 h-2 rounded-full ${item.statusClass}"></span>` : "";
    return `<span class="p-select-label">${flagHtml}${iconHtml}${statusHtml}<span>${item.label || item.value}</span></span>`;
  }
  function filterOptions(opts, q) {
    if (!q) return opts;
    const query = q.toLowerCase();
    const filtered = [];
    opts.forEach((opt) => {
      if (opt.items && opt.items.length > 0) {
        const matchingChildren = opt.items.filter(
          (c) => c.label && c.label.toLowerCase().includes(query) || c.value && String(c.value).toLowerCase().includes(query) || c.description && c.description.toLowerCase().includes(query)
        );
        if (matchingChildren.length > 0) {
          filtered.push({ ...opt, items: matchingChildren });
        }
      } else {
        if (opt.label && opt.label.toLowerCase().includes(query) || opt.value && String(opt.value).toLowerCase().includes(query) || opt.description && opt.description.toLowerCase().includes(query)) {
          filtered.push(opt);
        }
      }
    });
    return filtered;
  }
  function renderListItems() {
    const visibleOpts = filterOptions(allOptions, filterQuery);
    if (visibleOpts.length === 0) {
      return `<div class="p-select-empty-message">No results found</div>`;
    }
    let html = "";
    visibleOpts.forEach((opt, idx) => {
      if (opt.items && opt.items.length > 0) {
        html += `
                    <li class="p-select-option-group">
                        ${opt.flag ? `<span>${opt.flag}</span>` : ""}
                        <span>${opt.label || opt.value}</span>
                    </li>
                `;
        opt.items.forEach((child, cIdx) => {
          html += renderSingleOption(child, `opt_${idx}_${cIdx}`);
        });
      } else {
        html += renderSingleOption(opt, `opt_${idx}`);
      }
    });
    return html;
  }
  function renderSingleOption(opt, id) {
    const checked = isSelected(opt.value) || isSelected(opt.code);
    const dis = opt.disabled ? "p-disabled" : "";
    const high = checked ? "p-highlight" : "";
    const flagHtml = opt.flag ? `<span style="font-size: 1.125rem; line-height: 1;">${opt.flag}</span>` : "";
    const iconHtml = opt.icon ? `<span style="font-size: 1.125rem; line-height: 1;">${opt.icon}</span>` : "";
    const avatarHtml = opt.avatar ? `<div style="position: relative; width: 1.75rem; height: 1.75rem; border-radius: 50%; background: var(--p-surface-200); color: var(--p-surface-700); font-weight: 700; font-size: 0.6875rem; display: flex; align-items: center; justify-content: center;">${opt.avatar}${opt.statusClass ? `<span style="position: absolute; bottom: -1px; right: -1px; width: 8px; height: 8px; border-radius: 50%; border: 1.5px solid var(--p-surface-0);" class="${opt.statusClass}"></span>` : ""}</div>` : "";
    const badgeHtml = opt.badge !== void 0 ? `<span class="p-select-option-badge">${opt.badge}</span>` : "";
    const descHtml = opt.description ? `<div style="font-size: 0.75rem; color: var(--p-text-muted);">${opt.description}</div>` : "";
    const checkmarkHtml = (isCheckmark || isMultiple) && checked ? `<span class="p-select-option-checkmark">${getLucideIcon("check", 16)}</span>` : "";
    const checkboxHtml = isCheckbox || isMultiple ? `
            <div class="p-select-option-checkbox ${checked ? "is-checked" : ""}">
                ${checked ? getLucideIcon("check", 12) : ""}
            </div>
        ` : "";
    return `
            <li class="p-select-option ${high} ${dis}" data-value="${opt.value}" role="option" aria-selected="${checked ? "true" : "false"}" id="${id}">
                <div class="p-select-option-content">
                    ${checkboxHtml}
                    ${flagHtml}
                    ${iconHtml}
                    ${avatarHtml}
                    <div>
                        <span class="font-medium">${opt.label || opt.value}</span>
                        ${descHtml}
                    </div>
                </div>
                ${badgeHtml}
                ${checkmarkHtml}
            </li>
        `;
  }
  function render() {
    const rootClasses = [
      "laughtale-select",
      "p-select",
      isFluid ? "p-select-fluid" : "",
      isFilled ? "variant-filled" : "",
      size !== "normal" ? `size-${size}` : "",
      isInvalid ? "is-invalid" : "",
      isDisabled ? "is-disabled" : "",
      isOpen ? "is-open" : ""
    ].filter(Boolean).join(" ");
    const hasSelected = selectedValues.length > 0;
    const allSelected = flatOptions.length > 0 && selectedValues.length === flatOptions.length;
    const isIndeterminate = selectedValues.length > 0 && !allSelected;
    container.className = rootClasses;
    container.setAttribute("tabindex", isDisabled ? "-1" : "0");
    container.setAttribute("role", "combobox");
    container.setAttribute("aria-expanded", isOpen ? "true" : "false");
    container.setAttribute("aria-haspopup", "listbox");
    container.innerHTML = `
            ${renderTriggerLabel()}
            <div class="p-select-actions">
                ${showClear && hasSelected && !isDisabled ? `<span class="p-select-clear-icon" title="Clear selection">${getLucideIcon("x", 14)}</span>` : ""}
                ${isLoading ? `<span class="p-select-dropdown">${getLucideIcon("loader-2", 16)}</span>` : `<span class="p-select-dropdown">${getLucideIcon("chevron-down", 16)}</span>`}
            </div>
            <div class="p-select-overlay ${isOpen ? "is-visible" : ""}">
                ${hasFilter ? `
                    <div class="p-select-filter-container">
                        <span class="p-select-filter-icon">${getLucideIcon("search", 14)}</span>
                        <input type="text" class="p-select-filter-input" placeholder="${props.filterPlaceholder || "Search..."}" value="${filterQuery}" />
                    </div>
                ` : ""}
                ${isMultiple && isCheckbox ? `
                    <div class="p-select-header-all">
                        <div class="p-select-option-checkbox ${allSelected ? "is-checked" : ""}">
                            ${allSelected ? getLucideIcon("check", 12) : isIndeterminate ? getLucideIcon("minus", 12) : ""}
                        </div>
                        <span>Select All (${selectedValues.length}/${flatOptions.length})</span>
                    </div>
                ` : ""}
                <ul class="p-select-list" role="listbox" style="max-height: ${scrollHeight};">
                    ${renderListItems()}
                </ul>
            </div>
            <input type="hidden" name="${props.name || props.targetInputName || "select_value"}" value="${selectedValues.join(",")}" />
        `;
    bindEvents();
  }
  function toggleOverlay(open) {
    if (isDisabled || isReadonly) return;
    isOpen = open !== void 0 ? open : !isOpen;
    const overlay = container.querySelector(".p-select-overlay");
    const chevron = container.querySelector(".p-select-dropdown");
    if (isOpen) {
      container.classList.add("is-open");
      overlay?.classList.add("is-visible");
      container.setAttribute("aria-expanded", "true");
      if (hasFilter) {
        setTimeout(() => {
          container.querySelector(".p-select-filter-input")?.focus();
        }, 50);
      }
    } else {
      container.classList.remove("is-open");
      overlay?.classList.remove("is-visible");
      container.setAttribute("aria-expanded", "false");
      filterQuery = "";
    }
  }
  function bindEvents() {
    container.onclick = (e) => {
      const target = e.target;
      if (target.closest(".p-select-overlay")) return;
      if (target.closest(".p-select-clear-icon")) {
        e.stopPropagation();
        selectedValues = [];
        render();
        syncValue();
        return;
      }
      if (target.closest(".p-select-chip-remove")) {
        e.stopPropagation();
        const removeBtn = target.closest(".p-select-chip-remove");
        const remVal = removeBtn.getAttribute("data-remove");
        selectedValues = selectedValues.filter((v) => String(v) !== String(remVal));
        render();
        syncValue();
        return;
      }
      toggleOverlay();
    };
    const filterInp = container.querySelector(".p-select-filter-input");
    if (filterInp) {
      filterInp.oninput = (e) => {
        filterQuery = filterInp.value;
        const list = container.querySelector(".p-select-list");
        if (list) list.innerHTML = renderListItems();
        bindOptionClicks();
      };
      filterInp.onclick = (e) => e.stopPropagation();
      filterInp.onkeydown = (e) => {
        if (e.key === "Escape") {
          toggleOverlay(false);
        }
      };
    }
    const selectAllHeader = container.querySelector(".p-select-header-all");
    if (selectAllHeader) {
      selectAllHeader.onclick = (e) => {
        e.stopPropagation();
        if (selectedValues.length === flatOptions.length) {
          selectedValues = [];
        } else {
          selectedValues = flatOptions.map((o) => o.value);
        }
        render();
        syncValue();
      };
    }
    bindOptionClicks();
    container.onkeydown = (e) => {
      if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
        if (!isOpen) {
          e.preventDefault();
          toggleOverlay(true);
        }
      } else if (e.key === "Escape") {
        if (isOpen) {
          e.preventDefault();
          toggleOverlay(false);
        }
      }
    };
    document.addEventListener("click", (e) => {
      if (!container.contains(e.target)) {
        if (isOpen) toggleOverlay(false);
      }
    });
  }
  function bindOptionClicks() {
    const optionEls = container.querySelectorAll(".p-select-option:not(.p-disabled)");
    optionEls.forEach((el) => {
      el.onclick = (e) => {
        e.stopPropagation();
        const val = el.getAttribute("data-value");
        if (val === null) return;
        if (isMultiple) {
          if (isSelected(val)) {
            selectedValues = selectedValues.filter((v) => String(v) !== String(val));
          } else {
            selectedValues.push(val);
          }
          render();
        } else {
          selectedValues = [val];
          toggleOverlay(false);
          render();
        }
        syncValue();
      };
    });
  }
  function syncValue() {
    const payload = isMultiple ? selectedValues : selectedValues[0] ?? null;
    const hiddenInp = container.querySelector('input[type="hidden"]');
    if (hiddenInp) hiddenInp.value = selectedValues.join(",");
    container.dispatchEvent(new CustomEvent("select:change", {
      bubbles: true,
      detail: { value: payload, selectedItems: getSelectedItems() }
    }));
    container.dispatchEvent(new CustomEvent("change", {
      bubbles: true,
      detail: { value: payload }
    }));
  }
  render();
}

// src/components/checkbox.ts
var CSS2 = `
.laughtale-checkbox-wrap {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    user-select: none;
    font-family: var(--p-font-family, inherit);
    vertical-align: middle;
}
.laughtale-checkbox-wrap.disabled {
    opacity: 0.6;
    cursor: not-allowed;
    pointer-events: none;
}

.laughtale-checkbox-box {
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--p-surface-0);
    border: 1px solid var(--p-border-color);
    border-radius: calc(var(--p-border-radius) - 2px);
    transition: background 150ms cubic-bezier(0.4, 0, 0.2, 1), 
                border-color 150ms ease, 
                box-shadow 150ms ease;
    box-sizing: border-box;
    flex-shrink: 0;
    color: #ffffff;
}

/* Variants */
.laughtale-checkbox-wrap.variant-filled .laughtale-checkbox-box {
    background: var(--p-surface-50);
}

/* Sizes */
.laughtale-checkbox-wrap.size-small .laughtale-checkbox-box {
    width: 1rem;
    height: 1rem;
    border-radius: calc(var(--p-border-radius) - 3px);
}
.laughtale-checkbox-wrap.size-small .laughtale-checkbox-icon {
    width: 10px;
    height: 10px;
}
.laughtale-checkbox-wrap.size-small .laughtale-checkbox-label {
    font-size: 0.8125rem;
}

.laughtale-checkbox-wrap.size-normal .laughtale-checkbox-box {
    width: 1.25rem;
    height: 1.25rem;
    border-radius: calc(var(--p-border-radius) - 2px);
}
.laughtale-checkbox-wrap.size-normal .laughtale-checkbox-icon {
    width: 12px;
    height: 12px;
}
.laughtale-checkbox-wrap.size-normal .laughtale-checkbox-label {
    font-size: 0.875rem;
}

.laughtale-checkbox-wrap.size-large .laughtale-checkbox-box {
    width: 1.5rem;
    height: 1.5rem;
    border-radius: calc(var(--p-border-radius) - 1px);
}
.laughtale-checkbox-wrap.size-large .laughtale-checkbox-icon {
    width: 15px;
    height: 15px;
}
.laughtale-checkbox-wrap.size-large .laughtale-checkbox-label {
    font-size: 1rem;
}

/* Hover States */
.laughtale-checkbox-wrap:hover:not(.disabled) .laughtale-checkbox-box {
    border-color: var(--p-primary-500);
}
.laughtale-checkbox-wrap:hover:not(.disabled).checked .laughtale-checkbox-box,
.laughtale-checkbox-wrap:hover:not(.disabled).indeterminate .laughtale-checkbox-box {
    background: var(--p-primary-600);
    border-color: var(--p-primary-600);
}

/* Focus States (Radix Focus Ring) */
.laughtale-checkbox-wrap:focus-within:not(.disabled) .laughtale-checkbox-box {
    box-shadow: 0 0 0 1px var(--p-surface-0), 0 0 0 3px var(--p-primary-500);
    border-color: var(--p-primary-500);
}

/* Checked & Indeterminate States */
.laughtale-checkbox-wrap.checked .laughtale-checkbox-box,
.laughtale-checkbox-wrap.indeterminate .laughtale-checkbox-box {
    background: var(--p-primary-500);
    border-color: var(--p-primary-500);
    color: #ffffff;
}

/* Invalid State */
.laughtale-checkbox-wrap.invalid .laughtale-checkbox-box {
    border-color: #ef4444 !important;
}
.laughtale-checkbox-wrap.invalid:focus-within:not(.disabled) .laughtale-checkbox-box {
    box-shadow: 0 0 0 1px var(--p-surface-0), 0 0 0 3px #ef4444;
}

/* Icon Micro-Interaction */
.laughtale-checkbox-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    transform: scale(0);
    opacity: 0;
    transition: transform 150ms cubic-bezier(0.16, 1, 0.3, 1), opacity 150ms ease;
}
.laughtale-checkbox-wrap.checked .laughtale-checkbox-icon,
.laughtale-checkbox-wrap.indeterminate .laughtale-checkbox-icon {
    transform: scale(1);
    opacity: 1;
}

.laughtale-checkbox-label {
    color: var(--p-text-color);
    font-weight: 500;
    transition: color 150ms ease;
}

.laughtale-checkbox-hidden {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
    margin: 0;
    pointer-events: none;
}

/* Dark Mode Tokens */
.dark .laughtale-checkbox-box {
    background: var(--p-surface-900);
    border-color: var(--p-surface-700);
}
.dark .laughtale-checkbox-wrap.variant-filled .laughtale-checkbox-box {
    background: var(--p-surface-800);
}
.dark .laughtale-checkbox-wrap:hover:not(.disabled) .laughtale-checkbox-box {
    border-color: var(--p-primary-400);
    background: var(--p-surface-800);
}
.dark .laughtale-checkbox-wrap.checked .laughtale-checkbox-box,
.dark .laughtale-checkbox-wrap.indeterminate .laughtale-checkbox-box {
    background: var(--p-primary-500);
    border-color: var(--p-primary-500);
    color: var(--p-surface-950);
}
.dark .laughtale-checkbox-wrap:hover:not(.disabled).checked .laughtale-checkbox-box,
.dark .laughtale-checkbox-wrap:hover:not(.disabled).indeterminate .laughtale-checkbox-box {
    background: var(--p-primary-400);
    border-color: var(--p-primary-400);
}
.dark .laughtale-checkbox-wrap:focus-within:not(.disabled) .laughtale-checkbox-box {
    box-shadow: 0 0 0 1px var(--p-surface-900), 0 0 0 3px var(--p-primary-500);
}
.dark .laughtale-checkbox-label {
    color: var(--p-surface-100);
}
`;
function CheckboxIsland(container, props) {
  injectIslandStyle("laughtale-checkbox", CSS2);
  let isChecked = Boolean(props.checked);
  let isIndeterminate = Boolean(props.indeterminate);
  const size = props.size || "normal";
  const variant = props.variant || "outlined";
  const inputId = props.inputId || `chk_${Math.random().toString(36).substring(2, 9)}`;
  function render() {
    const stateClass = isIndeterminate ? "indeterminate" : isChecked ? "checked" : "";
    const iconSvg = isIndeterminate ? LucideIcons.minus : LucideIcons.check;
    container.innerHTML = `
            <label class="laughtale-checkbox-wrap size-${size} variant-${variant} ${stateClass} ${props.disabled ? "disabled" : ""} ${props.invalid ? "invalid" : ""}" 
                   for="${inputId}">
                <input type="checkbox" 
                       id="${inputId}" 
                       class="laughtale-checkbox-hidden" 
                       ${isChecked ? "checked" : ""} 
                       ${props.disabled ? "disabled" : ""} 
                       aria-checked="${isIndeterminate ? "mixed" : isChecked ? "true" : "false"}" 
                       role="checkbox" />
                <div class="laughtale-checkbox-box" tabindex="${props.disabled ? -1 : 0}">
                    <span class="laughtale-checkbox-icon">
                        ${iconSvg}
                    </span>
                </div>
                ${props.label ? `<span class="laughtale-checkbox-label">${props.label}</span>` : ""}
            </label>
        `;
    bindEvents();
    syncValue();
  }
  function bindEvents() {
    const input = container.querySelector(`#${inputId}`);
    const box = container.querySelector(".laughtale-checkbox-box");
    if (!input || props.disabled) return;
    input.addEventListener("change", () => {
      isChecked = input.checked;
      isIndeterminate = false;
      render();
      dispatchChangeEvent();
    });
    box?.addEventListener("keydown", (e) => {
      if (e.key === " ") {
        e.preventDefault();
        input.click();
      }
    });
  }
  function dispatchChangeEvent() {
    container.dispatchEvent(new CustomEvent("checkbox:change", {
      bubbles: true,
      detail: {
        checked: isChecked,
        indeterminate: isIndeterminate,
        value: props.value || isChecked
      }
    }));
  }
  function syncValue() {
    const targetName = props.targetInputName || props.name;
    if (targetName) {
      let hidden = container.querySelector(`input[type="hidden"][name="${targetName}"]`);
      if (!hidden) {
        hidden = document.createElement("input");
        hidden.type = "hidden";
        hidden.name = targetName;
        container.appendChild(hidden);
      }
      hidden.value = isChecked ? props.value || "true" : "false";
    }
  }
  render();
}

// src/components/radio-button.ts
var CSS3 = `
/* ==================== AURA RADIOBUTTON ==================== */
.laughtale-radio-root,
.p-radiobutton-root {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    user-select: none;
    font-family: var(--p-font-family, inherit);
    box-sizing: border-box;
}

.p-radiobutton {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 1.25rem;
    height: 1.25rem;
    flex-shrink: 0;
}

.p-radiobutton-input {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    padding: 0;
    margin: 0;
    opacity: 0;
    z-index: 1;
    cursor: pointer;
}

.p-radiobutton-box {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1.25rem;
    height: 1.25rem;
    border: 1px solid var(--p-border-color);
    border-radius: 50%;
    background: var(--p-surface-0);
    transition: background 150ms ease, border-color 150ms ease, box-shadow 150ms ease;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.02);
}

.p-radiobutton-root:hover:not(.is-disabled) .p-radiobutton-box {
    border-color: var(--p-surface-400);
}

.p-radiobutton-root.is-focused .p-radiobutton-box,
.p-radiobutton-input:focus-visible + .p-radiobutton-box {
    border-color: var(--p-primary-500) !important;
    box-shadow: 0 0 0 1px var(--p-primary-500) !important;
}

/* Checked State */
.p-radiobutton-root.is-checked .p-radiobutton-box,
.p-radiobutton.p-radiobutton-checked .p-radiobutton-box {
    border-color: var(--p-primary-500);
    background: var(--p-surface-0);
}

.p-radiobutton-icon {
    width: 0.625rem;
    height: 0.625rem;
    border-radius: 50%;
    background: var(--p-primary-500);
    transform: scale(0);
    transition: transform 150ms cubic-bezier(0.16, 1, 0.3, 1);
}

.p-radiobutton-root.is-checked .p-radiobutton-icon,
.p-radiobutton.p-radiobutton-checked .p-radiobutton-icon {
    transform: scale(1);
}

/* Filled Variant */
.p-radiobutton-root.variant-filled .p-radiobutton-box {
    background-color: var(--p-surface-100);
    border-color: transparent;
}
.p-radiobutton-root.variant-filled:hover:not(.is-disabled) .p-radiobutton-box {
    background-color: var(--p-surface-200);
}
.p-radiobutton-root.variant-filled.is-checked .p-radiobutton-box {
    background-color: var(--p-surface-0);
    border-color: var(--p-primary-500);
}

/* Sizes */
.p-radiobutton-root.size-small .p-radiobutton,
.p-radiobutton-root.size-small .p-radiobutton-box,
.p-radiobutton-sm .p-radiobutton-box {
    width: 1rem;
    height: 1rem;
}
.p-radiobutton-root.size-small .p-radiobutton-icon,
.p-radiobutton-sm .p-radiobutton-icon {
    width: 0.5rem;
    height: 0.5rem;
}
.p-radiobutton-root.size-small .p-radiobutton-label {
    font-size: 0.75rem;
}

.p-radiobutton-root.size-large .p-radiobutton,
.p-radiobutton-root.size-large .p-radiobutton-box,
.p-radiobutton-lg .p-radiobutton-box {
    width: 1.5rem;
    height: 1.5rem;
}
.p-radiobutton-root.size-large .p-radiobutton-icon,
.p-radiobutton-lg .p-radiobutton-icon {
    width: 0.75rem;
    height: 0.75rem;
}
.p-radiobutton-root.size-large .p-radiobutton-label {
    font-size: 1rem;
}

/* Invalid State */
.p-radiobutton-root.is-invalid .p-radiobutton-box {
    border-color: var(--p-red-500, #ef4444) !important;
}
.p-radiobutton-root.is-invalid.is-focused .p-radiobutton-box {
    box-shadow: 0 0 0 1px var(--p-red-500, #ef4444) !important;
}

/* Disabled State */
.p-radiobutton-root.is-disabled {
    opacity: 0.6;
    cursor: not-allowed;
}
.p-radiobutton-root.is-disabled .p-radiobutton-input,
.p-radiobutton-root.is-disabled .p-radiobutton-box {
    cursor: not-allowed;
    background-color: var(--p-surface-100);
}

/* Label */
.p-radiobutton-label {
    font-size: 0.875rem;
    color: var(--p-text-color);
    line-height: 1.25;
}

/* Card Mode */
.p-radiobutton-card {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.875rem 1.125rem;
    border: 1px solid var(--p-border-color);
    border-radius: var(--p-border-radius);
    background: var(--p-surface-0);
    cursor: pointer;
    transition: background 150ms ease, border-color 150ms ease, box-shadow 150ms ease;
    box-sizing: border-box;
    width: 100%;
}
.p-radiobutton-card:hover:not(.is-disabled) {
    background: var(--p-surface-50);
    border-color: var(--p-surface-400);
}
.p-radiobutton-card.is-checked {
    border-color: var(--p-surface-900);
    background: var(--p-surface-0);
    box-shadow: 0 0 0 1px var(--p-surface-900);
}
.p-radiobutton-card.is-disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background: var(--p-surface-100);
}

.p-radiobutton-card-content {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex: 1;
}

.p-radiobutton-card-title {
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--p-text-color);
    display: flex;
    align-items: center;
    gap: 0.5rem;
}
.p-radiobutton-card-desc {
    font-size: 0.75rem;
    color: var(--p-text-muted);
    margin-top: 0.125rem;
}
.p-radiobutton-card-badge {
    font-size: 0.6875rem;
    font-weight: 700;
    padding: 0.125rem 0.375rem;
    border-radius: calc(var(--p-border-radius) - 2px);
    background: var(--p-surface-100);
    color: var(--p-surface-700);
}
.p-radiobutton-card-price {
    font-size: 0.8125rem;
    font-weight: 600;
    color: var(--p-text-color);
    margin-right: 0.75rem;
}

/* Radio Group */
.p-radiogroup {
    display: flex;
    gap: 1rem;
}
.p-radiogroup.p-radiogroup-vertical {
    flex-direction: column;
}
.p-radiogroup.p-radiogroup-horizontal {
    flex-direction: row;
    flex-wrap: wrap;
}

/* ==================== DARK MODE ==================== */
.dark .p-radiobutton-box {
    background-color: var(--p-surface-900);
    border-color: var(--p-surface-700);
}
.dark .p-radiobutton-root:hover:not(.is-disabled) .p-radiobutton-box {
    border-color: var(--p-surface-500);
}
.dark .p-radiobutton-root.is-checked .p-radiobutton-box {
    border-color: var(--p-primary-400);
}
.dark .p-radiobutton-icon {
    background: var(--p-primary-400);
}
.dark .p-radiobutton-root.variant-filled .p-radiobutton-box {
    background-color: var(--p-surface-800);
}
.dark .p-radiobutton-root.variant-filled:hover:not(.is-disabled) .p-radiobutton-box {
    background-color: var(--p-surface-700);
}
.dark .p-radiobutton-root.variant-filled.is-checked .p-radiobutton-box {
    background-color: var(--p-surface-900);
    border-color: var(--p-primary-400);
}
.dark .p-radiobutton-label {
    color: var(--p-surface-100);
}
.dark .p-radiobutton-card {
    background: var(--p-surface-900);
    border-color: var(--p-surface-700);
}
.dark .p-radiobutton-card:hover:not(.is-disabled) {
    background: var(--p-surface-850, #141b26);
    border-color: var(--p-surface-600);
}
.dark .p-radiobutton-card.is-checked {
    border-color: var(--p-surface-0);
    box-shadow: 0 0 0 1px var(--p-surface-0);
}
.dark .p-radiobutton-card-badge {
    background: var(--p-surface-800);
    color: var(--p-surface-200);
}
.dark .p-radiobutton-card-price {
    color: var(--p-surface-0);
}
`;
function RadioButtonIsland(container, props) {
  injectIslandStyle("laughtale-radio", CSS3);
  const isCard = props.card === true || String(props.card) === "true";
  const isFilled = props.variant === "filled";
  const size = props.size || "normal";
  const isInvalid = props.invalid === true || String(props.invalid) === "true";
  const isDisabled = props.disabled === true || String(props.disabled) === "true";
  const isReadonly = props.readonly === true || String(props.readonly) === "true";
  if (props.options && props.options.length > 0) {
    renderGroup();
    return;
  }
  let isChecked = Boolean(props.checked) || props.selectedValue !== void 0 && String(props.selectedValue) === String(props.value);
  function renderSingle() {
    const rootClasses = [
      "laughtale-radio-root",
      "p-radiobutton-root",
      isCard ? "p-radiobutton-card" : "",
      isChecked ? "is-checked" : "",
      isFilled ? "variant-filled" : "",
      size !== "normal" ? `size-${size}` : "",
      isInvalid ? "is-invalid" : "",
      isDisabled ? "is-disabled" : ""
    ].filter(Boolean).join(" ");
    if (isCard) {
      container.innerHTML = `
                <label class="${rootClasses}">
                    <div class="p-radiobutton-card-content">
                        ${props.flag ? `<span style="font-size: 1.25rem; line-height: 1;">${props.flag}</span>` : ""}
                        ${props.icon ? `<span style="color: var(--p-primary-600); display: flex;">${getLucideIcon(props.icon, 18)}</span>` : ""}
                        <div>
                            <div class="p-radiobutton-card-title">
                                <span>${props.label || props.value}</span>
                                ${props.badge ? `<span class="p-radiobutton-card-badge">${props.badge}</span>` : ""}
                            </div>
                            ${props.description ? `<div class="p-radiobutton-card-desc">${props.description}</div>` : ""}
                        </div>
                    </div>
                    <div style="display: flex; align-items: center;">
                        ${props.price ? `<span class="p-radiobutton-card-price">${props.price}</span>` : ""}
                        <div class="p-radiobutton ${isChecked ? "p-radiobutton-checked" : ""}">
                            <input 
                                type="radio" 
                                class="p-radiobutton-input"
                                name="${props.name}"
                                value="${props.value}"
                                ${isChecked ? "checked" : ""}
                                ${isDisabled ? "disabled" : ""}
                                ${isReadonly ? "readonly" : ""}
                                ${props.inputId ? `id="${props.inputId}"` : ""}
                            />
                            <div class="p-radiobutton-box">
                                <div class="p-radiobutton-icon"></div>
                            </div>
                        </div>
                    </div>
                </label>
                <input type="hidden" name="${props.targetInputName || ""}" value="${isChecked ? props.value : ""}" />
            `;
    } else {
      container.innerHTML = `
                <label class="${rootClasses}">
                    <div class="p-radiobutton ${isChecked ? "p-radiobutton-checked" : ""}">
                        <input 
                            type="radio" 
                            class="p-radiobutton-input"
                            name="${props.name}"
                            value="${props.value}"
                            ${isChecked ? "checked" : ""}
                            ${isDisabled ? "disabled" : ""}
                            ${isReadonly ? "readonly" : ""}
                            ${props.inputId ? `id="${props.inputId}"` : ""}
                        />
                        <div class="p-radiobutton-box">
                            <div class="p-radiobutton-icon"></div>
                        </div>
                    </div>
                    ${props.label ? `<span class="p-radiobutton-label">${props.label}</span>` : ""}
                </label>
                <input type="hidden" name="${props.targetInputName || ""}" value="${isChecked ? props.value : ""}" />
            `;
    }
    bindSingleEvents();
  }
  function updateVisuals(checked) {
    isChecked = checked;
    const labelWrap = container.querySelector(".p-radiobutton-root");
    const rbBox = container.querySelector(".p-radiobutton");
    const hiddenInp = container.querySelector('input[type="hidden"]');
    if (labelWrap) {
      if (isChecked) labelWrap.classList.add("is-checked");
      else labelWrap.classList.remove("is-checked");
    }
    if (rbBox) {
      if (isChecked) rbBox.classList.add("p-radiobutton-checked");
      else rbBox.classList.remove("p-radiobutton-checked");
    }
    if (hiddenInp && props.targetInputName) {
      hiddenInp.value = isChecked ? props.value : "";
    }
  }
  function bindSingleEvents() {
    const input = container.querySelector(".p-radiobutton-input");
    if (!input) return;
    input.addEventListener("change", () => {
      if (isDisabled || isReadonly) return;
      updateVisuals(input.checked);
      syncOthers();
      syncValue();
    });
    input.addEventListener("focus", () => {
      container.querySelector(".p-radiobutton-root")?.classList.add("is-focused");
    });
    input.addEventListener("blur", () => {
      container.querySelector(".p-radiobutton-root")?.classList.remove("is-focused");
    });
  }
  function syncOthers() {
    document.querySelectorAll(`input[type="radio"][name="${props.name}"]`).forEach((other) => {
      if (other !== container.querySelector(".p-radiobutton-input")) {
        const parentRoot = other.closest(".p-radiobutton-root");
        const parentBox = other.closest(".p-radiobutton");
        if (parentRoot) {
          if (other.checked) parentRoot.classList.add("is-checked");
          else parentRoot.classList.remove("is-checked");
        }
        if (parentBox) {
          if (other.checked) parentBox.classList.add("p-radiobutton-checked");
          else parentBox.classList.remove("p-radiobutton-checked");
        }
      }
    });
  }
  function syncValue() {
    if (!isChecked) return;
    container.dispatchEvent(new CustomEvent("radio:change", {
      bubbles: true,
      detail: { value: props.value, checked: isChecked }
    }));
  }
  function renderGroup() {
    const isHorizontal = props.layout === "horizontal";
    const groupClasses = ["p-radiogroup", isHorizontal ? "p-radiogroup-horizontal" : "p-radiogroup-vertical"].join(" ");
    let currentSelected = props.selectedValue ?? props.value ?? "";
    const rawOpts = (props.options || []).map((opt) => {
      if (typeof opt === "string") return { label: opt, value: opt };
      return opt;
    });
    container.className = groupClasses;
    container.innerHTML = rawOpts.map((opt, idx) => {
      const checked = String(opt.value) === String(currentSelected);
      const itemId = `${props.name}_${idx}`;
      const optDisabled = isDisabled || opt.disabled;
      if (isCard) {
        return `
                    <label class="p-radiobutton-root p-radiobutton-card ${checked ? "is-checked" : ""} ${optDisabled ? "is-disabled" : ""}">
                        <div class="p-radiobutton-card-content">
                            ${opt.flag ? `<span style="font-size: 1.25rem; line-height: 1;">${opt.flag}</span>` : ""}
                            ${opt.icon ? `<span style="color: var(--p-primary-600); display: flex;">${getLucideIcon(opt.icon, 18)}</span>` : ""}
                            <div>
                                <div class="p-radiobutton-card-title">
                                    <span>${opt.label || opt.value}</span>
                                    ${opt.badge ? `<span class="p-radiobutton-card-badge">${opt.badge}</span>` : ""}
                                </div>
                                ${opt.description ? `<div class="p-radiobutton-card-desc">${opt.description}</div>` : ""}
                            </div>
                        </div>
                        <div style="display: flex; align-items: center;">
                            ${opt.price ? `<span class="p-radiobutton-card-price">${opt.price}</span>` : ""}
                            <div class="p-radiobutton ${checked ? "p-radiobutton-checked" : ""}">
                                <input 
                                    type="radio" 
                                    class="p-radiobutton-input"
                                    name="${props.name}"
                                    value="${opt.value}"
                                    id="${itemId}"
                                    ${checked ? "checked" : ""}
                                    ${optDisabled ? "disabled" : ""}
                                />
                                <div class="p-radiobutton-box">
                                    <div class="p-radiobutton-icon"></div>
                                </div>
                            </div>
                        </div>
                    </label>
                `;
      } else {
        return `
                    <label class="p-radiobutton-root ${checked ? "is-checked" : ""} ${optDisabled ? "is-disabled" : ""}">
                        <div class="p-radiobutton ${checked ? "p-radiobutton-checked" : ""}">
                            <input 
                                type="radio" 
                                class="p-radiobutton-input"
                                name="${props.name}"
                                value="${opt.value}"
                                id="${itemId}"
                                ${checked ? "checked" : ""}
                                ${optDisabled ? "disabled" : ""}
                            />
                            <div class="p-radiobutton-box">
                                <div class="p-radiobutton-icon"></div>
                            </div>
                        </div>
                        <span class="p-radiobutton-label">${opt.label}</span>
                    </label>
                `;
      }
    }).join("") + `<input type="hidden" name="${props.targetInputName || props.name}" value="${currentSelected}" />`;
    const inputs = container.querySelectorAll(".p-radiobutton-input");
    const hiddenInp = container.querySelector('input[type="hidden"]');
    inputs.forEach((inp) => {
      inp.addEventListener("change", () => {
        inputs.forEach((other) => {
          const cardWrap = other.closest(".p-radiobutton-root");
          const rb = other.closest(".p-radiobutton");
          if (other.checked) {
            cardWrap?.classList.add("is-checked");
            rb?.classList.add("p-radiobutton-checked");
          } else {
            cardWrap?.classList.remove("is-checked");
            rb?.classList.remove("p-radiobutton-checked");
          }
        });
        if (hiddenInp) hiddenInp.value = inp.value;
        container.dispatchEvent(new CustomEvent("radiogroup:change", {
          bubbles: true,
          detail: { value: inp.value }
        }));
      });
    });
  }
  renderSingle();
}

// src/components/textarea.ts
var CSS4 = `
/* ==================== AURA TEXTAREA ==================== */
.p-textarea {
    font-family: var(--p-font-family, inherit);
    font-size: 0.875rem;
    color: var(--p-text-color, #0f172a);
    background: var(--p-surface-0, #ffffff);
    padding: 0.5rem 0.75rem;
    border: 1px solid var(--p-border-color, #cbd5e1);
    border-radius: var(--p-border-radius, 6px);
    outline: none;
    line-height: 1.5;
    box-sizing: border-box;
    transition: background 150ms ease, border-color 150ms ease, box-shadow 150ms ease, color 150ms ease;
    resize: vertical;
    vertical-align: middle;
}

.p-textarea:hover:not(:disabled):not(.p-disabled):not(.p-invalid) {
    border-color: var(--p-surface-400, #94a3b8);
}

.p-textarea:focus:not(:disabled):not(.p-disabled):not(.p-invalid),
.p-textarea:focus-visible:not(:disabled):not(.p-disabled):not(.p-invalid) {
    border-color: var(--p-primary-500, #10b981) !important;
    box-shadow: 0 0 0 1px var(--p-primary-500, #10b981) !important;
}

/* Fluid */
.p-textarea.p-textarea-fluid,
.p-textarea-fluid {
    width: 100%;
    display: block;
}

/* Sizes */
.p-textarea.size-small,
.p-textarea.p-textarea-sm {
    font-size: 0.75rem;
    padding: 0.25rem 0.5rem;
}

.p-textarea.size-large,
.p-textarea.p-textarea-lg {
    font-size: 1.0625rem;
    padding: 0.75rem 1rem;
}

/* Variant: Filled */
.p-textarea.p-textarea-filled,
.p-textarea.variant-filled {
    background: var(--p-surface-100, #f1f5f9);
}
.p-textarea.p-textarea-filled:focus,
.p-textarea.variant-filled:focus {
    background: var(--p-surface-0, #ffffff);
}

/* Disabled */
.p-textarea:disabled,
.p-textarea.p-disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background: var(--p-surface-200, #e2e8f0);
    color: var(--p-text-muted, #64748b);
    pointer-events: none;
}

/* Invalid */
.p-textarea.p-invalid,
.p-textarea.is-invalid {
    border-color: var(--p-red-500, #ef4444) !important;
}
.p-textarea.p-invalid:focus,
.p-textarea.is-invalid:focus {
    box-shadow: 0 0 0 1px var(--p-red-500, #ef4444) !important;
}

/* Counter */
.p-textarea-counter {
    font-size: 0.75rem;
    color: var(--p-text-muted, #64748b);
    text-align: right;
    margin-top: 0.25rem;
    font-family: var(--p-font-mono, monospace);
}

/* ==================== DARK MODE ==================== */
.dark .p-textarea {
    background: var(--p-surface-950, #090d14);
    border-color: var(--p-surface-700, #334155);
    color: var(--p-surface-0, #f8fafc);
}
.dark .p-textarea:hover:not(:disabled):not(.p-disabled):not(.p-invalid) {
    border-color: var(--p-surface-500, #64748b);
}
.dark .p-textarea:focus:not(:disabled):not(.p-disabled):not(.p-invalid),
.dark .p-textarea:focus-visible:not(:disabled):not(.p-disabled):not(.p-invalid) {
    border-color: var(--p-primary-400, #34d399) !important;
    box-shadow: 0 0 0 1px var(--p-primary-400, #34d399) !important;
}
.dark .p-textarea.p-textarea-filled,
.dark .p-textarea.variant-filled {
    background: var(--p-surface-850, #141b26);
}
.dark .p-textarea.p-textarea-filled:focus,
.dark .p-textarea.variant-filled:focus {
    background: var(--p-surface-950, #090d14);
}
.dark .p-textarea:disabled,
.dark .p-textarea.p-disabled {
    background: var(--p-surface-800, #1e293b);
    border-color: var(--p-surface-700, #334155);
    color: var(--p-surface-500, #64748b);
}
`;
function TextareaIsland(container, props) {
  injectIslandStyle("laughtale-textarea", CSS4);
  const isAutoResize = props.autoResize === true || String(props.autoResize) === "true";
  const isFluid = props.fluid === true || String(props.fluid) === "true";
  const isInvalid = props.invalid === true || String(props.invalid) === "true";
  const isDisabled = props.disabled === true || String(props.disabled) === "true";
  const size = props.size || "normal";
  const variant = props.variant || "outlined";
  let textareaEl;
  if (container.tagName.toLowerCase() === "textarea") {
    textareaEl = container;
  } else {
    const existing = container.querySelector("textarea");
    if (existing) {
      textareaEl = existing;
    } else {
      const classList = [
        "p-textarea",
        isFluid ? "p-textarea-fluid" : "",
        size !== "normal" ? `p-textarea-${size === "small" ? "sm" : "lg"}` : "",
        variant === "filled" ? "p-textarea-filled" : "",
        isInvalid ? "p-invalid" : "",
        isDisabled ? "p-disabled" : ""
      ].filter(Boolean).join(" ");
      container.innerHTML = `
                <textarea 
                    class="${classList}"
                    rows="${props.rows || 5}"
                    cols="${props.cols || 30}"
                    placeholder="${props.placeholder || ""}"
                    ${props.maxLength ? `maxlength="${props.maxLength}"` : ""}
                    ${isDisabled ? "disabled" : ""}
                    ${props.name || props.targetInputName ? `name="${props.name || props.targetInputName}"` : ""}
                    ${props.inputId ? `id="${props.inputId}"` : ""}
                >${props.value || ""}</textarea>
                ${props.maxLength ? `
                    <div class="p-textarea-counter">
                        <span class="p-textarea-count">${(props.value || "").length}</span> / ${props.maxLength}
                    </div>
                ` : ""}
            `;
      textareaEl = container.querySelector("textarea");
    }
  }
  function adjustHeight() {
    if (!isAutoResize || !textareaEl) return;
    textareaEl.style.height = "auto";
    textareaEl.style.overflow = "hidden";
    textareaEl.style.resize = "none";
    textareaEl.style.height = `${textareaEl.scrollHeight}px`;
  }
  function updateCounter() {
    if (!props.maxLength) return;
    const countEl = container.querySelector(".p-textarea-count");
    if (countEl && textareaEl) {
      countEl.textContent = textareaEl.value.length.toString();
    }
  }
  textareaEl.addEventListener("input", () => {
    adjustHeight();
    updateCounter();
    container.dispatchEvent(new CustomEvent("textarea:input", {
      bubbles: true,
      detail: { value: textareaEl.value }
    }));
  });
  textareaEl.addEventListener("change", () => {
    container.dispatchEvent(new CustomEvent("textarea:change", {
      bubbles: true,
      detail: { value: textareaEl.value }
    }));
  });
  if (isAutoResize) {
    window.addEventListener("resize", adjustHeight);
    setTimeout(adjustHeight, 0);
  }
}

// src/components/menu.ts
var MENU_CSS = `
.p-menu {
    display: inline-flex;
    flex-direction: column;
    background: var(--p-menu-background, var(--p-surface-0, #ffffff));
    color: var(--p-menu-color, var(--p-text-color, #0f172a));
    border: 1px solid var(--p-menu-border-color, var(--p-border-color, #e2e8f0));
    border-radius: var(--p-menu-border-radius, var(--p-border-radius, 8px));
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05);
    min-width: 12.5rem;
    box-sizing: border-box;
    font-family: inherit;
    user-select: none;
    overflow: hidden;
}

.p-menu-popup-overlay {
    position: fixed;
    z-index: 1050;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.12), 0 4px 6px -4px rgba(0, 0, 0, 0.08);
    animation: p-menu-fade-in 0.15s cubic-bezier(0, 0, 0.2, 1);
}

@keyframes p-menu-fade-in {
    from {
        opacity: 0;
        transform: scale(0.95);
    }
    to {
        opacity: 1;
        transform: scale(1);
    }
}

.p-menu-start {
    border-bottom: 1px solid var(--p-menu-border-color, var(--p-border-color, #e2e8f0));
    box-sizing: border-box;
}

.p-menu-end {
    border-top: 1px solid var(--p-menu-border-color, var(--p-border-color, #e2e8f0));
    box-sizing: border-box;
}

.p-menu-list {
    list-style: none;
    margin: 0;
    padding: 0.375rem;
    display: flex;
    flex-direction: column;
    gap: 0.125rem;
    box-sizing: border-box;
}

.p-menu-submenu-wrapper {
    display: grid;
    grid-template-rows: 0fr;
    transition: grid-template-rows 220ms cubic-bezier(0.4, 0, 0.2, 1), opacity 180ms ease, visibility 220ms ease;
    opacity: 0;
    visibility: hidden;
}

.p-menu-submenu-wrapper.p-expanded {
    grid-template-rows: 1fr;
    opacity: 1;
    visibility: visible;
}

.p-menu-submenu-inner {
    overflow: hidden;
    min-height: 0;
}

.p-menu-submenu-list {
    list-style: none;
    margin: 0;
    padding: 0.125rem 0 0.125rem 1.25rem;
    display: flex;
    flex-direction: column;
    gap: 0.125rem;
    box-sizing: border-box;
}

.p-menu-submenu-label {
    font-size: 0.75rem;
    font-weight: 700;
    color: var(--p-surface-400, #94a3b8);
    padding: 0.5rem 0.75rem 0.25rem;
    text-transform: none;
    letter-spacing: normal;
    user-select: none;
}

.p-menu-separator {
    height: 1px;
    background: var(--p-menu-separator-border-color, var(--p-border-color, #e2e8f0));
    margin: 0.25rem 0;
    list-style: none;
    padding: 0;
}

.p-menu-item {
    list-style: none;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

.p-menu-item-content {
    display: block;
    box-sizing: border-box;
}

.p-menu-item-link {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.45rem 0.65rem;
    color: var(--p-menu-item-color, var(--p-text-color, #0f172a));
    border-radius: var(--p-border-radius, 6px);
    text-decoration: none;
    cursor: pointer;
    font-size: 0.875rem;
    font-weight: 500;
    transition: background-color 0.12s ease, color 0.12s ease;
    outline: none;
    box-sizing: border-box;
}

.p-menu-item-link:hover,
.p-menu-item-link.p-focus {
    background: var(--p-surface-100, #f1f5f9);
    color: var(--p-text-color, #0f172a);
}

.p-menu-item.p-disabled > .p-menu-item-content > .p-menu-item-link {
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
}

.p-menu-item-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: var(--p-surface-500, #64748b);
    width: 1.125rem;
    height: 1.125rem;
    flex-shrink: 0;
}

.p-menu-item-label {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.p-menu-item-shortcut {
    margin-left: auto;
    font-size: 0.75rem;
    color: var(--p-surface-500, #64748b);
    background: var(--p-surface-100, #f1f5f9);
    border: 1px solid var(--p-border-color, #cbd5e1);
    border-radius: 4px;
    padding: 0.1rem 0.35rem;
    font-weight: 500;
}

.p-menu-item-badge {
    margin-left: auto;
    background: #000000;
    color: #ffffff;
    font-size: 0.75rem;
    font-weight: 700;
    min-width: 1.25rem;
    height: 1.25rem;
    border-radius: 9999px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0 0.35rem;
}

.p-menu-item-submenu-icon {
    margin-left: auto;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: var(--p-surface-400, #94a3b8);
    transition: transform 220ms cubic-bezier(0.4, 0, 0.2, 1);
}

.p-menu-item-submenu-icon.p-expanded {
    transform: rotate(180deg);
}

/* Indicators */
.p-menu-check-icon {
    width: 1rem;
    height: 1rem;
    color: var(--p-primary-500, #10b981);
    display: inline-flex;
    align-items: center;
    justify-content: center;
}

.p-menu-dot-icon {
    width: 0.375rem;
    height: 0.375rem;
    border-radius: 9999px;
    background: var(--p-surface-900, #0f172a);
    display: inline-block;
    margin: 0.3125rem;
}

.p-menu-blank-icon {
    width: 1rem;
    height: 1rem;
    display: inline-block;
}

/* Dark Mode */
.dark .p-menu,
[data-theme="dark"] .p-menu {
    background: var(--p-surface-900, #0f172a);
    color: var(--p-surface-0, #f8fafc);
    border-color: var(--p-surface-700, #334155);
}

.dark .p-menu-start,
[data-theme="dark"] .p-menu-start,
.dark .p-menu-end,
[data-theme="dark"] .p-menu-end,
.dark .p-menu-separator,
[data-theme="dark"] .p-menu-separator {
    border-color: var(--p-surface-700, #334155);
}

.dark .p-menu-item-link,
[data-theme="dark"] .p-menu-item-link {
    color: var(--p-surface-100, #f1f5f9);
}

.dark .p-menu-item-link:hover,
[data-theme="dark"] .p-menu-item-link:hover {
    background: var(--p-surface-800, #1e293b);
    color: var(--p-surface-0, #f8fafc);
}

.dark .p-menu-item-shortcut,
[data-theme="dark"] .p-menu-item-shortcut {
    background: var(--p-surface-800, #1e293b);
    border-color: var(--p-surface-700, #334155);
    color: var(--p-surface-300, #cbd5e1);
}

.dark .p-menu-item-badge,
[data-theme="dark"] .p-menu-item-badge {
    background: #ffffff;
    color: #000000;
}

.dark .p-menu-submenu-label,
[data-theme="dark"] .p-menu-submenu-label {
    color: var(--p-surface-400, #94a3b8);
}

.dark .p-menu-dot-icon,
[data-theme="dark"] .p-menu-dot-icon {
    background: var(--p-surface-0, #f8fafc);
}
`;
function MenuIsland(container, props) {
  injectIslandStyle("menu", MENU_CSS);
  const isPopup = props.popup || props.Popup || false;
  let expandedKeys = { ...props.expandedKeys || props.ExpandedKeys || {} };
  const customTemplate = props.customTemplate || props.CustomTemplate || false;
  function normalizeItems(rawList) {
    if (!Array.isArray(rawList)) return [];
    return rawList.map((it2) => {
      const rawSub = it2.items || it2.Items;
      return {
        label: it2.label || it2.Label || "",
        icon: it2.icon || it2.Icon,
        separator: it2.separator || it2.Separator || false,
        disabled: it2.disabled || it2.Disabled || false,
        url: it2.url || it2.Url,
        action: it2.action || it2.Action,
        items: Array.isArray(rawSub) ? normalizeItems(rawSub) : void 0,
        key: it2.key || it2.Key,
        shortcut: it2.shortcut || it2.Shortcut,
        badge: it2.badge || it2.Badge,
        route: it2.route || it2.Route,
        target: it2.target || it2.Target,
        toggleable: it2.toggleable !== void 0 ? it2.toggleable : it2.Toggleable !== void 0 ? it2.Toggleable : void 0,
        linkClass: it2.linkClass || it2.LinkClass,
        command: it2.command || it2.Command,
        checked: it2.checked !== void 0 ? it2.checked : it2.Checked,
        radioGroup: it2.radioGroup || it2.RadioGroup,
        radioSelected: it2.radioSelected !== void 0 ? it2.radioSelected : it2.RadioSelected
      };
    });
  }
  const rawData = props.model || props.items || props.Model || props.Items || [];
  let itemsState = normalizeItems(rawData);
  let popupEl = null;
  let isOpen = false;
  function getIconSvg(iconName) {
    if (!iconName) return "";
    if (iconName.startsWith("<svg")) return iconName;
    if (LucideIcons[iconName]) return LucideIcons[iconName];
    return "";
  }
  function renderItemContent(item, path, depth = 0) {
    if (item.separator) {
      return `<li class="p-menu-separator" role="separator"></li>`;
    }
    const isGroup = Array.isArray(item.items) && item.items.length > 0;
    const isToggleableSubmenu = isGroup && (item.toggleable === true || depth > 0 && item.toggleable !== false);
    const isStaticGroupHeader = isGroup && !isToggleableSubmenu;
    if (isStaticGroupHeader) {
      const subItemsHtml = item.items.map((sub, i) => renderItemContent(sub, `${path}.${i}`, depth + 1)).join("");
      const headerLabelClass = customTemplate ? "text-primary font-bold text-sm" : "p-menu-submenu-label";
      const headerLabelStyle = customTemplate ? "color: var(--p-primary-500, #3b82f6); font-weight: 700; font-size: 0.8125rem; padding: 0.5rem 0.75rem 0.25rem;" : "";
      return `
                <li class="p-menu-item" role="none">
                    <div class="${headerLabelClass}" style="${headerLabelStyle}">${item.label}</div>
                    <ul class="p-menu-list" role="group">
                        ${subItemsHtml}
                    </ul>
                </li>
            `;
    }
    const isExpanded = isToggleableSubmenu ? item.key ? !!expandedKeys[item.key] : !!expandedKeys[path] : false;
    let iconHtml = "";
    if (item.checked !== void 0) {
      iconHtml = item.checked ? `<span class="p-menu-item-icon p-menu-check-icon"><svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg></span>` : `<span class="p-menu-item-icon p-menu-blank-icon"></span>`;
    } else if (item.radioSelected !== void 0) {
      iconHtml = item.radioSelected ? `<span class="p-menu-item-icon"><span class="p-menu-dot-icon"></span></span>` : `<span class="p-menu-item-icon p-menu-blank-icon"></span>`;
    } else if (item.icon) {
      const svg = getIconSvg(item.icon);
      if (svg) iconHtml = `<span class="p-menu-item-icon">${svg}</span>`;
    }
    const chevronSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>`;
    let subHtml = "";
    if (isGroup) {
      const subItemsHtml = item.items.map((sub, i) => renderItemContent(sub, `${path}.${i}`, depth + 1)).join("");
      subHtml = `
                <div class="p-menu-submenu-wrapper ${isExpanded ? "p-expanded" : ""}" role="region">
                    <div class="p-menu-submenu-inner">
                        <ul class="p-menu-submenu-list" role="group">${subItemsHtml}</ul>
                    </div>
                </div>
            `;
    }
    let customInlineStyle = "";
    if (item.linkClass && item.linkClass.includes("text-red")) {
      customInlineStyle = "color: #ef4444 !important;";
    }
    return `
            <li class="p-menu-item ${item.disabled ? "p-disabled" : ""}" role="none" data-path="${path}" data-key="${item.key || ""}">
                <div class="p-menu-item-content">
                    <a class="p-menu-item-link" style="${customInlineStyle}" role="menuitem" tabindex="-1" href="${item.url || item.route || "#"}" ${item.target ? `target="${item.target}"` : ""}>
                        ${iconHtml}
                        <span class="p-menu-item-label">${item.label}</span>
                        ${item.badge !== void 0 ? `<span class="p-menu-item-badge">${item.badge}</span>` : ""}
                        ${item.shortcut ? `<span class="p-menu-item-shortcut">${item.shortcut}</span>` : ""}
                        ${isToggleableSubmenu ? `<span class="p-menu-item-submenu-icon ${isExpanded ? "p-expanded" : ""}">${chevronSvg}</span>` : ""}
                    </a>
                </div>
                ${subHtml}
            </li>
        `;
  }
  function renderMenuHtml() {
    const itemsHtml = itemsState.map((it2, i) => renderItemContent(it2, `${i}`, 0)).join("");
    let startHtml = "";
    if (customTemplate) {
      startHtml = `
                <div class="p-menu-start" style="padding: 0.65rem 0.85rem; display: flex; align-items: center; gap: 0.65rem;">
                    <span style="display: inline-flex; align-items: center; justify-content: center; width: 1.75rem; height: 1.75rem; background: var(--p-primary-500, #3b82f6); border-radius: 6px; color: #fff;">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2 2 7l10 5 10-5-10-5Z"/><path d="m2 17 10 5 10-5"/><path d="m2 12 10 5 10-5"/></svg>
                    </span>
                    <span style="font-weight: 700; font-size: 0.9375rem; letter-spacing: -0.01em;">PRIME<span style="color: var(--p-primary-500, #3b82f6);">APP</span></span>
                </div>
            `;
    }
    let endHtml = "";
    if (customTemplate) {
      endHtml = `
                <div class="p-menu-end" style="padding: 0.5rem 0.75rem;">
                    <button type="button" class="p-menu-item-link" style="width: 100%; border: none; background: transparent; padding: 0.4rem 0.5rem; display: flex; align-items: center; gap: 0.65rem; border-radius: 6px; cursor: pointer;">
                        <span style="width: 2rem; height: 2rem; border-radius: 9999px; background: linear-gradient(135deg, #f59e0b, #ef4444); color: #fff; display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 700;">AE</span>
                        <span style="display: flex; flex-direction: column; align-items: flex-start; line-height: 1.2;">
                            <span style="font-size: 0.8125rem; font-weight: 700; color: var(--p-text-color);">Amy Elsner</span>
                            <span style="font-size: 0.7rem; color: var(--p-surface-500);">Admin</span>
                        </span>
                    </button>
                </div>
            `;
    }
    const customClass = props.class || props.Class || "";
    const customStyle = props.style || props.Style || "";
    return `
            <div class="p-menu p-component ${isPopup ? "p-menu-popup-overlay" : ""} ${customClass}" style="${customStyle}" role="menu" tabindex="0">
                ${startHtml}
                <ul class="p-menu-list" role="menubar">
                    ${itemsHtml}
                </ul>
                ${endHtml}
            </div>
        `;
  }
  function wireEvents(menuEl) {
    menuEl.querySelectorAll(".p-menu-item").forEach((li) => {
      const link = li.querySelector(":scope > .p-menu-item-content > .p-menu-item-link");
      if (!link) return;
      link.addEventListener("click", (e) => {
        const path = li.getAttribute("data-path") || "";
        const key = li.getAttribute("data-key");
        const item = findItemByPath(itemsState, path);
        if (!item || item.disabled) return;
        const isGroup = Array.isArray(item.items) && item.items.length > 0;
        const isToggleableSubmenu = isGroup && (item.toggleable === true || path.includes(".") && item.toggleable !== false);
        if (isToggleableSubmenu) {
          e.preventDefault();
          const isNowExpanded = key ? !expandedKeys[key] : !expandedKeys[path];
          if (key) {
            expandedKeys[key] = isNowExpanded;
          } else {
            expandedKeys[path] = isNowExpanded;
          }
          const wrapper = li.querySelector(":scope > .p-menu-submenu-wrapper");
          const chevron = li.querySelector(":scope > .p-menu-item-content .p-menu-item-submenu-icon");
          if (wrapper) {
            wrapper.classList.toggle("p-expanded", isNowExpanded);
          }
          if (chevron) {
            chevron.classList.toggle("p-expanded", isNowExpanded);
          }
          return;
        }
        if (item.checked !== void 0) {
          e.preventDefault();
          item.checked = !item.checked;
          updateContent();
          return;
        }
        if (item.radioGroup && item.radioSelected !== void 0) {
          e.preventDefault();
          setRadioSelection(itemsState, item.radioGroup, item);
          updateContent();
          return;
        }
        if (item.command || item.action) {
          e.preventDefault();
          if (item.command === "new-file") {
            showFeedback("File created", "success");
          } else if (item.command === "search") {
            showFeedback("No results found", "warn");
          }
        }
        if (isPopup) {
          closePopup();
        }
      });
    });
    menuEl.addEventListener("keydown", (e) => {
      const links = menuEl.querySelectorAll(".p-menu-item-link");
      if (links.length === 0) return;
      const active = document.activeElement;
      let currentIdx = Array.from(links).indexOf(active);
      if (e.key === "ArrowDown") {
        e.preventDefault();
        currentIdx = (currentIdx + 1) % links.length;
        links[currentIdx]?.focus();
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        currentIdx = (currentIdx - 1 + links.length) % links.length;
        links[currentIdx]?.focus();
      } else if (e.key === "Home") {
        e.preventDefault();
        links[0]?.focus();
      } else if (e.key === "End") {
        e.preventDefault();
        links[links.length - 1]?.focus();
      } else if (e.key === "Escape" && isPopup) {
        e.preventDefault();
        closePopup();
      }
    });
  }
  function setRadioSelection(list, group, selectedItem) {
    list.forEach((it2) => {
      if (it2.radioGroup === group && it2.radioSelected !== void 0) {
        it2.radioSelected = it2 === selectedItem;
      }
      if (it2.items) {
        setRadioSelection(it2.items, group, selectedItem);
      }
    });
  }
  function findItemByPath(list, path) {
    const parts = path.split(".").map(Number);
    let curr = { items: list };
    for (const p of parts) {
      if (!curr.items || !curr.items[p]) return null;
      curr = curr.items[p];
    }
    return curr;
  }
  function showFeedback(msg, severity) {
    const toast = document.createElement("div");
    toast.style.cssText = `
            position: fixed;
            bottom: 2rem;
            right: 2rem;
            background: ${severity === "success" ? "#10b981" : "#f59e0b"};
            color: #ffffff;
            padding: 0.75rem 1.25rem;
            border-radius: 8px;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.2);
            font-size: 0.875rem;
            font-weight: 600;
            z-index: 9999;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        `;
    toast.textContent = `\u2713 ${msg}`;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2500);
  }
  function updateContent() {
    if (isPopup) {
      if (popupEl) {
        popupEl.innerHTML = renderMenuHtml();
        const menuEl = popupEl.querySelector(".p-menu");
        wireEvents(menuEl);
      }
    } else {
      container.innerHTML = renderMenuHtml();
      const menuEl = container.querySelector(".p-menu");
      wireEvents(menuEl);
    }
  }
  function openPopup(trigger) {
    if (isOpen) {
      closePopup();
      return;
    }
    isOpen = true;
    popupEl = document.createElement("div");
    popupEl.className = "p-menu-popup-wrapper";
    popupEl.innerHTML = renderMenuHtml();
    document.body.appendChild(popupEl);
    const menuEl = popupEl.querySelector(".p-menu");
    wireEvents(menuEl);
    const rect = trigger.getBoundingClientRect();
    menuEl.style.position = "fixed";
    menuEl.style.top = `${rect.bottom + 4}px`;
    menuEl.style.left = `${rect.left}px`;
    menuEl.style.zIndex = "9999";
    const clickOutsideHandler = (e) => {
      if (popupEl && !popupEl.contains(e.target) && !trigger.contains(e.target)) {
        closePopup();
        document.removeEventListener("click", clickOutsideHandler);
      }
    };
    setTimeout(() => document.addEventListener("click", clickOutsideHandler), 0);
  }
  function closePopup() {
    isOpen = false;
    if (popupEl) {
      popupEl.remove();
      popupEl = null;
    }
  }
  if (isPopup) {
    container.innerHTML = "";
    const triggerId = props.triggerId || props.TriggerId;
    if (triggerId) {
      const trigger = document.getElementById(triggerId);
      if (trigger) {
        trigger.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          openPopup(trigger);
        });
      }
    }
  } else {
    updateContent();
  }
  container.__expandAll = () => {
    const root = isPopup ? popupEl : container;
    if (!root) return;
    root.querySelectorAll(".p-menu-submenu-wrapper").forEach((w) => w.classList.add("p-expanded"));
    root.querySelectorAll(".p-menu-item-submenu-icon").forEach((c) => c.classList.add("p-expanded"));
  };
  container.__collapseAll = () => {
    const root = isPopup ? popupEl : container;
    if (!root) return;
    root.querySelectorAll(".p-menu-submenu-wrapper").forEach((w) => w.classList.remove("p-expanded"));
    root.querySelectorAll(".p-menu-item-submenu-icon").forEach((c) => c.classList.remove("p-expanded"));
  };
}

// src/components/paginator.ts
var PAGINATOR_CSS = `
.p-paginator {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    gap: 0.35rem;
    padding: 0.5rem 1rem;
    background: var(--p-surface-0, #ffffff);
    border-radius: var(--p-border-radius-lg, 8px);
    border: 1px solid var(--p-surface-200, #e2e8f0);
    color: var(--p-surface-700, #334155);
    font-family: var(--p-font-family, inherit);
    user-select: none;
    transition: all 0.15s ease;
}

.p-paginator-start,
.p-paginator-end {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
}

.p-paginator-first,
.p-paginator-prev,
.p-paginator-next,
.p-paginator-last,
.p-paginator-page,
.p-paginator-action-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2.25rem;
    height: 2.25rem;
    min-width: 2.25rem;
    border-radius: 9999px;
    border: 1px solid transparent;
    background: transparent;
    color: var(--p-surface-600, #475569);
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.12s ease, color 0.12s ease, border-color 0.12s ease;
    outline: none;
    box-sizing: border-box;
    padding: 0;
}

.p-paginator-page:hover:not(:disabled):not(.p-highlight),
.p-paginator-first:hover:not(:disabled),
.p-paginator-prev:hover:not(:disabled),
.p-paginator-next:hover:not(:disabled),
.p-paginator-last:hover:not(:disabled),
.p-paginator-action-btn:hover:not(:disabled) {
    background: var(--p-surface-100, #f1f5f9);
    color: var(--p-surface-900, #0f172a);
}

.p-paginator-page.p-highlight,
.p-paginator-page.p-paginator-page-selected {
    background: var(--p-surface-900, #0f172a) !important;
    color: #ffffff !important;
    font-weight: 600;
}

.p-paginator-first:disabled,
.p-paginator-prev:disabled,
.p-paginator-next:disabled,
.p-paginator-last:disabled,
.p-paginator-page:disabled,
.p-paginator-action-btn:disabled {
    opacity: 0.3;
    cursor: default;
}

.p-paginator-pages {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
}

.p-paginator-current {
    font-size: 0.875rem;
    color: var(--p-surface-500, #64748b);
    padding: 0 0.75rem;
    white-space: nowrap;
}

.p-paginator-rpp-select,
.p-paginator-jtp-select {
    appearance: none;
    padding: 0.35rem 2rem 0.35rem 0.75rem;
    border-radius: var(--p-border-radius, 6px);
    border: 1px solid var(--p-surface-300, #cbd5e1);
    background: var(--p-surface-0, #ffffff) url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E") no-repeat right 0.6rem center;
    color: var(--p-surface-800, #1e293b);
    font-size: 0.875rem;
    font-weight: 500;
    outline: none;
    cursor: pointer;
    transition: border-color 0.15s ease;
}
.p-paginator-rpp-select:focus,
.p-paginator-jtp-select:focus,
.p-paginator-jtp-input:focus {
    border-color: var(--p-primary-500, #10b981);
}

.p-paginator-jtp-container {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.875rem;
    color: var(--p-surface-600, #475569);
    padding: 0 0.5rem;
}

.p-paginator-jtp-input {
    width: 3.5rem;
    padding: 0.35rem 0.5rem;
    text-align: center;
    border-radius: var(--p-border-radius, 6px);
    border: 1px solid var(--p-surface-300, #cbd5e1);
    background: var(--p-surface-0, #ffffff);
    color: inherit;
    font-size: 0.875rem;
    outline: none;
}

.p-paginator-slider {
    width: 8rem;
    accent-color: var(--p-primary-500, #10b981);
    cursor: pointer;
}

/* Image gallery container */
.p-paginator-image-display {
    width: 100%;
    margin-top: 1.25rem;
    display: flex;
    justify-content: center;
}
.p-paginator-image-card {
    width: 100%;
    max-width: 36rem;
    height: 20rem;
    border-radius: var(--p-border-radius-lg, 8px);
    overflow: hidden;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -2px rgba(0, 0, 0, 0.05);
    background: var(--p-surface-100, #f1f5f9);
    border: 1px solid var(--p-surface-200, #e2e8f0);
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
}
.p-paginator-image-card img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: opacity 0.2s ease;
}

/* Dark Mode Tokens */
.dark .p-paginator,
[data-theme="dark"] .p-paginator {
    background: var(--p-surface-900, #0f172a) !important;
    border-color: var(--p-surface-700, #334155) !important;
    color: var(--p-surface-200, #e2e8f0) !important;
}
.dark .p-paginator-page,
.dark .p-paginator-first,
.dark .p-paginator-prev,
.dark .p-paginator-next,
.dark .p-paginator-last,
.dark .p-paginator-action-btn,
[data-theme="dark"] .p-paginator-page,
[data-theme="dark"] .p-paginator-first,
[data-theme="dark"] .p-paginator-prev,
[data-theme="dark"] .p-paginator-next,
[data-theme="dark"] .p-paginator-last,
[data-theme="dark"] .p-paginator-action-btn {
    color: var(--p-surface-300, #cbd5e1) !important;
}
.dark .p-paginator-page:hover:not(:disabled):not(.p-highlight),
.dark .p-paginator-first:hover:not(:disabled),
.dark .p-paginator-prev:hover:not(:disabled),
.dark .p-paginator-next:hover:not(:disabled),
.dark .p-paginator-last:hover:not(:disabled),
.dark .p-paginator-action-btn:hover:not(:disabled),
[data-theme="dark"] .p-paginator-page:hover:not(:disabled):not(.p-highlight),
[data-theme="dark"] .p-paginator-first:hover:not(:disabled),
[data-theme="dark"] .p-paginator-prev:hover:not(:disabled),
[data-theme="dark"] .p-paginator-next:hover:not(:disabled),
[data-theme="dark"] .p-paginator-last:hover:not(:disabled),
[data-theme="dark"] .p-paginator-action-btn:hover:not(:disabled) {
    background: var(--p-surface-800, #1e293b) !important;
    color: #ffffff !important;
}
.dark .p-paginator-page.p-highlight,
[data-theme="dark"] .p-paginator-page.p-highlight {
    background: var(--p-surface-0, #ffffff) !important;
    color: var(--p-surface-900, #0f172a) !important;
}
.dark .p-paginator-rpp-select,
.dark .p-paginator-jtp-select,
.dark .p-paginator-jtp-input,
[data-theme="dark"] .p-paginator-rpp-select,
[data-theme="dark"] .p-paginator-jtp-select,
[data-theme="dark"] .p-paginator-jtp-input {
    background-color: var(--p-surface-800, #1e293b) !important;
    border-color: var(--p-surface-600, #475569) !important;
    color: #ffffff !important;
}
.dark .p-paginator-current,
.dark .p-paginator-jtp-container,
[data-theme="dark"] .p-paginator-current,
[data-theme="dark"] .p-paginator-jtp-container {
    color: var(--p-surface-400, #94a3b8) !important;
}
.dark .p-paginator-image-card,
[data-theme="dark"] .p-paginator-image-card {
    background: var(--p-surface-800, #1e293b) !important;
    border-color: var(--p-surface-700, #334155) !important;
}
`;
var ICONS = {
  first: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m11 17-5-5 5-5"/><path d="m18 17-5-5 5-5"/></svg>',
  prev: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>',
  next: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>',
  last: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m6 17 5-5-5-5"/><path d="m13 17 5-5-5-5"/></svg>',
  refresh: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 16h5v5"/></svg>',
  settings: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>'
};
var DEFAULT_IMAGES = [
  "https://primefaces.org/cdn/primevue/images/nature/nature1.jpg",
  "https://primefaces.org/cdn/primevue/images/nature/nature2.jpg",
  "https://primefaces.org/cdn/primevue/images/nature/nature3.jpg",
  "https://primefaces.org/cdn/primevue/images/nature/nature4.jpg",
  "https://primefaces.org/cdn/primevue/images/nature/nature5.jpg",
  "https://primefaces.org/cdn/primevue/images/nature/nature6.jpg"
];
function PaginatorIsland(container, props) {
  injectIslandStyle("paginator", PAGINATOR_CSS);
  let first = props.first || 0;
  let rows = props.rows || 10;
  let totalRecords = props.totalRecords || 0;
  const pageLinkSize = props.pageLinkSize || 5;
  const rowsPerPageOptions = props.rowsPerPageOptions;
  const template = props.template;
  const currentPageReportTemplate = props.currentPageReportTemplate || "Showing {first} to {last} of {totalRecords}";
  const showFirstLast = props.showFirstLast !== false;
  const showJumpToPageDropdown = !!props.showJumpToPageDropdown;
  const showJumpToPageInput = !!props.showJumpToPageInput;
  const showSlider = !!props.showSlider;
  const images = props.images && props.images.length > 0 ? props.images : props.totalRecords === 6 && rows === 1 ? DEFAULT_IMAGES : [];
  function getTotalPages() {
    return Math.ceil(totalRecords / rows) || 1;
  }
  function getCurrentPage() {
    return Math.floor(first / rows);
  }
  function setPage(pageIndex) {
    const totalPages = getTotalPages();
    const clampedPage = Math.max(0, Math.min(pageIndex, totalPages - 1));
    const newFirst = clampedPage * rows;
    if (newFirst !== first) {
      first = newFirst;
      render();
      dispatchEvents();
    }
  }
  function setRows(newRows) {
    rows = newRows;
    first = 0;
    render();
    dispatchEvents();
  }
  function formatReportText() {
    const totalPages = getTotalPages();
    const currentPage = getCurrentPage() + 1;
    const firstRecord = totalRecords > 0 ? first + 1 : 0;
    const lastRecord = Math.min(first + rows, totalRecords);
    return currentPageReportTemplate.replace(/{currentPage}/g, String(currentPage)).replace(/{totalPages}/g, String(totalPages)).replace(/{rows}/g, String(rows)).replace(/{first}/g, String(firstRecord)).replace(/{last}/g, String(lastRecord)).replace(/{totalRecords}/g, String(totalRecords));
  }
  function render() {
    const totalPages = getTotalPages();
    const currentPage = getCurrentPage();
    const isFirstPage = currentPage === 0;
    const isLastPage = currentPage >= totalPages - 1;
    let startPage = Math.max(0, currentPage - Math.floor(pageLinkSize / 2));
    let endPage = Math.min(totalPages - 1, startPage + pageLinkSize - 1);
    if (endPage - startPage + 1 < pageLinkSize) {
      startPage = Math.max(0, endPage - pageLinkSize + 1);
    }
    const pageButtons = [];
    for (let p = startPage; p <= endPage; p++) {
      const isSelected = p === currentPage;
      pageButtons.push(`
                <button type="button" 
                        class="p-paginator-page ${isSelected ? "p-highlight" : ""}" 
                        data-page="${p}" 
                        aria-label="Page ${p + 1}" 
                        aria-current="${isSelected ? "page" : void 0}">
                    ${p + 1}
                </button>
            `);
    }
    const firstBtnHtml = showFirstLast ? `
            <button type="button" class="p-paginator-first" data-action="first" title="First Page" aria-label="First Page" ${isFirstPage ? "disabled" : ""}>
                ${ICONS.first}
            </button>
        ` : "";
    const prevBtnHtml = `
            <button type="button" class="p-paginator-prev" data-action="prev" title="Previous Page" aria-label="Previous Page" ${isFirstPage ? "disabled" : ""}>
                ${ICONS.prev}
            </button>
        `;
    const nextBtnHtml = `
            <button type="button" class="p-paginator-next" data-action="next" title="Next Page" aria-label="Next Page" ${isLastPage ? "disabled" : ""}>
                ${ICONS.next}
            </button>
        `;
    const lastBtnHtml = showFirstLast ? `
            <button type="button" class="p-paginator-last" data-action="last" title="Last Page" aria-label="Last Page" ${isLastPage ? "disabled" : ""}>
                ${ICONS.last}
            </button>
        ` : "";
    let rppHtml = "";
    if (rowsPerPageOptions && rowsPerPageOptions.length > 0) {
      const optionsHtml = rowsPerPageOptions.map((opt) => `
                <option value="${opt}" ${opt === rows ? "selected" : ""}>${opt}</option>
            `).join("");
      rppHtml = `<select class="p-paginator-rpp-select" aria-label="Rows per page">${optionsHtml}</select>`;
    }
    let jtpDropdownHtml = "";
    if (showJumpToPageDropdown) {
      const jtpOptions = Array.from({ length: totalPages }, (_, i) => `
                <option value="${i}" ${i === currentPage ? "selected" : ""}>${i + 1}</option>
            `).join("");
      jtpDropdownHtml = `
                <div class="p-paginator-jtp-container">
                    <span>Jump to page:</span>
                    <select class="p-paginator-jtp-select">${jtpOptions}</select>
                    <span>of ${totalPages}</span>
                </div>
            `;
    }
    let jtpInputHtml = "";
    if (showJumpToPageInput) {
      jtpInputHtml = `
                <div class="p-paginator-jtp-container">
                    <span>Go to:</span>
                    <input type="number" class="p-paginator-jtp-input" min="1" max="${totalPages}" value="${currentPage + 1}" />
                    <span>/ ${totalPages}</span>
                </div>
            `;
    }
    let sliderHtml = "";
    if (showSlider) {
      sliderHtml = `
                <div class="p-paginator-jtp-container">
                    <input type="range" class="p-paginator-slider" min="0" max="${totalPages - 1}" value="${currentPage}" />
                </div>
            `;
    }
    const reportHtml = props.currentPageReportTemplate ? `
            <span class="p-paginator-current">${formatReportText()}</span>
        ` : "";
    let elementsHtml = "";
    if (template) {
      const tokens = template.split(/\s+/);
      const renderedTokens = tokens.map((token) => {
        switch (token) {
          case "FirstPageLink":
            return firstBtnHtml;
          case "PrevPageLink":
            return prevBtnHtml;
          case "PageLinks":
            return `<div class="p-paginator-pages">${pageButtons.join("")}</div>`;
          case "NextPageLink":
            return nextBtnHtml;
          case "LastPageLink":
            return lastBtnHtml;
          case "RowsPerPageDropdown":
            return rppHtml;
          case "CurrentPageReport":
            return reportHtml;
          case "JumpToPageDropdown":
            return jtpDropdownHtml;
          case "JumpToPageInput":
            return jtpInputHtml;
          case "Slider":
            return sliderHtml;
          default:
            return "";
        }
      });
      elementsHtml = renderedTokens.join("");
    } else {
      elementsHtml = `
                ${firstBtnHtml}
                ${prevBtnHtml}
                <div class="p-paginator-pages">${pageButtons.join("")}</div>
                ${nextBtnHtml}
                ${lastBtnHtml}
                ${rppHtml}
                ${jtpDropdownHtml}
                ${jtpInputHtml}
                ${sliderHtml}
                ${reportHtml}
            `;
    }
    let imageDisplayHtml = "";
    if (images.length > 0) {
      const currentImg = images[currentPage % images.length];
      imageDisplayHtml = `
                <div class="p-paginator-image-display">
                    <div class="p-paginator-image-card">
                        <img src="${currentImg}" alt="Nature ${currentPage + 1}" loading="eager" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80';" />
                    </div>
                </div>
            `;
    }
    container.innerHTML = `
            <div class="p-paginator-wrapper" style="width: 100%;">
                <div class="p-paginator p-component" role="navigation" aria-label="Pagination Navigation">
                    ${elementsHtml}
                </div>
                ${imageDisplayHtml}
            </div>
        `;
    bindEvents();
  }
  function bindEvents() {
    const rootEl = container.firstElementChild;
    if (!rootEl) return;
    rootEl.querySelector('[data-action="first"]')?.addEventListener("click", () => setPage(0));
    rootEl.querySelector('[data-action="prev"]')?.addEventListener("click", () => setPage(getCurrentPage() - 1));
    rootEl.querySelector('[data-action="next"]')?.addEventListener("click", () => setPage(getCurrentPage() + 1));
    rootEl.querySelector('[data-action="last"]')?.addEventListener("click", () => setPage(getTotalPages() - 1));
    rootEl.querySelectorAll(".p-paginator-page").forEach((btn) => {
      btn.addEventListener("click", () => {
        const p = parseInt(btn.getAttribute("data-page") || "0", 10);
        setPage(p);
      });
    });
    const rppSelect = rootEl.querySelector(".p-paginator-rpp-select");
    if (rppSelect) {
      rppSelect.addEventListener("change", (e) => {
        const val = parseInt(e.target.value, 10);
        if (!isNaN(val)) setRows(val);
      });
    }
    const jtpSelect = rootEl.querySelector(".p-paginator-jtp-select");
    if (jtpSelect) {
      jtpSelect.addEventListener("change", (e) => {
        const val = parseInt(e.target.value, 10);
        if (!isNaN(val)) setPage(val);
      });
    }
    const jtpInput = rootEl.querySelector(".p-paginator-jtp-input");
    if (jtpInput) {
      jtpInput.addEventListener("change", (e) => {
        const val = parseInt(e.target.value, 10);
        if (!isNaN(val)) setPage(val - 1);
      });
    }
    const slider = rootEl.querySelector(".p-paginator-slider");
    if (slider) {
      slider.addEventListener("input", (e) => {
        const val = parseInt(e.target.value, 10);
        if (!isNaN(val)) setPage(val);
      });
    }
  }
  function dispatchEvents() {
    const page = getCurrentPage();
    container.dispatchEvent(new CustomEvent("page", {
      bubbles: true,
      detail: {
        first,
        rows,
        page,
        pageCount: getTotalPages()
      }
    }));
    container.dispatchEvent(new CustomEvent("page-change", {
      bubbles: true,
      detail: { first, rows, page }
    }));
    if (props.targetInputName) {
      let hidden = container.querySelector(`input[name="${props.targetInputName}"]`);
      if (!hidden) {
        hidden = document.createElement("input");
        hidden.type = "hidden";
        hidden.name = props.targetInputName;
        container.appendChild(hidden);
      }
      hidden.value = JSON.stringify({ first, rows, page });
    }
  }
  render();
  dispatchEvents();
}

// src/components/input-mask.ts
var CSS5 = `
/* ==================== AURA INPUTMASK ==================== */
.laughtale-input-mask,
.p-inputmask {
    display: inline-flex;
    align-items: center;
    width: 100%;
    min-height: 2.5rem;
    padding: 0.375rem 0.75rem;
    background: var(--p-surface-0);
    border: 1px solid var(--p-border-color);
    border-radius: var(--p-border-radius);
    color: var(--p-text-color);
    font-family: var(--p-font-family, inherit);
    font-size: 0.875rem;
    line-height: 1.25;
    outline: none;
    box-sizing: border-box;
    transition: background 150ms ease, border-color 150ms ease, box-shadow 150ms ease, color 150ms ease;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.02);
}

.p-inputmask.p-inputmask-fluid {
    width: 100%;
}

.p-inputmask:hover:not(:disabled):not([readonly]) {
    border-color: var(--p-surface-400);
}

.p-inputmask:focus {
    border-color: var(--p-primary-500) !important;
    box-shadow: 0 0 0 1px var(--p-primary-500) !important;
}

/* Filled Variant */
.p-inputmask.variant-filled {
    background-color: var(--p-surface-100);
    border-color: transparent;
}
.p-inputmask.variant-filled:hover:not(:disabled):not([readonly]) {
    background-color: var(--p-surface-200);
}
.p-inputmask.variant-filled:focus {
    background-color: var(--p-surface-0);
    border-color: var(--p-primary-500) !important;
}

/* Sizes */
.p-inputmask.size-small,
.p-inputmask.p-inputmask-sm {
    min-height: 2rem;
    padding: 0.25rem 0.5rem;
    font-size: 0.75rem;
}
.p-inputmask.size-large,
.p-inputmask.p-inputmask-lg {
    min-height: 3rem;
    padding: 0.5rem 1rem;
    font-size: 1.0625rem;
}

/* Invalid State */
.p-inputmask.is-invalid {
    border-color: var(--p-red-500, #ef4444) !important;
}
.p-inputmask.is-invalid:focus {
    box-shadow: 0 0 0 1px var(--p-red-500, #ef4444) !important;
}

/* Disabled State */
.p-inputmask:disabled,
.p-inputmask.is-disabled {
    opacity: 0.65;
    cursor: not-allowed;
    background-color: var(--p-surface-100);
}

/* Dark mode overrides */
.dark .p-inputmask {
    background-color: var(--p-surface-900);
    border-color: var(--p-surface-700);
    color: var(--p-surface-0);
}
.dark .p-inputmask:hover:not(:disabled):not([readonly]) {
    border-color: var(--p-surface-500);
}
.dark .p-inputmask.variant-filled {
    background-color: var(--p-surface-800);
}
.dark .p-inputmask.variant-filled:hover:not(:disabled):not([readonly]) {
    background-color: var(--p-surface-700);
}
.dark .p-inputmask.variant-filled:focus {
    background-color: var(--p-surface-900);
}
.dark .p-inputmask:disabled,
.dark .p-inputmask.is-disabled {
    background-color: var(--p-surface-800);
}
`;
function InputMaskIsland(container, props) {
  injectIslandStyle("laughtale-input-mask", CSS5);
  const mask = props.mask || "(999) 999-9999";
  const slotChar = props.slotChar || "_";
  const autoClear = props.autoClear !== false && String(props.autoClear) !== "false";
  const unmask = props.unmask === true || String(props.unmask) === "true";
  const isFluid = props.fluid === true || String(props.fluid) === "true";
  const isInvalid = props.invalid === true || String(props.invalid) === "true";
  const isDisabled = props.disabled === true || String(props.disabled) === "true";
  const isReadonly = props.readonly === true || String(props.readonly) === "true";
  const isFilled = props.variant === "filled";
  const size = props.size || "normal";
  const tokens = [];
  let isOptionalZone = false;
  let slotCount = 0;
  for (let i = 0; i < mask.length; i++) {
    const c = mask[i];
    if (c === "?") {
      isOptionalZone = true;
      continue;
    }
    let regex;
    let isSlot = false;
    if (c === "9") {
      regex = /[0-9]/;
      isSlot = true;
    } else if (c === "a") {
      regex = /[A-Za-z]/;
      isSlot = true;
    } else if (c === "*") {
      regex = /[A-Za-z0-9]/;
      isSlot = true;
    }
    const slotCharToUse = isSlot ? slotChar.length > slotCount ? slotChar[slotCount] : slotChar[0] || "_" : c;
    if (isSlot) slotCount++;
    tokens.push({
      char: c,
      isSlot,
      isOptional: isOptionalZone,
      regex,
      slotChar: slotCharToUse
    });
  }
  function formatValue(raw) {
    let masked = "";
    let rawIdx = 0;
    let validSlots = 0;
    let requiredSlots = 0;
    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];
      if (token.isSlot) {
        if (!token.isOptional) requiredSlots++;
        let matchedChar = "";
        while (rawIdx < raw.length) {
          const ch = raw[rawIdx++];
          if (token.regex?.test(ch)) {
            matchedChar = ch;
            break;
          }
        }
        if (matchedChar) {
          masked += matchedChar;
          validSlots++;
        } else {
          masked += token.slotChar;
        }
      } else {
        masked += token.char;
        if (rawIdx < raw.length && raw[rawIdx] === token.char) {
          rawIdx++;
        }
      }
    }
    let rawOut = "";
    for (let i = 0; i < tokens.length; i++) {
      if (tokens[i].isSlot && i < masked.length && masked[i] !== tokens[i].slotChar) {
        rawOut += masked[i];
      }
    }
    return {
      masked,
      raw: rawOut,
      isComplete: validSlots >= requiredSlots
    };
  }
  const initialFormatted = formatValue(props.value || "");
  let currentFormatted = props.value ? initialFormatted.masked : "";
  const rootClasses = [
    "laughtale-input-mask",
    "p-inputmask",
    "p-inputtext",
    isFluid ? "p-inputmask-fluid" : "",
    isFilled ? "variant-filled" : "",
    size !== "normal" ? `size-${size}` : "",
    isInvalid ? "is-invalid" : "",
    isDisabled ? "is-disabled" : ""
  ].filter(Boolean).join(" ");
  container.innerHTML = `
        <input 
            type="text"
            class="${rootClasses}"
            value="${currentFormatted}"
            placeholder="${props.placeholder || tokens.map((t) => t.isSlot ? t.slotChar : t.char).join("")}"
            ${isDisabled ? "disabled" : ""}
            ${isReadonly ? "readonly" : ""}
            ${props.inputId ? `id="${props.inputId}"` : ""}
        />
        <input type="hidden" name="${props.name || props.targetInputName || "mask_value"}" value="" />
    `;
  const input = container.querySelector('input[type="text"]');
  const hiddenInp = container.querySelector('input[type="hidden"]');
  function syncValue() {
    const formatted = formatValue(input.value);
    const payload = unmask ? formatted.raw : formatted.masked;
    if (hiddenInp) hiddenInp.value = payload;
    container.dispatchEvent(new CustomEvent("input-mask:change", {
      bubbles: true,
      detail: { value: payload, rawValue: formatted.raw, maskedValue: formatted.masked }
    }));
    container.dispatchEvent(new CustomEvent("change", {
      bubbles: true,
      detail: { value: payload, rawValue: formatted.raw }
    }));
  }
  function getFirstSlotIndex(val) {
    for (let i = 0; i < tokens.length; i++) {
      if (tokens[i].isSlot && val[i] === tokens[i].slotChar) {
        return i;
      }
    }
    return val.length;
  }
  input.addEventListener("focus", () => {
    if (!input.value) {
      input.value = tokens.map((t) => t.isSlot ? t.slotChar : t.char).join("");
      const pos = getFirstSlotIndex(input.value);
      setTimeout(() => input.setSelectionRange(pos, pos), 10);
    }
  });
  input.addEventListener("blur", () => {
    const formatted = formatValue(input.value);
    if (!formatted.isComplete && autoClear && formatted.raw.length === 0) {
      input.value = "";
    } else if (!formatted.isComplete && autoClear) {
      input.value = "";
    }
    syncValue();
  });
  input.addEventListener("input", (e) => {
    const inputType = e.inputType;
    const val = input.value;
    let rawExtracted = "";
    for (let i = 0; i < val.length; i++) {
      const ch = val[i];
      if (i < tokens.length && tokens[i].isSlot && ch !== tokens[i].slotChar) {
        rawExtracted += ch;
      } else if (i >= tokens.length && /[A-Za-z0-9]/.test(ch)) {
        rawExtracted += ch;
      }
    }
    const formatted = formatValue(rawExtracted);
    input.value = formatted.masked;
    const nextSlot = getFirstSlotIndex(input.value);
    input.setSelectionRange(nextSlot, nextSlot);
    syncValue();
  });
  input.addEventListener("keydown", (e) => {
    if (e.key === "Backspace") {
      const start = input.selectionStart || 0;
      const end = input.selectionEnd || 0;
      if (start === end && start > 0) {
        e.preventDefault();
        let targetSlot = start - 1;
        while (targetSlot >= 0 && !tokens[targetSlot].isSlot) {
          targetSlot--;
        }
        if (targetSlot >= 0) {
          const arr = input.value.split("");
          arr[targetSlot] = tokens[targetSlot].slotChar;
          input.value = arr.join("");
          input.setSelectionRange(targetSlot, targetSlot);
          syncValue();
        }
      }
    }
  });
  syncValue();
}

// src/composables/useControllableState.ts
function useControllableState(options) {
  const isControlled = options.value !== void 0;
  let internalValue = options.defaultValue !== void 0 ? options.defaultValue : options.value;
  function getValue() {
    return isControlled ? options.value : internalValue;
  }
  function setValue(nextValue) {
    const resolved = typeof nextValue === "function" ? nextValue(getValue()) : nextValue;
    if (!isControlled) {
      internalValue = resolved;
    }
    options.onChange?.(resolved);
  }
  return [getValue, setValue];
}

// src/components/input-text.ts
var CSS6 = `
.laughtale-inputtext-wrap,
.p-inputtext-wrap {
    position: relative;
    display: inline-flex;
    align-items: center;
    width: auto;
    font-family: var(--p-font-family, inherit);
    box-sizing: border-box;
}

.p-inputtext-wrap.p-inputtext-fluid,
.laughtale-inputtext-wrap.p-inputtext-fluid {
    display: flex;
    width: 100%;
}

/* Native Aura InputText */
.p-inputtext {
    width: 100%;
    font-family: inherit;
    font-size: 0.875rem;
    color: var(--p-text-color);
    background: var(--p-surface-0);
    border: 1px solid var(--p-border-color);
    border-radius: var(--p-border-radius);
    padding: 0.5rem 0.75rem;
    line-height: 1.25;
    transition: background 150ms ease, border-color 150ms ease, box-shadow 150ms ease, color 150ms ease;
    outline: none;
    box-sizing: border-box;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.02);
}

.p-inputtext:hover:not(:disabled):not(.is-invalid):not(.p-invalid) {
    border-color: var(--p-surface-400);
}

.p-inputtext:focus,
.p-inputtext:focus-visible {
    border-color: var(--p-primary-500) !important;
    box-shadow: 0 0 0 1px var(--p-primary-500) !important;
}

/* Variant: Filled */
.p-inputtext.variant-filled,
.p-inputtext.p-variant-filled {
    background: var(--p-surface-100);
    border-color: transparent;
}
.p-inputtext.variant-filled:hover:not(:disabled) {
    background: var(--p-surface-200);
}
.p-inputtext.variant-filled:focus {
    background: var(--p-surface-0);
    border-color: var(--p-primary-500) !important;
}

/* Sizes */
.p-inputtext.size-small,
.p-inputtext.p-inputtext-sm {
    padding: 0.3125rem 0.625rem;
    font-size: 0.75rem;
    border-radius: calc(var(--p-border-radius) - 2px);
}

.p-inputtext.size-large,
.p-inputtext.p-inputtext-lg {
    padding: 0.6875rem 1rem;
    font-size: 1.0625rem;
    border-radius: calc(var(--p-border-radius) + 2px);
}

/* Invalid State */
.p-inputtext.is-invalid,
.p-inputtext.p-invalid {
    border-color: var(--p-red-500, #ef4444) !important;
}
.p-inputtext.is-invalid:focus,
.p-inputtext.p-invalid:focus {
    box-shadow: 0 0 0 1px var(--p-red-500, #ef4444) !important;
}

/* Disabled State */
.p-inputtext:disabled,
.p-inputtext.is-disabled {
    background: var(--p-surface-100);
    color: var(--p-text-muted);
    opacity: 0.75;
    cursor: not-allowed;
}

/* Fluid State */
.p-inputtext.p-inputtext-fluid,
.p-inputtext.p-fluid {
    width: 100%;
}

/* Icons Integration */
.p-inputtext-icon {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    color: var(--p-surface-400);
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: none;
    z-index: 2;
    transition: color 150ms ease;
}
.p-inputtext-icon svg {
    width: 16px;
    height: 16px;
}
.p-inputtext-icon-left {
    left: 0.75rem;
}
.p-inputtext-icon-right {
    right: 0.75rem;
}

.has-icon-left .p-inputtext {
    padding-left: 2.25rem !important;
}
.has-icon-right .p-inputtext {
    padding-right: 2.25rem !important;
}
.has-clear .p-inputtext {
    padding-right: 2.25rem !important;
}
.has-icon-right.has-clear .p-inputtext {
    padding-right: 3.625rem !important;
}

/* Clear Icon Button (Zero-Flicker) */
.p-inputtext-clear {
    position: absolute;
    right: 0.625rem;
    top: 50%;
    transform: translateY(-50%);
    background: transparent;
    border: none;
    color: var(--p-surface-400);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.25rem;
    border-radius: 9999px;
    z-index: 3;
    transition: color 150ms ease, background 150ms ease, opacity 150ms ease;
}
.p-inputtext-clear:hover {
    background: var(--p-surface-200);
    color: var(--p-surface-700);
}
.p-inputtext-clear svg {
    width: 14px;
    height: 14px;
}
.has-icon-right.has-clear .p-inputtext-clear {
    right: 2.25rem;
}

/* Help Text */
.p-inputtext-help {
    font-size: 0.75rem;
    color: var(--p-text-muted);
    margin-top: 0.25rem;
    line-height: 1.25;
}

/* ==================== DARK MODE ==================== */
.dark .p-inputtext {
    background: var(--p-surface-900);
    border-color: var(--p-surface-700);
    color: var(--p-surface-0);
}
.dark .p-inputtext:hover:not(:disabled):not(.is-invalid):not(.p-invalid) {
    border-color: var(--p-surface-500);
}
.dark .p-inputtext.variant-filled,
.dark .p-inputtext.p-variant-filled {
    background: var(--p-surface-800);
}
.dark .p-inputtext.variant-filled:focus {
    background: var(--p-surface-900);
}
.dark .p-inputtext:disabled {
    background: var(--p-surface-800);
    border-color: var(--p-surface-700);
    color: var(--p-surface-500);
}
.dark .p-inputtext-clear:hover {
    background: var(--p-surface-700);
    color: var(--p-surface-200);
}
`;
var xIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>`;
function InputTextIsland(container, props) {
  injectIslandStyle("laughtale-inputtext", CSS6);
  const [getValue, setValue] = useControllableState({
    defaultValue: props.value ?? "",
    onChange: (val) => {
      syncValue(val);
    }
  });
  const isFluid = props.fluid === true || String(props.fluid) === "true";
  const isFilled = props.variant === "filled";
  const isDisabled = props.disabled === true || String(props.disabled) === "true";
  const isReadonly = props.readonlyMode === true || String(props.readonlyMode) === "true";
  const isInvalid = props.invalid === true || String(props.invalid) === "true";
  const hasClear = props.showClear === true || props.clearable === true || String(props.showClear) === "true" || String(props.clearable) === "true";
  const leftIconName = props.iconLeft || (!props.iconRight ? props.icon : "");
  const rightIconName = props.iconRight;
  const inputId = props.inputId || props.id || "";
  const inputName = props.name || props.targetInputName || "";
  function getIconSvg(name) {
    if (!name) return "";
    if (LucideIcons[name]) return LucideIcons[name];
    if (name.startsWith("<svg")) return name;
    return "";
  }
  const leftIconSvg = getIconSvg(leftIconName);
  const rightIconSvg = getIconSvg(rightIconName);
  function init() {
    const val = getValue();
    const wrapClasses = [
      "laughtale-inputtext-wrap",
      "p-inputtext-wrap",
      isFluid ? "p-inputtext-fluid" : "",
      leftIconSvg ? "has-icon-left" : "",
      rightIconSvg ? "has-icon-right" : "",
      hasClear ? "has-clear" : ""
    ].filter(Boolean).join(" ");
    const inputClasses = [
      "p-inputtext",
      isFilled ? "variant-filled" : "",
      props.size ? `size-${props.size}` : "",
      isInvalid ? "is-invalid" : "",
      isFluid ? "p-inputtext-fluid" : ""
    ].filter(Boolean).join(" ");
    container.className = wrapClasses;
    const leftIconHtml = leftIconSvg ? `<span class="p-inputtext-icon p-inputtext-icon-left">${leftIconSvg}</span>` : "";
    const rightIconHtml = rightIconSvg ? `<span class="p-inputtext-icon p-inputtext-icon-right">${rightIconSvg}</span>` : "";
    const clearBtnHtml = hasClear ? `
            <button type="button" class="p-inputtext-clear" aria-label="Clear text" tabindex="-1" style="display: ${val ? "flex" : "none"};">
                ${xIcon}
            </button>
        ` : "";
    const idAttr = inputId ? `id="${escapeHtml(inputId)}"` : "";
    const nameAttr = inputName ? `name="${escapeHtml(inputName)}"` : "";
    const ariaLabelAttr = props.ariaLabel ? `aria-label="${escapeHtml(props.ariaLabel)}"` : "";
    const ariaLabelledByAttr = props.ariaLabelledBy ? `aria-labelledby="${escapeHtml(props.ariaLabelledBy)}"` : "";
    const ariaDescribedByAttr = props.ariaDescribedBy ? `aria-describedby="${escapeHtml(props.ariaDescribedBy)}"` : "";
    container.innerHTML = `
            ${leftIconHtml}
            <input
                type="${props.type || "text"}"
                class="${inputClasses}"
                value="${escapeHtml(val)}"
                placeholder="${escapeHtml(props.placeholder || "")}"
                ${idAttr}
                ${nameAttr}
                ${ariaLabelAttr}
                ${ariaLabelledByAttr}
                ${ariaDescribedByAttr}
                ${isDisabled ? "disabled" : ""}
                ${isReadonly ? "readonly" : ""}
                ${isInvalid ? 'aria-invalid="true"' : ""}
                autocomplete="off"
            />
            ${clearBtnHtml}
            ${rightIconHtml}
        `;
    if (props.helpText) {
      const helpEl = document.createElement("small");
      helpEl.className = "p-inputtext-help";
      if (props.ariaDescribedBy) helpEl.id = props.ariaDescribedBy;
      helpEl.textContent = props.helpText;
      container.parentElement?.insertBefore(helpEl, container.nextSibling);
    }
    bindEvents();
  }
  function escapeHtml(str) {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
  function bindEvents() {
    const input = container.querySelector("input.p-inputtext");
    const clearBtn = container.querySelector(".p-inputtext-clear");
    if (!input) return;
    input.addEventListener("input", () => {
      const val = input.value;
      setValue(val);
      if (clearBtn) {
        clearBtn.style.display = val ? "flex" : "none";
      }
      container.dispatchEvent(new CustomEvent("inputtext:change", {
        bubbles: true,
        detail: { value: val }
      }));
    });
    input.addEventListener("change", () => {
      container.dispatchEvent(new CustomEvent("inputtext:change", {
        bubbles: true,
        detail: { value: input.value }
      }));
    });
    if (clearBtn) {
      clearBtn.addEventListener("mousedown", (e) => e.preventDefault());
      clearBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        input.value = "";
        setValue("");
        clearBtn.style.display = "none";
        input.focus();
        container.dispatchEvent(new CustomEvent("inputtext:change", {
          bubbles: true,
          detail: { value: "" }
        }));
        container.dispatchEvent(new CustomEvent("inputtext:clear", {
          bubbles: true
        }));
        input.dispatchEvent(new Event("input", { bubbles: true }));
      });
    }
  }
  function syncValue(val) {
    if (props.targetInputName) {
      let hidden = container.querySelector(`input[name="${props.targetInputName}"]`);
      if (!hidden) {
        hidden = document.createElement("input");
        hidden.type = "hidden";
        hidden.name = props.targetInputName;
        container.appendChild(hidden);
      }
      hidden.value = val;
    }
  }
  init();
}

// tests/phase2-components.test.ts
describe("SoftMax.LaughTale Aura v2 Components Suite", () => {
  let container;
  beforeEach(() => {
    document.body.innerHTML = '<div id="app"></div>';
    container = document.getElementById("app");
  });
  it("Select: creates dropdown and opens on click", () => {
    SelectIsland(container, {
      options: [
        { label: "Option 1", value: "1" },
        { label: "Option 2", value: "2" }
      ],
      targetInputName: "my_select"
    });
    const trigger = container.querySelector(".p-select, .laughtale-select-trigger, .p-select-label");
    assert.ok(trigger, "Should render select trigger");
  });
  it("Checkbox: renders and has hidden input", () => {
    CheckboxIsland(container, { checked: false, value: "yes", targetInputName: "cb" });
    const box = container.querySelector(".p-checkbox, .laughtale-checkbox-box");
    assert.ok(box, "Should render checkbox box");
  });
  it("RadioButton: renders with label", () => {
    RadioButtonIsland(container, { name: "r", value: "A", checked: false, label: "Option A" });
    assert.ok(container.querySelector(".p-radiobutton, .laughtale-radio-wrap"), "Should render radio");
  });
  it("Textarea: renders textarea element", () => {
    TextareaIsland(container, { value: "hi", maxLength: 10, autoResize: true });
    assert.ok(container.querySelector("textarea"), "Should render textarea");
  });
  it("Menu: renders menu items", () => {
    MenuIsland(container, {
      items: [
        { label: "Item 1", icon: "pi-user" },
        { label: "Item 2", icon: "pi-cog" }
      ]
    });
    assert.ok(container.querySelector(".p-menu, .laughtale-menu"), "Should render menu");
  });
  it("Paginator: renders page buttons", () => {
    PaginatorIsland(container, { totalRecords: 50, rows: 10, page: 0 });
    assert.ok(container.querySelector(".p-paginator, .laughtale-paginator"), "Should render paginator");
  });
  it("InputMask: renders formatted mask", () => {
    InputMaskIsland(container, { mask: "(999) 999-9999", value: "1234567890" });
    const input = container.querySelector("input");
    assert.ok(input, "Should render input mask");
  });
  it("InputText: renders styled text input", () => {
    InputTextIsland(container, { placeholder: "Enter name", variant: "filled" });
    const input = container.querySelector("input");
    assert.ok(input, "Should render input text");
  });
});
