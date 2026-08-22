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

// tests/new-components.test.ts
import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";

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

// src/components/dynamic-form.ts
function DynamicFormIsland(container, props) {
  let schema = props.schema || null;
  if (!schema && props.schemaJson) {
    try {
      schema = JSON.parse(props.schemaJson);
    } catch (err) {
      console.error("[SoftMax.LaughTale DynamicForm] Failed to parse schemaJson:", err);
    }
  }
  if (!schema) {
    container.innerHTML = `<div style="color: var(--p-surface-400); font-size: 0.875rem;">No Form Schema provided.</div>`;
    return;
  }
  const formData = {};
  const errors = {};
  schema.fields.forEach((f) => {
    formData[f.name] = f.defaultValue !== void 0 && f.defaultValue !== null ? f.defaultValue : "";
  });
  function renderField(f) {
    const val = formData[f.name] ?? "";
    const error = errors[f.name];
    let controlHtml = "";
    switch (f.fieldType) {
      case "Password":
        controlHtml = `
                    <div style="position: relative;">
                        <input type="password" name="${f.name}" class="p-input form-field-input" data-field="${f.name}" value="${val}" placeholder="${f.placeholder || ""}" ${f.isRequired ? "required" : ""} style="width: 100%;" />
                    </div>
                `;
        break;
      case "Multiline":
        controlHtml = `
                    <textarea name="${f.name}" class="p-input form-field-input" data-field="${f.name}" rows="3" placeholder="${f.placeholder || ""}" ${f.isRequired ? "required" : ""} style="width: 100%; resize: vertical;">${val}</textarea>
                `;
        break;
      case "Number":
      case "Currency":
        controlHtml = `
                    <input type="number" name="${f.name}" class="p-input form-field-input" data-field="${f.name}" value="${val}" min="${f.min ?? ""}" max="${f.max ?? ""}" placeholder="${f.placeholder || ""}" ${f.isRequired ? "required" : ""} style="width: 100%;" />
                `;
        break;
      case "Switch":
        const checked = Boolean(val);
        controlHtml = `
                    <label style="display: inline-flex; align-items: center; gap: 0.5rem; cursor: pointer;">
                        <input type="checkbox" name="${f.name}" class="form-field-checkbox" data-field="${f.name}" ${checked ? "checked" : ""} style="width: 1.25rem; height: 1.25rem; accent-color: var(--p-primary-600);" />
                        <span style="font-size: 0.875rem; color: var(--p-surface-700);">${f.label}</span>
                    </label>
                `;
        break;
      case "Select":
        const options = (f.options || []).map((opt) => `<option value="${opt.value}" ${opt.value === val ? "selected" : ""}>${opt.label}</option>`).join("");
        controlHtml = `
                    <select name="${f.name}" class="p-input form-field-select" data-field="${f.name}" style="width: 100%;">
                        ${options}
                    </select>
                `;
        break;
      case "DatePicker":
        controlHtml = `
                    <input type="date" name="${f.name}" class="p-input form-field-input" data-field="${f.name}" value="${val}" style="width: 100%;" />
                `;
        break;
      default:
        controlHtml = `
                    <input type="${f.fieldType === "Email" ? "email" : "text"}" name="${f.name}" class="p-input form-field-input" data-field="${f.name}" value="${val}" placeholder="${f.placeholder || ""}" ${f.isRequired ? "required" : ""} style="width: 100%;" />
                `;
        break;
    }
    return `
            <div class="form-group" style="display: flex; flex-direction: column; gap: 0.35rem;">
                ${f.fieldType !== "Switch" ? `
                    <label style="font-size: 0.8125rem; font-weight: 600; color: var(--p-surface-800); display: flex; align-items: center; gap: 0.25rem;">
                        ${f.label}
                        ${f.isRequired ? '<span style="color: #ef4444;">*</span>' : ""}
                    </label>
                ` : ""}
                ${controlHtml}
                ${f.helpText ? `<span style="font-size: 0.75rem; color: var(--p-surface-400);">${f.helpText}</span>` : ""}
                ${error ? `<span style="font-size: 0.75rem; color: #ef4444; font-weight: 500;">${error}</span>` : ""}
            </div>
        `;
  }
  function render() {
    const fieldsHtml = schema.fields.map(renderField).join("");
    container.innerHTML = `
            <form class="laughtale-dynamic-form" style="background: var(--p-surface-0); border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius-lg); padding: 1.75rem; display: flex; flex-direction: column; gap: 1.25rem;">
                <!-- Form Header -->
                <div style="border-bottom: 1px solid var(--p-border-color); padding-bottom: 0.875rem;">
                    <h3 style="font-size: 1.125rem; font-weight: 700; color: var(--p-surface-900); margin-bottom: 0.25rem;">${schema.title}</h3>
                    ${schema.description ? `<p style="font-size: 0.8125rem; color: var(--p-surface-500);">${schema.description}</p>` : ""}
                </div>

                <!-- Form Fields Grid -->
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1.25rem;">
                    ${fieldsHtml}
                </div>

                <!-- Submit Button -->
                <div style="display: flex; justify-content: flex-end; border-top: 1px solid var(--p-border-color); padding-top: 1rem; margin-top: 0.5rem;">
                    <button type="submit" class="p-button p-button-primary" style="padding: 0.5rem 1.25rem; font-size: 0.875rem;">
                        ${schema.submitLabel || "Submit"}
                    </button>
                </div>
            </form>
        `;
    bindEvents();
  }
  function validate() {
    let valid = true;
    Object.keys(errors).forEach((k) => delete errors[k]);
    schema.fields.forEach((f) => {
      const val = formData[f.name];
      if (f.isRequired && (val === void 0 || val === null || val === "")) {
        errors[f.name] = `${f.label} is required.`;
        valid = false;
      } else if (f.fieldType === "Email" && val && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(val))) {
        errors[f.name] = `Invalid email address.`;
        valid = false;
      }
    });
    return valid;
  }
  function bindEvents() {
    const form = container.querySelector(".laughtale-dynamic-form");
    form.querySelectorAll(".form-field-input, .form-field-select").forEach((input) => {
      input.addEventListener("input", (e) => {
        const target = e.target;
        const fieldName = target.getAttribute("data-field");
        formData[fieldName] = target.value;
      });
    });
    form.querySelectorAll(".form-field-checkbox").forEach((chk) => {
      chk.addEventListener("change", (e) => {
        const target = e.target;
        const fieldName = target.getAttribute("data-field");
        formData[fieldName] = target.checked;
      });
    });
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (validate()) {
        container.dispatchEvent(new CustomEvent("form:submit", {
          bubbles: true,
          detail: { data: formData }
        }));
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = `${LucideIcons.check} Submitted Successfully!`;
        submitBtn.style.backgroundColor = "#059669";
        setTimeout(() => {
          submitBtn.innerHTML = originalText;
          submitBtn.style.backgroundColor = "";
        }, 2500);
      } else {
        render();
      }
    });
  }
  render();
}

