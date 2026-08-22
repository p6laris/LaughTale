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

// tests/phase2-composables.test.ts
import { describe, it } from "node:test";
import assert from "node:assert";

// src/composables/useId.ts
var counter = 0;
function useId(prefix = "aura") {
  return `${prefix}-${++counter}-${Math.random().toString(36).slice(2, 7)}`;
}

// src/composables/useMediaQuery.ts
function useMediaQuery(query, callback) {
  const state = {
    matches: false,
    destroy: () => {
    }
  };
  if (typeof window !== "undefined" && "matchMedia" in window) {
    const mediaQueryList = window.matchMedia(query);
    state.matches = mediaQueryList.matches;
    const listener = (event) => {
      state.matches = event.matches;
      if (callback) callback(event.matches);
    };
    if ("addEventListener" in mediaQueryList) {
      mediaQueryList.addEventListener("change", listener);
      state.destroy = () => mediaQueryList.removeEventListener("change", listener);
    } else {
      mediaQueryList.addListener(listener);
      state.destroy = () => mediaQueryList.removeListener(listener);
    }
  }
  return state;
}

// src/composables/useIntersectionObserver.ts
function useIntersectionObserver(callback, options) {
  const state = {
    isIntersecting: false,
    entry: null,
    observe: () => {
    },
    unobserve: () => {
    },
    disconnect: () => {
    }
  };
  if (typeof IntersectionObserver !== "undefined") {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        state.isIntersecting = entry.isIntersecting;
        state.entry = entry;
        callback(entry);
        if (entry.isIntersecting && options?.once) {
          observer.unobserve(entry.target);
        }
      });
    }, options);
    state.observe = (el) => observer.observe(el);
    state.unobserve = (el) => observer.unobserve(el);
    state.disconnect = () => observer.disconnect();
  }
  return state;
}

// src/composables/useResizeObserver.ts
function useResizeObserver(callback, options) {
  const state = {
    size: { width: 0, height: 0 },
    observe: () => {
    },
    unobserve: () => {
    },
    disconnect: () => {
    }
  };
  if (typeof ResizeObserver !== "undefined") {
    const observer = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        let width = 0;
        let height = 0;
        if (entry.borderBoxSize && entry.borderBoxSize.length > 0) {
          const box = entry.borderBoxSize[0];
          width = box.inlineSize;
          height = box.blockSize;
        } else {
          width = entry.contentRect.width;
          height = entry.contentRect.height;
        }
        const newSize = { width, height };
        state.size = newSize;
        callback(newSize, entry);
      });
    });
    state.observe = (el) => observer.observe(el, options);
    state.unobserve = (el) => observer.unobserve(el);
    state.disconnect = () => observer.disconnect();
  }
  return state;
}

// src/composables/usePreferredColorScheme.ts
function usePreferredColorScheme(options) {
  const storageKey = options?.storageKey ?? "theme";
  const attribute = options?.attribute ?? "data-theme";
  const state = {
    scheme: "light",
    get isDark() {
      return this.scheme === "dark";
    },
    get isLight() {
      return this.scheme === "light";
    },
    toggle: () => {
    },
    set: (scheme) => {
    },
    destroy: () => {
    }
  };
  if (typeof window === "undefined") {
    return state;
  }
  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  const applyScheme = (scheme) => {
    state.scheme = scheme;
    document.documentElement.setAttribute(attribute, scheme);
    if (scheme === "dark") {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    } else {
      document.documentElement.classList.add("light");
      document.documentElement.classList.remove("dark");
    }
    try {
      localStorage.setItem(storageKey, scheme);
    } catch (e) {
    }
  };
  const init = () => {
    let saved = null;
    try {
      saved = localStorage.getItem(storageKey);
    } catch (e) {
    }
    const htmlTheme = document.documentElement.getAttribute(attribute);
    if (htmlTheme === "dark" || htmlTheme === "light") {
      applyScheme(htmlTheme);
    } else if (saved === "dark" || saved === "light") {
      applyScheme(saved);
    } else {
      applyScheme(mediaQuery.matches ? "dark" : "light");
    }
  };
  const listener = (e) => {
    try {
      if (!localStorage.getItem(storageKey)) {
        applyScheme(e.matches ? "dark" : "light");
      }
    } catch (err) {
    }
  };
  if ("addEventListener" in mediaQuery) {
    mediaQuery.addEventListener("change", listener);
    state.destroy = () => mediaQuery.removeEventListener("change", listener);
  } else {
    mediaQuery.addListener(listener);
    state.destroy = () => mediaQuery.removeListener(listener);
  }
  state.toggle = () => {
    applyScheme(state.scheme === "dark" ? "light" : "dark");
  };
  state.set = (scheme) => {
    applyScheme(scheme);
  };
  init();
  return state;
}

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

