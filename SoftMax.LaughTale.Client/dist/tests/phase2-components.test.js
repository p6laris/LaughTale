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

// tests/phase2-components.test.ts
import { describe, it, beforeEach } from "node:test";
import assert from "node:assert";

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
  document.head.appendChild(styleEl);
}

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
  edit: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>`,
  gitBranch: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="6" x2="6" y1="3" y2="15"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M18 9a9 9 0 0 1-9 9"/></svg>`,
  alertCircle: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>`
};

// src/components/select.ts
var CSS = `
.laughtale-select {
    position: relative;
    display: inline-flex;
    width: 100%;
    font-family: inherit;
    user-select: none;
}
.laughtale-select-trigger {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 0.5rem 0.75rem;
    background: var(--p-surface-0);
    border: 1px solid var(--p-field-border, var(--p-surface-300));
    border-radius: var(--p-border-radius, 0.5rem);
    color: var(--p-text-color);
    font-size: 0.875rem;
    cursor: pointer;
    transition: all 0.15s ease;
    outline: none;
    gap: 0.5rem;
}
.laughtale-select-trigger:hover:not(:disabled) {
    border-color: var(--p-primary-400);
}
.laughtale-select-trigger:focus-visible:not(:disabled) {
    box-shadow: 0 0 0 2px var(--p-content-bg), 0 0 0 4px var(--p-primary-500);
    border-color: var(--p-primary-500);
}
.laughtale-select-trigger:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background: var(--p-surface-100);
}
.laughtale-select-dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    margin-top: 0.25rem;
    background: var(--p-surface-0);
    border: 1px solid var(--p-surface-200);
    border-radius: var(--p-border-radius, 0.5rem);
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    z-index: 1000;
    display: flex;
    flex-direction: column;
    max-height: 20rem;
    opacity: 0;
    transform: translateY(-5px);
    pointer-events: none;
    transition: opacity 0.15s ease, transform 0.15s ease;
}
.laughtale-select.is-open .laughtale-select-dropdown {
    opacity: 1;
    transform: translateY(0);
    pointer-events: auto;
}
.laughtale-select-list {
    list-style: none;
    padding: 0.25rem;
    margin: 0;
    overflow-y: auto;
    flex: 1;
}
.laughtale-select-item {
    padding: 0.5rem 0.75rem;
    border-radius: calc(var(--p-border-radius, 0.5rem) - 0.25rem);
    cursor: pointer;
    font-size: 0.875rem;
    color: var(--p-text-color);
    transition: background 0.15s ease;
    display: flex;
    align-items: center;
    justify-content: space-between;
}
.laughtale-select-item:hover {
    background: var(--p-surface-100);
}
.laughtale-select-item.is-selected {
    background: var(--p-primary-50);
    color: var(--p-primary-700);
    font-weight: 500;
}
.laughtale-select-item.is-disabled {
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
}
.laughtale-select-filter {
    padding: 0.5rem;
    border-bottom: 1px solid var(--p-surface-200);
}
.laughtale-select-filter input {
    width: 100%;
    padding: 0.375rem 0.5rem;
    border: 1px solid var(--p-surface-300);
    border-radius: calc(var(--p-border-radius, 0.5rem) - 0.25rem);
    font-size: 0.875rem;
    outline: none;
    background: transparent;
    color: var(--p-text-color);
}
.laughtale-select-filter input:focus {
    border-color: var(--p-primary-400);
}
.laughtale-select-clear {
    color: var(--p-surface-400);
    background: transparent;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    padding: 0.125rem;
    border-radius: 50%;
}
.laughtale-select-clear:hover {
    color: var(--p-surface-600);
    background: var(--p-surface-100);
}
[data-theme="dark"] .laughtale-select-item.is-selected {
    background: var(--p-primary-900);
    color: var(--p-primary-100);
}
[data-theme="dark"] .laughtale-select-dropdown {
    background: var(--p-surface-900);
    border-color: var(--p-surface-700);
}
[data-theme="dark"] .laughtale-select-trigger {
    background: var(--p-surface-900);
}
[data-theme="dark"] .laughtale-select-item:hover {
    background: var(--p-surface-800);
}
`;
function SelectIsland(container, props) {
  injectIslandStyle("laughtale-select", CSS);
  let isOpen = false;
  let selectedValue = props.selectedValue || "";
  let searchTerm = "";
  function render() {
    const selectedOption = props.options.find((o) => o.value === selectedValue);
    const displayLabel = selectedOption ? selectedOption.label : props.placeholder || "Select...";
    let filteredOptions = props.options;
    if (props.filter && searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      filteredOptions = props.options.filter((o) => o.label.toLowerCase().includes(lowerTerm));
    }
    const optionsHtml = filteredOptions.map((opt) => `
            <li class="laughtale-select-item ${opt.value === selectedValue ? "is-selected" : ""} ${opt.disabled ? "is-disabled" : ""}" data-value="${opt.value}">
                <span>${opt.label}</span>
                ${opt.value === selectedValue ? LucideIcons.check : ""}
            </li>
        `).join("");
    container.innerHTML = `
            <div class="laughtale-select ${isOpen ? "is-open" : ""}" aria-expanded="${isOpen}">
                <button type="button" class="laughtale-select-trigger" ${props.disabled ? "disabled" : ""}>
                    <span style="flex:1; text-align:left; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">
                        ${displayLabel}
                    </span>
                    <div style="display:flex; align-items:center; gap:0.25rem;">
                        ${props.showClear && selectedValue ? '<span class="laughtale-select-clear">' + LucideIcons.x + "</span>" : ""}
                        <span style="color: var(--p-surface-500); display:flex;">${LucideIcons.chevronDown}</span>
                    </div>
                </button>
                <div class="laughtale-select-dropdown">
                    ${props.filter ? `
                    <div class="laughtale-select-filter">
                        <input type="text" placeholder="Search..." value="${searchTerm}" />
                    </div>
                    ` : ""}
                    <ul class="laughtale-select-list">
                        ${optionsHtml.length ? optionsHtml : '<li class="laughtale-select-item is-disabled">No results found</li>'}
                    </ul>
                </div>
            </div>
        `;
    bindEvents();
    syncValue();
  }
  function bindEvents() {
    const selectEl = container.querySelector(".laughtale-select");
    const trigger = container.querySelector(".laughtale-select-trigger");
    const clearBtn = container.querySelector(".laughtale-select-clear");
    const listItems = container.querySelectorAll(".laughtale-select-item:not(.is-disabled)");
    const filterInput = container.querySelector(".laughtale-select-filter input");
    trigger.addEventListener("click", (e) => {
      if (e.target === clearBtn || clearBtn?.contains(e.target)) return;
      isOpen = !isOpen;
      render();
      if (isOpen && filterInput) filterInput.focus();
    });
    if (clearBtn) {
      clearBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        selectedValue = "";
        render();
      });
    }
    listItems.forEach((item) => {
      item.addEventListener("click", () => {
        selectedValue = item.dataset.value;
        isOpen = false;
        searchTerm = "";
        render();
      });
    });
    if (filterInput) {
      filterInput.addEventListener("input", (e) => {
        searchTerm = e.target.value;
        render();
        const newInput = container.querySelector(".laughtale-select-filter input");
        if (newInput) {
          newInput.focus();
          newInput.setSelectionRange(searchTerm.length, searchTerm.length);
        }
      });
    }
    const outsideClickListener = (e) => {
      if (isOpen && !container.contains(e.target)) {
        isOpen = false;
        render();
      }
    };
    document.addEventListener("click", outsideClickListener);
  }
  function syncValue() {
    if (props.targetInputName) {
      let hidden = container.querySelector('input[name="' + props.targetInputName + '"]');
      if (!hidden) {
        hidden = document.createElement("input");
        hidden.type = "hidden";
        hidden.name = props.targetInputName;
        container.appendChild(hidden);
      }
      hidden.value = selectedValue;
    }
    container.dispatchEvent(new CustomEvent("select:change", {
      bubbles: true,
      detail: { value: selectedValue }
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
}
.laughtale-checkbox-wrap.is-disabled {
    opacity: 0.6;
    cursor: not-allowed;
}
.laughtale-checkbox-box {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1.25rem;
    height: 1.25rem;
    border: 1px solid var(--p-field-border, var(--p-surface-300));
    border-radius: calc(var(--p-border-radius, 0.5rem) - 0.25rem);
    background: var(--p-surface-0);
    transition: all 0.15s ease;
    color: white;
}
.laughtale-checkbox-wrap:hover:not(.is-disabled) .laughtale-checkbox-box {
    border-color: var(--p-primary-400);
}
.laughtale-checkbox-wrap:focus-within:not(.is-disabled) .laughtale-checkbox-box {
    box-shadow: 0 0 0 2px var(--p-content-bg), 0 0 0 4px var(--p-primary-500);
    border-color: var(--p-primary-500);
}
.laughtale-checkbox-wrap.is-checked .laughtale-checkbox-box,
.laughtale-checkbox-wrap.is-indeterminate .laughtale-checkbox-box {
    background: var(--p-primary-500);
    border-color: var(--p-primary-500);
}
.laughtale-checkbox-icon {
    transform: scale(0);
    transition: transform 0.15s cubic-bezier(0.16, 1, 0.3, 1);
}
.laughtale-checkbox-wrap.is-checked .laughtale-checkbox-icon,
.laughtale-checkbox-wrap.is-indeterminate .laughtale-checkbox-icon {
    transform: scale(1);
}
.laughtale-checkbox-label {
    font-size: 0.875rem;
    color: var(--p-text-color);
}
.laughtale-checkbox-hidden {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
    margin: 0;
}
`;
function CheckboxIsland(container, props) {
  injectIslandStyle("laughtale-checkbox", CSS2);
  let isChecked = Boolean(props.checked);
  let isIndeterminate = Boolean(props.indeterminate);
  function render() {
    const icon = isIndeterminate ? LucideIcons.minus : LucideIcons.check;
    const stateClass = isIndeterminate ? "is-indeterminate" : isChecked ? "is-checked" : "";
    container.innerHTML = `
            <label class="laughtale-checkbox-wrap ${stateClass} ${props.disabled ? "is-disabled" : ""}">
                <input type="checkbox" class="laughtale-checkbox-hidden" 
                    ${isChecked ? "checked" : ""} 
                    ${props.disabled ? "disabled" : ""} />
                <div class="laughtale-checkbox-box">
                    <span class="laughtale-checkbox-icon" style="display:flex; width:14px; height:14px;">
                        ${icon}
                    </span>
                </div>
                ${props.label ? '<span class="laughtale-checkbox-label">' + props.label + "</span>" : ""}
            </label>
        `;
    bindEvents();
    syncValue();
  }
  function bindEvents() {
    const input = container.querySelector(".laughtale-checkbox-hidden");
    if (!props.disabled) {
      input.addEventListener("change", (e) => {
        isChecked = input.checked;
        isIndeterminate = false;
        render();
      });
    }
  }
  function syncValue() {
    if (props.targetInputName) {
      let hidden = container.querySelector('input[name="' + props.targetInputName + '"]');
      if (!hidden) {
        hidden = document.createElement("input");
        hidden.type = "hidden";
        hidden.name = props.targetInputName;
        container.appendChild(hidden);
      }
      hidden.value = isChecked ? props.value || "true" : "false";
    }
  }
  render();
}

