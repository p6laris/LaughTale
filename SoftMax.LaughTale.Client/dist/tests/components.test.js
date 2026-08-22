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

// src/icons/lucide.ts
var LucideIcons = {
  // Navigation & Arrows
  chevronDown: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>`,
  chevronUp: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m18 15-6-6-6 6"/></svg>`,
  chevronLeft: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>`,
  chevronRight: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>`,
  arrowUp: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 7-7 7 7"/><path d="M12 19V5"/></svg>`,
  arrowDown: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14"/><path d="m19 12-7 7-7-7"/></svg>`,
  arrowLeft: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>`,
  arrowRight: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>`,
  // Common Actions
  check: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>`,
  checkCircle: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>`,
  x: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>`,
  xCircle: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>`,
  plus: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>`,
  minus: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/></svg>`,
  search: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>`,
  refreshCw: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/></svg>`,
  trash2: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>`,
  copy: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>`,
  externalLink: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>`,
  // Forms & Controls
  eye: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>`,
  eyeOff: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>`,
  calendar: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/></svg>`,
  clock: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
  star: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
  starEmpty: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
  camera: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>`,
  uploadCloud: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M12 12v9"/><path d="m16 16-4-4-4 4"/></svg>`,
  sliders: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" x2="4" y1="21" y2="14"/><line x1="4" x2="4" y1="10" y2="3"/><line x1="12" x2="12" y1="21" y2="12"/><line x1="12" x2="12" y1="8" y2="3"/><line x1="20" x2="20" y1="21" y2="16"/><line x1="20" x2="20" y1="12" y2="3"/><line x1="1" x2="7" y1="14" y2="14"/><line x1="9" x2="15" y1="8" y2="8"/><line x1="17" x2="23" y1="16" y2="16"/></svg>`,
  palette: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>`,
  // Security & Status
  lock: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`,
  shield: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/></svg>`,
  alertTriangle: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>`,
  info: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>`,
  bell: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>`,
  zap: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
  activity: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>`,
  // Media & UI
  layers: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.9a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/></svg>`,
  folder: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/></svg>`,
  fileText: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg>`,
  terminal: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 17 10 11 4 5"/><line x1="12" x2="20" y1="19" y2="19"/></svg>`,
  moreHorizontal: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>`,
  sun: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>`,
  moon: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>`,
  home: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
  edit: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>`
};

// src/components/input-number.ts
function InputNumberIsland(container, props) {
  let rawValue = props.value !== void 0 ? Number(props.value) : null;
  const step = props.step || 1;
  const decimals = props.decimals !== void 0 ? props.decimals : props.mode === "currency" ? 2 : 0;
  const prefix = props.prefix || (props.mode === "currency" ? props.currency === "EUR" ? "\u20AC " : props.currency === "IQD" ? "IQD " : "$ " : "");
  const suffix = props.suffix || (props.mode === "percent" ? " %" : "");
  function formatNumber(val) {
    if (val === null || isNaN(val)) return "";
    const parts = val.toFixed(decimals).split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return `${prefix}${parts.join(".")}${suffix}`;
  }
  function parseRaw(str) {
    let cleaned = str.replace(new RegExp(`[${prefix}${suffix},]`, "g"), "").trim();
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? null : parsed;
  }
  function render() {
    container.innerHTML = `
            <div class="laughtale-input-number" style="display: inline-flex; align-items: stretch; border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius); background: var(--p-surface-0); overflow: hidden; transition: border-color 0.2s ease, box-shadow 0.2s ease; width: 100%; max-width: 320px;">
                <input type="text" class="number-display-input" value="${formatNumber(rawValue)}" placeholder="${props.placeholder || ""}" ${props.disabled ? "disabled" : ""} style="flex: 1; padding: 0.5rem 0.75rem; border: none; outline: none; background: transparent; font-family: var(--p-font-family); font-size: 0.875rem; color: var(--p-text-color); font-variant-numeric: tabular-nums;" />
                
                ${props.showButtons !== false ? `
                    <div style="display: flex; flex-direction: column; border-left: 1px solid var(--p-border-color); width: 2rem;">
                        <button type="button" class="btn-step-up" style="flex: 1; border: none; background: var(--p-surface-50); color: var(--p-surface-600); cursor: pointer; display: flex; align-items: center; justify-content: center; border-bottom: 1px solid var(--p-border-color); transition: background 0.15s ease;">
                            ${LucideIcons.chevronUp}
                        </button>
                        <button type="button" class="btn-step-down" style="flex: 1; border: none; background: var(--p-surface-50); color: var(--p-surface-600); cursor: pointer; display: flex; align-items: center; justify-content: center; transition: background 0.15s ease;">
                            ${LucideIcons.chevronDown}
                        </button>
                    </div>
                ` : ""}
            </div>
        `;
    const displayInput = container.querySelector(".number-display-input");
    displayInput.addEventListener("focus", () => {
      const wrap = container.querySelector(".laughtale-input-number");
      if (wrap) {
        wrap.style.borderColor = "var(--p-primary-600)";
        wrap.style.boxShadow = "0 0 0 1px var(--p-primary-600)";
      }
    });
    displayInput.addEventListener("blur", () => {
      const wrap = container.querySelector(".laughtale-input-number");
      if (wrap) {
        wrap.style.borderColor = "var(--p-border-color)";
        wrap.style.boxShadow = "none";
      }
      displayInput.value = formatNumber(rawValue);
    });
    displayInput.addEventListener("input", () => {
      rawValue = parseRaw(displayInput.value);
      syncValue();
    });
    container.querySelector(".btn-step-up")?.addEventListener("click", () => {
      rawValue = (rawValue ?? 0) + step;
      if (props.max !== void 0 && rawValue > props.max) rawValue = props.max;
      displayInput.value = formatNumber(rawValue);
      syncValue();
    });
    container.querySelector(".btn-step-down")?.addEventListener("click", () => {
      rawValue = (rawValue ?? 0) - step;
      if (props.min !== void 0 && rawValue < props.min) rawValue = props.min;
      displayInput.value = formatNumber(rawValue);
      syncValue();
    });
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
      hidden.value = rawValue !== null ? rawValue.toString() : "";
    }
    container.dispatchEvent(new CustomEvent("number:change", {
      bubbles: true,
      detail: { value: rawValue }
    }));
  }
  render();
  syncValue();
}

