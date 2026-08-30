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

// tests/components.test.ts
import { describe, it, beforeEach } from "node:test";
import assert from "node:assert";

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

// src/components/input-number.ts
var CSS = `
.laughtale-inputnumber,
.p-inputnumber {
    display: inline-flex;
    align-items: stretch;
    position: relative;
    font-family: var(--p-font-family, inherit);
    background: var(--p-surface-0);
    border: 1px solid var(--p-border-color);
    border-radius: var(--p-border-radius);
    transition: border-color 150ms ease, box-shadow 150ms ease, background 150ms ease;
    box-sizing: border-box;
    min-height: 2.5rem;
    overflow: hidden;
    vertical-align: middle;
}

.p-inputnumber.p-inputnumber-fluid {
    display: flex;
    width: 100%;
}

.p-inputnumber:hover:not(.is-disabled) {
    border-color: var(--p-surface-400);
}

.p-inputnumber:focus-within:not(.is-disabled) {
    border-color: var(--p-primary-500) !important;
    box-shadow: 0 0 0 1px var(--p-primary-500) !important;
}

.p-inputnumber.is-disabled {
    background: var(--p-surface-100);
    opacity: 0.75;
    cursor: not-allowed;
}

/* Variant: Filled */
.p-inputnumber.variant-filled {
    background: var(--p-surface-100);
    border-color: transparent;
}
.p-inputnumber.variant-filled:focus-within {
    background: var(--p-surface-0);
    border-color: var(--p-primary-500) !important;
}

/* Invalid State */
.p-inputnumber.is-invalid {
    border-color: var(--p-red-500, #ef4444) !important;
}
.p-inputnumber.is-invalid:focus-within {
    box-shadow: 0 0 0 1px var(--p-red-500, #ef4444) !important;
}

/* Sizes */
.p-inputnumber.size-small {
    min-height: 2rem;
}
.p-inputnumber.size-small .p-inputnumber-input {
    font-size: 0.75rem;
    padding: 0.25rem 0.5rem;
}
.p-inputnumber.size-large {
    min-height: 3rem;
}
.p-inputnumber.size-large .p-inputnumber-input {
    font-size: 1rem;
    padding: 0.75rem 1rem;
}

/* Inner Input */
.p-inputnumber-input {
    flex: 1 1 auto;
    width: 100%;
    min-width: 0;
    font-family: inherit;
    font-size: 0.875rem;
    color: var(--p-text-color);
    background: transparent;
    border: none;
    outline: none;
    padding: 0.5rem 0.75rem;
    box-sizing: border-box;
    font-variant-numeric: tabular-nums;
    height: 100%;
}
.p-inputnumber-input:disabled {
    color: var(--p-text-muted);
    cursor: not-allowed;
}

/* Clear Icon */
.p-inputnumber-clear-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: var(--p-text-muted);
    cursor: pointer;
    border: none;
    background: transparent;
    padding: 0 0.5rem;
    transition: color 150ms ease;
}
.p-inputnumber-clear-icon:hover {
    color: var(--p-text-color);
}
.p-inputnumber-clear-icon svg {
    width: 14px;
    height: 14px;
}

/* ==================== BUTTONS ==================== */

/* Shared Button Styles */
.p-inputnumber-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: var(--p-surface-100);
    color: var(--p-surface-600);
    border: none;
    cursor: pointer;
    user-select: none;
    -webkit-user-select: none;
    transition: background 150ms ease, color 150ms ease;
    padding: 0;
    box-sizing: border-box;
}
.p-inputnumber-button:hover:not(:disabled) {
    background: var(--p-surface-200);
    color: var(--p-surface-900);
}
.p-inputnumber-button:active:not(:disabled) {
    background: var(--p-surface-300);
}
.p-inputnumber-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}
.p-inputnumber-button svg {
    width: 12px;
    height: 12px;
    display: block;
}

/* Layout 1: Stacked (Default) */
.p-inputnumber-button-group {
    display: flex;
    flex-direction: column;
    width: 2.25rem;
    border-left: 1px solid var(--p-border-color);
    background: var(--p-surface-100);
    flex-shrink: 0;
}
.p-inputnumber:focus-within .p-inputnumber-button-group {
    border-left-color: var(--p-primary-500);
}
.p-inputnumber-stacked .p-inputnumber-button-up {
    flex: 1;
    border-bottom: 1px solid var(--p-border-color);
}
.p-inputnumber-stacked:focus-within .p-inputnumber-button-up {
    border-bottom-color: var(--p-primary-500);
}
.p-inputnumber-stacked .p-inputnumber-button-down {
    flex: 1;
}

/* Layout 2: Horizontal */
.p-inputnumber-horizontal .p-inputnumber-button-down {
    width: 2.5rem;
    border-right: 1px solid var(--p-border-color);
    flex-shrink: 0;
}
.p-inputnumber-horizontal:focus-within .p-inputnumber-button-down {
    border-right-color: var(--p-primary-500);
}
.p-inputnumber-horizontal .p-inputnumber-input {
    text-align: center;
}
.p-inputnumber-horizontal .p-inputnumber-button-up {
    width: 2.5rem;
    border-left: 1px solid var(--p-border-color);
    flex-shrink: 0;
}
.p-inputnumber-horizontal:focus-within .p-inputnumber-button-up {
    border-left-color: var(--p-primary-500);
}

/* Layout 3: Vertical */
.p-inputnumber-vertical {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    width: auto;
    min-height: auto;
}
.p-inputnumber-vertical .p-inputnumber-button-up {
    width: 100%;
    height: 2rem;
    border-bottom: 1px solid var(--p-border-color);
}
.p-inputnumber-vertical:focus-within .p-inputnumber-button-up {
    border-bottom-color: var(--p-primary-500);
}
.p-inputnumber-vertical .p-inputnumber-input {
    text-align: center;
    width: 3.5rem;
    height: 2.5rem;
}
.p-inputnumber-vertical .p-inputnumber-button-down {
    width: 100%;
    height: 2rem;
    border-top: 1px solid var(--p-border-color);
}
.p-inputnumber-vertical:focus-within .p-inputnumber-button-down {
    border-top-color: var(--p-primary-500);
}

/* ==================== DARK MODE ==================== */
.dark .laughtale-inputnumber,
.dark .p-inputnumber {
    background: var(--p-surface-900);
    border-color: var(--p-surface-700);
}
.dark .p-inputnumber:hover:not(.is-disabled) {
    border-color: var(--p-surface-600);
}
.dark .p-inputnumber.variant-filled {
    background: var(--p-surface-800);
}
.dark .p-inputnumber.variant-filled:focus-within {
    background: var(--p-surface-900);
}
.dark .p-inputnumber-input {
    color: var(--p-surface-0);
}
.dark .p-inputnumber-button-group,
.dark .p-inputnumber-button {
    background: var(--p-surface-800);
    color: var(--p-surface-400);
}
.dark .p-inputnumber:focus-within .p-inputnumber-button-group,
.dark .p-inputnumber:focus-within .p-inputnumber-button-up,
.dark .p-inputnumber:focus-within .p-inputnumber-button-down {
    border-color: var(--p-primary-500);
}
.dark .p-inputnumber-button:hover:not(:disabled) {
    background: var(--p-surface-700);
    color: var(--p-surface-100);
}
.dark .p-inputnumber-button:active:not(:disabled) {
    background: var(--p-surface-600);
}
`;
function InputNumberIsland(container, props) {
  injectIslandStyle("laughtale-inputnumber", CSS);
  let rawValue = props.value !== void 0 && props.value !== null ? Number(props.value) : null;
  const step = props.step !== void 0 ? Number(props.step) : 1;
  const min = props.min !== void 0 ? Number(props.min) : void 0;
  const max = props.max !== void 0 ? Number(props.max) : void 0;
  const isCurrency = props.mode === "currency";
  const currency = props.currency || "USD";
  const currencyDisplay = props.currencyDisplay || "symbol";
  const locale = props.locale || void 0;
  const useGrouping = props.useGrouping !== false && String(props.useGrouping) !== "false";
  const buttonLayout = props.buttonLayout || "stacked";
  const showButtons = props.showButtons === true || String(props.showButtons) === "true";
  const isFluid = props.fluid === true || String(props.fluid) === "true";
  const isInvalid = props.invalid === true || String(props.invalid) === "true";
  const isFilled = props.variant === "filled";
  const isDisabled = props.disabled === true || String(props.disabled) === "true";
  const showClear = props.showClear === true || String(props.showClear) === "true";
  let minFractionDigits = props.minFractionDigits !== void 0 ? Number(props.minFractionDigits) : void 0;
  let maxFractionDigits = props.maxFractionDigits !== void 0 ? Number(props.maxFractionDigits) : void 0;
  if (minFractionDigits === void 0 && maxFractionDigits === void 0) {
    if (isCurrency) {
      minFractionDigits = currency === "JPY" ? 0 : 2;
      maxFractionDigits = currency === "JPY" ? 0 : 2;
    } else {
      minFractionDigits = 0;
      maxFractionDigits = 20;
    }
  }
  function formatNumber(val) {
    if (val === null || isNaN(val)) return "";
    let formatted = "";
    try {
      if (isCurrency) {
        const formatter = new Intl.NumberFormat(locale, {
          style: "currency",
          currency,
          currencyDisplay,
          useGrouping,
          minimumFractionDigits: minFractionDigits,
          maximumFractionDigits: maxFractionDigits
        });
        formatted = formatter.format(val);
      } else {
        const formatter = new Intl.NumberFormat(locale, {
          style: "decimal",
          useGrouping,
          minimumFractionDigits: minFractionDigits,
          maximumFractionDigits: maxFractionDigits
        });
        formatted = formatter.format(val);
      }
    } catch {
      formatted = val.toString();
    }
    if (props.prefix && !formatted.startsWith(props.prefix)) {
      formatted = `${props.prefix}${formatted}`;
    }
    if (props.suffix && !formatted.endsWith(props.suffix)) {
      formatted = `${formatted}${props.suffix}`;
    }
    return formatted;
  }
  function parseRaw(str) {
    if (!str || !str.trim()) return null;
    let clean = str;
    if (props.prefix) {
      clean = clean.replace(props.prefix, "");
    }
    if (props.suffix) {
      clean = clean.replace(props.suffix, "");
    }
    clean = clean.replace(/[^\d.,-]/g, "").trim();
    if (clean.indexOf(",") > -1 && clean.indexOf(".") === -1) {
      clean = clean.replace(",", ".");
    } else if (clean.indexOf(",") > -1 && clean.indexOf(".") > -1) {
      if (clean.lastIndexOf(",") > clean.lastIndexOf(".")) {
        clean = clean.replace(/\./g, "").replace(",", ".");
      } else {
        clean = clean.replace(/,/g, "");
      }
    }
    const parsed = parseFloat(clean);
    return isNaN(parsed) ? null : parsed;
  }
  function render() {
    container.innerHTML = "";
    container.className = "laughtale-inputnumber p-inputnumber";
    if (isFluid) container.classList.add("p-inputnumber-fluid");
    if (isFilled) container.classList.add("variant-filled");
    if (props.size) container.classList.add(`size-${props.size}`);
    if (isInvalid) container.classList.add("is-invalid");
    if (isDisabled) container.classList.add("is-disabled");
    if (showButtons) container.classList.add(`p-inputnumber-${buttonLayout}`);
    const inputIdAttr = props.inputId ? `id="${props.inputId}"` : "";
    const placeholderAttr = props.placeholder ? `placeholder="${props.placeholder}"` : "";
    const disabledAttr = isDisabled ? "disabled" : "";
    const formattedVal = formatNumber(rawValue);
    const upIcon = `<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m18 15-6-6-6 6"/></svg>`;
    const downIcon = `<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>`;
    const plusIcon = `<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>`;
    const minusIcon = `<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/></svg>`;
    const clearIcon = `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>`;
    let html = "";
    if (showButtons && buttonLayout === "horizontal") {
      html += `
                <button type="button" class="p-inputnumber-button p-inputnumber-button-down" tabindex="-1" ${disabledAttr} aria-label="Decrement">
                    ${minusIcon}
                </button>
            `;
    } else if (showButtons && buttonLayout === "vertical") {
      html += `
                <button type="button" class="p-inputnumber-button p-inputnumber-button-up" tabindex="-1" ${disabledAttr} aria-label="Increment">
                    ${plusIcon}
                </button>
            `;
    }
    html += `
            <input type="text"
                class="p-inputnumber-input ${props.inputClass || ""}"
                ${inputIdAttr}
                ${placeholderAttr}
                ${disabledAttr}
                value="${formattedVal}"
                role="spinbutton"
                aria-valuenow="${rawValue ?? ""}"
                ${min !== void 0 ? `aria-valuemin="${min}"` : ""}
                ${max !== void 0 ? `aria-valuemax="${max}"` : ""}
                ${isInvalid ? 'aria-invalid="true"' : ""}
                autocomplete="off"
            />
        `;
    if (showClear && rawValue !== null && !isDisabled) {
      html += `
                <button type="button" class="p-inputnumber-clear-icon" aria-label="Clear value" tabindex="-1">
                    ${clearIcon}
                </button>
            `;
    }
    if (showButtons) {
      if (buttonLayout === "stacked") {
        html += `
                    <div class="p-inputnumber-button-group">
                        <button type="button" class="p-inputnumber-button p-inputnumber-button-up" tabindex="-1" ${disabledAttr} aria-label="Increment">
                            ${upIcon}
                        </button>
                        <button type="button" class="p-inputnumber-button p-inputnumber-button-down" tabindex="-1" ${disabledAttr} aria-label="Decrement">
                            ${downIcon}
                        </button>
                    </div>
                `;
      } else if (buttonLayout === "horizontal") {
        html += `
                    <button type="button" class="p-inputnumber-button p-inputnumber-button-up" tabindex="-1" ${disabledAttr} aria-label="Increment">
                        ${plusIcon}
                    </button>
                `;
      } else if (buttonLayout === "vertical") {
        html += `
                    <button type="button" class="p-inputnumber-button p-inputnumber-button-down" tabindex="-1" ${disabledAttr} aria-label="Decrement">
                        ${minusIcon}
                    </button>
                `;
      }
    }
    container.innerHTML = html;
    bindEvents();
  }
  function bindEvents() {
    const inputEl = container.querySelector(".p-inputnumber-input");
    const clearBtn = container.querySelector(".p-inputnumber-clear-icon");
    const upBtn = container.querySelector(".p-inputnumber-button-up");
    const downBtn = container.querySelector(".p-inputnumber-button-down");
    inputEl.addEventListener("blur", () => {
      const parsed = parseRaw(inputEl.value);
      setValue(parsed);
      inputEl.value = formatNumber(rawValue);
    });
    inputEl.addEventListener("input", () => {
      const parsed = parseRaw(inputEl.value);
      rawValue = parsed;
      syncTargetInput();
    });
    inputEl.addEventListener("keydown", (e) => {
      if (isDisabled) return;
      if (e.key === "ArrowUp") {
        e.preventDefault();
        stepUp();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        stepDown();
      } else if (e.key === "Home" && min !== void 0) {
        e.preventDefault();
        setValue(min);
        inputEl.value = formatNumber(rawValue);
      } else if (e.key === "End" && max !== void 0) {
        e.preventDefault();
        setValue(max);
        inputEl.value = formatNumber(rawValue);
      } else if (e.key === "Enter") {
        const parsed = parseRaw(inputEl.value);
        setValue(parsed);
        inputEl.value = formatNumber(rawValue);
      }
    });
    upBtn?.addEventListener("mousedown", (e) => {
      e.preventDefault();
    });
    upBtn?.addEventListener("click", (e) => {
      e.preventDefault();
      stepUp();
    });
    downBtn?.addEventListener("mousedown", (e) => {
      e.preventDefault();
    });
    downBtn?.addEventListener("click", (e) => {
      e.preventDefault();
      stepDown();
    });
    clearBtn?.addEventListener("mousedown", (e) => {
      e.preventDefault();
    });
    clearBtn?.addEventListener("click", (e) => {
      e.preventDefault();
      setValue(null);
      inputEl.value = "";
      inputEl.focus();
    });
  }
  function stepUp() {
    let current = rawValue ?? 0;
    let next = current + step;
    if (max !== void 0 && next > max) next = max;
    setValue(next);
    const inputEl = container.querySelector(".p-inputnumber-input");
    if (inputEl) inputEl.value = formatNumber(rawValue);
  }
  function stepDown() {
    let current = rawValue ?? 0;
    let next = current - step;
    if (min !== void 0 && next < min) next = min;
    setValue(next);
    const inputEl = container.querySelector(".p-inputnumber-input");
    if (inputEl) inputEl.value = formatNumber(rawValue);
  }
  function setValue(val) {
    if (val !== null) {
      if (min !== void 0 && val < min) val = min;
      if (max !== void 0 && val > max) val = max;
    }
    rawValue = val;
    syncTargetInput();
    container.dispatchEvent(new CustomEvent("inputnumber:change", {
      bubbles: true,
      detail: { value: rawValue }
    }));
  }
  function syncTargetInput() {
    if (props.targetInputName) {
      let hidden = container.querySelector(`input[name="${props.targetInputName}"]`);
      if (!hidden) {
        hidden = document.createElement("input");
        hidden.type = "hidden";
        hidden.name = props.targetInputName;
        container.appendChild(hidden);
      }
      hidden.value = rawValue !== null ? rawValue.toString() : "";
    }
  }
  render();
  syncTargetInput();
}