// src/components/radio-button.ts
var CSS3 = `
.laughtale-radio-wrap {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    user-select: none;
}
.laughtale-radio-wrap.is-disabled {
    opacity: 0.6;
    cursor: not-allowed;
}
.laughtale-radio-circle {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1.25rem;
    height: 1.25rem;
    border: 1px solid var(--p-field-border, var(--p-surface-300));
    border-radius: 50%;
    background: var(--p-surface-0);
    transition: all 0.15s ease;
}
.laughtale-radio-wrap:hover:not(.is-disabled) .laughtale-radio-circle {
    border-color: var(--p-primary-400);
}
.laughtale-radio-wrap:focus-within:not(.is-disabled) .laughtale-radio-circle {
    box-shadow: 0 0 0 2px var(--p-content-bg), 0 0 0 4px var(--p-primary-500);
    border-color: var(--p-primary-500);
}
.laughtale-radio-wrap.is-checked .laughtale-radio-circle {
    border-color: var(--p-primary-500);
}
.laughtale-radio-dot {
    width: 0.625rem;
    height: 0.625rem;
    border-radius: 50%;
    background: var(--p-primary-500);
    transform: scale(0);
    transition: transform 0.15s cubic-bezier(0.16, 1, 0.3, 1);
}
.laughtale-radio-wrap.is-checked .laughtale-radio-dot {
    transform: scale(1);
}
.laughtale-radio-label {
    font-size: 0.875rem;
    color: var(--p-text-color);
}
.laughtale-radio-hidden {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
    margin: 0;
}
`;
function RadioButtonIsland(container, props) {
  injectIslandStyle("laughtale-radio", CSS3);
  let isChecked = Boolean(props.checked);
  function render() {
    container.innerHTML = `
            <label class="laughtale-radio-wrap ${isChecked ? "is-checked" : ""} ${props.disabled ? "is-disabled" : ""}">
                <input type="radio" class="laughtale-radio-hidden" 
                    name="${props.name}"
                    value="${props.value}"
                    ${isChecked ? "checked" : ""} 
                    ${props.disabled ? "disabled" : ""} />
                <div class="laughtale-radio-circle">
                    <div class="laughtale-radio-dot"></div>
                </div>
                ${props.label ? '<span class="laughtale-radio-label">' + props.label + "</span>" : ""}
            </label>
        `;
    bindEvents();
    syncValue();
  }
  function bindEvents() {
    const input = container.querySelector(".laughtale-radio-hidden");
    if (!props.disabled) {
      input.addEventListener("change", (e) => {
        isChecked = input.checked;
        render();
        document.querySelectorAll('input[type="radio"][name="' + props.name + '"]').forEach((el) => {
          if (el !== input) {
            el.dispatchEvent(new Event("change", { bubbles: true }));
          }
        });
      });
      container.addEventListener("change", (e) => {
        if (e.target !== input) {
          isChecked = input.checked;
          render();
        }
      });
    }
  }
  function syncValue() {
    if (props.targetInputName && isChecked) {
      let hidden = document.querySelector('input[name="' + props.targetInputName + '"]');
      if (!hidden) {
        hidden = document.createElement("input");
        hidden.type = "hidden";
        hidden.name = props.targetInputName;
        document.body.appendChild(hidden);
      }
      hidden.value = props.value;
    }
  }
  render();
}

// src/components/textarea.ts
var CSS4 = `
.laughtale-textarea-wrap {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    width: 100%;
}
.laughtale-textarea {
    width: 100%;
    padding: 0.5rem 0.75rem;
    background: var(--p-surface-0);
    border: 1px solid var(--p-field-border, var(--p-surface-300));
    border-radius: var(--p-border-radius, 0.5rem);
    color: var(--p-text-color);
    font-size: 0.875rem;
    font-family: inherit;
    resize: vertical;
    transition: all 0.15s ease;
    outline: none;
    line-height: 1.5;
}
.laughtale-textarea:hover:not(:disabled) {
    border-color: var(--p-primary-400);
}
.laughtale-textarea:focus-visible:not(:disabled) {
    box-shadow: 0 0 0 2px var(--p-content-bg), 0 0 0 4px var(--p-primary-500);
    border-color: var(--p-primary-500);
}
.laughtale-textarea:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background: var(--p-surface-100);
}
.laughtale-textarea-counter {
    font-size: 0.75rem;
    color: var(--p-surface-500);
    text-align: right;
}
`;
function TextareaIsland(container, props) {
  injectIslandStyle("laughtale-textarea", CSS4);
  let currentValue = props.value || "";
  function render() {
    container.innerHTML = `
            <div class="laughtale-textarea-wrap">
                <textarea 
                    class="laughtale-textarea"
                    rows="${props.rows || 3}"
                    ${props.maxLength ? 'maxlength="' + props.maxLength + '"' : ""}
                    placeholder="${props.placeholder || ""}"
                    ${props.disabled ? "disabled" : ""}
                    ${props.autoResize ? 'style="overflow:hidden; resize:none;"' : ""}
                >${currentValue}</textarea>
                ${props.maxLength ? `
                    <div class="laughtale-textarea-counter">
                        <span class="laughtale-char-count">${currentValue.length}</span> / ${props.maxLength}
                    </div>
                ` : ""}
            </div>
        `;
    bindEvents();
    syncValue();
    if (props.autoResize) autoResize();
  }
  function bindEvents() {
    const textarea = container.querySelector(".laughtale-textarea");
    const counter = container.querySelector(".laughtale-char-count");
    textarea.addEventListener("input", () => {
      currentValue = textarea.value;
      if (counter) counter.textContent = currentValue.length.toString();
      if (props.autoResize) autoResize();
      syncValue();
    });
  }
  function autoResize() {
    const textarea = container.querySelector(".laughtale-textarea");
    if (textarea && props.autoResize) {
      textarea.style.height = "auto";
      textarea.style.height = textarea.scrollHeight + "px";
    }
  }
  function syncValue() {
    if (props.targetInputName) {
      let hidden = container.querySelector('input[name="' + props.targetInputName + '"]');
      if (!hidden) {
        hidden = document.createElement("input");
        hidden.type = "hidden";
        hidden.name = props.targetInputName;
        container.appendChild(hidden);
      }
      hidden.value = currentValue;
    }
  }
  render();
}