// src/composables/useDragGesture.ts
function useDragGesture(targetElement, options = {}) {
  const axis = options.axis ?? "both";
  let isDragging = false;
  let startX = 0;
  let startY = 0;
  function getDragState(e) {
    const rect = targetElement.getBoundingClientRect();
    const clientX = e.clientX;
    const clientY = e.clientY;
    const dx = axis === "y" ? 0 : clientX - startX;
    const dy = axis === "x" ? 0 : clientY - startY;
    const ratioX = rect.width > 0 ? Math.max(0, Math.min(1, (clientX - rect.left) / rect.width)) : 0;
    const ratioY = rect.height > 0 ? Math.max(0, Math.min(1, (clientY - rect.top) / rect.height)) : 0;
    return { clientX, clientY, dx, dy, ratioX, ratioY, isDragging };
  }
  const onPointerDown = (e) => {
    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;
    if ("setPointerCapture" in targetElement && e.pointerId !== void 0) {
      try {
        targetElement.setPointerCapture(e.pointerId);
      } catch (_) {
      }
    }
    const state = getDragState(e);
    options.onDragStart?.(state);
    options.onDrag?.(state);
  };
  const onPointerMove = (e) => {
    if (!isDragging) return;
    const state = getDragState(e);
    options.onDrag?.(state);
  };
  const onPointerUp = (e) => {
    if (!isDragging) return;
    isDragging = false;
    if ("releasePointerCapture" in targetElement && e.pointerId !== void 0) {
      try {
        targetElement.releasePointerCapture(e.pointerId);
      } catch (_) {
      }
    }
    const state = getDragState(e);
    options.onDragEnd?.(state);
  };
  targetElement.addEventListener("pointerdown", onPointerDown);
  targetElement.addEventListener("pointermove", onPointerMove);
  targetElement.addEventListener("pointerup", onPointerUp);
  targetElement.addEventListener("pointercancel", onPointerUp);
  function destroy() {
    targetElement.removeEventListener("pointerdown", onPointerDown);
    targetElement.removeEventListener("pointermove", onPointerMove);
    targetElement.removeEventListener("pointerup", onPointerUp);
    targetElement.removeEventListener("pointercancel", onPointerUp);
  }
  return { destroy };
}

