/**
 * LaughTale DevTools: in-page overlay (ROADMAP.v5.md DX — DevTools overlay).
 * A floating, dev-only panel modeled on Astro's dev toolbar / Nuxt DevTools - injected directly into
 * the page, not a browser extension. Shows every island's strategy, live hydration state, mount
 * timing, and props size, sourced entirely from the laughtale:diagnostic / laughtale:hydration-error
 * events and getIslandState() that already exist. Only entry point is initDevTools(); everything else
 * is internal. Imports go by direct relative path (not the runtime-core barrel) so this module and its
 * dependents stay isolated to their own dynamically-imported chunk.
 */

import { retryIsland } from '../runtime/hydrator';
import { isDevMode } from '../runtime/error-boundary';
import { injectIslandStyle } from '../runtime/styles';
import { createDevToolsState, type TrackedIsland } from './state';

const INIT_FLAG = '__laughtaleDevToolsInitialized__';
// Above every other floating component in this codebase (tooltip peaks at 100000) so the overlay is
// never hidden behind one of them - this codebase has no shared z-index scale to build on instead.
const Z_INDEX = 2147483000;

const STATE_COLORS: Record<string, string> = {
    idle: 'var(--lt-surface-400, #94a3b8)',
    pending: 'var(--lt-primary-500, #10b981)',
    mounted: 'var(--lt-primary-600, #059669)',
    failed: '#ef4444'
};

const DEVTOOLS_CSS = `
.lt-devtools-fab {
    position: fixed;
    bottom: 1.5rem;
    left: 1.5rem;
    z-index: ${Z_INDEX};
    width: 3rem;
    height: 3rem;
    border-radius: 9999px;
    background: var(--lt-surface-900, #0f172a);
    color: var(--lt-surface-0, #ffffff);
    border: 2px solid var(--lt-primary-500, #10b981);
    box-shadow: 0 10px 25px -5px rgba(0,0,0,0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-family: ui-monospace, monospace;
    font-size: 11px;
    font-weight: 700;
}
.lt-devtools-fab .lt-devtools-badge {
    position: absolute;
    top: -4px;
    right: -4px;
    min-width: 16px;
    height: 16px;
    padding: 0 3px;
    border-radius: 9999px;
    background: var(--lt-surface-500, #64748b);
    color: #fff;
    font-size: 10px;
    line-height: 16px;
    text-align: center;
}
.lt-devtools-fab .lt-devtools-badge.has-failures {
    background: #ef4444;
}
.lt-devtools-panel {
    position: fixed;
    bottom: 5rem;
    left: 1.5rem;
    z-index: ${Z_INDEX};
    width: 340px;
    max-height: 60vh;
    overflow-y: auto;
    background: var(--lt-surface-0, #ffffff);
    color: var(--lt-surface-900, #0f172a);
    border: 1px solid var(--lt-surface-200, #e2e8f0);
    border-radius: var(--lt-radius, 0.5rem);
    box-shadow: 0 10px 25px -5px rgba(0,0,0,0.3);
    font-family: ui-monospace, monospace;
    font-size: 12px;
}
html.dark .lt-devtools-panel, [data-theme="dark"] .lt-devtools-panel, .dark .lt-devtools-panel {
    background: var(--lt-surface-900, #0f172a);
    color: var(--lt-surface-0, #ffffff);
    border-color: var(--lt-surface-700, #334155);
}
.lt-devtools-panel-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.5rem 0.75rem;
    border-bottom: 1px solid var(--lt-surface-200, #e2e8f0);
    font-weight: 700;
}
.lt-devtools-row {
    padding: 0.5rem 0.75rem;
    border-bottom: 1px solid var(--lt-surface-100, #f1f5f9);
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
}
.lt-devtools-row-title {
    display: flex;
    align-items: center;
    gap: 0.35rem;
    font-weight: 700;
}
.lt-devtools-dot {
    width: 8px;
    height: 8px;
    border-radius: 9999px;
    flex-shrink: 0;
}
.lt-devtools-meta {
    color: var(--lt-surface-500, #64748b);
    font-size: 11px;
}
.lt-devtools-warning {
    color: #b45309;
    font-size: 11px;
}
.lt-devtools-retry {
    align-self: flex-start;
    background: #dc2626;
    color: #fff;
    border: none;
    padding: 2px 8px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 11px;
    font-weight: 600;
}
.lt-devtools-outline-toggle {
    display: flex;
    align-items: center;
    gap: 0.35rem;
    padding: 0.4rem 0.75rem;
    border-bottom: 1px solid var(--lt-surface-200, #e2e8f0);
    font-size: 11px;
}
.lt-devtools-island-outline {
    outline-offset: 2px;
}
.lt-devtools-island-label {
    position: fixed;
    background: var(--lt-surface-900, #0f172a);
    color: var(--lt-surface-0, #ffffff);
    font-family: ui-monospace, monospace;
    font-size: 10px;
    padding: 1px 5px;
    border-radius: 3px;
    z-index: ${Z_INDEX};
    pointer-events: none;
    white-space: nowrap;
}
`;

