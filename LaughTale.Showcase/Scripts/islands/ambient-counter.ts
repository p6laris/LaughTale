import { IslandContext } from '../../../LaughTale.Client/src/index';

export interface AmbientCounterProps {
    label: string;
}

/**
 * ROADMAP.v5.md Part F "Ambient state pool" live demo island. Two instances of this island appear on
 * the same page, both reading/writing `ctx.state('visitCount')` - server-seeded to 7. Deliberately
 * trivial: its only job is to prove the seed arrived and the store is shared across instances.
 */
export default function AmbientCounterIsland(container: HTMLElement, props: AmbientCounterProps, ctx?: IslandContext) {
    const store = ctx?.state ? ctx.state<number>('visitCount', 0) : undefined;

    function render() {
        const value = store?.get() ?? 0;
        container.innerHTML = `
            <div style="padding: 1rem 1.25rem; border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius); background: var(--p-surface-0); display: flex; align-items: center; justify-content: space-between; gap: 1rem;">
                <div>
                    <span class="aura-tag tag-cyan" style="margin-bottom: 0.35rem; display: inline-block;">${props.label}</span>
                    <p style="margin: 0; color: var(--p-surface-700); font-size: 1.125rem; font-weight: 700;">Count: <span data-count>${value}</span></p>
                </div>
                <button type="button" class="p-button p-button-secondary" data-increment>+1</button>
            </div>
        `;
        container.querySelector('[data-increment]')?.addEventListener('click', () => {
            store?.set((v) => v + 1);
        });
    }

    render();

    const unsubscribe = store?.subscribe(() => render());
    if (unsubscribe) {
        ctx?.onCleanup(unsubscribe);
    }
}
