import { IslandContext, onIslandEvent } from '../../../LaughTale.Client/src/index';

interface VanillaPolyglotProps {
    logTitle?: string;
}

export default function VanillaPolyglotIsland(
    container: HTMLElement,
    props: VanillaPolyglotProps,
    ctx?: IslandContext
) {
    const title = props.logTitle || 'Event Bus Audit Ledger';
    const logs: { time: string; msg: string }[] = [];

    function render() {
        container.innerHTML = `
            <div class="p-card p-4 rounded-xl border border-border bg-surface-950 text-surface-200 shadow-sm font-mono text-xs" style="border-top: 3px solid #e2e8f0;">
                <div class="flex justify-between items-center mb-2 text-white">
                    <div class="flex items-center gap-2">
                        <span style="font-size: 1.25rem;">🍦</span>
                        <h4 class="font-bold text-sm text-white m-0 font-sans">${title}</h4>
                    </div>
                    <span class="aura-tag tag-slate text-xs">Vanilla TS (0 KB VDOM)</span>
                </div>
                <p class="text-xs text-surface-400 font-sans mb-3">Captures cross-framework events via standard Web APIs.</p>
                
                <div class="logs-container space-y-1.5 min-h-24">
                    ${logs.length === 0 ? '<div class="text-surface-500 italic font-sans">No events logged yet. Click React/Svelte buttons above!</div>' : ''}
                    ${logs.map(log => `
                        <div class="flex gap-2 items-center text-emerald-400">
                            <span class="text-surface-500">[${log.time}]</span>
                            <span>${log.msg}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    render();

    const unsubscribe = onIslandEvent('polyglot:sale', (payload: any) => {
        logs.unshift({
            time: payload.timestamp,
            msg: `Broadcast: ${payload.source} registered +$${payload.amount} sale (Total: $${payload.total})`
        });
        if (logs.length > 5) logs.pop();
        render();
    });

    ctx?.onCleanup(() => {
        unsubscribe?.();
    });

    return () => {
        unsubscribe?.();
    };
}
