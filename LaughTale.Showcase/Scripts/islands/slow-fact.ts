export interface SlowFactProps {
    fact: string;
    delaySeconds: number;
}

/**
 * ROADMAP.v5.md Part E "Out-of-order streaming" live demo island - deliberately trivial, its only job
 * is to prove the deferred fragment it was streamed in on actually hydrates correctly.
 */
export default function SlowFactIsland(container: HTMLElement, props: SlowFactProps) {
    container.innerHTML = `
        <div style="padding: 1rem 1.25rem; border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius); background: var(--p-surface-0);">
            <span class="aura-tag tag-cyan" style="margin-bottom: 0.5rem; display: inline-block;">Resolved after ${props.delaySeconds}s</span>
            <p style="margin: 0; color: var(--p-surface-700);">${props.fact}</p>
        </div>
    `;
}
