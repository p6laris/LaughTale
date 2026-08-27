import {
  bindElementReactivity,
  createReactiveScope,
  evaluateExpression,
  executeStatement,
  getNearestScope
} from "./chunk-RQ5UXIGU.js";

// ../SoftMax.LaughTale.Client/src/runtime/registry.ts
var registry = /* @__PURE__ */ new Map();
function defineIsland(name, loader) {
  registry.set(name, loader);
}
function getIslandDefinition(name) {
  const loader = registry.get(name);
  return loader ? { name, loader } : void 0;
}

// ../SoftMax.LaughTale.Client/src/runtime/reviver.ts
var ISO_DATE_REGEX = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})?)?$/;
var propTypes = {
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

// ../SoftMax.LaughTale.Client/src/runtime/retry.ts
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

// ../SoftMax.LaughTale.Client/src/runtime/streaming.ts
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

// ../SoftMax.LaughTale.Client/src/runtime/hydrator.ts
var HYDRATED_FLAG = "__laughtale_hydrated";
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

// ../SoftMax.LaughTale.Client/src/directives/events.ts
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

// ../SoftMax.LaughTale.Client/src/directives/htmx.ts
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

// ../SoftMax.LaughTale.Client/src/directives/masking.ts
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

// ../SoftMax.LaughTale.Client/src/directives/utils.ts
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

// ../SoftMax.LaughTale.Client/src/directives/hotkey.ts
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

// ../SoftMax.LaughTale.Client/src/directives/tooltip.ts
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

// ../SoftMax.LaughTale.Client/src/directives/outside.ts
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

// ../SoftMax.LaughTale.Client/src/directives/storage.ts
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

// ../SoftMax.LaughTale.Client/src/directives/poll.ts
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

// ../SoftMax.LaughTale.Client/src/directives/intersect.ts
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

// ../SoftMax.LaughTale.Client/src/directives/scroll.ts
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

// ../SoftMax.LaughTale.Client/src/directives/badge.ts
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

// ../SoftMax.LaughTale.Client/src/directives/teleport.ts
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

// ../SoftMax.LaughTale.Client/src/directives/index.ts
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
        import("./reactivity-F3SKD4OT.js").then(({ getNearestScope: getNearestScope2 }) => {
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
if (typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => initDirectives());
  } else {
    initDirectives();
  }
}

// ../SoftMax.LaughTale.Client/src/runtime/router.ts
var isRouterActive = false;
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

// ../SoftMax.LaughTale.Client/src/runtime/slots.ts
function getSlot(container, name = "default") {
  return container.querySelector(`[data-slot="${name}"]`);
}

// ../SoftMax.LaughTale.Client/src/index.ts
defineIsland("stepper", () => import("./stepper-YDR6TDZ5.js"));
defineIsland("timeline", () => import("./timeline-RNI3KT3N.js"));
defineIsland("camera", () => import("./camera-KAAHJRTE.js"));
defineIsland("dropzone", () => import("./dropzone-E76UIQBF.js"));
defineIsland("tree", () => import("./tree-Z4YCN4WI.js"));
defineIsland("treetable", () => import("./treetable-STGV6W5W.js"));
defineIsland("tree-table", () => import("./treetable-STGV6W5W.js"));
defineIsland("tree-select", () => import("./tree-select-3WADBRSW.js"));
defineIsland("datatable", () => import("./datatable-FJYSSBES.js"));
defineIsland("datagrid", () => import("./datatable-FJYSSBES.js"));
defineIsland("modal", () => import("./modal-DU3W2B2O.js"));
defineIsland("toast", () => import("./toast-WLFO7J5G.js"));
defineIsland("input-number", () => import("./input-number-KQ2J2WMH.js"));
defineIsland("input-otp", () => import("./input-otp-RUPMATZ7.js"));
defineIsland("input-password", () => import("./input-password-2MPZDMLV.js"));
defineIsland("toggle-switch", () => import("./toggle-switch-PKZ2Z2DJ.js"));
defineIsland("toggle-button", () => import("./toggle-button-CMCYSVIB.js"));
defineIsland("togglebutton", () => import("./toggle-button-CMCYSVIB.js"));
defineIsland("button", () => import("./button-KEJAQ5EZ.js"));
defineIsland("slider", () => import("./slider-UV27YNGE.js"));
defineIsland("rating", () => import("./rating-RN6FXTFU.js"));
defineIsland("select-button", () => import("./select-button-OXEBA4HJ.js"));
defineIsland("chips", () => import("./input-tags-DM2GIV37.js"));
defineIsland("input-tags", () => import("./input-tags-DM2GIV37.js"));
defineIsland("inputtags", () => import("./input-tags-DM2GIV37.js"));
defineIsland("tags", () => import("./input-tags-DM2GIV37.js"));
defineIsland("datepicker", () => import("./datepicker-LVF24L7M.js"));
defineIsland("meter-group", () => import("./meter-group-LDZQKTKU.js"));
defineIsland("avatar-group", () => import("./avatar-group-VNSODI34.js"));
defineIsland("progress-bar", () => import("./progress-bar-FCJC5G3P.js"));
defineIsland("skeleton", () => import("./skeleton-4CLSEMFH.js"));
defineIsland("drawer", () => import("./drawer-IT2PLXIN.js"));
defineIsland("speed-dial", () => import("./speed-dial-DDAZL72V.js"));
defineIsland("image-compare", () => import("./image-compare-6BR2BVQR.js"));
defineIsland("confirm-popup", () => import("./confirm-popup-BEUGNVJP.js"));
defineIsland("scrollarea", () => import("./scrollarea-P6ZIAY6W.js"));
defineIsland("panel", () => import("./panel-6YY5LZTY.js"));
defineIsland("fieldset", () => import("./fieldset-ROG5PKGM.js"));
defineIsland("divider", () => import("./divider-VDZXMYK7.js"));
defineIsland("card", () => import("./card-KVZGT5KH.js"));
defineIsland("accordion", () => import("./accordion-BOH5KS7S.js"));
defineIsland("tabs", () => import("./tabs-TMFGXLWQ.js"));
defineIsland("toolbar", () => import("./toolbar-VX2UT74A.js"));
defineIsland("autocomplete", () => import("./autocomplete-RVYP54K4.js"));
defineIsland("color-picker", () => import("./color-picker-VDAKHERO.js"));
defineIsland("knob", () => import("./knob-QRIVX7GP.js"));
defineIsland("tag", () => import("./tag-4UVJKKNI.js"));
defineIsland("breadcrumb", () => import("./breadcrumb-BPOGWDWU.js"));
defineIsland("scroll-top", () => import("./scroll-top-WFJEPRKB.js"));
defineIsland("inplace", () => import("./inplace-YJ5SS246.js"));
defineIsland("command", () => import("./command-TIPBYJOC.js"));
defineIsland("theme-studio", () => import("./theme-studio-GRGGOQAW.js"));
defineIsland("dynamic-form", () => import("./dynamic-form-HHKJKPG7.js"));
defineIsland("splitter", () => import("./splitter-LDRSJA4P.js"));
defineIsland("multiselect", () => import("./multiselect-3EIAIKUW.js"));
defineIsland("cascadeselect", () => import("./cascadeselect-IUDOWSIX.js"));
defineIsland("listbox", () => import("./listbox-XPMKTRZC.js"));
defineIsland("picklist", () => import("./picklist-BDC3JMBS.js"));
defineIsland("orderlist", () => import("./orderlist-M32EVB6A.js"));
defineIsland("orgchart", () => import("./orgchart-ZZ2CTL4E.js"));
defineIsland("terminal", () => import("./terminal-5GNPD7X2.js"));
defineIsland("dock", () => import("./dock-4NFTCE7J.js"));
defineIsland("galleria", () => import("./galleria-M3PRIDVU.js"));
defineIsland("blockui", () => import("./blockui-GN5ZCXLR.js"));
defineIsland("split-button", () => import("./split-button-NMO6NCEV.js"));
defineIsland("select", () => import("./select-TGXZDD3R.js"));
defineIsland("checkbox", () => import("./checkbox-HGN6NTDP.js"));
defineIsland("radio-button", () => import("./radio-button-F6BD7CA4.js"));
defineIsland("radio", () => import("./radio-button-F6BD7CA4.js"));
defineIsland("textarea", () => import("./textarea-BBEDGOBT.js"));
defineIsland("input-mask", () => import("./input-mask-2NYG3JKC.js"));
defineIsland("float-label", () => import("./float-label-T62JBL5G.js"));
defineIsland("ifta-label", () => import("./ifta-label-7XAPRVSY.js"));
defineIsland("input-group", () => import("./input-group-SYXCWTLZ.js"));
defineIsland("input-group-addon", () => import("./input-group-SYXCWTLZ.js").then((m) => ({ default: m.InputGroupAddonIsland })));
defineIsland("inputgroup", () => import("./input-group-SYXCWTLZ.js"));
defineIsland("inputgroup-addon", () => import("./input-group-SYXCWTLZ.js").then((m) => ({ default: m.InputGroupAddonIsland })));
defineIsland("input-text", () => import("./input-text-N5PAAEU3.js"));
defineIsland("enhanced-input", () => import("./input-text-N5PAAEU3.js"));
defineIsland("carousel", () => import("./carousel-YCWS2HUB.js"));
defineIsland("paginator", () => import("./paginator-NY74SK5Q.js"));
defineIsland("dataview", () => import("./dataview-7JZHVNBV.js"));
defineIsland("menu", () => import("./menu-3E34L5JL.js"));
defineIsland("context-menu", () => import("./context-menu-LU6WIMC7.js"));
defineIsland("popover", () => import("./popover-WX66D4GV.js"));
defineIsland("tooltip", () => import("./tooltip-component-ITV3NTAM.js"));
defineIsland("tooltip-component", () => import("./tooltip-component-ITV3NTAM.js"));
defineIsland("sidebar", () => import("./sidebar-WZP7ZAUW.js"));

export {
  defineIsland,
  initIslands,
  initDirectives,
  enableViewTransitions,
  getSlot
};
//# sourceMappingURL=chunk-NRH5PZ2E.js.map
