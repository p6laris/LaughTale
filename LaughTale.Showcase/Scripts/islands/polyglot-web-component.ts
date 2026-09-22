import type { IslandContext } from '../../../LaughTale.Client/src/index';
import { createWebComponentIsland } from '../../../LaughTale.Client/src/adapters/web-components';

/**
 * ROADMAP.v5.md Part D "New adapters" live demo - a REAL, plain Custom Element (no Lit, no
 * framework, no build step of its own): `customElements`/`HTMLElement`/Shadow DOM are all native
 * browser APIs. Proves the same mechanism a Lit-authored component would use too, since Lit
 * components register via `customElements.define` identically - this adapter can't tell the
 * difference, and doesn't need to.
 */
class LtPolyglotCounterElement extends HTMLElement {
    private _count = 0;
    private _label = 'Web Component Counter';
    private root: ShadowRoot;

    static get observedAttributes() {
        return ['label'];
    }

    constructor() {
        super();
        this.root = this.attachShadow({ mode: 'open' });
    }

    get count() { return this._count; }
    set count(value: number) {
        this._count = value;
        this.render();
    }

    get label() { return this._label; }
    set label(value: string) {
        this._label = value;
        this.render();
    }

    connectedCallback() {
        this.render();
    }

    private render() {
        this.root.innerHTML = `
            <style>
                .card { background: var(--p-surface-0); border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius-xl); padding: 1.5rem; box-shadow: var(--p-shadow-sm); height: 100%; display: flex; flex-direction: column; gap: 0.75rem; }
                .badge { font-size: 0.75rem; color: var(--p-text-muted); }
                .count { font-size: 1.85rem; font-weight: 800; font-family: var(--p-font-mono, monospace); color: var(--p-text-color); }
                button { align-self: flex-start; }
            </style>
            <div class="card">
                <h4 style="margin: 0; color: var(--p-text-color);">${this._label}</h4>
                <span class="badge">Real Custom Element - Shadow DOM, zero runtime download</span>
                <div class="count">${this._count}</div>
                <button type="button" class="p-button p-button-primary" part="button">Increment</button>
                <slot></slot>
            </div>
        `;
        this.root.querySelector('button')?.addEventListener('click', () => {
            this.count = this._count + 1;
        });
    }
}

if (!customElements.get('lt-polyglot-counter')) {
    customElements.define('lt-polyglot-counter', LtPolyglotCounterElement);
}

export interface PolyglotWebComponentProps {
    label?: string;
    initialCount?: number;
}

export default function mount(container: HTMLElement, props: PolyglotWebComponentProps, ctx?: IslandContext) {
    return createWebComponentIsland('lt-polyglot-counter')(container, {
        label: props?.label ?? 'Web Component Counter',
        count: props?.initialCount ?? 0
    }, ctx);
}
