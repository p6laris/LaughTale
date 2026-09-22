/**
 * LaughTale: Core Web Vitals (ROADMAP.v5.md Part J "Report Core Web Vitals back through the
 * instrumentation hook"). LCP, CLS, and INP measured via the browser's own native
 * `PerformanceObserver` API - deliberately NOT the `web-vitals` npm package: this framework's client
 * has no runtime dependencies today, and these three metrics are each a genuinely small amount of
 * real observer wiring, not enough to justify pulling in an external library for.
 *
 * Reported through the SAME bridge ROADMAP.v5.md Part H's instrumentation hook already built
 * (`runtime/telemetry.ts`'s `sendBeacon` pattern, `LaughTaleActivitySource` server-side) - one
 * OpenTelemetry backend ends up showing island render/hydration timing AND page-level Web Vitals
 * together.
 *
 * Honest scope notes (not glossed over):
 * - CLS implements the real, documented session-window algorithm (web.dev's own spec: group shifts
 *   into sessions no more than 1s apart and 5s long, report the session with the largest total) - not
 *   a naive running sum, which would over-report CLS on a long-lived page.
 * - INP is a SIMPLIFIED approximation: the true spec computes an ~98th-percentile across every
 *   distinct user interaction (grouped by `interactionId`) over the page's whole lifetime. This
 *   tracks the single WORST interaction duration observed instead - correct enough to catch a
 *   genuinely slow interaction, but not spec-exact for pages with many interactions where the 98th
 *   percentile and the max diverge.
 * - LCP simply tracks the most recent `largest-contentful-paint` entry - the browser itself stops
 *   emitting new ones after the first user interaction/backgrounding, so "most recent" is already
 *   "final" by construction.
 */

export interface WebVitalMetric {
    name: 'LCP' | 'CLS' | 'INP';
    value: number;
}

type ReportFn = (metric: WebVitalMetric) => void;

function safeObserve(type: string, callback: (entries: PerformanceObserverEntryList) => void, options?: PerformanceObserverInit): (() => void) | null {
    if (typeof PerformanceObserver === 'undefined') {
        return null;
    }

    try {
        const observer = new PerformanceObserver(callback);
        observer.observe({ type, buffered: true, ...options } as PerformanceObserverInit);
        return () => observer.disconnect();
    } catch {
        // This entry type isn't supported in this browser - not every browser supports every Web
        // Vitals entry type, and a missing metric must never throw or block the others.
        return null;
    }
}

/**
 * Observes LCP, CLS, and INP for the lifetime of the current page, invoking `onReport` with each
 * metric's current-best value once the page becomes hidden (the standard point at which these
 * metrics are considered "final" - a page that never becomes hidden, e.g. closed via OS task kill,
 * never reports, which matches how every real Web Vitals implementation behaves). Returns an
 * unsubscribe function that stops observing early.
 */
export function observeCoreWebVitals(onReport: ReportFn): () => void {
    let lcpValue = 0;
    let clsValue = 0;
    let inpValue = 0;

    let clsSessionValue = 0;
    let clsSessionEntries: { startTime: number }[] = [];

    const disconnects: (() => void)[] = [];

    const lcpDisconnect = safeObserve('largest-contentful-paint', (list) => {
        const entries = list.getEntries() as PerformanceEntry[];
        const last = entries[entries.length - 1] as any;
        if (last) {
            lcpValue = last.renderTime || last.startTime;
        }
    });
    if (lcpDisconnect) disconnects.push(lcpDisconnect);

    const clsDisconnect = safeObserve('layout-shift', (list) => {
        for (const entry of list.getEntries() as any[]) {
            if (entry.hadRecentInput) continue;

            const first = clsSessionEntries[0];
            const last = clsSessionEntries[clsSessionEntries.length - 1];

            if (clsSessionValue && last && entry.startTime - last.startTime < 1000 && entry.startTime - first.startTime < 5000) {
                clsSessionValue += entry.value;
                clsSessionEntries.push(entry);
            } else {
                clsSessionValue = entry.value;
                clsSessionEntries = [entry];
            }

            if (clsSessionValue > clsValue) {
                clsValue = clsSessionValue;
            }
        }
    });
    if (clsDisconnect) disconnects.push(clsDisconnect);

    const inpDisconnect = safeObserve('event', (list) => {
        for (const entry of list.getEntries() as any[]) {
            if (typeof entry.interactionId === 'number' && entry.interactionId > 0 && entry.duration > inpValue) {
                inpValue = entry.duration;
            }
        }
    }, { durationThreshold: 40 } as any);
    if (inpDisconnect) disconnects.push(inpDisconnect);

    const report = () => {
        if (lcpValue > 0) onReport({ name: 'LCP', value: lcpValue });
        if (clsValue > 0) onReport({ name: 'CLS', value: Math.round(clsValue * 1000) / 1000 });
        if (inpValue > 0) onReport({ name: 'INP', value: inpValue });
    };

    const onVisibilityChange = () => {
        if (typeof document !== 'undefined' && document.visibilityState === 'hidden') {
            report();
        }
    };

    if (typeof document !== 'undefined') {
        document.addEventListener('visibilitychange', onVisibilityChange);
    }

    return () => {
        if (typeof document !== 'undefined') {
            document.removeEventListener('visibilitychange', onVisibilityChange);
        }
        disconnects.forEach((d) => d());
    };
}

/**
 * Opts this page into observing Core Web Vitals AND beaconing each one to `endpoint` (default:
 * `MapLaughTaleWebVitals`'s own default route) once the page is hidden. Not wired automatically
 * anywhere - matches every other opt-in reporting hook in this codebase (Prefetch, Rate Limiting,
 * `wireLaughTaleTelemetryReporting`).
 */
export function wireLaughTaleWebVitalsReporting(
    endpoint: string = '/_laughtale/telemetry/web-vitals'
): () => void {
    return observeCoreWebVitals((metric) => {
        if (typeof navigator === 'undefined' || typeof navigator.sendBeacon !== 'function') {
            return;
        }

        try {
            navigator.sendBeacon(
                endpoint,
                new Blob([JSON.stringify({ name: metric.name, value: metric.value })], { type: 'application/json' })
            );
        } catch {
            // A telemetry beacon failing must never surface as a page error.
        }
    });
}
