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

// tests/retry.test.ts
import { describe, it } from "node:test";
import assert from "node:assert/strict";

// src/runtime/retry.ts
async function importWithRetry(loader, options = 3, legacyBaseDelayMs = 1e3) {
  const opts = typeof options === "number" ? { retries: options, baseDelayMs: legacyBaseDelayMs, maxDelayMs: 1e4, jitter: true } : {
    retries: options?.retries ?? 3,
    baseDelayMs: options?.baseDelayMs ?? 1e3,
    maxDelayMs: options?.maxDelayMs ?? 1e4,
    jitter: options?.jitter ?? true
  };
  let lastError = null;
  if (typeof loader === "function") {
    for (let attempt = 0; attempt < opts.retries; attempt++) {
      try {
        return await loader();
      } catch (err) {
        lastError = err;
        if (attempt === opts.retries - 1) {
          throw err;
        }
        const rawDelay = Math.min(opts.maxDelayMs, opts.baseDelayMs * Math.pow(2, attempt));
        const jitterFactor = opts.jitter ? 0.75 + Math.random() * 0.5 : 1;
        const delay = Math.round(rawDelay * jitterFactor);
        console.warn(`[SoftMax.LaughTale] Island dynamic import failed. Retrying in ${delay}ms (Attempt ${attempt + 1}/${opts.retries})...`, err);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  } else {
    let url = loader;
    for (let attempt = 0; attempt < opts.retries; attempt++) {
      try {
        return await import(
          /* @vite-ignore */
          url
        );
      } catch (err) {
        lastError = err;
        if (attempt === opts.retries - 1) {
          throw err;
        }
        const rawDelay = Math.min(opts.maxDelayMs, opts.baseDelayMs * Math.pow(2, attempt));
        const jitterFactor = opts.jitter ? 0.75 + Math.random() * 0.5 : 1;
        const delay = Math.round(rawDelay * jitterFactor);
        console.warn(`[SoftMax.LaughTale] Failed to fetch island script at ${url}. Retrying with cache-buster in ${delay}ms...`, err);
        await new Promise((resolve) => setTimeout(resolve, delay));
        const separator = url.includes("?") ? "&" : "?";
        url = `${url.replace(/([?&])island-retry=[^&]*/, "")}${separator}island-retry=${Date.now()}`;
      }
    }
  }
  throw lastError || new Error(`[SoftMax.LaughTale] Failed to load island after ${opts.retries} attempts.`);
}

// tests/retry.test.ts
describe("Module Dynamic Import Retry & Jittered Backoff Suite (LT-207)", () => {
  it("importWithRetry: resolves immediately on first attempt without delay", async () => {
    let attempts = 0;
    const loader = async () => {
      attempts++;
      return { default: "my-component" };
    };
    const startTime = Date.now();
    const result = await importWithRetry(loader, { retries: 3, baseDelayMs: 200 });
    const elapsed = Date.now() - startTime;
    assert.equal(attempts, 1);
    assert.equal(result.default, "my-component");
    assert.ok(elapsed < 50, `Expected elapsed time < 50ms, got ${elapsed}ms`);
  });
  it("importWithRetry: recovers when loader fails twice and succeeds on third attempt", async () => {
    let attempts = 0;
    const loader = async () => {
      attempts++;
      if (attempts < 3) {
        throw new Error(`Transient network glitch attempt ${attempts}`);
      }
      return { default: "recovered-component" };
    };
    const result = await importWithRetry(loader, { retries: 3, baseDelayMs: 10, jitter: false });
    assert.equal(attempts, 3);
    assert.equal(result.default, "recovered-component");
  });
  it("importWithRetry: throws original error on exhaustion of retries", async () => {
    let attempts = 0;
    const rootError = new Error("HTTP 404: Chunk not found");
    const loader = async () => {
      attempts++;
      throw rootError;
    };
    await assert.rejects(
      async () => {
        await importWithRetry(loader, { retries: 3, baseDelayMs: 10, jitter: false });
      },
      (err) => {
        assert.equal(err, rootError, "Expected exact root Error instance to be preserved");
        assert.equal(err.message, "HTTP 404: Chunk not found");
        return true;
      }
    );
    assert.equal(attempts, 3);
  });
  it("importWithRetry: applies exponential backoff timing bounds with jitter", async () => {
    let attempts = 0;
    const loader = async () => {
      attempts++;
      if (attempts < 3) {
        throw new Error("Glitch");
      }
      return { default: "success" };
    };
    const startTime = Date.now();
    await importWithRetry(loader, { retries: 3, baseDelayMs: 20, jitter: true });
    const elapsed = Date.now() - startTime;
    assert.equal(attempts, 3);
    assert.ok(elapsed >= 35, `Expected elapsed time >= 35ms, got ${elapsed}ms`);
    assert.ok(elapsed <= 250, `Expected elapsed time <= 250ms, got ${elapsed}ms`);
  });
});