// src/components/input-otp.ts
function InputOtpIsland(container, props) {
  const length = props.length || 6;
  let values = new Array(length).fill("");
  function render() {
    const boxes = Array.from({ length }, (_, i) => `
            <input type="${props.mask ? "password" : "text"}" 
                   class="otp-box otp-digit-input" 
                   data-index="${i}" 
                   maxlength="1" 
                   inputmode="numeric" 
                   pattern="[0-9]*" 
                   value="${values[i] || ""}" 
                   ${props.disabled ? "disabled" : ""} 
                   style="width: 2.75rem; height: 3.25rem; text-align: center; font-size: 1.25rem; font-weight: 700; border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius); background: var(--p-surface-0); color: var(--p-text-color); outline: none; transition: all 0.15s ease;" />
        `).join("");
    container.innerHTML = `
            <div class="laughtale-input-otp" style="display: inline-flex; gap: 0.5rem; align-items: center;">
                ${boxes}
            </div>
        `;
    const inputs = container.querySelectorAll(".otp-box");
    inputs.forEach((input, idx) => {
      input.addEventListener("focus", () => {
        input.style.borderColor = "var(--p-primary-600)";
        input.style.boxShadow = "0 0 0 2px rgba(16, 185, 129, 0.2)";
        input.select();
      });
      input.addEventListener("blur", () => {
        input.style.borderColor = "var(--p-border-color)";
        input.style.boxShadow = "none";
      });
      input.addEventListener("input", (e) => {
        const val = e.target.value;
        if (/^\d$/.test(val)) {
          values[idx] = val;
          if (idx < length - 1) inputs[idx + 1].focus();
        } else if (val === "") {
          values[idx] = "";
        } else {
          input.value = values[idx] || "";
        }
        syncOtp();
      });
      input.addEventListener("keydown", (e) => {
        if (e.key === "Backspace" && !input.value && idx > 0) {
          inputs[idx - 1].focus();
        } else if (e.key === "ArrowLeft" && idx > 0) {
          inputs[idx - 1].focus();
        } else if (e.key === "ArrowRight" && idx < length - 1) {
          inputs[idx + 1].focus();
        }
      });
      input.addEventListener("paste", (e) => {
        e.preventDefault();
        const paste = (e.clipboardData || window.clipboardData)?.getData("text") || "";
        const digits = paste.replace(/\D/g, "").slice(0, length);
        digits.split("").forEach((d, i) => {
          values[i] = d;
          if (inputs[i]) inputs[i].value = d;
        });
        syncOtp();
        if (digits.length === length) {
          inputs[length - 1].focus();
        }
      });
    });
  }
  function syncOtp() {
    const fullCode = values.join("");
    if (props.targetInputName) {
      let hidden = document.querySelector(`input[name="${props.targetInputName}"]`);
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
      detail: { value: fullCode, isComplete: fullCode.length === length }
    }));
  }
  render();
  syncOtp();
}

