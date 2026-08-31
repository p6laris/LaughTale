/**
 * LaughTale: Performance Benchmarking & Metric Reporting
 * High-precision profiling for hydration latency, rendering throughput, and statistical percentiles.
 */

export interface BenchmarkMetric {
    label: string;
    iterations: number;
    totalMs: number;
    opsPerSec: number;
    meanMs: number;
    minMs: number;
    maxMs: number;
    p50Ms: number;
    p95Ms: number;
    p99Ms: number;
}

export interface HydrationMetric {
    islandName: string;
    durationMs: number;
    strategy?: string;
    timestamp: number;
}

const hydrationStore: HydrationMetric[] = [];

const getNow = (): number => {
    return typeof performance !== 'undefined' && typeof performance.now === 'function'
        ? performance.now()
        : Date.now();
};

/**
 * Calculates statistical percentiles from numeric timing samples.
 */
export function calculatePercentiles(samples: number[]): {
    number;
    number;
    number;
    min: number;
    max: number;
    mean: number;
} {
    if (samples.length === 0) {
        return { 0, 0, 0, min: 0, max: 0, mean: 0 };
    }

    const sorted = [...samples].sort((a, b) => a - b);
    const sum = sorted.reduce((acc, val) => acc + val, 0);
    const mean = sum / sorted.length;

    const getP = (p: number) => {
        const idx = Math.min(sorted.length - 1, Math.max(0, Math.floor(p * sorted.length)));
        return sorted[idx];
    };

    return {
        getP(0.5),
        getP(0.95),
        getP(0.99),
        min: sorted[0],
        max: sorted[sorted.length - 1],
        mean: Math.round(mean * 1000) / 1000
    };
}

/**
 * Measures the execution duration of an island hydration lifecycle.
 */
export async function measureHydration(
    islandName: string,
    action: () => Promise<void> | void,
    strategy?: string
): Promise<HydrationMetric> {
    const start = getNow();
    await action();
    const end = getNow();

    const metric: HydrationMetric = {
        islandName,
        durationMs: Math.round((end - start) * 100) / 100,
        strategy: strategy || 'load',
        timestamp: Date.now()
    };

    recordHydrationMetric(metric);
    return metric;
}

/**
 * Measures throughput (ops/sec and latencies) across multiple synchronous iterations.
 */
export function measureThroughput(
    label: string,
    iterations: number,
    fn: (i: number) => void
): BenchmarkMetric {
    const latencies: number[] = new Array(iterations);
    const totalStart = getNow();

    for (let i = 0; i < iterations; i++) {
        const iterStart = getNow();
        fn(i);
        const iterEnd = getNow();
        latencies[i] = iterEnd - iterStart;
    }

    const totalEnd = getNow();
    const totalMs = Math.max(0.001, totalEnd - totalStart);
    const opsPerSec = Math.round((iterations / (totalMs / 1000)));
    const stats = calculatePercentiles(latencies);

    return {
        label,
        iterations,
        totalMs: Math.round(totalMs * 100) / 100,
        opsPerSec,
        meanMs: stats.mean,
        minMs: stats.min,
        maxMs: stats.max,
        p50Ms: stats.p50,
        p95Ms: stats.p95,
        p99Ms: stats.p99
    };
}

export function recordHydrationMetric(metric: HydrationMetric): void {
    hydrationStore.push(metric);
    if (hydrationStore.length > 500) {
        hydrationStore.shift();
    }
}

export function getHydrationMetrics(): HydrationMetric[] {
    return [...hydrationStore];
}

export function clearHydrationMetrics(): void {
    hydrationStore.length = 0;
}
