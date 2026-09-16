import '../setup.ts';
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { bindIntersectionDirectives } from '../../src/directives/intersect.ts';
import { teardownDirectives } from '../../src/directives/lifecycle.ts';

describe('Intersection Directive Cleanup Suite (l-intersect, ROADMAP.v5.md Part I - teardown leak fix)', () => {
    it('teardownDirectives calls observer.disconnect() for an active l-intersect binding (regression: previously the observer only stopped via .once auto-disconnect or never at all)', () => {
        const el = document.createElement('div');
        el.setAttribute('l-intersect', 'x = 1');
        document.body.appendChild(el);

        let disconnectCalls = 0;
        const OriginalIO = (global as any).IntersectionObserver;
        (global as any).IntersectionObserver = class {
            callback: any;
            constructor(cb: any) { this.callback = cb; }
            observe(elArg: any) { this.callback([{ isIntersecting: true, target: elArg }]); }
            unobserve(_el: any) {}
            disconnect() { disconnectCalls++; }
        };

        try {
            bindIntersectionDirectives(el);
            assert.equal(disconnectCalls, 0, 'must not disconnect before teardown (this binding has no .once modifier)');

            teardownDirectives(document.body);

            assert.equal(disconnectCalls, 1, 'teardownDirectives must call disconnect() exactly once');
        } finally {
            (global as any).IntersectionObserver = OriginalIO;
        }
    });
});