// src/components/splitter.ts
function SplitterIsland(container, props) {
  const layout = props.layout || "horizontal";
  const isHorizontal = layout === "horizontal";
  const panels = props.panels && props.panels.length >= 2 ? props.panels : [
    { id: "p1", size: 50, content: "Panel 1 (Left)" },
    { id: "p2", size: 50, content: "Panel 2 (Right)" }
  ];
  let leftPercent = panels[0].size ?? 50;
  container.innerHTML = `
        <div class="laughtale-splitter" style="display: flex; flex-direction: ${isHorizontal ? "row" : "column"}; width: 100%; height: 320px; border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius-lg); overflow: hidden; background: var(--p-surface-0);">
            <!-- Panel 1 -->
            <div class="splitter-panel-1" style="flex: 0 0 ${leftPercent}%; overflow: auto; padding: 1.25rem; background: var(--p-surface-50);">
                ${panels[0].content || ""}
            </div>

            <!-- Gutter Divider Handle -->
            <div class="splitter-gutter" style="flex: 0 0 8px; background: var(--p-surface-200); cursor: ${isHorizontal ? "col-resize" : "row-resize"}; display: flex; align-items: center; justify-content: center; user-select: none; transition: background 0.15s ease;">
                <div style="width: ${isHorizontal ? "2px" : "16px"}; height: ${isHorizontal ? "16px" : "2px"}; background: var(--p-surface-400); border-radius: 1px;"></div>
            </div>

            <!-- Panel 2 -->
            <div class="splitter-panel-2" style="flex: 1; overflow: auto; padding: 1.25rem; background: var(--p-surface-0);">
                ${panels[1].content || ""}
            </div>
        </div>
    `;
  const panel1 = container.querySelector(".splitter-panel-1");
  const gutter = container.querySelector(".splitter-gutter");
  useDragGesture(gutter, {
    axis: isHorizontal ? "x" : "y",
    onDrag: (state) => {
      const containerRect = container.querySelector(".laughtale-splitter").getBoundingClientRect();
      let newPercent = isHorizontal ? (state.clientX - containerRect.left) / containerRect.width * 100 : (state.clientY - containerRect.top) / containerRect.height * 100;
      newPercent = Math.max(10, Math.min(90, newPercent));
      leftPercent = newPercent;
      panel1.style.flex = `0 0 ${newPercent}%`;
      container.dispatchEvent(new CustomEvent("splitter:resize", {
        bubbles: true,
        detail: { leftPercent: newPercent, rightPercent: 100 - newPercent }
      }));
    }
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

// src/components/multiselect.ts
function MultiSelectIsland(container, props) {
  const options = props.options || [];
  let selected = new Set(props.selectedValues || []);
  let filterQuery = "";
  container.innerHTML = `
        <div class="laughtale-multiselect" style="position: relative; width: 100%; max-width: 320px; font-family: var(--p-font-family, inherit);">
            <!-- Trigger Button Container -->
            <div class="multiselect-trigger p-input" style="display: flex; align-items: center; justify-content: space-between; min-height: 2.5rem; padding: 0.35rem 0.75rem; cursor: ${props.disabled ? "not-allowed" : "pointer"}; background: var(--p-surface-0); border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius); user-select: none;">
                <div class="multiselect-label-container" style="display: flex; align-items: center; gap: 0.35rem; flex-wrap: wrap; flex: 1; min-width: 0;"></div>
                <div style="display: flex; align-items: center; gap: 0.35rem; color: var(--p-surface-400);">
                    <span class="multiselect-clear-btn" style="display: none; cursor: pointer; padding: 2px;">${LucideIcons.x}</span>
                    <span class="multiselect-chevron" style="display: flex; transition: transform 0.2s ease;">${LucideIcons.chevronDown}</span>
                </div>
            </div>

            <!-- Popover Overlay -->
            <div class="multiselect-overlay" style="display: none; position: absolute; top: calc(100% + 4px); left: 0; right: 0; z-index: 500; background: var(--p-surface-0); border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius-lg); box-shadow: var(--p-shadow-lg); overflow: hidden;">
                <!-- Filter Search Box -->
                <div style="padding: 0.5rem; border-bottom: 1px solid var(--p-border-color); display: flex; align-items: center; gap: 0.5rem;">
                    <span style="color: var(--p-surface-400); display: flex;">${LucideIcons.search}</span>
                    <input type="text" class="multiselect-filter-input" placeholder="Search..." style="flex: 1; border: none; outline: none; background: transparent; font-size: 0.8125rem; color: var(--p-text-color);" />
                </div>

                <!-- Select All Bar -->
                <div class="multiselect-select-all" style="display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 0.75rem; border-bottom: 1px solid var(--p-surface-100); background: var(--p-surface-50); cursor: pointer; font-size: 0.75rem; font-weight: 600; color: var(--p-surface-600);">
                    <input type="checkbox" class="select-all-chk" style="accent-color: var(--p-primary-600); cursor: pointer;" />
                    <span>Select All</span>
                </div>

                <!-- Items List -->
                <div class="multiselect-items-list" style="max-height: 200px; overflow-y: auto; padding: 0.25rem 0;"></div>
            </div>
        </div>
    `;
  const trigger = container.querySelector(".multiselect-trigger");
  const labelContainer = container.querySelector(".multiselect-label-container");
  const overlay = container.querySelector(".multiselect-overlay");
  const filterInput = container.querySelector(".multiselect-filter-input");
  const selectAllChk = container.querySelector(".select-all-chk");
  const itemsList = container.querySelector(".multiselect-items-list");
  const clearBtn = container.querySelector(".multiselect-clear-btn");
  const chevron = container.querySelector(".multiselect-chevron");
  const disclosure = useDisclosure({
    defaultIsOpen: false,
    onOpen: () => {
      chevron.style.transform = "rotate(180deg)";
      filterInput.value = "";
      filterQuery = "";
      renderList();
      useTransition(overlay, { type: "fade", isMounted: true });
      filterInput.focus();
    },
    onClose: () => {
      chevron.style.transform = "none";
      useTransition(overlay, { type: "fade", isMounted: false });
    }
  });
  useClickOutside(container, () => disclosure.close());
  function getFilteredOptions() {
    if (!filterQuery.trim()) return options;
    const q = filterQuery.toLowerCase();
    return options.filter((o) => o.label.toLowerCase().includes(q));
  }
  function renderDisplay() {
    if (selected.size === 0) {
      labelContainer.innerHTML = `<span style="color: var(--p-surface-400); font-size: 0.875rem;">${props.placeholder || "Select items..."}</span>`;
      clearBtn.style.display = "none";
      return;
    }
    clearBtn.style.display = "flex";
    if (props.display === "comma") {
      const labels = options.filter((o) => selected.has(o.value)).map((o) => o.label).join(", ");
      labelContainer.innerHTML = `<span style="font-size: 0.875rem; color: var(--p-text-color);">${labels}</span>`;
    } else {
      const chipsHtml = options.filter((o) => selected.has(o.value)).map((o) => `
                <span class="aura-tag tag-emerald" style="padding: 0.15rem 0.45rem; font-size: 0.75rem; display: inline-flex; align-items: center; gap: 0.25rem;">
                    ${o.label}
                    <span class="chip-remove-btn" data-val="${o.value}" style="cursor: pointer; display: flex; opacity: 0.7;">${LucideIcons.x}</span>
                </span>
            `).join("");
      labelContainer.innerHTML = chipsHtml;
      labelContainer.querySelectorAll(".chip-remove-btn").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.stopPropagation();
          const val = btn.getAttribute("data-val");
          selected.delete(val);
          renderDisplay();
          renderList();
          syncValue();
        });
      });
    }
  }
  function renderList() {
    const filtered = getFilteredOptions();
    selectAllChk.checked = filtered.length > 0 && filtered.every((o) => selected.has(o.value));
    if (filtered.length === 0) {
      itemsList.innerHTML = `<div style="padding: 1rem; text-align: center; font-size: 0.75rem; color: var(--p-surface-400);">No options found</div>`;
      return;
    }
    itemsList.innerHTML = filtered.map((o) => {
      const isChecked = selected.has(o.value);
      return `
                <div class="multiselect-item" data-val="${o.value}" style="display: flex; align-items: center; gap: 0.625rem; padding: 0.45rem 0.75rem; cursor: pointer; font-size: 0.8125rem; background: ${isChecked ? "var(--p-surface-50)" : "transparent"}; color: var(--p-text-color);">
                    <input type="checkbox" ${isChecked ? "checked" : ""} style="accent-color: var(--p-primary-600); pointer-events: none;" />
                    <span style="flex: 1;">${o.label}</span>
                </div>
            `;
    }).join("");
    itemsList.querySelectorAll(".multiselect-item").forEach((el) => {
      el.addEventListener("click", () => {
        const val = el.getAttribute("data-val");
        if (selected.has(val)) selected.delete(val);
        else selected.add(val);
        renderDisplay();
        renderList();
        syncValue();
      });
    });
  }
  trigger.addEventListener("click", () => {
    if (props.disabled) return;
    disclosure.toggle();
  });
  clearBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    selected.clear();
    renderDisplay();
    renderList();
    syncValue();
  });
  selectAllChk.parentElement?.addEventListener("click", () => {
    const filtered = getFilteredOptions();
    const allChecked = filtered.every((o) => selected.has(o.value));
    if (allChecked) {
      filtered.forEach((o) => selected.delete(o.value));
    } else {
      filtered.forEach((o) => selected.add(o.value));
    }
    renderDisplay();
    renderList();
    syncValue();
  });
  filterInput.addEventListener("input", () => {
    filterQuery = filterInput.value;
    renderList();
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
      hidden.value = JSON.stringify(Array.from(selected));
    }
    container.dispatchEvent(new CustomEvent("multiselect:change", {
      bubbles: true,
      detail: { value: Array.from(selected) }
    }));
  }
  renderDisplay();
  syncValue();
}

