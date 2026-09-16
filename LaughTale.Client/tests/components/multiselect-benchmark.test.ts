import '../setup.ts';
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import MultiSelectIsland from '../../src/components/multiselect.ts';
import { measureThroughput } from '../../src/runtime/benchmark.ts';

describe('MultiSelect Filter Throughput Benchmark Suite (ROADMAP.v5.md Part I - first real measureThroughput caller)', () => {
    it('measures filter-keystroke re-render throughput across ~200 options', () => {
        const container = document.createElement('div');
        document.body.appendChild(container);

        const options = Array.from({ length: 200 }, (_, i) => ({
            label: `Option ${i}`,
            value: `opt-${i}`
        }));

        MultiSelectIsland(container, { options, filter: true });

        const filterInput = container.querySelector<HTMLInputElement>('.multiselect-filter-input');
        assert.ok(filterInput, 'filter input must be rendered');

        const iterations = 50;
        const result = measureThroughput('multiselect-filter-keystroke', iterations, (i) => {
            // Simulate typing: a progressively different query on every "keystroke",
            // cycling back to an empty query periodically so patchList sees both
            // shrinking and growing result sets (inserts and removals), not just one
            // direction.
            const query = i % 5 === 0 ? '' : `Option ${i % 20}`;
            filterInput.value = query;
            filterInput.dispatchEvent(new Event('input', { bubbles: true }));
        });

        console.log(
            `[multiselect-filter-keystroke] iterations=${result.iterations} ` +
            `opsPerSec=${result.opsPerSec} meanMs=${result.meanMs} ` +
            `p50Ms=${result.p50Ms} p95Ms=${result.p95Ms} p99Ms=${result.p99Ms} ` +
            `minMs=${result.minMs} maxMs=${result.maxMs} totalMs=${result.totalMs}`
        );

        // Not a performance gate (that would be flaky) - just proof the harness
        // produces a real, sane, inspectable number for a real component path.
        assert.equal(result.iterations, iterations);
        assert.ok(result.opsPerSec > 0, 'opsPerSec must be positive');
        assert.ok(Number.isFinite(result.p95Ms), 'p95Ms must be a finite number');
        assert.ok(Number.isFinite(result.meanMs), 'meanMs must be a finite number');
    });
});
