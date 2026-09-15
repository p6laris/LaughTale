/**
 * Tests for the `laughtale:diagnostic` CustomEvent (ROADMAP.v5.md Part G/L diagnostics
 * extension point) — the "smallest real v1": one structured event dispatched right after
 * `laughtale:hydrated`, reusing the perf mark/measure hydrateIsland already computes.
 */

import '../setup.ts';
import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';

import { defineIsland } from '../../src/runtime/registry.ts';
import { hydrateIsland } from '../../src/runtime/hydrator.ts';

describe('laughtale:diagnostic Event Suite', () => {
    beforeEach(() => {
        document.body.innerHTML = '';
    });

    it('fires laughtale:diagnostic with the expected detail shape right after a successful hydration', async () => {
        defineIsland('diagnostic-widget', () => Promise.resolve({
            default: (_el: HTMLElement) => {}
        }));

        const container = document.createElement('div');
        container.setAttribute('data-island', 'diagnostic-widget');
        container.setAttribute('data-hydrate', 'load');
        container.setAttribute('data-framework', 'react');
        container.setAttribute('data-props', '{"title":"Hi"}');
        document.body.appendChild(container);

        let diagnosticEvent: CustomEvent | null = null;
        container.addEventListener('laughtale:diagnostic', (e: any) => {
            diagnosticEvent = e;
        });

        hydrateIsland(container);
        await new Promise((r) => setTimeout(r, 20));

        assert.ok(diagnosticEvent, 'expected laughtale:diagnostic to have fired');
        const detail = (diagnosticEvent as any).detail;
        assert.equal(detail.name, 'diagnostic-widget');
        assert.equal(detail.strategy, 'load');
        assert.equal(detail.framework, 'react');
        assert.equal(detail.propsSize, '{"title":"Hi"}'.length);
        assert.ok(
            detail.durationMs === undefined || typeof detail.durationMs === 'number',
            'durationMs must be a number when the Performance API measure is available, else undefined'
        );
    });

    it('reports framework as undefined and propsSize 0 when neither data-framework nor data-props is present', async () => {
        defineIsland('bare-widget', () => Promise.resolve({
            default: (_el: HTMLElement) => {}
        }));

        const container = document.createElement('div');
        container.setAttribute('data-island', 'bare-widget');
        container.setAttribute('data-hydrate', 'load');
        document.body.appendChild(container);

        let diagnosticEvent: CustomEvent | null = null;
        container.addEventListener('laughtale:diagnostic', (e: any) => {
            diagnosticEvent = e;
        });

        hydrateIsland(container);
        await new Promise((r) => setTimeout(r, 20));

        assert.ok(diagnosticEvent, 'expected laughtale:diagnostic to have fired');
        const detail = (diagnosticEvent as any).detail;
        assert.equal(detail.framework, undefined);
        assert.equal(detail.propsSize, 0);
    });

    it('bubbles, so a listener on document also observes it', async () => {
        defineIsland('bubble-widget', () => Promise.resolve({
            default: (_el: HTMLElement) => {}
        }));

        const container = document.createElement('div');
        container.setAttribute('data-island', 'bubble-widget');
        container.setAttribute('data-hydrate', 'load');
        document.body.appendChild(container);

        let sawOnDocument = false;
        const handler = (e: any) => {
            if (e.detail?.name === 'bubble-widget') sawOnDocument = true;
        };
        document.addEventListener('laughtale:diagnostic', handler);

        try {
            hydrateIsland(container);
            await new Promise((r) => setTimeout(r, 20));
            assert.equal(sawOnDocument, true, 'laughtale:diagnostic must bubble up to document');
        } finally {
            document.removeEventListener('laughtale:diagnostic', handler);
        }
    });

    it('does not fire laughtale:diagnostic when hydration fails', async () => {
        defineIsland('failing-diagnostic-widget', () => Promise.resolve({
            default: () => {
                throw new Error('boom');
            }
        }));

        const container = document.createElement('div');
        container.setAttribute('data-island', 'failing-diagnostic-widget');
        container.setAttribute('data-hydrate', 'load');
        document.body.appendChild(container);

        let diagnosticFired = false;
        container.addEventListener('laughtale:diagnostic', () => {
            diagnosticFired = true;
        });

        hydrateIsland(container);
        await new Promise((r) => setTimeout(r, 20));

        assert.equal(diagnosticFired, false, 'a failed hydration must not dispatch laughtale:diagnostic');
    });
});