// src/components/menu.ts
function MenuIsland(container, props) {
  const items = props.items || [];
  const popup = props.popup || false;
  let isOpen = !popup;
  injectIslandStyle("menu", `
        .laughtale-menu {
            background: var(--p-surface-0);
            border: 1px solid var(--p-border-color);
            border-radius: var(--p-border-radius);
            min-width: 12.5rem;
            padding: 0.5rem 0;
            box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06);
            font-family: var(--p-font-family, inherit);
        }
        [data-theme="dark"] .laughtale-menu {
            box-shadow: 0 4px 6px -1px rgba(0,0,0,0.5);
        }
        .menu-list {
            list-style: none;
            margin: 0;
            padding: 0;
        }
        .menu-item {
            display: flex;
            align-items: center;
            padding: 0.5rem 1rem;
            color: var(--p-text-color);
            text-decoration: none;
            cursor: pointer;
            transition: background 150ms ease, color 150ms ease;
            gap: 0.5rem;
            font-size: 0.875rem;
        }
        .menu-item:hover {
            background: var(--p-surface-100);
        }
        .menu-item.disabled {
            opacity: 0.5;
            cursor: not-allowed;
            pointer-events: none;
        }
        .menu-separator {
            height: 1px;
            background: var(--p-border-color);
            margin: 0.5rem 0;
        }
        
        .p-anchored-overlay-enter {
            opacity: 0;
            transform: scaleY(0.8);
        }
        .p-anchored-overlay-enter-active {
            opacity: 1;
            transform: scaleY(1);
            transition: opacity 150ms ease, transform 150ms ease;
            transform-origin: top;
        }
        .p-anchored-overlay-leave-active {
            opacity: 0;
            transition: opacity 150ms ease;
        }
    `);
  function renderMenu(menuItems) {
    return `
            <ul class="menu-list">
                ${menuItems.map((item) => {
      if (item.separator) return `<li class="menu-separator"></li>`;
      const iconSvg = item.icon && LucideIcons[item.icon] ? LucideIcons[item.icon] : "";
      return `
                        <li>
                            <a class="menu-item ${item.disabled ? "disabled" : ""}" href="${item.url || "#"}" tabindex="0">
                                ${iconSvg ? `<span style="width: 16px; height: 16px; display: flex;">${iconSvg}</span>` : ""}
                                <span>${item.label}</span>
                            </a>
                        </li>
                    `;
    }).join("")}
            </ul>
        `;
  }
  function render() {
    if (!isOpen && popup) {
      container.innerHTML = `

`;
      return;
    }
    const menuHtml = `
            <div class="laughtale-menu ${popup ? "p-anchored-overlay-enter-active" : ""}" style="${popup ? "position: absolute; z-index: 1000;" : ""}">
                ${renderMenu(items)}
            </div>
        `;
    container.innerHTML = menuHtml;
    if (popup) {
      const menuEl = container.querySelector(".laughtale-menu");
      const trigger = document.getElementById(props.triggerId || "");
      if (trigger && menuEl) {
        const rect = trigger.getBoundingClientRect();
        menuEl.style.top = `${rect.bottom + window.scrollY + 4}px`;
        menuEl.style.left = `${rect.left + window.scrollX}px`;
        const closeHandler = (e) => {
          if (!container.contains(e.target) && !trigger.contains(e.target)) {
            isOpen = false;
            render();
            document.removeEventListener("click", closeHandler);
          }
        };
        setTimeout(() => document.addEventListener("click", closeHandler), 0);
      }
    }
  }
  if (popup && props.triggerId) {
    const trigger = document.getElementById(props.triggerId);
    trigger?.addEventListener("click", (e) => {
      e.preventDefault();
      isOpen = !isOpen;
      render();
    });
  }
  render();
}

// src/components/carousel.ts
function CarouselIsland(container, props) {
  const items = props.items || [];
  const numVisible = props.numVisible || 1;
  const numScroll = props.numScroll || 1;
  const autoplay = props.autoplay || false;
  const autoplayInterval = props.autoplayInterval || 5e3;
  const circular = props.circular || false;
  const showIndicators = props.showIndicators !== false;
  const showNavigators = props.showNavigators !== false;
  let currentIndex = 0;
  let autoplayTimer = null;
  let isDragging = false;
  let startX = 0;
  let currentTranslate = 0;
  let prevTranslate = 0;
  injectIslandStyle("carousel", `
        .laughtale-carousel {
            display: flex;
            flex-direction: column;
            gap: 1rem;
            width: 100%;
        }
        .carousel-content {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            position: relative;
        }
        .carousel-viewport {
            overflow: hidden;
            width: 100%;
            border-radius: var(--p-border-radius);
            touch-action: pan-y;
        }
        .carousel-track {
            display: flex;
            transition: transform 0.3s ease;
            cursor: grab;
        }
        .carousel-track:active {
            cursor: grabbing;
        }
        .carousel-item {
            flex: 0 0 auto;
            padding: 0.5rem;
            box-sizing: border-box;
        }
        .carousel-item-content {
            background: var(--p-surface-0);
            border: 1px solid var(--p-border-color);
            border-radius: var(--p-border-radius);
            overflow: hidden;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            transition: box-shadow 150ms ease, transform 150ms ease;
            height: 100%;
        }
        [data-theme="dark"] .carousel-item-content {
            box-shadow: 0 1px 3px rgba(0,0,0,0.5);
        }
        .carousel-item-content:hover {
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        .carousel-img {
            width: 100%;
            height: 200px;
            object-fit: cover;
            display: block;
        }
        .carousel-body {
            padding: 1rem;
        }
        .carousel-title {
            font-size: 1.125rem;
            font-weight: 600;
            color: var(--p-text-color);
            margin-bottom: 0.5rem;
        }
        .carousel-desc {
            font-size: 0.875rem;
            color: var(--p-text-muted-color);
        }
        .carousel-btn {
            background: var(--p-surface-0);
            border: 1px solid var(--p-border-color);
            color: var(--p-text-color);
            width: 2.5rem;
            height: 2.5rem;
            border-radius: 9999px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: background 150ms ease, color 150ms ease, box-shadow 150ms ease;
            flex-shrink: 0;
            z-index: 2;
        }
        .carousel-btn:hover:not(:disabled) {
            background: var(--p-surface-100);
        }
        .carousel-btn:focus-visible {
            outline: none;
            box-shadow: 0 0 0 2px var(--p-primary-color);
        }
        .carousel-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }
        .carousel-indicators {
            display: flex;
            justify-content: center;
            gap: 0.5rem;
        }
        .carousel-indicator {
            width: 0.75rem;
            height: 0.75rem;
            border-radius: 50%;
            background: var(--p-surface-300);
            border: none;
            cursor: pointer;
            transition: background 150ms ease, transform 150ms ease;
        }
        .carousel-indicator.active {
            background: var(--p-primary-color);
            transform: scale(1.2);
        }
    `);
  function getPositionByIndex(index) {
    return -(index * (100 / numVisible));
  }
  function setPositionByIndex() {
    const track = container.querySelector(".carousel-track");
    if (!track) return;
    currentTranslate = getPositionByIndex(currentIndex);
    prevTranslate = currentTranslate;
    track.style.transform = "translateX(" + currentTranslate + "%)";
    updateIndicators();
    updateButtons();
  }
  function render() {
    const itemWidth = 100 / numVisible;
    const totalPages = Math.ceil((items.length - numVisible) / numScroll) + 1;
    container.innerHTML = `
            <div class="laughtale-carousel">
                <div class="carousel-content">
                    ${showNavigators ? `
                        <button type="button" class="carousel-btn prev-btn" aria-label="Previous">
                            ${LucideIcons.chevronLeft}
                        </button>
                    ` : ""}
                    
                    <div class="carousel-viewport">
                        <div class="carousel-track">
                            ${items.map((item) => `
                                <div class="carousel-item" style="width: ${itemWidth}%">
                                    <div class="carousel-item-content">
                                        ${item.image ? `<img src="${item.image}" alt="${item.title || ""}" class="carousel-img" />` : ""}
                                        <div class="carousel-body">
                                            ${item.title ? `<div class="carousel-title">${item.title}</div>` : ""}
                                            ${item.description ? `<div class="carousel-desc">${item.description}</div>` : ""}
                                        </div>
                                    </div>
                                </div>
                            `).join("")}
                        </div>
                    </div>

                    ${showNavigators ? `
                        <button type="button" class="carousel-btn next-btn" aria-label="Next">
                            ${LucideIcons.chevronRight}
                        </button>
                    ` : ""}
                </div>

                ${showIndicators && totalPages > 1 ? `
                    <div class="carousel-indicators">
                        ${Array.from({ length: totalPages }).map((_, i) => `
                            <button type="button" class="carousel-indicator ${i === 0 ? "active" : ""}" data-index="${i}" aria-label="Page ${i + 1}"></button>
                        `).join("")}
                    </div>
                ` : ""}
            </div>
        `;
    bindEvents();
    setPositionByIndex();
    if (autoplay) startAutoplay();
  }
  function updateIndicators() {
    if (!showIndicators) return;
    const page = Math.floor(currentIndex / numScroll);
    container.querySelectorAll(".carousel-indicator").forEach((ind, i) => {
      ind.classList.toggle("active", i === page);
    });
  }
  function updateButtons() {
    if (!showNavigators || circular) return;
    const prevBtn = container.querySelector(".prev-btn");
    const nextBtn = container.querySelector(".next-btn");
    if (prevBtn) prevBtn.disabled = currentIndex === 0;
    if (nextBtn) nextBtn.disabled = currentIndex >= items.length - numVisible;
  }
  function navPrev() {
    if (currentIndex === 0) {
      if (circular) currentIndex = Math.max(0, items.length - numVisible);
    } else {
      currentIndex = Math.max(0, currentIndex - numScroll);
    }
    setPositionByIndex();
  }
  function navNext() {
    if (currentIndex >= items.length - numVisible) {
      if (circular) currentIndex = 0;
    } else {
      currentIndex = Math.min(items.length - numVisible, currentIndex + numScroll);
    }
    setPositionByIndex();
  }
  function startAutoplay() {
    if (autoplayTimer) clearInterval(autoplayTimer);
    autoplayTimer = window.setInterval(navNext, autoplayInterval);
  }
  function stopAutoplay() {
    if (autoplayTimer) {
      clearInterval(autoplayTimer);
      autoplayTimer = null;
    }
  }
  function bindEvents() {
    const prevBtn = container.querySelector(".prev-btn");
    const nextBtn = container.querySelector(".next-btn");
    const track = container.querySelector(".carousel-track");
    const indicators = container.querySelectorAll(".carousel-indicator");
    prevBtn?.addEventListener("click", navPrev);
    nextBtn?.addEventListener("click", navNext);
    indicators.forEach((ind) => {
      ind.addEventListener("click", (e) => {
        const idx = Number(e.target.dataset.index);
        currentIndex = Math.min(idx * numScroll, items.length - numVisible);
        setPositionByIndex();
      });
    });
    if (autoplay) {
      container.addEventListener("mouseenter", stopAutoplay);
      container.addEventListener("mouseleave", startAutoplay);
    }
    if (track) {
      track.addEventListener("pointerdown", (e) => {
        isDragging = true;
        startX = e.clientX;
        track.style.transition = "none";
        if (autoplay) stopAutoplay();
      });
      window.addEventListener("pointermove", (e) => {
        if (!isDragging) return;
        const currentX = e.clientX;
        const diff = (currentX - startX) / container.offsetWidth * 100;
        track.style.transform = `translateX(${prevTranslate + diff}%)`;
      });
      window.addEventListener("pointerup", (e) => {
        if (!isDragging) return;
        isDragging = false;
        track.style.transition = "transform 0.3s ease";
        const diff = (e.clientX - startX) / container.offsetWidth * 100;
        if (Math.abs(diff) > 10) {
          if (diff > 0) navPrev();
          else navNext();
        } else {
          setPositionByIndex();
        }
        if (autoplay) startAutoplay();
      });
    }
  }
  render();
}