// src/components/listbox.ts
function ListboxIsland(container, props) {
  const options = props.options || [];
  let selected = new Set(props.selectedValue !== void 0 ? [props.selectedValue] : []);
  let filterQuery = "";
  container.innerHTML = `
        <div class="laughtale-listbox" style="width: 100%; max-width: 280px; border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius-lg); background: var(--p-surface-0); overflow: hidden; font-family: var(--p-font-family, inherit);">
            ${props.filter ? `
                <div style="padding: 0.5rem 0.75rem; border-bottom: 1px solid var(--p-border-color); display: flex; align-items: center; gap: 0.5rem; background: var(--p-surface-50);">
                    <span style="color: var(--p-surface-400); display: flex;">${LucideIcons.search(14)}</span>
                    <input type="text" class="listbox-filter-input" placeholder="Filter..." style="flex: 1; border: none; outline: none; background: transparent; font-size: 0.8125rem; color: var(--p-text-color);" />
                </div>
            ` : ""}
            <div class="listbox-items-container" style="max-height: 220px; overflow-y: auto; padding: 0.25rem 0;"></div>
        </div>
    `;
  const itemsContainer = container.querySelector(".listbox-items-container");
  const filterInput = container.querySelector(".listbox-filter-input");
  function getFiltered() {
    if (!filterQuery.trim()) return options;
    const q = filterQuery.toLowerCase();
    return options.filter((o) => o.label.toLowerCase().includes(q));
  }
  function renderList() {
    const filtered = getFiltered();
    if (filtered.length === 0) {
      itemsContainer.innerHTML = `<div style="padding: 1rem; text-align: center; font-size: 0.75rem; color: var(--p-surface-400);">No options</div>`;
      return;
    }
    itemsContainer.innerHTML = filtered.map((o) => {
      const isSelected = selected.has(o.value);
      return `
                <div class="listbox-item" data-val="${o.value}" style="display: flex; align-items: center; justify-content: space-between; padding: 0.5rem 0.875rem; cursor: pointer; font-size: 0.8125rem; background: ${isSelected ? "var(--p-primary-50)" : "transparent"}; color: ${isSelected ? "var(--p-primary-700)" : "var(--p-text-color)"}; font-weight: ${isSelected ? "600" : "normal"}; transition: background 0.1s ease;">
                    <span>${o.label}</span>
                    ${isSelected ? `<span style="color: var(--p-primary-600); display: flex;">${LucideIcons.check}</span>` : ""}
                </div>
            `;
    }).join("");
    itemsContainer.querySelectorAll(".listbox-item").forEach((el) => {
      el.addEventListener("click", () => {
        if (props.disabled) return;
        const val = el.getAttribute("data-val");
        if (props.multiple) {
          if (selected.has(val)) selected.delete(val);
          else selected.add(val);
        } else {
          selected.clear();
          selected.add(val);
        }
        renderList();
        syncValue();
      });
    });
  }
  filterInput?.addEventListener("input", () => {
    filterQuery = filterInput.value;
    renderList();
  });
  function syncValue() {
    const arr = Array.from(selected);
    if (props.targetInputName) {
      let hidden = container.querySelector(`input[name="${props.targetInputName}"]`);
      if (!hidden) {
        hidden = document.createElement("input");
        hidden.type = "hidden";
        hidden.name = props.targetInputName;
        container.appendChild(hidden);
      }
      hidden.value = props.multiple ? JSON.stringify(arr) : arr[0] ? String(arr[0]) : "";
    }
    container.dispatchEvent(new CustomEvent("listbox:change", {
      bubbles: true,
      detail: { value: props.multiple ? arr : arr[0] }
    }));
  }
  renderList();
  syncValue();
}

// src/composables/animation/useAutoAnimate.ts
function useAutoAnimate(parent, options = {}) {
  if (!parent || typeof window === "undefined" || typeof MutationObserver === "undefined") {
    return { destroy: () => {
    } };
  }
  const duration = options.duration ?? 250;
  const easing = options.easing ?? "cubic-bezier(0.2, 0, 0, 1)";
  const prevRects = /* @__PURE__ */ new Map();
  function recordRects() {
    prevRects.clear();
    Array.from(parent.children).forEach((child) => {
      prevRects.set(child, child.getBoundingClientRect());
    });
  }
  function animate() {
    const currentChildren = Array.from(parent.children);
    currentChildren.forEach((child) => {
      const first = prevRects.get(child);
      const last = child.getBoundingClientRect();
      if (first) {
        const deltaX = first.left - last.left;
        const deltaY = first.top - last.top;
        if (deltaX !== 0 || deltaY !== 0) {
          child.animate([
            { transform: `translate(${deltaX}px, ${deltaY}px)` },
            { transform: "none" }
          ], {
            duration,
            easing
          });
        }
      } else {
        child.animate([
          { opacity: 0, transform: "scale(0.95)" },
          { opacity: 1, transform: "none" }
        ], {
          duration,
          easing
        });
      }
    });
  }
  recordRects();
  const observer = new MutationObserver(() => {
    animate();
    recordRects();
  });
  observer.observe(parent, { childList: true });
  return {
    destroy: () => {
      observer.disconnect();
      prevRects.clear();
    }
  };
}

