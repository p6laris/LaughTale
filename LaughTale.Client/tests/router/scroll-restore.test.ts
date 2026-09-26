import '../setup.ts';
import { describe, it, beforeEach, afterEach, mock } from 'node:test';
import assert from 'node:assert/strict';

const { holdScrollPosition, releaseScrollHold } = await import('../../src/runtime/scroll-restore.ts');

// A browser-like scroll model: scrollTo() clamps to what the page can scroll right now, exactly
// what makes a one-shot restore lose its position while the page is still growing.
const VIEWPORT = 800;
let documentHeight = 0;
let scrollToCalls = 0;
const observers: { callback: () => void; disconnected: boolean }[] = [];

function growDocument(height: number) {
    documentHeight = height;
    for (const o of observers) if (!o.disconnected) o.callback();
}

let originalScrollTo: typeof window.scrollTo;
let originalResizeObserver: any;

beforeEach(() => {
    mock.timers.enable({ apis: ['setTimeout'] });
    documentHeight = 1000;
    scrollToCalls = 0;
    observers.length = 0;
    Object.defineProperty(window, 'scrollX', { value: 0, configurable: true, writable: true });
    Object.defineProperty(window, 'scrollY', { value: 0, configurable: true, writable: true });
    originalScrollTo = window.scrollTo;
    window.scrollTo = ((opts: ScrollToOptions) => {
        scrollToCalls++;
        (window as any).scrollY = Math.max(0, Math.min(opts.top ?? 0, documentHeight - VIEWPORT));
    }) as any;
    originalResizeObserver = (globalThis as any).ResizeObserver;
    (globalThis as any).ResizeObserver = class {
        private entry = { callback: () => {}, disconnected: false };
        constructor(callback: () => void) { this.entry.callback = callback; observers.push(this.entry); }
        observe() {}
        disconnect() { this.entry.disconnected = true; }
    };
});

afterEach(() => {
    releaseScrollHold();
    mock.timers.reset();
    window.scrollTo = originalScrollTo;
    (globalThis as any).ResizeObserver = originalResizeObserver;
});

describe('holdScrollPosition', () => {
    it('reaches a target the page could not scroll to yet, once the page grows', () => {
        holdScrollPosition(0, 1500);
        assert.equal(window.scrollY, 200, 'precondition: clamped while the page is only 1000px tall');

        growDocument(2400);
        assert.equal(window.scrollY, 1500, 'the hold re-applies the target when the document resizes');
    });

    it('turns scroll anchoring off while holding and restores it afterwards', () => {
        const root = document.documentElement;
        root.style.setProperty('overflow-anchor', 'auto');
        holdScrollPosition(0, 100);
        assert.equal(root.style.getPropertyValue('overflow-anchor'), 'none');

        mock.timers.tick(400);
        assert.equal(root.style.getPropertyValue('overflow-anchor'), 'auto');
        root.style.removeProperty('overflow-anchor');
    });

    it('lets go once the document stops resizing', () => {
        holdScrollPosition(0, 1500);
        mock.timers.tick(399);
        growDocument(2000);                 // still held: resets the settle timer
        assert.equal(window.scrollY, 1200);
        mock.timers.tick(400);              // settled
        growDocument(3000);
        assert.equal(window.scrollY, 1200, 'after settling, later growth no longer moves the page');
    });

    it('never fights the user: scrolling or a key press ends the hold', () => {
        for (const type of ['wheel', 'touchstart', 'keydown', 'pointerdown']) {
            documentHeight = 1000;
            (window as any).scrollY = 0;
            holdScrollPosition(0, 1500);
            window.dispatchEvent(new Event(type));
            growDocument(3000);
            assert.equal(window.scrollY, 200, `${type} must release the hold`);
        }
    });

    it('a new navigation (releaseScrollHold) ends the hold', () => {
        holdScrollPosition(0, 1500);
        releaseScrollHold();
        growDocument(3000);
        assert.equal(window.scrollY, 200);
    });

    it('a newer hold replaces an older one', () => {
        holdScrollPosition(0, 1500);
        holdScrollPosition(0, 0);
        growDocument(3000);
        assert.equal(window.scrollY, 0);
        assert.equal(observers.filter(o => !o.disconnected).length, 1, 'the old observer is disconnected');
    });

    it('holds for at most maxMs even if the page keeps resizing', () => {
        holdScrollPosition(0, 5000);
        for (let t = 0; t < 3000; t += 300) {
            growDocument(documentHeight + 100);
            mock.timers.tick(300);
        }
        const heldAt = window.scrollY;
        growDocument(documentHeight + 10_000);
        assert.equal(window.scrollY, heldAt, 'released at the 3s cap');
    });

    it('does not call scrollTo when already at the target', () => {
        documentHeight = 3000;
        (window as any).scrollY = 700;
        holdScrollPosition(0, 700);
        growDocument(3100);
        assert.equal(scrollToCalls, 0);
    });
});