function formatDuration(ms: number | undefined): string {
    if (ms === undefined) return '—';
    return `${ms.toFixed(1)} ms`;
}

function formatPropsSize(size: number | undefined): string {
    if (size === undefined) return '—';
    if (size < 1024) return `~${size} chars (raw JSON length)`;
    return `~${(size / 1024).toFixed(1)} KB (raw JSON length)`;
}

function renderRow(tracked: TrackedIsland): HTMLElement {
    const row = document.createElement('div');
    row.className = 'lt-devtools-row';

    const title = document.createElement('div');
    title.className = 'lt-devtools-row-title';

    const dot = document.createElement('span');
    dot.className = 'lt-devtools-dot';
    dot.style.background = STATE_COLORS[tracked.state] || STATE_COLORS.idle;
    title.appendChild(dot);

    const name = document.createElement('span');
    name.textContent = tracked.name;
    title.appendChild(name);
    row.appendChild(title);

    const meta = document.createElement('div');
    meta.className = 'lt-devtools-meta';
    const parts = [
        `strategy: ${tracked.strategy ?? 'load'}`,
        `state: ${tracked.state}`
    ];
    if (tracked.framework) parts.push(`framework: ${tracked.framework}`);
    if (tracked.state === 'mounted') parts.push(`mount: ${formatDuration(tracked.durationMs)}`);
    if (tracked.propsSize !== undefined) parts.push(`props: ${formatPropsSize(tracked.propsSize)}`);
    meta.textContent = parts.join(' · ');
    row.appendChild(meta);

    for (const warning of Object.values(tracked.warnings)) {
        if (!warning) continue;
        const w = document.createElement('div');
        w.className = 'lt-devtools-warning';
        w.textContent = `⚠ ${warning}`;
        row.appendChild(w);
    }

    if (tracked.state === 'failed') {
        if (tracked.error) {
            const err = document.createElement('div');
            err.className = 'lt-devtools-warning';
            err.textContent = tracked.error.message || String(tracked.error);
            row.appendChild(err);
        }

        const retryBtn = document.createElement('button');
        retryBtn.type = 'button';
        retryBtn.className = 'lt-devtools-retry';
        retryBtn.textContent = 'Retry';
        retryBtn.addEventListener('click', () => {
            void retryIsland(tracked.container);
        });
        row.appendChild(retryBtn);
    }

    return row;
}

function positionLabel(label: HTMLElement, container: HTMLElement): void {
    // getBoundingClientRect() is already viewport-relative, which is exactly what a `position: fixed`
    // label wants - no window.scrollX/scrollY math needed. That matters beyond simplicity: this page's
    // own layout scrolls an inner content pane, not the window, so a scrollY-based offset would have
    // been wrong the moment anything other than the whole document scrolled. Recomputed every animation
    // frame (see the rAF loop below) rather than from scroll/resize event listeners, so it tracks any
    // layout change - inner-container scroll, window scroll, resize - uniformly and without the visible
    // per-event lag a scroll listener has during a fast scroll gesture.
    const rect = container.getBoundingClientRect();
    label.style.left = `${rect.left}px`;
    label.style.top = `${Math.max(0, rect.top - 16)}px`;
}