// src/components/picklist.ts
function PickListIsland(container, props) {
  let sourceList = props.source ? [...props.source] : [
    { id: "1", name: "Identity & Access Manager" },
    { id: "2", name: "Audit Compliance Engine" },
    { id: "3", name: "Rate Limiter Gateway" }
  ];
  let targetList = props.target ? [...props.target] : [
    { id: "4", name: "Zero-Trust HSM Validator" }
  ];
  let selectedSource = /* @__PURE__ */ new Set();
  let selectedTarget = /* @__PURE__ */ new Set();
  function render() {
    container.innerHTML = `
            <div class="laughtale-picklist" style="display: flex; align-items: center; gap: 1rem; width: 100%; max-width: 680px; font-family: var(--p-font-family, inherit);">
                <!-- Source Box -->
                <div style="flex: 1; border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius-lg); background: var(--p-surface-0); overflow: hidden; display: flex; flex-direction: column;">
                    <div style="padding: 0.625rem 0.875rem; background: var(--p-surface-50); border-bottom: 1px solid var(--p-border-color); font-size: 0.75rem; font-weight: 700; color: var(--p-surface-600); text-transform: uppercase;">
                        ${props.sourceHeader || "Available"} (${sourceList.length})
                    </div>
                    <div class="picklist-source-list" style="height: 180px; overflow-y: auto; padding: 0.25rem 0;">
                        ${sourceList.map((it2) => `
                            <div class="picklist-item source-item ${selectedSource.has(it2.id) ? "active" : ""}" data-id="${it2.id}" style="padding: 0.45rem 0.75rem; cursor: pointer; font-size: 0.8125rem; background: ${selectedSource.has(it2.id) ? "var(--p-primary-50)" : "transparent"}; color: ${selectedSource.has(it2.id) ? "var(--p-primary-700)" : "var(--p-text-color)"}; font-weight: ${selectedSource.has(it2.id) ? "600" : "normal"}; transition: all 0.15s ease;">
                                ${it2.name}
                            </div>
                        `).join("")}
                    </div>
                </div>

                <!-- Transfer Action Buttons -->
                <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                    <button type="button" class="btn-move-to-target p-button p-button-secondary" style="padding: 0.45rem; justify-content: center;" title="Move to Selected">
                        ${LucideIcons.chevronRight}
                    </button>
                    <button type="button" class="btn-move-all-to-target p-button p-button-secondary" style="padding: 0.45rem; justify-content: center;" title="Move All to Selected">
                        \xBB
                    </button>
                    <button type="button" class="btn-move-to-source p-button p-button-secondary" style="padding: 0.45rem; justify-content: center;" title="Move to Available">
                        ${LucideIcons.chevronLeft}
                    </button>
                    <button type="button" class="btn-move-all-to-source p-button p-button-secondary" style="padding: 0.45rem; justify-content: center;" title="Move All to Available">
                        \xAB
                    </button>
                </div>

                <!-- Target Box -->
                <div style="flex: 1; border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius-lg); background: var(--p-surface-0); overflow: hidden; display: flex; flex-direction: column;">
                    <div style="padding: 0.625rem 0.875rem; background: var(--p-surface-50); border-bottom: 1px solid var(--p-border-color); font-size: 0.75rem; font-weight: 700; color: var(--p-surface-600); text-transform: uppercase;">
                        ${props.targetHeader || "Selected"} (${targetList.length})
                    </div>
                    <div class="picklist-target-list" style="height: 180px; overflow-y: auto; padding: 0.25rem 0;">
                        ${targetList.map((it2) => `
                            <div class="picklist-item target-item ${selectedTarget.has(it2.id) ? "active" : ""}" data-id="${it2.id}" style="padding: 0.45rem 0.75rem; cursor: pointer; font-size: 0.8125rem; background: ${selectedTarget.has(it2.id) ? "var(--p-primary-50)" : "transparent"}; color: ${selectedTarget.has(it2.id) ? "var(--p-primary-700)" : "var(--p-text-color)"}; font-weight: ${selectedTarget.has(it2.id) ? "600" : "normal"}; transition: all 0.15s ease;">
                                ${it2.name}
                            </div>
                        `).join("")}
                    </div>
                </div>
            </div>
        `;
    const srcEl = container.querySelector(".picklist-source-list");
    const tgtEl = container.querySelector(".picklist-target-list");
    useAutoAnimate(srcEl, { duration: 200 });
    useAutoAnimate(tgtEl, { duration: 200 });
    bindEvents();
  }
  function bindEvents() {
    container.querySelectorAll(".source-item").forEach((el) => {
      el.addEventListener("click", () => {
        const id = el.getAttribute("data-id");
        if (selectedSource.has(id)) selectedSource.delete(id);
        else selectedSource.add(id);
        render();
      });
    });
    container.querySelectorAll(".target-item").forEach((el) => {
      el.addEventListener("click", () => {
        const id = el.getAttribute("data-id");
        if (selectedTarget.has(id)) selectedTarget.delete(id);
        else selectedTarget.add(id);
        render();
      });
    });
    container.querySelector(".btn-move-to-target")?.addEventListener("click", () => {
      const moving = sourceList.filter((it2) => selectedSource.has(it2.id));
      targetList = [...targetList, ...moving];
      sourceList = sourceList.filter((it2) => !selectedSource.has(it2.id));
      selectedSource.clear();
      render();
      syncValues();
    });
    container.querySelector(".btn-move-all-to-target")?.addEventListener("click", () => {
      targetList = [...targetList, ...sourceList];
      sourceList = [];
      selectedSource.clear();
      render();
      syncValues();
    });
    container.querySelector(".btn-move-to-source")?.addEventListener("click", () => {
      const moving = targetList.filter((it2) => selectedTarget.has(it2.id));
      sourceList = [...sourceList, ...moving];
      targetList = targetList.filter((it2) => !selectedTarget.has(it2.id));
      selectedTarget.clear();
      render();
      syncValues();
    });
    container.querySelector(".btn-move-all-to-source")?.addEventListener("click", () => {
      sourceList = [...sourceList, ...targetList];
      targetList = [];
      selectedTarget.clear();
      render();
      syncValues();
    });
  }
  function syncValues() {
    if (props.targetInputName) {
      let hidden = container.querySelector(`input[name="${props.targetInputName}"]`);
      if (!hidden) {
        hidden = document.createElement("input");
        hidden.type = "hidden";
        hidden.name = props.targetInputName;
        container.appendChild(hidden);
      }
      hidden.value = JSON.stringify(targetList.map((it2) => it2.id));
    }
    container.dispatchEvent(new CustomEvent("picklist:change", {
      bubbles: true,
      detail: { source: sourceList, target: targetList }
    }));
  }
  render();
  syncValues();
}

