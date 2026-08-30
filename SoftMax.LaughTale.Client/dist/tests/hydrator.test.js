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
globalThis.DOMParser = win.DOMParser;
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

// tests/hydrator.test.ts
import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";

// src/runtime/registry.ts
var registry = /* @__PURE__ */ new Map();
function defineIsland(name, loader) {
  registry.set(name, loader);
}
function getIslandDefinition(name) {
  const loader = registry.get(name);
  return loader ? { name, loader } : void 0;
}

// src/runtime/reviver.ts
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

// src/runtime/hydrator.ts
var HYDRATION_STATE_KEY = "__laughtale_state__";
var visibleElementsMap = /* @__PURE__ */ new WeakMap();
var sharedVisibleObserver = null;
function getSharedVisibleObserver() {
  if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
    return null;
  }
  if (!sharedVisibleObserver) {
    sharedVisibleObserver = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          const meta = visibleElementsMap.get(entry.target);
          if (meta) {
            unobserveVisibleIsland(meta.container);
            executeHydration(meta.container, meta.name);
          }
        }
      }
    }, { rootMargin: "120px" });
  }
  return sharedVisibleObserver;
}
function unobserveVisibleIsland(container) {
  const observer = getSharedVisibleObserver();
  if (!observer) return;
  observer.unobserve(container);
  visibleElementsMap.delete(container);
  for (let i = 0; i < container.children.length; i++) {
    observer.unobserve(container.children[i]);
    visibleElementsMap.delete(container.children[i]);
  }
}
function getIslandState(container) {
  return container[HYDRATION_STATE_KEY] || "idle";
}
function hydrateIsland(container) {
  if (getIslandState(container) !== "idle") return;
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
async function retryIsland(container) {
  const name = container.getAttribute("data-island") || container.getAttribute("name");
  if (!name) return;
  container[HYDRATION_STATE_KEY] = "idle";
  await executeHydration(container, name);
}
async function executeHydration(container, name) {
  const currentState = getIslandState(container);
  if (currentState === "pending" || currentState === "mounted" || currentState === "failed") {
    return;
  }
  container[HYDRATION_STATE_KEY] = "pending";
  const definition = getIslandDefinition(name);
  if (!definition) {
    container[HYDRATION_STATE_KEY] = "failed";
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
      throw new Error(`Island '${name}' module does not export a mount function.`);
    }
    const unmount = mount(container, props);
    if (typeof unmount === "function") {
      container.addEventListener("laughtale:unmount", unmount, { once: true });
    }
    container[HYDRATION_STATE_KEY] = "mounted";
    container.dispatchEvent(new CustomEvent("laughtale:hydrated", {
      bubbles: true,
      composed: true,
      detail: { name, strategy: container.getAttribute("data-hydrate") }
    }));
  } catch (error) {
    container[HYDRATION_STATE_KEY] = "failed";
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
  const observer = getSharedVisibleObserver();
  if (!observer) {
    executeHydration(container, name);
    return;
  }
  const meta = { container, name };
  visibleElementsMap.set(container, meta);
  observer.observe(container);
  for (let i = 0; i < container.children.length; i++) {
    visibleElementsMap.set(container.children[i], meta);
    observer.observe(container.children[i]);
  }
  container.addEventListener("laughtale:unmount", () => {
    unobserveVisibleIsland(container);
  }, { once: true });
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

// tests/hydrator.test.ts
describe("Hydrator Tri-State & Shared Viewport Observer Suite (LT-205, LT-206)", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });
  it("hydrateIsland: transitions from idle to pending to mounted on success", async () => {
    let mounted = false;
    defineIsland("success-widget", () => Promise.resolve({
      default: (el) => {
        mounted = true;
      }
    }));
    const container = document.createElement("div");
    container.setAttribute("data-island", "success-widget");
    container.setAttribute("data-hydrate", "load");
    document.body.appendChild(container);
    assert.equal(getIslandState(container), "idle");
    hydrateIsland(container);
    await new Promise((r) => setTimeout(r, 20));
    assert.equal(mounted, true);
    assert.equal(getIslandState(container), "mounted");
  });
  it("hydrateIsland: transitions to failed and dispatches exactly one laughtale:hydration-error on mount throw", async () => {
    let errorEventsCount = 0;
    let caughtError = null;
    defineIsland("failing-widget", () => Promise.resolve({
      default: () => {
        throw new Error("Mount runtime explosion!");
      }
    }));
    const container = document.createElement("div");
    container.setAttribute("data-island", "failing-widget");
    container.setAttribute("data-hydrate", "load");
    container.addEventListener("laughtale:hydration-error", (e) => {
      errorEventsCount++;
      caughtError = e.detail?.error;
    });
    document.body.appendChild(container);
    hydrateIsland(container);
    await new Promise((r) => setTimeout(r, 20));
    assert.equal(getIslandState(container), "failed");
    assert.equal(errorEventsCount, 1, "Expected exactly one hydration error event");
    assert.ok(caughtError?.message.includes("Mount runtime explosion!"));
    hydrateIsland(container);
    await new Promise((r) => setTimeout(r, 20));
    assert.equal(errorEventsCount, 1, "Hydration error event was triggered multiple times on failed island");
  });
  it("hydrateIsland: ignores concurrent interaction events while pending", async () => {
    let loaderInvocationCount = 0;
    defineIsland("slow-widget", () => {
      loaderInvocationCount++;
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            default: (el) => {
            }
          });
        }, 50);
      });
    });
    const container = document.createElement("div");
    container.setAttribute("data-island", "slow-widget");
    container.setAttribute("data-hydrate", "interaction");
    document.body.appendChild(container);
    hydrateIsland(container);
    container.dispatchEvent(new Event("mouseenter"));
    container.dispatchEvent(new Event("focusin"));
    container.dispatchEvent(new Event("click"));
    await new Promise((r) => setTimeout(r, 80));
    assert.equal(loaderInvocationCount, 1, "Loader was invoked multiple times concurrently");
    assert.equal(getIslandState(container), "mounted");
  });
  it("retryIsland: resets failed state and re-attempts hydration to success", async () => {
    let shouldFail = true;
    let mountCount = 0;
    defineIsland("retryable-widget", () => Promise.resolve({
      default: () => {
        if (shouldFail) {
          throw new Error("First attempt fail");
        }
        mountCount++;
      }
    }));
    const container = document.createElement("div");
    container.setAttribute("data-island", "retryable-widget");
    container.setAttribute("data-hydrate", "load");
    document.body.appendChild(container);
    hydrateIsland(container);
    await new Promise((r) => setTimeout(r, 20));
    assert.equal(getIslandState(container), "failed");
    assert.equal(mountCount, 0);
    shouldFail = false;
    await retryIsland(container);
    await new Promise((r) => setTimeout(r, 20));
    assert.equal(getIslandState(container), "mounted");
    assert.equal(mountCount, 1, "Island was not mounted after retry");
  });
  it("hydrateVisible: 100 visible-strategy islands share exactly 1 IntersectionObserver instance (LT-206)", () => {
    let observerInstancesCreated = 0;
    let totalObservedElements = 0;
    let totalUnobservedElements = 0;
    const originalObserver = globalThis.IntersectionObserver;
    class MockIntersectionObserver {
      constructor(callback, options) {
        this.callback = callback;
        this.options = options;
        observerInstancesCreated++;
      }
      observe(target) {
        totalObservedElements++;
      }
      unobserve(target) {
        totalUnobservedElements++;
      }
      disconnect() {
      }
    }
    globalThis.IntersectionObserver = MockIntersectionObserver;
    try {
      const islands = [];
      for (let i = 0; i < 100; i++) {
        defineIsland(`visible-card-${i}`, () => Promise.resolve({ default: () => {
        } }));
        const el = document.createElement("div");
        el.setAttribute("data-island", `visible-card-${i}`);
        el.setAttribute("data-hydrate", "visible");
        document.body.appendChild(el);
        islands.push(el);
        hydrateIsland(el);
      }
      assert.equal(observerInstancesCreated, 1, "Expected exactly 1 shared IntersectionObserver instance for 100 islands");
      assert.equal(totalObservedElements, 100, "Expected 100 elements to be observed");
      for (let i = 0; i < 20; i++) {
        islands[i].dispatchEvent(new CustomEvent("laughtale:unmount"));
      }
      assert.equal(totalUnobservedElements, 20, "Expected 20 elements to be unobserved on unmount");
    } finally {
      globalThis.IntersectionObserver = originalObserver;
    }
  });
});
