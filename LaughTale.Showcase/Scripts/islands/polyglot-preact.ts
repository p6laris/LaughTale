import { IslandContext, onIslandEvent } from '../../../LaughTale.Client/src/index';

const ICONS = {
    trendingUp: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>`,
    zap: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/></svg>`
};

export default function PreactPolyglotIsland(
    container: HTMLElement,
    props: any,
    ctx?: IslandContext
) {
    const metricName = props?.metricName || 'Transactions Throughput';
    let data = [14, 22, 18, 28, 24, 38, 32, 46, 40, 52];

    function render() {
        const min = Math.min(...data);
        const max = Math.max(...data) || 1;
        const range = max - min || 1;
        const width = 300;
        const height = 65;

        const points = data.map((val, i) => {
            const x = (i / (data.length - 1)) * width;
            const y = height - ((val - min) / range) * (height - 15) - 8;
            return `${x.toFixed(1)},${y.toFixed(1)}`;
        }).join(' ');

        const areaPath = `M 0,${height} L ${points.split(' ').map((p, i) => i === 0 ? p : `L ${p}`).join(' ')} L ${width},${height} Z`;

        container.innerHTML = `
            <div class="p-card" style="background: var(--p-surface-0); border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius-xl); padding: 1.5rem; box-shadow: var(--p-shadow-sm); height: 100%; display: flex; flex-direction: column; justify-content: space-between;">
                <!-- Header -->
                <div>
                    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.25rem;">
                        <div style="display: flex; align-items: center; gap: 0.75rem;">
                            <div style="width: 2.25rem; height: 2.25rem; border-radius: var(--p-border-radius-md); background: var(--p-indigo-50, rgba(99, 102, 241, 0.1)); color: var(--p-indigo-500, #6366f1); display: flex; align-items: center; justify-content: center;">
                                ${ICONS.trendingUp}
                            </div>
                            <div>
                                <h4 style="margin: 0; font-size: 0.95rem; font-weight: 700; color: var(--p-text-color);">${metricName}</h4>
                                <span style="font-size: 0.75rem; color: var(--p-text-muted);">Preact • 3 KB Virtual DOM</span>
                            </div>
                        </div>
                        <span class="p-tag p-tag-secondary" style="font-size: 0.7rem; font-weight: 600; padding: 0.2rem 0.6rem;">Preact (3KB)</span>
                    </div>

                    <!-- Metrics Readout -->
                    <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 0.75rem;">
                        <div>
                            <span style="font-size: 0.7rem; color: var(--p-text-muted); font-weight: 600; text-transform: uppercase;">Current Throughput</span>
                            <div style="font-size: 1.6rem; font-weight: 800; font-family: var(--p-font-mono); color: var(--p-text-color);">${data[data.length - 1]} <span style="font-size: 0.75rem; font-weight: 500; color: var(--p-text-muted);">tx/sec</span></div>
                        </div>
                        <div style="text-align: right; font-size: 0.75rem;">
                            <span style="color: var(--p-text-muted);">Latency:</span> <strong style="color: var(--p-green-500, #10b981);">3.8 ms</strong>
                        </div>
                    </div>

                    <!-- SVG Smooth Gradient Area Chart -->
                    <div style="position: relative; width: 100%; overflow: hidden; border-radius: var(--p-border-radius-md); background: var(--p-surface-50); border: 1px solid var(--p-border-color); padding: 4px 0 0;">
                        <svg viewBox="0 0 ${width} ${height}" style="width: 100%; height: 65px; display: block; overflow: visible;">
                            <defs>
                                <linearGradient id="preactAreaGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stop-color="var(--p-primary-500, #6366f1)" stop-opacity="0.3"/>
                                    <stop offset="100%" stop-color="var(--p-primary-500, #6366f1)" stop-opacity="0.0"/>
                                </linearGradient>
                            </defs>
                            <path d="${areaPath}" fill="url(#preactAreaGrad)" />
                            <polyline fill="none" stroke="var(--p-primary-500, #6366f1)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" points="${points}" />
                        </svg>
                    </div>
                </div>

                <div style="display: flex; justify-content: space-between; font-size: 0.75rem; color: var(--p-text-muted); margin-top: 1rem; border-top: 1px solid var(--p-border-color); padding-top: 0.75rem;">
                    <span>Floor: <strong>${min} tx/s</strong></span>
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