// src/components/orderlist.ts
function OrderListIsland(container, props) {
  let items = props.items ? [...props.items] : [
    { id: "1", name: "Phase 1: Zero-Trust Gateway Init", order: 0 },
    { id: "2", name: "Phase 2: Hydrate Islands Engine", order: 1 },
    { id: "3", name: "Phase 3: Verify Cryptographic Signatures", order: 2 },
    { id: "4", name: "Phase 4: Telemetry Stream Pipeline", order: 3 }
  ];
  let selectedIndex = 0;
  function render() {
    container.innerHTML = `
            <div class="laughtale-orderlist" style="display: flex; align-items: center; gap: 1rem; width: 100%; max-width: 480px; font-family: var(--p-font-family, inherit);">
                <!-- Reorder Controls -->
                <div style="display: flex; flex-direction: column; gap: 0.35rem;">
                    <button type="button" class="btn-order-top p-button p-button-secondary" style="padding: 0.45rem; justify-content: center;" title="Move to Top">\u21C8</button>
                    <button type="button" class="btn-order-up p-button p-button-secondary" style="padding: 0.45rem; justify-content: center;" title="Move Up">\u2191</button>
                    <button type="button" class="btn-order-down p-button p-button-secondary" style="padding: 0.45rem; justify-content: center;" title="Move Down">\u2193</button>
                    <button type="button" class="btn-order-bottom p-button p-button-secondary" style="padding: 0.45rem; justify-content: center;" title="Move to Bottom">\u21CA</button>
                </div>

                <!-- Items List Box -->
                <div style="flex: 1; border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius-lg); background: var(--p-surface-0); overflow: hidden; display: flex; flex-direction: column;">
                    ${props.header ? `<div style="padding: 0.625rem 0.875rem; background: var(--p-surface-50); border-bottom: 1px solid var(--p-border-color); font-size: 0.75rem; font-weight: 700; color: var(--p-surface-600); text-transform: uppercase;">${props.header}</div>` : ""}
                    <div class="orderlist-items-container" style="max-height: 220px; overflow-y: auto; padding: 0.25rem 0;">
                        ${items.map((it2, idx) => `
                            <div class="orderlist-item ${selectedIndex === idx ? "active" : ""}" data-index="${idx}" style="display: flex; align-items: center; justify-content: space-between; padding: 0.5rem 0.875rem; cursor: pointer; font-size: 0.8125rem; background: ${selectedIndex === idx ? "var(--p-primary-50)" : "transparent"}; color: ${selectedIndex === idx ? "var(--p-primary-700)" : "var(--p-text-color)"}; font-weight: ${selectedIndex === idx ? "600" : "normal"}; transition: all 0.15s ease;">
                                <span>${it2.name}</span>
                                <span style="font-family: monospace; font-size: 0.6875rem; color: var(--p-surface-400);">#${idx + 1}</span>
                            </div>
                        `).join("")}
                    </div>
                </div>
            </div>
        `;
    const itemsEl = container.querySelector(".orderlist-items-container");
    useAutoAnimate(itemsEl, { duration: 200 });
    bindEvents();
  }
  function bindEvents() {
    container.querySelectorAll(".orderlist-item").forEach((el) => {
      el.addEventListener("click", () => {
        selectedIndex = Number(el.getAttribute("data-index"));
        render();
      });
    });
    container.querySelector(".btn-order-top")?.addEventListener("click", () => {
      if (selectedIndex === null || selectedIndex <= 0) return;
      const it2 = items.splice(selectedIndex, 1)[0];
      items.unshift(it2);
      selectedIndex = 0;
      render();
      syncValues();
    });
    container.querySelector(".btn-order-up")?.addEventListener("click", () => {
      if (selectedIndex === null || selectedIndex <= 0) return;
      const target = selectedIndex - 1;
      const temp = items[target];
      items[target] = items[selectedIndex];
      items[selectedIndex] = temp;
      selectedIndex = target;
      render();
      syncValues();
    });
    container.querySelector(".btn-order-down")?.addEventListener("click", () => {
      if (selectedIndex === null || selectedIndex >= items.length - 1) return;
      const target = selectedIndex + 1;
      const temp = items[target];
      items[target] = items[selectedIndex];
      items[selectedIndex] = temp;
      selectedIndex = target;
      render();
      syncValues();
    });
    container.querySelector(".btn-order-bottom")?.addEventListener("click", () => {
      if (selectedIndex === null || selectedIndex >= items.length - 1) return;
      const it2 = items.splice(selectedIndex, 1)[0];
      items.push(it2);
      selectedIndex = items.length - 1;
      render();
      syncValues();
    });
  }
  function syncValues() {
    if (props.targetInputName) {
      let hidden = container.querySelector(`input[name="${props.targetInputName}"]`);
      if (!hidden) {
        hidden = document.createElement("input");
        hidden.type = "hidden";
        hidden.name = props.targetInputName;
        container.appendChild(hidden);
      }
      hidden.value = JSON.stringify(items.map((it2) => it2.id));
    }
    container.dispatchEvent(new CustomEvent("orderlist:change", {
      bubbles: true,
      detail: { items }
    }));
  }
  render();
  syncValues();
}

