import { IslandContext } from '../../../LaughTale.Client/src/index';

const SHARED_COUNTER_KEY = 'polyglot-shared-counter';

/**
 * Real, permanent example for ROADMAP.v5.md Part D ("Context & shared store access"). Two
 * independently-hydrated islands (this one and shared-counter-display) read/write the same
 * `ctx.sharedState(...)` store with no props/events wiring between them - see Polyglot.cshtml.
 */
export default function SharedCounterButton(container: HTMLElement, _props: any, ctx?: IslandContext) {
    const store = ctx?.sharedState ? ctx.sharedState<number>(SHARED_COUNTER_KEY, 0) : undefined;

    container.innerHTML = `
        <div class="p-card" style="background: var(--p-surface-0); border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius-xl); padding: 1.5rem; box-shadow: var(--p-shadow-sm); height: 100%; display: flex; flex-direction: column; justify-content: center; align-items: flex-start; gap: 0.75rem;">
            <h4 style="margin: 0; color: var(--p-text-color);">ctx.sharedState — Writer</h4>
            <p style="margin: 0; font-size: 0.8125rem; color: var(--p-text-muted);">Clicking here updates a store this vanilla island never directly told the display island about.</p>
            <button type="button" class="btn-increment p-button p-button-primary" style="font-size: 0.8125rem; padding: 0.5rem 1rem; font-weight: 600;">Increment shared counter</button>
        </div>
    `;

    container.querySelector('.btn-increment')?.addEventListener('click', () => {
        store?.set((prev) => prev + 1);
    }, { signal: ctx?.signal });
}