// src/components/input-password.ts
function InputPasswordIsland(container, props) {
  let isMasked = true;
  let currentPassword = "";
  function calculateStrength(pwd) {
    if (!pwd) return { score: 0, label: "", color: "transparent", width: "0%" };
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    if (score <= 1) return { score: 1, label: "Weak", color: "#ef4444", width: "33%" };
    if (score <= 3) return { score: 2, label: "Medium", color: "#f59e0b", width: "66%" };
    return { score: 3, label: "Strong", color: "#10b981", width: "100%" };
  }
  container.innerHTML = `
        <div class="laughtale-password" style="display: flex; flex-direction: column; gap: 0.5rem; width: 100%; max-width: 340px;">
            <div style="display: flex; align-items: center; border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius); background: var(--p-surface-0); overflow: hidden; padding-right: 0.5rem;">
                <input type="password" 
                       class="password-input" 
                       value="" 
                       placeholder="${props.placeholder || "Enter password..."}" 
                       ${props.disabled ? "disabled" : ""} 
                       style="flex: 1; padding: 0.5rem 0.75rem; border: none; outline: none; background: transparent; font-size: 0.875rem; color: var(--p-text-color);" />
                
                ${props.toggleMask !== false ? `
                    <button type="button" class="toggle-mask-btn" style="border: none; background: transparent; color: var(--p-surface-400); cursor: pointer; display: flex; align-items: center; justify-content: center; padding: 0.25rem;">
                        ${LucideIcons.eye}
                    </button>
                ` : ""}
            </div>

            ${props.showMeter !== false ? `
                <div class="password-meter-wrap" style="display: none; flex-direction: column; gap: 0.25rem;">
                    <div style="height: 4px; border-radius: 2px; background: var(--p-surface-200); overflow: hidden;">
                        <div class="password-meter-bar" style="height: 100%; width: 0%; background: transparent; transition: all 0.3s ease;"></div>
                    </div>
                    <div style="display: flex; justify-content: space-between; font-size: 0.6875rem; font-weight: 600;">
                        <span style="color: var(--p-surface-500);">Strength</span>
                        <span class="password-meter-label" style="color: var(--p-surface-500);"></span>
                    </div>
                </div>
            ` : ""}
        </div>
    `;
  const input = container.querySelector(".password-input");
  const toggleBtn = container.querySelector(".toggle-mask-btn");
  const meterWrap = container.querySelector(".password-meter-wrap");
  const meterBar = container.querySelector(".password-meter-bar");
  const meterLabel = container.querySelector(".password-meter-label");
  function updateMeterVisuals() {
    if (!meterWrap || !meterBar || !meterLabel) return;
    if (!currentPassword) {
      meterWrap.style.display = "none";
      return;
    }
    meterWrap.style.display = "flex";
    const meter = calculateStrength(currentPassword);
    meterBar.style.width = meter.width;
    meterBar.style.background = meter.color;
    meterLabel.textContent = meter.label;
    meterLabel.style.color = meter.color;
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
      hidden.value = currentPassword;
    }
    container.dispatchEvent(new CustomEvent("password:change", {
      bubbles: true,
      detail: { value: currentPassword, strength: calculateStrength(currentPassword).label }
    }));
  }
  input.addEventListener("input", () => {
    currentPassword = input.value;
    updateMeterVisuals();
    syncValue();
  });
  toggleBtn?.addEventListener("click", () => {
    isMasked = !isMasked;
    input.type = isMasked ? "password" : "text";
    toggleBtn.innerHTML = isMasked ? LucideIcons.eye : LucideIcons.eyeOff;
    input.focus();
  });
  syncValue();
}

