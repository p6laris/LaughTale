import { IslandContext, onIslandEvent } from '../../../LaughTale.Client/src/index';

interface SveltePolyglotProps {
    gaugeTitle?: string;
    initialLoad?: number;
}

export default function SveltePolyglotIsland(
    container: HTMLElement,
    props: SveltePolyglotProps,
    ctx?: IslandContext
) {
    const title = props.gaugeTitle || 'System CPU Load';
    let load = props.initialLoad || 35;

    function render() {
        const isWarning = load >= 75;
        container.innerHTML = `
            <div class="p-card p-4 rounded-xl border border-border bg-surface-0 shadow-sm" style="border-top: 3px solid #f59e0b;">
                <div class="flex justify-between items-center mb-2">
                    <div class="flex items-center gap-2">
                        <span style="font-size: 1.25rem;">🧡</span>
                        <h4 class="font-bold text-sm text-surface-900 m-0">${title}</h4>
                    </div>
                    <span class="aura-tag ${isWarning ? 'tag-amber' : 'tag-slate'} text-xs">Svelte 5</span>
                </div>
                <p class="text-xs text-muted mb-2">Architecture: <strong class="text-amber-500">Zero Virtual DOM Runes</strong></p>
                <div class="text-2xl font-mono font-bold my-1 ${isWarning ? 'text-amber-500' : 'text-primary'}">${load}% Capacity</div>
                
                <div class="w-full bg-surface-200 h-2.5 rounded-full overflow-hidden mt-3">
                    <div class="h-full transition-all duration-300 ${isWarning ? 'bg-amber-500' : 'bg-primary-500'}" style="width: ${load}%;"></div>
                </div>
                <p class="text-xs text-muted mt-2">React sales cause load spikes; recovers naturally.</p>
            </div>
        `;
    }

    render();

    const unsubscribe = onIslandEvent('polyglot:sale', () => {
        load = Math.min(98, load + 12);
        render();
    });

    const timer = setInterval(() => {
        if (load > 25) {
            load = Math.max(20, load - 3);
            render();
        }
    }, 1200);

    ctx?.onCleanup(() => {
        unsubscribe?.();
        clearInterval(timer);
    });

    return () => {
        unsubscribe?.();
        clearInterval(timer);
    };
}
