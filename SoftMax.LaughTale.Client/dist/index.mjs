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
  const name = container.getAttribute("data-island");
  if (!name) return;
  const strategy = (container.getAttribute("data-hydrate") || "load").toLowerCase();
  const mediaQuery = container.getAttribute("data-media");
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
    const rawProps = container.getAttribute("data-props");
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
  const islands = root.querySelectorAll("[data-island]");
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
      target[prop] = value;
      listeners.forEach((fn) => fn());
      return true;
    },
    get(target, prop) {
      return target[prop];
    }
  });
  const scope = { state, listeners, container };
  elementScopeMap.set(container, scope);
  return scope;
}
function evaluateExpression(expr, state, extraContext = {}) {
  try {
    const contextKeys = Object.keys(extraContext);
    const contextValues = Object.values(extraContext);
    const fn = new Function("state", ...contextKeys, `with(state) { return (${expr}); }`);
    return fn(state, ...contextValues);
  } catch (err) {
    console.error(`[SoftMax.LaughTale] Error evaluating expression "${expr}":`, err);
    return void 0;
  }
}
function executeStatement(stmt, state, extraContext = {}) {
  try {
    const contextKeys = Object.keys(extraContext);
    const contextValues = Object.values(extraContext);
    const fn = new Function("state", ...contextKeys, `with(state) { ${stmt}; }`);
    fn(state, ...contextValues);
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
      const expr = attr.value;
      const update = () => {
        const val = evaluateExpression(expr, scope.state);
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
      element.addEventListener(eventName, (e) => {
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
      });
    }
    if (attr.name.startsWith("l-listen:")) {
      const channel = attr.name.slice(9);
      const stmt = attr.value;
      window.addEventListener(`laughtale:${channel}`, (e) => {
        const context = {
          $event: e.detail,
          $el: element
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

// src/directives/index.ts
function initDirectives(root = document) {
  const stateElements = root.querySelectorAll("[l-state]");
  stateElements.forEach((el) => {
    const rawJson = el.getAttribute("l-state");
    try {
      const initialData = rawJson ? JSON.parse(rawJson) : {};
      createReactiveScope(el, initialData);
    } catch (err) {
      console.error("[SoftMax.LaughTale] Invalid JSON in l-state:", rawJson, err);
    }
  });
  const allElements = root.querySelectorAll("*");
  allElements.forEach((el) => {
    for (const attr of Array.from(el.attributes)) {
      if (attr.name === "l-bind" || attr.name.startsWith("l-bind:") || attr.name === "l-model" || attr.name === "l-class" || attr.name === "l-style") {
        const scope = el.__laughtale_scope || el.closest("[l-state]");
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
  if (url.pathname === window.location.pathname && url.search === window.location.search && url.hash) {
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

// src/runtime/styles.ts
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
var injectedStyles;
var init_styles = __esm({
  "src/runtime/styles.ts"() {
    "use strict";
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

// src/components/stepper.ts
var stepper_exports = {};
__export(stepper_exports, {
  default: () => StepperIsland
});
function StepperIsland(container, props) {
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
var init_stepper = __esm({
  "src/components/stepper.ts"() {
    "use strict";
  }
});

// src/components/timeline.ts
var timeline_exports = {};
__export(timeline_exports, {
  default: () => TimelineIsland
});
function TimelineIsland(container, props) {
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
var init_timeline = __esm({
  "src/components/timeline.ts"() {
    "use strict";
  }
});

// src/components/camera.ts
var camera_exports = {};
__export(camera_exports, {
  default: () => CameraIsland
});
function CameraIsland(container, props) {
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
var init_camera = __esm({
  "src/components/camera.ts"() {
    "use strict";
  }
});

// src/components/dropzone.ts
var dropzone_exports = {};
__export(dropzone_exports, {
  default: () => DropzoneIsland
});
function DropzoneIsland(container, props) {
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
var init_dropzone = __esm({
  "src/components/dropzone.ts"() {
    "use strict";
  }
});

// src/components/tree-select.ts
var tree_select_exports = {};
__export(tree_select_exports, {
  default: () => CascadeTreeIsland
});
function CascadeTreeIsland(container, props) {
  let selectedText = props.placeholder;
  let isOpen = false;
  container.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 0.75rem;">
            <div style="display: flex; align-items: center; justify-content: space-between;">
                <span style="font-size: 0.8125rem; font-weight: 600; color: var(--p-surface-600);">Organizational Hierarchy</span>
                <span class="aura-tag tag-amber">Hydrate: Visible</span>
            </div>

            <div style="position: relative; width: 100%;">
                <input type="hidden" name="${props.targetInputName}" id="${props.targetInputName}" value="" />
                
                <button type="button" class="tree-toggle-btn p-input" style="display: flex; align-items: center; justify-content: space-between; cursor: pointer; text-align: left;">
                    <span class="selected-label" style="color: var(--p-surface-600); font-size: 0.875rem;">${selectedText}</span>
                    <span style="font-size: 0.6875rem; color: var(--p-surface-400);">\u25BC</span>
                </button>

                <div class="tree-dropdown-menu" style="display: none; position: absolute; top: calc(100% + 4px); left: 0; width: 100%; padding: 0.75rem; background: var(--p-surface-0); border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius-lg); box-shadow: var(--p-shadow-lg); z-index: 50; max-height: 16rem; overflow-y: auto;">
                    <input type="text" placeholder="Search departments..." class="p-input tree-search" style="margin-bottom: 0.5rem; font-size: 0.8125rem; padding: 0.4rem 0.65rem;" />
                    <div class="tree-list" style="display: flex; flex-direction: column; gap: 0.25rem;"></div>
                </div>
            </div>
        </div>
    `;
  const btn = container.querySelector(".tree-toggle-btn");
  const menu = container.querySelector(".tree-dropdown-menu");
  const searchInput = container.querySelector(".tree-search");
  const treeList = container.querySelector(".tree-list");
  const labelSpan = container.querySelector(".selected-label");
  const hiddenInput = container.querySelector(`#${props.targetInputName}`);
  btn.addEventListener("click", () => {
    isOpen = !isOpen;
    menu.style.display = isOpen ? "block" : "none";
    if (isOpen) {
      renderList(props.departments || []);
      searchInput.focus();
    }
  });
  searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase();
    const filtered = filterTree(props.departments || [], query);
    renderList(filtered);
  });
  function filterTree(nodes, query) {
    if (!query) return nodes;
    return nodes.reduce((acc, node) => {
      const matches = node.name.toLowerCase().includes(query);
      const filteredChildren = node.children ? filterTree(node.children, query) : [];
      if (matches || filteredChildren.length > 0) {
        acc.push({ ...node, children: filteredChildren });
      }
      return acc;
    }, []);
  }
  function renderList(nodes, depth = 0) {
    if (depth === 0) treeList.innerHTML = "";
    nodes.forEach((node) => {
      const item = document.createElement("div");
      item.style.padding = "0.4rem 0.6rem";
      item.style.paddingLeft = `${depth * 1 + 0.6}rem`;
      item.style.fontSize = "0.8125rem";
      item.style.borderRadius = "var(--p-border-radius)";
      item.style.cursor = "pointer";
      item.style.display = "flex";
      item.style.alignItems = "center";
      item.style.justifyContent = "space-between";
      item.style.color = "var(--p-surface-700)";
      item.innerHTML = `
                <span>${node.name}</span>
                <span style="font-size: 0.6875rem; color: var(--p-surface-400); font-family: var(--p-font-mono);">${node.children?.length ? `${node.children.length} sub` : ""}</span>
            `;
      item.addEventListener("mouseenter", () => {
        item.style.backgroundColor = "var(--p-surface-100)";
      });
      item.addEventListener("mouseleave", () => {
        item.style.backgroundColor = "transparent";
      });
      item.addEventListener("click", (e) => {
        e.stopPropagation();
        hiddenInput.value = node.id;
        labelSpan.textContent = node.name;
        labelSpan.style.color = "var(--p-surface-950)";
        labelSpan.style.fontWeight = "600";
        isOpen = false;
        menu.style.display = "none";
      });
      treeList.appendChild(item);
      if (node.children?.length) {
        renderList(node.children, depth + 1);
      }
    });
  }
  document.addEventListener("click", (e) => {
    if (!container.contains(e.target)) {
      isOpen = false;
      menu.style.display = "none";
    }
  });
}
var init_tree_select = __esm({
  "src/components/tree-select.ts"() {
    "use strict";
  }
});

// src/components/datagrid.ts
var datagrid_exports = {};
__export(datagrid_exports, {
  default: () => DataGridIsland
});
function DataGridIsland(container, props) {
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
var init_datagrid = __esm({
  "src/components/datagrid.ts"() {
    "use strict";
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
            backdrop-filter: blur(4px);
            z-index: 1100;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 1.5rem;
        }
        .aura-dialog {
            background: var(--p-surface-0);
            border: 1px solid var(--p-border-color);
            border-radius: var(--p-border-radius-xl);
            box-shadow: var(--p-shadow-lg);
            max-width: 32rem;
            width: 100%;
            overflow: hidden;
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

            <div class="aura-dialog-mask modal-overlay" style="display: none;">
                <div class="aura-dialog">
                    <div style="display: flex; align-items: center; justify-content: space-between; padding: 1.25rem 1.5rem; border-bottom: 1px solid var(--p-border-color);">
                        <h3 style="font-size: 1rem; font-weight: 700; color: var(--p-surface-950);">${props.dialogTitle}</h3>
                        <button type="button" class="modal-close-btn" style="background: none; border: none; font-size: 1.125rem; color: var(--p-surface-400); cursor: pointer; padding: 0.25rem;">\u2715</button>
                    </div>

                    <!-- Projected C# Server Slot Content -->
                    <div class="modal-body" style="padding: 1.5rem;">
                        ${slotHtml}
                    </div>

                    <div style="display: flex; align-items: center; justify-content: flex-end; gap: 0.75rem; padding: 1rem 1.5rem; background: var(--p-surface-50); border-top: 1px solid var(--p-border-color);">
                        <button type="button" class="p-button p-button-secondary p-button-sm modal-cancel-btn">Dismiss</button>
                        <button type="button" class="p-button p-button-primary p-button-sm modal-confirm-btn">Acknowledge</button>
                    </div>
                </div>
            </div>
        </div>
    `;
  const openBtn = container.querySelector(".modal-open-btn");
  const overlay = container.querySelector(".modal-overlay");
  const closeBtns = container.querySelectorAll(".modal-close-btn, .modal-cancel-btn, .modal-confirm-btn");
  const open = () => {
    overlay.style.display = "flex";
  };
  const close = () => {
    overlay.style.display = "none";
  };
  openBtn.addEventListener("click", open);
  closeBtns.forEach((btn) => btn.addEventListener("click", close));
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) close();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && overlay.style.display === "flex") close();
  });
}
var init_modal = __esm({
  "src/components/modal.ts"() {
    "use strict";
    init_index();
  }
});

// src/components/toast.ts
var toast_exports = {};
__export(toast_exports, {
  default: () => ToastIsland
});
function ToastIsland(container) {
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
    toastEl.style.pointerEvents = "auto";
    toastEl.style.display = "flex";
    toastEl.style.alignItems = "flex-start";
    toastEl.style.gap = "0.75rem";
    toastEl.style.padding = "0.875rem 1.125rem";
    toastEl.style.borderRadius = "var(--p-border-radius-lg)";
    toastEl.style.background = "white";
    toastEl.style.border = `1px solid ${theme.border}`;
    toastEl.style.boxShadow = "var(--p-shadow-lg)";
    toastEl.style.width = "340px";
    toastEl.style.animation = "slideIn 0.25s cubic-bezier(0.16, 1, 0.3, 1)";
    toastEl.innerHTML = `
            <div style="width: 1.5rem; height: 1.5rem; border-radius: 50%; background: ${theme.bg}; color: ${theme.color}; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 0.75rem; flex-shrink: 0;">
                ${theme.icon}
            </div>
            <div style="flex: 1;">
                <div style="font-size: 0.875rem; font-weight: 600; color: var(--p-surface-900);">${msg.title}</div>
                ${msg.description ? `<div style="font-size: 0.75rem; color: var(--p-surface-600); margin-top: 0.15rem;">${msg.description}</div>` : ""}
            </div>
            <button type="button" style="background: none; border: none; font-size: 1rem; color: var(--p-surface-400); cursor: pointer; padding: 0 0.25rem;">\u2715</button>
        `;
    toastEl.querySelector("button")?.addEventListener("click", () => toastEl.remove());
    container.appendChild(toastEl);
    setTimeout(() => {
      toastEl.style.opacity = "0";
      toastEl.style.transform = "translateX(100%)";
      toastEl.style.transition = "all 0.3s ease";
      setTimeout(() => toastEl.remove(), 300);
    }, duration);
  }
  window.addEventListener("laughtale:toast", (e) => {
    if (e.detail) addToast(e.detail);
  });
}
var init_toast = __esm({
  "src/components/toast.ts"() {
    "use strict";
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
    defineIsland("stepper", () => Promise.resolve().then(() => (init_stepper(), stepper_exports)));
    defineIsland("timeline", () => Promise.resolve().then(() => (init_timeline(), timeline_exports)));
    defineIsland("camera", () => Promise.resolve().then(() => (init_camera(), camera_exports)));
    defineIsland("dropzone", () => Promise.resolve().then(() => (init_dropzone(), dropzone_exports)));
    defineIsland("tree-select", () => Promise.resolve().then(() => (init_tree_select(), tree_select_exports)));
    defineIsland("datagrid", () => Promise.resolve().then(() => (init_datagrid(), datagrid_exports)));
    defineIsland("modal", () => Promise.resolve().then(() => (init_modal(), modal_exports)));
    defineIsland("toast", () => Promise.resolve().then(() => (init_toast(), toast_exports)));
  }
});
init_index();
export {
  awaitStreamingReady,
  createPreactIsland,
  createVanillaIsland,
  defineIsland,
  enableViewTransitions,
  extractSlotContent,
  getIslandDefinition,
  getSlot,
  hasIsland,
  hydrateIsland,
  importWithRetry,
  initDirectives,
  initIslands,
  injectIslandStyle,
  parseAndReviveProps,
  reviveTuple
};
//# sourceMappingURL=index.mjs.map