// src/components/toggle-switch.ts
function ToggleSwitchIsland(container, props) {
  let isChecked = Boolean(props.checked);
  function render() {
    container.innerHTML = `
            <label class="laughtale-switch" style="display: inline-flex; align-items: center; gap: 0.75rem; cursor: ${props.disabled ? "not-allowed" : "pointer"}; user-select: none; opacity: ${props.disabled ? "0.6" : "1"};">
                <div class="switch-track" style="position: relative; width: 2.75rem; height: 1.5rem; border-radius: 9999px; background: ${isChecked ? "var(--p-primary-600)" : "var(--p-surface-300)"}; transition: background-color 0.2s ease;">
                    <div class="switch-thumb" style="position: absolute; top: 2px; left: ${isChecked ? "1.35rem" : "2px"}; width: 1.25rem; height: 1.25rem; border-radius: 50%; background: #ffffff; box-shadow: 0 1px 3px rgba(0,0,0,0.25); transition: left 0.2s cubic-bezier(0.16, 1, 0.3, 1);"></div>
                </div>
                ${props.label ? `<span style="font-size: 0.875rem; font-weight: 500; color: var(--p-text-color);">${props.label}</span>` : ""}
            </label>
        `;
    if (!props.disabled) {
      container.querySelector(".laughtale-switch")?.addEventListener("click", (e) => {
        e.preventDefault();
        isChecked = !isChecked;
        render();
        syncValue();
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
      hidden.value = isChecked ? "true" : "false";
    }
    container.dispatchEvent(new CustomEvent("switch:change", {
      bubbles: true,
      detail: { checked: isChecked }
    }));
  }
  render();
  syncValue();
}

// src/components/slider.ts
function SliderIsland(container, props) {
  const min = props.min !== void 0 ? props.min : 0;
  const max = props.max !== void 0 ? props.max : 100;
  const step = props.step !== void 0 ? props.step : 1;
  let currentValue = props.value !== void 0 ? props.value : min;
  function getPercent(val) {
    return Math.max(0, Math.min(100, (val - min) / (max - min) * 100));
  }
  const initialPercent = getPercent(currentValue);
  container.innerHTML = `
        <div class="laughtale-slider" style="position: relative; width: 100%; max-width: 320px; padding: 1rem 0; user-select: none; touch-action: none;">
            <!-- Track -->
            <div class="slider-track" style="position: relative; height: 6px; border-radius: 3px; background: var(--p-surface-200); cursor: ${props.disabled ? "not-allowed" : "pointer"};">
                <!-- Active Fill Bar -->
                <div class="slider-fill" style="position: absolute; top: 0; left: 0; height: 100%; width: ${initialPercent}%; border-radius: 3px; background: var(--p-primary-600); pointer-events: none;"></div>
                <!-- Drag Handle -->
                <div class="slider-handle" style="position: absolute; top: 50%; left: ${initialPercent}%; transform: translate(-50%, -50%); width: 1.125rem; height: 1.125rem; border-radius: 50%; background: #ffffff; border: 2px solid var(--p-primary-600); box-shadow: 0 1px 4px rgba(0,0,0,0.2); cursor: ${props.disabled ? "not-allowed" : "grab"};"></div>
            </div>

            <div style="display: flex; justify-content: space-between; margin-top: 0.5rem; font-size: 0.75rem; color: var(--p-surface-500); font-family: var(--p-font-mono);">
                <span>${min}</span>
                <span class="slider-value-display" style="font-weight: 700; color: var(--p-primary-600);">${currentValue}</span>
                <span>${max}</span>
            </div>
        </div>
    `;
  const track = container.querySelector(".slider-track");
  const fill = container.querySelector(".slider-fill");
  const handle = container.querySelector(".slider-handle");
  const valueDisplay = container.querySelector(".slider-value-display");
  function updateVisuals() {
    const pct = getPercent(currentValue);
    fill.style.width = `${pct}%`;
    handle.style.left = `${pct}%`;
    valueDisplay.textContent = currentValue.toString();
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
    container.dispatchEvent(new CustomEvent("slider:change", {
      bubbles: true,
      detail: { value: currentValue }
    }));
  }
  if (!props.disabled) {
    let isDragging = false;
    const updateFromClientX = (clientX) => {
      const rect = track.getBoundingClientRect();
      if (rect.width <= 0) return;
      let ratio = (clientX - rect.left) / rect.width;
      ratio = Math.max(0, Math.min(1, ratio));
      let rawVal = min + ratio * (max - min);
      rawVal = Math.round(rawVal / step) * step;
      currentValue = Math.max(min, Math.min(max, rawVal));
      updateVisuals();
      syncValue();
    };
    const onPointerDown = (e) => {
      isDragging = true;
      handle.style.cursor = "grabbing";
      handle.style.transform = "translate(-50%, -50%) scale(1.2)";
      if ("setPointerCapture" in track && e.pointerId !== void 0) {
        try {
          track.setPointerCapture(e.pointerId);
        } catch (_) {
        }
      }
      updateFromClientX(e.clientX);
    };
    const onPointerMove = (e) => {
      if (!isDragging) return;
      updateFromClientX(e.clientX);
    };
    const onPointerUp = (e) => {
      if (!isDragging) return;
      isDragging = false;
      handle.style.cursor = "grab";
      handle.style.transform = "translate(-50%, -50%) scale(1)";
      if ("releasePointerCapture" in track && e.pointerId !== void 0) {
        try {
          track.releasePointerCapture(e.pointerId);
        } catch (_) {
        }
      }
    };
    track.addEventListener("pointerdown", onPointerDown);
    track.addEventListener("pointermove", onPointerMove);
    track.addEventListener("pointerup", onPointerUp);
    track.addEventListener("pointercancel", onPointerUp);
    track.addEventListener("mousedown", onPointerDown);
    window.addEventListener("mousemove", onPointerMove);
    window.addEventListener("mouseup", onPointerUp);
  }
  syncValue();
}

// src/components/rating.ts
function RatingIsland(container, props) {
  const totalStars = props.stars || 5;
  let currentRating = props.value || 0;
  let hoverRating = 0;
  function render() {
    const starElements = Array.from({ length: totalStars }, (_, i) => {
      const starNum = i + 1;
      const isFilled = (hoverRating || currentRating) >= starNum;
      const color = isFilled ? "#f59e0b" : "var(--p-surface-300)";
      return `
                <span class="rating-star" data-star="${starNum}" style="cursor: ${props.disabled ? "default" : "pointer"}; color: ${color}; transition: transform 0.15s ease, color 0.15s ease; display: inline-flex;">
                    ${isFilled ? LucideIcons.star : LucideIcons.starEmpty}
                </span>
            `;
    }).join("");
    container.innerHTML = `
            <div class="laughtale-rating" style="display: inline-flex; align-items: center; gap: 0.35rem; user-select: none;">
                ${props.allowCancel !== false ? `
                    <button type="button" class="rating-cancel-btn" style="border: none; background: transparent; color: var(--p-surface-400); cursor: pointer; display: flex; align-items: center; padding: 0 0.25rem;">
                        ${LucideIcons.x}
                    </button>
                ` : ""}
                ${starElements}
            </div>
        `;
    if (props.disabled) return;
    container.querySelectorAll(".rating-star").forEach((el) => {
      el.addEventListener("mouseenter", () => {
        hoverRating = parseInt(el.getAttribute("data-star"), 10);
        render();
      });
      el.addEventListener("click", () => {
        currentRating = parseInt(el.getAttribute("data-star"), 10);
        hoverRating = 0;
        render();
        syncValue();
      });
    });
    container.querySelector(".laughtale-rating")?.addEventListener("mouseleave", () => {
      hoverRating = 0;
      render();
    });
    container.querySelector(".rating-cancel-btn")?.addEventListener("click", () => {
      currentRating = 0;
      hoverRating = 0;
      render();
      syncValue();
    });
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
      hidden.value = currentRating.toString();
    }
    container.dispatchEvent(new CustomEvent("rating:change", {
      bubbles: true,
      detail: { value: currentRating }
    }));
  }
  render();
  syncValue();
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

// src/composables/animation/useTransition.ts
function useTransition(element, options = {}) {
  const duration = options.duration ?? 200;
  const easing = options.easing ?? "cubic-bezier(0.16, 1, 0.3, 1)";
  const preset = options.preset ?? "fade";
  function getPresetStyles(state) {
    switch (preset) {
      case "fade":
        return {
          opacity: state === "visible" ? "1" : "0",
          transform: "none"
        };
      case "scale":
        return {
          opacity: state === "visible" ? "1" : "0",
          transform: state === "visible" ? "scale(1)" : "scale(0.95)"
        };
      case "slide-up":
        return {
          opacity: state === "visible" ? "1" : "0",
          transform: state === "visible" ? "translateY(0)" : "translateY(12px)"
        };
      case "slide-down":
        return {
          opacity: state === "visible" ? "1" : "0",
          transform: state === "visible" ? "translateY(0)" : "translateY(-12px)"
        };
      case "slide-left":
        return {
          transform: state === "visible" ? "translateX(0)" : "translateX(100%)"
        };
      case "slide-right":
        return {
          transform: state === "visible" ? "translateX(0)" : "translateX(-100%)"
        };
      case "collapse":
        return {
          height: state === "visible" ? "auto" : "0px",
          opacity: state === "visible" ? "1" : "0",
          overflow: "hidden"
        };
      default:
        return { opacity: state === "visible" ? "1" : "0" };
    }
  }
  function enter(cb) {
    if (!element) return;
    options.onEnterStart?.();
    element.style.transition = `all ${duration}ms ${easing}`;
    element.style.willChange = "transform, opacity";
    const hidden = getPresetStyles("hidden");
    Object.assign(element.style, hidden);
    element.style.display = "block";
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const visible = getPresetStyles("visible");
        Object.assign(element.style, visible);
        setTimeout(() => {
          element.style.willChange = "auto";
          options.onEnterEnd?.();
          cb?.();
        }, duration);
      });
    });
  }
  function exit(cb) {
    if (!element) return;
    options.onExitStart?.();
    element.style.transition = `all ${duration}ms ${easing}`;
    element.style.willChange = "transform, opacity";
    const hidden = getPresetStyles("hidden");
    Object.assign(element.style, hidden);
    setTimeout(() => {
      element.style.display = "none";
      element.style.willChange = "auto";
      options.onExitEnd?.();
      cb?.();
    }, duration);
  }
  return { enter, exit };
}

