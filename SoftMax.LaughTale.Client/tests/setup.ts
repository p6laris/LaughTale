/**
 * Global DOM setup for LaughTale test suite using HappyDOM
 */

import { Window } from 'happy-dom';

const win = new Window({
    url: 'http://localhost:5000'
});

(globalThis as any).window = win;
(globalThis as any).document = win.document;
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
(globalThis as any).localStorage = win.localStorage;
(globalThis as any).sessionStorage = win.sessionStorage;
(globalThis as any).requestAnimationFrame = (cb: () => void) => setTimeout(cb, 16);

// Mock IntersectionObserver
(globalThis as any).IntersectionObserver = class {
    callback: any;
    constructor(cb: any) { this.callback = cb; }
    observe(el: any) {
        this.callback([{ isIntersecting: true, target: el }]);
    }
    disconnect() {}
};
