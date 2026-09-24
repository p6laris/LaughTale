/** @jsxImportSource preact */
import { useEffect, useState } from 'preact/hooks';
import { emitIslandEvent, onIslandEvent } from '../../../../LaughTale.Client/src/runtime/events';

// A real Preact component, rendered to HTML by the SSR sidecar and hydrated in the browser. It is
// imported by both the client island and the server bundle (Scripts/ssr-entry.ts), so its first
// render must be deterministic: randomness and time only in event handlers and effects.
// The pragma above makes this file's JSX compile against Preact instead of the project default (React).

interface PolyglotPreactProps {
    metricName?: string;
}

const INITIAL_DATA = [14, 22, 18, 28, 24, 38, 32, 46, 40, 52];
const WIDTH = 300;
const HEIGHT = 65;

function TrendingUpIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
            <polyline points="16 7 22 7 22 13" />
        </svg>
    );
}

function ZapIcon() {
    return (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" />
        </svg>
    );
}

function chartPaths(data: number[]) {
    const min = Math.min(...data);
    const max = Math.max(...data) || 1;
    const range = max - min || 1;
    const points = data.map((val, i) => {
        const x = (i / (data.length - 1)) * WIDTH;
        const y = HEIGHT - ((val - min) / range) * (HEIGHT - 15) - 8;
        return `${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(' ');
    const area = `M 0,${HEIGHT} L ${points.split(' ').map((p, i) => i === 0 ? p : `L ${p}`).join(' ')} L ${WIDTH},${HEIGHT} Z`;
    return { points, area, max };
}

export default function PolyglotPreact(props: PolyglotPreactProps) {
    const [data, setData] = useState(INITIAL_DATA);
    const { points, area, max } = chartPaths(data);

    // Reacts to the React island's sales on the same page. Effects never run on the server.
    useEffect(() => onIslandEvent('polyglot:sale', () => {
        setData(prev => [...prev, Math.floor(Math.random() * 25) + 35].slice(-10));
    }), []);

    function burst() {
        const next = (data[data.length - 1] || 40) + 25;
        setData(prev => [...prev, next].slice(-10));
        emitIslandEvent('polyglot:burst', {
            source: 'Preact Island',
            throughput: next,
            latencyMs: (Math.random() * 2 + 1.5).toFixed(1),
            timestamp: new Date().toLocaleTimeString()
        });
    }

    return (
        <div class="p-card" style="background: var(--p-surface-0); border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius-xl); padding: 1.5rem; box-shadow: var(--p-shadow-sm); height: 100%; display: flex; flex-direction: column; justify-content: space-between;">
            <div>
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.25rem;">
                    <div style="display: flex; align-items: center; gap: 0.75rem;">
                        <div style="width: 2.25rem; height: 2.25rem; border-radius: var(--p-border-radius-md); background: var(--p-indigo-50, rgba(99, 102, 241, 0.1)); color: var(--p-indigo-500, #6366f1); display: flex; align-items: center; justify-content: center;">
                            <TrendingUpIcon />
                        </div>
                        <div>
                            <h4 style="margin: 0; font-size: 0.95rem; font-weight: 700; color: var(--p-text-color);">{props.metricName || 'Transactions Throughput'}</h4>
                            <span style="font-size: 0.75rem; color: var(--p-text-muted);">Server-rendered • Hydrated</span>
                        </div>
                    </div>
                    <span class="p-tag p-tag-secondary" style="font-size: 0.7rem; font-weight: 600; padding: 0.2rem 0.6rem;">Preact (3KB)</span>
                </div>

                <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 0.75rem;">
                    <div>
                        <span style="font-size: 0.7rem; color: var(--p-text-muted); font-weight: 600; text-transform: uppercase;">Current Throughput</span>
                        <div data-testid="preact-throughput" style="font-size: 1.6rem; font-weight: 800; font-family: var(--p-font-mono); color: var(--p-text-color);">
                            {data[data.length - 1]} <span style="font-size: 0.75rem; font-weight: 500; color: var(--p-text-muted);">tx/sec</span>
                        </div>
                    </div>
                    <div style="text-align: right; font-size: 0.75rem;">
                        <span style="color: var(--p-text-muted);">Latency:</span> <strong style="color: var(--p-green-500, #10b981);">3.8 ms</strong>
                    </div>
                </div>

                <div style="position: relative; width: 100%; overflow: hidden; border-radius: var(--p-border-radius-md); background: var(--p-surface-50); border: 1px solid var(--p-border-color); padding: 4px 0 0;">
                    <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} style="width: 100%; height: 65px; display: block; overflow: visible;">
                        <defs>
                            <linearGradient id="preactAreaGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stop-color="var(--p-primary-500, #6366f1)" stop-opacity="0.3" />
                                <stop offset="100%" stop-color="var(--p-primary-500, #6366f1)" stop-opacity="0.0" />
                            </linearGradient>
                        </defs>
                        <path d={area} fill="url(#preactAreaGrad)" />
                        <polyline fill="none" stroke="var(--p-primary-500, #6366f1)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" points={points} />
                    </svg>
                </div>
            </div>

            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 1rem; border-top: 1px solid var(--p-border-color); padding-top: 0.75rem;">
                <span style="font-size: 0.75rem; color: var(--p-text-muted);">Peak: <strong>{max} tx/s</strong></span>
                <button type="button" data-testid="preact-burst" class="p-button p-button-outlined p-button-sm" onClick={burst} style="font-size: 0.75rem; padding: 0.35rem 0.65rem; display: inline-flex; align-items: center; gap: 0.35rem; font-weight: 600;">
                    <ZapIcon /> Burst (+25 tx/s)
                </button>
            </div>
        </div>
    );
}
