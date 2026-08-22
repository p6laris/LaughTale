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

// src/icons/lucide.ts
function getLucideIcon(name) {
  return LucideIcons[name] || "";
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

// src/components/input-number.ts
var input_number_exports = {};
__export(input_number_exports, {
  default: () => InputNumberIsland
});
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
var init_input_number = __esm({
  "src/components/input-number.ts"() {
    "use strict";
    init_lucide();
  }
});

// src/components/input-otp.ts
var input_otp_exports = {};
__export(input_otp_exports, {
  default: () => InputOtpIsland
});
function InputOtpIsland(container, props) {
  const length = props.length || 6;
  let values = new Array(length).fill("");
  function render() {
    const boxes = Array.from({ length }, (_, i) => `
            <input type="${props.mask ? "password" : "text"}" 
                   class="otp-box" 
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
}
var init_input_otp = __esm({
  "src/components/input-otp.ts"() {
    "use strict";
  }
});

// src/components/input-password.ts
var input_password_exports = {};
__export(input_password_exports, {
  default: () => InputPasswordIsland
});
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
  function render() {
    const meter = calculateStrength(currentPassword);
    container.innerHTML = `
            <div class="laughtale-password" style="display: flex; flex-direction: column; gap: 0.5rem; width: 100%; max-width: 340px;">
                <div style="display: flex; align-items: center; border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius); background: var(--p-surface-0); overflow: hidden; padding-right: 0.5rem;">
                    <input type="${isMasked ? "password" : "text"}" 
                           class="password-input" 
                           value="${currentPassword}" 
                           placeholder="${props.placeholder || "Enter password..."}" 
                           ${props.disabled ? "disabled" : ""} 
                           style="flex: 1; padding: 0.5rem 0.75rem; border: none; outline: none; background: transparent; font-size: 0.875rem; color: var(--p-text-color);" />
                    
                    ${props.toggleMask !== false ? `
                        <button type="button" class="toggle-mask-btn" style="border: none; background: transparent; color: var(--p-surface-400); cursor: pointer; display: flex; align-items: center; justify-content: center; padding: 0.25rem;">
                            ${isMasked ? LucideIcons.eye : LucideIcons.eyeOff}
                        </button>
                    ` : ""}
                </div>

                ${props.showMeter !== false && currentPassword ? `
                    <div style="display: flex; flex-direction: column; gap: 0.25rem;">
                        <div style="height: 4px; border-radius: 2px; background: var(--p-surface-200); overflow: hidden;">
                            <div style="height: 100%; width: ${meter.width}; background: ${meter.color}; transition: all 0.3s ease;"></div>
                        </div>
                        <div style="display: flex; justify-content: space-between; font-size: 0.6875rem; color: ${meter.color}; font-weight: 600;">
                            <span>Strength</span>
                            <span>${meter.label}</span>
                        </div>
                    </div>
                ` : ""}
            </div>
        `;
    const input = container.querySelector(".password-input");
    input.addEventListener("input", (e) => {
      currentPassword = e.target.value;
      syncValue();
      if (props.showMeter !== false) render();
    });
    container.querySelector(".toggle-mask-btn")?.addEventListener("click", () => {
      isMasked = !isMasked;
      render();
      const inp = container.querySelector(".password-input");
      inp.focus();
      inp.setSelectionRange(currentPassword.length, currentPassword.length);
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
      hidden.value = currentPassword;
    }
    container.dispatchEvent(new CustomEvent("password:change", {
      bubbles: true,
      detail: { value: currentPassword, strength: calculateStrength(currentPassword).label }
    }));
  }
  render();
}
var init_input_password = __esm({
  "src/components/input-password.ts"() {
    "use strict";
    init_lucide();
  }
});

// src/components/toggle-switch.ts
var toggle_switch_exports = {};
__export(toggle_switch_exports, {
  default: () => ToggleSwitchIsland
});
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
}
var init_toggle_switch = __esm({
  "src/components/toggle-switch.ts"() {
    "use strict";
  }
});

// src/components/slider.ts
var slider_exports = {};
__export(slider_exports, {
  default: () => SliderIsland
});
function SliderIsland(container, props) {
  const min = props.min !== void 0 ? props.min : 0;
  const max = props.max !== void 0 ? props.max : 100;
  const step = props.step !== void 0 ? props.step : 1;
  let currentValue = props.value !== void 0 ? props.value : min;
  function render() {
    const percent = (currentValue - min) / (max - min) * 100;
    container.innerHTML = `
            <div class="laughtale-slider" style="position: relative; width: 100%; max-width: 320px; padding: 1rem 0; user-select: none;">
                <!-- Track -->
                <div class="slider-track" style="position: relative; height: 6px; border-radius: 3px; background: var(--p-surface-200); cursor: ${props.disabled ? "not-allowed" : "pointer"};">
                    <!-- Active Fill Bar -->
                    <div class="slider-fill" style="position: absolute; top: 0; left: 0; height: 100%; width: ${percent}%; border-radius: 3px; background: var(--p-primary-600);"></div>
                    <!-- Drag Handle -->
                    <div class="slider-handle" style="position: absolute; top: 50%; left: ${percent}%; transform: translate(-50%, -50%); width: 1.125rem; height: 1.125rem; border-radius: 50%; background: #ffffff; border: 2px solid var(--p-primary-600); box-shadow: 0 1px 4px rgba(0,0,0,0.2); cursor: ${props.disabled ? "not-allowed" : "grab"}; transition: transform 0.1s ease;"></div>
                </div>

                <div style="display: flex; justify-content: space-between; margin-top: 0.5rem; font-size: 0.75rem; color: var(--p-surface-500); font-family: var(--p-font-mono);">
                    <span>${min}</span>
                    <span style="font-weight: 700; color: var(--p-primary-600);">${currentValue}</span>
                    <span>${max}</span>
                </div>
            </div>
        `;
    if (props.disabled) return;
    const track = container.querySelector(".slider-track");
    const updateFromPointer = (e) => {
      const rect = track.getBoundingClientRect();
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      let ratio = (clientX - rect.left) / rect.width;
      ratio = Math.max(0, Math.min(1, ratio));
      let val = min + ratio * (max - min);
      val = Math.round(val / step) * step;
      currentValue = Math.max(min, Math.min(max, val));
      render();
      syncValue();
    };
    track.addEventListener("click", updateFromPointer);
    const handle = container.querySelector(".slider-handle");
    const onDrag = (e) => updateFromPointer(e);
    const onStop = () => {
      window.removeEventListener("mousemove", onDrag);
      window.removeEventListener("mouseup", onStop);
      window.removeEventListener("touchmove", onDrag);
      window.removeEventListener("touchend", onStop);
    };
    handle.addEventListener("mousedown", () => {
      window.addEventListener("mousemove", onDrag);
      window.addEventListener("mouseup", onStop);
    });
    handle.addEventListener("touchstart", () => {
      window.addEventListener("touchmove", onDrag);
      window.addEventListener("touchend", onStop);
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
      hidden.value = currentValue.toString();
    }
    container.dispatchEvent(new CustomEvent("slider:change", {
      bubbles: true,
      detail: { value: currentValue }
    }));
  }
  render();
}
var init_slider = __esm({
  "src/components/slider.ts"() {
    "use strict";
  }
});

// src/components/rating.ts
var rating_exports = {};
__export(rating_exports, {
  default: () => RatingIsland
});
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
}
var init_rating = __esm({
  "src/components/rating.ts"() {
    "use strict";
    init_lucide();
  }
});

// src/components/select-button.ts
var select_button_exports = {};
__export(select_button_exports, {
  default: () => SelectButtonIsland
});
function SelectButtonIsland(container, props) {
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
var init_select_button = __esm({
  "src/components/select-button.ts"() {
    "use strict";
  }
});

// src/components/chips.ts
var chips_exports = {};
__export(chips_exports, {
  default: () => ChipsIsland
});
function ChipsIsland(container, props) {
  let chips = props.values ? [...props.values] : [];
  function render() {
    const chipTags = chips.map((c, idx) => `
            <span class="chip-item" style="display: inline-flex; align-items: center; gap: 0.35rem; background: var(--p-surface-100); color: var(--p-surface-800); border: 1px solid var(--p-surface-200); padding: 0.2rem 0.5rem; border-radius: var(--p-border-radius); font-size: 0.8125rem; font-weight: 500;">
                <span>${c}</span>
                ${!props.disabled ? `
                    <button type="button" class="remove-chip-btn" data-index="${idx}" style="border: none; background: transparent; color: var(--p-surface-400); cursor: pointer; display: flex; align-items: center; padding: 0;">
                        ${LucideIcons.x}
                    </button>
                ` : ""}
            </span>
        `).join("");
    container.innerHTML = `
            <div class="laughtale-chips" style="display: flex; flex-wrap: wrap; align-items: center; gap: 0.35rem; padding: 0.35rem 0.5rem; border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius); background: var(--p-surface-0); min-height: 2.5rem; max-width: 400px; cursor: text;">
                ${chipTags}
                <input type="text" class="chip-text-input" placeholder="${chips.length === 0 ? props.placeholder || "Add tag..." : ""}" ${props.disabled ? "disabled" : ""} style="flex: 1; min-width: 80px; border: none; outline: none; background: transparent; font-size: 0.8125rem; color: var(--p-text-color); padding: 0.25rem 0;" />
            </div>
        `;
    if (props.disabled) return;
    const input = container.querySelector(".chip-text-input");
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === ",") {
        e.preventDefault();
        const val = input.value.trim().replace(/,$/, "");
        if (val && !chips.includes(val) && (!props.max || chips.length < props.max)) {
          chips.push(val);
          render();
          syncValue();
          const nextInput = container.querySelector(".chip-text-input");
          nextInput.focus();
        }
      } else if (e.key === "Backspace" && !input.value && chips.length > 0) {
        chips.pop();
        render();
        syncValue();
        const nextInput = container.querySelector(".chip-text-input");
        nextInput.focus();
      }
    });
    container.querySelectorAll(".remove-chip-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const idx = parseInt(btn.getAttribute("data-index"), 10);
        chips.splice(idx, 1);
        render();
        syncValue();
      });
    });
    container.querySelector(".laughtale-chips")?.addEventListener("click", () => {
      input.focus();
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
      hidden.value = JSON.stringify(chips);
    }
    container.dispatchEvent(new CustomEvent("chips:change", {
      bubbles: true,
      detail: { values: chips }
    }));
  }
  render();
}
var init_chips = __esm({
  "src/components/chips.ts"() {
    "use strict";
    init_lucide();
  }
});

// src/components/datepicker.ts
var datepicker_exports = {};
__export(datepicker_exports, {
  default: () => DatePickerIsland
});
function DatePickerIsland(container, props) {
  let selectedDate = props.value ? new Date(props.value) : null;
  let viewYear = selectedDate ? selectedDate.getFullYear() : (/* @__PURE__ */ new Date()).getFullYear();
  let viewMonth = selectedDate ? selectedDate.getMonth() : (/* @__PURE__ */ new Date()).getMonth();
  let isOpen = false;
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const dayNames = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
  function formatDate(d) {
    if (!d) return "";
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  }
  function render() {
    const firstDay = new Date(viewYear, viewMonth, 1).getDay();
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const dayCells = [];
    for (let i = 0; i < firstDay; i++) {
      dayCells.push("<div></div>");
    }
    for (let day = 1; day <= daysInMonth; day++) {
      const isSelected = selectedDate && selectedDate.getFullYear() === viewYear && selectedDate.getMonth() === viewMonth && selectedDate.getDate() === day;
      dayCells.push(`
                <button type="button" 
                        class="calendar-day-btn" 
                        data-day="${day}" 
                        style="width: 2rem; height: 2rem; border-radius: 50%; border: none; background: ${isSelected ? "var(--p-primary-600)" : "transparent"}; color: ${isSelected ? "#ffffff" : "var(--p-surface-800)"}; font-weight: ${isSelected ? "700" : "500"}; font-size: 0.8125rem; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.15s ease;">
                    ${day}
                </button>
            `);
    }
    container.innerHTML = `
            <div class="laughtale-datepicker" style="position: relative; width: 100%; max-width: 260px; user-select: none;">
                <!-- Input trigger -->
                <div class="dp-trigger" style="display: flex; align-items: center; justify-content: space-between; border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius); background: var(--p-surface-0); padding: 0.5rem 0.75rem; cursor: ${props.disabled ? "not-allowed" : "pointer"};">
                    <span style="font-size: 0.875rem; color: ${selectedDate ? "var(--p-text-color)" : "var(--p-surface-400)"};">
                        ${selectedDate ? formatDate(selectedDate) : props.placeholder || "Select date..."}
                    </span>
                    <span style="color: var(--p-surface-500); display: flex; align-items: center;">${LucideIcons.calendar}</span>
                </div>

                <!-- Calendar Popup Overlay -->
                <div class="dp-overlay" style="display: ${isOpen ? "block" : "none"}; position: absolute; top: calc(100% + 4px); left: 0; z-index: 500; background: var(--p-surface-0); border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius-lg); box-shadow: var(--p-shadow-lg); padding: 1rem; width: 280px;">
                    <!-- Calendar Header -->
                    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.75rem;">
                        <button type="button" class="btn-prev-month" style="border: none; background: transparent; color: var(--p-surface-600); cursor: pointer; display: flex; align-items: center; padding: 0.25rem;">
                            ${LucideIcons.chevronLeft}
                        </button>
                        <div style="font-size: 0.875rem; font-weight: 700; color: var(--p-surface-900);">
                            ${monthNames[viewMonth]} ${viewYear}
                        </div>
                        <button type="button" class="btn-next-month" style="border: none; background: transparent; color: var(--p-surface-600); cursor: pointer; display: flex; align-items: center; padding: 0.25rem;">
                            ${LucideIcons.chevronRight}
                        </button>
                    </div>

                    <!-- Day Names -->
                    <div style="display: grid; grid-template-columns: repeat(7, 1fr); text-align: center; font-size: 0.6875rem; font-weight: 700; color: var(--p-surface-400); margin-bottom: 0.35rem;">
                        ${dayNames.map((d) => `<div>${d}</div>`).join("")}
                    </div>

                    <!-- Day Grid -->
                    <div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 2px; justify-items: center;">
                        ${dayCells.join("")}
                    </div>
                </div>
            </div>
        `;
    if (props.disabled) return;
    container.querySelector(".dp-trigger")?.addEventListener("click", (e) => {
      e.stopPropagation();
      isOpen = !isOpen;
      render();
    });
    container.querySelector(".btn-prev-month")?.addEventListener("click", (e) => {
      e.stopPropagation();
      if (viewMonth === 0) {
        viewMonth = 11;
        viewYear--;
      } else {
        viewMonth--;
      }
      render();
    });
    container.querySelector(".btn-next-month")?.addEventListener("click", (e) => {
      e.stopPropagation();
      if (viewMonth === 11) {
        viewMonth = 0;
        viewYear++;
      } else {
        viewMonth++;
      }
      render();
    });
    container.querySelectorAll(".calendar-day-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const day = parseInt(btn.getAttribute("data-day"), 10);
        selectedDate = new Date(viewYear, viewMonth, day);
        isOpen = false;
        render();
        syncValue();
      });
    });
  }
  function syncValue() {
    const valStr = formatDate(selectedDate);
    if (props.targetInputName) {
      let hidden = document.querySelector(`input[name="${props.targetInputName}"]`);
      if (!hidden) {
        hidden = document.createElement("input");
        hidden.type = "hidden";
        hidden.name = props.targetInputName;
        container.appendChild(hidden);
      }
      hidden.value = valStr;
    }
    container.dispatchEvent(new CustomEvent("date:change", {
      bubbles: true,
      detail: { date: valStr }
    }));
  }
  document.addEventListener("click", () => {
    if (isOpen) {
      isOpen = false;
      render();
    }
  });
  render();
}
var init_datepicker = __esm({
  "src/components/datepicker.ts"() {
    "use strict";
    init_lucide();
  }
});

// src/components/meter-group.ts
var meter_group_exports = {};
__export(meter_group_exports, {
  default: () => MeterGroupIsland
});
function MeterGroupIsland(container, props) {
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
var init_meter_group = __esm({
  "src/components/meter-group.ts"() {
    "use strict";
  }
});

// src/components/avatar-group.ts
var avatar_group_exports = {};
__export(avatar_group_exports, {
  default: () => AvatarGroupIsland
});
function AvatarGroupIsland(container, props) {
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
var init_avatar_group = __esm({
  "src/components/avatar-group.ts"() {
    "use strict";
  }
});

// src/components/progress-bar.ts
var progress_bar_exports = {};
__export(progress_bar_exports, {
  default: () => ProgressBarIsland
});
function ProgressBarIsland(container, props) {
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
var init_progress_bar = __esm({
  "src/components/progress-bar.ts"() {
    "use strict";
  }
});

// src/components/skeleton.ts
var skeleton_exports = {};
__export(skeleton_exports, {
  default: () => SkeletonIsland
});
function SkeletonIsland(container, props) {
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
var init_skeleton = __esm({
  "src/components/skeleton.ts"() {
    "use strict";
  }
});

// src/components/drawer.ts
var drawer_exports = {};
__export(drawer_exports, {
  default: () => DrawerIsland
});
function DrawerIsland(container, props) {
  const position = props.position || "right";
  const width = props.width || "380px";
  let isOpen = false;
  function render() {
    container.innerHTML = `
            <div class="laughtale-drawer-wrapper">
                ${props.triggerText ? `
                    <button type="button" class="p-button p-button-secondary drawer-open-btn">
                        ${props.triggerText}
                    </button>
                ` : ""}

                <!-- Backdrop -->
                <div class="drawer-backdrop" style="display: ${isOpen ? "block" : "none"}; position: fixed; inset: 0; background: rgba(0, 0, 0, 0.4); backdrop-filter: blur(4px); z-index: 1000; animation: fadeIn 0.2s ease;"></div>

                <!-- Drawer Panel -->
                <div class="drawer-panel" style="display: ${isOpen ? "flex" : "none"}; flex-direction: column; position: fixed; ${position}: 0; top: 0; bottom: 0; width: ${width}; max-width: 90vw; background: var(--p-surface-0); border-${position === "right" ? "left" : "right"}: 1px solid var(--p-border-color); box-shadow: var(--p-shadow-lg); z-index: 1001; animation: slideInDrawer 0.3s cubic-bezier(0.16, 1, 0.3, 1);">
                    
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
    const slotEl = container.querySelector('[data-slot="default"]') || container.querySelector(".island-slot");
    const slotContainer = container.querySelector(".drawer-slot-container");
    if (slotEl && slotContainer) slotContainer.appendChild(slotEl);
    container.querySelector(".drawer-open-btn")?.addEventListener("click", () => {
      isOpen = true;
      render();
    });
    container.querySelector(".drawer-close-btn")?.addEventListener("click", () => {
      isOpen = false;
      render();
    });
    container.querySelector(".drawer-backdrop")?.addEventListener("click", () => {
      isOpen = false;
      render();
    });
  }
  render();
}
var init_drawer = __esm({
  "src/components/drawer.ts"() {
    "use strict";
    init_lucide();
  }
});

// src/components/speed-dial.ts
var speed_dial_exports = {};
__export(speed_dial_exports, {
  default: () => SpeedDialIsland
});
function SpeedDialIsland(container, props) {
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
            <div class="laughtale-speed-dial" style="position: relative; display: inline-flex; flex-direction: column-reverse; align-items: center; gap: 0.75rem;">
                <!-- Main FAB Button -->
                <button type="button" class="speed-dial-main-btn" style="width: 3.25rem; height: 3.25rem; border-radius: 50%; border: none; background: var(--p-primary-600); color: #ffffff; box-shadow: var(--p-shadow-lg); cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 1.25rem; transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1); transform: rotate(${isOpen ? "45deg" : "0deg"});">
                    ${LucideIcons.plus}
                </button>

                <!-- Action Items -->
                <div class="speed-dial-list" style="display: ${isOpen ? "flex" : "none"}; flex-direction: column-reverse; gap: 0.5rem; animation: fadeInUp 0.2s ease;">
                    ${actionItems}
                </div>
            </div>
        `;
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
var init_speed_dial = __esm({
  "src/components/speed-dial.ts"() {
    "use strict";
    init_lucide();
  }
});

// src/components/image-compare.ts
var image_compare_exports = {};
__export(image_compare_exports, {
  default: () => ImageCompareIsland
});
function ImageCompareIsland(container, props) {
  let splitPercent = 50;
  function render() {
    container.innerHTML = `
            <div class="laughtale-image-compare" style="position: relative; width: 100%; max-width: 600px; height: 340px; border-radius: var(--p-border-radius-lg); overflow: hidden; user-select: none; border: 1px solid var(--p-border-color); box-shadow: var(--p-shadow-md);">
                <!-- After Image (Bottom) -->
                <img src="${props.afterImage}" alt="After" style="position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover;" />
                ${props.afterLabel ? `<span style="position: absolute; bottom: 0.75rem; right: 0.75rem; background: rgba(0,0,0,0.6); color: #ffffff; padding: 0.25rem 0.5rem; border-radius: var(--p-border-radius); font-size: 0.75rem; font-weight: 600;">${props.afterLabel}</span>` : ""}

                <!-- Before Image (Top Clipped) -->
                <div class="compare-clip" style="position: absolute; inset: 0; width: ${splitPercent}%; height: 100%; overflow: hidden;">
                    <img src="${props.beforeImage}" alt="Before" style="position: absolute; top: 0; left: 0; width: 600px; max-width: 600px; height: 340px; object-fit: cover;" />
                    ${props.beforeLabel ? `<span style="position: absolute; bottom: 0.75rem; left: 0.75rem; background: rgba(0,0,0,0.6); color: #ffffff; padding: 0.25rem 0.5rem; border-radius: var(--p-border-radius); font-size: 0.75rem; font-weight: 600;">${props.beforeLabel}</span>` : ""}
                </div>

                <!-- Divider Line & Handle -->
                <div class="compare-handle-line" style="position: absolute; top: 0; bottom: 0; left: ${splitPercent}%; width: 2px; background: #ffffff; box-shadow: 0 0 4px rgba(0,0,0,0.5); cursor: ew-resize;">
                    <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 2rem; height: 2rem; border-radius: 50%; background: #ffffff; border: 2px solid var(--p-primary-600); box-shadow: 0 2px 6px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; font-size: 0.6875rem; font-weight: 700; color: var(--p-primary-600);">
                        \u25C0\u25B6
                    </div>
                </div>
            </div>
        `;
    const compareBox = container.querySelector(".laughtale-image-compare");
    const onMove = (e) => {
      const rect = compareBox.getBoundingClientRect();
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      let p = (clientX - rect.left) / rect.width * 100;
      splitPercent = Math.max(0, Math.min(100, p));
      render();
    };
    const onUp = () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onUp);
    };
    compareBox.querySelector(".compare-handle-line")?.addEventListener("mousedown", () => {
      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp);
    });
    compareBox.querySelector(".compare-handle-line")?.addEventListener("touchstart", () => {
      window.addEventListener("touchmove", onMove);
      window.addEventListener("touchend", onUp);
    });
  }
  render();
}
var init_image_compare = __esm({
  "src/components/image-compare.ts"() {
    "use strict";
  }
});

// src/components/confirm-popup.ts
var confirm_popup_exports = {};
__export(confirm_popup_exports, {
  default: () => ConfirmPopupIsland
});
function ConfirmPopupIsland(container, props) {
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
  render();
}
var init_confirm_popup = __esm({
  "src/components/confirm-popup.ts"() {
    "use strict";
    init_lucide();
  }
});

// src/components/accordion.ts
var accordion_exports = {};
__export(accordion_exports, {
  default: () => AccordionIsland
});
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
  function render() {
    const tabHtml = tabs.map((tab, idx) => {
      const isOpen = activeIndices.has(idx);
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
                        <span class="chevron-icon" style="color: var(--p-surface-500); display: flex; align-items: center; transition: transform 0.2s ease; transform: rotate(${isOpen ? "180deg" : "0deg"});">
                            ${LucideIcons.chevronDown}
                        </span>
                    </button>
                    <div class="accordion-content" style="display: ${isOpen ? "block" : "none"}; padding: 1.25rem; border-top: 1px solid var(--p-border-color); font-size: 0.875rem; color: var(--p-surface-600); line-height: 1.6; animation: fadeIn 0.2s ease;">
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
    tabs.forEach((_, idx) => {
      const externalSlot = container.querySelector(`[data-slot="tab-${idx}"]`);
      const targetContainer = container.querySelector(`[data-slot-index="${idx}"]`);
      if (externalSlot && targetContainer) {
        targetContainer.innerHTML = "";
        targetContainer.appendChild(externalSlot);
      }
    });
    container.querySelectorAll(".accordion-header-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const idx = parseInt(btn.getAttribute("data-idx"), 10);
        if (activeIndices.has(idx)) {
          activeIndices.delete(idx);
        } else {
          if (!props.multiple) activeIndices.clear();
          activeIndices.add(idx);
        }
        render();
        container.dispatchEvent(new CustomEvent("accordion:change", {
          bubbles: true,
          detail: { activeIndex: Array.from(activeIndices) }
        }));
      });
    });
  }
  render();
}
var init_accordion = __esm({
  "src/components/accordion.ts"() {
    "use strict";
    init_lucide();
  }
});

// src/components/tabs.ts
var tabs_exports = {};
__export(tabs_exports, {
  default: () => TabsIsland
});
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
                        style="padding: 0.75rem 1.25rem; border: none; background: transparent; color: ${isActive ? "var(--p-primary-600)" : "var(--p-surface-600)"}; font-weight: ${isActive ? "700" : "500"}; font-size: 0.875rem; cursor: ${tab.disabled ? "not-allowed" : "pointer"}; border-bottom: 2px solid ${isActive ? "var(--p-primary-600)" : "transparent"}; transition: all 0.2s ease; display: inline-flex; align-items: center; gap: 0.5rem;">
                    ${tab.icon ? `<span>${tab.icon}</span>` : ""}
                    <span>${tab.header}</span>
                </button>
            `;
    }).join("");
    container.innerHTML = `
            <div class="laughtale-tabs" style="width: 100%;">
                <!-- Tab Headers Bar -->
                <div class="tabs-header-bar" style="display: flex; border-bottom: 1px solid var(--p-border-color); gap: 0.25rem; overflow-x: auto;">
                    ${headerButtons}
                </div>

                <!-- Active Tab Content Panel -->
                <div class="tab-panel-body" style="padding: 1.25rem 0; font-size: 0.875rem; color: var(--p-surface-700); line-height: 1.6; animation: fadeIn 0.2s ease;">
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
        activeIndex = parseInt(btn.getAttribute("data-idx"), 10);
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
      hidden.value = activeIndex.toString();
    }
    container.dispatchEvent(new CustomEvent("tabs:change", {
      bubbles: true,
      detail: { index: activeIndex, tab: tabs[activeIndex] }
    }));
  }
  render();
  syncValue();
}
var init_tabs = __esm({
  "src/components/tabs.ts"() {
    "use strict";
  }
});

// src/components/autocomplete.ts
var autocomplete_exports = {};
__export(autocomplete_exports, {
  default: () => AutoCompleteIsland
});
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
  function render() {
    const filtered = getFilteredItems();
    const selectedItem = allItems.find((i) => i.value === selectedValue);
    const displayLabel = selectedItem ? selectedItem.label : searchQuery;
    const listItemsHtml = filtered.length > 0 ? filtered.map((item) => `
            <div class="autocomplete-item" data-value="${item.value}" style="padding: 0.5rem 0.75rem; font-size: 0.875rem; color: var(--p-surface-800); cursor: pointer; display: flex; align-items: center; justify-content: space-between; border-radius: var(--p-border-radius); transition: background 0.15s ease;">
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                    ${item.icon ? `<span>${item.icon}</span>` : ""}
                    <span>${item.label}</span>
                </div>
                ${item.value === selectedValue ? `<span style="color: var(--p-primary-600);">${LucideIcons.check}</span>` : ""}
            </div>
        `).join("") : `
            <div style="padding: 0.75rem; font-size: 0.8125rem; color: var(--p-surface-400); text-align: center;">No results found</div>
        `;
    container.innerHTML = `
            <div class="laughtale-autocomplete" style="position: relative; width: 100%; max-width: 320px;">
                <div class="autocomplete-input-wrap" style="display: flex; align-items: center; border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius); background: var(--p-surface-0); padding: 0 0.5rem; transition: border-color 0.2s ease;">
                    <span style="color: var(--p-surface-400); display: flex; align-items: center; margin-right: 0.25rem;">
                        ${LucideIcons.search}
                    </span>
                    <input type="text" 
                           class="autocomplete-input" 
                           value="${displayLabel}" 
                           placeholder="${props.placeholder || "Search or select..."}" 
                           ${props.disabled ? "disabled" : ""} 
                           style="flex: 1; padding: 0.5rem 0.25rem; border: none; outline: none; background: transparent; font-size: 0.875rem; color: var(--p-text-color);" />
                    ${selectedValue ? `
                        <button type="button" class="btn-clear-autocomplete" style="border: none; background: transparent; color: var(--p-surface-400); cursor: pointer; padding: 0.25rem; display: flex; align-items: center;">
                            ${LucideIcons.x}
                        </button>
                    ` : ""}
                </div>

                <!-- Dropdown Popup -->
                <div class="autocomplete-overlay" style="display: ${isOpen ? "block" : "none"}; position: absolute; top: calc(100% + 4px); left: 0; right: 0; z-index: 500; background: var(--p-surface-0); border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius); box-shadow: var(--p-shadow-lg); max-height: 220px; overflow-y: auto; padding: 0.25rem;">
                    ${listItemsHtml}
                </div>
            </div>
        `;
    const input = container.querySelector(".autocomplete-input");
    input.addEventListener("focus", () => {
      isOpen = true;
      render();
      container.querySelector(".autocomplete-input").focus();
    });
    input.addEventListener("input", (e) => {
      searchQuery = e.target.value;
      isOpen = true;
      render();
      const nextInput = container.querySelector(".autocomplete-input");
      nextInput.focus();
      nextInput.setSelectionRange(searchQuery.length, searchQuery.length);
    });
    container.querySelectorAll(".autocomplete-item").forEach((itemEl) => {
      itemEl.addEventListener("click", () => {
        selectedValue = itemEl.getAttribute("data-value") || "";
        searchQuery = "";
        isOpen = false;
        render();
        syncValue();
      });
    });
    container.querySelector(".btn-clear-autocomplete")?.addEventListener("click", (e) => {
      e.stopPropagation();
      selectedValue = "";
      searchQuery = "";
      isOpen = false;
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
      hidden.value = selectedValue;
    }
    container.dispatchEvent(new CustomEvent("autocomplete:change", {
      bubbles: true,
      detail: { value: selectedValue }
    }));
  }
  render();
  syncValue();
}
var init_autocomplete = __esm({
  "src/components/autocomplete.ts"() {
    "use strict";
    init_lucide();
  }
});

// src/components/color-picker.ts
var color_picker_exports = {};
__export(color_picker_exports, {
  default: () => ColorPickerIsland
});
function ColorPickerIsland(container, props) {
  let currentColor = props.value || "#10b981";
  let isOpen = false;
  function render() {
    const swatches = DEFAULT_PRESETS.map((c) => `
            <button type="button" 
                    class="color-swatch-btn" 
                    data-color="${c}" 
                    style="width: 1.5rem; height: 1.5rem; border-radius: 4px; border: ${c === currentColor ? "2px solid #ffffff" : "1px solid rgba(0,0,0,0.1)"}; background: ${c}; cursor: pointer; box-shadow: ${c === currentColor ? "0 0 0 2px var(--p-primary-600)" : "none"}; transition: transform 0.15s ease;">
            </button>
        `).join("");
    container.innerHTML = `
            <div class="laughtale-colorpicker" style="position: relative; display: inline-flex; align-items: center; gap: 0.5rem;">
                <!-- Color Swatch Trigger -->
                <button type="button" 
                        class="colorpicker-trigger-btn" 
                        ${props.disabled ? "disabled" : ""} 
                        style="width: 2.25rem; height: 2.25rem; border-radius: var(--p-border-radius); border: 2px solid var(--p-surface-200); background: ${currentColor}; cursor: ${props.disabled ? "not-allowed" : "pointer"}; box-shadow: var(--p-shadow-sm); transition: transform 0.15s ease, border-color 0.15s ease;">
                </button>
                <span style="font-family: monospace; font-size: 0.8125rem; font-weight: 600; color: var(--p-surface-700);">${currentColor.toUpperCase()}</span>

                <!-- Palette Popover -->
                <div class="colorpicker-palette-overlay" style="display: ${isOpen ? "block" : "none"}; position: absolute; top: calc(100% + 6px); left: 0; z-index: 500; background: var(--p-surface-0); border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius-lg); box-shadow: var(--p-shadow-lg); padding: 0.875rem; width: 180px;">
                    <div style="font-size: 0.6875rem; font-weight: 700; color: var(--p-surface-500); text-transform: uppercase; margin-bottom: 0.5rem;">Palette Swatches</div>
                    <div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 6px; margin-bottom: 0.75rem;">
                        ${swatches}
                    </div>
                    <div style="display: flex; align-items: center; gap: 0.35rem;">
                        <input type="color" class="color-native-input" value="${currentColor}" style="width: 2rem; height: 1.75rem; border: none; padding: 0; background: transparent; cursor: pointer;" />
                        <input type="text" class="color-hex-input" value="${currentColor}" maxlength="7" style="flex: 1; padding: 0.25rem 0.5rem; font-family: monospace; font-size: 0.75rem; border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius);" />
                    </div>
                </div>
            </div>
        `;
    container.querySelector(".colorpicker-trigger-btn")?.addEventListener("click", (e) => {
      e.stopPropagation();
      isOpen = !isOpen;
      render();
    });
    container.querySelectorAll(".color-swatch-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        currentColor = btn.getAttribute("data-color");
        isOpen = false;
        render();
        syncValue();
      });
    });
    const nativeInput = container.querySelector(".color-native-input");
    nativeInput?.addEventListener("input", (e) => {
      currentColor = e.target.value;
      render();
      syncValue();
    });
    const hexInput = container.querySelector(".color-hex-input");
    hexInput?.addEventListener("change", (e) => {
      const val = e.target.value;
      if (/^#[0-9A-Fa-f]{6}$/.test(val)) {
        currentColor = val;
        render();
        syncValue();
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
      hidden.value = currentColor;
    }
    container.dispatchEvent(new CustomEvent("color:change", {
      bubbles: true,
      detail: { value: currentColor }
    }));
  }
  render();
  syncValue();
}
var DEFAULT_PRESETS;
var init_color_picker = __esm({
  "src/components/color-picker.ts"() {
    "use strict";
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
  }
});

// src/components/knob.ts
var knob_exports = {};
__export(knob_exports, {
  default: () => KnobIsland
});
function KnobIsland(container, props) {
  const min = props.min !== void 0 ? props.min : 0;
  const max = props.max !== void 0 ? props.max : 100;
  const step = props.step || 1;
  const size = props.size || 96;
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  let currentValue = props.value !== void 0 ? props.value : min;
  function render() {
    const pct = Math.max(0, Math.min(1, (currentValue - min) / (max - min)));
    const strokeDashoffset = circumference * (1 - pct);
    const template = props.valueTemplate || "{value}%";
    const displayValue = template.replace("{value}", currentValue.toString());
    container.innerHTML = `
            <div class="laughtale-knob" style="position: relative; display: inline-flex; align-items: center; justify-content: center; width: ${size}px; height: ${size}px; user-select: none; cursor: ${props.disabled ? "not-allowed" : "pointer"};">
                <svg width="${size}" height="${size}" style="transform: rotate(-90deg);">
                    <!-- Background Circle -->
                    <circle cx="${size / 2}" cy="${size / 2}" r="${radius}" fill="transparent" stroke="var(--p-surface-200)" stroke-width="${strokeWidth}" />
                    <!-- Progress Arc -->
                    <circle class="knob-progress-circle" cx="${size / 2}" cy="${size / 2}" r="${radius}" fill="transparent" stroke="${props.color || "var(--p-primary-600)"}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-dasharray="${circumference}" stroke-dashoffset="${strokeDashoffset}" style="transition: stroke-dashoffset 0.15s ease;" />
                </svg>
                <span style="position: absolute; font-size: ${size * 0.2}px; font-weight: 700; color: var(--p-surface-900);">
                    ${displayValue}
                </span>
            </div>
        `;
    if (props.disabled) return;
    let isDragging = false;
    const updateFromPointer = (e) => {
      const rect = container.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI) + 90;
      const normalizedAngle = angle < 0 ? angle + 360 : angle;
      const ratio = Math.min(1, Math.max(0, normalizedAngle / 360));
      const rawVal = min + ratio * (max - min);
      currentValue = Math.round(rawVal / step) * step;
      render();
      syncValue();
    };
    const knobEl = container.querySelector(".laughtale-knob");
    knobEl.addEventListener("mousedown", (e) => {
      isDragging = true;
      updateFromPointer(e);
    });
    window.addEventListener("mousemove", (e) => {
      if (isDragging) updateFromPointer(e);
    });
    window.addEventListener("mouseup", () => {
      isDragging = false;
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
      hidden.value = currentValue.toString();
    }
    container.dispatchEvent(new CustomEvent("knob:change", {
      bubbles: true,
      detail: { value: currentValue }
    }));
  }
  render();
  syncValue();
}
var init_knob = __esm({
  "src/components/knob.ts"() {
    "use strict";
  }
});

// src/components/tag.ts
var tag_exports = {};
__export(tag_exports, {
  default: () => TagIsland
});
function TagIsland(container, props) {
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
var init_tag = __esm({
  "src/components/tag.ts"() {
    "use strict";
  }
});

// src/components/breadcrumb.ts
var breadcrumb_exports = {};
__export(breadcrumb_exports, {
  default: () => BreadcrumbIsland
});
function BreadcrumbIsland(container, props) {
  const items = props.items || [];
  const homeUrl = props.homeUrl || "/";
  const itemsHtml = items.map((item, idx) => {
    const isLast = idx === items.length - 1;
    return `
            <li style="display: flex; align-items: center; gap: 0.5rem;">
                <span style="color: var(--p-surface-400); display: flex; align-items: center;">${LucideIcons.chevronRight}</span>
                ${item.url && !isLast ? `
                    <a href="${item.url}" style="color: var(--p-surface-600); text-decoration: none; font-size: 0.8125rem; font-weight: 500; display: flex; align-items: center; gap: 0.35rem; transition: color 0.15s ease;">
                        ${item.icon ? `<span>${item.icon}</span>` : ""}
                        <span>${item.label}</span>
                    </a>
                ` : `
                    <span style="color: var(--p-surface-900); font-size: 0.8125rem; font-weight: 600; display: flex; align-items: center; gap: 0.35rem;">
                        ${item.icon ? `<span>${item.icon}</span>` : ""}
                        <span>${item.label}</span>
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
var init_breadcrumb = __esm({
  "src/components/breadcrumb.ts"() {
    "use strict";
    init_lucide();
  }
});

// src/components/scroll-top.ts
var scroll_top_exports = {};
__export(scroll_top_exports, {
  default: () => ScrollTopIsland
});
function ScrollTopIsland(container, props) {
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
var init_scroll_top = __esm({
  "src/components/scroll-top.ts"() {
    "use strict";
    init_lucide();
  }
});

// src/components/inplace.ts
var inplace_exports = {};
__export(inplace_exports, {
  default: () => InplaceIsland
});
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
var init_inplace = __esm({
  "src/components/inplace.ts"() {
    "use strict";
    init_lucide();
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
    defineIsland("chips", () => Promise.resolve().then(() => (init_chips(), chips_exports)));
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
  }
});
init_index();
export {
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
  hasIsland,
  hydrateIsland,
  importWithRetry,
  initDirectives,
  initIslands,
  injectIslandStyle,
  navigateTo,
  parseAndReviveProps,
  reviveTuple
};
//# sourceMappingURL=index.mjs.map
