import type { IslandContext } from '../../../LaughTale.Client/src/index';
import { createSolidIsland } from '../../../LaughTale.Client/src/adapters/solid';
import { createSignal, createEffect } from 'solid-js';

/**
 * ROADMAP.v5.md Part D "New adapters" live demo - a real SolidJS component, mounted with genuine
 * fine-grained reactive props (no vdom, no re-render pass) via `createSolidIsland`. Statically
 * imports 'solid-js' (rather than a nested dynamic import inside the component body) so
 * `createSignal`/`createEffect` run synchronously within `createComponent`'s active reactive owner -
 * this island file is itself already lazy-loaded as its own chunk (`defineIsland('polyglot-solid',
 * () => import('./islands/polyglot-solid'))` in main.ts), so nothing eager is added to the main
 * bundle; `createSolidIsland`'s own dynamic `import('solid-js')` resolves to the exact same shared
 * module instance esbuild already bundled into this chunk.
 */
export interface PolyglotSolidProps {
    label?: string;
    initialCount?: number;
}

function SolidCounter(props: any) {
    const card = document.createElement('div');
    card.style.cssText = 'background: var(--p-surface-0); border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius-xl); padding: 1.5rem; box-shadow: var(--p-shadow-sm); height: 100%; display: flex; flex-direction: column; gap: 0.75rem;';

    const title = document.createElement('h4');
    title.style.cssText = 'margin: 0; color: var(--p-text-color);';

    const badge = document.createElement('span');
    badge.style.cssText = 'font-size: 0.75rem; color: var(--p-text-muted);';
    badge.textContent = 'SolidJS - fine-grained reactivity, no virtual DOM';

    const countEl = document.createElement('div');
    countEl.id = 'solid-count';
    countEl.style.cssText = 'font-size: 1.85rem; font-weight: 800; font-family: var(--p-font-mono, monospace); color: var(--p-text-color);';

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'p-button p-button-primary';
    button.style.alignSelf = 'flex-start';
    button.textContent = 'Increment';

    // Real Solid reactivity: each effect re-runs ONLY because its own tracked read (`props.label`,
    // or the local `count` signal) changed - no parent re-render, no vdom diff, just the one DOM
    // write each actually needs. `props.label` is a genuinely reactive read (createSolidIsland's
    // signal-backed Proxy) - if the server ever calls `island.refresh()` for this island, this
    // title updates in place without Solid ever re-creating `card`.
    const [count, setCount] = createSignal(props.initialCount ?? 0);
    createEffect(() => {
        title.textContent = props.label;
    });
    createEffect(() => {
        countEl.textContent = String(count());
    });
    button.addEventListener('click', () => setCount((c: number) => c + 1));

    card.append(title, badge, countEl, button);
    return card;
}

export default function mount(container: HTMLElement, props: PolyglotSolidProps, ctx?: IslandContext) {
    return createSolidIsland(SolidCounter)(container, {
        label: props?.label ?? 'Solid Counter',
        initialCount: props?.initialCount ?? 0
    }, ctx);
}
