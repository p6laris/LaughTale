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

// tests/security.test.ts
import { describe, it } from "node:test";
import assert from "node:assert/strict";

// src/directives/security.ts
var BLOCKED_PROPERTIES = /* @__PURE__ */ new Set([
  "__proto__",
  "prototype",
  "constructor",
  "window",
  "document",
  "globalThis",
  "location",
  "localStorage",
  "sessionStorage",
  "indexedDB",
  "cookie",
  "eval",
  "Function",
  "XMLHttpRequest",
  "fetch"
]);
var DANGEROUS_ATTRIBUTES = /* @__PURE__ */ new Set([
  "onerror",
  "onload",
  "onclick",
  "onmouseover",
  "onfocus",
  "onblur",
  "onchange",
  "onsubmit",
  "formaction"
]);
var DANGEROUS_PROTOCOLS = /^\s*(javascript|data|vbscript):/i;
function isSafeProperty(prop) {
  if (typeof prop !== "string") return true;
  return !BLOCKED_PROPERTIES.has(prop);
}
function sanitizeUrl(url) {
  if (typeof url !== "string") return "";
  const trimmed = url.trim();
  if (DANGEROUS_PROTOCOLS.test(trimmed)) {
    console.warn(`[SoftMax.LaughTale Security] Blocked dangerous URL protocol: "${trimmed}"`);
    return "about:blank";
  }
  return trimmed;
}
function isSafeAttribute(attrName) {
  const lower = attrName.toLowerCase();
  if (lower.startsWith("on") || DANGEROUS_ATTRIBUTES.has(lower)) {
    console.warn(`[SoftMax.LaughTale Security] Blocked dangerous dynamic attribute binding: "${attrName}"`);
    return false;
  }
  return true;
}
function sanitizeHtml(html) {
  if (typeof html !== "string") return "";
  if (typeof document !== "undefined") {
    const div = document.createElement("div");
    div.innerHTML = html;
    const dangerous = div.querySelectorAll("script, iframe, object, embed, applet, link, meta, style");
    dangerous.forEach((el) => el.remove());
    const allElements = div.querySelectorAll("*");
    allElements.forEach((el) => {
      for (const attr of Array.from(el.attributes)) {
        if (attr.name.toLowerCase().startsWith("on")) {
          el.removeAttribute(attr.name);
        } else if (["href", "src", "action"].includes(attr.name.toLowerCase())) {
          if (DANGEROUS_PROTOCOLS.test(attr.value)) {
            el.removeAttribute(attr.name);
          }
        }
      }
    });
    return div.innerHTML;
  }
  return html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "").replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "").replace(/\son\w+\s*=\s*(['"]).*?\1/gi, "");
}
function createSandboxState(state) {
  return new Proxy(state, {
    get(target, prop) {
      if (!isSafeProperty(prop)) {
        console.warn(`[SoftMax.LaughTale Security] Blocked restricted property access: "${String(prop)}"`);
        return void 0;
      }
      return target[prop];
    },
    set(target, prop, value) {
      if (!isSafeProperty(prop)) {
        console.warn(`[SoftMax.LaughTale Security] Blocked assignment to restricted property: "${String(prop)}"`);
        return true;
      }
      target[prop] = value;
      return true;
    },
    has(target, prop) {
      if (!isSafeProperty(prop)) {
        return false;
      }
      return prop in target;
    }
  });
}

// src/directives/reactivity.ts
var elementScopeMap = /* @__PURE__ */ new WeakMap();
function createReactiveScope(container, initialData) {
  const listeners = /* @__PURE__ */ new Set();
  const state = new Proxy(initialData, {
    set(target, prop, value) {
      if (!isSafeProperty(prop)) {
        console.warn(`[SoftMax.LaughTale Security] Blocked assignment to restricted property: "${String(prop)}"`);
        return true;
      }
      target[prop] = value;
      listeners.forEach((fn) => fn());
      return true;
    },
    get(target, prop) {
      if (!isSafeProperty(prop)) {
        console.warn(`[SoftMax.LaughTale Security] Blocked access to restricted property: "${String(prop)}"`);
        return void 0;
      }
      return target[prop];
    }
  });
  const scope = { state, listeners, container };
  elementScopeMap.set(container, scope);
  return scope;
}
function evaluateExpression(expr, state, extraContext = {}) {
  try {
    const sandboxState = createSandboxState(state);
    const contextKeys = Object.keys(extraContext).filter(isSafeProperty);
    const contextValues = contextKeys.map((k) => extraContext[k]);
    const fn = new Function(
      "state",
      "window",
      "document",
      "location",
      "cookie",
      ...contextKeys,
      `with(state) { return (${expr}); }`
    );
    return fn(sandboxState, void 0, void 0, void 0, void 0, ...contextValues);
  } catch (err) {
    console.error(`[SoftMax.LaughTale] Error evaluating expression "${expr}":`, err);
    return void 0;
  }
}

// tests/security.test.ts
describe("SoftMax.LaughTale Directive Security & Sandboxing Suite", () => {
  it("sanitizeUrl: neutralizes javascript: and data:text/html protocol attacks", () => {
    assert.equal(sanitizeUrl("javascript:alert(1)"), "about:blank");
    assert.equal(sanitizeUrl("  JAVASCRIPT:alert(document.cookie)  "), "about:blank");
    assert.equal(sanitizeUrl("data:text/html,<script>alert(1)</script>"), "about:blank");
    assert.equal(sanitizeUrl("https://softmax.dev/dashboard"), "https://softmax.dev/dashboard");
    assert.equal(sanitizeUrl("/doc/01-getting-started"), "/doc/01-getting-started");
  });
  it("isSafeAttribute: blocks dangerous inline event attributes", () => {
    assert.equal(isSafeAttribute("onerror"), false);
    assert.equal(isSafeAttribute("onload"), false);
    assert.equal(isSafeAttribute("onclick"), false);
    assert.equal(isSafeAttribute("formaction"), false);
    assert.equal(isSafeAttribute("href"), true);
    assert.equal(isSafeAttribute("class"), true);
    assert.equal(isSafeAttribute("style"), true);
  });
  it("isSafeProperty: prevents prototype pollution and global access", () => {
    assert.equal(isSafeProperty("__proto__"), false);
    assert.equal(isSafeProperty("prototype"), false);
    assert.equal(isSafeProperty("constructor"), false);
    assert.equal(isSafeProperty("cookie"), false);
    assert.equal(isSafeProperty("window"), false);
    assert.equal(isSafeProperty("userCount"), true);
  });
  it("sanitizeHtml: strips malicious script tags and event handlers", () => {
    const dirty = '<div onclick="alert(1)">Hello <script>alert("xss")</script></div>';
    const clean = sanitizeHtml(dirty);
    assert.ok(!clean.includes("<script>"));
    assert.ok(!clean.includes("onclick"));
    assert.ok(clean.includes("Hello"));
  });
  it("createSandboxState: blocks prototype pollution mutations on reactive state", () => {
    const container = document.createElement("div");
    const scope = createReactiveScope(container, { count: 1 });
    scope.state["__proto__"] = { hacked: true };
    assert.equal(Object.prototype.hacked, void 0);
    const res = evaluateExpression("count * 10", scope.state);
    assert.equal(res, 10);
  });
});