// src/components/accordion.ts
function AccordionIsland(container, props) {
  const tabs = props.tabs || [];
  let activeIndices = /* @__PURE__ */ new Set();
  if (Array.isArray(props.activeIndex)) {
    props.activeIndex.forEach((i) => activeIndices.add(i));
  } else if (typeof props.activeIndex === "number") {
    activeIndices.add(props.activeIndex);
  } else {
    activeIndices.add(0);
  }
  const disclosures = {};
  tabs.forEach((_, idx) => {
    disclosures[idx] = useDisclosure({
      defaultIsOpen: activeIndices.has(idx)
    });
  });
  function render() {
    const tabHtml = tabs.map((tab, idx) => {
      const isOpen = disclosures[idx]?.isOpen ?? false;
      return `
                <div class="accordion-tab ${isOpen ? "tab-open" : ""}" data-idx="${idx}" style="border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius); margin-bottom: 0.5rem; background: var(--p-surface-0); overflow: hidden;">
                    <button type="button" 
                            class="accordion-header-btn" 
                            data-idx="${idx}" 
                            ${tab.disabled ? "disabled" : ""} 
                            style="width: 100%; display: flex; align-items: center; justify-content: space-between; padding: 0.875rem 1.25rem; border: none; background: ${isOpen ? "var(--p-surface-50)" : "var(--p-surface-0)"}; color: var(--p-surface-900); font-weight: 600; font-size: 0.875rem; cursor: ${tab.disabled ? "not-allowed" : "pointer"}; text-align: left; transition: background 0.15s ease;">
                        <span style="display: flex; align-items: center; gap: 0.5rem;">
                            ${tab.icon ? `<span>${tab.icon}</span>` : ""}
                            <span>${tab.header}</span>
                        </span>
                        <span class="chevron-icon" style="color: var(--p-surface-500); display: flex; align-items: center; transition: transform 0.25s cubic-bezier(0.2, 0, 0, 1); transform: rotate(${isOpen ? "180deg" : "0deg"});">
                            ${LucideIcons.chevronDown}
                        </span>
                    </button>
                    <div class="accordion-content" style="display: ${isOpen ? "block" : "none"}; padding: 1.25rem; border-top: 1px solid var(--p-border-color); font-size: 0.875rem; color: var(--p-surface-600); line-height: 1.6;">
                        <div class="tab-slot" data-slot-index="${idx}">${tab.content || ""}</div>
                    </div>
                </div>
            `;
    }).join("");
    container.innerHTML = `
            <div class="laughtale-accordion" style="width: 100%;">
                ${tabHtml}
            </div>
        `;
    bindEvents();
  }
  function toggleTab(idx) {
    if (!props.multiple) {
      tabs.forEach((_, otherIdx) => {
        if (otherIdx !== idx) disclosures[otherIdx]?.close();
      });
    }
    disclosures[idx]?.toggle();
    updateDOM();
  }
  function updateDOM() {
    container.querySelectorAll(".accordion-tab").forEach((tabEl) => {
      const idx = Number(tabEl.getAttribute("data-idx"));
      const isOpen = disclosures[idx]?.isOpen ?? false;
      const contentEl = tabEl.querySelector(".accordion-content");
      const chevronEl = tabEl.querySelector(".chevron-icon");
      const headerBtn = tabEl.querySelector(".accordion-header-btn");
      tabEl.classList.toggle("tab-open", isOpen);
      headerBtn.style.background = isOpen ? "var(--p-surface-50)" : "var(--p-surface-0)";
      chevronEl.style.transform = `rotate(${isOpen ? "180deg" : "0deg"})`;
      const transition = useTransition(contentEl, { preset: "collapse" });
      if (isOpen) {
        transition.enter();
      } else {
        contentEl.style.display = "none";
        transition.exit();
      }
    });
    const activeList = tabs.map((_, idx) => idx).filter((idx) => disclosures[idx]?.isOpen);
    container.dispatchEvent(new CustomEvent("accordion:change", {
      bubbles: true,
      detail: { activeIndex: activeList }
    }));
  }
  function bindEvents() {
    container.querySelectorAll(".accordion-header-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const idx = Number(btn.getAttribute("data-idx"));
        toggleTab(idx);
      });
    });
  }
  render();
}