// src/components/paginator.ts
function PaginatorIsland(container, props) {
  let first = props.first || 0;
  let rows = props.rows || 10;
  const totalRecords = props.totalRecords || 0;
  const options = props.rowsPerPageOptions || [10, 20, 50];
  const compact = props.compact || false;
  injectIslandStyle("paginator", `
        .laughtale-paginator {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0.75rem 1rem;
            background: var(--p-surface-0);
            border: 1px solid var(--p-border-color);
            border-radius: var(--p-border-radius);
            font-family: var(--p-font-family, inherit);
            color: var(--p-text-color);
            gap: 1rem;
            flex-wrap: wrap;
        }
        .paginator-left, .paginator-right {
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        .paginator-pages {
            display: flex;
            align-items: center;
            gap: 0.25rem;
        }
        .paginator-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 2rem;
            height: 2rem;
            border-radius: var(--p-border-radius);
            border: 1px solid transparent;
            background: transparent;
            color: var(--p-text-color);
            cursor: pointer;
            transition: all 150ms ease;
            font-size: 0.875rem;
        }
        .paginator-btn:hover:not(:disabled) {
            background: var(--p-surface-100);
        }
        .paginator-btn:focus-visible {
            outline: none;
            box-shadow: 0 0 0 2px var(--p-primary-color);
        }
        .paginator-btn.active {
            background: var(--p-primary-color);
            color: var(--p-primary-contrast);
            font-weight: 600;
        }
        .paginator-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }
        .paginator-select {
            padding: 0.25rem 2rem 0.25rem 0.75rem;
            border-radius: var(--p-border-radius);
            border: 1px solid var(--p-border-color);
            background: var(--p-surface-0);
            color: var(--p-text-color);
            appearance: none;
            cursor: pointer;
            outline: none;
            transition: box-shadow 150ms ease;
        }
        .paginator-select:focus-visible {
            box-shadow: 0 0 0 2px var(--p-primary-color);
        }
        .paginator-info {
            font-size: 0.875rem;
            color: var(--p-text-muted-color);
        }
    `);
  function changePage(newFirst) {
    first = Math.max(0, Math.min(newFirst, totalRecords - 1));
    const page = Math.floor(first / rows);
    container.dispatchEvent(new CustomEvent("page-change", {
      detail: { first, rows, page },
      bubbles: true
    }));
    render();
  }
  function render() {
    const pageCount = Math.ceil(totalRecords / rows) || 1;
    const currentPage = Math.floor(first / rows);
    let startPage = Math.max(0, currentPage - 2);
    let endPage = Math.min(pageCount - 1, startPage + 4);
    if (endPage - startPage < 4) {
      startPage = Math.max(0, endPage - 4);
    }
    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    const isFirst = currentPage === 0;
    const isLast = currentPage >= pageCount - 1;
    const infoText = "Showing " + totalRecords ? first + 1 : "0-${Math.min(first + rows, totalRecords)} of ${totalRecords}";
    container.innerHTML = `
<div class="laughtale-paginator ' + compact ? 'compact' : '' + '">
                <div class="paginator-left">
                    <button class="paginator-btn btn-first" \${isFirst ? 'disabled' : ''} aria-label="First Page">
                        <span style="display:flex;">\${LucideIcons.chevronLeft}</span>
                    </button>
                    <button class="paginator-btn btn-prev" \${isFirst ? 'disabled' : ''} aria-label="Previous Page">
                        <span style="display:flex;">\${LucideIcons.chevronLeft}</span>
                    </button>
                    
                    <div class="paginator-pages">
                        \${pages.map(p => '
                            <button class="paginator-btn btn-page \${p === currentPage ? 'active' : ''}" data-page="\${p}">
                                \${p + 1}
                            </button>
                        ').join('')}
                    </div>

                    <button class="paginator-btn btn-next" ' + isLast ? 'disabled' : '' + ' aria-label="Next Page">
                        <span style="display:flex;">\${LucideIcons.chevronRight}</span>
                    </button>
                    <button class="paginator-btn btn-last" \${isLast ? 'disabled' : ''} aria-label="Last Page">
                        <span style="display:flex;">\${LucideIcons.chevronRight}</span>
                    </button>
                </div>

                <div class="paginator-right">
                    \${options.length > 0 ? '
                        <div style="position: relative;">
                            <select class="paginator-select">
                                \${options.map(opt => '<option value="' + opt + '" \${opt === rows ? 'selected' : ''}>\${opt}</option>').join('')}
                            </select>
                            <span style="position: absolute; right: 0.5rem; top: 50%; transform: translateY(-50%); pointer-events: none; width: 16px; height: 16px; color: var(--p-text-muted-color);">
                                \${LucideIcons.chevronDown}
                            </span>
                        </div>
                    ' : ''}
                    <span class="paginator-info">' + infoText + '</span>
                </div>
            </div>
`;
    bindEvents();
  }
  function bindEvents() {
    container.querySelector(".btn-first")?.addEventListener("click", () => changePage(0));
    container.querySelector(".btn-prev")?.addEventListener("click", () => changePage(first - rows));
    container.querySelector(".btn-next")?.addEventListener("click", () => changePage(first + rows));
    container.querySelector(".btn-last")?.addEventListener("click", () => changePage(Math.floor((totalRecords - 1) / rows) * rows));
    container.querySelectorAll(".btn-page").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const page = Number(e.currentTarget.dataset.page);
        changePage(page * rows);
      });
    });
    const select = container.querySelector(".paginator-select");
    if (select) {
      select.addEventListener("change", (e) => {
        rows = Number(e.target.value);
        changePage(0);
      });
    }
  }
  render();
}