// src/components/terminal.ts
function TerminalIsland(container, props) {
  const promptPrefix = props.prompt || "admin@softmax:~$";
  const welcome = props.welcomeMessage || 'Welcome to SoftMax.LaughTale CLI v3.0\nType "help" for available commands.';
  const commands = {
    "help": "Available commands: help, clear, status, date, version, info",
    "status": "All Islands hydrated: 100% OK. System latency: 0.8ms.",
    "version": "SoftMax.LaughTale Framework v3.0 (.NET 10 & TS)",
    "info": "Architecture: SSR + Micro-Directives + Islands + Tailwind CSS v4",
    "date": (/* @__PURE__ */ new Date()).toISOString(),
    ...props.commands || {}
  };
  const history = [];
  function render() {
    container.innerHTML = `
            <div class="laughtale-terminal" style="background: #030712; color: #38bdf8; font-family: var(--p-font-mono, monospace); font-size: 0.8125rem; border-radius: var(--p-border-radius-lg); border: 1px solid #1f2937; box-shadow: var(--p-shadow-lg); padding: 1.25rem; width: 100%; max-width: 640px; min-height: 240px; display: flex; flex-direction: column; overflow: hidden;">
                <!-- Header Controls -->
                <div style="display: flex; align-items: center; gap: 0.45rem; margin-bottom: 0.875rem; border-bottom: 1px solid #1f2937; padding-bottom: 0.625rem;">
                    <span style="width: 10px; height: 10px; border-radius: 50%; background: #ef4444; display: inline-block;"></span>
                    <span style="width: 10px; height: 10px; border-radius: 50%; background: #f59e0b; display: inline-block;"></span>
                    <span style="width: 10px; height: 10px; border-radius: 50%; background: #10b981; display: inline-block;"></span>
                    <span style="color: #64748b; font-size: 0.6875rem; margin-left: 0.5rem;">bash \u2014 80x24</span>
                </div>

                <!-- History Log -->
                <div class="terminal-log" style="flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 0.35rem;">
                    <div style="color: #94a3b8; white-space: pre-wrap; margin-bottom: 0.5rem;">${welcome}</div>
                    ${history.map((h) => `
                        <div>
                            <div style="color: #4ade80;"><span style="color: #64748b;">${promptPrefix}</span> ${h.command}</div>
                            ${h.response ? `<div style="color: #e2e8f0; white-space: pre-wrap; margin-left: 0.5rem;">${h.response}</div>` : ""}
                        </div>
                    `).join("")}
                </div>

                <!-- Active Prompt Line -->
                <div style="display: flex; align-items: center; gap: 0.5rem; margin-top: 0.5rem;">
                    <span style="color: #4ade80; user-select: none;">${promptPrefix}</span>
                    <input type="text" class="terminal-input" style="flex: 1; background: transparent; border: none; outline: none; color: #f8fafc; font-family: inherit; font-size: inherit;" autofocus />
                </div>
            </div>
        `;
    const input = container.querySelector(".terminal-input");
    const log = container.querySelector(".terminal-log");
    log.scrollTop = log.scrollHeight;
    input.focus();
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        const cmd = input.value.trim();
        if (!cmd) return;
        if (cmd === "clear") {
          history.length = 0;
        } else {
          const resp = commands[cmd.toLowerCase()] || `Command not found: "${cmd}". Type "help" for a list of commands.`;
          history.push({ command: cmd, response: resp });
        }
        render();
      }
    });
  }
  render();
}

// src/components/blockui.ts
function BlockUIIsland(container, props) {
  let isBlocked = props.blocked ?? true;
  function render() {
    container.innerHTML = `
            <div class="laughtale-blockui-root" style="position: relative; width: 100%;">
                <!-- Blocked Glass Overlay -->
                <div class="blockui-mask" style="display: ${isBlocked ? "flex" : "none"}; position: absolute; inset: 0; z-index: 100; background: rgba(255, 255, 255, 0.65); backdrop-filter: blur(3px); align-items: center; justify-content: center; border-radius: inherit;">
                    <div style="display: flex; flex-direction: column; align-items: center; gap: 0.75rem; background: var(--p-surface-0); border: 1px solid var(--p-border-color); padding: 1rem 1.5rem; border-radius: var(--p-border-radius-lg); box-shadow: var(--p-shadow-md);">
                        <svg class="animate-spin" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="color: var(--p-primary-600); animation: spin 0.8s linear infinite;">
                            <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                        </svg>
                        <span style="font-size: 0.8125rem; font-weight: 600; color: var(--p-surface-700);">${props.message || "Processing transaction..."}</span>
                    </div>
                </div>
            </div>
        `;
  }
  render();
  container.addEventListener("blockui:toggle", () => {
    isBlocked = !isBlocked;
    render();
  });
}

