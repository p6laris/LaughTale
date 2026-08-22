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

export {
  getNearestScope,
  createReactiveScope,
  evaluateExpression,
  executeStatement,
  bindElementReactivity
};
//# sourceMappingURL=chunk-RIDSUAJN.js.map
