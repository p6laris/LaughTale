import { IslandContext, emitIslandEvent } from '../../../LaughTale.Client/src/index';

interface ReactPolyglotProps {
    title?: string;
    initialScore?: number;
    badge?: string;
}

export default function ReactPolyglotIsland(
    container: HTMLElement,
    props: ReactPolyglotProps,
    ctx?: IslandContext
) {
    let score = props.initialScore || 100;
    const title = props.title || 'React 19 Island';
    const badge = props.badge || 'Sales Emitter';

    function render() {
        container.innerHTML = `
            <div class="p-card p-4 rounded-xl border border-border bg-surface-0 shadow-sm" style="border-top: 3px solid #38bdf8;">
                <div class="flex justify-between items-center mb-2">
                    <div class="flex items-center gap-2">
                        <span style="font-size: 1.25rem;">⚛️</span>
                        <h4 class="font-bold text-sm text-surface-900 m-0">${title}</h4>
                    </div>
                    <span class="aura-tag tag-sky text-xs">${badge}</span>
                </div>
                <p class="text-xs text-muted mb-2">Framework: <strong class="text-sky-500">React 19 / JSX Virtual DOM</strong></p>
                <div class="text-2xl font-mono font-bold text-surface-900 my-2">$${score.toLocaleString()}</div>
                <div class="flex gap-2 mt-3">
                    <button type="button" class="btn-boost p-button p-button-sm p-button-primary" style="font-size: 0.75rem; padding: 0.35rem 0.75rem;">
                        + $250 Sale
                    </button>
                    <button type="button" class="btn-mega p-button p-button-sm p-button-secondary" style="font-size: 0.75rem; padding: 0.35rem 0.75rem;">
                        + $1,000 Bulk
                    </button>
                </div>
            </div>
        `;

        const btnBoost = container.querySelector('.btn-boost') as HTMLButtonElement;
        const btnMega = container.querySelector('.btn-mega') as HTMLButtonElement;

        btnBoost?.addEventListener('click', () => {
            score += 250;
            emitIslandEvent('polyglot:sale', { source: 'React 19', amount: 250, total: score, timestamp: new Date().toLocaleTimeString() });
            render();
        }, { signal: ctx?.signal });

        btnMega?.addEventListener('click', () => {
            score += 1000;
            emitIslandEvent('polyglot:sale', { source: 'React 19', amount: 1000, total: score, timestamp: new Date().toLocaleTimeString() });
            render();
        }, { signal: ctx?.signal });
    }

    render();

    return () => {
        console.log(`[Polyglot] React Island '${ctx?.name}' cleanly torn down.`);
    };
}
