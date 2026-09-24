/** @jsxImportSource solid-js */
import { createSignal } from 'solid-js';

// A real SolidJS component, rendered to HTML by the SSR sidecar and hydrated in the browser. Solid's
// JSX compiler (see esbuild.config.mjs's solidJsx plugin) compiles this file twice - for the server
// bundle (Scripts/ssr-entry.ts) and for the browser island - so its first render must be
// deterministic. The pragma above is for TypeScript only; the project default JSX is React's.
// Fine-grained reactivity: a click updates only the count's text node, and a server refresh of
// `label` (createSolidIsland's reactive props) updates only the title - nothing re-renders.

export interface PolyglotSolidProps {
    label?: string;
    initialCount?: number;
}

export default function PolyglotSolid(props: PolyglotSolidProps) {
    const [count, setCount] = createSignal(props.initialCount ?? 0);

    return (
        <div style="background: var(--p-surface-0); border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius-xl); padding: 1.5rem; box-shadow: var(--p-shadow-sm); height: 100%; display: flex; flex-direction: column; gap: 0.75rem;">
            <h4 style="margin: 0; color: var(--p-text-color);">{props.label ?? 'Solid Counter'}</h4>
            <span style="font-size: 0.75rem; color: var(--p-text-muted);">SolidJS - server-rendered, hydrated, no virtual DOM</span>
            <div id="solid-count" data-testid="solid-count" style="font-size: 1.85rem; font-weight: 800; font-family: var(--p-font-mono, monospace); color: var(--p-text-color);">
                {count()}
            </div>
            <button type="button" data-testid="solid-increment" class="p-button p-button-primary" style="align-self: flex-start;" onClick={() => setCount(c => c + 1)}>
                Increment
            </button>
        </div>
    );
}