// src/components/tabs.ts
function TabsIsland(container, props) {
  const tabs = props.tabs || [];
  let activeIndex = props.activeIndex || 0;
  function render() {
    const headerButtons = tabs.map((tab, idx) => {
      const isActive = idx === activeIndex;
      return `
                <button type="button" 
                        class="tab-header-btn ${isActive ? "tab-active" : ""}" 
                        data-idx="${idx}" 
                        ${tab.disabled ? "disabled" : ""} 
                        style="position: relative; padding: 0.75rem 1.25rem; border: none; background: transparent; color: ${isActive ? "var(--p-primary-600)" : "var(--p-surface-600)"}; font-weight: ${isActive ? "700" : "500"}; font-size: 0.875rem; cursor: ${tab.disabled ? "not-allowed" : "pointer"}; transition: color 0.15s ease; display: inline-flex; align-items: center; gap: 0.5rem; border-bottom: 2px solid ${isActive ? "var(--p-primary-600)" : "transparent"};">
                    ${tab.icon ? `<span>${tab.icon}</span>` : ""}
                    <span>${tab.header}</span>
                </button>
            `;
    }).join("");
    container.innerHTML = `
            <div class="laughtale-tabs" style="width: 100%;">
                <!-- Tab Headers Bar -->
                <div class="tabs-header-bar" style="display: flex; border-bottom: 1px solid var(--p-border-color); gap: 0.25rem; overflow-x: auto; position: relative;">
                    ${headerButtons}
                </div>

                <!-- Active Tab Content Panel -->
                <div class="tab-panel-body" style="padding: 1.25rem 0; font-size: 0.875rem; color: var(--p-surface-700); line-height: 1.6; transition: opacity 0.2s ease;">
                    <div class="tab-slot-content">${tabs[activeIndex]?.content || ""}</div>
                </div>
            </div>
        `;
    const externalSlot = container.querySelector(`[data-slot="tab-${activeIndex}"]`);
    const targetContainer = container.querySelector(".tab-slot-content");
    if (externalSlot && targetContainer) {
      targetContainer.innerHTML = "";
      targetContainer.appendChild(externalSlot);
    }
    container.querySelectorAll(".tab-header-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const idx = Number(btn.getAttribute("data-idx"));
        activeIndex = idx;
        render();
        if (props.targetInputName) {
          let hidden = container.querySelector(`input[name="${props.targetInputName}"]`);
          if (!hidden) {
            hidden = document.createElement("input");
            hidden.type = "hidden";
            hidden.name = props.targetInputName;
            container.appendChild(hidden);
          }
          hidden.value = String(activeIndex);
        }
        container.dispatchEvent(new CustomEvent("tabs:change", {
          bubbles: true,
          detail: { activeIndex }
        }));
      });
    });
  }
  render();
}

