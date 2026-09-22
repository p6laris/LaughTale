/**
 * Global DOM setup for LaughTale test suite using HappyDOM
 */

import { Window } from 'happy-dom';

const win = new Window({
    url: 'http://localhost:5000'
});

(globalThis as any).window = win;
(globalThis as any).document = win.document;
(globalThis as any).Element = win.Element;
(globalThis as any).SVGElement = win.SVGElement;
(globalThis as any).Text = win.Text;
(globalThis as any).Comment = win.Comment;
(globalThis as any).DocumentFragment = win.DocumentFragment;
(globalThis as any).HTMLElement = win.HTMLElement;
(globalThis as any).HTMLInputElement = win.HTMLInputElement;
(globalThis as any).HTMLSelectElement = win.HTMLSelectElement;
(globalThis as any).HTMLTextAreaElement = win.HTMLTextAreaElement;
(globalThis as any).HTMLButtonElement = win.HTMLButtonElement;
(globalThis as any).CustomEvent = win.CustomEvent;
(globalThis as any).Event = win.Event;
(globalThis as any).MouseEvent = win.MouseEvent;
(globalThis as any).KeyboardEvent = win.KeyboardEvent;
(globalThis as any).Node = win.Node;
(globalThis as any).EventTarget = (win as any).EventTarget || globalThis.EventTarget;
(globalThis as any).localStorage = win.localStorage;
(globalThis as any).sessionStorage = win.sessionStorage;
(globalThis as any).DOMParser = win.DOMParser;
// ROADMAP.v5.md Part D "New adapters" (Web Components): happy-dom implements the real Custom
// Elements API on its own Window, just not exposed as a bare global by this file until now.
(globalThis as any).customElements = win.customElements;
// ROADMAP.v5.md Part D "New adapters" (Alpine): Alpine's own `findClosest` walks up `parentNode`
// checking `instanceof ShadowRoot` unconditionally (not feature-detected) - needed the moment
// `Alpine.initTree`/`destroyTree` runs at all, not just for a Shadow-DOM-specific scenario.
(globalThis as any).ShadowRoot = win.ShadowRoot;
(globalThis as any).requestAnimationFrame = (cb: () => void) => setTimeout(cb, 16);

// `navigator` is only a built-in Node global since Node 21+ - on Node 20 (what CI's
// actions/setup-node@v4 pins), the bare identifier is completely unbound, not just `undefined`, so
// react-dom's own top-level `navigator` reference throws a ReferenceError the instant it's required -
// caught by adapters/react.ts's blanket try/catch and misreported as "package not found". The
// previous code here assumed `globalThis.navigator` already existed (true on Node 21+, silently false
// on 20) and only tried to attach a `.clipboard` property to it, wrapped in a try/catch that swallowed
// exactly this failure - so the mock silently never applied on Node 20 either. Explicitly assigning
// happy-dom's own `navigator` here removes that assumption entirely, regardless of Node version.
//
// A bare assignment isn't enough, though: Node 21+ (including this repo's own dev machines, which
// run newer Node than CI's pinned 20) defines its own built-in `globalThis.navigator` as an
// accessor property with a getter but NO setter, so `globalThis.navigator = ...` throws
// "Cannot set property navigator of #<Object> which has only a getter" instead of silently
// no-oping - confirmed the hard way when this exact line broke every local test run on Node 24
// while the Node 20 CI fix it was written for kept working. `Object.defineProperty` replaces the
// accessor outright (Node's own built-in navigator property is configurable), working identically
// whether `navigator` was previously unbound (Node 20), a getter-only accessor (Node 21+), or
// already a plain writable property.
Object.defineProperty(globalThis, 'navigator', {
    value: win.navigator,
    configurable: true,
    writable: true
});

// Mock navigator.clipboard
try {
    Object.defineProperty(globalThis.navigator, 'clipboard', {
        value: {
            writeText: async (_text: string) => Promise.resolve()
        },
        configurable: true
    });
} catch {
    // ignore
}

// Mock MutationObserver
(globalThis as any).MutationObserver = win.MutationObserver || class {
    observe() {}
    disconnect() {}
};

// Mock IntersectionObserver
(globalThis as any).IntersectionObserver = class {
    callback: any;
    constructor(cb: any) { this.callback = cb; }
    observe(el: any) {
        this.callback([{ isIntersecting: true, target: el }]);
    }
    unobserve(_el: any) {}
    disconnect() {}
};

