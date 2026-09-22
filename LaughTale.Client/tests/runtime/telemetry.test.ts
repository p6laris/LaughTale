import '../setup.ts';
import { describe, it, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { reportHydrationTelemetry, wireLaughTaleTelemetryReporting } from '../../src/runtime/telemetry.ts';

describe('Instrumentation Hook Suite - client telemetry (ROADMAP.v5.md Part H)', () => {
    let originalSendBeacon: any;

    afterEach(() => {
        if (originalSendBeacon !== undefined) {
            (navigator as any).sendBeacon = originalSendBeacon;
            originalSendBeacon = undefined;
        }
    });

    it('beacons a valid hydration duration to the given endpoint', () => {
        originalSendBeacon = (navigator as any).sendBeacon;
        const calls: { url: string; body: any }[] = [];
        (navigator as any).sendBeacon = (url: string, body: any) => {
            calls.push({ url, body });
            return true;
        };

        reportHydrationTelemetry('/_laughtale/telemetry/hydration', { name: 'datatable', durationMs: 12.5, strategy: 'load' });

        assert.equal(calls.length, 1);
        assert.equal(calls[0].url, '/_laughtale/telemetry/hydration');
    });

    it('does not beacon when durationMs is missing or non-finite', () => {
        originalSendBeacon = (navigator as any).sendBeacon;
        let called = false;
        (navigator as any).sendBeacon = () => { called = true; return true; };

        reportHydrationTelemetry('/x', { name: 'datatable' });
        reportHydrationTelemetry('/x', { name: 'datatable', durationMs: NaN });

        assert.equal(called, false);
    });

    it('does not throw when navigator.sendBeacon is unavailable', () => {
        originalSendBeacon = (navigator as any).sendBeacon;
        (navigator as any).sendBeacon = undefined;

        assert.doesNotThrow(() => reportHydrationTelemetry('/x', { name: 'datatable', durationMs: 5 }));
    });

    it('wireLaughTaleTelemetryReporting listens for laughtale:diagnostic and beacons it', () => {
        originalSendBeacon = (navigator as any).sendBeacon;
        const calls: any[] = [];
        (navigator as any).sendBeacon = (url: string, body: any) => { calls.push({ url, body }); return true; };

        const unsubscribe = wireLaughTaleTelemetryReporting('/custom/endpoint');
        try {
            document.dispatchEvent(new CustomEvent('laughtale:diagnostic', {
                detail: { name: 'counter', durationMs: 3.2, strategy: 'idle' }
            }));

            assert.equal(calls.length, 1);
            assert.equal(calls[0].url, '/custom/endpoint');
        } finally {
            unsubscribe();
        }
    });

    it('unsubscribe stops further reporting', () => {
        originalSendBeacon = (navigator as any).sendBeacon;
        const calls: any[] = [];
        (navigator as any).sendBeacon = (url: string, body: any) => { calls.push({ url, body }); return true; };

        const unsubscribe = wireLaughTaleTelemetryReporting();
        unsubscribe();

        document.dispatchEvent(new CustomEvent('laughtale:diagnostic', {
            detail: { name: 'counter', durationMs: 1 }
        }));

        assert.equal(calls.length, 0);
    });
});