// src/components/input-otp.ts
var CSS2 = `
.laughtale-input-otp,
.p-inputotp {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    font-family: var(--p-font-family, inherit);
    box-sizing: border-box;
}

.p-inputotp.p-inputotp-grouped {
    gap: 0;
}

/* Individual Digit Cell */
.p-inputotp-input {
    width: 2.75rem;
    height: 3.25rem;
    font-family: inherit;
    font-size: 1.25rem;
    font-weight: 700;
    text-align: center;
    color: var(--p-text-color);
    background: var(--p-surface-0);
    border: 1px solid var(--p-border-color);
    border-radius: var(--p-border-radius);
    outline: none;
    transition: border-color 150ms ease, box-shadow 150ms ease, background 150ms ease;
    box-sizing: border-box;
    font-variant-numeric: tabular-nums;
    padding: 0;
}

.p-inputotp-input:hover:not(:disabled) {
    border-color: var(--p-surface-400);
}

.p-inputotp-input:focus {
    border-color: var(--p-primary-500) !important;
    box-shadow: 0 0 0 1px var(--p-primary-500) !important;
    z-index: 2;
    position: relative;
}

.p-inputotp-input:disabled {
    background: var(--p-surface-100);
    color: var(--p-text-muted);
    cursor: not-allowed;
    opacity: 0.75;
}

/* Variant: Filled */
.p-inputotp.variant-filled .p-inputotp-input {
    background: var(--p-surface-100);
    border-color: transparent;
}
.p-inputotp.variant-filled .p-inputotp-input:focus {
    background: var(--p-surface-0);
    border-color: var(--p-primary-500) !important;
}

/* Sizes */
.p-inputotp.size-small .p-inputotp-input {
    width: 2rem;
    height: 2.5rem;
    font-size: 1rem;
    font-weight: 600;
}
.p-inputotp.size-large .p-inputotp-input {
    width: 3.25rem;
    height: 3.75rem;
    font-size: 1.5rem;
    font-weight: 700;
}

/* Invalid State */
.p-inputotp.is-invalid .p-inputotp-input {
    border-color: var(--p-red-500, #ef4444) !important;
}
.p-inputotp.is-invalid .p-inputotp-input:focus {
    box-shadow: 0 0 0 1px var(--p-red-500, #ef4444) !important;
}

/* Grouped Layout with Joined Borders */
.p-inputotp-group {
    display: inline-flex;
    align-items: center;
}
.p-inputotp-group .p-inputotp-input:first-child {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
}
.p-inputotp-group .p-inputotp-input:not(:first-child):not(:last-child) {
    border-radius: 0;
    margin-left: -1px;
}
.p-inputotp-group .p-inputotp-input:last-child {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    margin-left: -1px;
}

/* Separator between Groups */
.p-inputotp-separator {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin: 0 0.75rem;
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--p-text-muted);
    user-select: none;
}

/* ==================== DARK MODE ==================== */
.dark .p-inputotp-input {
    background: var(--p-surface-900);
    border-color: var(--p-surface-700);
    color: var(--p-surface-0);
}
.dark .p-inputotp-input:hover:not(:disabled) {
    border-color: var(--p-surface-600);
}
.dark .p-inputotp.variant-filled .p-inputotp-input {
    background: var(--p-surface-800);
}
.dark .p-inputotp.variant-filled .p-inputotp-input:focus {
    background: var(--p-surface-900);
}
.dark .p-inputotp-input:disabled {
    background: var(--p-surface-800);
    border-color: var(--p-surface-700);
    color: var(--p-surface-500);
}
.dark .p-inputotp-separator {
    color: var(--p-surface-400);
}
`;
function InputOtpIsland(container, props) {
  injectIslandStyle("laughtale-inputotp", CSS2);
  const length = Number(props.length) || 4;
  const isMask = props.mask === true || String(props.mask) === "true";
  const isIntegerOnly = props.integerOnly !== false && String(props.integerOnly) !== "false";
  const isGrouped = props.grouped === true || String(props.grouped) === "true";
  const isFilled = props.variant === "filled";
  const isDisabled = props.disabled === true || String(props.disabled) === "true";
  const isReadonly = props.readonlyMode === true || String(props.readonlyMode) === "true";
  const isInvalid = props.invalid === true || String(props.invalid) === "true";
  const separator = props.separator || "-";
  const initialVal = props.value || "";
  let values = Array.from({ length }, (_, i) => initialVal[i] || "");
  function render() {
    container.className = "laughtale-input-otp p-inputotp";
    if (isFilled) container.classList.add("variant-filled");
    if (props.size) container.classList.add(`size-${props.size}`);
    if (isInvalid) container.classList.add("is-invalid");
    if (isDisabled) container.classList.add("is-disabled");
    if (isGrouped) container.classList.add("p-inputotp-grouped");
    const inputType = isMask ? "password" : "text";
    const inputMode = isIntegerOnly ? "numeric" : "text";
    const patternAttr = isIntegerOnly ? 'pattern="[0-9]*"' : "";
    const disabledAttr = isDisabled ? "disabled" : "";
    const roAttr = isReadonly ? "readonly" : "";
    let html = "";
    if (isGrouped && length % 2 === 0) {
      const mid = length / 2;
      html += '<div class="p-inputotp-group">';
      for (let i = 0; i < mid; i++) {
        html += `
                    <input type="${inputType}"
                           class="p-inputotp-input"
                           data-index="${i}"
                           maxlength="1"
                           inputmode="${inputMode}"
                           ${patternAttr}
                           ${disabledAttr}
                           ${roAttr}
                           value="${values[i] || ""}"
                           autocomplete="off"
                           aria-label="Character ${i + 1}" />
                `;
      }
      html += "</div>";
      html += `<span class="p-inputotp-separator">${separator}</span>`;
      html += '<div class="p-inputotp-group">';
      for (let i = mid; i < length; i++) {
        html += `
                    <input type="${inputType}"
                           class="p-inputotp-input"
                           data-index="${i}"
                           maxlength="1"
                           inputmode="${inputMode}"
                           ${patternAttr}
                           ${disabledAttr}
                           ${roAttr}
                           value="${values[i] || ""}"
                           autocomplete="off"
                           aria-label="Character ${i + 1}" />
                `;
      }
      html += "</div>";
    } else {
      for (let i = 0; i < length; i++) {
        html += `
                    <input type="${inputType}"
                           class="p-inputotp-input"
                           data-index="${i}"
                           maxlength="1"
                           inputmode="${inputMode}"
                           ${patternAttr}
                           ${disabledAttr}
                           ${roAttr}
                           value="${values[i] || ""}"
                           autocomplete="off"
                           aria-label="Character ${i + 1}" />
                `;
      }
    }
    container.innerHTML = html;
    bindEvents();
  }
  function bindEvents() {
    const inputs = Array.from(container.querySelectorAll(".p-inputotp-input"));
    inputs.forEach((input, idx) => {
      input.addEventListener("focus", () => {
        input.select();
      });
      input.addEventListener("input", (e) => {
        const target = e.target;
        let val = target.value;
        if (isIntegerOnly) {
          val = val.replace(/\D/g, "");
        }
        if (val.length > 0) {
          const char = val[val.length - 1];
          values[idx] = char;
          target.value = char;
          if (idx < length - 1) {
            inputs[idx + 1].focus();
            inputs[idx + 1].select();
          }
        } else {
          values[idx] = "";
          target.value = "";
        }
        syncOtp();
      });
      input.addEventListener("keydown", (e) => {
        if (isDisabled || isReadonly) return;
        if (e.key === "Backspace") {
          if (input.value) {
            values[idx] = "";
            input.value = "";
            syncOtp();
          } else if (idx > 0) {
            inputs[idx - 1].focus();
            inputs[idx - 1].value = "";
            values[idx - 1] = "";
            syncOtp();
          }
          e.preventDefault();
        } else if (e.key === "Delete") {
          values[idx] = "";
          input.value = "";
          syncOtp();
          e.preventDefault();
        } else if (e.key === "ArrowLeft" && idx > 0) {
          inputs[idx - 1].focus();
          inputs[idx - 1].select();
          e.preventDefault();
        } else if (e.key === "ArrowRight" && idx < length - 1) {
          inputs[idx + 1].focus();
          inputs[idx + 1].select();
          e.preventDefault();
        } else if (e.key === "Home") {
          inputs[0].focus();
          inputs[0].select();
          e.preventDefault();
        } else if (e.key === "End") {
          inputs[length - 1].focus();
          inputs[length - 1].select();
          e.preventDefault();
        }
      });
      input.addEventListener("paste", (e) => {
        e.preventDefault();
        const pasteData = (e.clipboardData || window.clipboardData)?.getData("text") || "";
        let clean = isIntegerOnly ? pasteData.replace(/\D/g, "") : pasteData.trim();
        clean = clean.slice(0, length - idx);
        if (!clean) return;
        clean.split("").forEach((char, i) => {
          const targetIdx = idx + i;
          if (targetIdx < length) {
            values[targetIdx] = char;
            if (inputs[targetIdx]) inputs[targetIdx].value = char;
          }
        });
        syncOtp();
        const nextFocus = Math.min(idx + clean.length, length - 1);
        if (inputs[nextFocus]) {
          inputs[nextFocus].focus();
          inputs[nextFocus].select();
        }
      });
    });
  }
  function syncOtp() {
    const fullCode = values.join("");
    if (props.targetInputName) {
      let hidden = container.querySelector(`input[name="${props.targetInputName}"]`);
      if (!hidden) {
        hidden = document.createElement("input");
        hidden.type = "hidden";
        hidden.name = props.targetInputName;
        container.appendChild(hidden);
      }
      hidden.value = fullCode;
    }
    container.dispatchEvent(new CustomEvent("otp:change", {
      bubbles: true,
      detail: {
        value: fullCode,
        isComplete: fullCode.length === length && !values.includes("")
      }
    }));
  }
  render();
  syncOtp();
  if (props.autofocus === true || String(props.autofocus) === "true") {
    const first = container.querySelector(".p-inputotp-input");
    first?.focus();
  }
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

// src/components/input-password.ts
var CSS3 = `
.laughtale-password,
.p-password {
    display: inline-flex;
    flex-direction: column;
    position: relative;
    font-family: var(--p-font-family, inherit);
    box-sizing: border-box;
    width: auto;
    vertical-align: middle;
}

.p-password.p-password-fluid {
    display: flex;
    width: 100%;
}

/* Main Input Container Box */
.p-password-container {
    display: flex;
    align-items: center;
    position: relative;
    background: var(--p-surface-0);
    border: 1px solid var(--p-border-color);
    border-radius: var(--p-border-radius);
    transition: border-color 150ms ease, box-shadow 150ms ease, background 150ms ease;
    box-sizing: border-box;
    min-height: 2.5rem;
    overflow: hidden;
    width: 100%;
}

.p-password-container:hover:not(.is-disabled) {
    border-color: var(--p-surface-400);
}

.p-password-container:focus-within:not(.is-disabled) {
    border-color: var(--p-primary-500) !important;
    box-shadow: 0 0 0 1px var(--p-primary-500) !important;
}

.p-password.is-disabled .p-password-container {
    background: var(--p-surface-100);
    opacity: 0.75;
    cursor: not-allowed;
}

/* Variant: Filled */
.p-password.variant-filled .p-password-container {
    background: var(--p-surface-100);
    border-color: transparent;
}
.p-password.variant-filled .p-password-container:focus-within {
    background: var(--p-surface-0);
    border-color: var(--p-primary-500) !important;
}

/* Invalid State */
.p-password.is-invalid .p-password-container {
    border-color: var(--p-red-500, #ef4444) !important;
}
.p-password.is-invalid .p-password-container:focus-within {
    box-shadow: 0 0 0 1px var(--p-red-500, #ef4444) !important;
}

/* Sizes */
.p-password.size-small .p-password-container {
    min-height: 2rem;
}
.p-password.size-small .p-password-input {
    font-size: 0.75rem;
    padding: 0.25rem 0.5rem;
}
.p-password.size-large .p-password-container {
    min-height: 3rem;
}
.p-password.size-large .p-password-input {
    font-size: 1rem;
    padding: 0.75rem 1rem;
}

/* Left Icon */
.p-password-left-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding-left: 0.75rem;
    color: var(--p-surface-400);
    pointer-events: none;
    flex-shrink: 0;
}
.p-password-left-icon svg {
    width: 16px;
    height: 16px;
}

/* Native Input */
.p-password-input {
    flex: 1 1 auto;
    width: 100%;
    min-width: 0;
    font-family: inherit;
    font-size: 0.875rem;
    color: var(--p-text-color);
    background: transparent;
    border: none;
    outline: none;
    padding: 0.5rem 0.75rem;
    box-sizing: border-box;
    height: 100%;
}
.p-password-input:disabled {
    color: var(--p-text-muted);
    cursor: not-allowed;
}

/* Action Buttons (Clear / Toggle Mask) */
.p-password-action-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    border: none;
    color: var(--p-surface-400);
    cursor: pointer;
    padding: 0 0.625rem;
    height: 100%;
    transition: color 150ms ease;
    user-select: none;
}
.p-password-action-btn:hover:not(:disabled) {
    color: var(--p-surface-700);
}
.p-password-action-btn svg {
    width: 16px;
    height: 16px;
}

/* ==================== DIRECT STRENGTH METER ==================== */
.p-password-meter-wrap {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
    margin-top: 0.5rem;
    width: 100%;
}
.p-password-meter-track {
    height: 6px;
    background: var(--p-surface-200);
    border-radius: 9999px;
    overflow: hidden;
    width: 100%;
}
.p-password-meter-bar {
    height: 100%;
    width: 0%;
    border-radius: 9999px;
    transition: width 300ms ease, background-color 300ms ease;
}
.p-password-meter-badge-row {
    display: flex;
    justify-content: flex-end;
}
.p-password-meter-badge {
    font-size: 0.75rem;
    font-weight: 700;
    padding: 0.15rem 0.5rem;
    border-radius: 9999px;
    display: inline-flex;
    align-items: center;
}

/* ==================== REQUIREMENTS: CHIPS MODE ==================== */
.p-password-chips-wrap {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-top: 0.75rem;
}
.p-password-chip {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    font-size: 0.8125rem;
    font-weight: 600;
    padding: 0.25rem 0.625rem;
    border-radius: 9999px;
    border: 1px solid var(--p-border-color);
    background: var(--p-surface-0);
    color: var(--p-surface-600);
    transition: all 200ms ease;
}
.p-password-chip.is-met {
    background: var(--p-emerald-500, #10b981);
    border-color: var(--p-emerald-500, #10b981);
    color: #ffffff;
}
.p-password-chip svg {
    width: 12px;
    height: 12px;
}

/* ==================== REQUIREMENTS: LIST MODE ==================== */
.p-password-list-wrap {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    margin-top: 0.75rem;
}
.p-password-list-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.8125rem;
    font-weight: 500;
    color: var(--p-surface-500);
    transition: color 200ms ease;
}
.p-password-list-item.is-met {
    color: var(--p-emerald-600, #059669);
    font-weight: 600;
}
.p-password-list-item svg {
    width: 14px;
    height: 14px;
    flex-shrink: 0;
}

/* ==================== POPOVER OVERLAY PANEL ==================== */
.p-password-popover {
    position: absolute;
    top: calc(100% + 8px);
    left: 0;
    width: 320px;
    background: var(--p-surface-0);
    border: 1px solid var(--p-border-color);
    border-radius: var(--p-border-radius);
    box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1);
    padding: 1rem;
    z-index: 100;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    animation: pPasswordFadeIn 150ms ease;
}
.p-password-popover::before {
    content: '';
    position: absolute;
    top: -5px;
    left: 1.5rem;
    width: 8px;
    height: 8px;
    background: var(--p-surface-0);
    border-left: 1px solid var(--p-border-color);
    border-top: 1px solid var(--p-border-color);
    transform: rotate(45deg);
}
@keyframes pPasswordFadeIn {
    from { opacity: 0; transform: translateY(-4px); }
    to { opacity: 1; transform: translateY(0); }
}

.p-password-popover-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 0.875rem;
    font-weight: 700;
    color: var(--p-text-color);
}
.p-password-popover-header-title {
    display: flex;
    align-items: center;
    gap: 0.35rem;
}
.p-password-popover-header-title svg {
    width: 16px;
    height: 16px;
    color: var(--p-surface-600);
}

/* ==================== DARK MODE ==================== */
.dark .p-password-container {
    background: var(--p-surface-900);
    border-color: var(--p-surface-700);
}
.dark .p-password-container:hover:not(.is-disabled) {
    border-color: var(--p-surface-600);
}
.dark .p-password.variant-filled .p-password-container {
    background: var(--p-surface-800);
}
.dark .p-password.variant-filled .p-password-container:focus-within {
    background: var(--p-surface-900);
}
.dark .p-password-input {
    color: var(--p-surface-0);
}
.dark .p-password-action-btn {
    color: var(--p-surface-400);
}
.dark .p-password-action-btn:hover:not(:disabled) {
    color: var(--p-surface-100);
}
.dark .p-password-meter-track {
    background: var(--p-surface-800);
}
.dark .p-password-chip {
    background: var(--p-surface-800);
    border-color: var(--p-surface-700);
    color: var(--p-surface-300);
}
.dark .p-password-chip.is-met {
    background: var(--p-emerald-600, #059669);
    border-color: var(--p-emerald-600, #059669);
    color: #ffffff;
}
.dark .p-password-list-item {
    color: var(--p-surface-400);
}
.dark .p-password-list-item.is-met {
    color: var(--p-emerald-400, #34d399);
}
.dark .p-password-popover {
    background: var(--p-surface-900);
    border-color: var(--p-surface-700);
    box-shadow: 0 10px 25px -5px rgba(0,0,0,0.5);
}
.dark .p-password-popover::before {
    background: var(--p-surface-900);
    border-left-color: var(--p-surface-700);
    border-top-color: var(--p-surface-700);
}
.dark .p-password-popover-header-title svg {
    color: var(--p-surface-300);
}
`;
function InputPasswordIsland(container, props) {
  injectIslandStyle("laughtale-password", CSS3);
  let isMasked = true;
  let currentVal = props.value || "";
  const minLength = Number(props.minLength) || 8;
  const isFilled = props.variant === "filled";
  const isFluid = props.fluid === true || String(props.fluid) === "true";
  const isDisabled = props.disabled === true || String(props.disabled) === "true";
  const isReadonly = props.readonlyMode === true || String(props.readonlyMode) === "true";
  const isInvalid = props.invalid === true || String(props.invalid) === "true";
  const hasToggleMask = props.toggleMask !== false && String(props.toggleMask) !== "false";
  const showClear = props.showClear === true || String(props.showClear) === "true";
  const showMeter = props.showMeter === true || String(props.showMeter) === "true";
  const showRequirements = props.showRequirements === true || String(props.showRequirements) === "true";
  const isPopover = props.feedback === true || String(props.feedback) === "true" || props.requirementsMode === "popover";
  const requirementsMode = props.requirementsMode || (isPopover ? "popover" : "chips");
  function checkRules(pwd) {
    return {
      length: pwd.length >= minLength,
      uppercase: /[A-Z]/.test(pwd),
      lowercase: /[a-z]/.test(pwd),
      number: /[0-9]/.test(pwd),
      special: /[^A-Za-z0-9]/.test(pwd)
    };
  }
  function calculateStrength(pwd) {
    if (!pwd) return { score: 0, label: "Empty", color: "#94a3b8", bgColor: "#f1f5f9", width: "0%" };
    const rules = checkRules(pwd);
    const passed = Object.values(rules).filter(Boolean).length;
    if (passed <= 1) {
      return { score: 1, label: "Too Weak", color: "#ef4444", bgColor: "rgba(239, 68, 68, 0.15)", width: "25%" };
    } else if (passed <= 3) {
      return { score: 2, label: "Medium", color: "#f59e0b", bgColor: "rgba(245, 158, 11, 0.15)", width: "60%" };
    } else {
      return { score: 3, label: "Strong", color: "#10b981", bgColor: "rgba(16, 185, 129, 0.15)", width: "100%" };
    }
  }
  function render() {
    container.className = "laughtale-password p-password";
    if (isFluid) container.classList.add("p-password-fluid");
    if (isFilled) container.classList.add("variant-filled");
    if (props.size) container.classList.add(`size-${props.size}`);
    if (isInvalid) container.classList.add("is-invalid");
    if (isDisabled) container.classList.add("is-disabled");
    const inputIdAttr = props.inputId ? `id="${props.inputId}"` : "";
    const placeholderAttr = props.placeholder ? `placeholder="${props.placeholder}"` : "";
    const disabledAttr = isDisabled ? "disabled" : "";
    const roAttr = isReadonly ? "readonly" : "";
    const inputType = isMasked ? "password" : "text";
    const eyeIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>`;
    const eyeOffIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>`;
    const clearIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>`;
    let leftIconHtml = "";
    if (props.icon) {
      const iconSvg = getLucideIcon(props.icon) || `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`;
      leftIconHtml = `<span class="p-password-left-icon">${iconSvg}</span>`;
    }
    let html = `
            <div class="p-password-container">
                ${leftIconHtml}
                <input type="${inputType}"
                       class="p-password-input ${props.inputClass || ""}"
                       ${inputIdAttr}
                       ${placeholderAttr}
                       ${disabledAttr}
                       ${roAttr}
                       value="${currentVal}"
                       autocomplete="off" />
                ${showClear ? `
                    <button type="button" class="p-password-action-btn p-password-clear-btn" aria-label="Clear password" style="${!currentVal ? "display: none;" : ""}">
                        ${clearIcon}
                    </button>
                ` : ""}
                ${hasToggleMask ? `
                    <button type="button" class="p-password-action-btn p-password-toggle-btn" aria-label="Toggle password visibility" tabindex="-1">
                        ${isMasked ? eyeIcon : eyeOffIcon}
                    </button>
                ` : ""}
            </div>
        `;
    if (showMeter && !isPopover) {
      const str = calculateStrength(currentVal);
      html += `
                <div class="p-password-meter-wrap" style="${!currentVal ? "display: none;" : ""}">
                    <div class="p-password-meter-track">
                        <div class="p-password-meter-bar" style="width: ${str.width}; background-color: ${str.color};"></div>
                    </div>
                    <div class="p-password-meter-badge-row">
                        <span class="p-password-meter-badge" style="color: ${str.color}; background-color: ${str.bgColor};">${str.label}</span>
                    </div>
                </div>
            `;
    }
    if (showRequirements && requirementsMode === "chips" && !isPopover) {
      html += renderRequirementsChips(currentVal);
    }
    if (showRequirements && requirementsMode === "list" && !isPopover) {
      html += renderRequirementsList(currentVal);
    }
    if (isPopover) {
      html += `
                <div class="p-password-popover" style="display: none;">
                    <div class="p-password-popover-header">
                        <span class="p-password-popover-header-title">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/></svg>
                            Password Strength
                        </span>
                        <span class="p-password-popover-badge p-password-meter-badge"></span>
                    </div>
                    <div class="p-password-meter-track">
                        <div class="p-password-popover-bar p-password-meter-bar"></div>
                    </div>
                    <div class="p-password-popover-list p-password-list-wrap">
                        ${renderRequirementsListItems(currentVal)}
                    </div>
                </div>
            `;
    }
    container.innerHTML = html;
    bindEvents();
  }
  function renderRequirementsChips(pwd) {
    const r = checkRules(pwd);
    const checkIcon = `<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6 9 17l-5-5"/></svg>`;
    const xIcon = `<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>`;
    return `
            <div class="p-password-chips-wrap">
                <span class="p-password-chip ${r.length ? "is-met" : ""}" data-rule="length">
                    ${r.length ? checkIcon : xIcon} ${minLength}+ characters
                </span>
                <span class="p-password-chip ${r.number ? "is-met" : ""}" data-rule="number">
                    ${r.number ? checkIcon : xIcon} Number
                </span>
                <span class="p-password-chip ${r.uppercase ? "is-met" : ""}" data-rule="uppercase">
                    ${r.uppercase ? checkIcon : xIcon} Uppercase letter
                </span>
                <span class="p-password-chip ${r.special ? "is-met" : ""}" data-rule="special">
                    ${r.special ? checkIcon : xIcon} Special character
                </span>
            </div>
        `;
  }
  function renderRequirementsList(pwd) {
    return `
            <div class="p-password-list-wrap">
                ${renderRequirementsListItems(pwd)}
            </div>
        `;
  }
  function renderRequirementsListItems(pwd) {
    const r = checkRules(pwd);
    const checkIcon = `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6 9 17l-5-5"/></svg>`;
    const xIcon = `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>`;
    return `
            <div class="p-password-list-item ${r.length ? "is-met" : ""}" data-rule="length">
                ${r.length ? checkIcon : xIcon} At least ${minLength} characters long
            </div>
            <div class="p-password-list-item ${r.uppercase ? "is-met" : ""}" data-rule="uppercase">
                ${r.uppercase ? checkIcon : xIcon} Contains uppercase letter
            </div>
            <div class="p-password-list-item ${r.lowercase ? "is-met" : ""}" data-rule="lowercase">
                ${r.lowercase ? checkIcon : xIcon} Contains lowercase letter
            </div>
            <div class="p-password-list-item ${r.number ? "is-met" : ""}" data-rule="number">
                ${r.number ? checkIcon : xIcon} Contains number
            </div>
            <div class="p-password-list-item ${r.special ? "is-met" : ""}" data-rule="special">
                ${r.special ? checkIcon : xIcon} Contains special character (!@#$...)
            </div>
        `;
  }
  function updateVisuals() {
    const r = checkRules(currentVal);
    const str = calculateStrength(currentVal);
    const clearBtn = container.querySelector(".p-password-clear-btn");
    if (clearBtn) {
      clearBtn.style.display = currentVal ? "inline-flex" : "none";
    }
    const meterWrap = container.querySelector(".p-password-meter-wrap");
    const meterBar = container.querySelector(".p-password-meter-bar");
    const meterBadge = container.querySelector(".p-password-meter-badge");
    if (meterWrap && meterBar && meterBadge) {
      meterWrap.style.display = currentVal ? "flex" : "none";
      meterBar.style.width = str.width;
      meterBar.style.backgroundColor = str.color;
      meterBadge.textContent = str.label;
      meterBadge.style.color = str.color;
      meterBadge.style.backgroundColor = str.bgColor;
    }
    const checkIcon = `<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6 9 17l-5-5"/></svg>`;
    const xIcon = `<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>`;
    container.querySelectorAll(".p-password-chip").forEach((chip) => {
      const rule = chip.getAttribute("data-rule");
      const isMet = r[rule];
      chip.classList.toggle("is-met", isMet);
      const text = chip.textContent?.trim().replace(/^[✔✕]\s*/, "") || "";
      chip.innerHTML = `${isMet ? checkIcon : xIcon} ${text}`;
    });
    const listCheckIcon = `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6 9 17l-5-5"/></svg>`;
    const listXIcon = `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>`;
    container.querySelectorAll(".p-password-list-item").forEach((item) => {
      const rule = item.getAttribute("data-rule");
      const isMet = r[rule];
      item.classList.toggle("is-met", isMet);
      const text = item.textContent?.trim().replace(/^[✔✕]\s*/, "") || "";
      item.innerHTML = `${isMet ? listCheckIcon : listXIcon} ${text}`;
    });
    const popoverBar = container.querySelector(".p-password-popover-bar");
    const popoverBadge = container.querySelector(".p-password-popover-badge");
    if (popoverBar && popoverBadge) {
      popoverBar.style.width = str.width;
      popoverBar.style.backgroundColor = str.color;
      popoverBadge.textContent = str.label;
      popoverBadge.style.color = str.color;
      popoverBadge.style.backgroundColor = str.bgColor;
    }
  }
  function bindEvents() {
    const inputEl = container.querySelector(".p-password-input");
    const toggleBtn = container.querySelector(".p-password-toggle-btn");
    const clearBtn = container.querySelector(".p-password-clear-btn");
    const popoverEl = container.querySelector(".p-password-popover");
    const eyeIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>`;
    const eyeOffIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>`;
    inputEl.addEventListener("input", () => {
      currentVal = inputEl.value;
      updateVisuals();
      syncTargetInput();
    });
    if (popoverEl) {
      inputEl.addEventListener("focus", () => {
        popoverEl.style.display = "flex";
        updateVisuals();
      });
      document.addEventListener("click", (e) => {
        if (!container.contains(e.target)) {
          popoverEl.style.display = "none";
        }
      });
      inputEl.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
          popoverEl.style.display = "none";
        }
      });
    }
    toggleBtn?.addEventListener("mousedown", (e) => {
      e.preventDefault();
    });
    toggleBtn?.addEventListener("click", (e) => {
      e.preventDefault();
      isMasked = !isMasked;
      inputEl.type = isMasked ? "password" : "text";
      toggleBtn.innerHTML = isMasked ? eyeIcon : eyeOffIcon;
      inputEl.focus();
    });
    clearBtn?.addEventListener("mousedown", (e) => {
      e.preventDefault();
    });
    clearBtn?.addEventListener("click", (e) => {
      e.preventDefault();
      currentVal = "";
      inputEl.value = "";
      updateVisuals();
      syncTargetInput();
      inputEl.focus();
    });
  }
  function syncTargetInput() {
    if (props.targetInputName) {
      let hidden = container.querySelector(`input[name="${props.targetInputName}"]`);
      if (!hidden) {
        hidden = document.createElement("input");
        hidden.type = "hidden";
        hidden.name = props.targetInputName;
        container.appendChild(hidden);
      }
      hidden.value = currentVal;
    }
    container.dispatchEvent(new CustomEvent("password:change", {
      bubbles: true,
      detail: {
        value: currentVal,
        strength: calculateStrength(currentVal).label,
        rules: checkRules(currentVal)
      }
    }));
  }
  render();
  updateVisuals();
  syncTargetInput();
}

