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
(globalThis as any).requestAnimationFrame = (cb: () => void) => setTimeout(cb, 16);

// `navigator` is only a built-in Node global since Node 21+ - on Node 20 (what CI's
// actions/setup-node@v4 pins), the bare identifier is completely unbound, not just `undefined`, so
// react-dom's own top-level `navigator` reference throws a ReferenceError the instant it's required -
// caught by adapters/react.ts's blanket try/catch and misreported as "package not found". The
// previous code here assumed `globalThis.navigator` already existed (true on Node 21+, silently false
// on 20) and only tried to attach a `.clipboard` property to it, wrapped in a try/catch that swallowed
// exactly this failure - so the mock silently never applied on Node 20 either. Explicitly assigning
// happy-dom's own `navigator` here removes that assumption entirely, regardless of Node version.
(globalThis as any).navigator = win.navigator;

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

