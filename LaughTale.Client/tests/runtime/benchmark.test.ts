import '../setup.ts';
import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import {
    calculatePercentiles,
    measureHydration,
    measureThroughput,
    recordHydrationMetric,
    getHydrationMetrics,
    clearHydrationMetrics
} from '../../src/runtime/benchmark.ts';

describe('Performance Benchmarking & Metrics Suite', () => {
    beforeEach(() => {
        clearHydrationMetrics();
    });

    it('calculatePercentiles computes accurate statistical distributions', () => {
        const samples = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
        const stats = calculatePercentiles(samples);

        assert.equal(stats.min, 10);
        assert.equal(stats.max, 100);
        assert.equal(stats.mean, 55);
        assert.equal(stats.p50, 60);
        assert.equal(stats.p95, 100);
        assert.equal(stats.p99, 100);
    });

    it('measureHydration captures async and sync execution latencies', async () => {
        const metric = await measureHydration('stepper', () => {
            // Simulate brief mount
            const d = document.createElement('div');
            d.innerHTML = '<span>Hydrated</span>';
        }, 'visible');

        assert.equal(metric.islandName, 'stepper');
        assert.equal(metric.strategy, 'visible');
        assert.ok(typeof metric.durationMs === 'number');

        const all = getHydrationMetrics();
        assert.equal(all.length, 1);
        assert.equal(all[0].islandName, 'stepper');
    });

    it('measureThroughput measures operation iterations and throughput rates', () => {
        let count = 0;
        const result = measureThroughput('counter-increment', 1000, () => {
            count++;
        });

        assert.equal(count, 1000);
        assert.equal(result.label, 'counter-increment');
        assert.equal(result.iterations, 1000);
        assert.ok(result.opsPerSec > 0);
        assert.ok(result.meanMs >= 0);
    });
});
