/**
 * LaughTale: Instrumentation Hook, client half (ROADMAP.v5.md Part H "instrumentation hook exporting
 * island render/hydration timings as OpenTelemetry spans").
 *
 * hydrator.ts already computes real per-island hydration duration (via `performance.mark`/`measure`)
 * and dispatches it on the `laughtale:diagnostic` DOM event - that part is NOT new. What was missing
 * was any way to get that number OUT of the browser and into an exportable trace. This module is that
 * bridge: `wireLaughTaleTelemetryReporting()` listens for `laughtale:diagnostic` and beacons each
 * island's hydration duration to `IslandTelemetryEndpointExtensions.MapLaughTaleIslandTelemetry`'s
 * endpoint, which turns it into a real `island.hydrate` Activity under the SAME ActivitySource the
 * server's own `island.render` spans use - one exportable OpenTelemetry timeline for both halves of an
 * island's lifecycle.
 *
 * Deliberately NOT wired automatically anywhere - a consuming app opts in with one call, matching this
 * framework's existing "zero cost until an app asks for it" posture (see e.g. Prefetch, Rate Limiting).
 * A full OpenTelemetry JS SDK is deliberately NOT a dependency here either: `navigator.sendBeacon` is
 * a native, zero-dependency, fire-and-forget browser primitive built for exactly this ("send a small
 * payload, don't block/wait, survive page unload") - adding `@opentelemetry/sdk-trace-web` would
 * pull a real dependency into this framework's zero-dependency core for a job the platform already
 * does natively.
 */

export interface HydrationDiagnosticDetail {
    name: string;
    strategy?: string;
    framework?: string;
    propsSize?: number;
    durationMs?: number;
}

/**
 * Beacons one island's reported hydration duration to `endpoint`. Silently does nothing if
 * `durationMs` wasn't computed (e.g. the Performance API isn't available in this environment) or
 * `navigator.sendBeacon` doesn't exist (very old browsers) - a missed telemetry beacon must never
 * throw or otherwise affect the page.
 */
export function reportHydrationTelemetry(endpoint: string, detail: HydrationDiagnosticDetail): void {
    if (typeof detail.durationMs !== 'number' || !Number.isFinite(detail.durationMs)) {
        return;
    }

    if (typeof navigator === 'undefined' || typeof navigator.sendBeacon !== 'function') {
        return;
    }

    const payload = JSON.stringify({
        name: detail.name,
        durationMs: detail.durationMs,
        strategy: detail.strategy
    });

    try {
        navigator.sendBeacon(endpoint, new Blob([payload], { type: 'application/json' }));
    } catch {
        // A telemetry beacon failing must never surface as a page error.
    }
}

/**
 * Opts this page into reporting every island's hydration duration to `endpoint` (default:
 * `MapLaughTaleIslandTelemetry`'s own default route). Returns an unsubscribe function, matching
 * every other `attachXxxListener`-shaped API in this codebase.
 */
export function wireLaughTaleTelemetryReporting(
    endpoint: string = '/_laughtale/telemetry/hydration'
): () => void {
    const listener = (e: Event) => {
        const detail = (e as CustomEvent<HydrationDiagnosticDetail>).detail;
        if (detail) {
            reportHydrationTelemetry(endpoint, detail);
        }
    };

    document.addEventListener('laughtale:diagnostic', listener);
    return () => document.removeEventListener('laughtale:diagnostic', listener);
}