// src/components/sidebar.ts
function SidebarIsland(container, props) {
  let collapsed = props.collapsed || false;
  const items = props.items || [];
  const position = props.position || "left";
  injectIslandStyle("sidebar", `
        .laughtale-sidebar {
            display: flex;
            flex-direction: column;
            background: var(--p-surface-0);
            border-right: 1px solid var(--p-border-color);
            height: 100vh;
            width: 260px;
            transition: width 150ms ease;
            font-family: var(--p-font-family, inherit);
            overflow-y: auto;
        }
        .laughtale-sidebar.collapsed {
            width: 64px;
        }
        .laughtale-sidebar.right {
            border-right: none;
            border-left: 1px solid var(--p-border-color);
        }
        .sidebar-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 1rem;
            border-bottom: 1px solid var(--p-border-color);
        }
        .sidebar-toggle {
            background: transparent;
            border: none;
            color: var(--p-text-muted-color);
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: var(--p-border-radius);
            width: 2rem;
            height: 2rem;
            transition: background 150ms ease;
        }
        .sidebar-toggle:hover {
            background: var(--p-surface-100);
            color: var(--p-text-color);
        }
        .sidebar-menu {
            list-style: none;
            padding: 0.5rem;
            margin: 0;
            display: flex;
            flex-direction: column;
            gap: 0.25rem;
        }
        .sidebar-item {
            display: flex;
            align-items: center;
            padding: 0.75rem;
            color: var(--p-text-color);
            text-decoration: none;
            border-radius: var(--p-border-radius);
            transition: background 150ms ease, color 150ms ease;
            gap: 0.75rem;
            white-space: nowrap;
            overflow: hidden;
        }
        .sidebar-item:hover {
            background: var(--p-surface-100);
        }
        .sidebar-item.active {
            background: var(--p-primary-50);
            color: var(--p-primary-color);
            font-weight: 600;
        }
        [data-theme="dark"] .sidebar-item.active {
            background: var(--p-primary-900);
        }
        .sidebar-item-icon {
            display: flex;
            width: 20px;
            height: 20px;
            flex-shrink: 0;
            color: var(--p-text-muted-color);
        }
        .sidebar-item.active .sidebar-item-icon {
            color: var(--p-primary-color);
        }
        .sidebar-item-label {
            opacity: 1;
            transition: opacity 150ms ease;
        }
        .collapsed .sidebar-item-label, .collapsed .sidebar-header-title {
            opacity: 0;
            width: 0;
            display: none;
        }
    `);
  function renderMenu(menuItems) {
    return menuItems.map((item) => {
      const iconSvg = item.icon && LucideIcons[item.icon] ? LucideIcons[item.icon] : "";
      return `
                <li>
                    <a href="${item.url || "#"}" class="sidebar-item ${item.active ? "active" : ""}">
                        ${iconSvg ? `<span class="sidebar-item-icon">${iconSvg}</span>` : ""}
                        <span class="sidebar-item-label">${item.label}</span>
                    </a>
                </li>
            `;
    }).join("");
  }
  function render() {
    container.innerHTML = `
<div class="laughtale-sidebar ' + collapsed ? 'collapsed' : '' + ' \${position}">
                <div class="sidebar-header">
                    <span class="sidebar-header-title" style="font-weight: 700; color: var(--p-text-color);">Menu</span>
                    <button class="sidebar-toggle" aria-label="Toggle Sidebar">
                        \${collapsed ? LucideIcons.chevronRight : LucideIcons.chevronLeft}
                    </button>
                </div>
                <ul class="sidebar-menu">
                    \${renderMenu(items)}
                </ul>
            </div>
`;
    container.querySelector(".sidebar-toggle")?.addEventListener("click", () => {
      collapsed = !collapsed;
      render();
    });
  }
  render();
}

// src/components/popover.ts
function PopoverIsland(container, props) {
  let isOpen = false;
  const placement = props.placement || "bottom";
  const showArrow = props.showArrow !== false;
  const contentHtml = container.innerHTML;
  injectIslandStyle("popover", `
        .laughtale-popover {
            position: absolute;
            background: var(--p-surface-0);
            border: 1px solid var(--p-border-color);
            border-radius: var(--p-border-radius);
            padding: 1rem;
            box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05);
            font-family: var(--p-font-family, inherit);
            color: var(--p-text-color);
            z-index: 1000;
            opacity: 0;
            transform: scaleY(0.9);
            transition: opacity 150ms ease, transform 150ms ease;
            transform-origin: top center;
        }
        [data-theme="dark"] .laughtale-popover {
            box-shadow: 0 10px 15px -3px rgba(0,0,0,0.5);
        }
        .laughtale-popover.open {
            opacity: 1;
            transform: scaleY(1);
        }
        .popover-arrow {
            position: absolute;
            width: 8px;
            height: 8px;
            background: var(--p-surface-0);
            border: 1px solid var(--p-border-color);
            transform: rotate(45deg);
        }
        .popover-arrow.bottom { top: -5px; left: calc(50% - 4px); border-bottom: none; border-right: none; }
        .popover-arrow.top { bottom: -5px; left: calc(50% - 4px); border-top: none; border-left: none; }
    `);
  function render() {
    if (!isOpen) {
      container.innerHTML = `

`;
      return;
    }
    container.innerHTML = `
<div class="laughtale-popover open">
                ' + showArrow ? \`<div class="popover-arrow \${placement + '"></div>' : ''}
                <div class="popover-content">
                    \${contentHtml}
                </div>
            </div>
`;
    const popover = container.querySelector(".laughtale-popover");
    const trigger = document.getElementById(props.triggerId);
    if (trigger && popover) {
      const rect = trigger.getBoundingClientRect();
      if (placement === "bottom") {
        popover.style.top = `${rect.bottom + window.scrollY + 8}px`;
        popover.style.left = `${rect.left + window.scrollX}px`;
      } else if (placement === "top") {
        popover.style.bottom = `${window.innerHeight - rect.top + 8}px`;
        popover.style.left = `${rect.left + window.scrollX}px`;
      }
      const closeHandler = (e) => {
        if (!container.contains(e.target) && !trigger.contains(e.target)) {
          isOpen = false;
          render();
          document.removeEventListener("click", closeHandler);
        }
      };
      setTimeout(() => document.addEventListener("click", closeHandler), 0);
    }
  }
  if (props.triggerId) {
    const trigger = document.getElementById(props.triggerId);
    trigger?.addEventListener("click", () => {
      isOpen = !isOpen;
      render();
    });
  }
  container.innerHTML = `

`;
}

// src/components/input-mask.ts
var CSS5 = `
.laughtale-input-mask {
    width: 100%;
    padding: 0.5rem 0.75rem;
    background: var(--p-surface-0);
    border: 1px solid var(--p-field-border, var(--p-surface-300));
    border-radius: var(--p-border-radius, 0.5rem);
    color: var(--p-text-color);
    font-size: 0.875rem;
    font-family: inherit;
    transition: all 0.15s ease;
    outline: none;
}
.laughtale-input-mask:hover:not(:disabled) {
    border-color: var(--p-primary-400);
}
.laughtale-input-mask:focus-visible:not(:disabled) {
    box-shadow: 0 0 0 2px var(--p-content-bg), 0 0 0 4px var(--p-primary-500);
    border-color: var(--p-primary-500);
}
.laughtale-input-mask:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background: var(--p-surface-100);
}
`;
function InputMaskIsland(container, props) {
  injectIslandStyle("laughtale-input-mask", CSS5);
  const mask = props.mask;
  const slotChar = props.slotChar || "_";
  let rawValue = props.value || "";
  const defs = {
    "9": /[0-9]/,
    "a": /[A-Za-z]/,
    "*": /[A-Za-z0-9]/
  };
  function format(val) {
    let result = "";
    let valIndex = 0;
    for (let i = 0; i < mask.length; i++) {
      const m = mask[i];
      if (defs[m]) {
        if (valIndex < val.length) {
          if (defs[m].test(val[valIndex])) {
            result += val[valIndex];
            valIndex++;
          } else {
            valIndex++;
            i--;
          }
        } else {
          result += slotChar;
        }
      } else {
        result += m;
        if (valIndex < val.length && val[valIndex] === m) {
          valIndex++;
        }
      }
    }
    return result;
  }
  let currentValue = format(rawValue);
  function render() {
    container.innerHTML = `
            <input 
                type="text"
                class="laughtale-input-mask"
                value="\${currentValue}"
                placeholder="${props.placeholder || format("")}"
                ${props.disabled ? "disabled" : ""}
            />
        `;
    bindEvents();
    syncValue();
  }
  function bindEvents() {
    const input = container.querySelector("input");
    input.addEventListener("input", (e) => {
      const val = input.value.replace(new RegExp("[\\\\" + slotChar + "]", "g"), "");
      const unmasked = Array.from(val).join("");
      currentValue = format(unmasked);
      input.value = currentValue;
      const firstSlot = currentValue.indexOf(slotChar);
      const cursorPos = firstSlot !== -1 ? firstSlot : currentValue.length;
      input.setSelectionRange(cursorPos, cursorPos);
      syncValue();
    });
    input.addEventListener("focus", () => {
      if (input.value === format("")) {
        const firstSlot = input.value.indexOf(slotChar);
        const cursorPos = firstSlot !== -1 ? firstSlot : 0;
        setTimeout(() => input.setSelectionRange(cursorPos, cursorPos), 0);
      }
    });
  }
  function syncValue() {
    if (props.targetInputName) {
      let hidden = container.querySelector('input[name="' + props.targetInputName + '"]');
      if (!hidden) {
        hidden = document.createElement("input");
        hidden.type = "hidden";
        hidden.name = props.targetInputName;
        container.appendChild(hidden);
      }
      hidden.value = currentValue.replace(new RegExp("[\\\\" + slotChar + "]", "g"), "");
    }
  }
  render();
}