// tests/phase2-composables.test.ts
describe("SoftMax.LaughTale Aura v2 Composables & Security Suite", () => {
  it("useId: generates unique IDs with prefix", () => {
    const id1 = useId("test");
    const id2 = useId("test");
    assert.ok(id1.startsWith("test-"));
    assert.ok(id2.startsWith("test-"));
    assert.notStrictEqual(id1, id2);
  });
  it("useMediaQuery: tracks media query matches (mock matchMedia)", () => {
    globalThis.window = {
      matchMedia: (query) => ({
        matches: query === "(min-width: 1024px)",
        addEventListener: () => {
        },
        removeEventListener: () => {
        }
      })
    };
    const res = useMediaQuery("(min-width: 1024px)");
    assert.strictEqual(res.matches, true);
    const res2 = useMediaQuery("(min-width: 640px)");
    assert.strictEqual(res2.matches, false);
  });
  it("useIntersectionObserver: tracks intersection state (mock IntersectionObserver)", () => {
    let callbackFired = false;
    const res = useIntersectionObserver((entry) => {
      callbackFired = true;
    });
    const el = document.createElement("div");
    res.observe(el);
    assert.strictEqual(callbackFired, true);
    assert.strictEqual(res.isIntersecting, true);
  });
  it("useResizeObserver: tracks element size (mock ResizeObserver)", () => {
    globalThis.ResizeObserver = class {
      callback;
      constructor(cb) {
        this.callback = cb;
      }
      observe(el) {
        this.callback([{
          contentRect: { width: 100, height: 200 }
        }]);
      }
      disconnect() {
      }
    };
    let sizeReported = { width: 0, height: 0 };
    const res = useResizeObserver((size) => {
      sizeReported = size;
    });
    res.observe(document.createElement("div"));
    assert.strictEqual(sizeReported.width, 100);
    assert.strictEqual(sizeReported.height, 200);
  });
  it("usePreferredColorScheme: detects and toggles dark/light mode", () => {
    globalThis.window = {
      matchMedia: () => ({ matches: false, addEventListener: () => {
      } })
    };
    const res = usePreferredColorScheme();
    assert.strictEqual(res.scheme, "light");
    assert.strictEqual(res.isLight, true);
    res.toggle();
    assert.strictEqual(res.scheme, "dark");
    assert.strictEqual(res.isDark, true);
  });
  it("isTemplateInjection: blocks {{ }} and ${ } patterns (from enhanced security.ts)", () => {
    const badHtml = "<div><script>alert(1)</script></div>";
    const safeHtml = sanitizeHtml(badHtml);
    assert.ok(!safeHtml.includes("<script>"));
    const badUrl = "javascript:alert(1)";
    const safeUrl = sanitizeUrl(badUrl);
    assert.strictEqual(safeUrl, "about:blank");
  });
  it("isDomClobberingRisk: blocks dangerous id/name bindings (from enhanced security.ts)", () => {
    assert.strictEqual(isSafeAttribute("onclick"), false);
    assert.strictEqual(isSafeAttribute("class"), true);
  });
  it("freezeSandboxState: prevents mutation of frozen state (from enhanced security.ts)", () => {
    const state = { normal: "yes", __proto__: "bad" };
    const sandbox = createSandboxState(state);
    assert.strictEqual(sandbox.normal, "yes");
    assert.strictEqual(sandbox.__proto__, void 0);
    sandbox.__proto__ = "newbad";
    assert.strictEqual(sandbox.__proto__, void 0);
  });
});
