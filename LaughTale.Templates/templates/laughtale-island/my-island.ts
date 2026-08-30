import { resolvePart, applyPart, type PassthroughRecord } from 'laughtale';
import type { IslandContext } from 'laughtale';

export interface MyIslandProps {
    title?: string;
    initialCount?: number;
    enabled?: boolean;
    pt?: PassthroughRecord;
    studioOverrides?: Record<string, any>;
}

/**
 * Custom Island: my-island
 */
export default function MyIsland(container: HTMLElement, props: MyIslandProps = {}, ctx?: IslandContext) {
    let count = props.initialCount ?? 0;

    applyPart(container, 'root', {
        className: 'my-custom-island',
        style: {
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
            padding: '1rem',
            borderRadius: 'var(--lt-radius, 0.5rem)',
            background: 'var(--lt-surface-50, #f8fafc)',
            border: '1px solid var(--lt-surface-200, #e2e8f0)'
        }
    }, props.pt);

    container.innerHTML = `
        <div data-part="header" style="font-weight: 700; color: var(--lt-surface-900, #0f172a);">
            ${props.title || 'My Island'}
        </div>
        <div data-part="body" style="display: flex; align-items: center; gap: 0.5rem;">
            <button type="button" data-part="btn-decrement" style="padding: 0.35rem 0.75rem; border-radius: var(--lt-radius-sm, 0.25rem); border: 1px solid var(--lt-surface-300, #cbd5e1); background: var(--lt-surface-0, #ffffff); cursor: pointer;">-</button>
            <span data-part="count-display" style="font-weight: 600; min-width: 2rem; text-align: center;">${count}</span>
            <button type="button" data-part="btn-increment" style="padding: 0.35rem 0.75rem; border-radius: var(--lt-radius-sm, 0.25rem); border: 1px solid var(--lt-surface-300, #cbd5e1); background: var(--lt-primary-500, #10b981); color: #ffffff; cursor: pointer;">+</button>
        </div>
    `;

    const countEl = container.querySelector<HTMLElement>('[data-part="count-display"]');
    const incBtn = container.querySelector<HTMLButtonElement>('[data-part="btn-increment"]');
    const decBtn = container.querySelector<HTMLButtonElement>('[data-part="btn-decrement"]');

    incBtn?.addEventListener('click', () => {
        count++;
        if (countEl) countEl.textContent = count.toString();
    }, { signal: ctx?.signal });

    decBtn?.addEventListener('click', () => {
        count--;
        if (countEl) countEl.textContent = count.toString();
    }, { signal: ctx?.signal });
}
