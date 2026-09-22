import type { IslandContext } from '../../../LaughTale.Client/src/index';
import { createAlpineIsland } from '../../../LaughTale.Client/src/adapters/alpine';

/**
 * ROADMAP.v5.md Part D "New adapters" live demo - real Alpine.js `x-*` directives, bound to a
 * props-seeded reactive data object via `createAlpineIsland`. Unlike every other polyglot card,
 * this one's markup is genuine declarative HTML with `x-text`/`x-on:click` attributes already in
 * it - Alpine enhances that existing markup in place, it never renders it from a vdom the way
 * React/Vue/Preact/Solid do (see adapters/alpine.ts's own doc comment).
 */
export interface PolyglotAlpineProps {
    label?: string;
    initialCount?: number;
}

export default function mount(container: HTMLElement, props: PolyglotAlpineProps, ctx?: IslandContext) {
    container.innerHTML = `
        <div style="background: var(--p-surface-0); border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius-xl); padding: 1.5rem; box-shadow: var(--p-shadow-sm); height: 100%; display: flex; flex-direction: column; gap: 0.75rem;">
            <h4 style="margin: 0; color: var(--p-text-color);" x-text="label"></h4>
            <span style="font-size: 0.75rem; color: var(--p-text-muted);">Alpine.js - directive-enhanced markup, no runtime render pass</span>
            <div id="alpine-count" style="font-size: 1.85rem; font-weight: 800; font-family: var(--p-font-mono, monospace); color: var(--p-text-color);" x-text="count"></div>
            <button type="button" class="p-button p-button-primary" style="align-self: flex-start;" x-on:click="increment()">Increment</button>
        </div>
    `;

    return createAlpineIsland((p: PolyglotAlpineProps) => ({
        label: p?.label ?? 'Alpine Counter',
        count: p?.initialCount ?? 0,
        increment() {
            (this as any).count++;
        }
    }))(container, props, ctx);
}
