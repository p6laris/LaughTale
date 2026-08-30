import { IslandContext, onIslandEvent } from '../../../LaughTale.Client/src/index';

export default function PreactPolyglotIsland(
    container: HTMLElement,
    props: any,
    ctx?: IslandContext
) {
    const metricName = props?.metricName || 'Transactions Throughput';
    let data = [12, 18, 15, 26, 22, 34, 30, 42, 38, 48];

    function render() {
        const min = Math.min(...data);
        const max = Math.max(...data) || 1;
        const range = max - min || 1;
        const width = 300;
        const height = 65;

        // Generate smooth SVG path points
        const points = data.map((val, i) => {
            const x = (i / (data.length - 1)) * width;
            const y = height - ((val - min) / range) * (height - 15) - 8;
            return `${x.toFixed(1)},${y.toFixed(1)}`;
        }).join(' ');

        const areaPath = `M 0,${height} L ${points.split(' ').map((p, i) => i === 0 ? p : `L ${p}`).join(' ')} L ${width},${height} Z`;

        container.innerHTML = `
            <div class="p-card rounded-2xl border border-border bg-surface-0 p-5 shadow-md" style="border-top: 4px solid #6366f1; height: 100%; display: flex; flex-direction: column; justify-content: space-between;">
                <!-- Header -->
                <div>
                    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.75rem;">
                        <div style="display: flex; align-items: center; gap: 0.6rem;">
                            <div style="width: 2rem; height: 2rem; border-radius: 8px; background: rgba(99, 102, 241, 0.12); color: #4f46e5; display: flex; align-items: center; justify-content: center; font-size: 1.1rem; font-weight: bold;">⚡</div>
                            <div>
                                <h4 style="margin: 0; font-size: 0.95rem; font-weight: 700; color: var(--p-text-color);">${metricName}</h4>
                                <span style="font-size: 0.7rem; color: var(--p-text-muted);">Preact • 3 KB Runtime</span>
                            </div>
                        </div>
                        <span class="aura-tag tag-indigo" style="font-size: 0.7rem; font-weight: 600;">Preact (3KB)</span>
                    </div>

                    <!-- Metrics Readout -->
                    <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 0.5rem;">
                        <div>
                            <span style="font-size: 0.7rem; color: var(--p-text-muted);">Current Velocity</span>
                            <div style="font-size: 1.5rem; font-weight: 800; font-family: var(--p-font-mono); color: var(--p-text-color);">${data[data.length - 1]} <span style="font-size: 0.75rem; font-weight: 500; color: var(--p-text-muted);">tx/sec</span></div>
                        </div>
                        <div style="text-align: right; font-size: 0.75rem;">
                            <span style="color: var(--p-text-muted);">Latency:</span> <strong style="color: #10b981;">3.8 ms (P99)</strong>
                        </div>
                    </div>

                    <!-- SVG Smooth Gradient Area Chart -->
                    <div style="position: relative; width: 100%; overflow: hidden; border-radius: 8px; background: var(--p-surface-50); border: 1px solid var(--p-border-color); padding: 4px 0 0;">
                        <svg viewBox="0 0 ${width} ${height}" style="width: 100%; height: 65px; display: block; overflow: visible;">
                            <defs>
                                <linearGradient id="preactAreaGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stop-color="#6366f1" stop-opacity="0.35"/>
                                    <stop offset="100%" stop-color="#6366f1" stop-opacity="0.0"/>
                                </linearGradient>
                            </defs>
                            <!-- Gradient Area -->
                            <path d="${areaPath}" fill="url(#preactAreaGrad)" />
                            <!-- Line Stroke -->
                            <polyline fill="none" stroke="#6366f1" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" points="${points}" />
                        </svg>
                    </div>
                </div>

                <div style="display: flex; justify-content: space-between; font-size: 0.7rem; color: var(--p-text-muted); margin-top: 0.75rem; border-top: 1px solid var(--p-border-color); padding-top: 0.5rem;">
                    <span>Floor: ${min} tx/s</span>
                    <span>Peak: <strong>${max} tx/s</strong></span>
                </div>
            </div>
        `;
    }

    render();

    const unsubscribe = onIslandEvent('polyglot:sale', () => {
        data.push(Math.floor(Math.random() * 25) + 35);
        if (data.length > 10) data.shift();
        render();
    });

    ctx?.onCleanup(() => unsubscribe?.());
    return () => unsubscribe?.();
}
