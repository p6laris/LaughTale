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

// tests/new-components.test.ts
import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";

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

// src/components/dynamic-form.ts
var CSS = `
[data-theme="dark"] .p-input {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
[data-theme="dark"] .form-field-input {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
[data-theme="dark"] .form-field-checkbox {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
[data-theme="dark"] .laughtale-dynamic-form {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
`;
function DynamicFormIsland(container, props) {
  injectIslandStyle("dynamic-form", CSS);
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
var CSS2 = `
[data-theme="dark"] .laughtale-splitter {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
[data-theme="dark"] .splitter-panel-1 {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
[data-theme="dark"] .splitter-gutter {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
[data-theme="dark"] .splitter-panel-2 {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
`;
function SplitterIsland(container, props) {
  injectIslandStyle("splitter", CSS2);
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
var CSS3 = `
[data-theme="dark"] .laughtale-multiselect {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
[data-theme="dark"] .multiselect-trigger {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
[data-theme="dark"] .p-input {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
[data-theme="dark"] .multiselect-label-container {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
[data-theme="dark"] .multiselect-clear-btn {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
[data-theme="dark"] .multiselect-chevron {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
[data-theme="dark"] .multiselect-overlay {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
[data-theme="dark"] .multiselect-filter-input {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
[data-theme="dark"] .multiselect-select-all {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
[data-theme="dark"] .multiselect-items-list {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
[data-theme="dark"] .chip-remove-btn {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
[data-theme="dark"] .multiselect-item {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
`;
function MultiSelectIsland(container, props) {
  injectIslandStyle("multiselect", CSS3);
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

// src/components/listbox.ts
var CSS4 = `
/* ==================== AURA LISTBOX ==================== */
.laughtale-listbox,
.p-listbox {
    display: inline-flex;
    flex-direction: column;
    background: var(--p-surface-0);
    color: var(--p-text-color);
    border: 1px solid var(--p-border-color);
    border-radius: var(--p-border-radius);
    font-family: var(--p-font-family, inherit);
    box-sizing: border-box;
    overflow: hidden;
    outline: none;
    transition: background 150ms ease, border-color 150ms ease, box-shadow 150ms ease;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.02);
    width: 100%;
    max-width: 280px;
}

.p-listbox.p-listbox-fluid {
    width: 100%;
    max-width: 100%;
}

.p-listbox.is-focused,
.p-listbox:focus-within {
    border-color: var(--p-primary-500) !important;
}

/* Filled Variant */
.p-listbox.variant-filled {
    background-color: var(--p-surface-100);
    border-color: transparent;
}
.p-listbox.variant-filled.is-focused {
    background-color: var(--p-surface-0);
    border-color: var(--p-primary-500) !important;
}

/* Sizes */
.p-listbox.size-small,
.p-listbox.p-listbox-sm {
    font-size: 0.75rem;
}
.p-listbox.size-small .p-listbox-option {
    padding: 0.3125rem 0.5rem;
}
.p-listbox.size-large,
.p-listbox.p-listbox-lg {
    font-size: 1rem;
}
.p-listbox.size-large .p-listbox-option {
    padding: 0.625rem 1rem;
}

/* Invalid State */
.p-listbox.is-invalid {
    border-color: var(--p-red-500, #ef4444) !important;
}

/* Disabled State */
.p-listbox.is-disabled {
    opacity: 0.65;
    cursor: not-allowed;
    background-color: var(--p-surface-100);
}
.p-listbox.is-disabled .p-listbox-option {
    cursor: not-allowed;
    pointer-events: none;
}

/* Header & Footer */
.p-listbox-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.625rem 0.875rem;
    background: var(--p-surface-50);
    border-bottom: 1px solid var(--p-border-color);
    font-size: 0.8125rem;
    font-weight: 700;
    color: var(--p-text-color);
}
.p-listbox-header-count {
    font-size: 0.75rem;
    font-weight: 500;
    color: var(--p-text-muted);
}
.p-listbox-footer {
    padding: 0.5rem 0.875rem;
    background: var(--p-surface-50);
    border-top: 1px solid var(--p-border-color);
    font-size: 0.75rem;
    color: var(--p-text-muted);
}

/* Filter */
.p-listbox-filter-container {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 0.75rem;
    background: var(--p-surface-50);
    border-bottom: 1px solid var(--p-border-color);
}
.p-listbox-filter-input {
    flex: 1;
    width: 100%;
    font-family: inherit;
    font-size: 0.8125rem;
    padding: 0.3125rem 0.5rem;
    background: var(--p-surface-0);
    border: 1px solid var(--p-border-color);
    border-radius: calc(var(--p-border-radius) - 2px);
    color: var(--p-text-color);
    outline: none;
    box-sizing: border-box;
}
.p-listbox-filter-input:focus {
    border-color: var(--p-primary-500);
}

/* Options List Container */
.p-listbox-list-wrapper {
    overflow-y: auto;
    outline: none;
}
.p-listbox-list {
    margin: 0;
    padding: 0.25rem 0;
    list-style: none;
}

/* Option Groups */
.p-listbox-option-group {
    list-style: none;
    margin: 0;
    padding: 0;
}
.p-listbox-option-group-label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 0.875rem;
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--p-text-muted);
    background: var(--p-surface-50);
}

/* Option Items */
.p-listbox-option {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.5rem 0.875rem;
    cursor: pointer;
    font-size: 0.8125rem;
    color: var(--p-text-color);
    background: transparent;
    transition: background 150ms ease, color 150ms ease;
    user-select: none;
    outline: none;
}

.p-listbox-option:hover:not(.p-disabled) {
    background: var(--p-surface-100);
    color: var(--p-text-color);
}

.p-listbox-option.p-highlight {
    background: var(--p-primary-50, #ecfdf5);
    color: var(--p-primary-700, #047857);
    font-weight: 600;
}
.p-listbox-option.p-highlight:hover:not(.p-disabled) {
    background: var(--p-primary-100, #d1fae5);
    color: var(--p-primary-800, #065f46);
}

.p-listbox-option.p-highlight-none {
    background: transparent !important;
    color: var(--p-text-color) !important;
    font-weight: normal !important;
}
.p-listbox-option.p-highlight-none:hover:not(.p-disabled) {
    background: var(--p-surface-100) !important;
}

.p-listbox-option.p-focus {
    box-shadow: inset 0 0 0 1px var(--p-primary-500);
}

.p-listbox-option.p-disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

/* Striped Listbox */
.p-listbox-striped .p-listbox-option:nth-child(even):not(.p-highlight) {
    background: var(--p-surface-50);
}

/* Option Content */
.p-listbox-option-content {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.p-listbox-option-badge {
    font-size: 0.6875rem;
    font-weight: 700;
    padding: 0.125rem 0.375rem;
    border-radius: calc(var(--p-border-radius) - 2px);
    background: var(--p-surface-100);
    color: var(--p-surface-700);
}
.p-listbox-option.p-highlight .p-listbox-option-badge {
    background: var(--p-primary-100);
    color: var(--p-primary-800);
}

/* Option Checkbox */
.p-listbox-option-checkbox {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 1.125rem;
    height: 1.125rem;
    border: 1px solid var(--p-border-color);
    border-radius: 4px;
    background: var(--p-surface-0);
    margin-right: 0.5rem;
    transition: all 150ms ease;
    flex-shrink: 0;
}
.p-listbox-option.p-highlight .p-listbox-option-checkbox {
    background: var(--p-primary-500);
    border-color: var(--p-primary-500);
    color: #ffffff;
}

/* Option Checkmark Icon */
.p-listbox-option-checkmark {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: var(--p-primary-600);
    margin-left: 0.5rem;
    flex-shrink: 0;
}

/* ==================== DARK MODE ==================== */
.dark .p-listbox {
    background: var(--p-surface-900);
    color: var(--p-surface-0);
    border-color: var(--p-surface-700);
}
.dark .p-listbox.variant-filled {
    background-color: var(--p-surface-800);
}
.dark .p-listbox.variant-filled.is-focused {
    background-color: var(--p-surface-900);
}
.dark .p-listbox-header,
.dark .p-listbox-footer,
.dark .p-listbox-filter-container,
.dark .p-listbox-option-group-label {
    background: var(--p-surface-850, #141b26);
    border-color: var(--p-surface-700);
}
.dark .p-listbox-filter-input {
    background: var(--p-surface-900);
    border-color: var(--p-surface-700);
    color: var(--p-surface-0);
}
.dark .p-listbox-option {
    color: var(--p-surface-100);
}
.dark .p-listbox-option:hover:not(.p-disabled) {
    background: var(--p-surface-800);
    color: var(--p-surface-0);
}
.dark .p-listbox-option.p-highlight {
    background: rgba(16, 185, 129, 0.16);
    color: var(--p-primary-300, #6ee7b7);
}
.dark .p-listbox-option.p-highlight:hover:not(.p-disabled) {
    background: rgba(16, 185, 129, 0.24);
    color: var(--p-primary-200, #a7f3d0);
}
.dark .p-listbox-option-badge {
    background: var(--p-surface-800);
    color: var(--p-surface-200);
}
.dark .p-listbox-option.p-highlight .p-listbox-option-badge {
    background: rgba(16, 185, 129, 0.25);
    color: var(--p-primary-200);
}
.dark .p-listbox-option-checkbox {
    background: var(--p-surface-900);
    border-color: var(--p-surface-600);
}
.dark .p-listbox-option-checkmark {
    color: var(--p-primary-400);
}
.dark .p-listbox-striped .p-listbox-option:nth-child(even):not(.p-highlight) {
    background: var(--p-surface-850, #141b26);
}
`;
var checkSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;
var searchSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`;
function ListboxIsland(container, props) {
  injectIslandStyle("laughtale-listbox", CSS4);
  const isMultiple = props.multiple === true || String(props.multiple) === "true";
  const isMetaKey = props.metaKeySelection !== false && String(props.metaKeySelection) !== "false";
  const isCheckbox = props.checkbox === true || String(props.checkbox) === "true";
  const isCheckmark = props.checkmark === true || String(props.checkmark) === "true";
  const isHighlightOnSelect = props.highlightOnSelect !== false && String(props.highlightOnSelect) !== "false";
  const isFilter = props.filter === true || String(props.filter) === "true";
  const isFluid = props.fluid === true || String(props.fluid) === "true";
  const isInvalid = props.invalid === true || String(props.invalid) === "true";
  const isDisabled = props.disabled === true || String(props.disabled) === "true";
  const isStriped = props.striped === true || String(props.striped) === "true";
  const isFilled = props.variant === "filled";
  const size = props.size || "normal";
  const scrollHeight = props.scrollHeight || "220px";
  function normalizeOptions(opts) {
    return (opts || []).map((opt) => {
      if (typeof opt === "string") {
        return { label: opt, value: opt };
      }
      return {
        label: opt.label || opt.name || String(opt.value || ""),
        value: opt.value !== void 0 ? opt.value : opt.code || opt.name || opt.label,
        code: opt.code,
        name: opt.name,
        icon: opt.icon,
        flag: opt.flag,
        badge: opt.badge,
        description: opt.description,
        disabled: opt.disabled,
        items: opt.items ? normalizeOptions(opt.items) : void 0
      };
    });
  }
  const rawOptions = normalizeOptions(props.options || []);
  const selectedValues = /* @__PURE__ */ new Set();
  const initialVal = props.value ?? props.selectedValue;
  if (initialVal !== void 0 && initialVal !== null) {
    if (Array.isArray(initialVal)) {
      initialVal.forEach((v) => selectedValues.add(typeof v === "object" && v !== null ? String(v.value || v.code || v.name) : String(v)));
    } else if (typeof initialVal === "string") {
      try {
        const parsed = JSON.parse(initialVal);
        if (Array.isArray(parsed)) parsed.forEach((v) => selectedValues.add(String(v)));
        else selectedValues.add(initialVal);
      } catch {
        selectedValues.add(initialVal);
      }
    } else {
      selectedValues.add(String(initialVal));
    }
  }
  let searchQuery = "";
  let focusedIndex = -1;
  function getFlatVisibleOptions() {
    const flat = [];
    const q = searchQuery.toLowerCase().trim();
    function matches(item) {
      if (!q) return true;
      if (props.filterMatchMode === "startsWith") {
        return item.label.toLowerCase().startsWith(q) || item.code && item.code.toLowerCase().startsWith(q);
      }
      return item.label.toLowerCase().includes(q) || item.code && item.code.toLowerCase().includes(q);
    }
    for (const opt of rawOptions) {
      if (opt.items && opt.items.length > 0) {
        const filteredChildren = opt.items.filter(matches);
        if (filteredChildren.length > 0) {
          flat.push(...filteredChildren);
        }
      } else if (matches(opt)) {
        flat.push(opt);
      }
    }
    return flat;
  }
  function init() {
    const rootClasses = [
      "laughtale-listbox",
      "p-listbox",
      isFluid ? "p-listbox-fluid" : "",
      isFilled ? "variant-filled" : "",
      isStriped ? "p-listbox-striped" : "",
      size !== "normal" ? `size-${size}` : "",
      isInvalid ? "is-invalid" : "",
      isDisabled ? "is-disabled" : ""
    ].filter(Boolean).join(" ");
    container.className = rootClasses;
    container.setAttribute("tabindex", isDisabled ? "-1" : "0");
    container.setAttribute("role", "listbox");
    container.setAttribute("aria-multiselectable", isMultiple ? "true" : "false");
    if (props.inputId) container.id = props.inputId;
    container.innerHTML = `
            ${props.header ? `
                <div class="p-listbox-header">
                    <span>${props.header}</span>
                    ${props.headerCount ? `<span class="p-listbox-header-count">${props.headerCount}</span>` : ""}
                </div>
            ` : ""}
            ${isFilter ? `
                <div class="p-listbox-filter-container">
                    <span style="color: var(--p-surface-400); display: flex;">${searchSvg}</span>
                    <input type="text" class="p-listbox-filter-input" placeholder="${props.filterPlaceholder || "Filter..."}" ${isDisabled ? "disabled" : ""} />
                </div>
            ` : ""}
            <div class="p-listbox-list-wrapper" style="max-height: ${scrollHeight};">
                <ul class="p-listbox-list" role="presentation"></ul>
            </div>
            ${props.footer ? `
                <div class="p-listbox-footer">${props.footer}</div>
            ` : ""}
            <input type="hidden" name="${props.name || props.targetInputName || "listbox_value"}" value="" />
        `;
    renderOptions();
    bindEvents();
    syncValue();
  }
  function renderOptions() {
    const listEl = container.querySelector(".p-listbox-list");
    const q = searchQuery.toLowerCase().trim();
    function matches(item) {
      if (!q) return true;
      if (props.filterMatchMode === "startsWith") {
        return item.label.toLowerCase().startsWith(q) || item.code && item.code.toLowerCase().startsWith(q);
      }
      return item.label.toLowerCase().includes(q) || item.code && item.code.toLowerCase().includes(q);
    }
    const isGrouped = rawOptions.some((o) => o.items && o.items.length > 0);
    if (isGrouped) {
      let html = "";
      let totalRendered = 0;
      for (const group of rawOptions) {
        const groupItems = group.items ? group.items.filter(matches) : [];
        if (groupItems.length === 0 && !matches(group)) continue;
        html += `
                    <li class="p-listbox-option-group" role="group">
                        <div class="p-listbox-option-group-label">
                            ${group.flag ? `<span style="font-size: 1.1rem; line-height: 1;">${group.flag}</span>` : ""}
                            ${group.icon ? `<span style="display: flex;">${getLucideIcon(group.icon, 14)}</span>` : ""}
                            <span>${group.label}</span>
                        </div>
                        <ul style="margin: 0; padding: 0; list-style: none;">
                            ${groupItems.map((item) => renderSingleOptionHtml(item)).join("")}
                        </ul>
                    </li>
                `;
        totalRendered += groupItems.length;
      }
      if (totalRendered === 0) {
        listEl.innerHTML = `<li style="padding: 1rem; text-align: center; color: var(--p-text-muted); font-size: 0.8125rem;">No results found</li>`;
      } else {
        listEl.innerHTML = html;
      }
    } else {
      const visible = rawOptions.filter(matches);
      if (visible.length === 0) {
        listEl.innerHTML = `<li style="padding: 1rem; text-align: center; color: var(--p-text-muted); font-size: 0.8125rem;">No results found</li>`;
      } else {
        listEl.innerHTML = visible.map((item) => renderSingleOptionHtml(item)).join("");
      }
    }
    bindItemEvents();
  }
  function renderSingleOptionHtml(item) {
    const valStr = String(item.value);
    const isSelected = selectedValues.has(valStr);
    const highlightClass = isSelected ? isHighlightOnSelect ? "p-highlight" : "p-highlight-none" : "";
    const disabledClass = item.disabled ? "p-disabled" : "";
    let checkboxHtml = "";
    if (isCheckbox && isMultiple) {
      checkboxHtml = `
                <span class="p-listbox-option-checkbox" aria-hidden="true">
                    ${isSelected ? checkSvg : ""}
                </span>
            `;
    }
    let checkmarkHtml = "";
    if (isCheckmark && isSelected) {
      checkmarkHtml = `
                <span class="p-listbox-option-checkmark" aria-hidden="true">
                    ${checkSvg}
                </span>
            `;
    }
    let leadingHtml = "";
    if (item.flag) {
      leadingHtml = `<span style="font-size: 1.1rem; line-height: 1; flex-shrink: 0;">${item.flag}</span>`;
    } else if (item.icon) {
      leadingHtml = `<span style="display: flex; flex-shrink: 0; color: var(--p-primary-600);">${getLucideIcon(item.icon, 16)}</span>`;
    }
    let trailingHtml = "";
    if (item.code) {
      trailingHtml = `<span class="p-listbox-option-badge">${item.code}</span>`;
    } else if (item.badge) {
      trailingHtml = `<span class="p-listbox-option-badge">${item.badge}</span>`;
    }
    return `
            <li class="p-listbox-option ${highlightClass} ${disabledClass}" role="option" aria-selected="${isSelected}" aria-disabled="${item.disabled ? "true" : "false"}" data-val="${valStr}" tabindex="-1">
                <div class="p-listbox-option-content">
                    ${checkboxHtml}
                    ${leadingHtml}
                    <span>${item.label}</span>
                </div>
                ${trailingHtml}
                ${checkmarkHtml}
            </li>
        `;
  }
  function bindItemEvents() {
    const items = container.querySelectorAll(".p-listbox-option");
    items.forEach((itemEl, idx) => {
      itemEl.addEventListener("click", (e) => {
        if (isDisabled || itemEl.classList.contains("p-disabled")) return;
        const val = itemEl.getAttribute("data-val");
        handleSelect(val, e);
      });
      if (props.focusOnHover) {
        itemEl.addEventListener("mouseenter", () => {
          if (!isDisabled && !itemEl.classList.contains("p-disabled")) {
            updateFocus(idx);
          }
        });
      }
    });
  }
  function handleSelect(valStr, e) {
    const isCtrlOrCmd = e && (e.ctrlKey || e.metaKey);
    if (isMultiple) {
      if (isMetaKey && !isCtrlOrCmd && !isCheckbox) {
        selectedValues.clear();
        selectedValues.add(valStr);
      } else {
        if (selectedValues.has(valStr)) selectedValues.delete(valStr);
        else selectedValues.add(valStr);
      }
    } else {
      selectedValues.clear();
      selectedValues.add(valStr);
    }
    renderOptions();
    syncValue();
  }
  function updateFocus(idx) {
    const visible = container.querySelectorAll(".p-listbox-option");
    visible.forEach((el, i) => {
      if (i === idx) el.classList.add("p-focus");
      else el.classList.remove("p-focus");
    });
    focusedIndex = idx;
  }
  function bindEvents() {
    const filterInp = container.querySelector(".p-listbox-filter-input");
    if (filterInp) {
      const debouncedSearch = useDebounce(() => {
        searchQuery = filterInp.value;
        renderOptions();
      }, 150);
      filterInp.addEventListener("input", () => debouncedSearch());
    }
    container.addEventListener("focus", () => {
      container.classList.add("is-focused");
      if (props.autoOptionFocus !== false && focusedIndex === -1) {
        updateFocus(0);
      }
    });
    container.addEventListener("blur", (e) => {
      if (!container.contains(e.relatedTarget)) {
        container.classList.remove("is-focused");
        const visible = container.querySelectorAll(".p-listbox-option");
        visible.forEach((el) => el.classList.remove("p-focus"));
      }
    });
    container.addEventListener("keydown", (e) => {
      if (isDisabled) return;
      const visible = container.querySelectorAll(".p-listbox-option");
      if (visible.length === 0) return;
      if (e.key === "ArrowDown") {
        e.preventDefault();
        const next = Math.min(focusedIndex + 1, visible.length - 1);
        updateFocus(next);
        visible[next]?.scrollIntoView({ block: "nearest" });
        if (props.selectOnFocus && !isMultiple) {
          const val = visible[next]?.getAttribute("data-val");
          handleSelect(val, e);
        }
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        const prev = Math.max(focusedIndex - 1, 0);
        updateFocus(prev);
        visible[prev]?.scrollIntoView({ block: "nearest" });
        if (props.selectOnFocus && !isMultiple) {
          const val = visible[prev]?.getAttribute("data-val");
          handleSelect(val, e);
        }
      } else if (e.key === "Home") {
        e.preventDefault();
        updateFocus(0);
        visible[0]?.scrollIntoView({ block: "nearest" });
      } else if (e.key === "End") {
        e.preventDefault();
        updateFocus(visible.length - 1);
        visible[visible.length - 1]?.scrollIntoView({ block: "nearest" });
      } else if (e.key === " " || e.key === "Enter") {
        if (focusedIndex >= 0 && focusedIndex < visible.length) {
          e.preventDefault();
          const val = visible[focusedIndex]?.getAttribute("data-val");
          handleSelect(val, e);
        }
      } else if (e.key === "a" && (e.ctrlKey || e.metaKey) && isMultiple) {
        e.preventDefault();
        visible.forEach((el) => {
          const v = el.getAttribute("data-val");
          selectedValues.add(v);
        });
        renderOptions();
        syncValue();
      }
    });
  }
  function syncValue() {
    const hiddenInp = container.querySelector(`input[name="${props.name || props.targetInputName || "listbox_value"}"]`);
    const valArray = Array.from(selectedValues);
    const payload = isMultiple ? valArray : valArray[0] || null;
    if (hiddenInp) {
      hiddenInp.value = isMultiple ? JSON.stringify(valArray) : valArray[0] || "";
    }
    container.dispatchEvent(new CustomEvent("listbox:change", {
      bubbles: true,
      detail: { value: payload, selectedValues: valArray }
    }));
    container.dispatchEvent(new CustomEvent("change", {
      bubbles: true,
      detail: { value: payload }
    }));
  }
  init();
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
var PICKLIST_CSS = `
.p-picklist {
    display: flex;
    align-items: center;
    gap: 1.25rem;
    width: 100%;
    font-family: var(--p-font-family, inherit);
    color: var(--p-surface-800, #1e293b);
}

.p-picklist-controls {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 0.5rem;
    flex-shrink: 0;
}

.p-picklist-control-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2.25rem;
    height: 2.25rem;
    padding: 0;
    border-radius: var(--p-border-radius, 6px);
    border: 1px solid var(--p-surface-300, #cbd5e1);
    background: var(--p-surface-0, #ffffff);
    color: var(--p-surface-700, #334155);
    cursor: pointer;
    transition: all 0.15s ease;
    outline: none;
}
.p-picklist-control-btn:hover:not(:disabled) {
    background: var(--p-surface-100, #f1f5f9);
    color: var(--p-surface-900, #0f172a);
    border-color: var(--p-surface-400, #94a3b8);
}
.p-picklist-control-btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
}

.p-picklist-list-container {
    flex: 1 1 0;
    display: flex;
    flex-direction: column;
    border: 1px solid var(--p-surface-200, #e2e8f0);
    border-radius: var(--p-border-radius-lg, 8px);
    background: var(--p-surface-0, #ffffff);
    overflow: hidden;
    min-width: 0;
    box-shadow: var(--p-shadow-xs, 0 1px 2px 0 rgba(0, 0, 0, 0.05));
}

.p-picklist-header {
    padding: 0.75rem 1rem;
    background: var(--p-surface-50, #f8fafc);
    border-bottom: 1px solid var(--p-surface-200, #e2e8f0);
    font-size: 0.875rem;
    font-weight: 700;
    color: var(--p-surface-800, #1e293b);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
}

.p-picklist-filter-container {
    padding: 0.5rem 0.75rem;
    background: var(--p-surface-50, #f8fafc);
    border-bottom: 1px solid var(--p-surface-200, #e2e8f0);
    position: relative;
    display: flex;
    align-items: center;
}
.p-picklist-filter-input {
    width: 100%;
    padding: 0.4rem 2rem 0.4rem 0.65rem;
    font-size: 0.8125rem;
    border: 1px solid var(--p-surface-300, #cbd5e1);
    border-radius: var(--p-border-radius, 6px);
    background: var(--p-surface-0, #ffffff);
    color: inherit;
    outline: none;
    transition: border-color 0.15s ease, box-shadow 0.15s ease;
}
.p-picklist-filter-input:focus {
    border-color: var(--p-primary-500, #10b981);
    box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.2);
}
.p-picklist-filter-icon {
    position: absolute;
    right: 1.25rem;
    color: var(--p-surface-400, #94a3b8);
    pointer-events: none;
    display: flex;
    align-items: center;
}

.p-picklist-list {
    list-style: none;
    margin: 0;
    padding: 0.25rem 0;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
}

.p-picklist-item {
    padding: 0.625rem 1rem;
    margin: 0.125rem 0.25rem;
    border-radius: var(--p-border-radius-xs, 5px);
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-size: 0.875rem;
    color: var(--p-surface-700, #334155);
    user-select: none;
    transition: background-color 0.15s ease, color 0.15s ease;
}
.p-picklist-item:hover:not(.p-highlight) {
    background: var(--p-surface-100, #f1f5f9);
    color: var(--p-surface-900, #0f172a);
}
.p-picklist-item.p-highlight {
    background: rgba(16, 185, 129, 0.1) !important;
    color: var(--p-primary-700, #047857) !important;
    font-weight: 600;
}

/* Custom Checkbox */
.p-checkbox-box {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 1.125rem;
    height: 1.125rem;
    border-radius: var(--p-border-radius-xs, 4px);
    border: 2px solid var(--p-surface-300, #cbd5e1);
    background: var(--p-surface-0, #ffffff);
    cursor: pointer;
    transition: all 0.15s ease;
    flex-shrink: 0;
}
.p-checkbox-box.p-checked {
    background: var(--p-primary-500, #10b981);
    border-color: var(--p-primary-500, #10b981);
    color: #ffffff;
}
.p-checkbox-box.p-indeterminate {
    background: var(--p-primary-500, #10b981);
    border-color: var(--p-primary-500, #10b981);
    color: #ffffff;
}

/* Custom Item Content */
.p-picklist-product-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    width: 100%;
}
.p-picklist-product-img {
    width: 2.75rem;
    height: 2.75rem;
    border-radius: 6px;
    background: var(--p-surface-100, #f1f5f9);
    border: 1px solid var(--p-surface-200, #e2e8f0);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--p-primary-600, #059669);
    flex-shrink: 0;
}
.p-picklist-product-details {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
    min-width: 0;
}
.p-picklist-product-name {
    font-weight: 600;
    font-size: 0.875rem;
    color: var(--p-surface-900, #0f172a);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
.p-picklist-product-category {
    font-size: 0.75rem;
    color: var(--p-surface-500, #64748b);
}
.p-picklist-product-price {
    font-weight: 700;
    font-size: 0.875rem;
    color: var(--p-surface-900, #0f172a);
}

.p-picklist-member-item {
    display: flex;
    align-items: center;
    gap: 0.65rem;
    width: 100%;
}
.p-picklist-member-avatar {
    width: 2rem;
    height: 2rem;
    border-radius: 9999px;
    background: var(--p-primary-100, #d1fae5);
    color: var(--p-primary-700, #047857);
    font-weight: 700;
    font-size: 0.75rem;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

/* Empty State */
.p-picklist-empty {
    padding: 2.5rem 1rem;
    text-align: center;
    color: var(--p-surface-400, #94a3b8);
    font-size: 0.8125rem;
    font-style: italic;
}

/* Striped Rows */
.p-picklist-striped .p-picklist-item:nth-child(even):not(.p-highlight) {
    background: var(--p-surface-50, #f8fafc);
}

/* Dark Mode Tokens */
.dark .p-picklist,
[data-theme="dark"] .p-picklist {
    color: var(--p-surface-100, #f1f5f9) !important;
}
.dark .p-picklist-list-container,
[data-theme="dark"] .p-picklist-list-container {
    background: var(--p-surface-900, #0f172a) !important;
    border-color: var(--p-surface-700, #334155) !important;
}
.dark .p-picklist-header,
.dark .p-picklist-filter-container,
[data-theme="dark"] .p-picklist-header,
[data-theme="dark"] .p-picklist-filter-container {
    background: var(--p-surface-800, #1e293b) !important;
    border-color: var(--p-surface-700, #334155) !important;
    color: var(--p-surface-100, #f1f5f9) !important;
}
.dark .p-picklist-filter-input,
[data-theme="dark"] .p-picklist-filter-input {
    background: var(--p-surface-900, #0f172a) !important;
    border-color: var(--p-surface-600, #475569) !important;
    color: #ffffff !important;
}
.dark .p-picklist-control-btn,
[data-theme="dark"] .p-picklist-control-btn {
    background: var(--p-surface-800, #1e293b) !important;
    border-color: var(--p-surface-600, #475569) !important;
    color: var(--p-surface-200, #e2e8f0) !important;
}
.dark .p-picklist-control-btn:hover:not(:disabled),
[data-theme="dark"] .p-picklist-control-btn:hover:not(:disabled) {
    background: var(--p-surface-700, #334155) !important;
    color: #ffffff !important;
}
.dark .p-picklist-item:hover:not(.p-highlight),
[data-theme="dark"] .p-picklist-item:hover:not(.p-highlight) {
    background: var(--p-surface-800, #1e293b) !important;
    color: #ffffff !important;
}
.dark .p-picklist-product-name,
[data-theme="dark"] .p-picklist-product-name,
.dark .p-picklist-product-price,
[data-theme="dark"] .p-picklist-product-price {
    color: var(--p-surface-100, #f1f5f9) !important;
}
.dark .p-picklist-product-img,
[data-theme="dark"] .p-picklist-product-img {
    background: var(--p-surface-800, #1e293b) !important;
    border-color: var(--p-surface-700, #334155) !important;
}
`;
function PickListIsland(container, props) {
  injectIslandStyle("picklist", PICKLIST_CSS);
  const initialSource = props.value ? props.value[0] : props.source || [];
  const initialTarget = props.value ? props.value[1] : props.target || [];
  let sourceList = [...initialSource];
  let targetList = [...initialTarget];
  const dataKey = props.dataKey || "id";
  const isCheckbox = !!props.checkbox;
  const isFilter = !!props.filter;
  const filterBy = props.filterBy || "name";
  const sourceHeader = props.sourceHeader || "Available";
  const targetHeader = props.targetHeader || "Selected";
  const showSourceControls = !!props.showSourceControls;
  const showTargetControls = !!props.showTargetControls;
  const scrollHeight = props.scrollHeight || "18rem";
  const emptyMessageSource = props.emptyMessageSource || "No available options";
  const emptyMessageTarget = props.emptyMessageTarget || "No available options";
  let selectedSource = /* @__PURE__ */ new Set();
  let selectedTarget = /* @__PURE__ */ new Set();
  let sourceFilterQuery = "";
  let targetFilterQuery = "";
  function getItemId(item) {
    return String(item[dataKey] || item.id || item.name);
  }
  function renderCellContent(item, isSelected) {
    const checkboxHtml = isCheckbox ? `
            <div class="p-checkbox-box ${isSelected ? "p-checked" : ""}" role="checkbox" aria-checked="${isSelected}">
                ${isSelected ? LucideIcons.check : ""}
            </div>
        ` : "";
    if (item.price != null || item.category != null || item.image != null) {
      return `
                ${checkboxHtml}
                <div class="p-picklist-product-item">
                    <div class="p-picklist-product-img">
                        ${LucideIcons.package}
                    </div>
                    <div class="p-picklist-product-details">
                        <span class="p-picklist-product-name">${item.name}</span>
                        <span class="p-picklist-product-category">${item.category || ""}</span>
                    </div>
                    ${item.price != null ? `<span class="p-picklist-product-price">$${item.price}</span>` : ""}
                </div>
            `;
    }
    if (item.avatar != null || item.role != null) {
      const initials = item.name.split(" ").map((w) => w[0]).join("").substring(0, 2);
      return `
                ${checkboxHtml}
                <div class="p-picklist-member-item">
                    <div class="p-picklist-member-avatar">${initials}</div>
                    <div style="display: flex; flex-direction: column;">
                        <span style="font-weight: 600; color: var(--p-surface-900);">${item.name}</span>
                        ${item.role ? `<span style="font-size: 0.75rem; color: var(--p-surface-500);">${item.role}</span>` : ""}
                    </div>
                </div>
            `;
    }
    return `
            ${checkboxHtml}
            <span style="flex: 1; font-weight: ${isSelected ? "600" : "normal"};">${item.name}</span>
        `;
  }
  function buildShell() {
    const sourceControlsHtml = showSourceControls ? `
            <div class="p-picklist-controls p-picklist-source-controls">
                <button type="button" class="p-picklist-control-btn btn-source-top" title="Move Top" aria-label="Move Top">${LucideIcons.chevronsUp}</button>
                <button type="button" class="p-picklist-control-btn btn-source-up" title="Move Up" aria-label="Move Up">${LucideIcons.chevronUp}</button>
                <button type="button" class="p-picklist-control-btn btn-source-down" title="Move Down" aria-label="Move Down">${LucideIcons.chevronDown}</button>
                <button type="button" class="p-picklist-control-btn btn-source-bottom" title="Move Bottom" aria-label="Move Bottom">${LucideIcons.chevronsDown}</button>
            </div>
        ` : "";
    const targetControlsHtml = showTargetControls ? `
            <div class="p-picklist-controls p-picklist-target-controls">
                <button type="button" class="p-picklist-control-btn btn-target-top" title="Move Top" aria-label="Move Top">${LucideIcons.chevronsUp}</button>
                <button type="button" class="p-picklist-control-btn btn-target-up" title="Move Up" aria-label="Move Up">${LucideIcons.chevronUp}</button>
                <button type="button" class="p-picklist-control-btn btn-target-down" title="Move Down" aria-label="Move Down">${LucideIcons.chevronDown}</button>
                <button type="button" class="p-picklist-control-btn btn-target-bottom" title="Move Bottom" aria-label="Move Bottom">${LucideIcons.chevronsDown}</button>
            </div>
        ` : "";
    const sourceHeaderCheckboxHtml = isCheckbox ? `
            <div class="p-checkbox-box p-source-select-all" role="checkbox" aria-checked="false"></div>
        ` : "";
    const targetHeaderCheckboxHtml = isCheckbox ? `
            <div class="p-checkbox-box p-target-select-all" role="checkbox" aria-checked="false"></div>
        ` : "";
    const sourceFilterHtml = isFilter ? `
            <div class="p-picklist-filter-container">
                <input type="text" class="p-picklist-filter-input p-source-filter" placeholder="${props.sourceFilterPlaceholder || "Search by name"}" />
                <span class="p-picklist-filter-icon">${LucideIcons.search}</span>
            </div>
        ` : "";
    const targetFilterHtml = isFilter ? `
            <div class="p-picklist-filter-container">
                <input type="text" class="p-picklist-filter-input p-target-filter" placeholder="${props.targetFilterPlaceholder || "Search by name"}" />
                <span class="p-picklist-filter-icon">${LucideIcons.search}</span>
            </div>
        ` : "";
    container.innerHTML = `
            <div class="p-picklist p-component">
                ${sourceControlsHtml}

                <!-- Source List Box -->
                <div class="p-picklist-list-container">
                    <div class="p-picklist-header">
                        <div style="display: flex; align-items: center; gap: 0.5rem;">
                            ${sourceHeaderCheckboxHtml}
                            <span>${sourceHeader}</span>
                        </div>
                        <span class="p-source-count" style="font-size: 0.75rem; font-weight: 600; color: var(--p-surface-500);">0 items</span>
                    </div>
                    ${sourceFilterHtml}
                    <ul class="p-picklist-list picklist-source-list" style="height: ${scrollHeight};" role="listbox" aria-multiselectable="true" tabindex="0">
                    </ul>
                </div>

                <!-- Transfer Buttons (Center) -->
                <div class="p-picklist-controls p-picklist-transfer-controls">
                    <button type="button" class="p-picklist-control-btn btn-move-to-target" title="Move to Target" aria-label="Move to Target" disabled>
                        ${LucideIcons.chevronRight}
                    </button>
                    <button type="button" class="p-picklist-control-btn btn-move-all-to-target" title="Move All to Target" aria-label="Move All to Target">
                        ${LucideIcons.chevronsRight}
                    </button>
                    <button type="button" class="p-picklist-control-btn btn-move-to-source" title="Move to Source" aria-label="Move to Source" disabled>
                        ${LucideIcons.chevronLeft}
                    </button>
                    <button type="button" class="p-picklist-control-btn btn-move-all-to-source" title="Move All to Source" aria-label="Move All to Source">
                        ${LucideIcons.chevronsLeft}
                    </button>
                </div>

                <!-- Target List Box -->
                <div class="p-picklist-list-container">
                    <div class="p-picklist-header">
                        <div style="display: flex; align-items: center; gap: 0.5rem;">
                            ${targetHeaderCheckboxHtml}
                            <span>${targetHeader}</span>
                        </div>
                        <span class="p-target-count" style="font-size: 0.75rem; font-weight: 600; color: var(--p-surface-500);">0 items</span>
                    </div>
                    ${targetFilterHtml}
                    <ul class="p-picklist-list picklist-target-list" style="height: ${scrollHeight};" role="listbox" aria-multiselectable="true" tabindex="0">
                    </ul>
                </div>

                ${targetControlsHtml}
            </div>
        `;
    const srcEl = container.querySelector(".picklist-source-list");
    const tgtEl = container.querySelector(".picklist-target-list");
    if (srcEl) useAutoAnimate(srcEl, { duration: 180 });
    if (tgtEl) useAutoAnimate(tgtEl, { duration: 180 });
    bindPermanentEvents();
    updateSourceList();
    updateTargetList();
    updateTransferButtons();
  }
  function updateSourceList() {
    const rootEl = container.firstElementChild;
    if (!rootEl) return;
    const filteredSource = sourceList.filter((item) => {
      if (!isFilter || !sourceFilterQuery.trim()) return true;
      const val = String(item[filterBy] || item.name || "").toLowerCase();
      return val.includes(sourceFilterQuery.toLowerCase());
    });
    const countEl = rootEl.querySelector(".p-source-count");
    if (countEl) countEl.textContent = `${filteredSource.length} items`;
    const sourceSelectAll = rootEl.querySelector(".p-source-select-all");
    if (sourceSelectAll) {
      const isAll = filteredSource.length > 0 && filteredSource.every((it2) => selectedSource.has(getItemId(it2)));
      const isIndet = filteredSource.some((it2) => selectedSource.has(getItemId(it2))) && !isAll;
      sourceSelectAll.className = `p-checkbox-box p-source-select-all ${isAll ? "p-checked" : isIndet ? "p-indeterminate" : ""}`;
      sourceSelectAll.setAttribute("aria-checked", String(isAll));
      sourceSelectAll.innerHTML = isAll ? LucideIcons.check : isIndet ? '<span style="width: 8px; height: 2px; background: white;"></span>' : "";
    }
    const srcUl = rootEl.querySelector(".picklist-source-list");
    if (srcUl) {
      if (filteredSource.length === 0) {
        srcUl.innerHTML = `<li class="p-picklist-empty">${sourceFilterQuery ? "No results found" : emptyMessageSource}</li>`;
      } else {
        srcUl.innerHTML = filteredSource.map((it2) => {
          const id = getItemId(it2);
          const isSelected = selectedSource.has(id);
          return `
                        <li class="p-picklist-item source-item ${isSelected ? "p-highlight" : ""}" 
                            data-id="${id}" 
                            role="option" 
                            aria-selected="${isSelected}">
                            ${renderCellContent(it2, isSelected)}
                        </li>
                    `;
        }).join("");
        srcUl.querySelectorAll(".source-item").forEach((el) => {
          el.addEventListener("click", (e) => {
            const id = el.getAttribute("data-id");
            if (!id) return;
            const mouseEvent = e;
            if (isCheckbox || mouseEvent.ctrlKey || mouseEvent.metaKey) {
              if (selectedSource.has(id)) selectedSource.delete(id);
              else selectedSource.add(id);
            } else {
              if (selectedSource.has(id) && selectedSource.size === 1) {
                selectedSource.clear();
              } else {
                selectedSource.clear();
                selectedSource.add(id);
              }
            }
            updateSourceList();
            updateTransferButtons();
            dispatchSelectionEvent();
          });
        });
      }
    }
  }
  function updateTargetList() {
    const rootEl = container.firstElementChild;
    if (!rootEl) return;
    const filteredTarget = targetList.filter((item) => {
      if (!isFilter || !targetFilterQuery.trim()) return true;
      const val = String(item[filterBy] || item.name || "").toLowerCase();
      return val.includes(targetFilterQuery.toLowerCase());
    });
    const countEl = rootEl.querySelector(".p-target-count");
    if (countEl) countEl.textContent = `${filteredTarget.length} items`;
    const targetSelectAll = rootEl.querySelector(".p-target-select-all");
    if (targetSelectAll) {
      const isAll = filteredTarget.length > 0 && filteredTarget.every((it2) => selectedTarget.has(getItemId(it2)));
      const isIndet = filteredTarget.some((it2) => selectedTarget.has(getItemId(it2))) && !isAll;
      targetSelectAll.className = `p-checkbox-box p-target-select-all ${isAll ? "p-checked" : isIndet ? "p-indeterminate" : ""}`;
      targetSelectAll.setAttribute("aria-checked", String(isAll));
      targetSelectAll.innerHTML = isAll ? LucideIcons.check : isIndet ? '<span style="width: 8px; height: 2px; background: white;"></span>' : "";
    }
    const tgtUl = rootEl.querySelector(".picklist-target-list");
    if (tgtUl) {
      if (filteredTarget.length === 0) {
        tgtUl.innerHTML = `<li class="p-picklist-empty">${targetFilterQuery ? "No results found" : emptyMessageTarget}</li>`;
      } else {
        tgtUl.innerHTML = filteredTarget.map((it2) => {
          const id = getItemId(it2);
          const isSelected = selectedTarget.has(id);
          return `
                        <li class="p-picklist-item target-item ${isSelected ? "p-highlight" : ""}" 
                            data-id="${id}" 
                            role="option" 
                            aria-selected="${isSelected}">
                            ${renderCellContent(it2, isSelected)}
                        </li>
                    `;
        }).join("");
        tgtUl.querySelectorAll(".target-item").forEach((el) => {
          el.addEventListener("click", (e) => {
            const id = el.getAttribute("data-id");
            if (!id) return;
            const mouseEvent = e;
            if (isCheckbox || mouseEvent.ctrlKey || mouseEvent.metaKey) {
              if (selectedTarget.has(id)) selectedTarget.delete(id);
              else selectedTarget.add(id);
            } else {
              if (selectedTarget.has(id) && selectedTarget.size === 1) {
                selectedTarget.clear();
              } else {
                selectedTarget.clear();
                selectedTarget.add(id);
              }
            }
            updateTargetList();
            updateTransferButtons();
            dispatchSelectionEvent();
          });
        });
      }
    }
  }
  function updateTransferButtons() {
    const rootEl = container.firstElementChild;
    if (!rootEl) return;
    const btnMoveTarget = rootEl.querySelector(".btn-move-to-target");
    if (btnMoveTarget) btnMoveTarget.disabled = selectedSource.size === 0;
    const btnMoveAllTarget = rootEl.querySelector(".btn-move-all-to-target");
    if (btnMoveAllTarget) btnMoveAllTarget.disabled = sourceList.length === 0;
    const btnMoveSource = rootEl.querySelector(".btn-move-to-source");
    if (btnMoveSource) btnMoveSource.disabled = selectedTarget.size === 0;
    const btnMoveAllSource = rootEl.querySelector(".btn-move-all-to-source");
    if (btnMoveAllSource) btnMoveAllSource.disabled = targetList.length === 0;
  }
  function bindPermanentEvents() {
    const rootEl = container.firstElementChild;
    if (!rootEl) return;
    const srcFilterInput = rootEl.querySelector(".p-source-filter");
    if (srcFilterInput) {
      srcFilterInput.addEventListener("input", (e) => {
        sourceFilterQuery = e.target.value;
        updateSourceList();
        updateTransferButtons();
      });
    }
    const tgtFilterInput = rootEl.querySelector(".p-target-filter");
    if (tgtFilterInput) {
      tgtFilterInput.addEventListener("input", (e) => {
        targetFilterQuery = e.target.value;
        updateTargetList();
        updateTransferButtons();
      });
    }
    const sourceSelectAll = rootEl.querySelector(".p-source-select-all");
    if (sourceSelectAll) {
      sourceSelectAll.addEventListener("click", () => {
        const isAll = sourceSelectAll.classList.contains("p-checked");
        if (isAll) {
          selectedSource.clear();
        } else {
          sourceList.forEach((it2) => selectedSource.add(getItemId(it2)));
        }
        updateSourceList();
        updateTransferButtons();
        dispatchSelectionEvent();
      });
    }
    const targetSelectAll = rootEl.querySelector(".p-target-select-all");
    if (targetSelectAll) {
      targetSelectAll.addEventListener("click", () => {
        const isAll = targetSelectAll.classList.contains("p-checked");
        if (isAll) {
          selectedTarget.clear();
        } else {
          targetList.forEach((it2) => selectedTarget.add(getItemId(it2)));
        }
        updateTargetList();
        updateTransferButtons();
        dispatchSelectionEvent();
      });
    }
    rootEl.querySelector(".btn-move-to-target")?.addEventListener("click", () => {
      if (selectedSource.size === 0) return;
      const moving = sourceList.filter((it2) => selectedSource.has(getItemId(it2)));
      targetList = [...targetList, ...moving];
      sourceList = sourceList.filter((it2) => !selectedSource.has(getItemId(it2)));
      selectedSource.clear();
      updateSourceList();
      updateTargetList();
      updateTransferButtons();
      syncValues("move-to-target", moving);
    });
    rootEl.querySelector(".btn-move-all-to-target")?.addEventListener("click", () => {
      if (sourceList.length === 0) return;
      const moving = [...sourceList];
      targetList = [...targetList, ...sourceList];
      sourceList = [];
      selectedSource.clear();
      updateSourceList();
      updateTargetList();
      updateTransferButtons();
      syncValues("move-all-to-target", moving);
    });
    rootEl.querySelector(".btn-move-to-source")?.addEventListener("click", () => {
      if (selectedTarget.size === 0) return;
      const moving = targetList.filter((it2) => selectedTarget.has(getItemId(it2)));
      sourceList = [...sourceList, ...moving];
      targetList = targetList.filter((it2) => !selectedTarget.has(getItemId(it2)));
      selectedTarget.clear();
      updateSourceList();
      updateTargetList();
      updateTransferButtons();
      syncValues("move-to-source", moving);
    });
    rootEl.querySelector(".btn-move-all-to-source")?.addEventListener("click", () => {
      if (targetList.length === 0) return;
      const moving = [...targetList];
      sourceList = [...sourceList, ...targetList];
      targetList = [];
      selectedTarget.clear();
      updateSourceList();
      updateTargetList();
      updateTransferButtons();
      syncValues("move-all-to-source", moving);
    });
    rootEl.querySelector(".btn-source-top")?.addEventListener("click", () => {
      reorderList(sourceList, selectedSource, "top", "source");
    });
    rootEl.querySelector(".btn-source-up")?.addEventListener("click", () => {
      reorderList(sourceList, selectedSource, "up", "source");
    });
    rootEl.querySelector(".btn-source-down")?.addEventListener("click", () => {
      reorderList(sourceList, selectedSource, "down", "source");
    });
    rootEl.querySelector(".btn-source-bottom")?.addEventListener("click", () => {
      reorderList(sourceList, selectedSource, "bottom", "source");
    });
    rootEl.querySelector(".btn-target-top")?.addEventListener("click", () => {
      reorderList(targetList, selectedTarget, "top", "target");
    });
    rootEl.querySelector(".btn-target-up")?.addEventListener("click", () => {
      reorderList(targetList, selectedTarget, "up", "target");
    });
    rootEl.querySelector(".btn-target-down")?.addEventListener("click", () => {
      reorderList(targetList, selectedTarget, "down", "target");
    });
    rootEl.querySelector(".btn-target-bottom")?.addEventListener("click", () => {
      reorderList(targetList, selectedTarget, "bottom", "target");
    });
  }
  function reorderList(list, selectedSet, direction, whichList) {
    if (selectedSet.size === 0 || list.length < 2) return;
    if (direction === "top") {
      const selected = list.filter((it2) => selectedSet.has(getItemId(it2)));
      const remaining = list.filter((it2) => !selectedSet.has(getItemId(it2)));
      list.length = 0;
      list.push(...selected, ...remaining);
    } else if (direction === "bottom") {
      const selected = list.filter((it2) => selectedSet.has(getItemId(it2)));
      const remaining = list.filter((it2) => !selectedSet.has(getItemId(it2)));
      list.length = 0;
      list.push(...remaining, ...selected);
    } else if (direction === "up") {
      for (let i = 1; i < list.length; i++) {
        if (selectedSet.has(getItemId(list[i])) && !selectedSet.has(getItemId(list[i - 1]))) {
          const temp = list[i];
          list[i] = list[i - 1];
          list[i - 1] = temp;
        }
      }
    } else if (direction === "down") {
      for (let i = list.length - 2; i >= 0; i--) {
        if (selectedSet.has(getItemId(list[i])) && !selectedSet.has(getItemId(list[i + 1]))) {
          const temp = list[i];
          list[i] = list[i + 1];
          list[i + 1] = temp;
        }
      }
    }
    if (whichList === "source") updateSourceList();
    else updateTargetList();
    updateTransferButtons();
    syncValues("reorder");
  }
  function dispatchSelectionEvent() {
    container.dispatchEvent(new CustomEvent("picklist:selection-change", {
      bubbles: true,
      detail: {
        sourceSelection: Array.from(selectedSource),
        targetSelection: Array.from(selectedTarget)
      }
    }));
  }
  function syncValues(action = "change", affectedItems = []) {
    if (props.targetInputName) {
      let hidden = container.querySelector(`input[name="${props.targetInputName}"]`);
      if (!hidden) {
        hidden = document.createElement("input");
        hidden.type = "hidden";
        hidden.name = props.targetInputName;
        container.appendChild(hidden);
      }
      hidden.value = JSON.stringify(targetList.map((it2) => getItemId(it2)));
    }
    container.dispatchEvent(new CustomEvent("picklist:change", {
      bubbles: true,
      detail: { source: sourceList, target: targetList, action, affectedItems }
    }));
  }
  buildShell();
  syncValues();
}

// src/components/orderlist.ts
var ORDERLIST_CSS = `
.p-orderlist {
    display: flex;
    align-items: flex-start;
    gap: 1.25rem;
    width: 100%;
    font-family: var(--p-font-family, inherit);
    color: var(--p-surface-800, #1e293b);
}

.p-orderlist-controls {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    gap: 0.5rem;
    flex-shrink: 0;
    padding-top: 0.5rem;
}

.p-orderlist-control-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2.25rem;
    height: 2.25rem;
    padding: 0;
    border-radius: var(--p-border-radius, 6px);
    border: 1px solid var(--p-surface-300, #cbd5e1);
    background: var(--p-surface-0, #ffffff);
    color: var(--p-surface-700, #334155);
    cursor: pointer;
    transition: all 0.15s ease;
    outline: none;
}
.p-orderlist-control-btn:hover:not(:disabled) {
    background: var(--p-surface-100, #f1f5f9);
    color: var(--p-surface-900, #0f172a);
    border-color: var(--p-surface-400, #94a3b8);
}
.p-orderlist-control-btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
}

.p-orderlist-list-container {
    flex: 1 1 0;
    display: flex;
    flex-direction: column;
    border: 1px solid var(--p-surface-200, #e2e8f0);
    border-radius: var(--p-border-radius-lg, 8px);
    background: var(--p-surface-0, #ffffff);
    overflow: hidden;
    min-width: 0;
    box-shadow: var(--p-shadow-xs, 0 1px 2px 0 rgba(0, 0, 0, 0.05));
}

.p-orderlist-header {
    padding: 0.75rem 1rem;
    background: var(--p-surface-50, #f8fafc);
    border-bottom: 1px solid var(--p-surface-200, #e2e8f0);
    font-size: 0.875rem;
    font-weight: 700;
    color: var(--p-surface-800, #1e293b);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
}

.p-orderlist-filter-container {
    padding: 0.5rem 0.75rem;
    background: var(--p-surface-50, #f8fafc);
    border-bottom: 1px solid var(--p-surface-200, #e2e8f0);
    position: relative;
    display: flex;
    align-items: center;
}
.p-orderlist-filter-input {
    width: 100%;
    padding: 0.4rem 2rem 0.4rem 0.65rem;
    font-size: 0.8125rem;
    border: 1px solid var(--p-surface-300, #cbd5e1);
    border-radius: var(--p-border-radius, 6px);
    background: var(--p-surface-0, #ffffff);
    color: inherit;
    outline: none;
    transition: border-color 0.15s ease, box-shadow 0.15s ease;
}
.p-orderlist-filter-input:focus {
    border-color: var(--p-primary-500, #10b981);
    box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.2);
}
.p-orderlist-filter-icon {
    position: absolute;
    right: 1.25rem;
    color: var(--p-surface-400, #94a3b8);
    pointer-events: none;
    display: flex;
    align-items: center;
}

.p-orderlist-list {
    list-style: none;
    margin: 0;
    padding: 0.25rem 0;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
}

.p-orderlist-item {
    padding: 0.625rem 1rem;
    margin: 0.125rem 0.25rem;
    border-radius: var(--p-border-radius-xs, 5px);
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-size: 0.875rem;
    color: var(--p-surface-700, #334155);
    user-select: none;
    transition: background-color 0.15s ease, color 0.15s ease;
}
.p-orderlist-item:hover:not(.p-highlight) {
    background: var(--p-surface-100, #f1f5f9);
    color: var(--p-surface-900, #0f172a);
}
.p-orderlist-item.p-highlight {
    background: rgba(16, 185, 129, 0.1) !important;
    color: var(--p-primary-700, #047857) !important;
    font-weight: 600;
}

/* Checkbox */
.p-checkbox-box {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 1.125rem;
    height: 1.125rem;
    border-radius: var(--p-border-radius-xs, 4px);
    border: 2px solid var(--p-surface-300, #cbd5e1);
    background: var(--p-surface-0, #ffffff);
    cursor: pointer;
    transition: all 0.15s ease;
    flex-shrink: 0;
}
.p-checkbox-box.p-checked {
    background: var(--p-primary-500, #10b981);
    border-color: var(--p-primary-500, #10b981);
    color: #ffffff;
}

/* Product Item Content */
.p-orderlist-product-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    width: 100%;
}
.p-orderlist-product-img {
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 6px;
    background: var(--p-surface-100, #f1f5f9);
    border: 1px solid var(--p-surface-200, #e2e8f0);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--p-primary-600, #059669);
    flex-shrink: 0;
}
.p-orderlist-product-details {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
    min-width: 0;
}
.p-orderlist-product-name {
    font-weight: 600;
    font-size: 0.875rem;
    color: var(--p-surface-900, #0f172a);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
.p-orderlist-product-category {
    font-size: 0.75rem;
    color: var(--p-surface-500, #64748b);
}
.p-orderlist-product-price {
    font-weight: 700;
    font-size: 0.875rem;
    color: var(--p-surface-900, #0f172a);
}

/* Numbered Digits */
.p-orderlist-index {
    font-variant-numeric: tabular-nums;
    font-size: 0.8125rem;
    font-weight: 600;
    color: var(--p-surface-400, #94a3b8);
    width: 1.5rem;
    text-align: right;
    flex-shrink: 0;
}

/* Footer / Status Bar */
.p-orderlist-footer {
    padding: 0.5rem 1rem;
    background: var(--p-surface-50, #f8fafc);
    border-top: 1px solid var(--p-surface-200, #e2e8f0);
    font-size: 0.75rem;
    color: var(--p-surface-500, #64748b);
    display: flex;
    align-items: center;
    justify-content: space-between;
}

/* Empty State */
.p-orderlist-empty {
    padding: 2.5rem 1rem;
    text-align: center;
    color: var(--p-surface-400, #94a3b8);
    font-size: 0.8125rem;
    font-style: italic;
}

/* Dark Mode Tokens */
.dark .p-orderlist,
[data-theme="dark"] .p-orderlist {
    color: var(--p-surface-100, #f1f5f9) !important;
}
.dark .p-orderlist-list-container,
[data-theme="dark"] .p-orderlist-list-container {
    background: var(--p-surface-900, #0f172a) !important;
    border-color: var(--p-surface-700, #334155) !important;
}
.dark .p-orderlist-header,
.dark .p-orderlist-filter-container,
.dark .p-orderlist-footer,
[data-theme="dark"] .p-orderlist-header,
[data-theme="dark"] .p-orderlist-filter-container,
[data-theme="dark"] .p-orderlist-footer {
    background: var(--p-surface-800, #1e293b) !important;
    border-color: var(--p-surface-700, #334155) !important;
    color: var(--p-surface-100, #f1f5f9) !important;
}
.dark .p-orderlist-filter-input,
[data-theme="dark"] .p-orderlist-filter-input {
    background: var(--p-surface-900, #0f172a) !important;
    border-color: var(--p-surface-600, #475569) !important;
    color: #ffffff !important;
}
.dark .p-orderlist-control-btn,
[data-theme="dark"] .p-orderlist-control-btn {
    background: var(--p-surface-800, #1e293b) !important;
    border-color: var(--p-surface-600, #475569) !important;
    color: var(--p-surface-200, #e2e8f0) !important;
}
.dark .p-orderlist-control-btn:hover:not(:disabled),
[data-theme="dark"] .p-orderlist-control-btn:hover:not(:disabled) {
    background: var(--p-surface-700, #334155) !important;
    color: #ffffff !important;
}
.dark .p-orderlist-item:hover:not(.p-highlight),
[data-theme="dark"] .p-orderlist-item:hover:not(.p-highlight) {
    background: var(--p-surface-800, #1e293b) !important;
    color: #ffffff !important;
}
.dark .p-orderlist-product-name,
.dark .p-orderlist-product-price,
[data-theme="dark"] .p-orderlist-product-name,
[data-theme="dark"] .p-orderlist-product-price {
    color: var(--p-surface-100, #f1f5f9) !important;
}
.dark .p-orderlist-product-img,
[data-theme="dark"] .p-orderlist-product-img {
    background: var(--p-surface-800, #1e293b) !important;
    border-color: var(--p-surface-700, #334155) !important;
}
`;
function OrderListIsland(container, props) {
  injectIslandStyle("orderlist", ORDERLIST_CSS);
  const initialItems = props.value ? [...props.value] : props.items ? [...props.items] : [];
  let itemsList = [...initialItems];
  const dataKey = props.dataKey || "id";
  const isCheckbox = !!props.checkbox;
  const isFilter = !!props.filter;
  const filterBy = props.filterBy || props.filterFields && props.filterFields[0] || "name";
  const filterPlaceholder = props.filterPlaceholder || "Filter by name";
  const scrollHeight = props.scrollHeight || "20rem";
  const emptyMessage = props.emptyMessage || "No available options";
  let selectedIds = /* @__PURE__ */ new Set();
  let filterQuery = "";
  function getItemId(item, fallbackIndex) {
    const keyVal = item[dataKey] || item.id || item.title || item.name;
    return keyVal != null ? String(keyVal) : String(fallbackIndex);
  }
  function getItemTitle(item) {
    return item.title || item.name || "";
  }
  function renderCellContent(item, index, isSelected) {
    const checkboxHtml = isCheckbox ? `
            <div class="p-checkbox-box ${isSelected ? "p-checked" : ""}" role="checkbox" aria-checked="${isSelected}">
                ${isSelected ? LucideIcons.check : ""}
            </div>
        ` : "";
    if (item.price != null || item.category != null || item.image != null) {
      return `
                ${checkboxHtml}
                <div class="p-orderlist-product-item">
                    <div class="p-orderlist-product-img">
                        ${LucideIcons.package}
                    </div>
                    <div class="p-orderlist-product-details">
                        <span class="p-orderlist-product-name">${getItemTitle(item)}</span>
                        <span class="p-orderlist-product-category">${item.category || ""}</span>
                    </div>
                    ${item.price != null ? `<span class="p-orderlist-product-price">$${item.price}</span>` : ""}
                </div>
            `;
    }
    return `
            ${checkboxHtml}
            <span class="p-orderlist-index">${index + 1}</span>
            <span style="flex: 1; font-weight: ${isSelected ? "600" : "normal"}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                ${getItemTitle(item)}
            </span>
        `;
  }
  function buildShell() {
    const headerHtml = props.header ? `
            <div class="p-orderlist-header">
                <span>${props.header}</span>
            </div>
        ` : "";
    const filterHtml = isFilter ? `
            <div class="p-orderlist-filter-container">
                <input type="text" class="p-orderlist-filter-input" placeholder="${filterPlaceholder}" />
                <span class="p-orderlist-filter-icon">${LucideIcons.search}</span>
            </div>
        ` : "";
    container.innerHTML = `
            <div class="p-orderlist p-component">
                <!-- Reorder Action Buttons (Left) -->
                <div class="p-orderlist-controls">
                    <button type="button" class="p-orderlist-control-btn btn-order-top" title="Move to Top" aria-label="Move to Top" disabled>
                        ${LucideIcons.chevronsUp}
                    </button>
                    <button type="button" class="p-orderlist-control-btn btn-order-up" title="Move Up" aria-label="Move Up" disabled>
                        ${LucideIcons.chevronUp}
                    </button>
                    <button type="button" class="p-orderlist-control-btn btn-order-down" title="Move Down" aria-label="Move Down" disabled>
                        ${LucideIcons.chevronDown}
                    </button>
                    <button type="button" class="p-orderlist-control-btn btn-order-bottom" title="Move to Bottom" aria-label="Move to Bottom" disabled>
                        ${LucideIcons.chevronsDown}
                    </button>
                </div>

                <!-- List Box (Right) -->
                <div class="p-orderlist-list-container">
                    ${headerHtml}
                    ${filterHtml}
                    <ul class="p-orderlist-list" style="height: ${scrollHeight};" role="listbox" aria-multiselectable="true" tabindex="0">
                    </ul>
                    <div class="p-orderlist-footer">
                        <span class="p-orderlist-selection-status">No selected item</span>
                        ${isFilter ? `<span class="p-orderlist-results-status" style="font-size: 0.6875rem; color: var(--p-surface-400);">0 results available</span>` : ""}
                    </div>
                </div>
            </div>
        `;
    const listEl = container.querySelector(".p-orderlist-list");
    if (listEl) useAutoAnimate(listEl, { duration: 180 });
    bindPermanentEvents();
    updateList();
    updateButtons();
  }
  function updateList() {
    const rootEl = container.firstElementChild;
    if (!rootEl) return;
    const filteredItems = itemsList.filter((item, idx) => {
      if (!isFilter || !filterQuery.trim()) return true;
      const targetVal = String(item[filterBy] || item.title || item.name || "").toLowerCase();
      return targetVal.includes(filterQuery.toLowerCase());
    });
    const resultsEl = rootEl.querySelector(".p-orderlist-results-status");
    if (resultsEl) {
      resultsEl.textContent = `${filteredItems.length} results are available`;
    }
    const statusEl = rootEl.querySelector(".p-orderlist-selection-status");
    if (statusEl) {
      statusEl.textContent = selectedIds.size > 0 ? `${selectedIds.size} items selected` : "No selected item";
    }
    const listUl = rootEl.querySelector(".p-orderlist-list");
    if (listUl) {
      if (filteredItems.length === 0) {
        listUl.innerHTML = `<li class="p-orderlist-empty">${filterQuery ? "No results found" : emptyMessage}</li>`;
      } else {
        listUl.innerHTML = filteredItems.map((item, idx) => {
          const id = getItemId(item, idx);
          const isSelected = selectedIds.has(id);
          return `
                        <li class="p-orderlist-item ${isSelected ? "p-highlight" : ""}" 
                            data-id="${id}" 
                            data-index="${idx}"
                            role="option" 
                            aria-selected="${isSelected}">
                            ${renderCellContent(item, idx, isSelected)}
                        </li>
                    `;
        }).join("");
        listUl.querySelectorAll(".p-orderlist-item").forEach((el) => {
          el.addEventListener("click", (e) => {
            const id = el.getAttribute("data-id");
            if (!id) return;
            const mouseEvent = e;
            if (isCheckbox || mouseEvent.ctrlKey || mouseEvent.metaKey) {
              if (selectedIds.has(id)) selectedIds.delete(id);
              else selectedIds.add(id);
            } else {
              if (selectedIds.has(id) && selectedIds.size === 1) {
                selectedIds.clear();
              } else {
                selectedIds.clear();
                selectedIds.add(id);
              }
            }
            updateList();
            updateButtons();
            dispatchSelectionEvent();
          });
        });
      }
    }
  }
  function updateButtons() {
    const rootEl = container.firstElementChild;
    if (!rootEl) return;
    const btnTop = rootEl.querySelector(".btn-order-top");
    const btnUp = rootEl.querySelector(".btn-order-up");
    const btnDown = rootEl.querySelector(".btn-order-down");
    const btnBottom = rootEl.querySelector(".btn-order-bottom");
    const hasSelection = selectedIds.size > 0 && itemsList.length > 1;
    if (btnTop) btnTop.disabled = !hasSelection;
    if (btnUp) btnUp.disabled = !hasSelection;
    if (btnDown) btnDown.disabled = !hasSelection;
    if (btnBottom) btnBottom.disabled = !hasSelection;
  }
  function bindPermanentEvents() {
    const rootEl = container.firstElementChild;
    if (!rootEl) return;
    const filterInput = rootEl.querySelector(".p-orderlist-filter-input");
    if (filterInput) {
      filterInput.addEventListener("input", (e) => {
        filterQuery = e.target.value;
        updateList();
        updateButtons();
      });
    }
    rootEl.querySelector(".btn-order-top")?.addEventListener("click", () => {
      reorder("top");
    });
    rootEl.querySelector(".btn-order-up")?.addEventListener("click", () => {
      reorder("up");
    });
    rootEl.querySelector(".btn-order-down")?.addEventListener("click", () => {
      reorder("down");
    });
    rootEl.querySelector(".btn-order-bottom")?.addEventListener("click", () => {
      reorder("bottom");
    });
    const listUl = rootEl.querySelector(".p-orderlist-list");
    if (listUl) {
      listUl.addEventListener("keydown", (e) => {
        if (e.key === "ArrowDown" || e.key === "ArrowUp") {
          e.preventDefault();
          navigateItems(e.key === "ArrowDown" ? 1 : -1, e.shiftKey);
        } else if (e.key === " " || e.key === "Enter") {
          e.preventDefault();
        } else if (e.key === "a" && (e.ctrlKey || e.metaKey)) {
          e.preventDefault();
          itemsList.forEach((it2, idx) => selectedIds.add(getItemId(it2, idx)));
          updateList();
          updateButtons();
          dispatchSelectionEvent();
        }
      });
    }
  }
  function navigateItems(delta, isShift) {
    if (itemsList.length === 0) return;
    let lastSelectedIdx = itemsList.findIndex((it2, idx) => selectedIds.has(getItemId(it2, idx)));
    if (lastSelectedIdx === -1) lastSelectedIdx = delta > 0 ? -1 : itemsList.length;
    const targetIdx = Math.max(0, Math.min(itemsList.length - 1, lastSelectedIdx + delta));
    const targetId = getItemId(itemsList[targetIdx], targetIdx);
    if (!isShift) selectedIds.clear();
    selectedIds.add(targetId);
    updateList();
    updateButtons();
    dispatchSelectionEvent();
  }
  function reorder(direction) {
    if (selectedIds.size === 0 || itemsList.length < 2) return;
    if (direction === "top") {
      const selected = itemsList.filter((it2, idx) => selectedIds.has(getItemId(it2, idx)));
      const remaining = itemsList.filter((it2, idx) => !selectedIds.has(getItemId(it2, idx)));
      itemsList.length = 0;
      itemsList.push(...selected, ...remaining);
    } else if (direction === "bottom") {
      const selected = itemsList.filter((it2, idx) => selectedIds.has(getItemId(it2, idx)));
      const remaining = itemsList.filter((it2, idx) => !selectedIds.has(getItemId(it2, idx)));
      itemsList.length = 0;
      itemsList.push(...remaining, ...selected);
    } else if (direction === "up") {
      for (let i = 1; i < itemsList.length; i++) {
        const curId = getItemId(itemsList[i], i);
        const prevId = getItemId(itemsList[i - 1], i - 1);
        if (selectedIds.has(curId) && !selectedIds.has(prevId)) {
          const temp = itemsList[i];
          itemsList[i] = itemsList[i - 1];
          itemsList[i - 1] = temp;
        }
      }
    } else if (direction === "down") {
      for (let i = itemsList.length - 2; i >= 0; i--) {
        const curId = getItemId(itemsList[i], i);
        const nextId = getItemId(itemsList[i + 1], i + 1);
        if (selectedIds.has(curId) && !selectedIds.has(nextId)) {
          const temp = itemsList[i];
          itemsList[i] = itemsList[i + 1];
          itemsList[i + 1] = temp;
        }
      }
    }
    updateList();
    updateButtons();
    syncValues("reorder");
  }
  function dispatchSelectionEvent() {
    container.dispatchEvent(new CustomEvent("orderlist:selection-change", {
      bubbles: true,
      detail: {
        selection: Array.from(selectedIds)
      }
    }));
  }
  function syncValues(action = "change") {
    if (props.targetInputName) {
      let hidden = container.querySelector(`input[name="${props.targetInputName}"]`);
      if (!hidden) {
        hidden = document.createElement("input");
        hidden.type = "hidden";
        hidden.name = props.targetInputName;
        container.appendChild(hidden);
      }
      hidden.value = JSON.stringify(itemsList.map((it2, idx) => getItemId(it2, idx)));
    }
    container.dispatchEvent(new CustomEvent("orderlist:change", {
      bubbles: true,
      detail: { value: itemsList, action }
    }));
  }
  buildShell();
  syncValues();
}

// src/composables/useClipboard.ts
function useClipboard(options = {}) {
  const timeout = options.timeout ?? 2e3;
  let isCopied = false;
  let timer = null;
  async function copy(text) {
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      } else if (typeof document !== "undefined") {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        textArea.style.opacity = "0";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }
      isCopied = true;
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        isCopied = false;
      }, timeout);
      return true;
    } catch {
      isCopied = false;
      return false;
    }
  }
  return {
    copy,
    get isCopied() {
      return isCopied;
    },
    destroy: () => {
      if (timer) clearTimeout(timer);
    }
  };
}

// src/components/terminal.ts
var CSS5 = `
[data-theme="dark"] .laughtale-terminal {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
[data-theme="dark"] .btn-copy-terminal {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
[data-theme="dark"] .terminal-log {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
[data-theme="dark"] .terminal-input {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
`;
function TerminalIsland(container, props) {
  injectIslandStyle("terminal", CSS5);
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
  const commandHistory = [];
  let historyIndex = -1;
  const clipboard = useClipboard();
  function render() {
    container.innerHTML = `
            <div class="laughtale-terminal" style="background: #030712; color: #38bdf8; font-family: var(--p-font-mono, monospace); font-size: 0.8125rem; border-radius: var(--p-border-radius-lg); border: 1px solid #1f2937; box-shadow: var(--p-shadow-lg); padding: 1.25rem; width: 100%; max-width: 640px; min-height: 240px; display: flex; flex-direction: column; overflow: hidden;">
                <!-- Header Controls -->
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.875rem; border-bottom: 1px solid #1f2937; padding-bottom: 0.625rem;">
                    <div style="display: flex; align-items: center; gap: 0.45rem;">
                        <span style="width: 10px; height: 10px; border-radius: 50%; background: #ef4444; display: inline-block;"></span>
                        <span style="width: 10px; height: 10px; border-radius: 50%; background: #f59e0b; display: inline-block;"></span>
                        <span style="width: 10px; height: 10px; border-radius: 50%; background: #10b981; display: inline-block;"></span>
                        <span style="color: #64748b; font-size: 0.6875rem; margin-left: 0.5rem;">bash \u2014 80x24</span>
                    </div>
                    <button type="button" class="btn-copy-terminal" style="background: transparent; border: none; color: #64748b; font-size: 0.75rem; cursor: pointer; padding: 0.15rem 0.35rem; border-radius: 4px;">
                        Copy Log
                    </button>
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
    const copyBtn = container.querySelector(".btn-copy-terminal");
    log.scrollTop = log.scrollHeight;
    copyBtn.addEventListener("click", () => {
      const allText = history.map((h) => `${promptPrefix} ${h.command}
${h.response}`).join("\n");
      clipboard.copy(allText);
      copyBtn.textContent = "Copied!";
      setTimeout(() => {
        copyBtn.textContent = "Copy Log";
      }, 2e3);
    });
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        const cmd = input.value.trim();
        if (!cmd) return;
        commandHistory.push(cmd);
        historyIndex = commandHistory.length;
        if (cmd === "clear") {
          history.length = 0;
        } else {
          const resp = commands[cmd] || `command not found: ${cmd}`;
          history.push({ command: cmd, response: resp });
        }
        container.dispatchEvent(new CustomEvent("terminal:command", {
          bubbles: true,
          detail: { command: cmd }
        }));
        render();
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        if (historyIndex > 0) {
          historyIndex--;
          input.value = commandHistory[historyIndex] || "";
        }
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        if (historyIndex < commandHistory.length - 1) {
          historyIndex++;
          input.value = commandHistory[historyIndex] || "";
        } else {
          historyIndex = commandHistory.length;
          input.value = "";
        }
      }
    });
  }
  render();
}

// src/components/blockui.ts
var CSS6 = `
[data-theme="dark"] .laughtale-blockui-root {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
[data-theme="dark"] .blockui-mask {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
`;
function BlockUIIsland(container, props) {
  injectIslandStyle("blockui", CSS6);
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
      try {
        const fn = new Function("item", itemData.command);
        fn(itemData);
      } catch (err) {
        console.error("SplitButton command execution error:", err);
      }
    }
    if (itemData.url) {
      if (itemData.target === "_blank") {
        window.open(itemData.url, "_blank", "noopener,noreferrer");
      } else {
        window.location.href = itemData.url;
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
    const firstItem = container.querySelector(".p-orderlist-item");
    firstItem.click();
    const downBtn = container.querySelector(".btn-order-down");
    downBtn.click();
    const firstItemText = container.querySelector(".p-orderlist-item").textContent;
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