// src/components/toggle-switch.ts
var CSS4 = `
/* ==================== AURA TOGGLESWITCH ==================== */
.laughtale-toggleswitch,
.p-toggleswitch {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    position: relative;
    user-select: none;
    vertical-align: middle;
    cursor: pointer;
}

.p-toggleswitch.p-disabled {
    opacity: 0.6;
    cursor: not-allowed;
    pointer-events: none;
}

.p-toggleswitch-input {
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
    border: 0;
    appearance: none;
}

.p-toggleswitch.p-disabled .p-toggleswitch-input {
    cursor: not-allowed;
}

/* Slider Track */
.p-toggleswitch-slider {
    position: relative;
    display: block;
    width: 2.5rem; /* 40px */
    height: 1.5rem; /* 24px */
    background: var(--p-surface-300, #cbd5e1);
    border-radius: 9999px;
    transition: background 150ms ease, border-color 150ms ease, box-shadow 150ms ease;
    box-sizing: border-box;
}

.p-toggleswitch:hover:not(.p-disabled):not(.p-toggleswitch-checked) .p-toggleswitch-slider {
    background: var(--p-surface-400, #94a3b8);
}

.p-toggleswitch:focus-within:not(.p-disabled) .p-toggleswitch-slider,
.p-toggleswitch-input:focus-visible ~ .p-toggleswitch-slider {
    box-shadow: 0 0 0 1px var(--p-primary-500, #10b981) !important;
}

/* Checked State */
.p-toggleswitch.p-toggleswitch-checked .p-toggleswitch-slider {
    background: var(--p-primary-500, #10b981);
}

.p-toggleswitch.p-toggleswitch-checked:hover:not(.p-disabled) .p-toggleswitch-slider {
    background: var(--p-primary-600, #059669);
}

/* Handle Thumb */
.p-toggleswitch-handle {
    position: absolute;
    top: 3px;
    left: 3px;
    width: 1.125rem; /* 18px */
    height: 1.125rem; /* 18px */
    background: var(--p-surface-0, #ffffff);
    border-radius: 50%;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15), 0 1px 2px rgba(0, 0, 0, 0.06);
    transition: transform 150ms cubic-bezier(0.4, 0, 0.2, 1), background 150ms ease, color 150ms ease;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    color: var(--p-surface-600, #475569);
}

.p-toggleswitch.p-toggleswitch-checked .p-toggleswitch-handle {
    transform: translateX(16px);
    color: var(--p-primary-600, #059669);
}

/* Handle Icon */
.p-toggleswitch-handle-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    line-height: 1;
}

.p-toggleswitch-handle-icon svg {
    width: 10px;
    height: 10px;
}

/* Invalid State */
.p-toggleswitch.p-invalid .p-toggleswitch-slider,
.p-toggleswitch.is-invalid .p-toggleswitch-slider {
    border: 1px solid var(--p-red-500, #ef4444) !important;
}
.p-toggleswitch.p-invalid:focus-within .p-toggleswitch-slider,
.p-toggleswitch.is-invalid:focus-within .p-toggleswitch-slider {
    box-shadow: 0 0 0 1px var(--p-red-500, #ef4444) !important;
}

/* Label */
.p-toggleswitch-label {
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--p-text-color, #0f172a);
    cursor: pointer;
}

/* ==================== DARK MODE ==================== */
.dark .p-toggleswitch-slider {
    background: var(--p-surface-700, #334155);
}
.dark .p-toggleswitch:hover:not(.p-disabled):not(.p-toggleswitch-checked) .p-toggleswitch-slider {
    background: var(--p-surface-600, #475569);
}
.dark .p-toggleswitch.p-toggleswitch-checked .p-toggleswitch-slider {
    background: var(--p-primary-500, #10b981);
}
.dark .p-toggleswitch.p-toggleswitch-checked:hover:not(.p-disabled) .p-toggleswitch-slider {
    background: var(--p-primary-400, #34d399);
}
.dark .p-toggleswitch-handle {
    background: var(--p-surface-0, #ffffff);
    color: var(--p-surface-600, #475569);
}
.dark .p-toggleswitch.p-toggleswitch-checked .p-toggleswitch-handle {
    background: var(--p-surface-0, #ffffff);
    color: var(--p-primary-600, #059669);
}
.dark .p-toggleswitch.p-disabled .p-toggleswitch-slider {
    background: var(--p-surface-800, #1e293b);
}
.dark .p-toggleswitch.p-disabled .p-toggleswitch-handle {
    background: var(--p-surface-500, #64748b);
}
`;
function ToggleSwitchIsland(container, props) {
  injectIslandStyle("laughtale-toggleswitch", CSS4);
  let isChecked = props.checked === true || String(props.checked) === "true" || props.value === true || String(props.value) === "true";
  const isInvalid = props.invalid === true || String(props.invalid) === "true";
  const isDisabled = props.disabled === true || String(props.disabled) === "true";
  const checkedIcon = props.checkedIcon || props.icon;
  const uncheckedIcon = props.uncheckedIcon;
  const inputId = props.inputId || "";
  const inputName = props.name || props.targetInputName || "switch_value";
  function render() {
    const rootClasses = [
      "laughtale-toggleswitch",
      "p-toggleswitch",
      "p-component",
      isChecked ? "p-toggleswitch-checked" : "",
      isInvalid ? "p-invalid is-invalid" : "",
      isDisabled ? "p-disabled" : ""
    ].filter(Boolean).join(" ");
    container.className = rootClasses;
    const activeIcon = isChecked ? checkedIcon : uncheckedIcon;
    const iconHtml = activeIcon ? `<span class="p-toggleswitch-handle-icon">${getLucideIcon(activeIcon, 10)}</span>` : "";
    container.innerHTML = `
            <input 
                type="checkbox" 
                role="switch"
                class="p-toggleswitch-input"
                ${inputId ? `id="${inputId}"` : ""}
                name="${inputName}"
                ${isChecked ? "checked" : ""}
                ${isDisabled ? "disabled" : ""}
                aria-checked="${isChecked ? "true" : "false"}"
                ${props.ariaLabel ? `aria-label="${props.ariaLabel}"` : ""}
                ${props.ariaLabelledBy ? `aria-labelledby="${props.ariaLabelledBy}"` : ""}
                tabindex="${isDisabled ? "-1" : "0"}"
            />
            <div class="p-toggleswitch-slider ${props.sliderClass || ""}">
                <div class="p-toggleswitch-handle ${props.handleClass || ""}">
                    ${iconHtml}
                </div>
            </div>
            ${props.label ? `<span class="p-toggleswitch-label">${props.label}</span>` : ""}
        `;
    bindEvents();
  }
  function toggle() {
    if (isDisabled) return;
    isChecked = !isChecked;
    render();
    syncValue();
  }
  function syncValue() {
    container.dispatchEvent(new CustomEvent("switch:change", {
      bubbles: true,
      detail: { checked: isChecked, value: isChecked }
    }));
    container.dispatchEvent(new CustomEvent("toggleswitch:change", {
      bubbles: true,
      detail: { checked: isChecked, value: isChecked }
    }));
    container.dispatchEvent(new CustomEvent("change", {
      bubbles: true,
      detail: { checked: isChecked, value: isChecked }
    }));
  }
  function bindEvents() {
    const inp = container.querySelector(".p-toggleswitch-input");
    if (inp) {
      inp.onchange = (e) => {
        e.stopPropagation();
        toggle();
      };
    }
    container.onclick = (e) => {
      if (e.target.closest(".p-toggleswitch-input")) return;
      e.preventDefault();
      toggle();
    };
    container.onkeydown = (e) => {
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        toggle();
      }
    };
  }
  render();
}

// src/components/slider.ts
var CSS5 = `
/* ==================== AURA SLIDER ==================== */
.laughtale-slider,
.p-slider {
    position: relative;
    user-select: none;
    touch-action: none;
    box-sizing: border-box;
    font-family: var(--p-font-family, inherit);
}

.p-slider-horizontal {
    height: 0.375rem;
    width: 100%;
    background: var(--p-surface-200, #e2e8f0);
    border-radius: 9999px;
    cursor: pointer;
    display: block;
}

.p-slider-vertical {
    width: 0.375rem;
    height: 12rem;
    background: var(--p-surface-200, #e2e8f0);
    border-radius: 9999px;
    cursor: pointer;
    display: inline-block;
}

.p-slider.is-disabled {
    opacity: 0.6;
    cursor: not-allowed !important;
    pointer-events: none;
}

/* Range Fill Bar */
.p-slider-range {
    position: absolute;
    background: var(--p-primary-500, #10b981);
    border-radius: 9999px;
    pointer-events: none;
    transition: background 150ms ease;
    display: block;
}

.p-slider-horizontal .p-slider-range {
    top: 0;
    height: 100%;
}

.p-slider-vertical .p-slider-range {
    left: 0;
    width: 100%;
    bottom: 0;
}

/* Handle */
.p-slider-handle {
    position: absolute;
    width: 1.25rem;
    height: 1.25rem;
    border-radius: 50%;
    background: var(--p-surface-0, #ffffff);
    border: 2px solid var(--p-primary-500, #10b981);
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.15), 0 1px 2px -1px rgba(0, 0, 0, 0.1);
    cursor: grab;
    outline: none;
    box-sizing: border-box;
    transition: border-color 150ms ease, box-shadow 150ms ease, transform 120ms ease;
    z-index: 10;
    display: block;
}

.p-slider-horizontal .p-slider-handle {
    top: 50%;
    transform: translate(-50%, -50%);
}

.p-slider-vertical .p-slider-handle {
    left: 50%;
    transform: translate(-50%, 50%);
}

.p-slider-handle:hover:not(.is-disabled) {
    border-color: var(--p-primary-600, #059669);
    transform: translate(-50%, -50%) scale(1.1);
}

.p-slider-vertical .p-slider-handle:hover:not(.is-disabled) {
    transform: translate(-50%, 50%) scale(1.1);
}

.p-slider-handle:focus-visible:not(.is-disabled) {
    border-color: var(--p-primary-600, #059669);
    box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.2);
}

.p-slider-handle.is-dragging {
    cursor: grabbing !important;
    transform: translate(-50%, -50%) scale(1.18) !important;
    box-shadow: 0 0 0 5px rgba(16, 185, 129, 0.25) !important;
}

.p-slider-vertical .p-slider-handle.is-dragging {
    transform: translate(-50%, 50%) scale(1.18) !important;
}

.p-slider-handle.is-disabled {
    cursor: not-allowed;
    background: var(--p-surface-200, #e2e8f0);
    border-color: var(--p-surface-400, #94a3b8);
    box-shadow: none;
}

/* ==================== DARK MODE ==================== */
.dark .p-slider-horizontal,
.dark .p-slider-vertical {
    background: var(--p-surface-700, #334155);
}
.dark .p-slider-range {
    background: var(--p-primary-400, #34d399);
}
.dark .p-slider-handle {
    background: var(--p-surface-900, #0f172a);
    border-color: var(--p-primary-400, #34d399);
}
.dark .p-slider-handle:hover:not(.is-disabled) {
    border-color: var(--p-primary-300, #6ee7b7);
}
.dark .p-slider-handle:focus-visible:not(.is-disabled) {
    border-color: var(--p-primary-300, #6ee7b7);
    box-shadow: 0 0 0 4px rgba(52, 211, 153, 0.2);
}
.dark .p-slider-handle.is-dragging {
    box-shadow: 0 0 0 5px rgba(52, 211, 153, 0.25) !important;
}
.dark .p-slider-handle.is-disabled {
    background: var(--p-surface-800, #1e293b);
    border-color: var(--p-surface-600, #475569);
}
`;
function SliderIsland(container, props) {
  injectIslandStyle("laughtale-slider", CSS5);
  const min = props.min !== void 0 ? Number(props.min) : 0;
  const max = props.max !== void 0 ? Number(props.max) : 100;
  const step = props.step !== void 0 ? Number(props.step) : 1;
  const isRange = props.range === true || String(props.range) === "true";
  const isVertical = props.orientation === "vertical";
  const isDisabled = props.disabled === true || String(props.disabled) === "true";
  const disabledMin = props.disabledMinHandle === true || String(props.disabledMinHandle) === "true";
  const disabledMax = props.disabledMaxHandle === true || String(props.disabledMaxHandle) === "true";
  const minDistance = props.minStepsBetweenHandles !== void 0 ? Number(props.minStepsBetweenHandles) : 0;
  let currentValues = [];
  if (isRange) {
    if (Array.isArray(props.values) && props.values.length >= 2) {
      currentValues = [Number(props.values[0]), Number(props.values[1])];
    } else if (Array.isArray(props.value) && props.value.length >= 2) {
      currentValues = [Number(props.value[0]), Number(props.value[1])];
    } else if (typeof props.value === "string" && props.value.includes(",")) {
      const parts = props.value.split(",").map((s) => Number(s.trim()));
      currentValues = [parts[0] ?? min, parts[1] ?? max];
    } else {
      currentValues = [min + (max - min) * 0.2, min + (max - min) * 0.8];
    }
  } else {
    const singleVal = props.value !== void 0 ? Number(props.value) : min;
    currentValues = [singleVal];
  }
  function clampValue(val) {
    return Math.max(min, Math.min(max, val));
  }
  function snapToStep(val) {
    if (step <= 0) return val;
    const count = Math.round((val - min) / step);
    const snapped = min + count * step;
    return Number(clampValue(snapped).toFixed(4));
  }
  currentValues = currentValues.map((v) => snapToStep(v));
  function getPercent(val) {
    if (max === min) return 0;
    return Math.max(0, Math.min(100, (val - min) / (max - min) * 100));
  }
  function render() {
    const rootClasses = [
      "laughtale-slider",
      "p-slider",
      isVertical ? "p-slider-vertical" : "p-slider-horizontal",
      isDisabled ? "is-disabled" : ""
    ].filter(Boolean).join(" ");
    container.className = rootClasses;
    if (props.inputId) container.setAttribute("id", props.inputId);
    if (isRange) {
      const p1 = getPercent(currentValues[0]);
      const p2 = getPercent(currentValues[1]);
      const leftPct = Math.min(p1, p2);
      const sizePct = Math.abs(p2 - p1);
      const rangeStyle = isVertical ? `bottom: ${leftPct}%; height: ${sizePct}%;` : `left: ${leftPct}%; width: ${sizePct}%;`;
      const h1Style = isVertical ? `bottom: ${p1}%;` : `left: ${p1}%;`;
      const h2Style = isVertical ? `bottom: ${p2}%;` : `left: ${p2}%;`;
      container.innerHTML = `
                <span class="p-slider-range" style="${rangeStyle}"></span>
                <span 
                    class="p-slider-handle ${disabledMin || isDisabled ? "is-disabled" : ""}" 
                    data-handle="0" 
                    tabindex="${isDisabled || disabledMin ? "-1" : "0"}" 
                    role="slider" 
                    aria-orientation="${isVertical ? "vertical" : "horizontal"}" 
                    aria-valuemin="${min}" 
                    aria-valuemax="${max}" 
                    aria-valuenow="${currentValues[0]}"
                    style="${h1Style}"
                ></span>
                <span 
                    class="p-slider-handle ${disabledMax || isDisabled ? "is-disabled" : ""}" 
                    data-handle="1" 
                    tabindex="${isDisabled || disabledMax ? "-1" : "0"}" 
                    role="slider" 
                    aria-orientation="${isVertical ? "vertical" : "horizontal"}" 
                    aria-valuemin="${min}" 
                    aria-valuemax="${max}" 
                    aria-valuenow="${currentValues[1]}"
                    style="${h2Style}"
                ></span>
                <input type="hidden" name="${props.name || props.targetInputName || "slider_value"}" value="${currentValues.join(",")}" />
            `;
    } else {
      const p = getPercent(currentValues[0]);
      const rangeStyle = isVertical ? `bottom: 0; height: ${p}%;` : `left: 0; width: ${p}%;`;
      const hStyle = isVertical ? `bottom: ${p}%;` : `left: ${p}%;`;
      container.innerHTML = `
                <span class="p-slider-range" style="${rangeStyle}"></span>
                <span 
                    class="p-slider-handle ${isDisabled ? "is-disabled" : ""}" 
                    data-handle="0" 
                    tabindex="${isDisabled ? "-1" : "0"}" 
                    role="slider" 
                    aria-orientation="${isVertical ? "vertical" : "horizontal"}" 
                    aria-valuemin="${min}" 
                    aria-valuemax="${max}" 
                    aria-valuenow="${currentValues[0]}"
                    style="${hStyle}"
                ></span>
                <input type="hidden" name="${props.name || props.targetInputName || "slider_value"}" value="${currentValues[0]}" />
            `;
    }
    bindEvents();
  }
  function updateVisuals() {
    const rangeEl = container.querySelector(".p-slider-range");
    const handles = container.querySelectorAll(".p-slider-handle");
    const hiddenInp = container.querySelector('input[type="hidden"]');
    if (isRange) {
      const p1 = getPercent(currentValues[0]);
      const p2 = getPercent(currentValues[1]);
      const leftPct = Math.min(p1, p2);
      const sizePct = Math.abs(p2 - p1);
      if (rangeEl) {
        if (isVertical) {
          rangeEl.style.bottom = `${leftPct}%`;
          rangeEl.style.height = `${sizePct}%`;
        } else {
          rangeEl.style.left = `${leftPct}%`;
          rangeEl.style.width = `${sizePct}%`;
        }
      }
      if (handles[0]) {
        if (isVertical) handles[0].style.bottom = `${p1}%`;
        else handles[0].style.left = `${p1}%`;
        handles[0].setAttribute("aria-valuenow", currentValues[0].toString());
      }
      if (handles[1]) {
        if (isVertical) handles[1].style.bottom = `${p2}%`;
        else handles[1].style.left = `${p2}%`;
        handles[1].setAttribute("aria-valuenow", currentValues[1].toString());
      }
      if (hiddenInp) hiddenInp.value = currentValues.join(",");
    } else {
      const p = getPercent(currentValues[0]);
      if (rangeEl) {
        if (isVertical) rangeEl.style.height = `${p}%`;
        else rangeEl.style.width = `${p}%`;
      }
      if (handles[0]) {
        if (isVertical) handles[0].style.bottom = `${p}%`;
        else handles[0].style.left = `${p}%`;
        handles[0].setAttribute("aria-valuenow", currentValues[0].toString());
      }
      if (hiddenInp) hiddenInp.value = currentValues[0].toString();
    }
  }
  function syncValue(isEnd = false) {
    const valPayload = isRange ? [...currentValues] : currentValues[0];
    container.dispatchEvent(new CustomEvent("slider:change", {
      bubbles: true,
      detail: { value: valPayload }
    }));
    container.dispatchEvent(new CustomEvent("change", {
      bubbles: true,
      detail: { value: valPayload }
    }));
    if (isEnd) {
      container.dispatchEvent(new CustomEvent("slider:slideend", {
        bubbles: true,
        detail: { value: valPayload }
      }));
      container.dispatchEvent(new CustomEvent("slideend", {
        bubbles: true,
        detail: { value: valPayload }
      }));
    }
  }
  function bindEvents() {
    if (isDisabled) return;
    let activeHandleIdx = null;
    let isDragging = false;
    const getRatioFromEvent = (e) => {
      const rect = container.getBoundingClientRect();
      if (isVertical) {
        if (rect.height <= 0) return 0;
        const ratio = (rect.bottom - e.clientY) / rect.height;
        return Math.max(0, Math.min(1, ratio));
      } else {
        if (rect.width <= 0) return 0;
        const ratio = (e.clientX - rect.left) / rect.width;
        return Math.max(0, Math.min(1, ratio));
      }
    };
    const updateFromRatio = (ratio, handleIdx) => {
      let rawVal = min + ratio * (max - min);
      let snapped = snapToStep(rawVal);
      if (isRange) {
        if (handleIdx === 0) {
          if (disabledMin) return;
          const maxAllowed = currentValues[1] - minDistance;
          snapped = Math.min(snapped, maxAllowed);
          snapped = Math.max(min, snapped);
          currentValues[0] = snapped;
        } else {
          if (disabledMax) return;
          const minAllowed = currentValues[0] + minDistance;
          snapped = Math.max(snapped, minAllowed);
          snapped = Math.min(max, snapped);
          currentValues[1] = snapped;
        }
      } else {
        currentValues[0] = snapped;
      }
      updateVisuals();
      syncValue(false);
    };
    container.onpointerdown = (e) => {
      if (isDisabled) return;
      const target = e.target;
      const handleEl = target.closest(".p-slider-handle");
      if (handleEl) {
        const idx = Number(handleEl.getAttribute("data-handle") || 0);
        if (idx === 0 && disabledMin) return;
        if (idx === 1 && disabledMax) return;
        activeHandleIdx = idx;
      } else {
        const ratio = getRatioFromEvent(e);
        const clickVal = min + ratio * (max - min);
        if (isRange) {
          const dist0 = Math.abs(currentValues[0] - clickVal);
          const dist1 = Math.abs(currentValues[1] - clickVal);
          if (dist0 <= dist1 && !disabledMin) {
            activeHandleIdx = 0;
          } else if (!disabledMax) {
            activeHandleIdx = 1;
          } else {
            activeHandleIdx = 0;
          }
        } else {
          activeHandleIdx = 0;
        }
      }
      if (activeHandleIdx === null) return;
      isDragging = true;
      const activeEl = container.querySelector(`.p-slider-handle[data-handle="${activeHandleIdx}"]`);
      activeEl?.classList.add("is-dragging");
      activeEl?.focus();
      try {
        container.setPointerCapture(e.pointerId);
      } catch (_) {
      }
      updateFromRatio(getRatioFromEvent(e), activeHandleIdx);
    };
    container.onpointermove = (e) => {
      if (!isDragging || activeHandleIdx === null) return;
      updateFromRatio(getRatioFromEvent(e), activeHandleIdx);
    };
    const onEnd = (e) => {
      if (!isDragging) return;
      isDragging = false;
      if (activeHandleIdx !== null) {
        const activeEl = container.querySelector(`.p-slider-handle[data-handle="${activeHandleIdx}"]`);
        activeEl?.classList.remove("is-dragging");
      }
      try {
        container.releasePointerCapture(e.pointerId);
      } catch (_) {
      }
      syncValue(true);
      activeHandleIdx = null;
    };
    container.onpointerup = onEnd;
    container.onpointercancel = onEnd;
    const handles = container.querySelectorAll(".p-slider-handle");
    handles.forEach((h) => {
      h.onkeydown = (e) => {
        const idx = Number(h.getAttribute("data-handle") || 0);
        if (idx === 0 && disabledMin) return;
        if (idx === 1 && disabledMax) return;
        let cur = currentValues[idx];
        let changed = false;
        if (e.key === "ArrowRight" || e.key === "ArrowUp") {
          cur = snapToStep(cur + step);
          changed = true;
        } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
          cur = snapToStep(cur - step);
          changed = true;
        } else if (e.key === "PageUp") {
          cur = snapToStep(cur + step * 10);
          changed = true;
        } else if (e.key === "PageDown") {
          cur = snapToStep(cur - step * 10);
          changed = true;
        } else if (e.key === "Home") {
          cur = min;
          changed = true;
        } else if (e.key === "End") {
          cur = max;
          changed = true;
        }
        if (changed) {
          e.preventDefault();
          if (isRange) {
            if (idx === 0) {
              const maxAllowed = currentValues[1] - minDistance;
              currentValues[0] = Math.min(cur, maxAllowed);
            } else {
              const minAllowed = currentValues[0] + minDistance;
              currentValues[1] = Math.max(cur, minAllowed);
            }
          } else {
            currentValues[0] = cur;
          }
          updateVisuals();
          syncValue(false);
        }
      };
      h.onkeyup = (e) => {
        if (["ArrowRight", "ArrowUp", "ArrowLeft", "ArrowDown", "PageUp", "PageDown", "Home", "End"].includes(e.key)) {
          syncValue(true);
        }
      };
    });
  }
  render();
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

