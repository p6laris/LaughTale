var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/runtime/registry.ts
function defineIsland(name, loader) {
  registry.set(name, loader);
}
function hasIsland(name) {
  return registry.has(name);
}
function getIslandDefinition(name) {
  const loader = registry.get(name);
  return loader ? { name, loader } : void 0;
}
var registry;
var init_registry = __esm({
  "src/runtime/registry.ts"() {
    "use strict";
    registry = /* @__PURE__ */ new Map();
  }
});

// src/runtime/reviver.ts
function reviveTuple(raw) {
  if (Array.isArray(raw) && raw.length === 2 && typeof raw[0] === "number" && raw[0] in propTypes) {
    return propTypes[raw[0]](raw[1]);
  }
  if (typeof raw === "string" && ISO_DATE_REGEX.test(raw)) {
    const d = new Date(raw);
    if (!isNaN(d.getTime())) return d;
  }
  if (Array.isArray(raw)) {
    return reviveArray(raw);
  }
  if (typeof raw === "object" && raw !== null) {
    return reviveObject(raw);
  }
  return raw;
}
function reviveArray(raw) {
  return raw.map(reviveTuple);
}
function reviveObject(raw) {
  if (!raw || typeof raw !== "object") return raw;
  const result = {};
  for (const [key, value] of Object.entries(raw)) {
    result[key] = reviveTuple(value);
  }
  return result;
}
function parseAndReviveProps(rawJson) {
  if (!rawJson || rawJson.trim() === "" || rawJson === "{}") {
    return {};
  }
  try {
    const parsed = JSON.parse(rawJson);
    return reviveTuple(parsed);
  } catch (err) {
    console.error("[SoftMax.LaughTale] Failed to parse and revive island props:", err, rawJson);
    return {};
  }
}
var ISO_DATE_REGEX, propTypes;
var init_reviver = __esm({
  "src/runtime/reviver.ts"() {
    "use strict";
    ISO_DATE_REGEX = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})?)?$/;
    propTypes = {
      0: (val) => reviveObject(val),
      1: (val) => reviveArray(val),
      2: (val) => new RegExp(val),
      3: (val) => new Date(val),
      4: (val) => new Map(reviveArray(val)),
      5: (val) => new Set(reviveArray(val)),
      6: (val) => BigInt(val),
      7: (val) => new URL(val, window.location.origin),
      8: (val) => {
        if (typeof val === "string") {
          const binaryString = atob(val);
          const bytes = new Uint8Array(binaryString.length);
          for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }
          return bytes;
        }
        return new Uint8Array(val);
      }
    };
  }
});

// src/runtime/retry.ts
async function importWithRetry(importFnOrUrl, retries = 3, baseDelayMs = 1e3) {
  if (typeof importFnOrUrl === "function") {
    for (let attempt = 0; attempt < retries; attempt++) {
      try {
        return await importFnOrUrl();
      } catch (err) {
        if (attempt === retries - 1) throw err;
        const delay = baseDelayMs * Math.pow(2, attempt);
        console.warn(`[SoftMax.LaughTale] Island dynamic import failed. Retrying in ${delay}ms (Attempt ${attempt + 1}/${retries})...`, err);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }
  let url = importFnOrUrl;
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      return await import(
        /* @vite-ignore */
        url
      );
    } catch (err) {
      if (attempt === retries - 1) throw err;
      const delay = baseDelayMs * Math.pow(2, attempt);
      console.warn(`[SoftMax.LaughTale] Failed to fetch island script at ${url}. Retrying with cache-buster in ${delay}ms...`, err);
      await new Promise((resolve) => setTimeout(resolve, delay));
      const parsed = new URL(url, document.baseURI);
      parsed.searchParams.set("island-retry", Date.now().toString());
      url = parsed.toString();
    }
  }
  throw new Error(`[SoftMax.LaughTale] Permanent failure loading island module after ${retries} attempts.`);
}
var init_retry = __esm({
  "src/runtime/retry.ts"() {
    "use strict";
  }
});

// src/runtime/streaming.ts
function awaitStreamingReady(container) {
  const islandId = container.getAttribute("data-island-id") || container.getAttribute("data-island");
  const markerValue = `island:end:${islandId}`;
  if (document.readyState === "complete" || !container.hasAttribute("data-streaming")) {
    return Promise.resolve();
  }
  for (let node = container.lastChild; node; node = node.previousSibling) {
    if (node.nodeType === Node.COMMENT_NODE && (node.nodeValue?.trim() === markerValue || node.nodeValue?.trim() === "island:end")) {
      node.remove();
      return Promise.resolve();
    }
  }
  return new Promise((resolve) => {
    let isResolved = false;
    const onDone = () => {
      if (!isResolved) {
        isResolved = true;
        observer.disconnect();
        document.removeEventListener("DOMContentLoaded", onDone);
        resolve();
      }
    };
    const observer = new MutationObserver(() => {
      for (let node = container.lastChild; node; node = node.previousSibling) {
        if (node.nodeType === Node.COMMENT_NODE && (node.nodeValue?.trim() === markerValue || node.nodeValue?.trim() === "island:end")) {
          node.remove();
          onDone();
          break;
        }
      }
    });
    observer.observe(container, { childList: true });
    document.addEventListener("DOMContentLoaded", onDone);
  });
}
var init_streaming = __esm({
  "src/runtime/streaming.ts"() {
    "use strict";
  }
});

// src/runtime/hydrator.ts
function hydrateIsland(container) {
  if (container[HYDRATED_FLAG]) return;
  const name = container.getAttribute("data-island") || container.getAttribute("name");
  if (!name) return;
  const strategy = (container.getAttribute("data-hydrate") || container.getAttribute("hydrate") || "load").toLowerCase();
  const mediaQuery = container.getAttribute("data-media") || container.getAttribute("media");
  switch (strategy) {
    case "load":
      executeHydration(container, name);
      break;
    case "idle":
      hydrateIdle(container, name);
      break;
    case "visible":
      hydrateVisible(container, name);
      break;
    case "interaction":
      hydrateInteraction(container, name);
      break;
    case "media":
      hydrateMedia(container, name, mediaQuery);
      break;
    case "never":
      break;
    default:
      executeHydration(container, name);
  }
}
async function executeHydration(container, name) {
  if (container[HYDRATED_FLAG]) return;
  container[HYDRATED_FLAG] = true;
  const definition = getIslandDefinition(name);
  if (!definition) {
    console.warn(`[SoftMax.LaughTale] Island '${name}' is not registered in the client registry.`);
    return;
  }
  try {
    await awaitStreamingReady(container);
    const rawProps = container.getAttribute("data-props") || container.getAttribute("props-json") || container.getAttribute("props");
    const props = parseAndReviveProps(rawProps);
    const module = await importWithRetry(definition.loader);
    const mount = module.default || module;
    if (typeof mount !== "function") {
      console.error(`[SoftMax.LaughTale] Island '${name}' module does not export a mount function.`);
      return;
    }
    const unmount = mount(container, props);
    if (typeof unmount === "function") {
      container.addEventListener("laughtale:unmount", unmount, { once: true });
    }
    container.dispatchEvent(new CustomEvent("laughtale:hydrated", {
      bubbles: true,
      composed: true,
      detail: { name, strategy: container.getAttribute("data-hydrate") }
    }));
  } catch (error) {
    container[HYDRATED_FLAG] = false;
    console.error(`[SoftMax.LaughTale] Error hydrating island '${name}':`, error);
    container.dispatchEvent(new CustomEvent("laughtale:hydration-error", {
      bubbles: true,
      composed: true,
      detail: { name, error }
    }));
  }
}
function hydrateIdle(container, name) {
  if ("requestIdleCallback" in window) {
    window.requestIdleCallback(() => executeHydration(container, name), { timeout: 2e3 });
  } else {
    setTimeout(() => executeHydration(container, name), 200);
  }
}
function hydrateVisible(container, name) {
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        observer.disconnect();
        executeHydration(container, name);
        break;
      }
    }
  }, { rootMargin: "120px" });
  observer.observe(container);
  for (let i = 0; i < container.children.length; i++) {
    observer.observe(container.children[i]);
  }
}
function hydrateInteraction(container, name) {
  const events = ["mouseenter", "focusin", "touchstart", "click"];
  const onInteract = () => {
    events.forEach((e) => container.removeEventListener(e, onInteract));
    executeHydration(container, name);
  };
  events.forEach((e) => container.addEventListener(e, onInteract, { once: true, passive: true }));
}
function hydrateMedia(container, name, query) {
  if (!query) {
    executeHydration(container, name);
    return;
  }
  const mql = window.matchMedia(query);
  if (mql.matches) {
    executeHydration(container, name);
  } else {
    const handler = (e) => {
      if (e.matches) {
        mql.removeEventListener("change", handler);
        executeHydration(container, name);
      }
    };
    mql.addEventListener("change", handler);
  }
}
function initIslands(root = document) {
  const islands = root.querySelectorAll("[data-island], island, [hydrate], [data-hydrate]");
  islands.forEach(hydrateIsland);
}
var HYDRATED_FLAG;
var init_hydrator = __esm({
  "src/runtime/hydrator.ts"() {
    "use strict";
    init_registry();
    init_reviver();
    init_retry();
    init_streaming();
    HYDRATED_FLAG = "__laughtale_hydrated";
  }
});

// src/directives/security.ts
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
var BLOCKED_PROPERTIES, DANGEROUS_ATTRIBUTES, DANGEROUS_PROTOCOLS;
var init_security = __esm({
  "src/directives/security.ts"() {
    "use strict";
    BLOCKED_PROPERTIES = /* @__PURE__ */ new Set([
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
    DANGEROUS_ATTRIBUTES = /* @__PURE__ */ new Set([
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
    DANGEROUS_PROTOCOLS = /^\s*(javascript|data|vbscript):/i;
  }
});

// src/directives/reactivity.ts
var reactivity_exports = {};
__export(reactivity_exports, {
  bindElementReactivity: () => bindElementReactivity,
  createReactiveScope: () => createReactiveScope,
  evaluateExpression: () => evaluateExpression,
  executeStatement: () => executeStatement,
  getNearestScope: () => getNearestScope
});
function getNearestScope(element) {
  let current = element;
  while (current) {
    const scope = elementScopeMap.get(current);
    if (scope) return scope;
    current = current.parentElement;
  }
  return void 0;
}
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
function executeStatement(stmt, state, extraContext = {}) {
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
      `with(state) { ${stmt}; }`
    );
    fn(sandboxState, void 0, void 0, void 0, void 0, ...contextValues);
  } catch (err) {
    console.error(`[SoftMax.LaughTale] Error executing statement "${stmt}":`, err);
  }
}
function bindElementReactivity(element, scope) {
  for (const attr of Array.from(element.attributes)) {
    if (attr.name === "l-bind") {
      const expr = attr.value;
      const update = () => {
        const val = evaluateExpression(expr, scope.state);
        element.textContent = String(val ?? "");
      };
      scope.listeners.add(update);
      update();
    } else if (attr.name.startsWith("l-bind:")) {
      const targetAttr = attr.name.slice(7);
      if (!isSafeAttribute(targetAttr)) {
        continue;
      }
      const expr = attr.value;
      const update = () => {
        let val = evaluateExpression(expr, scope.state);
        if (["href", "src", "action"].includes(targetAttr.toLowerCase())) {
          val = sanitizeUrl(val);
        }
        if (val === false || val === null || val === void 0) {
          element.removeAttribute(targetAttr);
        } else if (val === true) {
          element.setAttribute(targetAttr, "");
        } else {
          element.setAttribute(targetAttr, String(val));
        }
      };
      scope.listeners.add(update);
      update();
    } else if (attr.name === "l-class") {
      const expr = attr.value;
      const update = () => {
        const val = evaluateExpression(expr, scope.state);
        if (typeof val === "object" && val !== null) {
          for (const [className, active] of Object.entries(val)) {
            element.classList.toggle(className, Boolean(active));
          }
        } else if (typeof val === "string") {
          element.className = val;
        }
      };
      scope.listeners.add(update);
      update();
    } else if (attr.name === "l-style") {
      const expr = attr.value;
      const update = () => {
        const val = evaluateExpression(expr, scope.state);
        if (typeof val === "object" && val !== null) {
          Object.assign(element.style, val);
        }
      };
      scope.listeners.add(update);
      update();
    }
  }
  if (element.hasAttribute("l-model")) {
    const propName = element.getAttribute("l-model");
    if (!isSafeProperty(propName)) {
      console.warn(`[SoftMax.LaughTale Security] Blocked l-model binding on restricted property: "${propName}"`);
      return;
    }
    const input = element;
    const update = () => {
      const val = scope.state[propName];
      if (input.type === "checkbox") {
        input.checked = Boolean(val);
      } else {
        input.value = val ?? "";
      }
    };
    scope.listeners.add(update);
    update();
    const eventName = input.type === "checkbox" || input.tagName === "SELECT" ? "change" : "input";
    input.addEventListener(eventName, () => {
      if (input.type === "checkbox") {
        scope.state[propName] = input.checked;
      } else if (input.type === "number") {
        scope.state[propName] = input.value === "" ? null : Number(input.value);
      } else {
        scope.state[propName] = input.value;
      }
    });
  }
}
var elementScopeMap;
var init_reactivity = __esm({
  "src/directives/reactivity.ts"() {
    "use strict";
    init_security();
    elementScopeMap = /* @__PURE__ */ new WeakMap();
  }
});

// src/directives/events.ts
function bindElementEvents(element) {
  const scope = getNearestScope(element);
  for (const attr of Array.from(element.attributes)) {
    if (attr.name.startsWith("l-on:")) {
      const rawEvent = attr.name.slice(5);
      const [eventName, ...modifiers] = rawEvent.split(".");
      const stmt = attr.value;
      let debounceMs = 0;
      let throttleMs = 0;
      for (let i = 0; i < modifiers.length; i++) {
        if (modifiers[i] === "debounce") {
          const next = modifiers[i + 1];
          debounceMs = next ? parseDurationMs(next) : 250;
        } else if (modifiers[i] === "throttle") {
          const next = modifiers[i + 1];
          throttleMs = next ? parseDurationMs(next) : 250;
        }
      }
      let timer = null;
      let lastExecution = 0;
      const executeHandler = (e) => {
        if (modifiers.includes("prevent")) e.preventDefault();
        if (modifiers.includes("stop")) e.stopPropagation();
        if (modifiers.includes("enter") && e.key !== "Enter") return;
        if (modifiers.includes("escape") && e.key !== "Escape") return;
        const emitFn = (channel, payload) => {
          window.dispatchEvent(new CustomEvent(`laughtale:${channel}`, { detail: payload, bubbles: true }));
        };
        const context = {
          $event: e,
          $el: element,
          $emit: emitFn
        };
        const activeState = scope ? scope.state : {};
        executeStatement(stmt, activeState, context);
      };
      const handler = (e) => {
        if (debounceMs > 0) {
          clearTimeout(timer);
          timer = setTimeout(() => executeHandler(e), debounceMs);
        } else if (throttleMs > 0) {
          const now = Date.now();
          if (now - lastExecution >= throttleMs) {
            lastExecution = now;
            executeHandler(e);
          }
        } else {
          executeHandler(e);
        }
      };
      const isWindow = modifiers.includes("window");
      const isDocument = modifiers.includes("document");
      const isOnce = modifiers.includes("once");
      const target = isWindow ? window : isDocument ? document : element;
      target.addEventListener(eventName, handler, { once: isOnce });
    }
    if (attr.name.startsWith("l-listen:")) {
      const channel = attr.name.slice(9);
      const stmt = attr.value;
      window.addEventListener(`laughtale:${channel}`, (e) => {
        const context = {
          $event: e.detail,
          $el: element,
          $emit: (c, p) => {
            window.dispatchEvent(new CustomEvent(`laughtale:${c}`, { detail: p, bubbles: true }));
          }
        };
        const activeState = scope ? scope.state : {};
        executeStatement(stmt, activeState, context);
      });
    }
    if (attr.name === "l-emit") {
      const channel = attr.value;
      element.addEventListener("click", () => {
        window.dispatchEvent(new CustomEvent(`laughtale:${channel}`, { bubbles: true }));
      });
    }
  }
}
function parseDurationMs(spec) {
  if (spec.endsWith("ms")) return parseFloat(spec) || 250;
  if (spec.endsWith("s")) return (parseFloat(spec) || 0.25) * 1e3;
  return parseFloat(spec) || 250;
}
var init_events = __esm({
  "src/directives/events.ts"() {
    "use strict";
    init_reactivity();
  }
});

// src/directives/htmx.ts
function bindServerAction(element) {
  let method = "GET";
  let url = "";
  if (element.hasAttribute("l-get")) {
    method = "GET";
    url = element.getAttribute("l-get");
  } else if (element.hasAttribute("l-post")) {
    method = "POST";
    url = element.getAttribute("l-post");
  } else if (element.hasAttribute("l-put")) {
    method = "PUT";
    url = element.getAttribute("l-put");
  } else if (element.hasAttribute("l-delete")) {
    method = "DELETE";
    url = element.getAttribute("l-delete");
  } else return;
  const targetSelector = element.getAttribute("l-target");
  const swapMode = element.getAttribute("l-swap") || "innerHTML";
  const indicatorSelector = element.getAttribute("l-indicator");
  const confirmMessage = element.getAttribute("l-confirm");
  const rawTrigger = element.getAttribute("l-trigger") || (element.tagName === "FORM" ? "submit" : element.tagName === "INPUT" ? "input" : "click");
  let delayMs = 0;
  const parts = rawTrigger.split(" ");
  const eventName = parts[0];
  for (const part of parts) {
    if (part.startsWith("delay:")) {
      delayMs = parseInt(part.slice(6), 10) || 0;
    }
  }
  let timeoutId = null;
  const executeRequest = async (e) => {
    if (e) e.preventDefault();
    if (confirmMessage && !window.confirm(confirmMessage)) {
      return;
    }
    const indicator = indicatorSelector ? document.querySelector(indicatorSelector) : null;
    if (indicator) indicator.style.display = "block";
    try {
      let requestUrl = url;
      let body = null;
      const headers = {
        "X-LaughTale-Request": "true"
      };
      if (element.tagName === "INPUT" || element.tagName === "SELECT" || element.tagName === "TEXTAREA") {
        const input = element;
        const paramName = input.name || "query";
        const separator = requestUrl.includes("?") ? "&" : "?";
        requestUrl = `${requestUrl}${separator}${encodeURIComponent(paramName)}=${encodeURIComponent(input.value)}`;
      } else if (element.tagName === "FORM") {
        const formData = new FormData(element);
        if (method === "GET") {
          const searchParams = new URLSearchParams(formData).toString();
          requestUrl = `${requestUrl}${requestUrl.includes("?") ? "&" : "?"}${searchParams}`;
        } else {
          body = formData;
        }
      }
      const response = await fetch(requestUrl, { method, body, headers });
      const html = await response.text();
      const target = targetSelector ? document.querySelector(targetSelector) : element;
      if (target) {
        switch (swapMode) {
          case "outerHTML":
            target.outerHTML = html;
            break;
          case "beforeend":
            target.insertAdjacentHTML("beforeend", html);
            break;
          case "afterbegin":
            target.insertAdjacentHTML("afterbegin", html);
            break;
          case "beforebegin":
            target.insertAdjacentHTML("beforebegin", html);
            break;
          case "afterend":
            target.insertAdjacentHTML("afterend", html);
            break;
          case "none":
            break;
          case "innerHTML":
          default:
            target.innerHTML = html;
            break;
        }
        initDirectives(target);
        initIslands(target);
      }
    } catch (err) {
      console.error("[SoftMax.LaughTale] Server fragment request failed:", err);
    } finally {
      if (indicator) indicator.style.display = "none";
    }
  };
  element.addEventListener(eventName, (e) => {
    if (delayMs > 0) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => executeRequest(e), delayMs);
    } else {
      executeRequest(e);
    }
  });
}
var init_htmx = __esm({
  "src/directives/htmx.ts"() {
    "use strict";
    init_directives();
    init_hydrator();
  }
});

// src/directives/masking.ts
function bindInputMask(input) {
  const pattern = input.getAttribute("l-mask");
  if (!pattern) return;
  input.addEventListener("input", () => {
    const raw = input.value.replace(/[^a-zA-Z0-9]/g, "");
    let formatted = "";
    let rawIdx = 0;
    for (let i = 0; i < pattern.length && rawIdx < raw.length; i++) {
      const maskChar = pattern[i];
      if (maskChar === "9") {
        while (rawIdx < raw.length && !/\d/.test(raw[rawIdx])) rawIdx++;
        if (rawIdx < raw.length) formatted += raw[rawIdx++];
      } else if (maskChar === "a") {
        while (rawIdx < raw.length && !/[a-zA-Z]/.test(raw[rawIdx])) rawIdx++;
        if (rawIdx < raw.length) formatted += raw[rawIdx++];
      } else if (maskChar === "*") {
        formatted += raw[rawIdx++];
      } else {
        formatted += maskChar;
        if (raw[rawIdx] === maskChar) rawIdx++;
      }
    }
    input.value = formatted;
  });
}
var init_masking = __esm({
  "src/directives/masking.ts"() {
    "use strict";
  }
});

// src/directives/utils.ts
function bindUtilityDirectives(element) {
  const scope = getNearestScope(element);
  if (element.hasAttribute("l-show")) {
    const expr = element.getAttribute("l-show");
    const originalDisplay = element.style.display || "";
    const update = () => {
      const state = scope ? scope.state : {};
      const isVisible = Boolean(evaluateExpression(expr, state));
      element.style.display = isVisible ? originalDisplay : "none";
    };
    if (scope) scope.listeners.add(update);
    update();
  }
  if (element.hasAttribute("l-hide")) {
    const expr = element.getAttribute("l-hide");
    const originalDisplay = element.style.display || "";
    const update = () => {
      const state = scope ? scope.state : {};
      const isHidden = Boolean(evaluateExpression(expr, state));
      element.style.display = isHidden ? "none" : originalDisplay;
    };
    if (scope) scope.listeners.add(update);
    update();
  }
  if (element.hasAttribute("l-copy")) {
    const selector = element.getAttribute("l-copy");
    const feedback = element.getAttribute("l-feedback") || "Copied!";
    const originalHtml = element.innerHTML;
    element.addEventListener("click", async () => {
      const target = document.querySelector(selector);
      const textToCopy = target ? target.value || target.textContent || "" : selector;
      try {
        await navigator.clipboard.writeText(textToCopy.trim());
        element.innerHTML = feedback;
        setTimeout(() => {
          element.innerHTML = originalHtml;
        }, 2e3);
      } catch (err) {
        console.error("[SoftMax.LaughTale] Failed to copy to clipboard:", err);
      }
    });
  }
  if (element.hasAttribute("l-toggle")) {
    const selector = element.getAttribute("l-toggle");
    const className = element.getAttribute("l-toggle-class") || "open";
    element.addEventListener("click", (e) => {
      e.stopPropagation();
      const target = document.querySelector(selector);
      if (target) {
        target.classList.toggle(className);
      }
    });
  }
}
var init_utils = __esm({
  "src/directives/utils.ts"() {
    "use strict";
    init_reactivity();
  }
});

// src/directives/hotkey.ts
function bindHotkeyDirectives(element) {
  const scope = getNearestScope(element);
  for (const attr of Array.from(element.attributes)) {
    if (attr.name === "l-hotkey" || attr.name === "l-shortcut" || attr.name.startsWith("l-hotkey.") || attr.name.startsWith("l-shortcut.")) {
      const isGlobal = attr.name.includes(".global") || !attr.name.includes(".local");
      const prevent = !attr.name.includes(".noprevent");
      const shortcutSpec = attr.value.trim().toLowerCase();
      const stmt = element.getAttribute("l-on:hotkey") || element.getAttribute("l-action");
      const handler = (e) => {
        if (matchesShortcut(e, shortcutSpec)) {
          if (prevent) e.preventDefault();
          if (stmt) {
            const activeState = scope ? scope.state : {};
            const context = {
              $event: e,
              $el: element,
              $emit: (channel, payload) => {
                window.dispatchEvent(new CustomEvent(`laughtale:${channel}`, { detail: payload, bubbles: true }));
              }
            };
            executeStatement(stmt, activeState, context);
          } else {
            if (element.tagName === "INPUT" || element.tagName === "TEXTAREA") {
              element.focus();
            } else {
              element.click();
            }
          }
        }
      };
      const target = isGlobal ? window : element;
      target.addEventListener("keydown", handler);
    }
  }
}
function matchesShortcut(e, spec) {
  const parts = spec.split("+").map((s) => s.trim());
  const needsCtrl = parts.includes("ctrl") || parts.includes("control") || parts.includes("cmd") || parts.includes("meta");
  const needsAlt = parts.includes("alt") || parts.includes("option");
  const needsShift = parts.includes("shift");
  const keyPart = parts.find((p) => !["ctrl", "control", "cmd", "meta", "alt", "option", "shift"].includes(p));
  const ctrlPressed = e.ctrlKey || e.metaKey;
  if (needsCtrl !== ctrlPressed) return false;
  if (needsAlt !== e.altKey) return false;
  if (needsShift !== e.shiftKey) return false;
  if (!keyPart) return true;
  const actualKey = e.key.toLowerCase();
  if (keyPart === "escape" || keyPart === "esc") return actualKey === "escape";
  if (keyPart === "enter" || keyPart === "return") return actualKey === "enter";
  if (keyPart === "space") return actualKey === " " || actualKey === "spacebar";
  return actualKey === keyPart;
}
var init_hotkey = __esm({
  "src/directives/hotkey.ts"() {
    "use strict";
    init_reactivity();
  }
});

// src/directives/tooltip.ts
function bindTooltipDirectives(element) {
  for (const attr of Array.from(element.attributes)) {
    if (attr.name === "l-tooltip" || attr.name.startsWith("l-tooltip.")) {
      const text = attr.value;
      if (!text) return;
      let position = "top";
      if (attr.name.includes(".bottom")) position = "bottom";
      else if (attr.name.includes(".left")) position = "left";
      else if (attr.name.includes(".right")) position = "right";
      let tooltipEl = null;
      const showTooltip = () => {
        if (tooltipEl) return;
        tooltipEl = document.createElement("div");
        tooltipEl.className = "aura-directive-tooltip";
        tooltipEl.textContent = text;
        tooltipEl.style.cssText = `
                    position: fixed;
                    z-index: 99999;
                    background: var(--p-surface-900, #1e293b);
                    color: var(--p-surface-0, #ffffff);
                    font-size: 0.75rem;
                    font-weight: 500;
                    padding: 0.35rem 0.65rem;
                    border-radius: 6px;
                    pointer-events: none;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                    opacity: 0;
                    transform: scale(0.95);
                    transition: opacity 150ms ease, transform 150ms ease;
                    white-space: nowrap;
                `;
        document.body.appendChild(tooltipEl);
        const rect = element.getBoundingClientRect();
        const tooltipRect = tooltipEl.getBoundingClientRect();
        let top = 0;
        let left = 0;
        switch (position) {
          case "top":
            top = rect.top - tooltipRect.height - 8;
            left = rect.left + (rect.width - tooltipRect.width) / 2;
            break;
          case "bottom":
            top = rect.bottom + 8;
            left = rect.left + (rect.width - tooltipRect.width) / 2;
            break;
          case "left":
            top = rect.top + (rect.height - tooltipRect.height) / 2;
            left = rect.left - tooltipRect.width - 8;
            break;
          case "right":
            top = rect.top + (rect.height - tooltipRect.height) / 2;
            left = rect.right + 8;
            break;
        }
        tooltipEl.style.top = `${Math.max(4, top)}px`;
        tooltipEl.style.left = `${Math.max(4, left)}px`;
        requestAnimationFrame(() => {
          if (tooltipEl) {
            tooltipEl.style.opacity = "1";
            tooltipEl.style.transform = "scale(1)";
          }
        });
      };
      const hideTooltip = () => {
        if (!tooltipEl) return;
        const el = tooltipEl;
        tooltipEl = null;
        el.style.opacity = "0";
        el.style.transform = "scale(0.95)";
        setTimeout(() => {
          if (el.parentNode) el.parentNode.removeChild(el);
        }, 150);
      };
      element.addEventListener("mouseenter", showTooltip);
      element.addEventListener("mouseleave", hideTooltip);
      element.addEventListener("focus", showTooltip);
      element.addEventListener("blur", hideTooltip);
    }
  }
}
var init_tooltip = __esm({
  "src/directives/tooltip.ts"() {
    "use strict";
  }
});

// src/directives/outside.ts
function bindOutsideClickDirectives(element) {
  const scope = getNearestScope(element);
  for (const attr of Array.from(element.attributes)) {
    if (attr.name === "l-outside" || attr.name === "l-click-outside") {
      const stmt = attr.value;
      document.addEventListener("click", (e) => {
        const target = e.target;
        if (!element.contains(target)) {
          const activeState = scope ? scope.state : {};
          const context = {
            $event: e,
            $el: element,
            $emit: (channel, payload) => {
              window.dispatchEvent(new CustomEvent(`laughtale:${channel}`, { detail: payload, bubbles: true }));
            }
          };
          executeStatement(stmt, activeState, context);
        }
      });
    }
  }
}
var init_outside = __esm({
  "src/directives/outside.ts"() {
    "use strict";
    init_reactivity();
  }
});

// src/directives/storage.ts
function bindStoragePersistence(element, scope) {
  for (const attr of Array.from(element.attributes)) {
    if (attr.name === "l-persist" || attr.name.startsWith("l-persist.") || attr.name === "l-sync-storage") {
      const key = attr.value || "laughtale_persisted_state";
      const useSession = attr.name.includes(".session");
      const storage = useSession ? sessionStorage : localStorage;
      try {
        const saved = storage.getItem(key);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (typeof parsed === "object" && parsed !== null) {
            Object.assign(scope.state, parsed);
          }
        }
      } catch (err) {
        console.warn(`[SoftMax.LaughTale] Failed to read persisted state for key "${key}":`, err);
      }
      let timer = null;
      const save = () => {
        clearTimeout(timer);
        timer = setTimeout(() => {
          try {
            storage.setItem(key, JSON.stringify(scope.state));
          } catch (err) {
            console.warn(`[SoftMax.LaughTale] Failed to save persisted state for key "${key}":`, err);
          }
        }, 150);
      };
      scope.listeners.add(save);
    }
  }
}
var init_storage = __esm({
  "src/directives/storage.ts"() {
    "use strict";
  }
});

// src/directives/poll.ts
function bindPollingDirectives(element) {
  const scope = getNearestScope(element);
  for (const attr of Array.from(element.attributes)) {
    if (attr.name.startsWith("l-poll")) {
      let intervalMs = 3e3;
      const parts = attr.name.split(".");
      for (const part of parts) {
        if (part.endsWith("s") && !part.endsWith("ms")) {
          const sec = parseFloat(part);
          if (!isNaN(sec)) intervalMs = sec * 1e3;
        } else if (part.endsWith("ms")) {
          const ms = parseFloat(part);
          if (!isNaN(ms)) intervalMs = ms;
        }
      }
      const stmt = attr.value;
      const runPoll = () => {
        if (!document.body.contains(element)) {
          clearInterval(intervalId);
          return;
        }
        if (stmt) {
          const activeState = scope ? scope.state : {};
          const context = {
            $el: element,
            $emit: (channel, payload) => {
              window.dispatchEvent(new CustomEvent(`laughtale:${channel}`, { detail: payload, bubbles: true }));
            }
          };
          executeStatement(stmt, activeState, context);
        } else {
          element.dispatchEvent(new CustomEvent("laughtale:poll-trigger", { bubbles: true }));
        }
      };
      const intervalId = setInterval(runPoll, intervalMs);
    }
  }
}
var init_poll = __esm({
  "src/directives/poll.ts"() {
    "use strict";
    init_reactivity();
  }
});

// src/directives/intersect.ts
function bindIntersectionDirectives(element) {
  const scope = getNearestScope(element);
  for (const attr of Array.from(element.attributes)) {
    if (attr.name === "l-intersect" || attr.name.startsWith("l-intersect.") || attr.name === "l-viewport") {
      const isOnce = attr.name.includes(".once");
      const isHalf = attr.name.includes(".half");
      const stmt = attr.value;
      const threshold = isHalf ? 0.5 : 0.1;
      const observer = new IntersectionObserver((entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            if (stmt) {
              const activeState = scope ? scope.state : {};
              const context = {
                $event: entry,
                $el: element,
                $emit: (channel, payload) => {
                  window.dispatchEvent(new CustomEvent(`laughtale:${channel}`, { detail: payload, bubbles: true }));
                }
              };
              executeStatement(stmt, activeState, context);
            }
            element.dispatchEvent(new CustomEvent("laughtale:intersect", { bubbles: true, detail: entry }));
            if (isOnce) {
              observer.disconnect();
            }
          }
        }
      }, { threshold });
      observer.observe(element);
    }
  }
}
var init_intersect = __esm({
  "src/directives/intersect.ts"() {
    "use strict";
    init_reactivity();
  }
});

// src/directives/scroll.ts
function bindScrollToDirectives(element) {
  for (const attr of Array.from(element.attributes)) {
    if (attr.name === "l-scroll-to" || attr.name.startsWith("l-scroll-to.")) {
      const target = attr.value.trim();
      element.addEventListener("click", (e) => {
        e.preventDefault();
        if (target === "top") {
          window.scrollTo({ top: 0, behavior: "smooth" });
        } else if (target === "bottom") {
          window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
        } else if (target) {
          const targetEl = document.querySelector(target);
          if (targetEl) {
            targetEl.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }
      });
    }
  }
}
var init_scroll = __esm({
  "src/directives/scroll.ts"() {
    "use strict";
  }
});

// src/directives/badge.ts
function bindBadgeDirectives(element) {
  for (const attr of Array.from(element.attributes)) {
    if (attr.name === "l-badge" || attr.name.startsWith("l-badge.")) {
      const isDot = attr.name.includes(".dot");
      const value = attr.value;
      let severity = "danger";
      if (attr.name.includes(".success")) severity = "success";
      else if (attr.name.includes(".warning")) severity = "warning";
      else if (attr.name.includes(".info")) severity = "info";
      else if (attr.name.includes(".slate") || attr.name.includes(".secondary")) severity = "slate";
      const compStyle = window.getComputedStyle(element);
      if (compStyle.position === "static") {
        element.style.position = "relative";
      }
      const badge = document.createElement("span");
      badge.className = `aura-directive-badge badge-${severity}`;
      let bg = "var(--p-red-500, #ef4444)";
      let color = "#ffffff";
      if (severity === "success") bg = "var(--p-emerald-500, #10b981)";
      else if (severity === "warning") bg = "var(--p-amber-500, #f59e0b)";
      else if (severity === "info") bg = "var(--p-blue-500, #3b82f6)";
      else if (severity === "slate") {
        bg = "var(--p-surface-600, #475569)";
        color = "#ffffff";
      }
      if (isDot) {
        badge.style.cssText = `
                    position: absolute;
                    top: -2px;
                    right: -2px;
                    width: 8px;
                    height: 8px;
                    background: ${bg};
                    border-radius: 50%;
                    border: 2px solid var(--p-surface-0, #ffffff);
                    pointer-events: none;
                `;
      } else {
        badge.textContent = value || "";
        badge.style.cssText = `
                    position: absolute;
                    top: -6px;
                    right: -6px;
                    min-width: 18px;
                    height: 18px;
                    line-height: 18px;
                    padding: 0 5px;
                    font-size: 0.6875rem;
                    font-weight: 700;
                    text-align: center;
                    background: ${bg};
                    color: ${color};
                    border-radius: 9999px;
                    border: 2px solid var(--p-surface-0, #ffffff);
                    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
                    pointer-events: none;
                `;
      }
      element.appendChild(badge);
    }
  }
}
var init_badge = __esm({
  "src/directives/badge.ts"() {
    "use strict";
  }
});

// src/directives/teleport.ts
function bindTeleportDirectives(element) {
  for (const attr of Array.from(element.attributes)) {
    if (attr.name === "l-teleport") {
      const targetSelector = attr.value || "body";
      const targetContainer = document.querySelector(targetSelector);
      if (targetContainer && targetContainer !== element.parentElement) {
        targetContainer.appendChild(element);
      }
    }
  }
}
var init_teleport = __esm({
  "src/directives/teleport.ts"() {
    "use strict";
  }
});

// src/directives/index.ts
function initDirectives(root = document) {
  const stateElements = root.querySelectorAll("[l-state]");
  stateElements.forEach((el) => {
    const rawJson = el.getAttribute("l-state");
    try {
      const initialData = rawJson ? JSON.parse(rawJson) : {};
      const scope = createReactiveScope(el, initialData);
      bindStoragePersistence(el, scope);
    } catch (err) {
      console.error("[SoftMax.LaughTale] Invalid JSON in l-state:", rawJson, err);
    }
  });
  const allElements = root.querySelectorAll("*");
  allElements.forEach((el) => {
    for (const attr of Array.from(el.attributes)) {
      if (attr.name === "l-bind" || attr.name.startsWith("l-bind:") || attr.name === "l-model" || attr.name === "l-class" || attr.name === "l-style") {
        Promise.resolve().then(() => (init_reactivity(), reactivity_exports)).then(({ getNearestScope: getNearestScope2 }) => {
          const nearest = getNearestScope2(el);
          if (nearest) bindElementReactivity(el, nearest);
        });
        break;
      }
    }
    bindElementEvents(el);
    if (el.hasAttribute("l-get") || el.hasAttribute("l-post") || el.hasAttribute("l-put") || el.hasAttribute("l-delete")) {
      bindServerAction(el);
    }
    if (el.hasAttribute("l-mask") && el.tagName === "INPUT") {
      bindInputMask(el);
    }
    bindUtilityDirectives(el);
    bindHotkeyDirectives(el);
    bindTooltipDirectives(el);
    bindOutsideClickDirectives(el);
    bindPollingDirectives(el);
    bindIntersectionDirectives(el);
    bindScrollToDirectives(el);
    bindBadgeDirectives(el);
    bindTeleportDirectives(el);
  });
}
var init_directives = __esm({
  "src/directives/index.ts"() {
    "use strict";
    init_reactivity();
    init_events();
    init_htmx();
    init_masking();
    init_utils();
    init_hotkey();
    init_tooltip();
    init_outside();
    init_storage();
    init_poll();
    init_intersect();
    init_scroll();
    init_badge();
    init_teleport();
    init_security();
    init_reactivity();
    if (typeof document !== "undefined") {
      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", () => initDirectives());
      } else {
        initDirectives();
      }
    }
  }
});

// src/runtime/router.ts
function enableViewTransitions() {
  if (isRouterActive || typeof window === "undefined") return;
  isRouterActive = true;
  document.addEventListener("click", handleLinkClick);
  window.addEventListener("popstate", handlePopState);
}
async function handleLinkClick(e) {
  if (e.button !== 0 || e.ctrlKey || e.metaKey || e.altKey || e.shiftKey || e.defaultPrevented) {
    return;
  }
  const anchor = e.target.closest("a");
  if (!anchor || !anchor.href) return;
  const url = new URL(anchor.href, window.location.href);
  if (url.origin !== window.location.origin) return;
  if (anchor.target && anchor.target !== "_self") return;
  if (anchor.hasAttribute("download") || anchor.getAttribute("data-no-transition") !== null) return;
  const currentPath = window.location.pathname.toLowerCase().replace(/\/$/, "");
  const targetPath = url.pathname.toLowerCase().replace(/\/$/, "");
  if ((currentPath === targetPath || !targetPath) && url.hash) {
    return;
  }
  e.preventDefault();
  await navigateTo(url.href, true);
}
async function handlePopState() {
  await navigateTo(window.location.href, false);
}
async function navigateTo(urlStr, pushState = true) {
  try {
    const response = await fetch(urlStr, {
      headers: {
        "X-Requested-With": "SoftMaxIslands-ViewTransition"
      }
    });
    if (!response.ok) {
      window.location.href = urlStr;
      return;
    }
    const htmlText = await response.text();
    const parser = new DOMParser();
    const newDoc = parser.parseFromString(htmlText, "text/html");
    const persistentElements = /* @__PURE__ */ new Map();
    document.querySelectorAll("[data-persist]").forEach((el) => {
      const id = el.dataset.persist;
      if (id) persistentElements.set(id, el);
    });
    const updateDom = () => {
      document.title = newDoc.title;
      document.body.innerHTML = newDoc.body.innerHTML;
      persistentElements.forEach((liveEl, id) => {
        const targetSlot = document.querySelector(`[data-persist="${id}"]`);
        if (targetSlot && targetSlot.parentNode) {
          targetSlot.parentNode.replaceChild(liveEl, targetSlot);
        }
      });
      initIslands(document.body);
      initDirectives(document.body);
      const targetUrl = new URL(urlStr, window.location.origin);
      if (targetUrl.hash) {
        const targetEl = document.querySelector(targetUrl.hash);
        if (targetEl) targetEl.scrollIntoView({ behavior: "smooth" });
      } else {
        window.scrollTo({ top: 0, behavior: "instant" });
      }
      if (pushState) {
        window.history.pushState({}, "", urlStr);
      }
      window.dispatchEvent(new CustomEvent("island:page-loaded", { detail: { url: urlStr } }));
    };
    if ("startViewTransition" in document) {
      document.startViewTransition(updateDom);
    } else {
      updateDom();
    }
  } catch (err) {
    console.error("[SoftMax.LaughTale] View transition failed, falling back to full navigation:", err);
    window.location.href = urlStr;
  }
}
var isRouterActive;
var init_router = __esm({
  "src/runtime/router.ts"() {
    "use strict";
    init_hydrator();
    init_directives();
    isRouterActive = false;
  }
});

// src/runtime/slots.ts
function getSlot(container, name = "default") {
  return container.querySelector(`[data-slot="${name}"]`);
}
function extractSlotContent(container, name = "default") {
  const slotEl = getSlot(container, name);
  if (!slotEl) return "";
  return slotEl.innerHTML;
}
var init_slots = __esm({
  "src/runtime/slots.ts"() {
    "use strict";
  }
});

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
var init_csp = __esm({
  "src/directives/csp.ts"() {
    "use strict";
  }
});

// src/runtime/styles.ts
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
var injectedStyles;
var init_styles = __esm({
  "src/runtime/styles.ts"() {
    "use strict";
    init_csp();
    injectedStyles = /* @__PURE__ */ new Set();
  }
});

// src/runtime/events.ts
var init_events2 = __esm({
  "src/runtime/events.ts"() {
    "use strict";
  }
});

// src/runtime/state.ts
var init_state = __esm({
  "src/runtime/state.ts"() {
    "use strict";
  }
});

// src/adapters/vanilla.ts
function createVanillaIsland(mount) {
  return mount;
}
var init_vanilla = __esm({
  "src/adapters/vanilla.ts"() {
    "use strict";
  }
});

// src/adapters/preact.ts
function createPreactIsland(Component, options = {}) {
  return async (container, props) => {
    try {
      const preact = await import("preact");
      const h = preact.h || preact.default?.h;
      const render = preact.render || preact.default?.render;
      if (render && h) {
        render(h(Component, props), container);
        return () => render(null, container);
      }
    } catch {
      console.warn("[SoftMax.LaughTale] Preact package not found in bundle. Rendering component directly.");
      if (typeof Component === "function") {
        return Component(container, props);
      }
    }
  };
}
var init_preact = __esm({
  "src/adapters/preact.ts"() {
    "use strict";
  }
});

// src/icons/lucide.ts
function getLucideIcon(name) {
  if (!name) return "";
  const camel = name.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
  const dict = LucideIcons;
  return dict[name] || dict[camel] || dict[name.toLowerCase()] || "";
}
var LucideIcons;
var init_lucide = __esm({
  "src/icons/lucide.ts"() {
    "use strict";
    LucideIcons = {
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
      user: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
      mapPin: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`,
      globe: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>`,
      dollarSign: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>`,
      phone: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`,
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
      code: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`,
      moreHorizontal: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>`,
      sun: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>`,
      moon: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>`,
      home: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
      database: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5V19A9 3 0 0 0 21 19V5"/><path d="M3 12A9 3 0 0 0 21 12"/></svg>`,
      compass: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>`,
      image: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>`,
      fileSpreadsheet: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M8 13h2"/><path d="M14 13h2"/><path d="M8 17h2"/><path d="M14 17h2"/></svg>`,
      columns3: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M9 3v18"/><path d="M15 3v18"/></svg>`,
      listFilter: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M7 12h10"/><path d="M10 18h4"/></svg>`,
      arrowLeftRight: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3 4 7l4 4"/><path d="M4 7h16"/><path d="m16 21 4-4-4-4"/><path d="M20 17H4"/></svg>`,
      layoutGrid: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>`,
      shieldAlert: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>`,
      edit3: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>`,
      folderTree: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1h-2.5a1 1 0 0 1-.8-.4l-.9-1.2A1 1 0 0 0 15 3h-2a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1Z"/><path d="M20 21a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1h-2.9a1 1 0 0 1-.88-.53l-.42-.85a1 1 0 0 0-.9-.62H13a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1Z"/><path d="M3 5v14a2 2 0 0 0 2 2h7"/><path d="M3 12h5"/></svg>`,
      table2: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18"/></svg>`,
      grid: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M3 15h18"/><path d="M9 3v18"/><path d="M15 3v18"/></svg>`,
      galleryThumbnails: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="14" x="3" y="3" rx="2"/><path d="M4 21h1"/><path d="M9 21h1"/><path d="M14 21h1"/><path d="M19 21h1"/></svg>`,
      gauge: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 14 4-4"/><path d="M3.34 19a10 10 0 1 1 17.32 0"/></svg>`,
      loader2: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>`,
      messageSquare: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,
      menu: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>`,
      edit: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>`,
      gitBranch: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="6" x2="6" y1="3" y2="15"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M18 9a9 9 0 0 1-9 9"/></svg>`,
      alertCircle: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>`
    };
  }
});

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
var init_useDisclosure = __esm({
  "src/composables/useDisclosure.ts"() {
    "use strict";
  }
});

// src/composables/useFocusTrap.ts
function useFocusTrap(container, options = {}) {
  let previouslyFocusedElement = null;
  let isActive = false;
  function getFocusableElements() {
    return Array.from(container.querySelectorAll(FOCUSABLE_SELECTOR)).filter((el) => el.offsetParent !== null || el.offsetWidth > 0 || el.offsetHeight > 0);
  }
  function handleKeyDown(e) {
    if (!isActive || e.key !== "Tab") return;
    const focusable = getFocusableElements();
    if (focusable.length === 0) {
      e.preventDefault();
      return;
    }
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey) {
      if (document.activeElement === first || !container.contains(document.activeElement)) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last || !container.contains(document.activeElement)) {
        e.preventDefault();
        first.focus();
      }
    }
  }
  function activate() {
    if (isActive) return;
    isActive = true;
    previouslyFocusedElement = document.activeElement;
    document.addEventListener("keydown", handleKeyDown);
    if (options.autoFocus !== false) {
      setTimeout(() => {
        if (options.initialFocusElement) {
          options.initialFocusElement.focus();
        } else {
          const focusable = getFocusableElements();
          if (focusable.length > 0) focusable[0].focus();
          else container.focus();
        }
      }, 10);
    }
  }
  function deactivate() {
    if (!isActive) return;
    isActive = false;
    document.removeEventListener("keydown", handleKeyDown);
    if (options.restoreFocus !== false && previouslyFocusedElement && typeof previouslyFocusedElement.focus === "function") {
      previouslyFocusedElement.focus();
    }
  }
  return { activate, deactivate };
}
var FOCUSABLE_SELECTOR;
var init_useFocusTrap = __esm({
  "src/composables/useFocusTrap.ts"() {
    "use strict";
    FOCUSABLE_SELECTOR = [
      "a[href]",
      "button:not([disabled])",
      "input:not([disabled])",
      "select:not([disabled])",
      "textarea:not([disabled])",
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable="true"]'
    ].join(",");
  }
});

// src/composables/useFloatingPosition.ts
function useFloatingPosition(reference, floating, options = {}) {
  const offset = options.offset ?? 6;
  const autoFlip = options.autoFlip !== false;
  const viewportPadding = options.viewportPadding ?? 8;
  let initialPlacement = options.placement ?? "bottom-start";
  function computePosition() {
    const refRect = reference.getBoundingClientRect();
    const floatRect = floating.getBoundingClientRect();
    const vpWidth = window.innerWidth;
    const vpHeight = window.innerHeight;
    let placement = initialPlacement;
    if (autoFlip) {
      const spaceTop = refRect.top;
      const spaceBottom = vpHeight - refRect.bottom;
      const spaceLeft = refRect.left;
      const spaceRight = vpWidth - refRect.right;
      if (placement.startsWith("bottom") && spaceBottom < floatRect.height + offset && spaceTop > spaceBottom) {
        placement = placement.replace("bottom", "top");
      } else if (placement.startsWith("top") && spaceTop < floatRect.height + offset && spaceBottom > spaceTop) {
        placement = placement.replace("top", "bottom");
      } else if (placement.startsWith("right") && spaceRight < floatRect.width + offset && spaceLeft > spaceRight) {
        placement = placement.replace("right", "left");
      } else if (placement.startsWith("left") && spaceLeft < floatRect.width + offset && spaceRight > spaceLeft) {
        placement = placement.replace("left", "right");
      }
    }
    let x = 0;
    let y = 0;
    switch (placement) {
      case "bottom":
        x = refRect.left + (refRect.width - floatRect.width) / 2;
        y = refRect.bottom + offset;
        break;
      case "bottom-start":
        x = refRect.left;
        y = refRect.bottom + offset;
        break;
      case "bottom-end":
        x = refRect.right - floatRect.width;
        y = refRect.bottom + offset;
        break;
      case "top":
        x = refRect.left + (refRect.width - floatRect.width) / 2;
        y = refRect.top - floatRect.height - offset;
        break;
      case "top-start":
        x = refRect.left;
        y = refRect.top - floatRect.height - offset;
        break;
      case "top-end":
        x = refRect.right - floatRect.width;
        y = refRect.top - floatRect.height - offset;
        break;
      case "left":
        x = refRect.left - floatRect.width - offset;
        y = refRect.top + (refRect.height - floatRect.height) / 2;
        break;
      case "left-start":
        x = refRect.left - floatRect.width - offset;
        y = refRect.top;
        break;
      case "left-end":
        x = refRect.left - floatRect.width - offset;
        y = refRect.bottom - floatRect.height;
        break;
      case "right":
        x = refRect.right + offset;
        y = refRect.top + (refRect.height - floatRect.height) / 2;
        break;
      case "right-start":
        x = refRect.right + offset;
        y = refRect.top;
        break;
      case "right-end":
        x = refRect.right + offset;
        y = refRect.bottom - floatRect.height;
        break;
    }
    x = Math.max(viewportPadding, Math.min(vpWidth - floatRect.width - viewportPadding, x));
    y = Math.max(viewportPadding, Math.min(vpHeight - floatRect.height - viewportPadding, y));
    return { x, y, actualPlacement: placement };
  }
  function update() {
    const { x, y } = computePosition();
    floating.style.position = "fixed";
    floating.style.left = `${Math.round(x)}px`;
    floating.style.top = `${Math.round(y)}px`;
  }
  return { update, computePosition };
}
var init_useFloatingPosition = __esm({
  "src/composables/useFloatingPosition.ts"() {
    "use strict";
  }
});

// src/composables/useVirtualizer.ts
function useVirtualizer(options) {
  const overscan = options.overscan ?? 3;
  let scrollTop = 0;
  function getItemOffset(index) {
    let offset = 0;
    for (let i = 0; i < index; i++) {
      offset += options.estimateSize(i);
    }
    return offset;
  }
  function getTotalSize() {
    let total = 0;
    for (let i = 0; i < options.count; i++) {
      total += options.estimateSize(i);
    }
    return total;
  }
  function getVirtualItems() {
    const scrollEl = options.getScrollElement();
    const viewportHeight = scrollEl ? scrollEl.clientHeight : 400;
    scrollTop = scrollEl ? scrollEl.scrollTop : 0;
    const total = options.count;
    if (total === 0) return [];
    let startIndex = 0;
    let runningOffset = 0;
    while (startIndex < total && runningOffset + options.estimateSize(startIndex) < scrollTop) {
      runningOffset += options.estimateSize(startIndex);
      startIndex++;
    }
    let endIndex = startIndex;
    let currentBottom = runningOffset;
    while (endIndex < total && currentBottom < scrollTop + viewportHeight) {
      currentBottom += options.estimateSize(endIndex);
      endIndex++;
    }
    startIndex = Math.max(0, startIndex - overscan);
    endIndex = Math.min(total - 1, endIndex + overscan);
    const items = [];
    let itemStart = getItemOffset(startIndex);
    for (let i = startIndex; i <= endIndex; i++) {
      const size = options.estimateSize(i);
      items.push({
        index: i,
        start: itemStart,
        size,
        end: itemStart + size
      });
      itemStart += size;
    }
    return items;
  }
  return {
    getTotalSize,
    getVirtualItems
  };
}
var init_useVirtualizer = __esm({
  "src/composables/useVirtualizer.ts"() {
    "use strict";
  }
});

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
var init_useDragGesture = __esm({
  "src/composables/useDragGesture.ts"() {
    "use strict";
  }
});

// src/composables/useHotkeys.ts
function useHotkeys(hotkeys, targetNode = typeof document !== "undefined" ? document : null) {
  if (!targetNode) return { destroy: () => {
  } };
  function matchesCombo(e, comboStr) {
    const parts = comboStr.toLowerCase().split("+").map((p) => p.trim());
    const hasCtrl = parts.includes("ctrl") || parts.includes("control");
    const hasMeta = parts.includes("meta") || parts.includes("cmd") || parts.includes("command");
    const hasShift = parts.includes("shift");
    const hasAlt = parts.includes("alt");
    if (hasCtrl && !e.ctrlKey) return false;
    if (hasMeta && !e.metaKey) return false;
    if (hasShift && !e.shiftKey) return false;
    if (hasAlt && !e.altKey) return false;
    const mainKey = parts.find((p) => !["ctrl", "control", "meta", "cmd", "command", "shift", "alt"].includes(p));
    if (!mainKey) return true;
    const key = e.key.toLowerCase();
    if (mainKey === "esc" || mainKey === "escape") return key === "escape";
    if (mainKey === "enter") return key === "enter";
    if (mainKey === "space") return key === " " || key === "space";
    if (mainKey === "slash") return key === "/";
    return key === mainKey;
  }
  function isInputElement(el) {
    if (!el) return false;
    const tag = el.tagName.toLowerCase();
    return tag === "input" || tag === "textarea" || tag === "select" || el.hasAttribute("contenteditable");
  }
  function handleKeyDown(e) {
    const keyEvent = e;
    const target = keyEvent.target;
    const isInput = isInputElement(target);
    for (const item of hotkeys) {
      if (isInput && !item.allowInInputs && item.combo !== "escape") {
        continue;
      }
      if (matchesCombo(keyEvent, item.combo)) {
        keyEvent.preventDefault();
        item.handler(keyEvent);
        break;
      }
    }
  }
  targetNode.addEventListener("keydown", handleKeyDown);
  return {
    destroy: () => {
      targetNode.removeEventListener("keydown", handleKeyDown);
    }
  };
}
var init_useHotkeys = __esm({
  "src/composables/useHotkeys.ts"() {
    "use strict";
  }
});

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
var init_useClickOutside = __esm({
  "src/composables/useClickOutside.ts"() {
    "use strict";
  }
});

// src/composables/useScrollLock.ts
function useScrollLock() {
  function lock() {
    if (typeof document === "undefined") return;
    if (lockCount === 0) {
      originalOverflow = document.body.style.overflow;
      originalPaddingRight = document.body.style.paddingRight;
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = "hidden";
      if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`;
      }
    }
    lockCount++;
  }
  function unlock() {
    if (typeof document === "undefined") return;
    lockCount = Math.max(0, lockCount - 1);
    if (lockCount === 0) {
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
    }
  }
  return { lock, unlock };
}
var lockCount, originalOverflow, originalPaddingRight;
var init_useScrollLock = __esm({
  "src/composables/useScrollLock.ts"() {
    "use strict";
    lockCount = 0;
    originalOverflow = "";
    originalPaddingRight = "";
  }
});

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
var init_useControllableState = __esm({
  "src/composables/useControllableState.ts"() {
    "use strict";
  }
});

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
function useThrottle(fn, intervalMs = 100) {
  let lastTime = 0;
  let timer = null;
  const throttled = (...args) => {
    const now = Date.now();
    if (now - lastTime >= intervalMs) {
      lastTime = now;
      fn(...args);
    } else if (!timer) {
      timer = setTimeout(() => {
        lastTime = Date.now();
        fn(...args);
        timer = null;
      }, intervalMs - (now - lastTime));
    }
  };
  throttled.cancel = () => {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
  };
  return throttled;
}
var init_useDebounce = __esm({
  "src/composables/useDebounce.ts"() {
    "use strict";
  }
});

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
var init_useClipboard = __esm({
  "src/composables/useClipboard.ts"() {
    "use strict";
  }
});

// src/composables/useKeyboardNav.ts
function useKeyboardNav(options) {
  let activeIndex = options.initialIndex ?? -1;
  const loop = options.loop ?? true;
  function handleKeyDown(e) {
    const count = options.itemCount();
    if (count === 0) return false;
    const isVertical = options.orientation !== "horizontal";
    const isHorizontal = options.orientation !== "vertical";
    if (isVertical && e.key === "ArrowDown" || isHorizontal && e.key === "ArrowRight") {
      e.preventDefault();
      if (activeIndex < count - 1) {
        activeIndex++;
      } else if (loop) {
        activeIndex = 0;
      }
      options.onHighlight?.(activeIndex);
      return true;
    }
    if (isVertical && e.key === "ArrowUp" || isHorizontal && e.key === "ArrowLeft") {
      e.preventDefault();
      if (activeIndex > 0) {
        activeIndex--;
      } else if (loop) {
        activeIndex = count - 1;
      }
      options.onHighlight?.(activeIndex);
      return true;
    }
    if (e.key === "Home") {
      e.preventDefault();
      activeIndex = 0;
      options.onHighlight?.(activeIndex);
      return true;
    }
    if (e.key === "End") {
      e.preventDefault();
      activeIndex = count - 1;
      options.onHighlight?.(activeIndex);
      return true;
    }
    if (e.key === "Enter" || e.key === " ") {
      if (activeIndex >= 0 && activeIndex < count) {
        e.preventDefault();
        options.onSelect?.(activeIndex);
        return true;
      }
    }
    if (e.key === "Escape") {
      options.onEscape?.();
      return true;
    }
    return false;
  }
  return {
    handleKeyDown,
    get activeIndex() {
      return activeIndex;
    },
    setActiveIndex: (idx) => {
      activeIndex = idx;
      options.onHighlight?.(activeIndex);
    },
    reset: () => {
      activeIndex = -1;
    }
  };
}
var init_useKeyboardNav = __esm({
  "src/composables/useKeyboardNav.ts"() {
    "use strict";
  }
});

// src/composables/useEventListener.ts
function useEventListener(target, type, listener, options) {
  if (!target || typeof target.addEventListener !== "function") {
    return () => {
    };
  }
  target.addEventListener(type, listener, options);
  return () => {
    target.removeEventListener(type, listener, options);
  };
}
var init_useEventListener = __esm({
  "src/composables/useEventListener.ts"() {
    "use strict";
  }
});

// src/composables/animation/useSpring.ts
function useSpring(initialValue, config = {}) {
  const stiffness = config.stiffness ?? 170;
  const damping = config.damping ?? 26;
  const mass = config.mass ?? 1;
  const precision = config.precision ?? 1e-3;
  let current = initialValue;
  let target = initialValue;
  let velocity = 0;
  let animFrame = null;
  const updateListeners = /* @__PURE__ */ new Set();
  function step() {
    const displacement = current - target;
    const springForce = -stiffness * displacement;
    const dampingForce = -damping * velocity;
    const acceleration = (springForce + dampingForce) / mass;
    const dt = 1 / 60;
    velocity += acceleration * dt;
    current += velocity * dt;
    updateListeners.forEach((fn) => fn(current));
    if (Math.abs(displacement) < precision && Math.abs(velocity) < precision) {
      current = target;
      velocity = 0;
      updateListeners.forEach((fn) => fn(current));
      animFrame = null;
    } else {
      if (typeof requestAnimationFrame !== "undefined") {
        animFrame = requestAnimationFrame(step);
      }
    }
  }
  function set(nextTarget) {
    target = nextTarget;
    if (animFrame === null && typeof requestAnimationFrame !== "undefined") {
      animFrame = requestAnimationFrame(step);
    } else if (typeof requestAnimationFrame === "undefined") {
      current = nextTarget;
      updateListeners.forEach((fn) => fn(current));
    }
  }
  function stop() {
    if (animFrame !== null && typeof cancelAnimationFrame !== "undefined") {
      cancelAnimationFrame(animFrame);
      animFrame = null;
    }
    velocity = 0;
  }
  function onUpdate(listener) {
    updateListeners.add(listener);
    return () => updateListeners.delete(listener);
  }
  return {
    get value() {
      return current;
    },
    set,
    onUpdate,
    stop
  };
}
var init_useSpring = __esm({
  "src/composables/animation/useSpring.ts"() {
    "use strict";
  }
});

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
var init_useTransition = __esm({
  "src/composables/animation/useTransition.ts"() {
    "use strict";
  }
});

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
var init_useAutoAnimate = __esm({
  "src/composables/animation/useAutoAnimate.ts"() {
    "use strict";
  }
});

// src/composables/animation/useStagger.ts
function useStagger(elements, options = {}) {
  const staggerMs = options.staggerMs ?? 40;
  const initialDelay = options.initialDelay ?? 0;
  const duration = options.duration ?? 250;
  const easing = options.easing ?? "cubic-bezier(0.16, 1, 0.3, 1)";
  const list = Array.from(elements);
  list.forEach((el, index) => {
    const delay = initialDelay + index * staggerMs;
    el.style.opacity = "0";
    el.style.transform = "translateY(8px)";
    el.style.transition = `opacity ${duration}ms ${easing} ${delay}ms, transform ${duration}ms ${easing} ${delay}ms`;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.style.opacity = "1";
        el.style.transform = "none";
      });
    });
  });
}
var init_useStagger = __esm({
  "src/composables/animation/useStagger.ts"() {
    "use strict";
  }
});

// src/composables/animation/useMorphLayout.ts
function useMorphLayout(indicator, options = {}) {
  const duration = options.duration ?? 200;
  const easing = options.easing ?? "cubic-bezier(0.2, 0, 0, 1)";
  indicator.style.position = "absolute";
  indicator.style.transition = `left ${duration}ms ${easing}, top ${duration}ms ${easing}, width ${duration}ms ${easing}, height ${duration}ms ${easing}, opacity ${duration}ms ${easing}`;
  indicator.style.pointerEvents = "none";
  function moveTo(target) {
    if (!target || !target.offsetParent) {
      indicator.style.opacity = "0";
      return;
    }
    indicator.style.opacity = "1";
    indicator.style.left = `${target.offsetLeft}px`;
    indicator.style.top = `${target.offsetTop}px`;
    indicator.style.width = `${target.offsetWidth}px`;
    indicator.style.height = `${target.offsetHeight}px`;
  }
  return { moveTo };
}
var init_useMorphLayout = __esm({
  "src/composables/animation/useMorphLayout.ts"() {
    "use strict";
  }
});

// src/composables/index.ts
var init_composables = __esm({
  "src/composables/index.ts"() {
    "use strict";
    init_useDisclosure();
    init_useFocusTrap();
    init_useFloatingPosition();
    init_useVirtualizer();
    init_useDragGesture();
    init_useHotkeys();
    init_useClickOutside();
    init_useScrollLock();
    init_useControllableState();
    init_useDebounce();
    init_useClipboard();
    init_useKeyboardNav();
    init_useEventListener();
    init_useSpring();
    init_useTransition();
    init_useAutoAnimate();
    init_useStagger();
    init_useMorphLayout();
  }
});

// src/types/models.ts
var init_models = __esm({
  "src/types/models.ts"() {
    "use strict";
  }
});

// src/styles/animations.ts
function initAnimationStyles() {
  if (typeof document === "undefined") return;
  if (document.getElementById("aura-animations")) return;
  const styleEl = document.createElement("style");
  styleEl.id = "aura-animations";
  styleEl.textContent = `
/* Base Component */
.p-component {
    font-family: var(--p-font-family, inherit);
    font-size: 1rem;
    line-height: 1.5;
}

/* 1. Anchored Overlays */
.p-anchored-overlay-enter-active {
    animation: p-anchored-overlay-enter 200ms ease-out forwards;
}
.p-anchored-overlay-leave-active {
    animation: p-anchored-overlay-leave 150ms ease-in forwards;
}
@keyframes p-anchored-overlay-enter {
    from { opacity: 0; transform: translateY(5%); }
    to { opacity: 1; transform: translateY(0); }
}
@keyframes p-anchored-overlay-leave {
    from { opacity: 1; transform: translateY(0); }
    to { opacity: 0; transform: translateY(5%); }
}

/* 2. Collapsibles */
.p-collapsible-enter-active {
    animation: p-collapsible-enter 300ms cubic-bezier(0.65, 0, 0.35, 1) forwards;
}
.p-collapsible-leave-active {
    animation: p-collapsible-leave 300ms cubic-bezier(0.65, 0, 0.35, 1) forwards;
}
@keyframes p-collapsible-enter {
    from { grid-template-rows: 0fr; opacity: 0; transform: scale(0.97); }
    to { grid-template-rows: 1fr; opacity: 1; transform: scale(1); }
}
@keyframes p-collapsible-leave {
    from { grid-template-rows: 1fr; opacity: 1; transform: scale(1); }
    to { grid-template-rows: 0fr; opacity: 0; transform: scale(0.97); }
}

/* 3. Dialog */
.p-dialog-enter-active {
    animation: p-dialog-enter 300ms ease-out forwards;
}
.p-dialog-leave-active {
    animation: p-dialog-leave 200ms ease-in forwards;
}
@keyframes p-dialog-enter {
    from { opacity: 0; transform: scale(0.95); filter: blur(8px); }
    to { opacity: 1; transform: scale(1); filter: blur(0); }
}
@keyframes p-dialog-leave {
    from { opacity: 1; transform: scale(1); filter: blur(0); }
    to { opacity: 0; transform: scale(0.95); filter: blur(4px); }
}

/* 4. Drawer */
.p-drawer-enter-active {
    animation: p-drawer-enter 300ms cubic-bezier(0.32, 0.72, 0, 1) forwards;
}
.p-drawer-leave-active {
    animation: p-drawer-leave 200ms cubic-bezier(0.32, 0.72, 0, 1) forwards;
}
@keyframes p-drawer-enter {
    from { transform: translateX(-100%); }
    to { transform: translateX(0); }
}
@keyframes p-drawer-leave {
    from { transform: translateX(0); }
    to { transform: translateX(-100%); }
}

.p-drawer-right-enter-active { animation: p-drawer-right-enter 300ms cubic-bezier(0.32, 0.72, 0, 1) forwards; }
.p-drawer-right-leave-active { animation: p-drawer-right-leave 200ms cubic-bezier(0.32, 0.72, 0, 1) forwards; }
@keyframes p-drawer-right-enter { from { transform: translateX(100%); } to { transform: translateX(0); } }
@keyframes p-drawer-right-leave { from { transform: translateX(0); } to { transform: translateX(100%); } }

.p-drawer-top-enter-active { animation: p-drawer-top-enter 300ms cubic-bezier(0.32, 0.72, 0, 1) forwards; }
.p-drawer-top-leave-active { animation: p-drawer-top-leave 200ms cubic-bezier(0.32, 0.72, 0, 1) forwards; }
@keyframes p-drawer-top-enter { from { transform: translateY(-100%); } to { transform: translateY(0); } }
@keyframes p-drawer-top-leave { from { transform: translateY(0); } to { transform: translateY(-100%); } }

.p-drawer-bottom-enter-active { animation: p-drawer-bottom-enter 300ms cubic-bezier(0.32, 0.72, 0, 1) forwards; }
.p-drawer-bottom-leave-active { animation: p-drawer-bottom-leave 200ms cubic-bezier(0.32, 0.72, 0, 1) forwards; }
@keyframes p-drawer-bottom-enter { from { transform: translateY(100%); } to { transform: translateY(0); } }
@keyframes p-drawer-bottom-leave { from { transform: translateY(0); } to { transform: translateY(100%); } }

/* 5. Message/Toast */
.p-message-enter-active {
    animation: p-message-enter 300ms ease-out forwards;
}
.p-message-leave-active {
    animation: p-message-leave 200ms ease-in forwards;
}
@keyframes p-message-enter {
    from { opacity: 0; transform: translateY(-100%); }
    to { opacity: 1; transform: translateY(0); }
}
@keyframes p-message-leave {
    from { opacity: 1; transform: translateY(0); }
    to { opacity: 0; transform: translateX(100%); }
}

/* 6. Overlay Mask */
.p-overlay-mask-enter-active {
    animation: p-overlay-mask-enter 200ms ease forwards;
}
.p-overlay-mask-leave-active {
    animation: p-overlay-mask-leave 150ms ease forwards;
}
@keyframes p-overlay-mask-enter {
    from { opacity: 0; }
    to { opacity: 1; }
}
@keyframes p-overlay-mask-leave {
    from { opacity: 1; }
    to { opacity: 0; }
}

/* 7. Ripple */
.p-ripple-effect {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.4);
    transform: scale(0);
    animation: p-ripple-animation 600ms linear;
    pointer-events: none;
}
@keyframes p-ripple-animation {
    to {
        transform: scale(4);
        opacity: 0;
    }
}

/* 8. Skeleton Shimmer */
.p-skeleton-animation {
    background: linear-gradient(90deg, rgba(255, 255, 255, 0) 0, rgba(255, 255, 255, 0.2) 20%, rgba(255, 255, 255, 0.5) 60%, rgba(255, 255, 255, 0));
    background-size: 200% 100%;
    animation: p-skeleton-shimmer 1.5s infinite linear;
}
@keyframes p-skeleton-shimmer {
    from { background-position: -200% 0; }
    to { background-position: 200% 0; }
}

/* Reduced Motion */
@media (prefers-reduced-motion: reduce) {
    *,
    ::before,
    ::after {
        animation-duration: 0s !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0s !important;
        scroll-behavior: auto !important;
    }
}
    `;
  document.head.appendChild(styleEl);
}
function injectRipple(el, event) {
  const rect = el.getBoundingClientRect();
  const ripple = document.createElement("span");
  const size = Math.max(rect.width, rect.height);
  const x = event.clientX - rect.left - size / 2;
  const y = event.clientY - rect.top - size / 2;
  ripple.className = "p-ripple-effect";
  ripple.style.width = `${size}px`;
  ripple.style.height = `${size}px`;
  ripple.style.left = `${x}px`;
  ripple.style.top = `${y}px`;
  el.appendChild(ripple);
  setTimeout(() => {
    ripple.remove();
  }, 600);
}
var init_animations = __esm({
  "src/styles/animations.ts"() {
    "use strict";
  }
});

// src/styles/design-tokens.ts
function initDesignTokens() {
  if (typeof document === "undefined") return;
  if (document.getElementById("aura-design-tokens")) return;
  const styleEl = document.createElement("style");
  styleEl.id = "aura-design-tokens";
  styleEl.textContent = `
:root {
  /* Primary palette (emerald by default) */
  --p-primary-50: #ecfdf5;
  --p-primary-100: #d1fae5;
  --p-primary-200: #a7f3d0;
  --p-primary-300: #6ee7b7;
  --p-primary-400: #34d399;
  --p-primary-500: #10b981;
  --p-primary-600: #059669;
  --p-primary-700: #047857;
  --p-primary-800: #065f46;
  --p-primary-900: #064e3b;
  --p-primary-color: var(--p-primary-500);
  --p-primary-color-text: #ffffff;

  /* Surface palette */
  --p-surface-0: #ffffff;
  --p-surface-50: #f8fafc;
  --p-surface-100: #f1f5f9;
  --p-surface-200: #e2e8f0;
  --p-surface-300: #cbd5e1;
  --p-surface-400: #94a3b8;
  --p-surface-500: #64748b;
  --p-surface-600: #475569;
  --p-surface-700: #334155;
  --p-surface-800: #1e293b;
  --p-surface-900: #0f172a;
  --p-surface-950: #020617;
  --p-text-color: var(--p-surface-900);
  --p-text-muted-color: var(--p-surface-500);

  /* Component tokens */
  --p-content-bg: var(--p-surface-0);
  --p-content-border: var(--p-surface-200);
  --p-content-hover-bg: var(--p-surface-50);
  --p-content-padding: 1rem;

  /* Border radius */
  --p-border-radius: 0.5rem;
  --p-border-radius-sm: 0.375rem;
  --p-border-radius-lg: 0.75rem;
  --p-border-radius-xl: 1rem;
  --p-border-radius-full: 9999px;

  /* Shadows */
  --p-shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --p-shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  --p-shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  --p-shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);

  /* Focus ring */
  --p-focus-ring-color: var(--p-primary-500);
  --p-focus-ring-width: 2px;
  --p-focus-ring-offset: 2px;
  --p-focus-ring: 0 0 0 var(--p-focus-ring-offset) var(--p-content-bg), 0 0 0 calc(var(--p-focus-ring-offset) + var(--p-focus-ring-width)) var(--p-focus-ring-color);

  /* Transitions */
  --p-transition-duration: 150ms;
  --p-transition-timing: cubic-bezier(0.4, 0, 0.2, 1);

  /* Form field tokens */
  --p-field-border: var(--p-surface-300);
  --p-field-hover-border: var(--p-surface-400);
  --p-field-focus-border: var(--p-primary-500);
  --p-field-bg: var(--p-surface-0);
  --p-field-padding-x: 0.75rem;
  --p-field-padding-y: 0.5rem;

  /* Overlay tokens */
  --p-overlay-bg: var(--p-surface-0);
  --p-overlay-border: var(--p-surface-200);
  --p-overlay-shadow: var(--p-shadow-lg);
}

/* Dark mode overrides */
[data-theme="dark"], .dark {
  --p-surface-0: #09090b;
  --p-surface-50: #18181b;
  --p-surface-100: #27272a;
  --p-surface-200: #3f3f46;
  --p-surface-300: #52525b;
  --p-surface-400: #71717a;
  --p-surface-500: #a1a1aa;
  --p-surface-600: #d4d4d8;
  --p-surface-700: #e4e4e7;
  --p-surface-800: #f4f4f5;
  --p-surface-900: #fafafa;
  --p-surface-950: #ffffff;
  
  --p-text-color: var(--p-surface-50);
  --p-text-muted-color: var(--p-surface-400);
  --p-content-bg: var(--p-surface-900);
  --p-content-border: var(--p-surface-700);
  --p-content-hover-bg: var(--p-surface-800);
  --p-field-bg: var(--p-surface-800);
  --p-field-border: var(--p-surface-600);
  --p-field-hover-border: var(--p-surface-500);
  --p-overlay-bg: var(--p-surface-800);
  --p-overlay-border: var(--p-surface-700);
}

@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]):not(.light) {
    --p-surface-0: #09090b;
    --p-surface-50: #18181b;
    --p-surface-100: #27272a;
    --p-surface-200: #3f3f46;
    --p-surface-300: #52525b;
    --p-surface-400: #71717a;
    --p-surface-500: #a1a1aa;
    --p-surface-600: #d4d4d8;
    --p-surface-700: #e4e4e7;
    --p-surface-800: #f4f4f5;
    --p-surface-900: #fafafa;
    --p-surface-950: #ffffff;
    
    --p-text-color: var(--p-surface-50);
    --p-text-muted-color: var(--p-surface-400);
    --p-content-bg: var(--p-surface-900);
    --p-content-border: var(--p-surface-700);
    --p-content-hover-bg: var(--p-surface-800);
    --p-field-bg: var(--p-surface-800);
    --p-field-border: var(--p-surface-600);
    --p-field-hover-border: var(--p-surface-500);
    --p-overlay-bg: var(--p-surface-800);
    --p-overlay-border: var(--p-surface-700);
  }
}
    `;
  document.head.appendChild(styleEl);
}
function updateToken(name, value) {
  if (typeof document !== "undefined") {
    document.documentElement.style.setProperty(name, value);
  }
}
function getToken(name) {
  if (typeof document !== "undefined") {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  }
  return "";
}
var AURA_PALETTES;
var init_design_tokens = __esm({
  "src/styles/design-tokens.ts"() {
    "use strict";
    AURA_PALETTES = {
      emerald: {
        "50": "#ecfdf5",
        "100": "#d1fae5",
        "200": "#a7f3d0",
        "300": "#6ee7b7",
        "400": "#34d399",
        "500": "#10b981",
        "600": "#059669",
        "700": "#047857",
        "800": "#065f46",
        "900": "#064e3b"
      },
      blue: {
        "50": "#eff6ff",
        "100": "#dbeafe",
        "200": "#bfdbfe",
        "300": "#93c5fd",
        "400": "#60a5fa",
        "500": "#3b82f6",
        "600": "#2563eb",
        "700": "#1d4ed8",
        "800": "#1e40af",
        "900": "#1e3a8a"
      },
      violet: {
        "50": "#f5f3ff",
        "100": "#ede9fe",
        "200": "#ddd6fe",
        "300": "#c4b5fd",
        "400": "#a78bfa",
        "500": "#8b5cf6",
        "600": "#7c3aed",
        "700": "#6d28d9",
        "800": "#5b21b6",
        "900": "#4c1d95"
      },
      amber: {
        "50": "#fffbeb",
        "100": "#fef3c7",
        "200": "#fde68a",
        "300": "#fcd34d",
        "400": "#fbbf24",
        "500": "#f59e0b",
        "600": "#d97706",
        "700": "#b45309",
        "800": "#92400e",
        "900": "#78350f"
      },
      rose: {
        "50": "#fff1f2",
        "100": "#ffe4e6",
        "200": "#fecdd3",
        "300": "#fda4af",
        "400": "#fb7185",
        "500": "#f43f5e",
        "600": "#e11d48",
        "700": "#be123c",
        "800": "#9f1239",
        "900": "#881337"
      },
      cyan: {
        "50": "#ecfeff",
        "100": "#cffafe",
        "200": "#a5f3fc",
        "300": "#67e8f9",
        "400": "#22d3ee",
        "500": "#06b6d4",
        "600": "#0891b2",
        "700": "#0e7490",
        "800": "#155e75",
        "900": "#164e63"
      },
      slate: {
        "50": "#f8fafc",
        "100": "#f1f5f9",
        "200": "#e2e8f0",
        "300": "#cbd5e1",
        "400": "#94a3b8",
        "500": "#64748b",
        "600": "#475569",
        "700": "#334155",
        "800": "#1e293b",
        "900": "#0f172a"
      }
    };
  }
});

// src/components/stepper.ts
var stepper_exports = {};
__export(stepper_exports, {
  default: () => StepperIsland
});
function StepperIsland(container, props) {
  injectIslandStyle("stepper", CSS);
  let currentStep = props.initialStep || 0;
  const totalSteps = props.steps.length;
  function render() {
    const stepItems = props.steps.map((s, idx) => {
      const isCompleted = idx < currentStep;
      const isActive = idx === currentStep;
      const isPending = idx > currentStep;
      const badgeBg = isActive ? "var(--p-surface-950)" : isCompleted ? "var(--p-primary-600)" : "var(--p-surface-200)";
      const badgeColor = isActive || isCompleted ? "#ffffff" : "var(--p-surface-600)";
      return `
                <div class="stepper-item" data-step-idx="${idx}" style="display: flex; align-items: center; gap: 0.75rem; cursor: ${props.linear ? "default" : "pointer"};">
                    <div style="width: 2.25rem; height: 2.25rem; border-radius: 50%; background: ${badgeBg}; color: ${badgeColor}; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.875rem; transition: all 0.2s ease;">
                        ${isCompleted ? "\u2713" : s.icon || idx + 1}
                    </div>
                    <div>
                        <div style="font-size: 0.875rem; font-weight: ${isActive ? "700" : "500"}; color: ${isActive ? "var(--p-surface-950)" : "var(--p-surface-600)"};">${s.title}</div>
                        ${s.description ? `<div style="font-size: 0.75rem; color: var(--p-surface-400);">${s.description}</div>` : ""}
                    </div>
                </div>
            `;
    }).join('<div style="flex: 1; height: 2px; background: var(--p-surface-200); margin: 0 0.5rem;"></div>');
    container.innerHTML = `
            <div class="laughtale-stepper" style="display: flex; flex-direction: column; gap: 1.5rem;">
                <!-- Step Header Progress Bar -->
                <div style="display: flex; align-items: center; justify-content: space-between; padding-bottom: 1.25rem; border-bottom: 1px solid var(--p-border-color);">
                    ${stepItems}
                </div>

                <!-- Step Content Container (Shows active slot) -->
                <div class="stepper-body" style="min-height: 120px;">
                    <div class="stepper-slot-container"></div>
                </div>

                <!-- Step Navigation Footer -->
                <div style="display: flex; align-items: center; justify-content: space-between; padding-top: 1rem; border-top: 1px solid var(--p-border-color);">
                    <button type="button" class="p-button p-button-secondary step-prev-btn" ${currentStep === 0 ? 'disabled style="opacity: 0.5; cursor: not-allowed;"' : ""}>
                        &larr; Previous
                    </button>
                    <div style="font-size: 0.8125rem; color: var(--p-surface-500); font-family: var(--p-font-mono);">
                        Step ${currentStep + 1} of ${totalSteps}
                    </div>
                    <button type="button" class="p-button p-button-primary step-next-btn">
                        ${currentStep === totalSteps - 1 ? "Complete & Submit \u2713" : "Next Step &rarr;"}
                    </button>
                </div>
            </div>
        `;
    const slotEl = container.querySelector('[data-slot="default"]') || container.querySelector(".island-slot");
    const slotContainer = container.querySelector(".stepper-slot-container");
    if (slotEl) {
      slotContainer.appendChild(slotEl);
      const stepPanels = slotEl.querySelectorAll("[data-step]");
      if (stepPanels.length > 0) {
        stepPanels.forEach((panel, i) => {
          panel.style.display = i === currentStep ? "block" : "none";
        });
      }
    }
    container.querySelector(".step-prev-btn")?.addEventListener("click", () => {
      if (currentStep > 0) {
        currentStep--;
        render();
      }
    });
    container.querySelector(".step-next-btn")?.addEventListener("click", () => {
      if (currentStep < totalSteps - 1) {
        currentStep++;
        render();
      } else {
        container.dispatchEvent(new CustomEvent("stepper:completed", { bubbles: true }));
      }
    });
  }
  render();
}
var CSS;
var init_stepper = __esm({
  "src/components/stepper.ts"() {
    "use strict";
    init_styles();
    CSS = `
[data-theme="dark"] .stepper-item {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
[data-theme="dark"] .laughtale-stepper {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
[data-theme="dark"] .stepper-body {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
[data-theme="dark"] .stepper-slot-container {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
[data-theme="dark"] .step-prev-btn {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
[data-theme="dark"] .step-next-btn {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
`;
  }
});

// src/components/timeline.ts
var timeline_exports = {};
__export(timeline_exports, {
  default: () => TimelineIsland
});
function TimelineIsland(container, props) {
  injectIslandStyle("timeline", CSS2);
  const statusBadges = {
    completed: { bg: "#ecfdf5", color: "#047857", border: "#a7f3d0", label: "Completed", dot: "#10b981" },
    in_progress: { bg: "#eff6ff", color: "#1d4ed8", border: "#bfdbfe", label: "In Progress", dot: "#3b82f6" },
    warning: { bg: "#fffbeb", color: "#b45309", border: "#fde68a", label: "Warning", dot: "#f59e0b" },
    failed: { bg: "#fef2f2", color: "#b91c1c", border: "#fecaca", label: "Failed", dot: "#ef4444" }
  };
  const items = props.events.map((evt, idx) => {
    const badge = statusBadges[evt.status] || statusBadges.completed;
    const isLast = idx === props.events.length - 1;
    return `
            <div class="timeline-item" style="display: flex; gap: 1.25rem; position: relative;">
                <!-- Vertical Line & Indicator Dot -->
                <div style="display: flex; flex-direction: column; align-items: center;">
                    <div style="width: 1.5rem; height: 1.5rem; border-radius: 50%; background: ${badge.bg}; border: 2px solid ${badge.dot}; display: flex; align-items: center; justify-content: center; font-size: 0.75rem; z-index: 1;">
                        ${evt.icon || "\u2022"}
                    </div>
                    ${!isLast ? `<div style="width: 2px; flex: 1; background: var(--p-surface-200); margin: 0.25rem 0;"></div>` : ""}
                </div>

                <!-- Event Details Card -->
                <div style="flex: 1; padding-bottom: ${isLast ? "0" : "1.5rem"};">
                    <div style="display: flex; align-items: center; justify-content: space-between; gap: 0.5rem; flex-wrap: wrap;">
                        <div style="font-size: 0.875rem; font-weight: 600; color: var(--p-surface-950);">${evt.title}</div>
                        <span style="font-size: 0.6875rem; padding: 0.15rem 0.5rem; border-radius: var(--p-border-radius); background: ${badge.bg}; color: ${badge.color}; border: 1px solid ${badge.border}; font-weight: 600;">
                            ${badge.label}
                        </span>
                    </div>

                    <p style="font-size: 0.8125rem; color: var(--p-surface-600); margin-top: 0.35rem; line-height: 1.5;">${evt.description}</p>

                    <div style="display: flex; align-items: center; gap: 1rem; margin-top: 0.5rem; font-size: 0.75rem; color: var(--p-surface-400); font-family: var(--p-font-mono);">
                        <span>\u{1F552} ${evt.timestamp}</span>
                        ${evt.actor ? `<span>\u{1F464} ${evt.actor}</span>` : ""}
                    </div>
                </div>
            </div>
        `;
  }).join("");
  container.innerHTML = `
        <div class="laughtale-timeline" style="display: flex; flex-direction: column; gap: 1rem;">
            ${props.title ? `<div style="font-size: 1rem; font-weight: 700; color: var(--p-surface-900); padding-bottom: 0.75rem; border-bottom: 1px solid var(--p-border-color);">${props.title}</div>` : ""}
            <div style="display: flex; flex-direction: column;">
                ${items}
            </div>
        </div>
    `;
}
var CSS2;
var init_timeline = __esm({
  "src/components/timeline.ts"() {
    "use strict";
    init_styles();
    CSS2 = `
[data-theme="dark"] .timeline-item {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
[data-theme="dark"] .laughtale-timeline {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
`;
  }
});

// src/components/camera.ts
var camera_exports = {};
__export(camera_exports, {
  default: () => CameraIsland
});
function CameraIsland(container, props) {
  injectIslandStyle("camera", CSS3);
  let stream = null;
  let capturedPhotoData = null;
  function render() {
    if (capturedPhotoData) {
      container.innerHTML = `
                <div class="laughtale-camera-preview" style="border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius-lg); overflow: hidden; background: var(--p-surface-950); text-align: center;">
                    <div style="position: relative; max-width: 480px; margin: 0 auto;">
                        <img src="${capturedPhotoData}" alt="Captured Snapshot" style="width: 100%; display: block; border-radius: var(--p-border-radius-lg);" />
                        <div style="position: absolute; top: 0.75rem; right: 0.75rem; background: #059669; color: white; padding: 0.25rem 0.6rem; border-radius: var(--p-border-radius); font-size: 0.75rem; font-weight: 600;">
                            \u2713 Snapshot Verified
                        </div>
                    </div>
                    <div style="display: flex; align-items: center; justify-content: center; gap: 1rem; padding: 1rem; background: var(--p-surface-900);">
                        <button type="button" class="p-button p-button-secondary retake-btn" style="color: white; border-color: var(--p-surface-700); background: var(--p-surface-800);">
                            \u{1F4F7} Retake Photo
                        </button>
                    </div>
                </div>
            `;
      container.querySelector(".retake-btn")?.addEventListener("click", () => {
        capturedPhotoData = null;
        startCamera();
      });
      return;
    }
    container.innerHTML = `
            <div class="laughtale-camera" style="border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius-lg); overflow: hidden; background: var(--p-surface-950); display: flex; flex-direction: column;">
                ${props.title ? `<div style="padding: 0.75rem 1rem; background: var(--p-surface-900); color: white; font-weight: 600; font-size: 0.875rem;">${props.title}</div>` : ""}
                
                <div style="position: relative; width: 100%; max-width: 480px; margin: 0 auto; aspect-ratio: 4/3; background: #000000; overflow: hidden; display: flex; align-items: center; justify-content: center;">
                    <video autoplay playsinline muted style="width: 100%; height: 100%; object-fit: cover;"></video>
                    
                    <!-- Face Alignment Framing Guide -->
                    ${props.showFaceGuide !== false ? `
                        <div style="position: absolute; width: 55%; height: 75%; border: 2px dashed rgba(255, 255, 255, 0.6); border-radius: 50%; pointer-events: none; box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.35);"></div>
                        <div style="position: absolute; bottom: 1rem; left: 0; right: 0; text-align: center; color: rgba(255, 255, 255, 0.85); font-size: 0.75rem; font-weight: 500; text-shadow: 0 1px 2px rgba(0,0,0,0.8);">
                            Align face inside oval guide
                        </div>
                    ` : ""}
                </div>

                <div style="display: flex; align-items: center; justify-content: center; gap: 1rem; padding: 1rem; background: var(--p-surface-900);">
                    <button type="button" class="p-button p-button-primary capture-btn" style="background: var(--p-primary-600); border-color: var(--p-primary-600); font-weight: 600; padding: 0.625rem 1.5rem;">
                        \u{1F4F8} Take Photo
                    </button>
                </div>
            </div>
        `;
    const video = container.querySelector("video");
    if (stream) video.srcObject = stream;
    container.querySelector(".capture-btn")?.addEventListener("click", () => {
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        capturedPhotoData = canvas.toDataURL("image/jpeg", 0.92);
        if (stream) {
          stream.getTracks().forEach((t) => t.stop());
          stream = null;
        }
        if (props.targetInputName) {
          let hiddenInput = document.querySelector(`input[name="${props.targetInputName}"]`);
          if (!hiddenInput) {
            hiddenInput = document.createElement("input");
            hiddenInput.type = "hidden";
            hiddenInput.name = props.targetInputName;
            container.appendChild(hiddenInput);
          }
          hiddenInput.value = capturedPhotoData;
        }
        container.dispatchEvent(new CustomEvent("camera:captured", {
          bubbles: true,
          detail: { photoData: capturedPhotoData }
        }));
        render();
      }
    });
  }
  async function startCamera() {
    render();
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });
      const video = container.querySelector("video");
      if (video) video.srcObject = stream;
    } catch (err) {
      console.warn("[SoftMax.LaughTale] Camera stream unavailable or permission denied:", err);
      container.innerHTML = `
                <div style="padding: 2rem; border: 1px dashed var(--p-border-color); border-radius: var(--p-border-radius); text-align: center; background: var(--p-surface-50);">
                    <div style="font-size: 1.5rem; margin-bottom: 0.5rem;">\u{1F4F7}</div>
                    <div style="font-size: 0.875rem; font-weight: 600; color: var(--p-surface-800);">Camera Hardware Stream Ready</div>
                    <div style="font-size: 0.75rem; color: var(--p-surface-500); margin-top: 0.25rem;">Camera permission or simulated capture ready for verification.</div>
                </div>
            `;
    }
  }
  startCamera();
  return () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
  };
}
var CSS3;
var init_camera = __esm({
  "src/components/camera.ts"() {
    "use strict";
    init_styles();
    CSS3 = `
[data-theme="dark"] .laughtale-camera-preview {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
[data-theme="dark"] .retake-btn {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
[data-theme="dark"] .laughtale-camera {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
[data-theme="dark"] .capture-btn {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
`;
  }
});

// src/components/dropzone.ts
var dropzone_exports = {};
__export(dropzone_exports, {
  default: () => DropzoneIsland
});
function DropzoneIsland(container, props) {
  injectIslandStyle("dropzone", CSS4);
  container.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 0.75rem;">
            <div style="display: flex; align-items: center; justify-content: space-between;">
                <span style="font-size: 0.8125rem; font-weight: 600; color: var(--p-surface-600);">Document Vault</span>
                <span class="aura-tag tag-cyan">Hydrate: Visible</span>
            </div>

            <div class="dropzone-box" style="border: 2px dashed var(--p-border-color); border-radius: var(--p-border-radius-lg); padding: 2rem 1.5rem; text-align: center; cursor: pointer; transition: all 0.2s ease; background-color: var(--p-surface-50);">
                <input type="file" class="file-input" name="${props.targetInputName}" accept="${props.allowedExtensions}" style="display: none;" />
                
                <div style="width: 2.75rem; height: 2.75rem; border-radius: 50%; background: var(--p-surface-100); display: flex; align-items: center; justify-content: center; margin: 0 auto 0.75rem; font-size: 1.25rem;">
                    \u2601\uFE0F
                </div>
                
                <div style="font-size: 0.875rem; font-weight: 600; color: var(--p-surface-800);">${props.dropPrompt}</div>
                <div style="font-size: 0.75rem; color: var(--p-surface-500); margin-top: 0.25rem;">
                    Supported: ${props.allowedExtensions} &bull; Max Size: ${props.maxSizeMb} MB
                </div>

                <div class="preview-area" style="display: none; margin-top: 1rem;"></div>
            </div>
        </div>
    `;
  const box = container.querySelector(".dropzone-box");
  const input = container.querySelector(".file-input");
  const preview = container.querySelector(".preview-area");
  box.addEventListener("click", () => input.click());
  box.addEventListener("dragover", (e) => {
    e.preventDefault();
    box.style.borderColor = "var(--p-primary-500)";
    box.style.backgroundColor = "var(--p-primary-50)";
  });
  box.addEventListener("dragleave", () => {
    box.style.borderColor = "var(--p-border-color)";
    box.style.backgroundColor = "var(--p-surface-50)";
  });
  box.addEventListener("drop", (e) => {
    e.preventDefault();
    box.style.borderColor = "var(--p-border-color)";
    box.style.backgroundColor = "var(--p-surface-50)";
    if (e.dataTransfer?.files.length) {
      input.files = e.dataTransfer.files;
      handleFiles(input.files[0]);
    }
  });
  input.addEventListener("change", () => {
    if (input.files?.length) {
      handleFiles(input.files[0]);
    }
  });
  function handleFiles(file) {
    const sizeMb = file.size / (1024 * 1024);
    if (sizeMb > props.maxSizeMb) {
      alert(`File exceeds size limit of ${props.maxSizeMb} MB.`);
      input.value = "";
      return;
    }
    preview.style.display = "block";
    preview.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.5rem 0.75rem; background: var(--p-primary-50); border: 1px solid var(--p-primary-200); border-radius: var(--p-border-radius); font-size: 0.8125rem; color: var(--p-primary-700);">
                <div style="display: flex; align-items: center; gap: 0.5rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                    <span>\u{1F4C4}</span>
                    <strong style="overflow: hidden; text-overflow: ellipsis;">${file.name}</strong>
                    <span style="font-size: 0.75rem; opacity: 0.8;">(${sizeMb.toFixed(2)} MB)</span>
                </div>
                <span class="aura-tag tag-emerald" style="font-size: 0.6875rem;">Verified</span>
            </div>
        `;
  }
}
var CSS4;
var init_dropzone = __esm({
  "src/components/dropzone.ts"() {
    "use strict";
    init_styles();
    CSS4 = `
[data-theme="dark"] .dropzone-box {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
[data-theme="dark"] .file-input {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
`;
  }
});

// src/components/tree-select.ts
var tree_select_exports = {};
__export(tree_select_exports, {
  default: () => TreeSelectIsland
});
function TreeSelectIsland(container, props) {
  injectIslandStyle("laughtale-treeselect", CSS5);
  const rawNodes = props.nodes || props.options || props.departments || [];
  const selectionMode = props.selectionMode || "single";
  const displayMode = props.display || "comma";
  const isFilter = props.filter === true || String(props.filter) === "true";
  const isShowClear = props.showClear === true || props.clearable === true || String(props.showClear) === "true";
  const isFluid = props.fluid === true || String(props.fluid) === "true";
  const isInvalid = props.invalid === true || String(props.invalid) === "true";
  const isDisabled = props.disabled === true || String(props.disabled) === "true";
  const isFilled = props.variant === "filled";
  const size = props.size || "normal";
  const placeholder = props.placeholder || "Select Item";
  function normalizeNodes(nodes) {
    return nodes.map((n) => ({
      ...n,
      key: n.key || n.id || String(n.label || n.name),
      label: n.label || n.name || n.key || n.id || "",
      children: n.children ? normalizeNodes(n.children) : void 0
    }));
  }
  const treeData = normalizeNodes(rawNodes);
  const nodeMap = /* @__PURE__ */ new Map();
  const parentMap = /* @__PURE__ */ new Map();
  function buildMaps(nodes, parentKey = null) {
    for (const n of nodes) {
      nodeMap.set(n.key, n);
      parentMap.set(n.key, parentKey);
      if (n.children && n.children.length > 0) {
        buildMaps(n.children, n.key);
      }
    }
  }
  buildMaps(treeData);
  const selectedKeys = /* @__PURE__ */ new Set();
  const initialVal = props.value ?? props.selectedValue;
  if (initialVal) {
    if (typeof initialVal === "string") {
      try {
        const parsed = JSON.parse(initialVal);
        if (Array.isArray(parsed)) parsed.forEach((k) => selectedKeys.add(String(k)));
        else if (typeof parsed === "object" && parsed !== null) {
          Object.entries(parsed).forEach(([k, v]) => {
            if (v) selectedKeys.add(k);
          });
        } else selectedKeys.add(initialVal);
      } catch {
        selectedKeys.add(initialVal);
      }
    } else if (Array.isArray(initialVal)) {
      initialVal.forEach((k) => selectedKeys.add(String(k)));
    } else if (typeof initialVal === "object") {
      Object.entries(initialVal).forEach(([k, v]) => {
        if (v) selectedKeys.add(k);
      });
    }
  }
  const expandedKeys = /* @__PURE__ */ new Set();
  treeData.forEach((n) => {
    if (n.children && n.children.length > 0) {
      expandedKeys.add(n.key);
    }
  });
  let searchQuery = "";
  const disclosure = useDisclosure({
    defaultIsOpen: false,
    onOpen: () => {
      container.classList.add("is-open", "is-focused");
      const overlay = container.querySelector(".p-treeselect-overlay");
      if (overlay) overlay.classList.add("is-open");
      if (isFilter) {
        const filterInp = container.querySelector(".p-treeselect-filter-input");
        setTimeout(() => filterInp?.focus(), 50);
      }
    },
    onClose: () => {
      container.classList.remove("is-open", "is-focused");
      const overlay = container.querySelector(".p-treeselect-overlay");
      if (overlay) overlay.classList.remove("is-open");
    }
  });
  useClickOutside(container, () => disclosure.close());
  function init() {
    const rootClasses = [
      "laughtale-treeselect",
      "p-treeselect",
      isFluid ? "p-treeselect-fluid" : "",
      isFilled ? "variant-filled" : "",
      size !== "normal" ? `size-${size}` : "",
      isInvalid ? "is-invalid" : "",
      isDisabled ? "is-disabled" : ""
    ].filter(Boolean).join(" ");
    container.className = rootClasses;
    container.innerHTML = `
            <div class="p-treeselect-label-container" tabindex="${isDisabled ? "-1" : "0"}" role="combobox" aria-haspopup="tree" aria-expanded="false" aria-controls="${props.inputId || "treeselect"}_overlay">
                <div class="p-treeselect-label"></div>
                <div class="p-treeselect-actions">
                    <button type="button" class="p-treeselect-clear-icon" aria-label="Clear selection" tabindex="-1" style="display: none;">
                        ${xSvg}
                    </button>
                    <span class="p-treeselect-dropdown-icon">
                        ${chevronDownSvg}
                    </span>
                </div>
            </div>

            <div class="p-treeselect-overlay" id="${props.inputId || "treeselect"}_overlay" role="dialog">
                ${props.header ? `<div class="p-treeselect-header">${props.header}</div>` : ""}
                ${isFilter ? `
                    <div class="p-treeselect-filter-container">
                        <span style="color: var(--p-surface-400); display: flex;">${searchSvg}</span>
                        <input type="text" class="p-treeselect-filter-input" placeholder="${props.filterPlaceholder || "Search tree..."}" />
                    </div>
                ` : ""}
                <ul class="p-treeselect-tree" role="tree"></ul>
                ${props.footer ? `<div class="p-treeselect-footer">${props.footer}</div>` : ""}
            </div>

            <input type="hidden" name="${props.name || props.targetInputName || "tree_value"}" value="" />
        `;
    updateTriggerDisplay();
    renderTreeList();
    bindEvents();
  }
  function getSelectedLabels() {
    const result = [];
    selectedKeys.forEach((k) => {
      const node = nodeMap.get(k);
      if (node) result.push({ key: node.key, label: node.label });
    });
    return result;
  }
  function updateTriggerDisplay() {
    const labelEl = container.querySelector(".p-treeselect-label");
    const clearBtn = container.querySelector(".p-treeselect-clear-icon");
    const hiddenInp = container.querySelector(`input[name="${props.name || props.targetInputName || "tree_value"}"]`);
    const selected = getSelectedLabels();
    if (selected.length === 0) {
      labelEl.className = "p-treeselect-label p-placeholder";
      labelEl.textContent = placeholder;
      clearBtn.style.display = "none";
      hiddenInp.value = "";
    } else {
      labelEl.className = "p-treeselect-label";
      if (isShowClear && !isDisabled) clearBtn.style.display = "inline-flex";
      else clearBtn.style.display = "none";
      if (displayMode === "chip") {
        labelEl.innerHTML = selected.map((s) => `
                    <span class="p-treeselect-token">
                        <span>${s.label}</span>
                        ${!isDisabled ? `<button type="button" class="p-treeselect-token-remove" data-key="${s.key}" aria-label="Remove ${s.label}">${xSvg}</button>` : ""}
                    </span>
                `).join("");
        labelEl.querySelectorAll(".p-treeselect-token-remove").forEach((btn) => {
          btn.addEventListener("click", (e) => {
            e.stopPropagation();
            const key = btn.getAttribute("data-key");
            toggleNodeSelection(key, false);
          });
        });
      } else {
        labelEl.textContent = selected.map((s) => s.label).join(", ");
      }
      if (selectionMode === "single") {
        hiddenInp.value = selected[0]?.key || "";
      } else {
        hiddenInp.value = JSON.stringify(Array.from(selectedKeys));
      }
    }
  }
  function filterTree(nodes, query) {
    if (!query) return nodes;
    return nodes.reduce((acc, node) => {
      const matches = node.label.toLowerCase().includes(query) || node.key.toLowerCase().includes(query);
      const filteredChildren = node.children ? filterTree(node.children, query) : [];
      if (matches || filteredChildren.length > 0) {
        acc.push({
          ...node,
          children: filteredChildren.length > 0 ? filteredChildren : node.children
        });
      }
      return acc;
    }, []);
  }
  function getCheckboxState(node) {
    if (!node.children || node.children.length === 0) {
      return selectedKeys.has(node.key) ? "checked" : "unchecked";
    }
    let allChecked = true;
    let noneChecked = true;
    function checkChildren(children) {
      for (const child of children) {
        if (selectedKeys.has(child.key)) {
          noneChecked = false;
        } else {
          allChecked = false;
        }
        if (child.children) checkChildren(child.children);
      }
    }
    checkChildren(node.children);
    if (allChecked) return "checked";
    if (noneChecked && !selectedKeys.has(node.key)) return "unchecked";
    return "indeterminate";
  }
  function renderTreeList() {
    const treeList = container.querySelector(".p-treeselect-tree");
    const visibleNodes = filterTree(treeData, searchQuery.toLowerCase().trim());
    if (visibleNodes.length === 0) {
      treeList.innerHTML = `<li class="p-treenode" style="padding: 1rem; text-align: center; color: var(--p-text-muted); font-size: 0.8125rem;">No results found</li>`;
      return;
    }
    function renderNodesHtml(nodes) {
      return nodes.map((node) => {
        const hasChildren = node.children && node.children.length > 0;
        const isExpanded = expandedKeys.has(node.key);
        const isSelected = selectedKeys.has(node.key);
        const iconSvg = node.icon ? getLucideIcon(node.icon, 16) : hasChildren ? isExpanded ? getLucideIcon("folderOpen", 16) : getLucideIcon("folder", 16) : getLucideIcon("fileText", 16);
        let checkboxHtml = "";
        if (selectionMode === "checkbox") {
          const cbState = getCheckboxState(node);
          const cbClass = cbState === "checked" ? "p-checked" : cbState === "indeterminate" ? "p-indeterminate" : "";
          const cbIcon = cbState === "checked" ? checkSvg : cbState === "indeterminate" ? minusSvg : "";
          checkboxHtml = `
                        <span class="p-tree-checkbox ${cbClass}" data-key="${node.key}" role="checkbox" aria-checked="${cbState === "checked" ? "true" : cbState === "indeterminate" ? "mixed" : "false"}">
                            ${cbIcon}
                        </span>
                    `;
        }
        return `
                    <li class="p-treenode" role="treeitem" aria-expanded="${hasChildren ? isExpanded : "false"}" aria-selected="${isSelected}" data-key="${node.key}">
                        <div class="p-treenode-content ${isSelected && selectionMode !== "checkbox" ? "p-highlight" : ""}" data-key="${node.key}" tabindex="0">
                            ${hasChildren ? `
                                <button type="button" class="p-tree-toggler ${isExpanded ? "p-expanded" : ""}" data-toggle="${node.key}" aria-label="Toggle node" tabindex="-1">
                                    ${chevronRightSvg}
                                </button>
                            ` : `<span class="p-tree-toggler-empty"></span>`}
                            ${checkboxHtml}
                            <span class="p-treenode-icon">${iconSvg}</span>
                            <span class="p-treenode-label">${node.label}</span>
                        </div>
                        ${hasChildren && isExpanded ? `
                            <ul class="p-treenode-children" role="group">
                                ${renderNodesHtml(node.children)}
                            </ul>
                        ` : ""}
                    </li>
                `;
      }).join("");
    }
    treeList.innerHTML = renderNodesHtml(visibleNodes);
    bindNodeEvents();
  }
  function bindNodeEvents() {
    const treeList = container.querySelector(".p-treeselect-tree");
    treeList.querySelectorAll(".p-tree-toggler").forEach((toggler) => {
      toggler.addEventListener("click", (e) => {
        e.stopPropagation();
        const key = toggler.getAttribute("data-toggle");
        if (expandedKeys.has(key)) expandedKeys.delete(key);
        else expandedKeys.add(key);
        renderTreeList();
      });
    });
    treeList.querySelectorAll(".p-treenode-content").forEach((content) => {
      content.addEventListener("click", (e) => {
        const target = e.target;
        if (target.closest(".p-tree-toggler")) return;
        const key = content.getAttribute("data-key");
        const node = nodeMap.get(key);
        if (!node || node.disabled) return;
        if (selectionMode === "single") {
          selectedKeys.clear();
          selectedKeys.add(key);
          updateTriggerDisplay();
          renderTreeList();
          disclosure.close();
          syncValue();
        } else if (selectionMode === "multiple") {
          if (selectedKeys.has(key)) selectedKeys.delete(key);
          else selectedKeys.add(key);
          updateTriggerDisplay();
          renderTreeList();
          syncValue();
        } else if (selectionMode === "checkbox") {
          const currentState = getCheckboxState(node);
          const shouldCheck = currentState !== "checked";
          toggleNodeSelection(key, shouldCheck);
        }
      });
    });
  }
  function toggleNodeSelection(key, select) {
    const node = nodeMap.get(key);
    if (!node) return;
    function setDescendants(n, sel) {
      if (sel) selectedKeys.add(n.key);
      else selectedKeys.delete(n.key);
      if (n.children) {
        n.children.forEach((c) => setDescendants(c, sel));
      }
    }
    setDescendants(node, select);
    updateTriggerDisplay();
    renderTreeList();
    syncValue();
  }
  function bindEvents() {
    const trigger = container.querySelector(".p-treeselect-label-container");
    const clearBtn = container.querySelector(".p-treeselect-clear-icon");
    const filterInput = container.querySelector(".p-treeselect-filter-input");
    trigger.addEventListener("click", (e) => {
      if (e.target.closest(".p-treeselect-clear-icon") || e.target.closest(".p-treeselect-token-remove")) return;
      if (isDisabled) return;
      disclosure.toggle();
    });
    trigger.addEventListener("keydown", (e) => {
      if (isDisabled) return;
      if (e.key === " " || e.key === "Enter" || e.key === "ArrowDown") {
        e.preventDefault();
        disclosure.open();
      } else if (e.key === "Escape") {
        disclosure.close();
      }
    });
    clearBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      selectedKeys.clear();
      updateTriggerDisplay();
      renderTreeList();
      syncValue();
    });
    if (filterInput) {
      filterInput.addEventListener("input", () => {
        searchQuery = filterInput.value;
        renderTreeList();
      });
      filterInput.addEventListener("keydown", (e) => {
        if (e.key === "Escape") disclosure.close();
      });
    }
  }
  function syncValue() {
    const selected = getSelectedLabels();
    const payload = selectionMode === "single" ? selected[0]?.key || null : Array.from(selectedKeys);
    container.dispatchEvent(new CustomEvent("treeselect:change", {
      bubbles: true,
      detail: { value: payload, selectedNodes: selected }
    }));
    container.dispatchEvent(new CustomEvent("change", {
      bubbles: true,
      detail: { value: payload }
    }));
  }
  init();
}
var CSS5, checkSvg, minusSvg, chevronRightSvg, chevronDownSvg, searchSvg, xSvg;
var init_tree_select = __esm({
  "src/components/tree-select.ts"() {
    "use strict";
    init_lucide();
    init_styles();
    init_useDisclosure();
    init_useClickOutside();
    CSS5 = `
/* ==================== AURA TREESELECT ==================== */
.laughtale-treeselect,
.p-treeselect {
    display: inline-flex;
    position: relative;
    user-select: none;
    font-family: var(--p-font-family, inherit);
    box-sizing: border-box;
    width: auto;
}

.p-treeselect.p-treeselect-fluid {
    display: flex;
    width: 100%;
}

/* Trigger Box */
.p-treeselect-label-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    min-height: 2.5rem;
    padding: 0.375rem 0.75rem;
    background: var(--p-surface-0);
    border: 1px solid var(--p-border-color);
    border-radius: var(--p-border-radius);
    color: var(--p-text-color);
    cursor: pointer;
    font-size: 0.875rem;
    line-height: 1.25;
    outline: none;
    transition: background 150ms ease, border-color 150ms ease, box-shadow 150ms ease, color 150ms ease;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.02);
    box-sizing: border-box;
}

.p-treeselect-label-container:hover:not(.is-disabled) {
    border-color: var(--p-surface-400);
}

.p-treeselect.is-focused .p-treeselect-label-container,
.p-treeselect-label-container:focus-visible {
    border-color: var(--p-primary-500) !important;
    box-shadow: 0 0 0 1px var(--p-primary-500) !important;
}

/* Filled Variant */
.p-treeselect.variant-filled .p-treeselect-label-container {
    background-color: var(--p-surface-100);
    border-color: transparent;
}
.p-treeselect.variant-filled .p-treeselect-label-container:hover:not(.is-disabled) {
    background-color: var(--p-surface-200);
}
.p-treeselect.variant-filled.is-focused .p-treeselect-label-container {
    background-color: var(--p-surface-0);
    border-color: var(--p-primary-500) !important;
}

/* Sizes */
.p-treeselect.size-small .p-treeselect-label-container,
.p-treeselect.p-treeselect-sm .p-treeselect-label-container {
    min-height: 2rem;
    padding: 0.25rem 0.5rem;
    font-size: 0.75rem;
}
.p-treeselect.size-large .p-treeselect-label-container,
.p-treeselect.p-treeselect-lg .p-treeselect-label-container {
    min-height: 3rem;
    padding: 0.5rem 1rem;
    font-size: 1.0625rem;
}

/* Invalid State */
.p-treeselect.is-invalid .p-treeselect-label-container {
    border-color: var(--p-red-500, #ef4444) !important;
}
.p-treeselect.is-invalid.is-focused .p-treeselect-label-container {
    box-shadow: 0 0 0 1px var(--p-red-500, #ef4444) !important;
}

/* Disabled State */
.p-treeselect.is-disabled {
    opacity: 0.65;
    cursor: not-allowed;
}
.p-treeselect.is-disabled .p-treeselect-label-container {
    background-color: var(--p-surface-100);
    cursor: not-allowed;
    pointer-events: none;
}

/* Label & Chips */
.p-treeselect-label {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.25rem;
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: var(--p-text-color);
}
.p-treeselect-label.p-placeholder {
    color: var(--p-text-muted);
}

.p-treeselect-token {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.125rem 0.5rem;
    background: var(--p-surface-100);
    color: var(--p-surface-800);
    border: 1px solid var(--p-border-color);
    border-radius: calc(var(--p-border-radius) - 2px);
    font-size: 0.75rem;
    font-weight: 500;
}
.p-treeselect-token-remove {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: var(--p-surface-500);
    border: none;
    background: transparent;
    padding: 0;
    margin-left: 0.125rem;
    border-radius: 9999px;
}
.p-treeselect-token-remove:hover {
    color: var(--p-surface-900);
}

/* Actions (Clear & Chevron) */
.p-treeselect-actions {
    display: flex;
    align-items: center;
    gap: 0.35rem;
    margin-left: 0.5rem;
}
.p-treeselect-clear-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    border: none;
    color: var(--p-surface-400);
    cursor: pointer;
    padding: 0.125rem;
    border-radius: 9999px;
    transition: color 150ms ease;
}
.p-treeselect-clear-icon:hover {
    color: var(--p-surface-700);
}
.p-treeselect-dropdown-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: var(--p-surface-500);
    transition: transform 200ms ease;
}
.p-treeselect.is-open .p-treeselect-dropdown-icon {
    transform: rotate(180deg);
}

/* Dropdown Overlay */
.p-treeselect-overlay {
    position: absolute;
    top: calc(100% + 4px);
    left: 0;
    right: 0;
    min-width: 100%;
    z-index: 1000;
    background: var(--p-surface-0);
    border: 1px solid var(--p-border-color);
    border-radius: var(--p-border-radius);
    box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1);
    overflow: hidden;
    display: none;
}
.p-treeselect-overlay.is-open {
    display: block;
}

/* Filter / Search */
.p-treeselect-filter-container {
    padding: 0.5rem;
    background: var(--p-surface-50);
    border-bottom: 1px solid var(--p-border-color);
    display: flex;
    align-items: center;
    gap: 0.5rem;
}
.p-treeselect-filter-input {
    width: 100%;
    font-family: inherit;
    font-size: 0.8125rem;
    padding: 0.375rem 0.625rem;
    background: var(--p-surface-0);
    border: 1px solid var(--p-border-color);
    border-radius: calc(var(--p-border-radius) - 2px);
    color: var(--p-text-color);
    outline: none;
    box-sizing: border-box;
}
.p-treeselect-filter-input:focus {
    border-color: var(--p-primary-500);
}

/* Header & Footer Templates */
.p-treeselect-header {
    padding: 0.5rem 0.75rem;
    background: var(--p-surface-50);
    border-bottom: 1px solid var(--p-border-color);
    font-size: 0.8125rem;
    font-weight: 600;
    color: var(--p-text-color);
}
.p-treeselect-footer {
    padding: 0.5rem 0.75rem;
    background: var(--p-surface-50);
    border-top: 1px solid var(--p-border-color);
    font-size: 0.75rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

/* Tree Nodes List */
.p-treeselect-tree {
    max-height: 280px;
    overflow-y: auto;
    padding: 0.375rem;
    margin: 0;
    list-style: none;
}

.p-treenode {
    list-style: none;
    margin: 0;
    padding: 0;
}

.p-treenode-children {
    padding-left: 1.25rem;
    margin: 0;
    list-style: none;
}

.p-treenode-content {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    padding: 0.375rem 0.5rem;
    border-radius: calc(var(--p-border-radius) - 2px);
    cursor: pointer;
    color: var(--p-text-color);
    font-size: 0.8125rem;
    transition: background 150ms ease, color 150ms ease;
    outline: none;
}
.p-treenode-content:hover:not(.p-disabled) {
    background: var(--p-surface-100);
}
.p-treenode-content.p-highlight {
    background: var(--p-surface-900);
    color: var(--p-surface-0);
}
.p-treenode-content.p-highlight .p-tree-toggler,
.p-treenode-content.p-highlight .p-treenode-icon {
    color: var(--p-surface-0);
}

.p-tree-toggler {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 1.25rem;
    height: 1.25rem;
    cursor: pointer;
    color: var(--p-surface-500);
    border-radius: 9999px;
    transition: transform 150ms ease, color 150ms ease;
    border: none;
    background: transparent;
    padding: 0;
}
.p-tree-toggler:hover {
    color: var(--p-surface-900);
}
.p-tree-toggler.p-expanded {
    transform: rotate(90deg);
}
.p-tree-toggler-empty {
    width: 1.25rem;
    height: 1.25rem;
    display: inline-block;
}

.p-treenode-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: var(--p-primary-600);
    width: 16px;
    height: 16px;
}

.p-treenode-label {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

/* Checkbox inside tree node */
.p-tree-checkbox {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 1.125rem;
    height: 1.125rem;
    border: 1px solid var(--p-border-color);
    border-radius: 4px;
    background: var(--p-surface-0);
    cursor: pointer;
    transition: all 150ms ease;
}
.p-tree-checkbox:hover {
    border-color: var(--p-primary-500);
}
.p-tree-checkbox.p-checked {
    background: var(--p-primary-500);
    border-color: var(--p-primary-500);
    color: #ffffff;
}
.p-tree-checkbox.p-indeterminate {
    background: var(--p-primary-500);
    border-color: var(--p-primary-500);
    color: #ffffff;
}
.p-tree-checkbox svg {
    width: 12px;
    height: 12px;
}

/* ==================== DARK MODE ==================== */
.dark .p-treeselect-label-container {
    background-color: var(--p-surface-900);
    border-color: var(--p-surface-700);
    color: var(--p-surface-0);
}
.dark .p-treeselect-label-container:hover:not(.is-disabled) {
    border-color: var(--p-surface-500);
}
.dark .p-treeselect.variant-filled .p-treeselect-label-container {
    background-color: var(--p-surface-800);
}
.dark .p-treeselect.variant-filled .p-treeselect-label-container:hover:not(.is-disabled) {
    background-color: var(--p-surface-700);
}
.dark .p-treeselect.variant-filled.is-focused .p-treeselect-label-container {
    background-color: var(--p-surface-900);
}
.dark .p-treeselect-token {
    background: var(--p-surface-800);
    color: var(--p-surface-100);
    border-color: var(--p-surface-700);
}
.dark .p-treeselect-overlay {
    background: var(--p-surface-900);
    border-color: var(--p-surface-700);
    box-shadow: 0 10px 15px -3px rgba(0,0,0,0.5);
}
.dark .p-treeselect-filter-container,
.dark .p-treeselect-header,
.dark .p-treeselect-footer {
    background: var(--p-surface-850, #141b26);
    border-color: var(--p-surface-700);
}
.dark .p-treeselect-filter-input {
    background: var(--p-surface-900);
    border-color: var(--p-surface-700);
    color: var(--p-surface-0);
}
.dark .p-treenode-content:hover:not(.p-disabled) {
    background: var(--p-surface-800);
}
.dark .p-treenode-content.p-highlight {
    background: var(--p-surface-0);
    color: var(--p-surface-900);
}
.dark .p-treenode-content.p-highlight .p-tree-toggler,
.dark .p-treenode-content.p-highlight .p-treenode-icon {
    color: var(--p-surface-900);
}
.dark .p-tree-toggler {
    color: var(--p-surface-400);
}
.dark .p-tree-toggler:hover {
    color: var(--p-surface-100);
}
.dark .p-tree-checkbox {
    background: var(--p-surface-900);
    border-color: var(--p-surface-600);
}
`;
    checkSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;
    minusSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>`;
    chevronRightSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>`;
    chevronDownSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>`;
    searchSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`;
    xSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`;
  }
});

// src/components/datagrid.ts
var datagrid_exports = {};
__export(datagrid_exports, {
  default: () => DataGridIsland
});
function DataGridIsland(container, props) {
  injectIslandStyle("datagrid", CSS6);
  let searchQuery = "";
  let sortField = props.columns[0]?.field || "";
  let sortAsc = true;
  let currentPage = 1;
  const pageSize = props.pageSize || 5;
  function render() {
    let filtered = props.data.filter((row) => {
      if (!searchQuery.trim()) return true;
      return Object.values(row).some(
        (val) => String(val).toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
    if (sortField) {
      filtered.sort((a, b) => {
        const valA = a[sortField];
        const valB = b[sortField];
        if (valA < valB) return sortAsc ? -1 : 1;
        if (valA > valB) return sortAsc ? 1 : -1;
        return 0;
      });
    }
    const totalPages = Math.ceil(filtered.length / pageSize) || 1;
    if (currentPage > totalPages) currentPage = totalPages;
    const startIdx = (currentPage - 1) * pageSize;
    const pageRows = filtered.slice(startIdx, startIdx + pageSize);
    const headerCells = props.columns.map((col) => `
            <th data-field="${col.field}" style="padding: 0.75rem 1rem; border-bottom: 1px solid var(--p-border-color); text-align: left; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--p-surface-500); cursor: ${col.sortable !== false ? "pointer" : "default"}; user-select: none;">
                <div style="display: flex; align-items: center; gap: 0.35rem;">
                    <span>${col.header}</span>
                    ${col.sortable !== false ? `<span style="font-size: 0.6875rem; color: ${sortField === col.field ? "var(--p-surface-950)" : "var(--p-surface-300)"};">${sortField === col.field ? sortAsc ? "\u25B2" : "\u25BC" : "\u2195"}</span>` : ""}
                </div>
            </th>
        `).join("");
    const rowCells = pageRows.map((row) => `
            <tr style="border-bottom: 1px solid var(--p-surface-100); transition: background 0.15s ease;">
                ${props.columns.map((col) => `
                    <td style="padding: 0.75rem 1rem; font-size: 0.8125rem; color: var(--p-surface-700);">
                        ${row[col.field] ?? ""}
                    </td>
                `).join("")}
            </tr>
        `).join("");
    container.innerHTML = `
            <div class="laughtale-datagrid" style="border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius-lg); overflow: hidden; background: var(--p-surface-0);">
                <!-- Toolbar -->
                <div style="display: flex; align-items: center; justify-content: space-between; gap: 1rem; padding: 0.875rem 1.25rem; background: var(--p-surface-50); border-bottom: 1px solid var(--p-border-color); flex-wrap: wrap;">
                    <div style="font-size: 0.9375rem; font-weight: 700; color: var(--p-surface-900);">
                        ${props.title || "Enterprise Records"}
                    </div>
                    <div style="position: relative;">
                        <input type="text" class="datagrid-search" placeholder="Search table..." value="${searchQuery}" style="padding: 0.4rem 0.75rem; border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius); font-size: 0.8125rem; width: 220px; outline: none; background: white;" />
                    </div>
                </div>

                <!-- Table -->
                <div style="overflow-x: auto;">
                    <table style="width: 100%; border-collapse: collapse;">
                        <thead><tr style="background: var(--p-surface-50);">${headerCells}</tr></thead>
                        <tbody>${rowCells.length > 0 ? rowCells : `<tr><td colspan="${props.columns.length}" style="text-align: center; padding: 2rem; color: var(--p-surface-400); font-size: 0.875rem;">No matching records found.</td></tr>`}</tbody>
                    </table>
                </div>

                <!-- Pagination Footer -->
                <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.75rem 1.25rem; background: var(--p-surface-50); border-top: 1px solid var(--p-border-color); font-size: 0.75rem; color: var(--p-surface-500);">
                    <div>Showing ${filtered.length > 0 ? startIdx + 1 : 0} to ${Math.min(startIdx + pageSize, filtered.length)} of ${filtered.length} entries</div>
                    <div style="display: flex; gap: 0.5rem;">
                        <button type="button" class="p-button p-button-secondary prev-page" ${currentPage === 1 ? 'disabled style="opacity: 0.5; cursor: not-allowed;"' : ""} style="padding: 0.25rem 0.6rem; font-size: 0.75rem;">Prev</button>
                        <span style="display: flex; align-items: center; padding: 0 0.5rem; font-weight: 600; color: var(--p-surface-900);">${currentPage} / ${totalPages}</span>
                        <button type="button" class="p-button p-button-secondary next-page" ${currentPage === totalPages ? 'disabled style="opacity: 0.5; cursor: not-allowed;"' : ""} style="padding: 0.25rem 0.6rem; font-size: 0.75rem;">Next</button>
                    </div>
                </div>
            </div>
        `;
    const searchInput = container.querySelector(".datagrid-search");
    searchInput.addEventListener("input", (e) => {
      searchQuery = e.target.value;
      currentPage = 1;
      render();
      const updatedInput = container.querySelector(".datagrid-search");
      updatedInput.focus();
      updatedInput.setSelectionRange(searchQuery.length, searchQuery.length);
    });
    container.querySelectorAll("th[data-field]").forEach((th) => {
      th.addEventListener("click", () => {
        const field = th.getAttribute("data-field");
        if (sortField === field) {
          sortAsc = !sortAsc;
        } else {
          sortField = field;
          sortAsc = true;
        }
        render();
      });
    });
    container.querySelector(".prev-page")?.addEventListener("click", () => {
      if (currentPage > 1) {
        currentPage--;
        render();
      }
    });
    container.querySelector(".next-page")?.addEventListener("click", () => {
      if (currentPage < totalPages) {
        currentPage++;
        render();
      }
    });
  }
  render();
}
var CSS6;
var init_datagrid = __esm({
  "src/components/datagrid.ts"() {
    "use strict";
    init_styles();
    CSS6 = `
[data-theme="dark"] .laughtale-datagrid {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
[data-theme="dark"] .datagrid-search {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
`;
  }
});

// src/components/modal.ts
var modal_exports = {};
__export(modal_exports, {
  default: () => ModalDialogIsland
});
function ModalDialogIsland(container, props) {
  injectIslandStyle("modal-dialog", `
        .aura-dialog-mask {
            position: fixed;
            inset: 0;
            background: rgba(15, 23, 42, 0.45);
            backdrop-filter: blur(6px);
            z-index: 1100;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 1.5rem;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .aura-dialog-mask.modal-open {
            opacity: 1;
            pointer-events: auto;
        }
        .aura-dialog {
            background: var(--p-surface-0);
            border: 1px solid var(--p-border-color);
            border-radius: var(--p-border-radius-xl);
            box-shadow: var(--p-shadow-lg);
            max-width: 32rem;
            width: 100%;
            overflow: hidden;
            transform: scale(0.95) translateY(8px);
            transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .aura-dialog-mask.modal-open .aura-dialog {
            transform: scale(1) translateY(0);
        }
    `);
  const slotEl = getSlot(container);
  const slotHtml = slotEl ? slotEl.innerHTML : '<p style="color: var(--p-text-muted); font-size: 0.875rem;">No slot content provided.</p>';
  container.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 0.75rem;">
            <div style="display: flex; align-items: center; justify-content: space-between;">
                <span style="font-size: 0.8125rem; font-weight: 600; color: var(--p-surface-600);">Server Slot Projection</span>
                <span class="aura-tag tag-purple">Hydrate: Interaction</span>
            </div>

            <div>
                <button type="button" class="p-button p-button-primary modal-open-btn">
                    <span>\u{1F510}</span>
                    ${props.triggerButtonText}
                </button>
            </div>

            <div class="aura-dialog-mask modal-overlay">
                <div class="aura-dialog">
                    <div style="display: flex; align-items: center; justify-content: space-between; padding: 1.25rem 1.5rem; border-bottom: 1px solid var(--p-border-color);">
                        <h3 style="font-size: 1rem; font-weight: 700; color: var(--p-surface-950);">${props.dialogTitle}</h3>
                        <button type="button" class="modal-close-btn" style="background: none; border: none; font-size: 1.125rem; color: var(--p-surface-400); cursor: pointer; padding: 0.25rem;">\u2715</button>
                    </div>

                    <!-- Projected C# Server Slot Content -->
                    <div class="modal-body" style="padding: 1.5rem;">
                        ${slotHtml}
                    </div>

                    <div style="display: flex; justify-content: flex-end; gap: 0.5rem; padding: 1rem 1.5rem; border-top: 1px solid var(--p-border-color); background: var(--p-surface-50);">
                        <button type="button" class="p-button p-button-secondary modal-cancel-btn">Cancel</button>
                        <button type="button" class="p-button p-button-primary modal-confirm-btn">Confirm Operation</button>
                    </div>
                </div>
            </div>
        </div>
    
  [data-theme="dark"] .dummy-dark {}
`;
  const openBtn = container.querySelector(".modal-open-btn");
  const overlay = container.querySelector(".modal-overlay");
  const dialog = container.querySelector(".aura-dialog");
  const closeBtn = container.querySelector(".modal-close-btn");
  const cancelBtn = container.querySelector(".modal-cancel-btn");
  const confirmBtn = container.querySelector(".modal-confirm-btn");
  const focusTrap = useFocusTrap(dialog);
  const disclosure = useDisclosure({
    defaultIsOpen: false,
    onOpen: () => {
      overlay.classList.add("modal-open");
      focusTrap.activate();
    },
    onClose: () => {
      overlay.classList.remove("modal-open");
      focusTrap.deactivate();
    }
  });
  openBtn.addEventListener("click", () => disclosure.open());
  closeBtn.addEventListener("click", () => disclosure.close());
  cancelBtn.addEventListener("click", () => disclosure.close());
  confirmBtn.addEventListener("click", () => {
    container.dispatchEvent(new CustomEvent("modal:confirmed", { bubbles: true }));
    disclosure.close();
  });
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) disclosure.close();
  });
}
var init_modal = __esm({
  "src/components/modal.ts"() {
    "use strict";
    init_index();
    init_useDisclosure();
    init_useFocusTrap();
  }
});

// src/components/toast.ts
var toast_exports = {};
__export(toast_exports, {
  default: () => ToastIsland
});
function ToastIsland(container) {
  injectIslandStyle("toast", CSS7);
  const toastThemes = {
    success: { bg: "#ecfdf5", border: "#a7f3d0", color: "#047857", icon: "\u2713" },
    info: { bg: "#eff6ff", border: "#bfdbfe", color: "#1d4ed8", icon: "\u2139" },
    warn: { bg: "#fffbeb", border: "#fde68a", color: "#b45309", icon: "\u26A0" },
    error: { bg: "#fef2f2", border: "#fecaca", color: "#b91c1c", icon: "\u2715" }
  };
  container.style.position = "fixed";
  container.style.top = "1.5rem";
  container.style.right = "1.5rem";
  container.style.zIndex = "9999";
  container.style.display = "flex";
  container.style.flexDirection = "column";
  container.style.gap = "0.75rem";
  container.style.pointerEvents = "none";
  function addToast(msg) {
    const severity = msg.severity || "success";
    const theme = toastThemes[severity] || toastThemes.success;
    const duration = msg.durationMs || 4e3;
    const toastEl = document.createElement("div");
    toastEl.className = "laughtale-toast";
    toastEl.innerHTML = '<div class="toast-icon" style="background: ' + theme.bg + "; color: " + theme.color + ';">' + theme.icon + '</div><div style="flex: 1;"><div class="toast-title">' + msg.title + "</div>" + (msg.description ? '<div class="toast-desc">' + msg.description + "</div>" : "") + '</div><button type="button" class="toast-close">\u2715</button>';
    toastEl.querySelector(".toast-close")?.addEventListener("click", () => {
      toastEl.classList.add("leaving");
      setTimeout(() => toastEl.remove(), 300);
    });
    container.appendChild(toastEl);
    setTimeout(() => {
      toastEl.classList.add("leaving");
      setTimeout(() => toastEl.remove(), 300);
    }, duration);
  }
  window.addEventListener("laughtale:toast", (e) => {
    if (e.detail) addToast(e.detail);
  });
}
var CSS7;
var init_toast = __esm({
  "src/components/toast.ts"() {
    "use strict";
    init_styles();
    CSS7 = `
@keyframes toast-slideIn {
    from { opacity: 0; transform: translateX(100%); }
    to { opacity: 1; transform: translateX(0); }
}
@keyframes toast-slideOut {
    from { opacity: 1; transform: translateX(0); }
    to { opacity: 0; transform: translateX(100%); }
}
.laughtale-toast {
    pointer-events: auto;
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
    padding: 0.875rem 1.125rem;
    border-radius: var(--p-border-radius-lg, 0.75rem);
    background: var(--p-surface-0, #ffffff);
    border: 1px solid var(--p-surface-200);
    box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1);
    width: 340px;
    animation: toast-slideIn 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}
.laughtale-toast.leaving {
    animation: toast-slideOut 0.3s ease forwards;
}
.toast-icon {
    width: 1.5rem;
    height: 1.5rem;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 0.75rem;
    flex-shrink: 0;
}
.toast-title { font-size: 0.875rem; font-weight: 600; color: var(--p-surface-900); }
.toast-desc { font-size: 0.75rem; color: var(--p-surface-500); margin-top: 0.15rem; }
.toast-close {
    background: none;
    border: none;
    font-size: 1rem;
    color: var(--p-surface-400);
    cursor: pointer;
    padding: 0 0.25rem;
}
.toast-close:hover { color: var(--p-surface-600); }
[data-theme="dark"] .laughtale-toast {
    background: var(--p-surface-800);
    border-color: var(--p-surface-700);
}
[data-theme="dark"] .toast-title { color: var(--p-surface-100); }
[data-theme="dark"] .toast-desc { color: var(--p-surface-400); }
[data-theme="dark"] .toast-close { color: var(--p-surface-400); }
`;
  }
});

// src/components/input-number.ts
var input_number_exports = {};
__export(input_number_exports, {
  default: () => InputNumberIsland
});
function InputNumberIsland(container, props) {
  injectIslandStyle("laughtale-inputnumber", CSS8);
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
var CSS8;
var init_input_number = __esm({
  "src/components/input-number.ts"() {
    "use strict";
    init_styles();
    CSS8 = `
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
  }
});

// src/components/input-otp.ts
var input_otp_exports = {};
__export(input_otp_exports, {
  default: () => InputOtpIsland
});
function InputOtpIsland(container, props) {
  injectIslandStyle("laughtale-inputotp", CSS9);
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
var CSS9;
var init_input_otp = __esm({
  "src/components/input-otp.ts"() {
    "use strict";
    init_styles();
    CSS9 = `
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
  }
});

// src/components/input-password.ts
var input_password_exports = {};
__export(input_password_exports, {
  default: () => InputPasswordIsland
});
function InputPasswordIsland(container, props) {
  injectIslandStyle("laughtale-password", CSS10);
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
    const xIcon2 = `<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>`;
    return `
            <div class="p-password-chips-wrap">
                <span class="p-password-chip ${r.length ? "is-met" : ""}" data-rule="length">
                    ${r.length ? checkIcon : xIcon2} ${minLength}+ characters
                </span>
                <span class="p-password-chip ${r.number ? "is-met" : ""}" data-rule="number">
                    ${r.number ? checkIcon : xIcon2} Number
                </span>
                <span class="p-password-chip ${r.uppercase ? "is-met" : ""}" data-rule="uppercase">
                    ${r.uppercase ? checkIcon : xIcon2} Uppercase letter
                </span>
                <span class="p-password-chip ${r.special ? "is-met" : ""}" data-rule="special">
                    ${r.special ? checkIcon : xIcon2} Special character
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
    const xIcon2 = `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>`;
    return `
            <div class="p-password-list-item ${r.length ? "is-met" : ""}" data-rule="length">
                ${r.length ? checkIcon : xIcon2} At least ${minLength} characters long
            </div>
            <div class="p-password-list-item ${r.uppercase ? "is-met" : ""}" data-rule="uppercase">
                ${r.uppercase ? checkIcon : xIcon2} Contains uppercase letter
            </div>
            <div class="p-password-list-item ${r.lowercase ? "is-met" : ""}" data-rule="lowercase">
                ${r.lowercase ? checkIcon : xIcon2} Contains lowercase letter
            </div>
            <div class="p-password-list-item ${r.number ? "is-met" : ""}" data-rule="number">
                ${r.number ? checkIcon : xIcon2} Contains number
            </div>
            <div class="p-password-list-item ${r.special ? "is-met" : ""}" data-rule="special">
                ${r.special ? checkIcon : xIcon2} Contains special character (!@#$...)
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
    const xIcon2 = `<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>`;
    container.querySelectorAll(".p-password-chip").forEach((chip) => {
      const rule = chip.getAttribute("data-rule");
      const isMet = r[rule];
      chip.classList.toggle("is-met", isMet);
      const text = chip.textContent?.trim().replace(/^[✔✕]\s*/, "") || "";
      chip.innerHTML = `${isMet ? checkIcon : xIcon2} ${text}`;
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
var CSS10;
var init_input_password = __esm({
  "src/components/input-password.ts"() {
    "use strict";
    init_styles();
    init_lucide();
    CSS10 = `
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
  }
});

// src/components/toggle-switch.ts
var toggle_switch_exports = {};
__export(toggle_switch_exports, {
  default: () => ToggleSwitchIsland
});
function ToggleSwitchIsland(container, props) {
  injectIslandStyle("toggle-switch", CSS11);
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
var CSS11;
var init_toggle_switch = __esm({
  "src/components/toggle-switch.ts"() {
    "use strict";
    init_styles();
    CSS11 = `
[data-theme="dark"] .laughtale-toggle-switch {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
`;
  }
});

// src/components/slider.ts
var slider_exports = {};
__export(slider_exports, {
  default: () => SliderIsland
});
function SliderIsland(container, props) {
  injectIslandStyle("slider", CSS12);
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
var CSS12;
var init_slider = __esm({
  "src/components/slider.ts"() {
    "use strict";
    init_styles();
    CSS12 = `
[data-theme="dark"] .laughtale-slider {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
[data-theme="dark"] .slider-track {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
[data-theme="dark"] .slider-fill {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
[data-theme="dark"] .slider-handle {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
[data-theme="dark"] .slider-value-display {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
`;
  }
});

// src/components/rating.ts
var rating_exports = {};
__export(rating_exports, {
  default: () => RatingIsland
});
function RatingIsland(container, props) {
  injectIslandStyle("laughtale-rating", CSS13);
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
var CSS13, starFilledSvg, starEmptySvg, cancelSvg;
var init_rating = __esm({
  "src/components/rating.ts"() {
    "use strict";
    init_styles();
    init_useControllableState();
    CSS13 = `
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
    starFilledSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`;
    starEmptySvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`;
    cancelSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>`;
  }
});

// src/components/select-button.ts
var select_button_exports = {};
__export(select_button_exports, {
  default: () => SelectButtonIsland
});
function SelectButtonIsland(container, props) {
  injectIslandStyle("select-button", CSS14);
  let selectedValue = props.value || props.items[0]?.value || "";
  function render() {
    const buttons = props.items.map((item) => {
      const isSelected = selectedValue === item.value;
      return `
                <button type="button" 
                        class="select-btn-item" 
                        data-value="${item.value}" 
                        ${props.disabled ? "disabled" : ""} 
                        style="padding: 0.45rem 1rem; border: none; background: ${isSelected ? "var(--p-surface-950)" : "transparent"}; color: ${isSelected ? "#ffffff" : "var(--p-surface-700)"}; font-size: 0.8125rem; font-weight: ${isSelected ? "600" : "500"}; border-radius: var(--p-border-radius); cursor: ${props.disabled ? "not-allowed" : "pointer"}; transition: all 0.15s ease; display: inline-flex; align-items: center; gap: 0.35rem;">
                    ${item.icon ? `<span>${item.icon}</span>` : ""}
                    <span>${item.label}</span>
                </button>
            `;
    }).join("");
    container.innerHTML = `
            <div class="laughtale-select-button" style="display: inline-flex; background: var(--p-surface-100); padding: 0.25rem; border-radius: var(--p-border-radius-lg); border: 1px solid var(--p-border-color); gap: 0.25rem;">
                ${buttons}
            </div>
        `;
    if (props.disabled) return;
    container.querySelectorAll(".select-btn-item").forEach((btn) => {
      btn.addEventListener("click", () => {
        selectedValue = btn.getAttribute("data-value");
        render();
        syncValue();
      });
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
    container.dispatchEvent(new CustomEvent("selectbutton:change", {
      bubbles: true,
      detail: { value: selectedValue }
    }));
  }
  render();
}
var CSS14;
var init_select_button = __esm({
  "src/components/select-button.ts"() {
    "use strict";
    init_styles();
    CSS14 = `
[data-theme="dark"] .select-btn-item {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
[data-theme="dark"] .laughtale-select-button {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
`;
  }
});

// src/components/input-tags.ts
var input_tags_exports = {};
__export(input_tags_exports, {
  default: () => InputTagsIsland
});
function InputTagsIsland(container, props) {
  injectIslandStyle("laughtale-inputtags", CSS15);
  let initialValues = [];
  const rawVal = props.values ?? props.value;
  if (Array.isArray(rawVal)) {
    initialValues = rawVal.map(String);
  } else if (typeof rawVal === "string" && rawVal.trim().length > 0) {
    try {
      const parsed = JSON.parse(rawVal);
      if (Array.isArray(parsed)) initialValues = parsed.map(String);
      else initialValues = rawVal.split(",").map((s) => s.trim()).filter(Boolean);
    } catch {
      initialValues = rawVal.split(",").map((s) => s.trim()).filter(Boolean);
    }
  }
  const [getTags, setTags] = useControllableState({
    defaultValue: initialValues,
    onChange: (tags) => {
      syncTargetInput(tags);
    }
  });
  const isFluid = props.fluid === true || String(props.fluid) === "true";
  const isFilled = props.variant === "filled";
  const isDisabled = props.disabled === true || String(props.disabled) === "true";
  const isReadonly = props.readonlyMode === true || String(props.readonlyMode) === "true";
  const isInvalid = props.invalid === true || String(props.invalid) === "true";
  const allowDuplicate = props.allowDuplicate === true || String(props.allowDuplicate) === "true";
  const addOnPaste = props.addOnPaste !== false && String(props.addOnPaste) !== "false";
  const maxItems = props.max ? Number(props.max) : null;
  const delimiter = props.delimiter || props.separator || ",";
  const hasTypeahead = props.typeahead === true || String(props.typeahead) === "true";
  let suggestionsList = [];
  if (props.suggestions) {
    if (Array.isArray(props.suggestions)) suggestionsList = props.suggestions;
    else if (typeof props.suggestions === "string") {
      try {
        const parsed = JSON.parse(props.suggestions);
        if (Array.isArray(parsed)) suggestionsList = parsed;
      } catch {
        suggestionsList = props.suggestions.split(",").map((s) => s.trim()).filter(Boolean);
      }
    }
  }
  let activeSuggestionIndex = -1;
  let filteredSuggestions = [];
  function escapeHtml(str) {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
  function createTagElement(tag, index) {
    const el = document.createElement("span");
    el.className = "p-inputtags-tag";
    el.setAttribute("data-index", String(index));
    el.setAttribute("tabindex", "0");
    el.setAttribute("role", "option");
    el.setAttribute("aria-selected", "true");
    el.innerHTML = `
            <span class="p-inputtags-tag-label">${escapeHtml(tag)}</span>
            ${!isDisabled && !isReadonly ? `
                <button type="button" class="p-inputtags-tag-remove" data-index="${index}" aria-label="Remove ${escapeHtml(tag)}" tabindex="-1">
                    ${xCircleIcon}
                </button>
            ` : ""}
        `;
    bindTagEvents(el);
    return el;
  }
  function bindTagEvents(tagEl) {
    const removeBtn = tagEl.querySelector(".p-inputtags-tag-remove");
    if (removeBtn) {
      removeBtn.addEventListener("mousedown", (e) => e.preventDefault());
      removeBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        const idx = Number(tagEl.getAttribute("data-index"));
        removeTag(idx);
      });
    }
    tagEl.addEventListener("keydown", (e) => {
      const idx = Number(tagEl.getAttribute("data-index"));
      if (e.key === "Backspace" || e.key === "Delete") {
        e.preventDefault();
        removeTag(idx);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        const prevTag = tagEl.previousElementSibling;
        if (prevTag && prevTag.classList.contains("p-inputtags-tag")) {
          prevTag.focus();
        }
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        const nextTag = tagEl.nextElementSibling;
        if (nextTag && nextTag.classList.contains("p-inputtags-tag")) {
          nextTag.focus();
        } else {
          const input = container.querySelector(".p-inputtags-input");
          input?.focus();
        }
      }
    });
  }
  function updateTagIndices() {
    const allTags = container.querySelectorAll(".p-inputtags-tag");
    allTags.forEach((el, i) => {
      el.setAttribute("data-index", String(i));
      const btn = el.querySelector(".p-inputtags-tag-remove");
      if (btn) btn.setAttribute("data-index", String(i));
    });
    const input = container.querySelector(".p-inputtags-input");
    if (input) {
      const current = getTags();
      if (current.length === 0) {
        input.placeholder = props.placeholder || "";
      } else {
        input.placeholder = "";
      }
      if (maxItems !== null && current.length >= maxItems) {
        input.style.display = "none";
      } else {
        input.style.display = "";
      }
    }
  }
  function addTag(val) {
    val = val.trim();
    if (!val) return;
    const current = getTags();
    if (maxItems !== null && current.length >= maxItems) return;
    if (!allowDuplicate && current.includes(val)) {
      const existingEl = container.querySelector(`.p-inputtags-tag[data-index="${current.indexOf(val)}"]`);
      if (existingEl) {
        existingEl.classList.add("is-focused");
        setTimeout(() => existingEl.classList.remove("is-focused"), 300);
      }
      return;
    }
    const newTags = [...current, val];
    setTags(newTags);
    const input = container.querySelector(".p-inputtags-input");
    const tagEl = createTagElement(val, current.length);
    if (input) {
      container.insertBefore(tagEl, input);
      input.value = "";
    } else {
      container.appendChild(tagEl);
    }
    updateTagIndices();
    container.dispatchEvent(new CustomEvent("tags:add", {
      bubbles: true,
      detail: { value: val, values: newTags }
    }));
  }
  function removeTag(index) {
    const current = getTags();
    if (index < 0 || index >= current.length) return;
    const removedVal = current[index];
    const newTags = current.filter((_, i) => i !== index);
    setTags(newTags);
    const tagEl = container.querySelector(`.p-inputtags-tag[data-index="${index}"]`);
    if (tagEl) {
      tagEl.remove();
    }
    updateTagIndices();
    const input = container.querySelector(".p-inputtags-input");
    input?.focus();
    container.dispatchEvent(new CustomEvent("tags:remove", {
      bubbles: true,
      detail: { value: removedVal, index, values: newTags }
    }));
  }
  function init() {
    const tags = getTags();
    const inputIdAttr = props.inputId ? `id="${props.inputId}"` : "";
    const isMaxReached = maxItems !== null && tags.length >= maxItems;
    container.className = "laughtale-inputtags p-inputtags";
    container.setAttribute("role", "listbox");
    container.setAttribute("aria-orientation", "horizontal");
    if (isFluid) container.classList.add("p-inputtags-fluid");
    if (isFilled) container.classList.add("variant-filled");
    if (props.size) container.classList.add(`size-${props.size}`);
    if (isInvalid) container.classList.add("is-invalid");
    if (isDisabled) container.classList.add("is-disabled");
    let tagsHtml = tags.map((tag, idx) => `
            <span class="p-inputtags-tag" data-index="${idx}" tabindex="0" role="option" aria-selected="true">
                <span class="p-inputtags-tag-label">${escapeHtml(tag)}</span>
                ${!isDisabled && !isReadonly ? `
                    <button type="button" class="p-inputtags-tag-remove" data-index="${idx}" aria-label="Remove ${escapeHtml(tag)}" tabindex="-1">
                        ${xCircleIcon}
                    </button>
                ` : ""}
            </span>
        `).join("");
    let inputHtml = `
            <input type="text"
                   class="p-inputtags-input"
                   ${inputIdAttr}
                   placeholder="${tags.length === 0 ? props.placeholder || "" : ""}"
                   ${isDisabled ? "disabled" : ""}
                   ${isReadonly ? "readonly" : ""}
                   autocomplete="off"
                   spellcheck="false"
                   ${isMaxReached ? 'style="display: none;"' : ""}
                   ${hasTypeahead ? 'role="combobox" aria-autocomplete="list" aria-expanded="false"' : ""} />
        `;
    container.innerHTML = `
            ${tagsHtml}
            ${inputHtml}
            ${hasTypeahead ? `<div class="p-inputtags-panel" style="display: none;"></div>` : ""}
        `;
    container.querySelectorAll(".p-inputtags-tag").forEach(bindTagEvents);
    container.addEventListener("click", (e) => {
      if (e.target === container || e.target.classList.contains("p-inputtags")) {
        const input = container.querySelector(".p-inputtags-input");
        input?.focus();
      }
    });
    bindInputEvents();
  }
  function bindInputEvents() {
    if (isDisabled || isReadonly) return;
    const input = container.querySelector(".p-inputtags-input");
    const panel = container.querySelector(".p-inputtags-panel");
    if (!input) return;
    input.addEventListener("keydown", (e) => {
      const val = input.value;
      const current = getTags();
      if (delimiter && e.key === delimiter) {
        e.preventDefault();
        if (val.trim()) {
          addTag(val);
        }
        closeTypeahead();
        return;
      }
      if (e.key === "Enter") {
        e.preventDefault();
        if (hasTypeahead && activeSuggestionIndex >= 0 && filteredSuggestions[activeSuggestionIndex]) {
          addTag(filteredSuggestions[activeSuggestionIndex]);
          closeTypeahead();
        } else if (val.trim()) {
          addTag(val);
          closeTypeahead();
        }
      } else if (e.key === "Backspace" && !val && current.length > 0) {
        removeTag(current.length - 1);
      } else if (e.key === "ArrowLeft" && !val && current.length > 0) {
        const allTags = container.querySelectorAll(".p-inputtags-tag");
        if (allTags.length > 0) {
          allTags[allTags.length - 1].focus();
        }
      } else if (hasTypeahead && panel) {
        if (e.key === "ArrowDown") {
          e.preventDefault();
          if (filteredSuggestions.length > 0) {
            activeSuggestionIndex = (activeSuggestionIndex + 1) % filteredSuggestions.length;
            updateSuggestionHighlight();
          }
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          if (filteredSuggestions.length > 0) {
            activeSuggestionIndex = (activeSuggestionIndex - 1 + filteredSuggestions.length) % filteredSuggestions.length;
            updateSuggestionHighlight();
          }
        } else if (e.key === "Escape") {
          closeTypeahead();
        } else if (e.key === "Tab" && activeSuggestionIndex >= 0 && filteredSuggestions[activeSuggestionIndex]) {
          addTag(filteredSuggestions[activeSuggestionIndex]);
          closeTypeahead();
        }
      }
    });
    input.addEventListener("paste", (e) => {
      if (!addOnPaste) return;
      const pasteData = e.clipboardData?.getData("text");
      if (pasteData && (pasteData.includes(",") || delimiter && pasteData.includes(delimiter))) {
        e.preventDefault();
        const splitRegex = new RegExp(`[\\s,${delimiter}]+`);
        const items = pasteData.split(splitRegex).map((s) => s.trim()).filter(Boolean);
        items.forEach((item) => addTag(item));
      }
    });
    if (hasTypeahead && panel) {
      input.addEventListener("input", () => {
        const query = input.value.trim().toLowerCase();
        if (!query) {
          closeTypeahead();
          return;
        }
        const current = getTags();
        filteredSuggestions = suggestionsList.filter((s) => {
          const match = s.toLowerCase().includes(query);
          return allowDuplicate ? match : match && !current.includes(s);
        });
        if (filteredSuggestions.length > 0) {
          activeSuggestionIndex = 0;
          renderTypeaheadPanel();
        } else {
          closeTypeahead();
        }
      });
      document.addEventListener("click", (e) => {
        if (!container.contains(e.target)) {
          closeTypeahead();
        }
      });
    }
  }
  function renderTypeaheadPanel() {
    const panel = container.querySelector(".p-inputtags-panel");
    const input = container.querySelector(".p-inputtags-input");
    if (!panel) return;
    panel.style.display = "flex";
    input?.setAttribute("aria-expanded", "true");
    panel.innerHTML = filteredSuggestions.map((item, idx) => `
            <div class="p-inputtags-item ${idx === activeSuggestionIndex ? "is-highlighted" : ""}" data-index="${idx}">
                <span>${escapeHtml(item)}</span>
            </div>
        `).join("");
    panel.querySelectorAll(".p-inputtags-item").forEach((itemEl) => {
      itemEl.addEventListener("click", (e) => {
        e.stopPropagation();
        const idx = Number(itemEl.getAttribute("data-index"));
        if (filteredSuggestions[idx]) {
          addTag(filteredSuggestions[idx]);
          closeTypeahead();
        }
      });
    });
  }
  function updateSuggestionHighlight() {
    const panel = container.querySelector(".p-inputtags-panel");
    if (!panel) return;
    panel.querySelectorAll(".p-inputtags-item").forEach((el, idx) => {
      el.classList.toggle("is-highlighted", idx === activeSuggestionIndex);
      if (idx === activeSuggestionIndex) {
        el.scrollIntoView({ block: "nearest" });
      }
    });
  }
  function closeTypeahead() {
    const panel = container.querySelector(".p-inputtags-panel");
    const input = container.querySelector(".p-inputtags-input");
    if (panel) panel.style.display = "none";
    input?.setAttribute("aria-expanded", "false");
    activeSuggestionIndex = -1;
    filteredSuggestions = [];
  }
  function syncTargetInput(tags) {
    if (props.targetInputName) {
      let hidden = container.querySelector(`input[name="${props.targetInputName}"]`);
      if (!hidden) {
        hidden = document.createElement("input");
        hidden.type = "hidden";
        hidden.name = props.targetInputName;
        container.appendChild(hidden);
      }
      hidden.value = JSON.stringify(tags);
    }
    container.dispatchEvent(new CustomEvent("inputtags:change", {
      bubbles: true,
      detail: { values: tags }
    }));
    container.dispatchEvent(new CustomEvent("chips:change", {
      bubbles: true,
      detail: { values: tags }
    }));
  }
  init();
}
var CSS15, xCircleIcon;
var init_input_tags = __esm({
  "src/components/input-tags.ts"() {
    "use strict";
    init_styles();
    init_useControllableState();
    CSS15 = `
.laughtale-inputtags,
.p-inputtags {
    display: inline-flex;
    flex-wrap: wrap;
    align-items: center;
    position: relative;
    font-family: var(--p-font-family, inherit);
    box-sizing: border-box;
    width: auto;
    min-height: 2.5rem;
    padding: 0.25rem 0.5rem;
    gap: 0.375rem;
    background: var(--p-surface-0);
    border: 1px solid var(--p-border-color);
    border-radius: var(--p-border-radius);
    transition: border-color 150ms ease, box-shadow 150ms ease, background 150ms ease;
    cursor: text;
}

.p-inputtags.p-inputtags-fluid {
    display: flex;
    width: 100%;
}

.p-inputtags:hover:not(.is-disabled) {
    border-color: var(--p-surface-400);
}

.p-inputtags:focus-within:not(.is-disabled) {
    border-color: var(--p-primary-500) !important;
    box-shadow: 0 0 0 1px var(--p-primary-500) !important;
}

/* Variant: Filled */
.p-inputtags.variant-filled {
    background: var(--p-surface-100);
    border-color: transparent;
}
.p-inputtags.variant-filled:focus-within {
    background: var(--p-surface-0);
    border-color: var(--p-primary-500) !important;
}

/* Invalid State */
.p-inputtags.is-invalid {
    border-color: var(--p-red-500, #ef4444) !important;
}
.p-inputtags.is-invalid:focus-within {
    box-shadow: 0 0 0 1px var(--p-red-500, #ef4444) !important;
}

/* Disabled State */
.p-inputtags.is-disabled {
    background: var(--p-surface-100);
    opacity: 0.75;
    cursor: not-allowed;
}

/* Sizes */
.p-inputtags.size-small {
    min-height: 2rem;
    padding: 0.125rem 0.375rem;
    gap: 0.25rem;
}
.p-inputtags.size-small .p-inputtags-tag {
    font-size: 0.75rem;
    padding: 0.125rem 0.375rem;
}
.p-inputtags.size-small .p-inputtags-input {
    font-size: 0.75rem;
}

.p-inputtags.size-large {
    min-height: 3rem;
    padding: 0.375rem 0.75rem;
    gap: 0.5rem;
}
.p-inputtags.size-large .p-inputtags-tag {
    font-size: 0.9375rem;
    padding: 0.25rem 0.625rem;
}
.p-inputtags.size-large .p-inputtags-input {
    font-size: 1rem;
}

/* Tags / Chips */
.p-inputtags-tag {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    background: var(--p-surface-100);
    color: var(--p-surface-800);
    border: 1px solid var(--p-surface-200);
    border-radius: var(--p-border-radius);
    padding: 0.1875rem 0.5rem;
    font-size: 0.8125rem;
    font-weight: 500;
    line-height: 1.2;
    transition: background 150ms ease, border-color 150ms ease, color 150ms ease;
    user-select: none;
}

.p-inputtags-tag:focus,
.p-inputtags-tag.is-focused {
    outline: none;
    border-color: var(--p-primary-500);
    background: var(--p-primary-50);
    color: var(--p-primary-700);
}

.p-inputtags-tag-remove {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: none;
    background: transparent;
    color: var(--p-surface-400);
    cursor: pointer;
    padding: 0;
    margin: 0;
    border-radius: 9999px;
    transition: color 150ms ease, background 150ms ease;
}
.p-inputtags-tag-remove:hover {
    color: var(--p-surface-700);
}
.p-inputtags-tag-remove svg {
    width: 14px;
    height: 14px;
}

/* Native Input Field */
.p-inputtags-input {
    flex: 1 1 60px;
    min-width: 60px;
    border: none !important;
    outline: none !important;
    background: transparent !important;
    font-family: inherit;
    font-size: 0.875rem;
    color: var(--p-text-color);
    padding: 0.1875rem 0.25rem !important;
    margin: 0 !important;
    box-sizing: border-box;
    line-height: 1.2;
    box-shadow: none !important;
}
.p-inputtags-input:disabled {
    cursor: not-allowed;
    color: var(--p-text-muted);
}

/* ==================== TYPEAHEAD SUGGESTIONS DROPDOWN ==================== */
.p-inputtags-panel {
    position: absolute;
    top: calc(100% + 4px);
    left: 0;
    width: 100%;
    min-width: 180px;
    background: var(--p-surface-0);
    border: 1px solid var(--p-border-color);
    border-radius: var(--p-border-radius);
    box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1);
    z-index: 1000;
    max-height: 220px;
    overflow-y: auto;
    padding: 0.25rem;
    display: flex;
    flex-direction: column;
    gap: 0.125rem;
    animation: pInputTagsFadeIn 150ms ease;
}
@keyframes pInputTagsFadeIn {
    from { opacity: 0; transform: translateY(-4px); }
    to { opacity: 1; transform: translateY(0); }
}

.p-inputtags-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 0.75rem;
    border-radius: calc(var(--p-border-radius) - 2px);
    font-size: 0.875rem;
    color: var(--p-text-color);
    cursor: pointer;
    transition: background 120ms ease;
    user-select: none;
}
.p-inputtags-item:hover,
.p-inputtags-item.is-highlighted {
    background: var(--p-surface-100);
    color: var(--p-surface-900);
}

/* ==================== DARK MODE ==================== */
.dark .p-inputtags {
    background: var(--p-surface-900);
    border-color: var(--p-surface-700);
}
.dark .p-inputtags:hover:not(.is-disabled) {
    border-color: var(--p-surface-600);
}
.dark .p-inputtags.variant-filled {
    background: var(--p-surface-800);
}
.dark .p-inputtags.variant-filled:focus-within {
    background: var(--p-surface-900);
}
.dark .p-inputtags-tag {
    background: var(--p-surface-800);
    color: var(--p-surface-100);
    border-color: var(--p-surface-700);
}
.dark .p-inputtags-tag:focus,
.dark .p-inputtags-tag.is-focused {
    background: var(--p-surface-700);
    border-color: var(--p-primary-500);
    color: var(--p-primary-300);
}
.dark .p-inputtags-tag-remove {
    color: var(--p-surface-400);
}
.dark .p-inputtags-tag-remove:hover {
    color: var(--p-surface-100);
}
.dark .p-inputtags-input {
    color: var(--p-surface-0);
}
.dark .p-inputtags-panel {
    background: var(--p-surface-900);
    border-color: var(--p-surface-700);
    box-shadow: 0 10px 25px -5px rgba(0,0,0,0.5);
}
.dark .p-inputtags-item:hover,
.dark .p-inputtags-item.is-highlighted {
    background: var(--p-surface-800);
    color: var(--p-surface-0);
}
`;
    xCircleIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>`;
  }
});

// src/components/datepicker.ts
var datepicker_exports = {};
__export(datepicker_exports, {
  default: () => DatePickerIsland
});
function DatePickerIsland(container, props) {
  injectIslandStyle("datepicker", CSS16);
  const selectionMode = props.selectionMode || "single";
  let currentView = props.view || "date";
  const isInline = props.inline === true;
  const isTimeOnly = props.timeOnly === true;
  const showTime = props.showTime === true || isTimeOnly;
  const hour12 = props.hourFormat === "12";
  let selectedDates = parseInitialValue(props.value);
  let viewDate = selectedDates.length > 0 ? new Date(selectedDates[0]) : /* @__PURE__ */ new Date();
  let selectedHour = selectedDates.length > 0 ? selectedDates[0].getHours() : (/* @__PURE__ */ new Date()).getHours();
  let selectedMinute = selectedDates.length > 0 ? selectedDates[0].getMinutes() : (/* @__PURE__ */ new Date()).getMinutes();
  let isPM = selectedHour >= 12;
  const minD = props.minDate ? new Date(props.minDate) : null;
  const maxD = props.maxDate ? new Date(props.maxDate) : null;
  function parseInitialValue(val) {
    if (!val) return [];
    if (Array.isArray(val)) {
      return val.map((v) => new Date(v)).filter((d2) => !isNaN(d2.getTime()));
    }
    const d = new Date(val);
    return isNaN(d.getTime()) ? [] : [d];
  }
  function formatDate(d) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    let res = `${y}-${m}-${day}`;
    if (showTime) {
      const h = hour12 ? d.getHours() % 12 || 12 : d.getHours();
      const min = String(d.getMinutes()).padStart(2, "0");
      const ampm = d.getHours() >= 12 ? " PM" : " AM";
      res += ` ${String(h).padStart(2, "0")}:${min}${hour12 ? ampm : ""}`;
    }
    return res;
  }
  function getDisplayText() {
    if (selectedDates.length === 0) return "";
    if (selectionMode === "range") {
      if (selectedDates.length === 1) return formatDate(selectedDates[0]) + " - ...";
      return `${formatDate(selectedDates[0])} - ${formatDate(selectedDates[1])}`;
    }
    if (selectionMode === "multiple") {
      return selectedDates.map((d) => formatDate(d)).join(", ");
    }
    return formatDate(selectedDates[0]);
  }
  function isSameDay(d1, d2) {
    return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();
  }
  function isDateDisabled(d) {
    if (minD && d < new Date(minD.getFullYear(), minD.getMonth(), minD.getDate())) return true;
    if (maxD && d > new Date(maxD.getFullYear(), maxD.getMonth(), maxD.getDate(), 23, 59, 59)) return true;
    return false;
  }
  function renderComponent() {
    const displayText = getDisplayText();
    const size = props.size || "normal";
    const variant = props.variant || "outlined";
    if (isInline) {
      container.innerHTML = `
                <div class="laughtale-datepicker inline">
                    <div class="dp-panel">
                        ${renderPanelContent()}
                    </div>
                </div>
            `;
      bindPanelEvents(container.querySelector(".dp-panel"));
      return;
    }
    container.innerHTML = `
            <div class="laughtale-datepicker ${props.fluid ? "fluid" : ""}">
                <div class="dp-trigger size-${size} variant-${variant} ${props.invalid ? "invalid" : ""} ${props.disabled ? "disabled" : ""}" 
                     tabindex="${props.disabled ? -1 : 0}" 
                     role="combobox" 
                     aria-expanded="false">
                    <span class="dp-label ${displayText ? "" : "placeholder"}">
                        ${displayText || props.placeholder || "Select Date..."}
                    </span>
                    ${props.showIcon !== false ? `
                        <span class="dp-icon">
                            ${LucideIcons.calendar}
                        </span>
                    ` : ""}
                </div>

                <div class="dp-overlay">
                    <div class="dp-panel">
                        ${renderPanelContent()}
                    </div>
                </div>
            </div>
        `;
    const trigger = container.querySelector(".dp-trigger");
    const overlay = container.querySelector(".dp-overlay");
    const panel = container.querySelector(".dp-panel");
    const disclosure = useDisclosure({
      defaultIsOpen: false,
      onOpen: () => {
        overlay.style.display = "block";
        trigger.classList.add("focused");
        trigger.setAttribute("aria-expanded", "true");
      },
      onClose: () => {
        overlay.style.display = "none";
        trigger.classList.remove("focused");
        trigger.setAttribute("aria-expanded", "false");
      }
    });
    useClickOutside(container, () => disclosure.close());
    trigger.addEventListener("click", () => {
      if (props.disabled) return;
      disclosure.toggle();
    });
    trigger.addEventListener("keydown", (e) => {
      if (props.disabled) return;
      if (e.key === " " || e.key === "Enter" || e.key === "ArrowDown") {
        e.preventDefault();
        disclosure.open();
      } else if (e.key === "Escape") {
        disclosure.close();
      }
    });
    bindPanelEvents(panel, disclosure);
  }
  function renderPanelContent() {
    if (isTimeOnly) {
      return renderTimePicker();
    }
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    let mainViewHtml = "";
    if (currentView === "date") {
      mainViewHtml = renderDateView(year, month);
    } else if (currentView === "month") {
      mainViewHtml = renderMonthView(year);
    } else {
      mainViewHtml = renderYearView(year);
    }
    return `
            <div class="dp-header">
                <button type="button" class="dp-nav-btn btn-prev" aria-label="Previous">
                    ${LucideIcons.chevronLeft}
                </button>
                <button type="button" class="dp-title-btn btn-title">
                    ${currentView === "date" ? `${MONTH_NAMES[month]} ${year}` : currentView === "month" ? `${year}` : `${Math.floor(year / 10) * 10} - ${Math.floor(year / 10) * 10 + 9}`}
                </button>
                <button type="button" class="dp-nav-btn btn-next" aria-label="Next">
                    ${LucideIcons.chevronRight}
                </button>
            </div>

            ${mainViewHtml}

            ${showTime ? renderTimePicker() : ""}

            ${props.showButtonBar ? `
                <div class="dp-buttonbar">
                    <button type="button" class="dp-bar-btn btn-today">Today</button>
                    <button type="button" class="dp-bar-btn btn-clear">Clear</button>
                </div>
            ` : ""}
        `;
  }
  function renderDateView(year, month) {
    const firstDayIndex = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();
    const today = /* @__PURE__ */ new Date();
    let cellsHtml = "";
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const day = daysInPrevMonth - i;
      const d = new Date(year, month - 1, day);
      cellsHtml += `<button type="button" class="dp-day-cell other-month disabled" disabled>${day}</button>`;
    }
    for (let day = 1; day <= daysInMonth; day++) {
      const d = new Date(year, month, day);
      const isToday = isSameDay(d, today);
      const isDisabled = isDateDisabled(d);
      let isSelected = false;
      let isInRange = false;
      let isRangeStart = false;
      let isRangeEnd = false;
      if (selectionMode === "range" && selectedDates.length > 0) {
        const start = selectedDates[0];
        const end = selectedDates[1];
        if (isSameDay(d, start)) {
          isSelected = true;
          isRangeStart = true;
        } else if (end && isSameDay(d, end)) {
          isSelected = true;
          isRangeEnd = true;
        } else if (end && d > start && d < end) {
          isInRange = true;
        }
      } else {
        isSelected = selectedDates.some((sd) => isSameDay(sd, d));
      }
      const classes = [
        "dp-day-cell",
        isToday ? "today" : "",
        isSelected ? "selected" : "",
        isInRange ? "in-range" : "",
        isRangeStart ? "range-start" : "",
        isRangeEnd ? "range-end" : "",
        isDisabled ? "disabled" : ""
      ].filter(Boolean).join(" ");
      cellsHtml += `<button type="button" class="${classes}" data-day="${day}">${day}</button>`;
    }
    return `
            <div class="dp-weekdays">
                ${WEEKDAYS.map((w) => `<span>${w}</span>`).join("")}
            </div>
            <div class="dp-days-grid">
                ${cellsHtml}
            </div>
        `;
  }
  function renderMonthView(year) {
    return `
            <div class="dp-month-grid">
                ${SHORT_MONTHS.map((m, idx) => {
      const isSelected = selectedDates.some((d) => d.getFullYear() === year && d.getMonth() === idx);
      return `<button type="button" class="dp-view-btn ${isSelected ? "selected" : ""}" data-month="${idx}">${m}</button>`;
    }).join("")}
            </div>
        `;
  }
  function renderYearView(year) {
    const startYear = Math.floor(year / 10) * 10;
    const years = [];
    for (let y = startYear - 1; y <= startYear + 10; y++) {
      years.push(y);
    }
    return `
            <div class="dp-year-grid">
                ${years.map((y) => {
      const isSelected = selectedDates.some((d) => d.getFullYear() === y);
      return `<button type="button" class="dp-view-btn ${isSelected ? "selected" : ""}" data-year="${y}">${y}</button>`;
    }).join("")}
            </div>
        `;
  }
  function renderTimePicker() {
    const displayH = hour12 ? selectedHour % 12 || 12 : selectedHour;
    return `
            <div class="dp-timepicker">
                <div class="dp-time-col">
                    <button type="button" class="dp-time-btn btn-hour-up">${LucideIcons.chevronUp}</button>
                    <span class="dp-time-val">${String(displayH).padStart(2, "0")}</span>
                    <button type="button" class="dp-time-btn btn-hour-down">${LucideIcons.chevronDown}</button>
                </div>
                <span style="font-weight: 700; color: var(--p-text-muted);">:</span>
                <div class="dp-time-col">
                    <button type="button" class="dp-time-btn btn-min-up">${LucideIcons.chevronUp}</button>
                    <span class="dp-time-val">${String(selectedMinute).padStart(2, "0")}</span>
                    <button type="button" class="dp-time-btn btn-min-down">${LucideIcons.chevronDown}</button>
                </div>
                ${hour12 ? `
                    <button type="button" class="dp-ampm-btn btn-ampm">${isPM ? "PM" : "AM"}</button>
                ` : ""}
            </div>
        `;
  }
  function bindPanelEvents(panel, disclosure) {
    panel.querySelector(".btn-prev")?.addEventListener("click", (e) => {
      e.stopPropagation();
      if (currentView === "date") {
        viewDate.setMonth(viewDate.getMonth() - 1);
      } else if (currentView === "month") {
        viewDate.setFullYear(viewDate.getFullYear() - 1);
      } else {
        viewDate.setFullYear(viewDate.getFullYear() - 10);
      }
      renderComponent();
    });
    panel.querySelector(".btn-next")?.addEventListener("click", (e) => {
      e.stopPropagation();
      if (currentView === "date") {
        viewDate.setMonth(viewDate.getMonth() + 1);
      } else if (currentView === "month") {
        viewDate.setFullYear(viewDate.getFullYear() + 1);
      } else {
        viewDate.setFullYear(viewDate.getFullYear() + 10);
      }
      renderComponent();
    });
    panel.querySelector(".btn-title")?.addEventListener("click", (e) => {
      e.stopPropagation();
      if (currentView === "date") currentView = "month";
      else if (currentView === "month") currentView = "year";
      else currentView = "date";
      renderComponent();
    });
    panel.querySelectorAll(".dp-day-cell:not(.disabled):not(.other-month)").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const day = parseInt(btn.dataset.day || "1", 10);
        const target = new Date(viewDate.getFullYear(), viewDate.getMonth(), day, selectedHour, selectedMinute);
        if (selectionMode === "range") {
          if (selectedDates.length === 0 || selectedDates.length === 2) {
            selectedDates = [target];
          } else {
            if (target < selectedDates[0]) {
              selectedDates = [target, selectedDates[0]];
            } else {
              selectedDates.push(target);
            }
            if (!isInline && !showTime && disclosure) disclosure.close();
          }
        } else if (selectionMode === "multiple") {
          const existingIdx = selectedDates.findIndex((d) => isSameDay(d, target));
          if (existingIdx >= 0) selectedDates.splice(existingIdx, 1);
          else selectedDates.push(target);
        } else {
          selectedDates = [target];
          if (!isInline && !showTime && disclosure) disclosure.close();
        }
        syncAndDispatch();
        renderComponent();
      });
    });
    panel.querySelectorAll(".dp-month-grid .dp-view-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const m = parseInt(btn.dataset.month || "0", 10);
        viewDate.setMonth(m);
        currentView = "date";
        renderComponent();
      });
    });
    panel.querySelectorAll(".dp-year-grid .dp-view-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const y = parseInt(btn.dataset.year || "2026", 10);
        viewDate.setFullYear(y);
        currentView = "month";
        renderComponent();
      });
    });
    panel.querySelector(".btn-hour-up")?.addEventListener("click", (e) => {
      e.stopPropagation();
      selectedHour = (selectedHour + 1) % 24;
      updateSelectedTime();
    });
    panel.querySelector(".btn-hour-down")?.addEventListener("click", (e) => {
      e.stopPropagation();
      selectedHour = (selectedHour - 1 + 24) % 24;
      updateSelectedTime();
    });
    panel.querySelector(".btn-min-up")?.addEventListener("click", (e) => {
      e.stopPropagation();
      selectedMinute = (selectedMinute + 1) % 60;
      updateSelectedTime();
    });
    panel.querySelector(".btn-min-down")?.addEventListener("click", (e) => {
      e.stopPropagation();
      selectedMinute = (selectedMinute - 1 + 60) % 60;
      updateSelectedTime();
    });
    panel.querySelector(".btn-ampm")?.addEventListener("click", (e) => {
      e.stopPropagation();
      isPM = !isPM;
      selectedHour = isPM ? selectedHour % 12 + 12 : selectedHour % 12;
      updateSelectedTime();
    });
    panel.querySelector(".btn-today")?.addEventListener("click", (e) => {
      e.stopPropagation();
      const now = /* @__PURE__ */ new Date();
      selectedDates = [now];
      viewDate = new Date(now);
      syncAndDispatch();
      if (!isInline && !showTime && disclosure) disclosure.close();
      renderComponent();
    });
    panel.querySelector(".btn-clear")?.addEventListener("click", (e) => {
      e.stopPropagation();
      selectedDates = [];
      syncAndDispatch();
      renderComponent();
    });
  }
  function updateSelectedTime() {
    if (selectedDates.length > 0) {
      selectedDates.forEach((d) => {
        d.setHours(selectedHour);
        d.setMinutes(selectedMinute);
      });
    }
    syncAndDispatch();
    renderComponent();
  }
  function syncAndDispatch() {
    if (props.targetInputName) {
      let hidden = container.querySelector(`input[name="${props.targetInputName}"]`);
      if (!hidden) {
        hidden = document.createElement("input");
        hidden.type = "hidden";
        hidden.name = props.targetInputName;
        container.appendChild(hidden);
      }
      hidden.value = selectedDates.map((d) => formatDate(d)).join(",");
    }
    container.dispatchEvent(new CustomEvent("datepicker:change", {
      bubbles: true,
      detail: {
        dates: selectedDates,
        value: selectedDates.map((d) => formatDate(d)),
        formatted: getDisplayText()
      }
    }));
  }
  renderComponent();
}
var CSS16, MONTH_NAMES, SHORT_MONTHS, WEEKDAYS;
var init_datepicker = __esm({
  "src/components/datepicker.ts"() {
    "use strict";
    init_lucide();
    init_styles();
    init_useDisclosure();
    init_useClickOutside();
    CSS16 = `
.laughtale-datepicker {
    position: relative;
    display: inline-flex;
    font-family: var(--p-font-family, inherit);
    box-sizing: border-box;
}
.laughtale-datepicker.fluid {
    width: 100%;
}
.laughtale-datepicker:not(.fluid) {
    width: 100%;
    max-width: 280px;
}
.laughtale-datepicker.inline {
    display: inline-block;
    width: auto;
    max-width: none;
}

.dp-trigger {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    background: var(--p-surface-0);
    border: 1px solid var(--p-border-color);
    border-radius: var(--p-border-radius);
    color: var(--p-text-color);
    cursor: pointer;
    user-select: none;
    transition: border-color 0.15s ease, box-shadow 0.15s ease, background 0.15s ease;
    box-sizing: border-box;
    gap: 0.5rem;
}
.dp-trigger.variant-filled {
    background: var(--p-surface-50);
}
.dp-trigger.focused {
    border-color: var(--p-primary-500);
    box-shadow: 0 0 0 1px var(--p-primary-500);
}
.dp-trigger.invalid {
    border-color: #ef4444 !important;
    box-shadow: 0 0 0 1px #ef4444 !important;
}
.dp-trigger.disabled {
    background: var(--p-surface-100);
    opacity: 0.65;
    cursor: not-allowed;
}

/* Sizes */
.dp-trigger.size-small {
    min-height: 2rem;
    padding: 0 0.5rem;
    font-size: 0.75rem;
}
.dp-trigger.size-normal {
    min-height: 2.5rem;
    padding: 0 0.75rem;
    font-size: 0.875rem;
}
.dp-trigger.size-large {
    min-height: 3rem;
    padding: 0 1rem;
    font-size: 1rem;
}

.dp-label {
    flex: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: var(--p-text-color);
}
.dp-label.placeholder {
    color: var(--p-text-muted);
}
.dp-icon {
    display: flex;
    align-items: center;
    color: var(--p-text-muted);
}

/* Overlay & Panel */
.dp-overlay {
    position: absolute;
    top: calc(100% + 4px);
    left: 0;
    z-index: 1000;
    display: none;
}
.dp-panel {
    background: var(--p-surface-0);
    border: 1px solid var(--p-border-color);
    border-radius: var(--p-border-radius);
    box-shadow: var(--p-shadow-lg);
    padding: 0.875rem;
    width: 19rem;
    box-sizing: border-box;
}
.laughtale-datepicker.inline .dp-panel {
    box-shadow: var(--p-shadow-sm);
    display: block !important;
}

/* Header */
.dp-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0.75rem;
}
.dp-nav-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    border: none;
    background: transparent;
    color: var(--p-text-color);
    cursor: pointer;
    transition: background 150ms ease;
}
.dp-nav-btn:hover {
    background: var(--p-surface-100);
}
.dp-title-btn {
    border: none;
    background: transparent;
    font-weight: 600;
    font-size: 0.9375rem;
    color: var(--p-text-color);
    cursor: pointer;
    padding: 0.25rem 0.5rem;
    border-radius: calc(var(--p-border-radius) - 2px);
    transition: background 150ms ease;
}
.dp-title-btn:hover {
    background: var(--p-surface-100);
}

/* Calendar Grid */
.dp-weekdays {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    text-align: center;
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--p-text-muted);
    margin-bottom: 0.5rem;
}
.dp-days-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 2px;
}
.dp-day-cell {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 2.25rem;
    width: 100%;
    border-radius: 50%;
    border: none;
    background: transparent;
    color: var(--p-text-color);
    font-size: 0.8125rem;
    cursor: pointer;
    transition: background 120ms ease, color 120ms ease;
    box-sizing: border-box;
    user-select: none;
}
.dp-day-cell:hover:not(.disabled):not(.selected) {
    background: var(--p-surface-100);
}
.dp-day-cell.other-month {
    color: var(--p-text-muted);
    opacity: 0.4;
}
.dp-day-cell.today:not(.selected) {
    border: 1px solid var(--p-primary-500);
    font-weight: 700;
}
.dp-day-cell.selected {
    background: var(--p-primary-500) !important;
    color: #ffffff !important;
    font-weight: 700;
}
.dp-day-cell.in-range {
    background: var(--p-primary-50);
    color: var(--p-primary-700);
    border-radius: 0;
}
.dp-day-cell.range-start {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
}
.dp-day-cell.range-end {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
}
.dp-day-cell.disabled {
    opacity: 0.3;
    cursor: not-allowed;
    pointer-events: none;
}

/* Month / Year Grid */
.dp-month-grid, .dp-year-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.5rem;
    padding: 0.5rem 0;
}
.dp-view-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.75rem 0.5rem;
    border-radius: calc(var(--p-border-radius) - 2px);
    border: none;
    background: transparent;
    color: var(--p-text-color);
    font-size: 0.875rem;
    cursor: pointer;
    transition: background 150ms ease;
}
.dp-view-btn:hover {
    background: var(--p-surface-100);
}
.dp-view-btn.selected {
    background: var(--p-primary-500);
    color: #ffffff;
    font-weight: 700;
}

/* Time Picker Section */
.dp-timepicker {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    border-top: 1px solid var(--p-border-color);
    padding-top: 0.75rem;
    margin-top: 0.75rem;
}
.dp-time-col {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.25rem;
}
.dp-time-val {
    font-size: 1rem;
    font-weight: 600;
    color: var(--p-text-color);
    min-width: 2rem;
    text-align: center;
}
.dp-time-btn {
    border: none;
    background: transparent;
    color: var(--p-text-muted);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.15rem;
    border-radius: 4px;
}
.dp-time-btn:hover {
    background: var(--p-surface-100);
    color: var(--p-text-color);
}
.dp-ampm-btn {
    border: 1px solid var(--p-border-color);
    background: var(--p-surface-50);
    color: var(--p-text-color);
    border-radius: 4px;
    padding: 0.25rem 0.5rem;
    font-size: 0.75rem;
    font-weight: 700;
    cursor: pointer;
}

/* Button Bar */
.dp-buttonbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-top: 1px solid var(--p-border-color);
    padding-top: 0.65rem;
    margin-top: 0.75rem;
}
.dp-bar-btn {
    border: none;
    background: transparent;
    color: var(--p-primary-600);
    font-weight: 600;
    font-size: 0.8125rem;
    cursor: pointer;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    transition: background 150ms ease;
}
.dp-bar-btn:hover {
    background: var(--p-primary-50);
}

/* Dark Mode Tokens */
.dark .dp-trigger {
    background: var(--p-surface-900);
    border-color: var(--p-surface-700);
    color: var(--p-surface-0);
}
.dark .dp-trigger.variant-filled {
    background: var(--p-surface-800);
}
.dark .dp-panel {
    background: var(--p-surface-900);
    border-color: var(--p-surface-700);
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5);
}
.dark .dp-nav-btn:hover, .dark .dp-title-btn:hover, .dark .dp-day-cell:hover:not(.disabled):not(.selected), .dark .dp-view-btn:hover {
    background: var(--p-surface-800);
    color: var(--p-surface-0);
}
.dark .dp-day-cell.in-range {
    background: rgba(16, 185, 129, 0.15);
    color: #6ee7b7;
}
.dark .dp-day-cell.selected, .dark .dp-view-btn.selected {
    background: var(--p-primary-500) !important;
    color: var(--p-surface-950) !important;
}
.dark .dp-timepicker, .dark .dp-buttonbar {
    border-color: var(--p-surface-700);
}
.dark .dp-ampm-btn {
    background: var(--p-surface-800);
    border-color: var(--p-surface-700);
}
.dark .dp-bar-btn {
    color: #6ee7b7;
}
.dark .dp-bar-btn:hover {
    background: rgba(16, 185, 129, 0.15);
}
`;
    MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    SHORT_MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
  }
});

// src/components/meter-group.ts
var meter_group_exports = {};
__export(meter_group_exports, {
  default: () => MeterGroupIsland
});
function MeterGroupIsland(container, props) {
  injectIslandStyle("meter-group", CSS17);
  const total = props.values.reduce((acc, curr) => acc + curr.value, 0);
  const barSegments = props.values.map((v) => {
    const pct = total > 0 ? v.value / total * 100 : 0;
    return `
            <div style="height: 100%; width: ${pct}%; background: ${v.color}; transition: width 0.4s ease;" title="${v.label}: ${v.value}%"></div>
        `;
  }).join("");
  const legendItems = props.values.map((v) => `
        <div style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.75rem;">
            <div style="width: 0.625rem; height: 0.625rem; border-radius: 50%; background: ${v.color}; flex-shrink: 0;"></div>
            <span style="color: var(--p-surface-600);">${v.label}</span>
            <span style="font-weight: 700; color: var(--p-surface-900); font-family: var(--p-font-mono);">${v.value}%</span>
        </div>
    `).join("");
  container.innerHTML = `
        <div class="laughtale-metergroup" style="display: flex; flex-direction: column; gap: 0.75rem; width: 100%;">
            ${props.title ? `<div style="font-size: 0.875rem; font-weight: 700; color: var(--p-surface-900);">${props.title}</div>` : ""}
            
            <!-- Meter Track -->
            <div style="display: flex; height: 0.75rem; border-radius: 9999px; overflow: hidden; background: var(--p-surface-100); border: 1px solid var(--p-border-color); gap: 2px;">
                ${barSegments}
            </div>

            <!-- Legend List -->
            ${props.showLabels !== false ? `
                <div style="display: flex; flex-wrap: wrap; gap: 1.25rem; margin-top: 0.25rem;">
                    ${legendItems}
                </div>
            ` : ""}
        </div>
    `;
}
var CSS17;
var init_meter_group = __esm({
  "src/components/meter-group.ts"() {
    "use strict";
    init_styles();
    CSS17 = `
[data-theme="dark"] .laughtale-meter-group {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
`;
  }
});

// src/components/avatar-group.ts
var avatar_group_exports = {};
__export(avatar_group_exports, {
  default: () => AvatarGroupIsland
});
function AvatarGroupIsland(container, props) {
  injectIslandStyle("avatar-group", CSS18);
  const max = props.max || 4;
  const visible = props.avatars.slice(0, max);
  const overflowCount = props.avatars.length - max;
  const sizePx = props.size === "sm" ? "1.75rem" : props.size === "lg" ? "2.75rem" : "2.25rem";
  const fontSize = props.size === "sm" ? "0.6875rem" : props.size === "lg" ? "0.9375rem" : "0.75rem";
  const avatarElements = visible.map((av) => {
    const bg = av.bg || "var(--p-surface-800)";
    return `
            <div class="avatar-circle" title="${av.name || av.label || ""}" style="width: ${sizePx}; height: ${sizePx}; border-radius: 50%; border: 2px solid #ffffff; background: ${bg}; color: #ffffff; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: ${fontSize}; margin-left: -0.5rem; overflow: hidden; box-shadow: 0 1px 2px rgba(0,0,0,0.1); flex-shrink: 0;">
                ${av.image ? `<img src="${av.image}" alt="${av.name || ""}" style="width: 100%; height: 100%; object-fit: cover;" />` : av.label || "U"}
            </div>
        `;
  }).join("");
  container.innerHTML = `
        <div class="laughtale-avatar-group" style="display: inline-flex; align-items: center; padding-left: 0.5rem;">
            ${avatarElements}
            ${overflowCount > 0 ? `
                <div class="avatar-overflow" style="width: ${sizePx}; height: ${sizePx}; border-radius: 50%; border: 2px solid #ffffff; background: var(--p-surface-200); color: var(--p-surface-700); display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: ${fontSize}; margin-left: -0.5rem; box-shadow: 0 1px 2px rgba(0,0,0,0.1); flex-shrink: 0;">
                    +${overflowCount}
                </div>
            ` : ""}
        </div>
    `;
}
var CSS18;
var init_avatar_group = __esm({
  "src/components/avatar-group.ts"() {
    "use strict";
    init_styles();
    CSS18 = `
[data-theme="dark"] .laughtale-avatar-group {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
`;
  }
});

// src/components/progress-bar.ts
var progress_bar_exports = {};
__export(progress_bar_exports, {
  default: () => ProgressBarIsland
});
function ProgressBarIsland(container, props) {
  injectIslandStyle("progress-bar", CSS19);
  const isIndeterminate = props.mode === "indeterminate" || props.value === void 0;
  const value = Math.max(0, Math.min(100, props.value || 0));
  const height = props.height || "0.75rem";
  const color = props.color || "var(--p-primary-600)";
  if (isIndeterminate) {
    container.innerHTML = `
            <div class="laughtale-progress-bar" style="position: relative; height: ${height}; width: 100%; border-radius: 9999px; overflow: hidden; background: var(--p-surface-100);">
                <div style="position: absolute; height: 100%; width: 40%; background: ${color}; border-radius: 9999px; animation: indeterminateProgress 1.5s infinite linear;"></div>
            </div>
            <style>
                @@keyframes indeterminateProgress {
                    0% { left: -40%; width: 40%; }
                    50% { left: 40%; width: 60%; }
                    100% { left: 100%; width: 40%; }
                }
            </style>
        `;
  } else {
    container.innerHTML = `
            <div class="laughtale-progress-bar" style="position: relative; height: ${height}; width: 100%; border-radius: 9999px; overflow: hidden; background: var(--p-surface-100); display: flex; align-items: center;">
                <div style="height: 100%; width: ${value}%; background: ${color}; border-radius: 9999px; transition: width 0.4s cubic-bezier(0.16, 1, 0.3, 1);"></div>
                ${props.showValue !== false && height >= "1rem" ? `
                    <span style="position: absolute; width: 100%; text-align: center; font-size: 0.6875rem; font-weight: 700; color: #ffffff; text-shadow: 0 1px 2px rgba(0,0,0,0.5); font-family: var(--p-font-mono);">
                        ${value}%
                    </span>
                ` : ""}
            </div>
        `;
  }
}
var CSS19;
var init_progress_bar = __esm({
  "src/components/progress-bar.ts"() {
    "use strict";
    init_styles();
    CSS19 = `
[data-theme="dark"] .laughtale-progress-bar {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
`;
  }
});

// src/components/skeleton.ts
var skeleton_exports = {};
__export(skeleton_exports, {
  default: () => SkeletonIsland
});
function SkeletonIsland(container, props) {
  injectIslandStyle("skeleton", CSS20);
  const shape = props.shape || "rectangle";
  const width = props.width || "100%";
  const height = props.height || "1.25rem";
  const radius = props.borderRadius || (shape === "circle" ? "50%" : "var(--p-border-radius)");
  container.innerHTML = `
        <div class="laughtale-skeleton" style="width: ${width}; height: ${height}; border-radius: ${radius}; background: linear-gradient(90deg, var(--p-surface-100) 25%, var(--p-surface-200) 50%, var(--p-surface-100) 75%); background-size: 200% 100%; animation: skeletonShimmer 1.5s infinite ease-in-out;"></div>
        <style>
            @@keyframes skeletonShimmer {
                0% { background-position: 200% 0; }
                100% { background-position: -200% 0; }
            }
        </style>
    `;
}
var CSS20;
var init_skeleton = __esm({
  "src/components/skeleton.ts"() {
    "use strict";
    init_styles();
    CSS20 = `
[data-theme="dark"] .laughtale-skeleton {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
`;
  }
});

// src/components/drawer.ts
var drawer_exports = {};
__export(drawer_exports, {
  default: () => DrawerIsland
});
function DrawerIsland(container, props) {
  injectIslandStyle("drawer", CSS21);
  const position = props.position || "right";
  const width = props.width || "380px";
  function render() {
    container.innerHTML = `
            <div class="laughtale-drawer-wrapper">
                ${props.triggerText ? `
                    <button type="button" class="p-button p-button-secondary drawer-open-btn">
                        ${props.triggerText}
                    </button>
                ` : ""}

                <!-- Backdrop -->
                <div class="drawer-backdrop" style="display: none; position: fixed; inset: 0; background: rgba(0, 0, 0, 0.45); backdrop-filter: blur(4px); z-index: 1000; opacity: 0; transition: opacity 0.25s cubic-bezier(0.16, 1, 0.3, 1);"></div>

                <!-- Drawer Panel -->
                <div class="drawer-panel" style="display: flex; flex-direction: column; position: fixed; ${position}: 0; top: 0; bottom: 0; width: ${width}; max-width: 90vw; background: var(--p-surface-0); border-${position === "right" ? "left" : "right"}: 1px solid var(--p-border-color); box-shadow: var(--p-shadow-lg); z-index: 1001; transform: translateX(${position === "right" ? "100%" : "-100%"}); transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1); pointer-events: none;">
                    
                    <!-- Header -->
                    <div style="display: flex; align-items: center; justify-content: space-between; padding: 1.25rem; border-bottom: 1px solid var(--p-border-color);">
                        <div style="font-size: 1.125rem; font-weight: 700; color: var(--p-surface-900);">
                            ${props.title || "Panel"}
                        </div>
                        <button type="button" class="drawer-close-btn" style="border: none; background: transparent; color: var(--p-surface-400); cursor: pointer; display: flex; align-items: center; padding: 0.25rem;">
                            ${LucideIcons.x}
                        </button>
                    </div>

                    <!-- Projected Body Slot -->
                    <div class="drawer-body" style="flex: 1; overflow-y: auto; padding: 1.25rem;">
                        <div class="drawer-slot-container"></div>
                    </div>
                </div>
            </div>
        `;
    const backdrop = container.querySelector(".drawer-backdrop");
    const panel = container.querySelector(".drawer-panel");
    const openBtn = container.querySelector(".drawer-open-btn");
    const closeBtn = container.querySelector(".drawer-close-btn");
    const focusTrap = useFocusTrap(panel);
    const disclosure = useDisclosure({
      defaultIsOpen: false,
      onOpen: () => {
        backdrop.style.display = "block";
        setTimeout(() => {
          backdrop.style.opacity = "1";
          panel.style.transform = "translateX(0)";
          panel.style.pointerEvents = "auto";
        }, 10);
        focusTrap.activate();
      },
      onClose: () => {
        backdrop.style.opacity = "0";
        panel.style.transform = `translateX(${position === "right" ? "100%" : "-100%"})`;
        panel.style.pointerEvents = "none";
        setTimeout(() => {
          backdrop.style.display = "none";
        }, 300);
        focusTrap.deactivate();
      }
    });
    openBtn?.addEventListener("click", () => disclosure.open());
    closeBtn?.addEventListener("click", () => disclosure.close());
    backdrop?.addEventListener("click", () => disclosure.close());
  }
  render();
}
var CSS21;
var init_drawer = __esm({
  "src/components/drawer.ts"() {
    "use strict";
    init_lucide();
    init_styles();
    init_useDisclosure();
    init_useFocusTrap();
    CSS21 = `
[data-theme="dark"] .laughtale-drawer-wrapper {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
[data-theme="dark"] .drawer-open-btn {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
[data-theme="dark"] .drawer-backdrop {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
[data-theme="dark"] .drawer-panel {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
[data-theme="dark"] .drawer-close-btn {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
[data-theme="dark"] .drawer-body {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
[data-theme="dark"] .drawer-slot-container {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
`;
  }
});

// src/components/speed-dial.ts
var speed_dial_exports = {};
__export(speed_dial_exports, {
  default: () => SpeedDialIsland
});
function SpeedDialIsland(container, props) {
  injectIslandStyle("speed-dial", CSS22);
  let isOpen = false;
  function render() {
    const actionItems = props.actions.map((act) => `
            <button type="button" 
                    class="speed-dial-action-btn" 
                    title="${act.label}" 
                    data-action="${act.action || ""}" 
                    style="width: 2.5rem; height: 2.5rem; border-radius: 50%; border: 1px solid var(--p-border-color); background: var(--p-surface-0); color: var(--p-surface-800); box-shadow: var(--p-shadow-md); cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);">
                ${act.icon || LucideIcons.zap}
            </button>
        `).join("");
    container.innerHTML = `
            <div class="laughtale-speed-dial" style="position: fixed; bottom: 2rem; right: 2rem; z-index: 50; display: flex; flex-direction: column-reverse; align-items: center; gap: 0.75rem;">
                <!-- Main FAB Button -->
                <button type="button" class="speed-dial-main-btn" style="width: 3.25rem; height: 3.25rem; border-radius: 50%; border: none; background: var(--p-primary-600); color: #ffffff; box-shadow: var(--p-shadow-lg); cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 1.25rem; transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1); transform: rotate(${isOpen ? "45deg" : "0deg"});">
                    ${LucideIcons.plus}
                </button>

                <!-- Action Items -->
                <div class="speed-dial-list" style="display: ${isOpen ? "flex" : "none"}; flex-direction: column-reverse; gap: 0.5rem;">
                    ${actionItems}
                </div>
            </div>
        `;
    if (isOpen) {
      const actionBtns = Array.from(container.querySelectorAll(".speed-dial-action-btn"));
      useStagger(actionBtns, { staggerMs: 40, initialDelay: 10 });
    }
    container.querySelector(".speed-dial-main-btn")?.addEventListener("click", () => {
      isOpen = !isOpen;
      render();
    });
    container.querySelectorAll(".speed-dial-action-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const act = btn.getAttribute("data-action");
        container.dispatchEvent(new CustomEvent("speeddial:action", {
          bubbles: true,
          detail: { action: act }
        }));
        isOpen = false;
        render();
      });
    });
  }
  render();
}
var CSS22;
var init_speed_dial = __esm({
  "src/components/speed-dial.ts"() {
    "use strict";
    init_lucide();
    init_styles();
    init_useStagger();
    CSS22 = `
[data-theme="dark"] .speed-dial-action-btn {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
[data-theme="dark"] .laughtale-speed-dial {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
[data-theme="dark"] .speed-dial-main-btn {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
[data-theme="dark"] .speed-dial-list {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
`;
  }
});

// src/components/image-compare.ts
var image_compare_exports = {};
__export(image_compare_exports, {
  default: () => ImageCompareIsland
});
function ImageCompareIsland(container, props) {
  injectIslandStyle("image-compare", CSS23);
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
var CSS23;
var init_image_compare = __esm({
  "src/components/image-compare.ts"() {
    "use strict";
    init_styles();
    CSS23 = `
[data-theme="dark"] .laughtale-image-compare {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
`;
  }
});

// src/components/confirm-popup.ts
var confirm_popup_exports = {};
__export(confirm_popup_exports, {
  default: () => ConfirmPopupIsland
});
function ConfirmPopupIsland(container, props) {
  injectIslandStyle("confirm-popup", CSS24);
  let isOpen = false;
  function render() {
    container.innerHTML = `
            <div class="laughtale-confirm-popup" style="display: ${isOpen ? "block" : "none"}; position: absolute; z-index: 1000; background: var(--p-surface-0); border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius-lg); box-shadow: var(--p-shadow-lg); padding: 1rem; width: 260px; animation: scaleIn 0.15s ease;">
                <div style="display: flex; align-items: flex-start; gap: 0.5rem; margin-bottom: 0.75rem;">
                    <span style="color: #f59e0b; display: flex; align-items: center; margin-top: 2px;">${LucideIcons.alertTriangle}</span>
                    <span style="font-size: 0.875rem; font-weight: 500; color: var(--p-surface-900); line-height: 1.4;">${props.message}</span>
                </div>
                <div style="display: flex; justify-content: flex-end; gap: 0.5rem;">
                    <button type="button" class="btn-reject p-button p-button-secondary" style="padding: 0.35rem 0.65rem; font-size: 0.75rem;">
                        ${props.rejectText || "Cancel"}
                    </button>
                    <button type="button" class="btn-accept p-button p-button-primary" style="padding: 0.35rem 0.65rem; font-size: 0.75rem; background: #ef4444; border-color: #ef4444;">
                        ${props.acceptText || "Confirm"}
                    </button>
                </div>
            </div>
        `;
    container.querySelector(".btn-reject")?.addEventListener("click", () => {
      isOpen = false;
      render();
    });
    container.querySelector(".btn-accept")?.addEventListener("click", () => {
      isOpen = false;
      render();
      container.dispatchEvent(new CustomEvent("confirm:accept", {
        bubbles: true,
        detail: { action: props.actionName }
      }));
    });
  }
  if (props.targetSelector && props.targetSelector.trim()) {
    try {
      const trigger = document.querySelector(props.targetSelector);
      if (trigger) {
        trigger.addEventListener("click", (e) => {
          e.preventDefault();
          isOpen = !isOpen;
          render();
          if (isOpen) {
            const rect = trigger.getBoundingClientRect();
            const popup = container.querySelector(".laughtale-confirm-popup");
            if (popup) {
              popup.style.top = `${rect.bottom + window.scrollY + 6}px`;
              popup.style.left = `${rect.left + window.scrollX}px`;
            }
          }
        });
      }
    } catch (e) {
      console.warn("[SoftMax.LaughTale] Invalid targetSelector for confirm-popup:", props.targetSelector);
    }
  } else {
    const fallbackBtn = document.createElement("button");
    fallbackBtn.type = "button";
    fallbackBtn.className = "p-button p-button-danger";
    fallbackBtn.textContent = "Delete Record";
    fallbackBtn.style.padding = "0.4rem 0.75rem";
    fallbackBtn.style.fontSize = "0.8125rem";
    fallbackBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      isOpen = !isOpen;
      render();
      if (isOpen) {
        const popup = container.querySelector(".laughtale-confirm-popup");
        if (popup) {
          popup.style.position = "relative";
          popup.style.marginTop = "0.5rem";
          popup.style.display = "block";
        }
      }
    });
    container.prepend(fallbackBtn);
  }
  render();
}
var CSS24;
var init_confirm_popup = __esm({
  "src/components/confirm-popup.ts"() {
    "use strict";
    init_lucide();
    init_styles();
    CSS24 = `
[data-theme="dark"] .laughtale-confirm-popup {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
[data-theme="dark"] .btn-reject {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
[data-theme="dark"] .btn-accept {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
`;
  }
});

// src/components/accordion.ts
var accordion_exports = {};
__export(accordion_exports, {
  default: () => AccordionIsland
});
function AccordionIsland(container, props) {
  injectIslandStyle("accordion", CSS25);
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
      const headerText = tab.header || tab.Header || tab.title || tab.Title || tab.label || tab.Label || `Tab ${idx + 1}`;
      const contentText = tab.content || tab.Content || "";
      const iconText = tab.icon || tab.Icon || "";
      return `
                <div class="accordion-tab ${isOpen ? "tab-open" : ""}" data-idx="${idx}" style="border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius); margin-bottom: 0.5rem; background: var(--p-surface-0); overflow: hidden;">
                    <button type="button" 
                            class="accordion-header-btn" 
                            data-idx="${idx}" 
                            ${tab.disabled ? "disabled" : ""} 
                            style="width: 100%; display: flex; align-items: center; justify-content: space-between; padding: 0.875rem 1.25rem; border: none; background: ${isOpen ? "var(--p-surface-50)" : "var(--p-surface-0)"}; color: var(--p-text-color); font-weight: 600; font-size: 0.875rem; cursor: ${tab.disabled ? "not-allowed" : "pointer"}; text-align: left; transition: background 0.15s ease;">
                        <span style="display: flex; align-items: center; gap: 0.5rem;">
                            ${iconText ? `<span>${iconText}</span>` : ""}
                            <span>${headerText}</span>
                        </span>
                        <span class="chevron-icon" style="color: var(--p-text-muted); display: flex; align-items: center; transition: transform 0.25s cubic-bezier(0.2, 0, 0, 1); transform: rotate(${isOpen ? "180deg" : "0deg"});">
                            ${LucideIcons.chevronDown}
                        </span>
                    </button>
                    <div class="accordion-content" style="display: ${isOpen ? "block" : "none"}; padding: 1.25rem; border-top: 1px solid var(--p-border-color); font-size: 0.875rem; color: var(--p-text-muted); line-height: 1.6; background: var(--p-surface-0);">
                        <div class="tab-slot" data-slot-index="${idx}">${contentText}</div>
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
var CSS25;
var init_accordion = __esm({
  "src/components/accordion.ts"() {
    "use strict";
    init_lucide();
    init_styles();
    init_useDisclosure();
    init_useTransition();
    CSS25 = `
[data-theme="dark"] .accordion-tab {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
[data-theme="dark"] .accordion-header-btn {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
[data-theme="dark"] .accordion-content {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
[data-theme="dark"] .tab-slot {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
[data-theme="dark"] .laughtale-accordion {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
`;
  }
});

// src/components/tabs.ts
var tabs_exports = {};
__export(tabs_exports, {
  default: () => TabsIsland
});
function TabsIsland(container, props) {
  injectIslandStyle("tabs", CSS26);
  const tabs = props.tabs || [];
  let activeIndex = props.activeIndex || 0;
  const initialSlots = {};
  container.querySelectorAll("[data-slot]").forEach((el) => {
    const slotKey = el.getAttribute("data-slot") || "";
    if (slotKey) {
      initialSlots[slotKey] = el.cloneNode(true);
    }
  });
  function render() {
    const headerButtons = tabs.map((tab, idx) => {
      const isActive = idx === activeIndex;
      const headerText = tab.header || tab.Header || tab.title || tab.Title || tab.label || tab.Label || `Tab ${idx + 1}`;
      const iconText = tab.icon || tab.Icon || "";
      return `
                <button type="button" 
                        class="tab-header-btn ${isActive ? "tab-active" : ""}" 
                        data-idx="${idx}" 
                        ${tab.disabled ? "disabled" : ""} 
                        style="position: relative; padding: 0.75rem 1.25rem; border: none; background: transparent; color: ${isActive ? "var(--p-primary-600)" : "var(--p-text-muted)"}; font-weight: ${isActive ? "700" : "500"}; font-size: 0.875rem; cursor: ${tab.disabled ? "not-allowed" : "pointer"}; transition: color 0.15s ease; display: inline-flex; align-items: center; gap: 0.5rem; border-bottom: 2px solid ${isActive ? "var(--p-primary-600)" : "transparent"};">
                    ${iconText ? `<span>${iconText}</span>` : ""}
                    <span>${headerText}</span>
                </button>
            `;
    }).join("");
    const activeContent = tabs[activeIndex]?.content || tabs[activeIndex]?.Content || "";
    container.innerHTML = `
            <div class="laughtale-tabs" style="width: 100%;">
                <!-- Tab Headers Bar -->
                <div class="tabs-header-bar" style="display: flex; border-bottom: 1px solid var(--p-border-color); gap: 0.25rem; overflow-x: auto; position: relative;">
                    ${headerButtons}
                </div>

                <!-- Active Tab Content Panel -->
                <div class="tab-panel-body" style="padding: 1.25rem 0; font-size: 0.875rem; color: var(--p-text-color); line-height: 1.6; transition: opacity 0.2s ease;">
                    <div class="tab-slot-content">${activeContent}</div>
                </div>
            </div>
        `;
    const slotEl = initialSlots[`tab-${activeIndex}`];
    const targetContainer = container.querySelector(".tab-slot-content");
    if (slotEl && targetContainer) {
      targetContainer.innerHTML = "";
      targetContainer.appendChild(slotEl.cloneNode(true));
    }
    container.querySelectorAll(".tab-header-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
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
var CSS26;
var init_tabs = __esm({
  "src/components/tabs.ts"() {
    "use strict";
    init_styles();
    CSS26 = `
[data-theme="dark"] .tab-header-btn {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
[data-theme="dark"] .laughtale-tabs {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
[data-theme="dark"] .tabs-header-bar {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
[data-theme="dark"] .tab-panel-body {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
[data-theme="dark"] .tab-slot-content {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
`;
  }
});

// src/components/autocomplete.ts
var autocomplete_exports = {};
__export(autocomplete_exports, {
  default: () => AutoCompleteIsland
});
function AutoCompleteIsland(container, props) {
  injectIslandStyle("autocomplete", CSS27);
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
    items.forEach((it, i) => {
      if (i === idx) {
        it.classList.add("highlighted");
        it.scrollIntoView({ block: "nearest" });
      } else {
        it.classList.remove("highlighted");
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
var CSS27;
var init_autocomplete = __esm({
  "src/components/autocomplete.ts"() {
    "use strict";
    init_lucide();
    init_styles();
    init_useDisclosure();
    init_useClickOutside();
    init_useDebounce();
    CSS27 = `
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
  }
});

// src/components/color-picker.ts
var color_picker_exports = {};
__export(color_picker_exports, {
  default: () => ColorPickerIsland
});
function ColorPickerIsland(container, props) {
  injectIslandStyle("color-picker", CSS28);
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
var DEFAULT_PRESETS, CSS28;
var init_color_picker = __esm({
  "src/components/color-picker.ts"() {
    "use strict";
    init_styles();
    DEFAULT_PRESETS = [
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
    CSS28 = `
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
  }
});

// src/components/knob.ts
var knob_exports = {};
__export(knob_exports, {
  default: () => KnobIsland
});
function KnobIsland(container, props) {
  injectIslandStyle("knob", CSS29);
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
var CSS29;
var init_knob = __esm({
  "src/components/knob.ts"() {
    "use strict";
    init_styles();
    CSS29 = `
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
  }
});

// src/components/tag.ts
var tag_exports = {};
__export(tag_exports, {
  default: () => TagIsland
});
function TagIsland(container, props) {
  injectIslandStyle("tag", CSS30);
  const severity = props.severity || "info";
  const isRounded = props.rounded || false;
  let bg = "var(--p-blue-50, #eff6ff)";
  let color = "var(--p-blue-700, #1d4ed8)";
  let border = "var(--p-blue-200, #bfdbfe)";
  if (severity === "success") {
    bg = "var(--p-emerald-50, #ecfdf5)";
    color = "var(--p-emerald-700, #047857)";
    border = "var(--p-emerald-200, #a7f3d0)";
  } else if (severity === "warning") {
    bg = "var(--p-amber-50, #fffbeb)";
    color = "var(--p-amber-700, #b45309)";
    border = "var(--p-amber-200, #fde68a)";
  } else if (severity === "danger") {
    bg = "var(--p-red-50, #fef2f2)";
    color = "var(--p-red-700, #b91c1c)";
    border = "var(--p-red-200, #fecaca)";
  } else if (severity === "secondary") {
    bg = "var(--p-surface-100, #f1f5f9)";
    color = "var(--p-surface-700, #334155)";
    border = "var(--p-surface-200, #e2e8f0)";
  } else if (severity === "contrast") {
    bg = "var(--p-surface-900, #0f172a)";
    color = "var(--p-surface-0, #ffffff)";
    border = "var(--p-surface-950, #020617)";
  }
  container.innerHTML = `
        <span class="laughtale-tag tag-${severity}" style="display: inline-flex; align-items: center; gap: 0.35rem; padding: 0.25rem 0.6rem; font-size: 0.75rem; font-weight: 700; background: ${bg}; color: ${color}; border: 1px solid ${border}; border-radius: ${isRounded ? "9999px" : "var(--p-border-radius)"};">
            ${props.icon ? `<span>${props.icon}</span>` : ""}
            <span>${props.value}</span>
        </span>
    `;
}
var CSS30;
var init_tag = __esm({
  "src/components/tag.ts"() {
    "use strict";
    init_styles();
    CSS30 = `
[data-theme="dark"] .laughtale-tag {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
`;
  }
});

// src/components/breadcrumb.ts
var breadcrumb_exports = {};
__export(breadcrumb_exports, {
  default: () => BreadcrumbIsland
});
function BreadcrumbIsland(container, props) {
  injectIslandStyle("breadcrumb", CSS31);
  const items = props.items || [];
  const homeUrl = props.homeUrl || "/";
  const itemsHtml = items.map((item, idx) => {
    const isLast = idx === items.length - 1;
    const label = item.label || item.Label || "";
    const url = item.url || item.Url || "";
    const icon = item.icon || item.Icon || "";
    return `
            <li style="display: flex; align-items: center; gap: 0.5rem;">
                <span style="color: var(--p-text-muted); display: flex; align-items: center;">${LucideIcons.chevronRight}</span>
                ${url && !isLast ? `
                    <a href="${url}" style="color: var(--p-text-muted); text-decoration: none; font-size: 0.8125rem; font-weight: 500; display: flex; align-items: center; gap: 0.35rem; transition: color 0.15s ease;">
                        ${icon ? `<span>${icon}</span>` : ""}
                        <span>${label}</span>
                    </a>
                ` : `
                    <span style="color: var(--p-text-color); font-size: 0.8125rem; font-weight: 600; display: flex; align-items: center; gap: 0.35rem;">
                        ${icon ? `<span>${icon}</span>` : ""}
                        <span>${label}</span>
                    </span>
                `}
            </li>
        `;
  }).join("");
  container.innerHTML = `
        <nav class="laughtale-breadcrumb" style="display: block;">
            <ul style="list-style: none; display: flex; align-items: center; gap: 0.5rem; padding: 0; margin: 0;">
                <li>
                    <a href="${homeUrl}" style="color: var(--p-surface-600); display: flex; align-items: center; transition: color 0.15s ease;" title="Home">
                        ${LucideIcons.home}
                    </a>
                </li>
                ${itemsHtml}
            </ul>
        </nav>
    `;
}
var CSS31;
var init_breadcrumb = __esm({
  "src/components/breadcrumb.ts"() {
    "use strict";
    init_lucide();
    init_styles();
    CSS31 = `
[data-theme="dark"] .laughtale-breadcrumb {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
`;
  }
});

// src/components/scroll-top.ts
var scroll_top_exports = {};
__export(scroll_top_exports, {
  default: () => ScrollTopIsland
});
function ScrollTopIsland(container, props) {
  injectIslandStyle("scroll-top", CSS32);
  const threshold = props.threshold || 200;
  let isVisible = false;
  function render() {
    container.innerHTML = `
            <button type="button" 
                    class="laughtale-scroll-top-btn" 
                    style="display: ${isVisible ? "flex" : "none"}; position: fixed; bottom: 2rem; right: 2rem; z-index: 999; width: 2.75rem; height: 2.75rem; border-radius: 50%; border: none; background: var(--p-primary-600); color: #ffffff; box-shadow: var(--p-shadow-lg); cursor: pointer; align-items: center; justify-content: center; transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1); animation: fadeIn 0.2s ease;" 
                    title="Scroll to Top">
                ${LucideIcons.arrowUp}
            </button>
        `;
    container.querySelector(".laughtale-scroll-top-btn")?.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: props.behavior || "smooth" });
    });
  }
  const checkScroll = () => {
    const scrolled = window.scrollY > threshold;
    if (scrolled !== isVisible) {
      isVisible = scrolled;
      render();
    }
  };
  window.addEventListener("scroll", checkScroll, { passive: true });
  render();
}
var CSS32;
var init_scroll_top = __esm({
  "src/components/scroll-top.ts"() {
    "use strict";
    init_lucide();
    init_styles();
    CSS32 = `
[data-theme="dark"] .laughtale-scroll-top-btn {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
`;
  }
});

// src/components/inplace.ts
var inplace_exports = {};
__export(inplace_exports, {
  default: () => InplaceIsland
});
function InplaceIsland(container, props) {
  injectIslandStyle("inplace", CSS33);
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
var CSS33;
var init_inplace = __esm({
  "src/components/inplace.ts"() {
    "use strict";
    init_lucide();
    init_styles();
    CSS33 = `
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
  }
});

// src/components/command.ts
var command_exports = {};
__export(command_exports, {
  default: () => CommandPaletteIsland
});
function CommandPaletteIsland(container, props) {
  injectIslandStyle("command", CSS34);
  const placeholder = props.placeholder || "Type a command or search...";
  const items = props.items || [
    { id: "home", label: "Go to Overview", group: "Navigation", icon: "compass", url: "/", shortcut: "G H" },
    { id: "docs", label: "Documentation Index", group: "Navigation", icon: "file-text", url: "/doc/01-getting-started", shortcut: "G D" },
    { id: "showcase", label: "Showcase Components", group: "Navigation", icon: "layers", url: "/enterprise", shortcut: "G S" },
    { id: "dash", label: "Enterprise Dashboard", group: "Navigation", icon: "bar-chart", url: "/dashboard", shortcut: "G B" },
    { id: "theme-dark", label: "Toggle Dark Mode", group: "Theme & Preferences", icon: "moon", action: "toggle-dark", shortcut: "T D" },
    { id: "studio", label: "Open TweakAura Studio", group: "Theme & Preferences", icon: "palette", action: "open-studio", shortcut: "T S" },
    { id: "export-css", label: "Export Current CSS Theme", group: "Actions", icon: "share-2", action: "export-css" },
    { id: "help", label: "Help & Shortcuts Guide", group: "Actions", icon: "help-circle", action: "help", shortcut: "?" }
  ];
  let search = "";
  let selectedIndex = 0;
  const disclosure = useDisclosure({ defaultIsOpen: false });
  const scrollLock = useScrollLock();
  container.innerHTML = `
        <div class="laughtale-command-root">
            <!-- Command Overlay Backdrop -->
            <div class="command-backdrop" style="display: none; position: fixed; inset: 0; z-index: 9999; background: rgba(0, 0, 0, 0.5); backdrop-filter: blur(4px); align-items: flex-start; justify-content: center; padding-top: 12vh;">
                <!-- Command Dialog Card -->
                <div class="command-dialog" style="width: 100%; max-width: 580px; background: var(--p-surface-0, #ffffff); border: 1px solid var(--p-border-color, #e2e8f0); border-radius: var(--p-border-radius-xl, 0.75rem); box-shadow: var(--p-shadow-lg, 0 20px 25px -5px rgba(0,0,0,0.1)); overflow: hidden; display: flex; flex-direction: column;">
                    
                    <!-- Search Header -->
                    <div style="display: flex; align-items: center; padding: 0.875rem 1.125rem; border-bottom: 1px solid var(--p-border-color, #e2e8f0); gap: 0.75rem;">
                        <span style="color: var(--p-surface-400, #94a3b8); display: flex;">${LucideIcons.search}</span>
                        <input type="text" 
                               class="command-search-input" 
                               placeholder="${placeholder}" 
                               style="flex: 1; border: none; outline: none; background: transparent; font-size: 0.9375rem; color: var(--p-text-color, #0f172a); font-family: var(--p-font-family, inherit);" />
                        <span class="aura-tag tag-slate" style="font-size: 0.6875rem; padding: 0.2rem 0.45rem; font-family: monospace;">ESC</span>
                    </div>

                    <!-- Command Items List -->
                    <div class="command-items-container" style="max-height: 340px; overflow-y: auto; padding: 0.5rem;"></div>

                    <!-- Footer Bar -->
                    <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.5rem 1rem; border-top: 1px solid var(--p-border-color, #e2e8f0); background: var(--p-surface-50, #f8fafc); font-size: 0.75rem; color: var(--p-surface-500, #64748b);">
                        <div style="display: flex; align-items: center; gap: 0.75rem;">
                            <span>Navigate <kbd style="font-family: monospace; background: var(--p-surface-200); padding: 1px 4px; border-radius: 3px;">\u2191\u2193</kbd></span>
                            <span>Select <kbd style="font-family: monospace; background: var(--p-surface-200); padding: 1px 4px; border-radius: 3px;">\u21B5</kbd></span>
                        </div>
                        <div>SoftMax.LaughTale Spotlight</div>
                    </div>
                </div>
            </div>
        </div>
    `;
  const backdrop = container.querySelector(".command-backdrop");
  const dialog = container.querySelector(".command-dialog");
  const input = container.querySelector(".command-search-input");
  const listContainer = container.querySelector(".command-items-container");
  const focusTrap = useFocusTrap(dialog, { initialFocusElement: input });
  function getFilteredItems() {
    if (!search.trim()) return items;
    const q = search.toLowerCase();
    return items.filter((it) => it.label.toLowerCase().includes(q) || it.group && it.group.toLowerCase().includes(q));
  }
  function renderList() {
    const filtered = getFilteredItems();
    if (filtered.length === 0) {
      listContainer.innerHTML = `
                <div style="padding: 2.5rem 1rem; text-align: center; color: var(--p-surface-400);">
                    <div style="margin-bottom: 0.5rem; display: flex; justify-content: center;">${LucideIcons.alertCircle || "\u2139"}</div>
                    <div style="font-size: 0.875rem; font-weight: 500;">No matching commands found</div>
                </div>
            `;
      return;
    }
    const groups = {};
    filtered.forEach((it) => {
      const g = it.group || "General";
      if (!groups[g]) groups[g] = [];
      groups[g].push(it);
    });
    let flatIndex = 0;
    let html = "";
    for (const [groupName, groupItems] of Object.entries(groups)) {
      html += `<div style="font-size: 0.6875rem; font-weight: 700; color: var(--p-surface-400); text-transform: uppercase; letter-spacing: 0.05em; padding: 0.5rem 0.75rem 0.25rem;">${groupName}</div>`;
      groupItems.forEach((it) => {
        const isSelected = flatIndex === selectedIndex;
        const iconSvg = it.icon && LucideIcons[it.icon] ? LucideIcons[it.icon] : LucideIcons.terminal || "\u26A1";
        html += `
                    <div class="command-item ${isSelected ? "active" : ""}" 
                         data-index="${flatIndex}" 
                         data-id="${it.id}" 
                         style="display: flex; align-items: center; justify-content: space-between; padding: 0.5rem 0.75rem; border-radius: var(--p-border-radius, 6px); cursor: pointer; background: ${isSelected ? "var(--p-surface-100, #f1f5f9)" : "transparent"}; color: var(--p-text-color, #0f172a); font-size: 0.875rem; transition: background 0.1s ease;">
                        <div style="display: flex; align-items: center; gap: 0.625rem;">
                            <span style="color: ${isSelected ? "var(--p-primary-600)" : "var(--p-surface-400)"}; display: flex;">${iconSvg}</span>
                            <span>${it.label}</span>
                        </div>
                        ${it.shortcut ? `<span class="aura-tag tag-slate" style="font-size: 0.6875rem; padding: 0.15rem 0.4rem; font-family: monospace;">${it.shortcut}</span>` : ""}
                    </div>
                `;
        flatIndex++;
      });
    }
    listContainer.innerHTML = html;
    listContainer.querySelectorAll(".command-item").forEach((el) => {
      el.addEventListener("mouseenter", () => {
        selectedIndex = Number(el.getAttribute("data-index"));
        renderList();
      });
      el.addEventListener("click", () => {
        executeItem(filtered[Number(el.getAttribute("data-index"))]);
      });
    });
  }
  function executeItem(item) {
    if (!item) return;
    close();
    if (item.url) {
      window.location.href = item.url;
    } else if (item.action === "toggle-dark") {
      document.documentElement.classList.toggle("dark");
      localStorage.setItem("theme", document.documentElement.classList.contains("dark") ? "dark" : "light");
    } else if (item.action === "open-studio") {
      document.dispatchEvent(new CustomEvent("studio:open"));
    } else if (item.action === "export-css") {
      document.dispatchEvent(new CustomEvent("studio:export"));
    }
  }
  function open() {
    disclosure.open();
    backdrop.style.display = "flex";
    scrollLock.lock();
    focusTrap.activate();
    search = "";
    input.value = "";
    selectedIndex = 0;
    renderList();
    input.focus();
  }
  function close() {
    disclosure.close();
    backdrop.style.display = "none";
    scrollLock.unlock();
    focusTrap.deactivate();
  }
  backdrop.addEventListener("click", (e) => {
    if (e.target === backdrop) close();
  });
  input.addEventListener("input", () => {
    search = input.value;
    selectedIndex = 0;
    renderList();
  });
  input.addEventListener("keydown", (e) => {
    const filtered = getFilteredItems();
    if (e.key === "ArrowDown") {
      e.preventDefault();
      selectedIndex = (selectedIndex + 1) % Math.max(1, filtered.length);
      renderList();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      selectedIndex = (selectedIndex - 1 + filtered.length) % Math.max(1, filtered.length);
      renderList();
    } else if (e.key === "Enter") {
      e.preventDefault();
      executeItem(filtered[selectedIndex]);
    } else if (e.key === "Escape") {
      e.preventDefault();
      close();
    }
  });
  useHotkeys([
    { combo: "ctrl+k", handler: () => disclosure.isOpen ? close() : open(), allowInInputs: true },
    { combo: "meta+k", handler: () => disclosure.isOpen ? close() : open(), allowInInputs: true },
    { combo: "escape", handler: () => {
      if (disclosure.isOpen) close();
    }, allowInInputs: true }
  ]);
  document.addEventListener("command:open", () => open());
}
var CSS34;
var init_command = __esm({
  "src/components/command.ts"() {
    "use strict";
    init_lucide();
    init_styles();
    init_useDisclosure();
    init_useFocusTrap();
    init_useHotkeys();
    init_useScrollLock();
    CSS34 = `
[data-theme="dark"] .laughtale-command-root {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
[data-theme="dark"] .command-backdrop {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
[data-theme="dark"] .command-dialog {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
[data-theme="dark"] .command-search-input {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
[data-theme="dark"] .command-items-container {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
[data-theme="dark"] .command-item {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
`;
  }
});

// src/components/theme-studio.ts
var theme_studio_exports = {};
__export(theme_studio_exports, {
  default: () => ThemeStudioIsland
});
function ThemeStudioIsland(container, props = {}) {
  let currentPrimary = "emerald";
  let currentCustomHex = "";
  let currentNeutral = "slate";
  let currentRadius = "0.5rem";
  let currentDensity = "normal";
  let currentShadow = "layered";
  let currentFont = "sans";
  let currentThemeMode = "system";
  const disclosure = useDisclosure({ defaultIsOpen: props.defaultOpen });
  const scrollLock = useScrollLock();
  const clipboard = useClipboard();
  container.innerHTML = `
        <div class="laughtale-theme-studio-root">
            <button type="button" 
                    class="theme-studio-toggle-btn" 
                    title="Open Aura Live Theme Studio"
                    style="position: fixed; bottom: 1.5rem; right: 1.5rem; z-index: 5000; width: 3.25rem; height: 3.25rem; border-radius: 9999px; background: var(--p-surface-900, #0f172a); color: var(--p-surface-0, #ffffff); border: 2px solid var(--p-primary-500, #10b981); box-shadow: 0 10px 25px -5px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: transform 0.2s ease, box-shadow 0.2s ease; outline: none;">
                ${LucideIcons.palette}
            </button>
            <div class="theme-studio-backdrop" style="display: none; position: fixed; inset: 0; z-index: 5001; background: rgba(0, 0, 0, 0.4); backdrop-filter: blur(2px);"></div>
            <div class="theme-studio-drawer" style="position: fixed; top: 0; right: 0; bottom: 0; width: 100%; max-width: 440px; z-index: 5002; background: var(--p-surface-0, #ffffff); border-left: 1px solid var(--p-border-color, #e2e8f0); box-shadow: -10px 0 35px -5px rgba(0,0,0,0.15); transform: translateX(100%); transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1); display: flex; flex-direction: column;">
                <div style="display: flex; align-items: center; justify-content: space-between; padding: 1.25rem 1.5rem; border-bottom: 1px solid var(--p-border-color, #e2e8f0);">
                    <div style="display: flex; align-items: center; gap: 0.625rem;">
                        <span style="color: var(--p-primary-600); display: flex;">${LucideIcons.sliders || "\u{1F3A8}"}</span>
                        <div>
                            <div style="font-size: 1.05rem; font-weight: 800; color: var(--p-surface-900);">Aura Theme Studio</div>
                            <div style="font-size: 0.75rem; color: var(--p-surface-500);">Live Reactive Design System Editor</div>
                        </div>
                    </div>
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <button type="button" class="studio-reset-btn" title="Reset to Defaults" style="border: none; background: transparent; color: var(--p-surface-400); cursor: pointer; padding: 0.25rem; font-size: 0.75rem; border-radius: 4px;">
                            Reset
                        </button>
                        <button type="button" class="theme-studio-close-btn" style="border: none; background: transparent; color: var(--p-surface-400); cursor: pointer; padding: 0.25rem; display: flex; border-radius: 4px;">
                            ${LucideIcons.x}
                        </button>
                    </div>
                </div>
                <div style="flex: 1; overflow-y: auto; padding: 1.5rem; display: flex; flex-direction: column; gap: 1.5rem;">
                    <div>
                        <div style="font-size: 0.75rem; font-weight: 700; color: var(--p-surface-500); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.6rem;">Appearance Mode</div>
                        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.5rem;">
                            <button type="button" class="mode-btn active" data-mode="light" style="padding: 0.45rem 0.5rem; font-size: 0.8125rem; font-weight: 600; border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius); background: var(--p-surface-50); cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.35rem;">
                                ${LucideIcons.sun || "\u2600\uFE0F"} Light
                            </button>
                            <button type="button" class="mode-btn" data-mode="dark" style="padding: 0.45rem 0.5rem; font-size: 0.8125rem; font-weight: 600; border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius); background: var(--p-surface-50); cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.35rem;">
                                ${LucideIcons.moon || "\u{1F319}"} Dark
                            </button>
                            <button type="button" class="mode-btn" data-mode="system" style="padding: 0.45rem 0.5rem; font-size: 0.8125rem; font-weight: 600; border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius); background: var(--p-surface-50); cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.35rem;">
                                System
                            </button>
                        </div>
                    </div>
                    <div>
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.6rem;">
                            <span style="font-size: 0.75rem; font-weight: 700; color: var(--p-surface-500); text-transform: uppercase; letter-spacing: 0.05em;">Primary Palette</span>
                            <span class="studio-primary-label" style="font-size: 0.75rem; color: var(--p-primary-600); font-weight: 700;">Emerald</span>
                        </div>
                        <div class="studio-color-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(2.1rem, 1fr)); gap: 0.4rem; margin-bottom: 0.75rem;"></div>
                        <div style="display: flex; align-items: center; gap: 0.5rem; background: var(--p-surface-50); border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius); padding: 0.35rem 0.6rem;">
                            <input type="color" class="studio-custom-color-input" value="#10b981" style="width: 1.75rem; height: 1.75rem; border: none; border-radius: 4px; cursor: pointer; background: transparent;" />
                            <span style="font-size: 0.75rem; font-family: monospace; color: var(--p-surface-600);">Custom Hex Accent</span>
                        </div>
                    </div>
                    <div>
                        <div style="font-size: 0.75rem; font-weight: 700; color: var(--p-surface-500); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.6rem;">Neutral Surface Base</div>
                        <div class="studio-neutral-grid" style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 0.35rem;"></div>
                    </div>
                    <div>
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                            <span style="font-size: 0.75rem; font-weight: 700; color: var(--p-surface-500); text-transform: uppercase; letter-spacing: 0.05em;">Corner Radius</span>
                            <span class="studio-radius-label" style="font-family: monospace; font-size: 0.75rem; color: var(--p-primary-600); font-weight: 600;">0.5rem</span>
                        </div>
                        <div class="studio-radius-presets" style="display: grid; grid-template-columns: repeat(8, 1fr); gap: 0.25rem;">
                            <button type="button" class="radius-btn" data-radius="0rem" style="padding: 0.35rem 0; font-size: 0.6875rem; font-family: monospace; border: 1px solid var(--p-border-color); background: var(--p-surface-50); border-radius: 2px; cursor: pointer;">0</button>
                            <button type="button" class="radius-btn" data-radius="0.25rem" style="padding: 0.35rem 0; font-size: 0.6875rem; font-family: monospace; border: 1px solid var(--p-border-color); background: var(--p-surface-50); border-radius: 2px; cursor: pointer;">.25</button>
                            <button type="button" class="radius-btn" data-radius="0.375rem" style="padding: 0.35rem 0; font-size: 0.6875rem; font-family: monospace; border: 1px solid var(--p-border-color); background: var(--p-surface-50); border-radius: 2px; cursor: pointer;">.37</button>
                            <button type="button" class="radius-btn active" data-radius="0.5rem" style="padding: 0.35rem 0; font-size: 0.6875rem; font-family: monospace; border: 2px solid var(--p-primary-500); background: var(--p-primary-50); color: var(--p-primary-700); font-weight: bold; border-radius: 2px; cursor: pointer;">.5</button>
                            <button type="button" class="radius-btn" data-radius="0.75rem" style="padding: 0.35rem 0; font-size: 0.6875rem; font-family: monospace; border: 1px solid var(--p-border-color); background: var(--p-surface-50); border-radius: 2px; cursor: pointer;">.75</button>
                            <button type="button" class="radius-btn" data-radius="1.0rem" style="padding: 0.35rem 0; font-size: 0.6875rem; font-family: monospace; border: 1px solid var(--p-border-color); background: var(--p-surface-50); border-radius: 2px; cursor: pointer;">1.0</button>
                            <button type="button" class="radius-btn" data-radius="1.5rem" style="padding: 0.35rem 0; font-size: 0.6875rem; font-family: monospace; border: 1px solid var(--p-border-color); background: var(--p-surface-50); border-radius: 2px; cursor: pointer;">1.5</button>
                            <button type="button" class="radius-btn" data-radius="9999px" style="padding: 0.35rem 0; font-size: 0.6875rem; font-family: monospace; border: 1px solid var(--p-border-color); background: var(--p-surface-50); border-radius: 2px; cursor: pointer;">Pill</button>
                        </div>
                    </div>
                    <div>
                        <div style="font-size: 0.75rem; font-weight: 700; color: var(--p-surface-500); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.5rem;">Component Density</div>
                        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.5rem;">
                            <button type="button" class="density-btn" data-density="compact" style="padding: 0.4rem 0.5rem; font-size: 0.75rem; border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius); background: var(--p-surface-50); cursor: pointer;">Compact</button>
                            <button type="button" class="density-btn active" data-density="normal" style="padding: 0.4rem 0.5rem; font-size: 0.75rem; border: 2px solid var(--p-primary-500); border-radius: var(--p-border-radius); background: var(--p-primary-50); color: var(--p-primary-700); font-weight: 600; cursor: pointer;">Normal</button>
                            <button type="button" class="density-btn" data-density="spacious" style="padding: 0.4rem 0.5rem; font-size: 0.75rem; border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius); background: var(--p-surface-50); cursor: pointer;">Spacious</button>
                        </div>
                    </div>
                    <div>
                        <div style="font-size: 0.75rem; font-weight: 700; color: var(--p-surface-500); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.5rem;">Shadow Elevation</div>
                        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.35rem;">
                            <button type="button" class="shadow-btn" data-shadow="none" style="padding: 0.4rem 0.25rem; font-size: 0.6875rem; border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius); background: var(--p-surface-50); cursor: pointer;">Flat</button>
                            <button type="button" class="shadow-btn" data-shadow="subtle" style="padding: 0.4rem 0.25rem; font-size: 0.6875rem; border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius); background: var(--p-surface-50); cursor: pointer;">Subtle</button>
                            <button type="button" class="shadow-btn active" data-shadow="layered" style="padding: 0.4rem 0.25rem; font-size: 0.6875rem; border: 2px solid var(--p-primary-500); border-radius: var(--p-border-radius); background: var(--p-primary-50); color: var(--p-primary-700); font-weight: 600; cursor: pointer;">Layered</button>
                            <button type="button" class="shadow-btn" data-shadow="bold" style="padding: 0.4rem 0.25rem; font-size: 0.6875rem; border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius); background: var(--p-surface-50); cursor: pointer;">3D Bold</button>
                        </div>
                    </div>
                    <div>
                        <div style="font-size: 0.75rem; font-weight: 700; color: var(--p-surface-500); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.5rem;">Font Family</div>
                        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.35rem;">
                            <button type="button" class="font-btn active" data-font="sans" style="padding: 0.4rem 0.25rem; font-size: 0.75rem; border: 2px solid var(--p-primary-500); border-radius: var(--p-border-radius); background: var(--p-primary-50); color: var(--p-primary-700); font-weight: 600; cursor: pointer;">Jakarta</button>
                            <button type="button" class="font-btn" data-font="inter" style="padding: 0.4rem 0.25rem; font-size: 0.75rem; border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius); background: var(--p-surface-50); cursor: pointer;">Inter</button>
                            <button type="button" class="font-btn" data-font="mono" style="padding: 0.4rem 0.25rem; font-size: 0.75rem; font-family: monospace; border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius); background: var(--p-surface-50); cursor: pointer;">Mono</button>
                        </div>
                    </div>
                    <div>
                        <div style="font-size: 0.75rem; font-weight: 700; color: var(--p-surface-500); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.75rem;">Preset Curated Themes</div>
                        <div style="display: flex; flex-direction: column; gap: 0.5rem; max-height: 240px; overflow-y: auto;">
                            <button type="button" class="preset-theme-btn" data-theme="emerald-zero-trust" style="display: flex; align-items: center; justify-content: space-between; padding: 0.5rem 0.75rem; border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius); background: var(--p-surface-50); cursor: pointer; text-align: left;">
                                <div style="display: flex; align-items: center; gap: 0.5rem;">
                                    <span style="width: 1rem; height: 1rem; border-radius: 3px; background: #10b981;"></span>
                                    <span style="font-size: 0.8125rem; font-weight: 600; color: var(--p-surface-800);">Emerald Zero-Trust</span>
                                </div>
                                <span style="font-size: 0.6875rem; color: var(--p-surface-400);">Default</span>
                            </button>
                            <button type="button" class="preset-theme-btn" data-theme="krd-golden" style="display: flex; align-items: center; justify-content: space-between; padding: 0.5rem 0.75rem; border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius); background: var(--p-surface-50); cursor: pointer; text-align: left;">
                                <div style="display: flex; align-items: center; gap: 0.5rem;">
                                    <span style="width: 1rem; height: 1rem; border-radius: 3px; background: #eab308;"></span>
                                    <span style="font-size: 0.8125rem; font-weight: 600; color: var(--p-surface-800);">KRD Golden</span>
                                </div>
                                <span style="font-size: 0.6875rem; color: var(--p-surface-400);">Radius 0.5</span>
                            </button>
                            <button type="button" class="preset-theme-btn" data-theme="supabase-violet" style="display: flex; align-items: center; justify-content: space-between; padding: 0.5rem 0.75rem; border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius); background: var(--p-surface-50); cursor: pointer; text-align: left;">
                                <div style="display: flex; align-items: center; gap: 0.5rem;">
                                    <span style="width: 1rem; height: 1rem; border-radius: 3px; background: #8b5cf6;"></span>
                                    <span style="font-size: 0.8125rem; font-weight: 600; color: var(--p-surface-800);">Supabase Violet</span>
                                </div>
                                <span style="font-size: 0.6875rem; color: var(--p-surface-400);">Radius 0.375</span>
                            </button>
                            <button type="button" class="preset-theme-btn" data-theme="sunset-ember" style="display: flex; align-items: center; justify-content: space-between; padding: 0.5rem 0.75rem; border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius); background: var(--p-surface-50); cursor: pointer; text-align: left;">
                                <div style="display: flex; align-items: center; gap: 0.5rem;">
                                    <span style="width: 1rem; height: 1rem; border-radius: 3px; background: #f43f5e;"></span>
                                    <span style="font-size: 0.8125rem; font-weight: 600; color: var(--p-surface-800);">Sunset Ember</span>
                                </div>
                                <span style="font-size: 0.6875rem; color: var(--p-surface-400);">Radius 0.75</span>
                            </button>
                            <button type="button" class="preset-theme-btn" data-theme="ocean-blue" style="display: flex; align-items: center; justify-content: space-between; padding: 0.5rem 0.75rem; border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius); background: var(--p-surface-50); cursor: pointer; text-align: left;">
                                <div style="display: flex; align-items: center; gap: 0.5rem;">
                                    <span style="width: 1rem; height: 1rem; border-radius: 3px; background: #3b82f6;"></span>
                                    <span style="font-size: 0.8125rem; font-weight: 600; color: var(--p-surface-800);">Ocean Blue</span>
                                </div>
                                <span style="font-size: 0.6875rem; color: var(--p-surface-400);">Radius 0.5</span>
                            </button>
                            <button type="button" class="preset-theme-btn" data-theme="cyber-cyan" style="display: flex; align-items: center; justify-content: space-between; padding: 0.5rem 0.75rem; border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius); background: var(--p-surface-50); cursor: pointer; text-align: left;">
                                <div style="display: flex; align-items: center; gap: 0.5rem;">
                                    <span style="width: 1rem; height: 1rem; border-radius: 3px; background: #06b6d4;"></span>
                                    <span style="font-size: 0.8125rem; font-weight: 600; color: var(--p-surface-800);">Cyberpunk Cyan</span>
                                </div>
                                <span style="font-size: 0.6875rem; color: var(--p-surface-400);">Radius 0.0</span>
                            </button>
                            <button type="button" class="preset-theme-btn" data-theme="lime-minimal" style="display: flex; align-items: center; justify-content: space-between; padding: 0.5rem 0.75rem; border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius); background: var(--p-surface-50); cursor: pointer; text-align: left;">
                                <div style="display: flex; align-items: center; gap: 0.5rem;">
                                    <span style="width: 1rem; height: 1rem; border-radius: 3px; background: #84cc16;"></span>
                                    <span style="font-size: 0.8125rem; font-weight: 600; color: var(--p-surface-800);">Lime Minimal</span>
                                </div>
                                <span style="font-size: 0.6875rem; color: var(--p-surface-400);">Radius 0.25</span>
                            </button>
                            <button type="button" class="preset-theme-btn" data-theme="sunset-orange" style="display: flex; align-items: center; justify-content: space-between; padding: 0.5rem 0.75rem; border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius); background: var(--p-surface-50); cursor: pointer; text-align: left;">
                                <div style="display: flex; align-items: center; gap: 0.5rem;">
                                    <span style="width: 1rem; height: 1rem; border-radius: 3px; background: #f97316;"></span>
                                    <span style="font-size: 0.8125rem; font-weight: 600; color: var(--p-surface-800);">Sunset Orange</span>
                                </div>
                                <span style="font-size: 0.6875rem; color: var(--p-surface-400);">Radius 0.5</span>
                            </button>
                            <button type="button" class="preset-theme-btn" data-theme="sakura-pink" style="display: flex; align-items: center; justify-content: space-between; padding: 0.5rem 0.75rem; border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius); background: var(--p-surface-50); cursor: pointer; text-align: left;">
                                <div style="display: flex; align-items: center; gap: 0.5rem;">
                                    <span style="width: 1rem; height: 1rem; border-radius: 3px; background: #ec4899;"></span>
                                    <span style="font-size: 0.8125rem; font-weight: 600; color: var(--p-surface-800);">Sakura Pink</span>
                                </div>
                                <span style="font-size: 0.6875rem; color: var(--p-surface-400);">Radius 1.0</span>
                            </button>
                        </div>
                    </div>
                    <div style="background: var(--p-surface-50); border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius); padding: 1rem;">
                        <div style="font-size: 0.6875rem; font-weight: 700; color: var(--p-surface-400); text-transform: uppercase; margin-bottom: 0.75rem;">Interactive Live Preview</div>
                        <div style="display: flex; flex-direction: column; gap: 0.75rem;">
                            <div style="display: flex; gap: 0.5rem;">
                                <button type="button" class="p-button p-button-primary" style="flex: 1; padding: 0.4rem 0.5rem; font-size: 0.75rem;">Primary</button>
                                <button type="button" class="p-button p-button-secondary" style="flex: 1; padding: 0.4rem 0.5rem; font-size: 0.75rem;">Secondary</button>
                            </div>
                            <input type="text" value="Interactive Input" class="p-input" style="width: 100%; padding: 0.4rem 0.6rem; font-size: 0.75rem; border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius); background: var(--p-surface-0); color: var(--p-text-color);" />
                            <div style="display: flex; align-items: center; justify-content: space-between; font-size: 0.75rem;">
                                <span class="aura-tag tag-emerald">Active Badge</span>
                                <span style="color: var(--p-primary-600); font-weight: bold;">75% Telemetry</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div style="padding: 1rem 1.5rem; border-top: 1px solid var(--p-border-color, #e2e8f0); background: var(--p-surface-50, #f8fafc); display: flex; flex-direction: column; gap: 0.5rem;">
                    <button type="button" class="studio-copy-css-btn p-button p-button-primary" style="width: 100%; justify-content: center; font-size: 0.8125rem;">
                        ${LucideIcons.copy} Copy CSS Custom Properties
                    </button>
                    <button type="button" class="studio-copy-csharp-btn p-button p-button-secondary" style="width: 100%; justify-content: center; font-size: 0.8125rem;">
                        ${LucideIcons.code} Copy C# Theme Tokens
                    </button>
                </div>
            </div>
        </div>
    `;
  const toggleBtn = container.querySelector(".theme-studio-toggle-btn");
  const backdrop = container.querySelector(".theme-studio-backdrop");
  const drawer = container.querySelector(".theme-studio-drawer");
  const closeBtn = container.querySelector(".theme-studio-close-btn");
  const resetBtn = container.querySelector(".studio-reset-btn");
  const colorGrid = container.querySelector(".studio-color-grid");
  const neutralGrid = container.querySelector(".studio-neutral-grid");
  const radiusLabel = container.querySelector(".studio-radius-label");
  const primaryLabel = container.querySelector(".studio-primary-label");
  const customColorInput = container.querySelector(".studio-custom-color-input");
  const copyCssBtn = container.querySelector(".studio-copy-css-btn");
  const copyCSharpBtn = container.querySelector(".studio-copy-csharp-btn");
  colorGrid.innerHTML = Object.entries(PRIMARY_PRESETS).map(([key, p]) => `
        <button type="button" 
                class="studio-color-swatch ${key === currentPrimary ? "active" : ""}" 
                data-color="${key}" 
                title="${p.name}" 
                style="width: 100%; aspect-ratio: 1; border-radius: var(--p-border-radius, 6px); background: ${p.hex}; border: ${key === currentPrimary ? "2px solid #ffffff" : "1px solid rgba(0,0,0,0.1)"}; box-shadow: ${key === currentPrimary ? "0 0 0 2px var(--p-surface-900)" : "none"}; cursor: pointer; transition: transform 0.15s ease;">
        </button>
    `).join("");
  neutralGrid.innerHTML = Object.entries(NEUTRAL_PRESETS).map(([key, n]) => `
        <button type="button" 
                class="studio-neutral-swatch ${key === currentNeutral ? "active" : ""}" 
                data-neutral="${key}" 
                style="padding: 0.35rem 0.25rem; font-size: 0.6875rem; font-weight: 600; border: ${key === currentNeutral ? "2px solid var(--p-primary-500)" : "1px solid var(--p-border-color)"}; border-radius: var(--p-border-radius); background: ${n.s100}; color: ${n.s900}; cursor: pointer; text-align: center;">
            ${n.name}
        </button>
    `).join("");
  function applyTheme() {
    const root = document.documentElement;
    const p = PRIMARY_PRESETS[currentPrimary] || PRIMARY_PRESETS.emerald;
    const n = NEUTRAL_PRESETS[currentNeutral] || NEUTRAL_PRESETS.slate;
    if (currentCustomHex) {
      root.style.setProperty("--p-primary-500", currentCustomHex);
      root.style.setProperty("--p-primary-600", currentCustomHex);
      root.style.setProperty("--p-primary-700", currentCustomHex);
      if (primaryLabel) primaryLabel.textContent = `Custom (${currentCustomHex})`;
    } else {
      root.style.setProperty("--p-primary-50", p.lightP50);
      root.style.setProperty("--p-primary-100", p.lightP100);
      root.style.setProperty("--p-primary-200", p.lightP200);
      root.style.setProperty("--p-primary-500", p.lightP500);
      root.style.setProperty("--p-primary-600", p.lightP600);
      root.style.setProperty("--p-primary-700", p.lightP700);
      if (primaryLabel) primaryLabel.textContent = p.name;
    }
    root.style.setProperty("--p-surface-0", n.s0);
    root.style.setProperty("--p-surface-50", n.s50);
    root.style.setProperty("--p-surface-100", n.s100);
    root.style.setProperty("--p-surface-200", n.s200);
    root.style.setProperty("--p-surface-300", n.s300);
    root.style.setProperty("--p-surface-400", n.s400);
    root.style.setProperty("--p-surface-500", n.s500);
    root.style.setProperty("--p-surface-600", n.s600);
    root.style.setProperty("--p-surface-700", n.s700);
    root.style.setProperty("--p-surface-800", n.s800);
    root.style.setProperty("--p-surface-900", n.s900);
    root.style.setProperty("--p-surface-950", n.s950);
    root.style.setProperty("--p-border-radius", currentRadius);
    const radNum = parseFloat(currentRadius) || 0;
    root.style.setProperty("--p-border-radius-lg", currentRadius === "9999px" ? "9999px" : `${radNum * 1.5}rem`);
    root.style.setProperty("--p-border-radius-xl", currentRadius === "9999px" ? "9999px" : `${radNum * 2}rem`);
    if (radiusLabel) radiusLabel.textContent = currentRadius;
    if (currentDensity === "compact") {
      root.style.setProperty("--p-content-padding", "0.625rem");
      root.style.setProperty("--p-field-padding-y", "0.35rem");
      root.style.setProperty("--p-field-padding-x", "0.5rem");
    } else if (currentDensity === "spacious") {
      root.style.setProperty("--p-content-padding", "1.5rem");
      root.style.setProperty("--p-field-padding-y", "0.65rem");
      root.style.setProperty("--p-field-padding-x", "1rem");
    } else {
      root.style.setProperty("--p-content-padding", "1rem");
      root.style.setProperty("--p-field-padding-y", "0.5rem");
      root.style.setProperty("--p-field-padding-x", "0.75rem");
    }
    if (currentShadow === "none") {
      root.style.setProperty("--p-shadow-sm", "none");
      root.style.setProperty("--p-shadow-md", "none");
      root.style.setProperty("--p-shadow-lg", "none");
    } else if (currentShadow === "subtle") {
      root.style.setProperty("--p-shadow-sm", "0 1px 2px rgba(0,0,0,0.03)");
      root.style.setProperty("--p-shadow-md", "0 2px 4px rgba(0,0,0,0.05)");
      root.style.setProperty("--p-shadow-lg", "0 4px 8px rgba(0,0,0,0.06)");
    } else if (currentShadow === "bold") {
      root.style.setProperty("--p-shadow-sm", "0 2px 4px rgba(0,0,0,0.1)");
      root.style.setProperty("--p-shadow-md", "0 8px 16px rgba(0,0,0,0.15)");
      root.style.setProperty("--p-shadow-lg", "0 16px 32px rgba(0,0,0,0.2)");
    } else {
      root.style.setProperty("--p-shadow-sm", "0 1px 2px 0 rgba(0, 0, 0, 0.05)");
      root.style.setProperty("--p-shadow-md", "0 4px 6px -1px rgba(0, 0, 0, 0.07)");
      root.style.setProperty("--p-shadow-lg", "0 10px 15px -3px rgba(0, 0, 0, 0.08)");
    }
    if (currentFont === "inter") {
      root.style.setProperty("--p-font-family", "Inter, -apple-system, sans-serif");
    } else if (currentFont === "mono") {
      root.style.setProperty("--p-font-family", "JetBrains Mono, monospace");
    } else {
      root.style.setProperty("--p-font-family", "Plus Jakarta Sans, sans-serif");
    }
    if (currentThemeMode === "dark") {
      root.classList.add("dark");
      root.setAttribute("data-theme", "dark");
    } else if (currentThemeMode === "light") {
      root.classList.remove("dark");
      root.setAttribute("data-theme", "light");
    } else {
      const isSysDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      root.classList.toggle("dark", isSysDark);
      root.setAttribute("data-theme", isSysDark ? "dark" : "light");
    }
  }
  function open() {
    disclosure.open();
    backdrop.style.display = "block";
    drawer.style.transform = "translateX(0)";
    scrollLock.lock();
  }
  function close() {
    disclosure.close();
    drawer.style.transform = "translateX(100%)";
    setTimeout(() => {
      backdrop.style.display = "none";
    }, 250);
    scrollLock.unlock();
  }
  toggleBtn.addEventListener("click", () => {
    if (disclosure.isOpen) close();
    else open();
  });
  closeBtn.addEventListener("click", close);
  backdrop.addEventListener("click", close);
  container.querySelectorAll(".mode-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      currentThemeMode = btn.getAttribute("data-mode") || "system";
      container.querySelectorAll(".mode-btn").forEach((b) => {
        b.classList.remove("active");
        b.style.borderColor = "var(--p-border-color)";
        b.style.background = "var(--p-surface-50)";
      });
      btn.classList.add("active");
      btn.style.borderColor = "var(--p-primary-500)";
      btn.style.background = "var(--p-primary-50)";
      applyTheme();
    });
  });
  colorGrid.querySelectorAll(".studio-color-swatch").forEach((btn) => {
    btn.addEventListener("click", () => {
      currentCustomHex = "";
      currentPrimary = btn.getAttribute("data-color");
      colorGrid.querySelectorAll(".studio-color-swatch").forEach((b) => {
        const k = b.getAttribute("data-color");
        b.style.boxShadow = k === currentPrimary ? "0 0 0 2px var(--p-surface-900)" : "none";
      });
      applyTheme();
    });
  });
  if (customColorInput) {
    customColorInput.addEventListener("input", () => {
      currentCustomHex = customColorInput.value;
      applyTheme();
    });
  }
  neutralGrid.querySelectorAll(".studio-neutral-swatch").forEach((btn) => {
    btn.addEventListener("click", () => {
      currentNeutral = btn.getAttribute("data-neutral");
      neutralGrid.querySelectorAll(".studio-neutral-swatch").forEach((b) => {
        const k = b.getAttribute("data-neutral");
        b.style.border = k === currentNeutral ? "2px solid var(--p-primary-500)" : "1px solid var(--p-border-color)";
      });
      applyTheme();
    });
  });
  container.querySelectorAll(".radius-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      currentRadius = btn.getAttribute("data-radius");
      container.querySelectorAll(".radius-btn").forEach((b) => {
        b.classList.remove("active");
        b.style.borderColor = "var(--p-border-color)";
        b.style.background = "var(--p-surface-50)";
        b.style.color = "inherit";
        b.style.fontWeight = "normal";
      });
      btn.classList.add("active");
      btn.style.borderColor = "var(--p-primary-500)";
      btn.style.background = "var(--p-primary-50)";
      btn.style.color = "var(--p-primary-700)";
      btn.style.fontWeight = "bold";
      applyTheme();
    });
  });
  container.querySelectorAll(".density-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      currentDensity = btn.getAttribute("data-density") || "normal";
      container.querySelectorAll(".density-btn").forEach((b) => {
        b.classList.remove("active");
        b.style.borderColor = "var(--p-border-color)";
        b.style.background = "var(--p-surface-50)";
      });
      btn.classList.add("active");
      btn.style.borderColor = "var(--p-primary-500)";
      btn.style.background = "var(--p-primary-50)";
      applyTheme();
    });
  });
  container.querySelectorAll(".shadow-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      currentShadow = btn.getAttribute("data-shadow") || "layered";
      container.querySelectorAll(".shadow-btn").forEach((b) => {
        b.classList.remove("active");
        b.style.borderColor = "var(--p-border-color)";
        b.style.background = "var(--p-surface-50)";
      });
      btn.classList.add("active");
      btn.style.borderColor = "var(--p-primary-500)";
      btn.style.background = "var(--p-primary-50)";
      applyTheme();
    });
  });
  container.querySelectorAll(".font-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      currentFont = btn.getAttribute("data-font") || "sans";
      container.querySelectorAll(".font-btn").forEach((b) => {
        b.classList.remove("active");
        b.style.borderColor = "var(--p-border-color)";
        b.style.background = "var(--p-surface-50)";
      });
      btn.classList.add("active");
      btn.style.borderColor = "var(--p-primary-500)";
      btn.style.background = "var(--p-primary-50)";
      applyTheme();
    });
  });
  container.querySelectorAll(".preset-theme-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      currentCustomHex = "";
      const theme = btn.getAttribute("data-theme");
      if (theme === "emerald-zero-trust") {
        currentPrimary = "emerald";
        currentNeutral = "slate";
        currentRadius = "0.5rem";
        currentDensity = "normal";
      } else if (theme === "krd-golden") {
        currentPrimary = "yellow";
        currentNeutral = "zinc";
        currentRadius = "0.5rem";
        currentDensity = "normal";
      } else if (theme === "supabase-violet") {
        currentPrimary = "violet";
        currentNeutral = "zinc";
        currentRadius = "0.375rem";
        currentDensity = "compact";
      } else if (theme === "sunset-ember") {
        currentPrimary = "rose";
        currentNeutral = "stone";
        currentRadius = "0.75rem";
        currentDensity = "normal";
      } else if (theme === "ocean-blue") {
        currentPrimary = "blue";
        currentNeutral = "slate";
        currentRadius = "0.5rem";
        currentDensity = "normal";
      } else if (theme === "cyber-cyan") {
        currentPrimary = "cyan";
        currentNeutral = "zinc";
        currentRadius = "0rem";
        currentDensity = "compact";
      } else if (theme === "lime-minimal") {
        currentPrimary = "lime";
        currentNeutral = "neutral";
        currentRadius = "0.25rem";
        currentDensity = "compact";
      } else if (theme === "sunset-orange") {
        currentPrimary = "orange";
        currentNeutral = "stone";
        currentRadius = "0.5rem";
        currentDensity = "normal";
      } else if (theme === "sakura-pink") {
        currentPrimary = "pink";
        currentNeutral = "zinc";
        currentRadius = "1.0rem";
        currentDensity = "spacious";
      }
      applyTheme();
    });
  });
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      currentPrimary = "emerald";
      currentCustomHex = "";
      currentNeutral = "slate";
      currentRadius = "0.5rem";
      currentDensity = "normal";
      currentShadow = "layered";
      currentFont = "sans";
      currentThemeMode = "system";
      applyTheme();
    });
  }
  copyCssBtn.addEventListener("click", () => {
    const p = PRIMARY_PRESETS[currentPrimary] || PRIMARY_PRESETS.emerald;
    const n = NEUTRAL_PRESETS[currentNeutral] || NEUTRAL_PRESETS.slate;
    const primaryVal = currentCustomHex || p.hex;
    const cssSnippet = `
:root {
    --p-primary-color: ${primaryVal};
    --p-primary-50: ${p.lightP50};
    --p-primary-500: ${p.lightP500};
    --p-primary-600: ${p.lightP600};
    --p-primary-700: ${p.lightP700};
    --p-surface-0: ${n.s0};
    --p-surface-50: ${n.s50};
    --p-surface-900: ${n.s900};
    --p-border-radius: ${currentRadius};
    --p-content-padding: ${currentDensity === "compact" ? "0.625rem" : currentDensity === "spacious" ? "1.5rem" : "1rem"};
}

[data-theme="dark"], .dark {
    --p-primary-50: ${p.darkP50};
    --p-surface-0: ${n.s900};
    --p-surface-50: ${n.s950};
    --p-surface-900: ${n.s50};
}`.trim();
    clipboard.copy(cssSnippet);
    copyCssBtn.innerHTML = `${LucideIcons.check} Copied to Clipboard!`;
    setTimeout(() => {
      copyCssBtn.innerHTML = `${LucideIcons.copy} Copy CSS Custom Properties`;
    }, 2e3);
  });
  copyCSharpBtn.addEventListener("click", () => {
    const p = PRIMARY_PRESETS[currentPrimary] || PRIMARY_PRESETS.emerald;
    const primaryHex = currentCustomHex || p.hex;
    const primaryName = currentCustomHex ? "Custom" : p.name;
    const csharpSnippet = `
public static class AppTheme
{
    public const string PrimaryHex = "${primaryHex}";
    public const string PrimaryName = "${primaryName}";
    public const string NeutralBase = "${currentNeutral}";
    public const string BorderRadius = "${currentRadius}";
    public const string Density = "${currentDensity}";
}`.trim();
    clipboard.copy(csharpSnippet);
    copyCSharpBtn.innerHTML = `${LucideIcons.check} Copied C# Code!`;
    setTimeout(() => {
      copyCSharpBtn.innerHTML = `${LucideIcons.code} Copy C# Theme Tokens`;
    }, 2e3);
  });
  document.addEventListener("studio:open", open);
  document.addEventListener("studio:export", () => {
    open();
    copyCssBtn.click();
  });
  applyTheme();
}
var PRIMARY_PRESETS, NEUTRAL_PRESETS;
var init_theme_studio = __esm({
  "src/components/theme-studio.ts"() {
    "use strict";
    init_lucide();
    init_useDisclosure();
    init_useScrollLock();
    init_useClipboard();
    PRIMARY_PRESETS = {
      emerald: {
        name: "Emerald",
        hex: "#10b981",
        lightP50: "#ecfdf5",
        lightP100: "#d1fae5",
        lightP200: "#a7f3d0",
        lightP500: "#10b981",
        lightP600: "#059669",
        lightP700: "#047857",
        darkP50: "#064e3b",
        darkP100: "#065f46",
        darkP200: "#047857"
      },
      indigo: {
        name: "Indigo",
        hex: "#6366f1",
        lightP50: "#eef2ff",
        lightP100: "#e0e7ff",
        lightP200: "#c7d2fe",
        lightP500: "#6366f1",
        lightP600: "#4f46e5",
        lightP700: "#4338ca",
        darkP50: "#312e81",
        darkP100: "#3730a3",
        darkP200: "#4338ca"
      },
      violet: {
        name: "Violet",
        hex: "#8b5cf6",
        lightP50: "#f5f3ff",
        lightP100: "#ede9fe",
        lightP200: "#ddd6fe",
        lightP500: "#8b5cf6",
        lightP600: "#7c3aed",
        lightP700: "#6d28d9",
        darkP50: "#4c1d95",
        darkP100: "#5b21b6",
        darkP200: "#6d28d9"
      },
      rose: {
        name: "Rose",
        hex: "#f43f5e",
        lightP50: "#fff1f2",
        lightP100: "#ffe4e6",
        lightP200: "#fecdd3",
        lightP500: "#f43f5e",
        lightP600: "#e11d48",
        lightP700: "#be123c",
        darkP50: "#881337",
        darkP100: "#9f1239",
        darkP200: "#be123c"
      },
      amber: {
        name: "Amber",
        hex: "#f59e0b",
        lightP50: "#fffbeb",
        lightP100: "#fef3c7",
        lightP200: "#fde68a",
        lightP500: "#f59e0b",
        lightP600: "#d97706",
        lightP700: "#b45309",
        darkP50: "#78350f",
        darkP100: "#92400e",
        darkP200: "#b45309"
      },
      cyan: {
        name: "Cyan",
        hex: "#06b6d4",
        lightP50: "#ecfeff",
        lightP100: "#cffafe",
        lightP200: "#a5f3fc",
        lightP500: "#06b6d4",
        lightP600: "#0891b2",
        lightP700: "#0e7490",
        darkP50: "#164e63",
        darkP100: "#155e75",
        darkP200: "#0e7490"
      },
      yellow: {
        name: "KRD Yellow",
        hex: "#eab308",
        lightP50: "#fefce8",
        lightP100: "#fef9c3",
        lightP200: "#fef08a",
        lightP500: "#eab308",
        lightP600: "#ca8a04",
        lightP700: "#a16207",
        darkP50: "#713f12",
        darkP100: "#854d0e",
        darkP200: "#a16207"
      },
      blue: {
        name: "Blue",
        hex: "#3b82f6",
        lightP50: "#eff6ff",
        lightP100: "#dbeafe",
        lightP200: "#bfdbfe",
        lightP500: "#3b82f6",
        lightP600: "#2563eb",
        lightP700: "#1d4ed8",
        darkP50: "#1e3a5f",
        darkP100: "#1e40af",
        darkP200: "#1d4ed8"
      },
      lime: {
        name: "Lime",
        hex: "#84cc16",
        lightP50: "#f7fee7",
        lightP100: "#ecfccb",
        lightP200: "#d9f99d",
        lightP500: "#84cc16",
        lightP600: "#65a30d",
        lightP700: "#4d7c0f",
        darkP50: "#365314",
        darkP100: "#3f6212",
        darkP200: "#4d7c0f"
      },
      teal: {
        name: "Teal",
        hex: "#14b8a6",
        lightP50: "#f0fdfa",
        lightP100: "#ccfbf1",
        lightP200: "#99f6e4",
        lightP500: "#14b8a6",
        lightP600: "#0d9488",
        lightP700: "#0f766e",
        darkP50: "#134e4a",
        darkP100: "#115e59",
        darkP200: "#0f766e"
      },
      orange: {
        name: "Orange",
        hex: "#f97316",
        lightP50: "#fff7ed",
        lightP100: "#ffedd5",
        lightP200: "#fed7aa",
        lightP500: "#f97316",
        lightP600: "#ea580c",
        lightP700: "#c2410c",
        darkP50: "#7c2d12",
        darkP100: "#9a3412",
        darkP200: "#c2410c"
      },
      pink: {
        name: "Pink",
        hex: "#ec4899",
        lightP50: "#fdf2f8",
        lightP100: "#fce7f3",
        lightP200: "#fbcfe8",
        lightP500: "#ec4899",
        lightP600: "#db2777",
        lightP700: "#be185d",
        darkP50: "#831843",
        darkP100: "#9d174d",
        darkP200: "#be185d"
      },
      sky: {
        name: "Sky",
        hex: "#0ea5e9",
        lightP50: "#f0f9ff",
        lightP100: "#e0f2fe",
        lightP200: "#bae6fd",
        lightP500: "#0ea5e9",
        lightP600: "#0284c7",
        lightP700: "#0369a1",
        darkP50: "#0c4a6e",
        darkP100: "#075985",
        darkP200: "#0369a1"
      }
    };
    NEUTRAL_PRESETS = {
      slate: {
        name: "Slate",
        s0: "#ffffff",
        s50: "#f8fafc",
        s100: "#f1f5f9",
        s200: "#e2e8f0",
        s300: "#cbd5e1",
        s400: "#94a3b8",
        s500: "#64748b",
        s600: "#475569",
        s700: "#334155",
        s800: "#1e293b",
        s900: "#0f172a",
        s950: "#020617"
      },
      zinc: {
        name: "Zinc",
        s0: "#ffffff",
        s50: "#fafafa",
        s100: "#f4f4f5",
        s200: "#e4e4e7",
        s300: "#d4d4d8",
        s400: "#a1a1aa",
        s500: "#71717a",
        s600: "#52525b",
        s700: "#3f3f46",
        s800: "#27272a",
        s900: "#18181b",
        s950: "#09090b"
      },
      stone: {
        name: "Stone",
        s0: "#ffffff",
        s50: "#fafaf9",
        s100: "#f5f5f4",
        s200: "#e7e5e4",
        s300: "#d6d3d1",
        s400: "#a8a29e",
        s500: "#78716c",
        s600: "#57534e",
        s700: "#44403c",
        s800: "#292524",
        s900: "#1c1917",
        s950: "#0c0a09"
      },
      neutral: {
        name: "Neutral",
        s0: "#ffffff",
        s50: "#fafafa",
        s100: "#f5f5f5",
        s200: "#e5e5e5",
        s300: "#d4d4d4",
        s400: "#a3a3a3",
        s500: "#737373",
        s600: "#525252",
        s700: "#404040",
        s800: "#262626",
        s900: "#171717",
        s950: "#0a0a0a"
      },
      gray: {
        name: "Gray",
        s0: "#ffffff",
        s50: "#f9fafb",
        s100: "#f3f4f6",
        s200: "#e5e7eb",
        s300: "#d1d5db",
        s400: "#9ca3af",
        s500: "#6b7280",
        s600: "#4b5563",
        s700: "#374151",
        s800: "#1f2937",
        s900: "#111827",
        s950: "#030712"
      }
    };
  }
});

// src/components/dynamic-form.ts
var dynamic_form_exports = {};
__export(dynamic_form_exports, {
  default: () => DynamicFormIsland
});
function DynamicFormIsland(container, props) {
  injectIslandStyle("dynamic-form", CSS35);
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
var CSS35;
var init_dynamic_form = __esm({
  "src/components/dynamic-form.ts"() {
    "use strict";
    init_styles();
    init_lucide();
    CSS35 = `
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
  }
});

// src/components/splitter.ts
var splitter_exports = {};
__export(splitter_exports, {
  default: () => SplitterIsland
});
function SplitterIsland(container, props) {
  injectIslandStyle("splitter", CSS36);
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
var CSS36;
var init_splitter = __esm({
  "src/components/splitter.ts"() {
    "use strict";
    init_styles();
    init_useDragGesture();
    CSS36 = `
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
  }
});

// src/components/multiselect.ts
var multiselect_exports = {};
__export(multiselect_exports, {
  default: () => MultiSelectIsland
});
function MultiSelectIsland(container, props) {
  injectIslandStyle("multiselect", CSS37);
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
var CSS37;
var init_multiselect = __esm({
  "src/components/multiselect.ts"() {
    "use strict";
    init_styles();
    init_lucide();
    init_useDisclosure();
    init_useClickOutside();
    init_useTransition();
    CSS37 = `
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
  }
});

// src/components/cascadeselect.ts
var cascadeselect_exports = {};
__export(cascadeselect_exports, {
  default: () => CascadeSelectIsland
});
function CascadeSelectIsland(container, props) {
  injectIslandStyle("cascadeselect", CSS38);
  const options = props.options || [];
  const size = props.size || "normal";
  const variant = props.variant || "outlined";
  const showClear = props.showClear === true;
  let selectedValue = props.value || null;
  let selectedLabelText = "";
  function getNodeLabel(n) {
    return n.cname || n.name || n.label || String(n.code || n.value || "");
  }
  function getNodeValue(n) {
    return String(n.code || n.value || n.cname || n.name || n.label || "");
  }
  function getNodeChildren(n) {
    return n.children || n.items || n.states || n.cities || null;
  }
  function findNodeByValue(nodes, val) {
    for (const n of nodes) {
      const children = getNodeChildren(n);
      if (children && children.length > 0) {
        const sub = findNodeByValue(children, val);
        if (sub) return sub;
      } else if (getNodeValue(n) === String(val)) {
        return getNodeLabel(n);
      }
    }
    return null;
  }
  if (selectedValue) {
    selectedLabelText = findNodeByValue(options, selectedValue) || String(selectedValue);
  }
  container.innerHTML = `
        <div class="laughtale-cascadeselect ${props.fluid ? "fluid" : ""}">
            <!-- Trigger -->
            <div class="cs-trigger size-${size} variant-${variant} ${props.invalid ? "invalid" : ""} ${props.disabled ? "disabled" : ""}" 
                 tabindex="${props.disabled ? -1 : 0}" 
                 role="combobox" 
                 aria-expanded="false" 
                 aria-haspopup="tree">
                <span class="cs-label ${selectedLabelText ? "" : "placeholder"}">
                    ${selectedLabelText || props.placeholder || "Select a City"}
                </span>
                
                <div class="cs-actions">
                    ${props.loading ? `
                        <span class="cs-btn-icon" style="animation: spin 1s linear infinite;">
                            ${LucideIcons.loader2 || "\u23F3"}
                        </span>
                    ` : ""}

                    ${showClear ? `
                        <button type="button" class="cs-btn-icon cs-btn-clear" style="display: ${selectedLabelText ? "flex" : "none"};" title="Clear value">
                            ${LucideIcons.x}
                        </button>
                    ` : ""}

                    <span class="cs-chevron">
                        ${LucideIcons.chevronDown}
                    </span>
                </div>
            </div>

            <!-- Cascade Overlay Container -->
            <div class="cs-overlay">
                <div class="cs-panel cs-level-0"></div>
            </div>
        </div>
    `;
  const trigger = container.querySelector(".cs-trigger");
  const label = container.querySelector(".cs-label");
  const clearBtn = container.querySelector(".cs-btn-clear");
  const overlay = container.querySelector(".cs-overlay");
  const level0 = container.querySelector(".cs-level-0");
  const disclosure = useDisclosure({
    defaultIsOpen: false,
    onOpen: () => {
      overlay.style.display = "block";
      trigger.classList.add("focused");
      trigger.setAttribute("aria-expanded", "true");
      renderLevel(options, level0, 0, []);
    },
    onClose: () => {
      overlay.style.display = "none";
      trigger.classList.remove("focused");
      trigger.setAttribute("aria-expanded", "false");
    }
  });
  useClickOutside(container, () => disclosure.close());
  function updateClearButton() {
    if (!clearBtn) return;
    clearBtn.style.display = selectedLabelText && !props.disabled ? "flex" : "none";
  }
  function renderLevel(nodes, parentContainer, level, currentPath) {
    parentContainer.innerHTML = nodes.map((n, idx) => {
      const nodeLabel = getNodeLabel(n);
      const nodeVal = getNodeValue(n);
      const children = getNodeChildren(n);
      const hasChildren = children && children.length > 0;
      const isSelected = selectedValue !== null && nodeVal === String(selectedValue);
      let leadingHtml = "";
      if (n.icon && LucideIcons[n.icon]) {
        leadingHtml = `<span style="display: flex; width: 16px; height: 16px; color: var(--p-primary-600); margin-right: 0.4rem;">${LucideIcons[n.icon]}</span>`;
      } else if (n.image) {
        leadingHtml = `<img src="${n.image}" alt="" style="width: 18px; height: 18px; border-radius: 2px; margin-right: 0.4rem; object-fit: cover;" />`;
      }
      return `
                <div class="cs-item ${isSelected ? "selected" : ""} ${n.disabled ? "disabled" : ""}" 
                     data-idx="${idx}" 
                     data-val="${nodeVal}" 
                     role="treeitem" 
                     aria-expanded="false">
                    <div style="display: flex; align-items: center; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                        ${leadingHtml}
                        <span>${nodeLabel}</span>
                    </div>
                    ${hasChildren ? `
                        <span style="color: var(--p-text-muted); display: flex; width: 14px; height: 14px; margin-left: 0.5rem;">
                            ${LucideIcons.chevronRight}
                        </span>
                        <div class="cs-sub-panel cs-level-${level + 1}"></div>
                    ` : ""}
                </div>
            `;
    }).join("");
    parentContainer.querySelectorAll(":scope > .cs-item").forEach((itemEl, idx) => {
      const node = nodes[idx];
      const nodeLabel = getNodeLabel(node);
      const children = getNodeChildren(node);
      const path = [...currentPath, nodeLabel];
      if (children && children.length > 0) {
        const subPanel = itemEl.querySelector(".cs-sub-panel");
        let hideTimeout = null;
        itemEl.addEventListener("mouseenter", () => {
          clearTimeout(hideTimeout);
          parentContainer.querySelectorAll(":scope > .cs-item > .cs-sub-panel").forEach((p) => {
            if (p !== subPanel) p.style.display = "none";
          });
          renderLevel(children, subPanel, level + 1, path);
          subPanel.style.display = "block";
          const rect = subPanel.getBoundingClientRect();
          if (rect.right > window.innerWidth) {
            subPanel.style.left = "auto";
            subPanel.style.right = "calc(100% + 2px)";
          } else {
            subPanel.style.left = "calc(100% + 2px)";
            subPanel.style.right = "auto";
          }
        });
        itemEl.addEventListener("mouseleave", () => {
          hideTimeout = setTimeout(() => {
            subPanel.style.display = "none";
          }, 150);
        });
        subPanel.addEventListener("mouseenter", () => {
          clearTimeout(hideTimeout);
        });
      } else {
        itemEl.addEventListener("click", (e) => {
          e.stopPropagation();
          if (node.disabled) return;
          selectLeaf(node, path);
        });
      }
    });
  }
  function selectLeaf(node, path) {
    selectedValue = getNodeValue(node);
    selectedLabelText = getNodeLabel(node);
    label.textContent = selectedLabelText;
    label.classList.remove("placeholder");
    updateClearButton();
    disclosure.close();
    syncValue(path);
  }
  trigger.addEventListener("click", () => {
    if (props.disabled) return;
    disclosure.toggle();
  });
  trigger.addEventListener("keydown", (e) => {
    if (props.disabled) return;
    if (e.key === " " || e.key === "Enter" || e.key === "ArrowDown") {
      e.preventDefault();
      if (!disclosure.isOpen) disclosure.open();
    } else if (e.key === "Escape") {
      disclosure.close();
    }
  });
  clearBtn?.addEventListener("click", (e) => {
    e.stopPropagation();
    selectedValue = null;
    selectedLabelText = "";
    label.textContent = props.placeholder || "Select a City";
    label.classList.add("placeholder");
    updateClearButton();
    syncValue([]);
  });
  function syncValue(path) {
    if (props.targetInputName) {
      let hidden = container.querySelector(`input[name="${props.targetInputName}"]`);
      if (!hidden) {
        hidden = document.createElement("input");
        hidden.type = "hidden";
        hidden.name = props.targetInputName;
        container.appendChild(hidden);
      }
      hidden.value = selectedValue !== null ? String(selectedValue) : "";
    }
    container.dispatchEvent(new CustomEvent("cascadeselect:change", {
      bubbles: true,
      detail: { value: selectedValue, label: selectedLabelText, path }
    }));
  }
}
var CSS38;
var init_cascadeselect = __esm({
  "src/components/cascadeselect.ts"() {
    "use strict";
    init_lucide();
    init_styles();
    init_useDisclosure();
    init_useClickOutside();
    CSS38 = `
.laughtale-cascadeselect {
    position: relative;
    display: inline-flex;
    font-family: var(--p-font-family, inherit);
    box-sizing: border-box;
}
.laughtale-cascadeselect.fluid {
    width: 100%;
}
.laughtale-cascadeselect:not(.fluid) {
    width: 100%;
    max-width: 280px;
}

.cs-trigger {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    background: var(--p-surface-0);
    border: 1px solid var(--p-border-color);
    border-radius: var(--p-border-radius);
    color: var(--p-text-color);
    cursor: pointer;
    user-select: none;
    transition: border-color 0.15s ease, box-shadow 0.15s ease, background 0.15s ease;
    box-sizing: border-box;
    gap: 0.5rem;
}
.cs-trigger.variant-filled {
    background: var(--p-surface-50);
}
.cs-trigger.focused {
    border-color: var(--p-primary-500);
    box-shadow: 0 0 0 1px var(--p-primary-500);
}
.cs-trigger.invalid {
    border-color: #ef4444 !important;
    box-shadow: 0 0 0 1px #ef4444 !important;
}
.cs-trigger.disabled {
    background: var(--p-surface-100);
    opacity: 0.65;
    cursor: not-allowed;
}

/* Sizes */
.cs-trigger.size-small {
    min-height: 2rem;
    padding: 0 0.5rem;
    font-size: 0.75rem;
}
.cs-trigger.size-normal {
    min-height: 2.5rem;
    padding: 0 0.75rem;
    font-size: 0.875rem;
}
.cs-trigger.size-large {
    min-height: 3rem;
    padding: 0 1rem;
    font-size: 1rem;
}

.cs-label {
    flex: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: var(--p-text-color);
}
.cs-label.placeholder {
    color: var(--p-text-muted);
}

.cs-actions {
    display: flex;
    align-items: center;
    gap: 0.35rem;
    flex-shrink: 0;
}
.cs-btn-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    background: transparent;
    color: var(--p-text-muted);
    cursor: pointer;
    padding: 0.2rem;
    border-radius: 50%;
    transition: color 0.15s ease, background 0.15s ease;
}
.cs-btn-icon:hover {
    color: var(--p-text-color);
    background: var(--p-surface-100);
}
.cs-chevron {
    display: flex;
    align-items: center;
    color: var(--p-text-muted);
    transition: transform 0.2s ease;
}
.cs-trigger.focused .cs-chevron {
    transform: rotate(180deg);
}

/* Cascade Overlay Panels */
.cs-overlay {
    position: absolute;
    top: calc(100% + 4px);
    left: 0;
    width: 100%;
    min-width: 100%;
    z-index: 1000;
    display: none;
    box-sizing: border-box;
}

.cs-panel {
    background: var(--p-surface-0);
    border: 1px solid var(--p-border-color);
    border-radius: var(--p-border-radius);
    box-shadow: var(--p-shadow-lg);
    width: 100%;
    min-width: 100%;
    padding: 0.35rem;
    box-sizing: border-box;
}

.cs-item {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.5rem 0.75rem;
    border-radius: calc(var(--p-border-radius) - 2px);
    color: var(--p-text-color);
    cursor: pointer;
    font-size: 0.875rem;
    user-select: none;
    transition: background 150ms cubic-bezier(0.4, 0, 0.2, 1), color 150ms ease;
    gap: 0.5rem;
}
.cs-item:hover, .cs-item.highlighted {
    background: var(--p-surface-100);
}
.cs-item.selected {
    background: var(--p-primary-50);
    color: var(--p-primary-700);
    font-weight: 600;
}
.cs-item.disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.cs-sub-panel {
    display: none;
    position: absolute;
    top: 0;
    left: calc(100% + 2px);
    z-index: 1001;
    background: var(--p-surface-0);
    border: 1px solid var(--p-border-color);
    border-radius: var(--p-border-radius);
    box-shadow: var(--p-shadow-lg);
    width: 100%;
    min-width: 100%;
    padding: 0.35rem;
    box-sizing: border-box;
}

/* Dark Mode Tokens */
.dark .cs-trigger {
    background: var(--p-surface-900);
    border-color: var(--p-surface-700);
    color: var(--p-surface-0);
}
.dark .cs-trigger.variant-filled {
    background: var(--p-surface-800);
}
.dark .cs-panel, .dark .cs-sub-panel {
    background: var(--p-surface-900);
    border-color: var(--p-surface-700);
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5);
}
.dark .cs-item:hover, .dark .cs-item.highlighted {
    background: var(--p-surface-800);
    color: var(--p-surface-0);
}
.dark .cs-item.selected {
    background: rgba(16, 185, 129, 0.15);
    color: #6ee7b7;
}
`;
  }
});

// src/components/listbox.ts
var listbox_exports = {};
__export(listbox_exports, {
  default: () => ListboxIsland
});
function ListboxIsland(container, props) {
  injectIslandStyle("listbox", CSS39);
  const options = props.options || [];
  let selected = new Set(props.selectedValue !== void 0 ? [props.selectedValue] : []);
  let filterQuery = "";
  container.innerHTML = `
        <div class="laughtale-listbox" tabindex="0" style="width: 100%; max-width: 280px; border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius-lg); background: var(--p-surface-0); overflow: hidden; font-family: var(--p-font-family, inherit); outline: none;">
            ${props.filter ? `
                <div style="padding: 0.5rem 0.75rem; border-bottom: 1px solid var(--p-border-color); display: flex; align-items: center; gap: 0.5rem; background: var(--p-surface-50);">
                    <span style="color: var(--p-surface-400); display: flex;">${LucideIcons.search}</span>
                    <input type="text" class="listbox-filter-input" placeholder="Filter..." style="flex: 1; border: none; outline: none; background: transparent; font-size: 0.8125rem; color: var(--p-text-color);" />
                </div>
            ` : ""}
            <div class="listbox-items-container" style="max-height: 220px; overflow-y: auto; padding: 0.25rem 0;"></div>
        </div>
    `;
  const root = container.querySelector(".laughtale-listbox");
  const itemsContainer = container.querySelector(".listbox-items-container");
  const filterInput = container.querySelector(".listbox-filter-input");
  function getFiltered() {
    if (!filterQuery.trim()) return options;
    const q = filterQuery.toLowerCase();
    return options.filter((o) => o.label.toLowerCase().includes(q));
  }
  const keyboardNav = useKeyboardNav({
    itemCount: () => getFiltered().length,
    onHighlight: (idx) => {
      const items = itemsContainer.querySelectorAll(".listbox-item");
      items.forEach((it, i) => {
        it.style.outline = i === idx ? "2px solid var(--p-primary-500)" : "none";
        if (i === idx) it.scrollIntoView({ block: "nearest" });
      });
    },
    onSelect: (idx) => {
      const filtered = getFiltered();
      if (filtered[idx]) {
        handleItemSelect(filtered[idx].value);
      }
    }
  });
  function handleItemSelect(val) {
    if (props.multiple) {
      if (selected.has(val)) selected.delete(val);
      else selected.add(val);
    } else {
      selected.clear();
      selected.add(val);
    }
    renderList();
    syncValue();
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
        const val = el.getAttribute("data-val");
        handleItemSelect(val);
      });
    });
  }
  const debouncedFilter = useDebounce(() => {
    filterQuery = filterInput ? filterInput.value : "";
    renderList();
  }, 150);
  if (filterInput) {
    filterInput.addEventListener("input", () => debouncedFilter());
  }
  root.addEventListener("keydown", (e) => {
    keyboardNav.handleKeyDown(e);
  });
  function syncValue() {
    const valArray = Array.from(selected);
    if (props.targetInputName) {
      let hidden = container.querySelector(`input[name="${props.targetInputName}"]`);
      if (!hidden) {
        hidden = document.createElement("input");
        hidden.type = "hidden";
        hidden.name = props.targetInputName;
        container.appendChild(hidden);
      }
      hidden.value = props.multiple ? JSON.stringify(valArray) : valArray[0] !== void 0 ? String(valArray[0]) : "";
    }
    container.dispatchEvent(new CustomEvent("listbox:change", {
      bubbles: true,
      detail: { value: props.multiple ? valArray : valArray[0] }
    }));
  }
  renderList();
  syncValue();
}
var CSS39;
var init_listbox = __esm({
  "src/components/listbox.ts"() {
    "use strict";
    init_styles();
    init_lucide();
    init_useKeyboardNav();
    init_useDebounce();
    CSS39 = `
[data-theme="dark"] .laughtale-listbox {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
[data-theme="dark"] .listbox-filter-input {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
[data-theme="dark"] .listbox-items-container {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
[data-theme="dark"] .listbox-item {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
`;
  }
});

// src/components/picklist.ts
var picklist_exports = {};
__export(picklist_exports, {
  default: () => PickListIsland
});
function PickListIsland(container, props) {
  injectIslandStyle("picklist", CSS40);
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
                        ${sourceList.map((it) => `
                            <div class="picklist-item source-item ${selectedSource.has(it.id) ? "active" : ""}" data-id="${it.id}" style="padding: 0.45rem 0.75rem; cursor: pointer; font-size: 0.8125rem; background: ${selectedSource.has(it.id) ? "var(--p-primary-50)" : "transparent"}; color: ${selectedSource.has(it.id) ? "var(--p-primary-700)" : "var(--p-text-color)"}; font-weight: ${selectedSource.has(it.id) ? "600" : "normal"}; transition: all 0.15s ease;">
                                ${it.name}
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
                        ${targetList.map((it) => `
                            <div class="picklist-item target-item ${selectedTarget.has(it.id) ? "active" : ""}" data-id="${it.id}" style="padding: 0.45rem 0.75rem; cursor: pointer; font-size: 0.8125rem; background: ${selectedTarget.has(it.id) ? "var(--p-primary-50)" : "transparent"}; color: ${selectedTarget.has(it.id) ? "var(--p-primary-700)" : "var(--p-text-color)"}; font-weight: ${selectedTarget.has(it.id) ? "600" : "normal"}; transition: all 0.15s ease;">
                                ${it.name}
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
      const moving = sourceList.filter((it) => selectedSource.has(it.id));
      targetList = [...targetList, ...moving];
      sourceList = sourceList.filter((it) => !selectedSource.has(it.id));
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
      const moving = targetList.filter((it) => selectedTarget.has(it.id));
      sourceList = [...sourceList, ...moving];
      targetList = targetList.filter((it) => !selectedTarget.has(it.id));
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
      hidden.value = JSON.stringify(targetList.map((it) => it.id));
    }
    container.dispatchEvent(new CustomEvent("picklist:change", {
      bubbles: true,
      detail: { source: sourceList, target: targetList }
    }));
  }
  render();
  syncValues();
}
var CSS40;
var init_picklist = __esm({
  "src/components/picklist.ts"() {
    "use strict";
    init_styles();
    init_lucide();
    init_useAutoAnimate();
    CSS40 = `
[data-theme="dark"] .laughtale-picklist {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
[data-theme="dark"] .picklist-source-list {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
[data-theme="dark"] .picklist-item {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
[data-theme="dark"] .source-item {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
[data-theme="dark"] .btn-move-to-target {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
[data-theme="dark"] .btn-move-all-to-target {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
[data-theme="dark"] .btn-move-to-source {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
[data-theme="dark"] .btn-move-all-to-source {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
[data-theme="dark"] .picklist-target-list {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
[data-theme="dark"] .target-item {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
`;
  }
});

// src/components/orderlist.ts
var orderlist_exports = {};
__export(orderlist_exports, {
  default: () => OrderListIsland
});
function OrderListIsland(container, props) {
  injectIslandStyle("orderlist", CSS41);
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
                        ${items.map((it, idx) => `
                            <div class="orderlist-item ${selectedIndex === idx ? "active" : ""}" data-index="${idx}" style="display: flex; align-items: center; justify-content: space-between; padding: 0.5rem 0.875rem; cursor: pointer; font-size: 0.8125rem; background: ${selectedIndex === idx ? "var(--p-primary-50)" : "transparent"}; color: ${selectedIndex === idx ? "var(--p-primary-700)" : "var(--p-text-color)"}; font-weight: ${selectedIndex === idx ? "600" : "normal"}; transition: all 0.15s ease;">
                                <span>${it.name}</span>
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
      const it = items.splice(selectedIndex, 1)[0];
      items.unshift(it);
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
      const it = items.splice(selectedIndex, 1)[0];
      items.push(it);
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
      hidden.value = JSON.stringify(items.map((it) => it.id));
    }
    container.dispatchEvent(new CustomEvent("orderlist:change", {
      bubbles: true,
      detail: { items }
    }));
  }
  render();
  syncValues();
}
var CSS41;
var init_orderlist = __esm({
  "src/components/orderlist.ts"() {
    "use strict";
    init_styles();
    init_useAutoAnimate();
    CSS41 = `
[data-theme="dark"] .laughtale-orderlist {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
[data-theme="dark"] .btn-order-top {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
[data-theme="dark"] .btn-order-up {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
[data-theme="dark"] .btn-order-down {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
[data-theme="dark"] .btn-order-bottom {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
[data-theme="dark"] .orderlist-items-container {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
[data-theme="dark"] .orderlist-item {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
`;
  }
});

// src/components/orgchart.ts
var orgchart_exports = {};
__export(orgchart_exports, {
  default: () => OrgChartIsland
});
function OrgChartIsland(container, props) {
  injectIslandStyle("orgchart", CSS42);
  const rootNode = props.value || {
    key: "0",
    label: "Chief Technology Officer",
    title: "Executive Leadership",
    children: [
      {
        key: "0_0",
        label: "Engineering Director",
        title: "Core Infrastructure",
        children: [
          { key: "0_0_0", label: "Kernel Lead", title: "Compiler & Runtime" },
          { key: "0_0_1", label: "Security Lead", title: "Zero-Trust Protocol" }
        ]
      },
      {
        key: "0_1",
        label: "Product Director",
        title: "Developer Experience",
        children: [
          { key: "0_1_0", label: "Design System Lead", title: "Aura Theme Engine" }
        ]
      }
    ]
  };
  function renderNode(node) {
    const hasChildren = node.children && node.children.length > 0;
    return `
            <table class="orgchart-node-table" style="border-collapse: separate; border-spacing: 0; margin: 0 auto;">
                <tr>
                    <td colspan="${hasChildren ? node.children.length * 2 : 2}" align="center" style="padding-bottom: 1rem;">
                        <div class="orgchart-node-card" data-key="${node.key}" style="background: var(--p-surface-0); border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius); padding: 0.75rem 1rem; box-shadow: var(--p-shadow-sm); cursor: pointer; min-width: 140px; text-align: center; transition: all 0.15s ease;">
                            <div style="font-size: 0.8125rem; font-weight: 700; color: var(--p-surface-900);">${node.label}</div>
                            ${node.title ? `<div style="font-size: 0.6875rem; color: var(--p-primary-600); font-weight: 600; margin-top: 0.15rem;">${node.title}</div>` : ""}
                        </div>
                    </td>
                </tr>
                ${hasChildren ? `
                    <tr>
                        <td colspan="${node.children.length * 2}" align="center">
                            <div style="width: 1px; height: 16px; background: var(--p-border-color); margin: 0 auto;"></div>
                        </td>
                    </tr>
                    <tr>
                        ${node.children.map((child, idx) => {
      const isFirst = idx === 0;
      const isLast = idx === node.children.length - 1;
      const isOnly = node.children.length === 1;
      return `
                                <td align="center" style="border-top: ${isOnly ? "none" : isFirst ? "none" : "1px solid var(--p-border-color)"}; border-right: ${isOnly || isLast ? "none" : "1px solid var(--p-border-color)"}; padding: 0 0.5rem;">
                                    <div style="width: 1px; height: 16px; background: var(--p-border-color); margin: 0 auto;"></div>
                                    ${renderNode(child)}
                                </td>
                            `;
    }).join("")}
                    </tr>
                ` : ""}
            </table>
        `;
  }
  container.innerHTML = `
        <div class="laughtale-orgchart" style="width: 100%; overflow-x: auto; padding: 1.5rem; background: var(--p-surface-50); border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius-lg); font-family: var(--p-font-family, inherit);">
            ${renderNode(rootNode)}
        </div>
    `;
  container.querySelectorAll(".orgchart-node-card").forEach((el) => {
    el.addEventListener("click", () => {
      const key = el.getAttribute("data-key");
      container.dispatchEvent(new CustomEvent("orgchart:select", {
        bubbles: true,
        detail: { key }
      }));
    });
  });
}
var CSS42;
var init_orgchart = __esm({
  "src/components/orgchart.ts"() {
    "use strict";
    init_styles();
    CSS42 = `
[data-theme="dark"] .orgchart-node-table {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
[data-theme="dark"] .orgchart-node-card {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
[data-theme="dark"] .laughtale-orgchart {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
`;
  }
});

// src/components/terminal.ts
var terminal_exports = {};
__export(terminal_exports, {
  default: () => TerminalIsland
});
function TerminalIsland(container, props) {
  injectIslandStyle("terminal", CSS43);
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
var CSS43;
var init_terminal = __esm({
  "src/components/terminal.ts"() {
    "use strict";
    init_styles();
    init_useClipboard();
    CSS43 = `
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
  }
});

// src/components/dock.ts
var dock_exports = {};
__export(dock_exports, {
  default: () => DockIsland
});
function DockIsland(container, props) {
  injectIslandStyle("dock", CSS44);
  const items = props.items || [
    { label: "Overview", icon: "compass", url: "/" },
    { label: "Dashboard", icon: "bar-chart", url: "/dashboard" },
    { label: "Directives", icon: "sliders", url: "/enterprise" },
    { label: "Docs", icon: "file-text", url: "/doc/01-getting-started" },
    { label: "Theme Studio", icon: "palette", action: "open-studio" }
  ];
  container.innerHTML = `
        <div class="laughtale-dock" style="display: inline-flex; align-items: center; gap: 0.75rem; background: rgba(255, 255, 255, 0.85); dark:bg-slate-900; backdrop-filter: blur(12px); border: 1px solid var(--p-border-color); border-radius: 9999px; padding: 0.5rem 1rem; box-shadow: var(--p-shadow-lg);">
            ${items.map((it) => {
    const iconSvg = LucideIcons[it.icon] || LucideIcons.terminal;
    return `
                    <button type="button" 
                            class="dock-item-btn" 
                            data-action="${it.action || ""}" 
                            data-url="${it.url || ""}"
                            title="${it.label}"
                            style="width: 2.75rem; height: 2.75rem; border-radius: 9999px; border: 1px solid var(--p-border-color); background: var(--p-surface-0); color: var(--p-surface-700); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: transform 0.2s cubic-bezier(0.2, 0, 0, 1), box-shadow 0.2s ease;">
                        ${iconSvg}
                    </button>
                `;
  }).join("")}
        </div>
    `;
  container.querySelectorAll(".dock-item-btn").forEach((btn) => {
    btn.addEventListener("mouseenter", () => {
      btn.style.transform = "scale(1.3) translateY(-4px)";
      btn.style.boxShadow = "0 10px 15px -3px rgba(0,0,0,0.15)";
    });
    btn.addEventListener("mouseleave", () => {
      btn.style.transform = "none";
      btn.style.boxShadow = "none";
    });
    btn.addEventListener("click", () => {
      const url = btn.getAttribute("data-url");
      const action = btn.getAttribute("data-action");
      if (url) window.location.href = url;
      else if (action === "open-studio") document.dispatchEvent(new CustomEvent("studio:open"));
    });
  });
}
var CSS44;
var init_dock = __esm({
  "src/components/dock.ts"() {
    "use strict";
    init_styles();
    init_lucide();
    CSS44 = `
[data-theme="dark"] .laughtale-dock {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
[data-theme="dark"] .dock-item-btn {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
`;
  }
});

// src/components/galleria.ts
var galleria_exports = {};
__export(galleria_exports, {
  default: () => GalleriaIsland
});
function GalleriaIsland(container, props) {
  injectIslandStyle("galleria", CSS45);
  const images = props.value && props.value.length > 0 ? props.value : [
    {
      itemImageSrc: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&auto=format&fit=crop&q=80",
      thumbnailImageSrc: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=120&auto=format&fit=crop&q=80",
      alt: "Aurora Spectrum Wave",
      title: "Telemetry Cluster Spectrum"
    },
    {
      itemImageSrc: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=80",
      thumbnailImageSrc: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=120&auto=format&fit=crop&q=80",
      alt: "Zero-Trust Shield Gateway",
      title: "HSM Cryptographic Core"
    },
    {
      itemImageSrc: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80",
      thumbnailImageSrc: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=120&auto=format&fit=crop&q=80",
      alt: "Kernel Micro-Architecture",
      title: "High-Performance Engine"
    }
  ];
  let activeIndex = 0;
  function render() {
    const current = images[activeIndex];
    container.innerHTML = `
            <div class="laughtale-galleria" style="width: 100%; max-width: 640px; border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius-lg); overflow: hidden; background: var(--p-surface-0); font-family: var(--p-font-family, inherit);">
                <!-- Main Image Stage -->
                <div style="position: relative; width: 100%; height: 320px; background: #020617; overflow: hidden; display: flex; align-items: center; justify-content: center;">
                    <img src="${current.itemImageSrc}" alt="${current.alt}" style="width: 100%; height: 100%; object-fit: cover; transition: opacity 0.25s ease;" />
                    
                    <!-- Prev / Next Nav Buttons -->
                    <button type="button" class="galleria-prev-btn" style="position: absolute; left: 0.75rem; top: 50%; transform: translateY(-50%); width: 2.25rem; height: 2.25rem; border-radius: 9999px; background: rgba(0,0,0,0.5); color: #ffffff; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center;">
                        <span style="transform: rotate(90deg); display: flex;">${LucideIcons.chevronDown}</span>
                    </button>
                    <button type="button" class="galleria-next-btn" style="position: absolute; right: 0.75rem; top: 50%; transform: translateY(-50%); width: 2.25rem; height: 2.25rem; border-radius: 9999px; background: rgba(0,0,0,0.5); color: #ffffff; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center;">
                        <span style="transform: rotate(-90deg); display: flex;">${LucideIcons.chevronDown}</span>
                    </button>

                    <!-- Caption Bar -->
                    <div style="position: absolute; bottom: 0; left: 0; right: 0; background: linear-gradient(transparent, rgba(0,0,0,0.8)); padding: 1rem; color: #ffffff;">
                        <div style="font-size: 0.875rem; font-weight: 700;">${current.title || current.alt}</div>
                    </div>
                </div>

                <!-- Thumbnail Strip -->
                <div style="display: flex; gap: 0.5rem; padding: 0.75rem; background: var(--p-surface-50); overflow-x: auto;">
                    ${images.map((img, idx) => `
                        <div class="galleria-thumb ${idx === activeIndex ? "active" : ""}" data-index="${idx}" style="flex: 0 0 72px; height: 48px; border-radius: 4px; overflow: hidden; border: ${idx === activeIndex ? "2px solid var(--p-primary-600)" : "2px solid transparent"}; cursor: pointer; opacity: ${idx === activeIndex ? "1" : "0.6"}; transition: all 0.15s ease;">
                            <img src="${img.thumbnailImageSrc}" alt="${img.alt}" style="width: 100%; height: 100%; object-fit: cover;" />
                        </div>
                    `).join("")}
                </div>
            </div>
        `;
    bindEvents();
  }
  function bindEvents() {
    container.querySelector(".galleria-prev-btn")?.addEventListener("click", () => {
      activeIndex = (activeIndex - 1 + images.length) % images.length;
      render();
    });
    container.querySelector(".galleria-next-btn")?.addEventListener("click", () => {
      activeIndex = (activeIndex + 1) % images.length;
      render();
    });
    container.querySelectorAll(".galleria-thumb").forEach((thumb) => {
      thumb.addEventListener("click", () => {
        activeIndex = Number(thumb.getAttribute("data-index"));
        render();
      });
    });
  }
  render();
}
var CSS45;
var init_galleria = __esm({
  "src/components/galleria.ts"() {
    "use strict";
    init_styles();
    init_lucide();
    CSS45 = `
[data-theme="dark"] .laughtale-galleria {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
[data-theme="dark"] .galleria-prev-btn {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
[data-theme="dark"] .galleria-next-btn {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
[data-theme="dark"] .galleria-thumb {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
`;
  }
});

// src/components/blockui.ts
var blockui_exports = {};
__export(blockui_exports, {
  default: () => BlockUIIsland
});
function BlockUIIsland(container, props) {
  injectIslandStyle("blockui", CSS46);
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
var CSS46;
var init_blockui = __esm({
  "src/components/blockui.ts"() {
    "use strict";
    init_styles();
    CSS46 = `
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
  }
});

// src/components/split-button.ts
var split_button_exports = {};
__export(split_button_exports, {
  default: () => SplitButtonIsland
});
function SplitButtonIsland(container, props) {
  injectIslandStyle("split-button", CSS47);
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
                ${items.map((it) => `
                    <div class="splitbutton-menu-item" data-action="${it.action || ""}" data-url="${it.url || ""}" style="display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 0.875rem; cursor: pointer; font-size: 0.8125rem; color: var(--p-text-color); transition: background 0.1s ease;">
                        <span>${it.label}</span>
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
var CSS47;
var init_split_button = __esm({
  "src/components/split-button.ts"() {
    "use strict";
    init_styles();
    init_lucide();
    init_useDisclosure();
    init_useClickOutside();
    init_useTransition();
    CSS47 = `
[data-theme="dark"] .splitbutton-main-btn {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
[data-theme="dark"] .splitbutton-menu-btn {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
[data-theme="dark"] .splitbutton-menu-overlay {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
[data-theme="dark"] .splitbutton-menu-item {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
`;
  }
});

// src/components/select.ts
var select_exports = {};
__export(select_exports, {
  default: () => SelectIsland
});
function SelectIsland(container, props) {
  injectIslandStyle("laughtale-select", CSS48);
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
var CSS48;
var init_select = __esm({
  "src/components/select.ts"() {
    "use strict";
    init_styles();
    init_lucide();
    CSS48 = `
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
  }
});

// src/components/checkbox.ts
var checkbox_exports = {};
__export(checkbox_exports, {
  default: () => CheckboxIsland
});
function CheckboxIsland(container, props) {
  injectIslandStyle("laughtale-checkbox", CSS49);
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
var CSS49;
var init_checkbox = __esm({
  "src/components/checkbox.ts"() {
    "use strict";
    init_styles();
    init_lucide();
    CSS49 = `
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
  }
});

// src/components/radio-button.ts
var radio_button_exports = {};
__export(radio_button_exports, {
  default: () => RadioButtonIsland
});
function RadioButtonIsland(container, props) {
  injectIslandStyle("laughtale-radio", CSS50);
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
var CSS50;
var init_radio_button = __esm({
  "src/components/radio-button.ts"() {
    "use strict";
    init_styles();
    CSS50 = `
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
[data-theme="dark"] .laughtale-radio-circle {
    background: var(--p-surface-900);
    border-color: var(--p-surface-600);
}
[data-theme="dark"] .laughtale-radio-label {
    color: var(--p-surface-200);
}
`;
  }
});

// src/components/textarea.ts
var textarea_exports = {};
__export(textarea_exports, {
  default: () => TextareaIsland
});
function TextareaIsland(container, props) {
  injectIslandStyle("laughtale-textarea", CSS51);
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
var CSS51;
var init_textarea = __esm({
  "src/components/textarea.ts"() {
    "use strict";
    init_styles();
    CSS51 = `
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
[data-theme="dark"] .laughtale-textarea {
    background: var(--p-surface-900);
    color: var(--p-surface-100);
    border-color: var(--p-surface-600);
}
[data-theme="dark"] .laughtale-textarea:disabled {
    background: var(--p-surface-800);
}
`;
  }
});

// src/components/input-mask.ts
var input_mask_exports = {};
__export(input_mask_exports, {
  default: () => InputMaskIsland
});
function InputMaskIsland(container, props) {
  injectIslandStyle("laughtale-input-mask", CSS52);
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
                value="${currentValue}"
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
      if (input.value !== currentValue) {
        input.value = currentValue;
      }
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
var CSS52;
var init_input_mask = __esm({
  "src/components/input-mask.ts"() {
    "use strict";
    init_styles();
    CSS52 = `
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
[data-theme="dark"] .laughtale-input-mask {
    background: var(--p-surface-900);
    color: var(--p-surface-100);
    border-color: var(--p-surface-600);
}
[data-theme="dark"] .laughtale-input-mask:disabled {
    background: var(--p-surface-800);
}
`;
  }
});

// src/components/float-label.ts
var float_label_exports = {};
__export(float_label_exports, {
  default: () => FloatLabelIsland
});
function FloatLabelIsland(container, props) {
  injectIslandStyle("laughtale-float-label", CSS53);
  const variant = props.variant || "over";
  const initialHtml = container.innerHTML;
  const forAttr = props.for ? `for="${props.for}"` : "";
  const existingLabel = container.querySelector("label");
  const labelText = props.label || (existingLabel ? existingLabel.textContent : "Label");
  container.innerHTML = `
        <div class="laughtale-float-label laughtale-float-label-${variant} ${props.invalid ? "invalid" : ""}">
            ${initialHtml}
            ${!existingLabel && labelText ? `<label ${forAttr}>${labelText}</label>` : ""}
        </div>
    `;
  const wrap = container.querySelector(".laughtale-float-label");
  const labelEl = wrap.querySelector("label");
  const findTarget = () => {
    return wrap.querySelector("input, textarea, select, .cs-trigger, .dp-trigger, .ac-input, .p-inputtags-input, .p-password-input");
  };
  function updateFloatingState() {
    const input = wrap.querySelector('input:not([type="hidden"]), textarea, select');
    const customText = wrap.querySelector(".cs-label:not(.placeholder), .dp-label:not(.placeholder), .ac-input");
    const tags = wrap.querySelectorAll(".p-inputtags-tag, .chip-item, .p-chip");
    let hasVal = false;
    if (input && input.value && input.value.trim().length > 0) {
      hasVal = true;
    } else if (customText && customText.textContent && customText.textContent.trim().length > 0 && !customText.classList.contains("placeholder")) {
      hasVal = true;
    } else if (tags.length > 0) {
      hasVal = true;
    }
    const currentlyHas = wrap.classList.contains("has-value");
    if (currentlyHas !== hasVal) {
      if (hasVal) {
        wrap.classList.add("has-value");
      } else {
        wrap.classList.remove("has-value");
      }
    }
  }
  labelEl?.addEventListener("click", () => {
    const target = findTarget();
    if (target) {
      target.focus();
      if (typeof target.click === "function" && !target.matches("input, textarea")) {
        target.click();
      }
    }
  });
  wrap.addEventListener("input", updateFloatingState);
  wrap.addEventListener("change", updateFloatingState);
  wrap.addEventListener("focusin", () => {
    wrap.classList.add("is-focused");
    updateFloatingState();
  });
  wrap.addEventListener("focusout", () => {
    wrap.classList.remove("is-focused");
    updateFloatingState();
  });
  wrap.addEventListener("inputtags:change", updateFloatingState);
  wrap.addEventListener("chips:change", updateFloatingState);
  wrap.addEventListener("tags:add", updateFloatingState);
  wrap.addEventListener("tags:remove", updateFloatingState);
  wrap.addEventListener("password:change", updateFloatingState);
  wrap.addEventListener("otp:change", updateFloatingState);
  wrap.addEventListener("cascadeselect:change", updateFloatingState);
  wrap.addEventListener("datepicker:change", updateFloatingState);
  wrap.addEventListener("autocomplete:change", updateFloatingState);
  wrap.addEventListener("select:change", updateFloatingState);
  const observer = new MutationObserver(() => {
    updateFloatingState();
  });
  observer.observe(wrap, { childList: true, subtree: true });
  updateFloatingState();
  setTimeout(updateFloatingState, 50);
  setTimeout(updateFloatingState, 200);
}
var CSS53;
var init_float_label = __esm({
  "src/components/float-label.ts"() {
    "use strict";
    init_styles();
    CSS53 = `
.laughtale-float-label {
    position: relative;
    display: inline-flex;
    flex-direction: column;
    width: 100%;
    margin-top: 1rem;
    font-family: var(--p-font-family, inherit);
    box-sizing: border-box;
}

.laughtale-float-label > label {
    position: absolute;
    left: 0.75rem;
    color: var(--p-text-muted);
    font-size: 0.875rem;
    font-weight: 500;
    pointer-events: none;
    transition: all 150ms cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 10;
    line-height: 1;
    user-select: none;
}

/* Variant: over (Floats completely above the input) */
.laughtale-float-label-over > label {
    top: 50%;
    transform: translateY(-50%);
}
.laughtale-float-label-over.has-value > label,
.laughtale-float-label-over:focus-within > label {
    top: -1.25rem;
    left: 0.15rem;
    transform: translateY(0);
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--p-primary-500);
}

/* Variant: on (Floats on the top border line with surface pill masking) */
.laughtale-float-label-on > label {
    top: 50%;
    transform: translateY(-50%);
    background: var(--p-surface-0);
    padding: 0 0.35rem;
    border-radius: 2px;
}
.laughtale-float-label-on.has-value > label,
.laughtale-float-label-on:focus-within > label {
    top: 0;
    transform: translateY(-50%);
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--p-primary-500);
    z-index: 15;
}

/* Variant: in (Infield top-aligned label) */
.laughtale-float-label-in > label {
    top: 50%;
    transform: translateY(-50%);
}
.laughtale-float-label-in.has-value > label,
.laughtale-float-label-in:focus-within > label {
    top: 0.35rem;
    transform: translateY(0);
    font-size: 0.6875rem;
    font-weight: 600;
    color: var(--p-primary-500);
}
.laughtale-float-label-in input,
.laughtale-float-label-in .p-input,
.laughtale-float-label-in .p-password-container,
.laughtale-float-label-in .p-inputtags,
.laughtale-float-label-in .cs-trigger,
.laughtale-float-label-in .dp-trigger,
.laughtale-float-label-in .ac-input-container {
    padding-top: 1.25rem !important;
    padding-bottom: 0.25rem !important;
}

.laughtale-float-label-in .p-inputtags input,
.laughtale-float-label-in .p-password-container input,
.laughtale-float-label-in .p-inputgroup input {
    padding-top: 0.1875rem !important;
    padding-bottom: 0.1875rem !important;
    min-height: auto !important;
}

/* Invalid State */
.laughtale-float-label.invalid > label,
.laughtale-float-label:has(.invalid) > label,
.laughtale-float-label:has(.is-invalid) > label,
.laughtale-float-label:has(:invalid) > label {
    color: var(--p-red-500, #ef4444) !important;
}

/* Dark Mode Tokens */
.dark .laughtale-float-label > label {
    color: var(--p-surface-400);
}
.dark .laughtale-float-label-on > label {
    background: var(--p-surface-900);
}
.dark .laughtale-float-label.has-value > label,
.dark .laughtale-float-label:focus-within > label {
    color: var(--p-primary-400);
}
.dark .laughtale-float-label.invalid > label,
.dark .laughtale-float-label:has(.invalid) > label,
.dark .laughtale-float-label:has(.is-invalid) > label,
.dark .laughtale-float-label:has(:invalid) > label {
    color: #f87171 !important;
}
`;
  }
});

// src/components/ifta-label.ts
var ifta_label_exports = {};
__export(ifta_label_exports, {
  default: () => IftaLabelIsland
});
function IftaLabelIsland(container, props) {
  injectIslandStyle("laughtale-ifta-label", CSS54);
  const initialHtml = container.innerHTML;
  const forAttr = props.for ? `for="${props.for}"` : "";
  const existingLabel = container.querySelector("label");
  const labelText = props.label || (existingLabel ? existingLabel.textContent : "Label");
  container.innerHTML = `
        <div class="laughtale-ifta-label ${props.invalid ? "invalid" : ""}">
            ${initialHtml}
            ${!existingLabel && labelText ? `<label ${forAttr}>${labelText}</label>` : ""}
        </div>
    `;
  const wrap = container.querySelector(".laughtale-ifta-label");
  const labelEl = wrap.querySelector("label");
  labelEl?.addEventListener("click", () => {
    const input = wrap.querySelector("input, textarea, select, .cs-trigger, .dp-trigger, .ac-input, .p-inputtags-input, .p-password-input");
    if (input) {
      input.focus();
      if (typeof input.click === "function" && !input.matches("input, textarea")) {
        input.click();
      }
    }
  });
}
var CSS54;
var init_ifta_label = __esm({
  "src/components/ifta-label.ts"() {
    "use strict";
    init_styles();
    CSS54 = `
.laughtale-ifta-label {
    position: relative;
    display: inline-flex;
    flex-direction: column;
    width: 100%;
    font-family: var(--p-font-family, inherit);
    box-sizing: border-box;
}

.laughtale-ifta-label > label {
    position: absolute;
    top: 0.4rem;
    left: 0.75rem;
    color: var(--p-text-muted);
    font-size: 0.6875rem;
    font-weight: 600;
    pointer-events: none;
    transition: color 150ms cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 10;
    line-height: 1;
    user-select: none;
}

.laughtale-ifta-label input,
.laughtale-ifta-label textarea,
.laughtale-ifta-label select,
.laughtale-ifta-label .p-input,
.laughtale-ifta-label .p-password-container,
.laughtale-ifta-label .p-inputtags,
.laughtale-ifta-label .cs-trigger,
.laughtale-ifta-label .dp-trigger,
.laughtale-ifta-label .ac-input-container {
    padding-top: 1.35rem !important;
    padding-bottom: 0.35rem !important;
    min-height: 3rem !important;
    font-size: 0.875rem !important;
    box-sizing: border-box;
}

.laughtale-ifta-label .p-inputtags input,
.laughtale-ifta-label .p-password-container input,
.laughtale-ifta-label .p-inputgroup input {
    padding-top: 0.1875rem !important;
    padding-bottom: 0.1875rem !important;
    min-height: auto !important;
}

/* Focus State */
.laughtale-ifta-label:focus-within > label {
    color: var(--p-primary-500);
}

/* Invalid State */
.laughtale-ifta-label.invalid > label,
.laughtale-ifta-label:has(.invalid) > label,
.laughtale-ifta-label:has(.is-invalid) > label,
.laughtale-ifta-label:has(:invalid) > label {
    color: var(--p-red-500, #ef4444) !important;
}

/* Dark Mode Tokens */
.dark .laughtale-ifta-label > label {
    color: var(--p-surface-400);
}
.dark .laughtale-ifta-label:focus-within > label {
    color: var(--p-primary-400);
}
.dark .laughtale-ifta-label.invalid > label,
.dark .laughtale-ifta-label:has(.invalid) > label,
.dark .laughtale-ifta-label:has(.is-invalid) > label,
.dark .laughtale-ifta-label:has(:invalid) > label {
    color: #f87171 !important;
}
`;
  }
});

// src/components/input-group.ts
var input_group_exports = {};
__export(input_group_exports, {
  InputGroupAddonIsland: () => InputGroupAddonIsland,
  default: () => InputGroupIsland
});
function InputGroupIsland(container, props) {
  injectIslandStyle("laughtale-inputgroup", CSS55);
  container.classList.add("laughtale-inputgroup", "p-inputgroup");
  if (props.size) {
    container.classList.add(`size-${props.size}`);
  }
}
function InputGroupAddonIsland(container, props) {
  injectIslandStyle("laughtale-inputgroup", CSS55);
  container.classList.add("laughtale-inputgroup-addon", "p-inputgroup-addon");
  if (props.icon && !container.querySelector("svg")) {
    const svg = getLucideIcon(props.icon);
    if (svg) {
      container.insertAdjacentHTML("afterbegin", svg);
    }
  }
  if (props.text && !container.querySelector("span") && !container.textContent?.trim()) {
    container.insertAdjacentHTML("beforeend", `<span>${props.text}</span>`);
  }
}
var CSS55;
var init_input_group = __esm({
  "src/components/input-group.ts"() {
    "use strict";
    init_styles();
    init_lucide();
    CSS55 = `
.laughtale-inputgroup,
.p-inputgroup {
    display: flex;
    align-items: stretch;
    width: 100%;
    height: 2.5rem;
    min-height: 2.5rem;
    font-family: var(--p-font-family, inherit);
    box-sizing: border-box;
    position: relative;
}

/* FloatLabel over spacing on inputgroup */
.laughtale-inputgroup:has(.laughtale-float-label-over),
.p-inputgroup:has(.laughtale-float-label-over) {
    margin-top: 1rem;
}

/* All direct children and island root elements inside inputgroup */
.laughtale-inputgroup > *,
.p-inputgroup > * {
    border-radius: 0 !important;
    margin: 0 0 0 -1px !important;
    box-sizing: border-box;
    height: 100% !important;
    min-height: 100% !important;
    display: flex;
    align-items: stretch;
    flex-shrink: 0;
}

/* Flexible inputs / float labels fill remaining width */
.laughtale-inputgroup > input,
.laughtale-inputgroup > .p-input,
.laughtale-inputgroup > [data-island="float-label"],
.laughtale-inputgroup > [data-island="ifta-label"],
.laughtale-inputgroup > [data-island="select"],
.laughtale-inputgroup > [data-island="datepicker"],
.laughtale-inputgroup > [data-island="autocomplete"],
.laughtale-inputgroup > [data-island="cascadeselect"],
.p-inputgroup > input,
.p-inputgroup > .p-input,
.p-inputgroup > [data-island="float-label"],
.p-inputgroup > [data-island="ifta-label"],
.p-inputgroup > [data-island="select"],
.p-inputgroup > [data-island="datepicker"],
.p-inputgroup > [data-island="autocomplete"],
.p-inputgroup > [data-island="cascadeselect"] {
    flex: 1 1 auto;
    width: 1%;
}

/* First child outer corners */
.laughtale-inputgroup > *:first-child,
.p-inputgroup > *:first-child {
    margin-left: 0 !important;
    border-top-left-radius: var(--p-border-radius) !important;
    border-bottom-left-radius: var(--p-border-radius) !important;
}

/* Last child outer corners */
.laughtale-inputgroup > *:last-child,
.p-inputgroup > *:last-child {
    border-top-right-radius: var(--p-border-radius) !important;
    border-bottom-right-radius: var(--p-border-radius) !important;
}

/* Only child */
.laughtale-inputgroup > *:only-child,
.p-inputgroup > *:only-child {
    border-radius: var(--p-border-radius) !important;
}

/* Inner inputs, triggers, select boxes, and buttons corner & height overrides */
.laughtale-inputgroup input,
.laughtale-inputgroup textarea,
.laughtale-inputgroup .p-input,
.laughtale-inputgroup .cs-trigger,
.laughtale-inputgroup .dp-trigger,
.laughtale-inputgroup .laughtale-select,
.laughtale-inputgroup .laughtale-select-trigger,
.laughtale-inputgroup .p-button,
.p-inputgroup input,
.p-inputgroup textarea,
.p-inputgroup .p-input,
.p-inputgroup .cs-trigger,
.p-inputgroup .dp-trigger,
.p-inputgroup .laughtale-select,
.p-inputgroup .laughtale-select-trigger,
.p-inputgroup .p-button {
    border-radius: 0 !important;
    height: 100% !important;
    min-height: 100% !important;
    box-sizing: border-box;
    margin: 0 !important;
}

.laughtale-inputgroup > *:first-child input,
.laughtale-inputgroup > *:first-child textarea,
.laughtale-inputgroup > *:first-child .p-input,
.laughtale-inputgroup > *:first-child .cs-trigger,
.laughtale-inputgroup > *:first-child .dp-trigger,
.laughtale-inputgroup > *:first-child .laughtale-select-trigger,
.laughtale-inputgroup > *:first-child.p-button,
.p-inputgroup > *:first-child input,
.p-inputgroup > *:first-child textarea,
.p-inputgroup > *:first-child .p-input,
.p-inputgroup > *:first-child .cs-trigger,
.p-inputgroup > *:first-child .dp-trigger,
.p-inputgroup > *:first-child .laughtale-select-trigger,
.p-inputgroup > *:first-child.p-button {
    border-top-left-radius: var(--p-border-radius) !important;
    border-bottom-left-radius: var(--p-border-radius) !important;
}

.laughtale-inputgroup > *:last-child input,
.laughtale-inputgroup > *:last-child textarea,
.laughtale-inputgroup > *:last-child .p-input,
.laughtale-inputgroup > *:last-child .cs-trigger,
.laughtale-inputgroup > *:last-child .dp-trigger,
.laughtale-inputgroup > *:last-child .laughtale-select-trigger,
.laughtale-inputgroup > *:last-child.p-button,
.p-inputgroup > *:last-child input,
.p-inputgroup > *:last-child textarea,
.p-inputgroup > *:last-child .p-input,
.p-inputgroup > *:last-child .cs-trigger,
.p-inputgroup > *:last-child .dp-trigger,
.p-inputgroup > *:last-child .laughtale-select-trigger,
.p-inputgroup > *:last-child.p-button {
    border-top-right-radius: var(--p-border-radius) !important;
    border-bottom-right-radius: var(--p-border-radius) !important;
}

/* Addon Styling */
.laughtale-inputgroup-addon,
.p-inputgroup-addon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0 0.85rem;
    background: var(--p-surface-50);
    color: var(--p-text-muted);
    border: 1px solid var(--p-border-color);
    font-size: 0.875rem;
    font-weight: 500;
    min-width: 2.75rem;
    height: 100% !important;
    min-height: 100% !important;
    user-select: none;
    white-space: nowrap;
    box-sizing: border-box;
    gap: 0.4rem;
    flex-shrink: 0;
}
.laughtale-inputgroup-addon svg,
.p-inputgroup-addon svg {
    display: block;
    width: 16px;
    height: 16px;
    color: var(--p-text-muted);
    flex-shrink: 0;
}

/* Buttons inside InputGroup */
.laughtale-inputgroup .p-button,
.p-inputgroup .p-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0 1rem;
    font-size: 0.875rem;
    font-weight: 600;
    border: 1px solid var(--p-border-color);
    cursor: pointer;
    transition: background 150ms ease, color 150ms ease, border-color 150ms ease;
    flex-shrink: 0;
    height: 100% !important;
    min-height: 100% !important;
}

/* Primary Contrast button */
.laughtale-inputgroup .p-button-primary,
.p-inputgroup .p-button-primary {
    background: var(--p-surface-950);
    color: var(--p-surface-0);
    border-color: var(--p-surface-950);
}
.laughtale-inputgroup .p-button-primary:hover,
.p-inputgroup .p-button-primary:hover {
    background: var(--p-surface-800);
    border-color: var(--p-surface-800);
}

/* Secondary Button */
.laughtale-inputgroup .p-button-secondary,
.p-inputgroup .p-button-secondary {
    background: var(--p-surface-0);
    color: var(--p-text-muted);
    border-color: var(--p-border-color);
}
.laughtale-inputgroup .p-button-secondary:hover,
.p-inputgroup .p-button-secondary:hover {
    background: var(--p-surface-100);
    color: var(--p-text-color);
}

/* FloatLabel & IftaLabel inside InputGroup */
.laughtale-inputgroup .laughtale-float-label,
.p-inputgroup .laughtale-float-label {
    flex: 1 1 auto;
    width: 100%;
    margin: 0 !important;
    height: 100% !important;
    min-height: 100% !important;
    display: flex;
    flex-direction: column;
    justify-content: center;
}
.laughtale-inputgroup .laughtale-ifta-label,
.p-inputgroup .laughtale-ifta-label {
    flex: 1 1 auto;
    width: 100%;
    margin: 0 !important;
    height: 100% !important;
    min-height: 100% !important;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

/* Elevation on focus so the active border-color sits on top */
.laughtale-inputgroup > *:focus-within,
.p-inputgroup > *:focus-within,
.laughtale-inputgroup > *:hover,
.p-inputgroup > *:hover {
    z-index: 2;
}

/* Dark Mode Tokens */
.dark .laughtale-inputgroup-addon,
.dark .p-inputgroup-addon {
    background: var(--p-surface-800);
    border-color: var(--p-surface-700);
    color: var(--p-surface-300);
}
.dark .laughtale-inputgroup-addon svg,
.dark .p-inputgroup-addon svg {
    color: var(--p-surface-400);
}
.dark .laughtale-inputgroup .p-button-primary,
.dark .p-inputgroup .p-button-primary {
    background: var(--p-surface-0);
    color: var(--p-surface-950);
    border-color: var(--p-surface-0);
}
.dark .laughtale-inputgroup .p-button-secondary,
.dark .p-inputgroup .p-button-secondary {
    background: var(--p-surface-900);
    border-color: var(--p-surface-700);
    color: var(--p-surface-300);
}
`;
  }
});

// src/components/input-text.ts
var input_text_exports = {};
__export(input_text_exports, {
  default: () => InputTextIsland
});
function InputTextIsland(container, props) {
  injectIslandStyle("laughtale-inputtext", CSS56);
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
var CSS56, xIcon;
var init_input_text = __esm({
  "src/components/input-text.ts"() {
    "use strict";
    init_styles();
    init_lucide();
    init_useControllableState();
    CSS56 = `
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
    xIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>`;
  }
});

// src/components/carousel.ts
var carousel_exports = {};
__export(carousel_exports, {
  default: () => CarouselIsland
});
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
var init_carousel = __esm({
  "src/components/carousel.ts"() {
    "use strict";
    init_lucide();
    init_styles();
  }
});

// src/components/paginator.ts
var paginator_exports = {};
__export(paginator_exports, {
  default: () => PaginatorIsland
});
function PaginatorIsland(container, props) {
  injectIslandStyle("paginator", CSS57);
  let first = props.first || 0;
  let rows = props.rows || 10;
  const totalRecords = props.totalRecords || 0;
  const options = props.rowsPerPageOptions || [10, 20, 50];
  const compact = props.compact || false;
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
    const showFrom = totalRecords > 0 ? first + 1 : 0;
    const showTo = Math.min(first + rows, totalRecords);
    const infoText = "Showing " + showFrom + "-" + showTo + " of " + totalRecords;
    const pagesHtml = pages.map(
      (p) => '<button class="paginator-btn btn-page ' + (p === currentPage ? "active" : "") + '" data-page="' + p + '">' + (p + 1) + "</button>"
    ).join("");
    const optionsHtml = options.length > 0 ? '<select class="paginator-select">' + options.map((opt) => '<option value="' + opt + '"' + (opt === rows ? " selected" : "") + ">" + opt + "</option>").join("") + "</select>" : "";
    container.innerHTML = '<div class="laughtale-paginator' + (compact ? " compact" : "") + '"><div class="paginator-left"><button class="paginator-btn btn-first"' + (isFirst ? " disabled" : "") + ' aria-label="First Page"><span style="display:flex;">' + LucideIcons.chevronsLeft + '</span></button><button class="paginator-btn btn-prev"' + (isFirst ? " disabled" : "") + ' aria-label="Previous Page"><span style="display:flex;">' + LucideIcons.chevronLeft + '</span></button><div class="paginator-pages">' + pagesHtml + '</div><button class="paginator-btn btn-next"' + (isLast ? " disabled" : "") + ' aria-label="Next Page"><span style="display:flex;">' + LucideIcons.chevronRight + '</span></button><button class="paginator-btn btn-last"' + (isLast ? " disabled" : "") + ' aria-label="Last Page"><span style="display:flex;">' + LucideIcons.chevronsRight + '</span></button></div><div class="paginator-right">' + optionsHtml + '<span class="paginator-info">' + infoText + "</span></div></div>";
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
var CSS57;
var init_paginator = __esm({
  "src/components/paginator.ts"() {
    "use strict";
    init_lucide();
    init_styles();
    CSS57 = `
.laughtale-paginator {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.75rem 1rem;
    background: var(--p-surface-0);
    border: 1px solid var(--p-border-color, var(--p-surface-200));
    border-radius: var(--p-border-radius, 0.5rem);
    font-family: inherit;
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
    min-width: 2rem;
    height: 2rem;
    padding: 0 0.25rem;
    border-radius: var(--p-border-radius, 0.5rem);
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
    box-shadow: 0 0 0 2px var(--p-primary-500);
}
.paginator-btn.active {
    background: var(--p-primary-500);
    color: white;
    font-weight: 600;
}
.paginator-btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
}
.paginator-select {
    padding: 0.25rem 2rem 0.25rem 0.75rem;
    border-radius: var(--p-border-radius, 0.5rem);
    border: 1px solid var(--p-border-color, var(--p-surface-200));
    background: var(--p-surface-0);
    color: var(--p-text-color);
    appearance: none;
    cursor: pointer;
    outline: none;
    font-size: 0.875rem;
}
.paginator-info {
    font-size: 0.875rem;
    color: var(--p-surface-500);
}
[data-theme="dark"] .laughtale-paginator {
    background: var(--p-surface-900);
    border-color: var(--p-surface-700);
    color: var(--p-surface-100);
}
[data-theme="dark"] .paginator-btn {
    color: var(--p-surface-200);
}
[data-theme="dark"] .paginator-btn:hover:not(:disabled) {
    background: var(--p-surface-800);
}
[data-theme="dark"] .paginator-btn.active {
    background: var(--p-primary-500);
    color: white;
}
[data-theme="dark"] .paginator-select {
    background: var(--p-surface-800);
    border-color: var(--p-surface-600);
    color: var(--p-surface-100);
}
`;
  }
});

// src/components/dataview.ts
var dataview_exports = {};
__export(dataview_exports, {
  default: () => DataViewIsland
});
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
                                ${LucideIcons.moreHorizontal}
                            </button>
                            <button class="dataview-btn ${layout === "grid" ? "active" : ""}" data-layout="grid" aria-label="Grid View">
                                ${LucideIcons.layers}
                            </button>
                        </div>
                    </div>
                </div>
                
                <div class="dataview-content ${layout}">
                    ${renderContent()}
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
var init_dataview = __esm({
  "src/components/dataview.ts"() {
    "use strict";
    init_lucide();
    init_styles();
  }
});

// src/components/menu.ts
var menu_exports = {};
__export(menu_exports, {
  default: () => MenuIsland
});
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
      const isSeparator = item.separator || item.Separator;
      if (isSeparator) return `<li class="menu-separator"></li>`;
      const label = item.label || item.Label || item.title || item.Title || "";
      const url = item.url || item.Url || "#";
      const icon = item.icon || item.Icon || "";
      const disabled = item.disabled || item.Disabled;
      const iconSvg = icon && LucideIcons[icon] ? LucideIcons[icon] : icon.startsWith("<svg") ? icon : "";
      return `
                        <li>
                            <a class="menu-item ${disabled ? "disabled" : ""}" href="${url}" tabindex="0">
                                ${iconSvg ? `<span style="width: 16px; height: 16px; display: flex;">${iconSvg}</span>` : ""}
                                <span>${label}</span>
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
var init_menu = __esm({
  "src/components/menu.ts"() {
    "use strict";
    init_lucide();
    init_styles();
  }
});

// src/components/context-menu.ts
var context_menu_exports = {};
__export(context_menu_exports, {
  default: () => ContextMenuIsland
});
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
var init_context_menu = __esm({
  "src/components/context-menu.ts"() {
    "use strict";
    init_lucide();
    init_styles();
  }
});

// src/components/popover.ts
var popover_exports = {};
__export(popover_exports, {
  default: () => PopoverIsland
});
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
var init_popover = __esm({
  "src/components/popover.ts"() {
    "use strict";
    init_styles();
  }
});

// src/components/tooltip-component.ts
var tooltip_component_exports = {};
__export(tooltip_component_exports, {
  default: () => TooltipIsland
});
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
                <div class="tooltip-content">${contentHtml}</div>
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
var init_tooltip_component = __esm({
  "src/components/tooltip-component.ts"() {
    "use strict";
    init_styles();
  }
});

// src/components/sidebar.ts
var sidebar_exports = {};
__export(sidebar_exports, {
  default: () => SidebarIsland
});
function SidebarIsland(container, props) {
  let collapsed = props.collapsed || false;
  let searchQuery = "";
  const items = props.items || [];
  const position = props.position || "left";
  const title = props.title || "Navigation";
  const searchable = props.searchable !== false;
  const expandedMap = {};
  function initExpanded(itemList) {
    itemList.forEach((item) => {
      const label = item.label || item.Label || "";
      const isExpanded = item.expanded !== false && item.Expanded !== false;
      if (label && expandedMap[label] === void 0) {
        expandedMap[label] = isExpanded;
      }
      const children = item.items || item.Items;
      if (Array.isArray(children)) {
        initExpanded(children);
      }
    });
  }
  initExpanded(items);
  injectIslandStyle("sidebar", `
        .laughtale-sidebar {
            display: flex;
            flex-direction: column;
            background: var(--p-surface-0);
            border-right: 1px solid var(--p-border-color);
            width: 270px;
            min-width: 270px;
            height: 100vh;
            position: sticky;
            top: 0;
            left: 0;
            transition: width 200ms cubic-bezier(0.4, 0, 0.2, 1), min-width 200ms cubic-bezier(0.4, 0, 0.2, 1);
            font-family: var(--p-font-family, inherit);
            overflow: hidden;
            border-radius: 0;
            box-shadow: none;
            z-index: 40;
        }
        .laughtale-sidebar.collapsed {
            width: 68px;
            min-width: 68px;
        }
        .laughtale-sidebar.right {
            border-right: none;
            border-left: 1px solid var(--p-border-color);
        }
        .sidebar-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 1rem 1.125rem;
            border-bottom: 1px solid var(--p-border-color);
            gap: 0.5rem;
            height: 60px;
            box-sizing: border-box;
            flex-shrink: 0;
        }
        .sidebar-search-box {
            padding: 0.625rem 0.875rem 0.25rem;
            flex-shrink: 0;
        }
        .sidebar-search-input {
            width: 100%;
            background: var(--p-surface-50);
            border: 1px solid var(--p-border-color);
            border-radius: var(--p-border-radius);
            padding: 0.4rem 0.65rem;
            font-size: 0.775rem;
            color: var(--p-text-color);
            outline: none;
            transition: border-color 0.15s ease, background 0.15s ease;
            box-sizing: border-box;
        }
        .sidebar-search-input:focus {
            border-color: var(--p-primary-500);
            background: var(--p-surface-0);
        }
        .sidebar-toggle {
            background: transparent;
            border: none;
            color: var(--p-text-muted);
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: var(--p-border-radius);
            width: 1.85rem;
            height: 1.85rem;
            transition: background 150ms ease, color 150ms ease;
            flex-shrink: 0;
        }
        .sidebar-toggle:hover {
            background: var(--p-surface-100);
            color: var(--p-text-color);
        }
        .sidebar-body {
            flex: 1;
            overflow-y: auto;
            overflow-x: hidden;
            padding: 0.5rem 0.6rem;
            display: flex;
            flex-direction: column;
            gap: 0.2rem;
            scrollbar-width: thin;
            scrollbar-color: var(--p-surface-300) transparent;
        }
        .sidebar-body::-webkit-scrollbar {
            width: 4px;
        }
        .sidebar-body::-webkit-scrollbar-track {
            background: transparent;
        }
        .sidebar-body::-webkit-scrollbar-thumb {
            background: var(--p-surface-300);
            border-radius: 4px;
        }
        .sidebar-tree-menu {
            list-style: none;
            padding: 0;
            margin: 0;
            display: flex;
            flex-direction: column;
            gap: 0.2rem;
            width: 100%;
        }
        .sidebar-item {
            display: flex;
            align-items: center;
            padding: 0.45rem 0.65rem;
            color: var(--p-text-color);
            text-decoration: none;
            border-radius: var(--p-border-radius);
            transition: background 150ms ease, color 150ms ease;
            gap: 0.6rem;
            font-size: 0.8125rem;
            font-weight: 500;
            white-space: nowrap;
            overflow: hidden;
            cursor: pointer;
            user-select: none;
            border: 1px solid transparent;
            box-sizing: border-box;
        }
        .sidebar-item:hover {
            background: var(--p-surface-100);
        }
        .sidebar-item.active {
            background: var(--p-primary-50);
            color: var(--p-primary-700);
            font-weight: 700;
            border-color: var(--p-primary-200);
        }
        .dark .sidebar-item.active {
            background: rgba(16, 185, 129, 0.15);
            color: #6ee7b7;
            border-color: rgba(16, 185, 129, 0.3);
        }
        .sidebar-group-container {
            width: 100%;
            list-style: none;
        }
        .sidebar-group-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0.5rem 0.65rem;
            color: var(--p-text-muted);
            font-size: 0.725rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.04em;
            cursor: pointer;
            border-radius: var(--p-border-radius);
            transition: background 150ms ease, color 150ms ease;
            box-sizing: border-box;
        }
        .sidebar-group-header:hover {
            background: var(--p-surface-100);
            color: var(--p-text-color);
        }
        .sidebar-group-chevron {
            display: flex;
            align-items: center;
            transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
            color: var(--p-text-muted);
        }
        .sidebar-group-chevron.expanded {
            transform: rotate(90deg);
        }
        .sidebar-sub-tree {
            list-style: none;
            padding: 0 0 0 0.75rem;
            margin: 0.15rem 0 0.35rem 0.35rem;
            border-left: 1px solid var(--p-border-color);
            display: flex;
            flex-direction: column;
            gap: 0.15rem;
        }
        .sidebar-badge {
            margin-left: auto;
            font-size: 0.6875rem;
            font-weight: 700;
            padding: 0.1rem 0.4rem;
            border-radius: 9999px;
            background: var(--p-surface-200);
            color: var(--p-text-color);
        }
        .collapsed .sidebar-body {
            padding: 0.5rem 0 !important;
            align-items: center;
        }
        .collapsed .sidebar-tree-menu {
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        .collapsed .sidebar-group-container {
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        .collapsed .sidebar-item-label, 
        .collapsed .sidebar-header-title,
        .collapsed .sidebar-search-box,
        .collapsed .sidebar-badge,
        .collapsed .sidebar-group-chevron {
            display: none !important;
        }
        .collapsed .sidebar-header {
            justify-content: center;
            padding: 0;
        }
        .collapsed .sidebar-header .sidebar-brand-group {
            display: none !important;
        }
        .collapsed .sidebar-header .sidebar-toggle {
            margin: 0 auto;
        }
        .collapsed .sidebar-group-header {
            display: flex !important;
            justify-content: center !important;
            align-items: center !important;
            width: 44px;
            height: 38px;
            margin: 0.5rem auto 0.25rem;
            padding: 0.5rem 0 0 !important;
            border-top: 1px solid var(--p-border-color);
            cursor: pointer;
            box-sizing: border-box;
        }
        .collapsed .sidebar-group-header > div {
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            gap: 0 !important;
            width: 100% !important;
        }
        .collapsed .sidebar-group-header span.sidebar-group-icon {
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            width: 20px !important;
            height: 20px !important;
        }
        .collapsed .sidebar-sub-tree {
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            width: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
            border-left: none !important;
            list-style: none !important;
            gap: 0.2rem;
        }
        .collapsed .sidebar-sub-tree > li {
            display: flex !important;
            justify-content: center !important;
            width: 100% !important;
        }
        .collapsed .sidebar-item {
            display: flex !important;
            justify-content: center !important;
            align-items: center !important;
            padding: 0 !important;
            width: 44px !important;
            height: 44px !important;
            margin: 0 auto !important;
            box-sizing: border-box !important;
            border-radius: var(--p-border-radius);
        }
        .collapsed .sidebar-item span.sidebar-icon {
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            width: 20px !important;
            height: 20px !important;
        }
        .collapsed .sidebar-item:hover {
            background: var(--p-surface-100);
        }
    `);
  function renderNode(item, level = 0) {
    const label = item.label || item.Label || item.title || item.Title || "";
    const url = item.url || item.Url || "#";
    const icon = item.icon || item.Icon || "";
    const active = item.active || item.Active || false;
    const badge = item.badge || item.Badge || "";
    const children = item.items || item.Items;
    const hasChildren = Array.isArray(children) && children.length > 0;
    const isExpanded = expandedMap[label] ?? true;
    const iconSvg = icon && LucideIcons[icon] ? LucideIcons[icon] : icon.startsWith("<svg") ? icon : "";
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchesSelf = label.toLowerCase().includes(q);
      const matchesChild = hasChildren && children.some((c) => (c.label || c.Label || "").toLowerCase().includes(q));
      if (!matchesSelf && !matchesChild) return "";
    }
    if (hasChildren) {
      return `
                <li class="sidebar-group-container" data-label="${label}">
                    <div class="sidebar-group-header" data-group-toggle="${label}" title="${label}">
                        <div style="display: flex; align-items: center; gap: 0.45rem;">
                            ${iconSvg ? `<span class="sidebar-group-icon" style="display: flex; width: 16px; height: 16px; color: var(--p-primary-600);">${iconSvg}</span>` : ""}
                            <span class="sidebar-item-label">${label}</span>
                        </div>
                        <span class="sidebar-group-chevron ${isExpanded ? "expanded" : ""}">
                            ${LucideIcons.chevronRight}
                        </span>
                    </div>
                    <ul class="sidebar-sub-tree" style="display: ${isExpanded ? "flex" : "none"};">
                        ${children.map((child) => renderNode(child, level + 1)).join("")}
                    </ul>
                </li>
            `;
    }
    return `
            <li>
                <a href="${url}" class="sidebar-item ${active ? "active" : ""}" data-sidebar-link="${url}" title="${label}">
                    ${iconSvg ? `<span class="sidebar-icon" style="display: flex; width: 18px; height: 18px; color: ${active ? "var(--p-primary-600)" : "var(--p-text-muted)"}; flex-shrink: 0;">${iconSvg}</span>` : ""}
                    <span class="sidebar-item-label">${label}</span>
                    ${badge ? `<span class="sidebar-badge">${badge}</span>` : ""}
                </a>
            </li>
        `;
  }
  function render() {
    container.innerHTML = `
            <div class="laughtale-sidebar ${collapsed ? "collapsed" : ""} ${position}">
                <div class="sidebar-header">
                    <div class="sidebar-brand-group" style="display: flex; align-items: center; gap: 0.6rem; overflow: hidden;">
                        <span style="color: var(--p-primary-600); display: flex; flex-shrink: 0;">${LucideIcons.layers}</span>
                        <span class="sidebar-header-title" style="font-weight: 800; font-size: 0.9rem; color: var(--p-text-color); white-space: nowrap;">${title}</span>
                    </div>
                    <button class="sidebar-toggle" aria-label="Toggle Sidebar" title="Collapse / Expand Sidebar">
                        ${collapsed ? LucideIcons.chevronRight : LucideIcons.chevronLeft}
                    </button>
                </div>

                ${searchable && !collapsed ? `
                    <div class="sidebar-search-box">
                        <input type="text" class="sidebar-search-input" placeholder="Filter components..." value="${searchQuery}" />
                    </div>
                ` : ""}

                <div class="sidebar-body">
                    <ul class="sidebar-tree-menu">
                        ${items.map((item) => renderNode(item)).join("")}
                    </ul>
                </div>
            </div>
        `;
    container.querySelector(".sidebar-toggle")?.addEventListener("click", () => {
      collapsed = !collapsed;
      render();
    });
    const searchInput = container.querySelector(".sidebar-search-input");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        searchQuery = e.target.value;
        const menuEl = container.querySelector(".sidebar-tree-menu");
        if (menuEl) {
          menuEl.innerHTML = items.map((item) => renderNode(item)).join("");
          bindGroupToggles();
        }
      });
    }
    bindGroupToggles();
  }
  function bindGroupToggles() {
    container.querySelectorAll("[data-group-toggle]").forEach((header) => {
      header.addEventListener("click", () => {
        const groupLabel = header.getAttribute("data-group-toggle");
        if (groupLabel) {
          expandedMap[groupLabel] = !expandedMap[groupLabel];
          render();
        }
      });
    });
  }
  render();
}
var init_sidebar = __esm({
  "src/components/sidebar.ts"() {
    "use strict";
    init_lucide();
    init_styles();
  }
});

// src/index.ts
var init_index = __esm({
  "src/index.ts"() {
    init_registry();
    init_registry();
    init_hydrator();
    init_router();
    init_slots();
    init_styles();
    init_events2();
    init_state();
    init_reviver();
    init_retry();
    init_streaming();
    init_vanilla();
    init_preact();
    init_directives();
    init_lucide();
    init_composables();
    init_models();
    init_animations();
    init_design_tokens();
    defineIsland("stepper", () => Promise.resolve().then(() => (init_stepper(), stepper_exports)));
    defineIsland("timeline", () => Promise.resolve().then(() => (init_timeline(), timeline_exports)));
    defineIsland("camera", () => Promise.resolve().then(() => (init_camera(), camera_exports)));
    defineIsland("dropzone", () => Promise.resolve().then(() => (init_dropzone(), dropzone_exports)));
    defineIsland("tree-select", () => Promise.resolve().then(() => (init_tree_select(), tree_select_exports)));
    defineIsland("datagrid", () => Promise.resolve().then(() => (init_datagrid(), datagrid_exports)));
    defineIsland("modal", () => Promise.resolve().then(() => (init_modal(), modal_exports)));
    defineIsland("toast", () => Promise.resolve().then(() => (init_toast(), toast_exports)));
    defineIsland("input-number", () => Promise.resolve().then(() => (init_input_number(), input_number_exports)));
    defineIsland("input-otp", () => Promise.resolve().then(() => (init_input_otp(), input_otp_exports)));
    defineIsland("input-password", () => Promise.resolve().then(() => (init_input_password(), input_password_exports)));
    defineIsland("toggle-switch", () => Promise.resolve().then(() => (init_toggle_switch(), toggle_switch_exports)));
    defineIsland("slider", () => Promise.resolve().then(() => (init_slider(), slider_exports)));
    defineIsland("rating", () => Promise.resolve().then(() => (init_rating(), rating_exports)));
    defineIsland("select-button", () => Promise.resolve().then(() => (init_select_button(), select_button_exports)));
    defineIsland("chips", () => Promise.resolve().then(() => (init_input_tags(), input_tags_exports)));
    defineIsland("input-tags", () => Promise.resolve().then(() => (init_input_tags(), input_tags_exports)));
    defineIsland("inputtags", () => Promise.resolve().then(() => (init_input_tags(), input_tags_exports)));
    defineIsland("tags", () => Promise.resolve().then(() => (init_input_tags(), input_tags_exports)));
    defineIsland("datepicker", () => Promise.resolve().then(() => (init_datepicker(), datepicker_exports)));
    defineIsland("meter-group", () => Promise.resolve().then(() => (init_meter_group(), meter_group_exports)));
    defineIsland("avatar-group", () => Promise.resolve().then(() => (init_avatar_group(), avatar_group_exports)));
    defineIsland("progress-bar", () => Promise.resolve().then(() => (init_progress_bar(), progress_bar_exports)));
    defineIsland("skeleton", () => Promise.resolve().then(() => (init_skeleton(), skeleton_exports)));
    defineIsland("drawer", () => Promise.resolve().then(() => (init_drawer(), drawer_exports)));
    defineIsland("speed-dial", () => Promise.resolve().then(() => (init_speed_dial(), speed_dial_exports)));
    defineIsland("image-compare", () => Promise.resolve().then(() => (init_image_compare(), image_compare_exports)));
    defineIsland("confirm-popup", () => Promise.resolve().then(() => (init_confirm_popup(), confirm_popup_exports)));
    defineIsland("accordion", () => Promise.resolve().then(() => (init_accordion(), accordion_exports)));
    defineIsland("tabs", () => Promise.resolve().then(() => (init_tabs(), tabs_exports)));
    defineIsland("autocomplete", () => Promise.resolve().then(() => (init_autocomplete(), autocomplete_exports)));
    defineIsland("color-picker", () => Promise.resolve().then(() => (init_color_picker(), color_picker_exports)));
    defineIsland("knob", () => Promise.resolve().then(() => (init_knob(), knob_exports)));
    defineIsland("tag", () => Promise.resolve().then(() => (init_tag(), tag_exports)));
    defineIsland("breadcrumb", () => Promise.resolve().then(() => (init_breadcrumb(), breadcrumb_exports)));
    defineIsland("scroll-top", () => Promise.resolve().then(() => (init_scroll_top(), scroll_top_exports)));
    defineIsland("inplace", () => Promise.resolve().then(() => (init_inplace(), inplace_exports)));
    defineIsland("command", () => Promise.resolve().then(() => (init_command(), command_exports)));
    defineIsland("theme-studio", () => Promise.resolve().then(() => (init_theme_studio(), theme_studio_exports)));
    defineIsland("dynamic-form", () => Promise.resolve().then(() => (init_dynamic_form(), dynamic_form_exports)));
    defineIsland("splitter", () => Promise.resolve().then(() => (init_splitter(), splitter_exports)));
    defineIsland("multiselect", () => Promise.resolve().then(() => (init_multiselect(), multiselect_exports)));
    defineIsland("cascadeselect", () => Promise.resolve().then(() => (init_cascadeselect(), cascadeselect_exports)));
    defineIsland("listbox", () => Promise.resolve().then(() => (init_listbox(), listbox_exports)));
    defineIsland("picklist", () => Promise.resolve().then(() => (init_picklist(), picklist_exports)));
    defineIsland("orderlist", () => Promise.resolve().then(() => (init_orderlist(), orderlist_exports)));
    defineIsland("orgchart", () => Promise.resolve().then(() => (init_orgchart(), orgchart_exports)));
    defineIsland("terminal", () => Promise.resolve().then(() => (init_terminal(), terminal_exports)));
    defineIsland("dock", () => Promise.resolve().then(() => (init_dock(), dock_exports)));
    defineIsland("galleria", () => Promise.resolve().then(() => (init_galleria(), galleria_exports)));
    defineIsland("blockui", () => Promise.resolve().then(() => (init_blockui(), blockui_exports)));
    defineIsland("split-button", () => Promise.resolve().then(() => (init_split_button(), split_button_exports)));
    defineIsland("select", () => Promise.resolve().then(() => (init_select(), select_exports)));
    defineIsland("checkbox", () => Promise.resolve().then(() => (init_checkbox(), checkbox_exports)));
    defineIsland("radio-button", () => Promise.resolve().then(() => (init_radio_button(), radio_button_exports)));
    defineIsland("radio", () => Promise.resolve().then(() => (init_radio_button(), radio_button_exports)));
    defineIsland("textarea", () => Promise.resolve().then(() => (init_textarea(), textarea_exports)));
    defineIsland("input-mask", () => Promise.resolve().then(() => (init_input_mask(), input_mask_exports)));
    defineIsland("float-label", () => Promise.resolve().then(() => (init_float_label(), float_label_exports)));
    defineIsland("ifta-label", () => Promise.resolve().then(() => (init_ifta_label(), ifta_label_exports)));
    defineIsland("input-group", () => Promise.resolve().then(() => (init_input_group(), input_group_exports)));
    defineIsland("input-group-addon", () => Promise.resolve().then(() => (init_input_group(), input_group_exports)).then((m) => ({ default: m.InputGroupAddonIsland })));
    defineIsland("inputgroup", () => Promise.resolve().then(() => (init_input_group(), input_group_exports)));
    defineIsland("inputgroup-addon", () => Promise.resolve().then(() => (init_input_group(), input_group_exports)).then((m) => ({ default: m.InputGroupAddonIsland })));
    defineIsland("input-text", () => Promise.resolve().then(() => (init_input_text(), input_text_exports)));
    defineIsland("enhanced-input", () => Promise.resolve().then(() => (init_input_text(), input_text_exports)));
    defineIsland("carousel", () => Promise.resolve().then(() => (init_carousel(), carousel_exports)));
    defineIsland("paginator", () => Promise.resolve().then(() => (init_paginator(), paginator_exports)));
    defineIsland("dataview", () => Promise.resolve().then(() => (init_dataview(), dataview_exports)));
    defineIsland("menu", () => Promise.resolve().then(() => (init_menu(), menu_exports)));
    defineIsland("context-menu", () => Promise.resolve().then(() => (init_context_menu(), context_menu_exports)));
    defineIsland("popover", () => Promise.resolve().then(() => (init_popover(), popover_exports)));
    defineIsland("tooltip", () => Promise.resolve().then(() => (init_tooltip_component(), tooltip_component_exports)));
    defineIsland("tooltip-component", () => Promise.resolve().then(() => (init_tooltip_component(), tooltip_component_exports)));
    defineIsland("sidebar", () => Promise.resolve().then(() => (init_sidebar(), sidebar_exports)));
  }
});
init_index();
export {
  AURA_PALETTES,
  LucideIcons,
  awaitStreamingReady,
  createPreactIsland,
  createVanillaIsland,
  defineIsland,
  enableViewTransitions,
  extractSlotContent,
  getIslandDefinition,
  getLucideIcon,
  getSlot,
  getToken,
  hasIsland,
  hydrateIsland,
  importWithRetry,
  initAnimationStyles,
  initDesignTokens,
  initDirectives,
  initIslands,
  injectIslandStyle,
  injectRipple,
  navigateTo,
  parseAndReviveProps,
  removeIslandStyle,
  reviveTuple,
  updateToken,
  useAutoAnimate,
  useClickOutside,
  useClipboard,
  useControllableState,
  useDebounce,
  useDisclosure,
  useDragGesture,
  useEventListener,
  useFloatingPosition,
  useFocusTrap,
  useHotkeys,
  useKeyboardNav,
  useMorphLayout,
  useScrollLock,
  useSpring,
  useStagger,
  useThrottle,
  useTransition,
  useVirtualizer
};
//# sourceMappingURL=index.mjs.map
