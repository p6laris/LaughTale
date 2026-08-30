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

// tests/csp.test.ts
import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";

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
function setCspNonce(nonce) {
  cachedNonce = nonce ? nonce.trim() : null;
}
function applyNonceToStyle(style) {
  const nonce = getCspNonce();
  if (nonce) {
    style.setAttribute("nonce", nonce);
  }
}
function applyNonceToScript(script) {
  const nonce = getCspNonce();
  if (nonce) {
    script.setAttribute("nonce", nonce);
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
function removeIslandStyle(islandName) {
  if (typeof document === "undefined") return;
  const existing = document.querySelector(`style[data-island-style="${islandName}"]`);
  if (existing) {
    existing.remove();
    injectedStyles.delete(islandName);
  }
}

// tests/csp.test.ts
describe("Content Security Policy (CSP) Nonce Discovery & Style Stamping Suite (LT-104)", () => {
  beforeEach(() => {
    setCspNonce(null);
    document.head.innerHTML = "";
    document.body.innerHTML = "";
    delete window.__LAUGHTALE_NONCE__;
  });
  it('getCspNonce: discovers nonce from <meta name="csp-nonce">', () => {
    const meta = document.createElement("meta");
    meta.setAttribute("name", "csp-nonce");
    meta.setAttribute("content", "meta-test-nonce-12345");
    document.head.appendChild(meta);
    assert.equal(getCspNonce(), "meta-test-nonce-12345");
  });
  it("getCspNonce: discovers nonce from window.__LAUGHTALE_NONCE__", () => {
    window.__LAUGHTALE_NONCE__ = "global-test-nonce-67890";
    assert.equal(getCspNonce(), "global-test-nonce-67890");
  });
  it('getCspNonce: discovers nonce from <script nonce="..."> element', () => {
    const script = document.createElement("script");
    script.setAttribute("nonce", "script-tag-nonce-abcde");
    document.head.appendChild(script);
    assert.equal(getCspNonce(), "script-tag-nonce-abcde");
  });
  it("applyNonceToStyle: stamps active nonce attribute onto <style> tag", () => {
    setCspNonce("active-style-nonce-xyz");
    const style = document.createElement("style");
    applyNonceToStyle(style);
    assert.equal(style.getAttribute("nonce"), "active-style-nonce-xyz");
  });
  it("applyNonceToScript: stamps active nonce attribute onto <script> tag", () => {
    setCspNonce("active-script-nonce-111");
    const script = document.createElement("script");
    applyNonceToScript(script);
    assert.equal(script.getAttribute("nonce"), "active-script-nonce-111");
  });
  it("injectIslandStyle: automatically attaches CSP nonce to dynamically injected stylesheets", () => {
    const islandName = "test-csp-button";
    removeIslandStyle(islandName);
    setCspNonce("injected-sheet-nonce-999");
    injectIslandStyle(islandName, ".p-button { background: purple; }");
    const injected = document.querySelector(`style[data-island-style="${islandName}"]`);
    assert.ok(injected, "Stylesheet was not injected into DOM");
    assert.equal(injected.getAttribute("nonce"), "injected-sheet-nonce-999");
  });
});
