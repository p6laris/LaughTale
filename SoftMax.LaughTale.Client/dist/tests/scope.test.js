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

// tests/scope.test.ts
import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";

// src/runtime/scope.ts
function createScope() {
  const cleanups = [];
  let isDisposed = false;
  return {
    on(target, event, handler, options) {
      if (isDisposed || !target) return;
      target.addEventListener(event, handler, options);
      cleanups.push(() => {
        target.removeEventListener(event, handler, options);
      });
    },
    observe(observer) {
      if (isDisposed || !observer) return;
      cleanups.push(() => {
        try {
          observer.disconnect();
        } catch {
        }
      });
    },
    timer(id) {
      if (isDisposed || id === null || id === void 0) return;
      cleanups.push(() => {
        try {
          clearInterval(id);
          clearTimeout(id);
        } catch {
        }
      });
    },
    cleanup(fn) {
      if (isDisposed || typeof fn !== "function") return;
      cleanups.push(fn);
    },
    dispose() {
      if (isDisposed) return;
      isDisposed = true;
      while (cleanups.length > 0) {
        const cleanupFn = cleanups.pop();
        if (typeof cleanupFn === "function") {
          try {
            cleanupFn();
          } catch (error) {
            console.error("[SoftMax.LaughTale Scope] Error executing cleanup task:", error);
          }
        }
      }
    }
  };
}

// tests/scope.test.ts
describe("Island Resource Scope & Teardown Lifecycle Suite (LT-201)", () => {
  let container;
  beforeEach(() => {
    document.body.innerHTML = "";
    container = document.createElement("div");
    document.body.appendChild(container);
  });
  it("scope.on: registers event listener and automatically removes it on dispose", () => {
    const scope = createScope();
    let clickCount = 0;
    scope.on(container, "click", () => {
      clickCount++;
    });
    container.dispatchEvent(new Event("click"));
    assert.equal(clickCount, 1, "Event listener was not invoked before disposal");
    scope.dispose();
    container.dispatchEvent(new Event("click"));
    assert.equal(clickCount, 1, "Event listener was unexpectedly invoked after scope disposal");
  });
  it("scope.observe: disconnects observer on dispose", () => {
    const scope = createScope();
    let disconnected = false;
    const mockObserver = {
      observe: () => {
      },
      disconnect: () => {
        disconnected = true;
      }
    };
    scope.observe(mockObserver);
    assert.equal(disconnected, false);
    scope.dispose();
    assert.equal(disconnected, true, "Observer was not disconnected on scope disposal");
  });
  it("scope.timer: cancels interval and timeout on dispose", () => {
    const scope = createScope();
    let timerFired = false;
    const timerId = setTimeout(() => {
      timerFired = true;
    }, 50);
    scope.timer(timerId);
    scope.dispose();
    return new Promise((resolve) => {
      setTimeout(() => {
        assert.equal(timerFired, false, "Timer fired after scope disposal");
        resolve();
      }, 70);
    });
  });
  it("scope.cleanup: executes custom cleanup callbacks in LIFO order", () => {
    const scope = createScope();
    const executionOrder = [];
    scope.cleanup(() => executionOrder.push(1));
    scope.cleanup(() => executionOrder.push(2));
    scope.cleanup(() => executionOrder.push(3));
    scope.dispose();
    assert.deepEqual(executionOrder, [3, 2, 1], "Cleanups did not execute in reverse LIFO order");
  });
  it("scope.dispose: is idempotent and only runs cleanups once", () => {
    const scope = createScope();
    let runCount = 0;
    scope.cleanup(() => {
      runCount++;
    });
    scope.dispose();
    scope.dispose();
    scope.dispose();
    assert.equal(runCount, 1, "Cleanups were executed multiple times on repeated dispose calls");
  });
  it("scope.dispose: isolates individual errors and ensures all cleanups run", () => {
    const scope = createScope();
    let secondCleaned = false;
    scope.cleanup(() => {
      secondCleaned = true;
    });
    scope.cleanup(() => {
      throw new Error("Explosive cleanup failure!");
    });
    scope.dispose();
    assert.equal(secondCleaned, true, "Subsequent cleanups were blocked by an earlier error");
  });
});