// src/components/float-label.ts
var CSS6 = `
.laughtale-float-label {
    position: relative;
    display: block;
}
.laughtale-float-label label {
    position: absolute;
    left: 0.75rem;
    color: var(--p-surface-500);
    font-size: 0.875rem;
    pointer-events: none;
    transition: all 0.2s ease;
    z-index: 1;
}

/* Variant: over */
.laughtale-float-label-over label {
    top: 50%;
    transform: translateY(-50%);
}
.laughtale-float-label-over:focus-within label,
.laughtale-float-label-over.has-value label {
    top: -0.5rem;
    transform: translateY(-100%);
    font-size: 0.75rem;
    color: var(--p-primary-500);
}

/* Variant: on */
.laughtale-float-label-on label {
    top: 50%;
    transform: translateY(-50%);
    background: var(--p-surface-0);
    padding: 0 0.25rem;
    margin-left: -0.25rem;
}
.laughtale-float-label-on:focus-within label,
.laughtale-float-label-on.has-value label {
    top: 0;
    transform: translateY(-50%);
    font-size: 0.75rem;
    color: var(--p-primary-500);
}

/* Variant: in */
.laughtale-float-label-in label {
    top: 50%;
    transform: translateY(-50%);
}
.laughtale-float-label-in:focus-within label,
.laughtale-float-label-in.has-value label {
    top: 0.25rem;
    transform: translateY(0);
    font-size: 0.65rem;
    color: var(--p-primary-500);
}
.laughtale-float-label-in input {
    padding-top: 1.25rem !important;
    padding-bottom: 0.25rem !important;
}

[data-theme="dark"] .laughtale-float-label-on label {
    background: var(--p-surface-900);
}
`;
function FloatLabelIsland(container, props) {
  injectIslandStyle("laughtale-float-label", CSS6);
  const variant = props.variant || "over";
  const innerHtml = container.innerHTML;
  container.innerHTML = `
        <div class="laughtale-float-label laughtale-float-label-${variant}">
            ${innerHtml}
            <label>${props.label}</label>
        </div>
    `;
  const wrap = container.querySelector(".laughtale-float-label");
  const input = wrap.querySelector("input, textarea, select");
  if (input) {
    const updateState = () => {
      if (input.value && input.value.length > 0) {
        wrap.classList.add("has-value");
      } else {
        wrap.classList.remove("has-value");
      }
    };
    input.addEventListener("input", updateState);
    input.addEventListener("change", updateState);
    setTimeout(updateState, 0);
  }
}

// src/components/context-menu.ts
function ContextMenuIsland(container, props) {
  const items = props.items || [];
  const targetSelector = props.targetSelector || "body";
  const global = props.global || false;
  let isOpen = false;
  let x = 0;
  let y = 0;
  injectIslandStyle("context-menu", `
        .laughtale-context-menu {
            position: fixed;
            background: var(--p-surface-0);
            border: 1px solid var(--p-border-color);
            border-radius: var(--p-border-radius);
            min-width: 12.5rem;
            padding: 0.5rem 0;
            box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06);
            font-family: var(--p-font-family, inherit);
            z-index: 1000;
        }
        [data-theme="dark"] .laughtale-context-menu {
            box-shadow: 0 4px 6px -1px rgba(0,0,0,0.5);
        }
        .context-menu-list {
            list-style: none;
            margin: 0;
            padding: 0;
        }
        .context-menu-item {
            display: flex;
            align-items: center;
            padding: 0.5rem 1rem;
            color: var(--p-text-color);
            text-decoration: none;
            cursor: pointer;
            transition: background 150ms ease, color 150ms ease;
            gap: 0.5rem;
            font-size: 0.875rem;
        }
        .context-menu-item:hover {
            background: var(--p-surface-100);
        }
        .context-menu-item.disabled {
            opacity: 0.5;
            cursor: not-allowed;
            pointer-events: none;
        }
        .context-menu-separator {
            height: 1px;
            background: var(--p-border-color);
            margin: 0.5rem 0;
        }
        .p-anchored-overlay-enter-active {
            opacity: 1;
            transition: opacity 150ms ease;
        }
    `);
  function renderMenu(menuItems) {
    return `
            <ul class="context-menu-list">
                ${menuItems.map((item) => {
      if (item.separator) return '<li class="context-menu-separator"></li>';
      const iconSvg = item.icon && LucideIcons[item.icon] ? LucideIcons[item.icon] : "";
      return `
                        <li>
                            <a class="context-menu-item ${item.disabled ? "disabled" : ""}" href="${item.url || "#"}" tabindex="0">
                                ${iconSvg ? `<span style="width: 16px; height: 16px; display: flex;">${iconSvg}</span>` : ""}
                                <span>${item.label}</span>
                            </a>
                        </li>
                    `;
    }).join("")}
            </ul>
        `;
  }
  function render() {
    if (!isOpen) {
      container.innerHTML = `

`;
      return;
    }
    container.innerHTML = `
            <div class="laughtale-context-menu p-anchored-overlay-enter-active" style="top: ${y}px; left: ${x}px;">
                ${renderMenu(items)}
            </div>
        `;
    const closeHandler = (e) => {
      isOpen = false;
      render();
      document.removeEventListener("click", closeHandler);
    };
    setTimeout(() => document.addEventListener("click", closeHandler), 0);
  }
  const targetNodes = global ? [document.body] : document.querySelectorAll(targetSelector);
  targetNodes.forEach((node) => {
    node.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      const mouseEvent = e;
      x = mouseEvent.clientX;
      y = mouseEvent.clientY;
      isOpen = true;
      render();
    });
  });
}

