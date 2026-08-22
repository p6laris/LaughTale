"use strict";
var SoftMaxIslands = (() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
    get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
  }) : x)(function(x) {
    if (typeof require !== "undefined") return require.apply(this, arguments);
    throw Error('Dynamic require of "' + x + '" is not supported');
  });
  var __esm = (fn, res) => function __init() {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  };
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

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
    const allDepartments = props.departments || [];
    let selectedId = props.selectedValue || "";
    let selectedName = "";
    let searchQuery = "";
    const expandedIds = /* @__PURE__ */ new Set();
    allDepartments.forEach((dept) => {
      if (dept.children && dept.children.length > 0) {
        expandedIds.add(dept.id);
      }
    });
    function findNodeById(nodes, id) {
      for (const n of nodes) {
        if (n.id === id) return n;
        if (n.children) {
          const found = findNodeById(n.children, id);
          if (found) return found;
        }
      }
      return null;
    }
    if (selectedId) {
      const found = findNodeById(allDepartments, selectedId);
      if (found) selectedName = found.name;
    }
    container.innerHTML = `
        <div class="laughtale-tree-select" style="position: relative; width: 100%; max-width: 380px; font-family: var(--p-font-family, inherit);">
            <input type="hidden" name="${props.targetInputName || "tree_selected"}" id="${props.targetInputName || "tree_selected"}" value="${selectedId}" />
            
            <!-- Trigger Button -->
            <button type="button" 
                    class="tree-trigger-btn" 
                    ${props.disabled ? "disabled" : ""}
                    style="width: 100%; display: flex; align-items: center; justify-content: space-between; padding: 0.5rem 0.875rem; background: var(--p-surface-0); border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius); color: var(--p-text-color); cursor: ${props.disabled ? "not-allowed" : "pointer"}; font-size: 0.875rem; box-shadow: var(--p-shadow-sm); transition: all 0.2s ease;">
                <div style="display: flex; align-items: center; gap: 0.5rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                    <span style="color: var(--p-primary-600); display: flex;">${LucideIcons.gitBranch || "\u{1F333}"}</span>
                    <span class="tree-trigger-label" style="color: ${selectedName ? "var(--p-surface-900)" : "var(--p-surface-400)"}; font-weight: ${selectedName ? "600" : "normal"};">
                        ${selectedName || props.placeholder || "Select department or node..."}
                    </span>
                </div>
                <div style="display: flex; align-items: center; gap: 0.35rem;">
                    <button type="button" class="tree-clear-btn" style="display: ${selectedId ? "flex" : "none"}; border: none; background: transparent; color: var(--p-surface-400); cursor: pointer; padding: 2px;">
                        ${LucideIcons.x}
                    </button>
                    <span class="tree-chevron" style="color: var(--p-surface-400); display: flex; transition: transform 0.2s ease;">
                        ${LucideIcons.chevronDown}
                    </span>
                </div>
            </button>

            <!-- Dropdown Menu -->
            <div class="tree-dropdown-menu" style="display: none; position: absolute; top: calc(100% + 6px); left: 0; right: 0; z-index: 1000; background: var(--p-surface-0); border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius-lg); box-shadow: var(--p-shadow-lg); overflow: hidden;">
                
                <!-- Search Box -->
                <div style="padding: 0.625rem 0.75rem; border-bottom: 1px solid var(--p-border-color); display: flex; align-items: center; gap: 0.5rem; background: var(--p-surface-50);">
                    <span style="color: var(--p-surface-400); display: flex;">${LucideIcons.search}</span>
                    <input type="text" 
                           class="tree-search-input" 
                           placeholder="Search tree nodes..." 
                           style="flex: 1; border: none; outline: none; background: transparent; font-size: 0.8125rem; color: var(--p-text-color);" />
                </div>

                <!-- Tree Hierarchy List -->
                <div class="tree-nodes-container" style="max-height: 260px; overflow-y: auto; padding: 0.5rem 0.25rem;">
                </div>

                <!-- Footer Summary -->
                <div style="padding: 0.4rem 0.75rem; background: var(--p-surface-50); border-top: 1px solid var(--p-border-color); font-size: 0.6875rem; color: var(--p-surface-500); display: flex; justify-content: space-between; align-items: center;">
                    <span>Hierarchy Explorer</span>
                    <span class="tree-count-label"></span>
                </div>
            </div>
        </div>
    `;
    const triggerBtn = container.querySelector(".tree-trigger-btn");
    const triggerLabel = container.querySelector(".tree-trigger-label");
    const clearBtn = container.querySelector(".tree-clear-btn");
    const chevron = container.querySelector(".tree-chevron");
    const dropdown = container.querySelector(".tree-dropdown-menu");
    const searchInput = container.querySelector(".tree-search-input");
    const nodesContainer = container.querySelector(".tree-nodes-container");
    const countLabel = container.querySelector(".tree-count-label");
    const hiddenInput = container.querySelector(`#${props.targetInputName || "tree_selected"}`);
    const disclosure = useDisclosure({
      defaultIsOpen: false,
      onOpen: () => {
        renderTree();
        useTransition(dropdown, { type: "fade", isMounted: true });
        chevron.style.transform = "rotate(180deg)";
        triggerBtn.style.borderColor = "var(--p-primary-500)";
        searchInput.focus();
      },
      onClose: () => {
        useTransition(dropdown, { type: "fade", isMounted: false });
        chevron.style.transform = "rotate(0deg)";
        triggerBtn.style.borderColor = "var(--p-border-color)";
      }
    });
    useClickOutside(container, () => disclosure.close());
    triggerBtn.addEventListener("click", (e) => {
      if (e.target.closest(".tree-clear-btn")) return;
      disclosure.toggle();
    });
    clearBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      selectedId = "";
      selectedName = "";
      triggerLabel.textContent = props.placeholder || "Select department or node...";
      triggerLabel.style.color = "var(--p-surface-400)";
      triggerLabel.style.fontWeight = "normal";
      clearBtn.style.display = "none";
      hiddenInput.value = "";
      renderTree();
      syncValue();
    });
    const debouncedFilter = useDebounce(() => {
      searchQuery = searchInput.value.trim().toLowerCase();
      renderTree();
    }, 150);
    searchInput.addEventListener("input", () => debouncedFilter());
    function filterTree(nodes, query) {
      if (!query) return nodes;
      return nodes.reduce((acc, node) => {
        const matches = node.name.toLowerCase().includes(query) || node.id.toLowerCase().includes(query);
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
    function renderTree() {
      const filtered = filterTree(allDepartments, searchQuery);
      nodesContainer.innerHTML = "";
      if (filtered.length === 0) {
        nodesContainer.innerHTML = `<div style="padding: 1.5rem; text-align: center; color: var(--p-surface-400); font-size: 0.8125rem;">No matching departments</div>`;
        countLabel.textContent = "0 items";
        return;
      }
      let totalNodes = 0;
      function countAll(nodes) {
        nodes.forEach((n) => {
          totalNodes++;
          if (n.children) countAll(n.children);
        });
      }
      countAll(filtered);
      countLabel.textContent = `${totalNodes} items`;
      function renderNodes(nodes, depth, parentEl) {
        nodes.forEach((node) => {
          const hasChildren = node.children && node.children.length > 0;
          const isExpanded = searchQuery ? true : expandedIds.has(node.id);
          const isSelected = selectedId === node.id;
          const nodeEl = document.createElement("div");
          nodeEl.className = "tree-node-item";
          nodeEl.style.display = "flex";
          nodeEl.style.flexDirection = "column";
          const rowEl = document.createElement("div");
          rowEl.style.display = "flex";
          rowEl.style.alignItems = "center";
          rowEl.style.justifyContent = "space-between";
          rowEl.style.padding = "0.4rem 0.5rem";
          rowEl.style.paddingLeft = `${depth * 1.25 + 0.5}rem`;
          rowEl.style.borderRadius = "var(--p-border-radius)";
          rowEl.style.cursor = "pointer";
          rowEl.style.background = isSelected ? "var(--p-primary-50)" : "transparent";
          rowEl.style.color = isSelected ? "var(--p-primary-700)" : "var(--p-text-color)";
          rowEl.style.fontWeight = isSelected ? "600" : "normal";
          rowEl.style.fontSize = "0.8125rem";
          rowEl.style.transition = "all 0.1s ease";
          rowEl.innerHTML = `
                    <div style="display: flex; align-items: center; gap: 0.4rem; flex: 1; overflow: hidden;">
                        ${hasChildren ? `
                            <span class="tree-node-toggle" style="color: var(--p-surface-400); display: flex; align-items: center; transition: transform 0.15s ease; transform: rotate(${isExpanded ? "90deg" : "0deg"});">
                                ${LucideIcons.chevronRight}
                            </span>
                        ` : `
                            <span style="width: 14px; display: inline-block;"></span>
                        `}
                        <span style="display: flex; align-items: center; color: ${hasChildren ? "var(--p-primary-600)" : "var(--p-surface-500)"};">
                            ${hasChildren ? LucideIcons.folder || "\u{1F4C1}" : LucideIcons.fileText || "\u{1F4C4}"}
                        </span>
                        <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${node.name}</span>
                    </div>
                    <div style="display: flex; align-items: center; gap: 0.35rem;">
                        ${node.badge ? `<span class="aura-tag tag-slate" style="font-size: 0.625rem; padding: 0.1rem 0.35rem;">${node.badge}</span>` : ""}
                        ${isSelected ? `<span style="color: var(--p-primary-600); display: flex;">${LucideIcons.check}</span>` : ""}
                    </div>
                `;
          rowEl.addEventListener("mouseenter", () => {
            if (!isSelected) rowEl.style.background = "var(--p-surface-100)";
          });
          rowEl.addEventListener("mouseleave", () => {
            if (!isSelected) rowEl.style.background = "transparent";
          });
          const toggleSpan = rowEl.querySelector(".tree-node-toggle");
          if (toggleSpan) {
            toggleSpan.addEventListener("click", (e) => {
              e.stopPropagation();
              if (expandedIds.has(node.id)) expandedIds.delete(node.id);
              else expandedIds.add(node.id);
              renderTree();
            });
          }
          rowEl.addEventListener("click", () => {
            selectedId = node.id;
            selectedName = node.name;
            triggerLabel.textContent = selectedName;
            triggerLabel.style.color = "var(--p-surface-900)";
            triggerLabel.style.fontWeight = "600";
            clearBtn.style.display = "flex";
            hiddenInput.value = selectedId;
            disclosure.close();
            syncValue();
          });
          nodeEl.appendChild(rowEl);
          if (hasChildren && isExpanded) {
            const childrenContainer = document.createElement("div");
            childrenContainer.className = "tree-children-container";
            renderNodes(node.children, depth + 1, childrenContainer);
            nodeEl.appendChild(childrenContainer);
          }
          parentEl.appendChild(nodeEl);
        });
      }
      renderNodes(filtered, 0, nodesContainer);
    }
    function syncValue() {
      container.dispatchEvent(new CustomEvent("tree:selected", {
        bubbles: true,
        detail: { id: selectedId, name: selectedName }
      }));
    }
  }
  var init_tree_select = __esm({
    "src/components/tree-select.ts"() {
      "use strict";
      init_lucide();
      init_useDisclosure();
      init_useClickOutside();
      init_useTransition();
      init_useDebounce();
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
                   class="otp-box otp-digit-input" 
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
    syncOtp();
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
    container.innerHTML = `
        <div class="laughtale-password" style="display: flex; flex-direction: column; gap: 0.5rem; width: 100%; max-width: 340px;">
            <div style="display: flex; align-items: center; border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius); background: var(--p-surface-0); overflow: hidden; padding-right: 0.5rem;">
                <input type="password" 
                       class="password-input" 
                       value="" 
                       placeholder="${props.placeholder || "Enter password..."}" 
                       ${props.disabled ? "disabled" : ""} 
                       style="flex: 1; padding: 0.5rem 0.75rem; border: none; outline: none; background: transparent; font-size: 0.875rem; color: var(--p-text-color);" />
                
                ${props.toggleMask !== false ? `
                    <button type="button" class="toggle-mask-btn" style="border: none; background: transparent; color: var(--p-surface-400); cursor: pointer; display: flex; align-items: center; justify-content: center; padding: 0.25rem;">
                        ${LucideIcons.eye}
                    </button>
                ` : ""}
            </div>

            ${props.showMeter !== false ? `
                <div class="password-meter-wrap" style="display: none; flex-direction: column; gap: 0.25rem;">
                    <div style="height: 4px; border-radius: 2px; background: var(--p-surface-200); overflow: hidden;">
                        <div class="password-meter-bar" style="height: 100%; width: 0%; background: transparent; transition: all 0.3s ease;"></div>
                    </div>
                    <div style="display: flex; justify-content: space-between; font-size: 0.6875rem; font-weight: 600;">
                        <span style="color: var(--p-surface-500);">Strength</span>
                        <span class="password-meter-label" style="color: var(--p-surface-500);"></span>
                    </div>
                </div>
            ` : ""}
        </div>
    `;
    const input = container.querySelector(".password-input");
    const toggleBtn = container.querySelector(".toggle-mask-btn");
    const meterWrap = container.querySelector(".password-meter-wrap");
    const meterBar = container.querySelector(".password-meter-bar");
    const meterLabel = container.querySelector(".password-meter-label");
    function updateMeterVisuals() {
      if (!meterWrap || !meterBar || !meterLabel) return;
      if (!currentPassword) {
        meterWrap.style.display = "none";
        return;
      }
      meterWrap.style.display = "flex";
      const meter = calculateStrength(currentPassword);
      meterBar.style.width = meter.width;
      meterBar.style.background = meter.color;
      meterLabel.textContent = meter.label;
      meterLabel.style.color = meter.color;
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
        hidden.value = currentPassword;
      }
      container.dispatchEvent(new CustomEvent("password:change", {
        bubbles: true,
        detail: { value: currentPassword, strength: calculateStrength(currentPassword).label }
      }));
    }
    input.addEventListener("input", () => {
      currentPassword = input.value;
      updateMeterVisuals();
      syncValue();
    });
    toggleBtn?.addEventListener("click", () => {
      isMasked = !isMasked;
      input.type = isMasked ? "password" : "text";
      toggleBtn.innerHTML = isMasked ? LucideIcons.eye : LucideIcons.eyeOff;
      input.focus();
    });
    syncValue();
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
    syncValue();
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
    syncValue();
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
    const [getChips, setChips] = useControllableState({
      defaultValue: props.values ? [...props.values] : [],
      onChange: (val) => {
        syncValue(val);
      }
    });
    function render() {
      const chips = getChips();
      const chipTags = chips.map((c, idx) => `
            <span class="chip-item" data-val="${c}" style="display: inline-flex; align-items: center; gap: 0.35rem; background: var(--p-surface-100); color: var(--p-surface-800); border: 1px solid var(--p-surface-200); padding: 0.2rem 0.5rem; border-radius: var(--p-border-radius); font-size: 0.8125rem; font-weight: 500; transition: all 0.15s ease;">
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
      const wrapper = container.querySelector(".laughtale-chips");
      useAutoAnimate(wrapper, { duration: 200 });
      if (props.disabled) return;
      const input = container.querySelector(".chip-text-input");
      input.addEventListener("keydown", (e) => {
        const current = getChips();
        if (e.key === "Enter" || e.key === ",") {
          e.preventDefault();
          const val = input.value.trim().replace(/,$/, "");
          if (val && !current.includes(val) && (!props.max || current.length < props.max)) {
            setChips([...current, val]);
            render();
            const nextInput = container.querySelector(".chip-text-input");
            nextInput.focus();
          }
        } else if (e.key === "Backspace" && !input.value && current.length > 0) {
          setChips(current.slice(0, -1));
          render();
          const nextInput = container.querySelector(".chip-text-input");
          nextInput.focus();
        }
      });
      container.querySelectorAll(".remove-chip-btn").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.stopPropagation();
          const idx = Number(btn.getAttribute("data-index"));
          const current = getChips();
          setChips(current.filter((_, i) => i !== idx));
          render();
        });
      });
      wrapper.addEventListener("click", () => input.focus());
    }
    function syncValue(current) {
      if (props.targetInputName) {
        let hidden = container.querySelector(`input[name="${props.targetInputName}"]`);
        if (!hidden) {
          hidden = document.createElement("input");
          hidden.type = "hidden";
          hidden.name = props.targetInputName;
          container.appendChild(hidden);
        }
        hidden.value = JSON.stringify(current);
      }
      container.dispatchEvent(new CustomEvent("chips:change", {
        bubbles: true,
        detail: { values: current }
      }));
    }
    render();
    syncValue(getChips());
  }
  var init_chips = __esm({
    "src/components/chips.ts"() {
      "use strict";
      init_lucide();
      init_useAutoAnimate();
      init_useControllableState();
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
  var init_drawer = __esm({
    "src/components/drawer.ts"() {
      "use strict";
      init_lucide();
      init_useDisclosure();
      init_useFocusTrap();
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
  var init_speed_dial = __esm({
    "src/components/speed-dial.ts"() {
      "use strict";
      init_lucide();
      init_useStagger();
    }
  });

  // src/components/image-compare.ts
  var image_compare_exports = {};
  __export(image_compare_exports, {
    default: () => ImageCompareIsland
  });
  function ImageCompareIsland(container, props) {
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
    const disclosures = {};
    tabs.forEach((_, idx) => {
      disclosures[idx] = useDisclosure({
        defaultIsOpen: activeIndices.has(idx)
      });
    });
    function render() {
      const tabHtml = tabs.map((tab, idx) => {
        const isOpen = disclosures[idx]?.isOpen ?? false;
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
                        <span class="chevron-icon" style="color: var(--p-surface-500); display: flex; align-items: center; transition: transform 0.25s cubic-bezier(0.2, 0, 0, 1); transform: rotate(${isOpen ? "180deg" : "0deg"});">
                            ${LucideIcons.chevronDown}
                        </span>
                    </button>
                    <div class="accordion-content" style="display: ${isOpen ? "block" : "none"}; padding: 1.25rem; border-top: 1px solid var(--p-border-color); font-size: 0.875rem; color: var(--p-surface-600); line-height: 1.6;">
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
  var init_accordion = __esm({
    "src/components/accordion.ts"() {
      "use strict";
      init_lucide();
      init_useDisclosure();
      init_useTransition();
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
                        style="position: relative; padding: 0.75rem 1.25rem; border: none; background: transparent; color: ${isActive ? "var(--p-primary-600)" : "var(--p-surface-600)"}; font-weight: ${isActive ? "700" : "500"}; font-size: 0.875rem; cursor: ${tab.disabled ? "not-allowed" : "pointer"}; transition: color 0.15s ease; display: inline-flex; align-items: center; gap: 0.5rem; border-bottom: 2px solid ${isActive ? "var(--p-primary-600)" : "transparent"};">
                    ${tab.icon ? `<span>${tab.icon}</span>` : ""}
                    <span>${tab.header}</span>
                </button>
            `;
      }).join("");
      container.innerHTML = `
            <div class="laughtale-tabs" style="width: 100%;">
                <!-- Tab Headers Bar -->
                <div class="tabs-header-bar" style="display: flex; border-bottom: 1px solid var(--p-border-color); gap: 0.25rem; overflow-x: auto; position: relative;">
                    ${headerButtons}
                </div>

                <!-- Active Tab Content Panel -->
                <div class="tab-panel-body" style="padding: 1.25rem 0; font-size: 0.875rem; color: var(--p-surface-700); line-height: 1.6; transition: opacity 0.2s ease;">
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
    function getFilteredItems() {
      if (!searchQuery) return allItems;
      const q = searchQuery.toLowerCase();
      return allItems.filter((item) => item.label.toLowerCase().includes(q) || item.value.toLowerCase().includes(q));
    }
    container.innerHTML = `
        <div class="laughtale-autocomplete" style="position: relative; width: 100%; max-width: 320px;">
            <div class="autocomplete-input-wrap" style="display: flex; align-items: center; border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius); background: var(--p-surface-0); padding: 0 0.5rem; transition: border-color 0.2s ease;">
                <span style="color: var(--p-surface-400); display: flex; align-items: center; margin-right: 0.25rem;">
                    ${LucideIcons.search}
                </span>
                <input type="text" 
                       class="autocomplete-input" 
                       value="${selectedValue ? allItems.find((i) => i.value === selectedValue)?.label || "" : ""}" 
                       placeholder="${props.placeholder || "Search or select..."}" 
                       ${props.disabled ? "disabled" : ""} 
                       style="flex: 1; padding: 0.5rem 0.25rem; border: none; outline: none; background: transparent; font-size: 0.875rem; color: var(--p-text-color);" />
                <button type="button" class="btn-clear-autocomplete" style="display: ${selectedValue ? "flex" : "none"}; border: none; background: transparent; color: var(--p-surface-400); cursor: pointer; padding: 0.25rem; align-items: center;">
                    ${LucideIcons.x}
                </button>
            </div>

            <!-- Dropdown Popup -->
            <div class="autocomplete-overlay" style="display: none; position: absolute; top: calc(100% + 4px); left: 0; right: 0; z-index: 500; background: var(--p-surface-0); border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius); box-shadow: var(--p-shadow-lg); max-height: 220px; overflow-y: auto; padding: 0.25rem;">
            </div>
        </div>
    `;
    const input = container.querySelector(".autocomplete-input");
    const clearBtn = container.querySelector(".btn-clear-autocomplete");
    const overlay = container.querySelector(".autocomplete-overlay");
    const disclosure = useDisclosure({
      defaultIsOpen: false,
      onOpen: () => {
        renderDropdown();
        useTransition(overlay, { type: "fade", isMounted: true });
      },
      onClose: () => {
        useTransition(overlay, { type: "fade", isMounted: false });
      }
    });
    useClickOutside(container, () => disclosure.close());
    const keyboardNav = useKeyboardNav({
      itemCount: () => getFilteredItems().length,
      onHighlight: (idx) => {
        const items = overlay.querySelectorAll(".autocomplete-item");
        items.forEach((it, i) => {
          it.style.background = i === idx ? "var(--p-surface-100)" : "transparent";
          if (i === idx) it.scrollIntoView({ block: "nearest" });
        });
      },
      onSelect: (idx) => {
        const filtered = getFilteredItems();
        if (filtered[idx]) selectItem(filtered[idx]);
      },
      onEscape: () => disclosure.close()
    });
    function selectItem(item) {
      selectedValue = item.value;
      searchQuery = "";
      input.value = item.label;
      clearBtn.style.display = "flex";
      disclosure.close();
      syncValue();
    }
    function renderDropdown() {
      const filtered = getFilteredItems();
      if (filtered.length === 0) {
        overlay.innerHTML = `<div style="padding: 0.75rem; text-align: center; color: var(--p-surface-400); font-size: 0.8125rem;">No results found</div>`;
        return;
      }
      overlay.innerHTML = filtered.map((item, idx) => `
            <div class="autocomplete-item" data-value="${item.value}" data-idx="${idx}" style="display: flex; align-items: center; justify-content: space-between; padding: 0.5rem 0.75rem; border-radius: var(--p-border-radius); cursor: pointer; font-size: 0.8125rem; color: var(--p-text-color); transition: background 0.15s ease;">
                <span style="display: flex; align-items: center; gap: 0.5rem;">
                    ${item.icon ? `<span>${item.icon}</span>` : ""}
                    <span>${item.label}</span>
                </span>
                ${item.category ? `<span class="aura-tag tag-slate" style="font-size: 0.6875rem;">${item.category}</span>` : ""}
            </div>
        `).join("");
      overlay.querySelectorAll(".autocomplete-item").forEach((itemEl) => {
        itemEl.addEventListener("click", () => {
          const val = itemEl.getAttribute("data-value");
          const matched = allItems.find((i) => i.value === val);
          if (matched) selectItem(matched);
        });
      });
    }
    const debouncedFilter = useDebounce(() => {
      searchQuery = input.value;
      renderDropdown();
    }, 150);
    input.addEventListener("input", () => {
      if (!disclosure.isOpen) disclosure.open();
      debouncedFilter();
    });
    input.addEventListener("focus", () => {
      if (!disclosure.isOpen) disclosure.open();
    });
    input.addEventListener("keydown", (e) => {
      if (disclosure.isOpen) {
        keyboardNav.handleKeyDown(e);
      }
    });
    clearBtn.addEventListener("click", () => {
      selectedValue = "";
      searchQuery = "";
      input.value = "";
      clearBtn.style.display = "none";
      syncValue();
      disclosure.close();
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
        hidden.value = selectedValue;
      }
      container.dispatchEvent(new CustomEvent("autocomplete:change", {
        bubbles: true,
        detail: { value: selectedValue }
      }));
    }
  }
  var init_autocomplete = __esm({
    "src/components/autocomplete.ts"() {
      "use strict";
      init_lucide();
      init_useDisclosure();
      init_useClickOutside();
      init_useDebounce();
      init_useKeyboardNav();
      init_useTransition();
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

  // src/components/command.ts
  var command_exports = {};
  __export(command_exports, {
    default: () => CommandPaletteIsland
  });
  function CommandPaletteIsland(container, props) {
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
  var init_command = __esm({
    "src/components/command.ts"() {
      "use strict";
      init_lucide();
      init_useDisclosure();
      init_useFocusTrap();
      init_useHotkeys();
      init_useScrollLock();
    }
  });

  // src/components/theme-studio.ts
  var theme_studio_exports = {};
  __export(theme_studio_exports, {
    default: () => ThemeStudioIsland
  });
  function ThemeStudioIsland(container, props = {}) {
    let currentPrimary = "emerald";
    let currentRadius = "0.5rem";
    let currentNeutral = "slate";
    let currentShadow = "layered";
    const disclosure = useDisclosure({ defaultIsOpen: props.defaultOpen });
    const scrollLock = useScrollLock();
    const clipboard = useClipboard();
    container.innerHTML = `
        <div class="laughtale-theme-studio-root">
            <!-- Floating Launch Bubble -->
            <button type="button" 
                    class="theme-studio-toggle-btn" 
                    title="Open TweakAura Theme Studio"
                    style="position: fixed; bottom: 1.5rem; right: 1.5rem; z-index: 5000; width: 3rem; height: 3rem; border-radius: 9999px; background: var(--p-surface-900, #0f172a); color: var(--p-surface-0, #ffffff); border: 2px solid var(--p-primary-500, #10b981); box-shadow: 0 10px 25px -5px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: transform 0.2s ease, box-shadow 0.2s ease; outline: none;">
                ${LucideIcons.palette}
            </button>

            <!-- Backdrop -->
            <div class="theme-studio-backdrop" style="display: none; position: fixed; inset: 0; z-index: 5001; background: rgba(0, 0, 0, 0.4); backdrop-filter: blur(2px);"></div>

            <!-- Slide-in Drawer Panel -->
            <div class="theme-studio-drawer" style="position: fixed; top: 0; right: 0; bottom: 0; width: 100%; max-width: 380px; z-index: 5002; background: var(--p-surface-0, #ffffff); border-left: 1px solid var(--p-border-color, #e2e8f0); box-shadow: -10px 0 25px -5px rgba(0,0,0,0.1); transform: translateX(100%); transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1); display: flex; flex-direction: column;">
                
                <!-- Header -->
                <div style="display: flex; align-items: center; justify-content: space-between; padding: 1.25rem 1.5rem; border-bottom: 1px solid var(--p-border-color, #e2e8f0);">
                    <div style="display: flex; align-items: center; gap: 0.625rem;">
                        <span style="color: var(--p-primary-600); display: flex;">${LucideIcons.sliders || "\u{1F3A8}"}</span>
                        <div>
                            <div style="font-size: 1rem; font-weight: 700; color: var(--p-surface-900);">TweakAura Studio</div>
                            <div style="font-size: 0.75rem; color: var(--p-surface-500);">Live shadcn-Style Theme Editor</div>
                        </div>
                    </div>
                    <button type="button" class="theme-studio-close-btn" style="border: none; background: transparent; color: var(--p-surface-400); cursor: pointer; padding: 0.25rem; display: flex; border-radius: 4px;">
                        ${LucideIcons.x}
                    </button>
                </div>

                <!-- Body Controls -->
                <div style="flex: 1; overflow-y: auto; padding: 1.5rem; display: flex; flex-direction: column; gap: 1.5rem;">
                    
                    <!-- 1. Primary Palette -->
                    <div>
                        <div style="font-size: 0.75rem; font-weight: 700; color: var(--p-surface-500); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.75rem;">Primary Color Palette</div>
                        <div class="studio-color-grid" style="display: grid; grid-template-columns: repeat(6, 1fr); gap: 0.5rem;"></div>
                    </div>

                    <!-- 2. Corner Radius Slider -->
                    <div>
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                            <span style="font-size: 0.75rem; font-weight: 700; color: var(--p-surface-500); text-transform: uppercase; letter-spacing: 0.05em;">Corner Radius</span>
                            <span class="studio-radius-label" style="font-family: monospace; font-size: 0.75rem; color: var(--p-primary-600); font-weight: 600;">0.5rem</span>
                        </div>
                        <div class="studio-radius-presets" style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 0.35rem;">
                            <button type="button" class="radius-btn" data-radius="0rem" style="padding: 0.35rem 0; font-size: 0.75rem; font-family: monospace; border: 1px solid var(--p-border-color); background: var(--p-surface-50); border-radius: 2px; cursor: pointer;">0</button>
                            <button type="button" class="radius-btn" data-radius="0.25rem" style="padding: 0.35rem 0; font-size: 0.75rem; font-family: monospace; border: 1px solid var(--p-border-color); background: var(--p-surface-50); border-radius: 4px; cursor: pointer;">0.25</button>
                            <button type="button" class="radius-btn active" data-radius="0.5rem" style="padding: 0.35rem 0; font-size: 0.75rem; font-family: monospace; border: 1px solid var(--p-primary-600); background: var(--p-primary-50); color: var(--p-primary-700); font-weight: 700; border-radius: 6px; cursor: pointer;">0.5</button>
                            <button type="button" class="radius-btn" data-radius="0.75rem" style="padding: 0.35rem 0; font-size: 0.75rem; font-family: monospace; border: 1px solid var(--p-border-color); background: var(--p-surface-50); border-radius: 8px; cursor: pointer;">0.75</button>
                            <button type="button" class="radius-btn" data-radius="1.0rem" style="padding: 0.35rem 0; font-size: 0.75rem; font-family: monospace; border: 1px solid var(--p-border-color); background: var(--p-surface-50); border-radius: 12px; cursor: pointer;">1.0</button>
                        </div>
                    </div>

                    <!-- 3. Pre-Packaged Themes -->
                    <div>
                        <div style="font-size: 0.75rem; font-weight: 700; color: var(--p-surface-500); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.75rem;">Preset Curated Themes</div>
                        <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                            <button type="button" class="preset-theme-btn" data-theme="emerald-zero-trust" style="display: flex; align-items: center; justify-content: space-between; padding: 0.5rem 0.75rem; border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius); background: var(--p-surface-50); cursor: pointer; text-align: left;">
                                <div style="display: flex; align-items: center; gap: 0.5rem;">
                                    <span style="width: 1rem; height: 1rem; border-radius: 3px; background: #10b981;"></span>
                                    <span style="font-size: 0.8125rem; font-weight: 600; color: var(--p-surface-800);">Emerald Zero-Trust</span>
                                </div>
                                <span style="font-size: 0.6875rem; color: var(--p-surface-400);">Default</span>
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
                            <button type="button" class="preset-theme-btn" data-theme="cyber-cyan" style="display: flex; align-items: center; justify-content: space-between; padding: 0.5rem 0.75rem; border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius); background: var(--p-surface-50); cursor: pointer; text-align: left;">
                                <div style="display: flex; align-items: center; gap: 0.5rem;">
                                    <span style="width: 1rem; height: 1rem; border-radius: 3px; background: #06b6d4;"></span>
                                    <span style="font-size: 0.8125rem; font-weight: 600; color: var(--p-surface-800);">Cyberpunk Cyan</span>
                                </div>
                                <span style="font-size: 0.6875rem; color: var(--p-surface-400);">Radius 0.0</span>
                            </button>
                        </div>
                    </div>

                    <!-- 4. Live Mini Component Preview -->
                    <div style="background: var(--p-surface-50); border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius); padding: 1rem;">
                        <div style="font-size: 0.6875rem; font-weight: 700; color: var(--p-surface-400); text-transform: uppercase; margin-bottom: 0.75rem;">Live Preview</div>
                        <div style="display: flex; flex-direction: column; gap: 0.75rem;">
                            <div style="display: flex; gap: 0.5rem;">
                                <button type="button" class="p-button p-button-primary" style="flex: 1; padding: 0.35rem 0.5rem; font-size: 0.75rem;">Primary</button>
                                <button type="button" class="p-button p-button-secondary" style="flex: 1; padding: 0.35rem 0.5rem; font-size: 0.75rem;">Secondary</button>
                            </div>
                            <input type="text" value="Interactive Input" class="p-input" style="padding: 0.35rem 0.5rem; font-size: 0.75rem;" />
                        </div>
                    </div>

                </div>

                <!-- Footer Export Actions -->
                <div style="padding: 1rem 1.5rem; border-top: 1px solid var(--p-border-color, #e2e8f0); background: var(--p-surface-50, #f8fafc); display: flex; flex-direction: column; gap: 0.5rem;">
                    <button type="button" class="studio-copy-css-btn p-button p-button-primary" style="width: 100%; justify-content: center; font-size: 0.8125rem;">
                        ${LucideIcons.copy} Copy CSS Tokens
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
    const colorGrid = container.querySelector(".studio-color-grid");
    const radiusLabel = container.querySelector(".studio-radius-label");
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
    function applyTheme() {
      const p = PRIMARY_PRESETS[currentPrimary] || PRIMARY_PRESETS.emerald;
      const root = document.documentElement;
      root.style.setProperty("--p-primary-50", p.lightP50);
      root.style.setProperty("--p-primary-100", p.lightP100);
      root.style.setProperty("--p-primary-200", p.lightP200);
      root.style.setProperty("--p-primary-500", p.lightP500);
      root.style.setProperty("--p-primary-600", p.lightP600);
      root.style.setProperty("--p-primary-700", p.lightP700);
      root.style.setProperty("--p-border-radius", currentRadius);
      const radNum = parseFloat(currentRadius);
      root.style.setProperty("--p-border-radius-lg", `${radNum * 1.5}rem`);
      root.style.setProperty("--p-border-radius-xl", `${radNum * 2}rem`);
      radiusLabel.textContent = currentRadius;
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
    colorGrid.querySelectorAll(".studio-color-swatch").forEach((btn) => {
      btn.addEventListener("click", () => {
        currentPrimary = btn.getAttribute("data-color");
        colorGrid.querySelectorAll(".studio-color-swatch").forEach((b) => {
          const k = b.getAttribute("data-color");
          b.style.boxShadow = k === currentPrimary ? "0 0 0 2px var(--p-surface-900)" : "none";
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
        });
        btn.classList.add("active");
        btn.style.borderColor = "var(--p-primary-600)";
        btn.style.background = "var(--p-primary-50)";
        btn.style.color = "var(--p-primary-700)";
        applyTheme();
      });
    });
    container.querySelectorAll(".preset-theme-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const theme = btn.getAttribute("data-theme");
        if (theme === "emerald-zero-trust") {
          currentPrimary = "emerald";
          currentRadius = "0.5rem";
        } else if (theme === "supabase-violet") {
          currentPrimary = "violet";
          currentRadius = "0.375rem";
        } else if (theme === "sunset-ember") {
          currentPrimary = "rose";
          currentRadius = "0.75rem";
        } else if (theme === "cyber-cyan") {
          currentPrimary = "cyan";
          currentRadius = "0rem";
        }
        applyTheme();
      });
    });
    copyCssBtn.addEventListener("click", () => {
      const p = PRIMARY_PRESETS[currentPrimary];
      const cssSnippet = `
:root {
    --p-primary-50: ${p.lightP50};
    --p-primary-100: ${p.lightP100};
    --p-primary-200: ${p.lightP200};
    --p-primary-500: ${p.lightP500};
    --p-primary-600: ${p.lightP600};
    --p-primary-700: ${p.lightP700};
    --p-border-radius: ${currentRadius};
}

html.dark {
    --p-primary-50: ${p.darkP50};
    --p-primary-100: ${p.darkP100};
    --p-primary-200: ${p.darkP200};
}`.trim();
      clipboard.copy(cssSnippet);
      copyCssBtn.innerHTML = `${LucideIcons.check} Copied to Clipboard!`;
      setTimeout(() => {
        copyCssBtn.innerHTML = `${LucideIcons.copy} Copy CSS Tokens`;
      }, 2e3);
    });
    copyCSharpBtn.addEventListener("click", () => {
      const p = PRIMARY_PRESETS[currentPrimary];
      const csharpSnippet = `
public static class AppTheme
{
    public const string PrimaryHex = "${p.hex}";
    public const string PrimaryName = "${p.name}";
    public const string BorderRadius = "${currentRadius}";
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
  var PRIMARY_PRESETS;
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
  var init_dynamic_form = __esm({
    "src/components/dynamic-form.ts"() {
      "use strict";
      init_lucide();
    }
  });

  // src/components/splitter.ts
  var splitter_exports = {};
  __export(splitter_exports, {
    default: () => SplitterIsland
  });
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
  var init_splitter = __esm({
    "src/components/splitter.ts"() {
      "use strict";
      init_useDragGesture();
    }
  });

  // src/components/multiselect.ts
  var multiselect_exports = {};
  __export(multiselect_exports, {
    default: () => MultiSelectIsland
  });
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
  var init_multiselect = __esm({
    "src/components/multiselect.ts"() {
      "use strict";
      init_lucide();
      init_useDisclosure();
      init_useClickOutside();
      init_useTransition();
    }
  });

  // src/components/cascadeselect.ts
  var cascadeselect_exports = {};
  __export(cascadeselect_exports, {
    default: () => CascadeSelectIsland
  });
  function CascadeSelectIsland(container, props) {
    const options = props.options || [];
    let selectedText = "";
    let selectedValue = null;
    container.innerHTML = `
        <div class="laughtale-cascadeselect" style="position: relative; width: 100%; max-width: 280px; font-family: var(--p-font-family, inherit);">
            <!-- Trigger -->
            <div class="cascadeselect-trigger p-input" style="display: flex; align-items: center; justify-content: space-between; padding: 0.5rem 0.75rem; cursor: ${props.disabled ? "not-allowed" : "pointer"}; background: var(--p-surface-0); border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius); user-select: none;">
                <span class="cascadeselect-label" style="font-size: 0.875rem; color: var(--p-text-color);">${props.placeholder || "Select category..."}</span>
                <span class="cascadeselect-chevron" style="color: var(--p-surface-400); display: flex;">${LucideIcons.chevronDown}</span>
            </div>

            <!-- Cascade Overlay Panes Container -->
            <div class="cascadeselect-overlay" style="display: none; position: absolute; top: calc(100% + 4px); left: 0; z-index: 500; background: var(--p-surface-0); border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius-lg); box-shadow: var(--p-shadow-lg); min-width: 180px;">
                <div class="cascade-level-0" style="padding: 0.25rem 0; min-width: 180px;"></div>
            </div>
        </div>
    `;
    const trigger = container.querySelector(".cascadeselect-trigger");
    const label = container.querySelector(".cascadeselect-label");
    const overlay = container.querySelector(".cascadeselect-overlay");
    const level0 = container.querySelector(".cascade-level-0");
    const disclosure = useDisclosure({
      defaultIsOpen: false,
      onOpen: () => {
        renderLevel(options, level0, []);
        useTransition(overlay, { type: "fade", isMounted: true });
      },
      onClose: () => {
        useTransition(overlay, { type: "fade", isMounted: false });
      }
    });
    useClickOutside(container, () => disclosure.close());
    function renderLevel(nodes, parentContainer, path = []) {
      parentContainer.innerHTML = nodes.map((n) => {
        const hasChildren = n.children && n.children.length > 0;
        return `
                <div class="cascade-item" data-code="${n.code || n.name}" style="position: relative; display: flex; align-items: center; justify-content: space-between; padding: 0.45rem 0.75rem; cursor: pointer; font-size: 0.8125rem; color: var(--p-text-color); transition: background 0.1s ease;">
                    <span>${n.name}</span>
                    ${hasChildren ? `<span style="color: var(--p-surface-400); display: flex;">${LucideIcons.chevronRight}</span>` : ""}
                    ${hasChildren ? `<div class="sub-pane" style="display: none; position: absolute; top: 0; left: 100%; min-width: 180px; background: var(--p-surface-0); border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius-lg); box-shadow: var(--p-shadow-lg); padding: 0.25rem 0;"></div>` : ""}
                </div>
            `;
      }).join("");
      parentContainer.querySelectorAll(".cascade-item").forEach((itemEl, idx) => {
        const node = nodes[idx];
        const currentPath = [...path, node.name];
        if (node.children && node.children.length > 0) {
          const subPane = itemEl.querySelector(".sub-pane");
          itemEl.addEventListener("mouseenter", () => {
            renderLevel(node.children, subPane, currentPath);
            subPane.style.display = "block";
          });
          itemEl.addEventListener("mouseleave", () => {
            subPane.style.display = "none";
          });
        } else {
          itemEl.addEventListener("click", (e) => {
            e.stopPropagation();
            selectedText = currentPath.join(" / ");
            selectedValue = node.code || node.name;
            label.textContent = selectedText;
            disclosure.close();
            syncValue();
          });
        }
      });
    }
    trigger.addEventListener("click", () => {
      if (props.disabled) return;
      disclosure.toggle();
    });
    function syncValue() {
      if (props.targetInputName && selectedValue !== null) {
        let hidden = container.querySelector(`input[name="${props.targetInputName}"]`);
        if (!hidden) {
          hidden = document.createElement("input");
          hidden.type = "hidden";
          hidden.name = props.targetInputName;
          container.appendChild(hidden);
        }
        hidden.value = String(selectedValue);
      }
      container.dispatchEvent(new CustomEvent("cascadeselect:change", {
        bubbles: true,
        detail: { value: selectedValue, text: selectedText }
      }));
    }
  }
  var init_cascadeselect = __esm({
    "src/components/cascadeselect.ts"() {
      "use strict";
      init_lucide();
      init_useDisclosure();
      init_useClickOutside();
      init_useTransition();
    }
  });

  // src/components/listbox.ts
  var listbox_exports = {};
  __export(listbox_exports, {
    default: () => ListboxIsland
  });
  function ListboxIsland(container, props) {
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
  var init_listbox = __esm({
    "src/components/listbox.ts"() {
      "use strict";
      init_lucide();
      init_useKeyboardNav();
      init_useDebounce();
    }
  });

  // src/components/picklist.ts
  var picklist_exports = {};
  __export(picklist_exports, {
    default: () => PickListIsland
  });
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
  var init_picklist = __esm({
    "src/components/picklist.ts"() {
      "use strict";
      init_lucide();
      init_useAutoAnimate();
    }
  });

  // src/components/orderlist.ts
  var orderlist_exports = {};
  __export(orderlist_exports, {
    default: () => OrderListIsland
  });
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
  var init_orderlist = __esm({
    "src/components/orderlist.ts"() {
      "use strict";
      init_useAutoAnimate();
    }
  });

  // src/components/orgchart.ts
  var orgchart_exports = {};
  __export(orgchart_exports, {
    default: () => OrgChartIsland
  });
  function OrgChartIsland(container, props) {
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
  var init_orgchart = __esm({
    "src/components/orgchart.ts"() {
      "use strict";
    }
  });

  // src/components/terminal.ts
  var terminal_exports = {};
  __export(terminal_exports, {
    default: () => TerminalIsland
  });
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
  var init_terminal = __esm({
    "src/components/terminal.ts"() {
      "use strict";
      init_useClipboard();
    }
  });

  // src/components/dock.ts
  var dock_exports = {};
  __export(dock_exports, {
    default: () => DockIsland
  });
  function DockIsland(container, props) {
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
  var init_dock = __esm({
    "src/components/dock.ts"() {
      "use strict";
      init_lucide();
    }
  });

  // src/components/galleria.ts
  var galleria_exports = {};
  __export(galleria_exports, {
    default: () => GalleriaIsland
  });
  function GalleriaIsland(container, props) {
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
  var init_galleria = __esm({
    "src/components/galleria.ts"() {
      "use strict";
      init_lucide();
    }
  });

  // src/components/blockui.ts
  var blockui_exports = {};
  __export(blockui_exports, {
    default: () => BlockUIIsland
  });
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
  var init_blockui = __esm({
    "src/components/blockui.ts"() {
      "use strict";
    }
  });

  // src/components/split-button.ts
  var split_button_exports = {};
  __export(split_button_exports, {
    default: () => SplitButtonIsland
  });
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
  var init_split_button = __esm({
    "src/components/split-button.ts"() {
      "use strict";
      init_lucide();
      init_useDisclosure();
      init_useClickOutside();
      init_useTransition();
    }
  });

  // src/index.ts
  var index_exports = {};
  __export(index_exports, {
    LucideIcons: () => LucideIcons,
    awaitStreamingReady: () => awaitStreamingReady,
    createPreactIsland: () => createPreactIsland,
    createVanillaIsland: () => createVanillaIsland,
    defineIsland: () => defineIsland,
    enableViewTransitions: () => enableViewTransitions,
    extractSlotContent: () => extractSlotContent,
    getIslandDefinition: () => getIslandDefinition,
    getLucideIcon: () => getLucideIcon,
    getSlot: () => getSlot,
    hasIsland: () => hasIsland,
    hydrateIsland: () => hydrateIsland,
    importWithRetry: () => importWithRetry,
    initDirectives: () => initDirectives,
    initIslands: () => initIslands,
    injectIslandStyle: () => injectIslandStyle,
    navigateTo: () => navigateTo,
    parseAndReviveProps: () => parseAndReviveProps,
    reviveTuple: () => reviveTuple,
    useAutoAnimate: () => useAutoAnimate,
    useClickOutside: () => useClickOutside,
    useClipboard: () => useClipboard,
    useControllableState: () => useControllableState,
    useDebounce: () => useDebounce,
    useDisclosure: () => useDisclosure,
    useDragGesture: () => useDragGesture,
    useEventListener: () => useEventListener,
    useFloatingPosition: () => useFloatingPosition,
    useFocusTrap: () => useFocusTrap,
    useHotkeys: () => useHotkeys,
    useKeyboardNav: () => useKeyboardNav,
    useMorphLayout: () => useMorphLayout,
    useScrollLock: () => useScrollLock,
    useSpring: () => useSpring,
    useStagger: () => useStagger,
    useThrottle: () => useThrottle,
    useTransition: () => useTransition,
    useVirtualizer: () => useVirtualizer
  });
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
    }
  });
  init_index();
  return __toCommonJS(index_exports);
})();
//# sourceMappingURL=index.js.map