export function initDevTools(): void {
    if (!isDevMode()) return;
    if ((window as any)[INIT_FLAG]) return;
    (window as any)[INIT_FLAG] = true;

    injectIslandStyle('__laughtale-devtools__', DEVTOOLS_CSS);

    const state = createDevToolsState();

    const fab = document.createElement('button');
    fab.type = 'button';
    fab.className = 'lt-devtools-fab';
    fab.title = 'LaughTale DevTools';
    fab.setAttribute('aria-label', 'Toggle LaughTale DevTools');
    fab.textContent = 'LT';

    const badge = document.createElement('span');
    badge.className = 'lt-devtools-badge';
    fab.appendChild(badge);

    const panel = document.createElement('div');
    panel.className = 'lt-devtools-panel';
    panel.style.display = 'none';

    const header = document.createElement('div');
    header.className = 'lt-devtools-panel-header';
    header.textContent = 'LaughTale DevTools';
    panel.appendChild(header);

    const outlineToggleWrap = document.createElement('label');
    outlineToggleWrap.className = 'lt-devtools-outline-toggle';
    const outlineCheckbox = document.createElement('input');
    outlineCheckbox.type = 'checkbox';
    outlineToggleWrap.appendChild(outlineCheckbox);
    outlineToggleWrap.appendChild(document.createTextNode('Outline islands'));
    panel.appendChild(outlineToggleWrap);

    const rowsContainer = document.createElement('div');
    panel.appendChild(rowsContainer);

    document.body.appendChild(fab);
    document.body.appendChild(panel);

    let panelOpen = false;
    fab.addEventListener('click', () => {
        panelOpen = !panelOpen;
        panel.style.display = panelOpen ? 'block' : 'none';
    });

    const labels = new Map<HTMLElement, HTMLElement>();
    let trackingFrame: number | null = null;

    function stopTrackingLoop(): void {
        if (trackingFrame !== null) {
            cancelAnimationFrame(trackingFrame);
            trackingFrame = null;
        }
    }

    function startTrackingLoop(): void {
        stopTrackingLoop();
        const tick = () => {
            for (const [container, label] of labels) {
                positionLabel(label, container);
            }
            trackingFrame = requestAnimationFrame(tick);
        };
        trackingFrame = requestAnimationFrame(tick);
    }

    function clearOutlines(): void {
        stopTrackingLoop();
        for (const [container, label] of labels) {
            container.classList.remove('lt-devtools-island-outline');
            container.style.outline = '';
            label.remove();
        }
        labels.clear();
    }

    function applyOutlines(): void {
        clearOutlines();
        for (const tracked of state.islands.values()) {
            const container = tracked.container;
            container.classList.add('lt-devtools-island-outline');
            container.style.outline = `2px dashed ${STATE_COLORS[tracked.state] || STATE_COLORS.idle}`;

            const label = document.createElement('div');
            label.className = 'lt-devtools-island-label';
            label.textContent = `${tracked.name} (${tracked.strategy ?? 'load'})`;
            document.body.appendChild(label);
            positionLabel(label, container);
            labels.set(container, label);
        }
        // A per-frame tracking loop, not scroll/resize listeners: this page scrolls an inner content
        // pane rather than the window, and a raw per-scroll-event recompute was visibly laggy during a
        // fast scroll gesture (the label perceptibly trailing the outline). requestAnimationFrame tracks
        // any layout change - inner-container scroll, window scroll, resize, even a dynamic reflow -
        // uniformly, at the browser's own paint cadence, with no event wiring to get wrong.
        startTrackingLoop();
    }

    outlineCheckbox.addEventListener('change', () => {
        if (outlineCheckbox.checked) {
            applyOutlines();
        } else {
            clearOutlines();
        }
    });

    function render(): void {
        const islands = Array.from(state.islands.values());
        const failedCount = islands.filter((i) => i.state === 'failed').length;

        badge.textContent = String(islands.length);
        badge.classList.toggle('has-failures', failedCount > 0);

        rowsContainer.innerHTML = '';
        islands.forEach((tracked) => rowsContainer.appendChild(renderRow(tracked)));

        if (outlineCheckbox.checked) {
            applyOutlines();
        }
    }

    state.subscribe(render);
    state.start();
    render();
}
