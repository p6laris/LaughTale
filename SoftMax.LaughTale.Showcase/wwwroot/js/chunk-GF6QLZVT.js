// ../SoftMax.LaughTale.Client/src/directives/security.ts
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
  "formaction"
]);
var DANGEROUS_PROTOCOLS = /^\s*(javascript|data|vbscript):/i;
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

// ../SoftMax.LaughTale.Client/src/directives/reactivity.ts
var elementScopeMap = /* @__PURE__ */ new WeakMap();
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

export {
  getNearestScope,
  createReactiveScope,
  evaluateExpression,
  executeStatement,
  bindElementReactivity
};
//# sourceMappingURL=chunk-GF6QLZVT.js.map