// src/components/input-text.ts
var CSS7 = `
.laughtale-input-wrap {
    position: relative;
    display: flex;
    align-items: center;
    width: 100%;
}
.laughtale-input {
    width: 100%;
    background: var(--p-surface-0);
    border: 1px solid var(--p-field-border, var(--p-surface-300));
    border-radius: var(--p-border-radius, 0.5rem);
    color: var(--p-text-color);
    font-family: inherit;
    transition: all 0.15s ease;
    outline: none;
}
.laughtale-input-sm { padding: 0.375rem 0.5rem; font-size: 0.75rem; }
.laughtale-input-md { padding: 0.5rem 0.75rem; font-size: 0.875rem; }
.laughtale-input-lg { padding: 0.75rem 1rem; font-size: 1rem; }

.laughtale-input:hover:not(:disabled):not(.is-invalid) {
    border-color: var(--p-primary-400);
}
.laughtale-input:focus-visible:not(:disabled):not(.is-invalid) {
    box-shadow: 0 0 0 2px var(--p-content-bg), 0 0 0 4px var(--p-primary-500);
    border-color: var(--p-primary-500);
}
.laughtale-input:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background: var(--p-surface-100);
}
.laughtale-input.is-invalid {
    border-color: #ef4444;
}
.laughtale-input.is-invalid:focus-visible {
    box-shadow: 0 0 0 2px var(--p-content-bg), 0 0 0 4px rgba(239, 68, 68, 0.5);
}
.laughtale-input-icon {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    color: var(--p-surface-400);
    display: flex;
    pointer-events: none;
}
.laughtale-input-icon-left { left: 0.75rem; }
.laughtale-input-icon-right { right: 0.75rem; }

.has-icon-left .laughtale-input { padding-left: 2.25rem; }
.has-icon-right .laughtale-input { padding-right: 2.25rem; }

.laughtale-input-clear {
    position: absolute;
    right: 0.75rem;
    top: 50%;
    transform: translateY(-50%);
    background: transparent;
    border: none;
    color: var(--p-surface-400);
    cursor: pointer;
    display: flex;
    padding: 0.125rem;
    border-radius: 50%;
}
.laughtale-input-clear:hover {
    background: var(--p-surface-100);
    color: var(--p-surface-600);
}
.has-clear .laughtale-input { padding-right: 2.25rem; }
.has-icon-right.has-clear .laughtale-input { padding-right: 3.5rem; }
.has-icon-right.has-clear .laughtale-input-clear { right: 2.25rem; }
`;
function InputTextIsland(container, props) {
  injectIslandStyle("laughtale-input-text", CSS7);
  let currentValue = props.value || "";
  function render() {
    const sizeClass = "laughtale-input-" + props.size || "md";
    const wrapClasses = [
      "laughtale-input-wrap",
      props.iconLeft ? "has-icon-left" : "",
      props.iconRight ? "has-icon-right" : "",
      props.showClear && currentValue ? "has-clear" : ""
    ].filter(Boolean).join(" ");
    container.innerHTML = `
            <div class="${wrapClasses}">
                ${props.iconLeft ? '<span class="laughtale-input-icon laughtale-input-icon-left">' + LucideIcons[props.iconLeft] || "</span>" : ""}
                <input 
                    type="${props.type || "text"}"
                    class="laughtale-input ${sizeClass} ${props.invalid ? "is-invalid" : ""}"
                    value="${currentValue}"
                    placeholder="${props.placeholder || ""}"
                    ${props.disabled ? "disabled" : ""}
                />
                ${props.showClear && currentValue ? '<button type="button" class="laughtale-input-clear">' + LucideIcons.x + "</button>" : ""}
                ${props.iconRight ? '<span class="laughtale-input-icon laughtale-input-icon-right">' + LucideIcons[props.iconRight] || "</span>" : ""}
            </div>
        `;
    bindEvents();
    syncValue();
  }
  function bindEvents() {
    const input = container.querySelector("input");
    const clearBtn = container.querySelector(".laughtale-input-clear");
    input.addEventListener("input", () => {
      const oldHasValue = !!currentValue;
      currentValue = input.value;
      const newHasValue = !!currentValue;
      syncValue();
      if (props.showClear && oldHasValue !== newHasValue) {
        render();
        const newInput = container.querySelector("input");
        newInput.focus();
        newInput.setSelectionRange(currentValue.length, currentValue.length);
      }
    });
    if (clearBtn) {
      clearBtn.addEventListener("click", () => {
        currentValue = "";
        render();
        container.querySelector("input")?.focus();
      });
    }
  }
  function syncValue() {
    if (props.targetInputName) {
      let hidden = container.querySelector('input[name="' + props.targetInputName + '"]');
      if (!hidden) {
        hidden = document.createElement("input");
        hidden.type = "hidden";
        hidden.name = props.targetInputName;
        container.appendChild(hidden);
      }
      hidden.value = currentValue;
    }
  }
  render();
}

// src/components/dataview.ts
function DataViewIsland(container, props) {
  let layout = props.layout || "list";
  const items = props.items || [];
  injectIslandStyle("dataview", `
        .laughtale-dataview {
            display: flex;
            flex-direction: column;
            gap: 1rem;
            font-family: var(--p-font-family, inherit);
        }
        .dataview-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1rem;
            background: var(--p-surface-50);
            border: 1px solid var(--p-border-color);
            border-radius: var(--p-border-radius);
        }
        .dataview-layout-options {
            display: flex;
            background: var(--p-surface-0);
            border: 1px solid var(--p-border-color);
            border-radius: var(--p-border-radius);
            overflow: hidden;
        }
        .dataview-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 2.5rem;
            height: 2.5rem;
            background: transparent;
            border: none;
            color: var(--p-text-muted-color);
            cursor: pointer;
            transition: all 150ms ease;
        }
        .dataview-btn:hover {
            background: var(--p-surface-100);
            color: var(--p-text-color);
        }
        .dataview-btn.active {
            background: var(--p-primary-50);
            color: var(--p-primary-color);
        }
        [data-theme="dark"] .dataview-btn.active {
            background: var(--p-primary-900);
        }
        
        .dataview-content {
            display: grid;
            gap: 1rem;
        }
        .dataview-content.list {
            grid-template-columns: 1fr;
        }
        .dataview-content.grid {
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        }

        .dataview-item-list {
            display: flex;
            padding: 1rem;
            background: var(--p-surface-0);
            border: 1px solid var(--p-border-color);
            border-radius: var(--p-border-radius);
            gap: 1rem;
            align-items: center;
            transition: box-shadow 150ms ease;
        }
        .dataview-item-grid {
            display: flex;
            flex-direction: column;
            padding: 1rem;
            background: var(--p-surface-0);
            border: 1px solid var(--p-border-color);
            border-radius: var(--p-border-radius);
            gap: 1rem;
            transition: box-shadow 150ms ease;
        }
        .dataview-item-list:hover, .dataview-item-grid:hover {
            box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06);
        }
    `);
  function renderContent() {
    return items.map((item) => {
      if (layout === "list") {
        return `
                    <div class="dataview-item-list">
                        <div style="flex: 1;">${item.name || item.title || JSON.stringify(item)}</div>
                    </div>
                `;
      } else {
        return `
                    <div class="dataview-item-grid">
                        <div style="font-weight: 600;">${item.name || item.title || JSON.stringify(item)}</div>
                    </div>
                `;
      }
    }).join("");
  }
  function render() {
    container.innerHTML = `
<div class="laughtale-dataview">
                <div class="dataview-header">
                    <div class="dataview-start">
                        <!-- Custom content like sorting could go here -->
                    </div>
                    <div class="dataview-end">
                        <div class="dataview-layout-options">
                            <button class="dataview-btn ' + layout === 'list' ? 'active' : '' + '" data-layout="list" aria-label="List View">
                                \${LucideIcons.moreHorizontal}
                            </button>
                            <button class="dataview-btn \${layout === 'grid' ? 'active' : ''}" data-layout="grid" aria-label="Grid View">
                                \${LucideIcons.layers}
                            </button>
                        </div>
                    </div>
                </div>
                
                <div class="dataview-content \${layout}">
                    \${renderContent()}
                </div>
            </div>
`;
    bindEvents();
  }
  function bindEvents() {
    container.querySelectorAll(".dataview-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        layout = e.currentTarget.dataset.layout;
        render();
      });
    });
  }
  render();
}

// src/components/tooltip-component.ts
function TooltipIsland(container, props) {
  const targetSelector = props.target;
  const position = props.position || "top";
  const showDelay = props.showDelay || 300;
  const hideDelay = props.hideDelay || 100;
  let showTimer = null;
  let hideTimer = null;
  let activeTarget = null;
  const contentHtml = container.innerHTML;
  container.innerHTML = `

`;
  injectIslandStyle("tooltip", `
        .laughtale-tooltip {
            position: absolute;
            background: var(--p-surface-900);
            color: var(--p-surface-0);
            padding: 0.5rem 0.75rem;
            border-radius: var(--p-border-radius);
            font-size: 0.75rem;
            font-family: var(--p-font-family, inherit);
            pointer-events: none;
            z-index: 2000;
            opacity: 0;
            transition: opacity 150ms ease;
            box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
        }
        [data-theme="dark"] .laughtale-tooltip {
            background: var(--p-surface-100);
            color: var(--p-text-color);
        }
        .laughtale-tooltip.visible {
            opacity: 1;
        }
        .tooltip-arrow {
            position: absolute;
            width: 0;
            height: 0;
            border-style: solid;
        }
        .tooltip-arrow.top {
            bottom: -4px;
            left: calc(50% - 4px);
            border-width: 4px 4px 0 4px;
            border-color: var(--p-surface-900) transparent transparent transparent;
        }
        [data-theme="dark"] .tooltip-arrow.top {
            border-color: var(--p-surface-100) transparent transparent transparent;
        }
    `);
  let tooltipEl = null;
  function createTooltip() {
    if (!tooltipEl) {
      tooltipEl = document.createElement("div");
      tooltipEl.className = "laughtale-tooltip";
      tooltipEl.innerHTML = `
<div class="tooltip-arrow ' + position + '"></div>
                <div class="tooltip-content">\${contentHtml}</div>
`;
      document.body.appendChild(tooltipEl);
    }
  }
  function show(target) {
    if (hideTimer) clearTimeout(hideTimer);
    activeTarget = target;
    showTimer = window.setTimeout(() => {
      createTooltip();
      if (tooltipEl && activeTarget) {
        const rect = activeTarget.getBoundingClientRect();
        if (position === "top") {
          tooltipEl.style.top = rect.top + window.scrollY - tooltipEl.offsetHeight - 8 + "px";
          tooltipEl.style.left = rect.left + window.scrollX + rect.width / 2 - tooltipEl.offsetWidth / 2 + "px";
        }
        tooltipEl.classList.add("visible");
      }
    }, showDelay);
  }
  function hide() {
    if (showTimer) clearTimeout(showTimer);
    hideTimer = window.setTimeout(() => {
      if (tooltipEl) {
        tooltipEl.classList.remove("visible");
        setTimeout(() => {
          if (tooltipEl && tooltipEl.parentNode) {
            tooltipEl.parentNode.removeChild(tooltipEl);
            tooltipEl = null;
          }
        }, 150);
      }
    }, hideDelay);
  }
  const targets = document.querySelectorAll(targetSelector);
  targets.forEach((target) => {
    target.addEventListener("mouseenter", () => show(target));
    target.addEventListener("mouseleave", hide);
    target.addEventListener("focus", () => show(target));
    target.addEventListener("blur", hide);
  });
}

