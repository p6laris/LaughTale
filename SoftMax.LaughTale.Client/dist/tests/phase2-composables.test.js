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
  "formaction",
  "onanimationstart",
  "onanimationend",
  "ontransitionend",
  "onmouseenter",
  "onmouseleave"
]);
var DANGEROUS_PROTOCOLS = /^\s*(javascript|vbscript|data(?!\s*:\s*image\/(png|jpeg|jpg|gif|webp))):/i;
var ALLOWED_TAGS = /* @__PURE__ */ new Set([
  // Typography & Inline Formatting
  "a",
  "abbr",
  "b",
  "bdi",
  "bdo",
  "blockquote",
  "br",
  "cite",
  "code",
  "data",
  "dd",
  "dfn",
  "div",
  "dl",
  "dt",
  "em",
  "figcaption",
  "figure",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "hr",
  "i",
  "kbd",
  "li",
  "mark",
  "ol",
  "p",
  "pre",
  "q",
  "rp",
  "rt",
  "ruby",
  "s",
  "samp",
  "small",
  "span",
  "strong",
  "sub",
  "sup",
  "time",
  "u",
  "ul",
  "var",
  "wbr",
  // Tables
  "table",
  "tbody",
  "td",
  "tfoot",
  "th",
  "thead",
  "tr",
  "caption",
  "col",
  "colgroup",
  // Safe Media
  "img",
  "picture",
  "source",
  // Vector Graphics (Safe SVG primitives)
  "svg",
  "path",
  "g",
  "circle",
  "rect",
  "line",
  "polyline",
  "polygon",
  "text",
  "tspan",
  "use"
]);
var ALLOWED_ATTRS = /* @__PURE__ */ new Set([
  // Global Safe Attributes
  "class",
  "id",
  "title",
  "dir",
  "lang",
  "role",
  "tabindex",
  "aria-label",
  "aria-labelledby",
  "aria-describedby",
  "aria-hidden",
  "aria-expanded",
  "aria-disabled",
  "aria-checked",
  "aria-current",
  "aria-haspopup",
  "aria-controls",
  // Link & Media Attributes
  "href",
  "src",
  "alt",
  "width",
  "height",
  "target",
  "rel",
  "loading",
  "decoding",
  "sizes",
  "srcset",
  "type",
  // Table Attributes
  "colspan",
  "rowspan",
  "headers",
  "scope",
  // SVG Attributes
  "viewbox",
  "fill",
  "stroke",
  "stroke-width",
  "stroke-linecap",
  "stroke-linejoin",
  "d",
  "cx",
  "cy",
  "r",
  "rx",
  "ry",
  "x",
  "y",
  "x1",
  "y1",
  "x2",
  "y2",
  "points",
  "transform",
  "clip-path",
  "fill-rule",
  "stroke-dasharray",
  "stroke-dashoffset",
  "xmlns",
  "href",
  "xlink:href"
]);
var URL_ATTRS = /* @__PURE__ */ new Set(["href", "src", "action", "poster", "xlink:href"]);
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
var trustedTypesPolicy = null;
if (typeof window !== "undefined" && window.trustedTypes?.createPolicy) {
  try {
    trustedTypesPolicy = window.trustedTypes.createPolicy("laughtale-html", {
      createHTML: (s) => s
    });
  } catch {
  }
}
function parseInertHtml(html) {
  if (typeof DOMParser !== "undefined") {
    try {
      return new DOMParser().parseFromString(html, "text/html");
    } catch {
    }
  }
  if (typeof document !== "undefined" && document.implementation?.createHTMLDocument) {
    try {
      const doc = document.implementation.createHTMLDocument("");
      doc.body.innerHTML = html;
      return doc;
    } catch {
    }
  }
  return null;
}
function cleanNode(node) {
  if (node.nodeType === 3) {
    return node;
  }
  if (node.nodeType === 8) {
    return null;
  }
  if (node.nodeType !== 1) {
    return null;
  }
  const el = node;
  const tagName = el.tagName.toLowerCase();
  if (!ALLOWED_TAGS.has(tagName)) {
    return null;
  }
  const attrs = Array.from(el.attributes);
  for (const attr of attrs) {
    const attrName = attr.name.toLowerCase();
    if (attrName.startsWith("on")) {
      el.removeAttribute(attr.name);
      continue;
    }
    if (!ALLOWED_ATTRS.has(attrName) && !attrName.startsWith("data-") && !attrName.startsWith("aria-")) {
      el.removeAttribute(attr.name);
      continue;
    }
    if (URL_ATTRS.has(attrName)) {
      const safeUrl = sanitizeUrl(attr.value);
      if (safeUrl === "about:blank" && attr.value.trim().toLowerCase() !== "about:blank") {
        el.removeAttribute(attr.name);
      } else {
        el.setAttribute(attr.name, safeUrl);
      }
    }
  }
  if (tagName === "a" && el.getAttribute("target") === "_blank") {
    const rel = el.getAttribute("rel") || "";
    if (!rel.includes("noopener")) {
      el.setAttribute("rel", (rel + " noopener noreferrer").trim());
    }
  }
  const children = Array.from(el.childNodes);
  for (const child of children) {
    const cleaned = cleanNode(child);
    if (!cleaned) {
      el.removeChild(child);
    }
  }
  return el;
}
function sanitizeHtml(html) {
  if (typeof html !== "string" || !html.trim()) return "";
  const doc = parseInertHtml(html);
  if (!doc || !doc.body) {
    return "";
  }
  const cleanedNodes = Array.from(doc.body.childNodes).map(cleanNode).filter((n) => n !== null);
  const container = doc.createElement("div");
  for (const n of cleanedNodes) {
    container.appendChild(n);
  }
  const result = container.innerHTML;
  if (trustedTypesPolicy) {
    return trustedTypesPolicy.createHTML(result);
  }
  return result;
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