// src/components/split-button.ts
function SplitButtonIsland(container, props) {
  const label = props.label || "Save";
  const items = props.model || [
    { label: "Update & Sync", icon: "refresh-cw", action: "update" },
    { label: "Export as Encrypted JSON", icon: "download", action: "export" },
    { label: "Delete Record", icon: "trash", action: "delete" }
  ];
  container.innerHTML = `
        <div class="laughtale-splitbutton" style="position: relative; display: inline-flex; border-radius: var(--p-border-radius); overflow: visible; font-family: var(--p-font-family, inherit);">
            <!-- Primary Action Button -->
            <button type="button" class="splitbutton-main-btn p-button p-button-primary" style="border-top-right-radius: 0; border-bottom-right-radius: 0; border-right: 1px solid rgba(255,255,255,0.2);">
                ${label}
            </button>

            <!-- Dropdown Menu Trigger Button -->
            <button type="button" class="splitbutton-menu-btn p-button p-button-primary" style="border-top-left-radius: 0; border-bottom-left-radius: 0; padding: 0.5rem 0.5rem; justify-content: center;">
                <span class="splitbutton-chevron" style="display: flex;">${LucideIcons.chevronDown}</span>
            </button>

            <!-- Popover Menu -->
            <div class="splitbutton-menu-overlay" style="display: none; position: absolute; top: calc(100% + 4px); right: 0; z-index: 500; background: var(--p-surface-0); border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius-lg); box-shadow: var(--p-shadow-lg); min-width: 180px; padding: 0.25rem 0;">
                ${items.map((it2) => `
                    <div class="splitbutton-menu-item" data-action="${it2.action || ""}" data-url="${it2.url || ""}" style="display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 0.875rem; cursor: pointer; font-size: 0.8125rem; color: var(--p-text-color); transition: background 0.1s ease;">
                        <span>${it2.label}</span>
                    </div>
                `).join("")}
            </div>
        </div>
    `;
  const mainBtn = container.querySelector(".splitbutton-main-btn");
  const menuBtn = container.querySelector(".splitbutton-menu-btn");
  const overlay = container.querySelector(".splitbutton-menu-overlay");
  const disclosure = useDisclosure({
    defaultIsOpen: false,
    onOpen: () => {
      useTransition(overlay, { type: "fade", isMounted: true });
    },
    onClose: () => {
      useTransition(overlay, { type: "fade", isMounted: false });
    }
  });
  useClickOutside(container, () => disclosure.close());
  mainBtn.addEventListener("click", () => {
    container.dispatchEvent(new CustomEvent("splitbutton:click", {
      bubbles: true,
      detail: { action: "main" }
    }));
  });
  menuBtn.addEventListener("click", () => {
    disclosure.toggle();
  });
  container.querySelectorAll(".splitbutton-menu-item").forEach((itemEl) => {
    itemEl.addEventListener("click", () => {
      const action = itemEl.getAttribute("data-action");
      const url = itemEl.getAttribute("data-url");
      if (url) window.location.href = url;
      container.dispatchEvent(new CustomEvent("splitbutton:item-click", {
        bubbles: true,
        detail: { action }
      }));
      disclosure.close();
    });
  });
}

// tests/new-components.test.ts
describe("SoftMax.LaughTale Dynamic Form & New Aura Components Suite", () => {
  let container;
  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });
  it("DynamicForm: renders form fields from schema and validates requirements", () => {
    DynamicFormIsland(container, {
      schema: {
        title: "User Profile",
        fields: [
          { name: "username", label: "Username", fieldType: "Text", isRequired: true },
          { name: "email", label: "Email", fieldType: "Email", isRequired: true }
        ]
      }
    });
    const inputs = container.querySelectorAll("input");
    assert.equal(inputs.length, 2);
    const form = container.querySelector("form");
    form.dispatchEvent(new Event("submit"));
    const errorMsgs = container.querySelectorAll(".form-group span");
    assert.ok(errorMsgs.length > 0, "Should display validation error messages when required fields are empty");
  });
  it("Splitter: initializes two resizable panels with divider gutter", () => {
    SplitterIsland(container, {
      layout: "horizontal",
      panels: [
        { id: "1", size: 40, content: "Left Side" },
        { id: "2", size: 60, content: "Right Side" }
      ]
    });
    const panel1 = container.querySelector(".splitter-panel-1");
    const gutter = container.querySelector(".splitter-gutter");
    assert.ok(panel1);
    assert.ok(gutter);
  });
  it("MultiSelect: selects items and syncs value array", () => {
    MultiSelectIsland(container, {
      options: [
        { label: "Admin", value: "admin" },
        { label: "Editor", value: "editor" }
      ],
      targetInputName: "roles"
    });
    const trigger = container.querySelector(".multiselect-trigger");
    trigger.click();
    const item = container.querySelector(".multiselect-item");
    item.click();
    const hidden = container.querySelector('input[name="roles"]');
    assert.ok(hidden.value.includes("admin"));
  });
  it("Listbox: selects and highlights list option", () => {
    ListboxIsland(container, {
      options: [
        { label: "Option A", value: "a" },
        { label: "Option B", value: "b" }
      ]
    });
    let items = container.querySelectorAll(".listbox-item");
    assert.equal(items.length, 2);
    items[0].click();
    const updatedItems = container.querySelectorAll(".listbox-item");
    assert.ok(updatedItems[0].style.color.includes("var(--p-primary-700)"));
  });
  it("PickList: transfers item between source and target lists", () => {
    PickListIsland(container, {
      source: [{ id: "1", name: "Item 1" }],
      target: []
    });
    const sourceItem = container.querySelector(".source-item");
    sourceItem.click();
    const moveBtn = container.querySelector(".btn-move-to-target");
    moveBtn.click();
    assert.equal(container.querySelectorAll(".target-item").length, 1);
  });
  it("OrderList: reorders list items with controls", () => {
    OrderListIsland(container, {
      items: [
        { id: "1", name: "First", order: 0 },
        { id: "2", name: "Second", order: 1 }
      ]
    });
    const downBtn = container.querySelector(".btn-order-down");
    downBtn.click();
    const firstItemText = container.querySelector(".orderlist-item").textContent;
    assert.ok(firstItemText.includes("Second"));
  });
  it("Terminal: executes command and outputs response", () => {
    TerminalIsland(container, {
      welcomeMessage: "CLI Test",
      commands: { "ping": "pong" }
    });
    const input = container.querySelector(".terminal-input");
    input.value = "ping";
    input.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
    const log = container.querySelector(".terminal-log");
    assert.ok(log.textContent.includes("pong"));
  });
  it("BlockUI: renders blocked glass mask overlay", () => {
    BlockUIIsland(container, { blocked: true, message: "Loading Test..." });
    const mask = container.querySelector(".blockui-mask");
    assert.equal(mask.style.display, "flex");
  });
  it("SplitButton: handles main click and dropdown menu trigger", () => {
    let clicked = false;
    container.addEventListener("splitbutton:click", () => {
      clicked = true;
    });
    SplitButtonIsland(container, { label: "Save Action" });
    const mainBtn = container.querySelector(".splitbutton-main-btn");
    mainBtn.click();
    assert.equal(clicked, true);
  });
});
