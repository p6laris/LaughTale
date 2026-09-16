import { IslandContext } from '../../../LaughTale.Client/src/index';

const SHARED_COUNTER_KEY = 'polyglot-shared-counter';

/**
 * See shared-counter-button.ts - the writer half of this ROADMAP.v5.md Part D example. This
 * island only ever reads/subscribes; it never receives the counter as a prop.
 */
export default function SharedCounterDisplay(container: HTMLElement, _props: any, ctx?: IslandContext) {
    const store = ctx?.sharedState ? ctx.sharedState<number>(SHARED_COUNTER_KEY, 0) : undefined;

    function render() {
        const value = store?.get() ?? 0;
        container.innerHTML = `
            <div class="p-card" style="background: var(--p-surface-0); border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius-xl); padding: 1.5rem; box-shadow: var(--p-shadow-sm); height: 100%; display: flex; flex-direction: column; justify-content: center; align-items: flex-start; gap: 0.5rem;">
                <h4 style="margin: 0; color: var(--p-text-color);">ctx.sharedState — Reader</h4>
                <p style="margin: 0; font-size: 0.8125rem; color: var(--p-text-muted);">Updates live with no page reload and no direct link to the writer island.</p>
                <div style="font-size: 1.85rem; font-weight: 800; font-family: var(--p-font-mono, monospace); color: var(--p-text-color);">${value}</div>
            </div>
        `;
    }

    render();

    const unsubscribe = store?.subscribe(() => render());
    if (unsubscribe) {
        ctx?.onCleanup(unsubscribe);
    }
}
