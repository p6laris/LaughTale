import '../setup.ts';
import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { prefetchIslandChunk, prefetchIslandChunksInHtml, clearChunkPrefetchState } from '../../src/router/chunk-prefetch.ts';
import { defineIsland, clearRegistry } from '../../src/runtime/registry.ts';

describe('Speculative Chunk Prefetch Suite (ROADMAP.v5.md Part B)', () => {
    beforeEach(() => {
        clearRegistry();
        clearChunkPrefetchState();
    });

    it('calls a registered island\'s loader exactly once to warm its chunk', () => {
        let calls = 0;
        defineIsland('counter', () => {
            calls++;
            return Promise.resolve({ default: () => {} });
        });

        prefetchIslandChunk('counter');

        assert.equal(calls, 1);
    });

    it('does not re-warm an already-warmed island on a second call', () => {
        let calls = 0;
        defineIsland('counter', () => {
            calls++;
            return Promise.resolve({ default: () => {} });
        });

        prefetchIslandChunk('counter');
        prefetchIslandChunk('counter');

        assert.equal(calls, 1, 'A second prefetch call for the same island must not re-trigger its loader');
    });

    it('silently no-ops for an unregistered island name', () => {
        assert.doesNotThrow(() => prefetchIslandChunk('does-not-exist'));
    });

    it('retries a failed prefetch on a later call, rather than permanently giving up', async () => {
        let calls = 0;
        defineIsland('flaky', () => {
            calls++;
            return calls === 1 ? Promise.reject(new Error('network error')) : Promise.resolve({ default: () => {} });
        });

        prefetchIslandChunk('flaky');
        await new Promise((r) => setTimeout(r, 0)); // let the rejection's .catch() run

        prefetchIslandChunk('flaky');
        await new Promise((r) => setTimeout(r, 0));

        assert.equal(calls, 2, 'A failed prefetch must be retried, not marked as permanently warmed');
    });

    it('extracts every distinct data-island name from an HTML string and warms each one', () => {
        const warmedNames: string[] = [];
        defineIsland('widget-a', () => { warmedNames.push('widget-a'); return Promise.resolve({ default: () => {} }); });
        defineIsland('widget-b', () => { warmedNames.push('widget-b'); return Promise.resolve({ default: () => {} }); });

        const html = `
            <div data-island="widget-a" data-props="{}"></div>
            <div data-island="widget-b" data-props="{}"></div>
            <div data-island="widget-a" data-props="{&quot;x&quot;:1}"></div>
        `;

        prefetchIslandChunksInHtml(html);

        assert.deepEqual(warmedNames.sort(), ['widget-a', 'widget-b'], 'A duplicate data-island occurrence must only warm its chunk once');
    });

    it('is a no-op for HTML with no data-island occurrences', () => {
        assert.doesNotThrow(() => prefetchIslandChunksInHtml('<div>no islands here</div>'));
    });
});
