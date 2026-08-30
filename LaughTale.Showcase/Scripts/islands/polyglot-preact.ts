import { IslandContext, onIslandEvent } from '../../../LaughTale.Client/src/index';

interface PreactPolyglotProps {
    metricName?: string;
}

export default function PreactPolyglotIsland(
    container: HTMLElement,
    props: PreactPolyglotProps,
    ctx?: IslandContext
) {
    const metricName = props.metricName || 'Transaction Throughput';
    let data = [10, 15, 12, 20, 18, 24, 22];

    function render() {
        const min = Math.min(...data);
        const max = Math.max(...data) || 1;
        const range = max - min || 1;
        const points = data.map((val, i) => `${(i / (data.length - 1)) * 100},${24 - ((val - min) / range) * 20}`).join(' ');

        container.innerHTML = `
            <div class="p-card p-4 rounded-xl border border-border bg-surface-0 shadow-sm" style="border-top: 3px solid #6366f1;">
                <div class="flex justify-between items-center mb-2">
                    <div class="flex items-center gap-2">
                        <span style="font-size: 1.25rem;">⚡</span>
                        <h4 class="font-bold text-sm text-surface-900 m-0">${metricName}</h4>
                    </div>
                    <span class="aura-tag tag-indigo text-xs">Preact 3KB</span>
                </div>
                <p class="text-xs text-muted mb-1">Bundle Size: <strong class="text-indigo-500">3 KB Virtual DOM</strong></p>
                
                <svg viewBox="0 0 100 24" class="w-full h-8 overflow-visible my-2">
                    <polyline fill="none" stroke="#6366f1" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" points="${points}" />
                </svg>

                <div class="flex justify-between text-xs font-mono text-muted">
                    <span>Low: ${min}</span>
                    <span>Peak: <strong>${max} tx/s</strong></span>
                </div>
            </div>
        `;
    }

    render();

    const unsubscribe = onIslandEvent('polyglot:sale', () => {
        data.push(Math.floor(Math.random() * 20) + 30);
        if (data.length > 10) data.shift();
        render();
    });

    ctx?.onCleanup(() => {
        unsubscribe?.();
    });

    return () => {
        unsubscribe?.();
    };
}
