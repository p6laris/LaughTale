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

  // src/icons/solar.ts
  function getSolarIcon(name) {
    return SolarIcons[name] || "";
  }
  var SolarIcons;
  var init_solar = __esm({
    "src/icons/solar.ts"() {
      "use strict";
      SolarIcons = {
        check: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor" d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2S2 6.477 2 12s4.477 10 10 10" opacity=".5"/><path fill="currentColor" d="m10.5 15.5l7-7l-1.4-1.4l-5.6 5.6l-2.6-2.6l-1.4 1.4z"/></svg>`,
        close: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor" d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2S2 6.477 2 12s4.477 10 10 10" opacity=".5"/><path fill="currentColor" d="m13.41 12l3.3-3.29a1 1 0 1 0-1.42-1.42L12 10.59l-3.29-3.3a1 1 0 0 0-1.42 1.42l3.3 3.29l-3.3 3.29a1 1 0 0 0 1.42 1.42l3.29-3.3l3.29 3.3a1 1 0 0 0 1.42-1.42z"/></svg>`,
        eye: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12S6.477 2 12 2" opacity=".5"/><path fill="currentColor" d="M12 9a3 3 0 1 0 0 6a3 3 0 0 0 0-6m-7 3c1.73-3.04 4.19-5 7-5s5.27 1.96 7 5c-1.73 3.04-4.19 5-7 5s-5.27-1.96-7-5"/></svg>`,
        eyeClosed: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor" d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2S2 6.477 2 12s4.477 10 10 10" opacity=".5"/><path fill="currentColor" d="M2.71 3.71a1 1 0 0 0 0 1.42l2.36 2.36C3.76 8.76 2.66 10.27 2 12c1.73 3.04 4.19 5 7 5c1.76 0 3.37-.77 4.7-1.94l3.59 3.59a1 1 0 0 0 1.42-1.42l-16-16zM12 15a3 3 0 0 1-2.91-2.27l3.18 3.18c-.09.06-.18.09-.27.09"/></svg>`,
        star: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2l3.09 6.26L22 9.27l-5 4.87l1.18 6.88L12 17.77l-6.18 3.25L7 14.14L2 9.27l6.91-1.01z"/></svg>`,
        starEmpty: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="2" d="M12 2l3.09 6.26L22 9.27l-5 4.87l1.18 6.88L12 17.77l-6.18 3.25L7 14.14L2 9.27l6.91-1.01z"/></svg>`,
        calendar: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor" d="M8 2a1 1 0 0 1 1 1v1h6V3a1 1 0 1 1 2 0v1h1a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3h1V3a1 1 0 0 1 1-1m11 7H5v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1z"/></svg>`,
        chevronLeft: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m15 19l-7-7l7-7"/></svg>`,
        chevronRight: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m9 5l7 7l-7 7"/></svg>`,
        plus: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v14m-7-7h14"/></svg>`,
        minus: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14"/></svg>`,
        dollar: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2a1 1 0 0 1 1 1v1.06c2.58.33 4 2.05 4 4.19a1 1 0 1 1-2 0c0-1.12-.76-2.19-2-2.25V11c2.67.67 4 1.83 4 4.25c0 2.2-1.46 3.96-4 4.25V21a1 1 0 1 1-2 0v-1.06c-2.58-.33-4-2.05-4-4.19a1 1 0 1 1 2 0c0 1.12.76 2.19 2 2.25v-5c-2.67-.67-4-1.83-4-4.25c0-2.2 1.46-3.96 4-4.25V3a1 1 0 0 1 1-1"/></svg>`,
        bolt: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><path fill="currentColor" d="M11 21h-1l1-7H7.5c-.58 0-.57-.32-.38-.66c.19-.34.05-.08.08-.14C8.58 10.61 10.74 6.8 13.7 2h1l-1 7h3.5c.49 0 .56.33.47.51l-.07.13z"/></svg>`,
        home: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2L2 12h3v8h6v-6h2v6h6v-8h3z"/></svg>`
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
                        <button type="button" class="btn-step-up" style="flex: 1; border: none; background: var(--p-surface-50); color: var(--p-surface-600); cursor: pointer; display: flex; align-items: center; justify-content: center; border-bottom: 1px solid var(--p-border-color); font-size: 0.625rem; transition: background 0.15s ease;">
                            \u25B2
                        </button>
                        <button type="button" class="btn-step-down" style="flex: 1; border: none; background: var(--p-surface-50); color: var(--p-surface-600); cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 0.625rem; transition: background 0.15s ease;">
                            \u25BC
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
                            ${isMasked ? getSolarIcon("eye") : getSolarIcon("eyeClosed")}
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
      init_solar();
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
                    ${getSolarIcon("star")}
                </span>
            `;
      }).join("");
      container.innerHTML = `
            <div class="laughtale-rating" style="display: inline-flex; align-items: center; gap: 0.35rem; user-select: none;">
                ${props.allowCancel !== false ? `
                    <button type="button" class="rating-cancel-btn" style="border: none; background: transparent; color: var(--p-surface-400); cursor: pointer; display: flex; align-items: center; padding: 0 0.25rem;">
                        ${getSolarIcon("close")}
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
      init_solar();
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
                        ${getSolarIcon("close")}
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
      init_solar();
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
                    <span style="color: var(--p-surface-500); display: flex; align-items: center;">${getSolarIcon("calendar")}</span>
                </div>

                <!-- Calendar Popup Overlay -->
                <div class="dp-overlay" style="display: ${isOpen ? "block" : "none"}; position: absolute; top: calc(100% + 4px); left: 0; z-index: 500; background: var(--p-surface-0); border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius-lg); box-shadow: var(--p-shadow-lg); padding: 1rem; width: 280px;">
                    <!-- Calendar Header -->
                    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.75rem;">
                        <button type="button" class="btn-prev-month" style="border: none; background: transparent; color: var(--p-surface-600); cursor: pointer; display: flex; align-items: center; padding: 0.25rem;">
                            ${getSolarIcon("chevronLeft")}
                        </button>
                        <div style="font-size: 0.875rem; font-weight: 700; color: var(--p-surface-900);">
                            ${monthNames[viewMonth]} ${viewYear}
                        </div>
                        <button type="button" class="btn-next-month" style="border: none; background: transparent; color: var(--p-surface-600); cursor: pointer; display: flex; align-items: center; padding: 0.25rem;">
                            ${getSolarIcon("chevronRight")}
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
      init_solar();
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
                            ${getSolarIcon("close")}
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
      init_solar();
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
                ${act.icon || getSolarIcon("bolt")}
            </button>
        `).join("");
      container.innerHTML = `
            <div class="laughtale-speed-dial" style="position: relative; display: inline-flex; flex-direction: column-reverse; align-items: center; gap: 0.75rem;">
                <!-- Main FAB Button -->
                <button type="button" class="speed-dial-main-btn" style="width: 3.25rem; height: 3.25rem; border-radius: 50%; border: none; background: var(--p-primary-600); color: #ffffff; box-shadow: var(--p-shadow-lg); cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 1.25rem; transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1); transform: rotate(${isOpen ? "45deg" : "0deg"});">
                    ${isOpen ? getSolarIcon("plus") : getSolarIcon("plus")}
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
      init_solar();
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
                    <span style="color: #f59e0b; font-size: 1.25rem;">\u26A0\uFE0F</span>
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
    }
  });

  // src/index.ts
  var index_exports = {};
  __export(index_exports, {
    SolarIcons: () => SolarIcons,
    awaitStreamingReady: () => awaitStreamingReady,
    createPreactIsland: () => createPreactIsland,
    createVanillaIsland: () => createVanillaIsland,
    defineIsland: () => defineIsland,
    enableViewTransitions: () => enableViewTransitions,
    extractSlotContent: () => extractSlotContent,
    getIslandDefinition: () => getIslandDefinition,
    getSlot: () => getSlot,
    getSolarIcon: () => getSolarIcon,
    hasIsland: () => hasIsland,
    hydrateIsland: () => hydrateIsland,
    importWithRetry: () => importWithRetry,
    initDirectives: () => initDirectives,
    initIslands: () => initIslands,
    injectIslandStyle: () => injectIslandStyle,
    navigateTo: () => navigateTo,
    parseAndReviveProps: () => parseAndReviveProps,
    reviveTuple: () => reviveTuple
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
      init_solar();
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
    }
  });
  init_index();
  return __toCommonJS(index_exports);
})();
//# sourceMappingURL=index.js.map
