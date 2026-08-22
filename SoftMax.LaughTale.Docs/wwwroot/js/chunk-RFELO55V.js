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
    console.error("[SoftMax.LaughTale] View transition failed, falling back to full navigation:", err);
    window.location.href = urlStr;
  }
}

// ../SoftMax.LaughTale.Client/src/runtime/slots.ts
function getSlot(container, name = "default") {
  return container.querySelector(`[data-slot="${name}"]`);
}

// ../SoftMax.LaughTale.Client/src/runtime/styles.ts
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

export {
  defineIsland,
  initIslands,
  enableViewTransitions,
  getSlot,
  injectIslandStyle
};
//# sourceMappingURL=chunk-RFELO55V.js.map
