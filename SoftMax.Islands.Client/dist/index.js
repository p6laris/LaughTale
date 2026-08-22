"use strict";
var SoftMaxIslands = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
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
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // src/index.ts
  var index_exports = {};
  __export(index_exports, {
    IslandStore: () => IslandStore,
    defineIsland: () => defineIsland,
    destroyIsland: () => destroyIsland,
    emitIslandEvent: () => emitIslandEvent,
    enableViewTransitions: () => enableViewTransitions,
    extractSlotContent: () => extractSlotContent,
    getIslandLoader: () => getIslandLoader,
    getSlot: () => getSlot,
    hasIsland: () => hasIsland,
    hydrateIsland: () => hydrateIsland,
    initIslands: () => initIslands,
    injectIslandStyle: () => injectIslandStyle,
    navigateTo: () => navigateTo,
    onIslandEvent: () => onIslandEvent,
    useSharedState: () => useSharedState
  });

  // src/runtime/registry.ts
  var registry = /* @__PURE__ */ new Map();
  function defineIsland(name, loader) {
    registry.set(name, loader);
  }
  function hasIsland(name) {
    return registry.has(name);
  }
  function getIslandLoader(name) {
    return registry.get(name);
  }

  // src/runtime/hydrator.ts
  var activeCleanups = /* @__PURE__ */ new WeakMap();
  async function hydrateIsland(container) {
    if (container.dataset.hydrated === "true") {
      return;
    }
    const islandName = container.dataset.island;
    if (!islandName) {
      return;
    }
    const loader = getIslandLoader(islandName);
    if (!loader) {
      console.warn(`[SoftMax.Islands] No factory registered for island: "${islandName}"`);
      return;
    }
    container.dataset.hydrated = "true";
    container.classList.add("island-hydrating");
    try {
      const rawProps = container.dataset.props;
      const props = rawProps ? JSON.parse(rawProps) : {};
      const moduleResult = await loader();
      const factory = typeof moduleResult === "function" ? moduleResult : moduleResult.default;
      if (typeof factory === "function") {
        const cleanup = await factory(container, props);
        if (typeof cleanup === "function") {
          activeCleanups.set(container, cleanup);
        }
      }
      container.classList.remove("island-hydrating");
      container.classList.add("island-hydrated");
      container.dispatchEvent(new CustomEvent("island:hydrated", { detail: { name: islandName, props }, bubbles: true }));
    } catch (error) {
      container.classList.remove("island-hydrating");
      container.classList.add("island-error");
      console.error(`[SoftMax.Islands] Failed to hydrate island "${islandName}":`, error);
    }
  }
  function destroyIsland(container) {
    const cleanup = activeCleanups.get(container);
    if (cleanup) {
      try {
        cleanup();
      } catch (e) {
        console.error("[SoftMax.Islands] Error during island cleanup:", e);
      }
      activeCleanups.delete(container);
    }
    container.dataset.hydrated = "false";
    container.classList.remove("island-hydrated");
  }
  function initIslands(root = document) {
    const containers = root.querySelectorAll("[data-island]");
    containers.forEach((container) => {
      if (container.dataset.hydrated === "true") return;
      const strategy = container.dataset.hydrate?.toLowerCase() || "load";
      switch (strategy) {
        case "load":
          hydrateIsland(container);
          break;
        case "idle":
          if ("requestIdleCallback" in window) {
            window.requestIdleCallback(() => hydrateIsland(container), { timeout: 2e3 });
          } else {
            setTimeout(() => hydrateIsland(container), 150);
          }
          break;
        case "visible": {
          const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                observer.disconnect();
                hydrateIsland(container);
              }
            });
          }, { rootMargin: "120px 0px" });
          observer.observe(container);
          break;
        }
        case "media": {
          const mediaQuery = container.dataset.media;
          if (mediaQuery) {
            const mql = window.matchMedia(mediaQuery);
            if (mql.matches) {
              hydrateIsland(container);
            } else {
              const handler = (e) => {
                if (e.matches) {
                  mql.removeEventListener("change", handler);
                  hydrateIsland(container);
                }
              };
              mql.addEventListener("change", handler);
            }
          }
          break;
        }
        case "interaction": {
          const triggerEvents = ["mouseenter", "focusin", "touchstart", "click"];
          const onInteract = () => {
            triggerEvents.forEach((evt) => container.removeEventListener(evt, onInteract));
            hydrateIsland(container);
          };
          triggerEvents.forEach((evt) => container.addEventListener(evt, onInteract, { once: true, passive: true }));
          break;
        }
        case "never":
          break;
        default:
          hydrateIsland(container);
          break;
      }
    });
  }

  // src/runtime/events.ts
  var bus = /* @__PURE__ */ new Map();
  function emitIslandEvent(event, detail) {
    const handlers = bus.get(event);
    if (handlers) {
      handlers.forEach((fn) => {
        try {
          fn(detail);
        } catch (err) {
          console.error(`[SoftMax.Islands] Error in event listener for "${event}":`, err);
        }
      });
    }
    window.dispatchEvent(new CustomEvent(`island:${event}`, { detail }));
  }
  function onIslandEvent(event, handler) {
    if (!bus.has(event)) {
      bus.set(event, /* @__PURE__ */ new Set());
    }
    bus.get(event).add(handler);
    return () => {
      const set = bus.get(event);
      if (set) {
        set.delete(handler);
        if (set.size === 0) bus.delete(event);
      }
    };
  }

  // src/runtime/state.ts
  var IslandStore = class {
    value;
    listeners = /* @__PURE__ */ new Set();
    constructor(initialValue) {
      this.value = initialValue;
    }
    get() {
      return this.value;
    }
    set(next) {
      const prev = this.value;
      this.value = typeof next === "function" ? next(prev) : next;
      if (this.value !== prev) {
        this.listeners.forEach((fn) => fn(this.value, prev));
      }
    }
    subscribe(listener) {
      this.listeners.add(listener);
      return () => this.listeners.delete(listener);
    }
  };
  var stores = /* @__PURE__ */ new Map();
  function useSharedState(key, initialValue) {
    if (!stores.has(key)) {
      stores.set(key, new IslandStore(initialValue));
    }
    return stores.get(key);
  }

  // src/runtime/slots.ts
  function getSlot(container, name = "default") {
    return container.querySelector(`[data-slot="${name}"]`);
  }
  function extractSlotContent(container, name = "default") {
    const slotEl = getSlot(container, name);
    if (!slotEl) return "";
    return slotEl.innerHTML;
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
    document.head.appendChild(styleEl);
  }

  // src/runtime/router.ts
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
      console.error("[SoftMax.Islands] View transition failed, falling back to full navigation:", err);
      window.location.href = urlStr;
    }
  }

  // src/index.ts
  if (typeof window !== "undefined") {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => {
        initIslands();
        enableViewTransitions();
      });
    } else {
      initIslands();
      enableViewTransitions();
    }
  }
  return __toCommonJS(index_exports);
})();
//# sourceMappingURL=index.js.map