// src/components/autocomplete.ts
function AutoCompleteIsland(container, props) {
  const allItems = props.items || [];
  let selectedValue = props.value || "";
  let searchQuery = "";
  let isOpen = false;
  function getFilteredItems() {
    if (!searchQuery) return allItems;
    const q = searchQuery.toLowerCase();
    return allItems.filter((item) => item.label.toLowerCase().includes(q) || item.value.toLowerCase().includes(q));
  }
  container.innerHTML = `
        <div class="laughtale-autocomplete" style="position: relative; width: 100%; max-width: 320px;">
            <div class="autocomplete-input-wrap" style="display: flex; align-items: center; border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius); background: var(--p-surface-0); padding: 0 0.5rem; transition: border-color 0.2s ease;">
                <span style="color: var(--p-surface-400); display: flex; align-items: center; margin-right: 0.25rem;">
                    ${LucideIcons.search}
                </span>
                <input type="text" 
                       class="autocomplete-input" 
                       value="${selectedValue ? allItems.find((i) => i.value === selectedValue)?.label || "" : ""}" 
                       placeholder="${props.placeholder || "Search or select..."}" 
                       ${props.disabled ? "disabled" : ""} 
                       style="flex: 1; padding: 0.5rem 0.25rem; border: none; outline: none; background: transparent; font-size: 0.875rem; color: var(--p-text-color);" />
                <button type="button" class="btn-clear-autocomplete" style="display: ${selectedValue ? "flex" : "none"}; border: none; background: transparent; color: var(--p-surface-400); cursor: pointer; padding: 0.25rem; align-items: center;">
                    ${LucideIcons.x}
                </button>
            </div>

            <!-- Dropdown Popup -->
            <div class="autocomplete-overlay" style="display: none; position: absolute; top: calc(100% + 4px); left: 0; right: 0; z-index: 500; background: var(--p-surface-0); border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius); box-shadow: var(--p-shadow-lg); max-height: 220px; overflow-y: auto; padding: 0.25rem;">
            </div>
        </div>
    `;
  const input = container.querySelector(".autocomplete-input");
  const clearBtn = container.querySelector(".btn-clear-autocomplete");
  const overlay = container.querySelector(".autocomplete-overlay");
  function updateList() {
    const filtered = getFilteredItems();
    overlay.style.display = isOpen ? "block" : "none";
    if (filtered.length === 0) {
      overlay.innerHTML = `<div style="padding: 0.75rem; font-size: 0.8125rem; color: var(--p-surface-400); text-align: center;">No results found</div>`;
      return;
    }
    overlay.innerHTML = filtered.map((item) => `
            <div class="autocomplete-item" data-value="${item.value}" style="padding: 0.5rem 0.75rem; font-size: 0.875rem; color: var(--p-surface-800); cursor: pointer; display: flex; align-items: center; justify-content: space-between; border-radius: var(--p-border-radius); transition: background 0.15s ease;">
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                    ${item.icon ? `<span>${item.icon}</span>` : ""}
                    <span>${item.label}</span>
                </div>
                ${item.value === selectedValue ? `<span style="color: var(--p-primary-600);">${LucideIcons.check}</span>` : ""}
            </div>
        `).join("");
    overlay.querySelectorAll(".autocomplete-item").forEach((itemEl) => {
      itemEl.addEventListener("click", () => {
        selectedValue = itemEl.getAttribute("data-value") || "";
        const item = allItems.find((i) => i.value === selectedValue);
        input.value = item ? item.label : "";
        searchQuery = "";
        isOpen = false;
        clearBtn.style.display = "flex";
        updateList();
        syncValue();
      });
    });
  }
  if (!props.disabled) {
    input.addEventListener("focus", () => {
      isOpen = true;
      updateList();
    });
    input.addEventListener("input", () => {
      searchQuery = input.value;
      isOpen = true;
      clearBtn.style.display = input.value ? "flex" : "none";
      updateList();
    });
    clearBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      selectedValue = "";
      searchQuery = "";
      input.value = "";
      isOpen = false;
      clearBtn.style.display = "none";
      updateList();
      syncValue();
    });
    document.addEventListener("click", (e) => {
      if (!container.contains(e.target)) {
        isOpen = false;
        overlay.style.display = "none";
      }
    });
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
      hidden.value = selectedValue;
    }
    container.dispatchEvent(new CustomEvent("autocomplete:change", {
      bubbles: true,
      detail: { value: selectedValue }
    }));
  }
  updateList();
  syncValue();
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
function ColorPickerIsland(container, props) {
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
function KnobIsland(container, props) {
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
function InplaceIsland(container, props) {
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
function ImageCompareIsland(container, props) {
  let splitPercent = 50;
  container.innerHTML = `
        <div class="laughtale-image-compare" style="position: relative; width: 100%; max-width: 600px; height: 340px; border-radius: var(--p-border-radius-lg); overflow: hidden; user-select: none; border: 1px solid var(--p-border-color); box-shadow: var(--p-shadow-md); touch-action: none; cursor: ew-resize;">
            <!-- After Image (Bottom) -->
            <img src="${props.afterImage}" alt="After" style="position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; pointer-events: none;" />
            ${props.afterLabel ? `<span style="position: absolute; bottom: 0.75rem; right: 0.75rem; background: rgba(0,0,0,0.6); color: #ffffff; padding: 0.25rem 0.5rem; border-radius: var(--p-border-radius); font-size: 0.75rem; font-weight: 600; pointer-events: none;">${props.afterLabel}</span>` : ""}

            <!-- Before Image (Top Clipped) -->
            <div class="compare-clip" style="position: absolute; inset: 0; width: ${splitPercent}%; height: 100%; overflow: hidden; pointer-events: none;">
                <img src="${props.beforeImage}" alt="Before" style="position: absolute; top: 0; left: 0; width: 600px; max-width: 600px; height: 340px; object-fit: cover;" />
                ${props.beforeLabel ? `<span style="position: absolute; bottom: 0.75rem; left: 0.75rem; background: rgba(0,0,0,0.6); color: #ffffff; padding: 0.25rem 0.5rem; border-radius: var(--p-border-radius); font-size: 0.75rem; font-weight: 600;">${props.beforeLabel}</span>` : ""}
            </div>

            <!-- Divider Line & Handle -->
            <div class="compare-handle-line" style="position: absolute; top: 0; bottom: 0; left: ${splitPercent}%; width: 2px; background: #ffffff; box-shadow: 0 0 6px rgba(0,0,0,0.6); pointer-events: none;">
                <div class="compare-handle-knob" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 2.25rem; height: 2.25rem; border-radius: 50%; background: #ffffff; border: 2px solid var(--p-primary-600); box-shadow: 0 2px 8px rgba(0,0,0,0.35); display: flex; align-items: center; justify-content: center; font-size: 0.6875rem; font-weight: 700; color: var(--p-primary-600); transition: transform 0.15s ease;">
                    \u25C0\u25B6
                </div>
            </div>
        </div>
    `;
  const compareBox = container.querySelector(".laughtale-image-compare");
  const clip = container.querySelector(".compare-clip");
  const handleLine = container.querySelector(".compare-handle-line");
  const knob = container.querySelector(".compare-handle-knob");
  function updateSplit(p) {
    splitPercent = Math.max(0, Math.min(100, p));
    clip.style.width = `${splitPercent}%`;
    handleLine.style.left = `${splitPercent}%`;
    container.dispatchEvent(new CustomEvent("imagecompare:change", {
      bubbles: true,
      detail: { split: splitPercent }
    }));
  }
  let isDragging = false;
  const updateFromPointer = (clientX) => {
    const rect = compareBox.getBoundingClientRect();
    if (rect.width <= 0) return;
    const p = (clientX - rect.left) / rect.width * 100;
    updateSplit(p);
  };
  const onPointerDown = (e) => {
    isDragging = true;
    knob.style.transform = "translate(-50%, -50%) scale(1.15)";
    if ("setPointerCapture" in compareBox && e.pointerId !== void 0) {
      try {
        compareBox.setPointerCapture(e.pointerId);
      } catch (_) {
      }
    }
    updateFromPointer(e.clientX);
  };
  const onPointerMove = (e) => {
    if (!isDragging) return;
    updateFromPointer(e.clientX);
  };
  const onPointerUp = (e) => {
    if (!isDragging) return;
    isDragging = false;
    knob.style.transform = "translate(-50%, -50%) scale(1)";
    if ("releasePointerCapture" in compareBox && e.pointerId !== void 0) {
      try {
        compareBox.releasePointerCapture(e.pointerId);
      } catch (_) {
      }
    }
  };
  compareBox.addEventListener("pointerdown", onPointerDown);
  compareBox.addEventListener("pointermove", onPointerMove);
  compareBox.addEventListener("pointerup", onPointerUp);
  compareBox.addEventListener("pointercancel", onPointerUp);
  compareBox.addEventListener("mousedown", onPointerDown);
  window.addEventListener("mousemove", onPointerMove);
  window.addEventListener("mouseup", onPointerUp);
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
    ImageCompareIsland(container, {
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
  it("AutoComplete: filters list on typing", () => {
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
