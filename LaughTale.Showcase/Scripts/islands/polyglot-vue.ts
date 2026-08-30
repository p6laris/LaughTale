import { IslandContext, onIslandEvent } from '../../../LaughTale.Client/src/index';

interface VuePolyglotProps {
    warehouse?: string;
    initialStock?: number;
}

export default function VuePolyglotIsland(
    container: HTMLElement,
    props: VuePolyglotProps,
    ctx?: IslandContext
) {
    const warehouse = props.warehouse || 'Central Logistics Hub';
    let stock = props.initialStock || 50;
    const history: string[] = [];

    function render() {
        container.innerHTML = `
            <div class="p-card p-4 rounded-xl border border-border bg-surface-0 shadow-sm" style="border-top: 3px solid #10b981;">
                <div class="flex justify-between items-center mb-2">
                    <div class="flex items-center gap-2">
                        <span style="font-size: 1.25rem;">🟢</span>
                        <h4 class="font-bold text-sm text-surface-900 m-0">Vue 3 Island</h4>
                    </div>
                    <span class="aura-tag tag-emerald text-xs">Event Listener</span>
                </div>
                <p class="text-xs text-muted mb-2">Warehouse: <strong class="text-emerald-500">${warehouse}</strong></p>
                <div class="text-xl font-mono font-bold text-surface-900 my-1">${stock} Units in Stock</div>
                
                <div class="history-box mt-3 pt-2 border-t border-border">
                    <span class="text-xs font-semibold text-muted block mb-1">Live Events (from React/Svelte):</span>
                    <div class="space-y-1">
                        ${history.length === 0 ? '<div class="text-xs text-muted italic">Listening for sales...</div>' : ''}
                        ${history.map(msg => `<div class="text-xs p-1.5 bg-surface-50 rounded border border-border text-surface-800">${msg}</div>`).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    render();

    // Listen to sales broadcasted from the React island
    const unsubscribe = onIslandEvent('polyglot:sale', (payload: any) => {
        stock = Math.max(0, stock - 1);
        history.unshift(`[${payload.timestamp}] Received $${payload.amount} sale from ${payload.source}!`);
        if (history.length > 3) history.pop();
        render();
    });

    ctx?.onCleanup(() => {
        unsubscribe?.();
    });

    return () => {
        unsubscribe?.();
    };
}
