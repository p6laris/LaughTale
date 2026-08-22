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

// tests/composables.test.ts
import { describe, it } from "node:test";
import assert from "node:assert/strict";

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

// tests/composables.test.ts
describe("SoftMax.LaughTale Headless Composables Suite", () => {
  it("useDisclosure: manages open/close lifecycle and callbacks", () => {
    let opened = false;
    let closed = false;
    const disc = useDisclosure({
      defaultIsOpen: false,
      onOpen: () => {
        opened = true;
      },
      onClose: () => {
        closed = true;
      }
    });
    assert.equal(disc.isOpen, false);
    disc.open();
    assert.equal(disc.isOpen, true);
    assert.equal(opened, true);
    disc.close();
    assert.equal(disc.isOpen, false);
    assert.equal(closed, true);
    disc.toggle();
    assert.equal(disc.isOpen, true);
  });
  it("useControllableState: supports controlled and uncontrolled state", () => {
    let changedVal = "";
    const [getVal, setVal] = useControllableState({
      defaultValue: "initial",
      onChange: (v) => {
        changedVal = v;
      }
    });
    assert.equal(getVal(), "initial");
    setVal("updated");
    assert.equal(getVal(), "updated");
    assert.equal(changedVal, "updated");
  });
  it("useSpring: calculates spring trajectory towards target", async () => {
    const spring = useSpring(0, { stiffness: 200, damping: 20 });
    assert.equal(spring.value, 0);
    spring.set(100);
    await new Promise((r) => setTimeout(r, 60));
    assert.ok(spring.value > 0, `Spring value should progress towards target, got ${spring.value}`);
    spring.stop();
  });
  it("useStagger: applies staggered entrance transitions to elements", () => {
    const parent = document.createElement("div");
    for (let i = 0; i < 3; i++) {
      const child = document.createElement("div");
      parent.appendChild(child);
    }
    const elements = Array.from(parent.children);
    useStagger(elements, { staggerMs: 30, initialDelay: 10 });
    assert.ok(elements[0].style.transition.includes("10ms"));
    assert.ok(elements[1].style.transition.includes("40ms"));
    assert.ok(elements[2].style.transition.includes("70ms"));
  });
  it("useDebounce: executes callback after delay interval", async () => {
    let count = 0;
    const debounced = useDebounce(() => {
      count++;
    }, 30);
    debounced();
    debounced();
    debounced();
    assert.equal(count, 0);
    await new Promise((r) => setTimeout(r, 60));
    assert.equal(count, 1);
  });
  it("useClipboard: copies text and exposes state", async () => {
    const clipboard = useClipboard({ timeout: 50 });
    const success = await clipboard.copy("Test Secret Key");
    assert.equal(success, true);
    assert.equal(clipboard.isCopied, true);
    await new Promise((r) => setTimeout(r, 70));
    assert.equal(clipboard.isCopied, false);
  });
  it("useKeyboardNav: manages active item index and arrows", () => {
    let selected = -1;
    let highlighted = -1;
    const nav = useKeyboardNav({
      itemCount: () => 5,
      onHighlight: (idx) => {
        highlighted = idx;
      },
      onSelect: (idx) => {
        selected = idx;
      }
    });
    nav.handleKeyDown(new KeyboardEvent("keydown", { key: "ArrowDown" }));
    assert.equal(highlighted, 0);
    nav.handleKeyDown(new KeyboardEvent("keydown", { key: "ArrowDown" }));
    assert.equal(highlighted, 1);
    nav.handleKeyDown(new KeyboardEvent("keydown", { key: "Enter" }));
    assert.equal(selected, 1);
  });
  it("useEventListener: attaches and cleans up event listener", () => {
    const btn = document.createElement("button");
    let clicked = false;
    const cleanup = useEventListener(btn, "click", () => {
      clicked = true;
    });
    btn.click();
    assert.equal(clicked, true);
    clicked = false;
    cleanup();
    btn.click();
    assert.equal(clicked, false);
  });
});