// src/components/rating.ts
var CSS6 = `
.laughtale-rating,
.p-rating {
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
    font-family: var(--p-font-family, inherit);
    user-select: none;
    box-sizing: border-box;
}

.p-rating.p-rating-vertical {
    flex-direction: column;
}

/* Rating Items (Stars / Icons) */
.p-rating-item {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border-radius: 9999px;
    padding: 0.125rem;
    transition: transform 150ms cubic-bezier(0.4, 0, 0.2, 1), color 150ms ease, opacity 150ms ease;
    color: var(--p-surface-300);
    outline: none;
}

.p-rating:not(.p-readonly):not(.p-disabled) .p-rating-item:hover {
    transform: scale(1.15);
}

.p-rating:not(.p-readonly):not(.p-disabled) .p-rating-item:focus-visible {
    box-shadow: 0 0 0 2px var(--p-primary-500);
}

.p-rating-item.p-rating-item-active {
    color: var(--p-primary-500, #f59e0b);
}

.p-rating-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    transition: color 150ms ease, fill 150ms ease;
}

.p-rating-icon svg {
    width: 100%;
    height: 100%;
}

/* Sizes */
.p-rating.size-small .p-rating-icon {
    width: 16px;
    height: 16px;
}
.p-rating.size-large .p-rating-icon {
    width: 26px;
    height: 26px;
}

/* Half Stars Overlay */
.p-rating-half-wrapper {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
}
.p-rating-half-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 50%;
    height: 100%;
    overflow: hidden;
    color: var(--p-primary-500, #f59e0b);
    pointer-events: none;
}
.p-rating-half-overlay .p-rating-icon {
    width: 20px;
    height: 20px;
}
.p-rating.size-small .p-rating-half-overlay .p-rating-icon {
    width: 16px;
    height: 16px;
}
.p-rating.size-large .p-rating-half-overlay .p-rating-icon {
    width: 26px;
    height: 26px;
}

/* Cancel Button */
.p-rating-cancel-item {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 0.125rem;
    margin-right: 0.25rem;
    color: var(--p-surface-400);
    border-radius: 9999px;
    transition: color 150ms ease, background 150ms ease, transform 150ms ease;
    outline: none;
}
.p-rating-vertical .p-rating-cancel-item {
    margin-right: 0;
    margin-bottom: 0.25rem;
}
.p-rating-cancel-item:hover {
    color: var(--p-red-500, #ef4444);
    transform: scale(1.1);
}
.p-rating-cancel-item:focus-visible {
    box-shadow: 0 0 0 2px var(--p-red-500);
}
.p-rating-cancel-item svg {
    width: 16px;
    height: 16px;
}

/* Emoji / Template Mode */
.p-rating-emoji-item {
    font-size: 1.5rem;
    line-height: 1;
    filter: grayscale(100%);
    opacity: 0.5;
    transition: transform 150ms ease, filter 150ms ease, opacity 150ms ease;
}
.p-rating-emoji-item.p-rating-item-active,
.p-rating:not(.p-readonly):not(.p-disabled) .p-rating-emoji-item:hover {
    filter: grayscale(0%);
    opacity: 1;
    transform: scale(1.25);
}

/* Text Template Mode (e.g. A A A A A) */
.p-rating-text-item {
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--p-surface-300);
    transition: color 150ms ease, transform 150ms ease;
}
.p-rating-text-item.p-rating-item-active {
    color: var(--p-primary-500);
}

/* States */
.p-rating.p-readonly .p-rating-item,
.p-rating.p-readonly .p-rating-cancel-item {
    cursor: default;
}
.p-rating.p-disabled {
    opacity: 0.6;
    cursor: not-allowed;
}
.p-rating.p-disabled .p-rating-item,
.p-rating.p-disabled .p-rating-cancel-item {
    cursor: not-allowed;
    pointer-events: none;
}

/* ==================== DARK MODE ==================== */
.dark .p-rating-item {
    color: var(--p-surface-600);
}
.dark .p-rating-item.p-rating-item-active,
.dark .p-rating-half-overlay {
    color: var(--p-primary-400, #fbbf24);
}
.dark .p-rating-cancel-item {
    color: var(--p-surface-500);
}
.dark .p-rating-cancel-item:hover {
    color: var(--p-red-400);
}
.dark .p-rating-text-item {
    color: var(--p-surface-700);
}
.dark .p-rating-text-item.p-rating-item-active {
    color: var(--p-primary-400);
}
`;
var starFilledSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`;
var starEmptySvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`;
var cancelSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>`;
function RatingIsland(container, props) {
  injectIslandStyle("laughtale-rating", CSS6);
  const totalStars = props.stars ? Number(props.stars) : 5;
  const isAllowHalf = props.allowHalf === true || String(props.allowHalf) === "true";
  const isCancelAllowed = props.cancel !== false && props.allowCancel !== false && String(props.cancel) !== "false" && String(props.allowCancel) !== "false";
  const isVertical = props.orientation === "vertical";
  const isReadonly = props.readonlyMode === true || props.readonly === true || String(props.readonlyMode) === "true" || String(props.readonly) === "true";
  const isDisabled = props.disabled === true || String(props.disabled) === "true";
  const mode = props.mode || "stars";
  let emojiList = ["\u{1F621}", "\u{1F641}", "\u{1F610}", "\u{1F60A}", "\u{1F929}"];
  if (props.emojis) {
    if (Array.isArray(props.emojis)) emojiList = props.emojis;
    else if (typeof props.emojis === "string") {
      try {
        const parsed = JSON.parse(props.emojis);
        if (Array.isArray(parsed)) emojiList = parsed;
        else emojiList = props.emojis.split(",").map((s) => s.trim()).filter(Boolean);
      } catch {
        emojiList = props.emojis.split(",").map((s) => s.trim()).filter(Boolean);
      }
    }
  }
  const [getRating, setRating] = useControllableState({
    defaultValue: props.value ? Number(props.value) : 0,
    onChange: (val) => {
      syncValue(val);
    }
  });
  let hoverValue = null;
  function init() {
    const rating = getRating();
    const rootClasses = [
      "laughtale-rating",
      "p-rating",
      isVertical ? "p-rating-vertical" : "",
      props.size ? `size-${props.size}` : "",
      isReadonly ? "p-readonly" : "",
      isDisabled ? "p-disabled" : ""
    ].filter(Boolean).join(" ");
    container.className = rootClasses;
    container.setAttribute("role", "radiogroup");
    container.setAttribute("aria-label", `${rating} of ${totalStars} stars`);
    let cancelBtnHtml = "";
    if (isCancelAllowed && !isReadonly && !isDisabled) {
      cancelBtnHtml = `
                <button type="button" class="p-rating-cancel-item" aria-label="Clear rating" tabindex="0">
                    ${cancelSvg}
                </button>
            `;
    }
    let itemsHtml = "";
    for (let i = 1; i <= totalStars; i++) {
      if (mode === "emoji") {
        const emoji = emojiList[(i - 1) % emojiList.length] || "\u2B50";
        itemsHtml += `
                    <span class="p-rating-item p-rating-emoji-item" data-value="${i}" role="radio" aria-checked="${rating >= i ? "true" : "false"}" aria-label="${i} Star" tabindex="${isReadonly || isDisabled ? "-1" : "0"}">
                        ${emoji}
                    </span>
                `;
      } else if (mode === "template") {
        itemsHtml += `
                    <span class="p-rating-item p-rating-text-item" data-value="${i}" role="radio" aria-checked="${rating >= i ? "true" : "false"}" aria-label="${i} Star" tabindex="${isReadonly || isDisabled ? "-1" : "0"}">
                        A
                    </span>
                `;
      } else {
        itemsHtml += `
                    <span class="p-rating-item p-rating-star-item" data-value="${i}" role="radio" aria-checked="${rating >= i ? "true" : "false"}" aria-label="${i} Stars" tabindex="${isReadonly || isDisabled ? "-1" : "0"}">
                        <div class="p-rating-half-wrapper">
                            <span class="p-rating-icon p-rating-icon-off">${starEmptySvg}</span>
                            <span class="p-rating-half-overlay" style="display: none;">
                                <span class="p-rating-icon p-rating-icon-half">${starFilledSvg}</span>
                            </span>
                        </div>
                    </span>
                `;
      }
    }
    container.innerHTML = `
            ${cancelBtnHtml}
            <div class="p-rating-items" style="display: flex; ${isVertical ? "flex-direction: column;" : "align-items: center;"} gap: 0.375rem;">
                ${itemsHtml}
            </div>
        `;
    updateVisuals(rating);
    bindEvents();
  }
  function updateVisuals(activeVal) {
    const items = container.querySelectorAll(".p-rating-item");
    items.forEach((item) => {
      const starVal = Number(item.getAttribute("data-value"));
      const isFull = activeVal >= starVal;
      const isHalf = isAllowHalf && activeVal >= starVal - 0.5 && activeVal < starVal;
      if (mode === "stars") {
        const offIcon = item.querySelector(".p-rating-icon-off");
        const halfOverlay = item.querySelector(".p-rating-half-overlay");
        if (isFull) {
          item.classList.add("p-rating-item-active");
          if (offIcon) offIcon.innerHTML = starFilledSvg;
          if (halfOverlay) halfOverlay.style.display = "none";
        } else if (isHalf) {
          item.classList.remove("p-rating-item-active");
          if (offIcon) offIcon.innerHTML = starEmptySvg;
          if (halfOverlay) halfOverlay.style.display = "block";
        } else {
          item.classList.remove("p-rating-item-active");
          if (offIcon) offIcon.innerHTML = starEmptySvg;
          if (halfOverlay) halfOverlay.style.display = "none";
        }
      } else {
        item.classList.toggle("p-rating-item-active", isFull);
      }
      item.setAttribute("aria-checked", isFull || isHalf ? "true" : "false");
    });
    container.setAttribute("aria-label", `${activeVal} of ${totalStars} stars`);
  }
  function bindEvents() {
    if (isReadonly || isDisabled) return;
    const cancelBtn = container.querySelector(".p-rating-cancel-item");
    if (cancelBtn) {
      cancelBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        setRating(0);
        updateVisuals(0);
      });
      cancelBtn.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setRating(0);
          updateVisuals(0);
        }
      });
    }
    const items = container.querySelectorAll(".p-rating-item");
    items.forEach((item) => {
      const starVal = Number(item.getAttribute("data-value"));
      item.addEventListener("mousemove", (e) => {
        if (isAllowHalf && mode === "stars") {
          const rect = item.getBoundingClientRect();
          const isLeftHalf = e.clientX - rect.left < rect.width / 2;
          hoverValue = isLeftHalf ? starVal - 0.5 : starVal;
        } else {
          hoverValue = starVal;
        }
        updateVisuals(hoverValue);
      });
      item.addEventListener("click", (e) => {
        let targetVal = starVal;
        if (isAllowHalf && mode === "stars") {
          const rect = item.getBoundingClientRect();
          const isLeftHalf = e.clientX - rect.left < rect.width / 2;
          targetVal = isLeftHalf ? starVal - 0.5 : starVal;
        }
        const current = getRating();
        const finalVal = current === targetVal && isCancelAllowed ? 0 : targetVal;
        setRating(finalVal);
        updateVisuals(finalVal);
      });
      item.addEventListener("keydown", (e) => {
        const current = getRating();
        const step = isAllowHalf ? 0.5 : 1;
        if (e.key === "ArrowRight" || e.key === "ArrowUp") {
          e.preventDefault();
          const nextVal = Math.min(totalStars, current + step);
          setRating(nextVal);
          updateVisuals(nextVal);
          focusStar(Math.ceil(nextVal));
        } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
          e.preventDefault();
          const prevVal = Math.max(0, current - step);
          setRating(prevVal);
          updateVisuals(prevVal);
          focusStar(Math.ceil(prevVal));
        } else if (e.key === " " || e.key === "Enter") {
          e.preventDefault();
          setRating(starVal);
          updateVisuals(starVal);
        } else if (e.key === "Backspace" || e.key === "Delete") {
          e.preventDefault();
          setRating(0);
          updateVisuals(0);
        }
      });
    });
    container.addEventListener("mouseleave", () => {
      hoverValue = null;
      updateVisuals(getRating());
    });
  }
  function focusStar(starNum) {
    const target = container.querySelector(`.p-rating-item[data-value="${Math.max(1, starNum)}"]`);
    target?.focus();
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
      hidden.value = String(val);
    }
    container.dispatchEvent(new CustomEvent("rating:change", {
      bubbles: true,
      detail: { value: val }
    }));
    container.dispatchEvent(new CustomEvent("change", {
      bubbles: true,
      detail: { value: val }
    }));
  }
  init();
}

// src/components/accordion.ts
var SVG_ICONS = {
  chevronDown: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>',
  chevronRight: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>',
  folder: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/></svg>',
  folderOpen: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 14 1.5-6h13l-2.5 6H6Z"/><path d="M4 18h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2Z"/></svg>',
  plus: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg>',
  minus: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/></svg>',
  check: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
  user: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/></svg>',
  shield: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/></svg>',
  zap: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>'
};
var ACCORDION_CSS = `
.p-accordion {
    display: flex;
    flex-direction: column;
    width: 100%;
    border: 1px solid var(--p-surface-200, #e2e8f0);
    border-radius: var(--p-border-radius-md, 6px);
    overflow: hidden;
    background: var(--p-surface-0, #ffffff);
    font-family: var(--p-font-family, inherit);
    box-sizing: border-box;
}

.p-accordionpanel {
    border-bottom: 1px solid var(--p-surface-200, #e2e8f0);
    transition: background-color 0.2s ease;
}
.p-accordionpanel:last-child {
    border-bottom: none;
}

.p-accordionheader {
    margin: 0;
    padding: 0;
}

.p-accordionheader-toggle {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 1rem 1.25rem;
    font-weight: 600;
    font-size: 0.9375rem;
    color: var(--p-surface-700, #334155);
    background: var(--p-surface-0, #ffffff);
    border: none;
    cursor: pointer;
    text-align: left;
    transition: background-color 0.2s cubic-bezier(0.2, 0, 0, 1), color 0.2s cubic-bezier(0.2, 0, 0, 1);
    box-sizing: border-box;
}
.p-accordionheader-toggle:hover:not(:disabled) {
    background: var(--p-surface-50, #f8fafc);
    color: var(--p-surface-900, #0f172a);
}
.p-accordionpanel.p-accordionpanel-active > .p-accordionheader > .p-accordionheader-toggle {
    color: var(--p-primary-600, #10b981);
    font-weight: 700;
}

.p-accordionheader-toggle-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: var(--p-surface-400, #94a3b8);
    transition: transform 0.3s cubic-bezier(0.2, 0, 0, 1), color 0.2s ease;
    flex-shrink: 0;
}
.p-accordionpanel.p-accordionpanel-active > .p-accordionheader > .p-accordionheader-toggle .p-accordionheader-toggle-icon {
    color: var(--p-primary-600, #10b981);
}
.p-accordion-css-indicator .p-accordionpanel.p-accordionpanel-active .p-accordionheader-toggle-icon {
    transform: rotate(180deg);
}

/* 60fps CSS Grid Smooth Collapse/Expand Transition */
.p-accordioncontent {
    display: grid;
    grid-template-rows: 0fr;
    transition: grid-template-rows 280ms cubic-bezier(0.2, 0, 0, 1);
    background: var(--p-surface-0, #ffffff);
    overflow: hidden;
}
.p-accordionpanel.p-accordionpanel-active > .p-accordioncontent {
    grid-template-rows: 1fr;
}

.p-accordioncontent-wrapper {
    min-height: 0;
    overflow: hidden;
}

.p-accordioncontent-content {
    padding: 0.25rem 1.25rem 1.25rem 1.25rem;
    color: var(--p-surface-600, #475569);
    font-size: 0.875rem;
    line-height: 1.65;
    transition: opacity 220ms ease, transform 240ms cubic-bezier(0.2, 0, 0, 1);
    opacity: 0;
    transform: translateY(-6px);
}
.p-accordionpanel.p-accordionpanel-active > .p-accordioncontent .p-accordioncontent-content {
    opacity: 1;
    transform: translateY(0);
}

.p-accordionpanel.p-disabled {
    opacity: 0.5;
}
.p-accordionpanel.p-disabled .p-accordionheader-toggle {
    cursor: not-allowed;
}

/* Radio variant */
.p-accordion-radio-circle {
    width: 1.125rem;
    height: 1.125rem;
    border-radius: 9999px;
    border: 2px solid var(--p-surface-300, #cbd5e1);
    background: var(--p-surface-0, #ffffff);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin-right: 0.75rem;
    flex-shrink: 0;
    transition: border-color 0.2s ease;
}
.p-accordionpanel.p-accordionpanel-active .p-accordion-radio-circle {
    border-color: var(--p-primary-600, #10b981);
}
.p-accordion-radio-inner {
    width: 0.5rem;
    height: 0.5rem;
    border-radius: 9999px;
    background: var(--p-primary-600, #10b981);
    display: none;
    transition: transform 0.2s cubic-bezier(0.2, 0, 0, 1);
}
.p-accordionpanel.p-accordionpanel-active .p-accordion-radio-inner {
    display: block;
    animation: pRadioPop 0.2s cubic-bezier(0.2, 0, 0, 1);
}
@keyframes pRadioPop {
    0% { transform: scale(0); }
    100% { transform: scale(1); }
}

/* Controlled top buttons */
.p-accordion-top-controls {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 1rem;
}
.p-accordion-ctrl-btn {
    padding: 0.45rem 0.9rem;
    font-size: 0.8125rem;
    font-weight: 600;
    border-radius: 6px;
    border: 1px solid var(--p-surface-300, #cbd5e1);
    background: var(--p-surface-0, #ffffff);
    color: var(--p-surface-700, #334155);
    cursor: pointer;
    transition: all 0.2s cubic-bezier(0.2, 0, 0, 1);
}
.p-accordion-ctrl-btn:hover {
    background: var(--p-surface-100, #f1f5f9);
}
.p-accordion-ctrl-btn.p-highlight {
    background: var(--p-primary-500, #10b981);
    border-color: var(--p-primary-500, #10b981);
    color: #ffffff;
}

/* Dark Mode Tokens */
.dark .p-accordion,
[data-theme="dark"] .p-accordion {
    background: var(--p-surface-900, #0f172a) !important;
    border-color: var(--p-surface-700, #334155) !important;
    color: var(--p-surface-100, #f8fafc) !important;
}
.dark .p-accordionpanel,
[data-theme="dark"] .p-accordionpanel {
    border-color: var(--p-surface-700, #334155) !important;
}
.dark .p-accordionheader-toggle,
[data-theme="dark"] .p-accordionheader-toggle {
    background: var(--p-surface-900, #0f172a) !important;
    color: var(--p-surface-200, #e2e8f0) !important;
}
.dark .p-accordionheader-toggle:hover:not(:disabled),
[data-theme="dark"] .p-accordionheader-toggle:hover:not(:disabled) {
    background: var(--p-surface-800, #1e293b) !important;
    color: var(--p-surface-0, #ffffff) !important;
}
.dark .p-accordionpanel.p-accordionpanel-active > .p-accordionheader > .p-accordionheader-toggle,
[data-theme="dark"] .p-accordionpanel.p-accordionpanel-active > .p-accordionheader > .p-accordionheader-toggle {
    color: var(--p-primary-400, #34d399) !important;
}
.dark .p-accordioncontent,
[data-theme="dark"] .p-accordioncontent {
    background: var(--p-surface-900, #0f172a) !important;
}
.dark .p-accordioncontent-content,
[data-theme="dark"] .p-accordioncontent-content {
    color: var(--p-surface-300, #cbd5e1) !important;
}
.dark .p-accordion-ctrl-btn,
[data-theme="dark"] .p-accordion-ctrl-btn {
    background: var(--p-surface-900, #0f172a) !important;
    border-color: var(--p-surface-700, #334155) !important;
    color: var(--p-surface-200, #e2e8f0) !important;
}
.dark .p-accordion-ctrl-btn.p-highlight,
[data-theme="dark"] .p-accordion-ctrl-btn.p-highlight {
    background: var(--p-primary-500, #10b981) !important;
    color: #ffffff !important;
}
.dark .p-accordion-radio-circle,
[data-theme="dark"] .p-accordion-radio-circle {
    background: var(--p-surface-950, #020617) !important;
    border-color: var(--p-surface-700, #334155) !important;
}
`;
function AccordionIsland(container, props) {
  injectIslandStyle("accordion", ACCORDION_CSS);
  const tabs = (props.tabs || []).map((t, i) => ({
    id: t.id || String(i),
    header: t.header || `Header ${i + 1}`,
    content: t.content || "",
    icon: t.icon,
    badge: t.badge,
    subtitle: t.subtitle,
    price: t.price,
    disabled: !!t.disabled,
    toggleIcon: t.toggleIcon
  }));
  const isMultiple = !!props.multiple;
  const isControlled = !!props.controlled;
  const withRadio = !!props.withRadio;
  const customIndicator = props.customIndicator || "css";
  let activeKeys = /* @__PURE__ */ new Set();
  if (props.value !== void 0 && props.value !== null) {
    if (Array.isArray(props.value)) {
      props.value.forEach((v) => activeKeys.add(String(v)));
    } else {
      activeKeys.add(String(props.value));
    }
  } else if (props.activeIndex !== void 0 && props.activeIndex !== null) {
    if (Array.isArray(props.activeIndex)) {
      props.activeIndex.forEach((i) => activeKeys.add(String(i)));
    } else {
      activeKeys.add(String(props.activeIndex));
    }
  } else if (tabs.length > 0) {
    activeKeys.add("0");
  }
  function togglePanel(idxStr) {
    const idx = Number(idxStr);
    if (tabs[idx]?.disabled) return;
    const isOpening = !activeKeys.has(idxStr);
    if (!isMultiple) {
      container.querySelectorAll(".p-accordionpanel").forEach((panel) => {
        const k = panel.getAttribute("data-panel-idx");
        if (k !== idxStr) {
          panel.classList.remove("p-accordionpanel-active");
          const toggleBtn = panel.querySelector(".p-accordionheader-toggle");
          if (toggleBtn) toggleBtn.setAttribute("aria-expanded", "false");
          if (customIndicator === "match") {
            const iconSpan = panel.querySelector(".p-accordionheader-toggle-icon");
            if (iconSpan) iconSpan.innerHTML = SVG_ICONS.folder;
          } else if (tabs[Number(k)]?.toggleIcon === "plusMinus") {
            const iconSpan = panel.querySelector(".p-accordionheader-toggle-icon");
            if (iconSpan) iconSpan.innerHTML = SVG_ICONS.plus;
          }
        }
      });
      activeKeys.clear();
    }
    const targetPanel = container.querySelector(`.p-accordionpanel[data-panel-idx="${idxStr}"]`);
    if (targetPanel) {
      if (isOpening) {
        activeKeys.add(idxStr);
        targetPanel.classList.add("p-accordionpanel-active");
        targetPanel.querySelector(".p-accordionheader-toggle")?.setAttribute("aria-expanded", "true");
        if (customIndicator === "match") {
          const iconSpan = targetPanel.querySelector(".p-accordionheader-toggle-icon");
          if (iconSpan) iconSpan.innerHTML = SVG_ICONS.folderOpen;
        } else if (tabs[idx]?.toggleIcon === "plusMinus") {
          const iconSpan = targetPanel.querySelector(".p-accordionheader-toggle-icon");
          if (iconSpan) iconSpan.innerHTML = SVG_ICONS.minus;
        }
      } else {
        activeKeys.delete(idxStr);
        targetPanel.classList.remove("p-accordionpanel-active");
        targetPanel.querySelector(".p-accordionheader-toggle")?.setAttribute("aria-expanded", "false");
        if (customIndicator === "match") {
          const iconSpan = targetPanel.querySelector(".p-accordionheader-toggle-icon");
          if (iconSpan) iconSpan.innerHTML = SVG_ICONS.folder;
        } else if (tabs[idx]?.toggleIcon === "plusMinus") {
          const iconSpan = targetPanel.querySelector(".p-accordionheader-toggle-icon");
          if (iconSpan) iconSpan.innerHTML = SVG_ICONS.plus;
        }
      }
    }
    if (isControlled) {
      container.querySelectorAll(".p-accordion-ctrl-btn").forEach((btn) => {
        const k = btn.getAttribute("data-ctrl-idx");
        btn.classList.toggle("p-highlight", k !== null && activeKeys.has(k));
      });
    }
    container.dispatchEvent(new CustomEvent("accordion:change", {
      bubbles: true,
      detail: { value: Array.from(activeKeys) }
    }));
  }
  function renderInitial() {
    let topControlsHtml = "";
    if (isControlled) {
      topControlsHtml = `
                <div class="p-accordion-top-controls">
                    ${tabs.map((_, i) => {
        const k = String(i);
        const isActive = activeKeys.has(k);
        return `
                            <button type="button" class="p-accordion-ctrl-btn ${isActive ? "p-highlight" : ""}" data-ctrl-idx="${k}">
                                ${i + 1}
                            </button>
                        `;
      }).join("")}
                </div>
            `;
    }
    const panelsHtml = tabs.map((tab, idx) => {
      const k = String(idx);
      const isActive = activeKeys.has(k);
      const disabledClass = tab.disabled ? "p-disabled" : "";
      const activeClass = isActive ? "p-accordionpanel-active" : "";
      const headerId = `acc-header-${idx}`;
      const contentId = `acc-content-${idx}`;
      let indicatorSvg = SVG_ICONS.chevronDown;
      if (customIndicator === "match") {
        indicatorSvg = isActive ? SVG_ICONS.folderOpen : SVG_ICONS.folder;
      } else if (tab.toggleIcon === "plusMinus") {
        indicatorSvg = isActive ? SVG_ICONS.minus : SVG_ICONS.plus;
      }
      let radioHtml = withRadio ? `
                <span class="p-accordion-radio-circle">
                    <span class="p-accordion-radio-inner"></span>
                </span>
            ` : "";
      let customIconHtml = "";
      if (tab.icon) {
        if (tab.icon === "user") customIconHtml = `<span style="display: inline-flex; align-items: center; margin-right: 0.5rem; color: var(--p-surface-400);">${SVG_ICONS.user}</span>`;
        else if (tab.icon === "shield") customIconHtml = `<span style="display: inline-flex; align-items: center; margin-right: 0.5rem; color: var(--p-primary-500);">${SVG_ICONS.shield}</span>`;
        else if (tab.icon === "zap") customIconHtml = `<span style="display: inline-flex; align-items: center; margin-right: 0.5rem; color: #f59e0b;">${SVG_ICONS.zap}</span>`;
      }
      let extraHeaderHtml = "";
      if (tab.badge) {
        extraHeaderHtml += `<span style="background: var(--p-primary-100, #dcfce7); color: var(--p-primary-700, #15803d); font-size: 0.75rem; font-weight: 700; padding: 0.15rem 0.5rem; border-radius: 9999px; margin-left: 0.5rem;">${tab.badge}</span>`;
      }
      if (tab.price) {
        extraHeaderHtml += `<span style="font-weight: 700; font-size: 0.875rem; color: var(--p-surface-900); margin-left: auto; margin-right: 1rem;">${tab.price}</span>`;
      }
      return `
                <div class="p-accordionpanel ${activeClass} ${disabledClass}" data-panel-idx="${k}">
                    <div class="p-accordionheader" role="heading" aria-level="2">
                        <button type="button" 
                                class="p-accordionheader-toggle" 
                                id="${headerId}"
                                aria-controls="${contentId}"
                                aria-expanded="${isActive ? "true" : "false"}"
                                aria-disabled="${tab.disabled ? "true" : "false"}"
                                ${tab.disabled ? "disabled" : ""}
                                data-toggle-idx="${k}">
                            <div style="display: flex; align-items: center; width: 100%;">
                                ${radioHtml}
                                ${customIconHtml}
                                <span class="p-accordionheader-title">${tab.header}</span>
                                ${extraHeaderHtml}
                            </div>
                            <span class="p-accordionheader-toggle-icon">
                                ${indicatorSvg}
                            </span>
                        </button>
                    </div>
                    <div class="p-accordioncontent" 
                         id="${contentId}" 
                         role="region" 
                         aria-labelledby="${headerId}">
                        <div class="p-accordioncontent-wrapper">
                            <div class="p-accordioncontent-content">
                                ${tab.content}
                            </div>
                        </div>
                    </div>
                </div>
            `;
    }).join("");
    const cssIndicatorClass = customIndicator === "css" ? "p-accordion-css-indicator" : "";
    container.innerHTML = `
            ${topControlsHtml}
            <div class="p-accordion p-component ${cssIndicatorClass}" role="tablist">
                ${panelsHtml}
            </div>
        `;
    bindEvents();
  }
  function bindEvents() {
    container.querySelectorAll(".p-accordion-ctrl-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const k = btn.getAttribute("data-ctrl-idx");
        if (k !== null) togglePanel(k);
      });
    });
    const headerButtons = container.querySelectorAll(".p-accordionheader-toggle");
    headerButtons.forEach((btn, index) => {
      btn.addEventListener("click", () => {
        const k = btn.getAttribute("data-toggle-idx");
        if (k !== null) togglePanel(k);
      });
      btn.addEventListener("keydown", (e) => {
        if (e.key === "ArrowDown") {
          e.preventDefault();
          const next = (index + 1) % headerButtons.length;
          headerButtons[next]?.focus();
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          const prev = (index - 1 + headerButtons.length) % headerButtons.length;
          headerButtons[prev]?.focus();
        } else if (e.key === "Home") {
          e.preventDefault();
          headerButtons[0]?.focus();
        } else if (e.key === "End") {
          e.preventDefault();
          headerButtons[headerButtons.length - 1]?.focus();
        }
      });
    });
  }
  renderInitial();
}

// src/components/tabs.ts
var TABS_CSS = `
.p-tabs {
    display: flex;
    flex-direction: column;
    width: 100%;
    box-sizing: border-box;
}

.p-tablist {
    display: flex;
    position: relative;
    background: transparent;
    border-bottom: 1px solid var(--p-surface-200, #e2e8f0);
    box-sizing: border-box;
    align-items: center;
    width: 100%;
    overflow: hidden;
}

.p-tablist-content {
    display: flex;
    overflow-x: auto;
    scrollbar-width: none;
    -ms-overflow-style: none;
    position: relative;
    flex: 1 1 auto;
    scroll-behavior: smooth;
}
.p-tablist-content::-webkit-scrollbar {
    display: none;
}

.p-tablist-tab-list {
    display: flex;
    position: relative;
    margin: 0;
    padding: 0;
    list-style-type: none;
    gap: 0;
    width: auto;
}

.p-tab {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.125rem;
    border: none;
    background: transparent;
    color: var(--p-surface-500, #64748b);
    font-weight: 600;
    font-size: 0.875rem;
    cursor: pointer;
    text-decoration: none;
    border-bottom: 2px solid transparent;
    margin-bottom: -1px;
    transition: color 0.15s ease, border-color 0.15s ease;
    outline: none;
    user-select: none;
    position: relative;
    z-index: 2;
    white-space: nowrap;
}

.p-tab:hover:not(.p-tab-active):not(:disabled):not([aria-disabled="true"]) {
    color: var(--p-surface-800, #1e293b);
}

.p-tab-active {
    color: var(--p-primary-600, #059669);
    border-bottom-color: var(--p-primary-500, #10b981);
    font-weight: 700;
}

.p-tab:disabled,
.p-tab[aria-disabled="true"] {
    opacity: 0.35;
    cursor: not-allowed;
}

.p-tab:focus-visible {
    outline: 2px solid var(--p-primary-500, #10b981);
    outline-offset: -2px;
}

/* Active indicator bar */
.p-tablist-active-bar {
    position: absolute;
    bottom: -1px;
    height: 2px;
    background: var(--p-primary-500, #10b981);
    transition: left 0.2s cubic-bezier(0.2, 0, 0, 1), width 0.2s cubic-bezier(0.2, 0, 0, 1);
    z-index: 3;
    pointer-events: none;
}

/* Smooth Gradient Fade Mask Navigation Buttons */
.p-tablist-prev-button,
.p-tablist-next-button {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 3.5rem;
    display: flex;
    align-items: center;
    border: none;
    cursor: pointer;
    z-index: 10;
    transition: opacity 0.25s ease, color 0.15s ease;
    outline: none;
    color: var(--p-surface-600, #475569);
    padding: 0;
    box-shadow: none;
}

.p-tablist-prev-button {
    left: 0;
    justify-content: flex-start;
    padding-left: 0.5rem;
    background: linear-gradient(to right, var(--p-surface-50, #f8fafc) 35%, rgba(248, 250, 252, 0.7) 65%, transparent 100%);
}

.p-tablist-next-button {
    right: 0;
    justify-content: flex-end;
    padding-right: 0.5rem;
    background: linear-gradient(to left, var(--p-surface-50, #f8fafc) 35%, rgba(248, 250, 252, 0.7) 65%, transparent 100%);
}

.p-tablist-prev-button:hover:not(:disabled),
.p-tablist-next-button:hover:not(:disabled) {
    color: var(--p-text-color, #0f172a);
}

.p-tablist-prev-button:disabled,
.p-tablist-next-button:disabled {
    opacity: 0;
    pointer-events: none;
}

/* Tab Panels */
.p-tabpanels {
    padding: 1.25rem 0;
    width: 100%;
    box-sizing: border-box;
}

.p-tabpanel {
    display: none;
    width: 100%;
}
.p-tabpanel.p-tabpanel-active {
    display: block;
    animation: p-tabpanel-fadein 0.2s cubic-bezier(0.2, 0, 0, 1);
}

@keyframes p-tabpanel-fadein {
    from { opacity: 0; transform: translateY(2px); }
    to { opacity: 1; transform: translateY(0); }
}

/* Custom Capsule Indicator */
.p-tablist-capsule {
    border-bottom: none;
    background: var(--p-surface-100, #f1f5f9);
    padding: 0.25rem;
    border-radius: var(--p-border-radius-md, 6px);
    width: fit-content;
}
.p-tablist-capsule .p-tablist-active-bar {
    display: none;
}
.p-tablist-capsule .p-tab {
    border-bottom: none;
    margin-bottom: 0;
    border-radius: var(--p-border-radius-sm, 4px);
    padding: 0.5rem 1rem;
    color: var(--p-surface-600, #475569);
}
.p-tablist-capsule .p-tab-active {
    background: var(--p-surface-0, #ffffff);
    color: var(--p-text-color, #0f172a);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

/* Dark Mode Tokens */
.dark .p-tablist,
[data-theme="dark"] .p-tablist {
    border-bottom-color: var(--p-surface-700, #334155);
}
.dark .p-tab,
[data-theme="dark"] .p-tab {
    color: var(--p-surface-400, #94a3b8);
}
.dark .p-tab:hover:not(.p-tab-active):not(:disabled):not([aria-disabled="true"]),
[data-theme="dark"] .p-tab:hover:not(.p-tab-active):not(:disabled):not([aria-disabled="true"]) {
    color: var(--p-surface-100, #f8fafc);
}
.dark .p-tab-active,
[data-theme="dark"] .p-tab-active {
    color: var(--p-primary-400, #34d399);
    border-bottom-color: var(--p-primary-400, #34d399);
}
.dark .p-tablist-active-bar,
[data-theme="dark"] .p-tablist-active-bar {
    background: var(--p-primary-400, #34d399);
}
.dark .p-tablist-prev-button,
[data-theme="dark"] .p-tablist-prev-button {
    background: linear-gradient(to right, var(--p-surface-900, #0f172a) 35%, rgba(15, 23, 42, 0.7) 65%, transparent 100%);
    color: var(--p-surface-400, #94a3b8);
}
.dark .p-tablist-next-button,
[data-theme="dark"] .p-tablist-next-button {
    background: linear-gradient(to left, var(--p-surface-900, #0f172a) 35%, rgba(15, 23, 42, 0.7) 65%, transparent 100%);
    color: var(--p-surface-400, #94a3b8);
}
.dark .p-tablist-prev-button:hover:not(:disabled),
.dark .p-tablist-next-button:hover:not(:disabled),
[data-theme="dark"] .p-tablist-prev-button:hover:not(:disabled),
[data-theme="dark"] .p-tablist-next-button:hover:not(:disabled) {
    color: #ffffff;
}
.dark .p-tablist-capsule,
[data-theme="dark"] .p-tablist-capsule {
    background: var(--p-surface-800, #1e293b);
}
.dark .p-tablist-capsule .p-tab-active,
[data-theme="dark"] .p-tablist-capsule .p-tab-active {
    background: var(--p-surface-900, #0f172a);
    color: var(--p-surface-0, #f8fafc);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
}
`;
var CHEVRON_LEFT_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>`;
var CHEVRON_RIGHT_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>`;
function TabsIsland(container, props) {
  injectIslandStyle("tabs", TABS_CSS);
  const rootEl = container.querySelector(".p-tabs") || container;
  rootEl.classList.add("p-tabs", "p-component");
  const isScrollable = !!props.scrollable || rootEl.hasAttribute("data-scrollable");
  const selectOnFocus = !!props.selectOnFocus || rootEl.hasAttribute("data-select-on-focus");
  const isLazy = !!props.lazy || rootEl.hasAttribute("data-lazy");
  let activeValue = String(props.value || rootEl.getAttribute("data-value") || "");
  const tabList = rootEl.querySelector(".p-tablist");
  const tabPanels = rootEl.querySelector(".p-tabpanels");
  if (!tabList) return;
  let contentContainer = tabList.querySelector(".p-tablist-content");
  if (!contentContainer) {
    contentContainer = document.createElement("div");
    contentContainer.className = "p-tablist-content";
    let tabUl = tabList.querySelector(".p-tablist-tab-list, ul");
    if (!tabUl) {
      tabUl = document.createElement("ul");
      tabUl.className = "p-tablist-tab-list";
      const directTabs = Array.from(tabList.querySelectorAll(":scope > .p-tab, :scope > [data-tab-value]"));
      directTabs.forEach((t) => tabUl.appendChild(t));
    } else {
      tabUl.classList.add("p-tablist-tab-list");
    }
    contentContainer.appendChild(tabUl);
    tabList.appendChild(contentContainer);
  }
  const tabsListWrapper = contentContainer.querySelector(".p-tablist-tab-list, ul") || contentContainer;
  let activeBar = contentContainer.querySelector(".p-tablist-active-bar");
  const isCapsule = tabList.classList.contains("p-tablist-capsule");
  if (!activeBar && !isCapsule) {
    activeBar = document.createElement("div");
    activeBar.className = "p-tablist-active-bar";
    contentContainer.appendChild(activeBar);
  }
  function getTabs() {
    return Array.from(tabsListWrapper.querySelectorAll(".p-tab, [data-tab-value]"));
  }
  function getPanels() {
    return Array.from(tabPanels ? tabPanels.querySelectorAll(":scope > .p-tabpanel, .p-tabpanel") : []);
  }
  const allTabs = getTabs();
  if (!activeValue && allTabs.length > 0) {
    activeValue = allTabs[0].getAttribute("data-value") || allTabs[0].getAttribute("value") || "0";
  }
  function updateActiveBar(targetTab) {
    if (!activeBar || isCapsule) return;
    if (!targetTab) {
      activeBar.style.width = "0px";
      return;
    }
    const left = targetTab.offsetLeft;
    const width = targetTab.offsetWidth;
    activeBar.style.left = `${left}px`;
    activeBar.style.width = `${width}px`;
  }
  function update() {
    const tabs = getTabs();
    const panels = getPanels();
    let activeTabEl = null;
    tabs.forEach((tab) => {
      const val = tab.getAttribute("data-value") || tab.getAttribute("value");
      const isActive = val === activeValue;
      tab.classList.toggle("p-tab-active", isActive);
      tab.setAttribute("aria-selected", isActive ? "true" : "false");
      tab.setAttribute("tabindex", isActive ? "0" : "-1");
      if (isActive) {
        activeTabEl = tab;
      }
    });
    panels.forEach((panel) => {
      const val = panel.getAttribute("data-value") || panel.getAttribute("value");
      const isActive = val === activeValue;
      panel.classList.toggle("p-tabpanel-active", isActive);
    });
    rootEl.setAttribute("data-value", activeValue);
    updateActiveBar(activeTabEl);
    if (isScrollable && activeTabEl && contentContainer) {
      const containerLeft = contentContainer.scrollLeft;
      const containerRight = containerLeft + contentContainer.clientWidth;
      const tabLeft = activeTabEl.offsetLeft;
      const tabRight = tabLeft + activeTabEl.offsetWidth;
      if (tabLeft < containerLeft) {
        contentContainer.scrollTo({ left: tabLeft - 40, behavior: "smooth" });
      } else if (tabRight > containerRight) {
        contentContainer.scrollTo({ left: tabRight - contentContainer.clientWidth + 40, behavior: "smooth" });
      }
    }
  }
  function setActiveTab(value) {
    const targetTab = getTabs().find((t) => (t.getAttribute("data-value") || t.getAttribute("value")) === value);
    if (targetTab && (targetTab.hasAttribute("disabled") || targetTab.getAttribute("aria-disabled") === "true")) {
      return;
    }
    activeValue = value;
    update();
    container.dispatchEvent(new CustomEvent("tabs:change", {
      bubbles: true,
      detail: { value: activeValue }
    }));
  }
  allTabs.forEach((tab, idx) => {
    const val = tab.getAttribute("data-value") || tab.getAttribute("value") || String(idx);
    const isDisabled = tab.hasAttribute("disabled") || tab.getAttribute("aria-disabled") === "true";
    tab.addEventListener("click", (e) => {
      e.preventDefault();
      if (isDisabled) return;
      setActiveTab(val);
    });
    if (selectOnFocus) {
      tab.addEventListener("focus", () => {
        if (!isDisabled) setActiveTab(val);
      });
    }
    tab.addEventListener("keydown", (e) => {
      const tabs = getTabs().filter((t) => !t.hasAttribute("disabled") && t.getAttribute("aria-disabled") !== "true");
      const currentIdx = tabs.indexOf(tab);
      if (currentIdx === -1) return;
      let nextIdx = -1;
      if (e.key === "ArrowRight") {
        nextIdx = (currentIdx + 1) % tabs.length;
      } else if (e.key === "ArrowLeft") {
        nextIdx = (currentIdx - 1 + tabs.length) % tabs.length;
      } else if (e.key === "Home") {
        nextIdx = 0;
      } else if (e.key === "End") {
        nextIdx = tabs.length - 1;
      }
      if (nextIdx !== -1) {
        e.preventDefault();
        const nextTab = tabs[nextIdx];
        nextTab.focus();
        const nextVal = nextTab.getAttribute("data-value") || nextTab.getAttribute("value") || String(nextIdx);
        setActiveTab(nextVal);
      }
    });
  });
  if (isScrollable && contentContainer) {
    let checkScrollButtons2 = function() {
      if (!contentContainer || !prevBtn || !nextBtn) return;
      const { scrollLeft, scrollWidth, clientWidth } = contentContainer;
      prevBtn.disabled = scrollLeft <= 4;
      nextBtn.disabled = scrollLeft + clientWidth >= scrollWidth - 4;
    };
    var checkScrollButtons = checkScrollButtons2;
    let prevBtn = tabList.querySelector(".p-tablist-prev-button");
    let nextBtn = tabList.querySelector(".p-tablist-next-button");
    if (!prevBtn) {
      prevBtn = document.createElement("button");
      prevBtn.type = "button";
      prevBtn.className = "p-tablist-prev-button";
      prevBtn.setAttribute("aria-label", "Previous Tab");
      prevBtn.innerHTML = CHEVRON_LEFT_SVG;
      tabList.insertBefore(prevBtn, contentContainer);
    }
    if (!nextBtn) {
      nextBtn = document.createElement("button");
      nextBtn.type = "button";
      nextBtn.className = "p-tablist-next-button";
      nextBtn.setAttribute("aria-label", "Next Tab");
      nextBtn.innerHTML = CHEVRON_RIGHT_SVG;
      tabList.appendChild(nextBtn);
    }
    prevBtn.addEventListener("click", () => {
      contentContainer?.scrollBy({ left: -220, behavior: "smooth" });
    });
    nextBtn.addEventListener("click", () => {
      contentContainer?.scrollBy({ left: 220, behavior: "smooth" });
    });
    contentContainer.addEventListener("scroll", checkScrollButtons2);
    setTimeout(checkScrollButtons2, 50);
    window.addEventListener("resize", checkScrollButtons2);
  }
  const demoCard = container.closest("[data-tabs-demo]") || container.parentElement;
  if (demoCard) {
    demoCard.querySelectorAll(":scope > * [data-tabs-target], :scope > [data-tabs-target]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const targetTab = btn.getAttribute("data-tabs-target");
        if (targetTab) setActiveTab(targetTab);
      });
    });
  }
  setTimeout(update, 50);
  window.addEventListener("resize", () => {
    const tabs = getTabs();
    const activeTabEl = tabs.find((t) => (t.getAttribute("data-value") || t.getAttribute("value")) === activeValue);
    updateActiveBar(activeTabEl || null);
  });
}

// src/composables/useDisclosure.ts
function useDisclosure(options = {}) {
  let isOpen = Boolean(options.defaultIsOpen);
  const listeners = /* @__PURE__ */ new Set();
  function notify() {
    options.onToggle?.(isOpen);
    listeners.forEach((fn) => fn(isOpen));
  }
  function open() {
    if (!isOpen) {
      isOpen = true;
      options.onOpen?.();
      notify();
    }
  }
  function close() {
    if (isOpen) {
      isOpen = false;
      options.onClose?.();
      notify();
    }
  }
  function toggle() {
    if (isOpen) close();
    else open();
  }
  function setOpen(value) {
    if (value) open();
    else close();
  }
  function onChange(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  }
  return {
    get isOpen() {
      return isOpen;
    },
    open,
    close,
    toggle,
    setOpen,
    onChange
  };
}

// src/composables/useClickOutside.ts
function useClickOutside(target, handler, options = {}) {
  if (!target || typeof document === "undefined") return { destroy: () => {
  } };
  function listener(e) {
    const path = e.composedPath ? e.composedPath() : [];
    const clickedNode = e.target;
    if (target && (target === clickedNode || target.contains(clickedNode) || path.includes(target))) {
      return;
    }
    if (options.ignoreElements) {
      for (const el of options.ignoreElements) {
        if (el && (el === clickedNode || el.contains(clickedNode) || path.includes(el))) {
          return;
        }
      }
    }
    handler(e);
  }
  const capture = options.capture ?? false;
  document.addEventListener("pointerdown", listener, { capture });
  document.addEventListener("touchstart", listener, { capture });
  return {
    destroy: () => {
      document.removeEventListener("pointerdown", listener, { capture });
      document.removeEventListener("touchstart", listener, { capture });
    }
  };
}

// src/composables/useDebounce.ts
function useDebounce(fn, delayMs = 250) {
  let timer = null;
  const debounced = (...args) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fn(...args);
      timer = null;
    }, delayMs);
  };
  debounced.cancel = () => {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
  };
  debounced.flush = (...args) => {
    debounced.cancel();
    fn(...args);
  };
  return debounced;
}

// src/components/autocomplete.ts
var CSS7 = `
.laughtale-autocomplete {
    position: relative;
    display: inline-flex;
    align-items: stretch;
    font-family: var(--p-font-family, inherit);
    box-sizing: border-box;
}
.laughtale-autocomplete.fluid {
    width: 100%;
}
.laughtale-autocomplete:not(.fluid) {
    width: 100%;
    max-width: 320px;
}

.ac-input-container {
    display: flex;
    align-items: center;
    flex: 1;
    min-width: 0;
    background: var(--p-surface-0);
    border: 1px solid var(--p-border-color);
    border-radius: var(--p-border-radius);
    transition: border-color 0.15s ease, box-shadow 0.15s ease, background 0.15s ease;
    box-sizing: border-box;
    cursor: text;
    position: relative;
}
.laughtale-autocomplete.has-dropdown .ac-input-container {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
}
.ac-input-container.variant-filled {
    background: var(--p-surface-50);
}
.ac-input-container.focused {
    border-color: var(--p-primary-500);
    box-shadow: 0 0 0 1px var(--p-primary-500);
    z-index: 2;
}
.ac-input-container.invalid {
    border-color: #ef4444 !important;
    box-shadow: 0 0 0 1px #ef4444 !important;
}
.ac-input-container.disabled {
    background: var(--p-surface-100);
    opacity: 0.65;
    cursor: not-allowed;
}

/* Sizes */
.ac-input-container.size-small {
    min-height: 2rem;
    padding: 0 0.5rem;
    font-size: 0.75rem;
}
.ac-input-container.size-normal {
    min-height: 2.5rem;
    padding: 0 0.75rem;
    font-size: 0.875rem;
}
.ac-input-container.size-large {
    min-height: 3rem;
    padding: 0 1rem;
    font-size: 1rem;
}

.ac-chips-wrapper {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.35rem;
    flex: 1;
    min-width: 0;
    padding: 0.25rem 0;
}
.ac-chip {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    background: var(--p-surface-100);
    color: var(--p-text-color);
    border-radius: calc(var(--p-border-radius) - 2px);
    padding: 0.15rem 0.45rem;
    font-size: 0.75rem;
    font-weight: 500;
}
.ac-chip-remove {
    display: flex;
    align-items: center;
    cursor: pointer;
    color: var(--p-text-muted);
    border: none;
    background: transparent;
    padding: 0;
    font-size: 0.75rem;
}
.ac-chip-remove:hover {
    color: #ef4444;
}

.ac-input {
    flex: 1;
    min-width: 60px;
    border: none;
    outline: none;
    background: transparent;
    color: var(--p-text-color);
    font-family: inherit;
    font-size: inherit;
    padding: 0.35rem 0;
}
.ac-input::placeholder {
    color: var(--p-text-muted);
}
.ac-input:disabled {
    cursor: not-allowed;
}

.ac-btn-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    background: transparent;
    color: var(--p-text-muted);
    cursor: pointer;
    padding: 0.25rem;
    border-radius: 50%;
    transition: color 0.15s ease, background 0.15s ease;
    flex-shrink: 0;
    margin-left: 0.25rem;
}
.ac-btn-icon:hover {
    color: var(--p-text-color);
    background: var(--p-surface-100);
}

.ac-dropdown-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: 1px solid var(--p-border-color);
    border-left: none;
    background: var(--p-surface-100);
    color: var(--p-text-muted);
    border-top-right-radius: var(--p-border-radius);
    border-bottom-right-radius: var(--p-border-radius);
    cursor: pointer;
    padding: 0 0.85rem;
    transition: background 0.15s ease, color 0.15s ease, border-color 0.15s ease;
    flex-shrink: 0;
    box-sizing: border-box;
}
.ac-dropdown-btn:hover {
    background: var(--p-surface-200);
    color: var(--p-text-color);
}
.ac-dropdown-btn:disabled {
    cursor: not-allowed;
    opacity: 0.65;
}

/* Sizes for dropdown button */
.size-small + .ac-dropdown-btn,
.laughtale-autocomplete .ac-dropdown-btn.size-small {
    padding: 0 0.6rem;
}
.size-large + .ac-dropdown-btn,
.laughtale-autocomplete .ac-dropdown-btn.size-large {
    padding: 0 1.1rem;
}

/* Floating Overlay Panel */
.ac-overlay {
    position: absolute;
    top: calc(100% + 4px);
    left: 0;
    right: 0;
    z-index: 1000;
    background: var(--p-surface-0);
    border: 1px solid var(--p-border-color);
    border-radius: var(--p-border-radius);
    box-shadow: var(--p-shadow-lg);
    overflow-y: auto;
    padding: 0.35rem;
    display: none;
    box-sizing: border-box;
}
.ac-group-header {
    font-size: 0.725rem;
    font-weight: 700;
    color: var(--p-text-muted);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    padding: 0.5rem 0.65rem 0.25rem;
    user-select: none;
}
.ac-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.5rem 0.75rem;
    border-radius: calc(var(--p-border-radius) - 2px);
    color: var(--p-text-color);
    cursor: pointer;
    transition: background 0.15s ease, color 0.15s ease;
    font-size: 0.875rem;
    user-select: none;
    gap: 0.5rem;
}
.ac-item:hover, .ac-item.highlighted {
    background: var(--p-surface-100);
}
.ac-item.selected {
    background: var(--p-primary-50);
    color: var(--p-primary-700);
    font-weight: 600;
}
.ac-item.disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

/* Dark Mode Aware Tokens */
.dark .ac-input-container {
    background: var(--p-surface-900);
    border-color: var(--p-surface-700);
    color: var(--p-surface-0);
}
.dark .ac-input-container.variant-filled {
    background: var(--p-surface-800);
}
.dark .ac-chip {
    background: var(--p-surface-800);
    color: var(--p-surface-100);
}
.dark .ac-dropdown-btn {
    background: var(--p-surface-800);
    border-color: var(--p-surface-700);
    color: var(--p-surface-300);
}
.dark .ac-dropdown-btn:hover {
    background: var(--p-surface-700);
    color: var(--p-surface-0);
}
.dark .ac-overlay {
    background: var(--p-surface-900);
    border-color: var(--p-surface-700);
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5);
}
.dark .ac-item:hover, .dark .ac-item.highlighted {
    background: var(--p-surface-800);
    color: var(--p-surface-0);
}
.dark .ac-item.selected {
    background: rgba(16, 185, 129, 0.15);
    color: #6ee7b7;
}
`;
function AutoCompleteIsland(container, props) {
  injectIslandStyle("autocomplete", CSS7);
  const allItems = props.suggestions || props.items || [];
  const multiple = props.multiple === true;
  const showClear = props.showClear !== false;
  const hasDropdown = props.dropdown === true;
  const forceSelection = props.forceSelection === true;
  const size = props.size || "normal";
  const variant = props.variant || "outlined";
  const scrollHeight = props.scrollHeight || "14rem";
  let selectedValues = multiple ? Array.isArray(props.value) ? props.value : props.value ? [props.value] : [] : props.value ? [props.value] : [];
  let searchQuery = "";
  let highlightedIndex = -1;
  function getFilteredItems() {
    if (!searchQuery) return allItems;
    const q = searchQuery.toLowerCase();
    return allItems.filter(
      (item) => item.label.toLowerCase().includes(q) || item.value.toLowerCase().includes(q) || item.subtitle && item.subtitle.toLowerCase().includes(q) || item.group && item.group.toLowerCase().includes(q) || item.category && item.category.toLowerCase().includes(q)
    );
  }
  container.innerHTML = `
        <div class="laughtale-autocomplete ${props.fluid ? "fluid" : ""} ${hasDropdown ? "has-dropdown" : ""}">
            <div class="ac-input-container size-${size} variant-${variant} ${props.invalid ? "invalid" : ""} ${props.disabled ? "disabled" : ""}">
                <div class="ac-chips-wrapper">
                    <input type="text" 
                           class="ac-input" 
                           role="combobox"
                           aria-autocomplete="list"
                           aria-expanded="false"
                           placeholder="${selectedValues.length === 0 ? props.placeholder || "Search..." : ""}" 
                           ${props.disabled ? "disabled" : ""} />
                </div>
                
                ${props.loading ? `
                    <span class="ac-btn-icon" style="animation: spin 1s linear infinite;">
                        ${LucideIcons.loader2 || "\u23F3"}
                    </span>
                ` : ""}

                ${showClear ? `
                    <button type="button" class="ac-btn-icon ac-btn-clear" style="display: none;" title="Clear value">
                        ${LucideIcons.x}
                    </button>
                ` : ""}
            </div>

            ${hasDropdown ? `
                <button type="button" class="ac-dropdown-btn size-${size}" ${props.disabled ? "disabled" : ""} title="Show all suggestions">
                    <span style="display: flex; width: 16px; height: 16px;">${LucideIcons.chevronDown}</span>
                </button>
            ` : ""}

            <!-- Suggestions Overlay -->
            <div class="ac-overlay" style="max-height: ${scrollHeight};"></div>
        </div>
    `;
  const inputWrap = container.querySelector(".ac-input-container");
  const chipsWrap = container.querySelector(".ac-chips-wrapper");
  const input = container.querySelector(".ac-input");
  const clearBtn = container.querySelector(".ac-btn-clear");
  const dropdownBtn = container.querySelector(".ac-dropdown-btn");
  const overlay = container.querySelector(".ac-overlay");
  const disclosure = useDisclosure({
    defaultIsOpen: false,
    onOpen: () => {
      overlay.style.display = "block";
      input.setAttribute("aria-expanded", "true");
      renderDropdown();
    },
    onClose: () => {
      overlay.style.display = "none";
      input.setAttribute("aria-expanded", "false");
      highlightedIndex = -1;
      if (forceSelection && !multiple && searchQuery) {
        const exact = allItems.find((i) => i.label.toLowerCase() === searchQuery.toLowerCase());
        if (!exact) {
          input.value = selectedValues[0] ? allItems.find((i) => i.value === selectedValues[0])?.label || "" : "";
          searchQuery = "";
        }
      }
    }
  });
  useClickOutside(container, () => {
    disclosure.close();
    inputWrap.classList.remove("focused");
  });
  function renderChips() {
    if (!multiple) {
      if (selectedValues[0]) {
        const found = allItems.find((i) => i.value === selectedValues[0]);
        input.value = found ? found.label : selectedValues[0];
      } else {
        input.value = "";
      }
      updateClearButton();
      return;
    }
    chipsWrap.querySelectorAll(".ac-chip").forEach((el) => el.remove());
    selectedValues.forEach((val) => {
      const item = allItems.find((i) => i.value === val) || { label: val, value: val };
      const chip = document.createElement("span");
      chip.className = "ac-chip";
      chip.innerHTML = `
                <span>${item.label}</span>
                <button type="button" class="ac-chip-remove" data-remove="${item.value}">&times;</button>
            `;
      chip.querySelector(".ac-chip-remove")?.addEventListener("click", (e) => {
        e.stopPropagation();
        removeValue(item.value);
      });
      chipsWrap.insertBefore(chip, input);
    });
    input.placeholder = selectedValues.length === 0 ? props.placeholder || "Search..." : "";
    updateClearButton();
  }
  function updateClearButton() {
    if (!clearBtn) return;
    const hasContent = multiple ? selectedValues.length > 0 : selectedValues.length > 0 || input.value.length > 0;
    clearBtn.style.display = hasContent && !props.disabled ? "flex" : "none";
  }
  function renderDropdown() {
    const filtered = getFilteredItems();
    if (filtered.length === 0) {
      overlay.innerHTML = `<div style="padding: 0.75rem; text-align: center; color: var(--p-text-muted); font-size: 0.8125rem;">No results found</div>`;
      return;
    }
    const groups = {};
    let isGrouped = false;
    filtered.forEach((item) => {
      const grp = item.group || item.category || "";
      if (grp) isGrouped = true;
      if (!groups[grp]) groups[grp] = [];
      groups[grp].push(item);
    });
    let html = "";
    let itemIndex = 0;
    if (isGrouped) {
      Object.entries(groups).forEach(([grpName, groupItems]) => {
        if (grpName) {
          html += `<div class="ac-group-header">${grpName}</div>`;
        }
        groupItems.forEach((item) => {
          html += renderOptionHtml(item, itemIndex++);
        });
      });
    } else {
      filtered.forEach((item) => {
        html += renderOptionHtml(item, itemIndex++);
      });
    }
    overlay.innerHTML = html;
    overlay.querySelectorAll(".ac-item").forEach((itemEl) => {
      itemEl.addEventListener("click", () => {
        const val = itemEl.getAttribute("data-value");
        const matched = allItems.find((i) => i.value === val);
        if (matched && !matched.disabled) {
          selectItem(matched);
        }
      });
      itemEl.addEventListener("mouseenter", () => {
        const idx = Number(itemEl.getAttribute("data-idx"));
        highlightItem(idx);
      });
    });
  }
  function renderOptionHtml(item, idx) {
    const isSelected = selectedValues.includes(item.value);
    const isHighlighted = idx === highlightedIndex;
    let leadingHtml = "";
    if (item.avatar) {
      leadingHtml = `<span style="width: 26px; height: 26px; border-radius: 50%; background: var(--p-primary-600); color: #fff; display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 700; flex-shrink: 0;">${item.avatar}</span>`;
    } else if (item.icon && LucideIcons[item.icon]) {
      leadingHtml = `<span style="display: flex; width: 16px; height: 16px; color: var(--p-primary-600); flex-shrink: 0;">${LucideIcons[item.icon]}</span>`;
    }
    let statusHtml = "";
    if (item.status) {
      const statusColor = item.status === "online" ? "#10b981" : item.status === "away" ? "#f59e0b" : "#94a3b8";
      statusHtml = `<span style="width: 8px; height: 8px; border-radius: 50%; background: ${statusColor}; margin-right: 0.35rem; display: inline-block;"></span>`;
    }
    let trailingHtml = "";
    if (item.shortcut) {
      trailingHtml = `<span style="font-size: 0.725rem; background: var(--p-surface-200); padding: 0.1rem 0.35rem; border-radius: 4px; color: var(--p-text-muted); font-family: monospace;">${item.shortcut}</span>`;
    } else if (item.count !== void 0) {
      trailingHtml = `<span class="aura-tag tag-slate" style="font-size: 0.6875rem;">${item.count}</span>`;
    }
    return `
            <div class="ac-item ${isSelected ? "selected" : ""} ${isHighlighted ? "highlighted" : ""} ${item.disabled ? "disabled" : ""}" 
                 data-value="${item.value}" 
                 data-idx="${idx}" 
                 role="option" 
                 aria-selected="${isSelected}">
                <div style="display: flex; align-items: center; gap: 0.5rem; overflow: hidden;">
                    ${leadingHtml}
                    <div style="display: flex; flex-direction: column; overflow: hidden;">
                        <span style="font-weight: ${isSelected ? "700" : "500"}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                            ${statusHtml}${item.label}
                        </span>
                        ${item.subtitle ? `<span style="font-size: 0.75rem; color: var(--p-text-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${item.subtitle}</span>` : ""}
                    </div>
                </div>
                ${trailingHtml}
            </div>
        `;
  }
  function highlightItem(idx) {
    highlightedIndex = idx;
    const items = overlay.querySelectorAll(".ac-item");
    items.forEach((it2, i) => {
      if (i === idx) {
        it2.classList.add("highlighted");
        it2.scrollIntoView({ block: "nearest" });
      } else {
        it2.classList.remove("highlighted");
      }
    });
  }
  function selectItem(item) {
    if (multiple) {
      if (!selectedValues.includes(item.value)) {
        selectedValues.push(item.value);
      }
      searchQuery = "";
      input.value = "";
      renderChips();
      disclosure.close();
      syncValue();
      input.focus();
    } else {
      selectedValues = [item.value];
      searchQuery = "";
      input.value = item.label;
      disclosure.close();
      renderChips();
      syncValue();
    }
  }
  function removeValue(val) {
    selectedValues = selectedValues.filter((v) => v !== val);
    renderChips();
    syncValue();
  }
  const debouncedFilter = useDebounce(() => {
    searchQuery = input.value;
    if (searchQuery.trim().length > 0) {
      if (!disclosure.isOpen) disclosure.open();
      else renderDropdown();
    } else {
      if (disclosure.isOpen) disclosure.close();
    }
    updateClearButton();
  }, 150);
  input.addEventListener("input", () => {
    debouncedFilter();
  });
  input.addEventListener("focus", () => {
    inputWrap.classList.add("focused");
  });
  input.addEventListener("blur", () => {
    inputWrap.classList.remove("focused");
  });
  input.addEventListener("keydown", (e) => {
    const filtered = getFilteredItems();
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!disclosure.isOpen) {
        disclosure.open();
      } else {
        const nextIdx = highlightedIndex < filtered.length - 1 ? highlightedIndex + 1 : 0;
        highlightItem(nextIdx);
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (disclosure.isOpen) {
        const prevIdx = highlightedIndex > 0 ? highlightedIndex - 1 : filtered.length - 1;
        highlightItem(prevIdx);
      }
    } else if (e.key === "Enter") {
      if (disclosure.isOpen && highlightedIndex >= 0 && filtered[highlightedIndex]) {
        e.preventDefault();
        selectItem(filtered[highlightedIndex]);
      }
    } else if (e.key === "Escape") {
      disclosure.close();
    } else if (e.key === "Backspace" && multiple && input.value === "" && selectedValues.length > 0) {
      removeValue(selectedValues[selectedValues.length - 1]);
    } else if (e.key === "Home" && disclosure.isOpen) {
      e.preventDefault();
      highlightItem(0);
    } else if (e.key === "End" && disclosure.isOpen) {
      e.preventDefault();
      highlightItem(filtered.length - 1);
    }
  });
  clearBtn?.addEventListener("click", (e) => {
    e.stopPropagation();
    selectedValues = [];
    searchQuery = "";
    input.value = "";
    renderChips();
    syncValue();
    disclosure.close();
    input.focus();
  });
  dropdownBtn?.addEventListener("click", (e) => {
    e.stopPropagation();
    if (disclosure.isOpen) {
      disclosure.close();
    } else {
      searchQuery = "";
      disclosure.open();
      input.focus();
    }
  });
  inputWrap.addEventListener("click", () => {
    input.focus();
  });
  function syncValue() {
    if (props.targetInputName) {
      let hidden = container.querySelector(`input[name="${props.targetInputName}"]`);
      if (!hidden) {
        hidden = document.createElement("input");
        hidden.type = "hidden";
        hidden.name = props.targetInputName;
        container.appendChild(hidden);
      }
      hidden.value = multiple ? JSON.stringify(selectedValues) : selectedValues[0] || "";
    }
    container.dispatchEvent(new CustomEvent("autocomplete:change", {
      bubbles: true,
      detail: { value: multiple ? selectedValues : selectedValues[0] || "" }
    }));
  }
  renderChips();
}

// src/components/color-picker.ts
var DEFAULT_PRESETS = [
  "#10b981",
  "#059669",
  "#3b82f6",
  "#2563eb",
  "#6366f1",
  "#8b5cf6",
  "#ec4899",
  "#f43f5e",
  "#ef4444",
  "#f59e0b",
  "#14b8a6",
  "#06b6d4",
  "#64748b",
  "#1e293b",
  "#000000"
];
var CSS8 = `
[data-theme="dark"] .color-swatch-btn {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
[data-theme="dark"] .colorpicker-trigger-btn {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
[data-theme="dark"] .colorpicker-palette-overlay {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
[data-theme="dark"] .color-native-input {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
[data-theme="dark"] .color-hex-input {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
`;
function ColorPickerIsland(container, props) {
  injectIslandStyle("color-picker", CSS8);
  let currentColor = props.value || "#10b981";
  let isOpen = false;
  const swatchesHtml = DEFAULT_PRESETS.map((c) => `
        <button type="button" 
                class="color-swatch-btn" 
                data-color="${c}" 
                title="${c}"
                style="width: 1.75rem; height: 1.75rem; border-radius: 4px; border: ${c.toLowerCase() === currentColor.toLowerCase() ? "2px solid #ffffff" : "1px solid rgba(0,0,0,0.15)"}; background: ${c}; cursor: pointer; box-shadow: ${c.toLowerCase() === currentColor.toLowerCase() ? "0 0 0 2px var(--p-primary-600)" : "none"}; transition: transform 0.15s ease, box-shadow 0.15s ease;">
        </button>
    `).join("");
  container.innerHTML = `
        <div class="laughtale-colorpicker" style="position: relative; display: inline-flex; align-items: center; gap: 0.625rem; font-family: var(--p-font-family, inherit);">
            <!-- Color Swatch Trigger Button -->
            <button type="button" 
                    class="colorpicker-trigger-btn" 
                    ${props.disabled ? "disabled" : ""} 
                    style="width: 2.25rem; height: 2.25rem; border-radius: var(--p-border-radius); border: 2px solid var(--p-surface-200); background: ${currentColor}; cursor: ${props.disabled ? "not-allowed" : "pointer"}; box-shadow: var(--p-shadow-sm); transition: transform 0.15s ease, border-color 0.15s ease; padding: 0; outline: none;">
            </button>
            <span class="colorpicker-hex-label" style="font-family: monospace; font-size: 0.8125rem; font-weight: 600; color: var(--p-surface-800);">${currentColor.toUpperCase()}</span>

            <!-- Palette Popover -->
            <div class="colorpicker-palette-overlay" style="display: none; position: absolute; top: calc(100% + 8px); left: 0; z-index: 600; background: var(--p-surface-0); border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius-lg); box-shadow: var(--p-shadow-lg); padding: 0.875rem; width: 220px; box-sizing: border-box;">
                <div style="font-size: 0.6875rem; font-weight: 700; color: var(--p-surface-500); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.625rem;">Palette Swatches</div>
                
                <!-- 5-Column Swatch Grid -->
                <div class="colorpicker-swatches-grid" style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 6px; margin-bottom: 0.875rem; justify-items: center;">
                    ${swatchesHtml}
                </div>

                <!-- Custom Hex & Native Spectrum Picker -->
                <div style="display: flex; align-items: center; gap: 0.5rem; width: 100%; box-sizing: border-box;">
                    <!-- Stylized Native Color Picker Button -->
                    <div style="position: relative; width: 2rem; height: 2rem; flex-shrink: 0; border-radius: var(--p-border-radius); border: 1px solid var(--p-border-color); overflow: hidden; background: ${currentColor}; cursor: pointer;">
                        <input type="color" class="color-native-input" value="${currentColor}" style="position: absolute; inset: -4px; width: 200%; height: 200%; opacity: 0; cursor: pointer; border: none; padding: 0;" />
                    </div>

                    <!-- Hex Text Input -->
                    <div style="flex: 1; min-width: 0; display: flex; align-items: center; border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius); background: var(--p-surface-50); padding: 0 0.5rem; box-sizing: border-box;">
                        <span style="font-size: 0.75rem; color: var(--p-surface-400); font-family: monospace; user-select: none;">#</span>
                        <input type="text" 
                               class="color-hex-input" 
                               value="${currentColor.replace("#", "")}" 
                               maxlength="6" 
                               placeholder="10b981"
                               style="width: 100%; min-width: 0; padding: 0.35rem 0.25rem; font-family: monospace; font-size: 0.8125rem; color: var(--p-text-color); border: none; outline: none; background: transparent; box-sizing: border-box;" />
                    </div>
                </div>
            </div>
        </div>
    `;
  const triggerBtn = container.querySelector(".colorpicker-trigger-btn");
  const hexLabel = container.querySelector(".colorpicker-hex-label");
  const overlay = container.querySelector(".colorpicker-palette-overlay");
  const nativeInput = container.querySelector(".color-native-input");
  const hexInput = container.querySelector(".color-hex-input");
  const nativePreview = nativeInput.parentElement;
  function applyColor(newColor, fromHexInput = false) {
    currentColor = newColor.startsWith("#") ? newColor : `#${newColor}`;
    triggerBtn.style.backgroundColor = currentColor;
    nativePreview.style.backgroundColor = currentColor;
    hexLabel.textContent = currentColor.toUpperCase();
    nativeInput.value = currentColor;
    if (!fromHexInput) {
      hexInput.value = currentColor.replace("#", "");
    }
    container.querySelectorAll(".color-swatch-btn").forEach((btn) => {
      const btnColor = btn.getAttribute("data-color") || "";
      const isMatch = btnColor.toLowerCase() === currentColor.toLowerCase();
      btn.style.border = isMatch ? "2px solid #ffffff" : "1px solid rgba(0,0,0,0.15)";
      btn.style.boxShadow = isMatch ? "0 0 0 2px var(--p-primary-600)" : "none";
    });
    syncValue();
  }
  function toggleOverlay(show) {
    isOpen = show !== void 0 ? show : !isOpen;
    overlay.style.display = isOpen ? "block" : "none";
  }
  if (!props.disabled) {
    triggerBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleOverlay();
    });
    container.querySelectorAll(".color-swatch-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const color = btn.getAttribute("data-color");
        applyColor(color);
        toggleOverlay(false);
      });
    });
    nativeInput.addEventListener("input", () => {
      applyColor(nativeInput.value);
    });
    hexInput.addEventListener("input", () => {
      const raw = hexInput.value.trim().replace("#", "");
      if (/^[0-9A-Fa-f]{6}$/.test(raw) || /^[0-9A-Fa-f]{3}$/.test(raw)) {
        applyColor(`#${raw}`, true);
      }
    });
    document.addEventListener("click", (e) => {
      if (!container.contains(e.target)) {
        toggleOverlay(false);
      }
    });
  }
  function syncValue() {
    if (props.targetInputName) {
      let hidden = container.querySelector(`input[name="${props.targetInputName}"]`);
      if (!hidden) {
        hidden = document.createElement("input");
        hidden.type = "hidden";
        hidden.name = props.targetInputName;
        container.appendChild(hidden);
      }
      hidden.value = currentColor;
    }
    container.dispatchEvent(new CustomEvent("color:change", {
      bubbles: true,
      detail: { value: currentColor }
    }));
  }
  syncValue();
}

// src/components/knob.ts
var CSS9 = `
[data-theme="dark"] .laughtale-knob {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
[data-theme="dark"] .knob-progress-circle {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
[data-theme="dark"] .knob-value-display {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
`;
function KnobIsland(container, props) {
  injectIslandStyle("knob", CSS9);
  const min = props.min !== void 0 ? props.min : 0;
  const max = props.max !== void 0 ? props.max : 100;
  const step = props.step || 1;
  const size = props.size || 96;
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const template = props.valueTemplate || "{value}%";
  let currentValue = props.value !== void 0 ? props.value : min;
  function getOffset(val) {
    const pct = Math.max(0, Math.min(1, (val - min) / (max - min)));
    return circumference * (1 - pct);
  }
  const initialOffset = getOffset(currentValue);
  const initialText = template.replace("{value}", currentValue.toString());
  container.innerHTML = `
        <div class="laughtale-knob" style="position: relative; display: inline-flex; align-items: center; justify-content: center; width: ${size}px; height: ${size}px; user-select: none; cursor: ${props.disabled ? "not-allowed" : "pointer"}; touch-action: none;">
            <svg width="${size}" height="${size}" style="transform: rotate(-90deg); pointer-events: none;">
                <!-- Background Circle -->
                <circle cx="${size / 2}" cy="${size / 2}" r="${radius}" fill="transparent" stroke="var(--p-surface-200)" stroke-width="${strokeWidth}" />
                <!-- Progress Arc -->
                <circle class="knob-progress-circle" cx="${size / 2}" cy="${size / 2}" r="${radius}" fill="transparent" stroke="${props.color || "var(--p-primary-600)"}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-dasharray="${circumference}" stroke-dashoffset="${initialOffset}" style="transition: stroke-dashoffset 0.05s ease;" />
            </svg>
            <span class="knob-value-display" style="position: absolute; font-size: ${size * 0.2}px; font-weight: 700; color: var(--p-surface-900); pointer-events: none;">
                ${initialText}
            </span>
        </div>
    `;
  const knobEl = container.querySelector(".laughtale-knob");
  const progressCircle = container.querySelector(".knob-progress-circle");
  const valueDisplay = container.querySelector(".knob-value-display");
  function updateVisuals() {
    progressCircle.style.strokeDashoffset = `${getOffset(currentValue)}`;
    valueDisplay.textContent = template.replace("{value}", currentValue.toString());
  }
  function syncValue() {
    if (props.targetInputName) {
      let hidden = container.querySelector(`input[name="${props.targetInputName}"]`);
      if (!hidden) {
        hidden = document.createElement("input");
        hidden.type = "hidden";
        hidden.name = props.targetInputName;
        container.appendChild(hidden);
      }
      hidden.value = currentValue.toString();
    }
    container.dispatchEvent(new CustomEvent("knob:change", {
      bubbles: true,
      detail: { value: currentValue }
    }));
  }
  if (!props.disabled) {
    let isDragging = false;
    const updateFromPointer = (clientX, clientY) => {
      const rect = knobEl.getBoundingClientRect();
      if (rect.width <= 0) return;
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const angle = Math.atan2(clientY - centerY, clientX - centerX) * (180 / Math.PI) + 90;
      const normalizedAngle = angle < 0 ? angle + 360 : angle;
      const ratio = Math.min(1, Math.max(0, normalizedAngle / 360));
      const rawVal = min + ratio * (max - min);
      currentValue = Math.round(rawVal / step) * step;
      currentValue = Math.max(min, Math.min(max, currentValue));
      updateVisuals();
      syncValue();
    };
    const onPointerDown = (e) => {
      isDragging = true;
      if ("setPointerCapture" in knobEl && e.pointerId !== void 0) {
        try {
          knobEl.setPointerCapture(e.pointerId);
        } catch (_) {
        }
      }
      updateFromPointer(e.clientX, e.clientY);
    };
    const onPointerMove = (e) => {
      if (!isDragging) return;
      updateFromPointer(e.clientX, e.clientY);
    };
    const onPointerUp = (e) => {
      if (!isDragging) return;
      isDragging = false;
      if ("releasePointerCapture" in knobEl && e.pointerId !== void 0) {
        try {
          knobEl.releasePointerCapture(e.pointerId);
        } catch (_) {
        }
      }
    };
    knobEl.addEventListener("pointerdown", onPointerDown);
    knobEl.addEventListener("pointermove", onPointerMove);
    knobEl.addEventListener("pointerup", onPointerUp);
    knobEl.addEventListener("pointercancel", onPointerUp);
    knobEl.addEventListener("mousedown", onPointerDown);
    window.addEventListener("mousemove", onPointerMove);
    window.addEventListener("mouseup", onPointerUp);
  }
  syncValue();
}

// src/components/inplace.ts
var CSS10 = `
[data-theme="dark"] .laughtale-inplace-display {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
[data-theme="dark"] .laughtale-inplace-editor {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
[data-theme="dark"] .inplace-input {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
[data-theme="dark"] .btn-inplace-save {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
[data-theme="dark"] .btn-inplace-cancel {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
`;
function InplaceIsland(container, props) {
  injectIslandStyle("inplace", CSS10);
  let isEditing = false;
  let currentValue = props.value || "";
  function render() {
    if (!isEditing) {
      container.innerHTML = `
                <div class="laughtale-inplace-display" style="display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.35rem 0.6rem; border-radius: var(--p-border-radius); border: 1px dashed var(--p-border-color); background: var(--p-surface-50); cursor: ${props.disabled ? "default" : "pointer"}; transition: background 0.15s ease;">
                    <span style="font-size: 0.875rem; color: ${currentValue ? "var(--p-surface-900)" : "var(--p-surface-400)"}; font-weight: 500;">
                        ${currentValue || props.placeholder || "Click to edit..."}
                    </span>
                    ${!props.disabled ? `<span style="color: var(--p-surface-400); display: flex; align-items: center;">${LucideIcons.edit}</span>` : ""}
                </div>
            `;
      if (!props.disabled) {
        container.querySelector(".laughtale-inplace-display")?.addEventListener("click", () => {
          isEditing = true;
          render();
        });
      }
    } else {
      container.innerHTML = `
                <div class="laughtale-inplace-editor" style="display: inline-flex; align-items: center; gap: 0.35rem;">
                    <input type="text" 
                           class="inplace-input" 
                           value="${currentValue}" 
                           placeholder="${props.placeholder || ""}" 
                           style="padding: 0.35rem 0.6rem; border: 1px solid var(--p-primary-600); border-radius: var(--p-border-radius); font-size: 0.875rem; outline: none;" />
                    <button type="button" class="btn-inplace-save p-button p-button-primary" style="padding: 0.35rem 0.5rem; display: flex; align-items: center;">
                        ${LucideIcons.check}
                    </button>
                    <button type="button" class="btn-inplace-cancel p-button p-button-secondary" style="padding: 0.35rem 0.5rem; display: flex; align-items: center;">
                        ${LucideIcons.x}
                    </button>
                </div>
            `;
      const input = container.querySelector(".inplace-input");
      input.focus();
      input.setSelectionRange(currentValue.length, currentValue.length);
      container.querySelector(".btn-inplace-save")?.addEventListener("click", () => {
        currentValue = input.value.trim();
        isEditing = false;
        render();
        syncValue();
      });
      container.querySelector(".btn-inplace-cancel")?.addEventListener("click", () => {
        isEditing = false;
        render();
      });
      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          currentValue = input.value.trim();
          isEditing = false;
          render();
          syncValue();
        } else if (e.key === "Escape") {
          isEditing = false;
          render();
        }
      });
    }
  }
  function syncValue() {
    if (props.targetInputName) {
      let hidden = document.querySelector(`input[name="${props.targetInputName}"]`);
      if (!hidden) {
        hidden = document.createElement("input");
        hidden.type = "hidden";
        hidden.name = props.targetInputName;
        container.appendChild(hidden);
      }
      hidden.value = currentValue;
    }
    container.dispatchEvent(new CustomEvent("inplace:change", {
      bubbles: true,
      detail: { value: currentValue }
    }));
  }
  render();
  syncValue();
}

// src/components/image-compare.ts
var COMPARE_CSS = `
/* ==========================================================================
   PrimeVue 4 Aura Compare Component Tokens & Styles
   ========================================================================== */
.p-compare {
    position: relative;
    overflow: hidden;
    user-select: none;
    -webkit-user-select: none;
    touch-action: none;
    border-radius: var(--p-compare-border-radius, var(--p-border-radius, 12px));
    border: 1px solid var(--p-border-color, #e2e8f0);
    box-sizing: border-box;
    font-family: var(--p-font-family, inherit);
    cursor: ew-resize;
    display: block;
    width: 100%;
}

.p-compare-vertical {
    cursor: ns-resize;
}

.p-compare-disabled {
    opacity: 0.6;
    cursor: not-allowed !important;
    pointer-events: none;
}

/* Hidden Accessible Range Input */
.p-compare-input {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
}

/* Compare Layers */
.p-compare-item {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    box-sizing: border-box;
}

.p-compare-item-after {
    z-index: 1;
}

.p-compare-item-before {
    z-index: 2;
    will-change: clip-path, width, height;
}

.p-compare-item img,
.p-compare-item svg {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    pointer-events: none;
}

/* Compare Handle & Indicator */
.p-compare-handle {
    position: absolute;
    z-index: 3;
    pointer-events: none;
    box-sizing: border-box;
    background: var(--p-compare-handle-background, #ffffff);
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.45);
    will-change: left, top;
}

/* Horizontal Handle */
.p-compare:not(.p-compare-vertical) .p-compare-handle {
    top: 0;
    bottom: 0;
    width: var(--p-compare-handle-size, 2px);
    transform: translateX(-50%);
}

/* Vertical Handle */
.p-compare-vertical .p-compare-handle {
    left: 0;
    right: 0;
    height: var(--p-compare-handle-size, 2px);
    transform: translateY(-50%);
}

.p-compare-indicator {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: var(--p-compare-indicator-size, 2.25rem);
    height: var(--p-compare-indicator-size, 2.25rem);
    border-radius: var(--p-compare-indicator-border-radius, 9999px);
    background: var(--p-compare-indicator-background, #ffffff);
    color: var(--p-text-color, #0f172a);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: auto;
    cursor: ew-resize;
    transition: transform 150ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 150ms ease;
}

.p-compare-vertical .p-compare-indicator {
    cursor: ns-resize;
}

.p-compare-indicator:hover {
    transform: translate(-50%, -50%) scale(1.1);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.35);
}

.p-compare:focus-within .p-compare-indicator {
    outline: none;
    box-shadow: 0 0 0 var(--p-compare-indicator-focus-ring-width, 3px) var(--p-compare-indicator-focus-ring-color, rgba(16, 185, 129, 0.4)), 0 4px 12px rgba(0, 0, 0, 0.25);
}

/* Custom Translucent Bubble Handle */
.p-compare-custom-handle .p-compare-handle {
    background: transparent !important;
    box-shadow: none !important;
}
.p-compare-custom-handle .p-compare-indicator {
    width: 1.25rem !important;
    height: 1.25rem !important;
    background: rgba(255, 255, 255, 0.6) !important;
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3) !important;
}
.p-compare-custom-handle .p-compare-indicator:hover {
    transform: translate(-50%, -50%) scale(1.5) !important;
}

/* Dark Mode Tokens */
.dark .p-compare,
[data-theme="dark"] .p-compare {
    border-color: var(--p-surface-800, #1e293b);
}

.dark .p-compare-indicator,
[data-theme="dark"] .p-compare-indicator {
    background: var(--p-surface-900, #0f172a);
    color: var(--p-surface-0, #ffffff);
    border: 1px solid var(--p-surface-700, #334155);
}
`;
var ARROWS_H_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m18 8 4 4-4 4"/><path d="M2 12h20"/><path d="m6 8-4 4 4 4"/></svg>`;
var CODE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`;
var DEFAULT_BEFORE_IMG = "https://primefaces.org/cdn/primevue/images/compare/island2.jpg";
var DEFAULT_AFTER_IMG = "https://primefaces.org/cdn/primevue/images/compare/island1.jpg";
function CompareIsland(container, props) {
  injectIslandStyle("compare", COMPARE_CSS);
  const demoType = props.demoType || "basic";
  const orientation = props.orientation || (demoType === "vertical" ? "vertical" : "horizontal");
  const isVertical = orientation === "vertical";
  const slideOnHover = props.slideOnHover === true || demoType === "hover" || demoType === "with-chart";
  const isCustomHandle = props.customHandle === true || demoType === "custom-handle";
  const isControlled = demoType === "controlled";
  const isWithChart = demoType === "with-chart";
  const isTemplate = demoType === "template";
  const disabled = props.disabled === true;
  const readonly = props.readonly === true;
  let currentValue = props.modelValue !== void 0 ? props.modelValue : props.value !== void 0 ? props.value : 50;
  currentValue = Math.max(0, Math.min(100, currentValue));
  const beforeImg = props.beforeImage || DEFAULT_BEFORE_IMG;
  const afterImg = props.afterImage || DEFAULT_AFTER_IMG;
  function renderDOM() {
    const customHandleClass = isCustomHandle ? "p-compare-custom-handle" : "";
    const verticalClass = isVertical ? "p-compare-vertical" : "";
    const disabledClass = disabled ? "p-compare-disabled" : "";
    let beforeContentHtml = "";
    let afterContentHtml = "";
    if (isWithChart) {
      beforeContentHtml = `
                <svg class="absolute h-full w-full" viewBox="0 0 644 189" fill="none" xmlns="http://www.w3.org/2000/svg" style="width: 100%; height: 100%;">
                    <g clip-path="url(#compare_chart_clip)">
                        <path d="M0.5 118.499C0.5 118.499 82 102.999 113.5 89.4989C145 75.9989 188.444 87.7869 235 77.4989C272.684 69.1719 293.654 62.4939 329 46.9989C409.332 11.7849 479.5 86.5 510.5 78C541.5 69.5 635.951 0.848863 644 1.49886" stroke="#10b981" stroke-width="2.5" />
                        <path d="M113.5 89.5006C82 103.001 0.5 118.501 0.5 118.501V188.501H644V1.50065C635.951 0.850647 541.5 69.5 510.5 78C479.5 86.5 409.332 11.7866 329 47.0006C293.654 62.4956 272.684 69.1736 235 77.5006C188.444 87.7886 145 76.0006 113.5 89.5006Z" fill="url(#compare_chart_gradient)" />
                    </g>
                    <defs>
                        <clipPath id="compare_chart_clip">
                            <rect width="644" height="189" fill="white" />
                        </clipPath>
                        <linearGradient id="compare_chart_gradient" x1="322.25" x2="322.25" y1="1.477" y2="188.5" gradientUnits="userSpaceOnUse">
                            <stop stop-color="#10b981" stop-opacity="0.4" />
                            <stop offset="1" stop-color="#10b981" stop-opacity="0" />
                        </linearGradient>
                    </defs>
                </svg>
            `;
      afterContentHtml = `
                <div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background: var(--p-surface-50); color: var(--p-text-muted); font-size: 0.875rem;">
                    <span>Hover to reveal chart trajectory</span>
                </div>
            `;
    } else if (isTemplate) {
      beforeContentHtml = `
                <div style="width: 100%; height: 100%; background: #f3e8ff; padding: 1.5rem; display: flex; align-items: center; justify-content: center; box-sizing: border-box;">
                    <div style="width: 100%; max-width: 18rem; border-radius: 12px; border: 1px solid #e9d5ff; background: #ffffff; padding: 1.25rem; display: flex; flex-direction: column; gap: 1rem; box-shadow: 0 4px 12px rgba(147, 51, 234, 0.1);">
                        <div style="display: flex; align-items: flex-start; justify-content: space-between;">
                            <div style="display: flex; align-items: center; gap: 0.75rem;">
                                <div style="width: 2.5rem; height: 2.5rem; border-radius: 9999px; overflow: hidden; background: #c084fc;">
                                    <img src="https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png" style="width: 100%; height: 100%; object-fit: cover; filter: hue-rotate(260deg) saturate(150%);" />
                                </div>
                                <div>
                                    <div style="font-weight: 600; color: #581c87; font-size: 0.9rem;">Amy Elsner</div>
                                    <div style="font-size: 0.75rem; color: #9333ea;">Developer</div>
                                </div>
                            </div>
                            <span style="background: #f3e8ff; color: #7e22ce; padding: 0.2rem 0.5rem; border-radius: 6px; font-size: 0.75rem; font-weight: 700;">Pro</span>
                        </div>
                        <div style="display: flex; flex-direction: column; gap: 0.35rem;">
                            <div style="display: flex; justify-content: space-between; font-size: 0.75rem;">
                                <span style="color: #9333ea;">Storage</span>
                                <span style="color: #581c87; font-weight: 600;">7.2 GB / 10 GB</span>
                            </div>
                            <div style="height: 0.5rem; width: 100%; background: #f3e8ff; border-radius: 9999px; overflow: hidden;">
                                <div style="height: 100%; width: 72%; background: #a855f7; border-radius: 9999px;"></div>
                            </div>
                        </div>
                        <div style="display: flex; gap: 0.5rem; padding-top: 0.25rem;">
                            <button type="button" class="p-button p-button-sm" style="flex: 1; padding: 0.35rem; font-size: 0.75rem; border-radius: 6px; background: #9333ea; border: 1px solid #9333ea; color: #ffffff; cursor: pointer;">Upgrade</button>
                            <button type="button" class="p-button p-button-sm p-button-outlined" style="padding: 0.35rem 0.6rem; font-size: 0.75rem; border-radius: 6px; border: 1px solid #e9d5ff; background: transparent; color: #7e22ce; cursor: pointer;">Settings</button>
                        </div>
                    </div>
                </div>
            `;
      afterContentHtml = `
                <div style="width: 100%; height: 100%; background: #ecfdf5; padding: 1.5rem; display: flex; align-items: center; justify-content: center; box-sizing: border-box;">
                    <div style="width: 100%; max-width: 18rem; border-radius: 12px; border: 1px solid #a7f3d0; background: #ffffff; padding: 1.25rem; display: flex; flex-direction: column; gap: 1rem; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.1);">
                        <div style="display: flex; align-items: flex-start; justify-content: space-between;">
                            <div style="display: flex; align-items: center; gap: 0.75rem;">
                                <div style="width: 2.5rem; height: 2.5rem; border-radius: 9999px; overflow: hidden; background: #34d399;">
                                    <img src="https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png" style="width: 100%; height: 100%; object-fit: cover;" />
                                </div>
                                <div>
                                    <div style="font-weight: 600; color: #064e3b; font-size: 0.9rem;">Amy Elsner</div>
                                    <div style="font-size: 0.75rem; color: #059669;">Developer</div>
                                </div>
                            </div>
                            <span style="background: #ecfdf5; color: #047857; padding: 0.2rem 0.5rem; border-radius: 6px; font-size: 0.75rem; font-weight: 700;">Pro</span>
                        </div>
                        <div style="display: flex; flex-direction: column; gap: 0.35rem;">
                            <div style="display: flex; justify-content: space-between; font-size: 0.75rem;">
                                <span style="color: #059669;">Storage</span>
                                <span style="color: #064e3b; font-weight: 600;">7.2 GB / 10 GB</span>
                            </div>
                            <div style="height: 0.5rem; width: 100%; background: #ecfdf5; border-radius: 9999px; overflow: hidden;">
                                <div style="height: 100%; width: 72%; background: #10b981; border-radius: 9999px;"></div>
                            </div>
                        </div>
                        <div style="display: flex; gap: 0.5rem; padding-top: 0.25rem;">
                            <button type="button" class="p-button p-button-sm" style="flex: 1; padding: 0.35rem; font-size: 0.75rem; border-radius: 6px; background: #10b981; border: 1px solid #10b981; color: #ffffff; cursor: pointer;">Upgrade</button>
                            <button type="button" class="p-button p-button-sm p-button-outlined" style="padding: 0.35rem 0.6rem; font-size: 0.75rem; border-radius: 6px; border: 1px solid #a7f3d0; background: transparent; color: #047857; cursor: pointer;">Settings</button>
                        </div>
                    </div>
                </div>
            `;
    } else {
      beforeContentHtml = `<img src="${beforeImg}" alt="Before" draggable="false" />`;
      afterContentHtml = `<img src="${afterImg}" alt="After" draggable="false" />`;
    }
    const iconHtml = demoType === "hover" || demoType === "vertical" || isTemplate ? CODE_SVG : ARROWS_H_SVG;
    const iconRotateStyle = isVertical ? "transform: rotate(90deg);" : "";
    const heightStyle = isWithChart ? "height: 189px;" : isTemplate ? "height: 320px;" : "aspect-ratio: 16/9;";
    let containerHtml = `
            <div class="p-compare ${verticalClass} ${customHandleClass} ${disabledClass} ${props.class || ""}" style="max-width: 32rem; margin: 0 auto; ${heightStyle} ${props.style || ""}" data-compare-root>
                <!-- Hidden Accessible Range Input -->
                <input type="range" class="p-compare-input" min="${props.min || 0}" max="${props.max || 100}" step="${props.step || 1}" value="${currentValue}" aria-label="${props.ariaLabel || "Compare images"}" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${currentValue}" tabindex="0" ${disabled ? "disabled" : ""} data-compare-input />

                <!-- Layer After (Base Bottom) -->
                <div class="p-compare-item p-compare-item-after" data-compare-after>
                    ${afterContentHtml}
                </div>

                <!-- Layer Before (Clipped Top) -->
                <div class="p-compare-item p-compare-item-before" data-compare-before>
                    ${beforeContentHtml}
                </div>

                <!-- Divider Handle -->
                <div class="p-compare-handle" data-compare-handle>
                    <div class="p-compare-indicator" data-compare-indicator>
                        ${isCustomHandle ? "" : `<span style="${iconRotateStyle} display: flex; align-items: center; justify-content: center;">${iconHtml}</span>`}
                    </div>
                </div>
            </div>
        `;
    if (isControlled) {
      containerHtml += `
                <div class="p-compare-controls" style="max-width: 32rem; margin: 1rem auto 0 auto; display: flex; align-items: center; justify-content: space-between; gap: 1rem; width: 100%;">
                    <button type="button" class="p-button p-button-outlined p-button-secondary" data-compare-set="25" style="padding: 0.45rem 1rem; font-size: 0.875rem; font-weight: 600; border-radius: var(--p-border-radius); border: 1px solid var(--p-border-color); background: var(--p-surface-0); color: var(--p-text-color); cursor: pointer;">
                        25%
                    </button>
                    <div style="display: flex; align-items: center; gap: 0.25rem;">
                        <input type="number" min="0" max="100" value="${currentValue}" class="p-inputtext p-component" data-compare-num style="width: 5rem; text-align: center; padding: 0.45rem 0.5rem; border-radius: var(--p-border-radius); border: 1px solid var(--p-border-color); background: var(--p-surface-0); color: var(--p-text-color); font-weight: 600; font-size: 0.875rem;" />
                        <span style="font-weight: 600; font-size: 0.875rem; color: var(--p-text-muted);">%</span>
                    </div>
                    <button type="button" class="p-button p-button-outlined p-button-secondary" data-compare-set="75" style="padding: 0.45rem 1rem; font-size: 0.875rem; font-weight: 600; border-radius: var(--p-border-radius); border: 1px solid var(--p-border-color); background: var(--p-surface-0); color: var(--p-text-color); cursor: pointer;">
                        75%
                    </button>
                </div>
            `;
    }
    container.innerHTML = containerHtml;
  }
  renderDOM();
  const rootEl = container.querySelector("[data-compare-root]");
  const inputEl = container.querySelector("[data-compare-input]");
  const beforeEl = container.querySelector("[data-compare-before]");
  const handleEl = container.querySelector("[data-compare-handle]");
  const numInput = container.querySelector("[data-compare-num]");
  function updatePosition(pct) {
    currentValue = Math.max(0, Math.min(100, pct));
    if (isVertical) {
      beforeEl.style.clipPath = `inset(0 0 ${100 - currentValue}% 0)`;
      handleEl.style.top = `${currentValue}%`;
    } else {
      beforeEl.style.clipPath = `inset(0 ${100 - currentValue}% 0 0)`;
      handleEl.style.left = `${currentValue}%`;
    }
    if (inputEl) {
      inputEl.value = `${currentValue}`;
      inputEl.setAttribute("aria-valuenow", `${currentValue}`);
    }
    if (numInput) {
      numInput.value = `${Math.round(currentValue)}`;
    }
    container.dispatchEvent(new CustomEvent("compare:change", {
      bubbles: true,
      detail: { value: currentValue }
    }));
  }
  updatePosition(currentValue);
  if (disabled || readonly) return;
  let isDragging = false;
  function updateFromPointer(clientX, clientY) {
    const rect = rootEl.getBoundingClientRect();
    if (isVertical) {
      if (rect.height <= 0) return;
      const p = (clientY - rect.top) / rect.height * 100;
      updatePosition(p);
    } else {
      if (rect.width <= 0) return;
      const p = (clientX - rect.left) / rect.width * 100;
      updatePosition(p);
    }
  }
  const onPointerDown = (e) => {
    isDragging = true;
    try {
      rootEl.setPointerCapture(e.pointerId);
    } catch (_) {
    }
    updateFromPointer(e.clientX, e.clientY);
  };
  const onPointerMove = (e) => {
    if (slideOnHover) {
      updateFromPointer(e.clientX, e.clientY);
    } else if (isDragging) {
      updateFromPointer(e.clientX, e.clientY);
    }
  };
  const onPointerUp = (e) => {
    if (!isDragging) return;
    isDragging = false;
    try {
      rootEl.releasePointerCapture(e.pointerId);
    } catch (_) {
    }
  };
  rootEl.addEventListener("pointerdown", onPointerDown);
  rootEl.addEventListener("pointermove", onPointerMove);
  rootEl.addEventListener("pointerup", onPointerUp);
  rootEl.addEventListener("pointercancel", onPointerUp);
  inputEl.addEventListener("input", () => {
    updatePosition(parseFloat(inputEl.value));
  });
  inputEl.addEventListener("keydown", (e) => {
    let step = props.step || 1;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      updatePosition(currentValue + step);
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      updatePosition(currentValue - step);
    } else if (e.key === "PageUp") {
      e.preventDefault();
      updatePosition(currentValue + 10);
    } else if (e.key === "PageDown") {
      e.preventDefault();
      updatePosition(currentValue - 10);
    } else if (e.key === "Home") {
      e.preventDefault();
      updatePosition(0);
    } else if (e.key === "End") {
      e.preventDefault();
      updatePosition(100);
    }
  });
  container.querySelectorAll("[data-compare-set]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const val = parseFloat(btn.getAttribute("data-compare-set") || "50");
      updatePosition(val);
    });
  });
  if (numInput) {
    numInput.addEventListener("change", () => {
      const val = parseFloat(numInput.value || "50");
      updatePosition(val);
    });
  }
}

// tests/components.test.ts
describe("SoftMax.LaughTale Aura Enterprise Components Suite", () => {
  let container;
  beforeEach(() => {
    document.body.innerHTML = '<div id="app"></div>';
    container = document.getElementById("app");
  });
  it("InputNumber: formats decimals, steps up/down and syncs value", () => {
    InputNumberIsland(container, {
      targetInputName: "salary",
      value: 5e3,
      step: 500,
      mode: "currency",
      currency: "USD"
    });
    const input = container.querySelector(".number-display-input");
    const hidden = container.querySelector('input[name="salary"]');
    assert.strictEqual(input.value, "$ 5,000.00");
    assert.strictEqual(hidden.value, "5000");
    const btnUp = container.querySelector(".btn-step-up");
    btnUp.click();
    assert.strictEqual(input.value, "$ 5,500.00");
    assert.strictEqual(hidden.value, "5500");
  });
  it("InputOtp: handles input entry, character jumping and full value sync", () => {
    InputOtpIsland(container, {
      length: 4,
      targetInputName: "otp_code"
    });
    const inputs = container.querySelectorAll(".otp-digit-input");
    assert.strictEqual(inputs.length, 4);
    inputs[0].value = "1";
    inputs[0].dispatchEvent(new Event("input"));
    inputs[1].value = "2";
    inputs[1].dispatchEvent(new Event("input"));
    inputs[2].value = "3";
    inputs[2].dispatchEvent(new Event("input"));
    inputs[3].value = "4";
    inputs[3].dispatchEvent(new Event("input"));
    const hidden = container.querySelector('input[name="otp_code"]');
    assert.strictEqual(hidden.value, "1234");
  });
  it("InputPassword: evaluates strength and toggles mask", () => {
    InputPasswordIsland(container, {
      placeholder: "Secret password"
    });
    const input = container.querySelector(".password-input");
    assert.strictEqual(input.type, "password");
    const toggleBtn = container.querySelector(".toggle-mask-btn");
    toggleBtn.click();
    const inputAfter = container.querySelector(".password-input");
    assert.strictEqual(inputAfter.type, "text");
  });
  it("ToggleSwitch: toggles checked state and hidden input", () => {
    ToggleSwitchIsland(container, {
      checked: false,
      targetInputName: "notifications"
    });
    const switchBtn = container.querySelector(".laughtale-switch");
    switchBtn.click();
    const hiddenAfter = container.querySelector('input[name="notifications"]');
    assert.strictEqual(hiddenAfter.value, "true");
  });
  it("Slider: respects min, max, step boundaries and handles drag interactions", () => {
    SliderIsland(container, {
      min: 0,
      max: 100,
      value: 25,
      targetInputName: "volume"
    });
    const track = container.querySelector(".slider-track");
    const hidden = container.querySelector('input[name="volume"]');
    assert.strictEqual(hidden.value, "25");
    track.getBoundingClientRect = () => ({
      left: 0,
      top: 0,
      right: 200,
      bottom: 20,
      width: 200,
      height: 20,
      x: 0,
      y: 0,
      toJSON: () => {
      }
    });
    track.dispatchEvent(new MouseEvent("pointerdown", { clientX: 150, bubbles: true }));
    assert.strictEqual(hidden.value, "75");
    track.dispatchEvent(new MouseEvent("pointermove", { clientX: 20, bubbles: true }));
    assert.strictEqual(hidden.value, "10");
    track.dispatchEvent(new MouseEvent("pointerup", { clientX: 20, bubbles: true }));
    assert.strictEqual(hidden.value, "10");
  });
  it("ImageCompare: handles split divider pointer dragging", () => {
    CompareIsland(container, {
      beforeImage: "before.jpg",
      afterImage: "after.jpg",
      beforeLabel: "Before",
      afterLabel: "After"
    });
    const compareBox = container.querySelector(".laughtale-image-compare");
    const clip = container.querySelector(".compare-clip");
    const handleLine = container.querySelector(".compare-handle-line");
    compareBox.getBoundingClientRect = () => ({
      left: 0,
      top: 0,
      right: 400,
      bottom: 200,
      width: 400,
      height: 200,
      x: 0,
      y: 0,
      toJSON: () => {
      }
    });
    compareBox.dispatchEvent(new MouseEvent("pointerdown", { clientX: 100, bubbles: true }));
    assert.strictEqual(clip.style.width, "25%");
    assert.strictEqual(handleLine.style.left, "25%");
    compareBox.dispatchEvent(new MouseEvent("pointermove", { clientX: 320, bubbles: true }));
    assert.strictEqual(clip.style.width, "80%");
    assert.strictEqual(handleLine.style.left, "80%");
  });
  it("Rating: highlights stars on selection and allows cancel", () => {
    RatingIsland(container, {
      stars: 5,
      value: 3,
      allowCancel: true,
      targetInputName: "score"
    });
    const stars = container.querySelectorAll(".rating-star");
    assert.strictEqual(stars.length, 5);
    const hidden = container.querySelector('input[name="score"]');
    assert.strictEqual(hidden.value, "3");
    const cancelBtn = container.querySelector(".rating-cancel-btn");
    cancelBtn.click();
    const hiddenAfter = container.querySelector('input[name="score"]');
    assert.strictEqual(hiddenAfter.value, "0");
  });
  it("Accordion: expands tabs and toggles visibility", () => {
    AccordionIsland(container, {
      tabs: [
        { id: "1", header: "Section 1", content: "Content 1" },
        { id: "2", header: "Section 2", content: "Content 2" }
      ],
      activeIndex: 0
    });
    const tabPanels = container.querySelectorAll(".accordion-content");
    assert.strictEqual(tabPanels[0].style.display, "block");
    assert.strictEqual(tabPanels[1].style.display, "none");
    const headers = container.querySelectorAll(".accordion-header-btn");
    headers[1].click();
    const tabPanelsAfter = container.querySelectorAll(".accordion-content");
    assert.strictEqual(tabPanelsAfter[0].style.display, "none");
    assert.strictEqual(tabPanelsAfter[1].style.display, "block");
  });
  it("Tabs: changes active tab panel", () => {
    TabsIsland(container, {
      tabs: [
        { id: "tab1", header: "Overview", content: "Overview Content" },
        { id: "tab2", header: "Security", content: "Security Content" }
      ],
      activeIndex: 0,
      targetInputName: "active_tab"
    });
    const headerBtns = container.querySelectorAll(".tab-header-btn");
    assert.strictEqual(headerBtns.length, 2);
    headerBtns[1].click();
    const hidden = container.querySelector('input[name="active_tab"]');
    assert.strictEqual(hidden.value, "1");
    assert.ok(container.innerHTML.includes("Security Content"));
  });
  it("AutoComplete: filters list on typing", async () => {
    AutoCompleteIsland(container, {
      items: [
        { label: "Erbil", value: "EBL" },
        { label: "Sulaymaniyah", value: "SUL" },
        { label: "Duhok", value: "DHK" }
      ],
      targetInputName: "city"
    });
    const input = container.querySelector(".autocomplete-input");
    input.value = "Erb";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    await new Promise((r) => setTimeout(r, 180));
    const items = container.querySelectorAll(".autocomplete-item");
    assert.strictEqual(items.length, 1);
    assert.strictEqual(items[0].getAttribute("data-value"), "EBL");
  });
  it("ColorPicker: updates color on palette swatch selection", () => {
    ColorPickerIsland(container, {
      value: "#10b981",
      targetInputName: "theme_color"
    });
    const hidden = container.querySelector('input[name="theme_color"]');
    assert.strictEqual(hidden.value, "#10b981");
  });
  it("Knob: calculates value, renders svg circle and responds to pointer events", () => {
    KnobIsland(container, {
      value: 75,
      min: 0,
      max: 100,
      size: 100,
      targetInputName: "percentage"
    });
    const knobEl = container.querySelector(".laughtale-knob");
    const hidden = container.querySelector('input[name="percentage"]');
    const valueDisplay = container.querySelector(".knob-value-display");
    assert.strictEqual(hidden.value, "75");
    assert.strictEqual(valueDisplay.textContent?.trim(), "75%");
    knobEl.getBoundingClientRect = () => ({
      left: 0,
      top: 0,
      right: 100,
      bottom: 100,
      width: 100,
      height: 100,
      x: 0,
      y: 0,
      toJSON: () => {
      }
    });
    knobEl.dispatchEvent(new MouseEvent("pointerdown", { clientX: 50, clientY: 100, bubbles: true }));
    assert.strictEqual(hidden.value, "50");
    assert.strictEqual(valueDisplay.textContent?.trim(), "50%");
  });
  it("Inplace: toggles between display and edit modes", () => {
    InplaceIsland(container, {
      value: "Initial Note",
      targetInputName: "note"
    });
    const display = container.querySelector(".laughtale-inplace-display");
    assert.ok(display);
    display.click();
    const input = container.querySelector(".inplace-input");
    assert.ok(input);
    assert.strictEqual(input.value, "Initial Note");
  });
});
