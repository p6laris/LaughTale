/**
 * Tests for LaughTale DevTools' island-tracking state (ROADMAP.v5.md DX — DevTools overlay).
 * Pure logic only - no layout assertions here, since happy-dom doesn't implement real layout.
 */

import '../setup.ts';
import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';

import { createDevToolsState } from '../../src/devtools/state.ts';

describe('DevTools State Tracking Suite', () => {
    let stop: (() => void) | null = null;

    beforeEach(() => {
        document.body.innerHTML = '';
    });

    afterEach(() => {
        stop?.();
        stop = null;
    });

    it('seeds already-present islands on start() without waiting for any event', () => {
        const container = document.createElement('div');
        container.setAttribute('data-island', 'seeded-widget');
        container.setAttribute('data-hydrate', 'idle');
        document.body.appendChild(container);

        const state = createDevToolsState();
        stop = state.start();

        assert.equal(state.islands.size, 1);
        const tracked = state.islands.get(container)!;
        assert.equal(tracked.name, 'seeded-widget');
        assert.equal(tracked.strategy, 'idle');
        assert.equal(tracked.state, 'idle');
    });

    it('updates a tracked island from a laughtale:diagnostic event', () => {
        const container = document.createElement('div');
        container.setAttribute('data-island', 'diag-widget');
        container.setAttribute('data-hydrate', 'load');
        document.body.appendChild(container);

        const state = createDevToolsState();
        stop = state.start();

        let notified = 0;
        state.subscribe(() => notified++);

        container.dispatchEvent(new CustomEvent('laughtale:diagnostic', {
            bubbles: true,
            composed: true,
            detail: { name: 'diag-widget', strategy: 'load', framework: 'react', propsSize: 42, durationMs: 3.5 }
        }));

        const tracked = state.islands.get(container)!;
        assert.equal(tracked.framework, 'react');
        assert.equal(tracked.propsSize, 42);
        assert.equal(tracked.durationMs, 3.5);
        assert.ok(notified >= 1);
    });

    it('marks a tracked island failed from a laughtale:hydration-error event, resolving the container from event.target', () => {
        const container = document.createElement('div');
        container.setAttribute('data-island', 'failing-widget');
        document.body.appendChild(container);

        const state = createDevToolsState();
        stop = state.start();

        const error = new Error('boom');
        container.dispatchEvent(new CustomEvent('laughtale:hydration-error', {
            bubbles: true,
            composed: true,
            detail: { name: 'failing-widget', error }
        }));

        const tracked = state.islands.get(container)!;
        assert.equal(tracked.error, error);
    });

    it('reads data-laughtale-warning-* attributes into the warnings field at seed time', () => {
        const container = document.createElement('div');
        container.setAttribute('data-island', 'warned-widget');
        container.setAttribute('data-laughtale-warning-media', 'media query without Media strategy');
        document.body.appendChild(container);

        const state = createDevToolsState();
        stop = state.start();

        const tracked = state.islands.get(container)!;
        assert.equal(tracked.warnings.media, 'media query without Media strategy');
        assert.equal(tracked.warnings.name, undefined);
    });

    it('picks up an island element appended to the DOM after start() via MutationObserver', async () => {
        const state = createDevToolsState();
        stop = state.start();
        assert.equal(state.islands.size, 0);

        const container = document.createElement('div');
        container.setAttribute('data-island', 'late-widget');
        document.body.appendChild(container);

        await new Promise((r) => setTimeout(r, 20));

        assert.equal(state.islands.size, 1);
        assert.ok(state.islands.get(container));
    });

    it('stop() returned by start() removes its document-level listeners', () => {
        const state = createDevToolsState();
        const stopFn = state.start();
        stopFn();

        const container = document.createElement('div');
        container.setAttribute('data-island', 'ignored-widget');
        document.body.appendChild(container);

        container.dispatchEvent(new CustomEvent('laughtale:diagnostic', {
            bubbles: true,
            composed: true,
            detail: { name: 'ignored-widget' }
        }));

        // The island wasn't seeded (appended after start()) and the diagnostic listener was removed,
        // so nothing should have been tracked.
        assert.equal(state.islands.size, 0);
    });
});
