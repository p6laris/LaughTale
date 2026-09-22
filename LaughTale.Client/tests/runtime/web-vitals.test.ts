import '../setup.ts';
import { describe, it, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { observeCoreWebVitals, wireLaughTaleWebVitalsReporting } from '../../src/runtime/web-vitals.ts';

/**
 * A minimal fake PerformanceObserver: real browsers dispatch entries asynchronously from the actual
 * rendering/input pipeline, which this test environment (happy-dom, Node) has none of - so this
 * stands in as the seam, capturing each `observe({type})` call's callback so a test can invoke it
 * directly with synthetic entries, exactly like the real implementation eventually would.
 */
class FakePerformanceObserver {
    static instances: FakePerformanceObserver[] = [];
    type = '';
    callback: (list: { getEntries: () => any[] }) => void;

    constructor(callback: (list: { getEntries: () => any[] }) => void) {
        this.callback = callback;
        FakePerformanceObserver.instances.push(this);
    }

    observe(options: { type: string }) {
        this.type = options.type;
    }

    disconnect() {
        const idx = FakePerformanceObserver.instances.indexOf(this);
        if (idx >= 0) FakePerformanceObserver.instances.splice(idx, 1);
    }

    static emit(type: string, entries: any[]) {
        for (const instance of FakePerformanceObserver.instances) {
            if (instance.type === type) {
                instance.callback({ getEntries: () => entries });
            }
        }
    }
}

describe('Core Web Vitals Suite (ROADMAP.v5.md Part J)', () => {
    let originalPO: any;

    function install() {
        originalPO = (globalThis as any).PerformanceObserver;
        (globalThis as any).PerformanceObserver = FakePerformanceObserver;
        FakePerformanceObserver.instances = [];
    }

    afterEach(() => {
        if (originalPO !== undefined) {
            (globalThis as any).PerformanceObserver = originalPO;
        }
        FakePerformanceObserver.instances = [];
    });

    it('reports the most recent LCP entry as the final value on visibilitychange to hidden', () => {
        install();
        const reported: any[] = [];
        const stop = observeCoreWebVitals((m) => reported.push(m));

        FakePerformanceObserver.emit('largest-contentful-paint', [{ renderTime: 1200, startTime: 1200 }]);
        FakePerformanceObserver.emit('largest-contentful-paint', [{ renderTime: 1800, startTime: 1800 }]);

        Object.defineProperty(document, 'visibilityState', { value: 'hidden', configurable: true });
        document.dispatchEvent(new Event('visibilitychange'));

        const lcp = reported.find((m) => m.name === 'LCP');
        assert.ok(lcp, 'LCP must be reported');
        assert.equal(lcp.value, 1800, 'The LATEST LCP candidate must be reported, not the first');

        stop();
    });

    it('computes CLS via session windows, not a naive running sum (real web.dev algorithm)', () => {
        install();
        const reported: any[] = [];
        const stop = observeCoreWebVitals((m) => reported.push(m));

        // Session 1: two shifts within 1s of each other and within a 5s window -> sums to 0.15
        FakePerformanceObserver.emit('layout-shift', [
            { value: 0.05, startTime: 0, hadRecentInput: false },
            { value: 0.10, startTime: 500, hadRecentInput: false }
        ]);

        // A gap of over 1s starts session 2 - smaller than session 1, must NOT be added to it
        FakePerformanceObserver.emit('layout-shift', [
            { value: 0.02, startTime: 2000, hadRecentInput: false }
        ]);

        Object.defineProperty(document, 'visibilityState', { value: 'hidden', configurable: true });
        document.dispatchEvent(new Event('visibilitychange'));

        const cls = reported.find((m) => m.name === 'CLS');
        assert.ok(cls, 'CLS must be reported');
        assert.equal(cls.value, 0.15, 'CLS must be the largest SESSION WINDOW total (0.15), not the naive running sum (0.17)');

        stop();
    });

    it('ignores layout shifts with hadRecentInput (user-caused, not a real CLS regression)', () => {
        install();
        const reported: any[] = [];
        const stop = observeCoreWebVitals((m) => reported.push(m));

        FakePerformanceObserver.emit('layout-shift', [
            { value: 0.5, startTime: 0, hadRecentInput: true }
        ]);

        Object.defineProperty(document, 'visibilityState', { value: 'hidden', configurable: true });
        document.dispatchEvent(new Event('visibilitychange'));

        const cls = reported.find((m) => m.name === 'CLS');
        assert.equal(cls, undefined, 'A user-caused shift must never be reported as CLS');

        stop();
    });

    it('reports the worst interaction duration as an approximate INP', () => {
        install();
        const reported: any[] = [];
        const stop = observeCoreWebVitals((m) => reported.push(m));

        FakePerformanceObserver.emit('event', [
            { interactionId: 1, duration: 40 },
            { interactionId: 2, duration: 120 },
            { interactionId: 3, duration: 80 }
        ]);

        Object.defineProperty(document, 'visibilityState', { value: 'hidden', configurable: true });
        document.dispatchEvent(new Event('visibilitychange'));

        const inp = reported.find((m) => m.name === 'INP');
        assert.ok(inp);
        assert.equal(inp.value, 120, 'The WORST interaction duration must be reported');

        stop();
    });

    it('ignores event entries without a real interactionId', () => {
        install();
        const reported: any[] = [];
        const stop = observeCoreWebVitals((m) => reported.push(m));

        FakePerformanceObserver.emit('event', [{ interactionId: 0, duration: 999 }]);

        Object.defineProperty(document, 'visibilityState', { value: 'hidden', configurable: true });
        document.dispatchEvent(new Event('visibilitychange'));

        assert.equal(reported.find((m) => m.name === 'INP'), undefined);

        stop();
    });

    it('does not throw when PerformanceObserver is unavailable in this environment', () => {
        const original = (globalThis as any).PerformanceObserver;
        delete (globalThis as any).PerformanceObserver;

        try {
            assert.doesNotThrow(() => {
                const stop = observeCoreWebVitals(() => {});
                stop();
            });
        } finally {
            (globalThis as any).PerformanceObserver = original;
        }
    });

    it('wireLaughTaleWebVitalsReporting beacons each reported metric to the endpoint', () => {
        install();
        const originalSendBeacon = (navigator as any).sendBeacon;
        const calls: any[] = [];
        (navigator as any).sendBeacon = (url: string, body: any) => { calls.push({ url, body }); return true; };

        try {
            const stop = wireLaughTaleWebVitalsReporting('/custom/web-vitals');

            FakePerformanceObserver.emit('largest-contentful-paint', [{ renderTime: 1000, startTime: 1000 }]);
            Object.defineProperty(document, 'visibilityState', { value: 'hidden', configurable: true });
            document.dispatchEvent(new Event('visibilitychange'));

            assert.ok(calls.length >= 1);
            assert.equal(calls[0].url, '/custom/web-vitals');

            stop();
        } finally {
            (navigator as any).sendBeacon = originalSendBeacon;
        }
    });
});
