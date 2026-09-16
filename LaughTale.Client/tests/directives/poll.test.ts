import '../setup.ts';
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { bindPollingDirectives } from '../../src/directives/poll.ts';
import { teardownDirectives } from '../../src/directives/lifecycle.ts';

describe('Polling Directive Cleanup Suite (l-poll, ROADMAP.v5.md Part I - teardown leak fix)', () => {
    it('teardownDirectives calls clearInterval for a running l-poll (regression: previously only a delayed document.body.contains self-check inside the interval callback would ever clear it, so a detached element polled forever until its own next tick)', () => {
        const el = document.createElement('div');
        el.setAttribute('l-poll.1s', 'x = 1');
        document.body.appendChild(el);

        const clearedIds: unknown[] = [];
        const originalClearInterval = global.clearInterval;
        (global as any).clearInterval = (id: unknown) => {
            clearedIds.push(id);
            return originalClearInterval(id as any);
        };

        try {
            bindPollingDirectives(el);
            assert.equal(clearedIds.length, 0, 'must not clear before teardown runs');

            teardownDirectives(document.body);

            assert.equal(clearedIds.length, 1, 'teardownDirectives must call clearInterval exactly once, synchronously, without waiting for the interval to fire');
        } finally {
            global.clearInterval = originalClearInterval;
        }
    });

    it('does not call clearInterval for an unrelated element also under the torn-down root', () => {
        const pollEl = document.createElement('div');
        pollEl.setAttribute('l-poll.1s', 'x = 1');
        const plainEl = document.createElement('div');
        document.body.appendChild(pollEl);
        document.body.appendChild(plainEl);

        let clearCount = 0;
        const originalClearInterval = global.clearInterval;
        (global as any).clearInterval = (id: unknown) => {
            clearCount++;
            return originalClearInterval(id as any);
        };

        try {
            bindPollingDirectives(pollEl);
            teardownDirectives(document.body);
            assert.equal(clearCount, 1);
        } finally {
            global.clearInterval = originalClearInterval;
        }
    });
});