// tests/phase2-components.test.ts
describe.only("SoftMax.LaughTale Aura v2 Components Suite", () => {
  let container;
  beforeEach(() => {
    document.body.innerHTML = '<div id="app"></div>';
    container = document.getElementById("app");
  });
  it("Select: creates dropdown, opens on click, selects option, syncs value", () => {
    SelectIsland(container, {
      options: [
        { label: "Option 1", value: "1" },
        { label: "Option 2", value: "2" }
      ],
      targetInputName: "my_select"
    });
    const trigger = container.querySelector(".laughtale-select-trigger");
    assert.ok(trigger);
    trigger.click();
    const selectWrap = container.querySelector(".laughtale-select");
    assert.ok(selectWrap.classList.contains("is-open"));
    const items = container.querySelectorAll(".laughtale-select-item");
    assert.strictEqual(items.length, 2);
    items[1].click();
    const hidden = container.querySelector('input[name="my_select"]');
    assert.strictEqual(hidden.value, "2");
  });
  it("Checkbox: renders checkbox, toggles on click, handles indeterminate", () => {
    CheckboxIsland(container, {
      checked: false,
      targetInputName: "my_checkbox",
      value: "yes"
    });
    const wrap = container.querySelector(".laughtale-checkbox-wrap");
    const hidden = container.querySelector('input[name="my_checkbox"]');
    assert.strictEqual(hidden.value, "false");
    const input = container.querySelector(".laughtale-checkbox-hidden");
    input.checked = true;
    input.dispatchEvent(new Event("change"));
    assert.strictEqual(hidden.value, "yes");
    assert.ok(wrap.classList.contains("is-checked"));
  });
  it("RadioButton: renders radio, checks on click, syncs value", () => {
    RadioButtonIsland(container, {
      name: "my_radio",
      value: "A",
      checked: false,
      targetInputName: "my_radio_hidden"
    });
    const hidden = document.querySelector('input[name="my_radio_hidden"]');
    assert.ok(!hidden);
    const input = container.querySelector(".laughtale-radio-hidden");
    input.checked = true;
    input.dispatchEvent(new Event("change"));
    const hiddenAfter = document.querySelector('input[name="my_radio_hidden"]');
    assert.strictEqual(hiddenAfter.value, "A");
  });
  it("Textarea: renders with auto-resize, counts characters", () => {
    TextareaIsland(container, {
      value: "hello",
      maxLength: 10,
      autoResize: true,
      targetInputName: "my_textarea"
    });
    const textarea = container.querySelector("textarea");
    const counter = container.querySelector(".laughtale-char-count");
    assert.strictEqual(textarea.value, "hello");
    assert.strictEqual(counter.textContent, "5");
    textarea.value = "hello world";
    textarea.dispatchEvent(new Event("input"));
    assert.strictEqual(counter.textContent, "11");
    const hidden = container.querySelector('input[name="my_textarea"]');
    assert.strictEqual(hidden.value, "hello world");
  });
  it("Menu: renders items, supports keyboard nav", () => {
    MenuIsland(container, {
      items: [
        { label: "Item 1" },
        { label: "Item 2" }
      ]
    });
    const items = container.querySelectorAll(".menu-item");
    assert.strictEqual(items.length, 2);
    assert.strictEqual(items[0].querySelector("span").textContent, "Item 1");
  });
  it("Carousel: renders slides, navigates with arrow buttons", () => {
    CarouselIsland(container, {
      items: [
        { title: "Slide 1" },
        { title: "Slide 2" }
      ],
      numVisible: 1,
      showNavigators: true
    });
    const track = container.querySelector(".carousel-track");
    assert.ok(track);
    assert.strictEqual(track.style.transform, "translateX(-0%)");
    const nextBtn = container.querySelector(".next-btn");
    nextBtn.click();
    assert.strictEqual(track.style.transform, "translateX(-100%)");
  });
  it("Paginator: renders page buttons, changes page on click", () => {
    PaginatorIsland(container, {
      totalRecords: 50,
      rows: 10,
      first: 0
    });
    let pageFired = false;
    container.addEventListener("page-change", () => {
      pageFired = true;
    });
    const nextBtn = container.querySelector(".btn-next");
    nextBtn.click();
    assert.ok(pageFired);
  });
  it("Sidebar: renders items, toggles collapse", () => {
    SidebarIsland(container, {
      items: [
        { label: "Dash" }
      ]
    });
    const sidebar = container.querySelector(".laughtale-sidebar");
    assert.ok(!sidebar.classList.contains("collapsed"));
    const toggleBtn = container.querySelector(".sidebar-toggle");
    toggleBtn.click();
    assert.ok(sidebar.classList.contains("collapsed"));
  });
  it("Popover: opens popover on trigger click", () => {
    const trigger = document.createElement("button");
    trigger.id = "trigger";
    document.body.appendChild(trigger);
    PopoverIsland(container, {
      triggerId: "trigger"
    });
    assert.ok(!container.querySelector(".laughtale-popover"));
    trigger.click();
    assert.ok(container.querySelector(".laughtale-popover"));
  });
  it("InputMask: applies mask pattern on typing", () => {
    InputMaskIsland(container, {
      mask: "99-99",
      targetInputName: "my_mask"
    });
    const input = container.querySelector("input");
    input.value = "1234";
    input.dispatchEvent(new Event("input"));
    assert.strictEqual(input.value, "12-34");
    const hidden = container.querySelector('input[name="my_mask"]');
    assert.strictEqual(hidden.value, "1234");
  });
  it("FloatLabel: floats label on input focus", () => {
    container.innerHTML = '<input type="text" />';
    FloatLabelIsland(container, {
      label: "My Label",
      variant: "over"
    });
    const label = container.querySelector("label");
    assert.strictEqual(label.textContent, "My Label");
    const wrap = container.querySelector(".laughtale-float-label");
    const input = container.querySelector("input");
    input.value = "val";
    input.dispatchEvent(new Event("input"));
    assert.ok(wrap.classList.contains("has-value"));
  });
  it("ContextMenu: opens on right-click", () => {
    const target = document.createElement("div");
    target.className = "target";
    document.body.appendChild(target);
    ContextMenuIsland(container, {
      items: [{ label: "Ctx 1" }],
      targetSelector: ".target"
    });
    assert.ok(!container.querySelector(".laughtale-context-menu"));
    target.dispatchEvent(new MouseEvent("contextmenu", { clientX: 100, clientY: 100 }));
    const menu = container.querySelector(".laughtale-context-menu");
    assert.ok(menu);
    assert.strictEqual(menu.style.left, "100px");
  });
  it("InputText: renders with icon and clear button", () => {
    InputTextIsland(container, {
      value: "hello",
      iconLeft: "search",
      showClear: true,
      targetInputName: "my_text"
    });
    const wrap = container.querySelector(".laughtale-input-wrap");
    assert.ok(wrap.classList.contains("has-icon-left"));
    assert.ok(wrap.classList.contains("has-clear"));
    const clearBtn = container.querySelector(".laughtale-input-clear");
    clearBtn.click();
    const hidden = container.querySelector('input[name="my_text"]');
    assert.strictEqual(hidden.value, "");
  });
  it("DataView: toggles between grid and list layouts", () => {
    DataViewIsland(container, {
      items: [{ title: "Item A" }]
    });
    const content = container.querySelector(".dataview-content");
    assert.ok(content.classList.contains("list"));
    const gridBtn = container.querySelector('.dataview-btn[data-layout="grid"]');
    gridBtn.click();
    assert.ok(content.classList.contains("grid"));
  });
  it("TooltipComponent: shows tooltip on hover", () => {
    const target = document.createElement("button");
    target.className = "tooltiptarget";
    document.body.appendChild(target);
    TooltipIsland(container, {
      target: ".tooltiptarget",
      showDelay: 0
    });
    target.dispatchEvent(new Event("mouseenter"));
    setTimeout(() => {
      const tooltip = document.querySelector(".laughtale-tooltip");
      assert.ok(tooltip);
    }, 10);
  });
});
